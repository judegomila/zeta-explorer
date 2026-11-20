# V33 publication-safe continuation

This directory is the append-only public derivative of campaign version 33.
The private source archive is
`zeta_sphere_campaign_v33_20261103T1331Z.zip`, 8,672,645 bytes, with SHA-256
`7fa9c3f26154506f107cba1ac45e58545ef51b9115496d4965a00b45a8d75007`.
Its manifest verifies 1,778 payloads totaling 20,094,508 bytes and preserves
all 1,541 v32 payloads byte-for-byte. V33 adds 237 payload paths totaling
1,167,912 bytes.

`PUBLICATION_DELTA_V33.json` explicitly classifies 234 new owned paths totaling
647,767 bytes:

- 205 reviewed paths: 82 independent audits or replays, 115 reviewed-owned
  files, seven reviewed owned files with an external theorem dependency, and
  one reviewed scope index;
- 29 owned diagnostics retained as non-theorem history; and
- 216 distinct content hashes, including 17 duplicate-content groups and 18
  intentional repeated rows used by source/audit packets.

The public lane retains all 234 classified paths byte-for-byte. No classified
file contains a private Library/file identifier, personal filesystem path, or
conversation locator, so no privacy redaction is required. Generic historical
`/workspace/shared/...` strings in owned replay programs are retained as
implementation locators rather than rewritten. The zero-redaction receipt is
recorded in `../../provenance/v33-redactions.json`. With the exact publication
manifest and this repository README, the lane has exactly 236 files. Exact
accounting is in `../../provenance/v33-publication.json`.

The source ZIP, both root manifests, two duplicate v32 provenance manifests,
and every path not present in the two explicit publication arrays are omitted.
That excludes inherited private provenance, acquired source material, and
captured third-party material. No acquired program was executed.

## Scientific boundary

The principal analytic theorem proves strict normalized full-bridge positivity
for every nonzero real polynomial of degree at most 30,000,000,000 on
`0 <= a <= 1/2` at global spatial cutoff `H_cut = 0`; for complex
polynomials the form is `|p|^2`, not `p^2`. Its stated lower factor is
`0.00172 - exp(-2*10^11)` times the polynomial `L2` mass on `[-4,4]`.
The normalized endpoint is included, and the separate outer-shift argument
extends this same finite-degree, zero-cutoff statement to every `a > 0`.

The theorem explicitly depends on the published Platt--Trudgian verification
of the Riemann hypothesis through height 3,000,175,332,800, using the weaker
height `3*10^12`. That massive external computation was not rerun here. This
is neither a new zero verification nor an all-degree or RH proof, and it does
not extend the positive spatial-cutoff rectangle.

The lane also preserves a direct full `H10` certificate: the compact interval
calculation covers `0 <= a <= 1/2`, `0 <= H_cut <= 1/8`, and the outer argument
gives all positive shifts only at `H_cut = 0`. The corrected odd-degree-11
calculation remains inconclusive; earlier dimension-five outputs are retained
only as invalid diagnostic history. The remaining all-degree identities,
conditional criteria, asymptotics, obstructions, and sampled probes keep their
individual evidence grades and do not close the correlated all-degree target.

## Verification

From the checkpoint root:

```bash
python3 verification/verify_archive.py
python3 verification/check_v33_certificates.py
python3 verification/run_smoke.py
```
