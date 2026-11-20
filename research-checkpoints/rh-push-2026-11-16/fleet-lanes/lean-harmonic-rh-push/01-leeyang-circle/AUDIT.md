# Audit of 01 leeyang-circle: LeeYangCircleProved.lean

Date: 2026-11-20. Independent audit; the auditor did not write the proof. Nothing committed or pushed.

File audited: `LeeYangCircleProved.lean`, sha1 3f1689e913022fe7b12ddd4ff9e04df4caa69aa9. Original statement file: `rh-push-leeyang-circle/RequestProject/Main.lean` (sha1 51472e896b555d28079954dbeaac8aebe28b0676, untracked, timestamp 05:33, earlier than the proof file).

## Verdict

Compiles, no sorry, standard axioms only, statement unchanged, faithful to the lane's input. No problem found.

## 1. Compilation

Command: `cd ~/probe428 && scripts/memcap.sh 14 lake env lean <file>` (single process, Lean v4.28.0, built Mathlib).
Result: exit code 0, no errors, no warnings, about 15 s wall time. Output:

    'lee_yang_inside' depends on axioms: [propext, Classical.choice, Quot.sound]
    'lee_yang_outside' depends on axioms: [propext, Classical.choice, Quot.sound]

## 2. Search for escapes

Word-level grep of the file for: sorry, admit, native_decide, axiom, opaque, unsafe, implemented_by, extern, macro, notation, syntax, elab, instance, attribute, set_option, csimp, decide, universe, private, local. No hit. Only import: `import Mathlib`.

Vacuity checks:
- `stageZ` and `rowSum` each defined once, text-identical to the original (script comparison). They are the sum over all subsets and the off-diagonal row sum, not constants.
- Hypotheses of both theorems are those of the original: K symmetric, K >= 0, and the modulus condition. They are satisfiable (K = 0, z = 0 for inside; K = 0, z = 2 for outside; n = 0 gives Z = 1), and none restates the conclusion.
- The helper namespace `LeeYang` (opened before the main theorems) defines `contr, two_site, edge2, ev, LY, zz, mon, edge_step, LY_one, wt, LY_wt, wt_compl, ev_inv`. None of these names occurs in the two theorem statements, so opening the namespace cannot change their meaning. No name from Mathlib used in the statements (`Real.exp`, norm, `Fin`, `Finset`) is shadowed.
- `LY c` quantifies over all z in the open unit polydisc; `LY_wt` is proved for every finite edge set, by induction from `LY_one` (product of (1 + z_p)).

## 3. Axioms

Both main theorems: propext, Classical.choice, Quot.sound. No sorryAx, no Lean.ofReduceBool (no native_decide), no user axiom.

## 4. Faithfulness

Statement against the original file: the definitions `stageZ`, `rowSum` and the full statements of `lee_yang_inside` and `lee_yang_outside` (from `theorem` to `:= by`) are character-identical. Claimed statement changes: none; confirmed.

Statement against the lane (`push/res-sparse-ferromagnet/RESULT.md` section 3.1, proof of Thm. 3(i); `REFEREE.md` section 2.3 and line 88): the lane uses "Lee-Yang: Z does not vanish when all |zeta_p| < 1 or all |zeta_p| > 1", with zeta_p = e^{kappa_p + r_p/2} p^-s, r_p = sum_{q != p} K_pq, K symmetric, K >= 0. The referee specifies that the form needed is the multivariate one with unequal complex activities. The Lean theorems state exactly this for arbitrary complex activities z_p (z_p stands for e^{kappa_p} p^-s), any n, any symmetric nonnegative K on Fin n. Diagonal entries of K are ignored by both `stageZ` (p < q only) and `rowSum` (q != p), as in the lane.

So: the Lean theorems state the mathematics the lane cites as CLASSICAL, in full generality for depth-1 (occupation 0/1) pair models. Not narrower than what Thm. 3(i) uses.

What is not covered by this file (by design of statement 01, not a defect of the proof):
- Thm. 3 itself (zero-free half-planes of the Dirichlet polynomial, zeros on Re s = a, self-duality, sum rule): that is statement 02.
- The mixed case (some |zeta_p| <= 1, some >= 1) and the closed-polydisc boundary: not claimed by the lane either.
- Higher depth N_p > 1 (spin-S sites), which the lane proves only for the Curie-Weiss member by a different route.

## 5. Proof route (read, and checked by the kernel)

Asano contraction: `contr` (if alpha + beta x + gamma u + delta x u has no zero in the bidisc then alpha + delta t has none in the disc; proof through the two roots of the diagonal quadratic), `two_site` (1 + a u + a v + u v, |a| <= 1), `edge2`/`edge_step` (multiplying the cut coefficients of one edge by a in [-1,1] keeps the no-zero property), `LY_wt` (induction over edges), `key` and `stageZ_eq_ev` (occupation form = Lee-Yang form with a_pq = exp(-K_pq/2) and activities e^{r_p/2} z_p; uses symmetry of K), `ev_inv` (complement symmetry gives the outside case from the inside case). This is the standard proof; no step is assumed.

## 6. Notes

- The existing `LeeYangCircleProved.compile.log` agrees with this run.
- `~/probe428` was not modified; no build was run; no files created other than this one.
