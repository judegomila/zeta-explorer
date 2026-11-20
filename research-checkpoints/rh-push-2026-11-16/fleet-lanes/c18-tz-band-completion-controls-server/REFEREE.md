# REFEREE (adversarial, lens: general): c18-tz-band-completion-controls-server

Date: 2026-11-19. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction, outcomes (c) and (b), flags R1 to R4 all no.

## 0. Verdict of this report

**The verdict holds after two corrections (E1, E2).** The two PROVED steps were re-derived and confirmed. The recorded numbers were reproduced by an independent float64 implementation that shares no code with the lane, and the pattern was reproduced at a height, on windows and with sign chains that the lane did not run. No statement about zeros of zeta is made; RH is not assumed; no known theorem is presented as new. Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false.

What does not survive as written:
- **E1.** Verdict item 4 and reading 1 of section 4.2 ("no inequality of the form N(theta) with M of order 1 can separate zeta from a multiplicative sign chain in the lower part of the band"; "not separated ... at M = 1 or at M = 0") are statements about the 96-mode window only. With more modes at the same centres the chains fail and zeta does not (section 3 below). The sentence must be restricted to m = 96.
- **E2.** The "Reading" after Lemma L ("positive for every m and every placement exactly when the weights attached to non-real zeros do not occur") is not proved in the note and is false as an equivalence at fixed U.

## 1. PROVED steps, re-derived

**Lemma L.** Confirmed. With C_a h(s) = h(s - a) on [a, U]:
<h_j, C_a h_k> = e^(-i tau_k a) int_a^U e^(i (tau_k - tau_j) s) ds = (e^(-i tau_k a) - e^(-i tau_j a))/(i (k - j) Delta), using (tau_k - tau_j) U in 2 pi Z. Integration in mu gives A_jk = (F_k - F_j)/(i (k - j) Delta). Since A_kj has the same expression, A_jk + conj(A_kj) = 2 Im(F_k - F_j)/((k - j) Delta): real and symmetric. Diagonal: int (U - a) e^(-i tau_j a) d mu. Zero side: hat h_k(z) = (w e^(-i z U) - 1)/(i (tau_k - z)) with w = e^(i tau_k U) independent of k; hat h_k(z) conj(hat h_j(conj z)) = N(z)/((tau_j - z)(tau_k - z)) with N(z) = 2 - w e^(-i z U) - conj(w) e^(i z U). For real z, N = 4 sin^2(U (z - tau_0)/2). Correct.

**Arch compression.** Confirmed. Re psi(lambda + i x/2) = -gamma + int_0^inf [2 e^(-2a)/(1 - e^(-2a)) - 2 cos(x a) e^(-2 lambda a)/(1 - e^(-2a))] da, and cos(x a) is the multiplier of Re C_a, so the operator is a constant minus 2 Re A_mu with density e^(-2 lambda a)/(1 - e^(-2a)), as stated. Shifts a >= U compress to 0, which gives the tail E(tau) = sum_k e^(-(2 lambda + 2k + i tau) U)/(2 lambda + 2k + i tau); the first moment over (0, inf) is sum_k (2 lambda + 2k + i tau)^(-2) = psi'(z)/4, and the tail of the first moment is i E'. The diagonal U (const + Re psi) + 2 U Re E + 2 Re(psi'/4 - i E') and the off-diagonal (Im psi_k - Im psi_j + 2 Im(E_k - E_j))/(tau_k - tau_j) follow. Pole points +- i/2 (zeta) and +- i (1/2 +- a) (E_a), gamma parameters and constants are correct.

**Certification logic** (`tz.certify`). Correct as logic: d = 96 x (largest entry radius) bounds the spectral norm of the radius part; the pass test is an LDL factorisation in balls of the exact symmetric midpoint matrix shifted by 2M - d; the fail test is a ball Rayleigh quotient. The radius of the prime sums is hand-derived and was not audited here beyond the comparison in section 2.

**Nilpotency argument of section 5** (labelled ARGUED). Correct: every reflected atom has shift Lg - log n > u > Lg/2 at theta >= 0.55 (u/Lg >= 0.589), so the products of the shifts vanish, A^2 = 0, and A + A* has spectrum +- (singular values of A) on L^2[0, U]. Measured on the 96 modes by this referee: [-1.651, 1.673] Lg and [-1.368, 1.406] Lg at (1e6, w = 0, theta = 0.55 and 0.75).

## 2. Reproduction (independent code, numpy float64, direct prime sums, scipy digamma; run locally under `scripts/memcap.sh 8`)

Scripts in `/tmp/ref-c18tz/` (ref.py, caseA.py to caseE.py); nothing from `tz.py`, `run.py` or `engine.c` is imported.

- Form D at T0 = 1e6, windows w = 0, 3, 7, theta = 0.55, 0.85, 1.0, objects zeta, Liouville, chain00, chain05 (the lane's splitmix signs re-implemented), E_0.1, E_0.3: 54 smallest eigenvalues agree with the lane's records to 5e-9 absolute or better (largest difference 5.3e-8, at E_0.3 where the eigenvalue is -265). Example: zeta (w = 0, 0.55) 3.557366528 against 3.5573665271.
- DH at 1e6 (own convolution recursion for -F'/F, conductor 5, lambda = 3/4, const log 5 - log pi): nine cells agree to all eight printed digits (for example w = 0: 1.34839726, -6.11771669, -26.80016476 at theta = 0.55, 0.65, 0.85).
- Form C for zeta at 1e6 (w = 0, 5; theta = 0.55, 0.75): -10.61428527, -10.20177764, -9.41494954, -7.79754993, equal to the lane's values to eight digits; atom counts 31 and 4; the "without reflected" values agree as well.
- Record tally from the `res_*.jsonl` files (own script): 44600 distinct cells (160 cells of the 1e6 Form C run occur twice, with equal keys); 229 undecided (227 zeta at theta >= 0.95, 2 chains); zeta Form D at theta <= 0.85: 640 of 640 certified positive and enclosed; Form C zeta: 600 of 600 cells with an atom negative at M = 0 and M = 1, s from -1.733 to -0.161, reflected norm 0.678 to 2.511 Lg; chains and Liouville in Form C: 14987 of 15000 negative at M = 1; chain counts of section 4.2 as printed. No sign record contradicts its float eigenvalue.

## 3. New cases (not in the lane)

**Explicit formula at other heights (K2 with a different case).** Prime side against zero side (35673 Arb zeros below 3e4, both signs, smooth tail by quadrature): (T0 = 2000, t_w = 2003.7, theta = 0.7): largest entry difference 1.1e-9, smallest eigenvalue 0.165973 on both sides; (2000, theta = 1): 3.5e-8, eigenvalue 0 on both sides; (3500, t_w = 3503.7, theta = 0.85, where u > Lg): 1.3e-8, eigenvalue 0 on both sides. Arch, pole, signs and normalisation confirmed.

**Controls at T0 = 3e6** (16 windows t_w = 3e6 + 97 w + 13, eight chains drawn with numpy's generator, not the lane's hash). s = lambda_min/Lg.

| theta | zeta s min, median | chains pass M = 0 / M = 1 (of 128) | chains median s | Liouville pass M = 1 (of 16) | E_0.1 pass M = 1 | E_0.3 pass M = 1 |
|---|---|---|---|---|---|---|
| 0.55 | 0.125, 0.214 | 123 / 128 | 0.237 | 16 | 16 | 0 |
| 0.65 | 0.046, 0.133 | 105 / 123 | 0.097 | 16 | 16 | 0 |
| 0.75 | 0.011, 0.051 | 32 / 104 | -0.054 | 13 | 2 | 0 |
| 0.85 | 0.004, 0.012 | 5 / 45 | -0.208 | 9 | 0 | 0 |
| 0.95 | 0 (abs below 1e-7) | 0 / 11 | -0.345 | 2 | 0 | 0 |
| 1.0 | 0 (abs below 1e-7) | 0 / 2 | -0.403 | 1 | 0 | 0 |

Same picture as the lane's table: zeta positive below the Nyquist band and 0 above it; chains pass at theta = 0.55 with zeta's median margin and fail in 91 to 98 percent of cells at theta >= 0.95; E_0.1 passes at low theta; E_0.3 fails everywhere. Liouville follows the identity D_Liouville = -D_zeta + (convergent square part): lambda_min(Q_Liouville) is about 2 Lg - lambda_max(T_Z/U) (0.55: 2 - 1.748 = 0.252 against the measured 0.244), so the Liouville row is a measurement of zeta's upper frame bound and carries no information separate from zeta.

**ZQ at 1e6 on six windows between the lane's** (t_w = 1e6 + 128 w + 64, zeros from Arb): eta = 0.05 passes at M = 1 in 6 of 6 windows at theta = 0.55, 0.75, 0.85 (smallest eigenvalues 1.48 to 3.39, -0.26 to 0.84, -0.44 to 0.02); eta = 0.25 passes at M = 1 in 5 of 6 at 0.55 and in 0 of 6 at 0.75 and 0.85. Agrees with the lane.

**Form C, phase scan (T0 = 3e6, 12 windows).** The reflected part was multiplied by e^(i phi), 64 values of phi in [0, 2 pi) (this includes the opposite overall sign). The best value of s over all 64 phases is negative in every window: theta = 0.55 (44 atoms): -1.21 to -0.60; 0.65 (16 atoms): -1.19 to -0.63; 0.75 (4 atoms): -0.72 to -0.52. At the registered phase: medians -1.02, -0.95, -0.67. Outcome (c) therefore does not depend on the sign or phase convention of the registered formula. It still depends on the registered weights (Lg - log n)/log n and on the linearisation (the lane says so in weakest step 1).

**Mode-count test (basis of E1).** T0 = 1e6, ten centres t_w = 1e6 + 2000 w + 500, twelve chains, the same form on m consecutive modes:

| theta | m | window width | zeta s min, median | chains pass M = 0 (of 120) | chains pass M = 1 (of 120) | chains median s |
|---|---|---|---|---|---|---|
| 0.55 | 96 | 79 | 0.120, 0.228 | 115 | 120 | 0.238 |
| 0.55 | 384 | 318 | 0.099, 0.163 | 100 | 120 | 0.114 |
| 0.55 | 1536 | 1270 | 0.078, 0.116 | 71 | 119 | 0.017 |
| 0.65 | 96 | 67 | 0.071, 0.124 | 95 | 119 | 0.076 |
| 0.65 | 384 | 269 | 0.040, 0.061 | 39 | 107 | -0.028 |
| 0.65 | 1536 | 1075 | 0.033, 0.046 | 1 | 68 | -0.148 |

Float values, no certification. At theta = 0.65 the chain pass rate at M = 1 falls from 99 percent (m = 96) to 57 percent (m = 1536) and at M = 0 from 79 percent to 1 percent, while zeta stays positive. At theta = 0.55 the chains keep M = 1 at m = 1536 but lose the equality with zeta's margin (median 0.017 against 0.116; 41 percent negative at M = 0).

## 4. Errors and required corrections

**E1 (verdict item 4; section 4.2 reading 1; proposed map text). Overstated.** The passes of the chains are passes on 96 modes. The smallest eigenvalue is non-increasing in m, zeta's form is non-negative for every m (zeros on the line at these heights), and the chains have no such floor. The table above shows the pass rates are a function of m. In addition, the lane's own data at m = 96 show a per-window failure rate above 0 at theta = 0.55 with M = 1 (1, 1, 1, 8 failing cells of 960; 8 of 24 chains fail in at least one of 40 windows at 1e12), so the data do not support "N(0.55) with M = 1 holds for a chain in every window". Corrected statement: "on 96 modes, in a typical window, N(theta) at theta = 0.55 does not distinguish a chain from zeta at M = 0 or M = 1; the distinction appears as m grows (measured at m = 384 and 1536 at 1e6) and for theta >= 0.75". Outcome (b) remains valid through ZQ eta = 0.05 (a control with off-line zeros that passes at M = 1 at theta <= 0.75; smallest eigenvalue at M = 0 positive in most windows), E_0.1 at low theta and height, and DH at (1e6, 0.55); for the chains it is valid at m = 96 only. The m-dependence of ZQ, E_0.1 and DH was not tested by the lane or by this referee.

**E2 (section 2, "Reading"). Unproved and false as an equivalence.** Real zeros give N(z) >= 0 and a positive form: that direction is immediate. The converse at fixed U is not shown, and it fails in general: the Weil form restricted to tests of small support is positive without any hypothesis on the zeros (Yoshida), and the lane's own ZQ eta = 0.05 object is non-negative at M = 0 in 40 of 40 windows at theta = 0.55. The sentence is not used later. Replace by "positive when all zeros are real; the converse needs every U".

**E3 (section 4.1). The margin is a property of m = 96.** "Margin 0.22 to 0.26 Lg at theta = 0.55" and "new against c17: the lower frame bound of zeta's ordinates" are values for 96 modes. At m = 1536 the median is 0.116 Lg and the minimum 0.078 Lg at 1e6. The statement "not shrinking with t" was checked at fixed m only. The note says "on a 96-mode window"; the map text should carry "96 modes" next to each margin (it does in the first clause; keep it).

**E4 (section 4.1, first bullet). Wording.** "It must be [positive]: ... the zeros to this height are on the line" is the verified height used as a code check, which is legitimate and stated as such in R4. Strictly, Q_D contains every zero; the positivity rests on the verified height plus the negligible weight of distant zeros. No new information about zeros is claimed, and none is obtained.

**E5 (certification scope).** Signs at 1e8, 1e10, 1e12 are certified relative to the hand-derived radius; K3 and this referee's reproduction cover 1e6 only (agreement there 5e-9, against a radius of 1.8e-10 per entry and d = 1.7e-8 in the lane's records, so the float reproduction neither confirms nor contradicts the radius at that level). The engine at 1e10 and 1e12 was not re-run. Indirect support: 640 of 640 zeta cells positive with margins down to 0.004 Lg. The lane states this in weakest step 2. "Certified" in the map text should read "certified relative to a hand-derived radius".

**E6 (not re-run by this referee).** T-NR; any cell at 1e8, 1e10, 1e12; K1; the pivot table of section 6 beyond the four "without reflected" values in section 2. Minor: the note is dated 2026-11-20 (server clock); section 10 reports one gcc compile run directly over ssh, which the brief's rule 2 does not cover (compile, not a computation) but should stay an exception.

## 5. Checks requested by the assignment

- RH assumed anywhere: no. zeta's positivity is taken from the verified height and labelled as such.
- Verified height restated as a result: no. Section 8 (R4) says the positivity was read off the verified zeros.
- Known theorem presented as new: no. Lemma L is the standard Loewner/Pick form of a band-limited Weil functional and is presented as a computational identity; the note itself links it to the earlier Pick lanes.
- Zeta-only mechanism claimed: none. Controls were nevertheless run (sections 2, 3): chains, Liouville, E_a, DH, ZQ.
- Pre-registration: `PREREG.md` precedes the runs by file time (local 20:47, which is 04:47 UTC; the first server unit of the lane is stamped 04:52 UTC); the failed predictions (chains, DH) are reported as failed; deviations (i) to (vi) are listed.

## 6. Requirement flags (set by this referee)

- R1 false. No step uses multiplicativity; completely multiplicative chains pass the 96-mode form at low theta.
- R2 false. 40 windows at four heights and 96 modes; nothing uniform is proved.
- R3 false. ZQ eta = 0.05, E_0.1, DH and the chains pass in parts of the band; the failures are by zero location or absence of the functional equation.
- R4 false. Form D for zeta is the Weil functional on a window with positivity from the verified zeros; Form C fails for zeta.

## 7. Surviving claim

MEASURED, signs certified relative to a hand-derived radius, 96 Fourier modes, heights 1e6 to 1e12, 40 windows: (c) the registered reflected completion (atoms n -> t/(2 pi n), weights Lambda(n)(Lg - log n)/(sqrt(n) log n)) is not a positive extension of zeta's data: zeta fails it in 600 of 600 cells, and at 3e6 for every global phase of the reflected part (referee, float). (b) N(theta) on 96 modes: zeta positive in 640 of 640 cells at theta <= 0.85 and 0 within the radius at theta >= 0.95; ZQ eta = 0.05 passes at M = 1 to theta = 0.75; E_0.1 and DH pass at low theta; sign chains pass at theta = 0.55 in a typical 96-mode window and fail in 94 to 98 percent of cells at theta >= 0.95. The chain passes depend on the number of modes (referee: at theta = 0.65, 57 percent at M = 1 and 1 percent at M = 0 with 1536 modes), so no conclusion about separation of chains by N(theta) on wider windows follows. No statement about zeros of zeta. No bound moves.
