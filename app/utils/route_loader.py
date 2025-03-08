import importlib
import pkgutil
from typing import List

from fastapi import APIRouter, FastAPI


def get_all_routes() -> List[str]:
    """
    Get all API route module names from the api package.
    """
    from app import api as api_package
    
    return [
        name for _, name, is_pkg in pkgutil.iter_modules(
            api_package.__path__, api_package.__name__ + "."
        ) if not is_pkg
    ]


def register_routes(app: FastAPI) -> None:
    """
    Automatically load and register all API routes from the api package.
    
    Args:
        app: The FastAPI application instance
    """
    route_modules = get_all_routes()
    
    for module_name in route_modules:
        module = importlib.import_module(module_name)
        if hasattr(module, "router") and isinstance(module.router, APIRouter):
            app.include_router(module.router)
        else:
            print(f"Warning: Module {module_name} doesn't have a valid router")