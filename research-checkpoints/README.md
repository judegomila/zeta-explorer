# Research checkpoints

This directory holds self-contained snapshots of active mathematical research
programs. They are kept separate from the web explorer's production claims and
must be read with their own status and claim-discipline files.

## Xi prolate–Weil bridge

`xi-prolate-bridge/` is the 2026-08-07 proof-item-zero checkpoint for a direct
analytic Riemann-hypothesis research program. It is not part of the
de Bruijn–Newman upper-bound campaign.

The package records source-pinned matrix formulas, independent producer and
verifier paths, normalization and residual audits, adversarial tests, vendored
source bytes, and replayable artifacts. Its formal state is `P0_INVALIDATED`:
the repository contains no proof of the Riemann hypothesis, and its numerical
diagnostics are not theorem claims.

The current checkpoint retains the source-pinned compact-BV baseline and adds
a source-pinned complete-series hybrid sampling theorem.  On the locked
exponential schedule it proves projection sampling `o(d_4)`, `o(d_8)`, and
complete-remainder sampling `o(d_6)`, so the common normalization-free shift
`epsilon_lambda I` is negligible at the first odd defect scale.  This does not
make the normalized Ritz bound `epsilon_lambda/a^2` small without separate
control of `a`.  It does not prove the growing-window
defect-relative Bessel bound, reciprocal defect sum, either signed sector
floor, a shifted Schur sign, residual-action decay, equation (5.2), determinant
convergence, or RH.  The formal state remains `P0_INVALIDATED`.

Start with:

1. `xi-prolate-bridge/README.md`
2. `xi-prolate-bridge/DIRECT_RH_ATTACK.md`
3. `xi-prolate-bridge/PROOF_OBLIGATION_LEDGER.md`
4. `xi-prolate-bridge/FALSE_SHORTCUTS.md`
5. `xi-prolate-bridge/SOURCES.md`
6. `xi-prolate-bridge/P0_SOURCE_LOCK.json`

For a full local replay, run `./replay.sh` from inside the checkpoint directory.
