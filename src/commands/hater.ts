import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

const opinions: Record<string, { use: string; instead: string }> = {
  plex: { use: "Plex", instead: "Jellyfin" },
  emby: { use: "Plex", instead: "Emby" },
  unraid: { use: "Unraid", instead: "anything else" },
  torrents: { use: "Torrents", instead: "Usenet" },
  subs: { use: "Subs", instead: "Dubs" },
};

const opinionKeys = Object.keys(opinions);

const templates = [
  (o: Opinion) => `Seems you are unable to read and understand that **${o.use}** is superior. I'd suggest Netflix if you're illiterate enough to use ${o.instead}.`,
];

type Opinion = { use: string; instead: string };

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const command = {
  data: new SlashCommandBuilder()
    .setName("hater")
    .setDescription("Channel your inner Seraphys")
    .addStringOption((option) =>
      option
        .setName("topic")
        .setDescription("Pick a topic (random if not specified)")
        .setRequired(false)
        .addChoices(
          { name: "Plex vs Jellyfin", value: "plex" },
          { name: "Plex vs Emby", value: "emby" },
          { name: "Upgradinatorr vs Huntarr", value: "upgradinatorr" },
          { name: "Unraid vs anything else", value: "unraid" },
          { name: "Torrents vs Usenet", value: "torrents" },
          { name: "Subs vs Dubs", value: "subs" }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const topic = interaction.options.getString("topic");
    const opinion = topic
      ? opinions[topic]
      : opinions[getRandom(opinionKeys)];
    const template = getRandom(templates);

    const embed = new EmbedBuilder()
      .setColor(0xe5a00d)
      .setDescription(template(opinion));

    await interaction.reply({ embeds: [embed] });
  },
};
