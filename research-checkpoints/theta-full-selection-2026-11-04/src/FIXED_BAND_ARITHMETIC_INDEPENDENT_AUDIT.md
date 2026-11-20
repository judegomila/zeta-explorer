# Independent audit: fixed-band arithmetic degeneracy and its exact theta scope

2026-11-04. Analytical audit of `ARITHMETIC_FREQUENCY_SEPARATION.md`, read in its first complete working version and again after the integer-window, real-even, and literature additions. No frozen file or 4CT artifact was modified. No finite scan, conjectural prime-gap assertion, RH, or signed-form positivity is used.

## Verdict

The fixed-log-bandwidth noncoercivity theorem is correct. The smooth cutoff is essential, and its Fourier estimate can be proved by elementary disjoint-gap bounds without the prime number theorem or even a prime-reciprocal upper estimate. The paired-prime-family K-metric Bernstein inequality is also correct. The degeneracy alone is an obstruction to scalar coercivity, **not** to the shared-kernel derivative comparison.

A separate new integer-window argument does prove that the **general** fixed-bandwidth K-metric Bernstein inequality fails: its norm grows at least as sqrt(log N) on the integers in [N,exp(B)N]. This is independently proved in Section 7 below. It is compatible with the paired-prime-family bound and still does not prove failure of a fully selected H/X estimate.

The actual-theta consequence is valid with the stated order of limits: choose a finite bad arithmetic block first, and only afterward let the polynomial degree tend to infinity. Two minor transfer details are supplied below: a lower normalization for each modulated gamma norm, and verification that Taylor cancellation does not reduce the polynomial degree. Neither requires a new arithmetic hypothesis.

The theorem also implies that the smallest eigenvalue of the complete integer-window matrix on `[R,exp(B)R]` tends to zero as R tends to infinity, for every fixed B>0. This is a dilation consequence, not a rate for the original construction or a uniform theta moment theorem.

## 1. Prime-pair selection is unconditional

Write disjoint consecutive-prime pairs as `(q_j,p_j)`, q_j<p_j, and put

    delta_j=log(p_j/q_j),   rho_j=1/sqrt(p_j q_j).

Bertrand gives p_j<2q_j. Euler's divergence of the prime reciprocal sum implies divergence of the sum of 1/q_j: each larger partner has reciprocal no greater than its smaller partner. Since rho_j is comparable to 1/q_j, the original sum of rho_j diverges.

Remove a finite initial segment and the pairs with delta_j>(log q_j)^(-2). In the dyadic shell 2^k<=q_j<2^(k+1), all disjoint intervals `[log q_j,log p_j]` lie inside an interval of length at most 2 log 2. Hence their total delta_j is at most 2 log 2. A removed pair has delta_j>=c/k^2, so there are at most C k^2 such pairs in this shell. Their total rho_j is at most C k^2 2^(-k), summable over k. The retained sum of rho_j still diverges.

For retained pairs in the same shell,

    sum delta_j^2 <= (max delta_j) sum delta_j <= C/k^2.

Thus the retained sum of delta_j^2 is finite. This gap-sum argument matters: the pointwise estimate delta_j<=(log q_j)^(-2), by itself, would not prove square summability over primes. A further finite deletion makes the remaining square sum arbitrarily small while preserving divergent sum rho_j.

All inputs in this step are elementary classical facts. No estimate for individual small prime gaps is needed.

## 2. Tensor construction and the cutoff estimate

For m retained pairs, let s range over `{0,1}^m`, and define

    a_s=product_(s_j=0) q_j product_(s_j=1) p_j,
    gamma_m=(1/2) sum_j(log q_j+log p_j),
    x_s=log a_s-gamma_m=sum_j(s_j-1/2)delta_j.

The integers a_s are distinct by unique factorization. Their exact GCD kernel is

    K_m= tensor_j [[1,rho_j],[rho_j,1]].

Set v_s=2^(-m/2)(-1)^(sum s_j). Then ||v||_2=1 and

    K_m v=lambda_m v,   lambda_m=product_j(1-rho_j) -> 0.

Choose a real even smooth cutoff chi supported in [-B,B], equal to one on [-B/2,B/2], and make the retained tail satisfy sum delta_j^2<=B^2/4. For D_m=diag(x_s), the uniform cube distribution has variance at most B^2/16. Consequently

    ||chi(D_m)v||_2^2 >= P(|x_s|<=B/2) >= 3/4.

The exact phase energy is

    ||K_m^(1/2) exp(itD_m)v||_2^2
      =product_j(1-rho_j cos(t delta_j))
      =lambda_m product_j[1+rho_j(1-cos(t delta_j))/(1-rho_j)].

No entrywise approximation is involved.

### A short elementary bound for the Fourier product

Assume rho_j<=1/2, having removed finitely many pairs. Put Q=max(2,t^2). For low q_j,

    sum_(q_j<=Q) rho_j <= sum_(2<=n<=Q) 1/n <= C+log Q.

For the high pairs, use delta_j<=log 2 and delta_j<=(p_j-q_j)/q_j to obtain

    rho_j delta_j^2 <= (log 2)(p_j-q_j)/q_j^2.

Because the intervals `[q_j,p_j]` are disjoint and p_j<2q_j,

    sum_(q_j>Q) (p_j-q_j)/q_j^2
      <= 4 integral_Q^infinity x^(-2) dx = 4/Q.

Therefore the logarithm of the product after lambda_m is at most

    C sum_(q_j<=Q) rho_j + C t^2 sum_(q_j>Q) rho_j delta_j^2
      <= C log(2+|t|).

This proves, uniformly in m and in the chosen retained tail,

    ||K_m^(1/2) exp(itD_m)v||_2
      <= C sqrt(lambda_m)(2+|t|)^C.

Fourier inversion, followed by the triangle inequality in the K_m norm, now gives

    ||K_m^(1/2)chi(D_m)v||_2
      <= C sqrt(lambda_m) integral |chi_hat(t)|(2+|t|)^C dt
      <= C_B sqrt(lambda_m).

The rapid decay of the smooth compactly supported cutoff's Fourier transform justifies the integral. Combining with the Euclidean lower norm proves a Rayleigh quotient at most C_B lambda_m, tending to zero, on coefficients supported entirely inside the fixed slab.

For even m, complementation s -> 1-s sends x_s to -x_s and preserves the coefficient chi(x_s)v_s. Thus the exponential sum is real and even. Restricting to even m preserves all limits. This verifies the real-even assertion, not merely a complex-vector version of the theorem.

## 3. A useful stronger window quantifier

For any fixed B>0 and epsilon>0, first construct a finite set S with max(S)/min(S)<exp(B), using a strictly narrower slab, and a real coefficient vector with Rayleigh quotient below epsilon. Multiplying every label by the same positive integer k leaves K unchanged.

For every sufficiently large R, the interval

    [R/min(S), exp(B)R/max(S)]

has length at least one, so contains an integer k. Then kS lies in `[R,exp(B)R]`, and extending its coefficients by zero gives a vector for that complete integer-window matrix with the same Rayleigh quotient. Since epsilon was arbitrary,

    lambda_min( K on integers in [R,exp(B)R] ) -> 0.

This is a genuine limit, not just a subsequential assertion. Its threshold R depends on the chosen finite epsilon-block. It supplies no effective eigenvalue decay rate, no relation between arithmetic dimension and polynomial degree, and no uniform estimate for twisted theta moments with growing labels.

## 4. The paired-family K-metric Bernstein bound passes audit

The one-pair estimate used in the draft is valid. Let J=diag(-1,1), K_j=I+rho_j sigma_x, and u=t delta_j/2. Uniformly for 0<=rho_j<=1/2,

    ||K_j^(1/2) J K_j^(-1/2)-J|| <= C rho_j.

Using exp(iuJ)=cos(u)I+i sin(u)J and the unitary norm of exp(iuJ),

    ||K_j^(1/2)exp(iuJ)K_j^(-1/2)||
      <=1+C rho_j|sin u|
      <=exp(C rho_j min(|t|delta_j,1)).

Tensoring gives the exponential of the sum. Again no prime-reciprocal upper estimate is needed. Split at Q=max(2,|t|), use the harmonic bound below Q, and use

    sum_(q_j>Q) rho_j delta_j
      <=sum_(q_j>Q)(p_j-q_j)/q_j^2 <=4/Q

above Q. Consequently

    ||K_m^(1/2)exp(itD_m)K_m^(-1/2)|| <= C(2+|t|)^C

uniformly in m. This estimate in fact holds for the full disjoint consecutive-prime-pair cubes without the small-gap deletion; the deletion is needed for cutoff mass, not this group bound.

Choose eta smooth and compactly supported, equal to x on [-B,B]. For every vector c supported in that slab, eta(D_m)c=D_m c. Fourier inversion and the polynomial group bound imply

    ||D_m c||_(K_m) <= C_B ||c||_(K_m),
    c*D_m K_m D_m c <= C_B^2 c*K_m c.

The same reasoning controls any fixed smooth multiplier on the band. This covers every slab-supported vector in these paired-prime cubes, not only the small-energy vector constructed above. It is correctly restricted to this family: no step proves the estimate for arbitrary integer or rational frequency blocks.

In particular, making c*Kc very small need not make `(Dc)*K(Dc)/(c*Kc)` large. For the present construction it is bounded. The small Euclidean eigenvalue therefore cannot by itself be used to claim failure of the desired derivative/source gain.

## 5. Exact actual-theta transfer and normalizations

For fixed positive integers a,b, reduce a/b=A/B to coprime integers. Then

    1/sqrt(AB)=gcd(a,b)/sqrt(ab)=K(a,b).

The supplied complete rational-twist calculation gives leading densities `(log^3 T)/12` for Z'^2 and `(log^3 T)/6` for L_Z, multiplied by this K entry. For a fixed finite real coefficient vector c, expansion of |f|^2 sums all these cosine twists. The diagonal entries equal one. Thus

    integral_T^(2T) Z'^2 |f|^2
      =(T log^3 T/12)c*Kc + O_f(T log^2 T),
    integral_T^(2T) L_Z |f|^2
      =(T log^3 T/6)c*Kc + O_f(T log^2 T).

The real-even constructed f needs only the proved cosine twists. The unneeded complex-vector extension is harmless if its sine estimate is separately supplied, but is not a premise of the new theorem or its theta application.

Deleting the lambda factors from the same fixed-twist Riemann-Siegel difference/sum calculation gives the leading Z^2 density `(log T)K(a,b)`. The fixed-rational resonances contribute that coefficient; the nonresonant difference terms are smaller, and the possible sum-phase stationary terms are O_f(T). Hence

    integral_T^(2T) Z^2 |f|^2 = T log T c*Kc + O_f(T).

The exact theta potential is

    Q[p]=2 integral a(t)^2 [L_Z(t)-g'(t)Z(t)^2]|p(t)|^2 dt.

The supplied positive Poisson/gamma window W_N has mass M_N, weighted variation O(M_N), and exponentially small tails away from a fixed linear-height annulus. Applying the fixed-twist primitive estimates by integration by parts gives

    sum_d mu_d Q[t^d f]
      =(1/3)M_N log^3 N c*Kc + O_f(M_N log^2 N),
    sum_d mu_d Qbar[t^d f]
      =(1/3)M_N log^3 N ||c||_2^2 + o_f(M_N log^3 N).

The term involving bounded g' is lower order by the Z^2 mean. The denominator uses the distinct-frequency nonstationary mean of |f|^2, which is ||c||_2^2. Both factors 1/3 are correct: the L_Z coefficient 1/6 is multiplied by the exact factor two in Q. A common frequency center does not affect |f|^2 or K.

Taking the ratio gives c*Kc/||c||_2^2, with the finite block held fixed. Since every denominator and every mu_d is positive, some individual d has Q/Qbar no larger than the averaged ratio. The conclusion is an upper bound on the **signed** quotient Q/Qbar, not an absolute-smallness assertion and not a proof that Q is negative.

### Two polynomial-transfer details

Choose a fixed bandwidth B<pi/4. Let f be the fixed nonzero real-even trigonometric polynomial obtained above, and approximate each cosine by the same Taylor degree 2 ceil(CN), for sufficiently large C depending on B. The supplied full-line gamma-moment estimate gives exponentially small errors in the value, derivative, source, and signed-potential forms, with the finite coefficient sum absorbed in the threshold N. This estimate is valid precisely because 4B/pi<1.

First, each individual modulated norm has a positive lower normalization for all large d. In the pure gamma weight t^nu exp(-ct), the off-diagonal frequency integral, divided by its unmodulated gamma mass, has modulus

    (1+(omega/c)^2)^(-(2d+nu+1)/2)

for every fixed nonzero frequency difference omega. It tends exponentially to zero. Thus the normalized f-square mass tends to ||c||_2^2. The actual a^2 envelope is globally comparable to this gamma weight away from zero; its compact part is negligible for large d. Removing fixed linear-annulus tails costs an exponentially small amount. On this annulus log(2+|t|)^3 is comparable to log^3 N, uniformly for N<=d<=2N. Therefore Qbar[t^d f] is bounded below by a positive block-dependent constant times the monomial gamma mass times log^3 N. The actual polynomial has the same property by its exponentially small approximation error. This validates the relative tail statements for the chosen individual polynomial, even though f need not be pointwise bounded away from zero.

Second, the actual Taylor degree is eventually exactly 2 ceil(CN). Combine equal absolute frequencies in the real cosine expression for f. The largest remaining positive frequency has a nonzero coefficient and eventually dominates the top Taylor coefficient, because every smaller frequency has a strictly smaller ratio to it. There must be such a positive frequency: the centered cube has no x_s=0, by unique factorization. Thus there is no persistent leading-coefficient cancellation. Multiplication by t^d gives actual degree d+2 ceil(CN), comparable to N, and parity d. The prior parity-restricted window supplies the same conclusion in either prescribed parity.

It follows that for every epsilon>0 there are real algebraic polynomials of arbitrarily large degree, with degree-comparable bulk concentration, for which Q[p]/Qbar[p]<=2 epsilon. This refutes a uniform positive scalar comparison Q>=c Qbar on that full polynomial cone.

## 6. Quantifier and interpretation boundary

The supported conclusions are:

- For every B>0 and epsilon>0, choose one finite real-even arithmetic block in the centered width-2B band with K-Rayleigh quotient below epsilon.
- For that fixed block, choose the polynomial approximation constant and then take N sufficiently large. The theta error constants and the starting degree may depend arbitrarily on the entire block.
- This yields arbitrarily high-degree bulk polynomial witnesses, and the construction can be run in either parity.
- For the paired-prime blocks, bounded-band frequency differentiation is uniformly bounded in their own K norm.

The following do **not** follow:

- A degree-dependent family of arithmetic blocks with uniform relative twisted-moment errors.
- A lower bound, failure of decay, or asymptotic for the fully X-selected endpoint H[P_n]/X[P_n].
- Failure of a K-metric Bernstein inequality for arbitrary rational labels **from degeneracy alone**. The separate argument in Section 7 does establish this failure.
- An absolute-smallness conclusion for Q[p]/Qbar[p] from the signed averaging argument.
- A rate for integer-window eigenvalue decay or a usable relationship between an epsilon-block's arithmetic size and polynomial degree.

For every fixed finite nonzero block, K is strictly positive definite. Its possibly tiny positive leading coefficient is shared by the log-cubed source-potential moment and the logarithmic value moment. Entrywise or Euclidean approximation errors can overwhelm that coefficient when the block grows, which is exactly why a future selected argument would need approximation relative to K.

## 7. Independent proof of the additional general Bernstein obstruction

Fix B>0. For all sufficiently large real N, let the index set be the integers n in [N,exp(B)N], and let

    (D_N)_(n,n)=log(n/N)-B/2.

Take a fixed real g in C_c^infinity(1,exp(B)), set f(x)=sqrt(x)g(x), and define

    c_n=N^(-1/2) f(n/N).

The exact divisor representation gives

    E_N(g):=c*K_N c
      =N^(-2) sum_(d<=exp(B)N) phi(d) |sum_(k>=1) g(dk/N)|^2.

Indeed c_n/sqrt(n)=N^(-1)g(n/N). This normalization is essential and is correct in the author's proposed argument.

For every h>0 the elementary bounded-variation lattice estimate is

    sum_(k>=1)g(hk)=h^(-1)I+O(V_g),
    I=integral_0^infinity g(x)dx,

where V_g is the total variation of the compactly supported extension of g by zero. Its constant is uniform in h; partitioning the positive line into intervals of length h proves the estimate directly. With h=d/N, expansion of the square gives

    E_N(g)=I^2 sum_(d<=exp(B)N) phi(d)/d^2 + O_(g,B)(1).

Explicitly, the cross-term error is bounded by

    C|I|V_g N^(-1) sum_(d<=exp(B)N) phi(d)/d=O_(g,B)(1),

and the squared-error term by

    C V_g^2 N^(-2) sum_(d<=exp(B)N) phi(d)=O_(g,B)(1),

using only phi(d)<=d. This step is uniform as N grows; it does not assert a uniform theta moment expansion.

The elementary identity phi(n)/n=sum_(d|n)mu(d)/d gives

    sum_(n<=X)phi(n)/n^2
      =sum_(d<=X) mu(d)/d^2 H_(floor(X/d))
      =(1/zeta(2))log X+O(1).

Absolute convergence of sum log(d)/d^2 controls the constant term and tails. No prime number theorem is used. Therefore

    E_N(g)=(6/pi^2)I^2 log N+O_(g,B)(1).

Now choose a nonzero nonnegative eta in C_c^infinity(1,exp(B)) and put g=eta'. Then I=0, so E_N(g)=O_(g,B)(1). The vector c is nonzero for every sufficiently large N, and K_N is strictly positive definite, so its energy is positive. Applying the same identity to

    g_1(x)=(log x-B/2)g(x)

gives

    integral g_1(x)dx = -integral eta(x)/x dx !=0,
    (D_N c)*K_N(D_N c)=c_(eta,B) log N+O_(eta,B)(1),

with c_(eta,B)>0. Consequently

    sup_(u!=0) [(D_Nu)*K_N(D_Nu)/(u*K_Nu)] >= c log N,
    ||D_N||_(K_N -> K_N) >= c sqrt(log N).

There is no need to know a positive lower asymptotic for E_N(g): its bounded upper estimate and strict positivity suffice. The coefficient vectors are real and have Euclidean norm bounded above and below by positive constants, by ordinary Riemann sums.

This theorem is stronger than a numerical indication of growth. It rigorously disproves a dimension-independent K-Bernstein inequality for all integer windows of fixed multiplicative width. It does not contradict Section 4: the complete integer intervals are a different family from the disjoint paired-prime cubes.

### Optional real-even fixed-band strengthening

The failure can also be realized by genuinely real-even trigonometric polynomials after clearing denominators. Take a large prime P and put N=sqrt(P)exp(-B/2). For every integer n in [N,exp(B)N], include the two rational labels n and P/n. All labels lie in the same interval centered logarithmically at (log P)/2, and the second label is the reciprocal reflection of the first. None coincide for large P, since 1<n<P and P is prime.

Within each half, the K matrix is exactly K_N. Between halves,

    K(n,P/m)=K(nm/P,1)=1/sqrt(P n m),

because P divides neither n nor m. This cross matrix C has rank one and norm

    ||C||=P^(-1/2) sum_n 1/n = O_B(N^(-1)).

Assign equal coefficients c_n to the two reflected labels. The resulting exponential sum is real and even. Its input K energy is

    2 c*K_N c+2 c*C c=O(1),

while the centered-log multiplier is antisymmetric and its output energy is

    2(D_Nc)*K_N(D_Nc)-2(D_Nc)*C(D_Nc)
      =2c_(eta,B)log N+O(1).

Both Euclidean norms are bounded because the frequency band is fixed; the cross errors are O_B(N^(-1)). Multiplying all labels by their common denominator makes them distinct positive integers, without changing frequencies relative to the center or any K entry. Thus real-even fixed-band examples also have unbounded K-metric derivative ratios.

This optional refinement uses arbitrarily large primes, not any estimate for primes in short intervals: N is defined from P, rather than a prime being sought near a preassigned N.

### Independently checked full-label logarithmic upper bound

There is also an elementary upper estimate, leaving a logarithmic gap rather than a dimension-independent bound. On all integer labels 1<=n<=M, define

    R_(d,n)=sqrt(phi(d)/n) 1_(d divides n),   K=R^*R.

The inverse columns are

    (R^(-1))_(a,n)=sqrt(a/phi(n)) mu(n/a) 1_(a divides n).

For L=diag(log n), direct divisor convolution gives A=RLR^(-1), with

    A_(n,n)=log n,
    A_(d,n)=sqrt(phi(d)/phi(n)) Lambda(n/d),  d<n and d|n,

and zero otherwise. Here Lambda is the von Mangoldt function, not the frequency diagonal. The identity follows from sum_(b|m)mu(m/b)log b=Lambda(m) for m>1.

For the nonnegative off-diagonal part, use the weighted Schur test with w_n=sqrt(phi(n))/n. Its row sums are

    (1/w_d)sum_n A_(d,n)w_n
      =sum_(2<=m<=M/d)Lambda(m)/m <=2log M.

The elementary bound follows from log(Q!)=sum_(m<=Q)Lambda(m)floor(Q/m), floor(Q/m)>=Q/(2m), and log(Q!)<=Q log Q, with Q the integer part of the upper limit.

Its column sums are

    (1/w_n)sum_d A_(d,n)w_d
      =sum_(m|n,m>1) [m phi(n/m)/phi(n)] Lambda(m) <=2log n.

Only prime powers m=p^k contribute. If v is the exponent of p in n, their bracket is 1 for k<v and p/(p-1)<=2 for k=v. Hence the total is at most 2 sum_(p|n)v_p(n)log p=2log n.

The off-diagonal operator norm is therefore at most 2log M, and adding the diagonal gives

    ||L||_(K -> K)=||RLR^(-1)||_2 <=3log M.

Restrict coefficients to a fixed-ratio interval [N,exp(B)N], pad by zeros in [1,M], and subtract the center log N+B/2. The full K norm equals the interval principal-form norm on such vectors, and both L and the centered multiplier preserve their support. Thus

    ||D_N||_(K_N -> K_N) <= C_B log N

for large N. Together with the lower theorem, the squared norm lies between c_B log N and C_B log^2 N. This upper estimate was directly checked from the divisor matrix; it is not inferred from the lower example. It does not provide a vanishing theta gain at polynomial arithmetic size, because its squared upper bound can consume the entire log-squared source/value separation.

### Exact significance for the theta problem

The scalar noncoercivity theorem and the general Bernstein failure are two separate obstructions. The first alone would not imply the second. The second shows that a uniform all-block bounded-frequency derivative inequality in the arithmetic K metric is false, even with real-even fixed-band modulation. Any viable version for the selected problem must exploit further restrictions on the selected blocks, permit controlled dimension/arithmetic-size dependence, or use another mechanism.

However, every such finite block still has a strictly positive fixed K energy. Its theta asymptotic can be taken only after fixing the entire block. The present proof gives no degree-uniform relative asymptotic when the integer interval grows, no selected packet decomposition, and no fully selected derivative/source counterexample. A growth lower bound sqrt(log N) for an arithmetic multiplier is not, by itself, a nondecaying H[P_n]/X[P_n].

## 8. Narrow external-source check

The added discussion of Bettin–Chandee–Radziwill was checked against [the author-hosted PDF, setup and Theorem 1, pages 1–2](https://www.math.mcgill.ca/radziwill/BCR.pdf). The quoted length range theta<17/33, coefficient restriction, and absolute error are correctly reported. Changing from Dirichlet coefficients a_d to c_d=a_d/sqrt(d) converts the leading factor 1/lcm(d,e) to K(d,e), with the additional logarithm of gcd(d,e)^2/(de). A fixed ratio d/e does not bound this extra arithmetic logarithm. Thus the source supports the warning about growing blocks; it does not supply the missing derivative-relative or selected-polynomial theorem. No later results in that paper were needed or asserted here.

## Read-only sources checked

- `theta_full_selection_20261104/working/ARITHMETIC_FREQUENCY_SEPARATION.md`.
- `theta_displacement_response_20261104/working/RATIONAL_TWIST_BULK_AVERAGING_OBSTRUCTION.md`, including the derivative approximate functional equation, all rational cross pairs, the stationary sum-phase bound, full-line Taylor estimate, and positive Poisson/gamma window.
- `theta_displacement_response_20261104/working/FIXED_PARITY_RATIONAL_TWIST_REFINEMENT.md`.

This audit independently verifies the new algebraic and Fourier arguments and checks their use of the supplied arithmetic input. It is AI-assisted analytical work, not external peer review or machine formalization. The fully selected upper problem remains open.
