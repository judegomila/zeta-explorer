/**
 * @module imp-35167-g-min-non-collision-certificate-scope
 *
 * imp-35167 (proof, frontier-direction, SCOPING ONLY): imp-35127 named I2 -- a CERTIFIED a-priori
 * minimum-gap lower bound g_min(t) > 0 along the WHOLE backward Dyson trajectory up to the collision
 * front -- the HARDEST / binding singular-flow ingredient of a certified RK4/DP5 truncation bound:
 * every I1 elementary-differential derivative constant and the I3 Lipschitz constant is a power of
 * 1/g_min, so an uncertified g_min makes the entire Step-2 error certificate vacuous. THIS module
 * enumerates the concrete analytic machinery M1..M5 that a certified non-collision separation
 * certificate would need, maps each candidate to already-present artifacts vs OPEN pieces, and
 * identifies the binding obstruction. Derives NONE of the bound; couples to G-gronwall (imp-2520) and
 * G-interval-enclosure (imp-362). SCOPING ONLY; NO QED.
 *
 * THE SEPARATION CERTIFICATE OBLIGATION
 * -------------------------------------
 * Particles x_1(s) < ... < x_N(s) evolve under the ATTRACTIVE rational Calogero-Moser / Dyson flow in
 * de Bruijn-Newman time units,
 *
 *     dx_k/ds  =  -2 sum_{j != k} 1 / (x_k - x_j),      s = -t >= 0,
 *
 * toward the first-collision time t_c(N). A certified g_min(t) > 0 must lower-bound the GLOBAL min gap
 * min_p r_p(s) along the ENTIRE trajectory s in [0, t_c) (not a single-N witness, not a value read off
 * a finite integration), uniformly enough in N that the I1/I3 constants 1/g_min^m stay finite.
 *
 * WHAT IS ALREADY PRESENT: THE imp-2563 MIN-GAP SANDWICH
 * -----------------------------------------------------
 * imp-2563-min-gap-sandwich-theorem.js supplies the EXACT gap ODE and a Gronwall lower branch. For an
 * adjacent pair a = x_lo < b = x_hi with gap r = b - a and background field
 * B(s) = sum_{j != lo, hi} 1 / ((b - x_j)(a - x_j)), the drift gives EXACTLY
 *
 *     dr/ds = -4/r + 2 r B(s),      and with u = r^2:   du/ds = -8 + 4 B(s) u.      (U)
 *
 * Setting beta = sup_{p, s < t_c} |B_p(s)| and g = g_min(0), assuming beta finite with beta g^2 < 2,
 * the GLOBAL squared min gap U(s) = min_p r_p(s)^2 satisfies the lower-Dini inequality
 * D_- U >= -8 - 4 beta U, hence by comparison with m' = -8 - 4 beta m, m(0) = g^2,
 *
 *     U(s) >= m(s) = (g^2 + 2/beta) e^{-4 beta s} - 2/beta > 0   for all s < T_-(g, beta),      (M)
 *     T_-(g, beta) = (1 / (4 beta)) log( 1 + beta g^2 / 2 ).                                     (H)
 *
 * So (M) IS a certified g_min(s) = sqrt(m(s)) > 0 -- BUT only on the sub-horizon window s < T_-, and
 * only CONDITIONAL on an N-uniform beta. That is the whole content of the gap: the skeleton exists;
 * two inputs are missing, and one is structural.
 *
 * THE FIVE MACHINERY PIECES M1..M5 (present vs OPEN)
 * -------------------------------------------------
 *   M1 EXACT GAP ODE + GRONWALL LOWER COMPARISON.  The linearised gap ODE (U) and the differential-
 *      inequality lower branch (M) that turns a sup-bound beta into a strictly positive g_min(s) on
 *      s < T_-. PRESENT and UNCONDITIONAL as ALGEBRA (imp-2563 Theorem B lower branch); it is the
 *      certificate SKELETON, waiting only for its two inputs (M2, M3) and a horizon extension (M5).
 *   M2 N-UNIFORM BACKGROUND-FIELD SUP beta.  A CERTIFIED, N-uniform a-priori bound
 *      beta >= sup_{p, s < t_c} |B_p(s)| on the net field of the other N-2 particles on each pair.
 *      imp-2563 ASSUMES beta finite (with beta g^2 < 2); it does not certify N-uniformity. B is a sum
 *      of ~N reciprocal-product terms whose sign can partially cancel but whose magnitude near the
 *      front is itself controlled by the same collapsing gaps -- so M2 is self-referential with the
 *      very g_min it feeds. OPEN -- the first binding piece.
 *   M3 CERTIFIED INITIAL MIN-GAP g_min(0) WITH ~O(1/N) SCALING.  A certified analytic lower bound on
 *      the smallest gap of the first N Riemann zero ordinates (the initial condition g). Empirically
 *      g_min(0) ~ O(1/N) (mean spacing 2 pi / log T), but a certified lower bound (no exceptionally
 *      close pair) is a separate ingredient; the imp-33209 fifth-pair floor MEASURES an N-independent
 *      few-ULP floor on a lambda-normalised scale, not an analytic a-priori bound. PARTIAL / data-level.
 *   M4 SG1 LOCAL-VIRIAL / PAIR-GAP MONOTONICITY.  The local virial-shock structure (imp-2520 Lemma B,
 *      the |dz^2 M| <= (2/y^2) Im M characteristic bound and its exp(-2S/y_star^2) propagation) that
 *      would give a MONOTONICITY handle on the gap independent of the sup-bound route. PRESENT as a
 *      strip lemma but honestly Gronwall-VACUOUS at the microscopic front strip y_N ~ sqrt(2 pi / N)
 *      -- COUPLED to the open G-gronwall obligation; non-vacuous only on mesoscopic strips y_star >>
 *      sqrt(2 S), which do not reach the true nearest-pair front.
 *   M5 HORIZON-REACHES-FRONT (whole-trajectory extension).  The certified non-collision window (H) is
 *      T_-(g, beta) ~ g^2 / 8 as g -> 0, so with g ~ 1/N it SHRINKS like O(1/N^2), while the collision
 *      front t_c(N) stays O(1) (bounded away from 0, and only weakly N-dependent). The lower branch (M)
 *      therefore certifies separation on an s-window that does NOT extend to the front: a
 *      whole-trajectory certificate must BRIDGE the sub-horizon window to t_c, e.g. by re-seeding the
 *      comparison from a certified interior gap or by a self-consistent beta(U) feedback. OPEN --
 *      the structural binding obstruction; it is why "single-scale witness" != "N-uniform certificate".
 *
 * THE BINDING OBSTRUCTION (M2 fed into M5)
 * ----------------------------------------
 * Even GRANTING a finite N-uniform beta (M2), the Gronwall lower branch certifies non-collision only
 * for s < T_- ~ g^2 / 8 ~ O(1/N^2), a window that collapses far below the O(1) front. So the honest
 * binding obstruction is the HORIZON/FRONT MISMATCH (M5): the present machinery is LOCAL-in-time, not
 * whole-trajectory. The sub-front-horizon reading is a witness, not a certificate -- exactly the
 * distinction imp-35127 drew for the empirical two-method gap (I4) and imp-35129 drew for the
 * single-scale interval-RK4 witness. Closing I2 needs M2 (certified beta) AND a bridging argument (M5)
 * that re-propagates the lower bound across the shrinking horizons up to the front; M1 is ready, M3 is
 * data-level, M4 is vacuous exactly where the front lives.
 *
 * THE NUMERICAL ILLUSTRATIONS (scoping evidence, NOT a bound)
 * ----------------------------------------------------------
 *   (S1) LOWER BRANCH IS A CERTIFICATE ON ITS WINDOW.  With g = 1e-2, beta = 1, the comparison
 *        m(s) = (g^2 + 2/beta) e^{-4 beta s} - 2/beta is verified STRICTLY POSITIVE for every s < T_-
 *        and to hit 0 exactly at s = T_- (H) -- confirming (M) is a genuine positive g_min on s < T_-.
 *   (S2) THE HORIZON COLLAPSES LIKE g^2/8 ~ O(1/N^2) (motivates M5).  Over a ladder g = 1/N,
 *        N = 10..1e5 at fixed beta = 1, the certified horizon T_-(g, beta) tracks g^2/8 (ratio -> 1 as
 *        g -> 0) and the horizon/front ratio T_- / t_front (t_front = 1, an O(1) proxy) -> 0 like
 *        1/(8 N^2) -- so the window does not reach the front: a local witness, not a whole-trajectory
 *        certificate. (Proxy scaling, NOT the physical t_c(N).)
 *
 * SCOPING ONLY. Enumerates the machinery M1..M5 for a certified non-collision g_min(t) > 0 and maps
 * present (M1 skeleton; M4 strip lemma) vs OPEN (M2 N-uniform beta; M5 horizon-to-front bridge) vs
 * data-level (M3 initial gap). Binding obstruction = the horizon/front mismatch M5, fed by the
 * uncertified N-uniform beta M2. Derives NONE of the bound; the imp-2563 sandwich is UNTOUCHED and
 * remains a valid CONDITIONAL bracket; couples to G-gronwall (imp-2520) and G-interval-enclosure
 * (imp-362); changes no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486
 * UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35127-g-step-error-certified-bound-scope (I2 named this the hardest ingredient; parent)
 * @see imp-2563-min-gap-sandwich-theorem (the exact gap ODE + Gronwall lower branch; M1 skeleton)
 * @see backward-flow-stability-gronwall.js (imp-2520; SG1 local virial, M4, Gronwall-vacuous at front)
 * @see imp-362 (interval RK4 witness / pole reduction; G-interval-enclosure, couples to M5)
 * @see imp-35129 (single-scale interval-RK4 witness != N-uniform certificate; same witness/certificate gap)
 */

// ---------------------------------------------------------------------------
// imp-2563 min-gap sandwich lower branch (used AS-IS; derives nothing new):
//   m(s)  = (g^2 + 2/beta) e^{-4 beta s} - 2/beta           (squared-gap lower comparison)
//   T_-   = (1 / (4 beta)) log( 1 + beta g^2 / 2 )          (certified non-collision horizon)
// ---------------------------------------------------------------------------
function mLower(s, g, beta) {
  return (g * g + 2 / beta) * Math.exp(-4 * beta * s) - 2 / beta;
}
function horizonTminus(g, beta) {
  return (1 / (4 * beta)) * Math.log(1 + (beta * g * g) / 2);
}

// (S1) The lower branch is a genuine certificate on its window: m(s) > 0 for s < T_-, m(T_-) = 0.
const S1_G = 1e-2;
const S1_BETA = 1;
const S1_Tminus = horizonTminus(S1_G, S1_BETA);
const S1_SAMPLES = [0, 0.2, 0.4, 0.6, 0.8, 0.95, 0.99].map((frac) => {
  const s = frac * S1_Tminus;
  return { frac, s: +s.toExponential(4), m: +mLower(s, S1_G, S1_BETA).toExponential(4) };
});
const S1_mAtHorizon = mLower(S1_Tminus, S1_G, S1_BETA); // ~0 by construction
const S1_allPositiveBeforeHorizon = S1_SAMPLES.every((r) => r.m > 0);

// (S2) The certified horizon collapses like g^2/8 ~ O(1/N^2); horizon/front ratio -> 0.
const S2_BETA = 1;
const S2_FRONT = 1; // an O(1) collision-front proxy (NOT the physical t_c(N))
const S2_LADDER = [10, 100, 1e3, 1e4, 1e5].map((N) => {
  const g = 1 / N;
  const T = horizonTminus(g, S2_BETA);
  const gapEighth = (g * g) / 8; // leading small-g asymptotic of T_-
  return {
    N,
    g: +g.toExponential(3),
    Tminus: +T.toExponential(4),
    ratioToGapEighth: +(T / gapEighth).toFixed(6), // -> 1 as g -> 0
    horizonOverFront: +(T / S2_FRONT).toExponential(4), // -> 0 like 1/(8 N^2)
  };
});
// horizon/front ratio shrinks by ~1e2 per decade of N (O(1/N^2)); check the top-two rungs.
const S2_ratioTop = S2_LADDER[S2_LADDER.length - 1].horizonOverFront;
const S2_ratioPrev = S2_LADDER[S2_LADDER.length - 2].horizonOverFront;
const S2_perDecadeShrink = S2_ratioPrev / S2_ratioTop; // ~100 (two powers of 10)

const MACHINERY = [
  {
    id: 'M1',
    name: 'exact-gap-ode-gronwall-lower-comparison',
    statement:
      'The linearised gap ODE du/ds = -8 + 4 B(s) u and its lower-Dini branch U(s) >= m(s) = ' +
      '(g^2 + 2/beta) e^{-4 beta s} - 2/beta > 0 for s < T_-, turning a sup-bound beta into a strictly ' +
      'positive g_min(s) = sqrt(m(s)). The certificate SKELETON.',
    status: 'PRESENT -- unconditional algebra (imp-2563 Theorem B lower branch)',
  },
  {
    id: 'M2',
    name: 'n-uniform-background-field-sup-beta',
    statement:
      'A CERTIFIED N-uniform bound beta >= sup_{p, s < t_c} |B_p(s)|, B_p = sum_{j != lo,hi} ' +
      '1/((b - x_j)(a - x_j)). imp-2563 ASSUMES beta finite (beta g^2 < 2) but does not certify ' +
      'N-uniformity; B is self-referential with the very g_min it feeds near the front.',
    status: 'OPEN -- first binding piece (uncertified N-uniform sup)',
  },
  {
    id: 'M3',
    name: 'certified-initial-min-gap-scaling',
    statement:
      'A certified analytic lower bound on g_min(0), the smallest gap of the first N zero ordinates, ' +
      'with the empirical ~O(1/N) scaling. imp-33209 fifth-pair floor MEASURES an N-independent ' +
      'few-ULP floor on a lambda-normalised scale, not an a-priori no-close-pair bound.',
    status: 'PARTIAL -- data-level, not a certified a-priori bound',
  },
  {
    id: 'M4',
    name: 'sg1-local-virial-pair-gap-monotonicity',
    statement:
      'The SG1 local virial-shock strip lemma (imp-2520 Lemma B: |dz^2 M| <= (2/y^2) Im M and its ' +
      'exp(-2S/y_star^2) propagation) as a monotonicity handle independent of the sup route. ' +
      'Honestly Gronwall-VACUOUS at the microscopic front strip y_N ~ sqrt(2 pi / N).',
    status: 'PRESENT-but-VACUOUS-at-front -- COUPLED to G-gronwall (imp-2520)',
  },
  {
    id: 'M5',
    name: 'horizon-reaches-front-whole-trajectory-bridge',
    statement:
      'The certified window T_-(g, beta) ~ g^2/8 ~ O(1/N^2) SHRINKS below the O(1) front t_c(N); a ' +
      'whole-trajectory certificate must BRIDGE the sub-horizon window to the front (re-seed the ' +
      'comparison from a certified interior gap or a self-consistent beta(U) feedback).',
    status: 'OPEN -- structural binding obstruction (local-in-time, not whole-trajectory)',
  },
];

export const IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE = {
  id: 'imp-35167',
  proofSection: 'S-frontier',
  question:
    'Scope the imp-35127 I2 ingredient: what analytic machinery a CERTIFIED a-priori non-collision ' +
    'lower bound g_min(t) > 0 along the WHOLE backward Dyson trajectory up to the collision front ' +
    'would need, mapping each candidate (exact gap ODE / Gronwall lower branch, N-uniform ' +
    'background-field sup, certified initial gap, SG1 local virial, horizon-to-front bridge) to ' +
    'already-present artifacts vs OPEN pieces, and identifying the binding obstruction. Scoping only; ' +
    'enumerates M1..M5; derives NONE of the bound; changes no bound; C_mb GUE-conditional per imp-486; NO QED.',
  whyHardest:
    'Every I1 elementary-differential derivative constant and the I3 Lipschitz constant is a power of ' +
    '1/g_min (the m-th Dyson-field derivative is sum 1/(x_k - x_j)^{m+1}), so an uncertified g_min ' +
    'makes the entire Step-2 RK4/DP5 truncation certificate vacuous -- imp-35127 named I2 the binding ' +
    'singular-flow ingredient with no textbook analogue.',
  presentSkeleton:
    'imp-2563 supplies the EXACT gap ODE du/ds = -8 + 4 B(s) u and a Gronwall lower branch U(s) >= ' +
    'm(s) = (g^2 + 2/beta) e^{-4 beta s} - 2/beta > 0 for s < T_- = (1/(4 beta)) log(1 + beta g^2/2). ' +
    'This IS a positive g_min on its window -- but only CONDITIONAL on an N-uniform beta and only on ' +
    'the sub-horizon window s < T_-.',
  machinery: MACHINERY,
  presentPieces: ['M1'], // unconditional certificate skeleton (imp-2563 lower branch)
  partialPieces: ['M3', 'M4'], // M3 data-level initial gap; M4 present strip lemma but vacuous at front
  openPieces: ['M2', 'M5'], // N-uniform beta; horizon-to-front whole-trajectory bridge
  bindingObstruction: 'M5', // horizon/front mismatch: local-in-time window, not whole-trajectory
  bindingObstructionFedBy: 'M2', // even a certified beta only extends the shrinking O(1/N^2) window
  couplings: {
    M4_to_G_gronwall: 'M4 SG1 virial is the imp-2520 strip lemma, Gronwall-vacuous at the front strip.',
    M5_to_G_interval_enclosure: 'M5 bridging re-uses the imp-362 pole reduction as G-interval-enclosure.',
  },
  s1_lowerBranchIsCertificateOnWindow: {
    g: S1_G,
    beta: S1_BETA,
    horizonTminus: +S1_Tminus.toExponential(4),
    samples: S1_SAMPLES, // m(s) > 0 for every s < T_-
    mAtHorizon: +S1_mAtHorizon.toExponential(3), // ~0 by construction (T_- solves m = 0)
    allPositiveBeforeHorizon: S1_allPositiveBeforeHorizon,
  },
  s2_horizonCollapsesLikeGapSquared: {
    beta: S2_BETA,
    frontProxy: S2_FRONT, // O(1) collision-front proxy, NOT the physical t_c(N)
    ladder: S2_LADDER, // ratioToGapEighth -> 1, horizonOverFront -> 0 like 1/(8 N^2)
    perDecadeHorizonShrink: +S2_perDecadeShrink.toFixed(4), // ~100 (O(1/N^2))
  },
  isRigorous: false,
  verdict:
    'SCOPING (frontier-direction, NOT rigorous). A CERTIFIED non-collision g_min(t) > 0 along the whole ' +
    'backward Dyson trajectory reduces to FIVE machinery pieces: M1 (the exact gap ODE ' +
    'du/ds = -8 + 4 B(s) u and its Gronwall lower branch m(s) = (g^2 + 2/beta) e^{-4 beta s} - 2/beta ' +
    '-- PRESENT as unconditional algebra, imp-2563 Theorem B, the certificate skeleton), M2 (a certified ' +
    'N-uniform background-field sup beta >= sup |B_p| -- OPEN, imp-2563 assumes it finite but does not ' +
    'certify N-uniformity, and B is self-referential with the g_min it feeds), M3 (a certified initial ' +
    'min-gap g_min(0) with ~O(1/N) scaling -- PARTIAL / data-level, imp-33209 measures a lambda-scale ' +
    'floor not an a-priori no-close-pair bound), M4 (the SG1 local-virial strip lemma imp-2520 -- ' +
    'PRESENT but honestly Gronwall-VACUOUS at the microscopic front strip y_N ~ sqrt(2 pi / N), COUPLED ' +
    'to G-gronwall), and M5 (a whole-trajectory bridge extending the certified window to the front -- ' +
    'OPEN, the structural binding obstruction). The illustrations confirm the crux: (S1) the lower ' +
    'branch m(s) is strictly positive for every s < T_- and hits 0 exactly at the horizon, so it IS a ' +
    'genuine positive g_min ON ITS WINDOW; (S2) but that window T_-(g, beta) ~ g^2/8 collapses like ' +
    'O(1/N^2) (horizon/front ratio -> 0, ~100x per decade of N) while the front stays O(1) -- so the ' +
    'present machinery is LOCAL-in-time, a witness not a whole-trajectory certificate, exactly the ' +
    'distinction imp-35127 drew for the empirical two-method gap (I4) and imp-35129 for the single-scale ' +
    'interval-RK4 witness. BINDING OBSTRUCTION: the horizon/front mismatch M5, fed by the uncertified ' +
    'N-uniform beta M2; M1 is ready, M3 is data-level, M4 is vacuous exactly where the front lives. ' +
    'SCOPING ONLY: derives NONE of the bound; the imp-2563 sandwich is UNTOUCHED and remains a valid ' +
    'CONDITIONAL bracket; couples to G-gronwall (imp-2520) and G-interval-enclosure (imp-362); changes ' +
    'no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35127 (I2 named hardest ingredient); imp-2563 (min-gap sandwich, M1 skeleton, CONDITIONAL ' +
    'bracket); imp-2520 (SG1 local virial, M4, Gronwall-vacuous at front); imp-362 (pole reduction, ' +
    'G-interval-enclosure, M5); imp-33209 (fifth-pair floor, M3 data-level); imp-486 (C_mb GUE-conditional).',
};

export const IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE_ASSERTIONS = [
  {
    // (S1) The Gronwall lower branch is strictly positive on its whole sub-horizon window.
    id: 'imp35167-lower-branch-positive-before-horizon',
    description: 'the imp-2563 lower branch m(s) is strictly positive for every sampled s < T_- (a positive g_min on its window)',
    holds: () => S1_allPositiveBeforeHorizon === true,
  },
  {
    // (S1) The horizon T_- solves m = 0 exactly (m(T_-) ~ 0), so the window is tight.
    id: 'imp35167-horizon-solves-m-zero',
    description: 'm(T_-) = 0 (the certified non-collision horizon is exactly where the lower branch reaches 0)',
    holds: () => Math.abs(S1_mAtHorizon) < 1e-12,
  },
  {
    // (S2) The certified horizon tracks the small-g asymptotic g^2/8 at the top rung.
    id: 'imp35167-horizon-tracks-gap-squared-over-eight',
    description: 'T_-(g, beta) / (g^2/8) -> 1 as g -> 0 (the certified window scales like g^2/8)',
    holds: () => Math.abs(S2_LADDER[S2_LADDER.length - 1].ratioToGapEighth - 1) < 1e-3,
  },
  {
    // (S2) The horizon/front ratio collapses ~O(1/N^2): ~100x per decade of N.
    id: 'imp35167-horizon-collapses-order-n-squared',
    description: 'horizon/front ratio shrinks ~100x per decade of N (window is O(1/N^2), does NOT reach the O(1) front)',
    holds: () => S2_perDecadeShrink > 90 && S2_perDecadeShrink < 110,
  },
  {
    // Present vs OPEN mapping: M1 present, M2 and M5 open, binding obstruction M5 fed by M2.
    id: 'imp35167-present-open-mapping-binding-m5',
    description: 'M1 present, M2/M5 OPEN, binding obstruction = M5 fed by M2; M2/M5 statuses marked OPEN',
    holds: () =>
      IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE.presentPieces.includes('M1') &&
      IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE.openPieces.includes('M2') &&
      IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE.openPieces.includes('M5') &&
      IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE.bindingObstruction === 'M5' &&
      IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE.bindingObstructionFedBy === 'M2' &&
      /OPEN/.test(MACHINERY.find((r) => r.id === 'M2').status) &&
      /OPEN/.test(MACHINERY.find((r) => r.id === 'M5').status),
  },
  {
    // Honesty gate: scoping only, no QED, imp-2563 untouched, no refereed bound is changed.
    id: 'imp35167-honesty-gate-no-qed',
    description: 'Scoping only: isRigorous false, NO QED, imp-2563 sandwich untouched, no refereed bound is changed',
    holds: () =>
      IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE.isRigorous === false &&
      /NO QED/.test(IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE.verdict) &&
      /imp-2563 sandwich is UNTOUCHED/.test(IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE.verdict),
  },
];

for (const a of IMP35167_G_MIN_NON_COLLISION_CERTIFICATE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35167-g-min-non-collision-certificate-scope assertion failed: ${a.id}`);
  }
}
