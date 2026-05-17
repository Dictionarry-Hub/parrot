import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";
registerPrefixCommand({
  name: "anime",
  description: "Info about the anime profile",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Anime Profile")
      .setDescription(
        "There's no anime profile yet, but it's on the roadmap. Follow progress [here](https://github.com/Dictionarry-Hub/database/issues/56)."
      )
      .addFields(
        {
          name: "The Plan",
          value:
            "We're building a curated database in the spirit of SeaDex; manually ranking the best release in each variety (Blu-ray encode, WEB, Remux, dual audio, subs, etc.) per anime. For example, we'd rank the best Blu-ray encode of *Cowboy Bebop*, then the best WEB release, the best Remux, and so on. Each anime then gets its own dedicated profile built from those selections, targeting those exact releases. It's a long process, but we think it's the right way to automate anime at a quality we're happy with.",
        },
        {
          name: "In the Meantime",
          value:
            "v2's multi-database support means you can run Dictionarry alongside any community-built anime database. [TRaSH Guide's Anime profile](https://github.com/Dictionarry-Hub/trash-pcd) is the most established option and what most users currently rely on.",
        }
      )
      .setColor(0x57f287);
    await message.reply({ embeds: [embed] });
  },
});