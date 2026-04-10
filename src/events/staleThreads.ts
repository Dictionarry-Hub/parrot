import { Client, ChannelType, ForumChannel, ThreadChannel } from "discord.js";
import { Event } from "../types";
import { logger } from "@logger";

const STALE_DAYS = 3;
const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

function getQuestionsForum(client: Client): ForumChannel | null {
  const isDev = process.env.NODE_ENV === "development";
  const channelId = isDev
    ? process.env.QUESTIONS_FORUM_DEV
    : process.env.QUESTIONS_FORUM;

  if (!channelId) return null;

  const channel = client.channels.cache.get(channelId);
  if (!channel || channel.type !== ChannelType.GuildForum) return null;

  return channel as ForumChannel;
}

async function checkStaleThreads(client: Client) {
  const forum = getQuestionsForum(client);
  if (!forum) return;

  const resolvedTag = forum.availableTags.find(
    (t) => t.name.toLowerCase() === "resolved"
  );
  const staleTag = forum.availableTags.find(
    (t) => t.name.toLowerCase() === "stale"
  );

  const { threads } = await forum.threads.fetchActive();
  const cutoff = Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000;

  for (const thread of threads.values()) {
    if (resolvedTag && thread.appliedTags.includes(resolvedTag.id)) continue;
    if (staleTag && thread.appliedTags.includes(staleTag.id)) continue;

    const lastMessageTimestamp =
      thread.lastMessage?.createdTimestamp ??
      (await thread.messages.fetch({ limit: 1 })).first()?.createdTimestamp ??
      thread.createdTimestamp ??
      0;

    if (lastMessageTimestamp > cutoff) continue;

    await thread.send(
      "Closing due to inactivity. Reopen if you still need help."
    );

    const newTags = [...thread.appliedTags];
    if (staleTag && !newTags.includes(staleTag.id)) {
      newTags.push(staleTag.id);
    }
    await thread.setAppliedTags(newTags.slice(0, 5));
    await thread.setArchived(true, "Stale thread");

    logger.info("Closed stale thread", {
      threadId: thread.id,
      name: thread.name,
    });
  }
}

export const event: Event<"clientReady"> = {
  name: "clientReady",
  once: true,
  execute: (client) => {
    // Initial check after startup
    setTimeout(() => checkStaleThreads(client), 10_000);

    // Then check every hour
    setInterval(() => checkStaleThreads(client), CHECK_INTERVAL);

    logger.info("Stale thread checker started", {
      interval: "1 hour",
      staleDays: STALE_DAYS,
    });
  },
};
