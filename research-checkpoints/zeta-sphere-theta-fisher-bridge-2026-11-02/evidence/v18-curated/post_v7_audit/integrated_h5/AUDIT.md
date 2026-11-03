# Integrated H5 uniform-shift audit

2 November2026. Analytic/code review PASS; independent replay outcome appended below.

Read integrated_h5_v1/INTEGRATED_H5_PROOF.md and corrected certify.py. Copied corrected script for independent replay, retaining exact algorithm and output in this directory. No downloaded external checker executed.

## Crucial distinction and scope

This is genuinely integrated positivity: it encloses the complete signed derivative integrals first, then tests their odd3x3 Hankel matrix. It does not assume positive pointwise fibers and therefore can repair the independently established local H5 failure. The result is uniform0<=a<=.5 for C_a/a, using the continuousa0 normalization. It does not claim all a>0 as H3/H4 do, but it covers the entire bridge-shift interval needed by the RH formulation. The full H5 statement additionally depends on H4's even block; the odd block calculation is independent of H4.

## Integrands, quadrature and coverage

The derivative polynomial recurrence and signed double-binomial product formula correctly compute all jets and their fourth spatial derivatives through profile order14. The normalized weight series has positive omitted remainder; independently checked2*4^42/43!<1e-27. The corrected12 shift bins use outward interval division and cover the whole closed interval without endpoint gaps. The weight derivative bound uniformly encloses every actual shift in each bin, includinga0. Simpson's signed value enclosure and d^5 sup|F''''|/2880 error are applied to every dyadic cell, and all errors are summed. The shared error bound across bins is conservative, not a lost correlation assumption.

## Tails

For derivative order<=14, the polynomial coefficient norm<1e40 and degree<=16 are checked by the code. The n>=11 tail ratio is below.5; independent rational exponential lower bounds verify8*1e40*11^32/20^120<1e-70. This justifies the symmetric full-theta remainder at every evaluation.

The spatial bound is needed only for h>=4, where z>9000; it is not being used as an unsupported small-z sum bound. A rational Taylor lower bound for exp8 and pi>157/50 verifies the threshold. The product and weight prefactors are conservatively bounded by2^42*1e84 z^33exp(-2z)dz. Since33sqrtz<=z/2 there, the specified integral is far below1e-1000. The added symmetric allowance is adequate.

## Matrix test

The stored moment order[2,6,10,4,8] maps correctly to mu1,mu3,mu5,mu2,mu4 and the odd Hankel block. Scaling bydiag(1,200,80000) is an invertible fixed congruence. Each interval LDL operation encloses the corresponding exact arithmetic; all pivots must have strictly positive lower bounds. This suffices for every correlated moment tuple in each bin, despite treating shared intervals independently. Positive pivots are not identified with eigenvalue lower bounds.

## Independent replay result21:18UTC

PASS for all12closedshiftbins. Independent corrected-script run accepted the same finite subdivisions and reproduced every stored moment/pivot enclosure; runtime41.375seconds. Minimum third scaledLDLpivot lower bound0.09778764482030381498024136238715937372967806, strictly positive. This is a pivot bound, not a smallest-eigenvalue estimate. FullH5 acceptance requires the separately checked H4even-block proof.
