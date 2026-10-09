import LeanCert.Analysis.DBN.Threshold
import LeanCert.Analysis.DBN.ForwardPreservation
import LeanCert.Analysis.DBN.HeatRegularity
import RaymondCore.Substitution
import QrhLambda.Checker

/-!
# The objects of Raymond's decreasing-barrier chain, stated for the concrete `H_t`

Everything is about LeanCert's concrete heat-flow integral (Polymath15 normalisation)

  `H t z = ∫_0^∞ e^{t u²} Φ(u) cos(z u) du`        (`LeanCert.Analysis.DBN.H`, `H 0 z = ξ(1/2 + iz/2)/8`)

and its de Bruijn–Newman constant `LeanCert.Analysis.DBN.Lambda = sInf {t | all zeros of H_t are real}`,
with `real_zeros_iff_Lambda_le t : (∀ z, H t z = 0 → z.im = 0) ↔ Lambda ≤ t` (both proved in LeanCert).

Definitions (paper references: D. J. Raymond, *Analytic foundations* (AF) Part I and the main paper,
Zenodo 22867547; internal reviews `formalization/paper/raymond-g0-review-{a,b}-2026-10-08.md`):

* `XPT = 6000000185827`: the head-wall abscissa X of Raymond's plan X1 (PT height; `tmp/s145-1-g1`).
* `S t x h = Re ∂_y log H_t(x + iy)|_{y=h} = Re(i H_t'(x+ih)/H_t(x+ih))`: the probe value. By the
  Hadamard product it equals `Σ_pairs K_h(x − x_j, b_j)` over the zeros `x_j ± i b_j` (real zeros with half
  weight), which is the form used in AF §11.
* `Kpair c d b = (c−b)/(d²+(c−b)²) + (c+b)/(d²+(c+b)²)`: the pair kernel `K_c(d, b)`.
* `selfTerm a v = 2(1+a−v)/((1+a−v)² + 4av)`: the self-pair term `s_r(v)`, `a = r²`
  (`K_h(rh, y) = s_r(y²/h²)/h`).
* `FloorValid i r h ℓ` — (J): the joint floor of a single-pair probe at displacement `rh` on cell `i`.
* `KernelValid r λ ρ` — (K): Raymond's two-point kernel inequality (10.1) at scale `h = 1`.
* `flow q c u = (q + 2/c)e^{−cu} − 2/c`: the barrier solving `β' = −2 − cβ`, `β(0) = q`.
* `TailBelow t b`: every zero of `H_t` with `|Re z| > X` has `Im(z)² < b`.
* `PairRate i Q c`: `c` is a valid single-pair rate at level `Q` on cell `i` (Lemma FB(θ) (C1)–(C2)).
-/

open Complex

namespace QrhLambda

open LeanCert.Analysis.DBN

/-- Head-wall abscissa `X` of Raymond's plan X1 (`tmp/s145-1-g1/code/joint_common.py`). -/
def XPT : ℝ := 6000000185827

/-- Raymond's probe value `S(x, h, t) = Re ∂_y log H_t(x + iy)` at `y = h`. -/
noncomputable def S (t x h : ℝ) : ℝ :=
  (Complex.I * deriv (H t) ((x : ℂ) + (h : ℂ) * Complex.I) / H t ((x : ℂ) + (h : ℂ) * Complex.I)).re

/-- Pair kernel `K_c(d, b)`: contribution of the conjugate pair `x' ± ib` (`d = x − x'`) at height `c`. -/
noncomputable def Kpair (c d b : ℝ) : ℝ :=
  (c - b) / (d ^ 2 + (c - b) ^ 2) + (c + b) / (d ^ 2 + (c + b) ^ 2)

/-- Self-pair term `s_r(v)`, `a = r²`. -/
noncomputable def selfTerm (a v : ℝ) : ℝ := 2 * (1 + a - v) / ((1 + a - v) ^ 2 + 4 * a * v)

/-- **(J) joint floor** (main-paper Theorem 3 / 4′ on the AF §§4–9 one-point rows; route-P floors): on the
closed cell `[i/4000, (i+1)/4000]`, for every `x ≥ X`, the two-point probe average at displacement `rh`,
height `h`, exceeds `ℓ`. -/
def FloorValid (i : ℕ) (r h ell : ℝ) : Prop :=
  ∀ t : ℝ, (i : ℝ) / 4000 ≤ t → t ≤ ((i : ℝ) + 1) / 4000 →
    ∀ x : ℝ, XPT ≤ x → ell < (S t (x + r * h) h + S t (x - r * h) h) / 2

/-- **(K) kernel inequality** AF (10.1), scale `h = 1`: for all real `d`, `0 < y ≤ ρ`, `0 ≤ b ≤ y`
(the singular point `d = 0, b = y` excluded),
`2 K_y(d, b) ≥ λ y [K_1(d + r, b) + K_1(d − r, b)]/2`. -/
def KernelValid (r lam rho : ℝ) : Prop :=
  ∀ d y b : ℝ, 0 < y → y ≤ rho → 0 ≤ b → b ≤ y → (d ≠ 0 ∨ b ≠ y) →
    lam * y * (Kpair 1 (d + r) b + Kpair 1 (d - r) b) / 2 ≤ 2 * Kpair y d b

/-- The barrier flow `β(u) = (q + 2/c)e^{−cu} − 2/c` (exact solution of `β' = −2 − cβ`, `β(0) = q`). -/
noncomputable def flow (q c u : ℝ) : ℝ := (q + 2 / c) * Real.exp (-(c * u)) - 2 / c

/-- Every zero of `H_t` in the tail `|Re z| > X` lies strictly below the level `b`: `Im(z)² < b`. -/
def TailBelow (t b : ℝ) : Prop := ∀ z : ℂ, H t z = 0 → XPT < |z.re| → z.im ^ 2 < b

/-- `c` is a valid single-pair rate at stored level `Q` on cell `i` (Lemma FB(θ) (C1)–(C2), AF (11.1)):
a probe `(r, λ, ρ, h, ℓ, cap)` with valid floor (J) and kernel (K), admissibility `Q ≤ ρ²h²` (E1),
spatial validity `hr < 2`, heights in `[1/2, 5/2]` (E7), a self cap valid on `[0, Q/h²]` (E2), and
`c = (2λ/h)(ℓ − cap/h)` (E3). -/
def PairRate (i : ℕ) (Q c : ℝ) : Prop :=
  ∃ r lam rho h ell cap : ℝ,
    FloorValid i r h ell ∧ KernelValid r lam rho ∧
    0 < r ∧ 0 < lam ∧ 0 < rho ∧ rho < 1 ∧ 1 / 2 ≤ h ∧ h ≤ 5 / 2 ∧ h * r < 2 ∧
    0 ≤ Q ∧ Q ≤ rho ^ 2 * h ^ 2 ∧
    (∀ v : ℝ, 0 ≤ v → v ≤ Q / h ^ 2 → selfTerm (r ^ 2) v ≤ cap) ∧
    c = 2 * lam / h * (ell - cap / h)

/-- terminal level `q_e = 10⁻⁸` (real) -/
noncomputable def qEr : ℝ := 1 / 100000000

/-- substep length `δ = 1/512000` -/
noncomputable def dlt : ℝ := 1 / 512000

end QrhLambda
