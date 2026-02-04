import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand, getAllPrefixCommands } from "./registry";

registerPrefixCommand({
  name: "help",
  description: "List all available commands",
  execute: async (message: Message) => {
    const commands = getAllPrefixCommands().sort((a, b) => a.name.localeCompare(b.name));

    const embed = new EmbedBuilder()
      .setTitle("Commands")
      .setDescription(
        commands.map((cmd) => `\`!${cmd.name}\` - ${cmd.description}`).join("\n")
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
