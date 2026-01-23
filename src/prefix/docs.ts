import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "docs",
  description: "Link to documentation",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Documentation")
      .setURL("https://dictionarry.dev")
      .setDescription(
        "Visit our documentation for guides, setup instructions, and profile information."
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
