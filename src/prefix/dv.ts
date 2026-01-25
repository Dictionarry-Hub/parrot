import { Message, EmbedBuilder } from "discord.js";
import { registerPrefixCommand } from "./registry";

registerPrefixCommand({
  name: "dv",
  description: "Dolby Vision and HDR explanation",
  execute: async (message: Message) => {
    const embed = new EmbedBuilder()
      .setTitle("Dolby Vision & HDR")
      .setDescription(
        `**What is Dolby Vision?**
Dolby Vision is an HDR format that uses dynamic metadata—adjusting brightness and color on a scene-by-scene (or even frame-by-frame) basis, unlike HDR10's static metadata that applies to the entire film.

**The Layer System**
Dolby Vision uses different "profiles" depending on the source:

• **Profile 7** (Blu-ray): Dual-layer system with an HDR10 base layer + enhancement layer. The enhancement layer can be FEL (Full Enhancement Layer with 12-bit color data) or MEL (Minimum Enhancement Layer with just dynamic metadata). Because the base layer IS HDR10, **Blu-ray releases always have HDR fallback**.

• **Profile 5** (Streaming): Single-layer in a proprietary colorspace (IPT-PQ-c2). **No HDR fallback.** If your device doesn't support DV, it cannot decode this properly.

• **Profile 8** (Hybrid): Single-layer built on an HDR10-compatible base. **Has HDR fallback.** Used by some streaming services (like Hulu) and hybrid releases. Hybrids are created by extracting the DV metadata (RPU) from one source and injecting it into an HDR10 base from another. This can be done with Blu-rays or WEB-DLs (combining a standalone HDR WEB with a DV WEB into a single release).

**The Purple/Green Problem**
When you play Profile 5 content on a device that doesn't support Dolby Vision, you get blown-out purple and green colors. The device can't interpret the proprietary colorspace and produces garbage output. This is especially relevant for Samsung TV owners; Samsung doesn't support Dolby Vision at all, so Profile 5 content is completely unplayable without fallback.

**How to Spot Safe vs Problematic Releases**
• **DV HDR** or **DV HDR10** in the name = Profile 8, has fallback (safe)
• **DV** alone = likely Profile 5, no fallback (problematic)

**What Our Profiles Do**
Our database profiles explicitly block WEB-DL releases that use Profile 5 without HDR fallback. Hulu WEB-DLs are fine (Profile 8), and all Blu-ray sources are fine (Profile 7).`
      )
      .setColor(0x57f287);

    await message.reply({ embeds: [embed] });
  },
});
