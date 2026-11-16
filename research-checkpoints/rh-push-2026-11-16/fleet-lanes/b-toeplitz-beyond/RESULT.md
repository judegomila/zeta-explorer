# b-toeplitz-beyond: the Weil-positivity ladder with the 7/8 half-plane as input

Date 2026-11-16. Internal working note, not refereed. Nothing here proves RH, moves a Λ bound or
gives a new zero-free region. Labels: PROVED / CLASSICAL / MEASURED / MODEL / OPEN.

## Verdict

**Precise obstruction, with three partial results.**

1. (PROVED, elementary) The single-pair detection threshold has a closed form. For an off-line pair
   at displacement δ in a uniform on-line background of density log(H/2π)/2π, the extremal test on
   L²(−a,a) gives the threshold `sinh(2aδ)/δ − 2a = log(H/2π)`. The RES-T packet (2a = 7.764 at
   X = 3·10¹², δ = 1/2) is not extremal; the extremal value in the same model is **2a = 7.051**.
   With the half-plane (δ₀ = 3/8) it is **2a = 8.767** (8.769 at δ₀ = 0.374887). The 7/8 input moves
   the crossover *outward*: more of the ladder is already implied, not less.
2. (PROVED from the 7/8 theorem + classical tools) Phase diagram of the damped form
   `W_θ(g) = W((g*g̃)·e^{−θ|u|})`, whose prime side uses the weights Λ(n)·n^{−1/2−θ}:
   for θ > Θ := sup Re ρ − 1/2 it is positive on **every** support with a support-independent gap;
   for θ < Θ it is unbounded below as the support grows. There is no intermediate regime. Hence a
   certificate valid on an unbounded family of supports at damping θ is **equivalent** to the
   zero-free half-plane Re s > 1/2 + θ. At θ ≥ 3/8 it exists (it is the openai theorem); at θ = 0
   it is RH; any bounded family is a finite computation.
3. (MEASURED, float Ritz from the prime side only) The damped form has minimum
   ≈ 2·ξ′/ξ(1/2+θ) ≈ 0.0925·θ at every support tested (2a ≤ 11, n ≤ 59874), against
   10^{−4.8·e^{2a}} at θ = 0. The Davenport–Heilbronn twin diverges to −∞ in the same table, at the
   rate of its off-line zero at 0.8085 + 85.70i.

Where the ladder would start to carry zero information (2a ≈ 8.8 at θ = 0) the margin is
≈ 10^{−30900} and the floor height is ≈ 10^{38}; damping repairs the margin but pushes the
crossover and the floor height further out (§5). No route to news by this ladder.

## 0. What is new relative to the atlas and the walls

| item | prior record | here |
|---|---|---|
| crossover 2a = 7.764 | RES-T (imp-95533), one fixed Fejér packet; memory note calls W_T ≥ 0 "implied by verified height" below it | extremal packet in the same model: 7.051; with δ₀ = 3/8: 8.767; real-zero scan and a gap model show the number is background-dependent (§2) |
| Route 11 | pole-free positivity to ln 5, margins 10^{−4.8e^{2a}} | unchanged; placed on the θ = 0 edge of a two-parameter diagram |
| atlas §9 "missing signed all-support lower bound" | open | restated: any all-support lower bound at damping θ, even −C‖g‖², is the half-plane 1/2 + θ (Thm 2) |
| atlas §10 "7/8 boundary" | no positivity form of the half-plane recorded | Thm 1: explicit prime-side inequality for all supports at θ ≥ 3/8 |
| DH wall | Route I positivity Euler-blind to ln 11 | all-support damped positivity is not Euler-blind at any θ ≤ 1/2 (DH has zeros in σ > 1) |

Not re-run: de Branges realisation, Sonine/rank-one fixes, pointwise LP legs, Pick orders (sibling
`pick-induction`). Theorems 1–2 are the classical criterion "Re ξ′/ξ > 0 on Re s > 1/2 + θ"
(Hinkkanen, Lagarias) written as a Weil/Toeplitz form; novelty is not claimed and was not checked
against the literature.

## 1. Setup

g ∈ L²(−a,a) (smooth or piecewise polynomial), h = g*g̃, supp h ⊂ [−2a, 2a], prime powers
n < e^{2a}. ĝ(z) = ∫ g(x) e^{izx} dx, ĥ(z) = ĝ(z)·conj ĝ(z̄). Zeros ρ = 1/2 + β′ + iγ,
z_ρ = γ − iβ′ up to the symmetry β′ ↔ −β′. Explicit formula (CLASSICAL):

    Σ_ρ ĥ(z_ρ) = W(h) := ĥ(i/2) + ĥ(−i/2) − Σ_n Λ(n) n^{−1/2} (h(log n) + h(−log n))
                         + (1/2π) ∫ ĥ(t) (Re ψ(1/4 + it/2) − log π) dt.

Damped form: W_θ(g) := W(h_θ), h_θ(u) = h(u) e^{−θ|u|}. Its prime side is the same expression with
Λ(n) n^{−1/2−θ}, digamma argument 1/4 + θ/2 + it/2, and pole kernel e^{−θ|u|}·2cosh(u/2). It is a
finite prime sum for each a. λ_min(a,θ) := inf W_θ(g)/‖g‖² over g ∈ L²(−a,a). θ = 0 is the Weil
form (full, not pole-free).

## 2. Crossover (question 1)

**Lemma A (PROVED).** The zero-side contribution of a pair z = H ± iδ to W_θ is the quadratic form
with kernel k(x−y) = e^{(δ−θ)|x−y|} + e^{−(δ+θ)|x−y|} on L²(−a,a) (after modulation by e^{iHx}).
For θ = 0 the kernel is 2cosh(δ(x−y)), rank 2, with eigenvalues ⟨u,v⟩ ± ‖u‖‖v‖ for
u = e^{δx}, v = e^{−δx}:

    λ_min = 2a − sinh(2aδ)/δ,   minimiser g ∝ e^{δx}/‖u‖ − e^{−δx}/‖v‖.

For θ < δ the kernel e^{κ|x−y|}, κ = δ − θ, is −2κ times the Green operator of −D² + κ² with
boundary conditions f′(±a) = ±κ f(±a); for κa > 1 its lowest eigenvalue is −2κ/(κ² − ν²) with
tanh(νa) = ν/κ, i.e. ≈ −e^{2κa}/(2κ). For θ ≥ δ the kernel is positive definite.
Numerical check: closed form vs Nyström to 12 digits (`crossover.py`).

**Density model (MODEL).** On-line zeros near H contribute Σ|ĝ(γ)|² ≈ log(H/2π)·‖g‖² (exact for a
lattice when log(H/2π) > 2a, by Poisson summation). Threshold for one pair at displacement δ:

    sinh(2aδ)/δ − 2a = log(H/2π)                                      (θ = 0)

| input | extremal (this note) | RES-T packet |
|---|---|---|
| X = 3·10¹², δ₀ = 1/2 | 2a = 7.051 (n ≤ 1154) | 7.764 (n ≤ 2353) |
| δ₀ = 3/8 | 2a = 8.767 (n ≤ 6420) | 9.651 |
| δ₀ = 0.374887 | 2a = 8.769 | 9.654 |
| X = 10²⁰, δ₀ = 1/2 / 3/8 | 7.908 / 9.876 | |

**The crossover is background-dependent (MEASURED + MODEL).** "W_a ≥ 0 is implied by verified
height below the crossover" is not a theorem: zeros above X are unconstrained inside the strip.
Three checks:

- Real zeros (Odlyzko table, 561 locations at H ≈ 4.9–6.0·10⁵, δ = 3/8, two adjacent on-line zeros
  replaced by a pair at their midpoint; motherbox, `pair_scan.py`): measured threshold / density
  model = 0.895 ± 0.044, range 0.751–1.000, correlation −0.74 with the length of the created gap.
  Six further locations at H = 10⁴ … 5.5·10⁵, δ = 1/2 and 3/8: 0.76–0.96 (`pair_validate.out`).
- Gap model at X = 3·10¹² (uniform background outside a zero-free gap around the pair,
  `hole_model.out`), δ₀ = 3/8: gap of 2 / 3 / 4 mean spacings → 2a = 8.63 / 8.37 / 8.01;
  δ₀ = 1/2: 6.99 / 6.87 / 6.69. A gap of 12.8 spacings (rough ceiling from Trudgian's S(T) bound)
  → 5.06 (δ₀ = 3/8), 4.61 (δ₀ = 1/2).
- A full lattice of off-line pairs is invisible to W_a for every 2a < log(X/2π)/2 ≈ 13.4
  (PROVED by Poisson summation: Σ ĥ(γ_k + iδ) = density·∫ĥ > 0). So positivity at support 2a
  excludes isolated pairs, not regular arrays.

Summary: with the half-plane the crossover is 2a ≈ 8.4–8.8 for a typical background (7.05 → 8.77
in the density model, ratio 1.24), and not below ≈ 5 for any background allowed by the S(T) bound.
Route 11's range (ln 5 = 1.61, ln 11 = 2.40) is inside all of these.

## 3. Phase diagram of the damped form (question 2)

**Theorem 1 (PROVED given the half-plane; CLASSICAL tools).** Let θ > Θ. Then for every a and g,

    W_θ(g) = (1/π) ∫ s_θ(t) |ĝ(t)|² dt,   s_θ(t) = Re ξ′/ξ(1/2 + θ + it)
           = Σ_ρ (θ − β′_ρ)/((θ − β′_ρ)² + (t − γ_ρ)²) > 0,

so W_θ(g) ≥ 2 m_θ ‖g‖² with m_θ = inf_t s_θ(t) > 0, and inf_a λ_min(a,θ) = 2 m_θ.
By the openai theorem Θ ≤ 3/8, so this holds unconditionally for θ > 3/8 (≥ 0 at θ = 3/8).

Proof. e^{−θ|u|} = ∫ P_θ(t) e^{−itu} dt gives ĥ_θ(z) = ∫ P_θ(t) ĥ(z − t) dt for all z; for
|Im z| < θ the contour shifts to ĥ_θ(z) = ∫ P_θ(z − t) ĥ(t) dt (P_θ analytic in |Im| < θ, ĥ
integrable on horizontal lines). With i z_ρ = ρ − 1/2 and s = 1/2 + θ + it,
π P_θ(z_ρ − t) = ½[1/(s − ρ) − 1/((1 − s̄) − ρ)]; summing over ρ with the functional equation
ξ′/ξ(1 − s̄) = −conj ξ′/ξ(s) gives π Σ_ρ P_θ(z_ρ − t) = Re ξ′/ξ(s). Positivity: each term has
θ − β′ > 0. m_θ > 0: s_θ is continuous, positive, and ≥ c·log t for large t (each zero has a mirror
with −β′, giving a term ≥ θ/(4θ² + τ²)). ∎

**Theorem 2 (PROVED, sketch level; standard Bochner–Schwartz argument).** If for some θ ≥ 0 and
C < ∞, W_θ(g) ≥ −C‖g‖² for all g ∈ C_c^∞(ℝ) (all supports), then Θ ≤ θ.

Proof. T(φ) := W(φ e^{−θ|u|}) + Cφ(0) is a positive-definite distribution, hence the Fourier
transform of a positive tempered measure μ. Evaluating on φ(u) = e^{−(w−θ)|u|} (limit of compactly
supported tests, w real and large): 2ξ′/ξ(1/2 + w) + C = ∫ 2(w−θ)/((w−θ)² + t²) dμ(t). The right
side is analytic with positive real part on Re w > θ, so ξ′/ξ(1/2 + w) has no pole there. ∎

**Corollary (dichotomy).** inf over all supports of λ_min(a,θ) is 2m_θ > 0 for θ > Θ and −∞ for
θ < Θ. Θ = inf{θ : the damped forms are uniformly bounded below}. At θ = 0: the Weil form is
bounded below on all supports iff RH (then the infimum is 0).

**Lemma B (PROVED).** λ_min(a,θ) is nonincreasing in a and nondecreasing in θ.
Proof: nesting; and h e^{−(θ+κ)|u|} = ∫ P_κ(τ) (g_τ*g̃_τ)(u) e^{−θ|u|} dτ with g_τ = g·e^{−iτx}, so
W_{θ+κ}(g) = ∫ P_κ(τ) W_θ(g_τ) dτ ≥ λ_min(a,θ)‖g‖². ∎

**Answer to question 2.** The set {(a,θ) : W_θ ≥ 0 on L²(−a,a)} is closed under decreasing a and
increasing θ. It contains the full strip θ ≥ 3/8 (all supports; certificate = the half-plane
theorem through the Poisson formula of Thm 1, not a prime-only construction). A prime-only
certificate on any unbounded family of supports at some θ < 3/8 would be a new zero-free half-plane
(Thm 2, even with an arbitrary negative constant allowed), so it meets the TRO6 obstruction of the
zf-campaign, and at θ = 0 it is RH. Bounded families are finite computations with no content
beyond their supremum.

## 4. Numerics (MEASURED; float64 Legendre–Galerkin, Ritz upper bounds, no certificate)

`galerkin.py` builds W_θ from the prime side only. Check of the normalisation: λ_min(a,θ)
decreases in a to 2ξ′/ξ(1/2+θ) (mpmath) to 3 digits; this also indicates inf_t s_θ is at t = 0.

| e^{2a} | θ = 0 | 0.01 | 0.1 | 0.25 | 0.375 | 0.5 |
|---|---|---|---|---|---|---|
| 3 | 5.5e-8 | 1.0016e-3 | 9.815e-3 | 2.4439e-2 | 3.6598e-2 | 4.8732e-2 |
| 11 | \|·\|<1e-13 | 9.334e-4 | 9.332e-3 | 2.3325e-2 | 3.4980e-2 | 4.6628e-2 |
| 100 | \|·\|<1e-12 | 9.265e-4 | 9.264e-3 | 2.3159e-2 | 3.4733e-2 | 4.6302e-2 |
| 400 | \|·\|<1e-12 | 9.255e-4 | 9.255e-3 | 2.3135e-2 | 3.4698e-2 | 4.6256e-2 |
| limit 2ξ′/ξ(1/2+θ) | 0 | 9.242e-4 | 9.242e-3 | 2.3103e-2 | 3.4650e-2 | — |

(N = 120, frequencies ≲ 40.) Motherbox run with frequencies ≤ 105 (N = 433 … 760, 4 threads; `dh_kernel_check.out` for the damped pair-kernel comparison):

<!--DHTAB-->
| 2a | n ≤ | function | θ=0 | θ=0.05 | θ=0.1 | θ=0.15 | θ=0.2 | θ=0.25 | θ=0.3 | θ=0.35 | θ=0.5 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | 403 | ζ | \|·\|<1e-10 | 0.00463 | 0.00925 | 0.01388 | 0.01851 | 0.02313 | 0.02776 | 0.03239 | 0.04626 |
| | | DH | -3.695 | -2.100 | -0.841 | 0.060 | 0.080 | 0.100 | 0.119 | 0.139 | 0.198 |
| 7 | 1096 | ζ | \|·\|<1e-10 | 0.00463 | 0.00925 | 0.01388 | 0.01850 | 0.02313 | 0.02775 | 0.03237 | 0.04624 |
| | | DH | -6.314 | -3.785 | -1.872 | -0.422 | 0.079 | 0.099 | 0.119 | 0.139 | 0.197 |
| 8 | 2980 | ζ | \|·\|<1e-10 | 0.00462 | 0.00925 | 0.01387 | 0.01850 | 0.02312 | 0.02774 | 0.03237 | 0.04623 |
| | | DH | -10.730 | -6.512 | -3.464 | -1.264 | 0.079 | 0.099 | 0.119 | 0.138 | 0.197 |
| 9 | 8103 | ζ | \|·\|<1e-10 | 0.00462 | 0.00925 | 0.01387 | 0.01849 | 0.02312 | 0.02774 | 0.03236 | 0.04622 |
| | | DH | -16.539 | -10.061 | -5.545 | -2.394 | -0.201 | 0.099 | 0.118 | 0.138 | 0.197 |
| 10 | 22026 | ζ | \|·\|<1e-10 | 0.00462 | 0.00925 | 0.01387 | 0.01849 | 0.02311 | 0.02774 | 0.03236 | 0.04621 |
| | | DH | -24.762 | -14.861 | -8.253 | -3.828 | -0.863 | 0.099 | 0.118 | 0.138 | 0.196 |
| 11 | 59874 | ζ | \|·\|<1e-10 | 0.00462 | 0.00925 | 0.01387 | 0.01849 | 0.02311 | 0.02773 | 0.03235 | 0.04621 |
| | | DH | -37.595 | -21.719 | -11.947 | -5.694 | -1.691 | 0.098 | 0.118 | 0.138 | 0.196 |
<!--/DHTAB-->

The DH column at θ = 0 equals the pair-kernel eigenvalue 2a − sinh(2aδ)/δ (δ = 0.3085) to within 0.6 (on-line
mass and the other DH zeros): predicted −4.06, −6.87, −10.99, −16.93, −25.37, −37.20 at 2a = 6 … 11; measured −3.70,
−6.31, −10.73, −16.54, −24.76, −37.59. At θ = 0 the ζ entries are float zeros of unresolved sign. The DH sign boundary in θ moves up with the support toward 0.3085 (the
visible zero); DH zeros with σ > 1 lie above the resolved frequencies.

## 5. Why the ladder does not reach new information (precise obstruction)

Cost of a prime-only certificate at support 2a and damping θ:

- margin λ_min(a,θ): ≈ 10^{12.1 − 4.82 e^{2a}} at θ = 0 (Route 11 fit); ≈ 0.0925 θ for θ > 0
  (MEASURED, §4);
- floor height T_floor = 2π·exp(λ_R(a,θ)), λ_R = norm of Σ Λ(n) n^{−1/2−θ}(S_{log n} + S*_{log n})
  on L²(−a,a) (aligned phases = torus supremum; `rung_norm.py`). Below T_floor a certificate must
  control the twisted rung operator at every t; above it positivity is trivial.

| point | 2a | margin | λ_R | T_floor |
|---|---|---|---|---|
| Route 11 reach | ln 11 | 5.6e-42 | 2.69 | 10^2.0 |
| crossover, δ₀ = 1/2, θ = 0 | 7.051 | ≈ 10^{−5550} | 37.5 | 10^{17.1} |
| crossover, δ₀ = 3/8, θ = 0 | 8.767 | ≈ 10^{−30900} | 85.4 | 10^{37.9} |
| crossover, δ₀ = 3/8, θ = 0.1 | 11.04 | ≈ 9e-3 | 110.6 | 10^{48.8} |
| crossover, δ₀ = 3/8, θ = 0.2 | 15.3 | ≈ 1.8e-2 | > 67.8 (value at 2a = 12) | > 10^{30} |
| θ = 3/8 | every | ≥ 2 m_θ (Thm 1) | — | none needed |

Damped crossover supports (density model, δ₀ = 3/8, `crossover.out`): θ = 0 / 0.05 / 0.1 / 0.2 /
0.3 / 0.35 → 2a = 8.77 / 9.76 / 11.04 / 15.3 / 27.5 / 56.1, diverging as θ → 3/8.

So: at θ = 0 the news threshold needs a margin of 10^{−30900} and control of a Dirichlet polynomial
of length 6420 at every t up to 10^{38} (heights above X: the pointwise wall). Damping removes the
margin problem completely but the threshold support grows faster than the floor height falls;
T_floor along the crossover curve is minimal at θ = 0. At θ = 3/8 both costs vanish because the
statement is the input. Excluding far-off-line zeros therefore lengthens the already-implied part of
the ladder (7.05 → 8.77) and does not make any news-bearing rung constructible.

## 6. DH control

- Thm 1 fails for DH at every θ ≤ 1/2: DH has zeros with σ > 1, so Θ_DH > 1/2 and by Thm 2 its
  damped forms are unbounded below. The step that uses the Euler product is the zero-free
  half-plane itself: Re s > 1 (Euler product, non-vanishing) for θ = 1/2, the openai theorem (sextic
  large sieve over primes) for θ = 3/8. Nothing else in Thm 1–2 or Lemma A–B uses arithmetic.
- Measured (§4): DH λ_min → −∞ along supports for θ below 0.3085 in the resolved band, while ζ
  stays at 0.0925 θ.
- Finite-support, θ = 0: unchanged from Route 11 / tlb-dh-blind (DH passes to 2a = ln 11, fails by
  2a = 3.44). Finite rungs remain Euler-blind below the twin's first visible off-line zero.
- Flow-blindness: W_θ ≥ 0 for all supports is not stable under backward heat flow (it is a
  half-plane statement); the finite rungs are. MV-CAP: Thm 1 is an every-window statement obtained
  from a half-plane input, not from a mean value.

## 7. Three weakest steps

1. The crossover is a model quantity. The closed form is exact for one pair in a uniform on-line
   background; real-zero tests reach only H ≤ 6·10⁵ (oversampling log(H/2π)/2a ≈ 1.6, against 3.1
   at X) and give 0.75–1.00 of the model. The "12.8 spacings" ceiling uses Trudgian's S(T) bound
   loosely. No statement "verified height + half-plane ⇒ W_a ≥ 0" is proved for any a.
2. Theorem 2 is written at sketch level (Bochner–Schwartz, passage from compactly supported tests
   to e^{−(w−θ)|u|}, explicit formula for the kinked test h_θ). The identification
   2m_θ = 2ξ′/ξ(1/2+θ) (infimum at t = 0) is measured, not proved. Everything at θ ≥ 3/8 depends on
   the openai 7/8 theorem (Lean-checked locally per the brief; not externally refereed here).
3. Numerics are float Ritz values: upper bounds for λ_min on a band-limited trial space
   (frequencies ≤ 105), not certificates. "T_floor is intrinsic" is argued only for certificates
   whose floor is a torus supremum; a certificate using arithmetic of {t log p} is not excluded.

## 8. Files

All under `tmp/research-2026-11-16/push/b-toeplitz-beyond/`:
`crossover.py/.out` (Lemma A, crossover tables), `pair_validate.py/.out`, `pair_scan.py`,
`scan_d375_all.jsonl` (561 real-zero locations, motherbox), `hole_model.py/.out`,
`hole_vs_scan.out`, `galerkin.py`, `galerkin_N120.out`, `dh.py`, `dh.out`, `dh_big.py`,
`dh_big_A.jsonl`, `dh_big_B.jsonl` (motherbox), `rung_norm.py/.out`, `s_theta_min.out` (inf of s_θ on [0,200] is at t = 0), `dh_kernel_check.out`, `mk_table.py`.
Motherbox work dir: `~/rh-push/b-toeplitz-beyond/` (CPU only; GPU not used).

## 9. Next step

Do not extend the θ = 0 ladder. If anything: (a) write Theorem 2 in full and check it against
Hinkkanen/Lagarias; (b) correct the memory/RES-T record (crossover 7.05 extremal, 8.77 with the
half-plane, background-dependent); (c) the only lever on the diagram is lowering Θ, i.e. the
zf-campaign / TRO6 line.
