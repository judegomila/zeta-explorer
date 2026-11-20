# Twin-ladder rational square completion with actual inverse feedback

New companion awaiting independent review. All main primitive/scalar notes remain frozen. No higher finite ladder is computed.

Work at normalized a0 with F=hat psi, Lambda=F'^2-FF'', x=t², and a fixed s=d²>0 (d=1/2 for the actual base-2 endpoint primitive). Define the actual signed functional mu[r]=integral_R r(t²)Lambda(t)dt and J=integral Lambda/(x+s). The positive normalization factor relating mu to the original bridge is omitted consistently.

Assume only the CURRENT original even and odd blocks required below are positive: mu[|q|²]>0 and mu[x|q|²]>0 for nonzero q of degree<=N-1. These are the two actual parity ladders through physical degree2N-1. No next even pivot is assumed.

## 1. Exact square plus one scalar remainder

For deg p<=N write p=p0+(x+s)q, p0=p(-s), deg q<=N-1. In the monomial basis v=(1,x,...,x^(N-1)), let
 C_ij=mu[x^(i+j+1)]+s mu[x^(i+j)],
 b_i=mu[x^i].
C is strictly positive by the two known parity blocks. Its inverse is therefore legitimate before proving the next even pivot. It is not an auxiliary positive-parent inverse.

If q has coefficient vector z, exact polynomial division gives
 I[p]:=integral |p(t²)|²Lambda(t)/(t²+s)dt
  =(z+p0 C^-1 b)^* C(z+p0 C^-1 b)
    +|p0|² Delta_N,
 Delta_N=J-b^TC^-1b.                                  (1)
For complex coefficients the obvious conjugate cross terms are included. Thus the higher rational form has a genuine positive square and an explicitly retained signed scalar correction. The correction includes the ACTUAL current inverse feedback rho_N=b^TC^-1b. It is not replaced by positivity of J.

The actual-theta scalar estimate in the audited companion gives, for every R>0,
 Delta_N >= (pi/d)exp(-2dR)M_0(R)M_2(R)-rho_N,          (2)
where M_j(R)=integral_(-R)^R u^j psi(u)du. This is an explicit noncircular sufficient test if its right side is nonnegative. No such success is claimed at uncomputed degrees.

## 2. Orthogonal residual and the unchanged original top moment

Let P_N be the monic degree-N polynomial orthogonal to degrees<N under mu, constructed from the known positive degree-(N-1) block and known cross moments through2N-1. Then the minimizing residual in(1) is
 p_*(x)=P_N(x)/P_N(-s).
The denominator is nonzero: if P_N(-s)=0, write P_N=(x+s)q with deg q=N-1. Orthogonality would give0=mu[P_N conjugate(q)]=mu[(x+s)|q|²]>0, a contradiction. This proof uses C positivity only.

Hence Delta_N=I[P_N]/|P_N(-s)|². It is a rational residual, not the original next norm mu[|P_N|²]. The latter still includes mu_(2N), which appears with coefficient1 in the zero-tail original Gram from SCALAR_RECURRENCE.md. Proving Delta_N>=0 alone therefore does not establish the new original pivot.

## 3. A precise obstruction to using one fixed scalar lower floor

Set Phi(R)=(pi/d)exp(-2dR)M_0(R)M_2(R). The positive double-integral representation of J shows Phi(R)<J for every finite R>0. Moreover Phi is continuous and tends to0 as R tends to0 or infinity. Thus
 Phi_*:=max_(R>0)Phi(R)<J.                             (3)
This strict slack is for the ACTUAL theta profile, not a generic counterexample.

If C_N stays positive for all N, the finite costs rho_N are nondecreasing (nested positive quadratic minimization). In this case the even signed density Lambda is in fact nonnegative: its exponential Fourier decay makes even polynomials dense in the even subspace of L²((t²+s)|Lambda|dt); positivity of the quadratic functional on every even polynomial extends by this density to even test indicators. A negative even set would contradict positivity. This is a conditional implication, not an assumption that the conclusion has already been proved.

Under that same condition, polynomials approximate1/(t²+s) in L²((t²+s)Lambda dt), so the exact residual norm in(1) tends to0 and
 rho_N -> J.
The polynomial density used here follows, for example, by the standard analytic-annihilator argument: exponential integrability makes the Fourier transform of an orthogonal signed measure analytic in a strip; vanishing of all moments forces it to vanish. Evenness permits restriction to even polynomials. Full-theta strip bounds provide the required exponential integrability for Lambda and its fixed polynomial weights.

Combining with(3), the sufficient lower bound Phi_*−rho_N becomes negative at sufficiently large N if the positive prefix continues indefinitely. If C loses positivity first, the proposed induction is already blocked. Therefore this particular fixed scalar-floor strategy cannot close all degrees, even in the favorable case in which the true rational forms are positive.

This does not rule out a degree-adaptive lower approximation to J with certified error smaller than Delta_N, or a correlated estimate of Delta_N itself. It demonstrates that the currently available coarse positive scalar lower bound cannot pay the growing actual inverse feedback uniformly.

## Scope

Equation(1) is an exact rational sum of squares with one controlled signed correction; (2) is a valid actual-theta lower estimate; (3) and the density argument demonstrate its all-degree limitation. No original next pivot, rational Gram sign at arbitrary degree, or RH conclusion is asserted.
