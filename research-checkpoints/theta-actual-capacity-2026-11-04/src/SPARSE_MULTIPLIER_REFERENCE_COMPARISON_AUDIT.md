# Sparse multiplier: uniform all-degree reference comparison

2026-11-04. Independent audit continuation. This supplements, without editing, the frozen sparse entire valley countermodel. No RH or actual selected-coherence conclusion is asserted.

## Result and corrected preservation boundary

For the sparse multiplier H and actual-theta baseline F_0 of SPARSE_ENTIRE_VALLEY_COUNTERMODEL.md, set F_tilde=F_0 H and X_tilde[p]=∫|F_tilde p′+2F_tilde′p|². Let W=|Gamma(4+it/2)|² and c=pi/2. There is C independent of every admissible ε_j and of n,p such that

    exp[−C log²(n+2)] ||p||_W² ≤ X_tilde[p]
       ≤ exp[C log²(n+2)] ||p||_W²,   deg p≤n.            (1)

The constants may depend on the fixed baseline and fixed center sequence. Thus the frozen countermodel's statement that the lower subexponential reference comparison is not preserved is too restrictive: that comparison IS preserved, and so is a two-sided subexponential comparison. The sharp pointwise bound F_tilde²+F_tilde′²≤CW and polynomial upper bound C(n+1)||p||_W² are not established by this argument. Neither is the sharper fixed-competitor estimate X_tilde[M_n]≤Cb_n.

## Uniform multiplier bounds

Write R_n=An+1, A=16/c, and δ_n=(n+2)^−6. On |t|≤R_n, exclude the δ_n neighborhoods of the real centers ±c_j with c_j≤2R_n. This larger, simpler exclusion contains any real points within complex distance δ_n of the added roots ±c_j±iε_j. There are O(log log(n+3)) such indices, and the added excluded measure is O(δ_n log log(n+3)).

At a retained point each included factor satisfies

    H_j(t) ≥ δ_n^4/(c_j²+1)² ≥ exp[−C log(n+2)].

For c_j>2R_n, its four linear root factors obey

    H_j(t) ≥ (1−R_n/c_j)^4.

Since ∑_{c_j>2R_n} R_n/c_j is uniformly bounded and each ratio is <1/2, this tail product is bounded below by a positive constant. Therefore

    H(t) ≥ exp[−C log(n+2) log log(n+3)]                  (2)

at every retained point. All these constants are uniform in ε, including the auxiliary limiting choices ε_j=0.

The frozen product bound and fixed-radius Cauchy estimates give uniformly

    |H(t)|+|H′(t)| ≤ C exp[C log²(|t|+3)].              (3)

The baseline envelope consequently yields

    F_tilde(t)²+F_tilde′(t)²
       ≤ C W(t) exp[C log²(|t|+3)].                     (4)

Using W(t)≈(1+|t|)^7e^(−c|t|), it follows that for t≥0

    ∫_t^∞ F_tilde(s)² ds
       ≤ C(1+t)^7 exp[−ct+C′log²(t+3)].                 (5)

For example, for large t the logarithmic derivative of (1+t)^7 exp[C log²(t+3)] is at most c/2, so integration gains only a fixed constant. Bounded t are absorbed into C. Reflection gives the left-tail estimate.

## Lower comparison

Intersect the baseline actual-theta good set from ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md with the retained set above. Its total excluded measure remains O(n^−5 log(n+2)), which is o(n^−2). On this intersection, the baseline estimate and (2) imply

    |F_tilde(t)|^4
       ≥ C^−1(1+|t|)^7 e^(−2c|t|)
                         exp[−C log²(n+2)].             (6)

For a polynomial p, the exact identity

    (F_tilde² p)′=F_tilde (F_tilde p′+2F_tilde′p)

and the vanishing boundary term at the appropriate infinity give, by Cauchy–Schwarz and (5)–(6),

    X_tilde[p] ≥ exp[−C log²(n+2)] e^(−c|t|)|p(t)|²     (7)

at every retained good point. Here |t|≤R_n absorbs the extra tail loss into log²(n+2).

The baseline weighted-maximum argument applies unchanged: if

    M_c(p)=sup_t e^(−c|t|/2)|p(t)|,

its maximum occurs in [−An,An]. Markov's inequality supplies an interval of length comparable to n^−2 on which e^(−c|t|)|p(t)|²≥c_0 M_c(p)². Since the whole excluded measure is o(n^−2), that interval contains a retained good point. Hence

    X_tilde[p] ≥ exp[−C log²(n+2)] M_c(p)².

Finally ||p||_W²≤C(n+1)^8M_c(p)² proves the lower half of (1).

## Upper comparison: a weighted multiplier lemma

For each fixed K there is K′ such that, uniformly over polynomials deg p≤n,

    ∫ W(t)exp[K log²(|t|+3)]|p(t)|²dt
       ≤ exp[K′log²(n+2)] ||p||_W².                     (8)

Here is a direct proof. The same Markov neighborhood of a weighted maximizing point gives

    ||p||_W² ≥ c_0 n^−2 M_c(p)²,                       (9)

using W≈(1+|t|)^7e^(−c|t|). On |t|≤An, the left side of (8) is at most exp[O(log²(n+2))](n+1)^8 M_c(p)². For |t|≥An, the baseline Chebyshev exterior estimate gives

    e^(−c|t|)|p(t)|²
       ≤ M_c(p)² exp[−2(4−log4)n−(7c/8)(|t|−An)].

For sufficiently large n, the logarithmic derivative of the additional factor (1+|t|)^7exp[K log²(|t|+3)] is ≤7c/16 on this tail. The tail integral is therefore at most exp[O(log²(n+2))]M_c(p)². Combine this with (9) to prove (8).

Apply (4), the source-square bound, and (8) to p and p′. The baseline orthogonal derivative estimate

    ||p′||_W²≤C(n+1)||p||_W²

then gives the upper half of (1).

All large-degree thresholds above are independent of ε. For the finitely many smaller degrees, apply the already proved bound on the single degree-N space at a fixed sufficiently large N and enlarge C. No compactness argument over ε and no ε-dependent finite-dimensional eigenvalue constant is needed.

## Consequences and limitations

The same single globally entire countermodel can therefore have unbounded escaping positive-excess norms while retaining (1), even uniformly across the valley parameters. In particular, the lower comparison does not repair the generic escaping-cell gap.

For its own monic selected minima A_tilde_n and reference monic norms b_n, (1) gives

    exp[−C log²(n+2)]b_n ≤ A_tilde_n
       ≤ X_tilde[M_n] ≤ exp[C log²(n+2)]b_n.

Thus the exponential-scale monic asymptotic, subexponential Gram conditioning, and subexponential competitor-overlap lower bound survive. These do not imply bounded competitor ratios, selected H/X decay, or an escaping-cell capacity bound. The argument concerns the undilated actual-theta baseline multiplied by H; it does not assert the same lower comparison for the separately mentioned doubled-baseline variant.
