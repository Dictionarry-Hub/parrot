import { Client } from "discord.js";
import { event as ready } from "./ready";
import { event as userLeft } from "./userLeft";

const events = [ready, userLeft];

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
