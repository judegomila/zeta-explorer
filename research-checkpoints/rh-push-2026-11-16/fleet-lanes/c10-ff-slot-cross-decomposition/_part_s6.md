
## 6. Controls

No statement about zeros is made, so no control has to fail for a conclusion. Each ratio is read against its own
seeded class (round-9 lessons 5, 6); the rules were fixed before the runs (PREREG section 4).

| control | what was run | outcome | named step |
|---|---|---|---|
| random signs on the marked primes (`a*e`, `mu*e`; 8, 2 or 1 seeds) | every configuration | the excess disappears: e within the spread of 1 (Table 3); mean within three standard errors of s in 97 of 102 class-configurations | Lemma X4: the mean of E over the signs is SD exactly; Lemma X3: SD = D(1 + o(1)). This control removes the cross term and nothing else |
| random phases on every column (`r`) | every configuration | e = 1 within 3/sqrt(q^d) scatter; mean cross 0 within three standard errors in 50 of 51; squared signal at the level dim/q^d | Lemma R of round 8 (mean = diagonal). It is the reference for "cross = 0" |
| class U: random multiplicative signs on the cofactor (8 seeds) | every configuration | same split as the target: s = 1; n median 0.47; beta from 0 to 65 by seed; target a inside the class range of c_perp in 50 of 51 | the squared signals read a Moebius-type sum of the vector, whatever the vector; no step reads the target's L-function |
| Liouville-twisted vector (`mu`) | every configuration | largest excess (951.9 at (2, 12, 1); 269.6 at q = 13 (2, 7, 2); 1160 at (3, 11, 1)); c/beta within 3.8 percent of 1 wherever beta >= 10 (26 of 26) | its Moebius sum is the full count; B(a) = B(mu)/q^N exactly at N = 2 |
| aligned vector (`al`) | every configuration | e from 85 to 7.4e9, in the cross term (s = 1.0 to 155, the aligned row; c/e above 0.97); beta/e = 0.011 to 0.14 | Lemma AL of round 8: the operator-norm vector, aligned with one row m_0, not with the Gauss-sum rows |
| trivial target (`one`) | every configuration | excess in the cross term; outside every span tried at d = 3 | OPEN (section 4) |
| U of the Z[omega] screen (random unimodular multiplicative twist, slot primes included) | not run here | corresponds to the slot-sign class of this lane, not to the class U above (its phases on the slot primes remove the cross term); c9 measured 0.96 to 1.02 | - |
| DH, sign-twisted primes, backward heat, zeta(s+a) zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not applicable | - | no positivity or zero statement; DH has no row family (c9) |

## 7. Requirement flags

R1 false, R2 false, R3 false, R4 false (table at the top). aboutZeros: false. The lane does what its assignment
says: it removes the caveat of round-9 lesson 1 and raises no flag.

## 8. Three weakest steps

1. **Rule B failed, and its repair is post hoc.** The registered statement "Cross = B_coh + O(diagonal)" is false
   for the second target at the largest size (remainder 4.45) and for 2 further vector-configurations. The second
   squared signal (direction u(m)) was found after the result, from the row totals only (no per-prime split, no
   seeded rule, mechanism ARGUED). The bound "remainder at most 1.5 after both signals" is a description of 538
   vector-configurations at N = 2, 3, d <= 3, not a law; for the trivial target it is false at d = 3 and the term
   there is not identified.
2. **Sizes.** Rows d <= 3 (7 to 343 rows at q = 7, 13 to 169 at q = 13), so the span of the Gauss-sum rows has
   dimension 1 or 2 and single values scatter by 3/sqrt(q^d). At q = 13 one active configuration lies above 3N
   ((2, 7, 2), excess 1.34); (2, 10, 1) with the c9 value 18.1 is NOT-RUN, as is q = 13, N = 3 above 3N and q = 7
   (2, 12, 2). The largest runs have 2 seeds per class (1 in the optional run). Lemma X3 is proved with a bound
   that is non-trivial only for lam > 2N + 3 or so; below that s = 1 is measured (to 0.19 at lam = 3, 4).
   The reflected dual sums were not built (as in c8, c9): the split is of the direct side.
3. **The Z[omega] size estimate is a float proxy.** A(vec) sums squared class sums over residue classes modulo 4
   and units; the exact rank-6 form mixes the classes with unimodular coefficients and was not written. A first
   version (classes by norm modulo 4, G not reduced to Gamma) gave LIOU/ALIGNED = 1.5e-4 against the screen's
   0.43 to 0.57 and was discarded (`logs/zw_v1`); the corrected version reproduces the screen's LIOU/ALIGNED only
   through the frequency density 0.397, which is one number. The g = 1, d = 1 term of c9 Lemma 0 only; the
   coprimality (c_1, c_1') = 1 is ignored. The visibility size extrapolates K^(1/6) over 13 to 15 orders of
   magnitude in K from data whose measured slope is 0.07 to 0.13. What is robust: the THETA class sums are at the
   random level at all four sizes, so the predicted term is 30 to 70 times below the resolution there.

## 9. Compute record

Server ([compute-server]), computations only through `~/rh-push/bin/rhrun`; `rhstatus` read before each launch; GPU not
used; planned memory printed by the kernel (at most 0.005 GB).

| unit | cores, memory limit | what | outcome |
|---|---|---|---|
| rh-c10slot-srv-1119065340 | 4, 4 GB | build (gcc, OpenMP); validation (two configurations, 40 lines identical with the local build); 8 jobs of `jobs_srv.txt` | completed 08:08 UTC, 75 minutes. Job times: (2, 12, 1) L 1721 s; q = 13 (2, 7, 2) F 612 s; (2, 11, 2) L 1061 s; q = 13 (3, 7, 1) L 104 s; q = 13 (2, 8, 1) L 201 s; q = 13 (3, 6, 2) L 72 s; (3, 11, 1) L 435 s; (3, 10, 2) L 253 s |
| rh-c10slot-srv2-1119080829 | 4, 4 GB | started after the first unit was inactive: two jobs of the local list ((3, 9, 2) F 117 s, (3, 10, 1) F 144 s; the local queue then skipped them), then the optional job (3, 12, 1) M | completed 08:46 UTC; (3, 12, 1) M: 2002 s (1.15e9 primes) |

The two units never ran at the same time; 4 cores at most. No job ran longer than 3 hours. Only my own units were
touched. Not through `rhrun`: file copies with rsync and status reads.

Local (Mac), through `scripts/memcap.sh 8`, one process at a time in a queue (`runjobs.sh`, `queue4.sh`): 48 jobs of
`jobs_mac.txt` (longest: (2, 11, 1) F 882 s, (2, 9, 3) F 833 s, (2, 10, 2) F 766 s), the short-mark runs
((6, 2, 5): 331 s; q = 13 (4, 1, 4): 70 s), the Z[omega] estimates (2 to 124 s; `.venv-arb` interpreter, table
`tmp/sextic/data` read as data), the brute-force checks. Peak memory 2.8 GB ((6, 2, 6), stopped). Deviations, all
mine: (i) the brute-force check at d = 3 was still running when the queue started (about one minute of two
processes); I stopped it; (ii) the queue was restarted twice to move short jobs to the front; one job in progress
was lost each time and rerun; (iii) (6, 2, 6) was stopped after its first vector; (iv) the first Z[omega] runs
failed (interpreter without numpy) and the first working version was discarded (section 8, item 3); (v) processes
were stopped by PID, in one case by `pkill -f` on the full command line of my own check script (local machine
only); (vi) build, timing and analysis calls of seconds were run outside the queue.

**Error to report: one local process that was not mine was terminated.** At the second restart of my queue I
built the PID list from `ps` filtered on the script names `queue2.sh`, `queue3.sh`, `runjobs.sh`, `ffs ens` and sent
SIGTERM to every PID in it. The list contained PID 80786, `/bin/zsh ./queue3.sh` with parent 1, started
2026-11-16 11:17 local: a script of the directory `tmp/research-2026-11-16/euler` (another lane), not of this lane.
It was terminated. Found afterwards (read-only inspection): that script was a waiter (`while pgrep -f
"queue.sh|queue2.sh|nested.py|optnodes.py"; do sleep 10; done`, then two `nested.py zeta` runs writing
`nest_z_wide.txt`, `nest_z_wider.txt`) that had been waiting since 2026-11-16; its condition is held true by a
polling shell of the same lane (PID 94875, started 2026-11-16 11:55, whose command line contains `nested.py`), so
it had not run its payload and could not while that shell exists. Its sibling `euler/queue4.sh` (PID 90095, same
age, same kind of waiter) and PID 94875 are still running and were not touched. No file of that directory was
written or changed by me. Effect: the two queued `nested.py zeta` runs of that lane will not start if the polling
shell ever ends; the owner may want to restart or clear those waiters. Cause: a name-based process list on the
local machine with script names that are not unique to a lane.

## 10. For the next allocation; proposed map row (not applied)

- Round-9 lesson 1, caveat: resolved as "sizes". The Z[omega] screen was run where the model also has no target
  excess; the model result is about long marks (lam >= 3.5 N). The verdict of row Z30 does not change.
- The one open item that is cheap: the row directions of the trivial-target vector at d = 3 ((2, 7, 3), (2, 8, 3),
  q = 7), from the stored row values; and a per-prime, seeded test of the u(m) signal (one kernel change:
  projection vectors per weight).
- Not worth a lane: a larger Z[omega] screen at P = Z^(1/3). The predicted term falls with Z there.

Proposed addition to row Z30 (text after "The model excess and the Z[omega] screen ... are not reconciled"):

| Z30 (addition, round 10) | Slot split of the exact F_q[T] row energy (`c10-ff-slot-cross-decomposition`) | Long marks (lam > N, lam > d), q = 7 (N + lam <= 14, one run at 15) and q = 13 (<= 10), N = 2, 3, d <= 3, 58 configurations, exact integers, rules fixed before the runs. R = sum_P R^P with the block of P = chi_P(m) times the unmarked row twisted by a cubic character (model form of Lemmas S1, S2). The slot-diagonal part equals the diagonal up to O(N q^(N - lam/2)) (prime sum of a non-principal cubic character; measured within 2.4e-3 for lam >= 7): the excess over the diagonal is the cross term over pairs of distinct marked primes (c/(e - 1) within 1e-4 of 1), and random signs on the marked primes return every vector to the diagonal. The exact squared signal B on the Gauss-sum rows c_0, c_1 is carried by pairs of distinct primes; Cross = B + (n - 1) D with n = (E - B)/D; n <= 1.5 in 593 of 596 vector-configurations and 5.3 for the second target at (2, 12, 1) (registered rule fails there). Post hoc: the remainder is a second squared signal in the direction u(m); with it the remainder is at most 1.5 for targets and the random multiplicative class (538 vector-configurations); the trivial target is unresolved at d = 3. Completed rows at N = 3: the cube-term excess is cross and lies in the span enlarged by V c_0, V c_1 (0 violations of 218). B(target a) = B(Liouville-twisted)/q^N exactly at N = 2. Reconciliation with the Z[omega] screen: at short marks (lam = N/3, N/4) the model has no target excess (ratio 0.975 to 0.997, cross -0.025 to +0.003) and the Liouville-twisted vector +3.4 to +8.7 in the cross term; in Z[omega] the class sums of the THETA dual vector are at the random-phase level and the predicted coherent cross is 1.5e-4 to 3.2e-4 of the diagonal at Z = 2000 to 16000 (resolution 0.01 to 0.02); visibility needs about 1e10 columns or more with P >= Z^2; at P = Z^(1/3) the term falls like Z^(-2/3). | PROVED (identity; slot-diagonal lemma, Weil); EXACT (integers; brute-force check of the identity on 6 small configurations); MEASURED (rule outcomes; float proxy for Z[omega]); POST-HOC (second squared signal); ARGUED (visibility size); no referee | slot signs and random phases: diagonal; class U (random multiplicative signs): not separated from the target (50 of 51); Liouville-twisted and aligned: above, in the cross term | `c10-ff-slot-cross-decomposition` |

No statement about zeta. No abscissa below 0.874886647 is proved.

## Files

- `RESULT.md`, `PREREG.md`, `MAP_ROW_PROPOSED.md`, `lanes_line.json`
- kernels: `ffs.c` (slot split, long marks; built from the `ffw.c` loop), `ffxs.c` (patched copy of `ffx.c`, short
  marks); `ffx.c`, `ffw.c`, `ffpy.py`, `plan.py`, `analyze.py`, `fit.py`, `decomp.py`, `check_completed.py`,
  `ek_common.py`, `zomega.py`: copied unchanged from the c9 lanes
- `check_slot_ff.py`, `check_slot_ff.log` (brute force of the identity); `validate_mac.txt`
- `wlist.py`, `jobs_mac.txt`, `jobs_srv.txt`, `jobs_srv2.txt`, `jobs_opt.txt`, `jobs_opt1.txt`, `runjobs.sh`,
  `srv_main.sh`, `srv2.sh`, `queue2.sh` to `queue5.sh`
- `results/` (ENS, PRJ and ROW lines: exact integers, every row value), `results_srv/` (server copies),
  `results_short/` (short marks)
- `analyze_slot.py`, `slot_results.json` (exact fractions), `report.py`, `rules.txt`, `tables.md`, `condensed.py`,
  `condensed.md`, `show.py`, `short.py`, `short_tables.md`
- post hoc: `resonance.py`, `explore_dirs.py`, `posthoc_dirs.txt`
- Z[omega]: `zw_predict.py`, `zw_predict_Z*.json`, `logs/zw_predict_Z*.log`, `logs/zw_v1/` (discarded first version)
- `logs/` (hashes at pre-registration, queue logs, server unit logs)
