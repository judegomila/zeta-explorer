# REFEREE: c22-referee-r21-theorem-w-p0-p1-theorem1prime-ts-line11 (lens: general)

Date 2026-11-20. Adversarial reading of `RESULT.md` and its six `REFEREE2.md` files. Only this file was
written. Local checks ran through `scripts/memcap.sh 8` (python3.14, mpmath 30 to 40 digits, numpy float64;
scratch scripts outside the repo, 30 s in total). The server was only queried for unit state.

## Verdict

**Holds.** No PROVED step failed on re-derivation. No statement about zeros of zeta is made. Nothing assumes
RH, nothing restates verified height as a result, and the one textbook theorem (Hamburger) is labelled as
such in the refereed lane. Seven minor errors or omissions of wording are listed below; none changes a verdict
of the result.

Requirement flags, set here: R1 = false, R2 = false, R3 = false, R4 = false. The result establishes none of
them (it tests no attack; Theorem W uses pairwise irrationality of log q only and concerns non-continuation of
a relative product; Theorem H assumes the continuation).

## Re-derivations (all by hand, from the lane texts)

1. Theorem W, steps 0 to 5. Confirmed: the pole kernel limit e^(i omega y_i)(2 pi T(y_i) - tail); identity (2)
   by dominated convergence (A - 1 >= gamma); inequality (4); not k-bad gives h lambda_k^-gamma/(8Z); the
   six-term product in 4 (b) term by term; lambda_k <= (16/7) X lambda_(k0); the last four terms are
   o(X) from N(Y) = o(Y^gamma); total X(1/4 + 1/8 + o(1)). Order of constants has no circularity.
   **The correction E1 is right and necessary**: with the lattice lambda_k Z the nearest point for
   lambda_k > 2 n lambda_(k0) is 0, W_k -> infinity, so every n is k-bad for all large k; the repair (distance
   to {m lambda_k : m >= 1}) leaves (4) and step 4 intact.
2. CYC closed form: N_1 = 1/(1 - w) gives H = -lambda_0 sum_{m>=1} e^(-m lambda_0 z), so (2) equals
   -lambda_0 sum_m T^(omega - m lambda_0) = -2 pi sum_j T(2 pi j/lambda_0) e^(...) by Poisson. Confirmed.
3. Lemma P0 (5 lines) and P1 (5 lines): confirmed. The scope correction is right: for S = all primes
   R_S = zeta(s)/zeta(s - 1/2) and G = zeta(s - 1/2).
4. Theorem H: residue of t a_n/(pi(t^2 + n^2)) at i n is a_n/(2 pi); period i on the connected slit domain;
   a_n = a_(n+1). Theorem H' by Phragmen-Lindelof on width 1 + 2 delta. Both corrections (the closed strip;
   "symmetric" at s = 1) are right. NWM: the two turned paths sum to 2 sin(r log r) e^(pi r/2) e^(-kappa(s-1/2)r);
   R(s) = R(1 - s); 1 + R -> 1 as sigma -> infinity. Confirmed.
5. Line 11: Q_sym - Q_gen has numerator A(z_i) - C(conj z_j); C(conj z) = -conj C(z); meromorphic equal to
   anti-meromorphic forces A = C = i kappa, kappa real; then F = exp(i kappa z/2) F_1 with F_1 even up to sign.
   Confirmed in both directions.
6. V6: f = (-1)^(v_6), a_n = 2/k at n = 6^k, k odd, 0 elsewhere; density 5/7. HQ1, HQ2, HQ3, HQ4, E_a first
   negative coefficients recomputed by hand from the local logarithms: -1.41421, -7.07107, -1.4, -0.5398,
   -9.5409, -1.01925. Confirmed.
7. Lemma TS-1 (i): confirmed, and C5 is right (the second equivalence uses multiplicativity of c).

## Numeric checks rerun on different cases (this referee; float, not balls)

| Check | Case chosen here | Outcome |
|---|---|---|
| CYC signed sum against Poisson | (k_0, h, n, y_c) = (7, 0.5, 3, 0); (7, 0.5, 3, 0.3); (10, 2, 5, 0.4); (8, 1, 9, 5.9) (window on the next pole 2 pi/log 3); (8, 0.5, 4, 3.0) (no pole in the window) | -12.765836814587; -0.062839994955; -7.7288084514; -8.4821159251; 0 (4.9e-14). Each equals -2 pi sum_j T(y_j) e^(i omega y_j) to all printed digits, against spikes 70 to 2250 |
| Good fraction on k^1.5 | third model lambda_k = k^1.5 + 0.3 cos(k sqrt 2), seven lattice points per k, (K_0, k_0, N) = (50, 53, 300), (1000, 1009, 500), (5000, 5003, 500), (20000, 20011, 300) | 0.010, 0.326, 0.564, 0.770: on the same curve as the result's table (0.18 at 600, 0.41 to 0.46 at 2500, 0.55 to 0.67 at 10^4, 0.65 to 0.79 at 4 * 10^4) |
| NWM zero, kappa = 4 | winding number of 1 + R on the circle of radius 1e-3 (not 1e-9) about s_0, 64 points | 1.000; abs(1 + R(s_0)) = 2.2e-15; R(2 + 0.7i) agrees to 17 digits; zeta(s_0) = 0.4917622 + 1.2110631i; abs R on the line 7.38366 and 5.9244e9 |
| Line 11 | twist cell reproduced (-4.746229229482930); new twist alpha = 0.5, rate 0.25 - 20.5i; new gauge 0.2 i | Q_sym - Q_gen = -14.9919160768 = [Re L_0(z + i alpha) - Re L_0(z - i alpha)]/Re z; gauge difference 1e-30 |
| V6 test | recursion to n = 1300; V10 (new); HQ2 with q = 3, eps = 0.5 (new) | V6: a_n >= -5e-16, non-zero at 6, 216 only; V10: 2 at 10, 2/3 at 1000; HQ2: a_9 = -1.5 = -eps q |
| Text of TWIN_SCREEN sample | screened.jsonl lines 3, 5, 6, 9, 14, 22, 44, 70, 106, 117; map rows P40, P58, P36, P21, Z15, G13, G17, G38, G11; devices.json | quotations and C2, C3, C4 confirmed; devices.json has 58 entries |

Controls: this result claims no zeta-only mechanism, so there is no attack to run against the nine controls.
The controls that are test objects of the refereed claims (CYC, NWM, V6, HQ2, unimodular twist, gauge member)
were rerun above on new cases and behave as stated.

## Errors and omissions (minor)

1. Section 0 presents E1, the closed-strip correction of H' and the line-11 necessity gap as findings of
   this lane. Each is already in the refereed lane's own `REFEREE.md` (E1 with the identical repair; the
   closed-strip sentence; E4). The REFEREE2 files say so; `RESULT.md` and `lanes.jsonl` do not. What is new
   here: remark E2, the P0 scope sentence, "symmetric" in H1 (a), the Rouche enclosure, the exact line-11
   condition, C1 to C5.
2. Section 2.1, CYC: "lambda_(k0)/lambda_k is an integer for k < k_0 and every n is k-bad" covers only tails
   that contain an index K_0 < k < k_0. With k_0 = K_0 + 1 the failure is at k > k_0, where the ratio 2^-(k-k0)
   is rational and the bad count is the rational one (0.125 at (9, 12) in the lane's own data), not Weyl's.
   The location of the failure (irrationality in step 4 (a)) is unchanged.
3. The test window cos^10 is of class C^9; Theorem W asks for class C^A with A = 11. The proof uses only the
   decay bound abs(T^(xi)) <= C h (1 + h abs xi)^-11, which the window has. The hypothesis of the test should
   be stated as the decay bound.
4. Section 2.1: "the mean number of such points agrees with sum 2 W/lambda_k (0.66 to 0.80 against 0.65)"
   omits the row k_0 = 40001 (0.595 against 0.303), which the REFEREE2 file reports. The expected count uses
   the fixed width 19 = 6 pi, not the proof's W_k.
5. The scan is a float64 screen with five nearest lattice points per k and does not reach the proof's constants
   (K_0 of order 1e9 to 1e10 by my estimate). Declared in the result. It supports the mechanism, not the theorem;
   the theorem rests on the paper proof, now read by two referees beyond the author.
6. TWIN_SCREEN row 8 (P40) is marked "agrees, verbatim"; the map row reads "holds for DH up to O(t^{-2})",
   the screen "holds for DH to O(t^-2)". Same meaning; not verbatim.
7. Not rechecked by the result, as it states: 68 of about 90 TWIN_SCREEN rows; TS-1 (ii), (iv); the contour
   and sign-twist cells of line 11; two of three NWM zeros; THIN x V6; the ARGUED closed-strip passage for
   abs(alpha_p) <= 1. The Arb bound for f'' in the Rouche step was not re-derived here (the float winding
   number above agrees).

## Compliance

Server units `rh-c22refm`, `rh-c22refw`, `rh-c22refs`, `rh-c22refw2`, `rh-c22refw3`: all inactive. The unit
`rh-c22refh-1120150911` seen running belongs to another lane's directory. No file outside this lane's
directory was edited by the result. Novelty of Theorem W against the literature on natural boundaries of
Euler products was not checked by anyone (the lane says so).

## Surviving claim

Six second readings of round-21 claims; no PROVED claim breaks. Theorem W holds after the repair of step 3
(distance to {m lambda_k : m >= 1}); it is a statement about non-continuation of a relative Euler product over
a sparse set, uses pairwise irrationality of log q only, and fails for CYC at the irrationality step. P0
(with its hypothesis), P1, Theorem H (Hamburger, finitely many poles), H' in the strip form, NWM as a control
with one off-line zero, the sampled TWIN_SCREEN verdicts, Lemma TS-1 (i), the exact line-11 condition and the
V6 test hold. No statement about zeros of zeta. R1 = R2 = R3 = R4 = false.
