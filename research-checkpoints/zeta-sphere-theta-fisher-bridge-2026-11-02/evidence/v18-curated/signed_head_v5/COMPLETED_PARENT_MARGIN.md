# Phase-preserving completed parents: an explicit signed-head margin

2 November 2026. New derivation; independent hierarchy-lane review PASS; see REVIEW_HIERARCHY.md. Fourier convention is integral exp(-ikv)dv. The exact corrected Ewald head D_(a,N) retains all axes and the mixed orbits 1<=n,m<=N. This note does NOT claim positivity of the full kernel.

## 1. Exact decomposition

Write tau=k/2>0, p=1/2+a, s_nm=2pi nm, v_nm=(1/2)log(n/m), and

 P_a(k)=16(tau^2+p^2)(tau^2+(1-p)^2),
 g_p(k)=pi^(-p)|Gamma((p+i tau)/2)|^2,
 S_N(z)=sum_(n<=N)n^(-z).

The completed parent is the explicitly nonnegative expression

 T_N=g_p|S_N(p+i tau)|^2+g_(1-p)|S_N(1-p+i tau)|^2.

Set L_(p,s)=integral_0^1 [x^(p-1)+x^(-p)]K_(i tau)(sx)dx. For 0<a<1/2,

 hat D_(a,N)/a = (partial_a(P_a T_N))/(128a) + hat A_a/a
   -(1/(32a))sum_(n,m<=N) exp(-ik v_nm) partial_a(P_a L_(p,s_nm)). (1)

The n,m pairs make the last expression real. This is an identity, not a positivity factorization: differentiation of T_N need not preserve its sign.

Proof: the Fourier transform of exp(-pi x Q_nm(v)) is exp(-ikv_nm)K_(i tau)(2pi nmx). Complete the x integral from [1,infinity) to [0,infinity). The exact Mellin integral is

 integral_0^infinity x^(p-1)K_(i tau)(sx)dx
 =2^(p-2)s^(-p)Gamma((p+i tau)/2)Gamma((p-i tau)/2).

Summing the four mixed quadrants gives T_N. The omitted [0,1] integrals have coefficient four, giving (1).

## 2. Fully explicit low-integral bound, uniform as a decreases to zero

The convergent Bessel power series gives

 L_(p,s)=Re{Gamma(i tau)(s/2)^(-i tau)sum_(j>=0)
 [(s^2/4)^j/(j!(1-i tau)_j)]
 [1/(p+2j-i tau)+1/(1-p+2j-i tau)]}.

The formula initially follows by termwise integration for 0<p<1. Its right side and differentiated expressions extend continuously to p=0,1, which defines the endpoint limit of the decomposition. The original individual low integral at the endpoints need not be absolutely convergent.

Since |(1-i tau)_j|>=tau^j and each denominator has modulus at least tau,

 |L|<=2|Gamma(i tau)|exp(s^2/(4tau))/tau,
 |partial_a L|/a<=4|Gamma(i tau)|exp(s^2/(4tau))/tau^3.

For the second bound, use symmetry about p=1/2 and the bound 4/tau^3 on the second derivative of the bracket. Also

 |partial_a P|/a<=16(k^2+2), P<=(k^2+4)^2.

Consequently the absolute value of the last term of (1) is at most

 E_N(tau)=N^2|Gamma(i tau)|exp(pi^2 N^4/tau)
              [6tau+6/tau+2/tau^3].                       (2)

This bound retains the exact paired a-derivative before estimating, so incurs no 1/a loss. No zero location or unknown Xi denominator enters.

## 3. A genuine finite-head theorem

For N=1, every |k|>=200 and 0<a<=1/2,

             hat D_(a,1)(k)/a >= (|k|/2)^3 exp(-pi|k|/4). (3)

The endpoint is understood by continuity. This is a theorem about the corrected finite head ONLY.

Here is a deliberately conservative proof. Assume tau>=100. For 0<=p<=1 put ell(p)=partial_p log g_p. With y=tau/2, the standard digamma series and monotone integral comparison give

 Re psi(iy)=-gamma+sum_(n>=1)y^2/[n(n^2+y^2)]
          >=-gamma+(1/2)log(1+y^2)>=log y-gamma.

For 0<=x<=1/2,
 |psi'(x+iy)|<=sum_(n>=0)1/((n+x)^2+y^2)<=1/y^2+pi/(2y).

Hence
 ell(p)>=log(tau/(2pi))-gamma-2/tau^2-pi/(2tau)>1,
 ell'(p)>=-2/tau^2-pi/(2tau)>-1/2.

It follows that g_p is increasing and g_p''>g_p/2>=g_0/2. Therefore, for T_1=g_(1/2+a)+g_(1/2-a),

 T_1'/a>=g_0, P_a'/a>0,
 (partial_a(P_a T_1))/(128a)>=tau^4 g_0/8
 =pi tau^3/[4sinh(pi tau/2)] > (3/2)tau^3 exp(-pi tau/2).

The exact gamma modulus gives |Gamma(i tau)|<3tau^(-1/2)exp(-pi tau/2). Since exp(pi^2/tau)<2 and 6tau+6/tau+2/tau^3<7tau, (2) gives E_1<42sqrt(tau)exp(-pi tau/2).

The exact collective-axis identity from AXIS_CLOSURE_IDENTITY.md gives

 |hat A_a/a|<=sqrt(1+4tau^2)|zeta(1+2i tau)|/[2sqrt(cosh(pi tau))]
             <=2tau[log(2tau+1)+4]exp(-pi tau/2)
             <=2tau^2 exp(-pi tau/2).

For completeness the elementary zeta bound |zeta(1+ik)|<=log(k+1)+4, k>=1, follows by Euler summation at M=ceil(k): harmonic sum<=1+log M, integral term<=1/k, remainder<=|1+ik|/M<=sqrt(2). Also log(2tau+1)+4<=tau for tau>=100, by its value and derivative there.

Thus the total two corrections are <3tau^2 exp(-pi tau/2). Subtracting from (3/2)tau^3 exp(-pi tau/2) proves (3), with considerable slack.

## 4. Exact remaining obligation and comparison with spurious heads

The full omitted mixed-orbit Fourier density is still signed. The spatial/L1 Ewald tail bound alone is height independent and cannot be compared to the exponentially vanishing margin (3) at all heights. A valid extension needs an omitted-orbit bound < the actual signed-head margin (possibly with an adaptive N and recomputed parent derivative).

Ordinary finite theta profiles have negative t^-6 shear tails because modular endpoint cancellation is broken. This corrected construction has the exact entire axis closure and smooth modular pairing, so the algebraic obstruction does not apply. Nevertheless a positive corrected N=1 head is not evidence that its omitted tail is small relative to the full shear. The theorem proves a nontrivial signed-head high-frequency margin, not global PD, not RH, and not a full-kernel positivity band.

## Primary identities used

NIST DLMF: https://dlmf.nist.gov/10.43.E19 (Mellin integral), https://dlmf.nist.gov/10.27.E4 and https://dlmf.nist.gov/10.25.E2 (K/I connection and power series), https://dlmf.nist.gov/5.15.E1 (trigamma series). All algebra and bounds above are included, rather than depending on numerical experiments.
