# Endpoint extension provenance

This separate source package was frozen on 24 October 2026 after mathematical/software audit. All 16 original inventory entries passed before curation; their original relative-path hashes are retained in [SOURCE_SHA256SUMS](SOURCE_SHA256SUMS). The current [SHA256SUMS](SHA256SUMS) binds the published files, including editorial changes, and is the inventory used by `verify_manifest.py`.

The numerical scripts, all three exact-endpoint certificate JSONs, dependency/environment records and ordinary output files are preserved byte-for-byte. One absolute workspace prefix in `audit_endpoint_output.txt` was replaced by its relative filename. README reproduction instructions were made portable, a private discussion link was removed from `PROOF.md`, and the proof/audit invocation guidance now uses a disposable copy so regeneration does not overwrite the frozen outputs. These changes do not alter the mathematical claims.

Before publication, fresh 384-bit and 512-bit runs and a fresh endpoint audit passed. For each resulting JSON, every mathematical field matched the frozen archive after excluding `elapsed_seconds`. The standard-library verifier passed with 24 continuous edge cells, 90 closed interior cells, exact winding zero and area 10. The separate audit also checked full coverage of the `t=0` edge and six xi-based value/derivative consistency comparisons.

These are reproducible replays and an internal independent review, not a second implementation of Arb, external peer review or formal proof-assistant verification. See [INDEPENDENT_AUDIT.md](INDEPENDENT_AUDIT.md) and [PROOF.md](PROOF.md) for the analytic/software trust boundary.

This endpoint package is self-contained for its finite-height computation. It neither uses nor recovers the separate, earlier omitted approximately 1.1 GB arithmetic bundle. The [original narrower certificate](../genuine-theta-box-2026-10-24/README.md) remains separately archived and unchanged.
