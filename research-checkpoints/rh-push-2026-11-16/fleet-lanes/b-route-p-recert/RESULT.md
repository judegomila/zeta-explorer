# b-route-p-recert: independent-driver re-certification of the incomplete route-P floors

Date: 2026-11-16/17. Everything here is conditional on the route-P ledger, internal, not a theorem. No QED. PT Λ ≤ 0.2 is the accepted benchmark.

## Verdict

- Independent re-certification of the 36 incomplete floors was NOT achieved. One floor (279, cell 488, the smallest-slack floor) was attempted for the whole 90-minute window and is NOT CONFIRMED: budget-stopped referee margin 0.061703669832 against the campaign margin 0.055391328542 (11.4% weaker). 35 floors were not attempted. 0 of 36 confirmed.
- Route-P consumer (exact, `tmp/r3-outer-mixed.py` unchanged):

| Admission set | Value | < 0.145 |
|---|---|---|
| collect7 as recorded (reproduced, certfile sha 3bcc2e9f…9eec) | 0.144997328111268 | yes |
| floor 279 at the weaker (referee) margin, the 35 untested floors at campaign margins | 144997476630711/10^15 = 0.144997476630711 | yes, by 2.52e-6 |
| only independently confirmed floors among the 36 (none): all 36 excluded, r6 fallback | 7256757887621/5·10^13 = 0.145135157752420 | NO |
| MEASURED scenario: all 36 margins × 1.03 / 1.05 / 1.10 / 1.20 | 0.144999655 / 0.145001221 / 0.145005069 / 0.145012839 | yes / no / no / no |

  Reading: the sub-0.145 value for route P alone depends on the 36 incomplete floors, which have no independent confirmation; it survives a uniform weakening of those margins of about 3% and not 5%. Floor 279's referee margin after 13.2 core-hours is 11.4% weaker; if the other 35 behaved the same under an equal budget, the value would be above 0.145. That is an extrapolation, not a result.
- Band records for the joint value: generators exist and were re-run on the motherbox. X165mid replays to 144912451862679/10^15 from regenerated tables (reproduced, fails {}). U2 replays to 36063660805739/2.5·10^14 = 0.144254643222956 from regenerated tables (reproduced, fails {}); the regenerated XW26 `TABLES.json` files are byte-identical to the review-packet copies. The joint consumer itself was not re-run; its route-1 input carries the same dependence on the 36 floors.

## What was run

1. Independent driver: `tmp/r7-ref-full-cert.py` (referee driver of `formalization/paper/fiber-tails.md` / `tmp/r7-ref-full-out`: own dyadic grid 9×13×11, exact-checked box geometry, G1 = 3001, quad_n = 11, no seeds). Its Mac cost on comparable floors is 2.4–4 CPU-hours for easy floors; the 36 floors here took the campaign driver 9–12 CPU-hours each without finishing, and a best-first referee run to the campaign margin needs comparable work. Measured motherbox speed is 2.0–2.7 times slower per core than the Mac (`speed_mac_6.json`, `mb/speed_mb_6.json`). Serial runs could not get near a margin in 90 minutes, so I wrote `r7-ref-par-cert.py`: it imports `fbox`, `kids` and the constants from the referee driver unchanged, copies `evaluate` verbatim, and dispatches parent expansions to forked workers. Per-box values depend only on (box, inherited F, parent bound).
2. Wrapper/port check (MEASURED): floor 6 on the motherbox, stopped after the initial grid: the 1021 accepted level-0 boxes are the same set as in the Mac serial `rcert_6.json`, same sources, max bound difference 1.1e-16, 266 open as expected (`mb/val_rckpt_6.json`). The run was not carried to completion.
3. Floor 279: threshold = max box bound of the campaign certificate (so complete would mean referee margin ≤ campaign margin exactly). 10 workers, 4776 s wall, 47,582 CPU-s, 6350 boxes, 1750 open, 0 exceptions, 0 non-finite. `check_rcert.py`: exact dyadic tiling of the grid, K0* equal. Margin trajectory: 0.408 (13 min), 0.155 (24 min), 0.081 (42 min), 0.0648 (67 min), 0.0617 (80 min).
4. Consumer: `recert_consume.py` (certfile rule copied from `tmp/routes-b1-r1-merge.py`); outputs in `consume/`.
5. Tables: `tmp/b145-B-run.py` (ported by path substitution, python-flint 0.8.0) for X165 (7 runs, 21 min) and XW26 (3 runs, 17 min); usable/failed cell counts equal the October Mac logs. Replays with `replay_regen.py` / `b145c_regen.py` (copies of `tmp/r3-bb-replay.py`, `tmp/b145-B-consume.py` with only the table directory changed). U2 was also replayed from the packet tables (sha-verified): same value.

## Per-floor table

| idx | cell | campaign margin (incomplete) | referee margin | agreement | admission at actual margin |
|---|---|---|---|---|---|
| 279 | 488 | 0.055391328542 | 0.061703669832 (budget-stopped, 1750 open) | referee bound is valid but 11.4% weaker; not contradictory, not confirming | not independently confirmed; stands on the campaign driver only |
| other 35 (287, 283, 278, 282, 286, 277, 202, 204, 281, 203, 285, 201, 254, 206, 181, 176, 182, 284, 208, 207, 205, 199, 185, 193, 197, 200, 188, 198, 192, 187, 196, 186, 191, 195, 190) | | see `floors36.json` | not run | none | not independently confirmed |

## Limits and deviations

- Memory: each worker holds 1.9 GB. The first 24-worker start took 46 GB and available memory on the shared box fell to 41 GB (no swap), so I stopped it after 5 minutes and ran 10 workers (brief's 20 GB cap). That, plus the 2–2.7× slower cores, set the throughput: 13.2 core-hours on one floor.
- The parallel wrapper is not the referee driver byte for byte; a budget-stopped certificate from it is a valid box list (exact tiling checked) but its tree order differs from a serial run.
- Same bound engine (v4c) as the campaign: this path tests the driver, grid and precision, not the bound implementation.
- Cost to finish: floor 279 needed >13 core-hours for 11% above the claim; full confirmation of 36 floors is of order 36 × (30–60) motherbox core-hours.
- No src/ or site file was edited. Motherbox work is in `~/rh-push/b-route-p-recert/`; no process left running.

## Three weakest steps

1. No floor confirmed: the headline route-P value has no independent support on the floors it needs (excluding them gives 0.145135).
2. The "279 at weaker margin" value mixes one referee margin with 35 untested campaign margins; it is a bookkeeping value, not a re-certification.
3. Wrapper equivalence to the serial referee driver is checked on level-0 boxes of one floor only.
