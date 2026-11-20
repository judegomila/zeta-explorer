# Exact grouped remainder and fixed-reference transfer obstruction

2026-11-02. Derivation from the reference theorem; independent review pending. No full-theta sign is assumed.

## Spatial grouping without losing the closure correction

Let f be the smooth whole-line first summand in FULL_LINE_FIRST_THETA_REFERENCE.md, τ=ψ−f, and w_a(h)=h sinh(2ah). The actual even full profile gives
C_a=(1/2)∫_R w_a ψ(h−v)ψ(h+v)dh,
whereas D_a uses f in both slots. Exactly,

C_a−D_a=(1/2)∫_R w_a[f(h−v)τ(h+v)+τ(h−v)f(h+v)+τ(h−v)τ(h+v)]dh.    (1)

Equivalently, group on h≥0:
E_high=∫_0∞w_a[ψ(h−v)ψ(h+v)−f(h−v)f(h+v)]dh,
E_close=(1/2)∫_0∞w_a[f(h−v)f(h+v)−f(−h−v)f(−h+v)]dh,
C_a−D_a=E_high+E_close.                                             (2)

The first group includes all higher-summand cross products. The second is the negative-h closure correction. Neither group has a proved favorable kernel sign. Calling τ a small positive tail on the entire real line would be false.

## Exact spectral identity

Define
Q(z)=(1/2)z(z−1)π^(−z/2)Γ(z/2),
G_s(t)=|Q(1/2+s+it)|²,
with removable values interpreted by continuity. The reference Gamma formula simplifies exactly to
hat I_s(2t)=2G_s(t),
so

hat D_a(2t)=[∂_sG_s(t)|_(s=a)−∂_sG_s(t)|_(s=−a)]/4.                (3)

By the completed-zeta functional equation, the actual bridge is

hat C_a(2t)=(1/2)∂_a{G_a(t)|ζ(1/2+a+it)|²}.                        (4)

Equations(3)–(4) give an exact spectral remainder, including the log derivative of ζ. Discarding that derivative is not justified.

## High-height comparison and classical universality

Fix0<a<1/2. Put σ=1/2+a and L_t=log(t/(2π)). Standard Gamma asymptotics give
∂_s logG_s(t)=L_t+O_a(t^−2),
G_(−a)(t)/G_a(t)=(t/(2π))^(−2a)(1+O_a(t^−2)).
Therefore
hat D_a(2t)=(1/4)G_a(t)L_t(1+o(1)).

Choose any fixed nonzero complex number c. Classical Voronin universality on a disk strictly inside1/2<Re z<1 gives arbitrarily large shifts on which ζ approximates the constant c with errors tending to0. Cauchy's estimate on a smaller disk also gives ζ′→0 at σ. On such a sequence,

hat C_a(2t)/hat D_a(2t)→2|c|².                                    (5)

By diagonal selection,0 is also a limit point, and positive ratios are unbounded. No assertion that the overall liminf equals0 is made, since that would require a nonnegativity statement not established here.

Consequences:
- No fixed q<1 can give C_a≽(1−q)D_a for all real-node tests; stationary Loewner domination is pointwise spectral domination, contradicted by the zero-limit sequence.
- No finite uniform absolute bound |hat C_a−hat D_a|≤q hat D_a is possible, since the ratios are unbounded.
- This does not disprove C_a≽0, degree-dependent bounds, or an arithmetic-adaptive reference with its full correlated derivative terms.

The external input is the established classical disk universality theorem, not an RH assumption and not an effective approximation theorem. Its precise statement was read in Lamzouri–Lester–Radziwill, arXiv:1611.10325v2, Introduction(1.2), https://arxiv.org/html/1611.10325. This is the same external input already independently reviewed in ../relative_tail_v6/UNIVERSALITY_GAP_OBSTRUCTION.md; the reference and factor2 here are different and explicitly derived.

## Low-height cost warning

Authored high-precision sanity checks give D_(.1)(0)≈0.1845399085, whereas the actual C_(.1)(0) is on the order of0.00315. These are exploratory comparisons, not a validated relative certificate. They show that the full-line closure is a large correction already at the diagonal. Positivity of the reference does not make the required transfer small.
