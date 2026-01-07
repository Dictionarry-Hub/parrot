import {
  Client,
  ChatInputCommandInteraction,
  ClientEvents,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute: (client: Client, ...args: unknown[]) => void;
}

// Webhook types
export interface Commit {
  message: string;
  sha: string;
  author: string;
  url: string;
}

export interface ChangelogPayload {
  type: "changelog";
  channel: string;
  data: {
    repo: string;
    branch: string;
    author: string;
    commits: Commit[];
  };
}

export interface RebuildPayload {
  type: "rebuild";
  channel: string;
  data: {
    service: string;
    success: boolean;
    duration?: number;
    error?: string;
  };
}

export type WebhookPayload = ChangelogPayload | RebuildPayload;
