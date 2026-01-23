import { Message } from "discord.js";

export interface PrefixCommand {
  name: string;
  description: string;
  execute: (message: Message, args: string[]) => Promise<void>;
}

const commands = new Map<string, PrefixCommand>();

export function registerPrefixCommand(command: PrefixCommand) {
  commands.set(command.name, command);
}

export function getPrefixCommand(name: string): PrefixCommand | undefined {
  return commands.get(name);
}

export function getAllPrefixCommands(): PrefixCommand[] {
  return Array.from(commands.values());
}
