# REFEREE (general lens): c19-u4-joint-prime-phase-quadratic-dp-zeros

Date 2026-11-19. Adversarial pass on RESULT.md. Scripts of this pass: `/tmp/ref_c19u4/ref.py`, `ref2.py`
(float64, local, through `scripts/memcap.sh 8`; they reuse the lane's zero finder, with independent
coefficient recursion, quadrature, test functions and cases). No server unit.

**Referee verdict: does not hold as worded; holds after correction E1.** The verdict "precise obstruction, no
statement about zeros of zeta, stage A stop" survives. One claim that appears in the summary, in step M, in
the stage A table, in section 5 and in the proposed map row is false: **the Liouville twist does not pass step
(2) of candidate (J)**. It fails at the cross atom p q^2 (first at n = 12). All other PROVED steps were
re-derived and confirmed. Flags set by the referee: R1 false, R2 false, R3 false, R4 false.

## 1. Step-by-step

| step | finding |
|---|---|
| Lemma Q2, line 1 | Confirmed. sum_n Lambda_D(n) n^(-1/2) phi(log n) = (1/2 pi i) int_(c) (-D_P'/D_P)(s) phihat(s - 1/2) ds; support of phi below u keeps n < P only, where Lambda_D = Lambda_F; support above 0 makes phihat(s - 1/2) tend to 0 as Re s -> -inf while D_P'/D_P -> -u stays bounded; residues -phihat(w_beta). Sign correct |
| Lemma Q2, line 2 | Confirmed. D''/D = (D'/D)' + (D'/D)^2 has coefficients Lambda log + Lambda * Lambda, which for n <= P depend only on a_1..a_n; residue at a simple zero is D''(beta)/D'(beta); D''/D -> u^2 on the left. Sign correct |
| Lemma Q2, line 3 | Confirmed. With D'/D = 1/(s - beta) + g the residue of D''/D is 2 g(beta), and g(beta) = -u/2 + lim sum' 1/(beta - beta'). Constant -u/2 re-derived (limits 0 and -u of D'/D at +inf and -inf against +-u/2 of the symmetric sum). Numerically the truncated third line converges like 1/T: error 0.233, 0.110, 0.055, 0.028 at T = 30, 60, 120, 240 (zeta, P = 9); same rate for the truncated Moebius series, P = 7 |
| Lemma Q2, "the sums converge absolutely" | Not proved for the second-order sum (E3). It needs a polynomial upper bound for D_P''(beta)/D_P'(beta), i.e. a lower bound for the distance between zeros; the text gives none. The identity is established as a limit over heights T_k (contour form), which is what the check tests |
| Lemma N | Confirmed. c_k(1) = 0, a(n) log^k n = c_k(n) + sum_{1<d<n} c_k(d) a(n/d), induction. The inclusion in Theorem P (row P56: non-negative measure, zeta's functional equation, (s-1)G entire of finite order) is correct. The lemma is elementary and adds positivity to a set that Hamburger's theorem already identifies for ordinary Dirichlet series; it is a bookkeeping statement, not a new theorem |
| Candidate (J), decomposition | Confirmed. Lambda_2 = sum_p Lambda_{2,p} + 2 sum_{p<q} Lambda_p * Lambda_q; (2k - 1) log^2 p for zeta; J_P(phi) >= 0 for zeta is trivial, as the lane says |
| Step M, "among sign chains exactly eps = +1 and eps = -1 (Liouville) pass" | **False (E1).** |
| Stage A rows E_a, DEL, sign chains (p q), T-NR | Confirmed by hand and by recomputation: E_a (a = 0.2, n <= 30) min Lambda_2 = 0; chain eps(3) = -1 negative at 6, 12, 15, 21, 24; T-NR values 4.81, -7.52 reproduced from r_1 + r_2 = -c sqrt q, r_1^2 + r_2^2 = (c^2 - 2) q; for c < -2 both roots are positive with product q, so every Lambda_T(q^j) < 0 |
| Stage A row Liouville | **False (E1).** |
| Stage A rows ZQ, DH, HEAT, HQ2 | Not re-derived beyond the definitions in the map; ZQ, DH, HEAT are labelled ARGUED by the lane. HQ2 with q > P has zeta's D_P (trivial) |
| Theorem K1 | Confirmed. abs(n^(-i tau) - eps(n)) <= delta Omega(n) <= delta log_2 P; relative density from Kronecker on the torus; Hurwitz. This is Bohr's equivalence theorem for a finite Dirichlet polynomial; the lane attributes it (Kronecker, Hurwitz) and does not present it as new. Rerun: eps(3) = -1, P = 10, tau = 7151.986, torus distance 0.0217, sup over two segments of abs(D^eps - D(. + i tau)) = 0.448 against the bound 2.95 |
| Lemma K2 | Confirmed. Two patterns differing at p force abs(tau - tau') log p/(2 pi) >= 1/2 - 2 delta. Brute count (P = 7, 11, 13; T = 200, 500, 300): 16, 32, 64 patterns against bounds 1240, 3817, 12248. The bound is far from tight at these sizes; the vanishing fraction at T = P^(1/theta) follows from 2^pi(P) growing faster than any power of P |
| Proposition K3 | Confirmed, trivial: a(n) = 1 + q^b [q divides n]. The HQ1 part is relative to c18 Proposition F (text read, not re-derived) |
| Section 4 "Reading" | ARGUED as labelled; not a proved dichotomy |

## 2. Errors and corrections

- **E1 (false control entry; affects the claim text and the proposed map row).** For a completely
  multiplicative eps, Lambda_eps(p^k) = eps(p)^k log p. For Liouville the cross product
  Lambda(p^j) Lambda(q^k) = (-1)^(j+k) log p log q is negative whenever j + k is odd. First atom: n = 12 = 3 * 4,
  mu_cross(12) = 2 Lambda(3) Lambda(4) = -2 log 2 log 3 = -1.523. Recomputed (independent recursion from
  a(n) log^2 n = sum c(d) a(n/d)): Lambda_2 of the Liouville series is negative at 12, 18, 20, 28 (pure cross
  atoms) for P up to 30. The lane's check used P = 10, where the only cross atom is 6 = p q. So: Liouville
  passes step (2) only for P <= 12; for larger P it fails at p q^2. Among sign chains only eps = +1 passes at
  every P. Consequences:
  - Delete "Liouville" from every list "E_a, DEL, Liouville pass every step" (summary items 3, section 3
    table and result paragraph, section 5 R3, section 6 map row, lanes.jsonl claim).
  - The correct "all atoms in phase with the opposite sign" member is 1/zeta (Lambda = -Lambda_zeta; every
    cross product positive). Recomputed: truncated Moebius series, Lambda_2(6) = +1.523. It has no functional
    equation of zeta's type and its strip singularities are poles, so it is a weaker control than the lane
    took Liouville to be.
  - The stage A stop is unaffected: E_a and DEL pass steps (1) to (3), HQ2 passes at each P. R3 stays false.
  - The sentence "the read set of (J) is contained in 'all atoms of Lambda in phase'" is right in the sense
    all >= 0 or all <= 0 over the primes that occur; Liouville is not in that set.
- **E2 (Liouville row of the Q2 table).** The defect 5e-7 at P = 10 is reproduced with a second test function
  (2.0e-7) and comes with a closest zero pair at distance 0.218 and max abs(D''/D') = 11.4, against gap > 1
  and ratio < 5.1 in the other runs. At P = 13 the Liouville defect is 4.1e-10. This supports the lane's guess
  (near-double zero, float64 Newton), and it shows the absolute-convergence remark is the fragile point (E3).
- **E3 (convergence).** "phihat decays faster than any power, so the sums converge absolutely" covers the
  first-order sum. In the second-order sum the weight D''(beta)/D'(beta) is unbounded when two zeros
  approach; no bound in height is given. State Lemma Q2 with the sum taken as the limit over rectangles whose
  horizontal sides avoid the zeros, or add a separation bound. Hypothesis "simple zeros" is also needed at
  every height and is not verified for zeta's D_P; at a multiple zero the residue formula changes.
- **E4 (novelty).** Lemma Q2 is the second-derivative explicit formula of the exponential polynomial D_P
  (Hadamard product, two limits of D'/D, residue calculus); Theorem K1 is Bohr equivalence; K3 is one line.
  Correct label: PROVED, CLASSICAL in content. The lane does not claim more; the map row should say so.
- **E5 (scope of the closing sentence).** "Closed: do not look for a zero statement in sign relations between
  atoms at different primes" is supported for the pure cross form (J) and for sign conditions on Lambda_k
  atoms (Lemma N). It is not a classification of cross-prime relations; section 7 item 3 already limits the
  scope, and the map row should carry that limit.

## 3. Numeric rerun (different cases)

Zeros by the lane's Newton grid, list complete by winding number in every run; T = 120; Simpson quadrature;
two test functions different from the lane's (phiA = x^6 (1-x)^7 cos(2x) scaled, phiB = sin^10 e^(-0.4x)).

| series | P | zeros = winding | first-order defect | second-order defect |
|---|---|---|---|---|
| zeta, phiA | 9 | 84 | 7.1e-11 | 1.1e-10 |
| Liouville, phiB | 13 | 97 | 5.9e-10 | 4.1e-10 |
| Liouville, phiB | 10 | 88 | 2.3e-9 | 2.0e-7 |
| E_a, a = 0.35, phiA | 11 | 92 | 6.7e-11 | 1.7e-10 |
| random real coefficients (seed 7), phiB | 8 | 80 | 5.3e-11 | 1.2e-10 |
| zeta, phiB (also the D_P of zeta(s)(1 + 11^(b-s))) | 10 | 88 | 3.3e-10 | 6.1e-10 |

Lemma Q2 holds on all new cases, including a series with random real coefficients (no multiplicativity).

## 4. Controls, assumptions, restatement

- No step assumes RH. No step restates verified height (no zeta zero is used). Nothing is presented as a new
  theorem that is classical, subject to E4 for the map wording.
- No zeta-only mechanism is claimed. (J) holds for zeta, E_a, DEL, 1/zeta, and for HQ2 with q > P; it fails
  for every non-trivial sign chain including Liouville (E1), for T-NR, and by support for DH, HEAT, ZQ.
- The server test was not run. Its outcome for (J) is determined by sign tables, with the correction that
  Liouville fails once P > 12; the lane's reason for not running it stands.

## 5. Requirement flags (referee)

- R1 false: Q2 and N use a_1 = 1 only; (J) is implied by Lambda >= 0; no conclusion uses multiplicativity.
- R2 false: no zero statement; K1 shows height-uniform statements at fixed P are shared by all chains.
- R3 false: E_a and DEL pass every step carried out.
- R4 false: step F not completed; K3.

## 6. Surviving claim

No statement about zeros of zeta. Lemma Q2 (explicit formula of D_P at second order; classical in content;
sum taken as a limit over heights; simple zeros assumed; float64 check to 1e-9 at P <= 14, 14 cases over two
passes) and Lemma N are correct. Candidate (J): non-trivial sign chains fail at p q, Liouville at p q^2
(P > 12), T-NR at q^2 p or q p; E_a and DEL pass every step, HQ2 passes at each P, 1/zeta passes the sign
step. K1 (Bohr equivalence at fixed P), K2 and K3 are correct. Verdict precise-obstruction stands after E1.
