# A core-paid far-frequency tail for the actual selected residual

This is a noncircular, all-degree bound on part of the actual signed complement, not a proof of the next pivot. The compact middle complement remains signed. Fix 0<a<1/2 and assume only that the actual degree<n signed prefix is positive. Let p_n be its selected monic polynomial, J_n its known Jacobi matrix, and Z_n=||J_n|| the largest absolute root of p_n. No target pivot is used.

## Completely explicit theta envelope

The grouped arithmetic representation gives H=Σh_j with

|H|<=ζ(2)/12<0.14,
|H'|<=ζ(2)/6<0.28,

uniformly on 1/2<=Re s<=1: for the second use log(j+1)<=2√j. Let ξ=KP, K=s(s+1)π^(−s/2)Γ(s/2)/4, P=1+2s(s−1)H.

Rotating Euler's gamma integral by ±π/4 gives, for Re s∈[1/2,1],

|Γ(s/2)|<=6e^(−π|t|/8),
|Γ'(s/2)|<=30e^(−π|t|/8).

For example, the integral of r^(x−1)e^(−r/√2) over (0,1) is <=4 and over (1,∞) is <=√2; the logarithmic integral is bounded by 16+π+2+π√2/4<30. Consequently

|K|<=3(1+|t|)²e^(−π|t|/8),
|K'|<=14(1+|t|)²e^(−π|t|/8),
|P|<=1.3(1+|t|)²,  |P'|<=1.2(1+|t|)²,
|ξ|<=4(1+|t|)^4e^(−π|t|/8),
|ξ'|<=22(1+|t|)^4e^(−π|t|/8).

Therefore the original normalized bridge satisfies the explicit bound

|Λ_a(t)| <= (400/a)(1+|t|)^8e^(−π|t|/4).                (1)

This is valid for each a>0; it is not uniform as a→0. The elementary envelope constants and the far-tail reduction have been independently audited.

## Pay the far tail from the certified positive core

The independently certified core bound is Λ_a(t)>m0=0.00172 for |t|<=r0=4.3. The monic Legendre minimum gives

∫_{|t|<=r0}p_n²Λ_a dt >= S_n,
S_n=2m0 r0^(2n+1)/[(2n+1)(2^(−n)binom(2n,n))²].      (2)

Since all selected roots lie in [−Z_n,Z_n],

|p_n(t)|² <= (1+Z_n)^(2n)(1+|t|)^(2n).

Take c=π/4, C=400/a, B=8. Select the smallest integer R satisfying

R>=max(r0,1,2(2n+B)/c),
(4C/c)(1+Z_n)^(2n)(1+R)^(2n+B)e^(−cR) <= S_n/2.      (3)

The left side tends to zero, and for R in this range the integrand's logarithmic derivative is <=−c/2. Thus

∫_{|t|>R} p_n²|Λ_a|dt <= S_n/2,                         (4)
L_a[p_n²] >= S_n/2 + ∫_{r0<|t|<=R}p_n²Λ_a dt.           (5)

Every quantity defining R is known from the positive prefix or explicit constants, and the rule works for any fixed n,a. Formula (5) gives a rigorous finite-window signed problem; it does not show its right side is positive. A cutoff valid without explicitly solving for roots can use the independently audited Z_n<=sqrt[(D nlog(n+2))²+η_n]/sqrt(δ_n), where δ_n is the actual absolute-parent prefix gap. The resulting R has O_a(n[log(n+2)+log(1/δ_n)]) growth for large n, with constants depending on the explicit gamma-envelope/local-tail bounds. No such asymptotic is asserted uniformly in a.

The reduction preserves the same actual selected polynomial throughout. It does not bound the remaining compact middle complement, does not assert a sign for any summand, and does not prove a new pivot or RH.

## Uniform-in-shift envelope (independently audited)

The factor 1/a in (1) can be avoided by the critical-line cancellation q_0(t)=0. One more derivative in the rotated gamma integral gives |Γ''(s/2)|<=170e^(−π|t|/8). The near-zero logarithmic-square integral is 128+8π+π²/4 and the remaining tail contributes <10. The cell bound |H''|<1 follows from log²(j+1)<=4j and ζ(3/2)<3. Elementary product estimates give

|K''|<=63(1+|t|)²e^(−π|t|/8),
|P''|<=4.8(1+|t|)²,
|ξ''|<=130(1+|t|)^4e^(−π|t|/8).

Since ∂_a q_a=Re(ξ''conj ξ)+|ξ'|² and q_0=0, the already explicit ξ, ξ' bounds yield

|Λ_a(t)|<=4100(1+|t|)^8e^(−π|t|/4), 0<=a<=1/2.       (6)

At a=0 this uses the normalized continuous limit. Equation (6) allows C=4100 in the tail rule (3), independently of the shift. The prefix gap and selected polynomial still depend on a, and the compact middle integral remains uncontrolled.

## A closed cutoff without search

The following direct cutoff has been independently audited. Put k=2n+8, c=π/4, C=4100. Since log x<=(c/(2k))x+log(2k/c)−1 for x>0, every R at least

max {4.3, 1, 2k/c,
 (2/c)[log(8C/(c S_n))+2n log(1+Z_n)+c/2+k(log(2k/c)−1)]}

satisfies (3), with the uniform envelope. Taking the ceiling gives an integer cutoff if desired. It is conservative but uses only explicitly known prefix-root data and constants.
