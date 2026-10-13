# Bud message lifecycle (guest)

1. User message is appended to ephemeral guest thread immediately.
2. Pending bubble shows the same text while waiting.
3. UI shows **Bud is typing…** (not technical diagnostics).
4. On success: assistant reply is appended; pending cleared.
5. On failure: pending cleared; honest assistant line keeps the thread usable for retry.
6. Guest conversations are never claimed as permanently saved.
