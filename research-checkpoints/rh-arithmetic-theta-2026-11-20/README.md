# Arithmetic theta completion and twin-ladder refinement

Jude Gomila · 20 November 2026

## Mathematical status

This checkpoint contains a conditional research manuscript and its audit package. It is **not an unconditional proof of RH**. The arithmetic Gram comparison, or the alternative growth-data construction and total error estimate, remains open.

## Original release files

The three user-requested deliverables are preserved byte for byte in `release-v0.1/`:

- [RH_Arithmetic_Theta_Completion.pdf](release-v0.1/RH_Arithmetic_Theta_Completion.pdf): 16-page manuscript.
- [RH_Arithmetic_Theta_Completion.tex](release-v0.1/RH_Arithmetic_Theta_Completion.tex): editable source.
- [RH_Arithmetic_Theta_Completion_Package.zip](release-v0.1/RH_Arithmetic_Theta_Completion_Package.zip): the manuscript, source, evidence ledger, proof obligations, source inventory, internal review, exact checker, results, requirements and checksums.
- [SHA256SUMS](release-v0.1/SHA256SUMS): checksums of these three original deliverables.

The analytic core includes the exact signed Weil energy, a prime-truncation bound, a fixed-sequence Pick criterion, a conditional arithmetic Gram transfer, the scalar Mellin/Landau implication and the explicit growth-parameter algebra from the inspected source. The external multiplicative-window theorem is recorded separately; its full dependency chain was not verified here.

The inventory indexes 62 accessible PR records and 304 PR61 lane directories. Selected results and internal audits, together with older manuscript excerpts, were inspected. Inventory coverage does not mean every historical proof or every past chat was independently reverified.

## Twin-ladder refinement

The follow-up is recorded in [RESULT.md](twin-ladder-refinement/RESULT.md). It contains complete derivations of the prime-ladder ramp trace, the folded resolvent and arithmetic heat identity, finite-prime cutoff obstructions, and finite-dimensional averaging constraints. It also records the published precedents and an explicit open arithmetic comparison target. The original release files above remain the historical v0.1 snapshot.

| Document | Content |
|---|---|
| [RESULT.md](twin-ladder-refinement/RESULT.md) | Conclusions, mathematical status, and recommended proof architecture. |
| [LITERATURE_AND_SIGNIFICANCE.md](twin-ladder-refinement/LITERATURE_AND_SIGNIFICANCE.md) | Weil/screw/Pick precedents, project significance, and a proved scalar resolvent growth equivalence. |
| [RAMP_AND_AVERAGING.md](twin-ladder-refinement/RAMP_AND_AVERAGING.md) | Exact arithmetic ramp observable, parity and involution limitations, Heisenberg averaging, and the open arithmetic theorem. |
| [FOLDED_HEAT_ROUTE.md](twin-ladder-refinement/FOLDED_HEAT_ROUTE.md) | Squared-variable fold, exact two-channel decomposition, arithmetic heat formula, countercontrol, and two fixed-cutoff obstructions. |
| [ENERGY_MIXING_TRADEOFF.md](twin-ladder-refinement/ENERGY_MIXING_TRADEOFF.md) | A sharp bound relating global unitary mixing to disturbance of the prime-power Hamiltonian. |
| [REVIEW.md](twin-ladder-refinement/REVIEW.md) | Internal review scope, exact-check instructions, and unresolved obligations. |

No claim of novelty is made for Weil positivity, classical interpolation criteria, or standard Stieltjes/heat-transform equivalences. The project-specific contribution must be evaluated at the level of its exact identities, normalizations, estimates and constructions.

## Geometric compression and public app

The [geometric continuation](geometric-compression/README.md) contains a [10-page manuscript](geometric-compression/RH_Geometric_Compression.pdf), editable source, detailed proofs, a source-dependency audit, internal review, and 20 passing exact algebra checks. Read the [public app research page](https://exploreriemann.com/#/rh-arithmetic-theta-geometry) for the theorem statements, derivation, downloads, and remaining arithmetic obligation.

It proves the finite frame/projection theorem with the inspected source's constants, the singular Schur squared-distance formula, lattice index and metric-cost inequalities, an arithmetic trace-dual bound, and a weighted packing lemma. It also encodes the prime-ladder ramp in an explicit integer with square-root rounding error. The source is pinned to `712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9`.

This is a proved geometric module and conditional completion interface. The arithmetic saving and the identification with the complete Weil/Pick form remain unproved in this synthesis. No full external Lean replay is claimed. The earlier analytic manuscript and ladder refinement above provide the public dependencies; historical MathExplorer commit/PR references may require access to the old repository. See [PUBLICATION.md](PUBLICATION.md) for provenance.
