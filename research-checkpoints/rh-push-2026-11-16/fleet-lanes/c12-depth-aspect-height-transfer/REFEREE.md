# REFEREE: c12-depth-aspect-height-transfer (author's adversarial check; NOT an independent referee)

Date 2026-11-19. Written by the lane's own agent in a second pass. It does not count as a referee under `campaign/METRIC.md`: referees = 0. No server use. An independent referee should replace or append to this file.

## Verdict of the self-check

Holds as a precise obstruction with the corrections C1 to C5 below already applied to RESULT.md. Flags R1 = R2 = R3 = R4 = false. aboutZeros = false.

## 1. Re-derivations

**Lemma P.** prod (m + a_i H) = sum_j e_j(a) H^j m^(s-j). Newton: j e_j = sum_{i=1}^{j} (-1)^(i-1) e_(j-i) P_i, so P_1..P_(r-1) equal implies e_1..e_(r-1) equal (division by j over Q is harmless: the e_j are integers and equal as rationals). Difference divisible by H^r. Exact check: 0 failures, r = 2..5, 3 moduli, 399 values of m.

**Data.** Power sums recomputed by hand for r = 4 (22; 186; 1738) and r = 5 (45; 625; 9585; 153409) and asserted in the script. dP_r = 2, 36, 720, 25200, so kappa = 1, 12, 180, 5040.

**Lemma X, each inequality.**
- x in [x_0, x_u] gives kappa abs(t) x^r in [1.12, 4.5]; with the 10 percent window abs(tD) is in [1.008, 4.95]. On [1.008, 4.95] the minimum of abs(e^(i theta) - 1) = 2 abs(sin(theta/2)) is at theta = 1.008: 0.9657 > 0.958. Confirmed.
- Interval length (H/x_0)(1 - (1.12/4.5)^(1/r)): 1 - exp(-1.391/r) >= 0.9/r for r >= 2 (r = 2: 0.501 against 0.45; r large: 1.391/r - 0.97/r^2). With 1/x_0 >= 3r the length is at least 2.7 H >= 2, so it contains two consecutive integers, one prime to p.
- Positivity and size: m >= H/x_u >= H/x_1 >= 2AH; m + a_i H >= AH > 0; m + a_i H <= H/x_0 + AH.
- Product error: for unimodular or zero u_i and unimodular v_i with abs(u_i - v_i) <= eps, abs(prod u - prod v) <= s eps (telescoping; abs(u_i) <= 1). chi(m + a_i H) is unimodular (prime to p).
- The constant c: both products have s factors, so c^s cancels. For this the two multisets must have the same size, which is part of the definition.
- chi need not be primitive and q need not be a prime power; only q | H^r is used.

**Lemma D.** log_p (Iwasawa branch) has kernel on Q^x equal to +-p^Z; a relation among log_p(l), l != p, gives prod l^(c_l) = +-p^j, hence c = 0. Density: the dual of Z_p is Z[1/p]/Z; the annihilator of the image of a dense-image map is the kernel of the dual map; injectivity of Z^n -> Z_p gives dense image of the restriction. Standard.

## 2. Corrections applied during the check

- C1. The first draft took x_1^2 = 0.18 for r = 2; the series -log(1 - u) - u at u = 0.18 is 0.01845 > 0.018. Replaced by x_1 = 0.419 (computed), t_2 = 40.3 (the binding term is (3r)^r 1.12/kappa), statement for abs(t) >= 41.
- C2. Corollary X5 first said "once q abs(t) >= C p^20" without C and without the threshold in t. Now: abs(t) >= t_5 = 2.27e10 and q abs(t) >= (9p)^20 (9.1e18 if 5 | k). The headline paragraph was narrowed accordingly.
- C3. Section 3.5, first bullet: the principal character contributes N/abs(t), not sqrt(q(1 + abs(t))); the bound was restated.
- C4. Measured figures re-read from the logs (N = 97 is below sqrt(q) in five of six cases, not four; r = 5 examples reach 0.18 to 0.68 of sqrt(q); the case 3^20 has t just below t_5).
- C5. DH cell: "functional equation only for real chi" lowered to "need not keep a functional equation (not checked)".

## 3. Reservations left open

- R-a. Lemma X excludes termwise agreement. It does not exclude an inequality between zeta at height t and a depth member that is special to the coefficients 1 or mu. Section 3.5 treats general coefficients and mean values only. The verdict "precise obstruction" is for the device as assigned (an exchange of the twists on n <= N), not for every use of depth families.
- R-b. Lemma 1 (a) and (c) are readings. In particular "Theorem 1.1 with Proposition 11.3 covers Dirichlet characters mod p^k" follows the manuscript's Corollary-level statements; the Lean statement was not opened in this lane.
- R-c. Thresholds: for 41 <= abs(t) < 2.27e10 in the regime N = sqrt(q) = sqrt(t/2 pi)-scale the corollaries do not apply (r = 2 needs N >= sqrt(q)(sqrt(t) + 1); r = 3, 4 have their own t_r). The continuity variant mentioned in weakest step 3 is not written.
- R-d. The brute-force measurement uses primes only and c = 1; allowing c would lower E(N) slightly at small N and does not affect the lemma.
- R-e. The control table is argued from definitions. The T-NR twist formula was written without fixing the normalisation of chi(q); only the real parts of the zeros are used.

## 4. What an independent referee should attack first

1. The window argument of Lemma X for one r >= 3 with explicit numbers (for example r = 3, p = 3, k = 30, t = 1e6): compute m, the six integers, the congruence and the phase in exact or interval arithmetic.
2. Whether "the 7/8 format does not read the height" (N2) survives a reading of Lemma 8.1 and Lemma 10.5, where heights abs(Im rho) <= 3jT_1 appear as analysis parameters.
3. Whether a hybrid family statement not of the forms in section 6 exists.

---

# INDEPENDENT REFEREE (lens: general), 2026-11-19

Independent of the author's self-check above. Local runs only, through `scripts/memcap.sh 8`, under one minute in total; no server use. Scripts: `referee-general/` (`ref_check.py`, `brute.py`, `lowt.py`, `b2.py`).

## Verdict

**holds = true, as a precise obstruction of the termwise exchange step (E) only.** Lemma P, Lemma X, corollaries X2, X5, X-delta and Lemma D were re-derived line by line and no step failed. Five statements in the summary and in section 3.5 are wider than what is proved (G1 to G5 below). None of them touches Lemma X. Nothing in the result assumes RH, restates verified height, or says anything about zeros of zeta.

Flags set by this referee: **R1 = false, R2 = false, R3 = false, R4 = false.** aboutZeros = false.

## 1. Re-derivation of the PROVED steps

**Lemma P.** prod_i (m + a_i H) = sum_j e_j(a) H^j m^(s-j). Newton's identities give e_j(a) = e_j(b) for j <= r-1 from P_1..P_(r-1) (over Q, and the e_j are integers). The difference is sum_{j >= r} H^j (e_j(a) - e_j(b)) m^(s-j), divisible by H^r. Confirmed. The multisets must have the same size s; all four displayed data do.

**Lemma X.** Each inequality checked:
- x_u <= x_1 is the first term of t_r. Confirmed.
- Window length (H/x_0)(1 - (1.12/4.5)^(1/r)). With u = 1/r, f(u) = 1 - exp(-1.3908 u) - 0.9 u is concave, f(0) = 0, f(1/2) = 0.051 > 0, so the factor is >= 0.9/r for all r >= 2. With 1/x_0 >= 3r (second term of t_r) the length is >= 2.7 H >= 2.7; a closed interval of length >= 2 contains two consecutive integers, one prime to p (also for p = 2). Confirmed.
- abs(t D(x)) in [0.9 * 1.12, 1.1 * 4.5] = [1.008, 4.95]; 4.95 < 2 pi - 1.008, so abs(e^(i theta) - 1) >= 2 sin(0.504) = 0.9657. Confirmed.
- m >= H/x_1 >= 2AH gives positivity; p | H and p not dividing m gives coprimality; m + AH <= H/x_0 + AH <= N. Confirmed.
- Telescoping product bound s eps (factors of modulus <= 1); c^s cancels because both multisets have s elements; chi-products equal by Lemma P, q | H^r, periodicity and complete multiplicativity. Hence 2 s eps >= 0.9657, eps > 0.479/s. Confirmed.
- Constants: r = 2: -log(1 - x^2)/x^2 at x = 0.419264 is 1.0997 (within 10 percent); 4.5/x_1^2 = 25.6, (3r)^r 1.12/kappa = 40.32. r = 5: 4.5/(5040 x_1^5) = 2.27e10. Confirmed by hand.

**X5.** (5040/1.12)^(1/5) = 5.38; 18 <= 0.0375/x_0; total <= 5.6 p (q abs(t))^(1/5); (q abs(t)/2 pi)^(1/4) >= that iff (q abs(t))^(1/20) >= 8.87 p. 8.87^20 = 9.06e18. Confirmed.

**X-delta.** Prouhet: prod_{j<r} (1 - e^(2^j x)) = sum (-1)^(s_2(n)) e^(nx) has leading term (-1)^r 2^(r(r-1)/2) x^r, which gives equal power sums to degree r-1 and the stated degree-r value. Requirement <= C_r p q^((1+B)/r) < q^delta for k large. Confirmed, for abs(t) >= t_r (see G2).

**Lemma D.** Kernel of log_p on Q^x is +-p^Z; unique factorisation gives independence; injective Z^n -> Z_p has dual map with dense image. Characters psi(log_p(.)) are finite-order characters of Z_p^x, so Dirichlet characters mod some p^k. Confirmed. The lemma gives no bound on k in terms of N.

**Lemma 1 (c), Parseval.** Orthogonality over the full dual group. Confirmed. Lemma 1 (a): the manuscript text (`paper.txt`, Theorem 1.1 at line 177, Proposition 11.3 at line 5083, lines 320 to 324) does state the transfer to all primitive Dirichlet characters; the reading is consistent. Not replayed.

## 2. Numeric checks rerun with different cases

(a) Exact-integer instances of Lemma X not in the author's logs (50 to 60 digit logs of exact products):

| r | p, k | t | m | (Pa - Pb) mod q | abs(tD) | abs(e^(-itD) - 1) | eps >= | lemma's bound |
|---|---|---|---|---|---|---|---|---|
| 3 | 3, 30 | 1e6 | 8188459 | 0 | 4.2216 | 1.715 | 0.286 | 0.1597 |
| 4 | 2, 41 | 1e8 | 515045 | 0 | 4.1290 | 1.761 | 0.220 | 0.1197 |
| 2 | 7, 9 (odd k) | 50 | 56024 | 0 | 4.7154 | 1.412 | 0.353 | 0.2395 |
| 5 | 11, 7 | 3e10 | 61384 | 0 | 4.1228 | 1.764 | 0.176 | 0.0958 |

All ten (or 2s) integers positive, prime to p, below the N of the lemma. The first row is the instance the author's self-check asked for. Random scan of 20000 admissible m in the r = 3 window: minimum of abs(e^(-itD) - 1) is 1.02 (lemma needs 0.958).

(b) Brute force of the conclusion, independent of the proof: for every character mod q, the minimum over unimodular c of max over ALL n <= N prime to p (not primes only, c optimised by smallest covering arc), then the minimum over characters. At the N required by Lemma X (r = 2):

| q | t | N required | min error | bound |
|---|---|---|---|---|
| 3^7 (odd k) | 45 | 595 | 1.993 | 0.2395 |
| 5^4 | 60 | 208 | 1.972 | 0.2395 |
| 2^10 (non-cyclic group) | 50 | 246 | 1.973 | 0.2395 |
| 7^4 | 41 | 346 | 1.989 | 0.2395 |
| 3^8 | 100 | 847 | 1.997 | 0.2395 |

The conclusion holds in every case with a wide margin. Small N: error 0.03 to 0.17 at N = 5, 0.26 to 0.56 at N = 11, 0.49 to 0.83 at N = 17 (log q between 6.4 and 8.8). At q = 3^8, t = 100 my figure at N = 17 is 0.494 against the author's 0.683 (primes only, c = 1); the difference is the optimisation over c. Same order.

## 3. Controls

No zeta-only mechanism is claimed, so there is nothing for a control to separate. (E) reads only the two twists, so its failure is identical for zeta, U, DH, E_a and T-NR; the brute-force table above is at the same time the U control (alpha = t). The control table's S_d column is argued from definitions and was not run by the author or by me; it carries no claim. R3 = false is correct.

## 4. Errors and overstatements found

- **G1 (scope of "kills the device").** Lemma X refutes sup-norm termwise agreement of the twists. Relation (3.2) needs only that the weighted sums sum (chi(n) - c n^(-it)) n^(-s) be small at the point in question, which is weaker than (E). The result proves "a sufficient condition for the transfer is false", not "the transfer is false". The author states this in section 9 item 1; the verdict paragraph and the summary line ("the decisive test kills the device") do not carry the restriction. Correct wording: the termwise exchange is closed; a transfer special to the coefficients of zeta is neither found nor excluded.
- **G2 (bounded heights are not covered by the stated lemma).** Every corollary needs abs(t) >= t_r, and t_r grows fast (40.3, 3.4e5, 7.7e7, 2.3e10). For a fixed height and depth k -> infinity, which is the regime the device was about, the stated lemma covers only r = 2: N >= about 7.4 sqrt(q) for abs(t) >= 41, and nothing for abs(t) < 40.32 (the first zero, 14.13, is in this set). "N >= q^delta for t <= q^B" in the summary omits the lower threshold t_r(delta, B). The gap is technical and closable: for the r = 3 datum all a_i, b_i >= 0, so x = H/m need not be small; solving t D(x*) = 2 gives x* = 0.5196 at t = 14.134725, and at q = 3^30, 5^21, 2^60 an exact check gives congruent products mod q, tD = 2.0000, forced eps >= 0.2805, with the largest integer equal to 7.92 q^(1/3) (`lowt.py`). Brute force at t = 14.134725, q = 3^8 and 5^5: error 0.94 to 1.36 at N = 31 and above 1.78 at N = 97. So the conclusion holds at low height in the cases tried, but that variant is not a written proof in RESULT.md.
- **G3 ("an exchange exists only for N of order log q" is not established, and is false without a lower bound on abs(t)).** (i) For small abs(t) the principal character is an exchange at every N with eps about abs(t) log N: measured at q = 3^8, t = 0.1: error 0.171 at N = 31, 0.228 at N = 97, 0.338 at N = 900 (N = 900 is 11 sqrt(q)). The statement needs abs(t) bounded below. (ii) Existence at N of order log q for the actual target is measured only (six moduli, log q between 8.8 and 12.1, three values of t); Lemma D gives no relation between k and N. (iii) "1.4 to 1.9 log q" is not a measurement of a defined quantity: no eps threshold is fixed, and the range of log q is too narrow to distinguish log q from log q log log q, which is what the author's own counting argument predicts. (iv) The intermediate range is unproved, as the author says.
- **G4 (X2 in the summary).** "N >= sqrt(q)(sqrt(t) + 1), r = 2, t >= 41" is for even k only. For odd k, H = sqrt(p q) and the requirement is N >= sqrt(p q)(sqrt(t/1.12) + 1). RESULT.md states q = p^(2j); the claim line and `lanes_line.json` drop it.
- **G5 (section 3.5, first bullet, labelled CLASSICAL).** sum_{n <= N} n^(it) = N^(1+it)/(1+it) + O(abs(t)^(1/2) log abs(t)) for N >= abs(t), not N/abs(t) + O(1), and for N < abs(t) the bound is different again. More important: the non-principal bound sqrt(q) log q (1 + abs(t) log N) exceeds N for N up to about sqrt(q) abs(t) log q log N, so the bullet refutes norm transfer only for N far above the range N of order sqrt(q) sqrt(t) that the section is about. In that range the bullet says nothing.
- **G6 (novelty, context).** The result does not claim Lemma X as new to the literature, and it should not be read that way. The depth aspect as an analogue (not an approximation) of the t-aspect is standard (Postnikov; Gallagher; Milicevic, sub-Weyl bounds for prime-power moduli; Blomer and Milicevic, p-adic analytic twists). That n^(it) is far from every Dirichlet character is the standard non-pretentiousness fact; the q-uniform form with H = q^(1/r) via equal-power-sum data is an elementary exercise in that setting. None of this literature is cited. Lemma X is a correct elementary lemma, not a new theorem.

## 5. Requirement flags (strict)

- R1 false: no attack on the target survives. Lemma X uses multiplicativity of both twists but is an obstruction.
- R2 false: no statement about zeta. The obstruction itself is not uniform in height as written (G2).
- R3 false: zeta and every control fail (E) identically; nothing is separated.
- R4 false: no passage to the critical line; the step that would carry it is the one refuted.

## 6. What survives

Lemma P and Lemma X exactly as stated in section 3.3 (thresholds included), X2 for even k, X5 with both thresholds, X-delta for t_r <= abs(t) <= q^B, Lemma D (existence without rate), Lemma 1 (c) (Parseval), Lemma 1 (a) as a reading consistent with the manuscript text. Device row Z-new is acceptable for the map if its first cell says "termwise exchange" and the row carries the thresholds abs(t) >= t_r; "exists only for N of order log q" should read "measured to exist only up to N of about 11 to 17 at log q between 6.4 and 12.1, for abs(t) >= 14".
