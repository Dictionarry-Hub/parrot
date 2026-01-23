import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "support",
  description: "How to get support",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Getting Support")
      .setDescription("Use the `/support` slash command to create a support request.")
      .addFields(
        {
          name: "How It Works",
          value:
            "1. Run `/support` and select the relevant repo\n" +
            "2. Choose bug report or feature request\n" +
            "3. Fill out the form with details\n" +
            "4. A forum post and GitHub issue are created automatically",
        },
        {
          name: "Two-Way Sync",
          value:
            "Replies in the Discord thread sync to GitHub, and GitHub comments sync back here. You can follow along on either platform.",
        }
      )
      .setFooter({ text: "For general questions, check the FAQ commands with !help" })
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
