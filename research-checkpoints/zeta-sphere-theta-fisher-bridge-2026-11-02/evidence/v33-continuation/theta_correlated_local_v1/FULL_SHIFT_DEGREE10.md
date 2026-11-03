# Full positive-shift degree ten; degree eleven remains inconclusive

The independently replayed six-channel even calculation proves the next finite degree. Combining its even0,2,4,6,8,10 block with the previously accepted odd1,3,5,7,9 block gives:
- at H=0, full degree<=10 positivity for every a>0, plus the normalized a=0 endpoint;
- for every0<=H<=1/8, full degree<=10 positivity on0<=a<=1/2.

The same run attempted odd1,3,5,7,9,11. Those interval tests were inconclusive in every shift slab. There is NO degree11 theorem or negative-matrix conclusion from them. Nothing here proves all-degree positivity or RH.

## 1. What was independently evaluated

Use the same actual normalized signed moments
 m_j(a,H)=2 integral_H^infinity u² sinhc(2au)psi(u)²g_j(u)du.
The new even matrix is[m_(i+j)]_(i,j=0..5). The attempted odd matrix is[m_(i+j+1)]_(i,j=0..5).

The exact decimal rational bases in degree11_shift_rational_basis.json were suggested by an owned floating Cholesky computation using midpoints of existing normalized full moments, converted by M_j=mu_j/4^j. Those earlier values are used only to select candidates. The final checker does not import their target signs or integrate their approximate moments. It recomputes every actual positive-shift signed entry from complete theta. Thus candidate selection cannot authorize an otherwise unproved target sign.

`check_degree11_shift_slabs.py` is the accepted direct signed slab method extended to six rows/columns. It uses16 closed shift slabs covering[0,1/2],4000 spatial cells for the starting tail[1/8,2], the complete remaining tail, and4000 inward cutoff cells covering[0,1/8]. The parameter-weight interval, spatial midpoint second-derivative error, signed partial-cell increment hull, and interval LDL methodology are exactly those documented in FULL_SHIFT_DEGREE9.md.

All six rows and columns are integrated, tail-paid, propagated and checked. Every even slab/cell has strictly positive actual6x6 LDL pivots. No local-density positivity is assumed and no target sign is inferred merely from an old block.

## 2. Complete derivative24 and tail extension

The owned theta24_density.py explicitly evaluates twelve theta orbits and encloses ALL omitted ones. On z=pi exp(2u)>=pi, geometric differentiation gives
 |D^j A_n|<=2^28 n^4 2^j j!, j<=24,
 for A_n=n²(2n²z-3)/(2z-3).
The checked constants include
 (1/2)(1-3/(2pi))^-25<2^27,
 3*2^27/pi<2^28.
The exponential derivative estimate and Leibniz rule give
 |D^j r_n|<=C n^52 z^24 exp(-(n²-1)z),
 C=2^29*24!*4^24.
For n>=13 the ratio is at most(14/13)^52 exp(-27pi)<1/2. Therefore every omitted derivative through24 is bounded by
 2C13^52 z^24 exp(-168z).
These enclosures are added to the Taylor coefficients before logarithmic differentiation. Derivatives through24 suffice for g11 and its second spatial derivative, hence also for the successful even g10 target.

For z>=100, the improved full-orbit bound
 epsilon=8*24!*4^24*2^52*z^24 exp(-3z)
satisfies both epsilon<1e-10 and24!epsilon(1+epsilon)^23<1. The code checks these stronger composition conditions, so the logarithmic correction derivatives are bounded by1. Consequently
 |ell^(r)|<=2^(r+2)r!z for the needed r<=24.

For completeness, the moment coefficient majorant is retained explicitly. The coefficient q_k of x^k in the normalized even log-product has |q_k|<=8*4^k z. For R=36z,
 sum_(k>=1) k*(8*4^k z)/R^k
 =(8/9)/(1-1/(9z))²<1.
The exponential-coefficient recursion j b_j=sum_(k=1)^j k q_k b_(j-k), starting b0=1, then gives |b_j|<=R^j for all needed j<=11. Thus
 |g_j|<=(2j)!(9z)^j.
Only the finite available log derivatives are needed for these coefficients; the infinite positive majorant is a bounding series, not an assumption about unavailable higher theta derivatives.

The same normalized shift factor obeys sinhc(2au)<=exp(u) on0<=a<=1/2. Entire omitted spatial moment tails are therefore bounded by
 (256/pi)(2j)!9^j Z^(j+5)exp(-2Z), Z=pi exp4,
 now throughj=11. Since2-16/Z>1, the endpoint exponential-polynomial bound integrates safely. Every transformed matrix entry includes the exact coefficient-weighted symmetric tail radius. This pays the whole theta and spatial tails for both the successful and inconclusive parity attempts.

## 3. Accepted numerical result and actual inverse cost

Across every even shift/cutoff cell, conservative common lower bounds for the six LDL pivots in the fixed rational basis are
 (.88886338,.92779862,.95945616,.96612687,.96388527,.63863770).
These are successive actual Schur/LDL pivots, not eigenvalue reserves. In particular, the last one includes the actual five-dimensional inverse-feedback subtraction.

The retained directed calculation and the last rational-basis leading coefficient imply the monic even10 Schur lower bound
                  S_even10(a,H)>8,928,867,843,900,347
uniformly0<=a<=1/2,0<=H<=1/8.
The normalization is the displayed m_j convention; there is no unit-mass division by C_a(0). The exact consequence checker verifies all16 shift slabs cover the interval and divides the last transformed pivot by P_55². No unverified spectral-eigenvalue interpretation is used.

The odd11 failed-slab list is0,...,15. A failed interval LDL test means that this enclosure did not establish positivity. It does not establish a negative pivot or a negative exact matrix. The successful even result is separately checked and does not depend on any odd11 outcome.

## 4. Global all-shift conclusion and comparison

The previously audited full-shift degree9 packet already supplies the odd block through9 on the same compact cutoff rectangle. Combining it with the new even block proves full degree<=10 positivity there, since mixed-parity spectral entries vanish.

At H=0, the separate standard outer-strip logarithmic-derivative argument gives every finite original Gram matrix positive for a>=1/2. Its assumptions, convergence and normalization are recorded in FULL_SHIFT_DEGREE9.md and the named earlier H6/even8 audits. It joins the new compact result without a gap. Hence full H10 is positive for every positive shift. As before, this outer-strip identity is not applied to H>0 spatial truncations.

This extends the newly accepted full all-shift H9 result by one degree. It does not extend the previously known normalized odd-through19 degree range, does not prove full H11, and supplies no induction to arbitrary degree.

## 5. Preserved implementation and numerical limitations

An initial adaptation accidentally retained four upper-triangle loop limits of5 while declaring six channels. Its sixth row/column was not populated. Independent source review caught the omission; that source/output is retained under degree11_initial_dimension_diagnostic with INVALID_DIMENSION status. It is not a valid negative or inconclusive6x6 mathematical test.

All four loops were corrected to6 before the independently replayed calculation reported here. The corrected even result passes. The corrected odd11 result remains a genuine inconclusive interval calculation, distinct from the earlier invalid implementation.

The parallel EVENTUAL_SHIFT_COEFFICIENTS.md gives a fixed-degree structural reduction of the infinite shift-Taylor tail to a finite signed coefficient problem. Its eventual coefficient positivity does not establish the signs of the remaining finite matrices or uniform control as degree grows. It is not used as a numerical premise of this H10 certificate.
