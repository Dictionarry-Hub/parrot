import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { registerEvents } from "./events";
import { registerCommands } from "./commands";
import { startServer } from "./server";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.GuildMember, Partials.Message],
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
