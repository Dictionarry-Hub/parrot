import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "upgrades",
  description: "Why am I getting so many upgrades?",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Why So Many Upgrades?")
      .setDescription(
        "Your media library is out of date and needs to be updated to the highest scored release of your new profile.\n\n" +
        "The arrs don't search for the *best* release - they monitor RSS feeds and grab the first thing that qualifies as an upgrade. Not the best option, just one that clears the bar."
      )
      .addFields(
        {
          name: "Current Solution",
          value:
            "We recommend [upgradinatorr](https://github.com/Drazzilb08/daps) via DAPS. It triggers manual searches on a schedule and works through your library over time.",
        },
        {
          name: "Coming in Profilarr v2",
          value:
            "Upgrade functionality built directly into Profilarr:\n" +
            "• **Smart Filters** - AND/OR logic to target exactly what needs upgrading\n" +
            "• **Selectors** - Random, oldest, newest, lowest CF score, most/least popular\n" +
            "• **Filter Modes** - Round robin through multiple filters on a schedule\n" +
            "• **Import/Export** - Share filter configs with others",
        }
      )
      .setFooter({ text: "No more random upgrades - prioritize what matters" })
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
