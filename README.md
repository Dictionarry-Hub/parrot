# Parrot

Discord bot for Dictionarry.

## Development

### Setup

```bash
npm install
cp .env.example .env  # add your tokens
```

### Run

```bash
npm run dev   # development (test bot)
npm run build # compile typescript
npm run prod  # production
```

### Adding Commands

Create a file in `src/commands/`:

```ts
// src/commands/ping.ts
import { Command } from "../types";

export const command: Command = {
  name: "ping",
  description: "Replies with pong",
  execute: async (interaction) => {
    await interaction.reply("Pong!");
  },
};
```

Register it in `src/commands/index.ts`:

```ts
import { command as ping } from "./ping";

const commands = [ping];
```

### Adding Events

Create a file in `src/events/`:

```ts
// src/events/ready.ts
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
```

Register it in `src/events/index.ts`:

```ts
import { event as ready } from "./ready";

const events = [ready];
```

## Production

### Docker

```bash
docker login ghcr.io -u YOUR_GITHUB_USERNAME
docker compose pull
docker compose up -d
```

Logs are persisted in the `parrot-logs` volume.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TEST_BOT_TOKEN` | Test bot token (dev) |
| `DISCORD_BOT_TOKEN` | Production bot token |
