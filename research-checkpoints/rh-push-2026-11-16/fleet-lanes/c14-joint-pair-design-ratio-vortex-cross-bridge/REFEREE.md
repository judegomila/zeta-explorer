# REFEREE.md: c14-joint-pair-design-ratio-vortex-cross-bridge

Status of this file: the author's own second pass, done after the text was written, by re-deriving each
labelled statement from its hypotheses. It is not an independent referee. An independent referee is owed
before any later lane builds on Lemma A, Lemma C or identity TW.

## Re-derived and held

1. Local factor image (2.1). f(z) = (1 - z)/(1 - omega z) at z = e^(i phi), omega = e^(i theta):
   numerator e^(i phi/2)(-2i sin(phi/2)), denominator e^(i(theta+phi)/2)(-2i sin((theta+phi)/2)); quotient
   e^(-i theta/2) sin(phi/2)/sin((theta+phi)/2). Real multiple of e^(-i theta/2): a line through 0; f(0) = 1
   fixes the side. theta = pi gives the imaginary axis and tanh. Holds.
2. Gamma-free functional equation (2.1). For chi even, Lambda(s, chi) = (q/pi)^(s/2) Gamma(s/2) L(s, chi) and
   xi*(s) = pi^(-s/2) Gamma(s/2) zeta(s) give Q_chi(s) = q^(-s/2) Lambda(s, chi)/xi*(s); the two functional
   equations give eps q^(1/2 - s) Q_chibar(1 - s). Numerical defect 7e-17 to 2e-29 (C1). Holds; the statement
   is restricted to even chi in the text.
3. Lemma C. Twist of zeta D: a(n) = sum over d = p0^k dividing n of d-coefficients; chi(n) a(n) splits as
   chi(n/d) chi(d) by complete multiplicativity. Holds. The in-strip range 2 < c < p0^(1/2) + p0^(-1/2) is
   the one recorded in the map (row Q28, second referee). Dirichlet's theorem supplies p0.
4. Lemma N. sum_chi chi(n) = phi(q) 1_(n = 1 mod q) for Re s > 1, then continuation of both sides
   (q^-s zeta(s, 1/q)); zeta(s, 1 + 1/q) is bounded as q grows for fixed s != 1. Holds. The non-vanishing
   character can be imprimitive; its primitive inducer is non-zero at s_0 as the missing Euler factors do not
   vanish for Re s > 0. The principal character contributes 0 at a zero of zeta, so the non-vanishing one is
   non-principal.
5. Lemma A. Averaging step and integrality: holds, given the density bound with T fixed. The exponent
   3(1 - sigma)/(2 - sigma) equals 1 at sigma = 1/2 and is below 1 to the right. phi(q) is not needed since
   the hypothesis counts characters as q^theta'.
6. Identity TW. Coincidence bound: n m' != m with m, m' <= M gives abs(n m' - m) >= 1 and both of n m', m are
   at most max(n m', M); if n m' > m then log(n m'/m) >= log(1 + 1/m) >= log(1 + 1/M); if n m' < m then
   log(m/(n m')) >= log(1 + 1/(M - 1)). Holds. The diagonal m = m' of the gamma-kernel term cancels because
   abs(chi(m)) = 1. Holds for c supported on integers coprime to q.
7. Cross Gram rank (3.2). Cauchy determinant prod (z_i - z_j)(conj w_i - conj w_j)/prod (z_i + conj w_j) is
   non-zero for distinct nodes in the right half-plane. Holds for finite simple pole sets.
8. Table of section 2.6 against `checks.json`: principal psi removed from each count; 7 of 141 and 12 of 141
   recomputed from the per-character lists. Holds.

## Corrections made in this pass

- E1. The formula for P_F had Lambda_F outside the real part; for complex chi it belongs inside. Corrected.
- E2. 3.1 (c) said the anticausal block of the quotient symbol "is non-zero in the true case". Narrowed to
  "except by coincidence of a zero of N_chi with a zero of N_zeta" and labelled ARGUED.
- E3. The paper expectation for the DH row before the run was "positive rate in both boxes, no enhancement
  at the DH zero". The measurement agrees; it also shows the all-chi form of COMP is false for DH at every
  measured modulus and leaves the q^theta' form undecided. The table row states exactly that.

## Not verified (labels to keep)

- The density theorem was recalled, not opened: Lemmas A and B are PROVED-rel.
- Existence of DEL/THIN sets regular in residue classes mod q with the stated error: ARGUED.
- Inequality (X): ARGUED, constants not computed, sign of the pole term handled by a linear condition only.
- "Typical head-matched twist is non-vanishing" (2.5): heuristic, ARGUED.
- E_a row of 2.6 (COMP holds): needs N_chi(1/2; W') >= N_zeta(1/2; W), which is not known unconditionally
  in every window. ARGUED.

## Flags (referee view)

R1 false, R2 false, R3 false, R4 false. No statement about zeros of zeta. Score 0. The lane decides three
candidates (closed at stage A, with T-NR, BLS and DH as passing controls) and leaves one conditional
reduction (Lemma A) whose hypothesis is equivalent to the target.

---

# Independent adversarial referee (lens: general), 2026-11-19

Scope: every PROVED / PROVED-rel step re-derived from its hypotheses; numeric checks rerun with different
cases (local, `scripts/memcap.sh 8`, `.venv-arb/bin/python`, two runs, 5 s and 56 s, largest array 2.1 MB;
scripts kept outside the lane in `/tmp/c14ref/`: `ref.py`, `dh.py`; the server was not used).
The author's pass above is not an independent referee; `lanes_line.json` records `referees: 1` for it, which
should read 0 before this section.

**Outcome: holds, with five corrections of wording or range (none breaks a PROVED step, none changes the
verdict). Verdict precise-obstruction confirmed. No statement about zeros of zeta. R1 = R2 = R3 = R4 = false.**

## A. Re-derivations

| step | label in RESULT | referee | note |
|---|---|---|---|
| 2.1 local factor image, tanh product for real chi | PROVED | confirmed | Moebius map with pole 1/omega on the circle; boundary formula recomputed |
| 2.1 gamma-free functional equation, chi even | PROVED | confirmed | Q_chi(s) = eps q^(1/2-s) Q_chibar(1-s); rerun R1 below, complex even characters |
| 2.2 first lemma (winding of Q = N_L - N_zeta; Littlewood additive) | PROVED | confirmed | for rectangles not containing s = 1 |
| 2.3 Lemma C | PROVED | confirmed | with x = p0^(1/2-s), D = 1 - c x + x^2: zeros at real x with x + 1/x = c, in the open strip iff 2 < c < p0^(1/2) + p0^(-1/2); D_chi(1-s) = chi(p0)^2 p0^(2s-1) D_chibar(s), so the twist has a functional equation of conductor q p0^2; chi(p0) = 1 gives D_chi = D |
| 2.4 Lemma N | PROVED | confirmed | orthogonality + continuation; rerun R3 tests the character-average side, which C3 did not |
| 2.4 Lemma A | PROVED-rel | confirmed rel. the density theorem, with correction E1 | min over X_q <= average over X_q <= q^(-theta') (sum over all chi); integer < 1 |
| 2.5 Lemma B | PROVED-rel | confirmed | Markov on the same sum |
| 3.2 cross Gram rank | PROVED (finite simple pole sets) | confirmed | rank(A* B) = rank of the Gram matrix between bases of the two ranges = Cauchy matrix 1/(z_j + conj w_k); needs distinct z_j, distinct w_k, nothing else ("disjoint" is not needed: a shared pole set also gives full rank, R4 below) |
| 4.1 identity TW | PROVED | confirmed | coincidence bound re-derived both ways (n m' > m: ratio >= 1 + 1/M; n m' < m: ratio >= 1 + 1/(M-1)); chi(n m') conj chi(m') = chi(n) for (m', q) = 1; for (n, q) > 1 both sides vanish; ||g_c||^2 = ||phi||^2 ||c||^2 since delta <= log(1 + 1/M) |
| 4.3 (iii) Lambda_(F tensor chi) = chi Lambda_F for every Dirichlet series with a_1 != 0 | used | confirmed | twisting by a completely multiplicative function is a homomorphism for Dirichlet convolution and commutes with multiplication by log n |
| note (2): DH twist keeps its functional equation iff chi5^2(q) = 1, i.e. q = +-1 mod 5 | stated | confirmed | root numbers of L(chi psi), L(chibar psi) differ from the untwisted pair by chi(q), chibar(q) |

The density theorem (Montgomery, Topics, Theorem 12.1) was again recalled, not opened. The recalled form
agrees with the referee's recollection: sum over chi mod q of N(sigma, T, chi) << (qT)^(3(1-sigma)/(2-sigma))
(log qT)^9 on [1/2, 4/5] and << (qT)^(2(1-sigma)/sigma) (log qT)^14 on [4/5, 1], uniform in q >= 1, T >= 2.
Lemmas A and B stay PROVED-rel.

## B. Numeric reruns (different cases)

- R1 (functional equation). Even complex characters mod 7 (order 3) and mod 13 (orders 6, 3, 2), eps =
  tau(chi)/sqrt(q), at s = 0.3 + 9.1i and 0.62 + 27.4i: defect <= 6.2e-15 with abs(Q) between 0.13 and 3.2
  (10 cases). Negative control: an odd character mod 7 with the same formula gives defect 0.88, as the text
  says (gamma quotient remains).
- R3 (Lemma N at a zero of zeta, s_0 = 1/2 + 14.134725i; direct average over all characters, each L by
  Hurwitz sums). q = 13, 37, 211: abs(L(s_0, chi_0)) <= 7.5e-16; abs(average - q^(-s_0) zeta(s_0, 1/q)) <=
  5.7e-15; abs(average - 1) = 0.145, 0.033, 0.0025; smallest non-principal abs(L(s_0, chi)) = 0.387, 0.035,
  0.0061. Lemma N holds in these cases.
- R-TW (identity TW). M = 12, q = 7, chi of order 3, random complex c on m <= 12 coprime to 7, asymmetric
  bump of half-width 0.49 log(1 + 1/M). (g_c * g_c~)(log n) against ||phi||^2 sum c_(n m') conj c_m':
  defect <= 1.4e-8 (quadrature) for n = 1..13, 24, 36; twisted against chi(n) times untwisted: <= 1.9e-17.
  Negative control: half-width 1.6 log(1 + 1/M) gives defects 0.049, 0.020, 0.024 at n = 1, 2, 3: the
  width condition is used and is the right one.
- R4 (Cauchy rank). Random nodes in the right half-plane, (m, n) = (3, 5), (4, 4), (6, 2): numerical rank
  3, 4, 2. Shared pole set (z = w, m = 3): rank 3.
- R-DH (stage-B table, different moduli and a second off-line zero). Same counting code, step 0.01. Boxes
  A = [0.6, 1.4] x [84.7, 86.7] and A2 = [0.55, 1.35] x [113.2, 115.2] (the second off-line zero of f near
  0.65 + 114.16i; psi principal counts 1 in both), control boxes B = [0.6, 1.4] x [94, 96] and
  C = [0.6, 1.4] x [104, 106] (psi principal counts 0). Non-principal twists with a zero:

  | q | q mod 5 | A | A2 | B | C |
  |---|---|---|---|---|---|
  | 41 | 1 | 3 of 39 | 2 of 39 | 3 of 39 | 5 of 39 (*) |
  | 59 | 4 | 6 of 57 | 7 of 57 (*) | 7 of 57 | 4 of 57 |
  | 13 | 3 (no FE) | 1 of 11 | 4 of 11 | 3 of 11 | 4 of 11 |
  | 17 | 2 (no FE) | 3 of 15 | 3 of 15 | 3 of 15 | 4 of 15 |

  Moduli with the functional equation: boxes at a zero of f 18 of 192, control boxes 19 of 192. No zero of a
  member L-function in any box; no negative winding number. (*) largest argument step 2.95 rad (q = 41, C)
  and 2.82 rad (q = 59, A2): on those two contours one count may be off by one. The registered expectation
  of the lane (positive rate in both kinds of box, no enhancement at the zero of f) is reproduced on new
  moduli and a new zero. The background rate here is about 0.10 per box, against 0.07 in the lane's table.

## C. Errors and corrections

- E1 (range, Lemma A and the proposed map row). The exponent 3(1-sigma)/(2-sigma) is the recalled bound on
  [1/2, 4/5] only. Lemma A is stated for every sigma_0 > 1/2 and the map row prints
  "theta' > 3(1-sigma)/(2-sigma)" without a range. For sigma_0 > 4/5 use the second range of the theorem, or
  monotonicity N(sigma_0) <= N(4/5) (theta = 1/2). The lemma stands after this repair.
- E2 (verdict item 1 against section 2.6). The verdict says COMP holds for T-NR and E_a "exact". For T-NR at
  a split prime the two sides of COMP differ from those of zeta by the same integer N_D(W) (and N_D(W) <=
  N_D(W')), so COMP for the control holds exactly when COMP for zeta does; "holds with equality" should read
  "is the same statement as for zeta plus a common term". For E_a the row of 2.6 is labelled ARGUED (it needs
  N_chi(1/2; W') >= N_zeta(1/2; W) in every window, not known unconditionally for bounded H'); the verdict
  line should carry that label, not "exact".
- E3 (section 4.3, last paragraph). "General form of the finding (PROVED as stated)" is proved for the TW
  construction only. As a statement about every pair functional that consumes the twist relation it is
  ARGUED. The closure of J3 does not depend on the general form.
- E4 (reading of the DH measurement). (i) "The all-chi form of COMP is false for DH" is established only
  with W' = W (H' = 0) and boxes cut at Re s = 1.4; COMP allows any fixed H'. (ii) With a background rate of
  0.07 to 0.10 off-line zeros per twist per box of height 2, a window W' of fixed larger height is expected
  to contain an off-line zero for most twists, so the q^theta' form of COMP is expected to HOLD for DH for a
  reason unrelated to the zero of f (ARGUED from the measured rate). This agrees with the table's reading
  (DH fails the density link, not the comparison link) but the text should say it, since it shows link 1 has
  no content for a control with a positive density of off-line zeros. (iii) "The DH zero is not carried to
  its twists" is a statement of no detected enhancement in samples of 141 and 192 twists, float64 winding
  numbers, no interval certificate. Label stays MEASURED.
- E5 (check C3). C3 evaluates only the closed form q^(-s) zeta(s, 1/q), and at the off-line zero of DH,
  which is not a zero of zeta; it does not test the orthogonality side of Lemma N. R3 above does. Also: for
  moduli without the functional equation (13, 17) the principal twist still shows one zero in A and A2 (the
  factors 1 - chi(q) q^(-s) and 1 - chibar(q) q^(-s) differ, and the zero moves by a perturbation of size
  q^(-0.8)); this is consistent with the text, which claims exact reproduction only for q = +-1 mod 5.

Not errors, recorded: (a) 3.2 is for finite simple pole sets; for an infinite set the statement "X_c = 0 iff
one member is causal" is not proved here. (b) TW second line is for chi even; for chi odd the two gamma
kernels differ and an extra archimedean term appears, as the text notes for 2.1 but not in 4.1.
(c) Inequality (X), the DEL/THIN row, the E_a row and the heuristic of 2.5 remain ARGUED and are not used by
the verdict.

## D. Checks on the framing

- Nothing assumes RH or GRH in a PROVED step. The conditional phrases (3.1 (c) "under RH and GRH"; 2.6 E_a
  row "GRH-size bounds") sit in ARGUED rows.
- No restatement of verified height. Lemma A is stated by the lane itself as an equivalence with the target
  (RH implies COMP trivially); it is a two-line corollary of the classical density theorem and is not
  presented as a theorem about zeta. Lemma N (orthogonality), the functional equation of L/zeta, the Cauchy
  determinant and TW (support separation in the explicit formula) are elementary or classical; the lane
  lists them as "not on file", not as new theorems. Acceptable.
- Controls rerun by the referee where the lane names a passing control: T-NR algebra (Lemma C) re-derived,
  DH twist family remeasured. The lane claims no zeta-only mechanism, so there is no separation claim to test.

## E. Requirement flags (referee, strict)

- R1 false: no proved inequality; TW uses multiplicativity of chi, not of the target.
- R2 false: no conclusion in any window is established (COMP is a hypothesis).
- R3 false: T-NR passes J1 on a fixed set, BLS passes J2, DH / T-NR / E_a pass J3; in the chain no argument
  exists for a control to fail.
- R4 false: Lemma A is conditional on a hypothesis equivalent to the target.

holds = true (obstruction verdict; all PROVED steps confirmed; corrections E1 to E5 to be applied to the
text). Score 0.
