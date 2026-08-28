# Summary of changes for run 52c330bd-2d93-4216-98b4-7faf07dee156
Formalized `job23_isolation_onset.tex` in Lean 4 / Mathlib, in `RequestProject/Main.lean`. The file builds cleanly with no `sorry` and the results depend only on the standard axioms (`propext`, `Classical.choice`, `Quot.sound`).

**Definitions** (exactly as in the source): the CM-flow velocity field `v x k = -2 ∑_{j≠k} 1/(x k - x j)` (`IsolationOnset.v`), the three-body configuration `{0, g, g+d₁}` (`cfg3`), the symmetric single-shell four-body configuration `{-(g/2+d), -g/2, g/2, g/2+d}` (`cfg4`), the rate function `f`, the quartic `Q`, and `cstar = √(2+√3) - 1`.

**Part I — Lemma R2-T.**
- `R2T_identity`: the exact identity `(ġ d₁ - g ḋ₁)/d₁² = (g-d₁)/d₁² · [2/(g+d₁) + 4(g+d₁)/(d₁g)]`, together with a translation-general version `R2T_identity_general` for any `x₀ < x₁ < x₂`.
- `R2T_bracket_pos` and `R2T_sign_law`: the bracket is strictly positive, and the rate is negative / zero / positive exactly according as `g < d₁`, `g = d₁`, `g > d₁` — so the threshold is exactly `ρ = 1`.
- `R2T_flow_form` (Conditional Corollary 1′): flow existence and regularity are nowhere assumed globally; they enter only as the explicit hypothesis `hsol` (differentiability plus `x' = v(x)` at the point) together with the ordering hypotheses. `R2T_flow_form_neg` derives that `ρ < 1` forces `ρ` to be strictly decreasing there.

**Part II — Lemma R2-T2 / imp-3005.**
- `R2T2_rate`: `(ġ d - g ḋ)/d² = f(g/d)/d²`.
- `f_eq_Q_div`: `f(ρ) = 4Q(ρ)/(ρ(ρ+1)(ρ+2))`; `Q_eq_u_quadratic`: `Q(ρ) = u² - 2u - 2` with `u = ρ² + 2ρ`.
- Theorem 4: `cstar_radical_forms` proves `√(2+√3) = (1+√3)/√2` (hence both radical forms of `c*` agree); `cstar_mem_Ioo` places `c*` in `(0,1)`; `cstar_approx` gives `|c* - 0.93185165| < 10⁻⁷`; `Q_factorization` gives `Q(ρ) = (ρ-c*)(ρ+c*+2)((ρ+1)² - (2-√3))`, from which `Q_cstar_eq_zero`, the sign dichotomies `Q_sign` and `f_sign` (rate negative below `c*`, zero at `c*`, positive above), and the uniqueness statements `Q_unique_root_Ioo` / `f_unique_root_Ioo` on `(0,1)` follow.

Scope was respected as flagged in the source: nothing about a global multi-body constant, the `K=2` quintic, or the numeric-only `K`-shell monotonicity is asserted. The sign dichotomies are proved on all of `(0,∞)`, which subsumes the source's `(0,c*)` / `(c*,1)` claims. The Properties table lists all definitions and theorems, all marked proved.