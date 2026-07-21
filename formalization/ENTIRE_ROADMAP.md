# ENTIRE_ROADMAP — from here to a formalized `Λ ≥ 0`

Honest brick-by-brick map of the entire-function-analysis build in
`formalization/lean-mathlib-probe/` (Lean v4.22.0 + mathlib `git#v4.22.0`).
Reconnaissance was a direct read of the pinned mathlib checkout at
`…/.lake/packages/mathlib/Mathlib/`. Tags:

- **[mathlib-has]** — usable off the shelf.
- **[partial]** — mathlib has the scaffolding/pieces; a real (non-trivial) assembly step remains.
- **[must-build]** — absent; a standard-but-substantial development we would write.
- **[research-open]** — no complete published-and-mechanizable-in-reasonable-time route; a genuine wall.

Sizes are rough Lean-LOC / person-effort for a mathlib-grade proof.

---

## 0. What is already proved (the ground we stand on)

| Object | File | Status |
|---|---|---|
| Polynomial de Bruijn / Pólya–Schur: `heatOp t` preserves real-rootedness | `MathlibBridge.lean` `heat_preserves_LP` | **sorry-free** (transitively certified: it is the only non-axiom input to the axiom-clean `EntireLP.isLaguerrePolya_heat_of_flow`) |
| Order of growth `order f = limsup (log⁺log⁺ M_f(r))/log r`, `order_nonneg`, `order_polynomial_eq_zero`, crux `log⁺log⁺ r / log r → 0` | `EntireOrder.lean` (brick 1) | **sorry-free** |
| `maxModulus_mul_le` (`M_{fg} ≤ M_f·M_g`, continuous `f,g`) and `order_mul_le` (`order(f·g) ≤ max(order f)(order g)`, continuous `f,g`) | `EntireOrder.lean` (brick 2) | **sorry-free**; `#print axioms` = `[propext, Classical.choice, Quot.sound]` (no `sorryAx`) |
| **Cauchy estimates** (brick B2, coefficient half): `norm_iteratedDeriv_le_of_forall_mem_sphere_norm_le` (`‖f^{(n)}(c)‖ ≤ n!·C/Rⁿ` for entire `f`, `‖f‖≤C` on `‖z−c‖=R`), `norm_iteratedDeriv_le_maxModulus` (`≤ n!·M_f(R)/Rⁿ`, ties to brick-B1 `maxModulus`), `norm_taylorCoeff_le_maxModulus` (`‖aₙ‖ ≤ M_f(R)/Rⁿ`) | `EntireCauchy.lean` | **sorry-free**; `#print axioms` = `[propext, Classical.choice, Quot.sound]` (no `sorryAx`) |
| **Order-equivalence sandwich** (brick B2, both workhorses): `maxModulus_le_tsum_coeff` (reverse: `M_f(R) ≤ Σ‖aₙ‖Rⁿ`), `norm_taylorCoeff_mul_pow_le_maxModulus` (forward: `‖aₙ‖Rⁿ ≤ M_f(R)`), `taylorCoeff_maxModulus_sandwich`, `coefficientOrder` def | `EntireOrderEquiv.lean` | **sorry-free**; `#print axioms` = `[propext, Classical.choice, Quot.sound]` (no `sorryAx`) |
| **FWD order inequality `ρ_coeff ≤ ρ_M`** (brick B2): `log_norm_taylorCoeff_le` (quantitative decay `log‖aₙ‖ ≤ R^σ − n·log R`), `coefficientOrder_le_of_maxModulus_growth` (full `R=n^{1/σ}` optimization + `limsup ≤ σ`), `coefficientOrder_le_order` (conditional on the named unwinding `MaxModulusGrowthFromOrder`) | `EntireOrderEquiv.lean` (THIS round) | **sorry-free**; `#print axioms` = `[propext, Classical.choice, Quot.sound]` (no `sorryAx`). Remaining: the EReal→ℝ `order→growth` unwinding (named input) + the entire REV direction (`ρ_M ≤ ρ_coeff`) |
| Laguerre–Pólya class `IsLaguerrePolya` (limit-closure definition), real-on-ℝ inheritance, real-rooted-poly ⇒ LP, the flow **bridge** `isLaguerrePolya_heat_of_flow` | `EntireLP.lean` | **sorry-free**, axiom-clean |
| CONCRETE entire heat flow `heatFlow t f = Σₖ((−t)ᵏ/k!)·f^{(2k)}` (order-≤2 series = `e^{−tD²}`), `iteratedDeriv_toEntire` (complex `Dⁿ` of a polynomial image), and `heatFlow_poly` (`heatFlow = heatOp` on polynomials) | `EntireLP.lean` (brick 3, THIS round) | **sorry-free**; `#print axioms` = `[propext, Classical.choice, Quot.sound]`.  `heatFlow` is now a `def` (was `opaque`); `heatFlow_poly` is now a THEOREM (was an axiom) |
| `heat_preserves_LP_entire` (entire heat flow preserves LP) | `EntireLP.lean` | proved **modulo 1 precise `sorry`** `exists_heatOp_approx_tendsto` (a TRUE statement). `#print axioms` = `[propext, Classical.choice, Quot.sound, sorryAx]`. **The previous `axiom heatFlow_continuous` was FALSE and has been REMOVED** — see brick 4 below. |

So the *combinatorial/algebraic* de Bruijn step is done at both the polynomial and (limit-closure)
entire level. The entire theorem currently rests on exactly two analytic interface axioms, which is
what the rest of this roadmap is about — plus the far larger question of whether any of this reaches
`Λ ≥ 0`.

### `order_mul_le` status (deliverable answer)

Closed **sorry-free** this round. The obstruction flagged in brick 1 was real: `maxModulus` is a
`Real.sSup` that collapses to the junk value `0` when the sphere-sup is unbounded, so
sub-multiplicativity is false for arbitrary functions. Restated with `Continuous f`, `Continuous g`
(a fortiori entire): `Metric.sphere 0 r` is compact (`isCompact_sphere`, `ℂ` is a `ProperSpace`),
`z ↦ ‖f z‖` is `BddAbove` on it (`IsCompact.bddAbove_image`), so `le_ciSup`/`ciSup_le` give
`M_{fg} ≤ M_f·M_g`. Two applications of `Real.posLog_mul` + monotonicity of `log⁺` (`monotoneOn_posLog`),
`a+b ≤ 2·max a b`, and `max_div_div_right` give the eventual real bound
`ratio_{fg}(r) ≤ log⁺2/log r + max(ratio_f r, ratio_g r)`; then in `EReal`,
`EReal.limsup_add_le` (with `limsup(log⁺2/log r)=0`) + `Filter.limsup_max` finish it.
Both `maxModulus_mul_le` and `order_mul_le` print axioms `[propext, Classical.choice, Quot.sound]`.

---

## 1. The Nevanlinna folder: what it actually gives us

`Mathlib/Analysis/Complex/ValueDistribution/` (Kebekus, 2025) is **[partial]** — definitions, almost
no deep theorems:

- `ProximityFunction.lean` — `proximity f a : ℝ → ℝ` = `circleAverage (log⁺‖f·‖) 0` (this is `m(r)`).
- `CountingFunction.lean` — `logCounting f a : ℝ → ℝ` (this is `N(r)`), built combinatorially from
  meromorphic **divisors** (`Analysis/Meromorphic/Divisor`), not from contour integrals.
- `CharacteristicFunction.lean` — `characteristic f a := proximity f a + logCounting f a` (Nevanlinna `T(r)`).
- `FirstMainTheorem.lean` — only the **easy** half:
  `abs_characteristic_sub_characteristic_shift_le` and its `=O[atTop] 1` corollary. The main
  (Jensen-powered) equality is an explicit TODO.

**Single most useful thing the Nevanlinna folder gives us (deliverable answer):** a ready-made,
already-assembled `T(r) = m(r) + N(r)` for meromorphic functions on ℂ, built on `circleAverage` and
`Real.posLog` — i.e. the *definitional scaffolding* for an order-via-`T(r)` theory, together with the
adjacent near-Jensen lemma `circleAverage_log_norm_sub_const₁`
(`Analysis/SpecialFunctions/Integrals/PosLogEqCircleAverage.lean`,
`circleAverage (log‖·-a‖) 0 1 = 0` for `‖a‖=1`), which its own docstring flags as "a major step"
toward Jensen. That is genuinely helpful *scaffolding*.

**But it does NOT shortcut our critical path.** The two theorems we would actually need from a
value-distribution theory — **Jensen's formula** and **order defined via `T(r)` with `ρ_T = ρ_M`** —
are both **absent** (`grep -i jensen` across all of Mathlib finds only Jensen's *inequality* for convex
functions; there is no `orderOfGrowth` anywhere). Our own max-modulus `order` (brick 1) already sidesteps
`T(r)` entirely and needs no meromorphic hypotheses, so for the LP/de-Bruijn line the Nevanlinna folder is
a nice-to-have, not a load-bearing dependency.

---

## 2. Brick-by-brick: toward the Laguerre–Pólya class on ℂ → ℂ

The LP class is the closure (under locally-uniform limits) of real-rooted real polynomials, and equals
`c·zᵐ·e^{−αz²+βz}·∏(1−z/aₖ)e^{z/aₖ}` (α ≥ 0, aₖ,β real, Σ aₖ⁻² < ∞). Reaching the *structural*
Hadamard/Laguerre–Pólya characterization (needed to identify Ξ, Gaussian flows, etc.) requires:

| # | Brick | Tag | Size | Nevanlinna helps? |
|---|---|---|---|---|
| B1 | Order of growth of an entire `f` via `M_f(r)` (`order`, `order_mul_le`, `order 0`) | **done** (`EntireOrder.lean`) | — | replaces it |
| B2 | Order via a Taylor/coefficient bound `ρ = limsup n log n / log(1/‖aₙ‖)`; equivalence with B1 (Cauchy estimates) | **[partial]** — sandwich workhorses + `coefficientOrder` def **DONE sorry-free**, and the **FWD inequality `ρ_coeff ≤ ρ_M` now CLOSED sorry-free** (`coefficientOrder_le_of_maxModulus_growth` proves the full `R=n^{1/σ}` optimization + `limsup`; `coefficientOrder_le_order` is a `sorryAx`-free conditional) modulo ONE named EReal→ℝ unwinding `MaxModulusGrowthFromOrder`. Still **[must-build]**: that unwinding + the whole **REV** direction (`ρ_M ≤ ρ_coeff`, needs the `Σn^{−n/σ}Rⁿ ≤ exp(cR^σ)` tail estimate) | ~120 left | no |
| B3 | Exponent of convergence of zeros; genus; `Σ|aₖ|^{−(ρ+ε)} < ∞` | **[must-build]** | ~500 | partially (divisors give the zero multiset) |
| B4 | Jensen's formula `(1/2π)∫log‖f(re^{iθ})‖dθ = log‖f(0)‖ + Σ log(r/‖aₖ‖)` | **[must-build]** | ~600 | **yes, most** — `circleAverage` + `circleAverage_log_norm_sub_const₁` + FMT scaffolding are the raw materials; still a real proof |
| B5 | Weierstrass elementary factors `E_p`, convergence of canonical products with prescribed zeros | **[partial]** | ~700 | no (uses `MultipliableUniformlyOn`, `differentiableOn_tsum` — see §3) |
| B6 | **Hadamard factorization** for entire `f` of finite order (`f = z^m e^{g} ∏ E_p(z/aₖ)`, `deg g ≤ ρ`) | **[must-build]** | ~1200 | indirectly (Jensen B4 + counting) |
| B7 | Argument principle / Rouché / **holomorphic Hurwitz** (limit of zero-free ⇒ zero-free or ≡0) | **[must-build]** | ~900 | no (needs contour-integral zero counting; Nevanlinna's `N(r)` is divisor-based, not integral-based — `CauchyIntegral.lean` has only the vanishing theorems) |
| B8 | Laguerre–Pólya structure theorem: LP ⟺ order ≤ 2, genus ≤ 1, real coeffs, only real zeros ⟺ the product form; closure under loc-unif limits | **[must-build]** | ~1500 | no |

Note: `EntireLP.lean` *defines* LP as the limit-closure and gets the de-Bruijn bridge **without** B6–B8
(no Hurwitz needed — real-rootedness of approximants is the finite `heat_preserves_LP`). B6–B8 are only
needed the moment we must **identify** a concrete function (Ξ, or a Gaussian-flowed function) as LP, or
convert between the product form and the limit form.

---

## 3. Discharging the two `heatFlow` axioms (the current honest gap)

**Architecture change (THIS round, brick 3).**  The former plan built `heatFlow` as the *forward*
Gaussian convolution `f ∗ G_t`.  That is the **wrong sign**: `f ∗ G_t` realises `e^{+tD²}`, which
DESTROYS real-rootedness (`X²−1 ↦ X²+(2t−1)`, a conjugate pair for `t > 1/2`).  The operator we need
is the *anti-diffusive* `e^{−tD²}` (matching the sign-verified polynomial `heatOp`).  We therefore
switched the construction to de Bruijn's **order-≤2 power-series representation**

    `heatFlow t f (z) = Σₖ ((−t)ᵏ/k!)·f^{(2k)}(z)`   (realised as an `∑'` over `k : ℕ`),

which is exactly `e^{−tD²}` and needs no ℂ-Gaussian-convolution toolkit at all.  `heatFlow` is now a
CONCRETE `noncomputable def` in `EntireLP.lean` (was `opaque`), and `H4`/`heatFlow_poly` is DISCHARGED
**sorry-free** (on polynomial images the series is finite — high derivatives vanish — so `tsum_eq_sum`
collapses it to the finite `heatOp` sum, no analytic input).  This retires H1–H4 (the whole
Gaussian-integral track) and leaves exactly **one** analytic gap, H5 = `heatFlow_continuous`.

| # | Brick | Tag | Size | Notes |
|---|---|---|---|---|
| H1–H3 | ~~Complex Gaussian integrability / entire-convolution / differentiation under ∫~~ | **RETIRED** | — | superseded by the order-≤2 series construction (no ℂ-convolution needed) |
| H4 | `heatFlow_poly`: `e^{−tD²}p = heatOp t p` on polynomials | **DONE (sorry-free)** | done | `EntireLP.heatFlow_poly` — via `iteratedDeriv_toEntire` (complex `Dⁿ` of a polynomial image = `toEntire (D^n p)`, `Polynomial.deriv_aeval` iterated) + `tsum_eq_sum` (finite support) + `map_sum`/`map_smul`.  `#print axioms` = `[propext, Classical.choice, Quot.sound]` |
| H5 | ~~`heatFlow_continuous`: loc-unif continuity of the order-≤2 series~~ | **FALSE — DISPROVED (machine-checked)** | — | brick 4.  The statement is FALSE even for entire `F` (see below); it is NOT a missing lemma.  The B2 "uniform summable majorant" that H5 rested on **does not exist** — the counterexample is its disproof.  **Now BANKED sorry-free** as `EntireLP.not_heatFlow_continuous` in `HeatFlowCounterexample.lean`; `#print axioms` = `[propext, Classical.choice, Quot.sound]`. |
| B2′ | Weierstrass loc-unif convergence of *iterated* derivatives (`iteratedDeriv_tendstoLocallyUniformlyOn`) | **DONE (sorry-free)** | done | `EntireOrder.lean` — iterate mathlib `TendstoLocallyUniformlyOn.deriv`.  A correct, reusable ingredient the eventual (type-controlled) proof will need.  NECESSARY but NOT SUFFICIENT for H5. |
| H5′ | `exists_heatOp_approx_tendsto`: for `f ∈ LP`, a *type-controlled* real-rooted sequence `Pₙ → f` with `heatOp t Pₙ → heatFlow t f` loc-unif | **[must-build]** | ~big | the corrected, TRUE remaining gap (one precise `sorry`).  Needs genuine Hadamard/LP order-and-type control (B2–B8), NOT a uniform majorant.  A *generic* `f`-approximating sequence provably fails. |

**Status (brick 4 — corrected):** the previous round's `axiom heatFlow_continuous` — the claim that
`heatFlow t` is continuous for locally-uniform convergence of arbitrary sequences — **is FALSE**, so
the previous "one named axiom away" milestone was resting on a false premise.

*Counterexample* (`t = 1`): `F n (z) = (n!/(2n)!)·z^{2n}` are real-rooted real polynomials with
`F n → 0` locally uniformly (the double factorial beats `R^{2n}`), yet
`heatFlow 1 (F n)(0) = (-1)ⁿ ↛ 0 = heatFlow 1 0 (0)`
(by `heatFlow_poly`, only the `k = n` term `((-1)ⁿ/n!)·D^{2n}(·)` survives at `0`, giving
`(n!/(2n)!)·((-1)ⁿ/n!)·(2n)! = (-1)ⁿ`).  Loc-unif convergence of entire functions gives NO control
on the infinite sum of high-order derivatives, so no uniform tail majorant (B2) can exist.

*This impossibility is now MACHINE-CHECKED* (`formalization/lean-mathlib-probe/HeatFlowCounterexample.lean`):
`not_heatFlow_continuous : ¬ ∀ (t : ℝ) {f : ℕ → ℂ → ℂ} {g : ℂ → ℂ}, TendstoLocallyUniformly f g atTop →
TendstoLocallyUniformly (fun n => heatFlow t (f n)) (heatFlow t g) atTop`, proved sorry-free from the two
computational lemmas `toEntire_F_tendsto_zero` (loc-unif → 0) and `heatFlow_F_at_zero` (value `(-1)ⁿ`).
`#print axioms not_heatFlow_continuous` = `[propext, Classical.choice, Quot.sound]` (NO `sorryAx`).

*Corrected architecture (`EntireLP.lean`):* the false axiom is removed.  The sorry-free bridge
`isLaguerrePolya_heat_of_flow` is a correct *conditional* theorem but cannot be instantiated at
`Φ = heatFlow t` (that operator is not loc-unif continuous).  `heat_preserves_LP_entire` is now proved
sorry-free FROM a single TRUE `sorry`, `exists_heatOp_approx_tendsto` (H5′): for `f ∈ LP` there is a
*specifically chosen*, type-controlled real-rooted approximating sequence whose heat images converge
to `heatFlow t f`.  `#print axioms heat_preserves_LP_entire` = `[propext, Classical.choice, Quot.sound,
sorryAx]` (one `sorryAx`, for a true statement — strictly more honest than the former false axiom).

**Revised distance to the milestone.**  The fully sorry-and-axiom-free `heat_preserves_LP_entire` is
NOT ~2 bricks away via H5/B2; the naive route is dead.  The remaining gap H5′ requires the
type-controlled approximation (real Hadamard/LP structure, bricks B2–B8), i.e. the milestone is
substantially further than the previous round claimed.

---

## 4. From "heat flow preserves LP" to `Λ ≥ 0`

This is where honesty matters most. `heat_preserves_LP_entire` is the **forward** de Bruijn direction:
LP is preserved as `t` increases (real zeros stay real; the flow smooths). The de Bruijn–Newman
constant `Λ` is defined so that `H_t` (the backward-heat evolution of the Riemann `Ξ`) has only real
zeros **iff** `t ≥ Λ`; RH ⟺ `Λ ≤ 0`.

| # | Brick | Tag | Size | Notes |
|---|---|---|---|---|
| L1 | Define `Ξ` and its Hadamard/`Γ_ℝ` factorization | **[partial→must-build]** | ~1500 | `Complex.Gammaℝ`, `1/Γ` entire, reflection formula **[mathlib-has]** (`Gamma/Deligne.lean`, `Gamma/Beta.lean`), but the Weierstrass product of `Γ` and the full `Ξ` factorization are **absent** — needs B5/B6 |
| L2 | Define `H_t` = de Bruijn flow of `Ξ` and prove `H_0 = Ξ` | **[must-build]** | ~600 | uses H1–H5 |
| L3 | **de Bruijn monotonicity**: `H_{t}` real-rooted ⇒ `H_{t'}` real-rooted for `t' > t` (⇒ `Λ ≤ 1/2`, `Λ` well-defined) | **[must-build]** | ~800 | this is what §3's LP-preservation *is*, specialized to `Ξ`; reachable once H1–H5 + L1–L2 land |
| L4 | **`Λ ≥ 0` (Newman's conjecture; Rodgers–Tao 2018)** | **[research-open]** | 🧱 huge | see below |

**`Λ ≥ 0` is the genuine wall.** It is *not* a corollary of monotonicity or LP-preservation — those
only bound `Λ` from above and show it is well-defined. `Λ ≥ 0` (Newman: "if RH is true it is barely so")
was open from 1976 until Rodgers–Tao (2018), whose proof is a delicate dynamical/variational argument on
the zeros of `H_t`: an a-priori control of the evolution showing the zeros cannot *all* be real for
`t < 0` (roughly, near-real zeros would force an untenably-low variational energy / a Hamiltonian-flow
rigidity). None of its machinery — the backward-uniqueness estimates, the zero-gap/energy functionals,
the fine asymptotics of the `H_t` zero counting — exists in mathlib, and mechanizing that paper is a
multi-year research-formalization project in its own right (comparable in scale to a PFR- or FLT-tier
effort). There is no short route.

---

## 5. Bottom line (blunt total-effort estimate)

- **Total distinct bricks to a fully sorry-and-axiom-free `heat_preserves_LP_entire`** (the reachable
  milestone): **the previous "~2 bricks (B2 → H5)" estimate was WRONG** — brick 4 (THIS round) found
  that `heatFlow_continuous` is FALSE (see §3 counterexample), so the naive loc-unif-continuity route
  is dead and the "uniform summable majorant" B2 it needed provably does not exist.  What remains is
  the *type-controlled* approximation H5′ (`exists_heatOp_approx_tendsto`): choosing, for `f ∈ LP`, a
  real-rooted approximating sequence with uniform order/type control whose heat images converge to
  `heatFlow t f`.  That genuinely needs the Hadamard/Laguerre–Pólya structure theory (bricks B2–B8) —
  **months, not weeks** — so the milestone is materially further off than the prior round claimed.
  What DID land this round, sorry-free: `iteratedDeriv_tendstoLocallyUniformlyOn` (Weierstrass
  convergence of all iterated derivatives, `EntireOrder.lean`), a correct reusable ingredient; and the
  removal of the false axiom in favour of one precise TRUE `sorry`.

- **Bricks to the *structural* LP / Hadamard theory** (B2–B8, needed to identify Ξ and general
  Gaussian-flowed functions as LP): **~7 further bricks / ~7k LOC / several months**. The true internal
  walls here are **B6 (Hadamard factorization)** and **B7 (holomorphic Hurwitz / argument principle)** —
  both entirely absent from mathlib and each a substantial standalone development. The Nevanlinna folder
  helps most with **B4 (Jensen)** and not much elsewhere.

- **`Λ ≥ 0` itself: research-open for formalization.** Everything above (monotonicity `Λ ≤ 1/2`, the
  well-definedness of `Λ`, LP-preservation) is reachable and would be a major formalization result. But
  `Λ ≥ 0` requires mechanizing Rodgers–Tao 2018, whose dynamical-zeros argument has *no* mathlib
  foundation and is a multi-year project. **This build reaches de Bruijn's classical upper structure and
  the entire de Bruijn step; it does not, on its own, reach `Λ ≥ 0`.**

Recommended next brick (CORRECTED — the old "B2 → H5" plan is dead, `heatFlow_continuous` is FALSE):
now that the **Cauchy-estimate majorant `‖aₙ‖ ≤ M_f(R)/Rⁿ` is banked sorry-free** (`EntireCauchy.lean`,
THIS round), the reachable next steps are the two remaining halves of the *structure* theory that do
NOT route through the impossible uniform majorant:
- **B2 completion** — the order/coefficient equivalence `ρ_M = ρ_coeff = limsup n·log n / log(1/‖aₙ‖)`.
  Upper bound `ρ_coeff ≤ ρ_M` is now within reach (optimize `R` in the banked Cauchy estimate); the
  reverse `ρ_M ≤ ρ_coeff` needs a max-modulus-from-coefficients bound (`M_f(R) ≤ Σ‖aₙ‖Rⁿ`) plus the
  `log log`-asymptotics.  This is the natural next sorry-free target (~250 LOC).
- **B3 (exponent of convergence of zeros)** consumes the Cauchy coefficient bound directly.
The order-≤2-series continuity route to `heat_preserves_LP_entire` remains dead (see brick 4); the
Cauchy estimate is a load-bearing ingredient for the B2–B8 *structure* line and for L1's Ξ
factorization, NOT for the retired H5 interchange.
