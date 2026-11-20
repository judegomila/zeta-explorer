# c17-rank2-gram-symmetric-blaschke-closure: is rank-2 Eisenstein Gram positivity closed under symmetric Blaschke insertions?

Internal working note, 2026-11-19/20, round 17, heavy compute lane (attack, kind: compute). Inputs: lane
`c16-u6g-scattering-fe-rank2-bridge-stage-a` (RESULT.md, REFEREE.md: Lemma R, referee E1), control ZQ of
`c15-control-with-zeta-fe-classes-u1-u2`, map row D10. RH is open. No statement about zeros of zeta is made. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X / CLASSICAL / MEASURED (ball arithmetic unless stated) / ARGUED / OPEN.

**Verdict: partial result. Neither a proof of closure for zeta nor a certified failure: outcome "tried, not closed",
with the searched range stated. Proved: Lemma M (reduction to the apex T = 0) and Theorem T (closure and the
inertia law in a rational model, degree 2). Measured: closure on 1.4 million certified matrices; the inertia law.
Score 0; all four flags false.**

1. Source check (step 0). The formula is Theorem 6.1 with (7.6) of S. D. Miller, "On the existence and temperedness
   of cusp forms for SL_3(Z)" (arXiv math/0006058; attributed there to Langlands, with Arthur 1978/1980 for the
   truncation). It is the 36-term formula of c16 section 2.1 with R(s) = Z(s)/Z(s+1) = M(s). The source states no
   range for the truncation parameter ("C in a_0 a fixed parameter"; "c > 0" in the SL_2 interlude; "c large
   enough" where it is used); Arthur's general statement needs C sufficiently regular. So "(I2) holds for zeta on
   the closed chamber T >= 0, including T = 0" is not taken from a source: it is MEASURED here (zeta: 0 negative
   in every run), and every statement below is relative to the formula as an algebraic expression. M = 1 and
   M = -1 were verified against an independent two-dimensional quadrature (defect 3e-31 to 7e-28).
2. Lemma M (PROVED; an identity plus rank-one positivity). d/d tau_2 K_T and d/d tau_1 K_T are Gram kernels of
   three-term vectors in the rank-one Maass-Selberg space at heights t_1/2 and t_2/2. Hence K_T - K_0 is a
   positive kernel for every T in the closed chamber, for zeta and for zeta times any Blaschke factor covered by
   Theorem C of row D9. So (I2) on the whole chamber is equivalent to (I2) at the apex T = 0: a negative
   direction at any T >= 0 is a negative direction at T = 0 on the same points. The search can be read at T = 0 alone.
3. Search (step 2; server and, after the server saturated, the Mac; ball arithmetic on every matrix, no float screen). Symmetric insertions of order 2 to 20
   (136 registered configurations: quartets 1/2 +- eta +- i g with eta in [0.01, 0.45] and g in [0.1, 1000], real
   pairs, products up to order 20), Gram matrices of order 1 to 40 on seven registered point families, eight
   registered T: 1,397,025 matrices, every one certified positive definite, 0 failures, 0 undecided (47% of the
   registered plan, a uniform sample; the server saturated and the unit was stopped). Beyond registration: orders
   64 and 96 and eta down to 1e-6 and up to 0.499: 5,208 matrices, all certified positive.
4. Controls in the same runs (section 5). zeta passes. A single real zero right of 1/2 fails (referee E1 confirmed,
   certified). Unpaired left zeros fail (Lemma R confirmed, certified). DH passes (1,284 certified matrices up to
   order 96, including points at its own off-line zero): not separated. Backward heat passes at t = 0 and t = -1
   and fails at t = -5 and t = -10 (zeros with real part above 1, MEASURED, mpmath quadrature). ZQ in the rational
   form of c15 (two zeta zeros removed from the line, one off-line quartet inserted) passes: 3,360 of 3,360
   certified matrices up to order 64. The c16 table row "ZQ rational form fails at S3/S4 (ARGUED)" is wrong.
5. Inertia law (MEASURED, 16 configurations, 20 certified matrices of order 40 and 64 each). At T = 0 the kernel
   of zeta times a Blaschke factor Theta has exactly kappa negative squares, kappa = sum over zeros a of Theta with
   0 < Re a < 1/2 of max(0, mult(a) - mult(1 - a)), plus the sign defect of referee E1. Symmetric sets have
   kappa = 0. A quartet whose right members are displaced by 1e-17 has kappa = 2, first visible at order 40.
   So (I2) reads the reflection symmetry of the inserted zero set, to very high resolution, and nothing else that
   was found: it does not read the distance of a symmetric quartet from the line.
6. Exact model (Theorem T, PROVED by exact computation; section 3.4). For the rational function
   M_0(u) = (u+1)/(u-1) (pole at 1 with positive residue, M_0(0) = -1, apex kernel identically zero) times the
   Blaschke factor of two zeros (a real pair or a conjugate pair), the apex kernel is an explicit Hermitian form of
   rank at most 3 in the Weyl invariants 1, I_2, I_3, and its inertia is exactly the inertia law: a conjugate pair
   gives (3, 0) for Re a > 1/2, (1, 2) for Re a < 1/2 and a positive form of rank 1 for Re a = 1/2; a real pair
   {a, 1 - a} gives a positive form of rank 1. For four zeros the same holds at 14 exact parameter values
   (symmetric quartets: rank 6, positive; a quartet displaced by 1/1000: rank 10, two negative squares).
   Closure under symmetric insertion is therefore true in the model for degree 2, and at a symmetric set the form
   sits on a wall: the rank drops by the degree d and a piece of signature (d/2, d/2) collapses to zero. This is a
   model, not zeta.

---

## 1. Plan, sources, what is new

Read: BRIEF to the end; c16 RESULT.md and REFEREE.md; c15 RESULT.md (section 4, ZQ); map rows D9, D10 and the
section 2 notes on BLS and ZQ; lane c13 section 3.3 (Theorem C).

Question (combinable 2 of round 16): (I2) is positivity of

    K_T(lam, mu) = sum over w, w' in S_3 of c(w, lam) conj(c(w', mu)) e^{<nu, T>} / (nu_1 nu_2),   nu = w lam + conj(w' mu),

with the cocycle c built from one function M at z_1, z_2, z_1 + z_2 (c16 section 2.1). Is it closed under
M -> M Theta_P, Theta_P(u) = P(u)/P(u+1), P a real polynomial with P(s) = P(1 - s) and zeros in the strip
(zeta times a symmetric multiplier)?

New relative to the record: the source check; Lemma M (reduction of the chamber statement to the apex);
ball-certified inertia on matrices of order up to 96 (the record has order at most 7, no certificate);
the rational form of ZQ, DH at order up to 96 and backward heat as run controls; the inertia law; the calibration
of the test by displaced quartets; Theorem T (an exactly solved rational model).

Requirements as planned: none can be earned by this lane. It tests R3 for the device of row D10: if closure
holds, every symmetric control passes and the device is closed; if closure fails with zeta passing, the device
separates zeta from a ZQ-type control and reopens.

## 2. Step 0: source check and independent quadrature

- Source opened: arXiv math/0006058 (S. D. Miller, J. reine angew. Math. 2001). Truncation: section 3, (3.3)
  (Langlands' truncation after Arthur, sum over standard parabolics of alternating constant terms cut by the
  characteristic functions tau-hat_P(H_0(gamma x) - C)). Theorem 6.1 (Langlands' inner product formula):
  the integral of Lambda^C E(lam_1) conj(Lambda^C E(lam_2)) equals the sum over s_1, s_2 of
  e^{(s_1 lam_1 + s_2 conj lam_2)(C)} / product over simple alpha of (s_1 lam_1 + s_2 conj lam_2)(alpha^vee)
  times the pairing of the intertwining operators. Formula (7.6): for the minimal parabolic of SL_3(Z),
  M(s, lam) = product over i < j with s(i) > s(j) of R(l_i - l_j), R(s) = Z(s)/Z(s+1), Z(s) = pi^(-s/2) Gamma(s/2) zeta(s).
  This is the cocycle table of c16 section 2.1 with M = R.
- Range of the truncation parameter: not stated in the source. C is "a fixed parameter" in a_0; the SL_2
  interlude takes c > 0; the proof of (5.6) takes "c large enough". Arthur's theorem is for sufficiently regular
  C. A threshold for SL_3(Z) was not found in the source. Consequence: the chamber T >= 0 as the range of (I2)
  for zeta is MEASURED, not CLASSICAL; statements here are about the algebraic kernel K_T.
- Independent quadrature (`step0_quad.py`, mpmath 30 digits, iterated Gauss-Legendre in the coordinates
  h_i = varpi_i(H); the c16 lane and its referee used alpha-coordinates and other parametrisations). For M = 1
  and M = -1 (c = sign character) the 36-term sum equals the integral of F_lam conj(F_mu) over the kite
  {h_1 <= tau_1, h_2 <= tau_2, 2h_1 - h_2 >= 0, 2h_2 - h_1 >= 0} at three (lam, mu, T): relative defect
  3e-31 to 1e-30 (M = 1), 7e-31 to 7e-28 (M = -1). At T = 0 both sides vanish (1e-30): for M = +-1 the apex
  kernel is identically zero.

Coordinates used below: tau_1 = (2 t_1 + t_2)/3, tau_2 = (t_1 + 2 t_2)/3, so that <nu, T> = nu_1 tau_1 + nu_2 tau_2
and K_T is the regularised integral of F_lam conj(F_mu) over the quadrant {h_1 <= tau_1, h_2 <= tau_2}.
The chamber t_1, t_2 >= 0 is {tau_2 <= 2 tau_1, tau_1 <= 2 tau_2}; t_1 = 2 tau_1 - tau_2, t_2 = 2 tau_2 - tau_1.

## 3. Step 1: paper

### 3.1 Lemma M (monotonicity in T; PROVED)

Rank-one kernel: K1_t(a, b) = e^{(a+b*)t}/(a+b*) + M(a) e^{(-a+b*)t}/(-a+b*) + M(b)* e^{(a-b*)t}/(a-b*) - M(a) M(b)* e^{-(a+b*)t}/(a+b*)
(b* = conj b). This is the Maass-Selberg kernel of e^{ax} + M(a) e^{-ax} truncated at height t.

**Lemma M.** For every M with M(u) M(-u) = 1, every T and all lam, mu:

    d/d tau_2 K_T(lam, mu) = sum over j, k = 1..3 of a_j(lam) conj(a_k(mu)) K1_{t_1/2}(n_j(lam), n_k(mu)),

with (n_1, n_2, n_3) = (z_1, z_1 + z_2, z_2) and a_j = c(w_j, lam) e^{(x_2 + x_1/2) tau_2}, (x_1, x_2) = w_j lam,
w_j = e, s_2, s_2 s_1. The same holds for d/d tau_1 with the roles of the two simple roots exchanged and height t_2/2.

Proof. d/d tau_2 removes the factor nu_2 from the denominator. Group S_3 into the cosets {w, s_1 w}. With
(x_1, x_2) = w lam one has s_1 w lam = (-x_1, x_1 + x_2) and c(s_1 w, lam) = M(x_1) c(w, lam). The two terms of a
coset are c e^{x_2 tau_2} [ e^{x_1 tau_1} e_{x_1} + M(x_1) e^{x_1 tau_2} e^{-x_1 tau_1} e_{-x_1} ]
= c e^{(x_2 + x_1/2) tau_2} [ e^{x_1 t} e_{x_1} + M(x_1) e^{-x_1 t} e_{-x_1} ], t = tau_1 - tau_2/2 = t_1/2, where
the symbols pair by (e_x, e_y) = 1/(x + y*). The pairing of two brackets is K1_t. QED.
Check: analytic derivative of the 36-term formula against the 9-term combination, relative defect 1e-87 at
300 bits, nine cases (`lemma_mono.py`).

**Corollary M1.** If the rank-one kernel K1_t of M is positive for every t >= 0 on Re > 0, then for lam in the open
chamber (so that n_j(lam) has positive real part) d/d tau_2 K_T is a positive kernel whenever t_1 >= 0 and
d/d tau_1 K_T is a positive kernel whenever t_2 >= 0. Hence K_T - K_T' is a positive kernel whenever T can be
reached from T' inside the closed chamber by increasing tau_1 and tau_2; in particular
K_T - K_0 >= 0 for every T in the closed chamber (the segment from 0 to T increases both tau_i).

**Corollary M2 (reduction to the apex).** For such M: (I2) holds for every T in the closed chamber if and only if
K_0 is a positive kernel. A negative direction of a Gram matrix at some T >= 0 is a negative direction of the
Gram matrix at T = 0 on the same points.

Scope of the hypothesis: rank-one positivity for t >= 0 is CLASSICAL for zeta (Maass-Selberg for SL_2(Z), Y >= 1)
and PROVED for zeta times Blaschke factors of conjugate pairs and real double zeros (row D9, Theorem C, which is
stated for any Re a > 0; e^{-tu} M is in the class for t >= 0). For two distinct real zeros Theorem C does not
apply (its discriminant condition fails); for the real pairs 1/2 -+ eta the hypothesis is MEASURED
(`lemma_mono_real.py`: 192 of 192 derivative Gram matrices of order 12 and 24 certified positive).
Checks of the corollaries: derivative Gram matrices and K_T - K_0 certified positive for zeta, for a symmetric
quartet and also for an unpaired left pair (`lemma_mono.log`): the left control fails (I2) at the apex only,
and the failure is filled in as T grows, as the lemma requires.

What Lemma M says about (I2): step S4 of c16 is "rank-one Maass-Selberg positivity" plus one statement at the
apex. Everything specific to rank 2 (Lemma R, referee E1, the question of this lane) is a property of the single
kernel K_0(lam, mu) = sum of c conj(c') / (nu_1 nu_2). For M = +-1 this kernel is zero; for zeta it is small
(smallest pivots 1e-10 at order 6, 1e-56 at order 40), which is why the margins at T = 0 are small.

### 3.2 Attempt at closure of the apex kernel (not completed; OPEN)

- Rank one, for comparison. With b the denominator function (M = b(-u)/b(u)), the rank-one apex kernel is
  4 [B(zeta) conj A(omega) - A(zeta) conj B(omega)]/(zeta - conj omega), zeta = z^2, A = even part of b,
  B = zeta times the odd part: a de Branges kernel in zeta; positivity is "N = B/A is Nevanlinna"; multiplication of
  b by a Hurwitz polynomial g acts on (A, B) by the matrix [[g_e, g_o], [zeta g_o, g_e]]; for a conjugate pair
  this is the Moebius map of Theorem C. (Derived here; consistent with row D9.) The proof uses the quotient
  variable zeta = z^2 and a scalar function N.
- Rank 2. By c16 Lemma D, F^{M Theta}_lam is proportional to D_g F^M_lam, D_g = product over positive roots of
  g(d/d alpha^vee) = g(d_1) g(d_2) g(d_1 + d_2) in the coordinates h. The adjoint of D_g for the quadrant form is
  the product over negative roots, and D_g^adj D_g = product over all roots of g(d_alpha) is Weyl-invariant, so it
  acts on F_lam by the scalar G(lam) = product over all roots of g(lam_alpha) (PROVED, elementary). Therefore
  K^{M Theta}_0 = (multiplier) K^M_0 + edge terms + apex terms, where the edge terms are regularised
  one-dimensional integrals over the two edges of the quadrant of Hermitian forms in transverse jets. The edge
  terms are not of finite rank and their sign is not decided by the rank-one theory, because the jets of F_lam
  along an edge are six-term exponential sums whose coefficients are not a rank-one cocycle.
- The step that is missing: a rank-2 analogue of the Nevanlinna function. The polynomial ring in lam is free of
  rank 6 over the invariants; K_0 is a 6 x 6 matrix kernel in the invariants whose denominator is the degree-12
  invariant product over w of (lam + w conj mu)_1 (lam + w conj mu)_2. No Pick-type characterisation of positivity
  for this kernel is on file, and none was found here. The integral decomposition
  K_T = regularised integral over h_2 <= tau_2 of (rank-one Gram at height tau_1 - h_2/2) has a positive integrand
  for every h_2 (Lemma M), but the regularisation at h_2 -> -infinity (three of the six exponents grow) is not a
  positive operation, so the decomposition proves monotonicity and not positivity.
- No automorphic realisation: a symmetric multiplier is a change of the archimedean Schwartz function
  (zeta(s) P(s) pi^(-s/2) Gamma(s/2) is the Tate integral of P(-x d/dx) e^{-pi x^2}, self-dual when P(s) = P(1-s)),
  but a spherical section rescales all six constant-term coefficients together and leaves M unchanged; K-types
  with a one-dimensional space of M-invariants give real zeros at integers only (c16 Lemma D remark). So closure,
  if true, is a statement about the algebraic kernel and not a Gram identity of automorphic forms. ARGUED.

Answer to the step-1 question ("does a symmetric factor contribute a positive kernel?"): not decided on paper.
The Weyl-sum does factor into rank-one Gram kernels after one derivative in T (Lemma M), and each of those is
closed under every Blaschke insertion; the symmetric condition enters only at the apex, where no factorisation
into positive rank-one pieces was found.

### 3.3 Inertia law (MEASURED; `inertia_law.py`, certified inertia at T = 0, orders 40 and 64, five point families, 20 matrices per case)

| inserted zeros of Theta (zeta's M times Theta) | predicted kappa | observed negative squares |
|---|---|---|
| none (zeta) | 0 | 0 in 20 of 20 |
| left pair 0.2 +- 3i | 2 | 2 in 20 of 20 |
| two left pairs | 4 | 4 in 20 of 20 |
| real left pair {0.3, 0.2} | 2 | 2 in 20 of 20 |
| real right pair {0.6, 0.8} | 0 | 0 in 20 of 20 |
| real {0.25, 0.9} (not partners) | 1 | 1 in 20 of 20 |
| exact quartet (0.25, 2) | 0 | 0 in 20 of 20 |
| quartet with the left pair doubled | 2 | 2 in 19, 1 in 1 |
| quartet with the right pair doubled | 0 | 0 in 20 of 20 |
| quartet doubled | 0 | 0 in 20 of 20 |
| left pair and a quartet elsewhere | 2 | 2 in 19, 0 in 1 |
| double pair on the line 1/2 +- 2i | 0 | 0 in 20 of 20 |
| simple pair on the line 1/2 +- 2i | (0) | 0 in 20 of 20 |
| single real zero 0.75 | (referee E1) | 1 in 20 of 20 |
| single real zero 0.25 | | 2 in 20 of 20 |
| real zeros {0.25, 0.75, 1} | | 0 in 20 of 20 |

Statement (MEASURED, not proved): kappa = sum over zeros a of Theta with 0 < Re a < 1/2 of
max(0, mult(a) - mult(1 - a)), plus 1 for an odd number of real zeros unless one of them is at 1.
A finite sample can only undercount (two cells show one matrix below the predicted count); it never exceeded it.
Lemma R of c16 is the case "one negative direction per unpaired left zero"; the law says these are all the
negative directions and that the multiplicity version holds. Structure suggested: K_0 of M Theta is a
Pontryagin-type kernel whose negative index counts the defect of the reflection a -> 1 - a on the left half.

### 3.4 Exact model: Theorem T (PROVED by exact rational computation; `toy_exact.py`, `toy_verify.py`, `toy_inertia.py`, `toy_quartet.py`)

Base: M_0(u) = (u+1)/(u-1) = b_0(-u)/b_0(u), b_0(u) = (u-1)/u. It has M_0(u) M_0(-u) = 1, a simple pole at 1 with
residue 2 > 0, M_0(0) = -1, M_0(infinity) = 1; its rank-one function N is the constant -1 at height 0 and its
rank-2 apex kernel is identically zero (exact). It is the simplest function with the pole structure Lemma R uses.

Let g(u) = (u + a_1)(u + a_2) = u^2 + kappa u + m (real coefficients; zeros of Theta at a_1, a_2: a real pair or a
conjugate pair), M = M_0 g(-u)/g(u), psi(lam) = product over the three positive roots of g(u)(u - 1) at
u = z_1, z_2, z_1 + z_2, Delta = z_1 z_2 (z_1 + z_2), I_2 = z_1^2 + z_1 z_2 + z_2^2, I_3 = (2z_1 + z_2)(z_1 - z_2)(z_1 + 2z_2).

**Theorem T.** K_0(lam, mu) = Delta(lam) conj(Delta(mu)) / (psi(lam) conj(psi(mu))) times v(lam)^T H v(conj mu),
v = (1, I_2, I_3), with H = H(a_1, a_2) the real symmetric matrix

    H_33 = 4 (a_1 - 1)(a_2 - 1)(a_1 + a_2)(a_1 + a_2 - 1) = 4 kappa (kappa - 1)(m - kappa + 1),      H_13 = H_23 = 0,
    det of the block on {1, I_2} = 144 kappa^3 (kappa - 1)(2 kappa^2 + m)(m - 2 kappa + 4)(4m - 2 kappa + 1)(m - kappa + 1)^3,
    H_22 = 4 kappa (m - kappa + 1)(4 kappa^3 - 22 kappa^2 + 10 kappa m + 22 kappa - m - 4)

(H_11, H_12 in `toy_exact.json`). Since the three functions Delta v_i / psi are linearly independent, the inertia
of the kernel K_0 is the inertia of H.

Proof (computer-assisted, exact). psi(lam) c(w, lam) = sgn(w) psi(w lam), so both sides times
psi(lam) psi(mu) times D (the product of the 18 linear forms a + b, a in {z_1, z_2, z_1 + z_2} up to sign, b
likewise in mu) are polynomials of degree at most 18 in each of z_1, z_2, y_1, y_2 and at most 6 in each of
a_1, a_2, symmetric in (a_1, a_2). H was obtained by exact fitting and Lagrange interpolation on the nodes
a_i in {1/3, ..., 7/3}. The identity was then checked by exact rational evaluation on the full product grid
z_i in {2, ..., 20}, y_i in {k + 1/3: k = 2, ..., 20}, (a_1, a_2) in the 28 unordered node pairs: 3,648,988 points,
0 failures (`toy_verify.log`). A polynomial of degree at most d_i in variable i that vanishes on a product grid
with more than d_i values in each variable is zero. QED.

**Corollary T1 (inertia; PROVED from the factorisations and one exact sample per region).**
- Conjugate pair a, conj a with Im a != 0: m - kappa + 1 = |a - 1|^2, m - 2 kappa + 4 = |a - 2|^2,
  4m - 2 kappa + 1 = |2a - 1|^2 are positive, so det H has the sign of (kappa - 1)^2 and vanishes only on
  Re a = 1/2. Inertia (3, 0) for Re a > 1/2 (the form is positive definite: BLS-right passes in the model);
  (1, 2) for Re a < 1/2 (two negative squares: Lemma R with its conjugate); for Re a = 1/2 (the pair is its own
  reflection) H_33 = 0, the block determinant is 0 and H_22 = 36 m^2 > 0: positive of rank 1.
- Real pair in (0, 1): the determinant vanishes exactly on a_1 = 1/2, a_2 = 1/2 and a_1 + a_2 = 1. Both right:
  (3, 0). Both left: (1, 2). One left, one right, not partners: (2, 1), on both sides of a_1 + a_2 = 1.
  Partners a_2 = 1 - a_1: positive of rank 1.
- A real zero in (1, 2) changes the sign of the residue at 1 and gives negative squares (factor a_i - 1): this is
  step S3, not the question of this lane.

So in the model the negative index is the number of zeros with real part below 1/2 that have no reflected partner,
and symmetric sets of degree 2 give a positive form: the inertia law of 3.3 is a theorem there.

Degree 4 (`toy_quartet.py`; exact rational fit in the 19 invariant monomials of degree at most 12, identity tested
by exact equality on 10 fresh rational pairs per case, exact inertia; status: exact at the listed parameters, not
a theorem in the parameters): symmetric quartets (eta, g) = (1/4, 1), (1/10, 3), (9/20, 1/2), (1/4, 30),
(1/100, 1/5), (2/5, 14): rank 6, inertia (6, 0). Quartet with the right pair shifted by 1/1000, or at another
height: rank 10, (8, 2). Two left pairs, and a doubled left pair: (6, 4). Two right pairs: (10, 0). Doubled pair
on the line, two pairs on the line, real partners with a pair on the line: rank 6, (6, 0).
Generic rank d(d+1)/2 for degree d (3 and 10); at a symmetric set the rank drops by d (to 1 and 6) and the form is
positive: a piece of signature (d/2, d/2) collapses to zero. This is why a displacement of 1e-17 already gives
negative squares (5.4), and why closure, if true for zeta, cannot be proved by a strict inequality.

What the model does and does not give. It gives an exact instance of the question with the answer "closed", a
second instance of Lemma M (K_T - K_0 >= 0 with K_0 = 0 for the base), and the algebraic form a general proof would
have: a Bezoutian of the root system A_2 on the Weyl invariants. It does not give zeta: zeta's apex kernel is not
of finite rank and M_0 has no arithmetic. A limit argument from rational functions would need rank-2 positivity
of the approximants, which is the statement to be proved.

## 4. Step 2: pre-registered search (server)

Method. `k2.py` (kernel from the formula, python-flint acb; does not import the c16 code), `search.py`.
Every task: a configuration, a point family, an order n, a T, a seed; the n x n Gram matrix is computed in ball
arithmetic; diagonally pivoted LDL* in ball arithmetic; the task is "certified positive" if all n pivot balls are
positive, "certified negative" if some pivot ball is negative (Sylvester: a certified negative Schur-complement
diagonal is a certified negative direction of the true matrix), "undecided" if a pivot ball contains 0 at
256, 512, 1024, 2048 and 4096 bits. The registered float64/GPU screen was replaced by this certificate on every
matrix (it is stricter and was fast enough: about 590 matrices per second on 10 idle cores); the GPU was not used:
the work is ball arithmetic on small matrices and evaluations of zeta, which is not GPU-shaped.
Inserted zero sets are built in ball arithmetic from the dyadic numbers eta, g, so that the set is exactly
closed under a -> 1 - a (see 5.4 for what happens otherwise).

Registration (fixed in `search.py` before the server run):
- Configurations (136): real pairs 1/2 -+ eta and quartets 1/2 +- eta +- i g for eta in {0.01, 0.05, 0.1, 0.2, 0.3,
  0.4, 0.45}, g in {0.1, 0.5, 1, 3, 7, 14.2, 21, 30, 50, 100, 300, 1000}; three quartets at the ordinate of the
  first zeta zero; 42 products of quartets and real pairs of order 6, 8, 10, 12, 16, 20 (random eta in
  [0.01, 0.45], g log-uniform in [0.1, 3], [0.1, 40] or [5, 1000]).
- Point families (7): `low` (Re in [0.02, 1.5], Im in [-6, 6]); `height` (Im within 3 of an inserted ordinate);
  `special` (one or two of z_1, z_2, z_1 + z_2 within 1e-6 to 1e-1 of an inserted zero, its reflection, a zeta zero
  or 1, including the Lemma R points (1 - a, a)); `wall` (Re z_i = 1e-6 to 1e-2); `cluster` (all points within
  10^-2.5 to 10^-0.7 of one centre); `polar` (within 1e-7 to 1e-2 of z_1 + z_2 = 1, z_1 = 1 or z_2 = 1);
  `realish` (imaginary parts 1e-5 to 1e-2).
- Orders: 1, 2, 3, 5, 8, 12, 20, 40. T grid: (0,0), (0.05,0), (0,0.05), (0.3,0.3), (1,0), (0,1), (1,1), (3,3);
  half of the tasks at T = (0,0) (decisive by Corollary M2), the rest cycled over the other seven.

Execution. Units `rh-c17g-controls` (8 cores), `rh-c17g-heat` (6), `rh-c17g-main` (10), `rh-c17g-ext` (6),
`rh-c17g-zq` (4); at most 20 cores for about 10 minutes, otherwise at most 16; under 2 GB in total. The registered
main plan has 2,970,240 tasks in a fixed shuffled order (scale 60). The server ran the front of the list at
about 590 matrices per second for the first 400,000 tasks; the machine then went to a load average of 150 to 170
(26 units of other lanes) and the rate fell to 75 per second. The main unit was stopped by this lane at 560,000
tasks (last log line; the file of non-positive records is empty, 0 bytes). The back of the same shuffled list was
run on the Mac through `scripts/memcap.sh 8` with a 17-minute limit (837,025 tasks, disjoint from the server
part). The extension plan (orders 64 and 96) was starved on the server, stopped, and run locally in full
(7,560 tasks, 297 s). All server units of this lane are stopped.

**Result of the registered search: 1,397,025 Gram matrices of symmetric insertions (560,000 on the server,
837,025 on the Mac), every one certified positive definite in ball arithmetic; 0 certified failures; 0
undecided.** The completed part is a uniform sample (47%) of the registered plan; it touches all 136
configurations and all 60,928 cells (configuration, family, order, T).

| order n | matrices | certified positive | negative | undecided | smallest pivot ratio | bits needed |
|---|---|---|---|---|---|---|
| 1 | 322,072 | 322,072 | 0 | 0 | 1 | 256 |
| 2 | 214,822 | 214,822 | 0 | 0 | 1e-25 | 256 |
| 3 | 214,675 | 214,675 | 0 | 0 | 1e-29 | 256 |
| 5 | 161,187 | 161,187 | 0 | 0 | 1e-28 | 256 |
| 8 | 161,330 | 161,330 | 0 | 0 | 1e-33 | 256 |
| 12 | 107,991 | 107,991 | 0 | 0 | 1e-45 | 256 |
| 20 | 107,350 | 107,350 | 0 | 0 | 1e-61 | 512 |
| 40 | 107,598 | 107,598 | 0 | 0 | 1e-99 | 512 |

By T: 698,762 at T = (0,0) and 99,555 to 99,996 at each of the other seven; by family: 198,968 to 200,020 each;
by order of the inserted set: 72,075 (order 2), 893,288 (order 4), 71,712 to 72,235 each for orders 6, 8, 10, 12,
16, 20. No negative and no undecided matrix in any cell (`main_summary.json`, from `main.agg.json` and
`main_local.agg.json`).

Extension beyond the registered size (`ext`, local; orders 64 and 96; every third registered configuration, and
16 configurations outside the registered range: eta = 1e-3, 1e-6 (nearly double zeros on the line) and
eta = 0.49, 0.499 (zeros within 0.01 and 0.001 of Re = 0 and Re = 1), g = 0.01, 1, 14.2): 5,208 matrices, all
certified positive (3,472 of order 64, 1,736 of order 96; smallest pivot ratio 1e-144, 1024 bits).

Local, same method: adversarial descent on the diagonal at T = 0 (`adv_diag.py`: 54 configurations, 60 starts
each; the minima are at the corner lam -> 0 where the form vanishes; all 54 minima certified positive at 1024
bits, `adv_recheck.log`); repeated insertions (`mult_check.py`: the same quartet 2, 3 and 5 times, a real pair up
to 10 times, orders 12, 40, 64: 270 of 270 certified positive).

## 5. Controls (same code, same certificate)

### 5.1 Registered controls (`controls` run, 30,576 tasks, orders 1 to 40, same families and T grid; `ext` for orders 64, 96)

| control | expectation | result |
|---|---|---|
| zeta, no insertion | pass | 1,092 of 1,092 certified positive; orders 64, 96: 84 of 84 |
| single real zero right of 1/2: a = 0.55, 0.75, 0.9 | fail (referee E1) | certified negative in 539, 526, 448 of 1,092; from order 1; at every T of the grid including (3,3) |
| unpaired left pair 0.2 +- 3i, 0.4 +- 14.2i, 0.05 +- 100i | fail (Lemma R) | certified negative in 618, 226, 109 of 1,092; from order 1 |
| unpaired right pair 0.8 +- 3i, 0.55 +- 0.2i, 1.6 +- 2i, 0.7 +- 100i | pass | 4,368 of 4,368; orders 64, 96: 336 of 336 |
| DH (completed function, functional equation checked to 2e-60) | registered as "diagonals" | 1,092 of 1,092 certified positive up to order 40; 84 of 84 at orders 64, 96; 108 of 108 at points within 1e-6 to 1e-1 of its off-line zero 0.808517 + 85.699348i and reflections (`dh_near_zero.py`) |
| rational toy M_0 = (u+1)/(u-1) | auxiliary | apex kernel identically zero (pivots are exact zero balls: "undecided" by construction at T = 0); positive at T > 0; with symmetric quartets: no negative (finite rank; see 3.4) |

### 5.2 ZQ in the rational form of c15 (`zq_control.py`, server)

G = zeta m, m as in c15 section 4: the zeta zeros 1/2 +- i g_1, 1/2 +- i g_2 are removed and the quartet
1/2 +- eta +- i (g_1 + g_2)/2 is inserted; M_ZQ(u) = M(u) m(u)/m(u+1); g_1, g_2 are balls from `acb.zeta_zero` at the
working precision, so the cancellation of poles of m against zeros of zeta is enclosed. Six instances: zeros
(1, 2) with eta = 0.3, 0.05, 0.45; zeros (3, 4) with eta = 0.2; zeros (6709, 6710) with eta = 0.01, 0.25 (the four
instances of c15 and two more). Orders 1 to 64, seven families (special points include the removed zeros and
the inserted quartet), T = (0,0) and (0.3,0.3): **3,360 of 3,360 certified positive.**
So ZQ passes (I2) (MEASURED, certified per matrix). M_ZQ is analytic in Re u > 0 apart from the pole at 1: the
poles of m at the removed zeros are cancelled by zeros of zeta. The c16 table row "ZQ (rational form): fails at
S3/S4 because the poles of the multiplier are non-real poles of M (ARGUED)" does not hold.

### 5.3 Backward heat (`heat.py`, `heat_control.py`, server; MEASURED, non-rigorous quadrature)

f_t(s) = integral of e^{t v^2} Phi(v) cosh(2(s - 1/2)v) dv (f_0 = xi_R/8, checked to 1e-60), M_t = f_t(u)/f_t(u+1);
M_0 = M (u-1)/(u+1). Real zeros of f_t(1/2 + iy) on 0 < y < 60: 13 at t = 0, 12 at t = -1, 6 at t = -5, 5 at t = -10.
Off-line zeros found at t = -5: 1.2447 + 33.478i, 1.2247 + 43.697i, 1.9640 + 51.001i (real part above 1: these
are poles of M_t in Re u > 0). 720 Gram matrices per t (orders 1, 2, 4, 8; points at low height, at height up to
40, and near the zeros found; T = (0,0), (0.3,0.3), (1,1)); a negative pivot is counted when its relative size
exceeds 1e-30 (the quadrature error is not enclosed):

| t | negative of 720 | where |
|---|---|---|
| 0 | 0 | |
| -1 | 0 | |
| -5 | 130 | near the zeros with real part above 1 (122 of 240), at height (8 of 240), none at low height |
| -10 | 30 | at height (21 of 240) and near special points (9 of 240), none at low height |

So backward heat fails once zeros have real part above 1 (the mechanism ARGUED in c16, now MEASURED) and is not
separated at t = -1, where the zeros that have left the line are still in the strip and, by the functional
equation, symmetric. A small backward flow is not detected: the device is flow-blind in the sense of the brief.

### 5.4 Calibration: displaced quartets (`bench_float_pairing.jsonl`, controls `mispair`, `ext`)

The first local benchmark built quartets from the floats 0.5 - eta and 0.5 + eta. Four of seven matrices of order
40 came out certified negative, with relative size 1e-18 to 1e-23, identically at 256 and 2048 bits, zeta
positive on the same points. Cause: 0.5 - 0.2 and 0.5 + 0.2 are not reflections of each other to better than
1e-17. With the set built exactly the same matrices are positive. This was then registered as a control:
quartets whose right members are displaced by delta (three quartets, T = 0; fraction of matrices certified negative):

| delta | n <= 5 | 8 | 12 | 20 | 40 | 64 | 96 |
|---|---|---|---|---|---|---|---|
| 1e-6 | 0 | 1/189 | 5/126 | 37/126 | 80/126 | 59/84 | 30/42 |
| 1e-10 | 0 | 0 | 0 | 5/126 | 69/126 | 58/84 | 30/42 |
| 1e-17 | 0 | 0 | 0 | 0 | 45/126 | 52/84 | 26/42 |
| 1e-30 | 0 | 0 | 0 | 0 | 0 | 28/84 | 25/42 |

Reading: the form detects a reflection defect of 1e-17 at order 40 and of 1e-30 at order 64; the searches of
c16 and its referee (order at most 7) could not have seen a defect below about 1e-6. It also shows what the
search of this lane can and cannot exclude: a violation that needs order above 96 at these point families is not excluded.

### 5.5 Control table of c16 section 5, rows changed by this lane

| Control | c16 entry | now |
|---|---|---|
| ZQ (rational form) | fails at S3/S4, ARGUED | **passes**, MEASURED (3,360 certified matrices) |
| DH | fails through zeros right of 1, ARGUED, not run; referee: 400 diagonals pass | passes up to order 96 and at its off-line strip zero, MEASURED; zeros right of 1 not reached |
| backward heat | as DH, ARGUED, not run | passes at t = -1; fails at t = -5, -10 through zeros with real part above 1, MEASURED |
| BLS-sym | none found, MEASURED (order <= 5) | none found, MEASURED with certificate (1.4 million matrices, order <= 96) |
| BLS-left | fails, PROVED-rel (Lemma R) | fails, certified; exactly 2 negative squares per unpaired pair (inertia law) |
| single real zero | fails (referee E1) | fails, certified, 1 negative square |
| DEL, THIN, U, window translate, twin, sign twist | not formulable (no functional equation, no cocycle) | unchanged |

## 6. Verdict

Outcome three of the assignment: neither a proof nor a certified failure. Closure of (I2) under symmetric
Blaschke insertions is **tried, not closed**; MEASURED closed on the registered range with a certificate per
matrix; reduced on paper to the apex kernel (Lemma M). U6 (g) is not closed as a map row by a proof.

Reading for the device of row D10. (I2) passes for zeta times every symmetric multiplier tested, for ZQ in the
form of c15, for DH at accessible height and for small backward heat. It fails exactly where the reflection
symmetry of the zero set is broken on the left half, where a real-zero parity is wrong, or where zeros have
real part above 1. All three are properties zeta has by the functional equation, the pole and the classical
zero-free region. The device reads the functional equation of the divisor with very high resolution and does
not read the critical line.

No pivot was made: the adjacent candidates named by c16 (affine kernel, K-type vectors) meet the same controls.

## 7. Requirement flags

- R1 false. Multiplicativity enters only through the Gindikin-Karpelevich identity that puts the same M on the
  three roots. Every control that passes keeps all local factors (BLS-sym, ZQ) or has none (DH). Not established as essential.
- R2 false. The inequality holds at every height with one T, but no conclusion about zeros follows from it.
- R3 false. BLS-sym, ZQ (rational form), DH (low height) and backward heat at t = -1 pass every step (MEASURED,
  certified per matrix). The controls that fail do so through the reflection symmetry, the parity of real zeros,
  or zeros right of 1, not through a step that separates zeta from a symmetric control.
- R4 false. No limit step. Lemma M moves information from large T to the apex T = 0 inside the same inequality;
  it does not pass from Re > 1 or from finite stages to the line.

## 8. Three weakest steps

1. Closure is not proved. For zeta it is MEASURED on a finite sample with a certificate per matrix: orders up to 96,
   points with imaginary parts up to about 1e3, 136 + 16 configurations, of which 42 have order above 4. The
   calibration (5.4) shows the resolving power grows with the order; a violation that is not a reflection defect
   and needs order above 96, heights above 1e3 or a point family not registered is not excluded. Theorem T proves
   closure only in a rational model and only for degree 2 (degree 4 at 14 exact parameter values). The inertia
   law is MEASURED on 16 configurations; nothing in this lane derives it for zeta.
2. Sources and premises. The source does not state the range of the truncation parameter, so "(I2) holds for zeta at
   T = 0" is measured, not classical; a referee should open Arthur's truncation paper for the regularity
   condition in SL_3(Z). Corollary M1 uses rank-one positivity: classical for zeta, Theorem C of row D9 for
   conjugate pairs (taken from the record with its two referee passes, not re-derived here beyond the de Branges
   form), MEASURED for distinct real pairs. The proof of Theorem T is computer-assisted: the degree bounds
   (18 per point variable, 6 per parameter) were derived by hand and the grid check is exact, but no second
   implementation checked the bounds.
3. Controls and execution. Backward heat uses a non-rigorous quadrature and a zero finder that located off-line zeros
   only at t = -5; DH was tested at heights below 100, where it has no zero right of 1, so "DH passes" is a
   low-height statement; T-NR as an infinite product and NR-q were not run. The registered main plan was 47%
   completed (uniform sample) because the server was saturated; 60% of the completed part ran on the Mac in one
   17-minute run under the memory cap. The GPU screen of the assignment was not used.
   No independent referee has read this file.

## 9. Proposed rows and notes (not entered)

- Row D10, addendum: "Source: Miller, math/0006058, Thm 6.1 and (7.6); range of the truncation parameter not
  stated there. Lemma M (PROVED): d K_T/d tau_i is a rank-one Maass-Selberg Gram kernel; (I2) on the chamber is
  equivalent to positivity of the apex kernel K_0. Symmetric insertions of order 2 to 20: no certified failure in
  the registered search (counts in the lane); closure not proved. Inertia law (MEASURED): the apex kernel of zeta
  times Theta has kappa negative squares, kappa = reflection defect of the left zeros plus the real-zero parity defect."
- Control table of c16, corrections: ZQ in rational form passes (MEASURED, 3,360 certified matrices), it does
  not fail at S3/S4; DH passes to order 40 including points at its off-line zero (MEASURED); backward heat fails
  at t = -5, -10 through zeros with real part above 1 and passes at t = -1 (MEASURED, non-rigorous quadrature).
- Method note: a symmetric zero set built from floating-point 0.5 - eta and 0.5 + eta is symmetric only to 1e-17
  and produces certified negative squares at order 40. Any later test of this device must build the set exactly.

Files: `k2.py`, `search.py`, `step0_quad.py/.log/.json`, `lemma_mono.py/.log/.json`, `lemma_mono_real.py/.log/.json`,
`t_first.py`, `bench_float_pairing.jsonl`, `t_cand.py`, `t_cand_float_pairing.log`, `bench.jsonl`,
`main.log`, `main.agg.json` (server, 560,000 tasks), `main_local.log`, `main_local.agg.json`, `main_summary.json`,
`controls.log`, `controls.jsonl.agg.json`, `ext.log`, `ext.agg.json`, `ext.jsonl` (non-positive records of the extension run),
`toy_exact.py/.log/.json`, `toy_exact_lib.py`, `toy_verify.py/.log/.json`, `toy_inertia.py/.log/.json`, `toy_quartet.py/.log/.json`, `toy_rank.py/.log/.json`, `toy_probe.py/.log`,
`zq_control.py/.log/.json`, `heat.py`, `heat_zeros.log`, `heat_control.py/.log/.json`, `dh_near_zero.py/.log/.json`,
`inertia_law.py/.log/.json`, `mult_check.py/.log/.json`, `adv_diag.py/.log/.json`, `adv_recheck.py/.log/.json`,
`summarise.py`, `lanes.jsonl`.
