# b-route-p-motherbox: route P certified below 0.145 (relative to the route-P ledger)

Date: 2026-11-16. Slug: b-route-p-motherbox. Nothing here is a QED. PT Λ ≤ 0.2 is the accepted benchmark; RH open.

## Verdict

**CERTIFIED relative to the route-P ledger (hence conditional on it), internal checks only:**

| Run | Value (exact) | Decimal | < 0.145 | Checks |
|---|---|---|---|---|
| Route P alone, final campaign state (collect7; Mac-engine certificates only) | 36249332027817/250000000000000 | 0.144997328111268 | yes, by 2.67e-6 | 369/369 floors certified, exact cover 0 holes, certfile bad 0, E1–E8 0 failures, altlog 0 failures, U_robust = U, 74,239 steps |
| Joint (route 1 certfile + route-5 3-band layout + 281 route-3 kernels), collect7 | 144963267002879/1000000000000000 | 0.144963267002879 | yes, by 3.67e-5 | E1–E8 0 failures, U_robust = U, 74,222 steps, heights [396/625, 109/50] |
| Route P alone, + motherbox continuation certificates (collect8) | 36249278978491/250000000000000 (U_robust) | 0.144997115913964 | yes | raw U 0.144997115913963 carries one E6-altlog flag; U_robust (one unit of 1e-15 above) passes both log bounds; "full" lane 0.144997120303228 passes with 0 flags |
| Joint, collect8 | 144963150729611/1000000000000000 | 0.144963150729611 | yes, by 3.68e-5 | E1–E8 0 failures, U_robust = U, 74,222 steps; identical on Mac and motherbox |

Previous certified values: route P alone 0.145535458600488, joint 0.145276368594868 (collect6, campaign snapshot 2026-10-07 06:54).

Both statements "Λ ≤ 0.144997328111268" and "Λ ≤ 0.144963267002879" hold only under the route-P ledger listed in "Dependence" below. They are not unconditional and have had no external review.

## What changed, and what the motherbox contributed

1. The premise of the task (about 52 open and 10 budget-stopped cells) was a stale snapshot (2026-10-08 03:10). `tmp/route1-campaign/status.tsv` shows the scheduler ran to exit on 2026-10-10 05:17 with 102 floors done and 36 budget-stopped; every one of the 138 campaign floors has a certificate on disk. No collect had been run after collect6 (2026-10-07). The drop below 0.145 comes from collecting that final state (collect7). No new mathematics, no new bound code.
2. The 36 budget-stopped floors hold valid certificates with open boxes: the engine is best-first branch and bound, the certificate margin is the maximum bound over all boxes including open ones, and a larger margin only weakens the admitted floor. They are used at their actual margins (0.5%–16% above target), not at target.
3. Motherbox port (x86_64, gcc 13.3, glibc 2.39, python 3.12, python-flint 0.8.0 / FLINT 3.3.1, numpy 2.5.3 as on the Mac): the v4c engine (`r7-full-cert.py`, `r7-engine-cert-v4c.py`, `r6-fiber-l1.py`, `r6-fiber-lib.py`, `r7-engine-xstruct.py`, C sources `r6core.c r6tm.c r6tm2.c r6maj.c r7maj.c` compiled with the flags stated in their headers: `-O2 -ffp-contract=off`, plus `-frounding-math` for the two directed-rounding files). Only path strings and the `.dylib` → `.so` suffix were changed (sed). The Arb-generated coefficient and phase tables (`coef`, `ph` binaries, FLINT) were produced on the Mac with the original binaries and copied, so no Arb C code was rebuilt.
4. Port validation (MEASURED): 12 boxes of floor 279, gap bound, full bound and a cheap child bound each, recomputed on both machines: the Mac reproduces the recorded certificate values bit for bit; the motherbox agrees to ≤ 2 units in the last place (≤ 2.3e-16 absolute) on all 36 numbers (`probe_mac_279.json`, `probe_mb_279.json`). The engine's own outward slack factors are 1e-12 to 1e-9.
5. Motherbox run: 36 workers (one per budget-stopped floor, `--resume --continue` from the Mac checkpoints) started 21:20 UTC. The box was oversubscribed by other jobs (load 94–102 on 48 threads, available memory fell to 19 GB with no swap); my workers got about 36% CPU each and about 0.065 evaluations/s (0.8/s on the Mac in October). After 48 minutes I stopped 32 workers to release 70 GB and wrote their certificates from the last checkpoints; the four floors nearest completion ran 25 minutes longer. Result: floor 279 (cell 488) completed at target; the other 35 margins improved by 2e-5 to 4e-4. Effect on the value: −2.1e-7 (collect8 vs collect7). The "40 cores for 3 hours" plan was not achievable on the shared box and would not have mattered much: see the sensitivity table.
6. The collector and both consumers were also ported and run on the motherbox as a cross-check (exact rational arithmetic): collect7 gives a byte-identical admission file (sha256 3bcc2e9f…9eec) and identical values for route P alone and for the joint run; collect8 likewise (sha256 3567708d…a8b6).

## Work log (commands and files)

All under `tmp/research-2026-11-16/push/b-route-p-motherbox/`.

- `collect_serial.sh`: copy of `tmp/route1-campaign/collect.sh` with the two coverage lanes and the two band lanes run serially (local single-process rule) and the assemble sources taken from `RUNDIRS`. No other change.
- `collect7/` (sources `tmp/route1-campaign/run`, `tmp/r7-final/assembled`), `collect7.out`: assemble 369 certified / 0 missing, 333 complete, 36 incomplete, 333 meet own target; exact real-coverage check 369 certificates, 0 holes, all bounds finite, K0* matches; certfile check `bad 0`, min slack 1.13e-13; independent rebuild 0.144997328111267 (1e-15 lower, pad convention, as in r7); E1–E8 and altlog `{}` on both lanes; `all_checks_pass=True`.
- `check_certfile.py` (mine, independent of the pipeline code): recomputes m = max box bound − K0* for all 369 assembled certificates in exact rationals and checks shift ≤ 23/10000 − m − 1e-9. 354 pass directly; the other 15 (idx 6, 74, 101, 124, 125, 130, 139, 143, 147, 220, 236, 238, 323, 338, 347) carry the smaller margin of a complete referee re-certificate `tmp/r7-ref-full-out/rcert_<i>.json` and pass against that (the "fullref" rule). 0 bad.
- `J7_mac.json`, `J7_mac.log`: joint consumer `tmp/routes-b3-combine-consume.py`, same command as `tmp/routes-b4-rec-joint-run.sh`, on `collect7/merge/certfile_fullref.json`. Usage: (1, sharp-r2) 24,523; (0.88, cat) 14,262; (1, cat) 9,969; (0.94, cat) 9,940; (0.94, sharp-r2) 7,676; (0.88, sharp-r2) 6,503; multi 1,349; total 74,222. 637 admitted entries. `J7mb.json`: identical value on the motherbox.
- `mkcache.py`, `probe.py`, `launch.sh`, `emit.sh`, `collect_mb.sh`, `joint_mb.sh`, `scan.py`: port tooling. `mb_run/`: the 36 motherbox certificates, the 36 Mac certificates they continue (`cert_<i>.partial<secs>.json`), run logs and statistics.
- `collect8/` (sources `mb_run`, `tmp/route1-campaign/run`, `tmp/r7-final/assembled`): 369 certified, 334 complete, 35 incomplete; cover 0 holes; certfile bad 0; fullref U = 144997115913963/10^15 with one E6-altlog flag (alt − U = 2.4e-17), U_robust = 36249278978491/250000000000000; "full" lane 36249280075807/250000000000000 = 0.144997120303228 with no flag. The collector's strict summary prints "NOT ADMISSIBLE" for the fullref lane because of the flag; the admissible collect8 values are U_robust (the convention used for collect5 and D3 in `lambda-levers-combined-2026-10-09.js`) or the "full" lane.

### Collect8 joint

`J8_mac.json` (Mac) and `J8mb.json` (motherbox), same command on `collect8/merge/certfile_fullref.json`: U = U_robust = 144963150729611/1000000000000000 = 0.144963150729611, 74,222 steps, fails `{}`, heights [396/625, 109/50]. This is the lowest certified value of this run (1.16e-7 below the collect7 joint value). It depends on the x86 port for 36 floors; the collect7 joint value 0.144963267002879 does not.

### Sensitivity (MEASURED, hypothetical margins, exact route-P consumer on collect7; not certificates)

| Scenario | Value | Change |
|---|---|---|
| 36 incomplete floors at target (`scen_target`) | 0.144990419312058 | −6.9e-6 |
| all 369 margins × 0.9 | 0.144955527259825 | −4.18e-5 |
| all 369 margins × 0.8 | 0.144913928151450 | −8.34e-5 |
| κ = 0.88 floors (179) × 0.9 | 0.144976764217253 | −2.06e-5 |
| κ = 0.94 floors (159) × 0.9 | 0.144980510852631 | −1.68e-5 |
| κ = 1 floors (31) × 0.9 | 0.144992926459654 | −4.4e-6 |
| cells 234–300 / 301–377 / 378–440 / 441–500 / 501–579 × 0.9 | | −3.7e-6 / −1.33e-5 / −1.21e-5 / −8.1e-6 / −4.7e-6 |

Reading: about 1e-7 to 2e-7 per floor per 10% of margin. Finishing the stalled floors is worth at most 6.9e-6. More cell compute moves the fifth decimal only; U2 = 0.144254643222956 is the floor of this layout in any case.

## Dependence on the route-P ledger

Every value above is the output of an exact rational consumer applied to certified floor tables and is a bound on Λ only if the following hold (unchanged from r6/r7 and from `lambda-levers-combined-2026-10-09.js`):

- Shared analytic inputs: G0-c, G0-d (OP), G0-d′, the AF expository gaps; Lemma B.1–B.3 (written, unrefereed); Lemma CG, Lemma R, two-height coupling, consumer, BB1/BB2, H2 (internal referee only); producer layer; RH-win (RH for ordinates in [x_L/2, x_R/2], Route 2); RH-head (Platt–Trudgian 2021, published); MTY zero-free region (published); P15.
- WOL-C margins come from one engine (v4c). The referee replications used an independent driver, grid and precision, not an independent implementation of the bounds. The motherbox run is the same code on another platform, not an independent implementation.
- Route-P alone: Λ ≤ max(U1, U2) with U2 = 0.144254643222956 (recorded replay); U1 binds.
- Joint value in addition: Theorem B′_m for the 3-band layout (unrefereed), the 281 route-3 kernel certificates, and the recorded X165mid (0.144912451862679) and U2 replays of 2026-10-01, which were not re-run (tables deleted); band 1 binds.
- Collect8 in addition: the x86 port (item 3–4 above) for 36 floors.

## DH control

Not an RH argument, so the DH test applies in a weaker form: the ledger uses ζ-specific inputs that are false for Davenport–Heilbronn, namely RH verified to the Platt–Trudgian height (RH-head), RH in the window W2 (RH-win) and the MTY zero-free region. For DH these inputs fail and no Λ-type bound follows. Verified-height wall: the value restates verified height plus certified floors; it carries no information on zeros above the verified range beyond the de Bruijn–Newman bound itself. Nothing here bears on Λ = 0.

## Three weakest steps

1. The ledger. The value is conditional on unrefereed and internally refereed lemmas (G0-c, G0-d, AF gaps, Lemma B, Theorem B′_m) and on a single bound engine. No external review. This is the binding weakness; the numerics are not.
2. Thin slack for route P alone: 74,239 substeps against a threshold of 74,240 (2.67e-6). One mis-certified floor among 369 would undo it. The joint value has 18 substeps (3.67e-5) of slack but leans on the recorded X165mid/U2 replays that were not regenerated.
3. 36 (collect8: 35) floors are admitted on incomplete covers. This is valid by construction (maximum over open boxes, exact cover check passes) but those certificates have not had the referee re-certification sample that the batch-1 floors had; and the collect8 certificates additionally rest on the x86 port, validated only by the 36-number probe on one floor.

## Next step

Record collect7 in a data module (`route P 0.144997328111268`, `joint 0.144963267002879`, status of route 1: campaign finished) after one adversarial referee pass on: the 36 incomplete certificates (independent-driver re-certification of a sample), the joint run (re-replay X165mid and U2 from regenerated tables), and the collect7 certfile. Further cell compute is low value (table above).
