// Repository configuration
export type RepoName = "profilarr" | "database" | "website";

export type IssueType = "bug" | "feature";

export interface RepoConfig {
  name: RepoName;
  displayName: string;
  emoji: string;
  emojiId?: string; // For custom Discord emojis
  discussionsUrl?: string; // Optional - not all repos have discussions
  hasSupport: boolean; // Whether to show Support Question option
  types: IssueType[];
}

export const REPOS: Record<RepoName, RepoConfig> = {
  profilarr: {
    name: "profilarr",
    displayName: "Profilarr",
    emoji: "profilarr",
    emojiId: "1464294188773412957",
    discussionsUrl: "https://github.com/Dictionarry-Hub/profilarr/discussions/new?category=q-a",
    hasSupport: true,
    types: ["bug", "feature"],
  },
  database: {
    name: "database",
    displayName: "Database",
    emoji: "database",
    emojiId: "1464294490708906297",
    discussionsUrl: "https://github.com/Dictionarry-Hub/database/discussions/new?category=q-a",
    hasSupport: true,
    types: ["bug", "feature"],
  },
  website: {
    name: "website",
    displayName: "Website",
    emoji: "🌐",
    hasSupport: false,
    types: ["bug", "feature"],
  },
};

export const DOCS_URL = "https://dictionarry.dev";

// Modal field definitions
export interface ModalField {
  id: string;
  label: string;
  placeholder: string;
  style: "short" | "paragraph";
  required: boolean;
}

export interface ModalConfig {
  title: string;
  fields: ModalField[];
}

// Modal configurations per repo + type
export const MODALS: Record<RepoName, Record<IssueType, ModalConfig>> = {
  profilarr: {
    bug: {
      title: "Profilarr Bug Report",
      fields: [
        {
          id: "title",
          label: "Title",
          placeholder: "Brief description of the bug",
          style: "short",
          required: true,
        },
        {
          id: "what_happened",
          label: "What happened and what did you expect?",
          placeholder: "Describe the bug and expected behavior",
          style: "paragraph",
          required: true,
        },
        {
          id: "steps",
          label: "Steps to reproduce",
          placeholder: "1. Go to...\n2. Click on...\n3. See error...",
          style: "paragraph",
          required: true,
        },
        {
          id: "version",
          label: "Profilarr version",
          placeholder: "e.g., 2.1.0",
          style: "short",
          required: true,
        },
        {
          id: "environment",
          label: "Release channel + Installation method",
          placeholder: "e.g., Stable, Docker",
          style: "short",
          required: true,
        },
      ],
    },
    feature: {
      title: "Profilarr Feature Request",
      fields: [
        {
          id: "title",
          label: "Title",
          placeholder: "Brief description of the feature",
          style: "short",
          required: true,
        },
        {
          id: "what",
          label: "What do you want?",
          placeholder: "Describe the feature you'd like to see",
          style: "paragraph",
          required: true,
        },
        {
          id: "why",
          label: "Why do you want it?",
          placeholder: "Explain your use case and why this would be valuable",
          style: "paragraph",
          required: true,
        },
        {
          id: "workarounds",
          label: "Have you tried any workarounds?",
          placeholder: "Describe any alternatives you've tried",
          style: "paragraph",
          required: false,
        },
        {
          id: "help",
          label: "Would you help implement this?",
          placeholder: "yes / no / maybe",
          style: "short",
          required: false,
        },
      ],
    },
  },
  database: {
    bug: {
      title: "Database Bug Report",
      fields: [
        {
          id: "title",
          label: "Title",
          placeholder: "Brief description of the bug",
          style: "short",
          required: true,
        },
        {
          id: "which",
          label: "Which custom format/profile/regex?",
          placeholder: "e.g., Remux Tier 1, DV HDR10+, x265",
          style: "short",
          required: true,
        },
        {
          id: "whats_wrong",
          label: "What's wrong?",
          placeholder: "Include release title if matching issue",
          style: "paragraph",
          required: true,
        },
        {
          id: "release",
          label: "Release title (if matching issue)",
          placeholder: "e.g., Movie.2024.2160p.UHD.BluRay.REMUX...",
          style: "short",
          required: false,
        },
        {
          id: "context",
          label: "Additional context",
          placeholder: "Screenshots, regex101 links, etc.",
          style: "paragraph",
          required: false,
        },
      ],
    },
    feature: {
      title: "Database Feature Request",
      fields: [
        {
          id: "title",
          label: "Title",
          placeholder: "Brief description of the feature",
          style: "short",
          required: true,
        },
        {
          id: "what",
          label: "What do you want?",
          placeholder: "New profile, New custom format, New regex, Changes to existing, Other",
          style: "short",
          required: true,
        },
        {
          id: "description",
          label: "Description",
          placeholder: "Describe what you want in detail",
          style: "paragraph",
          required: true,
        },
        {
          id: "why",
          label: "Why is this useful?",
          placeholder: "Explain your use case",
          style: "paragraph",
          required: false,
        },
      ],
    },
  },
  website: {
    bug: {
      title: "Website Bug Report",
      fields: [
        {
          id: "title",
          label: "Title",
          placeholder: "Brief description of the bug",
          style: "short",
          required: true,
        },
        {
          id: "area",
          label: "What area?",
          placeholder: "Profile Wizard, Quality Profile pages, Custom Format pages, Regex pages, Getting Started, Wiki/Docs, Search, Navigation/UI, Other",
          style: "short",
          required: true,
        },
        {
          id: "url",
          label: "Page URL",
          placeholder: "https://dictionarry.dev/...",
          style: "short",
          required: false,
        },
        {
          id: "whats_wrong",
          label: "What's wrong?",
          placeholder: "Describe the issue",
          style: "paragraph",
          required: true,
        },
        {
          id: "steps",
          label: "Steps to reproduce",
          placeholder: "1. Go to...\n2. Click on...\n3. See error...",
          style: "paragraph",
          required: true,
        },
      ],
    },
    feature: {
      title: "Website Feature Request",
      fields: [
        {
          id: "title",
          label: "Title",
          placeholder: "Brief description of the feature",
          style: "short",
          required: true,
        },
        {
          id: "area",
          label: "What area?",
          placeholder: "Profile Wizard, Content pages, Getting Started, Wiki/Docs, Search, Navigation/UI, Other",
          style: "short",
          required: true,
        },
        {
          id: "what",
          label: "What do you want?",
          placeholder: "Describe the feature you'd like to see",
          style: "paragraph",
          required: true,
        },
        {
          id: "why",
          label: "Why is this useful?",
          placeholder: "Explain your use case",
          style: "paragraph",
          required: false,
        },
      ],
    },
  },
};

// GitHub issue body templates
export function formatIssueBody(
  repo: RepoName,
  type: IssueType,
  fields: Record<string, string>,
  discordUser: string,
  discordThreadUrl: string
): string {
  const config = MODALS[repo][type];

  let body = "";

  for (const field of config.fields) {
    if (field.id === "title") continue; // Title is separate
    const value = fields[field.id];
    if (!value) continue; // Skip empty fields entirely
    body += `### ${field.label}\n\n${value}\n\n`;
  }

  body += `<sub>🦜 Submitted via Discord by **${discordUser}** · `;
  body += `[View thread](${discordThreadUrl}) · `;
  body += `Replies sync automatically</sub>`;

  return body;
}

// GitHub webhook payload types
export interface GitHubIssueCommentPayload {
  action: "created" | "edited" | "deleted";
  issue: {
    number: number;
    title: string;
    html_url: string;
    state: "open" | "closed";
  };
  comment: {
    id: number;
    body: string;
    html_url: string;
    user: {
      login: string;
      avatar_url: string;
    };
  };
  repository: {
    name: string;
    full_name: string;
  };
}

export interface GitHubIssuesPayload {
  action: "opened" | "closed" | "reopened" | "edited" | "deleted";
  issue: {
    number: number;
    title: string;
    html_url: string;
    state: "open" | "closed";
  };
  repository: {
    name: string;
    full_name: string;
  };
}
