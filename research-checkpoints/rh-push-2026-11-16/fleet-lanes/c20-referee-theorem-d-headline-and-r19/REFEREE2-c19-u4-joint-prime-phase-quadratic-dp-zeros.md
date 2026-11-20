# REFEREE 2: c19-u4-joint-prime-phase-quadratic-dp-zeros (Lemma Q2; K1, K2, K3; the Liouville row)

Date: 2026-11-20. Lane: `c20-referee-theorem-d-headline-and-r19`. Method: each statement was derived from its
display before the lane's proof and the first referee file were read. Checks: `r19_checks.py` / `.log` (local,
memcap 8 GB). Nothing here is a statement about a zero of zeta.

**Verdict: holds with corrections.** The corrections are those of the first referee (E1, E3), found again
independently; one sentence of the first referee's E1 is itself tightened below (point 5).

## 1. Lemma Q2

Domain: F = sum a_n n^-s with a_1 = 1; P an integer with a_P != 0; D_P its partial sum; **all zeros of D_P
simple**; phi smooth with compact support in the open interval (0, u), u = log P; the zero sums taken as limits
over rectangles abs(Im) < T_k on whose horizontal sides D_P'/D_P is bounded.

- Coefficients. a_n log n = sum over d | n of Lambda_F(d) a_(n/d) involves a_m for m <= n only, so Lambda_D = Lambda_F
  for n <= P; the same holds for Lambda_2 = Lambda log + Lambda * Lambda, the coefficients of F''/F = (F'/F)' + (F'/F)^2.
  No multiplicativity. PROVED.
- Line 1. With phihat(w) = int phi(x) e^(wx) dx, phi(x) = (1/2 pi i) int_(c) phihat(w) e^(-wx) dw, so
  sum Lambda(n) n^(-1/2) phi(log n) = (1/2 pi i) int_(c) phihat(w) (-D_P'/D_P)(1/2 + w) dw. Moving the line to the
  left: phihat decays like e^(x_0 Re w) (x_0 > 0 the left end of the support) while D_P'/D_P -> -u; the residues of
  -D_P'/D_P are -1 at each zero. Result: - sum phihat(w_beta). Sign as printed. PROVED.
- Line 2. D_P''/D_P has residue D_P''(beta)/D_P'(beta) at a simple zero and tends to u^2 on the left. Sign as
  printed. PROVED.
- Line 3. Write D_P = (s - beta) h. Then D_P''(beta)/D_P'(beta) = 2 h'(beta)/h(beta) = 2 g_beta(beta) with
  g_beta = D_P'/D_P - 1/(s - beta). The constant of the Hadamard form: the zeros lie in a vertical strip with
  density u/(2 pi) per unit height, so the symmetric sum of 1/(s - beta) tends to +u/2 as Re s -> +infinity and
  to -u/2 as Re s -> -infinity, whatever the real parts are; D_P'/D_P tends to 0 and to -u. Hence the constant is
  -u/2 for every a_P != 0, and D''/D'(beta) = -u + 2 lim sum' 1/(beta - beta'). PROVED (one classical input: bounded
  D'/D on suitable horizontal lines). Checked independently on a series with a_P = 0.25 and a complete zero list
  (see REFEREE2 for the census lane): ratio of the measured truncation residual to the predicted tail 0.993,
  1.003, 0.998 at T = 375, 750, 1500.
- **Correction (same as E3).** "The sums converge absolutely" is proved for the first-order sum only. For the
  second-order sum the weight D''/D'(beta) is unbounded when two zeros approach and no separation bound is given.
  The lemma is established as a limit over the heights T_k.

## 2. The Liouville row (the corrected entry)

For completely multiplicative eps, Lambda_eps(p^k) = eps(p)^k log p and the cross part of Lambda_2 at n = p^j q^k is
2 eps(p)^j eps(q)^k log p log q. For Liouville this is 2 (-1)^(j+k) log p log q: positive at p q, negative at p^2 q.
The first failing atom is n = 12 (value -2 log 2 log 3 = -1.5230), so a control case must have P > 12. Recomputed
from a(n) by two nested recursions (`r19_checks.log`): Lambda_2(6) = +1.5230, Lambda_2(12) = -1.5230; negative at the
cross atoms 12, 18, 20, 28, 44, 45, 48, 50, 52 below 60. The lane's check at P = 10 contains only the cross atom
6 and cannot see the failure. **The corrected row is right: Liouville fails step (2) at p q^2; it passes only for
P <= 12.**

Which sign chains pass at every P: j = k = 1 forces eps(p) eps(q) > 0 for all pairs, and j = 2, k = 1 forces
eps(q) > 0. So eps = +1 only (given two primes). The member with "all atoms in phase, opposite sign" is 1/zeta
(Lambda = -Lambda_zeta): smallest cross part over two-prime n <= 60 is +1.5230 (recomputed).

Other rows recomputed: T-NR, q = 3, c = 2.2: Lambda(q^j)/log q = 1 - q^(j/2)(alpha^j + alpha'^j) = 4.81, -7.52, 22.03,
-53.59 (lane: 4.81, -7.52, 22.0, -53.6). HQ2 at q = 3: first j with nu(q^j) < 0 is 8, 13, 22 for eps = 1, 0.1, 0.01
(lane: 8, 13, 22; exact rational series).

## 3. Theorem K1, Lemma K2, Proposition K3

- K1. Linear independence of the log p over Q and Kronecker give a relatively dense set of tau with
  abs(p^(-i tau) - eps(p)) < delta for p <= P; then abs(n^(-i tau) - eps(n)) <= delta Omega(n) <= delta log_2 P and the sup
  over a compact set is at most delta log_2 P sum n^(-sigma_min). Holds. It is Bohr equivalence for a Dirichlet
  polynomial. The consequence ("a statement on zeros of D_P in a window, uniform in height at fixed P and stable
  under locally uniform limits, holds for every unimodular chain") follows by Hurwitz. PROVED.
- K2. If tau emulates alpha and tau' emulates alpha' with alpha_p != alpha'_p, then (tau - tau') log p/(2 pi) is
  within 2 delta of 1/2 modulo 1, so abs(tau - tau') >= pi (1 - 4 delta)/log p >= pi (1 - 4 delta)/log P; a set of points
  with pairwise distance above that bound has at most 1 + 2T log P/(pi (1 - 4 delta)) members in [-T, T]. PROVED.
  Domain: delta < 1/4. It bounds one transfer mechanism, as the lane says.
- K3. zeta(s)(1 + q^(b-s)) has coefficients 1 + q^b [q | n], equal to 1 for n <= P < q; zeros of the factor at
  b + i pi (2k+1)/log q. PROVED (one line). The HQ1 clause is relative to c18 Proposition F (re-derived in
  `REFEREE2_c1-leeyang-krein-limit.md` only to the extent "the factor vanishes on Re s = 3/4": checked at
  q = 5, 101, 10007).

## 4. Flags

R1 false (Q2 uses a_1 = 1 only; candidate (J) is implied by Lambda >= 0 atom by atom, and E_a, DEL pass it).
R2 false. R3 false (E_a, DEL pass every completed step; HQ2 passes at each P). R4 false (step F not completed;
K3).

## 5. Remarks for the record

- First referee, E1 last bullet: "all >= 0 or all <= 0 over the primes that occur" describes signs of Lambda at
  all prime powers (zeta and 1/zeta). For sign chains the class is eps = +1 alone; "all eps(p) <= 0" is Liouville
  and fails. The sentence should name Lambda, not eps.
- The RESULT.md text still carries "Liouville passes" in summary item 3, the stage A table and the proposed map
  row (read 2026-11-20). The learn step should use the corrected wording.
