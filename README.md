# Parrot Discord Bot

A Discord bot with FastAPI backend, designed to be easily extensible with new slash commands and API endpoints.

## Features

- Discord bot with modern slash command handling
- FastAPI backend for API endpoints
- Auto-loading of commands and API routes
- Development mode with hot-reloading
- Docker support for production deployment

## Project Structure

```
parrot/
├── app/
│   ├── api/           # API endpoints
│   ├── commands/      # Discord bot commands
│   ├── config/        # Configuration files
│   └── utils/         # Utility functions
├── main.py            # FastAPI application entrypoint
├── bot.py             # Discord bot initialization
├── requirements.txt   # Dependencies
├── Dockerfile         # Production build
├── docker-compose.yml # Production deployment
└── README.md          # Documentation
```

## Getting Started

### Prerequisites

- Python 3.8+
- Discord bot token (https://discord.com/developers/applications)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file from the example:
   ```
   cp .env.example .env
   ```
4. Edit `.env` and add your Discord bot token

### Running in Development Mode

Run the application with hot-reloading:

```
python main.py
```

This will start both the Discord bot and the FastAPI server. The API server will automatically reload when code changes are detected.

### Adding New Commands

1. Create a new Python file in the `app/commands/` directory
2. Use the template from `app/commands/example.py`
3. Implement your command logic
4. The command will be automatically loaded when the bot starts

Example command file (`app/commands/greet.py`):

```python
import discord
from discord import app_commands


def setup(bot: discord.Client) -> None:
    # Simple command
    @bot.tree.command(name="greet", description="Greets you or someone else")
    @app_commands.describe(name="The name of the person to greet (optional)")
    async def greet(interaction: discord.Interaction, name: str = None):
        if name:
            await interaction.response.send_message(f"Hello, {name}!")
        else:
            await interaction.response.send_message(f"Hello, {interaction.user.mention}!")
    
    # Command with choices
    @bot.tree.command(name="animal", description="Get information about an animal")
    @app_commands.describe(animal_type="The type of animal")
    @app_commands.choices(animal_type=[
        app_commands.Choice(name="Dog", value="dog"),
        app_commands.Choice(name="Cat", value="cat"),
        app_commands.Choice(name="Bird", value="bird"),
    ])
    async def animal(interaction: discord.Interaction, animal_type: str):
        animals = {
            "dog": "Loyal and friendly",
            "cat": "Independent and curious",
            "bird": "Free and musical"
        }
        await interaction.response.send_message(f"{animal_type.capitalize()}: {animals[animal_type]}")
```

### Adding New API Endpoints

1. Create a new Python file in the `app/api/` directory
2. Use the template from `app/api/example.py`
3. Implement your API endpoint logic
4. The endpoint will be automatically loaded when the API server starts

Example API file (`app/api/greeting.py`):

```python
from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/greeting",
    tags=["greeting"],
)


class GreetingRequest(BaseModel):
    name: str


class GreetingResponse(BaseModel):
    message: str


@router.post("/", response_model=GreetingResponse)
async def greet(request: GreetingRequest):
    """Create a greeting message"""
    return GreetingResponse(message=f"Hello, {request.name}!")
```

## Deployment

### Running in Production with Docker

Build and run the Docker container:

```
docker-compose up -d
```

This will start the bot and API server in a Docker container, with the API accessible on port 8000.

## Configuration

Configuration is handled through environment variables, which can be set in the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| DISCORD_TOKEN | Discord bot token | (required) |
| GUILD_ID | Discord guild ID for faster command registration (dev only) | null |
| CHANNEL_ANNOUNCEMENTS | Channel ID for announcements | null |
| CHANNEL_LOGS | Channel ID for logs | null |
| CHANNEL_TEST | Channel ID for testing | null |
| CHANNEL_DEBUG | Channel ID for debug messages | null |
| API_HOST | API server host | 0.0.0.0 |
| API_PORT | API server port | 8000 |
| API_RELOAD | Enable hot-reloading | false |
| DEBUG | Enable debug mode | false |

### Getting Channel IDs

To get channel IDs for your configuration:

1. Enable Developer Mode in Discord: Settings → Advanced → Developer Mode
2. Right-click on any channel and select "Copy ID"
3. Add this ID to your `.env` file for the appropriate channel

### Using Channel IDs in API Endpoints

The project includes utility functions to easily send messages to configured channels:

```python
from app.utils.message_sender import send_to_channel

# In an API endpoint or command
await send_to_channel(bot, "announcements", "Hello from the API!")
```

This will send a message to the channel configured as `CHANNEL_ANNOUNCEMENTS` in your .env file.

## License

MIT