# Arithmetic frequency separation: fixed-bandwidth degeneracy and a shared-kernel boundary

2026-11-04. Analytic working note. No full-selected upper bound is proved. No frozen file or 4CT artifact is changed.

## Results first

1. The leading fixed-rational-twist arithmetic matrix is the positive GCD kernel

       K(a,b)=gcd(a,b)/sqrt(ab).

   Both the leading log-cubed source potential and the leading log value form retain this same matrix. Its positivity is useful, but it is **not uniformly coercive even if every log frequency is restricted to an arbitrarily short fixed interval**. A complete elementary proof is given below. This strengthens a growing-bandwidth tensor example: it really keeps the final frequency bandwidth fixed.

2. This degeneracy does **not** establish failure of arithmetic frequency separation. In fact the paired-prime families used in the proof obey a uniform bounded-bandwidth Bernstein inequality in their own K norm. Small eigenvalues and failure of a K-metric derivative bound are different questions.

3. The general dimension-independent shared-kernel Bernstein inequality nevertheless **fails**: on every fixed-ratio integer interval [N,exp(B)N], centered log-frequency multiplication has K-metric norm at least c_B sqrt(log N). An explicit smooth coefficient vector proves this through the exact divisor factorization. This is a separate argument from the small-eigenvalue construction.

4. This growth alone does not refute selected decay. A bound growing slowly with arithmetic complexity could still be enough when physical height and polynomial degree are coupled to that complexity. Uniform relative arithmetic errors and full-selected localization remain missing.

## 1. The arithmetic matrix, with all rational cross terms

Let a_1,...,a_r be distinct positive integers and let

    f(t)=sum_j c_j exp(i t log a_j).

A common real shift of every frequency changes neither |f| nor the matrix below. For fixed a,b, reducing a/b=A/B gives the already proved rational-twist coefficient 1/sqrt(AB)=gcd(a,b)/sqrt(ab). Accordingly, for each **fixed finite** family and coefficient vector,

    integral_T^(2T) Z'(t)^2 |f(t)|^2 dt
       =(T log^3 T/12) c* K c + O_f(T log^2 T),             (1)
    integral_T^(2T) L_Z(t) |f(t)|^2 dt
       =(T log^3 T/6) c* K c + O_f(T log^2 T).              (2)

For real coefficient vectors, the paired off-diagonal terms in |f|^2 combine into cosines. Thus the supplied cosine-twist formulas suffice, whether or not the frequencies themselves are symmetric. The construction in Section 2 additionally makes f real and even.

The ordinary twisted Z^2 moment has the corresponding leading coefficient

    integral_T^(2T) Z(t)^2 |f(t)|^2 dt
       =T log T c* K c + O_f(T).                           (3)

For the real coefficient families used below, this also follows by the same Riemann-Siegel difference/sum phase proof as the supplied derivative twist, with the lambda factors deleted. The resonant density is log(t)/sqrt(AB), and possible sum-phase stationary pairs cost O(T). This derivation is finite-family only.

In the rest of this note, equations (1)-(3) are used only for real coefficient vectors, for which the paired terms in |f|^2 combine into cosine twists. No complex sine-twist extension is claimed as an input. For any finite set of integer frequencies, K is strictly positive definite. The elementary factorization is

    c* K c = sum_d phi(d) |sum_(j:d divides a_j) c_j/sqrt(a_j)|^2.   (4)

The sum is finite. It follows from gcd(a,b)=sum_(d|a,d|b)phi(d). Positivity also follows prime by prime from the matrices (p^(-|k-l|/2)). No cross term has been discarded.

After clearing a common denominator, the same formula applies to any finite set of positive rational frequency labels. A common scaling does not change K.

## 2. Fixed-bandwidth noncoercivity theorem

**Theorem.** For every B>0 and epsilon>0 there are distinct positive integers a_1,...,a_r, a real center gamma, and a nonzero coefficient vector c such that

    |log a_j-gamma| <= B for every j with c_j != 0,
    c* K c < epsilon sum_j |c_j|^2.                       (5)

The coefficients can be chosen so that f(t)=sum c_j exp(it(log a_j-gamma)) is real and even. Thus (5) is not an artifact of complex coefficient cancellation. The same statement holds on an arbitrarily short log interval, independent of dimension.

### 2.1 A disjoint paired-prime sequence

Pair consecutive primes as (q_j,p_j), with q_j<p_j, using each prime at most once. Write

    delta_j=log(p_j/q_j),     rho_j=(p_j q_j)^(-1/2).

Discard the finitely many small pairs and every pair for which

    delta_j > (log q_j)^(-2).                             (6)

The retained sequence has

    sum rho_j=infinity,       sum delta_j^2<infinity.      (7)

Here are elementary details, so that no small-prime-gap conjecture or prime number theorem is hidden in (7).

Bertrand's postulate gives p_j<2q_j once q_j>1. Thus rho_j is comparable to 1/q_j. Euler's divergence of the prime reciprocal sum implies divergence of the reciprocal sum of the smaller primes in these disjoint consecutive pairs, and hence divergence of sum rho_j before discarding.

For pairs with 2^k<=q_j<2^(k+1), their disjoint intervals [log q_j,log p_j] lie in an interval of length at most 2 log 2. Consequently

    sum_(q_j in this shell) delta_j <=2 log 2.            (8)

Each discarded delta_j exceeds a constant times k^(-2), so at most C k^2 pairs in this shell are discarded. Their total rho_j is at most C k^2 2^(-k), summable over k. Removing them therefore preserves divergence of sum rho_j. For retained pairs, delta_j<=C k^(-2), so (8) gives

    sum_(retained q_j in this shell) delta_j^2 <=C k^(-2).

This proves (7). Discarding any further initial segment preserves the first assertion and makes the second sum as small as desired.

We also use the elementary upper bound

    sum_(prime p<=x) 1/p <= C log log(3x).                 (9)

For completeness, take sigma=1+1/log x. Since p^(sigma-1)<=e for p<=x, the left side is at most e sum_p p^(-sigma)<=e log zeta(sigma)<=C log log(3x). This requires only the absolutely convergent Euler product for sigma>1.

### 2.2 The full tensor cube and its alternating eigenvector

Take the first m retained pairs after a suitably large initial cutoff. For s=(s_1,...,s_m) in {0,1}^m set

    r_s=product_j (p_j/q_j)^(s_j),
    x_s=sum_j(s_j-1/2)delta_j.

The r_s are distinct by unique factorization. Their pairwise reduced quotients give exactly

    K_(s,u)=product_j rho_j^(|s_j-u_j|)
           =tensor_j [[1,rho_j],[rho_j,1]].              (10)

Let D_m=diag(x_s), and let v_s=2^(-m/2)(-1)^(sum s_j). Then ||v||_2=1 and

    K_m v=ell_m v,     ell_m=product_j(1-rho_j)->0.       (11)

The full cube's frequency range grows. The next step, which cannot be omitted, actually restricts its frequencies to [-B,B].

### 2.3 Smooth central-slab restriction preserves small K-energy

Choose a real even smooth function chi supported in [-B,B], equal to one on [-B/2,B/2]. Choose the initial prime cutoff so that

    sum_(retained pairs after cutoff) delta_j^2 <= B^2/4.

For the uniform random cube point, x_s has mean zero and variance (1/4)sum delta_j^2<=B^2/16. Chebyshev's inequality therefore gives

    ||chi(D_m)v||_2^2 >= 3/4                             (12)

for every m. Only coordinates with |x_s|<=B survive.

The exact phase-twisted energy is

    ||K_m^(1/2) exp(itD_m)v||_2^2
       =product_j [1-rho_j cos(t delta_j)]
       =ell_m product_j [1+rho_j(1-cos(t delta_j))/(1-rho_j)]. (13)

Uniformly in m,

    sum_j rho_j min(t^2 delta_j^2,1) <= C log(2+|t|).      (14)

To prove this, put Y=exp((2+|t|)^(2/3)). The q_j<=Y terms are at most C log log(3Y) by (9). For q_j>Y use (6), rho_j<=1/q_j, and the sum over all positive integers as an upper bound:

    t^2 sum_(q_j>Y) rho_j delta_j^2
       <= C t^2 sum_(n>Y) 1/[n(log n)^4]
       <= C t^2/(log Y)^3 <= C.

After absorbing the finitely many small values into C, (13)-(14) imply

    ||K_m^(1/2) exp(itD_m)v||_2 <= C sqrt(ell_m)(2+|t|)^C. (15)

Fourier inversion for chi and the triangle inequality in Euclidean space now give

    ||K_m^(1/2)chi(D_m)v||_2
       <= C sqrt(ell_m) integral |chi_hat(t)|(2+|t|)^C dt
       <= C_B sqrt(ell_m).                              (16)

The integral is finite because chi is smooth and compactly supported. In conjunction with (12), this proves that the nonzero vector c=chi(D_m)v has Rayleigh quotient at most C_B ell_m, which tends to zero.

Clear the common denominator of r_s by multiplying every label by product_j q_j. The resulting integer labels are

    a_s=product_(s_j=1)p_j product_(s_j=0)q_j.

Their center gamma=(1/2)sum_j(log p_j+log q_j) satisfies log a_s-gamma=x_s. This proves (5).

Finally take m even. Complementing all bits replaces x_s by -x_s and leaves c_s unchanged, because chi is even and (-1)^(m-sum s_j)=(-1)^(sum s_j). Hence f is a real even trigonometric polynomial. All estimates hold along this even subsequence. This completes the theorem.

### 2.4 Every sufficiently large fixed-ratio integer window

For every fixed b>0, let K_R be the GCD matrix on all integers in [R,exp(b)R]. Then

    lambda_min(K_R)->0 as R->infinity.                   (23)

Indeed choose the preceding finite bad block with max a_j/min a_j<exp(b/2), using B<b/4. For all sufficiently large R there is a positive integer k in

    [R/min a_j, exp(b)R/max a_j].

The length of this interval tends to infinity, so such an integer exists. Integer dilation preserves every GCD-kernel entry, and k a_j all lie in the full window. Its smallest eigenvalue is therefore at most the chosen bad block's Rayleigh quotient. Since that quotient can be made arbitrarily small first, (23) follows. This gives no rate in R.

## 3. What transfers to the actual theta potential

For each fixed epsilon, fix the finite real even modulation f supplied by the theorem. The fixed-twist asymptotics (1)-(3), combined with the positive Poisson/gamma envelope average from the earlier rational-twist note, give

    [sum_d mu_d Q[t^d f(t)]] / [sum_d mu_d Qbar[t^d f(t)]]
       -> c* K c / ||c||_2^2 < epsilon,                 (17)

where d ranges over a fixed linear block [N,2N],

    mu_d=(pi/2)^(2d)/(2d)!,
    Q=X-H,
    Qbar[p]=(1/3) integral a(t)^2 log(2+|t|)^3 |p(t)|^2dt.

The expression t^d f(t) is initially only a comparison function. If B<pi/4, replace each cosine in f by its Taylor polynomial of degree 2 ceil(CN), using the already proved full-line gamma-moment remainder bound. Here C depends only on B, while the finite coefficient prefactor depends on the chosen epsilon-block and is absorbed by taking N sufficiently large. The largest nonzero cosine frequency eventually dominates the highest retained Taylor coefficient, so its degree really is 2 ceil(CN) for sufficiently large N, rather than merely being bounded by that degree. The resulting genuine algebraic polynomials have degree comparable to N and exponentially small compact/exterior tails, as in the earlier rational-twist construction. Their individual gamma-weighted value norms stay comparable to the monomial norm: fixed nonzero frequency cross terms vanish under the gamma concentration/characteristic-function estimate, leaving ||c||_2^2. Thus the tail normalization is positive even though f need not be bounded below pointwise.

Since all denominator weights are positive, (17) shows: for every epsilon>0 there are genuine bulk-concentrated polynomials of arbitrarily large degree with

    Q[p]/Qbar[p] <= 2 epsilon.                           (18)

This is a failure of a degree-uniform positive **scalar** lower comparison Q>=c Qbar on that cone. It is not a statement that Q is negative, and it is not a full-selected counterexample. If fixed parity is required, use the corresponding parity-restricted Poisson average already proved in the supplied fixed-parity refinement. Alternatively the unrestricted construction has a definite parity in every individual polynomial.

The order of limits is essential: first choose the finite arithmetic block, then send N to infinity. The fixed-twist errors depend on that block. Nothing here permits the number or arithmetic size of the frequencies to grow at a prescribed rate with polynomial degree.

## 4. Why the preceding example does not break the shared-kernel derivative bound

The question relevant to H/X is not K>=c I. It is closer to

    D K D <= C_B K                                      (19)

on coefficient vectors supported on |x_s|<=B. For the paired-prime family used above, (19) is in fact true with a constant independent of m.

### 4.1 A dimension-uniform polynomial group bound

For the one-pair matrix K_j=I+rho_j sigma_x, elementary 2-by-2 conjugation yields

    ||K_j^(1/2) exp(it delta_j sigma_z/2) K_j^(-1/2)||
       <= exp[C rho_j min(|t|delta_j,1)],                (20)

uniformly once rho_j<=1/2. For small phase this follows by writing exp(iu sigma_z)=cos u I+i sin u sigma_z and bounding

    ||K_j^(1/2) sigma_z K_j^(-1/2)-sigma_z|| <= C rho_j;

for all phases it follows from the condition number bound sqrt((1+rho_j)/(1-rho_j))<=exp(C rho_j). Combining the two gives (20).

The tensor product and an argument parallel to (14) give

    ||K_m^(1/2)exp(itD_m)K_m^(-1/2)|| <= C(2+|t|)^C.     (21)

Indeed split at Y=exp(2+|t|). The low primes contribute O(log(2+|t|)); the tail is bounded by

    |t| sum_(q_j>Y) 1/[q_j(log q_j)^2]
       <= C|t|/log Y <= C.

All constants are independent of m.

Choose a smooth compactly supported scalar function eta equal to x on [-B,B]. Fourier inversion gives, for every vector c supported in this band,

    D_m c=eta(D_m)c=integral eta_hat(t)exp(itD_m)c dt.

Taking the K_m norm and using (21) proves

    ||D_m c||_(K_m)<=C_B||c||_(K_m),                     (22)

which is (19). Every coefficient vector in the band is covered, not just the particular small-eigenvalue vector. The same proof applies to any fixed smooth frequency multiplier on the band.

Thus the theorem in Section 2 identifies a true obstruction to **scalar coercivity**, while Section 4 prevents misusing that obstruction as a failure of the actual shared-kernel mechanism.

## 5. The general shared-kernel Bernstein inequality fails

The preceding restricted positive result cannot extend with a dimension-independent constant to arbitrary rational-frequency blocks of bounded bandwidth.

**Theorem.** Fix b>0. For each large positive integer N, put

    I_N={n integer: N<=n<=exp(b)N},
    (K_N)_(m,n)=gcd(m,n)/sqrt(mn),
    (Lambda_N)_(n,n)=log(n/N)-b/2.

There is a constant c_b>0 such that

    sup_(c!=0) [c* Lambda_N K_N Lambda_N c]/[c* K_N c]
        >= c_b log N.                                   (24)

All Lambda_N frequencies lie in the fixed interval [-b/2,b/2]. In particular, the K-metric norm of centered frequency multiplication is at least c_b sqrt(log N). No arithmetic cross term is omitted.

### 5.1 An exact smooth-vector asymptotic

For a fixed real g in C_c^infinity((1,exp(b))), set

    c_n=N^(-1/2) sqrt(n/N) g(n/N),       n in I_N.

Thus c_n/sqrt(n)=g(n/N)/N. The divisor identity (4) gives exactly

    c* K_N c=(1/N^2) sum_(d<=exp(b)N) phi(d)
                      [sum_(k>=1) g(dk/N)]^2.           (25)

Write I(g)=integral_0^infinity g(x)dx. The elementary bounded-variation Riemann-sum estimate is, uniformly for every h>0,

    sum_(k>=1) g(hk)=I(g)/h+O(V(g)),                      (26)

where V(g) is the total variation of the zero extension. This can be proved by comparing the integral on each interval [(k-1)h,kh] with its right-endpoint sample and summing variations. It also covers h comparable to one or larger; compact support makes every sum finite.

Insert h=d/N in (25). Expanding the square and using phi(d)<=d yields

    c* K_N c
       =I(g)^2 sum_(d<=exp(b)N) phi(d)/d^2 +O_g(1).       (27)

Indeed the cross error is bounded by C_g N^(-1)sum_(d<=exp(b)N)phi(d)/d=O_g(1), and the squared error by C_g N^(-2)sum phi(d)=O_g(1). Constants may depend on b and g, not N.

Finally the elementary totient asymptotic is

    sum_(d<=x) phi(d)/d^2=(6/pi^2)log x+O(1).             (28)

For a direct proof, use phi(d)/d=sum_(a|d)mu(a)/a, interchange the finite sums, and apply the harmonic-sum estimate:

    sum_(d<=x)phi(d)/d^2
       =sum_(a<=x) mu(a)/a^2 H_(floor(x/a)).

The coefficient of log x tends to sum mu(a)/a^2=1/zeta(2); the sum of log(a)/a^2 is absolutely convergent and the harmonic remainder is O(log x/x). Thus (27) becomes

    c* K_N c=(6/pi^2) I(g)^2 log N+O_g(1).               (29)

This formula is an asymptotic for actual finite quadratic forms, not a dropped off-diagonal approximation.

### 5.2 A cancellation destroyed by the derivative multiplier

Choose a nonnegative, nonzero eta in C_c^infinity((1,exp(b))) and let g=eta'. Then

    I(g)=0,
    J:=integral (log x-b/2)g(x)dx
       =-integral eta(x)/x dx !=0.                       (30)

For its vector c, equation (29) gives c*K_N c=O_g(1). It is positive and c is nonzero for all sufficiently large N, because K_N is strictly positive and the sampling eventually intersects a nonzero interval of g.

The vector Lambda_N c is obtained by replacing g by

    g_1(x)=(log x-b/2)g(x).

Apply (29) again and use (30):

    c*Lambda_N K_N Lambda_N c
       =(6/pi^2)J^2 log N+O_g(1).                        (31)

The denominator has an N-independent finite upper bound, while the numerator is bounded below by a positive constant times log N for all sufficiently large N. This proves (24).

### 5.3 Exact scope of this second obstruction

Equation (24) rules out an O(1), arithmetic-dimension-independent gain from merely knowing that the packet's real frequencies lie in a fixed interval. It does not rule out a usable bound depending on arithmetic complexity, such as O(log N) for the squared multiplier norm. If a physical-height argument also restricted the effective arithmetic labels to N<=T^C, the lower bound in (24) would only cost log T, still smaller than the source/value log-squared separation. No such upper bound or selected arithmetic-size control is proved here.

The interval parameter N measures this explicit family's arithmetic complexity and number of coefficients. Multiplying every label of one fixed family by a common integer preserves K and its centered frequencies; such a dilation does not create the growth in (24). The theorem uses the entire new integer window at each N, with its corresponding sampled vector.

### 5.4 Real-even modulation witnesses

The same obstruction can be realized by real-even trigonometric amplitudes. Let P tend to infinity through primes, put R=sqrt(P)exp(-b/2), and run the smooth-vector construction with real scale R in place of integer N. The proof of (25)-(31) is unchanged. For every integer n in [R,exp(b)R], use both rational labels n and P/n, centered at gamma=(log P)/2. Their frequencies are x_n and -x_n, where x_n=log(n/R)-b/2.

For large P, every such n is smaller than P. Unique factorization shows that the two label sets are disjoint, and the full arithmetic matrix is

    K_full=[[K_R,C_R],[C_R,K_R]],
    (C_R)_(n,m)=1/sqrt(Pnm).                             (32)

The cross block is rank one, with norm

    ||C_R||=P^(-1/2)sum_(n in window)1/n=O_b(1/R).

Use equal paired coefficients (c,c)/sqrt(2). Their modulation is real and even, and their input energy is c*(K_R+C_R)c=O(1), since the smooth sampled vector has bounded Euclidean norm. Frequency multiplication produces (Lambda_R c,-Lambda_R c)/sqrt(2), whose energy is

    c*Lambda_R(K_R-C_R)Lambda_R c
       =(6/pi^2)J^2 log R+O(1).                         (33)

Here the cross-block contribution is O_b(1/R), since the Euclidean multiplier is bounded by b/2. Clearing a common denominator converts the rational labels to integers without changing K or the centered frequencies. Thus the general shared-kernel Bernstein failure persists for real-even modulation. No joint physical-height asymptotic is asserted by this symmetrization.

### 5.5 A complementary elementary upper bound

On the full integer interval, the squared multiplier norm in (24) is at most C_b log^2 N. Thus the proved elementary bounds are

    c_b log N <= ||Lambda_N||_(K_N)^2 <= C_b log^2 N.      (34)

For the upper bound, work first on all labels 1,...,M. The exact K-orthonormal selected coefficient vectors are

    (q_n)_a=sqrt(a/phi(n)) mu(n/a) if a divides n,
    (q_n)_a=0 otherwise.

Their divisor features are delta_(d=n)/sqrt(phi(n)), which proves orthonormality. Multiplication by log a in this basis has diagonal log n and off-diagonal matrix

    A_(d,n)=sqrt(phi(d)/phi(n)) Lambda_VM(n/d)
                if d divides n and d<n,
    A_(d,n)=0 otherwise.                                (35)

Here Lambda_VM is the von Mangoldt function. Formula (35) follows from sum_(k|m)mu(k)log k=-Lambda_VM(m). Apply the weighted Schur test with w_n=sqrt(phi(n))/n. The row sums are

    sum_n A_(d,n)w_n/w_d
       =sum_(2<=m<=M/d) Lambda_VM(m)/m <=2log M.          (36)

The last bound is elementary: log(floor M!)=sum_(m<=M)Lambda_VM(m)floor(M/m), and floor(M/m)>=M/(2m). The column sums obey

    sum_d A_(d,n)w_d/w_n
       =sum_(m|n,m>1) [m phi(n/m)/phi(n)]Lambda_VM(m)
       <=2log n <=2log M.                              (37)

Only prime powers m=p^j occur; their bracket is one except possibly at the largest available power, where it is p/(p-1)<=2. The sum of their log p weights is log n. Therefore ||A||<=2log M, and full log-label multiplication has norm at most 3log M.

Embed an interval vector by zero into the labels 1,...,floor(exp(b)N), and subtract the scalar center log N+b/2. Its K-norm and derivative K-norm are unchanged by this embedding. The triangle inequality gives the upper bound in (34).

The gap between log N and log^2 N in (34) is unresolved here. At arithmetic size polynomial in physical height, the upper bound is precisely at the scale that can consume the full log-squared source/value advantage. It is therefore not a proof of selected decay.

## 6. A precise unproved step for full selection

For a bulk packet written formally as p(t)=envelope(t)f(t), the leading twisted arithmetic gives

    H[p] proportional to (log n) times a K-norm of an amplitude derivative,
    Q[p] proportional to (log n)^3 times a K-norm of the amplitude.

An appropriate K-metric derivative bound, with growth strictly smaller than the source/value log-squared factor at the actual arithmetic complexity, could supply a vanishing gain, provided the following further statements held:

1. The actual complete X-selected P_n admits the required bulk packet or block decomposition with controlled errors and bounded effective frequencies.
2. The arithmetic asymptotic is uniform **relative to K**, not merely entrywise or in Euclidean operator norm, on the growing selected blocks. Section 2 makes this distinction essential.
3. Cross-block and envelope-derivative terms are controlled in the same positive arithmetic form.
4. The complementary compact and exterior regions have negligible selected derivative energy, using complete selection rather than only a source scale or a growing prefix.

None of these is proved here for P_n. The paired-prime Bernstein bound is a genuine restricted arithmetic statement. Theorem (24) rules out its dimension-independent extension to general rational-frequency blocks. It remains possible that a weaker complexity-dependent bound suffices for the actual selected packets, but no such full-selection theorem is established.



## 7. A narrow growing-Dirichlet-polynomial literature check

Bettin–Chandee–Radziwill's Theorem 1 concerns the smoothly weighted second moment of |zeta(1/2+it) A(1/2+it)|, with coefficients a_n bounded by n^epsilon and Dirichlet-polynomial length L=T^theta, theta<17/33. It gives an absolute error O(T^(3/20+epsilon)L^(33/20)+T^(1/3+epsilon)). Its full main arithmetic kernel, after changing to the coefficient normalization used here, contains

    K(d,e)[log(t gcd(d,e)^2/(2pi de))+2 gamma].

Thus the fixed-family leading term (log T)K has an arithmetic-logarithmic correction. Fixed real bandwidth does not bound log(de/gcd(d,e)^2); for growing arithmetic labels that correction can have the same scale as log T. This is a further reason not to promote fixed-block formulas to growing blocks without proof.

The inspected theorem does not state a Z'- or L_Z-relative K-norm estimate, nor a complete X-selected packet decomposition. It therefore supplies relevant arithmetic context, not the missing selected upper bound. Source inspected: [author PDF, Theorem 1 and its setup](https://www.math.mcgill.ca/radziwill/BCR.pdf).

## Sources and scope

- Read-only exact arithmetic input: `theta_displacement_response_20261104/RATIONAL_TWIST_BULK_AVERAGING_OBSTRUCTION.md` and its fixed-parity refinement. These contain the derivative approximate functional equation, complete rational-twist proof, gamma-moment approximation, and envelope averaging used above.
- Classical GCD/Poisson-kernel context: C. Aistleitner, I. Berkes, K. Seip, *GCD sums from Poisson integrals and systems of dilated functions*, https://arxiv.org/abs/1210.0741 . Only its scope/abstract was inspected; no uninspected result is used in the proofs above.
- Elementary prime-reciprocal context: P. Pollack, *Euler and the partial sums of the prime harmonic series*, https://pollack.uga.edu/eulerprime.pdf . The proof above needs only Euler divergence, Bertrand's postulate, and the explicitly derived upper bound (9), not an asymptotic prime-gap theorem.

All new arguments are analytic and retain their complete arithmetic cross terms. They have not been externally peer-reviewed or machine-formalized. The full-selected limit H[P_n]/X[P_n]->0 and the corresponding selected determinant upper response remain open.
