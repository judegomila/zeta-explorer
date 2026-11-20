#!/usr/bin/env python3
"""STRATEGY.md version 3 -> version 4 (checkpoint after round 14). Exact-string edits on the v3 file.
The section "Directive from the user, 2026-11-19" appended to the file by the main session while this lane ran is kept
unchanged at the end; the change-log entry is inserted before it."""
import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:70])
    s = s.replace(old, new)

rep("# Campaign strategy, version 3 (2026-11-19, review after round 10)",
    "# Campaign strategy, version 4 (2026-11-19, checkpoint after round 14)")
rep("Earlier versions: `../engine/scratch/STRATEGY.v1.md`, `../engine/scratch/STRATEGY.v2.md`.",
    "Earlier versions: `../engine/scratch/STRATEGY.v1.md`, `../engine/scratch/STRATEGY.v2.md`, `../engine/scratch/STRATEGY.v3.md`.")
rep("RH is open. No lane of this campaign has produced a statement about zeros of zeta. Section 0 says what ten rounds did produce.",
    "RH is open. No lane of this campaign has produced a statement about zeros of zeta. Section 0 says what ten rounds did produce; section 0a adds rounds 11 to 14, the checkpoint, and the form in which the campaign result is reported from round 15 on (`CAMPAIGN_REPORT_R15.md`).")

S0A = '''## 0a. State after round 14: checkpoint applied (122 lanes, all refereed at least once)

| kind | rounds 1-10: lanes / score sum / holds / lemmas decided / PROVED broken | rounds 11-14: same | all |
|---|---|---|---|
| explore | 28 / 0 / 23 / 7 / 5 | 12 / 0 / 12 / 26 / 0 | 40 / 0 / 35 / 33 / 5 |
| deepen | 21 / 1 / 18 / 18 / 2 | 3 / 0 / 3 / 6 / 0 | 24 / 1 / 21 / 24 / 2 |
| combine | 21 / 1 / 20 / 12 / 1 | 7 / 0 / 6 / 13 / 1 | 28 / 1 / 26 / 25 / 2 |
| compute | 10 / 0 / 9 / 4 / 0 | 4 / 0 / 4 / 4 / 0 | 14 / 0 / 13 / 8 / 0 |
| repair | 10 / 0 / 9 / 2 / 2 | 6 / 0 / 6 / 0 / 0 | 16 / 0 / 15 / 2 / 2 |
| total | 90 / 2 / 79 / 43 / 10 | 32 / 0 / 31 / 49 / 1 | 122 / 2 / 110 / 92 / 11 |

Source: `lanes.jsonl` (fields `kind`, `score`, `refereeHolds`, `lemmasDecided`, `brokenProved`), recomputed by `push/c15-repair-record-strategy-v4-report`.

- Headline (part A): 1 of 4, unchanged since round 1 (`c1-leeyang-krein-limit`; missing R2, R3, R4). The only other lane with a confirmed flag is the second score-1 lane of section 0. No lane has R4.
- Explore under version 3 (rounds 11 to 14): 12 lanes, each a device design under the two-stage rule; all 12 stopped at stage A with a control passing every step or with the candidate inequality equal to the target; all 12 referee passes hold; score sum 0. No explore lane passed stage A. This is the condition of the checkpoint rule of section 2.
- Frontier (part B): no figure moved in rounds 11 to 14. The frontier slot was withdrawn after two rounds without a changed figure.
- Record: map 202 labelled rows; 51 device types (50 closed, 1 floored, 0 open); Statement O version 3 (12 lines: PROVED 4, PROVED-relative 1, MEASURED 1, ARGUED 6); controls added during the campaign include WT, THIN, EIS-w, DEL, UNIV, BLS and NR-vec; pre-filter Lemmas P and F.
- Reliability (part D): hold rate 90.2%; 11 PROVED sub-steps broken by referees; 1 statement with three referee reports (an obstruction, not about zeros).
- State of "R4 inside the 7/8 architecture": no proved probe with h > 1 (unchanged since round 10).

**Form of the campaign result from round 15 on (checkpoint rule).** The campaign reports (i) the refereed record of obstructions (Statement O version 3, the map, the device table, with referee counts per row) and (ii) the part-B figure, zero-free abscissa 0.8748866470 as claimed in unrefereed manuscripts, with its dependencies. It does not report a statement about zeros of zeta. The report file is `CAMPAIGN_REPORT_R15.md`; the scoreboard headline stays 1 of 4.

'''
rep("## 1. Allocation rule, version 3: 8 lanes per round\n", S0A + "## 1. Allocation rule, version 4: 8 lanes per round\n\nVersion 4 allocation (checkpoint applied): **1 explore, 2 repair-and-record**, and five slots that are not device designs: up to 2 deepen, up to 2 combine, 1 compute. The frontier slot stays withdrawn. The table below is the version-3 table with the lane counts and sources of version 4 in the first and third columns; the stage rules, the pre-registration rule for compute lanes and the lane-end rules are unchanged.\n")
rep("| 3 (was 1) | explore: device design | One lane per read set of section 4.0 (RS-1, RS-2, RS-3), or a device type absent from `engine/curated/devices.json`.",
    "| 1 (was 3) | explore: device design | One lane, on one read class of section 4.0 (U1 to U8) or a device type absent from `engine/curated/devices.json`. Entry test on paper before stage A: the three pre-filter questions (Q-P, Q-B, Q-S; map section 2, Lemmas P and F), then items (i) to (iv) of U1 where the class is U1 or U2, then the control table.")
rep("| 1 (was 3) | deepen | Only on an item with a registered exact decomposition and no requirement flag claimed: currently the row-energy decomposition of round-10 combinable 1, or genus >= 2 targets (combinable 4). If neither is scheduled, or after the second round in which the item decides no lemma, the slot goes to explore. |",
    "| up to 2 (was 1) | deepen | Only on an item that would turn one silent class of section 4.0 into a verdict: a control constructed inside the class, a proof that none exists, or a threshold between a closed row and a mean value (round 15: U5 window-count threshold; U7 growing sections). A slot with no such item goes to the record, not to explore. |")
rep("| 1 (was 2) | combine | A pair from \"Results that could be combined\" in `ROUND_LOG.md` in which at least one side is not an identity holding for a control. Round 11: the deletion control with Statement O (the 20 devices the control does not pass, grouped by read set; this list feeds the explore lanes). |",
    "| up to 2 (was 1) | combine | A pair from \"Results that could be combined\" in `ROUND_LOG.md` in which at least one side is not an identity holding for a control, with the same aim as deepen (round 15: checkpoint classes U1, U2 with Lemma F and the question of a control having zeta's own functional equation; stage-A reads of the two geometric-program nodes with no map row by name, with the repair of sentence E1). |")
rep("| 1 (new) | frontier (part B) | Only with a named new input",
    "| 0 (withdrawn; was 1) | frontier (part B) | Withdrawn after two rounds without a changed figure; reopened only with a named new input")
rep("| 1 | referee, repair and record | Referee debts first",
    "| 2 (was 1) | referee, repair and record | Lane A: independent referees for the lanes of the previous round and for any record text the planner uses (round 15: the checkpoint draft). Lane B: map rows, device entries, label restrictions, engine bookkeeping, this file, and the campaign report `CAMPAIGN_REPORT_R15.md` (updated after each learn step). Order inside a lane, as before: referee debts first")

rep("- Explore falls to 2 lanes, and the freed lane goes to combine, in the round after one in which all three explore lanes stopped at stage A with a passing control and the combine lane named a pair.\n",
    "- (Version-3 rule, applied in rounds 13 and 14 and now superseded by the checkpoint: explore fell to 2 lanes after a round in which all three explore lanes stopped at stage A.)\n")
rep("- Checkpoint after round 14: if no explore lane has passed stage A, explore falls to 1 lane; one lane is added to frontier (if its figure moved) or to the record; and the three read sets of section 4.0 are replaced by whatever the record of obstructions lists as not covered. The campaign then reports its result as the refereed record of obstructions plus the part-B figure, and says so in the scoreboard notes.",
    "- Checkpoint after round 14: APPLIED (round-15 allocation in `ROUND_LOG.md`; this version). No explore lane passed stage A in rounds 11 to 14 (12 lanes). Explore is 1 lane; the frontier figure did not move, so the added lane goes to the record (2 repair); the read sets RS-1 to RS-3 of section 4.0 are replaced by the classes U1 to U8 that the record of obstructions lists as not covered. The campaign reports its result as the refereed record of obstructions plus the part-B figure (`CAMPAIGN_REPORT_R15.md`). `scoreboard.py` has no notes field; the sentence is carried by the report file and by section 0a.\n"
    "- After the checkpoint: explore returns to 3 lanes only by the rule above (an explore lane passes stage A), or when a deepen or combine lane turns a silent class into a statement that no control passes at a named step (referee-confirmed R3 for a non-identity statement). A silent class is removed from section 4.0 when a lane constructs a control inside it (it becomes a map row) or two referee files show it contains no device beyond the target.\n"
    "- Engine bookkeeping (round-14 lesson 7): `engine/merge_outcomes.py` is not rerun after a learn step has written entries to `outcomes.json` unless the outcomes are compared before and after and the difference is reported entry by entry.")

rep("### 4.0 Current best lead and the missing lemma (version 3)\n",
'''### 4.0 Read classes on which the record is silent (version 4; replaces the read sets RS-1 to RS-3)

**There is no lead with a referee-confirmed score of 2 or more, and no current best lead.** The read sets RS-1, RS-2, RS-3 of version 3 were tested through the 12 explore lanes of rounds 11 to 14 (map rows Z34, Q28, Q29, P53, D8, Z35, P54, G35, D9, G34, G38, G39, G37) and through the combine lanes behind rows G33, Z36 and G40; each device closed at stage A. Closing the devices that tested a read set does not close the read set (round-14 lesson 6). The list below replaces them. **These are the classes on which the record is silent, not leads.**

Source: `CHECKPOINT_R14_DRAFT.md` sections 2 to 4 (written by `c14-repair-map-engine-checkpoint-record`; read once by that lane's referee, who lists two defects to correct, both entered below; an independent referee is owed by `c15-referee-r14-independent-checkpoint`, which had not reported when this version was written). Each line is a separate conditional statement of the form: if the decisive step of a device reads the class as described, then no line of Statement O and no closed device row applies to it; the record neither defeats nor supports the device. No joint clause: the list is not a list of necessary inputs, it is not shown to be complete, and a device in one class may be defeated by a control no lane has yet constructed.

Caveat for U1, U2 and U3 together (referee of the draft, defect 1): with FE read as zeta's own functional equation (conductor 1, zeta's gamma factor) every control that is an ordinary Dirichlet series lacks FE by Hamburger's theorem. The record is therefore silent on U1 and U2 for the same by-construction reason as on U3, and requirement R3 cannot be tested there with the control table. The test proposed in the draft (the proof must fail when one hypothesis is relaxed inside a family where the conclusion is false: E_a, T-NR, WT, DEL, THIN each relax one input) is a proposal, not a recorded rule. The per-control reasons of the draft's U1 paragraph mix the strict and the loose reading of FE (defect 2); only its conclusion (each control lacks FE or GEOM) is used here.

| class | read set of the decisive step | why the record is silent | round-15 lane, or none |
|---|---|---|---|
| U1 | {FE, GEOM} in one inequality that is not an identity: zeta's own functional equation with exact unimodular local structure at every prime (step type X2 with FE) | every control lacks FE or GEOM (by construction, see the caveat); Lemma P does not apply to a step of type X2 | `c15-edge-argument-strip-width-hecke-amplified` (explore); `c15-control-with-zeta-fe-classes-u1-u2` (combine) |
| U2 | {FE, SIZE} with Lambda >= 0 or abs(mu) <= 1 at the logarithmic level in one inequality (step type X1 with FE) | lines 1 and 3 of Statement O defeat read sets without FE or without SIZE; the criteria of this read set (Weil, Li, Nyman-Beurling) are restatements | `c15-control-with-zeta-fe-classes-u1-u2` (combine) |
| U3 | identification classes: {FE, INT} at conductor 1; degree one with FE, INT and the Euler-product axiom; {POS, GEOM at every rational prime, INT} | no control lies in such a class by construction; the record has identifications there and no inequality | none |
| U4 | joint functionals of two or more objects that do not decompose over characters | narrowed in round 14: closed for dictionary DJ (functionals homogeneous in each kernel; MEASURED, finite search, lane-defined lifts), for functions of finitely many ratios L(chi)/zeta, for cross bridge Gram forms and for twist-transfer Weil forms (row G38). Silent on functionals not homogeneous in each kernel and on triples with the group law | `c15-nonhomogeneous-pair-triple-kernel-search` (compute) |
| U5 | FE entering through a number of window conditions that grows with the height, not as a mean value | rows P40, S12 cover a fixed number of windows (window translate); Statement O line 10 covers mean values; no row between | `c15-u5-window-count-threshold-translate-control` (deepen) |
| U6 | attached objects outside the closed carriers, cell by cell | cells (a) non-Borel eigen-objects with parameter rho and (b) Lax-Phillips Hecke norms outside weighted L2 were tested in round 14 and closed in the forms tested (rows G39, G40, G37; rank >= 2 non-Borel or metaplectic objects and non-solid norms outside four families remain). Silent on (c) global Whittaker constants on the double cover of GL(3), (d) rank >= 2 compact-at-infinity squares, (e) Bost-Connes states outside the three classes of row D8, (f) functionals of unsummed complex isogenous points (row G33), (g) scattering inequalities that are not truncated-norm positivity, and the affine kernel of row D9 | none for (c) to (g) |
| U7 | sections of the prime chain with P(t) growing like a power of t; J-expansive sections | rows Q12, Q22 to Q24 close fixed finite P, the polydisc, the Reinhardt shell and the gamma-coupled section | `c15-u7-growing-section-twin-ladder-bridge` (deepen) |
| U8 | single-object kernel sign conditions beyond the searched range (order above 4, more than three real parameters, nodes outside [-2.6, 2.6], other kernels or normalisations) | row G36 is a measured finite search; the census of row P55 has twelve types with measured sign tables | none |

Entry test for a lane on one of these classes, on paper and before any work: (1) Q-P, Q-B, Q-S; (2) for U1 and U2, show that the step is not an exact identity valid for the controls, not an identification, not stable under Blaschke factors when posed on a scattering coefficient, and not linear in the target or a division by it; (3) the control table of section 1. A lane whose aim is to turn a class into a verdict states which outcome it registers: a control constructed inside the class, or a proof that none exists with the remaining inputs.

Inside the one mechanism with R1 to R3 (the 7/8 architecture; reported with the part-B figure, not a read class for R4): open and not closed by the record are (E-K) in the window Z/P < X < ZP, the target-specific excess of (E-H), the below-level mixed moment and the slot capacity of Lemma 17.1, and TRO6 through the signed c-sum. Each moves the abscissa only between the method's floors (5/6 and 2/3 for the sextic format); none is a read set for the critical line.

The missing lemma CROSS-1 of version 3 (section 4.0b) has no candidate on file after four rounds and is kept as a record; it is a statement inside U1 with periodicity added.

### 4.0b Record of version 3, section 4.0 (rounds 11 to 14; superseded by 4.0)
''')

V4 = '''- v4 (2026-11-19, checkpoint after round 14; written by `push/c15-repair-record-strategy-v4-report`; previous file `../engine/scratch/STRATEGY.v3.md`):
  - Checkpoint of section 2 applied. Reason: in rounds 11 to 14 all 12 explore lanes (device designs on RS-1, RS-2, RS-3 and on device types absent from the device table) stopped at stage A, each with a control passing every step or with the candidate inequality equal to the target; score sum 0; no frontier figure moved. The rule written in version 3 prescribes this change; no judgement beyond the rule was used.
  - Allocation 3 explore / 1 deepen / 1 combine / 1 compute / 1 frontier / 1 referee-repair-record changed to 1 explore / up to 2 deepen / up to 2 combine / 1 compute / 0 frontier / 2 referee-repair-record. The five slots that are neither explore nor record are restricted to items that would turn one silent class into a verdict (round-14 combinable 4).
  - Section 4.0: the read sets RS-1 to RS-3 are replaced by the read classes U1 to U8 of `CHECKPOINT_R14_DRAFT.md`, with the sentence "these are the classes on which the record is silent, not leads", the caveat that U1 and U2 are silent for the same by-construction reason as U3 (no control with zeta's own functional equation), and the round-14 narrowing of U4 and U6. The draft is not independently refereed; the classes are used as a reading list, not as a statement. "Current best lead: RS-1" is withdrawn; there is no current best lead. Version 3's section 4.0 is kept as 4.0b.
  - Section 0a added: state after round 14 and the form of the campaign result (refereed record of obstructions plus the part-B figure 0.8748866470 relative to unrefereed manuscripts; headline 1 of 4; nothing about zeros). Report file `CAMPAIGN_REPORT_R15.md`.
  - Section 2: rule for leaving the checkpoint state; rule that `merge_outcomes.py` is not rerun over learn-step entries without a before/after comparison.
  - Engine (same lane; `engine/ENGINE_LOG.md`, round-15 repair slot): BLS, UNIV and NR-vec in `CONTROL_CODE_RE` of `build_graph.py`; control NR-vec; five closed device types of round 14 (51 types: 50 closed, 1 floored, 0 open); pending proposals RS-1 to RS-3 replaced by U3, U6 (e) to (g), U8 (the classes with no lane); generator weights unchanged. After the rerun the top 60 is unchanged in keys, order and scores: the generator still cannot propose a device type that has no node, and the U-classes have no node.
  - Not changed by this version: the section "Directive from the user, 2026-11-19" below was appended to this file by the main session while version 4 was being written; it is kept verbatim. Where it sets lane counts (three heavy compute lanes, a lane per screening survivor) it is read in addition to the table of section 1; the planner resolves any conflict.
'''
marker = "\n\n\n## Directive from the user, 2026-11-19"
if s.count(marker) == 1:
    i = s.index(marker)
    s = s[:i].rstrip("\n") + "\n" + V4 + s[i:]
else:
    assert "Directive from the user" not in s
    s = s.rstrip("\n") + "\n" + V4
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s.split('\n')))
