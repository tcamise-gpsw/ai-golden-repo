import httpx
import pytest
from httpx import ASGITransport, AsyncClient, MockTransport, Request, Response

from app import main

app = main.app


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


@pytest.mark.asyncio
async def test_translate_known_language(monkeypatch):
    def handle_request(request: Request) -> Response:
        assert request.url.params["q"] == "Hello world"
        assert request.url.params["langpair"] == "en|es"
        return Response(
            200,
            json={
                "responseStatus": 200,
                "responseData": {"translatedText": "¡Hola, Mundo!"},
            },
        )

    translation_client = AsyncClient(transport=MockTransport(handle_request))
    monkeypatch.setattr(main.httpx, "AsyncClient", lambda **_kwargs: translation_client)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/translate/es")

    assert response.status_code == 200
    assert response.json() == {
        "language": "Spanish",
        "native_name": "Español",
        "code": "es",
        "greeting": "¡Hola, Mundo!",
    }


@pytest.mark.asyncio
async def test_translate_unknown_language(monkeypatch):
    async def fail_if_called(code, client):
        raise AssertionError("upstream should not be called for an unknown language")

    monkeypatch.setattr(main, "_fetch_translation", fail_if_called)

    transport = ASGITransport(app=app, raise_app_exceptions=False)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/translate/klingon")

    assert response.status_code == 404
    assert response.json() == {"detail": "Language not found"}


@pytest.mark.asyncio
async def test_translate_api_failure(monkeypatch):
    def fail_request(request: Request) -> Response:
        raise httpx.ConnectError("unavailable", request=request)

    translation_client = AsyncClient(transport=MockTransport(fail_request))
    monkeypatch.setattr(main.httpx, "AsyncClient", lambda **_kwargs: translation_client)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/translate/es")

    assert response.status_code == 502
    assert response.json() == {"detail": "Translation service unavailable"}


@pytest.mark.asyncio
async def test_translate_malformed_response(monkeypatch):
    def malformed_response(_request: Request) -> Response:
        return Response(200, json={"responseData": {}})

    translation_client = AsyncClient(transport=MockTransport(malformed_response))
    monkeypatch.setattr(main.httpx, "AsyncClient", lambda **_kwargs: translation_client)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/translate/es")

    assert response.status_code == 502
    assert response.json() == {"detail": "Translation service unavailable"}


@pytest.mark.asyncio
async def test_translate_timeout(monkeypatch):
    def timeout_request(request: Request) -> Response:
        raise httpx.ReadTimeout("timed out", request=request)

    translation_client = AsyncClient(transport=MockTransport(timeout_request))
    monkeypatch.setattr(main.httpx, "AsyncClient", lambda **_kwargs: translation_client)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/translate/es")

    assert response.status_code == 502
    assert response.json() == {"detail": "Translation service unavailable"}


@pytest.mark.asyncio
async def test_translate_upstream_error_status(monkeypatch):
    def unavailable_response(_request: Request) -> Response:
        return Response(503, json={"message": "unavailable"})

    translation_client = AsyncClient(transport=MockTransport(unavailable_response))
    monkeypatch.setattr(main.httpx, "AsyncClient", lambda **_kwargs: translation_client)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/translate/es")

    assert response.status_code == 502
    assert response.json() == {"detail": "Translation service unavailable"}


@pytest.mark.asyncio
async def test_translate_english_without_upstream_call(monkeypatch):
    def fail_client(**_kwargs):
        raise AssertionError("English must not call the translation provider")

    monkeypatch.setattr(main.httpx, "AsyncClient", fail_client)

    transport = ASGITransport(app=app, raise_app_exceptions=False)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/translate/en")

    assert response.status_code == 200
    assert response.json()["greeting"] == "Hello, World!"


@pytest.mark.asyncio
async def test_translate_embedded_provider_error(monkeypatch):
    def embedded_error(_request: Request) -> Response:
        return Response(
            200,
            json={
                "responseStatus": "403",
                "responseData": {
                    "translatedText": "PLEASE SELECT TWO DISTINCT LANGUAGES"
                },
            },
        )

    translation_client = AsyncClient(transport=MockTransport(embedded_error))
    monkeypatch.setattr(main.httpx, "AsyncClient", lambda **_kwargs: translation_client)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/translate/es")

    assert response.status_code == 502
    assert response.json() == {"detail": "Translation service unavailable"}
