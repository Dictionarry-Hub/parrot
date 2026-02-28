import { EmbedBuilder } from "discord.js";

export function languageEmbed() {
  return new EmbedBuilder()
    .setTitle("Language Settings")
    .setDescription(
      "By default, our profiles use the **original language** of the movie or series."
    )
    .addFields(
      {
        name: "Single Language User",
        value: "Go to the language tab within the profile to change it.",
      },
      {
        name: "Multiple Language User",
        value:
          "Set the language to **Simple** and **Any**. Then create custom formats for your desired languages, add them to the profile, and set scores.",
      }
    )
    .setFooter({ text: "Note: Original language in CF conditions is coming soon" })
    .setColor(0x57f287);
}
