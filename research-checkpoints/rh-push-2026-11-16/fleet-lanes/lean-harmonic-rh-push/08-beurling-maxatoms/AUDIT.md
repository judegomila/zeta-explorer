# AUDIT: 08 beurling-maxatoms (independent audit, 2026-11-20)

Audited file: `BeurlingMaxAtomsProved.lean` (186 lines). The auditor did not write the proof.
Claimed outcome: proved, no statement change. **Audit result: confirmed.**

SHA-256 at audit time:

```
4cc3203e5c0212a6258b2852dca96d5fa5993992c828629d6ee51c515ebceca4  BeurlingMaxAtomsProved.lean
bb90515571b816787323cf7fdcf48385be4e032c9f75ec1ed095f471b2cecf87  rh-push-beurling-maxatoms/RequestProject/Main.lean
eb7dba877b1e2aa54505c8d89e6bba5fda1e6d83ad7619575fcd55b6df26bb0b  AuditNonVacuity.lean
```

## 1. Compilation

Command (single process, Lean v4.28.0, project ~/probe428, nothing built or modified there):

`cd ~/probe428 && scripts/memcap.sh 14 lake env lean <path>/BeurlingMaxAtomsProved.lean`

Exit code 0. No errors, no warnings (no `declaration uses 'sorry'`). Wall time about 12 s. Output, complete:

```
'posDef_norm_le' depends on axioms: [propext, Classical.choice, Quot.sound]
'posDef_max_set_subgroup' depends on axioms: [propext, Classical.choice, Quot.sound]
'beurling_core' depends on axioms: [propext, Classical.choice, Quot.sound]
```

## 2. Forbidden constructs and vacuity

- Text search for `sorry`, `admit`, `native_decide`, `axiom`, `opaque`, `unsafe`, `implemented_by`, `extern`, `macro`, `notation`, `instance`, `attribute`, `set_option`, `universe`, `local`: no occurrence except the three `#print axioms` lines. Only import: `Mathlib`. Only `open` lines: `Finset BigOperators`, `scoped ComplexConjugate`, `Classical in` (the last one is in the original statement too, for the `if ... then ... else`).
- Axioms: the three standard ones only (`propext`, `Classical.choice`, `Quot.sound`). No `sorryAx`, no `Lean.ofReduceBool`.
- Definitions: the only definition used in the statements is `IsPosDefFn`, unchanged (real part >= 0 and imaginary part = 0 of the finite quadratic forms sum c_i conj(c_j) phi(x_i - x_j), all n). It is the Bochner definition, not a trivial predicate. The added definition `maxSubgroup` has carrier `{t | phi t = phi 0}` and is used only as the witness of the existential; the equality in `posDef_max_set_subgroup` is by `rfl` on that carrier, with the three closure fields proved from positive-definiteness (not trivially).
- No hypothesis restates a conclusion. In `beurling_core` the conclusion (m = m(0) 1_{cZ}) is not among the hypotheses.
- Hypotheses of `beurling_core` are jointly satisfiable. Machine-checked by the auditor in `AuditNonVacuity.lean` (same directory, compiles with exit code 0, axioms `propext, Classical.choice, Quot.sound`): for m = indicator of Z, theorem `hyps_consistent` proves `IsPosDefFn (fun t => (m t : C))`, `0 < m 0`, `forall t, m t = 0 or m 0 <= m t`, the local finiteness hypothesis for every R, and the existence of a nonzero atom. So the theorem is not vacuous. `IsPosDefFn` is also satisfiable for the first two theorems (same witness).
- No universe or instance tricks: all objects are concrete (`R`, `C`, `Fin n`, `AddSubgroup R`).

## 3. Statement comparison with the original

Original: `rh-push-beurling-maxatoms/RequestProject/Main.lean` (mtime 05:38, before the proof file; the directory is untracked in git, so "untouched" is checked by mtime and by the statement-typecheck log of 05:42 only).

Programmatic comparison of the text from the keyword to `:=`: `IsPosDefFn` (whole definition), `posDef_norm_le`, `posDef_max_set_subgroup`, `beurling_core` are character-identical in the two files. The diff consists of: the module docstring (shortened), four helper lemmas and one helper definition (`posDef_two`, `posDef_zero`, `posDef_neg`, `posDef_three_real`, `posDef_add`, `maxSubgroup`), the three proof bodies, and the three `#print axioms` lines. `noncomputable section` and the `open` lines are the same, so the statements elaborate in the same context.

## 4. Proof content (read, not only compiled)

- A1: 2x2 form at points (t, 0) with coefficients (-conj(phi t), |phi t|), after phi(-t) = conj(phi t) from the coefficient pairs (1,1) and (1,i). Standard.
- A2-A3: 3x3 form at (s+t, t, 0) with coefficients (1, -2, 1) gives Re phi(s+t) >= phi(0) when phi(s) = phi(t) = phi(0); with A1 this gives phi(s+t) = phi(0). This is the matrix form of the lane's inequality 1 - cos(a+b) <= 2(1 - cos a) + 2(1 - cos b).
- A4: support = maximal set (A1 + hmass); 0 isolated in it (hloc at R = 1); Mathlib `AddSubgroup.cyclic_of_isolated_zero`; generator nonzero by hnontriv; c = |b|.

## 5. Faithfulness to the lane (n1-beurling-rigidity, RESULT.md section 2.2, REFEREE.md section 1)

Lane claim, Theorem A: a positive, purely atomic, tempered measure mu on R with mu^ = mu, mu({0}) = kappa > 0 and all atoms >= kappa equals kappa * sum_k delta_k. Proof steps S1-S3 (set-up), A1-A4.

What the Lean theorems state:

- `posDef_norm_le`: |phi(t)| <= phi(0) and phi(0) real, for every positive-definite phi : R -> C. This is A1 in abstract form (the lane has it for phi(t) = mu({t}) through the means M_R).
- `posDef_max_set_subgroup`: {t : phi(t) = phi(0)} is an additive subgroup of R. This is A2-A3 in abstract form.
- `beurling_core`: real positive-definite m with m(0) > 0, every nonzero value >= m(0), locally finite support, some nonzero atom off 0 => m = m(0) 1_{cZ} for some c > 0. This is A4 up to and including "S = cZ, mu = kappa III_{cZ}".

Verdict: **faithful, narrower scope.** The file states the A1-A4 core correctly and in slightly greater generality (any positive-definite function, complex values in A1-A3). It does not state Theorem A. Not in Lean:

1. S1-S3: functional equation => mu^ = mu => the atom-mass function t -> mu({t}) is positive definite (Bohr coefficient formula). In Lean this is the hypothesis `h : IsPosDefFn ...`. Nothing in the file connects a measure, a Fourier transform or a Dirichlet series to `IsPosDefFn`.
2. The last line of A4: c = 1 (transform of kappa III_{cZ} is (kappa/c) III_{Z/c}). `beurling_core` gives some c > 0 only; it is true as stated for every c (indicator of cZ is positive definite), so c = 1 cannot follow from these hypotheses.
3. The lane derives "S not {0}" from mu^ = mu (kappa delta_0 has transform kappa dx). In Lean it is the hypothesis `hnontriv`.
4. Local finiteness is derived in the lane from mu being Radon with atoms of mass kappa; in Lean it is the hypothesis `hloc`.
5. Corollary A, Theorem B (relative to Meyer's theorem), Lemma T: not formalized.

This matches the scope note in `FAITHFULNESS.md` and row 08 of the directory `RESULT.md` ("S1-S3 and the step c = 1 not included").

## 6. Remaining points

- The machine check covers the algebraic core that the referee had already confirmed by hand. It adds no information on novelty (referee: unverified, likely an elementary corollary of standard facts) and none on zeros of zeta.
- "Original untouched" cannot be confirmed by git (untracked directory); it rests on mtimes.
- `BeurlingMaxAtomsProved.compile.log` (written by the prover) agrees with the auditor's own compile output.
