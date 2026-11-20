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
  the same decay in T; Davenport-Heilbronn's is below zeta's at theta = 1/4 and zeta's is the largest at
  theta = 1. Mean-value statistic.
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

{{T1}}

T1-symbol. Recovered Re X_F(xi) / mpmath value:

{{T1SYM}}

Jump law:

{{T1JUMP}}

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

{{T2}}

OFFDIAG/DIAG (b at most the table size):

{{T2OFF}}

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

{{T3}}

T-NR (centred, q = 101, c = 2.2): |P(sigma+it)|^2 is a sum of nine terms q^{(i+j)(sigma-1/2)} q^{(i-j)it},
so M_NR(h/k) is a combination of M_zeta(h q^d/k), d = -2..2, and so are its diagonal prediction and its
remainder. Computed from the zeta rows:

{{T3NR}}

Reading.
- Reflection: holds for all four objects at every T to the accuracy of the evaluation. It is the
  functional equation; Davenport-Heilbronn has one. U = zeta(s+i) gives the same integrals as zeta on
  [T+1, 2T+1] up to the unimodular constant (h/k)^{-i}. Backward heat has the reflection exactly and no
  Dirichlet coefficients (NOT RUN at these heights). The sign twist has no functional equation of this
  shape (zeta(2s)/zeta(s) has poles in the strip): the test does not apply.
- Remainders (medians over the fractions common to the four functions): at theta = 1/4 they decay from
  1e-3..5e-3 at T = 1e5 to 3e-5..1e-4 at T = 1e7 for all four, and Davenport-Heilbronn's is below zeta's
  at every T. At theta = 1/2 they are 0.09 to 0.8 with no trend in T for any of the four. At theta = 1
  the diagonal prediction is not the leading term and zeta's remainder is the largest of the four. No
  control exceeds zeta by a growing factor.
- T-NR's remainder is between 0.4 and 100 times zeta's at the same h/k because it contains zeta's
  remainders at h q^{+-1}/k and h q^{+-2}/k; it is zeta's statistic at a larger level.
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

{{T4}}

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
