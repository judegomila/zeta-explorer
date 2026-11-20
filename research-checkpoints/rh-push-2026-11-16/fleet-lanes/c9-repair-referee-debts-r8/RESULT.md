# c9-repair-referee-debts-r8: referee debts of round 8, corrected device node, control EIS-w, Landau-Siegel record

Internal working note, 2026-11-18. Slug `c9-repair-referee-debts-r8`. Kind: repair. Not refereed. Nothing committed,
pushed or posted. The compute server was not used (no ssh, no unit started). Local runs through `scripts/memcap.sh 8`
only: four check scripts (`.venv-arb/bin/python`: 20 s, a few seconds, 30 s, 88 s; largest array 6.5 MB) and the
engine scripts (about 1 minute). External texts were fetched with a generic client and no project details.

This lane is not an attack. No statement about zeros of zeta or of any L-function is made. RH is open; 7/8
(unrefereed manuscript) and 0.874886647 are unchanged; no bound moves. No requirement flag of any lane changes.

Labels: PROVED (argument written in the cited file) / CONFIRMED (re-derived, agrees) / EXACT (integer arithmetic) /
OUTLINE / ARGUED / OPEN.

## Verdict

**Partial result (referee and bookkeeping work). Decisive first test: the sixth-power form of the (E-K) second
moment is positive semidefinite of rank 6, not of signature (2, 2); decided by an exact integer identity.**

| # | item | outcome | exact line that is broken or narrowed | file |
|---|---|---|---|---|
| 1a | `c8-ek-theta-second-moment-formula`, sixth-power form | **decided: positive semidefinite, rank 6** (the lane's claim is **broken**) | RESULT.md section 3: "So H is indefinite of signature (2, 2)", and verdict item 3 "H an indefinite Hermitian form of signature (2, 2) ... contributes +- X K^{1/6} Z^{2 beta - 2}" | `c8-ek-theta-second-moment-formula/REFEREE2.md`, `ref2_form.py`, `.log` |
| 1b | same, Lemma 1 | **holds** (two referees) | none | same |
| 1c | same, Theorem 2 | **holds narrowed**: conditional outline; asymptotic for squarefree unmarked columns; upper bound Z^eps (X + N) with cube parts and one mark slot (K <= Z^6), counts supplied by this referee | verdict item 2 "(E-K) holds for X >= N" (missing: outline, squarefree unmarked) | same |
| 2a | `c8-liou-row-bound-theorem`, 3.4 Step 5 (h -> g) | **holds**; the inner sum is the exact product prod (1 + a_p), a_p = 1/q_p or 1 - 1/q_p | none | `c8-liou-row-bound-theorem/REFEREE2.md` |
| 2b | same, twist insertion in Lemma S | **holds against arXiv:1112.1650v1** (proof of Corollary 1.4 read line by line); journal version located (IMRN 2014 (7) 1925-1955, DOI 10.1093/imrn/rns257) and **not openable** (HTTP 403) | Theorem A is **relative to a statement not located in the journal version** | same |
| 3a | `c8-hecke-entropy-resonance-rigidity`, withdrawal of Lemma G2 (i) and the DH row | **holds** (object identically 0: 5.7e-27 against 1.75) | Lemma G2 (i) and the DH row of section 7 | `c8-hecke-entropy-resonance-rigidity/REFEREE2.md`, `ref2_hecke.py`, `.log` |
| 3b | same, Gamma-multiplicity in Lemma 3 | **holds and is necessary**: Lemma 3 as written is **broken** (inequality false by a factor 19.5 at height 2000) | "Let m be the largest number of pairs (p, j) ... whose images of B in Gamma\H contain a common point" | same |
| 3c | same, sign in Lemma 5 | **holds**: the factor is e^(-(2 sigma - 1) s) (12 digits) | "(a_s)_* m_sigma = e^((2 sigma - 1) s) m_sigma" | same |
| 3d | corrected device node, control EIS-w, engine rerun | **done** | n/a | `engine/nodes/nodes-19.json`, `engine/curated/controls.json`, `engine/ENGINE_LOG.md` |
| 4a | blockwise Hilbert-Schmidt bound (Proposition B of the round-7 referee) | **holds**; extended to row-dependent column partitions (PROVED); general rectangle tilings only under lower flatness of A (**holds narrowed**) | none | `c7-probe-format-h-cap/REFEREE2.md`, `ref3_blocks.py`, `.log` |
| 4b | Lemma 2 of `c7-laurent-shell-gamma-section`, monomial m (proof of the round-7 referee) | **holds** for the Cesaro mean and the weights r_j; **holds narrowed** for Abel weights: the error proved is O(delta^(-3/4)) | round-7 REFEREE2.md section 2: "gives an error O_q(delta^(-1/4 - eps))" | `c7-laurent-shell-gamma-section/REFEREE2.md`, `ref3_monomial.py`, `.log` |
| 4c | Lemma 2, non-monomial m | **not proved**; reduced to sub-steps (S1) to (S4) with exponents that close; exact open sub-step: (S1), truncation of the Poisson sum in k (needs the mean square of zeta'' with an Abel weight and the boundary terms) | n/a | same, section 3 |
| 5 | outline lane B: debt 7 (THIN primary source) | **not discharged**: Coleman 1990 located (DOI 10.1112/plms/s3-61.3.433), closed access, no open copy; THIN stays proved-relative | n/a | `outline-lane-b/REFEREE2.md` |
| 5 | debts 10, 2, 4 | not reached | n/a | same |
| 6 | Landau-Siegel single-node record | **device set to closed for the height aspect**; choice logged | n/a | `engine/ENGINE_LOG.md`, last section |

## 0. Plan

Order: decisive test first (item 1a: one exact computation decides between two referee-level statements that
lanes 1 and 2 of this round build on); then item 2 (source and one line of algebra); item 3 with its engine work;
items 4, 5, 6. Read: BRIEF to the end; RESULT and REFEREE of the three round-8 lanes; the round-7 referee files
for Proposition B and Lemma 2; `campaign/OBSTRUCTION_RECORD_OUTLINE.md`; engine scripts and the last log section;
map rows P3, P29, F1 and section 5 (for the debts not reached). Every numerical check uses code written here and
cases different from the earlier runs.

## 1. Item 1: the (E-K) second moment

Decisive test (`ref2_form.log`). The unit orbit of a frequency k contributes the kernel
K_k(c, c') = conj(chi_c(k)) chi_c'(k) 6 R(c, c') chi_c(-1) 1_{eps(c) = eps(c')}, eps(c) = chi_c(zeta_6). On 422 primary primes
of norm < 3000, with integer symbols: R is +-1 and a function of the classes mod 4 with the lane's matrix
(eigenvalues -2, -2, 2, 2); chi_c(-1) = R(x, x); the class kernel mod 36 (107 classes seen, 29,288 non-zero entries)
equals 6 sum over 6 blocks of phi phi^T with phi = +-1, an exact identity. So the form is positive semidefinite of
rank 6 for every frequency orbit. The signature (2, 2) is that of R without the factor chi_c'(-1) and without the
unit sum. The first referee's E1 holds. Consequences and the scope of "positive" (leading term only) are in the
REFEREE2 file, section 1.

Theorem 2: exponent count confirmed; mark slot and cube parts supplied in outline (REFEREE2 section 2).

Effect on this round's lanes 1 and 2: they may use Lemma 1 as a two-referee statement and "the off-diagonal is a
sum of squares per unit orbit at leading order"; they may not use "indefinite", and Theorem 2 only as a conditional
outline (it is circular as an input in any case).

## 2. Item 2: Theorem A of the Liouville lane

Step 5 re-derived with every exponent; the inner sum over d has an exact value. Lemma S: the printed proof of
Corollary 1.4 in arXiv:1112.1650v1 was read; a fixed finite-order twist theta with conductor supported on S passes
through each of its four steps (primitive character; same gamma factor because F has one complex place; theta(b_1)
absorbed in the arbitrary coefficients of Theorem 1.3). The arXiv has one version; the journal text could not be
opened. Theorem A: two referees, **relative to the arXiv text** and to the classical reciprocity facts of Lemma 3'.

## 3. Item 3: the Hecke recurrence lane

All requested corrections hold (REFEREE2 file). Two of them are more than wording: the DH object is the zero
function, and Lemma 3 with the lane's m is false for balls high in the cusp (ratio 0.195, 1.95, 19.5 at heights 20,
200, 2000). The obstruction itself (control EIS-w passes every step; P-exponent -1 for every sigma; m_sigma
A-conformal) holds under two referees.

Engine (edits under `engine/` only; before-copies in `engine_before/`; log `engine_rerun.log`; counts
`engine_counts.json`): node `hecke-correspondence-recurrence` (closed) in `nodes/nodes-19.json`; device entry in
`curated/mk_devices.py`; control `EISW` in the new `curated/controls.json`, read by `build_graph.py`;
`merge_outcomes.py` pattern. Rerun: 84 outcome entries (60 closed); 1,623 nodes (960 live); 8,806 edges; 51 control
nodes (16 canonical controls); device types 28 closed / 1 floored / 4 open; generated 41,659, scored 12,165,
rejected 29,494; top 60: 33 with an open device, 27 floored only, 0 closed; 59 of 60 keys unchanged.

## 4. Item 4

Proposition B: proof re-derived; B' (row-dependent column partitions) proved; B'' (rectangle tilings) proved with
abs(A_m) >= a0 norm(A) Q^(-1/2). Cubic-character matrices, 25 partitions of each kind at three sizes: least ratios
3.27 to 9.77. Monomial Lemma 2: every step re-derived; four new cases agree to 0.0005 - 0.0027; the Abel error term
is corrected. Non-monomial: see the table; no obstruction found, no proof written.

## 5. Items 5 and 6

Debt 7: both the publisher page and the PDF of Coleman 1990 refuse a generic client; no open copy. The dependency
is restated (any Hoheisel-type theorem for ray classes of the field with theta < 1; eta = 1 - theta). Debts 10, 2, 4
not started. Landau-Siegel: closed for the height aspect, with the reasons and the way to reopen in the log.

## 6. Controls

No attack, so no control has to fail. Where the controls sit:
- Item 1: the positive semidefinite kernel is a property of the sextic symbol and the units; it holds for every
  vector (theta, Liouville, random). It separates nothing.
- Item 2: Theorem A concerns one control weight (Liouville) of the 7/8 architecture; unchanged.
- Item 3: EIS-w passes every step of the device (two referees); U, THIN, sign twists fail at Gamma-invariance; DH
  not run (no object); backward heat, E_a, T-NR, Beurling, phase-rotated transfer operator, theta^w: no object on
  the modular surface was constructed, not run.
- Item 4: Proposition B is target-independent; the monomial Lemma 2 holds for any Dirichlet series with an
  approximate functional equation.
Non-zero checks for PROVED statements about control objects: G_chi (zero for odd characters: this is the finding;
1.749 and 1.673 for the even ones); f_eps (8.8e-4 at one point); m_sigma (Gamma(2 sigma + 1) > 0); kernel K (29,288
non-zero entries); cubic matrices (norm^2 1643 to 11874); predicted means of Lemma 2 (not 0, not 1 in two cases);
Liouville rows (N = 440.83, P = 21.87, from the lane's certified run).

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | referee work; the statements checked hold for non-multiplicative vectors (item 1 kernel, Proposition B) or are identities of a control (items 2, 3) |
| R2 height-uniform, every window | false | no conclusion about zeros |
| R3 controls fail structurally | false | EIS-w passes the Hecke device; the other statements are control-independent |
| R4 reaches the critical line | false | nothing here concerns the critical line |

No flag of any refereed lane was changed by this pass. Score not applicable (repair lane).

## 8. Three weakest steps

1. **Short proofs written by this referee have no referee**: the mark-slot count and the cube-part bound of
   Theorem 2 (item 1c), B' and B'' (item 4a), and the reduction (S1) to (S4) for non-monomial m (item 4c), which is a
   plan with exponents and was written quickly; its step (S2) asserts uniformity of the second-derivative test near
   the moving end of the summation range.
2. **Sources.** The journal version of Blomer-Goldmakher-Louvel and the primary text of Coleman 1990 were located
   and not opened. Theorem A and THIN stay relative to texts read in an arXiv version and in secondary quotations.
   Classical inputs (Iwaniec-Kowalski Theorem 5.3, Titchmarsh 4.13, Kusmin-Landau, Maass-Selberg) were used from
   their standard statements.
3. **Engine choices.** Closing the Landau-Siegel device for the height aspect removes it from the crossing pool; if
   a conductor-to-height transfer exists it will not be proposed until the device is reopened by hand. The outcome
   record of the Hecke lane was left as first written (refereeHolds false) while the device is closed on the
   corrected statement; the learn step has to reconcile the two. The control EIS-w lives on the modular surface and
   is not one of the Dirichlet-series controls; edges to the new node come from the tag heuristic and were not read.

## 9. Files

- This directory: `RESULT.md`, `lanes_line.json`;
  `c8-ek-theta-second-moment-formula/{REFEREE2.md, ref2_form.py, ref2_form.log}`;
  `c8-liou-row-bound-theorem/REFEREE2.md`;
  `c8-hecke-entropy-resonance-rigidity/{REFEREE2.md, ref2_hecke.py, ref2_hecke.log}`;
  `c7-probe-format-h-cap/{REFEREE2.md, ref3_blocks.py, ref3_blocks.log}`;
  `c7-laurent-shell-gamma-section/{REFEREE2.md, ref3_monomial.py, ref3_monomial.log}`;
  `outline-lane-b/REFEREE2.md`; `engine_before/`, `engine_rerun.log`, `engine_counts.json`.
- Engine: `nodes/nodes-19.json` (new), `curated/controls.json` (new), `curated/mk_devices.py`, `curated/devices.json`,
  `build_graph.py`, `merge_outcomes.py`, `ENGINE_LOG.md` (new last section), and the regenerated `outcomes.json`,
  `nodes/nodes-15.json`, `closed_families.json`, `IDEA_GRAPH.json`, `CANDIDATES.json`.
- Campaign directory: nothing written.

## 10. For the learn step

- Lane texts to correct (owed by the original lanes, listed in each REFEREE2 file): "indefinite, signature (2, 2)"
  in the (E-K) lane, its LANE_LINE and the (E-K) device evidence; the source line of Theorem A; Lemma G2, Lemma 3
  and Lemma 5 of the Hecke lane; the Abel error term in the round-7 referee file for Lemma 2.
- Set `outcomes/c8-hecke-entropy-resonance-rigidity.json` from the second referee (corrected statement holds).
- Map rows owed: a G row for the Hecke recurrence device and the auxiliary control EIS-w in map section 2 (the
  lane's proposal, with the corrections); not written here.
- Open debts after this lane: journal text of BGL; primary text of Coleman 1990; Lemma 2 for non-monomial m ((S1)
  first); outline debts 10, 2, 4; Lemma A non-principal rows (not assigned here).
