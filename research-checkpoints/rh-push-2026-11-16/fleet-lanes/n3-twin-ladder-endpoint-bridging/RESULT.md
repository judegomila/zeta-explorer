# n3-twin-ladder-endpoint-bridging: RESULT

Verdict: the endpoint-bridging induction is killed by its own first test. The generator identity is proved (constant c = -1/4), every FE pair does collide on Re s = w/2 early (w <= 0.626 for all 44 pairs of height <= 215), but zeros then leave the line and re-enter it: 29 departures and 29 returns for 0 < w < 1 below height 205. The pair structure is reshuffled at every departure, so there is no birth map. Near w = 1 the interval of w with all zeros on the line shrinks with height on both sides, faster than 1/log T on the measured range. No statement about zeta zeros is obtained.

Labels: PROVED / CLASSICAL / MEASURED / ARGUED / OPEN. All numerics ran locally through `scripts/memcap.sh 8`, single process, each run under 20 minutes, no ssh. Nothing here is interval-certified.

## 1. Plan

Object. theta(x) = sum_{n in Z} exp(-pi n^2 x). For real w,

    Z(w,s) = int_0^inf (theta(t^2)^w - 1) t^(s-1) dt   (Re s > w),   F(w,s) = Z(w,s)/w.

- (CLASSICAL) theta(1/t^2) = t theta(t^2) gives continuation and Z(w,s) = Z(w,w-s); poles 1/(s-w) - 1/s. Z(1,s) = zeta*(s) := pi^(-s/2) Gamma(s/2) zeta(s). On the line s = w/2 + it, H(w,t) := F(w, w/2+it) is real, so a simple zero on the line stays on the line; zeros change between on-line and off-line only at double zeros of H(w,.) (events).
- Test first (as assigned): track all zero paths w: 0 -> 1 to height 200, record collision times, departures, re-entries, order.
- New relative to the obstruction map: no row there treats the theta^w family (text search of OBSTRUCTION_MAP.md for the family and its endpoint returned only row G14, a different object). The route atlas (PR 27) was not re-read in this lane.

## 2. First lemma: generator identity (PROVED, constant resolved)

G(s) := lim_{w->0} F(w,s) = int_0^inf log theta(t^2) t^(s-1) dt (Re s > 0).

    G(s) = -(1/4) (1 - 2^(1+s/2)) (1 - 2^(1-s/2)) zeta*(s/2) zeta*(-s/2).

Proof. Jacobi triple product with q = exp(-pi t^2): theta = prod (1-q^(2n)) (1+q^(2n-1))^2, so log theta = sum_m c(m) q^m, c(m) = sum_{kd=m} e(d,k), e = -1/k for d even, 2(-1)^(k+1)/k for d odd. With u = s/2, sum c(m) m^(-u) = zeta(u) zeta(u+1) [ -2^(-u) + 2(1-2^(-u))^2 ] = zeta(u) zeta(u+1) (2 - 2^(-u)) (1 - 2^(1-u)) (Re u > 1). Termwise Mellin transform gives G(s) = (1/2) pi^(-u) Gamma(u) sum c(m) m^(-u). Legendre duplication: pi^(-u) Gamma(u) zeta(u) zeta(u+1) = 2^(u-1) zeta*(u) zeta*(u+1), and zeta*(u+1) = zeta*(-u). Collecting: 2^(u-1) (1 - 2^(-u-1)) = -(1 - 2^(1+u))/4. QED.

The "factor 2" is the 1/2 from the substitution t^2 -> t in the Mellin transform against the 2 in (2 - 2^(-u)); with Z(1,s) = zeta*(s) exactly, c = -1/4.

Checks (MEASURED): quadrature of the left side against the right side at five points with Re s in [-0.5, 3], Im s up to 215: relative difference <= 4e-98 (`validate.py`); at Im s = 1000: 1.4e-61 (`val_hi.py`). c(m) from the exact power series of theta^w equals the divisor formula for m <= 30 (`controls.py`, exact rationals).

Zeros of G (CLASSICAL given the identity): s = 2 rho and s = -2 rho for nontrivial zeta zeros rho (Re s = +-1, heights 2 gamma, for the zeros known to be on the critical line), and s = +-2 + 4 pi i k / log 2, k != 0 (k = 0 cancels the poles of zeta* at u = +-1). G has a double pole at s = 0 only. G(it) = -(1/4) |1 - 2^(1+it/2)|^2 |zeta*(it/2)|^2 < 0, so no zeros on Re s = 0. Count: 2 N(T/2) + T log 2/(2 pi) + O(1) = (T/2pi) log(T/2 pi e) + O(log T), the same main term as N(T).

Circularity noted: the w = 0 ladder lies on Re s = +-1 only where zeta zeros are already known to be on the line.

## 3. First test

Method. Rotated ray t = exp(x + i phi), phi = pi/4 - delta/2 (theta_3 has no zeros in the upper half-plane, so theta^w continues to the sector); composite Gauss-Legendre in x, python-flint acb. Main quadrature: delta 0.3, 28 panels x 72 nodes, 400 bits; Z(1,s) against zeta*(s): relative error <= 4e-99 up to height 210; Z(2,s) against 2 pi^(-s/2) Gamma(s/2) zeta(s/2) L(s/2, chi_4): <= 2e-101. Files: `zf.py`, `validate.py`.

(a) First collisions (`track.py`, `first_collisions.tsv`; MEASURED). Newton continuation of the right member of each FE pair from w = 0; collision refined as a double zero H = H_t = 0 by two-variable Newton; residuals <= 1e-104 (scaled). 44 pairs (33 ladder pairs with 2 gamma <= 215, 11 progression pairs):
- ladder pairs collide at w between 0.00954 and 0.0585 (examples: L1, height 28.27: w = 0.058521514197914403089130395451072192491288371282112724527935...; L18: 0.00954...);
- progression pairs at w = 0.2169, 0.1534, 0.1151, 0.3851, 0.0934, 0.2818, 0.2733, 0.6250, 0.1914, 0.0641, 0.3750 (k = 1..11).
So "each FE pair collides before w = 1" holds on this range, with a wide margin for the first collision.

(b) All events (`scan.py`, `events.py`, `events_table.tsv`; MEASURED). Sign changes of H(w,t) on the grid w = 0.0025..1.3 step 0.0025, t <= 216 step 0.04; consecutive rows matched; every appearing or disappearing adjacent pair refined to a double zero and classified by the sign of H_w/H_tt. Result for t <= 205:
- 105 events for 0 < w <= 1.3: 70 arrivals, 35 departures. Residuals <= 1.6e-104. Values are given to 66 digits in `events_table.tsv`; six of them re-solved with a different quadrature (delta 0.2, panel 0.08, 90 nodes, 500 bits) agree in all 66 printed characters (`recheck.py`).
- For w < 1: 70 arrivals, 29 departures; net 41 pairs = 82 zeros = N(205) for zeta. The count closes.
- On-line zeros with t <= 200 at w = 0.05, 0.1, 0.2, ..., 0.9, 0.92, 1.0: 47, 43, 58, 62, 65, 67, 69, 71, 71, 77, 79, 79. Not monotone (47 -> 43).

(c) Departures and returns (`offtrack.py`, `excursions.tsv`; MEASURED). Each of the 29 departures below w = 1 was followed off the line by Newton continuation until it returned. All 29 return before w = 1; maximal distance from the line during an excursion ranges from 0.067 to 1.16. Example (lowest):
- departure w = 0.352173358368073249511072832727167587415240628261379174579207..., t = 38.9708617307633206922609037838974829728234671732935159110093...; the two zeros that collide there were born in the arrivals of pair A2 (w = 0.1534) and pair L2 (w = 0.0476);
- return w = 0.565736954818052429009307954527430329475830322108193586664769..., t = 39.0803632115557392482417221754287064658480945292599402212914...; excursion distance 0.449.
Latest return below height 205: w = 0.916851229240882095853504409559720526676953879312005378278136..., t = 111.356557814842996106232055702519722880317873827776822407507...
Six further departures occur for 1 < w < 1.3 (first: w = 1.122007463494887434992078566489260666065290719983479378285613..., t = 204.8235...); none returns before 1.3.

(d) Order and birth map (MEASURED). In all 28 departures whose two colliding zeros could be traced to their arrivals, the two zeros come from different arrivals; none is a sibling pair. After a departure the off-line pair is a new pair. The assignment "zeta zeros at height T are sibling pairs of a w = 0 pair" is therefore not defined; only the total count is preserved.

Kill criteria.
1. "A re-entering pair": met, 29 times below height 205.
2. "1 - w_k decaying faster than 1/log T", read for the last return w_-(T) = largest event time below 1 with height <= T. Events to 205 plus scans at 26 values of w up to T = 1000 (`hiscan.py`, `window.py`; quadrature checked against zeta* to 4e-61 at height 1000; N_on(1; 1000) = 649 as it must be):

| T | 1 - w_-(T) | w_+(T) - 1 (first departure above 1) |
|---|---|---|
| 60 | 0.420 | > 0.3 |
| 100 | 0.135 | > 0.3 |
| 112 .. 205 | 0.0831 | 0.132 (T >= 134), 0.122 (T >= 205) |
| 232 | | in (0.06, 0.07] |
| 358 .. 369 | in (0.06, 0.07] | in (0.025, 0.03] |
| 460 | in (0.03, 0.04] | |
| 631 .. 678 | in (0.025, 0.03] | in (0.015, 0.02] |
| 1000 | in (0.025, 0.03] | in (0.015, 0.02] |

From T = 112 to T = 678 the lower margin falls by a factor of about 3; 1/log T falls by 1.38. Criterion 2 is met on this range. At fixed w != 1 the fraction of zeros off the line grows with height (w = 0.95: 0, 1.2, 2.2, 3.1 percent in the bins [0,250], [250,500], [500,750], [750,995]; w = 1.05: 0, 2.5, 4.4, 4.1 percent).

Interpretation (ARGUED). Near w = 1, H(w,t) = H(1,t) + (w-1) K(t) + ..., and a close pair of zeta zeros with gap g leaves the line when |w-1| |K| exceeds |H_tt| g^2/8, on the side fixed by the sign of K H_tt. Both signs occur. If small gaps and K behave as expected, the set of w with all zeros on the line is {1} in the limit: w = 1 is isolated in the family from both sides, and a continuity or monotonicity argument in w has no margin. OPEN as a theorem.

The first test kills the idea as posed. Work on the induction stops here.

## 4. Controls

- Davenport-Heilbronn (MEASURED, double precision; `controls.py`). Kernel phi(tau) = sum_n a(n) n exp(i pi n^2 tau/5), a = (1, xi, -xi, -1, 0) mod 5. It is positive on tau = iy (minimum of phi exp(pi y/5) on [0.05, 20] is 3.2e-4), so the real-ray family Z_DH(w,s) with a functional equation exists. But phi has zeros inside the upper half-plane: the argument principle gives 10 zeros in one period 0 <= Re tau <= 10, 0.08 <= Im tau <= 3 (the same count for theta_3 gives 0); the highest are tau = 8.6547109231 + 0.2311276526 i and its mirror. Hence phi is not an eta quotient, log phi has branch points in the disc, its q-coefficients grow like exp(0.2311 pi m/5)/m, and the generator has no Dirichlet series in any half-plane: there is no w = 0 product endpoint. The lemma of section 2 fails for DH at the triple-product step.
- Backward heat. Kernel exp(tau u^2/16) theta-kernel, tau < 0. The w-family multiplies by exp(w tau u^2/16); the generator gains tau u^2/16, whose Mellin transform does not exist as a function (the term is unbounded at both ends of the ray). Step one (a meromorphic generator with a zero set) fails. (ARGUED from the definition; no run.)
- Sign twist Lambda(n) -> eps_n Lambda(n): not formulable. The family needs a kernel with the inversion law to define the line Re s = w/2; the twist has no functional equation.
- Point for the campaign record: the DH control is not what kills this lane. Zeta itself kills it: the zero paths of the zeta family leave and re-enter the line.

## 5. Where multiplicativity enters

(PROVED, exact; `controls.py`.) Let r_w(n) be the coefficients of theta^w. Then

    2w r_w(6) - r_w(2) r_w(3) = (8/45) w^3 (w-1)(w-2)(w-4)(w-8).

So r_w(n)/(2w) is multiplicative at (2,3) only for w in {1, 2, 4, 8} (w = 0 is the degenerate normalisation). For every w in (0,1) the Dirichlet series of Z(w,.) has no Euler product. Multiplicativity is used at the two endpoints only: at w = 0 through the triple product (the generator is a Dirichlet convolution, hence a product of two zeta values and a 2-factor) and at w = 1. Nothing multiplicative acts on the path between them; on the path the family behaves like a generic real-analytic family with a functional equation, and the measured departures are what such a family does.

## 6. Height localisation for the Levy deconvolution

Z(1,s) = sum_k M[(log theta)^k](s)/k!, and M[(log theta)^2](s) is the vertical-line convolution (1/2 pi i) int G(z) G(s-z) dz. By Stirling, |G(x+iy)| is exp(-pi |y|/4) times a power of |y| times zeta values, so |G(z) G(s-z)| has the factor exp(-pi (|y| + |T-y|)/4) = exp(-pi T/4) for every 0 <= y <= T: the integrand has no decay across the whole interval [0, T], and decays exponentially only outside it (ARGUED; Stirling step not written out). Consequences:
- a localisation lemma of the form "zeros at height T depend on the generator near height T (or near T/2)" is false in this form: all generator heights in [0, T], i.e. zeta at all heights up to T/2, enter with equal exponential weight, and the k-fold terms spread over a simplex;
- what does hold is one-sided: heights above T contribute exponentially little. That statement uses only positivity of the kernel and holds verbatim for the DH family, so it carries no arithmetic.

## 7. Pivot (one, as allowed)

The strongest adjacent statement found is the two-sided window of section 3: W(T) = {w : all zeros of Z(w,.) up to height T lie on Re s = w/2} contains 1 and shrinks on both sides. It is an obstruction, not a lever: it says that RH is not an open condition in this family. It adds a control to the campaign list: theta^w for w near 1 keeps the functional equation, the positive kernel, the gamma factor, and analytic dependence on the parameter, and loses the Euler product exactly (section 5), with off-line zeros appearing at heights 631-678 for |w - 1| = 0.02-0.03. Any argument that is stable under w -> 1 + epsilon is refuted by it at finite height. No further pivot.

## 8. Three weakest steps

1. Completeness of the event list. Events are found from sign changes on a grid (w step 0.0025, t step 0.04). An arrival and a departure at the same place within one w-step, or a pair closer than the t-step for the whole of its life, would be missed. The net count (82 = N(205)) checks only the balance. Double zeros are midpoint Newton solutions with residual 1e-104, confirmed by a second quadrature, not interval enclosures, and no exclusion statement is certified.
2. The window law. 26 values of w, heights to 1000, brackets of width 0.005-0.01, four to five distinct steps per side. "Faster than 1/log T" is measured on T in [112, 678] only; the limit statement W = {1} is argued from a first-order perturbation picture and is open. Deficit counts assume zeros drift in height by less than the comparison window when w changes by 0.1.
3. DH and localisation statements. The interior zeros of the DH kernel come from a double-precision argument-principle count and Newton iterations, without certification; the non-localisation claim of section 6 rests on a Stirling estimate that is stated, not written out. The pairing of each departure with its return (section 3c) is by uncertified Newton continuation with step 0.005.

## Files

`zf.py` (evaluator), `validate.py`, `val_hi.py`, `recheck.py` (accuracy checks), `track.py` + `first_collisions.tsv`, `scan.py` + `scan_fine1.jsonl`, `scan_fine2.jsonl`, `scan_main.jsonl`, `events.py` + `ev_fine.json` + `events_table.tsv`, `offtrack.py` + `excursions.tsv`, `hiscan.py` + `hi1.jsonl`, `hi2.jsonl`, `window.py` + `window.json`, `analyze.py`, `controls.py`. The `venv/` directory holds python-flint and is ignored by git.
