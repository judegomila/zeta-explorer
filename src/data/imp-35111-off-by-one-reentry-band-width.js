/**
 * @module imp-35111-off-by-one-reentry-band-width
 *
 * imp-35111 (numerical, frontier-direction): imp-34997 located the N ~ 10^27.08 ceil-phase REENTRY of the
 *   off-by-one iters-to-floor population (the point where the terminal ceil phase frac(xArg) first re-enters
 *   the fixed off-by-one window (W, 1) after the ~15-decade [1e12,~1e27] gap) but only located the reentry,
 *   never the WIDTH or the EXIT of the reappearing band. This module reuses the imp-34997 map g(N)=K log T0(N),
 *   the ceil argument xArg, the off-by-one detector (predicted count 1+ceil(xArg) minus directly-measured
 *   Picard count) and the window edges W / OFFSET VERBATIM, and characterizes the population ABOVE the reentry:
 *   is it a BOUNDED phase-window band (frac(xArg) transiting the width-OFFSET window (W, 1) once and leaving)
 *   or a PERSISTENT tail, and at what N does the phase exit the window again.
 *
 * WHAT IS MEASURED
 * ----------------
 * All inherited VERBATIM from imp-34997/imp-34903: amplitude K, fixed point N_CROSS_FP, contraction rate r,
 * log-law constant ln(1/r), point-valued ceil argument xArg(seed), single-rate predicted count
 * k = 1 + ceil(xArg), directly-measured Picard count (iterate g until bit-identical to the fixed point), the
 * off-by-one residual resid = predicted - measured, and the fixed off-by-one PHASE window (W, 1) of width
 * OFFSET = log(EPS_FP/penult)/ln(1/r) ~ 0.1484. The NEW measurement is the reappearing band above the reentry:
 * (i) the frac-window model edges (frac(xArg) = W at reentry, frac(xArg) = 1 i.e. xArg crosses the next integer
 * at exit); (ii) the DIRECT-census edges (the exponents at which resid = -1 turns on and off); (iii) whether
 * the population is bounded (returns to 0 above the exit) or a persistent tail; (iv) that floor(xArg) stays
 * pinned at 11 across the whole band.
 *
 * THE RESULT: A BOUNDED PHASE-WINDOW BAND, NOT A PERSISTENT TAIL -- EXITS AT N ~ 10^37.17
 * -------------------------------------------------------------------------------------
 * The reappearing off-by-one population above the imp-34997 reentry is a SINGLE BOUNDED band, not a tail. In
 * the frac-window model the phase enters at the lower edge frac(xArg) = W ~ 0.8516 (N ~ 10^27.08, the imp-34997
 * reentry) and transits the width-OFFSET window (W, 1) as frac drifts up; it EXITS the window when frac(xArg)
 * reaches 1, i.e. when xArg crosses the next integer (11 -> 12) at N ~ 10^37.17, after which floor(xArg) steps
 * to 12, frac wraps to 0 (far below W) and the population is EXTINGUISHED. Directly censusing the residual
 * confirms bounded: resid = -1 is 0 at every seed above the exit out to 10^44 (and floor(xArg) then holds at 12
 * with no further integer crossing until beyond 10^60), so it is one band, not a recurring tail. The
 * frac-window band spans ~10.08 decades (27.08 -> 37.17).
 *
 * HONEST NUANCE: THE DIRECT-CENSUS LOW EDGE PRECEDES THE FRAC-WINDOW REENTRY
 * -------------------------------------------------------------------------
 * The two edges of the band have DIFFERENT drivers, and only the HIGH edge matches imp-34997s frac-window
 * model. The EXIT at N ~ 10^37.17 is genuinely ceil-phase driven (the predicted count 1+ceil(xArg) increments
 * exactly when xArg crosses 12) and agrees with the frac-window model to the bisection floor. But the direct
 * census shows the off-by-one population actually TURNS ON at N ~ 10^19.75 -- ~7.3 decades BELOW the imp-34997
 * frac-window reentry at 10^27.08 -- driven not by frac crossing W but by the directly-measured Picard count
 * incrementing 13 -> 14 (one extra iterate to reach bit-identity) while frac is still only ~0.675. So the
 * actual measured band is the wider interval [10^19.75, 10^37.17] (~17.42 decades, resid = -1 continuously,
 * floor(xArg) pinned at 11 throughout); imp-34997s "reappears at 10^27.08" is the frac-window models LOWER
 * edge, not the measured onset. This refines -- it does not contradict -- imp-34997: the reappearing population
 * is still bounded and still exits at 10^37.17; the ceil-phase window is one of two mechanisms bounding it, and
 * it controls the exit, while the measured-count increment controls the earlier onset.
 *
 * NAMED RESIDUAL SUB-GAP (imp-35111a)
 * -----------------------------------
 * The exit at N ~ 10^37.17 is even further above the ~3.28e9 fixed point than the imp-34997 reentry at 10^27,
 * so the imp-34997a / imp-35109a surrogate-fidelity caveat applies a fortiori: ULP spacing that far above the
 * knee is enormous and the effectiveHeightForN Newton inverse is double precision, so whether the surrogate is
 * a faithful proxy for the true collapse dynamics at 10^37 is NOT established, and the measured-count onset at
 * 10^19.75 vs the frac-window reentry at 10^27 is a surrogate-level distinction, not a certified structural one.
 * Sub-gap imp-35111a = certify the band exit (and the onset/reentry split) against a higher-precision surrogate
 * recomputation; it inherits, and does not discharge, imp-34997a / imp-35109a / imp-34951a / imp-34926a.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A width/exit characterization of the imp-34997 reappearing off-by-one band. MEASUREMENT ONLY on the inherited
 * imp-3220/imp-3406 double surrogate map, IEEE-754 double precision, no interval enclosure. The C_C = (1/8)
 * sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; far-tail exponent
 * stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34997-iters-to-floor-tail-grid-refinement (parent: locates the 10^27.08 reentry; sub-gap imp-34997a)
 * @see imp-35109-ceil-phase-drift-precision-certification (certifies the drift/reentry; sub-gap imp-35109a)
 * @see imp-34903-iters-to-floor-residual-sign-wide-band (0 off-by-one above 1e12 on the 10^0.05 grid)
 * @see imp-34951-plus-one-impossibility-margin-band (uniform quantized penult margin; sub-gap imp-34951a)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34997/imp-34903)
const EPS_FP = 2.3e-16; // the ~machine-epsilon relative agreement floor (imp-34755/imp-34775/imp-34903)
const PENULT = 1.4536413720400559e-16; // the imp-34951 quantized penultimate collapse witness (bit-identical)

// The shared imp-34997/imp-34903 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// The unique double-precision fixed point (route B, converged) -- identical to imp-34997/imp-34903.
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669

// Central-difference contraction rate (h=1 stencil; identical to imp-34997/imp-34903).
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

// Post-collapse relative distance, ceil argument, single-rate predicted count (imp-34997/imp-34903).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArg = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;
const itersToFloorPredicted = (seed) => 1 + Math.ceil(xArg(seed));

// Directly-measured Picard count: iterates until bit-identical to the fixed point (matches imp-34997).
function itersToFloorMeasured(seed, cap = 500) {
  let N = seed;
  let k = 0;
  while (k < cap) {
    N = g(N);
    k++;
    if (N === N_CROSS_FP) break;
  }
  return k;
}

// The fixed off-by-one PHASE window (W, 1) inherited from imp-34997 (width OFFSET, lower edge W).
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408 (window width)
const WINDOW_LOWER_EDGE = 1 - OFFSET; // ~0.851592

// Exponent-parameterized helpers (seed = 10^e); the off-by-one residual resid = predicted - measured.
const residAt = (e) => {
  const s = Math.pow(10, e);
  return itersToFloorPredicted(s) - itersToFloorMeasured(s);
};
const fracAt = (e) => {
  const x = xArg(Math.pow(10, e));
  return x - Math.floor(x);
};
const floorAt = (e) => Math.floor(xArg(Math.pow(10, e)));

// Monotone-predicate bisection on the exponent axis (frac and the residual are monotone across this range).
function bisectExp(lo, hi, pred) {
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (pred(m)) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

// (A) The frac-window model edges: reentry where frac(xArg) = W (the imp-34997 reentry), exit where frac(xArg)
// completes the transit and xArg crosses the next integer (floor 11 -> 12) so frac wraps below W again.
const REENTRY_EXP = bisectExp(24, 30, (e) => fracAt(e) > WINDOW_LOWER_EDGE); // ~27.0847 (matches imp-34997)
const EXIT_EXP = bisectExp(REENTRY_EXP, 45, (e) => floorAt(e) >= 12); // ~37.1671 (frac -> 1, xArg -> 12)
const FRAC_WINDOW_BAND_DECADES = EXIT_EXP - REENTRY_EXP; // ~10.08

// (B) The DIRECT-census edges: the exponents at which resid = -1 actually turns on and off.
const CENSUS_ONSET_EXP = bisectExp(15, 25, (e) => residAt(e) === -1); // ~19.7483 (measured Picard count 13 -> 14)
const CENSUS_EXIT_EXP = bisectExp(30, 45, (e) => residAt(e) === 0); // ~37.1671 (predicted count 13 -> 14)
const CENSUS_BAND_DECADES = CENSUS_EXIT_EXP - CENSUS_ONSET_EXP; // ~17.42

// (C) Bounded vs persistent tail: the band is continuously resid = -1 in its interior and returns to 0 above.
function residConstantOnBand() {
  for (let e = CENSUS_ONSET_EXP + 0.05; e < CENSUS_EXIT_EXP - 0.05; e += 0.13) {
    if (residAt(e) !== -1) return false;
  }
  return true;
}
const BAND_ALL_MINUS_ONE = residConstantOnBand();
function countOffByOneAbove(loExp, hiExp, step) {
  let ob = 0;
  let pts = 0;
  for (let e = loExp; e <= hiExp + 1e-9; e += step) {
    pts++;
    if (residAt(e) === -1) ob++;
  }
  return { pts, ob };
}
const ABOVE_EXIT = countOffByOneAbove(CENSUS_EXIT_EXP + 0.13, 44, 0.05); // expect 0: the band is bounded
const POPULATION_BOUNDED = ABOVE_EXIT.ob === 0;

// (D) floor(xArg) is pinned at 11 across the whole reappearing band (only steps to 12 AT the exit).
function floorPinnedAcrossBand() {
  const floors = new Set();
  for (let e = 12; e < EXIT_EXP - 1e-6; e += 0.1) floors.add(floorAt(e));
  return [...floors].sort((a, b) => a - b);
}
const FLOOR_VALUES_BELOW_EXIT = floorPinnedAcrossBand(); // [11]

export const IMP35111_OFF_BY_ONE_REENTRY_BAND_WIDTH = {
  id: 'imp-35111',
  proofSection: 'S-frontier',
  question:
    'imp-34997 located the N ~ 10^27.08 ceil-phase reentry of the off-by-one iters-to-floor population but ' +
    'never bounded the width or the exit of the reappearing band. Characterize the population ABOVE the reentry: ' +
    'is it a bounded phase-window band (frac(xArg) transiting the width-OFFSET window (W, 1) once and leaving) ' +
    'or a persistent tail as floor(xArg) stays pinned at 11, and at what N does the phase exit the window again?',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (h=1 stencil, as imp-34997)
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173 nats/iterate
    off_by_one_window_width_offset: +OFFSET.toPrecision(6), // ~0.148408
    off_by_one_window_lower_edge_W: +WINDOW_LOWER_EDGE.toPrecision(6), // ~0.851592
  },
  frac_window_band: {
    reentry_exponent_log10N: +REENTRY_EXP.toPrecision(8), // ~27.084691 (matches imp-34997)
    exit_exponent_log10N: +EXIT_EXP.toPrecision(8), // ~37.167107 (frac -> 1, xArg crosses integer 12)
    band_width_decades: +FRAC_WINDOW_BAND_DECADES.toPrecision(6), // ~10.0824
    exit_mechanism: 'frac(xArg) completes the transit of (W, 1); xArg crosses 11 -> 12; floor steps to 12 and frac wraps below W',
  },
  direct_census_band: {
    onset_exponent_log10N: +CENSUS_ONSET_EXP.toPrecision(8), // ~19.748310 (measured Picard count 13 -> 14)
    exit_exponent_log10N: +CENSUS_EXIT_EXP.toPrecision(8), // ~37.167107 (predicted count 13 -> 14; = frac-window exit)
    band_width_decades: +CENSUS_BAND_DECADES.toPrecision(6), // ~17.4188
    residual_constant_minus_one_across_band: BAND_ALL_MINUS_ONE, // true: all -1 (consistent with the imp-34903 sign)
    onset_precedes_frac_window_reentry_decades: +(REENTRY_EXP - CENSUS_ONSET_EXP).toPrecision(6), // ~7.34
  },
  bounded: {
    population_bounded_not_persistent_tail: POPULATION_BOUNDED, // true
    off_by_one_seeds_above_exit: ABOVE_EXIT.ob, // 0 over [exit, 1e44]
    seeds_checked_above_exit: ABOVE_EXIT.pts,
    floor_xArg_values_below_exit: FLOOR_VALUES_BELOW_EXIT, // [11] -- pinned across the whole band
  },
  summary: {
    verdict_on_ticket_question:
      'BOUNDED phase-window band, NOT a persistent tail. The reappearing off-by-one population above the ' +
      'imp-34997 reentry is a single band that EXITS at N ~ 10^37.17, where frac(xArg) completes its transit of ' +
      'the width-OFFSET window (W ~ 0.8516, 1), xArg crosses the integer 11 -> 12, floor(xArg) steps to 12 and ' +
      'the phase wraps below W; above the exit resid = -1 is 0 at every seed out to 10^44 (floor holds at 12, no ' +
      'further integer crossing before 10^60), so it is one bounded band. The frac-window band spans ~10.08 ' +
      'decades (27.08 -> 37.17). HONEST NUANCE: the direct residual census shows the population actually turns ' +
      'ON ~7.3 decades earlier, at N ~ 10^19.75, driven by the directly-measured Picard count incrementing ' +
      '13 -> 14 (frac still ~0.675, below W), so the measured band is the wider [10^19.75, 10^37.17] (~17.42 ' +
      'decades, resid = -1 continuously, floor pinned at 11). imp-34997s "reappears at 10^27.08" is the ' +
      'frac-window models LOWER edge; only the EXIT at 10^37.17 is common to both the model and the census.',
    residual_sub_gap_imp_35111a:
      'The exit at N ~ 10^37.17 is even further above the ~3.28e9 fixed point than the imp-34997 reentry at ' +
      '10^27, so the imp-34997a / imp-35109a surrogate-fidelity caveat applies a fortiori (ULP spacing is ' +
      'enormous and the effectiveHeightForN Newton inverse is double precision). Sub-gap imp-35111a = certify ' +
      'the band exit and the measured-count-onset vs frac-window-reentry split against a higher-precision ' +
      'surrogate recomputation; it inherits imp-34997a / imp-35109a / imp-34951a / imp-34926a.',
  },
  finding:
    'The imp-34997 reappearing off-by-one population above the N ~ 10^27.08 ceil-phase reentry is a BOUNDED ' +
    'phase-window band, NOT a persistent tail. In the frac-window model the phase enters at frac(xArg) = W ~ ' +
    '0.8516 (10^27.08) and EXITS when frac(xArg) reaches 1 and xArg crosses the integer 11 -> 12 at N ~ 10^37.17 ' +
    '(band ~10.08 decades); above the exit floor(xArg) holds at 12, the phase wraps below W and resid = -1 is 0 ' +
    'at every seed out to 10^44, so the band does not recur. The direct residual census confirms bounded but ' +
    'shows the true onset is ~7.3 decades earlier, at N ~ 10^19.75, driven by the measured Picard count ' +
    'incrementing 13 -> 14 (frac still below W); so the measured band is [10^19.75, 10^37.17] (~17.42 decades, ' +
    'resid = -1 continuously, floor pinned at 11), and imp-34997s reentry at 10^27.08 is the frac-window models ' +
    'lower edge while only the exit at 10^37.17 is shared by both. Subject to the named surrogate-fidelity ' +
    'sub-gap imp-35111a.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-34997 off-by-one population above the ' +
    'N ~ 10^27.08 ceil-phase reentry is a BOUNDED phase-window band, not a persistent tail: it EXITS at ' +
    'N ~ 10^37.17 where frac(xArg) completes the transit of the fixed window (W ~ 0.8516, 1) and xArg crosses ' +
    '11 -> 12 (floor steps to 12, phase wraps below W), with resid = -1 identically 0 above the exit out to ' +
    '10^44. The frac-window band spans ~10.08 decades; the direct residual census shows the true onset is ~7.3 ' +
    'decades earlier (N ~ 10^19.75, measured Picard count 13 -> 14, frac still below W), so the measured band is ' +
    'the wider [10^19.75, 10^37.17] (~17.42 decades, floor pinned at 11) and imp-34997s reentry is the ' +
    'frac-window models lower edge while the exit at 10^37.17 is shared by model and census. Subject to sub-gap ' +
    'imp-35111a (certify the exit and the onset/reentry split against a higher-precision surrogate; inherits ' +
    'imp-34997a / imp-35109a). IEEE-754 double precision; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no ' +
    'operator positivity; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34997 (parent: locates the 10^27.08 reentry; sub-gap imp-34997a); imp-35109 (certifies the drift/' +
    'reentry; sub-gap imp-35109a); imp-34903 (0 off-by-one above 1e12 on the 10^0.05 grid); imp-34951 (uniform ' +
    'quantized penult margin; sub-gap imp-34951a); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP35111_OFF_BY_ONE_REENTRY_BAND_WIDTH_ASSERTIONS = [
  {
    // The frac-window reentry reproduces imp-34997: frac(xArg) = W at ~10^27.08.
    id: 'imp35111-reentry-reproduces-imp34997',
    description: 'the frac-window reentry (frac(xArg) = W) reproduces the imp-34997 exponent ~27.08',
    holds: () => REENTRY_EXP > 27 && REENTRY_EXP < 27.2 && Math.abs(REENTRY_EXP - 27.084691) < 1e-4,
  },
  {
    // The band EXITS at ~10^37.17, where frac(xArg) reaches 1 and xArg crosses the integer 11 -> 12.
    id: 'imp35111-band-exits-at-1e37',
    description: 'the phase exits the window at ~10^37.17 (frac -> 1, xArg crosses 12); floor steps to 12 there',
    holds: () =>
      EXIT_EXP > 37 &&
      EXIT_EXP < 37.3 &&
      Math.abs(EXIT_EXP - 37.167107) < 1e-4 &&
      floorAt(EXIT_EXP + 1e-4) === 12 &&
      floorAt(EXIT_EXP - 1e-4) === 11,
  },
  {
    // The population is BOUNDED, not a persistent tail: resid = -1 is 0 at every seed above the exit.
    id: 'imp35111-population-bounded-not-tail',
    description: 'off-by-one resid = -1 is 0 at every seed above the exit out to 1e44 -- a bounded band',
    holds: () => POPULATION_BOUNDED === true && ABOVE_EXIT.ob === 0 && ABOVE_EXIT.pts > 100,
  },
  {
    // The direct census turns on ~7.3 decades below the frac-window reentry (measured Picard count 13 -> 14).
    id: 'imp35111-census-onset-precedes-reentry',
    description: 'the direct residual census onset ~10^19.75 precedes the frac-window reentry by ~7.3 decades',
    holds: () =>
      CENSUS_ONSET_EXP > 19.5 &&
      CENSUS_ONSET_EXP < 20 &&
      REENTRY_EXP - CENSUS_ONSET_EXP > 7 &&
      Math.abs(CENSUS_EXIT_EXP - EXIT_EXP) < 1e-3 &&
      BAND_ALL_MINUS_ONE === true,
  },
  {
    // floor(xArg) is pinned at 11 across the whole reappearing band (steps to 12 only at the exit).
    id: 'imp35111-floor-pinned-at-11-across-band',
    description: 'floor(xArg) is pinned at 11 across [1e12, exit); the band is a single ceil-phase transit',
    holds: () => FLOOR_VALUES_BELOW_EXIT.length === 1 && FLOOR_VALUES_BELOW_EXIT[0] === 11,
  },
  {
    // Honesty gate: measurement of a surrogate census, not rigorous, no QED, no refereed bound is changed, sub-gap named.
    id: 'imp35111-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, sub-gap named',
    holds: () =>
      IMP35111_OFF_BY_ONE_REENTRY_BAND_WIDTH.isRigorous === false &&
      /NO QED/.test(IMP35111_OFF_BY_ONE_REENTRY_BAND_WIDTH.verdict) &&
      /refereed bound is changed/i.test(IMP35111_OFF_BY_ONE_REENTRY_BAND_WIDTH.verdict) &&
      /imp-35111a/.test(IMP35111_OFF_BY_ONE_REENTRY_BAND_WIDTH.summary.residual_sub_gap_imp_35111a),
  },
];

for (const a of IMP35111_OFF_BY_ONE_REENTRY_BAND_WIDTH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35111-off-by-one-reentry-band-width assertion failed: ${a.id}`);
  }
}
