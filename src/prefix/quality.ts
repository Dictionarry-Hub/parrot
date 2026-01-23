import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "quality",
  description: "Min/max quality settings",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Quality Settings")
      .setDescription(
        "All recommended settings are already present in Profilarr under the **Media Management** settings tab.\n\n" +
        "We advise syncing those settings to ensure your experience with the profiles matches how they were designed."
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
