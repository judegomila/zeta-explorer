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

