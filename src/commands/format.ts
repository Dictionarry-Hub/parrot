import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  AutocompleteInteraction,
} from "discord.js";
import { parse } from "yaml";

const GITHUB_API = "https://api.github.com/repos/Dictionarry-Hub/database/contents/custom_formats?ref=stable";
const GITHUB_RAW = "https://raw.githubusercontent.com/Dictionarry-Hub/database/stable/custom_formats";
const WEBSITE_BASE = "https://dictionarry.dev/custom-format";

interface CustomFormat {
  name: string;
  description: string;
  tags?: string[];
}

let formatCache: string[] = [];
let lastFetch = 0;

async function fetchFormatList(): Promise<string[]> {
  if (Date.now() - lastFetch < 300000 && formatCache.length > 0) {
    return formatCache;
  }

  const res = await fetch(GITHUB_API);
  const files = await res.json();
  formatCache = files
    .filter((f: { name: string }) => f.name.endsWith(".yml"))
    .map((f: { name: string }) => f.name.replace(".yml", ""));
  lastFetch = Date.now();
  return formatCache;
}

async function fetchFormat(name: string): Promise<CustomFormat | null> {
  const res = await fetch(`${GITHUB_RAW}/${encodeURIComponent(name)}.yml`);
  if (!res.ok) return null;
  const text = await res.text();
  return parse(text) as CustomFormat;
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export const command = {
  data: new SlashCommandBuilder()
    .setName("format")
    .setDescription("Look up a custom format from Dictionarry")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Custom format name")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused().toLowerCase();
    const formats = await fetchFormatList();
    const filtered = formats
      .filter((f) => f.toLowerCase().includes(focused))
      .slice(0, 25);
    await interaction.respond(
      filtered.map((f) => ({ name: f, value: f }))
    );
  },

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const name = interaction.options.getString("name", true);

    await interaction.deferReply();

    const format = await fetchFormat(name);
    if (!format) {
      await interaction.editReply({ content: `Custom format "${name}" not found.` });
      return;
    }

    const slug = toSlug(name);
    const url = `${WEBSITE_BASE}/${slug}`;

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .addFields(
        { name: "Name", value: format.name || name, inline: false },
        { name: "Description", value: format.description || "No description available.", inline: false }
      );

    if (format.tags && format.tags.length > 0) {
      embed.addFields({ name: "Tags", value: format.tags.join(", "), inline: false });
    }

    embed.addFields({ name: "Link", value: `View on [dictionarry.dev](${url})`, inline: false });

    await interaction.editReply({ embeds: [embed] });
  },
};
