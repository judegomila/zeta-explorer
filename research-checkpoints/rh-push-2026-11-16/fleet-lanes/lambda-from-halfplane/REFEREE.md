# REFEREE: lambda-from-halfplane/RESULT.md

Date 2026-11-16. Adversarial check of every step labelled PROVED. Verdict: **holds = false** as written, because one
PROVED step (P4, the 13.34 ceiling) is not proved in the generality stated. Everything else labelled PROVED was
confirmed. The conditional number 0.116060107834762 survives.

## 1. Confirmed

**Lemma R and the value (section 2). CONFIRMED by independent re-implementation** (own script, not `replay.py`;
exact rationals). For all 59439 rows of `tmp/qrh-tune-out/F2_final.steps.jsonl.gz` I recomputed the rate from the mode
record, c = (2 lambda/h)(ell - cap/h), and checked against the dumped rate: equal on every row. Also checked on every
row: v <= rho^2, r h < 2, c > 0, cap >= max of s_r on 41 sample points of [0, v] (minimum slack 0, attained where
cap = s_r(0) and s_r is decreasing), no window field (`qlo` null on all 11304 catalogue rows), single-row choice with
weight 1 on all 48135 M rows. So the fixed-mode hypotheses of Lemma R are met by the dump, and the monotonicity
argument (one-step map increasing in q, ceiling monotone, caps are suprema over [0, v], floors and kernels do not read
q) is correct.

| theta | my U | terminal k | q'_k <= q_k | S1 margin |
|---|---|---|---|---|
| 7/8 | 116091488672439/10^15 (q_k equal to the dump at every k) | 59438 | yes | 1.8082e-8 |
| 874886647/10^9 | 58030053917381/(5*10^14) = 0.116060107834762 | 59422 | yes | 1.8120e-8 |
| 87/100 (new test case) | 0.114698258115092 | 58725 | yes | 1.9722e-8 |
| 4/5 (new test case) | 0.093179839792357 | 47708 | yes | 4.0373e-8 |

The 4/5 replay is above the paper's re-tuned 0.093069284680992, as a fixed-mode replay must be. Gain over 7/8:
3.138e-5, confirmed. The value is conditional on the half-plane at 0.874886647 (preprints not read by the author or by
me), (H2)-(H4), and the non-catalogue kernel certificates named in the M rows (not re-verified here).

Note: one cell of the dump uses two different heights h. Theorem 4.2 is written with h_k = h_{i(k)}. This is a
property of the archived F2 run, not of the replay; the lemma needs only a valid floor entry for the cell at each
height. It should be stated.

**Raymond's chain value 0.118473587983093.** Present in `raymond_theta.json` with the 7/8 control reproducing the
paper. Not rerun by me. Difference to the control 3.212e-5 over d theta = 1.1335e-4 gives slope 0.283, consistent
with the paper's 0.289 secant. Status: plausible, not independently reproduced.

**P3 (far-field cap). CONFIRMED.** d^2 K_y(d,b) -> 2y and d^2 K_h(d-x,b) -> 2h give sum w_i h_i <= 2y; with
w = lambda y/h split on two points this is lambda <= 2. The catalogue has rows with lambda = 2 exactly, so the cap is
attained. The corollary c <= 4 max (l_i - own_i)/h_i holds for per-probe floors only (joint floors over different
heights are not covered; the text says so in P4 but not in P3).

**P5.** The chain of inequalities is correct for signed symmetric w under pointwise domination, up to the O(1/x)
terms of Re xi'/xi, which are dropped without an explicit bound.

**Affine sensitivity.** The inequality T - T' >= Delta A/(2 + c_max(Delta + q_e)) is correct (I re-derived it; the
sharper denominator 2 + c_max(Delta A + q_e) also holds). Two defects, both small: (a) the formula in verdict item 3
drops q_e and is stated for the continuous barrier, not the enclosed U; label it PROVED for the barrier time only.
(b) The quoted check "3.135e-5 from the formula" is not what the stated formula gives: A Delta/(2 + 19.3 Delta) =
3.127e-5; 3.135e-5 comes from the sharper denominator. dU/dtheta = 3A/2 = 0.2768 confirmed.

**Constants.** L = 6.72294, sup 4 l(h)/h = 13.3409 at h = 1.5443, trivial floor 5.8384 at h = 1.88, F2 start rate
11.0076: all reproduced (mpmath).

## 2. Error: P4 is not proved as stated

P4 claims: "any floor valid for all x >= X has l(h) <= L + (1/2) zeta'/zeta((1+h)/2) + o(1)", hence c_0 <= 13.34 for
single-probe positive chains.

The proof uses inf over gamma >= G of Re zeta'/zeta(sigma + i gamma) = zeta'/zeta(sigma). That is true, but a valid
floor only has to lie below inf over x >= X of [ (1/4) log(x/4pi) + (1/2) Re zeta'/zeta(sigma + ix/2) ]. The
near-minimisers of the second term are almost periods, and nothing places one at x with log(x/X) = o(1). Aligning the
primes up to P to within a fixed tolerance needs a range of ordinates of size about exp(c pi(P)), so with log x near
29 only the first 10-20 primes can be aligned, and at sigma = 1.27 the primes above 30 carry 1.4 of the total 3.05 of
-zeta'/zeta(sigma). At ordinates where full alignment is nearly reached, the term (1/4) log(x/4pi) is far larger than
L. So the argument does not bound the true infimum by L + (1/2) zeta'/zeta(sigma), and the true ceiling for
single-probe floors is larger than 13.34 by an amount that is not computed.

Numerical illustration (float, n <= 1500 terms, gamma in [X/2, X/2 + 10^4] step 0.05; not a proof, small window):

| sigma (h) | zeta'/zeta(sigma) | min of the sampled sum |
|---|---|---|
| 1.27 (1.54) | -3.05 | -1.58 |
| 1.44 (1.88) | -1.76 | -1.17 |
| 1.94 (2.88) | -0.627 | -0.557 |

What is true: 13.34 is the ceiling for single-probe floors **obtained by the triangle inequality on the Dirichlet
series** (the trivial bound). That is a statement about a proof technique, and it is immediate from the definition.
It must be relabelled. The summary claim "PROVED: single-probe start rate at t=0 is at most 13.34" does not survive.

Consequence for the obstruction: section 6 is an obstruction for the class {absolute-value Dirichlet bounds} x
{pointwise kernel domination, t = 0}, not for the method. This matches the fact, noted in the text, that Raymond's
joint floor at h = 1.88 (6.0012) is already above the single-probe trivial floor (5.8384).

## 3. Other points

- P1: the example z^2 + y0^2 shows de Bruijn is sharp for the strip hypothesis within all real entire functions of the
  class. It does not show sharpness within functions with the zero density of H_0. "Exactly de Bruijn" should read
  "de Bruijn is the best bound that uses the strip alone". CLASSICAL, fine with that wording.
- P2's explicit-formula count is HEURISTIC and labelled so. It is the only support for "no second entry point".
- Section 4 LPs are t = 0 only and grid-checked; labelled MEASURED. The run spends most of its time at t > 0 where
  Raymond's heights go down to 0.69 because the heat factor damps the Dirichlet sum. The statement "method loses most
  at small y" is then about a regime the LP did not measure.
- "A correctly configured re-optimised run can only be <= the replay value; difference below 1e-7": plausible (the
  F2 modes stay admissible and their rates do not fall when q falls), not proved, and no run exists.

## 4. Controls

- Davenport-Heilbronn: the conditional chain fails for DH at (H1) (zeros with Re s > 1) and at the floors (J)
  (log-derivative has poles in sigma > 1; no Dirichlet series with coefficients Lambda(n)). Correct. Lemma R, P1, P3
  are Euler-blind statements about kernels and ODEs and make no zero claim; correct to say they hold for any function.
- RH: not assumed anywhere. Verified height enters only through (W). Nothing restates verified height as new.
- No zero information is claimed; the output is an upper bound on Lambda conditional on unrefereed inputs.

## 5. Is the obstruction real? Ways around

The obstruction as stated is partly an artifact of restricting to trivial bounds at t = 0.
1. **Range-split floors at low h.** Split x >= X into [X, X^A] and x > X^A. On the far range the gain in
   (1/4) log x pays for the trivial bound. On the near range, bound the prime sum by a finite-alignment argument
   (only primes up to P(A) can be near-aligned; bound the rest in mean square on short windows plus a sup bound, or
   by a large-sieve / Kronecker-discrepancy estimate). Any such bound raises l(h) at h = 1.5-1.7 where the trivial
   loss is largest (sigma = 1.27: tail above p = 30 is 1.4). Raymond's floors already use six frequency ranges; this
   is the same device aimed at lower h. Size of gain: unknown; the sampled window suggests room up to about 0.7 in l.
2. **t > 0 LP.** Run the positive-measure LP with Raymond's t > 0 floors (heights down to 0.69). The 59439 substeps
   are almost all at t > 0; the t = 0 LP says nothing about them.
3. **Multi-zero barrier.** The domination (K) is required against every configuration with b <= y. A barrier on the
   top two heights, or on a sum over the zeros in a window, removes the same-height cluster worst case
   ((h^2 - y^2)/(2y^2) loss), which the text names as one of the two extremal configurations.

None of these is shown to work. They are enough to say the stated ceiling is not a ceiling of the method.

## 6. Surviving claim

Conditional on a zero-free half-plane Re s > 0.874886647 (preprints not read) and (H2)-(H4) of the paper:
Lambda <= 0.116060107834762 by fixed-mode replay of the archived F2 run (independently reproduced). Far-field cap
sum w_i h_i <= 2y for positive probe measures (lambda <= 2). The 13.34 figure is a ceiling only for single-probe
floors obtained from the triangle inequality; it is not a ceiling for valid floors. No improved formula Lambda(theta).
The obstruction is an obstruction for trivial-bound floors at t = 0 with pointwise domination, not for the conversion.
