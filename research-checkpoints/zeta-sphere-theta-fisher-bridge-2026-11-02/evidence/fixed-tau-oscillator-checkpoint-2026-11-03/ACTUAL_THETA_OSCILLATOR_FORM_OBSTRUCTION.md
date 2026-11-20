# Actual-theta obstruction to a fixed-τ oscillator form certificate

Status: independent analytic review PASS. This rules out the particular uniform sufficient criterion in OSCILLATOR_RELATIVE_FORM_CRITERION, not bridge positivity, RH, a degree-dependent τ, or a more correlated form estimate.

Let F(t)=2ξ(1/2+it) be the real even complete-theta transform at normalized a=0. Fix τ>0, put λ=F'²−FF'', w=F²+τF'², h=w/τ−λ, and κ=λ/w wherever w>0. On an interval where F≠0, let p=F'/F. Then

κ=−p'/(1+τp²)=−τ^(−1/2) d/dt arctan(√τ p).             (1)

If γ<δ are consecutive distinct real zeros of F, neither must be simple. Each has finite positive multiplicity, so p(t)→+∞ as t↓γ and p(t)→−∞ as t↑δ. Hence the improper integral is exact:

∫_γ^δ κ(t)dt=π/√τ.                                       (2)

Conrey's unconditional theorem gives a positive proportion of zeta zeros simple and on the critical line: https://citeseerx.ist.psu.edu/document?doi=ad1dd9ac29ee82e1078d604deddd453bfd9c46a0&repid=rep1&type=pdf. In particular there are ≫T log T distinct real F-zeros in [0,T] for large T, so some gaps between consecutive real zeros have length O(1/log T) and tend to zero. Equation (2) forces

sup_{t: w(t)>0} κ(t)=+∞.                                 (3)

No RH or next-pivot sign is assumed in (1)–(3). At any point where κ>0, λ=κw>0 and

(h²/w)/λ = (κ−1/τ)²/κ.                                   (4)

Thus this positive-source-to-signed-density ratio is unbounded on open intervals where λ>0.

Suppose, conditionally, that the actual signed old Gram remains positive at every degree in the selected parity, so its constants ρ_N from OSCILLATOR_RELATIVE_FORM_CRITERION are defined for all N. Given any M>0, select a small symmetric pair of intervals around ±t₀ on which λ>0 and the ratio (4)>M. A nonzero parity-symmetric compactly supported localizer there has numerator/denominator ratio >M. Same-parity polynomials approximate it in L²((|λ|+h²/w)dt): that positive weight has exponential moments by the complete-theta and oscillator bounds, so polynomial density follows by analytic Laplace-transform uniqueness and parity symmetrization. The approximating polynomial's signed denominator remains positive, and for sufficiently large N it lies in the old space. Consequently

ρ_N→∞ in each parity ladder whose old Grams remain positive at every degree.                              (5)

Therefore, separately for each parity ladder and every fixed τ, either an old signed Gram eventually fails to be positive or the sufficient inequality √U_N+ρ_N<1/τ from OSCILLATOR_RELATIVE_FORM_CRITERION must fail for all sufficiently large N. This is a theta-specific, unconditional dichotomy. It does not show that the selected Schur pivot is negative: ρ_N is a worst-case auxiliary bound, and its failure can be caused by Cauchy and suprema discarding the actual moving-border correlation. It also does not rule out τ varying with N or a different genuinely correlated estimate.

## Unbounded upper form spectrum, without prefix positivity

There is also an unconditional consequence independent of the dichotomy. For either parity, let A_N be the signed Gram on parent-orthonormal polynomials of degree up to the Nth level. Then

λ_max(A_N)=sup_{0≠g in the old parity space} Q[g]/∫g²w → +∞.  (6)

Indeed choose a symmetric localizer supported where κ>M; the numerator/denominator ratio exceeds M. Same-parity polynomials approximate it in L²((|λ|+w)dt), a weight with exponential moments, and nestedness gives (6). No signed Gram positivity is needed for this assertion. It rules out an all-degree bounded-above parent-relative signed multiplication form, but it does not imply any lower-eigenvalue decay, inverse blow-up, or negative pivot.
