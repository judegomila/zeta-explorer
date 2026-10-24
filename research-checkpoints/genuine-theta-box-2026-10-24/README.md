# Genuine theta-heat finite-box certificate

24 October 2026. A focused, self-contained research checkpoint.

## Result

The genuine field `G(t,x)=H_t(x)+i partial_x H_t(x)` is nonzero throughout the **closed real parameter box `[1/5,1/3] × [200,220]`**. Its counterclockwise boundary winding, in coordinate order `(t,x)`, is exactly zero. The saved certificates contain 23 continuous boundary segments and 68 closed interior cells.

This is local exclusion of simultaneous zeros of `H` and `Hx`, not exclusion of zeros of `H` alone. It is not a statement about all complex zeros, an RH proof, a new bound for the de Bruijn–Newman constant, or a novelty claim. Direct interior coverage proves this box result without a local collision-index theorem or an all-real initial configuration. No finite asymptotic channel is used as a denominator.

Read [PROOF.md](PROOF.md) for the analytic quadrature contract, complete infinite-series and improper-integral tails, uniform Taylor remainder, and geometric argument. [INDEPENDENT_AUDIT.md](INDEPENDENT_AUDIT.md) records the mathematical/software audit and its limits. The two main precision runs use the same implementation; the audit includes separate exact-rational coverage/winding checks and direct-integral consistency checks, not a second implementation of Arb or external peer review.

## Offline verification: Python standard library only

From the repository root:

```sh
CHECKPOINT=research-checkpoints/genuine-theta-box-2026-10-24
python3 "$CHECKPOINT/verify_manifest.py"
python3 "$CHECKPOINT/verify_saved_certificate.py" \
  "$CHECKPOINT/certificate_384.json" \
  "$CHECKPOINT/certificate_512.json" \
  "$CHECKPOINT/audit_replay_512.json"
```

The offline verifier checks the exact rational saved boxes: strict sign exclusion, complete oriented boundary coverage, closed interior coverage and polygon winding zero. It does **not** independently prove that the actual field is contained in those saved enclosures. That requires the analytic argument and regeneration below. Do not run Python with optimization (`-O`): these checkers deliberately use assertions and must fail closed.

## Regenerate the actual-function enclosures

The recorded environment is Python 3.12.14, python-flint 0.9.0, and FLINT 3.6.0; see [environment.txt](environment.txt). All mathematical inputs are constants in the included scripts. After installing the pinned package, the computation needs no network input, private files or omitted archive.

Use a virtual environment outside this checkpoint and a disposable copy for generated outputs. This preserves the frozen saved bytes and their manifest:

```sh
python3 -m venv .venv-genuine-theta-box
PY=.venv-genuine-theta-box/bin/python
"$PY" -m pip install -r "$CHECKPOINT/requirements.txt"
REPLAY=$(mktemp -d)
cp "$CHECKPOINT/"* "$REPLAY/"
"$PY" "$REPLAY/certify_boundary.py" --bits 384 --output "$REPLAY/replay_384.json"
"$PY" "$REPLAY/certify_boundary.py" --bits 512 --output "$REPLAY/replay_512.json"
"$PY" "$REPLAY/audit_independent.py"
"$PY" "$REPLAY/verify_saved_certificate.py" \
  "$REPLAY/replay_384.json" "$REPLAY/replay_512.json" "$REPLAY/audit_replay_512.json"
```

These POSIX-shell commands continue from the `CHECKPOINT` assignment above. The audit script writes `audit_replay_512.json` beside itself, which is why it is run on a disposable copy. Wall-clock timings vary; regenerated output is not required to be byte-identical. The strict runtime assertions and saved-geometry verifier must pass. Regenerated files do not inherit the frozen manifest hashes.

The small [probe](probe.py) and [probe output](probe_output.txt) are diagnostic provenance only, not part of the proof. [PROVENANCE.md](PROVENANCE.md) distinguishes the preserved computational artifacts from editorial curation and records fresh replay checks.

## Scope separation

This new checkpoint does not modify or depend on merging [PR 15](https://github.com/judegomila/mathexplorer/pull/15), [PR 16](https://github.com/judegomila/mathexplorer/pull/16), or [PR 17](https://github.com/judegomila/mathexplorer/pull/17). Their other research is not imported. No endpoint sign-test extension or unaudited follow-up is included. The global requirement as time approaches zero and height grows remains unproved.
