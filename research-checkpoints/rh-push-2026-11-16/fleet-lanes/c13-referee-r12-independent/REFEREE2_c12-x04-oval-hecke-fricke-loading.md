# REFEREE2: c12-x04-oval-hecke-fricke-loading (independent second referee)

Date 2026-11-19. Written from the lane's RESULT.md only; the lane's REFEREE.md was not read before this report was complete. Script: `item135.py` (log `item135.log`), mpmath 30 digits and Arb 128 bits, local, `scripts/memcap.sh 8`. Primes used here: 11, 13, 17 (the lane used 3, 5, 7).

## Verdict on the two statements asked

1. **Reduction to c(pm) = c(m): holds.** Summed over the complex isogenous points, the weight-1/2 operator T_(p^2) returns dilates of theta; with the real points the relation is the eigen-equation T_(p^2) theta = (1 + 1/p) theta, which for a series sum c(m) e(m^2 tau) is equivalent to c(pm) = c(m) for all m.
2. **T-NR twin of the complex-point multiplier: holds as an algebraic identity, in a narrower sense than the name suggests.** C_q(s) Lambda(s) = -q^(-3/2) Lambda(s)(2 cosh((s - 1/2) log q) + c) with c = -(q^(3/2) + q^(1/2)). This is the member of the one-parameter T-NR shape with **c < -2 and |c| > sqrt q + 1/sqrt q**: its extra zeros are real (and their translates by 2 pi i k/log q), on Re s = 1/2 +- arccosh(|c|/2)/log q, **outside the critical strip** (Re s = 2.2423, 2.1098, 2.0675, 2.0360 at q = 3, 5, 7, 11; each certified by a sign change of C_q on the real axis in Arb). It is not the strip control (2 < c < sqrt q + 1/sqrt q, zeros with 1/2 < Re s < 1), and in the Bost-Connes lane the c < -2 member is recorded as failing positivity of its density. The lane prints the zero locations, so nothing is hidden; the round-log phrase "is a T-NR twin" should carry "(c < -2, extra zeros outside the strip)".
   What the control row needs is a different and stronger fact, which also holds: **every** T-NR function Lambda(s)(q^(s-1/2) + q^(1/2-s) + c) is the Mellin transform of (q^(-1/2) D_(q^-2) + q^(1/2) D_(q^2) + c) theta, an element of the module A theta, fixed by W (because W D_l W = l^(-1/2) D_(1/l) maps the first term to the second), and positive on the arc when c > 0. So T-NR with c > 2 passes positivity, the Fricke equation and membership in the module. This is the statement round 13 should cite.

## 1. Re-derivation

- **Operator formula (RE-DERIVED from the point formula).** First sum: sum_(b mod p^2) e(nb/p^2) = p^2 [p^2 | n] gives a(p^2 n). Second: sum_b (b/p) e(nb/p) = (n/p) G_p gives p^(-1)(n/p) a(n). Third: p^(-1) a(n/p^2). This is Shimura's T(p^2) in weight 1/2 with trivial character (CLASSICAL; normalisation not opened, as the lane says).
- **On theta.** a(n) is supported on squares: U_(p^2) theta = theta; twisted term p^(-1)(theta - D_(p^2) theta); third term p^(-1) D_(p^2) theta; total (1 + 1/p) theta. Real points: b = 0 in the first sum and the third term. Complex points: p^2 - 1 and p - 1. Cx_p theta = theta - p^(-2) D_(p^-2) theta + p^(-1)(theta - D_(p^2) theta). Correct.
- **Check at new primes (MEASURED, 30 digits).** p = 11, 13, 17, x = 0.21, 0.9: |sum over the complex points computed point by point - dilate formula| <= 4.0e-29; |T_(p^2) theta - (1 + 1/p) theta| <= 4.0e-29 (130, 180, 304 complex points).
- **Equivalence with c(pm) = c(m) (RE-DERIVED).** For sum c(m) e(m^2 tau) the eigen-equation reads c(pm) + p^(-1)[p does not divide m] c(m) + p^(-1) c(m/p) = (1 + 1/p) c(m). For p not dividing m: c(pm) = c(m). For m = p^j m_0 this is the recursion c_(j+1) = (1 + 1/p) c_j - p^(-1) c_(j-1) with roots 1 and 1/p and c_1 = c_0, so c_j is constant. Hence the equation is equivalent to c(pm) = c(m) for all m, the Euler factor (1 - p^(-s))^(-1). The lane states this in one line; it holds.
- **Lemma 2 (RE-DERIVED).** M[D_l g] = l^(-s/2) M[g]; R_p = p^(s-2) + p^(-1-s) = 2 p^(-3/2) cosh((s - 1/2) log p); C_p = 1 + 1/p - R_p. Identity (c) certified in Arb at three complex points for q = 3, 5, 7, 11 (difference below 3e-36). (d): min of C_p on the line is 1 + 1/p - 2 p^(-3/2) = 0.9484, 1.0211, 1.0349, 1.0361 at p = 3, 5, 7, 11. Correct.
- **Lemma 3 (RE-DERIVED).** X = a + bW and W g = g give X g = (a + b) g. Commutator multiplier 2^(-1/2) 2^(s/2) - 2^(-s/2) = 2^(3/4) sinh((s - 1/2)(log 2)/2). Correct.
- **p = 2.** U_2 theta = theta(2 tau): correct (n^2 even iff n even).
- **Termwise loss.** sum_(b != 0) theta(tau + b/p) = p theta(p^2 x) - theta(x) exactly (Gauss sum over b). Correct.
- **One complex point at p = 5 (pivot, checked although outside the two statements).** The displayed identity holds: residual 1.2e-31, 3.6e-31 at s = 2.3 + 1.1 i for b = 1, 2 (Hurwitz zeta); the real part is cos(2 pi b/5) zeta(s)(1 + (b/5) sqrt 5 5^(-s)), re-derived.

## 2. Referee addition: one MEASURED cell can be PROVED

Control table, T-NR row: "Cx_p theta > 0 at the 9 points of part A". Cx_p theta > 0 on the whole arc: theta(x) - theta(p^2 x) >= 0 (theta decreasing), and by Jacobi p^(-2) theta(x/p^2) = p^(-1) x^(-1/2) theta(p^2/x) < x^(-1/2) theta(1/x) = theta(x). Two lines; MEASURED can be replaced by PROVED.

## 3. Labels

| statement | lane label | this referee |
|---|---|---|
| Lemma 1 (b), (c), (d) | PROVED | hold |
| Lemma 1 (a): the complex points are off the real locus outside a countable set of x; count 2 real | PROVED | not re-derived by this referee (one-sentence argument about the real arcs of X_0(4)); the reduction does not use it. Keep PROVED only if the first referee re-derived it; otherwise ARGUED |
| Lemma 2 (a), (b), (d); Lemma 3 | PROVED | hold |
| Lemma 2 (c) "T-NR twin" | PROVED | holds; restrict wording: c < -2, extra zeros outside the strip |
| "the relation is c(pm) = c(m)" | PROVED | holds (equivalence written out above) |
| T-NR control row "passes" | stated; MEASURED positivity | holds, for the reason given under statement 2; positivity of Cx_p theta now proved |
| E_a, Epstein, DH rows; pivot zeros; Lemma 4 | MEASURED / PROVED | not checked (outside the two statements), except the p = 5 identity |

No PROVED label is broken. The closure "the candidate is an identity; T-NR passes every step" stands.
