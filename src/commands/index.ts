import { Client, Collection } from "discord.js";
import { Command } from "../types";
import { command as ping } from "./ping";

const commands = new Collection<string, Command>();

[ping].forEach((cmd) => {
  commands.set(cmd.name, cmd);
});

export function registerCommands(client: Client) {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (command) {
      await command.execute(interaction);
    }
  });
}
