# r2-lean-kappa-1318: Lean base for the plain moment below kappa = 3/4, Hecke series identification, DBN definitions, kernel replay

Status: internal working note, 2026-11-16. Unrefereed. No new zero-free region and no new Lambda bound is
claimed. RH open, no QED. Labels: PROVED (Lean kernel, axioms `propext`, `Classical.choice`, `Quot.sound`,
or exact arithmetic), READ (compared by reading), MEASURED, OPEN / NOT DONE.

All Lean work was done in a copy-on-write clone of `~/lean-deps/qrh-verify/lean` at
`tmp/research-2026-11-16/push/r2-lean-kappa-1318/lean` (Lean 4.34.1, Mathlib `d13f23b7`). `~/lean-deps` and the
repo's `formalization/` tree were read, not written. No pushes.

## 0. Plan; what is new relative to the atlas, the audit and the walls

`zf-audit-inputs` (RESULT + REFEREE) left four items open: (a) the Lean plain moment requires `3/4 <= kappa`
while Xu-Sang stage 1 needs `kappa = 29991/40000`; (b) kernel replay covered 8 of 2924 modules; (c) the Hecke
theorem is about an OAI-defined function; (d) `deBruijnNewmanLambda`, `H` are LeanCert definitions. This note
closes (a), (c), (d) in Lean and runs (b). It is verification work: it adds no arithmetic input and does not
touch the walls (flow-blindness, MV-CAP, verified height are not involved; DH control in section 6).

## 1. Inventory of `3/4 <= kappa` (task item 1)

The referee's count "14 files" is low. `grep` over `OAI/NumberTheory/DirichletL` (pattern
`3/4 <= kappa` in all spellings, file `uses-34.txt`): **58 occurrences in 42 files** (40 in `Energy/`, 1 in
`Moments/`, 1 in `Hecke/`). Per-file line numbers: `uses-by-file.txt`. Classification, established by
rebuilding (section 2), not by reading:

| class | where | what the proof uses | status |
|---|---|---|---|
| E: numeric use | `Moments/ReflectionRetainedLength.positive_slot_width_drop`; `Energy/ReferenceState.balanced_reference_geometry`; `Energy/ReferenceLowBranchGeometry.slot_budgets`, `reflected_low`, `reflected_low_admissible`; `Energy/LiveClippingDefect.robust_slot_budgets`, `robust_balanced_long_nonneg`, `robust_reflected_low`, `robust_reflected_low_admissible`, `robust_fixed_slack` (4 files) | `6 kappa - 1 >= 7/2`, giving slot length `ell <= M/21` and the comparison bounds `16M/21`, `13M/14` with reserve `M/14` | replaceable: with `6 kappa - 1 >= c` the same proofs give `ell <= M/(6c)`, bounds `2M/3 + M/(3c)`, `5M/6 + M/(3c)`, reserve `M/6 - M/(3c)`. Constants changed, proofs (`linarith`/`nlinarith`) unchanged |
| R: carries the reserve constant | 12 files (`OriginalHighReflection{Geometry,Original,Deleted,Power,Bounded}`, `ReferenceLow{Window,DeletedGeometry}`, `ReferenceRobust{Original,DeletedEnergy,Power,Bounded}`, `DeletedRobustGeometry`) | hypothesis `xi <= width/14` or `xi + 11 e/7 <= width/14` | replaceable: reserve `1/14` becomes `1/15` (kappa >= 13/18) or `1/18` (kappa >= 2/3); the choices `xi = e = M0/56` and `xi <= rho/100` still satisfy it |
| P: pass-through or weaker fact | the remaining 25 files of `Energy/` (incl. `CertifiedExistence`, `CappedAnalyticSuccessor`, the `Natural*`, `PositiveHigh*`, `Reference*` stages) | the hypothesis is handed to a callee, or only `0 <= 6 kappa - 1`, `0 < 6 kappa` is used | replaceable verbatim (compiles with only the hypothesis text changed). The individual minimal inequality per file was not isolated; all hold for `2/3 <= kappa` |
| X: not in the cone | `Hecke/DetectorRowCountCrossing.plain_capacity_bound` | `(1-2m)/(6 kappa) <= 2/27` | essential for its own conclusion (at 13/18 the bound is `1/13`); the lemma has no user in the library; left unchanged |
| call site | `Detector/FinalAssemblyUnconditional.detector_certified_bands` | supplies `3/4 < kappaPlain D` | one line changed (`.le` to `linarith`) |

No use is essential for `terminal_certificate`. No new numeric certificate was needed.

## 2. Generalisation and rebuild (task item 2). PROVED

Two builds of the cone, both ending `Build completed successfully (7061 jobs)`, target
`OAI.NumberTheory.DirichletL.Nonvanishing`:

| build | hypothesis | constants | modules rebuilt | logs | patch |
|---|---|---|---|---|---|
| A | `13/18 <= kappa` (`6k-1 >= 10/3`) | `ell <= M/20`, `23M/30`, `14M/15`, reserve `M/15` | 155 + 118 + 2 | `logs/build-01..04.log` | `kappa-1318.patch` (42 files, 97 lines), source snapshot `OAI-1318-src/` |
| B (final state of the copy) | `2/3 <= kappa` (`6k-1 >= 3`) | `ell <= M/18`, `7M/9`, `17M/18`, reserve `M/18` | 274 | `logs/build-23-01.log` | `kappa-23.patch` (42 files, 101 lines) |

Breakages, in order (all in build A; build B passed at the first attempt after the same substitutions):

1. `Moments/ReflectionRetainedLength.lean:66` and `Hecke/DetectorRowCountCrossing.lean:110`: `linarith` fails
   (`7/2 z <= (6k-1) z` is false below 3/4; `2/27` is false below 3/4). Fix: `10/3`, `z <= M/20`; the second
   file reverted (class X).
2. `Energy/ReferenceState.lean:84`: same `7/2` step; its conclusion `ell <= M/21` is a statement, so the
   statement changes to `M/20`, and with it the constants of classes E and R.
3. `Detector/FinalAssemblyUnconditional.lean:31`: type mismatch `13/18 <= kappaPlain D`. Fix: `linarith`.

The constants `M/20`, `23M/30`, `14M/15`, reserve `M/15` are the ones in Xu-Sang Appendix A; the original
Lean file used the sharper `M/21`, `16M/21`, `13M/14`, reserve `M/14`, so the Lean proof is not a transcription
of the manuscript's (18.15)-(18.16) and the Appendix A check had to be redone in Lean rather than read off.

Resulting signature (build B, `logs/kappa-check.out`):

    CenteredMomentEnergyCertifiedExistence.terminal_certificate :
      ... 0 < Mcap -> 2/3 <= kappa -> 0 < eps -> 51/100 <= HeckeZeroSupremum.beta ->
      2 * HeckeZeroSupremum.beta - 1 <= kappa -> CertifiedBand M H hH W bslot a b radial Bmask L lo hi Mcap kappa eps (count Mcap eps)

New theorems (`KappaCheck.lean`), each with `#print axioms` = `[propext, Classical.choice, Quot.sound]`:

* `KappaThirteenEighteenths.terminal_certificate_of_half_add`: `13/18 <= kappa`, `51/100 <= beta`,
  `beta <= (1+kappa)/2` imply the terminal certificate (Xu-Sang Lemma 2.1 in the Lean form of Lemma 18.1).
* `KappaThirteenEighteenths.terminal_certificate_stage_one`: the instance `kappa = 29991/40000` under
  `51/100 <= beta <= 69991/80000`.
* `KappaThirteenEighteenths.terminal_certificate_two_thirds`: the same for `2/3 <= kappa`.

Also printed, same three axioms: the modified `terminal_certificate`, `certified_bands`,
`positive_slot_width_drop`, `balanced_reference_geometry`, `slot_budgets`, `reflected_low`,
`robust_slot_budgets`, `live_profiles_reference_window`, and the rebuilt
`OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`, `OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re`
(the 7/8 theorems still close after the change). `logs/kappa-check-1318build.out` is the same check run against
build A.

Remark (not built): by the formula in class E the reserve is positive for every `kappa > 1/2`; below 2/3 the
fixed choices `M0/56` and `rho/100` would also have to be rescaled. Not needed by Xu-Sang (the licence
`beta <= (1+kappa)/2` is the binding condition there, not the range of Lemma 2.1).

## 3. Kernel replay of the closure (task item 3)

REPLAY_SECTION_PLACEHOLDER

## 4. Hecke L-function = Hecke Dirichlet series (task item 4). PROVED

File `HeckeSeries.lean`, elaborated against the copy (`logs/hecke-series.out`; 13 `#print axioms` lines, all
`[propext, Classical.choice, Quot.sound]`). `O` is Mathlib's `NumberField.RingOfIntegers (CyclotomicField 3 Q)`;
`Character` is a modulus `M != 0` with a `MulChar (O/M) C` trivial on the image of `O^x` (plus a period used only
by the theta construction).

| theorem | statement |
|---|---|
| `idealCoeff_of_generator` | for `I != 0` and any generator `a` of `I`: `idealCoeff chi I = chi.residue (a mod M)` |
| `idealCoeff_mul`, `idealCoeff_one` | completely multiplicative on ideals |
| `idealCoeff_ne_zero_iff` | for `I != 0`: coefficient nonzero iff `IsCoprime I M` |
| `norm_idealCoeff_of_isCoprime` | absolute value 1 on ideals coprime to `M` |
| `idealTerm_summable`, `LFunction_hasSum_ideal` | for `Re s > 1`: `HasSum (fun I => idealCoeff chi I / N(I)^s) (LFunction chi s)` (unconditional convergence, not only a `tsum` identity) |
| `LFunction_eq_LSeries` | for `Re s > 1`: `LFunction chi s = LSeries (normCoeff chi) s`, `normCoeff chi n = sum_{N(I)=n} idealCoeff chi I` (Mathlib `LSeries`) |
| `LFunction_unique` | any `F` holomorphic on `C \ {0,1}` with that series on `Re s > 1` equals `LFunction chi` on `C \ {0,1}` (identity theorem; uses `LFunction_differentiableAt`) |
| `ne_zero_of_hasSum_of_seven_eighths_lt_re` | such an `F` has `F s != 0` for `Re s > 7/8`, `s != 1`: the 7/8 theorem with no reference to the OAI construction |
| `LFunction_eq_dedekindZeta_of_modulus_top`, `exists_character_modulus_top` | for modulus `(1)` and `Re s > 1`: `LFunction chi s = NumberField.dedekindZeta (CyclotomicField 3 Q) s` (Mathlib's definition); such a character exists |

So the OAI object is, on `Re s > 1`, the series `sum_I chi(I) N(I)^{-s}` over ideals of `Z[omega]` with
`chi(I) = chi_0(generator mod M)` for `(I, M) = 1` and `0` otherwise, and it is the unique holomorphic
continuation of that series to `C \ {0,1}`.

What remains to identify it with the classical object (none of it in Lean):

1. Mathlib has no Hecke-character L-function for number fields to compare against (no `HeckeCharacter` /
   Groessencharacter L-series in this Mathlib). The only Mathlib anchor is the Dedekind zeta case above.
2. The dictionary "characters of `(O/M)^x` trivial on global units = characters of the ray class group mod `M`"
   (class number 1, one complex place, no sign conditions) is CLASSICAL and READ, not formalised.
3. The series is the imprimitive one for modulus `M`: Euler factors at primes dividing `M` are omitted. The
   primitive L-function differs by finitely many factors `1 - chi*(P) N(P)^{-s}`, nonzero for `Re s > 0`; that
   transfer is not formalised. No Euler product is stated in Lean (only complete multiplicativity).
4. Hecke characters with nontrivial infinity type, and other fields, are outside the family.
5. At `s = 0` for the principal character the OAI function is not shown differentiable; irrelevant for
   `Re s > 7/8`.

## 5. `deBruijnNewmanLambda` and `H` (task item 5). READ + PROVED anchors

Source: LeanCert rev `7f91b6eb`, `LeanCert/Analysis/DBN/{HeatKernel,HeatFlow,RealZeroTimes,Threshold,Xi,XiIdentity}.lean`;
the copy under `raymond-core/.lake/packages/leancert` and the one under the openai/math workspace are
byte-identical in `Analysis/DBN` (`diff -rq`). `#print` output in `logs/dbn-check.out`.

| Lean | standard (de Bruijn; Newman; Polymath15) | match |
|---|---|---|
| `kernelTerm u n = (2 pi^2 (n+1)^4 e^{9u} - 3 pi (n+1)^2 e^{5u}) exp(-pi (n+1)^2 e^{4u})`, `Phi u = sum_{n in N} kernelTerm u n` | `Phi(u) = sum_{n>=1} (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u})` | READ, equal (index shifted by 1) |
| `H t z = integral over (0, inf) of e^{t u^2} Phi(u) cos(z u) du` | `H_t(z)` in the Polymath15 normalisation | READ, equal |
| `realZeroTimes = {t | forall z, H t z = 0 -> Im z = 0}`, `Lambda = sInf realZeroTimes` | `Lambda = inf {t : H_t has only real zeros}` | READ, equal |
| `QrhLambda.deBruijnNewmanLambda` | `noncomputable abbrev ... := Lambda` | READ |
| `H_zero_eq_riemannXi : H 0 z = riemannXi (1/2 + i z/2) / 8`, with `riemannXi s = (s (s-1) completedRiemannZeta_0 s + 1)/2` | `H_0(z) = xi(1/2 + iz/2)/8` | PROVED in LeanCert; axioms re-printed here: the three standard ones |
| new `H_zero_eq_completedZeta` (`DBNCheck.lean`): for `s = 1/2 + iz/2 not in {0,1}`, `H 0 z = s (s-1) completedRiemannZeta s / 16` | ties `H 0` to Mathlib's `completedRiemannZeta` | PROVED, three standard axioms |
| `real_zeros_iff_Lambda_le`, `Lambda_unique`, new restatement `Lambda_isLeast_realZeros` | `H_t` has only real zeros iff `t >= Lambda`; the threshold is unique | PROVED, three standard axioms |

Verdict: both definitions match the standard ones. The identification at `t = 0` and the threshold property are
Lean theorems; the form of the heat factor `e^{t u^2}` is by reading (it is the definition). Remaining
unverified in the Lambda chain are the Raymond hypotheses and tables, as in the audit; not addressed here.

## 6. DH control

Nothing here is an argument towards RH, so there is no step that must fail for DH; the relevant checks are that
the statements do not apply to DH. (i) `terminal_certificate` is conditional on
`2 beta - 1 <= kappa` with `beta` the supremum of real parts of zeros of the Hecke family `LFunction chi`; the
proof bounds prime polynomials through that zero-free region of Euler products (manuscript (18.11)-(18.12)).
(ii) `LFunction_unique` and `ne_zero_of_hasSum_of_seven_eighths_lt_re` require the series
`sum_I idealCoeff chi I / N(I)^s` with `idealCoeff chi` a monoid-with-zero homomorphism on ideals
(`idealCoeff_mul`); the DH coefficient sequence is not completely multiplicative, so DH is not `LFunction chi`
for any `chi` and neither theorem applies to it.

## 7. Which Xu-Sang stage now has a Lean base

* Stage 0 (`kappa = 3/4`, licence `beta <= 7/8`): plain-moment input Lean-checked before this note
  (`terminal_certificate` at `3/4`), and the licence `beta <= 7/8` is the Lean 7/8 theorem. Unchanged.
* **Stage 1 (`kappa = 29991/40000`): its plain-moment input, Xu-Sang Lemma 2.1 / Appendix A, now has a Lean
  base**: `terminal_certificate_stage_one`, and for the whole range `13/18 <= kappa` (in fact `2/3 <= kappa`)
  `terminal_certificate_of_half_add`. The audit's "gap at Lemma 2.1 / Appendix A relative to the Lean-checked
  base" is closed.
* Still without a Lean base, for both stages: the licence of stage 1, `beta <= B_0 = 69991/80000`, is the
  conclusion of stage 0 and is not a Lean theorem; Xu-Sang Propositions 3.1 (direct estimate for
  `1/6 < l <= 1/5`), 4.1, 5.1; Appendices B, C, E, F; and the identification of `CertifiedBand` with the
  statement of manuscript Lemma 18.1 (READ in the audit, not re-done here). So neither `B_0` nor `B_1` is
  Lean-proved; what changed is that no input of stage 1 now lies outside the range of the Lean library.

## 8. Verdict

Partial result (verification): PROVED in Lean that the plain-moment terminal certificate holds for
`2/3 <= kappa` (hence for `13/18 <= kappa` and at `29991/40000`), that the OAI Hecke L-function is the Hecke
Dirichlet series on `Re s > 1` and its unique continuation, and that LeanCert's `H`, `Lambda` are the standard
objects up to the anchors in section 5. Replay status in section 3.

## 9. Three weakest steps

1. `CertifiedBand` versus the manuscript's Lemma 18.1 / Xu-Sang (6)-(7): the match is by reading (audit), so
   "Lemma 2.1 has a Lean base" means "the Lean statement that the 7/8 proof itself consumes holds on the wider
   range". Xu-Sang use the moment through their own Propositions 4.1 and 5.1, which are not formalised.
2. The class-P uses were classified by compilation at 13/18 and 2/3, not by isolating each minimal inequality.
3. Hecke faithfulness stops at the Dirichlet series: items 1-3 of section 4 (ray-class dictionary, primitive
   versus imprimitive) are classical statements with no Mathlib counterpart checked.

## 10. Files (all under this directory)

`lean/` (clone, final state = build B), `OAI-1318-src/` (source of build A), `kappa-1318.patch`, `kappa-23.patch`,
`uses-34.txt`, `uses-by-file.txt`, `changed-files.txt`, `KappaCheck.lean`, `HeckeSeries.lean`, `DBNCheck.lean`,
`logs/build-01..04.log`, `logs/build-05-hecke.log`, `logs/build-23-01.log`, `logs/build-23-02-hecke.log`,
`logs/kappa-check.out`, `logs/kappa-check-1318build.out`, `logs/hecke-series.out`, `logs/dbn-check.out`,
`replay/` (`replay.log`, `replay-copy.log`, `modules.txt`, `modules-copy.txt`, scripts, `err/`).
