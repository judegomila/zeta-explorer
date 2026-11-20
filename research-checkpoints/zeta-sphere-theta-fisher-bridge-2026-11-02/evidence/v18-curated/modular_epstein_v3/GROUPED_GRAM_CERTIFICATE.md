# A verified finite relative-Gram bound for the corrected Ewald grouping

2 November 2026. **Exactly three real nodes; all complex coefficient vectors; uniform 0<a<=1/2. Not arbitrary-node positive definiteness or RH.** Independent review status is recorded separately.

## The finite theorem

Use the exact axis-closure construction D_(a,N) and full kernel C_a from GROUPED_EWALD_CANDIDATE.md. Take N=3 and nodes

    v=(0,1/4,1/2).

Define Hermitian matrices

    D(a)=[D_(a,3)(v_j−v_k)/a],
    G(a)=[C_a(v_j−v_k)/a],
    E(a)=G(a)−D(a).

For EVERY 0<a<=1/2 the following bounds hold:

    lambda_min(D(a)) > 57/5000,
    ||E(a)||_2 < 3/2500,
    E(a) >= −(2/19)D(a),
    G(a)>0.                                                (1)

Indeed the construction also gives the direct lower bound lambda_min(G(a))>63/5000. These inequalities apply to all complex coefficient vectors in C³ on these fixed real nodes. They do not establish C_a positive definite for arbitrary nodes or matrix sizes. The endpoint a=1/2 is taken by the continuous removable extension; the difficult open range is included. The bounds stay finite as a decreases to zero.

This is a completed instance of a **grouped arithmetic candidate plus a rigorous relative remainder bound**. No individual Bessel block or individual Ewald orbit is declared positive definite.

## 1. Rigorous uniform remainder constant

The prior derivation proves, uniformly for 0<a<=1/2,

sup_v |C_a(v)/a−D_(a,3)(v)/a| <= epsilon_3,
epsilon_3=150(2pi)^3 sum_(k>=4) k^4e^(−2pi k) < 1/2500.     (2)

Here is an elementary verification of the final rational upper bound. Since 2pi>6 and e^6>400, the first series term is less than 4^4/400^4=10^(−8). Each ratio of successive terms is less than (5/4)^4/400<1/100. Also 150(2pi)^3<37500, using pi<22/7. Hence epsilon_3<37500*10^(−8)/(1−1/100)<1/2500.

Thus every entry of E(a) has absolute value below 1/2500 and ||E(a)||_2<3/2500. This includes the entire omitted nonaxis lattice tail, not a finite-index-only assertion.

## 2. Validated grouped-head values at a=1/4

The original interval script certify_grouped_gram.py evaluates the corrected arithmetic expression itself, including the exact axis closure via its theta-tail integral. It does not infer the grouped-head values by assuming positivity of the full kernel.

The stored enclosures in grouped_gram_intervals.json are, rounded outward here:

    0.0315296888487903 < D_(1/4,3)(0)/(1/4) < 0.0315314437757470,
    0.0071236291491466 < D_(1/4,3)(1/4)/(1/4) < 0.0071254943693066,
    0.0000596303271826 < D_(1/4,3)(1/2)/(1/4) < 0.0000600216655968.

In particular

    D_0>31/1000,  |D_1|<1/125,  |D_2|<1/1000.

Gershgorin's theorem then gives

    lambda_min(D(1/4)) > 31/1000−2/125=3/200.               (3)

No numerical eigenvalue computation is used in this certificate. The exploratory eigenspectrum in explore_grouped_output.txt is a separate sanity check, not evidence for (3).

## 3. Validated complete-theta moments controlling all shifts

For each lag v∈{0,1/4,1/2}, define the positive full-profile integral

    M(v)=integral_0^infinity h^4 cosh(h)psi(h−v)psi(h+v)dh.

The second interval script certify_shift_moments.py proves

    M(v)<3/2500=0.0012                                     (4)

at all three lags. Outward short enclosures are

    M(0)   in (0.0011707303574835, 0.0011708635930365),
    M(1/4) in (0.0002229965731591, 0.0002232089242181),
    M(1/2) in (0.0000012167545377, 0.0000012942728595).

All theta and integration tails are retained. This moment step controls shift dependence, not positivity of an arbitrary matrix.

For s>=0,
s cosh(s)−sinh(s)=integral_0^s u sinh(u)du<=s^3cosh(s)/3.
Differentiating the exact normalized kernel gives, for 0<a<=1/2,

0<=partial_a[C_a(v)/a]
 <=(8a/3)integral h^4cosh(2ah)psi(h−v)psi(h+v)dh
 <=(4/3)M(v)<1/625.                                      (5)

Consequently the normalized full kernel changes by less than 1/2500 between a=1/4 and ANY a∈(0,1/2]. Matrix-wise,

    ||G(a)−G(1/4)||_2<3/2500.                              (6)

The a→0 limit is controlled by sinh(2ah)/a→2h; no division of an absolute error by a appears.

## 4. Relative domination for the whole shift range

Combining (2), (3) and (6),

||D(a)−D(1/4)||_2
 <=||G(a)−G(1/4)||_2+||E(a)||_2+||E(1/4)||_2
 <9/2500.

Thus

lambda_min(D(a))>3/200−9/2500=57/5000.

Whitening the exact error gives

||D(a)^(−1/2)E(a)D(a)^(−1/2)||_2
 <(3/2500)/(57/5000)=2/19.

This proves the relative inequality in (1). Separately,

lambda_min(G(a))>3/200−3/2500−3/2500=63/5000.

The constant relative bound is for this one specified three-node family, uniform in the complete stated shift interval. It says nothing about node collisions, arbitrarily separated nodes, increasing matrix dimension, or unbounded Fourier height.

## 5. How the grouped quadrature is validated

The calculation uses a=1/4, N=3, 50-digit mpmath interval arithmetic, exact dyadic interval nodes, and 60-digit auxiliary dyadic/serialization arithmetic. On x∈[1,32], the integrand is an exact finite sum of terms

    coefficient * x^b (log x)^ell exp(−c x), ell∈{0,1},

where b is a rational number and c is an enclosed positive arithmetic expression. These terms follow by expanding cosh(a log x) and (log x)sinh(a log x)/a after the direct/dual pairing.

For the interior terms, with c=pi Q_nm(v), z=2pi[m²e^(2v)−n²e^(−2v)],

D_v² exp(−cx)=[z²x²−4cx]exp(−cx),
D_v⁴ exp(−cx)=[z⁴x⁴−24cz²x³+(16z²+48c²)x²−16cx]exp(−cx).

For the axis terms including e^v, polynomial coefficients are generated by
p_0(y)=1, p_(j+1)(y)=(r−2y)p_j(y)+2y p_j'(y), r=0 or 1.
The L_a and partial_a L_a coefficients are then applied exactly as in the analytic grouping. The script's prefactors are 1/16 for a positive-quadrant interior contribution and 1/32 for each expanded axis theta term, before expanding cosh/sinh into their two powers.

For a rational b, derivatives of x^b and x^b log x are computed from exact falling-factorial coefficients and their b derivatives:

D_x^j(x^b log x)=x^(b−j)[(b)_j log x+partial_b(b)_j].

The fourth derivative of each whole term is enclosed by the product rule with exp(−cx). Composite adaptive Simpson enclosures use the explicit remainder d^5 sup|F''''|/2880 on every accepted interval, with total requested absolute tolerance 10^(−5). Correctness comes from the summed interval enclosures, not from the tolerance request. Recorded accepted interval counts are 105,83,53 for the three lags. Symmetric 10^(−30) inflation protects serialization.

### Exact arithmetic axis tail, n>=7

Only the n<=6 axis terms are numerically integrated. For v∈[0,1/2], elementary bounds on the axis derivative polynomials give

|axis_n/a|<=50 integral_1^infinity x^(A−1/2)[1+(log x)^2]y^4e^(−y)dx,
y=pi n²e^(2v)x, A=1/4.

For n>=7, monotonicity of y^4e^(−y) and the same x-integral estimate as the grouped tail bound give an integrated majorant

    250(pi n²)^3e^(−pi n²).

Its sum over n>=7 is below 10^(−50). For example bound it by
16000 sum_(n>=7)n^6e^(−3n²); the first term is below 16000*7^6/20^49, and subsequent ratios are below 10^(−18). This is much smaller than 10^(−50). The omitted axis tail is added as a symmetric error, not assumed to have a spectral sign.

### Infinite x-integration tail

For x>=32 and all retained axis terms, the preceding bound is at most 8100x^6e^(−3x) per index. For each retained interior term it is at most 56*6^4 x^6e^(−6x). There are six axis indices and nine interior pairs. The elementary integral estimate

integral_32^infinity x^6e^(−b x)dx
 <=32^6e^(−32b)/(b−6/32), b∈{3,6},

proves that their TOTAL tail is below 10^(−24) (use e^6>400 if rational exponential bounds are desired). The script adds this full symmetric error after integration.

## 6. How the shift moments are validated

certify_shift_moments.py reuses the full-theta derivative enclosures from the independently reviewed near-zero certificate in modular_v2/certify_zero_window.py. It includes the entire n>=7 derivative tail for orders 0,...,4. Initial intervals split at h=v, so even-extension derivative parity is applied without a straddling ambiguity.

The fourth derivative of h^4psi(h−v)psi(h+v)cosh(h) is enclosed by exact Leibniz formulas. Simpson remainder enclosures use absolute tolerance 10^(−6), with the actual interval errors summed. The omitted h>=4 integrands are bounded by

    10^4exp(14h−2pi exp(2h)),

whose integral is below 10^(−3000). This tail and symmetric 10^(−30) serialization slack are included. The stored moment enclosures imply (4) with substantial margin.

## 7. Scope

This is a verified finite relative-Gram certificate for a genuinely direct/dual grouped arithmetic construction, valid through arbitrarily small positive shifts. It demonstrates that the exact closure block and remainder estimates can be used constructively.

It does not factor the full kernel into positive blocks, make individual Bessel terms positive, or establish all finite Gram tests. The relative margin can deteriorate or disappear when the nodes or dimension change. Extending the certificate to a compatible exhaustive family remains the global RH-equivalent task.
