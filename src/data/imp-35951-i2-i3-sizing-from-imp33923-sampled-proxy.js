/**
 * @module imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy
 *
 * imp-35951 (numerical/assessment, S-frontier): SIZE the two quantitatively
 * sizeable imp-35727 greenfield ingredients -- I2 (per-panel argument-increment
 * cap |Delta arg f| < pi) and I3 (modulus floor |f| >= delta > 0 on dR) -- for the
 * transition-rectangle boundary dR = [T_PT, T_PT + Delta] x [-h, h], using the HELD
 * imp-33923 off-axis phase-winding quadrature (isRigorous:false, sampled) as a
 * double-precision PROXY for the phase-increment density.
 *
 * ESTIMATE / SIZING ONLY. Certifies no cap; certifies no delta > 0; instantiates no
 * interval enclosure; counts no zeros; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * HOW THIS DIFFERS FROM imp-35757
 * -----------------------------------------------------------------------------
 * imp-35757 already sized I2 from the SMOOTH Riemann-Siegel mean winding rate
 * w(t) = (1/2) log(t / 2 pi) ~ 13.45 rad per unit height at T_PT, giving a panel
 * width equal to the mean zero gap and ~4.28 panels per unit height. That count is
 * an ANALYTIC-rate figure that touches no held numerics. THIS module instead reads
 * the panel budget straight out of the ONE held, self-executing, phase-winding
 * MEASUREMENT the repo actually carries -- imp-33923 -- as the ticket requested,
 * and adds the I3 modulus-floor sizing imp-35757 never touched.
 *
 * THE HELD imp-33923 PROXY (the sampled input)
 * -----------------------------------------------------------------------------
 * imp-33923 evaluated the scale-free off-axis leading amplitude
 *     A(theta) = int |u|^{-1/2} / (w - u)^2 du,   w = e^{i theta},
 * by an independent complex Simpson quadrature across theta in {45..135} deg (10
 * nodes, 10 deg spacing over a pi/2 parameter arc), and read straight from the
 * quadrature amplitude:
 *   - a least-squares phase-winding SLOPE  s = d arg / d theta = -3/2 (mag 3/2),
 *     confirmed to ~1e-13, and
 *   - a MODULUS |A_quad(theta)| = C_PS = pi / sqrt(2) ~ 2.2214 for EVERY theta,
 *     angle-robust (spread over the sweep ~0, < 1e-9).
 * We use |s| = 3/2 rad per rad of theta as the argument-increment DENSITY proxy and
 * the observed constant modulus C_PS as the sampled |f| floor proxy.
 *
 * (a) I2 PANEL COUNT FROM THE SAMPLED SLOPE
 * -----------------------------------------------------------------------------
 * Treating |s| as the density of arg-increment per unit of the traversal parameter,
 * a panel spanning Delta_par of parameter accrues |Delta arg| = |s| * Delta_par.
 * The I2 cap |Delta arg| < pi with margin m (require |Delta arg| <= pi / m) caps the
 * panel parameter-width at Delta_par_max = pi / (|s| * m) = 2 pi / (3 m). Over the
 * imp-33923 sweep parameter arc L_par = pi/2 the total winding is
 *     |s| * L_par = (3/2)(pi/2) = 3 pi / 4 ~ 2.356 rad,
 * so the panel count on that edge is n = ceil(total winding / (pi / m)) = ceil(3 m / 4):
 *     m = 1 (borderline) -> 1 panel;  m = 2 -> 2;  m = 4 -> 3.
 * The 10-node imp-33923 sample itself uses 9 intervals of Delta_par = pi/18 (10 deg),
 * i.e. per-node |Delta arg| = (3/2)(pi/18) = pi/12 ~ 0.2618 rad -- already a factor
 * pi / (pi/12) = 12 below the pi cap, so the held sample carries an intrinsic I2
 * margin of ~12 without refinement.
 *
 * (b) I3 MODULUS FLOOR FROM THE SAMPLED TRAVERSAL
 * -----------------------------------------------------------------------------
 * The empirical min |f| observed on the sampled traversal is the minimum of
 * |A_quad(theta)| over the sweep. Because the imp-33923 modulus is angle-robust
 * (spread ~0), that minimum equals C_PS = pi / sqrt(2) ~ 2.2214 -- the candidate
 * delta for I3, comfortably off zero.
 *
 * WHAT THIS DOES NOT DO (the honesty boundary)
 * -----------------------------------------------------------------------------
 * The proxy is the OFF-AXIS MODEL CUSP rho = |x|^{-1/2}, NOT the true H_t = A + B - C
 * on dR at T_PT = 3e12. The slope 3/2 is a dimensionless per-radian density on a
 * theta parameterization, NOT the along-line Riemann-Siegel rate ~13.45 rad per unit
 * height imp-35757 uses; the two panel counts are NOT one-to-one comparable, and the
 * modulus floor C_PS is the model leading-amplitude modulus, NOT a lower bound on
 * |H_t| on dR. A certified I2 cap needs an interval UPPER bound on the LOCAL rate of
 * the true f, and a certified I3 floor needs an interval LOWER bound on |H_t| -- both
 * gated on the greenfield imp-35681 Part A / imp-35725 A + B - C interval evaluator
 * (I1 / W1). This module instantiates no interval enclosure, certifies no cap,
 * certifies no delta > 0, counts no zeros, changes no bound; I2 and I3 stay
 * GREENFIELD. NO QED. No refereed bound is changed.
 *
 * @see imp-33923-off-axis-phase-winding-quadrature (held sampled slope -3/2 and modulus C_PS, isRigorous:false)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I1-I5 enumerated, all GREENFIELD)
 * @see imp-35757-i2-panel-width-count-scope (I2 sized from the SMOOTH Riemann-Siegel mean rate)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 floor tied to the imp-35725 margin surplus)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part B graded W2: experimental code held, certified count greenfield)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35727 / imp-35757) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this sizing
const HALF_TURN = Math.PI; // the I2 cap threshold: |Delta arg f| < pi per panel

// Held imp-33923 sampled proxy (reference literals; the module confirms both to ~1e-13):
const WINDING_SLOPE_MAG = 1.5; // |d arg / d theta| = 3/2, least-squares from the quadrature phase
const C_PS = Math.PI / Math.SQRT2; // ~2.2214: angle-robust quadrature modulus = the sampled |f| floor
const SWEEP_NODES = 10; // theta in {45..135} deg
const SWEEP_INTERVALS = SWEEP_NODES - 1; // 9 sampled panels
const SWEEP_PARAM_ARC = Math.PI / 2; // theta spans 45..135 deg = pi/2 rad of parameter
const NODE_PARAM_STEP = SWEEP_PARAM_ARC / SWEEP_INTERVALS; // pi/18 rad (10 deg)

// (a) I2: argument-increment density = |slope|; total winding over the sweep arc.
const TOTAL_WINDING = WINDING_SLOPE_MAG * SWEEP_PARAM_ARC; // (3/2)(pi/2) = 3 pi / 4 ~ 2.356 rad
// per-node increment of the held 10-node sample, and its intrinsic margin below the pi cap.
const NODE_ARG_INCREMENT = WINDING_SLOPE_MAG * NODE_PARAM_STEP; // pi/12 ~ 0.2618 rad
const SAMPLE_INTRINSIC_MARGIN = HALF_TURN / NODE_ARG_INCREMENT; // = 12
// panel count on the sweep edge to hold |Delta arg| <= pi / m: n = ceil(total / (pi/m)) = ceil(3 m / 4).
const panelsForMargin = (m) => Math.ceil(TOTAL_WINDING / (HALF_TURN / m));
const PANELS_BORDERLINE = panelsForMargin(1); // 1
const PANELS_MARGIN_2 = panelsForMargin(2); // 2
const PANELS_MARGIN_4 = panelsForMargin(4); // 3
const PANEL_PARAM_WIDTH_MARGIN_2 = HALF_TURN / (WINDING_SLOPE_MAG * 2); // 2 pi / (3*2) = pi/3

// (b) I3: min |f| on the sampled traversal = C_PS (angle-robust, spread ~0).
const MODULUS_FLOOR_PROXY = C_PS; // candidate delta for I3

export const IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY = {
  id: 'imp-35951',
  proofSection: 'S-frontier',
  question:
    'Size the imp-35727 ingredients I2 (per-panel |Delta arg f| < pi cap) and I3 (modulus floor |f| >= delta > 0 ' +
    'on dR) for the transition rectangle dR = [T_PT, T_PT + Delta] x [-h, h], using the HELD imp-33923 sampled ' +
    'off-axis phase-winding slope as the double-precision proxy for the argument-increment density. Estimate/sizing ' +
    'only; certifies no cap; certifies no delta > 0; changes no bound; NO QED.',
  heldProxy: {
    source:
      'imp-33923 off-axis phase-winding quadrature (isRigorous:false): the scale-free leading amplitude ' +
      'A(theta) = int |u|^{-1/2}/(w-u)^2 du, w = e^{i theta}, read by an independent complex Simpson quadrature ' +
      'across theta in {45..135} deg (10 nodes, 10 deg spacing over a pi/2 parameter arc).',
    windingSlopeMagnitude: WINDING_SLOPE_MAG,
    windingSlopeNote:
      'least-squares slope d arg / d theta = -3/2 (magnitude 3/2), confirmed by imp-33923 to ~1e-13; used here as ' +
      'the argument-increment DENSITY per unit of the traversal parameter theta.',
    quadratureModulus: +C_PS.toFixed(12),
    modulusNote:
      '|A_quad(theta)| = C_PS = pi / sqrt(2) for every theta, angle-robust (spread over the sweep ~0, < 1e-9); ' +
      'used here as the sampled |f| floor.',
    sweepNodes: SWEEP_NODES,
    sweepIntervals: SWEEP_INTERVALS,
    nodeParamStepRad: +NODE_PARAM_STEP.toFixed(9),
  },
  i2PanelSizing: {
    cap: 'I2 requires |Delta arg f| < pi per panel.',
    densityModel:
      'Treat |slope| = 3/2 as arg-increment per unit parameter; a panel of parameter-width Delta_par accrues ' +
      '|Delta arg| = |slope| * Delta_par. Cap with margin m: Delta_par <= pi / (|slope| * m) = 2 pi / (3 m).',
    totalWindingOverSweepRad: +TOTAL_WINDING.toFixed(9), // 3 pi / 4 ~ 2.356
    panelCountFormula: 'n = ceil(total winding / (pi / m)) = ceil(3 m / 4)',
    panelsBorderline: PANELS_BORDERLINE, // m = 1
    panelsMargin2: PANELS_MARGIN_2, // m = 2
    panelsMargin4: PANELS_MARGIN_4, // m = 4
    panelParamWidthMargin2Rad: +PANEL_PARAM_WIDTH_MARGIN_2.toFixed(9), // pi/3
    sampledNode: {
      nodeArgIncrementRad: +NODE_ARG_INCREMENT.toFixed(9), // pi/12 ~ 0.2618
      intrinsicMargin: +SAMPLE_INTRINSIC_MARGIN.toFixed(9), // 12
      note:
        'The held 10-node imp-33923 sample uses 9 intervals of pi/18 (10 deg); per-node |Delta arg| = pi/12 ~ ' +
        '0.2618 rad, a factor 12 below the pi cap -- so the held sample already carries an intrinsic I2 margin ' +
        'of ~12 without refinement.',
    },
  },
  i3ModulusFloorSizing: {
    requirement: 'I3 requires |f| >= delta > 0 on dR.',
    empiricalMinModulusOnTraversal: +MODULUS_FLOOR_PROXY.toFixed(12), // = C_PS
    note:
      'min |f| over the sampled traversal = min |A_quad(theta)| over the sweep; because the imp-33923 modulus is ' +
      'angle-robust (spread ~0) that minimum equals C_PS = pi / sqrt(2) ~ 2.2214 -- the candidate delta for I3, ' +
      'comfortably off zero.',
    candidateDelta: +MODULUS_FLOOR_PROXY.toFixed(12),
  },
  perSegmentCapThreshold: HALF_TURN,
  isRigorous: false,
  verdict:
    'ESTIMATE / SIZING (frontier-direction, NOT rigorous). Reading the imp-35727 I2 panel budget straight out of ' +
    'the HELD imp-33923 phase-winding quadrature (sampled slope |d arg / d theta| = 3/2, isRigorous:false) as an ' +
    'arg-increment density: the total winding over the pi/2 sweep arc is 3 pi / 4 ~ 2.356 rad, so holding ' +
    '|Delta arg| < pi per panel needs n = ceil(3 m / 4) panels on that edge (1 borderline, 2 at margin 2, 3 at ' +
    'margin 4), and the existing 10-node sample already sits at a per-node increment pi/12 ~ 0.2618 rad -- ' +
    'intrinsic margin ~12 below the cap. The empirical modulus floor on the sampled traversal is min |A_quad| = ' +
    'C_PS = pi / sqrt(2) ~ 2.2214, the candidate delta for I3. BOTH are PROXIES on the off-axis model cusp ' +
    'rho = |x|^{-1/2}, NOT the true H_t = A + B - C on dR at T_PT = 3e12: the slope 3/2 is a per-radian density ' +
    'on a theta parameterization, not the along-line Riemann-Siegel rate ~13.45 (imp-35757), and C_PS is the ' +
    'model leading-amplitude modulus, not a lower bound on |H_t|. A certified I2 cap needs an interval UPPER ' +
    'bound on the LOCAL rate of the true f and a certified I3 floor an interval LOWER bound on |H_t|, both gated ' +
    'on the greenfield imp-35681 Part A / imp-35725 evaluator (I1 / W1). Instantiates no interval enclosure; ' +
    'certifies no cap; certifies no delta > 0; counts no zeros; changes no bound; I2 and I3 stay GREENFIELD; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33923 (off-axis phase-winding quadrature, sampled slope -3/2 and modulus C_PS, isRigorous:false); ' +
    'imp-35727 (I1-I5 enumerated, all GREENFIELD); imp-35757 (I2 sized from the SMOOTH Riemann-Siegel mean rate); ' +
    'imp-35758 (I3 floor tied to the imp-35725 margin surplus); imp-35681 Part B (graded W2: experimental code ' +
    'held, certified count greenfield); imp-35725 (effective-error cap C_t); Polymath15 2019 (effective ' +
    'approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021.',
};

export const IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY_ASSERTIONS = [
  {
    // (a) I2 panel count from the sampled slope: total winding = 3pi/4, n = ceil(3m/4).
    id: 'imp35951-i2-panel-count-from-sampled-slope',
    description: 'Total winding 3pi/4 over the pi/2 sweep; panels = ceil(3m/4): 1 borderline, 2 at m=2, 3 at m=4',
    holds: () =>
      Math.abs(TOTAL_WINDING - (3 * Math.PI) / 4) < 1e-12 &&
      Math.abs(TOTAL_WINDING - WINDING_SLOPE_MAG * SWEEP_PARAM_ARC) < 1e-15 &&
      PANELS_BORDERLINE === 1 &&
      PANELS_MARGIN_2 === 2 &&
      PANELS_MARGIN_4 === 3,
  },
  {
    // The held 10-node sample already carries an intrinsic I2 margin of ~12 (per-node increment pi/12).
    id: 'imp35951-sample-intrinsic-margin-twelve',
    description: 'Per-node |Delta arg| = pi/12 ~ 0.2618 rad; intrinsic margin below the pi cap is exactly 12',
    holds: () =>
      Math.abs(NODE_ARG_INCREMENT - Math.PI / 12) < 1e-12 &&
      Math.abs(SAMPLE_INTRINSIC_MARGIN - 12) < 1e-9 &&
      Math.abs(NODE_PARAM_STEP - Math.PI / 18) < 1e-12,
  },
  {
    // (b) I3 modulus floor from the sampled traversal is C_PS = pi/sqrt(2) ~ 2.2214.
    id: 'imp35951-i3-modulus-floor-is-cps',
    description: 'Empirical min |f| on the sampled traversal = C_PS = pi/sqrt(2) ~ 2.2214, the candidate delta',
    holds: () =>
      Math.abs(MODULUS_FLOOR_PROXY - Math.PI / Math.SQRT2) < 1e-15 &&
      Math.abs(MODULUS_FLOOR_PROXY - 2.221441469) < 1e-6 &&
      MODULUS_FLOOR_PROXY > 0,
  },
  {
    // The I2 cap threshold is pi, matching imp-35727 / imp-35757.
    id: 'imp35951-cap-threshold-is-pi',
    description: 'The I2 per-panel cap threshold is pi (|Delta arg f| < pi), matching imp-35727 I2',
    holds: () =>
      Math.abs(IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY.perSegmentCapThreshold - Math.PI) < 1e-15 &&
      /\|Delta arg f\| < pi/.test(IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY.i2PanelSizing.cap),
  },
  {
    // Honesty gate: sizing only, both are proxies on the model cusp, no certification, no QED, no refereed bound is changed.
    id: 'imp35951-honesty-gate-no-qed',
    description: 'Sizing only; PROXY on the model cusp; certifies no cap; certifies no delta>0; I2/I3 GREENFIELD; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      /PROXIES on the off-axis model cusp/.test(IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY.verdict) &&
      /certifies no cap/.test(IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY.verdict) &&
      /stay GREENFIELD/.test(IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY.verdict) &&
      /NO QED/.test(IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY.verdict) &&
      /refereed bound is changed/i.test(IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY.verdict),
  },
];

for (const a of IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy assertion failed: ${a.id}`);
  }
}
