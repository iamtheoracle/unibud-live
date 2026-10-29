import os
import tempfile
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

_tmp = tempfile.TemporaryDirectory()
os.environ["ORACLE_ARC_DATABASE"] = str(Path(_tmp.name) / "oracle-test.sqlite3")
os.environ["ORACLE_ARC_API_KEY"] = "test-secret-key-that-is-long-enough-for-tests"
os.environ["ORACLE_ARC_OWNER_ID"] = "oracle-owner"
os.environ["ORACLE_ARC_ALLOWED_TOOLS"] = "memory.search,memory.save,memory.delete"

import app as oracle_app

client = TestClient(oracle_app.app)
AUTH = {"Authorization": "Bearer " + os.environ["ORACLE_ARC_API_KEY"]}


def test_health_does_not_require_auth_or_expose_secrets():
    response = client.get("/health")
    assert response.status_code == 200
    assert "oracle-owner" not in response.text
    assert os.environ["ORACLE_ARC_API_KEY"] not in response.text


def test_api_rejects_missing_or_wrong_key():
    assert client.get("/v1/models").status_code == 401
    assert client.get("/v1/models", headers={"Authorization": "Bearer wrong"}).status_code == 401


def test_api_rejects_other_owner():
    response = client.get("/v1/memories", params={"owner_id": "someone-else"}, headers=AUTH)
    assert response.status_code == 403


def test_memory_crud_is_persistent_and_owner_scoped():
    saved = client.post("/v1/memories", headers=AUTH, json={
        "owner_id": "oracle-owner", "content": "Prefers concise explanations", "category": "preferences"
    })
    assert saved.status_code == 201
    memory_id = saved.json()["id"]
    listed = client.get("/v1/memories", headers=AUTH, params={"owner_id": "oracle-owner"})
    assert any(item["id"] == memory_id for item in listed.json()["data"])
    denied = client.delete(f"/v1/memories/{memory_id}", headers=AUTH, params={"owner_id": "someone-else"})
    assert denied.status_code == 403
    deleted = client.delete(f"/v1/memories/{memory_id}", headers=AUTH, params={"owner_id": "oracle-owner"})
    assert deleted.status_code == 200
    listed_after = client.get("/v1/memories", headers=AUTH, params={"owner_id": "oracle-owner"})
    assert all(item["id"] != memory_id for item in listed_after.json()["data"])


def test_mutating_tools_require_explicit_approval():
    response = client.post("/v1/tools/execute", headers=AUTH, json={
        "owner_id": "oracle-owner", "tool": "memory.save",
        "arguments": {"content": "must not save without approval"}, "approved": False
    })
    assert response.status_code == 409
    assert not any(m["content"] == "must not save without approval" for m in oracle_app._list_memories("oracle-owner", 30))


def test_unallowlisted_tool_is_denied():
    response = client.post("/v1/tools/execute", headers=AUTH, json={
        "owner_id": "oracle-owner", "tool": "shell.execute",
        "arguments": {"command": "whoami"}, "approved": True
    })
    assert response.status_code == 403


def test_chat_calls_local_ollama_and_returns_real_model_content():
    async def fake_post(self, url, **kwargs):
        class FakeResponse:
            def raise_for_status(self): pass
            def json(self):
                return {"message": {"content": "A real-model response fixture"}, "prompt_eval_count": 4, "eval_count": 5}
        assert url.endswith("/api/chat")
        return FakeResponse()

    with patch("httpx.AsyncClient.post", new=fake_post):
        response = client.post("/v1/chat/completions", headers=AUTH, json={
            "model": "oracle-arc-local",
            "user": "oracle-owner",
            "messages": [{"role": "user", "content": "Explain a test."}],
            "max_tokens": 100
        })
    assert response.status_code == 200
    assert response.json()["choices"][0]["message"]["content"] == "A real-model response fixture"


def test_chat_does_not_fabricate_when_local_model_is_unavailable():
    async def failed_post(self, url, **kwargs):
        import httpx
        raise httpx.ConnectError("internal connection detail")

    with patch("httpx.AsyncClient.post", new=failed_post):
        response = client.post("/v1/chat/completions", headers=AUTH, json={
            "user": "oracle-owner", "messages": [{"role": "user", "content": "hello"}]
        })
    assert response.status_code == 503
    assert "internal connection detail" not in response.text
