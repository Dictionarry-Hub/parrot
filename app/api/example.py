from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Create a router for this endpoint group
router = APIRouter(
    prefix="/example",
    tags=["example"],
    responses={404: {
        "description": "Not found"
    }},
)


# Example request/response models
class ExampleRequest(BaseModel):
    message: str


class ExampleResponse(BaseModel):
    echo: str
