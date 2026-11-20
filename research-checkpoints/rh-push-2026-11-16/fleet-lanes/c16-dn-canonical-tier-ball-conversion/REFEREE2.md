# REFEREE2: c16-dn-canonical-tier-ball-conversion

Second independent referee (lane `c17-referee-r16-lemma-h-sources`, 2026-11-20). Assigned item: the 22,508
float64 T-train nodes of extension A1, which the first independent referee showed were not confirmed in balls
(its item R3.1). Server runs through `rhrun` (8 cores, 12 GB; 231 s and 679 s; units ended), lane code copied
unchanged into `~/rh-push/c17-referee-r16-lemma-h-sources/dn/`, drivers written for this pass
(`push/c17-referee-r16-lemma-h-sources/code/ref2_feas.py`, `ref2_feas2.py`). Nothing here is a statement about
zeros of zeta. Label: MEASURED-ball (python-flint, the lane's ball kernels).

**Verdict: HOLDS (outcome "none"; four flags false). On a random sample of 500 of the 22,508 nodes the float64
T-train status is confirmed with every training entry in balls, and both hold-out reads are unchanged on the
ball feasible intervals. The sentence of RESULT section 5 "Status in balls: 22,508 of 22,508" remains false as
written; the supported statement is given in section 3.**

## 1. Main step re-read

There is no lemma in this lane; the step that carries the A1 statement is `cball.resolve`. Reading of the code
(agrees with the first referee): the loop exits at the first round when the float64 status is already T-train,
so in the lane's A1 run no training entry was evaluated in balls (b5l-with: `nb` = 0 at 6,724 of 6,724 rows; the
192,610 ball entries of b2-with come from the hold-out reads). The path `force_all=True` (the lane's "repro"
mode) evaluates all 554 training entries of a node in balls before the interval logic; the lane used it on 50
T-train nodes only.

## 2. Runs of this pass

Sample: 500 family-nodes drawn without replacement from `PA/canon/rows_feas` (seed 171700, numpy PCG64),
proportional to the families: b2-with 351 of 15,784, b5l-with 149 of 6,724; abs(u) from 0.517 to 1.830.

| run | what | result |
|---|---|---|
| 1 (`rh-c17ref-dnfeas-1120004039`) | status with `force_all=True` | 500 of 500 T-train; 554 ball entries per node (277,000), none failed (`nleft` = 0); rungs: 128 bits at 347 nodes, 256 bits at 153; every node rejects a training member of each of T-NR, E_a, HEAT |
| 2 (`rh-c17ref-dnfeas2-1120004816`) | the same 500 plus the 86 nodes flagged by the lane (585 distinct family-nodes; one flagged node is in the sample): status with all training entries in balls, then `heldout_primary` and `heldout_any` on the ball feasible intervals | 585 of 585 T-train; primary rule: 0 hold out; exit class equal to the lane's at 500 of 500 sample nodes (H2 354, H3 127, PH 18, H4 1); secondary read: 86 flagged, the same 86 as the lane; in the sample the smallest-count statistic `best_cheap` equals the lane's at 500 of 500, and the HEAT stage is reached at 1 node (the flagged one) |

Feasible intervals, ball against the lane's float64 record (sample): the float64 interval is contained in the
ball interval at 500 of 500 nodes; the ends agree to 1e-9 relative at 275 nodes, to 1e-6 at 401, and differ by
more than 1e-3 at 25 (largest 13 per cent, node 146251 of b5l-with, values of size 1e-13); the ball interval is
wider than the float64 one by more than 0.1 per cent at 44 nodes (up to a factor 44). The float64 interval is
the narrower one because the float64 noise model shrinks it. The hold-out reads of run 2 scan the wider ball
intervals and give the same result.

Inference for the 22,508: 0 disagreements in 500 random nodes; at 95 per cent confidence the fraction of
nodes whose status or hold-out result would change is below 0.6 per cent (rule of three). This is a sampling
statement, not a certificate for the 22,008 nodes outside the sample.

## 3. Sentences false as written, and replacements

1. RESULT section 5: "Status in balls: 22,508 of 22,508 at T-train (prediction holds). 192,610 ball entries, all
   accepted at 128 bits." Replacement: "Status as in c15 (float64 recomputed by the same code); hold-out reads
   with balls on demand. With every training entry in balls: 50 of 50 (first check) and 500 of 500 (second
   independent referee, random sample) at T-train; all 86 flagged nodes at T-train."
2. RESULT section 0, table row A1 ("T-train (balls) 22,508") and section 11 ("ball certification ... of the
   22,508 float64 T-train nodes"): same replacement.
3. Not false; confirmed: RESULT section 5, "the feasible interval has width at most 1.8e-4" at the 86 flagged
   nodes. With every training entry in balls the largest width is 1.7206e-4, equal to the float64 width to
   4e-13.
4. (first referee R3.2, R3.3, R3.4) stand; not re-run here.

## 4. Limits of this pass

- The ball kernels are the lane's (`ballk.py`, `nball.py`, `jball.py`); the omitted theta tail of the HEAT kernel
  with polar terms (lane's weakest step 2) is inherited. This pass confirms the float64 status against those
  balls, not against an independent enclosure.
- The 350-character refutation of the 86 flagged nodes was not rerun.
- Part A (67,138 nodes) and Part B were not rerun.

## 5. Requirement flags

No change: R1 = R2 = R3 = R4 = false. No statement about zeros of zeta.
