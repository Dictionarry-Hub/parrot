# Parrot

Discord bot for Dictionarry that bridges Discord and GitHub for seamless issue tracking and community support.

## Features

- **Two-way GitHub sync** - Forum threads sync with GitHub issues, comments flow both directions
- **Support request workflow** - Multi-step modal flow for creating issues across repos
- **Multi-repo support** - Handles profilarr, database, and website repositories
- **Webhook handling** - GitHub signature verification, changelog notifications, rebuild status
- **Dual command systems** - Both slash commands (`/support`) and prefix commands (`!help`)

## Tech Stack

- **Discord.js v14** - Bot framework
- **Hono** - HTTP server for webhooks
- **TypeScript** - Type-safe development
- **SQLite** - Local database for sync records

## Project Structure

```
src/
├── carrier/       # Discord <-> GitHub sync module
├── commands/      # Slash commands (/support, /wizard, etc.)
├── events/        # Discord event listeners
├── prefix/        # Prefix commands (!help, !docs, etc.)
├── webhooks/      # GitHub webhook handlers
├── utils/         # Logger, helpers
├── index.ts       # Bot entry point
└── server.ts      # HTTP server for webhooks
```

## Setup

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
cp .env.example .env
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TEST_BOT_TOKEN` | Test bot token (development) |
| `DISCORD_BOT_TOKEN` | Production bot token |
| `GITHUB_TOKEN` | GitHub personal access token |
| `GITHUB_WEBHOOK_SECRET` | Secret for webhook signature verification |
| `CARRIER_FORUM_CHANNEL` | Production forum channel ID |
| `CARRIER_FORUM_CHANNEL_DEV` | Development forum channel ID |
| `CARRIER_ORG` | GitHub organization (default: `Dictionarry-Hub`) |
| `CHANGELOG` | Channel ID for changelog notifications |
| `REBUILD` | Channel ID for rebuild status notifications |
| `PORT` | HTTP server port (default: `3000`) |

## Development

```bash
npm run dev    # Start with test bot token
```

For webhook testing locally, use ngrok or similar to expose the server:

```bash
ngrok http 3000
```

## Production

### Build

```bash
npm run build
```

### Deploy with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the bot
pm2 start dist/index.js --name parrot

# Useful PM2 commands
pm2 logs parrot      # View logs
pm2 restart parrot   # Restart
pm2 stop parrot      # Stop
pm2 delete parrot    # Remove from PM2

# Auto-start on system reboot
pm2 startup
pm2 save
```

## Commands

### Slash Commands

| Command | Description |
|---------|-------------|
| `/support` | Create a support request (syncs to GitHub) |
| `/wizard` | Link to the Dictionarry profile wizard |
| `/profile` | Profile-related commands |
| `/format` | Format-related commands |
| `/ping` | Check bot latency |

### Prefix Commands

All prefix commands use `!` as the prefix.

| Command | Description |
|---------|-------------|
| `!help` | List available commands |
| `!support` | Support request info |
| `!docs` | Documentation links |
| `!github` | GitHub links |
| `!beta` | Beta program info |
| `!donate` | Donation info |
| `!setup` | Setup guide |
| `!sync` | Sync info |
| `!upgrades` | Upgrade info |
| `!language` | Language info |
| `!quality` | Quality info |
| `!propers` | Propers info |
| `!anime` | Anime info |

## Adding Commands

### Slash Commands

Create a file in `src/commands/`:

```ts
// src/commands/example.ts
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("example")
    .setDescription("Example command"),
  execute: async (interaction) => {
    await interaction.reply("Hello!");
  },
};
```

Register in `src/commands/index.ts`.

### Prefix Commands

Create a file in `src/prefix/`:

```ts
// src/prefix/example.ts
import { PrefixCommand } from "./registry";

export const command: PrefixCommand = {
  name: "example",
  description: "Example prefix command",
  execute: async (message) => {
    await message.reply("Hello!");
  },
};
```

Register in `src/prefix/index.ts`.

## Adding Events

Create a file in `src/events/`:

```ts
// src/events/example.ts
import { Event } from "../types";

export const event: Event<"messageCreate"> = {
  name: "messageCreate",
  once: false,
  execute: async (message) => {
    // Handle message
  },
};
```

Register in `src/events/index.ts`.

## Carrier (GitHub Sync)

The Carrier module handles bidirectional sync between Discord forum threads and GitHub issues.

### Flow

1. User runs `/support` and fills out the modal
2. Bot creates a forum thread and GitHub issue
3. Messages in the thread sync to GitHub comments
4. GitHub comments sync back to Discord
5. Archiving a thread closes the issue (and vice versa)

### Supported Repos

- `profilarr` - Main application
- `database` - Database/profiles
- `website` - Documentation site

## Webhooks

The bot runs an HTTP server (default port 3000) that handles:

| Endpoint | Purpose |
|----------|---------|
| `/webhook` | General webhooks (changelog, rebuild) |
| `/webhook/github` | GitHub webhooks (issue comments, state changes) |

Configure GitHub webhooks to point to `https://your-domain/webhook/github` with the secret matching `GITHUB_WEBHOOK_SECRET`.

## Logs

Logs are written to the `/logs` directory with daily rotation. Console output includes colored formatting for different log levels.
