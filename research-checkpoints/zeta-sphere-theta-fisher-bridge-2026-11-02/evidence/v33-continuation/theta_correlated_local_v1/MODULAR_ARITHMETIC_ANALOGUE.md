# An arithmetic counterexample to a modular-profile-only payment lemma

Status: independent analytic review PASS. This is an admissible test of specified hypotheses, not a counterexample to RH or to a rank-one-specific inequality.

Candidate being tested: exact Poisson self-duality of a theta heat trace, positive arithmetic orbit coefficients, a positive even superexponentially decaying differentiated profile, and the associated Hardy identities suffice to pay every inverse-selected bridge residual. The following arithmetic example has these properties but cannot have all-degree bridge positivity.

## 1. Explicit positive self-dual theta lattice

Take Q(m,n)=2m^2+2mn+3n^2 and
 A=(1/sqrt(5))[[2,1],[1,3]], det A=1.
For the integer rotation J=[[0,-1],[1,0]], direct multiplication gives A^(-1)=J^T A J. Define
 Theta_A(q)=sum_(v in Z^2)exp(-pi q v^T A v), Re q>0.
Poisson summation and the integer change of lattice variable J give the exact scalar modular identity
                         Theta_A(q)=q^(-1)Theta_A(1/q).     (1)
All theta orbit coefficients are positive. Set T(u)=Theta_A(exp u), D=d/du, and
                    Psi(u)=exp(u/2)(D^2+D)T(u).            (2)
Differentiation and (1) show Psi(-u)=Psi(u). For u>=0, each nonzero lattice vector contributes
 exp(u/2) z(z-2)exp(-z), z=pi exp(u)v^T A v.
Since Q(m,n)>=2 for nonzero integer vectors, z>=2pi/sqrt(5)>2. Every term is strictly positive. Thus Psi is positive everywhere on R, even, smooth, and superexponentially decaying with all fixed-order derivatives at both ends. Positivity on the negative half-line follows from (1), not from illegitimate termwise integration there.

## 2. Completed arithmetic transform and the known failure

Let E(s,Q)=sum'Q(m,n)^(-s). Mellin integration, first for Re s>1 where boundary terms vanish, gives
 integral_R Psi(u)exp(itu)du
 = s(s-1)(sqrt(5)/pi)^s Gamma(s)E(s,Q), s=1/2+it,          (3)
by analytic continuation. The profile's superexponential decay makes the left side entire. The right side's poles at0 and1 cancel. It is real and symmetric under s->1-s.

The discriminant is -20, fundamental for Q(sqrt(-5)). Its primitive reduced forms are precisely(1,0,5) and(2,2,3): the reduction bound a<=sqrt(20/3)<3 and |b|<=a give this short enumeration. Hence its class number is2.

The required external arithmetic fact is not conjectural. Yoonbok Lee's primary paper, On the Zeros of Epstein Zeta Functions, Theorems1.1 and1.3, states the result on off-critical-line zeros inside the critical strip for these class-number>1 forms and treats this exact Q as Q2. In particular E(s,Q) has zeros with1/2<Re s<1. Source: https://arxiv.org/html/1204.6297v1 , introduction/Theorems1.1 and1.3. The Gamma and polynomial factors in(3) do not remove those zeros.

Therefore the even real entire transform in(3) has nonreal conjugate zero pairs with imaginary distances0<delta<1/2. The exact pole-free zero-pair calculation in HARDY_ZERO_PAIR_SUM_RULE.md then gives a negative bridge density at some shift0<a<delta. Its exponential spectral decay permits polynomial-density detection in both parity families. At some finite degrees the associated bridge forms are not positive. No numerical zero or finite ladder run is needed for this conclusion.

## 3. Exactly what this falsifies, and what it does not

This example rules out a payment theorem based only on the hypotheses listed at the start: they hold here, including positive *complete* differentiated profile and exact modular identity, not merely an approximate symmetry or a sign-changing truncation. The same all-degree Hardy source identities hold, yet they cannot dominate every signed residual cost.

It is not the Riemann rank-one theta profile. Its lattice rank is2, its modular weight and differential operator differ, and the Epstein series is a combination of Hecke L-functions rather than the Riemann Euler product. No uniform logarithmic-curvature bound matching the Riemann profile is asserted here. Therefore this does not refute an inequality that genuinely uses those additional rank-one or arithmetic properties.

For the current proof search, the missing independently verifiable hypothesis must distinguish the rank-one Riemann arithmetic from this positive modular analogue. Merely invoking complete modular symmetry, positive orbit weights, reflection, positive profile, superexponential tails or Hardy energy cannot supply the all-degree lower bound. No replacement rank-one inequality is proved in this note.
