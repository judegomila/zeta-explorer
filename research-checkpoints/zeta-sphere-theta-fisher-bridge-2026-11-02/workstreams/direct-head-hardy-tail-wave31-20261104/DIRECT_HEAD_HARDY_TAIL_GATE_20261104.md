# The finite direct head as a tail-augmented complete-orbit Hardy gate

## Result and scope

Let `m=n+1`, assume the actual moment prefix is positive through degree `n`,
and let `q=p_m` be the monic next polynomial fixed by that old prefix. No
sign of its norm `sigma_m` is assumed. Under the old-prefix root hypotheses
of `COMPLETE_ORBIT_HARDY_NEXT.md`, write

\[
 q(t)=\prod_{j=1}^m(t-\rho_j),\quad
 W=2\Xi,\quad G=qW,\quad H_j={q\over t-\rho_j}W.
\tag{1}
\]

The last expression is a polynomial times `W`, not a singular quotient. Put

\[
 E=\|G'\|_2^2,\qquad B_j=\|H_j\|_2^2,\qquad
 \gamma_j={E\over B_j}.
\tag{2}
\]

If `mathcal H_(n,J)^dir` and `mathcal T_(n,J)^dir` are the direct Ewald head
and tail, then the wave-30 Gaussian prediction cancels exactly:

\[
\boxed{
 \mathcal H_{n,J}^{\rm dir}>0
 \iff
 E\left(2-\sum_{j=1}^m{1\over\gamma_j}\right)
 >2\pi\sigma_n\mathcal T_{n,J}^{\rm dir}.}
\tag{3}
\]

Everything in (3) is fixed by the old polynomial, complete theta, and the
explicit cutoff. No `sigma_m` or newest recurrence coefficient occurs on the
right. Equation (3) is a noncircular exact criterion, not its proof.

Conditional on the imported wave-24 complete-orbit onset and wave-29 Ewald
domain, the tail is positive past the stated onset. The missing lemma is a
strict theta-specific Hardy-slack estimate large enough to pay this tail.
No direct-head sign, next pivot, all-degree theorem, or RH result is proved.

## 1. Exact Hardy normalization

Use

\[
 B(u,v)={2\over\pi}\int_{\mathbb R}u(t)v(t)f(t)\,dt,
 \qquad f=\Xi'^2-\Xi\Xi''={1\over4}(W'^2-WW'').
\tag{4}
\]

Real-rootedness gives

\[
 q'^2-qq''=\sum_{j=1}^m q_j^2,\qquad
 q_j={q\over t-\rho_j}.
\tag{5}
\]

All boundary terms vanish because `q_j` is polynomial and `W` has
exponential real-axis decay. Expanding `2||(qW)'||^2`, subtracting (5)
against `W^2`, and integrating `(qq'W^2)'` gives

\[
\boxed{
 2\|G'\|_2^2-\sum_{j=1}^m\|H_j\|_2^2
 =\int_{\mathbb R}q^2(W'^2-WW'')\,dt.}
\tag{6}
\]

Therefore

\[
\boxed{
 \sigma_m=B(q,q)
 ={1\over2\pi}\left(2E-\sum_{j=1}^mB_j\right)
 ={E\over2\pi}\left(2-\sum_{j=1}^m{1\over\gamma_j}\right).}
\tag{7}
\]

This identity is valid whether the quantity is positive or negative.

## 2. Cancellation of the Gaussian prediction

Let `mu_(2m)=B(t^m,t^m)`. The `m`-node Gaussian rule from the positive old
prefix has roots `rho_j`, positive weights `lambda_j`, and is exact through
degree `2m-1`. Since `q^2=t^(2m)+r`, `deg r<=2m-1`, and
`q(rho_j)=0`,

\[
 \sigma_m=\mu_{2m}-\sum_{j=1}^m\lambda_j\rho_j^{2m}.
\tag{8}
\]

Combining (7)--(8),

\[
\boxed{
 \mu_{2m}
 =\sum_{j=1}^m\lambda_j\rho_j^{2m}
 +{1\over2\pi}\left(2E-\sum_{j=1}^mB_j\right).}
\tag{9}
\]

Substitution in the wave-30 direct-head criterion cancels the Gaussian cost.
Define

\[
 \Delta_m^{\rm H}:=2-\sum_{j=1}^m{1\over\gamma_j},
 \qquad
 R_{n,J}:={2\pi\sigma_n\mathcal T_{n,J}^{\rm dir}\over E}.
\tag{10}
\]

Then

\[
\boxed{\mathcal H_{n,J}^{\rm dir}>0
 \iff \Delta_m^{\rm H}>R_{n,J}.}
\tag{11}
\]

For a positive conditional tail, `R_(n,J)>0`; since every `B_j>0`, strict
head positivity also requires `R_(n,J)<2`.

## 3. Root-logarithmic variance sufficient condition

For each root introduce

\[
 u_{j,\pm}(y)=e^{y/2}H_j(\rho_j\pm e^y),
\tag{12}
\]

and let `V_j` be the variance of `y` under the probability density
proportional to `|u_(j,+)|^2+|u_(j,-)|^2`. The exact rootwise identity and
vector-valued uncertainty inequality give

\[
 \gamma_j={1\over4}+{K_j\over B_j},\qquad
 {K_j\over B_j}\ge {1\over4V_j},\qquad
 \boxed{{1\over\gamma_j}\le {4V_j\over1+V_j}.}
\tag{13}
\]

Thus a stronger noncircular sufficient condition is

\[
\boxed{
 2-\sum_{j=1}^m{4V_j\over1+V_j}>R_{n,J}.}
\tag{14}
\]

If `0<=R_(n,J)<2`, it is enough that

\[
\boxed{
 V_j<{2-R_{n,J}\over4m-2+R_{n,J}}
 \quad(1\le j\le m).}
\tag{15}
\]

Indeed, (15) is the strict solution of `4m V/(1+V)<2-R`. At zero tail it
reduces to `V_j<1/(2m-1)`. These variances are positive complete-theta
Mellin curvatures:

\[
 Z_j(s)=\int_{\mathbb R}|t-\rho_j|^s q_j(t)^2W(t)^2\,dt,
 \qquad V_j=(\log Z_j)''(0).
\tag{16}
\]

## 4. Positive Mellin weights expose a placement problem

The wave-30 cutoff multipliers have exact fractional-part forms for
`0<Re s<1`:

\[
\boxed{Z_K^L(s)=-s\int_0^K\{x\}x^{-s-1}\,dx,}
\tag{17}
\]

\[
\boxed{
 Z_K^T(s)=-s\left[
 \int_0^K\{x\}x^{-s-1}\,dx+
 {1\over2}\int_K^\infty x^{-s-1}\,dx\right].}
\tag{18}
\]

Let

\[
 w_K^L(x)=\{x\}\mathbf1_{(0,K)}(x),\qquad
 w_K^T(x)=w_K^L(x)+{1\over2}\mathbf1_{(K,\infty)}(x).
\tag{19}
\]

With the complete first leg and fixed old polynomial retained,

\[
 E_K^{L/T}(t)=\int_0^\infty
 w_K^{L/T}(x)\,\partial_xC_x(t)\,dx,
\tag{20}
\]

and the selected cutoff head is

\[
\boxed{
 H_{q,K}^{L/T}=\int_0^\infty
 w_K^{L/T}(x)J_q'(x)\,dx.}
\tag{21}
\]

The weights in (19) are nonnegative, but `J_q'` cannot be one-signed for a
nonzero self-dual Schwartz source with `J_q(0)=J_q(infinity)=0`. Kernel
positivity does not prove (21); the required statement is a theta-specific
placement inequality. The rigorous degree-one cells `e_1>0,e_2<0` already
exhibit this actual sign change.

There is also a quotient guardrail. Where `Xi` is nonzero, put
`R_K=E_K/Xi`. Then

\[
 \mathcal B(\Xi,E_K)
 =R_K(\Xi'^2-\Xi\Xi'')-{1\over2}\Xi^2R_K''.
\tag{22}
\]

At a simple Xi zero not shared by `E_K`, the two terms have opposite simple
poles with residues `+Xi'(gamma)E_K(gamma)` and
`-Xi'(gamma)E_K(gamma)`. Only their sum is regular. Separate estimates after
division by Xi are invalid without a zero-sharing theorem.

## 5. Sharp obstruction and remaining lemma

Generic root vanishing gives only Hardy's optimal `gamma_j>=1/4`. Even one
root and zero tail needs `gamma_1>1/2` for strict positivity; a positive tail
raises the threshold. No source-free Hardy or Hilbert-space inequality can
establish (3).

The actual target is

\[
\boxed{
 \sum_{j=1}^m{1\over\gamma_j}
 <2-{2\pi\sigma_n\mathcal T_{n,J}^{\rm dir}\over E}.}
\tag{23}
\]

A proof may use (14), but rootwise estimates are not logically required:
slack can be correlated among roots. Any continuation must retain the
complete `qW` before forming root costs and the full signed derivative in
(21).

The verifier checks exact polynomial/Gaussian cases of (6), Gauss
cancellation, the threshold manipulation, incomplete-Euler telescoping, the
quotient identity, dependency hashes, and receipt integrity. Quadrature
exactness, the Ewald/Fubini domain, and the imported tail theorem remain
analytic inputs.
