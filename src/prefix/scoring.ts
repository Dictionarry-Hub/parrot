import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "scoring",
  description: "Explains how custom format scoring works holistically",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Custom Format Scoring")
      .setDescription(
        `**You can't look at a single custom format in isolation.**
Profiles are built holistically. Custom formats and their scores **combine** to achieve a result. Looking at one CF's name and score without understanding its regex and conditions will mislead you.

**Example: h265**
The most common version of this: people see an "H265" custom format scored at \`-999999\` and assume the profile doesn't want h265 content. That's wrong.

If you actually open that custom format and look at its **conditions**, you'll see it negates 1080p and 2160p.

Run an actual search and see for yourself:

\`Nosferatu 2024 REPACK3 2160p MA WEB-DL DDP 5.1 Atmos DV HDR H.265-FLUX\`
→ Score: **+391,108**: h265 is right there in the name.

The profile isn't banning h265, it's banning h265 in resolutions we don't want it.`
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
