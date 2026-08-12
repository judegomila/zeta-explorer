# Reciprocal `chi_4` von Mangoldt dyadic cancellation theorem

## 0. Exact theorem and claim boundary

Write

\[
 \chi _4(n)=
 \begin{cases}
  0,&2\mid n,\\
  1,&n\equiv1\pmod4,\\
 -1,&n\equiv3\pmod4,
 \end{cases}
 \qquad {\rm e}(t)=\exp(2\pi i t),
\]

and, for an integer `N>=2`, `N<=X<=2N`, and `z>=0`, put

\[
 S(N,X;z)=\sum_{N<k\leq X}\Lambda(k)\chi _4(k)
       \exp(-iz/k)
 =\sum_{N<k\leq X}\Lambda(k)\chi _4(k)
       {\rm e}\!\left(-{z\over2\pi k}\right).       \tag{0.1}
\]

The result proved here is the following fixed-polynomial-range theorem.

> **Theorem.**  For every fixed real `A>=1`, there are constants
> `C_A>0` and `kappa_A>0`, depending only on `A`, such that
>
> \[
> \boxed{
> \sup_{0\leq z\leq N^A}\ \sup_{N\leq X\leq2N}
> |S(N,X;z)|
> \leq C_A N\exp\{-\kappa_A\sqrt{\log N}\}.}        \tag{0.2}
> \]

The order of the quantifiers in (0.2) is essential: `A` is fixed before
`N` tends to infinity.  Neither `A=A(N)` nor a phase range larger than every
fixed power of `N` is asserted.

The arithmetic consequence needed by the reciprocal residual calculation is
also exact.  Let `D(c)={2^j: 2<=2^j<=c}`.  Suppose nonnegative dyadic
variation factors satisfy

\[
 0\leq V_N\leq V<\infty\qquad(N\in D(c)),             \tag{0.3}
\]

with `V` independent of `c`, and define

\[
 {\cal E}_V(c)=
 \sum_{N\in D(c)}{V_N\over N}
 \sup_{|a|\leq1}\sup_{N\leq X\leq2N}
 \left|\sum_{N<k\leq X}\Lambda(k)\chi _4(k)
       \exp(-ica/k)\right|.                           \tag{0.4}
\]

Then

\[
 \boxed{{\cal E}_V(c)=o(\log c).}                    \tag{0.5}
\]

Equation (0.5) is a scalar arithmetic theorem for any already-established
uniformly bounded sequence `(V_N)`.  In the intended application, obtaining
(0.3) from a Weber/Airy or other Fourier-integral amplitude is a separate,
unproved analytic step.

This theorem controls only the reciprocal `chi_4` residual phase represented
by (0.1).  It does not estimate the equality branch, combine that branch with
the Archimedean symbol, prove an exact-to-model FIO reduction, prove uniform
amplitude variation, control a matrix compression or its off-diagonal
entries, insert `P_0`, or establish a signed growing-rest floor.  It proves no
residual-action estimate, no equation (5.2) of `DIRECT_RH_ATTACK.md`, and no
RH or Lambda conclusion.  The formal project state remains `P0_INVALIDATED`.

## 1. Frozen repository boundary and external analytic input

This isolated package preserves the two protected project bytes:

| Repository boundary | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |

The proof uses two standard analytic inputs.

1. For the fixed nonprincipal character `chi_4`, the fixed-modulus prime
   number theorem gives constants `b_0,C_0>0` such that

   \[
    \Psi _4(y):=\sum_{k\leq y}\Lambda(k)\chi _4(k),
    \qquad
    |\Psi _4(y)|\leq C_0y\exp\{-b_0\sqrt{\log y}\}.   \tag{1.1}
   \]

   The same primary Montgomery--Vaughan PDF records this
   Siegel--Walfisz consequence on its printed page 197, where it invokes
   Corollary 11.18 and states the corresponding uniform
   `x exp(-c sqrt(log x))` character-sum bound.  Here the modulus is the one
   fixed value `4`, so no growing-modulus uniformity is used.

2. Vaughan's identity and the high-derivative exponential-sum estimate are
   used in precisely the forms described in H. L. Montgomery and
   R. C. Vaughan, *Multiplicative Number Theory II: Primes and Sieves*,
   section 17.1 and Theorem 16.12, respectively.  The authors' primary PDF is
   <https://personal.science.psu.edu/rcv4/571s25/montgomery-vaughanII.pdf>.
   In that PDF, section 17.1 gives (17.5)--(17.15), including the Type I/II
   split and the Cauchy correlation reduction; Theorem 16.12 gives, for
   `R=2^r`,

   \[
    \sum_{a<n\leq b}{\rm e}(f(n))
    \ll_{r,C}Y\left(
       M_r^{1/(R-2)}+Y^{-2/R}+(Y^rM_r)^{-2/R}
    \right)                                           \tag{1.2}
   \]

   on an interval of length at most `Y` when
   `0<M_r<=|f^(r)|<=C M_r` there, after changing `f` to `-f` if necessary.

The primary PDF is not vendored in this repository and has no repository
source-lock SHA-256.  No hash is invented for it here.  Thus (0.2) is an
isolated proved analytic theorem with an explicit bibliographic dependency,
not a new formally admitted source-lock component.  Its regression freezes
the local boundary above and checks the exact reductions below; it does not
turn an unvendored external PDF into an admitted dependency.

## 2. The growing low/high phase split

Fix `A>=1` once and for all.  Choose

\[
 0<\eta<{b_0\over8},
 \qquad H_N=\exp\{\eta\sqrt{\log N}\},
 \qquad F={z\over N}.                                 \tag{2.1}
\]

The use of the growing threshold `H_N` is mandatory.  A fixed threshold
would not absorb the factor `1+F` in Abel summation and would leave a gap
between the fixed-modulus PNT range and the derivative range.

If `F<=H_N`, Abel summation and (1.1) give, uniformly in `X`,

\[
\begin{aligned}
 |S(N,X;z)|
 &\leq \sup_{N\leq y\leq2N}|\Psi _4(y)-\Psi _4(N)|
       \left(1+\int_N^{2N}{z\over t^2}\,dt\right)\\
 &\ll N\exp\{-b_0\sqrt{\log N}\}(1+F)\\
 &\ll N\exp\{-\tfrac12b_0\sqrt{\log N}\}.          \tag{2.2}
\end{aligned}
\]

Changing the harmless constants covers all bounded `N`.  It remains to
treat

\[
 H_N<F\leq N^{A-1}.                                   \tag{2.3}
\]

## 3. Fixed parameters for the Vaughan range

Choose a fixed `delta` with `0<delta<1/16`.  Then choose an integer `r>=3`
so large that

\[
 r\delta>A+2,
 \qquad r(1-2\delta)>A+2,                             \tag{3.1}
\]

and put `R=2^r`.  These choices depend on `A` but never on `N`, `z`, or `X`.
Set

\[
 U=V=\lfloor N^\delta\rfloor.                         \tag{3.2}
\]

Apply Vaughan's identity (17.5)--(17.9) with the sharp weight

\[
 f(k)=1_{(N,X]}(k)\chi _4(k)
        {\rm e}\!\left(-{z\over2\pi k}\right).       \tag{3.3}
\]

For sufficiently large `N`, the `c_1` term is zero because it is supported
on `k<=U<N`.  The `c_2` term has Type I outer variable `m<=UV`; the `c_3`
term has Type I outer variable `m<=V`, with one logarithmic partial
summation.  The `c_4` term is Type II with both factors larger than `U,V`.
The standard divisor estimates in section 17.1 cost only a fixed power of
`log N`.  Such powers are absorbed by every
`exp(kappa sqrt(log N))` with fixed positive `kappa`.

The sharp condition `N<m\ell<=X` causes no endpoint loss.  Once either
factor and its dyadic interval are fixed, the allowed values of the other
factor form an interval.  Estimate (1.2) is uniform for every subinterval,
so all estimates below are uniform in `X`.

Finally, `chi_4` is completely multiplicative, including its zero values:

\[
 \chi _4(m\ell)=\chi _4(m)\chi _4(\ell).              \tag{3.4}
\]

Thus character factors in a bilinear sum are absorbed into its two
coefficient sequences.  All even terms, including every power of `2`,
vanish exactly; there is no hidden even-prime main term.

## 4. Type I estimate

Fix an outer variable `m<=UV` and a dyadic inner interval `ell asymp L`
meeting `N<m ell<=X`.  Then

\[
 L\gg {N\over m},\qquad L\gg N^{1-2\delta}.           \tag{4.1}
\]

The elementary Fourier identity

\[
 \chi _4(\ell)=
 { {\rm e}(\ell/4)-{\rm e}(-\ell/4)\over2i}           \tag{4.2}
\]

reduces the inner sum to the two phases

\[
 f_{m,\pm}(t)=\pm {t\over4}-{z\over2\pi mt}.          \tag{4.3}
\]

For every `r>=2`,

\[
 |f_{m,\pm}^{(r)}(t)|={r!z\over2\pi m t^{r+1}},
 \qquad
 M_r\asymp_r {z\over mL^{r+1}}.                       \tag{4.4}
\]

The ratio of the maximum and minimum in (4.4) is bounded in terms of `r`
on a dyadic interval.  Moreover, because `mL asymp N`,

\[
 L^rM_r\asymp_r F,
 \qquad
 M_r\ll_r {N^{A-1}\over L^r}
 \ll N^{-\gamma_1}                                   \tag{4.5}
\]

for a fixed `gamma_1=gamma_1(A,delta,r)>0`, by (3.1).  Theorem 16.12
therefore yields

\[
 \sup_{I\subset[L,2L]}
 \left|\sum_{\ell\in I}\chi _4(\ell)
       {\rm e}\!\left(-{z\over2\pi m\ell}\right)\right|
 \ll_A L\left(N^{-\gamma_2}+F^{-2/R}\right)          \tag{4.6}
\]

with some `gamma_2>0`.  In the range (2.3),

\[
 F^{-2/R}\leq H_N^{-2/R}
 =\exp\left\{-{2\eta\over R}\sqrt{\log N}\right\}. \tag{4.7}
\]

Dyadically summing the outer coefficients of `c_2`, and using logarithmic
partial summation for `c_3`, now gives

\[
 |S_2|+|S_3|
 \ll_A N(\log N)^{C}
 \left(N^{-\gamma_2}+H_N^{-2/R}\right)                \tag{4.8}
\]

for an absolute finite exponent `C` whose value is immaterial.

## 5. Type II correlation estimate

It remains to treat dyadic Type II boxes

\[
 m\asymp M,\qquad \ell\asymp L,\qquad ML\asymp N,
 \qquad M,L\gg N^\delta.                              \tag{5.1}
\]

After absorbing (3.4) into divisor-bounded coefficient sequences, a box has
the form

\[
 B(M,L)=\sum_{m\asymp M}a_m
 \sum_{\substack{\ell\asymp L\\N<m\ell\leq X}}
 b_\ell {\rm e}\!\left(-{z\over2\pi m\ell}\right), \tag{5.2}
\]

where

\[
 \sum_{m\asymp M}|a_m|^2\ll M(\log N)^C,
 \qquad
 \sum_{\ell\asymp L}|b_\ell|^2\ll L(\log N)^C.      \tag{5.3}
\]

Cauchy--Schwarz in `m` and expansion of the square give correlations in
`m` indexed by `ell_1,ell_2`.  Their common product cutoffs again form an
interval.  The diagonal `ell_1=ell_2` contributes

\[
 { |B(M,L)|\over N(\log N)^C}\ll L^{-1/2}.            \tag{5.4}
\]

For `h=|ell_1-ell_2|>0`, the correlation phase is

\[
 g(t)=-{z\over2\pi t}
       \left({1\over\ell_1}-{1\over\ell_2}\right),
 \qquad
 G\asymp {Fh\over L}.                                 \tag{5.5}
\]

On `t asymp M`,

\[
 |g^{(r)}(t)|\asymp_r {G\over M^r}.                   \tag{5.6}
\]

There are at most `O(L/F)` differences with `G<=1` for each `ell_1`.
Treating their correlations trivially and then taking the square root in
Cauchy's inequality costs at most

\[
 O(F^{-1/2})\leq O(H_N^{-1/2}).                       \tag{5.7}
\]

Likewise, the range `1<G<=H_N^(1/2)` has at most
`O(L H_N^(1/2)/F)` differences for each `ell_1`.  Its trivial cost is

\[
 O\left((H_N^{1/2}/F)^{1/2}\right)
 \leq O(H_N^{-1/4}).                                  \tag{5.8}
\]

For `G>H_N^(1/2)`, (1.2), (5.6), `G<=F<=N^(A-1)`, and
`M>=N^delta` give the normalized correlation bound

\[
 {1\over M}\left|\sum_{m\in I}{\rm e}(g(m))\right|
 \ll_A N^{-\gamma_3}+G^{-2/R}                         \tag{5.9}
\]

for some fixed `gamma_3>0`.  Indeed, the increasing derivative term is

\[
 (G/M^r)^{1/(R-2)}
 \ll N^{-(r\delta-A+1)/(R-2)},                        \tag{5.10}
\]

the middle term is `M^(-2/R)`, and the decreasing derivative term is
`G^(-2/R)`.  Condition (3.1) makes the first two powers saving.  Summing all
correlations and taking the square root costs

\[
 O_A\left(N^{-\gamma_4}+H_N^{-1/(2R)}\right)           \tag{5.11}
\]

for another fixed `gamma_4>0`.  Equations (5.4), (5.7), (5.8), and (5.11)
prove

\[
 |B(M,L)|\ll_A N(\log N)^C
 \left(
 L^{-1/2}+H_N^{-1/4}+N^{-\gamma_4}+H_N^{-1/(2R)}
 \right).                                             \tag{5.12}
\]

There are only `O((log N)^2)` dyadic Type II boxes.  Since
`L>=N^delta`, their total is

\[
 |S_4|\ll_A N\exp\{-\kappa'_A\sqrt{\log N}\}         \tag{5.13}
\]

for some `kappa'_A>0`.

Combining (2.2), (4.8), and (5.13), and decreasing the positive exponent to
absorb all fixed powers of `log N`, proves (0.2).

## 6. The epsilon split and the order of limits

We now prove (0.5).  The phase for `a<0` is the complex conjugate of the
phase for `|a|`, because `Lambda(k)chi_4(k)` is real.  It is therefore enough
to put

\[
 z=c|a|,\qquad 0\leq z\leq c.                         \tag{6.1}
\]

Fix `epsilon>0`; it is held fixed while `c` tends to infinity.  On the small
dyads `N<c^epsilon`, the elementary Chebyshev bound

\[
 \sum_{N<k\leq2N}\Lambda(k)\ll N                      \tag{6.2}
\]

and (0.3) give

\[
 \sum_{\substack{N\in D(c)\\N<c^\epsilon}}{V_N\over N}
 \sup_{a,X}|S(N,X;c|a|)|\ll_V\epsilon\log c+O_V(1).  \tag{6.3}
\]

For every large dyad `N>=c^epsilon`,

\[
 z\leq c\leq N^{1/\epsilon}.                          \tag{6.4}
\]

Apply (0.2) with the one fixed value
`A=max(1,1/epsilon)`.  The large dyads contribute

\[
 \ll_{V,\epsilon}
 \sum_{\substack{N\in D(c)\\N\geq c^\epsilon}}
 \exp\{-\kappa_{1/\epsilon}\sqrt{\log N}\}
 =o_\epsilon(\log c).                                 \tag{6.5}
\]

Consequently

\[
 \limsup_{c\to\infty}{{\cal E}_V(c)\over\log c}
 \ll_V\epsilon.                                      \tag{6.6}
\]

First take `c` to infinity with `epsilon` fixed, then let `epsilon` decrease
to zero.  This proves (0.5).  Allowing `epsilon=epsilon(c)` before applying
(0.2) would make `A=1/epsilon(c)` grow and is not licensed by the theorem.

## 7. Exact amplitude interface and fail-closed handoff

For a scalar amplitude `w_k` on a dyadic block, discrete Abel summation gives

\[
 \left|\sum_{N<k\leq2N}\Lambda(k)\chi _4(k)
       \exp(-ica/k)w_k\right|
 \leq V_N
 \sup_{N\leq X\leq2N}|S(N,X;c|a|)|,                 \tag{7.1}
\]

where one may take

\[
 V_N=|w_{\lfloor2N\rfloor}|+
      \sum_{N<k<2N}|w_{k+1}-w_k|.                    \tag{7.2}
\]

Thus (0.5) applies once (7.2) is bounded uniformly.  This note does not
assert that the actual Weber/Airy, prolate, endpoint-sheared, or projected
amplitudes satisfy that bound.  Nor may (7.1) be used for an equality
stationary branch that was not reduced to the reciprocal phase (0.1).

The next admissible analytic handoff must therefore prove, separately and
with actual normalization:

1. the exact FIO reduction to (7.1), including uniform remainders;
2. the dyadic bounded-variation estimate (0.3)/(7.2);
3. the combined Archimedean-plus-equality signed symbol before discarding
   any equality contribution;
4. the full source metric and `P_0` compression estimate.

Until all four are supplied, (0.2) and (0.5) are scalar cancellation inputs,
not a growing-rest floor or a direct-RH bridge.
