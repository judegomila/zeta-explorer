# Uniform central joint reserve from complete theta

Status: explicit unconditional positive partial integral. It is not a complete pivot bound: the signed complement remains uncontrolled. The construction uses the full theta identity, not a finite-sieve replacement.

Let

Φ(u)=Σ_{n>=1}(2π²n⁴e^(9u/2)−3πn²e^(5u/2))e^(−πn²e^(2u)), u>=0,
ξ(1/2+iz)=4∫_0^∞ Φ(u)cos(zu)du.

Every summand of Φ is positive. Define

ξ0=ξ(1/2)>0,
c0=(4/3)(2π²−3π)e^(−πe²)>0,
A_j=4∫_0^∞u^j Φ(u)cosh(u/2)du,  j=0,2,4,
L=A4 A0+A2²,  r0=sqrt(c0 ξ0/L)>0.

All constants are finite and involve the original theta kernel; explicit elementary upper bounds on A_j could be substituted if numerical constants are needed.

## Result

For every 0<a<=1/2 and |t|<=r0,

Λ_a(t)=(4/a)Re[ξ'(1/2+a+it)conj ξ(1/2+a+it)] >= 2c0 ξ0.  (1)

Consequently, every real monic polynomial p_n of degree n, including the actual inverse-selected residual, has

∫_{−r0}^{r0} p_n(t)^2 Λ_a(t)dt
 >= 4c0 ξ0 r0^(2n+1) / [(2n+1)(2^(−n)binom(2n,n))²].    (2)

The same holds at a=0 under the normalized continuous limit. This is a lower bound on the *local part only*; Λ_a can have an uncontrolled negative contribution outside this interval. The reserve decays exponentially with n when r0<2 and is not an all-degree payment of that complement.

## Proof

For σ=1/2+a, the first positive theta term restricted to 0<=u<=1 obeys

Φ(u)>=(2π²−3π)e^(−πe²).

Using sinh(au)>=au,

ξ'(σ)=4∫_0^∞u Φ(u)sinh(au)du >=c0 a,
ξ(σ)>=ξ0,

so q_a(0)>=c0 ξ0 a for q_a(t)=Re[ξ'(σ+it)conj ξ(σ+it)]. Functional symmetry and reality yield q_0(t)=0 for every t; q_a(t) is even in t. Differentiation gives

q_a''(t)=Re[−ξ'''(s)conj ξ(s)+ξ''(s)conj ξ'(s)],
∂_a q_a''(t)=Re[−ξ''''(s)conj ξ(s)+ξ''(s)conj ξ''(s)].

The mixed terms cancel exactly. The theta representation gives |ξ^(j)(s)|<=A_j for 0<=a<=1/2. Integrating the a-derivative from 0 to a gives |q_a''(t)|<=aL. Since q_a'(0)=0,

q_a(t)>=c0 ξ0 a−(aL/2)t²>=c0 ξ0 a/2

for |t|<=r0. Equation (1) follows. The degree-n monic Legendre polynomial minimizes the unweighted L² norm on [−r0,r0], giving integral minimum 2r0^(2n+1)/[(2n+1)(2^(−n)binom(2n,n))²]; multiply by (1) to obtain (2).

Through the exact ξ=KP factorization in POLE_FREE_JOINT_FACTOR.md, (1) bounds the *combined* gamma/cell expression at nonzero complex phases and retains all cross terms. It is independent of selected-prefix positivity, but by itself supplies no control of the far complement, where selection and arithmetic correlations remain essential.

## Fully elementary constants

One may eliminate the theta integrals from the bound at the cost of a much smaller interval. Put

x=e^(−π),  B=(1+11x+11x²+x³)/(1−x)^5,
U_j=8π²e^(−π)B j!/(2π−5)^(j+1),   j=0,2,4,
ξ_low=3c0,   L_up=U4 U0+U2²,
r*=sqrt(c0 ξ_low/L_up).

Indeed B=Σ_{n>=1}n⁴e^(−π(n−1)); use n²−1>=n−1, cosh(u/2)<=e^(u/2), and e^(2u)>=1+2u to obtain

Φ(u)cosh(u/2)<=2π² B e^(−π)e^(−(2π−5)u),

hence A_j<=U_j. The same first-mode bound on [0,1] gives ξ0>=4(2π²−3π)e^(−πe²)=ξ_low. Therefore |t|<=r* implies the fully explicit inequality

Λ_a(t)>=2c0 ξ_low,  0<=a<=1/2,

and the monic reserve (2) holds with r0,ξ0 replaced by r*,ξ_low. This elementary version is conservative and likewise does not bound the complement.
