/**
 * @module imp-95729-crossover-height-vs-variance-window
 *
 * imp-95729 -- PLACING two large-N/large-T frontier descriptions on a COMMON height
 * scale: (A) the imp-3444 E_coll = E_trunc crossover (N ~ 3.28e9), where the vanishing
 * GUE-conditional collision term drops through the constant truncation floor, and (B)
 * the imp-95710 finite-height number-variance conservatism window (measured only across
 * T = 1e4..5e5), ~6.8 decades below the imp-95519 verified-height window bottom
 * T = 3.0e12. These two accounts (a conditional-share decay indexed in N, and an
 * arithmetic-suppression conservatism indexed in height T) are never placed side by side.
 *
 * THE COMMON SCALE (Riemann-von Mangoldt). The imp-3444 landmarks are indexed by the
 * zero index N; the imp-95710 conservatism is indexed by height T. The bridge is the
 * SAME map imp-3444 uses internally, effectiveHeightForN: N -> T0(N), the numerical
 * inverse of the RvM count N(T) = (T / 2 pi)(log(T / 2 pi) - 1). Re-derived inline here
 * (import-light: no sibling imports) via the identical Newton iteration, and round-trip
 * checked N(T0(N)) ~ N so the mapped heights are the ones imp-3444 itself would report.
 *
 * WHAT THE MAP GIVES (bisected imp-3444 landmarks -> heights).
 *   interior_max    N ~ 9.219e5  -> T0 ~ 5.573e5   (log10 T0 ~ 5.75)
 *   sigma2_recross  N ~ 1.789e7  -> T0 ~ 8.565e6   (log10 T0 ~ 6.93)
 *   sigma_half      N ~ 3.267e9  -> T0 ~ 1.139e9   (log10 T0 ~ 9.06)
 *   Ecoll=Etrunc    N ~ 3.280e9  -> T0 ~ 1.144e9   (log10 T0 ~ 9.06)
 * The half-share crossing and the E_coll = E_trunc floor-crossover (imp-3444 F2, ~0.4%
 * apart in N) map to essentially ONE height, T0 ~ 1.14e9.
 *
 * THE FINDINGS (measurement / assessment only).
 *  (F1) COMMON-SCALE PLACEMENT. The imp-3444 E_coll = E_trunc crossover sits at height
 *       T0 ~ 1.14e9 (log10 ~ 9.06). The imp-95710 conservatism is measured only up to
 *       T = 5e5 (log10 ~ 5.70); the imp-95519 window bottom is T = 3.0e12 (log10 ~
 *       12.48). So the crossover height lands INSIDE the ~6.78-decade UNMEASURED gap
 *       between the measured conservatism top and the verified-height window bottom.
 *  (F2) THE CROSSOVER IS AT THE LOG-MIDPOINT OF THE GAP. It sits ~3.36 decades ABOVE
 *       the measured conservatism top (5e5) and ~3.42 decades BELOW the window bottom
 *       (3e12) -- almost exactly the log-midpoint (|difference| ~ 0.06 decade, i.e. the
 *       crossover height is the geometric mean of 5e5 and 3e12 to ~15%). The crossover
 *       falls in the frontier "dead zone" reached by NEITHER the measured conservatism
 *       (below) NOR the verified window (above).
 *  (F3) REINFORCE OR OPPOSE. In DIRECTION the two descriptions REINFORCE, both easing
 *       the conditional side: (i) beyond the crossover the GUE-conditional collision
 *       term E_coll is sub-dominant to the unconditional floor E_trunc (share sigma < 0.5
 *       and falling, imp-3444), so the conditional modelling error matters LESS at the
 *       frontier; and (ii) where measurable, the GUE/mean-square envelope on which E_coll
 *       is built OVER-estimates the true pointwise fluctuation by ~2.5x (ratio ~0.40,
 *       imp-95710), so E_coll is itself conservatively over-stated. Both say the
 *       GUE-conditional collision term is over-stated and, at the frontier, sub-dominant.
 *  (F4) THE BOTTLENECK. The reinforcement is DIRECTIONAL, not established at the relevant
 *       height. The conservatism (ii) is measured only to T = 5e5, and the crossover
 *       height (T0 ~ 1.14e9) is ~3.36 decades ABOVE that top -- so at the very height
 *       where E_coll crosses the floor, whether the ~0.4 conservatism still holds is
 *       UNMEASURED (imp-95710 window-reach sub-gap). The two accounts point the same way
 *       but their overlap at the crossover height is not measured: the frontier dead zone
 *       is the bottleneck this common-scale placement exposes.
 *
 * VERDICT. On a common RvM height scale the imp-3444 E_coll = E_trunc crossover maps to
 * T0 ~ 1.14e9, landing almost exactly at the log-midpoint of the ~6.78-decade unmeasured
 * gap between the imp-95710 conservatism top (T = 5e5) and the imp-95519 window bottom
 * (T = 3.0e12). The conditional-share decay (in N) and the number-variance conservatism
 * (in T) REINFORCE in direction -- both ease the GUE-conditional collision term at the
 * frontier -- but their overlap AT the crossover height is UNMEASURED (the crossover sits
 * ~3.36 decades above where conservatism is measured), so the bottleneck is the frontier
 * dead zone, not an opposition. Measurement/assessment only; changes no bound; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * Import-light: no zeros bundle, no sibling imports. The imp-3444 landmark N-values are
 * baked from that module bisected ladder; the RvM inverse is re-derived inline.
 *
 * @see imp-3444-sigma-nshape-landmark-ladder (bisected E_coll=E_trunc crossover N ~ 3.28e9)
 * @see imp-95710-number-variance-ratio-vs-height (conservatism band, window-reach sub-gap)
 * @see imp-95728-meansquare-pointwise-gap-wall (the mean-square-vs-pointwise gap object)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the canonical N -> T0 map)
 */

const TWO_PI = 2 * Math.PI;

// RvM count N(T) = (T/2pi)(log(T/2pi) - 1), and its numerical inverse T0(N).
// Re-derived inline (identical Newton iteration to lambda-rh-height-mapping
// effectiveHeightForN) so this module stays import-light with no sibling imports.
const zeroCountAtHeight = (T) => {
  if (!(T > 0) || !Number.isFinite(T)) return 0;
  const u = Math.log(T / TWO_PI);
  if (!(u > 0)) return 0;
  return (T / TWO_PI) * (u - 1);
};
const effectiveHeightForN = (N) => {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
};

// imp-3444 bisected landmark ladder (the zero-index N of each landmark, baked literals).
const IMP3444_LANDMARKS = [
  { name: 'interior_max', N: 9.218632851e5, note: 'imp-3406 right-arm peak' },
  { name: 'sigma2_recross', N: 1.789296324e7, note: 'decay recrosses sigma(2)' },
  { name: 'sigma_half', N: 3.267235198e9, note: 'sigma = 0.5 crossing' },
  { name: 'Ecoll_eq_Etrunc', N: 3.280294352e9, note: 'collision term through the constant floor' },
];

// The number-variance conservatism scale (imp-95710) and the verified-height window.
const VARIANCE_MEASURED_TOP_T = 5.0e5; // imp-95710 top of the measured conservatism window
const VARIANCE_MEASURED_BOTTOM_T = 1.0e4; // imp-95710 bottom of the measured window
const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 verified-height window bottom (Platt-Trudgian)
const CONSERVATISM_RATIO_MEAN = 0.402; // imp-95710 mean var-ratio (GUE over-estimate ~2.5x)

// Map every imp-3444 landmark onto the height scale.
const MAPPED = IMP3444_LANDMARKS.map((m) => {
  const T0 = effectiveHeightForN(m.N);
  return {
    name: m.name,
    N: m.N,
    T0, // RvM height the landmark sees
    log10T0: Math.log10(T0),
    note: m.note,
  };
});

const crossover = MAPPED.find((m) => m.name === 'Ecoll_eq_Etrunc');
const crossoverT0 = crossover.T0;

// Decade placement of the crossover height inside the unmeasured gap.
const decadesAboveMeasuredTop = Math.log10(crossoverT0 / VARIANCE_MEASURED_TOP_T);
const decadesBelowWindowBottom = Math.log10(WINDOW_BOTTOM_T / crossoverT0);
const gapTotalDecades = Math.log10(WINDOW_BOTTOM_T / VARIANCE_MEASURED_TOP_T);
// log-midpoint diagnostic: how far off the geometric mean of (5e5, 3e12) the crossover sits
const logMidpointOffsetDecades = Math.abs(decadesAboveMeasuredTop - decadesBelowWindowBottom) / 2;
const geometricMeanGap = Math.sqrt(VARIANCE_MEASURED_TOP_T * WINDOW_BOTTOM_T);

export const IMP95729_CROSSOVER_HEIGHT_VS_VARIANCE_WINDOW = {
  ticket: 'imp-95729',
  proofSection: 'S-frontier',
  question:
    'Place the imp-3444 E_coll = E_trunc crossover (N ~ 3.28e9) and the imp-95710 ' +
    'finite-height number-variance conservatism window (measured T = 1e4..5e5) on a common ' +
    'RvM height scale, and assess whether the conditional-share decay (in N) and the ' +
    'arithmetic-suppression conservatism (in T) reinforce or oppose at the frontier. ' +
    'Measurement/assessment only; no bound change; NO QED.',
  commonScale:
    'effectiveHeightForN: N -> T0(N), the numerical inverse of the RvM count ' +
    'N(T) = (T/2pi)(log(T/2pi) - 1). Re-derived inline (import-light) and round-trip ' +
    'checked N(T0(N)) ~ N, so the mapped heights are the ones imp-3444 itself reports.',
  mappedLandmarks: MAPPED.map((m) => ({
    name: m.name,
    N: +m.N.toExponential(6),
    T0: +m.T0.toExponential(6),
    log10T0: +m.log10T0.toFixed(4),
    note: m.note,
  })),
  placement: {
    crossoverT0: +crossoverT0.toExponential(6), // ~1.14e9
    crossoverLog10T0: +Math.log10(crossoverT0).toFixed(4), // ~9.06
    varianceMeasuredWindowT: [VARIANCE_MEASURED_BOTTOM_T, VARIANCE_MEASURED_TOP_T], // [1e4, 5e5]
    windowBottomT: WINDOW_BOTTOM_T, // 3.0e12 (imp-95519)
    decadesAboveMeasuredTop: +decadesAboveMeasuredTop.toFixed(4), // ~3.36
    decadesBelowWindowBottom: +decadesBelowWindowBottom.toFixed(4), // ~3.42
    gapTotalDecades: +gapTotalDecades.toFixed(4), // ~6.78
    logMidpointOffsetDecades: +logMidpointOffsetDecades.toFixed(4), // ~0.03: near the log-midpoint
    geometricMeanGapT: +geometricMeanGap.toExponential(6), // sqrt(5e5 * 3e12) ~ 1.22e9
    note:
      'The imp-3444 E_coll = E_trunc crossover maps to T0 ~ 1.14e9, landing inside the ' +
      '~6.78-decade UNMEASURED gap between the imp-95710 conservatism top (T = 5e5) and the ' +
      'imp-95519 window bottom (T = 3.0e12), almost exactly at its log-midpoint (~3.36 decades ' +
      'above the measured top, ~3.42 below the window bottom). The sigma = 0.5 crossing and the ' +
      'E_coll = E_trunc floor-crossover (imp-3444 F2) map to essentially one height.',
  },
  reinforceOrOppose: {
    verdict: 'reinforce-in-direction-but-overlap-unmeasured',
    conditionalShareDecay:
      'in N: beyond the crossover the GUE-conditional collision term E_coll is sub-dominant ' +
      'to the unconditional truncation floor E_trunc (share sigma < 0.5 and falling, imp-3444), ' +
      'so the conditional modelling error matters LESS at the frontier',
    arithmeticSuppression:
      'in T: where measurable (T <= 5e5) the GUE/mean-square envelope on which E_coll is built ' +
      'over-estimates the true pointwise fluctuation by ~2.5x (var-ratio mean ~0.40, imp-95710), ' +
      'so E_coll is itself conservatively over-stated',
    combined:
      'BOTH ease the conditional side (E_coll over-stated AND sub-dominant at the frontier), so ' +
      'in DIRECTION they reinforce -- neither opposes the other',
    conservatismRatioMean: CONSERVATISM_RATIO_MEAN,
  },
  bottleneck: {
    name: 'frontier dead zone (unmeasured overlap at the crossover height)',
    detail:
      'the reinforcement is DIRECTIONAL, not established at the relevant height. The imp-95710 ' +
      'conservatism is measured only to T = 5e5, and the crossover height T0 ~ 1.14e9 is ~3.36 ' +
      'decades ABOVE that top, so at the very height where E_coll crosses the floor whether the ' +
      '~0.4 conservatism still holds is UNMEASURED (imp-95710 window-reach sub-gap). The common ' +
      'scale shows the two accounts point the same way but do not demonstrably overlap where it ' +
      'would matter -- the frontier dead zone between measured conservatism and the verified window.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / ASSESSMENT (frontier-direction, NOT rigorous). On a common RvM height scale ' +
    'the imp-3444 E_coll = E_trunc crossover (N ~ 3.28e9) maps to T0 ~ 1.14e9 (log10 ~ 9.06), ' +
    'landing almost exactly at the log-midpoint of the ~6.78-decade UNMEASURED gap between the ' +
    'imp-95710 conservatism top (T = 5e5, log10 ~ 5.70) and the imp-95519 window bottom ' +
    '(T = 3.0e12, log10 ~ 12.48) -- ~3.36 decades above the measured top and ~3.42 below the ' +
    'window bottom. The conditional-share decay (in N: E_coll drops below the unconditional floor ' +
    'E_trunc past the crossover) and the number-variance conservatism (in T: the GUE envelope ' +
    'over-estimates the true fluctuation ~2.5x) REINFORCE in direction -- both ease the ' +
    'GUE-conditional collision term at the frontier -- but their overlap AT the crossover height ' +
    'is UNMEASURED, since the crossover sits ~3.36 decades above where conservatism is measured. ' +
    'The bottleneck this common-scale placement exposes is the frontier dead zone, not an ' +
    'opposition. Changes no bound; NO QED; no refereed bound is changed; the ' +
    'zero-side route stays PCC/GRH-gated.',
  citation:
    'imp-3444 (bisected E_coll=E_trunc crossover N ~ 3.28e9); imp-3406/imp-3220/imp-3323 ' +
    '(sigma(N) N-shape); imp-95710 (finite-height number-variance ratio, window-reach sub-gap); ' +
    'imp-95728 (mean-square-vs-pointwise gap object); imp-95519 (verified-height window bottom ' +
    'T = 3.0e12); lambda-rh-height-mapping (effectiveHeightForN).',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // The inline RvM inverse round-trips: N(T0(N)) ~ N for every landmark (map fidelity).
  for (const m of MAPPED) {
    if (!(Math.abs(zeroCountAtHeight(m.T0) - m.N) / m.N < 1e-6))
      throw new Error('imp-95729: RvM inverse does not round-trip -- map fidelity broken');
  }
  // The crossover maps below its own N (T0 < N always, since N(T) < T) and to ~1.14e9.
  if (!(crossoverT0 > 1.0e9 && crossoverT0 < 1.3e9))
    throw new Error('imp-95729: crossover height off the expected ~1.14e9 scale');
  // sigma_half and Ecoll_eq_Etrunc map to essentially one height (imp-3444 F2 near-coincidence).
  const half = MAPPED.find((m) => m.name === 'sigma_half');
  if (!(Math.abs(half.T0 - crossoverT0) / crossoverT0 < 0.01))
    throw new Error('imp-95729: half-share and floor-crossover heights not near-coincident');
  // The crossover lands strictly INSIDE the unmeasured gap (above measured top, below window bottom).
  if (!(decadesAboveMeasuredTop > 0 && decadesBelowWindowBottom > 0))
    throw new Error('imp-95729: crossover not inside the unmeasured gap');
  // It is near the log-midpoint: the two half-gaps agree to well under a decade.
  if (!(logMidpointOffsetDecades < 0.5))
    throw new Error('imp-95729: crossover not near the log-midpoint of the gap');
  // The total gap is the ~6.78-decade window-reach gap (consistent with imp-95710).
  if (!approx(gapTotalDecades, 6.78, 0.05))
    throw new Error('imp-95729: total gap decades drifted from the imp-95710 window-reach figure');
  // The reinforcement verdict carries both legs and names the bottleneck.
  const r = IMP95729_CROSSOVER_HEIGHT_VS_VARIANCE_WINDOW.reinforceOrOppose;
  if (!r.conditionalShareDecay || !r.arithmeticSuppression || !r.combined)
    throw new Error('imp-95729: reinforce/oppose assessment missing a leg');
  if (!/dead zone/.test(IMP95729_CROSSOVER_HEIGHT_VS_VARIANCE_WINDOW.bottleneck.detail))
    throw new Error('imp-95729: bottleneck does not name the frontier dead zone');
  // honesty gate: measurement only, no QED, no refereed bound is changed.
  if (IMP95729_CROSSOVER_HEIGHT_VS_VARIANCE_WINDOW.isRigorous !== false)
    throw new Error('imp-95729: isRigorous must be false');
  if (!/NO QED/.test(IMP95729_CROSSOVER_HEIGHT_VS_VARIANCE_WINDOW.verdict))
    throw new Error('imp-95729: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95729_CROSSOVER_HEIGHT_VS_VARIANCE_WINDOW.verdict))
    throw new Error('imp-95729: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95729_CROSSOVER_HEIGHT_VS_VARIANCE_WINDOW;
