# Uniform collision-stable three-node certificate with an exact grouped tail

2 November 2026. **Arbitrary positions and collisions, but at most three real nodes of diameter ≤1/1000. Uniform 0<a≤1/2. No unbounded-cardinality or global-PD conclusion.**

Let K_a(v)=C_a(v)/a and let D_(a,12) be the corrected grouped Ewald kernel with the entire axis/pole closure and the nonaxis square n,m≤12. Write

    K_a = D_(a,12)/a + E_a.

For ANY at most three real nodes lying in an interval of length 1/1000, and all complex coefficient vectors,

    [E_a(x_i−x_j)] >= −10^(−9)[D_(a,12)(x_i−x_j)/a].       (T)

The grouped candidate matrix is positive definite for distinct nodes; at repeated evaluation nodes the statement is positive semidefinite and follows by continuity. The confluent derivative-feature matrix remains strictly positive in the normalized coordinates described below.

This is a continuum of finite tests, not a sampled grid. The relative constant does not deteriorate with minimum node separation. The grouped tail and all numerical enclosures retain the complete arithmetic/spatial tails.

## 1. Validated full-kernel confluent data, uniformly down to a=0

For r=0,2,4,

K_a^(r)(0)=integral_0^infinity [h sinh(2ah)/a]
    sum_(j=0)^r binomial(r,j)(−1)^j psi^(j)(h)psi^(r−j)(h)dh.

The interval code certify_confluent_jets.py encloses this whole family for 0<a≤1/2, using the pointwise interval

    2h² <= h sinh(2ah)/a <=2h²cosh(h).

Its output, widened outward here, is

    0.0314381158818062 < K_a(0) < 0.0325561190016723,
    −1.535908142319402 < K_a''(0) < −1.477092157531453,
    205.1262234689067 < K_a^(4)(0) < 214.3816179969517.

Thus the simpler exact bounds

    K_a(0)>0.0314,
    −1.536<K_a''(0)<−1.477,
    K_a^(4)(0)>205                                           (1)

hold throughout the entire shift range.

Set alpha=(1,1/10,1/100) and
H_ij=alpha_i alpha_j(−1)^j K_a^(i+j)(0), i,j=0,1,2.
Evenness makes the odd entries zero. The three Gershgorin lower margins from (1) are respectively

    0.0314−0.01536=0.01604,
    0.01477,
    0.0205−0.01536=0.00514.

In particular

    lambda_min(H)>1/200=0.005.                             (2)

The factorial convention is important: Newton rows are alpha_i i![x_0,...,x_i]. The limiting H above has NO additional factorial denominator.

## 2. Validated local derivative envelopes

The independently reproducible upper-sum code certify_local_derivative_bounds.py encloses, simultaneously for every |v|≤1/1000 and 0<a≤1/2,

    |K_a^(4)(v)| < 308.053128 <310,
    |K_a^(6)(v)| <100324.722835 <101000.                     (3)

It integrates an interval enclosure of the absolute derivative integrand over 2048 cells of width 1/512 on h∈[0,4], with the whole v interval included in every cell. This is a rigorous upper Riemann sum, not an unvalidated quadrature of an absolute value. Infinite theta and spatial tails are enclosed as described below.

Evenness and (1)–(3) imply

    |K_a''(v)| <=1.536+(310/2)10^(−6)<1.537.                (4)

## 3. Every clustered configuration is covered

Apply the factorial-scaled Newton congruence from NEWTON_NATIVE_FRAMEWORK.md. Every transformed entry is an average of alpha_i alpha_j(−1)^j K_a^(i+j)(u) with |u|≤delta=1/1000, regardless of individual node gaps.

Using evenness, (3)–(4), and Taylor's integral remainder, the entrywise error between the transformed full Gram B_K and H is bounded by the symmetric matrix

    [[0.0000007685, 0.0001537, 0.00000155],
     [0.0001537,    0.00000155,0.00031],
     [0.00000155,   0.00031,   0.00000505]].                (5)

For example the odd (1,2) entry is bounded by alpha_1 alpha_2 delta*310=0.00031; the even (2,2) difference by alpha_2²delta²*101000/2=0.00000505. The largest row sum is 0.00046525<1/2000. Hence

    lambda_min(B_K)>1/200−1/2000=9/2000=0.0045.            (6)

No minimum separation enters. Translation of the entire cluster is immaterial because the kernel is stationary.

## 4. The grouped tail in a complex strip

Only the omitted NONAXIS orbits remain in E_a. For z=x+iy, |y|≤1/16,

Re Q_nm(z)=cos(2y)Q_nm(x)>=gamma Q_nm(x), gamma=99/100,
|D_z^ell Q_nm(z)|<=2^ell Q_nm(x).

Indeed cos(1/8)>=1−1/128>99/100. The normalized differentiated direct/dual weights obey the same estimates as in the earlier real-axis tail proof. For s=2pi nm and R=pi u Q_nm(x), one obtains

|I_(a,nm)(z)/a|
 <=28 integral_1^infinity u^(A−1/2)[1+(log u)²]R^4e^(−gamma R)du,

uniformly 0<a≤A≤1/2. Since R>=su>=2pi>4/gamma, monotonicity of R^4e^(−gamma R) gives

sup_|Imz|<=1/16 |I_(a,nm)(z)/a|
 <=170s³e^(−gamma s).                                     (7)

For detail, put d=gamma s−A−7/2. Then gamma s>5.94, d>1.94, and
1/d+2/d³<=5/(gamma s); this and the factor 28 yield 140/gamma<170. All parameter derivatives are paired before estimating; no 1/a pole is introduced.

Using the divisor bound and 2pi<44/7,

sup_|Imz|<=1/16 |E_a(z)|
 <=170(2pi)^3 sum_(k>=13)k^4e^(−gamma2pi k)
 <42500 sum_(k>=13)k^4/300^k
 <[42500*100*13^4]/[99*300^13] <10^(−23).                  (8)

Here e^(5.94)>300 and successive series ratios are below 1/100. The elementary exponential inequality can be verified by its positive power series. The exact rational bound is checked by verify_cluster_certificate.py.

Cauchy's derivative estimate on circles of radius 1/16 now gives, for every real v and every r≤6,

    |E_a^(r)(v)| <= r!16^r*10^(−23) <10^(−12).             (9)

The same holds uniformly as a decreases to zero, because the paired normalized expression is analytic in a² and the preceding bounds are uniform. The a=1/2 endpoint is the removable continuous limit of the exact closure construction.

## 5. Relative error after collision normalization

By the simplex formula, (9), and alpha_i≤1, every entry of the transformed tail B_E has absolute value below 10^(−12). Thus ||B_E||<3×10^(−12). From (6),

    B_D=B_K−B_E > (1/250) I,
    ||B_D^(−1/2)B_E B_D^(−1/2)||
       <(3×10^(−12))/(1/250)=7.5×10^(−10)<10^(−9).

This proves (T) by exact congruence for distinct nodes. Repeated evaluation nodes follow by continuity, with their common null directions retained rather than artificially inverted. If derivative evaluations are desired at a repeated node, the confluent form itself satisfies the same positive margin.

The argument uses certified actual theta jets to establish the finite feature margin, not an assumption that K is globally PD. It also shows why the raw small eigenvalue of a nearly colliding evaluation Gram is the wrong denominator for this task.

## 6. Full theta derivative enclosure used by the interval runs

For u≥0, r_n=pi n²e^(2u),

psi^(j)(u)=4e^(u/2)sum_(n>=1)p_j(r_n)e^(−r_n),
p_0(r)=2r²−3r,
p_(j+1)=(1/2−2r)p_j+2r p_j'.

The code generates exact rational coefficients through j=10 and verifies that every sum of absolute coefficients is below 10^30; degrees are at most12. It retains n≤10 and encloses the remainder, for every j≤10, by

    10^(−80)e^(u/2−r)(1+r)^12, r=pi e^(2u).

Indeed its absolute bound is at most
4×10^30 e^(u/2−r)(1+r)^12 sum_(n>=11)n^24e^(−pi(n²−1)).
The first coefficient is bounded by 4×10^30*11^24/20^120, and successive ratios are below10^(−20); the resulting rational bound is below10^(−80). Odd derivative parity is explicitly enclosed across u=0; the true full profile, not a finite even reflection, is used.

For h≥4 and |v|≤1/1000, a common very coarse majorant for every ACTUAL integral tail in these runs is

    10^100 exp(60h−5e^(2h)).

To verify it, for u≥3 the generated coefficient bound and a geometric Gaussian-index estimate give |psi^(j)(u)|≤10^42 exp(24.5u−pi e^(2u)), j≤10. Multiplying at h±v, summing the finite Leibniz coefficients and including 2h²cosh(h) gives the displayed larger majorant. Its integral from4 onward is below10^(−2500), by the tangent inequality and e^8>2500. This symmetric tail allowance is included, together with10^(−30) serialization slack.

## 7. Validated quadrature details

For the uniform-a jets, write the weight as
w_a(h)=2h² integral_0^1 cosh(2ahs)ds.
It lies in [2h²,2h²cosh h]. For k≤4 its absolute h derivative is bounded by

2cosh(h)sum_(ell=0)^min(2,k)binomial(k,ell)2!/(2−ell)!
                           h^(2−ell)/(k−ell+1).

The factors 1/(k−ell+1) come from integrating s^(k−ell), not from a numerical approximation. Combine this with exact Leibniz derivatives of the two-profile product to enclose the fourth h derivative uniformly in a. Adaptive Simpson error intervals use d^5 sup|F''''|/2880. The three requested error tolerances are10^(−7),10^(−5),10^(−3) for jet orders0,2,4, with every actual interval remainder summed. The recorded run accepted174 cells. Arithmetic uses 50-digit intervals and60-digit auxiliary dyadic/serialization calculations.

The local derivative envelopes use positive upper cell sums, so no smoothness assumption about an absolute value is required. All data are in confluent_jet_intervals.json and local_derivative_bounds.json. Exploratory numbers in explore_jets_output.txt are not used in the proof.

## 8. Limits

This result extends the previous fixed-three-node certificate to ALL three-node configurations in a small cluster, uniformly in shift and without a separation condition. It does not allow unbounded node count or unbounded cluster diameter. The all-order theorem in NEWTON_NATIVE_FRAMEWORK.md explains why proving every confluent level would already establish the missing global spectral sign; no such propagation is supplied here.
