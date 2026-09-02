"""Hello World backend.

Serves a curated list of languages used for dynamic "Hello, World!"
translations. Language metadata is loaded once at startup from
``data/languages.json`` and held in memory; there is no database.
"""

import json
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class Language(BaseModel):
    """A language available for translation."""

    language: str = Field(description="English name of the language.")
    native_name: str = Field(description="Language name written in its own script.")
    code: str = Field(description="Language code accepted by the translation service.")


DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "languages.json"
with DATA_PATH.open(encoding="utf-8") as _file:
    LANGUAGES: list[Language] = [Language(**item) for item in json.load(_file)]

app = FastAPI(
    title="Hello World API",
    description="Returns languages and dynamic Hello World translations.",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/languages", response_model=list[Language])
async def list_languages() -> list[Language]:
    """Return every language available for translation."""
    return LANGUAGES


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
