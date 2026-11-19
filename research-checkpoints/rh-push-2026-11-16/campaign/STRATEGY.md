# Campaign strategy, version 2 (2026-11-18, review after round 5)

Seven-day adaptive campaign. The planner reads this file, `SCOREBOARD.md`, `ROUND_LOG.md`, the engine (`../engine/`) and the filter (`../push/OBSTRUCTION_MAP.md` plus `../engine/outcomes/`) at the start of each round, and may issue a new version of this file with the change and its reason recorded at the bottom. Compute rules: `../push/BRIEF.md` (local runs through `scripts/memcap.sh 8`; server only through `rhrun`, GPU 1 only, default 4 cores / 8 GB / 3 hours per lane, one heavy lane per round up to 16 cores / 32 GB; check `rhstatus` first; stop own units). Version 1 is kept as `../engine/scratch/STRATEGY.v1.md`.

RH is open. No lane of this campaign has produced a statement about zeros of zeta. Section 0 says what five rounds did produce.

## 0. State after round 5 (50 lanes, all refereed once)

| kind | lanes | sum of referee scores | referee holds | lemmas decided | PROVED steps broken |
|---|---|---|---|---|---|
| explore | 22 | 0 | 18 | 3 | 4 |
| deepen | 9 | 1 | 9 | 4 | 0 |
| combine | 9 | 1 | 8 | 1 | 1 |
| compute | 5 | 0 | 4 | 0 | 0 |
| repair | 5 | 0 | 5 | 1 | 0 |

- Headline (metric part A): 1 of 4, unchanged since round 1 (`c1-leeyang-krein-limit`, R1 at stage level). A second lane has score 1 (`c4-helson-discrepancy-zerofree`, R1 for a theorem relative to zeta). No lane has R2, R3 or R4. Three-referee statements: 0.
- Frontier numbers (part B): none moved.
- Coverage (part C), after the graph rebuild of this review (202 tags): 800 of 20,301 tag-pair families closed, 456 tried, 19,045 untried (before the rebuild: 653 / 426 / 14,321 of 15,400; the totals rise with the tag vocabulary); 23 of 26 device types closed, 1 floored, 2 open.
- Reliability (part D): hold rate 88%; 5 PROVED sub-steps broken by referees.

What paid off, by the record:
1. Explore lanes close families at about one per lane and have never produced a referee flag (22 lanes, score sum 0, 4 of the 5 broken PROVED steps). None of the 240 candidates read from the generator's top 60 in rounds 2 to 5 was launched as generated; every explore lane was hand-built.
2. Deepen and combine lanes hold the two score-1 results, 5 of the 9 decided lemmas, and the two results that changed the filter: the THIN control (complete multiplicativity with unimodular parameters is consistent with a zero at any b in (1/2, 1)) and the reading of R3 for the 7/8 mechanism as lattice-translation invariance of the coefficients (Lemma 5.8 of the manuscript), not "Euler product".
3. Compute lanes decided their stated question in 4 of 5 cases, each time against the lead. The fifth (`c5-thin-propd-dichotomy`) measured a quantity that cannot decide its question (a total mean square instead of the probe (6.1)); its control claim was refuted by the referee.
4. Repair lanes changed the generator more than any attack lane: closed-device rejection, curated device list, closed families.

## 1. Allocation rule, version 2: 8 lanes per round

| lanes | type | source and condition |
|---|---|---|
| 1 (was 3) | explore | a device type that is not in `engine/curated/devices.json`, or one of the open device nodes. Before launch the plan states what the device reads (frequencies only; discrete special values; sizes of local parameters; the zero set; the family in the conductor aspect) and the control of that class (any Dirichlet series; interpolation twin; unimodular twist U or THIN; DH; non-periodic THIN). If the named control passes every planned step, the lane is not launched and the slot goes to deepen. |
| 3 (was 2) | deepen | the lead of section 4.0 (effective order 2 in the 7/8 architecture, and the periodicity input), one lane per missing item listed there. |
| 2 | combine | pairs listed under "Results that could be combined" in `ROUND_LOG.md`; each side states in advance which of R1..R4 it supplies. A combine lane whose two sides are both identities (hold for a control) is not launched. |
| 1 | compute (server) | one pre-registered question. The plan names the exact object to be computed (formula number or definition), the statistic, the threshold, and what each of the two outcomes changes in the next allocation. A run that computes a neighbouring object is recorded as NOT-RUN. float64/GPU output is a screen; a verdict needs exact or interval arithmetic. |
| 1 (new fixed slot) | referee and repair | referee debts of the lead first (section 4.0), then map and engine bookkeeping. A result that the lead depends on gets a second referee here before a further lane is built on it. |

Every lane, before work starts, answers the three questions of map section 2 and states: which step uses multiplicativity (R1), why the conclusion is uniform in height (R2), which step fails for each control including THIN, U, the Liouville twist, the window translate and the interpolation twin (R3), and how it would cross from finite stage or Re s > 1 to the line (R4). A lane with no answer for R4 is allowed only as explore or compute, and says so.

Every lane ends with RESULT.md, one referee (REFEREE.md), and one line in `lanes.jsonl` (format in METRIC.md). A lane scoring 3 or more, or any statement about zeros, gets two further independent referees before it is counted.

Reporting rule added: work inside the 7/8 architecture cannot raise the headline of part A (known architecture). Each round the planner reports, next to the headline, the state of "R4 inside the 7/8 architecture" as one of: no probe with h > 1; a model vertex with h > 1 and a named unproved input; a proved probe with h > 1 (which would go to three referees).

## 2. Adaptation rules

- Explore returns to 2 lanes (taken from deepen) when a round's three deepen lanes decide no lemma and name no new missing item.
- A deepen item of section 4.0 that receives its second same-kind obstruction is removed from the list; when the list is empty the lead is closed and the allocation returns to 3 / 2 / 2 / 1 with the explore condition of section 1 kept.
- If the referee hold rate over the last two rounds is below 50%, one combine lane becomes a repair lane and claims labelled PROVED need a written proof in RESULT.md, not a pointer.
- The compute lane is skipped when no pre-registered question exists whose answer would change the next allocation; the slot goes to deepen.
- Do not re-run a route closed in the atlas (PR 27 `historical-routes.md`), the obstruction map, an outcome record, or section 3.1 below. A re-run needs a named new input that the closing record did not have.
- Checkpoint after round 8: if no lane has a referee-confirmed R4 and section 4.0 has no item with a proved step beyond its present state, two lanes per round go to writing the closed-family results as one refereed statement (what a device must read to supply R1, R3 and R4 together, with the control that defeats each class), and the remaining six continue under this allocation. This is a record of obstructions, not a result about zeros.

## 3. Stopping rule for a family

Two refereed obstructions of the same kind close a family (tag pair). A closed family is reopened only by a new input named in the lane plan (a new theorem, a new 2026 result, or a tool listed as missing in the closing record). One refereed obstruction marks the family "tried, not closed": one more lane is allowed, and it must attack the stated obstruction, not repeat the route. A lane whose angle dies pivots once to the strongest adjacent idea; it does not cycle.

Campaign-level: the campaign does not stop on a claimed proof; a score-4 lane goes to three referees and all controls. It does stop spending on a lead after its second same-kind obstruction.

### 3.1 Families closed by this rule as of round 5

Each line: family; the closing lanes; the kind of obstruction. "Lead n" refers to the numbering of section 4.1 to 4.4.

1. Lee-Yang stages to the limit (leads 11, 13; the headline lane's own lead). `c1-leeyang-krein-limit`, `c1-leeyang-chain-closure`, `c2-polydisc-leeyang-bound`, `c3-fixedt-growingp-onesided`. Kind: the limit step is Hurwitz plus local boundedness of pole-renormalised stages, equivalent to the zero-free statement; stage tools are rotation-invariant and the unimodular twist is a rotation. No further lane.
2. Several-delay sections of the prime chain (lead 20). `c1-multidelay-bohr-section`, `c2-jinner-multidelay-lft`, second referee in `c3-repair-map-theorem-a`. Kind: rank-one additive defect; holds for DH.
3. Window forms on the critical-line side (leads 19, 23, and the shear part of 24). `c1-window-sdp-scaling`, `c1-spinor-hecke-primitive`, `c1-shear-hecke-fricke`, `c2-cutoff-hecke-defect`, `c2-euler-cone-fe-rigidity`, `c2-projection-domination-gonek`, `c3-multiwindow-converse-defect`. Kind: translation-invariant or window-local forms are the Weil form on a window; they do not contain the primes, and a fixed number of windows is passed by a lattice translate.
4. Positive-definiteness or one-sided bounds right of the line as a transport (lead 21). `c1-pd-log-strip`, `c3-fixedt-growingp-onesided`, `c3-lemmab-halfplane-growing-s`. Kind: restatement of the zero-free statement; sup bounds stop at support 2 log log T.
5. Pole-lattice test multipliers (Lemma B). `c2-euler-at-zeros`, `c3-lemmab-referee-dh-poisson`, `c3-lemmab-halfplane-growing-s`. Kind: explicit formula on a larger test class; DH satisfies it.
6. Partial Euler products sampled at zeros. `c2-euler-at-zeros`, `c2-euler-at-zeros-scale`. Kind: Landau-Gonek mean value; a function of log P / log T; same for DH.
7. Euler stages carrying the functional equation (canonical-system, Gonek, Rouche, collision index). `c3-twinladder-prime-built-chain`, `c4-fe-stage-rouche-crossing`, `c4-stage-collision-law`, `c3-rs-matched-halfsum-hb`. Kind: the on-line property holds for any non-vanishing P; the comparison with zeta is the zero-free statement; DH passes the margin at comparable rates.
8. Selectors on T^inf and discrepancy hypotheses on completely multiplicative chi (lead 9; Helson family). `c3-helson-tail-fe-selector`, `c4-helson-discrepancy-zerofree`, `c5-twisted-helson-arcs`. Kind: tail data against one-orbit data; relative to zeta (circular); identification, or passed by THIN.
9. Hecke operators on the Lax-Phillips space; Ramare / Matomaki-Radziwill factorisation as an every-window input. `c4-laxphillips-hecke-compression`, `c4-ramare-factorisation-pointwise`, with `c2-cutoff-hecke-defect` and `e2-below-level-mixed-moment` as the second same-kind records (Hecke operators as functions of the wave group or of translations; mean-value conclusions closed under linear combination).
10. Devices that read frequencies, discrete special values or sizes only (Baker, Turan power sums, p-adic interpolation, tensor-power squeeze, sum-product, Carleson/corona, strip Dirichlet-to-Neumann). `c5-device-table-extension`, with the device table rows that already closed each class. One lane; the classes are closed by their named controls.
11. Inside the 7/8 architecture, order 2 by re-expression of the same probe (lead 14 in that form; lead 18). `c5-target-fe-order2-ledger` (Lemma U and the exact LP), `e2-theta-dual-mseries-fe`, `e2-sixfold-period-z2`. Kind: target-blind algebra and reflections do not change the signal constant h.
12. Inside the 7/8 architecture, order 2 from abelian or symbol-type rows (lead 10; theta and half-integral-weight rows on double covers; angular, ring-class, anticyclotomic, quadratic families). `e1-gl3-theta-order2-rows`, `e2-gl3-cover-cuspidal-rows`, `c5-angular-family-absorption`. Kind: no absorption of mu without a nontrivial weight-1 cocycle of the epsilon factor.
13. Integer-side dual limits and Legendre / Vaughan one-sided certificates. `e1-cofinal-legendre-dual`, `e1-forcing-free-bilinear-split`, `e2-legendre-riesz-level-phase`, `e2-cofinal-moebius-pointwise`. Kind: the certified exponent is never below Theta (Landau).
14. Slot and moment refinements of the 7/8 method as a route below 5/6 (leads 15, 16). `e2-ms-slot-capacity`, `e2-below-level-mixed-moment`, `e2-two-scale-detector-moment`, `c4-kloss-marks-scaleup`. Kind: control-blind or sign-twist-invariant inputs; they can move numbers only inside [5/6, 7/8] (part B). Kept for part B; closed as a route to the line.

Tried, not closed (one more lane allowed, and it must attack the stated obstruction): long prime marks at l - lx = 2 (`c5-marks-circularity-order2`; closed inside a transcribed model only, and the referee does not hold one sentence of claim A); TRO6 through the signed c-sum (lead 17; `e2-tro6-signed-csum-stratified`, inter-stratum cancellation not excluded); Proposition D for THIN (`c5-thin-propd-dichotomy`, not decided).

Corrected after round 6 (`c7-repair-engine-map-r6`): the square realisation with a point-spectrum intertwiner (leads 7, 8) was not "never run": `res-point-spectrum-square` ran it before the campaign and `c6-square-intertwiner-weyl` added Theorem H2 and the Casimir class (map rows G27 to G30; closed for a fixed Hecke rule on a GL_2 cuspidal target and for the Casimir class; rank >= 2 compact-at-infinity squares without a Hecke rule stay open and carry no R1). Lead 22 was run in round 6 (`c6-quadratic-companion-positivity`, map row P50): device node `map-open-9` is closed for pointwise outputs; the density half was not run and MV-CAP applies to it. Never run by this campaign: the box run and Lorentzian degree >= 3 of leads 7 and 8, lead 2 (function-field Type II; left to the other workflow's `rh-b7-e2-ff` unit), base-side loading on X_0(4)(R) beyond what `c1-shear-hecke-fricke` section 5 records, lead 28.

## 4. Leads

### 4.0 Current best lead and the missing lemma

There is no lead with a referee-confirmed score of 2 or more outside the known architecture. The headline lane (`c1-leeyang-krein-limit`, score 1) is closed as a lead (section 3.1 item 1): its limit step is, by its own Theorem D, equivalent to the zero-free statement.

The lead carried into round 6 is the one place where R1, R2 and R3 are all present and the missing requirement has an exact form: **effective order 2 in the 7/8 architecture.** In the format of Proposition 2.1 of the manuscript the abscissa is 1 - h/r, with r the order of the row family (r = 6 today) and h the signal constant of the probe; h <= 1 in every proved system (floor 5/6); the critical line is h = r/2. The manuscript and the follow-up preprints are unrefereed at the lemmas named in the scoreboard; everything below is relative to them.

**Missing lemma (ORDER-2).** There is a probe J in the Proposition 2.1 format, for a row family of order r, with signal constant h > 1 (target h = r/2), whose low estimate is proved from an input that is not equivalent to GRH for the family and that fails for THIN. **Added requirement (round 6, `c6-marks-bc-manuscript-check` Lemma H, two referees; map row Z24): the normaliser H of the probe has no zeros in Re s > 1/2.** For the sextic rows of the manuscript H_eta contains L^S(6s - 3, (alpha eta)^6), with zeros in 7/12 <= Re s < 2/3, so hypothesis (2.2) fails below 7/12 and the unconditional conclusion of the format stops at abscissa 2/3 (admissible sigma_0 > 2/3; h = 2, effective order 3). A probe aimed at h = r/2 must have a zero-free normaliser on Re s > 1/2, or enlarge the family to contain the normaliser character and exclude common zeros.

What five rounds fixed about any proof of ORDER-2:
- It needs a different probe, not a re-expression of the present one (Lemma U, `c5-target-fe-order2-ledger`; one referee).
- The row family must be nonabelian with a nontrivial weight-1 cocycle of the epsilon factor (Jacobi-sum type, order >= 3), since mu is absorbed in no abelian family (`c5-angular-family-absorption`; the abstract-family row is argued, not proved). Candidate named by referees and not tested: genuine cusp forms on the double cover of GL(3) (map 6.18).
- The only region of the exponent ledger that shows h > 1 is lx < l, where the reduced system is inconsistent, so one of its inputs is false there and has not been identified (`c5-target-fe-order2-ledger` E2; `c5-marks-circularity-order2`).
- At the point reaching abscissa 1/2 in the reduced model (h = 3) the low input is equivalent to GRH for the family (`c5-marks-circularity-order2`, inside the transcribed model, not checked against the manuscript). A proof of ORDER-2 has to avoid that point or show the model is wrong there.
- The input that separates zeta from THIN in the present mechanism is periodicity of every twist in the conductor aspect (Lemma 5.8). Which half of Proposition D (low estimate or high comparison) fails for THIN is open.

Items for the three deepen lanes, the compute lane and the referee slot of round 6 (each is decidable at default size):
1. Compute lane, pre-registered: the probe I_w of (6.1) for w = eps (THIN, b = 0.95, class-balanced or random set, not the greedy set), Liouville and 1, at Z = 2^10 .. 2^18, with the two norms of Proposition D. Decides which half of Proposition D fails. Tools: `push/c5-thin-propd-dichotomy/rows.c`, `push/c5-thin-walk-replay/EXCHANGE.md` condition (N).
2. Deepen: epsilon factor of a nonabelian order >= 3 family (double cover of GL(3)); finite check of the weight-1 cocycle criterion. Outcome either closes ORDER-2 for that family or gives the first family where mu can be absorbed. Obstruction recorded (round 6, `c6-gl3-cover-epsilon-cocycle`, map row Z23; the referee holds a narrower claim only): given the recalled Gelfand-Tsetlin recipe, in the local data of a double cover of any rank the quadratic symbol occurs only together with q^(-1/2), and quadratic twist families of any GL(n) form carry no Jacobi-type epsilon value, so no absorption of mu at shift 0 through local data. Not covered: global Whittaker constants of a genuine cusp form; chi(-1) = -1; sources not opened.
3. Deepen: the false input in the region lx < l. Test with the `tmp/sextic` tools (treated as text and as stand-alone scripts) whether unreflected marked theta rows obey a K + D mean square for 1 + l <= M < 2 + 2l or carry the (KD)^(2/3) term; settles referee item E3 of `r3-method-limit`. Obstruction recorded (round 6, `c6-unreflected-marks-kd23`; referee does not hold the headline, the measurement and two identities stand): unreflected theta rows show no (KD)^(2/3) term (random rows pass the same test, so flatness is not an arithmetic test); the dual coefficients are mu times a Hecke character, so the row norm K + D is itself a zero-free statement about the target family (argued). "No consistent vertex with h > 1" is not shown; vertices with 1 < h <= 3 are underived. Probes of higher degree in the target do not change the ledger (`c6-pair-probe-bridge-order2`, map row Z15c).
4. Deepen: Theorems B and C of `c5-marks-circularity-order2` against the manuscript text (the h = 3 / GRH equivalence), with the false sentence of claim A corrected. Obstruction recorded (round 6, `c6-marks-bc-manuscript-check`, map rows Z24, Z26; Lemma H, Lemma S and Theorem B1' checked by a second referee, `REFEREE2.md`): the reduced system omitted the normaliser; "low input equivalent to GRH" is replaced by the chain GRH => (N) => (R), with (R) => GRH open; the long-marks branch gives no input weaker than its conclusion.
5. Referee slot: second referee for Lemma U; the abstract-family row of the angular lane (Theorem 7(iv), Froehlich-Queyrut opened, not recalled); the Hoheisel exponent in ray classes that THIN rests on (locate the theorem or mark THIN as relative to an unlocated statement in the control table).

Second lead, lower priority (explore slot if no new device type is proposed): lead 22 / device node `map-open-9`, quadratic or mean-value positivity with automorphic companions. It is the one open device type never tested. Known risk recorded in advance: rows P25 and N9 close the linear and even-moment forms, and round-4 lesson 7 (a conclusion class closed under linear combination holds for DH) applies to any mean-value form. Status after round 6: tested and closed for pointwise outputs (map row P50); no longer an open device type.

### Standing leads of version 1 (numbering kept; status of each is in section 3.1)

### 4.1 From SYNTHESIS_OVERNIGHT.md section 2 (partial results worth continuing)

1. K-loss removal in the 7/8 method (`n1-maass-selberg-norm`, `n2-kloss-sdp-certificate`). Open: Conjecture WLS and PAIR(l); the correct target is the infinity-to-one norm of the mark Gram matrix against its trace. Model end point 31/36, conditional. Evidence at the model point rests on 4 to 6 marks: a compute-lane candidate (larger Z, more marks, cube completion).
2. (L*) over F_q[T] through the exact cubic sieve identity (`n3-ff-cubic-sieve-rational-deflation`). Remaining: Type II correlation of the row coefficients with twisted cubic Gauss sums. Not run. Gives a function-field statement and a template only.
3. Spike structure of the cubic large sieve (`n2-cubic-sieve-spike-deflation`). No bounded-rank deflation leaves a flat remainder at K = D <= 18000; growing-rank deflation not tested.
4. Spectral-window family positivity (`n4-spectral-window-moebius`). The one mechanism where DH fails at a multiplicative step (Hecke linearisation). Stops at mollifier length 1/2; detector step P2 unproved. Reopen only with a tool that sums over Kloosterman moduli with signs.
5. theta^w as a standing control (`n3-theta-power-departure-law`, `n3-twin-ladder-endpoint-bridging`). Use as a control in every lane (R3 list).
6. Untested remainders named by referees: theta representation and cuspidal / maximal-parabolic coefficients on the double cover of GL(3) as order-2 rows; W-coefficient Frobenius of Connes-Consani section 7.1; square of the scaling site with Frobenius correspondences and non-idempotent coefficients; other automorphic realisations of the rows gamma_2(c) chi_c(m).

### 4.2 From SYNTHESIS_AUTOMATIC_POSITIVITY.md

7. Selected step: decide whether a square realisation of Q_L exists with a point-spectrum intertwiner in the classes the squares no-go does not cover (U a function of Hecke operators or of the Casimir on the cuspidal part of a metaplectic quotient; a group compact at infinity). First deliverable: Weyl law of the candidate spectrum against (T/2 pi) log(T/2 pi e) for each class. Expected outcome stated there: a narrower no-go.
8. Not selected there, still open: the box run (expected to reproduce row Q11); a degree >= 3 Lorentzian polynomial with an independent source; ladder Prop E(d).
9. Torus no-go covers translation-invariant properties only; properties tied to chi = 1 (where Hecke structure lives) are not covered.
10. Order 2: a non-Poisson representation of quadratic rows through half-integral-weight Kuznetsov or Salie sums.

### 4.3 From SYNTHESIS_POSITIVITY_RESIDUALS.md

11. Selected step: decide whether the closure of pair-ferromagnet laws equals the whole Lee-Yang class, in chain form (P = wQ + Q* with all Schur-Cohn parameters of Q in [0,1)). Finite-dimensional and decidable; belongs to the only lane with a referee-confirmed structural control failure (at stage level). Prerequisite repairs: Thm. 6(d) restriction, Prop. 7(b) restriction, Curie-Weiss wording.
12. Secondary closure: decide whether S(T) - (1/pi) arg zeta(1/2+a+iT) is unbounded for fixed 0 < a <= 1/2 (yes closes shifted interlacing partners).
13. The stage-to-limit loss: the unimodular twist U passes the same stage theorem and its limit has a zero in the strip. Any Lee-Yang continuation must name what U lacks in the limit (this is R4 for that lane).

### 4.4 From OBSTRUCTION_MAP.md section 6 (not covered)

14. Effective order 2 in the 7/8 architecture (h = r/2).
15. Below-level mixed moment sum_u |M_{r*} S_m|^2 << U^E with E < 1.1366-1.1452.
16. Slot capacity in MS Lemma 17.1 (r + 2z < 1 versus r + z < 1); whether the K-loss is the true size of the marked row norm.
17. TRO6 through the signed c-sum (dual-sum cancellation; squarefull stratification; Type I on average over the level; trilinear Gauss-sum form).
18. The 7/8 probe as a period on the 6-fold cover, Z/2 factor of Z/6 separating the exceptional coset.
19. Hecke defect on p-primitive tests for all p jointly (window form on (c, c + 2 log p]).
20. Jointly inner multi-delay sections of the prime chain; boundary nodes of R_a for a >= 1/2; a DH analogue of the section no-go. **CLOSED 2026-11-18** (`c1-multidelay-bohr-section` and `c2-jinner-multidelay-lft`: two same-kind obstructions; Theorem A' held under a second referee pass with ball-arithmetic checks, `push/c3-repair-map-theorem-a/REFEREE2.md`; map rows Q12, Q22). Closed: jointly J-contractive several-delay sections on the full polydisc, finite or infinite prime set, any normalisation; the DH analogue (the no-go holds for DH, so the lead supplies neither R1 nor R3). Not treated by any lane: boundary nodes of R_a for a >= 1/2; sections on a Reinhardt shell or containing the gamma term. Reopen only with a new input named in the lane plan (section 3).
21. Exact positive-definiteness of log F(sigma + iu) for 1/2 < sigma <= 1 without H_W.
22. Quadratic or mean-value positivity with automorphic companions (beyond linear 3-4-1).
23. Semidefinite coupling of finite-order positivity with the explicit formula in one window; windowed Nehari problem and a uniform quantum q_* for clusters.
24. Sheared Hecke commutator at tau -> 0; base-side loading on X_0(4)(R) with Fricke w_4.
25. Two-sided or variation information on S(t) for Lambda certificates; certified t > 0 probe floors; larger verified height (Lambda only; no converse to zeros).
26. Hybrid target-row mean value; higher-degree Q(d/dz)F inertia; multi-piece mollifiers; ideation angles 4-12; log-derivative defect along the flow.
27. Controls not run: sign twist in the seven `h-*` lanes; backward heat in `stack-feasibility` and `sq-canonical-det`; interval certificates for the DH theta kernel checks.
28. Outside the source set: zero statistics beyond pair level; adelic operator constructions beyond the GL(1) test vector; inputs from other 2026 results.

### 4.5 Reading of the leads against R1..R4 (version 1 view, kept for the record; superseded by sections 3.1 and 4.0)

- Leads 1, 3, 14-18 act inside the 7/8 architecture: R1-R3 present, R4 absent, model floors >= 5/6. They move frontier numbers (part B), not the headline (part A).
- Leads 7, 9, 10, 11, 13, 19, 20, 24 are where a new mechanism could supply R1 and R3; each lacks R4 as posed. (Lead 20 closed 2026-11-18, see the entry.)
- Leads 21 and 23 are the ones posed directly at R4 (crossing Re s = 1, or a window with a gap).
- Leads 12, 27 are low-cost closures: schedule in round 1 as part of deepen/repair.
- Lead 25 concerns Lambda only.

## 5. Change log

- v1 (2026-11-17): initial allocation 3 / 2 / 2 / 1, stopping rule, standing leads.
- 2026-11-18 (`c3-repair-map-theorem-a`): lead 20 marked closed after the second referee pass on Theorem A'; no other change.
- v2 (2026-11-18, strategy review after round 5):
  - Allocation 3 / 2 / 2 / 1 changed to 1 explore / 3 deepen / 2 combine / 1 compute / 1 referee-and-repair. Reason: 22 explore lanes have score sum 0 and carry 4 of 5 broken PROVED steps; deepen and combine carry both score-1 results, 5 of 9 decided lemmas and both filter changes; a repair lane was needed in every round since round 2.
  - Explore lanes must name what the device reads and the control of its class before launch (round-5 lesson 5).
  - Compute lanes are pre-registered on the exact object (after `c5-thin-propd-dichotomy`).
  - Adaptation rules rewritten for the new allocation; checkpoint after round 8 added.
  - Section 3.1 added: 14 families closed by the stopping rule, 3 tried and not closed, the leads never run.
  - Section 4.0 added: current lead (effective order 2 in the 7/8 architecture), the missing lemma ORDER-2, and five decidable items for round 6. The headline lane's own lead (Lee-Yang limit) is closed.
  - Reporting rule: state of "R4 inside the 7/8 architecture" reported each round next to the headline.
  - Generator weights changed in `engine/generate.py` (dict `WEIGHTS`): heightUniform 0-3 to 0-1; underused 0-4 to 0-2; floored device 2 to 1; separator 2 to 3; size and nonlinear keyword parts 1 to 0.5. Reason: under the old weights rank 1 was a triple discarded by hand in two earlier readings whose device node (`map-open-21`) is closed, and the order within the top 60 followed the reader label `uniform` and the under-used bonus, neither of which has an outcome behind it. After the change and a rerun of `merge_outcomes.py`, `build_graph.py`, `generate.py --top 60`: 1,577 nodes, 60 outcome entries (48 closed), 36,471 generated, 8,913 scored; the top 60 has no closed device; 12 contain an open device (all `map-open-9`; `map-open-1` appears in none) and 48 rest on the floored 7/8 device only, because two open device nodes remain and a device node is capped at 12 appearances; rank 1 is a TRO6 triple at 12.9. The weights change the order, not the composition: the generator cannot propose a device type that has no node. The ranking remains a reading order; it has not predicted any outcome.
- 2026-11-18 (`c7-repair-engine-map-r6`, repair slot of round 7): section 3.1, the line "never run" for the square intertwiner lead and for lead 22 corrected (both were run; map rows G27 to G30 and P50). Section 4.0: obstructions recorded on items 2, 3, 4; requirement "normaliser has no zeros in Re s > 1/2" added to ORDER-2 (map row Z24, two referees). What is left under 4.0 is derivation work (round-6 lesson 1): the uncompensated high side from manuscript (12.5)/(16.1) with the normaliser kept, and the compensated principal signal below Re s = 3/5. Engine: `map-open-9` closed for pointwise outputs, `map-open-1` narrowed, three open device nodes added (`laurent-shell-gamma-section`, `ff-order2-vertex-probe`, `landau-siegel-2026-mechanism`). No allocation rule changed.
