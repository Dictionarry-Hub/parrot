import { Client, Message, ChannelType } from "discord.js";
import { Event } from "../types";
import { logger } from "@logger";
import { syncDiscordToGithub, getSyncByDiscordThread } from "../carrier";

export const event: Event<"messageCreate"> = {
  name: "messageCreate",
  once: false,

  execute: async (client: Client, ...args: unknown[]) => {
    const message = args[0] as Message;

    // Ignore bot messages
    if (message.author.bot) return;

    // Only handle messages in threads
    if (!message.channel.isThread()) return;

    // Only handle forum post threads
    if (message.channel.parent?.type !== ChannelType.GuildForum) return;

    // Check if this is a synced thread
    const sync = getSyncByDiscordThread(message.channel.id);
    if (!sync) return;

    // Sync to GitHub
    try {
      const attachments = message.attachments.map((a) => a.url);

      await syncDiscordToGithub(
        message.channel.id,
        message.id,
        message.author.username,
        message.content,
        attachments
      );

      logger.debug("Synced Discord message to GitHub", {
        threadId: message.channel.id,
        messageId: message.id,
      });
    } catch (error) {
      logger.error("Failed to sync Discord message to GitHub", {
        error,
        threadId: message.channel.id,
        messageId: message.id,
      });
    }
  },
};
