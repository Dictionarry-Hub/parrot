import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "beta",
  description: "Info about the Profilarr V2 closed beta",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Profilarr V2 Beta")
      .setDescription(
        "V1 is on a feature freeze- all development effort is going into V2, a ground-up rewrite. V2 is currently in **closed beta**."
      )
      .addFields(
        {
          name: "Highlights",
          value: [
            "- Multiple database support",
            "- Improved merge conflict handling",
            "- Automated upgrades & renames",
          ].join("\n"),
        },
        {
          name: "How to Join",
          value:
            "Spots are limited and on a rolling basis. Priority is given to active members and those willing to stress-test merge conflicts. DM **Seraphys** with how you think you can help.",
        }
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
