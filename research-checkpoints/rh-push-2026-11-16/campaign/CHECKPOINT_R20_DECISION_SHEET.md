# Decision sheet for the checkpoint after round 20

Written 2026-11-20 (about 08:45 UTC) by lane `c20-repair-owed-record-r19-statement-o-v5` (campaign round 20, repair B).
This file lists evidence and work. It does not apply the checkpoint, it changes no rule, weight or allocation, and it
is not a result about zeros of zeta. The decision belongs to the planner after the learn step of round 20. Paths are
relative to `tmp/research-2026-11-16/`. Companion file: `campaign/CHECKPOINT_R20_INPUT.md` (written in round 19; its
section 1 is superseded below where round 19 or Statement O version 5 changed a line).

The rule (`campaign/STRATEGY.md` section 2, quoted): "Checkpoint after round 20. If by then no lane has passed stage A
and no silent cell has produced a non-identity statement that no control passes, explore falls to 0 and the campaign
spends its remaining rounds on: second referees and certified conversions for every line of Statement O still
labelled MEASURED or ARGUED; the remaining silent cells in the order of section 4.0; and one reopening of the frontier
slot only with a named new input. The campaign result stays in the form of section 0a."

The rule has two conditions (A, B). If both hold it has one consequence (explore to 0) and three work items (W1, W2,
W3). Sections 1 and 2 give the evidence on file for A and B. Section 3 lists the work for rounds 21 onward with cost
estimates. Section 4 lists what is not decided by this sheet.

State at the time of writing: 172 lines in `campaign/lanes.jsonl` (rounds 1 to 19; the only round-20 line added since is this lane's own, line 173), headline 1 of 4
(`c1-leeyang-krein-limit`; missing R2, R3, R4), device table 55 closed / 1 floored / 0 open, cells 6 cell /
1 tried-not-closed / 4 closed in `engine/curated/devices.json`. Round 20 is running: three of its eight lanes have a
RESULT.md on disk and none is in the round log.

## 1. Condition A: "no lane has passed stage A"

Stage A (STRATEGY section 1, explore row): one displayed candidate inequality and a paper run of the controls; a lane
passes when no control passes every step.

| evidence | where | what it says |
|---|---|---|
| explore lanes of rounds 11 to 14 | STRATEGY section 0a; change log of version 4 | 12 of 12 stopped at stage A (a control passes every step, or the candidate equals the target) |
| explore lane of round 15 | STRATEGY section 0b | stopped at stage A (13 of 13) |
| rounds 16 to 18 | `ROUND_LOG.md`, "Lead that looks least blocked" of each round | no lane passed stage A; round 18: both proposed device types obstructed |
| round 19 | `ROUND_LOG.md`, round 19 results and "Lead that looks least blocked": "No lane passed stage A and nothing on file has a registered reason to expect R4" | lane 1 (`c19-u4-joint-prime-phase-quadratic-dp-zeros`): stage A stopped the lane; E_a and DEL pass every step, HQ2 at each P (referee: holds after E1; map row G45) |
| scoreboard | `campaign/scoreboard.json` | lanes by score 0 / 1 / 2 / 3 / 4: 170 / 2 / 0 / 0 / 0; lanes with R4 confirmed: none; no ALERT.md |
| round 20, explore lane (not in the round log) | `push/c20-u4-second-order-archimedean-mixed-form/RESULT.md` (on disk 08:40 UTC; independent referees 0; its REFEREE.md is a second pass of the same session) | verdict of the lane: precise obstruction; "ZQ passes every step; HQ1 to HQ4 and T-NR pass at each (t, P) for a suitable q; no control fails at a relation between different primes". Stage A not passed, by the lane's own account |
| round 20, deepen lane on cells U6 (a), (b) | `push/c20-u6ab-rank2-metaplectic-eigenobject-verdict/RESULT.md` (referees 0 by its own header; a REFEREE.md marked independent is on disk and reads "holds = true, as a precise obstruction") | precise obstruction; flags false |
| round 20, combine lane | `push/c20-euler-shape-rigidity-infinite-modified-primes/RESULT.md` (referees 0) | identifications and statements about twins only; cannot pass stage A (pre-filter lane) |

Reading: on the files of rounds 1 to 19, condition A holds. The one round-20 lane that could falsify it
(`c20-u4-second-order-archimedean-mixed-form`) reports a stage-A stop; that report is unrefereed. Condition A is
therefore met on the record through round 19 and is expected to be met after round 20, subject to the round-20 learn
step and an independent referee of that lane. Nothing on file contradicts it.

## 2. Condition B: "no silent cell has produced a non-identity statement that no control passes"

"Non-identity statement that no control passes" is the trigger of the three-lane rule (STRATEGY section 2, second
bullet): a statement that is not an identification, with referee-confirmed R3. The cells are those of section 4.0;
states from `engine/curated/devices.json` (key `cells`) and the paragraph "State of the cells after round 19".

| order | cell | what it has produced | kind | control that passes, or why no statement | row; referee files |
|---|---|---|---|---|---|
| 1 | U3 | Hamburger; Kaczorowski-Perelli; Lemma L; Theorem P; read as an inequality | identifications; the inequality form is target-level | not applicable (identification); HQ2 and TN1 show which clause each identification needs | P56 (3), P57 (2), X1 (2) |
| 2 | U2-POS | Theorem P | identification | not applicable | P56 (3) |
| 3 | U4 residual | five closed types; canonical tier of DN; (iv) group-law inequalities; cross-prime positivity (J) | non-identity statements exist ((C-F), (J)), each passed by a control | (iv): E_a, G_+ lift, U, THIN, TW+, DEL; (J): E_a, DEL, HQ2 at each P | G38, G41, G44 (2), G45 (1) |
| 3 | U4 residual, second-order mixed form | round 20: a candidate form, reported equal to the first-order band form times Lg up to O(t^(theta'/2 - 1) log t) | by the lane: no new statement; ZQ passes | ZQ; HQ1 to HQ4, T-NR for suitable q (lane's own stage-A table) | not in the map; `c20-u4-second-order-archimedean-mixed-form` (0 independent referees) |
| 4 | U5 beyond a span | reach statements; band device N(theta) with two completions | non-identity statements with tolerance; passed by controls | ZQ through the pair form at every height; E_a for small a; DH and chains at low theta | Q31 (2), P58 (2 + 2 + 1 over three lanes) |
| 5 | U6 (a) | rank one closed; round 20: verdict lane | no candidate statement before round 20; round-20 lane: precise obstruction | see the round-20 lane | G35, G39, G40; `c20-u6ab-rank2-metaplectic-eigenobject-verdict` |
| 6 | U6 (b) | four norm families | no candidate statement before round 20 | as above | G37; the same round-20 lane |
| 7 | U6 (c) | cubic half: a known array; double-cover half: (K3) as a product test | a product identity that fails for both inputs, with both signs: no inequality | Eisenstein input and one self-dual cusp form are not separated; zeta controls not formulable | Z37 (1 per half) |
| 8 | U6 (d) | nothing new since round 6 | no statement | none; carries no R1 as stated | G27 to G30 |
| 9 | U6 (e) | positivity reads and the eigenstate class | closed | T-NR in conjugation form; states by exact relations: X1 | D8 (vi) (2) |
| 10 | U6 (f) | norm, Jensen gap, discriminant | closed | Epstein forms at inert primes | G33 (2) |
| 11 | U6 (g) | rank-2 Gram positivity; X(d) reduced to NL(d) | a model-level statement (open for d > 4) that symmetric off-line quartets satisfy | BLS-sym, ZQ in rational form, symmetric quartets | D10 (1 per lane; 2 on the round-18 lane) |
| 12 | U8 | dictionary DU; Lemma H | MEASURED, outcome "none" | T-NR, E_a, HEAT at every family-node | G43 (1 + completion run), Lemma H (2) |

Reading: on the files of rounds 1 to 19 no cell has produced a non-identity statement with referee-confirmed R3.
Every non-identity statement on file is passed by a named control (ZQ, E_a, DEL, HQ2, G_+ lift, symmetric quartets)
or is not separated between Eisenstein and cusp input. After round 19 the only cell without a passing control on file
was the second-order mixed form of U4; the round-20 lane on it reports that ZQ passes (unrefereed). Condition B is met
on the record through round 19 and is expected to be met after round 20, subject to the same two checks as A.

Other facts the planner may want next to A and B (none is a condition of the rule):

- Headline 1 of 4 rests on Theorem D of `c1-leeyang-krein-limit` with one referee on the limit step; the second referee
  is with `c20-referee-theorem-d-headline-and-r19` (no RESULT.md on disk at the time of writing). It can lower the
  headline; it cannot raise it.
- State of "R4 inside the 7/8 architecture" (planner, rounds 19 and 20): no probe with h > 1.
- Compute survivors: `campaign/SCREEN_SURVIVORS.md`: no survivor.
- Generator: the top 60 stand on the floored 7/8 device type only (before and after this lane's edits;
  `push/c20-repair-owed-record-r19-statement-o-v5/compare_before_after.md`).

## 3. Work the rule assigns to rounds 21 onward, with cost estimates

Units: the server limits of `push/BRIEF.md` (update of 2026-11-19: default lane up to 8 cores, 12 GB, 6 hours; heavy
lane up to 16 cores, 32 GB; `rhrun` only; GPU 1 only). "Paper" means a referee or record lane on the Mac within the
8 GB cap and no server time. Every cost is an estimate by this lane from the sizes of earlier jobs (the E_a run of
`c18-referee-r17-independent-sources`: three units of 4 cores below 1 GB for minutes; the heavy lane
`c19-rs-real-zero-completion-band-server`: 13,104 records at three heights in one round); no job was sized by a trial
run. A lane is one agent for one round.

### W1. Second referees and certified conversions for every line of Statement O still MEASURED or ARGUED

Text: version 5 (`push/c20-repair-owed-record-r19-statement-o-v5/STATEMENT_O_v5.md`) if the checkpoint accepts it,
else version 4. Under version 5 the lines not labelled PROVED are 1, 2, 4, 7, 10, 11, 12, 15 (ARGUED or MEASURED) and
5 (PROVED relative to a cited theorem). Under version 4 add lines 13, 14, 16, 17, each at cost 0 (the relabel is the
edit made in version 5; the files are on record).

| line | label | what it needs | already running in round 20 | work left for rounds 21 onward | estimate |
|---|---|---|---|---|---|
| 1 | ARGUED | second referee on the step mode of `screw-canonical` (P9) or `twist-rigidity` (P23); the deduction "density estimate implies the short-interval count" from an opened source (shared with lines 5, 7) | none | one referee lane; one source search (Ingham 1937 or a textbook proof) inside a repair slot | paper; 1 lane; server 0 |
| 2 | MEASURED | independent rerun of the Part C kernel certificate (Arb) and a DH Pick-order certificate above order 148; a statement "finite Pick orders are Euler-blind" that does not depend on the order reached, with a referee | `c20-statement-o-line2-dh-pick-kernel-certified-server` (heavy; files on disk, no RESULT.md) | if the round-20 lane certifies both: one referee lane on its certificates and the edit of the line. If not: one more heavy job. The order-independent statement is paper work and is not known to exist | referee: paper, 1 lane. Rerun if needed: 8 to 16 cores, 8 to 32 GB, 1 to 3 hours |
| 4 | ARGUED | second referee on the escape law F1 of `b-escape-law` (with the Lemma R tail repair, or the sharp-reach clause dropped); ball enclosure of one off-line zero of the backward-heat family | `c20-statement-o-line4-heat-zero-enclosures-server` (default size; outputs at 128 and 256 bits on disk, no RESULT.md) | one referee lane for F1; one referee of the enclosure; the edit of the line | paper; 1 to 2 lanes; server 0 unless the enclosure fails (then 4 cores, 8 GB, 1 to 2 hours) |
| 5 | PROVED relative | the text of Ingham 1937 or a textbook proof of the deduction | none | the same source search as line 1 | paper; shared with line 1 |
| 7 | ARGUED | primary source for the ray-class short-interval statement (Coleman 1990, closed access); a replay of the 7/8 sentence if it is kept | none | source search; otherwise the label stays "relative to" | paper; shared slot; may not be obtainable |
| 10 | ARGUED | one written statement of MV-CAP with two referees; the label can become "PROVED relative to H_W" at most (H_W is a hypothesis) | none | one lane to write the statement, two referee passes | paper; 1 lane plus 2 referee passes; server 0. Optional MEASURED support: 4 cores, 8 GB, 1 hour (changes no label) |
| 11 | ARGUED | a per-control table of the identities with the starred cells of row P8 evaluated; one referee | none | one lane: each identity on each control at 40 digits (DH, E_a, T-NR, HEAT, sign twists), then a referee | local within the cap (minutes per cell); 1 lane plus a referee pass |
| 12 | ARGUED | second referee on Theorem D of `c1-leeyang-krein-limit` (the limit step); mode (S) is not instantiated | `c20-referee-theorem-d-headline-and-r19` (files on disk, no RESULT.md); optional stage pole enclosures inside `c20-statement-o-line4-heat-zero-enclosures-server` (`stage_poles.py`, one output on disk) | the edit of the line after the referee reports; if Theorem D does not hold, a repair lane and a lower headline | paper; 0 to 1 lane |
| 15 | ARGUED (not relabelled in version 5) | a second referee sentence on the NR-q construction itself: integer-frequency part c zeta, the Hecke relation on the cosets q^j N, the zero line Re s = 1/2 +- arccosh(abs(c)/2)/log q; the second file on record covers Lemma A and Lemma D only | ball enclosure of the NR-q zero inside `c20-statement-o-line4-heat-zero-enclosures-server` (`ctrl_bc.py`; outputs at 128 and 256 bits on disk, no RESULT.md): a certified conversion of the measured zero, not a referee of the construction | one referee pass of table row F4 of `c15-control-with-zeta-fe-classes-u1-u2` (elementary) and of the round-20 enclosure | paper, part of one referee lane |
| 13, 14, 16, 17 | PROVED in version 5 | acceptance of version 5; leftovers named in its Label bullets: ZQ paper runs against rows Z34, Z36, P53 (ARGUED); a ball enclosure of the SG zero (optional); an engine code for G_+ (HQ3 is its integer-frequency form); the explicit error term of line 17 | SG zero enclosure inside the line-4 lane (`ctrl_bc.py`, outputs on disk, no RESULT.md) | one paper lane for the ZQ runs and the error term, if wanted; none is needed for the labels | paper; 0 to 1 lane |

W1 total (estimate): 5 to 7 paper lanes (lines 1 with 5 and 7; 4; 10; 11; 15 with the leftovers of 13 to 17; the
referee of the line-2 certificates; line 12 if a repair is needed) and at most one further heavy server job (line 2,
only if the round-20 job does not certify). Four lines cannot become PROVED by any computation because the missing
input is a literature source or a hypothesis: 1 and 7 (S(theta); Coleman 1990), 5, 10 (H_W). Owed at the same level
and not a line: Akhiezer's factorisation and the distribution form of Krein's extension theorem behind row Q31 (Turan's
theorem now has a source with proof: Montgomery-Vaughan, Multiplicative Number Theory III (draft), Theorem K.3; the
Plancherel-Polya step of W5c is proved inline).

### W2. The remaining silent cells in the order of section 4.0

| order | cell | state after round 19 | work the rule assigns | candidate on file | estimate |
|---|---|---|---|---|---|
| 1, 2 | U3, U2-POS | closed | none | - | 0 |
| 3 | U4 residual | cell; one read left (second-order mixed form) | read the round-20 lanes (`c20-u4-second-order-archimedean-mixed-form`, `c20-mixed-form-control-census-server`); if the stage-A stop holds under an independent referee the cell has no read left on file and can be closed by two referee files | none beyond the round-20 form | paper; 1 referee lane. The census job is running at default size |
| 4 | U5 beyond a span | read class with no candidate; band device family closed on three refereed lanes of the device type ('four' in the round log, which does not name them) | none without a new candidate; a second referee for `c19-rs-real-zero-completion-band-server` is owed (record) | none | paper; part of a referee lane |
| 5, 6 | U6 (a), (b) | cells; no candidate before round 20 | read `c20-u6ab-rank2-metaplectic-eigenobject-verdict` (precise obstruction; a pass marked independent holds); a second referee file closes the two cells under the rule | the round-20 lane's objects | paper; 1 referee pass |
| 7 | U6 (c) | closed by its lanes, one referee file per half; engine state `cell` | second referee for `c19-u6c-double-cover-k3-run` (with `c20-referee-theorem-d-headline-and-r19`); then set the engine state to closed in `mk_devices.py`, block R19 | none | paper; 0 if the round-20 referee lane files it; else part of a referee lane. Optional: a non-self-dual cusp form row, 8 cores, 12 GB, 1 to 3 hours (changes no state) |
| 8 | U6 (d) | cell; carries no R1 as stated | none under the rule unless a candidate is written; the rule gives no method for producing one | none | not sized |
| 9, 10 | U6 (e), (f) | closed (two referees) | none | - | 0 |
| 11 | U6 (g) | tried, not closed after four lanes; cannot score | NL(d) for general d (model-level; record value only); second referee for the round-19 lane | NL(d): d negative squares of a three-term one-variable kernel on the pole line | paper, 1 lane, uncertain outcome. Exact instances for d = 18, 20 if wanted: 4 cores, 8 GB, 1 to 2 hours |
| 12 | U8 beyond DU | cell; no candidate | none unless a candidate dictionary is written; the six controls on DU were not run | none | controls on DU: default lane, 4 to 8 cores, 8 GB, 1 to 2 hours; beyond DU not sized |

W2 total (estimate): 2 to 3 paper referee lanes (U4 with the round-20 lanes; U6 (a), (b), (c); U6 (g) and the band
continuation), one optional paper lane on NL(d), and at most two default-size server jobs, both optional (a
non-self-dual cusp row; the DU controls). Cells with no candidate object after round 19: U6 (d), U8 beyond DU; U6 (a),
(b) depend on the round-20 lane. For these the rule assigns no work until a candidate exists.

### W3. One reopening of the frontier slot, only with a named new input

Evidence on file: no named new input. The planner's reports for rounds 19 and 20 read "generator top 60: floored 7/8
device only, no named new input" and "R4 inside the 7/8 architecture: no probe with h > 1". Under the rule this slot stays closed until an input is
named (a new theorem, a new 2026 result, or a tool listed as missing in a closing record; STRATEGY section 3). Cost if
opened: one lane; server use depends on the input and is not sized.

### Record work that follows from W1 and W2 whichever way the checkpoint is decided

| item | source | estimate |
|---|---|---|
| second referees for round-19 lanes 1, 3, 4, 5, 6 | `ROUND_LOG.md` round 19, "Owed"; with `c20-referee-theorem-d-headline-and-r19` | paper; in progress |
| second referee for `c19-rs-real-zero-completion-band-server` (Lemma P in the repaired form; E3 on the height dependence of the ZQ row) | not assigned in round 20 | paper; part of one referee lane |
| enclosed tail bound for Theorem A (limit not enclosed; certified to T = 6400) | `ROUND_LOG.md` round 19, "Owed"; with `c20-mixed-form-control-census-server` (`tailA.py` on disk) | default lane, running |
| map rows and device or cell states for round 20; Statement O lines for the records of rounds 17 to 19 (candidate lines: exact relations with multiplicativity, control HQ2, row X1; band devices below the Nyquist band, control ZQ, rows Q31 and P58; group-law and cross-prime inequalities, controls E_a, DEL, G_+, rows G44 and G45; log-level positivity without the pole clause, control HQ3, row X2) | `CHECKPOINT_R20_INPUT.md` section 3; this lane | paper; 1 record lane per round |
| server housekeeping: 2.1 GB of lane files in `~/rh-push/c19-rs-real-zero-completion-band-server/` | `ROUND_LOG.md` round 19 | minutes; by the lane that owns the directory or the main session |

Sum for rounds 21 onward if both conditions hold (estimate): 8 to 11 paper lanes and 1 to 3 server jobs at default or
heavy size, most of them optional. At 8 lanes per round this is about two rounds of work, after which the rule leaves
only items that need a source (lines 1, 5, 7), a hypothesis (line 10), or a candidate object that is not on file
(U6 (d), U8 beyond DU, the frontier slot).

## 4. What this sheet does not decide

1. Whether conditions A and B hold after round 20. Both depend on round-20 lanes whose results are not in the round
   log and, for the explore lane, not refereed by an independent agent.
2. Whether Statement O version 5 is accepted as the current text. The relabels of lines 13, 14, 16, 17 were made by
   one reader against the second referee files, with each quotation checked by script; line 14 rests on one clause of
   one table row of the second file and is the weakest of the four; line 15 was not relabelled.
3. Whether U6 (c) is counted closed for the purpose of W2 on one referee file per half.
4. The order of work inside W1 and W2 beyond the order of section 4.0, and the number of rounds left. The cost column
   is not a schedule.
5. Any change of rule, weight, allocation or stopping criterion. None is proposed here.
