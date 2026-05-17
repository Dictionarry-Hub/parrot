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
- First: Poorly named scene WEB-DL without streaming service tags
- Later: Better WEB-DLs from preferred groups with proper tags

Without a delay, your *arr app grabs the first thing that meets minimum requirements, then upgrades repeatedly as better releases appear. This means:
- Wasted bandwidth downloading miniscule improvements
- More wear on your storage

**Where to Configure**
Delay profiles are a synced config type and required for Profilarr to work correctly. When you link an Arr, a safe default is automatically synced. This can be turned off in **Settings → General**. Different delays can be set per protocol (Usenet vs Torrents) and assigned to specific tags.`
      )
      .setColor(0x57f287);
    await message.reply({ embeds: [embed] });
  },
});