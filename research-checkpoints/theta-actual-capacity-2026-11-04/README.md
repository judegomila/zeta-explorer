# Actual-Xi capacity continuation checkpoint

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves eight frozen source files byte-for-byte, including their original checksum manifest. It continues the [escaping-cell capacity checkpoint](../theta-escaping-capacity-2026-11-04/README.md). Earlier frozen payloads and checksums, the integrated paper, application code, CI workflows, and live 4CT work remain unchanged.

**No actual-theta capacity-tail bound, selected negative cancellation, selected coherence, or RH proof is supplied. The countermodels are different functions from the actual theta transform.**

## Preservation-boundary correction

The earlier frozen multiplier note said that the fixed-reference lower comparison was not preserved. That wording was too strong. The new [preservation proof](src/VALLEY_MODEL_RETAINS_SUBEXPONENTIAL_COMPARISON.md) and [independent audit](src/SPARSE_MULTIPLIER_REFERENCE_COMPARISON_AUDIT.md) establish the all-degree exp[plus or minus C log squared n] source/reference comparison for that same multiplier model, uniformly in its small valley parameters. This continuation supersedes the earlier scope statement without rewriting the historical payload. The sharp upper envelope remains unestablished for that multiplier model; a different zero-surgery construction below preserves it.

## Results and limits

Read the [frozen source summary](src/README.md).

- The [actual-Xi source audit](src/ACTUAL_XI_LAGUERRE_SOURCE_AUDIT.md) derives logarithmic-curvature localization from the canonical product. Positive curvature is confined to intervals around hypothetical nonreal conjugate pairs. If there were only finitely many off-line zeros, sufficiently remote capacities would be zero and the positive operator compact. This conditional observation does not assert finite exceptions, and compact positive excess must not be identified with RH. First-order Laguerre positivity is distinguished from the full generalized hierarchy. Published finite-range zero verification is an external finite-range dependency, not a new computation or a tail theorem.
- The [conditional actual-pair test](src/ACTUAL_THETA_PAIR_CAPACITY_TEST.md) proves B_I >= (31/500)(m/M)^2(h/delta)^5 under the explicit residual-factor bounds, a zero-free real window, delta <= h/4, and D delta^2 <= 1/4. No actual pair or sequence of such windows is asserted to exist.
- The [sparse multiplier preservation proof](src/VALLEY_MODEL_RETAINS_SUBEXPONENTIAL_COMPARISON.md) retains the full real-zero geometry and the stated two-sided source/reference comparison while escaping capacities diverge. The [audit](src/SPARSE_MULTIPLIER_REFERENCE_COMPARISON_AUDIT.md) checks uniformity in the valley parameters and the finite-degree extension. Operator-norm divergence does not establish failure of diagonal decay on the selected basis.
- The separate [zero-surgery construction](src/ZERO_SURGERY_PRESERVES_SHARP_REFERENCE_BOUNDS.md), with its [independent audit](src/ZERO_PAIR_REPLACEMENT_INDEPENDENT_AUDIT.md), also preserves the sharp gamma upper majorant, the original all-degree lower and upper comparison scales, the uniform Pollaczek competitor, and the stated coarse zero counting while capacities diverge. It removes only the specified sparse copies of actual real zeros and introduces near-real conjugate quartets. Unlike the multiplier model, it does not preserve every real zero. Neither exact theta arithmetic nor positivity of the inverse Fourier kernel is preserved or asserted.

The actual-Xi capacity tail and selected negative cancellation remain open. The countermodels delimit the precise structural inputs tested here; they neither prove nor disprove selected coherence or RH.

## Dependencies and verification boundary

The frozen source files retain original sibling-folder names as historical provenance. The [prior capacity proof](../theta-escaping-capacity-2026-11-04/src/CELL_POSITIVE_EXCESS_CAPACITY_CRITERION.md), [original multiplier model](../theta-escaping-capacity-2026-11-04/src/SPARSE_ENTIRE_VALLEY_COUNTERMODEL.md), and [earlier actual-source comparison](../theta-pollaczek-2026-11-04/comparison/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md) are in preceding checkpoints. Primary literature links and the limited targeted-search coverage appear in the source audit. No acquired third-party article is copied.

The mathematical reviews are AI-assisted analytical audits, not external peer review or machine-formal verification. This backup verifies preservation integrity and scope, not the mathematical proofs or inherited analytic dependencies. No new numerical scan or literature-novelty claim is made.

MANIFEST.json records the exact eight-file source allowlist, byte lengths, and SHA-256 hashes. The preserved src/SHA256SUMS verifies seven Markdown payloads. The outer SHA256SUMS covers every package file except itself. Run `python3 verify_checkpoint.py` to verify exact coverage, both checksum layers, byte lengths, and scope labels. Preparation also compares every copied source with its frozen original. Only this new checkpoint directory is proposed for publication.
