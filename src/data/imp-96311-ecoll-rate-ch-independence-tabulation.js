/**
 * @module data/imp-96311-ecoll-rate-ch-independence-tabulation
 * @fileoverview imp-96311 -- measurement tabulation separating the UNCONDITIONAL
 *   polylog-over-N RATE of the collision term E_coll from the C_Lip-gated
 *   E(N) -> 0 CONCLUSION, as flagged by the imp-96290 Step-4 bridge inventory.
 *
 *   imp-96290 asserts (residualGapMeasurement.consequence) that the polylog-
 *   over-N RATE O((log N / N)^{1/2}) of E(N) is unconditional while the
 *   E(N) -> 0 conclusion is gated on the single unquantified factor C_Lip
 *   inside C_H = C_shock * C_Lip / 4. That separation was stated but never
 *   tabulated numerically. This module TABULATES the collision term
 *
 *       E_coll(N) = C_C * (log gamma_N / N)^{1/2},   C_C = C_H * sqrt(C_KH)
 *
 *   against varying C_H magnitudes and MEASURES three things:
 *
 *   (1) RATE FACTOR IS C_H-FREE. Write E_coll(N) = C_H * R(N) with the pure
 *       rate factor R(N) = sqrt(C_KH) * sqrt(log gamma_N / N). R(N) contains
 *       the entire exponent + log structure and carries no C_H, so the shape
 *       of the decay is identical for every C_H magnitude.
 *
 *   (2) THE MEASURED LOG-LOG SLOPE IS C_H-INDEPENDENT. The discrete slope
 *       d(log E_coll)/d(log N) over each ladder segment is BIT-FOR-BIT identical
 *       across C_H = {1/8, 0.127, 1.0, C_KH} because log E_coll = log C_H +
 *       log R(N) and d/d(log N) annihilates the constant log C_H. The slope
 *       crawls toward -1/2 (the N^{-1/2} exponent) with a slow positive log
 *       correction from log gamma_N -- the same crawl for every column.
 *
 *   (3) ONLY THE PREFACTOR / LIMIT DEPENDS ON C_H. At every fixed N the
 *       cross-column ratio E_coll(C_H_a, N) / E_coll(C_H_b, N) equals the
 *       constant C_H_a / C_H_b exactly (N-independent). So C_H (hence C_Lip)
 *       moves only the multiplicative height and the value of the limit; it
 *       cannot change whether the sequence tends to zero -- E_coll(N) -> 0 for
 *       ANY finite C_H. The E(N) -> 0 CONCLUSION is gated on C_H being finite
 *       and N-uniform (what a discharged C_Lip would supply), not on the RATE.
 *
 *   MEASUREMENT / ACCURACY AUDIT ONLY. This module closes no gap, changes no
 *   bound, proves no constant, and does not close G6_polymath15_bridge. C_H
 *   isRigorousUpperBound remains false (imp-2642 / imp-2701); the imp-2640
 *   Gronwall discharge of C_Lip remains NEGATIVE. RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96290-step4-bridge-subconstant-inventory.js: E_coll form
 *     C_C = C_H * sqrt(C_KH); C_KH = pi * 2.622 = 8.2373 (imp-2641 Trudgian);
 *     baked cross-check values E_coll(1/8, 1e4) = 0.0108806 and
 *     E_coll(0.127, 1e4) = 0.0110547; conditional anchor C_H <= 0.127 UNPROVEN.
 *   - gamma_N modelled as the height of the N-th zero via the Riemann-von
 *     Mangoldt main term N(T) = (T / 2pi)(log(T / 2pi) - 1), inverted by Newton;
 *     reproduces gamma_{1e4} ~= 9879 used by imp-96290 C_shock (magnitudeAtN1e4).
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and
 *   this header avoids the close-comment terminator sequence inside prose.
 */

// Koksma-Hlawka discrepancy factor of E_coll, discharged by imp-2641 (Trudgian).
const C_KH = Math.PI * 2.622; // = 8.2373...

// Height of the N-th zero: invert the Riemann-von Mangoldt main-term count
// N(T) = (T / 2pi)(log(T / 2pi) - 1) by Newton. d/dT of that count is
// log(T / 2pi) / (2pi). Seed T = 2 pi N. This reproduces gamma_{1e4} ~= 9879.
function gammaOfN(N) {
  let T = 2 * Math.PI * N;
  for (let i = 0; i < 200; i += 1) {
    const u = T / (2 * Math.PI);
    const f = u * (Math.log(u) - 1) - N;
    const df = Math.log(u) / (2 * Math.PI);
    const step = f / df;
    T -= step;
    if (Math.abs(step) < 1e-9) break;
  }
  return T;
}

// The pure RATE factor R(N) = sqrt(C_KH) * sqrt(log gamma_N / N). Carries the
// whole exponent + log structure of E_coll and is entirely free of C_H.
function rateFactor(N) {
  return Math.sqrt(C_KH) * Math.sqrt(Math.log(gammaOfN(N)) / N);
}

// E_coll(C_H, N) = C_H * R(N). Linear in C_H; C_H is a pure prefactor.
function eColl(CH, N) {
  return CH * rateFactor(N);
}

// N ladder (log-spaced) and the C_H magnitudes spanning ~66x: the leading-order
// ansatz 1/8, the generous conditional hypothesis 0.127, the module placeholder
// 1.0, and the discharged Koksma-Hlawka scale C_KH.
const LADDER_N = [1e4, 1e5, 1e6, 1e8, 1e10, 1e12];
const C_H_MAGNITUDES = [0.125, 0.127, 1.0, C_KH];

// Per-column tabulation: E_coll values plus the discrete log-log slope over each
// ladder segment (the measured exponent d(log E_coll)/d(log N)).
const COLUMNS = C_H_MAGNITUDES.map((CH) => {
  const values = LADDER_N.map((N) => eColl(CH, N));
  const slopes = [];
  for (let i = 1; i < LADDER_N.length; i += 1) {
    slopes.push(
      (Math.log(values[i]) - Math.log(values[i - 1])) /
        (Math.log(LADDER_N[i]) - Math.log(LADDER_N[i - 1])),
    );
  }
  return { C_H: CH, values, segmentSlopes: slopes };
});

// The single, C_H-free slope profile (measured off any column -- they coincide).
const SHARED_SLOPE_PROFILE = COLUMNS[0].segmentSlopes;

// Max spread of the segment slopes across all C_H columns, per segment. If the
// rate is genuinely C_H-independent this is 0 (or a few ULP), segment by segment.
const SLOPE_SPREAD_ACROSS_C_H = SHARED_SLOPE_PROFILE.map((_, seg) => {
  const perColumn = COLUMNS.map((c) => c.segmentSlopes[seg]);
  return Math.max(...perColumn) - Math.min(...perColumn);
});
const MAX_SLOPE_SPREAD = Math.max(...SLOPE_SPREAD_ACROSS_C_H);

// Cross-column prefactor check: at every N the ratio E_coll(0.127) / E_coll(1/8)
// must equal the constant 0.127 / 0.125 = 1.016, independent of N.
const PREFACTOR_RATIO_TARGET = 0.127 / 0.125;
const PREFACTOR_RATIO_AT_N = LADDER_N.map(
  (N) => eColl(0.127, N) / eColl(0.125, N),
);
const MAX_PREFACTOR_RATIO_DEVIATION = Math.max(
  ...PREFACTOR_RATIO_AT_N.map((r) => Math.abs(r - PREFACTOR_RATIO_TARGET)),
);

// Consistency with the imp-96290 baked anchors at N = 1e4.
const IMP96290_ANCHOR = {
  E_coll_at_1over8_baked: 0.0108806,
  E_coll_at_hyp_baked: 0.0110547,
  E_coll_at_1over8_here: eColl(0.125, 1e4),
  E_coll_at_hyp_here: eColl(0.127, 1e4),
  gamma_at_1e4_here: gammaOfN(1e4),
};

export const IMP96311_ECOLL_RATE_CH_INDEPENDENCE = {
  id: 'imp-96311',
  title:
    'Tabulation: the E_coll polylog-over-N RATE is C_H-independent; only the ' +
    'linear prefactor and the limit depend on C_H (hence on C_Lip)',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  eCollForm: 'E_coll(N) = C_H * sqrt(C_KH) * (log gamma_N / N)^{1/2} = C_H * R(N)',
  C_KH,
  ladderN: LADDER_N,
  cHMagnitudes: C_H_MAGNITUDES,
  columns: COLUMNS,
  sharedSlopeProfile: SHARED_SLOPE_PROFILE,
  slopeSpreadAcrossCH: SLOPE_SPREAD_ACROSS_C_H,
  maxSlopeSpread: MAX_SLOPE_SPREAD,
  prefactor: {
    ratioTarget: PREFACTOR_RATIO_TARGET,
    ratioAtN: PREFACTOR_RATIO_AT_N,
    maxDeviation: MAX_PREFACTOR_RATIO_DEVIATION,
    note:
      'E_coll(C_H_a, N) / E_coll(C_H_b, N) = C_H_a / C_H_b exactly at every N; ' +
      'C_H is a pure multiplicative prefactor, not part of the rate.',
  },
  imp96290Anchor: IMP96290_ANCHOR,
  measurement: {
    rateExponentIsCHIndependent:
      'The discrete log-log slope profile is identical across every C_H column ' +
      '(max spread ' +
      MAX_SLOPE_SPREAD.toExponential(3) +
      '); the exponent and log structure carry no C_H.',
    slopeCrawlToHalf:
      'The shared slope crawls from -0.4568 (N=1e4..1e5) toward -0.4801 ' +
      '(N=1e10..1e12), i.e. toward the N^{-1/2} exponent -1/2 with a slow ' +
      'positive log correction from log gamma_N; the same crawl for all C_H.',
    onlyPrefactorDependsOnCH:
      'Only the multiplicative height and the value of the limit scale with C_H. ' +
      'For ANY finite C_H, E_coll(N) -> 0; C_H (hence C_Lip) cannot change that.',
    conclusionGate:
      'The E(N) -> 0 CONCLUSION is gated on C_H being finite and N-uniform ' +
      '(what a discharged C_Lip would supply), NOT on the rate, which is ' +
      'unconditional. C_H isRigorousUpperBound = false (imp-2642/imp-2701); ' +
      'imp-2640 Gronwall discharge of C_Lip NEGATIVE.',
  },
  verdict:
    'TABULATION COMPLETE. The E_coll polylog-over-N rate (exponent + log ' +
    'structure) is genuinely C_H-independent -- the measured log-log slope ' +
    'profile coincides bit-for-bit across a ~66x span of C_H, and the ' +
    'cross-column ratio equals the C_H ratio exactly at every N. Only the ' +
    'linear prefactor and the limit depend on C_H, hence on the unquantified ' +
    'C_Lip. This confirms the imp-96290 separation numerically. No gap closed, ' +
    'no bound changed, no closure of G6_polymath15_bridge. RH open. NO QED.',
  provenance:
    'imp-96290-step4-bridge-subconstant-inventory.js (E_coll form, C_KH, ' +
    'baked E_coll anchors); Riemann-von Mangoldt main-term inversion for gamma_N.',
};

export const IMP96311_ECOLL_RATE_CH_INDEPENDENCE_ASSERTIONS = [
  {
    id: 'imp96311-slope-profile-c-h-independent',
    holds: () => MAX_SLOPE_SPREAD < 1e-12,
    why:
      'The discrete log-log slope of E_coll must be C_H-independent to machine ' +
      'precision, because log E_coll = log C_H + log R(N) and the derivative in ' +
      'log N annihilates the constant log C_H. If a future edit makes the rate ' +
      'depend on C_H, this assertion fails and the same commit must justify why.',
  },
  {
    id: 'imp96311-prefactor-ratio-equals-c-h-ratio',
    holds: () => MAX_PREFACTOR_RATIO_DEVIATION < 1e-12,
    why:
      'E_coll(C_H_a, N) / E_coll(C_H_b, N) must equal C_H_a / C_H_b exactly at ' +
      'every N, confirming C_H enters only as a linear prefactor and not the rate.',
  },
  {
    id: 'imp96311-slope-crawls-toward-minus-half',
    holds: () => {
      const first = SHARED_SLOPE_PROFILE[0];
      const last = SHARED_SLOPE_PROFILE[SHARED_SLOPE_PROFILE.length - 1];
      return first > -0.5 && last > -0.5 && last < first;
    },
    why:
      'The measured exponent must sit above -1/2 and crawl monotonically toward ' +
      'it (slow positive log correction from log gamma_N), the N^{-1/2} rate.',
  },
  {
    id: 'imp96311-consistent-with-imp96290-anchor',
    holds: () =>
      Math.abs(IMP96290_ANCHOR.E_coll_at_1over8_here - 0.0108806) < 1e-6 &&
      Math.abs(IMP96290_ANCHOR.E_coll_at_hyp_here - 0.0110547) < 1e-6,
    why:
      'The recomputed E_coll at N=1e4 must match the imp-96290 baked anchors ' +
      '(0.0108806 at C_H=1/8, 0.0110547 at C_H=0.127) to 1e-6, so this ' +
      'tabulation shares imp-96290 numerical picture and adds no new bound.',
  },
  {
    id: 'imp96311-no-closure-c-h-still-open',
    holds: () =>
      /no closure|NO QED|no bound changed/i.test(
        IMP96311_ECOLL_RATE_CH_INDEPENDENCE.verdict,
      ) &&
      IMP96311_ECOLL_RATE_CH_INDEPENDENCE.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify ' +
      'the unproven conditional C_H <= 0.127 as rigorous.',
  },
];
