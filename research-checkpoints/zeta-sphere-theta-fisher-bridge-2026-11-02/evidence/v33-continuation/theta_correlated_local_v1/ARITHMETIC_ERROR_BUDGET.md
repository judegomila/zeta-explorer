# Explicit prefix-dependent truncation budget and remaining signed barrier

Status: independent analytic review PASS. This makes the corrected arithmetic error choice explicit. It does not choose a positive target margin or prove a signed lower bound.

## 1. Constants from Gamma and the actual polynomial only

Fix a real polynomial p, which may be the actual inverse-selected degree-n residual at a chosen shift. Let l_N=1+log N and b_k=sum_(j=0)^k binomial(k,j)j! for k>=0, b_k=0 for k<0. In particular b0=1,b1=2,b2=5. For s=sigma+it,0<=sigma<=1, define
 d_r(s)=(1/8)[|s(s+1)|b_r+r|2s+1|b_(r-1)+r(r-1)b_(r-2)],
 h_r(s)=sum_(j=0)^r binomial(r,j)|A^(j)(s)|d_(r-j)(s),
 C_r=||p(t) sup_(0<=sigma<=1) h_r(sigma+it)||_L2(dt), r=0,1,2.  (1)
These constants use only Gamma factors and the actual polynomial coefficients. They are finite by the same uniform Gamma decay used in ENDPOINT_CORRECTED_ARITHMETIC.md. They require no unknown target sign or norm. Any rigorous upper enclosures can be substituted.

The explicit derivative envelopes of that note imply for the symmetrized corrected approximant T_N,
 sup_sigma ||p(xi-T_N)^(r)||_2<=C_r l_N^r/N.             (2)
The supremum in(1) also bounds the reflected term, so no factor2 is missing.

Define the finite, independently specified constants
 M_r=sup_(0<=sigma<=1)||p T_1^(r)(sigma+it)||_2+C_r.
Using(2) at N=1 gives sup_sigma||p xi^(r)||_2<=M_r, without evaluating xi or assuming its target sign. Then
 sup_sigma||p T_N^(r)||_2<=M_r+C_r l_N^r/N.              (3)

## 2. An explicit N for any prescribed absolute error

Substitution of(2)-(3) into the five-term second-derivative error formula gives
 Q_*<=Q_p l_N^2/N,
 Q_p=4M1 C1+2M2 C0+2M0 C2+6C1^2+6C0 C2.               (4)
Hence the error in the actual normalized bridge functional L_a[p^2]/a, uniformly0<=a<=1/2, is at most
                         4Q_p l_N^2/N.               (5)
The elementary inequality (1+log N)^2<=4sqrt(N), N>=1, yields the explicit sufficient choice
 N>=max(1,ceil((16Q_p/epsilon)^2))                     (6)
for any prescribed epsilon>0. The resulting error is at most epsilon. This is a degree- and coefficient-dependent choice through the actual p and prefix inverse; it does not replace them with an auxiliary parent conditioning.

If p varies with a, a uniform version requires actual coefficient/constant bounds on that family, or choosing the corresponding Q_p at each a. Formula(6) is not a bound independent of degree or prefix conditioning.

## 3. Why this still does not establish a positive margin

To conclude a positive target, the corrected signed approximant must independently have a lower bound exceeding epsilon. Neither(1)-(6) nor convergence supplies such a bound. Choosing epsilon to be a fraction of an assumed unknown pivot would be circular. A uniform analytic lower estimate on the signed arithmetic expression remains the unsolved part.

There is also an exact limitation on demanding unrestricted positivity of each finite corrected approximant. Its even physical profile has negative tail -pi N exp(-5|u|/2), whereas its Fourier value at0 is positive: D_N(1/2)-(1/2)N^(-1/2)<0 and A(1/2)<0. Thus its Fourier value on z=ia tends to minus infinity as a approaches5/2 from below, starting positive at a=0. It must decrease in modulus somewhere before a positive imaginary zero; equivalently its pointwise bridge density is negative somewhere in0<a<5/2. Polynomial-density detection then rules out all-degree positivity on that whole natural strip for every fixed N.

This last obstruction does NOT show failure within the needed critical shift interval0<a<1/2 for every N. The separate CORRECTED_GROUPING_POINTWISE_TEST.md proves such a critical-strip failure for N=1 only. A degree-dependent arithmetic truncation restricted to the critical strip remains logically possible, but requires the missing signed lower bound. The actual complete-theta outer-shift argument cannot be transferred to these meromorphic approximants.
