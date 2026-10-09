import QrhLambda.Defs

/-!
# The unproved inputs, as explicit hypotheses

Nothing here is an `axiom`. The final theorems take these structures as arguments, so every
conclusion is conditional on them (and on the zero-free half-plane, discharged separately by the
openai/math theorem in `QrhLambdaOAI/Main78.lean`).

## `RaymondChainHyps` — the analytic inputs of Raymond's chain used by the run

* `head_wall` (W): AF Part I §§2–3 head localisation (AF §2 head cell `[−X, X] × [−1, 1]`, AF §3 wall,
  Lemma B.3 of review A). It uses PT's verification of RH up to `(X+1)/2` once, at `t = 0`.
* `first_contact` (FC): the first-contact step of AF §11 / main §7 / Lemma FB(θ) step 3 (review B
  §4.3, §8): for `t > 0` the nonreal zeros of `H_t` stay in a fixed compact set (Polymath15 Thm 1.5(i)),
  and Hurwitz's theorem makes the first time at which a tail zero reaches a continuous positive barrier
  attained, with a zero exactly on the barrier and strict separation before it.
* `contact_exclusion` (CE): the per-substep barrier lemma of AF §11, for single-pair options (all
  three F2 substep types: X options = Track-A floors at re-tuned heights with λ<2 kernels; route-3
  P-modes = Theorem MP; catalogue κ-options = r2 structured floors). At a first contact during the
  substep, the zero dynamics (Polymath Prop 3.1(i)), the kernel inequality (K) summed over the other
  zeros, the joint floor (J) and the self-pair cap give `d(Im z)²/dt < −2 − c (Im z)² = β′`
  (AF (11.1)), and a multiple contact zero is excluded by Hermite splitting (Prop 3.1(ii)). Either way the
  contact is impossible. (J) and (K) enter only as premises, through `PairRate`.

## `TableHyps C` — the table values asserted by the run (hypotheses; certification of the sources is mixed)

One hypothesis per table: every floor entry `(cell, r, h, ℓ)` of the run's floor table satisfies (J),
and every kernel row `(r, λ, ρ)` of its kernel table satisfies (K). These are the outputs of the Arb
floor producers / r2 certificates / route-3 tables and of the exact Bernstein kernel certificates.

## The start condition

`StartBound qb`: every zero of `H_t` at `t = 10⁻⁸` has `Im(z)² ≤ qb`. For `qb = 9/16` it follows from
the zero-free half-plane `Re s > 7/8` by the substitution lemma (RaymondCore, proved), see
`QrhLambda.start78_of_zeroFree`.
-/

open Complex

namespace QrhLambda

open LeanCert.Analysis.DBN

/-- time of the strict-entry check, `10⁻⁸` -/
noncomputable def tS : ℝ := 1 / 100000000

/-- The analytic inputs of Raymond's decreasing-barrier chain used by the F2 and Raymond-only runs. -/
structure RaymondChainHyps : Prop where
  /-- (W) AF §§2–3 head localisation: for `0 ≤ t ≤ 41/250`, every zero of `H_t` with `|Re z| ≤ X` is
  real (equivalently, every nonreal zero has `|Re z| > X`). Uses PT's RH verification once, at `t = 0`. -/
  head_wall : ∀ t : ℝ, 0 ≤ t → t ≤ 41 / 250 → ∀ z : ℂ, H t z = 0 → |z.re| ≤ XPT → z.im = 0
  /-- (FC) first contact (AF §11, main §7, Lemma FB(θ) step 3; compactness Polymath15 Thm 1.5(i) for
  `t > 0`, Hurwitz): a continuous positive barrier that starts strictly above the tail zeros and is not
  above them at some later time has a first contact time `s > t₀`, with strict separation on `[t₀, s)`
  and a tail zero exactly on the barrier at `s`. -/
  first_contact : ∀ (t₀ t₁ : ℝ) (β : ℝ → ℝ), 0 < t₀ → t₀ ≤ t₁ → t₁ ≤ 41 / 250 →
    ContinuousOn β (Set.Icc t₀ t₁) → (∀ s ∈ Set.Icc t₀ t₁, 0 < β s) →
    TailBelow t₀ (β t₀) → (∃ s ∈ Set.Icc t₀ t₁, ¬ TailBelow s (β s)) →
    ∃ s ∈ Set.Ioc t₀ t₁, (∀ u ∈ Set.Ico t₀ s, TailBelow u (β u)) ∧
      ∃ z : ℂ, H s z = 0 ∧ XPT < |z.re| ∧ z.im ^ 2 = β s
  /-- (CE) contact exclusion on one substep of cell `i` for a valid single-pair rate `c` at stored level
  `Q ≥ b` (AF §11 (11.1) with (10.1), (J), the self cap; Prop 3.1(i)–(ii)): the barrier
  `β(u) = flow b c (u − t₀)`, kept `≥ q_e`, cannot be touched by a tail zero at a time `s` after
  `t₀` within the cell if the tail zeros were strictly below it on `[t₀, s)`. -/
  contact_exclusion : ∀ (i : ℕ) (t₀ s b Q c : ℝ), 0 < t₀ → t₀ < s → (i : ℝ) / 4000 ≤ t₀ →
    s ≤ ((i : ℝ) + 1) / 4000 → s ≤ 41 / 250 → 0 < b → b ≤ Q → PairRate i Q c → 0 < c →
    qEr ≤ flow b c (s - t₀) → (∀ u ∈ Set.Ico t₀ s, TailBelow u (flow b c (u - t₀))) →
    ∀ z : ℂ, H s z = 0 → XPT < |z.re| → z.im ^ 2 ≠ flow b c (s - t₀)

/-- The table values asserted by a run (hypotheses, not Lean-checked): (J) for every floor entry and (K) for every kernel row. -/
structure TableHyps (C : Cert) : Prop where
  /-- each floor-table entry `(cell, r, h, ℓ)` is a valid joint floor (J) -/
  floors_valid : ∀ f ∈ C.flrs, FloorValid f.cell (f.r : ℝ) (f.h : ℝ) (f.ell : ℝ)
  /-- each kernel row `(r, λ, ρ)` satisfies the kernel inequality (K) -/
  kernels_valid : ∀ k ∈ C.kers, KernelValid (k.r : ℝ) (k.lam : ℝ) (k.rho : ℝ)

/-- start condition at the strict-entry time `t = 10⁻⁸`: every zero has `Im(z)² ≤ qb`. -/
def StartBound (qb : ℝ) : Prop := ∀ z : ℂ, H tS z = 0 → z.im ^ 2 ≤ qb

end QrhLambda
