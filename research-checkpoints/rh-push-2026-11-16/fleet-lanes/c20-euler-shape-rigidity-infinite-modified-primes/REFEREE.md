# REFEREE.md: c20-euler-shape-rigidity-infinite-modified-primes

**Status of this file: author's adversarial pass, not an independent referee.** This lane had no means to
start a separate referee process; an independent pass is owed and referees = 0 stands. What follows is a
re-derivation by different routes, a list of the corrections that the pass forced on RESULT.md, and the
points an independent referee should attack first.

## 1. Re-derivations

1. Theorem A, two routes. Route 1 (reflection, Morera, Liouville) and route 2 (one-sided Bohr spectrum) were
   written independently and give the same hypothesis set. Route 2 does not need analyticity inside the
   half-plane at all, only the uniform limit on the line; route 1 does not need almost periodicity. Both
   need the boundary function on the line to exist as a uniform limit, which is hypothesis (H).
2. Degree-one bound: n_p - 1 = (1 - alpha) y/(1 - y); on abs y <= r < 1 the modulus of y/(1 - y) is largest at
   y = r, value r/(1 - r). With r = p^(-1/2) <= 2^(-1/2): 1/(1 - r) <= 3.4143. Checked.
3. Uniqueness step: Cauchy on abs y = p^(-1/2) gives abs c_(p,k) <= delta_p p^(k/2); at sigma = 2 the local sum
   is at most delta_p p^(-3/2)/(1 - p^(-3/2)) <= 0.547 delta_p. Checked. (At sigma = 1/2 the Dirichlet series
   of N need not converge absolutely under (H) for general n_p; RESULT.md does not claim it. For degree one
   it does: c(p^k) = 1 - alpha_p for all k.)
4. Lemma C of c19 as a special case: finite S, n_p = prod (1 - alpha_j y)/(1 - y), a finite product bounded
   and continuous on Re s >= 1/2 for any alpha: (H) holds. Theorem A gives G = zeta. Agrees with Lemma C,
   including the case abs alpha > p^(1/2) (poles of G right of the line), re-checked numerically for
   q = 2, alpha = 2: abs(N(s) - N(1 - s)) = 2.19 at t = 1 and 0.564 at t = 3, lower bound for the sup 0.707.
5. Control HQ3 against Theorem A: m = (1 - alpha u + u^2)/(1 - beta u + u^2) is symmetric and not 1. N = 1/m has
   poles at u = e^(+-A), one of them in abs u < 1: (H) fails for N. m has poles at u = e^(+-B), one in
   abs u < 1: (H) fails for m. Consistent. HQ1 with eps <= 4: zeros and poles on abs u = 1: continuity on the
   closed disc fails for both. Consistent; this is why the closed disc is in (H).
6. Sign-pair example of the c19 referee, (1 - u_p)/(1 + u_p) times (1 - u_q)/(1 + u_q): symmetric, zeros and
   poles on the line; (H) fails by continuity on the closed disc. Consistent.
7. Theorem C (b): strip of width w = 2 sigma_1 - 1 < 2d; Phragmen-Lindelof admits growth exp(exp(k abs t))
   with k < pi/w, and pi/w > pi/(2d). Checked.
8. Numerics: T1 by numpy on a grid and again by mpmath at 40 digits at three heights with 12 and 20 primes;
   the truncation differences (at most 1.0e-6) are inside the tail bounds of the table (1.7e-6 to 6.0e-6 for
   the three families re-run).

## 2. Corrections made during the pass

C1. First draft of Theorem B derived the lower bound for sup abs N from the local maxima M_p >= 1 +
abs c(p) r/4 and multiplicativity. Bohr's inequality gives the bound sum abs c(p) p^-sigma <= sup abs N for
every Dirichlet series; the draft's "multiplicativity is essential here" was withdrawn. R1 is false.

C2. First draft of the filter table said every local shape on the list makes the local factor zero-free in
Re s > 1/2. False for the Ramanujan-size variant (a bound on a(p^k) makes the local factor pole-free, not
zero-free, at small p). The row and the sentence above the table were corrected: in regime 2 that variant
gets "no off-line pole of G/zeta", not "no off-line zero".

C3. First draft stated Corollary A2 only for degree one (absolutely convergent series on the line). The
Fourier-Bohr coefficient argument covers the general case under (H); the statement was widened and the
proof moved to the second form.

C4. Tolerances in section 5 were first written as 3e-5 and 4e-5; the recorded maxima are 8.2e-5 and 4.2e-5.
Corrected to 9e-5 and 5e-5.

## 3. Points for an independent referee

P1. (Framing.) "Without the pole clause" is true of G: no hypothesis on poles of G is made. But (H) is a
boundedness clause on zeta/G on the closed right half-plane. The verdict says so in statement 4; a referee
should check that no sentence of sections 0, 6 or MAP_ROW.md reads as if a mechanism beyond that clause had
been found.

P2. (Meaning of the functional equation.) Section 2.1 (ii) derives (FE) from a meromorphic functional
equation near the line. If a lane wants to apply Theorem A with a functional equation known only in a weaker
sense, the H-infinity gluing lemma is needed; it is cited as classical and was not opened.

P3. (Bohr's inequality.) Recalled from memory (Bohr 1913; H-infinity of Dirichlet series: sum over primes of
abs a_p <= sup norm). Not opened. Verdict statement 5 and the "iff" depend on it. The measured table T2b is
consistent (the product formula exceeds the Bohr sum in every cell: exp(1.20) = 3.3 > 1.58, ...,
exp(8.82) = 6.8e3 > 9.57) but is not a check of the inequality in general.

P4. (Regime 2, existence.) Theorem C does not decide whether a geometric twin exists with relative product
convergent in the open half-plane only. The text argues that the candidates with abs alpha_p = p^(1/2) have
a natural boundary on the line; this is not proved. A referee could try to settle it: for a super-sparse S
the frequencies log p are Hadamard-lacunary and gap theorems for Dirichlet series may apply to log N; the
author did not complete this (the frequency set k log p of log N has positive density, so Fabry's condition
is not met as stated).

P5. (Regime 3.) THIN and DEL are quoted from the map with continuation zeta(s)(s - b)W(s); the lane did not
re-derive that form. The sentence "sigma_rel = b" assumes the greedy sets have convergence exponent b, which
follows from the counting law quoted in the map.

P6. (Filter table.) The entries "forced" for map rows L4, L5, Z18 and X2 row 18 match the row's stated
local-shape hypothesis against Theorem A; the devices themselves were not re-run and those rows carry
ARGUED or MEASURED status on file.

P7. (Scope of Corollary A1.) Bounded d_p and bounded parameters are assumed. For unbounded parameters the
only condition proved sufficient is (H) itself. The assignment's hypothesis "sum over S of p^(-1/2) finite"
alone, with unbounded alpha_p, is not covered: it falls in regime 2 or 3.

## 4. Controls

Each control of the assignment was run against the hypothesis list of Theorem A (RESULT.md section 4). None
satisfies it; the failing hypothesis is named in each row. The theorem holds unchanged with DH or a Beurling
zeta as base. R3 is therefore not claimed, correctly.

## 5. Verdict of the pass

The PROVED items (Theorem A, Corollaries A1, A2, Lemma A0, Theorem C) survived the re-derivations with the
corrections C1 to C4 entered. The lane's outcome is an identification in class U3 with a three-regime
boundary; it makes no statement about zeros of zeta and raises no requirement flag. Independent referee:
owed.

---

# Independent referee pass (lens: general), 2026-11-20

Appended below the author's pass; the author's text above is unchanged. Scope: RESULT.md, checked against
c19 Lemma C / Q-inf and the map entry for HQ1, HQ2. One numeric rerun on a different case (local, through
`scripts/memcap.sh 8`, numpy float64, planned allocation 0.29 GB, under 1 minute; script kept outside the repo,
not part of the lane). Server not used.

## R-1. Verdict of this pass

**Holds as a partial result (identification, class U3). Every PROVED step was re-derived and confirmed.** No
statement about zeros of zeta is made and none follows. Requirement flags set by this referee:
R1 = false, R2 = false, R3 = false, R4 = false. Three wording defects (E1 to E3) and one provenance note (E4)
are listed; none touches a proof.

## R-2. Re-derivation of the PROVED steps

1. Theorem A (i). Under (H), abs(n_p(p^-s) - 1) <= delta_p on Re s >= 1/2 (maximum principle on the closed
   disc), so the product converges absolutely and uniformly there, abs N <= exp(sum delta_p), N is analytic in
   the open half-plane and continuous on the closed one. Schwarz's lemma gives
   abs(n_p(y) - 1) <= delta_p abs(y) p^(1/2), so N -> 1 as sigma -> +infinity uniformly in t. Confirmed.
2. Theorem A (ii). zeta/G is meromorphic near the line and symmetric (ratio of two functions with the same
   gamma factor); a meromorphic function bounded on one side of a point has no pole there; so (FE) holds for
   the boundary values of the product. Confirmed.
3. Reflection form. E = N on Re s >= 1/2, N(1 - s) on Re s <= 1/2; on s = 1/2 + it the two values are N(1/2 + it)
   and N(1/2 - it), equal by (FE); Morera, Liouville, limit 1. Confirmed. Cauchy on abs y = p^(-1/2):
   abs c_(p,k) <= delta_p p^(k/2); at sigma = 2 the local sum is <= delta_p p^(-3/2)/(1 - p^(-3/2)) <= 0.547 delta_p
   (worst case p = 2). Absolute convergence at sigma = 2 and N = 1 give c(n) = 0, n >= 2. Confirmed.
4. Bohr form and Corollary A2. Each local factor on the line is in the disc algebra, hence a uniform limit
   of polynomials in p^(-1/2 - it); the finite products are uniform limits of trigonometric polynomials with
   frequencies -log n; the coefficient at -log n is c(n) n^(-1/2) (unique factorisation is used here, only to
   label coefficients); Fourier-Bohr means are 1-Lipschitz in sup norm, so they pass to the limit. f(-t) has
   no frequency -log n for n >= 2. Hence abs c(n) n^(-1/2) <= sup abs(f - g). Confirmed. Small gap in the
   write-up: the second form ends "f = 1, then conclude as before"; the direct conclusion is that c(n) = 0
   for n >= 2 already gives c_(p,k) = 0, so n_p = 1. No extra input is needed.
5. Degree one: n_p - 1 = (1 - alpha) y/(1 - y), sup on abs y <= r is abs(1 - alpha) r/(1 - r), 1/(1 - 2^(-1/2)) =
   3.4142. (H) is exactly sum abs(1 - alpha_p) p^(-1/2) finite. Bounded degree: bound as written. Confirmed.
   Lemma C of c19 (finite S, any degree, any complex alpha) satisfies (H) and is covered. Confirmed against the
   c19 text.
6. Lemma A0 and base-blindness: same three lines; the constant is c(1) because a Dirichlet series convergent
   somewhere tends to c(1) at +infinity. B m has the functional equation of B iff m is symmetric. Confirmed.
7. Theorem B: Bohr's inequality (sum over primes of abs a_p <= sup norm for a Dirichlet series bounded in a
   half-plane) is classical and is recalled correctly; the "iff" for degree one follows. The Kronecker
   product formula in the region of uniform convergence is correct.
8. Theorem C. (a) N analytic in Re s > 1/2 so m = 1/N has no zero there; symmetry gives the left side;
   G = m zeta. Confirmed. (b) strip width 2 sigma_1 - 1 < 2d, admissible growth exponent pi/(2 sigma_1 - 1) >
   pi/(2d) > k; N bounded on Re s >= sigma_1 (summability at sigma_1) and on the reflected edge; bounded entire,
   limit 1. Finite-order clause: N = zeta/G is meromorphic of finite order; without poles it is entire of
   finite order (T(r) = m(r), log M(r) <= 3 T(2r)), which is admissible. Confirmed. (c) for
   abs alpha_p <= p^(1/2): sup over abs y <= p^-sigma of abs(m_p - 1) <= abs(1 - alpha_p) p^-sigma/(1 - 2^(1/2 - sigma)),
   summable for each sigma > 1/2. Confirmed.

## R-3. Numeric rerun, different case

S = next prime after 4^j, j = 1..15 (5, 17, 67, 257, 1031, 4099, ...; sum p^(-1/2) = 0.9366; tail of the
infinite set <= 3.1e-5). t in [0, 3e4], step 0.01. Three families not in the author's table.

| Family | sup abs D (grid) | A2 bound | sup abs N (grid) | exp(sum delta_p) |
|---|---|---|---|---|
| alpha = i | 4.2146 | 0.6325 | 4.0144 | 7.2276 |
| alpha alternating -2, (1 + i)/2 | 7.8586 | 1.3416 | 6.7372 | 26.069 |
| alpha = 3 (pole of G right of the line at p = 5) | 5.0256 | 0.8944 | 3.3868 | 16.398 |

Both inequalities hold in every row. Fourier-Bohr means of N(1/2 + it) n^(it) for n = 5, 17, 85, 25, 335 agree
with c(n) n^(-1/2) to within 1.2e-4 in all 15 cases (example alpha = i, n = 85: -0.21694i against -0.21693i);
for n = 6 and 35 (not S-smooth) the means are below 4.6e-4; means of N(1/2 + it) n^(-it) are below 6.4e-5 in all
21 cases. Kronecker formula, primes 3, 7, 11, alpha = 2, -1, i, sigma = 0.7: grid sup 2.91290 against product of
local maxima 2.91304. All consistent with A2, Theorem A (i) and Theorem B.

## R-4. Controls

No zeta-only mechanism is claimed, so there is nothing for a control to pass or fail beyond the hypothesis
table. Checked by hand: HQ1, m = 1 + eps u/(1 - u)^2 is u -> 1/u symmetric; zeros solve u^2 + (eps - 2) u + 1 = 0,
on abs u = 1 for 0 < eps <= 4; pole at u = 1; (H) fails for N and for m. HQ2 at eps = 1e-2:
u^2 - (2 +- 0.1 i) u + 1 = 0 has roots of modulus 1.2517 and 0.7989 (the lane's 0.799). T-NR: u^-1 unbounded on
Re s > 1/2. ZQ: an almost periodic function with a limit at infinity is constant. The base-blind statement
(Theorem A with DH or a Beurling zeta as base) is correct and is the reason R3 is false.

## R-5. Errors and defects

E1 (wording; conditional on RH as written). Verdict statement 8, the section 6 column "Regime 2" ("no twin
with an off-line zero") and section 6 reading (2) ("no control with zeta's functional equation, the local
shape and an off-line zero exists there") say more than Theorem C (a). What is proved: a regime-2 twin has no
off-line zero that is not a zero of zeta. "No off-line zero" is that statement plus RH. Statement 6 (a),
Theorem C (a) and MAP_ROW.md ("an off-line zero of its own") have the correct form; the three places above
should be changed to it before the row is entered in the map.

E2 (inconsistency). Verdict statement 7 says Q-inf "remains OPEN in this regime only" (regime 3). The regime
table and statement 6 leave existence of a twin OPEN in regime 2 as well. Q-inf is open in regimes 2 and 3;
MAP_ROW.md states this correctly.

E3 (framing of "no pole clause"). True of G for geometric factors. For general L_p, hypothesis (H) requires
n_p analytic in the disc, which is a zero-free clause on the local factors of G in Re s > 1/2, and summable
deviation, which is a global size clause. The verdict says the second; the first should be stated next to
"No pole clause on G" for the general (non-geometric) form of Theorem A.

E4 (provenance). "New against the record" is correct for the campaign's own record. Against the literature
Theorem A is not a new theorem: reflection plus Liouville applied to a quotient of two L-functions with the
same functional equation is the standard argument of strong multiplicity one for the Selberg class
(Murty-Murty 1994 and later refinements), here applied without the Selberg axioms on G because the
summability hypothesis supplies the bound directly. The file does not claim literature novelty; the map row
should carry "elementary; standard technique".

Not errors, unverified here: the form zeta(s)(s - b)W(s) for THIN/DEL (quoted from the map, author's P5); the
"forced" entries for rows L4, L5, Z18, X2 row 18 (devices not re-run, author's P6); the ARGUED natural-boundary
expectation in regime 2.

## R-6. Checks against the campaign rules

RH is not assumed in any proof (only the wording in E1 implies it). Verified height is not used or restated.
No statement about zeros of zeta. Numbers are sanity checks; the proofs do not depend on them.

Flags (strict): R1 false (no multiplicativity in the proof; Lemma A0). R2 false (no window statement).
R3 false (base-blind). R4 false (works only where the relative product already reaches the line).
