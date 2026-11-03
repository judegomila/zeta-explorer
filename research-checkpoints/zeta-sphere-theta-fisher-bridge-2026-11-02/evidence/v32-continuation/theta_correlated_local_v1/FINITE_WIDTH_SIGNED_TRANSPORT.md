# Finite-width transport through an adverse shell interval

This note supplements the certified even6 outward-loss interval. It gives an endpoint-only signed criterion and evaluates the existing odd7/even6 recovery. It is not a uniform theta inequality or a new finite rung.

## 1. Endpoint-only transport

Let A0,b0,c0 and A1,b1,c1 be actual core moments at H0<H1, with A0,A1 positive. Set z_i=-A_i^-1 b_i and s_i=c_i-b_i^TA_i^-1b_i. Define the signed shell increments L=A1-A0, l=b1-b0, d=c1-c0 and
 J=d+2z0^T l+z0^T Lz0,
 r=Lz0+l,
 K=r^TA1^-1r=(z1-z0)^TA1(z1-z0)>=0.
Then exactly
                       s1-s0=J-K.                       (1)
Proof: evaluate the final quadratic at z0, then complete its square using the actual final old inverse. This requires no positivity of L, no pointwise local old or target positivity, and no invertibility assumption at intermediate cutoffs. J is the full signed shell density integrated against the initial optimizer, with no discarded negative subinterval. K is the full cost of reoptimizing at the endpoint.

A sufficient, genuinely one-sided finite-width test is J_lower-K_upper>-s0_lower. More generally, any certified positive P<=A1 gives K<=r^TP^-1r; P must be a verified bound on this actual old matrix, not a parent metric. Along a finite chain of admissible endpoints, sum the signed increments J_i-K_i; they telescope to the final actual Schur change. Intermediate adverse increments must remain in that sum. No monotone sampling assumption is valid.

The theorem is an exact transport identity plus a sufficient comparison; its uniform success remains unproved. In particular J>=0 alone does not pay K or the starting debt.

## 2. A correlated evaluation when the finite shell old metric is positive

When L>0 is independently verified, set zM=-L^-1l and sM=d-l^TL^-1l. Then
 J=sM+(z0-zM)^TL(z0-zM),
 J-K=sM+(z0-z1)^TA0(z0-z1)+(zM-z1)^TL(zM-z1).            (2)
The latter is the exact previously reviewed two-region correction, used here to evaluate the cancellation between J and K without separately overestimating each. Formula(1) does not require L>0; formula(2) does.

## 3. Actual two-parity finite-width recovery

The owned checker reads the independently certified moments for H0=1/8,H1=1/2. Both endpoint old inverses and the finite middle old metric are verified. It performs no fresh quadrature and does not borrow a target sign. All values use h/(4pi) units.

Odd7:
- J in(175584795178,186305339323).
- K in(171601275310,182110794031).
- Separate interval subtraction is inconclusive: lower bound -6525998861.
- Correlated J-K in(4045697092,4132407250).
- Adding the negative starting core gives s1>3697941438.
- Net gain is between2.17% and2.36% of J.

Even6:
- J in(150678898,151397766).
- K in(103423429,104002529).
- Correlated J-K in(47275752,47374951).
- Adding the negative starting core gives s1>46532339.
- Net gain is between31.22% and31.45% of J.

The separately reviewed nearby-flow certificate proves even6 initially loses at least1373960 per unit cutoff on[1/8,1/8+1e-8]. Thus its positive finite-width gain in this note is genuinely compatible with, and retains, a temporary loss; it is not based on pointwise monotonicity. No quantitative bound on the greatest intermediate loss is asserted.

Odd7 demonstrates a practical mathematical-estimation obstruction: independently bounding source and adaptation with the existing rigorous intervals loses the sign, although their exact correlated difference is positive. This is not a negative mathematical result about J-K itself. It shows why retaining shared optimizer dependence is necessary at these precisions.

## 4. Unresolved degree-dependent statement

A nonmonotone adaptive proof could choose endpoint old metrics using the explicit admissibility theorem and then verify correlated signed increments(1), preferably before reaching the expensive remote zone. What is missing is a theta-specific degree-dependent lower bound for those increments sufficient to cover the starting debt. Neither more endpoints, positivity of J, nor cancellation observed at these two finite rungs supplies that bound. The present result isolates an endpoint-only route that tolerates signed shells and tests its cancellation costs in actual theta examples.
