/**
 * @module imp-36059-i2-combined-panel-count-envelope
 *
 * imp-36059 (numerical/assessment, S-frontier): COMBINE the two now-reconciled
 * imp-35727 ingredient-I2 winding-density proxies into a SINGLE per-panel
 * argument-increment estimate feeding the imp-35777 cap |Delta arg f| < pi on the
 * transition-rectangle boundary dR at T_PT. imp-36008 wrote the model-cusp
 * arclength Jacobian J_geo = 1 (off-axis phase density 3/2 rad per unit model
 * arclength) and imp-35757 gives the along-line Riemann-Siegel winding rate
 * w(T) = (1/2) log(T/2pi) ~ 13.446 rad per unit HEIGHT; imp-35993 supplied the
 * mean-gap map (lambda = 2/w) that puts them on a common per-unit-height axis but
 * left them as TWO separate densities. Here we take the last step: pick the
 * envelope density both proxies must respect and read off the single I2 panel
 * count on dR.
 *
 * ASSESSMENT / MEASUREMENT ONLY. Certifies no cap; instantiates no interval
 * enclosure; counts no zeros; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE TWO RECONCILED DENSITIES (recap, both now per unit HEIGHT)
 * -----------------------------------------------------------------------------
 *   Route A (imp-35757): w(T) = (1/2) log(T/2pi) ~ 13.446 rad per unit height;
 *     borderline panel width Delta_A = pi/w = delta (the mean zero gap ~0.2336),
 *     density rho_A = w/pi ~ 4.28 panels per unit height.
 *   Route B (imp-36008/imp-35993): the J_geo = 1 off-axis slope 3/2 rad per unit
 *     model arclength, carried to height by the mean-gap map lambda = 2/w, giving
 *     3w/4 ~ 10.084 rad per unit height; panel width Delta_B = pi/(3w/4) = (4/3)delta,
 *     density rho_B = 3w/(4 pi) ~ 3.21 panels per unit height.
 * They differ by the imp-35993/imp-36008 residual rho_A/rho_B = 4/3 EXACTLY.
 *
 * THE SINGLE COMBINED ESTIMATE (the new step)
 * -----------------------------------------------------------------------------
 * The I2 cap |Delta arg f| < pi is a CEILING on per-panel winding: a panel is
 * admissible only if EVERY winding proxy stays under pi across it. So the single
 * panel budget both proxies satisfy uses the ENVELOPE (larger) density
 *     rho_env = max(rho_A, rho_B) = rho_A = w/pi ~ 4.28 panels per unit height,
 * i.e. the narrower borderline width Delta_panel = pi/w = delta. Over one such
 * borderline panel route A books exactly pi (its borderline) while route B books
 * only (3/4) pi, so route A is the BINDING proxy and route B sits a factor 4/3
 * (25%) below the cap -- the combined per-panel increment is pi, contributed by
 * route A alone. A certificate-direction safety factor s shrinks the width to
 * delta/s, dropping the per-panel increment to pi/s (~pi/2 at s=2) and doubling
 * the density to s*w/pi ~ 8.56 panels per unit height.
 *
 * THE SINGLE I2 PANEL COUNT ON dR AT T_PT
 * -----------------------------------------------------------------------------
 * For the imp-35757 representative unit window (Delta = h = 1) at the borderline
 * (s = 1), the envelope density gives per edge:
 *     two LONG edges (length Delta):  ceil(rho_A * Delta) = ceil(4.28) = 5 each,
 *     two SHORT edges (length 2h):    ceil(rho_A * 2h)    = ceil(8.56) = 9 each,
 *     total around dR:                2*5 + 2*9 = 28 panels,
 * REPRODUCING the imp-35757 ~28-panel count as the combined envelope. The route-B
 * proxy alone would ask for only ceil(3.21) = 4 long and ceil(6.42) = 7 short,
 * total 22 -- strictly FEWER, confirming route A is the binding constraint and the
 * combined single estimate collapses onto it (route B is never the tighter one).
 * At safety s = 2 the envelope count is 2*9 + 2*18 = 54 panels around dR.
 *
 * WHAT THIS DOES NOT DO (the honesty boundary)
 * -----------------------------------------------------------------------------
 * The envelope is the correct WAY to combine two winding proxies for a ceiling,
 * but the inputs are still PROXIES: route B lives on the off-axis model cusp
 * rho = |x|^{-1/2}, NOT the true H_t = A + B - C on dR, and route A is the SMOOTH
 * mean rate (a certified cap needs an interval UPPER bound on the LOCAL rate, per
 * imp-35777's L_panel < pi delta / B form with delta the I3 floor). The 4/3
 * separation and hence the "route A binds" verdict hold only under the mean-gap
 * closure lambda = 2/w (imp-36008: any other theta->height map rescales it). This
 * module instantiates no interval enclosure, certifies no cap, counts no true
 * zeros, fixes no Delta or h, changes no bound; I2 stays GREENFIELD. NO QED.
 * No refereed bound is changed.
 *
 * @see imp-36008-i2-theta-arclength-jacobian-decomposition (J_geo=1; density 3/2 per unit model arclength; lambda=2/w)
 * @see imp-35993-i2-panel-proxy-reconciliation-per-unit-height (per-unit-height reconciliation; residual 4/3 under the mean-gap map)
 * @see imp-35757-i2-panel-width-count-scope (route A ~13.45 rad/unit height, ~4.28 panels, ~28 around the unit window)
 * @see imp-35777-i2-logderivative-panel-cap-scope (certifiable cap form L_panel < pi delta / B; I2<->I3 coupling)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I1-I5 enumerated, all GREENFIELD)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35757 / imp-35993 / imp-36008) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this combination
const HALF_TURN = Math.PI; // the I2 cap threshold: |Delta arg f| < pi per panel

// Route A (imp-35757): smooth along-line Riemann-Siegel mean winding rate.
const routeARate = (T) => 0.5 * Math.log(T / (2 * Math.PI)); // w(T) rad per unit height
const meanGap = (T) => (2 * Math.PI) / Math.log(T / (2 * Math.PI)); // delta = pi / w
const W_A = routeARate(T_PT); // ~13.446 rad per unit height
const DELTA_GAP = meanGap(T_PT); // ~0.2336 = the imp-35757 borderline panel width

// Route B (imp-36008/imp-35993): J_geo=1 off-axis slope 3/2 rad per unit model arclength,
// carried to height by the mean-gap map lambda = 2/w -> 3w/4 rad per unit height.
const ROUTE_B_PER_HEIGHT = (3 * W_A) / 4; // ~10.084 rad per unit height

// The two densities per unit height (panels = density / pi from the |Delta arg f| < pi cap).
const RHO_A = W_A / Math.PI; // ~4.28 panels per unit height
const RHO_B = ROUTE_B_PER_HEIGHT / Math.PI; // ~3.21 panels per unit height
const RESIDUAL = RHO_A / RHO_B; // = 4/3 exactly (imp-35993/imp-36008 signature)

// The single COMBINED envelope density: a ceiling must respect the LARGER winding proxy.
const RHO_ENV = Math.max(RHO_A, RHO_B); // = RHO_A (route A binds)
const DELTA_PANEL_ENV = Math.PI / (RHO_ENV * Math.PI); // = pi/w = delta (borderline width)
// Per-panel argument increments over one envelope (borderline) panel, per route.
const INCREMENT_A = W_A * DELTA_PANEL_ENV; // = pi (route A borderline, binding)
const INCREMENT_B = ROUTE_B_PER_HEIGHT * DELTA_PANEL_ENV; // = 3pi/4 (route B, below cap)
const COMBINED_INCREMENT = Math.max(INCREMENT_A, INCREMENT_B); // = pi (route A binds)

// Safety factor pulls the borderline increment below the cap (a certificate cannot sit AT pi).
const SAFETY = 2;
const RHO_ENV_SAFE = SAFETY * RHO_ENV; // ~8.56 panels per unit height
const INCREMENT_SAFE = COMBINED_INCREMENT / SAFETY; // = pi/2 < pi

// The single I2 panel count around dR for the imp-35757 representative unit window Delta=h=1.
const UNIT_DELTA = 1; // long-edge length (parallel to the critical line)
const UNIT_H = 1; // half-height (short edge length is 2h)
const panelCount = (rho) => {
  const longEach = Math.ceil(rho * UNIT_DELTA); // two long edges, length Delta
  const shortEach = Math.ceil(rho * 2 * UNIT_H); // two short edges, length 2h
  return { longEach, shortEach, total: 2 * longEach + 2 * shortEach };
};
const ENVELOPE_COUNT = panelCount(RHO_ENV); // borderline (s=1) -> {5,9,28}
const ROUTE_B_COUNT = panelCount(RHO_B); // route B alone -> {4,7,22}, strictly fewer
const ENVELOPE_COUNT_SAFE = panelCount(RHO_ENV_SAFE); // s=2 -> {9,18,54}

// T-independence of the "route A binds" verdict (rho_A > rho_B, ratio 4/3) a decade either side.
const bindsRouteAAt = (T) => {
  const w = routeARate(T);
  const rhoA = w / Math.PI;
  const rhoB = (3 * w) / 4 / Math.PI;
  return rhoA > rhoB && Math.abs(rhoA / rhoB - 4 / 3) < 1e-12;
};

export const IMP36059_I2_COMBINED_PANEL_COUNT_ENVELOPE = {
  id: 'imp-36059',
  proofSection: 'S-frontier',
  question:
    'Combine the imp-36008 J_geo=1 off-axis density (3/2 per unit model arclength) with the imp-35757 along-line ' +
    'Riemann-Siegel winding rate (~13.446 rad per unit height) via the imp-35993 mean-gap map into a SINGLE ' +
    'imp-35777 I2 per-panel argument-increment / panel-count estimate on dR at T_PT. Assessment/measurement only; ' +
    'certifies no cap; changes no bound; NO QED.',
  anchor: { heightT_PT: T_PT, sotaLambda: L_PT, capThreshold: HALF_TURN },
  reconciledDensities: {
    routeA: {
      source: 'imp-35757 smooth along-line Riemann-Siegel mean rate',
      ratePerUnitHeightRad: +W_A.toFixed(6), // ~13.446
      panelWidth: +DELTA_GAP.toFixed(9), // pi/w = delta ~0.2336
      panelsPerUnitHeight: +RHO_A.toFixed(6), // ~4.28
    },
    routeB: {
      source: 'imp-36008 J_geo=1 density 3/2 per unit model arclength, mean-gap map lambda=2/w (imp-35993)',
      ratePerUnitHeightRad: +ROUTE_B_PER_HEIGHT.toFixed(6), // ~10.084
      panelWidth: +(Math.PI / ROUTE_B_PER_HEIGHT).toFixed(9), // (4/3)delta ~0.3115
      panelsPerUnitHeight: +RHO_B.toFixed(6), // ~3.21
    },
    residualDensityRatio: +RESIDUAL.toFixed(12), // 4/3
  },
  combinedEstimate: {
    rule: 'a per-panel CEILING |Delta arg f| < pi must respect the LARGER winding proxy, so combine by the envelope density max(rho_A, rho_B)',
    envelopeDensityPerUnitHeight: +RHO_ENV.toFixed(6), // = rho_A ~4.28
    envelopePanelWidth: +DELTA_PANEL_ENV.toFixed(9), // = delta ~0.2336
    bindingRoute: 'A (route A books the full pi over the envelope panel; route B books only 3pi/4)',
    perPanelIncrementRouteA: +INCREMENT_A.toFixed(9), // pi
    perPanelIncrementRouteB: +INCREMENT_B.toFixed(9), // 3pi/4
    combinedPerPanelIncrement: +COMBINED_INCREMENT.toFixed(9), // pi (route A)
    routeBSlackFraction: +(1 - INCREMENT_B / INCREMENT_A).toFixed(6), // 0.25 (route B is 25% under the cap)
    safetyFactor: SAFETY,
    perPanelIncrementSafe: +INCREMENT_SAFE.toFixed(9), // pi/2
    envelopeDensitySafePerUnitHeight: +RHO_ENV_SAFE.toFixed(6), // ~8.56
  },
  panelCountOnDR: {
    window: 'imp-35757 representative unit window Delta = h = 1',
    borderline: ENVELOPE_COUNT, // {longEach:5, shortEach:9, total:28}
    reproducesImp35757Total: ENVELOPE_COUNT.total === 28,
    routeBAloneWouldGive: ROUTE_B_COUNT, // {longEach:4, shortEach:7, total:22} -- strictly fewer
    withSafetyFactor2: ENVELOPE_COUNT_SAFE, // {longEach:9, shortEach:18, total:54}
    note:
      'The envelope (route A) count is 28 around the closed unit-window rectangle, exactly the imp-35757 figure; ' +
      'the route-B proxy alone asks for only 22, strictly fewer, so the single combined estimate collapses onto ' +
      'route A -- route B is never the binding (tighter) proxy. Long edges parallel to the line, short edges length 2h.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / MEASUREMENT (frontier-direction, NOT rigorous). The two imp-35727 I2 winding proxies, once put on ' +
    'a common per-unit-height axis by the imp-35993/imp-36008 mean-gap map (lambda = 2/w), are route A (imp-35757 ' +
    'along-line RS rate w ~13.446 rad/unit height, rho_A = w/pi ~4.28 panels/unit) and route B (imp-36008 J_geo=1 ' +
    'density 3/2 per unit model arclength -> 3w/4 ~10.084 rad/unit height, rho_B = 3w/(4pi) ~3.21 panels/unit), ' +
    'differing by the residual rho_A/rho_B = 4/3 EXACTLY. Because the I2 cap |Delta arg f| < pi is a CEILING, the ' +
    'single combined budget both proxies satisfy uses the ENVELOPE density max(rho_A, rho_B) = rho_A = w/pi, i.e. ' +
    'the borderline panel width delta = pi/w: over one such panel route A books exactly pi (binding) while route B ' +
    'books only 3pi/4 (25% under the cap), so route A ALONE sets the combined per-panel increment (pi), and a safety ' +
    'factor s=2 drops it to pi/2 < pi while doubling the density to ~8.56 panels/unit. On dR at T_PT for the ' +
    'imp-35757 representative unit window (Delta=h=1) the envelope gives ~5 panels per long edge, ~9 per short edge ' +
    '(length 2h), ~28 around the closed rectangle at the borderline (~54 at s=2) -- REPRODUCING the imp-35757 count ' +
    'as the combined envelope; route B alone would ask for only ~22, strictly fewer, confirming route A is the ' +
    'binding proxy and the single estimate collapses onto it. The 4/3 separation and hence the route-A-binds verdict ' +
    'hold only under the mean-gap closure lambda = 2/w (imp-36008: any other theta->height map rescales it). BOTH ' +
    'inputs remain PROXIES: route B lives on the off-axis model cusp rho = |x|^{-1/2}, NOT the true H_t = A + B - C ' +
    'on dR, and route A is the SMOOTH mean rate (a certified cap needs an interval UPPER bound on the LOCAL rate, ' +
    'per imp-35777 L_panel < pi delta / B with delta the I3 floor). Instantiates no interval enclosure; certifies no ' +
    'cap; counts no true zeros; fixes no Delta or h; changes no bound; I2 stays GREENFIELD; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36008 (J_geo=1, density 3/2 per unit model arclength, lambda=2/w); imp-35993 (per-unit-height ' +
    'reconciliation, residual 4/3); imp-35757 (route A ~13.45 rad/unit height, ~4.28 panels, ~28 around the unit ' +
    'window); imp-35777 (certifiable cap form L_panel < pi delta / B, I2<->I3 coupling); imp-35727 (I1-I5 ' +
    'enumerated, all GREENFIELD); Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021.',
};

export const IMP36059_I2_COMBINED_PANEL_COUNT_ENVELOPE_ASSERTIONS = [
  {
    // The two reconciled per-unit-height densities differ by exactly 4/3 (imp-35993/imp-36008 signature).
    id: 'imp36059-densities-reconciled-four-thirds',
    description: 'rho_A = w/pi ~4.28 and rho_B = 3w/(4pi) ~3.21 differ by exactly 4/3 on the shared per-unit-height axis',
    holds: () =>
      Math.abs(RHO_A - W_A / Math.PI) < 1e-15 &&
      Math.abs(RHO_B - (3 * W_A) / 4 / Math.PI) < 1e-15 &&
      Math.abs(RESIDUAL - 4 / 3) < 1e-12,
  },
  {
    // The envelope density is the larger proxy (route A), with the borderline width = the mean gap.
    id: 'imp36059-envelope-is-route-a',
    description: 'The combining ceiling picks rho_env = max(rho_A, rho_B) = rho_A, borderline panel width delta = pi/w',
    holds: () =>
      Math.abs(RHO_ENV - RHO_A) < 1e-15 &&
      RHO_ENV >= RHO_B &&
      Math.abs(DELTA_PANEL_ENV - DELTA_GAP) < 1e-12,
  },
  {
    // Over one envelope panel route A books pi (binding) and route B only 3pi/4 (25% under the cap).
    id: 'imp36059-single-increment-is-pi-route-a-binds',
    description: 'Combined per-panel increment = pi from route A; route B books 3pi/4 (0.25 slack); safety s=2 gives pi/2 < pi',
    holds: () =>
      Math.abs(INCREMENT_A - Math.PI) < 1e-12 &&
      Math.abs(INCREMENT_B - (3 * Math.PI) / 4) < 1e-12 &&
      Math.abs(COMBINED_INCREMENT - Math.PI) < 1e-12 &&
      Math.abs(INCREMENT_SAFE - Math.PI / 2) < 1e-12 &&
      INCREMENT_SAFE < Math.PI,
  },
  {
    // The single I2 panel count on dR reproduces the imp-35757 ~28 for the unit window; route B alone is fewer.
    id: 'imp36059-panel-count-reproduces-imp35757',
    description: 'Envelope count on dR = {5 long, 9 short, 28 total} (= imp-35757); route B alone = 22 (< 28); s=2 -> 54',
    holds: () =>
      ENVELOPE_COUNT.longEach === 5 &&
      ENVELOPE_COUNT.shortEach === 9 &&
      ENVELOPE_COUNT.total === 28 &&
      ROUTE_B_COUNT.total === 22 &&
      ROUTE_B_COUNT.total < ENVELOPE_COUNT.total &&
      ENVELOPE_COUNT_SAFE.total === 54,
  },
  {
    // The "route A binds" verdict (rho_A > rho_B, ratio 4/3) is T-independent a decade either side of T_PT.
    id: 'imp36059-route-a-binds-t-independent',
    description: 'rho_A > rho_B with ratio 4/3 at T = 3e11, 3e12, 3e13 (route A binds independent of T)',
    holds: () => bindsRouteAAt(3e11) && bindsRouteAAt(3e12) && bindsRouteAAt(3e13),
  },
  {
    // Honesty gate: envelope is only a WAY to combine proxies; both inputs are proxies; no cert; no refereed bound is changed.
    id: 'imp36059-honesty-gate-no-qed',
    description: 'Measurement only; combines two PROXIES via the envelope; certifies no cap; I2 GREENFIELD; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36059_I2_COMBINED_PANEL_COUNT_ENVELOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      /BOTH .*remain PROXIES/.test(IMP36059_I2_COMBINED_PANEL_COUNT_ENVELOPE.verdict) &&
      /only under the mean-gap closure/.test(IMP36059_I2_COMBINED_PANEL_COUNT_ENVELOPE.verdict) &&
      /certifies no .*cap/.test(IMP36059_I2_COMBINED_PANEL_COUNT_ENVELOPE.verdict) &&
      /I2 stays GREENFIELD/.test(IMP36059_I2_COMBINED_PANEL_COUNT_ENVELOPE.verdict) &&
      /NO QED/.test(IMP36059_I2_COMBINED_PANEL_COUNT_ENVELOPE.verdict) &&
      /refereed bound is changed/i.test(IMP36059_I2_COMBINED_PANEL_COUNT_ENVELOPE.verdict),
  },
];

for (const a of IMP36059_I2_COMBINED_PANEL_COUNT_ENVELOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36059-i2-combined-panel-count-envelope assertion failed: ${a.id}`);
  }
}
