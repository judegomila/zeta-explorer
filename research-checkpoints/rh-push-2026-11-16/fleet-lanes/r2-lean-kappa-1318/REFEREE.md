# REFEREE: r2-lean-kappa-1318

Date: 2026-11-16. Adversarial check of `RESULT.md` (claimed verdict: partial-result, verification only).
Outcome: the PROVED claims survive, with one coverage miscount in the copy replay (repaired here) and
three wording corrections. No RH assumption, no verified-height restatement, no new zero-free or Lambda claim.

## What was re-run (independent of the author's logs)

All runs through `scripts/memcap.sh 8`, single process, each under 30 s. Scratch files in `/tmp`, deleted.

| check | method | outcome |
|---|---|---|
| Patch touches only proofs/statements of theorems | `diff -rq` original vs clone, each changed line mapped to its enclosing declaration | 42 files, 101 changed lines: 86 in `theorem`, 15 in `lemma`, 0 in `def`/`structure`/`instance`. `CertifiedBand` and `HeckeZeroSupremum.beta` are unchanged |
| No escape hatches added | grep of `+` lines for `sorry`, `axiom`, `native_decide`, `admit`, `unsafe`, `implemented_by`, `set_option` | none |
| Claim (1), new test case | new theorem at `kappa = 7/10` (below 13/18, not an instance the author built), `beta <= 17/20`, elaborated against the clone | accepted; axioms `propext, Classical.choice, Quot.sound` |
| Claim (1), negative control | same at `kappa = 3/5` | rejected (`norm_num` cannot prove `2/3 <= 3/5`), as it must be |
| 7/8 theorems in the clone | `#print axioms` + `#check` of `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`, `OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re` | statements unchanged, three standard axioms |
| Constant arithmetic | by hand from `(6k-1) ell <= M/6`, `6k-1 >= c`: `ell <= M/(6c)`, `2M/3+M/(3c)`, `5M/6+M/(3c)`, reserve `M/6-M/(3c)` | c=7/2: 1/21, 16/21, 13/14, 1/14. c=10/3: 1/20, 23/30, 14/15, 1/15. c=3: 1/18, 7/9, 17/18, 1/18. All match the patch |
| Occurrence count | own regex over the original `DirichletL` tree | 59 lines in 43 files; one is the supplier `3/4 < kappaPlain D` (a conclusion, not a hypothesis). 58 in 42 as hypotheses: confirmed |
| `plain_capacity_bound` has no user | grep by name | only its own file: confirmed |
| Claim (2) | `HeckeSeries.lean` re-elaborated with extra `#print` of `Character`, `idealCoeff`, `LFunction`, `LFunction_differentiableAt`, `dedekindZeta` | no errors; statements as reported; three standard axioms |
| Claim (3), closure | import closure of `OAI.NumberTheory.DirichletL.Nonvanishing` recomputed from source `import` lines | 2924 modules, set-equal to `replay/modules.txt` and to the audit's `closure-bfs.txt` |
| Claim (3), log | recount of `replay.log` | 2990 lines, all `rc=0`; 2924 distinct modules; 10 `batch10` lines; summed 79.7 h: confirmed |
| Claim (3), checker sanity | `leanchecker` on a nonexistent module | exit 1 (a missing module does not report 0) |
| Claim (3), spot replay | `leanchecker` in the clone on `Energy.CertifiedExistence` | exit 0 |
| DBN anchors | `DBNCheck.lean` re-elaborated plus a new instance (`z = 0`) of `H_zero_eq_completedZeta` | no errors; three standard axioms |
| Appendix A constants | grep of `zf-audit-inputs/src-xs/xs-v2` | `23M/30`, `14M/15`, `13/18 <= kappa` present (READ) |

## Errors and gaps found

1. **Copy replay misses one modified module (miscount; repaired).** The reverse-dependency cone of the 42
   changed files is 277 modules (275 inside the closure plus `Hecke/ConditionalNonvanishing`,
   `Hecke/Nonvanishing`), not 276. `replay/modules-copy.txt` omits
   `OAI.NumberTheory.DirichletL.Moments.ReflectionRetainedLength`, the root of the cone and the file that
   contains `positive_slot_width_drop`. `logs/build-23-01.log` shows 275 OAI modules built, not 274. So
   "the 276 modules rebuilt there: 276 of 276 exit 0" is true of the list but the list is not the rebuilt
   set. Repair: I ran `leanchecker` on that module in the clone: exit 0. Corrected statement: 277 of 277.
2. **"The original Lean file used the sharper M/21, 16M/21, 13M/14" is only partly right.** In the original
   (3/4) source, `positive_slot_width_drop` and `balanced_reference_geometry` already conclude `23M/30` and
   `14M/15` (with `ell <= M/21`); only `ReferenceLowBranchGeometry` and `LiveClippingDefect` carry
   `16M/21`, `13M/14`. The class-E row of the table should say so. No effect on the theorems.
3. **DH control, item (ii), wrong reason.** "The DH coefficient sequence is not completely multiplicative" does
   not separate DH from the family: `normCoeff chi` on integers is not completely multiplicative either, and
   the Lean file states no Euler product. A correct control uses the theorem itself: DH is entire and vanishes
   at points with `Re s > 1`, while `ne_zero_of_hasSum_of_seven_eighths_lt_re` gives nonvanishing there for any
   `F` with the series; hence DH satisfies the `hseries` hypothesis for no `chi`. The conclusion of section 6
   stands; the stated reason should be replaced.
4. **Scope of claim (1) must be read with its hypothesis.** `terminal_certificate` still requires
   `2 beta - 1 <= kappa`. The only Lean-proved bound is `beta <= 7/8`, which licenses exactly `kappa >= 3/4`.
   For `2/3 <= kappa < 3/4` the theorem is conditional on `beta <= (1+kappa)/2`, which is not a Lean theorem.
   RESULT section 7 says this; the one-line claim "holds for 2/3 <= kappa" does not. Nothing unconditional
   was gained below 3/4.
5. **Dedekind anchor is on `Re s > 1` only.** Mathlib's `dedekindZeta` is defined as an `LSeries`, so the
   identity cannot be extended; the summary line "equals Mathlib dedekindZeta for modulus (1)" needs the
   qualifier (RESULT section 4 has it).
6. **Process, not mathematics.** The replay ran 7 to 19 concurrent processes for 6 h 18 min on the Mac at
   load 35 to 180. The BRIEF's local limits are single process and under 20 minutes per run; the run predates
   the memcap rule. The result is unaffected; the limits were not followed.
7. **Not re-run by me.** The two full builds (trusted from `Build completed successfully (7061 jobs)` in the
   logs, cross-checked by the `#check` signature read from the clone's oleans and by the kernel replay); the
   remaining 2922 + 275 `leanchecker` exit codes (recounted from logs only); a numeric test of `H_0 = xi/8`
   (no mpmath in the available interpreter; the identity is a kernel-checked LeanCert theorem). LeanCert,
   Mathlib, `PrimeNumberTheoremAnd`, `rellich-kondrachov` were not kernel-replayed by anyone.

## Controls

* DH: no step is an argument towards RH; the statements do not apply to DH (corrected reason in item 3).
* RH / verified height: `terminal_certificate` is conditional on a zero-free hypothesis that is stated
  explicitly; nothing assumes RH and no finite-height certificate is involved.
* Backward heat family and sign twist: not applicable (definitional and verification statements only).

## Verdict

holds = true, with the corrections above. Surviving statement: in a clone, kernel-accepted with the three
standard axioms, `terminal_certificate` holds under `2/3 <= kappa` together with the unchanged hypothesis
`2 beta - 1 <= kappa` (so it is unconditional only for `kappa >= 3/4`, and conditional on the unformalised
stage-0 bound at `29991/40000`); the OAI Hecke `LFunction` equals the ideal series and Mathlib `LSeries` on
`Re s > 1`, is the unique holomorphic continuation on `C \ {0,1}`, and equals `dedekindZeta` on `Re s > 1` for
modulus `(1)`; 2924 of 2924 closure modules and 277 of 277 modified-cone modules exit 0 under `leanchecker`
(the 277th run by the referee). Open items as listed in RESULT sections 4, 7 and 9.
