# b-lean-eq48: Lean 4 / Mathlib formalization of the algebraic core of eq48 Theorem 2

Date: 2026-11-16. Scope: machine-check of `tmp/research-2026-11-16/eq48/RESULT.md` Theorem 2
(Pick matrix, Schur complement, positive-definiteness induction, with the referee's prefix-PD
requirement), plus the finite algebra of Theorem 1 and the RH => (b) leg of Theorem 3.
Nothing here proves or refutes RH. No PR, branch or other directory was modified.

## Verdict

**Partial result (formal verification).** Theorem 2 of eq48 is machine-checked. For Mathlib's
Riemann xi function the equivalence (a) <=> (b) is a Lean theorem with no hypotheses
(`Eq48.xi_theorem2`). Theorem 3 (equivalence with RH) is machine-checked only as a logical
assembly with two analytic legs entering as named hypotheses (PR #50 Prop. 5; Hadamard pairing).
The work gives no information on the location of zeros.

Build: 7 files, 1612 lines, 0 errors, 0 warnings, no `sorry`, no `axiom`. `#print axioms` for
all 29 audited theorems returns `[propext, Classical.choice, Quot.sound]` (log: `build.log`).

## Plan: what is new relative to the atlas and the walls

This is a formalization avenue, not a route to RH; it re-runs no route closed by the atlas
(PR #27) or by the fifty-routes synthesis (routes 39-41 are the earlier Lean items: Yoshida
reduction, WOL fragments, Arb replay; none covers the Pick/Schur equivalence).

New relative to `eq48/RESULT.md` + `REFEREE.md`:

1. PROVED (Lean). Lemma B (genericity) has a different, one-variable proof: add one node at a
   time, use `det P_{T+y} = det P_T * Delta_T(y)`, show `Delta_T(y) > 0` for large `y`, apply the
   one-variable identity theorem. It needs only: `L` analytic on `(a, inf)`, `L >= c > 0` near
   infinity, `L(y)/y -> 0`. No Gershgorin step, no several-variable analyticity, no monotonicity
   of `L` (the slip the referee corrected does not arise).
2. PROVED (Lean). Lemma A in that asymptotic form for the actual xi: `Lxi(y) >= 1` eventually and
   `Lxi(y)/y -> 0`, from log-convexity of real Gamma (`log(u-1) <= psi(u) <= log u`) and
   `|zeta'/zeta(s)| <= sum Lambda(n) n^-2` for `Re s >= 2`.
3. PROVED (Lean). The referee's GAP in (a') => (b_I) is a logical gap already for a positive
   polynomial `L`: `literal_a'_gap` exhibits `L(x) = x + (x-1)(x-2)/2`, nodes `1,2,3,...`, where
   the literal (a') holds at every order and the third prefix Pick matrix is not PSD.
4. PROVED (Lean). The referee's "prefix-PD" hypothesis is the same statement as "all Schur
   defects along the sequence are strictly positive" (`prefix_posDef_iff_strict_defects`).

Walls: the development is parametric in `L` (or uses only right-half-plane facts about xi), so it
is Euler-blind by construction; see the DH control below.

## Files (all under `tmp/research-2026-11-16/push/b-lean-eq48/`)

| File | Content |
|---|---|
| `Eq48Pick.lean` | Pick matrix, Schur step, Theorem 2 (a) <=> (b) with named hypotheses, (a') induction |
| `Eq48Hadamard.lean` | Pick pair formula, finite form of eq. (1.7), on-line zeros => PSD, limit passage |
| `Eq48Generic.lean` | Lemma B from one-variable hypotheses; `3 x 3` skeleton counterexample |
| `Eq48Controls.lean` | hypothesis satisfiability, off-line toy, the (a') gap counterexample |
| `Eq48Xi.lean` | `xi`, `Lxi` from Mathlib's `completedRiemannZeta`; analyticity on `(1/2, inf)` |
| `Eq48LemmaA.lean` | Lemma A asymptotics for `Lxi`; `xi_theorem2` (no hypotheses) |
| `Eq48Audit.lean` | Theorem 3 skeleton; `#print axioms` for every main theorem |
| `build.sh`, `one.sh`, `build.log` | build scripts and the last full build output |

Toolchain: `formalization/lean-mathlib-probe` (Lean v4.22.0, Mathlib tag v4.22.0, already built).
Nothing was upgraded or modified there. `formalization/lean` itself is Lean 4.9 core-only (no
Mathlib), so the Mathlib sandbox of the repo is the one used. The files are compiled with
`lean --root=<slug dir>` and `LEAN_PATH` = probe path + `build/`; run `sh build.sh` (about 5 min
under load). They are not registered as `lean_lib` targets in the probe lakefile.

## Definitions (Lean)

- `pick L x i j = (L (x i) + L (x j)) / (x i + x j)`, any index type.
- `border L t y i = (L (t i) + L y) / (t i + y)`; `defect L t y = L y / y - p . (P_t^-1 p)`.
- `Nodes D x`: all `x i` in `D`, `x` injective.
- `ResidualTarget L D` = (a): for all `n`, node tuples `t : Fin n -> R` with `P_t` PD and new
  `y in D`, `y` not in `t`: `0 <= defect L t y`. The case `n = 0` is included and reads
  `0 <= L y / y`.
- `ResidualTargetPos L D`: the same for `n >= 1` only.
- `FullClass L D` = (b): every Pick matrix at admissible nodes is PSD.
- `GenericNonsingular L D`: Lemma B as a statement.
- `HadamardOnLine L D gamma`: `L(x) = lim_N sum_{k<N} 2x/(x^2 + gamma_k^2)` on `D`, real `gamma_k`.
- `xi s = s (s-1)/2 * completedRiemannZeta s`, `Lxi x = Re (logDeriv xi (1/2 + x))`.

## Theorems (all PROVED in Lean; hypotheses listed)

Schur core, any `L`, any finite index type:

- `pick_extend`: block form of `P_{T+y}`.
- `pick_extend_posSemidef_iff`: `P_T` PD => (`P_{T+y}` PSD <=> `0 <= Delta_T(y)`).
- `pick_extend_posDef_iff`: `P_T` PD => (`P_{T+y}` PD <=> `0 < Delta_T(y)`).
- `det_pick_extend`: `det P_T` unit => `det P_{T+y} = det P_T * Delta_T(y)`.
- `residual_form_eq_defect`: with `b = (-P_T^-1 p, 1)`, `b^T P_{T+y} b = Delta_T(y)` (§6 of eq48).

Theorem 2, (a) <=> (b):

- `residualTarget_of_fullClass`: (b) => (a). No hypotheses.
- `fullClass_of_residualTarget`, `residualTarget_iff_fullClass`. Hypotheses: `D` open, `D` inside
  `(0, inf)`, `L` continuous on `D`, `GenericNonsingular L D`.
- `genericNonsingular_of_analytic`: Lemma B. Hypotheses (H-AN) `L` analytic on `(a, inf)`,
  `a >= 0`; (H-LOW) `L >= c > 0` eventually; (H-GROW) `L(y)/y -> 0`.
- `residualTarget_iff_fullClass_of_analytic`: (a) <=> (b) from (H-AN), (H-LOW), (H-GROW) only.
- `Lxi_analyticOnNhd`, `xiLow`, `xiGrow`: the three hypotheses hold for xi. No hypotheses.
- **`xi_theorem2 : ResidualTarget Lxi (Ioi (1/2)) <-> FullClass Lxi (Ioi (1/2))`. No hypotheses.**
- `xi_theorem2_pos`: the same with `ResidualTargetPos` (nonempty `T` only). Hypothesis:
  `Lxi >= 0` on `(1/2, inf)` (Lemma A positivity; CLASSICAL via Hadamard; not formalized).

Theorem 2, (a') with the referee's requirement:

- `prefix_posDef_of_strict_defects`: the positive-definiteness induction.
- `prefix_posDef_iff_strict_defects`: all prefixes PD <=> all defects `> 0`. No hypotheses.
- `bI_of_prefix_posSemidef` (referee fix 1, generalized-Schur reading), `bI_of_prefix_posDef`
  (fix 2), `bI_of_strict_defects`: conclusion (b_I) for every finite tuple in
  `closure (range x)` inside `D`. Hypotheses: `D` open inside `(0, inf)`, `L` continuous on `D`.
- `xi_bI_of_prefix_posDef`: the same for xi; the only hypothesis is prefix-PD.

Theorem 1 / Theorem 3 pieces:

- `pair_identity`, `pair_identity'`: the Pick pair formula.
- `finite_zero_sum_identity`: eq. (1.7) for a FINITE family of zeros, complex coefficients, real
  nodes. `finite_zero_sum_on_line`: if all `Re rho_k = 0` the sum is `sum (|V(rho)|^2 + |V(-rho)|^2)`.
- `fullClass_of_hadamardOnLine`: `HadamardOnLine` => (b). `complex_form_nonneg`: real PSD => the
  Hermitian form on complex coefficients is a nonnegative real.
- `residualTarget_iff_RH`, `xi_residualTarget_iff_RH` (with Mathlib's `RiemannHypothesis`):
  (a) <=> RH. Hypotheses, NOT formalized: `hProp5 : not RH -> not FullClass` (PR #50 Prop. 5),
  `hHadamard : RH -> exists gamma, HadamardOnLine` (Hadamard product for xi).

Controls:

- `hypotheses_satisfiable`: (H-AN), (H-LOW), (H-GROW) hold for `L = 1`.
- `M3_skeleton_counterexample`: `[[1,1,1],[1,1,-1],[1,-1,1]]` is not PSD while every `2 x 2`
  principal submatrix is PSD and singular. The bare Schur induction therefore needs a genericity
  input for abstract symmetric matrices. (`M3` has a negative entry; it is not a Pick matrix of a
  positive `L`.)
- `literal_a'_gap`: see item 3 above.

## What is NOT formalized (labels)

- Theorem 1 in full: the infinite zero sum, the explicit-formula identity (16), `E_gamma`, the
  compensated count `M`. CLASSICAL / refereed in eq48, not in Lean. So the Lean (a) is the
  Pick-side statement `Delta_T(y) >= 0`, not eq. (21) of PR #48 literally.
- PR #50 Prop. 5 ((b_I) => RH). Refereed in eq48, hypothesis here.
- Hadamard pairing of `xi'/xi`, and `Lxi > 0` on `(1/2, inf)`. CLASSICAL, hypotheses here.
- Weil and Suzuki legs, Theorem 4. Not touched.
- RH: OPEN.

## DH control

Every theorem before `Eq48Xi` holds for an arbitrary function `L`. For a Davenport-Heilbronn type
function, with `L_DH` its logarithmic derivative and nodes to the right of its zeros, (H-AN),
(H-LOW), (H-GROW) are right-half-plane facts of the same kind (not checked in Lean for DH), so the same Lean theorem gives
(a_DH) <=> (b_DH); both sides are then false because DH has off-line zeros. The formalized content
passes the control in the required sense: it proves an equivalence, not a positivity.
`offLine_pair_not_residualTarget` is the machine-checked toy version: for
`L(x) = 2x/(x^2 - beta^2)` (a real off-axis pair) every 2-node Pick determinant is negative and
(a) fails at order 2.

Where the xi instantiation uses arithmetic: only `riemannZeta_ne_zero_of_one_lt_re` and the
absolutely convergent series `-zeta'/zeta = sum Lambda(n) n^-s` on `Re s >= 2`. Both are
statements in the region of absolute convergence; no step uses `Lambda(n) >= 0` or
multiplicativity in a way that constrains zeros. The step that would need the Euler product is
the unformalized target itself ((a), equivalently (b)), which is RH.

## Three weakest steps

1. **Faithfulness of the Lean statement (a) to PR #48 eq. (21).** `ResidualTarget` is
   `Delta_T(y) >= 0` on the Pick side and includes the empty node set. The identification with
   eq. (21) is Theorem 1, which is not formalized. For the nonempty-`T` reading the theorem
   `xi_theorem2_pos` needs the unformalized hypothesis `Lxi >= 0`. A reader who wants "eq. (21)
   <=> all Pick matrices PSD" in Lean still needs Theorem 1.
2. **Theorem 3 is an assembly, not a proof.** `xi_residualTarget_iff_RH` takes Prop. 5 and the
   Hadamard pairing as hypotheses. If either hypothesis were misstated relative to the paper
   statement (for example multiplicity conventions in `HadamardOnLine`, or the node domain in
   `hProp5`), the Lean theorem would still type-check and would say less than intended.
3. **Build packaging.** The files compile by a script against the probe's Mathlib olean path and
   are not lake targets; there is no CI. `defect` uses Mathlib's `Matrix.inv` (value 0 on singular
   matrices), so `defect` is meaningful only under the nonsingularity hypotheses the theorems
   carry; `ResidualTarget` quantifies only over PD `P_T`, where it is the true Schur complement.

Also noted: `literal_a'_gap` is for a polynomial `L`, not for xi. Whether a Schur defect of xi can
vanish exactly is not decided here (under RH it cannot).

## Next step

Formalize Theorem 1 for xi (Hadamard pairing of `xi'/xi` in Mathlib, then `Lxi > 0` and the
infinite form of (1.7)); this removes `hHadamard` and the `Lxi >= 0` hypothesis. Prop. 5 is the
remaining leg and is finite algebra (Lagrange interpolation on a quartet) plus one tail bound.
