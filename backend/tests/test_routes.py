import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_get_all_greetings():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/greetings")

    assert response.status_code == 200
    greetings = response.json()
    assert isinstance(greetings, list)
    assert len(greetings) == 10
    assert all(
        {"language", "native_name", "greeting"}.issubset(greeting)
        for greeting in greetings
    )


@pytest.mark.asyncio
async def test_get_single_greeting_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/greetings/english")

    assert response.status_code == 200
    assert response.json() == {
        "language": "English",
        "native_name": "English",
        "greeting": "Hello",
    }


@pytest.mark.asyncio
async def test_get_single_greeting_case_insensitive():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/greetings/ENGLISH")

    assert response.status_code == 200
    assert response.json() == {
        "language": "English",
        "native_name": "English",
        "greeting": "Hello",
    }


@pytest.mark.asyncio
async def test_get_single_greeting_not_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/greetings/klingon")

    assert response.status_code == 404
    assert response.json() == {"detail": "Language not found"}
