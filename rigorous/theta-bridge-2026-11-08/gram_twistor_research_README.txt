ZETA, TORUS PERIODS, AND THE GRAM FACTORIZATION ATTEMPT
Research calculation, 7 November 2026 (America/Los_Angeles)

STATUS
This package does not prove or disprove RH. It records an exact coupling of
the theta kernel to the monopole period family, an unconditional two-point
positivity result, and a certified rejection of a particular intermediate
factorization. The integrated derivative-kernel positivity remains open.

FILES
gram_attack_torus_theta_20261108.py -- interval arithmetic certificates.
gram_attack_torus_theta_20261108.txt -- full elementary bounds and signed Gram.
gram_layer_cancellation.py -- numerical illustration and period-identity check.
gram_layer_cancellation.json -- numerical illustration data and limitations.
gram_layer_cancellation.png / .svg -- numerical cancellation figure.

Run the certificate with Python and mpmath:
    python3 gram_attack_torus_theta_20261108.py
The illustration also requires numpy, scipy, and matplotlib.

1. EXACT PERIOD COUPLING

Write K(k) for the complete elliptic integral with modulus k, and
K'(k)=K(sqrt(1-k^2)); the prime here is a complementary period, not a derivative.
For the quartic E_r: eta^2=(w^2+r^2)(w^2+r^-2), r>1, define

    m=r^-2, k=(1-m)/(1+m), exp(b)=K'(m)/(2K(m)).

Landen's formulas imply K'(k)/K(k)=exp(-b). For
theta(t)=sum_{n in Z} exp(-pi*n^2*t), the theta/period identity and modular
transformation then give the exact formula

    H(b)=exp(b/4)*theta(exp(b))
        =sqrt(2/pi)*(K(k(b))*K'(k(b)))^(1/4).

Consequently kappa=(d_b^2-1/16)H is a differentiated scalar built from the
periods of the charge-two monopole family. Its bilateral transform is

    F(z)=xi(1/2+z)=integral_R kappa(u)*exp(z*u/2) du.

This uses the full family as b varies, rather than a finite-degree section on
one compact spectral curve. The numerical check at r=2 agrees to approximately
65 decimal places; the identity follows analytically from the formulas above.

References for the standard identities:
https://dlmf.nist.gov/19.8
https://dlmf.nist.gov/22.2

2. THE EXACT POSITIVITY TARGET

    R_x(b)=integral_R exp(x*a)*kappa(a+b)*kappa(a-b) da,
    M_x(b)=d_x R_x(b), x>0.

The shear is W(x,t)=Re(F'(x+it)*conj(F(x+it))) and

    W(x,t)=integral_R M_x(b)*cos(t*b) db.

Positive definiteness of M_x for all x>0 is the required sign theorem. The
target is the full two-variable identity M_x(b-c)=<q_b,q_c>, not merely a
positive diagonal or the antidiagonal of some unrelated Gram kernel.

The accompanying notes derive an exact signed Gram. Let
g_b(t)=exp(x*(t+2b)/2)*kappa(t+2b), and for alpha>0 put
p_b=(g_b+alpha*d_x g_b)/sqrt(2*alpha),
n_b=(g_b-alpha*d_x g_b)/sqrt(2*alpha). Then

    M_x(b-c)=<p_b,p_c>-<n_b,n_c>.

A contraction C_x with C_x p_b=n_b for every b would solve the remaining
inequality. Its formal Fourier multiplier, where the denominator is nonzero,
is

    S_x(t)=(F(x+it)-alpha*F'(x+it))
           /(F(x+it)+alpha*F'(x+it)).

The identity |F+alpha F'|^2-|F-alpha F'|^2=4 alpha W shows why defining this
multiplier does not prove contractivity. Its modulus bound is the unresolved
sign. On the critical line it has unit modulus where defined; boundary
losslessness alone does not establish analyticity and contractivity inside.

3. CERTIFIED FIXED-LAYER OBSTRUCTION

The proposed intermediate layer kernels are
h_a(b)=kappa(a+b)*kappa(a-b), with

    M_x(b)=2 integral_0^infinity a*sinh(x*a)*h_a(b) da.

Take b_j=3j/20, j=0,...,6, c=(-2,9,-19,24,-19,9,-2). Interval arithmetic
with an explicit full theta-series remainder proves

    c^T[h_(1/20)(b_i-b_j)]c
      is in (-0.000908036036924, -0.000908036036922).

Thus the layer at the strictly positive a=1/20 is not a positive-definite
kernel. No positive Gram factor exists separately for every original layer.
The certificate includes all theta terms via a bounded remainder; it is not
a floating-point extrapolation or a test of only a truncated model.

For the same vector, direct high-precision quadrature of the INTEGRATED
kernel at x=1/4 gives

    c^T[M_(1/4)(b_i-b_j)]c
      =0.0016193669682471258322332013168242188194822...

The latter number is a numerical diagnostic, not an interval certificate or
a proof of global positive definiteness. The picture shows where positive
and negative contributions occur for this one direction. The required proof
must control arbitrary finite linear combinations and all relevant x.

4. WHAT THE MONOPOLE POSITIVITY CAN AND CANNOT SUPPLY

The standard charge-two Nahm metric is
h(z)=K^-1 [[f1,-f2],[-f2,f1]], with
f1=K dn(Kz)/cn(Kz), f2=K k' sn(Kz)/cn(Kz),
f3=K k'/cn(Kz), -1<z<1.
These formulas are in Braden--Enolski, equations (6.3),(6.7):
https://arxiv.org/pdf/1708.09660

Direct algebra gives f1^2-f2^2=K^2, so h is positive with determinant one.
Write h=exp(-alpha(z)*sigma_1), where alpha'=f3>0. The two eigenvalues
of h' are -alpha'*exp(-alpha) and +alpha'*exp(alpha). Its derivative is
indefinite. Ordinary metric positivity does not yield derivative positivity.
Here z is Nahm time, not the Mellin tilt x; equating them is itself an
additional ansatz and does not fix the sign.

There is also a finite-divisor obstruction to the literal section insertion.
For the degree-two bundle N_lambda=L^lambda tensor pi^*O(1) on a genus-one
curve, dim H^0(N_lambda)=2. A ratio of two sections is meromorphic on the
compact curve with finitely many zeros and poles. The candidate ratio
Xi(1/(2*zeta))/Xi(zeta/2) instead has infinitely many zeros and poles
accumulating at the punctures. A common spin or exponential factor does not
change this ratio. Therefore those two scalar zeta components cannot be the
ordinary degree-two Nahm basis.

A fixed finite number of scalar features is likewise insufficient for M_x:
a nonzero, decaying, translation-invariant positive kernel has infinite rank.
This does not exclude rank-two fibers with an additional continuous feature
variable. An infinite-dimensional construction remains possible.

5. WHAT IS ESTABLISHED AND WHAT IS STILL OPEN

Established: period identity; exact signed Gram; all two-point positivity
from known strict log-concavity; the certified negative seven-point layer;
the explicit indefiniteness of the Nahm metric derivative.

Open: an independently constructed contraction between the plus and minus
theta features, or an equivalent positive factorization that mixes the full
family of midpoint contributions. The normalized monopole curve alone does
not furnish this contraction.

For prior work on the associated-kernel/Laguerre hierarchy and the kernel's
strict log-concavity see George Csordas, Theorems 3.5--3.7 and 4.5--4.6:
https://arxiv.org/pdf/1309.0055
The known horizontal-modulus RH equivalence is discussed by Sondow and
Dumitrescu: https://arxiv.org/abs/1005.1104
