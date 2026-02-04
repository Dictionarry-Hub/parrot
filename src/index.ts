import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { registerEvents } from "./events";
import { registerCommands } from "./commands";
import { startServer } from "./server";
import { staffLog } from "@staffLog";
import { logger } from "@logger";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.GuildMember, Partials.Message, Partials.Reaction],
});

registerEvents(client);
registerCommands(client);

client.once("clientReady", () => {
  startServer(client);
});

const token =
  process.env.NODE_ENV === "production"
    ? process.env.DISCORD_BOT_TOKEN
    : process.env.DISCORD_TEST_BOT_TOKEN;

client.login(token);

async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down...`);

  staffLog(client, {
    title: "Bot Offline",
    description: `Shutting down (${signal})`,
    type: "error",
  });

  // Give time for the message to send
  await new Promise((resolve) => setTimeout(resolve, 1000));
  client.destroy();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
