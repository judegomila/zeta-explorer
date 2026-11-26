# Key results: ranking after two-stage stress test

Date: 2026-11-21. Source: 22 items from `src/data/key-results.js`, each with a first review (`<id>/VERDICT.md`, `NOTES.md`) and an independent referee pass (`<id>/REFEREE.md`, `<id>/referee/` or `<id>/ref/`). All 22 items have a final verdict; none failed. Scores and labels below are the referee's final values.

Scales: arbitrariness 1 (canonical, no choices) to 5 (truth value or headline number fixed by project choices). Importance 1 (no consequence outside the project) to 5.

Summary of the outcome:

- No item scored importance above 2. The tier "holds and matters" is empty.
- 4 items are "confirmed" as stated (toeplitz-krein, semilocal-sonine, zero-traps, c-glob). For c-glob this applies to the statement with the minimal-gap hypothesis, which the listed wording omits.
- 14 items are "confirmed-weaker-statement", 3 are "partly-confirmed", 1 is "refuted".
- No item gives new information on the location of zeta zeros. No item changes a refereed bound on the de Bruijn-Newman constant.
- In every case where a Davenport-Heilbronn (DH) or twist control was applicable, the result held equally for the control or separated it only through zero location itself.

## (a) Ranked table

Ranking criterion: what survives, in the order verified, then non-arbitrary, then consequential. Ties in scores are broken by verification grade, then by whether the surviving content is absent from the literature.

| Rank | Result (id) | Status label | Verification | Novelty | Arb. | Imp. | Reason |
|---|---|---|---|---|---|---|---|
| 1 | Toeplitz/Krein certificate for pole-free Weil positivity (`toeplitz-krein`) | interval-arithmetic certificate | confirmed | certificate of known fact | 2 | 2 | Arb certificate W(h) >= 8.2045e-4 ||h||^2 on the pole-free subspace for 2a <= ln 3; reproduced by two independent non-rigorous methods (infimum about 9.44e-4). Full form (smallest eigenvalue 5.5e-8) not covered; positivity holds with the prime removed (margin 0.0825). |
| 2 | Semilocal Sonine trace identity for S = {oo, 2} (`semilocal-sonine`) | proved in notes, unrefereed | confirmed | known in different form | 2 | 2 | Identity checked end to end for two test functions (1e-7, 1e-6 relative). It is the published semilocal trace formula (Connes-Marcolli Thm 2.36; arXiv:2611.13129 Thm 8.1) with the Connes-Consani split; project content is the explicit remainder delta_S with log singularities at 2^k. |
| 3 | Finite Lee-Yang stage theorem and Lean circle theorem (`lee-yang`) | Lean-checked | confirmed-weaker-statement | formalisation of known fact | 3 | 2 | Lean proof of the multivariate circle theorem (407 lines) and the stage corollary compile with standard axioms; a formalisation was not found elsewhere. The "44 theorems, 2576 lines" figure is an eight-file batch total. No zeta content. |
| 4 | Zero channels (`zero-traps`) | interval-arithmetic certificate | confirmed | certificate of known fact | 2 | 1 | N(2000) = 1517, all simple and on the line, confirmed by four routes, all rigorous ones sharing Arb's zeta. Follows from two Arb library calls in about 3 s; nine orders of magnitude below Platt-Trudgian. |
| 5 | Closed form for c_glob (`c-glob`) | proved in notes, unrefereed | confirmed | not found in literature | 3 | 1 | Threshold 0.8980208880762338 confirmed by three code paths, one digamma-free (agreement 1.9e-12). Holds only with the minimal-gap hypothesis; without it the infimum is 0. No arithmetic input. |
| 6 | Route I stops at ln 2 (`route-i-ln2`) | obstruction / negative result | partly-confirmed | not found in literature | 3 | 2 | Cusp fraction 1 - 2^-k proved and confirmed. Growth of E_S o Q is numerical with a truncated corr term. Recorded top eigenvalue wrong (1 - lam^2 = 5.18e-6, not 5.38e-5); corr(ln 2) = 2.776, not 1.458. One sufficient condition of one transcription fails. |
| 7 | Pole of zeta and Riesz-type truncations (`pole-riesz`) | interval-arithmetic certificate | confirmed-weaker-statement | minor variation | 3 | 2 | Six off-line zeros at height 8.55e11 and four Liouville sign thresholds certified by two independent codes. General statement unrefereed with non-explicit N_0(k). Classical Turan/Haselgrove mechanism; holds for all unimodular twists. |
| 8 | Lambda <= 0.116091, conditional (`lambda-0116`) | conditional | confirmed-weaker-statement | minor variation | 4 | 2 | The finite implication reproduces to the last digit by three code paths. 0.116091 needs three unestablished blocks, not two; with two it is 0.118506. Public neighbour 0.116398 (10 Oct 2026) and lower public value 0.107965. |
| 9 | Lambda <= 0.1758354 by y-transfer (`y-transfer-01758`) | interval-arithmetic certificate | partly-confirmed | minor variation | 4 | 2 | Binding lane minima reproduced by two independent codes; termwise defect about 1e-11 against budget 2.4958e-4. The 5,309,013-window lane sweep, full y-Dini run, barrier, tail and native-binding lemmas are unverified. Unrefereed candidate. |
| 10 | Pick positivity for K <= 12 and anchor Hankel pair (`pick-hankel`) | interval-arithmetic certificate | confirmed-weaker-statement | known in different form | 4 | 2 | DH Hankel pivots (75, 110 / 75, 109) confirmed by a different algorithm. K-node certificate replayed only through the project's script. Failure order 149 is for the jet matrix and near-centre nodes; other node sets give 153-164 or none through 170. |
| 11 | Twistor duality and the dual intertwiner (`twistor`) | interval-arithmetic certificate | confirmed-weaker-statement | minor variation | 4 | 2 | Pages are illustrations. Established: ||H_{1/4,L}|| <= 49999/50000 for 1 < L <= 3/2 (mpmath interval arithmetic), rebuilt independently in floating point. DH satisfies the same inequality numerically (0.880). |
| 12 | Obstruction map (`obstruction-map`) | obstruction / negative result | confirmed-weaker-statement | known in different form | 4 | 2 | Control facts reproduce. It is a catalogue (234 rows), not a theorem; the score is 0 on all 220 lanes by rule; the "wall" was fixed at 123 rows and used as the filter for the next 111. No row verdict replayed. |
| 13 | T3 is a zero-free strip statement (`t3-zero-free-strip`) | proved in notes, unrefereed | confirmed-weaker-statement | known | 2 | 1 | Correct and canonical, and a corollary of Lagarias 2005 / de Branges. "1e-30" checks only the angle-addition formula. Fixed-a "iff" has an aligned-pair exception. |
| 14 | Gaussian proxy is de Bruijn flow at negative time (`gaussian-proxy`) | numerical evidence | confirmed-weaker-statement | known | 2 | 1 | Identity is the Polymath15 heat-kernel formula at t < 0. The implemented proxy convolves Z, not Xi, and matches the exact flow only up to a shift of about 1.45 tau. |
| 15 | Flow-blindness no-go (`flow-blindness`) | proved in notes, unrefereed | confirmed-weaker-statement | known in different form | 3 | 1 | Contrapositive of Lambda >= 0 (Newman 1976 suffices for closed classes). "Arithmetic input required" does not follow. The properties with proved closure were already classically insufficient. |
| 16 | PR-48 residual target is the Weil functional (`pr48-weil`) | proved in notes, unrefereed | confirmed-weaker-statement | known in different form | 3 | 1 | Identity holds (Arb, 1e-34 to 1e-49 absolute). Lean proves the Pick/Schur equivalence only, not the Weil identity or the RH link. |
| 17 | Anti-bridge reflection and square factorisation (`anti-bridge-square`) | obstruction / negative result | confirmed-weaker-statement | known in different form | 3 | 1 | Grommer/Stieltjes/de Branges criteria restated. A positive square exists iff RH. Order-100 positivity reflects about the first 50 zeros. The arXiv:2611.06705 link is unsupported. |
| 18 | Bridge shear and bridge energy (`bridge-shear`) | proved in notes, unrefereed | confirmed-weaker-statement | known in different form | 3 | 1 | Identities replay to 1e-23..1e-44. Content is Sondow-Dumitrescu and Hermite-Biehler in other variables, a retraction of an internal error, and one 2x2 certificate that is also positive for DH. |
| 19 | What binds Lambda <= 0.2 (`pt-floor`) | numerical evidence | confirmed-weaker-statement | known | 4 | 1 | Weak form is Polymath15 section 10. Strong form ("only height helps") fails: main-term corner test passes near 0.183 with the Euler-5 mollifier at the same height. |
| 20 | Zeta on the torus, sphere and Klein surface (`observatory-surfaces`) | visualisation | confirmed-weaker-statement | certificate of known fact | 4 | 1 | Display plus three local certificates of known or routine facts. The certified window |tau| <= 0.05 is 1/24 of the true one. |
| 21 | Catalan signed ladder (`catalan-ladder`) | withdrawn or wrong | partly-confirmed | known in different form | 4 | 1 | Two identities correct. "Forced pi-column" is false; the 5-generator count also occurs for the solved conductor-3 case. |
| 22 | Hidden-square program and ||V|| <= 1 (`hidden-square`) | withdrawn or wrong | refuted | known in different form | 5 | 1 | ||V|| <= 1 fails for a >= 31.6214; not equivalent to K_a >= 0 in either direction; holds for DH where K_a fails. |

Tiers used in `ranking.json`: "holds and matters": none. "holds, limited consequence": ranks 1-3. "holds, mainly internal": ranks 4-5. "weakened": ranks 6-20. "not established": ranks 21-22.

## (b) What did not survive or was weakened

Every item except `toeplitz-krein`, `semilocal-sonine` and `zero-traps` had its listed statement changed. Those three keep their statement but carry framing corrections, listed at the end.

### Refuted or wrong as listed

- **hidden-square.** Listed: seven-plus conjectures reduce to ||V_{a,Phi}|| <= 1 for every a > 0. Corrected: G/2 <= ||V|| <= G; ||V|| <= 1 holds exactly for a <= a* with 31.6213 < a* < 31.6214 (lane Arb certificate, not rerun; two float/mpmath replays). ||V|| scales as c^2 under Phi -> c Phi while K_a >= 0 is scale-invariant, so the equivalence fails both ways. DH kernel: ||V|| = 0.012 to 0.074 on the band a < 0.617 where its K_a is indefinite. The app identity K_a = K_diag + shear is false: main(z,z) = -9.04e-8 at z = 26.5 + 5i, a = 0.5. Conjectures 15.1, 16.4, 16.6, 17.3, 18.1, 25.2, 25.3 are separate phrasings of the Hermite-Biehler form of RH. `/collapse-chain` still states the false RH-equivalence.
- **catalan-ladder.** Listed: period-dimension obstruction (2 versus 5) with a forced pi-column. Corrected: (a) the double integral with kernel 1/(1-xy) equals 5 zeta(2) - 8; (b) with kernel 1/(1+x^2y^2) equals G - pi + 2 ln 2 + pi^2/12. 5 is an upper bound on a span dimension. The conductor-3 kernel gives 5 generators as well and L(2,chi_{-3}) is proved irrational. Pi-free values exist: G - 3 + 3 ln 2 in the page's own kernel family; Zudilin 2003 forms in {1, G}. Known forms fail by decay 2.406 against denominators about 6.77 (proved bound 8.77).

### Weakened: bounds on Lambda

- **lambda-0116.** Listed: Lambda <= 0.116091 conditional on two unrefereed results. Corrected: with H1 (zero-free Re s > 7/8, unrefereed), H2 (Raymond chain, unrefereed), H3 (Platt-Trudgian) the value is 0.118505710922701. 0.116091488672439 also needs H4, the project's 468 floors and 59 kernel rows; 89 floor entries (11,304 of 59,439 substeps) rest on an uncertified allowance 0.0023. Lowering the r2 floors by 0.0023 breaks the stored schedule (62 admissibility failures). 0.116060 needs a further unread preprint. The Lean theorem takes all analytic content as hypotheses.
- **y-transfer-01758.** Listed: bound Lambda <= 0.1758354, with Lemma B3 and the reduction in Lean. Corrected: unrefereed candidate conditional on inherited certificates (barrier of the 0.1787854 package, window-freeze and tail lemmas written at another parameter row, native-binding lemma), prose Theorems B/C, and four C/Arb verifiers. Lean covers three abstract inequalities and a calculus lemma not instantiated from the certificate. Lane floor 1.622504e-3; budget B over-counts the realised defect by about 2e7. Fails at y0 -> 0.186, t0 -> 0.1580, N -> 680000.
- **pt-floor.** Listed: verified height alone binds 0.2; only lever is more height. Corrected: in the Polymath15 criterion with Lemma 10.1 (Euler-2) and target 0.03, Table 1 gives 0.20 at X = 5e12 and 0.19 at X = 2e13. At fixed height 3e12 the main-term corner test passes at 0.197 (Euler-2), 0.183 (Euler-2,3,5), 0.181 (Euler-2..7), 0.180 (Euler-2..11); these are not bounds. Module errors: "e_C = 0.955" is eq. (88) mass; the "10x gap" mixes zeta-height with x (actual 3.3x).

### Weakened: restatements of known criteria

- **t3-zero-free-strip.** Corrected: E_a(z) = Xi(z+ia) by angle addition; T3(a) holds if zeta has no zeros with Re s > 1/2 + a; the fixed-a converse fails for aligned mirror pairs; T3(a) for all a > 0 iff RH. Known (Lagarias 2005 Lemmas 2.1, 6.1 for a >= 1/2 and under RH; strip case a corollary of his inequality (2.5)). Holds verbatim for DH (sign change bracketed in (0.3085, 0.3086), b = 0.30852). Repo numerics are at shift a/2. The "1e-30" involves neither Phi nor zeta.
- **flow-blindness.** Corrected: a class containing Phi and closed under multiplication by exp(-eps u^2) cannot imply real zeros. Not supported: arithmetic input required; total positivity as a soft property (Phi has a negative 5x5 Toeplitz minor, -1.847e-9); kernel positivity as flow-invariant; "only lever is verified height"; the T3 corollary. Lean file is an abstract skeleton with Lambda >= 0 as hypothesis, not rebuilt. exp(-cosh u - 1.5u^2) has all four closed properties and a transform zero at 11.635 + 1.283i.
- **pr48-weil.** Corrected: the PR-48 residual quantity equals the zero side of the Weil explicit formula on one-sided exponential tests (notes plus numerics). Lean proves Schur-defect >= 0 iff all real-node Pick matrices PSD (Eq48.xi_theorem2); the RH link in Lean is conditional on two unformalised hypotheses. Planted off-line zeros are seen at orders 7, 12, 18, 29, 43 for heights 10, 17.5, 23, 31.5, 45; two of three node families miss heights 31.5 and 45 through order 48.
- **anti-bridge-square.** Corrected: -P <= B <= P at all orders iff M is Stieltjes iff RH; bridge energy is a Hilbert-space square iff RH, otherwise indefinite. H0, H1 of xi positive definite through order 100; DH first negative pivot at order 75. Order 100 sees roughly the first 50 zeros (planted quartet at height 150 detected at order 99; height 300 not detected). No relation to arXiv:2611.06705.
- **bridge-shear.** Corrected: four items, none about zero location. Paired-coordinate formula for K_a; retraction of the diagonal channel (ratio to true kernel 1.4 to 5e7, unbounded); one 2x2 Gram certificate (eigenvalues 9.456e-8, 9.081e-4), also positive for DH (2.337e-5, 2.013e-2); Lean rank-2 norm identity; Poisson reconstruction W_h/h = E_+ - E_-, valid for DH. Certifier `verify` reports valid:false across Python minor versions. Sources are on a branch, not the working branch.
- **gaussian-proxy.** Corrected: Gaussian convolution of H_0 with variance 2 tau equals H_{-tau} (Polymath15 section 4 at t < 0). The code's proxy averages Riemann-Siegel Z; zeros correspond one-to-one with a shift of about -(pi/4 - 7/(4 gamma)) 2 tau. First merger: proxy -1.8766, exact -1.877909. Counts differ on [10,80] at tau >= 2 (7 vs 6, 7 vs 6, 5 vs 4). Module headline -1.8837 is off by 0.0058. Window monotonicity needs a no-boundary-crossing hypothesis.

### Weakened: certificates and catalogues with choice-dependent headlines

- **pick-hankel.** Corrected: K <= 12 PSD (strict for K <= 7; K = 8..12 strict only after an unapplied h_K fix); K = 13, 14 pass in one same-code-path replay; K = 12 fails if verified height is lowered to 3e10. N* = min(2K0-1, 2K1) is a statement about the jet matrix. 48/48 random 12-node DH Pick matrices are positive definite.
- **twistor.** Corrected: no "twistor duality" for zeta is established. Layer 1 is the classical width-3/2 xi-ratio intertwiner in split-twistor language with a hand-chosen rational factor. Layer 2 is the Hankel bound above plus ||H_{a,L}|| <= 2^-a for L <= 1.02259. Layer 3 is a Lean diagram chase, not compiled locally. `TwistorPage.jsx` on the working branch lists false statements under "What It Establishes" (|chi(s)| = 1 off the line at 0.75 + 6.288173i and at -16.406145). DH exceeds 1 only from L about 7 (1.049 at L = 8).
- **obstruction-map.** Corrected: 234 rows, 220 lanes (at least 53 repair/record/referee). Panel grew from 9 to 24 tabulated controls. No control has functional equation, Euler product and an off-line zero. Part 6 of the wall depends on an unreplayed external 7/8 half-plane. 21 PROVED sub-claims later broken; 132 lanes with one internal referee, 10 with none.
- **observatory-surfaces.** Corrected: M1 zeros below 2000 on the line (1517); M2 first zero of F_tau stays in a disc of radius 7/20 for |tau| <= 1/20 (bound 2.897e-4 is 11.5 times the true perturbation 2.52e-5; zero actually stays for -1.2022 < tau < 1.2133); M3 a toy quartic with closed-form roots; M4-M7 classical. README label "Certified quartet channels at tau = -0.13" refers to the toy polynomial.
- **pole-riesz.** Corrected: certified instances for k = 2, N = 630, 1000, 1250, 1500, 4000 at T = 8.55e11 (N = 1250: Re s = 0.541482496857657); sign thresholds 37, 292, 2184, 16238 (shift by +/-1 with the cut convention M = N + c). "Forces" rests on unrefereed notes. "N = 284 is the first failing stage" is an uncertified float search. Sharp, Cesaro and smooth cut-offs fail the same way. The pole-correction term plays no role (zero unchanged to 15 digits).
- **route-i-ln2.** Corrected: see table. The record's absolute E_S o Q values are too high by about 18 to 22; with converged numbers a = 0.5, j = 32 gives about +155 / -265. The excess is 1e-4 to 5e-3 of the Weil form in the tested directions. "Route I stops at ln 2" is stronger than established. The dyadic eigenvalue ladder and no-confined-state statement appear in arXiv:2611.13129 Lemmas 8.5, 8.6. Downstream quantities depending on 1/(1 - lam_0^2) were not re-checked.
- **lee-yang.** Corrected: Lee-Yang is 2 headline theorems / 407 lines; stage theorem 6 / 292 lines; the other 36 / 1877 lines are other topics. Repository stage theorems are conditional on `LeeYangProp K`; the unconditional join exists only in the two check folders. Part (iii) does not use primality beyond log P > 0; instances for distinct primes need n >= 3 and P_max^2 <= M. Parts (iv)-(vi) are notes-level.
- **c-glob.** Corrected: the statement requires every adjacent gap >= g. It is an instantaneous sign law, sharp for rho in (c_half, 1), with an upper Dini derivative at the extremiser. `OpenFrontierPage.jsx` line 2660 omits the hypothesis and is false as worded. Transcendence is asserted without proof.

### Statement kept, framing corrected

- **toeplitz-krein.** The title names the LP certificate (reach 2a <= 0.96); the ln 3 result is the Legendre-Galerkin certificate ARB-LEGE. The public note "comparison with the small-support literature has not been made" is out of date: Connes-Consani arXiv:2106.01715 observed the full form numerically, and Zhu arXiv:2608.24827 (unrefereed, 25 Aug 2026) claims the full form certified at 2a = 1.6.
- **semilocal-sonine.** The module defines Phat_S = F_S P_1 F_S, for which the trace diverges; the identity needs F_S^{-1} P F_S. The "identity defect < 1e-12" assertion is true by construction. Lhat_S(0) is about 0.065; the third digit is not established. "Weil positivity iff D_S <= L_S" and the 96.7% / 99.71% figures restate W = L_S - D_S.
- **zero-traps.** The draft's radius rule is wrong for disc 1517 (recorded 0.3555, rule gives 0.5067). The draft does not disclose that arb.zeta_nzeros(2000) and acb.zeta_zeros give the result directly. "3034 zeros below height 2000" should read 1517 with 0 < Im s < 2000.

## (c) Arbitrary versus important

**Ranks 1-3 (holds, limited consequence).** These would stand if told to a specialist, as correct statements of modest content. `toeplitz-krein` has a natural endpoint (ln 3), form and subspace; only the quoted constant depends on the truncation T (8.2045e-4 or 9.0435e-4 against an infimum near 9.44e-4). Its limit is scope: the statement holds without the prime term, and the harder full-form statement was observed in 2021 and is claimed certified on a wider window in an earlier preprint. `semilocal-sonine` is determined once S and cutoff scale 1 are fixed; a specialist would recognise the published formula and retain one explicit kernel. `lee-yang` is canonical in the circle theorem and choice-laden in part (iii), where the line Re s = 1/2 is placed by n linear conditions on K and any real abscissa is obtained the same way; its value is the Lean formalisation, and for number theory alone it scores 1.

**Ranks 4-5 (holds, mainly internal).** `zero-traps` is choice-free in content and a special case of a decades-old fact; a specialist would treat it as an expository note or a software test. `c-glob` is forced and sharp given its definition, but the definition is the project's: the threshold moves from 0.748 to 0.932 under a scaled hypothesis and to 0 without it, and the Lehmer-pair literature uses a different isolation measure. It supports one internal basin hypothesis (0.72 < 0.898).

**Ranks 6-7 (negative results with a canonical core).** In `route-i-ln2` the fraction 1 - 1/p and the point ln 2 are canonical; the "obstruction" exists only relative to discarding the Sonine trace, cutoff 1 and composition with Q. The recorded top eigenvalue was off by a factor 10.4 in 1 - lam^2 without changing the conclusion, which shows how little of the spectral data the conclusion uses. In `pole-riesz` the mechanism is robust across every weight tried; the thresholds, the height and "first stage 284" are properties of the chosen family and search. A specialist would call both expected: Connes-Consani restrict to (1/2, 2) for this reason, and Turan, Haselgrove and Montgomery predict the truncation failure.

**Ranks 8-12 (arbitrariness 4, importance 2).** The headline numbers are outputs of tuning or stopping points. `lambda-0116`: three numbers (0.118506, 0.116398, 0.116091) come from the same chain and hypothesis depending on tables admitted; only "about 0.116" and the slope dLambda/dtheta of about 0.277 carry meaning. `y-transfer-01758`: 0.1758354 is where one mollifier's triangle bound reaches zero at x = X; the project's LP study puts the family ceiling near 0.1744. `pick-hankel`: 12 is where the run stopped; 149 depends on the node set; the canonical part is the Hankel pivot indices 75/110/75/109 of DH. `twistor`: the certified point (a = 1/4, L = 3/2) is one point of a family in which every nearby point shows the same inequality; the twistor-named layer alone scores 5 and 1. `obstruction-map`: the headline count is a property of the search (rule-defined score, growing panel, wall text fixed early); the reusable part is the control panel. A specialist would attach no meaning to these numbers; what could be used is the independently coded exact replay of third-party Lambda computations and the control harness.

**Ranks 13-20 (importance 1).** `t3-zero-free-strip` and `gaussian-proxy` are canonical and known; their project-specific parts (the 1e-30 figure, the a versus a/2 label, the Z-for-Xi substitution, the window [10,52]) are artefacts. `flow-blindness`, `pr48-weil`, `anti-bridge-square` and `bridge-shear` restate classical criteria (Lambda >= 0, Weil positivity and Hinkkanen-Lagarias, Grommer-Stieltjes, Sondow-Dumitrescu and Hermite-Biehler) in project vocabulary; their use is closing internal lanes. In `flow-blindness` "soft" is in effect defined as "survives this deformation", and the filter excludes nothing that was open. `pt-floor` is a remark printed in Polymath15, and the part beyond it is false. `observatory-surfaces` is a display; every certified number (2000, 0.35, 0.05, 0.13, 1/50) is a choice. A specialist would recognise each on sight and learn nothing new about zeta.

**Ranks 21-22 (not established).** Both are artefacts of project choices. In `hidden-square` the truth value of the headline inequality is set by the scalar scale of Phi (c^2 law), the unit of a (factor 2) and the substitution of L^2 for an undefined norm; the "5000x margin" is the size of Phi^2. In `catalan-ladder` the count 5 drops to 4, 3, 2 or 1 under other choices of polynomial or construction and does not separate the open case from a solved one.

## (d) Where the reviewers disagreed and how it was settled

The referee's value stands in each case; the reason is given.

Score and label changes:

| Item | Field | First | Final | Basis |
|---|---|---|---|---|
| bridge-shear | importance | 2 | 1 | Nothing constrains zeros or Lambda; Gram positivity is equivalent to diagonal positivity (de Branges), so the certifier carries no extra information. |
| anti-bridge-square | importance | 2 | 1 | Classical equivalences; finite table superseded in kind by arXiv:2611.02944. |
| anti-bridge-square | status | proved in notes | obstruction / negative result | The lanes' own verdict is "precise obstruction". |
| flow-blindness | arbitrariness | 2 | 3 | "Soft" class is defined by the deformation; total positivity fails for Phi itself. |
| flow-blindness | importance | 2 | 1 | The triage filter excludes nothing open. |
| t3-zero-free-strip | importance | 2 | 1 | The first reviewer's own rationale said the consequence is internal. |
| pr48-weil | arbitrariness | 2 | 3 | Anchor 5/4, c0, compensator, node domain, Schur restriction are choices. |
| pr48-weil | importance | 2 | 1 | Restatement of a classical criterion; finite tests see a zero only at order comparable to its height. |
| pt-floor | importance | 2 | 1 | True part is printed in Polymath15; the rest is false. |
| catalan-ladder | arbitrariness | 5 | 4 | The kernel is the Dirichlet-series kernel of chi_4 and 5 has a canonical reading as a level-4 polylogarithm count. |
| catalan-ladder | verification | confirmed-weaker-statement | partly-confirmed | Half of the listed claim is refuted outright. |

Factual corrections to the first reviews:

- **observatory-surfaces.** First: the zero stays in the disc for -1 <= tau <= 2. Final: it exits at tau = +1.21331 and -1.20224 (winding 0 at tau = 2).
- **route-i-ln2.** First: spectral values reproduced, stable to 5e-7. Final: that was a re-run of the same script with the same window cutoff e^-16; converged values are lam_0 = 0.9999974, corr(ln 2) = 2.776. Continuity of corr is provable (A in Schatten class S_3), not only measured.
- **obstruction-map.** Row count 230 -> 234. "Map not in the public tree" -> eight earlier copies (123 to 171 rows) are public. "Grouped afterwards" holds for the first 123 rows only. The DH supremum 1.1203625 was reproduced (1.12036247).
- **pick-hankel.** First wrote "K <= 14"; final states K <= 12 with 13, 14 as a single same-path replay. The Grommer-Chebotarev count does not apply to DH (infinitely many off-line zeros).
- **pole-riesz.** First: the word "pole" is contradicted by the chi_4 control. Final: the pole of zeta is the mechanism there too (series (1 + 2^-s) zeta(2s)/zeta(s)); the defect of the headline is implying zeta-specificity.
- **pr48-weil.** The first reviewer's two 1e-33 agreements share one truncated prime sum and are one check. The test function lies inside the Barner/Weil class.
- **pt-floor.** "Lemma 10.1 reproduced within 5%" quoted the best of three variants; the rigorous reading gives 0.026-0.028, and the Table 1 column is matched to +/-25%. The stronger-mollifier lever is Polymath15 section 8.5, not a replay finding.
- **lambda-0116.** The first reviewer stated 0.118506 and 0.116060 without replaying them (now replayed: 0.11850571092270083; restart gives 0.116060080729592). Its sensitivity figures (0.116116, 0.116199, 0.118288) ignore admissibility and are estimates.
- **y-transfer-01758.** Literature incomplete (MathWorld table, four further claims). Only aggregate mass had been sampled; the termwise statement was first tested by the referee.
- **gaussian-proxy.** "Counts agree at all 7 tau" holds only on window [10,52]. The identity is stated as a Gaussian convolution in Polymath15 section 4; Theorem 13 numbering confirmed.
- **t3-zero-free-strip.** Lagarias states the lemma for a >= 1/2 and under RH; the strip case is a corollary. A grid sup|Theta| test missed every failing toy case; the Gram test did not.
- **twistor.** Suzuki (arXiv:1606.05726) already proves unconditional short-window invertibility for a regularised kernel. The DH comparison is the reviewer's experiment, not the package's.
- **zero-traps.** The trap-lemma step is in use in the de Bruijn-Newman literature (arXiv:2610.27343). The whole theorem follows from two Arb library calls.
- **hidden-square.** At least seven conjectures are phrasings of RH, not four. "Exactly for a <= a*" needs Phi >= 0. New page error on `/collapse-chain`.
- **c-glob.** Sharpness holds for rho in (c_half, 1), not every rho > c_half.
- **semilocal-sonine.** "Numerically >= 0.0652 on [0,300]" weakened to "about 0.065 at t = 0"; the left-hand trace had not been tested directly.
- **lee-yang.** "Instances only for n >= 3" needs "for distinct primes"; no clean threshold in min K (43 of 49 on the line at -0.135 against all at -0.094).

No disagreement on verification or scores: `zero-traps`, `twistor`, `obstruction-map`, `pole-riesz`, `route-i-ln2`, `pick-hankel`, `lee-yang`, `toeplitz-krein`, `semilocal-sonine`, `c-glob`, `lambda-0116`, `y-transfer-01758`, `gaussian-proxy`, `hidden-square`, `observatory-surfaces`.

## (e) What was not independently verified

Same-code-path replays (reproducibility only):

- `pick-hankel`: K-node certificate at K = 12, 13, 14 (project script with two repairs; one run; lemmas T and W have no check outside the project).
- `toeplitz-krein`: the Arb script itself. Both independent checks are non-rigorous doubles; there is no second rigorous implementation.
- `anti-bridge-square`: xi positivity to order 100 (first reviewer's script follows the lane's code path).
- `bridge-shear`: certifier re-run, the 920-check script, 15 observatory tests.
- `twistor`: package scripts (2359 checks, signed-window certificate). The certificate uses mpmath.iv and was not redone in Arb.
- `observatory-surfaces`: the two repository certificate scripts.
- `pr48-weil`, `lee-yang`: Lean recompilation runs through the same kernel on the same sources.
- `y-transfer-01758`: assembly gate (re-reads pinned logs); 1000 of 20546 y-Dini profiles.
- `lambda-0116`: 78 floor tests reuse the first reviewer's code.
- `route-i-ln2`: first reviewer's FFT-Mellin rerun (found to share the window artefact).

Lean not rebuilt by either reviewer: `bridge-shear` (ShearGram.lean, toolchain v4.28.0), `flow-blindness` (Main.lean; public grade "kernel-verified" unchecked), `twistor` (TwistorHeatCompat.lean), `toeplitz-krein` (Route41ArbReplay), `lambda-0116` (qrh-lambda; build log of 2026-10-09 read), `pick-hankel` (AnchorHankelProved.lean), `pole-riesz` (LiouvilleLimitProved.lean). `lee-yang` files 03-08 were compiled by the first reviewer only.

Too heavy or not attempted:

- `y-transfer-01758`: full y-Dini Arb run; 5,309,013-window lane sweep; barrier certificate; tail lemma; native-binding lemma; audit of the 1400-line verifier.
- `lambda-0116`: hypotheses H1, H2, H4 themselves; head wall, first contact, contact exclusion; floors at t > 0 by any method independent of the float model (234 of 468 tested by float); the 0.107965 arc replay by the referee; recheck against Raymond erratum v1.1.
- `hidden-square`: the Arb certificate bracketing a*.
- `obstruction-map`: all 234 row verdicts; THIN/DEL constructions; hitting-set table; the external 7/8 half-plane.
- `pole-riesz`: zeros at heights 10^1007 and 10^2989.5 (first reviewer only); N = 292 at 10^6409.7 (killed after 12 minutes); GPU multi-start; 439 sweep zeros.
- `zero-traps`: full-height rigorous quadrature of zeta'/zeta (did not finish in 420 s); every rigorous check shares Arb's zeta enclosure.
- `route-i-ln2`: corr modes above t of about 200; downstream quantities in the parent trace-identity record.
- `pt-floor`: sister-repo corridor table (11 h); the 1.23 margin; the project's 0.155 ceiling.
- `toeplitz-krein`: DH control; the internal theorem behind "implied by the verified zeros".
- `anti-bridge-square`: square-kernel inertia tables; DH orders 109/110 by the referee.
- `flow-blindness`: sign-change scan of H_t on [0,200] (killed after 11 minutes); Arb truncation tails not bounded formally.
- `semilocal-sonine`: trace-class input (Connes-Marcolli book not opened); p = 3, 5 and twisted variants by the referee.

Literature: every search was short (2 to 11 web queries per pass, no MathSciNet or zbMATH). "Not found" entries (`c-glob`, `route-i-ln2`, the Lean Lee-Yang formalisation, the DH Hankel orders) are weak evidence of absence.
