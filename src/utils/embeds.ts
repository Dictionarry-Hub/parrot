import { EmbedBuilder } from "discord.js";
export function languageEmbed() {
  return new EmbedBuilder()
    .setTitle("Language Settings")
    .setDescription(
      "By default, our profiles use the **original language** of the movie or series."
    )
    .addFields(
      {
        name: "Single Original Language User",
        value:
          "You want releases from a single original language. Go to the language tab within the profile to change it.",
      },
      {
        name: "Multiple Original Language User",
        value:
          "You want releases from more than one original language. Set the language to **Simple** and **Any**. Then create custom formats for your desired languages, add them to the profile, and set scores.",
      },
      {
        name: "Multi-Language User",
        value:
          "You want releases with dubbed languages. The Dictionarry Database does not support multi-language releases (i.e. dubbed releases).",
      },
      {
        name: "German & French Users",
        value:
          "German and French profiles are currently in progress in our [TRaSH PCD port](https://github.com/Dictionarry-Hub/trash-pcd). Follow that repo for updates.",
      }
    )
    .setFooter({ text: "Note: Original language in CF conditions is coming soon" })
    .setColor(0x57f287);
}