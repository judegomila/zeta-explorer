# Finite prime inverse restoration: positive mixture, signed failure, and domains

Status: independent analytic review PASS. This tests a finite-scale restoration mechanism on the actual theta transform. It makes no claim that the original bridge is negative.

## 1. Exact inverse with a positive probabilistic realization

Let R_P be the finite symmetric Euler multiplier and put
                  C_P(t)=R_P(0)/R_P(t).                    (1)
For each prime r=p^(-1/2), the factor is
 (1-r)^2/(1-2r cos(t log p)+r^2).
It is the characteristic function of (X-Y)log p, where X,Y are independent geometric random variables with probability (1-r)r^k at k>=0. Products correspond to independent sums. Thus multiplication by C_P in Fourier space is convolution by a symmetric probability measure in physical space. It preserves positivity and evenness of the actual theta profile, and0<C_P(t)<=1 on R. Every finite P gives a bounded invertible real-axis operator; no infinite Euler product is asserted.

The finite exact restoration identity is
           C_P(t) [R_P(t)F(t)/R_P(0)]=F(t).                (2)
It cancels the prime factors and their complete signed bridge defects, not just their positive parts. It is valid but produces no new reserve. In the complex plane C_P has poles at imaginary heights +/-1/2 (and their prime-period translates); on the specific range in(2) these poles cancel exactly. An inverse theorem on an arbitrary ambient strip cannot ignore that range condition.

## 2. Positive inverse convolution does not preserve the bridge

For G_P=C_P F, the exact normalized-origin identity is
 (G_P'^2-G_P G_P'')/C_P^2
                =(F'^2-FF'')+F^2 sum_(p in P)k_p(t),       (3)
with k_p from PRIME_SIEVE_BRIDGE_DEFECT.md. These terms are signed.

For P consisting of all primes<=x and any fixed nonzero t, the unconditional prime number theorem and partial summation give
 sum_(p<=x)(log p)^2 p^(-1/2+it)
       =x^(1/2+it)log x/(1/2+it)+o(sqrt(x)log x).           (4)
The theorem used is only pi(x)~x/log x, not RH; see NIST DLMF27.2.3, https://dlmf.nist.gov/27.2#E3 . The standard partial-summation derivation applies for this fixed t.

The absolutely convergent logarithmic expansion for each individual prime gives
 k_p(t)=2(log p)^2 sum_(k>=1) k p^(-k/2)cos(kt log p).
Its k>=2 part is O((log p)^2/p), uniformly for all sufficiently large p. Summing even over all integers bounds this error by O((log x)^3), which is negligible compared with sqrt(x)log x. Therefore
 sum_(p<=x) k_p(t)
 =2sqrt(x)log x Re[x^(it)/(1/2+it)]+o(sqrt(x)log x).         (5)
It tends to negative infinity along suitable cutoff sequences and to positive infinity along others.

Choose a fixed small t0>0 at which the original theta F(t0) is nonzero; such a choice exists because F(0)>0. The ratio (F'^2-FF'')(t0)/F(t0)^2 is finite, without assuming its sign. Along the negative sequence in(5), equation(3) consequently becomes strictly negative. This is a rigorous actual-theta failure of bridge preservation under positive symmetric probability convolution. The modified physical profile is still positive and even.

Continuity and exponential spectral decay allow polynomial-density detection of a negative quadratic form in both parities at some finite degree. Since C_P F is analytic for |Im z|<1/2, the negative normalized-origin density also persists at sufficiently small positive shifts. No particular degree, cutoff, or actual original residual sign is inferred.

## 3. Large-cutoff collapse of the normalized inverse

The exact logarithm is
 log C_P(t)=-2 sum_(p in P)sum_(k>=1)p^(-k/2)(1-cos(kt log p))/k.
Every summand is nonpositive. For fixed t!=0, PNT partial summation also gives
 sum_(p<=x)p^(-1/2)=2sqrt(x)/log x+o(sqrt(x)/log x),
 sum_(p<=x)p^(-1/2+it)=x^(1/2+it)/[(1/2+it)log x]+o(sqrt(x)/log x).
Thus sum p^(-1/2)(1-cos(t log p)) is at least
 [2-1/sqrt(1/4+t^2)+o(1)]sqrt(x)/log x,
with strictly positive leading lower coefficient. Hence C_P(t)->0 for every t!=0. Since0<C_P<=1, multiplication by C_P converges strongly to zero on L2(R), including every fixed polynomial times F. The normalized inverse is not a nonzero limiting factorization.

## 4. Undoing the collapse by Gaussian growth leaves the theta domain

For a fixed nonempty finite P, C_P is bounded below by a positive constant on R. For any c>0,
                    exp(c t^2) C_P(t) F(t) is not in L2(R). (6)
Indeed, if it were, exp(c t^2)F would be in L2. Cauchy-Schwarz would then make the inverse Fourier integral of F absolutely convergent and locally uniformly differentiable at every complex physical argument, so the original psi would extend to an entire function. This contradicts the independently audited complete-theta flat-cusp obstruction at u=i pi/4 in ALL_DEGREE_HARDY_BUDGET.md. This argument uses the actual theta kernel and no zero hypothesis.

This does not invalidate exact restoration of an already Gaussian-filtered input: the unbounded inverse can act on its exact image and cancel the filter. It rules out applying the Gaussian-growth renormalization to the original unfiltered theta transform as an admissible L2 comparison source. The range restriction is essential.

## 5. Remaining possibility

A finite paired sieve/inverse is exact and can preserve the original function when its range factors are retained. Neither positivity of the inverse mixture, cutoff normalization, nor Gaussian amplification supplies an independently positive bridge comparison. A successful finite-scale argument would need a correlated estimate on the actual signed residual space, with the oscillating prime-curvature term paid and the exact range/domain conditions enforced. Such an estimate is not proved here.
