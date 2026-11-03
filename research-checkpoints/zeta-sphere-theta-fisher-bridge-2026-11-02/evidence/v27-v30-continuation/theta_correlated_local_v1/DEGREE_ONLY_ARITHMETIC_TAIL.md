# Degree-only arithmetic tail cutoff from the actual positive prefix

Independently reviewed analytic PASS. This strengthens ARITHMETIC_CORE.md by removing actual polynomial coefficient ratios from the tail threshold. It does not remove those coefficients from the signed finite core.

Assume the actual known two-parity Grams G,Gx>0 through degree2N-1. As in GAUSS_ORBIT_COMPACT.md, the actual monic P_N has N positive roots x_l. Consequently
 L_N=P_N(-D²/4)^2=product_l(D²/4+x_l)^2=sum_even a_jD^j
has ALL a_j>=0. Put K=4N and
 W(S)=sum_j a_j(2S)^j=P_N(-S²)^2>0.
No next norm is used.

## 1. Keep the entire coefficient polynomial in the central lower bound

For S>=2K(9+2K), the reviewed derivative-polynomial estimate gives, for beta=5,7,9 and every even j<=K,
 (2/3)(2S)^j<=Q_j^beta(S)<=(4/3)(2S)^j.
Because a_j>=0, summation gives the SAME bounds with (2S)^j replaced by W(S). In particular the weaker bounds [W/2,3W/2] hold without a lower-coefficient budget.

For the single-orbit kernels A_f,C_f, the same positive central bracket argument therefore applies. If z=pi e^(2R)>=64pi and z>=K(9+2K), every central product is nonnegative, and its small central interval gives
 Central_C >= (4/3)e^-2 e^R z^(5/2)e^-2z W(2z)=: L_W(R). (1)
The A_f central mass is at least12z L_W. This uses W(S)>=W(2z), which is valid because all coefficients are nonnegative and S>=2z.

## 2. A termwise tail cost that cancels the same coefficient polynomial

Use the established derivative constants
 T_l=40(2l+7)^l[2(l+2)]^(l+2),
 M_j^f=40(2j+7)^j(j+3)^(j+3).
For each derivative order0<=j<=K let
 A_j=sum_(l=0)^j binom(j,l)T_l M_(j-l)^f.
The common envelopes give
 A_j<=B_K H_K^j,
 B_K=6400(K+2)²(K+3)³,
 H_K=(2K+7)(3K+7).                                 (2)
Indeed factor40², [2(K+2)]² and(K+3)³, then the binomial sum of [2(K+2)]^l(K+3)^(j-l) is(3K+7)^j.

Thus whenever4z>=H_K,
 sum_j a_j A_j <= B_K sum_j a_j H_K^j <=B_K W(2z).  (3)
This is where retaining the correlated positive coefficients removes the conditioning factor; replacing W by its leading monomial would lose it.

The noncentral absolute integral is bounded by
 2B_K W(2z) pi^(-3/4) Z^(-1/4)e^-Z/2,
 Z=pi e^(3R)=z^(3/2)/sqrt(pi).
Dividing by (1), the SAME W(2z) cancels exactly. For z>=64pi,
 Noncentral/L_W <=12 B_K e^-2z.                    (4)
The harmless additional factor pi^-1/8 z^-27/8 has been dropped, not reversed.

## 3. Explicit degree-only finite arithmetic core

Define
 z_K=max{64pi, K(9+2K), H_K/4, (1/2)log(24B_K)},
 k_K=ceil(z_K/pi).
For every R with pi e^(2R)>=z_K, both L_N C_f(R) and L_N A_f(R) are strictly positive, with L_N C_f>=L_W/2. The proof uses only the actual positive prefix, not the unknown next pivot or any auxiliary parent Gram.

Therefore the exact divisor expansion of C_N has a positive remainder after k<k_K, uniformly for all spatial r>=0. In particular the explicit cutoff is O(K²)=O(N²), with NO actual coefficient-conditioning constant in its location. The core itself still depends on all actual prefix coefficients.

For a concrete conservative integer bound valid for K=4N>=4, one may simply take z_K<=100K², hence k_K<=ceil(100K²/pi). To check the logarithmic term, B_K<=6400(3K/2)²(7K/4)³ for K>=4; its logarithm is far smaller than200K². The sharper displayed maximum should be used for actual estimates. This optional crude bound is only a size statement, not a useful numerical optimal cutoff.

## 4. What remains

The actual sufficient inequality is still the signed Laplace integral of this finite divisor core exceeding B_N/s, optionally strengthened by explicitly positive remainder terms. No individual core term or their sum is proved positive. This result removes one possible source of uncontrolled degree growth (the arithmetic-tail cutoff), but does not supply a uniform signed core estimate or original next-pivot positivity.
