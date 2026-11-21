/**
 * @module imp-36226-clustered-vs-default-depth-scaling-viz-data
 *
 * imp-36226 (ux, medium, S-frontier): import-light viz-data module (baked
 * literals only, NO 16.7MB zeros-bundle import) contrasting the imp-36132
 * densified CLUSTERED-order depth-scaling exponent (~0.532) against the
 * imp-36081 densified DEFAULT-order exponent (~0.748 -> 0.753), both fit on
 * the identical 37-shape pairing-tree family (depth 12..4099). Bakes each
 * fit's OLS slope, nominal 95% confidence interval, and R^2, plus the
 * candidate-law constrained-RSS ratios (flat/sqrt/linear) from imp-36132,
 * so a chart can show the clustered exponent sitting near the sqrt (0.5)
 * reference line while the default exponent sits nearer -- but still below
 * -- the linear (1.0) reference line.
 *
 * Literals reused verbatim from:
 *   - src/data/imp-36132-w1-pairwise-slack-depth-clustered-densified-fit.js (fit.clusteredDensified, candidateLawRss)
 *   - src/data/imp-36081-w1-pairwise-slack-depth-densified-fit.js (fit.densified)
 * No re-derivation, no new computation.
 *
 * Presentation only: closes nothing, discharges no gap, changes no bound;
 * C_mb stays GUE-conditional (imp-486); NO QED; no refereed bound is changed.
 *
 * @see imp-36132-w1-pairwise-slack-depth-clustered-densified-fit.js (clustered exponent ~0.532, source)
 * @see imp-36081-w1-pairwise-slack-depth-densified-fit.js (default exponent ~0.753, source)
 * @see imp-36084-w1-pairwise-slack-depth-clustered-order-refit.js (seven-point clustered baseline ~0.417)
 *
 * Ticket: imp-36226 (ux, medium). Presentation only, RH-free; NO QED.
 */

export const IMP36226_EXPONENT_COMPARISON = [
  {
    key: 'clustered',
    label: 'Clustered order (imp-36132)',
    color: '#38bdf8',
    exponent: 0.5324372410420958,
    ci95: [0.331340681054466, 0.7335338010297255],
    r2: 0.4348476921534049,
    n: 37,
    sevenPointBaseline: 0.416502511399952,
  },
  {
    key: 'default',
    label: 'Default order (imp-36081)',
    color: '#f87171',
    exponent: 0.7532428928348355,
    ci95: [0.5571821525270537, 0.9493036331426172],
    r2: 0.6183303337343529,
    n: 37,
    sevenPointBaseline: 0.747787546318812,
  },
];

export const IMP36226_REFERENCE_LAWS = [
  { key: 'flat', label: 'flat (m=0)', exponent: 0 },
  { key: 'sqrt', label: 'sqrt (m=0.5)', exponent: 0.5 },
  { key: 'linear', label: 'linear (m=1)', exponent: 1 },
];

// Constrained-slope RSS ratios (to the free-fit minimum) at each candidate law,
// clustered-order only (imp-36132 candidateLawRss); default order was not
// re-adjudicated against these laws by imp-36081.
export const IMP36226_CLUSTERED_CANDIDATE_LAW_RSS_RATIO = {
  flat: 1.7694345154677134,
  sqrt: 1.0028557660843476,
  linear: 1.593355046770522,
};

export const IMP36226_FINDING = {
  clusteredSqrtConsistent:
    'the clustered 95% CI [0.331, 0.734] CONTAINS 0.5 and its constrained-RSS at m=0.5 is ' +
    '~1.003x the free minimum, essentially indistinguishable from the best fit',
  clusteredLinearInconsistent:
    'the clustered 95% CI upper bound 0.734 EXCLUDES 1.0, and the constrained-RSS at m=1 is ' +
    '~1.59x the free minimum',
  defaultStaysHigherAndSubLinear:
    'the default-order 95% CI [0.557, 0.949] sits entirely ABOVE the clustered interval and ' +
    'EXCLUDES 0.5, but its upper bound 0.949 also stays (narrowly) below the linear value 1.0',
  clusteredOrderFlattensRelativeToDefault:
    'the clustered order flattens the depth-scaling exponent (~0.532) well below the ' +
    'default-order exponent (~0.753) on the identical 37-shape family -- it does not steepen it',
};
