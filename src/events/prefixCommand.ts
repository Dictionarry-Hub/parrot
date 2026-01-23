import { Client, Message } from "discord.js";
import { Event } from "../types";
import { logger } from "@logger";
import { getPrefixCommand } from "../prefix";

const PREFIX = "!";

export const event: Event<"messageCreate"> = {
  name: "messageCreate",
  once: false,

  execute: async (client: Client, ...args: unknown[]) => {
    const message = args[0] as Message;

    // Ignore bots
    if (message.author.bot) return;

    // Check for prefix
    if (!message.content.startsWith(PREFIX)) return;

    // Parse command and args
    const content = message.content.slice(PREFIX.length).trim();
    const [commandName, ...args2] = content.split(/\s+/);

    if (!commandName) return;

    const command = getPrefixCommand(commandName.toLowerCase());
    if (!command) return;

    try {
      await command.execute(message, args2);
      logger.debug("Executed prefix command", {
        command: commandName,
        user: message.author.username,
      });
    } catch (error) {
      logger.error("Failed to execute prefix command", {
        command: commandName,
        error,
      });
    }
  },
};
