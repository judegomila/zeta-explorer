# REFEREE: c16-dn-canonical-tier-ball-conversion

Adversarial second pass by the lane's own agent. No separate agent was available to this lane, so this is not an
independent referee in the campaign's sense; one is owed. To make the pass as independent as the setting allows, the
checks below use code that shares nothing with the lane's ball kernels and interval solver (`refcheck.py`,
`refcheck2.py`: mpmath, series and quadrature written from the formulas) or a second machine. Nothing here is a
statement about zeros of zeta. Verdict of this pass: **the outcome "none" holds as worded in RESULT.md section 0,
with the scope lines of section D**. Flags: R1 = R2 = R3 = R4 = false.

## A. What was attacked

1. **Is "decided in balls" real, or the c15 artefact again?** The c15 ball stage accepted a 256-bit ball containing
   0 as a decided entry with midpoint 0 (absolute floor 1e-30 in `nball.bratio`). In `cball.bratio2` a rung is
   accepted only if rad <= 1e-6 abs(mid) and abs(mid) >= 1e-290, so an accepted ball excludes 0. No entry failed
   (`nleft` = 0 in all 67,138 + 22,508 rows); 609 nodes per third-difference family needed 1024 bits; none 2048.
2. **Far-tail values against mpmath (420 digits, `refcheck.py`).** zeta with polar terms from e^(t/2) + S(t); HEAT
   with polar terms from c e^(v/2) + e^(-v/2) J1 - e^(v/2) I2 with mpmath quadrature of e^(tau t^2/4)(S'' - S/4).
   - b1-Aw, 5 excluded nodes (abs(u) 2.00 to 2.25): both training HEAT values strictly between 0 and the zeta
     value (ratios 0.896 to 0.915 for tau = -0.1; 0.578 to 0.642 for tau = -0.5). This is the stored reason
     "HEAT not rejectable".
   - b2-with, 4 T-train nodes (abs(u) 2.15 to 2.34): the stored interval ends equal the mpmath zeta value and the
     mpmath HEAT(tau = -0.5) value to 3.0e-16 to 5.1e-16 relative (the float64 rounding of the stored ends). The
     boolean field `interval_inside_zeta_heat_gap` in `out/refcheck_b2.json` is False at all 4 nodes: the test was
     written with a tolerance on the wrong side for negative values; the relative distances in the same records are
     the evidence. The field is kept as produced.
3. **Two machines.** 2,730 family-nodes were computed both by the server unit and by a local helper run: 2,730
   agree in status, rejection pattern, sign, interval ends (1e-9 relative) and both hold-out reads; 0 disagree.
   Coverage: 67,138 registered, 67,138 computed, 0 missing, 0 extra (`merge.py`).
4. **First check.** 200 float64-decided nodes with every training entry in balls: 200 of 200 equal the stored c15
   status. The sample contains no node where float64 and balls could differ by construction (float64-decided nodes
   have margins), so this validates the object set, node lists and solver wiring, not the far tail; item 2 covers
   the far tail.
5. **The 86 flagged nodes (extension A1).** Recomputed with mpmath at 40 digits from the character series at the
   stencil points themselves (no reflection, no ball code; only the character value tables are shared): 6 nodes x
   4 characters, 24 of 24 on the controls' side of the whole feasible interval, and the zeta value equals the
   interval end to 12 digits (node 12318: zeta 0.158173024374605, stored end 0.15817302437444727). The 350-character
   count itself (75 to 93 wrong per node) was not recomputed independently beyond those 24 values.
6. **Part B.** The recount reproduces the stored c14 one-signed counts and FE-tier T-train counts in all 40 runs
   (4,266,644; 59), and the per-family rejection counts of the three classes equal the c14 table (658,879;
   1,193,069; 975). The canonical T-train set equals the FE-tier set (59): every row that rejects T-NR, E_a and
   HEAT in training also rejects BLS.

## B. Errors found in this pass

1. Prediction table: "b5l-with fewer than 7,000 at T-train" fails (14,572). Stated in RESULT section 4.
2. Prediction "Part B about 150 at T-train" fails (59, the lower registered bound). Stated.
3. Prediction "A1 secondary read 0" fails (86 flagged). Stated in RESULT sections 0 and 5; the flagged nodes are
   refuted on the positive side by a test that was not registered before the A1 run (it was written after seeing
   the 86 nodes). It is a refutation, so the post-hoc design cannot inflate a claim.
4. Compute: five local runs exceeded the 20-minute local limit (34 to 36 minutes); one server unit failed at start
   (code not copied); one was stopped and relaunched. Stated in RESULT section 9 and PREREG A0.
5. The log of `summ.py` reports "primary H2 seen max 0" for the Part A T-train nodes: this is the count before the
   early exit (the first two held-out T-NR members both fail), not a full count; the full counts come from the
   16-node sample (0 or 1 of 24). RESULT words it that way.

## C. PROVED steps

None new. The reflection identity and Lemmas J1-Q, J1-L are those of c15 (re-derived by its referee). The J1 ties
in balls hold by construction of `BHeat.f_jets` and `BHeatX`; they check the code path, not the lemmas. The
statement "the hold-out failure comes from the size of the held-out split primes" is ARGUED only.

## D. Scope lines a reader must keep

1. "Closed" means: on the c15 node set, objects and lifts, at the canonical tier, with balls at the nodes float64
   left open and at the float64 T-train nodes. Entries far from every feasible interval stay float64. Quotient
   minors and product families were not re-read. It is not a theorem about DN.
2. The enclosure of the HEAT kernel with polar terms omits the theta-series tail inside the integrand (below the
   working radius; `ballk.BHeat._integrand`). The mpmath comparison at 9 nodes supports the values; a strict
   enclosure would add that tail to the ball.
3. The secondary read exists only in this lane and was applied only to the canonical tier of DN.
4. The refutation of the 86 nodes uses characters of conductor up to 60; it shows the family is not one-signed on
   Dirichlet L-function kernels at those nodes. It says nothing about other nodes of b2-with whose secondary count
   was 22 or lower.
5. Control list: only the three canonical classes are in this tier; DH, sign-twisted primes, unimodular twist,
   Beurling, theta^w and the phase-rotated transfer operator were not evaluated here. For an outcome "none" this is
   harmless.

## E. Requirement flags (strict)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument; multiplicativity is not used in any established step |
| R2 | false | finite scan on [-2.6, 2.6] |
| R3 | false | no functional rejects the controls and holds out; HEAT blocks 37,634 nodes outright |
| R4 | false | no content about the critical line |

Surviving claim: on the registered scans of dictionaries DN (c15) and DJ (c14), no functional separates the 529
training positives from {T-NR, E_a, HEAT} and holds out; the 67,138 formerly undecided nodes of DN are decided in
balls (360 identity, 37,634 excluded, 29,144 T-train, 0 undecided). MEASURED. No statement about zeros of zeta.

---

# Independent referee pass (lens: general), 2026-11-19

Separate agent from the lane's author. Checks used the stored outputs read as data and one new mpmath script written
from the formulas (run locally through `scripts/memcap.sh 8`, single process, about 1 minute; no server use, no lane
code imported). Nothing here is a statement about zeros of zeta.

**Verdict: the outcome "none" holds (lane verdict "dead" confirmed), with the wording corrections of section R2.**
Flags set by this pass: R1 = false, R2 = false, R3 = false, R4 = false.

## R1. What was re-derived or recounted

| item | method | result |
|---|---|---|
| Part A totals | recount of `out/merged.json` | 67,138 rows, 0 duplicates; 360 identity, 37,634 excluded, 29,144 T-train, 0 undecided; `nleft` = 0 in every row; 2,555,446 ball entries; per-family and per-rung counts equal the table of RESULT section 4 |
| coverage | set comparison against `PA/canon/rows_und` and `rows_feas` in the c15 `out2/*_summary.json` files | merged rows = the 67,138 registered family-nodes exactly; `feas.json` rows = the 22,508 registered nodes exactly |
| rejection pattern | recount | excluded nodes: (T-NR yes, E_a yes, HEAT no) at 37,634 of 37,634; T-train nodes: (yes, yes, yes) at 29,144 of 29,144 |
| hold-out, Part A | recount | primary full 0; exit at held-out T-NR at all 29,144; secondary any 0; largest min-count 1; HEAT stage never reached; one finite interval per node, ends between 8.03e-188 and 1.155e-12 in absolute value |
| A1 | recount of `out/feas.json` | 22,508 T-train; primary full 0; secondary 86 flagged, all b2-with, abs(u) 0.6278 to 0.6515, h 0.5087 to 0.5658, interval width at most 1.72e-4 |
| 350-character test | recount of `out/flagged_allchars.json` | 86 nodes; wrong for every threshold: min 75, median 83, max 93; 101 distinct characters, 74 at all 86 nodes; smallest conductor 31; no training character; no missing value |
| number of characters | counted from the formula for primitive characters (independent of `kern.py`) | conductor 3 to 60, one per conjugate pair: 350; conductor 3 to 13: 23 |
| Part B | sums over `out/c14count.json`, `out/c14ball.json` | 38,101,627 functionals; 4,266,644 one-signed (equal to stored in 40 of 40 runs); 59 T-train (JB2-with: 2 + 35 + 22), 0 full; rejections 658,879 / 1,193,069 / 975; held-out positives of the 59 between 18 and 22; 15,351 open rows, 15,351 excluded, 225,065 ball signs. The c14 sign files on the server were not re-read by this pass |
| c15 artefact | reading of `nball.bratio` (identical file in the c15 lane; `PRECS = (256, 1024)`) | confirmed: at the 256-bit rung the test `rad > 1e-6 * max(abs(m), 1e-30)` is false for any ball of radius below 1e-36, so a ball containing 0 is returned as decided at 256 bits and 1024 bits is never tried. `cball.bratio2` requires rad <= 1e-6 abs(mid) and abs(mid) >= 1e-290 |
| first check | `out/repro.json` | 200 of 200; every node has 554 ball entries (all training entries) |

## R2. New numeric check (different cases from the author's)

Script written for this pass: zeta kernel with polar terms e^(t/2)(1 + 2 sum exp(-pi n^2 e^(2t))); quadratic
character kernels built from Legendre symbols computed by Euler's criterion (no table from the lane); third log
difference on the stencil u +- h/2, u +- 3h/2.

1. Far tail, three T-train nodes of b2-with not used by the author (450 digits): node 151674 (u = 2.4683, the
   smallest interval of the record, 1024-bit node), node 160994 (u = -2.0225), node 49993 (u = 1.7104). The zeta
   value equals the stored interval end to 4.3e-16, 4.6e-16 and 3.2e-16 relative (values -1.7034832167708072e-187,
   6.0796034371919656e-39, -1.1548146503991145e-12).
2. Flagged nodes 134380, 16274, 34836 (none among the author's six), 50 digits: the zeta value equals the interval
   end to 12 digits at each. Legendre characters mod 43, 47, 59 lie on the controls' side of the whole interval at
   all three nodes (for example node 134380, interval [-0.190357, -0.190294], positives' side below: values
   1.0196, -0.0107, 1.9037); Legendre characters mod 37, 41, 53 lie on the positives' side. This matches the
   stored list exactly: chi43.42, chi47.46, chi59.58 are recorded as wrong at 86 of 86 nodes and chi37.36,
   chi41.40, chi53.52 are not in the list. 18 of 18 values agree with the lane's side assignment.

The HEAT kernel with polar terms was not recomputed by this pass (the author's mpmath check at 9 nodes stands
alone for it).

## R3. Errors and overstatements found

1. **A1, "status in balls: 22,508 of 22,508" is not what the code does.** In `cball.resolve` the loop leaves at
   the first round when the float64 status is already T-train, before any entry is sent to balls. For the A1 node
   lists the status is therefore the float64 status of c15 recomputed by the same float64 code. The record shows
   it: all 6,724 b5l-with rows of `out/feas.json` have `nb` = 0 and `maxprec` = 0; the 192,610 ball entries of
   b2-with come from the hold-out reads (29 to 33 per flagged node). The summary line "the 22,508 float64 T-train
   nodes confirmed" should read "re-read with the hold-out rules; status as in c15 (float64)". Ball confirmation
   of a float64 T-train status exists only for the 50 T-train nodes of the first check. This does not change the
   outcome: at these nodes (abs(u) 0.50 to 1.85) the values are of ordinary size, and the 86 flagged nodes are
   refuted on the positive side whatever their training status.
2. **"Held-out T-NR at most 1 of 24 opposite" is a 16-node statement.** For all 29,144 nodes the record holds
   (a) at the interval midpoint, at least 2 held-out T-NR members fail (early exit), and (b) over the scanned
   thresholds the smallest of the three counts (PH same, H2 opposite, H3 opposite) is at most 1. RESULT section 4
   words this correctly; the one-line claim passed to the orchestrator attributes the minimum to T-NR at every
   node, which is measured only at the 16 sampled nodes.
3. **"Ball-certified" is weaker than a strict enclosure** (the author states this in section 10, item 2): the HEAT
   kernel with polar terms omits a theta tail without adding it to the radius, and training entries far from every
   feasible interval stay in float64 with the c15 noise model. At the 37,634 excluded nodes the exclusion rests on
   the HEAT value being 0.58 to 0.92 of the zeta value (author's mpmath, 5 nodes), a margin far above the omitted
   tail, so the exclusion is not sensitive to it; it is still MEASURED, not PROVED.
4. **Two-machine comparison is narrower than worded.** `merge.py` compares status, rejection pattern, the sign and
   ends of the first interval (1e-9 relative) and the two hold-out booleans; it does not compare hold-out counts.
   2,730 of 2,730 agree on those fields.
5. The secondary read scans thresholds at midpoints between consecutive held-out values inside the interval; counts
   are constant between those values up to the entry half-widths, so the scan is complete for the registered
   counts. No error found there.

None of items 1 to 4 changes a count in the table of RESULT section 0.

## R4. PROVED steps, assumptions, novelty

- No step is labelled PROVED and none is needed for the outcome. The reflection identity and Lemmas J1-Q, J1-L are
  c15 material; the tie checks test the code path only (the author says so). The explanation of the hold-out
  failure by the size of held-out split primes is ARGUED and stays ARGUED.
- Nothing assumes RH; nothing restates verified height; no known theorem is presented as new. The lane makes no
  claim about zeros.
- Controls: the tier contains T-NR, E_a, HEAT only. No zeta-only mechanism is claimed, so there is no mechanism to
  test against Davenport-Heilbronn, sign-twisted primes, unimodular twist, Beurling, theta^w or the phase-rotated
  transfer operator. The positive-side control of this pass (Legendre characters, item R2.2) reproduces the
  refutation of the flagged nodes.
- Compute rules: server use through `rhrun` as recorded; the five local runs of 34 to 36 minutes exceeded the
  20-minute local limit and up to five local processes ran at once (both disclosed by the author).

## R5. Requirement flags (strict)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument; multiplicativity enters no established step |
| R2 | false | finite scan of kernel reads on [-2.6, 2.6]; no height-uniform conclusion |
| R3 | false | no functional rejects the controls and holds out; HEAT is never rejectable at 37,634 nodes; the 86 flagged nodes fail on Dirichlet characters |
| R4 | false | no content about the critical line |

Surviving claim (MEASURED): on the registered c15 node set of dictionary DN, canonical tier {T-NR, E_a, HEAT}, the
67,138 float64-undecided family-nodes are decided (360 identity; 37,634 excluded, HEAT not rejectable; 29,144
T-train; 0 undecided) and none holds out under the c15 rule or the threshold-scanned read; the 22,508 float64
T-train nodes keep their float64 status, 0 hold out under the c15 rule, and the 86 b2-with nodes passing the
threshold-scanned read are not one-signed on Dirichlet characters of conductor up to 60 (75 to 93 of 350 on the
controls' side). DJ canonical lifts: 59 T-train, 0 full, 15,351 open rows excluded in balls (stored outputs
consistent; not re-run here). The c15 "not decided at 1024 bits" was an acceptance-floor artefact (confirmed in
code). No statement about zeros of zeta.
