# Signed mechanisms in the growing finite-theta model

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves 7 frozen source files byte-for-byte, including their original checksum manifest. Earlier checkpoints, the integrated paper, application code, CI workflows, and live 4CT work are not modified.

The [frozen source summary](src/README.md) and [audit](src/AUDIT.md) test proposed signed mechanisms after the [uniform finite-arithmetic reduction](../theta-finite-arithmetic-reduction-2026-11-04/README.md). The seven-file allowlist is preserved exactly. The working draft directory is excluded.

The [boundary audit](src/FINITE_BOUNDARY_DISPLACEMENT_AUDIT.md) identifies a strictly nonzero degree-four Hankel defect for the reflected finite model, together with its Fourier polynomial corrections and bounded-rank displacement terms. The negative Laguerre-potential tail of the naive reflected Fourier transform is not the signed form Q_M: the essential boundary corrections remain.

The [single-summand audit](src/SINGLE_SUMMAND_SELECTED_NEGATIVITY_AUDIT.md) proves H_m[P_(2,m)]/X_m[P_(2,m)] tends to two for the completely selected degree-two polynomial of an individual genuine theta summand. The same limit holds for any fixed monic quadratic. This excludes termwise positivity but does not establish negativity for the complete arithmetic sum with all cross terms, or for the full-prefix selected problem.

The [determinant criterion](src/SELECTED_DETERMINANT_SLOPE_CRITERION.md) preserves full selection. For a(s)=A(s)/A(0), where A(s) is the monic minimum of X_M+sH_M, and q(s)=(a(s)-1)/s, it proves q(s) <= h <= (1+s kappa)q(s)/(1+s q(s)). Here h is the exact selected derivative/source ratio and kappa is the source-relative norm of H_M. At s=N^(-2)(log N)^(-7/4), the known polynomial norm bound makes s kappa bounded. A degree-uniform arithmetic estimate a(s)=1+o(s) would therefore imply selected decay. **The degree-uniform selected determinant estimate remains unproved.** Superexponential finite-model accuracy can transfer such an estimate if established, but supplies no such estimate by itself.

The [Laguerre source audit](src/THETA_LAGUERRE_SOURCE_AUDIT.md) distinguishes positivity on every polynomial from the selected-column target. Universal positivity is equivalent to the global first Xi Laguerre inequality; even that stronger statement would yield only a selected ratio at most one, not decay to zero. Inspected literature statements on finite-height positivity, finite-order total positivity, and coefficient inequalities do not supply the missing selected estimate. Recent computational certificate proofs were not independently executed or declared verified.

No fully selected sign, selected derivative decay, selected coherence, positive Schur-defect scale, global Laguerre positivity, or RH conclusion is claimed. Historical sibling-directory references in the frozen sources are retained as provenance.

## Verification boundary

The supplied analytical results and audits are AI-assisted, not external peer review or machine formalization. This backup verifies preservation integrity and scope, not mathematical proofs or inherited dependencies. No numerical scan or literature-novelty claim is made.

MANIFEST.json records the exact source allowlist, byte lengths, and SHA-256 hashes. The preserved src/SHA256SUMS checks the original Markdown payloads. The outer SHA256SUMS covers every package file except itself. Run `python3 verify_checkpoint.py` to verify exact coverage, both checksum layers, lengths, and scope labels. Only this new checkpoint directory is proposed for publication.
