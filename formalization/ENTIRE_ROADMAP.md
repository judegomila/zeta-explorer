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
| `maxModulus_mul_le` (`M_{fg} ≤ M_f·M_g`, continuous `f,g`) and `order_mul_le` (`order(f·g) ≤ max(order f)(order g)`, continuous `f,g`) | `EntireOrder.lean` (brick 2, THIS round) | **sorry-free**; `#print axioms` = `[propext, Classical.choice, Quot.sound]` (no `sorryAx`) |
| Laguerre–Pólya class `IsLaguerrePolya` (limit-closure definition), real-on-ℝ inheritance, real-rooted-poly ⇒ LP, the flow **bridge** `isLaguerrePolya_heat_of_flow` | `EntireLP.lean` | **sorry-free**, axiom-clean |
| `heat_preserves_LP_entire` (entire heat flow preserves LP) | `EntireLP.lean` | proved **modulo 2 named axioms** `heatFlow_poly`, `heatFlow_continuous` (+ `opaque heatFlow`) |

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
| B2 | Order via a Taylor/coefficient bound `ρ = limsup n log n / log(1/‖aₙ‖)`; equivalence with B1 (Cauchy estimates) | **[must-build]** | ~400 | no |
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

`heatFlow_poly` and `heatFlow_continuous` are the *only* non-standard axioms behind
`heat_preserves_LP_entire`. Discharging them = constructing the entire Gaussian/Weierstrass transform
`heatFlow t f = (f ∗ G_t)`, `G_t(s) = (4πt)^{−1/2}e^{−s²/4t}`, and proving its two interface facts.

| # | Brick | Tag | Size | Notes |
|---|---|---|---|---|
| H1 | Complex Gaussian integrability toolkit on ℂ | **[partial]** | ~300 | `Analysis/SpecialFunctions/Gaussian/*` covers ℝ (GaussianIntegral, FourierTransform, PoissonSummation); no ℂ-convolution operator |
| H2 | Convergence of `∫ f(z−s) e^{−s²/4t} ds` for entire `f` of order ≤ 2 (needs B1–B2 growth control) | **[must-build]** | ~700 | this is *why* the order theory (B1/B2) is a genuine prerequisite, not decoration |
| H3 | `heatFlow t` is entire in `z` (differentiation under the integral) | **[must-build]** | ~400 | mathlib has `hasDerivAt_integral_of_dominated_*`; assembly |
| H4 | `heatFlow_poly`: `e^{−tD²}p = (2√πt)⁻¹∫p(z−s)e^{−s²/4t}ds` = `heatOp t p` (de Bruijn 1950 §1) | **[must-build]** | ~500 | Gaussian moments vs. the finite `heatOp` power series; H2 + Hermite/Gaussian moments (`RingTheory/Polynomial/Hermite/Gaussian.lean` helps) |
| H5 | `heatFlow_continuous`: loc-unif continuity (dominated convergence on the same integral) | **[must-build]** | ~500 | H2 + `TendstoLocallyUniformly` dominated-convergence |

Discharging H1–H5 turns `heat_preserves_LP_entire` fully sorry-and-axiom-free. **This is the reachable
milestone**: hard analysis, but every brick is standard and mechanizable. Estimate: the H-bricks depend
on B1–B2 (have B1) and are otherwise self-contained; ~2–3k LOC, a multi-week-to-few-month effort.

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
  milestone): **~5 bricks** (H1–H5, B1 already done, B2 needed as a growth-control input) —
  roughly **2–3k LOC / weeks-to-months**. This is *hard analysis but not research-open*, and it is the
  right next target: it removes the last two axioms and delivers a genuinely-constructed entire heat flow.

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

Recommended next brick: **B2 + H2** (order-via-coefficients and the order-≤2 Gaussian-convolution
convergence) — the smallest addition that starts converting the two `heatFlow` axioms into theorems, and
the honest way to keep the "no false QED" invariant while making real progress.
