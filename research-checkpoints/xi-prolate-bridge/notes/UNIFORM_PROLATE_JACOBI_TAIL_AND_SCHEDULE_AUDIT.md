# Uniform prolate Jacobi tail and projection-schedule audit

## 0. Scope and outcome

This note separates the part of equation (5.2) that belongs to the prolate
state from the part that belongs to the signed finite Weil matrix.

There are four conclusions.

1. The infinite even-Legendre Jacobi tail has the exact positive lower form

   \[
   J^{(M)}_c\succeq 2M(2M+1)I.                         \tag{0.1}
   \]

   The positive multiplication operator `c^2 z^2` is not subtracted.  The
   weaker floor used in the `lambda=2` pilot remains valid, but is not sharp.

2. For every `0<=s<c^2` and `M>=ceil(2c)`, the scalar Schur load of the
   omitted infinite tail has a fail-closed continued-fraction enclosure.  If
   it is terminated at `K>=M`, its width is at most

   \[
   \boxed{
   {c^2\over135}\,1764^{-(K-M)}.}                      \tag{0.2}
   \]

   This is a uniform analytic estimate, not a finite-pilot observation.
   On the project convention `c=2*pi*lambda^2`, its interface dimension is
   `O(lambda^2)` and each additional tail level gains more than ten binary
   bits.

3. A certified source `L2` state ball can be turned into a certified
   Fourier projection-error ball without using the non-effective constant
   in the fixed-index prolate asymptotic.  If `tilde h` is the enclosed
   finite polynomial state and `||h_lambda-tilde h||_2<=eta_h`, then

   \[
   e_{\lambda,N}
   \leq e_{\lambda,N}^{\rm poly}+\lambda\eta_h,        \tag{0.3}
   \]

   where the polynomial term is a finite sum of elementary integrals and
   can be enclosed directly.

4. None of (0.1)--(0.3) controls the shifted Weil solve.  The explicit
   `N=O((log lambda)^2)` projection schedule is not ruled out by source
   dimension, and no larger `N` is forced by equation (5.2).  But no shifted
   sign or relative forced-resolvent estimate has been proved on that
   schedule.  The missing input is arithmetic and orientation-sensitive,
   not another absolute prolate tail estimate.

This note proves no signed Weil-sector comparison, no unbounded
residual--gap estimate, no locally uniform determinant limit, and no
Riemann-hypothesis conclusion.  The formal state remains `P0_INVALIDATED`.

## 1. The exact equation-(5.2) split

Put `L=2 log(lambda)` and

\[
 a_{\lambda,N}=\|P_Nk_\lambda^+\|,
 \qquad
 e_{\lambda,N}=\|(I-P_N)k_\lambda^+\|.
\]

The complete sufficient target is, for every fixed `eta<1/2`,

\[
 \sqrt{\log\lambda}\,\lambda^\eta
 \{e_{\lambda,N}+a_{\lambda,N}D(T_{\lambda,N})\}
 \longrightarrow0.                                     \tag{1.1}
\]

The existing Mellin projection theorem supplies the explicit candidate

\[
 N_\star(\lambda)=
 \left\lceil{L^2+26L\over2\pi^2}\right\rceil          \tag{1.2}
\]

and proves the first term in (1.1) qualitatively.  Its finite inequality is
explicit, but its source comparison contains the exact quantity
`delta_lambda`; the asymptotic insertion
`delta_lambda=O(lambda^(-2))` has no effective constant or threshold.

The larger schedules

\[
 N=\lceil\lambda L^3\rceil,
 \qquad
 N=\lceil D\lambda^2L^2\rceil                           \tag{1.3}
\]

give qualitative Gevrey exponential projection bounds.  Their branch and
starting thresholds are likewise non-effective, and the estimates are
absolute.  They do not compare the state Rayleigh shift with a shrinking
signed sector floor.

The remainder of this note gives a finite state/projection route which does
not need a hidden asymptotic constant.  It does not alter the second term of
(1.1).

## 2. Infinite even-prolate Jacobi operator

On `[-1,1]`, let

\[
 A_c=-{d\over dz}\left((1-z^2){d\over dz}\right)+c^2z^2,
 \qquad c=2\pi\lambda^2.                               \tag{2.1}
\]

Use the orthonormal even Legendre basis

\[
 \phi_i(z)=\sqrt{(4i+1)/2}\,P_{2i}(z),
 \qquad i=0,1,\ldots .                                 \tag{2.2}
\]

For normalized Legendre functions put

\[
 \alpha_l={l+1\over\sqrt{(2l+1)(2l+3)}},
 \qquad \alpha_{-1}=0.                                 \tag{2.3}
\]

Multiplication by `z` has the exact recurrence

\[
 z\phi_l=\alpha_l\phi_{l+1}+\alpha_{l-1}\phi_{l-1}.
\]

Consequently the even Jacobi entries, with `l=2i`, are

\[
\begin{aligned}
 d_i&=l(l+1)+c^2(\alpha_l^2+\alpha_{l-1}^2),\\
 b_i&=c^2\alpha_l\alpha_{l+1}>0.                       \tag{2.4}
\end{aligned}
\]

The differential part is diagonal and the multiplication part is the
compression of the nonnegative operator `c^2 z^2`.  Therefore, on the
closed tail beginning with `i=M`,

\[
 \boxed{J_c^{(M)}\succeq g_M I,
 \qquad g_M=2M(2M+1).}                                 \tag{2.5}
\]

This proves (0.1).  At the checkpoint-0.56 values `lambda=2`, `M=40`, the
new floor is `6480`.  The stored pilot used
`6480-2c^2`, approximately `5216.69`; that weaker lower bound remains safe,
so no stored certificate is invalidated.

We also need only the elementary uniform coupling estimate

\[
 \alpha_l^2\leq{1\over3},
 \qquad b_i\leq{c^2\over3},
 \qquad b_i^2\leq{c^4\over9}.                          \tag{2.6}
\]

Indeed,
`(2l+1)(2l+3)-3(l+1)^2=l(l+2)>=0`.

## 3. Exact scalar tail Schur recursion

For `i>=1` and `s<g_i`, define the boundary self-energy

\[
 r_i(s)=b_{i-1}^2
 \langle e_i,(J_c^{(i)}-sI)^{-1}e_i\rangle.            \tag{3.1}
\]

It is nonnegative.  Schur complementation of the first tail coordinate gives
the exact Stieltjes continued fraction

\[
 \boxed{
 r_i(s)={b_{i-1}^2\over d_i-s-r_{i+1}(s)}.}            \tag{3.2}
\]

At any terminal index `K`, (2.5) gives

\[
 0\leq r_K(s)\leq
 U_K:={b_{K-1}^2\over g_K-s}.                           \tag{3.3}
\]

Starting with `[L_K,U_K]=[0,U_K]`, recurse backward by

\[
 \boxed{
 L_i={b_{i-1}^2\over d_i-s-L_{i+1}},
 \qquad
 U_i={b_{i-1}^2\over d_i-s-U_{i+1}}.}                  \tag{3.4}
\]

Every denominator must be proved positive.  A verifier rejects the input if
that check fails.  Since `x -> b^2/(d-s-x)` is increasing on its positive
denominator interval, (3.3)--(3.4) prove

\[
 r_i(s)\in[L_i,U_i]                                    \tag{3.5}
\]

without a cached eigenvalue or tail truncation assumption.

### Theorem 3.1 (uniform contraction past `2c`)

Assume

\[
 c\geq1,qquad0\leq s<c^2,qquad
 M\geq\lceil2c\rceil,qquad K\geq M.                  \tag{3.6}
\]

Then every interval in (3.4) is well defined,

\[
 0\leq U_i\leq {c^2\over130}\quad(M\leq i\leq K),   \tag{3.7}
\]

and

\[
 U_i-L_i\leq{1\over1764}(U_{i+1}-L_{i+1}).            \tag{3.8}
\]

In particular,

\[
 \boxed{
 U_M-L_M\leq {c^2\over135}\,1764^{-(K-M)}.}          \tag{3.9}
\]

**Proof.**  For every `i>=ceil(2c)`,

\[
 g_i-s\geq16c^2-c^2=15c^2.                             \tag{3.10}
\]

Equations (2.6), (3.3), and (3.10) first give
`U_K<=c^2/135`.  If `U_(i+1)<=c^2/130`, then

\[
 d_i-s-U_{i+1}
 \geq\left(15-{1\over130}\right)c^2
 ={1949\over130}c^2.                                  \tag{3.11}
\]

Hence

\[
 U_i\leq {c^4/9\over(1949/130)c^2}
 ={130\over17541}c^2<{c^2\over130}.                   \tag{3.12}
\]

This proves (3.7) and all denominator signs by backward induction.  Direct
subtraction in (3.4) gives

\[
 U_i-L_i=
 {b_{i-1}^2(U_{i+1}-L_{i+1})
  \over(d_i-s-U_{i+1})(d_i-s-L_{i+1})}.                \tag{3.13}
\]

Using (2.6) and (3.11), the multiplier is at most

\[
 {1\over9(1949/130)^2}<{1\over9\,14^2}={1\over1764}.
\]

Iteration and `U_K<=c^2/135` prove (3.9).  \(\square\)

Thus a target tail-load width `epsilon_tail` needs only

\[
 K-M\geq
 {\log(c^2/(135\epsilon_{\rm tail}))\over\log1764}    \tag{3.14}
\]

additional levels, rounded upward.  This is the promised sharp uniform
Jacobi-tail estimate.

## 4. Infinite inertia and eigenfunction localization

Partition the infinite Jacobi operator after coordinates `0,...,M-1`.
For `s<g_M`, Schur congruence and (3.1) give

\[
 \operatorname {inertia}_-(J_c-sI)
 =\operatorname {inertia}_-
 \left(J_{c,M}-sI-r_M(s)e_{M-1}e_{M-1}^*\right).       \tag{4.1}
\]

Therefore interval LDL at both `r_M=L_M` and `r_M=U_M` certifies the exact
infinite count whenever both endpoint matrices have the same negative
count and all pivots exclude zero.  The verifier reconstructs (2.3)--(3.4)
from `lambda`, `pi`, and integer indices; it need not trust a producer's
matrix or pass flag.

For `lambda>=2`, the already-proved three-dimensional min--max bound gives
`mu_4(c)<c^2`, and hence also `mu_0(c)<c^2`.  Theorem 3.1 consequently
covers both source labels on every such `lambda`.

Let `v` be a normalized finite Legendre witness, extended by zero, let
`theta=<v,J_cv>`, and include the first omitted component in

\[
 \epsilon=\|(J_c-\theta)v\|.                           \tag{4.2}
\]

If two infinite-inertia counts prove that an interval `(a,b)` contains
exactly one target eigenvalue and all other spectrum is at distance at
least `delta` from the narrow Rayleigh interval, the spectral theorem gives
the safe source-state enclosure

\[
 \|v-f_{n,\lambda}\|_2\leq {2\epsilon\over\delta}.     \tag{4.3}
\]

This is the same residual localization principle as the finite `lambda=2`
pilot, but (3.9) makes the infinite-tail count uniform in `lambda`.  At a
fixed prescribed `lambda`, adaptive rational shifts and increasing `M`,
`K`, and precision terminate because the prolate Jacobi operator has compact
resolvent, simple spectrum, and dense finite Legendre spans.  This is an
effective finite certification algorithm; it is not a closed uniform
eigenvalue-gap formula or a claimed complexity bound.

## 5. From a source-state ball to a projection-error ball

Let `tilde h_lambda` be the source-normalized polynomial combination formed
from certified label-0 and label-4 witnesses, including a certified interval
for the zero-integral coefficient.  Suppose the propagated ball proves

\[
 \|h_\lambda-\widetilde h_\lambda\|_{L^2(-\lambda,\lambda)}
 \leq\eta_h.                                           \tag{5.1}
\]

The elementary arithmetic estimate

\[
 \|E(f)\|_{L^2([\lambda^{-1},\lambda],du/u)}
 \leq\lambda\|f\|_{L^2(0,\lambda)}                  \tag{5.2}
\]

together with exact inversion evenization and orthogonal projection gives

\[
\begin{aligned}
 e_{\lambda,N}
 &\leq
 \|(I-P_N)E^+(\widetilde h_\lambda)\|_2
 +\lambda\eta_h\\
 &=e_{\lambda,N}^{\rm poly}+\lambda\eta_h.            \tag{5.3}
\end{aligned}
\]

The factor in the second term can be improved by tracking positive-half
normalization, but the displayed bound is deliberately safe.

The polynomial term is a finite, reconstructible quantity.  On a cell on
which `floor(lambda/u)=q`, write
`tilde h(x)=sum_r a_r x^r`.  Then

\[
 E(\widetilde h)(u)
 =\sum_r a_r\left(\sum_{m=1}^qm^r\right)u^{r+1/2}.     \tag{5.4}
\]

The cells have endpoints `u=lambda/m`, `1<=m<=floor(lambda^2)`, together
with their inversion reflections.  Thus

\[
 \|E^+(\widetilde h)\|_2^2,
 \qquad
 \langle E^+(\widetilde h),\phi_n\rangle              \tag{5.5}
\]

are finite sums of elementary power and complex-power antiderivatives.  A
ball implementation can enclose

\[
 (e_{\lambda,N}^{\rm poly})^2
 =\|E^+(\widetilde h)\|_2^2
  -\sum_{|n|\leq N}
       |\langle E^+(\widetilde h),\phi_n\rangle|^2     \tag{5.6}
\]

directly, with the endpoint `m<=lambda^2` kept inclusive.  Equations
(3.9), (4.3), and (5.3)--(5.6) therefore give the missing architecture for
a finite projection-error ball at any chosen schedule point.  The current
checkpoint-0.56 artifacts do not yet implement (5.5)--(5.6), so this note
does not retroactively certify their projection error.

This removes a finite state-enclosure ambiguity, not the need for a uniform
asymptotic argument.  At a chosen `lambda`, the resulting ball either meets
the requested tolerance or fails closed.  Theorem 3.1 by itself does not
produce an effective first `lambda` at which the fixed logarithmic schedule
must meet the weighted limit, and checking arbitrarily many finite points
would not replace that theorem.

## 6. Does the logarithmic schedule force a larger `N`?

No current theorem forces a larger Fourier dimension for the projection or
for the bare requirement that the proposed determinant dimensions tend to
infinity.  Equation (1.1) accepts (1.2), and (5.3)
provides a finite route at the same `N` once the state and elementary
integrals are enclosed.

There is also no source-inventory rank obstruction at (1.2).  On the locked
half-integer schedule, the prescribed buffered prolate inventory has

\[
 r_\pm=\lambda^2+O(\log\lambda)                         \tag{6.1}
\]

columns, whereas each parity target at (1.2) has only
`N_star=O((log lambda)^2)` rows.  Thus there are many more source columns
than target rows.  Rank is not a frame bound, but dimension does not force
`N` upward.

The existing matched coframe, transition, hybrid-sampling, and signed-moment
reductions were derived on different schedules, usually
`N=Theta(lambda^2)` or larger.  They do not transfer automatically to
(1.2).  Conversely, taking a larger principal compression does not preserve
the needed *relative* gate: the odd floor and even ground value both move,
and the normalized projected state and forcing vector change with `N`.
There is no proved monotonicity of their difference or of the forced solve.

Accordingly the rigorous conclusion is:

- a larger `N` is required by some current proof architectures, not by the
  projection target itself;
- the `O((log lambda)^2)` schedule is a legitimate candidate;
- coexistence of that schedule with both shifted signs is presently open.

## 7. Why the Jacobi theorem cannot control the shifted solve

Fix a unit comparison state `kappa` and consider the exact two-dimensional
even block

\[
 Q_\varepsilon=
 \begin{bmatrix}0&\varepsilon\\
                 \varepsilon&\varepsilon^2\end{bmatrix},
 \qquad U=0,\qquad\varepsilon>0.                       \tag{7.1}
\]

The complement at the declared shift is positive, the residual norm is
`epsilon`, and the shifted solve is

\[
 \|(A-U I)^{-1}b\|={\varepsilon\over\varepsilon^2}
 ={1\over\varepsilon}.                                 \tag{7.2}
\]

An independent odd block `[1]` satisfies the odd shifted sign.  The prolate
state and every Jacobi-tail or projection datum may be held fixed while
`epsilon` tends to zero.  Thus even a vanishing raw residual, together with
perfect state knowledge, does not bound the weighted solve.  This is an
abstract Hermitian separation model, not a source Weil matrix.

For the actual matrix, the missing full-angle estimate is exactly a bound on

\[
 \tau_U^2=
 \langle b,(A-U I)^{-2}b\rangle,                       \tag{7.3}
\]

with both shifted sector signs at the same source-derived `U`.  A
cancellation-preserving alternative is the one-inverse graph product from
the vector-specific reduction.  Either form must retain the complete pole,
archimedean, minus-prime, and Rayleigh-shift cancellations.

No estimate for (7.3) follows from (0.1)--(0.3).  The uniform Jacobi tail
closes a state-certification issue; it isolates, rather than solves, the
arithmetic relative-orientation obstruction.

## 8. Exact regression

The isolated regression is

```text
python3 -m unittest tests.test_prolate_jacobi_tail_schedule -v
```

It checks the positive tail floor, exact interval monotonicity, containment
of an independently assembled finite completion, the factor-`1764`
contraction, fail-closed regime checks, the state-to-projection transfer,
and the small-residual/large-solve separation.  The helper implementation
uses `fractions.Fraction`; no transcendental or shared ball library is used.
Its rational bandwidths are algebraic regression fixtures for Theorem 3.1,
not replacements for the project bandwidth.  A production certificate must
reconstruct the real quantity `c=2*pi*lambda^2` as an outward ball and apply
the same inequalities to that ball; it may not read `pi` or `c` through
binary64.
