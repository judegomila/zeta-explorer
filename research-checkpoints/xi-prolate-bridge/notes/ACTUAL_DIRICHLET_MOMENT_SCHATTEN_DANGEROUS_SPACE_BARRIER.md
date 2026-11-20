# Actual Dirichlet-moment Schatten dangerous-space barrier

## 0. Exact outcome and claim boundary

Let a finite consecutive Fourier set `I` carry a source-Cauchy matrix

\[
 Q_I=D_a+D_bH_I-H_ID_b,\qquad
 (H_I)_{nm}=\begin{cases}(n-m)^{-1},&n\ne m,\\0,&n=m.
 \end{cases}                                             \tag{0.1}
\]

This note proves an exact conversion from scalar moments of the sampled
source coefficient `b_n` to a finite-dimensional operator exceptional
space.  For every `p>=1`, every real centering constant `c`, and every
`tau>0`,

\[
 \boxed{
 \operatorname {rank}{\bf1}_{(\tau,\infty)}(|K_I|)
 \leq\left({2\pi\over\tau}\right)^p
       \sum_{n\in I}|b_n-c|^p,\qquad
 K_I=D_bH_I-H_ID_b.}                                  \tag{0.2}
\]

If

\[
 E_{q,\tau,G}=\{n\in I:a_n<q+\tau+G\},               \tag{0.3}
\]

and `U_(q,tau,G)` is the sum of the coordinate space on (0.3) and the
large-singular-value range in (0.2), then

\[
 \boxed{
 \langle v,(Q_I-qI)v\rangle\geq G\|v\|^2
 \quad(v\perp U_{q,\tau,G}).}                         \tag{0.4}
\]

Thus scalar moment estimates really do give an operator statement; no
entrywise domination or false Weil-form Cauchy--Schwarz inequality is
needed.  The theorem is, however, only a dangerous-space **dimension**
bound.  It neither prevents a bottom vector from lying in that space nor
gives its angle with a prolate source range.

The natural Dirichlet moment route cannot currently make the right side
`O(lambda^2)`.  Put

\[
 x=\lambda^2,\qquad L=\log x.                          \tag{0.5}
\]

On a shell of `K asymp x^s` Fourier samples, a Gaussian-scale `2r`-th
moment estimate has the schematic strength

\[
 \sum_I|b_n-c|^{2r}
 \leq K(Cr)^rL^{2r}.                                  \tag{0.6}
\]

At the diagonal scale `tau=sL`, (0.2) then gives

\[
 \boxed{
 \operatorname {rank}{\bf1}_{(sL,\infty)}(|K_I|)
 \leq K\left({4\pi^2Cr\over s^2}\right)^r.}         \tag{0.7}
\]

Coefficient diagonalization on a block of length `x^s` only reaches
orders `r<=floor(s)`: the `r`-fold Dirichlet polynomial has length `x^r`.
Even granting (0.6) uniformly at every admitted order, the optimized
Markov--Schatten exponent is only `O(s log s)`, whereas reducing `x^s`
directions to `O(x)` requires an exponent `(s-1)L`.  In the relevant
range `s<=x^(1/2-o(1))`, these scales do not meet.

This is a method obstruction, not a lower bound for the actual number of
dangerous modes.  A random-phase tail is discussed separately and labeled
as a heuristic in Section 7; it is not used in any theorem or regression.

No cutoff-free floor, actual exceptional-set bound, ground capture,
source-angle estimate, parity ordering, zero theorem, Riemann-hypothesis
conclusion, converse, or de Bruijn--Newman bound is proved.  The standard eight are unchanged
and the formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and novelty boundary

No new external source is added.  The exact repository inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |
| `notes/ACTUAL_CENTERED_REMAINDER_LONG_BLOCK_HERMITE_MOMENT_BARRIER.md` | `1997f8b14c5f90977f744788d069f6e771da078c06562dac2d78c671c01a95c1` |
| `tests/test_actual_centered_remainder_long_block_hermite_moment_barrier.py` | `cbbc300b9a050ac161d9f8feae996947b522043ae50663799dfc194ed4d3dd2d` |
| `notes/ACTUAL_PHASE_VOLUME_LONG_BLOCK_THRESHOLD_NEGATIVE_INDEX_BARRIER.md` | `964b58396b1913013b017be6393cef768891d253e553a22979c3189a5c603f56` |
| `tests/test_actual_phase_volume_long_block_threshold_negative_index_barrier.py` | `149a7034c83a952b4069574cf5892583540f66b5fcea385afb2a90ecd66a979c` |
| `notes/CUTOFF_FREE_CYCLICITY_EFFECTIVE_DIMENSION_CAPTURE_BARRIER.md` | `e27463c41c6a45fcb6a3a332b8e5ab173178f35a4abb9fd5eff07dfbbc27eccd` |
| `tests/test_cutoff_free_cyclicity_effective_dimension_capture_barrier.py` | `1bc88d49195b54c185be767a217d952145839962bf894e06dfe38ce9bfbed515` |

The high-Fourier pair supplies (0.1), the exact constant `||H_I||<=pi`,
and the source prime conventions.  The long-block pair supplies the
`r`-fold coefficient length `x^r`, the weighted Montgomery--Vaughan error,
and Gaussian moments only through the block-length ceiling.  The actual
phase-volume pair records the same `K<=floor(s)` ceiling for a real
exponent block and the fact that a dimension/phase-volume bound has the
wrong logical direction for ground capture.  The cutoff-free cyclicity pair
supplies the normalized source-angle kernel and its structural
nonimplication.

The earlier retained-negative-index barrier observes that a
Hilbert--Schmidt count can be large on a structural countermodel.  It does
not contain (0.2)--(0.4), their all-`p` centered Schatten proof, or the
explicit `r<s` optimization (0.7).  The result here is therefore a narrow
new conversion theorem, not a new arithmetic moment estimate.

## 2. Centered Schatten bound for the source commutator

The finite consecutive compression of the discrete Hilbert transform
satisfies

\[
 \|H_I\|\leq\pi.                                      \tag{2.1}
\]

For a real sequence `b`, put

\[
 K_I=D_bH_I-H_ID_b.                                   \tag{2.2}
\]

Since `H_I^*=-H_I`, the matrix `K_I` is self-adjoint.  Constants disappear:

\[
 D_bH_I-H_ID_b
 =D_{b-c}H_I-H_ID_{b-c}.                              \tag{2.3}
\]

Let `||.||_(S_p)` be the Schatten norm.  For every `p>=1`, the ideal
property, (2.1), and the triangle inequality give

\[
\begin{aligned}
 \|K_I\|_{S_p}
 &\leq\|D_{b-c}H_I\|_{S_p}
       +\|H_ID_{b-c}\|_{S_p}\\
 &\leq2\pi\|D_{b-c}\|_{S_p}
 =2\pi\left(\sum_{n\in I}|b_n-c|^p\right)^{1/p}.
\end{aligned}                                                 \tag{2.4}
\]

If `s_j(K_I)` are the singular values, then

\[
 \tau^p\#\{j:s_j(K_I)>\tau\}
 \leq\sum_js_j(K_I)^p=\|K_I\|_{S_p}^p.             \tag{2.5}
\]

Equations (2.4)--(2.5) prove (0.2), with its exact constant `(2*pi)^p`.
The centering in (2.3) is important: a large constant component of `b`
has no operator content.

## 3. Exact exceptional-space floor

Let

\[
 S_\tau={\bf1}_{(\tau,\infty)}(|K_I|),\qquad
 X_E=\operatorname {span}\{e_n:n\in E_{q,\tau,G}\}, \tag{3.1}
\]

and set

\[
 U_{q,\tau,G}=X_E+\operatorname {Ran}S_\tau.         \tag{3.2}
\]

If `v` is perpendicular to (3.2), then it has no coordinate on `E`, so

\[
 \langle v,(D_a-qI)v\rangle
 \geq(\tau+G)\|v\|^2.                                \tag{3.3}
\]

It also belongs to the spectral subspace of the self-adjoint `K_I` where
`|K_I|<=tau`, hence

\[
 \langle v,K_Iv\rangle\geq-\tau\|v\|^2.             \tag{3.4}
\]

Adding (3.3)--(3.4) proves (0.4).  Moreover,

\[
 \boxed{
 \dim U_{q,\tau,G}
 \leq |E_{q,\tau,G}|+
 \left({2\pi\over\tau}\right)^p
       \sum_{n\in I}|b_n-c|^p.}                     \tag{3.5}
\]

By the min--max principle,

\[
 n_-\bigl(Q_I-(q+G)I\bigr)\leq\dim U_{q,\tau,G}.    \tag{3.6}
\]

Equation (3.6) is an inertia upper bound.  It is not an assertion that the
negative spectral projector is contained in `U`, and it gives no lower
bound for the projection of an individual bottom vector onto `U`.

The diagonal exceptional set can itself be estimated from scalar moments.
Fix `J subset I`, let `d_n` be any deterministic baseline, and choose
`h_n>0` on `J` subject to the baseline-margin condition

\[
 d_n\geq q+\tau+G+h_n\qquad(n\in J).                \tag{3.7a}
\]

Put `z_n=(d_n-a_n)_+`.  If `n in J` and `a_n<q+tau+G`, then (3.7a) gives
`z_n>h_n`.  Consequently,

\[
 \#\{n\in J:a_n<q+\tau+G\}
 \leq\sum_{n\in J}{z_n^p\over h_n^p}                \tag{3.7}
\]

for every `p>0`.  Both positivity of `h_n` and the baseline-margin
condition (3.7a) are hypotheses; positivity alone does not suffice.  The
old broader reading has the exact singleton counterfixture `J={0}`,
`q=0`, `tau=1`, `G=0`, `h_0=1`, `d_0=0`, and `a_0=0`.  Its exceptional
count is one, while `z_0=0` makes the right side of (3.7) zero; (3.7a)
would instead demand `0>=2`.  Under (3.7a), both pieces of (3.5) have a
legitimate scalar-moment interface.

## 4. Actual prime Dirichlet interface

For the source prime inventory put

\[
 D_x(t)=\sum_{1<k\leq x}{\Lambda(k)\over\sqrt k}k^{it},
 \qquad
 R_x(t)=\sum_{1<k\leq x}{\Lambda(k)\over\sqrt k}
       \left(1-\frac{\log k}{L}\right)k^{it}.        \tag{4.1}
\]

At the physical Fourier lattice `t_n=2*pi*n/L`, the prime part of the
source coefficient is

\[
 b_n^{(p)}={1\over\pi}\operatorname {Im}D_x(t_n),    \tag{4.2}
\]

and the prime diagonal is

\[
 (W_p)_{nn}=2\operatorname {Re}R_x(t_n).             \tag{4.3}
\]

The endpoint is inclusive.  The complete Weil matrix uses
`Q=W_(0,2)-W_R-W_p`, so (4.3) enters its diagonal with a minus sign.
Equations (3.5), (4.2), and (4.3) therefore identify two separate actual
arithmetic obligations:

1. centered lattice moments of `Im D_x(t_n)` for the commutator range;
2. one-sided lattice moments of `Re R_x(t_n)` for the coordinate set (0.3),
   after the pole and archimedean diagonal are retained.

The continuous block moments frozen in the dependencies do not by
themselves prove either lattice estimate.  Passing from a continuous mean
to the source lattice requires a sampling theorem with the same order and
uniform constants; this note does not assume one silently.

## 5. The moment-length ceiling and optimized failure

Assume, only for this conditional calculation, that a shell `I_(x,s)` has

\[
 K=|I_{x,s}|\asymp x^s                                \tag{5.1}
\]

and that for an integer `1<=r<=floor(s)` the centered lattice moment obeys

\[
 \sum_{n\in I_{x,s}}|b_n-c|^{2r}
 \leq K(Cr)^rL^{2r},                                 \tag{5.2}
\]

where `C` is independent of `x,s,r`.  Substituting `p=2r` and `tau=sL`
in (0.2) gives exactly

\[
 \operatorname {rank}{\bf1}_{(sL,\infty)}(|K_I|)
 \leq K\left({4\pi^2Cr\over s^2}\right)^r.         \tag{5.3}
\]

This proves (0.7).  It is deliberately conditional: no growing-order
uniformity in (5.2) is frozen.

Why is `r<=floor(s)` the natural ceiling?  The `r`-fold power of a length
`x` Dirichlet polynomial has coefficient support through `x^r`.  The
weighted Montgomery--Vaughan error recorded in the frozen long-block note
is `O_r((xL)^r)`.  Division by a block length `x^s` gives a power saving
for `r<s`; at `r=s` the frozen fixed-order proof still has a logarithmic
saving against its `L^(2r)` main term, but supplies no growing-order
uniformity.  On the integer lattice,
coefficient products have the same resolution requirement, with possible
endpoint aliases needing additional care rather than improving the ceiling.

Even grant the optimistic uniform form (5.2).  Write

\[
 C_0=4\pi^2C.                                         \tag{5.4}
\]

First consider the decreasing-optimization regime `s>C_0e`.  For real
`s` in this regime the function

\[
 r\longmapsto r\log(C_0r/s^2)                        \tag{5.5}
\]

is decreasing on `1<=r<=floor(s)`, because its derivative is at most
`log(C_0/s)+1<0`.  Put `R=floor(s)`.  The largest logarithmic saving
furnished by (5.3) is

\[
 A(s)=R\log\left({s^2\over C_0R}\right).             \tag{5.6}
\]

Writing `delta=s-R`, the elementary comparison

\[
 A(s)-s\log(s/C_0)
 =R\log(1+\delta/R)-\delta\log(s/C_0)\leq0           \tag{5.7}
\]

uses `log(1+delta/R)<=delta/R` and `log(s/C_0)>1`.
Consequently, to certify an `O(x)` dangerous space from (5.3) would
require

\[
 (s-1)L\leq A(s)+O(1)
 \leq s\log(s/C_0)+O(1).                             \tag{5.8}
\]

The remaining bounded regime `2<=s<=C_0e`, when nonempty, must be handled
separately: `R` and every admitted moment order are `O_(C_0)(1)`.  Hence
the largest possible saving
`max_(1<=r<=R) r log(s^2/(C_0r))` is `O_(C_0)(1)`, whereas an `O(x)`
bound requires the saving `(s-1)L+O(1)`, with the exact main-term bound
`(s-1)L>=L`.  Thus this bounded regime also fails for all sufficiently
large `x`; no decreasing optimization is being asserted there.

Now fix `0<epsilon<1/2`.  Uniformly in the decreasing-optimization range

\[
 C_0e<s\leq x^{1/2-\epsilon},                        \tag{5.9}
\]

the last member of (5.8) is at most
`(1/2-epsilon+O_(C_0)(1/L))sL`.  Its first member satisfies the exact
uniform lower bound

\[
 (s-1)L=(1-1/s)sL\geq(1/2)sL\qquad(s\geq2).          \tag{5.10}
\]

For sufficiently large `x`, the upper coefficient is strictly below
`1/2`, so (5.8) fails uniformly.  At fixed `s=2`, the exact normalized
left side is `1/2`, not an asymptotic quantity tending to one.  Combining
this comparison with the preceding bounded-regime argument proves the
method failure throughout `2<=s<=x^(1/2-epsilon)`.  The crude all-prime
envelope leaves a middle range whose upper logarithmic shell parameter is
`s=x^(1/2-o(1))`; (5.9) is the growing part of the range where an
average-to-floor argument was supposed to improve the high cutoff.

The Gaussian Markov optimum at normalized level `s` would instead use
moment order `r asymp s^2`.  That contradicts `r<=s` as soon as `s>1`.
This is the exact moment-length mismatch.

## 6. Sharp missing arithmetic statements

Fix the same shell threshold in both operator exceptional sets:

\[
 \tau_{x,s}=c\log|I_{x,s}|,\qquad c>0.                \tag{6.0}
\]

Let `d_n=(W_(0,2)-W_R)_(nn)` be the complete prime-deleted diagonal.
By (4.3), `a_n=d_n-2 Re R_x(t_n)`.  Hence the coordinate exception in
(0.3), with exactly the `tau_(x,s)` from (6.0), is the identity

\[
 E_{q,\tau_{x,s},G}\cap I_{x,s}
 =\left\{n\in I_{x,s}:
 \operatorname {Re}R_x(t_n)>
 {d_n-q-\tau_{x,s}-G\over2}\right\}.                \tag{6.1a}
\]

A coordinate-exception route to an `O(x)` effective space would therefore
need a uniform lattice sparsity theorem of the exact form

\[
 \boxed{
 \sum_{s\ \mathrm{shells}}
 \#\left\{n\in I_{x,s}:
   \operatorname {Re}R_x(t_n)>
   {d_n-q-\tau_{x,s}-G\over2}
 \right\}=O(x),}                                      \tag{6.1}
\]

A certified lower baseline `underline d_n<=d_n` may replace
`d_n` in (6.1), because it enlarges the counted set; the full
`q+tau_(x,s)+G` subtraction may not be dropped.

The former `log|n|/2-C_1L` surrogate can count only a subset of the actual
exceptions.  Here is an exact rejected-reading fixture, normalized by
`L`: take `s=10`, `log|I|/L=log|n|/L=d_n/L=10`, `c=1/2`, `q=G=0`, and
`Re R_x(t_n)/L=3`.  Then `tau_(x,s)/L=5`, the full diagonal is
`a_n/L=10-2*3=4<5`, and (6.1a) counts the mode because `3>(10-5)/2`.
The surrogate does not count it when `C_1=1`, since `3` is not greater
than `10/2-1=4`.  In general the omitted `tau_(x,s)/2` grows like `sL`
and cannot be absorbed into a fixed multiple of `L`.

The off-diagonal theorem additionally needs either

\[
 \boxed{
 \sum_{s\ \mathrm{shells}}
 \operatorname {rank}{\bf1}_{(\tau_{x,s},\infty)}
 \left(\left|P_{I_{x,s}}[D_b,H]P_{I_{x,s}}\right|\right)
 =O(x),}                                               \tag{6.2}
\]

Thus (6.1) and (6.2) use the same `tau_(x,s)`, not thresholds that differ
by a growing shell term.  Ordinary fixed moments and the admitted `r<s`
hierarchy do not imply (6.1) or (6.2).

Even (6.1)--(6.2) would stop one theorem short of the cutoff-free bridge.
They would produce a physical dangerous space of dimension `O(x)`, but
the normalized full-source map can orient that space inside the orthogonal
complement of an `O(x)` leading prolate prefix.  The exact additional input
is a source-angle statement, for example

\[
 \boxed{
 \inf_{0\ne z\in Z_x}
 {\|P_{F_x}J_xz\|^2\over\|z\|^2}
 \geq e^{-o(x)}}                                      \tag{6.3}
\]

for the actual dangerous spectral space `Z_x`, or the weaker one-direction
version evaluated on the actual bottom.  Neither dimension nor (0.4)
implies (6.3).

## 7. Heuristic only: why an `O(x)` exceptional count may be unnatural

This section is not a theorem and is used nowhere above.  If the normalized
prime Dirichlet values on a fixed shell behaved like a nondegenerate
Gaussian, then a threshold of `s` standard deviations would have a positive
tail probability depending on fixed `s`, but not on `x`.  A shell containing
`x^s` samples would then contain order `x^s` tail samples, not `O(x)`.

This heuristic does not establish independence, a central limit theorem on
the source lattice, a lower tail, or even the existence of one actual
exceptional mode.  Its only role is to explain why (6.1) is a genuinely new
arithmetic sparsity assertion rather than a routine consequence of a
mean-square estimate.

## 8. Reproduction and fail-closed use

Run

    python3 -B -m unittest \
      tests.test_actual_dirichlet_moment_schatten_dangerous_space_barrier -v

The regression checks the frozen hashes, the centered commutator identity,
the exact Hilbert--Schmidt instance of (2.4), spectral truncation, the
exceptional-space floor, the baseline-margin hypothesis and its exact
singleton counterfixture, and the `r<s` optimization.  It reads no zero
table, numerical orbit, cached eigensystem, network resource, API key, or
environment secret.

Any downstream use must reject a claimed pass if it:

1. treats the conditional lattice estimate (5.2) as proved;
2. turns (3.6) into containment or quantitative ground overlap;
3. applies (3.7) without the baseline-margin condition (3.7a) on `J`;
4. replaces the complete diagonal exceptional set by the prime term alone;
5. promotes fixed continuous moments to growing lattice moments;
6. turns the heuristic in Section 7 into an arithmetic theorem; or
7. infers (6.3), a zero theorem, RH, a converse, or a de Bruijn--Newman
   bound from dangerous-space dimension.
