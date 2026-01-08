import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  AutocompleteInteraction,
} from "discord.js";
import { parse } from "yaml";

const GITHUB_API = "https://api.github.com/repos/Dictionarry-Hub/database/contents/profiles?ref=stable";
const GITHUB_RAW = "https://raw.githubusercontent.com/Dictionarry-Hub/database/stable/profiles";
const WEBSITE_BASE = "https://dictionarry.dev/quality-profile";

interface Profile {
  name: string;
  description: string;
  tags?: string[];
}

let profileCache: string[] = [];
let lastFetch = 0;

async function fetchProfileList(): Promise<string[]> {
  if (Date.now() - lastFetch < 300000 && profileCache.length > 0) {
    return profileCache;
  }

  const res = await fetch(GITHUB_API);
  const files = await res.json();
  profileCache = files
    .filter((f: { name: string }) => f.name.endsWith(".yml"))
    .map((f: { name: string }) => f.name.replace(".yml", ""));
  lastFetch = Date.now();
  return profileCache;
}

async function fetchProfile(name: string): Promise<Profile | null> {
  const res = await fetch(`${GITHUB_RAW}/${encodeURIComponent(name)}.yml`);
  if (!res.ok) return null;
  const text = await res.text();
  return parse(text) as Profile;
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export const command = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Look up a quality profile from Dictionarry")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Profile name")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused().toLowerCase();
    const profiles = await fetchProfileList();
    const filtered = profiles
      .filter((p) => p.toLowerCase().includes(focused))
      .slice(0, 25);
    await interaction.respond(
      filtered.map((p) => ({ name: p, value: p }))
    );
  },

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const name = interaction.options.getString("name", true);

    await interaction.deferReply();

    const profile = await fetchProfile(name);
    if (!profile) {
      await interaction.editReply({ content: `Profile "${name}" not found.` });
      return;
    }

    const slug = toSlug(name);
    const url = `${WEBSITE_BASE}/${slug}`;

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .addFields(
        { name: "Name", value: profile.name || name, inline: false },
        { name: "Description", value: profile.description || "No description available.", inline: false }
      );

    if (profile.tags && profile.tags.length > 0) {
      embed.addFields({ name: "Tags", value: profile.tags.join(", "), inline: false });
    }

    embed.addFields({ name: "Link", value: `View on [dictionarry.dev](${url})`, inline: false });

    await interaction.editReply({ embeds: [embed] });
  },
};
