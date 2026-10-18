# Prime-square separation in the finite Euler logarithm

18 October 2026. Bounded mathematical review of a prospective refinement of the existing finite-rectangle criterion. This is a fresh algebraic check, not a new all-height zero-free theorem. No publication has been performed.

## 1. Separate the square contribution exactly

Let Q>=2, h>0, s0>=1/2, and
V_Q(s)=product_(p<=Q)(1-p^(-s-h))/(1-p^(-s)).
The same convergent logarithmic branches used in the earlier notes give
L_Q(t)=log|1/V_Q(s0+it)|=-S1(t)-S2(t)+R3(t),
where
S1(t)=sum_(p<=Q) a_p cos(t log p), a_p=(1-p^(-h))p^(-s0),
S2(t)=sum_(p<=Q) d_p cos(2t log p), d_p=(1-p^(-2h))p^(-2s0)/2,
R3(t)=-sum_(p<=Q)sum_(j>=3)(1-p^(-jh))p^(-j s0)cos(jt log p)/j.
The minus sign in R3 follows from the reciprocal finite Euler product. Every prime p<=Q contributes its square, even when p^2>Q.

## 2. A uniform remainder through s0=1/2

For every s>=1/2 set
C3(s)=[2^(-3s)+2^(1-3s)/(3s-1)]/[3(1-2^(-s))].
Then, for all h>0, Q>=2 and real t,

|R3(t)|<=C3(s0)<=C3(1/2)=5(1+sqrt(2))/6.                  (1)

Proof: use 1/j<=1/3 and 0<=1-p^(-jh)<=1, then sum the geometric series:
|R3|<=sum_p p^(-3s)/(3(1-p^(-s)))
 <=[3(1-2^(-s))]^(-1) sum_(n>=2)n^(-3s).
The decreasing-function integral estimate gives the numerator in C3. Both the numerator and reciprocal denominator decrease as s increases; alternatively the majorized series is termwise decreasing. At s=1/2 the numerator is5/(2sqrt2), yielding the exact stated constant. The proof is uniform in Q and t. It does not use cancellation in R3.

For scale only, ordinary numerical evaluation gives C3(.834) approximately .312504, and C3(.5) approximately2.011845. The exact formula, not these rounded values, is the certificate.

The earlier all-j>=2 bound deteriorated at s=1/2 because it attempted to pay the square sum absolutely. The present refinement instead retains that square sum as part of the arithmetic target. It does not prove that the square contribution or its interaction with primes is small.

## 3. Retain the complete joint Poisson energy

Fix x>0 and carrier T. Let P_x have density
x/[pi(x^2+(t-T)^2)]dt.
Define two tails for v>=1:
A1(v)=sum_(v<=p<=Q) a_p p^(-x-iT),
A2(v)=sum_(p<=Q, p^2>=v) d_p p^(-2x-2iT).
A1 vanishes above Q and A2 above Q^2. The existing exact Poisson covariance identity gives

m12=E_Px(S1+S2)=Re[A1(1)+A2(1)],
v12=Var_Px(S1+S2)
   =x integral_1^(Q^2) v^(2x-1)|A1(v)+A2(v)|^2 dv.        (2)

There is no infinite-tail interchange in (2): both retained sums are finite. Its derivation uses the Fourier transform exp(-x|lambda|) and, for all m,n>1,
Cov(cos(t log m),cos(t log n))
 =cos(T log(m/n))/2 * [(min(m,n)/max(m,n))^x-(mn)^(-x)].
The sum-frequency term cancels exactly. The identity
x integral_1^min(m,n) v^(2x-1)dv=(min(m,n)^(2x)-1)/2
then gives (2), including its factor x.

In particular
v12=v1+v2+2x Re integral_1^(Q^2) v^(2x-1)A1(v)conj(A2(v))dv.
Equivalently, the prime/square covariance is
Cov(S1,S2)=sum_(p,q<=Q) a_p d_q cos(T log(p/q^2))/2
 *[(min(p,q^2)/max(p,q^2))^x-(p q^2)^(-x)].               (3)

The mixed term has no asserted sign. The p=q terms are included: a prime and its own square have distinct but arithmetically linked frequencies. Independence, zero covariance, and a favorable mixed sign must not be assumed. Dropping all squares above Q would change the finite Euler logarithm and invalidate the calculation.

## 4. The resulting sufficient budget

Keep the existing finite rectangle, all boundary hypotheses, and c=log A+m log T from its left ratio bound. To avoid symbol collision, call the available negative edge budget
Bstar=-w_L log2-w_R R_right-w_H B_horizontal.
Pointwise,
(c+L_Q)_+ <= (c+C3(s0)-S1-S2)_+.
The sharp two-moment inequality gives
E_Px(c+L_Q)_+ <= [a+sqrt(a^2+v12)]/2,
a=c+C3(s0)-m12.
Consequently the same Poisson-dominated rectangle certificate follows if

Bstar>0, a<Bstar, v12<4Bstar(Bstar-a).                    (4)

No assumption a>0 is needed. The j>=3 remainder is paid once in the clipping threshold, not again as a variance error. Equation (4) is a sufficient test, not an estimate proving that the actual joint mean and variance meet it. Moving squares out of the absolute remainder can improve or worsen the final available bound, depending on their actual mean and joint covariance; no net numerical improvement is established here.

## 5. Analytic requirements do not move automatically

The analytic residual remains
G(s)=zeta(s)/(V_Q(s)zeta(s+h))-1.
Separating the logarithmic square modes changes no denominator and no function G. The finite Euler product is nonzero on Re(s)>0, but zeta(s+h) must still be zero-free on a neighborhood of the entire closed certificate rectangle. The left ratio estimate and the right and horizontal edge bounds must still be verified there. Every target carrier, effective onset, and the intervening height range must still be covered.

If the supplied zero-free half-plane is Re(s)>beta0, the direct sufficient denominator clearance is s0+h>beta0. In particular s0=1/2 and h=1/8 provide only s0+h=5/8; a baseline near7/8 does not justify that clearance. Increasing h would change the analytic ratio estimates, whose earlier exponent inputs cannot be reused without a new proof. The uniformity of (1) at s0=1/2 removes a remainder-divergence obstacle only; it does not establish that the full certificate is valid near that line.

## Outcome

The prospective refinement is valid with exact remainder (1), complete joint energy (2)--(3), and sufficient budget (4). Its unresolved input is the actual joint prime/square arithmetic estimate under the unchanged analytic boundary conditions. No global7/8 improvement, RH statement, literature record, or publication is claimed.
