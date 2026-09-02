import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_get_languages():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/languages")

    assert response.status_code == 200
    languages = response.json()
    assert len(languages) == 10
    assert all({"language", "native_name", "code"} == set(item) for item in languages)
    assert any(item["code"] == "zh-CN" for item in languages)
