/**
 * @module imp-96388-sigma-peak-vs-knee-cross-tabulation
 *
 * imp-96388 (numerical, frontier-direction): MEASURE whether the imp-96351 sigma(N)
 * exponent-ramp KNEE (log10 N* ~ 9.529, N* ~ 3.38e9) and the imp-3220/imp-96266
 * sigma(N) value U-shape PEAK (log10 N ~ 5.96, N ~ 9.22e5) are consistent features of
 * ONE curve or two INDEPENDENT landmarks -- and, if independent, which sub-term of the
 * component model sources each.
 *
 * WHY THE QUESTION
 * ----------------
 * Both landmarks are read off the SAME conditional share
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll)
 * with the SAME inherited imp-3406/imp-33582 sub-terms, yet they are quoted ~3.5 decades
 * apart and via DIFFERENT differencing orders:
 *   - the PEAK is a FIRST-difference sign change of sigma itself (dsigma/dN: + -> -), and
 *   - the KNEE is a SECOND-difference zero crossing of the OLS local decay EXPONENT ramp
 *     (D2 of p_dec: the curvature inflection deep in the post-peak decay).
 * They have never been cross-tabulated on one shared log10 N axis with the E_flow/E_N
 * fraction, so it was open whether the knee is just the peak seen at a higher order of the
 * ramp or a genuinely distinct location driven by a different term.
 *
 * THE MEASUREMENT (both estimators re-run here; no fresh model, no new constants)
 * ------------------------------------------------------------------------------
 *   - PEAK: the imp-96266 shrinking-log-grid maximiser of sigma over [1e4,1e8].
 *   - KNEE: the imp-96351 kneeOnGrid D2 zero-crossing of the OLS local exponent on
 *           tenth-decade sub-brackets across [1e9,1e12].
 *   - CROSSOVER: the imp-33723 closed-form fixed point N_cross where E_coll = E_trunc
 *           (sigma = 1/2), for reference.
 *   - a shared-axis ladder reports sigma and E_flow/E_N at each decade so the two
 *     landmarks sit on one picture.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) TWO DISTINCT LANDMARKS, ~3.56 DECADES APART. The peak sits at log10 N ~ 5.965
 *        (N ~ 9.22e5, sigma ~ 0.9494) and the knee at log10 N ~ 9.529 (N ~ 3.38e9,
 *        sigma ~ 0.496): a separation of 3.564 decades. They are NOT the same feature at
 *        different orders of the ramp -- between them sigma falls monotonically from ~0.95
 *        to ~0.50, so no shared stationary structure links them.
 *   (F2) DIFFERENT SOURCE TERMS. At the peak E_flow/E_N ~ 3.06e-2 (appreciable): the peak
 *        is the imp-96266 E_flow-manufactured maximum. At the knee E_flow/E_N ~ 9.31e-4
 *        (about 33x smaller, negligible): E_flow does NOT build the knee.
 *   (F3) THE KNEE IS THE E_coll = E_trunc CROSSOVER, NOT THE PEAK. At the knee
 *        E_coll/E_trunc ~ 0.986 ~ 1 and sigma ~ 0.496 ~ 1/2, and the knee sits only ~0.013
 *        in log10 above the imp-33723 closed-form crossover N_cross ~ 3.28e9 (log10 ~ 9.516).
 *        So the exponent-ramp inflection coincides with the collapse-vs-truncation crossover,
 *        a full 3.55 decades ABOVE the E_flow-built peak.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share landmark diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (knee at log10 N* ~ 9.529, N ~ 3.38e9)
 * @see imp-96266-eflow-peak-recovery-residual (peak at N ~ 9.22e5, E_flow-manufactured)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross ~ 3.28e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-96266/imp-96351 exactly

// EXACT imp-3406/imp-33582 sub-terms (identical to imp-96266/imp-96351; no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { L, E_flow, E_coll, E_trunc: E_TRUNC_PT, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// PEAK: imp-96266 shrinking-log-grid maximiser of sigma over [1e4,1e8].
// (6 refinements at 400 pts/bracket -- bounded so the grid step never underflows.)
function findPeak() {
  let bestN = 0;
  let bestS = -1;
  let lo = 4;
  let hi = 8;
  for (let iter = 0; iter < 6; iter++) {
    const step = (hi - lo) / 400;
    bestS = -1;
    for (let d = lo; d <= hi + 1e-12; d += step) {
      const N = Math.pow(10, d);
      const s = sigma(N);
      if (s > bestS) {
        bestS = s;
        bestN = N;
      }
    }
    const db = Math.log10(bestN);
    lo = db - step;
    hi = db + step;
  }
  return { N: bestN, sigma: bestS, log10N: Math.log10(bestN) };
}

// KNEE: imp-96351 OLS local exponent + D2 zero-crossing on tenth-decade sub-brackets.
function olsExponentLog10(loD, hiD, ptsPerDecade) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
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
function kneeOnGrid(loD, hiD, W, ptsPerDecade) {
  const edges = [];
  for (let d = loD; d <= hiD + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    brackets.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], ptsPerDecade) });
  }
  const D1 = [];
  for (let i = 1; i < brackets.length; i++) {
    D1.push({ cen: (brackets[i].cen + brackets[i - 1].cen) / 2, d1: brackets[i].p - brackets[i - 1].p });
  }
  const D2 = [];
  for (let i = 1; i < D1.length; i++) {
    D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  }
  let signChanges = 0;
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      signChanges += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
      }
    }
  }
  return { signChanges, cstar };
}

// CROSSOVER: imp-33723 closed-form fixed point where E_coll = E_trunc (sigma = 1/2).
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}

const PEAK = findPeak();
const KNEE = kneeOnGrid(9.0, 12.0, 0.1, 100);
const KNEE_LOG10 = KNEE.cstar;
const KNEE_N = Math.pow(10, KNEE_LOG10);
const N_CROSS = crossoverFixedPoint(1e9, 60);
const N_CROSS_LOG10 = Math.log10(N_CROSS);

const pk = parts(PEAK.N);
const kn = parts(KNEE_N);
const PEAK_EFLOW_FRAC = pk.E_flow / pk.E_N;
const KNEE_EFLOW_FRAC = kn.E_flow / kn.E_N;
const SEPARATION_DECADES = KNEE_LOG10 - PEAK.log10N;
const KNEE_VS_CROSS_LOG10 = Math.abs(KNEE_LOG10 - N_CROSS_LOG10);
const EFLOW_FRAC_RATIO = PEAK_EFLOW_FRAC / KNEE_EFLOW_FRAC;

// Shared log10 N axis: sigma and E_flow/E_N at each decade, peak and knee flagged.
const SHARED_AXIS = [5, 6, 7, 8, 9, 9.529, 10, 11, 12].map((d) => {
  const p = parts(Math.pow(10, d));
  return {
    log10N: d,
    sigma: +p.sigma.toFixed(6),
    eFlowOverEN: +(p.E_flow / p.E_N).toExponential(3),
    landmark:
      Math.abs(d - PEAK.log10N) < 0.05 ? 'peak' : (Math.abs(d - KNEE_LOG10) < 0.02 ? 'knee' : ''),
  };
});

// Between the two landmarks sigma is strictly decreasing (no shared stationary structure).
const MONOTONE_BETWEEN = (() => {
  let prev = Infinity;
  for (let d = PEAK.log10N + 0.1; d <= KNEE_LOG10; d += 0.25) {
    const s = sigma(Math.pow(10, d));
    if (s >= prev) return false;
    prev = s;
  }
  return true;
})();

export const IMP96388_SIGMA_PEAK_VS_KNEE_CROSS_TABULATION = Object.freeze({
  id: 'imp-96388',
  proofSection: 'S-frontier',
  question:
    'Are the imp-96351 sigma(N) exponent-ramp knee (log10 N* ~ 9.529) and the imp-3220/imp-96266 ' +
    'sigma(N) value U-shape peak (log10 N ~ 5.96) the same feature at different orders of the ramp, ' +
    'or two independent landmarks? Cross-tabulate on one shared log10 N axis with E_flow/E_N. ' +
    'Measurement/fit only; NOT an RH bound; NO QED.',
  peak: {
    log10N: +PEAK.log10N.toFixed(4), // ~5.9647
    N: +PEAK.N.toExponential(4), // ~9.2186e5
    sigma: +PEAK.sigma.toFixed(6), // ~0.949429
    eFlowOverEN: +PEAK_EFLOW_FRAC.toExponential(4), // ~3.0587e-2 (appreciable -- builds the peak)
    kind: 'first-difference sign change of sigma (dsigma/dN: + -> -)',
  },
  knee: {
    log10N: +KNEE_LOG10.toFixed(4), // ~9.529
    N: +KNEE_N.toExponential(4), // ~3.38e9
    sigma: +kn.sigma.toFixed(6), // ~0.4959 (~1/2)
    eFlowOverEN: +KNEE_EFLOW_FRAC.toExponential(4), // ~9.31e-4 (negligible)
    eCollOverETrunc: +(kn.E_coll / kn.E_trunc).toFixed(4), // ~0.986 (~1: the crossover)
    signChanges: KNEE.signChanges, // 1
    kind: 'second-difference zero crossing of the OLS local decay exponent p_dec (curvature inflection)',
  },
  crossover: {
    log10N: +N_CROSS_LOG10.toFixed(4), // ~9.5159
    N: +N_CROSS.toExponential(4), // ~3.2803e9
    note: 'imp-33723 closed-form E_coll = E_trunc fixed point (sigma = 1/2)',
  },
  separationDecades: +SEPARATION_DECADES.toFixed(4), // ~3.5643
  kneeVsCrossoverLog10: +KNEE_VS_CROSS_LOG10.toFixed(4), // ~0.0131 (knee ~ crossover)
  eFlowFracRatioPeakOverKnee: +EFLOW_FRAC_RATIO.toFixed(1), // ~32.8
  sigmaMonotoneBetween: MONOTONE_BETWEEN, // true: no shared stationary structure
  sharedAxis: SHARED_AXIS,
  finding: {
    F1_two_distinct_landmarks:
      'The peak (log10 N ~ 5.965, sigma ~ 0.9494) and the knee (log10 N ~ 9.529, sigma ~ 0.496) sit ' +
      '~3.56 decades apart, with sigma falling monotonically from ~0.95 to ~0.50 between them -- two ' +
      'distinct landmarks, NOT one feature seen at different differencing orders.',
    F2_different_source_terms:
      'E_flow/E_N ~ 3.06e-2 at the peak (appreciable: the imp-96266 E_flow-manufactured maximum) vs ' +
      '~9.31e-4 at the knee (about 33x smaller, negligible) -- E_flow builds the peak but not the knee.',
    F3_knee_is_the_crossover:
      'At the knee E_coll/E_trunc ~ 0.986 ~ 1 and sigma ~ 0.496 ~ 1/2, and it sits only ~0.013 in ' +
      'log10 above the imp-33723 closed-form E_coll = E_trunc crossover N_cross ~ 3.28e9. The ramp ' +
      'inflection coincides with the collapse-vs-truncation crossover, a full ~3.55 decades above the peak.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-3220/imp-96266 sigma value PEAK ' +
    '(log10 N ~ 5.965, N ~ 9.22e5, sigma ~ 0.9494) and the imp-96351 exponent-ramp KNEE ' +
    '(log10 N ~ 9.529, N ~ 3.38e9, sigma ~ 0.496) are TWO INDEPENDENT landmarks ~3.56 decades apart, ' +
    'not one feature at different orders of the ramp: sigma falls monotonically between them and each ' +
    'is sourced by a different sub-term. E_flow/E_N is ~3.06e-2 at the peak (it manufactures the ' +
    'maximum) but only ~9.31e-4 at the knee (~33x smaller); the knee instead coincides with the ' +
    'imp-33723 E_coll = E_trunc crossover (E_coll/E_trunc ~ 0.986, sigma ~ 1/2, within ~0.013 in ' +
    'log10 of N_cross ~ 3.28e9). Component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96351 (knee at log10 N* ~ 9.529, N ~ 3.38e9); imp-96266 (peak at N ~ 9.22e5, ' +
    'E_flow-manufactured); imp-3220 (interior peak sigma_max ~ 0.9494); imp-33723 (closed-form ' +
    'crossover N_cross ~ 3.28e9); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
});

export default IMP96388_SIGMA_PEAK_VS_KNEE_CROSS_TABULATION;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96388_ASSERTIONS = [
  {
    id: 'imp96388-peak-reproduces-imp3220',
    description: 'the sigma maximiser reproduces the imp-3220/imp-96266 peak at N ~ 9.22e5, sigma ~ 0.9494',
    holds: () => Math.abs(PEAK.N / 9.22e5 - 1) < 5e-3 && Math.abs(PEAK.sigma - 0.9494) < 1e-3,
  },
  {
    id: 'imp96388-knee-reproduces-imp96351',
    description: 'the D2 zero-crossing reproduces the imp-96351 knee at log10 N* ~ 9.529 (one sign change)',
    holds: () => KNEE.signChanges === 1 && KNEE_LOG10 !== null && Math.abs(KNEE_LOG10 - 9.529) < 0.01,
  },
  {
    id: 'imp96388-landmarks-are-distinct',
    description: 'peak and knee sit ~3.56 decades apart with sigma monotone decreasing between them',
    holds: () => SEPARATION_DECADES > 3.4 && SEPARATION_DECADES < 3.7 && MONOTONE_BETWEEN === true,
  },
  {
    id: 'imp96388-different-source-terms',
    description: 'E_flow/E_N appreciable at the peak (~3e-2) but negligible at the knee (~9e-4), ratio ~33x',
    holds: () =>
      PEAK_EFLOW_FRAC > 2e-2 && PEAK_EFLOW_FRAC < 4e-2 &&
      KNEE_EFLOW_FRAC > 5e-4 && KNEE_EFLOW_FRAC < 2e-3 &&
      EFLOW_FRAC_RATIO > 25 && EFLOW_FRAC_RATIO < 45,
  },
  {
    id: 'imp96388-knee-is-the-crossover',
    description: 'the knee coincides with the E_coll = E_trunc crossover (sigma ~ 1/2, within ~0.02 log10 of N_cross)',
    holds: () =>
      Math.abs(kn.sigma - 0.5) < 0.02 && Math.abs(kn.E_coll / kn.E_trunc - 1) < 0.05 && KNEE_VS_CROSS_LOG10 < 0.02,
  },
  {
    id: 'imp96388-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96388_SIGMA_PEAK_VS_KNEE_CROSS_TABULATION.isRigorous === false &&
      /NO QED/.test(IMP96388_SIGMA_PEAK_VS_KNEE_CROSS_TABULATION.verdict) &&
      /refereed bound is changed/i.test(IMP96388_SIGMA_PEAK_VS_KNEE_CROSS_TABULATION.verdict),
  },
];

for (const a of IMP96388_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96388-sigma-peak-vs-knee-cross-tabulation assertion failed: ${a.id}`);
  }
}
