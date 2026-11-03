# V31 publication-safe continuation

This directory is the append-only public derivative of campaign version 31.
It retains the exact source publication manifest and every owned path that the
manifest classifies for publication:

- 137 reviewed owned files;
- 25 owned diagnostic or correction-history files;
- 162 classified owned payload paths in total;
- 126 distinct content hashes, including 30 duplicate-content groups and 36
  repeated path rows; and
- one text-only provenance redaction recorded in
  `../../provenance/v31-redactions.json`.

The diagnostic and correction-history files are deliberately preserved under
their source classifications. They are evidence about failed, superseded, or
invalid routes, not accepted theorem statements. In particular, the early
even2 outputs computed a coordinate-swapped polynomial and are invalid as
actual-target certificates. They remain only to make the correction auditable.

The source archive, master manifests, two duplicate v30 provenance manifests,
and all inherited private or acquired-source captures are omitted. Exact
accounting is in `../../provenance/v31-publication.json`.

## Scientific boundary

The accepted v31 work includes a complete-theta square payment for the
quadratic family and an independently replayed degree-seven regional
regression-variation payment. The latter reproduces a mechanism at a rung
already contained in the normalized odd-through-19 result; it is not a new
degree or hierarchy order. The corrected even2 replay likewise reproduces a
known finite rung.

These results do not prove a uniform regional payment, an all-degree finite
core inequality, a new all-shift theorem, or the Riemann hypothesis. The full
`H6` result remains the highest complete all-shift hierarchy theorem.

Some owned replay scripts retain nonportable historical dependency paths to
excluded private source inputs. No private capture is included here, and those
scripts are outside the default smoke suite unless their inputs are explicitly
supplied. The portable complete-theta replays and stored summaries are checked
separately.

## Verification

From the checkpoint root:

```bash
python3 verification/verify_archive.py
python3 verification/check_v31_certificates.py
python3 verification/run_smoke.py
```
