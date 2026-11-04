# Corrected-run evidence

The ignored live supervisor directory is preserved here as a path-sanitized
projection plus cryptographic hashes of the raw artifacts.  Sanitization
replaces the local checkpoint, interpreter, and protected-root prefixes with
symbolic labels.  The event projection also omits the redundant full
`guardian_command` array from `worker_started` and the redundant `log` path
from `worker_completed`; the worker command, identities, numeric fields,
event order, result hashes, and statuses are unchanged.

Raw corrected-run SHA-256 values:

- `heartbeat.json`:
  `b48baae542963bfa4950ea56592d67ca36ec64cc91d5b26713a56ecc589fac27`
- `completed.jsonl`:
  `03fb3f260f587a3569a7a0202386fcd04c711c7410fb7159c0712566b00341a5`
- `events.jsonl`:
  `72cb02c783c259468ec5856319433d5ed38cc63ed47a5492f61a3a50cac2f026`
- worker log:
  `53d6bc1b68f118da1e43b553321735df4dbd02a6904989bbcc758271890ba24b`
- `supervisor.json`:
  `06e8f39c4e80b8e0276f55528f3db66205b6bc7110c010005a8c84e88763243a`

Only the raw hash of `supervisor.json` is retained; its configuration fields
are already represented by the heartbeat and event projection.

The full replay receipt is tracked under `results/`.  The primary and replay
receipts differ only in measured runtime fields and the consequent self-hash.

`dependency_whitespace_compatibility.json` records the only known byte-level
drift in a frozen explanatory dependency: PR #40 removed 17 trailing spaces
from one displayed-equation line in `COMPLETE_ORBIT_HARDY_NEXT.md`.  The replay
wrapper accepts only the two recorded hashes, requires the normalized byte
sequence to occur exactly once, reconstructs the historical hash in a
temporary overlay, and leaves the shared note, historical checker, and
receipts unchanged.
