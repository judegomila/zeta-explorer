# Exact parameters

Every theorem input below is an exact rational or integer. Decimals are either
exact terminating expansions of the stated rationals or are marked as
rounded summaries. The source of each number is given in the last column or
in the paragraph above the table; paths are relative to the repository root.

Status: the values in this file depend on the inputs (H1)–(H4) listed in
`DEPENDENCIES.md`; two of them are unrefereed and none of the values is peer reviewed.
The accepted peer-reviewed bound is Platt–Trudgian's `Λ ≤ 0.2`. RH is open.

## 1. Fixed data of Raymond's chain

| item | exact value | decimal | source |
|---|---|---|---|
| head abscissa `X` | `6000000185827` | exact | Raymond AF §1; `tmp/s145-1-g1/data/PLAN.json` |
| Riemann–Siegel index `N0` | `690988` | exact | Raymond AF §1 |
| ordinate consumed from Platt–Trudgian | `(X+1)/2 = 3000000092914` | exact | Raymond AF §2 |
| Platt–Trudgian height `T_PT` | `3000175332800` | exact | Platt–Trudgian Theorem 1 |
| clearance `T_PT − (X+1)/2` | `175239886` | exact | Raymond AF §2; review A §9 |
| cell width | `1/4000` | 0.00025 | `PLAN.json` (`step`) |
| number of cells | `608` (cells `[i/4000,(i+1)/4000]`, `0 ≤ i ≤ 607`) | covers `[0, 19/125]` | Raymond AF §1 |
| substeps per cell | `128` | — | review B §8 |
| substep `δ` | `1/512000` | 0.000001953125 | review B §8 |
| strict-entry time | `10⁻⁸` | exact | Raymond AF §11 |
| terminal level `q_e` | `10⁻⁸` | exact | Raymond AF §1 |
| wall horizon | `41/250` | 0.164 | Raymond AF §2 (wall), §12 |
| stored-value rounding | upward to a multiple of `2⁻⁹⁶` | — | Raymond AF §12 |
| exponential bound | `exp(−x) ≤ T₁₈(x)`, the degree-18 Taylor partial sum, `0 ≤ x < 1` | — | Raymond AF §12 |
| terminal log bound (primary) | alternating Taylor sum of `log(1+z)` through degree 11, `0 < z < 1` | — | Raymond AF §12 |
| terminal log bound (alternate) | `log(1+z) ≤ z − z²/(2(1+z))` | — | Raymond AF §12 |
| terminal rounding | `U = ceil_{10⁻¹⁵}(t_K + τ + q_e/2)` | — | Raymond AF §12 |
| plan heights | rationals in `[0.69, 2.18]`, starting at `109/50` | — | `PLAN.json` |

Raymond's classical start is `q0 = (1000001/1000000)² = 1000002000001/10¹²`.

Kernel numbering: "catalogue kernel j" is the row with index j, counted from 0, in
the order of Raymond's `data/KERNELS.json` (local copy
`tmp/oai-lambda-out/KERNELS_raymond_backup.json`); AF §10 does not number the rows.
Kernel 4 is `(r, λ, ρ) = (23/40, 199/100, 7/20)`, kernel 5 is `(3/5, 199/100, 1/5)`.

## 2. Starts and strict entry

The strict-entry inequality (S1) is

```
q0 − (2 + c0·q0)·10⁻⁸ > (2θ − 1)²,
```

where `c0` is the rate selected on the first substep.

| run | θ | bound `(2θ−1)²` | start `q0` | first-substep rate `c0` | S1 margin (exact) | S1 margin (decimal) |
|---|---|---|---|---|---|---|
| value (ii), re-tuned route P (F2) | 7/8 | 9/16 | `5625001/10⁷ = 9/16 + 10⁻⁷` | `41336831094003950997/3755300000000000000` ≈ 11.007598 | `67904283759396681637924003/(37553·10²⁹)` | 1.8082252751949694·10⁻⁸ |
| value (i), Raymond's chain | 7/8 | 9/16 | `281251/500000 = 9/16 + 2·10⁻⁶` | `12113002361358409/1188100000000000` ≈ 10.195272 | `114215105972865586110341/(59405·10²⁴)` | 1.922651·10⁻⁶ |
| Raymond's chain | 11/12 | 25/36 | `3125009/4500000 = 25/36 + 2·10⁻⁶` | ≈ 10.152594 (sharp mode) | — | 1.909496·10⁻⁶ |
| Raymond's chain (control) | 1 | 1 | `1000002000001/10¹²` | ≈ 10.073292 (kernel 8) | — | 1.879268·10⁻⁶ |

Sources: F2 rate and margin `tmp/qrh-tune-out/F2_final_verify.json` (`first_rate`,
`strict_entry_margin`) and the exact margin recomputed in
`src/data/qrh-path-push-2026-10-08.js` (assertion `qrh-strict-entry`). Value (i):
margin from `formalization/paper/raymond-g0-review-b-2026-10-08.md` §5; the exact
`c0` above was recomputed for this package from Raymond's formula
`c = (2λ/h)(ℓ − cap/h)` with kernel 4 (`r = 23/40`, `λ = 199/100`, `ρ = 7/20`,
global cap `1503067131/10⁹`, `tmp/oai-lambda-out/KERNELS_raymond_backup.json`),
`h = 109/50` and the cell-0 joint floor `ℓ = 627382516099/10¹¹`
(`tmp/s145-1-g1/out/X1/TABLES.json`, row 0, `r_23_40`, `both`); it reproduces the
recorded margin exactly. At the start `v0 = q0/h² = 0.118362 ≤ ρ² = 0.1225`.
11/12 and control rows: review B §5 table.

S1 holds exactly when `c0 < ((q0 − 9/16)/10⁻⁸ − 2)/q0`. For value (ii) this threshold
is `80000000/5625001 ≈ 14.2222` (selected `c0 ≈ 11.0076`); for value (i) it is
`99000000/281251 ≈ 351.9987` (selected `c0 ≈ 10.1953`; review B §5 records "fails
only if `c0 > 352`").

## 3. The two values

| quantity | value (i): Raymond's chain, 7/8 start | value (ii): re-tuned route P (F2), 7/8 start |
|---|---|---|
| `U` (exact) | `118505710922701/10¹⁵` | `116091488672439/10¹⁵` |
| `U` (decimal, exact) | 0.118505710922701 | 0.116091488672439 |
| substeps | 60,675 | 59,439 |
| terminal substep `k` (index within its cell, from 0) | 60,674 (cell 474, index 2) | 59,438 (cell 464, index 46) |
| terminal start time `t_K` | `30337/256000` | `29719/256000` |
| `U − t_K` | 1.804672701·10⁻⁶ | 1.644922439·10⁻⁶ |
| terminal `τ/δ` | 0.9214 | — (inside the substep; Lean frame check `lag ≤ δ`) |
| kernels used (substeps) | catalogue kernel 4 (`r = 23/40`, `λ = 199/100`, `ρ = 7/20`): 51,614; kernel 5 (`r = 3/5`, `λ = 199/100`, `ρ = 1/5`): 9,061 | 59 kernel rows: 50 of the 79 new `r = 3/5` rows, 6 route-3 rows, catalogue kernels 4, 8, 10 |
| sharp-law (Raymond AF Part II) substeps | 0 | 0 |
| q-window substeps | 0 | 0 |
| floor entries used | 476 (Raymond's X1 tables at plan heights, modes `r = 23/40`, `r = 3/5`) | 468 (see §5) |
| probe heights used | `[0.89, 2.18]` | `[91/100, 47/25]` |
| alternate-log terminal value | `59252855461351/(5·10¹⁴)` = 0.118505710922702 | equal to `U` (`U_robust = U`) |
| failures in the run's checks | 0 | 0 (E1–E8, S1, generator agreement, F-X) |

Sources: value (i) `tmp/oai-lambda-out/raymond_X1.json`, review B §§6–7,
`src/data/openai-math-integration-2026-10-08.js`; value (ii)
`tmp/qrh-tune-out/F2_final.json`, `tmp/qrh-tune-out/F2_final_verify.json`,
`src/data/qrh-path-push-2026-10-08.js`; floor and kernel counts
`formalization/lean/qrh-lambda/README.md`.

Two checks were re-run for this package on 2026-10-09:

* value (i): `tmp/oai-lambda-raymond.py OUT X1 --thetas 7/8` (33.9 s wall) returned
  `U = 118505710922701/10¹⁵`, 60,675 substeps, last row 474;
* value (ii): the from-scratch step verifier `tmp/qrh-ref-verify.py` (no code shared
  with the consumer) on the archived per-substep dump
  `/tmp/qrh-tune-dump-F2_final.steps.jsonl` (sha256
  `1c546f5c2c79b52b7bd93b7ef101ca798c6a1dcf18225482e8a1a60f71fc0cfb`, the same
  hash the Lean exporter records) returned `U = U_robust = 116091488672439/10¹⁵`,
  59,439 substeps, terminal cell 464, S1 margin 1.8082252751949694·10⁻⁸, and an
  empty failure list (38 s wall).

Differences (exact):

| difference | exact | decimal |
|---|---|---|
| value (i) − value (ii) | `1207111125131/(5·10¹⁴)` | 0.002414222250262 |
| Raymond classical start − value (i) | `30889362904987/10¹⁵` | 0.030889362904987 |
| `0.2 −` value (ii) | — | 0.083908511327561 |
| `0.2 −` value (i) | — | 0.081494289077299 |

## 4. The re-tuning ladder for value (ii)

One exact run per rung. The final value is computed by its own run; it is not the
sum of the steps. Source: `src/data/qrh-path-push-2026-10-08.js` (`values`,
`ladder`; assertion `qrh-ladder-exact`).

| rung | change | value (exact) | value (decimal) | step (exact) |
|---|---|---|---|---|
| baseline | first route-P run on the 7/8 path, start offset `2·10⁻⁶` | `58854156705477/(5·10¹⁴)` | 0.117708313410954 | — |
| E1 | start offset `2·10⁻⁶ → 10⁻⁷` | `58854068553651/(5·10¹⁴)` | 0.117708137107302 | `−44075913/(2.5·10¹⁴)` |
| E2 | existing height tables m097, m094, m091 (0.97, 0.94, 0.91 × plan heights) and W4 (a per-cell plan, piecewise-linear multiplier of the plan with knot values 0.928–1.067; `src/data/route-9-barrier-height-schedule-2026-10-08.js`) with `r = 3/5`, `λ < 2` kernels | `23462447352327/(2·10¹⁴)` | 0.117312236761635 | `−395900345667/10¹⁵` |
| E3 | new height sets QA (0.88 × plan, cells 0–140) and QB (0.91 × plan, cells 0–199) | `116174796162911/10¹⁵` | 0.116174796162911 | `−284360149681/(2.5·10¹⁴)` |
| E4 | per-cell height set QC at the producer moment-cap limit (0.860–0.903 × plan, cells 0–250) | `116110902986179/10¹⁵` | 0.116110902986179 | `−15973294183/(2.5·10¹⁴)` |
| F1 | 79 new `r = 3/5` two-point kernels on the height-table options | `116091900099009/10¹⁵` | 0.116091900099009 | `−1900288717/10¹⁴` |
| F2 | the same kernels on the route-3 joint modes | `116091488672439/10¹⁵` | 0.116091488672439 | `−41142657/10¹⁴` |
| total | | | | `−323364947703/(2·10¹⁴)` = −1.616824738515·10⁻³ |

Attribution of the total (referee correction R1 in the source module): heights
(E3 + E4) `−37541680483/31250000000000` = −1.201333775456·10⁻³ (74.3%), of which
the QA/QB uniform sets −1.137·10⁻³ (70.4%) and the QC per-cell set −6.39·10⁻⁵
(4.0%); existing height tables (E2) 24.5%; new kernels (F1 + F2) 1.2%; start
offset (E1) 0.01%.

## 5. Value (ii): substep provenance and table entries

Substep partition by floor source (`tmp/qrh-tune-out/F2_final_verify.json`,
`provenance`):

| floor source | substeps |
|---|---|
| Track-A joint floors at re-tuned heights ("X options") | 36,923 |
| r2 structured floors (catalogue options, `κ = 0.94` and `κ = 1`) | 11,304 |
| route-3 joint floors (P-modes, Theorem MP) | 11,212 |
| total | 59,439 |

X options by height set: QC_cliff 21,504; m091 5,120; W4 4,027; QB_m0.91 2,816;
QA_m0.88 1,664; m094 1,536; m097 256 (sum 36,923). The 79 new kernels are used on
37,342 substeps.

Floor entries of the F2 table (`formalization/lean/qrh-lambda/README.md`):

| source | entries |
|---|---|
| X options: QC_cliff 168, m091 40, W4 32, QB_m0.91 22, QA_m0.88 13, m094 12, m097 2 | 289 |
| route-3 P-modes: P_27_40 50, P_3_5 25, P_13_20 11, P_5_8 3, P_51_80 1 | 90 |
| r2 structured floors: `κ = 0.94` 70, `κ = 1` 19 | 89 |
| total | 468 |

New kernels: `r = 3/5`, `ρ` on the grid `81/400, 82/400, …, 171/400` (91 points,
of which 79 new and 12 existing), `λ = floor_{1/5000}(scout value) − 1/5000`, exact
Bernstein certificates at subdivision depth 22. Source:
`src/data/qrh-path-push-2026-10-08.js` (`newKernels`).

Heights used by value (ii) lie in `[91/100, 47/25]`. Height schedule relative to
the plan (measured description of the chosen options, not an input): × 0.870 in
cells 0–140, × 0.904 in cells 141–250, × 0.951 in cells 251–330, × 0.988 in cells
331–464.

Per-row premises rechecked on every (cell, height, source) triple used by value
(ii) (`tmp/qrh-recheck-out/premises.json`; 256-bit Arb; 468 triples, 466
(cell, height) pairs, 0 failures):

| premise | extreme | location |
|---|---|---|
| `k = t_L·v0/2 − (1 − h)/2 > 0` (`t_L` = left end of the cell, `v0 = log N0 = 13.4459`) | min 0.4391807347170579 | cell 1, `h = 15/8`, QC_cliff `r = 3/5` |
| `h·v0 > 2` (here `v0 = log N0`) | min 12.235748740181311 | cell 464, `h = 91/100`, route-3 P_27_40 |
| (5.4) `e_AB + e_C^broad + e_pair < 10⁻⁶` | max sum 1.4993898449779916·10⁻⁷ | cell 319, `h = 2773/2500`, r2 `κ = 0.94` |
| (5.1) | min margin 0.06767719630504193 | cell 319, `h = 2773/2500` |

## 6. 11/12 values

The 11/12 half-plane follows from the 7/8 half-plane. It is also the subject of a
separate openai/math write-up (5 October 2026, "alternate 11/12 proof").

| quantity | exact | decimal | substeps | end cell | source |
|---|---|---|---|---|---|
| de Bruijn value from the 11/12 half-plane alone | `25/72` | 0.347222… | — | — | `openai-math-integration-2026-10-08.js` |
| Raymond's chain, `q0 = 25/36 + 2·10⁻⁶` | `2028538107271/15625000000000` | 0.129826438865344 | 66,472 | 519 | `tmp/oai-lambda-out/raymond_X1.json` |
| route P, single band, not re-tuned, `q0 = 3125009/4500000` | `128829131217197/10¹⁵` | 0.128829131217197 | 65,961 | 515 | `tmp/oai-lambda-out/routeP_t1112.json`; verifier `tmp/oai-lambda-ref-out/routeP_t1112_verify.json` (0 failures, S1 margin 1.9087544545897395·10⁻⁶) |

The Raymond 11/12 run uses the AF Part II sharp mode on part of its path; value (i)
does not.

## 7. Ladder of values at the Platt–Trudgian height

| chain and start | exact | decimal | conditions |
|---|---|---|---|
| de Bruijn from the 7/8 half-plane alone | `9/32` | 0.281250000000000 | (H1) only |
| Raymond's chain, classical start (his result) | `18674384228461/125000000000000` | 0.149395073827688 | (H2), (H3) |
| route P, single band, classical start (reference run) | `5930005871003/40000000000000` | 0.148250146775075 | (H2), (H3), route-P ledger |
| Raymond's chain, 11/12 start | `2028538107271/15625000000000` | 0.129826438865344 | 11/12 half-plane, (H2), (H3) |
| route P, 11/12 start, not re-tuned | `128829131217197/10¹⁵` | 0.128829131217197 | 11/12 half-plane, (H2), (H3), route-P ledger |
| **value (i)**: Raymond's chain, 7/8 start | `118505710922701/10¹⁵` | **0.118505710922701** | (H1), (H2), (H3) |
| route P, 7/8 start, first run | `58854156705477/(5·10¹⁴)` | 0.117708313410954 | (H1)–(H4) (earlier ledger) |
| **value (ii)**: route P re-tuned, 7/8 start | `116091488672439/10¹⁵` | **0.116091488672439** | (H1)–(H4) |

Raymond's stated value is `Λ < 0.149396` (Zenodo 10.5281/zenodo.22867547).

## 8. Λ(θ) at the Platt–Trudgian height

Every θ other than 7/8 is hypothetical. Raymond's chain with
`q0 = (2θ − 1)² + 2·10⁻⁶`; route P (F2 configuration) with
`q0 = (2θ − 1)² + 10⁻⁷`. "Share" is `1 − 2U/q0`, the part of the descent carried
by the floor-dependent term of the barrier. "AF II" counts substeps that use
Raymond's AF Part II sharp continuum law. Sources:
`src/data/qrh-theta-and-improvement-2026-10-08.js`,
`tmp/qrh-theta-curve-out/table.json`, `tmp/qrh-theta-curve-out/routeP_t85*.json`,
`tmp/qrh-theta-curve-out/routeP_t80*.json`.

| θ | `(2θ−1)²/2` | Raymond's chain `U` (exact) | decimal | end cell | share | AF II substeps | route P |
|---|---|---|---|---|---|---|---|
| 7/8 | 0.28125 | `118505710922701/10¹⁵` | 0.118505710922701 | 474 | 0.5786 | 0 | 0.116091488672439 |
| 43/50 | 0.2592 | `57083652654079/(5·10¹⁴)` | 0.114167305308158 | 456 | 0.5595 | 124 | — |
| 17/20 | 0.245 | `55588925440021/(5·10¹⁴)` | 0.111177850880042 | 444 | 0.5462 | 270 | 0.108886356046385 |
| 21/25 | 0.2312 | `6756871713629/62500000000000` | 0.108109947418064 | 432 | 0.5324 | 571 | — |
| 41/50 | 0.2048 | `6358282847349/62500000000000` | 0.101732525557584 | 406 | 0.5033 | 1,944 | — |
| 4/5 | 0.18 | `5938882831221/62500000000000` | 0.095022125299536 | 380 | 0.4721 | 3,078 | 0.093069284680992 |
| 39/50 | 0.1568 | `43991948911187/(5·10¹⁴)` | 0.087983897822374 | 351 | 0.4389 | 2,869 | — |
| 3/4 | 0.125 | `15365087116223/(2·10¹⁴)` | 0.076825435581115 | 307 | 0.3854 | 1,372 | — |
| 7/10 | 0.08 | `28474625469199/(5·10¹⁴)` | 0.056949250938398 | 227 | 0.2881 | 0 | — |
| 13/20 | 0.045 | `18311272879037/(5·10¹⁴)` | 0.036622545758074 | 146 | 0.1862 | 0 | — |
| 3/5 | 0.02 | `1814934587641/10¹⁴` | 0.018149345876410 | 72 | 0.0926 | 0 | — |
| 11/20 | 0.005 | `1219088138853/(2.5·10¹⁴)` | 0.004876352555412 | 19 | 0.0249 | 0 | — |
| 13/25 | 0.0008 | `797732865289/10¹⁵` | 0.000797732865289 | 3 | 0.0041 | 0 | — |
| 101/200 | 0.00005 | `25493347487/(5·10¹⁴)` | 0.000050986694974 | 0 | 0.0003 | 0 | — |

Route-P exact values: θ = 17/20 `21777271209277/(2·10¹⁴)` (55,750 substeps, cell
435, S1 margin 2.597·10⁻⁸); θ = 4/5 `2908415146281/31250000000000` (47,652
substeps, cell 372, S1 margin 4.02·10⁻⁸); both with the step verifier at 0
failures.

At θ = 101/200 the chain value exceeds `(2θ − 1)²/2 = 1/20000` because of the
`2·10⁻⁶` start offset; the de Bruijn value is the better statement there.

Measured observations (same source module): near θ = 7/8 the slope `dU/dθ` is
about 0.289 (0.86–0.875); `Λ < 0.10` at this height needs θ ≈ 0.815 on Raymond's
chain or θ ≈ 0.82 with route P (linear interpolation); with the AF Part II sharp
law disabled, the values at θ ∈ {43/50, 17/20, 4/5, 3/4} rise by at most
2.9·10⁻⁷.

Raymond's chain at 7/8 with unverified heights (measured values, not
bounds, since no RH verification exists at these heights): 10X
0.112235848057212, 100X 0.107056451546934, 1000X 0.102615591280579
(`tmp/oai-lambda-out/summary.json`). At the Platt–Trudgian height, θ = 0.8535
gives 0.112233029447535, just below the 10X value at 7/8.
