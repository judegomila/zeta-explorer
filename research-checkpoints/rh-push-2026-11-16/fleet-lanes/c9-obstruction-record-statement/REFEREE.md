# REFEREE: c9-obstruction-record-statement (adversarial pass, lens: general)

2026-11-18. Internal referee, one pass, not the author of the lane. Target: `RESULT.md`, `STATEMENT_O.md`,
`MAP_ROWS_PROPOSED.md`, `verify_citations.py`, `recheck_controls.py` in this directory. Only this file was written.
Referee scripts were kept outside the repo (`/tmp/c9ref/chk.py`, `/tmp/c9ref/dh.py`); two local runs through
`scripts/memcap.sh 8` with the `pick/venv` python (mpmath, sympy; largest allocation a 20 MB sieve). The compute
server was not used. No repo data module was imported.

## Outcome

**holds = true as a record lane (verdict "partial-result" confirmed), with corrections E1 to E7.** The lane makes no
argument about zeta, labels no line PROVED, and claims no requirement. Every control computation that was re-run
with a different case agrees. The citations agree with the files on disk, with a count error (E3). Two points are
not held as worded and must be changed before Statement O is entered in the map as row O1:

- the clause of section C is written as a joint necessity ("must read, in one step, at least the items below");
  section B supports only 13 separate conditional statements, one per read class (E1);
- the input codes of A1 are not those of the source of the "minimal input sets" sentence quoted in section C; with
  the codes of A1 that sentence is false for DH (E2).

Nothing in the lane assumes RH, restates verified height, or presents a classical fact as new. No statement about
zeros of zeta is made. Flags set by this referee: R1 = R2 = R3 = R4 = false (same as claimed).

## 1. What was re-derived

No step is labelled PROVED in this lane, so there is no PROVED step to confirm. The elementary constructions that
the lines rest on were re-derived by hand:

- **A4, mode (Z).** If C is in K(R), every step is valid on K(R), and C has a zero with Re s > theta, the output is
  false for C. Correct. Mode (S): correct. Mode (I): see E6.
- **Line 1, Liouville.** Lambda_F(p^k) = (-1)^k log p for zeta(2s)/zeta(s); zeros at rho/2, so Re s < 1/2. The
  lane's correction to the outline (the Liouville twist is not a zero-mode control for theta >= 1/2) is right.
- **Line 2, DH.** kappa = (sqrt(10 - 2 sqrt 5) - 2)/(sqrt 5 - 1) = 0.2840790438; coefficients (1, kappa, -kappa,
  -1, 0) mod 5; a(6) - a(2)a(3) = 1 + kappa^2 = 1.0807009. Confirmed.
- **Line 3, E_a.** xi(s+a) xi(s-a) is invariant under s -> 1 - s; Lambda_{E_a}(n) = Lambda(n)(n^a + n^-a); zeros
  at 1/2 + a + i gamma. Confirmed.
- **Line 6, T-NR.** cosh(x + iy) = -c/2 with c > 2 forces cos y = -1, cosh x = c/2: zeros at
  1/2 +- arccosh(c/2)/log q + i(2k+1) pi/log q. q^-s times the factor is q^(-1/2)(1 + c sqrt(q) q^-s + q q^-2s),
  so zeta times the factor has multiplicative coefficients after the shift (conductor q^2). Count of heights
  below 60 for q = 3: (2k+1) 2.8596 < 60 gives k = 0..9, ten. Confirmed.
- **Line 7, THIN.** With pi_S(x) = (1/2) int_2^x t^(b-1) dt/log t + O(x^(b-eta)): P_S(s) = (1/2) E_1((s-b) log 2)
  + A(s), A analytic in Re s > b - eta; log(F/zeta) = sum_{p in S} log((1 - p^-s)/(1 + p^-s)) = -2 P_S(s) + T(s), T
  analytic in Re s > b/3; exp(-E_1(z)) = e^gamma z exp(-Ein(z)), so F = zeta (s - b) W with W analytic and
  non-vanishing. The greedy rule needs: deficit accumulated in a prime gap of length g is at most
  g x^(b-1)/log x, so a gap bound x^(1-eta') gives tracking error O(x^(b-eta')). Confirmed relative to the
  short-interval input, as the line says.
- **Line 9, twin.** L(s, chi_-4) is odd (zeros at -1, -3, ...), L(s, chi_5) is even (zeros at 0, -2, ...); the
  product vanishes at every non-positive integer. Confirmed.

## 2. Numerical checks re-run with different cases (40 digits, mpmath; float evaluations, not certificates)

| control | lane's case | referee's case | value |
|---|---|---|---|
| Liouville twist | 1/4 + i gamma_1/2 | 1/4 + i gamma_2/2 = 0.25 + 10.5110198194i | abs = 6.3e-41 |
| E_a | a = 0.2, gamma_1 | a = 0.37, gamma_3: 0.87 + 25.0108575801i | abs = 1.4e-40; FE defect of xi(s+a)xi(s-a) at 0.31 + 4.7i: 1.3e-42; -F'/F against sum Lambda(n)(n^a + n^-a) n^-6, n < 20000: 2.6e-21 (truncation) |
| T-NR | q = 3, c = 2.2 | q = 5, c = 3.7, k = 1: 1.26154987529 + 5.85594379749i; q = 2, c = -9 (heights 2 pi k/log q): 3.65177476426 + 9.06472028365i | abs = 1.4e-40, 7.3e-42; factor(s) - factor(1-s) = 0; multiplicativity defect of the shifted coefficients (q = 3, c = 2.2, coprime m, n < 60): 0 |
| interpolation twin | c = 1, root near 0.8641 + 29.9504i | prescribed s0 = 0.93 + 11.3i, c = -zeta(s0)/(L4 L5)(s0) = -1.079616 + 0.990500i: abs C(s0) = 5.7e-42; C(-k) - zeta(-k) = 0 for k = 6..11; c = 2: root 0.520831154623 + 19.6472814122i | abs = 2.6e-41 |
| DH zeros (line 2) | quoted from the map | Newton from the quoted points | 0.80851718245664 + 85.699348485378i; 0.65083008060974 + 114.16334273076i; FE defect of (5/pi)^(s/2) Gamma((s+1)/2) f(s) at 0.3 + 7.1i: 2.5e-41 (relative) |

**DH supremum abscissa, derived independently.** f(s) = 0 iff L(s, chi)/L(s, conj chi) = -(1 + i kappa)/(1 - i kappa),
a point of the unit circle with argument -(pi - 2 arctan kappa). In Bohr's torus form the ratio is the product over
p = 2, 3 mod 5 of (1 + i w_p)/(1 - i w_p), abs(w_p) = p^-sigma; each factor runs over a circle whose largest
argument is 2 arctan(p^-sigma), attained at modulus 1. So zeros exist in every strip below sigma* and none above,
where sum over p = 2, 3 mod 5 of 2 arctan(p^-sigma*) = pi - 2 arctan kappa = 2.58801829469. Primes to 2e7 plus the
tail E_1((sigma - 1) log N): sigma* = 1.1203617 (N = 1e6), 1.1203624602 (1e7), 1.1203624901 (2e7). The map's value
"about 1.1203625" is confirmed to seven digits (tail by equidistribution, not a certified bound). The floor "1.12"
of line 2 is therefore a statement with a closed criterion behind it, not only a located zero.

## 3. Citation check re-run

Own script (regex written separately) on `STATEMENT_O.md`, the map, `MAP_PENDING.md`:

- Referee files on disk per lane: all 44 "n ref" claims of section B agree. `bootstrap`, `pick-induction`,
  `sq-causal-cascade` have none, as stated. The scopes quoted were opened and agree: `c1-missing-controls/REFEREE2`
  covers Part D only; `r3-tnr-control/REFEREE` says "holds = false as labelled"; `c5-twisted-helson-arcs/REFEREE2`
  covers Lemma A step (c); `c5-repair-engine-map-r4/REFEREE` covers the second derivation of Theorem 1 and
  REFEREE2 covers Theorem 2; `c5-thin-walk-replay/REFEREE2` is a source-location note; the round-8 verdicts quoted
  in section D and E agree with the four referee files opened.
- Map rows P3, P6, P7, P8, P9, P14, P21, P23, P29, P46, Z16, F1, D1, D5, D6, Q21, T2 and section 2 rows DH, HEAT,
  TW+, TW-, EA, NR, B, THIN were read against the lines that cite them: numbers and statements agree.
- Count error: see E3.

## 4. Errors and corrections

**E1 (section C, the clause; not held as worded).** "A device that supplies R1, R3 and R4 together must read, in one
step, at least the items below" is a joint necessity. Section B gives, for each line j, a control inside read class
j. That defeats a device whose whole read set lies inside class j. It says nothing about a device that omits item j
but reads an input outside class j. Three concrete points:
(a) The source of the input-level sentence quoted at the end of section C (`stack-combinator/RESULT.md` lines
78 to 83) lists {FE, SIZE}, {FE, GEOM}, {INT, GEOM} as sets that every listed control fails; none contains EP, so
by the file's own quotation a read set can exclude all seven original controls without item 1a or 1b. The source
draws the conclusion "the input level carries no information"; the clause draws the opposite one.
(b) At conductor 1, FE with INT is Hamburger uniqueness (map section 2, "Input level"): the read class is zeta
alone, no control lies in it, and EP is not read. Item 1a is then not necessary in the sense of A4.
(c) "In one step" appears in no line of section B; every lemma is about the read set of the whole device.
Correction: state the clause as 13 conditional statements ("a device whose read set lies inside class j is defeated
by C_j in mode m"), delete "in one step", and delete "must read at least" or restrict it to "relative to the read
class of the line". The same change is needed in the first cell of proposed row O1 ("what a device must read to
supply R1, R3 and R4 together").

**E2 (A1, input codes).** A1 says "the first four are the input levels of map section 2"; the map's four are FE,
SIZE, GEOM, INT, and A1's first four are EP, POS, SUPP/SIZE0, FE. In the source, SIZE means abs(Lambda_F(n)) <=
log n with pole only at 1; A1 gives that meaning to SIZE0 and defines SIZE as "coefficients O(n^eps), pole at 1
only". With A1's codes DH has FE (A1 says so) and SIZE (bounded coefficients, entire), so {FE, SIZE} is not failed
by DH and the sentence "the minimal input sets hit by all seven original controls are {FE, SIZE}, ..." is false as
quoted. Correction: use the source's definition of SIZE in A1, or quote the sentence with the source's codes and
say which reading of FE (zeta's own equation, conductor 1) it needs.

**E3 (citation count).** `verify_citations.py` counts 56 row ids. Two of them are not row citations: "G2" is
"Lemma G2 (i)" of `c8-hecke-entropy-resonance-rigidity` (section E) and "T1" is theorem T1 of `twist-rigidity`
(line 1; the script excludes T4 for this reason but not T1). Both happen to be ids of map rows, so they are
reported as found. The lookbehind of the regex also skips an id that follows "(": L1 in "section 5 part 5 (L1,
L4)" is not checked (it is in the map). Correct count: 55 row ids cited (49 in the map, 3 pending, 3 proposed), 0
missing. The headline "0 mismatches" stands. The script checks existence of ids, not that the cited row says what
the line says; that was done by reading for the rows listed in section 3 above.

**E4 (label rule applied unevenly).** By the rule of the file (MEASURED = the closing step is numerical): line 9
closes by an exact construction (c = -zeta(s0)/(L4 L5)(s0) gives a zero at a prescribed point; the located root at
c = 1 is an illustration), and line 4 closes by the escape law, PROVED at source with one referee (the line itself
says "so ARGUED here"). Both are ARGUED by the rule; the script reads only the first word of the label. In line 2
the zero-mode step is classical (zeros of DH with Re s > 1; criterion in section 2 above) and the numerical part
is membership (Pick orders, kernel certificate). Count by the rule as written: ARGUED 11, MEASURED 1; or keep 9/3
and state that MEASURED is assigned when any closing input, including membership, is numerical. No line moves to
PROVED either way.

**E5 (floors of lines 8 and 2).** Line 8 gives floor "Re s = 1.12 (DH)" for the class "frequencies log n only,
coefficients not read". The map's own finite modification zeta(s)(1 - q^(b-s)) (section 2, "Controls added after
the table was built") has the same frequencies and zeros on Re s = b for any real b; a Dirichlet polynomial
1 - M 2^-s has zeros on Re s = log M/log 2. The class has no floor. In line 2 "nothing below 1.12" is correct as a
lower statement (sigma* = 1.12036249 for this one function); other combinations without Euler product were not
examined, so 1.12 is the floor from DH, not the floor of the class.

**E6 (modes (I) and (S) in lines 11 and 12).** In line 11 the read class contains DH and E_a, which have zeros
right of any theta < 1/2 + a: the line is mode (Z) with no floor in the sense of A4, and mode (I) adds only the
remark that no inequality is present. In line 12 the mode is written "(I)/(S)" but no intermediate statement that
is false for U is named, so mode (S) is not instantiated; only (I) is. The line 7 remark "translate by n^(-i tau)
for b + i tau" moves the pole to 1 + i tau, so the translate leaves the read class as written ("simple pole at
1"). Wording only.

**E7 (starred cells, section D counts).** The control cell of P14 is EA* (inferred) in the map; RESULT section 6
names the starred cells of P8, P25, P36 only. Section D gives "2 ref" for Z27 Theorem K and "Lemma H 3 ref": the
second file for Theorem K is `c8-repair-engine-map-r7/c7-probe-format-h-cap/REFEREE2.md`, not in the lane
directory (which has one), and `c6-marks-bc-manuscript-check` has two files, the third pass being inside
`c8-repair-engine-map-r7/REFEREE.md`. The counts are right in substance but do not follow the convention stated at
the top of the file ("files REFEREE*.md present in the lane directory"); give the paths. Several "second referee"
files were written by repair lanes of the campaign (`c6-repair-referee-debts-r5`, `c8-repair-engine-map-r7`), not
by separate referee passes; the file should say so where it counts them.

## 5. A construction the lane can use (referee's derivation, one pass: ARGUED)

Lines 1 and 5 take their zero-mode members with POS from E_a (lacks SIZE) and from the Beurling literature (not on
file). The THIN construction gives one directly. Take S with pi_S(x) = int_2^x t^(b-1) dt/log t + O(x^(b-eta))
(density t^(b-1) < 1, same greedy rule, same short-interval input) and delete the primes of S:
F(s) = prod over p not in S of (1 - p^-s)^-1 = zeta(s) prod over p in S of (1 - p^-s). Then
log(F/zeta) = -P_S(s) - sum_{k>=2} P_S(ks)/k with P_S(s) = E_1((s-b) log 2) + A(s), so F = zeta(s)(s - b) W(s), W
analytic and non-vanishing in Re s > max(b - eta, b/2). This F is a member of TW+ (eps = 0 on powers of primes in
S, 1 elsewhere): Lambda_F >= 0, abs(Lambda_F) <= log n, prime-power support, ordinary Dirichlet series, simple
pole at 1, continuation, and a simple zero at any prescribed real b in (1/2, 1). It is also a Beurling system (the
generalised primes are the primes outside S) with unimodular local parameters at each of its primes. Consistency
with Landau: log(F/zeta) has non-positive coefficients and its abscissa b is a singular point. If a second pass
confirms it, line 1 has mode (Z) for TW+ itself, and the debt "open the Beurling source" of line 5 is replaced by
the short-interval input already carried by line 7 (Huxley's asymptotic for the integers, classical). This was not
checked numerically.

## 6. Checks required by the task

- RH assumed anywhere: no. Verified height restated: no (P3 is cited as a row, with its own statement that finite
  Pick orders follow from verified height).
- Known theorems presented as new: no. The file says it contains no new mathematics; DH zeros, E_a, the twin and
  Hamburger are named as classical or elementary. Turan's equivalence and the Beurling statement are marked as
  not re-read.
- Zeta-only mechanism claimed: none, so there is no control run owed. The controls were run as functions (section
  2).
- Map not edited: confirmed (`MAP_ROWS_PROPOSED.md` is text only). The proposed rows Q26, Z30, Z31 agree with the
  referee verdicts of their lanes as quoted; EIS-w and G31 are correctly held back as drafts.

## 7. Requirement flags

| flag | value | reason |
|---|---|---|
| R1 | false | no argument; a table of read classes |
| R2 | false | no conclusion about zeros |
| R3 | false | no device; the record lists controls that satisfy read classes |
| R4 | false | no step toward the critical line |

## 8. What survives

Sections A (with E2 applied), B (lines 1 to 12 as 12 separate lemmas, labels ARGUED or MEASURED, with E4 to E6),
D and E of `STATEMENT_O.md`; `MAP_ROWS_PROPOSED.md`; the citation check with the count of E3; the four re-run
control zeros. Section C survives as a summary table of 13 conditional statements, not as a joint necessity
statement. This is one referee pass on Statement O; under the file's own rule it gives no line the label PROVED.
