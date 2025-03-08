import discord
from discord import app_commands


def setup(bot: discord.Client) -> None:
    """
    Setup function for the example command.
    This will be called automatically when the command is loaded.
    
    Args:
        bot: The Discord client instance
    """
    # Add commands to the bot's command tree
    
    # Example command - uncomment to implement
    """
    @bot.tree.command(name="hello", description="Responds with a hello message")
    async def hello(interaction: discord.Interaction):
        await interaction.response.send_message(f"Hello, {interaction.user.mention}!")
    
    # Example command with parameters
    @bot.tree.command(name="echo", description="Echoes back your message")
    @app_commands.describe(message="The message to echo back")
    async def echo(interaction: discord.Interaction, message: str):
        await interaction.response.send_message(f"You said: {message}")
    """