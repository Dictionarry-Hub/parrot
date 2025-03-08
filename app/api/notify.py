from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import discord
import logging
import traceback
import asyncio
from app.config.settings import get_channel_id, DISCORD_TOKEN

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
        # Get repository name without org/owner
        repo_parts = notification.repository.split('/')
        repo_name = repo_parts[-1].capitalize()

        # Create a Discord embed with darker green color
        embed_color = 0x2E8B57  # Sea Green
        embed = discord.Embed(color=embed_color,
                              timestamp=notification.created_at)

        # Remove title field entirely
        embed.title = None

        # Put the title in the description with h1 formatting
        embed.description = f"## 🚀 Parrot Reports: New Changes Spotted!\n**{repo_name} {notification.version}**\n{notification.body}"

        # If there's a release name, add it to the description
        if notification.name and notification.name != notification.version:
            embed.description = f"## 🚀 Parrot Reports: New Changes Spotted!\n**{repo_name} {notification.version} - {notification.name}**\n{notification.body}"

        # Add metadata fields
        embed.add_field(name="Version",
                        value=notification.tag_name,
                        inline=True)

        if notification.prerelease:
            embed.add_field(name="Type", value="🧪 Pre-release", inline=True)
        else:
            embed.add_field(name="Type", value="🚀 Release", inline=True)

        # Add authors
        authors_text = ", ".join(
            [author.name for author in notification.authors])
        embed.add_field(name="Authors", value=authors_text, inline=False)

        # Add links section
        embed.add_field(name="Links",
                        value=f"[View on GitHub]({notification.url})",
                        inline=False)

        # Set improved footer
        embed.set_footer(text=f"Parrot Bot • {notification.repository}")

        # For now, send to the test channel as specified
        channel = "test"  # Use the test channel from your .env file

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
                f"Successfully sent notification for {notification.repository} {notification.version}"
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


from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import discord
import logging
import traceback
import asyncio
from app.config.settings import get_channel_id, DISCORD_TOKEN

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
        author_info = notification.author.name

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

        # For now, send to the test channel as specified
        channel = "test"  # Use the test channel from your .env file

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
                f"Successfully sent notification for {notification.repository} commit {short_hash}"
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
