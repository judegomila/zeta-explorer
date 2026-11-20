# Geometric program synthesis (2026-11-16)

Source: 14 refereed lanes under `tmp/research-2026-11-16/push/g-*/` (RESULT.md + REFEREE.md each). Everything below is restricted to what a referee confirmed or corrected. Labels: PROVED / CLASSICAL / CERTIFIED (interval arithmetic) / MEASURED / OPEN.

Headline: no lane proves a new RH-relevant inequality and no bound moves. 12 lanes are precise obstructions, 2 are partial results (g-zero-channels, g-renderer-learnings). 12 of 14 referee reports hold; 2 found a definite error (g-symmetry-schur, g-torus-modular). No lane assumes RH. No lane found a step that uses the Euler product and fails for Davenport-Heilbronn (DH) except the terminal conclusion itself.

Notation: kappa = Phi(u/4) the theta kernel; H_c the PR 56 cutoff form, H_+/- its Mellin even/odd parts; L = xi'/xi(1/2 + x); P_ij = (L_i+L_j)/(x_i+x_j) the log-Pick bridge kernel; B_ij = -(L_i-L_j)/(x_i-x_j); T the coupling contraction of the bridge block form; DH = Davenport-Heilbronn function.

---

## 1. Referee-surviving results, exact statements

### 1.1 Bridge / antibridge algebra (g-antibridge-cancel) — PROVED, RH-free, Euler-free
- W(v_b +/- J v_c) = b'Pb + c'Pc +/- 2 b'Bc for one-sided exponential Weil tests, J: t -> -t.
- P + B = sum over zeros of phi_rho (x) phi_rho = 4 x_i x_j (-M[s_i,s_j]); P - B = 4 (sM)[s_i,s_j], with s = x^2, M = (log Xi)'.
- Schur complement = (P+B) P^{-1} (P-B).
- Each parity sector is positive on an interval iff RH (Loewner; "P >= 0 iff RH" is imported from the refereed eq48 result).
- Symmetrizing over the sign of the reflected field is the block congruence c -> -c. It removes B from the sum and leaves the whole target; the needed bound -P <= B <= P is the two sector statements.
- MEASURED: 1 - ||T|| about 1e-29 on six or seven real nodes for zeta.
- The "antibridge form" used is the lane author's definition. PR 49 attaches no coupling equation to the anchors q+-.

### 1.2 Coupling norm (g-coupling-norm) — PROVED unless marked
- ||T|| <= 1 on all splits is RH; strict < 1 on every finite split is also RH-equivalent; the sup is 1. On (1/2, inf) this is eq48 (a); on (0, 1/2] it follows from the zero-side formula.
- Thm 2: 1 - rho^2 = prod_k b_k^2 (1 - phi_k^2)/(1 - b_k^2 phi_k^2); under positivity 1 - rho^2 <= B_X(y)^2 (Hardy value).
- Thm 3-4 (under RH): 1 - rho^2 is a Christoffel function of the zero measure with explicit two-sided bounds. Upper asymptotic -2N log N + 2N loglog N + O(N) proved for bounded nodes; the matching lower side is MEASURED only and needs node separation plus zero-gap control.
- Thm 5: a uniform margin rho <= q < 1 along a nested real family forces a Blaschke node sequence, so the identity-theorem uniqueness argument is unavailable there.
- No reparametrization changes a singular value.
- CERTIFIED (Arb): 277 xi pivots positive to N = 100.

### 1.3 Symmetry of the loaded torus (g-symmetry-schur) — PROVED after one correction
- Thm 1: the symmetry group is exactly (Z/2)^3 = {1, D, R, A, C, DC, RC, tau} for every r > 1 and lens, including the real-axis fold C(u,v) = (-u,v) and the half-period translation tau = (u+1/2, v+1/2). C and tau do not appear in the zeta-view Klein-annulus notes.
- Thm 2: symmetry kills only the D-odd null sector and the Mellin even/odd cross blocks. Both isotypic components have infinite multiplicity, so Schur's lemma gives no sign. T = T_+ (+) T_-; T_- is target B unreduced, with an RH-equivalent even twin. Nothing is killed on one-sided Pick/Weil tests.
- Exact inter-sector identity: C_+ = ((t^2+s^2)/(2ts)) C_- minus a rank-two term (not a congruence).
- CORRECTED measurement: the EVEN sector carries 97.9% of the trace of H_c, the odd sector 2.1% (tr H_- = 6.63994e-4 alpha, tr H_+ = 3.07741e-2 alpha).

### 1.4 Odd sector structure (g-odd-sign-tp, g-odd-sign-factor, g-odd-adversary)
- PROVED (classical in content): RH <=> the Loewner kernel L_phi is strictly TP of all orders on (0, gamma_1^2)^2.
- MEASURED (three independent evaluations, 15 digits, on and off grid): H_- is not TP_5; minor with rows x = 0.1..0.5, columns y = 3.1..3.5 equals -3.10578223195232e-211. Strictly TP_4 on the tested grids in (0,4]^2 and near the origin (PR 56 J_4 certificate). The failing minors are non-principal and do not bear on the sign.
- PROVED up to a non-enclosed negligible theta tail: kappa is not PF_5; det[kappa^(i+j)(0)]_{5x5} = -3631834.016.
- PROVED: kappa(sqrt t) is not completely monotone, so kappa is not a positive Gaussian mixture.
- PROVED: for any non-degenerate positive Gaussian mixture H_-(x,y) < 0 entrywise and C_-(t,t) < 0; a single Gaussian gives H_- = 0; the set of kernels with H_- >= 0 is not convex.
- PROVED: on odd a, <a, H_0 a> = -2 alpha int_0^inf (kappa*a)((v rho kappa)*a) ds, rho = V'(v^2)/V'(0) - 1 >= 0. Valid for any positive even kernel with V'(0) > 0. It is an integration by parts and does not fix the sign.
- PROVED: without RH, Delta_- = -P + N, N >= 0 built only from off-line quartets, N = 0 iff RH; tr N of order 4e-61 alpha (estimate; restates verified height).
- PROVED (elementary): the cutoff c and alpha are trivial parameters.
- CERTIFIED (Arb): odd node Grams positive definite to 220 Gauss-Legendre nodes on spectral heights [0,170]; one-node sign positive on a 0.02 grid to t = 3000.
- MEASURED (reproduced to 10 digits, n <= 9): odd spectrum simple, lambda_1 = 6.6076462918e-4, fast decay, no gap.
- PROVED + CLASSICAL: for backward heat, PR 56's proved inputs (F), (G), (H) persist for every tau, while target B fails for every tau < 0 (Rodgers-Tao plus the Loewner direction extended to kappa_tau). MEASURED wrong-sign tests from tau <= -1.9.

### 1.5 Square root / scattering form (g-spinor-square-root) — PROVED
- (1.1) H_c on exponentials is the de Branges-type kernel of F + alpha F'.
- (2.1) H_c = A* M_c A with M_c = [[G+* G+, -S_QQ* G-],[-G-* S_QQ, -G-* G-]], G+/- the causal/anticausal Hankel blocks of C_0 = A*/A.
- H_c >= 0 iff G- = 0 iff RH, for each alpha > 0 and c. Negative index of H_c = rank G-.
- (3.1) <a, H_c a> = alpha sum_gamma y_gamma conj(y_gammabar) on a dense test class. H_c = D*D holds iff RH; otherwise only with the indefinite involution gamma <-> gammabar.
- Holds for any even F of order one, including DH.

### 1.6 Zero channels under heat flow (g-zero-channels)
- CERTIFIED (Arb plus confirmed tail bound; 60 of 1200 cells recomputed by the referee): 100 pairwise disjoint moving disk chains, each holding exactly one zero of F_tau, on the line, for all tau in [-0.1, 0.5]. Zeros between tubes for tau != 0 are not counted. This restates verified height.
- PROVED: wall-height law d/dtau log|W_k| = (1/4) sum_j (c_k - gamma_j)^-2 >= 2/g^2 while zeros are real.
- PROVED: d/dtau log(|W_k|/g_k^2) = S_k + R_k >= 0. This is a change of variable to X_yy(c_k), not a barrier.
- PROVED: Newton basins are the intervals between walls.
- MEASURED: absolute margin decays as exp(-0.768 gamma).

### 1.7 Renderer regularities (g-renderer-learnings)
- PROVED (Thm A, corrected to strict inequality): for order-1 entire F with the xi symmetries and pair-grouped Hadamard sum, Re F'/F < 0 in Re s > 1/2 only inside the open half-disks of radius b about the feet of off-line pairs. The finite bridge B_a is negative only within radius sqrt(b^2 - a^2).
- PROVED (Thm B): L_1/Xi^2 = sum_on 1/(t-gamma)^2 + sum_pairs 2(d^2-b^2)/(d^2+b^2)^2. The axis witness fires at a foot iff 2/b^2 exceeds the screening sum. An explicit symmetric entire control has an off-line quartet and L_1 > 0 on the whole line, so L_1 >= 0 is strictly weaker than zeros on the line.
- MEASURED: zeta 0 of 79,840 negative shear samples; DH 126 of 79,840, all inside the four known half-disks.
- These are localized forms of classical facts (monotonicity criterion; insufficiency of the Laguerre inequality).

### 1.8 Arithmetic gain (g-arithmetic-gain) — PROVED unless marked
- The PR 39 gain is the local pole-neutral Nyman-Beurling distance e_N(d,c) = 6 - sup_D |ell(zeta D)|^2 / int K_d |zeta D|^2, ell(v) = 6v - 6d v' + 2d^2 v'' at s_0 = 1/2 + d + ic.
- The gain |C|^2/V is a squared correlation. The three gain notes use integer dilations only: no signed prime sum, no Euler product.
- Multi-zero Gram lower bound.
- CLASSICAL: passing filters need coefficient mass >= 0.00897/|zeta(1/2+d+it)|, unbounded in height (Montgomery omega), under |a_n| <= A.
- A zero on the line at the anchor height forces sup|(zeta D)'| > 3.538/d (corrected constant).
- Gain certificates give only the local order-1 Weil test. They do not bound the coupling block B or the odd-sector form.
- PR 39 certified E, V, C, gain reproduce to 6 digits.

### 1.9 Passive cascade (g-passive-cascade)
- PROVED (Thm 1): for Re s > 1, xi'/xi = G(s) - sum_p [Z_p(s) - (log p)/2], Z_p = (log p / 2) coth(s log p / 2), each lossless positive-real relative to Re s = 0. The Euler product is a series connection of negated lossless stubs with the gamma one-port.
- PROVED (Prop 2): the scattering product form of R_a holds only in Re w > 1/2 + a, where |R_a| < 1 is unconditional.
- PROVED modulo classical inputs (Thm 3): R_a has no nonconstant inner factor periodic in Im w, no delay-line Schur step, and no single elementary first-kind Potapov section with interior node Re w_0 > max(0, 1/2 - a). Smaller nodes, boundary nodes and multi-delay sections are OPEN.
- PROVED (Prop 4): for DH, f'/f = lambda L1'/L1 + (1-lambda) L2'/L2 with lambda nonconstant meromorphic.
- MEASURED: the gamma reserve covers the worst-case draw of primes up to Q* = 37 at t = 1e12, Q* ~ (log t)^2/16.

### 1.10 Channel geometry (g-channel-geometry) — PROVED
- Thm A: any channel matrix Z = sum_rho 2 cosh^2(rho b) w_rho w_{-conj rho}^* has at most nu negative eigenvalues, nu = number of off-line pairs (a quartet counts as two). A restatement of Weil positivity.
- Thm B: PR 44 separated-tail positivity holds for the DH theta kernel with essentially the same margins.
- Thm C (given PR 29 eqs (1)-(2), corrected scope): the PR 29 separated-carrier proof is invariant under Lambda(n) -> eps_n Lambda(n), |eps_n| <= 1. It uses Chebyshev plus the pointwise bound, i.e. domination by Lambda. For eps_n = cos(t_0 log n) the mixed form has carrier value <= (1/2) log t_0 - c e^b at t_0 (reproduced: -13.9, -30.6, -77.0 at b = 4.5, 5.5, 6.5).
- Prop 2: the PR 29 sparse carrier family at e^(2b) > H_0 is infinite, non-explicit, and not implied by verified height.

### 1.11 Torus modular average (g-torus-modular) — surviving parts
- PROVED: averaging only the reference parameter r leaves the bridge form Q and its coupling norm unchanged.
- PROVED: for Re(s +/- w) > 1, the double Mellin integral of (theta(t/y) - 1)(theta(ty) - 1) equals 2 xi*(s+w) xi*(s-w). This is a product in the coordinates (t/y, ty), rank one on the critical line by continuation.
- PROVED: K_h/(2h) tends to the eq48 Pick/Weil kernel with O(h^2) error.
- CLASSICAL + algebra: the truncated Eisenstein Gram kernel has the block shape with a(s) = T^(s-1/2) xi*(2s), b(s) = a(1-s), positive for T >= 1.
- CORRECTED: K_{1/2}[xi] is the Schur kernel of phi(s)(s-1)/s (scattering quotient with its residual pole removed by a Blaschke factor).
- PROVED (elementary): no positive form with symmetric Laplacian exists on a space containing E*(z, rho/2).

### 1.12 Klein bottle seam (g-klein-bottle-seam) — PROVED, classical in content
- On a bounded convex symmetric window the loaded field on the Klein quotient has exactly two topological invariants: N_K = N_on + 2 N_right = (1/pi) x outer arg change, and the seam sign.
- Seam flux = pi N_on, so N_right = (outer winding - seam flux)/2pi.
- The non-orientable Z/2 torsion class is the Hardy sign (up to enclosed-zero parity). It changes by N_on mod 2 and is blind to off-line pairs.
- pi_0 of symmetric fields = Z>=0 x Z/2. On-line and off-line configurations with equal N_K lie in one component: no Klein-topological invariant excludes off-line pairs.
- Under heat flow (N_K, sign) is constant while no zero meets the window boundary; generic interior events only land pairs in forward time.

---

## 2. Cancellation and structural mechanisms, each with its DH outcome

| # | Mechanism | Nature | DH outcome |
|---|---|---|---|
| 1 | Bridge +/- antibridge: mixed partial fractions assemble into rank-one products per zero pair; B drops from the symmetrized sum | Block congruence c -> -c (polarization of one form). No norm reduced | DH satisfies every identity and passes real-node tests in both sectors. Separated only by continued-kernel complex nodes inside the zero strip (Re z about 0.33-0.51), not by an admissible one-sided test |
| 2 | Parity split T = T_+ (+) T_- from the (Z/2)^3 torus symmetry | Exact; kills cross blocks only | DH has the same symmetry group; both sectors negative on one-node tests at t = 85.7 and t = 114.2 (MEASURED) |
| 3 | Schur-Blaschke factorization of 1 - rho^2 | Exact; RH is only the sign of the Schur factors | Thm 2 and the indefinite Thm 3 hold for DH. DH pivots CERTIFIED positive through order 148, first negative at 149 on three unrelated nested families; further negatives at 150, 218, 219 |
| 4 | Odd-sector rank-two cutoff derivative: Gaussian part of kappa cancels exactly on odd inputs, leaving the convexity excess rho | Integration by parts; no sign | Identity and convexity hold for DH (grid), where the sign fails: odd spectral diagonal negative on t in [85.45, 85.95], D/(f^2+f'^2) = -18.47 at 85.75 |
| 5 | Hankel block form H_c = A* M_c A; energy = sum y_gamma conj(y_gammabar) | Exact; negative index = rank of anticausal Hankel block | Holds for DH. Negative index 1 per DH off-line pair in a local window (two zeros), 0 for zeta on the same nodes. Csordas convexity holds on a control with negative index 2 |
| 6 | Wall-height law; cancellation of the 2/q singularities so W_k/g_k^2 is monotone | Change of variable to X_yy(c_k) | All statements hold for DH on tau > tau* = 0.1765, where the off-line pair lands |
| 7 | Shear half-disk localization (sign of d^2 + x^2 - b^2 per off-line pair) plus on-line screening | Exact; classical content | Holds for DH; negative samples only inside the four half-disks; screening sums 0.8524, 0.9777, 1.0919, 1.2839 independently verified |
| 8 | Two-jet point evaluation over a twisted second moment (gain) | Exact; no cancellation | DH: e_N >= 2.209 for all N at (1/2, 85.6993) versus zeta 0.073 at N = 64. In 30 <= c <= 70 (no off-line DH zero) DH and L(s,chi_5) pass counts differ by at most 4 of 161 |
| 9 | Euler product as a series chain of negated lossless stubs | Exact for Re s > 1; stubs lossless on Re s = 0, not 1/2 | DH breaks at a parallel junction with nonconstant meromorphic weight lambda (Prop 4, confirmed at three zeros). DH analogue of Thm 3: OPEN |
| 10 | Zero-side channel form: on-line zeros PSD rank one, each off-line pair one hyperbolic plane | Restatement of Weil positivity | PR 44 separated-tail positivity holds for DH (Thm B). Sampled DH carriers negative (20 of 2000 at b = 5.5) |
| 11 | Modular unfolding: intertwining quotient xi*(2s-1)/xi*(2s) with argument offset 1 | Shift-1/2 member of a family whose shift-0 member is the Weil form | DH fails K_h below beta - 1/2 at two off-line zeros; passes at h = 1/2 and on the Gram kernel at all sampled heights. No DH zero with Re > 1 found for t < 12000 |
| 12 | Klein index: an off-line pair contributes 2, vanishing mod 2 | Topological; classical | Holds for DH on two windows (N_K = 5, N_on = 3; N_K = 6, N_on = 4, N_right = 1); mod-2 class unchanged by the pair |
| 13 | Sign-regularity order of H_- (TP_4, not TP_5) | Property of the Mellin coordinate, not the operator | DH passes positive entries, TP_3 and a 40-node PD Gram while its odd sign is false. Orders do not separate DH from Euler-product L-functions |

Common finding. Every mechanism is either an exact identity that holds verbatim for DH or a restatement of Weil/Pick positivity. An off-line zero at height gamma produces exactly one wrong-sign direction: a packet sin(gamma x/2) with wide envelope, relative size about e^{-pi gamma/2} (MEASURED DH eigenvalues -5.0e-57, -4.6e-77, -3.8e-113, -3.8e-119). The visible low-oscillation structure is the same for xi and DH.

Controls established for future tests:
- DH theta kernel: positive, even, Csordas-convex on all sampled points (MEASURED; not interval-certified).
- Backward heat family e^{tau u^2/16} kappa, tau < 0: PR 56 inputs (F), (G), (H) persist, target B fails.
- Sign twist Lambda(n) -> eps_n Lambda(n): excludes arguments that see primes only through sums of |Lambda| or mean values over t.

---

## 3. Results a referee broke

Definite errors (refHolds = false):
- g-symmetry-schur: the parity trace split was inverted. Claimed "odd sector carries 97.9% of the trace"; correct is even 97.9%, odd 2.1%. The sentence "the sector on which the Gram majorant vanishes is the dominant one" is false. Target B sits in the 2.1% sector. Theorems 1 and 2 unaffected.
- g-torus-modular: (i) "the Petersson norm is the h = 1/2 member of K_h" is false as stated; the first bracket alone has minimum normalized eigenvalue -1.28 (T = 1), the full kernel is positive. (ii) "the full modular average is the Maass-Selberg Gram kernel" is not derived; no integral of the bridge form or heat trace over the modular curve is computed. (iii) "the unfolding fixes h = 1/2" is OPEN beyond the Eisenstein constant-term mechanism. (iv) The P2 integrand is (theta-1)(theta-1), not theta theta; the rank-one factorization is a coordinate change.

Claims withdrawn or weakened inside lanes whose verdict held:
- g-odd-sign-tp: "STP_4 of H_- is weaker than RH" is wrong; STP_4 is logically independent of RH on present knowledge. "Order exactly 4" is a grid statement. "Orders track conductor" unsupported.
- g-odd-sign-factor: P is not "the Gram of critical-line zeros" (it contains the a_k parts of off-line pairs). ||H_-|| about 2e-2 alpha not computed. V_DH'' > 0 is a grid check.
- g-odd-adversary: "certificates restate verified height" is not a logical equivalence. "A proof by relative margin is impossible" shown only relative to the identity. Eigenvalue tables not interval-certified.
- g-coupling-norm: two-sided law on compact node sets false as stated (lower side needs node separation). Thm 4 upper bound for DH not proved. "Non-determining" overstates Thm 5. The "3.4 to 4 x index" horizon rule stays ARGUED.
- g-antibridge-cancel: cancellation of B is a coordinate change. DH "fails both sectors" holds only at complex nodes inside the strip. Quartet law constant is 2 Re(b^2)/delta^2.
- g-spinor-square-root: (3.1) is false as written for the order-2 control (extra (alpha/2)|phi(c)|^2 term). "Realises frontier (A) with D <= 0, so no margin" is an overreach (block signs are splitting-dependent). General inertia equality with the off-line zero count, Krein-space boundedness for infinitely many off-line zeros, and the Suzuki identification are not established.
- g-zero-channels: Section 6 identity off by a factor 4. Height-independent relative margin is partly a cell-width artifact. PR 57 comparison holds only for single-step delta = 0.05. Equivalences (iii)/(iv) and "no margin version exists" are not proved.
- g-arithmetic-gain: slope constant 3.62/d -> 3.538/d; kernel core about 0.9 d, not 0.3 d. Euler-blindness is a count statement; pass sets overlap on only 46-56 anchors at d = 1/2. Shear notes with sum Lambda(n) n^{-sigma} cos(t log n) terms were not analysed.
- g-passive-cascade: "the same statements hold for the DH ratio" unsupported (OPEN). The "only if" of the a >= Delta criterion is not unconditional. Term-by-term match to eq48 asserted, not computed.
- g-channel-geometry: "only |Lambda(n)| <= log n is used" is wrong (Chebyshev also needed). F_t0 is not an L-function countermodel. "Closing exceptional carriers requires Lambda >= 0 or Hecke structure" is not proved.
- g-renderer-learnings: Thm A false at the zeros with W <= 0 (needs W < 0). DH Thm B table was circular as presented (later verified independently). Catalogue counts overstated. The Section 6 statement on the PR 56 coupling norm exceeding 1 only from pairs with b > a is unproved.
- g-klein-bottle-seam: T4 (ind_- = N_right) is a definition-level restatement; identification with the negative index of the eq48 form is OPEN. Stored run log has an unconverged tau* = 0.173886; the reported 0.176505 comes from a separate script.

---

## 4. Status of the two targets

### Target A (coupling norm ||T|| <= 1): OPEN, RH-equivalent, no margin
- ||T|| <= 1 on all splits is RH. Strict < 1 on every finite split is RH-equivalent. The sup is 1.
- A uniform margin along a nested real family forces a Blaschke node sequence.
- 1 - ||T||^2 is a node-only Blaschke product times Schur-parameter factors in [0,1]; RH is the sign of those factors. Under RH it is a Christoffel function of the zero measure.
- Symmetrization (antibridge), r-averaging (torus), parity splitting (symmetry) and reparametrization leave every singular value unchanged.
- Measured size: 1 - ||T|| about 1e-29 at six or seven nodes; 1 - rho^2 = 6.723904095e-11 (PR 56 value reproduced).
- DH-blind at finite order: first DH failure at order 149.
- Gain certificates (PR 39) do not bound the coupling block.

### Target B (odd-sector sign Delta_- <= 0): OPEN, RH-equivalent
- T_- is target B unreduced; it has an RH-equivalent even twin. The odd sector carries 2.1% of the trace.
- No wrong-sign odd test found for the theta kernel (CERTIFIED Grams to GL-220 on [0,170]).
- Closed routes: Mellin-coordinate total positivity (TP_inf false, finite orders not an Euler detector); Gaussian-mixture representation (not available, and would give the wrong sign); curvature sign (Csordas convexity holds with negative index 2 on a control); symmetry/Schur's lemma; relative-margin estimates against the identity.
- PR 56's proved inputs (F), (G), (H) cannot decide target B: they persist under backward heat for every tau, while target B fails for every tau < 0.
- Requirement on any proof: it must use an input that fails for kappa_DH and for e^{tau u^2/16} kappa at every tau < 0.

---

## 5. Composition and next moves

### Which mechanisms compose
1. One operator, three presentations. The antibridge sectors (P +/- B = Loewner matrices in s = x^2), the symmetry sectors (T_+ (+) T_-) and the Hankel form (H_c = A* M_c A, negative index = rank G-) describe the same parity-split form. The operator identity between PR 56 H_+/- and the antibridge K_e, K_o is not yet proved, and neither is "negative index = off-line pair count". Proving both would merge mechanisms 1, 2, 5 and the Klein index N_right (mechanism 12) into one inertia statement. This is bookkeeping, not zero information.
2. Localization chain. Shear half-disks (7), the single wrong-sign packet of size e^{-pi gamma/2} (adversary), and the one-hyperbolic-plane-per-pair channel form (10) all say an off-line pair is visible only near its foot and at oscillation frequency gamma. They are consistent and compose into a test design: spectral coordinate, f(t)f(s) weight removed, where the DH failure is O(1) at one node.
3. Finite-order horizon. Schur-Blaschke root-locking (3) and the gain's unbounded cutoff (8) both show finite-order certificates see only low zeros. The identical DH failure orders 149, 150, 218, 219 on three unrelated families is unexplained; the referee notes it suggests an exact node-independent rule.
4. Where primes can enter. Passive cascade (9) and channel Thm C give the same constraint from two sides: the Euler product enters as negated stubs lossless on the wrong line, and any argument invariant under Lambda -> eps_n Lambda cannot certify exceptional carriers. The antibridge lane reduces the remaining lever to a sign input on sum Lambda(n) n^{-1/2} (v*v)(log n) that would make -M operator monotone. None of the 14 lanes found such an input.
5. Does not compose: Klein topology (12) with any definiteness statement; the modular h = 1/2 kernel (11) with the bridge form Q (no map was derived); Mellin-coordinate TP orders (13) with anything.

### Top 5 next moves for the geometric program
1. Fix the control pair and certify it. Interval-certify kappa_DH > 0 and V_DH'' > 0, and adopt {DH theta kernel, backward heat tau < 0, sign twist eps_n} as the mandatory filter for every proposed input to target A or B. Run tests in the spectral coordinate with the f(t)f(s) weight removed.
2. Attack the one identified lever directly: a Lambda(n) >= 0 input. Three concrete forms from the lanes: (a) the convolution-side prime sum sum Lambda(n) n^{-1/2} (v*v)(log n) and operator monotonicity of -M; (b) identity (3.3) of the odd-sign lane with Lambda(n) >= 0 used explicitly; (c) a pointwise bound on the carrier sum P(t) at X = t (3-4-1 style). All three must fail under Lambda -> eps_n Lambda.
3. Unify the definiteness side. Prove the operator identity between PR 56 H_+/- and the antibridge K_e, K_o; prove negative index of H_c = off-line pair count (Krein-Langer, bounded-type hypothesis for N/D); prove ind_-(Q_L) = N_right on the eq48 exponential class. Confirm with the PR 49 author's intent which antibridge form is meant, since PR 49 fixes no coupling equation.
4. Explain the DH failure orders 149, 150, 218, 219. Find the node-independent rule, and check that xi'/xi is of bounded type so the spread node family (geometric law, bounded Schur factors) is RH-determining. Any Euler input must act on the Schur parameters phi_k at all orders at once.
5. Zero-channel prime test. Test whether the envelope-subtracted sum of wall actions (a regularized log discriminant of xi) has an explicit-formula expression in primes that sees DH's divergence at finite truncation; if it is Euler-blind, close the lane. Add a winding count on the tube complement so the 100-channel certificate is complete.

Lanes to stop: Mellin-coordinate total positivity; Gaussian-mixture factorization; curvature-sign arguments on torus/Klein/sphere; coupling-norm margins; r-averaging; Klein topological invariants; gain as a route to targets A/B; extension of separated-carrier and separated-tail families; the h -> 0 axis sign L_1 >= 0.

---

## Lane index

| Lane | Verdict | Referee | File |
|---|---|---|---|
| g-odd-sign-tp | precise obstruction | holds | `g-odd-sign-tp/RESULT.md` |
| g-odd-sign-factor | precise obstruction | holds | `g-odd-sign-factor/RESULT.md` |
| g-odd-adversary | precise obstruction | holds | `g-odd-adversary/RESULT.md` |
| g-coupling-norm | precise obstruction | holds, 4 corrections | `g-coupling-norm/RESULT.md` |
| g-symmetry-schur | precise obstruction | one definite error (trace split) | `g-symmetry-schur/RESULT.md` |
| g-antibridge-cancel | precise obstruction | holds | `g-antibridge-cancel/RESULT.md` |
| g-spinor-square-root | precise obstruction | holds | `g-spinor-square-root/RESULT.md` |
| g-zero-channels | partial result | holds | `g-zero-channels/RESULT.md` |
| g-arithmetic-gain | precise obstruction | holds | `g-arithmetic-gain/RESULT.md` |
| g-passive-cascade | precise obstruction | holds, 4 scope corrections | `g-passive-cascade/RESULT.md` |
| g-channel-geometry | precise obstruction | holds | `g-channel-geometry/RESULT.md` |
| g-renderer-learnings | partial result | holds | `g-renderer-learnings/RESULT.md` |
| g-torus-modular | precise obstruction (weakened) | definite errors (P3, P4 iii/iv) | `g-torus-modular/RESULT.md` |
| g-klein-bottle-seam | precise obstruction | holds | `g-klein-bottle-seam/RESULT.md` |

Each lane directory also holds REFEREE.md. All paths are relative to `tmp/research-2026-11-16/push/`.
