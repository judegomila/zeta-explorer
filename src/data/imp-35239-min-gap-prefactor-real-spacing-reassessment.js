/**
 * @module imp-35239-min-gap-prefactor-real-spacing-reassessment
 *
 * imp-35239 (proof, ASSESSMENT ONLY): reassess the imp-35214 Q2 verdict -- that
 * the min-gap field-Lipschitz surrogate prefactor "carries no factor of N" and is
 * N-UNIFORM (rated PRESENT, data-level) -- in light of imp-35218 R1. imp-35214 Q2
 * rested on imp-35194 F1, which measured the backward-Dyson background field
 * beta N-uniform at matched front-progress (relative spread < 1.5% across
 * N = 50, 100, 200) -- but that measurement used an EQUALLY-SPACED UNIT-SPACING
 * initial condition. imp-35218 R1 re-ran the SAME running-sup measurement from the
 * first N REAL Riemann zero ordinates and found beta is NOT N-uniform there: it
 * GROWS strongly with N (~1.10 -> 1.71 -> 2.69 at min-gap fraction 0.5; ~9.18 ->
 * 15.68 -> 20.28 at fraction 0.05), relative spread ~121-143% versus < 1.5% for
 * unit spacing. This ticket ASSESSES whether the min-gap surrogate route still
 * genuinely BEATS the imp-35196 strip route once real spacings replace unit spacing,
 * or whether the N-uniformity advantage was a fixed-unit-scale artifact. Assessment
 * only; I3 stays OPEN; NO QED.
 *
 * THE QUESTION, SHARPENED
 * -----------------------
 * The imp-35214 min-gap route claimed TWO distinct advantages over the imp-35196
 * strip route, which it conflated under Q2:
 *
 *   (A) STRUCTURAL: the strip Jacobian prefactor L_strip = 2N / y^2 is EXPLICITLY
 *       N-LINEAR (all N poles seen at height y), whereas the min-gap surrogate
 *       L_gap ~ beta / g^2 is dominated by the collapsing ADJACENT pair, so its
 *       prefactor beta is a LOCAL background-field constant with no explicit factor
 *       of N in its FORM. Growth exponent p_strip = 1 exactly.
 *   (B) NUMERIC: imp-35214 Q2 additionally claimed the prefactor VALUE is N-uniform
 *       (does not grow with N at all), citing imp-35194 F1 unit-spacing spread < 1.5%.
 *
 * imp-35218 R1 REFUTES (B) on real ordinates: beta grows with N. The question is
 * whether (A) -- the genuine, spacing-robust advantage -- survives, i.e. whether the
 * real-ordinate prefactor still grows SUB-LINEARLY (p_gap < 1 = beats the strip),
 * or whether it grows as fast as, or faster than, the strip 2N (advantage collapses).
 *
 * WHAT THE REAL-ORDINATE DATA SAYS (imp-35218 R1 literals)
 * -------------------------------------------------------
 * Fitting beta(N) ~ N^p over N = 50, 100, 200 by the log-log endpoint slope
 * p = log(beta_200 / beta_50) / log 4 at each matched front-progress fraction:
 *
 *   frac 0.5 : beta 1.10 -> 1.71 -> 2.69, p = log(2.69 / 1.10) / log 4 ~ 0.645
 *   frac 0.05: beta 9.18 -> 15.68 -> 20.28, p = log(20.28 / 9.18) / log 4 ~ 0.572
 *
 * BOTH exponents sit in (1/2, 2/3) -- strictly SUB-LINEAR (p_gap < 1 = p_strip). So
 * the real-ordinate min-gap prefactor grows STRICTLY SLOWER than the strip 2N. The
 * advantage factor of the min-gap route over the strip route,
 *        L_strip / L_gap ~ (2N) / beta(N) ~ 2 N^{1 - p} ,
 * still GROWS WITHOUT BOUND with N (exponent 1 - p ~ 0.36-0.43 > 0), just slower than
 * the exact factor 2N it was on unit spacing (p = 0 there). So the min-gap route
 * STILL beats the strip route on real spacings -- the advantage DEGRADES from 2N to
 * ~2 N^{0.4}, but does NOT collapse.
 *
 * WHY THE PREFACTOR GROWS (mechanism -- NOT the particle count)
 * ------------------------------------------------------------
 * imp-35218 R1: real zero spacings shrink with height (local mean ~ 2 pi / log(T / 2 pi),
 * the imp-35167 M3 regime), so the INITIAL min gap DECREASES with N (0.845 -> 0.716 ->
 * 0.498 for N = 50, 100, 200) as a larger N drags in tighter high-lying zeros. Since
 * the background field is ~ 1 / g_min (imp-35194 F2 / imp-35218 R2, the FRONT law that
 * DID survive real spacings), beta inherits the height-dependence of the local scale.
 * So the growth is driven by the SHRINKING LOCAL SCALE -- a SLOW (log-height) effect --
 * NOT by the particle count N appearing as an explicit 2N multiplier. That is exactly
 * why p_gap ~ 0.6 stays strictly below the strip p_strip = 1: the strip counts all N
 * poles linearly; the min-gap route sees only the local scale, which tightens with
 * height sub-linearly in N.
 *
 * THE VERDICT (advantage survives but degrades; the N-uniform rating was an artifact)
 * ----------------------------------------------------------------------------------
 * The imp-35214 Q2 "N-uniform prefactor (PRESENT)" rating was a FIXED-UNIT-SCALE
 * ARTIFACT: on the physically relevant real ordinates the prefactor is NOT N-uniform
 * (spread ~121-143%, growing ~N^0.6). BUT the GENUINE, spacing-robust advantage of
 * the min-gap route over the strip route -- SUB-LINEAR vs the strip EXACT-LINEAR
 * prefactor growth -- SURVIVES: p_gap ~ 0.6 < 1 = p_strip at every matched fraction, so
 * the advantage factor 2 N^{1 - p} still grows unbounded. The min-gap route therefore
 * STILL beats the strip route on real spacings; the advantage merely DEGRADES from an
 * exact 2N (unit spacing) to ~2 N^{0.4} (real spacing). This does NOT change the
 * binding obstruction: the residual missing input is STILL an a-priori g_min(t) > 0
 * whole-trajectory bound (imp-35214 Q3 = imp-35167 M2/M5), which the height-dependent
 * real-spacing scale makes HARDER (imp-35218 conclusion), not easier. So the min-gap
 * route keeps its structural edge over the strip route but does not become an
 * N-uniform field-Lipschitz constant, and the imp-35218 R1 refutation SHARPENS rather
 * than removes the min-gap advantage. Assessment only; discharges nothing; I3 stays
 * OPEN; establishes no operator positivity; changes no bound; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35214-min-gap-field-lipschitz-surrogate-assessment (the Q2 PRESENT rating reassessed here)
 * @see imp-35218-real-ordinate-background-field-sup (R1 real-ordinate beta NOT N-uniform; R2 front law survives)
 * @see imp-35194-background-field-sup-n-uniformity (F1 unit-spacing beta N-uniform; F2 beta ~ 1/g_min)
 * @see imp-35196-ystar-schedule-reconciliation-assessment (strip route eliminated; L_strip = 2N/y^2)
 * @see imp-35167-g-min-non-collision-certificate-scope (M2/M5/M3 min-gap certificate; the OPEN Q3)
 */

// --- imp-35194 F1 unit-spacing measured input (the basis of the imp-35214 Q2 rating) ---
const BETA_UNIT_MAX_REL_SPREAD = 0.0114; // < 1.5% across N = 50, 100, 200 (N-uniform)

// --- imp-35218 R1 real-ordinate measured inputs (re-encoded literals) ---
// Background field sup beta(N) at matched min-gap fractions of each run own initial gap.
const BETA_REAL = {
  frac05: { 50: 1.1, 100: 1.71, 200: 2.69 }, // beta at front-progress fraction 0.5
  frac005: { 50: 9.18, 100: 15.68, 200: 20.28 }, // beta at front-progress fraction 0.05
};
// Real-ordinate initial min gap DECREASES with N (height-dependent local scale).
const INIT_GAP_REAL = { 50: 0.845, 100: 0.716, 200: 0.498 };
// imp-35218 R1 reported relative spread band across N (vs < 1.5% for unit spacing).
const BETA_REAL_SPREAD_TIGHT = 1.21; // ~121% at the tightest matched level
const BETA_REAL_SPREAD_WIDE = 1.43; // ~143% at the widest matched level

const N_GRID = [50, 100, 200];

// Log-log endpoint slope p in beta(N) ~ N^p over N = 50 -> 200 (factor 4 in N).
function growthExponent(betaByN) {
  const p = Math.log(betaByN[200] / betaByN[50]) / Math.log(200 / 50);
  return p;
}

const P_GAP_FRAC05 = growthExponent(BETA_REAL.frac05); // ~0.645
const P_GAP_FRAC005 = growthExponent(BETA_REAL.frac005); // ~0.572
const P_STRIP = 1; // strip prefactor L_strip = 2N/y^2 is EXACTLY N-linear

// The min-gap advantage exponent over the strip route: L_strip/L_gap ~ 2 N^{1 - p}.
const ADV_EXP_FRAC05 = P_STRIP - P_GAP_FRAC05; // ~0.355 > 0 => still grows
const ADV_EXP_FRAC005 = P_STRIP - P_GAP_FRAC005; // ~0.428 > 0 => still grows

// Illustrative advantage factor 2 N^{1 - p} at a few roadmap-scale N (using frac 0.5).
const N_SWEEP = [200, 1e3, 1e4, 1e6];
const ADV_ROWS = N_SWEEP.map((N) => ({
  N,
  strip_over_gap_unit: +(2 * N).toExponential(4), // imp-35214: exact 2N on unit spacing
  strip_over_gap_real: +(2 * Math.pow(N, ADV_EXP_FRAC05)).toExponential(4), // ~2 N^0.36 on real
}));

export const IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT = {
  id: 'imp-35239',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35214 min-gap field-Lipschitz surrogate route still genuinely BEAT the imp-35196 strip ' +
    'route once REAL zero spacings replace unit spacing, given imp-35218 R1 found the prefactor beta is NOT ' +
    'N-uniform on real ordinates (grows ~1.1 -> 2.7), or was the imp-35214 Q2 N-uniformity advantage a ' +
    'fixed-unit-scale artifact? Assessment only; I3 stays OPEN; NO QED.',
  claimsReassessed: {
    imp35214_Q2_rating: 'PRESENT / data-level: the min-gap prefactor carries NO factor of N and is N-uniform (cited imp-35194 F1 unit-spacing spread < 1.5%)',
    imp35218_R1_finding: 'REFUTES the N-uniformity on real ordinates: beta grows ~1.10 -> 1.71 -> 2.69 (frac 0.5), spread ~121-143% vs < 1.5% unit',
  },
  twoAdvantagesDisentangled: {
    A_structural:
      'STRIP prefactor L_strip = 2N/y^2 is EXPLICITLY N-LINEAR (p_strip = 1); MIN-GAP prefactor beta/g^2 is a LOCAL background-field scale with no explicit 2N factor -- SPACING-ROBUST',
    B_numeric:
      'imp-35214 Q2 additionally claimed the prefactor VALUE does not grow with N at all (p_gap = 0) -- this was the UNIT-SPACING artifact imp-35218 R1 refutes',
  },
  realOrdinateGrowth: {
    p_gap_frac05: +P_GAP_FRAC05.toFixed(4),
    p_gap_frac005: +P_GAP_FRAC005.toFixed(4),
    p_strip: P_STRIP,
    bothSubLinear: P_GAP_FRAC05 < 1 && P_GAP_FRAC005 < 1,
    advantage_exponent_frac05: +ADV_EXP_FRAC05.toFixed(4),
    advantage_exponent_frac005: +ADV_EXP_FRAC005.toFixed(4),
  },
  mechanism:
    'beta grows with N NOT via the particle count but via the SHRINKING LOCAL SCALE: real spacings tighten ' +
    'with height (~2 pi / log(T/2 pi), imp-35167 M3), so the initial min gap decreases with N (0.845 -> 0.716 ' +
    '-> 0.498) and beta ~ 1/g_min (imp-35218 R2 front law) inherits it -- a SLOW log-height effect, not a 2N term',
  betaUnitMaxRelSpread: BETA_UNIT_MAX_REL_SPREAD,
  betaRealSpreadBand: { tight: BETA_REAL_SPREAD_TIGHT, wide: BETA_REAL_SPREAD_WIDE },
  initGapReal: INIT_GAP_REAL,
  advantageRows: ADV_ROWS,
  // The genuine STRUCTURAL advantage (sub-linear vs strip linear) survives real spacings ...
  stillBeatsStripOnRealSpacing: true,
  // ... but the imp-35214 Q2 "N-uniform prefactor" rating was a fixed-unit-scale artifact ...
  prefactorNUniformOnRealSpacing: false,
  q2RatingWasUnitScaleArtifact: true,
  // ... and the advantage DEGRADES from 2N to ~2 N^{0.4} without collapsing.
  advantageDegradesButSurvives: true,
  advantageCollapses: false,
  i3Discharged: false,
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). The imp-35214 Q2 rating conflated TWO advantages of the ' +
    'min-gap route over the imp-35196 strip route: (A) STRUCTURAL -- the strip prefactor L_strip = 2N/y^2 is ' +
    'EXPLICITLY N-LINEAR (p_strip = 1) while the min-gap prefactor beta/g^2 is a LOCAL background-field scale ' +
    'with no explicit factor of N; and (B) NUMERIC -- Q2 additionally claimed the prefactor VALUE is N-uniform ' +
    '(does not grow with N at all), citing imp-35194 F1 unit-spacing spread < 1.5%. imp-35218 R1 REFUTES (B) on ' +
    'real ordinates: beta grows ~1.10 -> 1.71 -> 2.69 at fraction 0.5, spread ~121-143%. Fitting beta(N) ~ N^p ' +
    'over N = 50, 100, 200 gives p_gap ~ 0.645 (frac 0.5) and ~0.572 (frac 0.05) -- BOTH strictly SUB-LINEAR ' +
    '(p_gap < 1 = p_strip), so (A) SURVIVES: the min-gap prefactor still grows STRICTLY SLOWER than the strip ' +
    '2N, and the advantage factor L_strip / L_gap ~ 2 N^{1 - p} still grows WITHOUT BOUND (exponent ~0.36-0.43 ' +
    '> 0). So the min-gap route STILL BEATS the strip route on real spacings -- the advantage merely DEGRADES ' +
    'from an exact 2N (unit spacing) to ~2 N^{0.4} (real spacing), it does NOT collapse. The growth is driven by ' +
    'the SHRINKING LOCAL SCALE (real spacings tighten with height, ~2 pi / log(T/2 pi); the initial min gap ' +
    'decreases 0.845 -> 0.716 -> 0.498 and beta ~ 1/g_min inherits it, imp-35218 R2) -- a SLOW log-height effect, ' +
    'NOT the particle count. CONCLUSION: the imp-35214 Q2 "N-uniform prefactor (PRESENT)" rating was a ' +
    'FIXED-UNIT-SCALE ARTIFACT, but the min-gap route retains its genuine STRUCTURAL edge over the strip route ' +
    '(sub-linear vs linear prefactor growth); the imp-35218 R1 refutation SHARPENS rather than removes it. The ' +
    'binding obstruction is UNCHANGED -- the residual missing input is still an a-priori g_min(t) > 0 ' +
    'whole-trajectory bound (imp-35214 Q3 = imp-35167 M2/M5), which the height-dependent real-spacing scale makes ' +
    'HARDER (imp-35218 conclusion). Assessment only; discharges nothing; I3 stays OPEN; establishes no operator ' +
    'positivity; changes no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35214-min-gap-field-lipschitz-surrogate-assessment (the Q2 PRESENT rating reassessed here); ' +
    'imp-35218-real-ordinate-background-field-sup (R1 real-ordinate beta NOT N-uniform; R2 front law survives); ' +
    'imp-35194-background-field-sup-n-uniformity (F1 unit-spacing beta N-uniform; F2 beta ~ 1/g_min); ' +
    'imp-35196-ystar-schedule-reconciliation-assessment (strip route eliminated; L_strip = 2N/y^2); ' +
    'imp-35167-g-min-non-collision-certificate-scope (M2/M5/M3 min-gap certificate; the OPEN Q3); ' +
    'imp-486 (C_mb GUE-conditional).',
};

export const IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT_ASSERTIONS = [
  {
    // The imp-35214 Q2 rating rested on the imp-35194 F1 unit-spacing N-uniformity.
    id: 'imp35239-unit-spacing-prefactor-N-uniform',
    description: 'imp-35194 F1: unit-spacing background beta relative spread across N < 1.5% (the basis of the imp-35214 Q2 rating)',
    holds: () => BETA_UNIT_MAX_REL_SPREAD > 0 && BETA_UNIT_MAX_REL_SPREAD < 0.015,
  },
  {
    // imp-35218 R1: on REAL ordinates the prefactor is NOT N-uniform -- it grows with N.
    id: 'imp35239-real-spacing-prefactor-not-N-uniform',
    description: 'imp-35218 R1: on real ordinates beta grows monotonically with N at every matched fraction, spread >> 1.5% (refutes Q2 numeric claim)',
    holds: () => {
      const grows = (b) => b[50] < b[100] && b[100] < b[200];
      return (
        grows(BETA_REAL.frac05) &&
        grows(BETA_REAL.frac005) &&
        BETA_REAL_SPREAD_TIGHT > 0.5 &&
        BETA_REAL_SPREAD_WIDE > 0.5
      );
    },
  },
  {
    // The real-ordinate growth exponent is strictly SUB-LINEAR at every matched fraction.
    id: 'imp35239-real-growth-sub-linear',
    description: 'beta(N) ~ N^p with p ~ 0.57-0.65 at both matched fractions -- strictly below the strip p_strip = 1',
    holds: () =>
      P_GAP_FRAC05 > 0.5 &&
      P_GAP_FRAC05 < P_STRIP &&
      P_GAP_FRAC005 > 0.5 &&
      P_GAP_FRAC005 < P_STRIP,
  },
  {
    // The min-gap advantage factor 2 N^{1 - p} still grows unbounded => STILL beats strip.
    id: 'imp35239-advantage-still-grows',
    description: 'advantage exponent 1 - p > 0 at both fractions: L_strip / L_gap ~ 2 N^{1-p} grows without bound -- the min-gap route still beats the strip route on real spacings',
    holds: () => ADV_EXP_FRAC05 > 0 && ADV_EXP_FRAC005 > 0 && ADV_EXP_FRAC05 < 1 && ADV_EXP_FRAC005 < 1,
  },
  {
    // The advantage DEGRADES: the real-ordinate factor is strictly smaller than the unit 2N at every N > 1.
    id: 'imp35239-advantage-degrades-not-collapses',
    description: 'the real-spacing advantage 2 N^{1-p} is strictly below the unit-spacing 2N for N > 1, but still exceeds 1 (positive, growing) -- degrades without collapsing',
    holds: () =>
      ADV_ROWS.every((r) => r.strip_over_gap_real < r.strip_over_gap_unit && r.strip_over_gap_real > 1),
  },
  {
    // Mechanism: the real initial min gap DECREASES with N (height-dependent local scale, not particle count).
    id: 'imp35239-mechanism-shrinking-local-scale',
    description: 'imp-35218 R1 mechanism: the real initial min gap decreases with N (0.845 -> 0.716 -> 0.498) -- beta ~ 1/g_min inherits the shrinking local scale, a slow height effect not a 2N term',
    holds: () =>
      INIT_GAP_REAL[50] > INIT_GAP_REAL[100] &&
      INIT_GAP_REAL[100] > INIT_GAP_REAL[200] &&
      N_GRID.length === 3,
  },
  {
    // Honesty gate: still beats strip true, prefactor NOT N-uniform (artifact), advantage degrades, I3 OPEN, NO QED, no refereed bound is changed.
    id: 'imp35239-honesty-gate-no-qed',
    description: 'Assessment only: stillBeatsStrip true, prefactorNUniform false (unit-scale artifact), advantage degrades not collapses, I3 not discharged, isRigorous false, NO QED, no refereed bound is changed',
    holds: () =>
      IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT.stillBeatsStripOnRealSpacing === true &&
      IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT.prefactorNUniformOnRealSpacing === false &&
      IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT.q2RatingWasUnitScaleArtifact === true &&
      IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT.advantageDegradesButSurvives === true &&
      IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT.advantageCollapses === false &&
      IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT.i3Discharged === false &&
      IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT.verdict),
  },
];

for (const a of IMP35239_MIN_GAP_PREFACTOR_REAL_SPACING_REASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35239-min-gap-prefactor-real-spacing-reassessment assertion failed: ${a.id}`);
  }
}
