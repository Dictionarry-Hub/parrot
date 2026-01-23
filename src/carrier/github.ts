import { logger } from "@logger";

const GITHUB_API = "https://api.github.com";
const ORG = process.env.CARRIER_ORG || "Dictionarry-Hub";

function getToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is required for Carrier");
  }
  return token;
}

async function githubFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${GITHUB_API}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    logger.error("GitHub API error", {
      status: response.status,
      endpoint,
      error,
    });
    throw new Error(`GitHub API error: ${response.status} - ${error}`);
  }

  return response.json() as Promise<T>;
}

// Types
export interface GitHubIssue {
  number: number;
  html_url: string;
  title: string;
  state: "open" | "closed";
}

export interface GitHubComment {
  id: number;
  html_url: string;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface CreateIssueOptions {
  repo: string;
  title: string;
  body: string;
  labels?: string[];
}

export interface CreateCommentOptions {
  repo: string;
  issueNumber: number;
  body: string;
}

// API Methods
export async function createIssue(options: CreateIssueOptions): Promise<GitHubIssue> {
  const { repo, title, body, labels = [] } = options;

  logger.info("Creating GitHub issue", { repo, title });

  try {
    // Try with labels first
    const issue = await githubFetch<GitHubIssue>(`/repos/${ORG}/${repo}/issues`, {
      method: "POST",
      body: JSON.stringify({ title, body, labels }),
    });

    logger.info("GitHub issue created", { repo, number: issue.number });
    return issue;
  } catch (error) {
    // If labels failed, retry without them
    if (labels.length > 0 && String(error).includes("label")) {
      logger.warn("Failed to create issue with labels, retrying without", { repo, labels });

      const issue = await githubFetch<GitHubIssue>(`/repos/${ORG}/${repo}/issues`, {
        method: "POST",
        body: JSON.stringify({ title, body }),
      });

      logger.info("GitHub issue created (without labels)", { repo, number: issue.number });
      return issue;
    }
    throw error;
  }
}

export async function createComment(options: CreateCommentOptions): Promise<GitHubComment> {
  const { repo, issueNumber, body } = options;

  logger.debug("Creating GitHub comment", { repo, issueNumber });

  return githubFetch<GitHubComment>(
    `/repos/${ORG}/${repo}/issues/${issueNumber}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    }
  );
}

export async function closeIssue(repo: string, issueNumber: number): Promise<GitHubIssue> {
  logger.info("Closing GitHub issue", { repo, issueNumber });

  return githubFetch<GitHubIssue>(`/repos/${ORG}/${repo}/issues/${issueNumber}`, {
    method: "PATCH",
    body: JSON.stringify({ state: "closed" }),
  });
}

export async function reopenIssue(repo: string, issueNumber: number): Promise<GitHubIssue> {
  logger.info("Reopening GitHub issue", { repo, issueNumber });

  return githubFetch<GitHubIssue>(`/repos/${ORG}/${repo}/issues/${issueNumber}`, {
    method: "PATCH",
    body: JSON.stringify({ state: "open" }),
  });
}

// Get the authenticated user (for anti-loop detection)
let cachedBotUsername: string | null = null;

export async function getBotUsername(): Promise<string> {
  if (cachedBotUsername) return cachedBotUsername;

  const user = await githubFetch<{ login: string }>("/user");
  cachedBotUsername = user.login;
  return cachedBotUsername;
}
