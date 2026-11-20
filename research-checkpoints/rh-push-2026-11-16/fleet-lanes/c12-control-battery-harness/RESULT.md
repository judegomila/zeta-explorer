# c12-control-battery-harness: RESULT

Date 2026-11-19. Kind: compute (heavy), meta-harness. Round 12, lane 6.
No statement about zeros of zeta is made. No requirement flag changes (R1 = R2 = R3 = R4 = false). No R4 answer (meta-harness item).
Labels: PROVED / CLASSICAL / MEASURED (numerics; "ball" where the python-flint ball contains the value) / ARGUED / OPEN.

## 0. Verdict

**Partial result. The registered threshold (5 of 5 verdicts, each number within the recorded tolerance) is not met as written: 5 of 5 verdicts are reproduced; 4 of 5 devices reproduce every recorded number; in the fifth (D1) one recorded number of 20 is outside the tolerance, and the cause is located in the record, not in the battery.**

| device | record | verdict reproduced | numbers within tolerance | note |
|---|---|---|---|---|
| D1 de Branges shift positivity | `c11-rs3-debranges-positivity-family/screen.json` | yes | 19 of 20 | zeta fails (N2) at zero 34, h = 1: -5.38910050718294518e-69 (ball, negative); fail counts in all four windows identical. One mismatch: min q_1 on the DH on-line zeros in 1000 < t < 1020 is -0.33053338578645 here, -0.3348103021277858 in the record |
| D2 finite Pick orders | `euler/nest_dh_small.txt`, `nest_z_small.txt` | yes | 18 of 18 | DH and zeta positive definite through order 100 on the nested nodes; all 200 pivot balls positive; the 16 recorded pivots agree to the 3 printed digits |
| D3 Lemma B pole-lattice multipliers, DH form | `c3-lemmab-referee-dh-poisson/dh_form.json` | yes | 48 of 48 | 8 cases; identity relative residual at most 4.63e-12; every term agrees to 1e-9 with the battery's independently computed zero table |
| D4 central-value square | `c11-del-device-read-confirm` section 4 (row G32) | yes (after a repair of the HEAT table, section 3) | no numbers on record (18 of 18 checks of the plan) | the form is real and >= 0 at every grid ordinate for every object defined on Re s = 1/2 (ZETA, DH, EA x 3, TNR: 4001 ordinates each; HEAT: real on the line), and positive at the ordinates of off-line zeros (DH: 84 pairs, minimum 2.0e-6; TNR: 350 pairs, minimum 1.5e-6) |
| D5 P46 Landau step with DEL | `c10-thin-deletion-zero-mode-control/del_b*_m1_X1e+07.json` | yes | 22 of 22 | set sizes exact (16210, 148727); log G_X(b), D(1e7), exponent estimates agree to all printed digits |

The mismatch in D1 is a defect of the record (section 4.1): the DH ordinates used by `screen.py` near t = 1000 were not converged (errors up to 1.7e-3). Re-running the record's own root finder reproduces the recorded number to all 16 digits; with converged ordinates the value is -0.33053. The verdict of that lane is unchanged. By the rule of the assignment the mismatch is reported as a referee item (REFEREE.md, item A1) and nothing is adjusted.

Reading for the allocation rule ("at 5 of 5, explore lanes from round 13 may run stage B inside the round with this battery"): the literal threshold is 4 of 5 with full numbers plus 1 verdict-only. After the two repairs of its first build (section 3; one of them was found by the D4 replay) no replay shows a defect of the battery; the decision is the orchestrator's. The battery found three items against recorded lanes (section 4), which is the use it was built for.

## 1. Plan

`PLAN.md` was written before any battery run and fixes the objects, the grid, the five replays, their numbers and tolerances. One amendment was made before any D5 code ran (the D5 identity tolerance had been set without computing the tail of a 1e7 Dirichlet sum; it is an error of the plan, stated in the file). Decisive test first: D1, D2, D3 and D5 were run locally on the core interface as soon as the zeta and DH zero tables existed, then again on the server; both passes give the same numbers. D4 needs the grid tables and ran on the server.

Deviations from the plan: (i) D2 ran at 3197 bits, not 2900; (ii) HEAT was taken to height 2000 in the first pass (the plan allowed 500); (iii) the DH zero table was computed locally (8 processes under the 8 GB cap, 375 s) and copied to the server, which did not recompute it; (iv) D1 was extended to all zeros below 2000 and a diagnostic of the record's root finder was added; these are reported in section 4 and are not counted in the threshold; (v) in D4 the stage objects are read from the tables with the conjugation rule, without a second evaluation.

New relative to the map: no row; this is infrastructure. Reused (read as text, re-typed, sources named in the code): DH coefficients and the kappa precision rule (`dh-separator/dhf.py`, `euler/dh.py`), T-NR factor (`r3-tnr-control/twin.py`), greedy floor rule (`c10-thin-deletion-zero-mode-control/del_control.py`, `c4-thin-twist-control-78/thinlib.py`), heat quadrature (`c1-missing-controls/heatlib.py`, copied unchanged), the Lemma B formulas (`c3-lemmab-referee-dh-poisson/lib3.py`, `dh_form.py`), the Pick LDL (`euler/nested.py`), the de Branges screen (`c11-rs3-debranges-positivity-family/screen.py`). No repo data module was imported.

## 2. The battery (README.md has the interface)

Objects: ZETA; DH; EA-1/8, EA-1/4, EA-1/2; TNR (q = 3, c = 2.2); U-00..23; SGN-00..23 and SGN-LIOU; THIN-0.9; DEL-0.75, DEL-0.9; HEAT--0.1, HEAT--0.5; WT (T = 1000, k = 1); BEU (generalised primes p + 1/2). For each: coefficients to 1e7 (HEAT: none exist), local parameters, functional-equation data where one exists, values on 13 abscissae x 4001 ordinates, zeros to height 2000 where defined, a non-vanishing check.

Checks made on the battery itself (all MEASURED; numbers in `tables/sanity.json`, `tables/coef_manifest.json`):

| check | result |
|---|---|
| functional equations of ZETA, DH, EA, TNR at a test point (ball) | ratio - 1 inside 1e-35 |
| DH by Hurwitz zeta against python-flint `dirichlet_char.l` | difference inside 1.2e-35 |
| coefficient tables against the value interface, s = 2, 3, 2 + 7i | within the Dirichlet tail in every case (ZETA 1.0e-7 at s = 2; DH 7e-15; U at most 3.9e-11 and SGN at most 7.1e-11 against the Euler product; EA-1/2 1.0e-3 at s = 2, where the tail is of size N^(-1/2) log N) |
| greedy sets against the c10 record | 16210 and 148727 primes (exact); THIN-0.9: 74363 |
| zeta zeros | 1517 below 2000 = `zeta_nzeros(2000)` (Arb) |
| DH zeros | 200 boxes of height 10 on -0.5 <= Re s <= 1.5; winding count 2029 = 1861 on-line + 2 x 84 off-line pairs; every box closed; below 1000: 848 on-line and 28 pairs, the counts of `c2-euler-at-zeros/dh_zeros_1000.json`, ordinates agreeing to 1.2e-13 (that file is float64); largest real part of an off-line zero below 2000: 0.8695 |
| HEAT quadrature at tau = 0 against xi(1/2 + it)/2 | ratio 1 within 3e-30 at t = 499.7 and t = 1999.7 |
| HEAT off-line zero at tau = -0.5 | 0.19810791112610753 + 150.69224610050648 i, the map's value 0.1981079 + 150.6922461 i |
| table spot check, 300 random points per closed table against direct evaluation | relative difference at most 1.4e-32 |
| non-vanishing on Re s = 2 against a proved lower bound | holds for every object with an Euler product or a coefficient bound (16 object groups: ZETA, DH, EA x 3, TNR, WT, SGN-LIOU, THIN, DEL x 2, U x 24, SGN x 24, BEU; HEAT has no such bound and is checked by ball accuracy, at least 225 bits) |

HEAT zero tables (MEASURED; off-line lists not certified complete): 

| tau | on-line zeros below 2000 | off-line pairs found | zeta count - on-line - 2 x pairs | first off-line pair (z = s - 1/2) | largest Re z |
|---|---|---|---|---|---|
| -0.1 | 1435 | 41 | 0 (0 in each of the bands 0-250-500-1000-1500-2000) | 0.0215578686 + 415.2562789641 i (the map's 0.0215579 + 415.2562790 i) | 0.2256 |
| -0.5 | 929 | 277 (240 from local minima on the line, 37 from the gap rule) | 34 (0, 0, 2, 21, 11 in the five bands) | 0.2429565065 + 111.6942276725 i | 0.6323 |

For tau = -0.5 the list balances the zeta count below height 500 (23 pairs) and is short by the equivalent of 17 pairs between 500 and 2000. The map lists one located zero for tau = -0.5 (150.69); the table has six pairs below 250, the first at height 111.69.

## 3. Work on the server

All server work went through `rhrun`; `rhstatus` was read before each launch. Units (all finished; none left running):

| unit | request | what | wall time |
|---|---|---|---|
| `rh-c12-heat-1119104613` | 11 cores, 22 GB | `battery/heat.py tables 2000 0.05 0.5` | 58 min (3506 s) |
| `rh-c12-main-1119104613` | 5 cores, 10 GB | `run_main.sh`: coefficient tables, closed/product/BEU grids, D1, D2, D3, D5, stage grids | 59 min |
| `rh-c12-final-1119114536` | 16 cores, 12 GB | `run_final.sh`: HEAT second pass, derived zeros, sanity, D1 (with failure indices), D1 diagnostic, D4, manifest | 18 min |
| `rh-c12-fix-1119120416` | 16 cores, 24 GB | `run_fix.sh`: HEAT grid again after the exponent fix (below), sanity, D4, manifest | 9 min |
| `rh-c12-stage2-1119121254` | 16 cores, 12 GB | `run_stage2.sh`: stage grids again at 320 bits (below), sanity, D4, manifest | 20 min |

Peak concurrent request: 16 cores, 32 GB (the heavy-lane allowance); the five units ran in three consecutive phases (heat and main together, then final, fix, stage2 one at a time). Planned allocations are printed in the logs (`logs/`); the largest are the four chi^k matrices of the U grid (1.02 GB, shared by fork) and the HEAT weight matrices (26 rows x 48360 nodes x 2605 bits per worker at the top band). Measured memory: main unit 6.8 GB, heat unit not recorded (0.9 GB when sampled in the second band). GPU not used (nothing here is GPU-shaped at the precision required). Local runs (zero tables of ZETA and DH, first pass of D1, D2, D3, D5) went through `scripts/memcap.sh 8`.

Two defects of the first build, found by the lane's own checks and repaired by a rerun (both stated because a harness that hides its repairs cannot be trusted):
- HEAT value tables: the scale exponent was taken from a float, which underflows below 1e-308, so every mantissa above t = 950 was stored as 0. Found by the D4 replay (2 of its 18 checks failed in the first server pass: "form > 0 at every grid ordinate" held at 1929 and 1928 of 4001 ordinates). Fixed (exponent from the ball), grid rebuilt, D4 passes. The HEAT zero tables were not affected (they do not use the stored mantissas).
- Stage tables (THIN, DEL) at 128 bits: complex ball multiplication inflates the radius along a product of 16210 to 148727 factors by up to exp(sum p^-sigma); at Re s = 1/2 and 5/8 the relative radius reached 4e-17 (THIN-0.9), 7e-29 (DEL-0.75) and O(1) (DEL-0.9), on 8 to 15 per cent of the grid points, while the midpoints were correct (they agree with the 320-bit rerun to 1e-32 at every grid point of the three tables). Found by the relative-radius line of the sanity check. Rebuilt at 320 bits.

Two local process incidents, for the record: a first DH zero run used a Newton tolerance below the working precision at heights above 500 (boxes with off-line pairs did not close; found by the box-closure check, fixed, rerun), and one restart left a duplicate local job running for four minutes; it was stopped by its process ids.

## 4. Items found against recorded lanes (not adjusted; REFEREE.md has the detail)

4.1 **D1, `c11-rs3-debranges-positivity-family`: non-converged DH ordinates near t = 1000.** `screen.py` finds on-line zeros of the completed DH function with mpmath `findroot` (solver anderson, default tolerance). Near t = 1000 the completed function is of size 1e-340, so the absolute tolerance is met before convergence. Re-run here (`devices/d1_diagnostic.py`): the 17 ordinates in 1000 < t < 1020 differ from the converged ones by 4.5e-6 to 1.68e-3, each difference equal to the Newton residual X/X' at the record's point. With the record's ordinates min q_1 = -0.3348103021277858 (the recorded value, all digits); with converged ordinates -0.33053338578645175. Fail counts (0, 0, 0, 3, 10, 16) are the same. The record's windows at t = 1e4 (DH and GAM) and the GAM window at 1000 use the same finder and were not re-run here (outside the battery).

4.2 **D1, same lane: failures at h <= 1/2 exist below height 2000.** The record tested three windows and states that no failure at h <= 0.5 was found below 1e4. Over all 1517 zeta zeros below 2000 (ball-certified signs, none undecided): (N2_h) fails at h = 1/2 at zeros 922, 996, 1308, 1496 (ordinates 1329.0435, 1415.5858, 1769.9410, 1977.1739; q_{1/2} = -0.054, -0.122, -0.041, -0.278); h = 1: 144 failures; h = 2: 760; h = 4: 1449; none at h = 0.1, 0.25 (minimum of q_{0.25}: 0.132). Two of the four checked independently with mpmath at 40 digits. Over the 1861 on-line zeros of DH below 2000: 11 failures at h = 1/2, and one zero (number 1249, t = 1400.5328) fails already at h = 0.1 (q = -0.028) and h = 0.25. This is a measured property of the phase at computed zeros and supports the record's ARGUED expectation; it changes no verdict. It is not a statement about the location of zeros.

4.3 **D3, `c3-lemmab-referee-dh-poisson` and map row P43: the recorded residual 4e-12 is not the converged value.** All 8 recorded residuals have the same sign and size (3.9e-12 to 4.6e-12), in the record and in the replay with a different zero table. With the quadrature step of the archimedean term halved or quartered the residual becomes -2.26e-11 and -2.17e-11 in the two cases tried, and is stable under a further halving and under a wider window (`logs/d3_variant.txt`). The identity holds for DH to about 2.3e-11 in float64, not 5.4e-12; the recorded figure is a partial cancellation at one step size. Verdict unchanged.

## 5. Controls

This lane proposes no mechanism, so there is no attack to run controls against. The controls are the product. What the five replays say about each control, as reproduced:

| device | zeta | DH | E_a, T-NR | HEAT | U, SGN, THIN, DEL, BEU, WT |
|---|---|---|---|---|---|
| D1 shift positivity | fails (N2_1) at zero 34; (N2_{1/2}) at zero 922 | fails at the same step on its on-line zeros, at the same rate (h = 1: 144/1517 against 127/1861 below 2000) | not replayed (the record assigns them to step N1) | not replayed (the record did not run it) | not formulable or same step as zeta (record) |
| D2 Pick orders <= 100 | passes | passes | not replayed | not replayed | not replayed |
| D3 Lemma B identity | holds (record) | holds, 8 cases | not replayed | not replayed | not replayed |
| D4 central-value square | passes | passes; positive at all 84 off-line ordinates (minimum 2.0e-6) | pass; positive at their off-line ordinates | passes: real on the line | WT: hermitian form passes, bilinear form not real (Lemma W1 step); THIN, DEL, BEU: stage only; U, SGN random: not formulable on Re s = 1/2 |
| D5 Landau step | - | not formulable (no Euler product; record) | not replayed | - | DEL passes |

## 6. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | no argument about zeta is made; the lane builds and validates control objects |
| R2 (height-uniform, every window) | false | no conclusion of that form; tables stop at height 2000 |
| R3 (every control fails structurally) | false | not applicable: no device is proposed; the five replayed devices each have a passing control, as recorded |
| R4 (reaches the critical line) | false | no R4 answer; meta-harness item |

## 7. Three weakest steps

1. **The threshold is not met as registered, and two of the five replays test less than their names suggest.** D1 has one number outside tolerance (cause located in the record). D4 has no recorded numbers, so its "within tolerance" clause is empty, and for real coefficients the form is a modulus squared by Lemma W2: the replay tests the tables and the conjugation rule (table value times an independent evaluation at the conjugate point), not a property that could have failed for a correct table. D5's identity H = exp(-2A) is algebraic once A is defined from the same set; the content of that replay is the set, the coefficient table and the recorded abscissa data. D2 and D3 are the replays with independent numerical content (840-digit pivots; a zero table computed by a different method).
2. **The zero tables of DH and HEAT are measured, not certified, and the HEAT off-line list is incomplete.** DH: winding numbers come from sampled phases with a step control (maximum phase step 0.97 rad), on-line zeros from sign changes at step 0.01; every box closes, which is strong evidence and not a proof. HEAT: for tau = -0.1 the count balances in every band; for tau = -0.5 it balances below 500 and is short by 34 zeros (17 pairs) between 500 and 2000, so pairs far from the line are missing there. The quadrature truncation error is not enclosed.
3. **Coverage is one parameter choice per family, and several objects have no values in the strip.** T-NR at (3, 2.2), WT at one translate, BEU at one shift with zeta's zeros, E_a at three shifts. U, SGN (random) and the true THIN and DEL objects left of b have no continuation in the tables; a stage-B run that needs them on Re s = 1/2 is not formulable and must say so. Only 5 of the 34 closed devices were replayed, and within them only the cells listed in section 5; the other cells of the control tables remain as recorded (argued or not run).

## 8. Files

`PLAN.md`, `README.md`, `FILES.md`, `RESULT.md`, `REFEREE.md`, `lanes.jsonl`; `battery/` (core, coeffs, sets, zeros, grid, heat, heatlib, heat_gaps, tables, derive, load, manifest, mk_files_md); `devices/` (d1 to d5, d1_diagnostic, d3_variant); `records/` (the record files, copied as data); `tables/` (mirror without the coefficient arrays); `logs/` (server unit logs, local logs). Server: `~/rh-push/c12-control-battery-harness/`.
