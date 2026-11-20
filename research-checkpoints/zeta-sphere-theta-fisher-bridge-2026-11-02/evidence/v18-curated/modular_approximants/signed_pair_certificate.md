# Coherent head–tail phase certificate and local Schur test

2 November 2026. This is a constructive sufficient condition, not a factorization of the full theta interaction and not an RH proof. The exact tail from results.md is retained.

## 1. Exact signed pair, not a positive head/tail block
Use the centered completed variable w=a+it and define
H(w)=∫_0∞ f_N(u)cosh(wu)du,
R(w)=∫_0∞ r_N(u)cosh(wu)du,
F(w)=H(w)+R(w)=ξ(1/2+w).
Primes in this note mean d/dw. Then W_full=Re[F′overline F].

The exact 2×2 Hermitian coupling matrix for the pair (H,R) is
K_11=Re(H′overline H), K_22=Re(R′overline R),
K_12=(overline H R′+overline H′ R)/2, K_21=overline K_12.
Thus W_full=(1,1)^*K(1,1).

Requiring K positive semidefinite is TOO STRONG and in the fixed-cutoff high-height regime impossible: K_22=W_tail<0. The physical sum only tests the coherent vector (1,1); an arbitrary independent head/tail coefficient is not authorized by the original criterion. A successful Schur argument must retain this coherent interaction rather than demand separate positivity of the tail block.

## 2. Phase-aware scalar certificate
Assume H(w)≠0 and define
q=H′/H, μ=Re q,
u=R/H,
v=(R′−qR)/H.
Then EXACTLY

W_full/|H|² = μ|1+u|²+Re[v overline(1+u)].       (1)

Suppose rigorous bounds establish |u|<=ρ<1 and |v|<=η, with μ>0. Then

μ(1−ρ)>η                                             (2)

proves W_full>0. Indeed (1) is at least |1+u|[μ|1+u|−η].

This is not the tautology W_full>0 rewritten: μ is computed from the finite head, and ρ,η can be bounded independently from the exact analytic tail. In particular the correlated defect R′−qR can be enclosed directly using

R′−qR = ∫_0∞r_N(u){u sinh(wu)−q cosh(wu)}du,

or by the exact Euler remainder representation. The crude bound
η <= [R_1(A)+|q|R_0(A)]/|H|
remains valid for |a|<=A, but retaining the difference inside a certified oscillatory integral or a correlated enclosure may be much sharper.

For independent uncertainty disks |u|<=ρ, |v|<=η, (2) with >= instead of > is sharp for robust nonnegativity when μ>0 and ρ<1: the worst v points opposite to 1+u and |1+u| can equal 1−ρ. An equivalent 2×2 Schur certificate is

[[μ, η], [η, μ(1−ρ)²]] >= 0, with μ>0.

This is a small computable certificate, not a positive decomposition of C_a.

### Why it can beat independent absolute-error subtraction
If R=cH and R′=cH′ at the test point, then the defect v vanishes and W_full=|1+c|²W_head. Certificate (2) handles every |c|<1, however small μ>0 is. In contrast the bound that separately subtracts all |H′R|, |R′H| and |R′R| would, for real q=μ>0, require 2|c|+|c|²<1, i.e. |c|<sqrt(2)−1. Thus the phase-aware condition is genuinely less wasteful for correlated tails.

### Limits as a decreases to zero
At general t, μ may be O(a) while the modulus bound on v need not be O(a). Therefore this simple fixed-point phase certificate is not automatically uniform as a→0. The normalized second-derivative identity in adaptive_results.md should be used for all-small-shift error control; no claim that (2) solves that quantifier is made.

## 3. A general local Schur/S-procedure test retaining correlations
Let x=(H,H′)^T, y=(R,R′)^T, and J=[[0,1/2],[1/2,0]]. Suppose a rigorously computed positive definite matrix D encloses the exact tail by y^*D^(−1)y<=1. Then W_full=(x+y)^*J(x+y).

A sufficient robust certificate is existence of λ>=0 for which

[[J+λD^(−1), Jx], [x^*J, x^*Jx−λ]] >= 0.       (3)

When J+λD^(−1)>0, this is the explicit Schur condition

W_head >= λ+x^*J[J+λD^(−1)]^(−1)Jx.             (4)

Proof: the matrix quadratic form equals
W_full+λ(y^*D^(−1)y−1), which is <=W_full for the enclosed tail. Thus its nonnegativity implies the desired sign. Conversely the real S-lemma (applied to real and imaginary coordinates, with strict feasibility of the ellipsoid) shows this is exact for robustness over the entire ellipsoid; no converse is needed for use of the certificate. This is a one-parameter local feasibility problem with a 3×3 Hermitian matrix. It preserves correlations in D and the actual phase of x, rather than replacing every interaction by an independent scalar absolute value.

A computable ellipsoid is available directly from the positive tail density. Put m=∫r_N(u)du, k(u)=(cosh(wu),u sinh(wu))^T, and
D=m∫_0∞r_N(u)k(u)k(u)^*du.
Cauchy–Schwarz in every vector direction gives yy^*<=D, equivalently y^*D^(−1)y<=1 when D>0. All entries are exact convergent tail integrals, evaluable with the Euler–Maclaurin representation and rigorous quadrature. At singular D one can use its range and pseudoinverse or add a rigorously positive slack matrix. This construction is an enclosure, not a proof that (3) is feasible.

## 4. An unconditional parameter region where the scalar certificate succeeds
Here is an explicit nonzero-height region, illustrating that the criterion is usable rather than only formal. Fix 0<a0<=a<=A. Let
m0=∫f_1(u)du>0, m2=∫u² f_1(u)du>0,
P_j=∫u^j ψ(u)cosh(Au)du, j=0,1,2.
These are positive finite quantities with certified upper/lower bounds from explicit Gaussian integrals; they require no RH assumption.

Define
T=min{m0/(2P1), m0 a0 m2/[4(P0P2+P1²)], sqrt[m0 a0 m2/(4P1P2)]}.
For every N>=1 and |t|<=T:
|H(a+it)|>=m0/2, |H|<=P0, |H′|<=P1,
W_head>=m0 a0 m2/2,
μ>=μ_*:=m0 a0 m2/(2P0²)>0.

Proof: at t=0, H>=m0 and H′>=a0m2 since sinh(au)>=au. The perturbations obey |H(a+it)−H(a)|<=|t|P1 and |H′(a+it)−H′(a)|<=|t|P2. Hence
W_head>=m0a0m2−|t|(P0P2+P1²)−t²P1P2,
which yields the assertion by the definition of T.

Now choose N sufficiently large that
R_0(A)<m0/4,
2R_1(A)/m0+4P1R_0(A)/m0² < μ_*/2.
The explicit gamma bounds guarantee such an N and provide a computable choice. Uniformly on a∈[a0,A], |t|<=T, one has ρ<1/2 and η<μ_*/2. Condition (2) therefore certifies W_full>0 throughout this compact rectangle. This is a rigorous unconditional local region, not a novel zero-free-height claim or a route to arbitrary height by itself.

## 5. The modular-cancellation barrier in this formulation
In the adaptive subthreshold regime of adaptive_results.md, H=F−R≈−R. Thus u≈−1 and the allowed margin 1−ρ becomes tiny or may fail to be positive at all. At the same time the phase defect is small:

R′−(H′/H)R = (R′F−F′R)/H.

Both sides of the decisive inequality then depend on the exponentially small full-function scale. A tiny defect alone is not sufficient: the amplitude denominator is tiny as well. This is precisely where the exact modular coupling matters, and the phase-aware certificate does not manufacture a missing lower bound.

Above the adaptive approximation threshold, the exact tail is small at the completed-function envelope scale, so (2) or (3) can improve finite-point/finite-window certification when the head has a resolvable positive phase margin. Neither establishes that this margin persists at every height and every positive shift. Proving such a margin remains the RH-equivalent arithmetic problem, not a consequence of the local Schur algebra.
