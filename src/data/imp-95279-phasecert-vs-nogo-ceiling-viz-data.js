/**
 * @module imp-95279-phasecert-vs-nogo-ceiling-viz-data
 *
 * imp-95279 (ux): lightweight, import-light viz-data module baking a sampled
 * curve of the imp-95233 COROLLARY PHASE-CERT bound
 *   R(f) <= e^(-y_min) / (2 theta)
 * against the phase-alignment ratio theta, at the fixed depth y_min = 2 ln 2
 * documented by imp-95233's own exact witness assertion
 * (imp95233-phasecert-exact-witness-and-poscone, where e^(-y_min) = 1/4).
 * Two horizontal/vertical reference lines are baked alongside the curve:
 *   (1) the imp-95224 COROLLARY DC-NOGO symmetry ceiling R = 1/2, the fixed
 *       depth-only bound that signed co-centered families saturate;
 *   (2) the PHASE-CERT vacuity threshold theta_0 = e^(-y_min) = 1/4, the
 *       exact theta at which the curve crosses the ceiling (bound(theta_0)
 *       = e^(-y_min)/(2 theta_0) = 1/2 identically for any y_min).
 * The two documented imp-95233 exact witnesses sit ON this curve and are
 * baked as markers: the signed witness c = (3,-4) at theta = 1/33 (bound =
 * 33/8 = 4.125, WELL ABOVE the ceiling -- the crude/vacuous regime), and the
 * positive-cone envelope c = (3,4) at theta = 1 (bound = 1/8, at which
 * PHASE-CERT reduces to imp-95222 FA-2 with no slack).
 *
 * All curve values are recomputed here independently from the closed form
 * bound(theta) = e^(-y_min)/(2 theta) baked in imp-95233 (no new derivation,
 * no heavy import, no re-import of the source module -- each module carries
 * its own self-executing assertions). Follows the imp-95266 / imp-36185
 * import-light viz-data pattern.
 *
 * PRESENTATION POINT. The curve is monotonically decreasing in theta: for
 * theta below the vacuity threshold e^(-y_min) the PHASE-CERT bound sits
 * ABOVE the DC-NOGO ceiling 1/2 (useless -- this is where the imp-95224
 * depth-saturating witnesses live, per imp-95266), while for theta above
 * the threshold the bound drops BELOW 1/2, escaping the depth-only no-go
 * exactly as imp-95233's COROLLARY PHASE-CERT states.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95233 closed form and
 * exact witness/poscone literals verbatim; changes no bound, no operator
 * positivity, no RH claim; NO QED. No refereed bound is changed.
 *
 * @see imp-95233-modulus-phase-currency-feasibility.js (source: COROLLARY PHASE-CERT closed form, exact witness/poscone literals)
 * @see imp-95224-signed-depth-currency-nogo.js (source: COROLLARY DC-NOGO symmetry ceiling R = 1/2)
 *
 * Ticket: imp-95279 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

// depth y_min = 2 ln 2 (the imp-95233 exact witness depth); e^(-y_min) = 1/4 exactly
export const IMP95279_E_NEG_YMIN = 0.25;

// DC-NOGO symmetry ceiling (imp-95224 COROLLARY DC-NOGO): R -> 1/2 at fixed depth
export const IMP95279_NOGO_CEILING = 0.5;

// PHASE-CERT vacuity threshold theta_0 = e^(-y_min): bound(theta_0) = 1/2 exactly
export const IMP95279_VACUITY_THETA = IMP95279_E_NEG_YMIN;

// the two imp-95233 exact witnesses, both lying on the curve bound = e^(-y_min)/(2 theta)
export const IMP95279_SIGNED_WITNESS = { theta: 1 / 33, bound: 4.125, label: 'signed witness c=(3,-4)' };
export const IMP95279_POSCONE_WITNESS = { theta: 1, bound: 0.125, label: 'positive-cone c=(3,4) = FA-2' };

// bound(theta) = e^(-y_min) / (2 theta), sampled log-uniformly in theta over [0.02, 1.5]
export const IMP95279_BOUND_VS_THETA = [
  { theta: 0.02, logTheta: -1.69897, bound: 6.25, logBound: 0.79588002 },
  { theta: 0.023941841, logTheta: -1.62084245, bound: 5.2209852, logBound: 0.71775246 },
  { theta: 0.028660588, logTheta: -1.5427149, bound: 4.3613899, logBound: 0.63962491 },
  { theta: 0.034309363, logTheta: -1.46458735, bound: 3.6433203, logBound: 0.56149736 },
  { theta: 0.041071466, logTheta: -1.38645979, bound: 3.0434755, logBound: 0.48336981 },
  { theta: 0.049166326, logTheta: -1.30833224, bound: 2.5423905, logBound: 0.40524225 },
  { theta: 0.058856619, logTheta: -1.23020469, bound: 2.1238053, logBound: 0.3271147 },
  { theta: 0.070456792, logTheta: -1.15207714, bound: 1.774137, logBound: 0.24898715 },
  { theta: 0.084343267, logTheta: -1.07394958, bound: 1.4820389, logBound: 0.1708596 },
  { theta: 0.10096666, logTheta: -0.99582203, bound: 1.2380325, logBound: 0.09273204 },
  { theta: 0.12086638, logTheta: -0.91769448, bound: 1.0341999, logBound: 0.01460449 },
  { theta: 0.14468819, logTheta: -0.83956693, bound: 0.86392678, logBound: -0.06352306 },
  { theta: 0.17320508, logTheta: -0.76143937, bound: 0.72168784, logBound: -0.14165061 },
  { theta: 0.20734243, logTheta: -0.68331182, bound: 0.60286745, logBound: -0.21977817 },
  { theta: 0.24820798, logTheta: -0.60518427, bound: 0.50360992, logBound: -0.29790572 },
  { theta: 0.2971278, logTheta: -0.52705671, bound: 0.4206944, logBound: -0.37603327 },
  { theta: 0.35568933, logTheta: -0.44892916, bound: 0.35143028, logBound: -0.45416082 },
  { theta: 0.42579288, logTheta: -0.37080161, bound: 0.29356997, logBound: -0.53228838 },
  { theta: 0.50971327, logTheta: -0.29267406, bound: 0.24523591, logBound: -0.61041593 },
  { theta: 0.61017372, logTheta: -0.2145465, bound: 0.20485969, logBound: -0.68854348 },
  { theta: 0.73043411, logTheta: -0.13641895, bound: 0.17113111, logBound: -0.76667104 },
  { theta: 0.87439688, logTheta: -0.0582914, bound: 0.14295568, logBound: -0.84479859 },
  { theta: 1.0467336, logTheta: 0.01983615, bound: 0.11941912, logBound: -0.92292614 },
  { theta: 1.2530365, logTheta: 0.09796371, bound: 0.099757672, logBound: -1.00105369 },
  { theta: 1.5, logTheta: 0.17609126, bound: 0.083333333, logBound: -1.07918125 },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP95279_ASSERTIONS = [
  {
    id: 'imp95279-curve-matches-closed-form',
    description: 'every baked (theta, bound) pair matches bound = e^(-y_min) / (2 theta) to 1e-6 relative',
    holds: () =>
      IMP95279_BOUND_VS_THETA.every((p) => {
        const expected = IMP95279_E_NEG_YMIN / (2 * p.theta);
        return Math.abs(p.bound - expected) / expected < 1e-6;
      }),
  },
  {
    id: 'imp95279-curve-strictly-decreasing-in-theta',
    description: 'the PHASE-CERT bound is strictly decreasing as theta increases (bound = e^(-y_min)/(2 theta) is a strictly decreasing function of theta)',
    holds: () =>
      IMP95279_BOUND_VS_THETA.every((p, i, arr) => i === 0 || p.bound < arr[i - 1].bound),
  },
  {
    id: 'imp95279-log-fields-consistent',
    description: 'logTheta and logBound match log10 of their linear counterparts to storage precision',
    holds: () =>
      IMP95279_BOUND_VS_THETA.every(
        (p) =>
          Math.abs(Math.log10(p.theta) - p.logTheta) < 1e-6 &&
          Math.abs(Math.log10(p.bound) - p.logBound) < 1e-6,
      ),
  },
  {
    id: 'imp95279-vacuity-threshold-crosses-ceiling-exactly',
    description: 'bound(theta_0) = e^(-y_min) / (2 theta_0) = 1/2 exactly at theta_0 = e^(-y_min): the vacuity threshold is precisely where the curve crosses the DC-NOGO ceiling',
    holds: () =>
      Math.abs(IMP95279_E_NEG_YMIN / (2 * IMP95279_VACUITY_THETA) - IMP95279_NOGO_CEILING) < 1e-12,
  },
  {
    id: 'imp95279-witnesses-lie-on-curve',
    description: 'both imp-95233 exact witnesses (signed c=(3,-4) at theta=1/33, poscone c=(3,4) at theta=1) satisfy bound = e^(-y_min)/(2 theta) exactly',
    holds: () => {
      const s = IMP95279_SIGNED_WITNESS;
      const p = IMP95279_POSCONE_WITNESS;
      const sExpected = IMP95279_E_NEG_YMIN / (2 * s.theta);
      const pExpected = IMP95279_E_NEG_YMIN / (2 * p.theta);
      return Math.abs(s.bound - sExpected) < 1e-9 && Math.abs(p.bound - pExpected) < 1e-12;
    },
  },
  {
    id: 'imp95279-signed-witness-above-ceiling-poscone-below',
    description: 'the signed witness (theta=1/33 < theta_0=1/4) sits above the 1/2 ceiling (vacuous), while the poscone witness (theta=1 > theta_0) sits below it (FA-2, escapes DC-NOGO)',
    holds: () =>
      IMP95279_SIGNED_WITNESS.theta < IMP95279_VACUITY_THETA &&
      IMP95279_SIGNED_WITNESS.bound > IMP95279_NOGO_CEILING &&
      IMP95279_POSCONE_WITNESS.theta > IMP95279_VACUITY_THETA &&
      IMP95279_POSCONE_WITNESS.bound < IMP95279_NOGO_CEILING,
  },
];

for (const a of IMP95279_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95279-phasecert-vs-nogo-ceiling-viz-data assertion failed: ${a.id}`);
  }
}
