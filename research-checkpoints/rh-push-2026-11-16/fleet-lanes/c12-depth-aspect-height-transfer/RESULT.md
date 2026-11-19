# c12-depth-aspect-height-transfer: can p-adic depth stand in for archimedean height?

Lane kind: explore, stage A on paper, target R4. Date 2026-11-19. Local only (two pure-python runs through `scripts/memcap.sh 8`, under 2 minutes in total). No server job was started.

Labels: PROVED (elementary proof written here, unrefereed) / CLASSICAL / READ (my reading of the manuscript text `~/lean-deps/qrh-verify/paper.txt` and of earlier lane files; proofs not replayed) / MEASURED (numerics here) / ARGUED / OPEN.

**Verdict in one paragraph.** The decisive first test kills the device. The step that exchanges height for depth would be "a character chi mod p^k agrees with n^(-it) on the integers n <= N up to a small error". Lemma X (PROVED) shows this is false for every character mod p^k, every constant phase and every error below 0.479/s, as soon as N >= C_r p (p^k abs(t))^(1/r) and abs(t) >= t_r, for each r >= 2 (s = r for r <= 5). In particular it is false in the range in which both functional equations act (N >= sqrt(p^k) and N >= sqrt(abs(t)/2 pi); r = 5, for abs(t) >= 2.27e10 and p^k abs(t) >= (9p)^20), and for N = q^delta with any fixed delta > 0 and t_r <= abs(t) <= q^A, k large. An exchange exists only for N of about log q (Lemma D, CLASSICAL; MEASURED), where neither functional equation says anything. The reason is structural: chi is multiplicative and p-adically continuous, n^(-it) is multiplicative and archimedean-continuous, and integers below N supply multiplicative relations that are trivial p-adically and non-trivial at the real place. The two aspects are independent coordinates of one character group; they multiply (conductor p^k (1 + abs(t))) and never substitute. No statement about zeros of zeta is made. Flags R1 = R2 = R3 = R4 = false.

---

## 1. Plan

1. First lemma: what the 7/8 detection step needs from a twist family, and whether characters mod p^k with k growing supply it with a zero at height T encoded in the depth.
2. Decisive test: write the exchange step as an equation with its error term; decide whether it holds on n <= N with N beyond p^(k/2).
3. If it fails: write the obstruction as a device row, then the control table (U, T-NR, E_a first).
4. One pivot allowed. Section 6 states the adjacent idea and why no pivot was run.

What is new relative to the map: rows Z28 and the c7/c11 device reads record that the two non-identity separations on file use periodicity in the conductor aspect and that the height aspect is control U. No row tests whether the depth aspect (the one periodic family whose characters are formally of the shape "n^(-it) with a p-adic logarithm") can carry a height. This lane tests that and closes it.

## 2. First lemma: what the 7/8 format needs from a family (READ)

From Proposition 2.1, Proposition 5.1, Lemma 5.8, Section 7.1, Lemma 8.1 and Lemma 11.1 of the manuscript, and `c4-thin-twist-control-78` section 3:

- **(N1) Family supremum.** beta* is the supremum of Re rho over all primitive finite-order Hecke characters (2.1). The target eta is one fixed member. The rows of the high expansion are L(s, psi), psi in X_u, obtained from eta by sextic symbols chi_u of moving conductor; Lemma 8.1 controls them right of beta* because they belong to the same family. The family must be closed under the row twists.
- **(N2) The zero enters through its real part only.** Proposition 2.1 continues 1/L^S(s, eta) to Re s > beta* - eps* from two power bounds in Z. All constants may depend on eta ("<<_eta"); the analysis height T_1 = Z^tau is chosen after the target (Lemma 11.1). The height of the hypothetical zero is never a parameter. The conclusion is already uniform in height.
- **(N3) Periodicity (statement (A) of the THIN lane).** The target weight is L-periodic (Proposition 5.1, first line), so each twisted sum has a Poisson dual with length governed by the row conductor, uniformly in it.
- **(N4) Reciprocity of the row kernel.** The row twist is a residue symbol chi_A(m): the roles of the row index and of the summation variable are exchanged by sextic reciprocity (Lemma 4.4), and the completed row is a cubic theta row with an automorphic reflection (Proposition 5.1). The low estimate (Lemma 5.8, Proposition 6.3) is a second moment of these rows.

**Lemma 1 (position of the depth family in this format).** Label: READ for (a), PROVED for (b), ARGUED for (c).

(a) *As targets.* Every Dirichlet character mod p^k is a primitive (or induced) finite-order character, so it is already inside the family of (N1): Theorem 1.1 with Proposition 11.3 (quadratic transfer) covers L(s, chi) for chi mod p^k at every depth and every height with the same abscissa 7/8. By (N2) there is no slot in the format in which a height could be stored: the format does not read the height of the zero at all. "Posing the 7/8 format in the depth family" returns the existing theorem with no new parameter.

(b) *Encoding the height in the depth* requires the exchange step E of section 3 (zeta(s + iT) replaced by L(s, chi_k) with chi_k(n) close to n^(-iT) on the range of n that the argument reads). The ranges read are at least the square roots of the two conductors (Poisson dual lengths in (N3); the approximate functional equation of the target at height T). Lemma X shows E is false there.

(c) *As rows* (chi_a mod p^k, a in Z/p^(k-1)(p-1), in place of sextic symbols). (N3) holds. (N4) fails: the modulus is fixed and the family is the full dual group of (Z/p^k)^x, so the row second moment is Parseval, sum_a abs(sum_n b_n chi_a(n))^2 = phi(q) sum_{n = n' mod q} b_n conj(b_n'), an identity with no sub-diagonal saving, and the row average of 1/L(s, eta chi_a) is the Dirichlet series of mu eta on one residue class mod p^k. A power saving for that is equivalent to the half-plane it is meant to prove (classical). This matches the synthesis entry "GL(1) full families: density 0 or circular"; the open entry there, "residue families of unbounded order", is not met by the depth family because it has no reciprocity law exchanging n with the modulus.

So the only way the depth family could add anything is step E.

## 3. The decisive test: the exchange step written out

### 3.1 The exact relation between the two twists (CLASSICAL)

Let omega = abs(.)^(it) (x) chi be the idele class character of Q with archimedean component x -> abs(x)^(it) and p-component chi_p (the character of Z_p^x that chi mod p^k defines). Triviality on Q^x gives, for every prime l != p,

    (coefficient of l^(-s) in L(s, omega))  =  l^(-it) chi(l)  =  omega_inf(l)^(-1) omega_p(l)^(-1).        (3.1)

On 1 + p Z_p (p odd), Postnikov: chi_p(u) = e(a log_p(u) / p^k), and formally n^(-it) = e(-(t/2 pi) log n). The two logarithms in (3.1) appear as a product of two unimodular numbers. The analytic conductor is p^k (1 + abs(t)); the root number is the product of the two local epsilon factors (Gauss sum, a quadratic phase by stationary phase mod p^k; gamma-factor phase, a quadratic phase by Stirling). Height and depth are the two coordinates of the dual of R_{>0} x Z_p^x. Hom_cont(R_{>0}, Z_p^x) and Hom_cont(Z_p^x, R_{>0}) are trivial (connected against totally disconnected; compact against torsion-free), so no map between the two twists comes from the groups. Any exchange has to be an approximate coincidence on the integers n <= N.

### 3.2 The candidate (displayed)

Candidate transfer at height t, depth k, q = p^k:

    (E)   there are chi mod q and c, abs(c) = 1, with   abs(chi(n) - c n^(-it)) <= eps   for all n <= N, p not dividing n.

If (E) held with N >= max(sqrt(q), sqrt(abs(t)/2 pi)) one would have, from the two approximate functional equations (the target's used on the zeta side),

    zeta_(p)(s + it) = c^(-1) L(s, chi) + O( eps sum_{n <= N} n^(-sigma) + eps sum_{n <= N'} n^(sigma - 1) ) + (root-number mismatch),      (3.2)

zeta_(p) = zeta without its p-factor, and a zero of zeta at beta + it would be a near-zero at height 0 of a member of a periodic family. The error term of (3.2) is the error of (E). So the test is (E).

### 3.3 Lemma X: (E) is false beyond q^(1/r) (PROVED)

**Data.** An *r-datum* is a pair of multisets a = (a_1..a_s), b = (b_1..b_s) of integers with P_j(a) = P_j(b) for 1 <= j <= r - 1 and P_r(a) != P_r(b), P_j the power sums. Examples (checked exactly in `exchange_check.py`): r = 2: (1, -1), (0, 0); r = 3: (1, 2, 6), (0, 4, 5); r = 4: (0, 4, 7, 11), (1, 2, 9, 10); r = 5: (1, 2, 10, 14, 18), (0, 4, 8, 16, 17). For every r the Prouhet partition of {0, .., 2^r - 1} by the Thue-Morse sign is an r-datum with s = 2^(r-1) (CLASSICAL; sum (-1)^(s_2(n)) n^r = (-1)^r r! 2^(r(r-1)/2) != 0). Put A = max abs(a_i), abs(b_i), kappa = abs(P_r(a) - P_r(b))/r, and D(x) = sum_i log(1 + a_i x) - sum_i log(1 + b_i x) = sum_{j >= r} (-1)^(j-1) (P_j(a) - P_j(b)) x^j / j for abs(x) < 1/A. Fix x_1 in (0, 1/(2A)] with abs(abs(D(x)) - kappa x^r) <= kappa x^r / 10 on (0, x_1].

**Lemma P (congruence).** For integers H >= 1 and m: prod_i (m + a_i H) = prod_i (m + b_i H) mod H^r.
Proof. e_j(aH) = H^j e_j(a), and by Newton's identities e_j(a) = e_j(b) for j <= r - 1. The difference is sum_{j=r}^{s} H^j (e_j(a) - e_j(b)) m^(s-j).

**Lemma X.** Let p be a prime, k >= 1, q = p^k, H = p^ceil(k/r) (so q divides H^r), chi any Dirichlet character mod q, c unimodular, t real with

    abs(t) >= t_r := max( 4.5/(kappa x_1^r), (3r)^r 1.12/kappa ),      N >= H ( (kappa abs(t)/1.12)^(1/r) + A ).

Then max over n <= N, p not dividing n, of abs(chi(n) - c n^(-it)) >= 0.479/s.

Proof. Put x_0 = (1.12/(kappa abs(t)))^(1/r) and x_u = (4.5/(kappa abs(t)))^(1/r) <= x_1. The interval [H/x_u, H/x_0] has length (H/x_0)(1 - (1.12/4.5)^(1/r)) >= 0.9 H/(r x_0) >= 2 (second condition on t), so it contains an integer m prime to p. For this m, x = H/m is in [x_0, x_u], hence kappa abs(t) x^r is in [1.12, 4.5] and abs(t D(x)) is in [1.008, 4.95]. Also m >= H/x_1 >= 2AH, so the 2s integers m + a_i H, m + b_i H are positive, prime to p (H is divisible by p), and at most m + AH <= N.
Suppose abs(chi(n) - c n^(-it)) <= eps on these integers. Products of s numbers of modulus at most 1: abs(prod chi(m + a_i H) - c^s prod (m + a_i H)^(-it)) <= s eps, and the same for b. By Lemma P and q | H^r the two chi-products are equal (periodicity and multiplicativity of chi). Hence abs(exp(-it D(H/m)) - 1) <= 2 s eps. Since abs(t D) is in [1.008, 4.95], the left side is at least 2 sin(0.504) > 0.958. So eps > 0.479/s. QED

The proof uses of chi only: complete multiplicativity, abs(chi) <= 1, period q. It uses of n^(-it) only: complete multiplicativity and the value of t log(1 + kappa' x^r) at one point.

**Corollaries (PROVED).**
- (X2, explicit) r = 2, kappa = 1, x_1 = 0.419, t_2 = 40.3: if q = p^(2j), abs(t) >= 41 and N >= sqrt(q)(sqrt(abs(t)) + 1), no character mod q is within 0.239 of c n^(-it) on n <= N.
- Constants of the displayed data (`datum_constants.log`; x_1 from the exact power-sum series with positive terms): r = 3: kappa = 12, x_1 = 0.0103, t_3 = 3.41e5; r = 4: kappa = 180, x_1 = 0.00425, t_4 = 7.67e7; r = 5: kappa = 5040, x_1 = 0.00208, t_5 = 2.27e10.
- (X5, both functional equations) With the r = 5 datum (kappa = 5040, s = 5): if N >= max(sqrt(q), sqrt(abs(t)/2 pi)) then N >= (q abs(t)/2 pi)^(1/4), and for abs(t) >= t_5 the requirement of Lemma X is at most 5.6 p (q abs(t))^(1/5) (since 1/x_0 >= 480 > 18 and H <= p q^(1/5)). So the hypothesis holds once q abs(t) >= (9p)^20, or q abs(t) >= 9.1e18 when 5 divides k. In the range where the approximate functional equations of both sides are available, (E) therefore fails with eps < 0.0958 for abs(t) >= 2.27e10 and q abs(t) >= (9p)^20. Below these thresholds the range is finite in (q, t) for each p and is not covered by this corollary (r = 2, 3, 4 cover parts of it).
- (X-delta) For fixed p, delta > 0, B: take r > (1 + B)/delta. For k >= k_0, t_r <= abs(t) <= q^B and N >= q^delta, (E) fails with eps < 0.479/2^(r-1).
- The same proof gives the statement for any modulus q and any H with q | H^r; depth (q a high prime power) is the case in which H is as small as q^(1/r).

**Checks (MEASURED, `exchange_check.log`, `rs_regime_check.log`).** Lemma P: 0 failures for r = 2..5 on 3 moduli and 399 values of m each (exact integers). Forced phase for r = 2 at six (p, k, t): abs(e^(iG) - 1) between 1.55 and 1.61 against the required <= 4 eps. For r = 5 with t = 2 pi q (so sqrt(t/2 pi) = sqrt(q)) at q = 3^20, 3^30, 5^20, 2^50, 7^15: the ten integers lie below sqrt(q) (largest is 0.18 to 0.68 of sqrt(q)), the products are congruent mod q exactly, and the phase t D is 4.10 to 4.46, at distance 1.82 to 2.18 from 2 pi Z (direct float64 evaluation of the phase, about 3 significant digits after cancellation; the case 3^20 has t = 2.19e10, just below t_5, and is a direct evaluation rather than an instance of the lemma).

### 3.4 Where an exchange does exist (Lemma D, CLASSICAL; MEASURED)

**Lemma D.** Fix p, N, t, eps. There are k and chi mod p^k with abs(chi(l) - l^(-it)) <= eps for all primes l <= N, l != p (hence error at most eps log_2 N on all n <= N prime to p).
Proof. The numbers log_p(l), l <= N prime, l != p, are linearly independent over Z in Z_p (a relation gives prod l^(c_l) in the kernel of log_p on Q^x, that is +-1 times a power of p, so all c_l = 0). The restriction of the dual of Z_p to a free subgroup that embeds is dense in its torus (Pontryagin duality). QED

Counting gives the size: the characters mod q give at most phi(q) points of the torus of dimension pi(N) - 1, so a generic target needs q >= eps^(-(pi(N)-1)), N of order log q log log q. Measured for the actual target n^(-it) (best character over the full group, primes only, c = 1): at q = 3^8 .. 3^11, 5^6, 7^5 and t = 100, 777.7, 1000 the best error is 0.002 to 0.083 at N = 5, 0.23 to 0.46 at N = 13, 0.45 to 0.68 at N = 17 (N about 1.4 to 1.9 times log q), and 1.59 to 1.74 at N = 97, which is below sqrt(q) in five of the six cases. So the range of the exchange is N of order log q; Lemma X closes N >= q^delta; the intermediate range (log q)^(1+o(1)) < N < q^(o(1)) is not proved closed and is not needed (no functional equation, no Poisson dual and no row of the format acts at that length).

### 3.5 Weaker forms of (E) (ARGUED / CLASSICAL)

- *Norm transfer for general coefficients* abs(sum_{n<=N} b_n n^(-it)) <= C max_chi abs(sum b_n chi(n)) + Err: false unless Err >= N - C (N/abs(t) + sqrt(q) log q (1 + abs(t) log N)): take b_n = n^(it); the left side is N; on the right the principal character gives at most N/abs(t) + O(1) and each non-principal character at most sqrt(q) log q (1 + abs(t) log N) (Polya-Vinogradov and partial summation). CLASSICAL.
- *Mean-value transfer* (average over a against average over t): both sides are orthogonality relations, detecting n = n' mod q and abs(log(n/n')) <= 1/T respectively. The hybrid large sieve has the factor (qT + N): the two averages multiply. A mean-value statement is in any case under MV-CAP (no every-window conclusion). CLASSICAL.
- *Root numbers only*: matching tau(chi)/sqrt(q) with the gamma phase at height t is one real condition and can always be met; it carries no information without (E).

## 4. Device row (proposed for section 3.5 of the map; unrefereed)

| Z-new | Depth-aspect exchange: replace the height twist n^(-it) by a character mod p^k on n <= N, so that a zero at height t is posed in a periodic family with the target's functional equation used at the exchange | The exchange step (E) is false for N >= C_r p (p^k abs(t))^(1/r), abs(t) >= t_r, error < 0.479/s, every r >= 2 (Lemma X): for an r-datum, prod (m + a_i H) = prod (m + b_i H) mod H^r while the real ratio is 1 +- kappa (H/m)^r(1 + o(1)); periodicity plus multiplicativity of chi force exp(-it D(H/m)) = 1 + O(s eps), false for one m in an explicit window. Covers the range N >= max(sqrt(q), sqrt(t/2 pi)) (r = 5). An exchange exists only for N of order log q (Lemma D; measured threshold N about 1.4 to 1.9 times log q). Structural form: height and depth are independent coordinates of the dual of R_{>0} x Z_p^x; analytic conductor p^k(1 + abs(t)). In the 7/8 format the depth family is already a subfamily of the targets (no slot for a height), and as a row family it is a full dual group (Parseval, circular) | PROVED (Lemma X, Lemma P; elementary, unrefereed); CLASSICAL (Lemma D, hybrid bounds); MEASURED (six moduli); READ (format requirements N1 to N4) | zeta and U fail the same step (E) by the same lemma: nothing is separated. E_a and T-NR pass or fail (E) exactly as zeta does (the step does not read the coefficients of the target) | `c12-depth-aspect-height-transfer` |

## 5. Control table

The device has two parts: the exchange step (E), and the depth-family statement S_d ("no member of {F (x) chi : chi mod p^k, k >= 1} vanishes in Re s > sigma_0", the 7/8 format posed on the depth family). (E) is a statement about the two twists alone; it does not read the coefficients of the function being twisted. Lemma X therefore gives the same answer for the target and for every control that has integer-indexed coefficients: **(E) fails for all of them, and for zeta.** A device whose first step fails for the target has no R3 content. The table records this and, for information, where S_d stands for each control. No cell was run numerically; all are ARGUED from the definitions unless marked.

| control | step (E) | depth-family statement S_d and the step of the 7/8 format that would fail | separated from zeta? |
|---|---|---|---|
| U (unimodular twist n^(-i alpha)) | (E) is the statement that U is close to a depth member on n <= N: false by Lemma X (PROVED). Same lemma, same step as for zeta | S_d true for U (its depth twists are L(s + i alpha, chi), covered by the 7/8 theorem). Passes the format | no: fails (E) with zeta, passes S_d with zeta |
| T-NR | fails as zeta (step does not read the target) | twists L(s, chi)(conj chi(q) q^(s-1/2) + chi(q) q^(1/2-s) + c), p != q: periodic in the depth aspect, functional equation kept, off-line zeros at Re s = 1/2 +- arccosh(abs(c)/2)/log q at every depth. S_d false for sigma_0 below that. The failing step is the local size condition at q (row Z18), unchanged from the conductor aspect | not by the exchange; by the old step only |
| E_a | fails as zeta | twists L(s + a, chi) L(s - a, chi): periodic, Euler product, functional equation; zeros on Re s = 1/2 +- a at every depth. Failing step: size normalisation abs(eta(p)) = 1 (coefficients n^a), unchanged | not by the exchange |
| DH | fails as zeta | DH (x) chi is a combination of L(s, chi_5 chi) and L(s, conj chi_5 chi); the combination need not keep a functional equation (the two root numbers move independently under the twist; not checked). Not multiplicative: fails at Lemma 7.1 (local identity), as in the conductor aspect | not by the exchange |
| HEAT (backward heat) | not formulable: no integer-indexed multiplicative coefficients to twist | not formulable | no |
| TW+/TW- (sign-twisted primes) | fails as zeta | eps(n) chi(n) is not periodic: Proposition 5.1 fails, as for THIN | not by the exchange |
| THIN | fails as zeta; in addition Lemma X applies to no "exchange of eps for a character" (eps is not periodic, Lemma N of the THIN lane) | Proposition 5.1 (periodicity), unchanged | not by the exchange |
| DEL | fails as zeta | Proposition 5.1 / Lemma N of the DEL lane, unchanged | not by the exchange |
| Beurling | not formulable: no residue classes | not formulable | no |
| phase-rotated transfer operator | not formulable: the device acts on Dirichlet coefficients on Z | not formulable | no |
| theta^w | not formulable for the same reason | not formulable | no |

Reading: there is no control that the depth exchange separates from zeta. U, the control the assignment asked about first, is the exchange itself: the device would need U to be close to a periodic character, and Lemma X is the proof that it is not.

## 6. Pivot

Strongest adjacent idea found: use the fact that Lemma X is a two-place statement (relations trivial at p, non-trivial at infinity) in the positive direction, that is, a hybrid family over R x Z_p^x in which the zero is posed in both coordinates at once. This is the hybrid (q, t) family of L(s + it, chi); it is already inside the 7/8 family (Lemma 1 (a)), its second moment is the hybrid large sieve (a mean value, MV-CAP), and in the row role it is a full dual group (Lemma 1 (c), circular). No step of it was found that is not already a row of the map (Z28, MV-CAP, synthesis section 2 item 2). No pivot was run.

## 7. Requirement flags

- **R1 (all primes together, multiplicativity essential): false.** No attack survives to carry it. Lemma X itself uses multiplicativity of both twists in an essential way, but it is an obstruction, not a statement about the target.
- **R2 (height-uniform, every window): false.** Nothing is proved about zeta. Lemma X is uniform in t (thresholds explicit), which is uniformity of the obstruction.
- **R3 (every control fails structurally, verified): false.** The exchange step fails for zeta and for U by the same lemma; five controls are not formulable.
- **R4 (reaches the critical line): false.** The transfer inequality asked for does not exist in the tested form: its error term is bounded below by 0.479/s times the main term on the ranges where either functional equation acts.

## 8. Verdict

Precise obstruction. The depth aspect cannot carry a height: (E) is false for N >= C_r p (q abs(t))^(1/r) for every r (Lemma X, PROVED, elementary), which contains every range in which the functional equation of either side or a Poisson dual acts (beyond the explicit thresholds of corollary X5), and true only for N of order log q. In the 7/8 format the depth family is a subfamily of the existing targets and the format has no height parameter; as a row family it gives Parseval. Device row written (section 4). No statement about zeros of zeta.

## 9. Three weakest steps

1. **Lemma X closes pointwise exchange with an unimodular constant, not every conceivable transfer.** A transfer that compares zeta at height t with a depth member through an inequality between specific Dirichlet polynomials (coefficients 1 or mu, not general b_n), without the twists agreeing termwise, is addressed only by the remarks of 3.5 (general coefficients, mean values), which are ARGUED/CLASSICAL and do not exclude a relation special to the coefficients of zeta. No candidate for such a relation was found; none was proved impossible.
2. **Section 2 is a reading.** (N1) to (N4) and Lemma 1 (a), (c) rest on the manuscript text and on `c4-thin-twist-control-78`; no proof of the manuscript was replayed, and "the format does not read the height" is taken from the statements of Proposition 2.1 and Lemma 11.1. Lemma 1 (c) (rows: Parseval, circular) is argued in three lines and was not written as a full statement with the probe (6.1).
3. **Constants and the intermediate range.** The general-r thresholds (x_1, t_r, C_r) are explicit only for r = 2; for r = 5 the corollary needs abs(t) >= 2.27e10 and q abs(t) >= (9p)^20, so a finite but large set of (q, t) per prime is left to r = 2, 3, 4 or to nothing; x_1 is computed in floating point from exact power sums (400 terms plus a tail bound), not in interval arithmetic. The thresholds t_r come from using only the leading term of D in a window; a continuity argument on abs(t D(H/m)) (derivative in m at most abs(t) s/(A H)) should replace them by an absolute constant when H >= s abs(t)/A, which would cover bounded heights at large depth. That version is not written. The range (log q)^(1+o(1)) < N < q^(o(1)) is not closed by proof (measured only up to N = 97 on six moduli, primes only, c = 1). The control table is argued, not run. No independent referee.

## Files

- `RESULT.md` (this file), `REFEREE.md` (author's self-check, not an independent referee), `lanes_line.json`
- `exchange_check.py`, `exchange_check.log` (Lemma P exact; best character against n^(-it); forced phase r = 2)
- `rs_regime_check.py`, `rs_regime_check.log` (Lemma X, r = 5, t = 2 pi q)
- `datum_constants.py`, `datum_constants.log` (kappa, x_1, t_r for r = 2..5)
