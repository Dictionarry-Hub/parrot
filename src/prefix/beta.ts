import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

const ANNOUNCEMENT_URL =
  "https://discord.com/channels/1202375791556431892/1202377457760477286/1438618983816237207";

registerPrefixCommand({
  name: "beta",
  description: "Instructions for switching to the beta container",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Switching to Beta")
      .setURL(ANNOUNCEMENT_URL)
      .setDescription(
        "Due to cache issues in the stable container, we recommend switching to beta for now."
      )
      .addFields({
        name: "Steps",
        value: [
          "1. Change `latest` to `beta` in your compose",
          "2. Pull the new image",
          "3. Unlink the database and remove all local files",
          "4. Restart Profilarr",
          "5. Relink the database and resync",
        ].join("\n"),
      })
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
