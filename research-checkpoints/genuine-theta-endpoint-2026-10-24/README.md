# Genuine theta-heat endpoint extension at bounded height

24 October 2026. Separately archived follow-up to the [original finite box](../genuine-theta-box-2026-10-24/README.md).

## Result

The genuine field `G(t,x)=H_t(x)+i partial_x H_t(x)` is nonzero on the **entire closed real parameter box `[0,1/2] × [200,220]`**, including `t=0`. Boundary winding is exactly zero. The certificates contain 194 derivative enclosures, 24 continuous boundary segments and 90 closed interior cells.

This excludes simultaneous zeros of `H` and `Hx` in one bounded-height region. It does not exclude zeros of `H` alone or off-real zeros, prove global reality, establish a new verified-zero-height record or Newman bound, or prove RH. No novelty claim is made. Direct interior coverage, including the entire `t=0` edge, is not a limiting or sampled inference and does not require the proposed collision-index theorem.

The time Taylor order increases from 24 to 40, with space order 112 unchanged. The [proof](PROOF.md) includes all tails and Taylor errors. The [audit](INDEPENDENT_AUDIT.md) separately checks exact coverage and uses the xi/gamma/zeta representation at six endpoint locations to check value and derivative normalization. Those pointwise checks do not replace uniform coverage; they also use the same arithmetic library. No independent implementation of Arb or external peer review is claimed.

## Verify the saved geometry offline

From the repository root, with standard Python 3:

```sh
CHECKPOINT=research-checkpoints/genuine-theta-endpoint-2026-10-24
python3 "$CHECKPOINT/verify_manifest.py"
python3 "$CHECKPOINT/verify_saved_certificate.py" \
  "$CHECKPOINT/certificate_384.json" \
  "$CHECKPOINT/certificate_512.json" \
  "$CHECKPOINT/audit_replay_512.json"
```

The exact-rational verifier checks strict component signs, oriented edge coverage, closed interior coverage and polygon winding zero for the saved boxes. Actual-function containment requires the analytic proof and regeneration below; saved geometry alone is insufficient. Do not run these assertion-based checks with Python optimization (`-O`).

## Regenerate and audit in a disposable copy

The recorded environment is Python 3.12.14, python-flint 0.9.0 and FLINT 3.6.0. All inputs are included as script constants, with no omitted archive or network data dependency. Continuing from the assignment above in a POSIX shell:

```sh
python3 -m venv .venv-genuine-theta-endpoint
PY=.venv-genuine-theta-endpoint/bin/python
"$PY" -m pip install -r "$CHECKPOINT/requirements.txt"
REPLAY=$(mktemp -d)
cp "$CHECKPOINT/"* "$REPLAY/"
"$PY" "$REPLAY/certify_boundary.py" --bits 384 --output "$REPLAY/replay_384.json"
"$PY" "$REPLAY/certify_boundary.py" --bits 512 --output "$REPLAY/replay_512.json"
"$PY" "$REPLAY/audit_endpoint.py"
"$PY" "$REPLAY/verify_saved_certificate.py" \
  "$REPLAY/replay_384.json" "$REPLAY/replay_512.json" "$REPLAY/audit_replay_512.json"
```

The audit writes beside its own script, so a disposable copy preserves the frozen archive and manifest. Wall-clock timings may differ; successful runtime assertions and saved-geometry verification matter, not byte identity of new files. Regenerated outputs do not inherit the source hashes. [PROVENANCE.md](PROVENANCE.md) records source and current inventories, curation and fresh checks.

## What remains open

Reaching `t=0` at this fixed bounded height does not control all heights, nor the joint regime of large height and small time. The original narrower package remains unchanged. No global theory or unrelated fixed-field example is imported into this focused follow-up.
