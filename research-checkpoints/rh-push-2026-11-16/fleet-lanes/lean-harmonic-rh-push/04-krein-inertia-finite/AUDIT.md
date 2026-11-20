# AUDIT: 04 krein-inertia-finite (independent audit of KreinInertiaFiniteProved.lean)

Date: 2026-11-20. Auditor did not write the proof. Nothing committed or pushed.

## Result

- Compiles: YES. Command: `cd ~/probe428 && scripts/memcap.sh 14 lake env lean <file>` (single process, Lean v4.28.0, Mathlib). Exit code 0, 43 s wall. Output: two `unused variable` linter warnings (`ha`, `hma` in `exists_negative_subspace`, line 333), no errors, no `sorry` warning.
- sorry-free: YES. Text search for `sorry`, `admit`, `native_decide`, `axiom`, `opaque`, `unsafe`, `implemented_by`, `extern`, `macro`, `syntax`, `notation`, `elab`, `instance`, `attribute`, `set_option`, `universe`, `decide`, `local`: the only hits are the four `#print axioms` lines.
- Axioms (`#print axioms`, all four theorems): `[propext, Classical.choice, Quot.sound]`. These are the three standard axioms; no `sorryAx`, no `Lean.ofReduceBool`, no user axiom.
- Statement changes: NONE. Scripted comparison with the original `rh-push-krein-inertia-finite/RequestProject/Main.lean`: the header up to the first theorem (imports, `open`, `variable`, `Lfun`, `Kker`, `kform`) and the four theorem statements (text from `theorem <name>` to `:= by`) are string-identical; each name is declared once. Original file mtime 05:35, earlier than the proof file (07:51).
- SHA-256 of the audited file: c053787274ccddac77bdb0efa4d4743034f41cf4e53649bf32cf88c141c1a900

## Vacuity checks

- Definitions are the real ones: `Lfun` is the partial-fraction model, `Kker` the kernel `(L z + conj L w)/(z + conj w)`, `kform` the double sum. None is constant or replaced.
- Hypotheses are satisfiable (example: m = 0, kappa = 1, rho = 1, mr = 1, a = 0) and none restates a conclusion. In the domain `Re z > 0`, `z != rho j`, with `Re rho j > 0`, every denominator in the statements is nonzero, so Lean's `x / 0 = 0` convention is not used.
- `exists_negative_subspace`: `finrank W = kappa` forces `n >= kappa`, and the inequality is strict on every nonzero vector of `W`. For kappa = 0 the statement is trivially true (W = 0), which is the correct content.
- Added declarations (`gform`, `kform_eq_gform`, `sum3`, `gform_decomp`, `pole_coeff_zero`, `poles`, `evv`, `tgt`, `Om`, `Om_infinite`, `Om_ne_pole`, `tgt_mem_span`) are helpers; none is used in a statement of the four main theorems. No instance, universe or notation is introduced.

## What the proof does

- `kernel_identity`: termwise `field_simp`/`ring` after `z + conj w != 0`.
- `gform_decomp`: form = a|S_1|^2 + sum ma_k |S_k|^2 + sum mr_j (U_j conj V_j + V_j conj U_j), with U_j = sum c_i/(z_i - rho_j), V_j = sum c_i/(z_i + conj rho_j). `kform_im_eq_zero` and `form_nonneg_of_constraints` follow (U_j = 0 removes the indefinite part).
- `exists_negative_subspace`: the evaluation vectors (1, 1/(x - p)) over the infinite set Omega span the whole coordinate space at the non-repeated poles (polynomial identity argument, `pole_coeff_zero`), so for each j0 there is a finite combination of point masses with S_1 = 0, S_k = 0, U_j = -delta, V_j = +delta. On the kappa-dimensional image the form equals -2 sum mr_j |t_j|^2 < 0.
- This is a different route from the lane's lower-bound proof (residue functionals, isotropic-subspace lemma, Riemann-sum transfer). The Lean route is direct and does not use the isotropic lemma.

## Faithfulness: FAITHFUL, NARROWER SCOPE

Reference: `push/sq-krein-index/RESULT.md`, Theorem A (kernel). There is no REFEREE.md in that lane (unrefereed).

- Lane claim: for every `F` of class (H) (Hadamard sum over a possibly infinite zero set), the kernel `K` on Omega has exactly kappa negative squares, kappa = number of distinct zeros in `Re > 0`, kappa in {0,1,...,infinity}.
- Lean theorems: the same kernel for a FINITE zero set: `a z`, finitely many axis poles `i gamma_k`, kappa pairs `(rho_j, -conj rho_j)`, real weights. `kernel_identity` is (2.1) for this model. The upper and lower bounds are the two halves of "exactly kappa negative squares".
- Not covered: infinite zero sets (convergence of the Hadamard sum, kappa = infinity), the extended space with residue functionals, Theorems B and C, the index formula. The original FAITHFULNESS.md says the same.
- Points where the Lean statements are slightly more general than the lane's model (no weakening): weights are positive reals, not integers; the gamma_k need not be distinct; `form_nonneg_of_constraints` needs neither `Function.Injective rho` nor `0 < mr j`; in `exists_negative_subspace` the hypotheses `ha`, `hma` are unused (the constructed vectors annihilate those terms). Evenness of F is not imposed; class (H) does not require it.
- The lane's multiplicity remark (a zero of multiplicity m counts once) is represented: the count kappa does not depend on `mr`.

## Remaining remarks (not defects)

1. "Exactly kappa negative squares" is not a single Lean theorem. It follows from the two bounds by a dimension count (a negative definite subspace meets the constraint subspace, of codimension <= kappa, only in 0). That step is not formalized.
2. `kform_im_eq_zero` and the two bounds are stated for point sets indexed by `Fin n` without requiring distinct points; repeated points are allowed and harmless.
3. The lane result remains unrefereed for the infinite case. This file checks the finite core only.
