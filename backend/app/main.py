import json
from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "greetings.json"
with DATA_PATH.open(encoding="utf-8") as greetings_file:
    GREETINGS = json.load(greetings_file)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/greetings")
async def get_greetings():
    return GREETINGS


@app.get("/api/greetings/{language}")
async def get_greeting(language: str):
    for greeting in GREETINGS:
        if greeting["language"].casefold() == language.casefold():
            return greeting

    raise HTTPException(status_code=404, detail="Language not found")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
