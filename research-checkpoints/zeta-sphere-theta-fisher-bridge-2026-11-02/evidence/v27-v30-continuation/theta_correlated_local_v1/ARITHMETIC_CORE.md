# Exact divisor grouping and a paid finite arithmetic core

Independently reviewed analytic PASS. This uses actual theta arithmetic; it does not infer positivity of the remaining finite core.

Define the unreflected single-orbit profile for all real u,
 f(u)=4e^(u/2)(2z²-3z)e^-z, z=pi e^(2u).
It can be negative on part of the negative half-line. Do not replace it by an even or positive profile. Define its two midpoint kernels
 A_f(R)=integral f(R+w)f(R-w)dw,
 C_f(R)=integral w² f(R+w)f(R-w)dw.

## 1. Exact divisor formula

The nth original theta orbit is n^(-1/2)f(u+log n). For k>=1 let
 d(k)=number of positive divisors of k,
 ell_2(k)=sum_(n|k)[log(n²/k)]²>=0.
Then for every r>=0 the COMPLETE original midpoint kernel satisfies
 C(r)=sum_(k>=1) k^(-1/2)
  [d(k) C_f(r+(1/2)log k)+(ell_2(k)/4) A_f(r+(1/2)log k)]. (1)
For a pair n m=k, change variable w=v+(1/2)log(n/m). The product becomes even in w, so the odd cross term in v² integrates to zero, leaving C_f+(log(n/m)²/4)A_f. This is the source of the positive arithmetic coefficients, not a guessed independence approximation.

Absolute integrated convergence, including any fixed number of r derivatives, follows by the same single-orbit saddle/tail bounds below: the integrated absolute pair is polynomial-exponential in R times exp(-2pi exp(2R)), with lower-order tail terms. At R=r+(log k)/2, this is bounded by a polynomial in k and log k times exp(-c k), uniformly on compact r>=0. The divisor count and ell_2 are at most polynomial/logarithmic in k. Thus grouping and applying the fixed differential operator are legitimate. No finite-orbit approximation occurs in (1).

## 2. Explicit full-line single-orbit bounds

Retain K=4N, L_N=sum a_jD^j, a_K=4^(-2N), and S_* from PAID_NONCENTRAL_TAIL.md. Use its T_j unchanged for positive u. A valid global single-orbit bound is
 |f^(j)(u)|<=M_j^f:=40(2j+7)^j(j+3)^(j+3), all real u. (2)
Indeed write the two terms as pi^(-1/4)[8z^(9/4)-12z^(5/4)]e^-z. Their jth derivatives have the same Q_j^beta majorant with beta=9/2,5/2. On z<=1, bound the powers of z by1. On z>=1, bound by20(2j+7)^j z^(j+3)e^-z and then by20(2j+7)^j(j+3)^(j+3). The displayed40 is a harmless enlargement. No positivity of f is needed.

Put
 A_N^f=sum_j|a_j|sum_(l=0)^j binom(j,l)T_l M_(j-l)^f,
 z_N^f=max{64pi,S_*/2,(1/2)log(24 A_N^f/(a_K4^K))},
 R_N^f=(1/2)log(z_N^f/pi).
The noncentral argument of PAID_NONCENTRAL_TAIL applies to f with M_j replaced by M_j^f. For z=pi e^(2R)>=z_N^f it yields
 L_N C_f(R)>=L^+(R)/2>0,                            (3)
 L^+(R)=(4/3)e^-2 a_K4^K e^R z^(K+5/2)e^-2z.
To be explicit: use the exact same positive central one-pair product bracket, and pay the rest with |f^(j)| and the positive-argument tail estimate T_j. Nothing assumes that f is everywhere positive.

The SAME threshold gives
 L_N A_f(R)>0.                                     (4)
On the central interval |w|<=1/(2sqrt z), its mass lower bound is12z times L^+(R), since the w² factor is absent. On |w|>R/2, its absolute tail is bounded by the same E_N bound used for C_f: R>=log8 makes u=R+|w|>1, so 1<=u². Thus the previous paid tail is more than sufficient for (4).

## 3. A finite signed arithmetic core, valid at every r>=0

Let k_N=ceil(z_N^f/pi). Applying L_N to (1), every term with k>=k_N is nonnegative for EVERY r>=0, because pi k e^(2r)>=z_N^f and both arithmetic weights are nonnegative. Consequently
 C_N(r)>=sum_(1<=k<k_N) k^(-1/2)
 [d(k)L_N C_f(r+(log k)/2)+(ell_2(k)/4)L_N A_f(r+(log k)/2)] =: Core_N(r). (5)
The omitted arithmetic tail is strictly positive, not an uncontrolled truncation error. This includes r=0; no unknown contact sign entered its derivation.

Integrating (5) against the positive exponential kernel gives the actual sufficient original-pivot criterion
 8pi sqrt(s) integral_0^infinity Core_N(r)e^(-2sqrt(s)r)dr > B_N/s. (6)
The actual prefix polynomial and its inverse feedback are retained in L_N. All terms of the finite core are signed; they may not be replaced by absolute values or presumed positive. If useful, a finite number of positive tail terms may be added to strengthen the lower bound.

The degree-only part of z_N^f grows quadratically in K in the central threshold and as O(K log K) in the logarithmic tail constants. Actual coefficient ratios may enlarge it substantially and remain explicit. Hence no unconditional k_N=O(N²) or degree-uniform signed-core bound is asserted.

## 4. Scope and next concrete problem

This is a theta-specific reduction from an infinite signed orbit problem to a finite explicitly bounded arithmetic core with a proven positive remainder. It is stronger than positivity only at large spatial r. It does NOT show that Core_N has a positive compact integral or that (6) succeeds for growing degree. A uniform proof would need a signed estimate on this actual finite divisor-weighted core, with its true prefix coefficients. The divisor log-variance term must be kept; dropping it without its kernel sign would be invalid below the positive threshold.

No new finite ladder has been run, and no unknown next pivot or Lambda positivity is assumed.
