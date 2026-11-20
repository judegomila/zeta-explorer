# Positive orbit amplitudes do not make paired arithmetic blocks positive

2 November 2026. Independent hierarchy-lane review PASS; see TURNING_REVIEW_HIERARCHY.md. This is an exact sign theorem and counterexample to a per-product positivity mechanism, not a negative full-head example.

Use w_j(a,t) and Q_M from SIGNED_BILINEAR_AND_LOCALIZATION.md.

## 1. A genuine positive outer diagonal region

For every t>1/2, 0<a<=1/2 and integer j with 2pi j>=t,

                         w_j(a,t)>0.                  (1)

Proof: y(z)=K_(it)(z) solves

 (z y')'=(z-t²/z)y.

It is positive for large z and decays exponentially there. If y had a zero z0>=t, multiply this equation by y and integrate from z0 to infinity. Vanishing boundary terms give

 integral_(z0)^infinity [z(y')²+(z-t²/z)y²]dz=0,

which is impossible for a nonzero decaying solution. Hence K_(it)(z)>0 for z>=t.

In the exact w_j integral, every argument2pi jx is >=t. Moreover

 partial_a P_a(2t)/a=16(4t²+4a²-1)>0,
 [partial_a 2x^(-1/2)cosh(a logx)]/a>=0.

Differentiating before integrating therefore proves(1). No imaginary-order Bessel positivity is presumed outside its proved domain.

Consequently the diagonal terms with t/(2pi)<=n²<=M are a strictly positive reserve whenever that interval contains a square. The proof supplies a sign, not yet a sufficiently large quantitative lower bound to dominate the remaining head.

## 2. Exact negative complete prime-product blocks inside the adaptive head

For a prime p, the exact arithmetic product coefficient is

 B_p(t)=2cos(t log p).

For every prime p>=5, choose an odd integer L in

 [(3/2)p log p,(19/10)p log p].

Such an odd integer exists because the interval length (2/5)p log p exceeds2. Put t=pi L/log p. Then

 (3pi/2)p<=t<=(19pi/10)p<2pi p,
 B_p(t)=-2.

By(1), w_p(a,t)>0 for every0<a<=1/2. Thus the entire direct/dual, n/m-interchanged product-p contribution equals

                         B_p(t)w_p(a,t)=-2w_p(a,t)<0.  (2)

These are not discarded products in the standard adaptive head. For the minimal integer cutoff M+1=ceil[t/(sqrt(2)pi)], one has

 t/(sqrt(2)pi)>p

because3/(2sqrt(2))>1; hence M>=p. The negative paired product block lies inside the head, beyond the Bessel turning point where its amplitude is rigorously positive.

As p tends through primes these give unbounded heights. This does not imply that the entire Q_M is negative: diagonal terms, other products and the collective axis remain coupled. It rules out proving the desired finite-head threshold by assigning positive signs to all product blocks, even after exact direct/dual and reciprocal pairing.

## 3. Remaining arithmetic obligation

Equation(1) identifies a rigorously positive subset of the diagonal reserve. Equation(2) shows why amplitude positivity cannot be extended to arithmetic block positivity. A usable pointwise proof must estimate the aggregate oscillatory divisor contribution against a quantitative reserve, with the actual constrained phases. The reviewed negative2x2 coefficient minor and the reviewed universality comparison further prevent replacing this task by unrestricted Gram positivity or a fixed gamma-scale lower bound.
