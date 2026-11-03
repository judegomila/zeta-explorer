# Finite polynomial positivity from verified zeros and the complete theta tail

Status: the 10^10-degree version was independently audited. The 3·10^10-degree strengthening has passed a separate critical audit, including an independent replay of the theta core intervals, an independent analytic audit of the uniform envelope, and exact tail arithmetic. The published finite-height zero verification is used as a cited theorem, not independently recomputed. The result uses the published rigorous finite-height zero verification of Platt and Trudgian, https://arxiv.org/abs/2004.09765, and the independently certified theta core and uniform envelope. It is a finite-degree theorem, not RH or all-degree positivity.

## Claim

For every nonzero real polynomial p with deg p<=3·10^10 and every a∈[0,1/2],

∫_R p(t)^2 Λ_a(t)dt
 > [0.00172−e^(−2·10^11)] ∫_{−4}^4 p(t)^2dt >0.       (1)

At a=0 use the normalized continuous limit. The integral exists by the uniform exponential tail. For a complex polynomial, the same estimate holds with |p|² by applying (1) separately to its real and imaginary parts. No prior positive prefix, inverse-selected polynomial, or unavailable individual zero list is assumed.

## Nonnegative verified-height middle

Platt–Trudgian verified that every nontrivial ζ zero with 0<|γ|<=3·10^12 lies on the critical line; negative ordinates follow by conjugation. There are no γ=0 zeros since ξ is positive on the real axis by its positive theta integral. Set H=2.9·10^12. The exact zero-pair formula in SHARP_ZERO_PAIR_HALO.md says every possible negative contribution at fixed a>0 must come from a zero β>1/2+a whose ordinate is within 1/2 of t. No such zero exists for |t|<=H. Hence Λ_a(t)>=0 throughout [−H,H]. At ξ zeros on the evaluation line the completed expression is zero; at a=0 take the pointwise limit.

The independent theta interval certificate in CENTRAL_RESERVE_COMPLEMENT.md gives Λ_a(t)>0.00172 on [−4,4], uniformly for 0<=a<=1/2. Therefore the integral over [−H,H] is at least 0.00172∫_{−4}^4p².

## Uniform explicit tail for all degrees in the band

EXPLICIT_SELECTED_COMPLEMENT_TAIL.md established the shift-uniform envelope

|Λ_a(t)|<=4100(1+|t|)^8 e^(−c|t|),  c=π/4>3/4.     (2)

Let n=deg p. The Legendre Christoffel bound on [−4,4] gives

sup_{|t|<=4}|p(t)|² <= (n+1)²/8 ∫_{−4}^4p².

Chebyshev growth implies, for |t|>=4,

|p(t)|² <= [(n+1)²/8][2(1+|t|)]^(2n)∫_{−4}^4p².

Since H>=2(2n+8)/c throughout the asserted range, the logarithmic derivative of (1+t)^(2n+8)e^(−ct) is at most −c/2 for t>=H. Integrating both tails yields

∫_{|t|>H}p²|Λ_a| <= E_n ∫_{−4}^4p²,
E_n=(2050/c)(n+1)²4^n(1+H)^(2n+8)e^(−cH).         (3)

For 0<=n<=3·10^10,

2050/c<10^4,  (n+1)²<10^22,  4^n<=10^n,  1+H<10^13,

so E_n<10^(27n+130)e^(−0.75H). Using log 10<2.4, the exponent is at most

(27·3·10^10+130)·2.4−0.75·2.9·10^12
 = −230999999688 < −2·10^11.

Thus E_n<e^(−2·10^11), proving (1). The same proof with H=10^12 and n<=10^10, giving the weaker e^(−10^11) tail bound, has already been independently audited. The 30-billion strengthening uses the same argument with the above displayed numerical choices and has also passed a separate critical review of all stated dependencies.

## Scope

This is a deterministic consequence of a published finite-height verification plus the explicitly certified theta bounds; it is not an all-degree argument. It gives strict positivity of every signed polynomial Gram through the stated degree at each shift in the stated range, hence the corresponding finite collection of selected pivots. No numerical computation of those enormous matrices is claimed. It does not imply positivity beyond the finite degree threshold or settle RH.
