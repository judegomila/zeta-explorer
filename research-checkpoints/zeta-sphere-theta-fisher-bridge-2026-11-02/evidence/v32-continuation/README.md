# V32 publication-safe continuation

This directory is the append-only public derivative of campaign version 32.
The private source archive is
`zeta_sphere_campaign_v32_20261103T0754Z.zip`, 8,156,868 bytes, with SHA-256
`ba4504126d2ee711ca5b4bf3f8ece7b83ee6023230afcb4d98c415d15f65a5cf`.
Its manifest verifies 1,541 payloads totaling 18,926,596 bytes and preserves
all 1,133 v31 payloads byte-for-byte. V32 adds 408 payload paths totaling
1,616,611 bytes.

`PUBLICATION_DELTA_V32.json` explicitly classifies 405 new owned paths totaling
1,192,875 source bytes:

- 386 reviewed paths: 257 independent audits or replays, 128 reviewed-owned
  files, and one reviewed scope index;
- 19 owned diagnostics retained as non-theorem history; and
- 214 distinct content hashes, including 71 duplicate-content groups and 191
  intentional pathwise copies used by dependency and audit packets.

The public lane retains 404 classified paths byte-for-byte and publishes one
text-only provenance redaction of `V32_INDEX.md`. The source-to-public mapping
is recorded in `../../provenance/v32-redactions.json`. The exact publication
manifest is retained unchanged, so the deliberate index hash difference is
auditable. With that manifest and this repository README, the lane has exactly
407 files. Exact accounting is in
`../../provenance/v32-publication.json`.

The source ZIP, both root manifests, two duplicate private v31 manifests, and
every path not present in the two explicit publication arrays are omitted.
That excludes inherited private provenance, acquired source material, and
conversation or captured-paper records. No acquired program was executed.

## Scientific boundary

The principal finite certificate proves both actual five-channel parity
blocks, through degree 9, on
`0 <= a <= 1/2` and `0 <= H_cut <= 1/8`. At global cutoff `H_cut = 0`, a
separate outer-shift argument extends the finite degree-through-9 Gram to every
`a > 0`, with the divided-by-`a` normalized endpoint at `a = 0` also
certified. The outer argument does not extend positive-cutoff coverage beyond
`a = 1/2`.

The lane also preserves a conditioned inverse-residual reproduction at the
known normalized odd degree-7 rung, finite modular/Bessel signed-cancellation
checks, and the exact dyadic threshold 107521. Inconclusive, failed,
superseded, or diagnostic packets remain under their source classifications.
The finite certificates do not establish degree-uniform positivity,
arbitrary-cutoff positivity, or the Riemann hypothesis.

## Verification

From the checkpoint root:

```bash
python3 verification/verify_archive.py
python3 verification/check_v32_certificates.py
python3 verification/run_smoke.py
```
