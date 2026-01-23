import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "setup",
  description: "How to install and link the database",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Installation & Setup")
      .setURL("https://dictionarry.dev/profilarr-setup/installation")
      .setDescription(
        "Visit our website for detailed instructions on how to install Profilarr and link the database."
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
