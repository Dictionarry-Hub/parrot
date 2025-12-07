import { Client, TextChannel } from "discord.js";

export function getChannel(
  client: Client,
  prodChannelId: string | undefined
): TextChannel | null {
  const isDev = process.env.NODE_ENV !== "production";
  const channelId = isDev ? process.env.DEV : prodChannelId;

  if (!channelId) return null;

  const channel = client.channels.cache.get(channelId);
  return channel instanceof TextChannel ? channel : null;
}
