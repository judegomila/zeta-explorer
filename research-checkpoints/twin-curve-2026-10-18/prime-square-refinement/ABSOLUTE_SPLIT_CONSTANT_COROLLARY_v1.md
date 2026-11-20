# An unconditional improvement in the previous absolute remainder constant

18 October 2026. Companion to the prime-square refinement. This changes an additive logarithmic allowance only; it proves no new zero-free curve or exponent.

For s>1/2 define
Z2(s)=2^(-2s)+2^(1-2s)/(2s-1),
Z3(s)=2^(-3s)+2^(1-3s)/(3s-1), q=2^(-s).
The previously used j>=2 remainder allowance was
C_old(s)=Z2(s)/[2(1-q)].
Separating j=2 and applying the proved j>=3 bound gives the valid uniform allowance
C_split(s)=Z2(s)/2+Z3(s)/[3(1-q)].
Indeed the square part is at most sum_p p^(-2s)/2<=Z2(s)/2, independently of Q,h,t. The rest is C3(s).

This improves the old allowance strictly for every s>1/2:
C_old-C_split=[q Z2/2-Z3/3]/(1-q)>0.
To verify the sign, note
q Z2=2^(-3s)+2^(1-3s)/(2s-1)
 >2^(-3s)+2^(1-3s)/(3s-1)=Z3.
Thus the numerator exceeds Z3/6>0.

At s=417/500, ordinary numerical evaluation gives
C_old approximately1.431425858,
C_split approximately0.940940294,
reduction approximately0.490485564.
The exact formulas and strict algebraic inequality are the result; the rounded decimal values are explanatory rather than interval-certified arithmetic.

The split absolute allowance still diverges as s tends to1/2 because Z2 does. The joint prime/square formulation avoids paying that term absolutely, but then requires a genuinely joint arithmetic estimate. Neither variant changes the residual's denominator, its analytic boundary hypotheses, the height exponent, or the all-carrier coverage requirement.
