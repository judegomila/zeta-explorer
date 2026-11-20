# c13-referee-r12-independent: independent second referee for five round-12 statements

Date 2026-11-19. Round 13, kind: repair. Scope: this directory only. No statement about zeros of zeta is made. No requirement flag is claimed (R1 = R2 = R3 = R4 = false; R4 not addressed).

**Verdict: all five items hold; four of them in a narrower form that is stated below. No PROVED lemma used by a closure is broken. Eight labels or sentences should be downgraded or restricted (section 4).**

## 1. Plan

1. Item (2) first (the depth-aspect closure rests on one lemma): re-derive Lemma P and Lemma X line by line, certify every constant, test at (p, k, t) not used by the lane, brute-force the conclusion over all characters.
2. Items (1), (3), (4), (5): re-derive each statement from the lane's RESULT.md, rerun the numerics with own scripts at parameters the lane did not use; ball arithmetic wherever a sign or a zero is asserted.
3. Open the two sources on which "PROVED given" labels rest (Matsumoto's survey; Conrey-Li) and compare the printed theorems with the quotations.
4. Only after each report was written: read the lane's existing REFEREE.md and record agreements and anything missed.

Discipline: each REFEREE2 report was written before the lane's REFEREE.md was opened. One exception to "RESULT.md only": the header of the heat lane's `cell2.py` was opened to find the python-flint character API; the certification method used here is different from the one in that file.

## 2. Summary table

| # | lane | statement refereed | outcome | narrower form / correction |
|---|---|---|---|---|
| 2 | c12-depth-aspect-height-transfer | Lemma X, constant 0.479/s, threshold N about (q abs t)^(1/r) | **holds** | needs abs(t) >= t_r (40.3, 3.4e5, 7.7e7, 2.3e10 for r = 2..5); threshold is C_r p^ceil(k/r) abs(t)^(1/r), equal to C_r (q abs t)^(1/r) only when r divides k. "Exchange only for N about log q" is proved above q^delta and measured between. |
| 1 | c12-bost-connes-crossed-product-duality | three classes of states; T-NR = Tr(D e^(-beta H)), D >= 1 in C*(Q/Z); corrected KMS statement | **holds in a narrower form** | product measure, "entire, finitely many primes, no zeta" hold for the Galois-invariant KMS state only; extremal states at beta > 1 give tau(conj chi) L(beta, chi)/zeta(beta) (verified). Class (i) stays closed by coefficient positivity right of 1. "Inner perturbation of the dynamics" holds one beta at a time. Lemma L's divergence sentence is false at beta = 1/2. |
| 3 | c12-x04-oval-hecke-fricke-loading | reduction to c(pm) = c(m); T-NR twin of the complex-point multiplier | **holds; twin statement in a narrower form** | the twin has c = -(q^(3/2) + q^(1/2)) < -2 and its extra zeros are real and outside the strip (Re s = 2.2423 at q = 3). The fact the control row needs, and which holds, is that every T-NR function is the Mellin transform of a W-fixed element of A theta, positive on the arc for c > 0. |
| 4 | c12-heat-tied-family-open-cell | Lemmas S and T at q = 5, 7, 13 | **holds** | both PROVED given Conrey-Li Theorem 2 (opened; matches). Five zeros certified by Rouche; negative boundary values certified on an independent grid. Closed "in three readings", not for every notion of tied. |
| 5 | c12-univ-pointwise-control-wcone (a) | UNIV statement and scope table | **holds relative to one source theorem; class N wording narrowed** | hypotheses used: pairwise non-equivalent characters; K compact in the open strip 1/2 < Re s < 1 with connected complement; non-vanishing targets; positive lower density. The "false on positive density" branch is relative to the survey's Theorem 7, not proved. Class N: "implied by non-vanishing; fails only in windows with a zero", not "equal in content to a zero statement". U4 (hybrid form) should be ARGUED. |

Reports: `REFEREE2_<lane>.md` for each of the five lanes, in this directory.

## 3. Work, by item (details in the reports)

### Item 2 (decisive first check): Lemma X

- Proof re-derived in six steps; each inequality checked (interval length 0.9 H/(r x_0) certified for r = 2..40 in Arb and for all r by concavity; 2 sin(0.504) = 0.96586 > 0.958).
- Data: power sums and kappa = 1, 12, 180, 5040 exact; Lemma P: 0 failures in 3000 random (m, H) per datum, r = 2..6; the congruence is false mod H^(r+1).
- x_1 certified in exact rational arithmetic (200 terms plus tail): 0.419683, 0.0103378, 0.0042537, 0.00208709; the lane's smaller values are valid.
- Five fresh triples (p, k, t; r): (11, 4, 5000.3; 2), (2, 21, 4.0e5; 3), (13, 12, 1.0e8; 4), (3, 25, 3.0e10; 5), (17, 7, -123456.789; 2): for every tested m in the window (3683 to 26355 values) the products are congruent mod q exactly and abs(e^(-itD) - 1) >= 1.0007 in Arb (needed 0.958). 0 violations.
- Brute force over all characters and optimal c at six (q, t), including the non-cyclic group mod 2^6: minimum error 1.83 to 2.00 at N_req against bounds 0.2395 and 0.1597. The lemma is confirmed and is far from sharp.
- Referee addition (argued in three lines, brute-forced on five cases): with the r = 2 datum the conclusion holds for every t != 0, eps >= min(0.2395, (1/2) sin(0.087 abs t)) on n <= 5 p^ceil(k/2). This narrows the lane's open item "bounded heights" to r >= 3.

### Item 1: Bost-Connes

- Relations, Lemma C (first sentence), KMS formula for beta > 1 (from Ramanujan sums), product measure of the invariant state, Lemma V, Lemma B, Lemma W, inequality (D), Lemma T re-derived.
- Checks at new parameters: KMS formula against the Galois average (max difference 2.2e-31); positive definiteness on (1/84)Z/Z; Lemma T zeros in Arb at (q, c) = (5, 2.3) and (2, 2.05) besides the lane's (3, 2.1); Poisson relation and cocycle at q = 5.
- Independent confirmation of the correction: extremal state at beta = 2 on sum_a conj chi(a) e(a/5) gives 0.51683265726972 + 1.21263789412471 i = tau(conj chi) L(2, chi)/zeta(2); the Galois-invariant state gives 0.

### Item 3: X_0(4) oval

- Operator formula, action on theta, real/complex split, Mellin multipliers, Lemma 3 and the equivalence of the eigen-equation with c(pm) = c(m) (recursion with roots 1 and 1/p) re-derived.
- Point-by-point sum over complex isogenous points at p = 11, 13, 17: equals the dilate formula to 4e-29.
- Twin identity certified in Arb at q = 3, 5, 7, 11; real zeros of C_q at 2.2423, 2.1098, 2.0675, 2.0360 certified by sign change.
- Referee addition: Cx_p theta > 0 on the whole arc (two lines; replaces a MEASURED cell).

### Item 4: Lemmas S and T

- Conrey-Li Theorem 2 opened: statement as quoted by the lane. Lemma S and Lemma T re-derived (harmonic minimum principle; continuation of W W* = 1/m; boundary limit with the outer function cancelling).
- Lemma S inputs: one zero of w0 in 1/2 < Re s < 3/2 certified for each of the five families at q = 5, 7, 13 by Rouche on the entire numerator with Cauchy bounds from a wide Arb ball, plus non-vanishing of every denominator factor on the disc. Digits agree with the lane.
- Lemma T inputs: first certified negative S_v at 8.563, 7.863, 9.663, 16.763, 5.113, 16.013, 17.463 (lane: 8.55, 7.85, 9.62, 16.75, 5.11, 16.01, 17.43); S_w negative in every family (q = 13 odd: 0.864 on a fine grid; lane 0.87).

### Item 5: UNIV

- Survey opened: Theorems 1, 7, 10, 11, 20, 30, 31 as quoted; Theorem 30 does not print "connected complement".
- U1, U2, U3 re-derived (closedness of the jet condition made explicit). Branch F follows from Theorem 7 only.
- Scope-table arithmetic correct; the five in-scope cells checked; the 29 others not re-read.
- The lane's measured illustration reproduced to height 1000 (46 of 256 sign patterns; ratio range 0.0427 to 25.26).

## 4. PROVED labels and sentences to downgrade or restrict

| lane | statement | action |
|---|---|---|
| bost-connes | Lemma C, sentences after the first; consequences 2(a), 2(d); flag R1 reason | restrict to the Galois-invariant KMS state |
| bost-connes | Lemma P, last sentence ("no value zeta(beta + it), beta <= 1, is a value of a positive functional of the system") | PROVED/CLASSICAL -> ARGUED |
| bost-connes | Lemma L, last sentence (divergence of prod gamma_p on 0 < beta < 1) | false at beta = 1/2; restrict to beta != 1/2 |
| bost-connes | "T-NR is a bounded inner perturbation of the dynamics" (Lemma T, section 7 principle, round-12 lesson 2) | per beta only; reword to "value of the KMS family on a fixed D >= 1 in C*(Q/Z)" |
| depth-aspect | section 3.5 first bullet (principal-character bound N/abs(t) + O(1)) | CLASSICAL -> ARGUED; error term misstated; not load-bearing |
| depth-aspect | "an exchange exists only for N of about log q" (verdict paragraph, round log) | add "proved for N >= q^delta, measured between"; needs abs(t) bounded below |
| x04-oval | Lemma 2(c) / round log "is a T-NR twin" | add "(c < -2, extra zeros outside the strip)"; Lemma 1(a) not re-derived here |
| univ | Corollary U4 | PROVED-rel -> ARGUED until "connected complement" is read in the primary source; class N wording as in the table of section 2 |

Nothing in this list is used by a closure.

## 5. Controls

This is a repair lane; no device is proposed, so no control table is owed. Control facts confirmed in passing: T-NR with c > 2 passes every step of the Bost-Connes device and of the X_0(4) device (membership, W-invariance, positivity); the Lemma T zero of the T-NR factor lies in the strip exactly for 2 < c < sqrt q + 1/sqrt q; the T-NR factor phase statement of the heat lane (arg m(3/2 + it) > pi/4 for t in (2.973, 4.532) at p = 2, c = 2.5) is correct.

## 6. Requirement flags

- R1: false. No attack; Lemma X uses multiplicativity of both twists but is an obstruction.
- R2: false. Nothing height-uniform about zeta is established.
- R3: false. No device.
- R4: false; not addressed (repair lane).

## 7. Comparison with the existing REFEREE.md files (read after the reports were written)

The existing independent passes reach the same verdicts. Agreements found independently: Bost-Connes E1 (Galois-invariant restriction), E3 (inner perturbation per beta), E4 (range of c), E5 (Lemma P last sentence); X_0(4) E2 (twin outside the strip; every twin lies in the module); UNIV E2 (class N wording); depth-aspect G2 (bounded heights closable; closed there with the r = 3 datum, here with r = 2), G3 (small abs(t)), G5 (3.5 first bullet). Missed here and adopted: Bost-Connes E2 (gamma_p = 1 at beta = 1/2). Raised by the existing pass and not examined here: depth-aspect G1 (relation (3.2) needs only weighted sums to be small, which is weaker than (E): the termwise exchange is closed, a transfer special to the coefficients of zeta is not excluded); X_0(4) E1 (a sign in the DH row). New here: exact-rational x_1; Rouche certificates for the five zeros; the two-line proof that Cx_p theta > 0; the opened Theorem 2 of Conrey-Li; the explicit list of universality hypotheses and the U4 downgrade.

## 8. Three weakest steps of this referee lane

1. Coverage. Only the statements named in the assignment were refereed. Not checked: section 2 and the control table of the depth lane; the E_a, Epstein and DH rows and Lemma 1(a), Lemma 4 of the X_0(4) lane; cell 1 (heat) and the conductor-aspect table of the heat lane; part (b) of the UNIV lane and 29 of its 34 device codes; coverage of Bost-Connes states beyond the three classes.
2. Sources. Theorem 7 of the survey and Theorem 2 of Conrey-Li were read as printed; their proofs and the primary universality papers were not opened. Bost-Connes uniqueness for beta <= 1 and Takesaki duality were not opened. Items 4 and 5 are therefore "holds given the printed theorem".
3. Numerics. The Rouche certificates start from the lane's zero locations and certify those five zeros; the zero counts and "first zero" claims were not re-scanned. The brute-force tables, the theta sums of item 3 and the Poisson check are floating point (mpmath 30 digits or float64), not interval; signs and zeros asserted in the reports are in Arb. The two referee additions (bounded heights at r = 2; positivity of Cx_p theta) are short arguments with no referee of their own.

## Files

- `tmp/research-2026-11-16/push/c13-referee-r12-independent/RESULT.md`
- `tmp/research-2026-11-16/push/c13-referee-r12-independent/REFEREE2_c12-depth-aspect-height-transfer.md`
- `tmp/research-2026-11-16/push/c13-referee-r12-independent/REFEREE2_c12-bost-connes-crossed-product-duality.md`
- `tmp/research-2026-11-16/push/c13-referee-r12-independent/REFEREE2_c12-x04-oval-hecke-fricke-loading.md`
- `tmp/research-2026-11-16/push/c13-referee-r12-independent/REFEREE2_c12-heat-tied-family-open-cell.md`
- `tmp/research-2026-11-16/push/c13-referee-r12-independent/REFEREE2_c12-univ-pointwise-control-wcone.md`
- `tmp/research-2026-11-16/push/c13-referee-r12-independent/referee_updates.json` (for the learn step), `tmp/research-2026-11-16/push/c13-referee-r12-independent/lanes.jsonl`
- scripts and logs: `item2_lemmaX.py/.log`, `item135.py/.log`, `item4_ST.py`, `item4_ST_lib.py`, `item4_ST.log`, `item4_fix.py/.log`, `supp.py/.log`. All runs local through `scripts/memcap.sh 8`, under 1 minute in total; python-flint 0.9.0, mpmath 1.4.1 in a venv inside this directory (removed after the runs; recreate with `python3 -m venv venv && venv/bin/pip install python-flint mpmath numpy`). Server not used. The two source PDFs were fetched from arXiv into a scratch directory outside the repo and are not kept.
