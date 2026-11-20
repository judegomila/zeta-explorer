# AUDIT 03 anchor-hankel (independent audit, 2026-11-20)

File audited: `AnchorHankelProved.lean` (375 lines). Auditor did not write the proof.

## 1. Compilation
Command: `cd ~/probe428 && scripts/memcap.sh 14 lake env lean <abs path>/AnchorHankelProved.lean` (single process, Lean v4.28.0, built Mathlib).
Result: exit code 0, no errors, no warnings (no `sorry` warning). About 17 s wall.

## 2. Forbidden constructs and vacuity
- grep for `sorry`, `admit`, `native_decide`, `axiom`, `opaque`, `unsafe`, `implemented_by`, `extern`, `macro`, `syntax`, `notation`, `elab`, `set_option`, `universe`, `instance`, `attribute`, `local`, `decide`: no occurrence (the only hits for related words are `noncomputable section`, `namespace AnchorHankel`, `open`).
- Imports: `import Mathlib` only. One self-contained file.
- Definitions `jetCoeff`, `jetMatrix`, `hankel0`, `hankel1`: byte-identical to the statement file (script comparison); none is trivialised. `PosDef` / `PosSemidef` are Mathlib's `Matrix.PosDef` / `Matrix.PosSemidef`.
- Hypotheses: `jetMatrix_posDef_iff` and `jetMatrix_posSemidef_iff` have no hypotheses (all `μ : ℕ → ℝ`, all `N`). The first-failure theorems assume "K is the first order at which the Hankel matrix is not PD"; these are satisfiable (e.g. `μ = 0`, `K0 = K1 = 1`) and are not a restatement of the conclusion. They force `K0 ≥ 1` (the 0x0 matrix is PD), which the proof derives rather than assumes. `pick_pair_expansion` hypotheses `lam ≠ 0`, `‖x‖^2 < ‖lam‖`, `‖y‖^2 < ‖lam‖` are satisfiable (x = y = 0).
- No universe or instance tricks. Helper lemmas (`form_eq`, `parityEquiv`, `glue`, ...) are ordinary.

## 3. Axioms (`#print axioms`, from my own run)
All seven theorems (`pick_pair_identity`, `pick_pair_expansion`, `jetMatrix_posDef_iff`, `jetMatrix_posSemidef_iff`, `jetMatrix_first_failure`, `jetMatrix_first_failure_H0_only`, `jetMatrix_first_failure_H1_only`): `[propext, Classical.choice, Quot.sound]`. Standard only; no `sorryAx`, no `Lean.ofReduceBool`.

## 4. Faithfulness
Against the original statement file `rh-push-anchor-hankel/RequestProject/Main.lean`: the four definitions and the seven theorem headers are textually identical (script comparison of each declaration up to `:= by`). The only differences are the module docstring and the added helper namespace. The original still contains its 7 `sorry` (unchanged; mtime 05:35, earlier than the proved copy).

Against the lane (`push/stack-antibridge/RESULT.md`, Theorem 4 and rule (4.1); there is no REFEREE.md, the lane is unrefereed):
- `jetCoeff` is the lane's formula `c_{2a,2b} = 2(-1)^{a+b} mu_{a+b}`, `c_{2a+1,2b+1} = 2(-1)^{a+b} mu_{a+b+1}`, `0` for `i+j` odd. Checked.
- `pick_pair_identity`, `pick_pair_expansion`: the one-lambda kernel `(L(x)+L(y))/(x+y)` with `L = 2x/(x^2+lambda)` and its double power series; the coefficients agree with `jetCoeff` for `mu_k = lambda^{-(k+1)}` (checked by hand: exponents `a+b+1` and `a+b+2`).
- `jetMatrix_posDef_iff`: the lane's consequence "J_N > 0 iff H0_{ceil(N/2)} > 0 and H1_{floor(N/2)} > 0", for an arbitrary real sequence. `_posSemidef_iff`: same for >= 0.
- `jetMatrix_first_failure*`: `N* = min(2 K0 - 1, 2 K1)` for the JET matrix ladder.

Verdict: faithful, narrower scope. What the Lean file does NOT state:
1. That `jetCoeff μ` IS the Taylor coefficient array of the kernel. The expansion is proved for one `lambda` with explicit coefficients; the identification with `jetCoeff` is by inspection, and the sum over `lambda` (zeros of xi, convergence, `mu_k = sum lambda^{-k-1}`) is not in the file. Nothing in the file mentions xi or zeta.
2. The lane states a congruence `J_N ~ 2 H0 (+) 2 H1` (hence equality of inertia). The file proves only the PD and PSD equivalences. The helper `form_eq` is the quadratic-form identity behind the congruence, but no inertia/signature statement is formalized.
3. Rule (4.1) in the lane is about node matrices `P_N` for sufficiently clustered nodes. The divided-difference node-to-jet congruence is not formalized; the Lean rule is for jets only.
4. The Stieltjes moment problem / RH equivalence and the continued-fraction consequences are not in the file.

## Problems
None in the proof. Scope limits 1-4 above (all already declared in FAITHFULNESS.md and RESULT.md). The lane result itself remains unrefereed outside the part checked here.
