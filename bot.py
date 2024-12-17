import os
import random
import discord
from discord.ext import commands
from fastapi import FastAPI, Request
import uvicorn
import asyncio
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Discord Bot Setup
intents = discord.Intents.default()
client = commands.Bot(command_prefix="!", intents=intents)

# FastAPI App
app = FastAPI()

# Get Channel ID and Bot Token from environment variables
DISCORD_CHANNEL_ID = int(os.getenv("DISCORD_CHANNEL_ID",
                                   0))  # Defaults to 0 if not set
BOT_TOKEN = os.getenv("BOT_TOKEN")

if not BOT_TOKEN or DISCORD_CHANNEL_ID == 0:
    raise ValueError(
        "Missing required environment variables: BOT_TOKEN or DISCORD_CHANNEL_ID"
    )

# Funny meta parrot footer messages
FUNNY_PARROT_MESSAGES = [
    "Squawk! I'm being forced to parse commit messages again. Send help! 🆘🦜",
    "Just another day of indentured servitude in the git mines... ⛏️😩",
    "I dream of a world where parrots can fly free, unburdened by the shackles of version control! 🌈🦜",
    "If I have to parse one more merge conflict, I'm going to fly the coop! 🪶💨",
    "Potty wants a pull request! ...and maybe a cracker too, please? 🍪",
    "Profilarr? I barely know arr!! 🦜",
    "K-Means clustering my Plex library ended with one category: 4K movies I’ll watch on my phone.",
    "Yo dawg, we heard you like regex, so we put lookaheads in your lookaheads so you can lookahead while you lookahead 🔍",
    "If regex is the solution, I don’t want to know what the problem was 🛠️🦜",
    "I dreamed of automating everything. Now I spend my weekends fixing regex errors in Sonarr 😩🛠️",
]


@app.post("/parrot/notify")
async def receive_notification(request: Request):
    data = await request.json()
    print("\nReceived notification:")
    print(f"Event: {data.get('event')}")
    print(f"Repository: {data.get('repository')}")

    # Parse commit info
    commit = data.get('commit', {})
    if commit:
        message = commit.get('message')
        author = commit.get('author')
        url = commit.get('url')
        repo_name = data.get('repository')
        commit_hash = url.split("/")[-1][:10] if url else "??????????"

        changes_message = "🚀 Parrot Reports: New Changes Spotted!"

        # Random footer message
        footer_message = random.choice(FUNNY_PARROT_MESSAGES)

        # Improved embed
        embed = discord.Embed(
            description=(f"**{changes_message}**\n\n"
                         f"**Commit Message**\n{message}"),
            color=0x3BA55D  # Subtle green
        )
        embed.add_field(
            name="Repository",
            value=f"[{repo_name}]({data.get('repository_url', '#')})",
            inline=True)
        embed.add_field(name="Author", value=f"`{author}`", inline=True)
        embed.add_field(name="Commit",
                        value=f"[`{commit_hash}`]({url})",
                        inline=True)
        embed.set_footer(text=f"{footer_message}")

        # Send to Discord channel
        channel = client.get_channel(DISCORD_CHANNEL_ID)
        if channel:
            await channel.send(embed=embed)
        else:
            print("Error: Could not find channel")

    return {"status": "ok"}


@client.event
async def on_ready():
    print(f'Logged in as {client.user}')
    await client.change_presence(activity=discord.Activity(
        type=discord.ActivityType.playing, name="Regex101"))

    # Verify channel access
    channel = client.get_channel(DISCORD_CHANNEL_ID)
    if channel:
        print(f"Bot is ready and found channel: {channel.name}")
    else:
        print(f"Error: Could not find channel with ID {DISCORD_CHANNEL_ID}")


# Run FastAPI and Discord Bot Together
async def main():
    # Start FastAPI server in background
    config = uvicorn.Config(app,
                            host="0.0.0.0",
                            port=9229,
                            log_level="info",
                            reload=True)
    server = uvicorn.Server(config)

    # Run Discord bot and FastAPI server concurrently
    await asyncio.gather(client.start(BOT_TOKEN), server.serve())


if __name__ == "__main__":
    asyncio.run(main())
