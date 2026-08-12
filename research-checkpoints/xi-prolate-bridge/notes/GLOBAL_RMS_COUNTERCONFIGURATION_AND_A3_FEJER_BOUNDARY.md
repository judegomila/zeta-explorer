# Global RMS counterconfiguration and the `A_3/L` Fejer boundary

## Scope

This note gives a synthetic centered-zero multiset for which the positive
part of the signed forward sum is smaller than its coefficient RMS by a
factor `O(1/L)` at every sufficiently large real length.  Consequently the
new cancellation-free sufficient condition

\[
 Q_2(L)=o\bigl(L\Psi(L)\bigr),\qquad \Psi(L)>0,       \tag{0.1}
\]

cannot follow from conjugation/reflection symmetry, the open strip, an
`O(H log H)` count, and Hadamard `alpha^(-2)` summability alone.

The construction is **not** the zeta-zero set.  More importantly, it does not defeat the sharper absolute history majorant `A_3`: its large ordinate
scale makes `A_3` much smaller than `Q_2`.  A second theorem below proves
that the ordered commensurate Fejer mechanism cannot defeat the actual
`A_3/L` scale.  No unconditional nonattained-edge vector theorem, actual-
zeta statement, RH conclusion, graph theorem, routing theorem, or Lambda
bound is asserted.  No source lock, numerical artifact, or project status
is changed.

Use the conventions

\[
 \Psi(L)=\sum_{\alpha\in Z_+}
 {2\{\cosh(\alpha L)-1\}\over\alpha^2},\qquad
 Q_2(L)^2=\sum_{\alpha\in Z_+}
 {e^{2(\Re\alpha)L}\over|\alpha|^4},                 \tag{0.2}
\]

where `Z_+` contains both members of every conjugate pair in the right half
strip and multiplicity is retained.

## 1. A one-sided convex cosine lemma

Let `c_1,...,c_n` be nonnegative, decreasing, and convex after adjoining
`c_(n+1)=c_(n+2)=0`.  Put

\[
 d_m=c_m-2c_{m+1}+c_{m+2}\geq0.                     \tag{1.1}
\]

The Fejer kernels

\[
 F_m(\theta)=1+2\sum_{j=1}^m
 \left(1-{j\over m+1}\right)\cos(j\theta)\geq0      \tag{1.2}
\]

give the exact decomposition

\[
 -2\sum_{j=1}^nc_j\cos(j\theta)
 =\sum_{m=1}^n(m+1)d_m\{1-F_m(\theta)\}.            \tag{1.3}
\]

Indeed the coefficient of `-2*cos(j*theta)` on the right is
`sum_(m>=j)(m+1-j)d_m=c_j`.  Hence

\[
 \boxed{-2\sum_{j=1}^nc_j\cos(j\theta)
 \leq\sum_{m=1}^n(m+1)d_m=2c_1-c_2\leq2c_1.}        \tag{1.4}
\]

This elementary inequality is the only one-sided trigonometric input.

## 2. Stable squared-Fejer blocks

Fix

\[
 B={1\over2},\qquad R={16\over15},\qquad
 T_k=T_0R^k,\qquad n_k=\lceil T_k^4\rceil,
 \qquad N_k=n_k+1.                                  \tag{2.1}
\]

For `T_0` sufficiently large choose

\[
 b_k=B-T_k^{-1/2},\qquad
 \beta_{k,j}=b_k+{2\over T_k}\log\{j(N_k-j)\},
 \quad 1\leq j\leq n_k.                            \tag{2.2}
\]

The internal width is `O(log(T_k)/T_k)`, whereas
`b_(k+1)-b_k` is a positive constant times `T_k^(-1/2)`.
After increasing `T_0`, therefore,

\[
 0<\beta_{k,j}<B,qquad
 \max_j\beta_{k,j}<\min_j\beta_{k+1,j}.             \tag{2.3}
\]

Let `G_k>B` be chosen below and put

\[
 \gamma_{k,j}=\sqrt{j^2G_k^2-\beta_{k,j}^2},\qquad
 \alpha_{k,j}=\beta_{k,j}+i\gamma_{k,j}.            \tag{2.4}
\]

Thus `|alpha_(k,j)|=j*G_k` exactly.  Include
`alpha_(k,j)` and its conjugate in `Z_+`, and include their negatives in the
full centered multiset.

For `L=q*T_k`, define

\[
 K_k(L)={e^{b_kL}\over G_k^2},\qquad
 c_{k,j}(q)=j^{\,2q-2}(N_k-j)^{2q}.                 \tag{2.5}
\]

The forward magnitude of either conjugate is exactly

\[
 {e^{\beta_{k,j}L}\over|\alpha_{k,j}|^2}
 =K_k(L)c_{k,j}(q),                                 \tag{2.6}
\]

and the block RMS is

\[
 Q_k(L)=\sqrt2K_k(L)
 \left(\sum_{j=1}^{n_k}c_{k,j}(q)^2\right)^{1/2}.   \tag{2.7}
\]

### Lemma 2.1 (uniform stable-block cap)

On

\[
 J_k=[7T_k/8,T_k]                                   \tag{2.8}
\]

one can choose the common scale of the `G_k` so that the forward
contribution `P_k` of block `k` satisfies

\[
 \boxed{P_k(L)\leq C{Q_k(L)\over T_k}}              \tag{2.9}
\]

with one absolute constant `C`.

**Proof.**  Write `a=2-2q` and `r=2q`.  For `7/8<=q<=1`,

\[
 c_{k,j}(q)=f(j),\qquad f(x)=x^{-a}(N_k-x)^r,
\]

where `a>=0`, `r>1`, `f` is decreasing, and

\[
 {f''(x)\over f(x)}={a(a+1)\over x^2}
 +{2ar\over x(N_k-x)}+{r(r-1)\over(N_k-x)^2}\geq0. \tag{2.10}
\]

Lemma 1 therefore caps the ideal phase sum by `2*K_k*c_(k,1)`.
For `N_k/4<=j<=N_k/2`, direct comparison gives

\[
 \left(\sum_jc_{k,j}(q)^2\right)^{1/2}
 \geq C_0N_k^{\,4q-3/2},\qquad
 {c_{k,1}(q)\over(\sum_jc_{k,j}(q)^2)^{1/2}}
 \leq C_1N_k^{\,3/2-2q}\leq {C_2\over T_k}.         \tag{2.11}
\]

It remains to replace the ideal phase `j*G_k*L-pi` by the actual phase
`gamma_(k,j)*L-2*arg(alpha_(k,j))`.  Equations (2.3)--(2.4) imply, uniformly
for `L<=T_k`,

\[
 |(\gamma_{k,j}-jG_k)L+\pi-2\arg\alpha_{k,j}|
 \leq {C_3T_k\over jG_k}.                           \tag{2.12}
\]

Since the `c_(k,j)` decrease,
`sum_j c_(k,j)/j <= c_(k,1)(1+log n_k)`.  The total phase error is therefore
at most

\[
 C_4K_kc_{k,1}{T_k(1+\log n_k)\over G_k}.           \tag{2.13}
\]

Taking `G_k>=C_5*T_k*(1+log n_k)` and using (2.11) absorbs (2.13) into
`C*Q_k/T_k`.  \(\square\)

## 3. Ordering the blocks

Put

\[
 M_k={29\over30}T_k.                                \tag{3.1}
\]

Write `Q_k=G_k^(-2)*widetilde Q_k`, where `widetilde Q_k` is independent
of `G_k`, and recursively impose

\[
 G_{k+1}=G_k
 \left({\widetilde Q_{k+1}(M_k)
             \over\widetilde Q_k(M_k)}\right)^{1/2}. \tag{3.2}
\]

Then `Q_k(M_k)=Q_(k+1)(M_k)`.  The logarithmic derivative of `Q_k` is a
weighted average of the `beta_(k,j)`.  The strict band ordering (2.3)
therefore shows that `Q_(k+1)/Q_k` is strictly increasing.  In particular,

\[
 \boxed{Q_k(L)=\max_iQ_i(L)\quad
        (M_{k-1}\leq L\leq M_k).}                   \tag{3.3}
\]

Comparison of (2.7) at the two fixed values `q=29/30` and `q=29/32`
shows

\[
 \log{G_{k+1}\over G_k}\geq c\sqrt {T_k}-C\log T_k. \tag{3.4}
\]

Thus the `G_k` grow faster than every fixed power of `T_k`.  Multiplying
all of them by one common constant preserves (3.2); do so once to enforce
all phase bounds in Lemma 2.1 and also `G_k>>T_k^2 log n_k`, which will be
used for positive peaks.

The cells in (3.3) lie inside the stable intervals:

\[
 {M_{k-1}\over T_k}={29\over32}>{7\over8},qquad
 {M_k\over T_k}={29\over30}<1.                      \tag{3.5}
\]

At most three stable intervals contain one real `L`.  For every other
block, integrating the adjacent logarithmic-slope gaps from its crossover
gives an `exp(-c*sqrt(T_i))` loss relative to the maximal block.  Since

\[
 |P_i(L)|\leq2\sum_j{e^{\beta_{i,j}L}\over|\alpha_{i,j}|^2}
 \leq\sqrt{2n_i}\,Q_i(L),                           \tag{3.6}
\]

geometric summation yields, uniformly on the `k`th cell,

\[
 \sum_{i:\,L\notin J_i}|P_i(L)|=o\left({Q_k(L)\over L}\right). \tag{3.7}
\]

The backward exponentials and constant terms in `Psi` have total absolute
value at most `C*sum_k G_k^(-2)`.  On the `k`th cell, (3.3) gives
`Q_k(L)>=Q_1(L)>=c_1*exp(beta_(1,1)*L)`, so this fixed remainder is also
`o(Q_k(L)/L)`.  Lemma 2.1, the at-most-three overlap, and (3.7) prove

\[
 \boxed{\Psi(L)\leq C{Q_k(L)\over L}
       \leq C{Q_2(L)\over L}}                       \tag{3.8}
\]

for every sufficiently large real `L`.

## 4. The synthetic counterconfiguration

### Theorem 4.1 (global generic RMS no-go)

There is a discrete centered-zero multiset with conjugation and reflection
symmetry such that

\[
 0<\Re\alpha<B={1\over2},\qquad
 \sup\Re\alpha=B\ \hbox{is not attained},           \tag{4.1}
\]

\[
 \sum_{\alpha\in Z_+}|\alpha|^{-2}<\infty,qquad
 N(H)=O(H),                                          \tag{4.2}
\]

and

\[
 \limsup_{L\to\infty}\Psi(L)=+\infty,\qquad
 \boxed{{\Psi_+(L)\over Q_2(L)}=O(L^{-1})}          \tag{4.3}
\]

for every sufficiently large real `L`.  Hence (4.3) holds in particular
at every strict-half-integer logarithmic grid point.

**Proof.**  Equations (2.2)--(2.3) prove (4.1).  Since
`|alpha_(k,j)|=j*G_k`,

\[
 \sum_{\alpha\in Z_+}|\alpha|^{-2}
 =2\sum_kG_k^{-2}\sum_{j=1}^{n_k}j^{-2}<\infty      \tag{4.4}
\]

by (3.4).  The same growth separates consecutive ordinate blocks by more
than their preceding total population.  Within a block the ordinates are
comparable to `j*G_k`; splitting at the first active block gives
`N(H)=O(H)`, stronger than the required `O(H log H)` count.  Equation (3.8)
proves the second assertion in (4.3).

It remains to exclude a vacuous all-negative example.  Set
`L_k^*=15*T_k/16`, which stays a fixed positive distance from both adjacent
crossovers.  For the ideal block polynomial

\[
 X_k(\theta)=-2K_k(L_k^*)
              \sum_jc_{k,j}(15/16)\cos(j\theta),    \tag{4.5}
\]

the mean is zero, the lower bound is
`-2*K_k*sum_j c_(k,j)`, and the mean square is
`2*K_k^2*sum_j c_(k,j)^2`.  The elementary variance bound for a random
variable in `[-A,M]` with mean zero gives

\[
 \max_\theta X_k(\theta)
 \geq K_k{\sum_jc_{k,j}^2\over\sum_jc_{k,j}}
 \geq {Q_k(L_k^*)\over\sqrt{2n_k}}.                 \tag{4.6}
\]

Varying `L` by at most `2*pi/G_k` realizes a maximizing phase.  The stronger
common scaling after (3.4), the fixed crossover distance, and (3.6) make
the phase error, all other blocks, and the bounded backward/constant
remainder `o(Q_k/sqrt(n_k))`.  Finally
`Q_k(L)>=Q_1(L)>=c*exp(beta_(1,1)*L)` on the `k`th cell, while
`sqrt(n_k)=O(T_k^2)`.  The resulting positive values tend to infinity.
This proves (4.3).  \(\square\)

The theorem is a counterexample only to a **generic RMS implication**.  In
this construction

\[
 A_{3,k}(L)=2K_k(L)G_k^{-1}
             \sum_{j=1}^{n_k}{c_{k,j}(q)\over j},   \tag{4.7}
\]

so the rapidly growing `G_k` makes `A_3` far smaller than `Q_k`.

## 5. Why ordered Fejer blocks cannot defeat `A_3/L`

There is an exact obstruction, not merely a defect of the preceding
parameters.  Suppose

\[
 P(\theta)=-2\sum_{j=1}^na_j\cos(j\theta)\leq M,
 \qquad a_j\geq0.                                   \tag{5.1}
\]

Then `M-P` is a nonnegative trigonometric polynomial of mean `M`.  Every
one of its Fourier coefficients has modulus at most its mean, so

\[
 a_j\leq M,qquad
 \boxed{\sum_{j=1}^n{a_j\over jG}\leq {MH_n\over G}.} \tag{5.2}
\]

Thus a commensurate block can gain at most one harmonic logarithm at the
`A_3` scale.

For an ordered Fejer block fitted at length `T`, take for example

\[
 {e^{\beta_jT}\over j^2G^2}=A\left(1-{j\over n+1}\right).
                                                               \tag{5.3}
\]

Comparing `j=1` with `j=floor(n/2)` gives

\[
 \max_j\beta_j-\min_j\beta_j
 \geq {2\log n-O(1)\over T}.                       \tag{5.4}
\]

If all real parts lie in one fixed strip of width `B`, then
`log n <= B*T/2+O(1)`.  Combining this with (5.2) gives

\[
 {A_{3,\mathrm{block}}\over T M}\leq {C_B\over G}+o(1). \tag{5.5}
\]

In particular no ordered harmonic Fejer family with `G` bounded away from
zero can have `M=o(A_3/T)`.  Squared Fejer weights give the same conclusion.
This rules out upgrading Theorem 4.1 to an `A_3/L` counterexample by merely
enlarging or concatenating its commensurate Fejer blocks.

## 6. Exact surviving lemma

Noncommensurate close-frequency binomial blocks can evade (5.4) on one
finite window, but their later carrier recurrences have positive peaks of
the full absolute size.  Ordered exponential dominance does not suppress
those peaks by the additional inverse-ordinate factor in `A_3`.  The
generic hypotheses used here neither prove that all such recurrent peaks
hit the diagonal nor rule out cancellation by other clusters.

Accordingly the remaining analytic input can be named precisely:

> **Noncommensurate diagonal inverse-ordinate peak lemma.**  For a
> nonattained positive edge, prove that the strip, count, summability, and
> the actual arithmetic phase structure force infinitely many admissible
> diagonal (and, for the application, strict-grid) lengths with
> `Psi(L) >> A_3(L)/L` by an unbounded factor.

A frozen-phase Turan--Nazarov, Littlewood, or Fejer supremum estimate is not
this lemma: it may move the phase away from the same `L` that exponentially
tilts the coefficients.  The strict-grid return also uses the zeta-specific
PNT derivative bound, which is absent from a generic synthetic zero set.
Theorem 4.1 and (5.5) therefore leave the actual `A_3/L` problem open, with
no actual-zeta conclusion in either direction.
