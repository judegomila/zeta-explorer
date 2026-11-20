# Independent audit: actual selected degree-20 canonical obstruction

2026-11-03. PASS, conditional on the previously independently certified full moment enclosures. Fresh owned-checker replay saved in selected20_canonical_obstruction_independent.json. This is a finite falsification, not a positive degree extension.

## Inputs and actual selection

Input SHA256 matches 06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536. Only moments mu_0 through mu_19 are read. The mu_j/4^j normalization and t^2/100 coordinate give m_j=mu_j/400^j. Both 10-dimensional parity lower blocks are verified positive by exact-decimal rational triangular congruences with nonzero diagonals. Enclosed deviations from identity give eigenvalue lower bounds >0.9999968 (even) and >0.9999691 (odd) in those congruence coordinates only. Thus the full lower prefix is positive and the even degree-20 residual is genuinely inverse-selected, not fitted. No integrated mu_20 is used.

Endpoint strings are enclosed and padded by the previously accepted relative 1e-90 guard. Rational candidate matrices are inputs only; their floating provenance is not trusted. Arb decimal parsing encloses the exact rationals. Interval inversion of the actual congruence Gram and back transformation retain coefficient uncertainty.

## Complete theta derivative tail

For A_n=n^4+3n^2(n^2-1)/(2Z-3), expansion of the reciprocal as a geometric series bounds D^j A_n by the stated 2^41 n^4 2^j j! for j<=40. The geometric derivative sum is bounded by j!(1-3/(2Z))^(-j-1); the explicit pi inequalities are conservatively verified in the checker. j=0 is separately covered by A_n<2n^4.

The Stirling expansion bounds D^k exp(-dZ) by 4^k k!(dZ)^k exp(-dZ) for dZ>=1. Leibniz and sum_l(2dZ)^(-l)<=2 give C=2^42 40! 4^40 after replacing powers by n^84 Z^40. For n>=17 the ratio is maximized at n=17 and Z=pi, and is <1/2. Thus eps=2C 17^84 Z^40 exp(-288Z) bounds every omitted derivative through 40. At u=14/25 the independent replay gives eps<2.155e-977.

The log profile h/2+log Z+log(2Z-3)-Z+log(1+r) has the correct physical derivatives; omitted constant factors do not affect its derivatives. Each Taylor coefficient receives eps/j! before log/exp operations. The even log product and (-1)^j(2j)!/400^j yield precisely g_j/100^j. No finite orbit truncation is mistaken for the full theta.

## Inverse uncertainty and replay

For exact rational P and y0, c=P(y0+d), so the local evaluation equals f0+2d^T r+d^T H d identically. Interval arithmetic encloses this expression even though shared variables cause overestimation; it does not discard dependence in a way that shrinks the enclosure. Polynomial convolution combines exact terms before moment evaluation.

Fresh replay:
- f0 approximately -2697.2540595195728;
- linear error magnitude <0.078573;
- quadratic error magnitude <1.306e-7;
- full selected factor strictly between -2697.332632 and -2697.175487.

The advertised conservative interval (-2697.34,-2697.17) is valid. The exact point has positive u^2 psi^2 weight. Continuity gives a negative neighboring interval, with no certified width asserted.

## Scope

The original complete-theta normalized-a=0 degree-20 selected residual has a negative uncorrected canonical local remainder. Therefore its lambda(0) is negative. This neither supplies a negative feasible atomic witness for lambda_* nor bounds the optimized dual margin, and it says nothing about the sign of the uncomputed integrated degree-20 target. Additional zero-mean corrections and integrated compensation remain possible. Both old-prefix positivity and the new local sign are conditional on the cited prior certified moment input; no prior target margin is used.
