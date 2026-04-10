import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "anime",
  description: "Info about the anime profile",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Anime Profile")
      .setDescription(
        "There's no anime profile yet, but it's actively being planned. Follow progress [here](https://github.com/Dictionarry-Hub/database/issues/56)."
      )
      .addFields(
        {
          name: "The Plan",
          value:
            "We're building a curated database similar to SeaDex, manually ranking the best release for each variety (Blu-ray encode, WEB, Remux, dual audio, subs, etc.) per anime. For example, we'd rank the best Blu-ray encode of *Cowboy Bebop*, then the best WEB release, the best Remux, and so on. A profile is then built from those selections with release titles that match exactly those releases. It's a long process, but we believe it's the best way to automate anime at a quality we're happy with.",
        },
        {
          name: "In the Meantime",
          value:
            "On V1, you can use the [serversathome](https://github.com/serversathome/profilarr) community database which includes an anime profile. Once V2 is out, you'll be able to link multiple databases at once, meaning you can run Dictionarry alongside an external anime database.",
        }
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
