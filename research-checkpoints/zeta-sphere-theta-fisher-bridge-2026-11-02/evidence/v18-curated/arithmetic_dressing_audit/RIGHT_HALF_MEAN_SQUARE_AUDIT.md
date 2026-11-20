# Right-half density-one convexity: independent audit

2 November 2026. Analytic PASS. This is a uniform-in-shift, density-one-in-height result for the specified finite Euler-box reference, not an all-height or two-sided bridge theorem.

For fixed prime support, the normalized off-diagonal exponential integral is at most 2/(T|log(p/q)|). Since max(p,q)<=Y, the logarithmic mean-value bound gives <=2Y/(T|p-q|). Applying 2|a_p a_q|<=|a_p|²+|a_q|² and summing both sides of each integer index gives exactly the conservative factor 4Y H_N/T. The diagonal sum is bounded by the convergent integer sum at sigma0>1/2.

The effective integer majorant I_k(q) is integral_1^infinity (log(2x))^k x^-q dx: on each interval [n-1,n], log n<=log(2x) and n^-q<=x^-q. Expanding the logarithm yields the stated finite factorial expression. This works even when the original summand is not monotone.

For the logarithmic derivatives, the denominator's m>=2 coefficients are m^(j-1), and the numerator's multiples m=N_p k have coefficient N_p^j k^(j-1)<=m^j. Their absolute sum is bounded by the two C-functions times p^-2sigma0; summing with logarithmic powers gives B_j. The separately differentiated linear factor contributes (j-1)!/T^j. Thus every higher prime power and finite-power correction is included uniformly in the fixed exponents; only the first-prime sum is treated by cancellation.

The L2 estimates M_j follow directly from the square triangle inequality. The simultaneous shift bound uses |L_j(sigma)|<=|L_j(sigma0)|+integral |L_(j+1)|, followed by Cauchy-Schwarz on an interval of length d. Squaring and averaging gives 2M_j+2d²M_(j+1), as stated. Markov/union bounds give 16U1/b0²+256U2/b0^4 exactly.

On the complement, b>=b0>0 ensures |Re L1|<=b/4 and Re L2>=-b²/16. Substitution into the exact curvature identity yields F''/F>=b²/8+T_g>0 throughout the full shift interval. With Y<=cT, the harmonic sum makes U_j=O(log T), and the exceptional fraction is O(1/log T). Truncating the measure bound at one is correct.

Quantifiers remain fixed sigma0 in (1/2,1), fixed c>0, prime support p<=Y<=cT and arbitrary fixed M_p>=1 for the height block. Constants are uniform in those exponent choices but not as sigma0 approaches 1/2. The interval sigma>=sigma0 lies on the right side only. Exceptional heights, the left-half derivative comparison, and the incompatible Euler-box versus product-cutoff modular remainder are unresolved. No full positive-definiteness or RH consequence follows.

## Added shrinking-gap corollary

Also reviewed and PASS: sigma0(T)=1/2+(log T)^(-kappa), fixed 0<kappa<1/5. The constants C_d remain uniformly bounded since r0<=2^-1/2<1. The exact integral majorants give I_k(1+2epsilon)=O(epsilon^(-k-1)); hence the four exceptional-measure powers are 5kappa-1, 6kappa-2, 7kappa-3, 8kappa-4. The first dominates for this range and is negative. Thus the displayed density-one result holds uniformly down to that shrinking right-hand gap. It still supplies no sign on the critical line, in the excluded gap, or at exceptional heights.
