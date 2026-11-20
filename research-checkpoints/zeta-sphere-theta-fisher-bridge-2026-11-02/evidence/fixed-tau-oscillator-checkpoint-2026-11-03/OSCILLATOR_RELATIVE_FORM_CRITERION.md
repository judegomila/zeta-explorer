# A complete-theta form-relative Schur criterion

Status: independent analytic review PASS. It applies to the actual complete theta source at every fixed finite shift a≥0. It is not an all-degree theta estimate, and its source-form ratio is not assumed uniformly bounded.

Fix τ>0 and either parity. Let λ=λ_a be the normalized signed bridge density and w=w_{τ,a} the positive Sobolev parent from SHIFTED_OSCILLATOR_CANCELLATION. Define the complete centered oscillator source

h=w/τ−λ=avg_{0≤b≤a} Re[(F''_b+F_b/τ) conjugate F_b],

with the a=0 limits. The established Cauchy inequality shows h²/w≤avg|F''_b+F_b/τ|² a.e., so every polynomial moment below is finite. Let p_N be the monic-up-to-scaling parent-orthonormal next polynomial, i.e. ∫p_N²w=1, let V be its same-parity lower polynomial space, and suppose the known old signed Gram is positive. Define

U_N=∫p_N² h²/w,
ρ_N=sup_{0≠g∈V} [∫g² h²/w]/[∫g²λ].                  (1)

For empty V, put ρ_N=0. Both are nonnegative and finite: V is finite dimensional and its signed Gram is strictly positive. U_N and the numerator of ρ_N are positive complete-theta auxiliary-source integrals; the denominator is the known old signed Gram. They require no lower bound on hypothetical negative support and no unknown next signed pivot. The parent polynomial and U_N use positive-parent/source information through the next degree, as stated; they are not computed from the signed next norm.

Parent orthogonality gives ∫g p_N λ=−∫g p_N h. Cauchy yields

|∫g p_N λ|² ≤ (∫p_N²w)(∫g²h²/w)=∫g²h²/w.             (2)

The variational formula for the actual old form cost gives

eᵀA⁻¹e = sup_{g∈V\{0}} |∫g p_N λ|² / ∫g²λ ≤ρ_N.      (3)

Separately, |∫p_N²h|≤√U_N, so the actual parent-next diagonal satisfies ∫p_N²λ≥1/τ−√U_N. Therefore its true Schur complement obeys

S_N ≥ 1/τ−√U_N−ρ_N.                                      (4)

In particular √U_N+ρ_N<1/τ is a concrete noncircular sufficient certificate of the next pivot's positivity. It controls the A⁻¹ *form cost* directly rather than imposing a bound on the stronger mismatch ||A⁻¹e||. The finite-dimensional ρ_N is the largest generalized eigenvalue of the explicitly computable positive auxiliary-source Gram against A. Equation (4) makes no claim that this certificate succeeds uniformly, or that the finite calculation is numerically easy. For n=0 or 1 the lower space is empty and the same diagonal bound applies with ρ_N=0.

## A precise generic obstruction

For the fixed Gaussian F(t)=exp(−t²/2) at a=0, λ=F²>0 and w=F²(1+τt²). Hence

(h²/w)/λ=(t²−1+τ⁻¹)²/(1+τt²) →∞ as |t|→∞.          (5)

Same-parity polynomials are dense in L²((λ+h²/w)dt), which has Gaussian decay, and can approximate parity-symmetric compact localizers near arbitrarily large ±t. Consequently ρ_N→∞ in each parity as the old degree grows. Thus the sufficient criterion (4) fails eventually for every fixed τ, even though the Gaussian signed form is strictly positive at every degree. This is an auxiliary-source counterexample, not a statement that actual theta ρ_N diverges. It shows why this Cauchy form bound must be supplemented by genuinely theta-specific localization or cancellation, or τ must vary with degree under separately controlled estimates.
