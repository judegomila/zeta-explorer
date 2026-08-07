# Complete weighted translation theorem for the physical outer state

Status: analytic component theorem for the actual corrected,
source-normalized and inversion-reflected `0/4` state.  This note proves
Required Lemma S from `OUTER_OUTER_SPECTRAL_SAMPLING_AUDIT.md`, with a fully
displayed constant of polynomial degree seven in `lambda`.

This theorem is only a physical-tail regularity estimate.  By itself it does
not identify or bound the outer--outer Weil pairing: that use also needs the
separately source-locked zero-free region, zero-count theorem, low-height
passage, and explicit spectral/explicit-form domain argument.  No zero is
assumed real, no zero list is used, and no positivity of the Weil form is
used.

## 1. Exact state and the theorem

Use the additive Fourier convention

\[
 \widehat f(\xi)=\int_{\mathbb R}f(x)e^{2\pi i x\xi}\,dx.
                                                               \tag{1.1}
\]

For `n=0,4`, let `h_(n,lambda)` be the real even unit-Lebesgue-norm
source prolate mode, zero extended outside `[-lambda,lambda]`, and put

\[
 H_n=\widehat h_{n,\lambda},\qquad
 e_n=h_{n,\lambda}(\lambda),\qquad
 d_n=1-\chi_n^2,
\]

\[
 k=2\pi\lambda,\qquad K=k\lambda^2.             \tag{1.2}
\]

Retain the source normalization

\[
 a_4={\sqrt3\over2^{11/4}},\qquad
 h_\lambda=a_4h_{4,\lambda}-a_{0,\lambda}h_{0,\lambda},
\]

\[
 |a_{0,\lambda}/a_4|\leq2\sqrt2\lambda.         \tag{1.3}
\]

Let `phi`, `psi`, and the invisible correction be exactly those of
`EXACT_RADICAL_LEAKAGE_IDENTITY.md`:

\[
 \phi(x)=e^{1-1/(1-x^2)}1_{|x|<1},\qquad
 \psi(x)=2\phi(2x)-\phi(x),
\]

\[
 A_\lambda=h_\lambda(0),\qquad
 \widetilde h_\lambda(x)=h_\lambda(x)
       -A_\lambda\psi(2\lambda x).               \tag{1.4}
\]

Thus `tilde h_lambda(0)=integral(tilde h_lambda)=0`.  Put

\[
 K_\lambda=S\mathcal E(\widetilde h_\lambda),\qquad
 O_\lambda=(1-C_\lambda)K_\lambda,
 \quad S={1+J\over2}.                            \tag{1.5}
\]

All functions in the following norm are in centered logarithmic coordinates,
so `Jg(t)=g(-t)`, `C_lambda=1_[ -log(lambda),log(lambda)]`, and
`tau_h g(t)=g(t+h)`.

Define the following fixed elementary constants:

\[
 C_2={40\,3^{-1/4}e^{-(1+\sqrt3)/2}
          \over(1-1/\sqrt3)^2},                 \tag{1.6}
\]

\[
 C_{\phi,3}=222816\sqrt e,\qquad
 C_{\psi,3}=9C_{\phi,3},\qquad
 C_{x\psi,3}=C_{\psi,3}+3C_2,                  \tag{1.7}
\]

\[
 C_b={2C_2^2+(C_{\psi,3}+4C_2)^2\over36}.       \tag{1.8}
\]

Finally set

\[
\boxed{
\begin{aligned}
 D_S(\lambda)
={}&36864\pi^2a_4^2\lambda^3
 \left(32+256\pi\lambda^3
              +16384\sqrt{2\pi}\lambda^4\right)\\
 &+8a_4^2\lambda C_b .
\end{aligned}}                                                   \tag{1.9}
\]

**Theorem 1 (complete weighted translation modulus).**  For every
`lambda>=2`, every real `|y|<1/2`, and every `0<h<=1/2`, put

\[
 \epsilon(y)={1\over2}-|y|.
\]

Then the actual state (1.5), including both inversion-reflected tails and
the fixed invisible bump, satisfies

\[
\boxed{
 \|\tau_h(e^{y\,\cdot}O_\lambda)
             -e^{y\,\cdot}O_\lambda\|_2^2
 \le D_S(\lambda)\epsilon(y)^{-1}h^{\epsilon(y)}d_4 .}
                                                               \tag{1.10}
\]

Thus Required Lemma S holds with the fixed integer `q=1`.  Every constant
in (1.10) is displayed.  The leading degree of `D_S` is seven, strictly
below the fixed-index comparison power eight in `d_8/d_4`; no effective
claim about that separate qualitative asymptotic is inferred here.

The same component estimates, now using their displayed amplitude bounds
instead of their differences, give the explicit weighted `L2` bound

\[
 \|e^{y\,\cdot}O_\lambda\|_2^2
 \leq D_S(\lambda)\epsilon(y)^{-1}d_4.          \tag{1.11}
\]

Indeed the leading norm is at most `e_n^2/(32 delta)`, the far norm is at
most `8A_n^2K^2 lambda^(-2-2delta)`, the near norm is the first bound in
(5.3), and the bump norm follows from (6.5).  Each is smaller than the
corresponding deliberately rounded summand collected in (7.4).

## 2. Exact physical profile and all components

Put `ell=log(lambda)` and `u=lambda e^s`.  The two codimension conditions in
(1.4), Poisson summation, and time support give, almost everywhere,

\[
 O_\lambda(\ell+s)=O_\lambda(-\ell-s)=B_f(s),\qquad s\geq0,
                                                               \tag{2.1}
\]

where

\[
 B_f(s)={\sqrt u\over2}
       \sum_{m\geq1}\widehat{\widetilde h_\lambda}(mu).       \tag{2.2}
\]

Equation (2.1) proves at the outset that inversion reflection is retained;
there is no unreflected one-tail model in the theorem.

For one prolate label define

\[
 L_n(\xi)={e_n\over\pi\xi}\sin(k\xi),\qquad
 R_n(\xi)=H_n(\xi)-L_n(\xi).                    \tag{2.3}
\]

The exact harmonic sine series gives

\[
 {\sqrt u\over2}\sum_{m\geq1}L_n(mu)
 ={e_n\over2\sqrt u}P(\lambda u),
 \qquad P(x)={1\over2}-\{x\},                  \tag{2.4}
\]

away from the countable jump set, with arbitrary midpoint values there.
Since `lambda u=lambda^2e^s`, this is the complete leading sawtooth, not a
truncated harmonic sum.

The remainder is split only for estimation:

\[
 B_{n,{\rm near}}(s)
 =1_{0\leq s\leq\log2}{\sqrt u\over2}R_n(u),    \tag{2.5}
\]

\[
 B_{n,{\rm far}}(s)
 ={\sqrt u\over2}\left(
 1_{u\geq2\lambda}R_n(u)+\sum_{m\geq2}R_n(mu)\right).        \tag{2.6}
\]

The sum of (2.5)--(2.6) is the full sampled `R_n` series almost everywhere.
The two opposite traces at `s=log 2` are artificial joins and are explicitly
included in the translation estimates below.  At `s=0`, zero extension
retains the actual hard window-boundary jump.

The bump contribution in (2.2) is

\[
 B_{\rm bump}(s)=-{A_\lambda\over4\sqrt\lambda}F_\psi(s),
\]

\[
 F_\psi(s)=e^{s/2}\sum_{m\geq1}\widehat\psi(me^s/2).         \tag{2.7}
\]

Equations (2.4)--(2.7) account for the leading sawtooth, the single near-edge
sample, the complete exterior Volterra remainder over every other sample,
both artificial joins, and the invisible bump.

## 3. A corrected sawtooth lemma

The phase scale in the sawtooth estimate cannot be omitted.  The following
is the form used in the theorem.

**Lemma 2 (weighted multiplicative sawtooth).**  If `A>=4`,
`0<delta<=1/2`, and `0<h<=1/2`, then, after zero extension to the line,

\[
\boxed{
 \|\tau_h(1_{s\geq0}e^{-\delta s}P(Ae^s))
       -1_{s\geq0}e^{-\delta s}P(Ae^s)\|_2^2
 \leq128\delta^{-1}A^\delta h^\delta.}          \tag{3.1}
\]

**Proof.**  Set `eta=e^h-1<=2h`.  After `x=Ae^s`, the squared
weight is `A^(2delta)x^(-1-2delta)dx`.  On `[r,r+1)`, while
`eta(r+1)<1`, the set across which `P((1+eta)x)` crosses an integer has
length at most `eta(r+1)`; off this set its change has modulus at most the
same number.  Hence that unit interval contributes at most
`2eta(r+1)`.  Above the splitting point use the bound one.

If `A eta<1`, comparison of the unit sums with integrals gives

\[
\begin{aligned}
 A^{2\delta}\eta
   \sum_{r\geq\lfloor A\rfloor}^{r<1/\eta}r^{-2\delta}
 &\leq 8(A\eta)^\delta,\\
 A^{2\delta}
   \sum_{r\geq1/\eta}r^{-1-2\delta}
 &\leq {4\over\delta}(A\eta)^{2\delta}
 \leq {4\over\delta}(A\eta)^\delta .           \tag{3.2}
\end{aligned}
\]

For the first line, put `x=A eta` and use
`x integral_1^(1/x) v^(-2delta)dv
 <=2x^delta`; `floor(A)>=3A/4` accounts for the displayed slack.  If
`A eta>=1`, the trivial translation bound
`4||e^(-delta s)P(Ae^s)||_2^2<=1/(2delta)` is already at most a
constant times `(A eta)^delta/delta`.  The initial partial interval, the
zero-extension strip of length `h`, and the multiplier
`e^(-delta h)` together cost less than the remaining factor eight in
(3.1).  Finally `eta^delta<=(2h)^delta<=sqrt(2)h^delta`.  This proves
(3.1).  \(\square\)

The factor `A^delta` is necessary.  For shifts of size comparable to
`1/A`, the sawtooth changes by order one near `s=0`; a bound independent of
`A` would therefore be false.  In the actual state the right-tail leading
piece, after multiplication by `e^(y t)`, is

\[
 {e_n\over2}\lambda^{-\delta}
 1_{s\geq0}e^{-\delta s}P(\lambda^2e^s),          \tag{3.3}
\]

where `delta=1/2-y`.  Thus `lambda^(-2delta)A^delta=1` exactly, and Lemma 2
gives

\[
 \|\Delta_h B_{n,{\rm lead}}^{(y)}\|_2^2
 \leq32e_n^2\delta^{-1}h^\delta.                \tag{3.4}
\]

For a tail with actual margin `delta_0>1/2`, set `delta=1/2`.  This cap is
not an appeal to a vague monotonicity principle.  After `x=Ae^s`, its
weighted measure satisfies the pointwise identity and inequality

\[
 A^{2\delta_0}x^{-1-2\delta_0}
 =A x^{-2}(A/x)^{2\delta_0-1}\leq A x^{-2},
 \qquad x\geq A.                                \tag{3.5}
\]

Thus every jump-set and off-jump unit integral is bounded by the
`delta=1/2` calculation.  The extra multiplier
`exp(-(delta_0-1/2)s)` has change at most `h` times itself and its smooth
term is below the slack in 128.  Also
`lambda^(-2delta_0)A^(1/2)=lambda^(1-2delta_0)<=1`.  Therefore (3.4)
continues to hold with the capped `delta=1/2` and no enlarged constant.

## 4. Complete far Volterra series

The exterior ODE and monotone amplitude theorem in
`OUTER_OUTER_ENDPOINT_OBSTRUCTION.md` give, for `xi>=2lambda`,

\[
 |R_n(\xi)|\leq {4A_nK\over\xi^2},\qquad
 |R_n'(\xi)|\leq {8A_nkK\over\xi^2},
 \qquad A_n={|e_n|\over\pi}.                    \tag{4.1}
\]

For completeness, write

\[
 \sqrt{\xi^2-\lambda^2}H_n(\xi)
 ={e_n\over\pi}\sin(k\xi)+E_n(\xi).
\]

Variation of constants, `|sqrt(xi^2-lambda^2)H_n(xi)|<=A_n`, and
`0<=k^2lambda^2-mu_n<=k^2lambda^2` give

\[
 |E_n(\xi)|\leq {A_n\over k}\left(
 {4k^2\lambda^2\over3\xi}
       +{16\lambda^2\over27\xi^3}\right),       \tag{4.2}
\]

and differentiation of that Volterra integral gives the same bracket
without `1/k`.  Combining (4.2) with

\[
 {1\over\sqrt{\xi^2-\lambda^2}}-{1\over\xi}
 \leq{\lambda^2\over\xi^3},\qquad \xi\geq2\lambda,
\]

proves (4.1) with the displayed rounded constants.  This is the complete
Volterra error; no asymptotic remainder is discarded.

Put

\[
 \Phi(z)=\min\{1,z(2+\log_+(1/z))\}.
\]

For samples which remain in the same side of the artificial join, (4.1),
`e^h-1<=2h`, and a split at `m` comparable to `(hku)^(-1)` give

\[
 \sum_m|R_n(mue^h)-R_n(mu)|
 \leq {32A_nK\over u^2}\Phi(hku).                \tag{4.3}
\]

Indeed the summand is bounded by

\[
 {8A_nK\over m^2u^2}
 \min\{1,2hkum\},                                \tag{4.4}
\]

and the two pieces are a harmonic sum below the split and an `m^(-2)` tail
above it.  The change of the factor `u^(y+1/2)` costs a further
`4A_nK u^(-1-delta)Phi(hku)`.  Hence, away from the two crossing strips,

\[
 |\Delta_h(e^{y(\ell+s)}B_{n,{\rm far}}(s))|
 \leq40A_nK u^{-1-\delta}\Phi(hku),              \tag{4.5}
\]

where `delta=min(1/2-y,1/2)` for the right tail.  For every
`0<delta<=1/2`,

\[
 \Phi(z)^2\leq4z^\delta.                         \tag{4.6}
\]

For `z<1`, this follows because
`z^(2-delta)(2+log(1/z))^2` decreases from four; for `z>=1` it is
immediate.  Since `ds=du/u`, (4.5)--(4.6) give an interior contribution at
most

\[
 3200A_n^2K^2k^\delta\lambda^{-2-\delta}h^\delta. \tag{4.7}
\]

There are only two crossing strips: the true zero-extension boundary at
`s=0` and the artificial `m=1` join at `s=log2`.  Their total length is at
most `2h`.  The amplitude bound from (4.1), with the exact near-edge bound
at the second trace, adds at most

\[
 128A_n^2K^2k^\delta\lambda^{-2-\delta}h^\delta. \tag{4.8}
\]

Thus the deliberately rounded complete estimate is

\[
\boxed{
 \|\Delta_h B_{n,{\rm far}}^{(y)}\|_2^2
 \leq4096A_n^2K^2k^\delta
          \lambda^{-2-\delta}h^\delta .}         \tag{4.9}
\]

The logarithm in (4.3) has been absorbed before integration by (4.6); there
is no hidden logarithmic or unspecified constant in (4.9).

If the actual tail margin is `delta_0>1/2`, (4.5) contains
`u^(-1-delta_0)`.  Use (4.6) with the capped `delta=1/2`; the integral is

\[
 (hk)^{1/2}\int_\lambda^\infty
 u^{-2-2\delta_0+1/2}\,{du\over u}
 \leq (hk)^{1/2}\lambda^{-5/2}.                \tag{4.10}
\]

This is exactly no larger than the right side of (4.9) at
`delta=1/2`.  The crossing-strip comparison is strengthened in the same
way.  Hence the cap used in (4.9) is explicit.

## 5. Exact near-edge sample and both joins

The monotone exterior energy gives `|H_n(xi)|<=|e_n|` for `xi>=lambda`.
Integrating the exterior equation once from its regular endpoint gives,
for `lambda<=xi<=2lambda`,

\[
 |H_n'(\xi)|
 \leq |e_n|k^2{\xi^3-\lambda^3\over3(\xi^2-\lambda^2)}
 \leq |e_n|k^2\lambda.                         \tag{5.1}
\]

Equations (2.3) and (5.1) imply

\[
 |R_n(\xi)|\leq{7\over6}|e_n|,qquad
 |R_n'(\xi)|\leq2|e_n|k^2\lambda               \tag{5.2}
\]

on this interval.  Consequently the weighted version of (2.5), including
both of its zero-extension traces, has

\[
 \|g\|_2^2\leq2e_n^2\lambda^{2-2\delta},
 \qquad
 \|g'\|_2^2\leq25e_n^2k^4\lambda^{6-2\delta}.   \tag{5.3}
\]

For a zero-extended absolutely continuous function on a finite interval,

\[
 \|\tau_hg-g\|_2^2
 \leq2h(|g(0)|^2+|g(b)|^2)+4h^2\|g'\|_2^2,      \tag{5.4}
\]

and trivially it is at most `4||g||_2^2`.  Apply
`min(X,Y)<=X^(1-theta)Y^theta` with `theta=delta/2` to the interior term
in (5.4).  Since

\[
 \lambda^{(2-2\delta)(1-\delta/2)
            +(6-2\delta)\delta/2}=\lambda^2,
 \qquad k^{2\delta}\leq k,
\]

and the trace term is smaller, (5.3)--(5.4) give

\[
\boxed{
 \|\Delta_h B_{n,{\rm near}}^{(y)}\|_2^2
 \leq128e_n^2k\lambda^2h^\delta.}               \tag{5.5}
\]

This interpolation is why the large point value of `H_n'(lambda)` does not
create the spurious degree-twelve loss.  Equations (4.8) and (5.4) also show
explicitly that both sides of the artificial join have been charged.

For an actual margin `delta_0>1/2`, use the cap `delta=1/2` only as the
translation exponent.  Before interpolation the two powers in (5.3) are
then `lambda^(2-2delta_0)` and `lambda^(6-2delta_0)`.  With interpolation
parameter `1/4`, their combined power is

\[
 {3\over4}(2-2\delta_0)+{1\over4}(6-2\delta_0)
 =3-2\delta_0\leq2,                            \tag{5.6}
\]

and `k^(4/4)=k`.  This proves (5.5) for the capped margin rather than merely
asserting that the stronger weight helps.

## 6. Invisible bump with an independently bounded constant

The already locked bound (1.6) is `||psi''||_1<=C_2`.  Direct
differentiation gives

\[
 \phi'''(x)=
 {-12x+40x^3-12x^5-24x^7\over(1-x^2)^6}\phi(x).
                                                               \tag{6.1}
\]

For `0<x<1`, put `t=1-x`.  Since
`1-x^2>=t`, `1-x^2<=2t`, and
`phi(x)<=e exp(-1/(2t))`,

\[
 \|\phi'''\|_1
 \leq5632e\,\Gamma(5,1/2)
 =222816\sqrt e=C_{\phi,3}.                    \tag{6.2}
\]

The dilation in `psi=2phi(2x)-phi(x)` therefore gives

\[
 \|\psi'''\|_1\leq9C_{\phi,3}=C_{\psi,3},
 \qquad
 \|(x\psi)'''\|_1
 \leq C_{\psi,3}+3C_2=C_{x\psi,3}.             \tag{6.3}
\]

Two integrations by parts and three integrations by parts, respectively,
give

\[
 |\widehat\psi(\eta)|\leq{C_2\over4\pi^2\eta^2},
 \qquad
 |\eta\widehat\psi'(\eta)|
 \leq{C_{x\psi,3}\over4\pi^2\eta^2}.          \tag{6.4}
\]

Using `sum m^(-2)=pi^2/6` in (2.7),

\[
 |F_\psi(s)|\leq{C_2\over6}e^{-3s/2},
 \qquad
 |F_\psi'(s)|
 \leq\left({C_2\over12}+{C_{x\psi,3}\over6}\right)e^{-3s/2}.
                                                               \tag{6.5}
\]

For a zero-extended absolutely continuous function on the half-line, the
one-boundary version of the proof of (5.4) is

\[
 \|\tau_hg-g\|_2^2
 \leq2h|g(0)|^2+2h^2\|g'\|_2^2.                 \tag{6.6}
\]

After either strip weight, this inequality and `h,h^2<=h^delta` prove

\[
 \|\Delta_h B_{\rm bump}^{(y)}\|_2^2
 \leq {A_\lambda^2\over16}\,C_bh^\delta.        \tag{6.7}
\]

There is no unevaluated `C_(psi,3)` in (6.7).
For an actual margin above `1/2`, the complete weighted bump decays as
`exp(-(1+delta_0)s)` and its prefactor contains
`lambda^(-delta_0)`.  Replacing these by the capped values
`exp(-3s/2)` and `lambda^(-1/2)` can only enlarge every norm in the direct
half-line estimate leading to (6.7).

## 7. Collection for the corrected reflected state

The endpoint theorem, concentration ordering, source coefficient bound, and
invisible-bump bound give

\[
 e_n^2\leq256\pi^2\lambda d_n,qquad d_0\leq d_4,
\]

\[
 \sum_{n=0,4}|a_n|^2e_n^2
 \leq2304\pi^2a_4^2\lambda^3d_4=:E_\lambda,     \tag{7.1}
\]

where `a_4` is as above and `|a_0|` denotes `|a_(0,lambda)|`, and

\[
 |A_\lambda|^2\leq8a_4^2\lambda d_4^2
 \leq8a_4^2\lambda d_4.                         \tag{7.2}
\]

For the far term, `A_n^2=e_n^2/pi^2` and

\[
 K^2k^\delta\lambda^{-2-\delta}
 =k^2\lambda^2(2\pi)^\delta
 \leq k^2\lambda^2\sqrt{2\pi}.                 \tag{7.3}
\]

For one tail, (3.4), (4.9), (5.5), and (6.7) account for seven scalar
pieces: two labels in each of three prolate pieces and one bump.  Cauchy--
Schwarz costs at most seven.  The right and inversion-reflected left tails
are separated by `2log(lambda)>1/2`, so their squared translation norms add;
rounding the total factor `2*7` up to 16 gives

\[
\begin{aligned}
 \|\Delta_h(e^{y\cdot}O_\lambda)\|_2^2
 \leq{}&16E_\lambda\epsilon^{-1}h^\epsilon
 \left(32+128k\lambda^2
       +{4096\over\pi^2}k^2\lambda^2\sqrt{2\pi}\right)\\
 &+A_\lambda^2 C_b h^\epsilon.                  \tag{7.4}
\end{aligned}
\]

Here each noncritical tail margin has been replaced by
`delta=min(margin,1/2)>=epsilon`; since `h<=1`, its power only decreases,
and its reciprocal is at most `epsilon^(-1)`.  Substitution of
`k=2pi lambda`, (7.1), and (7.2) into (7.4) is exactly (1.9)--(1.10).
This completes the proof.  \(\square\)

For clarity, the component norms used in (1.11), before the same factor-16
collection, are

\[
 \|B_{n,{\rm lead}}^{(y)}\|_2^2
 \leq {e_n^2\over32\delta},\qquad
 \|B_{n,{\rm near}}^{(y)}\|_2^2
 \leq2e_n^2\lambda^{2-2\delta},                 \tag{7.5}
\]

\[
 \|B_{n,{\rm far}}^{(y)}\|_2^2
 \leq8A_n^2K^2\lambda^{-2-2\delta},qquad
 \|B_{\rm bump}^{(y)}\|_2^2
 \leq {A_\lambda^2C_2^2\over1152}.              \tag{7.6}
\]

For an uncapped margin use its actual value in these formulas; for a capped
margin the preceding explicit comparisons apply.  The four right sides in
(7.5)--(7.6) are respectively dominated by the `32`, `128 k lambda^2`,
`4096 k^2 lambda^2 sqrt(2pi)/pi^2`, and `C_b` terms in (7.4), since
`lambda>=2`, `k>=1`, and `delta<=1/2`.  Applying (7.1)--(7.3), (7.2), and
the same seven-piece/two-tail factor proves (1.11) directly; it is not being
inferred from a single translation difference.

## 8. Regression and claim boundary

The earlier audit expression

\[
 \|\Delta_h(e^{-\epsilon s}P(Ae^s))\|_2^2
 \leq64\epsilon^{-1}h^\epsilon
\]

with no dependence on `A` is rejected.  Taking `h` comparable to `1/A`
already contradicts such a uniform modulus.  The binding formula is (3.1),
whose `A^epsilon` factor cancels only after the exact source boundary shift
and `A=lambda^2` are inserted.  A verifier must reject the omitted-phase
formula.

Theorem 1 proves Required Lemma S and improves the collected polynomial
power from the audit's informal degree fourteen to the explicit degree
seven.  It does not, without the other source and domain obligations listed
at the beginning, promote the conditional dyadic sampling argument to an
outer--outer Weil theorem or alter the project terminal state.
