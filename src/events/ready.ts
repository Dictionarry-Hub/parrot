import { Client } from "discord.js";
import { Event } from "../types";
import { logger } from "@logger";
import { staffLog } from "@staffLog";

export const event: Event<"clientReady"> = {
  name: "clientReady",
  once: true,
  execute: (client: Client) => {
    logger.info(`Logged in as ${client.user?.tag}`);

    const isDev = process.env.NODE_ENV === "development";
    staffLog(client, {
      title: "Bot Online",
      description: `Logged in as **${client.user?.tag}**`,
      fields: [{ name: "Mode", value: isDev ? "Development" : "Production", inline: true }],
      type: "success",
    });
  },
};
