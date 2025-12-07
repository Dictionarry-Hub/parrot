import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { registerEvents } from "./events";
import { registerCommands } from "./commands";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.GuildMember],
});

registerEvents(client);
registerCommands(client);

const token =
  process.env.NODE_ENV === "production"
    ? process.env.DISCORD_BOT_TOKEN
    : process.env.DISCORD_TEST_BOT_TOKEN;

client.login(token);
