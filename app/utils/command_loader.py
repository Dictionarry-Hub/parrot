import importlib
import os
import pkgutil
from typing import Any, Callable, Dict, List

import discord
from discord import app_commands


def get_all_commands() -> List[str]:
    """
    Get all command module names from the commands package.
    """
    from app import commands as commands_package
    
    return [
        name for _, name, is_pkg in pkgutil.iter_modules(
            commands_package.__path__, commands_package.__name__ + "."
        ) if not is_pkg
    ]


def register_commands(bot: discord.Client) -> None:
    """
    Automatically load and register all commands from the commands package.
    
    Args:
        bot: The Discord client instance with a command tree
    """
    command_modules = get_all_commands()
    
    for module_name in command_modules:
        module = importlib.import_module(module_name)
        if hasattr(module, "setup"):
            module.setup(bot)
        else:
            print(f"Warning: Module {module_name} doesn't have a setup function")