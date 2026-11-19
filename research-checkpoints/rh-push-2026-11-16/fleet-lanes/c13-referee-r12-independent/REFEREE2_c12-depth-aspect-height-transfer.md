# REFEREE2: c12-depth-aspect-height-transfer (independent second referee)

Date 2026-11-19. Written from the lane's RESULT.md only; the lane's REFEREE.md was not read before this report was complete. Scripts: `item2_lemmaX.py` (log `item2_lemmaX.log`), `supp.py` (log `supp.log`), local, through `scripts/memcap.sh 8`, python-flint 0.9.0 (Arb) and exact integers. No server use.

Labels used here: RE-DERIVED (proof rewritten line by line by this referee), CERTIFIED (exact integer or Arb ball computation), MEASURED (float), NOT CHECKED.

## Verdict on the item

**Lemma X holds as stated, with its constant 0.479/s and its length threshold N >= H((kappa|t|/1.12)^(1/r) + A), H = p^ceil(k/r).** Lemma P holds. Corollaries X2, X5, X-delta hold. The round-log sentence ("no character mod p^k is within 0.479/s of c n^(-it) on n <= N once N >= about (q|t|)^(1/r)") holds in the narrower form: for |t| >= t_r, with N >= C_r p^ceil(k/r) |t|^(1/r), which is C_r (q|t|)^(1/r) when r divides k and at most C_r p (q|t|)^(1/r) otherwise. No PROVED label of Lemma X or Lemma P is downgraded.

## 1. Re-derivation

**Lemma P (RE-DERIVED).** prod_i (m + a_i H) = sum_j H^j e_j(a) m^(s-j). Newton's identities express e_j, j <= r-1, as rational polynomials in P_1..P_(r-1), so e_j(a) = e_j(b) for j <= r-1 and the difference of the two products is sum_{j>=r} H^j (e_j(a) - e_j(b)) m^(s-j), divisible by H^r. Correct. It needs the two multisets to have the same size s (they do).

**Lemma X (RE-DERIVED), each numerical step:**
1. x_u <= x_1 follows from |t| >= 4.5/(kappa x_1^r). Correct.
2. Length of [H/x_u, H/x_0] is (H/x_0)(1 - (1.12/4.5)^(1/r)) >= 0.9 H/(r x_0): CERTIFIED in Arb for r = 2..40 (`1 - (1.12/4.5)^(1/r) > 0.9/r`), and for all r >= 2 by concavity of 1 - e^(-y) on [0, 0.6953]. With 1/x_0 >= 3r (second condition on t) the length is >= 2.7 H >= 5.4, so the interval contains two consecutive integers, one of them prime to p. Correct.
3. kappa|t|x^r in [1.12, 4.5] and the 10% condition give |tD| in [1.008, 4.95]. Correct.
4. m >= H/x_1 >= 2AH, so all 2s integers are positive; they are = m mod p, so prime to p; the largest is at most H/x_0 + AH <= N. Correct.
5. Telescoping: |prod u_i - prod v_i| <= sum |u_i - v_i| for numbers of modulus <= 1; both chi-products are chi of integers congruent mod q (Lemma P and q | H^r). So |exp(-itD) - 1| <= 2 s eps. Correct.
6. |e^(i theta) - 1| = 2|sin(theta/2)|; on [1.008, 4.95] the minimum is at 1.008: 2 sin(0.504) = 0.96586 (CERTIFIED; the other end gives 1.2366). So eps > 0.479/s. Correct; the constant 0.479 could be 0.4829.

The proof uses of chi only complete multiplicativity, |chi| <= 1 and the period q, as the lane says.

**Data (CERTIFIED, exact integers).** r = 2..5 data: power sums equal below r; P_r differences 2, 36, 720, 25200; kappa = 1, 12, 180, 5040. Prouhet r = 6 (s = 32): kappa = 3932160 = 6! 2^15 / 6. Lemma P: 0 failures in 3000 random (m, H) per datum, H up to 10^6, m of both signs; the congruence fails mod H^(r+1) (so r is the exact order).

**Constants x_1 and t_r (CERTIFIED in exact rationals).** The 10% condition was certified with the positive-term majorant T(x) = sum_{j>r} |dP_j| x^j / j (200 exact terms plus the geometric tail 2s A^j x^j): largest admissible x_1 = 0.419683, 0.0103378, 0.0042537, 0.00208709 for r = 2..5. The lane's values (0.419264, 0.0103274, 0.00424945, 0.00208501) are slightly smaller, hence valid. t_r from the lane's x_1: 40.32, 3.41e5, 7.67e7, 2.27e10: confirmed.

**Corollaries.** X2: the corollary's hypothesis N >= sqrt(q)(sqrt|t| + 1) is stronger than the lemma's (sqrt(|t|/1.12) + 1): correct. X5: H <= p q^(1/5), (5040/1.12)^(1/5) = 5.38, A = 18 <= 0.0375/x_0, total <= 5.6 p (q|t|)^(1/5); comparison with (q|t|/2 pi)^(1/4) gives (q|t|)^(1/20) >= 8.87 p; (9p)^20 suffices, and 8.87^20 = 9.07e18 when 5 | k: correct. X-delta: correct (Prouhet datum, s = 2^(r-1)).

## 2. Tests at (p, k, t) not used by the lane (CERTIFIED / MEASURED)

Window test: for every integer m prime to p in [H/x_u, H/x_0] (or a subsample where stated), the 2s integers are positive, prime to p and <= N_req; the two products are congruent mod q (exact); |e^(-itD) - 1| is bounded below in Arb at 200 bits, with D computed from the logarithms of the exact integers (not from the series).

| p | k | t | r | m tested | certified min of abs(e^(-itD) - 1) | required >= | N_req | N_req/(q abs t)^(1/r) |
|---|---|---|---|---|---|---|---|---|
| 11 | 4 | 5000.3 | 2 | all 3683 | 1.0627 | 0.958 | 8206 | 0.96 |
| 2 | 21 | 4.0e5 | 3 | all 3857 | 1.0115 | 0.958 | 21559 | 2.29 |
| 13 | 12 | 1.0e8 | 4 | 19278 (every 11th) | 1.0056 | 0.958 | 806414 | 3.67 |
| 3 | 25 | 3.0e10 | 5 | all 26355 | 1.0007 | 0.958 | 167181 | 5.52 |
| 17 | 7 | -123456.789 | 2 | 18845 (every 694th) | 1.0624 | 0.958 | 2.78e7 | 3.91 (r does not divide k: factor sqrt(p)) |

0 violations. The lemma only needs one m; every m in the window works, as the proof shows.

Brute force over all characters mod q and the optimal unimodular c (float; minimum over chi of 2 sin(span/4), span = angular span of chi(n) n^(it), n <= N prime to p):

| q | t | r | N_req | lemma bound | measured min error at N_req | smallest N on my grid where the min error exceeds the bound |
|---|---|---|---|---|---|---|
| 7^2 | 50 | 2 | 54 | 0.2395 | 1.825 | 5 (0.63) |
| 3^4 | 60.5 | 2 | 76 | 0.2395 | 1.95 (N = 80) | 5 (0.28) |
| 2^6 (non-cyclic group) | 45 | 2 | 59 | 0.2395 | 1.895 | 5 (0.28) |
| 5^4 | 200 | 2 | 360 | 0.2395 | 1.995 | 10 (0.42) |
| 5^3 | 4.0e5 | 3 | 843 | 0.1597 | 1.998 | 10 (0.43) |
| 3^3 | 3.5e5 | 3 | 485 | 0.1597 | 1.997 (N = 480) | 10 (0.78) |

The lemma is confirmed and is far from sharp: the best error is already above the bound at N of 5 to 10 and is near the maximum 2 well below N_req. This agrees with the lane's Lemma D picture (exchange only for N of order log q) and does not contradict it; it is MEASURED on six small moduli.

## 3. Points where the statement is narrower than its summaries

1. **Threshold in t.** Lemma X needs |t| >= t_r (40.3, 3.4e5, 7.7e7, 2.3e10 for r = 2..5). The lane says so (weakest step 3). The round-log line omits it.
2. **Factor p.** N_req is of order p^ceil(k/r) |t|^(1/r); "(q|t|)^(1/r)" is exact up to the constant only when r | k.
3. **"An exchange exists only for N of about log q"** (verdict paragraph). The "only" is PROVED for N >= C_r p (q|t|)^(1/r), every r, and MEASURED in between (six moduli in the lane, six here). Lemma D (existence at N of order log q) is correct as proved (the kernel of log_p on Q^x is +-p^Z; density by Pontryagin duality; all continuous characters of Z_p^x have finite order). The sentence should carry "(range between log q and q^delta: measured)". The lane states this in 3.4 and weakest step 3; the verdict paragraph and the round log compress it.
4. **Remark 3.5, first bullet.** "principal character gives at most N/|t| + O(1)" is not correct uniformly: the error term of sum_{n<=N} n^(it) is O(1 + |t| log N) trivially and of order sqrt|t| when N <= |t|. The bullet is labelled CLASSICAL and is not used by any lemma; it should read "at most N/|t| + O(sqrt|t| log|t|)" (van der Corput) or be marked ARGUED.

## 4. Referee addition: bounded heights at r = 2 (ARGUED here, three lines; MEASURED on five cases)

The lane lists "bounded heights" as not established. For r = 2 the datum (1, -1), (0, 0) gives D(x) = log(1 - x^2) exactly and the same argument works for every t != 0 without the threshold t_2:
- 0 < |t| <= 20: take m = 2H + 1 (prime to p, since p | H). x = H/m in [0.4, 0.5), |D| in [0.17435, 0.28768] (CERTIFIED), |tD| <= 5.754 < 2 pi - 0.52. Hence eps >= (1/2) sin(min(0.174 |t|, 0.52)/2), on N >= 3H + 1.
- 20 <= |t| <= 40.32: take m prime to p in [H/0.35, 4H] (length 1.14 H >= 2.28). |D| in [0.0645, 0.1307], |tD| in [1.29, 5.27], 5.27 < 2 pi - 1: eps >= (1/2) sin(0.5) = 0.2397, on N >= 5H.
So for q = p^k and every t != 0: no character mod q is within min(0.2395, (1/2) sin(0.087 |t|)) of c n^(-it) on n <= 5 p^ceil(k/2). The factor |t| for small t is necessary (n^(-it) tends to the trivial character on a fixed range). Brute force (all characters, optimal c): q = 81, t = 14.134725, N = 28: min error 1.47 (bound 0.128); q = 49, t = 3: 1.70; q = 125, t = 0.5: 1.03 (bound 0.022); q = 729, t = 0.1: 0.220 (bound 0.0043); q = 121, t = 19.9: 1.75. This is a short addition, not refereed by anyone else; it narrows the lane's open item "bounded heights" to r >= 3 (ranges N between q^(1/r) and q^(1/2) at |t| < t_r).

## 5. Not checked

Section 2 of the lane (reading of the 7/8 manuscript: N1 to N4, Lemma 1 (a), (c)) and the control table of section 5 were not re-derived; they are READ / ARGUED in the lane and stay so. They are not used by Lemma X.

## 6. Labels

| statement | lane label | this referee |
|---|---|---|
| Lemma P | PROVED | holds |
| Lemma X, constants 0.479/s, N threshold | PROVED | holds |
| x_1, t_r for r = 2..5 | float, "not interval" | holds; now certified in exact rationals |
| X2, X5, X-delta | PROVED | hold |
| Lemma D | CLASSICAL | holds (proof complete as written) |
| "exchange only for N about log q" | CLASSICAL; MEASURED | narrower: proved above q^delta, measured between |
| 3.5 first bullet (principal character bound) | CLASSICAL | downgrade to ARGUED; error term misstated; not load-bearing |
| Lemma 1 (a), (c); control table | READ / ARGUED | not checked |

Closure of the depth-aspect family: the one lemma it rests on holds.
