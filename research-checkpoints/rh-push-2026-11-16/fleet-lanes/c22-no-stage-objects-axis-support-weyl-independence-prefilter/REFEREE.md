# REFEREE.md: c22-no-stage-objects-axis-support-weyl-independence-prefilter

## Independent referee report (lens: general), 2026-11-20

Independent of the author. The author's own adversarial pass is kept unchanged below this report.
Scope: RESULT.md, checks.py, checks.log, lanes.jsonl; Theorem H in `c21-br0-br3-hamburger-finite-poles-regime3/RESULT.md`
(lines 100-150); rows ZQ, SG, NR (T-NR), NR-q of `OBSTRUCTION_MAP.md`; the definition of V6 in
`c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md`. Numerics: two scripts written for this report, run locally
through `scripts/memcap.sh 8` (python3.14, mpmath 30 digits, under 10 MB, under 2 minutes; kept outside the
lane directory, described in section 3). Server not used. Literature not opened; where a classical theorem
is involved this report says "as recalled".

**Outcome: the verdict "precise obstruction, no statement about zeros of zeta, no passing object" holds, with
the corrections E1 to E7 below. No correction changes the verdict or a flag. Flags set by this referee:
R1 = R2 = R3 = R4 = false.** Nothing in the result assumes RH, restates verified height, or claims a zero-free
region. Lemmas B1, A3 and the reduction in A1 are textbook-level facts; RESULT.md section 1 says "nothing is
claimed new against the literature", which is the correct description.

### 1. Steps re-derived

| Step | Label in RESULT.md | Referee result |
|---|---|---|
| A1 (i)-(iii) | PROVED-rel Theorem H, reduction ARGUED | Conclusion confirmed, but the reduction as written does not go through; a repaired reduction is given in E1. Status after repair: PROVED-rel Theorem H (classical Hamburger with two series, as recalled) |
| A1, C = -1 | one sentence | Confirmed by a shorter route: Hamburger's theorem in the two-series form gives G = c zeta and -G = c zeta, so G = 0, against a_1 = 1 |
| A2 N1, abs(a_n) <= 1 | PROVED-rel | Confirmed: abs(b(p^k)) <= 1/k, local coefficients dominated by those of exp(sum y^k/k) = 1/(1 - y) |
| A2 N2, ZQ density | PROVED-rel the ZQ row | Re-derived directly, not taken from the row: -m'/m as a Laplace transform gives -(x^eta + x^-eta) 2 cos(gbar log x) + 2 cos((gbar + d) log x) + 2 cos((gbar - d) log x) times x^(-1/2), which is -4 x^(-1/2) cos(gbar log x)(cosh(eta log x) - cos(d log x)); in u it is even, smooth, of exponential type eta < 1/2. SG density -2(cosh(b u) - cos(g1 u)) re-derived the same way. m(s) = m(1 - s) checked numerically (2e-31) |
| A2 N3 | ARGUED | The direction the author leaves unproved has a short proof: if the prime-side distribution is tempered on u >= 1, its Laplace transform is analytic in Re s > 1/2, and it differs from sum m_rho/(s - rho) by a function analytic there; so no zero has Re rho > 1/2, and by the two-sided formula none has Re rho < 1/2. N3 can be relabelled PROVED-rel (A0) |
| A2 variants | "tested and fail" | Not established as worded: see E2 |
| A3 | PROVED | Confirmed. P_j(w_j) = P(0, .., w_j, .., 0)/P(0) shows the factors are polynomials. (b): abs(sum over i of alpha_i^k) <= 1 for all k forces max abs(alpha_i) <= 1, so the reading holds for several parameters per prime as well |
| CYC identity | used in 0.3, 2.4 | prod (1 + w^(2^k)) = 1/(1 - w): confirmed |
| B1 | PROVED | Confirmed; 1/(1 - 2^(-1/2)) = 3.414. This is the standard statement that prime powers k >= 2 contribute an analytic term in Re s > 1/2 (label CLASSICAL would be exact) |
| B2 | PROVED for Re s > 1 | Confirmed: Poisson summation, dominated convergence (the inner sum over k is bounded uniformly in N >= 1), and the powers of x that are powers of p are p^(j_0 i) with j_0 the numerator of log x/log p in lowest terms |
| B3 | PROVED | The stated limit is confirmed (sum over n of abs(m'/m)(s + i n d) converges; division by N). The "Hence" sentence is wider than what is proved: see E4 |
| V6 term | 3.4 | Lambda_V6 = Lambda - 2 log 6 on odd powers of 6; M_d term -2 log 6 . w/(1 - w^2); bound 1.7556 at Re s = 1/2: confirmed |
| T-NR line | 2.6 | zeta(s)(q^(s-1/2) + c + q^(1/2-s)) = q^(s-1/2) zeta(s)(1 - alpha q^-s)(1 - beta q^-s), alpha beta = q, alpha + beta = -c q^(1/2); abs(c) > 2 gives real roots with max modulus above q^(1/2); Lambda(q^k) = (1 - alpha^k - beta^k) log q. Confirmed (q = 7, c = 2.5: alpha, beta = -1.3229, -5.2915). Membership in the extended degree-1 space is as recalled, not checked against the source |
| DH lines | 2.6, 3.4 | b_6 = a_6 - a_2 a_3 = 1 + kappa^2, non-zero: the first off-axis coefficient is at 6. "Abscissa about 1.12": confirmed by an independent route (section 3) |

### 2. Corrections

- **E1 (A1, reduction; medium; repairable, repaired here).** Three defects in steps (i)-(ii) as written.
  (a) The one-sided test g(u) = e^(-(s-1/2)u) 1[u > 0] has a jump at 0 and is not in the Weil class named in
  (A0); the archimedean functional is not defined on it without a convention at u = 0. (b) With only
  sum m_rho abs(rho)^-2 finite, sum m_rho/(s - rho) is not absolutely convergent; the "+ const" hides this.
  (c) If the jump test is replaced by tests that vanish at 0, the argument yields only
  (log Lam)''(s) = (log Lam)''(1 - s), hence Lam(s) = C e^(K s) Lam(1 - s) with C^2 e^K = 1: a free conductor
  factor e^(-K s/2). "C^2 = 1" does not follow from (i)-(ii) alone.
  Repair. Zeta's own formula holds for the tests below, so subtract it; W_zeta cancels and need not be
  evaluated. Test 1: g(u) = u e^(-(s-1/2)u) on u > 0, 0 elsewhere (continuous, g(0) = 0, Re s > 1): gives
  sum m_rho (s - rho)^-2 - sum over zeros of zeta of (s - rho)^-2 = d/ds [G'/G - zeta'/zeta](s), both sides
  absolutely convergent. So G'/G continues to C with simple poles and integer residues, and
  s(s - 1) gam(s) G(s) = e^(A + B s) times a canonical product of genus at most 1: entire of order at most 2
  (finite order is all Theorem H reads). Test 2:
  g(u) = e^(-(s-1/2) abs(u)) (continuous, g(0) = 1, in the class for Re s > 1), transform
  1/(s - rho) + 1/(s - 1 + rho); the paired sum sum m_rho (2s - 1)/((s - rho)(s - 1 + rho)) is absolutely
  convergent and equals (log Lam)'(s) - (log Lam)'(1 - s) (derivative taken first, then evaluated at 1 - s;
  the factors s(s - 1) and e^(A + B s) cancel in the difference). For zeta the same sum is 2 (log Lam_zeta)'(s).
  The prime side of the difference is 2 [G'/G - zeta'/zeta](s). Hence
  (log Lam)'(s) - (log Lam)'(1 - s) = 2 (log Lam)'(s), that is d/ds log Lam(s) = d/ds log Lam(1 - s), so
  Lam(s) = C Lam(1 - s) with no exponential factor, and C = +-1 by applying the relation twice. Theorem H in its
  two-series form applies. With this repair Lemma A1 holds. Verdict item 0.1 should carry "relative to
  Theorem H and to zeta's explicit formula for the two tests" in place of the unqualified sentence.
- **E2 (A2, first variant; medium; wording and one unsupported inference).** Neither example satisfies the
  clauses of the object. zeta(s) zeta(2s) has Lambda(p^k) = 3 log p for even k, so it violates (mb) (the
  author's own pass, check 4, records this; RESULT.md was not changed). zeta(2s)/zeta(s) satisfies (mb) but has
  poles at the zeros of zeta, so its strip divisor is not a positive measure. The heading "divisor outside
  the open strip" contradicts the zeros on Re s = 1/4 that are the point of the example. So the inference
  "the symmetry of the strip divisor has to be in the hypothesis" is not established by these two functions
  under (ax) + (mb) + positive masses. An example that does satisfy all three clauses on the closed strip of
  (A0): zeta(s)(1 - 2^-s) (Lambda(2^k) = 0; pole at 1 only; order 1; no functional equation; zeros
  2 pi i k/log 2 on Re s = 0, off the line). For the open strip the referee has no member with all three
  clauses and no functional equation other than the sign-twist controls THIN and DEL cited in 2.6 (not
  re-derived here). The variant should be relabelled ARGUED with this example. Verdict unaffected: this
  variant is not one of the three classes of Lemma A2.
- **E3 (A2 N1; minor).** (A0) as written has the pole terms g^(0) + g^(1) and the same c(n) on both sides.
  Read literally, its degree-1 members are zeta alone: L(s + i theta, chi) has no pole at 1 and, for complex
  chi, is not self-dual. N1 silently changes (A0) ("with the conjugate-symmetric dual") without restating the
  pole terms. The sentence "at DH's own gamma factor the selection leaves no member" is true only in the
  self-dual reading (the two primitive odd characters modulo 5 are complex); in the conjugate-symmetric
  reading L(s, chi_5) and its conjugate are members with DH's gamma factor. State which reading each
  sentence uses.
- **E4 (B3; minor; scope).** M_d is defined by B2 only for Re s > 1, where B3 is immediate. The sentence
  "every functional of a member defined as a limit of averages over heights of window functionals that are
  continuous in the log derivative" is not a defined class and is not proved; what is proved is: L_(zeta m)
  - L_zeta tends to 0 at infinity uniformly on closed strips off the poles, so any limit of height averages
  of a functional that is uniformly continuous in that difference is the same for both. The first
  consequence in 3.3 (density, limsup, periodic part of the divisor) follows from this narrower statement
  and stands. Pre-filter line 1 of section 5 should carry the uniform-continuity clause.
- **E5 (3.1; minor; scope of "PROVED as stated").** B1 proves where the masses are. "The step acts only at
  parameter size p^(1/2)" and "there is no statement in Re s > 1/2 in which the step acts" are readings of
  B1 for the step of Theorem W as written, not a theorem about uses of equidistribution of multiples. The
  author's own E5 says the same; the claim line in lanes.jsonl ("so the step of Theorem W acts only at
  parameter size p^(1/2)") should read "the multiples k >= 2 carry no singularity in Re s > 1/2".
- **E6 (section 4, pivot; minor).** "The series is unbounded on every line sigma <= 1 whenever it diverges
  absolutely there, for every member" is not proved. Kronecker gives the supremum only where the series
  converges absolutely; on lines reached by continuation it is an omega statement that is classical for
  zeta (as recalled) and not established for a general member. The pivot's decision (no object) does not
  depend on it: the THIN/DEL remark carries the decision.
- **E7 (numbers; cosmetic).** The "partial sums of the majorant of R to 6e4" (4.75, 3.64, 1.83) are sums over
  prime powers m <= 6e4, that is p <= 245 for squares. They are far from the value of the majorant at
  sigma = 0.55 and 0.6: summing over p <= 2e5 with all k gives 7.72, 4.94, 1.957, and with the integral tail
  about 10.7, 5.4, 1.962. Convergence is proved in B1; the three numbers should be labelled as truncations
  at m <= 6e4 or replaced.

Not errors, recorded: (i) lists in 2.4 and 3.3 are censuses, as the author says; "no passing object" is a
statement about the versions examined. (ii) Kaczorowski-Perelli, Putnam, van Frankenhuijsen are cited from
memory; the forms quoted agree with this referee's recollection (degree in (0,1) and (1,2) empty; degree 1
= zeta and shifted primitive Dirichlet L-functions; extended degree-1 class = combinations with Dirichlet
polynomial coefficients; Putnam: no infinite vertical arithmetic progression of zeros), also from memory.

### 3. Numerical checks rerun with different cases

Lemma B2, s = 2 + 1.7i (author: 3 + 0.3i), sieve to 2e5, N = 8 and 48, lattices not in the author's table:

| x | abs(lhs - rhs), zeta, N = 8 / 48 | abs(lhs - predicted limit), N = 8 / 48 | predicted limit |
|---|---|---|---|
| 2^(3/2) (j_0 = 3, non-integer x) | 4.4e-7 / 7.2e-8 | 5.9e-2 / 8.1e-4 | log 2 . 8^-s/(1 - 8^-s) |
| 2^(1/2) (j_0 = 1) | 2.9e-7 / 4.6e-8 | 6.5e-3 / 1.8e-4 | full local factor at 2 |
| 3 | 2.2e-7 / 3.7e-8 | 1.6e-3 / 5.9e-5 | local factor at 3 |
| 36 | 2.7e-7 / 4.6e-8 | 1.2e-2 / 1.8e-3 | 0 for zeta and for V6 (only even powers of 6 on the lattice) |
| 6^(1/3) | 3.1e-7 / 5.2e-8 | 1.8e-2 / 4.0e-3 | 0 for zeta; V6 extra term is exactly constant along the lattice and equals -2 log 6 . w/(1 - w^2) |
| 10 | 2.6e-7 / 4.5e-8 | 2.3e-2 / 6.3e-4 | 0 |

The identity holds to the truncation of the prime sum (tail of sum Lambda(m) m^-2 beyond 2e5, times the comb
weight). The j_0 rule is confirmed on a non-integer x. Convergence to the limit is slow where a prime power
lies close to the lattice (x = 6^(1/3): log 11/log x = 4.015); this is consistent with the lemma, which
claims no rate. V6 rows have the same differences as zeta to 1e-15, as the lemma predicts.

Lemma B3: ZQ-type multiplier with g1 = 14.1347, g2 = 21.0220, eta = 0.2, s = 0.8 + 0.3i, d = 2 pi/log 2:
abs of the Gaussian height average of m'/m = 0.417, 0.0632, 0.00793 at N = 8, 64, 512 (ratio 8 per factor
8 in N: O(1/N)). abs(m'/m) at height 1e4 is 4.76e-11, that is 47.6 abs(s)^-3: the O(abs(s)^-3) rate holds.

DH abscissa (control run, independent route): a zero of the DH function at real part sigma > 1 requires
prod over p = 2, 3 mod 5 of (1 + i w_p)/(1 - i w_p), abs(w_p) = p^-sigma, to equal a fixed unimodular number
of argument pi - 2 arctan(kappa) = 2.5880 (kappa = 0.284079); the largest argument of one factor is
2 arctan(p^-sigma), attained at modulus 1; by Kronecker the supremum of real parts of zeros is the root of
sum over p = 2, 3 mod 5 of 2 arctan(p^-sigma) = 2.5880. Primes to 2e6 plus integral tail: sigma = 1.120
(without the tail: 1.110). The author's "about 1.12" is confirmed.

### 4. Controls

Where a mechanism is claimed to separate zeta, the result claims none: both objects are reported as failing.
The referee re-ran the passes that carry the R3 = false entries.
- ZQ in class N2: density derived in section 1; even, smooth, exponential type eta < 1/2; zero masses
  positive provided the two removed pairs are zeros of zeta (they are chosen so). ZQ is a member with a
  quartet off the line. Pass confirmed.
- SG in N2: same derivation, exponent b < 1/2. Pass confirmed.
- ZQ, SG under B3: m'/m = O(abs(s)^-3); averages tend to 0 (measured above). Pass confirmed.
- V6 at the marked step of (B): bounded term, singular only on Re s = 0. Pass confirmed; THIN x V6 not
  re-derived (definition of THIN not opened).
- E_a under (B): M_d returns a sub-series of one local factor with parameters p^(+-a); pass confirmed for
  the identity B2 in Re s > 1 + a. "True (relative to Putnam for zeta)" is as recalled.
- T-NR under (A): rejected only by (mb) at q. Confirmed (section 1). A multiplicative control failing
  through a size clause: R1 not entered, as the author states.
- DH under (A): fails (ax) at n = 6. Confirmed.
- Backward heat, U, WT, HQ1 to HQ4, NR-q, NWM, Beurling, transfer operator, theta^w rows: read against the
  map rows only; not re-derived. None of them is used to enter a flag.

### 5. Requirement flags (referee's own)

| Flag | Value | Basis |
|---|---|---|
| R1 | false | A1 holds for every ordinary Dirichlet series (Theorem H reads no Euler product); N1 rejects T-NR, a multiplicative control, by the size clause; V6 passes the marked step of (B) |
| R2 | false | No window statement is made; B3 shows the height-average statements cannot separate two divisors that differ in a bounded window |
| R3 | false | ZQ and SG pass N2 and B3; V6 passes (B); E_a, WT pass (B) |
| R4 | false | B2 is proved in Re s > 1 only; A1 obtains the continuation from the hypothesis (the two-sided formula), not from finite stages; A3 (b): stages have no zero in Re s > 0 |

About zeros of zeta: no. This report counts as one independent referee pass (general lens) for the obstruction
verdict. The two pre-filter lines of section 5 of RESULT.md may be entered with the wording of E4 (line 1)
and with "relative to Theorem H; reduction as repaired in E1" (line 2).

### 6. Requested edits to RESULT.md (author or record keeper; not made by this referee)

1. Replace steps (i)-(ii) of A1 by the two-test reduction of E1; drop "C^2 = 1" as a consequence of (i)-(ii).
2. Rewrite the first variant of 2.3 per E2 (state the clause each example violates; add zeta(s)(1 - 2^-s)).
3. State the reading of (A0) used in N1 (E3).
4. Narrow the "Hence" sentence of B3 and pre-filter line 1 (E4); narrow the lanes.jsonl claim sentence on Theorem W (E5).
5. Mark the Bohr sentence of section 4 ARGUED (E6); relabel the three majorant numbers (E7).

---

## Author's adversarial pass (kept unchanged; not an independent report)

### Original header: c22-no-stage-objects-axis-support-weyl-independence-prefilter

**This is the author's adversarial pass, not an independent referee report.** The lane had no means to
start a separate reader. Referees = 0. No flag is entered; nothing in RESULT.md counts as refereed.
An independent referee should start from section "Points for an independent referee" below.

Date 2026-11-20. Method: each lemma re-derived from its hypotheses with the opposite conclusion assumed;
each control row re-read against the map row; the numerical lines recomputed by `checks.py` (30 digits;
identities only).

### Corrections made during the pass (already in RESULT.md)

- C1. Lemma A1 was first written for even tests. With even tests the formula sees only the reflected
  average of the zero measure and gives a functional equation for G^2 (gamma factor squared), not for G;
  a non-symmetric integer measure would give G a square-root branch. The lemma is now stated for general
  tests (one-sided resolvent tests are used), and the even-test form is a remark relative to a degree-2
  converse theorem that was not checked.
- C2. Lemma A3: the hypothesis on P was reduced to P(0) != 0 (log P near 0, F'/F a Dirichlet series for
  Re z large); the earlier stability clause was not used.
- C3. TS table for (A): "(ax) and (mb) are additive in log F" was wrong for (mb), which is a convex bound.
- C4. Control rows: the SG entry had a meaningless clause; DH's size statement was replaced by the
  abscissa of L_DH; WT was marked as not a control for (A) (its zeros are translates of zeta's).
- C5. Section 3.3 first claimed "every statement on file is Bagchi-type". False: the Putnam-type statement
  (used by the br0 lane) is an exact resonance statement. The claim was replaced by the census table and
  Lemma B3.

### Checks that hold

1. A1 (iii), sign C = -1 in Theorem H: relation (T) becomes phi(x) = C x^(-1/2) phi(1/x) + Q; in (R) B is
   multiplied by C; U(t) = C sum a_n e^(-2 pi n t) is still i-periodic; residues give a_n = a_(n+1); then
   G = a_1 zeta has C = 1. Holds given Theorem H's own steps.
2. A2 (N1): abs(b(p^k)) <= 1/k gives local coefficients dominated by those of 1/(1 - y). Holds.
3. A2 (N2): ZQ's density in u is -4 cos(gbar u)(cosh(eta u) - cos(d u)); exponent eta < 1/2 for every
   admissible eta. Read from the map row; not recomputed.
4. zeta(s) zeta(2s): local factor 1/((1 - y)(1 - y^2)) = 1/((1 - y)^2 (1 + y)); Lambda(p^k) = (1 + 2 . 1[2 | k]) log p;
   this exceeds the bound (mb) as written (log p) by a factor up to 3, so the object satisfies
   "parameters of modulus 1" but not (mb) for one parameter. RESULT.md says "local parameters 1, 1, -1 of
   modulus 1"; correct as worded, and the variant concerned has no functional equation in any case. The
   Liouville series zeta(2s)/zeta(s) has Lambda(p^k) = (2 . 1[2 | k] - 1) log p and satisfies (mb) exactly.
5. B1: R_G bound is a geometric series; 1/(1 - p^-sigma) <= 3.42 for sigma >= 1/2. Holds.
6. B2: Poisson summation for the Gaussian; identity recomputed (differences 4e-13 to 6e-11, the tail of
   the prime sum at 6e4). The limit values at N = 64 differ from N = infinity by 7e-7 (x = 2), as the
   neighbours at distance log(m)/log(x) - k of order 1/N predict. Holds.
7. B3: sum over abs(n) <= 6N of abs(m'/m)(s + i n d) is bounded (terms O(n^-3)), so the average is O(1/N).
   Holds off the poles of m'/m.
8. R1 test for (B), V6: Lambda_V6(6^j) = -2 log 6 for odd j, from
   -d/ds [log(1 - w) - log(1 + w)] = -2 log 6 . w/(1 - w^2), w = 6^-s. Recomputed. Holds.

### Points that do not hold as strongly as worded, or are not established

- E1. A1 (i) is ARGUED: the Weil class as usually defined needs a decay condition that the one-sided
  resolvent test meets only for Re s > 1 and with a jump at u = 0. The standard route (Mellin transform of
  smooth compactly supported tests, then density) is not written out. The convergence clause
  sum m_rho abs(rho)^-2 finite is an added hypothesis, not a consequence.
- E2. A2 (N3), "tempered prime-side distribution iff support on the line" for a general member: one
  direction (support on the line with polynomial counting gives a tempered dual) is immediate; the
  converse for infinitely many off-line atoms is not proved here. For the verdict only the zeta case
  (classical) and the finite case (exponential sums) are used.
- E3. "Three replacements" (2.4) and the census (3.3) are lists, not classifications. The verdict
  "no passing object" is a statement about the versions examined.
- E4. The T-NR line of the R1 test for (A) depends on the recalled form of the degree-1 structure theorem
  in the extended class. T-NR = zeta times a Dirichlet polynomial in q^-s with a functional equation of
  conductor q^2 fits that form as recalled; not checked against the source.
- E5. 3.1 says that in the frequency variable "there is no statement, in Re s > 1/2, in which the step
  acts". What is proved is narrower: the masses on multiples k >= 2 form an absolutely convergent series
  there. An argument that uses multiples indirectly (for example through zeta(2s) at the point s = 1/2,
  the prime-square term) is on the boundary line and is not covered by B1.
- E6. Putnam's theorem and its finite-length forms are quoted from memory. Whether the published proofs
  use prime-power support in the way Lemma B2 suggests was not checked. B2 itself is proved only in
  Re s > 1.

### Requirement flags

R1 false, R2 false, R3 false, R4 false for both objects: agreed with RESULT.md section 7. Nothing about
zeros of zeta. Verdict "precise obstruction" stands on: A1 (rel Theorem H), the ZQ membership in N2
(rel the ZQ row), B1 and B3 (elementary).

### Points for an independent referee

1. Lemma A1 (i)-(ii): from the two-sided formula to Lam(s) = C Lam(1 - s) with G of finite order (E1).
2. Membership of ZQ in class N2 with the density moved to the archimedean side: sign, parity in u and
   growth exponent, against `c15-control-with-zeta-fe-classes-u1-u2`.
3. Lemma B3: is the class of functionals wide enough to cover every use of Weyl or Kronecker in the
   height variable on file (P39, P54, Q21 and the Putnam-type argument)?
4. E4 and E6 against the sources.
