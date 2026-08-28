# Aristotle waves 2–3 delivery (2026-08-28)

Nine projects delivered (tenth, `ramanujan_reversal`, follows after its local
kernel verification completes). Verification record, per project: `lake build`
green (v4.28.0); zero `sorry`/`axiom`/`native_decide`; every theorem's
`#print axioms` = `[propext, Classical.choice, Quot.sound]`; independent
faithfulness review: **8× FAITHFUL, 1× MINOR DRIFT** (burgers_heat_identity —
see below). Verbatim signatures for app quoting are in each directory's
`ARISTOTLE_SUMMARY.md`.

| Directory | Ledger | Verdict / headline |
|---|---|---|
| `newton_inequality/` | #1 | `newton_inequality` — statement **character-for-character identical** to the sorried target at `lean-mathlib-probe/HeatCorollaries.lean:191`, so it can drop in and erase that sorry (namespace aside). The two preservation theorems were re-proved, not assumed. |
| `crossover_sign_induction/` | #5 | `P_coeff_pos` (all-orders positivity, every n ≥ 2), `P_coeff_leading` = (n−1)!, `P_coeff_const` = (2n−3)‼; the P₃..P₆ literals machine-checked. Unconditional. |
| `theta_trap/` | #2 | `theoremA`: sharp Θ ≤ 1/4 flow invariant under explicit `IsCMFlow`; `ThetaDot_le` is the source's exact proof-chain inequality; sharpness witnessed by a proven symmetric-triplet flow; `corollaryA1` (tc ≤ g²/6), `corollaryE1`. No Θ* < 1 claim. |
| `heat_discriminant_ode/` | #3 | `hasDerivAt_log_disc_flow_S` (the −8Σ1/(xᵢ−xⱼ)² law, both G/S forms), `strictAntiOn_disc` (generalized to convex domains — strictly stronger), collision-time corollary under flagged hypotheses; two-particle exact solution discharges everything. |
| `burgers_heat_identity/` | #4 | `burgers_identity` with the source convention **M = −P′/P** (the +P′/P ticket error is absent); `taylor_representation` + `heatOp(−s)` bridge. **MINOR DRIFT (disclosed in-file):** `IsHeatFlow` demands the heat equation globally in `s`, not on an interval ∋ 0 — theorems do not apply to interval-only flows as stated. |
| `gilbreath_package/` | #14 | All nine items A1–R plus a lock certificate; `A3_prime_leading_odd` fully **unconditional** (Nat.nth Prime machinery); B′ gained the necessary `1 ≤ W` (the drafted B′ was false at W = 0; documented — WL needs and has no such hypothesis). |
| `r1fn_sharp_cap/` | #6 | `Theta_le_one_sub_two_div_N` (sharp), exact `Thetamax N`, attainment by the balanced arithmetic progression, and the full forcing/equality characterization — nothing dropped. |
| `isolation_onset/` | #9 | Exact R2-T identity, sign trichotomy, flow form with pointwise `hsol` (weaker hypothesis ⇒ stronger theorem), `f = 4Q/(ρ(ρ+1)(ρ+2))`, and `cstar = √(2+√3)−1` with both radical forms proved equal, uniqueness, and the full sign dichotomy for all ρ > 0. Scope limits honored (no global constant, K-shells excluded). |
| `maxmodulus_growth/` | #13 | `maxModulusGrowthFromOrder` for **every** `f : ℂ → ℂ` — target `def` byte-identical to `EntireOrderEquiv.lean:185` (strict `<`, no ε; ledger's paraphrase was wrong, source won); unconditional `coefficientOrder_le_order` corollary (note: name collides with the banked conditional theorem — rename before dropping in beside it). |

Assumed-input checklist across the waves: `IsCMFlow`/flow existence
(theta_trap, isolation_onset — explicit, with exact solutions witnessing
satisfiability); global-in-`s` heat flow (burgers_heat_identity); everything
else unconditional. Every hypothesis package has an in-file or explicit
witness; none is vacuous.
