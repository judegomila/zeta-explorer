# Finite-band preprint transfer audit

Date: 2026-11-03. Status: relevant stated results inspected, not a full independent referee audit of the 53-page preprint. No all-degree interior-shift inequality established.

## Primary-source synopsis

Source: Suvrit Sra, *On some positivity properties of the Riemann Xi function*, arXiv:2611.02944v1 (submitted 2 November 2026), https://arxiv.org/html/2611.02944v1 .

Theorem 1.3 gives every generalized Laguerre coefficient nonnegative on |t|≤T−1/2 if zeros through T are on the line. Lemma 4.2 proves this by pairing conjugate zeros. Theorem 3.4 and Appendix C instead concern reciprocal-law densities, not the theta profile or paired density. Their signed convolution correction has weighted variation ε_U(Q)<1. The moving-frame bound is order-independent, but requires n verified exponential factors with rates ≤Q=T² and

n≥2m, (n−2m+1)/2≥sqrt((m−1)(n−m+1)), n≤C(T), T≤U, Q<U²−1/4.

Thus finite verified height imposes finite order despite the uniform error. The paper reports PF order 1,810,540,931,075 and explicitly does not establish global first Laguerre positivity. The matrices normalized in Theorem C.9 are derivative Hankel matrices with alternating signature, not positive moment Gram matrices for the present paired form.

## Independent transfer calculation: every shift on the verified band

Write F=2ξ(1/2+iz), and w_a(t)=−Im(F′(t+ia)conj(F(t+ia)))/a, extended at a=0. For real t,a, direct differentiation gives

∂_a |F(t+ia)|²=−2 Im(F′(t+ia)conj(F(t+ia))).

Consequently, using the entire even power series in a,

w_a(t)=Σ_{j≥1} j L_j[F](t) a^(2j−2).

Local uniform convergence justifies differentiation, including at real zeros. Therefore all-order Laguerre positivity on a band implies w_a≥L_1[F]≥0 there for every real a. This is a legitimate pointwise shifted consequence. It does not mean h_a[q]≥0 over the full real line for arbitrary polynomials q.

## Independent stronger band from the paired logarithmic derivative

For an off-real conjugate zero pair γ±iδ, its contribution to w_a/|F(t+ia)|² away from zeros is

2[(t−γ)²+a²−δ²] /
{[(t−γ)²+(a−δ)²][(t−γ)²+(a+δ)²]}.

A real zero contributes 1/[(t−γ)²+a²], with multiplicity. Pairing the canonical product removes imaginary contributions from its real exponential normalization. Since |δ|<1/2 and any nonreal zero has |γ|>T, the sum is nonnegative for

|t|≤T−sqrt(1/4−a²),  0≤|a|<1/2.

This enlarges the previous band for nonzero interior a. At zeros of F on the shifted line the original w_a is continuous; no division is needed to extend the inequality. For |a|≥1/2 every pair contribution is nonnegative globally, so h_a[q]≥0 is available there. The unsolved range remains |a|<1/2 over the entire line. At a=0 the expression has its continuous Laguerre limit.

## Why this does not close the requested selected-polynomial estimate

Fix an interior a and the enlarged band radius B_a. The exact split is

h_a[q]=∫_{|t|≤B_a} q²w_a + ∫_{|t|>B_a} q²w_a.

The first integral is nonnegative, but the second is still signed. The preprint does not supply a lower bound for that second integral relative to the first, nor relative to a positive Gaussian-window value. Polynomial degree remains unbounded while B_a remains finite. The already audited absolute-tail growth issue therefore remains applicable in principle; replacing T−1/2 by T−sqrt(1/4−a²) does not remove it.

To transfer the perturbation mechanism one would first need an exact representation for this target form by a positive reference and controlled signed error, with a bound such as

|E_a[q]|≤ε B_a[q], ε<1,

for the actual selected polynomials at every degree. Here B_a denotes a reference quadratic form, not the band radius above. No such representation or bound follows from finite PF order of the reciprocal densities. Even within the reciprocal-law method, raising m indefinitely requires an unbounded factor budget with a compatible exponential-weight error bound; fixed U and Q<U²−1/4 do not allow it.

The correct outcome is a sharper shifted finite-band positivity statement and a precise transfer obstruction, not a global completion or an RH proof. No fractional-sieve positivity was used.
