# Natural multiple-ground coordinate-shell selector projective barrier

## 0. Exact outcome and claim boundary

Let `A=Q_+` be a finite real inversion-even source-Cauchy compression, let

\[
 \mu=\min\operatorname {spec}(A),\qquad
 E=\ker(A-\mu I),\qquad P=P_E,\qquad d=\dim E,       \tag{0.1}
\]

and let `kappa` be a real unit anchor.  In the intended application it is
the projected-prolate anchor; the structural countermodels below use a
synthetic anchor and are explicitly not claims about that actual vector.
This note proves the exact finite conclusions below.

1. The axis-rooted vectors in `E`, together with zero, form a closed cone
   which need not be a vector space.
   Every limit of simple lowest lines selected by source-Cauchy-preserving
   perturbations belongs to that cone.  The legal positive rank-one
   selectors are only the coordinate shells and one rational Cauchy-kernel
   curve; an arbitrary anchor rank-one lowering is not source-Cauchy.
2. Even when `P*eta=0`, every nonzero coordinate projection `P*e_j^+` is
   axis-rooted.  If `P*kappa!=0`, at least one of those coordinate-selected
   lines has nonzero anchor overlap.  This is qualitative existence, not
   selection of the generally different line `P*kappa`.
3. There is an exact source-Cauchy counterfamily with `P*eta=0`,
   `P*kappa=kappa`, and raw Mellin polynomial

   \[
    (y^2+1)\prod_{m=4}^N(y-m^2).                  \tag{0.2}
   \]

   Its anchor-selected ground has four off-axis transform zeros.  No
   source-Cauchy-preserving sequence of simple lowest lines can converge to
   it.
4. Coordinate-shell averaging gives exact full-overlap and low-overlap
   identities.  The low projective error is controlled by the low overlap
   `||P*Pi*kappa||`, not merely by `||P*kappa||`.  A simultaneous selector
   exists, but the universal normalization loss is of order `sqrt(N+1)`.
5. If `N=M+1`, the trace average obeys

   \[
    \operatorname {tr}(P_{\cal L}P)\geq\max(0,d-2). \tag{0.3}
   \]

   Thus the trace-rate sufficient condition can handle at most a double
   bottom space eventually.  It is only sufficient: an exact multiple-
   ground family has a perfect coordinate selector while the trace grows.

This result removes finite simplicity and boundary visibility only at the
level of qualitative coordinate-selected cross-root existence.  It does
not prove low visibility, a quantitative selector rate, actual arithmetic
good-set nonemptiness, projective transform convergence, a determinant
limit, a zero theorem, the Riemann hypothesis, a converse, or a
de Bruijn--Newman bound.  The actual source is never replaced by a
synthetic family.  No standard-eight file, source lock, or numerical
artifact is changed.  The formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly two already-admitted note/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md` | `e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26` |
| `tests/test_source_cauchy_selector_cone_projective_tradeoff.py` | `f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee` |
| `notes/NATURAL_CENTERED_GATE_ANCHOR_COFACTOR_NONEMPTYNESS_REDUCTION_BARRIER.md` | `88f6ffa991547f5ca88aacce893a585f3047d7675200288cd18a57cbbcfb7699` |
| `tests/test_natural_centered_gate_anchor_cofactor_nonemptiness_reduction_barrier.py` | `b57ad035543d21e4d6746bb58c19764171706ecc613932f850ea71e6857186bb` |

The first pair supplies the complete finite selector-cone classification,
the rank-one source-Cauchy curve, coordinate-shell perturbations, and
coefficientwise closure of selected simple ground lines.  The second pair
supplies the repaired checkpoint-1.60 simple branch: a strict simple gate
automatically makes `P*kappa` nonzero and uses the eta-free normalization.

All new polynomial, coordinate-average, low-projective, tail-transfer,
rank, and countermodel calculations are proved below.  No new external
source, zero table, source sample, or computation is used.

## 2. The exact axis-rooted cone

Write a real inversion-even vector in raw centered modes as

\[
 f=\sum_{|n|\leq N}f_nV_n,\qquad f_{-n}=f_n,       \tag{2.1}
\]

and define

\[
 p_f(y)=f_0\prod_{m=1}^N(y-m^2)
 +2y\sum_{n=1}^Nf_n
       \prod_{\substack{1\leq m\leq N\\m\ne n}}(y-m^2).       \tag{2.2}
\]

The exact transform formula is

\[
 \widehat f(z)={\sqrt L\over\pi}{\sin(\pi s)\over s}
 {p_f(s^2)\over\prod_{m=1}^N(s^2-m^2)},
 \qquad s={zL\over2\pi}.                          \tag{2.3}
\]

Evaluation at `0,1^2,...,N^2` recovers all raw coefficients:

\[
 p_f(0)=(-1)^N(N!)^2f_0,                          \tag{2.4}
\]

\[
 p_f(n^2)=(-1)^{N-n}(N-n)!(N+n)!f_n,
 \qquad1\leq n\leq N.                            \tag{2.5}
\]

Thus `f mapsto p_f` is a linear isomorphism from the real even space to
the real polynomials of degree at most `N`.  A nonreal root of `p_f` cannot
cancel a lattice pole or sine zero in (2.3).  Consequently

\[
 \boxed{
 Z(\widehat f)\subset\mathbb R\cup i\mathbb R
 \quad\Longleftrightarrow\quad
 p_f\text{ is real-rooted}.}                      \tag{2.6}
\]

The exact nonzero axis-rooted subset of the bottom space is therefore

\[
 \boxed{
 {\cal R}(E)=\{0\ne f\in E_{\mathbb R}:
                 p_f\text{ is real-rooted}\}.}   \tag{2.7}
\]

Include the zero vector by writing

\[
 {\cal R}_0(E)={\cal R}(E)\mathbin\cup\{0\}.       \tag{2.8}
\]

The real-rooted polynomial cone, with the zero polynomial adjoined, is
coefficientwise closed, including limits in which roots escape to infinity
and the degree drops.  Hence `cal R_0(E)` is a closed cone and `cal R(E)`
is projectively closed.  Neither need be closed under addition.

### Theorem 2.1 (perturbative selection closure)

Let `Q_l` be real inversion-symmetric source-Cauchy matrices of the same
fixed dimension, with `Q_l -> Q` in operator norm.  Suppose the even block
of every `Q_l` has a simple lowest unit vector `x_l`, and its line converges
to a nonzero line `x in E`.  Then

\[
 \boxed{x\in{\cal R}(E).}                         \tag{2.9}
\]

Indeed, every `p_(x_l)` is real-rooted by the finite simple-even-ground
theorem.  Vector convergence gives coefficientwise polynomial convergence;
(2.4)--(2.5) exclude the zero polynomial.  Closedness proves (2.9).

The same argument applies to any sequence of already axis-rooted selected
vectors.  Therefore a vector outside `cal R(E)` cannot be selected or even
approximated at fixed `N` by a source-Cauchy-preserving cross-root
auxiliary.

## 3. Legal and illegal rank-one selectors

In the normalized parity basis

\[
 e_0^+=V_0,\qquad e_n^+={V_n+V_{-n}\over\sqrt2},  \tag{3.1}
\]

write an even selector direction as

\[
 w=w_0e_0^++\sum_{n=1}^Nw_ne_n^+.                \tag{3.2}
\]

The frozen selector-cone theorem proves that a positive rank-one even
block `|w><w|` has a source-Cauchy extension if and only if one of the
following holds:

1. `w` is one coordinate direction `e_j^+`;
2. `w_0!=0`, every positive-shell coordinate is nonzero, and for one real
   `rho` avoiding the finite poles,

   \[
    \boxed{w_n={\sqrt2w_0\over1+\rho n^2}.}       \tag{3.3}
   \]

In raw even coordinates the second condition is

\[
 f_n={f_0\over1+\rho n^2}.                        \tag{3.4}
\]

The boundary vector is `rho=0`; coordinate shells are the compactified
pole limits.  These rays generate the positive selector cone.  Adding a
large scalar identity to any Hermitian source-Cauchy selector changes no
ground-space eigendirection, so finite positive mixtures describe every
first-order selector direction furnished by the full source-Cauchy block
space.

If the largest eigenvalue of the ground-space compression of a positive
selector is simple, lowering by that selector chooses its top line as the
auxiliary parameter tends to zero.  Theorem 2.1 then forces the chosen line
to lie in `cal R(E)`.  The cone theorem does not say that every vector of
`cal R(E)` is selectable.

The literal full-matrix perturbation `-|kappa><kappa|` is even more
restrictive.  Up to a nonzero scalar, the exact nonzero inversion-even
full rank-one source-Cauchy matrices are

\[
 |\eta\rangle\langle\eta|
 \quad\hbox{and}\quad
 |V_0\rangle\langle V_0|.                        \tag{3.5}
\]

Indeed, its off-diagonal entries would have to satisfy, for all distinct
raw indices `i,j,k`,

\[
 (i-j)\kappa_i\kappa_j+(j-k)\kappa_j\kappa_k
 +(k-i)\kappa_k\kappa_i=0.                        \tag{3.6}
\]

For a nonzero full-support vector, division by the three coordinates says
that `1/kappa_n` is affine in `n`.  Inversion evenness makes that affine
function constant, giving the boundary direction.  The rank-one block
classification treats the zero coordinates and leaves only the central
coordinate as the sparse alternative, proving (3.5).  The more flexible
even-block completion still requires (3.3).  An arbitrary
projected-prolate anchor satisfies neither exact characterization by
source-Cauchy structure alone.

## 4. Exact `y^2+1` multiple-ground counterfamily

Fix `N>=3` and take the raw source-Cauchy parameters

\[
 a_n=1,\qquad b_n=n.                              \tag{4.1}
\]

Then every matrix entry equals one:

\[
 Q=|\eta\rangle\langle\eta|.                     \tag{4.2}
\]

Its even bottom space and boundary projection are

\[
 E=\eta_+^\perp,\qquad \dim E=N,
 \qquad P\eta_+=0.                                \tag{4.3}
\]

Define the raw even vector `f` by

\[
 f_0=-{1\over36},\qquad f_1={1\over24},
 \qquad f_2=-{17\over120},\qquad
 f_3={41\over360},                                \tag{4.4}
\]

and `f_n=0` for `4<=n<=N`.  The exact boundary sum is

\[
 f_0+2\sum_{n=1}^Nf_n=0,                         \tag{4.5}
\]

so `f in E`.  Direct substitution into (2.2) gives

\[
 \boxed{
 p_f(y)=(y^2+1)\prod_{m=4}^N(y-m^2).}            \tag{4.6}
\]

For `N=3` the product is empty.  Normalize `kappa=f/||f||`.  Then

\[
 P\kappa=\kappa,\qquad
 \langle\kappa,P\kappa\rangle=1,
 \qquad P\eta_+=0.                               \tag{4.7}
\]

Nevertheless, `s^2=+i` and `s^2=-i` give

\[
 s\in\left\{
 \mathord\pm{1+i\over\sqrt2},
 \mathord\pm{1-i\over\sqrt2}\right\},          \tag{4.8}
\]

four transform zeros off both axes.  Multiplying by a nonzero scalar does
not change them.  Hence the apparently optimal anchor-selected vector

\[
 X_\kappa={P\kappa\over\langle\kappa,P\kappa\rangle}
           =\kappa                                \tag{4.9}
\]

is not cross-rooted.

It is not a legal rank-one even selector either.  Formula (3.4) would give

\[
 \rho={f_0/f_1-1\over1^2}=-{5\over3},
 \qquad
 \rho={f_0/f_2-1\over2^2}=-{41\over204},         \tag{4.10}
\]

which is impossible.  More strongly, Theorem 2.1 and (4.6) exclude every
source-Cauchy-preserving simple-ground selection sequence, not just a
rank-one lowering.

Each nonzero coordinate projection `P*e_j^+` is nevertheless axis-rooted,
and these projections span `E`.  The example therefore also proves that a
linear combination of coordinate-selected cross-root vectors need not be
cross-rooted.  It is a synthetic source-Cauchy family, not the actual
arithmetic source or actual prolate state.

## 5. Coordinate-shell qualitative existence

For `0<=j<=N`, put

\[
 w_j=Pe_j^+.                                      \tag{5.1}
\]

Subtracting a positive number from the raw central diagonal for `j=0`, or
from both raw diagonals `+j,-j` for `j>0`, preserves inversion and the exact
source-Cauchy off-diagonal formula.  On the even block the perturbation is

\[
 A_{\varepsilon,j}=A-\varepsilon
        |e_j^+\rangle\langle e_j^+|.              \tag{5.2}
\]

If `w_j!=0`, rank-one interlacing gives one simple level below `mu`, and its
unit ground tends to `w_j/||w_j||`.  Theorem 2.1 yields

\[
 \boxed{w_j\ne0\quad\Longrightarrow\quad
        w_j\in{\cal R}(E).}                       \tag{5.3}
\]

Let

\[
 y=P\kappa,\qquad Y=\|y\|.                       \tag{5.4}
\]

Since the coordinate basis resolves the identity,

\[
 \sum_{j=0}^N|\langle\kappa,w_j\rangle|^2=Y^2.   \tag{5.5}
\]

Thus `Y>0` supplies at least one coordinate-selected axis-rooted ground
line with nonzero anchor overlap, even when `P*eta=0`.  If `Y=0`, every
vector of `E` is orthogonal to `kappa`; no coefficient-normalized bottom
line exists.  Some visibility condition is logically unavoidable.

This is where the multiple branch differs from checkpoint 1.60.  On the
strict simple branch, `P` has rank one and the complement gate itself
forces `P*kappa!=0`; that one ground line is already axis-rooted.  On a
multiple bottom space, `P*kappa!=0` proves only existence of some visible
coordinate-selected line.  The line `P*kappa` can fail (2.6), as Section 4
shows.

## 6. Three exact shell sums and two average ratios

Let `Pi=Pi_M` be the even low projector onto shells `0,...,M`, assume

\[
 p=\Pi\kappa\ne0,
 \qquad k_{00}=\|p\|^2,                           \tag{6.1}
\]

and define

\[
 {\cal L}=\operatorname {Ran}\Pi\cap p^\perp,
 \qquad P_L=P_{\cal L}.                           \tag{6.2}
\]

For each coordinate selector set

\[
 n_j=\|P_Lw_j\|^2,
 \qquad a_j=\langle\kappa,w_j\rangle,
 \qquad c_j=\langle p,w_j\rangle.                \tag{6.3}
\]

Finally put

\[
 Y_M=\|Pp\|,
 \qquad T=\operatorname {tr}(P_LP).              \tag{6.4}
\]

Completeness of the coordinate basis gives the exact identities

\[
 \boxed{\sum_{j=0}^Nn_j=T,}                      \tag{6.5}
\]

\[
 \boxed{\sum_{j=0}^N|a_j|^2=Y^2,}               \tag{6.6}
\]

\[
 \boxed{\sum_{j=0}^N|c_j|^2=Y_M^2.}             \tag{6.7}
\]

For example,

\[
 \sum_jn_j=\|P_LP\|_{\rm HS}^2
 =\operatorname {tr}(PP_LP)=\operatorname {tr}(P_LP).       \tag{6.7a}
\]

Weighted averaging of the nonzero denominators yields

\[
 \boxed{
 \min_{a_j\ne0}{n_j\over|a_j|^2}\leq {T\over Y^2}
 \quad(Y>0),}                                     \tag{6.8}
\]

and

\[
 \boxed{
 \min_{c_j\ne0}{n_j\over|c_j|^2}\leq {T\over Y_M^2}
 \quad(Y_M>0).}                                   \tag{6.9}
\]

The first ratio uses full anchor visibility.  The second is the ratio that
controls the low projective error.  They cannot be interchanged without a
tail comparison.

## 7. Exact low projective formula and simultaneous choice

For a fixed `j`, orthogonal decomposition inside `Ran(Pi)` gives

\[
 \Pi w_j={c_j\over k_{00}}p+P_Lw_j.              \tag{7.1}
\]

Completing the scalar square proves, whenever the displayed denominator is
nonzero,

\[
 \boxed{
 \min_{s\in\mathbb C}\|\Pi(sw_j-\kappa)\|^2
 ={k_{00}^2n_j\over k_{00}n_j+|c_j|^2}.}         \tag{7.2}
\]

For real data the minimizing scalar is

\[
 s_j={k_{00}c_j\over k_{00}n_j+c_j^2}.           \tag{7.3}
\]

If `c_j=0` and `n_j>0`, the minimum is `k_{00}`; if both vanish, the same
value follows directly because `Pi*w_j=0`.  Hence full overlap `a_j!=0`
does not by itself yield low projective approximation.

Combining (6.9) and (7.2), some axis-rooted coordinate line satisfies

\[
 \min_s\|\Pi(sw_j-\kappa)\|^2
 \leq k_{00}^2{T\over Y_M^2}.                    \tag{7.4}
\]

Thus

\[
 T=O(Y_M^2/\lambda)                              \tag{7.5}
\]

is an exact sufficient averaged target for the required
`O(lambda^(-1/2))` low projective error.  It is not proved for the actual
source.

There is a simultaneous low-overlap choice.  If `Y_M>0`, then for every
`theta>1` one can choose a coordinate with

\[
 \boxed{
 {n_j\over|c_j|^2}\leq
   \theta{T\over Y_M^2},
 \qquad
 |c_j|^2\geq
 {\left(1-\theta^{-1}\right)Y_M^2\over N+1}.}    \tag{7.6}
\]

Indeed, give the visible coordinates probability weights
`|c_j|^2/Y_M^2`.  The weighted mean of `n_j/|c_j|^2` is at most
`T/Y_M^2`.  Markov's inequality leaves weight at least
`1-theta^(-1)` on the coordinates satisfying the first inequality.  One
of at most `N+1` surviving coordinates has the stated mass.

At `theta=2`, the optimizing scalar in (7.3) satisfies

\[
 |s_j|\leq {k_{00}\over|c_j|}
 \leq {\sqrt{2(N+1)}\over Y_M}.                  \tag{7.7}
\]

This is a low-projective scaling bound, not yet an anchor normalization.
The full-overlap average has a separate simultaneous consequence, supplied
by the frozen delta tradeoff.  If `T>0`, some coordinate with
`q_j=||w_j||^2>0` and `a_j!=0` obeys

\[
 {n_j\over|a_j|^2}\leq {2T\over Y^2},
 \qquad {q_j\over|a_j|^2}\leq {2d\over Y^2}.     \tag{7.8}
\]

Thus the coefficient-normalized line `X_j=w_j/a_j` has norm at most
`sqrt(2d)/Y`; when `T=0`, the constants improve to zero and `d/Y^2`.
That selector need not be the low-overlap selector in (7.6).

For the coordinate chosen in (7.6), the pointwise tail estimate

\[
 |a_j-c_j|\leq\delta_M                           \tag{7.9}
\]

shows that anchor normalization is guaranteed only if

\[
 \delta_M< {\sqrt{1-\theta^{-1}}\,Y_M
                  \over\sqrt{N+1}}.             \tag{7.10}
\]

Under that margin,

\[
 |a_j|^{-1}\leq
 \left({\sqrt{1-\theta^{-1}}\,Y_M\over\sqrt{N+1}}
       -\delta_M\right)^{-1}.                    \tag{7.11}
\]

Without it, the bounds do not exclude `a_j=0`, even though a different
coordinate is qualitatively visible by (5.5).  For `N`
comparable to `lambda`, (7.7) and (7.11) carry a `sqrt(lambda)` loss.  The
average theorem alone does not supply the subpolynomial normalization or
high-tail estimate used in the existing transform bridge.  The constant
one in (6.9) is sharp already when `E` is one-dimensional, because then all
visible coordinate ratios equal `T/Y_M^2`.

## 8. Full-to-low visibility transfer and its failure

Let

\[
 \delta_M=\|(I-\Pi)\kappa\|.                     \tag{8.1}
\]

Contractivity of `P` and the reverse triangle inequality give

\[
 \boxed{|Y_M-Y|\leq\delta_M.}                    \tag{8.2}
\]

Moreover,

\[
 \boxed{
 \sum_{j=0}^N|a_j-c_j|^2
 =\|P(\kappa-p)\|^2\leq\delta_M^2.}             \tag{8.3}
\]

Consequently `Y>delta_M` implies `Y_M>0`, and `Y>=2delta_M` gives

\[
 Y_M\geq Y/2,
 \qquad {T\over Y_M^2}\leq {4T\over Y^2}.       \tag{8.4}
\]

Qualitative nonzero `Y` is insufficient.  For an exact diagonal
source-Cauchy example, take `b_n=0`, let the unique even ground be `e_N^+`,
put `M=N-1`, and choose

\[
 \kappa=\sqrt{1-\varepsilon^2}\,e_0^+
          +\varepsilon e_N^+,
 \qquad0<\varepsilon<1.                           \tag{8.5}
\]

Then

\[
 Y=\varepsilon>0,
 \qquad Y_M=0,
 \qquad T=0.                                     \tag{8.6}
\]

The ground line is a coordinate-selected axis-rooted line, and its full
ratio in (6.8) is zero.  Nevertheless, for every scalar `s`,

\[
 \|\Pi(se_N^+-\kappa)\|^2=1-\varepsilon^2.       \tag{8.7}
\]

This proves that `P*kappa!=0` plus a small trace is not a low projective
theorem.  A quantitative tail-to-visibility comparison is indispensable.

## 9. Natural one-shell rank obstruction

The ambient even space has dimension `N+1`.  Since `p!=0`, the low
perpendicular space has rank

\[
 \operatorname {rank}P_L=M,\qquad
 \operatorname {rank}(I-P_L)=N+1-M.              \tag{9.1}
\]

Using `rank(P)=d`, `0<=P(I-P_L)P<=P`, and
`tr((I-P_L)P)<=rank(I-P_L)`,

\[
 \begin{aligned}
 T&=\operatorname {tr}(P_LP)\\
  &=d-\operatorname {tr}((I-P_L)P)\\
  &\geq d-(N+1-M).
 \end{aligned}                                   \tag{9.2}
\]

Therefore

\[
 \boxed{T\geq\max\{0,d-(N+1-M)\}.}             \tag{9.3}
\]

At the natural adjacent cutoff `N=M+1`, this is (0.3).  Since
`Y_M^2<=1`, the averaged rate (7.5) along `lambda->infinity` forces `d<=2`
eventually.  Thus trace averaging relaxes simplicity, but it is not a
multiplicity-free solution.

The trace condition is not necessary.  Return to `Q=|eta><eta|`, so
`E=eta_+^perp` and `d=N`, and choose

\[
 \kappa={Pe_0^+\over\|Pe_0^+\|}.                 \tag{9.4}
\]

The coordinate `j=0` selects exactly the anchor line, which is axis-rooted,
and its projective error is zero.  Yet at `N=M+1`, (9.3) gives

\[
 T\geq N-2.                                      \tag{9.5}
\]

Thus the invariant trace average can be arbitrarily worse than the best
individual coordinate.  The exact weakest coordinate target is the
minimum in (6.9), not the stronger trace quotient.

## 10. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. assumes that every vector in a multiple lowest eigenspace is
   cross-rooted;
2. identifies `P*kappa` with a legal source-Cauchy selector without checking
   (3.3), or assumes arbitrary rank-one anchor lowering preserves the
   source class;
3. ignores the `y^2+1` counterfamily or treats it as the actual arithmetic
   source;
4. infers low visibility `Y_M>0` from qualitative full visibility `Y>0`
   without a tail margin;
5. substitutes the full-overlap ratio (6.8) for the low-overlap ratio
   (6.9) in the projective bridge;
6. treats the low scaling `c_j` as the full normalization `a_j`, omits the
   margin (7.10), or drops the `sqrt(N+1)` loss in (7.7)--(7.11);
7. treats the sufficient trace rate as necessary, or ignores the rank
   lower bound (9.3);
8. transfers checkpoint 1.60's automatic simple-ground visibility to a
   multiple bottom space;
9. infers actual good-set nonemptiness, a quantitative selector, or
   projective convergence from qualitative coordinate existence; or
10. claims a determinant limit, a zeta-zero theorem, RH, a converse, or a
    de Bruijn--Newman bound.

The proved content is a finite selector/closure theorem, an exact
nonselection counterfamily, coordinate-shell qualitative existence, exact
full and low shell averages, a simultaneous selector bound, tail transfer,
and the natural-cutoff rank obstruction.  Actual-source low visibility and
the quantitative minimum-shell projective rate remain open.  The formal
state remains `P0_INVALIDATED`.
