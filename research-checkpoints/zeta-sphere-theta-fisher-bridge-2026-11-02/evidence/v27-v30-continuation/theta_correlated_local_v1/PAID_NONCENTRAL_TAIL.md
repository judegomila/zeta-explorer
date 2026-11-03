# Explicit payment of the noncentral complete-theta tail

Independently reviewed analytic PASS, including optional Section5. Conventions and central-orbit bound are as in THETA_TAIL_AND_SCALE.md; that frozen file is not changed.

Let N>=1, K=4N, and L_N=P_N(-D²/4)^2=sum a_k D^k, with even k only and a_K=4^(-2N). Choose S_* >=2K(9+2K) such that sum_(k<K)|a_k|/a_K (2S_*)^(k-K)<=1/8. All coefficients are the actual known prefix coefficients, with no unknown next pivot.

Define, for integers j>=0,
 M_j=192 (j+1)! 3^j,
 T_j=40 (2j+7)^j [2(j+2)]^(j+2),
 A_N=sum_k |a_k| sum_(j=0)^k binom(k,j) T_j M_(k-j).
These are explicit positive constants depending on degree and actual coefficients.

## 1. Full profile derivative bounds

The previously audited strip bound is ||psi^(j)||_2<=64 j! (8/3)^j. The full-line one-dimensional inequality ||f||_infinity²<=||f||_2||f'||_2 therefore gives
 |psi^(j)(u)|<=M_j, all real u.                       (1)
The inflated M_j above dominates the resulting constant for every j.

For u>=0, z0=pi e^(2u)>=pi, the original full-theta series and its exact derivative recurrence give
 |psi^(j)(u)|<=T_j e^(u/2) exp(-z0/2).               (2)
Indeed each orbit summand is (8 z_n²-12z_n)e^(u/2)e^(-z_n). Its two powers have exponents9/2 and5/2 in u. The recurrence majorant from the preceding note yields
 |D^j[e^(beta u-z_n)]|<=e^(beta u-z_n)(2z_n+beta+2j)^j.
Since z_n>=1 and beta<=9/2 this is bounded by (2j+7)^j z_n^j times the undifferentiated magnitude. Thus the full sum is <=20(2j+7)^j e^(u/2) sum_n z_n^(j+2)e^(-z_n).
For p=j+2, t^p e^(-t/2)<=(2p)^p and
 sum_n e^(-z0 n²/2)<=e^(-z0/2)/(1-e^(-3z0/2))<=2e^(-z0/2).
This proves (2) without truncating any orbit.

## 2. Noncentral integral, with degree dependence retained

Write z=pi e^(2r), Z=pi e^(3r), r>=0. On v>=r/2, the first theta argument u=r+v is >=3r/2 and the other is arbitrary. Leibniz, (1)-(2), and symmetry v->-v give
 |integral_(|v|>r/2) v² L_N[psi(r+v)psi(r-v)]dv|
 <=2 A_N integral_(3r/2)^infinity u² e^(u/2) exp(-pi e^(2u)/2)du
 <=2 A_N pi^(-3/4) Z^(-1/4) exp(-Z/2) =: E_N(r).    (3)
For the second step, u²<=e^u for u>=0, followed by t=pi e^(2u), gives an integral of t^(-1/4)e^(-t/2)/(2pi^(3/4)); bound t^(-1/4) by Z^(-1/4) and integrate the exponential exactly.

## 3. Positive central mass and explicit complete-tail threshold

Suppose z>=64pi and 2z>=S_*. Then the central conditions from the reviewed note hold: pi e^r=sqrt(pi z)>=9. Every orbit-pair contribution to the central integral is nonnegative.

Retain just n=m=1 and |v|<=1/(2sqrt(z)), which lies in |v|<=r/2 under these assumptions. Here T=z² and 2z<=S=2z cosh(2v)<=2z+2. The reviewed central bracket obeys
 32T²-144TS+72T >=16z^4, since z>=19.
Consequently the entire central integral is at least
 L_N^+(r)=(4/3)e^(-2) a_K 4^K e^r z^(K+5/2)e^(-2z). (4)
The factor comes from integral_(-1/(2sqrt z))^(1/(2sqrt z)) v²dv=1/(12z^(3/2)). This is positive mass, not an assumed contact value.

Combining (3)-(4) and using Z=z^(3/2)/sqrt(pi),
 E_N/L_N^+ <=(3/2)e² [A_N/(a_K4^K)] pi^(-1/8)
                z^(-K-27/8) exp(2z-Z/2)
             <=12 [A_N/(a_K4^K)] exp(-2z),           (5)
where z>=64pi implies Z/2>=4z and z>=1.

Define the fully explicit threshold
 z_N=max{64pi, S_*/2, (1/2)log(24 A_N/(a_K4^K))},
 R_N=(1/2)log(z_N/pi).
For EVERY r>=R_N, (5) is <=1/2. Therefore the complete, untruncated signed field satisfies
 C_N(r)>=L_N^+(r)/2>0.                              (6)
This is a full-tail statement, not just a central-orbit statement. Its constants retain all degree and actual prefix-coefficient dependence. No next norm, positivity of Lambda, or parent-to-target replacement was used.

## 4. Consequence and exact remaining debt

For every s>0, the correlated mean has the noncircular localized estimate
 4pi E[C_N(R_s)] >=8pi sqrt(s) integral_0^R_N C_N(r)e^(-2sqrt(s)r)dr
                    +4pi sqrt(s) integral_R_N^infinity L_N^+(r)e^(-2sqrt(s)r)dr. (7)
Here R_s is exponential with rate2sqrt(s), and the second term is explicitly positive. A sufficient original-pivot certificate is that this right side exceed B_N/s from ADAPTIVE_RESOLVENT.md.

The signed compact integral remains unpaid. Since the positivity onset moves outward with degree whereas large s localizes the mean near zero, the new positive tail is not by itself a substitute for that integral. The benefit is removal of an absolute-value tail debt with explicit growing-degree constants, not a claim of closure.

## 5. Fully explicit coefficient envelope (optional, coarser)

Let Acoef=sum_(k<K)|a_k|/a_K. Since only even k occur and K-k>=2, a valid noniterative choice is
 S_*=max{2K(9+2K), sqrt(2Acoef)}.
Indeed 2S_*>=1 and the lower-coefficient sum is at most Acoef/(2S_*)²<=1/8.
Also, writing ||a||_1=sum_k|a_k|, the explicit convolution constant obeys
 A_N<=7680 ||a||_1 (K+1)! 6^K (2K+7)^K [2(K+2)]^(K+2). (8)
This uses the monotonic envelopes for M_j,T_j over0<=j<=K and sum_j binom(k,j)<=2^K.
Thus log A_N=O(K log(K+2))+log ||a||_1 with explicit displayed constants. The full threshold retains a potentially large coefficient contribution through Acoef and ||a||_1; no degree-uniform conditioning or growth bound for those actual prefix coefficients is inferred. If those quantities are controlled, the formulas make the resulting r-threshold quantitative rather than hiding it in a fixed-N big-O.
