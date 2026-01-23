import { Client, ThreadChannel, ChannelType } from "discord.js";
import { Event } from "../types";
import { logger } from "@logger";
import { syncDiscordClose, getSyncByDiscordThread } from "../carrier";

export const event: Event<"threadUpdate"> = {
  name: "threadUpdate",
  once: false,

  execute: async (client: Client, ...args: unknown[]) => {
    const oldThread = args[0] as ThreadChannel;
    const newThread = args[1] as ThreadChannel;

    // Only handle forum post threads
    if (newThread.parent?.type !== ChannelType.GuildForum) return;

    // Check if thread was archived (closed)
    if (!oldThread.archived && newThread.archived) {
      // Check if this is a synced thread
      const sync = getSyncByDiscordThread(newThread.id);
      if (!sync) return;

      try {
        await syncDiscordClose(newThread.id);
        logger.info("Synced Discord thread close to GitHub", {
          threadId: newThread.id,
        });
      } catch (error) {
        logger.error("Failed to sync Discord thread close", {
          error,
          threadId: newThread.id,
        });
      }
    }
  },
};
