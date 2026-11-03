# Quantitative exhaustion of unrestricted configurations from finite jet positivity

2 November 2026. A constructive reduction, not a proof of the remaining all-order positivity. Unlike the fixed-cluster theorems, the error estimate below has **no node-separation or occupancy restriction**.

## 1. Main finite-order theorem

Let K_a=C_a/a with its continuous zero-shift limit, 0≤a≤1/2. Suppose the actual origin derivative Gram H_m(a) is positive semidefinite through order m. For any J real nodes of diameter D and any complex coefficients b_j, the full kernel Gram G satisfies

    b*G b ≥ −6×10^8 q_D^(m+1) (Σ_j |b_j|)²,
    G ≥ −6×10^8 J q_D^(m+1) I,
    q_D = tanh(πD/2) < 1.                                (1)

There is no minimum spacing and J can be any finite integer. At D=0 the Gram is positive exactly. The bound is an additive possible-negative error, **not** a positive lower margin. Finite-order positivity does not allow the error to be silently set to zero.

If every H_m(a) is positive semidefinite, then for each fixed finite configuration, m→∞ in (1) proves G≥0. This constructively recovers the known all-order equivalence; it does not establish its unproved hypothesis. Uniform approximation across J,D requires tracking the displayed factors rather than interchanging unbounded limits.

The basis used below is the classical Meixner–Pollaczek family at parameters λ=1/2, φ=π/2, not a new family. Its generating function is standard: NIST DLMF18.23.7, https://dlmf.nist.gov/18.23.E7. We derive the needed orthogonality and error formula here. No historical-novelty claim is made.

## 2. An explicit complete-theta spectral envelope

For z=u+iy, |y|≤1/2 and u≥0, put r_n=πn²e^(2u). The complete theta series is analytic in this strip and satisfies

    |psi(u+iy)| ≤4e^(u/2) Σ_n (2r_n²+3r_n)e^(−r_n cos(2y)).

Since cos(2y)≥1/2 and5u²≤e^(2u), multiplication by exp(5u²/8) costs at most exp(r_n/24). Also e^(u/2)≤n^(−1/2)r_n. Splitting the remaining exponential gives

    e^(5u²/8)|psi(u+iy)|
      ≤4Σ_n n^(−1/2)(2r_n³+3r_n²)e^(−11r_n/24)
      ≤4[2·4³·3!+3·4²·2!] Σ_n n^(−1/2)e^(−r_n/6)
      <6912.

We used x^k e^(−x/4)≤4^k k!, π>3, and
Σ_n n^(−1/2)e^(−r_n/6)≤Σ_n e^(−n/2)=1/(e^(1/2)−1)<2.
The spare exp(−r_n/24) is discarded. Analytic evenness of the full theta profile extends the bound to negative u; finite-head reflection is not used.

Thus |psi(u+iy)|<6912 exp(−5u²/8) throughout the strip. With the uniform bridge weight h sinh(2ah)/a≤2h²cosh(h),

    |K_a(x+iy)| ≤6912² I exp(−5x²/4),
    I=2∫_0^∞ h²cosh(h)exp(−5h²/4)dh <3.

Indeed cosh(h)≤e^h≤exp(h²/4+1), so I≤e√π/2<3. Therefore

    ∫_R |K_a(x+iy)|dx <6·6912²<3×10^8, |y|≤1/2.

The same bound supplies domination and Gaussian decay on the vertical contour edges. Shifting the Fourier contour by sign-appropriate ±i/2 proves, with the original Fourier convention,

    |hat K_a(k)| < B exp(−|k|/2), B=3×10^8.               (2)

No spectral positivity is assumed. K_a remains the complete theta kernel, including all arithmetic/spatial tails and the a=0 limit.

Set η=1/2 and define the positive probability reference weight

    w_η(k)dk=(η/π)sech(ηk)dk.

For the signed spectral measure dμ_a=hat K_a(k)dk/(2π), (2) gives

    d|μ_a| ≤ M w_η(k)dk, M=B/(2η)=3×10^8.                (3)

This normalization is important: K_a(v)=∫exp(ikv)dμ_a(k).

## 3. Exact weighted polynomial approximation at every real location

Define real polynomials P_n by

    P_0(x)=1, P_1(x)=2x,
    (n+1)P_(n+1)(x)=2xP_n(x)−nP_(n−1)(x).

Their generating function is

    A(x,t)=Σ_(n≥0)P_n(x)t^n
          =(1+t²)^(−1/2)exp(2x arctan t), |t|<1.

They are orthonormal for sech(πx)dx. To verify this directly, for sufficiently small real t,s use

    ∫_R exp(cx)sech(πx)dx=sec(c/2), |c|<π.

Then ∫A(x,t)A(x,s)sech(πx)dx=1/(1−ts), and comparison of convergent power series gives ∫P_nP_l sech(πx)dx=δ_nl. The integral identity follows from the beta integral after substituting y=exp(2πx); it is not a positivity assumption on μ_a.

For any real v put q_v=tanh(πv/(2η)), s_v=sqrt(1−q_v²). Taking t=iq_v in the generating function gives

    exp(ikv)=s_v Σ_(n≥0) (iq_v)^n P_n(ηk/π).

The series converges in L²(w_η), as the squared coefficients sum to1, and its pointwise generating function identifies the limit. Define the degree-m truncation p_(m,v). Orthogonality gives the **exact** identities

    ||exp(ikv)−p_(m,v)||²_(L²(w_η))=|q_v|^(2m+2),
    ||p_(m,v)||²_(L²(w_η))=1−|q_v|^(2m+2)≤1.             (4)

Unlike a direct Taylor expansion, (4) converges at every finite v, not merely inside a small lag interval.

## 4. Proof of unrestricted-configuration bound

Translate all nodes by their midpoint so |v_j|≤D/2; stationary Gram entries do not change. Put f(k)=Σb_j exp(ikv_j), p(k)=Σb_j p_(m,v_j). The latter is a polynomial of degree≤m. Positivity of H_m is equivalent, by diagonal phase and polynomial-basis congruences, to ∫|p|²dμ_a≥0 for all such polynomials.

By (3),(4) and the triangle inequality,

    ||f−p||_(L²(|μ_a|))≤sqrt(M) Σ|b_j||q_(v_j)|^(m+1),
    ||f||_(L²(|μ_a|)), ||p||_(L²(|μ_a|))≤sqrt(M) Σ|b_j|.

Consequently

    |∫(|f|²−|p|²)dμ_a|
      ≤||f−p||_(L²(|μ_a|))(||f||+||p||)
      ≤2M q_D^(m+1)(Σ|b_j|)².

This proves (1), since η=1/2 and max|v_j|≤D/2 give q_D=tanh(πD/2). The operator bound follows from (Σ|b_j|)²≤JΣ|b_j|². The coefficient norm is stated explicitly, so close-node cancellation or changing Newton coordinates cannot conceal a growing constant.

## 5. Geometry-aware relative certificate and exact remaining cost

The preceding universal bound can retain more of the coefficient geometry. Let W be the positive reference Gram for w_η and W_m its polynomial-projection Gram. With q_j=q_(v_j), s_j=sqrt(1−q_j²),

    W_jl=s_j s_l/(1−q_jq_l)=sech(π(v_j−v_l)/(2η)),
    (W_m)_jl=s_j s_l Σ_(n=0)^m(q_jq_l)^n,
    T_m=W−W_m=diag(q_j^(m+1)) W diag(q_j^(m+1)) >=0.       (5)

For given b set x=b*W_m b and y=b*T_m b. If the actual polynomial spectral form obeys Q_μ(p)≥γx, then

    Q_μ(f)≥γx−M(2sqrt(xy)+y).                            (6)

In particular, if T_m≤τW_m and γ>M(2sqrt(τ)+τ), then the full configuration is positive. Equation(6) is a valid relative criterion, not an assertion that γ or τ is already controlled uniformly.

For distinct J nodes and m≥J−1, W_m is positive definite because its coefficient matrix is a scaled Vandermonde in the distinct real q_j. For each fixed configuration, τ→0 as m→∞. But the actual polynomial positivity margin γ can also tend to zero; positivity alone supplies no order-uniform lower bound. This is the precise coupling/margin obligation, without inverse raw node gaps hidden in the notation. At repeated evaluation nodes, restrict to the common range or use the corresponding confluent channels; do not invert a singular matrix.

## 6. Why adaptive centers do not automatically close the proof

A common center may always be translated away. Using separate centers for different clusters replaces polynomial features by exp(ikx_j)P_n(k). Their mixed Gram entries involve K derivatives at x_j−x_l. Origin H_m positivity controls only the diagonal local blocks, not these mixed matrices. Assuming their positivity would insert the desired global statement through a new basis.

If nearby centers are merged until a fixed spacing holds, local occupancy becomes unbounded. If occupancy is held fixed, arbitrarily dense configurations force inter-cluster gaps to zero and the existing Gaussian block-Schur contraction fails. Rescaling a dense cluster does not remove this: it rescales derivative orders and the spectral reference norm together. Any successful multiscale proof must bound the actual mixed-block elimination cost or establish all-order origin positivity with controlled tails.

The constructive approximation above avoids geometric decomposition altogether, but honestly retains the remaining all-order positivity requirement. It offers a way to turn a certified finite order into a finite, geometry-unrestricted negative-error bound, and a quantitatively stated exhaustive limit if the missing all-order mechanism is proved.

## 7. Size of the conditional finite-order bound

The bound is deliberately conservative because the complex-strip majorant B is very large. The diagnostic script reports illustrative floating evaluations, not additional interval-certified theorems. Conditional on H5 positivity, at m=5 the additive error per factor J is approximately:

    D=.001: 9.01×10^(−9),
    D=.005: 1.41×10^(−4),
    D=.01: 9.01×10^(−3),
    D=.1: 8.58×10^3,
    D=1: 3.57×10^8.

Thus the result is useful as a scalable reduction and for sufficiently narrow arbitrary-occupancy configurations; it is not numerically strong for moderate diameter at current low orders. It never upgrades a small negative allowance to exact positivity. Improving B is possible through a tighter complete-theta strip enclosure but does not itself solve the all-order sign problem.

## 8. Exact obstruction to improving the global polynomial degree by recentering

The truncation in (4) is the orthogonal projection onto all polynomials of degree≤m. Consequently its error |q_v|^(m+1) is the **smallest possible** L²(w_η) error for that exponential among all such polynomials, not merely an upper bound from one convenient construction.

For a set of diameter D, every common center leaves at least one endpoint at distance≥D/2. The midpoint achieves equality. Thus any approach which approximates every individual exponential by degree-m polynomials in this same reference norm has worst-endpoint error at least q_D^(m+1), regardless of its choice of polynomial coefficients or common center. To reach reference error ε at that endpoint it must have

    m+1 ≥ log(1/ε)/[−log(q_D)].

For η=1/2 and large D, −log(tanh(πD/2))~2e^(−πD), so this degree is asymptotic to(1/2)e^(πD)log(1/ε). This is a rigorously identified limitation of the global-polynomial/reference-norm strategy, not a lower bound for every conceivable RH proof or for approximating a special coefficient combination with cancellations.

Separate local centers could evade this particular approximation barrier, but then they introduce the mixed exponential-polynomial Grams described in Section6. Their positivity/coupling cannot be inferred from origin jets alone without further work. This pinpoints the tradeoff between a genuine exhaustive norm bound and an unproved multiscale compatibility assumption.
