# Exact theta Gram decay and degree-effective partial selection

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves 5 frozen source files byte-for-byte, including their original checksum manifest. Earlier checkpoints, the integrated paper, application code, CI workflows, and live 4CT work are not modified.

The [frozen source summary](src/README.md) and [full derivation](src/UNIFORM_GRAM_AND_PARTIAL_SELECTION.md) give a uniform two-index actual-theta Gram bound, |X(Q_k,Q_j)| <= C r_0^(-j) exp(-c k^(1/3)), with r_0=tan(pi/32). This is a low/high index estimate; it does not supply useful decay near the diagonal j approximately k.

They construct real monic polynomials S_n with exact source orthogonality through degree floor(c_0 n^(1/4)), H[S_n]/X[S_n] tending to one, and absolute-potential ratio O(log^(-2)n). Their source norm divided by the fully selected monic minimum is bounded below by c n^(5/2)/log n and above by C n^(7/2)log^(11/4)n. That ratio diverges rather than approaching one.

**Partial selection is not full selection.** The family is not the fully selected degree-n endpoint. It rules out an inference from polynomial norm comparison and a growing orthogonality prefix to selected derivative decay; it does not establish failure or success for the actual fully selected sequence. The componentwise favorable estimate applies before projection, while the full-form estimates survive projection. No selected cancellation, defect sign, target-form positivity, source escape for the selected sequence, or RH conclusion follows.

The separate [primary-source audit](src/HARDY_Z_DERIVATIVE_MEAN_SQUARE_SOURCES.md) records unconditional real-t Hardy-Z derivative mean squares for orders zero, one, and two, and deduces weighted absolute integrability for each fixed lambda>11/4. No endpoint lambda=11/4 estimate, signed cancellation, or uniformity as lambda decreases to that endpoint is claimed. The frozen note explicitly distinguishes the potential sign conventions; its absolute-integrability conclusion is unchanged by reversing that sign.

The preserved [audit](src/AUDIT.md) states the proof boundaries and inherited inputs. Historical sibling-directory references inside the frozen files are provenance and are not rewritten here. No third-party source text beyond the already frozen research notes is acquired or copied by this staging step.

## Verification boundary

The supplied analytical results and audits are AI-assisted, not external peer review or machine formalization. This backup verifies preservation integrity and scope, not mathematical proofs or inherited dependencies. No numerical scan or literature-novelty claim is made.

MANIFEST.json records the exact source allowlist, byte lengths, and SHA-256 hashes. The preserved src/SHA256SUMS checks the original Markdown payloads. The outer SHA256SUMS covers every package file except itself. Run `python3 verify_checkpoint.py` to verify exact coverage, both checksum layers, lengths, and scope labels. Only this new checkpoint directory is proposed for publication.
