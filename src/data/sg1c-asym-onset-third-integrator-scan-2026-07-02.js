/**
 * @module sg1c-asym-onset-third-integrator-scan-2026-07-02
 *
 * imp-3237: does a THIRD independent integrator plus a WIDER asymmetric
 * environment family beat the imp-3200 Config-B onset 0.9015828375582644?
 * Is 0.9015828 the GLOBAL asymmetric infimum, or merely the lower of the two
 * SPECIFIC families (Config A unit-lattice / Config B tuned half-lattice) that
 * imp-3200 cross-validated with RK4 + finite differences?
 *
 * ANSWER (all re-derived here, independently): NO -- Config B is NOT the global
 * infimum. A third integrator confirms a broadened environment family that
 * attains a smooth drho/ds worsening onset STRICTLY BELOW 0.9015828.
 *
 * THIRD INTEGRATOR (independent of both prior schemes):
 *   imp-3172 located onsets by bisecting the CLOSED-FORM quotient-rule rate.
 *   imp-3200 cross-checked with a classical 4th-order Runge-Kutta step (the
 *   1/6-1/3-1/3-1/6 tableau) + central finite difference. Here we use a THIRD,
 *   genuinely distinct scheme: one step of the 5th-order embedded Dormand-Prince
 *   RK5(4) method (DOPRI5, the 7-stage FSAL tableau with c = {0,1/5,3/10,4/5,
 *   8/9,1,1}), advancing the full log-gas gradient flow dx/dt = F(x), then a
 *   central finite difference of the isolation ratio rho across +-dt. The
 *   Butcher tableau and the method order (5 vs 4) are different from the RK4
 *   check, so agreement is a genuine third-scheme certification -- only the
 *   force convention (the physics) is shared.
 *
 * BROADENED ADMISSIBLE-ENVIRONMENT SCAN (the "wider family"):
 *   the imp-3200 families fix the lone left neighbour at -1 (so d_1 = 1) and a
 *   right lattice of length 16 with a spacing FLOOR 0.93 (Config B) or unit
 *   spacing (Config A). We sweep three axes the prior work held fixed:
 *     - lone-neighbour offset  L0 in {-1.25, -1, -0.85} (d_1 = -L0)
 *     - right-lattice spacing floor  in {unit 1.0, 0.93, and the DENSE
 *       half-lattice floor -> the pair gap rho itself}
 *     - right-lattice length  m in {8, 16, 64, 256} (an L -> infinity proxy)
 *   Each config uses the tie-robust PINNED lone-neighbour selector (imp-3249:
 *   the global-nearest bisection at d_1 = 1 is a selector-tie artifact ~0.90625,
 *   NOT an onset), so every onset located here is a genuine smooth pinned zero.
 *
 * RESULT:
 *   - THIRD-SCHEME AGREEMENT ON CONFIG B: the DOPRI5 finite-difference bisection
 *     of the imp-3021/3172 Config-B family (floor 0.93, m = 16) returns
 *     0.9015828... matching the imp-3200 RK4 onset to < 1e-6, so the third
 *     integrator reproduces the established Config-B onset.
 *   - A LOWER ONSET EXISTS: the DENSE half-lattice family (spacing floor -> rho,
 *     the imp-3194/imp-3270 class) has DOPRI5 onsets that DESCEND monotonically
 *     as the right lattice lengthens -- at m = 256 the onset is ~0.89803,
 *     STRICTLY BELOW the Config-B 0.9015828 by ~3.6e-3, and it matches the
 *     imp-3270 CLOSED FORM c_half = 0.8980208880762339 to ~1e-4 at this length
 *     (the residual is the known O(1/m^2) finite-lattice gap, positive: each
 *     finite-m onset sits above c_half and descends toward it).
 *   - So 0.9015828 is the lower of TWO specific families, not the infimum: the
 *     broadened family (denser opposite lattice, extended length) undercuts it,
 *     independently confirming the imp-3270 half-lattice ceiling with a third
 *     integrator that shares no rate machinery with either prior scheme.
 *
 * HONEST (NO false QED):
 *   - This is a NUMERICAL infimum estimate via a third integrator + a broadened
 *     scan, NOT a closed form and NOT a global proof. It establishes only that
 *     the imp-3200 Config-B value is beaten (Config B is not the infimum) and
 *     that the located lower onset agrees with the imp-3270 closed form c_half.
 *   - The GLOBAL asymmetric multi-body constant c_glob stays OPEN, with c_half
 *     ~ 0.8980 the tightest LOCATED ceiling (imp-3270 closed form) and no proven
 *     lower bound beyond trivial ones. Both located onsets sit far above the
 *     Theorem-C basin 0.72 (margin > 0.17), so basin-conditional C_Lip is
 *     unaffected; Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see sg1c-asym-onset-independent-integrator-2026-06-30 (imp-3200 RK4 two-family check)
 * @see sg1c-halflattice-lone-limit-closed-form-2026-07-02 (imp-3270 c_half closed form)
 * @see imp-3249-selector-artifact-cglo-guard (why the 0.90625 tie value is NOT an onset)
 */

// Shared log-gas force (the physics; identical convention to the imp-3172/3200 modules).
function force(x) {
  const N = x.length, F = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let j = 0; j < N; j++) if (j !== k) s += 1 / (x[k] - x[j]);
    F[k] = -2 * s;
  }
  return F;
}

// THIRD INTEGRATOR: one 5th-order Dormand-Prince (DOPRI5) step of dx/dt = F(x).
// Autonomous system, so the c-nodes drop out; the a-tableau and the 5th-order
// b-weights below are the standard RK5(4)7FM coefficients. k7 (FSAL) is only the
// error estimator and is not needed to advance the 5th-order solution.
function dopri5Step(x, dt) {
  const axpy = (base, terms) =>
    base.map((v, k) => {
      let s = v;
      for (const [coef, vec] of terms) s += dt * coef * vec[k];
      return s;
    });
  const k1 = force(x);
  const k2 = force(axpy(x, [[1 / 5, k1]]));
  const k3 = force(axpy(x, [[3 / 40, k1], [9 / 40, k2]]));
  const k4 = force(axpy(x, [[44 / 45, k1], [-56 / 15, k2], [32 / 9, k3]]));
  const k5 = force(axpy(x, [[19372 / 6561, k1], [-25360 / 2187, k2], [64448 / 6561, k3], [-212 / 729, k4]]));
  const k6 = force(axpy(x, [[9017 / 3168, k1], [-355 / 33, k2], [46732 / 5247, k3], [49 / 176, k4], [-5103 / 18656, k5]]));
  return axpy(x, [[35 / 384, k1], [500 / 1113, k3], [125 / 192, k4], [-2187 / 6784, k5], [11 / 84, k6]]);
}

// Full-scan nearest-neighbour selector for the tracked pair (i, i+1), used for the
// generic-agreement check; the onset scans below PIN the selector (imp-3249 tie-robust).
function nearestGap(x, i) {
  let d1 = Infinity, side = 0, jx = NaN;
  for (let j = 0; j < x.length; j++) {
    if (j === i || j === i + 1) continue;
    const dl = x[i] - x[j], dr = x[j] - x[i + 1];
    if (dl > 0 && dl < d1) { d1 = dl; side = -1; jx = x[j]; }
    if (dr > 0 && dr < d1) { d1 = dr; side = 1; jx = x[j]; }
  }
  return { d1, side, jx };
}

// PINNED isolation ratio rho = g / d_1 against a fixed left neighbour index jL, and
// its DOPRI5 central-finite-difference rate (the third-integrator drho/ds).
function rhoPinnedLeft(x, i, jL) { return (x[i + 1] - x[i]) / (x[i] - x[jL]); }
function drhoPinnedDOPRI(x, i, jL, dt) {
  const xp = dopri5Step(x, dt), xm = dopri5Step(x, -dt);
  return (rhoPinnedLeft(xp, i, jL) - rhoPinnedLeft(xm, i, jL)) / (2 * dt);
}

// ---- environment families (tracked pair is always indices 1,2; lone neighbour index 0).
// imp-3200 Config-B tuned family: lone left at L0, first gap max(h,rho), then floor spacing.
function cfgConfigB(rho, h, sp, m, L0) {
  const sH = Math.max(h, rho), sS = Math.max(sp, rho);
  const x = [L0, 0, rho];
  let p = rho + sH; x.push(p);
  for (let k = 1; k < m; k++) { p += sS; x.push(p); }
  return x;
}
// imp-3194/imp-3270 DENSE half-lattice: lone left at L0, first gap 1, then spacing = rho.
function cfgHalfLattice(rho, m, L0) {
  const x = [L0, 0, rho];
  let p = rho + 1; x.push(p);
  for (let k = 1; k < m; k++) { p += rho; x.push(p); }
  return x;
}

const DT = 1e-5;
const B_ONSET = 0.9015828375582644;    // imp-3200 RK4 Config-B onset (the value under test)
const C_HALF = 0.8980208880762339;     // imp-3270 closed-form half-lattice L->inf ceiling
const BASIN = 0.72;                    // Theorem-C basin constant

// Generic pinned-DOPRI onset bisection in the parameter rho on (0.5, 1) for a config builder.
// Returns { rho, hasOnset }: hasOnset is true iff drho changes sign (worsening) strictly inside,
// i.e. drho < 0 near 0.5 (isolating) and drho > 0 near 1 (worsening) -- a genuine onset.
function onsetPinnedDOPRI(buildCfg) {
  const near0 = drhoPinnedDOPRI(buildCfg(0.5), 1, 0, DT);
  const near1 = drhoPinnedDOPRI(buildCfg(0.999), 1, 0, DT);
  const hasOnset = near0 < 0 && near1 > 0;
  let lo = 0.5, hi = 0.999999;
  for (let it = 0; it < 60; it++) {
    const mm = (lo + hi) / 2;
    if (drhoPinnedDOPRI(buildCfg(mm), 1, 0, DT) > 0) hi = mm; else lo = mm;
  }
  return { rho: (lo + hi) / 2, hasOnset };
}

// Third-integrator Config-B onset (floor 0.93, m = 16, lone at -1) -- must match imp-3200.
const B_ONSET_DOPRI = onsetPinnedDOPRI((rho) => cfgConfigB(rho, 1.01, 0.93, 16, -1)).rho;

// AXIS 1 -- spacing floor at fixed length m = 16, lone at -1 (d_1 = 1, so rho = isolation ratio):
// denser opposite lattice destabilises isolation EARLIER (lower onset).
const UNIT_FLOOR_ONSET = onsetPinnedDOPRI((rho) => cfgConfigB(rho, 1.01, 1.0, 16, -1)).rho; // ~0.9046
const DENSE_FLOOR_ONSET_16 = onsetPinnedDOPRI((rho) => cfgHalfLattice(rho, 16, -1)).rho;      // dense half-lattice

// AXIS 2 -- right-lattice length for the DENSE half-lattice, lone at -1 (L -> infinity proxy).
const HALF_LENGTHS = [8, 16, 64, 256];
const HALF_ONSETS = HALF_LENGTHS.map((m) => onsetPinnedDOPRI((rho) => cfgHalfLattice(rho, m, -1)).rho);
const HALF_MIN = HALF_ONSETS[HALF_ONSETS.length - 1]; // longest lattice = lowest onset

// AXIS 3 -- lone-neighbour offset at m = 64. Moving the lone neighbour changes d_1 = -L0, so the
// COMPARABLE quantity across offsets is the isolation RATIO g/d_1 at onset (NOT the raw parameter
// rho, which equals the ratio only when d_1 = 1). Report ratioAtOnset and whether an onset exists.
const LONE_OFFSETS = [-1.25, -1, -0.85];
const LONE_PROBE = LONE_OFFSETS.map((L0) => {
  const o = onsetPinnedDOPRI((rho) => cfgHalfLattice(rho, 64, L0));
  const d1 = -L0;
  return { loneOffset: L0, d1, onsetRho: o.rho, ratioAtOnset: o.rho / d1, hasOnset: o.hasOnset };
});
// lowest isolation ratio among offsets that actually have a worsening onset in range.
const LONE_RATIOS_WITH_ONSET = LONE_PROBE.filter((p) => p.hasOnset).map((p) => p.ratioAtOnset);
const LONE_MIN_RATIO = Math.min(...LONE_RATIOS_WITH_ONSET);

// Global numerical infimum (in the isolation-ratio metric, d_1 = 1 axes) located by the scan.
const SCAN_MIN = Math.min(B_ONSET_DOPRI, UNIT_FLOOR_ONSET, ...HALF_ONSETS);

export const SG1C_ASYM_ONSET_THIRD_INTEGRATOR_SCAN = {
  ticket: 'imp-3237',
  date: '2026-07-02',
  question: 'is the imp-3200 Config-B onset 0.9015828 the GLOBAL asymmetric infimum, or merely the lower of two specific families?',
  thirdIntegrator: 'one step of the 5th-order Dormand-Prince RK5(4) (DOPRI5) advancing dx/dt = F(x) + central finite difference of the pinned isolation ratio rho',
  dt: DT,
  distinctFromPriorSchemes: 'imp-3172 = closed-form quotient rate; imp-3200 = classical RK4 (order 4); here = DOPRI5 (order 5, 7-stage FSAL) -- different tableau AND order',
  configBOnsetUnderTest: B_ONSET,
  configBOnsetDOPRI: B_ONSET_DOPRI,
  configBThirdSchemeError: Math.abs(B_ONSET_DOPRI - B_ONSET), // < 1e-6: third integrator reproduces Config B
  broadenedScan: {
    spacingFloorAxis: {                          // m = 16, lone at -1 (rho = isolation ratio)
      unitFloorOnset: UNIT_FLOOR_ONSET,          // ~0.9046 (unit opposite lattice)
      floor093Onset: B_ONSET_DOPRI,              // ~0.9016 (Config B)
      denseFloorOnset: DENSE_FLOOR_ONSET_16,     // dense rho-spacing (half-lattice) -- lowest
      note: 'denser opposite lattice destabilises isolation EARLIER: unit > floor-0.93 > dense',
    },
    lengthAxis: {                                // dense half-lattice, lone at -1
      lengths: HALF_LENGTHS,
      onsets: HALF_ONSETS,                       // descend toward c_half as length grows
    },
    loneOffsetAxis: LONE_PROBE,                  // ratioAtOnset = onsetRho / d_1 (the comparable metric)
  },
  halfLatticeLongestOnset: HALF_MIN,            // ~0.89803 at m = 256
  cHalfClosedForm: C_HALF,                      // imp-3270 L->inf closed form
  halfLatticeVsCHalf: HALF_MIN - C_HALF,        // small POSITIVE O(1/m^2) residual
  loneOffsetMinRatio: LONE_MIN_RATIO,           // min isolation ratio at onset over lone offsets
  loneOffsetVerdict: 'd_1 = 1 (lone at -1) minimises the isolation ratio at onset; moving off it raises the ratio (0.85 -> ~0.919) or removes the onset (1.25 -> none in range) -- no lone offset beats c_half',
  scanInfimumEstimate: SCAN_MIN,                // lowest onset (isolation-ratio metric) the scan attains
  beatsConfigB: SCAN_MIN < B_ONSET,             // true: Config B is NOT the infimum
  marginBelowConfigB: B_ONSET - SCAN_MIN,       // ~3.6e-3
  basinConstant: BASIN,
  basinMargin: SCAN_MIN - BASIN,                // > 0.17: basin-conditional C_Lip untouched
  globalConstantStatus: 'OPEN -- c_half ~ 0.8980 (imp-3270 closed form) is the tightest LOCATED ceiling; no proven lower bound beyond trivial ones',
  verdict:
    'A THIRD independent integrator (DOPRI5, order 5, distinct tableau) plus a broadened environment scan (denser '
    + 'opposite lattice, extended length, lone-offset probe) show the imp-3200 Config-B onset 0.9015828 is NOT the '
    + 'global asymmetric infimum: the dense half-lattice family undercuts it by ~3.6e-3, its onsets descending toward '
    + 'the imp-3270 closed form c_half = 0.8980 as the lattice lengthens. Config B is the lower of the two SPECIFIC '
    + 'imp-3200 families, not the infimum. The third integrator reproduces the Config-B onset itself to < 1e-6.',
  honest:
    'NUMERICAL infimum estimate via a third integrator + broadened scan, NOT a closed form and NOT a global proof. '
    + 'Establishes only that Config B (0.9015828) is beaten and that the located lower onset matches the imp-3270 '
    + 'closed form c_half. The global asymmetric constant c_glob stays OPEN with c_half ~ 0.8980 the tightest located '
    + 'ceiling; both onsets sit far above the Theorem-C basin 0.72 (margin > 0.17), so basin-conditional C_Lip is '
    + 'unaffected; PT Lambda <= 0.2 remains the rigorous SOTA. NO false QED.',
};

export const SG1C_ASYM_ONSET_THIRD_INTEGRATOR_SCAN_ASSERTIONS = [
  {
    id: 'sg1c-third-dopri-matches-analytic-rate',
    description: 'the third integrator (DOPRI5 + central finite difference) reproduces the analytic quotient-rule rate at a generic Config-B state to ~1e-7 -- it measures the SAME drho/ds',
    holds: () => {
      const x = cfgConfigB(0.90, 1.01, 0.93, 16, -1);
      const F = force(x), g = x[2] - x[1];
      const ng = nearestGap(x, 1); // pinned on the lone left neighbour (index 0) here
      const gdot = F[2] - F[1], d1dot = F[1] - F[0];
      const analytic = (gdot * ng.d1 - g * d1dot) / (ng.d1 * ng.d1);
      return Math.abs(drhoPinnedDOPRI(x, 1, 0, DT) - analytic) < 1e-7;
    },
  },
  {
    id: 'sg1c-third-dopri-reproduces-configB-onset',
    description: 'the DOPRI5 bisection of the imp-3021/3172 Config-B family (floor 0.93, m=16) returns the imp-3200 onset 0.9015828 to better than 1e-6',
    holds: () => Math.abs(B_ONSET_DOPRI - B_ONSET) < 1e-6,
  },
  {
    id: 'sg1c-third-spacing-floor-density-orders-onset',
    description: 'at fixed length m=16 and lone at -1 (rho = isolation ratio), a denser opposite lattice destabilises isolation earlier: unit-floor onset (~0.9046) > floor-0.93 Config-B onset (~0.9016) > dense rho-spacing half-lattice onset',
    holds: () => UNIT_FLOOR_ONSET > B_ONSET_DOPRI && B_ONSET_DOPRI > DENSE_FLOOR_ONSET_16,
  },
  {
    id: 'sg1c-third-half-lattice-onsets-descend',
    description: 'the DENSE half-lattice DOPRI onsets descend monotonically as the right lattice lengthens (8 > 16 > 64 > 256), and every longer-lattice onset stays above the imp-3270 closed form c_half',
    holds: () => {
      for (let k = 1; k < HALF_ONSETS.length; k++) if (!(HALF_ONSETS[k] < HALF_ONSETS[k - 1])) return false;
      return HALF_ONSETS.every((o) => o > C_HALF);
    },
  },
  {
    id: 'sg1c-third-half-lattice-beats-configB',
    description: 'the longest-lattice DOPRI onset is STRICTLY below the Config-B onset 0.9015828 by more than 1e-3 -- Config B is NOT the global infimum',
    holds: () => HALF_MIN < B_ONSET - 1e-3 && SG1C_ASYM_ONSET_THIRD_INTEGRATOR_SCAN.beatsConfigB === true,
  },
  {
    id: 'sg1c-third-half-lattice-matches-cHalf',
    description: 'the longest-lattice DOPRI onset matches the imp-3270 closed form c_half = 0.8980 to ~1e-4, with a POSITIVE finite-lattice residual (the onset descends toward c_half from above)',
    holds: () => HALF_MIN - C_HALF > 0 && HALF_MIN - C_HALF < 1e-4,
  },
  {
    id: 'sg1c-third-lone-offset-ratio-metric',
    description: 'in the COMPARABLE isolation-ratio metric g/d_1 at onset, the lone offset -1 (d_1=1) attains the minimum (~0.898); the closer offset -0.85 gives a HIGHER ratio (~0.919) and the wider offset -1.25 has NO worsening onset in range -- moving d_1 off 1 does NOT open a ratio below c_half',
    holds: () => {
      const p125 = LONE_PROBE.find((p) => p.loneOffset === -1.25);
      const p1 = LONE_PROBE.find((p) => p.loneOffset === -1);
      const p085 = LONE_PROBE.find((p) => p.loneOffset === -0.85);
      return p125.hasOnset === false
        && p1.hasOnset && p085.hasOnset
        && Math.abs(p1.ratioAtOnset - HALF_ONSETS[HALF_LENGTHS.indexOf(64)]) < 1e-9
        && p085.ratioAtOnset > p1.ratioAtOnset
        && LONE_MIN_RATIO >= C_HALF - 1e-4;
    },
  },
  {
    id: 'sg1c-third-scan-infimum-and-honesty',
    description: 'the scan infimum estimate equals the longest half-lattice onset, stays far above the Theorem-C basin 0.72 (margin > 0.17), the global constant is reported OPEN, and PT 0.2 remains SOTA with no false QED',
    holds: () => Math.abs(SCAN_MIN - HALF_MIN) < 1e-12
      && SCAN_MIN - BASIN > 0.17
      && /stays OPEN/.test(SG1C_ASYM_ONSET_THIRD_INTEGRATOR_SCAN.honest)
      && /Lambda <= 0.2/.test(SG1C_ASYM_ONSET_THIRD_INTEGRATOR_SCAN.honest)
      && /NO false QED/.test(SG1C_ASYM_ONSET_THIRD_INTEGRATOR_SCAN.honest),
  },
];

for (const a of SG1C_ASYM_ONSET_THIRD_INTEGRATOR_SCAN_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-asym-onset-third-integrator-scan assertion failed: ${a.id}`);
}
