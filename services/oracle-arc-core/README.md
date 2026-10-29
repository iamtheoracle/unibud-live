# Oracle Arc LLM — local core

A separately deployable, single-owner AI API backed by a local Ollama model. This service uses no cloud model provider. The platform adapter speaks an OpenAI-compatible chat-completions subset to keep integration replaceable.

## What it includes

- Ollama-backed inference; default model is `qwen2.5:7b` (choose a model that fits your RAM/VRAM).
- Owner-bound bearer authentication. The service refuses requests unless both a long API key and `ORACLE_ARC_OWNER_ID` are configured.
- SQLite memory persisted in a Docker volume; list, save, and soft-delete endpoints.
- Memory context is clearly marked as user data, not trusted instructions.
- An allowlisted tool registry limited to memory operations. No shell, arbitrary code, file-system, browser, money, or external-account tools are exposed.
- Mutating tool calls require explicit `approved: true`; actions are audit logged.
- OpenAI-compatible `POST /v1/chat/completions`, protected `GET /v1/models`, memory endpoints, and tool endpoints.
- API docs are disabled in the running service. The health endpoint reveals no owner or secrets.

## Run locally

1. Install Docker Engine / Docker Desktop with Compose.
2. Copy `.env.example` to `.env`.
3. Generate a random secret (for example, `openssl rand -hex 32`) and set `ORACLE_ARC_API_KEY`.
4. Set `ORACLE_ARC_OWNER_ID` to the authenticated user's stable ID. Use the same value in the connected app.
5. Start the services:

```sh
docker compose up -d --build
docker compose exec ollama ollama pull qwen2.5:7b
```

The API is published only on loopback at `http://127.0.0.1:8090`. Do not expose it directly to the public internet. For a remote platform connection, place it behind a private network or TLS reverse proxy with network restrictions, and keep the bearer key only in server-side environment variables. Never use a `VITE_*` variable for the secret.

## Connect UNIBUD

Set these server-only variables in the UNIBUD deployment:

- `ORACLE_ARC_URL`: private base URL for this service, e.g. `http://oracle-arc-core:8090` on a shared private network.
- `ORACLE_ARC_API_KEY`: same long random secret as the service.
- `ORACLE_ARC_OWNER_ID`: must equal both the configured service owner and the authenticated user's stable ID.

Oracle Arc is selected before other providers when configured. If the owner does not match, the adapter fails closed instead of using another provider or accessing personal memory. Guest requests are not allowed to use the personal instance. Other existing provider integrations remain untouched when Oracle Arc is not configured.

## Tests

```sh
python -m pip install -r requirements.txt
pytest -q
```

Tests cover auth, owner isolation, persistent memory CRUD, explicit approval for mutations, tool allowlisting, successful local-model adapter behavior, and honest unavailability when Ollama is down. The model-response test uses a mocked Ollama HTTP boundary; it does not claim that a real model has been downloaded or run.

## Production checklist

- Provision a long random API key and stable owner ID as deployment secrets.
- Use a private network or TLS reverse proxy; the default Compose port binds to loopback.
- Pull and warm the chosen Ollama model; test the actual hardware's latency and memory capacity.
- Back up the SQLite volume and define retention/deletion procedures.
- Rotate credentials and restrict API access to the platform server.
- Add human approval and least-privilege policies before introducing any non-memory tool.
