# The theta primitive operator excludes every nonzero polynomial

Date: 2026-11-04. Status: independent analytical and primary-source dependency audit PASS (AI-assisted, not peer review or a machine-formalized proof). This is a domain obstruction to one imported Sobolev theorem, not a counterexample to derivative coherence or either proposed mismatch bound.

## Statement

Let F be the actual real even theta transform, w=F², and V=2(F′²−FF″). Define, away from the real zeros of F,

N_R(t)=∫_(−∞)^t V(s)R(s)ds,
I[R](t)=N_R(t)/F(t)².

For every nonzero real polynomial R,

I[R] ∉ L²(R,F²dt).                                      (1)

Equivalently, the polynomial part of this primitive operator's L² domain is {0}. This strengthens the earlier existence of some inadmissible polynomial: it applies to every actual X-selected polynomial P_n.

The only external zero-distribution input is an unconditional lower bound showing that the number of distinct positive real Xi zeros grows faster than log T. A concrete primary source is Theorem 1.1 of:

H. M. Bui, Brian Conrey, and Matthew P. Young, “More than 41% of the zeros of the zeta function are on the critical line,” arXiv:1002.4127v2 (2011), https://arxiv.org/pdf/1002.4127 .

That theorem gives a positive lower proportion of simple critical zeros (κ*≥0.4058). Together with the standard Riemann–von Mangoldt counting formula, it implies that the distinct positive real Xi-zero count is ≫T log T, vastly stronger than needed here. Page 1, definitions immediately before Theorem 1.1, explicitly distinguishes the simple-zero count from multiplicity-counted zeros.

This published result and the standard zero-counting formula are external dependencies, not reproved here. Neither RH nor positivity of V or a future signed prefix is used. No numerical zero verification is used.

## 1. Real zeros impose primitive cancellations

If γ is a real zero of F of multiplicity m≥1, then F(t)=a(t−γ)^m+O((t−γ)^(m+1)), a≠0. If N_R(γ)≠0, continuity gives

|I[R](t)|²w(t)=|N_R(t)|²/F(t)² ∼ c|t−γ|^(−2m),  c>0.

This is not locally integrable. Thus I[R]∈L²(w) would require

N_R(γ)=0 at every real zero γ.                            (2)

In particular, for every pair of consecutive distinct positive zeros a<b,

∫_a^b V(t)R(t)dt=N_R(b)−N_R(a)=0.                       (3)

Multiple zeros cause no exception: the divergence exponent is even stronger, and the endpoints remain Dirichlet zeros for F.

## 2. Arbitrarily high short relative zero intervals

Let 0<γ_1<γ_2<⋯ be the distinct positive real zeros. For every fixed ε>0, there are infinitely many j with

γ_(j+1)−γ_j < ε γ_j.                                    (4)

Otherwise γ_(j+1)≥(1+ε)γ_j eventually, so the sequence would grow geometrically and its counting function would be O(log T). This contradicts the external real-zero counting lower bound. Consequently these short relative intervals can be chosen beyond any prescribed height.

No bound for every individual zero gap is claimed or needed.

## 3. Polynomial cell moments are positive on sufficiently short high intervals

Replace R by −R if necessary so its leading coefficient is positive. Fix its degree d. There exist c>0, C≥0, and T_R such that, for a≥T_R and a≤t≤2a,

R(t)≥c a^d,
|R″(t)|≤C a^(d−2),

with C=0 when d≤1. Choose 0<ε≤1 small enough that

4c−Cε²/π²>0.                                           (5)

Take a consecutive zero interval [a,b] from (4) with a≥T_R and b−a<εa. Integration by parts, using F(a)=F(b)=0, gives the exact identity

∫_a^b VR =4∫_a^b F′²R−∫_a^b F²R″.                     (6)

Since F∈H₀¹(a,b), the ordinary Dirichlet Poincaré inequality is

∫_a^b F² ≤ (b−a)²/π² ∫_a^b F′².                       (7)

Combining (5)–(7),

∫_a^b VR
 ≥a^d[4c−Cε²/π²]∫_a^b F′² >0.                          (8)

The last inequality is strict because the actual analytic F is not identically zero on the interval. This contradicts (3), proving (1).

The argument uses only fixed-degree polynomial growth and arbitrarily high short relative real-zero intervals. It does not infer asymptotic coherence from a finite calculation or assume that F has only real zeros.

## 4. Application to the actual selected family

For each n≥1, the actual X-selected monic P_n is nonzero and has zero total V moment:

- If n is odd, V is even and P_n is odd, so ∫VP_n=0.
- If n≥2 is even, the constant polynomial belongs to its old prefix. X orthogonality gives 0=X(P_n,1)=∫VP_n because H(P_n,1)=0.

Nevertheless (1) gives I[P_n]∉L²(w) for every n≥1. Thus restricting the imported primitive theorem to the actual selected polynomials does NOT cure its domain problem. This conclusion requires no old Q positivity at all; source X selection is independently well defined.

The missing derivative-coherence estimate concerns U_n=||P_n′−nπ_(n−1)||²_w and Δ_n, which are finite. Neither quantity is identified with the divergent primitive norm. Therefore (1) refutes only this specific attempted theorem transfer. It does not establish that U_n/Δ_n fails to tend to zero, nor does it refute any finite or all-degree Schur inequality.

## Scope boundary

The parameter-Schur identities in PARAMETER_STABILITY_AND_TRACE.md avoid this obstruction because they never divide by F or F². Their needed actual-theta relative asymptotic remains unproved. This domain result supplies no new target sign, no RH conclusion, and no literature-novelty claim.
