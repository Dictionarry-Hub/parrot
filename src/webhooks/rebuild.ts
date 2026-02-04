import { EmbedBuilder, NewsChannel } from "discord.js";
import { RebuildPayload } from "../types";

export async function handleRebuild(
  payload: RebuildPayload,
  channel: NewsChannel
): Promise<void> {
  const { service, success, duration, error } = payload.data;

  const icon = success ? "✅" : "❌";
  const durationText = duration ? `${duration}s` : "";

  const embed = new EmbedBuilder()
    .setColor(success ? 0x2ecc71 : 0xed4245)
    .setDescription(`${icon} ${service}${durationText ? ` • ${durationText}` : ""}${error ? `\n\`\`\`${error}\`\`\`` : ""}`);

  await channel.send({ embeds: [embed] });
}
