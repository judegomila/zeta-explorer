# box-verified-height: what the Linux box can add to the verified zero height, and what it is worth

Date 2026-11-17. Measurement task, no campaign started. Labels: CERTIFIED / MEASURED / CLASSICAL / HEURISTIC.
Nothing here bears on RH beyond a finite statement. The accepted bound stays Lambda <= 0.2.

## Verdict

**Not worth a multi-night run.** Measured throughput of the rigorous window verifier at 3*10^12 is about
61 ordinate units per core-second (certification only). One week on the whole RH slice raises the contiguous
height by about 0.02-0.04 % (3.0002*10^12 -> at most 3.0014*10^12). The first height that changes a published
number (Polymath15 Table 1 row X = 2*10^13 + 131252, i.e. H >= 1.0000000000656*10^13, Lambda <= 0.19) needs about
7*10^12 further units: about 3.2*10^7 core-hours with this code, about 110 years on 32 cores. Platt and Trudgian
used 7.5*10^6 core-hours on clusters for the first 3*10^12.

## 1. Tools (found and built)

- python-flint 0.9.0 in `~/rh-push/venv` bundles libflint 3.6.0. It exports `acb_dirichlet_platt_local_hardy_z_zeros`,
  `acb_dirichlet_platt_isolate_local_hardy_z_zeros`, `acb_dirichlet_hardy_z_zeros`, `acb_dirichlet_isolate_hardy_z_zero`,
  `acb_dirichlet_turing_method_bound`, `acb_dirichlet_zeta_nzeros`; the Python layer exposes only `acb.zeta_zero(s)`.
  No FLINT/GMP/MPFR headers and no m4 on the box.
- Reused the repo's audited verifier (route 36, `tmp/routes-b9-r36-platt/`): `r36win.c` on locally compiled FLINT 3.6.0
  Platt units with the wrap patch (`FLINT_AUDIT_2` section 2.7), plus `turing_window.py` (direct-integral Turing test,
  Trudgian 2011 Thm 2.2, no parity, no Gram-block criterion, H = 20).
- User-space build under `~/rh-push/box-verified-height/prefix` through rhrun (`box/build_all.sh`): m4 1.4.20, GMP 6.3.0,
  MPFR 4.2.2, FLINT 3.6.0, then the patched units with gcc 13.3 -O2. No system files touched.

Certificate per window (CERTIFIED relative to the trust base: patched Platt grid lemmas as audited by one reader,
Trudgian Thm 2.2, Arb): disjoint sign-change intervals from the Platt grid; N(T1) and N(T2) fixed exactly by the
Turing test at two interior points; number of intervals in (T1, T2] equals N(T2) - N(T1); hence every zero with
ordinate in (T1, T2] is simple and on the line. Contiguity: consecutive windows have overlapping (T1, T2] and
intersecting intervals for shared indices (`box/chain.py`).

## 2. Measured costs (box, AMD Threadripper PRO 9965WX, one thread per window, prec 128, A=8, B=4096)

Solo windows (stage A, `rh-bvh-benchA-1117133809.log`):

| centre T | J | zeros certified in (T1,T2] | T2-T1 | grid+isolate CPU-s | total CPU-s (incl. refinement, Gram, theta) | Turing CPU-s | peak RSS | min Turing margin |
|---|---|---|---|---|---|---|---|---|
| 10^10 | 56,926 | 5,442 | 1613.8 | 20.2 | 39.7 | 0.14 | 343 MB | 7.04 |
| 10^11 | 177,570 | 5,996 | 1603.8 | 20.3 | 42.9 | 0.15 | 326 MB | 7.11 |
| 3000175333500 | 953,187 | 6,873 | 1605.9 | 21.1 | 47.4 | 0.14 | 302 MB | 7.61 |

The grid cost is flat in T over this range (fixed overheads of the lemma bounds and convolutions dominate, not the
sum over J terms). Refinement of each zero (about half the total) is not needed for the certificate; Platt and
Trudgian also skipped it.

Contiguous chain, 16 windows at a time (stage B, `rh-bvh-benchB-1117134028.log`, `box/cert/c__chain.json`):

- 32 windows, stride 1500, all 32 CERTIFIED, 0 chain breaks, min Turing margin 6.37.
- **Contiguous certified interval (3000175332743, 3000175380807]**, length 48,064.9, **205,716 zeros**, N(T_lo) = 12363153436890,
  N(T_hi) = 12363153642606. T_lo is below the Platt-Trudgian height 3000175332800, and N at T_lo is consistent with their
  count 12363153437138 at that height (248 zeros in 57 units at density 4.28). New height above theirs: 48,007 units.
- Wall 128.5 s on 16 threads. CPU: 1822 s total; 835 s for grid+isolate (26.1 s per window under 16-way load, 21.1 s solo).
- Peak RSS 302 MB per process (16 concurrent: 4.8 GB).
- Per unit of ordinate: 0.0379 core-s as run (with refinement, stride 1500); **0.0164 core-s certification only at
  stride 1590 (61 units/core-s)**; 0.0133 solo. Per zero: 8.9 ms as run, 3.8 ms certification only.
- The repo's earlier figure (62 CPU-s per window of 21,665 zeros at 7.8*10^12, Mac) is the same order.

## 3. Projection

Rate used: 61 units per core-second (certification only, loaded). "32 cores" on this box are logical CPUs 16-47:
8 physical cores plus 24 hyperthread siblings of cores 0-23, shared with the user's jobs; 32-thread throughput was not
measured and the 32-core column is a linear upper bound.

| | 16 cores | 32 cores (upper bound) |
|---|---|---|
| per night (12 h) | 4.2*10^7 units, 1.8*10^8 zeros | 8.4*10^7 units |
| per week (168 h) | 5.9*10^8 units, 2.5*10^9 zeros | 1.2*10^9 units |
| height after one week | 3.00077*10^12 | 3.0014*10^12 |

| target H | new units | core-hours | 16 cores | 32 cores (upper bound) |
|---|---|---|---|---|
| 3.1*10^12 | 1.0*10^11 | 4.5*10^5 | 3.2 years | 1.6 years |
| 3.5*10^12 | 5.0*10^11 | 2.3*10^6 | 16 years | 8 years |
| 5*10^12 | 2.0*10^12 | 9.1*10^6 | 65 years | 32 years |
| 10^13 | 7.0*10^12 | 3.2*10^7 | 227 years | 114 years |

Platt-Trudgian (arXiv:2004.09765, section 2; CLASSICAL): Platt's algorithm rewritten on Arb, no refinement of zeros,
lattice sampling about 0.01 with 999,997.5 of 10^6 zeros isolated at the default rate, Turing's method (Trudgian),
clusters BlueCrystal III, Raijin, Gadi, "some 7.5 million core hours on 3.6 GHz Xeon", i.e. about 110,000 units per
GHz-hour = 111 units per core-second averaged over [0, 3*10^12]. The FLINT local-window code on this box runs at 55 % of
that per core. A throughput-tuned code would gain a factor of about 2, not orders of magnitude.

## 4. Payoff

Benchmark route (Polymath15 Table 1, X = 2H; CLASSICAL, pinned rows): X = 5*10^12+194858 gives 0.20;
X = 2*10^13+131252 gives 0.19; X = 6*10^13+123375 gives 0.18. No row lies between H = 2.5*10^12 and 10^13.
A value between rows needs a new barrier computation at the new X (not done by anyone; "interp." below is
log-linear between the two rows and is HEURISTIC).

Route P (project values, conditional on the route-P ledger, unrefereed): H enters only through the head wall (W),
X <= 2H - 1 (paper main.tex 287-297). No route-P run at another height exists. Pinned neighbours: b145 certified
stack 0.148926 at H_PT, 0.146591 at 1.6 H_PT, 0.145487 at 2 H_PT; Raymond chain 0.143943 at 3.3 H_PT. The column
below scales the current values by ln(H_PT)/ln(H) (HEURISTIC; overstates the gain by 10-30 % against the pinned
tables). Any use requires re-certifying all 369 floors at the new X.

| H | benchmark, citable | benchmark, interp. | route P alone (0.144997 now) | joint (0.144963 now) | 0.1758354 candidate |
|---|---|---|---|---|---|
| 3.0002*10^12 (now) | 0.2 | 0.1987 | 0.14500 | 0.14496 | 0.17584 |
| 3.1*10^12 | 0.2 | 0.1984 | 0.14483 | 0.14480 | 0.17564 |
| 3.5*10^12 | 0.2 | 0.1976 | 0.14422 | 0.14419 | 0.17490 |
| 5*10^12 | 0.2 | 0.1950 | 0.14247 | 0.14243 | 0.17276 |
| 10^13 (+65,626) | 0.19 | 0.1900 | 0.13917 | 0.13913 | 0.16876 |

One week on the box (ln H up by at most 3.9*10^-4): about 2*10^-6 on the route-P values, 0 on the citable benchmark.

For RH: a contiguous certificate to H proves that the zeros with 0 < Im s <= H are simple and on the line. It says
nothing about any zero above H. Lambda bounds from this route behave like c/ln H and do not reach 0.

## 5. Recommendation

1. Do not run a multi-night extension. The return is the sixth decimal of conditional values and nothing citable.
2. If a run is wanted anyway (for the record of a small rigorous extension), the resumable command is
   `ssh -o BatchMode=yes [compute-server] 'cd ~/rh-push/box-verified-height && ~/rh-push/bin/rhrun bvh-prod 12 16 -- ./benchB.sh <NW> 16 1500 32'`
   (windows 0-31 exist; window i is centred at 3000175332800 + 700 + 1500 i; each finished window leaves
   `cert/<id>_turingwindow.json` and is skipped on restart; `python chain.py c_` re-checks the chain). Before any long
   run: drop refinement/Gram/theta output in `r36win.c` (halves the cost) and store only the isolating intervals
   (now 1.7 MB per window; 10^11 units would be about 100 TB as is).
3. To make any such result citable: (a) a second independent evaluator on at least a sample and on every window with
   small margin (the repo's Riemann-Siegel route `cert_anomaly.py`/`zsign` on `acb_dirichlet_hardy_z` is independent of
   the Platt lemmas); (b) a second parameter set (different A, B, h, precision, shifted window centres) with identical
   counts; (c) the wrap patch and the Platt lemma audit reviewed by a second reader or upstreamed to FLINT;
   (d) archived intervals with hashes and a standalone checker that reruns the Turing test from the archive;
   (e) the starting point tied to Platt-Trudgian's stated count at 3000175332800 (done here: counts agree).

## Weakest steps

1. Trust base: the patched Platt grid units were audited by a single reader (FLINT_AUDIT_2); one implementation, one
   parameter set. 12 of 32 windows report 1-3 refined balls not contained in their isolating interval
   (`contain_fail`); this touches midpoints only, not the interval counts, but it is unexplained.
2. The 32-core column is not measured (hyperthread siblings); route-P payoffs are a scaling law, not runs.
3. The interpolated benchmark column is not a theorem at any H other than the Table 1 rows.

## Files

`box/` (build_all.sh, onewin.sh, benchA.sh, benchB.sh, chain.py, tm.py, r36win.c, r36build/, turing_window.py,
cert_anomaly.py, runs/, cert/), `rh-bvh-*.log`. All box units are stopped; nothing is running.
