import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "sync",
  description: "Fix database sync issues",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Database Sync Issues")
      .setDescription("If your database isn't syncing properly, try these steps:")
      .addFields({
        name: "Steps",
        value: [
          "1. Unlink the database",
          "2. Remove all local files",
          "3. Relink the database",
        ].join("\n"),
      })
      .setFooter({ text: "If this doesn't help, open a support request with /support" })
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
