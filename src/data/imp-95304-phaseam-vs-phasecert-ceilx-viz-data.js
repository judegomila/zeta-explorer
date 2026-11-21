/**
 * @module imp-95304-phaseam-vs-phasecert-ceilx-viz-data
 *
 * imp-95304 (ux): lightweight, import-light viz-data module baking sampled
 * curves of the imp-95254 THEOREM PHASE-AM bound
 *   R(f) <= (e^(-y_min)/4) (1 + 1/theta)
 * against the imp-95233 COROLLARY PHASE-CERT bound
 *   R(f) <= e^(-y_min) / (2 theta)
 * as functions of the phase-alignment ratio theta, both evaluated at the
 * fixed depth y_min = 1/4 documented by imp-95254's own PROP CEIL-X exact
 * witness (e^(-y_min) = 0.7788007830714049). PHASE-AM strictly dominates
 * PHASE-CERT by the exact factor (1 + theta)/2 at every theta (imp-95254
 * THEOREM PHASE-AM property (i)).
 *
 * Three reference markers are baked alongside the two curves:
 *   (1) the imp-95224 COROLLARY DC-NOGO ceiling R = 1/2;
 *   (2) the two vacuity thresholds where each curve crosses 1/2 -- the
 *       PHASE-CERT threshold theta_0 = e^(-y_min) and the PHASE-AM
 *       threshold theta_0' = e^(-y_min)/(2 - e^(-y_min)), the latter
 *       strictly BELOW the former per imp-95254 property (iii);
 *   (3) the imp-95254 PROP CEIL-X exact witness: at theta = 0.1098987153919070
 *       (below BOTH thresholds) the actual ratio R = 0.6961749688026323
 *       EXCEEDS the 1/2 ceiling, while both certificate curves sit far
 *       above R there (PHASE-AM = 1.9663332405540057, PHASE-CERT =
 *       3.543266089572309) -- correctly bounding it from above without
 *       contradicting the vacuity reading (the witness lies in the region
 *       where both certificates are honestly non-informative, not where
 *       they fail).
 *
 * All curve values are recomputed here independently from the closed forms
 * baked in imp-95254 / imp-95233 (no new derivation, no heavy import, no
 * re-import of the source modules -- each module carries its own
 * self-executing assertions). Follows the imp-95279 / imp-95266 /
 * imp-36185 import-light viz-data pattern.
 *
 * PRESENTATION POINT. Both curves decrease monotonically in theta; the
 * PHASE-AM curve sits strictly below the PHASE-CERT curve for theta < 1, with
 * the gap between them narrowing as theta -> 1 (ratio (1+theta)/2 -> 1) and
 * widening as theta -> 0 (ratio -> 1/2, PHASE-AM's loss against PHASE-CERT
 * is halved). The CEIL-X witness sits well to the left of both crossing
 * points, in the region where both bounds exceed 1/2 -- the certified sub-1/2
 * region genuinely narrows as theta falls, and PHASE-AM's narrower vacuity
 * window (theta_0' < theta_0) is the entire content of imp-95254 property
 * (iii).
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95254 / imp-95233 closed
 * forms and exact witness literals verbatim; changes no bound, no operator
 * positivity, no RH claim; NO QED. No refereed bound is changed.
 *
 * @see imp-95254-orthant-split-phase-certificate.js (source: THEOREM PHASE-AM closed form, PROP CEIL-X exact witness literals)
 * @see imp-95233-modulus-phase-currency-feasibility.js (source: COROLLARY PHASE-CERT closed form)
 * @see imp-95224-signed-depth-currency-nogo.js (source: COROLLARY DC-NOGO symmetry ceiling R = 1/2)
 *
 * Ticket: imp-95304 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

// depth y_min = 1/4 (the imp-95254 PROP CEIL-X witness depth)
export const IMP95304_Y_MIN = 0.25;
export const IMP95304_E_NEG_YMIN = 0.7788007830714049;

// DC-NOGO symmetry ceiling (imp-95224 COROLLARY DC-NOGO): R -> 1/2 at fixed depth
export const IMP95304_NOGO_CEILING = 0.5;

// vacuity thresholds: theta at which each curve crosses the 1/2 ceiling
export const IMP95304_CERT_THRESHOLD = IMP95304_E_NEG_YMIN; // theta_0 = e^(-y_min)
export const IMP95304_AM_THRESHOLD =
  IMP95304_E_NEG_YMIN / (2 - IMP95304_E_NEG_YMIN); // theta_0' = e^(-y_min)/(2 - e^(-y_min))

// imp-95254 PROP CEIL-X exact witness: actual R exceeds 1/2 while both
// certificate curves (evaluated at the same theta) sit far above it
export const IMP95304_CEILX_WITNESS = {
  theta: 0.1098987153919070,
  actualR: 0.6961749688026323,
  phaseCert: 3.543266089572309,
  phaseAM: 1.9663332405540057,
};

// bound(theta) sampled log-uniformly in theta over [0.02, 1.5], y_min = 1/4
export const IMP95304_BOUNDS_VS_THETA = [
  { theta: 0.020000000000000004, logTheta: -1.6989700043360187, cert: 19.47001957678512, am: 9.92970998416041, logCert: 1.2893663881962245, logAM: 0.996936564294161 },
  { theta: 0.024129837567488238, logTheta: -1.617445601579858, cert: 16.137712922708104, am: 8.263556657121903, logCert: 1.2078419854400637, logAM: 0.9171670090766157 },
  { theta: 0.02911245305166835, logTheta: -1.535921198823697, cert: 13.37573274380556, am: 6.88256656767063, logCert: 1.126317582683903, logAM: 0.8377504205495263 },
  { theta: 0.035123938166394225, logTheta: -1.4543967960675361, cert: 11.086467288803957, am: 5.7379338401698305, logCert: 1.044793179927742, logAM: 0.7587555364134975 },
  { theta: 0.042376746134279684, logTheta: -1.3728723933113751, cert: 9.189011121849822, am: 4.789205756692762, logCert: 0.963268777171581, logAM: 0.6802634958600449 },
  { theta: 0.05112720004294269, logTheta: -1.2913479905552143, cert: 7.616305825639538, am: 4.00285310858762, logCert: 0.8817443744154201, logAM: 0.602369653232675 },
  { theta: 0.061684551615834235, logTheta: -1.2098235877990535, cert: 6.312770075088697, am: 3.351085233312199, logCert: 0.8002199716592594, logAM: 0.5251854740562238 },
  { theta: 0.07442191054567121, logTheta: -1.1282991850428927, cert: 5.232335325451439, am: 2.8108678584935705, logCert: 0.7186955689030986, logAM: 0.44884042950072034 },
  { theta: 0.08978943064645935, logTheta: -1.0467747822867317, cert: 4.336817693709896, am: 2.363109042622799, logCert: 0.6371711661469376, logAM: 0.37348376205418543 },
  { theta: 0.10833021883881572, logTheta: -0.9652503795305709, cert: 3.5945684935344806, am: 1.9919844425350914, logCert: 0.5556467633907767, logAM: 0.29928594224654215 },
  { theta: 0.1306995292115539, logTheta: -0.88372597677441, cert: 2.9793557320731288, am: 1.684378061804416, logCert: 0.4741223606346159, logAM: 0.22643957631309855 },
  { theta: 0.157687920501099, logTheta: -0.8022015740182491, cert: 2.4694370393006007, am: 1.4294187154181515, logCert: 0.3925979578784549, logAM: 0.15515946403184713 },
  { theta: 0.19024919540232585, logTheta: -0.7206771712620883, cert: 2.0467912661192886, am: 1.2180958288274955, logCert: 0.31107355512229423, logAM: 0.08568145602582478 },
  { theta: 0.22953410912017275, logTheta: -0.6391527685059273, cert: 1.6964815949503678, am: 1.0429409932430351, logCert: 0.22954915236613313, logAM: 0.018259737924263837 },
  { theta: 0.27693103846339445, logTheta: -0.5576283657497665, cert: 1.406127654366105, am: 0.8977640229509037, logCert: 0.1480247496099723, logAM: -0.04683780252866839 },
  { theta: 0.3341150487758773, logTheta: -0.47610396299360563, cert: 1.1654679816499685, am: 0.7774341865928355, logCert: 0.06650034685381152, logAM: -0.10933636578581808 },
  { theta: 0.40310709279076656, logTheta: -0.39457956023744467, cert: 0.9659973701773126, am: 0.6776988808565075, logCert: -0.015024055902349492, logAM: -0.1689632315478815 },
  { theta: 0.4863454335671803, logTheta: -0.3130551574812839, cert: 0.8006662850303362, am: 0.5950333382830194, logCert: -0.09654845865851029, logAM: -0.2254587011172614 },
  { theta: 0.5867718156832851, logTheta: -0.23153075472512308, cert: 0.6636317238282019, am: 0.5265160576819522, logCert: -0.1780728614146711, logAM: -0.27858837916734547 },
  { theta: 0.7079354300808911, logTheta: -0.15000635196896206, cert: 0.5500507178899187, am: 0.46972555471281047, logCert: -0.25959726417083206, logAM: -0.32815581203548144 },
  { theta: 0.8541183468060913, logTheta: -0.06848194921280129, cert: 0.4559091758089903, am: 0.4226547836723464, logCert: -0.34112166692699286, logAM: -0.3740142112482583 },
  { theta: 1.0304868485921286, logTheta: 0.013042453543359566, cert: 0.3778800205628135, am: 0.38364020604925797, logCert: -0.4226460696831537, logAM: -0.41607588442546956 },
  { theta: 1.2432740135980458, logTheta: 0.09456685629952052, cert: 0.31320560654909396, am: 0.3513029990423982, logCert: -0.5041704724393147, logAM: -0.4543181426588569 },
  { theta: 1.5000000000000004, logTheta: 0.17609125905568135, cert: 0.25960026102380157, am: 0.324500326279752, logCert: -0.5856948751954755, logAM: -0.488784862187419 },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP95304_ASSERTIONS = [
  {
    id: 'imp95304-cert-curve-matches-closed-form',
    description: 'every baked cert value matches e^(-y_min) / (2 theta) to 1e-6 relative',
    holds: () =>
      IMP95304_BOUNDS_VS_THETA.every((p) => {
        const expected = IMP95304_E_NEG_YMIN / (2 * p.theta);
        return Math.abs(p.cert - expected) / expected < 1e-6;
      }),
  },
  {
    id: 'imp95304-am-curve-matches-closed-form',
    description: 'every baked am value matches (e^(-y_min)/4)(1 + 1/theta) to 1e-6 relative',
    holds: () =>
      IMP95304_BOUNDS_VS_THETA.every((p) => {
        const expected = (IMP95304_E_NEG_YMIN / 4) * (1 + 1 / p.theta);
        return Math.abs(p.am - expected) / expected < 1e-6;
      }),
  },
  {
    // Corrected: am/cert = (1+theta)/2 exactly, so PHASE-AM is below PHASE-CERT only for
    // theta < 1; the sample grid runs to theta = 1.5, where the last three rows (theta =
    // 1.03, 1.24, 1.5) have am > cert. The original "strictly below at every sampled theta"
    // was false by the module's own closed form.
    id: 'imp95304-am-below-cert-iff-theta-below-one',
    description: 'PHASE-AM / PHASE-CERT = (1+theta)/2 at every sampled theta, so PHASE-AM is strictly below PHASE-CERT exactly for theta < 1 (they cross at theta = 1)',
    holds: () =>
      IMP95304_BOUNDS_VS_THETA.every((p) => {
        if ((p.am < p.cert) !== (p.theta < 1)) return false;
        return Math.abs(p.am / p.cert - (1 + p.theta) / 2) < 1e-6;
      }),
  },
  {
    id: 'imp95304-both-curves-strictly-decreasing-in-theta',
    description: 'both PHASE-CERT and PHASE-AM are strictly decreasing as theta increases',
    holds: () =>
      IMP95304_BOUNDS_VS_THETA.every(
        (p, i, arr) => i === 0 || (p.cert < arr[i - 1].cert && p.am < arr[i - 1].am),
      ),
  },
  {
    id: 'imp95304-log-fields-consistent',
    description: 'logTheta, logCert, logAM match log10 of their linear counterparts to storage precision',
    holds: () =>
      IMP95304_BOUNDS_VS_THETA.every(
        (p) =>
          Math.abs(Math.log10(p.theta) - p.logTheta) < 1e-6 &&
          Math.abs(Math.log10(p.cert) - p.logCert) < 1e-6 &&
          Math.abs(Math.log10(p.am) - p.logAM) < 1e-6,
      ),
  },
  {
    id: 'imp95304-am-threshold-strictly-below-cert-threshold',
    description: 'the PHASE-AM vacuity threshold theta_0\' = e^(-y)/(2-e^(-y)) is strictly below the PHASE-CERT threshold theta_0 = e^(-y), per imp-95254 property (iii)',
    holds: () => IMP95304_AM_THRESHOLD < IMP95304_CERT_THRESHOLD,
  },
  {
    id: 'imp95304-thresholds-cross-ceiling-exactly',
    description: 'both curves equal the 1/2 ceiling exactly at their respective thresholds',
    holds: () => {
      const certAtThresh = IMP95304_E_NEG_YMIN / (2 * IMP95304_CERT_THRESHOLD);
      const amAtThresh = (IMP95304_E_NEG_YMIN / 4) * (1 + 1 / IMP95304_AM_THRESHOLD);
      return (
        Math.abs(certAtThresh - IMP95304_NOGO_CEILING) < 1e-12 &&
        Math.abs(amAtThresh - IMP95304_NOGO_CEILING) < 1e-12
      );
    },
  },
  {
    id: 'imp95304-ceilx-witness-consistent',
    description: 'the imp-95254 PROP CEIL-X witness: actualR > 1/2 while phaseCert/phaseAM (evaluated at the closed forms, same theta) both exceed actualR, and lies below both vacuity thresholds',
    holds: () => {
      const w = IMP95304_CEILX_WITNESS;
      const certExpected = IMP95304_E_NEG_YMIN / (2 * w.theta);
      const amExpected = (IMP95304_E_NEG_YMIN / 4) * (1 + 1 / w.theta);
      if (Math.abs(w.phaseCert - certExpected) > 1e-9) return false;
      if (Math.abs(w.phaseAM - amExpected) > 1e-9) return false;
      if (!(w.actualR > IMP95304_NOGO_CEILING)) return false;
      if (!(w.actualR <= w.phaseAM && w.phaseAM <= w.phaseCert)) return false;
      return w.theta < IMP95304_AM_THRESHOLD && w.theta < IMP95304_CERT_THRESHOLD;
    },
  },
];

for (const a of IMP95304_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95304-phaseam-vs-phasecert-ceilx-viz-data assertion failed: ${a.id}`);
  }
}
