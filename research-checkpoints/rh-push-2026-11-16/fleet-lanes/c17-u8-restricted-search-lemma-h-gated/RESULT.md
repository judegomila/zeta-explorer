# c17-u8-restricted-search-lemma-h-gated: RESULT

Date 2026-11-19 (PST). Kind: compute (gated), round 17, combinable 3 of round 16. No statement about zeros of zeta
is made. Requirement flags: R1 = R2 = R3 = R4 = false (section 7).
Labels: PROVED / CLASSICAL / MEASURED ("ball" where python-flint balls decide; "float64" otherwise) / NOT-RUN.

## 0. Verdict

**Outcome "none" on the registered scope: 0 hold-out survivors (the registered prediction holds).**
Dictionary DU (single-kernel sign conditions with at least three monomial terms with distinct heat exponents; minor
orders 5 and 6 and three-term Turan forms on 5 and 6 nodes; up to four real parameters; K3 read on [-4, 4], Kpol
read on [-3, 3]; canonical lifts T-NR, E_a, HEAT with abs(tau) <= 0.005; thresholds scanned over the whole line):
1,966,200 family-nodes evaluated; 1,965,142 excluded, 1,058 at T-train (all in one family: T6 with polar terms),
0 hold-out survivors, 0 undecided (MEASURED, ball-certified at every node that float64 left T-train or undecided).

One node passes the hold-out read of a **two-class** tier, {T-NR, HEAT} (thresholded 6 x 6 translation minor of the
kernel without polar terms, stream id 6). It is not a survivor of the registered question (all 8 training and all
24 held-out E_a members are on the positives' side) and its threshold lies within a relative distance 2.03e-52 of
zeta's own value: by Lemma H (C1) this is an identification of a kernel value, not an inequality with a margin
(section 5). It carries no score.

The cell U8 is closed on the searched range as a MEASURED finite search; it stays silent outside it (section 8).

## 1. Plan; what is new against the map

Map row G36 (dictionary D: orders 2 to 4, three parameters, nodes in [-2.6, 2.6]) and class U8 of STRATEGY section
4.0 left open: order above 4, a fourth parameter, nodes outside [-2.6, 2.6]. Lemma H (c16 referee lane; second referee
`c17-referee-r16-lemma-h-sources/REFEREE2-lemma-H.md`, "HOLDS") decides on paper every monomial bound, two-term
condition and equal-S functional for kernels without polar terms. This lane searches what Lemma H leaves:
functionals with at least three distinct heat exponents, and the reads with polar terms.

Order of work: (1) PREREGISTRATION.md sections 1 to 11 while the gate was closed (16:34 to 16:59 PST); (2) code and
pipeline controls on a separate node stream; (3) gate open at 16:59, amendments A1 to A8 written before the launch;
(4) search (server and local); (5) post-pass in balls; (6) recounts.

New in the method (against c13 to c16): the threshold of every thresholded family is scanned exactly over the whole
real line (elementary intervals of the breakpoint arrangement, with error bands), in float64 and in balls; each
object has its own precision ladder; the HEAT column of K3 reads is computed from zeta's values alone (C4) and used
as the first filter.

## 2. Gate, registration, deviations

- Gate: the referee file appeared between 16:47 and 16:59 PST with first line "HOLDS"; no registered T3/T6 node and
  no search job ran before. Disclosed: one smoke run of the classifier on the first 6 nodes of 4 minor streams in
  both reads (48 nodes, all excluded) ran before the gate; the nodes stayed in the streams.
- Registered deviations (PREREGISTRATION section 12, A1 to A9): Kpol window [-3, 3] instead of [-4, 4]
  (precision cost; Kpol reads between 3 and 4 NOT-RUN); counts lowered before the run; float64 kernel values from
  128-bit ball midpoints; error-band scan; E_a ball evaluation repaired (the copied `ballk.BEA` returns balls of
  relative radius above 1 in a range of the Bessel argument: found by the float-against-ball control); the run was
  split (A9) because both machines were saturated.
- Not registered in advance, done after the search and reported here: (i) the post-pass `resolve.py`; (ii) the
  recount `recount.py` of the two-class tiers on the K3 thresholded minors; (iii) `taustar.py`. Reason for (i),
  (ii): the search code formed the breakpoints V1/V2 at 128 bits whatever the precision of V1 and V2 (an outward
  rounding: it can only produce "undecided", never a wrong status). 96 node-mu of T3/T6 (K3, all at rho = -1,
  where zeta's two first terms cancel by the parametrisation and T-NR members with p0 = 7, 11 differ from zeta by
  1e-53 relative) were left "undecided at 16,384 bits"; with the breakpoints formed at the working precision all
  96 are excluded at 256 or 512 bits.
- Deadlines: the first version of the driver checked the deadline only when a chunk took more than 30 s, so some
  families ran past it (one local lane ran 1,472 s against the 20-minute local rule). Corrected for the later
  lanes. Families marked "cut" report the completed prefix of the registered stream.

## 3. Controls on the pipeline (run before the search; identical output on the Mac and on the server)

| control (PREREGISTRATION section 9) | result |
|---|---|
| planted separator, sign minors (positives exp(-a u^2), controls -exp(+a u^2)): TM5, TM6, DM5, DM6, 25 nodes each | 100 of 100 nodes T-train and hold-out survivor (balls, 128 bits) |
| planted separator, thresholded minors TMt5, DMt6, 10 nodes each | 20 of 20 T-train and hold-out survivor |
| planted separator, T3 and T6 (controls exp(-a u^2)(1 + c u^2)), 40 nodes x 18 mu each, float64 then balls | T3: 694 of 720 T-train, 682 hold-out survivors; T6: 720 and 699; with abs(rho) <= 1e-2: 160 of 160 in each |
| zeta, log-concavity row K3(u)^2 - K3(u-h) K3(u+h) > 0, 2,000 nodes in [-4, 4] | 2,000 positive in balls, 2,000 in float64 log-domain |
| zeta, translation minors of K3 of orders 2 and 3, 500 nodes each | 500 and 500 with the expected sign ((-1)^(m(m-1)/2) for k > 0, + for k < 0) |
| P = {zeta}: every node one-signed | 20 of 20 |
| float64 scan against ball scan, T3/T6, both reads, 40 nodes x 6 mu x 4 tiers | 3,782 tier decisions agree, 0 disagree; 58 float64-undecided; 0 ball-undecided |
| HEAT Kpol, float64 quadrature against balls | largest relative difference 4.4e-16 |
| E_a, float64 Bessel code against balls, 2,400 values | largest difference of log abs K 3.7e-13; 0 sign mismatches |
| Lemma H as a tie in the code: monomial on a HEAT member (series product of `ballk.BHeat`) minus exp(tau S/4) x zeta's monomial, 200 monomials | 200 of 200 difference balls contain 0; largest relative radius 8.2e-73 |

The Lemma H row checks that the code implements the multiplier, not the lemma (same remark as in c16).

## 4. Result of the search

Counts are family-nodes (minors: one node; T3, T6: one (u, h, mu); the threshold lam is scanned and is not counted).
| family | read | nodes done (planned) | decided by the HEAT column before other columns | positives one-signed for some threshold | excluded | T-train (balls) | hold-out survivors, thresholds scanned | undecided | largest rung used |
|---|---|---|---|---|---|---|---|---|---|
| TM5 | K3 | 40,000 (40,000) | 35,000 | 14 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 4096 |
| TM5 | Kpol | 40,000 (40,000) | - | 0 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 2048 |
| TM6 | K3 | 40,000 (40,000) | 35,000 | 1 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 4096 |
| TM6 | Kpol | 40,000 (40,000) | - | 0 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 2048 |
| DM5 | K3 | 40,000 (40,000) | 35,000 | 0 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 8192 |
| DM5 | Kpol | 40,000 (40,000) | - | 1 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 2048 |
| DM6 | K3 | 40,000 (40,000) | 35,000 | 0 of the 5000 recount nodes | 40,000 | 0 | 0 | 0 | 8192 |
| DM6 | Kpol | 38,500 (40,000) cut | - | 0 of the 5000 recount nodes | 38,500 | 0 | 0 | 0 | 2048 |
| TMt5 | K3 | 10,000 (10,000) | 2,268 (lazy exit) | 3,013 | 10,000 | 0 | 0 | 0 | 256 |
| TMt5 | Kpol | 10,000 (10,000) | 3,259 (lazy exit) | 3,628 | 10,000 | 0 | 0 | 0 | 128 |
| TMt6 | K3 | 9,900 (10,000) cut | 1,666 (lazy exit) | 2,469 | 9,900 | 0 | 0 | 0 | 1024 |
| TMt6 | Kpol | 10,000 (10,000) | 2,461 (lazy exit) | 2,732 | 10,000 | 0 | 0 | 0 | 128 |
| DMt5 | K3 | 10,000 (10,000) | 3,605 (lazy exit) | 4,021 | 10,000 | 0 | 0 | 0 | 512 |
| DMt5 | Kpol | 10,000 (10,000) | 3,758 (lazy exit) | 4,190 | 10,000 | 0 | 0 | 0 | 128 |
| DMt6 | K3 | 10,000 (10,000) | 2,405 (lazy exit) | 2,688 | 10,000 | 0 | 0 | 0 | 512 |
| DMt6 | Kpol | 10,000 (10,000) | 2,134 (lazy exit) | 2,347 | 10,000 | 0 | 0 | 0 | 128 |
| T3 | K3 | 646,920 (1,800,000) cut | - | 329,448 | 646,920 | 0 | 0 | 0 | 512 after the post-pass (56 nodes were left at 16384 by the search run) |
| T3 | Kpol | 180,000 (180,000) | - | 68,407 | 180,000 | 0 | 0 | 0 | 128 |
| T6 | K3 | 642,960 (1,800,000) cut | - | 328,950 | 642,960 | 0 | 0 | 0 | 512 after the post-pass (40 nodes were left at 16384 by the search run) |
| T6 | Kpol | 97,920 (180,000) cut | - | 41,780 | 96,862 | 1058 | 0 | 0 | 128 |
| total | | 1,966,200 | | | 1,965,142 | 1058 | 0 | 0 | |

Leave-one-class-out recount.

| family | read | scope of the recount | {T-NR, E_a}: T-train / hold-out | {T-NR, HEAT}: T-train / hold-out | {E_a, HEAT}: T-train / hold-out | best hold-out score of a two-class tier (23 needed) |
|---|---|---|---|---|---|---|
| TM5 | K3 | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| TM5 | Kpol | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| TM6 | K3 | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| TM6 | Kpol | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DM5 | K3 | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DM5 | Kpol | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DM6 | K3 | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DM6 | Kpol | first 5,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| TMt5 | K3 | first 1,000 nodes, balls; {T-NR, HEAT} also on all nodes (508 T-train, 0 hold-out) | 0 / 0 | 50 / 0 | 0 / 0 | 21.0 |
| TMt5 | Kpol | first 1,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| TMt6 | K3 | first 1,000 nodes, balls; {T-NR, HEAT} also on all nodes (580 T-train, 1 hold-out: section 5) | 0 / 0 | 51 / 1 (the search run left this hold-out read undecided; decided in the recount) | 0 / 0 | 24.0 |
| TMt6 | Kpol | first 1,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DMt5 | K3 | first 1,000 nodes, balls; {T-NR, HEAT} also on all nodes (1 T-train, 0 hold-out) | 0 / 0 | 0 / 0 | 0 / 0 | 21.0 |
| DMt5 | Kpol | first 1,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DMt6 | K3 | first 1,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| DMt6 | Kpol | first 1,000 nodes, balls | 0 / 0 | 0 / 0 | 0 / 0 | - |
| T3 | K3 | all 646,920 node-mu; float64 certified (+ float64-undecided, not converted unless the hold-out read was favourable) | 84,014 (+6,721) / 0 float64, 0 balls | 418 (+20,806) / 0 float64, 0 balls | 0 (+1,636) / 0 float64, 0 balls | - |
| T3 | Kpol | all 180,000 node-mu; float64 certified (+ float64-undecided, not converted unless the hold-out read was favourable) | 0 (+0) / 0 float64, 0 balls | 0 (+0) / 0 float64, 0 balls | 48 (+283) / 0 float64, 0 balls | - |
| T6 | K3 | all 642,960 node-mu; float64 certified (+ float64-undecided, not converted unless the hold-out read was favourable) | 98,719 (+7,495) / 0 float64, 0 balls | 565 (+20,004) / 0 float64, 0 balls | 0 (+1,536) / 0 float64, 0 balls | - |
| T6 | Kpol | all 97,920 node-mu; float64 certified (+ float64-undecided, not converted unless the hold-out read was favourable) | 1,079 (+512) / 0 float64, 0 balls | 398 (+1,382) / 0 float64, 0 balls | 543 (+1,708) / 0 float64, 0 balls | 17 |

Reading of the main table.

1. **Sign minors of orders 5 and 6, K3 read (160,000 nodes): the HEAT column decides.** At 0 of 160,000 nodes does a
   training HEAT member have the sign opposite to zeta's (registered prediction (i) holds). The tau* column, computed
   from zeta's values alone on the first 300 nodes of each stream (`taustar.json`): the sign of
   det[exp(tau p^2/4) K3(p)] does not change for abs(tau) up to 81.9 at 1,200 of 1,200 nodes, so tau*(F) is above
   81.9 on the sample. On the 20,000 recount nodes 15 are one-signed on the 24 positives and none rejects a training
   member of two classes.
2. **Sign minors, Kpol read (158,500 nodes): the positives exclude.** 1 of the 20,000 recount nodes is one-signed on
   the positives; 0 T-train in any tier.
3. **Thresholded minors (79,900 nodes): 0 T-train in the full tier.** For some threshold the positives are one-signed
   at 2,347 to 4,190 nodes per family and read. K3 read: the lazy exit is at HEAT plus T-NR. Kpol read: at T-NR
   alone (no threshold keeps the positives one-signed and rejects a training T-NR member, 11,612 nodes, with 5 exits
   at E_a).
4. **T3, T6, K3 read (1,289,880 node-mu): 0 T-train in the full tier.** Half of the node-mu have a threshold with
   one-signed positives (658,398). 3,172 node-mu were float64-undecided for the full tier; all are excluded in
   balls. Registered prediction (ii) (every T-train node has its feasible set in the HEAT window) holds vacuously.
5. **T3, Kpol read (180,000 node-mu): 0 T-train, nothing float64-undecided for the full tier.**
6. **T6, Kpol read (97,920 node-mu): 1,058 at T-train in balls, 0 hold-out survivors.** All 1,058 have
   abs(u) <= 0.49, h between 0.78 and 1.19 and mu > 0 with rho >= 10^(1/2). The feasible thresholds lie between
   zeta's value and the training HEAT values, which are within a relative distance 6.9e-11 to 1.0e-6 of it
   (median 6.5e-8): thresholds tuned inside zeta's margin, the situation Lemma H (C1) describes for K3 and which is
   MEASURED here for Kpol. Best hold-out score over all thresholds of a feasible set (the smallest of: held-out
   positives of the right sign / 2, held-out opposite members per class; 23 needed): at most 15, median 7.
   Float64 saw 398 of them as T-train and 1,172 as undecided; balls decided all 1,570 (1,058 T-train, 512 excluded).
7. Ball rungs: no node needed more than 8,192 bits; no node is undecided.

Leave-one-class-out reading.

- T3/T6, K3: with HEAT dropped, 182,733 node-mu (14%) are float64 T-train and none passes the hold-out read
  (49 float64-undecided hold-out reads went to balls: 0). HEAT is the class that excludes at the training stage.
- Thresholded translation minors, K3: with E_a dropped, 1,088 of 19,900 nodes are T-train for {T-NR, HEAT}
  (TMt5 508, TMt6 580; counted on all nodes because the lazy exit does not hide this tier); one passes the hold-out
  read (section 5). E_a is the class that excludes: no node rejects a training E_a member together with one other
  class (0 of 4,000 recount nodes for {T-NR, E_a} and {E_a, HEAT}; recount with the corrected precision in
  `recount_*_k3.json`, all tiers decided).
- T6, Kpol: every full-tier T-train node is T-train in the three two-class tiers; best two-class hold-out score 17.
- Two-class tiers of T3/T6 that were float64-undecided at the training stage and had no favourable hold-out read
  (the numbers in brackets in the table) were not converted to balls, as registered (A5).
- Sign minors: 0 in every two-class tier on the 40,000 recount nodes (8 x 5,000).
- In the recount table the K3 thresholded rows are those of `recount_*_k3.json` (corrected precision); the Kpol
  thresholded rows are those of the search runs (every node decided at 128 bits, no refinement requested).

## 5. The one two-class node (MEASURED, balls; `node6_TH.json`)

TMt6, K3 read, stream id 6: F = det[K3(x_i + y_j)]_(6x6) - lam prod_i K3(x_i + y_i), x_i = u0 + i h, y_j = j k,
u0 = -0.0696438902, h = 0.1518523779, k = -0.1154677104 (36 read points in [-0.647, 0.690]).
With r_X = det/prod on the object X: r_zeta = -1.80726873e-6.

| group | position of r_X relative to r_zeta, (r_X - r_zeta)/r_zeta |
|---|---|
| 23 training characters | 22 negative, 1 positive (34.2); none within 0.9997 of 0 |
| 48 held-out characters | all negative, between -136 and -0.926 |
| E_a, 8 training and 24 held-out | all between -1.00267 and -1.00256 (on the positives' side) |
| HEAT, 8 training and 24 held-out | all positive, 2.1e-6 to 8.8e-5 |
| T-NR, 8 training | all positive, smallest 4.0e-36 |
| T-NR, 24 held-out | all positive, smallest 2.03e-52 |

A threshold lam with (lam - r_zeta)/r_zeta in (0, 2.03e-52) has zeta, all 71 characters and all 32 E_a members on
one side and all 32 T-NR and all 32 HEAT members on the other. Reading: at these nodes (abs(u) < 0.7) a T-NR kernel
with a large split prime is c K_zeta(u)(1 + eps), eps below 1e-36, and the functional moves by a relative eps of
one sign; a HEAT member moves it by tau x 0.0179 of the same sign. The condition separates only with the threshold
placed between zeta's value and the nearest control value: zeta's relative margin is 1.0e-52 at the midpoint and
tau*(F) = margin/0.0179 = 5.7e-51 (bisection on the ladder: below 3.8e-39). This is the case tau* -> 0 of
Lemma H (C1), "lam equal to zeta's own value of the functional". E_a is not rejected at any threshold of the
feasible set. Not a survivor; no score; not a lead by Lemma QA and by C1. It is recorded because it shows that the
scanned-threshold hold-out read can be passed by an identification when the held-out members of a class all move
the functional in one direction.

## 6. Controls (the three canonical classes)

| class | where it excludes | where it is rejectable |
|---|---|---|
| HEAT (abs(tau) <= 0.005) | every K3 sign minor (0 of 160,000 rejected; tau* above 81.9 on the sample); every K3 T3/T6 node-mu at the training stage (0 full-tier T-train against 182,733 without it) | inside zeta's margin only: T6 Kpol (relative window at most 1.0e-6), TMt K3 two-class nodes |
| T-NR (seeded, same law for training and held-out) | every Kpol thresholded minor with one-signed positives (lazy exit at T-NR at 11,607 of 11,612 nodes); held-out members stop the T6 Kpol nodes together with the held-out positives | K3 T3/T6 (with E_a: 14% of node-mu at the training stage) |
| E_a (0.03 < a < 0.47) | every K3 thresholded minor (0 of 4,000 recount nodes in a tier containing E_a; the node of section 5) | K3 T3/T6 at the training stage |

Davenport-Heilbronn, sign twists, unimodular twists, Beurling, the phase-rotated transfer operator and theta^w are
not classes of this search (canonical lifts only, as assigned); no statement is made about them.

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | a finite sign search on kernels; no argument; no step uses the Euler product |
| R2 (height-uniform, every window) | false | finite node sets; no statement at height |
| R3 (every control fails structurally) | false | outcome "none": no functional of DU rejects the three canonical classes and holds out; a survivor would not have carried R3 either (Lemma QA) |
| R4 (reaches the critical line) | false | nothing crosses; kernel-side finite conditions |

Score 0.

## 8. Proposed map row for U8 (not applied; this lane does not edit the map)

"U8, restricted search DU (campaign round 17): single-kernel sign functionals with at least three monomials of
distinct heat exponents: translation and dilation minors of orders 5 and 6 (sign, and thresholded against the
diagonal product), three-term Turan forms on 5 and 6 nodes with two coefficients; four real parameters; kernel
without polar terms on [-4, 4], kernel with polar terms on [-3, 3]; positives zeta and the 23 primitive characters
of conductor at most 13, 48 held-out characters of conductor 14 to 60; canonical lifts T-NR, E_a, HEAT
(abs(tau) <= 0.005), 8 training and 24 held-out seeded members each; thresholds scanned over the line.
MEASURED, finite: 1,966,200 family-nodes, 1,058 at T-train (T6 with polar terms, thresholds within 1e-6 relative
of zeta's value), 0 hold-out survivors, 0 undecided (balls). Monomial, two-term and equal-S conditions for kernels
without polar terms are closed on paper by Lemma H (two referees). One two-class ({T-NR, HEAT}) hold-out node with
threshold within 2e-52 relative of zeta's value: an identification (C1), E_a passes. Not covered: Kpol reads
between 3 and 4; orders above 6; more than four parameters; nodes outside [-4, 4]; non-determinantal functionals
with four or more terms; other kernels or normalisations; control classes other than the three canonical lifts;
the part of the registered streams not reached (T3/T6 K3: 36% of 1.8 million node-mu each; T6 Kpol: 54%)."

## 9. Three weakest steps

1. **A finite search on registered draws, smaller than planned.** Both machines were saturated; T3/T6 K3 reached
   36% of the registered node-mu and T6 Kpol 54%. T6 Kpol is the only family with T-train nodes (1.08% of node-mu),
   so the 0 there rests on 1,058 nodes whose best hold-out score is 15 of 23. The mu grid has 18 values tied to
   zeta's own monomials; the Kpol window stops at 3; the dictionary is one choice among many with three or more
   terms.
2. **Enclosures are those of the copied kernel code plus this lane's repairs; no independent referee of this
   lane's code.** The copied `ballk.gauss_series` drops a series tail whose float64 bound underflows (relative size
   at most 2^-prec e^-60; not inside the balls). The HEAT remainder bound and the E_a repair (A6, A7) are this
   lane's and were checked numerically only. The float64 screen of T3/T6 can exclude a node without balls: its
   error bands (50e-12, and 5e-8 for E_a and HEAT Kpol) are estimates, tested on 3,782 tier decisions.
   The search runs carried the 128-bit breakpoint rounding (conservative); the post-pass removed its 96
   "undecided" and the K3 recount was redone, but the Kpol thresholded recount was not rerun (there no node asked
   for a refinement, so the rounding had no effect).
3. **Conventions that fix what "single kernel" and "hold out" mean.** Complex characters enter through real
   parts; characters have no polar terms, so in the Kpol read zeta is the only positive that carries them and the
   23 training characters do most of the excluding (sign minors, Kpol: 158,499 of 158,500 nodes end at the
   positives). The held-out T-NR members follow the same law as the training ones; section 5 shows that a
   scanned-threshold hold-out read can then be passed by an identification. The two-class tiers of T3/T6 that
   were float64-undecided at the training stage were not converted.

## 10. Machines, units, files

- Server, through `rhrun` only (`rhstatus` before each launch): `rh-c17u8-tests-1120014613` (controls, 309 s);
  `rh-c17u8-main-1120014629` (8 cores requested, about 0.9 received; stopped by me after TM5/K3);
  `rh-c17u8-A-1120020017` (TM6, DM5 K3; stopped by me during DM6), `rh-c17u8-B-1120020017` (TM5, TM6 Kpol; stopped
  during DM5), `rh-c17u8-C-1120020017` (stopped by me, no output used), `rh-c17u8-D-1120020018` (TMt5 K3 nodes 0 to
  2,999; stopped), `rh-c17u8-C2-1120022233` (T6 K3; ended by itself), `rh-c17u8-D2-1120022233` (TMt6 K3 nodes 0 to
  1,599; stopped). 2 cores and 2 GB each for A to D2. All units inactive at the end (checked). No GPU used.
- Local, single processes through `scripts/memcap.sh 8`: the other families and continuations (`plans/planL*.json`,
  `logs/local*.log`), the post-pass, the recounts, the controls.
- Files: `PREREGISTRATION.md`; `du.py` (objects, kernels, scan, classifiers), `run.py`, `tests.py`, `resolve.py`,
  `recount.py`, `taustar.py`, `summ.py`, `mktable.py`; `kern.py`, `ballk.py`, `funcs.py` (copied unchanged from
  c16); `out/` (one JSON per family piece, `resolved.json`, `summary.json`), `out_server/`, `out_local/`;
  `tests.json`, `tests_server.json`, `taustar.json`, `node6_TH.json`, `recount_*_k3.json`, `table.md`;
  `logs/`; `code_tests/` (pilot and debugging scripts); `lanes.jsonl` (one line; not appended to the campaign file).
- No file outside this directory was edited.
