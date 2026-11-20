# Campaign report after round 14 (written in round 15, 2026-11-19)

Written by lane `c15-repair-record-strategy-v4-report` under the checkpoint rule of `STRATEGY.md` section 2 (version 4). Counts are read from `scoreboard.json` (generated 2026-11-19T18:16Z), `../engine/curated/devices.json`, `../push/OBSTRUCTION_MAP.md` and `lanes.jsonl` by `../push/c15-repair-record-strategy-v4-report/mk_report.py`. Round-15 lanes other than the writing lane had not reported.

## 1. Result as it stands

- The Riemann hypothesis is open. The campaign has produced no statement about the location of zeros of zeta, at any level of confidence. No lane has a referee-confirmed crossing from finite stages or from the region right of 1 to the critical line (requirement R4: none).
- Headline of the requirement score (metric part A): **1 of 4** (`c1-leeyang-krein-limit`; missing R2, R3, R4), unchanged since round 1. Lanes by score 0/1/2/3/4: 120 / 2 / 0 / 0 / 0. The 7/8 zero-free half-plane (a known result, not of this campaign) calibrates at 3 and is excluded from the headline.
- What the campaign reports instead, from round 15 on: (i) a refereed record of obstructions (section 2), which says where each tried route stops and which control function passes it; (ii) the part-B figure (section 3), a zero-free abscissa claimed in unrefereed manuscripts.
- Every referee in this record is an internal adversarial pass by another agent of the same campaign. Nothing here has external review.

## 2. The refereed record of obstructions

### 2.1 Statement O, version 3

File: `../push/c12-repair-sources-statement-o-v3/STATEMENT_O_v3.md` (map row O1). Twelve separate conditional statements, one per read class, each of the form: a device whose whole read set lies inside class j is defeated by control C_j in a stated mode. It is not a statement about zeros, it does not say what a proof must read, and it does not say that no device exists. There is no joint clause.

| line | read class | control |
|---|---|---|
| 1 | size, positivity, support of Lambda | sign twists, THIN, DEL, E_a |
| 2 | functional equation with kernel positivity, no Euler product | Davenport-Heilbronn |
| 3 | Euler product, positivity, functional equation, finite order; no size normalisation | E_a = zeta(s+a) zeta(s-a) |
| 4 | flow-stable hypotheses | backward heat |
| 5 | Euler product, positivity, pole; no functional equation | DEL (thin prime deletion), relative to a counting statement S(theta) |
| 6 | invariance under a local test-vector change | T-NR |
| 7 | complete multiplicativity with unimodular parameters, no periodicity | THIN, relative to the same counting statement |
| 8 | frequencies only | any Dirichlet polynomial on the same frequencies |
| 9 | special values only | interpolation twin |
| 10 | mean values only | cluster lifts, relative to hypothesis H_W |
| 11 | exact identities | every control for which the identity holds |
| 12 | finite stages with a limit | unimodular twist U |

Labels under the statement's own rule (PROVED = two referee files cover the closing step): PROVED 4 (lines 3, 6, 8, 9, in narrowed form), PROVED relative to a cited theorem 1 (line 5), MEASURED 1 (line 2), ARGUED 6 (lines 1, 4, 7, 10, 11, 12). Referee files: `c9-obstruction-record-statement/REFEREE.md`, `c10-repair-record-referee-r9/REFEREE2.md`, the rewrite `c11-repair-del-referee-record/STATEMENT_O_v3.md` and the reader pass of `c12-repair-sources-statement-o-v3`. Lines 13 to 20 exist in outline form only.

### 2.2 The obstruction map

File: `../push/OBSTRUCTION_MAP.md`. **202 labelled rows** after this lane (198 before; rows G37 to G40 added for round 14). Each row: route, where it stops, status label, the controls that pass it, source lane.

Referee records behind the rows (mechanical count: for each row, the largest number of referee records among the lanes named in its source cell; a record is the `referees` field of `lanes.jsonl` or a REFEREE*.md file in the lane directory; second passes kept only in a repair lane's directory are not counted unless the learn step recorded them; the count is per source lane, not per row statement):

| map section | rows | 0 referee records | 1 | 2 | 3 or more |
|---|---|---|---|---|---|
| 3.1 positivity reformulations | 55 | 3 | 45 | 7 | 0 |
| 3.2 geometric structures | 40 | 0 | 35 | 5 | 0 |
| 3.3 square-root lane | 29 | 14 | 11 | 4 | 0 |
| 3.4 stacking | 12 | 10 | 2 | 0 | 0 |
| 3.5 zero-free machinery | 39 | 5 | 25 | 9 | 0 |
| 3.6 flow and Lambda | 8 | 1 | 7 | 0 | 0 |
| 3.7 function-field transplant | 3 | 1 | 2 | 0 | 0 |
| 3.8 local conditions | 6 | 1 | 4 | 1 | 0 |
| 3.9 device types (rounds 5, 12, 13) | 9 | 0 | 7 | 2 | 0 |
| 3.10 Statement O | 1 | 0 | 0 | 1 | 0 |
| all | 202 | 35 | 138 | 29 | 0 |

The 35 rows with no referee record come from the lanes the map header lists as unrefereed (pre-campaign lanes of 2026-11-16/17); the map marks them "(author)" or "unrefereed" where used. No row has three referee records by this count. The one statement of the campaign with three referee reports is `c8-row-energy-squared-signal` (an obstruction inside the 7/8 architecture; not about zeros). Per-row counts: appendix A and `../push/c15-repair-record-strategy-v4-report/row_referee_counts.json`.

Controls on file (map section 2): Davenport-Heilbronn, backward heat, sign twists (TW+, TW-), E_a, T-NR, Beurling (literature, not opened), window translate, THIN, DEL in the table; in notes: unimodular twist U, EIS-w (off-resonance Eisenstein series), interpolation twin, UNIV (joint universality filter), BLS (scattering-level Blaschke control; proved in rank one), NR-vec (local-vector control on the double cover; added in round 15 from round 14), phase-rotated transfer operator and theta^w in single rows. Pre-filters: Lemma P (T-NR passes linear identities, dilation-invariant cone conditions and conditions away from one prime) and Lemma F (P with Blaschke and symmetric-multiplier stability). One sentence of the lane behind Lemma F (E1, on the bridge ratio for shift a < 1/2) is recorded as not holding until its repair lane reports.

### 2.3 Device types (candidate mechanisms for crossing to the line)

File: `../engine/curated/devices.json`. **51 device types: 50 closed, 1 floored, 0 open.** "Closed": a map row or a refereed lane shows that the device returns its input, restates the target, or holds for a control. "Floored": it yields a proved statement about zeros with a floor above 1/2 fixed by the method.

- Floored (1): `coherent-set-large-sieve`. This is the 7/8 architecture (coherent sets with a large sieve): model floors 13/15, 31/36, 6/7, 23/27, 5/6 and the scalar bound B >= 1 - h/r; no proved probe with signal constant h > 1.
- Closed (50): `mean-value-convexity`, `exact-uniqueness`, `residue-explicit-formula`, `positive-kernel-transport`, `maximum-principle`, `dual-measure-compactness`, `recurrence-ergodicity`, `euler-fe-phase-at-height`, `selberg-operator`, `monotone-flow-functional`, `geometric-positivity`, `stage-limit`, `section-extraction`, `test-restriction-commutator`, `finite-support-positivity`, `hecke-compression-lax-phillips`, `hecke-correspondence-recurrence`, `helson-discrepancy`, `twisted-discrepancy`, `frequency-only`, `padic-special-values`, `tensor-squeeze`, `strip-dtn-identity`, `sum-product-vinogradov`, `quadratic-positivity-companions`, `effective-order-two`, `laurent-shell-gamma-section`, `function-field-order2-vertex`, `vector-specific-row-mean-square`, `nonprincipal-row-cancellation`, `positive-term-sum-rule`, `single-row-bridge`, `landau-siegel-mechanism`, `twist-modulus-reciprocity`, `regular-rep-matrix-bridge`, `de-branges-positivity-family`, `bost-connes-crossed-product-positivity`, `depth-aspect-height-transfer`, `x04-oval-hecke-fricke-loading`, `kacmoody-loop-eisenstein-maass-selberg`, `fourier-interpolation-zero-nodes`, `lrs-amplification-eisenstein-at-zero`, `edrei-thoma-local-total-positivity`, `bilinear-reciprocity-height-jform`, `dictionary-d-kernel-sign-functionals`, `laxphillips-hecke-norm-outside-l2`, `joint-pair-ratio-crossgram-twist-transfer`, `lrs-count-rank-one-eigenobject-at-zero-theta-orthogonal`, `catalogued-x2-inequality-torus-parameter-eigenobject`, `dictionary-dj-joint-pair-sign-functionals`.
- Closed as MEASURED only (finite searches on registered grids, not proofs): `dictionary-d-kernel-sign-functionals`, `dictionary-dj-joint-pair-sign-functionals`. Closed with an argued part: `kacmoody-loop-eisenstein-maass-selberg` (rank one proved, affine kernel argued); `laxphillips-hecke-norm-outside-l2` (four named norm families only).
- Pending proposals without a node (8): Read class U3; Read class U6, cells (e), (f), (g); Read class U8; Density (family) quadratic forms with automorphic companions; Global Whittaker constants of a genuine cusp form on the double cover of GL(3); Rank >= 2 compact-at-infinity squares without a Hecke rule (no R1); Model vertices with 1 < h <= 3 in the order-2 ledger (underived); Non-locality step 4 of the Rouche lane.

### 2.4 What the record is silent on

Eight read classes U1 to U8 (`STRATEGY.md` section 4.0, from `CHECKPOINT_R14_DRAFT.md`; the draft has no independent referee yet). These are the classes on which the record is silent, not leads: no line of Statement O and no closed row applies, and the record neither defeats nor supports a device there. For U1, U2 and U3 the silence is by construction: no control on file has zeta's own functional equation, so requirement R3 cannot be tested there with the control table. Five of the eight have a round-15 lane; none has a registered reason to expect a crossing.

### 2.5 The common finding

Summary of map section 5 and the lessons in `ROUND_LOG.md`: where a property separated zeta from a control it was an identity equivalent to the target, a certificate at verified height, or a mean value; the Euler product and the functional equation met in one inequality only inside the 7/8 architecture (through periodicity of twists in the conductor aspect, never with s <-> 1 - s for the target) and in mean values. No lane found an inequality that uses multiplicativity and the functional equation together, holds in every window, and fails for every control.

## 3. Part B: the frontier figure

- Zero-free half-plane, Lean-checked: Re s > 7/8 = 0.875 (the openai/math result of 2026-10; kernel-checked; local replay of 2924 of 2924 closure modules; Mathlib, LeanCert and two external packages not replayed; trust basis is a single build).
- Zero-free abscissa, claimed: **0.8748866470** (scoreboard value 0.874886647; method infimum B_flat = 0.874886647039964...). It is not proved at any level checked here. Dependencies: the 7/8 manuscript and three unrefereed preprints (Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835); the value is Liu II Lemma 14.10 read as a scalar statement and recomputed in ball arithmetic, with the exponent arithmetic hand-checked relative to the manuscripts. Not checked: manuscript Lemmas 14.3, 15.2, 18.1 at the new geometry; Liu II Lemma 14.11; the Xu-Sang stage values in Lean; three appendix steps (read only). Not in Lean; the Lean certificate below kappa = 3/4 is conditional on an unformalised bound.
- The figure did not move during the campaign (rounds 1 to 14). Two frontier lanes (rounds 11, 12) with named new inputs returned no change; the frontier slot is withdrawn.
- Lambda (de Bruijn-Newman), for reference: accepted 0.2 (Platt-Trudgian); conditional 0.116060 (depends on: abscissa 0.87488665 (unrefereed) plus Raymond chain H2-H4 (tables not verified)); a further claim 0.107964910079 has status "Status: replayed and partially refereed. Not "verified".".
- A bound on the abscissa below 7/8 says nothing about the critical line: the method family has floors above 1/2 fixed by its format.

## 4. Reliability of the record (metric part D)

- Lanes run: 122, each refereed at least once. Referee hold rate: 90.2%. Sub-steps labelled PROVED that a referee broke: 11 (index: map section 7). Statements with three referee reports: 1 (about zeros of zeta: 0).
- Search coverage (part C; tag-pair families are a bookkeeping unit, not a measure of mathematical coverage): 1695 graph nodes; 89253 families, 3190 closed, 651 tried and not closed, 85412 untried.
- Open lemmas decided during the campaign (bounded items; no lane record is marked as a statement about zeros): 92.

## 5. Limits of this report

- A row closes the device that was tested, in the form tested. It does not close the read set the device came from, and absence of a row is not evidence for a route.
- Seven rows of round 13 have two independent referee passes; the four rows of round 14 (G37 to G40) have one each; two device types are closed on finite numerical searches.
- Sources cited as "relative to" were not opened (among them Zagier 1981 for regularised Rankin-Selberg, Luo-Rudnick-Sarnak 1995, Ingham 1937, the Beurling literature); statements resting on them carry that label in the map.
- The checkpoint list U1 to U8 is an unrefereed reading and is not shown to be complete.
- The part-B figure is a reading of unrefereed manuscripts by this campaign's lanes; it is not a result of the campaign.

## Appendix A. Referee records per map row (count as defined in 2.2)

- 0: P12, P13, P34, Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q11, Q13, Q16, Q17, Q18, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, Z4, Z5, Z9, Z16, Z20, F7, T3, L4
- 1: P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30, P31, P32, P33, P37, P38, P39, P40, P41, P42, P43, P44, P45, P47, P48, P49, P50, P52, G1, G2, G3, G4, G5, G6, G7, G8, G9, G10, G11, G12, G13, G14, G15, G16, G17, G18, G19, G20, G21, G22, G24, G25, G26, G27, G28, G29, G30, G31, G32, G37, G38, G39, G40, Q10, Q14, Q15, Q19, Q20, Q21, Q23, Q24, Q25, Q26, Q27, S11, S12, Z1, Z2, Z3, Z6, Z7, Z8, Z10, Z11, Z12, Z13, Z14, Z15, Z17, Z18, Z19, Z21, Z15c, Z23, Z24b, Z27, Z29, Z30, Z31, Z32, Z33, F1, F2, F3, F4, F5, F6, F8, T1, T2, L1, L2, L3, L5, D1, D2, D3, D4, D5, D6, D7
- 2: P35, P36, P46, P51, P53, P54, P55, G23, G33, G34, G35, G36, Q12, Q22, Q28, Q29, Z15b, Z22, Z24, Z25, Z26, Z28, Z34, Z35, Z36, L6, D8, D9, O1
