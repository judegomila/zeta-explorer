# Independent audit of the explicit four-node radius

Reviewed and independently replayed on 14 November 2026. Source reviewed: the companion `local-global/theta-odd-four-node-radius.py`, together with the fixed-order Newton theorem and quantitative estimate in `local-global/local-to-global.md`. Replay used a private copy and the exact argument `--delta 1/100000`.

## Verdict and replay

**Passed.** No substantive error was found. The certificate establishes positivity for every configuration of up to four distinct positive odd-sector nodes with

\[
0<x_i\le10^{-5},
\]

including arbitrary complex coefficients and arbitrarily close nodes. This is a statement in the specified Mellin cutoff coordinate for actual unheated theta.

The private replay reproduced four strictly positive interval LDL pivots for the Newton divided-difference matrix:

| Pivot | Lower bound | Upper bound |
|---|---:|---:|
| 1 | 0.021764604084393145 | 0.02176460464394987 |
| 2 | 0.0040275137653352985 | 0.004027536958413124 |
| 3 | 0.00032522704486402177 | 0.00032616581770109374 |
| 4 | 0.0000284889581127737 | 0.00007015096701080491 |

Its fourth leading determinant is enclosed by

\[
\det D_4\in
[8.121776319949019\times10^{-13},\;
 2.0056836020764787\times10^{-12}]>0.
\]

Here `D4` is the Newton matrix. The original Gram determinant additionally contains its node and squared Vandermonde factors; the displayed determinant is not a uniform physical-coordinate eigenvalue or determinant margin.

## 1. Index and factorial audit

The Taylor block uses zero-based indices `i,j=0,...,3` and odd physical monomials `x^(2i+1)`, `y^(2j+1)`. Thus

\[
J_{ij}=\frac{\partial_X^i\partial_Y^jG(0,0)}{i!j!},
\qquad H_-(x,y)=xyG(x^2,y^2).
\]

An order-`i` divided difference is the integral of the `i`-th derivative over the standard simplex, whose volume is `1/i!`. The bivariate Newton entry is therefore a positive average of `G_ij/(i!j!)`. Subtract its origin value and move each argument through a distance at most `d=delta²`. This gives exactly

\[
|D_{ij}-J_{ij}|
\le\frac{\delta^2}{i!j!}
\left(M_{i+1,j}+M_{i,j+1}\right),
\]

where `M_ab` bounds the unnormalized mixed derivative `partial_X^a partial_Y^b G`. The implementation uses this normalization correctly. It does not treat coefficient entries as raw derivatives or omit the simplex volume.

The squared-variable derivative bound is

\[
M_{ab}\le
\frac{a!b!}{(2a+1)!(2b+1)!}
\sup|\partial_x^{2a+1}\partial_y^{2b+1}H_-|.
\]

Its factorials come from the positive-weight odd-to-square integral identity and are separate from the Newton simplex factorials. Both appear in their appropriate places. Symmetry permits sorting the derivative-index pairs.

The largest requested pair is `(a,b)=(3,4)` up to exchange, so shifted theta derivatives through order nine suffice. The code includes constants and tail bounds through order nine. The underlying jet integration separately uses derivatives through order seventeen for its tenth-derivative Taylor remainder.

## 2. Interval integrals and all tails

The code recomputes the four-feature Taylor block with the previously reviewed interval moment integration and exact integration-by-parts recurrences. It does not trust a rounded matrix loaded from an external diagnostic. The theta-series error is now bounded uniformly for `u>=-delta`, which includes every shifted argument and every unshifted moment evaluation.

For the real derivative bounds, the implementation evaluates each theta derivative over the whole interval `u+[-delta,delta]`. The absolute differentiated cutoff expression includes the factor two from the reflected kernel and both linear-prefactor cross terms. Multiplication by the panel width encloses the entire derivative integral on each panel.

For all omitted theta terms, the derivative-envelope decrease and geometric-ratio hypotheses are checked in interval arithmetic. The shifted infinite-tail calculation checks monotonicity for `u>=3-delta` and bounds every shifted derivative by its envelope at `r-delta`. The product-tail formulas include the full infinite domain and the linear-prefactor correction. The positive rates required to integrate the exponential bounds are checked. These estimates cover every derivative pair requested by the Newton entry bounds.

No finite node mesh or adaptive quadrature error estimate is used to establish the continuum claim.

## 3. Matrix certificate and clustered nodes

The interval entries enclose every exact Newton matrix in the stated node box. Interval LDL recursion then encloses each exact pivot and multiplier. The positive pivot lower endpoints validate all divisions and prove strict positive definiteness of every such exact matrix.

For distinct nodes, the triangular map from evaluations to successive divided differences is invertible. Its entries can grow when nodes approach one another, but the integral representation of its transformed kernel entries remains uniformly bounded. Consequently the proof does not require a lower bound on separation and is unaffected by arbitrarily severe clustering.

Congruence with that Newton map, followed by the invertible diagonal matrix of positive physical nodes, transfers strict positivity to the original odd Gram. The leading principal arguments cover each smaller node count. Repeated or zero nodes give only semidefiniteness by continuity and are excluded from the strict theorem.

## Scope and trust basis

The calculation concerns up to four odd nodes, equivalently up to eight symmetric full-kernel centers with antisymmetric coefficients. It does not establish unrestricted eight-center positivity, arbitrary-order positivity, a zero-capture radius in the complex zeta plane, or the global bridge estimate. The numerical radius is a sufficient certified choice, not a maximal one.

The trust basis is the stated mpmath outward-rounded elementary interval implementation, exact rational arithmetic for coefficients and parameters, and the displayed analytic estimates. This is not formal proof-assistant verification.
