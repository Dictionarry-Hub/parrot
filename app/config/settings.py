import os
from typing import Dict, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Bot configuration
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
GUILD_ID = os.getenv(
    "GUILD_ID"
)  # For development, specify a guild ID for faster command registration

# Channel configurations
# You can define specific channel IDs for different purposes
CHANNELS = {
    # Required channels (used in production)
    "announcements": os.getenv("CHANNEL_ANNOUNCEMENTS"),
    "logs": os.getenv("CHANNEL_LOGS"),
    # Optional/testing channels
    "test": os.getenv("CHANNEL_TEST"),
    "debug": os.getenv("CHANNEL_DEBUG"),
}

# API configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")

# Make sure the port is properly set from the environment variable
# Add debug logging to see what's happening
try:
    port_env = os.getenv("API_PORT")
    if port_env:
        API_PORT = int(port_env)
        print(f"Using API_PORT from environment: {API_PORT}")
    else:
        API_PORT = 8000
        print(f"API_PORT not found in environment, using default: {API_PORT}")
except ValueError:
    # Handle potential conversion errors
    print(
        f"Invalid API_PORT value in environment: '{port_env}', using default 8000 instead"
    )
    API_PORT = 8000

API_RELOAD = os.getenv("API_RELOAD", "false").lower() == "true"

# Development mode
DEBUG = os.getenv("DEBUG", "false").lower() == "true"


def get_channel_id(channel_name: str) -> Optional[int]:
    """
    Get a channel ID by name from configuration.
    Returns None if the channel is not configured.
    
    Args:
        channel_name: The name of the channel in the CHANNELS dictionary
    Returns:
        The channel ID as an integer, or None if not found
    """
    channel_id = CHANNELS.get(channel_name)
    return int(channel_id) if channel_id else None
