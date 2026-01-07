import { Client, Collection, REST, Routes } from "discord.js";
import { Command } from "../types";
import { logger } from "@logger";
import { command as ping } from "./ping";
import { command as wizard } from "./wizard";
import { command as hater } from "./hater";

export const commands = new Collection<string, Command>();

[ping, wizard, hater].forEach((cmd) => {
  commands.set(cmd.data.name, cmd);
});

export function registerCommands(client: Client) {
  client.once("clientReady", async () => {
    const rest = new REST().setToken(client.token!);
    const commandData = commands.map((cmd) => cmd.data.toJSON());
    const commandNames = commands.map((cmd) => cmd.data.name);

    try {
      await rest.put(Routes.applicationCommands(client.user!.id), {
        body: commandData,
      });
      logger.info(`Deployed ${commandData.length} commands`, { commands: commandNames });
    } catch (error) {
      logger.error("Failed to deploy commands", { error });
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (command) {
      logger.info(`/${interaction.commandName}`, {
        user: interaction.user.tag,
        guild: interaction.guild?.name,
      });
      await command.execute(interaction);
    }
  });
}
