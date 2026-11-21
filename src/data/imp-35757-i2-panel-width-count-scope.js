/**
 * @module imp-35757-i2-panel-width-count-scope
 *
 * imp-35757 (numerical/assessment, S-frontier): ESTIMATE the imp-35727 ingredient
 * I2 per-panel argument-increment budget. imp-35727 lists five GREENFIELD
 * ingredients (I1-I5) a certified argument-principle winding count on the boundary
 * of the transition rectangle R = [T_PT, T_PT + Delta] x [-h, h] needs, but never
 * quantifies I2 -- the per-panel cap |Delta arg f| < pi the experimental unwrap
 * silently assumes. From the winding RATE the held-but-experimental modules measure
 * (imp-2696 W_pp, imp-33968 winding slope), this DERIVES the boundary-panel width
 * Delta_panel so each panel turns f by less than a half-plane, then counts panels
 * per rectangle edge at T_PT = 3e12.
 *
 * ORDER-OF-MAGNITUDE SCOPING ONLY. Certifies no count; instantiates no interval
 * enclosure; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE MEASURED WINDING RATE (the input the held modules supply)
 * -----------------------------------------------------------------------------
 * The held winding experiments read the RATE at which arg H_t advances along the
 * critical line. On the line, H_0 is proportional to the completed xi-type function
 * whose phase is the Riemann-Siegel theta(t): its winding rate is the classical
 *     w(t) = dtheta/dt = (1/2) log(t / 2 pi)   radians per unit height,
 * equivalently one half-turn pi per mean zero gap delta(t) = 2 pi / log(t / 2 pi)
 * (one sign change of the Hardy function per zero). imp-2696 reads this as the
 * phase-plane unwrapped angle W_pp on a fixed sampled window (isRigorous:false);
 * imp-33968 reads the analogous slope on the model cusp -(1 + alpha), anchored at
 * alpha = 1/2 to -3/2. This module uses the smooth mean rate w(t) as the winding
 * budget the panel width must respect. At T_PT = 3e12:
 *     log(T_PT / 2 pi) ~ 26.892,   w(T_PT) ~ 13.446 rad per unit height.
 *
 * DERIVING THE PANEL WIDTH FROM THE I2 CAP
 * -----------------------------------------------------------------------------
 * I2 requires |Delta arg f| < pi over each panel. Charging the mean winding rate
 * against that cap gives the borderline panel width
 *     Delta_panel = pi / w(T_PT) = 2 pi / log(T_PT / 2 pi) = delta(T_PT) ~ 0.2336,
 * i.e. the panel width equals EXACTLY the mean zero gap at T_PT -- a clean OOM
 * identity: one half-turn of argument budget buys exactly one mean zero spacing of
 * boundary. A CERTIFIED cap cannot sit at the borderline (the local rate fluctuates
 * about the mean by O(S prime(t)), and an interval read must bound the local rate,
 * not the mean), so a safety factor s (require |Delta arg| <= pi / s) shrinks the
 * width to delta / s; s = 2 gives Delta_panel ~ 0.1168.
 *
 * COUNTING PANELS PER EDGE AT T_PT
 * -----------------------------------------------------------------------------
 * Panel DENSITY along an edge that runs in the height direction (the two edges
 * parallel to the critical line, where the winding lives) is
 *     rho_panel = 1 / Delta_panel = w(T_PT) / pi = log(T_PT / 2 pi) / (2 pi)
 *               ~ 4.28 panels per unit height   (borderline cap),
 *               ~ 8.56 panels per unit height   (safety factor s = 2).
 * For a rectangle of height Delta and transverse half-width h:
 *   - the two LONG edges (parallel to the line, length Delta each) need
 *     n_long = ceil(Delta / Delta_panel) = ceil(Delta * rho_panel) ~ 4.28 * Delta
 *     panels each (~ one panel per mean zero gap: the panel count tracks the zero
 *     count in the window);
 *   - the two SHORT / transverse edges (across the line, length 2h each) carry far
 *     weaker winding, but as a conservative OOM upper bound take the same density,
 *     n_short ~ ceil(2h / Delta_panel) ~ 8.56 * h panels each.
 * For a representative unit window Delta = 1, h = 1 (borderline cap): ~5 panels on
 * each long edge and <= 9 on each short edge -- ~ a few tens of panels around the
 * closed loop dR. The count scales linearly in the window height Delta and grows
 * only logarithmically in T_PT (via log(T_PT / 2 pi)), so pushing the height an
 * order of magnitude past 3e12 barely moves the per-unit density.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * OOM scoping only. It uses the SMOOTH mean winding rate; a certified I2 cap needs
 * an interval UPPER bound on the LOCAL rate on each panel (mean plus an S prime
 * fluctuation margin), which shrinks Delta_panel further -- so the counts here are
 * LOWER bounds on the panels a certificate would use. It instantiates no interval
 * enclosure (I1), lower-bounds no modulus (I3), closes no integer (I4), composes no
 * corner (I5); it does not fix Delta or h; it certifies no count and changes no
 * bound. NO QED. No refereed bound is changed.
 *
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I2 named GREENFIELD, unquantified)
 * @see imp-2696-winding-lyapunov-experiment (W_pp winding rate, arg H_tau sampled, isRigorous:false)
 * @see imp-33968-winding-rate-vs-alpha-curve (least-squares winding slope -(1+alpha), isRigorous:false)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part B graded W2: experimental code held, certified count greenfield)
 * @see imp-35725-w1-effective-error-cap-budget (C_t = E_A + E_B + E_C0; the enclosure the local-rate margin rests on)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35727 / imp-35726) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const TWO_PI = 2 * Math.PI;
const HALF_TURN = Math.PI; // the I2 cap threshold: |Delta arg f| < pi per panel

// Measured winding rate w(t) = dtheta/dt = (1/2) log(t/2pi) rad per unit height.
const LOG_T_OVER_2PI = Math.log(T_PT / TWO_PI); // ~ 26.892
const WINDING_RATE = 0.5 * LOG_T_OVER_2PI; // ~ 13.446 rad per unit height at T_PT
const MEAN_ZERO_GAP = TWO_PI / LOG_T_OVER_2PI; // ~ 0.2336 (one half-turn per gap)

// I2 panel width: charge the mean rate against the |Delta arg| < pi cap.
const DELTA_PANEL_BORDERLINE = HALF_TURN / WINDING_RATE; // = MEAN_ZERO_GAP identity
const SAFETY_FACTOR = 2; // require |Delta arg| <= pi/s for a certified (non-borderline) cap
const DELTA_PANEL_SAFE = DELTA_PANEL_BORDERLINE / SAFETY_FACTOR; // ~ 0.1168

// Panel density along a height-running edge = 1 / Delta_panel = w/pi.
const PANELS_PER_UNIT_HEIGHT_BORDERLINE = WINDING_RATE / HALF_TURN; // ~ 4.28
const PANELS_PER_UNIT_HEIGHT_SAFE = PANELS_PER_UNIT_HEIGHT_BORDERLINE * SAFETY_FACTOR; // ~ 8.56

// Representative unit window Delta = 1, h = 1 (borderline cap), for concrete counts.
const REP_DELTA = 1;
const REP_H = 1;
const REP_LONG_EDGE_PANELS = Math.ceil(REP_DELTA / DELTA_PANEL_BORDERLINE); // 5
const REP_SHORT_EDGE_PANELS = Math.ceil((2 * REP_H) / DELTA_PANEL_BORDERLINE); // 9 (conservative)
const REP_LOOP_PANELS = 2 * REP_LONG_EDGE_PANELS + 2 * REP_SHORT_EDGE_PANELS; // ~ 28

export const IMP35757_I2_PANEL_WIDTH_COUNT_SCOPE = {
  id: 'imp-35757',
  proofSection: 'S-frontier',
  question:
    'Estimate the imp-35727 ingredient-I2 per-panel argument-increment budget: from the imp-2696/imp-33968 ' +
    'measured winding rate of arg H_t, DERIVE the boundary-panel width Delta_panel so the |Delta arg H_t| < pi ' +
    'cap holds per sub-segment on the transition-rectangle boundary dR at T_PT = 3e12, and count panels per ' +
    'edge. Order-of-magnitude scoping only; certifies no count; changes no bound; NO QED.',
  measuredWindingRate: {
    formula: 'w(t) = dtheta/dt = (1/2) log(t / 2 pi) radians per unit height (one half-turn pi per mean zero gap)',
    heldSources:
      'imp-2696 reads this as the phase-plane unwrapped angle W_pp on a sampled window (isRigorous:false); ' +
      'imp-33968 reads the analogous slope on the model cusp, -(1 + alpha) anchored to -3/2 at alpha = 1/2 ' +
      '(isRigorous:false). This module uses the smooth mean rate as the panel-width budget.',
    logT_over_2pi: LOG_T_OVER_2PI,
    windingRateAtTPT: WINDING_RATE,
    meanZeroGapAtTPT: MEAN_ZERO_GAP,
  },
  panelWidth: {
    cap: 'I2 requires |Delta arg f| < pi per panel.',
    borderline:
      'Delta_panel = pi / w(T_PT) = 2 pi / log(T_PT / 2 pi) = delta(T_PT): the panel width equals EXACTLY the ' +
      'mean zero gap at T_PT -- one half-turn of argument budget buys one mean zero spacing of boundary.',
    deltaPanelBorderline: DELTA_PANEL_BORDERLINE,
    certifiedNote:
      'A CERTIFIED cap cannot sit at the borderline: the local rate fluctuates about the mean by O(S prime(t)) ' +
      'and an interval read must bound the LOCAL rate, not the mean. A safety factor s (require |Delta arg| <= ' +
      'pi / s) shrinks the width to delta / s.',
    safetyFactor: SAFETY_FACTOR,
    deltaPanelSafe: DELTA_PANEL_SAFE,
  },
  panelCounts: {
    densityFormula: 'rho_panel = 1 / Delta_panel = w(T_PT) / pi = log(T_PT / 2 pi) / (2 pi) panels per unit height',
    panelsPerUnitHeightBorderline: PANELS_PER_UNIT_HEIGHT_BORDERLINE,
    panelsPerUnitHeightSafe: PANELS_PER_UNIT_HEIGHT_SAFE,
    longEdge:
      'The two edges PARALLEL to the critical line (length Delta, where the winding lives) need ' +
      'n_long = ceil(Delta / Delta_panel) ~ 4.28 * Delta panels each -- about one panel per mean zero gap, so ' +
      'the panel count tracks the zero count in the window.',
    shortEdge:
      'The two SHORT / transverse edges (across the line, length 2h) carry far weaker winding; as a ' +
      'conservative OOM upper bound take the same density, n_short ~ ceil(2h / Delta_panel) ~ 8.56 * h each.',
    representativeWindow:
      'For Delta = 1, h = 1 (borderline cap): ~5 panels on each long edge, <= 9 on each short edge -- a few ' +
      'tens of panels around the closed loop dR. The count scales linearly in the window height Delta and grows ' +
      'only logarithmically in T_PT (via log(T_PT / 2 pi)).',
    repLongEdgePanels: REP_LONG_EDGE_PANELS,
    repShortEdgePanels: REP_SHORT_EDGE_PANELS,
    repLoopPanels: REP_LOOP_PANELS,
  },
  perSegmentCapThreshold: HALF_TURN,
  isRigorous: false,
  verdict:
    'ORDER-OF-MAGNITUDE SCOPING (frontier-direction, NOT rigorous). Charging the measured smooth winding rate ' +
    'w(T_PT) = (1/2) log(T_PT / 2 pi) ~ 13.45 rad per unit height against the imp-35727 I2 cap |Delta arg| < pi ' +
    'gives a boundary-panel width Delta_panel = pi / w = 2 pi / log(T_PT / 2 pi) ~ 0.234 in height units -- ' +
    'EXACTLY the mean zero gap at T_PT = 3e12. Panel density is w / pi ~ 4.28 per unit height (borderline) or ' +
    '~ 8.56 with a safety factor 2; a representative unit rectangle (Delta = h = 1) needs ~5 panels per long ' +
    '(along-line) edge, <= 9 per short (transverse) edge, ~ a few tens around the loop, scaling linearly in ' +
    'the window height and only logarithmically in T_PT. The counts use the MEAN rate and are LOWER bounds: a ' +
    'certified I2 cap needs an interval UPPER bound on the LOCAL rate (mean plus an S prime fluctuation margin), ' +
    'which shrinks Delta_panel further. Instantiates no interval enclosure; certifies no count; fixes no Delta ' +
    'or h; changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35727 (I2 named GREENFIELD, unquantified); imp-2696 (W_pp winding rate, arg H_tau sampled, ' +
    'isRigorous:false); imp-33968 (winding-rate-vs-alpha least-squares slope -(1+alpha), isRigorous:false); ' +
    'imp-35681 Part B (graded W2: experimental code held, certified count greenfield); imp-35725 ' +
    '(effective-error cap C_t the local-rate margin rests on); Polymath15 2019 (effective approximation ' +
    'H_t = A + B - C; barrier method); Platt-Trudgian 2021.',
};

export const IMP35757_I2_PANEL_WIDTH_COUNT_SCOPE_ASSERTIONS = [
  {
    // The measured winding rate is the smooth Riemann-Siegel rate; at T_PT ~ 13.45 rad per unit height.
    id: 'imp35757-winding-rate-at-tpt',
    description: 'w(T_PT) = (1/2) log(T_PT/2pi) ~ 13.45 rad per unit height, from the held W_pp / slope modules',
    holds: () =>
      T_PT === 3e12 &&
      Math.abs(LOG_T_OVER_2PI - Math.log(3e12 / (2 * Math.PI))) < 1e-12 &&
      Math.abs(WINDING_RATE - 13.4458782) < 1e-4 &&
      Math.abs(IMP35757_I2_PANEL_WIDTH_COUNT_SCOPE.measuredWindingRate.windingRateAtTPT - WINDING_RATE) < 1e-15,
  },
  {
    // Panel width for the |Delta arg| < pi cap equals the mean zero gap EXACTLY (the clean OOM identity).
    id: 'imp35757-panel-width-equals-mean-gap',
    description: 'Delta_panel = pi / w = 2 pi / log(T_PT/2pi) = mean zero gap ~ 0.2336 at T_PT',
    holds: () =>
      Math.abs(DELTA_PANEL_BORDERLINE - Math.PI / WINDING_RATE) < 1e-15 &&
      Math.abs(DELTA_PANEL_BORDERLINE - MEAN_ZERO_GAP) < 1e-12 &&
      Math.abs(DELTA_PANEL_BORDERLINE - 0.2336488) < 1e-4 &&
      Math.abs(DELTA_PANEL_SAFE - DELTA_PANEL_BORDERLINE / 2) < 1e-15,
  },
  {
    // Panel density w/pi ~ 4.28 per unit height, and width * density = 1 (mutual inverses).
    id: 'imp35757-panel-density-and-counts',
    description: 'rho_panel = w/pi ~ 4.28 per unit height; Delta_panel * rho_panel = 1; rep window ~5 long / <=9 short',
    holds: () =>
      Math.abs(PANELS_PER_UNIT_HEIGHT_BORDERLINE - WINDING_RATE / Math.PI) < 1e-15 &&
      Math.abs(PANELS_PER_UNIT_HEIGHT_BORDERLINE - 4.279956) < 1e-4 &&
      Math.abs(DELTA_PANEL_BORDERLINE * PANELS_PER_UNIT_HEIGHT_BORDERLINE - 1) < 1e-12 &&
      REP_LONG_EDGE_PANELS === 5 &&
      REP_SHORT_EDGE_PANELS === 9 &&
      REP_LOOP_PANELS === 28,
  },
  {
    // The half-turn cap threshold is pi and matches the imp-35727 I2 cap the ticket quantifies.
    id: 'imp35757-cap-threshold-is-pi',
    description: 'The I2 per-panel cap threshold is pi (|Delta arg f| < pi), matching imp-35727 I2',
    holds: () =>
      Math.abs(IMP35757_I2_PANEL_WIDTH_COUNT_SCOPE.perSegmentCapThreshold - Math.PI) < 1e-15 &&
      /\|Delta arg f\| < pi/.test(IMP35757_I2_PANEL_WIDTH_COUNT_SCOPE.panelWidth.cap),
  },
  {
    // Honesty gate: OOM scoping only, no certification, no QED, no refereed bound is changed.
    id: 'imp35757-honesty-gate-no-qed',
    description: 'Scoping only; certifies no count; instantiates no enclosure; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35757_I2_PANEL_WIDTH_COUNT_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no count/.test(IMP35757_I2_PANEL_WIDTH_COUNT_SCOPE.verdict) &&
      /NO QED/.test(IMP35757_I2_PANEL_WIDTH_COUNT_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35757_I2_PANEL_WIDTH_COUNT_SCOPE.verdict),
  },
];

for (const a of IMP35757_I2_PANEL_WIDTH_COUNT_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35757-i2-panel-width-count-scope assertion failed: ${a.id}`);
  }
}
