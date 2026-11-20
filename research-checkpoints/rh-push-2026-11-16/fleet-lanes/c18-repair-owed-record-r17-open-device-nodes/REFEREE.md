# REFEREE (adversarial, lens: general) for c18-repair-owed-record-r17-open-device-nodes/RESULT.md

Date 2026-11-19. One referee, independent of the author. Local checks only (text reads of the JSON and Markdown
files with a separate script, not the lane's `compare_top60.py`; three mpmath evaluations at 20 digits). No server
run. Only this file was written. Nothing here is a statement about zeros of zeta.

## Verdict

**Holds, with corrections E1 to E5 (record state and wording; no count breaks).** The claimed verdict
(partial result; record lane; score 0; headline unchanged at 1 of 4) stands. The lane has no PROVED step of its own.
Every engine count I recomputed agrees with the result. The corrections concern facts on file before the result was
last written that it reports as absent.

## What was recomputed

| claim | check | outcome |
|---|---|---|
| map 208 -> 211 labelled rows; P57, G43, Q31 new | distinct row labels counted in `before/OBSTRUCTION_MAP.md` and the current map | 208 and 211, no duplicate label; each of the three appears once now, zero times before |
| top 60: open device 0 -> 24, 12 per node; floored only 60 -> 36; closed device 0 | counted from `r4Devices` in `before/`, `after/`, `after_waivers/` and the live `engine/CANDIDATES.json` | agree; the live file has the same 60 keys as `after/` |
| rank 1 and scores (10.25 before, 11.25 after), lowest score 0.29 -> 2.75 | read from the files | agree |
| 23 keys in common, 22 with the same score; 56 of 60 against the waiver run | recomputed from sorted member keys | agree |
| generated / scored 38,082 / 8,432 -> 44,431 / 12,315; graph 1,732 -> 1,737 nodes, 9,129 -> 9,189 edges, rows 244 -> 247 | meta blocks | agree |
| "277 rejections closed cell" | 50 + 59 + 82 + 86 in the rejection table | 277 (this includes the 50 of `silent-cell-u2-pos`, closed before this lane; 227 are new cells) |
| geometric tags of partners (table of 3.4), 31 -> 38 entries | recomputed from declared tags in `IDEA_GRAPH.json`, proposed nodes excluded | every cell of the table agrees; antibridge, spinor, twistor 0 |
| cells 9 / 1 / 1 -> 6 / 1 / 4 | `before/devices.json` against `engine/curated/devices.json` | agree; devices 54 -> 56 (two with state open) |
| eight `c17-*.json` outcome records exist with `referees: 1`, `refereeHolds: true` | read | agree |
| nine correction notes plus the c16 ZQ bracket | counted the marker in the eight files (2 + 2 in the c15-u7 and c15-klein files) | 10 notes plus 1 bracket; texts match rows 3 to 11 of `campaign/CORRECTIONS_R16.md` |
| scoreboard: 1 of 4; lanes 156 -> 158; nodes 1,732 -> 1,737; closed 593 -> 596; families tried-not-closed 1,080 -> 1,081 | `before/scoreboard.after-rerun.json`, `after/scoreboard.json`, live file | agree. Note: `before/scoreboard.json` (1,727 nodes) is the file as found, not the rerun; the "before (rerun)" column is `scoreboard.after-rerun.json` |
| `generate.py` change | diff against `before/generate.py` | 5 changed lines and additive blocks; for a device that is not proposed `waiver_open` reduces to the old test `kind == 'open'`. Not regression-run by me either |

Condensation of referee files into rows, sampled by number: G43 (4,360,000; 1,923; 11,915 = 4,742 + 7,173; 15 of 23;
2e-52, 2e-161; 3,782 + 10,800; 79.5%), D10 (1,397,025 + 5,208; 47%; 318 of 320 on 16 configurations; 3,360; 36
matrices of order at most 24), Q31 (0.445 n + 2.1; 5.85 n; E1 to E8), P57 (0.0485883; 1.0004 to 1.23; 1.40; 0.047;
1.14 to 1.42) all occur in the corresponding REFEREE.md with the meaning the row gives them.

Mathematics quoted in row P57, re-derived (it is the source lane's, labelled PROVED there; this lane only copies it):

- Constant: integral over [1, inf) of (sin(pi x)/(pi x))^2 dx = 1/2 - Si(2 pi)/pi = 0.04858833321. Agrees with
  0.0485883.
- Proposition W, new case q = 1.03, b = 0.2, c = q^b + q^(-b): with w = q^(s-1/2), w + 1/w = -c gives w = -q^(+-b),
  so Re s = 1/2 +- b and t = (2k+1) pi/log q. Evaluated at k = 0 and k = 3: modulus of the factor 8.5e-22. The factor
  is invariant under s -> 1 - s; the coefficient measure has atoms at n/q, n, nq with non-negative weights and an
  atom at 1/q < 1 (support clause). Lowest zero at height pi/log(1 + delta), so delta >= about pi/T in a window.
  Holds.
- Lemma LR, new case z = e^(0.7 i), c = 2.9, q = 1.03: with v = conj(z) w one has z/w = 1/v, so v + 1/v = -c and
  abs(w) = abs(v). Root found at Re s = 31.498912756563719939 = 1/2 + arccosh(1.45)/log 1.03 to 20 digits. Holds
  for real c with abs(c) >= 2 (for abs(c) < 2 the zeros are on the line and the arccosh formula is not the
  statement; the row does not say so).

Controls: the lane claims no mechanism, so there is no zeta-only step to run controls against. Proposition W and
Lemma LR above are themselves control constructions (twins with zeros off the line) and were confirmed. Nothing in
the lane assumes RH, restates verified height, or presents a known theorem as new (row D10 says "new to the
campaign record only" for Lemma M; row Q31 labels the frame CLASSICAL).

## Corrections

**E1 (stale at filing: the sibling lane had a referee).** RESULT sections 0, 3.1, 7 and 10, the `lanes.jsonl` claim
line and `PLANNER_NOTE_R19.md` section 2 say `c18-exact-relation-rigidity-klein-spinor` has 0 referees.
`push/c18-exact-relation-rigidity-klein-spinor/REFEREE.md` has file time 20:39:44; this RESULT.md was last written
at 20:50:16. That referee file reads "Holds, with corrections E1 to E5". By the rule the result itself states
("the record lanes change a state on a referee file only") the condition for acting on the state of
`exact-relation-rigidity` was met before the lane closed. As filed, the node is `open`, holds 12 of the top 60, and
its status line says "untested by a refereed lane". Required: the result and the planner note should read "one
referee, holds with corrections", and the next record lane closes the type for the relation "multiplicativity"
(or this lane's line is amended). Until then the 12 entries on that node are not explore slots; the planner note
already holds them, so no allocation is wrong yet.

**E2 (stale at filing: the second referee passes existed).** RESULT 2.1 and section 7 item 1 say
`c18-referee-r17-independent-sources` "had not filed". The four files `REFEREE2.md` in `c17-u3-...`, `c17-u6e-...`,
`c17-u6f-...` (20:45 to 20:46) and `c17-window-information-law-ctheta-u5` (20:50:09) predate the last write of this
RESULT.md. All four read "holds with corrections". Consequences: (a) the marks "one referee" / "second pass owed"
in rows P57, D8 (vi), G33, Q31 are out of date; (b) the second-pass corrections are not in the rows: for P57 the
points W1, W2 (the clusters {n/q, n, nq} overlap as point sets once n >= 1/delta, so "same total weight in every
cluster" holds for the labelled decomposition only); for D8 (vi) correction C1 (b = D against b = D^(1/2)); for
G33 one reading of the Epstein row; for Q31 the domain of T_Z (C_c^infinity, extended, since T_Z is unbounded for
log density) and "N(theta) iff positive-real extension" being ARGUED for the windowed device; (c) the closures of
cells U3, U6 (e), U6 (f) now rest on two referee passes each, which strengthens, not weakens, the cell edits. No
row entered by this lane is contradicted by a second pass that I could find. Owed item of section 10 stands with
the files now present.

**E3 (wording of two correction notes).** The note for register row 11 (`s1-zero-statistics-gram`) begins "the
preceding statement is false as written"; the register says the cells hold with scope lines added. It should read
"holds only with the scope lines". The note for register row 8 names the second referee as its source and then
says "first referee; not rechecked by the second"; the source is the first referee.

**E4 (section 8, "two pending entries").** `pending` in `devices.json` has 6 entries before and after; states moved
from 5 open / 1 tried-not-closed to 4 / 2. Entries were edited, not added. Section 2.3 ("277 rejections closed
cell") should say 227 of the 277 come from the three cells closed by this lane.

**E5 (provenance of the two nodes).** In `IDEA_GRAPH.json` the two proposed nodes carry `origin: corpus`
(byOrigin corpus 1,253 -> 1,255) and inferred tags `euler-product` (both), `pick`, `theta`, `hankel`,
`trace-formula`, with `usesMultiplicativity: unknown`. They come from campaign lanes, not from the 18-month corpus,
and nothing on file shows either question uses the Euler product. The inferred tags add pairings beyond the eight
declared tags that section 7 item 2 discloses. This strengthens the result's own caveat: the 24 entries and the
table of 3.4 are an effect of tagging and of the weight `deviceOpen` = 2 plus the cap of 12 per device, not a
finding. The result says this; the scoreboard and the round log should not quote "open device 0 -> 24" as progress.

## Not checked

- `generate.py` was not rerun with the two nodes removed (same gap as the lane's "smaller limits").
- The text of rows D8 (vi) and G33 was not compared clause by clause with their referee files; the numbers of the
  other four rows were.
- The five "usable" judgements of `PLANNER_NOTE_R19.md` (one reader) were not assessed.
- The cause of the three `map-open-4` candidates no longer scored remains undetermined.

## Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument; the quoted rows state that multiplicativity enters no proved step |
| R2 | false | no statement at any height |
| R3 | false | no mechanism; control lists of the two proposed types are untested (one type reported closed by a refereed sibling lane) |
| R4 | false | nothing is carried to the line |

Score 0. Surviving claim: record lane with verified counts; owed list of round 17 entered; two question nodes added,
of which `exact-relation-rigidity` already had a holding referee report of closure when the result was filed.
