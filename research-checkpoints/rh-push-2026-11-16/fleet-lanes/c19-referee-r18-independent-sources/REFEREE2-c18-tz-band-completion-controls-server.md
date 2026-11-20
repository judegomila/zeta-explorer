# REFEREE2 (second, independent) for c18-tz-band-completion-controls-server/RESULT.md

Date 2026-11-20 (round 19, lane c19-referee-r18-independent-sources). Written from RESULT.md, PREREG.md and the scripts as text; the
first referee file was opened after sections 1 to 3 were fixed. No statement about zeros of zeta is made by the lane or here.

**Verdict: holds with corrections.** Outcome (c) for the registered Form C is reproduced by independent code on a 5 percent sample
(30 of the 600 cells) and does not depend on the mode count in sign. The margins reported for zeta in Form D are values at 96 modes
and fall with the mode count. Flags set by this referee: R1 false, R2 false, R3 false, R4 false.

## 1. Re-derivation of the operators (before running)

- Lemma L: <h_j, C_a h_k> = (e^(-i tau_k a) - e^(-i tau_j a))/(i (k - j) Delta) for j != k (uses (tau_k - tau_j) U in 2 pi Z),
  (U - a) e^(-i tau_j a) on the diagonal; A + A* has the real entries 2 (Im F_k - Im F_j)/((k - j) Delta) and 2 Re(U F_j - F1_j).
  Confirmed.
- Arch: Re psi(lambda + i x/2) = -gamma + integral over a > 0 of 2 [e^(-2a) - e^(-2 lambda a) cos(xa)]/(1 - e^(-2a)) da, and the
  multiplier cos(xa) has the form Re <h, C_a h>, so Arch/U has diagonal const + Re psi(z_j) + Re psi'(z_j)/(2U) and off-diagonal
  (Im psi(z_k) - Im psi(z_j))/((tau_k - tau_j) U), up to the tails a > U (size e^(-U/2)/t). Confirmed; the rerun drops the tails and
  the pole term (norm 1e-9 Lg or less by the lane's own numbers).
- Reflected atoms: with omega_w = 2 vartheta(t_w) - t_w Lg, F(tau_j) = e^(-2 i vartheta(t_w)) sum over n of
  Lambda(n) n^(-1/2) ((Lg - log n)/log n) e^(i t_w log n) e^(-i y_j (Lg - log n)), y_j = tau_j - t_w. This is what `run.py` computes.

## 2. Required rerun: 5 percent sample at two (here three) mode counts, on the server

Sample: two windows per height drawn with python random.Random(20261119): 1e6: w = 30, 33; 1e8: 13, 39; 1e10: 1, 16; 1e12: 28, 36;
theta = 0.55, 0.65, 0.75, 0.85: 32 cells, 30 with at least one reflected atom (5.0 percent of 600).
Code (`tz_server/ref2_tz_prime.py`, `ref2_tz_asm.py`; shares nothing with `engine.c`, `tz.py`, `run.py`): numpy segmented sieve;
phases t_w log n in 80-bit long double; moments on cells of width 1/512 in log n with a 10-term expansion; all prime powers up to
t^0.85 (7.06e8 terms at 1e12); Arch from mpmath digamma at 50 digits; float64 symmetric eigenvalues. Mode counts m = 48, 96, 192 with
the same centre and spacing (the three spaces are nested, so lambda_min cannot increase with m).
Server: 11 units through rhrun, 1 core and 2 to 3 GB each, at most 7 at a time, longest 104 s; all finished; none running
(`tz_server/logs/`). The values are float64, not certified.

| T0 | w | theta | atoms | lane C lam_min (m = 96) | rerun C: m = 48 | 96 | 192 | abs diff at 96 | lane D lam_min (96) | rerun D: 48 | 96 | 192 | D lam_min/Lg at 192 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1e6 | 30 | 0.55 | 31 | -10.7776 | -10.1516 | -10.7776 | -12.4766 | 7.7e-11 | 3.7216 | 4.4550 | 3.7216 | 2.6083 | 0.2177 |
| 1e6 | 30 | 0.65 | 12 | -12.9616 | -12.5870 | -12.9616 | -13.1069 | 7.9e-12 | 2.4261 | 2.6128 | 2.4261 | 1.5817 | 0.1320 |
| 1e6 | 30 | 0.75 | 4 | -9.3885 | -9.0828 | -9.3885 | -9.5001 | 1.4e-11 | 0.6576 | 0.6788 | 0.6576 | 0.6478 | 0.0541 |
| 1e6 | 30 | 0.85 | 0 | 0.0968 | 0.0998 | 0.0968 | -0.0013 | 4.7e-12 | 0.1113 | 0.1225 | 0.1113 | 0.1078 | 0.0090 |
| 1e6 | 33 | 0.55 | 31 | -10.5646 | -10.3712 | -10.5646 | -10.6094 | 3.6e-12 | 2.1519 | 2.1596 | 2.1519 | 2.1452 | 0.1790 |
| 1e6 | 33 | 0.65 | 12 | -10.3938 | -9.8577 | -10.3938 | -11.1216 | 4.3e-11 | 0.8444 | 0.8634 | 0.8444 | 0.8361 | 0.0698 |
| 1e6 | 33 | 0.75 | 4 | -7.1602 | -6.7520 | -7.1602 | -8.6877 | 3.8e-11 | 0.2857 | 0.2975 | 0.2857 | 0.2824 | 0.0236 |
| 1e6 | 33 | 0.85 | 0 | 0.1204 | 0.1406 | 0.1204 | 0.0766 | 1.9e-11 | 0.1547 | 0.1637 | 0.1547 | 0.1324 | 0.0111 |
| 1e8 | 13 | 0.55 | 137 | -11.9765 | -11.6146 | -11.9765 | -17.8906 | 1.3e-10 | 5.7639 | 6.0486 | 5.7639 | 3.8531 | 0.2324 |
| 1e8 | 13 | 0.65 | 35 | -11.0591 | -10.7441 | -11.0591 | -17.1109 | 1.2e-10 | 3.4669 | 3.5293 | 3.4669 | 1.9980 | 0.1205 |
| 1e8 | 13 | 0.75 | 9 | -10.4439 | -10.2954 | -10.4439 | -14.0688 | 7.2e-12 | 2.2048 | 2.2656 | 2.2048 | 1.3003 | 0.0784 |
| 1e8 | 13 | 0.85 | 1 | -4.2703 | -4.0255 | -4.2703 | -4.3695 | 5.8e-11 | 0.8159 | 0.8872 | 0.8159 | 0.3140 | 0.0189 |
| 1e8 | 39 | 0.55 | 137 | -15.0609 | -13.7315 | -15.0609 | -16.4365 | 2.0e-11 | 5.4900 | 6.2653 | 5.4900 | 4.4843 | 0.2704 |
| 1e8 | 39 | 0.65 | 35 | -12.9267 | -12.6897 | -12.9267 | -15.9942 | 7.2e-11 | 3.8778 | 4.8435 | 3.8778 | 3.2822 | 0.1979 |
| 1e8 | 39 | 0.75 | 9 | -13.0048 | -12.8645 | -13.0048 | -13.1567 | 1.4e-11 | 1.6019 | 2.2465 | 1.6019 | 1.0324 | 0.0623 |
| 1e8 | 39 | 0.85 | 1 | -4.3603 | -3.2128 | -4.3603 | -4.4322 | 5.0e-11 | 0.4578 | 0.5414 | 0.4578 | 0.4185 | 0.0252 |
| 1e10 | 1 | 0.55 | 716 | -20.9666 | -12.4443 | -20.9666 | -21.4928 | 3.3e-10 | 5.4734 | 8.1527 | 5.4734 | 4.6639 | 0.2201 |
| 1e10 | 1 | 0.65 | 115 | -22.7946 | -12.6839 | -22.7946 | -23.1585 | 6.9e-09 | 4.6858 | 5.2575 | 4.6858 | 2.0826 | 0.0983 |
| 1e10 | 1 | 0.75 | 23 | -19.9914 | -12.5355 | -19.9913 | -20.5795 | 1.3e-04 | 2.1007 | 2.1312 | 2.1007 | 1.3698 | 0.0647 |
| 1e10 | 1 | 0.85 | 4 | -17.8915 | -5.7868 | -17.8915 | -18.2797 | 2.8e-08 | 1.4009 | 1.4558 | 1.4009 | 0.5328 | 0.0251 |
| 1e10 | 16 | 0.55 | 716 | -24.2443 | -15.6272 | -24.2443 | -26.8562 | 2.8e-08 | 7.7231 | 8.5869 | 7.7231 | 3.7019 | 0.1747 |
| 1e10 | 16 | 0.65 | 115 | -25.4081 | -12.8984 | -25.4081 | -27.8897 | 1.9e-08 | 4.7912 | 4.9382 | 4.7912 | 2.1010 | 0.0992 |
| 1e10 | 16 | 0.75 | 23 | -23.4570 | -9.8501 | -23.4584 | -25.0217 | 1.4e-03 | 1.4737 | 2.8046 | 1.4737 | 0.9598 | 0.0453 |
| 1e10 | 16 | 0.85 | 4 | -12.5281 | -10.2547 | -12.5281 | -12.9616 | 1.4e-08 | 0.3215 | 1.1936 | 0.3215 | 0.2508 | 0.0118 |
| 1e12 | 28 | 0.55 | 4282 | -26.9824 | -26.8650 | -26.9824 | -27.0769 | 2.2e-06 | 7.7273 | 7.7363 | 7.7273 | 6.1022 | 0.2366 |
| 1e12 | 28 | 0.65 | 404 | -26.9633 | -26.7669 | -26.9633 | -26.9771 | 1.4e-07 | 3.6649 | 3.8654 | 3.6649 | 3.2598 | 0.1264 |
| 1e12 | 28 | 0.75 | 50 | -21.4509 | -19.0258 | -21.4509 | -21.9063 | 3.1e-06 | 1.0219 | 1.1126 | 1.0219 | 0.8200 | 0.0318 |
| 1e12 | 28 | 0.85 | 7 | -14.9411 | -12.9241 | -14.9411 | -16.4007 | 1.8e-06 | 0.3404 | 0.3926 | 0.3404 | 0.3321 | 0.0129 |
| 1e12 | 36 | 0.55 | 4282 | -26.9941 | -25.7955 | -26.9941 | -36.5909 | 1.5e-07 | 8.5131 | 8.6120 | 8.5131 | 6.1061 | 0.2367 |
| 1e12 | 36 | 0.65 | 404 | -25.2739 | -23.2184 | -25.2739 | -33.5274 | 1.5e-07 | 3.9052 | 4.6447 | 3.9052 | 2.9161 | 0.1131 |
| 1e12 | 36 | 0.75 | 50 | -23.7272 | -20.0037 | -23.7272 | -29.7810 | 1.3e-06 | 1.9440 | 2.0658 | 1.9440 | 1.4699 | 0.0570 |
| 1e12 | 36 | 0.85 | 7 | -14.5942 | -11.3406 | -14.5942 | -22.8051 | 3.6e-07 | 1.0164 | 1.3564 | 1.0164 | 0.2827 | 0.0110 |

Reproduction at m = 96. Form C: 30 of 30 cells with atoms agree with the lane's lam_min; largest relative difference 6e-5 (the two
cells at (1e10, 0.75), explained in C3 below), otherwise below 1e-7 relative. Form D: 32 of 32 agree, largest absolute difference
7.6e-6. Atom counts agree in every cell. The "without reflected" values agree to 1.3e-3 (same two cells) or better.

Mode-count dependence.
- Form C (cells with atoms): negative at m = 48, 96 and 192 in 30 of 30 cells; lam_min/Lg between -1.42 and -0.19 over all cells
  and mode counts. lam_min(192)/lam_min(96) is between 1.0005 and 1.56 (more negative with more modes, as nesting requires);
  lam_min(48)/lam_min(96) is between 0.32 and 0.996 (at 1e10 the 48-mode value is about half the 96-mode value). Medians of
  lam_min/Lg over the sample at m = 48, 96, 192: theta = 0.55: -0.84, -0.95, -1.05; 0.65: -0.79, -1.01, -1.07; 0.75: -0.68, -0.81,
  -0.85; 0.85 (6 cells): -0.36, -0.57, -0.62. Outcome (c) does not depend on the mode count in sign; its size does, by up to a
  factor 3 between 48 and 96 modes and up to 1.6 between 96 and 192.
- Form D for zeta: positive at all three mode counts in 32 of 32 cells (it must be non-negative at every m if the zeros seen are
  real). lam_min(192)/lam_min(96) is between 0.28 and 0.997, median 0.75; lam_min(48)/lam_min(96) between 1.001 and 3.7. Sample
  medians of lam_min/Lg at m = 48, 96, 192: theta = 0.55: 0.368, 0.320, 0.226; 0.65: 0.215, 0.206, 0.117; 0.75: 0.090, 0.073, 0.056;
  0.85: 0.043, 0.021, 0.012 (minimum at 192 modes: 0.175, 0.070, 0.024, 0.009). The margin of zeta is therefore a function of the
  mode count; it is not converged at 96 modes.
- Band-Lg data form without atoms, (1e6, 0.85): 0.0998, 0.0968, -0.0013 at w = 30 and 0.1406, 0.1204, 0.0766 at w = 33. One of the
  two sampled windows is negative at M = 0 with 192 modes. This agrees with section 6 of the lane (truncation at u is not a positive
  extension) and restricts the table entry "40 of 40 pass" to 96 modes.

Not rerun: the control classes (chains, Liouville, E_a, T-NR, ZQ, DH) and the certification. The first referee measured the chain
pass rates at m = 96, 384, 1536 at 1e6.

## 3. Corrections (sentence to use)

| # | Where | Status | Sentence to use |
|---|---|---|---|
| C1 | Section 4.1 table and bullets; verdict item 2; proposed map text ("margin 0.22 to 0.26 of log(t/2 pi) ... not shrinking with t") | value depends on the mode count | "On 96 Fourier modes zeta's smallest eigenvalue has median 0.22 to 0.26 Lg at theta = 0.55 and 0.012 to 0.025 Lg at 0.85; on 192 modes with the same centres (8 windows, 1e6 to 1e12) it is 0.28 to 1.0 times the 96-mode value (median 0.75). The margin is a property of the window space and decreases with the number of modes." |
| C2 | Section 5 and verdict item 1 | add the mode count | "zeta fails Form C at M = 0 and M = 1 in 600 of 600 cells with a reflected atom on 96 modes (certified by the lane); in a 30-cell sample rerun with independent code the smallest eigenvalue is negative at 48, 96 and 192 modes in every cell, between -1.42 and -0.19 times Lg, and more negative with more modes." |
| C3 | Deviation (iii) ("can add one integer with log n within 1e-10 of u (entry change below 1e-9)") | wrong for Form C at one boundary | "At (1e10, 0.75) the boundary integer 31622777 = round(1e10^0.75) is prime and is included; `xtheta` rounds to the nearest integer at every boundary because its tolerance is relative. In Form D its weight (U - log n) is below 1e-7; in Form C (band Lg > u) it enters with weight log n/sqrt n = 3.1e-3 and changes lam_min by up to 1.4e-3 (6e-5 relative). No sign changes." |
| C4 | Section 5 table, row (1e6, 0.85): "40 (no atom: band-Lg data form)" | 96 modes only | "40 of 40 at 96 modes; at 192 modes one of two sampled windows is negative at M = 0 (-0.0013)." |
| C5 | Verdict item 4, section 4.2 reading 1 (found by the first referee; not rerun here) | 96 modes only | the first referee's sentence: "on 96 modes, in a typical window, N(theta) at theta = 0.55 does not distinguish a chain from zeta at M = 0 or M = 1; the distinction appears as m grows and for theta >= 0.75". |

## 4. Comparison with the first referee (opened after sections 1 to 3)

Same verdict. Its E1 and E3 (pass rates and margins are 96-mode statements) are confirmed here from a different sample, at all four
heights instead of 1e6 only, and quantified for zeta at 48 and 192 modes. Its reproduction was at 1e6; this pass reproduces the
lane's eigenvalues at 1e8, 1e10 and 1e12 with independent prime sums (the first direct check of the engine above 1e6: weakest step 2
of the lane said no direct sum was made there). C3 is new. Its E2 (the "Reading" after Lemma L is false as an equivalence at fixed
U) and E5 are agreed by inspection.

## 5. Flags

R1 false: no step uses multiplicativity; chains are multiplicative and pass at 96 modes. R2 false: 40 windows at four heights, and
the statistic depends on the mode count. R3 false: ZQ eta = 0.05, E_0.1 and DH at (1e6, 0.55) pass in the lane's table (not rerun).
R4 false: Form C fails for zeta. Referees on this lane after this file: 2, both hold with corrections. PROVED labels broken: 0
(the two PROVED lemmas hold); MEASURED statements restricted: 3 (C1, C3, C4).
