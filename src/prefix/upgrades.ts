import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";
registerPrefixCommand({
  name: "upgrades",
  description: "Why am I getting so many upgrades?",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Why So Many Upgrades?")
      .setDescription(
        "Your media library is out of date and needs to be updated to the highest scored release of your current profile.\n\n" +
        "The arrs don't search for the *best* release. They monitor RSS feeds and grab the first thing that qualifies as an upgrade. Not the best option, just one that clears the bar."
      )
      .addFields(
        {
          name: "Automated Upgrades",
          value:
            "Profilarr includes upgrade automation that systematically works through your library, prioritising what matters to you:\n" +
            "- **Smart filters** with AND/OR logic to target specific media\n" +
            "- **Selectors** like random, oldest, newest, lowest CF score, or popularity\n" +
            "- **Filter modes** that cycle through multiple filters on a schedule\n" +
            "- **Cooldowns** to prevent re-searching items too often\n" +
            "- **Import/export** of filter configs to share with others",
        }
      )
      .setFooter({ text: "Prioritise what gets upgraded and when" })
      .setColor(0x57f287);
    await message.reply({ embeds: [embed] });
  },
});