import { Message } from "discord.js";
import { registerPrefixCommand } from "./registry";
import { languageEmbed } from "../utils/embeds";

registerPrefixCommand({
  name: "language",
  description: "How to configure language settings",
  execute: async (message: Message) => {
    await message.reply({ embeds: [languageEmbed()] });
  },
});
