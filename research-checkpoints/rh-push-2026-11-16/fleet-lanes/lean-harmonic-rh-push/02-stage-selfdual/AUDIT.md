# AUDIT 02 stage-selfdual (independent audit of StageSelfdualProved.lean)

Date: 2026-11-20. The auditor did not write the proof. Nothing committed or pushed. No RH claim; no bound moves.

## Verdict

The file compiles, contains no `sorry`, and the six theorem statements are unchanged from the statement file.
The six theorems are proved. Four of them are conditional on the Lee-Yang circle theorem, which is an explicit
hypothesis (`LeeYangProp K`) and is not proved in this file. Scope: parts (i)-(iii) of Thm. 3 of
`res-sparse-ferromagnet`, without the coefficient relations of (iii) and without (iv)-(vi).

## 1. Compilation (run by the auditor)

Command: `cd ~/probe428 && scripts/memcap.sh 14 lake env lean <path>/StageSelfdualProved.lean`
Result: exit code 0, 0 errors, about 15 s wall time. Five linter warnings, all "unused variable":
`hn` (line 162), `hinj`, `hsymm`, `hnn` (lines 252-253), `hinj` (line 265). No `sorry` warning.

## 2. Forbidden constructs and vacuity

- Word search for `sorry`, `admit`, `native_decide`, `axiom`, `opaque`, `unsafe`, `implemented_by`, `extern`,
  `macro`, `syntax`, `notation`, `elab`, `instance`, `set_option`, `attribute`, `local`, `universe`: no match.
- `diff` of `rh-push-stage-selfdual/RequestProject/Main.lean` against the proved file: the only changes are
  inserted helper declarations (`pairE` and ten lemmas), the six `sorry` bodies replaced by proofs, and six
  `#print axioms` lines at the end. Definitions `stageZ`, `rowSum`, `LeeYangProp`, `stagePoly`, `abscissa`,
  `dirichletStage` and all six theorem statements are unchanged. The statement file is untouched (mtime 05:33).
- Definitions are not trivialised: `stageZ` is the sum over all subsets with the pair-energy weight;
  `dirichletStage` uses the complex power of a natural-number product (positive real base, principal branch).
- `LeeYangProp K` is a hypothesis, not a definition that hides the conclusion. For symmetric `K >= 0` it is the
  classical circle theorem: with `pairE(S) = (1/2) sum_{p in S} r_p - (1/2) cross(S)` one has
  `stageZ K z = sum_S exp(-cross(S)/2) prod_{p in S} (z_p e^{r_p/2})`, the occupation form with edge factors
  `e^{-K_pq/2}` in (0,1]. This matches the lane's proof (activities `zeta_p = e^{kappa_p + r_p/2} p^{-s}`).
  It is not contradictory with the other hypotheses: the sum-rule hypotheses of (iii) are satisfiable, for
  example n = 3, P = (2,3,5), K_01 = log(6/5)/2, K_02 = log(10/3)/2, K_12 = log(15/2)/2 (all positive).
  That `LeeYangProp` holds for this K rests on the classical theorem (file 01), not on anything checked here.
- Hypotheses in the statement that the proofs do not use: `hn : 0 < n`, `hinj` (distinct primes), and in
  `dirichletStage_zero_on_critical_line` also `hsymm` and `hnn`. In that theorem the sign and symmetry of `K`
  act only through `hLY`. These make the theorems no weaker in content; they are not a source of vacuity.
  For n = 1 and n = 2 the hypotheses of (iii) cannot all hold (row sum 0, or equal row sums against distinct
  primes), so (iii) has content from n = 3 on.
- The two identities (`stagePoly_self_dual`, `dirichletStage_functional_equation`) have no Lee-Yang hypothesis
  and no sign condition; they are unconditional.

## 3. Axioms (`#print axioms`, from the auditor's run)

All six main theorems: `[propext, Classical.choice, Quot.sound]` (the three standard axioms; nothing else).

## 4. Faithfulness

Reference: `push/res-sparse-ferromagnet/RESULT.md` section 3.1 (Thm. 3) and `REFEREE.md` section 2.3 (confirmed).

| Lane claim | Lean theorem | Match |
|---|---|---|
| (i) no zero for Re s > max a_p, none for Re s < min a_p | `stagePoly_ne_zero_right`, `_left` | yes, given `LeeYangProp K`; energies are any l_p > 0 (lane: l_p = log p) |
| (ii) a_p = a for all p: zeros on Re s = a | `stagePoly_zero_on_line` | yes, given `LeeYangProp K` |
| (ii) Z(2a - s) = M^(s-a) Z(s) | `stagePoly_self_dual` | yes, unconditional; M^(s-a) written as exp((s-a) sum l_p) |
| (iii) kappa = 0, r_p = log p: zeros on Re s = 1/2 | `dirichletStage_zero_on_critical_line` | yes, given `LeeYangProp K` |
| (iii) Z(1-s) = M^(s-1/2) Z(s) | `dirichletStage_functional_equation` | yes, unconditional |
| (iii) w(n) <= n^(1/2), w(M/n) = w(n) M^(1/2)/n | none | not stated (the second relation is the helper `energy_balance` in another form) |
| (iv) Curie-Weiss member, all depths; (v) twists; (vi) zero count | none | not covered |

- The Lean theorems state the lane's mathematics for (i)-(iii), relative to Lee-Yang. The lane itself labels
  Thm. 3 "PROVED from the Lee-Yang circle theorem (CLASSICAL)", so the conditional form is the same logical
  shape; what is machine-checked is the reduction, not the circle theorem.
- `dirichletStage` sums over subsets S of the index set, not over divisors d of M. With distinct primes these
  are in bijection; the bijection is not formalised.
- Referee's correction is respected: the Curie-Weiss member (kappa != 0) is not an instance of the (iii)
  theorems; it is an instance of `stagePoly_zero_on_line` and `stagePoly_self_dual` with a = 1/2.
- Classification: faithful, narrower scope (conditional on `LeeYangProp`; parts (i)-(iii) only).

## 5. Problems

None that affect correctness. Remaining gaps: Lee-Yang is assumed, not proved; coefficient relations of (iii)
and parts (iv)-(vi) are outside the file; four unused hypotheses could be dropped.
