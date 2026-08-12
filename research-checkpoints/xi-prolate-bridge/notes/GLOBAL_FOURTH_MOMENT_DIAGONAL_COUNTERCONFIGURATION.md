# Global fourth-moment diagonal counterconfiguration

## 0. Exact outcome and claim boundary

This note settles a generic question left open by
`ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md`.  Conjugation/reflection
symmetry, a nonattained positive centered-zero edge, inverse-square
summability, the Riemann--von Mangoldt count magnitude, and the local count

\[
 N(H+1)-N(H)=O(\log H)                              \tag{0.1}
\]

do **not** imply the fourth-moment diagonal gate.  There is a synthetic
centered-zero multiset, with every off-axis zero simple, for which

\[
 0<\Re\alpha<B={1\over4},\qquad
 \sup\Re\alpha=B\quad\hbox{and the supremum is not attained}, \tag{0.2}
\]

and, for every fixed `0<b<B`,

\[
 \boxed{
   |\Psi(L)|\leq C_b{A_{4,b}(L)\over L^2}
   \qquad(L\geq L_b),}                             \tag{0.3}
\]

where

\[
 \Psi(L)=\sum_{\alpha\in Z_+}
 {2\{\cosh(\alpha L)-1\}\over\alpha^2},\qquad
 A_{4,b}(L)=\sum_{\substack{\alpha\in Z_+\\
                              \Re\alpha\geq b}}
 {e^{(\Re\alpha)L}\over|\alpha|^4}.               \tag{0.4}
\]

Nevertheless the scalar Landau conclusion is as strong as in the actual
reduction:

\[
 \boxed{
  \limsup_{L\to\infty}e^{-bL}\Psi(L)=+\infty}       \tag{0.5}
\]

for every `0<b<B`, and the divergent positive values in (0.5) occur on an
unbounded strict-half-integer natural grid sequence.  Equations
(0.3)--(0.5) hold on the **same** multiset.  Therefore, whenever
`Psi(L)>0`,

\[
 {A_{4,b}(L)\over L^2\Psi(L)}\geq {1\over C_b},     \tag{0.6}
\]

so no positive strict-grid subsequence can satisfy
`A_(4,b)=o(L^2 Psi)`.

The mechanism is a family of close-frequency Gaussian packets.  Their
positive Gaussian weights are realized by small changes of the real parts,
not by multiplicity.  Poisson summation makes a packet exponentially small
through its entire active diagonal window.  Its first exact carrier
recurrence occurs only after the next packet's fourth-moment envelope has
already swallowed it.  This resolves the beta-budget/recurrence issue for
a synthetic multiset.

The construction is **not** the zeta-zero set.  It proves only that the
named symmetry, summability, and zero-count magnitude inputs are
insufficient.  It does not exclude a zeta-specific spacing, correlation,
Turan, or explicit-formula theorem that proves the gate.  The count filler
below reproduces the Riemann--von Mangoldt main term with an `O(log H)`
remainder; no claim is made about matching a sharp numerical constant in a
particular explicit HSW inequality.  This note proves no RH statement, no
unconditional actual-zero selection, no graph routing theorem, no equation
(5.2) of `DIRECT_RH_ATTACK.md`, and no Lambda bound.  The formal state
remains `P0_INVALIDATED`.

The protected source bytes used only to fix conventions remain

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |

## 1. The off-axis packets

Put

\[
 B={1\over4},\qquad h={\pi\over16},\qquad
 c_*={\pi^2\over16384},                            \tag{1.1}
\]

and fix

\[
 0<g<{c_*\over100}.                                \tag{1.2}
\]

Take a sufficiently large integer `n_0` and set

\[
 n_k=2^kn_0,\qquad T_k=n_k^2,\qquad
 G_k=e^{g n_k},\qquad b_k=B-{2g\over n_k}.         \tag{1.3}
\]

For each integer `j` with `|j|<=n_k`, define

\[
 \begin{aligned}
 \beta_{k,j}
   &=b_k-{j^2\over2n_kT_k},\\
 \gamma_{k,j}
   &=G_k+{hj\over T_k},\\
 \alpha_{k,j}
   &=\beta_{k,j}+i\gamma_{k,j}.
 \end{aligned}                                     \tag{1.4}
\]

Choose `n_0` so large that every `beta_(k,j)` is positive and every
`gamma_(k,j)` is positive.  Put both `alpha_(k,j)` and its conjugate in
`Z_+`, with multiplicity one, and put their negatives in the full centered
multiset.  The packet real parts satisfy

\[
 B-{2g+1/2\over n_k}
 \leq\beta_{k,j}\leq B-{2g\over n_k}<B.            \tag{1.5}
\]

Consequently (0.2) holds.

There are `2n_k+1` right-half zeros near the positive carrier `G_k`, the
same number near `-G_k`, and the complete centered orbit has the required
reflection/conjugation symmetry.  The ordinate width of either packet is
`2h/n_k`.  Since

\[
 \log G_k=g n_k,\qquad G_{k+1}=G_k^2,              \tag{1.6}
\]

distinct packets are eventually separated by more than one, while the
population in a unit ordinate interval is

\[
 O(n_k)=O(\log G_k).                               \tag{1.7}
\]

Moreover, for `s=1,2`,

\[
 \sum_{\alpha\ {\rm off\ axis}}|\alpha|^{-s}
 \ll_s\sum_{k\geq0}n_ke^{-sgn_k}<\infty.           \tag{1.8}
\]

The first-power convergence in (1.8), stronger than the required
inverse-square convergence, will make strict-grid transfer elementary.

## 2. Harmless critical-line count filler

The sparse packets alone satisfy the local upper bound but not the global
Riemann--von Mangoldt main term.  Add a critical-line filler as follows.
For sufficiently large `H`, let

\[
 {\cal N}(H)={H\over2\pi}\log{H\over2\pi e}+{7\over8}. \tag{2.1}
\]

After a fixed starting height this is strictly increasing.  For each
integer `m` beyond the corresponding starting index, let `eta_m` be the
unique solution of

\[
 {\cal N}(\eta_m)=m.                               \tag{2.2}
\]

Add `i*eta_m` to `Z_+` and its negative to the full centered multiset.  A
finite initial filler can be chosen arbitrarily away from zero.  Then

\[
 N_{\rm fill}(H)={\cal N}(H)+O(1),\qquad
 N_{\rm fill}(H+1)-N_{\rm fill}(H)=O(\log H).       \tag{2.3}
\]

Up to height `H`, all off-axis packets together contribute `O(log H)`
zeros.  Indeed, if `G_k<=H<G_(k+1)`, their cumulative population is
`O(n_k)=O(log H)`.  Hence the combined positive-ordinate count obeys

\[
 \boxed{
 N(H)={H\over2\pi}\log{H\over2\pi e}+{7\over8}
       +O(\log H),\qquad
 N(H+1)-N(H)=O(\log H).}                           \tag{2.4}
\]

The filler also has inverse-square summability.  Its contribution to
`Psi` is

\[
 \Psi_{\rm fill}(L)
 =\sum_m{2\{1-\cos(\eta_mL)\}\over\eta_m^2},       \tag{2.5}
\]

which is nonnegative and uniformly bounded.  For every `b>0` the filler is
absent from `A_(4,b)`.  Thus it changes neither the exponential gate nor
the positive strict-grid peaks.

## 3. A uniform Gaussian theta estimate

For `n>=1` and `q>0`, write

\[
 \Theta_n(q)=\sum_{j\in\mathbb Z}
 \exp\left(-{qj^2\over2n}+iqhj\right).             \tag{3.1}
\]

Poisson summation gives the exact identity

\[
 \Theta_n(q)=\sqrt{2\pi n\over q}
 \sum_{\ell\in\mathbb Z}
 \exp\left\{-{n(qh-2\pi\ell)^2\over2q}\right\}.    \tag{3.2}
\]

On the fixed interval

\[
 I=\left[{1\over32},8\right],                     \tag{3.3}
\]

one has `0<qh<=pi/2`.  The nearest dual point in (3.2) is therefore zero,
and

\[
 {n(qh)^2\over2q}={nqh^2\over2}\geq c_*n.         \tag{3.4}
\]

The other dual terms are smaller by a fixed exponential factor.  Hence

\[
 \boxed{
 |\Theta_n(q)|\leq C\sqrt n\,e^{-c_*n}
 \qquad(q\in I).}                                  \tag{3.5}
\]

Differentiating (3.2) with respect to the phase shows that, for every fixed
integer `r>=0`,

\[
 \left|\sum_{j\in\mathbb Z}j^r
 e^{-qj^2/(2n)+iqhj}\right|
 \leq C_r n^{r+1/2}e^{-c_*n}.                     \tag{3.6}
\]

After decreasing `c_*` by an inessential fixed factor, the same estimate
holds when the sum is truncated to `|j|<=n`.  Indeed the omitted Gaussian
tail and all of its fixed polynomial moments are

\[
 O_r\left(n^{r+1}e^{-qn/2}\right)
 =O_r\left(n^{r+1}e^{-n/64}\right),               \tag{3.7}
\]

and `1/64>c_*`.

The small spacing `h/T_k` is commensurate inside one packet, but its first
exact recurrence after the active phase occurs at

\[
 q={2\pi\over h}=32.                               \tag{3.8}
\]

Thus (3.5) covers the complete interval through `q=8`; Section 5 will show
that the packet is already fourth-moment-suppressed before the recurrence.

## 4. Stable diagonal cancellation for one packet

Fix a packet, abbreviate `n=n_k`, `T=T_k`, `G=G_k`, and put `L=qT`.  Its
positive-ordinate forward complex sum before conjugate pairing is

\[
 F_k(L)=\sum_{|j|\leq n}{e^{\alpha_{k,j}L}\over\alpha_{k,j}^2}
 =e^{b_kL+iGL}
  \sum_{|j|\leq n}
  {e^{-qj^2/(2n)+iqhj}\over\alpha_{k,j}^2}.        \tag{4.1}
\]

Write

\[
 \alpha_{k,j}=iG+w_j,\qquad
 w_j=\beta_{k,j}+i{hj\over T}.                    \tag{4.2}
\]

Uniformly in `|j|<=n`, `w_j=O(1)`.  The exact Taylor expansion with a
uniform remainder is

\[
 {1\over(iG+w_j)^2}
 =-{1\over G^2}
 \left\{1-2{w_j\over iG}+3\left({w_j\over iG}\right)^2
       +O(G^{-3})\right\}.                         \tag{4.3}
\]

The displayed terms in braces are polynomials in `j` of degree at most
four, with coefficients of at most polynomial size in `n`.  Equations
(3.6)--(3.7) therefore imply, uniformly for `q in I`,

\[
 |F_k(L)|
 \leq C e^{b_kL}\sqrt n
 \left\{n^Ce^{-c_*n}G^{-2}+G^{-5}\right\}.         \tag{4.4}
\]

Let

\[
 V_k(L)=2\sum_{|j|\leq n}
 {e^{\beta_{k,j}L}\over|\alpha_{k,j}|^4}          \tag{4.5}
\]

be the packet contribution to `A_4`; the factor two counts conjugates.
Since `|alpha_(k,j)|` is uniformly comparable with `G`,

\[
 V_k(L)\asymp e^{b_kL}G^{-4}
 \sum_{|j|\leq n}e^{-qj^2/(2n)}.                  \tag{4.6}
\]

On `I`, the last sum is comparable with `sqrt(n)`.  By (1.2), the
exponential factor in (4.4) absorbs `G^2L^2` and every fixed power of `n`.
Also `G/L^2` tends to infinity.  Consequently

\[
 \boxed{
 |F_k(L)|\leq C{V_k(L)\over L^2}
 \qquad\left({1\over32}\leq {L\over T_k}\leq8\right).} \tag{4.7}
\]

This is the beta-tuned packet estimate.  It uses one zero for each
Gaussian coefficient; no coefficient is created by a large zero
multiplicity.

## 5. The global gliding estimate and recurrence control

For absolute forward estimates put

\[
 U_k(L)=e^{b_kL}G_k^{-2}
 \sum_{|j|\leq n_k}e^{-(L/T_k)j^2/(2n_k)}.         \tag{5.1}
\]

Then `|F_k(L)|<=C U_k(L)`.  Two exact scale relations drive the gliding
argument:

\[
 n_{k+1}=2n_k,\quad T_{k+1}=4T_k,\quad
 b_{k+1}-b_k={g\over n_k},\quad
 G_{k+1}=G_k^2.                                    \tag{5.2}
\]

### 5.1 Old packets, including all later recurrences

Let `q=L/T_k>=8`.  The central term of packet `k+1` gives

\[
 V_{k+1}(L)\geq c e^{b_{k+1}L}e^{-8gn_k}.         \tag{5.3}
\]

On the other hand (5.1) is at most a polynomial factor times
`e^(b_k L-2g n_k)`.  Thus

\[
 \log{V_{k+1}(L)\over U_k(L)}
 \geq g(q-6)n_k-O(\log(n_k+q)).                   \tag{5.4}
\]

The right side is at least `2g*n_k-O(log(n_k+q))` at `q=8` and then grows
linearly in `q`.  Therefore, uniformly for `q>=8` and large `k`,

\[
 \boxed{U_k(L)\leq {V_{k+1}(L)\over L^2}.}         \tag{5.5}
\]

In particular the full packet peak at its first recurrence `q=32` is
already harmless.  Every later recurrence is even more strongly
suppressed.  This is the point at which the extra fourth inverse ordinate
and the global beta budget are balanced rather than ignored.

### 5.2 Packets too far in the future

For every sufficiently large `L`, choose the unique `k` such that

\[
 {T_k\over2}\leq L<2T_k.                           \tag{5.6}
\]

Write `n=n_k`.  If `m>=3`, a crude count of all terms in packet `k+m`
and the central lower bound for `V_k` give

\[
 \begin{aligned}
 \log{U_{k+m}(L)\over V_k(L)}
 &\leq (b_{k+m}-b_k)L-2g\,2^mn+4gn+O(\log(2^mn))\\
 &\leq \{8-2^{m+1}\}gn+O(\log(2^mn)).             \tag{5.7}
 \end{aligned}
\]

For `m=3` the main coefficient is `-8g`, and it decreases geometrically
after that.  Hence

\[
 \boxed{
 \sum_{m\geq3}U_{k+m}(L)\leq {V_k(L)\over L^2}.}  \tag{5.8}
\]

### 5.3 Complete forward sum

Under (5.6), the four packet ratios for indices `k-1,k,k+1,k+2` lie in

\[
 [2,8],\quad[1/2,2],\quad[1/8,1/2],\quad[1/32,1/8], \tag{5.9}
\]

respectively.  They are all covered by (4.7).  Every index `i<=k-2` has
`L/T_i>=8` and is covered by (5.5); every `i>=k+3` is covered collectively
by (5.8).  Since the maps `i -> i+1` in (5.5) are injective,

\[
 \boxed{
 \sum_i|F_i(L)|\leq {C\over L^2}\sum_iV_i(L)}      \tag{5.10}
\]

for all sufficiently large real `L`.

The conjugate-paired forward part of `Psi` is `2*Re sum_i F_i`.  The
backward exponential and constant parts have total absolute value

\[
 O\left(\sum_{\alpha\ {\rm off\ axis}}|\alpha|^{-2}\right)=O(1). \tag{5.11}
\]

The filler (2.5) is also bounded.  Fix `0<b<B`.  All zeros in every
sufficiently late packet have real part greater than `b`.  Terms from the
finitely many excluded off-axis zeros have exponential rate strictly less
than `b`, whereas one included later zero gives

\[
 A_{4,b}(L)\geq c_be^{\beta_bL}                    \tag{5.12}
\]

for some `beta_b>b`.  Thus the excluded finite contribution, (5.11), and
(2.5) are all `o(A_(4,b)(L)/L^2)`.  Equation (5.10) now proves (0.3).

## 6. Scalar Landau peaks and strict-grid transfer

First omit the nonnegative filler and write `Psi_off` for the off-axis
sum.  Its Laplace transform converges initially for `Re(s)>B` and, by
(1.8), has the normally convergent meromorphic continuation

\[
 \int_0^\infty e^{-sL}\Psi_{\rm off}(L)\,dL
 =\sum_{\alpha\in Z_{+,\rm off}}
 {2\over s(s^2-\alpha^2)}.                         \tag{6.1}
\]

Fix `0<b<B` and choose an off-axis zero
`alpha_*=beta_*+i gamma_*` with `beta_*>b`.  If
`limsup e^(-bL)Psi_off(L)` were finite, then for suitable `C,T`,

\[
 H(L)=Ce^{bL}-\Psi_{\rm off}(L)\geq0\qquad(L\geq T). \tag{6.2}
\]

The pole at `alpha_*` forces the abscissa of convergence of the tail
Laplace transform of `H` to be at least `beta_*>b`.  At its real abscissa,
however, the continued right side is holomorphic: the comparator has its
only pole at `b`, the multiset has no real off-axis zero, and (6.1)
converges normally away from its displayed poles.  This contradicts the
Landau singularity theorem for a nonnegative Laplace transform.  Hence

\[
 \limsup_{L\to\infty}e^{-bL}\Psi_{\rm off}(L)=+\infty. \tag{6.3}
\]

The filler is nonnegative, so (6.3) implies (0.5) for the complete `Psi`.

It remains to put the peaks on the natural grid.  Equation (1.8) gives

\[
 |\Psi_{\rm off}'(L)|
 \leq C e^{BL}\sum_{\alpha\ {\rm off\ axis}}|\alpha|^{-1}
 \leq C'e^{BL}.                                    \tag{6.4}
\]

If `L_r=2*log(r/2)` with `r` restricted to the required odd strict grid,
the nearest grid point to a large real `L` satisfies

\[
 |L_r-L|\leq Ce^{-L/2}.                            \tag{6.5}
\]

Because `B=1/4<1/2`, (6.4)--(6.5) change `Psi_off` by `o(1)`.  Rounding a
sequence from (6.3) therefore preserves its divergent positive normalized
values.  Adding the nonnegative filler can only increase those values.
This proves the strict-grid assertion in (0.5).

## 7. Exact logical consequence

The synthetic multiset simultaneously has:

1. actual centered-zero conjugation/reflection symmetry and the exact
   `alpha^(-2)` coefficient phases;
2. a nonattained positive right edge below `1/2`;
3. simple off-axis zeros and even `sum |alpha|^(-1)<infinity` there;
4. the Riemann--von Mangoldt main count with `O(log H)` error and the local
   `O(log H)` count;
5. strengthened scalar Landau peaks on the strict natural grid; and
6. the global reverse diagonal inequality (0.3).

Thus the same-sequence gate

\[
 A_{4,b}(L)=o\{L^2\Psi(L)\}                        \tag{7.1}
\]

cannot be deduced from those inputs.  Any closure of the actual zeta case
must use information absent here, such as a genuinely zeta-specific
spacing/correlation theorem or an arithmetic signed-sum estimate.  The
counterconfiguration is a no-go theorem for the generic implication, not
a model of the actual zeta zeros and not evidence against RH.
