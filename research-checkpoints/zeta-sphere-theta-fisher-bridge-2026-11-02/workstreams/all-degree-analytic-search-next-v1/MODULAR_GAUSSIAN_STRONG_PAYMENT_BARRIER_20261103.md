# A Gaussian barrier to source-free modular strong payment

## Result and scope

The one-negative-direction modular reduction is exact, but its strong
next-pivot payment is not a consequence of positive pivots, uniform positive
log-curvature, and the local H3 inequalities alone.

For

\[
 \psi_c(h)=e^{-ch^2/2},\qquad c=20,
\]

every normalized endpoint pivot is positive and

\[
 X=c>17,\qquad P=24c^4>8X^4.                              \tag{1}
\]

Nevertheless the endpoint strong payment fails already at \(N=3\). The
failure is strict, so the positive finite prefix and the failure both persist
for all sufficiently small positive tilts \(a\).

This is an auxiliary Gaussian countermodel. It is not the complete theta
profile, does not refute the actual theta payment, and says nothing about the
remaining signed terms in the full modular conservation law. Its consequence
is narrower: a continuation based only on generic curvature and prefix
positivity cannot prove the strong payment at every rung.

## 1. Exact Gaussian ladder

Let \(H_n\) be the physicists' Hermite polynomial and put

\[
 P_n(x)=2^{-n}H_n(x).
\]

Then

\[
 P_{n+1}=xP_n-\frac n2P_{n-1},\qquad
 P_{n+1}'=(n+1)P_n.                                      \tag{2}
\]

For the normalized endpoint bridge,

\[
 b_n=\frac{nc}{2},\qquad
 F_n(h)=T_n(D)\psi_c(h)
       =(-1)^n c^{n/2}P_n(\sqrt c\,h)\psi_c(h),           \tag{3}
\]

and

\[
 \boxed{\sigma_n=
 \frac{\sqrt\pi\,n!\,c^{\,n-3/2}}{2^n}>0.}               \tag{4}
\]

Indeed \(\sigma_0=\sqrt\pi c^{-3/2}\), and (4) follows from
\(\sigma_n/\sigma_{n-1}=b_n\). Thus the endpoint prefix is positive at every
finite degree. Equation (2) also gives \(T_{n+1}'=(n+1)T_n\). The endpoint
reflection derivative has no perpendicular component, so

\[
 \boxed{\kappa_{n,0}=4n.}                                \tag{5}
\]

## 2. Exact half-line cost

Define

\[
 I_n=\int_{\mathbb R}P_n(x)^2e^{-x^2}dx
     =2^{-n}n!\sqrt\pi,
\qquad
 J_n=\int_0^\infty xP_n(x)^2e^{-x^2}dx.                  \tag{6}
\]

Changing variables \(x=\sqrt c h\) gives

\[
 \boxed{Q_{n,0}=c^{\,n-1}J_n.}                           \tag{7}
\]

Let \(\rho_n=I_n^{-1}P_n^2e^{-x^2}dx\) on the real line. Evenness gives
\(J_n=(I_n/2)\mathbb E_n|X|\). Therefore

\[
 \boxed{
 \frac{\sigma_{n+1}}{\sigma_n}=\frac{(n+1)c}{2},
 \qquad
 \frac{\kappa_{n,0}Q_{n,0}}{\sigma_n}
 =2n\sqrt c\,\mathbb E_n|X|.}                            \tag{8}
\]

The next-pivot ratio is \(O(n)\). The modular cost is at least a fixed
positive multiple of \(n^{3/2}\).

## 3. Exact failure at \(N=3\)

Here

\[
 P_3(x)=x^3-\frac32x,\qquad
 J_3=\int_0^\infty
 \left(x^7-3x^5+\frac94x^3\right)e^{-x^2}dx
 =\frac98.                                               \tag{9}
\]

Equations (4)--(7) give

\[
 \kappa_{3,0}Q_{3,0}=\frac{27}{2}c^2,\qquad
 \sigma_4=\frac32\sqrt\pi\,c^{5/2}.                      \tag{10}
\]

Hence \(\sigma_4\geq\kappa_{3,0}Q_{3,0}\) is equivalent to

\[
 \sqrt{\pi c}\geq9.                                      \tag{11}
\]

For \(c=20\), the elementary bound \(\pi<4\) gives
\(20\pi<80<81\), so (11) fails strictly.

All endpoint pivots through degree four are positive by (4). For each fixed
degree the divided pivots, coefficients, reflection coefficient, and
half-line mass extend continuously to \(a=0\). Thus there is an
\(\epsilon>0\) such that the finite positive prefix persists and the strong
payment still fails for \(0<a<\epsilon\).

## 4. A reproducible \(N=400\) lower-cost certificate

The Hermite recurrence gives

\[
 \mathbb E_nX^2=n+\frac12,\qquad
 \mathbb E_nX^4=\frac34(2n^2+2n+1).                      \tag{12}
\]

Interpolation of \(L^2\) between \(L^1\) and \(L^4\) gives

\[
 \mathbb E_n|X|
 \geq
 \frac{(n+1/2)^{3/2}}
 {\sqrt{(3/4)(2n^2+2n+1)}}.                              \tag{13}
\]

Combining (8) and (13), strict failure follows from

\[
 8n^2(2n+1)^3>
 3c(n+1)^2(2n^2+2n+1).                                  \tag{14}
\]

For \(c=20,n=400\), the exact difference between the sides is

\[
 \boxed{654725565983940>0.}                              \tag{15}
\]

Moreover,

\[
 \frac{\kappa_{n,0}Q_{n,0}}{\sigma_n}
 \geq
 2\sqrt{\frac{2c}{3}}\,n^{3/2}(1+o(1)),
\qquad
 \frac{\sigma_{n+1}}{\sigma_n}
 =\frac c2 n+O(1).                                      \tag{16}
\]

Thus the order mismatch is rigorous. The exact \(N=3\) calculation is
already the sharper countermodel for \(c=20\); (15) reproduces the separately
reported \(N=400\) warning.

## Consequence for the theta search

The Gaussian satisfies more than the coarse cubic hypotheses in (1), yet its
strong payment fails. Therefore neither uniform log-curvature, the local H3
determinant bound, positive endpoint pivots, nor their combination can close
the general modular ladder.

The actual theta \(N=2\) target remains the correlated domination

\[
 \det\begin{pmatrix}m_{11}&m_{13}\\m_{13}&m_{33}\end{pmatrix}
 \geq m_{11}\kappa_0Q_{2,0}^-,
\]

using the complete-theta residual and arithmetic. A proof must retain that
source-specific correlation (or use the full conservation law); replacing it
by a generic curvature theorem is blocked by this Gaussian family.

## Reproduction

Run the companion verifier as follows:

    python3 workstreams/all-degree-analytic-search-next-v1/src/verify_modular_gaussian_strong_payment_barrier_20261103.py \
      --root . \
      --output workstreams/all-degree-analytic-search-next-v1/results/modular_gaussian_strong_payment_barrier_20261103.json

It checks the Hermite recurrences, Gaussian norms, exact \(N=3\) integral,
oscillator moments, interpolation reduction, and (15). It performs no degree
sweep and makes no theta or RH claim.
