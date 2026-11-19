# c9-obstruction-record-statement: RESULT

Date 2026-11-18. Round 9, lane 6 (kind: combine). Lane A of the round-8 checkpoint
(`campaign/STRATEGY.md` section 2, last rule; `campaign/OBSTRUCTION_RECORD_OUTLINE.md` section 5 item 1).

## Verdict

partial-result. Statement O is written for lines 1 to 12 (`STATEMENT_O.md`). It is a record of obstructions. It is
not a result about zeros of zeta. No requirement flag changes. No new mathematics. Under the two-referee rule no
line is PROVED: 9 lines are ARGUED and 3 are MEASURED, each with the item owed. The statement does not say that no
device supplying R1, R3 and R4 exists.

## 1. Plan

1. Decisive first test (for a record lane): can every line of outline section 2, lines 1 to 12, be tied to a map
   row that exists, a lane that exists, and a referee count that matches the files on disk? If not, the line is
   rewritten or dropped before any text is written. Tool: `verify_citations.py`.
2. Fix the definitions of outline section 1.
3. Write lines 1 to 12 as lemmas, one per read class.
4. Update outline section 3 with the round-8 outcomes.
5. Write the clause on R1, R3, R4 with each item tied to a control; list "not covered" unchanged plus EIS-w.
6. Draft the pending map rows the statement cites. The map is not edited.

New against the atlas and the map: nothing mathematical. New as a document: one definition of "defeated by a
control" with three modes; one lemma per read class with the step at which the control satisfies the class; the
referee count per line taken from the files.

## 2. Work

### 2.1 Decisive test (run through `scripts/memcap.sh 8`)

`verify_citations.py` -> `verify_citations.json`: 56 map-row ids cited, 0 missing (50 in the map; Q25, Z27, Z28
pending in `campaign/MAP_PENDING.md` Part 2; Q26, Z30, Z31 proposed in `MAP_ROWS_PROPOSED.md`); 52 lanes cited,
0 missing; 44 "n ref" claims in section B, 0 differing from the count of `REFEREE*.md` files on disk. The test
passed, so the lane proceeded. It changed three things in the outline's table before writing:

- Line 1: the outline's zero column says "Liouville: zeros at rho/2". Those zeros have Re s < 1/2, so the Liouville
  twist is not a zero-mode control for an output "no zero with Re s > theta", theta >= 1/2. The line now uses TW in
  step mode and names THIN, E_a and B as the members with zeros right of 1/2.
- Line 2: `c1-missing-controls` has two referee files, but REFEREE2 covers Part D only; the DH kernel certificate
  (Part C) has one referee.
- Line 6: the referee of `r3-tnr-control` returned "holds = false as labelled"; the twin, its zeros and
  Proposition N survive. The line cites the surviving part only.

### 2.2 Definitions (STATEMENT_O section A)

Target class; inputs with codes (EP, POS, SUPP, SIZE0, FE, INT, SIZE, GEOM, PER, KER); device (read set, chain,
output uniform in every window); read class; "defeated by a control" in three modes: (Z) the control is in the read
class and has a zero right of the output abscissa; (S) the control is in the read class and an intermediate
statement of the device is false for it; (I) every step is an identity valid for the controls and the output is the
undetermined sign or limit. The outline had mode (Z) only, while its lines 11 and 12 have "n/a" in the zero column and
line 1 has a qualified entry (mode (Z) holds without qualification in lines 2, 3, 4, 6, 9); the map (section 2, notes on use) already says that a finite sign twist passes
"no zeros in a region" conclusions trivially. Each line states its mode.

### 2.3 Lines 1 to 12 (STATEMENT_O section B)

| line | read class | control | mode | floor | label here | owed |
|---|---|---|---|---|---|---|
| 1 | size, positivity, support of Lambda | TW+, TW-; THIN, E_a, B as members | (S), (Z) | nothing below 1 | ARGUED | second referee on P9 or P23; referee for `sq-causal-cascade` Thm 3 |
| 2 | FE + kernel positivity + ordinary series, no Euler product | DH | (Z) | 1.12 | MEASURED | two-referee lemma "finite Pick orders are Euler-blind"; second referee on Part C |
| 3 | EP + POS + FE + explicit formula + growth, no SIZE | E_a | (Z) | 1/2 + a, any a < 1/2 | ARGUED | referee for Z16 |
| 4 | flow-stable hypotheses | HEAT | (Z) | no strip statement | MEASURED | second referee on F1 |
| 5 | EP + POS + pole, no FE, no integers | Beurling | (Z)-rel literature | nothing below 1 | ARGUED | open the Beurling source |
| 6 | invariant under local test-vector change at one prime | T-NR twin | (Z) | none | ARGUED | second referee on corrected text |
| 7 | complete multiplicativity + unimodular parameters, no periodicity | THIN; U | (Z)-rel short-interval theorem | nothing below 1 | ARGUED | primary source (Coleman 1990); second referee on the construction |
| 8 | frequencies log n only | DH, TW, THIN, U, WT | (I), (Z) | 1.12 | ARGUED | second referee; Turan's equivalence opened |
| 9 | discrete special values | interpolation twin | (Z) | none | MEASURED | second referee; statement of the p-adic data read |
| 10 | mean values only | cluster lifts; exceptional member; WT | (Z)-rel H_W, (S) | densities only | ARGUED | two-referee MV-CAP statement; density half of P50 |
| 11 | exact identities | every control | (I) | none | ARGUED | wording per control; starred cells of P8 |
| 12 | finite stages, then a limit | U, random twists; DH at finite order | (I)/(S) | none | ARGUED | second referee on Q21 |

### 2.4 Re-run of existing checks (`recheck_controls.py`, mpmath, 40 digits, through `scripts/memcap.sh 8`)

Four control zeros quoted in the statement, each a re-run of a referee check already on file; values in
`recheck_controls.json`.

| control | point | value |
|---|---|---|
| Liouville twist zeta(2s)/zeta(s) | 1/4 + 7.06736257087i | abs = 3.0e-41 (abs zeta(s) = 1.12634) |
| E_a, a = 0.2 | 0.7 + 14.1347251417i | abs = 9.3e-42 |
| T-NR factor, q = 3, c = 2.2 | 0.903753224828 + 2.85960086738i | abs = 3.8e-43; factor(s) = factor(1 - s); 10 heights below 60 |
| interpolation twin, c = 1 | 0.8640996018 + 29.95041277i | abs = 5.7e-42; product of the two L-functions at s = 0..-5: max abs 2.8e-45 |

These are float evaluations at 40 digits, not interval certificates. They agree with the map (section 2 rows TW-,
EA, NR; row D5).

### 2.5 Outline section 3 with round-8 outcomes (STATEMENT_O section D)

Added, each with lane, map row and referee state: single-row bridge closed (axis Re w = 1 of the row's Euler factor
L0; 1 ref, five corrections); (E-K) = a mean value of 1/L over the order-6 twist family of the target (1 ref;
window Z/P < X < ZP open); row energy is not a separator (random vectors at the diagonal; 1 ref, reduced form);
(E-H) is necessity, termwise and norm treatments closed at 13/15 and 31/36 in the model, target-specific treatment
open (1 ref, record not held as first worded); Lemma C needs the high half (3 ref files). The campaign outline file
itself is not edited by this lane; section D is the text to copy into it.

### 2.6 Clause and "not covered" (STATEMENT_O sections C, E)

The clause has 13 items (the outline's five, split, plus lines 9, 11, 12 as items 6a to 6c), each with control,
mode, line and map rows. Item 2c (the symmetry must change under s -> s + 1 - b, F -> 1/F; control RZ_b) has no
line among 1 to 12 and is carried with map row T2 only. Item 2b (all heights; control WT) points to outline line 14.
Section E lists outline section 4 unchanged and adds control EIS-w with its state (lane not held by its referee;
Proposition 4 was not the rejected step).

### 2.7 Map rows (`MAP_ROWS_PROPOSED.md`)

Part 1: rows Q25, Z27, Z28, the Z24 edits and section-7 entry E1 of MAP_PENDING Part 2, by reference, with four
small text changes that follow from round 8. Part 2: new text for Q26 (single-row bridge), Z30 ((E-K) and row
energy), Z31 ((E-H) in the referee's wording: necessity), control EIS-w and row G31 (drafts, to apply only after a
referee holds the Hecke lane), and O1 (the row for Statement O). Two round-8 lanes had both proposed the label
Z15d; they are renumbered. `push/OBSTRUCTION_MAP.md` was not edited.

## 3. Controls

This lane makes no argument about zeta, so there is no step to test against the controls. The statement is a
table of which control satisfies which read class. Controls used per line: TW+, TW-, Liouville, THIN, E_a, B
(line 1); DH (2, 8, 12); E_a (3); HEAT (4); B (5); T-NR (6); THIN, U (7); interpolation twin (9); cluster lifts,
WT (10); all (11); U, random twists (12). Not used in lines 1 to 12: the phase-rotated transfer operator and
theta^w (they appear only in section D through the single-row bridge row) and EIS-w (section E). A line names one
control and does not claim that the others were run.

## 4. Requirement flags (for this lane)

| flag | value | evidence |
|---|---|---|
| R1 | false | no argument; the record states which read classes lack multiplicativity (items 1a to 1c of the clause) |
| R2 | false | no conclusion about zeros at any height |
| R3 | false | no device is proposed; the record lists controls that satisfy read classes |
| R4 | false | no step toward the critical line; section D records that the round-8 steps inside the 7/8 mechanism are of zero-free type for the target's twist family |

About zeros of zeta: no.

## 5. What is PROVED, ARGUED, owed

- PROVED under the two-referee rule: no line. Two sub-statements inside lines 5 and 7 have two referee files: the
  P46 transfer theorem (`c4-helson-discrepancy-zerofree` Theorem 1; second derivation and Theorem 2 in
  `c5-repair-engine-map-r4`, REFEREE and REFEREE2) and P51 Lemma A / Theorem 1' (`c5-twisted-helson-arcs`,
  REFEREE and REFEREE2). In section D: Z15b Lemma U, Z22, Z24 Lemma H (3), Z27 Theorem K, and the Lemma C
  statement of `c8-row-energy-squared-signal` (3 files).
- ARGUED: lines 1, 3, 5, 6, 7, 8, 10, 11, 12. MEASURED: lines 2, 4, 9.
- Owed, in the order of outline section 5 item 2 (lane B): line 7 primary source; line 10 MV-CAP statement; line 2
  finite-Pick lemma; line 4 second referee on F1; then lines 1, 3, 5, 6, 8, 9, 12 as in the table of 2.3. Added by
  this lane: second referee on Part C of `c1-missing-controls`; a line or a deletion for clause item 2c; lines 13
  to 20 not yet written; a referee pass on STATEMENT_O itself (none exists).

## 6. Three weakest steps

1. The three-mode definition of "defeated" (section A4) is this lane's wording. Modes (S) and (I) are weaker than
   mode (Z): they say a device type has no separating step, not that its output is false for a function on file.
   Lines 8, 10, 11, 12 rest on them. A referee may require these lines to be stated as "no lever" entries outside
   Statement O, which would leave 8 lines.
2. Mode (Z) in lines 5, 7 and 10 is relative to inputs not on file: the Beurling construction (literature, not
   re-read), the ray-class short-interval theorem (secondary quotations), hypothesis H_W. Line 1's zero-mode
   members inherit this through THIN and B.
3. The "step at which the control satisfies the class" is copied from map rows and referee summaries; the lane did
   not re-derive any step and read the referee files only for their verdicts and the points cited. Starred
   (inferred) control cells of the map (P8, P25, P36) are carried as inferred. Section D row for (E-H) rests on a
   lane whose record its referee did not hold.

## Files

`STATEMENT_O.md` (statement); `MAP_ROWS_PROPOSED.md` (map text, not applied); `verify_citations.py`,
`verify_citations.json` (citation check); `recheck_controls.py`, `recheck_controls.json` (re-run of four control
zeros); `lanes_line.json`. Server not used.
