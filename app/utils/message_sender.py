import discord
from typing import Optional, Union

from app.config.settings import get_channel_id


async def send_to_channel(
    bot: discord.Client,
    channel_name: str,
    content: str,
    *,
    embed: Optional[discord.Embed] = None,
    file: Optional[discord.File] = None,
    view: Optional[discord.ui.View] = None,
) -> Optional[discord.Message]:
    """
    Send a message to a preconfigured channel.
    
    Args:
        bot: The Discord bot client
        channel_name: The name of the channel in the CHANNELS configuration
        content: Message content to send
        embed: Optional embed to attach to the message
        file: Optional file to attach to the message
        view: Optional view (buttons/components) to attach to the message
        
    Returns:
        The sent message if successful, None otherwise
    """
    channel_id = get_channel_id(channel_name)
    if not channel_id:
        print(f"Warning: Channel '{channel_name}' not configured")
        return None
    
    channel = bot.get_channel(channel_id)
    if not channel:
        print(f"Warning: Could not find channel with ID {channel_id}")
        return None
    
    try:
        return await channel.send(content=content, embed=embed, file=file, view=view)
    except discord.DiscordException as e:
        print(f"Error sending message to channel {channel_name}: {e}")
        return None


async def send_message_to_user(
    bot: discord.Client,
    user_id: int,
    content: str,
    *,
    embed: Optional[discord.Embed] = None,
    file: Optional[discord.File] = None,
    view: Optional[discord.ui.View] = None,
) -> Optional[discord.Message]:
    """
    Send a direct message to a user by ID.
    
    Args:
        bot: The Discord bot client
        user_id: The user ID to send a message to
        content: Message content to send
        embed: Optional embed to attach to the message
        file: Optional file to attach to the message
        view: Optional view (buttons/components) to attach to the message
        
    Returns:
        The sent message if successful, None otherwise
    """
    try:
        user = await bot.fetch_user(user_id)
        return await user.send(content=content, embed=embed, file=file, view=view)
    except discord.DiscordException as e:
        print(f"Error sending message to user {user_id}: {e}")
        return None