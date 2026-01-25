import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "coc",
  description: "Code of Conduct",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Code of Conduct")
      .setURL(
        "https://github.com/Dictionarry-Hub/.github/blob/main/CODE_OF_CONDUCT.md"
      )
      .setDescription(
        `**No gatekeeping.** Everyone started somewhere. Ask basic questions, share rough work, and help others without condescension.

**Disagree about ideas, not people.** Argue about x265 vs x264 all you want, but being right doesn't give you a pass to be a dick about it.

**Give feedback.** If something's broken, confusing, or bad, tell us. Maintainers aren't above criticism.

**Three strikes:** Private warning → public warning → ban. Harassment, bigotry, or doxxing = immediate removal.

It's software for downloading movies. None of it is that serious. Go outside sometimes.`
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
