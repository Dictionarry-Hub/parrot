import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "scoring",
  description: "Explains how custom format scoring works holistically",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Custom Format Scoring")
      .setDescription(
        `**How Custom Format Scoring Works**
Custom formats don't work in isolation. Profiles are built holistically, where custom formats and their scores **combine** to achieve a result. To understand what a custom format actually does, you need to look at its regex and conditions, not just its name and score.

**Example: h265**
A common point of confusion is the "H265" custom format being scored at \`-999999\`. At first glance, it looks like the profile is trying to avoid h265 content entirely. But if you open up that custom format and look at its **conditions**, you'll see it negates 1080p and 2160p. This means it only applies to h265 content when the resolution is not 1080p or 2160p.

To see this in action, try running a search:

\`Nosferatu 2024 REPACK3 2160p MA WEB-DL DDP 5.1 Atmos DV HDR H.265-FLUX\`
→ Score: **+391,108**

The release contains h265 and still scores positively. The custom format is only targeting h265 in resolutions where it's detrimental, not h265 as a whole.`
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
