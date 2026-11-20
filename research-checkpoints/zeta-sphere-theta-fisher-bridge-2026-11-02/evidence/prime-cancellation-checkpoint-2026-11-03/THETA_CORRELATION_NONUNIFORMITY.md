# Noncommuting degree and prime-correlation limits for the actual theta weight

Status: independent analytic review PASS for the diagonal, cross-correlation and Parseval formulations. This is a structural no-go for a uniform *all-polynomial diagonal* Fourier-correlation bound. It does not assert failure of the actual old/next off-diagonal or inverse-selected estimate.

Fix finite real a≥0 and let w_a(t)=|F(t+ia)|², where F is the complete even real-theta transform. The weight is even, continuous, nonzero near zero, and has exponential moments. Indeed F(ia)=∫ψ(u)e^(−au)du>0 since the complete theta profile ψ is positive, and the gamma envelope gives exponential decay on a fixed horizontal strip.

For parity r=0 or 1 and n≥r, define

T_{n,r}(ω)=sup { |∫p(t)² w_a(t) cos(ωt)dt| / ∫p(t)² w_a(t)dt :
                   0≠p real, deg p≤n, p(−t)=(−1)^r p(t) }.

Then for each fixed n and r,

lim_{|ω|→∞}T_{n,r}(ω)=0,                                    (1)

in fact with a fixed-degree bound C_{n,a} exp(−c e^{|ω|}) for c>0. This follows entrywise from the audited complete-theta autocorrelation derivative estimate; a finite-dimensional Rayleigh quotient has only finitely many entries and its positive parent Gram has a fixed positive minimum eigenvalue.

In sharp contrast, for every fixed real ω,

sup_{n≥r} T_{n,r}(ω)=1.                                     (2)

The upper bound is |cos|≤1. For the lower bound, choose a small nonzero t₀ near zero where w_a>0 and cos(ωt₀) is arbitrarily close to 1. Choose a smooth nonzero real test supported in small neighborhoods of ±t₀, even for r=0 and odd for r=1, with its squared mass concentrated where cos(ωt) is close to 1. Same-parity polynomials are dense in L²(w_a dt), by exponential moments and parity symmetrization. Approximation in L² implies convergence of both the norm and the bounded-cosine quadratic form, giving arbitrarily close to 1. If ω=0 the equality is immediate.

Consequently, for the prime-power frequencies ω=log(p^m),

lim_{p^m→∞} sup_n T_{n,r}(log(p^m)) = 1,
while sup_n lim_{p^m→∞} T_{n,r}(log(p^m)) = 0.              (3)

This holds for the actual complete-theta parent and each parity, without RH or a negative-support hypothesis. It proves that the source-specific superexponential fixed-degree correlation bound cannot be made degree-uniform over all normalized parity polynomials, and shows why a cutoff must account for degree or exploit further structure.

It does not prove that the off-diagonal vectors ⟨v_i,p_N cos(ωt)⟩, the actual inverse-selected residuals, or their full signed prime/source combination have the same behavior. Their cancellation is the remaining possible theta-specific mechanism. The statement applies to any fixed finite a; using it in an Euler-factor expansion still requires the latter's separate |a|<1/2 domain.

## Cross-correlation obstruction for any fixed old space

Fix either parity and any finite-dimensional old polynomial subspace V containing a normalized polynomial p_*. Let P_V be orthogonal projection in L²(w_a dt) and set M_ωf=cos(ωt)f. Define

q_ω=(I−P_V)M_ωp_*.

This is orthogonal to the entire chosen old space. Every component of P_VM_ωp_* tends to zero as |ω|→∞, by the fixed-degree theta correlation estimate, while ||M_ωp_*||²→1/2. Therefore ||q_ω||²→1/2; in particular it is nonzero for sufficiently large |ω|, and on that range

⟨p_*,M_ω q_ω⟩/||q_ω|| = ||q_ω|| → 1/√2.                 (4)

For each ω, approximate q_ω in L²(w_a) by same-parity polynomials and subtract their P_V projections; the resulting polynomials remain exactly old-orthogonal and retain (4) arbitrarily closely. Thus no decay uniform over arbitrary degree can follow from orthogonality to a fixed old space, even for the off-diagonal theta source correlation.

The constructed higher test may use several parent polynomials and is not the specific next parent residual p_N, which is orthogonal to *every* lower degree. It also does not use the actual old inverse. Hence this strengthens the structural warning but is not a counterexample to the desired theta-selected forcing bound.

Equivalently, let {p_N} be the actual complete-theta parent-orthonormal polynomial basis in the chosen parity. Parseval sharpens (4) to

∑_{N≥N₀}|⟨p_N,cos(ωt)p_*⟩_w|² → 1/2                    (5)

for every fixed N₀, as |ω|→∞. The full squared norm tends to 1/2, while each of the finitely many omitted coefficients tends to zero. Every fixed-N term in (5) tends to zero superexponentially, so the Fourier-correlation mass escapes to arbitrarily high *actual parent polynomial* degrees. This does not give a quantitative lower bound for an individual p_N at a prescribed prime power and does not control the actual signed inverse.
