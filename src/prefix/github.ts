import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "github",
  description: "Links to GitHub repositories",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("GitHub Repositories")
      .setURL("https://github.com/Dictionarry-Hub")
      .setDescription(
        [
          "[**Profilarr**](https://github.com/Dictionarry-Hub/profilarr) - Configuration management tool",
          "[**Database**](https://github.com/Dictionarry-Hub/database) - Custom formats, profiles & regex",
          "[**Website**](https://github.com/Dictionarry-Hub/website) - dictionarry.dev source",
        ].join("\n")
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
