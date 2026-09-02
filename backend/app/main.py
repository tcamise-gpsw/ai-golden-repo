"""Hello World backend.

Serves a static list of "Hello, World" greetings in multiple languages.
The greeting data is loaded once at startup from ``data/greetings.json``
and held in memory; there is no database.
"""

import json
from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class Greeting(BaseModel):
    """A single Hello World greeting in one language."""

    language: str = Field(description="English name of the language (e.g. 'Japanese').")
    native_name: str = Field(description="Language name written in the language itself (e.g. '日本語').")
    greeting: str = Field(description="Hello World in that language (e.g. 'こんにちは').")


DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "greetings.json"
with DATA_PATH.open(encoding="utf-8") as _f:
    _RAW = json.load(_f)

GREETINGS: list[Greeting] = [Greeting(**item) for item in _RAW]

app = FastAPI(
    title="Hello World API",
    description="Returns Hello World greetings in multiple languages.",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/greetings", response_model=list[Greeting])
async def list_greetings() -> list[Greeting]:
    """Return all greetings, one per supported language."""
    return GREETINGS


@app.get("/api/greetings/{language}", response_model=Greeting)
async def get_greeting(language: str) -> Greeting:
    """Return the greeting for a single language.

    Matching is case-insensitive on the English language name
    (e.g. ``japanese``, ``Japanese``, and ``JAPANESE`` all resolve).

    Raises **404** when the language is not in the data set.
    """
    for greeting in GREETINGS:
        if greeting.language.casefold() == language.casefold():
            return greeting
    raise HTTPException(status_code=404, detail="Language not found")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
