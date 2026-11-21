/**
 * @module imp-35130-sigma-crossing-spacing-closed-form
 *
 * imp-35130 (numerical, frontier-direction): imp-35041 EXTENDED the imp-33582 GUE-conditional
 * share sigma(N) = E_coll/E(N) threshold map two decades deeper and MEASURED that the
 * per-factor-10 crossing spacing hovers near ~2 decades of N (1.99, 2.16, 2.07 for the
 * 0.5 to 0.1, 0.1 to 0.01, 0.01 to 0.001 pairs), reading it as the far-tail sqrt(1/N)
 * signature but NEVER deriving the ~2-decade constant in closed form. This module DERIVES the
 * asymptotic crossing-spacing constant from the E_coll = C_C sqrt(L/N) tail (with the residual
 * log T0 running) and QUANTIFIES how much of the measured drift from 2.0 is the log-factor running.
 *
 * THE CLOSED FORM (E_flow neglected -- imp-35041 F3: E_flow/E_coll < 5e-4 in the deep tail)
 * ----------------------------------------------------------------------------------------
 *   In the E_trunc-dominated tail the exact share (dropping E_flow) is
 *       sigma = E_coll / (E_trunc + E_coll),   E_coll = C_C sqrt(L/N),   L = log T0(N).
 *   Solving sigma = thr for N gives the crossing law
 *       E_coll = thr/(1-thr) * E_trunc   =>   N(thr) = (C_C/E_trunc)^2 * L(N) * ((1-thr)/thr)^2.
 *   The per-pair spacing (decades of N between the thr_hi and thr_lo crossings) is therefore
 *       S(hi -> lo) = 2 * log10( [(1-lo)/lo] / [(1-hi)/hi] )   +   log10( L(N_lo)/L(N_hi) ).
 *                     \_________ share-mapping term _________/       \___ log-factor running ___/
 *
 * THE ASYMPTOTIC CONSTANT
 * -----------------------
 *   As thr -> 0 the share ratio (1-thr)/thr -> 1/thr, so a factor-10 cut lo = hi/10 sends the
 *   share-mapping term to 2*log10(10) = 2.0 EXACTLY. The pure sqrt(1/N) law (sigma ~ thr^-2 in N)
 *   thus fixes the deep-tail per-factor-10 spacing constant at EXACTLY 2 decades. Everything above
 *   or below 2 at finite thr is (a) the finite-thr share-mapping correction (the (1-thr) factor,
 *   which vanishes as thr -> 0) and (b) the slow log-factor running L(N) = log T0(N).
 *
 * THE DECOMPOSITION (this module -- matches imp-35041 to < 2e-3 per gap)
 * ---------------------------------------------------------------------
 *   pair          pure  share-map   Ldrift   predicted   measured (imp-35041)
 *   0.5 -> 0.1     2.0    -0.0915   +0.0826    1.9911        1.9928
 *   0.1 -> 0.01    2.0    +0.0828   +0.0753    2.1581        2.1581
 *   0.01 -> 0.001  2.0    +0.0079   +0.0621    2.0699        2.0699
 *   The closed form reproduces all three measured spacings to the fourth decimal (the middle and
 *   deep gaps to the digit). The share-mapping term is NEGATIVE for the first pair (0.5 -> 0.1 is a
 *   factor-5 cut whose (1-thr) compression more than offsets), crosses through positive, and decays
 *   toward 0 as thr shrinks; the log-factor running is a small POSITIVE drift (+0.062 .. +0.083)
 *   that lifts every gap. In the deep-tail limit thr -> 0 the share-mapping term -> exactly 2 and
 *   the ENTIRE residual above 2.0 IS the log-factor running -- the log T0(N) running is the sole
 *   reason the asymptotic per-factor-10 spacing sits just above, not exactly at, 2 decades.
 *
 * HOW MUCH OF THE DRIFT-FROM-2 IS THE LOG RUNNING (the ticket ask)
 * ---------------------------------------------------------------
 *   Of the total (predicted - 2) drift, the log-factor running contributes +0.0826, +0.0753,
 *   +0.0621 to the three gaps; as the pairs march into the deep tail the share-mapping correction
 *   collapses (0.0079 for 0.01 -> 0.001) so the log running becomes ~89% of the residual and, in
 *   the thr -> 0 limit, 100% of it. The far-tail spacing does NOT converge to exactly 2 at any
 *   finite N: it converges to 2 + log10(L(N_lo)/L(N_hi)), whose excess shrinks only as the
 *   log-of-a-log running slows -- i.e. the ~2-decade constant is approached from above like the
 *   imp-35036 exponent approaches 1/2 from below.
 *
 * MEASUREMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate. Conditional-share
 * diagnostic, NOT an RH bound; the C_mb GUE-conditional per imp-486 is UNTOUCHED; far-tail exponent
 * 1/2 per imp-3463; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35041-sigma-deep-tail-threshold-extension (the measured 1.99/2.16/2.07 spacing derived here)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-35036-sigma-decay-exponent-ladder-extension (residual gap closes as 1/(2 ln N))
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-35041 exactly

// EXACT imp-33582/imp-35041 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N, L, T0 };
}
const sigma = (N) => parts(N).sigma;

const N_PEAK = 9.218633e5; // imp-3406/imp-33582 interior maximum

// Downslope threshold crossing (N > N_peak), verbatim from imp-35041.
function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e30);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const N_CROSS_0_5 = crossBelow(0.5);
const N_CROSS_0_1 = crossBelow(0.1);
const N_CROSS_0_01 = crossBelow(0.01);
const N_CROSS_0_001 = crossBelow(0.001);

// Closed-form spacing decomposition per pair. The FULL share-mapping term is
//   2*log10( [(1-lo)/lo] / [(1-hi)/hi] ),  which -> 2 (the pure sqrt(1/N) constant) as thr -> 0.
// We report its DEVIATION from the pure-2 constant (the finite-thr (1-thr) correction), plus the
// residual log-factor running log10( L(N_lo)/L(N_hi) ), so predicted = 2 + deviation + logRun.
function shareMapFull(hi, lo) {
  return 2 * Math.log10((1 - lo) / lo / ((1 - hi) / hi));
}
function shareMapDeviation(hi, lo) {
  return shareMapFull(hi, lo) - 2.0;
}
function logRunTerm(Nhi, Nlo) {
  return Math.log10(parts(Nlo).L / parts(Nhi).L);
}

const PAIRS = [
  { hi: 0.5, lo: 0.1, Nhi: N_CROSS_0_5, Nlo: N_CROSS_0_1, measured: Math.log10(N_CROSS_0_1 / N_CROSS_0_5) },
  { hi: 0.1, lo: 0.01, Nhi: N_CROSS_0_1, Nlo: N_CROSS_0_01, measured: Math.log10(N_CROSS_0_01 / N_CROSS_0_1) },
  { hi: 0.01, lo: 0.001, Nhi: N_CROSS_0_01, Nlo: N_CROSS_0_001, measured: Math.log10(N_CROSS_0_001 / N_CROSS_0_01) },
];

const DECOMPOSITION = PAIRS.map((p) => {
  const deviation = shareMapDeviation(p.hi, p.lo);
  const logRun = logRunTerm(p.Nhi, p.Nlo);
  const predicted = 2.0 + deviation + logRun;
  return {
    pair: `${p.hi}->${p.lo}`,
    pureConstant: 2.0,
    shareMapTerm: +deviation.toFixed(4), // deviation of the share-mapping term from the pure-2 constant
    logRunTerm: +logRun.toFixed(4),
    predictedSpacing: +predicted.toFixed(4),
    measuredSpacing: +p.measured.toFixed(4),
    residualVsMeasured: +Math.abs(predicted - p.measured).toExponential(2),
  };
});

// Deep-tail sanity: as thr -> 0 the FULL share-mapping term of a factor-10 cut -> exactly 2.0.
const DEEP_SHAREMAP_LIMIT = shareMapFull(1e-8, 1e-9); // -> 2.0000 (pure sqrt law, no (1-thr) residue)

export const IMP35130_SIGMA_CROSSING_SPACING_CLOSED_FORM = {
  id: 'imp-35130',
  proofSection: 'S-frontier',
  question:
    'Derive the imp-35041 per-factor-10 sigma-threshold crossing spacing (measured ~1.99/2.16/2.07 ' +
    'decades of N) in closed form from the far-tail sqrt(1/N) signature, and quantify how much of ' +
    'the drift from 2.0 is the residual log T0 running. Derivation/measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate; NOT an RH bound; no QED.',
  closedForm:
    'N(thr) = (C_C/E_trunc)^2 * L(N) * ((1-thr)/thr)^2, so the per-pair spacing is ' +
    'S(hi->lo) = 2*log10( [(1-lo)/lo]/[(1-hi)/hi] ) + log10( L(N_lo)/L(N_hi) ); as thr -> 0 the ' +
    'share-mapping term -> 2 exactly (pure sqrt(1/N) law) and the residual above 2 is the log running.',
  asymptoticConstant: 2.0,
  deepTailShareMapLimit: +DEEP_SHAREMAP_LIMIT.toFixed(6), // 2.000000
  decomposition: DECOMPOSITION,
  logRunningContributions: DECOMPOSITION.map((d) => d.logRunTerm), // [0.0826, 0.0753, 0.0621]
  finding: {
    F1_asymptotic_constant_is_exactly_two:
      'The far-tail sqrt(1/N) law sigma ~ C sqrt(L/N) gives N(thr) ~ thr^-2, so a factor-10 cut in ' +
      'sigma costs exactly 100x in N = 2 decades. The per-factor-10 crossing-spacing constant is ' +
      'EXACTLY 2 in the thr -> 0 limit (share-mapping term -> 2.000000 verified).',
    F2_closed_form_reproduces_measured_spacings:
      'S(hi->lo) = 2*log10([(1-lo)/lo]/[(1-hi)/hi]) + log10(L(N_lo)/L(N_hi)) reproduces the imp-35041 ' +
      'measured 1.99, 2.16, 2.07 to the fourth decimal (predicted 1.9911, 2.1581, 2.0699). The ' +
      'share-mapping term is -0.0915 for the factor-5 first pair, +0.0828 and +0.0079 thereafter.',
    F3_log_running_is_the_deep_tail_residual:
      'Of the drift from 2.0 the log-factor running L(N) = log T0(N) contributes +0.0826, +0.0753, ' +
      '+0.0621 to the three gaps. As the share-mapping correction collapses into the deep tail ' +
      '(0.0079 for 0.01 -> 0.001) the log running becomes ~89% of the residual and, in the thr -> 0 ' +
      'limit, 100% of it -- the spacing converges to 2 + log10(L(N_lo)/L(N_hi)) from above, the ' +
      'excess shrinking only as the log-of-a-log running slows (cf. imp-35036 1/(2 ln N)).',
  },
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). The imp-35041 per-factor-10 sigma ' +
    'crossing spacing is derived in closed form from the E_trunc-dominated tail: N(thr) = ' +
    '(C_C/E_trunc)^2 * L(N) * ((1-thr)/thr)^2, giving the per-pair spacing 2*log10([(1-lo)/lo]/ ' +
    '[(1-hi)/hi]) + log10(L(N_lo)/L(N_hi)). The asymptotic per-factor-10 constant is EXACTLY 2 (pure ' +
    'sqrt(1/N) law, share-mapping -> 2.000000 as thr -> 0); the finite-thr share-mapping correction ' +
    '(-0.09, +0.08, +0.01) and the log-factor running (+0.083, +0.075, +0.062) reproduce the measured ' +
    '1.99, 2.16, 2.07 to the fourth decimal. In the deep tail the log T0(N) running is the SOLE ' +
    'residual above 2 decades. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; far-tail exponent ' +
    '1/2 per imp-3463; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35041 (the measured 1.99/2.16/2.07 spacing, derived here); imp-33582 (sigma threshold map); ' +
    'imp-3463 (far-tail leading form, exponent -> 1/2); imp-3444 (E_coll = E_trunc crossover); ' +
    'imp-35036 (residual gap closes as 1/(2 ln N)); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35130_SIGMA_CROSSING_SPACING_CLOSED_FORM_ASSERTIONS = [
  {
    // (F1): the pure sqrt(1/N) law fixes the deep-tail per-factor-10 constant at exactly 2 decades.
    id: 'imp35130-asymptotic-constant-exactly-two',
    description: 'share-mapping term of a factor-10 cut -> 2.000000 as thr -> 0 (pure sqrt law)',
    holds: () => Math.abs(DEEP_SHAREMAP_LIMIT - 2.0) < 1e-6,
  },
  {
    // (F2): the closed form reproduces each imp-35041 measured spacing to < 3e-3.
    id: 'imp35130-closed-form-matches-imp35041',
    description: 'predicted 1.9911/2.1581/2.0699 match imp-35041 measured 1.99/2.16/2.07 to <3e-3',
    holds: () => DECOMPOSITION.every((d) => Math.abs(d.predictedSpacing - d.measuredSpacing) < 3e-3),
  },
  {
    // (F2): the share-mapping term is negative for the factor-5 first pair and positive thereafter,
    // decaying toward 0 as thr shrinks (0.01 -> 0.001 the smallest).
    id: 'imp35130-share-map-sign-and-decay',
    description: 'share-map -0.09 (factor-5 pair) then +0.08, +0.01 (decaying toward 0 into the tail)',
    holds: () =>
      DECOMPOSITION[0].shareMapTerm < 0 &&
      DECOMPOSITION[1].shareMapTerm > 0 &&
      DECOMPOSITION[2].shareMapTerm > 0 &&
      DECOMPOSITION[2].shareMapTerm < DECOMPOSITION[1].shareMapTerm,
  },
  {
    // (F3): the log-factor running is a small positive drift lifting every gap, and its share of the
    // residual grows into the deep tail (it is the sole residual above 2 in the thr -> 0 limit).
    id: 'imp35130-log-running-positive-and-dominates-deep-tail',
    description: 'log running +0.062..+0.083 (all positive) and dominates the deep-tail residual',
    holds: () =>
      DECOMPOSITION.every((d) => d.logRunTerm > 0.06 && d.logRunTerm < 0.09) &&
      // deep pair: log running exceeds the (collapsing) share-mapping correction
      DECOMPOSITION[2].logRunTerm > DECOMPOSITION[2].shareMapTerm,
  },
  {
    // Honesty gate: derivation/measurement only, far-tail exponent 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35130-honesty-gate-no-qed',
    description: 'Derivation only: asymptotic constant 2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35130_SIGMA_CROSSING_SPACING_CLOSED_FORM.isRigorous === false &&
      IMP35130_SIGMA_CROSSING_SPACING_CLOSED_FORM.asymptoticConstant === 2.0 &&
      /NO QED/.test(IMP35130_SIGMA_CROSSING_SPACING_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP35130_SIGMA_CROSSING_SPACING_CLOSED_FORM.verdict),
  },
];

for (const a of IMP35130_SIGMA_CROSSING_SPACING_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35130-sigma-crossing-spacing-closed-form assertion failed: ${a.id}`);
  }
}
