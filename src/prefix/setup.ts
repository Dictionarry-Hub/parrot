import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";
registerPrefixCommand({
  name: "setup",
  description: "How to install and link the database",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Installation & Setup")
      .setURL("https://v2.dictionarry.dev/profilarr-setup/installation")
      .setDescription(
        "Visit our [documentation](https://v2.dictionarry.dev/profilarr-setup/installation) for installation instructions. Once Profilarr is running, the in-app onboarding will walk you through linking databases and connecting your Arrs."
      )
      .setColor(0x57f287);
    await message.reply({ embeds: [embed] });
  },
});