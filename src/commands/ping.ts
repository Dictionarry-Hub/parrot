import { Command } from "../types";

export const command: Command = {
  name: "ping",
  description: "Replies with pong",
  execute: async (interaction) => {
    await interaction.reply("Pong!");
  },
};
