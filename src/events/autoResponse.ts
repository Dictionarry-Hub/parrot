import { Client, Message, ChannelType } from "discord.js";
import { Event } from "../types";
import { logger } from "@logger";
import { languageEmbed } from "../utils/embeds";

const respondedThreads = new Set<string>();

function getForumChannelIds(): string[] {
  const isDev = process.env.NODE_ENV === "development";
  const ids: string[] = [];

  if (isDev) {
    if (process.env.CARRIER_FORUM_CHANNEL_DEV)
      ids.push(process.env.CARRIER_FORUM_CHANNEL_DEV);
  } else {
    if (process.env.QUESTIONS_FORUM) ids.push(process.env.QUESTIONS_FORUM);
    if (process.env.CARRIER_FORUM_CHANNEL)
      ids.push(process.env.CARRIER_FORUM_CHANNEL);
  }

  return ids;
}

export const event: Event<"messageCreate"> = {
  name: "messageCreate",
  once: false,
  execute: async (client: Client, ...args: unknown[]) => {
    const message = args[0] as Message;

    if (message.author.bot) return;
    if (!message.channel.isThread()) return;
    if (message.channel.parent?.type !== ChannelType.GuildForum) return;

    const forumChannelIds = getForumChannelIds();
    if (!forumChannelIds.includes(message.channel.parentId!)) return;

    // Only respond once per thread
    if (respondedThreads.has(message.channel.id)) return;

    const content = message.content.toLowerCase();
    if (!/\blanguage\b/.test(content)) return;

    respondedThreads.add(message.channel.id);

    try {
      await message.reply({
        content: "This might be useful to you:",
        embeds: [languageEmbed()],
        allowedMentions: { repliedUser: false },
      });

      logger.info("Auto-responded with language info", {
        threadId: message.channel.id,
        triggeredBy: message.author.username,
      });
    } catch (error) {
      logger.error("Failed to send language auto-response", {
        error,
        threadId: message.channel.id,
      });
    }
  },
};
