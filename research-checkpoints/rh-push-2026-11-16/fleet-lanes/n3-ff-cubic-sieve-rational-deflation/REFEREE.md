# REFEREE: n3-ff-cubic-sieve-rational-deflation

Adversarial referee (general), 2026-11-17. No ssh. All runs local through `scripts/memcap.sh 8`, single process,
longest about 1 minute. Referee scripts were kept outside the lane directory (`/tmp/ref_n3ff/chk.py`, `kub.py`); they
import nothing from the lane.

**Outcome: the verdict "precise obstruction" holds. Lemma A and Lemma B are confirmed (re-derived and reproduced with
independent code at a different q). Four statements are worded more strongly than what is proved; none changes the verdict.
No abscissa moves. Nothing about zeros. RH open.**

## 1. Re-derivation of the PROVED steps

**Lemma A. Confirmed.** Steps checked one by one:
- chi = chi_c conj(chi_c') is primitive mod cc' (c, c' squarefree, coprime: each factor is primitive on its own modulus)
  and chi(a) = chi0(a)^m conj(chi0(a))^m = 1 on F_q^*. So L(u, chi) has degree 2m - 1 and the factor (1 - u). Correct.
- tau(chi) = q b_{2m-2}: splitting x = a d (d monic of degree j), degrees j <= 2m - 2 contribute (q - 1) chi(d), degree
  2m - 1 contributes -a_{2m-1} = +b_{2m-2} (L(1, chi) = 0). Correct.
- Functional equation b_j = eps q^(j-m+1) conj b_{2m-2-j}; at j = 2m - 2 it gives eps = tau q^(-m). Correct; consistent
  with |tau| = q^m. This is the elementary functional equation; the Weil bound (RH for curves) is not used.
- tau(chi) = g(1, c) conj g(1, c'): the CRT factor is chi_c(c') conj chi_c'(c) = 1 by cubic reciprocity; the sign in
  the reciprocity law is (-1)^(((q-1)/3) deg c deg c') = 1 for q = 1 mod 6. tau(conj chi_c') = conj g(1, c') uses
  chi(-1) = 1. Correct.
- a_n = b_n - b_{n-1} = q^(n-m) [ (q-1) eps conj b_{2m-2-n} - eps conj a_{2m-1-n} ], and eps conj chi(r) =
  g~(r, c) conj g~(r, c') (primitive characters: g(r, c) = conj chi_c(r) g(1, c) for all r, zero when gcd > 1).
  End cases n = 0 and n = 2m - 1 checked by hand (both give identities). Correct.

**Lemma B. Confirmed.** Diagonal: left q^n - q^(n-m) for n >= m; bracket (q-1)(q^(k0+1) - 1)/(q-1) - q^(k0+1) = -1,
all r in range being coprime to pi. Correct. Remark: the identity also holds outside the stated range at (4,3)
(k0 = 3 > m - 2): there r = pi occurs at degree m with g~(pi, pi) = 0 and the diagonal is q^n on both sides
(numerically verified below).

## 2. Independent numerical check (different case)

`chk.py`: own code; chi_pi(x) from the power-residue definition x^((q^m-1)/3) mod pi (the lane uses resultants);
Gauss sums summed from the definition for every r (the lane uses g(1, c) conj chi_c(r)); complex128; **q = 13**
(lane: q = 7 only). Full matrix identity G = q^n I + q^(n-m)[(q-1) W_lo W_lo^* - W_hi W_hi^*], all entries including the diagonal:

    q   (m,n)  k0   primes   max |G - F|   lam_max/q^n undeflated -> family deg r <= k0 removed [rank]
    13  (2,2)  0    78       2.9e-14       6.538462 -> 1.000000 [1]
    13  (2,3)  -1   78       1.9e-13       1.000000 (nothing to remove)
    13  (3,3)  1    728      4.3e-13       4.971502 -> 4.948326 (k = 0) -> 1.000000 [14]
    13  (3,4)  0    728      4.0e-12       4.976211 -> 1.000000 [1]
    7   (3,5)  -1   112      1.5e-12       1.000000
    7   (4,3)  3    588      2.9e-12       12.393140 -> 12.123 -> 12.123 -> 3.5759 -> 0 [330]; rank G = 314

Random complex alpha: both sides of Lemma B agree to relative 1e-16 to 7e-16 in all six cases. The lane's (4,3) numbers
(12.3931, 12.1234, 3.5759, rank 330) are reproduced exactly. The lane's stated agreement (1.9e-6 to 2.9e-5 absolute)
is its complex64 precision; in complex128 the identity holds to rounding.

`kub.py`: q = 13, chi_c(x) = chi0(det x(M_c)) (companion matrix), all monic c of degree <= 3:
S_1(1) = q G_1, S_2(1) = 0, S_3(r) = 26364 = q^4 - q^3 for r = 1, T, T + 1, T + 5 (not q^4 = 28561). So the form
(1 - q^4 u^3) psi = (1 - q^3 u^3) P_r, deg P_r <= deg r + 1, is confirmed at a second q at the first place where the two
forms differ, and the form without (1 - q^3 u^3) is false at q = 13 as well.

## 3. Errors and overstatements found

1. **"Flat if and only if" is half proved.** Lemma B proves "if" (prime moduli). "Only if" (not flat for k < k0) is
   MEASURED: prime rows at (3,3), (4,4), (4,3) partials and my q = 13 (3,3) (4.948 at k = 0); the dual table uses
   squarefree rows and only the positive part of the excess. It should carry the label MEASURED (k0 <= 4), not sit
   under the PROVED header. For squarefree rows the flat level at k = k0 is verified only up to (4,4) and only after
   adding the divisor families, whose coefficients were not derived ((5,5) at k = k0 is 5.04 phi, not flat).
2. **"Constant exactly 1."** The proof gives <= 1. Equality needs a vector orthogonal to the families of degree <= k0
   and of degree k0 + 1 together, i.e. #primes > (q^(k0+2) - 1)/(q - 1). True in every case run; for k0 = m - 2 and
   m >= q - 1 the count q^m/m falls below q^m/(q-1) and the constant can be < 1. Harmless for the obstruction.
3. **Rank count.** (q^(k0+1) - 1)/(q - 1) is about K^2/(q (q-1) D), not K^2/(qD) (factor q - 1 = 6 at q = 7); the
   number of distinct vectors is smaller again (cube classes: 330 at (4,3) against 400). Exponent unaffected.
4. **The (4,3) row is uninformative.** n < m: G has rank 314 <= q^n and its range lies inside the span of the family,
   so "-> 0" says nothing about flatness. It is also outside Lemma B's stated range. Keep it only as a check of the identity.
5. **conductor^(-1/3) law rests on one stair step.** k0 <= 4 gives multiplicity 1 -> 8 only, and the shifted law is
   off by 10% at its one non-trivial test (m = 7, k0 = 4, k = 0: 30.02 against 33.18; reason: r0 e^3 with e = r0
   duplicates r0, 7 distinct members instead of 8). The table E(m, k0; k) is for squarefree rows and drops the negative
   term, whereas the proved identity is for prime rows; for squarefree rows W W^* is not the full excess. The label
   MEASURED/ARGUED is the right one; "exact here" in section 4 is too strong. The exponent agrees with the known
   sharpness of Heath-Brown's bound (Dunn-Radziwill), so I do not dispute it.
6. **Transfer.** "Deflated sieve over Q is equivalent to its own hypothesis in dual form" and "31/36 needs the Type II
   Gauss-sum bound" are MODEL statements imported from n1/n2 (the lane says so). Not checked here.

## 4. Controls, RH, verified height, novelty

- No zeta-specific mechanism is claimed. Lemma B holds for every coefficient vector (verified on random alpha, which
  covers any modulus-side sign twist; an argument-side unimodular twist leaves C C^* unchanged, correct). The
  Davenport-Heilbronn and backward-heat controls have no object to act on in an operator-norm identity over F_q[T];
  the statement is Euler-blind by construction and the lane says so. Nothing to fail.
- RH: not assumed. Only the polynomial functional equation and |tau| = q^m are used. No verified-height input.
- Novelty: none claimed and none present. Lemma A is the functional equation in coefficient form (function-field
  Poisson summation, as used for cubic characters by David-Florea-Lalin, arXiv:1901.00817); Lemma B is the exact
  form of Heath-Brown's duality step. The corrected Kubota statement is the classical one: Hoffstein's series carries
  the factor (1 - q^n u^n)^(-1) in its definition (recalled from memory by me as well; the web search did not return
  the formula text). "PROVED here" should read "derived here from classical inputs".

## 5. Surviving claim

Over F_q[T], q = 1 mod 6 (checked q = 7, 13): for prime moduli of degree m and all monic arguments of degree n,
sum_d |sum alpha_pi chi_pi(d)|^2 = q^n |alpha|^2 + q^(n-m)[(q-1) sum_{deg r <= k0} |<alpha, g~(r,.)>|^2
- sum_{deg r = k0+1} |<alpha, g~(r,.)>|^2], k0 = 2m - 2 - n (PROVED, classical inputs). Hence the sieve is bounded by
q^n |alpha|^2 once the Gauss family of degree <= k0 is removed (PROVED); it is not flat for smaller k in every case run
(MEASURED, k0 <= 4); FF-WLS indexed by n > k + 1 is false; bounded-conductor deflation gains at most a shift of the
undeflated staircase (MEASURED on one step, ARGUED beyond). Kill criterion met. No abscissa moves; 7/8 (unrefereed)
stands; RH open.

Adjusted strength: 0.8 (proved core confirmed; "iff", "exactly 1" and the -1/3 law beyond one step downgraded).
