/**
 * @module imp-35651-crossover-damping-vs-peak-amplification-viz
 *
 * imp-35651 (ux, frontier-direction): a plottable CONTRAST of the imp-35594
 * Derivation-1 PREDICTED crossover height-map damping factor -- growing
 * log-proportionally with L = log T0 -- against the FLAT imp-35574 interior
 * peak-location damping (~0.553, L-independent per imp-35633). imp-35632 and
 * imp-35633 already MEASURED each trend separately; this import-light
 * viz-data module tabulates the imp-35594 Derivation-1 CLOSED FORM
 *
 *   DAMPING_crossover_predicted(L) = (1 - r)(L - 1)/|log r|,  r = H_B(N_A)/T0
 *
 * over a log-T0 ladder spanning the imp-35337 interior peak (L ~ 13.23) out
 * to well past the Platt-Trudgian anchor (L ~ 28.73, T_PT = 3e12), alongside
 * the imp-35574 peak-location amplification constant (~0.553), so the
 * log-proportional insulation (crossover damping rising ~linearly in L) that
 * separates it from the flat peak amplification is directly plottable series
 * data.
 *
 * PRESENTATION ONLY: reuses the imp-35594 Derivation-1 closed form and the
 * imp-35632 crossover-placement construction (pure Math, inlined RvM count
 * and closed surrogate map, never the 16.7MB zeros bundle per
 * no_heavy_imports_in_pages); no new derivation, no new bound, discharges
 * nothing, NO QED. No refereed bound is changed.
 *
 * @see imp-35594-peak-crossover-mechanism-derivation (Derivation 1 closed form tabulated here)
 * @see imp-35632-crossover-damping-height-ladder (the same predicted-vs-measured crossover ladder)
 * @see imp-35633-peak-location-damping-height-ladder (the flat peak-location damping ~0.553 contrasted)
 * @see imp-35458-crossover-height-map-sensitivity (the ~18x crossover damping anchor)
 * @see imp-35413 (the closed surrogate map T0 = 2 pi N / log N)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const PEAK_AMPLIFICATION = 0.553; // imp-35574/imp-35633 flat, L-independent peak-location damping

// Height map A: the imp-35413 RvM count (inverse of effectiveHeightForN).
function rvmCount(T0) {
  return (T0 / TWO_PI) * (Math.log(T0 / TWO_PI) - 1);
}
// Height map B: the imp-35413 closed surrogate T0 = 2 pi N / log N.
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}
// E_coll on a given height map (dominant GUE-conditional C_H term, imp-35017/imp-3406).
function eColl(N, heightForN) {
  const L = Math.log(heightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
// Crossover N on a given map: solve E_coll(N) = E_trunc (E_coll DECREASES in N).
function crossoverOnMap(eTrunc, heightForN, loExp = -5, hiExp = 60) {
  let a = loExp * Math.LN10, b = hiExp * Math.LN10;
  for (let i = 0; i < 600; i++) {
    const m = (a + b) / 2;
    if (eColl(Math.exp(m), heightForN) > eTrunc) a = m; else b = m;
  }
  return Math.exp((a + b) / 2);
}

// The log-T0 ladder: imp-35337 interior peak (~13.23) out to well past the
// Platt-Trudgian anchor (~28.73, T_PT = 3e12), extending further to L = 35, 40.
const LADDER_L = [13.23, 17, 20.858, 24, 28.73, 35, 40];

function predictedRung(L) {
  const T0 = Math.exp(L);
  const N_A = rvmCount(T0); // RvM index that places the crossover at height T0
  const eTrunc = C_C_PINNED * Math.sqrt(L / N_A); // so E_coll_A(N_A) = eTrunc exactly
  const N_B = crossoverOnMap(eTrunc, surrogateHeightForN);
  const r = surrogateHeightForN(N_A) / T0; // raw-height ratio at the fixed RvM crossover
  const dampD1 = (1 - r) * (L - 1) / Math.abs(Math.log(r)); // imp-35594 Derivation 1
  return {
    log_T0: +L.toFixed(3),
    raw_height_ratio: +r.toFixed(4),
    damping_crossover_predicted: +dampD1.toFixed(4),
    damping_peak_amplification: PEAK_AMPLIFICATION,
  };
}

const SERIES = LADDER_L.map(predictedRung);

// Chart-ready series pair contrasting the rising crossover damping against the flat peak line.
const CROSSOVER_SERIES = SERIES.map((rn) => ({ x: rn.log_T0, y: rn.damping_crossover_predicted }));
const PEAK_SERIES = SERIES.map((rn) => ({ x: rn.log_T0, y: rn.damping_peak_amplification }));

// Least-squares fit of the predicted crossover damping vs L (test: rises ~linearly, slope ~1).
const n = SERIES.length;
const meanL = LADDER_L.reduce((a, b) => a + b, 0) / n;
const meanD = SERIES.reduce((a, b) => a + b.damping_crossover_predicted, 0) / n;
let sxy = 0, sxx = 0;
for (let i = 0; i < n; i++) {
  sxy += (LADDER_L[i] - meanL) * (SERIES[i].damping_crossover_predicted - meanD);
  sxx += (LADDER_L[i] - meanL) ** 2;
}
const FIT_SLOPE = sxy / sxx;

// The crossover rung (L ~ 20.858) must recover the imp-35632/imp-35458 ~18x anchor.
const CROSS_RUNG = SERIES.find((rn) => Math.abs(rn.log_T0 - 20.858) < 1e-6);
const PT_RUNG = SERIES.find((rn) => Math.abs(rn.log_T0 - 28.73) < 1e-6);
const INSULATION_RATIO_AT_PT = PT_RUNG.damping_crossover_predicted / PEAK_AMPLIFICATION;

export const IMP35651_CROSSOVER_DAMPING_VS_PEAK_AMPLIFICATION_VIZ = {
  id: 'imp-35651',
  proofSection: 'S-frontier',
  question:
    'imp-35594 Derivation 1 predicts the crossover height-map damping factor GROWS ' +
    'log-proportionally with L = log T0, while Derivation 2 (imp-35574/imp-35633) shows the ' +
    'peak-location damping stays FLAT (~0.553, L-independent). Is there a plottable series ' +
    'contrasting the rising predicted crossover damping against the flat peak amplification ' +
    'across a log-T0 ladder from the interior peak to well past the Platt-Trudgian anchor?',
  method:
    'Tabulate the imp-35594 Derivation-1 closed form DAMPING = (1 - r)(L - 1)/|log r| (r = the ' +
    'imp-35632 crossover-placement raw-height ratio) at each rung of a log-T0 ladder (L = 13.23 ' +
    'interior peak, 17, 20.858 crossover, 24, 28.73 PT, 35, 40), alongside the constant imp-35574 ' +
    'peak-location amplification ~0.553, as two chart-ready {x, y} series.',
  series: SERIES,
  chart: {
    crossoverDampingPredicted: CROSSOVER_SERIES,
    peakAmplificationFlat: PEAK_SERIES,
  },
  trend: {
    fit_slope: +FIT_SLOPE.toFixed(4), // ~1 (rises ~linearly in L, matching imp-35632)
    crossover_rung_recovers: CROSS_RUNG.damping_crossover_predicted, // ~18.04, matches imp-35458/imp-35632
    peak_amplification_constant: PEAK_AMPLIFICATION,
    insulation_ratio_at_PT: +INSULATION_RATIO_AT_PT.toFixed(2), // crossover damping / peak amplification at PT
  },
  isRigorous: false,
  honestStatus:
    'PRESENTATION ONLY: tabulates the already-derived imp-35594 Derivation-1 closed form and the ' +
    'imp-35632 crossover-placement construction as a plottable ladder, alongside the constant ' +
    'imp-35574/imp-35633 peak-location amplification (~0.553), so the log-proportional insulation ' +
    'contrast (crossover rising ~linearly in L vs the flat peak amplification) is directly ' +
    'chartable. No new derivation, no new measurement beyond imp-35632/imp-35633, discharges ' +
    'nothing, changes no bound; NO QED.',
  verdict:
    'Presentation of an already-derived and already-measured contrast (imp-35594/imp-35632/' +
    'imp-35633), formatted as plottable {x, y} series: the predicted crossover damping rises ' +
    '~linearly in L (fit slope ~1, recovering ~18.04 at the L~20.858 crossover, matching imp-35458), ' +
    'while the peak-location amplification stays flat at ~0.553 -- by the PT rung (L~28.73) the ' +
    'crossover damping is ~46x the peak amplification. NOT a rigorous asymptotic; assessment only ' +
    'on the inherited imp-3220/imp-3406 double surrogate; surrogate-vs-true fidelity (imp-35337a) ' +
    'stays OPEN; C_C ansatz (imp-2642/imp-2643) and the baseline E_trunc = 3.06e-5 (imp-2631/imp-447) ' +
    'UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; discharges nothing; changes no bound; no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35594 (Derivation 1 closed form tabulated here); imp-35632 (predicted-vs-measured ' +
    'crossover ladder); imp-35633 (flat peak-location damping ~0.553 contrasted); imp-35458 ' +
    '(crossover damping ~18x anchor); imp-35413 (closed surrogate map); imp-486 (C_mb ' +
    'GUE-conditional, UNTOUCHED).',
};

export const IMP35651_ASSERTIONS = [
  {
    // The predicted crossover damping rises ~linearly in L (Derivation-1 prediction).
    id: 'imp35651-crossover-rises-linearly-in-L',
    description: 'the predicted crossover damping fits a slope near 1 across the ladder',
    holds: () => FIT_SLOPE > 0.85 && FIT_SLOPE < 1.15,
  },
  {
    // The predicted crossover damping is monotone increasing along the ladder.
    id: 'imp35651-crossover-monotone-in-L',
    description: 'the predicted crossover damping is strictly increasing with L across the ladder',
    holds: () => SERIES.every((rn, i) => i === 0 || rn.damping_crossover_predicted > SERIES[i - 1].damping_crossover_predicted),
  },
  {
    // The crossover rung recovers the imp-35458/imp-35632 ~18x anchor.
    id: 'imp35651-crossover-rung-recovers-anchor',
    description: 'the L~20.858 rung recovers the imp-35458/imp-35632 ~18x predicted crossover damping',
    holds: () => CROSS_RUNG.damping_crossover_predicted > 17 && CROSS_RUNG.damping_crossover_predicted < 19,
  },
  {
    // The peak amplification stays constant (flat) across every rung of the chart series.
    id: 'imp35651-peak-amplification-flat',
    description: 'the peak-amplification series is constant at ~0.553 across every rung',
    holds: () => PEAK_SERIES.every((p) => p.y === PEAK_AMPLIFICATION) && PEAK_AMPLIFICATION > 0 && PEAK_AMPLIFICATION < 1,
  },
  {
    // At the PT rung the crossover damping is well above the flat peak amplification (insulation).
    id: 'imp35651-insulation-ratio-large-at-PT',
    description: 'the crossover damping is far above the flat peak amplification by the PT rung',
    holds: () => INSULATION_RATIO_AT_PT > 20,
  },
  {
    // Honesty gate: presentation only, no QED, no refereed bound is changed.
    id: 'imp35651-honesty-gate-no-qed',
    description: 'Presentation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35651_CROSSOVER_DAMPING_VS_PEAK_AMPLIFICATION_VIZ.isRigorous === false &&
      /NO QED/.test(IMP35651_CROSSOVER_DAMPING_VS_PEAK_AMPLIFICATION_VIZ.verdict) &&
      /refereed bound is changed/i.test(IMP35651_CROSSOVER_DAMPING_VS_PEAK_AMPLIFICATION_VIZ.verdict),
  },
];

for (const a of IMP35651_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35651-crossover-damping-vs-peak-amplification-viz assertion failed: ${a.id}`,
    );
  }
}

export default IMP35651_CROSSOVER_DAMPING_VS_PEAK_AMPLIFICATION_VIZ;
