# UNIBUD deployment environment

UNIBUD is a TanStack Start + Nitro application. The repository keeps secrets out of source control.

Production requires:
- Node.js 22.
- A PostgreSQL connection through `DATABASE_URL` or Netlify Database's `NETLIFY_DB_URL`.
- `VITE_AUTH_ENABLED=true` when production sign-in is provisioned.
- `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GROK_AUTH_ISSUER`, `GROK_AUTH_CLIENT_ID`, and `GROK_AUTH_CLIENT_SECRET` for federated authentication.

The application database contract is PostgreSQL. Application code must use the repository database abstraction rather than provider-specific database clients. No external database SDK is required.

For local development, `VITE_AUTH_ENABLED=false` is the safe default. Do not commit real credentials.

Netlify builds with `npm run build` and publishes `dist`; Nitro supplies the SSR server function.

The database migration runs as part of the build and accepts `DATABASE_URL`, `NETLIFY_DB_URL`, `NETLIFY_DATABASE_URL`, or `NETLIFY_DATABASE_URL_UNPOOLED`.


## Durable media storage

Production media uploads require a configured S3-compatible object store. The application stores only the object identifier and metadata in PostgreSQL; media bytes must live in durable object storage so they survive serverless instance replacement and redeploys.

Set these server-only environment variables in the deployment provider before enabling production media uploads:

- `MEDIA_S3_ENDPOINT`: the S3 API endpoint for the storage account.
- `MEDIA_S3_BUCKET`: the bucket name.
- `MEDIA_S3_REGION`: the signing region required by the provider (use `auto` only if supported by that provider).
- `MEDIA_S3_ACCESS_KEY_ID`: a dedicated least-privilege access key.
- `MEDIA_S3_SECRET_ACCESS_KEY`: its secret key.

Never use a public bucket or expose these credentials through `VITE_*` variables. The media adapter fails closed in production when object storage is not configured; it does not silently write production uploads to ephemeral local disk. Local development can use the filesystem fallback or a configured object store.

The current browser upload flow still sends Base64 data through the application server and enforces the existing 8 MiB per-file cap. Do not increase that cap by itself: larger media needs a direct-to-object-storage upload flow (for example, short-lived presigned uploads) so request-body and memory limits do not become the bottleneck.
