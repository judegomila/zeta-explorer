# Actual-theta n9 signed endpoint-block certificate

Status: author full N=3072 endpoint run PASS; independent analytic/complete-tail audit and full N=3072 replay PASS with identical directed bounds (7.50-second independent replay). This is an endpoint certificate, not a certificate of positive old Gram along a parameter path. Previously frozen certificates were not modified.

## Exact statement and normalization

Set a=1/4 and g_lambda(u)=exp(u/4+lambda*u²)psi(u), with the complete even theta density, at lambda=0 and1 only. The actual monic degree-nine same-parity signed Schur residual has phase-stripped form F=sum_i c_i v_i, where degrees are (1,3,5,7,9), v_i=(-1)^((9-degree_i)/2)g^(degree_i), and c_4=1. Its old signed Gram is strictly positive at both endpoints, independently verified below.

For conditioning, d_i=100^i and w_i=v_i/d_i. The scaled Gram is H_ij=integral_R u*w_i*w_j. The code solves H_old*y_old=−H_old,4 with y_4=1. Then F/10^8=sum_i y_i*w_i, so all reported energies are the actual monic residual energies divided by10^16. The common Fourier normalization pi/2 is also omitted. Both scalings are positive and cannot change any sign.

Partition the real line into six symmetric radial blocks with positive edges0,1/8,1/4,1/2,1,2,3, plus the full symmetric infinite tail. Let s_I(lambda)=integral_I u*(F_lambda/10^8)^2. Directly,

sum_I min(s_I(0),s_I(1)) <= sum_I s_I(0).

The certificate proves the left side positive by enclosing signed local energies of the actual endpoint residuals. It does not presume positivity of the degree-nine residual. Equivalently, define B=sum_I[s_I(1)−s_I(0)]_+; then the reserve is s(1)−B. The direct endpoint inequality does not need any invertible or positive old Gram in0<lambda<1. The separate differential transport-gauge interpretation requires a valid residual path and is not certified here.

## Numerical certificate

Self-authored `certify_endpoint.py`, invoked with `3072 9`, uses Arb at160 bits. On each endpoint:

1. Enclose every entry of the actual scaled old/full Gram by full-theta Simpson integration and explicit tails.
2. Perform interval LDL on the4x4 old Gram; all four pivots are strictly positive.
3. Solve the actual interval linear system with Arb's rigorous `precond` algorithm (not `approx`). Check |y_i|<10^10.
4. Integrate the signed residual energy directly on each of the six spatial blocks with the same fixed coefficient enclosure; append an independently bounded symmetric tail block. Do not reduce local mixed moments to full-line diagonal moments.
5. Cross-check that the sum of local energy intervals overlaps the independent Schur formula H44+sum y_i H_i4. This is a diagnostic consistency check, not an assumption used to establish signs.

For interval x,y, min(x,y) is enclosed by (x+y−|x−y|)/2 and positive part of y−x by ((y−x)+|y−x|)/2. Summing these enclosures gives a rigorous reserve lower bound and endpoint-budget upper bound. An explicit rational assertion reserve>3/1000 is checked for n9.

Author directed bounds (scaled by10^16; pi/2 omitted):

- reserve >0.0031365403907762;
- terminal s(1)>0.0043399130896862;
- endpoint budget B<0.0012102719741945.

Thus the corresponding unscaled monic reserve exceeds3.1365403907762e13; the simple rational reserve>3e13 is also established before multiplying by pi/2.

## Full theta and spatial quadrature

Exact rational derivative polynomials are P0=−3z+2z² and P_(j+1)=(1/2)P_j+2z(P'_j−P_j). For j<=13 their coefficient absolute sum is <10^16 (asserted using exact fractions), and degree<=15. For u>=0,
psi^(j)(u)=4 exp(u/2)sum_(n>=1)P_j(pi n²exp(2u))exp(−pi n²exp(2u)).
Reflection supplies odd/even derivatives at negative u. Exponential derivatives for g use the exact recurrence E0=1,E1=r,E_j=rE_(j−1)+2(j−1)lambda E_(j−2), r=1/4+2lambda*u.

The positive interval[0,3] is divided into3072 equal cells; every stated block edge is a cell boundary. Point jets through13 are computed at all endpoints and midpoints. Direct range jets are tightened for j<=9 by the midpoint cubic Taylor polynomial plus fourth-derivative interval remainder. Repeated interval multiplication is used for powers of a signed displacement. Higher derivatives retain their direct full interval enclosures.

Composite Simpson encloses every Gram entry. The exact fourth spatial derivative of u*g^(i)*g^(j) is
u sum_(k=0)^4 binom(4,k)g^(i+k)g^(j+4−k)+4 sum_(k=0)^3 binom(3,k)g^(i+k)g^(j+3−k).
For the reflected half, jets in the positive coordinate have alternating signs. Per-cell errors are bounded by width^5/2880 times the absolute range enclosure of this fourth derivative. The same formula with i=j=0 is applied to the actual residual jets for local energy integration. Fixed coefficient intervals enclose the actual endpoint residual everywhere; no coefficient is differentiated in u.

## Omitted theta orbits

For j<=13, z>=1, |P_j(z)|<=10^16*z^15 and exp(u/2)<=z^(1/4); hence each omitted orbit term is <=4e16*z^16 exp(−z). For n>=11, z>=3n²>=363 and z^16 exp(−z) decreases. Successive majorants have ratio at most (12/11)^32 exp(−69)<1e−18. The source verifies
4e16*363^16*exp(−363)/(1−1e−18)<1e−95.
Every evaluated theta derivative includes a symmetric1e−95 radius, including all Taylor remainder jets. No orbit is silently discarded.

## Infinite spatial tail

For u>=3 put z=pi exp(2u)>1200. A geometric orbit bound gives |psi^(j)(u)|<=8e16*z^16 exp(−z) for j<=13. For lambda in{0,1}, |r|<=3u and the finite exponential derivative formula gives |E_j|<=13!*2^13*(3u)^13. Together with a binomial sum<=2^13, this yields the generous estimate
|g^(j)(+/-u)|<=1e45*u^13*z^16 exp(u²+u/4−z)<=exp(−z/2).
The logarithm of the prefactor at u=3 is <250<600; its derivative is13/u+32+2u+1/4<=2u+37, less than the derivative z of z/2 for all u>=3. The constant inequality 8e16*13!*2^26*3^13<1e45 is elementary.

For scaled Gram entries the paired tail integrand is bounded by2u exp(−z). With |y_i|<1e10, the normalized residual is bounded by5e10 exp(−z/2), giving paired residual tail <=5e21*u exp(−z). Since z>=1200+2400(u−3), its integral is at most
5e21 exp(−1200)*(3/2400+1/2400²)<1e−100.
A symmetric1e−100 is therefore added to every scaled Gram entry and to the separate signed tail-energy block at each endpoint. The tail is not assumed positive.

## Scope and stopping condition

This finite certificate establishes the signed endpoint-block reserve for the degree9 ODD SAME-PARITY channel only, at a=1/4 and endpoints lambda0,1. It is NOT a certificate of the full mixed-parity H9 matrix or of all shifts a. It does not establish the residual path, an all-order recurrence, an all-shift theorem, or any general zeta-zero claim. Independent source/analytic-tail audit and independent replay both accepted this finite endpoint certificate; these are separate from the author result.
