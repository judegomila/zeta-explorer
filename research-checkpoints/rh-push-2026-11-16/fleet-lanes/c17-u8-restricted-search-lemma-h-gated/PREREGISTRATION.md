# c17-u8-restricted-search-lemma-h-gated: PREREGISTRATION

Written 2026-11-19 (PST) before any run of this lane: no node, no kernel value and no table of this lane existed
when sections 1 to 9 were written. Kind: compute (gated). Nothing here is a statement about zeros of zeta.
Gate: no search is launched until `push/c17-referee-r16-lemma-h-sources/REFEREE2-lemma-H.md` exists and says that
Lemma H holds (checked every 10 minutes, at most 90 minutes from 16:34 PST). If the gate does not open the lane ends
with this file and the tested code.

## 1. Registered question

Cell U8 (STRATEGY section 4.0): single-object kernel sign conditions beyond the searched range of dictionary D
(map row G36: orders 2 to 4, at most three real parameters, nodes in [-2.6, 2.6]).

In the dictionary DU of section 4, is there a functional (a family label and at most four real parameters) that
(a) has one strict sign on every training positive, (b) has the opposite strict sign on at least one training
member of each of the three canonical control classes T-NR, E_a, HEAT, and (c) on held-out members keeps the
pattern: at least 46 of 48 held-out positives have the sign of (a), and in each class at least 23 of 24 held-out
members have the opposite sign?

- (a)+(b) = "T-train". (a)+(b)+(c) = "hold-out survivor".
- **Prediction: 0 hold-out survivors.**
- A hold-out survivor is MEASURED only. By Lemma QA (`c16-qa-filter-silent-cells-geometric-nodes`) a survivor of a
  compact-parameter sign search is not a device with R3; it carries no score and is passed to a full attack lane.
- Outcome "none" adds one map row for U8 with the searched range of section 4 (proposed in RESULT.md; this lane
  does not edit the map).

## 2. Kernels, positives, controls

Kernels and conventions of `c13-noncone-kernel-separator-search/PREREG.md` section 2 (code `kern.py`, `ballk.py`
copied unchanged from `c16-dn-canonical-tier-ball-conversion`): two reads per object, **Kpol** (theta-normalised
kernel with polar terms) and **K3** (kernel without polar terms; for characters K3 = Kpol). Complex kernels
(complex characters): each product of kernel values is formed in complex numbers and its real part is the value of
the monomial; a determinant is formed in complex numbers and its real part is the value.

rng_k = numpy.random.Generator(PCG64(170000 + k)).

| group | members |
|---|---|
| P, training positives (24) | zeta; the 23 primitive characters of conductor 3 to 13 (one per conjugate pair), as in c13 |
| PH, held-out positives (48) | 48 drawn without replacement by rng_0 from the sorted list of primitive characters of conductor 14 to 60, one per conjugate pair |
| T-NR (p0, c), 8 training + 24 held-out, all seeded | p0 = rng_2 choice of {2, 3, 5, 7, 11, 13}; c = 2 + t (p0^(1/2) + p0^(-1/2) - 2), t uniform (0.05, 0.95); the first 8 draws are training, the next 24 held-out (same law for both, so that the split is not a split by prime) |
| E_a, 8 + 24, all seeded | a uniform (0.03, 0.47) by rng_3; first 8 training |
| HEAT, 8 + 24 | tau = -10^x, x uniform (-4, log10(0.005)) by rng_4; first 7 draws and tau = -0.005 are training, the next 24 held-out. Every member has abs(tau) <= 0.005 |

Canonical lifts only. HEAT lift: K3_tau = exp(tau u^2/4) K3_zeta; Kpol_tau = the even solution of
(D^2 - 1/4) Kpol_tau = K3_tau of c13 section 2. No other control class enters any count.

## 3. Windows

- K3 read: every point at which the functional reads the kernel lies in [-4, 4].
- Kpol read: every such point lies in [-3, 3]. Reason for the smaller window (registered deviation from "nodes in
  [-4, 4]"): for abs(u) > 1.3 the kernel with polar terms of zeta, T-NR, HEAT is e^(abs(u)/2)(1 + eps) with
  eps = 2 exp(-pi e^(2 abs(u))); an order-6 minor loses up to five factors eps (at abs(u) = 3: 5 x 1828 bits; at 4:
  5 x 13511 bits, plus enclosures of the HEAT tail integrals at that precision), which is beyond the budget of a
  small compute item. Kpol reads between 3 and 4 are NOT-RUN and stay in the "not covered" clause.
- Shifts made inside a control kernel (T-NR: u +- log p0) are exempt, as in c13.

## 4. Dictionary DU

Every member is a single-kernel functional F = sum_j a_j M_j with at least three monomials M_j = prod K(u_i)^(e_i)
whose heat exponents S_j = sum e_i u_i^2 take at least three distinct values (for the parameter values drawn; the
draws are continuous, coincidences have probability 0 and are not searched for).

| label | functional | real parameters | nodes read | reads |
|---|---|---|---|---|
| TM5, TM6 (translation minors, sign) | det[K(x_i + y_j)], i, j = 0..m-1, m = 5, 6; x_i = u0 + i h + i^2 g, y_j = j k | u0, h, g, k (4) | m^2 | K3, Kpol |
| DM5, DM6 (dilation minors, sign) | the same with y_j = log n_j, {n_1 < ... < n_m} a subset of {1, ..., 13} drawn uniformly | u0, h, g (3) + set label | m^2 | K3, Kpol |
| TMt5, TMt6 (thresholded) | det[K(x_i + y_j)] - lam prod_i K(x_i + y_i), g = 0 | u0, h, k, lam (4) | m^2 | K3, Kpol |
| DMt5, DMt6 (thresholded) | the same with y_j = log n_j | u0, h, g, lam (4) + set label | m^2 | K3, Kpol |
| T3 (three-term Turan, 5 nodes) | [K(u)^2 + mu K(u-2h) K(u+2h)] - lam K(u-h) K(u+h) | u, h, mu, lam (4) | 5 | K3, Kpol |
| T6 (three-term, 6 nodes) | [K(u-h/2) K(u+h/2) + mu K(u-5h/2) K(u+5h/2)] - lam K(u-3h/2) K(u+3h/2) | u, h, mu, lam (4) | 6 | K3, Kpol |

Heat exponents (K3 read). T3: 2u^2, 2u^2 + 8h^2, 2u^2 + 2h^2. T6: 2u^2 + h^2/2, 2u^2 + 25h^2/2, 2u^2 + 9h^2/2.
Minors: one value sum_i (x_i + y_sigma(i))^2 per permutation; all of them differ by -(tau/2)-linear terms
2 sum x_i y_sigma(i), at least three distinct values for m >= 3 and generic nodes.

Draws (rng_10+ per family; rejection until all read points are in the window W of the read; x strictly increasing):
- minors: u0 uniform (-W, W); h uniform (0.05, 1.2); g uniform (-0.1, 0.1) (TM, DM, DMt) ; k = +- uniform
  (0.05, 1.2) with random sign (TM, TMt).
- T3, T6: u uniform (-W, W); h uniform (0.02, W/2);
  mu = s rho R_zeta, s in {+1, -1}, rho in {10^-3, 10^-2, 10^-1, 10^-1/2, 1, 10^1/2, 10, 10^2, 10^3} (18 values per
  (u, h)), R_zeta = (first monomial)/(second monomial) evaluated on zeta's kernel of the same read (a
  parametrisation of mu in units in which zeta's two terms are equal at rho = 1; mu itself is a real number and the
  same number is used on every object).
- **lam is never fixed: it is scanned over the whole real line exactly** (section 5).

Planned counts (the final counts are reported; a family may be cut for time only by lowering the number of draws
before its run starts, never by selecting nodes after seeing values): TM, DM: 40,000 nodes per (order, read);
TMt, DMt: 15,000 per (order, read); T3, T6: 200,000 (u, h) x 18 mu per read.

## 5. Statistic, threshold scan, sign reading

- Sign families: value v_X = Re F(K_X). T-train: all 24 training positives one strict sign s; each class has a
  training member with strict sign -s.
- Threshold families F = V1 - lam V2: for every lam the same rule is applied to sign(V1_X - lam V2_X). The scan is
  exact in one dimension: the breakpoints r_X = V1_X/V2_X of the objects cut the line into at most (number of
  objects + 1) open segments on each of which every sign is constant; one test threshold per segment (midpoint;
  two outer points). A node is T-train iff some segment passes; its feasible set is the union of passing segments.
- **Hold-out, thresholds scanned, not a single threshold:** a T-train node is a hold-out survivor iff some
  threshold of its feasible set (one test point per segment of the refinement by the held-out breakpoints) meets
  (c). The single-threshold read (midpoint of the longest feasible segment) is reported beside it.
- Never accepted as a sign: a ball that contains 0, at any radius (relative acceptance: the test is on the ball
  against 0 and on the disjointness of breakpoint balls, not on an absolute radius).

## 6. The tau* column from Lemma H: members decided on paper and removed before the search

Lemma H and corollaries C1 to C4 (`c16-referee-r15-j1prime-u8-screening/REFEREE2_lemma-j1prime-u8-heat-inheritance.md`).

1. Removed from the dictionary before any run (decided on paper; no node of these is evaluated as a candidate):
   every monomial bound; every two-term condition (T3 and T6 with mu = 0, with lam = 0, or with the first term
   dropped; the order-2 minor K(a)K(d) - lam K(b)K(c)); every functional whose terms share one value of S
   (in particular sign minors with k = 0 or h = g = 0, which are identically 0); all of these for the K3 read, at
   every order and node set. They are inherited by HEAT or passed by all members with abs(tau) <= tau* (H1, H2);
   none can reject the HEAT class with a margin (C1).
2. For every K3-read node kept, the HEAT column is computed from zeta's kernel values alone (C4):
   F_tau = sum_j a_j exp(tau S_j/4) M_j(zeta). Consequence used as a filter **before** the other columns:
   - sign families: the node can reach T-train only if sign F_tau != sign F_0 for a training tau; otherwise the
     node is "decided by the HEAT column" and no character or control kernel is evaluated for the full tier (they
     are evaluated for the leave-one-class-out recount on a registered subsample, section 8).
   - threshold families: the thresholds that reject a training HEAT member and keep zeta lie between
     r_zeta = r_(tau = 0) and the farthest r_tau, tau in the training HEAT set: the "HEAT window". Its relative
     width is at most abs(tau)_max abs(Delta S)/4 to first order. Only thresholds in this window can be T-train.
   - recorded for every T-train node: tau*(F), the root of F_tau nearest 0 on tau < 0 (bisection on the closed
     form, 60 digits), at the threshold of the single-threshold read; and zeta's relative margin there.
3. Kpol read: Lemma H does not apply (the HEAT member is not g K). All columns are computed. Registered separately:
   counts are reported per read and never pooled.
4. Registered predictions from Lemma H / C1: (i) sign minors, K3 read: 0 nodes reject a training HEAT member
   (continuity: abs(tau) <= 0.005 and a strict sign of zeta; a draw would have to fall within a relative margin
   of about 1e-3 of a zero of the minor); hence 0 T-train. (ii) threshold families, K3 read: every T-train node has
   its whole feasible set inside the HEAT window (threshold tuned inside zeta's margin), and tau*(F) <= 0.005.
   (iii) Kpol read: no prediction from Lemma H; prediction 0 hold-out survivors from G36 and c16 (held-out
   characters of larger conductor fall on the controls' side).

## 7. Pipeline

1. Float64 screen (T3, T6; vectorised, log-domain kernel values so that K3 at abs(u) up to 4 + log 13 does not
   underflow): favourable reading: an entry with abs(V1 - lam V2) <= 1e-9 (abs V1 + abs(lam V2)) is a wildcard.
   Output per node: one-signed on P; rejects each class; T-train (favourable). Optional GPU: not used unless the CPU
   run exceeds its budget (float64 output is a screen, never a verdict).
2. Ball stage (python-flint; ladder 128, 256, 512, 1024, 2048, 4096, 8192, 16384 bits): **every float64 T-train
   (favourable) node, which includes every float64-undecided node, is recomputed in balls on all training objects**
   and classified T-train / excluded / undecided by the rule of section 5: "T-train" needs a test threshold at
   which all required signs are strict; "excluded" needs all breakpoint balls pairwise disjoint and every segment
   violated by strict signs; otherwise the next rung; "undecided" after the last rung.
   Minor families (orders 5 and 6) have no float64 stage: float64 cannot decide them (near-rank-one matrices); they
   are evaluated in balls directly, in the order zeta, HEAT column, characters, T-NR, E_a (K3) and zeta,
   characters, T-NR, E_a, HEAT (Kpol), stopping at the first strict violation of (a) or (b).
3. Hold-out in balls for every ball T-train node.
4. Reported per family and read: nodes, removed on paper / decided by the HEAT column, excluded, T-train,
   hold-out survivors (scanned and single-threshold), undecided; ball rungs used.

## 8. Leave-one-class-out recount

For each of the three two-class tiers {T-NR, E_a}, {T-NR, HEAT}, {E_a, HEAT}: T-train and hold-out survivor counts
by the same rules. T3, T6: on all nodes in float64 (favourable), and every float64 hold-out survivor of a
two-class tier is decided in balls. Minors: on the first 5,000 nodes of each (family, order, read) in balls
(for the K3 sign minors this is where characters, T-NR and E_a are evaluated although the HEAT column has decided
the full tier). A two-class survivor is not a survivor of the registered question; it is reported because it shows
which class does the excluding.

## 9. Controls on the pipeline (run before the search; the search does not start if one fails)

1. **Planted separator must be found.** Synthetic object set of the same group shape: positives exp(-alpha u^2),
   alpha log-uniform (0.3, 3); control members -exp(+alpha u^2) in all three classes (seed 175000).
   By construction det[K(x_i + y_j)] has sign (-1)^(m(m-1)/2) on the positives (K(x+y) = K(x) K(y) e^(-2 alpha x y),
   totally positive after reversing one order) and sign (-1)^m on the controls: opposite for m = 5 and for m = 6.
   The sign-minor pipeline must return T-train and hold-out survivor at every planted node.
   For T3: positives exp(-alpha u^2), controls exp(-alpha u^2)(1 + c u^2), c = alpha x uniform (2.5, 6) (the c13
   planted set); at u = 0, small h, K(0)^2/(K(h)K(-h)) = e^(2 alpha h^2) >= 1 on positives and
   e^(2 alpha h^2)/(1 + c h^2)^2 < 1 on controls: the T3 pipeline (float64 then balls) must return hold-out
   survivors among nodes with abs(u) <= 0.05, h <= 0.3, abs(rho) <= 10^-2.
2. **Zeta must pass its own positive rows.** (i) log-concavity row: K3(u)^2 - K3(u-h)K3(u+h) > 0 on zeta at 2,000
   seeded nodes in the K3 window (float64 log-domain and balls); (ii) order-2 and order-3 translation minors of K3
   on zeta have sign (-1)^(m(m-1)/2) at 500 seeded nodes (measured rows of G36; "pass" = the pipeline reproduces
   the sign in balls); (iii) with P = {zeta} every node is one-signed (code path check).
3. Float64 against balls: 2,000 seeded (node, object) values of T3 and T6, all object types and both reads;
   required: every float64 value outside its wildcard band has the ball sign, relative difference of V1, V2 below
   1e-8 where the ball is not tiny by cancellation.
4. Lemma H as a tie in the code: for 200 seeded K3 nodes the ball value of a monomial on a HEAT member equals
   exp(tau S/4) times zeta's (ball of the difference contains 0), members built separately (not through the same
   expression).

## 10. Machines

Server through `rhrun` only (8 cores, 12 GB, jobs up to 6 hours; `rhstatus` before each launch; own units stopped
at the end). Local runs (tests, controls) through `scripts/memcap.sh 8`. Seeds and code are in this directory.

## 11. What each outcome changes

- "none": map row for U8 (searched range: orders 5 and 6, four parameters, windows of section 3, canonical tier),
  MEASURED finite search; the cell stays silent beyond that range.
- hold-out survivor: MEASURED only, no score (Lemma QA); full attack lane next round with the control battery.

## 12. Gate and amendments (written 2026-11-19 about 17:50 PST, after the gate opened and before the launch of any search job)

**Gate.** `push/c17-referee-r16-lemma-h-sources/REFEREE2-lemma-H.md` appeared between 16:47 and 16:59 PST; first
line "HOLDS"; Lemma H has two independent referees. Its hypotheses 1 to 4 are adopted: real kernel values, the same
tau on every member, no polar terms, `M <= lam` at tau = 0. In this lane Lemma H is applied to zeta's K3 kernel only
(real, positive); the character kernels are positives, not heat members.

**Disclosure.** While the gate was closed the code was tested. (i) One smoke run evaluated the first 6 nodes of each
of the registered streams TM5, DM6, TMt5, DMt6 in both reads (48 nodes; all excluded). These nodes remain in the
registered streams and are recomputed by the search. (ii) All later tests (`tests.py`, `t_pilot.py`) use a separate
node stream (seed offset 500, flag `dev`) and the planted sets. Pilot on the dev stream: 12 (u, h) nodes of T6, Kpol
read, gave 9 of 216 node-mu at T-train in balls (full tier); so T-train nodes of the Kpol read are expected in the
search and the hold-out read is what decides them. No registered T3/T6 node was evaluated before this section.

**A1. Counts (lowered before the run; reason: measured cost per node).** Sign minors: 40,000 per (family, order,
read). Thresholded minors: 10,000 per (family, order, read). T3, T6: K3 read 100,000 (u, h) x 18 mu; Kpol read
10,000 (u, h) x 18 mu. Each family has a wall-clock deadline (sign minors 900 s; T3/T6 K3 1,200 s; thresholded minors
900 s; T3/T6 Kpol 1,500 s); a family stopped at its deadline reports the completed prefix of its stream in order
(no selection by value).

**A2. Leave-one-class-out subsample for thresholded minors: the first 1,000 nodes** (not 5,000); sign minors 5,000
as registered. On that subsample the two-class tiers are refined up to 1,024 bits only and reported "not decided"
beyond; the full tier is always refined to the last rung.

**A3. Float64 stage of T3/T6.** The log-modulus and phase of each kernel value are taken from the midpoints of
128-bit balls (zeta, characters, T-NR, HEAT K3), from a float64 Bessel code (E_a; measured against balls: largest
difference of log abs K 3.7e-13 on 2,400 values) and from the float64 quadrature of c13 (HEAT Kpol; 4.4e-16
relative on 36 values). The scan itself is float64.

**A4. The scan with error bands (replaces "wildcard 1e-9" of section 7).** Each object's breakpoint is an interval
(ball; in float64 a band 50 x 1e-12 (1 + cancellation)(1 + abs log r), widened to 5e-8 relative for E_a and for HEAT
Kpol). The endpoints cut the threshold line into elementary intervals; in each an object is above, below or wild.
"Certified": the rule of section 5 holds with no wild object used. "Favourable": it could hold with wild objects
read in favour. T-train iff some elementary interval is certified; excluded iff none is favourable; otherwise
float64-undecided (goes to balls) or, in balls, the objects that are wild in a favourable interval are refined on
the ladder (each object has its own precision), and the node is "undecided" when one of them is at 16,384 bits.
This rule never accepts a ball containing 0 and never requires an irrelevant near-tie to be resolved.

**A5. To balls go:** every node-mu whose full tier is float64 T-train or float64-undecided; every node-mu with a
two-class tier whose hold-out read is certified or undecided in float64. Two-class tiers that are float64-undecided
at the training stage without a favourable hold-out read are counted and not converted.

**A6. E_a in balls.** The copied `ballk.BEA` returns balls with relative radius up to 1 (and beyond) where the
library's K_a falls back on I_(-a) - I_a (about 2 X/log 2 bits lost; found by the float-against-ball test). This
lane evaluates each K_a(X), X <= 1.2 prec, at prec + 2.9 X + 64 bits from points formed at 4.6 prec + 128 bits;
measured relative radius at most 2^(-prec + 15). Enclosures are valid in both versions; only the cost differs.

**A7. HEAT Kpol in balls.** Integrals accumulated over the sorted read points (all integrands positive), upper limit
T with pi e^(2T) = pi e^(2 vmax) + prec log 2 + 100, remainder enclosed by 9.04 W^1.5 e^(-W); checked against
`ballk.BHeat` (overlap at 5 points).

**A8. Server.** One unit, 8 cores, 12 GB, CPU only (no GPU stage: the float64 part is not the bottleneck).

**A9 (18:00 PST, after the first family TM5/K3 had finished and before any other family ran).** The server and the
local machine were both saturated (load average about 150 on 48 cores and 134 on 18 cores); the single 8-core unit
received about 0.9 core. The unit `rh-c17u8-main-1120014629` was stopped by me after TM5/K3 (40,000 nodes, complete).
The remaining families run with the same streams, code and rules in four 2-core server units (A: TM6, DM5, DM6, K3
sign minors, deadline 600 s each; B: the four Kpol sign minors, 450 s each; C: T3 and T6, K3, 1,300 s each;
D: the four K3 thresholded minors, 650 s each; total request 8 cores, 8 GB) and six local single-process lanes
through `scripts/memcap.sh 8` (the four Kpol thresholded minors; T3 and T6, Kpol; 1,100 s each). Families stopped at
their deadline report the completed prefix of the stream. No node, family or threshold was selected by value.
