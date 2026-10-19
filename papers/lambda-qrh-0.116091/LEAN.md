# Lean status

Three Lean 4 developments bear on the result. All use Lean 4.34.1 and Mathlib
`d13f23b7`. Every theorem listed below prints only `propext`, `Classical.choice`
and `Quot.sound` under `#print axioms`, except `QrhLambda.two96_pos`, which uses
none. No `sorry`, no `native_decide`, no `axiom` declarations.

What Lean establishes is the deduction: from the named hypotheses below, the two
values follow, with every arithmetic step of both runs re-done by the kernel. The
hypotheses themselves are not Lean-checked, so the Lean theorems depend on the same
inputs as the paper.

| piece | Lean status | where |
|---|---|---|
| (H1) `ζ(s) ≠ 0` for `Re s > 7/8` | proof released by openai/math; rebuilt locally; used as a theorem | openai/math `lean/`, module `OAI.NumberTheory.DirichletL.Nonvanishing` |
| Lemma 1 (half-plane to squared strip) | proved | `formalization/lean/raymond-core/RaymondCore/Substitution.lean` |
| start condition `Im(z)² ≤ 9/16` at `t = 10⁻⁸` | proved from (H1) and Lemma 1 | `QrhLambda.start78_of_zeroFree`, `QrhLambda.start78` |
| strict entry (S1), substep barrier lemma, terminal step, checker soundness | proved, from the hypotheses (W), (FC), (CE) | `formalization/lean/qrh-lambda/QrhLambda/{Barrier,Sound,Terminal11}.lean` |
| every substep of value (ii) (59,439) and of value (i) (60,675) | checked by `decide +kernel` (30 + 31 chunk theorems plus frame) | `formalization/lean/qrh-lambda/QrhLambda/Chunks/`, `Data/{F2,R78}.lean` |
| Lemma CG (coefficient monotonicity in Raymond's main eqs. (11)–(13)) | proved, for every squarefree `g` | `RaymondCore.CG` |
| Lemma R (phase estimate in Theorem 4′) | analytic core proved, with Raymond's AF (4.6) Stirling bounds and `Φ′ = Re β_t` as hypotheses | `RaymondCore.LemmaR` |
| head wall (W), first contact (FC), contact exclusion (CE) | hypotheses (`RaymondChainHyps`) | `QrhLambda/Hyps.lean` |
| floor inequality (J) per entry, kernel inequality (K) per row | hypotheses (`TableHyps`) | `QrhLambda/Hyps.lean` |
| (H3) Platt–Trudgian | inside the hypothesis `head_wall` | — |

## 1. The 7/8 half-plane (openai/math family 003)

Record: `formalization/external/openai-math-qrh-verification.md` (2026-10-07).

The statement

```lean
theorem OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re
    {s : ℂ} (hs : (7 / 8 : ℝ) < s.re) : riemannZeta s ≠ 0
```

was built from the `lean/` directory of the initial commit
`adc7f1241b42e322a6451854ab7e4b4c146bf78a` (6 October 2026) of
github.com/openai/math. The workspace is a copy of that directory, not a git
checkout, so the commit is recorded in the verification note rather than in the
workspace itself. The local check (2026-10-07):

* toolchain Lean 4.34.1 (commit `5045d005`), Mathlib `d13f23b723b8`, the 24
  release patches applied and reverse-checked by the lakefile hooks;
* `LEAN_NUM_THREADS=4 lake build +OAI.NumberTheory.DirichletL.Nonvanishing`:
  `Build completed successfully (7061 jobs)`; all 2,924 modules of the import
  closure built; 0 errors; 0 `sorry` warnings;
* `#print axioms` on the theorem and on the Dirichlet companion
  `OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re`:
  `[propext, Classical.choice, Quot.sound]`;
* the type is identical (raw `Expr`, up to one hygienic binder name) to the
  comparator challenge `ComparatorChallenges/QuasiRiemannHypothesis.lean`
  elaborated against Mathlib alone; `riemannZeta` is Mathlib's definition
  (`HurwitzZeta.hurwitzZetaEven 0`), not shadowed;
* source scan of the closure (486,490 lines): no `sorry`, `admit`, `axiom`,
  `native_decide`, `unsafe`, `implemented_by`, `extern`, `set_option`;
* final `Nonvanishing.olean` sha256
  `adeff7db7211767b3a3437958cecce7229185c998c8ac909a7013ec75d499fdc`.

Not done: the official comparator run (it needs `landrun`, Linux only, and
`lean4export`); an independent kernel replay (`lean4checker` or nanoda) of the
openai/math closure (about 10 CPU-hours); the `HeckeSevenEighths` and
`SiegelZeros` comparator statements; a rebuild at the updated commit; refereeing of
the manuscript. The repository update of 8 October 2026 (commit `301488868`, merged as
`fd4aeeb2`) changes none of the 2,924 modules of the import closure, the comparator
file, the lakefile, the manifest, the toolchain or the family-003 manuscripts (commit
file list compared with the closure computed from the local workspace, 2026-10-09).
Trust in (H1) therefore rests on the Lean 4.34.1 kernel as run during the local
build, on Mathlib's definitions and on the build toolchain.

Name collision: the comparator file `ComparatorChallenges/QuasiRiemannHypothesis.lean`
declares the same name with a `sorry` proof. The project files import the proved
module `OAI.NumberTheory.DirichletL.Nonvanishing`; `#print axioms` would show
`sorryAx` otherwise.

## 2. raymond-core

Package `formalization/lean/raymond-core` (2026-10-07; LeanCert `7f91b6eb`,
github.com/alerad/leancert). Axiom output: `axioms-output.txt`.

| item | Lean name | statement | hypotheses |
|---|---|---|---|
| Lemma 1 | `RaymondCore.Substitution.substitution` | if `ζ(s) ≠ 0` on `Re s > θ` (`θ ≥ 1/2`), every zero of `H_t` (`t ≥ 0`) has `Im(z)² ≤ max((2θ−1)² − 2t, 0)` | `ZetaZeroFreeRight θ` |
| unclamped form | `substitution'` | `Im(z)² ≤ (2θ−1)² − 2t` for `0 ≤ 2t ≤ (2θ−1)²` | same |
| conditional de Bruijn bound | `Lambda_le_of_zeroFree` | `Λ ≤ (2θ−1)²/2` | same |
| θ = 1 | `Lambda_le_half'` | `Λ ≤ 1/2` | none (Mathlib's `riemannZeta_ne_zero_of_one_lt_re`) |
| θ = 7/8 | `RaymondCore.Instance78.H_zero_strip_78`, `Lambda_le_nine_thirtyseconds` | `Im(z)² ≤ max(9/16 − 2t, 0)`; `Λ ≤ 9/32` | the openai/math theorem (checked through the openai/math workspace) |
| Lemma CG | `RaymondCore.CG.covering_identity`, `D_nonneg_mono`, `Cg_eq_D`, `Cg_nonneg_mono`, `cn_nonneg_mono` | covering identity; `0 ≤ c_n(t′) ≤ c_n(t)` for `n ≥ 1`, `0 ≤ t′ ≤ t` | none |
| Lemma R | `RaymondCore.LemmaR.reBeta_bound`, `lemmaR_sharp`, `lemmaR`, `epsR_lt`, `lemmaR_paper` | the integration step (with `a²/(8(x−a))`, sharper than the paper's `a²/(4(x−a))`); `ε_R < 10⁻¹⁰` for `X ≥ 6·10¹²`, `0 < a < 2`, `0 ≤ t ≤ 41/250` | AF (4.6) and `Φ′ = Re β_t` as explicit hypotheses |

`H` is LeanCert's concrete `H t z = ∫₀^∞ e^{tu²} Φ(u) cos(zu) du`, with
`H 0 z = ξ(1/2 + iz/2)/8` (`H_zero_eq_riemannXi`), de Bruijn's squared-strip
contraction (`H_forward_strip`) and the threshold characterisation
`(∀ z, H t z = 0 → z.im = 0) ↔ Lambda ≤ t` (`real_zeros_iff_Lambda_le`), all proved
in LeanCert.

## 3. qrh-lambda: the two values as Lean theorems from named hypotheses

Package `formalization/lean/qrh-lambda` (2026-10-09; commits `fc8b67cd4` and
`6c1ef30d4` on branch `editorial-redesign`). Axiom outputs: `axioms-output.txt`
(121 library theorems), `oai-axioms-output.txt` (5 theorems checked against the
openai/math workspace).

```lean
-- QrhLambdaOAI/Main78.lean
theorem QrhLambda.lambda_le_of_qrh_raymond (h : RaymondChainHyps) (f : FloorTableHyps) :
    deBruijnNewmanLambda ≤ 116091488672439 / 10 ^ 15
theorem QrhLambda.realZeros_of_qrh_raymond (h : RaymondChainHyps) (f : FloorTableHyps) :
    ∀ t : ℝ, 116091488672439 / 10 ^ 15 ≤ t → ∀ z : ℂ, H t z = 0 → z.im = 0
theorem QrhLambda.lambda_le_of_raymond78 (h : RaymondChainHyps) (f : RaymondTableHyps) :
    deBruijnNewmanLambda ≤ 118505710922701 / 10 ^ 15
```

`deBruijnNewmanLambda` is LeanCert's `Lambda = sInf {t | every zero of H_t is real}`.
In the lake library (`QrhLambda/Main.lean`) the same three theorems take the
half-plane as an extra argument `hZ : RaymondCore.Substitution.ZetaZeroFreeRight (7/8)`
(`*_of_zeroFree`). The generic theorem is

```lean
QrhLambda.Cert.lambda_le (C : Cert) (hframe : C.frame11 = true)
  (hchunks : ∀ j < C.chunks.length, C.chunkOK j = true)
  (hR : RaymondChainHyps) (hT : TableHyps C) (hstart : StartBound C.qb) : Lambda ≤ C.U
```

### Named hypotheses

`RaymondChainHyps` (three fields, each a statement about the concrete `H_t`):

| field | statement | source in Raymond's text |
|---|---|---|
| `head_wall` (W) | for `0 ≤ t ≤ 41/250`, every zero of `H_t` with `\|Re z\| ≤ X = 6000000185827` is real | AF §§2–3; contains (H3), used once at `t = 0` |
| `first_contact` (FC) | a continuous positive barrier on `[t₀, t₁]` (`0 < t₀`, `t₁ ≤ 41/250`) that starts strictly above the tail zeros and is not above them at some time has a first contact time `s ∈ (t₀, t₁]`, with strict separation on `[t₀, s)` and a tail zero with `Im(z)² = β(s)` | AF §11, main §7; Polymath Theorem 1.5(i), Hurwitz |
| `contact_exclusion` (CE) | on a substep of cell `i` with a valid single-pair rate `c` at stored level `Q ≥ b` (`PairRate`, which contains (J) and (K) as premises), the barrier `flow b c (u − t₀) ≥ q_e` cannot be touched after strict separation | AF §11 (11.1); Polymath Proposition 3.1(i)–(ii) |

`TableHyps C` (two fields): `floors_valid` — every floor entry `(cell, r, h, ℓ)`
satisfies `ℓ < (S t (x + rh) h + S t (x − rh) h)/2` for all `t` in the closed cell
and all `x ≥ X`, with `S t x h = Re(i H_t′(x+ih)/H_t(x+ih)) = ∂_y log|H_t(x+iy)|`
at `y = h`; `kernels_valid` — every kernel row `(r, λ, ρ)` satisfies AF (10.1) at
scale 1. `FloorTableHyps = TableHyps F2.cert` (468 floor entries, 59 kernel rows);
`RaymondTableHyps = TableHyps R78.cert` (476 floor entries, catalogue kernels 4
and 5).

### What the kernel replays

`QrhLambda/Checker.lean` (core Lean only) recomputes each run from its start value
with exact integer and rational arithmetic, from per-run data (kernel table, floor
table, run list). For every substep `n` (time `n/512000`, cell `⌊n/128⌋`): cell
match; `v = q/h² ≤ ρ²` (E1); `hr < 2`; `1/2 ≤ h ≤ 5/2` (E7); the cap by Raymond's
rule (E2); the rate `c = (2λ/h)(ℓ − cap/h) > 0` (E3); `0 < cδ < 1`; `T₁₈(cδ)` by an
integer Horner scheme; the next stored value `ceil_{2⁻⁹⁶}((q + 2/c)T₁₈(cδ) − 2/c)`
(E4); the no-early-crossing test with `T₁₇` (E6); the horizon `t ≤ 41/250`. The
frame (`Cert.frame11`) checks `q0 > 9/16` (E8), S1, the first substep, chunk links,
and the terminal substep (`z ∈ (0,1)`, lag `≤ δ`,
`U = ceil_{10⁻¹⁵}(t_K + lag₁₁ + q_e/2) < 41/250`, terminal enclosure `≤ q_e`).

| run | substeps | chunk theorems | start | `U` computed by the kernel |
|---|---|---|---|---|
| F2, value (ii) | 59,439 | 30 × 2000 | `5625001/10⁷` | `116091488672439/10¹⁵` |
| R78, value (i) | 60,675 | 31 × 2000 | `281251/500000` | `118505710922701/10¹⁵` |

F2 also passes the alternate-log terminal test (`U = U_robust`). R78 does not (its
alternate-log value is 0.118505710922702), so the soundness theorem uses the
primary degree-11 log bound.

Negative controls (`scripts/NegativeControl.lean`; the kernel proves the check
returns `false`): `U` lowered by `10⁻¹⁵`; R78 claiming its alternate-log value; the
R78 alternate-log frame; the floor of cell 0 raised by `10⁻¹²`; floor entry 164
lowered by `10⁻¹²` in chunk 10; kernel row 18 with `ρ = 1/5` in chunk 10.

Kernel cost (`build-logs/`): F2 chunks 13–129 s wall each (sum 953 s), max RSS
3.0 GB; R78 chunks 6–26 s (sum 701 s), max RSS 2.8 GB.

### Internal referee pass (2026-10-09)

Independent from-scratch rebuild in a separate copy with a fresh LeanCert clone at
`7f91b6eb` (76 modules including the 61 chunk certificates; 15.5 min wall).
`leanchecker` replay passed for the 14 non-chunk modules, the 61 chunk modules,
`RaymondCore.Substitution` and the 74 LeanCert closure modules. Axiom audit
identical. An independent Python implementation of the `Checker.lean` semantics
reproduced `U` and the S1 margin, with 0 mismatches against the F2 dump over all
59,439 substeps and 0 provenance failures over 468 + 476 floor entries. The referee
also proved `raymondChainHyps_of_RH`: the hypotheses follow from RH, so they are
consistent unless RH is false. That proof is in the referee's copy
(`/tmp/qrh-referee-20261009/qrh-lambda/referee/RefereeSanity.lean`, outside the
repository; `#print axioms` gives the standard three). Not refuted; minor corrections applied (naming of
the alternate-log test; `deBruijnNewmanUpper` renamed `deBruijnNewmanLambda`; run
counts; status wording).

## 4. Not checked in Lean

* The three `RaymondChainHyps` fields and the Platt–Trudgian verification inside
  `head_wall`.
* `floors_valid`: Raymond's one-point estimates (AF §§4–9, including AF (4.6) and
  `Φ′ = Re β_t`), the two-probe joint floors (main Theorem 4), the project's
  Theorem 4′, Theorem MP and multi-height licence, and for the 89 r2 entries the
  WOL-C lemma, the measured 0.0023 time-box allowance and the unreviewed L-slope
  lemma.
* `kernels_valid`: (10.1) for the 59 + 2 kernel rows (exact Bernstein certificates
  in Python; the 59 F2 rows re-certified by a second method).
* (H1) beyond the local build (section 1).
* That the consumer chose the maximal rate (irrelevant to validity: any admissible
  choice gives a valid barrier).

Effort estimates for discharging the hypotheses, recorded in
`src/data/qrh-lambda-lean-2026-10-09.js`, are rough judgements (on the order of
16–32 person-months for the analytic hypotheses), not measurements.

## 5. Build

The packages build only with machine-local state: a Mathlib `d13f23b7` build and the
openai/math workspace (not a git repository; some of its dependency checkouts carry
local patches), now at `$HOME/lean-deps/qrh-verify/lean` with `/tmp/qrh-verify` a
symlink to it, and the gitignored LeanCert checkout
`formalization/lean/raymond-core/.lake/packages/leancert`. A clean clone cannot
rebuild them without these.

```sh
# raymond-core
cd formalization/lean/raymond-core
Q=$HOME/lean-deps/qrh-verify/lean/.lake/packages; mkdir -p .lake/packages
for p in mathlib plausible LeanSearchClient importGraph proofwidgets aesop Qq batteries Cli; do
  ln -sfn $Q/$p .lake/packages/$p; done
rsync -a --exclude .lake $Q/leancert/ .lake/packages/leancert/
lake build
lake env lean scripts/AxiomsCheck.lean
scripts/check-instance78.sh                  # θ = 7/8 instance against the openai/math workspace

# qrh-lambda
cd ../qrh-lambda
mkdir -p .lake/packages
for p in mathlib plausible LeanSearchClient importGraph proofwidgets aesop Qq batteries Cli; do
  ln -sfn $Q/$p .lake/packages/$p; done
ln -sfn $PWD/../raymond-core/.lake/packages/leancert .lake/packages/leancert
scripts/build_chunks.sh F2 3; scripts/build_chunks.sh R78 3    # ≤ 3 Lean processes
lake build
lake env lean scripts/AxiomsCheck.lean
scripts/check-oai.sh                         # final theorems with the openai/math half-plane
lake env lean scripts/NegativeControl.lean

# openai/math 7/8 theorem (in the workspace)
cd $HOME/lean-deps/qrh-verify/lean
LEAN_NUM_THREADS=4 lake build +OAI.NumberTheory.DirichletL.Nonvanishing
```

The raymond-core README still names `/tmp/qrh-verify/lean`; the symlink makes both
paths work. Regenerating the qrh-lambda data from the run dumps:
`python3 scripts/export_f2.py tmp/qrh-tune-out/F2_final.steps.jsonl.gz exports/f2_export.json`,
`python3 scripts/export_r78.py exports/r78_export.json`, then
`python3 scripts/gen_lean.py exports/f2_export.json F2 2000` (and `R78`).
