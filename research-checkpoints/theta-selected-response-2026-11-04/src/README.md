# Actual-theta lower bounds for the selected determinant response

2026-11-04. This continuation proves an independent all-degree obstruction to overly rapid selected response and a stronger source comparison. The requested upper estimate a_n(s_n)=1+o(s_n) remains open.

Let N=n+2, L=log N, W_*=|Gamma(9/4+it/2)|^2, W[p]=||Fp||^2, X[p]=||Fp'+2F'p||^2, and H[p]=||Fp'||^2. F is the exact theta transform. P_n is the complete monic X-selected polynomial, A_n=X[P_n], and h_n=H[P_n]/A_n.

## Main actual-theta results

1. A new L2 strip argument gives the all-polynomial value floor

       W[p] >= c N^(-1/2)L^(-5/2) ||p||_(W_*)^2.

   The proof combines the exact theta Fourier cutoff with the Euler product strictly to the right of Re s=1. An elementary local cancellation of the zeta pole improves the uniform logarithmic factor. No critical-line zero assumption is made, and real zeros remain in the value form.

2. The monic derivative minimum and the audited natural-trial source upper give, at every n>=1,

       h_n >= c N^(-1/2)L^(-11/2).

   Therefore, for the growing finite-theta model, with full selection and all cross terms,

       a_(n,M)(s_n)-1 >= c s_n N^(-1/2)L^(-11/2),
       s_n=N^(-2)L^(-7/4),
       M=ceil(K sqrt(N log N)),

   for sufficiently large n and sufficiently large fixed cutoff constant K. Every all-degree upper estimate O(s_n N^(-p)) with p>1/2 is false. This lower bound does not disprove a_n(s_n)=1+o(s_n).

3. A shifted L2 Hardy estimate independently improves the actual source floor:

       X[p] >= c_a (N L)^(-a) ||p||_(W_*)^2,    every fixed a>1/2.

   In particular, taking a=3/4 yields a relative derivative operator bound kappa_n<=C(N L)^(7/4). At the requested s_n, the selected determinant secant is consequently a relative approximation to h_(n,M) with error O(N^(-1/4)). This supplies no vanishing upper bound for h_(n,M). A separate uniform endpoint version is recorded with honest constants.

## Supplementary obstruction to using only numerical matrix bounds

A single nested infinite matrix pair satisfies favorable natural diagonal ratios, stronger source floors, polylogarithmic conditioning, parity, the fixed-low/high Gram wedge, and even J<=G/2, yet its complete selected ratio tends to 1/60 at every degree. This is an all-degree diagnostic, not a theta counterexample. It explicitly fails the actual Pollaczek displacement identity and a separate nonlocality input. The precise scope is stated in its note.

## Frozen files

- VALUE_FORM_FLOOR_AND_SELECTED_RESPONSE_LOWER_BOUND.md
- IMPROVED_SOURCE_FLOOR_BY_SHIFTED_L2_HARDY.md
- VALUE_AND_SOURCE_FLOOR_AUDIT.md
- NESTED_ALL_DEGREE_MATRIX_OBSTRUCTION.md
- NESTED_ALL_DEGREE_MATRIX_OBSTRUCTION_AUDIT.md
- README.md
- AUDIT.md
- SHA256SUMS

Those eight files are the exact backup allowlist. Working drafts, numerical sanity checks, and their outputs are excluded. The theorem proofs do not use numerical sign evidence. Earlier frozen packages and all 4CT work remain unchanged.

No selected signed-defect positivity, selected coherence, or RH conclusion is established. In particular a lower bound on H[P_n]/A_n is not a lower bound on the coherence numerator U_n/A_n.
