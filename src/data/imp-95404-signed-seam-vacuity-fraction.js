/**
 * @module imp-95404-signed-seam-vacuity-fraction
 *
 * imp-95404 (numerical): MEASUREMENT ONLY. imp-95273 tabulated the PHASE-CERT
 * vacuity distance r = theta / e^(-y_min) over a HAND-PICKED cross-section
 * (deep-cancellation witnesses below the boundary, mild/separated families
 * above) and concluded the vacuity is "confined to the deep-cancellation
 * corner" -- but it never measured how LARGE that corner is under a neutral
 * sampling. This module quantifies "confined" with a number: it measures the
 * FRACTION of a deterministically-randomized ensemble of signed packet
 * families (rates, centers, signs, magnitudes drawn over stated ranges) that
 * lands in the vacuous regime r < 1, as a function of the sampling ranges.
 *
 * MODEL (imp-95221/95222/95233/95273 packet model, reused verbatim). Packets
 * f_n(s) = e^(-mu_n |s - u_n|), rates mu_n > 0, centers u_n > 0, REAL
 * amplitudes c_n; f = sum c_n f_n; positive-modulus envelope g = sum |c_n|
 * f_n; R = int_(s<0) f^2 / int_R f^2; y_min = min over pairs incl diagonal of
 * (mu_m + mu_n) min(u_m, u_n); theta = T(f)/T(g) in (0,1]. COROLLARY
 * PHASE-CERT (imp-95233): R <= e^(-y_min)/(2 theta), ACTIVE (beats the 1/2
 * symmetry ceiling) iff theta > e^(-y_min), i.e. r = theta/e^(-y_min) > 1,
 * VACUOUS iff r <= 1.
 *
 * EXACT QUADRATURE. Where imp-95273 used 240000-panel Simpson, this module
 * evaluates the packet integrals in CLOSED FORM (needed to price a large
 * ensemble cheaply and exactly): for two packets with rates a,b at centers
 * p<=q (gap d = q-p),
 *   int_R e^(-a|s-p|) e^(-b|s-q|) ds = (e^(-b d)+e^(-a d))/(a+b) + M,
 *     M = (e^(-a d)-e^(-b d))/(b-a)   if a != b,   e^(-a d) d   if a = b;
 *   int_(s<0) (...) ds = e^(-(a p + b q))/(a+b)   (0 <= p, q so s<0 is the
 *     far-left tail region for both packets).
 * The closed form reproduces the imp-95273 EXACT literals (SGN-SAT phi_1
 * theta = 1/17, algebraic witness c=(3,-4) at ln 2: theta = 1/33, R = 3/8,
 * bound = 33/8) and the tabulated ratios to storage precision -- so this is
 * the imp-95233 PHASE-CERT reused verbatim, only measured over a neutral
 * ensemble instead of curated families.
 *
 * WHAT THE ENSEMBLE SHOWS. The vacuous fraction is NOT a fixed number -- it is
 * a strong function of the sampling geometry, exactly as imp-95273's curated
 * split predicted:
 *   - forcing centers near-coincident (uRange width ~0.1, the deep-
 *     cancellation regime the seam actually produces) puts ~30% of a neutral
 *     50/50-sign ensemble in the vacuous corner;
 *   - a broad NEUTRAL prior over rates/centers/signs puts only ~4% vacuous;
 *   - WIDE center separation drives it below 0.4%;
 *   - at FIXED geometry, biasing the signs positive (85/15) roughly halves the
 *     vacuous fraction (13.9% -> 5.8%) -- vacuity is driven by sign
 *     cancellation, not by the geometry alone.
 * So "confined to the deep-cancellation corner" is quantified: vacuity is a
 * minority (~4%) event under neutral sampling and only becomes common (~30%)
 * when the ensemble is deliberately restricted to co-centered near-antipodal
 * families. PHASE-CERT R <= bound is verified to HOLD for 100% of EVERY
 * ensemble (a valid upper bound throughout, merely loose when vacuous).
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses imp-95233 PHASE-CERT and the
 * imp-95273 packet model verbatim; changes NO bound, no operator positivity,
 * no RH claim; NO QED. No refereed bound is changed.
 * Import-light (no zeros bundle, no sibling imports); the ensemble is
 * regenerated deterministically from a fixed seed by the assertions.
 *
 * @see imp-95273-theta-vacuity-distribution.js (source: theta, r, hand-picked cross-section)
 * @see imp-95233-modulus-phase-currency-feasibility.js (source: PHASE-CERT, vacuity flag)
 *
 * Ticket: imp-95404 (numerical, opus-4-8, medium). Measurement only; no bound touched; NO QED.
 */

// -- exact packet integrals (closed form; cross-checked vs imp-95273) ---------
function aPair(a, p, b, q) {
  let ra = a, xp = p, rb = b, xq = q;
  if (p > q) { ra = b; xp = q; rb = a; xq = p; } // sort so xp <= xq
  const d = xq - xp;
  const tails = (Math.exp(-rb * d) + Math.exp(-ra * d)) / (ra + rb);
  const mid =
    Math.abs(ra - rb) < 1e-14
      ? Math.exp(-ra * d) * d
      : (Math.exp(-ra * d) - Math.exp(-rb * d)) / (rb - ra);
  return tails + mid;
}
function bPair(a, p, b, q) {
  return Math.exp(-(a * p + b * q)) / (a + b);
}
function quad(mu, u, c) {
  const n = c.length;
  let T = 0, W = 0;
  for (let j = 0; j < n; j++)
    for (let k = 0; k < n; k++) {
      T += c[j] * c[k] * aPair(mu[j], u[j], mu[k], u[k]);
      W += c[j] * c[k] * bPair(mu[j], u[j], mu[k], u[k]);
    }
  return { T, W };
}
function yMinOf(mu, u) {
  let m = Infinity;
  for (let i = 0; i < mu.length; i++)
    for (let j = 0; j < mu.length; j++)
      m = Math.min(m, (mu[i] + mu[j]) * Math.min(u[i], u[j]));
  return m;
}
function measure(mu, u, c) {
  const f = quad(mu, u, c);
  const g = quad(mu, u, c.map(Math.abs));
  const theta = f.T / g.T;
  const y = yMinOf(mu, u);
  const thr = Math.exp(-y);
  return { R: f.W / f.T, theta, yMin: y, threshold: thr, ratio: theta / thr, bound: thr / (2 * theta) };
}

// -- deterministic PRNG (mulberry32) -----------------------------------------
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const draw = (rng, lo, hi) => lo + (hi - lo) * rng();

// -- ensemble sampling configurations (stated ranges) ------------------------
// Each config draws `samples` signed packet families and measures the fraction
// with r = theta/e^(-y_min) < 1 (PHASE-CERT vacuous). pPositive = prob a given
// amplitude is drawn positive (0.5 = neutral sign mix).
const IMP95404_CONFIGS = [
  { key: 'coCenteredNarrow', label: 'co-centered (uRange width ~0.1), neutral signs', seed: 0x9e3779b1, samples: 4000, nChoices: [2, 3, 4], muRange: [1, 2], uRange: [1.0, 1.1], cMagRange: [0.5, 4], pPositive: 0.5 },
  { key: 'moderateSpread', label: 'moderate center spread [0.5,2.5], neutral signs', seed: 0x85ebca6b, samples: 4000, nChoices: [2, 3, 4], muRange: [1, 2], uRange: [0.5, 2.5], cMagRange: [0.5, 4], pPositive: 0.5 },
  { key: 'wideSeparation', label: 'wide center separation [1,6], neutral signs', seed: 0xc2b2ae35, samples: 4000, nChoices: [2, 3, 4], muRange: [1, 2], uRange: [1.0, 6.0], cMagRange: [0.5, 4], pPositive: 0.5 },
  { key: 'signAlignedModerate', label: 'moderate spread [0.5,2.5], signs biased positive (85/15)', seed: 0x27d4eb2f, samples: 4000, nChoices: [2, 3, 4], muRange: [1, 2], uRange: [0.5, 2.5], cMagRange: [0.5, 4], pPositive: 0.85 },
  { key: 'coCenteredPairs', label: 'co-centered pairs (n=2, uRange width ~0.05), neutral signs', seed: 0x165667b1, samples: 4000, nChoices: [2], muRange: [1, 2], uRange: [1.0, 1.05], cMagRange: [0.5, 4], pPositive: 0.5 },
  { key: 'neutralBroad', label: 'broad neutral prior (rates/centers/signs/mags)', seed: 0xd3a2646c, samples: 4000, nChoices: [2, 3, 4], muRange: [0.8, 2.5], uRange: [0.5, 4.0], cMagRange: [0.3, 5], pPositive: 0.5 },
];

// regenerate one config deterministically from its seed
function runConfig(cfg) {
  const rng = mulberry32(cfg.seed);
  let vac = 0, certHolds = 0, rMin = Infinity, rMax = -Infinity;
  for (let s = 0; s < cfg.samples; s++) {
    const n = cfg.nChoices[Math.floor(rng() * cfg.nChoices.length)];
    const mu = [], u = [], c = [];
    for (let k = 0; k < n; k++) {
      mu.push(draw(rng, cfg.muRange[0], cfg.muRange[1]));
      u.push(draw(rng, cfg.uRange[0], cfg.uRange[1]));
      const sign = rng() < cfg.pPositive ? 1 : -1;
      c.push(sign * draw(rng, cfg.cMagRange[0], cfg.cMagRange[1]));
    }
    const m = measure(mu, u, c);
    if (m.ratio < 1) vac++;
    if (m.R <= m.bound + 1e-9) certHolds++;
    if (m.ratio < rMin) rMin = m.ratio;
    if (m.ratio > rMax) rMax = m.ratio;
  }
  return { key: cfg.key, samples: cfg.samples, vacuousCount: vac, vacuousFraction: vac / cfg.samples, certHolds, rMin, rMax };
}

// -- baked ensemble measurement (regenerated by the assertions) --------------
// vacuousFraction = fraction of the ensemble with r < 1 (PHASE-CERT vacuous).
export const IMP95404_VACUITY_FRACTIONS = [
  { key: 'coCenteredNarrow', cls: 'deep-cancellation', vacuousCount: 1220, vacuousFraction: 0.305, rMin: 6.334260e-4, rMax: 6.496363e1 },
  { key: 'moderateSpread', cls: 'mixed', vacuousCount: 558, vacuousFraction: 0.1395, rMin: 1.285380e-2, rMax: 4.691597e3 },
  { key: 'wideSeparation', cls: 'separated', vacuousCount: 14, vacuousFraction: 0.0035, rMin: 6.365388e-2, rMax: 1.859925e9 },
  { key: 'signAlignedModerate', cls: 'aligned', vacuousCount: 232, vacuousFraction: 0.058, rMin: 9.950011e-3, rMax: 4.361402e3 },
  { key: 'coCenteredPairs', cls: 'deep-cancellation', vacuousCount: 1034, vacuousFraction: 0.2585, rMin: 6.960383e-4, rMax: 6.012353e1 },
  { key: 'neutralBroad', cls: 'mixed', vacuousCount: 162, vacuousFraction: 0.0405, rMin: 3.790913e-2, rMax: 4.044660e7 },
];

// -- measurement summary -----------------------------------------------------
export const IMP95404_SUMMARY = {
  ticket:
    'imp-95404: measured the FRACTION of a deterministically-randomized signed-seam ensemble (packet rates/centers/signs/magnitudes drawn over stated ranges) landing in the imp-95233 PHASE-CERT vacuous corner r = theta/e^(-y_min) < 1, as a function of the sampling ranges, to quantify the imp-95273 "confined to the deep-cancellation corner" claim with a number.',
  configs: 6,
  samplesPerConfig: 4000,
  neutralBroadFraction: 0.0405,
  coCenteredNarrowFraction: 0.305,
  wideSeparationFraction: 0.0035,
  finding:
    'the vacuous fraction is a strong function of the sampling geometry: only ~4% of a broad NEUTRAL prior lands vacuous (r < 1), rising to ~30% when centers are forced near-coincident (the deep-cancellation regime the seam actually produces) and falling below 0.4% under wide center separation; at FIXED geometry, biasing signs positive (85/15) roughly halves the vacuous fraction (13.9% -> 5.8%), so vacuity is driven by sign cancellation, not geometry alone. This quantifies the imp-95273 "confined to the deep-cancellation corner" claim: vacuity is a minority event under neutral sampling. PHASE-CERT R <= e^(-y_min)/(2 theta) is verified to HOLD for 100% of EVERY ensemble. Measurement only; the 1/theta loss is unchanged; NO bound touched; NO QED; no refereed bound is changed.',
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) ------
const REL = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b));

export const IMP95404_ASSERTIONS = [
  {
    id: 'imp95404-closedform-matches-imp95273-exact-literals',
    description:
      'the closed-form packet quadrature reproduces the imp-95273 EXACT literals (SGN-SAT phi_1 theta = 1/17; algebraic witness c=(3,-4) at ln 2: theta = 1/33, R = 3/8, bound = 33/8), i.e. this is imp-95233 PHASE-CERT reused verbatim',
    holds: () => {
      const p1 = measure([1, 2], [1, 1], [1, -1]);
      const aw = measure([1, 2], [Math.log(2), Math.log(2)], [3, -4]);
      return (
        Math.abs(p1.theta - 1 / 17) < 1e-12 &&
        Math.abs(aw.theta - 1 / 33) < 1e-12 &&
        Math.abs(aw.R - 3 / 8) < 1e-12 &&
        Math.abs(aw.bound - 33 / 8) < 1e-9 &&
        Math.abs(aw.threshold - 0.25) < 1e-12
      );
    },
  },
  {
    id: 'imp95404-baked-fractions-reproduce',
    description:
      'every baked vacuousFraction / vacuousCount / rMin / rMax reproduces a fresh deterministic regeneration of its config to within a few boundary counts (abs frac tol 5e-3; extremal ratios rel 1e-3)',
    holds: () =>
      IMP95404_CONFIGS.every((cfg) => {
        const r = runConfig(cfg);
        const row = IMP95404_VACUITY_FRACTIONS.find((x) => x.key === cfg.key);
        return (
          Math.abs(r.vacuousFraction - row.vacuousFraction) < 5e-3 &&
          Math.abs(r.vacuousCount - row.vacuousCount) <= 20 &&
          REL(r.rMin, row.rMin) < 1e-3 &&
          REL(r.rMax, row.rMax) < 1e-3
        );
      }),
  },
  {
    id: 'imp95404-regeneration-deterministic',
    description: 'regenerating a config twice yields byte-identical counts and extremal ratios (the ensemble is a pure function of its seed)',
    holds: () => {
      const a = runConfig(IMP95404_CONFIGS[0]);
      const b = runConfig(IMP95404_CONFIGS[0]);
      return a.vacuousCount === b.vacuousCount && a.rMin === b.rMin && a.rMax === b.rMax;
    },
  },
  {
    id: 'imp95404-phasecert-holds-for-whole-ensemble',
    description:
      'COROLLARY PHASE-CERT R <= e^(-y_min)/(2 theta) holds for 100% of EVERY ensemble sample (a valid upper bound throughout, active and vacuous alike)',
    holds: () => IMP95404_CONFIGS.every((cfg) => runConfig(cfg).certHolds === cfg.samples),
  },
  {
    id: 'imp95404-vacuity-fraction-in-unit-interval',
    description: 'every measured vacuousFraction lies in [0, 1]',
    holds: () => IMP95404_VACUITY_FRACTIONS.every((r) => r.vacuousFraction >= 0 && r.vacuousFraction <= 1),
  },
  {
    id: 'imp95404-monotone-in-center-coincidence',
    description:
      'the vacuous fraction increases as centers are driven together at fixed neutral signs: wideSeparation < neutralBroad < moderateSpread < coCenteredNarrow (vacuity is a deep-cancellation / co-centered phenomenon)',
    holds: () => {
      const f = (k) => IMP95404_VACUITY_FRACTIONS.find((r) => r.key === k).vacuousFraction;
      return f('wideSeparation') < f('neutralBroad') && f('neutralBroad') < f('moderateSpread') && f('moderateSpread') < f('coCenteredNarrow');
    },
  },
  {
    id: 'imp95404-sign-alignment-reduces-vacuity',
    description:
      'at the SAME geometry (moderate spread), biasing amplitude signs positive (85/15) strictly lowers the vacuous fraction vs a neutral 50/50 mix -- vacuity is driven by sign cancellation, not geometry alone',
    holds: () => {
      const f = (k) => IMP95404_VACUITY_FRACTIONS.find((r) => r.key === k).vacuousFraction;
      return f('signAlignedModerate') < f('moderateSpread');
    },
  },
  {
    id: 'imp95404-neutral-prior-vacuity-is-a-minority',
    description:
      'under a broad NEUTRAL prior the vacuous fraction is a minority event (< 10%), quantifying the imp-95273 "confined to the deep-cancellation corner" claim with a number',
    holds: () => IMP95404_VACUITY_FRACTIONS.find((r) => r.key === 'neutralBroad').vacuousFraction < 0.1,
  },
  {
    id: 'imp95404-summary-consistent',
    description: 'the summary counts / extremal fractions match the tabulated ensemble and carry the honest measurement-only framing',
    holds: () => {
      const f = (k) => IMP95404_VACUITY_FRACTIONS.find((r) => r.key === k).vacuousFraction;
      return (
        IMP95404_SUMMARY.configs === IMP95404_VACUITY_FRACTIONS.length &&
        IMP95404_VACUITY_FRACTIONS.every((r) => r.samples === undefined || r.samples === 4000) &&
        Math.abs(IMP95404_SUMMARY.neutralBroadFraction - f('neutralBroad')) < 1e-9 &&
        Math.abs(IMP95404_SUMMARY.coCenteredNarrowFraction - f('coCenteredNarrow')) < 1e-9 &&
        Math.abs(IMP95404_SUMMARY.wideSeparationFraction - f('wideSeparation')) < 1e-9 &&
        /NO QED/.test(IMP95404_SUMMARY.finding) &&
        /refereed bound is changed/i.test(IMP95404_SUMMARY.finding) &&
        /Measurement only/.test(IMP95404_SUMMARY.finding)
      );
    },
  },
];

for (const a of IMP95404_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95404-signed-seam-vacuity-fraction assertion failed: ${a.id}`);
  }
}

export default IMP95404_VACUITY_FRACTIONS;
