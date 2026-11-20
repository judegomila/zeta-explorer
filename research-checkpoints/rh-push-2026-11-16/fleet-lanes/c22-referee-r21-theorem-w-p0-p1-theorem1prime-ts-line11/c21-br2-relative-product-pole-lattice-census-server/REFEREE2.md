# REFEREE2: Lemmas P0 and P1 of `c21-br2-relative-product-pole-lattice-census-server/RESULT.md`

Second reading, 2026-11-20, lane `c22-referee-r21-theorem-w-p0-p1-theorem1prime-ts-line11`. Written from the
RESULT.md text alone; the lane's REFEREE.md and scripts were not opened. No statement about zeros of zeta.

## Verdict

- **Lemma P0: holds with one correction of scope (wording in sections 1, 4 and 6; the lemma as stated in
  section 2 is correct).**
- **Lemma P1: holds.**

## Lemma P0, line by line

1. R_S(1/2 + delta) = prod (1 - q^-delta)/(1 - q^(-1/2-delta)) for delta > 0: the product converges because
   sum q^-delta is finite (hypothesis). Each numerator is in (0, 1). Holds.
2. prod 1/(1 - q^(-1/2-delta)) <= prod 1/(1 - q^(-1/2)) = C, finite since sum q^(-1/2) is finite. Holds.
3. R_S(1/2 + delta) <= C prod_{i<=M} (1 - q_i^-delta) <= C prod (delta log q_i), by 1 - e^-x <= x. Holds.
4. A function meromorphic at 1/2, not identically zero, has abs f(1/2 + delta) >= c delta^n for one integer n
   (the order at 1/2, of either sign) and small delta. Take M > n. R_S is non-zero on Re s > 1/2, so not
   identically zero. Holds.
5. G = zeta/R_S meromorphic at 1/2 would make R_S = zeta/G meromorphic there. Holds (zeta(1/2) != 0 is not
   needed for this step).

**Correction (exact lines).** Section 1: "(i) proves that for alpha_p = +p^(1/2) no infinite S gives a twin".
Section 4, Threshold: "this is forced for every infinite S by Lemma P0". Section 6: "no twin G = zeta/R_S
exists with alpha_p = +p^(1/2) on an infinite S (Lemma P0)". Each sentence needs the hypothesis of the lemma:
sum over S of q^-delta finite for every delta > 0. Without it the proof has no object (the product for
R_S(1/2 + delta) diverges to 0) and the sentence is false as a statement about meromorphy at 1/2: for S = all
primes, R_S = zeta(s)/zeta(s - 1/2) and G = zeta(s - 1/2) is meromorphic on C. That G is not a twin for another
reason (its functional equation is centred at 1); the lemma does not show it. Regime (K) satisfies the
hypothesis, so nothing downstream changes.

The remark marked ARGUED (real alpha_p = p^(1/2)(1 - eta_p)) was not checked.

## Lemma P1, line by line

1. At t_0 = 2 pi k/log p the factor of p in 1/R_S has denominator 1 - p^-delta <= delta log p. Holds, uniformly
   in k.
2. Other denominators: abs(1 - q^(-delta - i t_0)) <= 1 + q^-delta, and
   sum log(1 + q^-delta) <= log 2 #{q: log q <= 1/delta} + sum_{log q > 1/delta} q^-delta. With ratio >= lambda > 2
   from some index on, the count is at most log(1/delta)/log lambda + C and the tail sum is bounded
   (terms e^(-lambda^i), i >= 0). Holds.
3. Numerators: prod abs(1 - q^-s) >= prod (1 - q^(-1/2)) > 0, including the numerator of p. Holds.
4. So y(delta, t_0) >= (1 - log 2/log lambda) log(1/delta) - C(p), C(p) independent of k. Holds.
5. Natural boundary: in a disc centred on the line a meromorphic continuation has finitely many poles in a
   smaller closed disc; at a pole the radial limit of abs R_S is infinite, not 0, so no pole point is a pole;
   the continuation vanishes at every pole point of the smaller disc; these are dense on the line (spacing
   2 pi/log p -> 0 along S), so R_S is identically 0, contradicting R_S != 0 on Re s > 1/2. Holds.

P1 agrees with Lemma P and Corollary P1 of the sibling lane (same inequality; the sibling adds the form with
the counting-function hypothesis and the sharpness example at ratio 2).

## Numerical recheck (Arb, python-flint 0.9.0, server through rhrun; new code `code/ref2_misc.py`, `code/ref2_s1.py`)

Units `rh-c22refm-1120145537`, `rh-c22refs-1120145623` (1 core each; both exited). Output `out/misc.json`,
`out/s1.json`.

- S1 at t = 0, primes = nearest prime to exp(e^(k/2)), exact search for k <= 13, k from 0 (first primes 3, 5,
  17, 89, 1619, 195341): y = 8.79702, 51.0295, 128.0560, 239.6787, 385.8940, 566.7020, 782.1026 at
  j = 4, 10, ..., 40. The lane reports 8.797, 51.03, 128.06, 239.68, 385.89, 566.70, 782.10. All seven agree.
  (The set starts at k = 0; with k from 1 the values are 6.859, ..., 755.33. The RESULT.md does not state the
  first index.)
- P0 inequality with M = 5: log R_S(1/2 + delta) <= log C + sum_{i<=5} log(delta log q_i) holds at every j
  (for example j = 40: -755.4 against the bound -130.2, set from k = 1).
- Lemma P1 / Lemma P on S0 (log q_k = e^k; first primes 13 or 17, 1619, 528491303; exact for k <= 7), pole
  points (prime index, n) = (1,1), (2,1), (2,5), (3,2), (5,3), delta = 2^-j, j = 4, 8, ..., 40: the inequality
  y >= log c_S - L_j(delta) - log(1 - p^-delta) holds in all 50 cells as a ball comparison; y - 0.307 log(1/delta)
  is bounded below (minimum over j: 1.25, -0.34, -0.33, -1.00, 0.007); finite-range slopes 0.70 to 1.57.

## Dependence

Nothing later depends on the sentence corrected above in its unqualified form. The c22 lanes on the dense
remainder of regime (K) use the hypothesis of the lemma.
