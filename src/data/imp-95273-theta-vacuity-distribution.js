/**
 * @module imp-95273-theta-vacuity-distribution
 *
 * imp-95273 (numerical): MEASUREMENT ONLY. Tabulate where the imp-95233
 * phase-alignment currency theta(f) = integral_R f^2 / integral_R g^2 of a
 * SET of representative signed seam families sits relative to the vacuity
 * threshold theta_0 = e^(-y_min) below which imp-95233 COROLLARY PHASE-CERT
 *   R(f) <= (1/(2 theta)) e^(-y_min)
 * becomes vacuous (bound >= 1/2, no gain over the trivial symmetry ceiling).
 * imp-95233 HONEST LIMITS (a)/(b) flag that PHASE-CERT loses a full factor
 * 1/theta and is VACUOUS in the deep-cancellation regime theta < e^(-y_min)
 * "where the interesting signed seam families sit", but the theta
 * distribution across a family of configurations was never tabulated; the
 * only prior sampling (imp-95266) walks a SINGLE geometry -- the co-centered
 * SGN-SAT witness sequence phi_K at fixed y_min = 2. This module measures a
 * BROADER cross-section of geometries (co-centered deep-cancellation
 * witnesses AND well-separated mild-sign families) so the honest-partial gap
 * is quantified as a distribution rather than a single sequence.
 *
 * OBJECTS (imp-95221/95222/95233 packet model). Packets
 * f_n(s) = e^(-mu_n |s - u_n|), rates mu_n > 0, centers u_n > 0, REAL
 * amplitudes c_n; f = sum c_n f_n; positive-modulus envelope g = sum |c_n|
 * f_n; R = integral_(s<0) f^2 / integral_R f^2; y_min = min over pairs incl
 * diagonal of (mu_m + mu_n) min(u_m, u_n); theta = T(f)/T(g) in (0,1].
 *
 * THE VACUITY BOUNDARY. Since PHASE-CERT bound = e^(-y_min)/(2 theta), the
 * bound crosses 1/2 exactly at theta = e^(-y_min): the certificate is ACTIVE
 * (bound < 1/2, strictly beats the symmetry ceiling) iff theta > e^(-y_min),
 * and VACUOUS (bound >= 1/2) iff theta <= e^(-y_min). The natural distance
 * to the boundary is the ratio r = theta / e^(-y_min): r > 1 active, r < 1
 * vacuous, r = 1 the crossing. Tabulating r across families is exactly the
 * "how far into the vacuous regime" measurement the ticket asks for.
 *
 * WHAT THE DISTRIBUTION SHOWS. The deep-cancellation families the seam
 * actually produces -- co-centered witnesses with near-antipodal signs --
 * sit BELOW the boundary (r < 1, PHASE-CERT vacuous): the SGN-SAT sequence
 * (r = 0.435, 0.0096, 0.00018 at K = 1,2,3), the exact algebraic witness
 * c = (3,-4) at ln 2 (r = 0.121), the near-cancellation co-centered pair
 * (r = 0.252), and a non-co-centered signed triple (r = 0.277). Conversely,
 * MILD-sign / well-SEPARATED families sit ABOVE the boundary (r > 1,
 * PHASE-CERT active, bound < 1/2): a mildly-signed separated pair (r = 4.12,
 * bound 0.121) and deep-well separated families (r up to 2.1e4, bound
 * 2.4e-5). So the vacuity is not a defect of PHASE-CERT everywhere -- it is
 * confined to the deep-cancellation corner, and the honest-partial gap is
 * exactly the span of families with r < 1. This is a MEASUREMENT of the gap
 * imp-95233 flagged, not a sharpening of it: the 1/theta loss is unchanged.
 *
 * CROSS-CHECKS. The SGN-SAT phi_1 theta = 1/17, the algebraic witness
 * theta = 1/33 with R = 3/8 and bound 33/8, and the positive-envelope
 * relation R(f) <= R(g)/theta all reproduce the imp-95233 EXACT literals to
 * quadrature precision; PHASE-CERT (R <= bound) is verified to hold for
 * every family, active and vacuous alike.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses imp-95233 PHASE-CERT and the
 * imp-95224 witness family verbatim; changes NO bound, no operator
 * positivity, no RH claim; NO QED. No refereed bound is changed
 * . Import-light (no zeros bundle, no sibling imports); Simpson
 * quadrature is recomputed here, cross-checked against the imp-95233 exact
 * closed forms.
 *
 * @see imp-95233-modulus-phase-currency-feasibility.js (source: theta, PHASE-CERT, vacuity flag)
 * @see imp-95266-theta-vs-k-viz-data.js (prior single-geometry SGN-SAT sampling)
 * @see imp-95224-signed-depth-currency-nogo.js (source: SGN-SAT witness family)
 *
 * Ticket: imp-95273 (numerical, opus-4-8, medium). Measurement only; no bound touched; NO QED.
 */

// -- packet-model measurement helpers (Simpson quadrature; cross-checked) -----
function simpson(a, b, n, g) {
  const h = (b - a) / n;
  let S = g(a) + g(b);
  for (let i = 1; i < n; i++) S += g(a + i * h) * (i % 2 ? 4 : 2);
  return (S * h) / 3;
}
function makeF(mu, u, c) {
  return (s) => {
    let v = 0;
    for (let k = 0; k < c.length; k++) v += c[k] * Math.exp(-mu[k] * Math.abs(s - u[k]));
    return v;
  };
}
function yMinOf(mu, u) {
  let m = Infinity;
  for (let i = 0; i < mu.length; i++)
    for (let j = 0; j < mu.length; j++)
      m = Math.min(m, (mu[i] + mu[j]) * Math.min(u[i], u[j]));
  return m;
}
// returns the full per-family measurement bundle by quadrature
function measure(mu, u, c) {
  const f = makeF(mu, u, c);
  const g = makeF(mu, u, c.map(Math.abs));
  const W = simpson(-80, 0, 240000, (s) => f(s) ** 2);
  const T = W + simpson(0, 80, 240000, (s) => f(s) ** 2);
  const Wg = simpson(-80, 0, 240000, (s) => g(s) ** 2);
  const Tg = Wg + simpson(0, 80, 240000, (s) => g(s) ** 2);
  const theta = T / Tg;
  const y = yMinOf(mu, u);
  const thr = Math.exp(-y);
  const bound = thr / (2 * theta);
  return { R: W / T, Rg: Wg / Tg, theta, yMin: y, threshold: thr, ratio: theta / thr, bound };
}

// -- the representative signed seam families ---------------------------------
// class: "deep-cancellation" (co-centered / near-antipodal, seam-realistic)
//        vs "mild-separated" (small cancellation and/or well-separated centers)
const FAMILIES = [
  { key: 'sgnSatPhi1', label: 'SGN-SAT phi_1 co-centered delta=1', cls: 'deep-cancellation', mu: [1, 2], u: [1, 1], c: [1, -1] },
  { key: 'sgnSatPhi2', label: 'SGN-SAT phi_2 co-centered delta=1', cls: 'deep-cancellation', mu: [1, 1.5, 2], u: [1, 1, 1], c: [1, -2, 1] },
  { key: 'sgnSatPhi3', label: 'SGN-SAT phi_3 co-centered delta=1', cls: 'deep-cancellation', mu: [1, 4 / 3, 5 / 3, 2], u: [1, 1, 1, 1], c: [1, -3, 3, -1] },
  { key: 'algWitness34', label: 'algebraic witness c=(3,-4) at ln 2', cls: 'deep-cancellation', mu: [1, 2], u: [Math.log(2), Math.log(2)], c: [3, -4] },
  { key: 'signedTriple', label: 'signed triple c=(2,-3,1.5) non-co-centered', cls: 'deep-cancellation', mu: [1, 1.5, 2.3], u: [0.7, 1.2, 0.9], c: [2, -3, 1.5] },
  { key: 'nearCancel', label: 'near-cancel pair c=(4,-3.8) at delta=1.5', cls: 'deep-cancellation', mu: [1, 1.3], u: [1.5, 1.5], c: [4, -3.8] },
  { key: 'mildPair31', label: 'mild signed pair c=(3,-1) separated', cls: 'mild-separated', mu: [1, 1.2], u: [1.0, 2.5], c: [3, -1] },
  { key: 'mildPair51', label: 'mild signed pair c=(5,-1) separated', cls: 'mild-separated', mu: [1, 1.5], u: [1.2, 3.0], c: [5, -1] },
  { key: 'deepWell305', label: 'deep-well mild sign c=(3,-0.5) separated', cls: 'mild-separated', mu: [1.5, 1.5], u: [2.0, 4.0], c: [3, -0.5] },
  { key: 'deepWell41', label: 'deep-well mild sign c=(4,-1) separated', cls: 'mild-separated', mu: [2, 2], u: [2.5, 5.0], c: [4, -1] },
];

// -- baked distribution (recomputed by the assertions) -----------------------
// Each row: theta, y_min, threshold = e^(-y_min), ratio = theta/threshold,
// vacuous = theta <= threshold (bound >= 1/2), R, PHASE-CERT bound.
export const IMP95273_THETA_VACUITY_DISTRIBUTION = [
  { key: 'sgnSatPhi1', cls: 'deep-cancellation', theta: 5.882353e-2, yMin: 2, threshold: 1.353353e-1, ratio: 4.346504e-1, vacuous: true, R: 2.343310e-1, bound: 1.150350e0 },
  { key: 'sgnSatPhi2', cls: 'deep-cancellation', theta: 1.300390e-3, yMin: 2, threshold: 1.353353e-1, ratio: 9.608656e-3, vacuous: true, R: 4.181376e-1, bound: 5.203642e1 },
  { key: 'sgnSatPhi3', cls: 'deep-cancellation', theta: 2.487995e-5, yMin: 2, threshold: 1.353353e-1, ratio: 1.838394e-4, vacuous: true, R: 4.857405e-1, bound: 2.719766e3 },
  { key: 'algWitness34', cls: 'deep-cancellation', theta: 3.030303e-2, yMin: 1.386294e0, threshold: 2.500000e-1, ratio: 1.212121e-1, vacuous: true, R: 3.750000e-1, bound: 4.125000e0 },
  { key: 'signedTriple', cls: 'deep-cancellation', theta: 6.833790e-2, yMin: 1.4, threshold: 2.465970e-1, ratio: 2.771238e-1, vacuous: true, R: 1.368327e-1, bound: 1.804248e0 },
  { key: 'nearCancel', cls: 'deep-cancellation', theta: 1.256777e-2, yMin: 3, threshold: 4.978707e-2, ratio: 2.524305e-1, vacuous: true, R: 1.354157e-1, bound: 1.980743e0 },
  { key: 'mildPair31', cls: 'mild-separated', theta: 5.574321e-1, yMin: 2, threshold: 1.353353e-1, ratio: 4.118897e0, vacuous: false, R: 7.956903e-2, bound: 1.213917e-1 },
  { key: 'mildPair51', cls: 'mild-separated', theta: 7.974768e-1, yMin: 2.4, threshold: 9.071795e-2, ratio: 8.790727e0, vacuous: false, R: 4.920494e-2, bound: 5.687812e-2 },
  { key: 'deepWell305', cls: 'mild-separated', theta: 8.786599e-1, yMin: 6, threshold: 2.478752e-3, ratio: 3.544767e2, vacuous: false, R: 1.267838e-3, bound: 1.410530e-3 },
  { key: 'deepWell41', cls: 'mild-separated', theta: 9.626608e-1, yMin: 10, threshold: 4.539993e-5, ratio: 2.120401e4, vacuous: false, R: 2.170570e-5, bound: 2.358044e-5 },
];

// -- distribution summary ----------------------------------------------------
export const IMP95273_SUMMARY = {
  ticket:
    'imp-95273: measured theta(f) distribution of representative signed seam families against the imp-95233 PHASE-CERT vacuity threshold theta_0 = e^(-y_min); the boundary bound = 1/2 is crossed exactly at theta = e^(-y_min), i.e. ratio r = theta/e^(-y_min) = 1.',
  familiesMeasured: 10,
  vacuousCount: 6,
  activeCount: 4,
  ratioMinVacuous: 1.838394e-4, // deepest into the vacuous regime (SGN-SAT phi_3)
  ratioMaxActive: 2.120401e4, // furthest into the active regime (deep-well separated)
  finding:
    'the deep-cancellation families the seam actually produces (co-centered / near-antipodal signs) all sit BELOW the boundary (r < 1, PHASE-CERT VACUOUS), while mild-sign and well-separated families sit ABOVE it (r > 1, bound < 1/2, PHASE-CERT ACTIVE). The honest-partial gap imp-95233 flagged is thus confined to the deep-cancellation corner, quantified here as the span of families with r < 1; PHASE-CERT (R <= bound) is verified to HOLD for every family, active and vacuous alike. Measurement only; the 1/theta loss is unchanged; NO bound touched; NO QED; no refereed bound is changed.',
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) ------
const REL = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b));

export const IMP95273_ASSERTIONS = [
  {
    id: 'imp95273-baked-matches-quadrature',
    description:
      'every baked row (theta, y_min, threshold, ratio, R, bound) reproduces an independent Simpson quadrature of the packet family to storage precision (rel 2e-3; theta/R sharp-peak quadrature limited)',
    holds: () =>
      FAMILIES.every((F) => {
        const m = measure(F.mu, F.u, F.c);
        const row = IMP95273_THETA_VACUITY_DISTRIBUTION.find((r) => r.key === F.key);
        return (
          REL(m.theta, row.theta) < 2e-3 &&
          REL(m.yMin, row.yMin) < 1e-5 &&
          REL(m.threshold, row.threshold) < 1e-5 &&
          REL(m.ratio, row.ratio) < 2e-3 &&
          REL(m.R, row.R) < 3e-3 &&
          REL(m.bound, row.bound) < 2e-3
        );
      }),
  },
  {
    id: 'imp95273-theta-in-unit-interval',
    description: 'every measured theta lies in (0, 1] -- theta = 1 on the positive cone, theta -> 0 under deep cancellation',
    holds: () => IMP95273_THETA_VACUITY_DISTRIBUTION.every((r) => r.theta > 0 && r.theta <= 1 + 1e-9),
  },
  {
    id: 'imp95273-vacuity-boundary-equivalence',
    description:
      'the vacuity flag is the boundary theta = e^(-y_min): for every family, vacuous <=> ratio < 1 <=> bound >= 1/2 (the PHASE-CERT bound crosses 1/2 exactly at theta = e^(-y_min))',
    holds: () =>
      IMP95273_THETA_VACUITY_DISTRIBUTION.every((r) => {
        const byRatio = r.ratio < 1;
        const byBound = r.bound >= 0.5;
        return r.vacuous === byRatio && r.vacuous === byBound;
      }),
  },
  {
    id: 'imp95273-phasecert-holds-everywhere',
    description: 'COROLLARY PHASE-CERT R <= e^(-y_min)/(2 theta) holds for EVERY family, vacuous and active alike (a valid upper bound throughout, merely loose when vacuous)',
    holds: () => IMP95273_THETA_VACUITY_DISTRIBUTION.every((r) => r.R <= r.bound + 1e-9),
  },
  {
    id: 'imp95273-active-families-beat-half',
    description: 'every ACTIVE family (r > 1) has PHASE-CERT bound < 1/2 AND measured R < 1/2 -- the certificate strictly beats the symmetry ceiling there',
    holds: () =>
      IMP95273_THETA_VACUITY_DISTRIBUTION.filter((r) => !r.vacuous).every(
        (r) => r.bound < 0.5 && r.R < 0.5 && r.ratio > 1,
      ),
  },
  {
    id: 'imp95273-deep-cancellation-all-vacuous',
    description: 'every deep-cancellation family (co-centered / near-antipodal signs, the regime the seam actually produces) sits in the VACUOUS corner r < 1 -- the honest-partial gap imp-95233 flagged, now quantified as a span',
    holds: () =>
      IMP95273_THETA_VACUITY_DISTRIBUTION.filter((r) => r.cls === 'deep-cancellation').every(
        (r) => r.vacuous && r.ratio < 1,
      ),
  },
  {
    id: 'imp95273-mild-separated-all-active',
    description: 'every mild-separated family sits in the ACTIVE region r > 1 -- vacuity is confined to the deep-cancellation corner, not a defect of PHASE-CERT everywhere',
    holds: () =>
      IMP95273_THETA_VACUITY_DISTRIBUTION.filter((r) => r.cls === 'mild-separated').every(
        (r) => !r.vacuous && r.ratio > 1,
      ),
  },
  {
    id: 'imp95273-crosschecks-imp95233-exact-literals',
    description:
      'the SGN-SAT phi_1 theta = 1/17 and the algebraic witness c=(3,-4) at ln 2 (theta = 1/33, R = 3/8, bound = 33/8) reproduce the imp-95233 EXACT literals to quadrature precision (1e-4)',
    holds: () => {
      const p1 = IMP95273_THETA_VACUITY_DISTRIBUTION.find((r) => r.key === 'sgnSatPhi1');
      const aw = IMP95273_THETA_VACUITY_DISTRIBUTION.find((r) => r.key === 'algWitness34');
      return (
        Math.abs(p1.theta - 1 / 17) < 1e-4 &&
        Math.abs(aw.theta - 1 / 33) < 1e-4 &&
        Math.abs(aw.R - 3 / 8) < 1e-4 &&
        Math.abs(aw.bound - 33 / 8) < 1e-3 &&
        Math.abs(aw.threshold - 0.25) < 1e-9
      );
    },
  },
  {
    id: 'imp95273-summary-consistent',
    description: 'the summary counts and extremal ratios match the tabulated distribution and carry the honest measurement-only framing',
    holds: () => {
      const vac = IMP95273_THETA_VACUITY_DISTRIBUTION.filter((r) => r.vacuous);
      const act = IMP95273_THETA_VACUITY_DISTRIBUTION.filter((r) => !r.vacuous);
      const minVac = Math.min(...vac.map((r) => r.ratio));
      const maxAct = Math.max(...act.map((r) => r.ratio));
      return (
        IMP95273_SUMMARY.familiesMeasured === IMP95273_THETA_VACUITY_DISTRIBUTION.length &&
        IMP95273_SUMMARY.vacuousCount === vac.length &&
        IMP95273_SUMMARY.activeCount === act.length &&
        Math.abs(IMP95273_SUMMARY.ratioMinVacuous - minVac) < 1e-9 &&
        Math.abs(IMP95273_SUMMARY.ratioMaxActive - maxAct) < 1e-3 &&
        /NO QED/.test(IMP95273_SUMMARY.finding) &&
        /refereed bound is changed/i.test(IMP95273_SUMMARY.finding) &&
        /Measurement only/.test(IMP95273_SUMMARY.finding)
      );
    },
  },
];

for (const a of IMP95273_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95273-theta-vacuity-distribution assertion failed: ${a.id}`);
  }
}

export default IMP95273_THETA_VACUITY_DISTRIBUTION;
