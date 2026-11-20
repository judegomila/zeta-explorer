# c13-repair-map-engine-battery-records: map rows, control UNIV, device entries, corrected battery records, D1 rerun

Round 13, repair lane. Date 2026-11-19. Nothing here is a statement about zeros of zeta, no bound moves, no attack is made.
Labels: MEASURED (numerics; "ball" added where python-flint ball arithmetic encloses the value), RECORD (bookkeeping edit).
All runs local through `scripts/memcap.sh 8` with `.venv-arb/bin/python` (python-flint 0.9.0, mpmath 1.3.0, numpy 2.5.3);
longest run 123 s. **The compute server was not contacted; no rhrun unit was started.**

## 0. Verdict

**Partial result (record lane). The decisive check passes: battery replay D1 gives 20 of 20 registered numbers against the
corrected record (19 of 20 against the original record, reproduced with the same script). With the four other replays as left by
`c12-control-battery-harness` (not rerun here) the registered threshold reads 20 of 20 numbers in D1 and 5 of 5 verdicts.**

Count as found, with its limits:

| replay | registered numbers | verdict | run by |
|---|---|---|---|
| D1 de Branges shift positivity, original record | 19 of 20 | MISMATCH (one number) | this lane, `d1_corrected.py` on `before/screen.json` (same as c12) |
| D1, corrected record | **20 of 20** | reproduced | this lane, `d1_corrected.py` on `records_corrected/screen.corrected.json` |
| D2 Pick orders | 18 of 18 | reproduced | c12 (`tables/device_D2.json`), not rerun |
| D3 Lemma B for DH | 48 of 48 at the record's step size | reproduced | c12, not rerun; the recorded residual is not the converged one (map row P43 corrected) |
| D4 central-value square | 18 of 18 plan checks (no recorded numbers) | reproduced | c12, not rerun |
| D5 Landau step with DEL | 22 of 22 | reproduced | c12, not rerun |

"Partial" because: the corrected files live in this lane's directory (the c11 and c12 directories are outside the write set, so
their `screen.json`, zero table and manifest are unchanged); the map rows rest on one independent referee each; nothing was
proved.

## 1. Plan

In the order of the assignment, with the decisive check first in time: (4) corrected records and D1; then (1) map rows,
(2) control UNIV, (3) device entries, (5) engine and scoreboard reruns. A copy of every file edited outside this directory was
taken first (`before/`). Read before starting: BRIEF.md to the end, STRATEGY v3 section 1, ROUND_LOG round-12 results and
"owed to the repair slot", round-13 allocation, MAP_PENDING, ENGINE_LOG tail, the map's controls section and rows P43, P53, Z11,
Z12, G16, G21, Q28, D1 to D7, and for each round-12 lane its RESULT.md, proposed row and the independent referee pass in its
REFEREE.md.

## 2. Work

### 2.1 Corrected record of the c11-rs3 numeric screen (ball arithmetic)

`screen_ball.py` recomputes every window of `c11-rs3-debranges-positivity-family/screen.py` at 320 bits. It shares no code with
the battery: its own scan at the record's step with ball-certified signs, Newton on midpoints, then a certified sign change in
[t - 1e-45, t + 1e-45] for every ordinate; DH in the record's character form (two L-functions mod 5), not the coefficient form
of `battery/core.py`. Output `records_corrected/screen.corrected.json` (same structure as `screen.json`, plus the ordinates and
the enclosing ball of each minimum). 37 s.

Cause of the defect (located by c12, confirmed here): `mpmath.findroot` stops on the absolute size of the function, and the
completed functions are of size 1e-68 at t = 200, 1e-340 at 1000, 1e-3411 at 1e4. The gamma-only windows have the same defect
at every height; c12 had not rerun them.

| object, window | zeros | fail counts h = 0.1, 0.25, 0.5, 1, 2, 4 (record -> corrected) | minima changed (of 6) | largest change |
|---|---|---|---|---|
| zeta, zeros 1-100; 620-680; 10112-10172 | 100; 61; 61 | unchanged | 0; 0; 0 | 0 (identical float values) |
| DH, 1 < t < 200 | 122 | unchanged (0, 0, 0, 2, 54, 122) | 1 (h = 2: -0.92982 -> -0.92848) | 1.3e-3 |
| DH, 1000 < t < 1020 | 17 | unchanged (0, 0, 0, 3, 10, 16) | 6 (h = 1: -0.33481 -> -0.33053) | 1.3e-2 |
| DH, 10000 < t < 10008 | 11 | unchanged (0, 0, 0, 2, 5, 10) | 6 (h = 1: -0.62891 -> -0.62816) | 1.1e-3 |
| gamma-only, 10 < t < 200 | 79 | unchanged (0, 0, 0, 0, 0, 79) | 6 (h = 2: 0.0096 -> 0.0226) | 1.3e-2 |
| gamma-only, 1000 < t < 1040 | 32 | h = 2: **12 -> 0** | 6 (h = 2: -0.00066 -> +0.00433) | 5.0e-3 |
| gamma-only, 10000 < t < 10030 | 35 | h = 2: **31 -> 0** | 6 (h = 2: -0.00137 -> +0.00045) | 1.8e-3 |

Totals: 31 of 54 minima change; 2 of 54 fail counts change; no zero count changes; no sign undecided; the Conrey-Li values
(3.2) and (3.4) agree with the record to 27 digits. The two changed fail counts are at the boundary shift h = 2 of the
gamma-only fake, where the value tends to 0 from above; the c11 text "passes (N2_h) for h < 2; boundary at h = 2" stands, and
its table entries "12" and "31" were artefacts of the ordinates. No verdict of c11 or c12 changes. The two DH off-line points
of the record are refined to 40 digits (Newton residual below 1e-92).

### 2.2 HEAT tau = -0.5 off-line list between 500 and 2000

Second method, independent of the Gauss-Legendre quadrature of the battery: F_tau(z) = E[F_0(z + iY)], Y ~ N(0, abs(tau)/2),
F_0(z) = xi(1/2 + z)/2 (the factor e^{tau u^2/16} is the characteristic function of Y at u/2).

1. `heat_grid.py`: F_0(X + it) e^{pi t/4} on the lattice X = 0, 0.05, ..., 3; t from -7.9875 to 2008 in steps of 0.025, computed
   in 128-bit balls and stored in complex128 (61 x 80640 values, 78.7 MB planned and printed; 97 s on 6 processes). The array
   was deleted after use (regenerate with the script).
2. `heat_fill_a.py` (float64 screen): discrete convolution with the Gaussian; on-line sign changes; three-sided box counts
   N(a, b) = (1/pi)(arg change along bottom, right side X = 3, top), which equals on-line + 2 pairs in the box by the two
   symmetries of F; 399 boxes of height about 5 between t = 8.0125 and 1999.2375, cuts chosen where the horizontal phase steps
   are smallest (largest phase step on any contour 0.112 rad; largest distance of a box count from an integer 2.4e-12);
   winding numbers of the lattice cells with X >= 0.05.
3. `heat_fill_b.py`: Newton in 192-bit balls on the trapezoid form of the convolution (step 0.05, 301 terms) from every cell
   with non-zero winding and from the table pairs with Re z < 0.05.

| quantity | tau = -0.5 | tau = -0.1 (control of the method) |
|---|---|---|
| on-line sign changes below 2000 (table) | 929 (929) | 1435 (1435) |
| boxes with count != on-line + 2 table pairs | 17, each short by 2 | 0 |
| table pairs recovered by the second method | 277 of 277, largest difference 4.9e-29 | 41 of 41, 5.0e-29 |
| new pairs | **17** | 0 |
| pairs after the fill | **294** | 41 |
| boxes with count != on-line + 2 pairs after the fill | 0 of 399 | 0 of 399 |
| count | 929 + 2 x 294 = 1517 = zeta_nzeros(2000) | 1435 + 2 x 41 = 1517 |

The 17 new pairs (Re z, Im z; s = 1/2 + z): 0.5719 + 947.1378i; 0.6232 + 1083.5236i; 0.2837 + 1118.7290i; 0.4996 + 1157.6948i;
0.5101 + 1209.1356i; 0.6252 + 1290.3458i; 0.6248 + 1329.3510i; 0.5007 + 1347.9962i; 0.5494 + 1403.0930i; 0.2654 + 1427.0065i;
0.3480 + 1490.1833i; 0.5319 + 1571.1851i; 0.6264 + 1610.2813i; 0.3555 + 1696.9929i; 0.6706 + 1735.8118i; 0.6601 + 1919.3080i;
0.3453 + 1946.2322i (34 digits in the file). By band (0-250, 250-500, 500-1000, 1000-1500, 1500-2000): table 6, 17, 67, 83, 104;
corrected 6, 17, 68, 93, 110. Largest Re z: 0.6706 (table: 0.6323). Each new pair was then evaluated with the battery's own
quadrature (`heatlib.py`, 1406 to 2605 bits): Newton residual at most 4.5e-31 (`ref_checks.json`).
Output: `records_corrected/zeros_HEAT--0.5.corrected.json` (the table with the 17 pairs inserted, field `third_pass`,
`count_diagnostic` 0).

Status: MEASURED. The winding numbers are float64 phases on a lattice, the trapezoid and tail errors (below 1e-40 relative)
are not enclosed, and a pair with Re z > 3 would lie outside every contour. The balance with the zeta count is consistent with
none being there; it is not a certificate.

### 2.3 Battery check D1 against the corrected record (decisive check)

`d1_corrected.py` is `devices/d1_debranges.py` of c12 with one change: the recorded numbers are read from a record file instead
of being typed into the script. Same 20 checks, order and tolerances; same battery inputs (`tables/zeros_ZETA.json`,
`tables/zeros_DH.json`, `battery/core.py`, 200 bits).

- original record (`before/screen.json`): 19 of 20; the failing check is "DH_t1000_1020 min q_1, abs 1e-9" (-0.33053338578645175
  against -0.3348103021277858), as in c12. Extension, not registered: 17 of 24 minima of the four replayed windows within 1e-9.
- corrected record: **20 of 20**; extension 24 of 24. Logs `logs/d1_original_record.log`, `logs/d1_corrected_record.log`;
  outputs `device_D1.original_record.json`, `device_D1.corrected_record.json`.

The agreement is between two zero finders (battery: sign changes of the Hardy-type real function at step 0.01, refined; record:
scan at the record's step, certified sign changes) and two forms of the DH function, both on Arb's Hurwitz zeta. A third code,
mpmath at 40 digits, gives the same minima at the corrected ordinates in the windows the battery cannot replay (`ref_checks.json`). Ordinate by ordinate, the corrected record and the battery table agree to 5.0e-30 (122 zeros below 200) and 5.0e-29 (17 zeros near 1000), the print precision of the table (`ordinate_compare.py`).

### 2.4 Map (`push/OBSTRUCTION_MAP.md`, 186 -> 191 rows; script `apply_map.py`)

| item | edit |
|---|---|
| lane 1, Bost-Connes | row D8 (section 3.9), worded after the independent referee: product-measure statement only for the Galois-invariant KMS state (E1); T-NR as Tr(D e^{-beta H}) with a fixed positive D, principle "multiplication of the state by a positive element" (E3); range of c (E4); sign-reversed kernel positivity in the strip recorded as carrying no zero information; open cell: other states. Note on T-NR in section 2 |
| lane 2, depth aspect | row Z35: "termwise exchange", thresholds t_r, even / odd k, referee items G1 to G6; open cell: non-termwise transfer |
| lane 3, UNIV and cone | row P54 (filter, three classes, scope list, 1 / 4 / 2 / 27 of 34 devices) and row Q29 (candidate (CW) on K_F; c < 2.1213; "other F-adapted cones not covered"); note UNIV in section 2 |
| lane 4, X_0(4) oval | row G33: four closed forms, the module argument of referee E2, open cell: non-linear, non-second-moment functional of unsummed complex points |
| lane 7, Xu-Sang | row Z11 (count option 0.614839 against 0.590332; exact identity; spike case E2) and row Z12 (z = 1 against M1 z < 3/8, corrected from 1/2, and M2 z < 3/13) |
| P43 figure | "relative error at most 5.4e-12" replaced: about 2.2e-11 at a converged quadrature step; 5.4e-12 belongs to step 0.002 |
| P53 | corrected record of the screen; failures at h = 1/2 at zeros 922, 996, 1308, 1496 in place of "none found below 1e4"; the two open cells run by `c12-heat-tied-family-open-cell` |
| section 2 | battery note (objects, DH and HEAT counts, D1 20 of 20) |
| section 7 | seven rows (c11 screen; P43 figure; HEAT table; Bost-Connes; depth aspect; UNIV / cone; Xu-Sang and oval) |

### 2.5 Engine

- `curated/controls.json`: control `UNIV`, status `relative to joint universality`, field `scope` (decides 1 device, part of 4,
  restates 2, out of scope for 27), class-N sentence as narrowed by the referee.
- `curated/mk_devices.py` (script `patch_devices.py`): `bost-connes-crossed-product-positivity`, `depth-aspect-height-transfer`,
  `x04-oval-hecke-fricke-loading`, state closed, each citing the independent referee pass in the lane's REFEREE.md, its map row
  and its open cell; no node. Evidence of `regular-rep-matrix-bridge` and `de-branges-positivity-family` extended. No entry for
  a round-13 lane.
- Reruns through `scripts/memcap.sh 8`: `curated/mk_devices.py`, `build_graph.py`, `generate.py --top 60`, `campaign/scoreboard.py`.

| quantity | before | after |
|---|---|---|
| device types closed / floored / open | 36 / 1 / 0 | 39 / 1 / 0 |
| map rows parsed | 222 | 227 |
| controls | 17 | 18 |
| nodes (live) | 1,665 (963) | 1,671 (963) |
| edges | 8,922 | 8,937 |
| control-defeats edges | 770 | 783 |
| crossing pool | 6 | 6 |
| generated / scored / rejected | 36,558 / 8,437 / 28,121 | unchanged |
| top 60 | | 59 unchanged; rank 57 swaps one member at equal score |
| scoreboard headline | 1 of 4 | 1 of 4 |

Full table and reading in `engine/ENGINE_LOG.md` ("Round 13 repair slot"); status in `campaign/MAP_PENDING.md`.

## 3. Controls

No attack is made, so there is no control table of the lane's own. Control content of the record work:

- DH is the object of the D1 replay: with converged ordinates it fails (N2_1) on its on-line zeros with the same counts as recorded
  (2 of 122, 3 of 17, 2 of 11); the gamma-only fake passes (N2_h) for h <= 2 in all three windows (0 failures at h = 2).
- HEAT tau = -0.5 has 294 off-line pairs below 2000 (was 277 on file); tau = -0.1 serves as the control of the counting method
  (0 boxes out of balance, 41 of 41 pairs recovered).
- UNIV enters the engine as a filter with a stated scope; it is not a function with zeros off the line and it decides 1 device.
- T-NR and E_a pass every step of the three devices entered as closed (rows D8, G33, Q29); in row Z35 nothing is separated.

## 4. Requirement flags

- R1 false. No inequality and no use of multiplicativity; record lane.
- R2 false. No conclusion about zeta; the tables stop at height 2000 (1e4 for three windows).
- R3 false. No argument to be failed by a control.
- R4 not addressed (repair lane).

## 5. Three weakest steps

1. **The HEAT completion is measured.** The count is closed by float64 winding numbers on a lattice and by agreement with the
   zeta count; the contours stop at Re z = 3 and the quadrature errors of both methods are estimated, not enclosed. "Complete
   below 2000" means: every one of 399 boxes balances, by two methods that agree on 294 pairs to 30 digits.
2. **The D1 pass is a pass against a record this lane wrote.** Independence rests on a different zero finder and a different
   form of DH; both use Arb's Hurwitz zeta, and the 20 registered checks cover two DH windows (the 1e4 window and the gamma-only
   windows are outside the battery and are confirmed only by mpmath at 40 digits). D2 to D5 were not rerun; D3's 48 of 48 holds
   at the record's step size only, and D4 has no recorded numbers (c12 weakest step 1 stands).
3. **The map rows and device entries rest on one independent referee pass each**, and were worded by this lane from the lane
   texts and those referee files without re-deriving the mathematics. The UNIV device codes (1 / 4 / 2 / 27) are ARGUED
   one-line readings that no referee checked against the device lanes. The second referees are owed by
   `c13-referee-r12-independent`; a row may need rewording when they report.

Own errors made and corrected in this lane: (i) `arb(0.1)` (binary float) used for tau = -0.1 in the first refinement run,
giving a spurious 8.5e-17 disagreement with the table; fixed by passing the decimal string, rerun; tau = -0.5 is exact in binary
and was not affected. (ii) A quotation mark inside an evidence string broke `mk_devices.py` in the first engine rerun; fixed
and rerun (first log kept). (iii) The corrected HEAT file first carried a wrong upper cut (2000.34 for 1999.2375); fixed.

## 6. Files

In `tmp/research-2026-11-16/push/c13-repair-map-engine-battery-records/`:
`RESULT.md`, `REFEREE.md`, `lanes.jsonl`; `records_corrected/screen.corrected.json`, `records_corrected/zeros_HEAT--0.5.corrected.json`;
`screen_ball.py`, `d1_corrected.py`, `device_D1.original_record.json`, `device_D1.corrected_record.json`;
`heat_grid.py`, `heat_fill_a.py`, `heat_fill_b.py`, `heat_a_*.json`, `heat_b_*.json`, `chk01.py`; `ref_checks.py`, `ref_checks.json`, `ordinate_compare.py`;
`apply_map.py`, `patch_devices.py`, `engine_counts.py`, `engine_counts_before.json`, `engine_counts_after.json`,
`engine_rerun.log`, `engine_rerun.failed-syntax.log`, `scoreboard_rerun.log`; `logs/`; `before/` (map, controls, mk_devices,
devices, ENGINE_LOG, CANDIDATES, SCOREBOARD, scoreboard.json, MAP_PENDING, the two record files as found).

Edited outside this directory: `push/OBSTRUCTION_MAP.md`; `engine/curated/controls.json`, `engine/curated/mk_devices.py`,
`engine/curated/devices.json` (generated); `engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json` (generated);
`engine/ENGINE_LOG.md`; `engine/scratch/*.pre-c13-repair.*` (copies); `campaign/MAP_PENDING.md`; `campaign/SCOREBOARD.md`,
`campaign/scoreboard.json` (generated). Not edited: `engine/outcomes/`, `campaign/ROUND_LOG.md`, `campaign/lanes.jsonl`.
