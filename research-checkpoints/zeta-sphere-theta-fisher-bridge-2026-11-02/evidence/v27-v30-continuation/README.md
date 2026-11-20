# V27--V30 publication-safe continuation

This directory is the public, append-only derivative of campaign versions 27
through 30. It retains the exact four source publication manifests and the
deduplicated union of their explicit authored allowlists:

- 121 manifest rows;
- 84 unique authored payloads;
- 37 intentional same-hash carry-forwards;
- 78 payloads preserved byte-for-byte; and
- six text files with privacy-only identifier redactions recorded in
  `../../provenance/v27-v30-redactions.json`.

The source archive, master manifests, eight duplicate prior-version manifests,
and 33 acquired/private provenance paths are not published. Exact accounting
is in `../../provenance/v27-v30-publication.json`.

## Scientific boundary

The continuation adds reviewed scalar and adaptive resolvent reductions, an
exact complete-theta divisor grouping, a positive degree-only `O(N^2)` cutoff
for the even arithmetic remainder, and a negative odd remainder with an
explicit magnitude payment. The finite signed arithmetic core remains
unproved uniformly in degree. No new original pivot, all-order positivity
theorem, or proof of the Riemann hypothesis is claimed.

Numerical probes and elementary constant replays remain labelled as such. The
lightweight repository smoke check does not rerun the finite Arb certificate
or any expensive historical quadrature.

Some frozen diagnostics retain historical absolute path strings pointing to
excluded private source captures. Those strings disclose no captured content,
but the scripts are not portable as written and are deliberately not executed
by the public smoke suite. The three portable exact checks run only inside a
temporary copy.

## Verification

From the checkpoint root:

```bash
python3 verification/verify_archive.py
python3 verification/check_v27_v30_certificates.py
python3 verification/run_smoke.py
```
