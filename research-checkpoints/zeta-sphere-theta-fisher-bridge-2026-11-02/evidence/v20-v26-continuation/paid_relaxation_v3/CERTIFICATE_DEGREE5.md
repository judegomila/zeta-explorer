# Degree-five full-theta gauged paid certificate (candidate)

Status: author N=1024, L=1024 full run PASS in 864.12 seconds; independent analytic/source/complete-tail audit accepted and independent N=1024, L=1024 full replay PASS with identical displayed bounds. `probe.json` is only a three-cell mesh diagnostic, NOT a certificate. Failed/coarse pilot outputs are not counterexamples. All energies and costs omit their common positive factor pi/2.

## Exact target and gauge

Let g(u)=exp(u/4+lambda*u^2) psi(u), with the complete even theta density. Use features v=(g',-g''',g'''''), matching phase-stripped monic degree-five residual F=c0*g'−c1*g'''+g'''''. The coefficients are the actual Schur coefficients for the signed whole-line Gram H_ij=integral u*v_i*v_j, not fitted approximations. A=H[0:2,0:2] must be positive definite on every lambda cell. K=c0*g−3*c1*g''+5*g''''.

Orthogonality permits adding u*F*(gamma0*g'−gamma1*g''') to the density u^3*F^2+2*u^2*F*K without changing its whole-line integral. Gamma is fixed piecewise affine through rational knots (lambda,gamma0,gamma1):
(0,692.51,−30.32), (.5,727.42,−29.56), (1,903.66,−29.42).
No optimization or floating fit is trusted in certification: these rational numbers merely define a legal gauge. The terminal check is S(1)>2*integral_0^1 integral_0^infinity max(J_gauge(u)+J_gauge(−u),0) du dlambda.

## Interval algorithm

`certify_degree5.py` is self-authored Python using Arb at 100 bits. It partitions u in [0,3] into N equal cells and lambda in [0,1] into L equal cells, with the gauge knot included. Ten theta orbits are explicitly summed; the rest are enclosed, never dropped.

Theta derivatives use exact rational polynomials P0=−3z+2z² and P_(j+1)=(1/2)P_j+2z(P'_j−P_j). For j<=9 their coefficient absolute sum is <2e9. Values at nonnegative u are 4 exp(u/2) sum P_j(pi n² exp(2u)) exp(−pi n² exp(2u)); negative u follows parity.

Spatial range enclosures are tightened by Taylor expansions about each cell midpoint: degree-three plus fourth-derivative remainder for derivatives j<=5; degree-one plus second-derivative remainder for j=6,7; constant plus first-derivative remainder for j=8. Derivative9 retains the direct interval enclosure. The repeated-multiplication power helper handles intervals crossing zero.

Gram entries at each lambda midpoint are integrated by composite Simpson. The fourth derivative of u*g^(i)*g^(j) is
u*sum_(k=0)^4 binom(4,k)g^(i+k)g^(j+4−k)+4*sum_(k=0)^3 binom(3,k)g^(i+k)g^(j+3−k).
Reflected jets have alternating signs in the positive u coordinate. Each per-cell Simpson remainder is enclosed by width^5/2880 times the absolute fourth-derivative bound.

The first lambda derivative of each integrated Gram entry is independently Simpson-enclosed. Lambda derivatives of g jets use d_lambda^r g^(j)=D^j(u^(2r)g), by the exact finite Leibniz formula. The second lambda derivative is rectangle-enclosed over the entire lambda cell. Thus H(lambda) is enclosed as H(mid)+delta*H'(mid)+delta²*H''(cell)/2, with delta the symmetric cell range. Interval multiplication, rather than a noninteger power operation, encloses delta².

The two-by-two Schur solve is interval-preconditioned: a midpoint approximate solution x is formed; the interval residual b+A*x is multiplied by the exact interval inverse formula to enclose the correction. This is an algebraic identity, not a numerical assumption. A00>0 and det(A)>0 are asserted. Coefficient magnitudes |c0|<1e6, |c1|<1e5 are also asserted.

For paid integration, the paired gauged density is evaluated at each u midpoint, with the whole lambda cell and the actual interval Schur coefficients. Its derivative with respect to positive u is enclosed over the full cell, holding the Schur coefficients/gauge fixed, as required for spatial differentiation. Since positive part is 1-Lipschitz, the cell integral is at most
width*max(J(mid),0).upper + width²/4 * sup_cell |J'|.
This is valid even at zero crossings. Summing these enclosures and multiplying by 2/L bounds the exact paid budget. Terminal S=H22+c0*H02+c1*H12 is enclosed separately at lambda=1.

## Missing theta orbits

For j<=9 and z>=1, |P_j(z)|<=2e9*z^11; exp(u/2)<=z^(1/4). Therefore each omitted term is bounded by 8e9*z^12*exp(−z). For n>=11, z>=3n²>=363, where z^12 exp(−z) decreases. Consecutive majorants have ratio at most (12/11)^24 exp(−69)<1e−19. The script verifies
8e9*363^12*exp(−363)/(1−1e−19)<1e−110.
A symmetric 1e−110 radius is added to every explicit theta derivative enclosure. Taylor bounds use these full-tail enclosures too.

## Infinite spatial tail

For u>=3 write z=pi exp(2u)>1200. A geometric orbit bound gives |psi^(j)(u)|<=16e9*z^12 exp(−z), j<=9. The derivative recurrence for exp(u/4+lambda*u²), with 0<=lambda<=1, gives the generous bound
|g^(j)(+/-u)|<=2e27*u^9*z^12*exp(u²+u/4−z)<=exp(−z/2), j<=9.
For the second inequality the logarithmic prefactor at u=3 is <170<600; its derivative is 9/u+24+2u+1/4<=2u+28, smaller than the derivative z of z/2 for all u>=3. The first inequality follows by bounding |u/4+lambda*u²|'<=3u, each exponential derivative through order9 by 9!*2^9*(3u)^9, and the binomial sum by 2^9; the stated prefactor exceeds the resulting constant.

The asserted coefficient bounds and |gamma_i|<1000 imply |F|<1.2e6 exp(−z/2), |K|<1.4e6 exp(−z/2), and |Q|<2000 exp(−z/2). Hence the paired gauged density is bounded by 1e14*u³ exp(−z). Gram tails are smaller. Lambda Taylor is applied only to the spatially truncated Gram, so no lambda derivative tail bounds are needed. Since z>=1200+2400(u−3), each omitted integrated tail is <1e−100. A symmetric 1e−100 radius is added to each final Gram entry; a positive 1e−100 is added to each paid cost. The uniform Gram tail radius is added after the truncated-domain Taylor enclosure, and applies equally at the endpoint.

## Completed author bounds

The completed full run is `certificate_degree5.json`; `endpoint_summary.py` independently re-encloses the endpoint and writes `certificate_directed.json`. Conservative directed statements are

- terminal S(1) > 375589.1213813384;
- full paid budget < 322853.8114762700;
- paid reserve > 52735.3099050647.

All omit the common positive pi/2 factor. The particularly simple rational statements S(1)>375000 and budget<330000 are checked explicitly. Positivity of the actual old-feature Gram A holds on all 1024 lambda cells. Independent full replay and directed endpoint summary both PASS with identical displayed bounds.

## Scope

A completed passing run establishes only this finite degree-five, a=1/4, lambda in [0,1] paid inequality, using the actual full-theta Schur residual and exact orthogonality gauge. It makes no all-order, all-shift, or general zeta-zero claim. The author run, independent replay, and analytic/complete-tail audit all passed.
