# REFEREE (adversarial, lens: general) for c3-lemmab-referee-dh-poisson/RESULT.md

Date: 2026-11-18. Scope: re-derivation of every PROVED step; rerun of the numeric checks on new cases with code that
does not import the lane's `lib3.py` (own closed form for W validated against Gauss-Legendre quadrature, own
autocorrelation by quadrature, mpmath for `zeta'/zeta` and for the DH function through Hurwitz zeta); DH run on six
new cases; lane tables compared with the lane's JSON files. Referee scripts are in scratch (`/tmp/ref_c3/`), not in
the lane directory. Runs local under `scripts/memcap.sh 8` with `.venv-arb`; the compute server was not used.
Nothing here is a statement about zeros of zeta.

## Verdict

**Holds, with seven corrections (E1-E7).** The claimed verdict (restatement, closed; all four requirement flags
false) stands. Lemma B, the k = 0 residue for |S| = 1, Proposition P, the reduction of lines 2 + 3 + 4 to the truncated
Weil prime sum of `g = Z_p w`, Corollary B1' and the theta-family identity were re-derived and confirmed. No step
assumes RH. No known theorem is presented as new: the result itself classifies Lemma B as the explicit formula.
The corrections concern hypotheses and wording; none changes the verdict or a flag.

## PROVED steps, re-derived

**Lemma B, steps (a)-(g). Confirmed.**
- (b) Measure count for the heights U_n: bad set for (i) has measure at most `2 delta (1 + 2 pi/log q)` per unit
  interval, for (ii) at most `2 c_0 N(n, n+1)/log n`. Correct; no Diophantine input on the horizontal segments.
- (c) Poles of Phi at `z = +-(1/2 + 2 pi i k/log p)` only; `xi'/xi` has poles only at the zeros; L is regular at z = 1/2.
- (d) `V(-conj z) = conj V(z)`, hence `Phi(-conj z) = conj Phi(z)`; `L(-conj z) = -conj L(z)`; left line = `-conj J`. Correct.
- (e) `zeta_p(1/2 - z) = -p^(1/2-z) zeta_p(z - 1/2)`; coefficient `(N_S m/(m' n))^(1/2)` after relabelling; `x >= 2 N_S`;
  inverse Laplace transform gives `C_w(-log x)`. Correct, sign `(-1)^(|S|+1)` included.
- (f), (g) The G-residues on Re z = 1/2 cancel; residue of `Phi zeta'/zeta` at `1/2 + it_k` is
  `-(1/log p) zeta_S(1+it_k) zeta_{S-p}(-it_k) zeta'/zeta(1+it_k) V(1/2+it_k)`. Lines 1, 2, 4 follow with the stated signs.

**k = 0 term, S = {p}. Confirmed.** With `A(eps) = zeta_p(1+eps) V(1/2+eps) = A_0 + A_1 eps`, the residue is
`A_1/L - A_0 (gamma/L + 1/2)`, `A_0 = (p/(p-1)) F(0)`, `A_1 = -(p/(p-1)) [L F(0)/(p-1) + int y h]`; line 4 as stated.

**Step (h).** Baker-Wustholz constant recomputed: `C(2,1) = 18 * 3! * 2^3 * 32^4 * log 4 = 1.2560e9` (formula
`18 (n+1)! n^(n+1) (32 d)^(n+2) log(2nd)`); the quoted number is consistent with that formula. The source was not
opened. The statement that an `exp(-C (log B)^2)` bound is not dominated by "faster than any power" is correct.
See E1 for the hypothesis this step needs.

**Proposition P. Confirmed.** Partial summation with the prime number theorem with remainder gives the limit and the
uniform `O(1 + |t|)` bound for the truncated expression. Poisson: `(1/L) sum_k F(t_k) e^(-i t_k y) = sum_j h(jL - y)`.
Sawtooth: `sum_{k != 0} e^(-2 pi i k u)/(2 pi i k) = {u} - 1/2`. The combination with the k = 0 term gives
`-P_reg + int h floor(x/L) + (p/(p-1)) F(0)`; line 3 for S = {p} is `2 (p/(p-1)) Re sum (p^(J/2) - p^(-J/2)) ...`
(`sum_{a+b=J-1} p^((1+a-b)/2) = (p/(p-1)) (p^(J/2) - p^(-J/2))`), and `C_g = (p/(p-1)) sum_j p^(-|j|/2) C_w(. - jL)`. Correct.

**General S (limit eps -> 0+). Confirmed as a deduction** from Lemma B, Weil's formula for `g_eps` and the uniform
bounds `|zeta_S(rho + eps)| <= prod (1 - q^(-beta))^-1`. It is not an independent identity and was not run.

**Corollary B1'. Confirmed.** Parseval on the lattice is exact for `T_w <= log p`; `kappa_b <= sqrt p`. For a symmetric
real profile `|W(-1/2 + it)| = sqrt p |W(1/2 + i(2T - t))|`, and the referee finds `(1/L) sum |F(t_k)|/||w||^2 = kappa_b`
to 4 digits (1.2010 at p = 971): Cauchy-Schwarz loses nothing here; the whole loss is in replacing the samples by M.

**Theta-family identity. Confirmed** (pole of G at z = 1/2 gives `2 Re Phi_theta(1/2)`; residues at `1/2 - theta + it_k`
including k = 0, now simple). The Liouville identity of section 4 was checked for structure and signs only.

## Reruns (referee code, new cases)

Lemma B with the k = 0 term, |S| = 1, small T (k = 0 term dominant); differences are absolute:

| p | profile | T_w | T | zero side | arch | residues k != 0 | k = 0 term | line 3 | zero - right side |
|---|---|---|---|---|---|---|---|---|---|
| 3 | sin^8 | 1.5 | 0 | 4.8035789e-4 | -0.7840171191 | +0.0214393250 | +0.7630581519 | 0 | 1.9e-11 |
| 7 | sin^4 | 2.2 | 0 | 8.8230025e-9 | -1.6518361747 | +0.1653842474 | +1.4864519362 | 0 | -7.9e-12 |
| 3 | sin^6 | 2.0 | 0 | 1.6638212e-7 | -1.7820096459 | +0.0307433282 | +1.7512664840 | 4.2e-11 (1 term) | -8.5e-12 |
| 2 | sin^6 | 1.0 | 3 | 5.8878710e-3 | -0.7279567113 | -0.0632444719 | +0.7970890542 | 0 | 1.7e-11 |
| 11 | sin^6 | 2.0 | 1.5 | 6.2830045e-9 | -0.8082589699 | +0.1806094131 | +0.6276495631 | 0 | -3.9e-12 |

Rows 4 and 5 have complex `C_w` (T != 0), which the lane's five rows do not test. Confirmed.

Proposition P (left side against right side, sharp cut-off X):

| p | profile | T_w | T | left side | abs diff at 1e5 | 1e6 | 1e7 | diff * sqrt(X) at 1e7 |
|---|---|---|---|---|---|---|---|---|
| 5 | sin^8 | 1.2 | 17 | -0.0622611589 - 0.0001816715 i | 2.3e-4 | 9.9e-5 | 2.9e-5 | 0.092 |
| 2 | sin^6 | 1.0 | 3 | -0.0158111180 - 0.0052135866 i | 2.1e-5 | 9.7e-5 | 2.0e-5 | 0.063 |

Agreement 3 to 4 digits of `(1/L) sum |F(t_k)|` (0.24, 0.10) at X = 1e7, rate consistent with `X^(-1/2)`. Confirmed at the
stated precision; this is a slowly convergent check, as the result says.

DH form (f through Hurwitz zeta in mpmath, zeros from `c2-euler-at-zeros/dh_zeros_1000.json` as data):

| S | profile | T_w | T | zero side | off-line pairs | arch | residues | line 3 | rel. diff | R / Obar |
|---|---|---|---|---|---|---|---|---|---|---|
| {3} | sin^6 | 2.5 | 300 | 5.4713202424 | 5.9e-11 (9) | 4.4596878919 | 1.0116367135 | -4.36e-6 (3) | -1.9e-12 (-8.0e-7 without) | 6.72 / 5.48 |
| {2,7} | sin^6 | 3.0 | 640 | 6.0687144322 | 1.4e-4 (11) | 5.2145890007 | 0.8541254315 | 0 | 4.2e-12 | 7.26 / 6.24 |
| {11} | sin^8 | 2.6 | 700 | 3.1324313652 | 8.7e-3 (17) | 3.5510986941 | -0.4186673289 | 0 | 5.4e-12 | 5.58 / 6.32 |
| {3} | sin^6 | 3.2 | 430 | 9.8554336056 | 2.9e-7 (9) | 6.7069254838 | 3.1491955380 | -6.87e-4 (8) | 3.3e-12 (-7.0e-5 without) | 8.57 / 5.83 |
| {2} | sin^6 | 3.0 | 250 | 3.4681207286 | 1.6e-7 (7) | 3.5696945032 | -0.1049187987 | 3.35e-3 (16) | -2.4e-12 (9.7e-4 without) | 5.15 / 5.30 |
| {5} | sin^6 | 2.0 | 600 | 3.9621679956 | 0.0903 (15), 2.3% | 3.4788052034 | 0.4833627922 | 0 | 4.2e-12 (-2.3e-2 without the pairs) | 7.03 / 6.17 |

The identity holds for DH in all six new cases. R3 fails at the identity: confirmed by an independent run.

Theta-family: (p, theta, T_w, T) = (5, 0.25, 1.4, 2500, sin^8), (11, 0.47, 2.9, 1234.5), (2, 0.35, 1.2, 40): relative
difference -3.5e-11, -1.0e-11, 3.8e-11. Confirmed.

Section 5: referee values `E = -2.5980` (p = 971, T = 5004.1) and `E = -2.343` (p = 977, T = 200) agree with the lane; one
case outside the range (p = 1013, T = 31000.3) gives `E = -0.156`. From `sizes.json`: 8064 cases, `max |E| = 2.598`,
`2 M (1/L) sum|F| / ||w||^2` in [2.750, 5.144], tightest ratio 1.407 at (977, 200), bound below `log(T/2 pi)` for all T >= 700
and for 66.7% of the cases with T <= 400, `abs1` = 0.694 and 7.091. All as stated.

## Errors and corrections

**E1 (hypothesis mismatch between Lemma B and every numerical test).** Lemma B is stated for smooth w. All runs use
`sin^(2m)(pi t/T_w) 1_[0,T_w]`, which is `C^(2m-1)`, not smooth: `|V(c + it)| ~ |t|^-(4m+2)` (power 14 for sin^6). For |S| = 1
the proof needs only finite decay and goes through. For |S| >= 2, step (h) proves absolute convergence only when V
decays faster than `B^-(kappa+1)` with `kappa = C(2,1) log p log q` of order 1e9; this is not satisfied by any tested
profile. For the tested profiles with |S| >= 2 the residue sum is shown to converge only as the limit along `|t_k| < U_n`
(first sentence of (h)); absolute convergence would need an irrationality exponent of `log q/log p` below about 4m+1,
which is known for some pairs and not in general. Likewise `O_b(T^-A)` in Corollary B1' holds with a fixed A (of order
4m+2) for these profiles, not for every A. The statement of Lemma B should either require `w in C_c^infinity` (and then
say the tests are outside the class for |S| >= 2) or state the finite-smoothness version separately for |S| = 1.

**E2 (step (b), inequality as written does not give the bound).** `|1 - r e^(i phi)| >= min(1, |sin phi|)` is true but
is 0 at `phi = pi`, which condition (i) does not exclude. The correct statement: `|1 - r e^(i phi)| >= 1` if `cos phi <= 0`
and `>= |sin phi|` otherwise; under (i) with `delta_S <= 1/4` this gives `>= sin(2 pi delta_S) >= 4 delta_S`. The conclusion
`(4 delta_S)^(-|S|)` is correct.

**E3 (step (a), one factor only).** The bound is written for `1 - q^(-(1-beta) - i gamma)`; the other factor needs
`|1 - q^(-rho)| >= 1 - q^(-beta)` and the zero-free region at the reflected zero. Same argument; a missing line.

**E4 (step (III) citation).** `zeta'/zeta(1+it) = o(log t)` does not follow from the de la Vallee Poussin region, which
gives `O(log t)` with a constant that is not below `1/(2 kappa_b)`. Littlewood's or the Vinogradov-Korobov region is
required (the c2 referee made the same remark). Sections 0, 6 and 8 should say so instead of "the classical zero-free
region". Step (h) uses only `O(log t)` and is unaffected.

**E5 (DH sign remark).** "E > 0 in all 8 [DH windows]; for zeta the mean of E is negative" is not a property of DH: in
the referee's six cases E < 0 in two (S = {11}, T = 700: R = 5.58 against Obar = 6.32; S = {2}, T = 250: 5.15 against 5.30).
The sign of E does not separate DH from zeta in single windows. The sentence should be removed or restricted to the 8
listed windows without the comparison.

**E6 (numbers in section 3).** From `poisson_test.json`: `diff * sqrt(X)` ranges from 1e-4 (row 2, X = 1e6) to 0.408, not
"between 0.002 and 0.41"; the sawtooth identity agrees to 1.7e-13 at worst (2e-15 at best), not 1e-15. Neither affects
the conclusion; the small values at single X are sign changes of an oscillating remainder, so only the upper envelope
is evidence for the rate.

**E7 (Corollary B1', definition of M; reading of the measured range).** "M = max over the lattice points carrying the
weight" is not a definition. The proved statement is `|E| <= (2/||w||^2)(1/L) sum_{k != 0} |zeta'/zeta(1+it_k)| |F(t_k)| + (k = 0 term)`;
a bound `2 kappa_b M` needs M as the supremum over all lattice points `k != 0`, or a split with an explicit tail (with
`O(log)` samples against the polynomial decay of F, see E1). The M of `sizes.py` (grid over `|t - T| <= 12` and lattice points
with weight above 1e-3 of the maximum) is a third quantity. Also: in the whole measured range (T <= 2e4) `R_S > 0` is
already known from the verified height (all zeros there are on the line and the zero side is a sum of squares), so
"with a certified M this would give R_S > 0 without any zero input" adds nothing in that range; it would only be new
above the verified height, where it is a statement about one profile and one (p, T) at a time.

Smaller points, no correction to the mathematics: the Liouville identity is labelled "PROVED form" but is stated "up
to terms at z = 0 and k = 0" that are not written; it is a measured identity with neglected terms of stated size. The
use of the half-plane `Re s > 7/8` in section 7 depends on a result that is Lean-checked locally and not refereed in
the literature; the sentence is a conditional consequence. The bound `zeta'/zeta(1 - theta + it) = o(log t)` under a
zero-free half-plane is cited (Titchmarsh 14.5 is the RH case) and not derived in the lane or by the referee.
Backward heat, E_a and the generic unimodular twist were not run by the lane and not by the referee: no zeta-only
mechanism is claimed for them, and the entries are arguments by hand, as the result states.

## Checks requested by the assignment

- Assumes RH: no. The theta-family zero side uses on-line zeros below height 18046 (verified range) as data.
- Restates verified height: the identities do not. The positivity remark of section 5 does within T <= 2e4 (E7).
- Known theorem presented as new: no. The result identifies Lemma B with Weil's explicit formula for `Z_S w`.
- Zeta-only mechanism: none claimed. DH satisfies the identity (lane: 8 cases; referee: 6 new cases, independent code).

## Requirement flags (set by the referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | No new inequality. Multiplicativity enters in the local functional equation of the test factor (identity) and in the cited zero-free region. |
| R2 | false | `abs E <= 2.60` is measured on p <= 1000, T <= 2e4; the proved bound contains M(T) and a threshold depending on p and the profile. |
| R3 | false | The identity holds for DH (14 cases in two independent codes) and for the height-shift twist; the single inequality step is true for the twist. |
| R4 | false | Samples on Re s = 1; the theta-family's prime-side form converges only in a zero-free half-plane. |

## Summary for the map

Lemma B (|S| = 1, finite-smoothness profiles included; |S| >= 2 for `C_c^infinity` tests, absolute convergence by a
power-type Baker bound) is the explicit formula for `Z_S w` with pole term and prime sum truncated together
(Proposition P, re-derived; measured to 3-6 digits). It holds for DH. Route closed as a restatement.
