# c6-repair-referee-debts-r5: referee debts of campaign round 5, map and engine bookkeeping

Internal working note, 2026-11-18. Kind: repair (referee-and-repair slot, STRATEGY 4.0 item 5). No attack. No
statement about zeros of zeta. Nothing committed, pushed or posted. Local runs only, through `scripts/memcap.sh 8`;
the compute server was not used.

**Flag required by the assignment: no PROVED step of Lemma U is broken. Family 3.1 item 11 (re-expression of the
present probe) stays closed.**

## Verdict

Six debts. Four discharged, one downgraded as instructed, one discharged with a stated limit. No score change.

| # | Debt | Outcome | File changed |
|---|---|---|---|
| 1 | Second referee of Lemma U | **discharged**: holds; two additions proved (stability under a change of the probe below the comparison error; slope version with one degenerate exception) | `push/c5-target-fe-order2-ledger/REFEREE2.md` (new) |
| 2 | Theorem 7 (iv) of the angular lane; Froehlich-Queyrut | **downgraded to ARGUED** (abstract family); Froehlich-Queyrut opened and read: Lemma 2 is READ for finite-order characters, not covered as printed for infinite order; a precise sub-statement (iv-a) proved | `push/c5-angular-family-absorption/REFEREE2.md` (new); map row Z22 |
| 3 | Hoheisel exponent in ray classes, independent of the modulus | **discharged with a limit**: a stated theorem is located (Coleman 1990, Theorem 2.1, exponent 19/24 + eps for every modulus), read through two later papers that quote it; the primary text was not opened | `push/c5-thin-walk-replay/REFEREE2.md` (new); map control row THIN; `engine/build_graph.py` (`ctl-THIN`) |
| 4a | Lemma A step (c) of the twisted Helson lane | **discharged**: holds | `push/c5-twisted-helson-arcs/REFEREE2.md` (new) |
| 4b | Theorem 2 of `c5-repair-engine-map-r4` | **discharged**: holds as stated; corollary holds for the largest real zero only; one further numerical case | `push/c5-repair-engine-map-r4/REFEREE2.md` (new); `thm2_check.py`, `.json`, `.log` here |
| 5 | Map: device rows with six corrections, Z15b, entry 49 and P46 | **discharged** | `push/OBSTRUCTION_MAP.md` (471 -> 490 lines; script `apply_map.py`, previous file in `before/`); `campaign/MAP_PENDING.md` (status section appended) |
| 6 | Engine: six device nodes, rerun, counts | **discharged** | `engine/nodes/nodes-16.json` (new), `engine/build_graph.py`, `engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json`, `engine/outcomes.json`, `engine/ENGINE_LOG.md` (section appended); previous files in `engine_before/` |

Still owed (not in this assignment or not reachable): primary text of Coleman 1990; Weil 1952 (Remark 8 of the
angular lane, used in no proof); Turan's equivalence (map row D6, cited from memory); the Baker-Harman-Pintz
counting constant; map rows for `c5-twisted-helson-arcs` (its proposed number P44 is taken), `c5-thin-propd-dichotomy`,
`c5-marks-circularity-order2`; map section 7 entries for round 5; Lemma 7.1 discrepancy against the PDF or Lean;
Theorems B, C of the marks lane (lane `c6-marks-bc-manuscript-check`).

## 0. Plan

Order of the assignment. Decisive first test: Lemma U, because a broken PROVED step would reopen family 3.1 item 11.
Method for each referee item: re-derive from the definitions without reading the first referee's derivation first,
then compare; for literature items open the source text (not recall). Read: BRIEF to the end; STRATEGY 4.0;
ROUND_LOG round 5 results and open items; map rows Z15, Z21, P46, section 4 entries 48-49, control row THIN and
the notes of section 2; RESULT and REFEREE of the six lanes named; manuscript text
(`~/lean-deps/qrh-verify/paper.txt`, lines 368-460 and 1385-1440) as text.

## 1. Lemma U (second referee)

Full report: `push/c5-target-fe-order2-ledger/REFEREE2.md`.

Statement checked: in the format of Proposition 2.1, if one J has high comparisons to two signals
f_i(Z) = (1/2 pi i) int Z^(s+c_i) e^((s-5/6)^2) H_i(s)/L^(S_i)(s, eta) ds with errors Z^(c_i + beta* - sigma_i),
sigma_i > 0 independent of the target, then c_1 = c_2.

Re-derivation [PROVED, six steps]: rapid decay of f_i at 0; Mellin transform of f_2 against Z^(-s-c_1) is
A_2(s + d), d = c_1 - c_2 > 0; g = f_1 - f_2 << Z^E so its transform is holomorphic on Re s > a :=
beta* - min(sigma_1, sigma_2 + d); A_2(s + d) is holomorphic on Re s > max(sigma_0, beta_eta) - d; so A_1 has no
pole, hence L(s, eta) no zero, with real part above max(sigma_0, a, beta_eta - d); this gives beta_eta <=
max(sigma_0, a) < beta* for every eta, against the definition of beta* as a supremum. Every step agrees with the
first referee. The hypothesis abs(H - 1) <= 1/2 is necessary: with H(s) = L(s)/L(s + delta) a signal of constant
c - delta is rewritten with constant c.

Attempts to break it:
- Voronoi on the row: Proposition 5.1 is an identity for the completed smoothed sum (read at paper.txt 1391-1440);
  J is the same number; covered.
- Voronoi then truncation or re-weighting: J' = J + R. **U-stab [PROVED]**: if R << Z^(c_1 + beta* - sigma_3),
  sigma_3 > 0 independent of the target, then J' has the same constant. So the constant can change only if the
  discarded part is as large as the signal at its top exponent, and then J' is a different probe (the open lemma
  ORDER-2, not a re-expression).
- Target functional equation: substituting it under the integral is an identity of the integrand; f and J are
  unchanged. A reflected signal Z^(-s + c') taken alone decays faster than any power as Z -> infinity; comparing J
  to it is the low estimate, not a second signal.
- Different slope: **U-slope [PROVED]**. For signals Z^(lambda_i s + c_i), (1) the top exponents
  lambda_i beta* + c_i agree; (2) if some target has a zero rho != beta* within eps_0 of the line Re s = beta*,
  then lambda_1 = lambda_2 and c_1 = c_2 (otherwise the dilation s -> beta* + kappa (s - beta*), kappa < 1, maps
  zeros to zeros and they accumulate at beta*). Not excluded: every top zero is the real point beta* itself.
- Two targets (eta and conj eta): real parts of zeros agree; no change.

Scope, as before: h <= 1 is the geometry hypothesis lx >= l and is not a consequence of Lemma U. The LP values of
the lane were not rerun here; the corrected free-geometry statement of the first referee is the one entered in the
map (row Z15b).

## 2. Theorem 7 (iv) and Froehlich-Queyrut

Full report: `push/c5-angular-family-absorption/REFEREE2.md`.

Source opened: Froehlich and Queyrut, Invent. Math. 20 (1973) 125-138, page scans of pp. 125-130 (Goettingen
digitisation). Read: Theorem 1 (characters of real representations have W = 1); Theorem 2 (E/F quadratic, chi a
character of finite order of C_E trivial on C_F: W(chi) = 1); Theorem 3 (local: W(phi) = phi(Delta) for
phi trivial on K^*, L = K[Delta]); the definition on p. 128 that "character" means finite order.

Consequences.
- Ring-class characters: finite order and trivial on the ideles of Q; Theorem 2 applies as printed. READ.
- Angular characters lambda^(6k): infinite order; Theorems 2 and 3 as printed do not cover them. At finite places
  the local statement still applies (K_v^*/F_v^* is compact and totally disconnected, so the local character has
  finite order); at the complex place the value (-1)^m for (z/abs z)^(2m) is Tate's local constant (classical,
  recalled). The lane does not depend on this: Lemma 1 (theta inversion) gives root number +1 directly; re-derived
  here (Hecke identity factor i^(-6k), dual lattice (2/sqrt 3) i O, P(i alpha) = i^(6k) P(alpha)).
- Theorem 7 (iv): not a theorem as written, because the set of admissible derivations is not defined.
  **ARGUED** for the abstract family; PROVED only as Theorem 6 (a) of the lane for the two computed families.
- **(iv-a) [PROVED]**: if a low estimate comes from a bound sum over a row set of abs(B_p)^2 <= U, then each row,
  including the one carrying the target, has abs(sum mu xi chi_p(a) w(Na/Z)) <= (U Z)^(1/2); with U = K Z^eps this
  is the abscissa (1 + kappa)/2 the ledger outputs. Proof: one term of a sum of squares. It does not cover low
  estimates that are not mean-square bounds on B.

Effect on STRATEGY 4.0, second bullet ("the row family must be nonabelian with a nontrivial weight-1 cocycle of the
epsilon factor"): the part "group families do not absorb mu" stands for the two computed families (PROVED) and is
ARGUED in general; the cocycle reading (Remark 8) is a reading with Weil 1952 recalled. The bullet should be read
as a heuristic selection rule for the next family, not as a proved necessary condition.

## 3. Hoheisel exponent in ray classes

Full note: `push/c5-thin-walk-replay/REFEREE2.md`.

Located: M. D. Coleman, Proc. London Math. Soc. (3) 61 (1990) 433-456, cited as "Theorem 2.1" by
Harman-Kumchev-Lewis (Trans. AMS 2004, p. 2, exponents 19/24 + eps and -5/24 + eps) and stated on p. 1 of Khale et
al., arXiv:2008.09677v2: for an imaginary quadratic field, a fixed nonzero ideal f and a class I of the ideal class
group mod f, the sum of log p over prime ideals of prime norm in I with x <= Np < x + h and argument in
[phi_1, phi_2] is asymptotic to (phi_2 - phi_1) h/(2 pi abs(I_f)) for phi_2 - phi_1 > x^(-5/24 + eps) and
x^(19/24 + eps) <= h <= x. Both secondary texts were opened and read as text. The primary paper was not.

With the full sector this is H_K(theta) with theta = 19/24 + eps for every modulus, constants depending on the
modulus (which is all Lemma 1* needs). Theorem 2 of the lane becomes PROVED-rel Coleman 1990 Theorem 2.1 as quoted,
with eta = 5/24 - eps: G_psi analytic and zero-free on Re s > max(b - 5/24 + eps, b/3). THIN is therefore not
marked "relative to an unlocated statement"; it is marked relative to a located statement read second-hand.
`stack-combinator/TABLE.md` has no THIN row and was not edited.

## 4. Second checks

**Lemma A step (c)** (`push/c5-twisted-helson-arcs/REFEREE2.md`): holds. u(x) = S(x)/x; u(rx) = chi(r) u(x) + o_r(1)
for fixed rational r; Lipschitz bound abs(u(x') - u(x)) <= 2(x'/x - 1) + 1/x'; abs(u(2^k y)) = abs(u(y)) +
O(y^(theta-1)) uniformly in k; with a finite net of rationals in [1, 2] this gives sup over z >= x of
abs(abs(u(z)) - abs(u(x))) -> 0, so abs(u) converges to l = limsup > 0; then abs(chi(r) - chi(r')) l <= 2(r/r' - 1)
and chi(r) = r^(-i alpha). Unimodularity is used twice. The first referee's qualifier (limsup abs(S(x))/x > 0)
stands.

**Theorem 2** (`push/c5-repair-engine-map-r4/REFEREE2.md`): every step and constant re-derived (Euler factor of
g; count in residue classes; main term c X (chi(p) - 1)/(p - 1); error abs(E(X/p)) + C_1 p X^beta; integration by
parts with abs(c) <= 1; Gallagher constant pi X + 1/delta; spacing Q^-2; (max(0, a - b))^2 >= a^2/2 - b^2; k-sums;
pi + 1 + 2/3 < 5). Holds. The corollary uses the largest real zero at two places and is proved for it only.
Numerical case not used before (`thm2_check.py`, float64, X = 2e5, chi with fifth-root values on 94 primes
p = 1 mod 4): step (ii) agrees in 24 cases, abs(T - main) between 11.6 and 83.4 against main terms up to 43885;
the assembled inequality holds at five Q with ratio lhs/rhs between 1.8e-9 and 3.1e-6. MEASURED; it confirms
consistency of the identity and not the exponent.

## 5. Map

`apply_map.py` (exact-string replacements with assertions), previous file `before/OBSTRUCTION_MAP.md`, record
`map_edits.json`.
- Section 3.9 (new): rows D1 to D7, the seven device types of `c5-device-table-extension`, with the six wording
  corrections of its referee: Turan's equivalence scoped to zeta (D6); "provable constant" for Baker-Matveev (D1);
  T_b > 0 scoped to zeta (D7); rank one PROVED on a rectangle and ARGUED for cut forms (D2); label CLASSICAL /
  ARGUED and "a prime-side embedding", not "the only" (D3); twin conditions (complex c, product non-zero at s0,
  no functional equation and no Euler product) and the rows actually entered in the map (D5, bookkeeping).
- Row Z15b: Lemma U (two referees, with U-stab and U-slope), Prop. 5.1 as the source of M + l <= 1, the four
  ledger values, and the first referee's corrected free-geometry statement (the 7/9 vertex at h = 4/3 with G = 0
  and the K-loss deleted is named).
- Row Z22: group families (angular, ring-class), Theorem 7 (iv) labelled ARGUED.
- Row P46 and section 4 entry 49: "the largest real zero b"; Theorem 2 marked as two referee passes; section
  reference 2.3.
- Control row THIN and its note: short-interval inputs as in section 3 above. Interpolation twin added to the
  auxiliary controls. Row-count line recounted (P 49, G 26, Q 22, S 12, Z 23, F 8, T 3, L 5, D 7 = 155).

## 6. Engine

`engine/nodes/nodes-16.json` holds the six device-lane nodes. `build_graph.py`: `ctl-THIN` status
proved-relative. `merge_outcomes.py`, `build_graph.py`, `generate.py --top 60` rerun through `scripts/memcap.sh 8`
(logs `engine_run.log`, `generate_top60.log`).

| | before | after |
|---|---|---|
| outcome entries (closed) / closed families | 60 (48) / 34 | 60 (48) / 34 |
| raw records / nodes (live) | 1,262 / 1,577 (953) | 1,268 / 1,592 (954) |
| map rows parsed / edges | 182 / 8,567 | 191 / 8,621 |
| device nodes closed (live) / floored / open | 52 (49) / 6 / 2 | 57 (50) / 6 / 2 |
| generated / rejected / scored | 36,471 / 27,558 / 8,913 | 36,447 / 27,557 / 8,890 |
| top 60: open device / floored only / closed device | 12 / 48 / 0 | 12 / 48 / 0 |

None of the six new nodes is in a scored candidate of the top 60. Open device nodes unchanged: `map-open-1`,
`map-open-9`.

## 7. Controls

No mechanism is claimed, so no control has a step to fail at. What was checked about controls:
- Lemma U, U-stab, U-slope use only "zeros of L are poles of 1/L" and the supremum over the family. They hold for
  every target family admitted by the Proposition 2.1 format (Davenport-Heilbronn components, zeta(s+a)zeta(s-a)
  with shifted abscissae, sign twists, THIN, unimodular twists with their own supremum). Nothing separates zeta.
- (iv-a) is positivity of a sum of squares: coefficient-blind; holds for every control.
- Theorem 2 and Lemma A concern a class of completely multiplicative chi that contains the thin twists; Lemma A's
  residual class is the window translate n^(-i alpha); Theorem 2 is not formulable for Beurling systems (residue
  classes) and has no object for Davenport-Heilbronn. As recorded by the first referees.
- Backward heat, T-NR, phase-rotated transfer operator, theta^w: no statement here applies to them.
- THIN itself: its existence in ray classes now rests on a located statement (section 3).

## 8. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (all primes, multiplicativity essential) | false | repair lane; the statements re-checked are invariance or identification lemmas. Complete multiplicativity is used in Lemma A (a) and Theorem 2 (i), but relative to zeta and with no conclusion about its zeros |
| R2 (height-uniform, every window) | false | no estimate about zeta at any height |
| R3 (every control fails at a named step) | false | no control is separated; section 7 |
| R4 (reaches the critical line) | false | nothing passes from a finite stage or from Re s > 1 |

## 9. Three weakest steps

1. **Coleman's theorem is read second-hand.** The exponent 19/24 + eps for every modulus f is taken from the
   introduction of arXiv:2008.09677v2 and the citation in Harman-Kumchev-Lewis; the primary statement (exact
   hypotheses, uniformity of the asymptotic in h, whether "ideal class mod f" is the ray class group in the sense
   used by the lane) was not opened. If the primary statement is narrower, Theorem 2 of `c5-thin-walk-replay`
   returns to "relative to an unlocated statement" and the THIN row must be reverted to that wording.
2. **U-slope has a degenerate exception and both additions have one author.** The case "every zero near the line
   Re s = beta* is the real point beta*" is not excluded, so different slopes are not ruled out there. U-stab and
   U-slope were written and checked by this lane only. Lemma U itself (equal slopes) has two referees and no
   exception.
3. **Row texts were entered by one lane without a referee of the edit.** Rows D1 to D7, Z15b and Z22 are
   compressions of lane results with referee corrections applied by hand; the Z15b free-geometry sentence repeats
   the first referee's LP values (7/9, 1/3, 2/3), which were not rerun here, and `tiers_fe2.py` has still not been
   rerun with `G=` passed. Theorem 7 (iv-a) covers mean-square low estimates only; the general clause stays ARGUED.

## 10. Follow-up

Most useful next step: open the primary text of Coleman 1990 (Theorem 2.1) and Weil 1952, and rerun `tiers_fe2.py`
with the `G` argument passed, so that rows THIN, Z22 and Z15b carry no second-hand entry. No attack follows from
this lane.

## Files

`RESULT.md`; `apply_map.py`, `map_edits.json`, `before/OBSTRUCTION_MAP.md`; `thm2_check.py`, `thm2_check.json`,
`thm2_check.log`; `engine_before/` (five files); `engine_run.log`, `generate_top60.log`. Reports written in other
lane directories: `c5-target-fe-order2-ledger/REFEREE2.md`, `c5-angular-family-absorption/REFEREE2.md`,
`c5-thin-walk-replay/REFEREE2.md`, `c5-twisted-helson-arcs/REFEREE2.md`, `c5-repair-engine-map-r4/REFEREE2.md`.
