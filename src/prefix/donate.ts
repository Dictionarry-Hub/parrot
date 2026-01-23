import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "donate",
  description: "Support the project",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Support Profilarr")
      .setDescription(
        "Thanks for supporting the Profilarr Project! You'll receive the Donor role as well as our eternal gratitude."
      )
      .addFields(
        {
          name: "Donate",
          value:
            "[GitHub Sponsors](https://github.com/sponsors/Dictionarry-Hub)\n[Buy Me a Coffee](https://buymeacoffee.com/santiagosayshey)",
        },
        {
          name: "Get Your Donor Role",
          value:
            "DM an admin with proof of your donation:\n• <@419831327974490112>\n• <@408835396768759808>",
        }
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
