# Input for the checkpoint after round 20

Written 2026-11-20 (UTC) by lane `c19-repair-owed-record-r18-checkpoint-prep` (campaign round 19, repair B). This file
is input only. It does not apply the checkpoint, it changes no rule, weight or allocation, and it is not a result
about zeros of zeta. Paths are relative to `tmp/research-2026-11-16/`.

What the checkpoint rule asks for (`campaign/STRATEGY.md` section 2, "Checkpoint after round 20"): if by then no lane
has passed stage A and no silent cell has produced a non-identity statement that no control passes, explore falls to
0 and the remaining rounds go to (1) second referees and certified conversions for every line of Statement O still
labelled MEASURED or ARGUED, (2) the remaining silent cells in the order of section 4.0, (3) one reopening of the
frontier slot only with a named new input. Sections 1 and 2 below are the lists for (1) and (2). Section 3 lists what
the round-19 lanes can still change before the checkpoint is applied.

State at the time of writing: 164 lines in `campaign/lanes.jsonl`, headline 1 of 4 (`c1-leeyang-krein-limit`; missing
R2, R3, R4), no lane past stage A, device table 55 closed / 1 floored / 0 open, cells 6 cell / 1 tried-not-closed /
4 closed. Round 19 was running; none of its lanes had filed a referee report.

## 1. Lines of Statement O not labelled PROVED

Text read: `push/c16-repair-owed-record-r15/STATEMENT_O_v4.md` (version 4, the current text; map row O1). Label rule of
the statement: PROVED means two referee files cover the closing step. Count in version 4: PROVED 4 (lines 3, 6, 8, 9,
each in a narrowed form), PROVED relative to a cited theorem 1 (line 5), MEASURED 1 (line 2), ARGUED 11 (lines 1, 4,
7, 10, 11, 12, 13 to 17). Twelve lines are therefore MEASURED or ARGUED, and line 5 is added below because its label
is conditional on a source.

"On file since version 4" lists referee files written after version 4 that a new version of the statement could cite.
This lane did not reread those files against the lines; whether a file covers the closing step of a line is a
decision of the checkpoint, and no label is changed here.

Cost column: an estimate by this lane, not a measurement. Units are the server limits of `push/BRIEF.md` (update of
2026-11-19: default lane 8 cores, 12 GB, up to 6 hours; heavy lane 16 cores, 32 GB; `rhrun` only). "Paper" means no
server time: a referee lane on the Mac within the 8 GB cap. Comparison figures on file: the E_a run of
`c18-referee-r17-independent-sources` took three units of 4 cores below 1 GB for minutes; the heavy lane
`c18-tz-band-completion-controls-server` certified 44,600 cells of order 96 in one round.

| line | read class (short) | label in v4 | what the label lacks | needs: second referee (R) or certified conversion (C) | on file since v4 | estimated server cost |
|---|---|---|---|---|---|---|
| 1 | size, positivity or support of Lambda (controls TW, THIN, E_a; DEL for the zero mode) | ARGUED, relative to `screw-canonical` (P9) and `twist-rigidity` (P23), one referee each, for the step mode; (Z-1) relative to S(theta) | a second pass on P9 or P23 for the step mode; the deduction "density estimate implies the short-interval count" (Ingham 1937 or a textbook proof) not opened; `sq-causal-cascade` Thm 3 has no referee | R on the step mode of P9 or P23; source for S(theta) (shared with lines 5, 7) | none found | paper; 0 |
| 2 | functional equation + kernel positivity + ordinary Dirichlet series, no Euler product (DH) | MEASURED: zero step covered by two referee files; membership (finite Pick orders 2 to 148, Taylor blocks, kernel certificate) relative to certified runs with one referee each | a statement "finite Pick orders are Euler-blind" that does not depend on the order reached; a second referee on Part C of `c1-missing-controls` (the Arb kernel certificate) | C: independent rerun of the Part C kernel certificate (log-concavity and u L'' - L' < 0 for the DH kernel, Arb) and of the DH Pick-order certificate at one order above 148; R on the order-independent statement if one is written | `c1-missing-controls/REFEREE2.md` exists but covers Part D (the two classical inputs), not Part C | default lane: 4 to 8 cores, 8 GB, 1 to 3 hours (ball arithmetic, Pick matrices of order up to about 200 at 600 to 1200 bits) |
| 4 | hypotheses stable under small backward heat flow (HEAT) | ARGUED, relative to `b-escape-law` (F1; PROVED at source, one referee); located zeros MEASURED by mpmath quadrature | a second referee on F1 (with the Lemma R tail repair for the sharp-reach clause, or the clause dropped); an interval certificate for one located off-line zero of the backward-heat family | R on F1; C: ball enclosure of one off-line zero of the backward-heat family at one tau < 0 (argument principle on a small rectangle with a rigorous quadrature of the kernel integral and a tail bound) | none found | default lane: 4 cores, 8 GB, 1 to 2 hours; the tail bound of the kernel integral is paper work |
| 5 | Euler product + Lambda >= 0 + pole, without FE (DEL) | PROVED relative to S(theta) (two referee files cover the closing step) | the text of Ingham 1937 or a textbook proof of the deduction of the counting form from the density estimate; no computation is missing | source only (shared with lines 1, 7) | none found | paper; 0 |
| 7 | complete multiplicativity with unimodular parameters, plus a discrepancy or twisted-sum hypothesis that is not periodicity (THIN) | ARGUED, relative to a short-interval prime theorem in counting form; the derivation F = zeta (s - b) W is covered twice; the sentence on the 7/8 proof is ARGUED | the primary source for the ray-class short-interval statement (Coleman 1990, closed access); the deduction shared with lines 1, 5; the 7/8 sentence has no replay | source; R on the 7/8 sentence only if it is kept | none found | paper; 0 |
| 10 | mean values over heights or a family as the only input to an every-window conclusion (cluster lifts) | ARGUED, relative to hypothesis H_W (not known for any lane window above 3e12) and to `b-mvcap-function-side` (P29, one referee) | MV-CAP has no single refereed statement in the form used; the density half of row P50 was never run | one written statement of MV-CAP with two referees (R twice); no certified conversion applies: H_W is a hypothesis, so the label can become "PROVED relative to H_W" at most | none found | paper; 0. Optional MEASURED support (a cluster lift at one height with certified window means): default lane, 4 cores, 8 GB, about 1 hour; it would not change the label |
| 11 | exact identities with no inequality | ARGUED, relative to `eq48` (P1), `dh-separator` (P8; starred control cells are inferred), `b-euler-detector` (L2), `c5-device-table-extension` (D7), one referee each | the identity stated per control, with the starred cells of P8 checked or named as inferred | R on a per-control table; C for the starred cells: evaluate each identity on each control at 40 digits (DH, E_a, T-NR, HEAT, sign twists) | row X1 (round 18, one referee) is a related record for exact relations and the control HQ2; it does not cover P8 | local within the cap; server not needed (minutes of mpmath per cell); if run on the server for uniformity: 2 cores, 4 GB, under 30 minutes |
| 12 | finite stages, finite prime sets or finite orders, with a limit taken afterwards (U) | ARGUED, relative to `c1-leeyang-krein-limit` (Q19, one referee) for the limit step; the rotation-invariance sub-statement has two files; stage pole counts MEASURED | a second referee on the limit step of Q19 (Theorem D); mode (S) is not instantiated (no intermediate statement false for U is named) | R on Theorem D. The same lane carries the headline (1 of 4), so this second referee also decides whether the headline R1 stands on two files | Proposition F of row X1 (one referee) is a second, independent instance of "nothing follows from a finite stage" inside the class with exact FE; not a referee of Theorem D | paper; 0. Optional C for the MEASURED stage pole counts: ball-arithmetic argument principle on the renormalised Euler stages at the lane's parameters, 4 cores, 8 GB, 1 to 2 hours |
| 13 | zeta's own FE with multiplicative structure read on the prime-power atoms, without INT (ZQ) | ARGUED under the rule (one referee file); construction and defect bound PROVED in the lane | second referee on the construction | R | `c16-referee-r15-j1prime-u8-screening/REFEREE2_control-zq.md` and `REFEREE2_c15-control-with-zeta-fe-classes-u1-u2.md` (rule: holds with corrections; two independent referees for Lemma A, the closed form of D, the defect bound, Lemma L with the pole clause, Lemma D; checked on two new zero pairs). Not covered there: the paper runs of ZQ against rows Z34, Z36, P53 | 0 if the checkpoint accepts the file; the relabel is an edit of the statement. The ZQ runs against Z34, Z36, P53 would be a paper lane |
| 14 | zeta's FE with exact atoms and an upper bound for Lambda (SG) | ARGUED under the rule (one referee file); MEASURED at b = 0.3 | second referee | R | the same second-referee file re-derives "SG has D <= 0" by hand and did not rerun the numerics | 0 if accepted. C (optional): ball enclosure of the real zero at 1/2 + b for two values of b, local, minutes |
| 15 | zeta's FE with coefficients read at integers only, or covariance at rational primes only (NR-q) | ARGUED under the rule (one referee file); MEASURED at c = 2.1 | second referee | R | the same file covers Lemma D and the forced exponent; the NR-q zero at c = 2.1 (0.857311 + 3.564428 i) was not rerun there; the referee of `c18-u4-group-law-left-of-one-torus-orbit` reran NR-q coefficients (2.876, -5.129) | 0 if accepted. C (optional): ball enclosure of the zero and winding number at two values of c, local, minutes |
| 16 | zeta's FE, exact atoms and Lambda_F >= Lambda >= 0, without the pole clause (G_+) | ARGUED (one file, one derivation; the construction was in a referee file only) | a second derivation of D_+ >= 0; an engine code if the control is used again | R (second derivation) | two later derivations: `REFEREE2_control-zq.md` (G_+ with b = eta + 0.1: min D_+ = 0 at x = 1, positive elsewhere on the grid; FE defect 7.2e-29) and the referee of `c18-u4-group-law-left-of-one-torus-orbit` (D_+ = 4 x^(-1/2)(cosh bL - cos(gbar L) cosh(eta L)) >= 0 for eta < b, re-derived from the partial fractions; minimum 0 on a grid of 6e5 points). The inequality is elementary (cosh bL >= cosh(eta L) >= cos(gbar L) cosh(eta L)) | 0; relabel by edit if the checkpoint accepts the two files. No engine code yet |
| 17 | FE read through window tests at heights inside one span, identification-type conclusion (span translate) | ARGUED under the rule (one referee file); "PROVED to leading order" | second referee; an explicit error term in place of "to leading order" | R; the explicit error term is paper work | `c16-referee-r15-j1prime-u8-screening/REFEREE2_c15-u5-window-count-threshold-translate-control.md` (holds with corrections; Lemma 1 (b) holds under abs(alpha) <= a/2; one verdict sentence false as written, the first referee's E1 confirmed; span counts recomputed). The explicit error term is still not written | 0 for the relabel; the error term is a paper lane |

Summary of section 1.

- Lines whose missing second referee file appears to exist already (13, 14, 15, 16, 17): five lines. If the checkpoint
  accepts them, a version 5 of the statement would move them from ARGUED to PROVED under its rule (each in the form
  the second file confirms), at no server cost. This lane has not made that edit.
- Lines that need a second referee on a source lane and nothing else (1, 12; 4 for the escape law): three paper
  lanes. Line 12 is also the headline lane.
- Lines that need a certified computation (2; 4 for one located zero; optional for 11, 12, 14, 15): two default-size
  server jobs are enough for the non-optional part (estimate: 8 to 16 core-hours in total, below 8 GB each).
- Lines that can become "PROVED relative to" at most, because the missing input is a literature source or a
  hypothesis (1 and 7 through S(theta) and Coleman 1990; 5; 10 through H_W): four lines. No computation changes these.
- Not a line, but owed at the same level: sources at secondary level behind row Q31 (Turan's second main theorem and
  the factor 2: Montgomery's Ten Lectures; Akhiezer; the distribution form of Krein's extension theorem;
  Plancherel-Polya for W5c).

## 2. Remaining silent cells, in the order of STRATEGY section 4.0

Source of the order: the table "Silent cells after round 15" of `campaign/STRATEGY.md` section 4.0. States:
`engine/curated/devices.json`, key `cells`, after this lane's edit, with the paragraph "State of the cells after
round 18". "Passing control" means a control on file that passes every step of the reads tried so far.

| order | cell | state after round 18 | what is closed, with row and referee count | what remains | passing control on file for what remains | candidate on file | round-19 lane |
|---|---|---|---|---|---|---|---|
| 1 | U3 (identification classes) | closed | identifications (Hamburger; Kaczorowski-Perelli; Lemma L; Theorem P, row P56, three referee files); read as an inequality: target-level (row P57, two referees); exact relations in rigidity form: closed (row X1, one referee) | nothing as a cell | not applicable | none | none |
| 2 | U2-POS | closed | Theorem P (row P56): an identification; a cell of U3 | nothing | not applicable | none | none |
| 3 | U4 residual | cell | five types (rows G38, G41); canonical tier of DN (MEASURED); (iv) for positivity-derived inequalities on shifts or character powers (row G44, one referee) | **joint / quadratic residual**: inequalities quadratic in the logarithmic derivative, or reads of the phases at different primes jointly | **none** | a read on the zeros of D_P through the truncation identity (round-18 combination 4) | `c19-u4-joint-prime-phase-quadratic-dp-zeros`; data from `c19-dp-zero-census-truncation-identity-server` |
| 4 | U5 beyond a span | pending entry, read class | reach statements (row Q31, two referees); its one named device N(theta) with the reflected completion (row P58, one referee per lane) | a completion positive by construction in 0.75 <= theta <= 0.85 | ZQ to theta = 0.75, E_a for small a, DH at low theta, chains at 96 modes | real zeros of the Riemann-Siegel main sum as completion | `c19-rs-real-zero-completion-band-server` |
| 5 | U6 (a) | cell | rank one (rows G35, G39, G40) | rank >= 2 non-Borel or metaplectic eigen-objects with parameter rho | not tested (no object) | none | none |
| 6 | U6 (b) | cell | four norm families (row G37) | non-solid Lax-Phillips norms outside the tested families | not tested (no norm) | none | none |
| 7 | U6 (c) | cell | cubic-cover half: a known array of cubic Gauss sums (row Z37, one referee); local double-cover data (row Z23) | **double-cover half**: squarefree-class Whittaker constants of a genuine cusp form on the double cover of GL(3) | **none** (the Eisenstein twin is recalled, not run; zeta controls are not formulable on the cover) | a method (genus sums of point values at ternary forms); (K3) is not yet a defined statement | `c19-u6c-double-cover-k3-run` |
| 8 | U6 (d) | cell | nothing new since round 6 | rank >= 2 compact-at-infinity squares without a Hecke rule | not tested; carries no R1 as stated | none | none |
| 9 | U6 (e) | closed | positivity reads and the eigenstate class (row D8 (vi), two referees) | nothing as a cell (exact-relation states: row X1; Weil-form weights: rows P1, G21) | not applicable | none | none |
| 10 | U6 (f) | closed | norm, Jensen gap, discriminant (row G33, two referees) | symmetric functions of degree >= 3 of the point values | Epstein forms at inert primes pass the three closed reads | none | none |
| 11 | U6 (g) | tried, not closed | Schur, bounded-analytic, Pick (BLS; row D9); rank-2 Gram positivity read off the zero set: MEASURED to pass for symmetric insertions; a symmetric off-line quartet passes (row D10 with the round-18 addendum, one referee per lane, three lanes) | X(d) for d > 4 (a record item: the row cannot score); the two-variable affine kernel of row D9; a read of the archimedean factor | BLS-sym, ZQ in rational form, symmetric quartets | determinant / Bezoutian formula for X(d) | `c19-d10-xd-determinant-pole-term-lemma-q` |
| 12 | U8 | cell | dictionary DU (row G43, MEASURED, one referee with a completion run); Lemma H (two referees and a third derivation) | orders above 6, more than four parameters, other kernels, the six controls not run | T-NR, E_a, HEAT at every family-node of DU | none | none |

Cells without a passing control on file after round 18: the joint / quadratic residual of U4 (order 3) and the
double-cover half of U6 (c) (order 7). Each has a round-19 lane. Cells with no candidate object at all: U6 (a), (b),
(d), U8 beyond DU. Under the checkpoint rule these four can receive a lane only if a candidate is written first; the
rule gives no method for producing one.

Estimated server cost of the cell work that is already specified (estimates):

| item | size | estimate |
|---|---|---|
| U4 joint residual: census of zeros of D_P and joint prime-phase statistics on held-out heights (owed runs 2, 3 of `push/c18-tz-one-sided-bound-fe-reserve-bridge/FOR_NUMERICS_LANE.md`) | default lane, running in round 19 | 8 cores, 12 GB, up to 6 hours |
| U5 / band device: Riemann-Siegel real-zero completion with pre-registered mode counts (owed runs 1, 4, 5 of the same file) | heavy lane, running in round 19 | 16 cores, 32 GB, up to 6 hours |
| U6 (c) double cover: (K3) with its Eisenstein control, once (K3) is a defined statement; the class count for D_max = 1e4 must be computed before sizing (referee correction 4) | default lane, running in round 19 | 8 cores, 12 GB, 3 to 6 hours; not sized |
| U6 (g): exact instances of X(d) for d = 14 to 20 if the determinant formula is not found | default lane | 4 cores, 8 GB, 1 to 2 hours (exact rational arithmetic) |
| U8 beyond DU | no candidate | not sized |

## 3. What round 19 can still change before the checkpoint is applied

- Second referees for round-18 lanes 1, 2, 3, 4, 6 (`c19-referee-r18-independent-sources`): rows X1, P58, G44, the
  D10 addendum and the two device closures rest on one referee each. If a second referee breaks a closure, the device
  state returns to open (`engine/curated/mk_devices.py`, block R18, says how).
- `c19-hq2-screen-fe-int-mult-pos-devices`: a device that rejects HQ2 by a step other than the pole at 1/2 would be a
  new device type (registered expectation: none).
- `c19-rs-real-zero-completion-band-server`: decides whether the band device has a continuation (item 4 of section 2).
- `c19-u4-joint-prime-phase-quadratic-dp-zeros` and `c19-dp-zero-census-truncation-identity-server`: the U4 residual.
- `c19-u6c-double-cover-k3-run`: the double-cover half of U6 (c).
- A new version of Statement O is not written. If the checkpoint applies, the first record task is version 5 with the
  five relabels of section 1 decided against the files named there, and lines for the round-17 and round-18 records
  (candidate lines, each one conditional statement: exact relations with multiplicativity, control HQ2, row X1; band
  devices below the Nyquist band, control ZQ, rows Q31 and P58; positivity-derived group-law inequalities left of 1,
  controls E_a and G_+, row G44).

## 4. Limits of this file

1. The cost column is an estimate by one reader from job sizes of earlier lanes; no job was sized by a trial run.
2. "On file since version 4" was assembled from file names and the first sections of the second-referee files; the
   files were not checked clause by clause against lines 13 to 17.
3. The order of section 2 is the order of the round-15 table; it is not a ranking by expected value, and the file
   makes no statement that a device exists in any cell.
