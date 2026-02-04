import { Client, EmbedBuilder, ColorResolvable } from "discord.js";
import { getChannel } from "@channel";

type LogType = "info" | "success" | "warning" | "error";

const COLORS: Record<LogType, ColorResolvable> = {
  info: 0x5865f2,
  success: 0x57f287,
  warning: 0xfee75c,
  error: 0xed4245,
};

interface LogOptions {
  title: string;
  description?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  type?: LogType;
}

export function staffLog(client: Client, options: LogOptions): void {
  const isDev = process.env.NODE_ENV === "development";
  const logChannel = getChannel(client, isDev ? process.env.STAFF_LOG_DEV : process.env.STAFF_LOG);

  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setColor(COLORS[options.type ?? "info"])
    .setTitle(options.title)
    .setTimestamp();

  if (options.description) {
    embed.setDescription(options.description);
  }

  if (options.fields) {
    embed.addFields(options.fields);
  }

  logChannel.send({ embeds: [embed] });
}
