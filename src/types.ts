import { Client, ChatInputCommandInteraction, ClientEvents } from "discord.js";

export interface Command {
  name: string;
  description: string;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute: (client: Client, ...args: unknown[]) => void;
}
