# Public publication record

## Scope and status

This checkpoint makes the arithmetic theta and twin-ladder research accessible from [Explore Riemann](https://exploreriemann.com/#/rh-arithmetic-theta-geometry). Version 0.2 contains proved finite mathematics, sharpened arithmetic sublemmas, exact completion equivalences, and a source dependency map. It does not prove RH or certify the complete external Lean proof. Review is internal and AI-assisted.

## Provenance and revision

The first geometric continuation was recorded in historical MathExplorer commit `2c628f61cdee35e3af7a2e23da43eaaf716fb8dd`, on branch `codex/rh-arithmetic-theta-completion-2026-11-20`. It became public through [PR 40](https://github.com/judegomila/zeta-explorer/pull/40), merged as `094201faa78f6537517a5579a59b07010befbd50`.

Version 0.2 revises that geometric PDF, source, audit, review and app module. It adds the arithmetic-family and completion proofs, source map, static audit, checkers and proof obligations. It does not claim byte identity with the historical manuscript. Git history preserves the prior version; current [SHA256SUMS](geometric-compression/SHA256SUMS) and app artifact records identify the revised files.

The earlier `release-v0.1` arithmetic-theta manuscript and `twin-ladder-refinement` package are unchanged. Public copies provide the analytic dependencies; access to the historical private repository is unnecessary.

## Public dependencies and evidence

- [Earlier conditional manuscript](release-v0.1/RH_Arithmetic_Theta_Completion.pdf), with [editable source](release-v0.1/RH_Arithmetic_Theta_Completion.tex): sparse Pick criterion and full-ray Mellin–Landau endpoint.
- [Prime-ladder ramp and averaging note](twin-ladder-refinement/RAMP_AND_AVERAGING.md).
- [Revised geometric package](geometric-compression/README.md), including proofs, exact checkers and internal review.
- [Proof-obligation register](geometric-compression/PROOF_OBLIGATIONS.md) and [formal verification protocol](geometric-compression/VERIFICATION_PROTOCOL.md).

The external comparison is pinned to `leanprover-community/riemann-hypothesis@c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2`. Its source tree is byte-identical to the previously inspected `712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9`. Generic S76 and the selected Main arithmetic route are now located. Deep dependencies and final replay remain unverified here. Only citations, hashes, independently written commentary and mathematical derivations are included; the external Lean tree is not redistributed.
