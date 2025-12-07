import { GuildMember, EmbedBuilder } from "discord.js";
import { Event } from "../types";
import { logger } from "@logger";
import { getChannel } from "@channel";

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

export const event: Event<"guildMemberRemove"> = {
  name: "guildMemberRemove",
  once: false,
  execute: (client, ...args: unknown[]) => {
    const member = args[0] as GuildMember;
    logger.info(`Member left: ${member.user.tag}`, {
      guild: member.guild.name,
    });

    const channel = getChannel(client, process.env.LEAVE);
    if (channel) {
      const joinedAt = member.joinedAt;
      const duration = joinedAt
        ? formatDuration(Date.now() - joinedAt.getTime())
        : "unknown";
      const joinedDate = joinedAt
        ? `<t:${Math.floor(joinedAt.getTime() / 1000)}:D>`
        : "unknown";

      const embed = new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle("Member Left")
        .addFields(
          { name: "User", value: member.user.tag, inline: true },
          { name: "Joined", value: joinedDate, inline: true },
          { name: "Duration", value: duration, inline: true }
        )
        .setTimestamp();

      channel.send({ embeds: [embed] });
    }
  },
};
