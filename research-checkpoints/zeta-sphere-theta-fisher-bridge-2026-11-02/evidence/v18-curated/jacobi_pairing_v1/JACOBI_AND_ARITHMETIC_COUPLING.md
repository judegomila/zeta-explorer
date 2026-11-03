# Exact Jacobi pairing and the arithmetic coupling it does not pay

2026-11-02. New structural identities, not a positivity proof. The universal all-H cumulative-tail criterion has already been disproved by the certified H=1 witness; none is assumed here.

## 1. Heat/dilation origin of the actual profile

Use theta(x)=sum_{n in Z} exp(-pi n^2 x), x>0, D=d/du, x=e^(2u), and q(u)=e^(u/2)theta(e^(2u)). Poisson summation gives theta(x)=x^(-1/2)theta(1/x), hence q(-u)=q(u). The actual campaign profile is exactly

    psi(u)=(D^2-1/4)q(u)
          =sum_{n>=1} e^(u/2) exp(-z_n) (8z_n^2-12z_n),
    z_n=pi n^2 e^(2u).

The constant theta term e^(u/2) is annihilated. For every finite real u this series and every finite number of derivatives converge locally uniformly. Applying the same annihilator to the Poisson identity proves psi(-u)=psi(u). No unbounded negative-u termwise integral is used.

For completeness, the theta heat equation for Theta(v,x)=sum_n exp(-pi n^2x+2pi i n v) is partial_x Theta=(1/(4pi))partial_v^2 Theta. Its dilation restriction at v=0 yields the differential expression above; the v-derivative introduces signed lattice multipliers. This equation alone does not turn the annihilator or a bridge derivative into a positive operator.

## 2. Direct modular reflection produces zero angular reserve

Set B(h,v)=psi(h-v)psi(h+v). Jacobi reflection gives the exact identity

    B(-h,v)=B(h,v).

For any jet indices i,j, B_ij(h)=(-1)^j partial_v^(i+j)B(h,0) therefore obeys B_ij(-h)=B_ij(h). Both normalized bridge weights 2h^2 at a=0 and h sinh(2ah)/a at a>0 are even. Thus a region E and its reflected copy -E give identical signed local matrices (with the same half/full-line convention).

In a common-anchor split their cross-columns b_E and b_-E are equal. In the complete lower-block metric A, u_E=A^(-1/2)b_E=u_-E. Consequently

    ||u_E||||u_-E||-Re(u_E* u_-E)=0.

The direct reflection edge contributes exactly zero angular/covariance reserve, for every degree and shift, even when the local matrices are indefinite. In each parity block the corresponding derivative feature reflection is only a common sign. It cannot produce the nonparallel regional feature directions needed by the successful matrix-anchor repair.

This is a narrow obstruction: it rules out obtaining a new budget merely by pairing h with -h through the basic Jacobi identity. It does not rule out Poisson resummation involving additional arithmetic grouping, the full heat equation with a nonzero elliptic variable, or a genuinely different positive transform.

## 3. Exact all-cross-arithmetic local jet formula

Define real polynomials P_j by

    P_0(z)=8z^2-12z,
    P_(j+1)(z)=2z P_j'(z)+(1/2-2z)P_j(z).

Then psi^(j)(h)=e^(h/2)sum_{n>=1} exp(-z_n)P_j(z_n). Write P_j(z)=sum_k c_(j,k) z^k. The degree is j+2. For a spatial interval [alpha,beta] with 0<=alpha<beta<=infinity put X=e^(2alpha), Y=e^(2beta), and

    K_s(b;X,Y)=integral_X^Y x^(s-1)exp(-b x) dx
             =b^(-s)[Gamma(s,bX)-Gamma(s,bY)].

The second Gamma is zero when Y=infinity. All derivatives in s below are ordinary real derivatives of this integral, so they are valid for every real s and b>0 because X>=1.

For N=i+j, the exact normalized a=0 local bridge matrix is

 M_ij[alpha,beta] = (1/4)(-1)^j sum_(r=0)^N (-1)^r binom(N,r)
   sum_(k,l) c_(r,k)c_(N-r,l) pi^(k+l)
   sum_(n,m>=1) n^(2k)m^(2l)
   [partial_s^2 K_s(pi(n^2+m^2);X,Y)]_(s=k+l+1/2).

This follows by differentiating B in v, then x=e^(2h). In particular 2h^2 e^h dh=(1/4)x^(-1/2)(log x)^2 dx. Odd N vanishes after the r pairing; no numerical cancellation is needed to establish this.

For a>0 replace (1/4)partial_s^2 K_s by

    [partial_s K_(s+a)-partial_s K_(s-a)]/(8a).

Indeed [h sinh(2ah)/a]e^h dh=(log x)/(8a) x^(-1/2)(x^a-x^(-a))dx. The removable a=0 limit is exactly the formula above, including its factor 1/4.

Every double series here is absolutely convergent for fixed i,j and bounded a, including beta=infinity. Polynomial powers and logarithms are dominated by exp(-pi(n^2+m^2)x), x>=1. Therefore this arithmetic expansion, unlike a full negative-h orbit expansion, permits legitimate interchanging of sums, integrals and finite derivatives. It retains ALL diagonal and off-diagonal n,m terms, not merely a diagonal/Euler-product model.

## 4. A constructive, degree-explicit arithmetic tail control

For d>=0, x>=1, and M=N+1 satisfying pi M^2>d,

 sum_(n>N) n^(2d)exp(-pi n^2 x)
 <= M^(2d)exp(-pi M^2 x)
    /[1-exp(2d/M-2pi M x)].

Proof: write n=M+l, use log(1+l/M)<=l/M and (M+l)^2>=M^2+2Ml, and sum the resulting geometric series. The denominator may be bounded below by its x=1 value. This supplies explicit tails for every monomial in the displayed matrix formula, and hence for truncated n,m sums. For double sums the omitted set is bounded by the union of n>N and m>N; overcounting their intersection is harmless for an absolute error bound. Log-weight integrals are then again K derivatives. Uniform bounds including a=0 use (x^a-x^(-a))/a <= 2 log(x) x^amax for 0<a<=amax, with its continuous limit at zero. The cost depends on degree through d; there is no asserted degree-uniform small error with fixed N.

## 5. What this contributes to the matrix-anchor target

For each spatial region, these formulas give exact signed entries b_i,d_i in terms of incomplete-gamma kernels with the full arithmetic coupling. The region feature Gram is b_i* A^(-1)b_j, where A is the complete, previously certified lower-degree block. The basic Jacobi reflection gives only identical-region vectors, hence no new nonparallel angular reserve (their feature-Gram edge itself is positive). To prove the degree-uniform signed graph inequality one still needs control of these cross-region contractions after inversion by the ACTUAL A. Positivity/complete monotonicity of the scalar K kernel is insufficient: the Laguerre coefficients and the r-binomial sum have both signs, and the already-certified negative cumulative tail excludes dropping those signs.

The new concrete output is an exact arithmetic matrix representation with a justified finite-degree tail mechanism, and a precise zero-reserve theorem for direct modular reflection. No unpaid remainder is declared positive; no all-degree anchor inequality or RH conclusion is claimed.
