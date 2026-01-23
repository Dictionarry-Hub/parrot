import { Client, EmbedBuilder } from "discord.js";
import { logger } from "@logger";
import {
  createSync,
  getSyncByDiscordThread,
  getSyncByGithubIssue,
  markSyncClosed,
  SyncRecord,
} from "./db";
import {
  createIssue,
  createComment,
  closeIssue,
  reopenIssue,
  getBotUsername,
} from "./github";
import {
  createForumPost,
  sendToThread,
  archiveThread,
  unarchiveThread,
  createGitHubCommentEmbed,
  getForumChannelId,
} from "./discord";
import {
  RepoName,
  IssueType,
  REPOS,
  formatIssueBody,
} from "./types";

// Marker for anti-loop detection
const DISCORD_MARKER_PREFIX = "<!-- carrier:discord:";
const DISCORD_MARKER_SUFFIX = " -->";

export interface CreateSupportOptions {
  client: Client;
  repo: RepoName;
  type: IssueType;
  title: string;
  fields: Record<string, string>;
  discordUserId: string;
  discordUsername: string;
  discordAvatarUrl: string;
  guildId: string;
}

export interface CreateSupportResult {
  githubIssueUrl: string;
  githubIssueNumber: number;
  discordThreadId: string;
  discordThreadUrl: string;
}

export async function createSupport(
  options: CreateSupportOptions
): Promise<CreateSupportResult> {
  const {
    client,
    repo,
    type,
    title,
    fields,
    discordUserId,
    discordUsername,
    discordAvatarUrl,
    guildId,
  } = options;

  logger.info("Creating support request", { repo, type, title, user: discordUsername });

  // 1. Create Discord forum post first (so we have the URL for the GitHub issue)
  const repoConfig = REPOS[repo];
  const typeTag = type === "bug" ? "type: bug" : "type: feature";

  // Format the initial message for Discord as an embed
  const discordEmbed = formatDiscordEmbed(type, fields, discordUsername, discordAvatarUrl);

  const thread = await createForumPost({
    client,
    title,
    embed: discordEmbed,
    tags: ["status: open", typeTag, `repo: ${repo}`],
  });

  const discordThreadUrl = `https://discord.com/channels/${guildId}/${thread.id}`;

  // 2. Create GitHub issue
  const labels = [`type: ${type}`, "source: discord"];
  const issueBody = formatIssueBody(repo, type, fields, discordUsername, discordThreadUrl);

  const issue = await createIssue({
    repo,
    title,
    body: issueBody,
    labels,
  });

  // 3. Update the original embed with GitHub link
  const starterMessage = await thread.fetchStarterMessage();
  if (starterMessage) {
    discordEmbed.addFields({
      name: "\u200b", // Zero-width space for empty name
      value: `[View on GitHub (#${issue.number})](${issue.html_url})`,
      inline: false,
    });
    await starterMessage.edit({ embeds: [discordEmbed] });
  }

  // 4. Store mapping in database
  const forumChannelId = getForumChannelId()!;

  createSync({
    discord_thread_id: thread.id,
    discord_channel_id: forumChannelId,
    discord_guild_id: guildId,
    github_issue_number: issue.number,
    github_repo: repo,
    github_issue_url: issue.html_url,
    title,
    issue_type: type,
    created_by: discordUserId,
    created_at: Date.now(),
  });

  logger.info("Support request created", {
    repo,
    type,
    githubIssue: issue.number,
    discordThread: thread.id,
  });

  return {
    githubIssueUrl: issue.html_url,
    githubIssueNumber: issue.number,
    discordThreadId: thread.id,
    discordThreadUrl,
  };
}

function formatDiscordEmbed(
  type: IssueType,
  fields: Record<string, string>,
  discordUsername: string,
  discordAvatarUrl: string
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(type === "bug" ? 0xed4245 : 0x57f287) // Red for bugs, green for features
    .setAuthor({ name: discordUsername, iconURL: discordAvatarUrl })
    .setTimestamp();

  // Add fields to the embed
  for (const [key, value] of Object.entries(fields)) {
    if (key === "title" || !value) continue;
    const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    // Use inline for short fields, regular for longer ones
    const inline = value.length < 50;
    embed.addFields({ name: label, value: value.slice(0, 1024), inline });
  }

  return embed;
}

// Discord message → GitHub comment
export async function syncDiscordToGithub(
  threadId: string,
  messageId: string,
  username: string,
  content: string,
  attachments: string[]
): Promise<void> {
  const sync = getSyncByDiscordThread(threadId);
  if (!sync) {
    return; // Not a synced thread
  }

  // Format the comment with content first, author at bottom
  let body = content;

  // Add attachments if any
  if (attachments.length > 0) {
    body += "\n\n**Attachments:**\n";
    for (const url of attachments) {
      body += `- ${url}\n`;
    }
  }

  // Add author footer and marker
  body += `\n\n<sub>🦜 **${username}** via Discord</sub>`;
  body += `\n${DISCORD_MARKER_PREFIX}${messageId}${DISCORD_MARKER_SUFFIX}`;

  await createComment({
    repo: sync.github_repo,
    issueNumber: sync.github_issue_number,
    body,
  });

  logger.debug("Synced Discord message to GitHub", {
    threadId,
    issueNumber: sync.github_issue_number,
  });
}

// GitHub comment → Discord message
export async function syncGithubToDiscord(
  client: Client,
  repo: string,
  issueNumber: number,
  username: string,
  avatarUrl: string,
  body: string,
  commentUrl: string
): Promise<void> {
  const sync = getSyncByGithubIssue(repo, issueNumber);
  if (!sync) {
    return; // Not a synced issue
  }

  // Check if this is our own bot's comment (anti-loop)
  const botUsername = await getBotUsername();
  if (username === botUsername) {
    logger.debug("Ignoring bot's own comment", { repo, issueNumber });
    return;
  }

  // Check for Discord marker (anti-loop)
  if (body.includes(DISCORD_MARKER_PREFIX)) {
    logger.debug("Ignoring comment with Discord marker", { repo, issueNumber });
    return;
  }

  // Send to Discord
  const embed = createGitHubCommentEmbed(username, avatarUrl, body, commentUrl);
  await sendToThread(client, sync.discord_thread_id, embed);

  logger.debug("Synced GitHub comment to Discord", {
    threadId: sync.discord_thread_id,
    issueNumber,
  });
}

// Discord thread closed → GitHub issue closed
export async function syncDiscordClose(threadId: string): Promise<void> {
  const sync = getSyncByDiscordThread(threadId);
  if (!sync) {
    return;
  }

  if (sync.closed_at) {
    return; // Already closed
  }

  await closeIssue(sync.github_repo, sync.github_issue_number);
  markSyncClosed(sync.id);

  logger.info("Synced Discord close to GitHub", {
    threadId,
    issueNumber: sync.github_issue_number,
  });
}

// GitHub issue closed → Discord thread archived
export async function syncGithubClose(
  client: Client,
  repo: string,
  issueNumber: number
): Promise<void> {
  const sync = getSyncByGithubIssue(repo, issueNumber);
  if (!sync) {
    return;
  }

  if (sync.closed_at) {
    return; // Already closed
  }

  await archiveThread(client, sync.discord_thread_id);
  markSyncClosed(sync.id);

  logger.info("Synced GitHub close to Discord", {
    threadId: sync.discord_thread_id,
    issueNumber,
  });
}

// GitHub issue reopened → Discord thread unarchived
export async function syncGithubReopen(
  client: Client,
  repo: string,
  issueNumber: number
): Promise<void> {
  const sync = getSyncByGithubIssue(repo, issueNumber);
  if (!sync) {
    return;
  }

  await unarchiveThread(client, sync.discord_thread_id);

  // Clear the closed_at timestamp (would need to add this to db.ts)
  // For now, we'll just log it
  logger.info("Synced GitHub reopen to Discord", {
    threadId: sync.discord_thread_id,
    issueNumber,
  });
}

// Helper to get sync record
export function getSync(threadId: string): SyncRecord | undefined {
  return getSyncByDiscordThread(threadId);
}
