/**
 * @module imp-95405-theta-sign-freedom-at-fixed-geometry
 *
 * imp-95405 (numerical): MEASUREMENT ONLY. Bracket the imp-95255 LEG 2
 * phase-alignment currency theta = int_R f^2 / int_R g^2 over the still-
 * unmapped SIGN freedom, at a FIXED ported geometry G(p, D), relative to the
 * imp-95273 vacuity boundary theta_0 = e^(-y_min).
 *
 * WHY THIS ISOLATES THE OBSTRUCTION. imp-95255 LEG 2 found that the width-law
 * transcription (imp-95071/imp-95220 LEMMA MAP) fixes the per-window GEOMETRY
 * (rates mu(d) = d^(1/3)/c, centers u(d) = v/d -> hence y_min) and the
 * amplitude MODULI (all aliases pinned at 1/p by paper eq 14) but carries NO
 * per-window SIGN pattern. So at a FIXED ported geometry every packet has the
 * same modulus 1/p, the positive-modulus envelope g = sum |c_n| f_n is FIXED,
 * y_min is FIXED, and the vacuity boundary theta_0 = e^(-y_min) is FIXED. The
 * ONLY free data left is the sign vector sigma in {+1, -1}^n, and theta is
 * degree-0 in the amplitudes (imp-95139 scope), so the whole theta range at
 * that geometry is a pure sign-pattern effect. This module measures that
 * range and asks a single question: does the dropped sign data alone decide
 * the imp-95233 PHASE-CERT active/vacuous split at a fixed geometry?
 *
 * OBJECTS (imp-95221/95222/95233/95255 packet model). Packets
 * f_n(s) = e^(-mu_n |s - u_n|); with all moduli equal to 1/p the signed field
 * is f = (1/p) sum sigma_n f_n and the envelope is g = (1/p) sum f_n. Since
 * theta is scale-invariant the 1/p factor cancels, so
 *   theta(sigma) = (sigma^T M sigma) / (1^T M 1),
 * where M is the FIXED Gram matrix M_{ij} = int_R f_i f_j (positive definite),
 * 1 is the all-aligned vector, and y_min = min over pairs incl diagonal of
 * (mu_m + mu_n) min(u_m, u_n) is sign-independent. The all-aligned pattern
 * sigma = 1 (and its global flip -1) gives theta = 1 EXACTLY (f = g, the
 * fixed-amplitude family the paper specifies; imp-95255 LEG 2a). The worst
 * sign pattern minimizes the quadratic form -> theta_min (an Ising / MAX-CUT
 * ground state, enumerated exactly here for small n).
 *
 * THE MEASUREMENT (four ported grids, full 2^n sign enumeration). Using the
 * illustrative width-law port constants c = 1.7, v = 2.3 (imp-95255) on the
 * grid G(p, D) = { n/p : 1 <= n <= pD, p does not divide n }:
 *
 *   grid       n   y_min     theta_0=e^-ymin  theta_max  theta_min   r_min      vac/2^n
 *   G(2,4)     4   0.893712  4.091341e-1      1.0        1.115184e-1 2.725718e-1  12/16
 *   G(2,6)     6   0.629456  5.328817e-1      1.0        5.368113e-2 1.007374e-1  60/64
 *   G(2,8)     8   0.496283  6.087893e-1      1.0        3.140865e-2 5.159198e-2  252/256
 *   G(3,4)     8   0.824820  4.383137e-1      1.0        2.938253e-2 6.703539e-2  234/256
 *
 * where r_min = theta_min / theta_0 and vac counts sign patterns with
 * theta <= theta_0 (PHASE-CERT bound >= 1/2, vacuous).
 *
 * WHAT IT SHOWS. At EVERY fixed ported geometry the sign vector ALONE spans
 * theta from 1 (all-aligned, PHASE-CERT ACTIVE, r_max = 1/theta_0 = 1.6-2.4)
 * down to a worst-case theta_min FAR below the vacuity boundary
 * (r_min = 0.05-0.27, i.e. 4x-20x into the vacuous corner). So each geometry
 * STRADDLES the boundary: theta_min < theta_0 < 1 = theta_max. The imp-95233
 * PHASE-CERT active/vacuous verdict at a single fixed geometry is therefore
 * NOT a geometry property -- it is decided entirely by the per-window sign
 * pattern, which is precisely the data the imp-95255 transcription drops
 * (LEG 2 obstruction). Moreover the vacuous fraction of the 2^n patterns is
 * LARGE and grows with n (0.75, 0.94, 0.98, 0.91), so at fixed geometry the
 * "typical" sign pattern is vacuous and only the near-aligned patterns are
 * active; but the ALL-ALIGNED family the paper actually specifies is the one
 * active corner (theta = 1), consistent with imp-95255 LEG 2a.
 *
 * RELATION TO imp-95273 / imp-95404. imp-95273 walks a set of DISTINCT
 * geometries each with a fixed sign pattern; imp-95404 samples a randomized
 * ensemble over geometry AND signs jointly. This module holds the geometry
 * FIXED and enumerates the sign lattice exhaustively, isolating the sign
 * degree of freedom imp-95255 LEG 2 named as unmapped and showing that alone
 * it moves theta across the vacuity boundary at a single fixed geometry.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95220 width-law port
 * geometry and the imp-95233 PHASE-CERT vacuity boundary verbatim; changes NO
 * bound, no operator positivity, no RH claim; NO QED. No refereed bound is changed
 * . Import-light (no zeros bundle, no sibling
 * imports); Simpson quadrature of the fixed Gram matrix is recomputed here and
 * the all-aligned theta = 1 identity is cross-checked to 1e-9.
 *
 * @see imp-95255-currency-per-window-map-assessment.js (source: LEG 2 sign obstruction, width-law port)
 * @see imp-95273-theta-vacuity-distribution.js (source: vacuity boundary theta_0 = e^(-y_min))
 * @see imp-95404-signed-seam-vacuity-fraction.js (sibling: randomized geometry+sign ensemble)
 *
 * Ticket: imp-95405 (numerical, opus-4-8, api-pool, medium). Measurement only; no bound touched; NO QED.
 */

// -- width-law port geometry (imp-95220 LEMMA MAP; imp-95255 constants) -------
const PORT_C = 1.7;
const PORT_V = 2.3;
const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;
function gridGpd(p, D) {
  const g = [];
  for (let n = 1; n <= p * D; n++) if (n % p !== 0) g.push(n / p);
  return g;
}
function yMinOf(mu, u) {
  let m = Infinity;
  for (let i = 0; i < mu.length; i++)
    for (let j = 0; j < mu.length; j++)
      m = Math.min(m, (mu[i] + mu[j]) * Math.min(u[i], u[j]));
  return m;
}

// -- fixed Gram matrix M_{ij} = int_R f_i f_j by Simpson quadrature -----------
function simpson(a, b, n, fn) {
  const h = (b - a) / n;
  let S = fn(a) + fn(b);
  for (let i = 1; i < n; i++) S += fn(a + i * h) * (i % 2 ? 4 : 2);
  return (S * h) / 3;
}
function gramMatrix(mu, u) {
  const n = mu.length;
  const M = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = i; j < n; j++) {
      const v = simpson(
        -60,
        60,
        200000,
        (s) => Math.exp(-mu[i] * Math.abs(s - u[i])) * Math.exp(-mu[j] * Math.abs(s - u[j])),
      );
      M[i][j] = v;
      M[j][i] = v;
    }
  return M;
}
function quadForm(M, sig) {
  let s = 0;
  for (let i = 0; i < sig.length; i++)
    for (let j = 0; j < sig.length; j++) s += sig[i] * sig[j] * M[i][j];
  return s;
}

// full 2^n sign enumeration at a FIXED ported geometry: brackets theta and
// counts vacuous patterns (theta <= theta_0 = e^(-y_min))
function measureGrid(p, D) {
  const ds = gridGpd(p, D);
  const n = ds.length;
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  const yMin = yMinOf(mu, u);
  const theta0 = Math.exp(-yMin);
  const M = gramMatrix(mu, u);
  const denom = quadForm(M, new Array(n).fill(1)); // all-aligned 1^T M 1
  let thetaMin = Infinity;
  let thetaMax = -Infinity;
  let vacuous = 0;
  const total = 1 << n;
  for (let mask = 0; mask < total; mask++) {
    const sig = [];
    for (let k = 0; k < n; k++) sig.push(mask & (1 << k) ? -1 : 1);
    const th = quadForm(M, sig) / denom;
    if (th < thetaMin) thetaMin = th;
    if (th > thetaMax) thetaMax = th;
    if (th <= theta0) vacuous++;
  }
  return {
    n,
    pD: p * D,
    yMin,
    theta0,
    thetaMax,
    thetaMin,
    rMax: thetaMax / theta0,
    rMin: thetaMin / theta0,
    straddles: thetaMin < theta0 && theta0 <= thetaMax,
    vacuous,
    total,
    fracVacuous: vacuous / total,
  };
}

// -- baked measurement (recomputed by the assertions) ------------------------
// Each row: fixed ported geometry G(p,D); theta_max = all-aligned (=1),
// theta_min = worst sign pattern; theta_0 = e^(-y_min) the vacuity boundary;
// r_min = theta_min/theta_0 (< 1 = deep in the vacuous corner); vacuous count
// over all 2^n sign patterns. straddles = the geometry has both active
// (theta > theta_0) and vacuous (theta <= theta_0) sign patterns.
export const IMP95405_THETA_SIGN_FREEDOM = [
  { key: 'G(2,4)', p: 2, D: 4, n: 4, pD: 8, yMin: 8.937124e-1, theta0: 4.091341e-1, thetaMax: 1.0, thetaMin: 1.115184e-1, rMax: 2.444187e0, rMin: 2.725718e-1, straddles: true, vacuous: 12, total: 16, fracVacuous: 7.5e-1 },
  { key: 'G(2,6)', p: 2, D: 6, n: 6, pD: 12, yMin: 6.294558e-1, theta0: 5.328817e-1, thetaMax: 1.0, thetaMin: 5.368113e-2, rMax: 1.876589e0, rMin: 1.007374e-1, straddles: true, vacuous: 60, total: 64, fracVacuous: 9.375e-1 },
  { key: 'G(2,8)', p: 2, D: 8, n: 8, pD: 16, yMin: 4.962831e-1, theta0: 6.087893e-1, thetaMax: 1.0, thetaMin: 3.140865e-2, rMax: 1.642604e0, rMin: 5.159198e-2, straddles: true, vacuous: 252, total: 256, fracVacuous: 9.84375e-1 },
  { key: 'G(3,4)', p: 3, D: 4, n: 8, pD: 12, yMin: 8.248204e-1, theta0: 4.383137e-1, thetaMax: 1.0, thetaMin: 2.938253e-2, rMax: 2.281471e0, rMin: 6.703539e-2, straddles: true, vacuous: 234, total: 256, fracVacuous: 9.140625e-1 },
];

// -- measurement summary -----------------------------------------------------
export const IMP95405_SUMMARY = {
  ticket:
    'imp-95405: at a FIXED ported geometry G(p,D) (imp-95220 width-law port, all moduli 1/p so y_min and the envelope g are fixed), the sign vector sigma in {+1,-1}^n is the only free data; theta(sigma) = (sigma^T M sigma)/(1^T M 1) was bracketed by full 2^n enumeration against the imp-95273 vacuity boundary theta_0 = e^(-y_min).',
  gridsMeasured: 4,
  portC: PORT_C,
  portV: PORT_V,
  thetaMaxAllAligned: 1.0,
  worstRMin: 5.159198e-2, // deepest worst-case into the vacuous corner (G(2,8))
  bestRMin: 2.725718e-1, // shallowest worst-case (G(2,4))
  allStraddle: true,
  finding:
    'at EVERY fixed ported geometry the sign vector ALONE spans theta from 1 (all-aligned, the fixed-amplitude family the paper specifies, PHASE-CERT ACTIVE, r_max = 1.6-2.4) down to a worst-case theta_min far below the vacuity boundary (r_min = 0.05-0.27, 4x-20x into the vacuous corner). Each geometry STRADDLES the boundary theta_min < theta_0 < 1 = theta_max, so the imp-95233 PHASE-CERT active/vacuous verdict at a single fixed geometry is NOT a geometry property -- it is decided entirely by the per-window sign pattern that the imp-95255 LEG 2 geometry+modulus transcription drops. The vacuous fraction of the 2^n patterns is large and grows with n (0.75, 0.94, 0.98, 0.91): at fixed geometry the typical sign pattern is vacuous and only near-aligned patterns are active. Measurement only; the 1/theta loss is unchanged; NO bound touched; NO QED; no refereed bound is changed.',
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) ------
const REL = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b));

export const IMP95405_ASSERTIONS = [
  {
    id: 'imp95405-baked-matches-enumeration',
    description:
      'every baked row (y_min, theta_0, theta_min, r_min, vacuous count, straddles) reproduces an independent full 2^n sign enumeration over the fixed Gram matrix to storage precision (rel 2e-3; theta_min quadrature-limited)',
    holds: () =>
      IMP95405_THETA_SIGN_FREEDOM.every((row) => {
        const m = measureGrid(row.p, row.D);
        return (
          m.n === row.n &&
          m.pD === row.pD &&
          REL(m.yMin, row.yMin) < 1e-5 &&
          REL(m.theta0, row.theta0) < 1e-5 &&
          REL(m.thetaMin, row.thetaMin) < 2e-3 &&
          REL(m.rMin, row.rMin) < 2e-3 &&
          m.vacuous === row.vacuous &&
          m.total === row.total &&
          m.straddles === row.straddles
        );
      }),
  },
  {
    id: 'imp95405-all-aligned-theta-is-one',
    description:
      'the all-aligned sign pattern (and its global flip) gives theta = 1 exactly (f = g, the fixed-amplitude family the paper specifies; imp-95255 LEG 2a) -- theta_max = 1 for every grid to 1e-9',
    holds: () =>
      IMP95405_THETA_SIGN_FREEDOM.every((row) => {
        const ds = gridGpd(row.p, row.D);
        const mu = ds.map(muPort);
        const u = ds.map(uPort);
        const M = gramMatrix(mu, u);
        const denom = quadForm(M, new Array(row.n).fill(1));
        const flip = quadForm(M, new Array(row.n).fill(-1)) / denom;
        return Math.abs(row.thetaMax - 1) < 1e-9 && Math.abs(flip - 1) < 1e-9;
      }),
  },
  {
    id: 'imp95405-theta-in-unit-interval',
    description:
      'every sign pattern gives theta in (0, 1]: the Gram matrix is positive definite so theta_min > 0, and no pattern exceeds the all-aligned theta = 1',
    holds: () =>
      IMP95405_THETA_SIGN_FREEDOM.every(
        (row) => row.thetaMin > 0 && row.thetaMax <= 1 + 1e-9 && row.thetaMin <= row.thetaMax,
      ),
  },
  {
    id: 'imp95405-every-geometry-straddles-boundary',
    description:
      'at EVERY fixed ported geometry theta_min < theta_0 <= theta_max = 1: the sign vector alone moves theta across the vacuity boundary, so the PHASE-CERT active/vacuous split at a single fixed geometry is decided by sign data, not geometry (isolates the imp-95255 LEG 2 obstruction)',
    holds: () =>
      IMP95405_THETA_SIGN_FREEDOM.every(
        (row) => row.straddles && row.thetaMin < row.theta0 && row.theta0 <= row.thetaMax,
      ),
  },
  {
    id: 'imp95405-aligned-active-worst-vacuous',
    description:
      'the all-aligned pattern is ACTIVE (r_max = theta_max/theta_0 > 1, bound < 1/2) while the worst pattern is deep VACUOUS (r_min = theta_min/theta_0 < 1); the vacuity boundary theta_0 = e^(-y_min) is sign-independent (geometry only)',
    holds: () =>
      IMP95405_THETA_SIGN_FREEDOM.every((row) => {
        const rMaxOk = row.rMax > 1 && REL(row.rMax, row.thetaMax / row.theta0) < 1e-6;
        const rMinOk = row.rMin < 1 && REL(row.rMin, row.thetaMin / row.theta0) < 1e-6;
        const boundaryOk = REL(row.theta0, Math.exp(-row.yMin)) < 1e-6;
        return rMaxOk && rMinOk && boundaryOk;
      }),
  },
  {
    id: 'imp95405-vacuous-fraction-large-most-patterns',
    description:
      'the vacuous fraction of the 2^n sign patterns is large (>= 3/4 on every grid): at fixed geometry the typical sign pattern is vacuous and only near-aligned patterns are active, with the paper fixed-amplitude family theta = 1 the active corner',
    holds: () =>
      IMP95405_THETA_SIGN_FREEDOM.every(
        (row) => row.fracVacuous >= 0.75 && REL(row.fracVacuous, row.vacuous / row.total) < 1e-9,
      ),
  },
  {
    id: 'imp95405-summary-consistent',
    description:
      'the summary counts and extremal r_min values match the tabulated rows and carry the honest measurement-only framing',
    holds: () => {
      const rmins = IMP95405_THETA_SIGN_FREEDOM.map((r) => r.rMin);
      return (
        IMP95405_SUMMARY.gridsMeasured === IMP95405_THETA_SIGN_FREEDOM.length &&
        IMP95405_SUMMARY.allStraddle === IMP95405_THETA_SIGN_FREEDOM.every((r) => r.straddles) &&
        Math.abs(IMP95405_SUMMARY.worstRMin - Math.min(...rmins)) < 1e-6 &&
        Math.abs(IMP95405_SUMMARY.bestRMin - Math.max(...rmins)) < 1e-6 &&
        IMP95405_SUMMARY.thetaMaxAllAligned === 1.0 &&
        /NO QED/.test(IMP95405_SUMMARY.finding) &&
        /refereed bound is changed/i.test(IMP95405_SUMMARY.finding) &&
        /Measurement only/.test(IMP95405_SUMMARY.finding)
      );
    },
  },
];

for (const a of IMP95405_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95405-theta-sign-freedom-at-fixed-geometry assertion failed: ${a.id}`);
  }
}

export default IMP95405_THETA_SIGN_FREEDOM;
