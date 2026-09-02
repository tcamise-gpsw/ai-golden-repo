"""Hello World backend.

Serves a curated list of languages used for dynamic "Hello, World!"
translations. Language metadata is loaded once at startup from
``data/languages.json`` and held in memory; there is no database.
"""

import json
from pathlib import Path

import httpx
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class Language(BaseModel):
    """A language available for translation."""

    language: str = Field(description="English name of the language.")
    native_name: str = Field(description="Language name written in its own script.")
    code: str = Field(description="Language code accepted by the translation service.")


class TranslatedGreeting(Language):
    """A translated Hello World greeting for one language."""

    greeting: str = Field(description="Hello, World! translated into the language.")


DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "languages.json"
with DATA_PATH.open(encoding="utf-8") as _file:
    LANGUAGES: list[Language] = [Language(**item) for item in json.load(_file)]

MYMEMORY_URL = "https://api.mymemory.translated.net/get"
TRANSLATION_TIMEOUT_SECONDS = 5.0


async def _fetch_translation(code: str, client: httpx.AsyncClient) -> str:
    response = await client.get(
        MYMEMORY_URL,
        params={"q": "Hello, World!", "langpair": f"en|{code}"},
    )
    response.raise_for_status()
    translated_text = response.json().get("responseData", {}).get("translatedText")
    if not isinstance(translated_text, str) or not translated_text.strip():
        raise ValueError("translation response did not contain translated text")
    return translated_text

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


@app.get("/api/translate/{code}", response_model=TranslatedGreeting)
async def translate_greeting(code: str) -> TranslatedGreeting:
    """Return a dynamic Hello World translation for a supported language."""
    language = next((item for item in LANGUAGES if item.code == code), None)
    if language is None:
        raise HTTPException(status_code=404, detail="Language not found")

    try:
        async with httpx.AsyncClient(timeout=TRANSLATION_TIMEOUT_SECONDS) as client:
            greeting = await _fetch_translation(code, client)
    except (httpx.HTTPError, ValueError) as error:
        raise HTTPException(
            status_code=502, detail="Translation service unavailable"
        ) from error

    return TranslatedGreeting(**language.model_dump(), greeting=greeting)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
