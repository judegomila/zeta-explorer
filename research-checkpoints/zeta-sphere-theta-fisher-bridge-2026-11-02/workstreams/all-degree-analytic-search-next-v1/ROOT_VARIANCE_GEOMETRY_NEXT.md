# Root-log variance versus Christoffel localization

## Scope and outcome

`COMPLETE_ORBIT_HARDY_NEXT.md` gives the noncircular sufficient condition

\[
 \sum_{j=1}^{\kappa}{4V_j\over1+V_j}\leq2,       \tag{1}
\]

where `V_j` is the variance of `log|t-rho_j|` under the positive density
`H_j(t)^2dt`, with

\[
 H_j(t)={q(t)\over t-\rho_j}W(t).                \tag{2}
\]

This note tests whether (1) can follow from one-dimensional
log-Sobolev/Heisenberg estimates plus the Christoffel structure of the actual
residual.

There are four exact conclusions.

1. Log-radius variance is invariant under additive localization about a
   root.  Shrinking a Christoffel kernel from scale one to scale
   `kappa^(-1/2)` only translates `log|t-rho|`; it does not shrink its
   variance.  A bound `V_j=O(1/kappa)` therefore requires multiplicative
   thin-shell concentration, not ordinary additive localization.
2. The Gaussian source gives a sharp source-free countermodel inside the
   stated `N=2`, `r=1`, `kappa=5` regime.  Its actual monic residual is the
   degree-five Hermite polynomial, every old block is positive, all roots are
   real and simple, and each quotient in (2) is an exact Christoffel kernel.
   Nevertheless the central-root variance is

   \[
    \boxed{V_0={\pi^2\over8}+{71\over225}>1.}    \tag{3}
   \]

   That one root already makes the left side of (1) greater than `2`.
3. The same Gaussian rung satisfies the exact collective Hardy condition
   with margin:

   \[
    \sum_j{1\over\gamma_j}={20\over11}<2.
   \]

   For the central root, the true contribution is `1/gamma_0=4/11`, while
   its variance surrogate is greater than `2`.  The loss is therefore in
   replacing the actual logarithmic derivative energy by the Heisenberg
   lower bound, not in the pivot.
4. Gaussian Poincare or log-Sobolev estimates do not repair this loss.
   `log|t-rho|` has a nonintegrable Dirichlet singularity whenever
   `H_j(rho_j)` is nonzero, and the squared Christoffel tilt is not uniformly
   log-concave on the logarithmic line.

The countermodel is not the complete theta profile and does not decide (1)
for its actual residuals.  It proves that (1) cannot follow from positivity,
strong log concavity, ordinary Christoffel localization, or a generic
one-dimensional log-Sobolev inequality.  A theta proof would need new
orbit/Ewald arithmetic producing multiplicative root-shell concentration.
No Xi--Laguerre sign, all-degree theorem, or RH conclusion is claimed.

## 1. Affine localization does not reduce log variance

Let `rho` be real and let `H` be nonzero with `H^2` integrable.  Normalize

\[
 d\nu(t)={H(t)^2\over\|H\|_2^2}dt,
 \qquad Y=\log|t-\rho|.                          \tag{4}
\]

For `a>0`, transport this probability measure by

\[
 t=\rho+a x.                                     \tag{5}
\]

Then

\[
 Y=\log a+\log|x|,
 \qquad
 \boxed{\operatorname {Var}(Y)
 =\operatorname {Var}(\log|x|).}                \tag{6}
\]

Thus log-radius variance is exactly invariant under translation and positive
dilation about the root.  In particular, a family with an additive local
limit

\[
 {a_\kappa H_\kappa(\rho+a_\kappa x)^2\over
  \|H_\kappa\|_2^2}dx
 \longrightarrow f(x)dx                         \tag{7}
\]

and uniform logarithmic integrability has

\[
 V_\kappa\longrightarrow
 \operatorname {Var}_{f}(\log|x|),              \tag{8}
\]

not `0`, unless the limiting radial law itself is supported on a single
value of `|x|`.

Bulk Christoffel kernels normally localize additively.  Their shrinking
scale changes the mean of `log|t-rho|` by `log a_kappa`, but (6) removes that
shift from the variance.  The uniform sufficient bound

\[
 V_j\leq{1\over2\kappa-1}                       \tag{9}
\]

therefore asks for a much stronger phenomenon: the relative distances from
the root must concentrate in an increasingly thin multiplicative annulus.
Neither a spectral scale `a_kappa -> 0` nor an ordinary Christoffel local
limit supplies that property.

## 2. The positive Gaussian target and its Christoffel residual

Take

\[
 \boxed{W_G(t)=e^{-t^2/2}.}                     \tag{10}
\]

It is positive, even, entire, Schwartz, and uniformly log-concave.  Moreover

\[
 W_G'^2-W_GW_G''=W_G^2=e^{-t^2}>0.              \tag{11}
\]

Hence the signed target metric is the ordinary positive Gaussian metric and
all of its parity blocks are positive definite.

Let `p_n` be the monic orthogonal polynomial for `e^(-t^2)dt`.  These are the
monic physicists' Hermite polynomials.  For `n=5`,

\[
 \boxed{
 q(t)=p_5(t)=t^5-5t^3+{15\over4}t
 =t\left(t^4-5t^2+{15\over4}\right).}           \tag{12}
\]

Thus (12) is exactly the campaign form with `N=2`, `r=1`, and `kappa=5`.
It is the actual old-space Galerkin residual, not a polynomial selected after
the fact.  Its five zeros are real and simple; one of them is

\[
 \rho_0=0.                                       \tag{13}
\]

This example also has the exact Christoffel structure requested by the
rootwise route.  If `rho_j` is any zero of `p_kappa`, the
Christoffel--Darboux formula gives

\[
 K_{\kappa-1}(t,\rho_j)
 ={p_\kappa(t)p_{\kappa-1}(\rho_j)
   \over h_{\kappa-1}(t-\rho_j)},               \tag{14}
\]

where `h_(kappa-1)=||p_(kappa-1)||^2`.  Therefore

\[
 {p_\kappa(t)\over t-\rho_j}
 ={h_{\kappa-1}\over p_{\kappa-1}(\rho_j)}
 K_{\kappa-1}(t,\rho_j).                        \tag{15}
\]

After normalization, `H_j^2dt` is precisely a squared Christoffel-kernel
density.  The countermodel below therefore retains both actual-residual and
Christoffel structure.

## 3. Exact Mellin curvature at the central root

At `rho_0=0`, equation (2) becomes

\[
 H_0(t)=\left(t^4-5t^2+{15\over4}\right)e^{-t^2/2}. \tag{16}
\]

Its Mellin norm is, for `Re(s)>-1`,

\[
 Z_0(s)=\int_{\mathbb R}|t|^s
 \left(t^4-5t^2+{15\over4}\right)^2e^{-t^2}dt.  \tag{17}
\]

Put

\[
 y={s+1\over2}.                                  \tag{18}
\]

Expanding the square and using

\[
 \int_{\mathbb R}|t|^{s+2m}e^{-t^2}dt
 =\Gamma(y+m)                                    \tag{19}
\]

gives the exact factorization

\[
 \boxed{Z_0(s)=\Gamma(y)R(y),}                  \tag{20}
\]

where

\[
 R(y)=y^4-4y^3+{27\over2}y^2-19y+{225\over16}. \tag{21}
\]

At the origin,

\[
 R(1/2)={15\over2},
 \qquad R'(1/2)=-8,
 \qquad R''(1/2)=18.                             \tag{22}
\]

Consequently

\[
 (\log R)''(1/2)
 ={R''\over R}-\left({R'\over R}\right)^2
 ={284\over225}.                                \tag{23}
\]

Since `psi_1(1/2)=pi^2/2` for the trigamma function, differentiating (20)
twice with respect to `s` proves

\[
 \boxed{
 V_0=(\log Z_0)''(0)
 ={1\over4}\left\{{\pi^2\over2}+{284\over225}\right\}
 ={\pi^2\over8}+{71\over225}.}                 \tag{24}
\]

In particular `V_0>1`.  Since `V -> 4V/(1+V)` is increasing and equals `2`
at `V=1`,

\[
 \boxed{{4V_0\over1+V_0}>2.}                   \tag{25}
\]

All other terms in (1) are nonnegative, so the complete variance budget
fails already at this single actual residual root.  The stronger uniform
bound (9) would require `V_0<=1/9` and fails as well.

## 4. The exact Hardy condition still holds

The failure of (1) does not reflect a negative pivot.  The monic Hermite
norm is

\[
 \|qW_G\|_2^2=2^{-5}5!\sqrt\pi
 ={15\over4}\sqrt\pi.                           \tag{26}
\]

The Hermite-function energy, equivalently a direct expansion of
`(qW_G)'`, gives

\[
 E:=\|(qW_G)'\|_2^2
 =\left(5+{1\over2}\right)\|qW_G\|_2^2
 ={165\over8}\sqrt\pi.                         \tag{27}
\]

For the central root, (20) and (22) give

\[
 B_0=\|H_0\|_2^2=Z_0(0)
 ={15\over2}\sqrt\pi,                           \tag{28}
\]

and hence

\[
 \boxed{
 \gamma_0={E\over B_0}={11\over4},
 \qquad {1\over\gamma_0}={4\over11}.}          \tag{29}
\]

The source curvature in (11) also gives

\[
 \int q^2(W_G'^2-W_GW_G'')dt
 =\|qW_G\|_2^2>0.                               \tag{30}
\]

Using the exact collective identity from the preceding note,

\[
 2E-\sum_jB_j=\|qW_G\|_2^2,                    \tag{31}
\]

one obtains

\[
 \boxed{
 \sum_{j=1}^5{1\over\gamma_j}
 ={\sum_jB_j\over E}
 =2-{\|qW_G\|_2^2\over E}
 ={20\over11}<2.}                               \tag{32}
\]

Thus the exact complete-orbit Hardy gate is satisfied, while its
Mellin-variance sufficient condition fails.

The discrepancy is quantitative.  The Heisenberg step uses only

\[
 \gamma_0\geq{1+V_0\over4V_0}.                 \tag{33}
\]

Because `V_0>1`, the right side of (33) is less than `1/2`, whereas the true
value is `11/4`.  After reciprocation, the variance surrogate is greater
than `2`, while the true central-root contribution is `4/11`.  The
Christoffel polynomial carries derivative energy which its log-radius
variance does not record.

## 5. Why ordinary log-Sobolev input does not close the gap

The Gaussian base measure satisfies the sharpest standard one-dimensional
Poincare and log-Sobolev inequalities, yet (25) holds.  There are two precise
reasons those inequalities do not imply the needed upper bound on `V_0`.

First, applying a Poincare estimate in the original `t` coordinate to

\[
 f(t)=\log|t-\rho_j|                             \tag{34}
\]

would require its Dirichlet integral.  At a simple residual root,
`H_j(rho_j)=q'(rho_j)W(rho_j)` whenever `W(rho_j)` is nonzero.  Therefore

\[
 \int |f'(t)|^2H_j(t)^2dt
 =\int {H_j(t)^2\over(t-\rho_j)^2}dt=\infty.    \tag{35}
\]

The desired variance is finite, but the direct Poincare/LSI test function is
outside the relevant Sobolev domain.

Second, after passing to the logarithmic coordinate, the probability density
is

\[
 |u_{j,+}(y)|^2+|u_{j,-}(y)|^2.                 \tag{36}
\]

The polynomial Christoffel factor can create zeros and separated humps; it
does so in the central Gaussian example above.  The negative logarithm of
(36) is then not uniformly convex, even though the untilted source
`W_G^2dt` is strongly log-concave.  A Bakry--Emery curvature bound of order
`kappa` is therefore not inherited automatically by (36).

More fundamentally, any additive localization estimate proved by such a
method is subject to the exact invariance (6).  To establish
`V_j=O(1/kappa)`, an argument must show that the *shape* of the normalized
log-radius law collapses, not merely that its `t`-scale shrinks.

## 6. Consequences for the complete-theta route

The Gaussian example is deliberately source-free.  It does not show that
the complete-theta variances violate (1).  It does impose three audit
requirements on any proposed proof of their bound.

1. The proof must use arithmetic absent from a positive Gaussian target.
   Positivity of `W'^2-WW''`, strong log concavity, real-rootedness, and
   positive Christoffel geometry are all insufficient.
2. It must establish multiplicative thin-shell concentration around the
   actual residual roots.  Ordinary bulk or edge localization on a shrinking
   additive scale cannot control `V_j` because of (6).
3. It must justify the Heisenberg loss collectively.  The exact Gaussian
   comparison (29)--(33) shows that a broad log-radius distribution may
   coexist with ample derivative energy and a positive pivot.

This suggests a potentially less lossy theta continuation: retain the
actual logarithmic energies `K_j/B_j`, or a joint sum of them, and use
complete-orbit/Ewald arithmetic before replacing them by scalar variances.
Any proof based only on the upper variance budget (1) is attempting a much
stronger multiplicative concentration statement than the exact Hardy gate
requires.

## Self-audit and nonclaims

- The example is at `N=2`, `r=1`, `kappa=5`, so it lies in the domain of the
  complete-orbit note rather than an exceptional base case.
- Equation (15) verifies that the quotients are genuine Christoffel kernels,
  not independently fitted rootwise polynomials.
- Equations (20)--(24) use an exact Mellin integral and the standard identity
  `psi_1(1/2)=pi^2/2`; no numerical quadrature is used.
- Equations (26)--(32) independently verify that the exact target is positive
  even though the stronger variance certificate fails.
- The Gaussian source is not `2Xi` and has no Jacobi-orbit or modular/Ewald
  arithmetic.  It is a method countermodel only.
- No finite Gaussian calculation is extrapolated to the complete theta
  source, and no Xi--Laguerre or RH conclusion is asserted.
