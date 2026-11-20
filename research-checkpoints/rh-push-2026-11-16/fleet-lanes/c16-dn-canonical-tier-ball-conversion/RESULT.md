# c16-dn-canonical-tier-ball-conversion: RESULT

Date 2026-11-19/20. Kind: compute (heavy lane), round 16. No statement about zeros of zeta is made.
Requirement flags: R1 = R2 = R3 = R4 = false (section 8).
Labels: PROVED / MEASURED ("ball" where python-flint balls decide; "float64" otherwise) / ARGUED / NOT-RUN.

## 0. Verdict

**Outcome "none" on the registered scope. The 67,138 float64-undecided nodes of the canonical tier {T-NR, E_a, HEAT}
of dictionary DN are all decided in ball arithmetic: 360 by the reflection identity, 37,634 excluded, 29,144 at
T-train, 0 left undecided. No node holds out, under the c15 rule or under the stronger read "for some threshold of
the feasible interval". The recount of the c14 joint search (dictionary DJ) for the canonical lifts gives 59
functionals at T-train (all Hermitian forms JB2 with polar terms), 0 full; its 15,351 float64-open rows are all
excluded in balls. The canonical tier of DN and DJ is closed on the registered scans (MEASURED, ball-certified at the
converted nodes).**

One registered prediction failed in the extension A1 (the 22,508 nodes c15 already had at T-train): the stronger
read flags 86 nodes of the one-kernel family b2-with. They are not separators: at each of the 86 nodes, 75 to 93 of
the 350 primitive Dirichlet characters of conductor at most 60 lie on the controls' side of every threshold of the
feasible interval (section 5). They carry no score and are not a lead.

| part | nodes / rows in scope | identity | excluded (balls) | T-train (balls) | undecided | hold out, c15 rule | hold out, some threshold |
|---|---|---|---|---|---|---|---|
| A: DN canonical tier, float64-undecided nodes | 67,138 | 360 | 37,634 | 29,144 | 0 | 0 | 0 |
| A1: DN canonical tier, float64 T-train nodes of c15 | 22,508 | 0 | 0 | 22,508 | 0 | 0 | 86 flagged, 0 after the test on 350 characters |
| B: DJ (c14), all four stages, canonical lifts | 38,101,627 functionals; 4,266,644 one-signed on PA | - | 15,351 float64-open rows | 59 | 0 | 0 full | not applicable (no free parameter) |

## 1. Plan; what is new against the map

Map row G41 (dictionaries DJ and DN) and the c15 records left the canonical tier of DN open: 67,138 nodes
float64-undecided, 85 of 600 sampled ones reported "not decided at 1024 bits". This lane converts that row.
Order of work: PREREG.md (sections 1 to 8) before any node of the record; first check (200 decided nodes; the count
360); control checks; Part B float recount and ball stage; Part A main run; amendments A0 (compute) and A1
(extension, written after the Part A result and before its run); follow-up test of the 86 flagged nodes.

Finding before the run (disclosed in PREREG): the c15 ball stage never reached 1024 bits at the far-tail entries.
`nball.bratio` accepts a rung when `rad <= 1e-6 * max(abs(mid), 1e-30)`; a 256-bit ball `[+/- 1.9e-76]` passes with
midpoint 0. The c15 statement "85 of 600 not decided at 1024 bits" is a 256-bit statement. With a relative
acceptance test the entries resolve at 256 to 1024 bits.

## 2. Objects, statistic, ladder (as registered)

- Objects: 650 pairs of c15 restricted to the canonical classes (P 23, PX 506, PH 24; C2 5, C3 10, C4 10; H2, H3,
  H4 24 seeded members each). Names equal to the stored c15 objects (checked at the start of every run).
- Nodes: `PA/canon/rows_und` of c15 run 2: b1-Aw 19,253; b3-with 18,381; b2-with 14,652; b5l-with 14,652; b5m-with
  80; b5p-with 80; b6-with 40.
- Statistic: sign(V1 - lam V2); node status by the c15 interval logic `nsolve.solve_sign` (T-train / excluded /
  undecided), entries in balls when float64 leaves them undecided or within 20 half-widths of a favourably
  feasible interval. Hold-out: primary = c15 rule at the interval midpoint; secondary = some lam of a feasible
  interval meets the counts (at least 23 of 24 PH same sign, at least 23 of 24 opposite in each of H2, H3, H4).
- Ladder 128, 256, 512 bits; extended rungs 1024, 2048 (the registered rule at 512 bits); a rung is accepted when
  the radius is at most 1e-6 of the absolute midpoint.
- Code: `cball.py` (driver; uses `nball.bvalue`, `nsolve.solve_sign`, `nf.eval_group`, `ballk.py`, `jball.py`
  unchanged), `c14canon.py` (Part B; uses `jan.criterion`, `jan.optimistic`, `jball.bsign` unchanged).

## 3. Checks before the main run

| check | result |
|---|---|
| first check: 200 float64-decided nodes of the c15 canonical tier (seed 160001), all 554 training entries recomputed in balls (110,800 ball entries) | 200 of 200 statuses equal the stored ones (50 T-train, 150 excluded); unit `rh-c16dn-repro-1119212349` |
| reflection-identity nodes among the 67,138 | 360 (b6-with 40; b2-with, b5l-with, b5m-with, b5p-with 80 each): the referee's count |
| Lemma J1-Q as a tie in balls (256 bits, 34 HEAT pairs x 20 seeded nodes = 680 comparisons): a1-without on the HEAT pair minus a1-without on (zeta, same chi) | 680 of 680 difference balls contain 0; largest radius 4.5e-54 (1.3e-73 of the value) |
| Lemma J1-L as ties: L3_A without polar terms, HEAT minus zeta; L3_B, HEAT twist minus chi; L2_A and L2_B, difference minus tau h^2/2 | 680 of 680 contain 0 in each of the four; largest radius 6.9e-74 |
| contrast (not ties): a1-with and b2-with, HEAT pair minus positive pair | 0 of 680 contain 0; differences up to 0.73 and 1.9e-3 |
| every control kernel has a ball value excluding 0 at one of u = 0.3, 0.7, 1.1 (97 pairs; A with and without polar terms, B) | 291 of 291 kernel reads |
| Part B reproduction: one-signed counts and FE-tier T-train per run against the stored c14 summaries | equal in all 40 runs (4,266,644 one-signed; FE tier 59) |

The J1 ties hold by construction of the lane's ball kernels (`BHeat.f_jets` multiplies the jet of K3_zeta by the
Gaussian series); the check confirms that the code implements the lemma, not the lemma.

## 4. Part A: the 67,138 nodes

Decomposition as registered (`out/summary.json`, `out/merged.json`):

| part | family | nodes | identity | excluded | T-train | undecided | predicted T-train | hold out (both reads) | largest rung used (nodes) |
|---|---|---|---|---|---|---|---|---|---|
| quotient value, minors | a1-with, a2-with, a3-with | 0 | - | - | - | - | 0 | 0 | - |
| quotient log step | b6-with | 40 | 40 | 0 | 0 | 0 | 0 | 0 | - |
| second log differences, threshold | b1-Aw | 19,253 | 0 | 19,253 | 0 | 0 | 0 (holds) | 0 | 128: 4,172; 256: 10,805; 512: 4,276 |
| second log differences, ratio | b3-with | 18,381 | 0 | 18,381 | 0 | 0 | fewer than 5,000 (holds) | 0 | 128: 3,300; 256: 10,805; 512: 4,276 |
| third log differences, threshold | b2-with | 14,652 | 80 | 0 | 14,572 | 0 | more than 5,000 (holds) | 0 | 128: 2,657; 256: 7,117; 512: 4,189; 1024: 609 |
| third log differences, ratio | b5l-with | 14,652 | 80 | 0 | 14,572 | 0 | fewer than 7,000 (**fails**: 14,572) | 0 | same as b2-with |
| third log differences, mixed | b5m-with, b5p-with | 160 | 160 | 0 | 0 | 0 | 0 | 0 | - |
| without-polar reads | b1-Ao, b1-B, b3-without, b4p-without | 0 | - | - | - | - | 0 | 0 | - |
| product nodes | c1, c2, c3 | 0 (not run) | - | - | - | - | - | 0 | - |
| total | | 67,138 | 360 | 37,634 | 29,144 | 0 | | **0** (registered prediction holds) | no entry needed 2048 bits; no entry failed |

2,555,446 ball entries. Every undecided node of the tier is a with-polar read; the far-tail structure is the same in
all of them:

1. **Why float64 could not decide (MEASURED, balls; cross-checked with mpmath).** For abs(u) between 1.59 and 2.47
   the kernel with polar terms of zeta is e^(v/2)(1 + eps_z) and that of a HEAT member is c e^(v/2)(1 + eps_h) with
   eps_z, eps_h doubly exponentially small. Log differences of both are of that size and of the same sign (feasible
   intervals of the T-train nodes have ends between 8e-188 and 1.2e-12 in absolute value); the HEAT value is 0.90
   to 0.92 (tau = -0.1) and 0.58 to 0.64 (tau = -0.5) of the zeta value at the 9 nodes recomputed with mpmath.
2. **b1-Aw and b3-with: excluded at all 37,634 nodes, and always by HEAT alone.** At every one of these nodes some
   threshold rejects a training T-NR pair and some threshold rejects a training E_a pair while keeping the 529
   positives one-signed; none rejects a training HEAT pair (pattern "T-NR yes, E_a yes, HEAT no" at 37,634 of
   37,634). The zeta value is the extreme positive value and both training HEAT values lie between 0 and it, on the
   positives' side.
3. **b2-with and b5l-with: T-train at all 29,144 non-identity nodes, none holds out.** The feasible interval lies
   between the zeta value and the farther training HEAT value (interval ends equal to the mpmath values to 5e-16,
   the float64 rounding of the stored ends). The primary rule stops at held-out T-NR at every node (the first two
   held-out T-NR members are both on the positives' side). Secondary read: at every node and every threshold of the
   interval the smallest of the three counts (PH same, H2 opposite, H3 opposite) is at most 1 of 24 (0 at 1,364
   nodes, 1 at 13,208 nodes, per family); the HEAT stage of the secondary read is never reached.
   Full counts at 16 sampled nodes (`out/heldout_sample_*.json`): held-out T-NR opposite 0 or 1 of 24; held-out
   E_a opposite 3 to 15 of 24; PH 24 of 24; held-out HEAT (b2-with) 24 of 24 near the zeta end of the interval,
   10 at the midpoint, 8 near the HEAT end; (b5l-with) 0 of 24 at all three thresholds.
4. **Reason for the hold-out failure (ARGUED).** The training T-NR members sit at the smallest split primes 5 to
   13; the held-out ones at split primes of characters of conductor 14 to 40, which are larger. For a T-NR A
   kernel the third log difference at abs(u) near 2 is governed by the shifted copy at u - log p0; for large p0
   that copy is on the far side of 0 and its contribution has one sign. T-train at these nodes is a property of the
   five training primes, not of the class.

Nodes computed on both machines (amendment A0): 2,730 family-nodes, 2,730 equal in status, rejection pattern, sign,
interval ends (to 1e-9 relative) and both hold-out reads.

## 5. Extension A1: the 22,508 nodes c15 had at T-train (b2-with 15,784; b5l-with 6,724)

Registered after the Part A result, before its run (PREREG section 9). `out/feas.json`, unit
`rh-c16dn-feas-1120000344`.

- Status in balls: 22,508 of 22,508 at T-train (prediction holds). 192,610 ball entries, all accepted at 128 bits.
- Primary rule: 0 hold out (prediction holds; as c15). Exit class, b2-with: held-out T-NR 9,451, held-out E_a
  5,597, PH 650, held-out HEAT 86; b5l-with: held-out T-NR 6,724.
- Secondary read: b5l-with 0; **b2-with 86 nodes flagged (prediction 0 fails).** All 86 have abs(u) between 0.628
  and 0.652, h between 0.51 and 0.57 (stencil points near 1.44, 0.91, 0.38, -0.15 up to the sign of u); the feasible
  interval has width at most 1.8e-4. At a threshold within 9e-6 of its zeta end: PH 23 of 24, held-out T-NR 24, held-out E_a 23 or 24, held-out HEAT 23 or 24. At the
  interval midpoint the held-out HEAT count is 2: the c15 rule missed these nodes only through its choice of
  threshold.
- **Follow-up test (decisive, `diag3.py`, `out/flagged_allchars.json`).** b2-with reads the A kernel only: its value
  on a positive pair is the third log difference of the kernel of zeta or of a character. The zeta value is one end
  of the feasible interval at all 86 nodes (the training characters, conductor at most 13, lie beyond it). For all
  350 primitive characters of conductor 3 to 60 (one per conjugate pair; balls at 128 bits): at each of the 86
  nodes between 75 and 93 characters (median 83) lie on the controls' side of every threshold of the interval; no
  node has fewer than 75. 74 characters (conductors 35 and above) are on the wrong side at all 86 nodes and 101 at
  some node; the smallest conductor among them is 31; no training character is. Independent mpmath values at 6 nodes x 4 characters confirm the side (for example node
  12318: interval [0.158021, 0.158173], zeta 0.158173, chi35.2c 0.0937, chi37.5c 0.0975).
- Reading: the 86 nodes are not one-signed on Dirichlet L-function kernels. The held-out positives of the pair
  design did not detect it: 12 of the 24 PH pairs have zeta on the A side (the same value as the training pairs)
  and the other 12 use 12 characters of conductor at most 40, of which 11 fall on the positives' side. The
  flagged nodes die on the positive side; they are not a lead for round 17.

## 6. Part B: c14 dictionary DJ, canonical lifts only

Objects and signs as stored by c14 (833 pairs; T-NR there at p0 = 3). `out/c14count.json`, `out/c14ball.json`.

| stage | functionals | one-signed on PA | rejects a training T-NR / E_a / HEAT pair | T-train, canonical | full | float64-open rows | after balls: T-train / undecided / excluded |
|---|---|---|---|---|---|---|---|
| registered grid | 1,487,558 | 94,531 | 1,537 / 37,763 / 6 | 0 | 0 | 233 | 0 / 0 / 233 |
| registered draws | 3,299,608 | 376,714 | 58,662 / 104,563 / 74 | 2 | 0 | 1,385 | 0 / 0 / 1,385 |
| adaptive stage | 316,193 | 30,084 | 12,707 / 6,380 / 90 | 35 | 0 | 11 | 0 / 0 / 11 |
| amendment B2 draws | 32,998,268 | 3,765,315 | 585,973 / 1,044,363 / 805 | 22 | 0 | 13,722 | 0 / 0 / 13,722 |
| total | 38,101,627 | 4,266,644 | 658,879 / 1,193,069 / 975 | 59 | 0 | 15,351 | 0 / 0 / 15,351 |

- The 59 canonical T-train functionals are the 59 FE-tier functionals of c14 (JB2-with: draws 2, adaptive 35, B2
  draws 22): dropping BLS from the tier adds nothing. Prediction "about 150" fails on the low side; the registered
  bounds 59 to 975 hold.
- Held-out counts of the 59: positives 18 to 22 of 24 (23 needed); largest minimum over the three classes of the
  held-out opposite count 7 of 24. None could reach the rule with undecided entries read in favour.
- Float64-open rows (favourable reading feasible, strict reading not): 15,351, all in JB1 (with polar terms 9,232;
  without 6,119). Ball stage with ladder 128 to 4096 bits: 225,065 ball signs; 15,351 excluded, 0 at T-train, 0
  undecided.
- Largest minimum over classes of the held-out opposite count among one-signed rows with at least 23 held-out
  positives: 6 of 24.

## 7. Controls

| control | where it enters | outcome |
|---|---|---|
| HEAT (backward heat, equal tau on both members) | Part A | blocks b1-Aw and b3-with at every converted node (never rejectable); rejectable at every b2-with and b5l-with node, where held-out T-NR then blocks. J1-Q and J1-L appear as ties in balls on the pairs without polar terms |
| T-NR at a split prime | Part A, A1 | rejectable in training at all converted nodes; held-out members on the positives' side (0 or 1 of 24 opposite) at the 29,144 ball T-train nodes |
| E_a | Part A, A1 | rejectable in training at all converted nodes; held-out opposite 3 to 15 of 24 at sampled nodes |
| positives beyond the training set (350 characters, conductor up to 60) | A1 follow-up | 75 to 93 on the wrong side at each of the 86 flagged nodes |
| Part B classes T-NR (p0 = 3), E_a, HEAT | recount | 59 T-train, 0 full |
| DH, sign-twisted primes, unimodular twist, Beurling, theta^w, phase-rotated transfer operator | not in the canonical tier | not run here; they can only remove nodes (a tier with more classes has fewer T-train nodes) |

## 8. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | no argument about zeta; a certified conversion of a search with outcome "none" |
| R2 (height-uniform, every window) | false | kernel reads on [-2.6, 2.6]; no conclusion of that form |
| R3 (every control fails structurally) | false | the opposite: HEAT is never rejectable at 37,634 nodes; where the three training classes are rejected the held-out T-NR members are not; the 86 flagged nodes fail on the positives |
| R4 (reaches the critical line) | false | none registered, none obtained |

## 9. Compute record

Server through `rhrun` only; `rhstatus` read before each launch. All units ended or were stopped by name; none is
running. Slice at 15 to 27 GB; machine 74 to 88 GB available; load average 110 to 194 during the main run.

| unit | request | what | wall time |
|---|---|---|---|
| `rh-c16dn-repro-1119212327` | 16 cores, 8 GB | failed at start (code not yet copied: a zsh modifier in the rsync target) | seconds |
| `rh-c16dn-repro-1119212349` | 16 cores, 8 GB | first check, 200 nodes | 136 s |
| `rh-c16dn-c14count-1119212349` | 4 cores, 12 GB | Part B float recount (largest sign matrix int8[3,217,607 x 833] = 2.68 GB, masks about 8 GB, printed before loading) | 3 min of compute, about 11 min wall |
| `rh-c16dn-c14ball-1119213706` | 4 cores, 8 GB | Part B ball stage | about 3 min |
| `rh-c16dn-main-1119213705` | 12 cores, 12 GB | Part A, first start; stopped by name after 12 minutes (relaunched with 16 workers, resume and checkpoints) | 12 min |
| `rh-c16dn-main2-1119215038` | 16 cores, 12 GB | Part A from the front of the job list; stopped by name at job 1,155 of 3,396 once the merged coverage was complete | 131 min |
| `rh-c16dn-feas-1120000344` | 16 cores, 12 GB | extension A1 | 10 min |

Planned memory was printed before allocation in every script (Part A: 2.08 MB of float64 blocks per worker; peak
unit memory read once: 0.18 GB). GPU not used (interval arithmetic).

Departures, stated: (i) amendment A0: 45,644 of the 67,138 family-nodes were computed by local helper runs (single
process each, `scripts/memcap.sh 8`, up to five at a time), because the server delivered 5 of the 16 requested
cores at load average above 110; the first five local runs lasted 34 to 36 minutes, above the 20-minute local
limit; the 45 later runs lasted 1.5 to 9.5 minutes (50 local runs in all). (ii) The control checks, the mpmath checks, the held-out sample
and the 350-character test ran locally (single process, memcap 8 GB). (iii) Polling was at intervals of 1 to 9
minutes. (iv) The Part B recount read the c14 lane's stored files on the server (read only).

## 10. Three weakest steps

1. **Scope of "closed".** A finite scan under the c15 conventions: 2.9 million pair family-nodes, exact only in the
   last parameter; the quotient minors a2, a3 and the product families were not re-read here (c15: no undecided
   node in a PA tier, product families without any ball evaluation). The lifts are the c15 lifts (HEAT with equal
   tau; T-NR at the smallest split prime in training). No theorem says DN or DJ contains no separator against
   {T-NR, E_a, HEAT}.
2. **What is certified and what is not.** Balls decide the entries that float64 left undecided or near a feasible
   interval; entries farther than 20 float64 half-widths are kept in float64 with the c15 noise model. The ball
   kernel of HEAT with polar terms (`ballk.BHeat`) truncates the theta series inside the integrand at
   e^(-prec ln 2 - 60) without adding that tail to the enclosure; the omitted amount is below the working radius
   but the enclosure is not rigorous in the strict sense. The mpmath recomputation (9 far-tail nodes, 420 digits)
   agrees to float64 rounding of the stored ends. Midpoints of accepted balls are carried in float64.
3. **The secondary read and the hold-out design.** The secondary read was defined in this lane; it was applied to
   the canonical tier of DN only (51,652 T-train nodes), not to the six-class or nine-class tiers (0 T-train there)
   and not to DJ (no free threshold). The 86 flagged nodes were refuted with 350 characters by balls at 128 bits and
   a 24-value mpmath check; the refutation is for those 86 nodes only. The hold-out rule of c14/c15 is weak for
   A-only families: half of the held-out positive pairs repeat the zeta kernel, and a threshold fixed at the
   interval midpoint hides nodes that pass at another threshold. REFEREE.md is a second pass by this lane's agent
   with separate code; an independent referee is owed.

## 11. For the orchestrator

- Outcome "none": no round-17 lead from this lane; no score.
- Proposed map wording (row G41, DN final): "canonical tier {T-NR, E_a, HEAT}: closed, MEASURED with ball
  certification of all 67,138 formerly undecided nodes (360 identity, 37,634 excluded by HEAT alone, 29,144
  T-train) and of the 22,508 float64 T-train nodes; 0 hold out; 86 one-kernel nodes (third log difference of the
  kernel with polar terms, abs(u) near 0.64, h near 0.53) pass a threshold-optimised hold-out and fail on 75 to 93
  of 350 characters of conductor up to 60. DJ canonical tier: 59 at T-train, 0 full, 15,351 open rows excluded in
  balls."
- Correction to the c15 record: "85 of 600 not decided at 1024 bits" was an artefact of an absolute acceptance
  floor in `nball.bratio`. The FE tier of c15 (60,651 undecided nodes) was not re-read here.
- Not run: FE tier of DN; the secondary read on other tiers; quotient minors and product families in balls; a HEAT
  class with unequal tau.
- Design note for later searches: test positives of A-only families on a full character set, and read hold-out
  counts over the whole feasible threshold interval.

## 12. Files

`PREREG.md` (sections 1 to 8; amendments A0, A1), `RESULT.md`, `REFEREE.md`, `lanes.jsonl`.
Code: `cball.py`, `c14canon.py`, `cchk.py`, `merge.py`, `summ.py`, `diag1.py` (probe), `diag2.py` (held-out
sample), `diag3.py` (350 characters), `refcheck.py`, `refcheck2.py` (mpmath), `local_lane.sh`, `local_lane2.sh`;
copies of c15/c14 code as text: `nball.py`, `nsolve.py`, `nf.py`, `nobj.py`, `ballk.py`, `jball.py`, `jk.py`,
`jobj.py`, `jf.py`, `jan.py`, `kern.py`, `funcs.py`, `sets.py`.
Data: `out/merged.json` (67,138 rows), `out/summary.json`, `out/main.json.part` (server rows), `out/local/` (50
helper slices), `out/repro.json`, `out/cchk.json`, `out/feas.json`, `out/summary_feas.json`,
`out/flagged_allchars.json`, `out/heldout_sample_b2.json`, `out/heldout_sample_b5l.json`, `out/c14count.json`,
`out/c14ball.json`, `out/refcheck_b1.json`, `out/refcheck_b2.json`, `out/refcheck2.json`; `logs/` (seven unit logs,
local logs).
