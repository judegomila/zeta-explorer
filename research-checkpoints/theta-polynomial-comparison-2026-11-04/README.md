# Actual-theta polynomial comparison checkpoint

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves six frozen source files byte-for-byte, including their original checksum manifest. The working subdirectory is excluded. Earlier frozen evidence and checksums, the integrated paper, application code, CI workflows, and live 4CT work remain unchanged.

**This is an all-degree comparison for the exact actual theta source. Actual escaping-capacity bounds and selected cancellation remain open; no selected coherence or RH proof is supplied.**

## Result and consequences

Read the [frozen source summary](src/README.md), [general-reference proof and corollaries](src/GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md), [full weighted-shift audit](src/WEIGHTED_SHIFT_REFINEMENT_AUDIT.md), [independent strip check](src/REAL_POLYNOMIAL_WEIGHTED_SHIFT_DOMINANCE.md), and [input/scope audit](src/AUDIT.md).

For N=n+2, L=log(n+2), and W_*(t)=|Gamma(9/4+it/2)| squared, every polynomial of degree at most n obeys

    ||p||_(W_*) squared <= C N L^(3/4) X[p].

The constant is degree-independent. The theorem extends from real to complex polynomials by applying the real inequality to their real and imaginary parts. The loss improves the prior exp[C log squared n] comparison to a polynomial scale. The general gamma-reference theorem retains its strict parameter conditions a>1/2 and a+7/2<2lambda; no endpoint-uniform constant is asserted.

The proof uses the exact theta kernel's strip analyticity and double-exponential tails to control all derivative orders, then a fixed zero-free shifted line and a degree-independent weighted strip maximum. Its preliminary subexponential comparison is an independently established input. The Fourier localization is in the Fourier variable, not real-variable source escape.

The elementary natural-reference upper bound gives Gram conditioning at most C N^4 L^(3/4). Adding the separately audited arithmetic trial upper bound sharpens this to C N^2 L^(15/4), including individually source-normalized natural coordinates, and gives selected overlap at least c/[N L^(15/4)]. Those sharper consequences use the inherited Hardy-Z derivative-moment input; the main lower comparison does not. The overlap bound does not approach one.

No actual escaping-capacity bound, selected source escape, negative-excess cancellation, H/X tending to zero, relative Schur-excess estimate, new signed-rung positivity, or RH conclusion follows. Polynomial conditioning alone does not turn scalar moment errors into the required growing-space operator error or relative-scale control.

## Dependencies and verification boundary

The source audit gives exact inherited inputs and their role. Historical sibling-folder references in frozen files are provenance. The preliminary comparison, elementary natural upper, and optional arithmetic trial results are in the [Pollaczek checkpoint](../theta-pollaczek-2026-11-04/README.md). The exact theta-strip input is in the [preceding fixed-row proof](../theta-selected-relative-locality-2026-11-04/src/FIXED_ROW_STRETCHED_EXPONENTIAL.md). No acquired third-party material is copied.

These are AI-assisted analytical derivations and independent audits, not external peer review or machine-formal verification. This backup verifies preservation integrity and scope, not mathematical proofs or inherited analytic inputs. No numerical scan or literature-novelty claim is made.

MANIFEST.json records the exact six-file source allowlist, byte lengths, and SHA-256 hashes. The preserved src/SHA256SUMS verifies five Markdown payloads. The outer SHA256SUMS covers every package file except itself. Run `python3 verify_checkpoint.py` to verify exact coverage, both checksum layers, byte lengths, and scope labels. Preparation also compares every copied source with its frozen original. Only this new checkpoint directory is proposed for publication.
