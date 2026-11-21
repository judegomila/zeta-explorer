/**
 * @module imp-35777-i2-logderivative-panel-cap-scope
 *
 * imp-35777 (proof/assessment, S-frontier): ASSESS the panel resolution the imp-35727
 * ingredient I2 -- a certified per-panel argument-increment cap |Delta arg H_t| < pi
 * over each sub-segment of dR = boundary of R = [T_PT, T_PT + Delta] x [-h, h] -- would
 * require at T_PT = 3e12, expressed through the CERTIFIABLE quantity: an interval bound
 * on the logarithmic derivative |f prime| / |f| times the panel length. imp-35757 already
 * scoped I2 through the MEAN winding rate w(t) = (1/2) log(t/2pi) and flagged its counts
 * as LOWER bounds, because a certified cap needs an interval UPPER bound on the LOCAL
 * rate. This module supplies that upper-bound form and shows what it costs.
 *
 * ASSESSMENT / SCOPING ONLY. Ports nothing; certifies nothing; instantiates no interval
 * enclosure; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE CERTIFIABLE FORM OF THE I2 CAP
 * -----------------------------------------------------------------------------
 * Along a boundary sub-segment (panel) parametrised by arclength s, the argument of
 * f = H_t advances at the imaginary part of its logarithmic derivative:
 *     d/ds arg f = Im( f prime / f ).
 * Hence the total argument increment over a panel of length L is controlled by
 *     |Delta arg f| = | integral Im(f prime / f) ds | <= integral |f prime / f| ds
 *                   <= L . sup_panel |f prime / f|.
 * So a SUFFICIENT certified I2 cap (f stays in an open half-plane, no phase jump >= pi
 * between the interval-bracketed samples the experimental unwrap silently assumes) is
 *     L . sup_panel |f prime / f| < pi   ==>   L < pi / sup_panel |f prime / f|.
 * Unlike the mean winding rate w (a slope read from double-precision samples, isRigorous
 * false in imp-2696 / imp-33968), sup |f prime / f| is a quantity interval arithmetic can
 * BOUND FROM ABOVE on each panel -- this is the shape a certificate actually needs.
 *
 * THE STRUCTURAL FINDING: I2 IS COUPLED TO THE I3 MODULUS FLOOR
 * -----------------------------------------------------------------------------
 * Because |f prime / f| = |f prime| / |f|, bounding it on a panel factors as
 *     sup_panel |f prime / f| <= (sup_panel |f prime|) / (inf_panel |f|) = B / delta,
 * where B = sup |H_t prime| is a derivative bound and delta = inf |H_t| is EXACTLY the
 * imp-35727 ingredient I3 modulus floor (which imp-35758 identified as the reverse-
 * triangle surplus margin(z) - cap of the imp-35725 barrier inequality). The I2 panel
 * length the cap requires is therefore
 *     L_panel < pi . delta / B,
 * i.e. the per-panel argument cap and the modulus floor are the SAME obstruction read two
 * ways: I2 needs the panels short enough that B / delta . L stays below pi, and that ratio
 * is set by the I3 floor delta. Neither imp-35757 (free-standing mean rate) nor imp-35758
 * (floor alone) recorded this coupling; it says a certificate cannot budget I2 and I3
 * independently -- shrinking the rectangle to lift delta off the floor also lengthens the
 * admissible panels, and grazing a near-zero shrinks BOTH at once.
 *
 * OOM AT T_PT: THE ROBUST REGIME RECOVERS imp-35757
 * -----------------------------------------------------------------------------
 * In the robust regime imp-35758 describes (dR does NOT graze a would-be zero, so
 * delta ~ main-term scale ~ |H_t|), the derivative bound is B = sup |H_t prime|
 * ~ |H_t| . (1/2) log(T_PT / 2 pi): each Dirichlet-type term n^{-s} of the effective
 * A + B - C carries a log-derivative factor <= log sqrt(T_PT / 2 pi) = (1/2) log(T_PT/2pi).
 * Then B / delta ~ (1/2) log(T_PT / 2 pi) = w(T_PT) ~ 13.446, so
 *     L_panel < pi / (B/delta) ~ pi / w = 2 pi / log(T_PT / 2 pi) ~ 0.2336,
 * EXACTLY the imp-35757 borderline width (the mean zero gap). The two independent
 * routes -- mean winding rate (imp-35757) and log-derivative bound (here) -- AGREE on the
 * scale in the robust regime, which pins ~0.234 in height units as the correct OOM and
 * confirms imp-35757's density w/pi ~ 4.28 panels per unit height there.
 *
 * OOM AT T_PT: THE GRAZING REGIME AMPLIFIES THE COUNT WITHOUT BOUND
 * -----------------------------------------------------------------------------
 * Where dR grazes a would-be off-line zero, the I3 floor delta collapses toward 0
 * (imp-35758 caveat), while B stays main-term scale, so B / delta BLOWS UP and
 * L_panel < pi delta / B -> 0: the local panel count spikes by the amplification factor
 *     G = delta_robust / delta_local   (the panels-per-unit-height multiplier),
 * which is UNBOUNDED as the contour approaches a zero. The panel count is therefore NOT
 * uniform along dR: it equals the imp-35757 count (~4.28 . height, safety factor aside)
 * wherever the floor is main-term scale, and diverges locally where delta -> 0. A
 * certificate must POSITION the rectangle so dR keeps delta off the floor (the same
 * placement I3 already demands), or accept an unbounded panel budget -- so I2's resolution
 * cost is finite exactly when I3 holds, and infinite exactly where I3 fails.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * OOM scoping only. It writes the I2 cap in the certifiable |f prime|/|f| form and links
 * its panel length to the I3 floor, but it BOUNDS no |H_t prime| (B), lower-bounds no
 * |H_t| (delta), instantiates no interval enclosure (I1), closes no integer (I4), composes
 * no corner (I5); it fixes no Delta or h; it certifies no count and changes no bound.
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I2 named GREENFIELD)
 * @see imp-35757-i2-panel-width-count-scope (I2 via the MEAN winding rate; counts flagged LOWER bounds)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 floor delta = barrier-margin surplus)
 * @see imp-35725-w1-effective-error-cap-budget (C_t = E_A + E_B + E_C0; the margin the floor rests on)
 * @see imp-2696-winding-lyapunov-experiment (W_pp winding rate, sampled, isRigorous:false)
 * @see imp-33968-winding-rate-vs-alpha-curve (winding slope, least-squares, isRigorous:false)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35757 / imp-35758) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const TWO_PI = 2 * Math.PI;
const HALF_TURN = Math.PI; // the I2 cap threshold: |Delta arg f| < pi per panel

// Mean winding rate w(t) = (1/2) log(t/2pi); recovered here as the robust-regime B/delta.
const LOG_T_OVER_2PI = Math.log(T_PT / TWO_PI); // ~ 26.892
const WINDING_RATE = 0.5 * LOG_T_OVER_2PI; // w(T_PT) ~ 13.446 rad per unit height

// Robust-regime log-derivative ratio: B/delta ~ (1/2) log(T_PT/2pi) = w (per-term factor
// <= log sqrt(T_PT/2pi); floor delta ~ main-term scale ~ |H_t|).
const LOGDERIV_RATIO_ROBUST = WINDING_RATE; // B/delta in the robust regime = w

// Certifiable I2 panel length: L_panel < pi / sup|f prime/f| = pi . delta / B.
const L_PANEL_ROBUST = HALF_TURN / LOGDERIV_RATIO_ROBUST; // = pi/w ~ 0.2336 = imp-35757 borderline
const SAFETY_FACTOR = 2; // certified cap sits below the borderline (bound the LOCAL ratio)
const L_PANEL_SAFE = L_PANEL_ROBUST / SAFETY_FACTOR; // ~ 0.1168

// Panel density along a height-running edge = 1 / L_panel = (B/delta) / pi.
const PANELS_PER_UNIT_HEIGHT_ROBUST = LOGDERIV_RATIO_ROBUST / HALF_TURN; // ~ 4.28 (matches imp-35757)

// Grazing amplification: local panel count multiplies by G = delta_robust / delta_local.
// Illustrative decade drops of the I3 floor -> the same-decade rise in the local count.
const GRAZING_AMPLIFICATION_EXAMPLES = [
  { floorDropDecades: 1, G: 10 },
  { floorDropDecades: 2, G: 100 },
  { floorDropDecades: 3, G: 1000 },
];

export const IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE = {
  id: 'imp-35777',
  proofSection: 'S-frontier',
  question:
    'Assess the panel resolution the imp-35727 ingredient-I2 per-panel argument-increment cap |Delta arg H_t| < pi ' +
    'on dR = boundary of R = [T_PT, T_PT+Delta] x [-h, h] requires at T_PT = 3e12, via the certifiable form: an ' +
    'interval bound on |f prime|/|f| times panel length guaranteeing f stays in an open half-plane per panel. ' +
    'Assessment/scoping only; certifies no count; changes no bound; NO QED.',
  certifiableCapForm: {
    identity: 'd/ds arg f = Im(f prime / f), so |Delta arg f| <= integral |f prime/f| ds <= L . sup|f prime/f|.',
    sufficientCap: 'L . sup_panel |f prime/f| < pi  ==>  L < pi / sup_panel |f prime/f| (f stays in an open half-plane).',
    whyCertifiable:
      'Unlike the mean winding rate w (a slope read from double-precision samples, isRigorous:false in imp-2696 / ' +
      'imp-33968), sup |f prime/f| is a quantity interval arithmetic can UPPER-bound per panel -- the shape a ' +
      'certificate needs. This supplies the interval-upper-bound form imp-35757 flagged its mean-rate counts lacked.',
    capThreshold: HALF_TURN,
  },
  i2i3Coupling: {
    factorization: 'sup_panel |f prime/f| <= (sup|f prime|) / (inf|f|) = B / delta, delta = the I3 modulus floor.',
    panelLength: 'L_panel < pi . delta / B: the I2 panel length is SET by the I3 floor delta and a derivative bound B.',
    finding:
      'I2 and I3 are the SAME obstruction read two ways; a certificate cannot budget them independently -- shrinking ' +
      'the rectangle to lift delta off the floor also lengthens the admissible panels, and grazing a near-zero shrinks ' +
      'both at once. Neither imp-35757 (free-standing mean rate) nor imp-35758 (floor alone) recorded this coupling.',
  },
  robustRegime: {
    derivativeBound: 'B = sup|H_t prime| ~ |H_t| . (1/2) log(T_PT/2pi): each n^{-s} term carries log-deriv <= log sqrt(T_PT/2pi).',
    floor: 'delta ~ main-term scale ~ |H_t| (imp-35758 robust regime, dR not grazing a would-be zero).',
    ratioRecoversWindingRate: 'B / delta ~ (1/2) log(T_PT/2pi) = w(T_PT) ~ 13.446, so L_panel ~ pi/w ~ 0.2336.',
    logT_over_2pi: LOG_T_OVER_2PI,
    windingRate: WINDING_RATE,
    logDerivRatio: LOGDERIV_RATIO_ROBUST,
    lPanelRobust: L_PANEL_ROBUST,
    safetyFactor: SAFETY_FACTOR,
    lPanelSafe: L_PANEL_SAFE,
    panelsPerUnitHeight: PANELS_PER_UNIT_HEIGHT_ROBUST,
    agreementNote:
      'The mean-winding-rate route (imp-35757) and this log-derivative route AGREE at ~0.234 height units in the ' +
      'robust regime -- two independent derivations pinning the same OOM and the same ~4.28 panels per unit height.',
  },
  grazingRegime: {
    mechanism:
      'Where dR grazes a would-be off-line zero, delta -> 0 (imp-35758 caveat) while B stays main-term scale, so ' +
      'B/delta blows up and L_panel < pi delta / B -> 0: the local panel count spikes by G = delta_robust/delta_local, ' +
      'UNBOUNDED as the contour approaches a zero.',
    consequence:
      'The panel count is NOT uniform along dR: it equals the imp-35757 count where the floor is main-term scale and ' +
      'diverges locally where delta -> 0. A certificate must POSITION the rectangle to keep delta off the floor (the ' +
      'same placement I3 demands) -- I2 resolution is finite exactly when I3 holds, infinite exactly where I3 fails.',
    amplificationExamples: GRAZING_AMPLIFICATION_EXAMPLES,
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / OOM SCOPING (frontier-direction, NOT rigorous). The imp-35727 I2 per-panel cap |Delta arg H_t| < pi ' +
    'is certifiable in the logarithmic-derivative form L_panel . sup|f prime/f| < pi, i.e. L_panel < pi / sup|f prime/f|, ' +
    'a quantity interval arithmetic can UPPER-bound (unlike the sampled mean rate). Factoring sup|f prime/f| <= B/delta ' +
    'with delta = the I3 modulus floor gives L_panel < pi delta / B, so the I2 panel resolution is COUPLED to I3: in the ' +
    'robust regime (delta ~ main-term scale, B ~ |H_t| . (1/2) log(T_PT/2pi)) the ratio B/delta ~ w(T_PT) ~ 13.446 and ' +
    'L_panel ~ pi/w ~ 0.234, EXACTLY the imp-35757 borderline (~4.28 panels per unit height) -- the two routes agree. ' +
    'Where dR grazes a would-be zero the I3 floor delta -> 0, B/delta blows up, and the local panel count spikes without ' +
    'bound (multiplier delta_robust/delta_local), so I2 is finite exactly when I3 holds. Bounds no B; lower-bounds no ' +
    'delta; instantiates no enclosure; fixes no Delta or h; certifies no count; establishes no positivity; certifies ' +
    'no non-vanishing; evaluates no |H_t| or |H_t prime| directly (only the ratio B/delta); I2 remains GREENFIELD ' +
    'downstream of W1; changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35727 (I2 named GREENFIELD); imp-35757 (I2 via mean winding rate, counts flagged LOWER bounds); imp-35758 ' +
    '(I3 floor delta = barrier-margin surplus); imp-35725 (effective-error cap C_t); imp-2696 / imp-33968 (sampled ' +
    'winding rate, isRigorous:false); Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021.',
};

export const IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE_ASSERTIONS = [
  {
    // The certifiable cap is L . sup|f prime/f| < pi; at the borderline L . ratio = pi exactly.
    id: 'imp35777-certifiable-cap-form',
    description: 'I2 cap in log-derivative form: L_panel . sup|f prime/f| < pi; borderline L . (B/delta) = pi',
    holds: () =>
      Math.abs(IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.certifiableCapForm.capThreshold - Math.PI) < 1e-15 &&
      Math.abs(L_PANEL_ROBUST * LOGDERIV_RATIO_ROBUST - Math.PI) < 1e-12 &&
      /L_panel < pi \. delta \/ B/.test(IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.i2i3Coupling.panelLength),
  },
  {
    // Robust regime: B/delta = w(T_PT) ~ 13.446, recovering the mean winding rate.
    id: 'imp35777-robust-ratio-equals-winding-rate',
    description: 'B/delta ~ (1/2) log(T_PT/2pi) = w(T_PT) ~ 13.446 in the robust regime',
    holds: () =>
      T_PT === 3e12 &&
      Math.abs(WINDING_RATE - 13.4458782) < 1e-4 &&
      Math.abs(LOGDERIV_RATIO_ROBUST - WINDING_RATE) < 1e-15 &&
      Math.abs(LOGDERIV_RATIO_ROBUST - 0.5 * Math.log(3e12 / (2 * Math.PI))) < 1e-12,
  },
  {
    // Log-derivative route RECOVERS the imp-35757 borderline width and density (two routes agree).
    id: 'imp35777-recovers-imp35757-scale',
    description: 'L_panel = pi/(B/delta) ~ 0.2336 and density (B/delta)/pi ~ 4.28, matching imp-35757',
    holds: () =>
      Math.abs(L_PANEL_ROBUST - Math.PI / WINDING_RATE) < 1e-15 &&
      Math.abs(L_PANEL_ROBUST - 0.2336488) < 1e-4 &&
      Math.abs(PANELS_PER_UNIT_HEIGHT_ROBUST - WINDING_RATE / Math.PI) < 1e-15 &&
      Math.abs(PANELS_PER_UNIT_HEIGHT_ROBUST - 4.279956) < 1e-4 &&
      Math.abs(L_PANEL_ROBUST * PANELS_PER_UNIT_HEIGHT_ROBUST - 1) < 1e-12 &&
      Math.abs(L_PANEL_SAFE - L_PANEL_ROBUST / 2) < 1e-15,
  },
  {
    // Grazing amplification: a decade drop in the I3 floor is a decade rise in the local panel count.
    id: 'imp35777-grazing-amplification-unbounded',
    description: 'Local count multiplier G = delta_robust/delta_local; decade floor drops give decade count rises',
    holds: () =>
      GRAZING_AMPLIFICATION_EXAMPLES.length === 3 &&
      GRAZING_AMPLIFICATION_EXAMPLES.every((e) => Math.abs(e.G - Math.pow(10, e.floorDropDecades)) < 1e-9) &&
      GRAZING_AMPLIFICATION_EXAMPLES[2].G > GRAZING_AMPLIFICATION_EXAMPLES[0].G,
  },
  {
    // Honesty gate: OOM scoping only, no certification, no QED, no refereed bound is changed.
    id: 'imp35777-honesty-gate-no-qed',
    description: 'Scoping only; certifies no count; bounds no B; lower-bounds no delta; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no count/.test(IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.verdict) &&
      /NO QED/.test(IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.verdict),
  },
  {
    // Honesty gate: the I2/I3 caveat template (positivity, non-vanishing, |H_t|/|H_t prime|, W1 downstream)
    // must be prominent in this module's own verdict, not just in downstream citers.
    id: 'imp35777-honesty-gate-caveat-template',
    description: 'Verdict prominently states no positivity, no non-vanishing, no direct |H_t|/|H_t prime| evaluation, GREENFIELD downstream of W1',
    holds: () =>
      /establishes no positivity/.test(IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.verdict) &&
      /certifies no non-vanishing/.test(IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.verdict) &&
      /evaluates no \|H_t\| or \|H_t prime\|/.test(IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.verdict) &&
      /GREENFIELD\s+downstream of W1/.test(IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE.verdict),
  },
];

for (const a of IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35777-i2-logderivative-panel-cap-scope assertion failed: ${a.id}`);
  }
}
