# Separate X16.1 eighth-power repair evidence

**Accepted by independent internal analytic/source review and full replay—not external peer review or formal verification:** actual reflection-even coercivity through `lambda = sqrt(161/10)`, with an existential positive constant. No numerical floor, odd-space, cofinal-support or RH theorem is claimed.

This is a delta package. It requires the sibling `../spectral` package at the exact manifest version pinned by `manifest.json`. It does not overwrite the earlier accepted `X=16001/1000` certificate or the genuine failed seventh-power `X=161/10` sufficient surrogate.

## Mathematical change

The stronger whole-prime norm envelope is `3.790593`, obtained from an exact rational eighth-power path enumeration. It replaces `3.805113` in the entire-tail lower comparison, adding exactly `0.014520` to every tail diagonal lower bound. Only the complete near inverse weights are improved in the finite Schur test. The actual head, actual coupling, support-specific moment values, and old all-head far H/remainder remain unchanged. Since `1/d_new <= 1/d_old <= old far step profile`, the old far majorant stays conservative.

The earlier failed lower surrogate is not a negative vector of the actual form. The newly passing sufficient certificate is a distinct certificate at the same physical support. Its positive LDL pivots establish signs, not an eigenvalue floor.

## Layout and provenance

- `source-tree/`: three new byte-preserved Python sources plus the producer's proof/implication note, preserving root-relative imports.
- `reference/`: frozen scalar, small/full and independent audit evidence. These are never runtime output destinations.
- `manifest.json`: base-package/version requirement, old cache canonical digest, all new source hashes and original-to-transport reference hashes.
- `validation/`: packaging checks and complete clean-overlay replay result when present.

Only reviewer-identification metadata/text is generalized in the final independent audit transport copies. The original and transport hashes are both recorded. No mathematical field is altered. Historical producer wording requesting review is superseded by the separate terminal independent acceptance; the historical source itself remains unchanged.

The earlier frozen-direction diagnostic motivated the repair but is not a proof/runtime dependency of the complete repaired certificate, so discovery arrays and diagnostic vectors are excluded. Bulk moment JSONL is excluded and regenerated exactly from the same-support source version.

## Complete clean replay

Use Python 3.12 (tested) and `python-flint==0.9.0` from `../spectral/requirements.txt`:

```sh
python research/rh/spectral-repair/replay.py --report /tmp/rh-repair-replay.json
```

Do not run with `python -O`, `python -OO`, or with `PYTHONOPTIMIZE` set: the checkers use assertions, which must remain enabled.

The optional report path must not already exist. The launcher creates a disposable source overlay under the system temporary directory and runs all nine stages: old seventh-power receipt, initial64/cache completion, literal scalar preflight, cache isolation, new eighth-power receipt, wrapper preflight, small dense gate, and complete repaired gate.

It validates every one of the 10,437 regenerated moment rows against the base package's canonical nontiming key-indexed digest, all mathematical fields of the old prerequisite and new repair receipts, emitted source maps, the complete2049+72+72 signs, and unchanged base/delta source files and references. The base package and this package are not run in place. Logs and generated arrays remain in the disposable tree; they are not committed.

The full independent mathematical acceptance is in `reference/rh_attack_cycle_20261030/independent_review/GENERIC_X161_POWER8_COMPLETE_EVEN_POSITIVITY_AUDIT.{md,json}`. A successful packaging replay is a separate clean-checkout verification, not a newly independent mathematical audit.
