# c22-record-r21-controls-map-lean-queue-engine: RESULT

Date 2026-11-20. Kind: repair (record lane B of round 22). No attack. Nothing here is a statement about zeros of zeta. No bound moves. No score is possible for this lane.
Paths are relative to `tmp/research-2026-11-16/`; `L/` is this directory. Runs: local only, through `scripts/memcap.sh 8`; the compute server was not used and no unit was started.

## 0. Verdict

**partial-result (record).** Five of the six items of the assignment are done in full; item 1 is done for the engine and as proposed text for the map (the map is not edited by this lane); the independent referee could not be started from this lane, so `REFEREE.md` is an author check and counts as referees = 0.

| item | done | where |
|---|---|---|
| 1. Control rows V6, THIN x V6, CYC, NWM | entered in the engine; proposed as map rows | `engine/curated/controls.json`; `engine/build_graph.py` (codes); `campaign/MAP_PENDING.md` Part 3 |
| 2. Text corrections owed in the c4 RESULT and REFEREE | written as exact replacements, not applied to other lanes | `L/CORRECTIONS.md`; copy `campaign/CORRECTIONS_R21.md` |
| 3. Statement O | version 5.2: line 15 PROVED (object level), line 10 thresholds, line 11 label with the evenness-and-reality qualifier | `campaign/STATEMENT_O.md`; diff `L/statement_o_v5_1_v5_2.diff` |
| 3. E_a sigma_rel = 1 + a; BR-2 set condition (E3) | E_a: registered as a correction to the c20 lane file (no occurrence in campaign or engine files); E3: applied in engine and STRATEGY | `L/CORRECTIONS.md` items 4, 5 |
| 4. Engine | U4 closed on its second referee file; `twin-screen-ts` has the role `rigid`; BR-2 narrowed to the dense remainder; reruns reported before / after | `engine/curated/mk_devices.py`, `engine/nodes/nodes-23.json`, `engine/ENGINE_LOG.md` |
| 5. `campaign/LEAN_QUEUE.md` | created, 11 entries | `campaign/LEAN_QUEUE.md` |
| 6. Section 3.1 items for the round-21 closures | items 74 (BR-3), 75 (BR-2 sparse side), 76 (R1 flag of c4) | `campaign/STRATEGY.md` section 3.1 |

## 1. Plan

Record lane: enter what round 21 established, with the corrections of its independent referee files, and nothing else. Order: read the sources named by the assignment; take copies of every file to be edited (`L/before/`); rerun the engine once before any edit to get a baseline; edit through scripts with asserted single-occurrence replacements; rerun; compare. Decisions taken before editing:
- A control enters `controls.json` only with the has / lacks / kills text of its source lane as corrected by that lane's independent referee; where this lane adds a sentence (residue 5/7 of V6; the pole lattices of CYC; the sparsity sum of CYC) it is checked in `L/checks.py`.
- A label of Statement O changes only where a second referee file covers the closing step and a sentence of that file can be quoted; quotations are checked by script against the files.
- LEAN_QUEUE: only statements with at least one independent referee file that holds, self-contained, not equivalent to RH; the statement is written with the referee's corrections entered.
- The R4 question: this lane has no route to the critical line and attacks nothing (allowed for a repair lane; STRATEGY section 1).

## 2. Work

### 2.1 Controls (item 1)

Four entries added to `engine/curated/controls.json` (script `L/edit_controls.py`), each with name, has, lacks, kills, keyword pattern, status, source and scope.

| code | definition | passes | fails / lacks | source lane (independent referee) |
|---|---|---|---|---|
| V6 | f(n) = (-1)^(v_6(n)); F = zeta(s)(1 - 6^-s)/(1 + 6^-s) | abs(f) = 1; partial sums (5/7) x + O(log x); hypothesis H(a) (kappa(n) - Re l_f(n) >= 0 for all n); every step and the conclusion of Theorem 1 of the c4 lane | multiplicativity (f(6) = -1, f(2) f(3) = 1); Euler product; functional equation; it has no off-line zero in Re s > 0 | `c21-c4-r1-flag-test-lemma-e-hq-beurling` (holds, E1 to E4) |
| THINxV6 | f(n) = eps_S(n)(-1)^(v_6(n)), 2, 3 not in S | as V6, with a real zero in (1/2, 1) inherited from THIN | multiplicativity; functional equation; not run as a product by the lane or its referee (E4) | same |
| CYC | norms q_k = Q^(2^k), alpha_q = -q^(1/2); prod (1 + w^(2^k)) = 1/(1 - w), w = Q^(1/2 - s) | Euler product over a Beurling system, geometric factors of modulus q^(1/2), dense local pole lattices, convergence only in Re s > 1/2, the sparsity hypothesis of Theorem W, the size hypotheses of Lemma P at the threshold | multiplicative independence of the norms; it is meromorphic, so the conclusion of Theorem W fails for it; it leaves the proof at step 4 (a) (Weyl) | `c21-br2-sparse-pole-lattice-natural-boundary-or-twin` (holds after erratum E1) |
| NWM | zeta(s)(1 + R(s)), R the symmetrised Newman function | zeta's functional equation, entire multiplier, pole at 1 only, bounded outside a strip, zeros off the line (measured) | integer frequencies; finite order; multiplicativity; sign | `c21-br0-br3-hamburger-finite-poles-regime3` (holds, E1 to E4) |

`engine/build_graph.py`: the codes THINxV6, V6, CYC, NWM were added to `CONTROL_CODE_RE` (one line; THINxV6 before THIN). None of the three strings V6, CYC, NWM occurred in the map or in any node file before (checked by search), so no existing row acquires an edge. The four control nodes are in the graph (role wall) and have no row edge until the map rows are applied.

Proposed map text: `campaign/MAP_PENDING.md`, new "Part 3" (also `L/MAP_PENDING_R22_SECTION.md`): four table rows for section 2; one "Notes on use" item (the R1 test); the two wording corrections of row NR-q; rows X3b and X4 as the lanes' own `MAP_ROW.md` texts with the changes their independent referees require; a sentence for row P46; section 6 items; five rows for section 7. `push/OBSTRUCTION_MAP.md` was not edited. Row X3 of round 20 is not in the map; the labels X3b, X4 assume it is entered first.

### 2.2 Corrections (item 2)

`L/CORRECTIONS.md` (copy `campaign/CORRECTIONS_R21.md`): exact "text as it stands" and replacement for (1) c4 RESULT section 2 (a), line 35; (2) c4 REFEREE line 55 (R1 = true -> false, with the reason); (3) the four corrections E1 to E4 of the independent referee of the c21 flag-test lane; (4) the three wording corrections of the second referee of the euler-shape lane, among them E_a: sigma_rel = 1 + a; (5) the BR-2 set condition; (6) a register of the other round-21 referee corrections. Every "text as it stands" was checked by script to occur in the named file (`L/author_check.py`, 15 of 15 found). No file of another lane was edited.

### 2.3 Statement O, version 5.2 (item 3)

Script `L/build_statement_o_v5_2.py` (10 asserted replacements on the copy of version 5.1; 11 marks "(version 5.2"; 5 quoted sentences checked to occur in the referee files).

- **Line 15: ARGUED -> PROVED under the label rule, as a statement about the object NR-q.** Second file: `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/nrq-line15/REFEREE2.md` ("Holds as a statement about the object (PROVED-2)"); first file: the independent pass of the c15 lane. Its two wording corrections are entered: for c > 2 the factor's zeros are at 1/2 +- b + (2k + 1) pi i/log q, for c < -2 at 1/2 +- b + 2k pi i/log q with a real zero in (1/2, 1); NR-q has no normalisation a_1 = 1 and grows to the right, so devices with that hypothesis reject it there. The clause "which device reads only this class" stays ARGUED.
- **Line 10: thresholds of the written MV-CAP statement.** With s = 2E + E^2 the bound on abs(F_c/zeta - 1): mean-square premises need room (2s + s^2) int w abs(A zeta)^2 (the source asks for 3s); bounds on log F, F'/F need sigma' > sigma strictly, with room above -log(1 - s) and -log(1 - s)/(sigma' - sigma) (these two constants are written by this lane from the Cauchy estimate; the source says "with room"); zero side 2m; item (3) carries the factor 2 of the source; corrections 2 and 5 of the source referee are now carried (the literal form of "no zero off the line"; constants on a grid, not interval-certified). Label unchanged: ARGUED.
- **Line 11: Label bullet rewritten.** MEASURED, certified per cell, for the finite-rectangle identities of P8 and P1 (zeta, DH, E_a, T-NR at c = 17/8; HEAT in the general form); ARGUED for L2, D7, Q25 and for the passage to all zeros for HEAT. Qualifier as required by the referee of the line-11 lane (E3, E4): the general-form cells are Cauchy identities valid for every meromorphic function with a correct divisor list; the cited symmetric form holds for F even and real and excludes 0 for the sign twist and the unimodular twist; it separates controls by evenness and reality, not by zero location. The earlier label text is kept in the bullet.
- Count: PROVED 9, PROVED relative to a cited theorem 1, MEASURED 2 (line 2; line 11 for the P8, P1 cells only), ARGUED 5 (lines 1, 4, 7, 10, 12). Version 5.1: 8 / 1 / 1 / 7.
- "E_a sigma_rel" and "BR-2 set condition" have no occurrence in Statement O (searched); see 2.2.
- Not entered: the second referee file of the line-4 lane (escape law F1). It was not in the assignment; line 4 stays ARGUED.

### 2.4 Engine (item 4)

Edits (script `L/edit_engine.py`; previous files in `engine/scratch/*.pre-c22-record.*`):
- `curated/mk_devices.py`, block R22-record. Cell `silent-cell-u4`: cell -> closed, on `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-u4-second-order-archimedean-mixed-form/REFEREE2.md` (existence asserted by the script). The evidence states the scope of that file: Lemma S, Proposition M, K3-M hold; closure is of the reads tried; THIN (b = 0.75) and DEL (b = 0.55, 0.75) fail step S3 at explicit windows evaluated at 30 digits, not in balls; DEL b = 0.9 not decided; the companion census lane has one referee.
- Device `br2-sparse-pole-lattice-regime-k`: name, evidence, status, seven entry conditions, sources, control list. State stays open; status still begins "proposed" (no penalty waiver in `generate.py`). The device is now the dense remainder: abs(alpha_q) = q^(1/2) with phases on S, sum over S of q^-eps finite for every eps > 0, and S outside Theorem W, i.e. sum over S of (log q)^(-gamma) infinite for every gamma < 1. (The round log words the remainder as "sum 1/log q infinite"; Theorem W as proved needs gamma < 1, so sets with sum 1/log q finite and sum (log q)^(-gamma) infinite for every gamma < 1 are also not covered; the device text uses the proved boundary.) Set condition per E3. CYC, V6 / THIN x V6 and NWM added to the controls that must fail.
- `nodes/nodes-23.json`: the BR-2 node statement narrowed in the same way; node `twin-screen-ts`: status conjectural -> proved, usesMultiplicativity and heightUniform -> no, statement rewritten to say what "proved" covers (Lemma TS-1 (i), one independent referee; the three reasons as statements with their referee files) and what it does not (the typing of 92 rows; "7 in full and 5 in part of 56"; not a sufficient launch filter). With type tool and status proved, `build_graph.py` gives the role `rigid`, which places the node in the TOOL pool of move M3 of `generate.py`.
- BR-3: closed by the planner through `R22_STATE`; not touched. `merge_outcomes.py` was not run. `generate.py`, `outcomes.json`, `closed_families.json` not edited.

Reruns (`L/run_engine.sh`; logs `L/logs/before_*.log`, `after_*.log`): `mk_devices.py`, `build_graph.py`, `generate.py --top 60`, `campaign/scoreboard.py`, each through `scripts/memcap.sh 8`, exit 0. The rerun before any edit reproduced the `CANDIDATES.json` on disk (60 of 60 keys, same order).

| quantity | before | after |
|---|---|---|
| graph: nodes / live / rows / edges | 1,764 / 980 / 253 / 9,265 | 1,768 / 980 / 253 / 9,266 |
| device types | closed 56, floored 1, open 1 | the same |
| cells | closed 7, cell 3, tried-not-closed 1 | closed 8, cell 2, tried-not-closed 1 |
| generated / scored / rejected | 41,182 / 8,894 / 32,288 | 41,753 / 8,947 / 32,806 |
| rejected by `fam-pole-lattice-multiplier` | 1,589 | 1,873 |
| top 60: with BR-2 / on the floored 7/8 type | 12 / 23 | 12 / 24 |
| top 60: keys in common | - | 52 of 60; ranks 1 and 2 unchanged |
| `twin-screen-ts` | roles [], in no candidate | roles [rigid]; 1 scored candidate (M3, score 3.5, with `sigma-b-abscissa-sensitivity` and `qrh-seven-eighths`); none in the top 60 |
| scoreboard: nodes / families / closed / tried / open untried | 1,764 / 153,181 / 4,336 / 1,683 / 147,162 | 1,768 / 153,735 / 4,336 / 1,718 / 147,681 |
| scoreboard: lanes, hold rate, headline | 188, 92.1%, 0 of 4 | unchanged |

The ranking is a heuristic. The 12 BR-2 candidates are an effect of the open-device weight on the one open device node; their partners are picked by tags. No candidate is proposed by this lane.

### 2.5 LEAN_QUEUE (item 5)

`campaign/LEAN_QUEUE.md` created: rules of the file, a summary table, 11 entries in the suggested order of checking, and a list of statements not queued with the reason.

| # | statement | referees | source lane |
|---|---|---|---|
| Q1 | CYC telescoping identity (finite form in any commutative ring; limit; the Beurling reading) | 1 | c21 BR-2 sparse |
| Q2 | Lemma TS-1 (i) (a(n) = 1 below P iff c(n) = 0 below P; prime-power form; Lambda_G) | 1 | c21 twin screen |
| Q3 | V6 closed form and H(a) | 1 | c21 c4 flag test (added by this lane beyond the assignment's list) |
| Q4 | Lemma P0 | 1 | c21 BR-2 census |
| Q5 | Lemma E | 1 | c20 referee lane (Theorem D) |
| Q6 | Theorem A, with the core Lemma A0' | 2 | c20 euler shape |
| Q7 | Corollary A2 | 2 | c20 euler shape |
| Q8 | Theorem C (regime (K)), parts (a) to (d) | 2 | c20 euler shape |
| Q9 | Lemma S | 2 | c20 U4 |
| Q10 | Theorem H | 1 | c21 BR-0 / BR-3 |
| Q11 | Theorem P | 3 | c16 POS-FE |

Each referee count was compared by script with `campaign/lanes.jsonl` (11 of 11 equal; every source lane has refereeHolds true and aboutZeros false). "Theorem C" is read as Theorem C of the euler-shape lane (the one the round-21 lessons pair with Theorem A and Lemma TS-1); Theorem C of the line-2 lane is listed under "not queued" with the reason (tied to one object; a quoted continuity statement). Nothing queued is equivalent to RH; none is about zeros of zeta. Theorem H and Theorem P are classical in content and are queued as such.

Restatements made by this lane for the queue, each derived from the lane text and its referee file and not refereed here: Q6 is split into a core lemma (Morera plus Liouville) and a product form, with the rate of the second referee; Q8 is written for m and N with the finite-order clause as part (c) and the degree-one exchange as (d); Q4 is written on the real ray with the meromorphy consequence as (c); Q9 names the pointwise inequality that suffices.

### 2.6 Section 3.1 (item 6)

`campaign/STRATEGY.md` (script `L/apply_strategy.py`, three asserted replacements): items 74 (BR-3 as registered: decided by Hamburger's theorem with finitely many poles; R4 in the hypothesis), 75 (BR-2 sparse side: Theorem W, Lemmas P0, P1; CYC; base-blind; dense remainder tried, not closed), 76 (Landau positivity on F F*/zeta^2 is not a multiplicative step: V6 passes, HQ1 to HQ4 and E_a fail; with item 71 two rejections of the same kind; headline 0 of 4). The heading of 3.1 names the entering lane. In section 4.0 the BR-2 set condition is corrected in place with a bracketed note.

### 2.7 Checks run by this lane

`L/checks.py` (exact rationals and float64; 1 s): V6 identity f * (1 + 6^-s) = 1 * (1 - 6^-s) on n <= 7776, f(6) = -1, f(2) f(3) = 1, max abs(S(n) - 5n/7) = 4.2857 (the referee's value), log series to order 5; CYC finite product for K = 6 equals the all-ones polynomial of degree 63, and abs(prod (1 - w) - 1) = 4.5e-15 at abs(w) = 0.9984; Lemma TS-1 (i) both directions on random data (P = 37, n <= 400); 1 - q^-d <= d log q; 1/(1 - 2^(-1/2)) = 3.41421; zeta(2) - 1 = 0.6449, -log(2 - zeta(2)) = 1.0355; NR-q threshold 2.19737 and zero 0.857311 + 3.564428 i; abs(abs(1 + d)^2 - 1) <= 2s + s^2 on 2,000 random d.

## 3. Controls

This lane proposes no mechanism, so there is no step that a control must fail. What it records about controls: four new ones (2.1). For the record: V6 and THIN x V6 are controls against R1 claims, CYC against lattice-density and size arguments, NWM against arguments that read the functional equation and the pole clause without integrality or growth. None of them has a functional equation together with an Euler product and an off-line zero; the record still has no such control.

## 4. Requirement flags

- **R1 false.** Nothing established here uses multiplicativity; the lane records that the one R1 flag left on file was rejected (item 76). Evidence: section 2.6; `lanes.jsonl` of the campaign has r1 = false for every lane.
- **R2 false.** No statement uniform in height or valid in every window is made.
- **R3 false.** No mechanism; nothing for a control to fail.
- **R4 false.** Not attacked. Nothing is carried from finite stages or from Re s > 1 to the critical line.

## 5. Three weakest steps

1. **No independent referee.** This lane has no means of starting a separate referee process; `REFEREE.md` is the author's check (path, quotation and count checks by script, and a second reading of each edit). referees = 0. The restatements written for LEAN_QUEUE (Q4, Q6, Q8, Q9 in particular) and the constants written into line 10 for log F and F'/F are this lane's wording and have not been read by anyone else; an error there is an error of the queue, not of the source lanes.
2. **Two label decisions rest on this lane's reading of the label rule.** Line 15 -> PROVED counts the independent pass of the c15 lane as the first file covering the closing step (the version-4 label says that referee re-derived the construction; the campaign's `lanes.jsonl` stores the second file as a scoped referee without raising the lane's count). Line 11 -> "MEASURED for the P8, P1 cells" rests on one execution and one independent referee who did not recompute the HEAT cells; the lane's proposed label was reworded here to carry the referee's qualifier. A reader who applies the rule more strictly keeps line 11 ARGUED; nothing else in the record depends on it.
3. **The role given to `twin-screen-ts` is a status change made for the generator.** Status "proved" is attached to a node whose file is a typed filter; the statement field says which parts are proved, but the role mechanism reads only type and status. Its effect on the output is one scored candidate outside the top 60. Likewise the narrowed BR-2 text raised the number of candidates rejected by two closed pole-lattice families (1,589 -> 1,873; 109 -> 286) through keyword matches; the top 60 changed in 8 of 60 keys for that reason and not because of any new information about the question.

## 6. Not done

- `push/OBSTRUCTION_MAP.md`: not edited (not in the write set of this lane as an edit; proposals only).
- Files of other lanes: not edited (corrections are proposals).
- Statement O line 4 (second referee file of the escape-law lane): not entered.
- The stale sentence in the evidence of cells U6 (a), U6 (b) (E5 of the c21 record referee): not removed.
- `campaign/STRATEGY.md` sections 0c and 4.0 still print the headline of round 20 ("1 of 4" through the c4 lane; lines 95 and 273) and name BR-3 as the exact missing lemma. Section 3.1 items 74 and 76 and the bracketed note at BR-2 record the round-21 state; rewriting sections 0c and 4.0 is the strategy review's edit and was not made here.
- Owed items of round 21 that belong to other lanes of round 22: DEL b = 0.9, HEAT limit, D7, ball-arithmetic rerun of the U4 windows, second referees for Theorem W, P0 / P1, Theorem 1', TWIN_SCREEN.md, the line-11 RESULT.
- `ROUND_LOG.md`, `SCREEN_SURVIVORS.md`, `lanes.jsonl` of the campaign, `outcomes.json`: not edited; the line for this lane is in `L/lanes.jsonl` for the learn step.

## 7. Files

- Edited: `engine/curated/controls.json`, `engine/build_graph.py` (one line and a comment), `engine/curated/mk_devices.py`, `engine/curated/devices.json` (regenerated), `engine/nodes/nodes-23.json`, `engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json` (regenerated), `engine/ENGINE_LOG.md` (entry appended), `campaign/STATEMENT_O.md`, `campaign/STRATEGY.md`, `campaign/MAP_PENDING.md` (Part 3 appended), `campaign/scoreboard.json`, `campaign/SCOREBOARD.md` (regenerated).
- Created: `campaign/LEAN_QUEUE.md`, `campaign/CORRECTIONS_R21.md`.
- In `L/`: `RESULT.md`, `REFEREE.md`, `lanes.jsonl`, `CORRECTIONS.md`, `MAP_PENDING_R22_SECTION.md`, `STATEMENT_O_v5_2.md`, `statement_o_v5_1_v5_2.diff`, scripts `edit_controls.py`, `edit_engine.py`, `build_statement_o_v5_2.py`, `apply_strategy.py`, `run_engine.sh`, `compare.py`, `checks.py` (+ `checks.json`), `author_check.py` (+ `author_check.json`), `before/`, `after/`, `logs/`.
- Previous versions: `L/before/` (every edited file as found) and `engine/scratch/*.pre-c22-record.*`.

## 8. Most valuable next step

An independent referee for this lane's two files that other work will read directly: `campaign/LEAN_QUEUE.md` (each statement against its source and referee file, before a prover lane spends time on a misstatement) and the three edited lines of `campaign/STATEMENT_O.md`. Then apply Part 3 of `MAP_PENDING.md` to the map, after which `build_graph.py` attaches the four new controls to rows.
