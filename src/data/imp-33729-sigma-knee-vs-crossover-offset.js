/**
 * @module imp-33729-sigma-knee-vs-crossover-offset
 *
 * imp-33729 (accuracy, frontier-direction): two independent landmarks of the same imp-3406/
 * imp-33582 sigma(N) = E_coll/E(N) post-peak curve were reported in ADJACENT decades and never
 * placed on one axis:
 *   - imp-33701 differenced the six-decade local-exponent ladder and located the ramp curvature
 *     INFLECTION (the sigmoid KNEE, single D2 sign change) "in the [1e10,1e11] decade";
 *   - imp-3444 / imp-33582 / imp-33723 locate the E_coll = E_trunc CROSSOVER (equivalently the
 *     sigma = 1/2 halving landmark) at N ~ 3.28e9, inside the ADJACENT [1e9,1e10] decade.
 * Read literally, the knee decade sits ONE decade ABOVE the crossover decade -- so the inflection
 * appears to TRAIL the E_coll/E_trunc balance point by a full decade. This module MEASURES that
 * offset on a common log10 N axis and interprets it: is the one-decade gap real (the curvature
 * genuinely turns a decade after the balance), or an artifact of imp-33701 coarse whole-decade
 * averaging that dissolves once the knee is resolved at sub-decade width (imp-33721)?
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33701 / imp-33721 -- no fresh terms)
 * -----------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * The recomputed full-decade ladder p_dec(6..11) reproduces the imp-33701 published ladder to the
 * printed 4 decimals (reuse gate below) -- the SAME sigma sub-terms and OLS estimator.
 *
 * THE MEASUREMENT: knee-vs-crossover offset at two resolutions
 * ------------------------------------------------------------
 *   (a) CROSSOVER: solve E_coll(N) = E_trunc by downslope bisection -> N_cross ~ 3.280e9
 *       (log10 ~ 9.5159), the imp-3444/imp-33723 balance point (sigma = 1/2 to ~0.4%).
 *   (b) COARSE KNEE (imp-33701): the whole-decade ladder places the single D2 sign change in the
 *       [1e10,1e11] decade; take that decade geometric-mean center N = 10^10.5 ~ 3.162e10.
 *   (c) FINE KNEE (imp-33721): the sub-decade refinement pins the same single D2 zero-crossing at
 *       log10 N* ~ 9.5285 (N* ~ 3.38e9), inside the [1e9,1e10] decade.
 *   (d) OFFSET (knee log10 N - crossover log10 N) in decades, at both resolutions.
 *
 * THE FINDING (measurement / interpretation only)
 * -----------------------------------------------
 *   (F1) THE COARSE READING SHOWS A ONE-DECADE TRAIL. Taking imp-33701 at face value, the knee
 *        decade center (log10 10.5) sits +0.984 decades ABOVE the crossover (log10 9.5159): the
 *        inflection appears to TRAIL the E_coll = E_trunc balance point by essentially one full
 *        decade -- as if the curvature keeps turning a decade past where the constant floor
 *        overtakes the vanishing conditional term.
 *   (F2) THE ONE-DECADE TRAIL IS A DECADE-AVERAGING ARTIFACT. Resolving the SAME single D2 sign
 *        change at sub-decade width (imp-33721) relocates the knee to log10 N* ~ 9.5285, only
 *        +0.0126 decades above the crossover -- a ~78x collapse of the apparent offset. Decade
 *        averaging smears the local curvature and pushes the apparent knee a decade too high; it
 *        was never a decade past the balance.
 *   (F3) AT NATIVE RESOLUTION THE INFLECTION COINCIDES WITH THE BALANCE POINT. The refined knee
 *        N* ~ 3.38e9 sits only ~3.0% above the crossover N_cross ~ 3.28e9 (+0.0126 decades) --
 *        within measurement resolution the ramp accelerates FASTEST essentially AT the E_coll =
 *        E_trunc balance, marginally on the high-N side. It neither systematically leads nor
 *        trails: the curvature turns over right where the constant truncation floor overtakes the
 *        vanishing GUE-conditional collision term. The tiny residual +3.0% high-side offset is the
 *        same sign as the imp-33723 E_flow pull (which puts N_half just BELOW N_cross); the knee
 *        sits a hair ABOVE, consistent with the exponent gain peaking as sigma crosses one half.
 *
 * The punchline: the "one decade apart" appearance is entirely imp-33701 whole-decade averaging.
 * On a common axis the sigmoid knee and the E_coll = E_trunc crossover are the SAME landmark to
 * ~3% (0.0126 decades) -- the curvature inflection COINCIDES with the balance point, it does not
 * trail it by a decade.
 *
 * MEASUREMENT / INTERPRETATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); no
 * bound; no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (whole-decade knee localized to [1e10,1e11])
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee refined to N* ~ 3.38e9)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form E_coll=E_trunc crossover ~3.280e9)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover, bisected)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (six-decade ladder + sigma=1/2 halving landmark)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION } from './imp-33701-sigma-postpeak-ramp-curvature-inflection.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33701/imp-33721 exactly

// EXACT imp-3406/imp-33582/imp-33701 sub-terms (no re-derivation, no fresh model).
function sigmaParts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { E_flow, E_coll, sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}

// OLS local decay exponent p = -slope of ln sigma on ln N over [10^k, 10^(k+1)] (4 pts/decade).
// Identical estimator to imp-33701/imp-33582 -> reproduces the published ladder (reuse gate).
function olsExponentDecade(k, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = k; d <= k + 1 + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigmaParts(N).sigma));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}

// Reuse gate: recompute the imp-33701 whole-decade ladder p_dec(6..11).
const DECADE_KS = [6, 7, 8, 9, 10, 11];
const FULL_DECADE_LADDER = DECADE_KS.map((k) => olsExponentDecade(k, 4));

// (a) CROSSOVER: downslope bisection of E_coll(N) = E_trunc (imp-3444/imp-33723 landmark).
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_CROSS = crossBelow((N) => sigmaParts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280e9
const LOG10_CROSS = Math.log10(N_CROSS); // ~9.5159

// (b) COARSE KNEE: imp-33701 whole-decade inflection decade [1e10,1e11], geometric-mean center.
const COARSE_KNEE_DECADE = IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.inflectionDecade; // "1e10->1e11"
const COARSE_KNEE_LOG10 = 10.5; // geometric mean of [1e10, 1e11]
const COARSE_KNEE_N = Math.pow(10, COARSE_KNEE_LOG10); // ~3.162e10

// (c) FINE KNEE: imp-33721 sub-decade refined inflection.
const FINE_KNEE_LOG10 = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionLog10Nstar; // ~9.5285
const FINE_KNEE_N = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionNstar; // ~3.38e9

// (d) OFFSETS on a common log10 N axis (knee - crossover), in decades.
const COARSE_OFFSET_DECADES = COARSE_KNEE_LOG10 - LOG10_CROSS; // ~+0.984 (one decade, "trails")
const FINE_OFFSET_DECADES = FINE_KNEE_LOG10 - LOG10_CROSS; // ~+0.0126 ("coincides")
const ARTIFACT_REDUCTION_FACTOR = COARSE_OFFSET_DECADES / FINE_OFFSET_DECADES; // ~78x
const FINE_KNEE_REL_ABOVE_CROSS = FINE_KNEE_N / N_CROSS - 1; // ~+0.030 (~3% high side)

export const IMP33729_SIGMA_KNEE_VS_CROSSOVER_OFFSET = {
  id: 'imp-33729',
  proofSection: 'S-frontier',
  question:
    'imp-33701 places the sigma(N) exponent-ramp curvature inflection (the sigmoid KNEE) in the ' +
    '[1e10,1e11] decade; imp-3444/imp-33582/imp-33723 place the E_coll = E_trunc crossover (sigma ' +
    '= 1/2) at N ~ 3.28e9 in the adjacent [1e9,1e10] decade. Put both landmarks on one log10 N ' +
    'axis, MEASURE the offset between the knee and the crossover, and interpret whether the ' +
    'inflection trails, leads, or coincides with the E_coll/E_trunc balance point. ' +
    'Measurement/interpretation only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the log10 N offset (knee - crossover) in decades between the sigma-ramp curvature inflection ' +
    'and the E_coll = E_trunc crossover, at BOTH the imp-33701 whole-decade resolution and the ' +
    'imp-33721 sub-decade resolution',
  crossover: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    log10_N_cross: +LOG10_CROSS.toFixed(4), // ~9.5159
    note: 'E_coll = E_trunc downslope bisection; imp-3444/imp-33723 balance point (sigma = 1/2 to ~0.4%)',
  },
  coarseKnee: {
    source: 'imp-33701 whole-decade ladder D2 single sign change',
    inflectionDecade: COARSE_KNEE_DECADE, // "1e10->1e11"
    log10_center: +COARSE_KNEE_LOG10.toFixed(4), // 10.5 (geometric mean)
    N_center: +COARSE_KNEE_N.toExponential(4), // ~3.162e10
  },
  fineKnee: {
    source: 'imp-33721 sub-decade (quarter-decade) ladder D2 single zero-crossing',
    log10_Nstar: +FINE_KNEE_LOG10.toFixed(4), // ~9.5285
    Nstar: +FINE_KNEE_N.toExponential(4), // ~3.38e9
  },
  offset: {
    coarse_offset_decades: +COARSE_OFFSET_DECADES.toFixed(4), // ~+0.9841 (one decade, trails)
    fine_offset_decades: +FINE_OFFSET_DECADES.toFixed(4), // ~+0.0126 (coincides)
    artifact_reduction_factor: +ARTIFACT_REDUCTION_FACTOR.toFixed(1), // ~78x
    fine_knee_rel_above_crossover: +FINE_KNEE_REL_ABOVE_CROSS.toFixed(4), // ~+0.0295 (~3% high side)
    interpretation:
      'COARSE: knee trails crossover by ~one decade (+0.984). FINE: same knee coincides with the ' +
      'crossover to +0.0126 decades (~3% high side). The one-decade trail is a decade-averaging ' +
      'artifact (~78x collapse when the knee is resolved at sub-decade width), NOT a real lag.',
  },
  finding: {
    F1_coarse_reading_shows_one_decade_trail:
      'Taking imp-33701 at face value, the whole-decade knee center (log10 10.5) sits +0.984 ' +
      'decades ABOVE the E_coll = E_trunc crossover (log10 9.5159): the inflection appears to ' +
      'TRAIL the balance point by essentially one full decade.',
    F2_one_decade_trail_is_decade_averaging_artifact:
      'Resolving the SAME single D2 sign change at sub-decade width (imp-33721) relocates the knee ' +
      'to log10 N* ~ 9.5285, only +0.0126 decades above the crossover -- a ~78x collapse of the ' +
      'apparent offset. Decade averaging smeared the local curvature a decade too high; the knee ' +
      'was never a decade past the balance.',
    F3_at_native_resolution_knee_coincides_with_balance:
      'The refined knee N* ~ 3.38e9 sits only ~3.0% above the crossover N_cross ~ 3.28e9 (+0.0126 ' +
      'decades) -- within resolution the ramp accelerates fastest essentially AT the E_coll = ' +
      'E_trunc balance, marginally on the high-N side. It neither systematically leads nor trails; ' +
      'the curvature turns over right where the constant truncation floor overtakes the vanishing ' +
      'GUE-conditional collision term. The tiny high-side residual is the same sign as the ' +
      'imp-33723 E_flow pull that puts N_half just below N_cross.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Placing the imp-33701 sigma-ramp curvature ' +
    'inflection and the imp-3444/imp-33723 E_coll = E_trunc crossover on one log10 N axis: the ' +
    'coarse whole-decade knee ([1e10,1e11] center, log10 10.5) trails the crossover (log10 9.5159) ' +
    'by +0.984 decades -- one full decade -- but that trail is a decade-averaging artifact. The ' +
    'imp-33721 sub-decade refinement pins the SAME single D2 sign change at log10 N* ~ 9.5285, only ' +
    '+0.0126 decades (a ~78x collapse) above the crossover, i.e. N* ~ 3.38e9 sits ~3.0% above ' +
    'N_cross ~ 3.28e9. Within resolution the inflection COINCIDES with the balance point (marginally ' +
    'high-side, same sign as the imp-33723 E_flow offset): the exponent ramp accelerates fastest ' +
    'right where the constant truncation floor E_trunc overtakes the vanishing GUE-conditional ' +
    'E_coll -- it does not trail the balance by a decade. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 and the C_C 1/8 ansatz (imp-2642) are UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33701 (whole-decade knee localized to [1e10,1e11]); imp-33721 (sub-decade knee refined to ' +
    'N* ~ 3.38e9); imp-33723 (closed-form E_coll=E_trunc crossover ~3.280e9); imp-3444 (crossover, ' +
    'bisected); imp-33582 (six-decade ladder + sigma=1/2 halving landmark); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP33729_SIGMA_KNEE_VS_CROSSOVER_OFFSET_ASSERTIONS = [
  {
    // Reuse gate: the recomputed whole-decade ladder reproduces the imp-33701 published ladder to
    // its printed 4 decimals -- proving the IDENTICAL sigma model / OLS estimator is in use.
    id: 'imp33729-reuses-imp33701-ladder',
    description: 'recomputed full-decade p_local matches the published imp-33701 ladder to 4 decimals',
    holds: () => {
      const pub = IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.ladder.p_local;
      if (pub.length !== FULL_DECADE_LADDER.length) return false;
      for (let i = 0; i < pub.length; i++) {
        if (Math.abs(+pub[i].toFixed(4) - +FULL_DECADE_LADDER[i].toFixed(4)) > 1e-9) return false;
      }
      return true;
    },
  },
  {
    // The crossover reproduces the imp-3444/imp-33723 balance landmark (~3.280e9).
    id: 'imp33729-crossover-matches-imp3444',
    description: 'E_coll = E_trunc crossover N_cross ~ 3.280e9 (matches imp-3444/imp-33723)',
    holds: () => Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3,
  },
  {
    // (F1): the imp-33701 whole-decade knee decade is [1e10,1e11], trailing the crossover by ~one
    // decade on the common axis.
    id: 'imp33729-coarse-knee-trails-by-one-decade',
    description: 'imp-33701 knee decade is [1e10,1e11]; coarse offset ~ +0.984 decades (~one decade trail)',
    holds: () =>
      COARSE_KNEE_DECADE === '1e10->1e11' &&
      COARSE_OFFSET_DECADES > 0.9 &&
      COARSE_OFFSET_DECADES < 1.1,
  },
  {
    // (F2): the sub-decade refinement collapses the offset by more than an order of magnitude.
    id: 'imp33729-fine-offset-collapses-the-trail',
    description: 'imp-33721 sub-decade knee offset ~ +0.0126 decades; ~78x collapse vs coarse',
    holds: () =>
      FINE_OFFSET_DECADES > 0 &&
      FINE_OFFSET_DECADES < 0.05 &&
      ARTIFACT_REDUCTION_FACTOR > 20,
  },
  {
    // (F3): at native resolution the knee coincides with the crossover to a few percent, high side.
    id: 'imp33729-knee-coincides-with-crossover',
    description: 'refined knee N* within ~5% of the crossover, on the high-N side (0 < rel < 0.05)',
    holds: () => FINE_KNEE_REL_ABOVE_CROSS > 0 && FINE_KNEE_REL_ABOVE_CROSS < 0.05,
  },
  {
    // Honesty gate: measurement/interpretation only, no QED, PT stays SOTA.
    id: 'imp33729-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33729_SIGMA_KNEE_VS_CROSSOVER_OFFSET.isRigorous === false &&
      /NO QED/.test(IMP33729_SIGMA_KNEE_VS_CROSSOVER_OFFSET.verdict) &&
      /remains SOTA/.test(IMP33729_SIGMA_KNEE_VS_CROSSOVER_OFFSET.verdict),
  },
];

for (const a of IMP33729_SIGMA_KNEE_VS_CROSSOVER_OFFSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33729-sigma-knee-vs-crossover-offset assertion failed: ${a.id}`);
  }
}
