# Assembles campaign/STRATEGY.md version 5 from version 4 (engine/scratch/STRATEGY.v4.md) plus new sections.
import os
HERE = os.path.dirname(os.path.abspath(__file__))
V4 = os.path.join(HERE, 'STRATEGY.v4.md')
OUT = os.path.join(HERE, '..', '..', 'campaign', 'STRATEGY.md')
L = open(V4, encoding='utf-8').read().split('\n')

def idx(prefix):
    hits = [i for i, x in enumerate(L) if x.startswith(prefix)]
    assert len(hits) == 1, (prefix, hits)
    return hits[0]

i0 = idx('## 0. State after round 10')
i0a = idx('## 0a. State after round 14')
i1 = idx('## 1. Allocation rule')
i2 = idx('## 2. Adaptation rules')
i3 = idx('## 3. Stopping rule for a family')
itried = idx('Tried, not closed (one more lane allowed')
i4 = idx('## 4. Leads')
i40 = idx('### 4.0 Read classes on which the record is silent')
i40b = idx('### 4.0b Record of version 3')
i5 = idx('## 5. Change log')
idir = idx('## Directive from the user, 2026-11-19')

sec0 = '\n'.join(L[i0:i0a])
sec0a = '\n'.join(L[i0a:i1]).replace('0.8748866470', '0.8748866471')
sec3_head = '\n'.join(L[i3:itried]).rstrip('\n')
sec3_tail = '\n'.join(L[itried:i4])
old40 = '\n'.join(L[i40 + 1:i40b])
rest4 = '\n'.join(L[i40b:i5])
changelog = '\n'.join(L[i5:idir]).rstrip('\n')
directive = '\n'.join(L[idir:])

HEAD = r'''# Campaign strategy, version 5 (2026-11-19, strategy review after round 15)

Seven-day adaptive campaign. The planner reads this file, `SCOREBOARD.md`, `ROUND_LOG.md`, the engine (`../engine/`) and the filter (`../push/OBSTRUCTION_MAP.md` plus `../engine/outcomes/`) at the start of each round, and may issue a new version of this file with the change and its reason recorded at the bottom. Compute rules: `../push/BRIEF.md`, read to the end (local runs through `scripts/memcap.sh 8`; server only through `rhrun`, GPU 1 only; limits of the update of 2026-11-19: default per lane up to 8 cores, 12 GB and 6 hours, heavy lanes up to 16 cores and 32 GB, cupy pool limit 24 GB, wait or shrink when the slice is above 60 GB; check `rhstatus` first; never stop a process by name; stop own units when done). Earlier versions: `../engine/scratch/STRATEGY.v1.md` to `STRATEGY.v4.md`.

RH is open. No lane of this campaign has produced a statement about zeros of zeta. Section 0 says what ten rounds produced; section 0a adds rounds 11 to 14 and the checkpoint; section 0b adds round 15 and the screening arm, and is the basis of the version-5 allocation in section 1.
'''

SEC0B = r'''## 0b. State after round 15 (130 lanes; screening arm of 10 lanes not counted)

| kind | rounds 1-14: lanes / score sum / holds / lemmas decided / PROVED broken | round 15: same | all |
|---|---|---|---|
| explore | 40 / 0 / 35 / 33 / 5 | 1 / 0 / 1 / 4 / 0 | 41 / 0 / 36 / 37 / 5 |
| deepen | 24 / 1 / 21 / 24 / 2 | 2 / 0 / 2 / 4 / 0 | 26 / 1 / 23 / 28 / 2 |
| combine | 28 / 1 / 26 / 25 / 2 | 2 / 0 / 2 / 4 / 0 | 30 / 1 / 28 / 29 / 2 |
| compute | 14 / 0 / 13 / 8 / 0 | 1 / 0 / 1 / 3 / 0 | 15 / 0 / 14 / 11 / 0 |
| repair | 16 / 0 / 15 / 2 / 2 | 2 / 0 / 2 / 0 / 0 | 18 / 0 / 17 / 2 / 2 |
| total | 122 / 2 / 110 / 92 / 11 | 8 / 0 / 8 / 15 / 0 | 130 / 2 / 118 / 107 / 11 |

Source: `lanes.jsonl`, recomputed for this review. The hold counts include author passes recorded as referee passes for at least three repair lanes (referee item E2 of `push/c15-repair-record-strategy-v4-report/REFEREE.md`); without them the rate through round 14 is 89.9%, not 90.2%.

- Headline (part A): 1 of 4, unchanged since round 1 (`c1-leeyang-krein-limit`; missing R2, R3, R4; closed as a lead, section 3.1 item 1). Second lane at score 1: `c4-helson-discrepancy-zerofree` (R1 for a theorem relative to zeta; family closed, item 8). The other 128 lanes score 0. No lane has R2, R3 or R4.
- Frontier (part B): no figure moved. Zero-free abscissa 7/8 (Lean-checked); 0.8748866471 claimed in unrefereed manuscripts (method infimum 0.874886647039964).
- What round 15 did under the version-4 allocation: the five non-record lanes each returned a precise obstruction or a dead search, and four of the eight checkpoint classes received a control or a row in one round: U1 and the SIZE branch of U2 (control ZQ = zeta times a rational symmetric multiplier: zeta's own functional equation, every prime-power atom of log zeta, zeros at prescribed 1/2 +- eta +- i g, defect an absolutely continuous density of sup size O(eta^2 + d^2)); U5 within one span (the translate passes eta T log(T/2 pi)/pi contiguous windows); U7 (Fejer-tapered section: the limit step is sound and the stage inequality at unbounded P is the Weil form, row P45). The dictionary DN search (2.9 million pair nodes) found no separating functional at the nine-class and six-class tiers; the canonical three-class tier has 67,138 float64-undecided nodes and is not closed.
- Screening arm (parallel workflow, `push/s1-*`, server): 10 lanes, 40 combinations of untried tag-pair families turned into finite statistics, 0 survivors. Every separation found was one of four kinds: the control's own off-line zeros read at the explicit-formula scale (cutoff at or above the height); coefficient size readable right of 1; a count of on-line zeros; a mean value. One lane proved that every functional of the list of on-line ordinates takes the same value on zeta and on T-NR. These lanes have no line in `lanes.jsonl` and no independent referee; `SCREEN_SURVIVORS.md` does not exist.
- State of "R4 inside the 7/8 architecture": no proved probe with h > 1 (unchanged since round 10).

What paid off, by the record, since the checkpoint:
1. Deepen and combine lanes aimed at "turn one silent class into a verdict" removed four class entries in one round (U1, U2-SIZE, U5 within a span, U7). No other allocation of the campaign shortened the list of unclosed read classes this fast. Their score sum is 0.
2. The single explore lane stopped at stage A, as the 12 before it: 13 of 13 two-stage explore lanes since round 11 stopped at stage A with a control passing or an identity.
3. Compute: the heavy lane decided its registered question (outcome "none") at two of three tiers; the tier left undecided is a float64 resolution limit, which only ball arithmetic removes. With the screening arm the server has now run 41 pre-registered searches of finite statistics with no survivor.
4. Repair lanes decided no lemma and changed three recorded sentences that were false as written (among them "no control on file has zeta's own functional equation"); the owed list after round 15 is longer than before it (round-15 "Owed" paragraph of `ROUND_LOG.md`).
5. Generator: no candidate was taken as a lane in rounds 11 to 15. Its top 60 stands on the floored 7/8 device in every rerun since version 3.
'''

SEC1 = r'''## 1. Allocation rule, version 5: 7 lanes plus 1 to 3 compute lanes per round

Version 5 allocation: **1 explore, 2 deepen, 1 combine, 1 to 3 compute, 2 repair-and-record** (version 4: 1 / up to 2 / up to 2 / 1 / 2). Frontier stays withdrawn. At most two lanes per round work on the 7/8 estimate machinery (user directive); in round 16 none does.

| lanes | type | source and condition |
|---|---|---|
| 1 | explore: device design, stage A on paper | One lane on one silent cell of section 4.0 or a device type absent from `engine/curated/devices.json`. Entry test before stage A: questions Q-P, Q-B, Q-S (map section 2, Lemmas P and F) and the new question Q-A (does the step read absence of coefficient mass off log N, or the sign of Lambda against a density of sup size O(eta^2 + d^2)? if neither, ZQ passes for a single object and NR-q for a twist family); for a cell of U3 the entry items (i) to (vi) of `push/c15-referee-r14-independent-checkpoint/CHECKPOINT_R15_REFEREED.md`. Stage A: (i) one displayed candidate inequality; (ii) the step that uses multiplicativity and the step that uses the functional equation, marked; (iii) one row per control (ZQ, NR-q, DEL, THIN, U, DH, E_a, T-NR, EIS-w, BLS, window translate, interpolation twin, backward heat, sign twist) naming the first step that fails for it. A control passing every step ends the lane with a device row. Stage B (any computation) only after stage A has no passing control and a second referee has read the control table. |
| 2 | deepen | Only on an item that turns one silent cell into a verdict (a control constructed inside it, or a proof that none exists), or that fixes the reach of a closed row by a proof. Round 16: the POS cell of U2 (missing lemma POS-FE, section 4.0); Proposition 5 of the U7 lane by power sums (statement C(theta), section 4.0). A slot with no such item goes to the record. |
| 1 (was up to 2) | combine | A pair from "Results that could be combined" in `ROUND_LOG.md` with the same aim. Round 16: combinable 1 (ZQ + Lemma F + the lift ruling as a paper filter run over the remaining cells U3, U4, U6, U8, with the list of cells in which no control on file passes). |
| 1 to 3 (was 1) | compute, server, each may be heavy | Filled in this order, each lane pre-registered as before (exact object, statistic, threshold, decomposition with a prediction per part, components removed before a fit, seeded control classes with at least 24 seeds, canonical lifts T-NR, E_a, HEAT only, what each outcome changes). (1) A question whose answer changes the next allocation. (2) A certified conversion: a row the record uses with label MEASURED or float64-undecided, redone in ball arithmetic at the scale that decides it (round 16: the 67,138 undecided nodes of the canonical tier of dictionary DN; the draw-stage recount of the c14 joint search for the canonical tier). (3) A search of a silent cell beyond its searched range, after the paper exclusion lemmas for that cell have a referee (round 16: U8 only if the heat-inheritance exclusion and Lemma J1' are refereed first; otherwise not run). A slot with no item under (1) to (3) is not filled. The screening arm of the parallel workflow is separate and is not counted here; rule for it in section 2. |
| 2 (1 once the owed list is empty) | referee, repair and record | Lane A: independent referees for the previous round, for the author-pass lanes (E2), for Lemma J1', the U8 exclusion, and for a sample of the screening lanes before any of their statements is entered in the map. Lane B: the owed list of round 15 (map rows S12b, Q25, the DN row, control rows ZQ, SG, NR-q; 30 label restrictions; corrections E1 to E3 in `CAMPAIGN_REPORT_R15.md`; pole clause of Lemma L restored in three places; section 4.0 of this file against the refereed checkpoint; device states in `engine/curated`), then Statement O. When the owed list is empty the second lane becomes a deepen lane. |

Every lane, before work starts, answers the pre-filter questions and states: which step uses multiplicativity (R1), why the conclusion is uniform in height (R2), which step fails for each control (R3), and how it would cross from finite stage or Re s > 1 to the line (R4). A lane with no answer for R4 is allowed only as compute, deepen (bounded item), combine (filter) or repair, and says so.

Every lane ends with RESULT.md, one independent referee (REFEREE.md; an author pass is recorded as referees = 0), and one line appended to `lanes.jsonl` by the lane itself (format in METRIC.md). A lane scoring 3 or more, or any statement about zeros, gets two further independent referees before it is counted.

Every lane whose first test is numerical runs it on the server at the largest scale that decides the question (BRIEF, update of 2026-11-19), through `rhrun`, after `rhstatus`; float64 and GPU output is a screen, never a verdict.

Reporting rule (kept): work inside the 7/8 architecture cannot raise the headline of part A. Each round the planner reports the state of "R4 inside the 7/8 architecture" as one of: no probe with h > 1; a model vertex with h > 1 and a named unproved input; a proved probe with h > 1 (three referees).

Process rules (kept from versions 3 and 4, with two added from round 15):
- A lane stops only processes whose PIDs or unit names it recorded when it started them. No name-filtered lists.
- Scripts take absolute output paths and write next to themselves. Nothing is written to the repo root (round 15: two lanes overwrote an untracked root file through relative paths).
- Server logs are polled at intervals of minutes.
- A PROVED lemma about a control object includes a numeric check that the object is not identically zero.
- A source that cannot be opened is cited as "relative to <source>", not as PROVED.
- A formula derived at a zero is not a check at a hypothetical parameter value.
- Before allocating, the planner checks `push/` and `engine/outcomes/` for an existing lane on the same device; engine and scoreboard are rerun before the record is edited.
'''

SEC2 = r'''## 2. Adaptation rules

- An explore lane that passes stage A (no control passes every step) becomes the lead of section 4.0 in the next round and receives 3 lanes: one for the proof step, one for the controls run numerically on the server, one independent referee of the control table. The other slots shrink in the order compute (items 2 and 3), combine, deepen.
- The same three-lane rule applies when a deepen or combine lane produces a non-identity statement that no control on file passes at a named step (referee-confirmed R3), and in particular to a quantitative form of POS-FE (section 4.0): an inequality that bounds the distance of the zeros of G from the line by the size of the negative part of Lambda_G. An exact identification (G = c zeta) does not trigger the rule: it enters the map as an identification row in class U3.
- A silent cell is removed from section 4.0 when a lane constructs a control inside it (it becomes a map row) or two referee files show it contains no device beyond the target.
- Compute survivors: a functional or statistic that zeta passes and every canonical control fails on held-out members gets a full attack lane with a referee in the next round, ahead of everything except a stage-A pass (user directive). It carries no score until a structural reason is proved.
- Screening arm (parallel workflow). After 40 combinations with no survivor and the same four causes in every lane, a combination is screened only if its statistic is none of: (a) a function of the list of on-line ordinates alone (T-NR takes the same value); (b) a sum over zeros with cutoff at or above the height (reads the control's zeros); (c) a coefficient-size statement readable right of 1; (d) a zero count or a mean value. The allocator states for each combination why it is none of the four. If the next 40 screened combinations again give no survivor, the arm falls to one lane per round and the freed server share goes to certified conversions.
- Checkpoint after round 20. If by then no lane has passed stage A and no silent cell has produced a non-identity statement that no control passes, explore falls to 0 and the campaign spends its remaining rounds on: second referees and certified conversions for every line of Statement O still labelled MEASURED or ARGUED; the remaining silent cells in the order of section 4.0; and one reopening of the frontier slot only with a named new input. The campaign result stays in the form of section 0a.
- Engine bookkeeping (kept): `engine/merge_outcomes.py` is not rerun over learn-step entries without a before/after comparison reported entry by entry.
- If the referee hold rate over the last two rounds is below 50%, the combine lane becomes a repair lane and claims labelled PROVED need a written proof in RESULT.md, not a pointer.
- Do not re-run a route closed in the atlas (PR 27 `historical-routes.md`), the obstruction map, an outcome record, or section 3.1 below. A re-run needs a named new input that the closing record did not have. Literature is rescanned once per week inside the repair slot (generic search terms only).
- Record wording (kept): the record supports separate conditional statements, one per read class; it does not support a joint clause on what a device must read (map row O1).
'''

SEC31_ADD = r'''
Added by the review after round 15 (rounds 11 to 15). Map rows in brackets where a row exists; "one lane" marks a family closed by its named control rather than by two same-kind lanes. The full sentences are in `ROUND_LOG.md`, "Families now closed", rounds 11 to 15.

28. Device designs on carriers of periodicity with a twist functional equation (read set RS-1). `c11-rs1-regular-rep-matrix-bridge`, `c11-rs1-twist-modulus-reciprocity`, `c12-x04-oval-hecke-fricke-loading`, `c13-bilinear-reciprocity-height-antibridge`. Kind: the carrier decomposes over characters, or the step is an identity; the target's functional equation is not read; T-NR and E_a pass every step.
29. de Branges shift positivity in entire-function, weight, backward-heat and tied-conductor forms (read set RS-3). `c11-rs3-debranges-positivity-family`, `c12-heat-tied-family-open-cell`. Kind: false for zeta; a lattice-zero control passes.
30. States, depth aspect and pointwise open-strip inequalities. `c12-bost-connes-crossed-product-duality` (three classes of states; row D8), `c12-depth-aspect-height-transfer` (Lemma X), `c12-univ-pointwise-control-wcone` (control UNIV). One lane each, two referees each. Kind: states see the commutative part; termwise exchange does not separate; extreme rays with off-line zeros. Not covered: Bost-Connes states outside the three classes (cell U6 (e)).
31. Hecke eigen-objects at a zero on Eisenstein carriers: Luo-Rudnick-Sarnak counts, Borel data of any rank, Kac-Moody rank one, the weight-1/2 metaplectic series, the catalogued X2 inequalities on torus parameters, and Hecke amplification of the truncated norm with T >= N. `c13-lrs-twist-amplification-zero-representation`, `c13-kacmoody-eisenstein-affine-weyl-shift`, `c14-theta-orthogonal-metaplectic-eigenobject`, `c14-x2-step-catalogue-zero-indexed-objects`, `c15-edge-argument-strip-width-hecke-amplified`. Kind: pole minus gamma pole equals 1; the truncated norm is exact and the inequality is an identity at a zero; EIS-w and BLS pass. [G37 to G40] Not covered: rank >= 2 non-Borel or metaplectic objects; amplifiers with T < N (argued only).
32. Lax-Phillips resonance states in solid, Hecke-sup, L^q and zero-mode norms. `c4-laxphillips-hecke-compression`, `c14-laxphillips-hecke-norm-outside-l2`. Kind: the bound is the definition, admissibility, or Zagier's criterion. Not covered: non-solid norms outside these families.
33. Sign functionals of one kernel (cone and non-cone; dictionary D, orders 2 to 4, at most three parameters), Edrei-Thoma local total positivity, Fourier interpolation with zero nodes. `c13-tnr-invariance-prefilter-noncone-census`, `c13-noncone-kernel-separator-search`, `c13-fourier-interpolation-zero-nodes`. Kind: T-NR, E_a or the battery DH pass; the search part is measured and finite. Not covered: cell U8.
34. Joint functionals of a kernel pair or triple: dictionary DJ (homogeneous), ratios L(chi)/zeta, cross bridge Gram forms, twist-transfer Weil forms, dictionary DN (quotients, logarithms, triples with the group law) at the nine-class and six-class tiers. `c14-joint-pair-design-ratio-vortex-cross-bridge`, `c14-joint-zeta-twist-noncone-search`, `c15-nonhomogeneous-pair-triple-kernel-search`. Kind: HEAT with equal tau is exactly blind to reads unchanged by a common pointwise factor; BLS and T-NR pass the forms; the rest is a measured finite search. Not closed: the canonical three-class tier of DN (67,138 undecided nodes); the residual of cell U4.
35. The function-field probe in genus >= 2 and the squarefree part of the cube term. `c11-ff-genus2-probe-jk`, `c11-ff-row-energy-four-part`, with item 26. Kind: the symmetric block reads reality only (fakes pass); the cube term is companion energy times a count and is not target-specific. This closes the entry "function-field probe on genus >= 2 targets" of the tried list below.
36. New large-sieve and structured-moment inputs for part B. `c11-frontier-nth-order-sieve`, `c12-frontier-xu-sang-structured-moment`. Kind: arbitrary-coefficient inequalities sharp on the Gauss-sum vector; a moment derived from a count returns the count. No figure changed; the frontier slot is withdrawn.
37. Read classes U1 {FE, GEOM} and U2 {FE, SIZE} as classes without a control. `c15-control-with-zeta-fe-classes-u1-u2` (independent referee holds with corrections E1 to E5), `c15-referee-r14-independent-checkpoint`. Kind: control ZQ passes when the inputs are read on prime-power atoms; read on coefficients the classes are cells of U3 (Hamburger). For twist families the control is NR-q. One construction; a second referee on ZQ is owed before the map row is final.
38. Window devices inside one span (class U5) and identification-type conclusions against translates. `c2-euler-cone-fe-rigidity`, `c3-multiwindow-converse-defect`, `c15-u5-window-count-threshold-translate-control`. Kind: the translate passes every window of a span of relative length eta log(T/2 pi)/pi; free-prime products pass below a parameter count of 24 + 0.36 K (float64, no certificate). [S12b proposed]
39. Sections of the prime chain with P = t^theta (class U7). `c3-fixedt-growingp-onesided`, `c15-u7-growing-section-twin-ladder-bridge`. Kind: the tapered stage inequality at unbounded P is the Weil form on Fejer tests (row P45); the band bounds are met by random sign chains; the sharp section is expansive for zeta itself. [Q25 proposed] Kept as a bounded item: statement C(theta) and Proposition 5 (section 4.0).
40. Nodes of the user's geometric program as sources of a new inequality (Klein transport certificate, Lemma W, bridge shear, torus). `c14-prefilter-sweep-geometric-nodes`, `c15-klein-transport-lemma-w-stage-a-and-e1`. Kind: Lemma W is a target-level hypothesis; the Klein certificate is not sign-definite at height; 14 of 15 re-read silent nodes agree with the first reader.
41. Finite statistics built from measured phenomena of the idea graph (screening arm). `push/s1-*`, 10 lanes, 40 combinations. Kind: the four causes of section 0b. Closed for allocation only: the lanes have no independent referee and no map row.
'''

TRIED_NEW = r'''Tried, not closed (one more lane allowed, and it must attack the stated obstruction): the density (family) half of quadratic positivity with automorphic companions (MV-CAP applies; not scheduled); rank >= 2 compact-at-infinity squares without a Hecke rule (no R1; cell U6 (d)); Hecke amplifiers with T < N on truncated Eisenstein data (argued only; item 31); the canonical tier of dictionary DN (item 34; compute item 2 of section 1); the POS cell of U2 (section 4.0). The entry "function-field probe on genus >= 2 targets" of version 4 is closed (item 35).
'''

SEC40 = r'''### 4.0 Current best lead, missing lemma, and the silent cells (version 5)

**There is no lead with a referee-confirmed score of 2 or more.** The best-scoring lanes are the two score-1 lanes of round 1 and round 4, both closed as leads. What follows is the least blocked item, stated as such; no lane has a registered reason to expect R4 from it.

**Least blocked item (round-15 learn step, item (a)): the POS cell of U2.** Among functions with zeta's own functional equation the record now has: the family is G = zeta m with m(s) = m(1 - s) (Lemma A); Lemma L (PROVED given Landau's theorem; referee confirms): if G is meromorphic with at most a simple pole at s = 1 and no other pole, and Lambda_G >= Lambda as measures, then G = c zeta; the pole clause is necessary (referee counterexample m_+ with extra poles); Lemma D for discrete multipliers. Not decided: the same conclusion from Lambda_G >= 0 alone.

**Exact missing lemma, POS-FE.** Let G be meromorphic in C with a simple pole at s = 1 and no other pole, of finite order, satisfying zeta's functional equation (conductor 1, zeta's gamma factor), and suppose -G'/G(s) = integral over [1, infinity) of x^(-s) d nu(x) in some half-plane with nu a non-negative measure. Then G = c zeta. Either a proof, or a G not proportional to zeta with these properties.
- Reading by this review, not refereed: for a multiplier m whose defect D = nu - Lambda has a density, nu >= 0 forces D >= 0 off the atoms of Lambda and Lemma L applies; the undecided part is multipliers whose defect has atoms or a singular part (generalised Dirichlet series with frequencies off log N), where Lemma D gives an l1 distance and no sign statement.
- What each outcome is. A construction is a control in the POS branch of U2 and closes it. A proof is an identification statement (cell of U3) with the pole clause as its arithmetic input; it says nothing about zeros and scores 0. Only a quantitative form would be a non-identity statement: "nu >= -eps mu for a fixed reference measure mu forces every zero of G within f(eps) of the line, f(eps) -> 0". ZQ shows the dependence cannot be better than eps of order eta^2 + d^2 for an absolutely continuous defect. No candidate proof of the quantitative form is on file.

**The statement in which the wall R4 is now written most concretely, C(theta) (U7 lane; row Q25 proposed).** With L_F(s; P) the Fejer-tapered section of the prime chain on the gamma one-port (L_F = sum over zeros of K_u(s - rho), u = log P, Re K_u >= 0 on Re w >= 0): there are theta > 0 and M such that Re L_F(1/2 + it; t^theta) >= -M for all t >= t_0. Status: implied by RH; proved only for P up to about ((1/4) log t log log t)^2, a range in which every sign twist satisfies it too; for P unbounded at fixed height it is equivalent to RH (limit step by Harnack and Vitali, sound); measured for zeta in 14 cells up to P = 1e8, violated by 24 of 24 random multiplicative sign chains for theta >= 1 and in a long scan at theta = 1/2. Its consequence on the zero side (Proposition 5: zeros within c_theta/log gamma of the line) is argued for a single off-line pair only. The gap between "P a power of log t" and "P a power of t" is the gap; no step on file uses multiplicativity to cross it. Bounded item for round 16: decide Proposition 5 by a power-sum argument (it fixes what any device of this type can reach; it gives no new region).

The missing lemma CROSS-1 of version 3 (section 4.0b) has no candidate on file after five rounds and is kept as a record.

**Silent cells after round 15** (source: `push/c15-referee-r14-independent-checkpoint/CHECKPOINT_R15_REFEREED.md`, one referee, with the outcomes of round-15 lanes 1 to 6 applied; not a list of leads, not shown complete, no joint clause):

| cell | read set of the decisive step | state after round 15 | round-16 lane, or none |
|---|---|---|---|
| U3 | identification classes: {FE, INT} at conductor 1 (Hamburger); degree one with FE, INT and the Euler-product axiom (Kaczorowski-Perelli); {POS, GEOM at every rational prime, INT}; {FE, pole at 1 only, Lambda_G >= Lambda} (Lemma L) | no control can lie in such a class; R3 is tested by relaxing one input inside a family where the conclusion is false (INT: T-NR in Laurent form, ZQ, NR-q; FE: U, THIN, DEL; FE at all heights: WT; GEOM: E_a; POS: sign twists). U1 and U2-SIZE are cells of it. The record has identifications here and no inequality | combine (Q-A filter); explore may take one cell |
| U2-POS | {FE, Lambda_G >= 0} with exact atoms | neither constructed nor excluded: POS-FE above | deepen |
| U4 residual | joint functionals of zeta and twists that are not of the five closed types and not invariant under a common pointwise factor: quotients at different points, a logarithm of one member alone, kernels with polar terms, triples read through the group law at several points | dictionary DN closed at two tiers (measured); canonical tier undecided at float64; Lemma J1' has one derivation and no referee | compute (certified conversion of the canonical tier); referee for J1' |
| U5 beyond a span | window conditions at heights with ratio beyond 1 + eta log T/pi, reading more than pi(N) prime conditions | every statement found there is F = zeta on the window (combinable 4); no row yet | none (record: row S12b) |
| U6 (a), (b) residual | rank >= 2 non-Borel or metaplectic eigen-objects with parameter rho; non-solid Lax-Phillips norms outside the tested families | no candidate on file | none |
| U6 (c) | global Whittaker constants of a genuine cusp form on the double cover of GL(3) | unchanged; no computation of such constants is on file | none |
| U6 (d) | rank >= 2 compact-at-infinity squares without a Hecke rule | unchanged; carries no R1 | none |
| U6 (e) | Bost-Connes states outside the three classes of row D8 | unchanged; first control T-NR | explore candidate |
| U6 (f) | functionals of the unsummed complex isogenous points that are neither linear nor a second moment | unchanged; first control T-NR | explore candidate |
| U6 (g) | scattering inequalities reading an exact normalisation, the archimedean factor or f(z) = f(1 - z); rank above one; the two-variable affine kernel | Schur, bounded-analytic and Pick conditions closed (BLS) | explore candidate |
| U8 | single-object kernel sign conditions beyond the searched range (order above 4, more than three parameters, nodes outside [-2.6, 2.6], other normalisations) | three proved exclusions (minors on one lattice; Polya-frequency orders; monomial inequalities for kernels without polar terms, the last unrefereed) | compute item 3 only after the referee |

Entry test for a lane on one of these cells: section 1, explore row. A lane whose aim is to turn a cell into a verdict states which outcome it registers.

Inside the one mechanism with R1 to R3 (the 7/8 architecture; reported with the part-B figure, not a read class for R4): open and not closed by the record are (E-K) in the window Z/P < X < ZP by a method keeping the signs of the dual sum, the target-specific excess of (E-H), the below-level mixed moment and the slot capacity of Lemma 17.1, and TRO6 at a resolution below 0.01. Each moves the abscissa only between the method's floors; none is a read set for the critical line. No lane is allocated to them in round 16; the directive allows up to two per round when a named new input exists.

### 4.0c Record of version 4, section 4.0 (round 15; superseded by 4.0)
'''

CHANGE = r'''
- v5 (2026-11-19, strategy review after round 15; previous file `../engine/scratch/STRATEGY.v4.md`; assembled by `../engine/scratch/mk_strategy_v5.py`):
  - Allocation 1 explore / up to 2 deepen / up to 2 combine / 1 compute / 0 frontier / 2 repair changed to 1 explore / 2 deepen / 1 combine / 1 to 3 compute / 0 frontier / 2 repair (1 once the owed list is empty). Reasons: the deepen and combine lanes aimed at silent classes removed four class entries in round 15 (U1, U2-SIZE, U5 within a span, U7), and the two items the learn step ranks least blocked are both deepen items (POS-FE; Proposition 5), while only one combine item on file is a filter rather than record work; 13 of 13 two-stage explore lanes since round 11 stopped at stage A, so explore stays at 1; the user directive of 2026-11-19 asks for up to three heavy compute lanes, and the round-15 heavy lane left one tier undecided at float64, which defines a compute item (certified conversion) that did not exist in version 4.
  - Compute slots are filled in a fixed order: allocation-changing question; certified conversion of a measured or undecided row; search of a silent cell beyond its range only after its exclusion lemmas are refereed. A slot with no item is not filled.
  - Explore entry test: question Q-A and controls ZQ, NR-q, BLS added to the stage-A table; lifts restricted to the canonical ones (T-NR, E_a, HEAT) by the lift ruling.
  - Section 2: three-lane rule extended to a quantitative form of POS-FE; rule for the screening arm (four excluded kinds of statistic; reduction after 40 more combinations without a survivor); checkpoint after round 20.
  - Section 3.1: items 28 to 41 added (rounds 11 to 15 and the screening arm); tried list rewritten; "function-field probe on genus >= 2" closed.
  - Section 4.0 rewritten: no lead with score 2 or more; least blocked item the POS cell of U2 with the exact missing lemma POS-FE; statement C(theta) recorded as the most concrete form of R4 on file; silent cells after the refereed checkpoint (U1, U2-SIZE, U5 within a span, U7 removed; U2-POS, U4 residual, U5 beyond a span added or narrowed). Version 4's section 4.0 kept as 4.0c.
  - Corrections owed from the referee of the version-4 lane applied here: E3 (figure printed as 0.8748866471, not below the method infimum), E4 (compute limits of the BRIEF update of 2026-11-19 in the first paragraph); section 0b records E2 (author passes counted as referee passes). E1 concerns `CAMPAIGN_REPORT_R15.md` and stays with the repair lane.
  - Generator weights changed in `engine/generate.py` (dict `WEIGHTS`; previous file `engine/scratch/generate.before-strategy-v5.py`): separator 3 -> 1.5; the cheap-test part split into `cheapMeasured` 1 -> 0.25 and `cheapNamed` 1 (unchanged). Comparison of ranks with outcomes: no candidate was taken as a lane in rounds 11 to 15, so there is no new rank-outcome pair from the campaign lanes; the evidence is the screening arm, whose 40 combinations (33 with a measured, certified or tool member; 0 survivors) included the separator node of the rank-1 candidate, `euler-detection-depth-law`, with no survivor. Under the old weights a measured member and a measured separator carried up to 5 of the 11.5 points of rank 1. Reruns through `scripts/memcap.sh 8` (log `engine/scratch/rerun-strategy-v5.log`): baseline `build_graph.py` and `generate.py --top 60` with the old weights after the round-15 learn step (1,701 nodes, 963 live, 9,025 edges; 36,558 generated, 8,437 scored; top 60 identical in keys and scores to the list on file); then `generate.py --top 60` with the new weights: 44 of the 60 keys in common, 16 new; rank 1 is the former rank 3 (`capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `tro6-natural`, 10.25); the former rank 1 is rank 5 (9.25); candidates with a named open lemma or conjecture 35 -> 36. `outcomes.json` and `closed_families.json` are byte-identical before and after (`merge_outcomes.py` not run). All 60 still stand on the floored 7/8 device (five device nodes, 12 each): the weights change the order, not the composition; the generator cannot propose a device in a silent cell, because the cells have no node. The list remains part-B reading; its ranking has not predicted an outcome.
'''

parts = [HEAD, sec0, sec0a.rstrip('\n') + '\n', SEC0B, SEC1, SEC2, sec3_head + '\n' + SEC31_ADD, TRIED_NEW,
         '\n'.join(sec3_tail.split('\n')[1:]),  # drop the old tried paragraph, keep what follows it
         '## 4. Leads\n', SEC40, old40, rest4, changelog + CHANGE + '\n\n', directive]
open(OUT, 'w', encoding='utf-8').write('\n'.join(p.rstrip('\n') + '\n' for p in parts))
print('wrote', os.path.abspath(OUT))
