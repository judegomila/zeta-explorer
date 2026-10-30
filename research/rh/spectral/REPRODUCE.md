# Finite whole-even certificate: clean-checkout reproduction

## Scope and status

The accepted result is actual whole-even coercivity for `1 < lambda <= sqrt(16001/1000)`, with an existential positive floor. It is not a numerical floor at the new endpoint, an odd-space theorem, a cofinal-support theorem, or an RH proof. The independent mathematical/source audit and its historical complete replay are included. The new portable replay below is an additional **producer clean-checkout reproduction**, not a new independent mathematical audit or a second arithmetic implementation.

The optional `X = 161/10` case reproduces a failed sufficient lower surrogate. Its negative whitened pivot is **not** actual negative Weil energy. That complete optional portable run has not been newly executed; the original producer failure and independently checked prerequisites remain separately documented.

## Run

Python 3.12.14 was tested. Create a virtual environment if desired, then from the repository root:

```sh
python -m pip install -r research/rh/spectral/requirements.txt
python research/rh/spectral/replay.py --report /tmp/rh-accepted-replay.json
```

The report path must not already exist. Do not run with `python -O`, `python -OO`, or `PYTHONOPTIMIZE`: these checkers use assertions and require them enabled. `python-flint == 0.9.0` is the only third-party runtime dependency. The launcher verifies frozen file hashes, copies the exact source tree into a disposable temporary directory, and runs five accepted stages: seventh-power feasibility, full moment generation, literal actual-entry comparison, small gate, and full gate. The shipped references are never overwritten. Logs and generated data remain in the temporary work tree named in the report.

The October 30 clean-checkout run passed in about six minutes; runtime depends on hardware. It regenerated every one of the 10,437 retained-phase moment rows, with minimum 942-bit relative accuracy, and passed the complete 2049-dimensional core, 72-dimensional coefficient factor, and 72-dimensional whitened Schur gates. All compared mathematical receipt fields matched. The result is pinned in `validation/ACCEPTED_CLEAN_REPLAY.json`; source integrity is pinned in `validation/STATIC_TRANSPORT_CHECK.json`. The unchanged clean-run report pins the preserved original `validation/REPLAY_INPUT_MANIFEST.json`; after metadata-only privacy curation, `validation/POSTCURATION_IDENTITY.json` binds the current manifest to that original run. No additional numerical rerun is claimed for those metadata-only edits.

Optional failure reproduction:

```sh
python research/rh/spectral/replay.py --case failed --report /tmp/rh-failed-replay.json
```

This runs seven stages and expects `FAILED_OR_INCONCLUSIVE` in the certificate. Launcher success means faithful reproduction of that failed surrogate, **not** acceptance of the larger support. Do not change its app status to certified-finite merely because the reproduction command succeeds.

## Evidence inventory and comparison semantics

- `source-tree/`: 17 byte-identical Python source files, plus curated full mathematical notes and audits. The manifest preserves the original root-relative imports. Accepted production uses eight Python dependencies; its literal old-builder entry check adds a ninth. The remaining scripts support the failed case.
- `reference/`: 23 plain-text JSON receipts, not an archive. `manifest.json` records their byte counts and original/transport hashes. Nineteen are byte-identical. One preflight receipt has only its source-map keys stripped of an absolute local directory prefix; three audit receipts have only their operational reviewer identifier generalized. Mathematical values and source hashes are unchanged.
- `manifest.json`: runtime, exact source/receipt identities, ordered commands, expected status, and full-cache digest rules.
- `SOURCE_PROVENANCE.json`: original-to-published identities for curated notes, body provenance, claim/review/reproducibility distinctions.

No compressed or opaque receipt is included. The complete large moment caches and temporary binary matrices are regenerated, not replaced by a summary in the proof. All 10,437 rows are checked through a canonical digest of the key-sorted JSON list, excluding only per-row timing. Full interval strings and all other row fields participate. Raw cache file hashes can differ with worker completion order; the canonical digest does not. For the accepted case that digest is `7124e3da5214999afd3edbe57cbbda015f4d14ae6a5f7a7acfafd1330b6292fa`.

The clean replay compares mathematical fields, checks emitted source hashes, and disregards only identified timing/provenance fields. Read the launcher and the complete validation report for the exact rules. Midpoints are used to select permutations, never to replace outward interval positivity tests.

## Deliberate exclusions

No discovery arrays, historical unavailable 1.1 GB certificate, pending directional diagnosis, higher-power repair, unpublished V8 manuscript, chat transcript, or personal notes are included. No assertion of external peer review or formal verification is made. The fixed-support analytic theorem and proof are in `research/rh/modules/whole-even-certificate.md`; the physical-complement asymptotic theory is a separate review unit, not a dependency of this finite replay.
