import {
  Client,
  ForumChannel,
  ThreadChannel,
  EmbedBuilder,
  ChannelType,
} from "discord.js";
import { logger } from "@logger";

export function getForumChannelId(): string | null {
  const isDev = process.env.NODE_ENV === "development";
  const channelId = isDev
    ? process.env.CARRIER_FORUM_CHANNEL_DEV
    : process.env.CARRIER_FORUM_CHANNEL;

  if (!channelId) {
    logger.error("CARRIER_FORUM_CHANNEL not configured", { isDev });
    return null;
  }

  return channelId;
}

export function getForumChannel(client: Client): ForumChannel | null {
  const channelId = getForumChannelId();
  if (!channelId) {
    return null;
  }

  const channel = client.channels.cache.get(channelId);
  if (!channel || channel.type !== ChannelType.GuildForum) {
    logger.error("Carrier forum channel not found or not a forum", { channelId });
    return null;
  }

  return channel as ForumChannel;
}

export interface CreateForumPostOptions {
  client: Client;
  title: string;
  embed: EmbedBuilder;
  tags?: string[];
}

export async function createForumPost(
  options: CreateForumPostOptions
): Promise<ThreadChannel> {
  const { client, title, embed, tags = [] } = options;

  const forum = getForumChannel(client);
  if (!forum) {
    throw new Error("Forum channel not available");
  }

  // Find tag IDs if tags are provided
  const tagIds: string[] = [];
  for (const tagName of tags) {
    const tag = forum.availableTags.find(
      (t) => t.name.toLowerCase() === tagName.toLowerCase()
    );
    if (tag) {
      tagIds.push(tag.id);
    }
  }

  const thread = await forum.threads.create({
    name: title.slice(0, 100), // Discord limit
    message: { embeds: [embed] },
    appliedTags: tagIds.slice(0, 5), // Discord limit
  });

  logger.info("Created forum post", { threadId: thread.id, title });
  return thread;
}

export async function sendToThread(
  client: Client,
  threadId: string,
  content: string | EmbedBuilder
): Promise<void> {
  const thread = await client.channels.fetch(threadId);
  if (!thread || !thread.isThread()) {
    logger.error("Thread not found", { threadId });
    return;
  }

  if (typeof content === "string") {
    await thread.send(content);
  } else {
    await thread.send({ embeds: [content] });
  }
}

export async function archiveThread(
  client: Client,
  threadId: string
): Promise<void> {
  const thread = await client.channels.fetch(threadId);
  if (!thread || !thread.isThread()) {
    logger.error("Thread not found for archiving", { threadId });
    return;
  }

  const threadChannel = thread as ThreadChannel;

  // Update tags: remove open, add closed
  await updateThreadTags(threadChannel, { remove: ["status: open"], add: ["status: closed"] });

  if (!threadChannel.archived) {
    await threadChannel.setArchived(true, "Synced from GitHub issue close");
    logger.info("Archived Discord thread", { threadId });
  }
}

export async function unarchiveThread(
  client: Client,
  threadId: string
): Promise<void> {
  const thread = await client.channels.fetch(threadId);
  if (!thread || !thread.isThread()) {
    logger.error("Thread not found for unarchiving", { threadId });
    return;
  }

  const threadChannel = thread as ThreadChannel;
  if (threadChannel.archived) {
    await threadChannel.setArchived(false, "Synced from GitHub issue reopen");
    logger.info("Unarchived Discord thread", { threadId });
  }

  // Update tags: remove closed, add open
  await updateThreadTags(threadChannel, { remove: ["status: closed"], add: ["status: open"] });
}

async function updateThreadTags(
  thread: ThreadChannel,
  options: { remove?: string[]; add?: string[] }
): Promise<void> {
  const forum = thread.parent;
  if (!forum || forum.type !== ChannelType.GuildForum) return;

  const forumChannel = forum as ForumChannel;
  const currentTags = thread.appliedTags;

  // Build new tag list
  let newTags = [...currentTags];

  // Remove tags
  if (options.remove) {
    for (const tagName of options.remove) {
      const tag = forumChannel.availableTags.find(
        (t) => t.name.toLowerCase() === tagName.toLowerCase()
      );
      if (tag) {
        newTags = newTags.filter((id) => id !== tag.id);
      }
    }
  }

  // Add tags
  if (options.add) {
    for (const tagName of options.add) {
      const tag = forumChannel.availableTags.find(
        (t) => t.name.toLowerCase() === tagName.toLowerCase()
      );
      if (tag && !newTags.includes(tag.id)) {
        newTags.push(tag.id);
      }
    }
  }

  // Apply if changed
  if (newTags.join(",") !== currentTags.join(",")) {
    await thread.setAppliedTags(newTags.slice(0, 5)); // Discord limit
    logger.debug("Updated thread tags", { threadId: thread.id, tags: newTags });
  }
}

export function createGitHubCommentEmbed(
  username: string,
  avatarUrl: string,
  body: string,
  commentUrl: string
): EmbedBuilder {
  // Truncate body if too long
  const truncatedBody = body.length > 1800 ? body.slice(0, 1800) + "..." : body;

  // Author at top, message, view link at bottom
  const description = `${truncatedBody}\n\n[View on GitHub](${commentUrl})`;

  return new EmbedBuilder()
    .setAuthor({
      name: username,
      iconURL: avatarUrl,
      url: `https://github.com/${username}`,
    })
    .setDescription(description)
    .setColor(0x238636); // GitHub green
}
