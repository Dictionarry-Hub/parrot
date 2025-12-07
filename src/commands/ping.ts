import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong"),
  execute: async (interaction) => {
    await interaction.reply("Pong!");
  },
};
