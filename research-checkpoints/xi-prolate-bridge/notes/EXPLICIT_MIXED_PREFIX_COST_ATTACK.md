# Explicit mixed-prefix cost attack

## 0. Claim boundary

This note removes the two non-elementary inputs from Section 6 of
`notes/EFFECTIVE_MIXED_PREFIX_SCHEDULE_ATTACK.md` for the standard full
log-Fourier target.  It proves an advance, lambda-only upper bound for the
terminal count of the corrected all-even prolate prefix when

\[
 N=\lceil\lambda^2\rceil .
\]

More generally, it gives an explicit bound in `lambda` and `N`.  The bound
is deliberately coarse: its leading displayed scale is
`lambda^18/(log(lambda))^3` on the stated diagonal.  It is a rigorous cost
bound for finite projected spanning, not a transition-scale estimate.

The result does not prove a signed physical floor, a prescribed
one-residue coframe, the residual--gap limit in equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, or the
Riemann hypothesis.  No zeta-zero list or global Weil-positivity assumption
is used.  The repository state remains `P0_INVALIDATED`.

All conventions below are those of the source-locked construction:

\[
 \lambda>1,\qquad
 \ell=\log\lambda,\qquad L=2\ell,
 \qquad c=2\pi\lambda^2,                              \tag{0.1}
\]

the source interval is `[-lambda,lambda]` with Lebesgue measure and zero
extension, and the physical interval is
`[lambda^(-1),lambda]` with measure `du/u`.  The centered Fourier functions
are

\[
 \phi_k(s)=(-1)^kL^{-1/2}e^{2\pi i k s/L},
 \qquad |k|\leq N.                                    \tag{0.2}
\]

Both inversion parities are retained.

## 1. An elementary lower bound for the ground prolate integral

Let

\[
 L_c=-{d\over dz}\left((1-z^2){d\over dz}\right)+c^2z^2
                                                               \tag{1.1}
\]

on `[-1,1]`, with the regular prolate endpoint condition.  Write `y_0` for
its positive, even, real ground state, normalized by

\[
 \int_{-1}^1y_0(z)^2\,dz=1,
 \qquad L_cy_0=\mu_0y_0.                              \tag{1.2}
\]

The constant trial function `2^(-1/2)` gives

\[
 \boxed{\mu_0\leq {c^2\over3}.}                       \tag{1.3}
\]

This is a form-domain min--max estimate; no stored prolate eigenvalue is
being used.

### 1.1 The maximum lies in the central interval

The regular endpoint limit of the differential equation at `z=1` is

\[
 2y_0'(1)+c^2y_0(1)=\mu_0y_0(1).
\]

The positive regular ground state has `y_0(1)>0`, so (1.3) implies

\[
 y_0'(1)={\mu_0-c^2\over2}y_0(1)
 \leq-{c^2\over3}y_0(1)<0.                            \tag{1.4}
\]

Evenness gives the corresponding inward increase at `z=-1`.  Thus a
global maximum is attained at an interior point `z_*`.  At that point,
`y_0'(z_*)=0` and `y_0''(z_*)<=0`.  Evaluating (1.1) there gives

\[
 \mu_0y_0(z_*)
 =-(1-z_*^2)y_0''(z_*)+c^2z_*^2y_0(z_*)
 \geq c^2z_*^2y_0(z_*).
\]

Consequently

\[
 \boxed{|z_*|\leq {1\over\sqrt3}<{2\over3}.}         \tag{1.5}
\]

The endpoint derivative in (1.4) matters: it rules out silently applying
the interior maximum equation at an endpoint.

### 1.2 A global supremum bound

The ground-state energy identity and (1.3) give

\[
 \int_{-1}^1(1-z^2)|y_0'(z)|^2\,dz\leq {c^2\over3}.
                                                               \tag{1.6}
\]

Since `1-z^2>=5/9` on `J=[-2/3,2/3]`,

\[
 \int_J|y_0'(z)|^2\,dz\leq {3c^2\over5}.             \tag{1.7}
\]

The interval `J` has length `4/3`, so some `z_0 in J` satisfies

\[
 |y_0(z_0)|\leq\sqrt{3\over4}={\sqrt3\over2}.
\]

Both `z_0` and the maximum point from (1.5) lie in `J`.  Cauchy--Schwarz
and (1.7) therefore yield

\[
 \boxed{
 \|y_0\|_\infty=y_0(z_*)
 \leq m_\lambda:={\sqrt3\over2}+{2c\over\sqrt5}
 = {\sqrt3\over2}+{4\pi\lambda^2\over\sqrt5}.}       \tag{1.8}
\]

Positivity and unit normalization now imply

\[
 1=\int_{-1}^1y_0^2
 \leq\|y_0\|_\infty\int_{-1}^1y_0,
\]

and hence

\[
 \boxed{
 \int_{-1}^1y_0(z)\,dz\geq {1\over m_\lambda}.}      \tag{1.9}
\]

### 1.3 Returning to the source normalization

For the pinned unit source mode `h_0`, the unitary rescaling is

\[
 y_0(z)=\sqrt\lambda\,h_0(\lambda z).
\]

Thus its source integral satisfies the completely explicit estimate

\[
 \boxed{
 I_0:=\int_{-\lambda}^{\lambda}h_0(x)\,dx
 =\sqrt\lambda\int_{-1}^1y_0(z)\,dz
 \geq {\sqrt\lambda\over m_\lambda}.}                \tag{1.10}
\]

For the locked rational half-integer values of `lambda`, Section 6 of the
effective-schedule note asks for a rational lower endpoint.  Put

\[
 r_\lambda=\lceil\sqrt\lambda\rceil,
 \qquad C_\lambda=1+{44\over7}\lambda^2,
 \qquad
 \underline\iota_\lambda={\lambda\over r_\lambda C_\lambda}.
                                                               \tag{1.11}
\]

This is a positive rational number.  The elementary inequalities

\[
 {\sqrt3\over2}<1,qquad {4\pi\over\sqrt5}<2\pi<{44\over7},
 \qquad {\lambda\over r_\lambda}\leq\sqrt\lambda
\]

show from (1.10) that

\[
 0<\underline\iota_\lambda\leq I_0.                  \tag{1.12}
\]

Moreover `r_lambda<=sqrt(lambda)+1<=2sqrt(lambda)`.  Therefore the
integral-correction factor in (6.2) of the effective-schedule note obeys

\[
\begin{aligned}
 \kappa_\lambda
 &=1+{\sqrt{2\lambda}\over\underline\iota_\lambda}\\
 &=1+{\sqrt2\,r_\lambda C_\lambda\over\sqrt\lambda}\\
 &\leq1+2\sqrt2\,C_\lambda
 <1+3C_\lambda
 =:\boxed{\Gamma_\lambda=4+{132\over7}\lambda^2}.
                                                               \tag{1.13}
\end{aligned}
\]

This replaces the source-provided numerical lower endpoint by a uniform
elementary one.  It is coarse but contains no unspecified constant.

## 2. Explicit variation of every log-Fourier Mobius lift

Let

\[
 X_N=\operatorname {span}\{\phi_k:|k|\leq N\},
 \qquad d=2N+1.                                       \tag{2.1}
\]

The decomposition

\[
 \phi_k\longmapsto(S_+\phi_k,S_-\phi_k)
\]

is a unitary identification of `X_N` with
`X_(N,+) direct-sum X_(N,-)`.  Hence these `d` vectors are a legitimate
orthonormal basis for the simultaneous two-parity map of Section 2 in the
effective-schedule note.  Their associated physical functions are simply
`g_k=phi_k`.

In the multiplicative coordinate `u=e^s`, define

\[
 q_k(u)={g_k(u)\over\sqrt u}
 ={(-1)^k\over\sqrt L}u^{-1/2+i\omega_k},
 \qquad
 \omega_k={2\pi k\over L},
 \qquad
 a_k=\sqrt{\omega_k^2+{1\over4}}.                    \tag{2.2}
\]

Then

\[
 |q_k(u)|={u^{-1/2}\over\sqrt L},
 \qquad
 |q_k'(u)|={a_k u^{-3/2}\over\sqrt L}.               \tag{2.3}
\]

Put `K=floor(lambda^2)`.  The finite elementary estimates

\[
 \sum_{n\leq K}{|\mu(n)|\over\sqrt n}\leq2\lambda,
 \qquad
 \sum_{n\leq K}|\mu(n)|\leq\lambda^2,
 \qquad
 \sum_{n\leq K}{|\mu(n)|\over n}
 \leq H_K\leq1+L                                    \tag{2.4}
\]

are sufficient.  They preserve the finite cutoff `n<=floor(lambda^2)`;
no integer in the finite Mobius convolution is dropped.

For the absolutely continuous line in (6.5), (2.3) gives

\[
\begin{aligned}
 \sum_{n\leq K}|\mu(n)|
 \int_{n/\lambda}^{\lambda}|q_k'(u)|\,du
 &= {2a_k\over\sqrt L}
 \sum_{n\leq K}|\mu(n)|
 \left(\sqrt{\lambda\over n}-{1\over\sqrt\lambda}\right)\\
 &\leq {4a_k\lambda^{3/2}\over\sqrt L}.             \tag{2.5}
\end{aligned}
\]

The outer endpoint line satisfies

\[
 \left(\sum_{n\leq K}|\mu(n)|\right)|q_k(\lambda)|
 \leq{\lambda^{3/2}\over\sqrt L}.                   \tag{2.6}
\]

Finally, with the exact finite quantity

\[
 J_k=\sum_{n\leq K}{\mu(n)\over n}
       \int_{n/\lambda}^{\lambda}q_k(u)\,du,
\]

one has

\[
 \left|\sum_{n\leq K}\mu(n)q_k(n/\lambda)\right|
 \leq{2\lambda^{3/2}\over\sqrt L},                 \tag{2.7}
\]

and

\[
 |J_k|
 \leq {2\sqrt\lambda\over\sqrt L}
       \sum_{n\leq K}{|\mu(n)|\over n}
 \leq {2\sqrt\lambda(1+L)\over\sqrt L}.            \tag{2.8}
\]

Substitution of (2.5)--(2.8) into the exact definition (6.5), including
its even-reflection factor `2sqrt(lambda)`, gives

\[
 \boxed{
 V_k\leq {\lambda^2\over\sqrt L}
          (8a_k+10+4L).}                              \tag{2.9}
\]

For `|k|<=N`,

\[
 a_k\leq {|\omega_k|}+{1\over2}
 \leq {2\pi N\over L}+{1\over2}.
\]

Define

\[
 B_{\lambda,N}={16\pi N\over L}+4L+14,
 \qquad
 \overline V_{\lambda,N}
 =\lambda^2\sqrt{d\over L}\,B_{\lambda,N}.          \tag{2.10}
\]

Taking the Euclidean sum over the full complex Fourier basis proves

\[
 \boxed{
 V_{\lambda,X_N}
 =\left(\sum_{|k|\leq N}V_k^2\right)^{1/2}
 \leq\overline V_{\lambda,N}.}                       \tag{2.11}
\]

Thus (2.11) simultaneously covers the inversion-even and inversion-odd
targets.  No parity family has been discarded.

## 3. Closed terminal count for general `N`

Use the same source-tail threshold as the effective-schedule note:

\[
 \delta_{\lambda,d}={1\over4\sqrt d\,\lambda}.       \tag{3.1}
\]

The right-inverse norm there satisfies

\[
 A_\lambda\leq\overline A_\lambda:=2\sqrt2\lambda^2.
                                                               \tag{3.2}
\]

Choose the completely explicit smoothing radius

\[
 \boxed{
 \rho_{\lambda,N}
 ={\delta_{\lambda,d}^2
   \over4\Gamma_\lambda^2\overline V_{\lambda,N}^2}
 ={L\over
   64\Gamma_\lambda^2\lambda^6d^2B_{\lambda,N}^2}.} \tag{3.3}
\]

It lies in `(0,1]`.  Indeed
`B_(lambda,N)>=4L+14>sqrt(L)`, while `lambda>1`, `d>=1`, and
`Gamma_lambda>=1`; these inequalities make the denominator in the last
fraction strictly larger than its numerator.

With the upper data from (1.13), (2.11), and (3.2), define

\[
\begin{aligned}
 \overline R_{\lambda,N}
 :={4\Gamma_\lambda^2\over\delta_{\lambda,d}^2}
 \left({\overline V_{\lambda,N}^2\over2\rho_{\lambda,N}}
       +c^2\overline A_\lambda^2\right).
                                                               \tag{3.4}
\end{aligned}
\]

Direct substitution, with no asymptotic notation, gives

\[
 \boxed{
 \overline R_{\lambda,N}
 ={2048\Gamma_\lambda^4\lambda^{12}d^4
          B_{\lambda,N}^4\over L^2}
  +2048\pi^2\Gamma_\lambda^2\lambda^{10}d.}          \tag{3.5}
\]

It follows from `sqrt(x+y)<=sqrt(x)+sqrt(y)` that

\[
 {\sqrt{\overline R_{\lambda,N}}\over2}
 \leq
 {16\sqrt2\Gamma_\lambda^2\lambda^6d^2
       B_{\lambda,N}^2\over L}
 +16\sqrt2\pi\Gamma_\lambda\lambda^5\sqrt d.        \tag{3.6}
\]

Therefore declare

\[
\boxed{
 \begin{aligned}
 \mathcal M(\lambda,N):=
 \left\lceil
 {16\sqrt2\Gamma_\lambda^2\lambda^6(2N+1)^2
       \over L}
 \left({16\pi N\over L}+4L+14\right)^2
 {}+16\sqrt2\pi\Gamma_\lambda\lambda^5\sqrt{2N+1}
 \right\rceil .                                      \tag{3.7}
 \end{aligned}}
\]

This is an explicit polynomial/polylogarithmic terminal-count majorant in
`lambda` and `N`.  Its only transcendental quantities are the source-fixed
`pi` and `log(lambda)`.

### 3.1 Verification against the exact stopping inequality

Let `V`, `A`, and `kappa` denote the exact quantities.  Equations (1.13),
(2.11), and (3.2) give

\[
 \kappa\leq\Gamma_\lambda,qquad
 V\leq\overline V_{\lambda,N},qquad
 A\leq\overline A_\lambda.                            \tag{3.8}
\]

By (3.3),

\[
 \kappa V\sqrt{\rho_{\lambda,N}}
 \leq{\delta_{\lambda,d}\over2}.                    \tag{3.9}
\]

Also `M=mathcal M(lambda,N)` satisfies

\[
 (2M+2)(2M+3)>4M^2\geq\overline R_{\lambda,N}.       \tag{3.10}
\]

Using (3.4) and (3.8) in (3.10) yields

\[
 \kappa
 \sqrt{{V^2/(2\rho_{\lambda,N})+c^2A^2
       \over(2M+2)(2M+3)}}
 \leq{\delta_{\lambda,d}\over2}.                    \tag{3.11}
\]

The source-tail estimate (6.14) of the effective-schedule note therefore
gives

\[
 \boxed{
 \|(I-P_{F_M})B\|\leq\delta_{\lambda,d}.}            \tag{3.12}
\]

Consequently the exact residual Gram satisfies

\[
 \operatorname {tr}E_M
 \leq d\delta_{\lambda,d}^2
 ={1\over16\lambda^2}
 <{1\over8\lambda^2}.                                \tag{3.13}
\]

Thus `M=mathcal M(lambda,N)` passes the strict source stopping criterion.
The largest dimensionless prolate index used by `F_M` is `2M`; if
"terminal label" means the mode index rather than the number of corrected
even columns, its bound is `2 mathcal M(lambda,N)`.

At this terminal count, the conclusions already proved in Section 5 of the
effective-schedule note apply, including

\[
 TP_{F_M}T^*\succeq {9\over128\lambda^4}I_{X_N}.      \tag{3.14}
\]

This is an unsigned simultaneous coframe estimate only.

## 4. A lambda-only diagonal

Set

\[
 N_\lambda=\lceil\lambda^2\rceil,
 \qquad d_\lambda=2N_\lambda+1.                      \tag{4.1}
\]

The direct lambda-only answer is already

\[
 \boxed{M_\lambda=\mathcal M
 (\lambda,\lceil\lambda^2\rceil).}                    \tag{4.2}
\]

For a simpler power/log display, the following inequalities hold for every
`lambda>1`:

\[
 N_\lambda\leq2\lambda^2,qquad
 d_\lambda\leq5\lambda^2,qquad
 \Gamma_\lambda\leq{160\over7}\lambda^2.            \tag{4.3}
\]

Also `L=2log(lambda)<=lambda`; hence `L^2<=lambda^2` and
`lambda^2/L>1`.  It follows that

\[
 B_{\lambda,N_\lambda}
 \leq(32\pi+18){\lambda^2\over L}.                   \tag{4.4}
\]

Substitution into (3.7) proves that the still simpler integer

\[
\boxed{
 \begin{aligned}
 \widehat M_\lambda:=\Bigg\lceil
 &400\sqrt2\left({160\over7}\right)^2
       (32\pi+18)^2{\lambda^{18}\over L^3}\\
 &+{2560\sqrt{10}\pi\over7}\lambda^8
 \Bigg\rceil
 \end{aligned}}                                      \tag{4.5}
\]

is an advance terminal-count bound:

\[
 \mathcal M(\lambda,N_\lambda)\leq\widehat M_\lambda.
                                                               \tag{4.6}
\]

Hence the full standard two-parity log-Fourier target with
`N=ceil(lambda^2)` is filled by the corrected all-even prolate prefix no
later than the even mode `2 widehat M_lambda`.

The degree eighteen in (4.5) is not presented as a natural cost law.  It is
the explicit price of four deliberately blunt steps: a universal ground
integral bound, absolute Mobius sums, `BV` box smoothing, and a Hilbert--
Schmidt trace stopping test.  The actual first successful prefix can be
much shorter.

## 5. What this does and does not unlock

The previous schedule theorem was total at each finite target but did not
bound its stopping label in advance.  Equations (3.7) and (4.5) close that
specific effectiveness gap for the standard target, using no numerical
prolate table and no unspecified finite-formula constant.

They do not address the remaining sign obstruction.  Once the mixed map is
onto the full finite physical target, the complete signed source quotient
is congruent to the signed physical operator and therefore preserves its
inertia.  A large unsigned coframe and an explicit polynomial-cost prefix
cannot replace the missing coupled signed estimate.  In particular,
(4.5) supplies neither equation (5.2) of `DIRECT_RH_ATTACK.md` nor an
asymptotic theorem about the Xi determinant.
