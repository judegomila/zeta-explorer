# REFEREE (lens: general) for c19-d10-xd-determinant-pole-term-lemma-q/RESULT.md

Date 2026-11-19/20. Verdict of the referee: **the claimed partial result holds.** Every step labelled PROVED was
re-derived by hand and confirmed; each was also checked exactly with code written for this report (own Bezoutian in
closed form, own point sets, inertia by a separate rational LDL and by characteristic polynomial plus Descartes; none
of the lane's `xd.py` routines). No counterexample to X(d) was found in new cases. The result makes no statement about
zeros of zeta, assumes nothing about RH, and restates no verified height. Five wording errors are listed in section 4;
none affects a PROVED step or the verdict. Requirement flags as set by the referee: R1 false, R2 false, R3 false,
R4 false.

Referee code and logs: `/tmp/ref-c19d10/` (`ref.py`, `run2.py` to `run5.py`), run locally through `scripts/memcap.sh 8`
with the python-flint environment `/private/tmp/c19venv`. Nothing was run on the compute server.

## 1. Re-derivation of the PROVED steps

**Lemma 1 (X = 0; 2N = A[LL b(-x_12) b(-y_12)] = A[LL b(x_12) b(y_12)]).** Confirmed.
- Expansion of L(x_1,y_1) L(x_2,y_2) into four sign patterns with coefficient e_1 e_2 and common factor a(x + y): correct.
- Pattern identification, recomputed: psi(c_1 x) = b(x_2) b(-x_12) b(-x_1); psi(c_2 x) = b(-x_12) b(x_1) b(-x_2);
  psi(w_0 x) = b(-x_2) b(-x_1) b(-x_12); psi(s_1 x) = b(-x_1) b(x_12) b(x_2); psi(s_2 x) = b(x_12) b(-x_2) b(x_1). Correct.
- Change of summation variable: S[(phi o v)(phi o v) a] = chi chi'(v) S[phi phi (a o v^-1)]. Correct (W acts linearly).
- a o w_0 = a; a o c_1 = -1/(nu_2 nu_12); a o c_2 = -1/(nu_1 nu_12); a o s_1 = -1/(nu_1 nu_12); a o s_2 = -1/(nu_2 nu_12);
  a + a o c_1 + a o c_2 = 0 and a o s_1 + a o s_2 = -a. Correct.
- Rotation invariance of b(x_1) b(x_2) b(-x_12) and of b(-x_1) b(-x_2) b(x_12): correct, so both fourth patterns sum to 0.
- Totals (1 + chi chi'(w_0)) and (1 + chi chi'(s_1)): correct; 2 for (sgn, sgn) and (1, 1), 0 for mixed pairs.
- Exact check against the 36-term definition (not against another Bezoutian form): 12 random monic b of degree 1 to 5 with
  rational coefficients, rational lam, mu: 2N and 2N^+ in both shifts and the two mixed sums: 72 of 72 identities.

**Theorem 2 (Q = L (x) L, J^- orthogonal to J^+, inertia (d^2+1, 2d), neg(N) + neg(N^+) + z <= 2d).** Confirmed.
- L_b = (x-1)(y-1) L_g - 2 g(-x) g(-y): recomputed, correct. L_g positive definite of rank d for Re a_j > 0 (Hermite,
  classical; sign checked on g = u + a: L_g = 2a). Rank n needs b(x), b(-x) coprime, i.e. a_j != 1: stated.
- The quotient lemma (J + J^perp = R^perp, inertia (p - z, q - z) on R^perp/R, orthogonal sum): correct, classical.
- Exact: L has inertia (d, 1) at four new symmetric sets (d = 6, 6, 8, 10).

**Crossing identity and Theorem 3.** Confirmed.
- L(x, r) = -b(-x) b(-r)/(x + r) at a root r; only w = w_0 survives in psi(w p_ij) (the other five orbit points have a
  coordinate or coordinate sum equal to r_i or r_j); j^+_p + j^-_p = 2 b(-r_i - r_j) ev_p. All recomputed.
- Jt_0 has dimension 2d + 1 and signs (+, -^d, -^d); neg(G' + G'') <= neg(G') + neg(G''); hence z = 0 and
  neg(N) = neg(G'). Correct. The Hermitian version for complex zeros is the complexification of a real form: no gap.
- New exact check at the complex crossing points themselves (the case RESULT section 7 item 2 lists as unchecked),
  Gaussian rationals, Hermitian matrix [N(p_a, conj p_b)] of order 2d + 1, compared with the full exact inertia:

| zeros (non-symmetric, no partner pair) | full inertia of N | Hermitian matrix on 2d+1 crossing points | crossing identity at a rational mu |
|---|---|---|---|
| 1/5 +- 2i, 7/10 +- i | (8, 2) | (5, 2) | holds at 9 of 9 points |
| 1/5 +- 2i, 1/3, 9/10 | (7, 3) | (4, 3) | holds at 9 of 9 |
| 2/5 +- 3i, 1/7 +- i/2, 9/10 +- i | (17, 4) | (7, 4) | holds at 13 of 13 |

**Section 3.4 (failing step).** Confirmed: b(a_j - 1) = (a_j - 2) g(a_j - 1) and g(a_j - 1) = g(-a_j) = 0 by
g(-1 - u) = g(u). Exact: N(p_0k, .) = N(p_k0, .) = 0 at two rational mu for all 10 zeros of a new d = 10 set.

**Lemma 4 (z >= d) and Theorem 4 (NL(d) implies X(d)).** Confirmed.
- The three surviving terms of j^-_{p_0k} and their weights: recomputed, correct.
- f_k has degree d < n in x_1; vanishing pattern and the non-zero value (a_k + 1)(a_k - 2) prod (a_k - a_j): correct;
  b(1 - a_k) = -a_k g(1 - a_k) != 0 for Re a > 0. A simple symmetric set of even degree has no zero at 1/2: correct
  (the multiplicity of 1/2 has the parity of d).
- Exact: the d x d matrix j_j(f_k) is diagonal with non-zero diagonal at the new d = 10 set.
- Closure to confluent sets: positive semidefiniteness is closed and simple symmetric sets are dense (a zero of even
  multiplicity at 1/2 splits into real pairs; other repeated factors split within their type). True; RESULT lists it
  as unwritten.

**Lemma 5 (N + N^+ = 2 Q(E, E); at most one positive square on the pole line).** Confirmed: the symmetric and
antisymmetric parts of Q(j^+_lam, j^-_mu) = 0 give Q(E,E) = Q(O,O) and symmetry of Q(E,O); E_(1,z) has two terms
(the c_1 term carries b(1) = 0), both in ev_1 (x) V* + V* (x) ev_1, whose positive index is 1.

## 2. Numerical check rerun with different cases

Symmetric sets not in the lane's plan, full Gram matrix on m + 6 random integer chamber points (rank of the evaluation
matrix checked), exact:

| configuration | d | Gram order | rank | inertia (LDL) | inertia (char. polynomial) |
|---|---|---|---|---|---|
| quartet eta = 1/2 - 2^-16, g = 100; pair 1/2 +- i/1000 | 6 | 43 | 15 | (15, 0) | (15, 0) |
| zero 1/2 of multiplicity 6 | 6 | 43 | 15 | (15, 0) | (15, 0) |
| quartet (1/3, 57) doubled | 8 | 67 | 28 | (28, 0) | not run |
| quartets (3/7, 61/3), (1/9, 2/11), real pair eta = 511/1024 | 10 | 97 | 45 | (45, 0) | not run |

Pole line at the same four sets, half-integer points z = 3/2, 5/2, ... (the lane used integers): N^+ has inertia
(1, d), N has (d - 1, 0), Gram(E) has (1, d), and Gram(j^+) + Gram(j^-) = 4 Gram(E) holds, in 4 of 4. NL holds at these
four sets, two of them confluent.

Recount of `results_server.jsonl`: 340 records, 220 symmetric (all symmetric, all in the open strip, 166 with simple
zeros, maximum height 278/7), 220 with no negative square and rank d(d-1)/2; 60 non-symmetric with negative index
equal to the predicted deficit in 60 (50 with negative squares); 60 pole-free positive. Matches RESULT.

## 3. Controls run by the referee

No zeta-only mechanism is claimed, so the controls test the stated laws, not a separation.

| control | prediction | referee result |
|---|---|---|
| 1/5 +- 2i unpaired, plus quartet (1/4, 1); pole | neg 2, rank 17 | (15, 2), rank 17 |
| 1/4 twice, 3/4, 9/10; pole (multiplicity deficit 1) | neg 1 | (7, 1) |
| 1/4 three times, 3/4; pole (deficit 2) | neg 2 | (6, 2) |
| 1/4 twice, 1/3, 2/3; pole | neg 2 | (6, 2) |
| (1/4 +- i) twice, 3/4 +- i; pole | neg 2 | (15, 2) |
| 1/4 twice, 3/4, 1/5 +- 2i, 9/10; pole | neg 3 | (16, 3) |
| right-only pair 4/5 +- 3i; pole | neg 0 | (3, 0) |
| symmetric quartet outside the strip, eta = 3/4; pole | (4, 2) | (4, 2) |
| 1/5 +- 2i, 9/10 +- 3i, 1/3; base -1 | positive | (10, 0) |
| same; base +1 | positive | (15, 0) |

Odd degree (outside the scope of X(d), consistent with c18 referee E-1): {1/4, 4/5, 9/10} gives (2, 4); {1/4, 1/4, 3/4}
gives (2, 2); 1/2 with multiplicity 3 gives (1, 2). The deficit count is an even-degree law and RESULT uses it only
there (all 60 lane controls have even d; recounted).

Symmetric off-line sets pass (section 2 above), so the device does not separate zeta from symmetric controls. This is
what RESULT states.

## 4. Errors found (wording; none changes a PROVED step)

- **W-1 (section 3.5).** "only three of the six terms of j^+ and of the 36-term sum survive": true for psi(w lam)
  (w = s_1, c_1, w_0), false for j^+, whose weights are b(-(w lam)_12): five terms survive on the pole line (only c_1
  vanishes). The displayed three-term formula for N^+ is derived from the 36-term sum and is correct.
- **W-2 (section 3.4).** "A neighbouring non-symmetric set always has negative squares (every left zero is unpaired)"
  rests on the deficit-count law, which this file establishes only at 60 exact configurations (plus the referee's
  10). Theorem 3 gives concentration on 2d + 1 points, not the count. Status of that sentence: MEASURED, not PROVED.
- **W-3 (section 5, first row).** "the mechanism (Theorem 3) PROVED in general position" has the same overreach: what
  is proved is the reduction of neg(N) to a finite explicit matrix, not that the matrix has as many negative squares
  as unpaired left zeros.
- **W-4 (verdict item 6, section 3.5).** "second, independent certificate": the dual certificate depends on Theorems 2
  and 4, proved by hand in this file; before this report they had no referee. It also shares the Bezoutian and the
  elimination routine with the direct run (RESULT section 7 item 3 says so). With the re-derivation above the
  certificate stands for the 166 simple configurations.
- **W-5 (section 3.2).** "Without the pole (b = g) Q is positive definite": for base +1 (b = u g) Q is positive
  semidefinite, not definite (L_b = x y L_g has rank d on a space of dimension d + 1). The conclusion N, N^+ >= 0 is
  unaffected.

Not errors: dim J^- = n(n-1)/2 and J^+ = (J^-)^perp are labelled MEASURED and are not used in any proof (only the
inequality of Theorem 2 is used). The d = 16 runs exist from one machine and one code path, as RESULT states; the
referee did not rerun d = 16.

## 5. Integrity checks

- No step assumes RH or any property of zeta's zeros. The objects are finite zero sets in a rational model.
- No restatement of verified height: a symmetric off-line set passes every test.
- Known results are labelled as such (Hermite's theorem on the Bezoutian, the quotient lemma for indefinite forms).
  Lemma 1, the crossing identity, Theorems 2 to 4 and Lemma 5 are statements about this model kernel; the referee did
  not find them in the inputs c17/c18 (c18 Theorem H carries the term X that Lemma 1 removes).
- X(d) for general d, NL(d) for general d, and row D10 remain OPEN, as RESULT states.

## 6. Requirement flags (set by the referee)

- R1 false: no primes enter.
- R2 false: no conclusion about zeros at any height.
- R3 false: symmetric controls, off-line quartets included, pass.
- R4 false: finite zero sets in a rational model; no passage to the critical line.

## 7. Surviving claim

Partial result. In the rational model with the pole, for every real b: 2N = A[L L b(+-x_12) b(+-y_12)] (c18's term X is
zero); N and N^+ are one half of Q = L (x) L on Q-orthogonal subspaces; Q has inertia (d^2 + 1, 2d), so
neg(N) + neg(N^+) + z <= 2d; for simple zeros with no partner pair neg(N) is the negative index of an explicit
(2d+1) x (2d+1) matrix on the pole lines; at symmetric sets 2d of those points are null and z >= d, so X(d) follows
from NL(d); on the pole line N + N^+ has at most one positive square. X(d) and NL(d) hold exactly at the lane's 220
symmetric configurations (d = 6 to 16) and at 4 further ones run by the referee; both are open for general d. No
statement about zeros of zeta.
