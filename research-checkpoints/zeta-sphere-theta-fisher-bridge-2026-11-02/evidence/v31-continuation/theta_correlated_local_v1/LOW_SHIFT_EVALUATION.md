# Actual inverse-selected low dyadic correlations

Independent numerical/method and weighted-tail aggregate audit PASS. These evaluate already-known odd1 and corrected even2 residuals, not new ladder rungs.

## Inputs and computation

`certify_dyadic_correlations.py` reads only the same current-prefix entries as the accepted midpoint certificate: G00,G01,G11 for odd1; additionally G02,G12 for even2. No target next moment is read. The even2 coefficient ordering is the corrected one: first inverse component multiplies p0, second p2.

Use 160-bit Arb, 6000 midpoint cells on w in [0,3], arithmetic indices j=1,...,63. All quadrature errors are bounded with interval second derivatives. For the additional A_f integrals, the integrand is pref exp(R-S)T(S) and its second derivative is
 pref exp(R-S)[(T''-2T'+T)(S')²+4S(T'-T)],
with S=2z cosh(2w), S'=4z sinh(2w). The factor pref=2/sqrt(j) includes both reflected halves. In b_m=q^m C_m its divisor multiplier is d(j/2^m) for 2^m|j, zero otherwise. Integrate derivative-order components before multiplying actual coefficient intervals.

Spatial tails use the existing full-orbit T_l,M_l bounds, with no w² factor. Since d(j/2^m)<=j, the arithmetic omission above J=64 is bounded by
 (4B_K/pi) J^(1/4) W(2pi J) exp(-pi J/2).
It has positive sign for even2 and negative sign for odd1. Thus each output encloses the *full* b_m, not only j<64. The tail after m=5 in E uses the previously reviewed sharper dyadic bound. Small interval-radius rounding inflation is included in all displayed final endpoints.

## Rigorous coarse enclosures

Here b_m=2^(-m/2) C_m. The JSON files also contain C_m itself and directed precise endpoints.

odd1:
- b0 in (6006,8144); b1 in (528,886).
- b2 in (-132,-129); b3 in (-4.014e-6,-4.007e-6).
- b4 in (-1e-19,0); b5 in (-1e-19,4e-28), sign unresolved.
- E in (60385,85151), with omitted m>=6 cost magnitude <6e-18 and negative sign.
- h in (3229,4053), including the negative original arithmetic tail.
- Paired filtered surplus S=h+E in (63615,89203).
- Directed h/E in (0.03792,0.06711).

even2:
- b0 in (215673,315054); b1 in (-14995,-1844).
- b2 in (24268,24448); b3 in (0.006218,0.006224).
- b4 in (0,4.593e-14); b5 in (-1.6e-22,4.593e-14), sign unresolved.
- E in (2093189,3194411), with omitted m>=6 cost magnitude <3e-12 and positive sign.
- h in (147744,189126), including the positive original arithmetic remainder.
- S in (2240934,3383537).
- Directed h/E in (0.04625,0.09036).

Crucial scope: S is evaluated by the exact identity S=h+E, using the same signed arithmetic h integration. This is **not an independent integration of the filtered Fourier quotient** and supplies no independent proof of S>E. The true positive difference is retained as h; separate enclosures for S and E overlap. These computations show the cost and actual correlated margin, not a new route to the known pivots.

## Aggregate structure and paid derivative-weighted tail

Let D=sum_(m>=1) m b_m and Y=sum_(v>=0)(v+1)Y_v from the audited recurrence. Then
 h=4pi Y+2pi L² D.
To enclose D using m<=5, interchange the absolutely convergent sums. For v=v2(j),
 sum_(m=6)^v m(v-m+1) <= v(v+1)(v+2)/6.
After d(j)=(v+1)d(oddpart j), the coefficient is <=d(j)(v+1)²/6. The same geometric argument gives, for J=2^(M+1) beyond the prior thresholds and 4(K+5)/pi,
 |2pi L² sum_(m>=M+1) m b_m|
 <= (4L² B_K/3) J^(1/4)(1+log_2 J)² W(2pi J) exp(-pi J/2).
Its sign follows the same parity rule. At J=64 this bound is 7/15 of the existing eta-tail envelope. No unknown pivot enters it.

`check_low_dyadic_structure.py` propagates only already computed intervals and that tail. It gives:
- odd1: 2pi L² D in (801,1889), Y in (106,259), and X1=b1-2b2+b3 in (788,1149).
- even2: 2pi L² D in (101255,142040), Y in (453,6993), and X1 in (-63891,-50380).

Thus the dyadic component and the remaining aggregate Y are separately positive **in these two examples**, even though the low valuation shell X1 has the opposite sign in the two parities. The observation does not prove either aggregate stays positive as degree grows.

## What survives as a uniform target

The base-residual positive-correlation argument cannot extend to these actual residuals: odd1 changes sign from b1 to b2, while even2 changes in the opposite direction. Low-shell termwise positivity likewise fails already for even2 X1. Eventual parity signs at m>=ceil(log2 k_K) are compatible with these counterexamples, but do not propagate backwards through a second-difference recurrence whose low X_v are signed.

A potentially sufficient *aggregate* statement would control Y jointly with D, for example prove Y>=0 and D>=0 in the actual inverse-selected sequence (with one strict), or a weaker correlated lower bound Y>-(L²/2)D. The latter bare inequality is merely the target rewritten; the former is a new stronger proposed condition, verified here only finitely. Neither follows from the recurrence, positive parent norm, or filtered positivity. No degree-uniform bound for the low Y_v is established.
