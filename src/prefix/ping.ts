import { Message } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "ping",
  description: "Check if the bot is alive",
  execute: async (message: Message) => {
    const latency = Date.now() - message.createdTimestamp;
    await message.reply(`Pong! ${latency}ms`);
  },
});
