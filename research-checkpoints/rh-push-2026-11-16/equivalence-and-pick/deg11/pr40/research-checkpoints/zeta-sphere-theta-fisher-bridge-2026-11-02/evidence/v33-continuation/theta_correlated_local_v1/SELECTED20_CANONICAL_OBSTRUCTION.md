# An actual inverse-selected residual with negative canonical local remainder

Status: independent interval and analytic review PASS. This falsifies the uncorrected pointwise remainder claim at an actual selected residual. It does NOT falsify the optimized orthogonality dual or prove the sign of the next integrated pivot.

## 1. Exact object and permitted inputs

Use the complete theta, normalized a=0. Existing independently certified full moments mu_j, j=0,...,19, are read from full_split_audit/actual_total_certificate.json, SHA256 06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536. Their normalization is M_j=mu_j/4^j for M_j=∫u²psi²g_j. Serialized endpoints are padded by ±1e−90(1+|lo|+|hi|), exactly as in the dependency audit.

For conditioning use x=t²/100 and scaled moments m_j=M_j/100^j=mu_j/400^j. Define

A=[m_(i+j)]_(i,j=0..9), b=[m_(10+i)]_(i=0..9),
c=−A^(-1)b,
p_scaled(t)=x^10+Σ_(i=0)^9 c_i x^i.

This is precisely the degree-20 even residual selected by the actual known lower prefix, scaled by the positive constant 100^(-10). It is not a fitted polynomial. Only mu_0,...,mu_19 enter its selection. The unknown target integral M20 is NOT read or assumed positive.

The checker independently verifies both old parity blocks [m_(i+j)] and [m_(i+j+1)] positive using fixed rational upper-triangular congruences. The decimal candidate bases have nonzero diagonals; their floating generation is not trusted. Direct interval evaluation of each transformed Gram verifies ||G−I||_op≤10 max_ij|G_ij−delta_ij|<1. The even and odd relative eigenvalue lower bounds exceed .9999968 and .9999691 respectively. These are bounds in those specified congruence coordinates, not eigenvalue bounds for the unscaled monomial matrices.

## 2. Full-theta point jets through derivative 40

At the exact point u=14/25, put Z=pi exp(2u) and D=2Z d/dZ. Use
r=Σ_(n≥2) A_n exp[−(n²−1)Z],
A_n=n²(2n²Z−3)/(2Z−3)=n^4+3n²(n²−1)/(2Z−3),
psi=4 exp(u/2)(2Z²−3Z)exp(−Z)(1+r).

The checker includes n=2,...,16 as Arb Taylor series and pays every omitted orbit. For every 0≤j≤40, Z≥pi, the elementary geometric derivative bound gives

|D^j A_n|≤2^41 n^4 2^j j!.

For j≥1, this follows from
|D^j(1/(2Z−3))|≤[2^j j!/(2Z)](1−3/(2Z))^(−j−1)
and (1/2)(1−3/(2pi))^(−41)<2^40, 3·2^40/pi<2^40. The case j=0 is covered by A_n<2n^4.

The Stirling-number exponential bound and Leibniz rule then imply

|D^j r_n|≤C n^84 Z^40 exp[−(n²−1)Z],
C=2^42·40!·4^40.

Indeed |D^k exp(−dZ)|≤4^k k!(dZ)^k exp(−dZ), and the Leibniz geometric sum Σ(2dZ)^(-l)≤2 supplies the additional factor2. For n≥17 the consecutive ratio is bounded by (18/17)^84 exp(−35pi)<1/2. Thus every omitted derivative through40 is bounded by

                  eps=2C·17^84 Z^40 exp(−288Z).

At the specified point eps<2.155e−977. The Taylor coefficient error eps/j! is added outward before forming log(1+r), its even generating series, and g_j, j≤20. No finite-orbit approximation is treated as the full theta, and no spatial quadrature is required for this pointwise falsification.

## 3. Retaining the exact inverse uncertainty

Let P be the fixed rational even-prefix basis and G=P^TAP, h=P^Tb. The true coefficient column is c=P y with y=−G^(-1)h. The interval inverse encloses y. Choose an exact decimal rational midpoint vector y0; put d=y−y0 and p0=x^10+Σ(P y0)_i x^i.

For the local moment matrix define the exact quadratic evaluation f(p)=Σ c_i c_k g_(i+k)(u)/100^(i+k), including the leading coefficient c_10=1. If H is the local Gram in the lower basis P and r is its local cross vector with p0, then

                 f(p_scaled)=f(p0)+2d^T r+d^T H d.          (1)

The checker evaluates (1) directly with all interval dependencies retained. It does not replace the true selected coefficients by their numerical midpoints. Polynomial convolutions are combined before multiplying moment intervals to avoid needless cancellation loss.

Outward results at u=14/25 are conservatively

f(p0)≈−2697.25405951957,
|2d^T r|<.078573,
|d^T H d|<1.306e−7,

             −2697.34<f(p_scaled)<−2697.17.                 (2)

The strict negative upper bound proves the canonical signed moment factor is negative at the exact selected polynomial. Since u>0, its positive u²psi² weight does not change the sign. Continuity also gives a nonempty neighboring negative interval, without claiming a certified width.

## 4. What this disproves, and what it does not

This is stronger than a monomial or arbitrary real-rooted counterexample: p_scaled is selected by the actual full-theta prefix inverse. It proves that exact inverse selection does NOT make the uncorrected canonical remainder pointwise nonnegative at every degree. In the variational notation it gives lambda(0)<0 for this residual.

It does not prove lambda_*≤0. Adding the known zero-mean cross densities with a nonzero supporting-plane coefficient can still repair the local loss. No rigorously certified finite atomic negative witness for lambda_* has been found. Earlier floating linear-program outputs with poorly scaled constraints were not accepted; the separately labelled whitened floating probe is likewise not a certificate of either sign.

It also does not establish a positive or negative integrated degree-20 target pivot: M20 was deliberately not an input and was not computed here. This is an obstruction test, not a new finite positivity rung. The all-degree arithmetic question remains the sign of the optimized or further integrated remainder, with its true inverse and signed compensation retained.
