# r3-lemma181-b: the numerator-average loss K = (3R+1)/4, structural redesign

Internal working note, 2026-11-16. Slug `r3-lemma181-b`. Nothing committed, pushed or posted. Not refereed.
Everything is relative to unrefereed inputs: the openai/math 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`,
Lemma 18.1), Xu-Sang arXiv:2610.15291v2, Liu arXiv:2610.12234 and arXiv:2610.26835v2 ("Liu II"; text copy
`../bypass-78/dl/2610.26835.txt`, line numbers below refer to it). The reference abscissa B_flat = 0.874886647
depends on all of them.

**Verdict: precise obstruction. No new abscissa. B_flat = 0.874886647 (unrefereed) is unchanged; 7/8 remains the
Lean-checked value. RH open. NO QED.**

The step "sum over a row class of |L(1/2+theta, psi_u)| <= U^{(3R+1)/4 - theta/2}" (Liu II Proposition 14.3; its
moment input is manuscript Lemma 18.1 = Liu II Theorem 12.16, prime capacity 6 kappa) is the exact optimum of the
linear program formed by every input of the source that constrains the numerator on a class. A configuration
satisfying all of those inputs attains it. So no redesign that only rearranges those inputs (class splitting, prime
range splitting, weights, a different Hoelder exponent, the two Cauchy-Schwarz steps in the other order, block-wise
mixing with the pointwise bound, several detector cutoffs) lowers K. The only inputs that change the value are
listed in section 5; none is proved.

Labels: PROVED (complete argument here; for LP statements this means: for the stated inequality system) /
EXACT (exact rational or symbolic computation) / PROVED-rel X / SKETCH / MEASURED (float LP) / MODEL (hypothetical
input priced; not a bound) / OPEN.

---

## 0. Plan; what differs from closed lanes

Read: BRIEF, CRITIC_R1, and RESULT/REFEREE of bypass-78 (no REFEREE.md exists), zf-hecke-all-fields, zf-audit-inputs,
zf-higher-rows, zf-large-values, r2-zf-critical-density, r2-zf-paired-rows, r2-zf-gm-inverse-witness,
r2-tro6-polar-theorem, r2-tro6-nonpolar-scale, r2-tro6-type12-split, tro6-numerics, tro6-period; Liu II sections
2.2, 2.5, 2.6, 13.4, 14.1-14.6; manuscript Lemma 18.1.

Already on file, not repeated:
* bypass-78 section 3 and r2-zf-critical-density section 3: class-by-class choice between the averaged and the
  pointwise numerator gives no gain (float LP, 3e-8 and 3e-14).
* r2-zf-critical-density Corollary H2 remark: Cauchy-Schwarz twice with the fourth moment equals (14.17).
* bypass-78 section 5: MODEL prices (K = R gives 13/15; capacity doubled gives 0.87419; (H) gives 0.87374).
* r2-zf-critical-density section 2: the count R_kappa as a detector min-max.

New here:
1. The numerator step written as an LP in exponents, with its exact value N(theta) for every shift
   0 <= theta <= delta/2, a primal point and dual multipliers that agree in exact rationals (Theorem A).
2. The saturating configuration is checked against every other input that touches the same quantities: the bin
   bound, the simultaneous detector at every cutoff t, M1, and the Mellin duality between block sizes and line
   suprema (section 3).
3. The redesigns named in the task are each reduced to Theorem A with an explicit identity (section 2).
4. Block-by-block mixing of the pointwise and averaged bounds inside one approximate functional equation is new as
   an option. It is proved to be the affine interpolation between the two existing endpoints, so it adds nothing;
   this also supplies the proof of the "affine interpolation" sentence that bypass-78 section 3 uses without proof.
5. Theorem B: no moment of large-sieve range (total length <= 1), however strong, changes N(theta), because the
   binding blocks have length m >= m* >= 1/3. The inputs that can change it are identified and priced (MODEL).
6. A by-product: gate (14.15) of Liu II can be weakened (Lemma G, SKETCH). It does not bind at B_flat.
7. A reading correction to bypass-78's price row "K = R" (section 5).

Walls: nothing here is an argument for a zero-free region. Theorems A and B are statements about a sufficient
estimate system (atlas section 9), not about zeros.

## 1. Setting and the inputs that constrain the numerator

Row class B (Liu II section 14.1): sixth-power-free nonunit rows u, q_u ~ U = Z^d, detector bin a = (1+delta)/2,
prime-sum amplitudes g_i with mean g = delta x, 0 <= x <= 1/2; L = l/d is the available prime length.
Count: #B <= U^{R+eps}, R = R_kappa(delta, x) of (14.3).

The numerator on the class is L(1/2 + theta + it, psi-bar_u), |t| <= H <= U^{1/100}, after the functional equation
(cost U^theta, Lemma 14.4). The approximate functional equation (14.11) writes it as O(log U) dyadic blocks: a
centrally normalised plain polynomial S_m(u) of length U^m, 0 <= m <= 1/2 + o(1), with coefficient U^{-theta m}
(first sum and dual sum alike; Proposition 14.3, "The approximate functional equation").

Inputs of the source that bound S_m on B, in exponents to base U (rho = log #B, sigma_m = log |S_m| on B,
all rows of B treated alike; this is what a bound that depends only on these inputs sees):

* **C1 (M2: Liu II Theorem 12.16; manuscript Lemma 18.1).** For plain lengths m1, m2 and prime length z with
  m1 + m2 + 6 kappa z <= 1 and z <= L: sum over all rows of |S_{m1} S_{m2} Q_sel|^2 << U^{1+eps}. On B,
  |Q_sel|^2 >= U^{2 g z}. Hence rho + 2 sigma_{m1} + 2 sigma_{m2} + 2 g z <= 1. For z = 0 the lengths are
  unrestricted.
* **C2 (bin bound).** sigma_m <= delta m / 2. From Corollary 13.8(2), |L^S(s, psi)| << U^{eps_1} on
  Re s >= a + 6e, by Mellin inversion of the block (Lemma G below; SKETCH). C2 only shrinks the feasible set, so
  the obstruction below holds with or without it.
* **C3 (count).** rho <= R.

M1 (inverse moments, Theorems 10.7, 11.2, Lemma 10.10) bounds the inverse witness M_r and contains no S_m.

## 2. Theorem A: exact value of the numerator step

Put theta0 = g/(6 kappa), tau_m = (1-R)/4 - g(1-2m)/(12 kappa), and

  m_x = [(1-R)/4 - g/(12 kappa)] / [delta/2 - g/(6 kappa)].

**Theorem A [PROVED for the system C1-C3; EXACT check].** Let 1 - delta <= R <= 1 - g/(3 kappa) (so
0 <= m_x <= 1/2) and assume the relaxed gate 1/2 - 3 kappa L <= m_x (always true if L >= 1/(6 kappa); see
Lemma G). For 0 <= theta <= delta/2 let N(theta) be the maximum over m in [0, 1/2] of rho + sigma_m - theta m
subject to C1, C2, C3. Then

  N(theta) = (3R+1)/4 - theta/2            for 0 <= theta <= theta0,
  N(theta) = R + m_x (delta/2 - theta)     for theta0 <= theta <= delta/2.

For theta = theta0 the maximum is attained at every m in [m_x, 1/2]; for theta < theta0 at m = 1/2.

Proof. Upper bound (dual). For each m two certificates:
(i) rho + sigma_m - theta m = (3/4) rho + (1/4)(rho + 4 sigma_m + 2 g z_m) - g z_m / 2 - theta m
    <= (3/4) R + 1/4 - g z_m/2 - theta m, with z_m = (1-2m)/(6 kappa): multiplier 3/4 on C3 and 1/4 on C1 at
    (m, m, z_m). This is Hoelder (3/4, 1/4), i.e. (14.17). Its value is (3R+1)/4 - theta0/2 + m(theta0 - theta).
(ii) rho + sigma_m - theta m <= R + m(delta/2 - theta): multiplier 1 on C3 and 1 on C2.
The minimum of (i) and (ii), maximised over m, is the displayed N(theta): (ii) is increasing in m; (i) is
increasing for theta < theta0 and decreasing for theta > theta0; they cross at m_x; (i) <= (ii) at m = 1/2 iff
R >= 1 - delta (identity I6). Blocks with z_m > L (m < 1/2 - 3 kappa L) lie below m_x by the gate, where (ii) is
the smaller one.
Lower bound (primal). Take rho = R and sigma_m = min(delta m/2, tau_m) (the "flat configuration": #B = U^R and
every row of B has |S_m| = U^{sigma_m}, |Q_i| = P_i^g; rows outside B have |S_m| <= 1). C2, C3 hold. C1: for a
pair on the tau branch, 2 tau_{m1} + 2 tau_{m2} + 2 g z <= 1 - R iff z <= (1 - m1 - m2)/(6 kappa), which is the
length condition. For a pair with m1 <= m_x on the delta branch and m2 on the tau branch the left side is
(1-R)/2 + delta m1 + g(1 - 2 m1)/(6 kappa) <= 1 - R iff m1 <= m_x. For two delta-branch blocks it is
delta s + g(1-s)/(3 kappa) with s = m1 + m2 <= 2 m_x, increasing in s, equal to 1 - R at s = 2 m_x. The sum over
all rows is then <= 2U. The objective at block m equals min((i), (ii)) for every m >= 1/2 - 3 kappa L. QED.

EXACT check (`numerator_lp.py`, `numerator_lp.log`): Fractions, grid m = j/120, all 1891 pairs; 6 classes x 2 values
of R x 2 values of L x 5 values of theta = 120 cases, including the critical class at kappa_flat and at 3/4. In all
120 the primal value equals the dual value as rationals, and HiGHS on the same LP returns the same number
(max difference 0). At the critical class: N(0) = 0.692749265 = K, N(theta0) = 0.666666667 (= 2/3, which is the
defining equation cr = 0 of delta_c, bypass-78 Proposition U), N(delta/2) = 0.590332354 = R.

**Identities [EXACT, sympy, `identities.py`].**
* I1: at the detector crossing, both counts equal R_kappa: 1 - delta F_I(r*) = 1 - delta F_S(m*) = R_kappa.
* I2: m_x evaluated at R = R_kappa equals m* = t_kappa - r_kappa, the plain detecting length at the crossing
  (Liu II (2.9)). By Liu II Proposition 2.7, 1/3 <= m* <= 1/2. At the critical class m* = 0.418253634,
  r* = 0.745699943, t_kappa = 1.163953577, theta0 = 0.052165197.
* I3: on the tau branch the block exponent R + tau_m - theta0 m is independent of m (this is (14.14)).
* I4: see 2.2.
* I5: N(theta0) + theta0 = K + theta0/2 and N(delta/2) + delta/2 = R + delta/2.

So the binding blocks are those of length m in [m*, 1/2] (at the critical class [0.4183, 0.5]), and the length at
which the binding range starts is the detector's own plain length.

### 2.1 Class splitting, prime-range splitting, weights, other Hoelder exponents  [PROVED]

Any inequality for sum_B |S_m| that is valid for all nonnegative arrays satisfying C1-C3 is valid for the flat
configuration, where the sum equals U^{rho + sigma_m}. Sub-dividing B, weighting rows, or changing exponents does
not change that. Two specific cases:
* Sub-classes by detector pair (r, m_d): the count of a sub-class is min(M1 count at r, M2 count at m_d), and N is
  increasing in R (slope 3/4), so the worst sub-class is the crossing, where I1-I2 hold.
* Prime-range splitting: at the binding class x = 1/2, so g = delta/2 is the cap of every individual amplitude
  g_i (section 14.1). All windows carry the same amplitude and any sub-selection has mean exactly g.

### 2.2 The two Cauchy-Schwarz steps in the other order  [EXACT]

Put the detector's own large value inside the moment instead of using the count twice. For rows detected on the
M2 side at plain length m_d (|S_{m_d}|^2 >= U^{delta m_d}; their count exponent is
R_d = 1 - 2 delta m_d - 2 g (1 - 2 m_d)/(6 kappa)):

  sum_B |S_m|^2 <= U^{-delta m_d - 2 g z} sum_u |S_m S_{m_d} Q_sel|^2 << U^{1 - delta m_d - 2 g z},
  z = (1 - m - m_d)/(6 kappa),   then   sum_B |S_m| <= (#B)^{1/2} (sum_B |S_m|^2)^{1/2}.

The resulting exponent R_d/2 + (1 - delta m_d - 2 g z)/2 minus the Hoelder exponent (3 R_d + 1)/4 - g(1-2m)/(12 kappa)
is identically 0 (I4), for every m, m_d, delta, x, kappa. The exchanged order is the same bound.

### 2.3 Block-by-block mixing with the pointwise bound; the numerator line  [PROVED]

Using (ii) on short blocks and (i) on long blocks inside one approximate functional equation is allowed and gives
N(theta) for every theta in [theta0, delta/2] (Theorem A). The class exponent (14.7) contains
d (N(theta) + theta - z0) - l_y (1/2 + theta), which is affine in theta on [theta0, delta/2]. By I5 its endpoints
are the averaged design at theta0 and the pointwise design (13.17)-(13.18) (U^{R + delta/2}, Y^{-a}). So every
block-mixed choice is a convex combination of the two existing endpoint exponents and is never below the smaller.
The system with this option is the class-by-class mixed system of bypass-78 section 3 and r2-zf-critical-density
section 3, which returns B_flat (MEASURED there; not a certificate). At the tangent geometry the slope of the
critical-class exponent in theta beyond theta0 is h(1 - m*) - l_y = +0.0022 > 0 (h = 0.793948, l_y = 0.459707):
moving further costs.
N is convex in theta (slopes -1/2, then -m* >= -1/2), consistent with the convexity of mean values in the real
part; convexity between any two of the three known points gives nothing below N.

### 2.4 Several detector cutoffs; sub-classes by the size of L on the critical line  [PROVED for the system]

* The detector (13.14) holds for every t in [1, 3/2]. A configuration must supply a pair for each t. For
  t < t_kappa take the crossing pair (count R_short(t) > R_kappa), for t > t_kappa the long pair r = t
  (count R_long(t) > R_kappa). The M2 pair constraints are affine in m1 + m2 and are implied by the single
  constraint at the largest plain length. So R_kappa is attained with all cutoffs imposed at once.
* Sub-class by lambda = exponent of sup_{|v| <= T1} |L(1/2 + iv, psi_u)|. Mellin inversion gives a detected plain
  length m <= 2 lambda/delta, so for small lambda the row is detected on the inverse side and its count is at most
  R_lambda = 1 - delta + (5/6 - delta)(2 lambda/delta) (take t = 1 + 2 lambda/delta). The numerator exponent of the
  sub-class at theta = 0 is min(R_kappa, R_lambda, 1 - 4 lambda) + lambda. Its maximum over lambda is at
  lambda = (1 - R_kappa)/4, value K: at the critical class R_lambda < R_kappa only for lambda < 0.0384, while
  (1 - R_kappa)/4 = 0.1024 <= delta/4 = 0.1173. Rows with a small numerator are few (density-hypothesis count
  1 - delta at lambda = 0), but the worst case sits at lambda = (1-R)/4, where neither refinement binds.

## 3. The saturating configuration against the remaining inputs  [PROVED for the system]

sigma_m = min(delta m/2, tau_m), rho = R_kappa, amplitudes g, inverse witness mu_r = delta r/2 at r = r* (and at
the long pairs of 2.4), smaller elsewhere.
* Detector: sigma_{m*} = delta m*/2 exactly (I2), so the plain large value of (13.14) holds at the crossing pair.
* M1: R_kappa + delta r* + 2 g (1 - r*)/2 = 1 (I1). M1 has no S-factor.
* Block/line duality: sigma is concave in m (minimum of two affine functions). A concave sigma is the Legendre
  transform of a convex line profile Lambda(theta') = max_m (sigma_m - theta' m), so the Mellin relations
  sigma_m <= m theta' + Lambda(theta') and the approximate functional equation Lambda(theta') <= max_m
  (sigma_m - theta' m) hold together, with Lambda(delta/2) = 0 (Corollary 13.8(2)) and
  Lambda(0) = (1 - R)/4 <= delta/4 (convexity bound in the bin, from (14.4)).
* Count from the fourth moment at the central length: rho + 4 sigma_{1/2} = 1.

What the configuration says in plain terms: U^R rows, each with |L(1/2, chi_u)| of size U^{(1-R)/4} (critical
class: U^{0.1024} on U^{0.5903} rows, family size U), blocks of length m in [m*, 1/2] of size
U^{delta m*/2 + theta0 (m - m*)}, and prime sums at the cap. The whole fourth moment of the family sits on the
class. Nothing in the source excludes it. It is a configuration of the estimate system; its existence for actual
L-functions is not asserted (under GRH the class is empty).

## 4. Theorem B: range obstruction for new moment inputs

**Theorem B [PROVED for the system; EXACT check].** Add to C1-C3 any family of hypothetical inputs of the form
rho + 2 sum_i sigma_{n_i} + 2 q mu_r + 2 g z <= 1, valid when (sum_i n_i) + q r + 6 kappa z <= 1 (products of any
number of plain factors, powers of the inverse witness and prime sums, of total length at most 1 at the present
prime capacity: the strength of a perfect large sieve, which is false for general coefficients). If R = R_kappa
and m* > 1/3, then N(theta) is unchanged for 0 <= theta <= theta0.

Proof. Modify the flat configuration to sigma_m = 0 for m < m*, sigma_m = tau_m for m >= m*, mu_r as in section 3.
A product of total length <= 1 contains at most two plain factors of length >= m* > 1/3, and if it contains the
inverse witness at r* >= (6 - c)/(10 - 2c) > 3/5 (Liu II (2.9), c = 2/(3 kappa)) it contains no plain factor of length >= m* at all
(r* + m* = t_kappa > 1). So every new constraint reduces to an instance of C1 or of M1 with a shorter prime
length. The objective at blocks m >= m* is unchanged. QED.

Check (`range_obstruction.py`): all pairs and triples on the grid m = j/60, exact slack <= 0; HiGHS with the ideal
triple moments added returns the source value at theta = 0 and theta0 at four classes.

Consequence. An input lowers K only if it bounds the central block (m = 1/2, where the prime capacity
(1 - 2m)/(6 kappa) is zero) on the class beyond "fourth moment <= U". That means a product of total length
greater than 1 containing S_{1/2}^2: either a Lindeloef-on-average moment of order above 4, or the fourth moment at
length 1/2 with a class-detecting factor (amplified or class-restricted fourth moment). The z = 0 clause of
Lemma 18.1 is the only statement of that kind in the sources, and it is the one already used.

## 5. What would change the value  [MODEL; float LP of bypass-78, optimistic conventions, gates not imposed]

`price_moments.py`, `price_lindelof.py`. First-order slope dB/dK = 0.1831 (uniform change of K), consistent with
the count slope -0.138 = (3/4)(0.1831).

| hypothetical input | K | abscissa |
|---|---|---|
| none (validation) | (3R+1)/4 | 0.8748865 |
| fourth moment restricted to the class saves U^{-omega}, omega = 0.01 | (3R+1-omega)/4 | 0.8744278 |
| omega = 0.025 (same LP row as a count saving 1/120) | | 0.8737351 |
| omega = 0.05 | | 0.8725663 |
| omega = 0.1 | | 0.8701747 |
| omega = 0.2 | | 0.8666666 (13/15) |
| sixth moment, all lengths, << U^{1+eps} | (5R+1)/6 | 0.8692277 (0.8692672 with shift capacity 2/3) |
| eighth moment | (7R+1)/8 | 0.8674539 (0.8674644 with capacity 1/2) |
| twelfth moment and above | <= (11R+1)/12 | 0.8666666 (13/15) |
| Lindeloef on the class, literal (theta = 0, K = R) | R | 0.8666666 (13/15) |

Reading correction: bypass-78's row "numerator: Lindeloef on the class (K = R)" keeps the factor U^{-theta/2} of
the averaged bound, i.e. it assumes sum_B |L(1/2+theta)| << U^{R - theta/2}, which is below Lindeloef. The literal
reading (third column, last row) reaches 13/15 as well, so the price is unchanged.

Full removal of the loss needs omega = 1 - R = 0.41 at the critical class; the low-side floor 13/15 is reached
already at omega = 0.2. None of these inputs is available: the source's M2 "cannot follow from bounds for
arbitrary coefficients" and is a fourth moment; no sixth moment or amplified fourth moment at the central length
exists for this family. OPEN.

## 6. Lemma G (by-product): the block bin bound and gate (14.15)  [SKETCH, PROVED-rel Corollary 13.8(2)]

For a row in a bin (i, a), a smooth dyadic profile W and |t| <= (3i+1) T1:
S_m(u; W, t) = (1/2 pi i) int L^S(1/2 + it + s, psi) W-hat(s) U^{m s} ds (+ bounded S-factors). Shift to
Re s = a + 6e - 1/2. On |Im s| <= U^{eps_2} (eps_2 small against tau, T1 = Z^tau) Corollary 13.8(2) gives
|L^S| << U^{eps_1}; beyond, W-hat decays faster than any power and the convexity bound is a fixed power of U. Hence
|S_m| << U^{m(delta/2 + 6e) + eps}. The dual block has the conjugate character, which is in the same buffered
family.
Consequence: in Proposition 14.3, case (2), the short blocks m <= m0 = 1/2 - 3 kappa L can be bounded by this
instead of ideal counting U^{m/2}; the condition (14.15) R <= (6 kappa - 2g) L becomes

  R <= 1 - delta + (6 kappa delta - 2g) L,

which is implied by (14.15) whenever L <= 1/(6 kappa). In `numerator_lp.log` the class delta = 1/8, x = 1/2,
kappa = 13/18, L = 0.2105 fails (14.15) and passes the relaxed gate, with primal = dual. The gate does not bind at
B_flat (r2-zf-critical-density section 4: only E binds at tau = 0), so no abscissa changes. The sketch omits the
bookkeeping of the height allowance (the source keeps a margin T1 between detector twists (3i+1)T1 and the box
(3i+2)T1) and of rowwise conductors.

## 7. Controls

No statement about zeros is made, so there is nothing that must fail for Davenport-Heilbronn, for the backward heat
family or for the sign twist. For the record, in the step analysed:
* Euler product: C1 with z > 0 uses |Q|^2 << Z^{kappa z} (manuscript (18.12)), an explicit-formula bound for prime
  sums of a family closed under the twists, with the family zero-free hypothesis beta_* <= (1 + kappa)/2; the class
  itself exists only through the inverse witness (Moebius coefficients). A linear combination of L-functions has
  neither.
* C1 at z = 0, C2 given the bin, C3 given the count, and the whole LP are Euler-blind. That matches the result: the
  LP cannot produce a gain, and section 4 says a gain needs a new arithmetic input at the central length.
* Sign twist: a completely multiplicative unimodular twist keeps C1-C3 formally but removes the functional
  equation, which the z = 0 clause (unrestricted lengths, by reflection) and the approximate functional equation
  use.

## 8. Verdict

Precise obstruction, relative to the unrefereed sources.
* The loss K - R = (1 - R)/4 (0.1024 at the critical class) is not a loss of the Hoelder step relative to its
  inputs: (3R+1)/4 - theta/2 is the exact LP optimum, attained at every block length in [m*, 1/2], by a
  configuration that also satisfies the bin bound, the detector at all cutoffs, M1 and the block/line duality.
* Splitting classes or the prime range, weights, exchanged Cauchy-Schwarz, block-wise mixing and extra detector
  cutoffs give exactly the same exponent (identities I3-I5, sections 2.1-2.4).
* No moment of large-sieve range changes it (Theorem B). The missing input is a statement at the central length
  m = 1/2 on the class: a class-restricted or amplified fourth moment, or a moment of order above 4. Prices:
  section 5.
* By-product: gate (14.15) can be weakened (Lemma G, sketch); no abscissa moves.

## 9. Three weakest steps

1. **Scope of "the inputs".** Theorems A and B are optimality statements for the system C1-C3 (plus M1 and the
   detector). The list of what the source knows about S_m on a class was read from an unrefereed 170-page text.
   An argument that does not pass through absolute values of dyadic blocks of the approximate functional equation
   (cancellation between blocks, or between numerator and denominator across rows) is outside the system. The
   identification of the detector's plain polynomial with a block of the approximate functional equation (different
   smooth profile, twist nu in N) is made at the level of the system, where M2 is uniform in profiles.
2. **Full-system conclusion.** "The mixed system returns B_flat" rests on the float LPs of bypass-78 section 3 and
   r2-zf-critical-density section 3 (not certificates). Section 2.3 proves only that block-mixing adds no option
   beyond those two endpoints. The prices of section 5 are float LPs on a 97 x 33 class grid without the gates of
   Remark 14.1, so they are optimistic (r2-zf-critical-density section 4 shows gated values stop near 0.8734).
3. **Lemma G** is a sketch (height allowance, rowwise conductors, S-factors not tracked), and Theorem A assumes the
   relaxed gate when L < 1/(6 kappa); with the source's ideal-counting bound instead of C2 the same statement holds
   under (14.15) for theta <= theta0 only. Theorem A is stated for 1 - delta <= R <= 1 - g/(3 kappa); classes
   outside (m_x < 0) were not treated analytically (the grid cases all satisfy it).

## 10. Files (this directory)

* `identities.py`, `identities.log`: I1-I6, sympy, exact.
* `numerator_lp.py`, `numerator_lp.log`: Theorem A, exact rational primal/dual on 120 cases + HiGHS cross-check.
* `range_obstruction.py`, `range_obstruction.log`: Theorem B check.
* `price_moments.py`, `price_lindelof.py` (+ `.log`): section 5; import `../bypass-78/scalar_system.py`.
* Run: `.venv-arb/bin/python <script>` from this directory
  (numpy 2.5.3, scipy 1.18.1, sympy 1.14.0); each under 1 minute, single process, under 1 GB.
