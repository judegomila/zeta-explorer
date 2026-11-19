# REFEREE: c7-bridge-seven-eighths-krein-index (lens: general)

2026-11-18. Adversarial read of RESULT.md. Verdict under review: precise-obstruction, gain 0, flags R1-R4 all false.

## Outcome

**The verdict holds, with the scope restrictions listed under "Errors and overstatements".** Every step labelled
PROVED was re-derived by hand and confirmed; one independent numeric run on a different toy agrees. No step assumes
RH, none restates verified height, no statement about zeros of zeta is made. Flags set by this referee:
R1 = false, R2 = false, R3 = false, R4 = false.

## Re-derivations (by hand)

- **Lemma 1(b).** Kernel k(x - y) on x < -c, y > 0; the fibre {y - x = u} has length u - c for u > c;
  int_c^inf (u - c) e^{-s u} du = e^{-s c}/s^2 with s = conj z_j + z_k. Confirmed.
- **Lemma 1(c).** Gamma_-^[c] = -sum r_j |a_j^c><b_j|, both Gram matrices are Cauchy-type and invertible for distinct
  z_j in Re z > 0, r_j != 0. Rank |Z_+| for every c. Confirmed.
- **Lemma 1(d).** A2_jk = int_0^inf u e^{-(conj z_j + z_k) u} du is the Gram matrix of u^{1/2} e^{-z_k u}; positive
  definite for distinct z_k; |v_j|^2 = |r_j|^2 e^{-2 x_j c}. Rate = min x_j follows. Confirmed.
- **Lemma 1(e).** z - rho = -alpha m/(1 + alpha h), L' ~ -1/(alpha^2 m), r = -2 alpha m (1 + O(alpha)). Confirmed.
- **Lemma 1(f).** Real pair +-beta: L = 2z/(z^2 - beta^2), root w = sqrt(alpha^2 + beta^2) - alpha, singular value
  |r|/(2w) e^{-wc}; at alpha = 0.01, beta = 0.375 by hand: r = -0.019467, |r|/(2w) = 0.026657 = alpha/sqrt(alpha^2+beta^2).
  Confirmed (see wording item 1 below).
- **Lemma 2.** lam_min(G~ o A2) >= (min diag G~) lam_min(A2) is the standard Schur-product eigenvalue bound. Confirmed.
- **Theorem B(c), half-disk.** For z = x + iy, d = y - gamma, the pair b + i gamma, -b + i gamma contributes
  2x(x^2 + d^2 - b^2)/(...) to Re L; on-line zeros contribute x/|z - i gamma|^2 > 0. Outside all half-disks Re L > 0,
  so 1 + alpha L != 0. Poles of S lie in a half-disk, Re z_j < b <= 3/8. The same computation gives |S| <= 1 on
  Re z >= 3/8 (used in Prop. D(a)). Confirmed.
- **Theorem B(b).** Sum of non-negative terms; for G = v v* the form is v* A2 v over the union, positive definite
  when the union consists of distinct points. Confirmed for finite families.
- **Theorem C.** Linearity of the kernel in L is immediate. The index statement is imported (sq-krein-index Thm A,
  no REFEREE.md present in that directory); checked numerically here, including a shared zero.
- **Prop. D(c).** Translation along the imaginary axis preserves the symmetry rho -> -conj rho; modulation is
  unitary and commutes with the half-line projections. Confirmed.

## Independent numeric run (different case)

Own script (/tmp/c7ref/ref.py, numpy double, `scripts/memcap.sh 8`, largest array 64 MB). Toy A: axis zeros at
0.6, 1.9, 3.4, 5.0; quartets (0.25, 2.2), (0.37, 6.3); one real pair +-0.15; alpha = 0.45.

| Check | Result |
|---|---|
| RHP poles of S, Newton from 4000 random starts | 5; argument principle for 1 + alpha L on a box gives zeros - poles = 0, so 5 zeros. Matches the 5 off-line RHP zeros |
| Poles inside half-disks | all 5; max Re z_j = 0.2094 < 0.37 |
| k from a 4e6-point transform of S on the axis vs pole sum | max difference 1.0e-5 on u in [0.2, 60] |
| T(c), quadrature vs pole formula, c = 0, 0.5, 2, 7, 15 | 1.304796/1.304803, 1.205896/1.205896, 0.987171/0.987171, 0.634851/0.634851, 0.398929/0.398929 |
| Two-sided bound of Lemma 1(d) | holds at all five c |
| Rate on c in [150, 200] | 0.0263097671 vs min Re z_j = 0.0263097671 |
| Rank of discretised gapped block (700 x 700), c = 0 and c = 3 | 5 and 5 |
| Lemma 1(e), alpha = 1e-2, 1e-3 | max |z - (rho - alpha)| = 5.2e-4, 5.4e-6; max |r + 2 alpha| = 2.1e-3, 2.2e-5 (second-order, as stated) |
| Lemma 2, random complex PSD G on three members (2, 4, 1 poles) | T_G >= lower bound at c = 0, 4, 30 (12.35 vs 0.163; 7.12 vs 0.061; 1.120 vs 0.0014) |
| Theorem C with a zero shared by two members and weights (0.37, 2.9, 1.3) | member counts sum to 7; distinct points 5; Pick matrix negative eigenvalues 5; RHP poles of S_c 5 (Newton and argument principle) |

The shared-zero case was not in the author's run and confirms "distinct points", not the sum of member indices.

## Controls

The result claims no zeta-only mechanism. Lemma 1, Lemma 2, Theorem B(a,b), Theorem C use only a symmetric zero
set and a partial-fraction L; my toy A is an arbitrary rational control and all of them hold on it. Theorem A is
Paley-Wiener for a function bounded and analytic in a right half-plane and holds for any prime data with
|lambda(n)| <= log n. The only step that distinguishes zeta-type members is the imported 7/8 theorem. The author's
statement "no step of this lane fails on a control" is correct, and it is the reason R3 is false.

## Errors and overstatements

1. **Lemma 1(f) wording.** "Isolated pair ... both singular values" mixes two cases. For a real pair there is one
   pole and one singular value and the formula is exact. The toy T2 uses a quartet at gamma = 400 (two poles, two
   nearly equal singular values); there the formula is an approximation (agreement 1e-7), not an identity. No effect
   on the verdict.
2. **"Closed" is wider than what is proved.** Lemmas 1-2 and Theorem B are proved for finitely many simple poles and
   finite families. For an infinite pole set the rate is an infimum, lam_min(A2) can tend to 0, and the pole expansion
   of k is open (author's weakest step 1). Zeta-type members with any off-line zeros would have this case if the
   off-line set is infinite. The family used is {L(s, eta chi_m)}; the manuscript's rows are theta-coefficient sums,
   not L-functions, and the manuscript was not re-read (author's weakest step 2). The closure established is:
   "positive or PSD-weighted sums of gapped-block traces and of bridge forms over a finite family of class-(H)
   members with finite off-line sets add no constraint beyond the member-wise 7/8 input." The row-series bridge is
   not closed by this note.
3. **Novelty.** Items (i)-(iii) are standard finite-rank Hankel computations (Hilbert-Schmidt norm
   int u |k|^2, Cauchy/Gram matrices, Kronecker rank); Theorem A is Paley-Wiener; Theorem C's first display is
   linearity. They are correct, and should be labelled CLASSICAL applied to this setting, not new statements.
4. **EA row.** "Its index in a window is the number of zeros of zeta in the window" is exact only if all zeta zeros
   in the window have |beta - 1/2| < a on one side; unconditionally the count is #{beta > 1/2 - a} + #{beta > 1/2 + a}.
   As written it reads as using RH for zeta. Cosmetic; nothing depends on it.
5. **Prop. D(b)** is ARGUED and cites no specific family density theorem. The headline "the family bound on the
   summed index is a density statement" rests on this and on the exact case D(c); it is labelled correctly but is
   not a theorem for the sextic family.
6. **Theorem C** is PROVED-rel an unrefereed lane, with non-integer weights read into that proof by the author.
   My numeric check supports it (including shared zeros); it is not a proof.
7. **T4 rank-one coupling:** the measured rate 0.0043 on [60, 80] has not converged; the claim there rests on the
   proof, not on that number. Stated by the author.

None of items 1-7 changes "gain 0": the decay-rate comparison (member bound Re z_j < 3/8, family bound Re z_j < 3/8)
is a direct consequence of the half-disk lemma and positivity of the summed terms.

## Requirement flags (referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | New statements use no arithmetic; Theorem A holds for any sign twist; multiplicativity is only inside the imported theorem |
| R2 | false | The only every-window, height-uniform statement (Prop. D(a)) is the 7/8 input restated member by member |
| R3 | false | Every step of this lane holds on rational toys, DH, heat and EA where formulable; no structural failure point |
| R4 | false | No passage to the line; prime side is identically 0 on u < 0 and the transport is the residue sum |

## Surviving claim

For a finite family of class-(H) members with finitely many simple right-half-plane poles: (i) the gapped
anticausal trace is sum conj(r_j) r_k e^{-(conj z_j + z_k) c}/(conj z_j + z_k)^2, rank |Z_+| for every c, decay rate
2 min Re z_j; (ii) a positive-weight or PSD-weighted family sum has rate 2 min over members and is bounded below by
the diagonal sum when pole sets are disjoint; (iii) the half-disk lemma gives Re z_j < max off-line distance, so the
7/8 input gives Re z_j < 3/8 identically for one member and for the family, and bounds no count; (iv) the sum of
bridge forms is the bridge form of the weighted product and its negative index is the number of distinct off-line
right-half-plane zeros of the union (rel. sq-krein-index Thm A; numerically confirmed incl. shared zeros). Gain 0 for
this object. No statement about zeros of zeta.
