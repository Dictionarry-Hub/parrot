import { Client } from "discord.js";
import { Event } from "../types";
import { logger } from "@logger";

export const event: Event<"clientReady"> = {
  name: "clientReady",
  once: true,
  execute: (client: Client) => {
    logger.info(`Logged in as ${client.user?.tag}`);
  },
};
