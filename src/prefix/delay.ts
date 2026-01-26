import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "delay",
  description: "Delay profile explanation",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Delay Profiles")
      .setDescription(
        `**What are Delay Profiles?**
Delay profiles tell Sonarr/Radarr how long to wait before grabbing a release. This gives time for better quality releases to appear before committing to a download.

**Why Use Them?**
When new content drops, releases come out in waves. For example:
• First: Poorly named scene WEB-DL without streaming service tags
• Later: Better WEB-DLs from preferred groups with proper tags

Without a delay, your *arr app grabs the first thing that meets minimum requirements, then upgrades repeatedly as better releases appear. This means:
• Wasted bandwidth downloading miniscule improvements
• More wear on your storage

**Where to Configure**
Delay profile syncing is coming in Profilarr v2. For now, configure them manually in Sonarr/Radarr: Settings → Profiles → Delay Profiles.

You can set different delays for different protocols (Usenet vs Torrents) and assign profiles to specific tags.`
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
