import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "codec",
  description: "h264/5 vs x264/5 codec explanation",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("h264/5 vs x264/5")
      .setDescription(
        `**These are not the same thing.**

**h264/5 (AVC / HEVC)**
These are video codec standards. In P2P release naming, the h264/5 tag signals that the video stream is untouched or losslessly muxed. Think WEB-DLs and remuxes. The content came directly from the source without re-encoding.

\`Nosferatu 2024 2160p MA WEB-DL DDP 5.1 Atmos DV HDR H.265-FLUX\`
→ This is a **WEB-DL**. The h265 stream was pulled directly from the streaming service.

**x264/5**
These are open-source encoders that use the h264/5 standards respectively to **re-encode** video. When you see x264 or x265 in a release name, it means someone took the source and encoded it down.

\`Nosferatu 2024 Extended Cut UHD BluRay 2160p DDP 7.1 DV HDR x265-BHDStudio\`
→ This is an **encode**. The Blu-ray source was re-encoded using the x265 encoder.

**TL;DR**
• **h264/5** = source-quality, no re-encoding
• **x264/5** = re-encoded using the respective standard`
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});