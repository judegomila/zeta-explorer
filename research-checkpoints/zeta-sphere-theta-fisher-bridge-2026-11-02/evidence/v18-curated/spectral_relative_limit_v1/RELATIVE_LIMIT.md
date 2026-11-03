# Exact large-degree limit of the actual relative-core cost

Analytic derivation independently reviewed and passed. No positivity of the actual tail Fourier density is assumed without stating it.

## Definitions and exponential moments
Let psi be the full even theta profile, and fix H>0. Define

C_H(v)=int_0^H 2h² psi(h−v)psi(h+v)dh,
T_H(v)=int_H^infty 2h² psi(h−v)psi(h+v)dh,
F=C_H+T_H.

Use Fourier transform fhat(t)=int_R exp(−itv)f(v)dv. Write c(t),tau(t),f(t) for these three transforms. They are real and even.

For every b<pi/4, the full theta series and its modular evenness give an integrable bound on psi(u) for |Im u|<=b: after replacing Re u by its absolute value using psi(−u)=psi(u), its decay is a polynomial exponential times exp(−pi cos(2b) exp(2|Re u|)). Thus the products above have integrable contour shifts v→v±ib, also after integration in h and multiplication by h². Consequently

|c(t)|+|tau(t)|+|f(t)| <=K_b exp(−b|t|)

for a finite constant K_b. In particular these signed densities have some absolute exponential moment. Positive Fourier-normalization constants do not affect any quotient below.

## Polynomial density lemma
If a finite positive measure nu on R has int exp(b|t|)dnu<infinity for some b>0, polynomials are dense in L²(nu). Proof: if g is orthogonal to every polynomial, its signed/complex measure g dnu has an exponential moment at every rate<b/2 by Cauchy–Schwarz. Its Fourier-Laplace transform is analytic on a strip and all derivatives at0 vanish. It is therefore identically zero, and Fourier uniqueness gives g=0 nu-almost everywhere.

If nu is even, symmetrization gives density of even polynomials in the even subspace and odd polynomials in the odd subspace.

## Conditional spectral formula for epsilon_J
Assume now that the **actual tail density tau is nonnegative almost everywhere** and is not identically zero. Let C_J,T_J be the nested polynomial moment forms, in either parity. Then T_J is positive definite: a nonzero polynomial cannot vanish on the positive-measure set where tau>0.

Define epsilon_J=max(0,sup_(p in degree-J space, p!=0) −int |p|² c / int |p|² tau). The sequence is nondecreasing. Its limit is

epsilon_infinity = max(0, ess sup_(tau>0) (−c/tau)),

with value infinity if c<0 on a positive-measure subset where tau=0. Essential supremum may be taken with respect to Lebesgue measure on tau>0 or tau(t)dt.

Proof of the nontrivial direction: choose a bounded measurable test function supported in a finite-measure region where the quotient exceeds any proposed smaller bound. Approximate it in L²(nu), nu=(|c|+tau)dt, by polynomials. Their quadratic integrals against c and tau converge because |p_n²−g²| is controlled in L¹(nu) by Cauchy–Schwarz. This transfers the test-function quotient to polynomial quotients. Even/odd parity gives the same limit by selecting symmetric support and respectively even or odd test functions; the singleton t=0 has zero measure.

Equivalently, epsilon_infinity is the smallest nonnegative epsilon for which c+epsilon tau>=0 almost everywhere. The relative finite-matrix problem is therefore not independent of the global spectral comparison.

## Tail positivity itself has the same determinacy barrier
Without assuming tau>=0, if every finite polynomial moment matrix of tau is positive semidefinite, the same approximation argument with nu=|tau|dt forces tau>=0 almost everywhere. Conversely tau>=0 immediately gives all finite moment matrices PSD (and PD unless the density vanishes almost everywhere). The argument works separately within either parity because tau is even.

Thus a negative open spectral interval is a genuine finite-order obstruction, even if it occurs at a degree beyond current computation. Stable positive matrices throughsize16 do not rule it out.

## The exact total density and the missing denominator bound
Let Psi(s)=int_R exp(−isu)psi(u)du. A change of variables x=h−v,y=h+v in the full kernel gives

f(t)=(1/4)[Psi'(t/2)²−Psi(t/2)Psi''(t/2)].

Indeed evenness replaces int_0^infty2h² by int_R h²; the Jacobian is1/2, and h²=(x+y)²/4. This normalization uses Psi directly, so no convention for the Riemann Xi normalization is needed.

Since tau=f−c, the relative comparison is c+epsilon tau=(1−epsilon)c+epsilon f. If c<0, proving a fixed epsilon<1 requires a lower bound on f relative to −c. A contour-shift absolute estimate |c(t)|<=K_b exp(−b|t|) alone cannot supply that lower bound: it controls neither zeros nor near-cancellation of the exact Laguerre expression defining f. Isolated certified positive spectral windows establish local reserves, not a global denominator estimate.

There is also an important distinction between finite positivity and uniform coercivity. If f>=0 and tau>=0, each finite full moment matrix can be positive definite even when ess inf f/tau=0. In that case epsilon_J<1 for every finite J may hold while epsilon_J increases to1. Therefore seeking a single degree-independent epsilon<1 is sufficient but stronger than the all-finite-degree positivity target.

As a conditional example, if Psi has a multiple real zero s0 and c(2s0)<0, then f(2s0)=0 and tau(2s0)>0; by continuity the essential supremum of −c/tau is at least1. This does not assert existence of such a zero. It shows why an argument demanding a uniform gap must not silently assume simplicity or a uniform lower Laguerre reserve.

## Outcome
The numerical growth of epsilon_J toward a small value is not an asymptotic bound. A rigorous uniform relative-core estimate is precisely a global spectral density comparison; a finite-degree strategy may instead allow epsilon_J→1 while controlling each conditional Schur deficit. Neither comparison nor such an all-degree deficit bound has been established here.
