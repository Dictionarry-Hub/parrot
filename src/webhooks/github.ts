import { Client } from "discord.js";
import { logger } from "@logger";
import {
  GitHubIssueCommentPayload,
  GitHubIssuesPayload,
  syncGithubToDiscord,
  syncGithubClose,
  syncGithubReopen,
} from "../carrier";

export type GitHubWebhookPayload = GitHubIssueCommentPayload | GitHubIssuesPayload;

export function isIssueCommentPayload(
  payload: GitHubWebhookPayload
): payload is GitHubIssueCommentPayload {
  return "comment" in payload;
}

export function isIssuesPayload(
  payload: GitHubWebhookPayload
): payload is GitHubIssuesPayload {
  return !("comment" in payload) && "issue" in payload;
}

export async function handleGitHubWebhook(
  client: Client,
  payload: GitHubWebhookPayload,
  event: string
): Promise<void> {
  const repoName = payload.repository.name;

  logger.debug("Received GitHub webhook", { event, repo: repoName });

  // Handle issue comments
  if (event === "issue_comment" && isIssueCommentPayload(payload)) {
    if (payload.action === "created") {
      await syncGithubToDiscord(
        client,
        repoName,
        payload.issue.number,
        payload.comment.user.login,
        payload.comment.user.avatar_url,
        payload.comment.body,
        payload.comment.html_url
      );
    }
    return;
  }

  // Handle issue state changes
  if (event === "issues" && isIssuesPayload(payload)) {
    if (payload.action === "closed") {
      await syncGithubClose(client, repoName, payload.issue.number);
    } else if (payload.action === "reopened") {
      await syncGithubReopen(client, repoName, payload.issue.number);
    }
    return;
  }

  logger.debug("Unhandled GitHub webhook event", { event, action: payload.action });
}
