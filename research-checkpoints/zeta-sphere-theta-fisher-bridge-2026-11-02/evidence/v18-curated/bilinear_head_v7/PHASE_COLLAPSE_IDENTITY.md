# Exact arithmetic phase collapse in the low-Mellin correction

2 November 2026. Independent hierarchy-lane review PASS; see PHASE_REVIEW_HIERARCHY.md. This records a constructive correlation identity, not a positive bound.

Let p=1/2+a, q=1-p, t>0, and retain the symmetric product region nm<=M. In the exact completed-Mellin decomposition, define

 R_r(a,t)=1/(p+2r-it)+1/(q+2r-it),
 F_r(M,t)=sum_(n<=M) n^(2r-2it) sum_(m<=M/n)m^(2r).

Then the sum of all phase-bearing low integrals is exactly

 sum_(nm<=M)exp[-it log(n/m)] L_(p,2pi nm)(t)
 =Re{Gamma(it)pi^(-it) sum_(r>=0)
       [pi^(2r) R_r(a,t)/(r!(1-it)_r)] F_r(M,t)}.       (1)

The r series is convergent for each finite M. To verify(1), insert the already proved K power series. The phase of its first branch collapses by

 exp[-it log(n/m)](nm)^(-it)=n^(-2it).

The conjugate branch gives the complex conjugate after swapping n and m, permitted because the product region is symmetric. The remaining (nm)^(2r) factor separates into n^(2r)m^(2r), giving F_r. Thus a two-dimensional divisor phase becomes a one-dimensional Dirichlet polynomial with exact power-sum weights; it is not replaced by its absolute value.

In particular r=0 gives F_0=sum_(n<=M)floor(M/n)n^(-2it). Because

 partial_a[P_a(2t)R_0(a,t)]=-32a(1-2it),

the r=0 contribution to the *negative* low-integral subtraction in the normalized head is

 Re{(1-2it)Gamma(it)pi^(-it) F_0(M,t)}.                 (2)

The separate exact axis term is

 (1/2)Re{(1-2it)Gamma(it)pi^(-it)zeta(2it)}.

These formulas exhibit the correlated boundary phases explicitly. They do not make either contribution positive.

## Why termwise absolute bounds lose the useful regime

The earlier absolute-series bound replaces |(1-it)_r| by t^r and produces exp(pi²M²/t) for product cutoff M. At M comparable to t this becomes exp(constant*t), destroying the natural exp(-pi t/2) shear scale. This is a bound-method conditioning barrier: it does not show the exact series is large. A useful estimate must exploit cancellation in r and in the weighted polynomials F_r, or resum them before estimating.

The identity is especially transparent in the r=0 term, where the weight floor(M/n) is the precise sum over reciprocal partners. Applying a generic mean-square bound after discarding this weight or treating the two phases independently would miss an exact arithmetic correlation. No pointwise cancellation estimate sufficient for the full finite-head threshold is proved here.
