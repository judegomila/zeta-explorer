# c12-repair-sources-statement-o-v3: primary sources, second referee of three control tables, Statement O version 3, map, engine, scoreboard

Date 2026-11-19. Slug `c12-repair-sources-statement-o-v3`. Kind: repair (referee, repair and record slot of
round 12). No attack and no R4 answer (record work); no requirement score. No statement about zeros of zeta is
made anywhere in this lane. Local only: the compute server was not used. No process was signalled or stopped.
Nothing committed or pushed.

Labels: OPENED (primary text read in this lane) / CONFIRMED (re-derived here) / MEASURED / RECALLED / NOT ESTABLISHED.

## Verdict

Partial result (record). The decisive test is positive: the regular-representation closure stands, and lane
`c12-univ-pointwise-control-wcone` can build on it with three precisions (section 2).

1. **Sources.** All five were opened in the primary text. Two match the statement used (Bohr 1916;
   Kaczorowski-Perelli 1999), one matches with one hypothesis stated more loosely in the lane (Hamburger 1921),
   two do not match as cited (Huxley 1972; Bettin 2016). No verdict changes; two "relative to" labels change.
2. **Second referee.** The control tables of the three round-11 stage-A closures hold. No PROVED step is broken.
   Seven corrections (file `REFEREE2.md`), none changing a verdict or a flag.
3. **Statement O version 3** (`STATEMENT_O_v3.md` in this directory): the reader pass that the first writing
   said was missing; source labels corrected; device count 11 / 23 entered; count of labels unchanged.
4. **Map**: rows P53, G32, Q28, Z34 added; control row DEL, rows P36, Z29, O1 and section 7 edited; 182 -> 186.
5. **Engine**: three device types open -> closed on two referee files each; rerun; counts logged. Scoreboard rerun.
6. **Open owner decision** on the `euler` waiters: reported in section 6, not acted on.

## 0. Plan

Read: BRIEF to the end; ROUND_LOG round-11 results, lessons and the round-12 allocation; MAP_PENDING status;
the RESULT and REFEREE files of the three closures, of `c11-del-device-read-confirm` and of
`c11-repair-del-referee-record`; the map's control section and rows DEL, P36, Z29, G31, O1, section 7;
`engine/curated/mk_devices.py`, `controls.json`, ENGINE_LOG tail. Order as assigned, with the decisive test
(second referee of the regular-representation closure) done first. It did not kill anything; no pivot used.
Answers required of every lane (R1 to R4): none; this is a repair lane with no attack.

## 1. Referee debt: primary sources

Search terms were generic (author, title, journal). Files were fetched into empty directories under `/tmp` and
read as text or as page images; nothing from them was executed.

| source | used by | statement used | statement found (primary text) | result |
|---|---|---|---|---|
| Bettin, "On the reciprocity law for the twisted second moment of Dirichlet L-functions", arXiv:1607.05595v1 (TeX source read) | `c11-rs1-twist-modulus-reciprocity`: T-NR pass "at the centre relative to Bettin"; step S4 "at s = 1/2 + it relative to Conrey, Young, Bettin"; "the formula is stated for general coprime h, k"; remainder "analytic period-type" | exact two-term reciprocity for twisted second moments at 1/2 + it, with shifts, for coprime h, k | Theorems 1 to 3: a, q distinct primes; the central point s = 1/2; integer shifts j (pairs L(1/2 - j, chi-bar) L(1/2 + j, chi)); remainder continuous in a/q (Thm 1), C^N (Thm 3). Theorem 4, Corollary 1: any positive integer a, q prime. Corollary 2: coprime h, k, q prime, an asymptotic with error O((h + k)^(1/2) log q). Theorem 5: q prime, complex s, z: the moment of L(s - z, chi-bar) L(s + z, chi) chi(a) is a combination of Estermann functions D(s + z, 2s - 1; +-a/q) (identity of meromorphic functions; "easy to generalize to non-prime moduli", not carried out). Lemma 8, the proposition after it and Corollary 9: reciprocity of the Estermann function a/q <-> q/a for coprime positive integers, "valid also for composite a, q", complex parameter s with abs(Re s) < 1/2 in the divisor index (pair L(1/2 + s - j, chi-bar) L(1/2 + s + j, chi)) | **MISMATCH in part.** At s = 1/2 (t = 0) and at real shifts the step is available for every twist prime to p (Theorem 5 with Lemma 8): the T-NR pass at the centre holds relative to these, in Estermann form. The exact reciprocity in moment form is for primes only. No exact reciprocity for sum abs(L(1/2 + it, chi))^2 chi(a) with t != 0 is in the text. "Analytic in h/k" is not stated. Verdict of the lane unchanged (T-NR passes every step that is on file for zeta; `REFEREE2.md` T-1) |
| Huxley, "On the difference between consecutive primes", Invent. Math. 15 (1972) 164-170 (scan read, all seven pages 164 to 170) | control DEL (`c10-thin-deletion-zero-mode-control`, `c11-repair-del-referee-record`); Statement O lines 1, 5, 7; map row DEL | "asymptotic pi(x) - pi(x - x^theta) ~ x^theta/log x for theta > 7/12" | (1.1), (1.3): p_(n+1) - p_n < p_n^delta for all large n whenever delta > 7/12. (1.5): N(alpha, T) << T^(lambda(1 - alpha)) l^B, l = log T, uniformly in 1/2 <= alpha <= 1, "implies (1.1) for delta > 1 - 1/lambda" "after Ingham [2]"; (1.7), (1.8) give lambda = 12/5; (1.9), (1.10): density hypothesis form for alpha >= 5/6. No statement about the number of primes in a short interval | **MISMATCH in form.** The text supplies the density estimate and the gap bound. The counting form that the DEL lemma uses (a positive proportion of the expected primes in (y, y + y^theta]) is the intermediate statement of Ingham's deduction (Ingham, Quart. J. Math. 8 (1937), reference [2] of the paper; not opened; RECALLED: the density estimate with the Vinogradov zero-free region gives the asymptotic for theta > 1 - 1/lambda). Label changed from "relative to Huxley 1972" to "relative to S(theta); density estimate OPENED, deduction not opened" (Statement O lines 1, 5, 7; map row DEL; `engine/curated/controls.json`). The lemma needs only some theta < 1, so any theorem of Hoheisel type suffices |
| Hamburger, "Ueber die Riemannsche Funktionalgleichung der zeta-Funktion (Erste Mitteilung)", Math. Z. 10 (1921) 240-254 (scan of pp. 240, 241 read) | `c11-del-device-read-confirm` item 3 (statement (H)); map section 2 "input level"; Statement O section C and line 9 | F, G Dirichlet series converging absolutely in some half-plane, (s - 1) F entire of finite order, pi^(-s/2) Gamma(s/2) F(s) = pi^(-(1-s)/2) Gamma((1-s)/2) G(1 - s); then F = G = a_1 zeta | Satz 1: f single-valued analytic in the plane with (a) at most finitely many poles, of any order, (b) abs(f(s)) <= exp(abs(s)^gamma) for abs(s) >= r, (c) f(s) = sum a_n n^-s absolutely convergent for sigma > 1, (d) the functional equation with f on both sides; then f = a zeta. Page 241: the same under (d'): f(s) Gamma(s/2) pi^(-s/2) = g(1 - s) Gamma((1-s)/2) pi^(-(1-s)/2) with g(1 - s) = sum b_n n^-(1-s) absolutely convergent for sigma < -alpha, alpha > 0 finite: "f(s) = g(s) = a zeta(s)" | **MATCH, with one hypothesis looser in the lane**: the series for f must converge absolutely for sigma > 1 (the lane wrote "some half-plane" for both); "(s - 1) F entire" is a special case of (a). The use made of it (zeta's functional equation with integer frequencies gives a multiple of zeta) is covered |
| Kaczorowski and Perelli, "On the structure of the Selberg class, I: 0 <= d <= 1", Acta Math. 182 (1999) 207-241 (scan of pp. 208 to 211 read) | `c11-del-device-read-confirm` item 3 (statement (KP)); map row L2 | degree-one functions of the Selberg class are zeta and L(s + i theta, chi), chi primitive; in the extended class they are sums of P_chi(s + i theta) L(s + i theta, chi*) with Dirichlet polynomials | Theorem 2: for F of degree 1 in the extended class, q is a positive integer, the triple (q, xi, omega*) is an invariant, "a(n) n^(i theta) is periodic with period q", and F is uniquely sum over chi in X(q, xi) of P_chi(s + i theta) L(s + i theta, chi*) with P_chi in the degree-0 class S_0^#(q/f_chi, .) (Dirichlet polynomials, Theorem 1); (iii) the space has real dimension [q/2] + 1 if xi = -1 and [(q - 1 - eta)/2] otherwise. Theorem 3: F in S_1: if q = 1 then F = zeta; if q >= 2 then F(s) = L(s + i theta, chi) for a primitive chi mod q. The text phrases Hamburger's theorem as dim V_1^#(1, -1, 1) = 1 (with g = f-bar) | **MATCH.** Addition for the record: the P_chi are not arbitrary Dirichlet polynomials but elements of the degree-0 class of conductor q/f_chi; periodicity of a(n) n^(i theta) is stated in the theorem itself, so "in degree one FE with integer frequencies implies PER" is a quotation, not a deduction. Soundararajan's short proof (arXiv:math/0306300, TeX read) states the same with the extra hypothesis a(n) << n^eps |
| Bohr, "Zur Theorie der Riemann'schen Zetafunktion im kritischen Streifen", Acta Math. 40 (1916) 67-100 (pp. 67 to 70 read as extracted text, p. 73 as a page image) | `c11-rs3-debranges-positivity-family` variant V1c (weight family false for 1/2 < sigma_0 <= 1) | log zeta(sigma + it) is dense in the plane on a fixed line in 1/2 < sigma <= 1, with the logarithm continued from the right | Satz A: for fixed sigma_0 with 1/2 < sigma_0 <= 1, the values of log zeta(s) at the points of the half-line sigma = sigma_0, t > 0 belonging to G are everywhere dense in the plane; G is the half-plane sigma > 1/2 minus the real segment 1/2 < s <= 1 and minus the horizontal segments 1/2 < sigma <= sigma_rho, t = t_rho for each zero; log zeta is the branch regular in G that is real for real s > 1. (Satz I, Bohr-Courant, quoted there: the same for zeta itself.) | **MATCH**, statement and branch. Label of the V1c step: ARGUED rel. Bohr (RECALLED) -> CONFIRMED rel. Bohr 1916 Satz A (OPENED); argument re-derived in `REFEREE2.md` section 3.2 |

Labels changed, and only where the text was opened: (i) DEL and Statement O lines 1, 5, 7: "relative to Huxley
1972" -> "relative to S(theta)", with the chain above; (ii) twist-modulus row: "at the centre relative to Bettin"
-> "at s = 1/2 and real shifts relative to Bettin (opened); no exact reciprocity at height t != 0 in that text";
(iii) de Branges row: Bohr RECALLED -> OPENED; (iv) input-level paragraph of Statement O: Hamburger and
Kaczorowski-Perelli RECALLED -> OPENED, with the hypothesis "absolutely convergent for sigma > 1". The RESULT
files of the round-11 lanes were not edited; the changes are in `REFEREE2.md`, the map rows and Statement O.
Newly owed: Ingham 1937 (or a textbook proof of the deduction). Still not opened: Conrey 2007 and Young 2011
(read only through Bettin's introduction, which quotes both formulas for primes a, q).

## 2. Second referee on the three control tables (file `REFEREE2.md`)

Decisive first test, `c11-rs1-regular-rep-matrix-bridge`: **holds.** The E_a lift and the T-NR lift were
re-derived step by step and each passes what the table says, with these precisions:

- R-1. The E_a lift's functional equation carries the squared root-number matrix and a degree-two gamma
  factor (measured relative defect below 3e-30 at p = 7, 11); it is not M_q's own.
- R-2. The T-NR lift has its zero inside the strip only for 2 < c < p0^(1/2) + p0^(-1/2) (2.1213 at p0 = 2);
  the lane's sentence "for c in (2, 2.5)" is wrong at the upper end (Re s = 3/2 at c = 2.5), and its main check
  at c = 3 has the zero at Re s = 1.8885. The case c = 2.1 is correct.
- R-3. No single passing control keeps both log-level positivity and M_q's own functional equation: E_a loses
  the second, T-NR the first. Among ordinary Dirichlet series with an Euler product that pair is an
  identification (Kaczorowski-Perelli Theorem 3, opened). A cone statement adapted to W should be screened
  against both lifts and against the identification on the Perron slice.

`c11-rs1-twist-modulus-reciprocity`: **holds**, on T-NR and the window translate. The nine-term identity for
the twin was measured here at s = 1/2 + it and at 0.8 + 1.3i (defect below 7e-28; the lane measured s = 1 only).
T-1: the source label (section 1). T-2: the E_a row is not a pass of candidate (C) (found independently; same
as the first referee's E1). T-3: a sign in the window-translate weights.

`c11-rs3-debranges-positivity-family`: **holds.** The closure rests on the falsity of the condition for zeta
(reproduced: Re{xi(s)/xi(s + 1)} = -0.000131957293 at 1 + 282i). The lattice control passes the hypotheses of
Theorem 1 and the necessary conditions (N1), (N2), (P) (re-derived; xi'(rho)/xi(rho + 1) corresponds to
L/sinh L > 0 at every zero). B-1: Bohr opened, match.

Broken PROVED steps: none in any of the three lanes.

## 3. Statement O version 3 (file `STATEMENT_O_v3.md`; builder `mk_statement_v3.py`, 16 exact-match patches)

Base: the version-3 text of `c11-repair-del-referee-record` (which already has line 3 repaired and lines 1, 5 and
section C rows 1b, 2a rewritten against DEL). That lane wrote both the second DEL referee file and version 3 and
asked for a reader who is neither; this lane is that reader. Checked: lines 1, 3, 5 and rows 1b, 2a against the
DEL lemma (closing step re-read: the factor (s - b) from exp(-E_1(w)) = e^gamma w exp(-Ein(w)); zeta(b) finite
and non-zero on (0, 1)), against the opened sources, and against the corrected count. Changes, each marked
"(reader pass)" in the file:

- Lines 1, 5, 7 and the count paragraph: source chain of section 1 in place of "Huxley 1972, primary text not
  opened". Line 5 stays "PROVED relative to a cited theorem" (the counting statement S(theta)).
- Line 5: a "device read" field with the corrected count, 11 device types pass (6 in full, 5 in part), 23 do
  not (2 transferred only, 1 not established, 19 not formulable, 1 fails). Recounted here from `counts_v2.json`
  and `table_v2.md`; the first changed cell (P36) re-read against `e1-cofinal-legendre-dual`. Section C row 2a
  carries the count; row 3 cites P36 for E_a.
- Line 3: a note that T-NR, not E_a, keeps the degree-one gamma factor (correction R-3).
- Line 9 and the input-level paragraph of section C: Hamburger and Kaczorowski-Perelli as opened.
- Wording rule of STRATEGY section 2 kept: separate conditional statements per read class; no joint clause.

Count of labels unchanged: PROVED 4, PROVED relative to a cited theorem 1, MEASURED 1, ARGUED 6.
Replacement: map row O1 now names this file as the current text. The c9 file and the first writing of version 3
were not edited (they are other lanes' files and are cited by line number elsewhere).

## 4. Map and engine bookkeeping

Map (`apply_map.py`, `apply_map2.py`, `map_edits.json`; previous file `before/OBSTRUCTION_MAP.md`):

- New rows: P53 (de Branges shift positivity), Q28 (regular-representation matrix series with the bridge
  square), Z34 (twist-modulus reciprocity with the family-positivity device), each worded after both referee
  files; G32 (central-value squares; status cell says "author's check only").
- Landau-Siegel: the device already had row Z29 (the statement "it has no map row" in
  `c11-del-device-read-confirm` is wrong); a note was added to its defeated-by cell instead of a new row.
- P36 defeated-by cell: E_a passes every step; B fails at the logarithmic discrepancy; DEL not established.
- Control row DEL: source chain; corrected count 11 / 23 in place of 14 / 20. Row O1: reader pass and current file.
- Section 7: four rows (the corrections of section 2 and the Huxley label). Update line "eighth"; row count
  P 53, G 32, Q 28, S 12, Z 37, F 8, T 3, L 5, D 7, O 1 = 186 (recounted by pattern).
- Own error, corrected: the regular-representation row was first inserted as S13 in section 3.4; ids S belong
  to the stacking section, so it was moved to section 3.3 as Q28 (`apply_map2.py`).
- `campaign/MAP_PENDING.md`: status section for round 12 appended.

Engine (`patch_devices.py`; before-copies `engine/scratch/mk_devices.pre-c12-repair.py`,
`controls.pre-c12-repair.json`, `CANDIDATES.pre-c12-repair.json`):

- `twist-modulus-reciprocity`, `regular-rep-matrix-bridge`, `de-branges-positivity-family`: open -> closed, with
  both referee files and the map row cited in each evidence text.
- `curated/controls.json`: source field of DEL reworded (status unchanged).
- Rerun through `scripts/memcap.sh 8`: `curated/mk_devices.py`, `build_graph.py`, `generate.py --top 60`
  (twice; the second run after the controls edit gave identical counts and list).

| quantity | before | after |
|---|---|---|
| device types closed / floored / open | 33 / 1 / 3 | 36 / 1 / 0 |
| map rows parsed | 218 | 222 |
| nodes (live) | 1,655 (963) | 1,659 (963) |
| edges | 8,903 | 8,922 |
| control-defeats edges | 751 | 770 |
| crossing pool | 9 | 6 |
| generated | 44,860 | 36,558 |
| scored | 14,980 | 8,437 |
| top-60 candidates on the three devices | 36 | 0 |

Full table in `engine/ENGINE_LOG.md` ("Round 12 repair slot"). Not rerun: `merge_outcomes.py` (outcome records
are the learn step's).

Scoreboard (`campaign/scoreboard.py`, not edited): rerun after the engine and after this lane's line. Headline
unchanged (best 1 of 4). Part C: 1,659 nodes. The family count moved 41,041 -> 58,311 between the copy in
`before/` and the rerun because the tag count moved 287 -> 342 (lane lines of rounds 11 and 12 added by other
steps); that change is not caused by this lane.

## 5. Controls

No device is proposed. Controls were the object of the work: the E_a and T-NR lifts, the T-NR twin, the window
translate and the lattice were re-derived as passing; DEL's source label was corrected. Davenport-Heilbronn,
backward heat and the others: not applicable to a record lane.

## 6. Open owner decision on the `euler` waiters (reported, not acted on)

State observed read-only on 2026-11-19 (process table and the two script texts; nothing signalled):

- PID 80786 (`queue3.sh`), terminated in round 10 by another lane: gone. Its two outputs (`nest_z_wide.txt`,
  `nest_z_wider.txt`) do not exist.
- PID 90095 (`/bin/zsh ./queue4.sh`, parent 1, running 2 days 15 hours) is alive. It loops while
  `pgrep -f "queue2.sh|queue3.sh|nested.py|optnodes.py"` finds a process, then would run
  `nested.py dh 0.5 100 60`. `nest_dh_wide.txt` is empty.
- PID 94875 (a polling shell of an earlier session, running 2 days 14 hours) is alive. Its command line contains
  the text `nested.py` and it loops until `QUEUE4_DONE` appears in `nest_dh_wide.txt`.
- Consequence: the pattern of 90095 matches the command line of 94875, and 94875 waits for 90095. The two wait
  on each other; neither is computing, and neither will finish by itself.

Decision for the owner (unchanged from round-10 lesson 9a, now with the mechanism): (a) clear both waiters (no
computation is lost, none is in progress), and (b) say whether the three queued runs (two wide nested zeta runs,
one wide nested DH run of `tmp/research-2026-11-16/euler`) are still wanted; if so they should be launched
afresh through `scripts/memcap.sh` by a lane that records its own PIDs. This lane did neither.

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 | false | no argument about zeta; referee and record work |
| R2 | false | no conclusion about zeros in windows |
| R3 | false | no device; passing controls of three closed devices were confirmed |
| R4 | false | no step toward the critical line (declared in the assignment) |

aboutZeros = false. Score 0 by construction. Broken PROVED steps reported: 0.

## 8. Three weakest steps

1. **Sources read through scans and one machine summary.** Huxley, Hamburger, Bohr and the dimension formula of
   Kaczorowski-Perelli were read as page images (the introduction and last two pages of Huxley; two pages of
   Hamburger); the proofs were not read. "Huxley's text states no count in short intervals" rests on a visual reading of all seven pages (sections 2
   to 6 are the Halasz inequality, the classification of zeros and the density result). The statement that the
   count follows by Ingham's deduction is RECALLED. For Bettin the TeX source was read for statements only; the
   claim "no exact reciprocity at height t != 0" is a reading of the theorem list and of Lemma 8, not a proof
   that none can be derived from the paper.
2. **The second referee pass is on control tables, as assigned, not on whole lanes.** Lemmas S, P, Q, 1 of the
   regular-representation lane and the lattice control were re-derived; Theorem 2 and Lemma 4 of the
   twist-modulus lane, the V3b variant and the numeric screens of the de Branges lane were not. Correction R-3
   leans on the degree-one classification for ordinary Dirichlet series; for generalised frequencies (the form
   in which the T-NR lift is written) no classification is on file.
3. **Record edits rest on one lane.** The 11 / 23 count and row G32 come from a lane with no independent
   referee; here the codes were recounted and one cell re-read, nothing more. The map rows P53, Q28, Z34 are this
   lane's wording of two referee files each and were not read back by a third party. The reader pass of
   Statement O is one agent's reading; `REFEREE.md` in this directory is the author's own check.

## 9. Not done, for the planner

- Outcome record and learn step for this lane; an independent referee for `c11-del-device-read-confirm`.
- Engine device entry `central-value-squares` (proposed there; not assigned here).
- Map rows for `c11-ff-genus2-probe-jk`, `c11-ff-row-energy-four-part`, `c11-frontier-nth-order-sieve`.
- Ingham 1937; Conrey 2007; Young 2011.
- The owner decision of section 6.

## Files

`RESULT.md`, `REFEREE2.md` (second referee on the three control tables), `REFEREE.md` (author's own check of
this lane), `ref2_checks.py`, `ref2_checks.json`, `ref2_checks.log`, `STATEMENT_O_v3.md`, `mk_statement_v3.py`,
`apply_map.py`, `apply_map2.py`, `map_edits.json`, `patch_devices.py`, `engine_counts.py`,
`engine_counts_before.json`, `engine_counts_after.json`, `engine_rerun.log`, `engine_rerun.second.log`,
`lanes_line.json`, `before/` (previous map, device script and list, candidates, scoreboard, lanes, pending
file, engine log). Edited outside this directory, as assigned: `push/OBSTRUCTION_MAP.md`;
`engine/curated/mk_devices.py`, `engine/curated/devices.json`, `engine/curated/controls.json`,
`engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json`, `engine/ENGINE_LOG.md`, `engine/scratch/` (three previous
files); `campaign/MAP_PENDING.md`, `campaign/SCOREBOARD.md`, `campaign/scoreboard.json`,
`campaign/lanes.jsonl` (one line). Source files were kept under `/tmp/c12src/` only.
