# r2-zf-critical-density: hybrid target-row mean value and zero density at the critical class of Liu 2610.26835v2

Internal working note, 2026-11-16. Unrefereed. Nothing committed or pushed. Writes only in this directory.
Everything is relative to unrefereed inputs: Liu arXiv:2610.26835v2 (text copy `../bypass-78/dl/2610.26835.txt`,
line numbers below refer to it), in particular its Lemma 14.10, moments M1/M2 ((13.2), (13.3)) and count (13.16).
No new zero-free region. RH open. NO QED.

**Verdict: precise obstruction. No count saving tau > 0 is obtained. B_flat = 0.874886647 stands as the infimum of
the composed method.**

1. Hybrid target-row mean value: saves nothing for any single target (Lemma H, PROVED). What it can give is a
   density statement over targets, which does not move an abscissa.
2. Zero density for the sextic twist family at real part 0.7347, conductor U = Z^{0.794}: every tested method gives
   an exponent above Liu's 0.590332. General sextic large sieve: 0.7653 (best case) / 0.7956 (two-class scheme).
   Perfect-large-sieve Ingham value: 0.6291. Halasz-Montgomery: channel absent (needs real part > 3/4). Bessel form of
   tro6-spectral section 7: not applicable at depth 0.14 below the edge.
3. Unequal lengths and class-by-class numerator mixing: no gain, confirmed by an independent nonconvex minimisation
   (difference from the balanced averaged optimum below 3e-14 on the same grid).
4. No tau > 0, so no new abscissa. As a MODEL only: with the Remark 14.1 gates imposed, a hypothetical uniform count
   saving 1/120 gives 0.873815 (not 0.873735), and the gated value stops at 0.873386 for every tau >= 0.02;
   with the gates taken literally (B > 437/500) it stops at 0.874.

Labels: PROVED (argument written here) / PROVED-rel (relative to the source as stated) / CLASSICAL / MEASURED
(float scripts in this directory) / MODEL (hypothetical input priced, not a bound) / OPEN.

---

## 0. Plan; what is new relative to the atlas, the walls and sibling notes

Read: BRIEF, atlas PR #27 section 10, `zf-hecke-all-fields/RESULT.md` + `REFEREE.md`, `bypass-78/RESULT.md`,
`tro6-spectral/RESULT.md` section 7, `bootstrap/RESULT.md` Lemma 3, Liu II sections 10.4, 12.4, 12.9, 13.1-13.5,
14.1-14.8, 15.1-15.2.

Not repeated: the optimality replay (zf-hecke-all-fields), the price list and LP relaxations (bypass-78), the
t-aspect Halasz-Montgomery lemma (bootstrap Lemma 3). Sibling `r2-zf-gm-inverse-witness` works on the inverse
moment; nothing here touches its angle beyond pricing the exponent e(r).

New here:
* the hybrid target-row variation left OPEN in zf-hecke-all-fields section 4 and its referee report item 4 is
  written down and closed for the single-target use (section 1);
* the count R_kappa is replayed as a detector min-max and three outside density methods are put on the same scale
  (section 2); the family (q-aspect) version of the Halasz-Montgomery threshold is written;
* the two relaxations are re-checked by a method independent of bypass-78's rho-scan LP (section 3);
* the price of a hypothetical count saving is recomputed with the Remark 14.1 gates imposed (section 4).

Walls: no argument for a zero-free region is made, so DH / flow-blindness / verified height are not engaged by a
claim. Section 1 is an instance of MV-CAP (a mean value over targets cannot certify a statement for every target).

## 1. The hybrid target-row mean value

### 1.1 The critical-class remainder with the target sum inside

Source: (13.11) l.5599-5606, Corollary 13.8, (14.18), Proposition 14.3, section 14.6. For one target eta, on the
lines Re s = a + 16e, Re w = 1/2 - theta, Re z = z0 = 17/50, the contribution of a row class B_eta (rows u,
q_u ~ U = Z^d, bin a, amplitude x) to J_eta - f_eta is

  R_eta = Omega * Sum_{u in B_eta} N_u * D_u(eta),
  N_u = q_u^{-z0} L^S(w, chi_u)           (numerator, no eta),
  D_u(eta) = H_{eta,u,Z}(s,w,z) / L^S(s, eta chi-bar_u)   (denominator and local correction),
  Omega = X^{1/2-z0} Z^{a+z0-1} Y^{-1/2-theta} / (c_S A_T).

The source's bound is count x sup in the eta-carrying factor:
|D_u(eta)| << U^eps (Corollary 13.8(2), Lemma 13.10), and
Sum_{u in B} |N_u| << U^{theta + (3R+1)/4 - theta/2} by Hoelder (3/4, 1/4) with the fourth moment (14.16)-(14.17).

Where eta enters (PROVED-rel, reading of the source):
* numerator N_u: not at all;
* denominator: through L^S(s, eta chi-bar_u), used only via the sup bound U^eps on a zero-free buffered box;
* class B_eta: through the detector set X_u = {nu chi(u)^{+-1} : nu in N}, N containing eta (Lemma 13.7);
* direct bound (13.8): "the dependence of the implied constant on eta enters only through the mean-square bounds
  (13.6) and (13.7), whose constants depend on the conductor of eta and on S" (l.5451-5453). In Lemma 13.1 the
  conductor enters as min{1, Q0/min(N1,N2)}, at most linearly. So for conductors Z^{q_c} the mean square (13.6) can
  lose at most Z^{q_c} and (13.8) at most Z^{q_c/2}. This is an upper estimate from the stated dependence, not a
  derivation (OPEN);
* principal term (13.13): no eta in the exponent C(s). H_eta is bounded "uniformly in heights and all unitary
  target phases" (l.5628-5629), but S, the tests, the internal orders, tau_eta, N and the onset Z0 are chosen after
  the target (Remark 3.2 order, l.6094-6101). A target set growing with Z needs all of these uniform. Not available
  in the source (OPEN).

Hybrid form: for a set T of targets, |T| = Z^q, and weights c_eta,

  R_T(c) = Sum_{eta in T} c_eta R_eta = Omega * Sum_u N_u * [ Sum_{eta: u in B_eta} c_eta D_u(eta) ].

### 1.2 Lemma H (phase-blind floor). PROVED

Let (R_eta) be any complex numbers and let Phi be a function of the moduli (|c_eta|) such that
|Sum c_eta R_eta| <= Phi(|c|) for all c with those moduli. Then Phi(|c|) >= Sum |c_eta| |R_eta|. In particular
(Sum_eta |R_eta|^2)^{1/2} >= max_eta |R_eta|, and for the bilinear form R_eta = Sum_u N_u D_u(eta) any inequality

  Sum_{eta in T} |R_eta|^2 <= Lambda * Sum_u |N_u|^2   (Lambda independent of N)

has Lambda >= max_eta Sum_u |D_u(eta)|^2.

Proof. Choose the phases of c_eta so that every term c_eta R_eta is nonnegative. For the last claim take N equal to
the conjugate of the row D(eta_0) with the largest norm. QED.

Every hybrid large sieve, Bessel, duality or Hoelder inequality in the target variable depends on c only through
moduli (or is an l^2 bound in eta). So:

**Corollary H1 (single target).** Normalise c_{eta_0} = 1 for the target of interest. A phase-blind hybrid bound for
R_T(c) is at least |R_{eta_0}|. It improves on count x sup for eta_0 only by an amount by which count x sup
overestimates |R_{eta_0}| itself; the sum over the other Z^q - 1 targets contributes no factor.

**Corollary H2 (at the critical class).** On the buffered box both |L^S| and |1/L^S| are << U^{eps_1}
(Corollary 13.8(2)), so |D_u(eta)| >> U^{-eps} and Lambda >= #B * U^{-2 eps}. The best possible hybrid large sieve
therefore gives

  max_eta |R_eta| <= Omega * (#B)^{1/2} * (Sum_{u in B} |N_u|^2)^{1/2} * U^{eps},

which is the single-target Cauchy-Schwarz bound. With (Sum_B |N_u|^2)^{1/2} <= (#B)^{1/4} (Sum_B |N_u|^4)^{1/4}
it equals (14.17), i.e. U^{(3R+1)/4}. The hybrid sextic large sieve does not beat count x sup at (delta_c, 1/2).
Saving: tau = 0. Price through the scalar system: 0.

### 1.3 What remains of the variation

* Phase-sensitive averaging needs coherent signals. The principal terms f_eta of different targets have poles at
  unrelated zeros, so with c_{eta_0} = 1 the signal is that of eta_0 alone while the triangle inequality on the
  remainder costs |T|. The only family with coherent signals is the vertical shifts eta_0 N^{i t}; averaging over
  those is a change of the Mellin kernel e^{(s-5/6)^2} in s, already free in the single-target argument.
* With l^1-normalised weights and a fixed finite T the Mellin continuation argument (Lemma 14.8) applies to
  Sum c_eta H_eta(s)/L^S(s, eta) and returns the same half-plane for each eta (constants only).
* What an l^2 hybrid bound can prove is a statement for all but few targets: if the vectors D(eta) are
  quasi-orthogonal over T then #{eta in T : |R_eta| >= V} <= Lambda Sum|N_u|^2 / V^2. This is a zero-density
  statement in the target aspect near B_flat. It needs the uniformities listed in 1.1 (OPEN) and it does not lower
  the supremum beta_*(F) (MV-CAP). It was not pursued.

## 2. Zero density for the twist family at real part 0.7347

Family: sextic twists nu chi(u), u sixth-power-free, q_u ~ U = Z^{0.794}, heights |gamma| <= Z^{tau} (so a pure
conductor-aspect problem, family size U, conductor about U). delta = 2a - 1 = 0.469345. Target: a count below
U^{0.590332} for zeros with real part >= a_c = 0.734672, with prime sums at amplitude x = 1/2.

### 2.1 The source's count as a detector min-max (MEASURED replay; PROVED-rel in Liu II Lemma 15.1 at its class)

Detector (Lemma 13.7): for a chosen t in [1, 3/2] a pair (r, m), t - 1/2 <= r <= t, r + m >= t, m <= 1/2, with
|M_r|^2 >= U^{delta r}, |S_m|^2 >= U^{delta m}. Counts:
* M1, r <= 1, prime length (1-r)/2: 1 - delta[x + (1-x) r];
* M1 long, r >= 1: e(r) - delta r, e(r) = (1+5r)/6 (Lemma 10.10, sixth-power amplification);
* M2, two copies, prime length (1-2m)/(6 kappa): 1 - delta[2m + x(1-2m)/(3 kappa)].
`density.py` part A: min over t of max over r of the smaller count reproduces (14.3) at six classes to 2e-5
(grid error). R_c = 0.590332354; x = 0 at the same delta: 0.614784. Bounds: 1 - delta = 0.530655 (density
hypothesis) <= R <= 1 - 2 delta/3 = 0.687103.

Both moments are structure-specific: M1 "cannot follow from bounds for arbitrary coefficients" (l.5037-5038) and M2
at z = 0 is a Lindeloef-on-average fourth moment, "rather than an application of the published cubic large sieve"
(Remark 12.18).

### 2.2 Exponents of the tested methods against 0.590332

| method | exponent at (delta_c, 1/2) | status |
|---|---|---|
| Liu II count (13.16) | 0.590332 | PROVED-rel (unrefereed) |
| general-coefficient sextic large sieve K + D + (KD)^{2/3}, any product polynomial M^i S^j Q^k | >= 1 - delta/2 = 0.765328 | PROVED (2.3) |
| same large sieve in the Ingham/Montgomery two-class scheme with the fourth moment | 0.795641 | MEASURED (grid optimum) |
| two-class scheme with a hypothetical perfect large sieve K + D | 3(1-s)/(2-s) = 0.629072 | CLASSICAL shape, MODEL input |
| hypothetical perfect large sieve at length U, x = 1/2 | 1 - delta = 0.530655 | MODEL; input false for general coefficients (2.3) |
| Halasz-Montgomery in the family aspect | no bound; needs delta > 1/2, i.e. real part > 3/4 | PROVED (2.4) |
| Bessel / quasi-orthogonality form of tro6-spectral section 7 | no bound at this depth | PROVED-rel (2.5) |

No method gives an exponent below 0.590332. tau = 0.

### 2.3 The (KD)^{2/3} term. PROVED

Large sieve for sextic symbols with arbitrary coefficients (Heath-Brown cubic form; Blomer-Goldmakher-Louvel for
n-th order symbols; CLASSICAL, quoted from memory, not re-read):
Sum_{q_u ~ D} |Sum_{q_n ~ K} a_n chi_u(n)|^2 << (KD)^eps (K + D + (KD)^{2/3}) ||a||^2.
Take any product polynomial of total length U^Y built from the detected factors. Each unit of length contributes
at most U^{delta} to the squared lower bound (M_r and S_m exactly delta per unit; primes 2 x delta <= delta per
unit). So its count is at least

  max(1, Y, 2(1+Y)/3) - delta Y >= 1 - delta/2     for delta < 2/3,

with equality at Y = 1/2. By (14.4), R_kappa <= 1 - 2 delta/3 < 1 - delta/2 for every delta > 0. Hence the
general large sieve is never the smallest option at any class and adding it to the detector min-max changes
nothing (`density.py` part B: 0.590349 with and without). QED.

For the count to drop below 0.590 through a large-sieve route one needs 2(1+Y)/3 replaced by max(1, Y) near
Y = 1. For arbitrary coefficients that is false for the cubic family under GRH (Dunn-Radziwill; CLASSICAL, from
memory) and is claimed false for the sextic family (Xu, "A sharp lower bound for the sextic large sieve",
unpublished, cited in Xu-Sang; unverified). For the structured coefficients of M1 and M2 the source already has
no 2/3 term; the binding losses are then e(r) = (1+5r)/6 on 1 <= r <= 1.26 and the prime capacity 6 kappa.

### 2.4 Halasz-Montgomery in the conductor aspect. PROVED

For R detected characters and a polynomial of length K with coefficients b_n n^{-a}:
R <= ||a||^2 (K + R D_0), ||a||^2 ~ K^{-delta}, D_0 = max_{u != u'} |Sum_{n ~ K} chi_u chi-bar_{u'}(n) w(n/K)|.
The product character has conductor up to U^2. For K >= U^{2+eps} the smooth sum is negligible (Lemma 13.1) and
R <= K^{1-delta} >= U^{2(1-delta)} = U^{1.061}, worse than trivial. For K < U^2, D_0 <= K^{1/2} U^{2 mu}
with mu >= 0 the subconvexity exponent per unit of conductor (convexity 1/4), and the inequality gives a bound
only if K^{1/2 - delta} U^{2 mu} < 1. For delta < 1/2 this fails for every K >= 1 and every mu >= 0, Lindeloef
included. delta_c = 0.469 < 1/2. The channel opens at real part 3/4; the critical class sits 0.0153 below it.
This is the family version of bootstrap Lemma 3 ("for sigma <= 3/4 the channel is absent").
Not tested: Jutila-type refinements that average D_0 over pairs (u, u'); they need moments of
L(1/2, chi_u chi-bar_{u'}) over a two-parameter family, which M2 does not cover (OPEN).

### 2.5 Bessel form of tro6-spectral section 7. PROVED-rel

That form counts targets with |B_j| >~ CS * Z^{-delta'}; a zero at depth delta' below the edge forces this only
if the high-side remainder of that target is below Z^{C(beta - delta')}. The source bounds the remainder by
Z^{C(beta) - m_save} with m_save <= r_*/128 <= 1/128000 (Remark 14.1, Proposition 14.6). The row zeros in question
are at depth B_flat - a_c = 0.1402. So the form does not see them. Formally, if it did: count <= Z^{0.2804} with
Z = U^A, below U^{0.590} iff A < 2.105, and it would need row quasi-orthogonality with exponent > 0.2804 and
conductor-uniform onsets. None of the three is available (OPEN; tro6-spectral measured only toy Gram entries
0.003-0.08 with no power law).

### 2.6 Inputs that would lower the count (MODEL, `density.py` part E)

| changed input | R' at (delta_c, 1/2) | tau |
|---|---|---|
| e(r) slope 5/6 -> 4/5 on r >= 1 | 0.588437 | 0.00190 |
| e(r) slope -> 3/4 | 0.585040 | 0.00529 |
| e(r) slope -> 1/2 | 0.543730 | 0.0466 |
| e(r) = 1 on r >= 1 | 0.530655 | 0.0597 (density-hypothesis value) |
| M2 prime capacity 6 kappa -> 3 kappa | 0.586683 | 0.00365 |
| M2 prime capacity -> 2 | 0.585363 | 0.00497 |

These agree in size with bypass-78's rows "amplification exponent alpha = 4/5, 3/4". None is proved.

## 3. Unequal lengths and class-by-class mixing (MEASURED, independent of bypass-78's method)

`relax.py`: F(l_x, l_y, l) = max(low majorant of Liu II section 15.1, max over classes of the smallest allowed
numerator option), options: averaged (14.7) at d = h with theta in {0, g/(6 kappa)}, pointwise (13.18) at d = h.
Global search (differential evolution, 4 seeds, Nelder-Mead polish) over 0 <= l_x <= 0.8, 0 <= l_y <= 1,
0 <= l <= 0.5, class grid 341 x 41, no gates (optimistic, the safe direction for "no gain").

| system | kappa = kappa_flat | kappa = 3/4 |
|---|---|---|
| balanced, averaged only (same-grid reference) | 0.8748866091 | 0.8748869510 |
| unequal lengths, averaged only | ref - 2e-14 | ref - 1e-15 |
| balanced, class-by-class mixing | ref + 3e-14 | ref - 1e-15 |
| unequal lengths + mixing | ref - 2e-14 | ref - 5e-15 |
| unequal lengths, pointwise only (validation, expect B_inf = 0.8749570) | 0.8749568973 | 0.8749570302 |

Every optimum returns M + l = 1 and the balanced tangent geometry (l_x, l_y, l) = (0.37339, 0.45949, 0.16712).
bypass-78's claim (sections 2, 3: no gain) is confirmed, with a smaller residual than its 3e-8. Not a certificate.

## 4. Min-max with the Remark 14.1 gates (MODEL; no tau > 0 was obtained)

`gates.py`: balanced lengths, LP in (b, l) at fixed kappa (E is affine in (b, l)), class grid 709 x 41, outer fixed
point kappa = 2B - 1. Count R_kappa replaced by R_kappa - tau.
(i) optimistic: E <= 0 only. (ii) Remark 14.1 literal: (1), (2), (4), (14.15) at L = l/h, 7497/10000 <= kappa <= 3/4,
B(l) > 437/500. (iii) as (ii) without the two numerical conveniences kappa >= 7497/10000 and B > 437/500
(kappa >= 13/18 kept).

Uniform saving on all classes:

| tau | (i) optimistic | (iii) gates | (ii) literal gates | binding in (iii) |
|---|---|---|---|---|
| 0 | 0.874886641 | 0.874886641 | 0.874886641 | E |
| 1e-4 | 0.874872931 | 0.874872931 | 0.874872931 | E |
| 1e-3 | 0.874749403 | 0.874750162 | 0.874750456 | E and (14.10) line 1 |
| 1/120 | 0.873735365 | 0.873814930 | 0.874000000 | E and (14.10) line 1 |
| 0.01 | 0.873503005 | 0.873616333 | 0.874000000 | E and (14.10) line 1 |
| 0.02 | 0.872094034 | 0.873386040 | 0.874000000 | (14.10) line 1 and l/h < 1/(6 kappa) |
| 0.05 | 0.867709854 | 0.873386040 | 0.874000000 | same |
| 0.0597 | 0.866666667 (13/15) | 0.873386040 | 0.874000000 | same |

Readings:
* slope dB/dtau = -0.1372 (optimistic, tau = 1e-3), matching the refereed -0.138;
* the optimistic 0.873735 for tau = 1/120 becomes 0.873815 with gates (iii) and 0.874 with the literal gates;
* with the gates as written no count saving, however large, gives less than 0.874 (gate B > 437/500, the principal
  region (13.12)), and without that convenience the small-delta endpoint C0 + A_sm/8 < -1/250 together with
  l/h < 1/(6 kappa) stops the system at 0.873386. These gates are sufficient conditions chosen by the source; the
  cap is a property of the written proof, not a lower bound for a rewritten one.

Saving only near the critical class (|delta - 0.4693| < w, x > 0.45), tau = 0.05, optimistic:
w = 0.005: 0.874885351; 0.02: 0.874868584; 0.05: 0.874776739; 0.1: 0.874490250; 0.2 and 0.4: 0.874469006.
A saving confined to a window re-tangents at neighbouring classes at once (gain 1.8e-5 for w = 0.02), and a saving
confined to x > 0.45 stops at 4.2e-4 whatever the delta-window. The first-order figure -0.138 tau is realised only
by a saving that is uniform in (delta, x).

## 5. DH control

No statement about zeros is made here, so nothing new must fail for Davenport-Heilbronn. Lemma H and sections 3-4
are scalar. For the count of section 2 the Euler-product steps are: (a) Lemma 13.7, the detector: coefficient
Sum_{l | n} mu(l) = 0 for 1 < q_n <= D_* uses 1/L as a Dirichlet series with coefficients mu*psi, and the buffered
bounds use the Euler branch of log L anchored at 2 + iv; (b) Lemma 10.10, identity (10.16)
M_u(D) = Sum_{d | rad a} mu(d) nu(d) chi_d(u) q_d^{-1/2} M_{u a^6}(D/q_d), "Euler multiplication"; (c) Lemma 12.7,
|Q|^2 << Z^{kappa z} from log L on a zero-free disk for a family closed under the twists. A linear combination of
two L-functions has none of (a)-(c): there is no inverse witness, so the class "rows with a zero at a" has no
count at all and the system does not start. The general large sieve of 2.3 and the Halasz-Montgomery inequality of
2.4 use no Euler product, which is consistent with their giving nothing here.

## 6. Verdict

Precise obstruction, relative to the unrefereed Lemma 14.10 and moments of Liu II.
* (1) The hybrid target-row mean value is priced: tau = 0 for every single target (Lemma H). The variation left
  open by zf-hecke-all-fields section 4 is closed for the abscissa; a target-aspect density statement remains
  possible and does not move the abscissa.
* (2) No tested density method reaches 0.590332 at real part 0.7347; the nearest outside value is 0.6291 and
  needs a perfect large sieve that is false for general coefficients. The count can move only through the two
  structure-specific inputs: e(r) on 1 <= r <= 1.26 and the M2 prime capacity.
* (3) Unequal lengths and mixing give nothing (confirmed).
* (4) No new abscissa. B_flat = 0.874886647 unchanged; 7/8 remains the Lean-checked value for zeta.

## 7. Three weakest steps

1. Section 1.1 is a structural reading of an unrefereed 170-page source: that eta enters the critical-class
   remainder only through D_u(eta) and the class definition was read from (13.11), Corollary 13.8 and section 14.6,
   not re-derived; the q_c/2 conductor cost of (13.8) is an upper estimate from one sentence of the source. Lemma H
   itself is elementary, but it covers phase-blind inequalities only; a hybrid that produces cancellation in
   u between numerator and denominator for one target is a single-target improvement and is outside it.
2. Section 2 tests named methods; it is not a theorem that no density estimate below U^{0.590} exists. The large
   sieve with the (KD)^{2/3} term and its sharpness are quoted from memory (Heath-Brown, BGL, Dunn-Radziwill) and
   from an unpublished citation (Xu); the two-class value 0.7956 is a grid optimum; Jutila-type pair averaging was
   not tested.
3. Sections 3 and 4 are float computations on finite class grids (341 x 41 and 709 x 41) with a stochastic global
   search; no interval certificate. The gated table depends on which sufficient conditions of Remark 14.1 are
   treated as binding (three variants shown); the (14.10) line-1 gate was imposed by successive linearisation.

## 8. Files and reproduction

`PY=.venv-arb/bin/python` (numpy 2.5.3, scipy 1.18.1).
* `density.py` -> `density.log` (section 2; about 1 min)
* `relax.py` -> `relax.log` (section 3; 1 min)
* `gates.py` -> `gates.log` (section 4; 35 s)
Run as `$PY -I <script>` from this directory. Single process, under 1 GB.
