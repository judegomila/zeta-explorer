# c15-u5-window-count-threshold-translate-control: how many windows near height T a control without the functional equation passes

Date: 2026-11-19. Kind: deepen (class U5 of `campaign/CHECKPOINT_R14_DRAFT.md`; sources `c3-multiwindow-converse-defect`,
`c2-euler-cone-fe-rigidity`, `c4-fe-stage-rouche-crossing`, map rows P40, S12, control WT, STRATEGY 4.0 (b)).
Scope: this directory only. Numerics: mpmath (30 to 48 digits) for the translate and combination statements; float64 nonlinear
least squares in the finite model of round 3 (`afe.py` copied unchanged) for the free-prime family; local runs through
`scripts/memcap.sh 8`; one run on the compute server through `rhrun` (4 cores, 8 GB, unit `rh-c15u5-1119182039`).
Labels: PROVED (argument given here), CLASSICAL, MEASURED (no certificate), ARGUED, OPEN. No statement about zeros of zeta is made.

## Verdict

**Precise obstruction, outcome (a) in a stronger form than asked. No new result about zeta. The number of windows is not the
controlling variable; the relative spread of the window heights and the tolerance are.**

1. (PROVED, Lemma 1; MEASURED to three digits.) For windows that lie inside one span `[T, T + L]`, the height translate
   `zeta(s + i alpha)`, `alpha ~ 2 pi/log(T/2 pi)`, passes zeta's functional equation at **every** point of the span with
   relative defect `pi L/(T log(T/2 pi)) (1 + o(1))`, and no translate other than the near-identity ones does better. [Correction entered 2026-11-19 by lane c18-repair-owed-record-r17-open-device-nodes (register campaign/CORRECTIONS_R16.md row 3; second referee push/c16-referee-r15-j1prime-u8-screening): the preceding statement is false as written. Corrected: "the reflected translate alpha = -2c has defect (L + 2 abs(delta))^2/(8T), abs(delta) <= pi/(2 log(T/2 pi)) depending on T; it is better than the k = 1 translate when (L + 2 abs(delta))^2 < 8 pi L/log(T/2 pi), which holds for every origin if L < 8 pi/log(T/2 pi) - 2 pi/log(T/2 pi) (1 + o(1)) and for no origin if L > 8 pi/log(T/2 pi). For a fixed number of unit windows K_tr = max(eta T log(T/2 pi)/pi, sqrt(8 eta T))(1 + O(1/log T)); the second term is an upper bound for the reflection branch. Among translates with abs(alpha) <= T/2 no other does better." (Form after E1 of the referee of the referee lane; the first replacement, defect L^2/(8T), is not exact and is not to be used. Map row S12b.)] So the
   largest number of contiguous unit windows passed at tolerance eta is
   `K_tr(T, eta) = eta T log(T/2 pi)/pi (1 + o(1))`, for any number and any placement of windows inside the span.
   At fixed eta this is `T^(1 - o(1))`: it exceeds `T^a` for every `a < 1`, and exceeds `sqrt(T)/log T` from
   `T ~ (pi/eta)^2/log^4 T` on (eta = 1e-6: from T about 1e8).
2. (MEASURED.) At the tolerance and heights of the assigned test the translate is a weak control: `K_tr = 0, 0, 3` at
   `T = 1e4, 1e5, 1e6`, eta = 1e-6 (formula 0.02, 0.31, 3.8), against `sqrt(T)/log T = 10.9, 27.5, 72.4`. The control that
   passes there is the free-prime unimodular Euler product of round 3 (class U) with a simple off-line zero of the model
   function: largest K passed at 1e-6 on contiguous unit windows = `0, 0, 0` (T = 1e4), `16, 32, 16` (T = 1e5),
   `128` for all three seeds (T = 1e6; one seed continued on the server gives 2.0e-6 at K = 256, K = 512 not completed). The crossover follows the count
   `r(K) = 24 + 0.36 K` real conditions (independent of T) against `pi(N)` free primes, `N = 3.2 sqrt(T/2 pi)`: contiguous
   windows are about 80 times cheaper for the control than the spread windows of round 3 (30 conditions each).
3. (PROVED identity, MEASURED zeros.) The finite combination `F = (zeta(s) -+ zeta(s + i alpha))/2` has no Euler product,
   satisfies zeta's functional equation on the whole span with absolute defect `|zeta(s + i alpha)| |sin(Psi/2)|`, and has
   zeros off the line inside the span (examples: `0.8947 + 10084.778 i`, `0.8474 + 100306.457 i`, `0.6214 + 1003003.295 i`;
   winding number 1 at 48 digits). It is the window-local analogue of Davenport-Heilbronn and fails at the same place
   (multiplicativity, an identity).
4. (PROVED, Lemma 4.) The additive twin `zeta + D` (D a Dirichlet polynomial small on the span) with a zero at distance
   delta from the line needs `sup |D(1/2 + it)| >= (|zeta(s0)| - eta) pi L/(4 delta)` outside the span. This is a
   two-constants (Poisson) statement of identification type; it uses no multiplicativity and leaves no one-sided statement.
   The literal interpolation twin `zeta + c L(chi_-4) L(chi_5)` fails the functional-equation phase at K = 1.
5. Rigidity threshold: for the translate family it is a statement about the span, `L/T >= eta log(T/2 pi)/pi`, not about K.
   Beyond every measured crossover the conclusion is "F = zeta on the window" (identification, as in row S12). No inequality
   of the kind required for outcome (b) appeared.

Requirement flags: R1 false, R2 false, R3 false, R4 false (section 8). Score unchanged.

## 0. Plan (as executed) and what is new

Question (assignment): for K windows of length about 1 near height T, each reading the functional-equation phase with Euler
data up to P, what is the largest `K(T)` for which a control without the functional equation at all heights passes every
window condition to the stated precision?

Against the sources. Row S12 and `c3-multiwindow-converse-defect` have: Lemma B (translates pass any fixed number of windows
above a height `T_0(m, H, eta)`), the heuristic `m_translate ~ log(T log T/H)/log(2 pi/eta)` for windows at heights with
ratios 1.37 to 4.83, and a free-prime crossover `m* ~ pi(N)/30` for windows spread over `[T/2, T]` or `[100, T]`. They have
no case with windows close together. New here: (i) the exact span law for translates when the windows are near one height,
with its converse; (ii) the count for the strong Euler reading (local factors at `p <= P` matched to eps); (iii) the
free-prime family on contiguous windows (rank law, crossover, three seeds, frozen small primes); (iv) a non-multiplicative
combination with the window functional equation and explicit off-line zeros; (v) the Poisson bound for additive twins.

Steps: first lemma (section 2, counts M for each family); decisive test (sections 3 to 5); controls (section 6).

## 1. Definitions

`theta` is the Riemann-Siegel theta function, `chi(s) = pi^(s - 1/2) Gamma((1-s)/2)/Gamma(s/2)`, `chi(1/2 + it) = e^(-2 i theta(t))`.
Window test for a function F at `s = 1/2 + it`: `|F(s) - chi(s) conj(F(s))| <= eta |F(s)|` for all t in the window
(for the model functions of section 4 the test is the X-independence of the smoothed approximate functional equation, as in
round 3). Euler data, two readings:
- weak: F has an Euler product with unimodular local parameters (class U); no value of a local factor is compared;
- strong(P, eps): in addition `|a(p) - 1| <= eps` for `p <= P` (local factors at small primes equal to zeta's to eps).

`Psi(t, alpha) = 2 theta(t + alpha) - 2 theta(t)`. CLASSICAL: `2 theta'(x) = log(x/2 pi) + O(x^-2)`, hence
`d Psi/dt = log(1 + alpha/t) + O(|alpha| t^-3)` and `Psi(t, alpha) = alpha log(t/2 pi) + alpha^2/(2t) + O(alpha^3 t^-2 + alpha t^-2)`.

## 2. First lemma: parameters against conditions

### Lemma 1 (span law for translates). PROVED to leading order.

Identity (round 3, re-checked at 48 digits, `audit.py`: `|lhs - rhs| <= 6e-43` at 12 points): for real alpha and `s = 1/2 + it`,
`zeta(s + i alpha) - chi(s) conj(zeta(s + i alpha)) = zeta(s + i alpha)(1 - e^(i Psi(t, alpha)))`; relative defect `2 |sin(Psi/2)|`.

Let `a >= 100`, `0 < L <= a/2`, `b = a + L`, `0 < eta < 1`, `x = 2 arcsin(eta/2)`.

(a) Existence. Let `alpha_1 > 0` solve `Psi(a, alpha) + Psi(b, alpha) = 4 pi` (it exists: the left side is continuous and
increasing in alpha, 0 at 0; `alpha_1 = 2 pi/log(c/2 pi) (1 + o(1))`, c the midpoint). `Psi(., alpha_1)` is increasing on
`[a, b]`, so for t in `[a, b]`: `|Psi(t, alpha_1) - 2 pi| <= (Psi(b) - Psi(a))/2 = (1/2) int_a^b log(1 + alpha_1/t) dt (1 + o(1))
<= alpha_1 L/(2a) (1 + o(1))`. Relative defect on the whole span: at most `pi L/(a log(a/2 pi)) (1 + o(1))`.

(b) Converse for a covered span. Suppose `alpha != 0`, `|alpha| <= a/2` and `2 |sin(Psi(t, alpha)/2)| <= eta` for **every** t
in `[a, b]`. By continuity `Psi(., alpha)` stays within x of one multiple `2 pi k`.
- `k = 0`: `|alpha| log(a/2 pi)(1 + o(1)) <= x`, so `|alpha| <= eta/log(a/2 pi) (1 + o(1))`: the near-identity translates.
  They pass at every height up to a and differ from zeta by `O(eta |zeta'/zeta|/log T)` relative; they are the tolerance
  neighbourhood of zeta (round 3, Lemma C (a)).
- `k != 0`: `|alpha| (log(b/2 pi) + |alpha|/a) >= 2 pi - x`, and `|Psi(b) - Psi(a)| = |int_a^b log(1 + alpha/t) dt| (1 + o(1)) <= 2x`,
  i.e. `L |alpha|/b (1 + o(1)) <= 2x`. Together: `L <= x b log(b/2 pi)/(pi (1 - x/2 pi)) (1 + o(1))`.

So for contiguous unit windows `[a + j, a + j + 1]`, `j < K`: `K_tr(a, eta) = eta a log(a/2 pi)/pi (1 + o(1))`.

(c) Placement inside the span is irrelevant: any K windows inside `[a, b]` are passed with the defect of the span
(MEASURED, `translate_k.py` part 2: span 64, K = 2 .. 64 random positions, defect 2.708e-3, 2.071e-4, 1.673e-5 at
T = 1e4, 1e5, 1e6 for every K). If the windows leave gaps longer than `2 pi T/(|alpha| )` the phase may wrap between them
and larger alpha become admissible: that is the regime of Lemma B of round 3, where the count is
`K - 1 <= log(2 eta T log T/pi)/log(pi/eta)` (heuristic, not proved; 1 at T = 1e6, eta = 1e-6).

**Count M for translates.** The family has one real parameter. The "about 30 reals" a window reads are satisfied
identically by every translate: `zeta(s + i alpha)` has an exact functional equation with the same gamma factor at a shifted
argument, so the window leaves one real condition, the phase `Psi mod 2 pi`, and inside a span one more, the slope
`alpha L/T <= 2 eta`. The rule `30 K < M` does not apply to this family. The number of admissible lattice points is
`eta T log(T/2 pi)/(pi L)`; the translate passes while this is at least 1.

### Lemma 2 (translates under the strong Euler reading). PROVED (existence); MEASURED (size).

Existence: Dirichlet's simultaneous approximation applied to the `n = pi(P) + 1` numbers `log p/2 pi (p <= P)`, `log(a/2 pi)/2 pi`
gives an integer `1 <= alpha <= Q^n`, `Q = ceil(4 pi/min(eta, eps))`, with `|p^(-i alpha) - 1| <= eps` for `p <= P` and, as in
Lemma B of round 3, relative defect at most eta on `[a, a + L]` when `a >= (2.1/eta) Q^n (L + Q^n)`. So for every fixed P, eps,
eta the strong reading is passed on a span `L >= eta a/(2.1 Q^n) - Q^n`: linear in T.

Size (heuristic: the points `alpha_k log p mod 2 pi` on the lattice of the window are equidistributed, each prime costs a
factor `eps/pi`): smallest admissible `alpha_min ~ (2 pi/log(T/2 pi)) (pi/eps)^pi(P)`, span
`L_max ~ 2 eta T/alpha_min = (eta T log(T/2 pi)/pi)(eps/pi)^pi(P)`. Translates survive the strong reading while
`pi(P) log(pi/eps) <= log(eta T log(T/2 pi)/(pi L))`; they are removed by `pi(P)` of the order `log T/log(1/eps)` primes.

Measured (`translate_k.py` part 3, float64 scan of 2e7 lattice points, each hit re-evaluated in mpmath):

| T | P = 2, eps = 0.1 | P = 2, 0.01 | P = 3, 0.1 | P = 3, 0.01 | P = 5, 0.1 | P = 7, 0.1 | P = 11, 0.1 |
|---|---|---|---|---|---|---|---|
| 1e6: alpha_min (heuristic) | 27.3 (16.5) | 63.5 (165) | 480 (518) | 6028 (5.2e4) | 6617 (1.6e4) | none below 2e5 (5.1e5) | none below 2e5 |
| 1e8 | 9.09 (11.9) | 127 (119) | 109 (374) | 3.9e4 (3.7e4) | 5548 (1.2e4) | 1.66e5 (3.7e5) | 5.9e6 (1.2e7) |
| 1e12 | 9.01 (7.65) | 81.6 (76.5) | 109 (240) | 5.1e4 (2.4e4) | 5548 (7.6e3) | 1.66e5 (2.4e5) | 1.2e6 (7.5e6) |
| 1e12: span at eta = 1e-6 | 2.2e5 | 2.5e4 | 1.8e4 | 39 | 362 | 12 | 1.6 |

The heuristic is right within a factor 0.1 to 3.6 (all 36 hits of the scan, T = 1e4 .. 1e12). At T = 1e12, eta = 1e-6, eps = 0.1 the translate passes 2.2e5, 1.8e4, 362
contiguous windows with the local factors at p <= 2, 3, 5 matched (`sqrt(T)/log T` = 3.6e4).

### Count for the free-prime family U (MEASURED rank law; ARGUED reason)

Unknowns: `M = pi(N)` real phases, `N = 3.2 sqrt(T/2 pi)` (31, 79, 206 at T = 1e4, 1e5, 1e6); 3 to 9 of them (the largest
primes) are not read by the test. Conditions of K contiguous unit windows (numerical rank of the defect rows, section 4):
`r(K) = 24 + 0.36 K` (singular values above 1e-5), `30 + 0.43 K` (above 1e-8), the same at T = 1e5 and 1e6:

| K | 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 |
|---|---|---|---|---|---|---|---|---|---|
| phase-Jacobian rank at zeta, T = 1e6 (of 206) | 24 | 26 | 27 | 29 | 32 | 38 | 48 | 69 | 111 |
| T = 1e5 (of 79) | 24 | 26 | 26 | 29 | 32 | 37 | 48 | 68 | 70 |
| T = 1e4 (of 31) | 23 | 24 | 25 | 26 | 26 | 28 | 29 | 30 | 30 |
| non-multiplicative unknowns (of 2N - 2), all T | 25 | 26 | 28 | 30 | 33 | 39 | 50 | 71 | 115 |

Reason (ARGUED): the test reads X in `[1/R, R]`, R = 2; as a function of t the defect has a frequency band of width about
`2 log R`, so a span of length K carries about `2 K log R/pi = 0.44 K` real conditions plus a constant from the smooth
cut-off. The constant 24 to 30 is the "30 reals per window" of rows WT and S12; K separated windows cost 30 K, K adjacent
windows cost `24 + 0.36 K`.

Predicted crossover on contiguous windows: `K_U*(T) = (pi(N) - e - 24)/0.36`, e = 3 to 9: below 0 at T = 1e4, about 128 at
T = 1e5, about 480 at T = 1e6; asymptotically about `7 sqrt(T)/log T` for this test design. For non-multiplicative
sequences: `(2N - 26)/0.34`, about 680, 2300, 7400.

### Count for the twins

- Literal interpolation twin `zeta + c G`, `G = L(s, chi_-4) L(s, chi_5)`: M = 2 real (c complex). On the line its defect is
  `c (G - chi conj G)`, which is of the size of `c G` (G has a degree-two gamma factor and conductor 20). Passing at
  tolerance eta forces `|c G| <~ eta |zeta|` on the window; a zero at `s0` needs `c G(s0) = -zeta(s0)`. Both hold only where
  `|zeta(s0)| <~ eta`. It fails the functional-equation phase at K = 1 (PROVED up to the size statement for
  `G - chi conj G`, which is ARGUED).
- Additive twin `zeta + D`, `D(s) = sum_{n <= N_D} d(n) n^(-s)` with `|D(1/2 + it)| <= eta/2` on the span (then the defect
  of `zeta + D` is at most eta, absolutely): `M = 2 N_D` real, with `N_D` not bounded by the test. Lemma 4 below is the
  necessary condition; the count `2 N_D > L log N_D/pi + O(log 1/eta)` is ARGUED, and the model witnesses of section 4
  (non-multiplicative column) are the measured instance.

### Lemma 4 (additive twin, Poisson bound). PROVED.

Let D be a Dirichlet polynomial, `s0 = 1/2 + delta + i t0`, `I = [t0 - L/2, t0 + L/2]`, `|D(1/2 + it)| <= eta` on I and
`|D(1/2 + it)| <= B` on the line. D is bounded and analytic in `Re s > 1/2`, so it is the Poisson integral of its boundary
values: `|D(s0)| <= eta omega + B (1 - omega)`, `1 - omega = (2/pi) arctan(2 delta/L) <= 4 delta/(pi L)`. If `zeta + D` vanishes at
`s0` then `B >= (|zeta(s0)| - eta) pi L/(4 delta)`. With `|d(n)| <= A`, `B <= 2 A sqrt(N_D)`, so `L <= 8 A delta sqrt(N_D)/(pi (|zeta(s0)| - eta))`.

Reading: the bound says that a function within eta of zeta on a long stretch of the line is within `eta + 4 delta B/(pi L)` of
zeta near it. It holds for any bounded analytic D; it does not use multiplicativity or the functional equation; for
`N_D` free it excludes nothing. It is an identification statement (stability of analytic continuation), not an inequality
that a device could prove for zeta and that a control fails.

## 3. Decisive test, translates (`translate_k.py`, `translate_k.json`, `translate_k.log`)

Exact phase with `mpmath.siegeltheta` at 40 digits; three seeds of the window origin `Ts = T (1 + 0.01 u)`; contiguous unit
windows; minimax alpha over `k = +-1, +-2, +-3`; largest K by bisection (not only powers of 2).

| T | eta = 1e-2 | 1e-3 | 1e-4 | 1e-5 | 1e-6 | formula at 1e-6 | sqrt(T)/log T |
|---|---|---|---|---|---|---|---|
| 1e4 | 239, 240, 238 | 23, 23, 23 | 2, 2, 2 | 0, 0, 0 | 0, 0, 0 | 0.02 | 10.9 |
| 1e5 | 3134, 3152, 3137 | 308, 310, 308 | 30, 30, 30 | 3, 3, 3 | 0, 0, 0 | 0.31 | 27.5 |
| 1e6 | 39229, 39071, 39118 | 3850, 3834, 3839 | 384, 382, 383 | 38, 38, 38 | 3, 3, 3 | 3.8 | 72.4 |
| 1e8 | 5.49e6 | 5.35e5 | 5.33e4 | 5333, 5322, 5325 | 533, 532, 532 | 533 | 543 |
| 1e10 | 7.03e8 | 6.81e7 | 6.79e6 | 6.78e5 | 67835, 68108, 67456 | 6.78e4 | 4343 |
| 1e12 | 8.65e10 | 8.32e9 | 8.29e8 | 8.29e7 | 8.29e6, 8.24e6, 8.23e6 | 8.29e6 | 3.6e4 |

Measured over formula `eta Ts log(Ts/2 pi)/pi`: 1.000 to 1.004 for `eta <= 1e-3`, 1.01 to 1.04 at eta = 1e-2 (second order in
L/T). The entries at 1e8 and above are evaluations of the exact phase, not runs of a window test.

Answer to the test as posed (tolerance 1e-6): the translate passes K = 0, 0, 3 at T = 1e4, 1e5, 1e6, far below
`sqrt(T)/log T`; it overtakes `sqrt(T)/log T` at T about 1e8 and is larger by 16 and 229 times at 1e10 and 1e12.

## 4. Decisive test, free-prime Euler products on contiguous windows (`contig.py`, `contig_T*_s*.jsonl`, `log_T*`)

Model: round 3 unchanged. `A_X(s)[a]` smoothed approximate functional equation; rows `A_X - A_1` at `t = Ts + j/4`,
`0 <= j <= 4K`, X on 13 log-uniform points of `[1/R, R]`, `R = N/(1.6 q) = 2`; `a(n) = exp(i sum v_p(n) theta_p)`, all
primes `p <= N` free. Zero block: `A_1(s0)[a] = 0` and X-independence at `s0 = 0.6 + i(Ts + 0.5)`. Score =
max(sup window defect, |F(s0)|, X-dependence at s0); pass = score at most 1e-6. Search: trust-region least squares with
analytic Jacobian, 7 or 8 starts per K (survivor of K/2, Gaussian perturbations of zeta of size 0.03 to 1, uniform random),
second pass with weight 1000 on the zero block. Off-grid column: defect at t shifted by 1/8 and X replaced by `X^0.93`.

Score (three seeds), with `P = pi(N)`:

| K | T = 1e4 (P = 31) | T = 1e5 (P = 79) | T = 1e6 (P = 206) |
|---|---|---|---|
| 1 | 5.3e-5, 4.6e-5, 2.5e-5 | 1.1e-10, 2.1e-7, 2.0e-9 | 2.9e-9, 2.4e-9, 6.3e-9 |
| 2 | 5.9e-5, 3.7e-5, 6.5e-5 | 5.8e-10, 7.9e-7, 1.0e-8 | 2.1e-8, 1.1e-8, 2.0e-8 |
| 4 | 9.1e-5, 5.2e-5, 1.1e-4 | 2.2e-9, 2.0e-6, 7.7e-8 | 1.0e-8, 5.3e-9, 8.0e-9 |
| 8 | 2.7e-4, 1.7e-4, 1.4e-4 | 1.9e-8, 5.6e-7, 5.6e-9 | 4.4e-8, 1.8e-8, 4.4e-8 |
| 16 | 5.8e-4, 6.2e-4, 5.1e-4 | 2.5e-7, 5.0e-6, 7.3e-8 | 3.8e-9, 4.2e-7, 1.6e-8 |
| 32 | 3.3e-3, 5.0e-3, 2.3e-3 | 8.0e-6, 1.6e-8, 7.5e-6 | 4.3e-9, 1.7e-7, 5.7e-9 |
| 64 | 6.8e-2, 7.5e-2, 2.2e-2 | 3.5e-6, 8.6e-6, 7.2e-6 | 3.1e-7, 3.3e-7, 1.4e-7 |
| 128 | 0.28, 0.26, 0.20 | 6.2e-5, 4.2e-5, 2.3e-4 | 1.8e-8, 4.6e-9, 1.6e-8 |
| 256 | 0.38, 0.57, 0.39 | 0.12, 0.13, 0.16 | 2.0e-6 (seed 0 only, server; off-grid 8.2e-7) |
| 512 | | | not completed (the unit ended during this case; cause not determined, the 8 GB limit is the likely one) |
| largest K passed at 1e-6 | 0, 0, 0 | 16, 32, 16 | 128, 128, 128 (K = 256 run for seed 0 only: 2.0e-6) |
| sqrt(T)/log T | 10.9 | 27.5 | 72.4 |
| predicted `(P - e - 24)/0.36` | below 0 | about 128 | about 480 |

Notes.
- zeta in the same rows: 2e-11 to 8e-11 (1e4), 3e-10 to 4e-10 (1e5), 4e-9 to 5e-9 (1e6), for every K.
- The survivors are not translates: the mean distance `|a(p) p^(i alpha) - 1|`, weighted by `p^(-1/2)`, minimised over
  `|alpha| <= 80`, is 0.45 to 1.09 for every survivor; `theta_2` ranges over (-2.5, 3.1).
- T = 1e5 is not monotone in K for seed 1 (K = 4: 2.0e-6, K = 16: 5.0e-6, K = 32: 1.6e-8): the scores between 1e-6 and 1e-5
  at K = 4 .. 64 are limits of the local search, not evidence of infeasibility. Rank 48 (1e-5) at K = 64 against 79 unknowns.
- Off-grid defect (one or up to eight points per case): the rows that pass on the design grid and stay at or below 1e-6 off
  the grid are T = 1e5: seed 0, K = 1 .. 16 (3e-8 to 8e-7); seed 1, K = 32 (5e-8); seed 2, K = 1, 8, 16 (5e-8 to 9e-7);
  T = 1e6: K = 4, 8 and 128 for all seeds (5e-9 to 4e-7), K = 16, 32, 64 for seeds 0 and 2 (1e-8 to 4e-7). Rows that pass on
  the grid only: T = 1e6, K = 1, 2 (1.1e-6 to 5.1e-6 off grid, all seeds) and seed 1, K = 16, 32, 64 (1.1e-6 to 2.1e-6);
  T = 1e5, seed 1, K = 1, 2, 8 (3.6e-6 to 8.1e-6) and seed 2, K = 2, 4 (1.1e-6, 1.3e-6). The design (13 values of X, 5 points
  of t per unit) under-samples short spans at the 1e-6 level. The largest K in the table is unchanged by this
  (16, 32, 16 and 128, 128, 128 pass off the grid as well).
  Same-session re-evaluation at 24 random (t, X) points with `a(n)` rebuilt by smallest prime factor (`audit.py`):
  T = 1e5 seed 0 K = 16: 1.2e-6; seed 1 K = 32: 3.7e-8; T = 1e6 seed 1 K = 128: 4.4e-9; seed 0 K = 64: 5.1e-7.
- Non-multiplicative sequences (complex `a(n)`, `a(1) = 1`, least-norm correction, same rows and zero block): score
  5e-12 to 2e-9 for every K run (to 256 at T = 1e4 and 1e5, to 128 at T = 1e6), with `max |a(n)|` 1.1 to 1.5, 1.4 to 3.1,
  3.5 to 11.7.

Frozen small primes (strong reading inside the model; `homotopy.py`, continuation in the target value
`F(s0) = (1 - lambda) zeta(s0)`, K = 1, 4, 16; `contig_frozen.py`, direct search):

| T = 1e6 | primes frozen at zeta's value | K = 1 | 4 | 16 | abs zeta(s0) |
|---|---|---|---|---|---|
| seed 0 | none | 1.9e-9 | 2.1e-9 | 4.6e-9 | 2.05 |
| seed 0 | p <= 3, 5, 7, 11 | 2e-9 to 4e-9 | 4e-9 to 8e-9 | 4e-9 to 6e-8 | 2.05 |
| seed 0 | p <= 13 | 0.13 | 0.13 | 0.13 | 2.05 |
| seed 0 | p <= 20 | 0.41 | 0.41 | 0.41 | 2.05 |
| seed 1 | p <= 7 | 3.4e-9 | 6.0e-9 | 6.8e-9 | 0.57 |
| seed 1 | p <= 20 | 2.3e-7 | 8.2e-9 | 7.9e-9 | 0.57 |

With the primes up to 11 (seed 0) or 20 (seed 1) held at zeta's local factors the control still passes; when it fails the
binding quantity is `|F(s0)|` (the free primes do not supply `-zeta(s0)` when `|zeta(s0)|` is 2.05), not the windows. The
direct search with p <= 20 or p <= 100 frozen found nothing at T = 1e5 and 1e6, seed 0 (0.04 to 1.35). No certificate either way.

## 5. Finite combination of translates (`combo.py`, `combo_minus.py`, `audit.py`)

`F_+-(s) = (zeta(s) +- zeta(s + i alpha))/2`, alpha the minimax translate of the span (k = 1). PROVED (from the identity of
Lemma 1): on the line `F - chi conj F = +-(1/2) zeta(s + i alpha)(1 - e^(i Psi))`, so the absolute defect is at most
`(eta_span/2) |zeta(s + i alpha)|` on the whole span. Coefficients `a(n) = (1 +- n^(-i alpha))/2`: not multiplicative
(`|a(4) - a(2)^2|` = 0.03 to 0.08 for the plus sign, 0.44 to 0.56 for the minus sign). With k = 1, `e^(i theta(t)) F_+-(1/2 + it)
= (Z(t) -+ Z(t + alpha))/2 (1 + O(eta))`.

| sign | T | span L | alpha | eta_span | max abs defect on the span | sign changes on the line / mean count for zeta | zeros found with Re s > 1/2 + 1e-4 |
|---|---|---|---|---|---|---|---|
| + | 1e4 | 64 | 0.8515 | 2.7e-3 | 9.1e-3 | 75 / 75.2 | 0 |
| + | 1e5 | 64 | 0.6492 | 2.1e-4 | 1.1e-3 | 98 / 98.6 | 0 |
| + | 1e6 | 32 | 0.5244 | 8.4e-6 | 5.8e-5 | 59 / 61.0 | 1: 0.62143 + 1003003.29508 i |
| - | 1e4 | 64 | 0.8515 | 2.7e-3 | 9.1e-3 | 37 / 75.2 | 6: Re = 1.191, 1.045, 0.938, 0.895, 0.613, 0.599 |
| - | 1e5 | 64 | 0.6492 | 2.1e-4 | 1.1e-3 | 43 / 98.6 | 10: Re = 2.419, 1.008, 0.986, 0.976, 0.932, 0.923, 0.863, 0.847, 0.690, 0.572 |

(MEASURED: Newton roots at 30 digits, `|F| <= 1e-26`; five of them re-solved at 48 digits with winding number 1.0 on a circle
of radius 0.01. The search starts only from extrema of the real function on the line, so the counts are lower bounds.)

Reading: a non-multiplicative function with zeta's gamma factor, conductor 1, the functional equation to the span tolerance
at every point of a span of length up to `eta T log T/pi`, and zeros off the line inside the span. A device that reads only
the functional equation in windows near one height is passed by it at every K below `K_tr`; it is removed only by the Euler
data (multiplicativity defect, an identity), as Davenport-Heilbronn is. The plus sign (difference of Z at one mean spacing)
keeps nearly all zeros on the line; the minus sign loses about half of them.

## 6. Controls

| Control | passes K windows near T | first step that fails | label |
|---|---|---|---|
| zeta | all K (model residual 2e-11 to 5e-9) | none | MEASURED |
| translate `zeta(s + i alpha)`, weak Euler reading | every K inside a span `L <= eta T log(T/2 pi)/pi`; 0, 0, 3 at T = 1e4, 1e5, 1e6, eta = 1e-6 | the slope `alpha L/T` of the phase across the span; no step uniformly in T at fixed eta | PROVED, MEASURED |
| translate, strong reading (P, eps) | span reduced by `(eps/pi)^pi(P)` | simultaneous approximation of `alpha log p`; removed when `pi(P) log(pi/eps) > log(eta T log T/(pi L))` | PROVED (existence), MEASURED |
| free-prime U with an off-line model zero | K <= 16 to 32 (T = 1e5), 128 (T = 1e6; 2.0e-6 at 256); none at T = 1e4 | parameter count `24 + 0.36 K` against `pi(N)` | MEASURED |
| free-prime U, primes <= 11 (or 20) frozen | K = 1, 4, 16 at T = 1e6 | size of `zeta(s0)` against the free primes | MEASURED |
| finite combination `(zeta(s) -+ zeta(s + i alpha))/2` | functional equation: as the translate; has off-line zeros in the span | Euler data at K = 1 (`a(4) != a(2)^2`), an identity | PROVED, MEASURED |
| Davenport-Heilbronn (period-5 coefficients) | none: window defect 0.41 to 1.37 at K = 1 | Euler data at K = 1 (`|a(4) - a(2)^2| = |a(6) - a(2) a(3)|` = 1.0807) and the conductor | MEASURED; consistent with row S12 |
| literal interpolation twin `zeta + c L(chi_-4) L(chi_5)` | none | functional-equation phase at K = 1 | ARGUED |
| additive twin `zeta + D`, non-multiplicative model sequences | every K run (to 256) | Euler data (not multiplicative); otherwise Lemma 4, which needs `sup |D| >= pi L |zeta(s0)|/(4 delta)` | PROVED (bound), MEASURED |

Not formulable in this test (no ordinary Dirichlet series of degree one with zeta's gamma factor): backward heat,
`zeta(s+a) zeta(s-a)`, T-NR, Beurling, phase-rotated transfer operator, theta^w (as in round 3). Sign-twisted primes and the
unimodular twist are the class U of section 4.

## 7. Answer to the assignment

`K(T)` by family, for unit windows near height T at tolerance eta:

| family | free real parameters M | conditions it actually meets | largest K |
|---|---|---|---|
| translate, weak reading | 1 (alpha on a lattice of step `2 pi/log(T/2 pi)`) | 1 phase + 1 slope per span | `eta T log(T/2 pi)/pi` contiguous; `1 + log(2 eta T log T/pi)/log(pi/eta)` for separated generic heights (heuristic) |
| translate, strong reading | 1 | `pi(P)` more phases | `(eta T log(T/2 pi)/pi)(eps/pi)^pi(P)` contiguous |
| free-prime U | `pi(3.2 sqrt(T/2 pi)) - e` | `24 + 0.36 K` contiguous; 30 K separated (round 3) | about `7 sqrt(T)/log T` contiguous; `pi(N)/30` separated |
| additive twin / non-multiplicative | `2 N_D`, `N_D` free | `0.34 K + 25` in the model | no bound from the test; Lemma 4 bounds the sup norm only |
| literal interpolation twin | 2 | fails the phase | 0 |

Outcome (a): at fixed tolerance a control exists at every `K = T^a`, `a < 1` (translate, PROVED for windows inside one span),
and in the measured range at tolerance 1e-6 the free-prime family passes K = 128, above `sqrt(T)/log T = 72.4`, at T = 1e6 on contiguous
windows (at T = 1e5 it passes 16 to 32, of the order of `sqrt(T)/log T = 27.5`, with residuals below 1e-5 to K = 64). Class U5 is therefore closed for devices whose window heights lie in a span `L <= eta T log(T/2 pi)/pi`, for the weak
Euler reading and for the strong reading with `pi(P) <= log(eta T log T/(pi L))/log(pi/eps)`.

Outcome (b) did not occur: no rigidity threshold below `sqrt(T)/log T` was proved. What a device must do to leave the closed
part: compare heights whose ratio differs from 1 by more than `eta log(T/2 pi)/pi` (so that no translate survives), and read
more than `pi(N)` conditions of the free primes; past that point every statement found is "F = zeta on the window" (S12).

Correction to STRATEGY 4.0 (b) as worded ("rigidity needs of the order of sqrt(T)/log T conditions"): the count is right for
the free-prime family on separated windows; for windows near one height the number of conditions is `24 + 0.36 K`, and
against translates no number of windows inside a span of relative length `eta log T/pi` suffices.

Proposed map row (not applied; this lane writes only here): "S12b. Window functional-equation rigidity with a number of
windows growing with T, heights inside one span `[T, T + L]`. Translate `zeta(s + i alpha)`, `alpha ~ 2 pi/log(T/2 pi)`: relative
defect `pi L/(T log(T/2 pi))` on the whole span, sharp (PROVED to leading order; measured ratio 1.000 to 1.004). Largest K at
tolerance eta: `eta T log(T/2 pi)/pi`. Free-prime U with an off-line model zero on contiguous windows: conditions
`24 + 0.36 K`, passes K = 128 at T = 1e6 and reaches 2.0e-6 at K = 256 (MEASURED, float64, no certificate). `(zeta(s) - zeta(s + i alpha))/2`: same defect,
non-multiplicative, off-line zeros in the span (MEASURED). Controls: WT, U, finite combination. One referee owed."

## 8. Requirement flags

- R1 (multiplicativity essential): **false**. No statement here uses it. Lemma 1 and Lemma 4 hold for non-multiplicative
  functions; multiplicativity enters only as the parameter count `pi(N)` against `2N`, and as the identity that removes the
  combination and Davenport-Heilbronn.
- R2 (uniform in height, every window): **false**. The only uniform statements are the obstruction (Lemma 1: the admissible
  span grows like `T log T`) and Lemma 4 (identification).
- R3 (every control fails at a named structural step): **false**. The translate passes every step inside the span; the
  free-prime family passes below the crossover; the non-multiplicative sequences pass the windows at every K run.
- R4 (reaches the critical line): **false**. All statements are about a finite number of windows at finite height in a
  finite model or about explicit controls.

## 9. Three weakest steps

1. Section 4 is a float64 local search in the finite model of round 3 (smoothed approximate functional equation, R = 2,
   13 values of X, step 1/4 in t). The "zero" is a zero of the model function `A_1[a]`, not of a continued Dirichlet series.
   Fourteen of the passing rows hold on the design grid only (off-grid 1.1e-6 to 8.1e-6); T = 1e5 is not monotone in K;
   no infeasibility certificate exists past any crossover; the crossover at T = 1e6 is not located: 128 passes for three seeds, 256 gives 2.0e-6 for one seed, 512 was not completed. The rank law
   `24 + 0.36 K` is measured at three heights and argued, not proved, and its slope depends on the X-range of the test.
2. Lemma 1 (b) is a statement about a span that is covered at every point. For windows with gaps the phase may wrap and the
   bound on K is the heuristic of round 3, not a proof. The `(1 + o(1))` factors are not made explicit (measured: within
   0.5 % for `L/T <= 1e-2`, 4 % at `L/T` = 0.09). Lemma 2's size statement rests on an equidistribution heuristic checked for
   `P <= 11` only (factor 0.1 to 3.6).
3. Section 5: the off-line zeros of the combination are instances at three heights; no theorem about their density was
   opened (joint universality of shifts is recalled, not read). The statement about the literal interpolation twin is
   argued (size of `G - chi conj G`), not computed. The frozen-prime table has two seeds and no certificate; the failure at
   p <= 13, seed 0 may be a limit of the search.

## 10. Files

`translate_k.py/.json/.log` (section 3, Lemma 2 table); `contig.py`, `run_contig.sh`, `contig_T*_s*.jsonl`, `log_T*_s*.txt`,
`surv_T*_s*_K*.npy` (section 4); server run: same script, seed 0, `python contig.py 1e6 0 512`, records in `server/` (the server solutions for K <= 128 differ from the local ones; scores 2.7e-9 to 2.4e-8); `contig_frozen.py`, `frozen*_T*.jsonl`, `homotopy.py`, `homotopy_T*.jsonl`, `log_hom_*`
(frozen primes); `combo.py`, `combo_minus.py`, `combo*.json` (section 5); `audit.py`, `audit.json` (same-session checks);
`summ.py` (table extraction); `server/` (seed 0 to K = 256 at T = 1e6; unit stopped, no unit left running); `REFEREE.md`.
