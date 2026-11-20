# Gaussian obstruction to paying even the signed commutator alone

Status: independent analytic audit PASS. Auxiliary Gaussian only, not actual theta, and not the complete modular conservation law.

Use the modular notation and positive current pivots of MODULAR_REFLECTION and BOUNDARY_ELIMINATION. For ψ(h)=exp(−c h²/2), every bridge pivot is positive and s_(n+1)/s_n=c(n+1)/2. Consider the weaker candidate

 s_(n+1)/s_n ≥ −C_n,                                                 (1)

where C_n=∫₀∞h e^(−4ah)Y^T(GX−XG)Y dh is the *complete* signed commutator, including the derivative-of-weight term. It is weaker than demanding payment of κ_n μ_n^- when the square-completion remainder is positive. Yet (1) still fails generically.

Let m_j=E_j|h| under the jth normalized harmonic-oscillator state with Gaussian scale c. For every fixed n, the Gaussian Hermite polynomials have the Appell derivative relation. The reflection vector obeys η_n=2a(n+1) and η_perp=O(a²), whereas its halfline Gram H has H_jj=(c/(2a))m_j+O(1), H_ij=O(1/a). In the exact formula C_n=4a tr H−2η^T H e_n, these facts give the finite normalized limit

 lim_(a↓0) C_n=2c[Σ_(j=0)^n m_j−(n+1)m_n].                         (2)

The oscillator moments are explicit. For k≥0,

 m_(2k)=(4k+1) binom(2k,k)/(4^k√(πc)),
 m_(2k+1)=(4k+2) binom(2k,k)/(4^k√(πc)).                            (3)

Both parities interlace strictly increasingly, so every difference m_n−m_j for j≤n is nonnegative. Independently, the exact second and fourth moments give

 m_n≥√((n+1/2)/(3c)),    m_j≤√((j+1/2)/c).

For n≥24 and j≤floor(n/24), these bounds imply m_n−m_j≥(1/4)√(n/c). Thus

 −lim_(a↓0) C_n=2c Σ_(j=0)^n(m_n−m_j) ≥ √c n^(3/2)/48.              (4)

For every c>0, (4) eventually exceeds c(n+1)/2. For example c=20 and n=20000 suffice, since n³>576c(n+1)². Continuity then makes (1) strictly false for all sufficiently small positive a, for that fixed n.

In particular, even retaining the signed commutator and its full square-completion cancellation cannot on its own supply a generic next-pivot payment; additional correlated boundary/weight terms in the complete conservation law are essential. Gaussian positivity and exact reflection do not imply the candidate. This does not determine the actual theta sign, nor assert a failure of a payment involving all remaining conserved terms.
