import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "anime",
  description: "Info about the anime profile",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Anime Profile")
      .setDescription(
        "The anime profile is actively being developed and should be released within the next few months.\n\n" +
        "In the meantime, you can use this community database which includes an anime profile:"
      )
      .addFields({
        name: "Temporary Solution",
        value: "[serversathome/profilarr](https://github.com/serversathome/profilarr)",
      })
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
