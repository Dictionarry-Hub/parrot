import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "indexers",
  description: "Indexer recommendations for profiles",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Indexers & Profile Quality")
      .setDescription(
        "How well the default Profiles work for you depends heavily on the quality of the indexers you use.\n\n" +
        "**Public Trackers**\n" +
        "The Profiles were not built for public trackers and will not work well with them.\n\n" +
        "**Usenet & Private Trackers**\n" +
        "For best results, we recommend using Usenet indexers and/or private trackers. " +
        "Check out the resources below to get started:\n\n" +
        "- [Usenet Wiki](https://www.reddit.com/r/usenet/wiki/index/)\n" +
        "- [Trackers Wiki](https://www.reddit.com/r/trackers/wiki/index/)"
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
