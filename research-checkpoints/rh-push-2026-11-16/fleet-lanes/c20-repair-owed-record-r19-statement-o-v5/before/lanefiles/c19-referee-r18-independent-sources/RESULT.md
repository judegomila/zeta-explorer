# c19-referee-r18-independent-sources: RESULT

Date 2026-11-20 (campaign round 19). Kind: repair (Repair A: second, independent referees for five round-18 lanes; source of
Turan's theorem; referee for W5c). No attack. This lane cannot raise the headline.

## Top of file

- Statements about zeros of zeta: none, in the five refereed lanes or here. (Zeros located in this lane are zeros of the control
  HQ2 and of partial sums D_P.)
- All five lanes: **holds with corrections**. No lane fails. No verdict changes. Each lane now has 2 referees, both holding.
- PROVED labels that break, all already found by the first referees and found again independently here: Lemma GL (b) of the U4 lane
  (one direction of an "iff"; not used) and the term log abs(a_P) in display (A) of the tz bridge lane (zeta unaffected).
  New in this pass: one wrong error estimate in the tz server lane (deviation (iii), a prime at a band boundary) and the
  mode-count dependence of its margins quantified at four heights.
- Turan's second main theorem: located with the factor 2 and the constant 8e, with proof, in Montgomery-Vaughan, Multiplicative
  Number Theory III (draft), Theorem K.3. Montgomery's Ten Lectures were not opened; the item "factor 2 unresolved" is resolved
  relative to that text.
- W5c: holds with corrections; proved in full (the Plancherel-Polya step is proved inline); 1 referee.

## 1. Plan

For each lane: read RESULT.md and the scripts, not the first referee file; re-derive the decisive step; run the required check with
own code; fix the findings; then open the first referee file and compare. Decisive first test of this lane: the tz bridge identity
at a_P != 1 in ball arithmetic (it decides whether a PROVED display is false). Outcome: display (A) is false as printed for
a_P != 1 and true with the constant -u.

## 2. Table

| Lane | Required check | Result of the check | Verdict | PROVED labels broken | Referees now | File |
|---|---|---|---|---|---|---|
| c18-u4-group-law-left-of-one-torus-orbit | (iv): is the group-law step atom-by-atom positive definiteness of k -> Re Lambda_k(n); does a displayed inequality use a cross-prime relation | Yes, with Re Lambda_k(n) (not Lambda_k(n)); none of the seven displayed inequalities uses a relation between primes | holds with corrections | 1 (Lemma GL (b), one direction; first referee E1) | 2 | `REFEREE2-c18-u4-group-law-left-of-one-torus-orbit.md` |
| c18-tz-one-sided-bound-fe-reserve-bridge | exact truncation identity without log abs(a_P); P = 12, 20 in balls | identity holds with constant -u; residual = (u - 2 log abs a_P)/(pi T) to 1e-7..1e-6 at T = 2400 with certified complete zero lists (15 of 15 counts equal the argument-principle count); with the log term kept the residual tends to -log 3, +log 4 | holds with corrections | 1 (display (A); first referee E1) | 2 | `REFEREE2-c18-tz-one-sided-bound-fe-reserve-bridge.md` |
| c18-tz-band-completion-controls-server | rerun 5 percent of the 600 cells at two mode counts on the server | 30 cells with atoms, m = 48, 96, 192: Form C negative in 30 of 30 at each m; lane values reproduced at m = 96 (relative difference <= 6e-5; <= 1e-7 outside two cells); zeta's Form D margin at 192 modes is 0.28 to 1.0 (median 0.75) of the 96-mode value | holds with corrections | 0 (three MEASURED statements restricted) | 2 | `REFEREE2-c18-tz-band-completion-controls-server.md` |
| c18-d10-inertia-law-theorem-t-lemma-d | Theorem Q (d = 4) and the Bezoutian identity, exact, fresh configurations | identity: hand re-derivation and 180 of 180 exact instances (degree 1 to 9); Theorem Q: inertia (6, 0) at 29 of 29 fresh interior points, (4, 2) at 3 of 3 outside the strip; e_6 factorisation equal at 12 of 12 fresh points; sign certificates redone | holds with corrections | 0 for the theorems; odd-zero rows misidentified (first referee E-1, confirmed exactly) | 2 | `REFEREE2-c18-d10-inertia-law-theorem-t-lemma-d.md` |
| c18-exact-relation-rigidity-klein-spinor | HQ2: functional equation, integer frequencies, multiplicativity, coefficients >= 1, pole order at 1/2, two off-line zeros in balls; Lemma Q; Proposition F | all hold; pole of order exactly 4 at k = 0, 1, 2 for q = 2, 3 with leading coefficient eps zeta/L^4; eight off-line zeros enclosed, one zero per square by the argument principle; Lemma Q and Proposition F re-derived and hold | holds with corrections | 0 (Proposition D (c) gap: first referee E1) | 2 | `REFEREE2-c18-exact-relation-rigidity-klein-spinor.md` |
| W5c (c17 window lane, REFEREE2 section 4) | referee | re-derived in full; three wording conditions | holds with corrections | 0 | 1 | `REFEREE-W5c-and-TURAN-SOURCE.md` |

Referee counts for the learn step: the five round-18 lanes go from referees = 1 to referees = 2, refereeHolds = true, flags
r1 = r2 = r3 = r4 = false, aboutZeros = false; records in `lanes_records.jsonl`. No statement reaches three referees.

## 3. Corrected sentences (the sentence to use)

U4 lane.
1. Lemma GL (b): "The inequalities hold for all g >= 0 and all non-negative cosine polynomials if and only if for every atom n the
   sequence k -> Re Lambda_k(n), extended evenly, is positive definite: Re Lambda_k(n) = integral of cos(k theta) d mu_n, mu_n >= 0."
2. Map row and R1 line: "positive definiteness of k -> Re Lambda_k(n) atom by atom; no relation between primes is read."
3. Lemma V summaries: "a simple zero at distance delta from Re s = 1 can exceed the pole term in the 3-4-1 mechanism only if the
   mean log-length of the test is below log 2/delta (log(m a_1/a_0)/delta for order m)."
4. Theorem T application (first referee): "for the triple sigma + ikt, a lower bound with B locally bounded in (sigma, t) on a
   strip holds if and only if the strip is zero-free."

tz bridge lane.
5. Display (A) and step (b): "-2 Re <h, A_P h> = -u norm(h)^2 + sum over zeros beta of D_P of <h, kappa_beta h>, for a_1 = 1 and
   a_P != 0. D_P'/D_P(s) = -(log P)/2 + lim sum over abs(Im beta) < T of 1/(s - beta), with no further constant."
6. Tail: "(u - 2 log abs(a_P))/(pi T) norm(h)^2 (1 + o(1)); the mean of Re beta is log abs(a_P)/u."
7. Share of right zeros: "31 to 33 percent at P = 12 and 37 to 41 percent at P = 20 with certified complete lists (heights to
   2400); 27 to 35 percent at P <= 8 (first referee)."
8. DH row: "holds for every Dirichlet series with a_1 = 1 and a_P != 0, with the constant -u."
9. Check status: "ball arithmetic at P = 12 and 20 with complete certified zero lists; float64 at P = 3 to 8."

tz server lane.
10. Margins: "On 96 Fourier modes zeta's smallest eigenvalue has median 0.22 to 0.26 Lg at theta = 0.55 and 0.012 to 0.025 Lg at
    0.85; on 192 modes with the same centres (8 windows, 1e6 to 1e12) it is 0.28 to 1.0 times the 96-mode value (median 0.75). The
    margin is a property of the window space and decreases with the number of modes."
11. Form C: "zeta fails Form C at M = 0 and M = 1 in 600 of 600 cells with a reflected atom on 96 modes (certified by the lane); in a
    30-cell sample rerun with independent code the smallest eigenvalue is negative at 48, 96 and 192 modes in every cell, between
    -1.42 and -0.19 times Lg, and more negative with more modes."
12. Deviation (iii): "At (1e10, 0.75) the boundary integer 31622777 is prime and is included (`xtheta` rounds to the nearest
    integer at every boundary). In Form D its weight is below 1e-7; in Form C it enters with weight log n/sqrt n = 3.1e-3 and
    changes lam_min by up to 1.4e-3 (6e-5 relative). No sign changes."
13. Row (1e6, 0.85) of the Form C table: "40 of 40 at 96 modes; at 192 modes one of two sampled windows is negative at M = 0."
14. Chains (first referee): "on 96 modes, in a typical window, N(theta) at theta = 0.55 does not distinguish a chain from zeta at
    M = 0 or M = 1; the distinction appears as m grows and for theta >= 0.75."

D10 lane.
15. Odd number of real zeros: "b = (u - 1) g is the model of M_0 times (-Theta) for odd degree; the model of M_0 Theta is
    b = u (u - 1) g. One real zero a: b = (u - 1)(u + a): (1, 0) at a = 1/4, (0, 1) at a = 3/4; b = u (u - 1)(u + a): (1, 2) at a = 1/4,
    (2, 1) at a = 3/4, 11/20, 9/10." The sentence that c17's parity clause fails in the model is withdrawn until rerun with this b.
16. Theorem Q: "computer-assisted; conclusion confirmed by a second implementation at 29 fresh interior points, factorisation at
    12 fresh points; the grid computation itself was not repeated."

Exact-relation lane.
17. Poles: "a pole of order 4 at s = 1/2, and at every point 1/2 + 2 pi i k/log q where zeta does not vanish."
18. Zeros: "for every eps > 0 the factor has no zero on the line; its zeros are at distance
    (2/log q) Re asinh((eps^(1/4)/2) e^(i pi/4)) from it, inside the open strip when that distance is below 1/2."
19. Headline (first referee): "HQ2 is a twin with zeta's functional equation that is multiplicative in the ordinary sense. ZQ,
    NR-q and the Proposition W twin leave the class at integrality or support, before multiplicativity of integer coefficients is
    defined."
20. Proposition D (c) (first referee): "(a), (b) PROVED; non-closedness of INT and MULT in T_strip is CLASSICAL on the right
    half-strip with a target non-vanishing on the whole half-strip, and OPEN inside the functional-equation class."
21. Lemma Q consequence: "equal numbers of zeros and poles of R on the u-sphere; it places neither."

Sources and W5c.
22. Corollary T' and row Q31: "relative to Turan's second main theorem in the form of Montgomery-Vaughan, Multiplicative Number
    Theory III (draft), Theorem K.3 (factor 2 and constant 8e as printed there, proof read by a referee; Montgomery's Ten Lectures,
    chapter 5, not opened)."
23. W5c: the sentence at the end of `REFEREE-W5c-and-TURAN-SOURCE.md` (centred interval without loss; all abscissae separated;
    explicit small-offset form b <= 0.499 sqrt(M) u^(-3/2)/sqrt(max(1, 4/(uD))) for ub <= 1).

## 4. Work (summary; details in the six files)

- U4. Seven displayed inequalities read for a cross-prime relation: none. Identity E re-derived by residues and checked at three
  new points (defects 2e-6 to 2e-5, inside the truncation scale with 400 zeros). Counterexample to the written Lemma GL (b):
  (1, i, 0, ...). T-NR coefficients reconstructed by hand from a + b = 2.2 sqrt 3, ab = 3.
- tz bridge. Constant of the Hadamard form derived by a contour argument (c_0 = 0 for every a_P != 0). Ball run at P = 12, 20:
  five series, three truncation heights, zero lists of up to 2,288 zeros certified complete.
- tz server. Independent prime sums (7.06e8 prime powers at 1e12) and assembly; 32 cells x 3 mode counts.
- D10. Hand re-derivation of the eight-pattern bookkeeping; exact runs A to E and the odd-degree run.
- Exact relation. Hand derivations and ball checks of HQ2, Proposition F.
- Turan: Theorem K.3 located and its proof read. W5c: re-derived with an inline proof of the sampling inequality.

## 5. Controls

This lane makes no argument, so no control is run against one. Control statements checked in the refereed lanes:

| Control | Lane | Outcome of this pass |
|---|---|---|
| E_a, lifted to L(s +- a, chi^k) | U4 | passes steps (1) to (3): Re Lambda_k(n) = Re(chi^k(n)) Lambda(n)(n^a + n^-a) is positive definite in k (re-derived) |
| T-NR (3, 2.2) | U4 | fails at the sign of the coefficient at 3^2 (reconstructed by hand); not a cross-prime step |
| series with a_P != 1, non-multiplicative series, Liouville chain | tz bridge | satisfy the truncation identity with constant -u (ball run): the identity reads no multiplicativity |
| sign chains, ZQ, E_a, DH in the band forms | tz server | not rerun here (first referee reran chains at m = 96, 384, 1536) |
| pole-free base (DH type), 8 Hurwitz configurations | D10 | 0 negative squares (Corollary H1 confirmed exactly) |
| unpaired left pair; quartet outside the strip | D10 | negative index 2; 2 negative squares (as stated) |
| HQ2, HQ1 member of Proposition F, TN1 | exact relation | have the stated properties (balls); HQ2 fails only the pole clause |
| DH, backward heat, sign-twisted primes, unimodular twist, T-NR, Beurling, phase-rotated transfer operator, theta^w against an argument of this lane | - | not applicable: no argument is made |

## 6. Verdict and requirement flags (this lane and the five refereed lanes)

Verdict of this lane: partial result (referee lane): five lanes hold with corrections; one source located; W5c holds with
corrections.

- R1 false. Evidence: U4: every inequality is atom by atom (section 1 of its REFEREE2). tz bridge: the identity holds for a
  non-multiplicative series. tz server: no step uses multiplicativity. D10: the model has no primes. Exact relation: HQ2 is
  multiplicative with zeta's functional equation and has off-line zeros.
- R2 false. Evidence: no lane establishes an inequality for zeta at a height; the tz server statistic depends on the mode count.
- R3 false. Evidence: E_a and the G_+ lift pass the U4 device; ZQ passes the band device in the lattice model (lane; not rerun);
  symmetric quartets pass the D10 kernel (Theorem Q, confirmed); HQ2 passes FE + INT + MULT + positivity.
- R4 false. Evidence: Form C (the proposed route from the data band to the full band) is negative for zeta at every mode count
  tried; Proposition F is a negative statement; no lane has a continuation step.

## 7. Three weakest steps of this pass

1. The tz server rerun is a sample of 30 of 600 cells (two windows per height), zeta only, float64 in the assembly (prime phases
   in 80-bit long double; Arch from 50-digit digamma), and stops at 192 modes. It reproduces the lane at 96 modes and shows the
   direction and size of the mode-count dependence; it is not a certification, and it says nothing new about the control classes.
   The limit of zeta's margin as the mode count grows was not determined.
2. Theorem Q of the D10 lane was confirmed through its conclusion (29 fresh interior points, 3 outside) and through its
   factorisation at 12 fresh points computed with the lane's own `Hmat`; the 3,655-point exact grid, the interpolation, Theorem G
   and the 600 + 600 certified zeta-base matrices were not repeated. In the tz bridge lane only Theorem A was re-derived and run;
   Lemma R, Lemma C, Proposition Z and the control table rest on the first referee. The limit T -> infinity in the ball run is
   observed at three heights, not bounded.
3. Sources. Montgomery's Ten Lectures were not opened; the statement is taken from a draft of Montgomery-Vaughan with visible
   misprints, and its proof was read once, not re-derived line by line. Hamburger, Knopp 1994, Voronin and
   Lapidus-van Frankenhuijsen (exact-relation lane) stay "as recalled". Corrections 4, 14, 19, 20 are the first referees' findings,
   read and agreed after this pass, not found independently.

## 8. Files, runs, units

- `REFEREE2-<lane>.md` for the five lanes; `REFEREE-W5c-and-TURAN-SOURCE.md`; `lanes_records.jsonl` (five records, referees = 2);
  `lanes.jsonl` (this lane's line). No file outside this directory was edited.
- `local/`: `tz_bridge_balls.py/.json/.log` (python-flint, 160 bits), `d10_check.py/.json/.log`, `d10_odd.py/.log`,
  `hq2_balls.py/.json/.log` (200 bits), `misc_checks.py/.json/.log`. All local runs through `scripts/memcap.sh 8` with the interpreter
  `tmp/routes-b1-r1-venv/bin/python` (flint 0.8.0); longest run 4.3 minutes, resident memory below 1 GB.
- `tz_server/`: `ref2_tz_prime.py`, `ref2_tz_asm.py`, `out_1e6.json` .. `out_1e12.json`, `compare.py`, `compare.txt`, `compare.json`, `logs/`.
- Server units, all through rhrun, 1 core each, 2 GB (3 GB for the last), all finished, none running: rh-c19ref-p6-1120063223,
  rh-c19ref-p8-1120063223, rh-c19ref-p10-1120063223, rh-c19ref-p12-0/1/2/3-1120063321, rh-c19ref-a1E6/a1E8/a1E10-1120063321,
  rh-c19ref-a1E12-1120063814. At most 7 at a time; longest 104 s. 106 MB of moments remain in
  `~/rh-push/c19-referee-r18-independent-sources/` on the server. The assignment allowed 8 cores and 12 GB; the run needed less.
- Process notes. The four local scripts first wrote their JSON files to the repository root (the working directory of memcap);
  the four files were moved into `local/` and nothing else was written there. One ssh connection was reset and repeated.
- Web: https://personal.science.psu.edu/rcv4/Vol3/Vol3.pdf (opened; text extracted to /tmp); two web searches.

## 9. Proposed map text (not applied; this lane does not edit the map)

- Row P58 (band forms): add corrections 10 to 13 ("margins are 96-mode values; at 192 modes 0.28 to 1.0 of them; Form C negative
  at 48, 96, 192 modes in a 30-cell rerun"). Truncation identity: "checked in ball arithmetic at P = 12, 20 with certified complete
  zero lists; share of right zeros 31 to 33 percent at P = 12, 37 to 41 percent at P = 20".
- Row G44 (U4 (iv)), X1 and control HQ2, D10 addendum: status "two referees hold with corrections"; HQ2: "order-4 pole at 1/2 and
  wherever zeta does not vanish; off-line zeros enclosed in balls".
- Row Q31: replace "relative to Turan (factor 2 unresolved)" by correction 22; W5c with the sentence of correction 23, "one referee".
