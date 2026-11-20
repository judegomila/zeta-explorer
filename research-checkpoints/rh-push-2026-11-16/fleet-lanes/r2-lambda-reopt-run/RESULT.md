# r2-lambda-reopt-run: re-optimised consumer run at theta = 0.874886647

Date 2026-11-16. Round-2 follow-up to `push/lambda-from-halfplane/` (RESULT.md, REFEREE.md).
Labels: PROVED / CLASSICAL / MEASURED / OPEN. "MEASURED (exact)" means the output of an exact rational computation.

Every Lambda value below is conditional on unrefereed inputs: a zero-free half-plane Re s > theta (for
theta = 0.874886647 this rests on preprints not read here), Raymond's construction (H2), the verified height (H3),
and the project's floor and kernel certificates (H4). The accepted bound is Lambda <= 0.2. RH is open. Nothing here
gives zero information.

## 0. Verdict

Partial result: one conditional number moved, by a run that passes all checks.

- **Lambda <= 29014954274317/250000000000000 = 0.116059817097268**, conditional on the half-plane at
  theta = 874886647/10^9 and on (H2), (H3), (H4'), where (H4') is (H4) of the paper plus the kernel inequality (K)
  for one further row (r, lambda, rho) = (3/5, 4987/2500, 93/400). MEASURED (exact) run; PROVED given the
  hypotheses and Theorem 4.2 in the per-substep-height form of section 4.
- This is 2.907e-7 below round 1's fixed-mode replay value 0.116060107834762 and 3.167e-5 below the 7/8 value
  0.116091488672439.
- With one probe height per cell (cell 322 run at a single height): 0.116059822328895 (5.2e-9 higher). Either
  value is valid; the one-height value needs no remark about Theorem 4.2.
- The 7/8 validation reproduces 0.116091488672439 exactly (q_k and rate equal to the archived F2 dump on all 59439
  substeps).
- Raymond's chain at theta = 874886647/10^9, recomputed with a separately written script: 0.118473587983093
  (matches `raymond_theta.json`).
- "A re-optimised run is <= the replay": reduced to a stated monotonicity property of the option generators
  (Lemma G); the property is MEASURED on all four runs, not audited in code. The certified values do not depend on it.

## 1. Plan against the atlas and the walls

Atlas section 12 (Newman Lambda): this is an upper bound on Lambda, not an RH route, and claims no zero statement.
Nothing new is proposed as a method. The task is a correctly configured run of an existing consumer, an independent
check of it, and the closing of two referee items (two-height cell; Raymond value not reproduced). Walls: the result
is conditional on the half-plane (the 2026 arithmetic input), fails for Davenport-Heilbronn (section 7), is a
positive-time statement (flow-blindness does not apply), and uses verified height only through the wall (W).

## 2. Why round 1's fresh run was mis-configured (task 1)

Cause (argv behaviour MEASURED; attribution to round 1's run inferred from its own note "the shell passed the
`--extra` list as one argument"): the driver `tmp/qrh-theta-curve-routeP.sh` builds the extra height sets as one string
`EX="--extra A --extra B ..."` and passes it unquoted. bash splits it into 14 arguments. zsh (the login shell here)
does not split unquoted parameter expansions, so a command typed or pasted into zsh passes the whole list as one
argument. `tmp/qrh-tune-consume.py` collects extra sets with `if x == '--extra'` over `sys.argv`; with one fused
argument the test never matches, `xsets = []`, and the run proceeds without error on the base menu only (no (M1)
floors, 36923 of F2's 59439 substeps).

    zsh : argv = ['--extra a --extra b']        bash: argv = ['--extra', 'a', '--extra', 'b']

Numerical reproduction of round 1's 0.117674: attempted and not completed (section 8).

Fix: `run_reopt.sh` runs under bash, holds the extra sets in a bash array, passes `"${EX[@]}"`, and logs the argument
count (14). Arguments are otherwise those of the F2 configuration: certfile `collect6/merge/certfile_fullref.json`,
tables tab_P, tab_X, tab_X2, kernels = xkernels = `qrh-tune-out/xkernels_final.json` (360 rows), sets W4, m097,
m094, m091, QA_m0.88, QB_m0.91, QC_cliff, start offset 10^-7. A silent-failure guard is still missing in the
consumer (it should reject unknown arguments); not edited, since it is outside this directory.

## 3. Runs (task 2) and the table

All runs: exact rationals (Python fractions), enclosures as in the paper (degree-18 Taylor bound for exp(-x), upward
rounding to 2^-96, degree-11 alternating log bound, ceiling to 10^-15). Local machine, one process at a time,
sequential. Wall times 470 s, 871 s, 891 s, 1300 s; the last exceeded the 20-minute local limit by 100 s because the
machine load rose to 86 during the run (rule breach, reported).

Lambda(theta) upper bounds, all conditional as stated at the top:

| theta | Raymond chain (H2, H3), recomputed | fixed-mode replay of F2 | re-optimised run | re-optimised, one height per cell |
|---|---|---|---|---|
| 7/8 | 0.118505710922701 | 0.116091488672439 | 0.116091488672439 | 0.116091492734897 |
| 874886647/10^9 | 0.118473587983093 | 0.116060107834762 | **0.116059817097268** | 0.116059822328895 |
| 87/100 | 0.117078950526076 | 0.114698258115092 | 0.114686652134445 | 0.114686656089568 |
| 4/5 | 0.095022125299536 | 0.093179839792357 | 0.093069284680992 | 0.093069284680992 (no two-height cell) |

Exact values of the re-optimised column: 116091488672439/10^15, 29014954274317/(2.5*10^14),
22937330426889/(2*10^14), 2908415146281/(3.125*10^13). Replay minus re-optimised: 0, 2.907e-7, 1.161e-5, 1.106e-4.
The 4/5 entries agree with the paper (0.095022125299536 and 0.093069284680992); the replay column agrees with the
referee's table. Start offsets: 2*10^-6 for Raymond's chain, 10^-7 otherwise.

Run at theta = 874886647/10^9 (`t874886647.json`, dump `dump-t874886647.steps.jsonl.gz`):

| quantity | value |
|---|---|
| q0 | 140540023098902609/(2.5*10^17) = (2 theta - 1)^2 + 10^-7 |
| substeps | 59423; terminal substep k = 59422 (index 30 in cell 464), t_K = 59422/512000 |
| first rate c_0 | 41336831094003950997/3755300000000000000 = 11.0076 (same mode as F2) |
| S1 margin q0 - (2 + c_0 q0) 10^-8 - (2 theta - 1)^2 | 1.8120e-8 > 0 |
| smallest admissibility margin rho^2 - v on the path | 3.0018e-10 > 0 (exact comparison) |
| terminal: q_K | 2.4467e-6; one-step value minus q_e = -1.4695e-6 <= 0 |
| terminal: tau/delta | 0.62379 (in (0, 1]) |
| horizon margin 41/250 - U (C6) | 0.047940182902732 |
| probe heights | [91/100, 47/25] |
| floor entries used | 468, all among F2's 468 |
| kernel rows used | 60 = F2's 59 + (3/5, 4987/2500, 93/400), used on 14 substeps of cell 360 |
| consumer checks E1-E8, S1, A/B generator agreement | 0 failures |

## 4. Verification (task 3)

Three layers, all with 0 failures on all four runs.

(a) The consumer's own checks (list in the paper, section 5.3).

(b) The project's from-scratch step verifier `tmp/qrh-tune-verify.py` (re-derives every floor from the raw table
files): `*_verify.json`, `fails = {}`.

(c) A checker written for this task, `check_dump.py`, sharing no code with (a), (b) or round 1's `replay.py`. On
every substep, in exact rationals:
- rate recomputed from the mode record, c = (2 lambda/h)(ell - cap/h), equal to the dumped rate; c > 0; 0 < c delta < 1;
- v = q/h^2 <= rho^2 and r h < 2;
- cap >= sup over [0, v] of s_r, decided exactly rather than on sample points: with a = r^2 and u = 1 + a - v,
  ds/du has the sign of 4a(1+a) - u^2, so for 3a >= 1 the sup is s_r(0) = 2/(1+a); for 3a < 1 it is s_r(v) while
  (1+a-v)^2 >= 4a(1+a), and otherwise the peak 1/(2 sqrt(a(1+a)) - 2a), with cap >= peak equivalent to
  4a(1+a) >= (2a + 1/cap)^2;
- no window floor: `qlo` null on every catalogue row; every M row is a single kernel row with weight 1;
- the dumped q_k equals the enclosure chain recomputed from q0, and the dumped one-step value equals the recomputed one;
- for the (M1) rows: floor re-read from the set's TABLES.json at that cell, and h equal to the set's plan height;
- kernel rows: certificate file present with PASS true and the same (r, lambda, rho), w = 0, kappa = 1 (56-57 files
  per run); catalogue rows read from Raymond's file by index;
- S1, terminal conditions (C5), horizon (C6); U recomputed and equal to the consumer's.

Results: `check_t78.json`, `check_t874886647.json`, `check_t87.json`, `check_t80.json`, and `check_F2_archived.json`
for the archived dump. The checker also reran the fixed-mode replays from the F2 dump (column 3 of the table), with
q'_k <= q_k at every k.

Not covered by (c): floors of (M2) and (M3) are checked against the dump record only, not re-read from table files
(layer (b) does that); kernel certificates are checked as files, not recomputed, except the one new row below.

New hypothesis content. At theta = 874886647/10^9 the run uses exactly F2's 468 floor entries, so (J) is needed for
no new entry. It uses one kernel row outside F2's 59: (3/5, 4987/2500, 93/400). This row is one of the 79 kernels of
(M4) with an exact Bernstein certificate (`tmp/qrh-tune-out/kernels/pair_r3_5_lam4987_2500_rho93_400.json`, PASS) and
was in the paper's 64-bit Arb second certification (79/79). I re-ran the Arb certifier `tmp/qrh-ref-kcert.py` on it
at 128 bits: PASS, 7997 boxes, minimum box margin 3.77e-7 (`kcert_new_kernel_p128.json`). The runs at 87/100 and 4/5
use 7 and 18 floor entries and 7 and 14 kernel rows outside F2's lists (`entries.json`); those were not examined
further, so the 87/100 and 4/5 re-optimised values carry a wider (H4).

7/8 validation. `dump-t78` and the archived F2 dump agree on every field of every row except the third component of
`lab` on 11212 rows, which is a Python object id.

## 5. The two-height cell (task 4, referee item 5)

Fact, MEASURED: in F2 and in the re-optimised runs at 7/8, 0.874886647 and 0.87, exactly one cell uses two probe
heights: cell 322, with the (M2) floor at the plan height h = 117/100 (kernel (3/5, 9967/5000, 107/400)) on the
first substeps and the (M1) floor of set W4 at h = 229/200 (kernel (3/5, 4983/2500, 109/400)) on the rest
(69 + 59 substeps in F2, 52 + 76 at 0.874886647, 70 + 58 at 0.87). The 4/5 run has no such cell.

Both routes asked for were carried out.

**Lemma H (Theorem 4.2 with a height per substep). PROVED.** In Theorem 4.2 replace "h_k = h_{i(k)}" by "h_k is the
height of the floor entry (i(k), r_k, h_k, ell_k) used on substep k". The conclusion holds with the same proof.
Proof. A floor entry (i, r, h, ell) carries its own height and (J) asserts its inequality for every t in the closed
cell C_i and every x >= X. Lemma 3.1 (AF (11.1)) is a statement at one time t in C_i about one valid floor entry
and one valid kernel row with the entry's h; it does not use any relation between h and other entries of the cell.
In the proof of Theorem 4.2, h_k enters in Step 1 (v_k = q_k/h_k^2, with (C1), (C2) monotone in the height of the
zero) and in Step 3 (Lemma 3.1 applied at the contact time t* in (t_k, t_{k+1}] with the mode of substep k). Both
are per-substep. Steps 2 and 4 do not involve h. The barrier beta is continuous and piecewise smooth with knots at
the substep ends whatever the modes are, and the contact argument uses the left derivative on the substep containing
t*. So two entries (322, 3/5, 117/100, ell) and (322, 3/5, 229/200, ell'), each valid on all of C_322, may be used on
different substeps of the cell. The same remark already covers every cell in which F2 uses a non-plan height.

**One-height runs. MEASURED (exact), `single_height.py`.** Cell 322 is run with the mode of its first substep on
all 128 substeps; every other substep keeps its dumped mode. The path then lies above the dumped path after cell
322, so nothing is inherited: (C1), (C2) (exact sup rule), c > 0, 0 < c delta < 1, S1 and the terminal conditions
are checked at the variant's own q on every substep; where a catalogue cap was s_r(v) at the dumped v it is
recomputed at the new v (1714-1832 substeps). 0 failures. Values: last column of the table; applied to the F2 modes
from the lower starts (one-height fixed-mode replay): 0.116091492734897, 0.116060111894289, 0.114698262067474,
0.093179841544829. Cost of the restriction at 0.874886647: 5.2e-9. (The opposite variant, the W4 mode on all of
cell 322, violates v <= rho^2 on the first substeps at 7/8 and 0.874886647 and is not used.)

## 6. Raymond's chain recomputed (task 5), and Lemma G

`raymond_recompute.py` reads PLAN.json, Raymond's KERNELS.json and the regenerated TABLES.json at the
Platt-Trudgian height and imports neither `tmp/s145-1-g1/pipeline.py` nor `tmp/oai-lambda-raymond.py`. It also
checks v <= rho^2, r h < 2 and cap >= s_r on 41 points of [0, v] at every chosen substep (0 violations).

| theta | U | substeps | terminal cell | S1 margin |
|---|---|---|---|---|
| 7/8 | 118505710922701/10^15 | 60675 | 474 | 1.9227e-6 |
| 874886647/10^9 | 118473587983093/10^15 = 0.118473587983093 | 60659 | 473 | 1.9227e-6 |
| 87/100 | 29269737631519/(2.5*10^14) = 0.117078950526076 | 59945 | 468 | 1.9242e-6 |
| 4/5 | 5938882831221/(6.25*10^13) = 0.095022125299536 | 48652 | 380 | 1.9433e-6 |

The 7/8 and 4/5 rows equal the paper's values; the second row equals round 1's. Status of 0.118473587983093:
reproduced (MEASURED, exact), conditional on the half-plane, (H2), (H3).

**Lemma G (greedy dominance). PROVED under (G-mono).** Let run A start at q0 and choose modes m_k, and let run B
start at q0' <= q0 with the same menu and the rule "largest certified rate among admissible options". Assume
(G-mono): whenever a windowless mode is offered at (cell, q) with rate c, then at every q' <= q in the same cell
some option is offered with rate >= c. Then q^B_k <= q^A_k for all k, and B reaches q_e no later than the
fixed-mode replay of A from q0'. Proof: the one-step map (q + 2/c) e^{-c delta} - 2/c is increasing in q and, for
q >= 0, decreasing in c (it is the value at time delta of beta' = -2 - c beta); upward rounding is monotone;
induct on k. (G-mono) holds mode by mode because admissibility v <= rho^2 and the cap sup over [0, v] are monotone in
q and `pick` never skips a windowless option; that every generator of the consumer offers each such mode again at
lower q (for the (M1) options: the admissible kernel of largest lambda) was read in `make_xopts` only. For the other
generators it is OPEN as a code audit.
MEASURED (`compare_q.py`): on the runs at 0.874886647, 0.87 and 4/5, q^re_k <= q^replay_k at every k, and the
re-optimised rate is >= the F2 rate at every k. Round 1's estimate "difference below 1e-7" was wrong in size: the
differences are 2.9e-7, 1.2e-5 and 1.1e-4.

## 7. Davenport-Heilbronn control

Unchanged from round 1. The chain fails for DH at two Euler-product inputs: (H1), since DH has zeros with Re s > 1
and no zero-free half-plane below the classical strip; and the floors (J), which bound the Dirichlet series of the
logarithmic derivative term by term using Lambda(n) >= 0, a series that DH does not have. Lemma H, Lemma G and the
run arithmetic are statements about kernels, ODE comparison and rationals; they hold for any function and carry no
zero information.

## 8. Mis-configuration reproduction

`run_misconfig.sh` passes the fused string deliberately at theta = 874886647/10^9. It was stopped at the 20-minute
local limit with no output (machine load above 100; the process had 13% of a core). So the figure 0.117674 of round
1 is not reproduced here. What is established: the argv behaviour of the two shells (MEASURED, section 2), the
consumer's silent acceptance of the fused argument (read in the code), and a consistency check: the paper's rung E1
(base menu, no extra sets, 7/8, offset 10^-7) is 0.117708137; subtracting the theta gain 3.2e-5 gives 0.117676,
within 2e-6 of round 1's 0.117674 (the remaining difference is attributable to the newer kernel list, not checked).

## 9. Three weakest steps

1. Hypotheses. The value inherits the unrefereed half-plane at 0.874886647 (preprints not read), Raymond's (H2),
   and (H4'). Layer (c) does not recompute floors or kernel certificates; it confirms that the run uses certified
   table entries and certified rows. One new kernel row enters (H4'), with two certificates (Bernstein, Arb 64 and
   128 bits), neither written here.
2. Tight margins. The smallest admissibility margin is 3.0e-10 and the S1 margin is 1.8e-8. Both are exact
   rational comparisons, so they are not rounding risks, but the run sits at the edge of several kernels' domains;
   any correction to a rho in a certificate would move the run.
3. Lemma G's hypothesis (G-mono) is verified on outputs only. The checker's exact cap rule and the cap
   recomputation in `single_height.py` are a single implementation each (they agree with the consumer's caps on all
   substeps of four runs, which checks the rule against the consumer, not against Raymond's AF text).

## 10. Next step

None that moves the number further inside this menu: the re-optimised run is the greedy optimum of the F2 menu.
The gain over the replay is 2.9e-7. Further movement needs new floors (round 1 referee section 5: range-split
floors at low h, a t > 0 probe-measure LP) or a lower theta. A small fix worth making outside this directory: have
`qrh-tune-consume.py` reject unrecognised arguments so that a fused `--extra` list fails loudly.

## Files (all under `tmp/research-2026-11-16/push/r2-lambda-reopt-run/`)

- `run_reopt.sh`, `run_all.sh`, `runs.log`: corrected driver and log. `run_misconfig.sh`: fault reproduction (stopped, no output).
- `t78`, `t874886647`, `t87`, `t80`: `.json` (consumer output), `_verify.json` (project step verifier),
  `dump-*.steps.jsonl.gz` (per-substep dumps), `.steps.sha256`.
- `check_dump.py`, `check_*.json`: independent checker and outputs. `compare_q.py`: Lemma G measurement.
- `single_height.py`, `single_height_*.json`: one-height variants. `entries.py`, `entries.json`: entries outside F2.
- `raymond_recompute.py`, `raymond_recompute.json`: Raymond's chain. `kcert_new_kernel_p128.json`: new kernel row.
