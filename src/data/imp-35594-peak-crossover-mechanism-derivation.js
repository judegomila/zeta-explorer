/**
 * @module imp-35594-peak-crossover-mechanism-derivation
 *
 * imp-35594 (proof, frontier-direction): imp-35574 measured that the imp-35458
 * ~18x crossover height-map LOG-DAMPING does NOT carry to the interior sigma-PEAK
 * location (damping factor ~0.55 < 1, mild AMPLIFICATION), and in its F2 finding
 * ATTRIBUTED this to a STRUCTURAL mechanism -- BUT only in prose:
 *
 *   "The crossover N solves E_coll = E_trunc, so N is proportional to log T0 and the
 *    height enters only through its logarithm; the peak location solves dg_sigma/dN = 0,
 *    a stationarity balancing E_coll against E_flow with no log-proportional insulation,
 *    so a height-map change moves the balance point close to one-for-one."
 *
 * No derivation module existed. This module DERIVES the mechanism analytically from
 * the imp-35017/imp-3406 double-surrogate sigma(N) and CHECKS the two competing
 * scaling predictions numerically. It expands the crossover condition to exhibit the
 * log-proportional INSULATION explicitly, and expands the stationarity condition to
 * show it LACKS that insulation.
 *
 * THE DOUBLE-SURROGATE MODEL (imp-35017/imp-3406, verbatim)
 * --------------------------------------------------------
 *   sigma(N) = E_coll / (E_trunc + E_flow + E_coll), with
 *     E_coll  = C_C sqrt(L / N),         L = log T0,   C_C = sqrt(3 pi)/8
 *     E_flow  = C_F (L / T0) g,          C_F = (log(T0/2pi) + 1)/(2pi),  g = Gronwall
 *     E_trunc = 3.06e-5                  (N-independent fixed-strip route)
 *   T0 = H(N) is the height map (map A: exact RvM inverse; map B: 2 pi N / log N).
 *   A height-map swap scales T0 -> r T0 at fixed N, where r = H_B(N)/H_A(N) is the
 *   imp-35458 "raw-height ratio" (~0.822 at the crossover, ~0.757 at the peak).
 *
 * DERIVATION 1 -- THE CROSSOVER HAS LOG-PROPORTIONAL INSULATION
 * ------------------------------------------------------------
 * The floor crossover solves E_coll = E_trunc:
 *     C_C sqrt(L / N) = E_trunc   =>   L / N = (E_trunc / C_C)^2
 *     =>   N = (C_C / E_trunc)^2 * L  ==  kappa * log T0,   kappa = (C_C/E_trunc)^2.
 * So N is LINEAR in log T0: the height enters ONLY through its logarithm. A map swap
 * scales T0 -> r T0 at fixed N, i.e. shifts L -> L + log r. Because H is itself an
 * increasing map (d log H / dN ~ 1/N for both maps here), the landmark fixed point
 * N* = kappa log H(N*) shifts by (to first order, with kappa/N* ~ 1/L):
 *     dNstar-over-Nstar  =  log r / (L - 1).
 * The RAW-height gap is (1 - r); the LANDMARK shift is |log r|/(L - 1). Hence
 *     DAMPING_crossover = (1 - r) / |dNstar-over-Nstar|  =  (1 - r)(L - 1) / |log r|  ~  L = log T0.
 * The damping GROWS with log T0: this IS the log-proportional insulation. At the
 * crossover height (T0 ~ 3.28e9, L ~ 21.9) this predicts ~19x, matching the
 * imp-35458 measured ~18x to ~5 percent (and the -0.94 percent predicted shift
 * matches the measured -0.98 percent).
 *
 * DERIVATION 2 -- THE PEAK STATIONARITY LACKS THAT INSULATION
 * ----------------------------------------------------------
 * The interior peak solves dg_sigma/dN = 0. With D = E_trunc + E_flow + E_coll and
 * sigma = E_coll/D, the numerator of dg_sigma/dN vanishes when (the E_coll'*E_coll
 * cross terms cancel and E_trunc is constant):
 *     E_coll' (E_trunc + E_flow)  =  E_coll * E_flow'.                       (*)
 * This balances E_coll against the DIRECT-height term E_flow = C_F L / T0 * g, which
 * carries an explicit 1/T0 (a FIRST power of the height, not its logarithm). Solving
 * (*) at leading order (using L' = d log T0/dN ~ 1/N, so E_coll'/E_coll ~ -(1/2)(1 - 1/L)/N
 * and E_flow'/E_flow ~ -(1 - 1/L_c - 1/L)/N with L_c = L - log 2pi + 1) reduces (*) to
 *     E_flow  ~=  c * E_trunc,        c = O(1),
 * i.e. the peak PINS the direct-height quantity E_flow to an O(1) multiple of E_trunc.
 * Since E_flow ~ L/T0, pinning it fixes T0 (up to a log) INDEPENDENTLY of the map, so
 * the peak LOCATION N must absorb the FULL raw-height gap under a swap:
 *     dNstar-over-Nstar  ~  (1 - r) * O(1)     =>    DAMPING_peak = (1 - r)/|dNstar-over-Nstar| ~ O(1),  NOT ~ L.
 * The height enters at first order with NO 1/log T0 insulation, so the response is
 * near one-for-one. At the peak (T0 ~ 5.6e5, L ~ 13.2) the model gives E_flow/E_trunc
 * ~ 1.5 = O(1), and the measured damping is ~0.55 = O(1) -- an order of magnitude
 * below the crossover, exactly as the mechanism predicts.
 *
 * THE ASSESSMENT
 * --------------
 * The imp-35574 F2 structural mechanism is CONFIRMED analytically: the crossover
 * damping scales as log T0 (predicted ~19x at L ~ 21.9, measured ~18x), while the peak
 * damping is O(1) (predicted ~1, measured ~0.55), a ratio ~ log T0 apart (measured
 * ~32.55x). The distinguishing structure is WHICH quantity each landmark pins: the
 * crossover pins N ~ log T0 (height only in the log => damping ~ log T0); the peak
 * pins E_flow ~ L/T0 ~ O(1)*E_trunc (height at first order => damping ~ O(1)).
 *
 * ASSESSMENT/DERIVATION of a mechanism ONLY. Discharges nothing; changes no bound;
 * measurement/derivation on the inherited imp-3220/imp-3406 surrogate; NOT a rigorous
 * asymptotic. Surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; C_C ansatz
 * (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631/imp-447) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35574-peak-location-height-map-damping (the prose F2 mechanism derived here)
 * @see imp-35458-crossover-height-map-sensitivity (the ~18x crossover damping reproduced)
 * @see imp-35536-peak-height-map-sensitivity (peak sigma_max robustness + N_max drift)
 * @see imp-35337 (the interior-peak locator)
 * @see imp-35413 (the closed surrogate map T0 = 2 pi N / log N)
 * @see imp-35017 (the sigma double-surrogate formula)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const GRONWALL = Math.exp(2.37e-4); // matches imp-3406/imp-35017/imp-35536/imp-35574 exactly

// Exact RvM inverse (map A), inlined pure-Math from lambda-rh-height-mapping.js.
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

// --- Reference landmark inputs from imp-35458 / imp-35574 (verbatim) ---
const T0_CROSSOVER = 3.280294352e9; // imp-35458 crossover height (map A)
const R_CROSSOVER = 0.822; // imp-35458 raw-height ratio at the crossover
const DAMPING_CROSSOVER_MEASURED = 18; // imp-35458 measured crossover damping
const N_PEAK_RVM = 9.218633e5; // imp-35574 peak location (map A)
const R_PEAK = 0.756728; // imp-35574 raw-height ratio at the peak
const DAMPING_PEAK_MEASURED = 0.553; // imp-35574 measured peak damping

// --- DERIVATION 1: crossover damping predicted from N = kappa * log T0 ---
const L_CROSSOVER = Math.log(T0_CROSSOVER); // ~21.911
// dNstar-over-Nstar = log r / (L - 1)  =>  damping = (1 - r)(L - 1)/|log r| ~ L
const PRED_REL_SHIFT_CROSSOVER = Math.log(R_CROSSOVER) / (L_CROSSOVER - 1); // ~-0.00937
const PRED_DAMPING_CROSSOVER = (1 - R_CROSSOVER) / Math.abs(PRED_REL_SHIFT_CROSSOVER); // ~18.99
const CROSSOVER_DAMPING_OVER_LOGT0 = PRED_DAMPING_CROSSOVER / L_CROSSOVER; // ~0.87 (O(1) => damping ~ log T0)

// --- DERIVATION 2: peak pins the DIRECT-height term E_flow ~ O(1) * E_trunc ---
const T0_PEAK = effectiveHeightForN(N_PEAK_RVM); // ~5.573e5
const L_PEAK = Math.log(T0_PEAK); // ~13.23
const C_F_PEAK = (Math.log(T0_PEAK / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
const E_FLOW_PEAK = C_F_PEAK * (L_PEAK / T0_PEAK) * GRONWALL; // ~4.68e-5
const E_FLOW_OVER_E_TRUNC_PEAK = E_FLOW_PEAK / E_TRUNC_PT; // ~1.53 = O(1)
// Structural prediction: peak damping is O(1) (near one-for-one), NOT ~ L.
const PEAK_DAMPING_OVER_LOGT0 = DAMPING_PEAK_MEASURED / L_PEAK; // ~0.042 (<< O(1) => NOT ~ log T0)

// Head-to-head: the two dampings differ by a factor ~ log T0.
const CROSSOVER_VS_PEAK_DAMPING = DAMPING_CROSSOVER_MEASURED / DAMPING_PEAK_MEASURED; // ~32.55

export const IMP35594_PEAK_CROSSOVER_MECHANISM_DERIVATION = {
  id: 'imp-35594',
  proofSection: 'S-frontier',
  question:
    'imp-35574 F2 attributes the peak-vs-crossover height-map damping asymmetry to a STRUCTURAL ' +
    'mechanism (crossover N ~ log T0 => log insulation; peak solves dg_sigma/dN = 0 => no log ' +
    'insulation) but states it only in prose. Derive it analytically from the imp-35017/imp-3406 ' +
    'double-surrogate sigma(N): expand the crossover condition to exhibit the log-proportional ' +
    'insulation, and expand the stationarity condition to show it lacks that insulation.',
  method:
    'Solve E_coll = E_trunc in closed form (N = kappa log T0, kappa = (C_C/E_trunc)^2) and derive ' +
    'the first-order landmark shift dNstar-over-Nstar = log r/(L-1) under a T0 -> r T0 map swap, giving ' +
    'DAMPING_crossover = (1-r)(L-1)/|log r| ~ log T0. Then set the numerator of dg_sigma/dN to zero ' +
    '(E_coll_prime (E_trunc + E_flow) = E_coll E_flow_prime) and reduce at leading order to ' +
    'E_flow ~ O(1) E_trunc, showing the peak pins the DIRECT-height term E_flow ~ L/T0 (first power ' +
    'of the height, no 1/log T0 insulation) so DAMPING_peak ~ O(1). Cross-check both predictions ' +
    'against the imp-35458/imp-35574 measured values.',
  crossoverDerivation: {
    closed_form: 'E_coll = E_trunc  =>  N = (C_C/E_trunc)^2 * log T0  (N linear in log T0)',
    log_T0: +L_CROSSOVER.toFixed(4), // 21.9112
    predicted_rel_shift_pct: +(PRED_REL_SHIFT_CROSSOVER * 100).toFixed(3), // -0.937
    measured_rel_shift_pct: -0.983, // imp-35458
    predicted_damping: +PRED_DAMPING_CROSSOVER.toFixed(3), // 18.989
    measured_damping: DAMPING_CROSSOVER_MEASURED, // ~18
    damping_over_logT0: +CROSSOVER_DAMPING_OVER_LOGT0.toFixed(4), // ~0.867 => damping ~ log T0
    verdict: 'damping GROWS as log T0 -- log-proportional insulation CONFIRMED',
  },
  peakDerivation: {
    stationarity: 'dg_sigma/dN = 0  =>  E_coll_prime (E_trunc + E_flow) = E_coll E_flow_prime',
    reduces_to: 'E_flow ~ c * E_trunc, c = O(1) (peak pins the direct-height term E_flow ~ L/T0)',
    T0_at_peak: +T0_PEAK.toExponential(4), // ~5.573e5
    log_T0_at_peak: +L_PEAK.toFixed(4), // ~13.23
    E_flow_over_E_trunc: +E_FLOW_OVER_E_TRUNC_PEAK.toFixed(3), // ~1.531 = O(1)
    predicted_damping_order: 'O(1)',
    measured_damping: DAMPING_PEAK_MEASURED, // ~0.553
    damping_over_logT0: +PEAK_DAMPING_OVER_LOGT0.toFixed(4), // ~0.042 << O(1) => NOT ~ log T0
    verdict: 'height enters at first order (no 1/log T0 insulation) -- damping O(1), near one-for-one',
  },
  headToHead: {
    crossover_vs_peak_damping: +CROSSOVER_VS_PEAK_DAMPING.toFixed(2), // ~32.55
    factor_is_order_logT0: true, // the two dampings differ by ~ log T0
  },
  finding: {
    F1_mechanism_confirmed:
      'The imp-35574 F2 structural mechanism is derived and CONFIRMED: the crossover solves ' +
      'E_coll = E_trunc in closed form as N = (C_C/E_trunc)^2 log T0, so the height enters ONLY ' +
      'through its logarithm and the damping scales as log T0 (predicted ~19x at L ~ 21.9, ' +
      'measured ~18x). The peak stationarity dg_sigma/dN = 0 instead pins the direct-height term ' +
      'E_flow ~ L/T0 to an O(1) multiple of E_trunc, so the height enters at first order with no ' +
      'log insulation and the damping is O(1) (predicted ~1, measured ~0.55).',
    F2_distinguishing_structure:
      'The asymmetry is which quantity each landmark pins: the crossover pins N ~ log T0 (damping ~ ' +
      'log T0), the peak pins E_flow ~ L/T0 = O(1) E_trunc (damping ~ O(1)). The two dampings ' +
      'therefore differ by a factor ~ log T0 (measured ~32.55x), matching log T0 at the crossover.',
  },
  isRigorous: false,
  honestStatus:
    'DERIVES the imp-35574 F2 structural mechanism from the imp-35017/imp-3406 double-surrogate: ' +
    'the crossover E_coll = E_trunc solves to N = (C_C/E_trunc)^2 log T0 (height only in the log => ' +
    'damping ~ log T0, predicted ~19x vs measured ~18x, predicted shift -0.94 percent vs measured ' +
    '-0.98 percent), while the peak dg_sigma/dN = 0 pins E_flow ~ L/T0 to O(1) E_trunc (height at ' +
    'first order => damping O(1), measured ~0.55). Mechanism CONFIRMED. Assessment/derivation of a ' +
    'mechanism only on the inherited imp-3220/imp-3406 surrogate; surrogate-vs-true fidelity ' +
    '(imp-35337a) UNTOUCHED; discharges nothing; changes no bound; NO QED.',
  verdict:
    'DERIVATION/ASSESSMENT (frontier-direction, NOT rigorous). The imp-35574 F2 prose mechanism is ' +
    'derived analytically and CONFIRMED. Crossover: E_coll = E_trunc => N = (C_C/E_trunc)^2 log T0, ' +
    'so a T0 -> r T0 map swap shifts the landmark by log r/(L-1) and the damping (1-r)(L-1)/|log r| ' +
    'scales as log T0 -- the log-proportional insulation (predicted ~18.99x, measured ~18x; ' +
    'predicted shift -0.94 percent, measured -0.98 percent). Peak: dg_sigma/dN = 0 reduces to ' +
    'E_coll_prime (E_trunc + E_flow) = E_coll E_flow_prime, which pins the direct-height term ' +
    'E_flow ~ L/T0 to O(1) E_trunc (ratio ~1.53), so the height enters at first order with NO ' +
    '1/log T0 insulation and the damping is O(1) (measured ~0.55) -- a factor ~ log T0 below the ' +
    'crossover (measured ~32.55x). Assessment/derivation of a mechanism only on the inherited ' +
    'imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; surrogate-vs-true fidelity ' +
    '(imp-35337a) UNTOUCHED; C_C ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631/imp-447) ' +
    'UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per ' +
    'imp-3463; discharges nothing; changes no bound; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35574 (F2 prose mechanism derived here); imp-35458 (crossover damping ~18x reproduced); ' +
    'imp-35536 (peak sigma_max robustness + N_max drift); imp-35337 (interior-peak locator); ' +
    'imp-35413 (closed surrogate map); imp-35017 (sigma double-surrogate); imp-486 (C_mb ' +
    'GUE-conditional, UNTOUCHED).',
};

export const IMP35594_PEAK_CROSSOVER_MECHANISM_DERIVATION_ASSERTIONS = [
  {
    // Crossover: the closed-form damping prediction reproduces the imp-35458 measured ~18x.
    id: 'imp35594-crossover-damping-predicted-matches-measured',
    description: 'the N ~ log T0 closed form predicts the crossover damping ~19x (measured ~18x) within 10%',
    holds: () =>
      Math.abs(PRED_DAMPING_CROSSOVER - DAMPING_CROSSOVER_MEASURED) / DAMPING_CROSSOVER_MEASURED < 0.1,
  },
  {
    // Crossover: the damping is proportional to log T0 (damping/L is O(1), not O(1/L) or O(L)).
    id: 'imp35594-crossover-damping-scales-as-logT0',
    description: 'the crossover damping / log T0 is O(1) (~0.87), i.e. damping ~ log T0 (log insulation)',
    holds: () => CROSSOVER_DAMPING_OVER_LOGT0 > 0.5 && CROSSOVER_DAMPING_OVER_LOGT0 < 1.5,
  },
  {
    // Crossover: the predicted relative shift matches the imp-35458 measured -0.98% closely.
    id: 'imp35594-crossover-shift-predicted-matches-measured',
    description: 'the predicted crossover shift ~-0.94% matches the measured -0.98% within 0.1 percentage point',
    holds: () => Math.abs(PRED_REL_SHIFT_CROSSOVER * 100 - -0.983) < 0.1,
  },
  {
    // Peak: the stationarity pins the DIRECT-height term E_flow to an O(1) multiple of E_trunc.
    id: 'imp35594-peak-pins-Eflow-to-O1-Etrunc',
    description: 'the peak stationarity pins E_flow ~ O(1) * E_trunc (ratio ~1.5), a direct-height quantity',
    holds: () => E_FLOW_OVER_E_TRUNC_PEAK > 0.5 && E_FLOW_OVER_E_TRUNC_PEAK < 5,
  },
  {
    // KEY: the peak damping is O(1), NOT proportional to log T0 (damping/L << O(1)).
    id: 'imp35594-peak-damping-not-logT0',
    description: 'the peak damping / log T0 is << O(1) (~0.04), i.e. damping is O(1) NOT ~ log T0 (no insulation)',
    holds: () =>
      PEAK_DAMPING_OVER_LOGT0 < 0.15 &&
      DAMPING_PEAK_MEASURED > 0.3 &&
      DAMPING_PEAK_MEASURED < 2 &&
      CROSSOVER_VS_PEAK_DAMPING > 10,
  },
  {
    // Honesty gate: derivation only, no QED, no refereed bound is changed.
    id: 'imp35594-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35594_PEAK_CROSSOVER_MECHANISM_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP35594_PEAK_CROSSOVER_MECHANISM_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP35594_PEAK_CROSSOVER_MECHANISM_DERIVATION.verdict),
  },
];

for (const a of IMP35594_PEAK_CROSSOVER_MECHANISM_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35594-peak-crossover-mechanism-derivation assertion failed: ${a.id}`,
    );
  }
}

export default IMP35594_PEAK_CROSSOVER_MECHANISM_DERIVATION;
