# Original-theta supersymmetric ladder and its signed defect

Status: independent analytic review PASS. No new bridge positivity is claimed.

## 1. Exact operator on the complete profile

Let ψ be the complete, even, positive theta profile used in the campaign, ℓ=log ψ, k=−ℓ″. The previously reviewed full-theta curvature bound is k>17. On C_c^∞(R), set Q=D−ℓ′ and Q*=−D−ℓ′. Then

H=Q*Q=−D²+(ℓ′)²+ℓ″,  QQ*=H+2k,  [Q,Q*]=2k.

The Friedrichs realization is nonnegative; ψ lies in its kernel. Multiplication by ψ unitarily identifies H with −D²−2ℓ′D in L²(ψ² du). The curvature of −2ℓ is >34. The usual one-dimensional weighted Poincare inequality therefore gives a spectral gap at least 34 above the ground state. Equivalently, QQ*=Q*Q+2k≥34 and the equality of the nonzero spectra of Q*Q and QQ* gives the same gap directly. This gap is an auxiliary positive L² statement, not a bridge inequality. The actual theta tail makes the potential confining, since ℓ′~−2πe^{2|u|} times the appropriate reflection sign, so (ℓ′)²+ℓ″→∞.

All identities below hold first on smooth compactly supported vectors; their use on any fixed derivative of ψ follows from the complete theta superexponential tails. Polynomially many derivatives and factors k have integrable boundary terms.

## 2. The actual derivative ladder is a signed, nonconstant correction

Write A=Q*. Since Qψ=0 and [Q,A]=2k,

Dψ=−Aψ/2,
D²ψ=(A²−2k)ψ/4,
D³ψ=−A³ψ/8+(3/4)k Aψ−(3/4)k′ψ.

In particular, positivity of the creation-ladder norm cannot simply be substituted for the derivative-ladder norm or signed bridge. Even the quadratic derivative includes subtraction of the multiplication operator 2k.

The exact intertwining defect is

[H,A]=2Ak=2kA−2k′.

Thus H A^n ψ=Σ_{j=0}^{n−1} A^j(2Ak)A^{n−1−j}ψ. Reordering k introduces its derivatives; only constant k produces the harmonic-oscillator fixed-energy ladder. For theta k~4πe^{2u} as u→+∞ (ℓ~const+9u/2−πe^{2u}), and k′~8πe^{2u}. Neither term vanishes. The displayed formulas retain the full theta kernel, with no orbit truncation.

## 3. A concrete test of the tempting positive-commutator lemma

Candidate: an even positive ground state with k≥17, a confining H, positive [Q,Q*], a uniform gap and the exact parity involution should force all polynomial bridge forms nonnegative. This candidate is false, even for profiles arbitrarily close in any prescribed finite-order log-derivative norm to a Gaussian.

For A0=18, b≥200 and ε=b^{−4}, define

ψ_b(u)=exp(−A0 u²/2)(1+ε cos(bu)).

It is positive, even and Schwartz, with every exponential moment and all derivative boundary terms. Direct differentiation gives

k_b=A0+ ε b²(cos(bu)+ε)/(1+ε cos(bu))²
≥18−ε b²/(1−ε)²>17.

Its H_b is confining, nonnegative and has gap≥34, and its creation/derivative identities are exactly those above. Nevertheless, with the Fourier convention F_b(z)=∫ψ_b(u)e^{izu}du,

F_b(z)=sqrt(2π/A0) exp(−z²/(2A0))[1+c_b cosh(bz/A0)],
c_b=ε exp(−b²/(2A0))∈(0,1).

It has simple zeros at

z=(A0/b)[± arcosh(1/c_b)+(2m+1)iπ].

For b≥200 the closest positive imaginary height δ=π A0/b<1/2. Near the zero γ+iδ, at z=γ+i(δ−η), the signed density U_a=−Im(F_b′ conjugate(F_b)) is negative for all sufficiently small η>0: factoring out the simple zero gives U_a=−η|G(γ+iδ)|²+O(η²). Reflection supplies the symmetric negative interval. At this fixed a, Gaussian decay gives exponential integrability; polynomial density in the even spectral subspace, and likewise the odd subspace, detects a negative polynomial bridge form. This does not assert a particular degree or that a given low-degree inverse-selected residual fails.

Consequently the general operator assumptions do not establish all-degree positivity. A first failing finite moment block exists in each detected parity sequence; until that failure its actual prefix is positive, so appealing to an actual positive prefix alone does not rescue the claimed universal implication.

For an arbitrary fixed derivative order r, replace ε=b^{−(r+3)}. Then derivatives of log(1+ε cos bu) through order r tend uniformly to zero, k remains>17, while δ=18π/b→0. Thus controlling finitely many log-profile derivatives, even with an exact positive commutator and a gap, is not an all-degree substitute. This family is NOT modular or rank-one arithmetic and is not a counterexample to theta/RH.

## 4. Exact remaining theta-specific question

For a fixed real-rooted monic p with root-deletion polynomials q_j, the audited original normalized bridge identity is exactly

h[p]=2π(2||u p(iD)ψ||²−Σ_j||q_j(iD)ψ||²).

This involves position-weighted actual derivatives, not the nonnegative H energy. The positive gap estimates ||Qf||² from below on the ground-state complement; it supplies no inequality of the displayed position-versus-root-deletion type. For inverse-selected p, real rootedness uses only the requisite known positive prefix, and its coefficients and lower terms must remain the actual ones. This equation is included to identify the missing comparison, not as a new sufficient estimate.

The noncircular useful target would be a signed estimate controlling the k,k′,… terms generated by the above commutator, on the actual inverse-selected derivative combination, by its correlated bridge energy, uniformly in degree and throughout the required shifts. Neither the auxiliary spectral gap nor the positive commutator provides that estimate. Replacing actual prefix norms by H graph norms would discard precisely these signed corrections.

This packet proves an exact full-kernel ladder defect and falsifies a concrete proposed class of operator hypotheses. It does not claim a factorization of the signed form, a new positive pivot, or an all-degree theorem.

Reference for the auxiliary variance bound: Brascamp and Lieb, J. Functional Analysis 22 (1976), 366–389, https://www.sciencedirect.com/science/article/pii/0022123676900045. Here it is used only in the form Var_μ(f)≤∫|f′|²/V″ dμ≤(1/34)∫|f′|²dμ, V=−2ℓ. No bridge result is attributed to that theorem.
