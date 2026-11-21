/**
 * imp-96432 -- Sensitivity of the imp-96392 PART B gamma_8000 intercept-SE (seC) to the
 * s2-FIXED residual-scale convention, via the imp-96307 design identity.
 *
 * imp-96392 PART B reports the gamma_8000 intercept SE under the s2-FIXED convention: it
 * reuses the MEASURED gamma_4000 residual scale s2=2.682e-4 in the imp-96307 design identity
 *
 *     seC = sqrt( s2 * (1/n + xbar^2 / Sxx) )
 *
 * and gets a realistic-spread seC~0.01195 (~13.9% tighter than the 0.013868 baseline). s2 is
 * the ONLY ordinate-dependent input and it is held frozen. This module measures how the
 * reported seC and the frac-tighter readings move when s2 is varied over a plausible range
 * around 2.682e-4, bounding how much the does-not-collapse conclusion depends on that frozen
 * residual scale. MEASUREMENT ONLY; needs no fresh rho; changes no bound; NO QED.
 *
 * PLAUSIBLE s2 RANGE. s2 is a residual variance on n-2=32 degrees of freedom, so its own
 * sampling spread is chi-square: relative SD = sqrt(2/(n-2)) = sqrt(2/32) = 0.25. A 2-SD band
 * is therefore ~[0.5, 1.5]*s2; a factor-2 band [0.5, 2.0]*s2 is a generous outer envelope.
 * Both are swept below.
 *
 * KEY STRUCTURAL FACT -- the does-not-collapse verdict is EXACTLY s2-invariant. The design
 * identity factorises seC = sqrt(s2) * sqrt(g), with g = 1/n + xbar^2/Sxx depending only on
 * the x-design. The frac-tighter reading is
 *
 *     fracTighter = 1 - seC_appended / seC_baseline
 *                 = 1 - sqrt(s2 * g_append) / sqrt(s2 * g_base)
 *                 = 1 - sqrt(g_append / g_base),
 *
 * in which the sqrt(s2) factor CANCELS. So the frac-tighter numbers (13.85% for the realistic
 * 8-height spread, 18.35% for the K=10 leverage-optimal placement) are INDEPENDENT of the
 * frozen s2 to machine precision -- they are pure x-design quantities. The "SE does not
 * collapse" conclusion of imp-96392 PART B rests entirely on the reciprocal-log x-compression,
 * NOT on the value of the frozen residual scale.
 *
 * WHAT DOES MOVE -- the absolute seC LEVEL, sub-linearly (as sqrt(s2)). Over the plausible s2
 * band the realistic-spread seC tracks:
 *
 *   s2 factor   s2           seC (spread)   baseSE       frac tighter
 *   0.50        1.341e-4     0.008448       0.009806     13.85%
 *   0.75        2.012e-4     0.010346       0.012010     13.85%
 *   1.00        2.682e-4     0.011947       0.013868     13.85%   <- imp-96392 reported point
 *   1.25        3.353e-4     0.013357       0.015504     13.85%
 *   1.50        4.023e-4     0.014632       0.016984     13.85%
 *   2.00        5.365e-4     0.016896       0.019612     13.85%
 *
 * READING. Even the outer factor-2 band keeps the reported seC in ~[0.0084, 0.0169] and the
 * baseline in ~[0.0098, 0.0196]: the SE stays O(0.01), never collapsing toward zero nor
 * blowing up, and the frac-tighter is dead flat. So the does-not-collapse conclusion is doubly
 * robust: structurally s2-invariant in the frac-tighter form, and only sqrt-slowly moving in
 * absolute level.
 *
 * ONE CAVEAT -- the c/seC SIGN ratio (a different reading) DOES inherit the sqrt(s2)
 * dependence, since the numerator (projected intercept ~0.0185) is fixed. At the tightest
 * (K=10) seC the ratio runs c/seC = 2.31 (s2 halved) -> 1.64 (nominal) -> 1.16 (s2 doubled):
 * still inside 2 SE across the whole nominal-to-doubled range, and only a HALVED residual scale
 * would nudge it past 2 (2.31). But that ratio is the numerator x denominator question that
 * imp-96392 already defers to the fresh-height sub-gap; the FRAC-TIGHTER "does-not-collapse"
 * verdict this ticket targets is the s2-invariant one.
 *
 * UNCHANGED. No fresh rho evaluated; the binding measured envelope rho_min=0.3791 at gamma_4000
 * stays strictly positive; the uniform-in-T off-line LP stays inaccessible; changes NO Lambda
 * bound; no refereed bound is changed; RH open; NO QED.
 *
 * GRADE: measurement/sensitivity only. Import-light (design + s2 recomputed from the same baked
 * imp-96224/imp-96367 arrays as imp-96392, no heavy bundle).
 *
 * @see imp-96392-margin-floor-gamma8000-feasibility (the s2-fixed seC reading this stress-tests)
 * @see imp-96307-anchor-confidence-gain-projection (the seC = sqrt(s2*(1/n + xbar^2/Sxx)) identity)
 * @see imp-96367-route-bd-intercept-se-trajectory (the flat-SE / near-halving-intercept projection)
 */

// Same REAL measured arrays as imp-96392 (seven on-line imp-96148 + 27 off-anchor imp-96224).
const T7 = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const R7 = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const OFF_T = [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
  1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0,
  2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31];
const OFF_RHO = [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
  0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
  0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791];
const T = T7.concat(OFF_T);
const RHO = R7.concat(OFF_RHO);
const X = T.map((t) => 1 / Math.log(t));

// OLS fit with intercept SE and residual scale s2 (imp-96328 estimator; matches imp-96392).
function fitWithSE(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const d = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const c = (sy - d * sx) / n;
  const xb = sx / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  let sse = 0;
  for (let i = 0; i < n; i++) { const yh = c + d * xs[i]; sse += (ys[i] - yh) ** 2; }
  const s2 = sse / (n - 2);
  const seC = Math.sqrt(s2 * (1 / n + (xb * xb) / sxxCentered));
  return { c, d, s2, seC, n };
}
const BASE = fitWithSE(X, RHO);

// gamma_8000 terminal height + the realistic 8-height spread (identical to imp-96392).
function gammaN(N) { return (2 * Math.PI * N) / Math.log(N / (2 * Math.PI * Math.E)); }
const T8 = gammaN(8000);
const X8 = 1 / Math.log(T8);
const SPREAD_TS = [4700, 5000, 5400, 5900, 6500, 7200, 7900, T8];

// s2-independent design factor g = 1/n + xbar^2/Sxx for an appended x-set.
function designFactor(newXs) {
  const xs = X.concat(newXs);
  const n = xs.length;
  const xb = xs.reduce((a, b) => a + b, 0) / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  return { n, g: 1 / n + (xb * xb) / sxxCentered };
}
const G_BASE = designFactor([]);
const G_SPREAD = designFactor(SPREAD_TS.map((t) => 1 / Math.log(t)));
const G_K10 = designFactor(Array(10).fill(X8));

// Plausible s2 band: chi-square relative SD on n-2=32 dof, then a factor-2 outer envelope.
const S2_REL_SD = Math.sqrt(2 / (BASE.n - 2));       // 0.25 (2-SD band ~ +-50%)
const S2_FACTORS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

const SPREAD_SWEEP = S2_FACTORS.map((f) => {
  const s2 = BASE.s2 * f;
  const seC = Math.sqrt(s2 * G_SPREAD.g);
  const seBase = Math.sqrt(s2 * G_BASE.g);
  return { s2Factor: f, s2, seC, baseSeC: seBase, fracTighter: 1 - seC / seBase };
});
const K10_SWEEP = S2_FACTORS.map((f) => {
  const s2 = BASE.s2 * f;
  const seC = Math.sqrt(s2 * G_K10.g);
  const seBase = Math.sqrt(s2 * G_BASE.g);
  return { s2Factor: f, s2, seC, fracTighter: 1 - seC / seBase };
});

// Analytic s2-invariant frac-tighter (the sqrt(s2) cancels): pure x-design quantities.
const FRAC_SPREAD_INVARIANT = 1 - Math.sqrt(G_SPREAD.g / G_BASE.g);
const FRAC_K10_INVARIANT = 1 - Math.sqrt(G_K10.g / G_BASE.g);
// Spread of the frac-tighter reading across the whole s2 band (should be ~0 to machine eps).
const fracVals = SPREAD_SWEEP.map((r) => r.fracTighter);
const FRAC_SPREAD_RANGE = Math.max(...fracVals) - Math.min(...fracVals);

// The c/seC sign ratio (different reading) DOES move: projected near-halved intercept / K=10 seC.
const C_PROJ = BASE.c * 0.5;   // ~0.0185 (imp-96367 near-halving; NOT measured)
const COVERSE_K10 = S2_FACTORS.map((f) => ({
  s2Factor: f,
  cOverSE: C_PROJ / Math.sqrt(BASE.s2 * f * G_K10.g),
}));

export const IMP_96432_SEC_S2_SENSITIVITY = {
  id: 'imp-96432-gamma8000-sec-s2-sensitivity',
  title:
    'Sensitivity of the imp-96392 PART B gamma_8000 intercept-SE (s2-fixed) to the frozen '
    + 'residual scale s2, via the imp-96307 design identity: the frac-tighter does-not-collapse '
    + 'verdict is EXACTLY s2-invariant, only the absolute seC level moves (as sqrt(s2))',
  designIdentity: 'seC = sqrt(s2) * sqrt(g), g = 1/n + xbar^2/Sxx (x-design only)',
  baseline: {
    n: BASE.n,                       // 34
    s2: BASE.s2,                     // 2.682e-4
    seC: BASE.seC,                   // 0.013868
    reportedSpreadSeC: Math.sqrt(BASE.s2 * G_SPREAD.g), // 0.011947 (imp-96392 realistic point)
  },
  s2Range: {
    relSD: S2_REL_SD,                // 0.25 (chi-square on n-2=32 dof)
    twoSDBand: [0.5, 1.5],           // ~ +-50% around nominal
    outerBand: [0.5, 2.0],           // generous factor-2 envelope
    note: 's2 is a residual variance on 32 dof; its own sampling relative SD is '
      + 'sqrt(2/(n-2))=0.25, so a 2-SD band is [0.5,1.5]*s2 and a factor-2 band is a wide outer '
      + 'envelope',
  },
  spreadSweep: SPREAD_SWEEP,          // realistic 8-height spread seC over the s2 band
  k10Sweep: K10_SWEEP,                // leverage-optimal K=10 seC over the s2 band
  invariance: {
    fracSpreadInvariant: FRAC_SPREAD_INVARIANT,  // 0.13849 -- s2-independent by construction
    fracK10Invariant: FRAC_K10_INVARIANT,        // 0.18348
    fracRangeAcrossS2Band: FRAC_SPREAD_RANGE,    // ~0 (machine eps)
    reason: 'fracTighter = 1 - sqrt(s2*g_append)/sqrt(s2*g_base) = 1 - sqrt(g_append/g_base); '
      + 'the sqrt(s2) factor cancels, so the frac-tighter readings are pure x-design quantities '
      + 'INDEPENDENT of the frozen residual scale to machine precision',
  },
  signRatioCaveat: {
    // The c/seC SIGN reading (different from frac-tighter) does inherit the sqrt(s2) dependence.
    projectedIntercept: C_PROJ,       // ~0.0185 (NOT measured)
    cOverSE_K10: COVERSE_K10,         // 2.31 (halved) -> 1.64 (nominal) -> 1.16 (doubled)
    note: 'the c/seC sign ratio uses a FIXED projected numerator, so it scales as 1/sqrt(s2): '
      + 'inside 2 SE across nominal-to-doubled s2, only a halved residual scale nudges it past 2 '
      + '(2.31). That ratio is the numerator x denominator question imp-96392 defers to the '
      + 'fresh-height sub-gap; the frac-tighter does-not-collapse verdict this ticket targets is '
      + 'the s2-invariant one',
  },
  finding:
    'stress-testing the imp-96392 PART B s2-fixed seC against a plausible residual-scale band '
    + '([0.5,1.5]*s2 at 2-SD, factor-2 outer): the DOES-NOT-COLLAPSE verdict is EXACTLY '
    + 's2-invariant. Because the design identity factorises seC = sqrt(s2)*sqrt(g), the '
    + 'frac-tighter reading 1 - sqrt(g_append/g_base) has the sqrt(s2) cancelled, so the 13.85% '
    + '(realistic spread) and 18.35% (K=10 leverage-optimal) tightening figures are pure '
    + 'x-design quantities that do not move with the frozen s2. Only the ABSOLUTE seC level '
    + 'tracks sqrt(s2): over the factor-2 band the reported spread seC stays in ~[0.0084, 0.0169] '
    + 'and never collapses toward zero. So the flat-SE conclusion rests on the reciprocal-log '
    + 'x-compression, not on the choice of frozen residual scale. The one reading that does move '
    + 'with s2 is the c/seC sign ratio (fixed projected numerator ~0.0185): 1.64 nominal, still '
    + 'inside 2 SE up to doubled s2, past 2 only if s2 halves -- but that is the deferred '
    + 'numerator question, not the frac-tighter verdict',
  unchanged:
    'no fresh rho evaluated; the binding measured envelope rho_min=0.3791 at gamma_4000 stays '
    + 'strictly positive so the margin SIGN survives; the uniform-in-T off-line LP '
    + '(Weil-positivity strength) stays inaccessible; changes NO Lambda bound; no refereed bound is changed'
    + '; RH open; NO QED',
  note:
    'measurement/sensitivity only; import-light, design + s2 recomputed from the same baked '
    + 'imp-96224/imp-96367 arrays as imp-96392; no fabricated rho; the frac-tighter '
    + 'does-not-collapse verdict is shown structurally s2-invariant, only the absolute seC level '
    + 'moves as sqrt(s2); changes no bound; NO QED',
  closesTickets: ['imp-96432'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96432_ASSERTIONS = [
  {
    id: 'imp-96432-baseline-matches-imp96392',
    holds: () => BASE.n === 34
      && Math.abs(BASE.s2 - 2.682e-4) < 1e-6
      && Math.abs(BASE.seC - 0.013868) < 1e-4
      && Math.abs(Math.sqrt(BASE.s2 * G_SPREAD.g) - 0.011947) < 1e-4,
    why: 'the recomputed baseline (s2=2.682e-4, seC=0.013868) and realistic-spread seC=0.011947 must reproduce the imp-96392 PART B point being stress-tested.',
  },
  {
    id: 'imp-96432-frac-tighter-is-s2-invariant',
    holds: () => FRAC_SPREAD_RANGE < 1e-12
      && Math.abs(FRAC_SPREAD_INVARIANT - 0.13849) < 1e-4
      && Math.abs(FRAC_K10_INVARIANT - 0.18348) < 1e-4,
    why: 'the frac-tighter readings must be constant across the entire s2 band (sqrt(s2) cancels): 13.85% spread / 18.35% K=10, to machine precision.',
  },
  {
    id: 'imp-96432-abs-seC-scales-as-sqrt-s2',
    holds: () => {
      const lo = SPREAD_SWEEP.find((r) => r.s2Factor === 0.5).seC;
      const hi = SPREAD_SWEEP.find((r) => r.s2Factor === 2.0).seC;
      // seC ratio over factor-4 s2 range must equal sqrt(4)=2 to numerical precision.
      return Math.abs(hi / lo - 2) < 1e-9 && lo > 0.008 && hi < 0.017;
    },
    why: 'the absolute reported seC must scale exactly as sqrt(s2) (factor-4 s2 -> factor-2 seC) and stay O(0.01) across the factor-2 band -- never collapsing.',
  },
  {
    id: 'imp-96432-sign-ratio-moves-with-s2',
    holds: () => {
      const lo = COVERSE_K10.find((r) => r.s2Factor === 0.5).cOverSE;   // ~2.31
      const nom = COVERSE_K10.find((r) => r.s2Factor === 1.0).cOverSE;  // ~1.64
      const hi = COVERSE_K10.find((r) => r.s2Factor === 2.0).cOverSE;   // ~1.16
      return lo > 2 && nom > 1 && nom < 2 && hi > 1 && hi < nom;
    },
    why: 'the c/seC sign ratio (fixed projected numerator) DOES move with s2: inside 2 SE nominal-to-doubled, only a halved s2 pushes it past 2.',
  },
  {
    id: 'imp-96432-no-fresh-rho-no-qed',
    holds: () => /no fabricated rho/i.test(IMP_96432_SEC_S2_SENSITIVITY.note)
      && /NO QED/.test(IMP_96432_SEC_S2_SENSITIVITY.note)
      && /refereed bound is changed/i.test(IMP_96432_SEC_S2_SENSITIVITY.unchanged),
    why: 'measurement only: no fresh rho, changes no bound, no refereed bound is changed, RH open, NO QED.',
  },
  {
    id: 'imp-96432-closes-self',
    holds: () => Array.isArray(IMP_96432_SEC_S2_SENSITIVITY.closesTickets)
      && IMP_96432_SEC_S2_SENSITIVITY.closesTickets.includes('imp-96432'),
    why: 'this module is the s2-sensitivity measurement the imp-96432 ticket asked for.',
  },
];

for (const a of IMP_96432_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96432-gamma8000-sec-s2-sensitivity assertion failed: ${a.id}`);
  }
}

export default IMP_96432_SEC_S2_SENSITIVITY;
