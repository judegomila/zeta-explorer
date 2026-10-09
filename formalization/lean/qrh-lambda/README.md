# qrh-lambda: Lean check of the conditional QRH values Λ ≤ 0.116091488672439 (F2) and Λ ≤ 0.118505710922701 (Raymond's chain alone)

Date: 2026-10-09. Lean 4.34.1, Mathlib `d13f23b7`, LeanCert `7f91b6eb`, raymond-core (sibling package),
openai/math workspace at `/tmp/qrh-verify/lean` for the 7/8 half-plane. PT's Λ ≤ 0.2 is the accepted
bound; RH is open. The theorems below are **conditional**: they hold under explicit hypotheses
(structure arguments), listed in full in "Hypotheses". No `sorry`, no `native_decide`, no `axiom`
declarations; `#print axioms` shows only `propext`, `Classical.choice`, `Quot.sound` for every theorem.

Record modules: `src/data/qrh-path-push-2026-10-08.js` (F2), page `/lambda-qrh-conditional`;
`src/data/openai-math-integration-2026-10-08.js` (Raymond-only 7/8 value).

## Statements

`deBruijnNewmanLambda` is LeanCert's de Bruijn–Newman constant `Lambda = sInf {t | every zero of H_t is real}`
of the concrete heat integral `H t z = ∫₀^∞ e^{tu²} Φ(u) cos(zu) du` (`H 0 z = ξ(1/2 + iz/2)/8`, proved in
LeanCert); `real_zeros_iff_Lambda_le t : (∀ z, H t z = 0 → z.im = 0) ↔ Lambda ≤ t` (LeanCert).

In `QrhLambdaOAI/Main78.lean` (checked by `scripts/check-oai.sh` against the openai/math workspace):

```lean
theorem QrhLambda.lambda_le_of_qrh_raymond (h : RaymondChainHyps) (f : FloorTableHyps) :
    deBruijnNewmanLambda ≤ 116091488672439 / 10 ^ 15
theorem QrhLambda.realZeros_of_qrh_raymond (h : RaymondChainHyps) (f : FloorTableHyps) :
    ∀ t : ℝ, 116091488672439 / 10 ^ 15 ≤ t → ∀ z : ℂ, H t z = 0 → z.im = 0
theorem QrhLambda.lambda_le_of_raymond78 (h : RaymondChainHyps) (f : RaymondTableHyps) :
    deBruijnNewmanLambda ≤ 118505710922701 / 10 ^ 15
```

In the lake library (`QrhLambda/Main.lean`), the same three with the half-plane as an extra explicit
argument `hZ : RaymondCore.Substitution.ZetaZeroFreeRight (7 / 8)`
(`lambda_le_of_qrh_raymond_of_zeroFree`, `realZeros_of_qrh_raymond_of_zeroFree`,
`lambda_le_of_raymond78_of_zeroFree`). The generic theorem is
`QrhLambda.Cert.lambda_le (C : Cert) (hframe : C.frame11 = true) (hchunks : ∀ j < C.chunks.length, C.chunkOK j = true)
(hR : RaymondChainHyps) (hT : TableHyps C) (hstart : StartBound C.qb) : Lambda ≤ C.U`.

## Hypotheses (everything not proved in Lean)

`RaymondChainHyps` (`QrhLambda/Hyps.lean`), three fields, each a statement about the concrete `H_t`:

| field | statement | source |
|---|---|---|
| `head_wall` (W) | for `0 ≤ t ≤ 41/250`, every zero of `H_t` with `\|Re z\| ≤ X = 6000000185827` is real | AF Part I §§2–3 (head cell, wall, Lemma B.3 of review A); uses PT's RH verification once at `t = 0` |
| `first_contact` (FC) | a continuous positive barrier `β` on `[t₀, t₁]` (`0 < t₀`, `t₁ ≤ 41/250`) that starts strictly above the tail zeros (`\|Re z\| > X`) and is not above them at some time has a first contact time `s ∈ (t₀, t₁]`: strict separation on `[t₀, s)` and a tail zero with `Im(z)² = β(s)` | AF §11, main §7, Lemma FB(θ) step 3 (review B §§4.3, 8): compactness for `t > 0` (Polymath15 Thm 1.5(i)), Hurwitz, (W) at the wall |
| `contact_exclusion` (CE) | on a substep of cell `i` with a valid single-pair rate `c` at stored level `Q ≥ b` (`PairRate i Q c`, which contains (J) and (K) as premises), the barrier `flow b c (u − t₀) ≥ q_e` cannot be touched at `s ∈ (t₀, (i+1)/4000]` after strict separation on `[t₀, s)` | AF §11 (11.1): Polymath Prop 3.1(i) zero dynamics, (10.1) summed over the other zeros, the joint floor, the self-pair cap; Prop 3.1(ii) Hermite splitting for a multiple contact zero |

`FloorTableHyps = TableHyps F2.cert` and `RaymondTableHyps = TableHyps R78.cert`, two fields each:

* `floors_valid`: every floor entry `⟨cell, r, h, ℓ, src⟩` of the run satisfies `FloorValid cell r h ℓ`, i.e.
  `∀ t ∈ [cell/4000, (cell+1)/4000], ∀ x ≥ X, ℓ < (S t (x + rh) h + S t (x − rh) h)/2`, where
  `S t x h = Re(i H_t'(x+ih)/H_t(x+ih)) = ∂_y log|H_t(x+iy)|` at `y = h` (by the Hadamard product, Raymond's
  `Σ_pairs K_h`). F2: 468 entries (X options: QC_cliff 168, m091 40, W4 32, QB_m0.91 22, QA_m0.88 13, m094 12,
  m097 2; route-3 P-modes: P_27_40 50, P_3_5 25, P_13_20 11, P_5_8 3, P_51_80 1; r2 structured floors κ = 0.94:
  70, κ = 1: 19). R78: 476 entries of Raymond's X1 tables at PLAN heights (modes r = 23/40, 3/5). The F2 entries
  were re-read from their raw table files by `scripts/export_f2.py` (0 mismatches); the R78 entries are read
  directly from X1 `TABLES.json` by `scripts/export_r78.py`, whose replay of Raymond's max-rate choice rule
  reproduces U and the kernel split 51,614 / 9,061 substeps of review B §7. The raw source of each entry is
  listed in `floorFiles` in the data modules.
* `kernels_valid`: every kernel row `⟨r, λ, ρ⟩` satisfies `KernelValid r λ ρ`, Raymond's (10.1) at scale 1:
  `∀ d, 0 < y ≤ ρ, 0 ≤ b ≤ y, (d, b) ≠ (0, y): λy[K_1(d+r, b) + K_1(d−r, b)]/2 ≤ 2K_y(d, b)`. F2: 59 rows
  (50 of the 79 new r = 3/5 rows of the re-tune, 6 route-3 rows, catalogue kernels 4, 8, 10); R78: catalogue kernels 4 and 5.
  Certificate files are listed in `kernelCerts`.

The start condition `StartBound (9/16)` (every zero of `H_{10⁻⁸}` has `Im(z)² ≤ 9/16`) is **proved** from the
half-plane by the raymond-core substitution lemma (`start78_of_zeroFree`); the half-plane is the openai/math
theorem `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re` (Lean-checked locally, not peer-reviewed).

## What is proved in Lean

* `QrhLambda.barrier_step` — the substep barrier lemma (stored-barrier form of Lemma FB(θ) step 3) from (FC)
  and (CE): tail zeros strictly below `b` at `t₀ > 0` stay strictly below `flow b c τ` at `t₀ + τ`.
* The strict-entry argument (Lemma S(θ) + S1, review B §5): `first_sound` derives the invariant at `t = δ`
  from `StartBound qb`, the checked S1 inequality `qb < q0 − (2 + c0 q0)·10⁻⁸` and convexity of the flow.
* The terminal argument (review B §6): `terminal_sound` — crossing time `log(1+z)/c` of `q_e`, then (W) for the
  head, LeanCert's `H_forward_strip` (de Bruijn's squared-strip contraction, proved) and
  `real_zeros_iff_Lambda_le` give `Λ ≤ T + q_e/2 ≤ U`.
* Elementary bounds: `exp(−x) ≤ T₁₈(x)`, `T₁₇(x) ≤ exp(−x)` (`x ≥ 0`), `log(1+z) ≤ Σ_{k<11} (−1)^k z^{k+1}/(k+1)`
  and `log(1+z) ≤ z − z²/(2(1+z))` (`z ≥ 0`); the self-pair cap lemma for all three branches of Raymond's
  cap rule (`selfTerm_le_cap`); the integer Horner identity for `T₁₈` (`horner_spec`).
* Soundness of the checker (`QrhLambda/Sound.lean`) and the composition into `Cert.lambda_le`.
* The kernel certificates: every substep of both runs replayed by the Lean kernel (below).

## Kernel-checked replay (`decide +kernel`)

`QrhLambda/Checker.lean` (core Lean only) recomputes the run from the start value, with exact integer and
rational arithmetic, from per-run data only (`QrhLambda/Data/{F2,R78}.lean`: kernel table, floor table, run
list `(floor index, kernel index, length)`). For each substep `n` (time `n/512000`, cell `⌊n/128⌋`): cell match,
`v = q/h² ≤ ρ²` (E1), `hr < 2`, `1/2 ≤ h ≤ 5/2` (E7), the cap by Raymond's rule and one of the three cap
conditions (E2), the rate `c = (2λ/h)(ℓ − cap/h) > 0` (E3), `0 < cδ < 1`, `T₁₈(cδ)` by an integer Horner scheme,
the next stored value `ceil_{2⁻⁹⁶}((q + 2/c)T₁₈(cδ) − 2/c)` (E4), the no-early-crossing test with `T₁₇` (E6),
and the horizon `t ≤ 41/250`. Frame (`Cert.frame11`, `QrhLambda/Terminal11.lean`): `q0 > 9/16` (E8), S1, the
first substep, chunk links, and the terminal substep (`z ∈ (0,1)`, lag `≤ δ`, `U = ceil_{10⁻¹⁵}(t_K + lag₁₁ +
q_e/2) < 41/250`, terminal enclosure `≤ q_e`). F2 also passes the consumer's alternate-log terminal test (`F2.frame_ok`; this is not E6, which is the
non-terminal no-early-crossing test above:
`U = U_robust`); Raymond's chain does not (`R78_frame_altlog`: its alternate-log value is 0.118505710922702,
as recorded in review B §6), so the soundness theorem uses the primary degree-11 log bound.

| run | substeps | chunk files | start | U (kernel-computed) |
|---|---|---|---|---|
| F2 (`tmp/qrh-tune-out/F2_final.steps.jsonl.gz`) | 59,439 | 30 × 2000 | 5625001/10⁷ = 9/16 + 10⁻⁷ | 116091488672439/10¹⁵ |
| R78 (`tmp/oai-lambda-raymond.py` chain, replayed by `scripts/export_r78.py`) | 60,675 | 31 × 2000 | 281251/500000 = 9/16 + 2·10⁻⁶ | 118505710922701/10¹⁵ |

Run structure: the F2 consumer's 566 runs are stored in `Data/F2.lean` as 595 chunk-level runs (split at the
29 chunk boundaries); the first substep and the terminal substep (floor 467, kernel 56; n = 59,438, cell 464)
are checked separately in `frame11`. R78 has 506 chunk-level runs (terminal n = 60,674, cell 474).

The Python exporter re-runs the chain with the same integer algorithm and reproduces every dumped `q`, rate and
cap of F2 exactly (0 mismatches on 59,439 substeps) and the dump's `U`; the Lean kernel re-derives every
boundary state independently (the stored states are only targets).

Cost (`build-logs/`): F2 chunks 13–129 s wall each (sum 953 s, three in parallel at load ≈ 40), max RSS
3.0 GB (catalogue-option chunks 16–17, rates with ~300-bit numerators); R78 chunks 6–26 s (sum 701 s), max RSS
2.8 GB. Sequential re-timing (`build-logs/chunk-timing.txt`, `lake env lean` on one chunk file, user CPU / max
RSS): F2C00 (X options) 12.6 s / 2.0 GB, F2C16 106.7 s / 3.1 GB, F2C17 109.3 s / 3.1 GB (catalogue options with
V-dependent caps). The collectors (`frame11_ok`, first and terminal substeps) take under 1 s.

Negative controls (`scripts/NegativeControl.lean`, kernel proves the checks return `false`): U lowered by
10⁻¹⁵; R78 with the alternate-log value claimed; R78 `frame` (alternate-log test); floor of cell 0 raised by
10⁻¹²; floor entry 164 lowered by 10⁻¹² in chunk 10; kernel row 18 with ρ = 1/5 in chunk 10.

## Not checked here

* The three `RaymondChainHyps` fields (AF §§2–3 and §11, Polymath15 Thm 1.5(i), Prop 3.1, Hurwitz) and PT's
  RH verification (inside `head_wall`).
* The floor tables (`floors_valid`): AF §§4–9 one-point input, main-paper Theorem 3/4′ joint floors (G0-c),
  Track-A gains, route-3 Theorem MP, the multi-height licence, and for the 89 r2 floor entries (11,304 F2
  substeps) the WOL-C outer lemma, a measured 0.0023 time-box allowance and the unreviewed r2 L-slope lemma
  (record module `conditional` list). Lemma CG (G0-a, proved in raymond-core) is an input of these producers
  (AF §6 product head ≥ 0); it does not enter the barrier iteration.
* The kernel inequality (10.1) for the 59 + 2 kernel rows (`kernels_valid`; exact Bernstein certificates in
  Python, re-certified by a second method for the 59 F2 rows).
* That the consumer's choice rule picked the maximal rate (irrelevant for validity: any admissible choice
  gives a valid barrier).
* The openai/math half-plane beyond the local Lean build. `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`
  (statement: Mathlib's `riemannZeta s ≠ 0` for `7/8 < Re s`) is kernel-checked in the local build with
  standard axioms only, and a source scan of its 2,923-module import closure found no `sorry`, `axiom`,
  `native_decide`, `unsafe`, `implemented_by` or `extern`. Neither the official comparator nor `leanchecker`
  was run on that closure (about 10 CPU-hours), and it is not peer-reviewed. Without it, the confirmed
  statements are the `*_of_zeroFree` theorems, which take `ZetaZeroFreeRight (7/8)` as an argument.
* Certification of the table sources is mixed (all inside `floors_valid`, so the theorems stay correctly
  conditional): the 89 r2 entries rest on a measured, uncertified 0.0023 time-box allowance, the unreviewed
  r2 L-slope lemma and WOL-C; the 289 X-option entries rest on the route-9 multi-height licence (not refereed
  outside the project); the G0-c joint floors have no external reader.

## Build

Reproducibility: the package builds only with machine-local state. It needs `/tmp/qrh-verify/lean` (Mathlib
`d13f23b7` build and the openai/math workspace; not a git repository; its PrimeNumberTheoremAnd, belyi and
formal-schemes checkouts carry local patches) and `../raymond-core/.lake/packages/leancert` (gitignored;
LeanCert `7f91b6eb`). Regenerating the data also needs `/tmp/raymond_pr/.../KERNELS.json` and
`/tmp/b145-A-archive/TABLES_NEW.json`. A clean clone cannot rebuild it without these.


```sh
cd formalization/lean/qrh-lambda
# packages: symlinks into the openai/math workspace (Mathlib d13f23b7) and raymond-core's LeanCert build
Q=/tmp/qrh-verify/lean/.lake/packages; mkdir -p .lake/packages
for p in mathlib plausible LeanSearchClient importGraph proofwidgets aesop Qq batteries Cli; do ln -sfn $Q/$p .lake/packages/$p; done
ln -sfn $PWD/../raymond-core/.lake/packages/leancert .lake/packages/leancert
scripts/build_chunks.sh F2 3; scripts/build_chunks.sh R78 3   # chunk certificates, ≤ 3 Lean processes
lake build                                                     # everything else
lake env lean scripts/AxiomsCheck.lean                         # axioms of the library theorems
scripts/check-oai.sh                                           # final theorems with the openai/math half-plane
lake env lean scripts/NegativeControl.lean                     # negative controls
```

Regenerating the data: `python3 scripts/export_f2.py tmp/qrh-tune-out/F2_final.steps.jsonl.gz exports/f2_export.json`,
`python3 scripts/export_r78.py exports/r78_export.json`, then `python3 scripts/gen_lean.py exports/f2_export.json F2 2000`
(and `R78`). Input hashes (sha256): F2 dump (decompressed) `1c546f5c…0cfb`; `F2_final.steps.jsonl.gz`
`87665a4c…279c`; X1 `TABLES.json` `93906be0…5b7d`; `PLAN.json` `9a9e860d…0545`; `KERNELS.json` `6c984a8d…77e1`.
`KERNELS.json` and `TABLES_NEW.json` are read from `/tmp/raymond_pr` and `/tmp/b145-A-archive` (not in git).

## Referee pass (2026-10-09)

Independent from-scratch rebuild in a separate copy (`/tmp/qrh-referee-20261009`, fresh LeanCert clone at
`7f91b6eb`, ≤ 4 Lean processes, peak 10.8 GB total RSS): all 76 QrhLambda modules including the 61 chunk
certificates, F2 chunks 10–119 s (sum 858 s), R78 chunks 4.5–23 s (sum 648 s), 15.5 min wall. `leanchecker`
replay passed (rc = 0) for all 14 non-chunk modules, all 61 chunk modules, `RaymondCore.Substitution` and the
74 LeanCert closure modules. Axiom audit identical to `axioms-output.txt`. Independent Python replay of the
`Checker.lean` semantics from `Data/F2.lean` reproduces U and the S1 margin 1.8082e-8; 0 mismatches against the
F2 dump over all 59,439 substeps; 0 provenance failures over 468 + 476 floor entries. Consistency:
`RaymondChainHyps` follows from RH (referee proof `raymondChainHyps_of_RH`), so the hypotheses are not
contradictory unless RH is false. Corrections applied: E6 / alternate-log naming separated;
`deBruijnNewmanUpper` renamed `deBruijnNewmanLambda` (it is `Λ` itself); run counts stated as above; the
openai/math status and the mixed certification of the floor sources stated explicitly.
