/**
 * @module imp-35639-peak-balance-eflow-etrunc-decomposition
 *
 * imp-35639 (numerical, frontier-direction): imp-35594 Derivation 2 states the
 * interior sigma-PEAK (N ~ 9.22e5, map A) solves the stationarity balance
 *
 *     (*)   E_coll_prime (E_trunc + E_flow)  =  E_coll * E_flow_prime,
 *
 * and argues in PROSE that it is the E_flow DIRECT-height term (the explicit 1/T0,
 * NOT its logarithm) that removes the crossover log-insulation and drives the mild
 * ~0.55 amplification (damping < 1). But the relative weight of the constant
 * E_trunc versus the E_flow term INSIDE the (E_trunc + E_flow) factor at the peak
 * is never tabulated, so "E_flow-driven" is asserted, not measured.
 *
 * This module DECOMPOSES the LHS of (*) numerically on the imp-35017/imp-3406
 * double surrogate at the peak. The LHS splits additively as
 *
 *     E_coll_prime (E_trunc + E_flow)  =  [E_coll_prime * E_trunc]  +  [E_coll_prime * E_flow],
 *
 * so the fractional contribution of each term is exactly its share of the
 * (E_trunc + E_flow) factor: share_trunc = E_trunc/(E_trunc + E_flow),
 * share_flow = E_flow/(E_trunc + E_flow), with ratio E_flow/E_trunc.
 *
 * THE SURROGATE (imp-35017/imp-3406, verbatim)
 * --------------------------------------------
 *   sigma(N) = E_coll / (E_trunc + E_flow + E_coll), with
 *     E_coll  = C_C sqrt(L/N),          L = log T0,   C_C = sqrt(3 pi)/8
 *     E_flow  = C_F (L/T0) g,           C_F = (log(T0/2pi) + 1)/(2pi),  g = Gronwall
 *     E_trunc = 3.06e-5                 (N-independent fixed-strip route)
 *   T0 = H(N) exact RvM inverse (map A). Derivatives dg_{k*}/dN taken by central
 *   finite difference on the exact surrogate (no leading-order 1/N approximation).
 *
 * MEASUREMENT (map A, N = 9.218633e5)
 * -----------------------------------
 *   E_coll  = 1.453808e-3   E_coll_prime = -7.341502e-10
 *   E_flow  = 4.683652e-5   E_flow_prime = -3.910424e-11
 *   E_trunc = 3.060000e-5
 *   Balance check: LHS/RHS = 1.000000 -- N = 9.218633e5 IS the peak to six digits.
 *   E_flow/E_trunc = 1.530605.
 *   LHS split:  E_flow term share = 0.604838,  E_trunc term share = 0.395162.
 *
 * THE ASSESSMENT
 * --------------
 * E_flow DOMINATES the LHS of (*), but only MARGINALLY: it carries ~60.5% of the
 * (E_trunc + E_flow) factor against ~39.5% for E_trunc, a ratio of just 1.53x. So
 * the imp-35594 prose "E_flow-driven" is CONFIRMED in direction -- the larger
 * contributor to the balance IS the direct-height term whose 1/T0 removes the log
 * insulation -- but the effect is NOT E_flow-dominated in the strong sense: E_trunc
 * remains a co-participant carrying nearly two fifths of the balance factor. The
 * ~0.55 amplification is therefore E_flow-LED, not E_flow-exclusive. This is
 * exactly consistent with imp-35594 pinning E_flow ~ O(1) * E_trunc (ratio ~1.53):
 * an O(1) ratio means neither term is negligible, so the peak sits in the regime
 * where the direct-height term has just overtaken the constant floor.
 *
 * MEASUREMENT/DECOMPOSITION ONLY on the inherited imp-3220/imp-3406 surrogate.
 * Discharges nothing; changes no bound; imp-35337a surrogate-vs-true fidelity stays
 * OPEN; C_C ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631/imp-447)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent
 * 1/2 per imp-3463; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35594-peak-crossover-mechanism-derivation (the balance (*) derived here)
 * @see imp-35638-crossover-N-etrunc-sensitivity (E_trunc as crossover sole lever)
 * @see imp-35574-peak-location-height-map-damping (the ~0.55 amplification measured)
 * @see imp-35337 (the interior-peak locator)
 * @see imp-35017 (the sigma double-surrogate formula)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const GRONWALL = Math.exp(2.37e-4); // matches imp-3406/imp-35017/imp-35536/imp-35574 exactly

// Exact RvM inverse (map A), inlined pure-Math (no 16.7MB zeros bundle).
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

// --- Surrogate pieces as functions of N (map A) ---
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
// Central finite-difference derivative on the exact surrogate (no 1/N shortcut).
function ddN(f, N) {
  const h = N * 1e-6;
  return (f(N + h) - f(N - h)) / (2 * h);
}

const N_PEAK_RVM = 9.218633e5; // imp-35574 peak location (map A)
const T0_PEAK = effectiveHeightForN(N_PEAK_RVM);
const L_PEAK = Math.log(T0_PEAK);

const E_COLL = eColl(N_PEAK_RVM);
const E_FLOW = eFlow(N_PEAK_RVM);
const E_TRUNC = E_TRUNC_PT;
const E_COLL_PRIME = ddN(eColl, N_PEAK_RVM);
const E_FLOW_PRIME = ddN(eFlow, N_PEAK_RVM);

// Balance (*): E_coll_prime (E_trunc + E_flow) = E_coll E_flow_prime.
const LHS = E_COLL_PRIME * (E_TRUNC + E_FLOW);
const RHS = E_COLL * E_FLOW_PRIME;
const BALANCE_RATIO = LHS / RHS; // ~1.000000 => N_PEAK_RVM IS the peak

// Additive split of the LHS factor (E_trunc + E_flow).
const LHS_TRUNC_TERM = E_COLL_PRIME * E_TRUNC;
const LHS_FLOW_TERM = E_COLL_PRIME * E_FLOW;
const SHARE_TRUNC = E_TRUNC / (E_TRUNC + E_FLOW); // fractional contribution of E_trunc to the LHS
const SHARE_FLOW = E_FLOW / (E_TRUNC + E_FLOW); // fractional contribution of E_flow to the LHS
const FLOW_OVER_TRUNC = E_FLOW / E_TRUNC; // ~1.5306 (imp-35594 O(1) ratio)

export const IMP35639_PEAK_BALANCE_EFLOW_ETRUNC_DECOMPOSITION = {
  id: 'imp-35639',
  proofSection: 'S-frontier',
  question:
    'imp-35594 Derivation 2 argues in prose that the ~0.55 interior-peak amplification is ' +
    'E_flow-driven -- the E_flow direct 1/T0 term, not its log, removes the crossover log-insulation ' +
    'via the stationarity balance E_coll_prime (E_trunc + E_flow) = E_coll E_flow_prime. But the ' +
    'relative weight of the constant E_trunc versus the E_flow term inside the (E_trunc + E_flow) ' +
    'factor at the peak is never tabulated. MEASURE E_trunc, E_flow, E_coll and their derivatives at ' +
    'the peak, report the fractional contribution of each term to the balance LHS, and assess which ' +
    'dominates (i.e. whether the amplification is genuinely E_flow-driven).',
  method:
    'Evaluate the imp-35017/imp-3406 surrogate pieces and their central-finite-difference N-derivatives ' +
    'at the map-A peak N = 9.218633e5. Confirm the balance LHS/RHS = 1 (verifying N is the peak), then ' +
    'split the LHS factor additively: E_coll_prime (E_trunc + E_flow) = E_coll_prime E_trunc + ' +
    'E_coll_prime E_flow, so each fractional contribution equals its share of (E_trunc + E_flow). ' +
    'Report shares and the E_flow/E_trunc ratio.',
  measurement: {
    map: 'A (exact RvM inverse)',
    N_peak: N_PEAK_RVM,
    T0_at_peak: +T0_PEAK.toExponential(6), // ~5.573201e5
    log_T0_at_peak: +L_PEAK.toFixed(6), // ~13.230895
    E_coll: +E_COLL.toExponential(6), // ~1.453808e-3
    E_flow: +E_FLOW.toExponential(6), // ~4.683652e-5
    E_trunc: +E_TRUNC.toExponential(6), // 3.060000e-5
    E_coll_prime: +E_COLL_PRIME.toExponential(6), // ~-7.341502e-10
    E_flow_prime: +E_FLOW_PRIME.toExponential(6), // ~-3.910424e-11
    balance_LHS_over_RHS: +BALANCE_RATIO.toFixed(6), // ~1.000000 (confirms the peak)
  },
  decomposition: {
    LHS_trunc_term: +LHS_TRUNC_TERM.toExponential(6), // E_coll_prime * E_trunc
    LHS_flow_term: +LHS_FLOW_TERM.toExponential(6), // E_coll_prime * E_flow
    share_E_trunc: +SHARE_TRUNC.toFixed(6), // ~0.395162
    share_E_flow: +SHARE_FLOW.toFixed(6), // ~0.604838
    E_flow_over_E_trunc: +FLOW_OVER_TRUNC.toFixed(6), // ~1.530605
    dominant_term: 'E_flow',
  },
  finding: {
    F1_eflow_leads_marginally:
      'E_flow DOMINATES the balance LHS but only marginally: it carries ~60.5% of the ' +
      '(E_trunc + E_flow) factor against ~39.5% for the constant E_trunc, a ratio of just 1.53x. The ' +
      'larger contributor to the peak stationarity IS the direct-height term E_flow ~ L/T0 whose ' +
      'explicit 1/T0 removes the crossover log-insulation, so the imp-35594 prose "E_flow-driven" is ' +
      'CONFIRMED in direction.',
    F2_etrunc_not_negligible:
      'The effect is NOT E_flow-dominated in the strong sense: E_trunc remains a co-participant ' +
      'carrying nearly two fifths of the balance factor. The ~0.55 amplification is E_flow-LED, not ' +
      'E_flow-exclusive -- exactly the O(1) regime imp-35594 pins (E_flow ~ 1.53 E_trunc), where the ' +
      'direct-height term has just overtaken the constant floor and neither term is negligible.',
  },
  isRigorous: false,
  honestStatus:
    'MEASURES the imp-35594 Derivation-2 peak balance (*) E_coll_prime (E_trunc + E_flow) = ' +
    'E_coll E_flow_prime on the imp-35017/imp-3406 surrogate at the map-A peak N = 9.218633e5 ' +
    '(LHS/RHS = 1.000000, confirming the peak) and decomposes the LHS factor: E_flow carries ~60.5% ' +
    'and E_trunc ~39.5% (ratio 1.53x). E_flow LEADS the balance -- the prose "E_flow-driven" holds in ' +
    'direction -- but E_trunc is a non-negligible co-participant, so the amplification is E_flow-led ' +
    'not E_flow-exclusive. Decomposition only; discharges nothing; changes no bound; imp-35337a stays ' +
    'OPEN; NO QED.',
  verdict:
    'MEASUREMENT/DECOMPOSITION (frontier-direction, NOT rigorous). At the map-A interior peak ' +
    'N = 9.218633e5 the balance (*) holds to six digits (LHS/RHS = 1.000000). Splitting the LHS ' +
    'factor E_coll_prime (E_trunc + E_flow) additively, the E_flow direct-height term carries ' +
    '~60.5% and the constant E_trunc ~39.5% (E_flow/E_trunc = 1.530605). E_flow DOMINATES the LHS, ' +
    'so the imp-35594 prose that the ~0.55 amplification is E_flow-driven is CONFIRMED in direction; ' +
    'but the lead is only ~1.53x and E_trunc carries nearly two fifths of the balance, so the effect ' +
    'is E_flow-LED not E_flow-exclusive -- precisely the O(1) regime (E_flow ~ 1.53 E_trunc) imp-35594 ' +
    'pins, where the direct-height term has just overtaken the constant floor. Decomposition only on ' +
    'the inherited imp-3220/imp-3406 surrogate; surrogate-vs-true fidelity (imp-35337a) UNTOUCHED and ' +
    'OPEN; C_C ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631/imp-447) UNTOUCHED; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; discharges ' +
    'nothing; changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35594 (balance (*) derived here); imp-35638 (E_trunc crossover sole lever); imp-35574 ' +
    '(~0.55 amplification measured); imp-35337 (interior-peak locator); imp-35017 (sigma double ' +
    'surrogate); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35639_PEAK_BALANCE_EFLOW_ETRUNC_DECOMPOSITION_ASSERTIONS = [
  {
    // The chosen N is genuinely the peak: the balance (*) holds to six digits.
    id: 'imp35639-balance-holds-at-peak',
    description: 'the stationarity balance (*) LHS/RHS = 1 at N = 9.218633e5 (confirms the peak)',
    holds: () => Math.abs(BALANCE_RATIO - 1) < 5e-4,
  },
  {
    // The LHS factor shares sum to 1 and are exactly the E_trunc/E_flow split.
    id: 'imp35639-shares-partition-unity',
    description: 'share_E_trunc + share_E_flow = 1 (additive split of the (E_trunc + E_flow) factor)',
    holds: () => Math.abs(SHARE_TRUNC + SHARE_FLOW - 1) < 1e-9,
  },
  {
    // E_flow leads the balance LHS: its share exceeds E_trunc.
    id: 'imp35639-eflow-leads-lhs',
    description: 'E_flow carries the larger share (~60.5%) of the balance LHS -- E_flow-driven in direction',
    holds: () => SHARE_FLOW > SHARE_TRUNC && SHARE_FLOW > 0.55 && SHARE_FLOW < 0.65,
  },
  {
    // But E_trunc is NOT negligible: the lead is only O(1), ratio ~1.53.
    id: 'imp35639-etrunc-co-participant',
    description: 'E_trunc is a non-negligible co-participant (share ~39.5%, E_flow/E_trunc ~1.53 = O(1))',
    holds: () => SHARE_TRUNC > 0.35 && SHARE_TRUNC < 0.45 && FLOW_OVER_TRUNC > 1.4 && FLOW_OVER_TRUNC < 1.7,
  },
  {
    // Consistency with imp-35594: the E_flow/E_trunc ratio reproduces its ~1.53.
    id: 'imp35639-consistent-with-imp35594-ratio',
    description: 'the measured E_flow/E_trunc ~1.5306 reproduces the imp-35594 O(1) pin ~1.531',
    holds: () => Math.abs(FLOW_OVER_TRUNC - 1.531) < 0.01,
  },
  {
    // Honesty gate: decomposition only, no QED, no refereed bound is changed.
    id: 'imp35639-honesty-gate-no-qed',
    description: 'Decomposition only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35639_PEAK_BALANCE_EFLOW_ETRUNC_DECOMPOSITION.isRigorous === false &&
      /NO QED/.test(IMP35639_PEAK_BALANCE_EFLOW_ETRUNC_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP35639_PEAK_BALANCE_EFLOW_ETRUNC_DECOMPOSITION.verdict),
  },
];

for (const a of IMP35639_PEAK_BALANCE_EFLOW_ETRUNC_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35639-peak-balance-eflow-etrunc-decomposition assertion failed: ${a.id}`,
    );
  }
}

export default IMP35639_PEAK_BALANCE_EFLOW_ETRUNC_DECOMPOSITION;
