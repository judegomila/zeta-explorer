# Actual-theta selected response lower bounds

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves eight frozen source files byte-for-byte, including their original checksum manifest. Working drafts, numerical sanity checks, and outputs are excluded. Earlier frozen payloads and checksums, the integrated paper, application code, CI workflows, and live 4CT work remain unchanged.

**The requested upper estimate a_n(s_n)=1+o(s_n) remains open. The new actual-theta lower bounds are compatible with slower o(s_n) response. The nested matrix example is explicitly non-theta and does not disprove the actual-theta upper estimate, selected coherence, or RH.**

## Actual-theta results

Read the [source summary](src/README.md), [value floor and selected response lower bound](src/VALUE_FORM_FLOOR_AND_SELECTED_RESPONSE_LOWER_BOUND.md), [improved source floor](src/IMPROVED_SOURCE_FLOOR_BY_SHIFTED_L2_HARDY.md), and [independent analytic audit](src/VALUE_AND_SOURCE_FLOOR_AUDIT.md).

For N=n+2, L=log N, and the natural gamma reference W_*, the value-form theorem gives

    W[p] >= c N^(-1/2)L^(-5/2) ||p||_(W_*) squared.

Using the monic derivative minimum and the separately audited natural-trial source upper, the exact full selected ratio h_n=H[P_n]/A_n satisfies

    h_n >= c N^(-1/2)L^(-11/2), n>=1.

At the prescribed s_n=N^(-2)L^(-7/4), this transfers to the fully reselected finite-theta model with M=ceil(K sqrt(N log N)), for sufficiently large fixed K and sufficiently large degree. Its response has the same lower bound multiplied by s_n. All actual-theta cross terms remain present. This excludes degree-uniform O(s_n N^(-p)) upper response for p>1/2, but does not exclude the requested o(s_n) upper response. The lower bound on H[P_n]/A_n is not a lower bound on the separate coherence numerator U_n/A_n.

Independently, the shifted L2 Hardy argument gives X[p] >= c_a (N L)^(-a)||p||_(W_*) squared for every fixed a>1/2. The fixed-a constants are not claimed uniform at a=1/2. A separate endpoint estimate in the source note tracks the necessary logarithmic costs. These stronger floors sharpen the relative comparison between the selected secant and h_n; they do not establish a vanishing upper bound for either quantity.

## Non-theta matrix diagnostic

The [single nested matrix construction](src/NESTED_ALL_DEGREE_MATRIX_OBSTRUCTION.md), checked in its [independent audit](src/NESTED_ALL_DEGREE_MATRIX_OBSTRUCTION_AUDIT.md), retains the stated favorable numerical matrix bounds, parity, prefix consistency, nonzero derivative cross terms, and even J<=G/2. Its complete selected ratio nevertheless tends to 1/60 at every degree. It explicitly fails the actual Pollaczek second displacement identity and a separate nonlocality input. It is a diagnostic of those numerical assumptions, not a theta counterexample or a conclusion about RH.

## Dependencies and verification boundary

The [scope audit](src/AUDIT.md) separates new actual-theta estimates, inherited inputs, and the remaining upper-bound gap. Original sibling-folder references in frozen sources are provenance. Backed-up inputs include the [finite arithmetic reduction](../theta-finite-arithmetic-reduction-2026-11-04/src/UNIFORM_FINITE_ARITHMETIC_AUDIT.md), [selected determinant slope criterion](../theta-finite-arithmetic-sign-2026-11-04/src/SELECTED_DETERMINANT_SLOPE_CRITERION.md), [polynomial-comparison proof](../theta-polynomial-comparison-2026-11-04/src/GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md), and [natural-family arithmetic estimates](../theta-pollaczek-2026-11-04/README.md).

The proofs receive independent AI-assisted analytical checks, not external peer review or machine formalization. This backup verifies preservation integrity and scope, not mathematical proofs or inherited dependencies. Numerical sign evidence is not used as proof; numerical working files and acquired third-party material are not copied. No literature-novelty claim is made.

MANIFEST.json records the exact eight-file source allowlist, byte lengths, and SHA-256 hashes. The preserved src/SHA256SUMS verifies seven Markdown payloads. The outer SHA256SUMS covers every package file except itself. Run `python3 verify_checkpoint.py` to verify exact coverage, both checksum layers, byte lengths, and scope labels. Preparation also compares every copied source with its frozen original. Only this new checkpoint directory is proposed for publication.
