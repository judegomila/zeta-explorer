# c12-control-battery-harness: PLAN (pre-registration; written 2026-11-19 before any battery run)

Kind: compute (heavy), meta-harness. No requirement flag, no R4 answer, no statement about zeros of zeta.

## Registered question
Does one battery of control objects, built once, reproduce the recorded verdicts of five closed devices?

## Objects (uniform interface: coefficients, local parameters, functional-equation data, grid values, zeros, sanity)
| code | object | parameters fixed here |
|---|---|---|
| ZETA | zeta(s) | - |
| DH | Davenport-Heilbronn, conductor 5, coefficients 1, kappa, -kappa, -1, 0 | kappa = (sqrt(10 - 2 sqrt 5) - 2)/(sqrt 5 - 1) |
| EA-1/8, EA-1/4, EA-1/2 | zeta(s + a) zeta(s - a) | a = 1/8, 1/4, 1/2 |
| TNR | zeta(s)(1 + c q^(1/2-s) + q^(1-2s)) | q = 3, c = 2.2 (the pair of `r3-tnr-control`) |
| U-00..U-23 | completely multiplicative, chi(p) = e(u_p), u_p uniform | numpy PCG64 seed 120000 + j, one draw per prime in increasing order |
| SGN-00..SGN-23 | completely multiplicative, eps(p) = +-1 | numpy PCG64 seed 121000 + j; plus SGN-LIOU (eps = -1 at every prime, closed form zeta(2s)/zeta(s)) |
| THIN-0.9 | eps(p) = -1 on the greedy floor set for L = (1/2)(Ei(b log x) - Ei(b log 2)), b = 0.9 | as `c4-thin-twist-control-78`, set built in ball arithmetic |
| DEL-0.75, DEL-0.9 | primes of the greedy floor set for L = Ei(b log x) - Ei(b log 2) deleted | as `c10-thin-deletion-zero-mode-control` |
| HEAT--0.1, HEAT--0.5 | F_tau(z) = int e^(tau u^2/16) kappa(u) e^(zu/2) du, s = 1/2 + z | tau = -0.1, -0.5 (`c1-missing-controls/heatlib.py`) |
| WT | zeta(s + i alpha), alpha = 2 pi k/log(T/2 pi) | T = 1000, k = 1 |
| BEU | Beurling system with generalised primes q_n = p_n + 1/2 | zeta_B = zeta H, H = prod (1 - p^-s)/(1 - (p + 1/2)^-s) |

Grid: Re s in {0.5, 0.625, ..., 2.0} (13 abscissae), Im s in {0, 0.5, ..., 2000} (4001 ordinates); negative ordinates by the stated conjugation rule. Coefficients to N = 1e7. Zeros to height 2000 where the object has a continuation to the strip.

Limits known before the run (stated, not hidden):
- 30 digits are attainable only for objects with a closed form (ZETA, DH, EA, TNR, WT, SGN-LIOU, HEAT). For U and SGN (random) there is no continuation: values are given for Re s > 1 only, from the Euler product over p <= 1e7 in float64, with a tail radius. For THIN, DEL, BEU the tables hold the stage to 1e7 (zeta times the finite product) and, where it converges, a tail radius; the true THIN/DEL object left of b is not determined by finite data (c10, verdict item 3).
- HEAT: grid and zeros to height 500 in the first pass (quadrature cost grows with height); height 2000 only if the server budget allows. This is a deviation from the assignment and is reported.
- Zeros of U, SGN (random), BEU-specific: none in Re s > 1; not defined in the strip. THIN/DEL: zeros = zeta's zeros right of b and the zero at b by theorem (not by data).

## Decisive test (five device replays; thresholds fixed here)
A replay "reproduces" when (i) the verdict is the recorded one and (ii) every listed number matches within the stated tolerance. Tolerances are the precision at which the record printed or certified its numbers.

D1. de Branges shift positivity, `c11-rs3-debranges-positivity-family` (record: `screen.json`). q_h(rho) = -Re{X'(rho) X(rho + h)}/(|X'||X|) at on-line zeros.
 - CL (3.2): -Re{xi'(rho_34) xi(rho_34 + 1)} = -5.38910050718e-69, relative tolerance 1e-11. Verdict: negative at zero 34, h = 1; first failing index among zeros 1..100 at h = 1 is recorded as "34th zero" (Conrey-Li): replay must find 34 as the first failure.
 - zeta zeros 1-100: fails at h = (0.1, 0.25, 0.5, 1, 2, 4) = (0, 0, 0, 2, 50, 99); min q at h = 0.5, 1: 0.531848072452459, -0.17845535996405765 (abs tol 1e-9).
 - zeta zeros 620-680: fails (0, 0, 0, 6, 33, 57); min q_1 = -0.4774690487348363 (1e-9).
 - DH on-line zeros, 1 < t < 200: 122 zeros; fails (0, 0, 0, 2, 54, 122); min q_1 = -0.18900481690394497 (1e-9).
 - DH on-line zeros, 1000 < t < 1020: 17 zeros; fails (0, 0, 0, 3, 10, 16); min q_1 = -0.3348103021277858 (1e-9).
 - Not replayed: the windows near t = 1e4 (outside the battery height) and GAM (not a battery object).
D2. Finite Pick orders, `euler/` (record: `nest_dh_small.txt`, `nest_z_small.txt`). Nested van der Corput nodes in log x on [0.01, 0.5], N = 100, LDL^T of the unit-diagonal real Pick matrix of L = Lambda'/Lambda(1/2 + x).
 - DH: positive definite through order 100; pivots at N = 5, 10, 20, 30, 40, 60, 80, 100: 9.14e-18, 4.55e-47, 1.34e-105, 8.82e-159, 7.18e-229, 3.55e-360, 1.02e-490, 9.74e-637 (3 significant digits: relative tolerance 6e-3).
 - zeta: positive definite through 100; pivots 3.91e-21, 1.24e-53, 7.34e-118, 5.17e-176, 9.88e-251, 8.56e-391, 1.68e-529, 2.54e-683 (same tolerance).
 - Replay in ball arithmetic (python-flint, 2900 bits); a pivot counts as positive only if its ball is positive.
D3. Lemma B pole-lattice multipliers, DH form, `c3-lemmab-referee-dh-poisson` (record: `dh_form.json`, 8 cases). The device's own formulas are run with the DH zeros taken from the battery zero table (computed independently of `c2-euler-at-zeros/dh_zeros_1000.json`).
 - Verdict: the identity holds for DH in all 8 cases. Tolerance: |relative difference| <= 5.4e-12 (the map's recorded maximum, row P43); zero side, archimedean term, residue term and third line each within relative 1e-9 of the recorded value (third line: absolute 1e-12 when recorded 0); number of off-line pairs in the window equal to the record.
D4. Central-value square, `c11-del-device-read-confirm` section 4 (row G32; no numeric table on record: the record is Lemma W2 and the statement "every control passes").
 - Verdict to reproduce: for every battery object the form F(1/2 + it) F(1/2 - it) (hermitian form |F|^2 for complex coefficients) is >= 0 at every grid ordinate where the object is defined on Re s = 1/2, and it does not vanish at the ordinates of the off-line zeros of DH (85.6993484854, 114.1633427308), TNR and HEAT. Numeric criterion: imaginary part of the product within the ball radius, real part's ball not strictly negative, for all grid points; value at off-line ordinates > 0 with ball. Objects without a continuation to Re s = 1/2 (U, SGN random; true THIN, DEL, BEU) are evaluated as their 1e7 stage and reported in a separate column; the record's phrase is "where continued".
 - Lemma W1 check: no t != 0 on the grid has 2^(-it) and 3^(-it) both real.
D5. P46 Landau step with DEL, `c10-thin-deletion-zero-mode-control` and `c11-del-device-read-confirm` cell (b) (records: `del_b0.75_m1_X1e+07.json`, `del_b0.9_m1_X1e+07.json`).
 - Verdict: DEL passes the Landau step: the coefficients of A in H = F F*/zeta^2 = exp(-2A) are >= 0 at every prime power <= 1e7 (exact), the identity holds numerically at Re s > 1 from the battery tables, and the abscissa data agree with the record.
 - Numbers: |S| = 16210 (b = 0.75), 148727 (b = 0.9) exact; log G_X(b) = -2.7267506442281846, -2.9272801194912508 (abs 1e-10); D(X) = -0.42854444631146565, -0.4228636952561132 (abs 1e-9); exponent estimates 0.9999820252692792, 1.0000352253371665 (abs 1e-9) from marks 1e5, 1e7; identity H = exp(-2A) at s = 1.5, 2, 1.5 + 10i to relative 1e-6 (limited by the 1e7 tail; bound stated with the result).

Threshold: 5 of 5. A mismatch is reported as a referee item against the original lane and is not adjusted.

## Order of work
1. Core library and zero tables for ZETA and DH locally (memcap 8 GB), D1 to D5 locally as the first decisive pass.
2. Full battery on the server through rhrun (unit names recorded): coefficient tables to 1e7, grid tables, zero tables, sanity checks, and the five replays again from the built tables. Planned allocations printed by each script. Request: 16 cores, 24 GB.
3. Mirror, checksums, README, RESULT, REFEREE, lanes.jsonl.

## Amendment 1 (2026-11-19, written before any D5 code existed or ran; zero tables were being computed, no device had run)
The D5 identity tolerance "relative 1e-6 at s = 1.5, 2, 1.5 + 10i" was set without computing the tail of a 1e7 Dirichlet partial sum (at Re s = 1.5 the tail bound is 6.3e-4). It is replaced by:
 (i) stage identity in ball arithmetic: (zeta G_X)^2/zeta^2 = exp(-2 A_X) with A_X = sum over p in S, p <= 1e7, k >= 1 of p^(-ks)/k, at s = 1.5, 2, 1.5 + 10i, relative tolerance 1e-25;
 (ii) coefficient table against the stage: sum_{n <= 1e7} a(n) n^-s against zeta(s) G_X(s) at s = 2, 3, 2 + 10i, within the proved tail bound N^(1 - sigma)/(sigma - 1) (1e-7, 5e-15, 1e-7) plus 1e-12 for float64 summation.
All other D5 numbers are unchanged. This is an error of this plan, not of the recorded lane.
