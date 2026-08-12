# Odd-pole harmonic short and Chebyshev-error obstruction

## 0. Status and claim boundary

This note gives exact finite-dimensional reductions and one exact
unprojected pole-axis arithmetic identity for the odd sector of the direct
Xi--prolate--Weil program.  It has six purposes.

1. It proves that adjoining the residual odd-pole direction to the dangerous
   space removes one high-space direction but does not weaken the signed
   Schur obligation.  The new scalar Schur target is exactly equivalent to
   the original rank-one resolvent load.
2. It gives a monotone hierarchy of cancellation-preserving higher edge
   moments, including an exact positive remainder and the sharp
   endpoint-interpolating quadratic majorant.
3. It gives an edge-localization test that can be bounded by ordinary powers
   or squared Chebyshev filters of the exact compressed defect.
4. It constructs, for every fixed moment order, two exact finite spectral
   models with identical moments through that order and loads on opposite
   sides of one.
5. It records the exact matched-Fourier pole mass and the consequent
   necessary physical-capture scale.
6. On the full, unprojected pole vector, it combines the negative pole and
   complete minus-prime block before taking absolute values.  The leading
   terms cancel exactly, leaving a smoothed Chebyshev error at the
   `sqrt(X)=lambda` scale.  The currently pinned unconditional prime-number
   theorem estimate does not control its sign at that scale.

These statements do **not** prove the actual odd directional reserve on an
unbounded schedule.  They do not prove a shifted odd-sector floor, either
complete signed sector floor, equation (5.2) of `DIRECT_RH_ATTACK.md`,
locally uniform determinant convergence, or the Riemann hypothesis.  No
zero table, global Weil positivity, or reality of nontrivial zeta zeros is
used.

The exact finite Weil conventions remain those of `P0_SOURCE_LOCK.json` and
`P0_MATRIX_FORMULAS.md`.  The terminal project state remains
`P0_INVALIDATED`.

## 1. Locked conventions and exact pole cross Grams

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I_\lambda=[-\ell,\ell],\qquad \lambda>1.             \tag{1.1}
\]

The physical measure is Lebesgue measure `dx`, all physical functions are
extended by zero, and

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi},
 \qquad (Jf)(x)=f(-x).                                  \tag{1.2}
\]

The complete source multiplier is

\[
 \boxed{
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).}                 \tag{1.3}
\]

The endpoint `n<=lambda^2` is inclusive and the displayed minus sign is the
minus sign in source equation (3.19).  On the odd sector the pole is

\[
 -2|p_-\rangle\langle p_-|,
 \qquad p_-(x)=\sinh(x/2),
 \qquad \|p_-\|^2=\sinh\ell-\ell.                       \tag{1.4}
\]

Let `X` be a declared finite odd comparison space, normally a subspace of
the centered Fourier compression `E_N^-`, and put

\[
 p_N=P_Xp_-.
\]

If `W` synthesizes the captured physical range in `X`, define

\[
 G=W^*W,\qquad z=W^*p_N,\qquad
 P_K=WG^\dagger W^*,\qquad H=K^\perp,\qquad p=P_Hp_N.
                                                               \tag{1.5}
\]

Redundant columns are allowed.  The exact pole leakage is

\[
 \boxed{
 \mu=\|p\|^2
 =\|p_N\|^2-z^*G^\dagger z.}                            \tag{1.6}
\]

Thus no cached eigenvector or producer Boolean is needed to reconstruct the
pole leakage.

### 1.1 Projected and unprojected source cross Grams are different

Let `f` be a real even member of
`L1([-lambda,lambda]) intersect L2([-lambda,lambda])`, extended by zero.
These hypotheses make every finite arithmetic sum below measurable and make
both the physical column and the displayed cross-Gram integrals finite.  The
piecewise-smooth finite prolate source columns satisfy this class.  Set

\[
 \mathcal E(f)(u)=\sqrt u\sum_{m\geq1}f(mu),\qquad
 k_f(x)=\mathcal E(f)(e^x),\qquad
 k_f^-={k_f-Jk_f\over2}.                                \tag{1.7}
\]

Since `p_-` is odd,

\[
 \langle p_-,k_f^-\rangle=\langle p_-,k_f\rangle.
\]

Direct substitution `v=mu`, with the zero-extension convention retained,
gives the exact **unprojected** cross Gram

\[
\boxed{
\begin{aligned}
 \langle p_-,k_f^-\rangle
 ={1\over2}\sum_{1\leq m\leq\lambda^2}
 \left\{
 {1\over m}\int_{m/\lambda}^{\lambda}f(v)\,dv
 -\int_{m/\lambda}^{\lambda}{f(v)\over v}\,dv
 \right\}.                                             \tag{1.8}
\end{aligned}}
\]

Equivalently, up to the null set of floor discontinuities,

\[
 \boxed{
 \langle p_-,k_f^-\rangle
 ={1\over2}\int_{1/\lambda}^{\lambda}f(v)
 \left\{H_{\lfloor\lambda v\rfloor}
       -{\lfloor\lambda v\rfloor\over v}\right\}dv.} \tag{1.9}
\]

Formula (1.8) retains the inclusive upper arithmetic index.  It must not be
silently substituted for the finite projected cross Gram.  If
`W_f=P_Xk_f^-`, then

\[
 \langle W_f,p_N\rangle
 =\langle P_Xk_f^-,P_Xp_-\rangle,                       \tag{1.10}
\]

The exact equality criterion is

\[
 \langle P_Xk_f^-,P_Xp_-\rangle=\langle k_f^-,p_-\rangle
 \quad\Longleftrightarrow\quad
 \langle P_X^\perp k_f^-,P_X^\perp p_-\rangle=0.       \tag{1.10a}
\]

Membership `k_f^- in X` or `p_- in X` is sufficient, but neither is
necessary.  Thus (1.8) cannot generally replace the finite projected cross
Gram.

For the centered Fourier basis

\[
 \phi_n(x)=(-1)^nL^{-1/2}e^{i\omega_nx},
 \qquad \omega_n={2\pi n\over L},                       \tag{1.11}
\]

let

\[
 a_n=\langle\phi_n,k_f^-\rangle,
 \qquad b_n=\langle\phi_n,p_-\rangle,
 \qquad -N\leq n\leq N,
\]

and let `Pi_X` be the exact coefficient matrix of `P_X` inside `E_N`.
The correct finite assembly is

\[
 \boxed{
 \langle P_Xk_f^-,P_Xp_-\rangle=a^*\Pi_Xb.}            \tag{1.12}
\]

For the full odd sector, `Pi_X` is the exact odd-parity projector, not a
selection of only positive complex Fourier indices.  The pole coefficients
are

\[
 \boxed{
 \langle\phi_n,p_-\rangle
 ={2i\omega_n\sinh(\ell/2)
   \over\sqrt L(\omega_n^2+1/4)},\quad n\ne0,
 \qquad \langle\phi_0,p_-\rangle=0.}                   \tag{1.13}
\]

Equations (1.8) and (1.12) therefore give distinct, independently
reconstructible unprojected and projected checks.

**Proof of (1.8).**  On writing `u=e^x`,

\[
 \sinh(x/2)e^{x/2}{du\over u}
 ={1\over2}(u-1){du\over u}
 ={1\over2}(1-u^{-1})du.
\]

The support of `f(mu)` restricts `m` to `m<=lambda^2` and `u` to
`[1/lambda,lambda/m]`.  Substitution `v=mu` gives (1.8), and reversing the
finite sum and integral gives (1.9).  Formula (1.13) follows by elementary
integration, with `omega_n*ell=pi*n`.  \(\square\)

## 2. Exact pole-augmented harmonic Schur theorem

Let `mathcal H` be a finite-dimensional Hilbert space.  Fix

\[
 0<h<q,\qquad b=q-h,
 \qquad 0\preceq R\preceq bI,\qquad
 Y=bI-R,\qquad M=qI-R=hI+Y.                              \tag{2.1}
\]

Thus

\[
 hI\preceq M\preceq qI.                                \tag{2.2}
\]

Let `A>=0` be any retained positive excess and let `p in mathcal H` be the
residual pole vector from (1.5).  The shifted odd comparison is

\[
 B_A=M+A-2|p\rangle\langle p|.                          \tag{2.3}
\]

The case `p=0` is immediate: `B_A>=hI`.  Assume henceforth that

\[
 \mu=\|p\|^2>0,\qquad e={p\over\sqrt\mu},
 \qquad P_\perp=I-|e\rangle\langle e|.                  \tag{2.4}
\]

Relative to `C*e direct-sum e^perp`, write

\[
 M+A=
 \begin{bmatrix}a&c^*\\c&D\end{bmatrix},
 \qquad
 D=P_\perp(M+A)P_\perp\succeq hP_\perp.               \tag{2.5}
\]

Define the retained-excess pole load

\[
 \mathcal L_A=2\langle p,(M+A)^{-1}p\rangle.           \tag{2.6}
\]

### Theorem 2.1 (augmentation is an equivalent scalar short)

The scalar Schur complement after adjoining the pole direction is

\[
\boxed{
 s_A=a-2\mu-c^*D^{-1}c
 =2\mu\left({1\over\mathcal L_A}-1\right).}             \tag{2.7}
\]

Consequently,

\[
 \boxed{
 B_A\succ0
 \quad\Longleftrightarrow\quad
 s_A>0
 \quad\Longleftrightarrow\quad
 \mathcal L_A<1.}                                      \tag{2.8}
\]

If `0<eta<=1` and

\[
 \mathcal L_A\leq1-\eta,                               \tag{2.9}
\]

then the complete quantitative floor is

\[
 \boxed{B_A\succeq\eta(M+A)\succeq\eta hI.}           \tag{2.10}
\]

Thus pole augmentation removes the pole from the transverse high block and
from its low--high cross, but it does not give a weaker signed target.  It is
an exact one-scalar reparametrization of the original resolvent load.

**Proof.**  Block inversion of (2.5) gives

\[
 \langle e,(M+A)^{-1}e\rangle
 ={1\over a-c^*D^{-1}c}.                                \tag{2.11}
\]

Since `mathcal L_A=2*mu*<e,(M+A)^(-1)e>`, subtracting
`2*mu` proves (2.7).  Since `D` is strictly positive, the ordinary Schur
criterion proves (2.8).  Finally,

\[
 B_A=(M+A)^{1/2}
 \left(I-2|(M+A)^{-1/2}p\rangle
          \langle(M+A)^{-1/2}p|\right)(M+A)^{1/2}.       \tag{2.12}
\]

The middle rank-one operator has smallest eigenvalue
`1-mathcal L_A`, proving (2.10).  \(\square\)

### Corollary 2.2 (what a retained positive excess must prove)

For `A=0`, (2.2) gives

\[
 \boxed{
 {2\mu\over q}\leq\mathcal L_0\leq{2\mu\over h}.}     \tag{2.13}
\]

In particular,

\[
 \boxed{\mathcal L_0<1\quad\Longrightarrow\quad
        \mu<q/2.}                                      \tag{2.14}
\]

With positive excess retained, put

\[
 s_{0,A}:={1\over\langle e,(M+A)^{-1}e\rangle}.
\]

The exact target is `s_(0,A)>2*mu`.  Since a scalar Schur complement is no
larger than its diagonal entry and `M<=qI`, a necessary condition is

\[
 \boxed{
 \langle e,Ae\rangle>2\mu-q,
 \qquad\hbox{equivalently}\qquad
 \langle p,Ap\rangle>\mu(2\mu-q).}                    \tag{2.15}
\]

Condition (2.15) is not sufficient: transverse coupling can make
`c^*D^(-1)c` nonzero.  Moving a large pole into the low block therefore
replaces a capture obligation by an aligned positive-excess harmonic-short
obligation; it does not establish positivity.

## 3. A monotone higher edge-moment hierarchy

Retain (2.1) and first set `A=0`.  Put

\[
 d_1=\langle p,Yp\rangle,
 \qquad
 \zeta_j=\langle p,Y(bI-Y)^jp\rangle\geq0,
 \quad j\geq1.                                         \tag{3.1}
\]

For an integer `K>=0`, define

\[
 \boxed{
 \mathcal U_K=2\left\{
 {\mu\over h}-{d_1\over hq}
 -\sum_{j=1}^{K}{\zeta_j\over hq^{j+1}}
 \right\},}                                           \tag{3.2}
\]

where the sum is empty for `K=0`.

### Theorem 3.1 (exact monotone edge remainder)

For every `K>=0`,

\[
\boxed{
 \mathcal U_K-\mathcal L_0
 ={2\over hq^{K+1}}
 \left\langle p,
 Y(bI-Y)^{K+1}(hI+Y)^{-1}p
 \right\rangle\geq0.}                                 \tag{3.3}
\]

The upper bounds are nonincreasing,

\[
 \mathcal U_{K+1}\leq\mathcal U_K,                    \tag{3.4}
\]

and, with `gamma=b/q<1`,

\[
 \boxed{
 0\leq\mathcal U_K-\mathcal L_0
 \leq{2\mu\over h}\gamma^{K+1}.}                     \tag{3.5}
\]

A sharper best scalar maximum in (3.3) is

\[
 \boxed{
 \mathcal U_K-\mathcal L_0
 \leq{2\mu\over hq^{K+1}}F_K(h,b),}                   \tag{3.6}
\]

where

\[
 F_K(h,b)={y_K(b-y_K)^{K+1}\over h+y_K},               \tag{3.7}
\]

\[
 y_K={
 \sqrt{h^2(K+2)^2+4hb(K+1)}-h(K+2)
 \over2(K+1)}.                                         \tag{3.8}
\]

The value `y_K` is the unique maximizer in `(0,b)` of
`y(b-y)^(K+1)/(h+y)`.

**Proof.**  For `0<=y<=b`, put `z=b-y`.  The finite geometric identity

\[
\begin{aligned}
 {1\over h+y}
 &={q-y\over hq}
 -\sum_{j=1}^{K}{y(b-y)^j\over hq^{j+1}}\\
 &\quad-{y(b-y)^{K+1}\over hq^{K+1}(h+y)}              \tag{3.9}
\end{aligned}
\]

is obtained by expanding `1/(q-z)` for exactly `K` terms inside the exact
chord defect.  Spectral calculus proves (3.3).  Subtracting consecutive
bounds proves (3.4).  Since

\[
 {y\over h+y}\leq1,\qquad 0\leq b-y\leq b,
\]

equation (3.5) follows.  Maximizing the exact scalar remainder gives

\[
 {h\over y(h+y)}={K+1\over b-y},
\]

whose positive quadratic root is (3.8), proving (3.6)--(3.8).  \(\square\)

Since `A>=0` implies `(M+A)^(-1)<=M^(-1)`, every `mathcal U_K` is also a
valid upper bound for `mathcal L_A`.

### Corollary 3.2 (sharp quadratic edge certificate)

At `K=1`,

\[
 \boxed{
 \mathcal L_A\leq\mathcal L_0
 \leq {2\mu\over h}-{2d_1\over hq}
 -{2\langle p,Y(bI-Y)p\rangle\over hq^2}.}             \tag{3.10}
\]

The right side is below one exactly when

\[
 \boxed{
 qd_1+\langle p,Y(bI-Y)p\rangle
 >q^2(\mu-h/2).}                                      \tag{3.11}
\]

The coefficient `1/(h*q^2)` is sharp among quadratic majorants that agree
with `1/(h+y)` at both endpoints.  Indeed,

\[
 {q-y\over hq}-{1\over h+y}
 ={y(b-y)\over hq(h+y)},                               \tag{3.12}
\]

so a majorant of the form

\[
 {q-y\over hq}-C y(b-y)
\]

is valid on `[0,b]` exactly when

\[
 C\leq\min_{0\leq y\leq b}{1\over hq(h+y)}
 ={1\over hq^2}.                                       \tag{3.13}
\]

This strengthens the first-moment chord certificate whenever the new edge
variance is positive.  It remains a sufficient certificate, not an
estimate of the actual prolate orientation.

## 4. Edge localization and polynomial filters

Retain (2.1), assume `b>0`, and fix `0<tau<b`.  Define the **open** dangerous
edge mass

\[
 m_\tau=\|1_{[0,\tau)}(Y)p\|^2.                         \tag{4.1}
\]

The open endpoint assigns a spectral atom at `Y=tau` to the second, sharper
resolvent denominator.

### Theorem 4.1 (sharp two-window edge bound)

One has

\[
 \boxed{
 \mathcal L_A\leq\mathcal L_0
 \leq {2\mu\over h+\tau}
 +{2\tau m_\tau\over h(h+\tau)}.}                    \tag{4.2}
\]

The bound is sharp from only `mu`, `m_tau`, and the two spectral windows: put
the dangerous mass at `Y=0` and the remaining mass at `Y=tau`.

Let `R=bI-Y`.  For every integer `k>=1`, define

\[
 \rho_k=\langle p,R^kp\rangle,                         \tag{4.3}
\]

\[
 \chi_{k,\tau}=
 \left\langle p,
 T_k\!\left({2R\over b-\tau}-I\right)^2p
 \right\rangle,                                       \tag{4.4}
\]

where `T_k` is the first-kind Chebyshev polynomial.  Then

\[
 \boxed{
 m_\tau\leq\overline m_{k,\tau}:=
 \min\left\{
 \mu,{\rho_k\over(b-\tau)^k},\chi_{k,\tau}
 \right\}.}                                           \tag{4.5}
\]

Consequently

\[
 \boxed{
 \mathcal L_A\leq
 U_{\tau,k}:={2\mu\over h+\tau}
 +{2\tau\over h(h+\tau)}\overline m_{k,\tau}.}      \tag{4.6}
\]

If an exact estimate on an unbounded schedule gives

\[
 U_{\tau,k}\leq1-\eta,\qquad 0<\eta\leq1,             \tag{4.7}
\]

then Theorem 2.1 gives the genuine signed floor

\[
 B_A\succeq\eta hI.                                    \tag{4.8}
\]

**Proof.**  On `Y<tau`, use `(h+Y)^(-1)<=h^(-1)`; on
`Y>=tau`, use `(h+Y)^(-1)<=(h+tau)^(-1)`.  This proves (4.2).  On
the first window, `R>b-tau`, so

\[
 1_{[0,\tau)}(Y)\preceq\left({R\over b-\tau}\right)^k.
\]

For `0<=R<=b-tau`, the squared polynomial in (4.4) lies in `[0,1]`.
For `R>=b-tau`, its argument is at least one and its value is at least one.
It therefore also majorizes the dangerous-edge indicator.  Taking the pole
quadratic forms proves (4.5)--(4.6), and (4.8) follows from (2.10).
\(\square\)

The powers and squared Chebyshev filters in (4.5) are exact polynomials of
the compressed source-defined operator.  They can be reconstructed from
matrix products and the cross Gram (1.6); they are not real-axis eigenvalue
agreement and do not require cached spectral projectors.

## 5. No fixed finite moment list determines the odd sign

The next construction is an exact finite-dimensional logical obstruction.
It is not a model of the physical Xi--prolate matrix.

Fix `h>0`, `b>0`, an integer `k>=0`, and put

\[
 n=k+1,\qquad y_j={bj\over n},\quad 0\leq j\leq n,
 \qquad a={hn\over b}.                                 \tag{5.1}
\]

Define

\[
 S_n=\sum_{j=0}^n{\binom nj\over h+y_j},               \tag{5.2}
\]

\[
 \Delta_n=\sum_{j=0}^n
 {(-1)^j\binom nj\over h+y_j}
 ={n\over b}{n!\over a(a+1)\cdots(a+n)}>0.             \tag{5.3}
\]

The last identity follows from

\[
 \sum_{j=0}^n{(-1)^j\binom nj\over a+j}
 =\int_0^1t^{a-1}(1-t)^n\,dt
 ={n!\over a(a+1)\cdots(a+n)}.                         \tag{5.4}
\]

For any fixed `0<epsilon<1`, let `Y` be diagonal with diagonal entries
`y_0,...,y_n`, and choose pole vectors `p_+`, `p_-` whose squared
coordinates are

\[
 w_j^\pm={\binom nj\{1\pm\epsilon(-1)^j\}\over2S_n}.
                                                               \tag{5.5}
\]

Every weight is strictly positive.

### Theorem 5.1 (same finite moments, opposite load signs)

For every `0<=m<=k`,

\[
 \boxed{
 \langle p_+,Y^mp_+\rangle
 =\langle p_-,Y^mp_-\rangle.}                           \tag{5.6}
\]

The common zeroth moment is

\[
 \|p_+\|^2=\|p_-\|^2={2^{n-1}\over S_n}.              \tag{5.7}
\]

Nevertheless, for `M=hI+Y`, their exact loads are

\[
 \boxed{
 \mathcal L_\pm
 =2\langle p_\pm,M^{-1}p_\pm\rangle
 =1\pm\epsilon{\Delta_n\over S_n}.}                   \tag{5.8}
\]

Thus one model passes and the other fails despite agreement of all pole
moments through order `k`.

**Proof.**  The difference of the `m`th moments is proportional to

\[
 \sum_{j=0}^n(-1)^j\binom nj j^m,
\]

which is the `n`th finite difference of a polynomial of degree `m<n` and
therefore vanishes.  At `m=0` this also proves (5.7).  Substitution of
(5.5) into the resolvent quadratic and use of (5.2)--(5.3) gives (5.8).
\(\square\)

This theorem does not invalidate Sections 3--4: those sections retain an
exact positive remainder or an explicit edge-mass majorant.  It shows that
a fixed list of point moments, without such a remainder or localization
bound, cannot determine the true pass/fail orientation.

## 6. Matched-Fourier capture is necessary without compensation

For an integer `N>=1`, let `P_N` project onto the centered modes (1.11).
Equation (1.13) gives

\[
 \boxed{
 \|P_Np_-\|^2
 ={8\sinh^2(\ell/2)\over L}
 \sum_{n=1}^N{\omega_n^2\over(\omega_n^2+1/4)^2}.}     \tag{6.1}
\]

The omitted Fourier tail obeys

\[
 \|(I-P_N)p_-\|^2
 \leq{2L\sinh^2(\ell/2)\over\pi^2N}.                  \tag{6.2}
\]

Therefore

\[
\boxed{
 \|P_Np_-\|^2\geq B_{\lambda,N}:=
 {\lambda-\lambda^{-1}\over2}-\log\lambda
 -{\log\lambda\,(\lambda+\lambda^{-1}-2)
   \over\pi^2N}.}                                      \tag{6.3}
\]

Let `K` be any captured physical range in the odd finite space and put

\[
 \eta_{\rm pole}={\|P_{K^\perp}P_Np_-\|^2
                    \over\|P_Np_-\|^2}.                \tag{6.4}
\]

If the uncompensated capped comparison (2.1) passes, then (2.14) implies

\[
 \boxed{
 \eta_{\rm pole}
 <{q\over2\|P_Np_-\|^2}
 \leq{q\over2B_{\lambda,N}},}                         \tag{6.5}
\]

whenever `B_(lambda,N)>0`.

On the matched schedule `N=ceil(lambda^2)` and the fixed linear shift

\[
 q=(c-\beta)L=2(c-\beta)\log\lambda,
 \qquad c>\beta,                                       \tag{6.6}
\]

equation (6.3) gives

\[
 \boxed{
 {q\over2B_{\lambda,N}}
 \sim {2(c-\beta)\log\lambda\over\lambda}.}           \tag{6.7}
\]

Thus a separated-pole or uncompensated capped-base route must capture all
but an `O(log(lambda)/lambda)` squared fraction of the matched pole.  If the
full projected pole, whose squared norm is asymptotic to `lambda/2`, is
simply moved into a low block with a base bounded above by `q=O(log
lambda)`, then (2.14) fails eventually.  A retained positive excess must
instead satisfy the harmonic-short target (2.7), with the necessary aligned
size (2.15).  This is the precise sense in which adding the pole direction
does not make the signed problem disappear.

## 7. Full unprojected pole: exact pole--prime cancellation

This section concerns the full zero-extended function `p_-(x)=sinh(x/2)` on
`I_lambda`, not `P_Np_-`.  It supplies an arithmetic obstruction and must not
be reported as a finite projected-sector certificate without a separate
weighted form-tail estimate.

Put

\[
 X=\lambda^2,\qquad L=\log X=2\ell,
 \qquad
 \mu_\lambda=\|p_-\|^2
 ={\lambda-\lambda^{-1}-L\over2}.                       \tag{7.1}
\]

For `0<=a<=L`, its physical autocorrelation is

\[
\boxed{
 C_\lambda(a)
 =\int_{-\ell}^{\ell-a}p_-(x)p_-(x+a)\,dx
 =\sinh\!\left({L-a\over2}\right)
 -{L-a\over2}\cosh(a/2).}                              \tag{7.2}
\]

Plancherel gives

\[
 C_\lambda(a)=\int_{\mathbb R}
 |\widehat p_-(t)|^2\cos(at){dt\over2\pi}.             \tag{7.3}
\]

Consequently the negative odd pole plus the complete minus-prime block of
(1.3) is exactly

\[
 \mathcal P_\lambda
 =-2\mu_\lambda^2
 -2\sum_{1<n\leq X}{\Lambda(n)\over\sqrt n}
 C_\lambda(\log n).                                    \tag{7.4}
\]

Define the finite source quantities

\[
 \psi_C(X)=\sum_{1<n\leq X}\Lambda(n),
 \qquad A(X)=\sum_{1<n\leq X}{\Lambda(n)\over n},      \tag{7.5}
\]

\[
 B_0(X)=\sum_{1<n\leq X}\Lambda(n)\log(X/n),
 \qquad
 B_1(X)=\sum_{1<n\leq X}{\Lambda(n)\over n}\log(X/n).
                                                               \tag{7.6}
\]

### Theorem 7.1 (exact pole--prime identity)

With the inclusive endpoint and minus-prime sign retained,

\[
\boxed{
 \mathcal P_\lambda
 =-2\mu_\lambda^2-\lambda A(X)
 +{\psi_C(X)\over\lambda}
 +{B_0(X)+B_1(X)\over2}.}                              \tag{7.7}
\]

Put

\[
 E(t)=\psi_C(t)-t,
 \qquad \mathcal D(t)=A(t)-\log t,                     \tag{7.8}
\]

where both arithmetic functions are right-continuous.  Then the same finite
quantity is

\[
\boxed{
\begin{aligned}
 \mathcal P_\lambda={}&
 \lambda\{1-\mathcal D(X)\}+{E(X)\over\lambda}
 +{1\over2}\int_1^X{E(t)+\mathcal D(t)\over t}\,dt\\
 &-{L^2\over4}-{L\over\lambda}
 +{1\over2}-{1\over2X}.                                \tag{7.9}
\end{aligned}}
\]

**Proof.**  From (7.2), with `a=log n`,

\[
 {\Lambda(n)\over\sqrt n}C_\lambda(\log n)
 =\Lambda(n)\left\{
 {\lambda\over2n}-{1\over2\lambda}
 -{\log(X/n)\over4}\left(1+{1\over n}\right)
 \right\}.                                             \tag{7.10}
\]

Substitution into (7.4) proves (7.7).  Notice that an integer endpoint
`n=X` is retained, although its correlation weight vanishes.  Stieltjes
summation gives the exact identities

\[
 B_0(X)=\int_1^X{\psi_C(t)\over t}\,dt
 =X-1+\int_1^X{E(t)\over t}\,dt,                       \tag{7.11}
\]

\[
 B_1(X)=\int_1^X{A(t)\over t}\,dt
 ={L^2\over2}+\int_1^X{\mathcal D(t)\over t}\,dt.     \tag{7.12}
\]

Finally expand

\[
 -2\mu_\lambda^2
 =-{X\over2}+1-{1\over2X}
 +\lambda L-{L\over\lambda}-{L^2\over2},              \tag{7.13}
\]

and substitute `A(X)=L+mathcal D(X)` and
`psi_C(X)=X+E(X)`.  The `X/2` and `lambda*L` terms cancel exactly and give
(7.9).  \(\square\)

Equation (7.9) exhibits the unresolved signed arithmetic term

\[
 \boxed{{1\over2}\int_1^X{\psi_C(t)-t\over t}\,dt}    \tag{7.14}
\]

at the natural `sqrt(X)=lambda` pole-reserve scale.  The pinned Fiori--Kadiri--
Swidinsky estimate

\[
 {|\psi_C(t)-t|\over t}
 <9.22022(\log t)^{3/2}
 e^{-0.8476836\sqrt{\log t}},\qquad t>2,                \tag{7.15}
\]

is unconditional.  Integrating its right side supplies an explicit absolute
majorant, but that majorant is not `o(sqrt(X))`; it therefore does not prove
the bound needed for (7.14) at the pole-reserve scale.  This is a limitation
of the available upper estimate, not an assertion that the actual signed
integral has the size of that majorant.  Formally, the usual explicit-formula contribution
`-X^rho/rho` to `E(X)` produces `-X^rho/rho^2` in (7.14); this observation is
only a description of the Mellin obstruction and imports neither a zero
list nor a zero-reality assumption.

### 7.1 Exact archimedean scale

The Fourier transform used in the archimedean block is

\[
 \widehat p_-(t)
 ={2i\{t\sinh(\ell/2)\cos(t\ell)
 -(1/2)\cosh(\ell/2)\sin(t\ell)\}
 \over t^2+1/4}.                                       \tag{7.16}
\]

Let `psi_Gamma` denote the digamma function, distinct from `psi_C`, and put

\[
 \mathcal A_\lambda
 =\int_{\mathbb R}|\widehat p_-(t)|^2
 \left\{\operatorname {Re}\psi_\Gamma
       \!\left({1\over4}+{it\over2}\right)-\log\pi\right\}
 {dt\over2\pi}.                                        \tag{7.17}
\]

This is exactly the `2*theta'(t)` archimedean block.  Then

\[
 \boxed{
 \lim_{\lambda\to\infty}{\mathcal A_\lambda\over\lambda}
 =-{\gamma_E+2\log2+\log\pi\over2},}                  \tag{7.18}
\]

where `gamma_E` is Euler's constant.

**Proof sketch.**  Expanding (7.16), dividing by `lambda`, and using

\[
 {\sinh^2(\ell/2)\over\lambda},
 {\cosh^2(\ell/2)\over\lambda},
 {\sinh(\ell/2)\cosh(\ell/2)\over\lambda}
 \longrightarrow{1\over4},                             \tag{7.19}
\]

the nonoscillatory part converges to

\[
 {1\over2(t^2+1/4)}.
\]

The remaining sine and cosine terms tend to zero by the
Riemann--Lebesgue lemma.  The majorant
`C*log(2+|t|)/(t^2+1/4)` is integrable, so the passage is justified.
The Poisson formula in the half-plane to the right of the vertical line
`Re(z)=1/4` gives

\[
 \int_{\mathbb R}{
 \operatorname {Re}\psi_\Gamma(1/4+it/2)
 \over2\pi(t^2+1/4)}\,dt
 =\psi_\Gamma(1/2).                                     \tag{7.20}
\]

Finally `psi_Gamma(1/2)=-gamma_E-2*log(2)`, proving (7.18).
\(\square\)

### 7.2 Exact first Riesz mean and Mellin obstruction

Set

\[
 \boxed{
 F(X)=\int_1^X{\psi_C(t)-t\over t}\,dt
 =\sum_{1<n\leq X}\Lambda(n)\log(X/n)-X+1.}           \tag{7.21}
\]

The second equality is exact for every real `X>1`; inclusion of an endpoint
prime power does not create a jump because its new logarithmic weight is
zero.

Let the sum below run over all nontrivial zeta zeros `rho`, counted with
multiplicity.  No reality assumption is made.  Integrating the standard
von Mangoldt explicit formula once gives the absolutely convergent first
Riesz formula

\[
\boxed{
\begin{aligned}
 F(X)={}&-\sum_\rho{X^\rho-1\over\rho^2}
 -\log(2\pi)\log X\\
 &+{\pi^2\over24}-{1\over4}\operatorname {Li}_2(X^{-2}).
                                                               \tag{7.22}
\end{aligned}}
\]

Here `Li_2` is the dilogarithm.  The zero sum is absolutely convergent for
each fixed `X`: the zero-count bound gives
`sum_rho |rho|^(-2)<infinity`, while `0<Re(rho)<1`.  Formula (7.22) follows
equally from Perron inversion of
`-(zeta'/zeta)(s)*X^s/s^2`.  The residues at `s=1`, the nontrivial zeros,
and the trivial zeros give respectively `X`, the displayed zero sum, and

\[
 -{1\over2}\int_1^X\log(1-t^{-2}){dt\over t}
 ={\pi^2\over24}-{1\over4}\operatorname {Li}_2(X^{-2}).
\]

For `Re(s)>1`, direct Tonelli summation gives the exact Mellin transform

\[
\boxed{
 \int_1^\infty F(X)X^{-s-1}\,dX
 =-{1\over s^2}{\zeta'(s)\over\zeta(s)}
 -{1\over s(s-1)}.}                                    \tag{7.23}
\]

Indeed, reversing the order in (7.21) first contributes the factor `1/s`,
and

\[
 \int_1^\infty\psi_C(t)t^{-s-1}\,dt
 =-{1\over s}{\zeta'(s)\over\zeta(s)}.
\]

### Theorem 7.2 (the required little-oh estimate is false)

Unconditionally,

\[
 \boxed{F(X)\ne o(\sqrt X).}                            \tag{7.24}
\]

**Proof.**  Suppose first that a nontrivial zero `rho` has
`Re(rho)>1/2`.  If `F(X)=o(sqrt(X))`, then the integral on the left of
(7.23) converges absolutely and defines a holomorphic function throughout
`Re(s)>1/2`.  Equality on `Re(s)>1` would analytically continue the right
side there.  But `-(zeta'/zeta)(s)/s^2` has a nonremovable pole at `rho`,
while the rational term is regular.  This is a contradiction.

It remains to consider the case with no zero to the right of the critical
line.  Functional-equation symmetry then puts every nontrivial zero on
`Re(s)=1/2`.  Write `rho=1/2+i*gamma` and `u=log X`.  Absolute convergence
in (7.22) gives

\[
 {F(e^u)\over e^{u/2}}
 =-H(u)+o(1),
 \qquad
 H(u)=\sum_\rho{e^{i\gamma u}\over\rho^2}.             \tag{7.25}
\]

The series for `H` converges uniformly and is a uniformly almost-periodic
function.  It is not identically zero.  Existence of at least one critical-
line zero follows here from the HSW global zero-count theorem pinned in
`ZERO_SAMPLING_SOURCE_LOCK.json`: its main term minus error is positive for
all sufficiently large declared heights, so a nontrivial zero exists, and
the no-right-zero case plus functional-equation symmetry already places
every such zero on the critical line.  No finite-height line verification or
decimal zero list is used.

More explicitly, after grouping equal ordinates, ordinary exponential
orthogonality gives

\[
 \lim_{T\to\infty}{1\over T}\int_0^T|H(u)|^2du
 =\sum_{\gamma\ \mathrm{distinct}}
 \left|{m_\gamma\over(1/2+i\gamma)^2}\right|^2>0,      \tag{7.26}
\]

where `m_gamma` is the positive multiplicity.  If `F(X)=o(sqrt(X))`, then
(7.25) would force `H(u)->0`, making the left side of (7.26) zero.  This is
the second contradiction.  \(\square\)

Thus the prospective assumption formerly represented by a little-oh bound
for (7.14) is not merely unavailable from (7.15); it is false.  The first
Riesz mean contains a genuine square-root-scale oscillatory component.

### 7.3 RH-conditional oscillatory center, not a limit

The following formula describes the obstruction; it is not used as a
theorem input.  Conditional on RH, pair conjugate zeros in (7.25).  The
prime number theorem gives

\[
 A(X)-\log X\longrightarrow-\gamma_E,
 \qquad {\psi_C(X)-X\over X}\longrightarrow0,          \tag{7.27}
\]

and the integral of `mathcal D(t)/t` in (7.9), divided by `lambda`, tends to
zero.  Combining (7.9), (7.18), and (7.22) therefore gives

\[
\boxed{
 {\mathcal P_\lambda+\mathcal A_\lambda\over\lambda}
 =c_0-
 \operatorname {Re}\sum_{\substack{\rho=1/2+i\gamma\\\gamma>0}}
 {X^{i\gamma}\over(1/2+i\gamma)^2}+o(1),}             \tag{7.28}
\]

with multiplicities retained and

\[
 \boxed{
 c_0=1+{\gamma_E\over2}-\log(2\sqrt\pi)
 =0.0230957089661210338\ldots.}                         \tag{7.29}
\]

The series in (7.28) is absolutely and uniformly convergent, but it is a
nonconstant almost-periodic oscillation around the displayed center.
Consequently (7.28) is not convergence to `c_0`; in fact its oscillatory
main term has no limit.  No sign margin follows from the positive numerical
value of the center.

Even a pole-axis estimate would still leave the transverse harmonic short
and the finite-projection passage.  In particular, (7.7)--(7.29) concern the
unprojected `p_-`; replacing it by `P_Np_-` without bounding the weighted
form tail would mix the two cross-Gram conventions isolated in Section 1.

## 8. Consequences for the next proof attempt

The exact conclusions are as follows.

1. Enlarging the dangerous space by the residual pole removes the explicit
   pole from the transverse high compression, but its scalar signed Schur
   complement is positive exactly when the original load is below one.
2. A retained positive excess is potentially useful only through the
   harmonic short `1/<e,(M+A)^(-1)e>`, not merely through its spectrum or a
   pole-axis expectation.
3. The monotone hierarchy (3.2)--(3.6) and edge filters (4.3)--(4.6) provide
   finite, independently reconstructible sufficient targets.  An actual
   unbounded-schedule theorem may prove any one of them with a strict margin;
   no particular moment order is assumed here.
4. The countermodels in Section 5 rule out promoting a fixed finite list of
   moments to an exact sign characterization.
5. Without compensation, the matched physical range must capture the pole at
   the explicit squared-angle scale (6.5)--(6.7).
6. The full-pole calculation shows why a direct positive-excess estimate is
   delicate: the pole and minus-prime terms cancel at order `lambda^2`, and
   the remaining arithmetic term contains the smoothed Chebyshev error
   (7.14) at exactly the scale of the prospective reserve.

No estimate in this note verifies the physical pole capture, a filtered edge
mass, the retained positive-excess harmonic short, or the arithmetic error
on one common unbounded schedule.  The formal terminal state is
`P0_INVALIDATED`.
