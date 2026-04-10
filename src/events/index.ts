import { Client } from "discord.js";
import { event as ready } from "./ready";
import { event as userLeft } from "./userLeft";
import { event as forumMessage } from "./forumMessage";
import { event as threadUpdate } from "./threadUpdate";
import { event as prefixCommand } from "./prefixCommand";
import { event as reactionAdd } from "./reactionAdd";
import { event as reactionRemove } from "./reactionRemove";
import { event as moderation } from "./moderation";
import { event as funMessages } from "./funMessages";
import { event as autoResponse } from "./autoResponse";
import { event as staleThreads } from "./staleThreads";

// Load prefix commands
import "../prefix";

const events = [ready, userLeft, forumMessage, threadUpdate, prefixCommand, reactionAdd, reactionRemove, moderation, funMessages, autoResponse, staleThreads];

export function registerEvents(client: Client) {
  events.forEach((event) => {
    if (event.once) {
      client.once(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    } else {
      client.on(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    }
  });
}
