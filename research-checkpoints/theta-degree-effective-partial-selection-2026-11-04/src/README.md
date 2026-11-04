# Exact theta Gram decay and degree-effective partial selection

2026-11-04. Actual-theta analytic continuation of the signed middle-range problem. No RH, target-form positivity, full selected coherence, numerical scan, or live 4CT edit is claimed.

## Uniform two-index arithmetic estimate

For the natural Pollaczek family Q_j=P_j^(9/4)(t/2;π/2), there are fixed constants C,c>0 and r_0=tan(π/32) such that

    |X(Q_k,Q_j)| ≤ C r_0^(−j) exp(−c k^(1/3)), j,k≥0.

The proof uses the exact bivariate theta Gram kernel and its double-exponential convolution continuation, uniformly in a second generating parameter. It retains the source cross terms. Symmetry gives the reversed bound too. This is useful for a low/high index wedge, not near the diagonal j≈k.

## A sharp limitation of incomplete selection, using actual theta forms

There are real monic degree-n polynomials S_n, with parity n, exactly X-orthogonal to every polynomial through degree floor(c_0 n^(1/4)), satisfying

    H[S_n]/X[S_n] → 1,
    ∫ |V|S_n² / X[S_n] = O(log^(−2)n),
    c n^(5/2)/log n ≤ X[S_n]/A_n
                      ≤ C n^(7/2)log^(11/4)n.

Here A_n is the fully selected monic minimum and V=2(F'²−FF''). Thus both positive and negative signed excess are small for this family, while its derivative/source ratio tends to one. The family lies within a polynomial norm factor of the minimum and has an explicitly growing orthogonality prefix. It is NOT the fully selected endpoint and remains far from relative minimality.

The construction starts from the actual unfavorable lambda=4 signed synthesis, removes natural degrees below n^(3/4), and then projects onto the exact source orthogonal complement of the prefix. The new two-index bound makes that correction exponentially small in n^(1/4). All mixed terms are controlled by the actual positive forms; the absolute-potential estimate has its own proof and is not inferred from a signed difference.

Before projection, every retained natural component has H/X=O(1/log n). Projection introduces negligible low-degree components, so that componentwise statement is not falsely extended to every component afterward. Full H/X and absolute-potential conclusions do survive the exact projection.

This rules out a generic inference from polynomial conditioning, polynomial monic near-minimality, and an n^(1/4)-sized selection prefix. It does not address full degree-n endpoint selection, source escape for the actual selected sequence, or the missing signed cancellation there.

## Additional verified arithmetic input

The literature audit verifies unconditionally, with the real-t Hardy-Z convention,

    ∫_0^T |Z^(j)(t)|²dt ≪_j T log^(2j+1)(2T), j=0,1,2.

It consequently proves integrability of F²/W_lambda and |V|/W_lambda for every fixed lambda>11/4. This additional input is recorded for further work; it is not needed for the core partial-selection construction, which uses an elementary pointwise estimate. No endpoint lambda=11/4 claim is made.

## Files and boundary

- `UNIFORM_GRAM_AND_PARTIAL_SELECTION.md`: full independently checked uniform kernel and actual partial-selection proof.
- `HARDY_Z_DERIVATIVE_MEAN_SQUARE_SOURCES.md`: primary-source and normalization audit for the additional derivative mean-square input.
- `AUDIT.md`: cross-checks and exact limitations.
- `SHA256SUMS`: hashes of the four payloads.

These are AI-assisted analytic results with independent AI-assisted audits, not external peer review or machine formalization. No literature-novelty claim is made. All earlier frozen payloads remain unchanged.
