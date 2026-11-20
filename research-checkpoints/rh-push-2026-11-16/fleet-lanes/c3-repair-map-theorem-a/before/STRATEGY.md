# Campaign strategy, version 1 (2026-11-17)

Seven-day adaptive campaign. The planner reads this file, `SCOREBOARD.md`, `ROUND_LOG.md`, the engine (`../engine/`) and the filter (`../push/OBSTRUCTION_MAP.md` plus `../engine/outcomes/`) at the start of each round, and may issue a new version of this file with the change and its reason recorded at the bottom. Compute rules: `../push/BRIEF.md` (local runs through `scripts/memcap.sh 8`; server only through `rhrun`, GPU 1 only, default 4 cores / 8 GB / 3 hours per lane, one heavy lane per round up to 16 cores / 32 GB; check `rhstatus` first; stop own units).

## 1. Allocation rule (start point): 8 lanes per round

| lanes | type | source |
|---|---|---|
| 3 | explore | new combinations from the generator (`engine/generate.py`, `CANDIDATES.json`) that involve under-used nodes of the user's geometric program (nodes with the fewest outcome records); each must touch at least one open, untried family (metric part C) |
| 2 | deepen or repair | the best partial results: highest requirement score first (metric part A), then the standing leads in section 4 |
| 2 | combine | two earlier results joined, where one supplies a requirement the other lacks (for example an R1/R3 stage-level mechanism with an R2 all-heights identity); state in advance which of R1..R4 each side supplies |
| 1 | heavy compute (server) | decides one stated question numerically at a scale not yet sampled; float64/GPU output is a screen, the verdict comes from exact or interval arithmetic |

Every lane, before work starts, answers the three questions of map section 2 and states: which step uses multiplicativity (R1), why the conclusion is uniform in height (R2), which step fails for each control (R3), and how it would cross from finite stage or Re s > 1 to the line (R4). A lane with no answer for R4 is allowed only as explore or compute, and says so.

Every lane ends with RESULT.md, one referee (REFEREE.md), and one line in `lanes.jsonl` (format in METRIC.md). A lane scoring 3 or more, or any statement about zeros, gets two further independent referees before it is counted.

## 2. Adaptation rules

- Shift one lane per round from explore to deepen for each lane that reached score >= 2 with R1 or R4 among the confirmed flags in the previous round (maximum 4 deepen lanes).
- Shift one lane from deepen to explore when two consecutive rounds add no referee-held partial result.
- If the referee hold rate over the last two rounds is below 50%, the next round spends one combine lane on repair of broken PROVED claims and tightens the pre-work check (claims labelled PROVED need a written proof in RESULT.md, not a pointer).
- The heavy compute lane is skipped when no stated question exists whose answer would change the next allocation; the slot goes to explore.
- Do not re-run a route closed in the atlas (PR 27 `historical-routes.md`), the obstruction map, or an outcome record. A re-run needs a named new input that the closing record did not have.

## 3. Stopping rule for a family

Two refereed obstructions of the same kind close a family (tag pair). A closed family is reopened only by a new input named in the lane plan (a new theorem, a new 2026 result, or a tool listed as missing in the closing record). One refereed obstruction marks the family "tried, not closed": one more lane is allowed, and it must attack the stated obstruction, not repeat the route. A lane whose angle dies pivots once to the strongest adjacent idea; it does not cycle.

Campaign-level: the campaign does not stop on a claimed proof; a score-4 lane goes to three referees and all controls. It does stop spending on a lead after its second same-kind obstruction.

## 4. Standing leads

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
20. Jointly inner multi-delay sections of the prime chain; boundary nodes of R_a for a >= 1/2; a DH analogue of the section no-go.
21. Exact positive-definiteness of log F(sigma + iu) for 1/2 < sigma <= 1 without H_W.
22. Quadratic or mean-value positivity with automorphic companions (beyond linear 3-4-1).
23. Semidefinite coupling of finite-order positivity with the explicit formula in one window; windowed Nehari problem and a uniform quantum q_* for clusters.
24. Sheared Hecke commutator at tau -> 0; base-side loading on X_0(4)(R) with Fricke w_4.
25. Two-sided or variation information on S(t) for Lambda certificates; certified t > 0 probe floors; larger verified height (Lambda only; no converse to zeros).
26. Hybrid target-row mean value; higher-degree Q(d/dz)F inertia; multi-piece mollifiers; ideation angles 4-12; log-derivative defect along the flow.
27. Controls not run: sign twist in the seven `h-*` lanes; backward heat in `stack-feasibility` and `sq-canonical-det`; interval certificates for the DH theta kernel checks.
28. Outside the source set: zero statistics beyond pair level; adelic operator constructions beyond the GL(1) test vector; inputs from other 2026 results.

### 4.5 Reading of the leads against R1..R4 (planner's starting view)

- Leads 1, 3, 14-18 act inside the 7/8 architecture: R1-R3 present, R4 absent, model floors >= 5/6. They move frontier numbers (part B), not the headline (part A).
- Leads 7, 9, 10, 11, 13, 19, 20, 24 are where a new mechanism could supply R1 and R3; each lacks R4 as posed.
- Leads 21 and 23 are the ones posed directly at R4 (crossing Re s = 1, or a window with a gap).
- Leads 12, 27 are low-cost closures: schedule in round 1 as part of deepen/repair.
- Lead 25 concerns Lambda only.

## 5. Change log

- v1 (2026-11-17): initial allocation 3 / 2 / 2 / 1, stopping rule, standing leads.
