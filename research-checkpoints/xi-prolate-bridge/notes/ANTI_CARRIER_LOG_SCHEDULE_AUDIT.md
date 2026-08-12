# Anti-carrier logarithmic schedule audit

## 0. Scope and outcome

This note asks whether one can choose an unbounded logarithmic schedule on
which the actual critical-line ordinates avoid the Fourier carrier lattice
well enough to give a lower bound for the odd zero Gram.  The answer has two
parts.

* Exact averaging of `log|sin|`, combined with the pinned HSW zero count,
  gives an implicit, zero-table-free schedule on which a square Cauchy minor
  is quantitatively nonzero.  Algebraic multiplicity is retained and no
  simplicity assumption is made.
* The resulting determinant bound is far below the scale needed for the
  relative inequality `q_N<mu_(N,-)`.  The pinned count has carrier-cell
  uncertainty of order `log T`, while the expected count in one carrier cell
  is only order one on the polynomial diagonal.  Thus it supplies rank along
  a zero-dependent schedule, but not a useful lower frame.

Everything below is conditional on the target branch on which all
nontrivial zeros are on the critical line.  This is a branch analysis, not an
assumption in an unconditional argument.  No zero list is read, no global
Weil positivity is assumed, and no Riemann-hypothesis conclusion follows.
The formal project state remains `P0_INVALIDATED`.

## 1. Exact product anti-carrier averaging

The key observation is that products should be averaged before imposing
pointwise separation on each factor.

### Lemma 1.1 (finite carrier-product mean)

Let `gamma_1,...,gamma_K` be arbitrary positive real numbers and let
`I=[A,A+H]`, where `H>0`.  Then there is an `L` in `I` such that

\[
 \boxed{
 \prod_{j=1}^K\left|\sin {\gamma_jL\over2}\right|
 \geq 2^{-K}\exp\left\{-{\pi^2\over3H}
                   \sum_{j=1}^K{1\over\gamma_j}\right\}.}       \tag{1.1}
\]

In particular, none of these ordinates is a carrier at the selected `L`.

**Proof.**  On each open period,

\[
 \log(2|\sin u|)=-\sum_{m\geq1}{\cos(2mu)\over m}.
\]

After integration the series converges uniformly and gives a periodic
primitive

\[
 \Phi(u)=-\sum_{m\geq1}{\sin(2mu)\over2m^2},\qquad
 |\Phi(u)|\leq {\pi^2\over12}.                         \tag{1.2}
\]

Consequently, for arbitrary real `a<b`, with endpoint values understood by
improper integration,

\[
 \int_a^b\log|\sin u|\,du
 \geq -(b-a)\log2-{\pi^2\over6}.                      \tag{1.3}
\]

The change of variable `u=gamma_j*L/2` gives

\[
 {1\over H}\int_A^{A+H}
       \log\left|\sin {\gamma_jL\over2}\right|dL
 \geq-\log2-{\pi^2\over3H\gamma_j}.                  \tag{1.4}
\]

Sum (1.4) over the finite set of ordinates.  The logarithmic singularities
are integrable, so some point is at least the displayed mean.  Exponentiating
proves (1.1).  \(\square\)

The loss in (1.1) is exponential in `K`.  A union bound that separately
requires every sine to exceed `c/K` would instead lose `K^(-K)` and is
unnecessarily weak.

## 2. What the pinned multiplicity count does imply

Use exactly the HSW functions locked in
`ZERO_SAMPLING_SOURCE_LOCK.json`:

\[
\begin{aligned}
 T_0&=30610046000,\\
 M(T)&={T\over2\pi}\log{T\over2\pi e},\\
 R(T)&=0.103787\log T+0.257297\log\log T+9.367419,
\end{aligned}                                                   \tag{2.1}
\]

and

\[
 |N(T)-M(T)+1/8|\leq R(T),\qquad T\geq T_0.             \tag{2.2}
\]

Zeros in `N(T)` retain algebraic multiplicity.  For an integer `T>=T_0`,
put

\[
\begin{aligned}
 Z(T)&=M(2T)-M(T)-R(2T)-R(T),\\
 B(T)&={1\over2\pi}\log{2T\over2\pi}+2R(2T),\\
 K(T)&=\left\lfloor {Z(T)\over2B(T)}\right\rfloor .
\end{aligned}                                                   \tag{2.3}
\]

### Proposition 2.1 (coarsely separated distinct ordinates)

On the all-critical branch, the band `(T,2T]` contains at least `K(T)`
distinct positive ordinates

\[
 T<\gamma_1<\cdots<\gamma_{K(T)}\leq2T,
 \qquad \gamma_{j+1}-\gamma_j>1.                       \tag{2.4}
\]

Moreover,

\[
 {K(T)\over T}\longrightarrow
 {1/(2\pi)\over2\{1/(2\pi)+2(0.103787)\}}
 =0.21699\ldots> {1\over5}.                           \tag{2.5}
\]

**Proof.**  Equation (2.2), with the two `1/8` terms cancelling, gives

\[
 N(2T)-N(T)\geq Z(T).                                  \tag{2.6}
\]

Split `(T,2T]` into its `T` unit bins.  Monotonicity of `M'` and `R` gives
for every such bin `(a,a+1]`

\[
 N(a+1)-N(a)
 \leq M(a+1)-M(a)+R(a+1)+R(a)\leq B(T).               \tag{2.7}
\]

Thus at least `Z(T)/B(T)` bins are occupied, regardless of the
multiplicity within an occupied bin.  One of the two parity classes of bins
contains at least half of them.  Choosing one ordinate from each bin in that
class gives (2.4).  Direct expansion of the explicit functions in (2.3)
gives (2.5).  \(\square\)

This is more than mere infinitude of distinct zeros: the pinned count gives
an effective, linearly large, one-separated subset.  It does **not** give
separation on the much finer carrier scale `2*pi/L`.

Accordingly, any statement that the pinned count supplies no distinctness or
no separation at all is too strong.  What it fails to supply is
carrier-scale separation and a well-conditioned sampling array; the coarse
unit-scale conclusion (2.4) is valid.

For later use, define `T_K` to be the least integer `T>=T_0` for which
`K(T)>=K`.  Equations (2.3)--(2.5) show that `T_K` exists and `T_K=O(K)`.
This definition involves only the pinned source constants.

## 3. An implicit unbounded logarithmic schedule

Fix `H>0` and let `A` tend to infinity.  To dominate the polynomial
diagonal throughout the window `[A,A+H]`, set

\[
 K_A=\left\lceil e^{(A+H)/2}(A+H)^3\right\rceil .       \tag{3.1}
\]

Apply Proposition 2.1 at `T=T_(K_A)` and choose `K_A` ordinates satisfying
(2.4).  This choice can be made canonically without a zero table: choose the
first parity class having enough occupied bins, take the first `K_A` such
bins, and in each take the least ordinate of the zeta divisor.  Define

\[
 P_A(L)=\prod_{j=1}^{K_A}
          \left|\sin {\gamma_jL\over2}\right|          \tag{3.2}
\]

and let `L_A` be the least maximizer of `P_A` on `[A,A+H]`.  Lemma 1.1 gives

\[
 \boxed{
 P_A(L_A)\geq2^{-K_A}
 \exp\left\{-{\pi^2K_A\over3H T_{K_A}}\right\}>0.}    \tag{3.3}
\]

Put `lambda_A=exp(L_A/2)` and

\[
 n_A=\left\lceil\lambda_A L_A^3\right\rceil .          \tag{3.4}
\]

Then `n_A<=K_A`.  Since every omitted sine factor is at most one, the
product of the first `n_A` factors is bounded below by the right side of
(3.3).  Therefore `L_A` is an unbounded, source-specific anti-carrier
schedule for a full `n_A` by `n_A` minor.

This is an existence construction, not a replayable numerical schedule.
Its definition uses the actual zeta divisor to locate occupied bins and to
maximize (3.2), even though it imports no stored zero list.  The pinned count
alone does not reveal `L_A`.  Nor does this argument transfer the schedule
to a preassigned arithmetic grid of `lambda` values.

## 4. The resulting odd-Gram lower bound

For `L=L_A`, `n=n_A`, `T=T_(K_A)`, and the first `n` selected ordinates, put

\[
 x_j=\left({\gamma_jL\over2\pi}\right)^2.              \tag{4.1}
\]

The exact odd evaluation row is

\[
 a(\gamma_j)_m={2\sqrt{2/L}(2\pi m/L)
                   \sin(\gamma_jL/2)
                  \over\gamma_j^2-(2\pi m/L)^2},
 \qquad1\leq m\leq n.                                 \tag{4.2}
\]

The Cauchy determinant, with all carrier singularities interpreted by
continuity, is

\[
 |\det A|=
 \left({\sqrt{2L}\over\pi}\right)^n n!
 {\displaystyle
  \prod_j|\sin(\gamma_jL/2)|
  \prod_{j<k}(x_k-x_j)
  \prod_{r<s}(s^2-r^2)
  \over\displaystyle\prod_{j,m}|x_j-m^2|}.            \tag{4.3}
\]

Here the selected ordinates are ordered.  Equations (2.4) and (4.1) give

\[
 x_k-x_j\geq {TL^2\over2\pi^2}(k-j),                  \tag{4.4}
\]

while `gamma_j<=2T` gives

\[
 |x_j-m^2|\leq D:=(TL/\pi)^2+n^2.                     \tag{4.5}
\]

Let

\[
 p={n(n-1)\over2},\quad
 F_n=\prod_{m=1}^{n-1}m!,\quad
 V_n=\prod_{1\leq r<s\leq n}(s^2-r^2),               \tag{4.6}
\]

and denote the right side of (3.3) by `S_A`.  Then (4.3)--(4.5) give the
fully explicit positive minor bound

\[
 \boxed{
 |\det A|\geq
 \left({\sqrt{2L}\over\pi}\right)^n n!S_A
 \left({TL^2\over2\pi^2}\right)^p
 {F_nV_n\over D^{n^2}}.}                               \tag{4.7}
\]

Each row is a restricted Fourier-evaluation functional of squared norm at
most `L`, so `||A||_F^2<=nL`.  The full positive-height Gram contains the
selected rows with their algebraic multiplicities, all at least one, and is
therefore greater than or equal to `A^*A` in Loewner order.  On the
all-critical branch the complete odd compression is twice that Gram.  Hence

\[
 \boxed{
 \mu_{n,-}\geq {2|\det A|^2\over(nL)^{n-1}}>0.}        \tag{4.8}
\]

Equations (3.1), (2.5), and (4.7) imply only a determinant-scale estimate of
the form

\[
 \mu_{n,-}\geq
 \exp\{-O(K_A^2\log(K_A L_A))\}
 =\exp\{-O(e^{L_A}L_A^7)\}.                            \tag{4.9}
\]

The constants in the first `O` can be made effective directly from (4.7);
(4.7), not the schematic form (4.9), is the finite formula.

## 5. Why this does not close the relative gap

The subsequent Gevrey prolate theorem gives the stronger projected-state
sampling bound `q_N=O(exp(-c*lambda*L^2))` on this polynomial diagonal.
In logarithmic variables its exponent is of order `exp(L/2)*L^2`.  It still
does not become smaller than the determinant lower bound (4.9), whose
exponent is of order `exp(L)*L^7`.  Thus even the growing-order expansion
does not make this coarse minor a usable relative frame.

There is also a direct resolution mismatch.  A carrier cell has width

\[
 \delta_L={2\pi\over L}.                               \tag{5.1}
\]

At the relevant heights, `log T` is comparable to `L`, so

\[
 M(t+\delta_L)-M(t)=O(1).                              \tag{5.2}
\]

But applying (2.2) at the two endpoints loses
`R(t+delta_L)+R(t)`, which is of order `log T`, hence of order `L`.
The resulting lower bound for the number of zeros in a prescribed carrier
cell is negative.  The pinned theorem therefore cannot force even one
ordinate into each desired cell, let alone the near-Nyquist local density
needed for a well-conditioned frame.  Algebraic multiplicity can consume
the permitted local count and cannot be replaced by derivative rows.

The same mismatch is visible globally.  The highest odd carrier in an
`n`-dimensional compression is only `2*pi*n/L`.  The count argument above
guarantees merely a constant number of **distinct** ordinates per unit
height, so it guarantees only `O(n/L)` distinct rows below that carrier.
To obtain `n` guaranteed distinct rows, Section 3 must reach heights of
order `n`, a factor of order `L` beyond the carrier band.  Those far rows
are enough for algebraic rank, but their Cauchy denominators are exactly
what makes (4.7) so poorly conditioned.

The fixed-lattice multiset in
`notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md` shows that this constant-density
distinct-zero scenario is logically compatible with the same count: its
growing algebraic multiplicities carry the required `T*log T` total.

Thus logarithmic averaging yields a rigorous anti-carrier **rank** schedule
and a positive minor, but not the live-shift inequality

\[
 \boxed{q_N<\mu_{N,-}.}                                \tag{5.3}
\]

A successful next step needs either substantially finer source-specific
zero-spacing/sampling information, or a direct cancellation-preserving
comparison that bypasses a generic lower frame.  Numerical phase agreement
would remain diagnostic rather than a theorem.
