import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "what",
  description: "What's the difference between Dictionarry and Profilarr?",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Dictionarry vs Profilarr")
      .addFields(
        {
          name: "Dictionarry",
          value:
            "A database that powers all relevant regex, custom formats, and profiles for Profilarr and our website.\n[dictionarry.dev](https://dictionarry.dev/)",
        },
        {
          name: "Profilarr",
          value:
            "Configuration management tool for the Arrs that automates importing of custom formats and quality profiles. Designed to be user friendly and make the process as quick and seamless as possible.",
        }
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
