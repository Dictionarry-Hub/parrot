import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { Command } from "../types";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("wizard")
    .setDescription("Get a link to the Dictionarry profile wizard"),
  execute: async (interaction) => {
    const button = new ButtonBuilder()
      .setLabel("Open Profile Wizard")
      .setStyle(ButtonStyle.Link)
      .setURL("https://dictionarry.dev/quality-profile?section=profile-wizard")
      .setEmoji("🧙");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await interaction.reply({ components: [row] });
  },
};
