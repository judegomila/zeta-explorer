# A degree-dependent analytic band across the exterior boundary

Status: independent analytic review PASS. This is a corollary of established zero-free regions and complete-theta decay, not RH or a fixed inner-shift all-degree theorem. No new finite numerical certificate is used.

## 1. Statement and constants

Let F(z)=∫ψ(u)e^{izu}du=2ξ(1/2+iz) be the original complete-theta transform and

Λ_a(t)=−Im(F′(t+ia) conjugate(F(t+ia)))/a.

There are explicit positive constants η,m,C,τ, defined below by convergent full-theta integrals, such that the following construction works for every integer n≥1.

Put B=2/η+1 and let R_n be the smallest integer R satisfying

R≥max(2,4n/τ),
[2C(n+1)²/(ητ)] (BR)^{2n} e^{−τR}≤m/2.                       (1)

Set ε_n=min(1/4,1/[6 log(R_n+3)]). Then for every a∈[1/2−ε_n,1/2] and every real polynomial p of degree≤n,

∫p(t)²Λ_a(t)dt ≥ (m/2)∫_{−η}^{η}p(t)²dt.                    (2)

Thus every such finite block is strictly positive throughout that interval. Together with the already established exterior positivity, its positivity holds for every a≥1/2−ε_n. The quantitative bound (2) is stated only on the compact inner band.

The construction has R_n=O(n log(n+2)), and in fact log R_n/log n→1. Hence ε_n~1/(6 log n). This band shrinks to the exterior boundary as degree grows; it covers no fixed a<1/2 at all degrees.

## 2. Uniform central reserve from the complete positive profile

Write
Z₀=∫ψ(u)du, M₂=∫u²ψ(u)du,
M_j^*=∫|u|^j ψ(u)e^{|u|/2}du, j=0,2,
m₀=Z₀M₂>0,
η=min(1,m₀/[8M₀^*M₂^*]), m=m₀/2.

For 1/4≤a≤1/2, let Z(a)=F(ia)=∫ψe^{−au}. Evenness and positivity give Z(a)≥Z₀ and Z′(a)/a≥M₂, so Λ_a(0)=Z(a)Z′(a)/a≥m₀.

Also ∂_tΛ_a=−Im(F″ conjugate(F))/a because F′ conjugate(F′) is real. Hence |∂_tΛ_a|≤4M₂^*M₀^* for every real t. The stated η ensures

Λ_a(t)≥m on |t|≤η, uniformly for 1/4≤a≤1/2.                  (3)

These positive constants contain no unknown target pivot or zero-location hypothesis.

## 3. A full-theta exponential bound without a finite orbit approximation

Choose θ=π/8, τ=2θ=π/4, and define

A_j=Σ_{s=±1}∫|u+siθ|^j |ψ(u+siθ)|e^{|u|/2}du, j=0,1,
C=4A₀A₁.

The complete ψ is analytic on |Im u|<π/4. On the lines Im u=±θ it and its fixed derivatives have superexponential decay at both ends: the positive-end orbit series has Re(e^{2(u±iθ)})>0, and analytic evenness handles the negative end. Thus A_j are finite, explicitly defined full-kernel constants.

Shifting the Fourier contour toward sign(t)θ gives |F(t+ia)|≤A₀e^{−θ|t|} and |F′(t+ia)|≤A₁e^{−θ|t|}, uniformly for |a|≤1/2. Vertical endpoint segments vanish. Consequently

|Λ_a(t)|≤C e^{−τ|t|},  1/4≤a≤1/2.                            (4)

No pointwise sign is asserted in the large-frequency tail.

## 4. Why possible negative zero pairs start beyond R_n

The explicit unconditional zero-free theorem of Mossinghoff, Trudgian and Yang states that ζ(β+iγ)≠0 when |γ|≥2 and

β≥1−1/[5.558691 log|γ|].                                     (5)

For completeness, the campaign's independently established curvature −(logψ)″>17 also excludes all nontrivial zeros with |γ|≤2, without a numerical zero table. For the probability density proportional to ψ(u)e^{−au}, |a|≤1/2, the one-dimensional curvature variance bound gives Var(u)≤1/17. Its mean changes from zero with derivative of magnitude at most 1/17, so E(u²)≤1/17+a²/289. Therefore for |t|≤2,

Re E(e^{itu})≥1−t²E(u²)/2≥1−2/17−1/578>0.

Thus F(t+ia) does not vanish there, covering the entire nontrivial-zero strip at these heights.

Let R≥2 and ε≤1/[6 log(R+3)]. By (5), symmetry and the low-height argument, every Xi zero γ+id with |γ|≤R+1 has |d|<1/2−ε.

For a reflected off-axis zero pair at the same real coordinate γ with imaginary parts ±d, the contribution to −Im(F′/F)(t+ia) is exactly

(a−d)/[(t−γ)²+(a−d)²]+(a+d)/[(t−γ)²+(a+d)²]
=2a[(t−γ)²+a²−d²]/([(t−γ)²+(a−d)²][(t−γ)²+(a+d)²]).          (6)

For |γ|≤R+1 and a≥1/2−ε it is positive because |d|<a. For |γ|>R+1 and |t|≤R it is positive because |t−γ|>1 while |d|<1/2. Critical-line zero terms are individually positive. The paired Hadamard sum converges absolutely in its imaginary part, and there is no zero at the evaluation points. It follows that

Λ_a(t)>0 for |t|≤R and 1/2−ε≤a≤1/2.                          (7)

This does not assert positivity at all real t. Possible negative contributions near sufficiently high off-axis zeros remain in the tail and are paid using (4).

## 5. Polynomial concentration pays the signed tail

The Legendre evaluation inequality on [−η,η] gives, for every polynomial of degree≤n and |t|≥η,

|p(t)|²≤[(n+1)²/(2η)](2|t|/η+1)^{2n} ∫_{−η}^{η}|p(x)|²dx.   (8)

Indeed expand p in orthonormal scaled Legendre polynomials, use Cauchy–Schwarz, |P_j(x)|≤(2|x|+1)^j for |x|≥1, and Σ_{j=0}^n(2j+1)=(n+1)². Since η≤1 and R≥2, 2t/η+1≤Bt for t≥R.

For R≥4n/τ, the function t^{2n}e^{−τt/2} is decreasing on [R,∞), giving

∫_R^∞ (Bt)^{2n}e^{−τt}dt≤(2/τ)(BR)^{2n}e^{−τR}.

Equations (4), (8), and (1) therefore bound the entire absolute tail |t|≥R_n by at most (m/2) times the central polynomial norm. The remaining interval η<|t|≤R_n is nonnegative by (7), while (3) supplies m times the central norm. This proves (2), keeping every possible negative tail term.

Existence of R_n is immediate from exponential decay. Taking R=K(n+1)log(n+2)+O(1) with a sufficiently large fixed K gives the stated O(n log n) upper bound; the imposed R≥4n/τ supplies a linear lower bound, establishing log R_n/log n→1.

## 6. Actual inverse-selected Ward margin in the band

Now positivity of the full degree≤n block follows independently from Sections 2–5, so actual orthogonality and its inverse are legitimate throughout the band. Let l_n be the minimum central L² norm of a monic degree-n polynomial:

l_n=[2η/(2n+1)] [η^n/(2^{−n} binom(2n,n))]².

Equation (2) gives h_n(a)≥(m/2)l_n. Since the actual monic p_{n−1} minimizes its already-positive quadratic form, and using (4),

h_{n−1}(a)≤L_a[t^{2n−2}]≤2C(2n−2)!/τ^{2n−1}.

Hence, uniformly in the band,

h_n(a)/h_{n−1}(a)≥b_n,
b_n=m l_n τ^{2n−1}/[4C(2n−2)!]>0,
E_{n,c}(a)≥(2c b_n−n)h_{n−1}(a).                            (9)

This is a one-sided defect estimate, not an absolute-smallness assertion. It uses no target sign as a premise: the signed-tail argument proves positivity before Cauchy or minimization is used. The bound is deliberately conservative and does not give good matrix conditioning.

## 7. What this does and does not establish

This supplies a degree-dependent analytic entry into critical shifts, leveraging a known unconditional zero-free theorem, exact zero-pair cancellation, and full-theta contour decay. It is not a new zero-free theorem. Constants η,m,C are explicit convergent integrals, not numerically optimized or numerically evaluated in this packet. The band is correspondingly an analytic construction, not a claimed decimal cutoff.

For each fixed a<1/2, the permitted degrees remain bounded by this argument; no all-degree critical-shift positivity or RH follows. All spatial integrals are uncut: no arbitrary H>0 conclusion is inferred. The negative common-scale central density and the prior cyclic-space counterexamples concern different pointwise/test-class assertions and remain valid.

Primary source for (5): Mossinghoff, Trudgian and Yang, “Explicit zero-free regions for the Riemann zeta-function,” Research in Number Theory (2024), Theorem 1.3, https://link.springer.com/article/10.1007/s40993-023-00498-y (also https://arxiv.org/abs/2212.06867). The number 6 in the construction is a deliberate weakening of 5.558691. The curvature and strip analyticity inputs are the previously independently audited complete-theta results, not assumptions of RH.
