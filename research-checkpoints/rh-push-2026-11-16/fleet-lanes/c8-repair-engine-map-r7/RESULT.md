# c8-repair-engine-map-r7: referee debts of round 7, owed map rows, generator coverage, outline of the obstruction record

Internal working note, 2026-11-18. Slug `c8-repair-engine-map-r7`. Kind: repair. Not refereed. Nothing committed,
pushed or posted. No server use (no ssh). Local runs through `scripts/memcap.sh 8` only: three check scripts
(`.venv-arb/bin/python`: 2 minutes, a few seconds, 20 seconds), one rerun of a c5 script (output written to this
lane), the engine scripts (about 1 minute in total), two instrumented generator runs.

This lane is not an attack. No statement about zeros of zeta is made. RH is open; 7/8 (unrefereed manuscript) and
0.874886647 are unchanged; no bound moves.

Labels: PROVED (argument written in the cited file) / CONFIRMED (re-derived, agrees) / ARGUED / MEASURED / OPEN.

## Verdict

**Partial result (bookkeeping and referee work; the decisive check of the assignment is met).**

1. Decisive check. After the engine rerun, 0 of the top-60 candidates contain a closed device node, and each of the
   five open device nodes is in at least one: `single-row-bridge` 12, `ek-vector-specific-row-mean-square` 12,
   `ff-order2-vertex-probe` 8, `eh-nonprincipal-row-cancellation` 6, `map-open-1` 4 (recounted from
   `engine/curated/devices.json`, `engine_counts.json`).
2. Cause of the missing coverage: the closed family `fam-order2-theta-rows` matched the text of `map-open-1` and of
   `ff-order2-vertex-probe` by itself (841 of 978 and 2,209 of 2,405 candidates), and the reuse penalty would have
   taken 24 points from `map-open-1`. Both rules are changed for open device nodes only. No output cap was binding.
3. Referee debts: Theorem K and Lemma HS of `c7-probe-format-h-cap` hold under a second referee, with the
   Hilbert-Schmidt bound extended to blockwise estimates (PROVED). Lemma A stays ARGUED; two of its three open
   sub-steps are closed, one remains. Lemma H of `c6-marks-bc-manuscript-check` holds under a third referee, from the
   series (7.10) with (7.8). Lemma 2 of `c7-laurent-shell-gamma-section` is PROVED for monomial m and zeta (proof
   written by this referee) and stays ARGUED for the non-monomial m on which the lane's sign conclusion rests.
4. Map rows owed are written as proposed text (`campaign/MAP_PENDING.md` Part 2); the map was not edited.
5. The outline of the obstruction record is written (`campaign/OBSTRUCTION_RECORD_OUTLINE.md`).
6. c5 `tiers_fe2.log` rows Y2, Y6: the log reproduces; the rows are mislabelled (default G = src under the label
   "G polar"), which is error E1 of the c5 referee. The explanation given in round 7 (a script version) is not the cause.

## 0. Plan

Order of work: (a) the decisive test first, i.e. find why two open device nodes produce no candidate, since the fix
decides what else the engine part needs; (b) the three referee debts in the order of the assignment; (c) map text;
(d) outline. Read: BRIEF to the end; STRATEGY (sections 1, 2, 4.0); ROUND_LOG rounds 7 and 8; ENGINE_LOG (last three
sections); `generate.py`, `curated/mk_devices.py`, `closed_families.json`; map rows Q12, Q22, Z15, Z15b, Z15c, Z22 to
Z26, G26 to G30 and the controls section; RESULT and REFEREE files of `c7-probe-format-h-cap`,
`c6-marks-bc-manuscript-check` (Lemma H and section 7; REFEREE, REFEREE2), `c7-laurent-shell-gamma-section`,
`c7-bridge-seven-eighths-krein-index`, `c7-liou-high-row-bound`, `c7-landau-siegel-device-read`,
`c7-uncompensated-high-side-normaliser`, `c7-repair-engine-map-r6` (REFEREE), `c5-target-fe-order2-ledger` (REFEREE);
the manuscript text lines 2960-3365; Liu II lines 612-641. Lemma C was left to `c8-row-energy-squared-signal` as
assigned.

## 1. Engine (edits under `engine/` only)

Trace (`diag/generate_diag.py`, `diag/watch_before.json`), state of the round-8 planner rerun:

| node | generated | rejected by `fam-order2-theta-rows` | other closed families | closed outcome sets | scored |
|---|---|---|---|---|---|
| `map-open-1` | 978 | 841 | 36 | 101 | 0 |
| `ff-order2-vertex-probe` | 2,405 | 2,209 | 139 | 57 | 0 |

The family's two regex groups are both matched by each node's own name, statement or tags ("h = r/2" and "double
covers"; "ORDER-2" and the tag theta). The family is tested on the joint text, so the partners did not matter. A
second rule would have had the same effect for `map-open-1` after that: 3 points per closed lane sharing the node,
8 lanes.

Edits: (1) `generate.py`: a closed family rejects a candidate with an open device only if a member that is not an
open device matches one of its groups; (2) `generate.py`: no reuse penalty when the shared node is an open device
(one note lists the lanes); (3) `nodes/nodes-18.json`: device nodes for (E-K), (E-H) and the single-row bridge, with
the first referee's corrections of (E-K) and (E-H) in the statements; (4) `curated/mk_devices.py`: three open device
types; (5) `README.md`: one paragraph. `merge_outcomes.py`, `build_graph.py`, `closed_families.json` unchanged.

Rerun (`engine_rerun1.log`): 76 outcome entries (58 closed); 1,619 nodes (960 live); 8,797 edges; devices 59 closed
(52 live) / 7 floored / 5 open; generated 42,801, scored 12,701 (before 7,985), rejected 30,100; 1,360 candidates
exempted from a family matched by the open device text alone; top 60: 42 with an open device, 18 floored only,
0 closed. Full table in `engine/ENGINE_LOG.md` (last section).

Recorded and not fixed: `landau-siegel-2026-mechanism` (floored) is rejected in every candidate by its single-node
closed outcome entry (1,060 candidates); `map-open-1` and `ff-order2-vertex-probe` are listed through the diversity
limits (best ranks 968 and 478 of 12,701), not by score; the partners are tag matches and were not read.

## 2. Referee debts

Files (this lane's directory; no other lane's file was edited):

| debt | file | outcome |
|---|---|---|
| Theorem K, Lemma HS, Lemma A of `c7-probe-format-h-cap` (second referee) | `c7-probe-format-h-cap/REFEREE2.md`, `ref2_blocks.py`, `.log` | Theorem K holds (by hand; exact for r = 2..40, d = 2, 3, 4). K-branch checked against the text of Liu II Lemma 2.4: it equals the Hilbert-Schmidt bound max(Q, D). New: Proposition B, the bound holds for every blockwise operator-norm estimate (PROVED; least ratio 2.66 over 320 random partitions of Jacobi-symbol matrices). Lemma A: linear algebra holds; size of the aligned probe stays ARGUED. Closed sub-steps: (7.5) holds for the Liouville-twisted target (the target enters only through eta(A)); principal residue with H_lambda(1) != 0 (local factors 1 + O(Q^-2), least modulus 0.8798). Open sub-step: the non-principal rows of the twisted target (convexity bound not carried through MS sections 8-10). |
| Lemma H of `c6-marks-bc-manuscript-check` (third referee) | `c6-marks-bc-manuscript-check/REFEREE3.md`, `ref3_lemmaH.py`, `.log` | Holds. Derived from the series (7.10) with C_p of (7.8) and the lift formula, one level below the table (7.16) used by the first two referees; rows 1, 3, 4, 6 of the table at j = 0 re-derived; closed form, both factorisations and convergence abscissae confirmed; numeric agreement 1.6e-15 (24 points, all sixth roots rho, omega = +-1) and 1.8e-15 (12 points). The identity uses complete multiplicativity only; the global statements need a Hecke character. |
| Lemma 2 of `c7-laurent-shell-gamma-section` | `c7-laurent-shell-gamma-section/REFEREE2.md`, `ref2_lemma2.py`, `.log` | Formula re-derived. Unimodular trigonometric polynomials are monomials; for these the poles are shifted Gram-type points and the mean is 1 + conj(c) n^(-1/2) (1/q = n an integer) or 1: PROVED for zeta by Titchmarsh's Gram-point method (Riemann-Siegel formula, Kusmin-Landau). Three new numerical cases agree to 0.0009 - 0.0024 at delta = 3e-4, with error proportional to delta. Non-monomial m (the case with negative mean): ARGUED, with the missing uniform estimate in k stated. DH not treated. |

Consequence for the round-8 lanes: `c8-ek-*` and `c8-eh-*` may use Theorem K and the Hilbert-Schmidt statement as
two-referee statements in the form of section 4 of the REFEREE2 file; Lemma A only as ARGUED. The open sub-step of
Lemma A is a bound for non-principal rows with no zero-free input, which the (E-H) lane can settle in the same pass.

## 3. Map (`campaign/MAP_PENDING.md`, Part 2; proposed text, not applied)

Rows Q23 (Reinhardt shell), Q24 (gamma-coupled sections, with the second referee's status), note on Q12 / Q22, Q25
(family bridge), Z27 (Hilbert-Schmidt cap with the first referee's corrections E1 to E6 and Proposition B; the lane's
label Z15c was taken), note on Z15, Z24 wording (E1: (2.2) holds iff sigma_0 > 2/3; E4: local identity only; status
with three referees), Z28 and Z29 (two uses of periodicity: lattice-translation invariance in the 7/8 mechanism,
reciprocity in the Landau-Siegel device), section 7 entries (attribution of c6-kd23 Proposition E replaced by an
argued one, in the referee's wording; broken claims of the cap lane and the Lemma 2 bullet), section 6 item 1, and
entry F for the two log rows.

## 4. Checkpoint preparation (`campaign/OBSTRUCTION_RECORD_OUTLINE.md`)

Form of the statement (definitions of device, read set, defeat by a control); Statement O with five things a device
must read in one step; a table of 20 read classes, each with one control, the closing rows and lanes, the referee
count taken from the REFEREE files present, and what is owed before the line can be labelled PROVED; a table for the
one mechanism with R1 to R3; what is outside the record; a work plan for the two writing lanes.

## 5. Controls

No attack, so no control has to fail. Where the controls sit in the referee work:
- Theorem K, Lemma HS, Proposition B: target-independent (hold for U, DH, THIN unchanged). No R3.
- Lemma A: is the sign-twist control (Liouville) used as an argument; the checked sub-steps hold for any completely
  multiplicative unimodular weight.
- Lemma H: the local identity holds for the Liouville twist, THIN and unimodular twists; it separates nothing.
- Lemma 2 (monomial case): a mean value of a Dirichlet series with an approximate functional equation; the same proof
  applies to DH with a modulus-5 Riemann-Siegel formula (not written). No control fails.
- Engine: the control of the decisive check is the recount of device states in the top 60 from
  `curated/devices.json`, independent of the generator's own counters (0 closed).
Backward heat, E_a, T-NR, Beurling, phase-rotated transfer operator, theta^w: not applicable to any statement here.

## 6. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | no statement of this lane uses multiplicativity in an essential step; Lemma H and Lemma A use complete multiplicativity only to state an identity or build a control |
| R2 height-uniform, every window | false | no conclusion about zeros; Lemma 2 is a statement about Abel and Cesaro means |
| R3 controls fail structurally | false | every checked statement holds for the controls (section 5) |
| R4 reaches the critical line | false | referee and bookkeeping work; the cap of Theorem K is 1 - 1/r on a model abscissa |

Score not applicable (repair lane).

## 7. Three weakest steps

1. **Two proofs written by the referee have no referee of their own**: Proposition B (blockwise Hilbert-Schmidt
   bound; its hypotheses on the reflected coefficients, positive proportion of unimodular entries per block and no
   large entry, were not checked in the sources) and the monomial case of Lemma 2 (the Riemann-Siegel error term and
   the Kusmin-Landau inequality were used in their standard form without opening a source; the passage to Abel weights
   by dyadic partial summation is written in two lines).
2. **The generator change widens what passes.** A closed family no longer rejects a candidate whose only match is
   the text of an open device node; 1,360 candidates are exempted and the scored count rises from 7,985 to 12,701.
   The exemption trusts `curated/devices.json` for the state of a device. If a device is left open there after its
   lane closes it, closed combinations will be offered again. The top of the new list is dominated by tag matches
   with the three new nodes and was not read.
3. **Map text and outline are compiled from lane verdicts and referee files, not from re-reading every proof.** Rows
   Q23, Q25, Z28, Z29 restate results that have one referee each; referee counts in the outline are counts of files,
   not of independent holds; the choice of one control per read class in the outline is a proposal and several lines
   name controls that were inferred rather than run in the closing lane.

## 8. Files

- This directory: `RESULT.md`; `c7-probe-format-h-cap/{REFEREE2.md, ref2_blocks.py, ref2_blocks.log}`;
  `c6-marks-bc-manuscript-check/{REFEREE3.md, ref3_lemmaH.py, ref3_lemmaH.log}`;
  `c7-laurent-shell-gamma-section/{REFEREE2.md, ref2_lemma2.py, ref2_lemma2.log}`;
  `c5-target-fe-order2-ledger/tiers_fe2.rerun.log`; `engine_before/` (copies before the edits); `engine_rerun1.log`;
  `engine_counts.json`; `diag/` (instrumented generator copies, `watch_before.json`, `watch_after.json`).
- Engine: `generate.py`, `curated/mk_devices.py`, `curated/devices.json`, `nodes/nodes-18.json`, `README.md`,
  `ENGINE_LOG.md` (new last section), and the regenerated `outcomes.json`, `nodes/nodes-15.json`,
  `closed_families.json`, `IDEA_GRAPH.json`, `CANDIDATES.json`.
- Campaign: `MAP_PENDING.md` (Part 2 appended), `OBSTRUCTION_RECORD_OUTLINE.md` (new).

## 9. For the learn step

- Set the three new devices from the round-8 lane results and replace the node statements.
- Decide the `landau-siegel-2026-mechanism` record (second node, or device closed for the height aspect).
- Apply `MAP_PENDING.md` Part 2 to the map; rerun `build_graph.py` (rows Q23 to Q25, Z27 to Z29 add map nodes).
- Open debts after this lane: Lemma A sub-step (c); Lemma 2 for non-monomial m; referees for Proposition B and for the
  monomial proof of Lemma 2; Lemma C (`c8-row-energy-squared-signal`); the remainder of Theorem A of the Liouville
  lane; Propositions 1-4 and corrected F2 of the function-field lane.
