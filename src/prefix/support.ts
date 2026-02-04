import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "support",
  description: "How to get help",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Getting Help")
      .setDescription(
        "We have two places to get help, depending on what you need."
      )
      .addFields(
        {
          name: "💬 General Questions",
          value:
            "Post in the **questions** forum. Great for setup issues, profile questions, troubleshooting, or when you're not sure what's going on.",
        },
        {
          name: "🐛 Bugs & Feature Requests",
          value:
            "Use `/support` to create a tracked issue that syncs with GitHub. Pick a repo, describe the problem or idea, and a forum post + GitHub issue are created automatically. Replies sync both ways.",
        }
      )
      .setColor(0x5865f2);

    await message.reply({ embeds: [embed] });
  },
});
