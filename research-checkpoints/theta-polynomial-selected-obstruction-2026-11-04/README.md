# Polynomial comparison applications to the selected problem

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves six frozen source files byte-for-byte, including their original checksum manifest. It applies the [actual-theta polynomial comparison](../theta-polynomial-comparison-2026-11-04/README.md). Earlier frozen payloads and checksums, the integrated paper, application code, CI workflows, and live 4CT work remain unchanged.

**The signed problem inside the linear degree range remains open. No actual escaping-capacity bound, selected cancellation, selected coherence, or RH proof is supplied.**

## Results and exact limits

Read the [source summary](src/README.md) and [independent checks](src/AUDIT.md).

- The [linear-range theorem](src/LINEAR_DEGREE_RANGE_TAIL.md) controls actual source energy, derivative energy, absolute potential, and weighted value energy outside |t| >= (12/pi)n by C_eta exp(-eta n)X[p], uniformly for every degree-at-most-n polynomial and fixed 0<eta<4-2log6. The explicit prefactor is C(n+2)^11 log(n+2)^(3/4). Both excess signs are covered there. Entire cells wholly outside the range and clipped exterior portions of crossing cells are covered; the interior portions of crossing cells and cells inside the linear range are not discarded. This is a polynomial-source estimate, not a full capacity-operator bound on arbitrary sources. The earlier subexponential comparison also suffices for a qualitative exponential linear-range conclusion; the polynomial comparison provides the stated explicit prefactor.
- The [actual selected-row obstruction](src/ALGEBRAIC_SELECTED_ROW_OBSTRUCTION_AUDIT.md) excludes an eventual bound |X(hq_n,q)| <= C(n+2)^(-s) for every s>5/4, with nonzero fixed real polynomial q and nonconstant real polynomial h. The matching-parity conclusion retains the stated even-h and definite-parity hypotheses. This excludes uniform eventual upper bounds, not a per-index lower bound; the endpoint s=5/4 remains undecided. The supplied infinitely-many-simple-real-zeros input is explicit. No inverse-column conclusion is inferred without its own matrix argument.
- The [form-error and reselection lemmas](src/SELECTED_FORM_ERROR_TRANSFER_THRESHOLDS.md) distinguish target errors on the same selected column from perturbing the source and reselecting its minimizer. In the stated natural orthonormal coordinates, the source floor gives the sufficient operator-error threshold o(N^(-1)log(N)^(-3/4)) for o(1) normalized target error. Uniform entrywise error pays a further dimension factor. No approximation meeting these thresholds is supplied. Relative Schur-excess accuracy also needs separate positivity and size information for Delta_n/A_n, neither established here. Favorable trial derivative bounds are not transferred to the selected polynomial.

Only the far exterior is removed. Actual source concentration and signed contributions inside |t| <= (12/pi)n, selected-only cancellation, the relative Schur-excess scale, defect positivity, and RH remain unresolved.

## Dependencies and verification boundary

Historical sibling-folder references in the frozen sources are provenance. The [polynomial-comparison checkpoint](../theta-polynomial-comparison-2026-11-04/README.md), [natural-family arithmetic results](../theta-pollaczek-2026-11-04/README.md), and [selected resonance proof](../theta-selected-column-locality-2026-11-04/src/NO_FAST_SELECTED_MULTIPLICATION_TAIL.md) preserve the cited inherited inputs. The source audit separates those inputs from the new estimates. No acquired third-party material is copied.

The mathematical reviews are independent AI-assisted analytical checks, not external peer review or machine formalization. This preservation check verifies bytes and scope, not mathematical proofs or inherited analytic dependencies. No numerical scan or literature-novelty claim is involved.

MANIFEST.json records the exact six-file source allowlist, byte lengths, and SHA-256 hashes. The preserved src/SHA256SUMS verifies five Markdown payloads. The outer SHA256SUMS covers every package file except itself. Run `python3 verify_checkpoint.py` to verify exact coverage, both checksum layers, byte lengths, and scope labels. Preparation also compares every copied source with its frozen original. Only this new checkpoint directory is proposed for publication.
