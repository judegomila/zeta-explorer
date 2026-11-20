# Verification report: hexagon:2611.00460v1

Dale James Raymond, "A computer-assisted bound Lambda <= 0.107964910079 for the de Bruijn-Newman constant", 63 pages.
Claimed theorem: Lambda <= 427693072077942473661578098491 / 3961408125713216879677197516800 (= 0.107964910078771567...).

Report date: 2026-11-17. Base directory for everything cited below:
`tmp/research-2026-11-16/push/verify-0107965/`
Proof map: `PROOF_MAP.md`. Paper text: `paper.txt`. Per-part referee reports: `referee-R1.md` ... `referee-R9.md`.

Status: **replayed and partially refereed.** Not "verified".

---

## 1. Verdict

The finite computation is confirmed. The author's exact rational checker was replayed in full twice (all 15 stages, once locally on a newer runtime and once on the pinned Linux runtime), and the arc stage, which fixes the final fraction, was re-implemented independently twice from the paper's formulas and passed on all 221,010 arcs. The certified endpoint equals the claimed fraction exactly. The kernel certificates of all 67 rows were also re-proved with independent code. The analytic argument (sections 2-4 and the appendices, referee parts R1-R9) was re-derived by hand part by part, with numerical tests; no error and no missing argument was found, and no number needs to change. A list of wording-level corrections was collected.

What is not confirmed: the result as a theorem. Three things keep the status below "verified". (a) The physical approximation at probe heights up to 6 (Prop 3.2 and eq (26)) is not proved inside the paper; it sits in prose notes in the packet that extend the author's earlier analytic preprint and Polymath's sec 6 beyond their published range, and no checker stage tests it. A referee pass found the notes complete when read together, but this is the one step that is both new mathematics and outside all machine checks. (b) The bound depends on the OpenAI zero-free half-plane Re s > 7/8, which is machine-checked in Lean but unrefereed, and on cited literature (Platt-Trudgian, Polymath 15, Arias de Reyna, de Bruijn) taken as published. (c) Each analytic part had one referee pass by an AI agent with floating-point tests; that is a careful reading, not an independent formal proof.

What the bound depends on: the 7/8 theorem (start strip y^2 <= 9/16); Platt-Trudgian's verified height 3000175332800 (essential in Prop 2.4 and in the main term L = log(X/4pi)/4); the source theorem (Thm 3.1) to full precision, because the flow certificate carries no slack beyond 1e-12.

---

## 2. Table by part

| Part | Verdict | What was checked | Problems |
|---|---|---|---|
| Checker replay (finite computation, Prop 4.3 and the other 14 stages) | verified | All 15 stages exit 0 locally (199 s; CPython 3.15.2, python-flint 0.9.0, macOS arm64). Arc stage: 221,010 arcs, 5,797,314 exact checks. Endpoint equals the claimed fraction. Transcript sha256 e7951651ea66bc7b... equals the author's. Own re-implementation of (91)-(93) from the paper text: all 221,010 arcs with exact rationals, 0 failures; 2,978 arcs repeated with stdlib Fractions. Coverage of [0, T] and of the 67 row cells exact. Rounding direction correct on every arc. 19 mutants rejected as expected. | No failure. Source-ledger changes are invisible to the arc stage alone (by design; caught by the sha256 pin and the direct-source stage). Zero numerical slack by construction (rate margin 5.13e-30 on every arc). One non-enclosing `max()` of two Arb balls in `check_retained_39_heads.py` line 163; a strict variant passes. |
| Dependencies and relation to known results | gap | 7/8 normalisation and the 9/16 seed re-derived. Lean declaration matches. Platt-Trudgian use located and its clearance recomputed. No number imported from the earlier chain. Rates compared with this project's F2 flow and with the class ceiling on all arcs (floats). | Prop 3.2 / eq (26) rest on packet prose notes extending the earlier Analytic Foundations preprint; note 08 still prints 5/6. Local Lean build is at commit adc7f1241, not the paper's pin fd4aeeb2. |
| R1 Initial strip, normalisation, startup (sec 2.1, 4.4, 5.1) | verified with corrections | Lean statement read; normalisation compared with Polymath and tested numerically; zero map; de Bruijn contraction; startup gap (102) recomputed exactly. | Wording only: "s != 1" in (14)/(107) is not in the Lean theorem; missing sentence identifying Mathlib's `riemannZeta` with the zeta of eq (7); "used twice" miscount; Q_0 / q_init naming. |
| R2 Wall and Platt-Trudgian localisation (sec 2.2) | verified with corrections | Guards (19) in Arb; Lemma 2.2 re-derived; all 2,763,952 prefix inequalities replayed with own interval code (0 failures); error budget; 11/12 constant; Prop 2.3 tested directly at 15 points from zeta; Prop 2.4 re-derived. | No error. Attribution of E_C; the 11/12 corrects a slip in Polymath's published Prop 6.4 proof; missing t = 0 continuity line; two harmless over-charges; Prop 2.3 proves more than it displays. |
| R3 Zero dynamics and first-contact comparison (sec 2.3-2.5, 4.1-4.2) | verified with corrections (conditional implication) | Zero ODE, Lemmas 2.5, 2.6, 2.8, 2.9, Prop 2.7, Thm 2.10, Lemmas 2.11, 4.1, 4.2 re-derived; listed failure modes searched; numerical tests on polynomial models and on H_0. | No gap. Six wording corrections (K_h at b = y, explicit Poisson kernel, hypotheses of Prop 2.7, first-instant contact, regrouping of the paired sum, miscount of uses of Thm 2.1). |
| R4 Physical approximation at heights up to 6 (sec 3.2, Prop 3.2, App C.1-C.2, packet notes) | verified with corrections | Re-derived from Polymath sec 6.1-6.2: validity for real parts in [-3, 4], the 11/12 constant, all scalar fees, monotonicity in x. Total remainder computed from xi at x about 2e3 and 3e4 (30 cases, ratio 0.41-0.64 against the claimed 2). Plan guards (52) exact on all 67 rows. | No error. Prop 3.2 is not proved in the paper (C1). An omitted remainder term inherited from Polymath sec 6.2, negligible (C2). Missing t = 0 limit (C3). Wall script inserts a `/tmp` path into `sys.path` (C5). |
| R5 Finite model algebra and native debit (sec 3.3-3.5, App A, C.3-C.4) | verified with corrections | Lemma 3.3, (61)-(72), (108)-(110), Lemma A.1, Props A.2, A.3 re-derived. Stages native, activation, spectral, affine replayed. Exact recomputation for all 67 rows and 469 heights. Direct model tests, 0 violations. | No error. Six expository corrections (Lemma 3.3 for d~; an unstated adjacent-integer inequality in (108); a double charge; variable naming; "sup" not attained; quasi-convexity of the reflected branch). |
| R6 Arithmetic credits (sec 3.6, App D) | verified | App D.1-D.4 re-derived. Stages heads28, heads39, overlays, arithmetic-credit-map replayed. Own exact recomputation of capacities, SOS shapes, Gram bounds, sign branches. Adversarial search over 564 prime angles: 0 violations. | None. Presentation notes only. The final retained payment (76) is certified by the overlays stage, not heads39. |
| R7 Jet rows and source assembly (sec 3.7, 3.9, App B, C.5) | verified with corrections | Cauchy bound (78), (79)-(81), (117), assembly (119)-(122) re-derived. Stages overlays and direct-source replayed. Three jet records recomputed from raw tables. Row-44 Sturm step done independently. End-to-end test on H_0 for row 0. | No error. Gate counts in sec 3.7 differ from the shipped consumer's output; overlays does not bind jet data to the final plan (covered by direct-source); Sturm routine lacks two assertions. |
| R8 Kernel certificates (sec 3.8, Thm 3.4) | verified | Formulas and Lemma 2.6 re-derived. Kernel stage replayed, 67 rows. Independent re-implementation: Bernstein tensors equal the packet's entry by entry (324,379 entries); positivity re-proved by own subdivision; O_pair' > 0 on [0, cap] by Sturm sequences for every row. | None. "29 certified cells" for row 44 is 15 leaves. Caps are binding (inequality false at 1.05 x cap for rows 0-56). |
| R9 Exact flow and full replay (sec 4.3-4.8, 5) | verified with corrections | Second independent exact replay of all 221,010 arcs (stdlib Fractions only). Pade bound (95)-(96), Newton identity (98), Lemmas 4.1-4.2 re-derived. Full 15-stage replay on the pinned runtime (CPython 3.12.3 Linux, python-flint 0.8.0 / FLINT 3.3.1): all pass, same transcript hash. Bundled runtime byte-identical to the PyPI wheel. | No error. Sec 4.5 prints the maximum rate with a wrong last digit. Robustness: a 1e-2 absolute loss in the source bounds breaks the kernel caps. |

Tally: 3 parts verified (checker replay, R6, R8); 7 verified with corrections (R1, R2, R3, R4, R5, R7, R9); 1 gap (dependencies / self-containedness of Prop 3.2). No part refuted.

Note on two statements in the findings that look inconsistent and are not: the first replay ran locally on a non-pinned runtime; the R9 replay ran on the compute server (through `rhrun`, 8 GB, 4 cores) on the pinned runtime. Both produced the author's transcript hash. The dependency lane's remark that "only 820 of 221,010 arcs have been replayed exactly" quotes the proof map as it stood before the two full replays and is superseded.

---

## 3. Gaps and errors, with location and repair

No mathematical error was located. Items are ordered by weight.

### 3.1 Substantive

**G1. Prop 3.2 and eq (26) are not proved in the paper.**
Location: sec 3.2 (Prop 3.2), sec 2.2 eq (26)-(27), App C.1-C.2; packet notes `08_BROAD_HEIGHT_SOURCE_EXTENSION.txt` (lines 127, 134, 160 print 5/6 and a 0.02 displacement), note 06 sec 2, `HEIGHT_SPECIFIC_OLD_COMMON_PHYSICAL_SOURCE_V1`.
What is missing: a single written proof that H_t/B_t is approximated by the finite model for all x >= X - 2 at heights up to 6.01 (real parts in [-2.505, 3.505]). The paper refers to "the physical-source supplement"; the notes extend the earlier Analytic Foundations preprint from heights <= 2.41 and extend Polymath Prop 6.1 / sec 6.2 beyond the published range 0 <= y <= 1.
State after refereeing: R4 re-derived the statement from Polymath's printed proofs and found the three notes complete when read together, with 11/12 in place of 5/6.
Repair: put a consolidated proof in the paper with the 11/12 constant and the 2-unit displacement, correct note 08, and include the patches G2 and G3.

**G2. Dropped remainder term inherited from Polymath sec 6.2.**
Location: the Riemann-Siegel remainder sum used in Prop 3.2 (Polymath sec 6.2). For u < 0 with floor(-u) + 3 < floor(T'/pi), the term (1/2)(9/10)^{ceil(-u)} Gamma((K+1)/2)/(a/1.1)^{K+1}, K = floor(T'/pi), is outside the displayed sum.
Repair: add it; it is below 0.446^{a^2} with a^2 > 4.7e11, far inside the 1e-100 allowance.

**G3. Endpoint t = 0.**
Location: Prop 2.3 (stated on [0, 41/250]) and Prop 3.2 (rows closed at t = 0); Polymath's expansion is for 0 < t <= 1/2.
Repair: one sentence: non-strict bounds, locally uniform convergence of H_t as t -> 0+, N constant by (19). Note 08 has it; the paper does not.

**G4. No checker stage tests the analytic approximation.**
Location: `check_wall_and_physical.py`, the affine and overlays stages. Constants typed in from prose: e_0 = 5e-7, e_1 = 5e-5, 5.5e-12, moments 6/22/180, 0.2, 0.029, 229/1000.
Effect: all physical caps, kappa and the refunds (up to 0.0032 of a 0.0105 native debit in row 0) depend on Prop 3.2.
Repair: none by code alone; state in the paper which constants are analytic inputs and where each is proved. R4 recomputed the scalars independently and found them on the safe side.

**G5. External input is unrefereed, and the local build is at a different commit.**
Location: eqs (14)-(15), (107), sec 5.1. The Lean replay available here is of openai/math at adc7f1241 (the paper's "external rebuild" commit), not the pinned fd4aeeb2.
Repair: rebuild at fd4aeeb2, or record a diff showing the 2924 closure modules are unchanged between the two commits.

**G6. Zero slack.**
Location: FLOW data, sec 4.5-4.6. Rate margin 5.13e-30 on every arc; every q_1 is the next 2^-96 grid point; kernel caps bind (minimum clearance 21059999/10^12).
Effect (measured in floats): a uniform loss of 1e-3 in the source bounds moves the endpoint to about 0.1079714; a loss of 1e-2 exceeds the kernel cap at row 27; a 1% relative loss fails at row 1.
Repair: not an error. Any later correction to Thm 3.1 of that size needs new caps and a new flow. A sentence in the paper stating this sensitivity would help readers.

### 3.2 Checker hardening

- `check_retained_39_heads.py` line 163: Python `max()` on two Arb balls. Replace by the maximum of the two upper endpoints (strict variant passes all 39 rows).
- `check_wall_and_physical.py`: inserts `/tmp/lambda_publication_flint_runtime` at the front of `sys.path` and reads an absolute `/workspace` path. Remove both.
- Overlays stage: does not bind the jet (alpha, p, b) to the final plan; iterates the row-44 critical-value list with `zip` without a length check. Add the binding and the length check (currently covered only by direct-source).
- Sturm routine: assert the polynomial is squarefree and nonzero at its evaluation points (both hold for the data).
- Row 0 analytic height 2 and radius 1 are literals in two scripts; read them from the certificate.
- Interfaces stage reads the arc stage's row dump, which is written before the arcs are checked. Read the result file instead, or state that only a full `--all` run is a valid receipt.
- State in the guide that the final retained payment (76) is certified by overlays, and that overlays and direct-source must be run together.
- heads39 checks L0 + omega < 27; the paper states L0 + log(1+V) < 27. Align the text.
- Activation checker: add the test V+ - v0 > 1/N0 used implicitly in (108).

### 3.3 Text corrections (no number changes)

- (14), (107): drop "s != 1" or note that the Lean theorem has no such exclusion.
- Sec 2.1: add one sentence that Mathlib's `riemannZeta` is the zeta of eq (7) on 7/8 < Re s <= 1 (analytic continuation).
- Sec 2.1: "Theorem 2.1 is used twice" is wrong. It is used at startup, in the rectangle bound of Prop 2.4 / Lemma 2.8, and in the terminal cleanup; the referees counted three (R1) and four (R3) uses.
- (10) / (99): Q_0 and q_init are the same value; use one name.
- Sec 2.2: cite Polymath Prop 6.4 / Thm 1.3 for E_C on the wall (real parts in [0,1]); the "broad-height transfer" is not needed there.
- Sec 2.2 / App C: say that 11/12 corrects a slip in Polymath's published proof of Prop 6.4 (the bound of 1/(12(T'/2 - 0.33)) by (1/3)/(4(T - 3)) is false; the constant is 2/3), not only an earlier note of the author.
- (28) and (57): the "positive correction t pi^2/32" does not occur; the reserve is slack.
- eps_gamma: the term T_w A_alpha / X has no stated source.
- Prop 2.3: state the proved form Re(e^{-i phi} H/B) > 697/900.
- (28): define K_y(d, y) = 2y/(d^2 + 4y^2) for d != 0.
- Lemma 2.6: state the explicit strip Poisson kernel and cite uniqueness of bounded harmonic functions on a strip.
- Prop 2.7: list the hypotheses (probe heights above y; (32) at this y; d = 0, b = y excluded because the contact is simple).
- Sec 2.4 / 4.2: state in one place that a contact cannot occur at the first instant of an arc.
- Zero ODE: one line on absolute convergence after regrouping into conjugate pairs.
- Lemma 3.3: expand the proof for d~.
- (108)/(109): the term (t+ v0/2 + h) delta is charged twice; (108) omits the adjacent-integer change of (v0 + w)/2.
- Sec 3.4: the power series are in u = s + delta. "sup A = 2" is a limit.
- Reflected branch: the summand is quasi-convex in log n, not monotone in n, for s > 2d/t.
- App D.2: state why checking band phases at extreme (x, t) suffices; state that lower capacities hold at c = c0 and are transported by mu(c - c0).
- Sec 3.7: gate counts 4128 / 8363 / 4215 should read 4175 / 8281 / 4257.
- (80): one h_0 is used for two quantities that the code allows to differ.
- (117): normaliser charged 1e-10 where 2e-12 is proved (safe).
- Sec 3.8: row 44 has 15 leaves, not 29 cells. Thm 3.4: "strictly increasing".
- Sec 4.5: maximum rate 22.6946264087, not ...088.

---

## 4. What was not checked

**External inputs.**
- The proof of the 7/8 theorem. No Lean build was run in this task; existing local logs were re-counted. Mathlib was not re-elaborated.
- Identity of the proof subtree between commits fd4aeeb2 and adc7f1241.
- Platt-Trudgian's computation (only the arXiv v1 wording of Theorem 1 was read).
- de Bruijn's Theorem 13 (taken from Polymath Thm 3.2).
- Polymath Thm 1.5(i), Prop 3.1, Prop 6.6 (i)-(iii),(vi) line by line; Arias de Reyna's Riemann-Siegel bounds; Boyd's Stirling remainder; |C_0(p)| <= 1/2.
- Correctness of FLINT/Arb and CPython. The arc stage and the kernel positivity are covered independently of FLINT ball arithmetic; the other stages are not.

**Analytic parts.**
- Prop 3.2 was tested numerically only at x about 2e3 and 3e4, not near X = 6e12; the wall (Prop 2.3) was tested at 15 points at X.
- The wall remainder scalars for real parts in [-1, 2] (constants 229/1000 and 110) were not recomputed.
- Uniform convergence in eq (39) for the actual H_t; the zero ODE and Lemma 2.6 on H_t with t > 0 (tests used polynomials and H_0).
- End-to-end numerical test of the source bound exists for row 0 at t = 0 only; rows 16 and 44 and all t > 0 have none.
- Whether the paper's functional lies inside the same-height-lattice class behind the 0.096 floor.
- Whether the 39 retained rows' node lists carry any unstated analytic premise from the earlier plan.
- The earlier preprints (0.116398, 0.149396, 0.156821) were not read.

**Rigour of the referee work itself.**
- Own numerics in R1-R7 are high-precision floating point or float64, not outward-rounded intervals (exceptions: R2 prefix inequalities, R8 kernel positivity and Sturm steps, both arc replays, exact Fraction recomputations in R5-R7).
- Each analytic part had one referee pass by an AI agent. No second independent human or formal check.
- Term-by-term Arb recomputation in R5 covered 5 of 469 heights; relation-constrained attack in R6 searched all sign branches for 3 rows only.

**Checker.**
- No independent re-implementation of the 12 stages other than arcs, compact-arcs and kernel; they were read and replayed with the author's code.
- Mutations were applied to arc-stage inputs, two direct-source inputs and one kernel row. Native and activation tables, head and phase certificates were not mutated.
- Not run: `Verify_Deposit.py`, `verify_bundle.py`, the packet's `run.py` as shipped, `verify_physical_debit_map.py` (R7), the author's wall stage outside the two full replays.
- No `REPLAY_RECEIPT.json` was produced; per-stage exit codes are in `runs/full-replay/STAGES.txt`.
- Peak memory per stage was not measured (none exceeded the 8 GB cap).

---

## 5. Feedback note for the author

> Dear Dale,
>
> Thank you for sharing 2611.00460v1 and the packet. Here is what we did and what we found.
>
> **Replay.** All 15 stages pass on the pinned runtime (CPython 3.12.3, python-flint 0.8.0, FLINT 3.3.1) and on CPython 3.15.2 / python-flint 0.9.0 on macOS arm64. The arc stage reports 5,797,314 checks and the uncompressed transcript hash matches yours. Two independent re-implementations of conditions (91)-(93), written from the paper text (one with stdlib Fractions only), pass on all 221,010 arcs and reproduce the endpoint fraction exactly. An independent Bernstein/Sturm re-proof of Theorem 3.4 passes for all 67 rows. 19 mutation tests were rejected as expected.
>
> **Analytic reading.** Sections 2-4 and Appendices A-D were re-derived part by part. We found no error and no number that needs to change.
>
> **Main request.** Proposition 3.2 and eq (26) are not proved in the paper. The argument is spread over packet notes 06, 08 and HEIGHT_SPECIFIC_OLD_COMMON_PHYSICAL_SOURCE_V1, and note 08 still prints 5/6 (lines 127, 134, 160) and a 0.02 displacement. Read together they are complete, but this is the one step that is new mathematics and outside every checker stage. A consolidated proof in the paper would close it. It should include: (i) the t = 0 limit (Polymath's expansion is for t > 0); (ii) the remainder term for u < 0 with floor(-u)+3 < floor(T'/pi) that Polymath sec 6.2 drops (it is below 0.446^{a^2}, negligible); (iii) a statement that 11/12 corrects a slip in Polymath's published proof of Prop 6.4 (the Stirling term bound with 1/3 should have 2/3).
>
> **Checker.**
> 1. `check_retained_39_heads.py` line 163 takes Python `max()` of two Arb balls; use the maximum of the upper endpoints (it passes).
> 2. `check_wall_and_physical.py` prepends a `/tmp` path to `sys.path` and reads an absolute `/workspace` path.
> 3. The overlays stage does not bind the jet data to the final plan and zips the row-44 critical values without a length check; only direct-source covers this.
> 4. The Sturm routine should assert squarefreeness and nonvanishing at its evaluation points.
> 5. The interfaces stage reads the arc stage's row dump, which is written before the arcs are checked.
> 6. The constants e_0, e_1, 5.5e-12, 6/22/180, 229/1000 are literals; a table mapping each to its proof would help.
>
> **Text.**
> - (14), (107): the Lean theorem has no "s != 1" exclusion. A sentence identifying Mathlib's `riemannZeta` with the zeta of eq (7) is missing.
> - Sec 2.1: Theorem 2.1 is used more than twice (startup, Prop 2.4 / Lemma 2.8, cleanup).
> - Sec 2.2: for the wall, Polymath Prop 6.4 applies as published; the broad-height transfer is not needed there. The "positive correction t pi^2/32" in (28) and (57) does not occur.
> - (28): K_h(d,b) is used at b = y but defined only for h > b. Lemma 2.6: state the explicit Poisson kernel and cite uniqueness.
> - Prop 2.7: list the hypotheses. State in one place that no contact occurs at the first instant of an arc.
> - Lemma 3.3: the d~ case needs two more lines. (108) omits the adjacent-integer change of (v0+w)/2 (covered by V+ - v0 > 1/N0, which is neither stated nor tested).
> - Sec 3.7: the gate counts are 4175 / 8281 / 4257 in the shipped output, not 4128 / 8363 / 4215.
> - Sec 3.8: row 44 has 15 leaves, not 29. Sec 4.5: the maximum rate rounds to 22.6946264087.
>
> **Observation.** The flow has no slack beyond eta (rate margin 5.13e-30 on every arc) and the kernel caps bind. In float experiments an absolute loss of 1e-2 in the source bounds leaves the caps. A sentence on this sensitivity would be useful to readers.
>
> **Scope of our check.** We did not re-verify the 7/8 theorem, Platt-Trudgian, or the cited Polymath and Arias de Reyna results, and our analytic reading is a single pass with floating-point tests. We therefore describe the paper as replayed and partially refereed, not as verified.
>
> Best regards

---

## 6. Relation to this project's 0.116091 and to the benchmark 0.2

**Benchmark.** The accepted published bound is Lambda <= 0.2 (Platt-Trudgian 2021, from Polymath 15's 0.22). It uses the verified height only. Both 0.116091 and 0.107965 are below it only because they add the unrefereed 7/8 zero-free half-plane and the Raymond decreasing-barrier mechanism. Neither replaces 0.2 as an accepted result.

**This project's 0.116091** (`papers/lambda-qrh-0.116091/paper/main.tex`): an upper bound that depends on two unrefereed results, the 7/8 theorem and Raymond's earlier chain, plus this project's internal floor and kernel certificates. Same X = 6000000185827 and N = 690988, same 9/16 start, same class of argument (Lemma 2.6 of the new paper is the same statement as the project's Theorem C).

**Comparison (measured, floats, all 221,010 arcs against all 59,439 F2 substeps).**
- Rates are in the same units (q' = -2 - r q). First rate: paper 12.381, F2 11.008, class ceiling 14.374.
- At equal q the paper's rate is 1.118 to 1.192 times F2's (median 1.151). The time lead grows to 0.00813 at the last row, which is the difference between the two bounds.
- The paper's rate is 75.2% to 86.1% of the ceiling rate (2yL coth(yL) - 2)/q; no arc exceeds it. F2 is at 63% to 77%.
- Class floor from 9/16 at this X: log cosh(3L/4)/L^2 = 0.096223. The paper sits 11.74e-3 above it; F2 sits 19.87e-3 above it.
- 0.107965 is consistent with the project's earlier estimates: above the refined 0.103-0.104 and close to the "signed probes on every cell" estimate 0.1085.

**Where the gain comes from.** Signed multi-node probes on every row (8 to 26 nodes, negative weights on all 67 rows, heights 1.22 to 6.0); far-field moment saturated (sum w*h between 1.99717 and 1.99980 against 2); arithmetic credits from actual prime phases; three jet rows; own-pair term subtracted once; start offset 1e-12 against 1e-7; step 1/2048000 against 1/512000.

**Consequences for the project.**
- If the new paper stands, 0.116091 is superseded as a value. It remains an independent derivation in the same class with weaker requirements (probe heights 0.91 to 1.88, inside or near the published Polymath range), so it does not need the height-6 extension of G1.
- The new paper does not cite the earlier chain's numbers, so an error there would not propagate directly; the dependence is through the analytic notes behind Prop 3.2.
- A value below about 0.0962 is not reachable in this class at this X and this start. It needs more verified height, a smaller start strip, or information outside the class.
- Both bounds are conditional on the same unrefereed 7/8 theorem and stay labelled as such.
