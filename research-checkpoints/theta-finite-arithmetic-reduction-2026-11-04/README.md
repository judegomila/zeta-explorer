# Uniform finite-arithmetic reduction of the actual theta forms

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves 4 frozen source files byte-for-byte, including their original checksum manifest. Earlier checkpoints, the integrated paper, application code, CI workflows, and live 4CT work are not modified.

The [frozen source summary](src/README.md) and [full derivation](src/UNIFORM_FINITE_ARITHMETIC_AUDIT.md) give a degree-uniform approximation of the actual positive source and derivative forms. For N=n+2 and each fixed A>0, a cutoff M=ceil(K_A sqrt(N log N)) yields errors at most exp(-A N log N) times the actual source form, uniformly over every polynomial of degree at most n. A numerical value of K_A is not supplied.

The construction truncates each true derivative separately on the positive half-line and reflects with its exact parity. The derivative polynomial includes the necessary factor k. These piecewise functions are not claimed to be weak derivatives of one reflected finite kernel. All ordered arithmetic pairs, mixed source terms, parity factors, and Plancherel factors are retained in the finite incomplete-gamma expressions.

The reselected monic minimum and derivative/source ratio approximate their actual counterparts after accounting for the source-relative target norm. This is an approximation equivalence, not a proof that either selected derivative/source ratio decays. Positive definiteness of the approximate source does not imply positivity of its difference with the derivative form.

**Finite model approximation does not prove signed cancellation.** The finite special-function model is not a numerical sign certificate or an all-degree sign proof. Relative Schur-defect accuracy also requires separately controlled second minima and a positive defect scale. These are not supplied. No fixed cutoff independent of n, numerical bit complexity, selected coherence, defect positivity, or RH result is asserted.

The preserved [audit](src/AUDIT.md) records the exact limits. Historical sibling-directory references inside the frozen files are provenance and are not rewritten here. The prior [polynomial comparison](../theta-polynomial-comparison-2026-11-04/README.md) and [selected-form transfer thresholds](../theta-polynomial-selected-obstruction-2026-11-04/README.md) identify the principal inherited inputs.

## Verification boundary

The supplied analytical results and audits are AI-assisted, not external peer review or machine formalization. This backup verifies preservation integrity and scope, not mathematical proofs or inherited dependencies. No numerical scan or literature-novelty claim is made.

MANIFEST.json records the exact source allowlist, byte lengths, and SHA-256 hashes. The preserved src/SHA256SUMS checks the original Markdown payloads. The outer SHA256SUMS covers every package file except itself. Run `python3 verify_checkpoint.py` to verify exact coverage, both checksum layers, lengths, and scope labels. Only this new checkpoint directory is proposed for publication.
