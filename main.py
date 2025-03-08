#!/usr/bin/env python3
import asyncio
import sys
import multiprocessing
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import API_HOST, API_PORT, API_RELOAD, DEBUG
from app.utils.route_loader import register_routes

# Create the FastAPI application
app = FastAPI(
    title="Parrot API",
    description="API for the Parrot Discord Bot",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    debug=DEBUG,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API routes
register_routes(app)


# Add root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Parrot API", "status": "online"}


# Add health check endpoint
@app.get("/health")
async def health():
    return {"status": "healthy"}


# Global reference to the bot instance and process
bot = None
bot_process = None


def start_bot():
    """Start the Discord bot in a separate process"""
    import bot as bot_module
    from bot import ParrotBot

    # Create the bot instance
    bot = ParrotBot()

    # Run the bot in the main thread of this process
    asyncio.run(bot_module.main(bot))


def setup_app():
    """Setup the app before running with uvicorn"""
    # Don't start the bot here, just create it
    from bot import ParrotBot
    import discord

    # Create the bot
    bot = ParrotBot()

    # Initialize just the HTTP client
    bot.http = discord.http.HTTPClient(None)

    # Store in app state
    app.state.bot = bot

    return app


def main():
    """Main entry point for the API server and bot"""
    global bot_process, bot

    # Start the bot in a separate process
    bot_process = multiprocessing.Process(target=start_bot)
    bot_process.daemon = True
    bot_process.start()

    # Start the API server
    if API_RELOAD:
        # When using reload, we need to use the string reference
        uvicorn.run("main:setup_app",
                    host=API_HOST,
                    port=API_PORT,
                    reload=API_RELOAD,
                    reload_dirs=["app"] if API_RELOAD else None,
                    factory=True)
    else:
        # When not using reload, we can initialize directly
        setup_app()
        uvicorn.run(app, host=API_HOST, port=API_PORT)

    return 0


if __name__ == "__main__":
    sys.exit(main())
