# Explicit odd-theta bounds through four components

Research extension, 14 November 2026. This continues the [first odd-sector checkpoint](../odd-sector-followup/README.md) within the [Klein/annulus comparison](../README.md). All certified numerical constants below concern the actual **unheated theta kernel** in the fixed Mellin normalization. The cutoff is translated to zero. The distances are Mellin-coordinate distances from that cutoff, not distances from zeta zeros in the complex plane.

All displayed numerical matrix intervals use `alpha=1`. For general positive `alpha`, matrix entries and LDL pivots scale by `alpha`, and an `N` by `N` determinant scales by `alpha^N`. The two node radii are unchanged by this positive scaling.

## Outcome

The previous existential two-node theorem now has an explicit radius and quantitative energy bound. A separate validated calculation certifies the third and fourth odd Taylor blocks, and a continuum remainder estimate gives an explicit radius for every configuration of up to four odd nodes.

| Certified class | Explicit range | Conclusion |
|---|---|---|
| Two distinct positive odd nodes | `0<x,y<=1/200=0.005` | Positive-definite Gram and the quantitative bound in section 1 |
| Any `N=1,2,3,4` distinct positive odd nodes | `0<x_a<=1/100000=0.00001` | Positive-definite Gram for arbitrary complex coefficients |
| Odd differential polynomials of degree at most seven | Full integral over `r>=0` | The derivative-polynomial inequality in section 4 |

The node statements hold with **no minimum separation**. They cover the entire indicated configuration sets, including arbitrarily clustered distinct nodes. They are not finite-mesh observations. Repeated or zero nodes give semidefiniteness by continuity, with no strictness claim.

The global target is also sharper: positivity of **every** leading odd Taylor block is equivalent to the full odd-sector inequality and hence RH. Analytic continuation supplies the passage from all local orders to the global operator. The signs at unbounded order remain unproved. No novelty claim is made for the research reductions.

## 1. A quantitative bound that survives two-component cancellation

Use the actual kernel

\[
H_0(u,v)=\alpha\int_0^\infty
(2r-u-v)\kappa(r-u)\kappa(r-v)\,dr,
\qquad H_-(x,y)=H_0(x,y)-H_0(x,-y),
\quad\alpha>0.
\]

For distinct `0<x,y<=1/200` and arbitrary complex `c_1,c_2`, the certified bound is

\[
\boxed{
\sum_{i,j=1}^2\overline{c_i}H_-(x_i,x_j)c_j
\ge\frac{\alpha}{10000}
\left(|xc_1+yc_2|^2+|(y^2-x^2)yc_2|^2\right),
\quad x_1=x,\ x_2=y.
}
\tag{1}
\]

The right side is strictly positive for every nonzero coefficient vector. For example, choose `c_1=y`, `c_2=-x` so the first term cancels exactly. The remaining lower bound is

\[
\frac{\alpha}{10000}x^2y^2(y^2-x^2)^2>0.
\]

This exposes the energy left after the leading cancellation. It also makes the loss as nodes coalesce explicit; no uniform lower bound in raw point-coefficient coordinates is claimed.

The proof writes `H_-(x,y)=xy G(x^2,y^2)` and changes the two evaluation features to Newton divided differences. At `alpha=1`, the resulting matrix `B` satisfies uniformly `B>10^-4 I`. Interval arithmetic certifies

\[
\det(B-10^{-4}I)
\in[3.49147071451692\times10^{-6},\;
1.29093328508862\times10^{-4}]>0.
\]

The first diagonal entry of `B-10^-4 I` is also strictly positive. Whole-panel derivative bounds cover every configuration and all infinite tails.

Full proof and reproduction: [EXPLICIT-RADIUS.md](explicit-radius/EXPLICIT-RADIUS.md). Independent review: [EXPLICIT-RADIUS-REVIEW.md](higher-jets/EXPLICIT-RADIUS-REVIEW.md).

## 2. Certified third and fourth Taylor blocks

Write

\[
H_-(x,y)=xy\sum_{i,j\ge0}g_{ij}x^{2i}y^{2j},
\qquad J_N=(g_{ij})_{0\le i,j<N}.
\]

Thus `J_4` corresponds to the odd monomials `(x,x^3,x^5,x^7)`. At `alpha=1`, an interval LDL decomposition certifies four positive pivots:

| Pivot | Outward lower bound | Outward upper bound |
|---|---:|---:|
| 1 | 0.021764604364171467 | 0.02176460436417155 |
| 2 | 0.004027525361856146 | 0.004027525361892872 |
| 3 | 0.00032569643032535157 | 0.0003256964374525309 |
| 4 | 0.00004937724842173496 | 0.00004937807603798925 |

In particular,

\[
\det J_3\in[2.854973356043209,\;2.8549734185443205]\times10^{-8},
\]

\[
\boxed{\det J_4\in
[1.4097072863877992,\;1.4097309454731956]\times10^{-12}>0.}
\]

The calculation uses exact integration-by-parts recurrences, 50-digit interval arithmetic, six theta terms, 128 panels on `[0,3]`, and degree-nine midpoint Taylor integration with a rigorous tenth-derivative remainder. Every omitted theta term and the entire infinite moment tail are bounded. A separate exact algebraic check compares all 16 coefficient formulas with direct polynomial-Gaussian integration, including a zero-odd Gaussian control and the earlier negative control.

Derivation, interval output and exact audit: [HIGHER-JET-CERTIFICATE.md](higher-jets/HIGHER-JET-CERTIFICATE.md). Independent review: [HIGHER-JET-REVIEW.md](explicit-radius/HIGHER-JET-REVIEW.md).

## 3. An explicit four-node continuum theorem

The higher Taylor block alone gives an existence neighborhood. A second calculation supplies the quantitative range

\[
\boxed{0<x_a\le10^{-5},\qquad N\le4.}
\]

For squared nodes `X_a=x_a^2`, the successive Newton divided-difference matrix `D` tends to `J_N` as all nodes approach zero, uniformly even when their spacings collapse. Its entry errors obey

\[
|D_{ij}-g_{ij}|\le
\frac{\delta^2}{i!j!}(M_{i+1,j}+M_{i,j+1}),
\]

where `M_ab` bounds `|partial_X^a partial_Y^b G|` throughout the node square. A positive-weight integral identity supplies these bounds from theta derivatives through order nine. Interval LDL on the resulting entry boxes certifies every exact Newton matrix in the continuum.

At `alpha=1`, the fourth Newton pivot is enclosed by

\[
[2.84889581127737,\;7.015096701080491]\times10^{-5}>0.
\]

For four nodes, the exact determinant factorization also yields the explicit estimate

\[
\det[H_-(x_a,x_b)]_{a,b=1}^4
\ge\alpha^4(8.1217\times10^{-13})
\left(\prod_{a=1}^4x_a^2\right)
\left(\prod_{a<b}(x_b^2-x_a^2)^2\right)>0.
\tag{2}
\]

This is a result for four odd nodes, or eight full-kernel centers `±x_a` with antisymmetric coefficients. It does not assert unrestricted eight-center positivity. The two explicit radii are sufficient, conservative bounds; neither is claimed maximal. The constants have not been extended to heat-deformed theta kernels.

Full proof and standalone replay: [FOUR-NODE-RADIUS.md](local-global/FOUR-NODE-RADIUS.md). Independent review: [FOUR-NODE-RADIUS-REVIEW.md](higher-jets/FOUR-NODE-RADIUS-REVIEW.md).

## 4. The remaining global inequality is an all-order statement

The actual kernel has a holomorphic extension on the connected strip `|Im z|<pi/2`. If every coefficient block `J_N` is positive semidefinite, its finite Taylor truncations are positive kernels. Absolute convergence gives positivity on one common complex disk. The holomorphic-kernel propagation theorem then extends this positivity across the strip. Conversely, global positivity gives each `J_N` by divided-difference limits.

Together with the preceding Fourier/Löwner reduction,

\[
\boxed{
J_N\succeq0\text{ for every finite }N
\quad\Longleftrightarrow\quad
H\text{ is positive on its complete odd sector}
\quad\Longleftrightarrow\quad\mathrm{RH}.
}
\tag{3}
\]

No uniform lower eigenvalue bound across `N` is required. Equivalently, for each `N` one may have its own local positivity radius `delta_N`, even if those radii tend to zero. The indispensable condition is positivity at every order.

There is a direct integral form of the target. For an arbitrary odd polynomial `p`, let `D_r=d/dr`. Then the inequality is

\[
\boxed{
\int_0^\infty r|p(D_r)\kappa|^2\,dr
\ge-\operatorname{Re}\int_0^\infty
\overline{p(D_r)\kappa}\,p'(D_r)\kappa\,dr.
}
\tag{4}
\]

Here `p'` is the derivative of the polynomial, not the derivative of the resulting function. The certified fourth block establishes (4) for every odd polynomial of degree at most seven, with arbitrary complex coefficients. The extension to all odd degrees is unproved and is equivalent to (3).

In the strictly positive case, extending a block by one row and column requires the precise Schur inequality

\[
c_N-b_N^*J_N^{-1}b_N>0,
\qquad J_{N+1}=\begin{pmatrix}J_N&b_N\\b_N^*&c_N\end{pmatrix}.
\]

The [local-to-global note](local-global/local-to-global.md) proves the fixed-order theorem, checks all analytic extension hypotheses, gives the semidefinite range condition for singular blocks, and includes an exact example showing why finitely many positive blocks do not settle higher orders. The external propagation input is Neeb and Ólafsson, [Theorem A.1, Appendix A, *Reflection Positivity and Conformal Symmetry*](https://arxiv.org/pdf/1206.2039), pp. 41–42 of the author preprint.

## Reproduction and validation

Install the versions in [requirements.txt](requirements.txt), then run from this directory:

```sh
python3 explicit-radius/theta-odd-explicit-radius.py
python3 higher-jets/theta-odd-higher-jet-interval.py
python3 higher-jets/coefficient-reduction-audit.py
python3 local-global/theta-odd-four-node-radius.py
```

All four commands passed in private replays by the integrating reviewer. Separate mathematical reviewers replayed the two-node, higher-block, and four-node interval certificates and checked their remainders, factorial normalization, all tails, matrix congruences and scope. The primary propagation theorem was independently inspected by two reviewers.

The interval certificates assume the stated mpmath 1.3.0 implementation, Python runtime and the displayed elementary analytic bounds. Critical assertions use interval objects; binary floating-point conversion is confined to outward-widened displayed endpoints. These are computer-assisted interval proofs, without proof-assistant verification.

The work establishes the explicit finite-order bounds above. The uniform bridge estimate, arbitrary-order theta positivity, propagation of the specific regularized box pulse, and zero trapping remain unresolved.
