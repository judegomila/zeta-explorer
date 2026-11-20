# s7-linear-cotangent-additive-twist-shear-bridge: the linear Vasyunin sum V_F against the controls

Date 2026-11-20. Screening lane, four combinations. Grades: PROVED / CLASSICAL / MEASURED / NOT RUN.

## Verdict

Four combinations tested, no survivor.

- Combination 1 (reciprocity defect w_F on the Farey grid). The statistic separates functions at
  denominators 2 and 3, far below any zero height, but it separates the wrong way: L(chi_-4), L(chi_5),
  Davenport-Heilbronn, the unimodular twist, E_a and the integer form of T-NR all fail, and the centred
  form of T-NR (off-line zeros from height 0.68) passes by an identity. The mechanism is a jump law:
  w_F jumps at p/q by -(2/pi)(J_F(p) - J_F(q))/q with J_F(m) = sum_j a_F(mj)/j, a coefficient statement
  at s = 1. The statistic reads whether the coefficients of F agree with those of zeta along multiples,
  not where the zeros are.
- Combination 2 (cancellation ratio on the inverse line). Every function has a stable ratio with its own
  constant. Davenport-Heilbronn lies inside zeta's 0.4% band; the two comparison L-functions lie outside.
  The leaf is a value at s = 1 of the additive twist.
- Combination 3 (reflection-odd twisted moment). The reflection identity holds for every object with a
  functional equation to the precision of the computation (1e-11 to 1e-7), Davenport-Heilbronn included.
  The off-diagonal remainders of zeta, L(chi_-4), L(chi_5) and Davenport-Heilbronn have the same size and
  the same decay in T; Davenport-Heilbronn's is the smallest of the four at theta = 1/4. Mean-value
  statistic.
- Combination 4 (Laurent data at s = 1 from zeros). The explicit formula is linear in the zeros, so the
  difference between "all zeros" and "on-line zeros only" is the off-line pair term by definition. It was
  computed and equals that term to all digits; no earlier departure exists or can exist.

RH content: none. No bound moves.

## Sizes reached and where the runs were made

| item | size | machine |
|---|---|---|
| T1 zeta, L(chi_-4), DH, L(chi_5), T-NR (two q), all reduced fractions | see table T1 (K = 30000: 273,571,773 fractions; K = 16000: 77,816,347) | server units rh-s7lin-cot-1120154215 (killed by its memory limit in the analysis step; rerun as rh-s7lin-cot2-1120155712 with a memory-mapped analysis, same K), 7 cores, 12 GB; local fallback at K = 16000, 1 core, 8 GB cap |
| T1 Liouville, U, E_a | K = 2000 (1,216,587 fractions) | server unit rh-s7lin-gen-1120154645, 1 core |
| T2 leaves | see table T2 | server (same units), local fallback b <= 100003 |
| T3 zeta, L(chi_-4), L(chi_5), DH | full range [T, 2T] at T = 1e5, 1e6, 1e7; T = 1e8: see table T3 | server GPU 1, float64, units rh-s7lin-t3-1120155003, -t3b-, -t3c- (1 core, pool limit 16 GB) |
| T4 | zeta 1,000,000 zeros; L(chi_-4) 3,615; DH 1,861 + 84 pairs; T-NR 999,508 + 440,712 pairs; E_a 1,000,000 quartets | local, 1 core |

The server had load average 90 to 110 on 40 cores; the 7-core unit received 2 to 3 cores. N = infinity in
T1 and T2 (closed forms), which replaces the N = 1e9 smooth cutoff of the task: the cutoff is not needed
because every sum over n is evaluated in closed form per residue class.

The first server unit was killed by its 12 GB limit while the analysis script loaded the Farey arrays
(13 GB planned, not printed in advance: an error of this lane). The analysis was changed to memory-mapped
arrays (planned 2.2 GB) and rerun; the limit was not raised. One local check (centred T-NR at q = 1000003,
modulus 4.3e7) exceeded the 8 GB local cap and was reduced.

## 0. Shared definitions and four statements

a_F(n) are the Dirichlet coefficients, S_F(x) = sum_n a_F(n) sin(2 pi n x)/(pi n),
V_F(h,k) = sum_{m<k} S_F(mh/k) cot(pi m/k), w_F(h,k) = (V_F(h,k) + V_F(k,h))/k. For zeta,
S(x) = 1/2 - {x} and V_F = -V with V Vasyunin's sum. ((y)) = {y} - 1/2 (0 at integers).

**Statement 1 (PROVED, finite identity).** sum_{m=1}^{k-1} sin(2 pi m r/k) cot(pi m/k) = k - 2r for
0 < r < k, hence for integer frequencies

    V_F(h,k) = -(2k/pi) sum_n a_F(n) ((nh/k))/n = -(2k/pi) g_F(h/k),   g_F(x) = sum_n a_F(n) ((nx))/n,

and V_F(h,k) = -(2/k) sum_{1<=r<k/2} (rh mod k - k/2) C_k[r] with C_k[r] = cot(pi r/k) for zeta and
C_k[r] = (k/pi)(A_k(r) - A_k(k-r)), A_k(r) = sum_{n = r mod k} a_F(n)/n (digamma or Hurwitz values) in
general. V_F is linear in the coefficients; it is the additive twist of F at s = 1 paired with a
sawtooth. Checked: table route against the definition with closed-form S_F (3e-13), against a brute
smooth sum with 1.2e6 terms (1e-10 relative for zeta, DH, U; 1e-7 for E_a), C against numpy (1.5e-14).

**Statement 2 (line formula; CLASSICAL for zeta, formal contour shift plus MEASURED for the others).**
For real coefficients, with X_F(t) = zeta(s) conj(F(s))/s at s = 1/2 + it,

    w_F(x) = -(2/pi) E_F(x) + (4/pi^2) x^{1/2} int_0^inf Re X_F(t) cos(t log x) dt,
    E_F(x) = (1+x)(-c_F/2 + (r_F/2) log 2pi) + (r_F/2)(1-x) log x,

r_F the residue of F at 1 and c_F its constant term there (F(1) when F is entire). For F = zeta,
Re X = |zeta|^2/(2|s|^2) and this is Vasyunin's formula. So w_F is the cross Gram form of the
Nyman-Beurling vectors of zeta and of F: it depends on F through its values on the critical line, with
phase, paired against zeta. For F other than zeta the integrand decays like Im(zeta conj F)/t and the
integral converges only conditionally; this is the source of the jumps below. Measured: the symbol
recovered from the Farey table by a cosine sum (table T1-symbol) agrees with mpmath values of Re X_F to
3 digits for zeta and to 0.02..0.15 absolute for the functions with jumps. Re X_F vanishes at the zeros
of zeta for every F (last column), not at the zeros of F.

**Statement 3 (jump law; derived termwise, MEASURED to 5 digits).** If J_F(m) = sum_j a_F(mj)/j
converges, then at a reduced fraction p/q

    w_F(p/q + 0) - w_F(p/q - 0) = -(2/pi) (J_F(p) - J_F(q))/q.

For a character, J(m) = chi(m) L(1,chi): for chi_-4 the jump is -(chi(p) - chi(q))/(2q) (1/3 at x = 1/3).
For zeta the two divergent sums cancel and w is continuous (classical). For Liouville J = 0 and
g(x) = -(1/pi) sum_m sin(2 pi m^2 x)/m^2 (Riemann's function; from lambda * 1 = square indicator), so
w is continuous with Holder exponent 1/2 at generic points. For U = zeta(s+i), J(m) = m^{-i} zeta(1+i).

**Statement 4 (T-NR, two normalisations; PROVED, algebra).**
(a) Integer form G(s) = zeta(s)(1 + c q^{1/2} q^{-s} + q q^{-2s}) (same zeros as T-NR, a single modified
Euler factor at q): a(n) = 1 + c q^{1/2} [q | n] + q [q^2 | n], and
V_G(h,k) = V(h,k) + (c/q^{1/2}) V(qh mod k, k) + (1/q) V(q^2 h mod k, k). For k < q the coefficients read
are those of zeta up to a relative change c/q^{1/2} (2.2e-3 at q = 1000003).
(b) Centred form F(s) = zeta(s)(q^{s-1/2} + c + q^{1/2-s}) with frequencies n/q, n, nq, V_F defined by
-(2k/pi) g_F(h/k): w_F(x) = c w(x) + q^{-1/2} w(qx) + q^{1/2} w(x/q) with w zeta's function. This is
continuous because w is. Checked across 1/2, 1/3, 2/5, 3/7 with neighbours at distance 2e-2 to 5e-5
(q = 101) and 1e-1 to 6e-3 (q = 1000003): the difference across the rational is proportional to the gap
for zeta and for centred T-NR (`out/nr_centered.txt`).

## 1. Reciprocity defect on the Farey grid (capture-ratio-psd-slope + rm-bc-reciprocity-wobble + rm-kappa-smooth-open)

Finite consequence tested. psi_F(x) = w_F(x) + (2/pi) E_F(x) on every reduced fraction with denominator
at most K. Statistics: (i) L2 structure function over Farey-neighbour lags and its exponent; (ii) jumps
at p/q, q <= 13, from 100 neighbours on each side; (iii) cusp wobble, the node's statistic: standard
deviation of psi_F in the band |x/x0 - 1| < 0.02, denominators at least 200, after a local linear fit,
divided by x0^2 (source: 0.026 for zeta); (iv) residual RMS along Gauss-map orbits of 200,000 random
fractions with K/2 < k <= K after a global smooth fit; (v) K_F(u) sampled at u = 0.05 m from the nearest
Farey points, the skew-Toeplitz matrix (u_i - u_j) K_F(|u_i - u_j|), its norm, and the capture ratio
norm / sup-slope of its symbol. Survival would be: zeta in a fixed range at every K, the comparison
L-functions in the same range, a control outside it on denominators prime to its conductor.

Validation: the zeta row reproduces the node's value (sd/x0^2 between 0.018 and 0.030 for x0 from 0.2 to
0.001; node: 0.026) and the symbol |zeta(1/2+i xi)|^2/(2(1/4+xi^2)) to 3 digits.

| function | K (machine) | fractions used | L2 Holder exponent, gaps 1e-7..1e-2 | largest jump at denominators <= 13 | jump-law error | cusp wobble sd/x0^2 at x0 = 0.1, 0.01, 0.001 | orbit residual RMS, steps 0 and 3 | capture ratio (xi*) |
|---|---|---|---|---|---|---|---|---|
| zeta | 30000 (server) | 273571773 | 0.996 | 2.08e-05 | continuous (law predicts 0) | 0.0244, 0.0263, 0.0301 | 0.0038, 0.0039 | 0.512 (0.30) |
| L(chi_-4) | 30000 (server) | 182377398 | 0.501 | 3.33e-01 | 2.7e-05 | 1.41, 41.2, 390 | 0.1019, 0.0983 | 0.627 (0.34) |
| L(chi_5) | 16000 (local) | 64844191 | 0.510 | 2.74e-01 | 8.6e-06 | 0.85, 14.7, 351 | 0.0809, 0.0801 | 0.560 (0.32) |
| Davenport-Heilbronn | 16000 (local) | 64844191 | 0.514 | 2.94e-01 | 7.7e-05 | 4.35, 49.5, 426 | 0.0856, 0.0821 | 0.617 (0.32) |
| T-NR q=101, integer form | NOT RUN | | | | | | | |
| T-NR q=1000003, integer form | NOT RUN | | | | | | | |
| Liouville (sign twist) | 2000 (server) | 1216587 | 0.659 | 2.03e-02 | no finite law | 0.469, 14.3, n/a | 0.0671, 0.0674 | 0.322 (0.30) |
| U = zeta(s+i), real part | 2000 (server) | 1216587 | 0.631 | 1.40e-01 | no finite law | 5.12, 20.2, n/a | 0.0526, 0.0469 | 0.555 (0.48) |
| U = zeta(s+i), imaginary part | 2000 (server) | 1216587 | 0.649 | 1.93e-01 | no finite law | 2.68, 28.8, n/a | 0.0425, 0.0395 | 0.643 (0.42) |
| E_a, a = 1/4 | 2000 (server) | 1216587 | 0.453 | 6.56e+00 | no finite law | 47.3, 691, n/a | 0.3588, 0.2307 | 0.368 (0.32) |

T1-symbol. Recovered Re X_F(xi) / mpmath value:

| function | K | xi = 0 | 1 | 2 | 5 | 8 | 10 | 14.1347 |
|---|---|---|---|---|---|---|---|---|
| zeta | 30000 | 4.2665 / 4.2653 | 0.2175 / 0.2169 | 0.0344 / 0.0343 | 0.0114 / 0.0108 | 0.0135 / 0.0130 | 0.0125 / 0.0120 | 0.0001 / 0.0000 |
| chi4 | 30000 | -1.9627 / -1.9501 | -0.4763 / -0.5078 | -0.2027 / -0.2002 | 0.1697 / 0.1504 | 0.0579 / 0.0392 | 0.0992 / 0.0684 | -0.0578 / -0.0000 |
| chi5 | 16000 | -0.6150 / -0.6769 | -0.3518 / -0.3474 | -0.2798 / -0.2915 | 0.2427 / 0.2608 | 0.0833 / 0.0558 | -0.0305 / -0.0398 | -0.0285 / -0.0000 |
| dh | 16000 | -2.2660 / -2.4107 | -0.6096 / -0.5879 | -0.1508 / -0.1647 | -0.0342 / 0.0176 | 0.2083 / 0.2259 | -0.1639 / -0.1533 | -0.0128 / -0.0000 |

Jump law:

| function | K | measured jump (predicted) at p/q |
|---|---|---|
| chi4 | 30000 | 1/3: -0.33332 (-0.33333); 1/5: 0.00001 (-0.00000); 3/5: 0.19999 (0.20000); 1/7: -0.14283 (-0.14286); 3/7: 0.00001 (-0.00000); 5/7: -0.14285 (-0.14286); 1/9: 0.00001 (-0.00000); 5/9: -0.00001 (-0.00000) |
| chi5 | 16000 | 1/2: -0.27402 (-0.27401); 1/3: -0.18268 (-0.18267); 2/3: -0.00001 (-0.00000); 1/4: -0.00000 (-0.00000); 3/4: 0.13700 (0.13700); 1/6: -0.00000 (-0.00000); 1/7: -0.07829 (-0.07829); 2/7: -0.00000 (-0.00000) |
| dh | 16000 | 1/2: -0.28051 (-0.28052); 1/3: -0.20461 (-0.20464); 2/3: -0.01763 (-0.01762); 1/4: -0.29367 (-0.29374); 3/4: -0.14024 (-0.14026); 1/6: 0.00003 (-0.00000); 1/7: -0.08010 (-0.08015); 2/7: 0.00001 (-0.00000) |

Reading.
- zeta: exponent 1.00, no jumps (the apparent jump shrinks from 3e-4 at K = 2000 to 2e-5 at K = 30000),
  wobble sd/x0^2 bounded.
- L(chi_-4), L(chi_5): exponent near 0.5, jumps of size 0.33 and 0.27 at denominators 2 and 3 that match
  the law to 5 digits, wobble sd/x0^2 growing like 1/x0. The positive comparisons fail.
- Davenport-Heilbronn: same as the characters, with J_DH(m) = -(1/5) sum_r c(mr) psi(r/5).
- T-NR integer form: fails (no finite jumps; logarithmic singularities, because the symmetric pairing of
  the terms with [q | n] is broken). T-NR centred form: passes by Statement 4(b).
- Liouville: no jumps of fixed size, exponent 0.66, wobble growing: Riemann's function.
- U and E_a: fail (jumps; for E_a power singularities, psi between -3.6 and 3.1).
- Capture ratio: between 0.32 and 0.65 for all functions, zeta in the middle; it compares a finite
  section with its own truncated symbol and holds no information on F beyond the low-frequency part of
  Re X_F.

How the object enters: through its coefficients at s = 1 (the jump law) and through F(1/2+it) paired with
zeta (the symbol). Not through its zeros. Onset against zero heights: Davenport-Heilbronn fails at
denominator 2; its first off-line zero is at height 85.70. This is not a survivor, because the failure is
shared by both comparison L-functions (no off-line zeros known) and is absent for centred T-NR (off-line
zeros at every height from 0.68). The property tested is "a_F(pj) and a_F(qj) have the same logarithmic
mean for all p, q", which is true for the constant sequence and for sequences with mean-zero twists
summing to zero.

Classification: CLOSED. Coefficient statement at s = 1; comparison L-functions fail; a control with
off-line zeros passes.

## 2. Cancellation ratio on the inverse line (truncated-kinetic-mertens-law + rm-cot-cancellation-ratio + rm-inverse-line-detection-identity)

Finite consequence tested. For prime b, v_a = V_F(b, a) for every a < b prime to b (this is -c_0(h_a/a),
h_a = b^{-1} mod a, for zeta), S_F(b) = sum v_a, A_F(b) = sum |v_a|, ratio |S|/A; M2w and the split
M2 = DIAG + OFFDIAG with DIAG = sum_a a E_h[(V_F(h,a)/a)^2] from the table of combination 1. Survival
would be: zeta inside the node's band 0.5397 +- 0.4%, comparison L-functions with a ratio of their own
that is stable, a control whose ratio or OFFDIAG/DIAG drifts with b.

Validation: zeta at b = 4001 and 24001 gives 0.53946 and 0.54048 (node: 0.5397 within 0.4%).

| function | ratio abs(S)/A at each prime b reached | A/b^2 at the largest b | largest b (machine) |
|---|---|---|---|
| zeta | 4001: 0.53946, 24001: 0.54048, 100003: 0.53995 | 0.147345 | 100003 (server) |
| nr:1000003:2.2 | 4001: 0.53951, 24001: 0.54047, 100003: 0.53992 | 0.147345 | 100003 (server) |
| nr:101:2.2 | 4001: 0.53420, 24001: 0.52620, 100003: 0.52632 | 0.150110 | 100003 (server) |
| chi4 | 4001: 0.50723, 24001: 0.50649, 100003: 0.50607 | 0.082542 | 100003 (server) |
| chi5 | 4001: 0.44058, 24001: 0.44156, 100003: 0.44135 | 0.070685 | 100003 (server) |
| dh | 4001: 0.54116, 24001: 0.53994, 100003: 0.53970 | 0.085312 | 100003 (server) |
| liou | 4001: 0.43942, 24001: 0.43942 | 0.065215 | 24001 (server) |
| U_re | 4001: 0.53370 | 0.100423 | 4001 (server) |
| U_im | 4001: 0.38858 | 0.058117 | 4001 (server) |
| U_abs | 4001: 0.46114 | 0.126119 | 4001 (server) |

OFFDIAG/DIAG (b at most the table size):

NOT RUN (the server table step did not finish).

Reading. Every ratio is stable in b to 3 digits. zeta stays in the band at every b reached. T-NR at
q = 1000003 agrees with zeta to 4 digits for b < q (coefficient identity: the changed coefficients enter
with relative weight 2.2e-3). T-NR at q = 101 settles at 0.526, L(chi_-4) at 0.506, L(chi_5) at 0.441,
Liouville at 0.4394, all outside the band; Davenport-Heilbronn settles at 0.540, inside the band. No
ratio drifts.

How the object enters: v_a is a value at s = 1 of the additive twist of F (for prime a, a combination of
L(1, chi) L_F(1, conj chi) over odd characters mod a). Not through zeros, not through the line.

Classification: CLOSED. Constants at s = 1; the control with off-line zeros lies inside zeta's band and
the comparison L-functions lie outside.

## 3. Reflection-odd twisted moment (zv-shear-reflection-parity + twist-modulus-reciprocity + rm-resonance-crests)

Finite consequence tested. M_F(h/k; sigma, T) = int_T^2T |F(sigma+it)|^2 (h/k)^{it} dt and
O_F(h/k; x, T) = int_T^2T Re(F' conj F)(1/2+x+it) (h/k)^{it} dt = (1/2) dM/dsigma, x in {0.02, 0.1, 0.25}.
(a) Reflection: |F(1/2+x+it)|^2 against (q t/2pi)^{-2x} |F(1/2-x+it)|^2 (the parity of W for the completed
function), relative L2 mismatch over the range. (b) Diagonal prediction from coefficients,
D(sigma) = c_sigma(h,k) T + c_{1-sigma}(h,k) int (q t/2pi)^{1-2 sigma} dt with
c_sigma(h,k) = (hk)^{-sigma} sum_j a(hj) a(kj) j^{-2 sigma} (analytic continuation), and the remainder
|M - D| / (T (hk)^{-1/2}), likewise for O. Fractions: 1/2 ... 1/13, the crest fractions 1/5, 1/6, and for
theta in {1/4, 1/2, 1} a prime k near T^theta with h in {1, 2, k/6, k/5, 0.618 k} and a pair of size
T^{theta/2}. Survival would be: a control's remainder exceeding zeta's by a factor growing in T.

Method: F and F' on a uniform grid (step 0.10 to 0.15) from a smoothed Dirichlet sum of length
1.4 q T (erfc cutoff in log n, width 0.15, centre 2.2 q T/2pi) evaluated by a type-1 non-uniform FFT
(kernel width 14, oversampling 2). Validation against mpmath at height 1e4 for zeta, L(chi_-4), DH and
derivatives: relative error 1e-7 or better. float64 on GPU 1 is a screen; no pass or fail is claimed from
it beyond the sizes stated.

| T | function | range | reflection mismatch (rel. L2), x = 0.02, 0.1, 0.25 | median remainder of M, x = 0.1, theta = 1/4, 1/2, 1 (fractions common to all functions at this T) | median remainder of O, x = 0.1, same fractions | remainder of O at 1/7, x = 0.1 |
|---|---|---|---|---|---|---|
| 1e+05 | chi4 | [1e+05, 2e+05] | 8e-12, 4e-11, 9e-11 | 8.22e-04 (n=9), 1.37e-01 (n=5), 1.94e+02 (n=4) | 3.99e-03 (n=9), 8.01e-01 (n=5), 1.06e+03 (n=4) | 3.73e-03 |
| 1e+05 | chi5 | [1e+05, 2e+05] | 8e-12, 4e-11, 8e-11 | 5.02e-03 (n=9), 7.75e-01 (n=5), 3.57e+02 (n=4) | 2.45e-02 (n=9), 4.19e+00 (n=5), 2.07e+03 (n=4) | 1.61e-02 |
| 1e+05 | dh | [1e+05, 2e+05] | 9e-12, 4e-11, 9e-11 | 1.17e-03 (n=9), 4.10e-01 (n=5), 6.62e+01 (n=4) | 6.92e-03 (n=9), 2.03e+00 (n=5), 3.58e+02 (n=4) | 3.31e-03 |
| 1e+05 | zeta | [1e+05, 2e+05] | 6e-12, 3e-11, 7e-11 | 2.13e-03 (n=9), 4.32e-01 (n=5), 1.38e+03 (n=4) | 1.09e-02 (n=9), 2.03e+00 (n=5), 5.22e+03 (n=4) | 8.00e-03 |
| 1e+06 | chi4 | [1e+06, 2e+06] | 1e-10, 5e-10, 1e-09 | 1.22e-04 (n=9), 2.19e-01 (n=5), 1.00e+02 (n=4) | 8.57e-04 (n=9), 1.44e+00 (n=5), 6.40e+02 (n=4) | 5.62e-04 |
| 1e+06 | chi5 | [1e+06, 2e+06] | 1e-10, 5e-10, 1e-09 | 4.66e-04 (n=9), 3.97e-01 (n=5), 2.12e+03 (n=4) | 2.95e-03 (n=9), 2.81e+00 (n=5), 1.43e+04 (n=4) | 1.53e-03 |
| 1e+06 | dh | [1e+06, 2e+06] | 1e-10, 6e-10, 1e-09 | 3.42e-04 (n=9), 8.87e-02 (n=5), 3.20e+02 (n=4) | 2.02e-03 (n=9), 5.57e-01 (n=5), 2.00e+03 (n=4) | 7.99e-04 |
| 1e+06 | zeta | [1e+06, 2e+06] | 8e-11, 4e-10, 9e-10 | 6.14e-04 (n=9), 8.07e-01 (n=5), 2.18e+04 (n=4) | 3.14e-03 (n=9), 4.36e+00 (n=5), 9.20e+04 (n=4) | 1.45e-03 |
| 1e+07 | chi4 | [1e+07, 2e+07] | 1e-09, 6e-09, 1e-08 | 7.38e-05 (n=10), 1.15e-01 (n=5), 4.51e+02 (n=4) | 5.70e-04 (n=10), 1.01e+00 (n=5), 4.02e+03 (n=4) | 1.50e-05 |
| 1e+07 | chi5 | [1e+07, 2e+07] | 1e-09, 5e-09, 1e-08 | 1.20e-04 (n=10), 2.44e-01 (n=5), 6.66e+02 (n=4) | 8.81e-04 (n=10), 2.11e+00 (n=5), 5.15e+03 (n=4) | 3.22e-04 |
| 1e+07 | dh | [1e+07, 2e+07] | 1e-09, 7e-09, 1e-08 | 2.64e-05 (n=10), 1.59e-01 (n=5), 7.88e+02 (n=4) | 2.10e-04 (n=10), 1.22e+00 (n=5), 6.21e+03 (n=4) | 7.06e-05 |
| 1e+07 | zeta | [1e+07, 2e+07] | 7e-10, 4e-09, 8e-09 | 9.66e-05 (n=10), 4.71e-01 (n=5), 2.49e+04 (n=4) | 6.14e-04 (n=10), 3.44e+00 (n=5), 1.11e+05 (n=4) | 2.27e-04 |
| 1e+08 | dh | [1e+08, 1.025e+08] | 1e-08, 5e-08, 1e-07 | 9.22e-05 (n=15), 1.32e+00 (n=6), 1.61e+03 (n=5) | 7.25e-04 (n=15), 8.67e+00 (n=6), 1.16e+04 (n=5) | 7.25e-04 |
| 1e+08 | zeta | [1e+08, 1.05e+08] | 6e-09, 3e-08, 6e-08 | 1.26e-04 (n=15), 4.42e+00 (n=6), 2.15e+05 (n=5) | 1.12e-03 (n=15), 3.03e+01 (n=6), 1.67e+06 (n=5) | 6.61e-04 |

T-NR (centred, q = 101, c = 2.2): |P(sigma+it)|^2 is a sum of nine terms q^{(i+j)(sigma-1/2)} q^{(i-j)it},
so M_NR(h/k) is a combination of M_zeta(h q^d/k), d = -2..2, and so are its diagonal prediction and its
remainder. Computed from the zeta rows:

| T | h/k | T-NR remainder of M (x = 0.1) | zeta remainder of M (x = 0.1) | ratio |
|---|---|---|---|---|
| 1e+05 | 1/1 | 1.49e-03 | 1.02e-04 | 14.6 |
| 1e+05 | 1/2 | 3.03e-03 | 4.76e-04 | 6.4 |
| 1e+05 | 2/3 | 2.59e-02 | 1.54e-03 | 16.7 |
| 1e+05 | 1/7 | 1.09e-02 | 1.82e-03 | 6.0 |
| 1e+05 | 1/317 | 5.51e-01 | 2.33e-02 | 23.6 |
| 1e+05 | 2/317 | 1.18e+00 | 3.45e-02 | 34.3 |
| 1e+05 | 53/317 | 1.21e+01 | 6.07e-01 | 19.9 |
| 1e+05 | 67/317 | 2.12e+00 | 4.32e-01 | 4.9 |
| 1e+05 | 197/317 | 5.26e+00 | 4.16e-01 | 12.6 |
| 1e+05 | 317/419 | 1.46e+02 | 1.44e+00 | 101.2 |
| 1e+06 | 1/1 | 2.00e-03 | 8.78e-05 | 22.8 |
| 1e+06 | 1/2 | 3.37e-03 | 1.44e-04 | 23.4 |
| 1e+06 | 2/3 | 3.91e-03 | 2.30e-04 | 16.9 |
| 1e+06 | 1/7 | 5.06e-03 | 2.71e-04 | 18.7 |
| 1e+06 | 1/1009 | 5.12e-01 | 1.13e-02 | 45.3 |
| 1e+06 | 2/1009 | 1.17e+00 | 2.63e-02 | 44.4 |
| 1e+06 | 173/1009 | 4.01e+00 | 8.07e-01 | 5.0 |
| 1e+06 | 211/1009 | 6.94e+00 | 4.12e-01 | 16.9 |
| 1e+06 | 631/1009 | 5.08e+00 | 1.41e+00 | 3.6 |
| 1e+06 | 1009/1301 | 1.78e+01 | 1.16e+00 | 15.3 |
| 1e+07 | 1/1 | 1.95e-04 | 6.56e-06 | 29.7 |
| 1e+07 | 1/2 | 2.45e-04 | 1.06e-05 | 23.1 |
| 1e+07 | 2/3 | 7.04e-04 | 2.74e-05 | 25.7 |
| 1e+07 | 1/7 | 1.70e-03 | 2.99e-05 | 56.9 |
| 1e+07 | 1/59 | 5.04e-03 | 1.15e-04 | 44.0 |
| 1e+07 | 2/59 | 1.57e-02 | 2.81e-04 | 55.9 |
| 1e+07 | 11/59 | 6.51e-03 | 6.73e-04 | 9.7 |
| 1e+07 | 37/59 | 2.48e-02 | 3.35e-03 | 7.4 |
| 1e+07 | 59/73 | 7.80e-02 | 2.32e-03 | 33.6 |
| 1e+07 | 1/3163 | 1.19e-02 | 8.10e-04 | 14.7 |
| 1e+08 | 1/1 | 2.18e-05 | 1.71e-05 | 1.3 |
| 1e+08 | 1/2 | 4.59e-05 | 3.18e-05 | 1.4 |
| 1e+08 | 2/3 | 3.82e-05 | 1.02e-04 | 0.4 |
| 1e+08 | 1/7 | 1.01e-04 | 8.73e-05 | 1.2 |
| 1e+08 | 1/103 | 4.84e-04 | 6.56e-04 | 0.7 |
| 1e+08 | 2/103 | 1.68e-03 | 5.49e-04 | 3.0 |
| 1e+08 | 17/103 | 6.38e-03 | 6.91e-03 | 0.9 |
| 1e+08 | 23/103 | 2.90e-03 | 5.31e-03 | 0.5 |
| 1e+08 | 67/103 | 4.46e-03 | 2.78e-03 | 1.6 |
| 1e+08 | 103/131 | 6.51e-02 | 3.04e-02 | 2.1 |

Reading.
- Reflection: holds for all four objects at every T to the accuracy of the evaluation. It is the
  functional equation; Davenport-Heilbronn has one. U = zeta(s+i) gives the same integrals as zeta on
  [T+1, 2T+1] up to the unimodular constant (h/k)^{-i}. Backward heat has the reflection exactly and no
  Dirichlet coefficients (NOT RUN at these heights). The sign twist has no functional equation of this
  shape (zeta(2s)/zeta(s) has poles in the strip): the test does not apply.
- Remainders: at theta = 1/4 they decay from 1e-3 to 2e-5..1e-4 between T = 1e5 and 1e7 for all four;
  Davenport-Heilbronn's is below zeta's. At theta = 1/2 they are 0.02 to 0.6; at theta = 1 the diagonal
  prediction is not the leading term for any of the four. No control exceeds zeta by a growing factor.
- T-NR's remainder is 3 to 40 times zeta's at the same h/k because it contains zeta's remainders at
  h q^{+-2}/k; it is zeta's statistic at a larger level.
- Crests: the remainders at 1/5, 1/6, 1/7 are of the same size as at 1/2 and 1/3; the crests are in the
  diagonal coefficient c_sigma(h,k) (a coefficient correlation), as recorded by s4.
- Windows without off-line zeros do not exist at these heights for Davenport-Heilbronn (84 off-line pairs
  below height 2000), so the stated failure condition cannot be checked in its literal form.

How the object enters: through |F| on the lines Re s = 1/2 +- x over a window (mean value).

Classification: CLOSED. Functional-equation identity plus a mean value (MV-CAP); controls with a
functional equation pass, and the off-diagonal remainders do not separate.

## 4. Laurent data at s = 1 from the zero list (euler-detection-decouples-from-offline + rm-estermann-double-pole-wlin + rm-boundary-cotangent)

The elementary part of w_F (Statement 2) is fixed by the residue r_F and the constant c_F of F at s = 1.
Up to scale these are the pole order A and the constant term B of F'/F at 1.

Finite consequences tested.
(a) Compact support. h(r) = (sin(ar/2m)/(ar/2m))^{2m}, g its transform, supported in [-a, a]. Explicit
formula: sum_rho h(gamma_rho) = A (h(i/2) + h(-i/2)) + g(0) log(q/pi) + (1/2pi) int h(r) Re psi(1/4 +
par/2 + ir/2) dr - 2 sum_n c_F(n) n^{-1/2} g(log n). For a < log 2 the prime side is empty and A is
recovered; for log 2 < a < log 3 the coefficient c_F(2) is recovered (node: DH c(2) = 0.1969085883 at
support 1.093).
(b) Hadamard sum. B = sum_{|gamma|<H} 1/(1-rho) + density tail - (1/2) log(q/pi) - (1/2) psi((1+par)/2) - A.
Each with all zeros, with on-line zeros only, and (for (b)) with the off-line pairs moved to the line.
Survival would be: for a control, on-line-only error departing from the all-zero error at a support
(or height) below the one given by the off-line pair term.

Validation: zeta recovers A = 1 to 1e-11 and Euler's constant to 1.4e-12 from 1,000,000 zeros;
L(chi_-4) recovers L'/L(1) = 0.2456096 to 1.5e-8 from 3,615 zeros; DH recovers c(2) to 2.5e-11 at support
1.093 (node: 3.2e-12 with a different test function).

| object | zeros used | m | support | error of pole order, all zeros | error, on-line zeros only | off-line pair term | c(2) error, all | c(2) error, on-line only |
|---|---|---|---|---|---|---|---|---|
| zeta | 1,000,000 (height 600,269) | 1 | 0.65 | 1.6e-03 | 1.6e-03 | 0.0e+00 | - | - |
| zeta | 1,000,000 (height 600,269) | 4 | 0.65 | -1.1e-11 | -1.1e-11 | 0.0e+00 | - | - |
| zeta | 1,000,000 (height 600,269) | 4 | 1.093 | -6.0e-13 | -6.0e-13 | 0.0e+00 | 8.2e-11 | 8.2e-11 |
| L(chi_-4) | 3,615 (height 3,400) | 1 | 0.65 | -3.0e-04 | -3.0e-04 | 0.0e+00 | - | - |
| L(chi_-4) | 3,615 (height 3,400) | 4 | 0.65 | 2.0e-12 | 2.0e-12 | 0.0e+00 | - | - |
| L(chi_-4) | 3,615 (height 3,400) | 4 | 1.093 | 1.8e-13 | 1.8e-13 | 0.0e+00 | -2.5e-11 | -2.5e-11 |
| Davenport-Heilbronn | 1,861 on-line + 84 off-line pairs (height 2,000) | 1 | 0.65 | -1.5e-03 | -4.0e-03 | 2.5e-03 | - | - |
| Davenport-Heilbronn | 1,861 on-line + 84 off-line pairs (height 2,000) | 4 | 0.65 | 2.0e-12 | -9.9e-09 | 9.9e-09 | - | - |
| Davenport-Heilbronn | 1,861 on-line + 84 off-line pairs (height 2,000) | 4 | 1.093 | 1.8e-13 | -5.9e-10 | 5.9e-10 | -2.5e-11 | 8.0e-08 |
| T-NR q=101 | 999,508 on-line + 440,712 off-line pairs (height 600,269) | 1 | 0.65 | 1.6e-03 | -7.0e+00 | 7.0e+00 | - | - |
| T-NR q=101 | 999,508 on-line + 440,712 off-line pairs (height 600,269) | 4 | 0.65 | -1.1e-11 | -1.4e+01 | 1.4e+01 | - | - |
| T-NR q=101 | 999,508 on-line + 440,712 off-line pairs (height 600,269) | 4 | 1.093 | -6.1e-13 | -8.0e+00 | 8.0e+00 | 8.4e-11 | 1.1e+03 |
| E_a, a=1/4 | 1,000,000 shifted quartets, none on the line | 1 | 0.65 | 1.6e-03 | -1.3e-01 | - | - | - |
| E_a, a=1/4 | 1,000,000 shifted quartets, none on the line | 4 | 0.65 | -1.1e-11 | -1.7e-01 | - | - | - |
| E_a, a=1/4 | 1,000,000 shifted quartets, none on the line | 4 | 1.093 | -5.8e-13 | -2.9e-03 | - | - | - |

| object | H | on-line zeros | off-line pairs | Laurent constant error, all zeros | on-line only | off-line pairs moved to the line |
|---|---|---|---|---|---|---|
| zeta | 100 | 29 | 0 | 3.9e-07 | 3.9e-07 | 3.9e-07 |
| zeta | 500 | 269 | 0 | -2.3e-06 | -2.3e-06 | -2.3e-06 |
| zeta | 2000 | 1517 | 0 | 1.7e-09 | 1.7e-09 | 1.7e-09 |
| zeta | 100000 | 138069 | 0 | 4.4e-11 | 4.4e-11 | 4.4e-11 |
| zeta | 600000 | 999508 | 0 | 1.4e-12 | 1.4e-12 | 1.4e-12 |
| L(chi_-4) | 100 | 50 | 0 | -3.2e-05 | -3.2e-05 | -3.2e-05 |
| L(chi_-4) | 500 | 379 | 0 | -6.1e-07 | -6.1e-07 | -6.1e-07 |
| L(chi_-4) | 2000 | 1958 | 0 | 1.2e-07 | 1.2e-07 | 1.2e-07 |
| L(chi_-4) | 3400 | 3615 | 0 | 1.5e-08 | 1.5e-08 | 1.5e-08 |
| Davenport-Heilbronn | 100 | 52 | 1 | 1.3e-05 | -2.6e-04 | 1.3e-05 |
| Davenport-Heilbronn | 500 | 377 | 10 | 3.6e-07 | -6.7e-04 | 3.7e-07 |
| Davenport-Heilbronn | 2000 | 1861 | 84 | 1.1e-07 | -8.0e-04 | 1.3e-07 |
| T-NR q=101 | 100 | 29 | 73 | -9.0e-05 | -3.7e+00 | 6.1e-02 |
| T-NR q=101 | 500 | 269 | 367 | -4.4e-06 | -3.7e+00 | 6.1e-02 |
| T-NR q=101 | 2000 | 1517 | 1469 | -1.8e-08 | -3.7e+00 | 6.1e-02 |
| T-NR q=101 | 100000 | 138069 | 73452 | 5.9e-11 | -3.7e+00 | 6.1e-02 |
| T-NR q=101 | 600000 | 999508 | 440712 | 3.8e-12 | -3.7e+00 | 6.1e-02 |

Reading. In every row, (on-line only) - (all zeros) equals minus the off-line pair term to the digits
shown: this is an identity, since the formula is a sum over zeros. For Davenport-Heilbronn at m = 4 the
pair term is 9.9e-9 at support 0.65 and 5.9e-10 at 1.093 because |h| is that small at height 85.7; the
"decoupling" of the node is the decay of the test function at the height of the first off-line pair.
With m = 1 (slow decay) the pair term is 2.5e-3 and is visible at once. In the Hadamard sum the
on-line-only error departs at H = 100, the first H above 85.7, by 2.7e-4 = the pair term; moving the
pairs to the line instead of deleting them leaves an error of 1e-8, below the truncation error: the
Laurent constant sees the count of zeros, and their abscissa only at order (beta - 1/2)^2/gamma^4.
T-NR: on-line zeros alone (zeta's zeros) reproduce zeta's data, not T-NR's; the difference is the
conductor term 2 log q, carried by the off-line progression. E_a: no zero is on the line and all data
come from off-line zeros.

How the object enters: through its zeros, linearly.

Classification: CLOSED. Explicit formula; the on-line/off-line difference is the off-line pair term by
definition, and its onset is the size of the test function at the pair's height.

## Summary table

| combination | statistic | sizes reached | zeta | comparison L-functions | Davenport-Heilbronn | T-NR | E_a, U, sign twist, heat | classification |
|---|---|---|---|---|---|---|---|---|
| 1 shear x cotangent-sum, bridge x quantum-modular | Holder exponent, jumps, cusp wobble, orbit RMS, capture ratio of psi_F on the Farey grid | all fractions with k <= 30000 (2.7e8) or 16000; 2000 for E_a, U, Liouville | exponent 1.00, continuous, wobble 0.018..0.030 | fail: jumps 0.33, 0.27 at denominators <= 3, exponent 0.5 | fails like the L-functions (jump -0.2805 at 1/2) | integer form fails; centred form passes by identity | E_a, U fail; Liouville: no jumps, exponent 0.66; heat not formulable | CLOSED: jump law = coefficient statement at s = 1 |
| 2 twin-ladder x cotangent-sum, bridge x cancellation | abs(S)/A over the inverse line, OFFDIAG/DIAG | prime b up to the sizes in table T2 | 0.5395..0.5405, in band | 0.506, 0.441: out of band, stable | 0.540: in band | q = 1000003: equal to zeta for b < q; q = 101: 0.526 | Liouville 0.4394; U, E_a see T2; heat not formulable | CLOSED: constants at s = 1 |
| 3 klein x cotangent-sum, klein x reciprocity | reflection mismatch; remainder of M and O against the diagonal | [T, 2T], T = 1e5, 1e6, 1e7; 1e8 as in T3 | reflection 1e-11..1e-7; remainder decays at theta = 1/4 | same | same; remainder below zeta's | combination of zeta rows | U = shifted zeta; E_a, heat, sign twist NOT RUN | CLOSED: functional equation + mean value |
| 4 zero-channel x estermann, zero-channel x digamma | pole order, c(2), Laurent constant from zeros: all / on-line only | zeta 1e6 zeros; L(chi_-4) 3615; DH 2029; T-NR 1.88e6; E_a 1e6 quartets | 1e-11 | 1e-12..1e-8 | difference = pair term (identity) | difference = conductor term | E_a: all data off-line; U = shifted zeta; heat, sign twist not formulable | CLOSED: explicit formula, linear in zeros |

## Not run, and limits

- T1/T2 with the N = 1e9 smooth cutoff: replaced by N = infinity closed forms. Random multiplicative sign
  twists: NOT RUN (no closed form; Liouville used). Backward heat: no Dirichlet coefficients, not
  formulable in T1, T2, T4.
- T2 at b up to 2.4e6: reached only for the functions and sizes listed in table T2. Centred T-NR leaves:
  NOT RUN (modulus a q).
- T3 at T = 1e8: ranges as listed in table T3; L(chi) and DH at 1e8 only on [1e8, 1.025e8] (DH) or NOT RUN.
  T-NR at q = 1000003: NOT RUN (needs twists h q^2/k with q^2 = 1e12). E_a: NOT RUN.
- T4: L(chi_5) NOT RUN (no zero list); L(chi_-4) with 3,615 zeros, not 1e6; DH with every zero below
  height 2000 (2029 zeros), not 1e5: complete off-line lists above 2000 are not available.
- All T1 to T3 numbers are float64. No interval arithmetic was used; no statement here depends on a sign
  or on a digit beyond the fifth.

## Three weakest steps

1. Statement 2 for F other than zeta is a formal contour shift with a conditionally convergent integral;
   it is supported by the recovered symbols (2 digits for L(chi_-4), L(chi_5), DH), not proved here.
2. Statement 3 is derived termwise; the proof for characters is immediate (finite combinations of
   sawtooth and log-sine functions), the general statement is not written out. The measured agreement is
   5 digits at 3 functions and 30 to 40 rationals each.
3. T3 uses a two-term diagonal prediction and 4 to 20 fractions per theta band; medians at theta = 1 vary
   by two orders between functions because the fractions differ (denominators must be prime to the
   conductor). The conclusion "no growing factor" rests on theta = 1/4 and 1/2.

## Files

`vf.c` (tables and leaves, OpenMP), `vlib.py`, `gen_tables.py` (numpy reference and U, E_a, Liouville),
`analyze1.py`, `analyze2.py`, `t3.py` (non-uniform FFT engine), `summ3.py`, `test4.py`, `nr_centered.py`,
`validate1.py`, `validate2.py`, `val3.py`, `run_*.sh`, `mk_result.py`; data in `srv/` (server), `locK/`
(local), `out/`.
