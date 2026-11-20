# Strict-odd selector-shell localization without the global cone

## 0. Exact outcome and claim boundary

Let `Q` be a finite real inversion-symmetric source-Cauchy matrix on the
centered modes `-N,...,N`.  Let `mu` be a simple inversion-even ground value,
let `Phi` be its boundary-normalized ground, and put

\[
 T=Q-\mu I=T_+\oplus T_-,\qquad
 T_+\succeq0,\quad \ker T_+=\mathbb R\Phi,\quad T_->0.
                                                               \tag{0.1}
\]

No sign assumption on the coordinates of `Phi` is needed.  The positive
source-Cauchy moment cone and the strict odd block already force every
projective selector root to be finite, nonzero, and negative.  Consequently
`T` has the exact decomposition

\[
 \boxed{
 T=\sum_{j\in R}\theta_j
 \bigl\{|v(r_j)\rangle\langle v(r_j)|
       +|v(-r_j)\rangle\langle v(-r_j)|\bigr\}
 +\sum_{k\in S}\vartheta_k
 \bigl\{|V_k\rangle\langle V_k|
       +|V_{-k}\rangle\langle V_{-k}|\bigr\},}
                                                               \tag{0.2}
\]

where

\[
 v(r)_n={1\over n-r},\qquad
 \theta_j>0,\quad \vartheta_k>0,\quad
 r_j>0,\quad r_j\notin\{1,\ldots,N\},              \tag{0.3}
\]

and the regular roots `r_j` together with the shell roots `k in S` number
exactly `N`.  A shell occurs exactly when the corresponding ground
coordinate is zero.  Thus the global twisted cone was used in checkpoint
1.32 only to exclude shell roots; it was not needed to make the selector
weights positive, orient the regular roots, or exclude the central and
projective-infinity atoms.

The shell terms are harmless for the checkpoint-1.32 localization
inequality.  They contribute neither to the central selector moment nor to
`D_n` away from their own shell.  At their own shell the root distance is
already zero.  In particular, with the exact definitions in Section 5,

\[
 \boxed{
 \min_{\rho\in\{r_j:j\in R\}\cup S}
 { |n^2-\rho^2|\over\rho}
 \leq n\sqrt{{2q_0\over D_n}}\qquad(1\leq n\leq N).}
                                                               \tag{0.4}
\]

The edge case `q_0=0` is included: then every root is a shell, the ground is
`V_0`, and both sides of (0.4) are zero at every retained positive integer.

For the actual lower-Ritz setup, the odd shifted sign at the genuine Ritz
value `u` implies the strict odd hypothesis in (0.1), since `mu<=u` and

\[
 Q_- -\mu I=(Q_- -uI)+(u-\mu)I>0.                 \tag{0.5}
\]

The actual simple-even ground and the genuine shifted signs remain
unproved on an unbounded schedule.  This theorem proves no actual response
decay, root clearance, mass-to-anchor bound, determinant convergence, or
actual-arithmetic failure.  It adds no zero statement beyond the finite
target-sign consequence already certified at checkpoint 1.33, and proves
no Riemann hypothesis, converse from it, or de Bruijn--Newman `Lambda`
bound.  The formal state remains `P0_INVALIDATED`; the checkpoint-1.33
standard eight are unchanged.

## 1. Frozen inputs

Only the following frozen repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md` | `e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26` |
| `tests/test_source_cauchy_selector_cone_projective_tradeoff.py` | `f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee` |
| `notes/FULL_SOURCE_CAUCHY_ANCHOR_FORCING_FEASIBILITY.md` | `e54cb3b5d79f8dc8bf6188ae1168d7c18fb6cec07e4d92de83510d8f6e523928` |
| `tests/test_full_source_cauchy_anchor_forcing_feasibility.py` | `63619da4265edbbfebcd96a27f549a43872dcd2eb24b5a9f455cf8dedb58b37b` |
| `notes/ACTUAL_SOURCE_ROW_PAIRED_GRAM_EXCLUSION_SELECTOR_MOMENT_GATE.md` | `39777f86bfbf067402ccccdf069ff96276e5f931ee3ed4880edd3b135e181329` |
| `tests/test_actual_source_row_paired_gram_exclusion_selector_moment_gate.py` | `4605cc87111476f3defeaa3e7dbf2f78e4f8b4b92ce9f3e9d2a3b2bf855d5ec3` |
| `notes/ACTUAL_GLOBAL_TWISTED_CONE_MOVING_GRID_TARGET_INCOMPATIBILITY.md` | `0fb7b3d1ab5980b9cdc490933c68d9da3536a8d77a677fe96ec921445639121f` |
| `tests/test_actual_global_twisted_cone_moving_grid_target_incompatibility.py` | `91bda99e6b0db886a7551501ae2343705e4a2cb4632a687fe0f0d72287f031d6` |

The first pair supplies the finite positive moment cone and the unique full
source-Cauchy extension of each selector atom.  The second pair supplies the
annihilating face, the simple-kernel/distinct-root equivalence, and the
central, shell, and infinity roots.  The checkpoint-1.32 pair fixes the
actual selector moments and localization question.  The checkpoint-1.33
pair proves that a global one-sign twisted cone is incompatible with the
desired target convergence, making removal of that cone from the selector
gate necessary.

No external source, numerical artifact, zero list, actual arithmetic ground,
or RH premise is added.

## 2. Even selector face and positive weights

Use the normalized parity bases

\[
 e_0^+=V_0,\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2},\qquad
 e_n^-={V_n-V_{-n}\over\sqrt2}\quad(1\leq n\leq N).
                                                               \tag{2.1}
\]

Write the raw even ground coordinates as

\[
 \Phi=\xi_0V_0+\sum_{n=1}^N\xi_n(V_n+V_{-n}),
 \qquad \xi_0+2\sum_{n=1}^N\xi_n=1.              \tag{2.2}
\]

For a finite selector parameter `tau`, put

\[
 q_0(\tau)=\prod_{m=1}^N(\tau+m^2),\qquad
 q_n(\tau)=\sqrt2\,\tau
 \prod_{\substack{1\leq m\leq N\\m\ne n}}(\tau+m^2).
                                                               \tag{2.3}
\]

The positive moment-cone theorem and `T_+ Phi=0` give a positive atomic
decomposition supported on the real projective zeros of
`<Phi,q(tau)>`.  Since `rank(T_+)=N`, the annihilating-face theorem gives
exactly `N` distinct real projective roots `tau_1,...,tau_N`, and

\[
 \boxed{
 T_+=\sum_{j=1}^N\alpha_j
 |q(\tau_j)\rangle\langle q(\tau_j)|,
 \qquad \alpha_j>0.}                              \tag{2.4}
\]

Every root must occur with positive total weight.  If one were absent, the
remaining at most `N-1` rational-normal-curve vectors would give rank at
most `N-1`.  This positivity uses only `T_+>=0` and its simple kernel, not a
coordinate cone for `Phi`.

The projective infinity root is already excluded by (2.2): the leading
coefficient of the ground polynomial is
`xi_0+2*sum(xi_n)=1`.  Section 4 gives a second exclusion using only the
strict odd block.

## 3. Exact odd extension of a cleared selector

For finite `tau`, define the cleared odd selector

\[
 z_n(\tau)=\sqrt2\,n
 \prod_{\substack{1\leq m\leq N\\m\ne n}}(\tau+m^2),
 \qquad 1\leq n\leq N.                            \tag{3.1}
\]

The exact full extension formula for the central-normalized regular atom is

\[
 H=|u\rangle\langle u|-\tau|v\rangle\langle v|,
 \qquad
 u_n={\sqrt\gamma\,\tau\over\tau+n^2},\quad
 v_n={\sqrt\gamma\,n\over\tau+n^2}.              \tag{3.2}
\]

Multiplying the even selector by
`prod_(m=1)^N(tau+m^2)` and using normalized odd coordinates proves that
the unique full extension of the even ray in (2.3) has odd block

\[
 \boxed{\mathcal E(q(\tau)q(\tau)^*)_-=
        -\tau|z(\tau)\rangle\langle z(\tau)|.}     \tag{3.3}
\]

Equation (3.3) extends polynomially to every finite parameter.  At
`tau=-j^2`, both sides are the same positive `j`-shell coordinate outer
product.  At `tau=0`, the odd block is zero.  At projective infinity, the
full extension is the boundary rank-one matrix and again has zero odd
block.

The `N` coordinate polynomials in (3.1) form a basis of the polynomials of
degree at most `N-1`: evaluation at `tau=-j^2` isolates the `j`-th one.
Consequently, for any `N` distinct finite parameters, the matrix with
columns `z(tau_j)` is invertible.  This is the exact odd rational-normal
curve, including all shell limits.

## 4. Strict oddness forces negative finite roots

Suppose first that one of the `N` roots in (2.4) is projective infinity.
Its odd extension has rank zero, while each of the other `N-1` atoms has
odd rank at most one.  This would give `rank(T_-)<=N-1`, contradicting
`T_->0`.  Thus all roots are finite.

Let `Z` be the invertible matrix whose `j`-th column is `z(tau_j)`.  By
uniqueness of the full source-Cauchy extension, equations (2.4) and (3.3)
give

\[
 \boxed{
 T_-=Z\,\operatorname {diag}
 \bigl(-\alpha_1\tau_1,\ldots,-\alpha_N\tau_N\bigr)Z^*.}
                                                               \tag{4.1}
\]

Congruence by `Z^(-1)` and `T_->0` imply

\[
 -\alpha_j\tau_j>0\quad(1\leq j\leq N).
                                                               \tag{4.2}
\]

Since every `alpha_j` is positive,

\[
 \boxed{\tau_j<0\quad(1\leq j\leq N).}             \tag{4.3}
\]

This one argument excludes positive selectors and the central selector
`tau=0`.  It uses no coefficient signs of the ground.  A negative selector
is either regular, `tau=-r^2` with positive noninteger `r`, or a shell,
`tau=-j^2`.

## 5. Regular pairs, shells, and exact moments

For a regular negative selector put `tau=-r^2`.  Directly from (3.2), its
raw full matrix is

\[
 {\gamma r^2(r^2+nm)\over(n^2-r^2)(m^2-r^2)}
 ={\gamma r^2\over2}
 \left\{{1\over(n-r)(m-r)}+{1\over(n+r)(m+r)}\right\}.
                                                               \tag{5.1}
\]

Absorbing the positive scale into `theta_j` gives the regular terms in
(0.2).  The pole limit `r=k` is not inserted into a singular Cauchy vector;
it is exactly the paired shell projector with its own positive weight
`vartheta_k`.  This proves (0.2).

Let

\[
 d_n=T_{nn}=a_n^Q-\mu,
 \qquad
 D_n=d_n-{b_n^Q\over n}\quad(1\leq n\leq N),
 \qquad q_0=T_{00}.                                \tag{5.2}
\]

For convenience set `vartheta_n=0` when `n` is not a shell.  Reading the
source row and diagonal from (0.2) gives

\[
 \boxed{q_0=2\sum_{j\in R}{\theta_j\over r_j^2}\geq0,}
                                                               \tag{5.3}
\]

\[
 \boxed{b_n^Q=-2n\sum_{j\in R}{\theta_j\over n^2-r_j^2},}
                                                               \tag{5.4}
\]

\[
 \boxed{
 d_n=2\sum_{j\in R}
 {\theta_j(n^2+r_j^2)\over(n^2-r_j^2)^2}+\vartheta_n,}
                                                               \tag{5.5}
\]

and hence

\[
 \boxed{
 D_n=4n^2\sum_{j\in R}{\theta_j\over(n^2-r_j^2)^2}
      +\vartheta_n>0.}                              \tag{5.6}
\]

A shell at `k!=n` contributes to none of (5.3), (5.4), or (5.6).  A shell
at `n` contributes only `vartheta_n` to (5.5)--(5.6), and its root distance
at `n` is zero.

If `q_0>0` and `n` is not a shell, equations (5.3) and (5.6) write

\[
 {D_n\over4n^2}=\sum_{j\in R}{\theta_j\over r_j^2}
 {r_j^2\over(n^2-r_j^2)^2}.                       \tag{5.7}
\]

Because `q_0/2=sum_(j in R) theta_j/r_j^2`, the weighted average of
`r_j^2/(n^2-r_j^2)^2` in (5.7) is `D_n/(2n^2q_0)`.  Some regular atom is at
least that average; taking its reciprocal square root proves (0.4).  If `n`
is a shell, (0.4) is immediate from its zero left side.

Finally, positivity in (5.3) shows that `q_0=0` exactly when there are no
regular atoms.  There are `N` distinct roots and exactly `N` positive shell
locations, so then every `1<=n<=N` is a shell.  Equivalently,

\[
 \Phi=V_0,\qquad
 T=\sum_{n=1}^N\vartheta_n
 \bigl\{|V_n\rangle\langle V_n|
       +|V_{-n}\rangle\langle V_{-n}|\bigr\}.
                                                               \tag{5.8}
\]

Thus `D_n=vartheta_n>0`, the left side of (0.4) is zero, and the right side
is zero.  The all-shell edge is part of the theorem rather than a division
by `q_0` failure.

## 6. What the global cone did and did not supply

The strict global twisted cone `(-1)^n xi_n>0` supplied three facts in the
checkpoint-1.32 presentation that are now separated.

1. Its coordinate nonvanishing excluded every shell root.  This is the
   only part needed to replace (0.2) by a purely regular paired-Cauchy sum.
2. Its central nonvanishing excluded `tau=0`, but strict oddness already
   excludes that atom by (4.1)--(4.3).
3. It was not responsible for excluding infinity: boundary normalization
   already does that, and strict odd rank excludes it independently.

Positive selector weights come from the positive even moment cone and
simple rank.  Negative selector parameters come from the strict odd block.
Neither conclusion uses alternating ground signs.

Alternating signs remain essential for the separate twisted-Herglotz and
positive-mass arguments.  Without them, the center ground equation is not
a positive harmonic-moment inequality.  The present theorem therefore
preserves the selector localization gate after checkpoint 1.33, but it does
not resurrect the failed global-cone mass route or improve the weak actual
scale `q_0/D_N` obtained at checkpoint 1.32.

## 7. Fail-closed stopping line

The theorem is finite and conditional on (0.1).  Any downstream use must
reject a claimed pass if it

1. treats the actual simple-even ground or either genuine shifted sign as
   proved on an unbounded schedule;
2. deletes shell atoms instead of branching at their exact lattice roots;
3. divides by `q_0` in the all-shell case;
4. promotes (0.4) to unit root clearance without a new bound at scale
   `q_0/D_n=O(N^(-2))`;
5. recovers a positive twisted mass or Herglotz measure from selector-weight
   positivity; or
6. infers response decay, determinant convergence, an actual-arithmetic
   sign failure, a new zero theorem, RH, a converse, or a `Lambda` bound.

The surviving arithmetic obligation is a growing-uniform estimate on the
regular selector moments or atom weights.  Shells cause no localization
loss; the missing quantitative scale remains exactly the one isolated at
checkpoint 1.32.
