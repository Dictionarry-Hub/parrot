from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import discord
import logging
import traceback
import asyncio
import re
from app.config.settings import get_channel_id, DISCORD_TOKEN
from app.utils.parse_author import parse_author_name

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("notify_api")

router = APIRouter(
    prefix="/notify",
    tags=["notifications"],
)


class Author(BaseModel):
    name: str
    email: Optional[str] = None
    username: Optional[str] = None
    url: Optional[str] = None


class ReleaseNotification(BaseModel):
    repository: str
    version: str
    tag_name: str
    name: Optional[str] = None
    body: str
    url: str
    created_at: datetime
    authors: List[Author]
    prerelease: Optional[bool] = False


class CommitNotification(BaseModel):
    repository: str
    branch: str
    commit_hash: str
    message: str
    body: Optional[str] = None
    url: str
    created_at: datetime
    author: Author
    changed_files: Optional[int] = None
    additions: Optional[int] = None
    deletions: Optional[int] = None


@router.post("/release")
async def notify_release(notification: ReleaseNotification, request: Request):
    """
    Send a notification about a new GitHub release to Discord
    """
    logger.info(
        f"Received release notification for {notification.repository} {notification.version}"
    )

    try:
        # Create a Discord embed with green color (same as commit - Sea Green)
        embed_color = 0x2E8B57  # Sea Green
        embed = discord.Embed(color=embed_color)

        # Remove title field entirely
        embed.title = None

        # Corrected header format with proper line breaks
        display_version = f"v{notification.version}"
        header = f"## 🚀 Parrot Reports: New Release Spotted!\n"
        
        if notification.name and notification.name != notification.version and notification.name != notification.tag_name:
            header += f"**Release: {display_version} - {notification.name}**\n\n"
        else:
            header += f"**Release: {display_version}**\n\n"
        
        # Process the body to convert markdown headers to bold text
        processed_body = notification.body
        # Replace headers with bold text (e.g., "# Header" becomes "**Header**")
        processed_body = re.sub(r'#+ (.*?)(\n|$)', r'**\1**\2', processed_body)
        
        # Combine header and body
        embed.description = header + processed_body

        # Repository, authors, and version with bold headers stacked in the same style as commit endpoint
        repo_url = f"https://github.com/{notification.repository}"
        
        # Create three separate fields in a single row for even spacing with proper formatting
        embed.add_field(name="**Repository**",
                        value=f"[{notification.repository}]({repo_url})",
                        inline=True)

        # Add authors with name parsing
        parsed_authors = [parse_author_name(author.name) for author in notification.authors]
        authors_text = ", ".join(parsed_authors)
        embed.add_field(name="**Authors**",
                        value=f"`{authors_text}`",
                        inline=True)

        # Add version with inline code and link to the release
        embed.add_field(name="**Release**",
                        value=f"[`{display_version}`]({notification.url})",
                        inline=True)

        # Select the appropriate channel based on DEBUG mode
        from app.config.settings import DEBUG
        if DEBUG:
            channel = "test"
            logger.debug(f"Debug mode enabled, using test channel")
        else:
            channel = "announcements"
            logger.debug(f"Production mode, using announcements channel")

        # Get the channel ID
        logger.debug(f"Getting channel ID for '{channel}'")
        channel_id = get_channel_id(channel)
        logger.debug(f"Channel ID: {channel_id}")

        if not channel_id:
            logger.error(f"Channel '{channel}' not configured")
            raise HTTPException(status_code=500,
                                detail=f"Channel '{channel}' not configured")

        # Create a fresh Discord client just for this request
        logger.debug("Creating a new Discord client")
        client = discord.Client(intents=discord.Intents.default())

        # Connect to Discord
        logger.debug("Logging in")
        await client.login(DISCORD_TOKEN)

        # Fetch the channel
        logger.debug(f"Fetching Discord channel {channel_id}")
        try:
            discord_channel = await client.fetch_channel(channel_id)
            logger.debug(f"Channel fetched: {discord_channel}")
        except Exception as e:
            logger.error(f"Error fetching channel: {str(e)}")
            logger.error(traceback.format_exc())
            await client.close()
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching Discord channel: {str(e)}")

        # Send the embed
        logger.debug("Sending embed to Discord")
        try:
            # Send a visually distinct embed that will stand out
            await discord_channel.send(embed=embed)
            logger.info(
                f"Successfully sent notification for {notification.repository} {notification.version} to {channel} channel"
            )
        except Exception as e:
            logger.error(f"Error sending message: {str(e)}")
            logger.error(traceback.format_exc())
            await client.close()
            raise HTTPException(
                status_code=500,
                detail=f"Error sending Discord message: {str(e)}")

        # Cleanup
        await client.close()

        return {"status": "success", "message": "Release notification sent"}

    except Exception as e:
        logger.error(f"Error in notify_release: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500,
                            detail=f"Failed to send notification: {str(e)}")

@router.post("/commit")
async def notify_commit(notification: CommitNotification, request: Request):
    """
    Send a notification about a new GitHub commit to Discord
    """
    logger.info(
        f"Received commit notification for {notification.repository} {notification.commit_hash[:10]}"
    )

    try:
        # Create short commit hash for display (now 10 characters instead of 7)
        short_hash = notification.commit_hash[:10]

        # Keep the full repository path for display (owner/repo)
        repo_display = notification.repository

        # Create a Discord embed with green color (same as release - Sea Green)
        embed_color = 0x2E8B57  # Sea Green
        embed = discord.Embed(color=embed_color)

        # Remove title field entirely
        embed.title = None

        # Put the title in the description with h3 formatting and rocket symbol
        embed.description = f"🚀 **Parrot Reports: New Commit Spotted!**"

        # Add commit message with 'Commit Message' label but no emphasis
        embed.description += f"\n\n**Commit Message**\n{notification.message}"

        # Add commit body if available with proper separation
        if notification.body:
            embed.description += f"\n\n{notification.body}"

        # Repository, author, and commit hash with bold headers stacked
        repo_url = f"https://github.com/{notification.repository}"
        commit_url = notification.url
        
        # Parse author name with the utility function
        author_info = parse_author_name(notification.author.name)

        # Create three separate fields in a single row for even spacing with proper formatting
        embed.add_field(name="**Repository**",
                        value=f"[{repo_display}]({repo_url})",
                        inline=True)

        embed.add_field(name="**Author**",
                        value=f"`{author_info}`",
                        inline=True)

        embed.add_field(name="**Commit**",
                        value=f"[`{short_hash}`]({commit_url})",
                        inline=True)

        # Select the appropriate channel based on DEBUG mode
        from app.config.settings import DEBUG
        if DEBUG:
            channel = "test"
            logger.debug(f"Debug mode enabled, using test channel")
        else:
            channel = "announcements"
            logger.debug(f"Production mode, using announcements channel")

        # Get the channel ID
        logger.debug(f"Getting channel ID for '{channel}'")
        channel_id = get_channel_id(channel)
        logger.debug(f"Channel ID: {channel_id}")

        if not channel_id:
            logger.error(f"Channel '{channel}' not configured")
            raise HTTPException(status_code=500,
                                detail=f"Channel '{channel}' not configured")

        # Create a fresh Discord client just for this request
        logger.debug("Creating a new Discord client")
        client = discord.Client(intents=discord.Intents.default())

        # Connect to Discord
        logger.debug("Logging in")
        await client.login(DISCORD_TOKEN)

        # Fetch the channel
        logger.debug(f"Fetching Discord channel {channel_id}")
        try:
            discord_channel = await client.fetch_channel(channel_id)
            logger.debug(f"Channel fetched: {discord_channel}")
        except Exception as e:
            logger.error(f"Error fetching channel: {str(e)}")
            logger.error(traceback.format_exc())
            await client.close()
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching Discord channel: {str(e)}")

        # Send the embed
        logger.debug("Sending embed to Discord")
        try:
            # Send a visually distinct embed that will stand out
            await discord_channel.send(embed=embed)
            logger.info(
                f"Successfully sent notification for {notification.repository} commit {short_hash} to {channel} channel"
            )
        except Exception as e:
            logger.error(f"Error sending message: {str(e)}")
            logger.error(traceback.format_exc())
            await client.close()
            raise HTTPException(
                status_code=500,
                detail=f"Error sending Discord message: {str(e)}")

        # Cleanup
        await client.close()

        return {"status": "success", "message": "Commit notification sent"}

    except Exception as e:
        logger.error(f"Error in notify_commit: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500,
                            detail=f"Failed to send notification: {str(e)}")