# s3-heat-zero-velocity-channels: screening of four heat-flow / zero-channel combinations

Lane `s3-heat-zero-velocity-channels`, 2026-11-19/20. Screening arm. Labels: PROVED (short argument here or in the cited source),
MEASURED (python-flint ball arithmetic at the stated precision; jet truncation and circle sampling are not enclosed, so nothing
here is an interval certificate), STRUCTURAL (follows from the definition of the control). No claim about RH or Lambda. No bound
moves.

## 0. Verdict

Four combinations tested. **Survivors: 0.**

| # | combination | what the finite test turned out to measure | classification |
|---|---|---|---|
| 1 | t = 0 descent rate of an off-line zero (mirror pair lemma, Poisson domination A4, Euler rate A5) | A4 is a Hadamard-product inequality: it holds at all 8138 off-line zeros of DH below 1e5, at all 1748 of T-NR, all 10142 of E_1/4, 274 of 275 of the heat control. A5 with zeta's majorant holds at every control zero where it is defined. A5 uses the Euler product only through the size of sum abs(Lambda_F(n)) n^-sigma at sigma = (1 + eta)/2 > 1 | closed: T-NR (Euler product, off-line zeros) satisfies the rate, so the rate excludes nothing; DH satisfies it, so the Euler product is not what the rate tests. The only arithmetic input is a coefficient-size statement to the right of 1 |
| 2 | heat-stability radius delta*(k) of a zero channel from positivity of the theta kernel | lg delta*(k) = -(pi/(4 ln 10)) gamma_k + O(lg gamma) for every object (fitted slope -0.341092 to -0.341103; pi/(4 ln 10) = 0.341094). The bound is available for the signed kernels too (they are pointwise >= 0 on u >= 0; termwise absolute values cost a factor <= 1.007). The local factor floor/g has the same distribution for zeta, L(chi_-3), L(chi_-4) and DH | closed: the bound collapses for zeta itself, at the same exponential rate as for every control, because it discards cos(2u gamma); the sign pattern of the summands plays no role |
| 3 | transverse identity D' = -M/2 and the stability exponent kappa of the line | M >= 1.0000 at every off-line zero of every control (20,303 zeros); kappa = S1^2 + 3 S2 (PROVED), a sum over all zeros in which only an off-line pair at height distance below its own displacement x contributes negatively. kappa < 0 occurs at 5 on-line DH zeros, 637 T-NR, 7 heat, each time with such a pair; never below the first off-line height | closed: local Hadamard statement; zeta's pass at height T is implied by RH to height T + 1/2; no primes enter |
| 4 | zero loss (v_exit) against collision (v_coll) under backward heat | v_coll is a function of the nearest zeros (16 neighbours each side reproduce it to 2 %); v_exit also needs one far-field number (the drift S1). Ratio distributions of zeta, L(chi_-3), L(chi_-4) agree at matched density. DH and T-NR differ in v_coll/(g^2/2), and for DH the difference is carried by channels within 10 mean spacings of an off-line pair | closed: local statement plus drift; controls separate only next to their off-line zeros or through the gap law already closed in `s1-zero-flow-dynamics` |

The known pattern holds in all four: a control separates from zeta only where the test resolves its off-line zeros (3, 4) or
through a statement to the right of 1 (1); test 2 does not separate anything.

## 1. What would have counted as survival (written before the runs)

1. Rate: the inequality v <= B(eta) (v = dy/dt, B from the Euler product) holds at the off-line zeros of the controls that have
   an Euler product and fails at a positive fraction of DH zeros at eta where the DH Dirichlet series still converges absolutely.
2. Stability radius: delta*(k) of zeta decays polynomially in gamma_k while a control's decays faster or the bound is undefined,
   at channels below the control's first off-line zero.
3. Exponent: kappa > 0 at every on-line zero of zeta and L(chi), and kappa < 0 at an on-line zero of a control below its first
   off-line height (or far from every off-line pair).
4. Events: the distribution or the sign of v_exit/v_coll of a control differs from zeta's at channels below the control's first
   off-line height, at matched density.

None of the four happened.

## 2. Objects, normalisation, method (shared code `chan.py`)

Normalisation of the source (zeta-view `docs/ZERO-CHANNELS-MATH.md`): F_tau(s) with d_tau F = F_ss/4, F_0 the completed
function, F(1 - conj s) = conj F(s); at a simple zero rho' = -F_ss/(4 F_s). Backward heat time v = -tau.

| code | object | zeros used |
|---|---|---|
| ZETA | xi(s) | Arb `zeta_zeros`: 10,142 below 1e4; 1240 from height 1e5; lists of `s1-zero-flow-dynamics` at 1.04e7 and 4.26e7 and for 1.0e8 zeros |
| L4, L3 | (q/pi)^(s/2) Gamma((s+1)/2) L(s, chi_-q), q = 4, 3 (positive comparison; signed theta summands) | sign changes of Arb's Hardy function, step 1/12 of the mean spacing, finer pass in windows whose count differs from the phase by more than 1.6: 12,502 and 12,039 zeros below 10,110; phase counts 12,502.01 and 12,039.11 |
| DH | (5/pi)^(s/2) Gamma((s+1)/2) 5^-s [zeta(s,1/5) + k zeta(s,2/5) - k zeta(s,3/5) - zeta(s,4/5)] | on-line: list of `s1-zero-flow-dynamics` (147,407 below 1e5). Off-line: complex roots of the windowed-sinc interpolant of that lane's samples of Z_DH, 6.1e6 Newton starts (`dh_seeds.py`), then Newton in balls: **8138 pairs below 1e5**, largest beta - 1/2 = 0.4371 (height 49,688.34), none with beta > 1. Check: phase count - on-line - 2 x pairs in 40 windows lies in [-0.96, +1.09], total -0.64; the 84 pairs below 2000 agree with the battery table of `c12-control-battery-harness` to 2.3e-9 |
| TNR | xi(s)(2 cosh((s - 1/2) log 3) + 2.2); Euler product with a modified factor at 3 | on-line = zeta's; off-line at 1/2 +- 0.403753 + i(2k+1) pi/log 3 (1748 below 1e4) |
| EA | xi(s + 1/4) xi(s - 1/4) | all zeros at 1/2 +- 1/4 + i gamma (10,142 below 1e4) |
| HEAT | exp((tau0/4) d_s^2) xi, tau0 = -0.5 | table of `c12-control-battery-harness` below 2000 (929 on-line, 294 pairs; first pair at height 111.69), re-refined here |
| sign twist Lambda -> eps Lambda | STRUCTURAL: no functional equation, no reflection s -> 1 - conj s, so "off-line zero", D, M, kappa and the symmetric disk are undefined. For the Liouville twist zeta(2s)/zeta(s) the zeros lie on Re s = 1/4. Its coefficients satisfy abs(Lambda_F) <= Lambda, so the majorant step of A5 (section 3.2) holds for it | not computed |
| unimodular twist zeta(s + i a) | STRUCTURAL: every quantity here is zeta's, translated by a | not computed |

Method. Each quantity is computed from the Taylor jet a_0..a_{n-1} of the completed function at the zero (`acb_series`, 512 bits,
n = 100 for combinations 2 and 4; 192 bits, n = 4 for the rates). The heat family of any entire F of order 1 follows from the
jet by a_m(tau) = sum_j (tau/4)^j/j! (m+2j)!/m! a_{m+2j} (the formula of node `zv-polynomial-heat-coefficients`; the series
converges for every tau because the Taylor coefficients of an order-1 function decay like 1/m!). So the heat control, the
perturbation bound of combination 2 and the events of combination 4 need no quadrature of the theta kernel and no precision of
pi x/(8 ln 10) digits: the jet of xi is taken from the closed form with relative accuracy.

Validation (`validate.py`, run on the Mac and on the server, all checks pass):

| check | got | reference |
|---|---|---|
| heat zeros at tau = -0.1, -0.2, +0.2 (first three) from the jet formula | 14.163717655758, 21.05982727370, ... | zeta-view table, agreement 2e-13 at all nine |
| abs(xi'(rho_1)) | 0.0013827191 | certificate constant A = 0.0013827 |
| P(0.02, 0.35) = 8 int Phi (e^{delta u^2} - 1) cosh(2ru) du, from the jet at s = 1/2 | 0.00011580648 | 0.00011580648 (source); P(0.05, 0.35) = 0.00028966 < 0.00029 |
| quartic preset: v_coll, v_exit for the circle centre 1/2 + i/2 radius 7/20 | 0.13406958403645, 0.08175425079886 | 0.13406958403644717, 0.0817542507988577 |
| kappa = S1^2 + 3 S2 on the Lehmer-like preset | 34.44058617169 | same |
| DH first off-line zero; DH real on the line; DH first on-line zero | 0.80851718245664 + 85.69934848538 i | battery table |
| T-NR: M at the off-line zero against theta coth theta + 2x Re xi'/xi(rho) | 1.080428235143 | same |
| theta kernels of L3, L4, DH: integral against the jet at s = 0.8 | 0.585487676819, 0.875255483116, 1.146105214098 | equal to 15 digits (`kern.py`) |
| semigroup: v_coll(HEAT tau0 = -0.5) = v_coll(ZETA) - 0.5 | 11.994513129644 vs 12.494513129644; 3.454792523755 vs 3.954792523755 | exact |
| jet truncation n = 100 against n = 76 at height 9996.6 | v_coll 0.390647490644, v_exit 0.388588395014 both | equal |
| sum Lambda_DH(n) n^-3 against -f'/f(3) | -0.001418767267 | same |

## 3. Combination 1: the t = 0 Euler rate

### 3.1 Statement tested

Source: `src/data/rh-bridge-mirror-descent-2026-09-25.js` (A1 to A5). For a zero rho = 1/2 + x + i gamma, x > 0, put y = 2x
(the imaginary part in the variable of H_t). Then (PROVED, from rho' = -F_ss/(4 F_s) and the Hadamard product with symmetric
pairing)

    v := dy/dt = -Re(F_ss/F_s)(rho)/2 = -M/y,     M = x Re(F_ss/F_s) = 1 + sum_{on-line} 2x^2/(x^2 + D^2) + (other off-line pairs),

where the 1 is the mirror partner 1 - conj rho. A4 (PROVED in the source for a globally topmost zero, any function with these
symmetries): v <= B4(eta) = -1/y + 4y/(eta^2 - y^2) - (y/eta) Re(F'/F)(1/2 + eta/2 + i gamma) for eta >= sqrt5 y. A5 replaces
Re(F'/F) by Re arch + Re f'/f >= Re arch - sum abs(Lambda_F(n)) n^-sigma, sigma = (1 + eta)/2 > 1; with zeta's coefficients the
majorant is abs(zeta'/zeta(sigma)). "E" below is Re f'/f(sigma + i gamma) - zeta'/zeta(sigma); E < 0 means the control breaks
the majorant at that point.

### 3.2 Controls (MEASURED, 192-bit balls; eta in {sqrt5 y, e, 1.3e, 2e, 4e}, e = max(sqrt5 y, 1.02))

| object | off-line zeros | v < 0 | M = -vy: min, median, 99 % | A4 (own S) violated | A5 (zeta majorant) violated | E < 0 |
|---|---|---|---|---|---|---|
| DH, height < 1e4 | 567 | all | 1.0003, 1.240, 2.684 | 0 at every eta | 0 | 0 |
| DH, 1e4 to 1e5 | 7571 | all | 1.0000, 1.312, 3.505 | 0 at every eta | 0 | 0 |
| T-NR, < 1e4 | 1748 | all | 1.0804, 3.946, 5.355 | 0 | 0 | 0 |
| E_1/4, < 1e4 | 10,142 | all | 1.0169, 1.893, 2.522 | 0 | 0 | 736 at eta = 4e (min E = -0.159); A5 still holds there |
| HEAT -0.5, < 1990 | 275 | all | 1.0041, 1.358, 2.825 | 1 at eta = sqrt5 y and at e (v - B4 = +0.0012; the zero is not topmost); 0 at larger eta | no Dirichlet series | n/a |

DH detail. 7031 of the 8138 DH zeros are topmost within height distance 2; A4 holds at the other 1107 as well. The decomposition
of M for DH below 1e4: Poisson field of the on-line zeros, median 0.232 (99 %: 1.68); remainder M - 1 - M_on from other off-line
pairs and tails, median 0.0034, minimum 0.0000. No DH zero with beta > 1 exists below 1e5 by the window counts, so the DH
zeros below 1e5 are topmost among themselves up to x = 0.4371.

Where the Euler product enters A5 (`maj.py`, MEASURED, coefficients to n = 2e6):

| sigma | abs(zeta'/zeta) | DH: sum abs(Lambda_DH(n)) n^-sigma, N = 2e4, 2e5, 2e6 | T-NR | E_1/4 |
|---|---|---|---|---|
| 1.05 | 19.432 | 12.80, 17.98, 24.06 (growing) | 26.09 | divergent |
| 1.2 | 4.458 | 5.510, 6.496, 7.316 (growing) | 7.610 | divergent |
| 1.5 | 1.505 | 1.539, 1.576, 1.591 | 2.907 | 4.339 |
| 2 | 0.570 | 0.4054, 0.4056, 0.4056 | 1.168 | 1.270 |
| 3 | 0.165 | 0.0788 | 0.331 | 0.344 |

At sigma >= 2 the function without Euler product has a smaller majorant than zeta, and A5 with its own majorant is a stronger
bound than zeta's. max abs(Lambda_DH(n)) in [N, 2N) is 2.9, 6.8, 26.7, 158, 631, 3405 for N = 10, ..., 1e6 (growth about
N^0.55): the DH series stops converging absolutely somewhere between sigma = 1.5 and 1.6. The Euler product (in the form
abs(Lambda_F) <= Lambda) is used only to keep the majorant finite down to sigma = 1.

### 3.3 Zeta on the grid of hypothetical positions (`grid1.py`, 30 digits, exact archimedean term)

91 points: x = beta - 1/2 in {0.001, ..., 0.4}, gamma in {1e2, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10}.

- B5 = min over eta of the bound is negative and below -1/y at all 91 points. It is an upper bound for a velocity; a negative
  value is not in conflict with the existence of the zero.
- The Euler bracket Re arch + zeta'/zeta(sigma) is negative for sigma < sigma_0(gamma): sigma_0 = 1.5337, 1.3272, 1.2369,
  1.1858, 1.1529, 1.1130, 1.0896 at gamma = 1e2, ..., 1e10. At the smallest admissible eta the wide-Poisson term has the sign
  opposite to the bound (it pushes up) at 77 of the 91 points; it is negative there only at the 14 points with
  sqrt5 y > 2 sigma_0 - 1 (x = 0.3 from 1e6, x = 0.35 from 1e4, x = 0.4 from 1e3).
- The optimal eta is 1.89 to 7.18 (sigma = 1.44 to 4.09), never near 1. The gain over de Bruijn's -1/y, as a fraction of 1/y,
  is at most 2.15 (x = 0.4, gamma = 1e10) and tends to 0 like y^2 log gamma: 0.0356 at x = 0.05, gamma = 1e10; 7e-6 at
  x = 0.001.

### 3.4 Classification: closed

Both outcomes named in the task text occur. T-NR has an Euler product and off-line zeros, and they satisfy A4 and A5: the rate
cannot exclude a zero. DH has no Euler product and its 8138 off-line zeros satisfy A4 and A5, with slack: the Euler product is
not used at the zeros. The arithmetic content of A5 is the finiteness and size of sum abs(Lambda_F(n)) n^-sigma for sigma > 1,
a statement to the right of 1 (row "only to the right of 1" of the known pattern). Not verified height, and not a separator.

## 4. Combination 2: heat-stability radius from positivity

### 4.1 Statement tested

For a disk of centre rho_k and radius r: delta_R(k, r) is the largest delta with P(delta, r) < min over the circle of abs(F_0)
(Rouche), delta_TR(k, r) the same with the Taylor-Rouche floor A r - E - B r^2/2, and delta* the maximum over
r in {0.05 g, ..., 0.95 g}, g = distance from rho_k to the nearest other zero. P is the positivity bound of the source,

    P(delta, r) = 8 int_0^inf Psi(u) (e^{delta u^2} - 1) cosh(2ru) du = F_delta(1/2 + r) - F_0(1/2 + r) = sum_{j>=1} (delta/4)^j/j! F^(2j)(1/2 + r)

(PROVED for a kernel Psi >= 0 on u >= 0: the supremum of abs(F_tau - F_0) over the strip and over abs(tau) <= delta is the value
at the real point 1/2 + r, tau = delta). P does not depend on the height of the disk.

Kernels (`kern.py`). zeta: Phi, every summand positive. T-NR: Phi(u - (log 3)/2) + Phi(u + (log 3)/2) + 2.2 Phi(u), positive.
E_a and HEAT: positive. L3, L4, DH: Psi(u) = sum c(n) n e^{3u} exp(-pi n^2 e^{4u}/q) with signed c(n); Psi >= 0 on u >= 0 at
every sampled point (the n = 1 term dominates), so the same bound holds without change. With termwise absolute values
instead, the first-order bound grows by the factor 1.0068 (L3), 1.00006 (L4), 1.00007 (DH) at r = 0 and less at larger r.
So for the positive comparison L(chi) the bound does not fail.

### 4.2 Results (MEASURED, 512-bit balls, 64 nodes per circle, 19 radii per zero)

| object | channels | lg delta_R* at the lowest / highest channel | fit lg delta_R* = a + b gamma + c lg gamma: b | floor_R/g quantiles (1, 10, 50, 90, 99 %) | median lg(delta_R*/delta_TR*) |
|---|---|---|---|---|---|
| ZETA | 10,142 on-line, to 9999 | -0.91 / -3400.82 | -0.341096 | 0.149, 0.181, 0.249, 0.348, 0.397 | 0.155 |
| ZETA | 1240 at height 1.0e5 | -34098.5 / -34373.0 | n/a (window) | 0.164, 0.195, 0.258, 0.338, 0.379 | 0.155 |
| L4 | 12,349 on-line | -0.32 / -3407.71 | -0.341095 | 0.165, 0.194, 0.255, 0.343, 0.389 | 0.154 |
| L3 | 5946 (every second zero) | -0.79 / -3407.43 | -0.341095 | 0.162, 0.192, 0.254, 0.344, 0.389 | 0.155 |
| DH | 11,570 on-line | -0.23 / -3408.59 | -0.341095 | 0.152, 0.198, 0.251, 0.345, 0.385 | 0.165 |
| DH | 567 off-line | -27.62 / -3406.68 | -0.341103 | 0.159, 0.195, 0.234, 0.248, 0.250 | 0.235 |
| T-NR | 10,142 on-line | -3.86 / -3402.61 | -0.341103 | 0.106, 0.138, 0.222, 0.376, 0.467 | 0.166 |
| T-NR | 1748 off-line | -0.77 / -3402.24 | -0.341092 | 0.119, 0.131, 0.149, 0.167, 0.191 | 0.302 |
| HEAT -0.5 | 923 on-line, to 1987 | -2.36 / -670.11 | -0.341077 | 0.074, 0.130, 0.209, 0.328, 0.398 | 0.138 |

pi/(4 ln 10) = 0.341094. floor_R is min over the circle of abs(F)/abs(F'(rho_k)) at the optimal radius (r/g = 0.45 to 0.5 for
on-line channels); floor_R/g = 1/4 is the value for two isolated zeros. DH below its first off-line height (43 channels):
floor_R/g quantiles 0.122, 0.154, 0.185, 0.343, 0.413; above: 0.153, 0.199, 0.251, 0.345, 0.385. First zero of zeta:
delta_TR* = 10^-1.2106 = 0.0616 at r = 0.344, consistent with the certified delta = 0.05 at r = 0.35 of the source;
delta_R* = 0.1227 at r = 1.03. The true time at which the count of the disk of radius 0.7 g changes is v_exit, of the size
of g^2/2 (section 6): 0.1 to 0.2 at height 1e4, against delta* = 10^-3400. Off-line channels of the heat control are not
in the table: the Taylor-Rouche floor is positive at 157 of 275 and the fit is not defined.

### 4.3 Classification: closed

delta*(k) = 4 abs(F'(rho_k)) g c_k / F''(1/2 + r) with c_k = floor/g of order 1/4, and abs(F'(rho_k)) decays like
exp(-pi gamma_k/4) for every function with one Gamma((s + c)/2) factor. The positivity bound replaces cos(2u gamma) by 1, so it
loses pi/(4 ln 10) = 0.3411 digits per unit of height for zeta, for the positive comparison and for every control alike. The
"fail" condition of the task holds for zeta itself; nothing depends on the sign pattern of the summands; the residual factor
c_k is a local quantity with the same law in all families. No separation at any size.

## 5. Combination 3: transverse identity and the stability exponent of the line

### 5.1 Statements (PROVED)

With F'/F = 1/(s - rho) + G(s) near a simple zero, G = sum over the other zeros of 1/(s - rho_j): F_ss/F_s(rho) = 2 G(rho), and
d_s(F_ss/F_s)(rho) = 3 G'(rho) - G(rho)^2. For an on-line zero 1/2 + i gamma_k, writing the other zeros as 1/2 + i g_j (g_j
complex for off-line zeros, which come in conjugate pairs), S_p = sum (gamma_k - g_j)^-p:

    kappa_k := lim_{x -> 0} M/x^2 = Re d_s(F_ss/F_s)(rho_k) = S1^2 + 3 S2,
    S2 = sum_{on-line} D^-2 + sum_{off-line pairs (x_j, D)} 2 (D^2 - x_j^2)/(D^2 + x_j^2)^2.

Checked on the Lehmer-like polynomial preset (34.44058617169 both ways). Consequences: an on-line zero has kappa > 0 unless an
off-line pair sits at height distance D < x_j from it and outweighs the rest; a pair contributes at least -6/x_j^2. For a
function whose zeros are all on the line up to height T + 1/2, kappa > 0 at every zero up to T, because x_j <= 1/2.
For an off-line zero, M = 1 + (Poisson field of the on-line zeros, >= 0) + (other pairs: >= 0 when the zero is topmost,
mirror pair lemma A1).

### 5.2 Results (MEASURED)

Off-line zeros, M = x Re(F_ss/F_s):

| object | zeros | min M | M quantiles 1, 10, 50, 90, 99 % | M < 1 | (M - 1)/x^2, median |
|---|---|---|---|---|---|
| DH < 1e4 | 567 | 1.0003 | 1.005, 1.036, 1.240, 1.767, 2.684 | 0 | 7.59 |
| DH 1e4 to 1e5 | 7571 | 1.0000 | 1.004, 1.041, 1.312, 2.263, 3.505 | 0 | 12.87 |
| T-NR | 1748 | 1.0804 | 1.98, 2.91, 3.95, 4.74, 5.36 | 0 | 18.07 |
| E_1/4 | 10,142 | 1.0169 | 1.289, 1.580, 1.893, 2.243, 2.522 | 0 | 14.28 |
| HEAT -0.5 | 275 | 1.0041 | 1.013, 1.076, 1.358, 1.984, 2.825 | 0 | 2.85 |

M > 0 at all 20,303 off-line zeros: each moves toward the line as tau increases, and the fixed-tube condition M >= 0 holds
with M >= 1. This is the sign of the forward flow for every function of the class and separates nothing.

On-line zeros, kappa from the jets:

| object | zeros | kappa < 0 | with an off-line pair at D < x | min kappa | kappa gbar^2 quantiles 1, 10, 50, 90, 99 % |
|---|---|---|---|---|---|
| ZETA < 1e4 | 10,142 | 0 | - | 0.5390 (first zero) | 6.85, 8.70, 13.49, 29.3, 97.4 |
| ZETA at 1.0e5 | 1240 | 0 | - | 13.05 | 6.65, 8.43, 13.42, 32.1, 154.5 |
| ZETA at 1.04e7 | 73 | 0 | - | min kappa gbar^2 = 6.87 | 7.20, 8.31, 13.46, 34.4, 53.1 |
| ZETA at 4.26e7 | 74 | 0 | - | min kappa gbar^2 = 7.05 | 7.44, 9.22, 13.09, 24.6, 58.5 |
| L4 | 12,349 | 0 | - | 0.9026 | 6.72, 8.51, 13.08, 29.3, 119 |
| L3 | 5946 | 0 | - | 1.2062 | 6.75, 8.48, 13.05, 28.2, 100 |
| DH | 11,570 | 5 | 5 of 5 (9 on-line zeros have such a pair) | -141.23 at 9504.68 | 6.97, 8.77, 13.63, 31.9, 149 |
| T-NR | 10,142 | 637 | 637 of 637 (1614 have such a pair) | -33.06 at 163.03 | -20.1, 8.54, 17.3, 37.6, 110 |
| HEAT -0.5 | 923 | 7 | 7 of 7 (12 have such a pair) | -56.77 at 1552.33 | 6.98, 12.6, 33.6, 123, 549 |

The five DH cases: on-line zeros 3711.4925, 4935.6948, 6359.3510, 7464.0798, 9504.6814 with off-line pairs at height distance
0.096, 0.077, 0.137, 0.156, 0.064 and x = 0.195, 0.355, 0.182, 0.294, 0.127. Below the first off-line height: DH, 43 on-line
zeros below 85.699, min kappa 0.955 (the nearest on-line zero is 2.59 below the pair, x = 0.309); HEAT, 33 zeros below 111.69,
min kappa 0.540. T-NR has no on-line zero below its first off-line height 2.86.

List form for zeta (server, float64, J = 200 neighbours each side, density tails, smooth term -pi/4 in S1):
100,115,897 zeros (heights to 4.27e7): kappa > 0 at all, which is automatic for a list of real ordinates; min kappa/rho^2 = 4.383
at gamma = 25,191,247.26 (rho = density), quantiles 5, 6, 8, 13, 33, 140 (0.1 % to 99 %), mean 22.15, S1^2 share 8.6 %.
Against the jets at 9930 zeros below 1e4: relative difference of kappa, quantiles -0.0055, -0.0010, +0.0010, +0.0070, +0.050.
Not reached: the task's "1e8 zeros" was done only in list form; jets (the form that would see an off-line zero) were run at
10,142 + 1240 + 73 + 74 zeros.

### 5.3 Classification: closed

The exponent is a Hadamard sum over all zeros with no prime side. A control gets a negative exponent only at an on-line zero
within height distance x of one of its off-line pairs (DH: 5 of 11,570; and at none of the 43 channels below its first
off-line height), so the test resolves individual off-line zeros and nothing else. For zeta the pass at height T is implied
by verified height. M >= 1 at off-line zeros holds for every control.

## 6. Combination 4: zero loss against collision

### 6.1 Definitions

For an on-line zero rho_k: phi(h) = F(rho_k + i h)/(i F'(rho_k)) is real; phi_v = exp((v/4) d_h^2) phi is the line function
at backward heat time v. v_coll(k): the fold (phi_v = d_h phi_v = 0) at which the branch h_k(v), h_k(0) = 0, ends
(continuation with step control, then Newton on the pair of equations). v_exit(k): the first v at which a zero of phi_v lies on
the circle abs(h) = r, r = 0.7 g (the geometry of the source: radius 7/20 for a gap 1/2); found as the first sign change of
phi_v(+-r) on a grid of 48 values to 1.3 v_coll with bisection, and a winding number (48 nodes) for crossings off the line.
Channels without a fold before v = 3 gbar^2 (gbar = local mean spacing) are reported as "cap" and left out of the ratio; a
second run with n = 76 is made for every tenth channel and for every channel with v_coll > 1.2 gbar^2, and channels where it
differs by more than 1e-6 are left out.

### 6.2 Results (MEASURED, 512-bit balls)

| object | on-line channels | with a fold (cap; truncation check failed) | v_exit/v_coll quantiles 1, 10, 50, 90, 99 % | mean | v_coll/(g^2/2) quantiles 1, 10, 50, 90, 99 % |
|---|---|---|---|---|---|
| ZETA < 1e4 | 10,142 | 8260 (1766; 86 of 1733) | 0.285, 0.506, 0.826, 0.992, 1.000 | 0.785 | 1.021, 1.093, 1.375, 2.72, 6.29 |
| ZETA at 1.0e5 | 1240 | 1005 (226; 8 of 212) | 0.294, 0.574, 0.841, 0.991, 1.000 | 0.808 | 1.015, 1.081, 1.341, 2.80, 7.21 |
| L4 | 12,349 | 10,085 (2180; 60 of 2082) | 0.325, 0.553, 0.839, 0.992, 1.000 | 0.802 | 1.016, 1.087, 1.371, 2.71, 6.32 |
| L3 | 5946 | 4844 (1046; 34 of 1444) | 0.349, 0.543, 0.842, 0.992, 1.000 | 0.801 | 1.019, 1.091, 1.375, 2.76, 6.09 |
| DH | 11,570 | 9283 (1919; 349 of 2063) | 0.366, 0.557, 0.836, 0.994, 1.000 | 0.803 | 1.013, 1.109, 1.465, 2.81, 6.45 |
| T-NR | 10,142 | 7902 (1317; 826 of 2150) | 0.230, 0.433, 0.819, 0.992, 1.000 | 0.761 | 0.851, 1.043, 1.479, 3.24, 8.91 |
| HEAT -0.5 | 923 | 729 (101; 85 of 163) | 0.095, 0.375, 0.760, 0.990, 1.000 | 0.717 | 1.009, 1.050, 1.346, 4.18, 20.3 |

Sign: v_exit > 0 and v_coll > 0 at every channel. v_exit < v_coll at all but 1, 2, 4, 3 channels (ZETA, L4, L3, DH); in
those the tracked branch changed to a neighbouring root, a defect of the tracker (section 8). The source ratio
0.0817542508/0.1340695840 = 0.6098 is reproduced by the same code on the quartic preset. Exit through a zero crossing the
circle off the line: 2 (ZETA), 4 (T-NR), 10 (HEAT) channels.

Two-sample Kolmogorov-Smirnov distances against ZETA at matched local mean spacing (1 % critical value in brackets):

| object | gbar in [0.65, 0.8) ratio / v_coll | gbar in [0.8, 1.0) ratio / v_coll | gbar in [1.0, 1.4) ratio / v_coll |
|---|---|---|---|
| L4 | 0.040 / 0.042 (0.058) | 0.035 / 0.024 (0.036) | 0.034 / 0.050 (0.069) |
| L3 | 0.040 / 0.041 (0.064) | 0.032 / 0.028 (0.043) | 0.035 / 0.029 (0.079) |
| DH | 0.035 / 0.095 (0.058) | 0.044 / 0.087 (0.041) | 0.039 / 0.142 (0.049) |
| DH, no off-line pair within 10 gbar | 0.043 / 0.072 (0.066) | 0.051 / 0.035 (0.059) | 0.065 / 0.077 (0.114) |
| T-NR | 0.119 / 0.139 (0.073) | 0.070 / 0.115 (0.037) | 0.046 / 0.112 (0.044) |

DH below its first off-line height: 33 channels with a fold, ratio quantiles 0.298, 0.358, 0.681, 0.974, 0.998; against the
pooled zeta, L3, L4 channels of the same mean spacing (25 against 259): KS 0.147 (ratio), 0.224 (v_coll); critical value 0.341.
HEAT below 111.69: 18 against 28, KS 0.242 and 0.500 (critical 0.492); for this control v_coll = v_coll(zeta) - 0.5 exactly
(semigroup, PROVED), so its difference from zeta is zeta's own collision time shifted.

Dependence on neighbours (`c4_local.py`, 331 zeta channels and 307 DH channels, every 25th and 30th): the events recomputed from
the polynomial with the K nearest zeros on each side (off-line pairs included for DH):

| model | v_coll model/full: median (10 %, 90 %) | v_exit model/full: median (10 %, 90 %) | ratio: correlation with the full value, median abs difference |
|---|---|---|---|
| zeta, K = 4 | 0.929 (0.796, 0.980) | 0.941 (0.686, 1.199) | 0.349, 0.137 |
| zeta, K = 16 | 0.980 (0.931, 0.995) | 1.050 (0.759, 1.359) | 0.352, 0.138 |
| zeta, K = 4 and factor e^{ch}, c = S1(full) - S1(model) | 0.931 (0.797, 0.983) | 0.918 (0.766, 0.973) | 0.856, 0.026 |
| zeta, K = 16 and e^{ch} | 0.980 (0.931, 0.995) | 0.978 (0.931, 0.993) | 0.996, 0.007 |
| DH, K = 16 | 0.976 (0.931, 0.994) | 1.076 (0.814, 1.357) | 0.431, 0.129 |
| DH, K = 16 and e^{ch} | 0.976 (0.931, 0.994) | 0.969 (0.922, 0.991) | 0.995, 0.009 |

v_coll is local. v_exit is not a function of the neighbours alone: the disk is fixed while the zero drifts with velocity
-S1/2 in v, and S1 contains the smooth part -pi/4 of the Gamma factor (all zeros drift by pi v/8 at large height). With that
one number added, 16 neighbours reproduce the ratio to 0.007.

### 6.3 Classification: closed

The ratio and its sign are the same for zeta and the two L-functions at matched density. DH differs from zeta in
v_coll/(g^2/2) (KS 0.09 to 0.14), and the difference falls to about the critical value (0.072 against 0.066 in one band, below it in the
other two) when the channels within 10 mean spacings of an off-line pair are removed; below its first off-line height the 33 DH channels are not distinguishable from zeta-type
channels. T-NR differs through the channels next to its off-line pairs (826 of its 2150 truncation checks fail there, and its
on-line list is zeta's). The test is a statement about the nearest zeros plus the archimedean drift, as the task text
expected; it uses no primes.

## 7. Table required by the task

| combination | statistic | sizes reached | zeta | L(chi) | DH | T-NR | E_a | heat tau < 0 | sign twist / unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | v <= B4, v <= B5 at off-line zeros; sign of the Euler bracket | DH 8138 pairs to 1e5; T-NR 1748; E_1/4 10,142; HEAT 275; zeta grid 91 points to gamma = 1e10 | no off-line zero; bound negative at all grid points; Euler bracket negative for sigma < sigma_0(gamma) in [1.09, 1.53] | no off-line zero in range | satisfies A4 and A5 at all 8138 | satisfies both | satisfies both (E < 0 at 736) | A4 violated at 1 non-topmost zero | undefined / same as zeta | closed (right of 1) |
| 2 | lg delta*(k) against gamma_k | 10,142 zeta zeros to 1e4 and 1240 at 1e5; L4 12,349; L3 5946; DH 12,137; T-NR 11,890; HEAT 1198 | slope -0.341096 | -0.341095 (bound available, kernel >= 0) | -0.341095 | -0.341103 | positive kernel, not run | -0.341077 | undefined / same as zeta | closed (collapses for zeta) |
| 3 | M at off-line zeros; kappa at on-line zeros | 20,303 off-line zeros; jets at 11,529 zeta zeros to 4.26e7; list form 1.0e8 zeros | kappa > 0 at all | kappa > 0 at all 18,295 | kappa < 0 at 5 of 11,570, each next to a pair; none below 85.7 | kappa < 0 at 637, each next to a pair | no on-line zero | kappa < 0 at 7, each next to a pair | undefined / same as zeta | closed (local, resolves the pair) |
| 4 | v_exit/v_coll | same channels as 2 | median 0.826 | 0.839, 0.842; KS within critical value | ratio as zeta; v_coll differs near off-line pairs | differs near off-line pairs | no on-line zero | v_coll = zeta's - 0.5 | undefined / same as zeta | closed (local + drift) |

## 8. Where it ran, limits, weakest steps

Server (through `rhrun`): validation; ZETA, DH and half of T-NR full analysis below 1e4; DH off-line rates 1e4 to 1e5; E_1/4;
HEAT; the zeta window at 1e5; the kappa windows; the list run on 1.0e8 zeros. The machine ran at load average 130 to 190 on 48
cores and each unit received about one core whatever its worker count, so the work was run as 8 units of one core each (the
lane's 8 cores). Unit names `rh-s3hz-*`; all stopped, none left running. Two incidents: (i) when the two first units
(6 + 2 cores) were replaced by the 8 single-core units, the stop command was lost to an ssh connection reset and both sets ran
together for about one minute before the old ones were stopped; (ii) the windows at 1.04e7, 4.26e7 and 1e6 were cut by time
(73, 74 and 1 zeros instead of 320, 220, 130). Mac (through `scripts/memcap.sh 8`, single processes): DH seeds, the two
L-function zero lists, L4 (all), L3 (every second zero), half of T-NR, grid, kernels, majorants, neighbour models. Several
Mac runs took 30 to 36 minutes, above the 20 minutes of the brief. No GPU stage: nothing here is GPU-shaped.

Not done: full analysis (combinations 2, 4) of DH above 1e4; zeta jets at 1e6; a second T-NR or E_a parameter; interval
enclosure of any circle minimum.

Three weakest steps.

1. The tracker of combination 4 follows one branch with Newton correction and no predictor; in 10 of 32,472 channels with a fold (ZETA, L4, L3, DH) it ended
   on a neighbouring root (detected by v_exit > v_coll). Undetected switches would move individual v_coll values; the
   distribution comparisons are based on thousands of channels and the neighbour model agrees with the full values to 2 %.
   11 to 18 % of the channels have no fold before 3 gbar^2 and are censored, and the truncation check removes 2 to 5 % of the
   checked channels for zeta and the L-functions and 17 to 52 % for DH, T-NR and HEAT (where a second pair or an off-line pair is close).
2. Completeness of the DH off-line list rests on window counts from the phase (40 windows, differences below 1.1 in absolute
   value) and on seeds limited to beta - 1/2 <= 1.2; the HEAT list is the table of another lane (not certified complete).
   A missing pair would change counts in the tables but not the classification.
3. The statement "A4 holds at non-topmost DH zeros" is MEASURED at five values of eta per zero, not proved; the one violation
   found (heat control) shows that it can fail when a higher neighbour is close.

## 9. Files

`chan.py` (jets, heat shift, positivity bound, per-zero analysis), `validate.py`, `run.py` (driver), `unit.sh`,
`unit_extra.sh` (server job lists), `mklists.py`, `lzeros.py`, `dh_seeds.py`, `winlist.py`, `kappa_list.py`, `grid1.py`,
`kern.py`, `maj.py`, `c4_local.py`, `analyze.py`; `analysis.txt` (all numbers above); `out_server/` (server records, one JSON
line per zero, and logs), `out/` (Mac records and logs), `data/` (zero lists).
