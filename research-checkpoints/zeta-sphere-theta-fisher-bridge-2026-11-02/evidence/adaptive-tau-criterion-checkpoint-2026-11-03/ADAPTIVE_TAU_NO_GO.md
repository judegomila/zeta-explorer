# No adaptive τ rescues the absolute oscillator form criterion

Status: independent analytic review PASS. This concerns only the sufficient Cauchy criterion √U_N+ρ_N<1/τ from OSCILLATOR_RELATIVE_FORM_CRITERION at normalized a=0. It does not assert a negative Schur pivot or rule out a correlated estimate.

Let F be the actual complete-theta transform, λ=F'²−FF'', w_τ=F²+τF'², h_τ=w_τ/τ−λ, and fix a parity r∈{0,1}. Let V_N be the nested old polynomial spaces in this parity. When their signed Gram is positive, define

ρ_N(τ)=sup_{0≠g∈V_N} [∫g² h_τ²/w_τ]/Q[g],
Q[g]=∫g²λ.

Set c₋=(3−√5)/2 and c₊=(3+√5)/2. For any old g with Q[g]>0 and W_τ[g]=∫g²w_τ>0, Cauchy implies

ρ_N(τ) ≥ [W_τ[g]/τ−Q[g]]²/[W_τ[g]Q[g]],
τρ_N(τ) ≥ (1−x_τ(g))²/x_τ(g),
x_τ(g)=τ Q[g]/W_τ[g].                                      (1)

Therefore ρ_N(τ)<1/τ requires c₋<x_τ(g)<c₊ for *every* old g. We prove that for actual theta this necessary condition fails at all sufficiently large levels, for every τ>0, even if τ may depend arbitrarily on N.

## Small τ: one fixed old test

Take g₀(t)=t^r. If Q[g₀]≤0, the corresponding old parity Gram already fails positivity at the first level containing g₀. Otherwise write U₀=∫g₀²F²>0 and Q₀=Q[g₀]>0, and let τ₀=c₋U₀/Q₀. Since W_τ[g₀]≥U₀,

x_τ(g₀)≤τQ₀/U₀≤c₋ for 0<τ≤τ₀.                           (2)

Thus (1) gives ρ_N(τ)≥1/τ whenever V_N contains g₀ and τ≤τ₀. No numerical bound or sign assertion about the next pivot is used.

## Larger τ: a short zero gap and a compact family of polynomial tests

Conrey's unconditional positive-proportion theorem for simple critical zeros implies arbitrarily small gaps between consecutive distinct real zeros of F. Choose one such gap I=(γ,δ), of length L<π√τ₀/c₊. The exact identity in ACTUAL_THETA_OSCILLATOR_FORM_OBSTRUCTION gives

∫_I τ λ/(F²+τF'²) dt=π√τ  for τ>0.                         (3)

For every τ≥τ₀, the average in (3) exceeds c₊, so some interior point t has

λ(t) > c₊[sF(t)²+F'(t)²],  s=1/τ∈(0,1/τ₀].              (4)

The same strict pointwise inequality holds at some interior point for s=0. To see this, F has a nonzero interior maximum in absolute value on the zero gap. Analyticity and the finite even order of its first nonzero Taylor term imply λ/F'² is arbitrarily large and positive at nearby points with F'≠0. (This also covers a flat maximum.)

For each s in the compact interval [0,1/τ₀], continuity gives a symmetric pair of small intervals on which (4) is strict. A nonzero compactly supported smooth localizer of the required parity on those intervals satisfies

Q[g] > c₊[s∫g²F²+∫g²F'²].                               (5)

Approximate this localizer in L²((|λ|+τ₀⁻¹F²+F'²)dt) by a same-parity real polynomial. The weight has exponential moments, so polynomial density follows by Laplace-transform uniqueness and parity symmetrization. Strict inequality (5) persists at s and, by continuity in s, in an open neighborhood of s. Compactness supplies finitely many such polynomials whose neighborhoods cover [0,1/τ₀]. Let N_* be large enough that all belong to V_N for N≥N_*.

For every τ≥τ₀ and N≥N_*, one of these tests has x_τ(g)>c₊. It has Q[g]>0 automatically; if the old Gram is positive, (1) gives ρ_N(τ)>1/τ.

## Conclusion and scope

For each parity separately, either an old signed Gram fails to be positive at a finite level, or there exists N_* such that for every N≥N_* and every τ>0, including arbitrary adaptive choices τ_N,

ρ_N(τ)≥1/τ, so √U_N(τ)+ρ_N(τ)<1/τ is impossible.      (6)

This is an actual complete-theta obstruction to that particular absolute-Cauchy form certificate. It does not establish a negative pivot or RH, does not preclude a form estimate retaining the moving-border correlations, and does not assert the same result for a>0. The positive-proportion critical-zero theorem is a classical external dependency, not a new zero computation.
