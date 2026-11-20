# s6-euler-shape-identification-pole-lattice: RESULT

Date 2026-11-20. Screening arm, batch of four identification combinations. Scope: this directory only.
Nothing committed or pushed. No independent referee has read this file.
**No statement about zeros of zeta is made. No test of the batch is a survivor.**

Labels: PROVED (elementary argument written here) / CLASSICAL (recalled, not opened) / MEASURED (precision
stated) / RELATIVE (to a row on file) / NOT RUN.

Sources read: `BRIEF.md` to the end; lanes `c20-euler-shape-rigidity-infinite-modified-primes`,
`c21-br2-sparse-pole-lattice-natural-boundary-or-twin`, `c21-br2-relative-product-pole-lattice-census-server`
(PREREG only; it has no RESULT file), `c16-pos-fe-u2-positivity-rigidity`, `c21-twin-screen-ts`,
`n1-maass-selberg-norm`, `c16-u6g-scattering-fe-rank2-bridge-stage-a`; `OBSTRUCTION_MAP.md` section 2 and
row D9; the twelve nodes of `engine/IDEA_GRAPH.json` named in the assignment.

## 0. Summary table

Order of every test as assigned: (i) premise on zeta at two sizes; (ii) L(chi_-4), L(chi_5); (iii) E_a =
zeta(s+a) zeta(s-a) and T-NR at q = 1000003 (c = 2.2); (iv) Davenport-Heilbronn (DH), backward heat, sign twist,
unimodular twist.

| # | combination | statistic | sizes reached | zeta | L(chi_-4), L(chi_5) | E_a | T-NR q = 1000003 | DH | heat tau < 0 | sign twist | unimodular twist | object enters through | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | sparse pole lattice + identification relaxation + twin screen | minimum over phases of the normalised functional-equation residual R(abs S), S = primes nearest exp(k^2) | abs S = 1..40 (log p up to 1600), 4000 points, float64 search (22 starts) then 100 digits | R = 0.4915, 0.9203, 0.9967, 0.9975, 0.9980, 0.9988, 0.9995, 0.99994 at abs S = 1, 2, 3, 4, 5, 6, 8, 10; 1 - 9e-12 at 15; 1 at 20, 30, 40. Twin hypothesis fails at every size; R increases to 1 | same number: the base cancels | same number | same number | same number | same number (it has the functional equation) | zeta(2s)/zeta(s): R = 0.965 .. 1 (abs S = 1..20) | zeta(s + 1.7i): R = 0.862 .. 1 (abs S = 1..20) | not at all | closed: no twin in the family; no control can fail |
| 2 | Euler-shape rigidity + positivity rigidity + de Branges family | sigma_min(P, T) of the Jacobian of the relative residual at alpha = 1, and its exponent in P | P = 100 .. 3e4, T = 1e2 .. 1e7, 2000 .. 12980 heights on two lines (P = 1e5 not completed) | sigma_min (real unknowns, T = 1e5) = 0.259, 0.179, 0.118, 0.0771, 0.0539, 0.0401 at P = 1e2, 3e2, 1e3, 3e3, 1e4, 3e4: local exponent -0.34 to -0.27; frame constant 0.92 .. 0.64; collapse to 1e-15 when T is small against P | chi(p) in the local factor: 0.0539, 0.0539 at P = 1e4, T = 1e5 (zeta: 0.0539) | same matrix | same matrix | same matrix | same matrix | no functional equation; first-order repair of the defect: 0.967 to 0.955 (unimodular case; P = 1000) | same | not at all | closed: the rigidity constant is a property of the frequencies log p |
| 3 | lacunary cone + regular-representation bridge + Bost-Connes states | lambda_min and lambda_max of the Gram matrix of dilates A_N(sigma); local exponent of lambda_min at sigma = 1/2 | N to 3e6 (zeta-type, sparse factorisation); N to 1e4 dense (all objects; N = 16000 and 20000 not completed) | lambda_min = 0.01746 (N = 1e3) .. 0.003033 (N = 3e6); local exponent -0.27 .. -0.18, drifting to 0; lambda_min x lambda_max = 0.39 at every N | chi_-4: 0.0650 .. 0.01263, exponent -0.25 .. -0.17; chi_5: 0.0245 .. 0.00492, exponent -0.25 .. -0.17 | lambda_min 7.0e-5 (N = 1250) .. 2.1e-5 (N = 1e4), exponent -0.54 (a = 0.02) | identical matrix for N < q (exact) | 0.155 .. 0.110, exponent -0.16; larger than zeta's | not applicable (no coefficient function) | identical spectrum (exact; checked to 3e-15) | identical spectrum (exact; checked to 3e-15) | coefficients (sizes and correlations); zeros only in the limit N -> infinity and then only zeros with Re s > sigma | closed: three controls have zeta's matrix |
| 4 | Lax-Phillips norms + scattering exact normalisation + isogenous points | first order with a negative pivot of the rank-one Maass-Selberg Gram, Y = 1, 1.01, 2 (and 0.9) | order 400, 4000-bit balls (window t in [2, 102]); order 400, 3000 bits (t in [2, 402]); order 400, 1024 bits (t to 10025) | positive to order 391 at Y = 1 (precision exhausted at 392), 400 at Y = 2; negative at order 16 for Y = 0.9 | positive to order 400 for Y >= 1; negative at order 64 for Y = 0.9 | negative at order 48 (Y = 1), 80 (Y = 2) | positive to order 400 at every Y, including 0.9 and 0.5 | positive to order 400 for Y >= 1 | NOT RUN | zeta(2s)/zeta(s): negative at order 25 (Y = 1) | zeta(s + 1.7i): positive to order 400 for Y >= 1 | poles of the scattering quotient in Re s > 1/2: zeros of F with real part above 1, and the pole structure at s = 1 | closed: DH, T-NR and the unimodular twist pass at every size reached |

Survivors: none. In tests 1 and 2 the object does not occur in the statistic. In test 3 the statistic is a
function of the coefficient correlations and three controls have exactly zeta's matrix. In test 4 the statistic
reads zeros to the right of 1 only, as the assignment expected.

Compute. Server units (all through `rhrun`, CPU only): `s6esi-g3s` (sparse Gram, 4 cores, 10 GB), `s6esi-g3d`
(dense Gram to N = 5000), `s6esi-j2`, `s6esi-j2b3`, `s6esi-j2c` (Jacobian), `s6esi-t1` (twin residual),
`s6esi-m4`, `s6esi-m4w2` (Maass-Selberg Gram, 8 cores, Arb), `s6esi-g3d20k` (stopped unfinished). GPU 1 was not used: 90.9 of 96 GB
of its memory were held by other lanes at launch, so every float64 stage ran on CPU. For most of the session the
machine had 38 to 46 GB available and the wrapper refuses a job unless 40 GB remain free after its request; the
dense Gram runs at N = 10000 and 16000 therefore ran locally through `scripts/memcap.sh 8` (numpy), and requests
on the server were kept at 2 to 11 GB. Load average on the server was above 100 during the runs (88 on the
Mac). Not completed: the Jacobian at P = 1e5 (unit `s6esi-j2c` was killed by its 6 GB memory limit; by the rule
it was not relaunched with more), the dense Gram at N = 20000 on the server (no row after 35 minutes at about
1.6 effective cores; stopped) and at N = 16000 locally (stopped), the dense Gram at N = 10000 for sigma = 1 and
1.2 (local, stopped), the remaining rows of design W3. All units of this lane were stopped at the end; none is
running.

## 1. Test 1: sparse pole lattice, twin residual

**Object and finite consequence.** S_n = {p_1, .., p_n}, p_k the probable prime nearest to exp(k^2)
(3, 53, 8101, 8886113, 72004899319, ..; p_40 has 695 digits). m(s) = prod over p in S of
(1 - p^-s)/(1 - alpha_p p^-s), alpha_p = p^(1/2) e^(i theta_p), G = F m. If the base F satisfies
Lam_F(s) = Lam_F(1 - s), the functional equation of G is the identity m(s) = m(1 - s): the base cancels
(PROVED, one line). The statistic is rho(s) = (m(s) - m(1-s))/sqrt(abs(m(s))^2 + abs(m(1-s))^2) and
R = root mean square of rho over 4000 points uniform in Re s in [-1, 2], abs(Im s) <= 200, abs(Re s - 1/2) >= 0.02
(seed 20261120). A twin has R = 0. Survival of the twin hypothesis = R(n) decreasing.

**Why R tends to 1 (PROVED, elementary).** For Re s = 1/2 + d, d > 0, with u = p^-s:
abs(f_p(1-s)) <= (1 + p^(d-1/2))/(p^d - 1) and abs(f_p(s)) >= (1 - p^(-1/2-d))/(1 + p^-d), so
abs(m(1-s)/m(s)) <= prod over S of p^-d C_p(d), C_p(d) -> 1 as p^d -> infinity, for every choice of phases. With
log p_k = k^2 the product is at most C exp(-d (n^3/3)): one of the two terms of the residual is negligible and
abs(rho) -> 1 at every point off the line. The measured 1 - R at n = 15 (9e-12) is e^(-0.02 x 1240).

**Validation.** Overflow-safe float64 product against mpmath at 60 digits: relative error 8e-13; closed form
f_p(1-s) = (1/alpha)(p^s - p)/(p^s - alpha) for real alpha: 8e-17. The minimum found in float64 is re-evaluated
at 100 digits on all 4000 points (agreement to 12 digits in every row).

**Controls.** Every base with a functional equation gives the same number: zeta, L(chi_-4), L(chi_5) (with
chi(p) in the numerator of the local factor), E_a, T-NR, DH (no Euler product; G = DH m), backward heat (even
kernel). Bases without it (zeta(s + 1.7i), zeta(2s)/zeta(s)) enter through q(s) = Lam_F(1-s)/Lam_F(s); R is
0.862 and 0.965 at n = 1 and 1 at n = 20. The object enters not at all (bases with the functional equation) or
only through the size of q (bases without).

**Classification: closed.** No twin in the family at any size, in agreement with Theorem W of
`c21-br2-sparse-pole-lattice-natural-boundary-or-twin` (natural boundary). The test cannot fail a control because
no control occurs in it. No phases are reported as a candidate: the optimisation changes R in the third digit
at n <= 10 and not at all at n >= 15.

## 2. Test 2: Jacobian of the functional-equation residual at alpha = 1

**Object and finite consequence.** G_alpha = F prod over p <= P of (1 - a_p p^-s)/(1 - alpha_p p^-s) (a_p the
parameter of F at p). With r(s) = Lam_G(s) - Lam_G(1-s) and r = 0 at alpha = a:
d r/d alpha_p = Lam_F(s) (g_p(s) - g_p(1-s)), g_p(s) = 1/(p^s - a_p) (PROVED; checked against finite differences
of the exact residual at 30 digits, error below 8e-12). After division by Lam_F(s) the Jacobian is
J[(s), p] = g_p(s) - g_p(1-s): **the base F does not occur.** No approximate functional equation is needed: for
finitely many modified primes the residual and its derivative are exact. Rows: heights uniform in (0, T]
(seed 20261120), Re s in {1/2, 1/4}; sigma_min is normalised by the square root of the number of rows.
"Frame constant" is sigma_min after scaling every column to unit norm. On Re s = 1/2 the entries are purely
imaginary (2i Im g_p), so complex unknowns decouple there.

**Result (MEASURED, float64 SVD; Gram route for P = 3e4, where values below about 1e-7 would not be resolved).** Full table in section 7.
- T >= P: frame constant 0.92 (P = 100) to 0.64 (P = 3e4): no near-twin direction; sigma_min is the column
  size times a bounded factor. Local exponent of sigma_min in P between -0.34 and -0.27; the column norm of the
  Re s = 1/4 rows is p^(-1/4) and of the Re s = 1/2 rows p^(-1/2).
- T small against P: collapse. P = 1e4: sigma_min = 5.4e-2 (T = 1e5), 4.4e-2 (T = 1e4), 2.0e-6 (T = 1e3),
  8e-16 (T = 1e2). The smallest singular vector sits on neighbouring primes (9431, 9433, 9437; 2687, 2689, 2693):
  the frequencies log p and log p' are not resolved when T (p' - p)/p is below 1. Re-evaluated with mpmath at
  40 digits: Rayleigh quotient of the float64 vector 8.39963e-6 (P = 1000, T = 100; float 8.39963e-6) and
  1.56e-15 (P = 3000, T = 100).
- Positivity-preserving directions (real alpha_p in [0, 1], i.e. one-signed real perturbations): the smallest
  real singular vector is never one-signed. Projected-gradient upper bound for the minimum over the cone:
  0.063 at P = 1e4, T = 1e5 (sigma_min real 0.054) and 0.067 at P = 1e4, T = 1e2 (sigma_min real 8e-16): the
  collapse at small T is not available inside the cone; a one-signed change of the parameters at unresolved
  neighbouring primes changes the mean, which the test sees.
- L(chi_-4), L(chi_5) (parameter chi(p)): sigma_min = 0.05388, 0.05387 at P = 1e4, T = 1e5 against 0.05387 for
  zeta. E_a, T-NR, DH, heat: the same matrix as zeta, exactly.
- Bases without the functional equation (P = 1000, T = 1e4, 4000 heights, rows A g_p(s) - B g_p(1-s) normalised):
  zeta(s + 1.7i): sigma_min 0.0856 (zeta: 0.0872), and the first-order repair of its defect by 168 complex
  parameters lowers the rms from 0.967 to 0.955. zeta(2s)/zeta(s): sigma_min 0.0241, rms 0.991 to 0.976. The
  defect of a base without the functional equation is not repaired by the local parameters to first order.

**Classification: closed.** Local rigidity at alpha = 1 holds in the linearisation with a constant that depends
on (P, T) only through the resolution of the frequencies log p, for every base alike. The near-twin directions
at T below about P/2 are reason 2 of the twin screen (invisibility at a stage) in Jacobian form. The object
enters not at all.

## 3. Test 3: Gram matrices of dilates

**Object.** F = sum a(n) n^-sigma e_n in l^2(N), D_i e_n = e_(in) (the isometries mu_i of the regular
representation), A_N(sigma)[i, j] = <D_i F, D_j F>/<F, F>, i, j <= N. With g = (i, j), i' = i/g, j' = j/g:
A[i, j] = (i' j')^-sigma sum_k a(k i') conj a(k j') k^(-2 sigma)/Z. For zeta this is (i, j)^(2 sigma)/(ij)^sigma
(normaliser zeta(2 sigma)); at sigma = 1/2 the normaliser is the coefficient of the pole (limit sigma -> 1/2+).
For multiplicative a: A[i, j] = U(i') conj U(j') with U multiplicative. For DH (period 5, real coefficients):
A[i, j] = (i' j')^-sigma T[i' mod 5, j' mod 5] with an explicit 5 x 5 table.

**What is known (CLASSICAL, Hedenmalm-Lindqvist-Seip 1997, recalled).** As N -> infinity, lambda_min and
lambda_max tend to inf and sup of abs(F)^2/Z over Re s > sigma. So in the limit the statistic reads whether F
has a zero in the open half-plane Re s > sigma; at sigma = 1/2 both limits are 0 and infinity for zeta
unconditionally, and for sigma <= 1.12 the limit of lambda_min is 0 for DH because of its zeros to the right of 1.

**Exact statements (PROVED, one line each).**
- Completely multiplicative unimodular f (unimodular twist n^(-i alpha), sign twists): A_f = D A_zeta D^* with D
  diagonal unitary. Same spectrum at every N and sigma (checked: 3e-15; DHsgn and DHabs rows agree to all digits).
- L(chi): A splits into blocks by the part of the index dividing the conductor; each block is the zeta-type
  matrix on integers prime to the conductor.
- T-NR (coefficients 1 + c sqrt(q) [q | n] + q [q^2 | n]): U(p^v) = p^(-sigma v) for p != q, so the matrix is
  zeta's for N < q = 1000003.
- Index set {4^k}: a Toeplitz matrix read from the Euler factor at 2 alone; for zeta eigenvalues in
  ((1-r)/(1+r), (1+r)/(1-r)), r = 4^-sigma (0.333 to 3 at sigma = 1/2; measured 0.347, 2.494 with 7 nodes); DH
  gives the same matrix up to signs. The source floor 3.6346e-4 belongs to a different operator (the Pick
  operator of xi'/xi on the nodes 4^k) and was not recomputed.
- Sparse route: A = C^T C, C = diag(sqrt J(d)) [d | i] diag(i^-sigma), J = mu * id^(2 sigma), and C^-1 is the
  Moebius matrix; lambda_min = 1/lambda_max(C^-1 C^-T). Dense and sparse agree to 1e-15 at N = 300 and to all
  printed digits at N = 1e4.

**Result (MEASURED; float64, residual of the extreme pairs 1e-11 or below; mpmath eigsy at 30 digits at N = 160
agrees to 13 digits).** sigma = 1/2, all n: lambda_min = 0.01746, 0.01294, 0.00960, 0.00748, 0.00578, 0.00464,
0.00369, 0.00303 at N = 1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6; local exponents -0.273, -0.248, -0.227, -0.214,
-0.200, -0.189, -0.180: not a power law, the exponent drifts toward 0. lambda_max has the mirrored exponents
and lambda_min lambda_max = 0.392 .. 0.389. Controls:
- unimodular twist, sign twists: identical. T-NR: identical below N = 1000003 (its matrix at N = 3e6, which
  differs in the rows q and 2q, was not computed).
- E_a: lambda_min 200 to 1100 times smaller than zeta's and exponent -0.54 (a = 0.02), -0.62 (a = 0.2) at
  N = 5000 .. 10000: degree two, abs(a(p)) near 2.
- DH: lambda_min 0.155 .. 0.110 (N = 1250 .. 10000), exponent -0.16; lambda_max 9.5 .. 15.4, exponent 0.22.
  The completely multiplicative comparison with abs(f(p)) = abs(a_DH(p)) has lambda_min 0.262 .. 0.212
  (exponent -0.15) and lambda_max 3.5 .. 4.2 (exponent 0.14). So DH differs from zeta at the smallest N, and the
  difference is not a function of abs(a(p)) alone: it is the non-multiplicativity of the coefficient
  correlations (the 5 x 5 table). At sigma = 1/2 in the limit normalisation DH's matrix is the mean of two
  diagonal conjugates of the chi-type block, hence better conditioned than it (PROVED, concavity of lambda_min).
- sigma = 1 and 1.2, two-point exponents between N = 2500 and 5000: DH's lambda_min decays faster (-0.114, -0.072)
  than its multiplicative comparison (-0.033 at sigma = 1) and than zeta (-0.083, -0.058); in the limit zeta's lambda_min at sigma = 1.2 is
  zeta(2.4)/zeta(1.2)^2 = 0.0442 > 0 and DH's is 0. This is the separation to the right of 1 already on file.

**Classification: closed.** The registered fail rule (a control's exponent differs and the difference is not a
function of abs(a(p)) alone) is met by DH only, and it is met by reading that DH's coefficients are not
multiplicative, which needs no Gram matrix. Three controls (unimodular twist, sign twist, T-NR below q) have
zeta's matrix exactly, so the statistic cannot be a survivor. The object enters through its coefficients; its
zeros enter only in the limit and only those with Re s > sigma.

## 4. Test 4: rank-one Maass-Selberg Gram

**Object.** phi_F(s) = X_F(2s-1)/X_F(2s), X_F the completed function of F (zeta's gamma factor for zeta, E_a,
T-NR, the twists; the conductor-4 odd, conductor-5 even and DH factors for the others). Kernel
K(s, s') = [Y^(s+conj s'-1) - phi(s) conj phi(s') Y^(1-s-conj s')]/(s + conj s' - 1)
         + [conj phi(s') Y^(s-conj s') - phi(s) Y^(conj s'-s)]/(s - conj s').
For F = zeta and Y >= 1 this is the Gram matrix of truncated Eisenstein series (CLASSICAL). Validation: at
s = 0.7, s' = 0.85, Y = 1.5 the formula equals the direct integral of the truncated series over the fundamental
domain (Fourier expansion with K-Bessel functions, mpmath quadrature): 2.17981444995 both ways, difference
3e-15; modular invariance of the expansion 0.0.
Nodes s_j = 1/2 + d_j + i t_j, d_j = (1/1024) round(256 v_3(j)) in (0, 1/4], t_j on a quarter-integer grid in
van der Corput order, so every prefix covers the window. Designs: W1 t in [2, 102] (4 nodes per unit height;
4000 bits), W3 t in [2, 402] (3000 bits), W2 t in [25, 10025] (1024 bits). Pivots of LDL^* without pivoting in
Arb; a pivot ball containing 0 stops the run.

**Result (certified signs).** Full table in section 7.
- zeta: W1, Y = 1 and 1.01: positive pivots to order 391; the ball at order 392 contains 0 at 4000 bits (pivots
  are below 1e-308 from order 184). Y = 2: positive to 400. Y = 0.9: negative at order 16. Local mpmath run
  (1200 bits, not enclosed): first negative order 4, 16, 16, 40, 86 at Y = 0.5, 0.9, 0.95, 0.99, 0.999 and none to
  order 120 at Y = 1. The normalisation Y = 1 is sharp for zeta.
- L(chi_-4), L(chi_5), DH: positive to order 400 for Y = 1, 1.01, 2 in W1; negative at order 64, 64, 68 for Y = 0.9.
  DH in the local run: first negative order 32, 68, 74, 100 at Y = 0.5, 0.9, 0.95, 0.99 (zeta: 4, 16, 16, 40): at
  equal Y below 1 DH stays positive to a higher order than zeta.
- T-NR: positive to order 400 at every Y tested, including Y = 0.9 (smallest pivot 0.04, at order 350), and in the
  local run to order 120 at Y = 0.5 (smallest pivot 0.97). The control has more room than zeta.
- zeta(s + 1.7i): positive to order 400 for Y >= 1; negative at order 16 for Y = 0.9.
- E_a (a = 0.02): negative at order 48 (Y = 1, 1.01), 80 (Y = 2), 20 (Y = 0.9) in W1 and at order 192 (Y = 1) in
  W3. Its quotient has two real poles, at s = 1 +- a/2; no node is within 2.28 of them. It fails by the pole
  structure at s = 1, not by its zeros on Re s = 1/2 +- a, which are zeros of the quotient.
- zeta(2s)/zeta(s): negative at order 25 (Y = 1) in W1 and 41 in W3. Its quotient has poles at (1 + rho)/2
  (Re s = 3/4, on the edge of the node range); node 25 is at distance 0.097 from one of them; 81 such poles lie in
  the window.
- W3 (t in [2, 402], one node per unit height, 3000 bits; rows finished before the unit was stopped): zeta,
  L(chi_-4), L(chi_5), T-NR, DH and zeta(s + 1.7i) are positive to order 400 at Y = 1 and 1.01; E_a is negative at
  order 192; zeta(2s)/zeta(s) at order 41.
- W2 (nodes spread to height 10025, spacing about 25): every object passes at order 400 with smallest pivot
  between 1.2 and 2.9. Spread nodes give a nearly diagonal matrix and detect nothing, including the two controls
  that fail in W1.

**Why (RELATIVE to row D9, Theorems B and C).** Zeros of X_F(2s-1) in Re s > 1/2 (all zeros of F in the strip,
on or off the line) are zeros of phi_F and the positivity class is closed under such Blaschke factors. Poles of
phi_F in Re s > 1/2 are zeros of F with real part above 1 and the poles carried over from s = 1. DH: a float64
screen of abs(DH) on Re s in {1, 1.04, 1.08, 1.12}, t <= 20100, step 0.05, has minimum 0.154 and no zero with
Re s >= 1 after Newton refinement from the 65 smallest minima (MEASURED, not certified; `dhz_local.py`). So
phi_DH has no pole near the nodes and DH passes; its off-line zeros at heights 85.7 and 114.2 give zeros of
phi_DH at height 42.8 and 57.1 inside the W1 window and are not seen. The registered fail condition (a control
negative at an order below the count of zeros of F(2s) under its first exceptional ordinate) is not met by DH,
T-NR or the unimodular twist: they are not negative at any order reached.

**Not run.** Backward heat: no closed form for the completed function off the line at 1000 bits or more; by
Theorem C of row D9 the expected outcome is a pass while its zeros with ordinate in the node range stay in the
strip. The two-variable affine kernel: no formula for it is on file (row D9 says none was tested), so the
"affine-kernel variant" was replaced by the threshold in Y above, which is the exact-normalisation reading of the
rank-one kernel.

**Classification: closed.** The statistic is a statement on Re(2s) > 1 and on the pole at s = 1. The object
enters through its zeros to the right of 1 (none for DH below height 20100) and through its poles.

## 5. Survivors, and what stopped each test

None.

| # | nodes | where zeta and the controls stop separating |
|---|---|---|
| 1 | br2-sparse-pole-lattice-regime-k + silent-u3-identification-relaxation + twin-screen-ts | never separate: the base cancels at every size (abs S = 1..40); the twin hypothesis fails for every base |
| 2 | br3-euler-shape-rigidity-regime3 + silent-u2-pos-fe-positivity-rigidity + de-branges-positivity-family | never separate: the Jacobian is base-free at every (P, T) reached (P to 3e4, T to 1e7) |
| 3 | lacunary-cone-positivity + regular-rep-matrix-bridge + silent-u6e-bost-connes-states-outside-d8 | unimodular twist, sign twists: identical at every N; T-NR: identical for N < 1000003; DH and E_a differ from N = 1250 through coefficient correlations, not zeros |
| 4 | silent-u6b-nonsolid-laxphillips-norms + silent-u6g-scattering-exact-normalisation-affine-kernel + silent-u6f-isogenous-points-nonlinear-functionals | DH, T-NR, unimodular twist: positive to order 400 at 4000 bits; E_a and zeta(2s)/zeta(s) fail through poles of the quotient (order 48 and 25) |

## 6. Three weakest steps


1. Test 4, DH: the absence of zeros with Re s >= 1 below height 20100 is a float64 grid screen (step 0.05 in t,
   0.04 in sigma), not a certificate; the server search with Arb (`dhz2.py`) could not be launched because of the
   memory gate. The pass of DH to order 400 is certified independently of it.
2. Test 3: the sizes for DH and E_a stop at N = 1e4 (the assignment asked for 1e5; a dense matrix at 1e5 needs
   80 GB and no factorisation was found for non-multiplicative coefficients); the exponents quoted for them are
   two-point local slopes at those N, and all exponents drift with N.
3. Test 2: the cone value is an upper bound from projected gradient, not a minimum; float64 SVD values below
   1e-13 are at the rounding floor (one of them was re-evaluated at 40 digits).

Files: `twin1.py`, `jac2.py`, `gram3.py`, `ms4.py`, `ms4_thr.py`, `check2_mp.py`, `check3_mp.py`, `dhz_local.py`,
`dhz2.py` (not run), `dhzeros.py` (first attempt, superseded), `mktab.py`, `run_*.sh`, `out/` (JSON), `logs/`
(server logs), `tables.md` (all tables, generated).

## 7. Tables (generated by mktab.py from out/ and logs/)

### Test 1: minimum normalised functional-equation residual R(|S|)

| base | n = abs(S) | log p_n | R at theta = 0, pi and random starts (min, max) | R minimum (float64) | R minimum re-evaluated at 100 digits | band abs(Re s - 1/2) < 0.1: rms, min | band >= 0.5: rms, min |
|---|---|---|---|---|---|---|---|
| any base with a functional equation | 1 | 1.1 | 0.492009, 1.325576 | 0.491548833102 | 0.49154883310221 | 0.6053, 0.0069 | 0.4379, 0.1056 |
| any base with a functional equation | 2 | 4.0 | 0.923679, 1.067988 | 0.920295774977 | 0.92029577497715 | 0.9101, 0.0430 | 0.9175, 0.7222 |
| any base with a functional equation | 3 | 9.0 | 0.997329, 1.002839 | 0.996692773398 | 0.99669277339829 | 0.9617, 0.0646 | 0.9994, 0.9907 |
| any base with a functional equation | 4 | 16.0 | 0.998433, 1.000769 | 0.997462589296 | 0.99746258929614 | 0.9562, 0.0513 | 1.0000, 1.0000 |
| any base with a functional equation | 5 | 25.0 | 0.998650, 1.001016 | 0.998027387500 | 0.99802738749994 | 0.9658, 0.2142 | 1.0000, 1.0000 |
| any base with a functional equation | 6 | 36.0 | 0.999265, 1.000235 | 0.998811850383 | 0.99881185038309 | 0.9795, 0.1248 | 1.0000, 1.0000 |
| any base with a functional equation | 8 | 64.0 | 0.999821, 1.000110 | 0.999453834895 | 0.99945383489538 | 0.9906, 0.4067 | 1.0000, 1.0000 |
| any base with a functional equation | 10 | 100.0 | 0.999990, 1.000043 | 0.999944080647 | 0.99994408064693 | 0.9990, 0.8349 | 1.0000, 1.0000 |
| any base with a functional equation | 15 | 225.0 | 1.000000, 1.000000 | 0.999999999991 | 0.99999999999089 | 1.0000, 1.0000 | 1.0000, 1.0000 |
| any base with a functional equation | 20 | 400.0 | 1.000000, 1.000000 | 1.000000000000 | 1.0 | 1.0000, 1.0000 | 1.0000, 1.0000 |
| any base with a functional equation | 30 | 900.0 | 1.000000, 1.000000 | 1.000000000000 | 1.0 | 1.0000, 1.0000 | 1.0000, 1.0000 |
| any base with a functional equation | 40 | 1600.0 | 1.000000, 1.000000 | 1.000000000000 | 1.0 | 1.0000, 1.0000 | 1.0000, 1.0000 |
| zeta(2s)/zeta(s) | 1 | 1.1 | 0.966441, 1.032469 | 0.964790309478 | 0.96479030947833 | 1.0365, 0.2389 | 0.9679, 0.0569 |
| zeta(2s)/zeta(s) | 2 | 4.0 | 0.994116, 1.005901 | 0.989306258938 | 0.98930625893811 | 0.9812, 0.4205 | 0.9923, 0.2981 |
| zeta(2s)/zeta(s) | 3 | 9.0 | 0.998184, 1.000678 | 0.996137682205 | 0.99613768220495 | 0.9424, 0.1326 | 1.0000, 0.9928 |
| zeta(2s)/zeta(s) | 4 | 16.0 | 0.998107, 1.001822 | 0.995268083129 | 0.99526808312879 | 0.9158, 0.0390 | 1.0000, 1.0000 |
| zeta(2s)/zeta(s) | 5 | 25.0 | 0.999009, 1.001620 | 0.997221710552 | 0.99722171055241 | 0.9510, 0.2111 | 1.0000, 1.0000 |
| zeta(2s)/zeta(s) | 6 | 36.0 | 0.999180, 1.000240 | 0.996686736135 | 0.99668673613523 | 0.9413, 0.2560 | 1.0000, 1.0000 |
| zeta(2s)/zeta(s) | 8 | 64.0 | 0.999249, 1.000279 | 0.998637795751 | 0.99863779575090 | 0.9762, 0.2399 | 1.0000, 1.0000 |
| zeta(2s)/zeta(s) | 10 | 100.0 | 0.999999, 1.000022 | 0.999554552617 | 0.99955455261713 | 0.9923, 0.3325 | 1.0000, 1.0000 |
| zeta(2s)/zeta(s) | 15 | 225.0 | 1.000000, 1.000000 | 0.999999999998 | 0.99999999999820 | 1.0000, 1.0000 | 1.0000, 1.0000 |
| zeta(2s)/zeta(s) | 20 | 400.0 | 1.000000, 1.000000 | 1.000000000000 | 1.0 | 1.0000, 1.0000 | 1.0000, 1.0000 |
| zeta(s + 1.7i) | 1 | 1.1 | 0.864078, 1.051777 | 0.861836025511 | 0.86183602551070 | 0.9607, 0.0795 | 0.8248, 0.0444 |
| zeta(s + 1.7i) | 2 | 4.0 | 0.977719, 1.029063 | 0.969016009386 | 0.96901600938573 | 1.0010, 0.0964 | 0.9595, 0.3691 |
| zeta(s + 1.7i) | 3 | 9.0 | 0.995809, 1.004173 | 0.993658197281 | 0.99365819728123 | 0.9366, 0.3917 | 1.0001, 0.9941 |
| zeta(s + 1.7i) | 4 | 16.0 | 0.996861, 1.001504 | 0.995145597373 | 0.99514559737273 | 0.9375, 0.2217 | 1.0000, 1.0000 |
| zeta(s + 1.7i) | 5 | 25.0 | 0.999062, 1.001439 | 0.996074603751 | 0.99607460375135 | 0.9299, 0.0548 | 1.0000, 1.0000 |
| zeta(s + 1.7i) | 6 | 36.0 | 0.998652, 1.000640 | 0.996373353847 | 0.99637335384658 | 0.9355, 0.2680 | 1.0000, 1.0000 |
| zeta(s + 1.7i) | 8 | 64.0 | 0.999518, 1.000044 | 0.998956085027 | 0.99895608502740 | 0.9818, 0.0173 | 1.0000, 1.0000 |
| zeta(s + 1.7i) | 10 | 100.0 | 0.999985, 1.000063 | 0.999504530653 | 0.99950453065259 | 0.9914, 0.0087 | 1.0000, 1.0000 |
| zeta(s + 1.7i) | 15 | 225.0 | 1.000000, 1.000000 | 0.999999999996 | 0.99999999999636 | 1.0000, 1.0000 | 1.0000, 1.0000 |
| zeta(s + 1.7i) | 20 | 400.0 | 1.000000, 1.000000 | 1.000000000000 | 1.0 | 1.0000, 1.0000 | 1.0000, 1.0000 |

### Test 2: smallest singular value of the Jacobian at alpha = 1 (rms-normalised rows)

| P | pi(P) | T | heights | route | sigma_min complex | sigma_min real | sigma_min real x P^(1/2) | frame constant (unit columns) | cone upper bound | support of cone vector | largest entries of the smallest real vector at primes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 100 | 25 | 1e+02 | 2000 | svd | 1.833e-01 | 2.342e-01 | 2.342 | 8.286e-01 | 2.529e-01 | 10 | [79, 73, 71] |
| 100 | 25 | 1e+03 | 2000 | svd | 2.552e-01 | 2.579e-01 | 2.579 | 9.263e-01 | 2.585e-01 | 16 | [97, 89, 67] |
| 100 | 25 | 1e+04 | 2000 | svd | 2.557e-01 | 2.575e-01 | 2.575 | 9.205e-01 | 2.606e-01 | 14 | [97, 71, 89] |
| 100 | 25 | 1e+05 | 2000 | svd | 2.565e-01 | 2.585e-01 | 2.585 | 9.190e-01 | 2.598e-01 | 12 | [97, 89, 79] |
| 100 | 25 | 1e+06 | 2000 | svd | 2.582e-01 | 2.598e-01 | 2.598 | 9.201e-01 | 2.604e-01 | 12 | [97, 73, 79] |
| 100 | 25 | 1e+07 | 2000 | svd | 2.557e-01 | 2.576e-01 | 2.576 | 9.193e-01 | 2.602e-01 | 12 | [97, 89, 83] |
| 300 | 62 | 1e+02 | 2000 | svd | 1.194e-02 | 2.523e-02 | 0.437 | 1.342e-01 | 1.682e-01 | 25 | [281, 283, 277] |
| 300 | 62 | 1e+03 | 2000 | svd | 1.642e-01 | 1.701e-01 | 2.946 | 8.686e-01 | 1.790e-01 | 31 | [283, 271, 281] |
| 300 | 62 | 1e+04 | 2000 | svd | 1.749e-01 | 1.779e-01 | 3.082 | 8.783e-01 | 1.807e-01 | 27 | [281, 269, 283] |
| 300 | 62 | 1e+05 | 2000 | svd | 1.745e-01 | 1.790e-01 | 3.100 | 8.778e-01 | 1.821e-01 | 37 | [277, 251, 269] |
| 300 | 62 | 1e+06 | 2000 | svd | 1.731e-01 | 1.790e-01 | 3.100 | 8.744e-01 | 1.819e-01 | 31 | [293, 257, 251] |
| 300 | 62 | 1e+07 | 2000 | svd | 1.730e-01 | 1.764e-01 | 3.056 | 8.791e-01 | 1.803e-01 | 27 | [281, 283, 293] |
| 1000 | 168 | 1e+02 | 2000 | svd | 8.400e-06 | 6.835e-05 | 0.002 | 4.962e-04 | 1.227e-01 | 34 | [823, 827, 881] |
| 1000 | 168 | 1e+03 | 2000 | svd | 3.864e-02 | 9.264e-02 | 2.930 | 6.598e-01 | 1.192e-01 | 74 | [823, 827, 821] |
| 1000 | 168 | 1e+04 | 2000 | svd | 1.102e-01 | 1.175e-01 | 3.715 | 8.006e-01 | 1.236e-01 | 102 | [971, 983, 997] |
| 1000 | 168 | 1e+05 | 2000 | svd | 1.095e-01 | 1.183e-01 | 3.743 | 8.003e-01 | 1.231e-01 | 90 | [977, 953, 911] |
| 1000 | 168 | 1e+06 | 2000 | svd | 1.100e-01 | 1.185e-01 | 3.748 | 7.954e-01 | 1.241e-01 | 87 | [971, 887, 919] |
| 1000 | 168 | 1e+07 | 2000 | svd | 1.112e-01 | 1.186e-01 | 3.751 | 7.955e-01 | 1.261e-01 | 97 | [953, 947, 991] |
| 3000 | 430 | 1e+02 | 2000 | svd | 1.915e-15 | 6.387e-14 | 0.000 | 6.304e-13 | 8.628e-02 | 50 | [2689, 2687, 2693] |
| 3000 | 430 | 1e+03 | 2000 | svd | 1.628e-03 | 6.181e-03 | 0.339 | 6.113e-02 | 8.554e-02 | 154 | [2689, 2687, 2711] |
| 3000 | 430 | 1e+04 | 2000 | svd | 6.270e-02 | 7.541e-02 | 4.130 | 6.722e-01 | 8.606e-02 | 243 | [2711, 2719, 2447] |
| 3000 | 430 | 1e+05 | 2000 | svd | 6.494e-02 | 7.707e-02 | 4.221 | 6.799e-01 | 8.769e-02 | 240 | [2687, 2719, 2663] |
| 3000 | 430 | 1e+06 | 2000 | svd | 6.529e-02 | 7.691e-02 | 4.212 | 6.779e-01 | 8.459e-02 | 227 | [2909, 2707, 2689] |
| 3000 | 430 | 1e+07 | 2000 | svd | 6.560e-02 | 7.705e-02 | 4.220 | 6.787e-01 | 8.665e-02 | 248 | [2969, 2251, 2851] |
| 10000 | 1229 | 1e+02 | 2000 | svd | 4.839e-16 | 8.333e-16 | 0.000 | 1.068e-14 | 6.690e-02 | 68 | [9733, 9739, 9461] |
| 10000 | 1229 | 1e+03 | 2000 | svd | 7.803e-08 | 1.525e-06 | 0.000 | 2.088e-05 | 5.940e-02 | 292 | [9433, 9431, 9437] |
| 10000 | 1229 | 1e+04 | 2000 | svd | 9.873e-03 | 3.482e-02 | 3.482 | 4.262e-01 | 5.341e-02 | 742 | [9433, 9437, 9439] |
| 10000 | 1229 | 1e+05 | 2000 | svd | 2.239e-02 | 3.868e-02 | 3.868 | 4.508e-01 | 5.306e-02 | 724 | [9221, 9901, 9187] |
| 10000 | 1229 | 1e+06 | 2000 | svd | 2.227e-02 | 3.896e-02 | 3.896 | 4.532e-01 | 5.336e-02 | 741 | [9227, 9539, 9479] |
| 10000 | 1229 | 1e+03 | 4916 | svd | 1.101e-07 | 1.950e-06 | 0.000 | 2.675e-05 | 5.869e-02 | 292 | [9433, 9431, 9437] |
| 10000 | 1229 | 1e+04 | 4916 | svd | 1.128e-02 | 4.381e-02 | 4.381 | 5.846e-01 | 6.015e-02 | 611 | [9721, 9769, 9719] |
| 10000 | 1229 | 1e+05 | 4916 | svd | 4.375e-02 | 5.387e-02 | 5.387 | 6.476e-01 | 6.308e-02 | 730 | [9949, 9883, 9767] |
| 10000 | 1229 | 1e+06 | 4916 | svd | 4.379e-02 | 5.377e-02 | 5.377 | 6.495e-01 | 6.294e-02 | 721 | [9463, 9767, 9817] |
| 10000 | 1229 | 1e+07 | 4916 | svd | 4.398e-02 | 5.367e-02 | 5.367 | 6.473e-01 | 6.278e-02 | 712 | [9803, 9377, 9221] |
| 30000 | 3245 | 1e+04 | 12980 | gram | 5.701e-04 | 1.619e-03 | 0.280 | 2.964e-02 | - | - | [29023, 29021, 29027] |
| 30000 | 3245 | 1e+05 | 12980 | gram | 3.166e-02 | 4.011e-02 | 6.948 | 6.430e-01 | - | - | [26113, 25999, 25931] |
| 30000 | 3245 | 1e+06 | 12980 | gram | 3.254e-02 | 4.053e-02 | 7.019 | 6.450e-01 | - | - | [29671, 29833, 28057] |
| 30000 | 3245 | 1e+07 | 12980 | gram | 3.272e-02 | 4.067e-02 | 7.044 | 6.491e-01 | - | - | [26339, 29873, 28597] |

### comparison L-functions (parameter chi(p) at p)

| object | P | T | heights | sigma_min complex | sigma_min real | frame constant | rms of r0 | rms after first-order repair |
|---|---|---|---|---|---|---|---|---|
| chi_-4 | 1000 | 1e+05 | 2000 | 1.0985e-01 | 1.1821e-01 | 7.9684e-01 | - | - |
| chi_-4 | 10000 | 1e+05 | 4916 | 4.3704e-02 | 5.3877e-02 | 6.4678e-01 | - | - |
| chi_-4 | 10000 | 1e+03 | 4916 | 3.2500e-05 | 2.1773e-04 | 2.9239e-03 | - | - |
| chi_5 | 1000 | 1e+05 | 2000 | 1.1047e-01 | 1.1882e-01 | 8.0176e-01 | - | - |
| chi_5 | 10000 | 1e+05 | 4916 | 4.3766e-02 | 5.3874e-02 | 6.4530e-01 | - | - |
| chi_5 | 10000 | 1e+03 | 4916 | 2.5214e-05 | 1.7540e-04 | 2.4050e-03 | - | - |

### bases without the functional equation

| object | P | T | heights | sigma_min complex | sigma_min real | frame constant | rms of r0 | rms after first-order repair |
|---|---|---|---|---|---|---|---|---|
| zeta (check: A = B) | 1000 | 1e+04 | 4000 | 8.3156e-02 | 8.7196e-02 | 8.5287e-01 | 0.0000 | 0.0000 |
| unimodular twist a=1.7 | 1000 | 1e+04 | 4000 | 8.0713e-02 | 8.5573e-02 | 8.3655e-01 | 0.9669 | 0.9552 |
| Liouville | 1000 | 1e+04 | 4000 | 2.3303e-02 | 2.4052e-02 | 7.8565e-01 | 0.9910 | 0.9756 |

### Test 3: Gram matrices of dilates

### sparse route (zeta-type index sets), server

| index set | sigma | N | lambda_min | lambda_max | lambda_min x lambda_max | local exponent of lambda_min | local exponent of lambda_max | residual of the smallest pair |
|---|---|---|---|---|---|---|---|---|
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.5 | 1000 | 0.0174597 | 22.4601 | 0.3921 | - | - | 1.9e-12 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.5 | 3000 | 0.0129353 | 30.1565 | 0.3901 | -0.273 | 0.268 | 8.4e-13 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.5 | 10000 | 0.0095998 | 40.5393 | 0.3892 | -0.248 | 0.246 | 5.4e-12 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.5 | 30000 | 0.00748115 | 52.0672 | 0.3895 | -0.227 | 0.228 | 3.0e-12 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.5 | 100000 | 0.00577882 | 67.2782 | 0.3888 | -0.214 | 0.213 | 1.6e-11 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.5 | 300000 | 0.00463907 | 83.8313 | 0.3889 | -0.200 | 0.200 | 2.0e-11 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.5 | 1000000 | 0.00369486 | 105.304 | 0.3891 | -0.189 | 0.189 | 2.5e-11 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.5 | 3000000 | 0.00303331 | 128.325 | 0.3892 | -0.180 | 0.180 | 1.1e-14 |
| n odd (chi_-4) | 0.5 | 1000 | 0.0649844 | 9.43083 | 0.6129 | - | - | 3.1e-13 |
| n odd (chi_-4) | 0.5 | 3000 | 0.0494979 | 12.2048 | 0.6041 | -0.248 | 0.235 | 4.5e-13 |
| n odd (chi_-4) | 0.5 | 10000 | 0.0371634 | 15.8807 | 0.5902 | -0.238 | 0.219 | 6.2e-12 |
| n odd (chi_-4) | 0.5 | 30000 | 0.0294892 | 19.8674 | 0.5859 | -0.211 | 0.204 | 1.6e-11 |
| n odd (chi_-4) | 0.5 | 100000 | 0.0232205 | 25.0296 | 0.5812 | -0.198 | 0.192 | 1.7e-11 |
| n odd (chi_-4) | 0.5 | 300000 | 0.0188698 | 30.5613 | 0.5767 | -0.189 | 0.182 | 2.0e-11 |
| n odd (chi_-4) | 0.5 | 1000000 | 0.0152259 | 37.6313 | 0.5730 | -0.178 | 0.173 | 2.1e-14 |
| n odd (chi_-4) | 0.5 | 3000000 | 0.0126338 | 45.1097 | 0.5699 | -0.170 | 0.165 | 1.1e-14 |
| (n, 5) = 1 (chi_5) | 0.5 | 1000 | 0.0244773 | 17.7297 | 0.4340 | - | - | 2.9e-12 |
| (n, 5) = 1 (chi_5) | 0.5 | 3000 | 0.0186733 | 23.2794 | 0.4347 | -0.246 | 0.248 | 1.6e-11 |
| (n, 5) = 1 (chi_5) | 0.5 | 10000 | 0.0142971 | 30.6408 | 0.4381 | -0.222 | 0.228 | 5.4e-12 |
| (n, 5) = 1 (chi_5) | 0.5 | 30000 | 0.0113717 | 38.6582 | 0.4396 | -0.208 | 0.212 | 3.0e-11 |
| (n, 5) = 1 (chi_5) | 0.5 | 100000 | 0.00897251 | 49.0916 | 0.4405 | -0.197 | 0.198 | 4.7e-11 |
| (n, 5) = 1 (chi_5) | 0.5 | 300000 | 0.00731965 | 60.3106 | 0.4415 | -0.185 | 0.187 | 3.4e-15 |
| (n, 5) = 1 (chi_5) | 0.5 | 1000000 | 0.00592163 | 74.7012 | 0.4424 | -0.176 | 0.178 | 9.0e-15 |
| (n, 5) = 1 (chi_5) | 0.5 | 3000000 | 0.00492401 | 89.9714 | 0.4430 | -0.168 | 0.169 | 1.9e-14 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.75 | 1000 | 0.0635688 | 9.56786 | 0.6082 | - | - | 5.2e-16 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.75 | 10000 | 0.0461825 | 13.3851 | 0.6182 | -0.139 | 0.146 | 4.0e-14 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.75 | 100000 | 0.0359143 | 17.5121 | 0.6289 | -0.109 | 0.117 | 1.2e-11 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.75 | 1000000 | 0.0291718 | 21.9077 | 0.6391 | -0.090 | 0.097 | 9.8e-12 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 0.75 | 3000000 | 0.0267093 | 24.0923 | 0.6435 | -0.080 | 0.087 | 1.3e-11 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 1.0 | 1000 | 0.136757 | 5.51977 | 0.7549 | - | - | 1.3e-10 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 1.0 | 10000 | 0.11301 | 6.81443 | 0.7701 | -0.083 | 0.092 | 1.7e-10 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 1.0 | 100000 | 0.0980047 | 8.00473 | 0.7845 | -0.062 | 0.070 | 3.2e-13 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 1.0 | 1000000 | 0.0875477 | 9.10437 | 0.7971 | -0.049 | 0.056 | 2.8e-12 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 1.0 | 3000000 | 0.0835671 | 9.60144 | 0.8024 | -0.042 | 0.048 | 1.3e-11 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 1.2 | 1000 | 0.206998 | 4.02103 | 0.8323 | - | - | 1.0e-10 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 1.2 | 10000 | 0.181207 | 4.67601 | 0.8473 | -0.058 | 0.066 | 3.9e-13 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 1.2 | 100000 | 0.164583 | 5.22937 | 0.8607 | -0.042 | 0.049 | 3.3e-11 |
| all n (zeta, unimodular twist, sign twist, T-NR for N < q) | 1.2 | 1000000 | 0.152841 | 5.70451 | 0.8719 | -0.032 | 0.038 | 2.4e-12 |

### dense route, all objects


sigma = 0.5

| object | N = 1250: lambda_min, lambda_max | N = 2500: lambda_min, lambda_max | N = 5000: lambda_min, lambda_max | N = 10000: lambda_min, lambda_max | exponent of lambda_min (last two N) | exponent of lambda_max | lacunary {4^k}: min, max | negative eigenvalues |
|---|---|---|---|---|---|---|---|---|
| zeta | 0.01649, 23.892 | 0.013615, 28.763 | 0.011371, 34.291 | 0.0095998, 40.539 | -0.244 | 0.241 | 0.3473, 2.494 | 0 |
| chi_-4 | 0.060797, 9.9551 | 0.051012, 11.728 | 0.043485, 13.679 | 0.037163, 15.881 | -0.227 | 0.215 | 1, 1 | 0 |
| chi_5 | 0.023267, 18.824 | 0.019612, 22.319 | 0.016657, 26.246 | 0.014297, 30.641 | -0.220 | 0.223 | 0.3473, 2.494 | 0 |
| DH | 0.1549, 9.4796 | 0.13689, 11.232 | 0.12231, 13.175 | 0.1098, 15.376 | -0.156 | 0.223 | 0.3473, 2.494 | 0 |
| DHabs | 0.26169, 3.4809 | 0.23411, 3.855 | 0.2117, 4.2464 | - | -0.145 | 0.140 | 0.9278, 1.077 | 0 |
| DHsgn | 0.26169, 3.4809 | 0.23411, 3.855 | 0.2117, 4.2464 | - | -0.145 | 0.140 | 0.9278, 1.077 | 0 |
| E_a(0.02) | 7.0263e-05, 108.21 | 4.4951e-05, 146.32 | 3.0217e-05, 195.06 | 2.0849e-05, 256.96 | -0.535 | 0.398 | 0.04249, 4.07 | 0 |
| E_a(0.2) | 3.5328e-05, 154.42 | 2.1334e-05, 221.4 | 1.3584e-05, 313.97 | 8.8557e-06, 441.27 | -0.617 | 0.491 | 0.03532, 4.397 | 0 |

sigma = 0.75

| object | N = 1250: lambda_min, lambda_max | N = 2500: lambda_min, lambda_max | N = 5000: lambda_min, lambda_max | N = 10000: lambda_min, lambda_max | exponent of lambda_min (last two N) | exponent of lambda_max | lacunary {4^k}: min, max | negative eigenvalues |
|---|---|---|---|---|---|---|---|---|
| zeta | 0.061747, 9.9186 | 0.055555, 11.043 | 0.050439, 12.2 | 0.046182, 13.385 | -0.127 | 0.134 | 0.4942, 1.901 | 0 |
| chi_-4 | 0.17986, 4.3729 | 0.16442, 4.7665 | 0.15209, 5.1547 | 0.14093, 5.5552 | -0.110 | 0.108 | 1, 1 | 0 |
| chi_5 | 0.078101, 8.2657 | 0.071835, 9.0728 | 0.06625, 9.892 | 0.061447, 10.724 | -0.109 | 0.116 | 0.4942, 1.901 | 0 |
| DH | 0.19148, 3.8134 | 0.17099, 4.1613 | 0.15334, 4.5055 | 0.13835, 4.8633 | -0.148 | 0.110 | 0.4942, 1.901 | 0 |
| E_a(0.02) | 0.0014632, 36.196 | 0.0011471, 43.477 | 0.00091754, 51.564 | 0.00074871, 60.499 | -0.293 | 0.231 | 0.1217, 3.078 | 0 |
| E_a(0.2) | 0.001094, 43.37 | 0.00083583, 53.255 | 0.00065352, 64.566 | 0.00052153, 77.443 | -0.325 | 0.262 | 0.1121, 3.226 | 0 |

sigma = 1.0

| object | N = 1250: lambda_min, lambda_max | N = 2500: lambda_min, lambda_max | N = 5000: lambda_min, lambda_max | N = 10000: lambda_min, lambda_max | exponent of lambda_min (last two N) | exponent of lambda_max | lacunary {4^k}: min, max | negative eigenvalues |
|---|---|---|---|---|---|---|---|---|
| zeta | 0.13436, 5.6475 | 0.12614, 6.0462 | 0.11906, 6.4353 | 0.11301, 6.8144 | -0.075 | 0.083 | 0.6166, 1.575 | 0 |
| chi_-4 | 0.32678, 2.7169 | 0.31068, 2.8544 | 0.29736, 2.9869 | - | -0.063 | 0.065 | 1, 1 | 0 |
| chi_5 | 0.15713, 4.9648 | 0.14986, 5.256 | 0.14335, 5.5358 | - | -0.064 | 0.075 | 0.6166, 1.575 | 0 |
| DH | 0.26671, 2.3273 | 0.24549, 2.4387 | 0.22681, 2.5495 | - | -0.114 | 0.064 | 0.6166, 1.575 | 0 |
| DHabs | 0.57748, 1.6943 | 0.5637, 1.7355 | 0.55091, 1.7752 | - | -0.033 | 0.033 | 0.9633, 1.038 | 0 |
| DHsgn | 0.57748, 1.6943 | 0.5637, 1.7355 | 0.55091, 1.7752 | - | -0.033 | 0.033 | 0.9633, 1.038 | 0 |
| E_a(0.02) | 0.0093993, 16.727 | 0.0081608, 18.85 | 0.0071563, 21.036 | - | -0.190 | 0.158 | 0.2356, 2.431 | 0 |
| E_a(0.2) | 0.0080671, 18.525 | 0.0069225, 21.084 | 0.0060062, 23.754 | - | -0.205 | 0.172 | 0.2249, 2.507 | 0 |

sigma = 1.2

| object | N = 1250: lambda_min, lambda_max | N = 2500: lambda_min, lambda_max | N = 5000: lambda_min, lambda_max | N = 10000: lambda_min, lambda_max | exponent of lambda_min (last two N) | exponent of lambda_max | lacunary {4^k}: min, max | negative eigenvalues |
|---|---|---|---|---|---|---|---|---|
| zeta | 0.20427, 4.0882 | 0.19553, 4.2944 | 0.18786, 4.4902 | - | -0.058 | 0.064 | 0.6968, 1.412 | 0 |
| chi_-4 | 0.44143, 2.1142 | 0.42709, 2.184 | 0.41463, 2.2526 | - | -0.043 | 0.045 | 1, 1 | 0 |
| chi_5 | 0.22857, 3.7183 | 0.22123, 3.8712 | 0.21479, 4.0139 | - | -0.043 | 0.052 | 0.6968, 1.412 | 0 |
| DH | 0.36175, 1.8246 | 0.34289, 1.8781 | 0.3262, 1.9339 | - | -0.072 | 0.042 | 0.6968, 1.412 | 0 |
| E_a(0.02) | 0.025893, 10.496 | 0.023516, 11.459 | 0.021512, 12.412 | - | -0.129 | 0.115 | 0.3394, 2.071 | 0 |
| E_a(0.2) | 0.023438, 11.256 | 0.021149, 12.362 | 0.019228, 13.464 | - | -0.137 | 0.123 | 0.3286, 2.119 | 0 |

### Test 4: rank-one Maass-Selberg Gram, first order with a negative pivot

| design | bits | object | Y | first order with a certified negative pivot | orders certified positive | stopped undetermined at | smallest pivot (order, value) |
|---|---|---|---|---|---|---|---|
| W1 | 4000 | zeta | 9/10 | 16 | 15 | - | 16, -1.5 |
| W1 | 4000 | zeta | 1/1 | none | 391 | 392 | 184, 0 |
| W1 | 4000 | zeta | 101/100 | none | 391 | 392 | 184, 0 |
| W1 | 4000 | zeta | 2/1 | none | 400 | - | 208, 0 |
| W1 | 4000 | chi_-4 | 9/10 | 64 | 63 | - | 64, -1.25 |
| W1 | 4000 | chi_-4 | 1/1 | none | 400 | - | 228, 0 |
| W1 | 4000 | chi_-4 | 101/100 | none | 400 | - | 232, 0 |
| W1 | 4000 | chi_-4 | 2/1 | none | 400 | - | 256, 0 |
| W1 | 4000 | chi_5 | 9/10 | 64 | 63 | - | 64, -0.576 |
| W1 | 4000 | chi_5 | 1/1 | none | 400 | - | 240, 0 |
| W1 | 4000 | chi_5 | 101/100 | none | 400 | - | 240, 0 |
| W1 | 4000 | chi_5 | 2/1 | none | 400 | - | 260, 0 |
| W1 | 4000 | E_a | 9/10 | 20 | 19 | - | 20, -120 |
| W1 | 4000 | E_a | 1/1 | 48 | 47 | - | 48, -2.83 |
| W1 | 4000 | E_a | 101/100 | 48 | 47 | - | 48, -1.94 |
| W1 | 4000 | E_a | 2/1 | 80 | 79 | - | 80, -0.00117 |
| W1 | 4000 | T-NR | 9/10 | none | 400 | - | 350, 0.0435 |
| W1 | 4000 | T-NR | 1/1 | none | 400 | - | 350, 0.0458 |
| W1 | 4000 | T-NR | 101/100 | none | 400 | - | 350, 0.046 |
| W1 | 4000 | T-NR | 2/1 | none | 400 | - | 368, 0.064 |
| W1 | 4000 | DH | 9/10 | 68 | 67 | - | 68, -5.62 |
| W1 | 4000 | DH | 1/1 | none | 400 | - | 240, 0 |
| W1 | 4000 | DH | 101/100 | none | 400 | - | 240, 0 |
| W1 | 4000 | DH | 2/1 | none | 400 | - | 260, 0 |
| W1 | 4000 | WT | 9/10 | 16 | 15 | - | 16, -0.687 |
| W1 | 4000 | WT | 1/1 | none | 400 | - | 345, 0 |
| W1 | 4000 | WT | 101/100 | none | 400 | - | 345, 0 |
| W1 | 4000 | WT | 2/1 | none | 400 | - | 361, 0 |
| W1 | 4000 | Liouville | 9/10 | 24 | 23 | - | 24, -0.219 |
| W1 | 4000 | Liouville | 1/1 | 25 | 24 | - | 25, -0.554 |
| W1 | 4000 | Liouville | 101/100 | 25 | 24 | - | 25, -0.522 |
| W1 | 4000 | Liouville | 2/1 | 48 | 47 | - | 48, -7.91 |
| W2 | 1024 | zeta | 9/10 | none | 400 | - | 320, 1.43 |
| W2 | 1024 | zeta | 1/1 | none | 400 | - | 320, 1.57 |
| W2 | 1024 | zeta | 101/100 | none | 400 | - | 320, 1.58 |
| W2 | 1024 | zeta | 2/1 | none | 400 | - | 320, 2.57 |
| W2 | 1024 | chi_-4 | 9/10 | none | 400 | - | 161, 1.9 |
| W2 | 1024 | chi_-4 | 1/1 | none | 400 | - | 161, 2.01 |
| W2 | 1024 | chi_-4 | 101/100 | none | 400 | - | 161, 2.02 |
| W2 | 1024 | chi_-4 | 2/1 | none | 400 | - | 242, 2.84 |
| W2 | 1024 | chi_5 | 9/10 | none | 400 | - | 242, 1.9 |
| W2 | 1024 | chi_5 | 1/1 | none | 400 | - | 242, 2.01 |
| W2 | 1024 | chi_5 | 101/100 | none | 400 | - | 242, 2.02 |
| W2 | 1024 | chi_5 | 2/1 | none | 400 | - | 242, 2.84 |
| W2 | 1024 | E_a | 9/10 | none | 400 | - | 242, 1.9 |
| W2 | 1024 | E_a | 1/1 | none | 400 | - | 242, 2.01 |
| W2 | 1024 | E_a | 101/100 | none | 400 | - | 242, 2.02 |
| W2 | 1024 | E_a | 2/1 | none | 400 | - | 242, 2.84 |
| W2 | 1024 | T-NR | 9/10 | none | 400 | - | 242, 1.9 |
| W2 | 1024 | T-NR | 1/1 | none | 400 | - | 242, 2.01 |
| W2 | 1024 | T-NR | 101/100 | none | 400 | - | 242, 2.02 |
| W2 | 1024 | T-NR | 2/1 | none | 400 | - | 242, 2.84 |
| W2 | 1024 | DH | 9/10 | none | 400 | - | 80, 1.87 |
| W2 | 1024 | DH | 1/1 | none | 400 | - | 80, 1.98 |
| W2 | 1024 | DH | 101/100 | none | 400 | - | 80, 1.99 |
| W2 | 1024 | DH | 2/1 | none | 400 | - | 80, 2.82 |
| W2 | 1024 | WT | 9/10 | none | 400 | - | 256, 1.25 |
| W2 | 1024 | WT | 1/1 | none | 400 | - | 256, 1.44 |
| W2 | 1024 | WT | 101/100 | none | 400 | - | 256, 1.47 |
| W2 | 1024 | WT | 2/1 | none | 400 | - | 256, 2.6 |
| W2 | 1024 | Liouville | 9/10 | none | 400 | - | 161, 1.66 |
| W2 | 1024 | Liouville | 1/1 | none | 400 | - | 161, 1.77 |
| W2 | 1024 | Liouville | 101/100 | none | 400 | - | 161, 1.79 |
| W2 | 1024 | Liouville | 2/1 | none | 400 | - | 161, 2.67 |
| W3 | 3000 | zeta | 9/10 | 64 | 63 | - | 64, -1.56 |
| W3 | 3000 | zeta | 1/1 | none | 400 | - | 400, 5.15e-92 |
| W3 | 3000 | zeta | 101/100 | none | 400 | - | 400, 8.1e-91 |
| W3 | 3000 | zeta | 2/1 | none | 400 | - | 384, 1.7e-33 |
| W3 | 3000 | chi_-4 | 9/10 | 256 | 255 | - | 256, -1.17 |
| W3 | 3000 | chi_-4 | 1/1 | none | 400 | - | 384, 6.48e-13 |
| W3 | 3000 | chi_-4 | 101/100 | none | 400 | - | 384, 1.06e-12 |
| W3 | 3000 | chi_-4 | 2/1 | none | 400 | - | 384, 0.0157 |
| W3 | 3000 | chi_5 | 9/10 | 256 | 255 | - | 256, -0.589 |
| W3 | 3000 | chi_5 | 1/1 | none | 400 | - | 384, 2.2e-09 |
| W3 | 3000 | chi_5 | 101/100 | none | 400 | - | 384, 3.25e-09 |
| W3 | 3000 | chi_5 | 2/1 | none | 400 | - | 384, 0.237 |
| W3 | 3000 | E_a | 9/10 | 64 | 63 | - | 64, -0.00103 |
| W3 | 3000 | E_a | 1/1 | 192 | 191 | - | 192, -3.32 |
| W3 | 3000 | E_a | 101/100 | 192 | 191 | - | 192, -2.26 |
| W3 | 3000 | E_a | 2/1 | 320 | 319 | - | 320, -0.00125 |
| W3 | 3000 | T-NR | 9/10 | none | 400 | - | 395, 1.25 |
| W3 | 3000 | T-NR | 1/1 | none | 400 | - | 395, 1.31 |
| W3 | 3000 | T-NR | 101/100 | none | 400 | - | 395, 1.32 |
| W3 | 3000 | T-NR | 2/1 | none | 400 | - | 395, 1.83 |
| W3 | 3000 | DH | 9/10 | 256 | 255 | - | 256, -0.0155 |
| W3 | 3000 | DH | 1/1 | none | 400 | - | 384, 3.82e-08 |
| W3 | 3000 | DH | 101/100 | none | 400 | - | 384, 5.74e-08 |
| W3 | 3000 | DH | 2/1 | none | 400 | - | 384, 0.237 |
| W3 | 3000 | WT | 9/10 | 64 | 63 | - | 64, -0.739 |
| W3 | 3000 | WT | 1/1 | none | 400 | - | 400, 1.21e-25 |
| W3 | 3000 | WT | 101/100 | none | 400 | - | 400, 1.26e-25 |
| W3 | 3000 | WT | 2/1 | none | 400 | - | 400, 9.61e-15 |
| W3 | 3000 | Liouville | 9/10 | 41 | 40 | - | 41, -0.474 |
| W3 | 3000 | Liouville | 1/1 | 41 | 40 | - | 41, -0.255 |
| W3 | 3000 | Liouville | 101/100 | 41 | 40 | - | 41, -0.229 |
| W3 | 3000 | Liouville | 2/1 | 192 | 191 | - | 192, -12.3 |

### threshold in Y (local, mpmath 1200 bits, no enclosures; design W1, order <= 120)

| object | Y | first order with a negative pivot | positive orders | smallest pivot (order, value) |
|---|---|---|---|---|
| zeta | 1/2 | 4 | 3 | 4, -0.102 |
| zeta | 9/10 | 16 | 15 | 16, -1.5 |
| zeta | 95/100 | 16 | 15 | 16, -0.0647 |
| zeta | 99/100 | 40 | 39 | 40, -6.47e-06 |
| zeta | 999/1000 | 86 | 85 | 86, -5.58e-26 |
| zeta | 1/1 | none | 120 | 120, 3.86e-143 |
| T-NR | 1/2 | none | 120 | 107, 0.967 |
| T-NR | 9/10 | none | 120 | 107, 1.29 |
| T-NR | 95/100 | none | 120 | 107, 1.32 |
| T-NR | 99/100 | none | 120 | 107, 1.35 |
| T-NR | 999/1000 | none | 120 | 107, 1.35 |
| T-NR | 1/1 | none | 120 | 107, 1.35 |
| DH | 1/2 | 32 | 31 | 32, -2.17 |
| DH | 9/10 | 68 | 67 | 68, -5.62 |
| DH | 95/100 | 74 | 73 | 74, -0.593 |
| DH | 99/100 | 100 | 99 | 100, -0.000119 |
| DH | 999/1000 | none | 120 | 120, 1.36e-21 |
| DH | 1/1 | none | 120 | 120, 1.53e-21 |
| chi_5 | 1/2 | 48 | 47 | 48, -0.502 |
| chi_5 | 9/10 | 64 | 63 | 64, -0.576 |
| chi_5 | 95/100 | 72 | 71 | 72, -10.9 |
| chi_5 | 99/100 | 100 | 99 | 100, -0.000521 |
| chi_5 | 999/1000 | none | 120 | 120, 2.92e-22 |
| chi_5 | 1/1 | none | 120 | 120, 3.27e-22 |
