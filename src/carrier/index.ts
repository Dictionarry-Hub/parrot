// Database
export { getDb, closeDb, getSyncByDiscordThread, getSyncByGithubIssue } from "./db";
export type { SyncRecord } from "./db";

// GitHub API
export {
  createIssue,
  createComment,
  closeIssue,
  reopenIssue,
  getBotUsername,
} from "./github";

// Discord helpers
export {
  getForumChannel,
  getForumChannelId,
  createForumPost,
  sendToThread,
  archiveThread,
  unarchiveThread,
  createGitHubCommentEmbed,
} from "./discord";

// Sync service
export {
  createSupport,
  syncDiscordToGithub,
  syncGithubToDiscord,
  syncDiscordClose,
  syncGithubClose,
  syncGithubReopen,
  getSync,
} from "./service";
export type { CreateSupportOptions, CreateSupportResult } from "./service";

// Types and config
export { REPOS, MODALS, DOCS_URL, formatIssueBody } from "./types";
export type {
  RepoName,
  IssueType,
  RepoConfig,
  ModalConfig,
  ModalField,
  GitHubIssueCommentPayload,
  GitHubIssuesPayload,
} from "./types";
