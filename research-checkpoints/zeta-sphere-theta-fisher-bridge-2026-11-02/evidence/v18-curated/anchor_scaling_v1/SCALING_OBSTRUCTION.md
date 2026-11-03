# Theta-specific scalar-anchor obstruction at an already verified order

Status: interval computations, independent quadrature replay, and analytic review passed. The theorem is finite, at normalized a=0 and odd degree19. Larger-degree figures below are exploratory only.

## Exact statement
Take the actual complete lower9-by-9 odd moment block A, append the degree19 channel, and write its complete diagonal as d>0 and full Schur reserve as S>0. Partition h>=0 into

[0,1/4], [1/4,1/2], [1/2,3/4], [3/4,1], [1,infinity).

Let b_i be each region's actual cross-column and set

L_partition=sum_i sqrt(b_i*A^(-1)b_i).

The full-theta interval certificate proves

1.8363627474 < L_partition²/d <1.8363627660,

.00016032666 < S/d <.00016032766,

0<S/L_partition²<.000088.

## Consequence for scalar anchors
For all choices R_i=w_i A with positive weights summing to1, the common-anchor auxiliary cost is at least L_partition², by the exact weight optimization theorem. Therefore

sum_i[d_i−b_i*R_i^(-1)b_i] <=d−L_partition²<−.83d.

In particular no scalar weight choice can make every local auxiliary remainder nonnegative on this actual theta partition. A proof that discards the covariance term and tries to make all scalar-anchor pieces positive is already impossible at this finite order.

For the continuous feature b(h), Minkowski's inequality gives

L_continuous=int ||A^(-1/2)b(h)||dh >=L_partition.

Thus the same obstruction applies to scalar anchors assigned pointwise in h. The complete kernel remains positive: its exact angular covariance repairs the negative auxiliary cost. But its angular-fraction surplus above the positivity threshold is S/L_continuous², at most .000088. A coarse one-sided angular estimate with uncontrolled absolute error at that scale cannot close this certificate. The route must retain accurately quantified directional cancellation, use matrix-valued/block anchors, or exploit a sharper theta identity; positivity of all scalar auxiliary pieces is not available.

This is not an all-degree impossibility theorem for the common-anchor method. It identifies a concrete failed simplification and a certified conditioning requirement.

## Certified regional integrals
`certify_partition.py` integrates the full-theta signed product moments mu_n(h), n=1,...,19, using exact dyadic midpoint Taylor quadrature of degree20 with width1/512 on each quarter-region. Derivatives through58 use the already reviewed integer Q_k recurrence with sixteen explicit theta terms and the same rigorous infinite derivative-tail majorant.

For complex h within R=1/20 of any midpoint in[0,1] and |v|<=3/10, the previously reviewed global rectangle bound |psi(h±v)|<1000 applies. Since2|h|²<3, Cauchy bounds the moment-density magnitude by

M_n=3·10^6(2n)!(10/3)^(2n).

With q=(1/512)/(2R)=5/256, each quarter-region's Taylor remainder is at most M_n q^21/[4(1−q)]. The checker adds this error as an Arb radius. The last unbounded region is obtained by subtracting the four certified regions from the independently reviewed full moment enclosure; no new spatial-tail assumption is made.

`evaluate_partition.py` uses the reviewed residual quadratic-form method against the positive complete A. Decimal reloads receive the existing outward relative10^(-90) padding. The assertions L_partition²/d>1.83 and S/L_partition²<.000088 are checked directly.

## Exploratory growth diagnostic (not part of the theorem)
Two120/256-bit arithmetic Gauss runs with24 and40 nodes per cell suggest continuous L²/d values approximately .893,1.290,1.875,2.431,2.969,3.526,4.292 at last odd degrees5,9,13,17,21,25,31. Corresponding complete Schur/d shrinks from.133 to6.97e−7. The displayed tiny Arb arithmetic radii in these probe files do not certify the quadrature or finite-theta truncation; these values are explicitly exploratory. No asymptotic growth law is inferred.
