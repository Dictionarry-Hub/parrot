#!/usr/bin/env python3
import asyncio
import signal
import sys
from typing import Optional

import discord
from discord import app_commands

from app.config.settings import DEBUG, DISCORD_TOKEN, GUILD_ID
from app.utils.command_loader import register_commands


class ParrotBot(discord.Client):
    """Main Discord bot class for Parrot"""
    
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        
        super().__init__(
            intents=intents,
        )
        
        # Create a command tree for slash commands
        self.tree = app_commands.CommandTree(self)
    
    async def setup_hook(self):
        """Called when the bot is first setting up"""
        # Register all commands from the commands directory
        register_commands(self)
        
        # If a specific guild ID is provided, sync commands to that guild only (faster for development)
        if GUILD_ID:
            guild = discord.Object(id=GUILD_ID)
            self.tree.copy_global_to(guild=guild)
            await self.tree.sync(guild=guild)
            if DEBUG:
                print(f"Synced commands to guild: {GUILD_ID}")
        else:
            # Otherwise sync globally (can take up to an hour to propagate)
            await self.tree.sync()
            if DEBUG:
                print("Synced commands globally")
    
    async def on_ready(self):
        """Called when the bot is ready"""
        print(f"Bot is ready! Logged in as {self.user} (ID: {self.user.id})")
        print("Using Discord slash commands (/command)")
        print("------")


async def main(bot=None):
    """
    Main entry point for the bot
    
    Args:
        bot: Optional bot instance. If not provided, a new one will be created.
    """
    if not DISCORD_TOKEN:
        print("Error: DISCORD_TOKEN environment variable is not set")
        return 1
    
    # Initialize bot if not provided
    if bot is None:
        bot = ParrotBot()
    
    # Set up signal handlers
    loop = asyncio.get_running_loop()
    
    def handle_signal(sig, frame):
        print(f"Received signal {sig}, shutting down...")
        loop.stop()
    
    # Handle graceful shutdown
    for s in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(s, lambda s=s: handle_signal(s, None))
    
    try:
        print("Starting bot...")
        await bot.start(DISCORD_TOKEN)
    except Exception as e:
        print(f"Error: {e}")
        return 1
    finally:
        if not bot.is_closed():
            await bot.close()
    
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))