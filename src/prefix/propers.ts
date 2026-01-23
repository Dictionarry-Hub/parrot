import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "propers",
  description: "Why isn't the highest scored release being grabbed?",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Why Isn't the Highest Scored Release Being Grabbed?")
      .setDescription(
        "You likely have **Prefer Propers and Repacks** enabled. This forces releases with a proper/repack flag to be grabbed, even if its Custom Format score is not the highest."
      )
      .addFields({
        name: "Solution",
        value:
          "Sync your media management settings within Profilarr to align with the recommended settings for our profiles.",
      })
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
