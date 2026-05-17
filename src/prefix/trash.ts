import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";
registerPrefixCommand({
  name: "trash",
  description: "Info about the TRaSH PCD database",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("TRaSH Guides")
      .setURL("https://github.com/Dictionarry-Hub/trash-pcd")
      .setDescription(
        "A port of the [TRaSH guides](https://trash-guides.info/) in PCD format, ready to link as a database in Profilarr."
      )
      .addFields(
        {
          name: "Maintenance & Reporting",
          value:
            "This is maintained by the Dictionarry team, not TRaSH. It's mirrored from upstream as-is, so if our copy ever falls behind or doesn't match, please report any issues here first so we can sort it out, rather than bothering the TRaSH team about it.",
        },
        {
          name: "Status",
          value:
            "French and German profiles are still in progress.",
        }
      )
      .setColor(0x57f287);
    await message.reply({ embeds: [embed] });
  },
});