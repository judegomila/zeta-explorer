# Exact modular obstruction to fixed-orbit high-degree feature anchors

Status: analytic derivation and independent review passed, including Section 4. This concerns derivative approximation, not the sign of the complete kernel.

Let theta(t)=sum_(n in Z)exp(−pi n²t), and set f(u)=exp(u/2)theta(exp(2u)). With D=d/du, the actual theta profile satisfies

psi(u)=(D²−1/4)f(u).

Indeed termwise differentiation gives exactly4exp(u/2)sum_(n>=1)[2pi²n⁴exp(4u)−3pi n²exp(2u)]exp(−pi n²exp(2u)).

## 1. Flat modular cusp at the closest strip boundary

The defining theta series is analytic for |Imu|<pi/4. Approach the boundary point u*=i pi/4 along u_delta=i pi/4−i delta, delta>0. In the Jacobi variable tau=i exp(2u),

tau=−exp(−2i delta), T=tau+1=2i exp(−i delta)sin delta,

−1/T=−1/2+(i/2)cot delta.

The exact Poisson/Jacobi transformation is

theta_3(0,tau)=theta_4(0,T)=(-iT)^(-1/2)theta_2(0,−1/T).

It follows directly by Poisson summation of the Gaussian with alternating factor(−1)^n. The transformed theta_2 series is

2sum_(m>=0)exp(pi i (m+1/2)²(−1/T)).

For sufficiently small delta, its absolute value and its first two derivatives with respect to the transformed argument are bounded by constants times exp(−pi cot(delta)/8). The prefactor is O(delta^(−1/2)); differentiating the transformed argument twice costs only polynomial powers of1/delta. Along the path D=i d/delta, so applying D²−1/4 preserves exponential flatness. In particular

psi(u_delta)=O(delta^(−9/2)exp(−pi cot(delta)/8)),

and hence psi(u_delta)=o(delta^M) for every fixed M>=0.

Nevertheless psi is not identically zero: psi(0)>0 since every real theta summand there has2pi n²−3>0. If psi admitted an analytic extension across u*, its Taylor series at u* and the flat approach would force every Taylor coefficient to vanish. The identity theorem would then make psi identically zero on the connected strip, a contradiction. Thus u* is a nonremovable singular boundary point.

## 2. Exact Taylor radius and the fixed-orbit failure

The Taylor radius of psi about0 is therefore exactly pi/4: analyticity on the strip gives the lower bound, and the singularity at distance pi/4 gives the upper bound. Since psi is even,

limsup_(n→infinity) |psi^(2n)(0)/(2n)!|^(1/(2n))=4/pi.

For any fixed finite orbit cutoff N, the finite sum psi_N(u) is entire in u, so

limsup_(n→infinity) |psi_N^(2n)(0)/(2n)!|^(1/(2n))=0.

The same holds after explicitly symmetrizing the finite sum; restoring evenness alone does not repair the issue. The error psi−psi_N still has radius pi/4.

Choose any r>pi/4. Entire-function Cauchy bounds give |psi_N^(2n)(0)/(2n)!|<=M_r r^(−2n). The full-radius limsup supplies an unbounded subsequence whose full coefficients decay no faster than a geometric rate with smaller radius. Along such a subsequence,

psi_N^(2n)(0)/psi^(2n)(0) →0.

Consequently no fixed finite-orbit anchor can have a relative derivative error bounded by a constant strictly below1 at every sufficiently large even order. The omitted arithmetic tail controls arbitrarily high derivatives, even though it may be tiny on a fixed real interval at low order.

## 3. Relevance and limits

The common-anchor cross-features involve increasingly high derivatives of the complete theta profile. This exact modular result blocks a strategy that replaces them, uniformly in degree, by any fixed number of theta orbits plus a uniformly small relative error. The retained orbit count or another genuinely complete modular/arithmetic representation must grow with degree.

It does not prove a negative integrated moment, failure of matrix anchors, or RH. The h² bridge weight vanishes at h=0, so the pointwise derivative obstruction cannot be promoted to an integrated sign obstruction without additional analysis. Its role is to identify a concrete theta-specific nonuniformity that any growing-degree angular estimate must preserve.

## 4. Quantitative extension: sub-square-root orbit budgets also fail

The obstruction is not limited to a fixed cutoff. Let the cutoff N_k depend on derivative order k and suppose N_k²=o(k). On any fixed complex circle |u|=R, the explicit finite orbit formula gives

sup |psi_(N_k)(u)| <=C_R N_k^5 exp(C_R N_k²),

for a constant C_R independent of k and N_k. Indeed |exp(2u)|<=exp(2R), |exp(−pi n²exp(2u))|<=exp(pi n²exp(2R)), and the remaining polynomial/prefactor terms contribute at most a constant times N_k^5.

Cauchy's coefficient bound then yields

|psi_(N_k)^(k)(0)/k!|^(1/k)
<=R^(-1) exp([log C_R+5log N_k+C_R N_k²]/k).

Taking limsup and then arbitrarily large fixed R shows that this coefficient root tends to0 whenever N_k=o(sqrt(k)). In contrast, the complete even coefficients have limsup root4/pi. Therefore any orbit budget N_(2n)=o(sqrt(n)) also misses the complete even derivatives along an unbounded subsequence, with the truncated/full ratio tending to0.

This is a necessary asymptotic warning, not a sufficient orbit-count theorem: it does not assert that a cutoff proportional to sqrt(k) is enough, nor that every order requires that many orbits. It rigorously rules out sub-square-root truncation budgets as uniformly relatively accurate high-order derivative anchors at h=0.
