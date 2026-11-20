# REFEREE (adversarial, lens: general) for c13-referee-r12-independent/RESULT.md

Date 2026-11-19. Read: RESULT.md, the five REFEREE2 reports, all scripts and logs in this directory, and the statements of Lemma X / Lemma P, gamma_p, w, v, w0, Lemmas S and T in the round-12 lanes. Own numerics: one script, local, through `scripts/memcap.sh 8`, python-flint 0.9.0 (Arb, 200 bits) and mpmath 1.4.1 in a scratch venv outside the repo (/tmp/c13ref, not kept). Server not used. Sources (Conrey-Li, Matsumoto survey) were not re-opened by this referee.

## Verdict

**holds = true, with one error in a referee addition and three record defects (section 3).** The claimed verdict "partial-result; no statement about zeros of zeta; five statements hold, four in a narrower form; no PROVED lemma used by a closure is broken" is confirmed for every step I re-derived. Nothing assumes RH, restates verified height, or presents a known theorem as new (Lemma S is stated as Conrey-Li's own deduction; UNIV is stated as relative to the survey's Theorem 7). Flags: R1 = R2 = R3 = R4 = false (section 4).

## 1. Re-derivation of the PROVED steps

**Lemma P.** prod (m + a_i H) = sum_j H^j e_j(a) m^(s-j); e_j for j <= r-1 are polynomials in P_1..P_(r-1) (Newton, equal multiset sizes); difference divisible by H^r. Holds.

**Lemma X.** Checked each line against the lane's statement (hypotheses abs(t) >= t_r = max(4.5/(kappa x_1^r), (3r)^r 1.12/kappa), N >= H((kappa abs(t)/1.12)^(1/r) + A)):
- window length (H/x_0)(1 - (1.12/4.5)^(1/r)) >= 0.9 H/(r x_0) >= 2.7 H >= 5.4: contains two consecutive integers, one prime to p;
- m >= H/x_1 >= 2AH needs x_1 <= 1/(2A): true for the four data (0.4193 <= 0.5; 0.0103 <= 1/12; 0.00425 <= 1/22; 0.00208 <= 1/36);
- abs(tD) in [0.9 x 1.12, 1.1 x 4.5] = [1.008, 4.95]; 4.95 < 2 pi - 1.008, so abs(e^(-itD) - 1) >= 2 sin(0.504) = 0.9659;
- telescoping bound s eps per product (all moduli <= 1), equality of the two chi-products from Lemma P, q | H^r, periodicity and complete multiplicativity. Conclusion eps > 0.479/s. Holds.
- Corollary X5 arithmetic: A = 18 <= 0.0375/x_0 because x_0 = 0.757 x_u <= 0.00158; 1.0375 x (5040/1.12)^(1/5) = 5.58 <= 5.6; 5.6 x (2 pi)^(1/4) = 8.87. Holds.
- The narrowing stated in RESULT.md (abs(t) >= t_r; threshold C_r p^ceil(k/r) abs(t)^(1/r), equal to C_r (q abs(t))^(1/r) only when r | k) is correct and is what the lane's lemma says.

**Bost-Connes.** P_n = mu_n mu_n^* projects on multiples of n; D = 1 + c sqrt(q) P_q + q P_(q^2) has spectrum {1, 1 + c sqrt q, 1 + c sqrt q + q}; Tr(D e^(-beta H)) = zeta(beta)(1 + c q^(1/2 - beta) + q^(1 - 2 beta)) for Re beta > 1. Holds. KMS values from Ramanujan sums: sum_k c_b(k) k^(-beta) = zeta(beta) sum_(d | b) mu(b/d) d^(1 - beta); at b = p^k this is p^(-k beta)(1 - p^(beta-1))/(1 - p^(-1)) times phi(b). Holds. Extremal state on x = sum_a conj chi(a) e(a/q), chi primitive: sum_a conj chi(a) e(ak/q) = chi(k) tau(conj chi), so the value is tau(conj chi) L(beta, chi)/zeta(beta), and the Galois-invariant state gives f_beta(q) sum_a conj chi(a) = 0: the correction (restriction of "product measure / no zeta" to the Galois-invariant state) is an identity and holds. gamma_p = (1 - p^(beta-1))/(1 - p^(-beta)) equals 1 at beta = 1/2 for every p: the Lemma L restriction holds. Zero of 2 cosh((s - 1/2) log q) + c at 1/2 + arccosh(c/2)/log q + i pi/log q; inside the strip iff 2 < c < sqrt q + 1/sqrt q. Holds.

**X_0(4).** Recursion c_(j+1) = (1 + 1/p) c_j - c_(j-1)/p with c_1 = c_0 (from p not dividing m) has roots 1, 1/p and gives c_j constant: equivalence with c(pm) = c(m) holds. C_q = 1 + 1/q - 2 q^(-3/2) cosh((s - 1/2) log q) = -q^(-3/2)(2 cosh + c), c = -(q^(3/2) + q^(1/2)) < -2: extra zeros real, at 1/2 +- arccosh(abs(c)/2)/log q, outside the strip. Holds. The two-line positivity of Cx_p theta (monotone theta; Jacobi inversion gives p^(-2) theta(x/p^2) = p^(-1) x^(-1/2) theta(p^2/x) < theta(x)) is correct in the lane's normalisation theta(x) = sum e^(-pi n^2 x); the weight-1/2 normalisation of T(p^2) itself was not opened by anyone (stated).

**Lemmas S, T.** Minimum principle for Re P (zero of W at an interior point with W(z + i) != 0 forces P = 0 identically); W W* = 1/m continued from the axis; z = x - i/2 gives P -> 1/(m(1/2 - ix) abs(W(x + i/2))^2). On Re s = 1 the weights are positive (2 - s = conj s). Gamma factors of w are common to a same-parity family and have no zero or pole in the open strip, so w and w0 have the same zeros there. Both lemmas hold given Theorem 2. The printed statement of Theorem 2 agrees with my recollection of the paper; I did not re-open it.

**Rouche certificate (item4_ST_lib.certify), logic checked.** N entire (non-principal characters only); M = enclosure of sup abs(N) on a square containing the disc of radius 1e-3; central-difference error M h^2/R^3/(1 - (h/R)^2); Taylor remainder M (r/R)^2/(1 - r/R); test abs(N(c)) + abs(d - N'(c)) r + remainder < abs(d) r in balls; denominators non-zero on the enclosing square. The inequalities are the right ones. Sound.

**UNIV.** U1 (lower density of A minus E is at least d), U3 (closed C, eps-ball) are three-line deductions from joint universality. Hold relative to that theorem. Class N narrowing is correct (one implication only).

## 2. Numeric checks rerun with different cases (own code)

| check | case (not used by the lane or by RESULT.md) | outcome |
|---|---|---|
| Lemma X window, all m, exact congruence mod q, D = log of the exact ratio of products, Arb | (p,k,t;r) = (5,9,7.7e5;3): 7496 m, min 1.0213; (7,3,99.9;2): 198 m, 1.0751; (2,13,9.1e7;4): 817 m, 1.0050; (19,5,2.5e10;5): 2824 m, 0.9988; edge cases (2,1,41.0;2): 3 m, 1.2717; (3,2,-40.33;2): 6 m, 1.1911 | 0 violations of >= 0.958; all integers positive, prime to p, <= N |
| Lemma X brute force, all characters, best unimodular c (float) | q = 121, t = 45: 1.884; q = 169, t = 77.7: 1.963 (bound 0.2395) | confirms |
| T-NR zero, Arb | (q,c) = (7, 2.5): 0.856207187108 + 1.61445925708 i; (11, 3.0): 0.901361836372 + 1.31014589721 i; bracket below 3e-59 | confirms |
| twin real zero, Arb sign change | q = 13: 2.028739467; q = 2: 2.497165581 | outside the strip, confirms |
| S_v sign with a second library (mpmath, 30 digits) | q = 5 one character: -2.6269389e-5 at t = 5.413 (same 8 digits as the Arb log), -2.746e-4 at 5.5; q = 5 pair: -8.3268534e-7 at 8.563, -1.711e-6 at 8.6 | confirms |
| zero of w0 | q = 5 pair, mpmath at the certified centre: abs(w0) = 2.3e-18 (centre given to 22 digits); q = 7 three odd: winding of N on abs(s - c) = 1e-3 equals 1.000 (64 points, float) | consistent with one zero |

The control facts in section 5 of RESULT.md are algebraic (T-NR with c > 2 passes membership, W-invariance and positivity; zero in the strip iff 2 < c < sqrt q + 1/sqrt q) and were re-derived above. No zeta-only mechanism is claimed, so no control battery is owed.

## 3. Errors and defects

**E1 (error in a referee addition; ARGUED label; not used by a closure).** RESULT.md section 3 item 2 and `referee_updates.json` state for the r = 2 datum: "eps >= min(0.2395, (1/2) sin(0.087 abs t)) for every t != 0 on n <= 5 p^ceil(k/2)". The argument written in REFEREE2 (section 4) and coded in `supp.py` gives, for 0 < abs(t) <= 20 with m = 2H + 1, only eps >= (1/2) sin(min(0.174 abs t, 0.52)/2), which is capped at 0.1285 (the report's own table prints the bound 0.1285 at t = 14.13 and 19.9). The summary formula exceeds what is derived for about 3 < abs(t) < 20: at abs(t) = 10 it claims 0.2395 against a derived 0.1285; at abs(t) = 19.9 the chosen m gives no more than 0.138 for large H (0.1533 at H = 101, 0.1331 at H = 1009). I found no counterexample (another m in (H, 4H] gives 0.5 in the cases tried, and brute force gives 1.0 to 1.75), so the summary formula may be true, but it is not established. Correct statement of what is argued: eps >= min(0.1285, (1/2) sin(0.087 abs t)) for 0 < abs(t) <= 20; 0.2397 for 20 <= abs(t) <= 40.32; 0.2395 above. The consequence drawn ("bounded heights narrowed to r >= 3") is not affected.

**E2 (record).** `item4_ST.log` ends its Lemma S block with "all Lemma-S certificates: False" (q = 5 line is nan). The valid q = 5 certificate is in `item4_fix.log`. Disclosed in the heat report's run note, not in RESULT.md; a reader of the log alone gets the wrong outcome.

**E3 (record).** `item135.log` contains an invalid check line ("numerically at s=3: -8.52e-6"); replaced in `supp.log`. Disclosed in the Bost-Connes report only. `item2_lemmaX.log` heads the five-triple block "three fresh".

**E4 (wording).** "5 fresh (p,k,t) in Arb, 0 violations" covers every m of the window in three cases and a subsample (every 11th, every 694th) in two; RESULT.md says "every tested m", the one-line claim does not. The lemma needs one m, so nothing depends on it.

**Limits that RESULT.md states itself and that stand:** items 4 and 5 are "holds given the printed theorem" (proofs of Conrey-Li Theorem 2 and of joint universality not opened; positive-density branch not proved independently); Rouche certificates start from the lane's zero locations (counts and "first zero" not re-scanned); the brute-force tables and theta sums are floating point; coverage is restricted to the named statements; independence is slightly reduced by the opened header of `cell2.py`. The U4 downgrade and the eight restrictions of section 4 are justified; I confirm the Lemma L one (gamma_p = 1 at beta = 1/2) and the Lemma C one by direct computation.

## 4. Requirement flags (set by this referee)

- R1 false: no attack; Lemma X is an obstruction.
- R2 false: nothing height-uniform about zeta.
- R3 false: no device, no control separation claimed.
- R4 false: not addressed.

## 5. Surviving claim

No statement about zeros of zeta. The five round-12 statements hold as narrowed in RESULT.md section 2: Lemma X (abs(t) >= t_r; threshold C_r p^ceil(k/r) abs(t)^(1/r)); Bost-Connes identity T-NR = Tr(D e^(-beta H)), D >= 1, with product-measure statements for the Galois-invariant KMS state only; reduction to c(pm) = c(m), twin with c < -2 and zeros outside the strip; Lemmas S, T given Conrey-Li Theorem 2 with five Rouche-certified zeros; UNIV relative to the survey's Theorem 7, U4 ARGUED. The referee addition for bounded heights at r = 2 holds with the constant min(0.1285, (1/2) sin(0.087 abs t)) for abs(t) <= 20, not with 0.2395.
