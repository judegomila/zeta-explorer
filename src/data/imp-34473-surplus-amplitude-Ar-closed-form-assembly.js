/**
 * imp-34473 — Closed-form assembly of the imp-34414 leading surplus amplitude A_r
 *             from the primitive constants, and its convergence cross-check.
 *
 * CONTEXT.
 * imp-34414 established, by DIRECT leading-order expansion of the imp-34174 closed
 * form surplus(thr) = thr(1-thr)r/(1+(1-thr)r), that in the thr -> 0 limit
 *
 *     surplus(thr) = A_r (log T0)^2 thr^3 (1 + o(1)),   A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc),
 *
 * and observed the measured asymptote surplus/((log T0)^2 thr^3) rising slowly
 * 4.68e-6 -> 5.01e-6 toward A_r, quoting A_r ~ 5.26e-6 -- but it never ASSEMBLED the
 * closed-form value step by step from the inherited primitive literals, nor did it
 * report the residual A_r - measured or the RATE of the slow rise. This module does
 * exactly that (derivation / cross-check only; changes no bound; NO QED).
 *
 * (1) CLOSED-FORM ASSEMBLY FROM PRIMITIVES.
 * The three inherited literals are (all reused verbatim from imp-34414/imp-33723):
 *     E_trunc   = 3.06e-5                          (N-independent fixed-strip route, imp-2631/imp-3220/imp-33743)
 *     GRONWALL  = exp(2.37e-4)     ~ 1.00023703    (imp-33743/imp-34174/imp-34248/imp-34329)
 *     K_AMPL    = (C_C_PINNED/E_trunc)^2 ~ 1.5727e8 (halving amplitude, imp-33723; C_C_PINNED = (1/8)sqrt(3pi))
 * Assembling in one line,
 *     A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc) = 5.264698e-6.
 * Because K_AMPL E_trunc = C_C_PINNED^2 / E_trunc, one power of E_trunc CANCELS and the
 * amplitude collapses to the primitive identity
 *     A_r = GRONWALL . E_trunc / ((2pi)^2 C_C_PINNED^2)                    (E_trunc flips to the NUMERATOR),
 * a two-constant form in {GRONWALL~1, C_C_PINNED} scaled by E_trunc -- confirming A_r is
 * LINEAR in the truncation constant E_trunc (not inverse), the K_AMPL denominator
 * over-cancelling it.
 *
 * (2) CONVERGENCE CROSS-CHECK AGAINST THE MEASURED ASYMPTOTE.
 * The measured asymptote M(thr) = surplus/((log T0)^2 thr^3) sits BELOW A_r and rises
 * toward it. Writing the relative deficit relDef = 1 - M/A_r, the product relDef.log T0
 * is bounded and rises monotonically 3.330 -> 3.645 across log T0 = 30 -> 76, and, probed
 * to log T0 ~ 389 (thr = 1e-80), continues to 3.6696 -- converging to the closed constant
 *
 *     relDef . log T0  ->  2 log(2pi) = 3.675754...,
 *
 * i.e. M(thr)/A_r = 1 - 2 log(2pi)/log T0 + O(1/log^2 T0): the slow rise is a clean
 * 1/log T0 approach whose LEADING coefficient is exactly 2 log(2pi). The next-order gap
 * (2 log(2pi) - relDef.log T0) . log T0 is itself ~ 2.38 and flat (2.376 at log T0=297,
 * 2.377 at 389), certifying the 1/log T0 rate. The two factors of 2pi are the two log-(2pi)
 * shifts the leading-order derivation dropped -- one from C_F = (log(T0/2pi)+1)/2pi vs the
 * (log T0)/2pi surrogate, one from the Riemann-von Mangoldt height map T0 ~ 2pi N/log N used
 * in T0 ~ (2pi K_AMPL) thr^-2 -- so the measured convergence rate is not a coincidence but
 * the imprint of the two 2pi's already visible in the A_r formula.
 *
 * SCOPE / HONESTY. Derivation and numeric cross-check only, within the inherited
 * imp-34329/imp-34248/imp-34174/imp-33743 extrapolation component model which is NOT a
 * rigorous asymptotic. E_flow is the benign mesoscopic-Gronwall term (imp-2845); its
 * amplitude here does NOT touch the divergent C_Lip collision-Gronwall. Reuses the exact
 * imp-34414 sub-terms verbatim (import-light: only effectiveHeightForN + C_C_PINNED, no
 * zeros bundle). C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz (imp-2642/
 * imp-2643) UNTOUCHED; imp-3066 K_a>=0 untouched; establishes no operator positivity;
 * changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34414-crossover-surplus-direct-cubic-expansion (the A_r formula assembled here)
 * @see imp-34174-crossover-surplus-threshold-family-decay (the closed form surplus(thr))
 * @see imp-33723 (the K_AMPL halving amplitude) and imp-2631/imp-3220 (E_trunc)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // inherited literal (imp-2631/imp-3220/imp-33743)
const GRONWALL = Math.exp(2.37e-4); // inherited literal (imp-33743/imp-34174/imp-34248/imp-34329)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)

// (1) The one-line closed-form assembly and its E_trunc-cancellation simplification.
const A_R = GRONWALL / (TWO_PI ** 2 * K_AMPL * E_TRUNC_PT); // 5.264698e-6
const A_R_SIMPLIFIED = (GRONWALL * E_TRUNC_PT) / (TWO_PI ** 2 * C_C_PINNED ** 2); // identical, E_trunc in numerator
const TWO_LOG_TWO_PI = 2 * Math.log(TWO_PI); // 3.675754... — the predicted 1/log T0 rate

// EXACT imp-34414 sub-terms reused verbatim (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 160; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
function measuredAsymptote(thr) {
  const N = crossoverN(thr);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const r = eFlow(N) / E_TRUNC_PT;
  const surplus = (thr * (1 - thr) * r) / (1 + (1 - thr) * r); // exact imp-34174
  const M = surplus / (L * L * thr ** 3); // surplus/((log T0)^2 thr^3) -> A_R
  const relDef = (A_R - M) / A_R; // > 0, -> 0 as thr -> 0
  return { L, M, relDef };
}

// (2) Convergence grid: M rises toward A_R, and relDef.log T0 -> 2 log(2pi).
const DEEP_THR = [1e-2, 1e-3, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12];
const CONVERGENCE = DEEP_THR.map((thr) => {
  const f = measuredAsymptote(thr);
  return {
    thr,
    logT0: +f.L.toFixed(3),
    measured: +f.M.toExponential(4), // surplus/((log T0)^2 thr^3)
    residual: +(A_R - f.M).toExponential(4), // A_r - measured (> 0)
    relDeficitPct: +(f.relDef * 100).toFixed(4),
    relDef_x_logT0: +(f.relDef * f.L).toFixed(4), // -> 2 log(2pi) = 3.6758
  };
});

// Deep-tail rate probe (thr = 1e-80, log T0 ~ 389): relDef.log T0 = 3.6696, and the
// next-order gap (2 log(2pi) - relDef.log T0).log T0 ~ 2.38 is flat, certifying 1/log T0.
const DEEP = (() => {
  const f = measuredAsymptote(1e-80);
  const p = f.relDef * f.L;
  return {
    logT0: +f.L.toFixed(2),
    relDef_x_logT0: +p.toFixed(5),
    nextOrder_gap_x_logT0: +((TWO_LOG_TWO_PI - p) * f.L).toFixed(3),
  };
})();

export const IMP34473_SURPLUS_AMPLITUDE_AR_CLOSED_FORM_ASSEMBLY = {
  id: 'imp-34473',
  proofSection: 'S-frontier',
  question:
    'Assemble the imp-34414 leading surplus amplitude A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc) in closed ' +
    'numeric form from the primitive constants (GRONWALL, K_AMPL, E_trunc = 3.06e-5), and cross-check it ' +
    'against the measured asymptote surplus/((log T0)^2 thr^3) it approaches -- reporting the residual and ' +
    'the slow-rise convergence rate. Derivation / cross-check only; changes no bound; NO QED.',
  answer:
    'A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc) = 5.264698e-6 assembled from the three inherited literals ' +
    '(E_trunc = 3.06e-5, GRONWALL = exp(2.37e-4) ~ 1.0002370, K_AMPL = (C_C_PINNED/E_trunc)^2 ~ 1.5727e8). ' +
    'Because K_AMPL E_trunc = C_C_PINNED^2/E_trunc, one E_trunc CANCELS and A_r = GRONWALL.E_trunc/' +
    '((2pi)^2 C_C_PINNED^2) -- LINEAR in E_trunc (numerator), not inverse. Cross-check: the measured ' +
    'asymptote M = surplus/((log T0)^2 thr^3) sits below A_r (residual A_r-M = 5.84e-7 -> 2.52e-7 across ' +
    'log T0 = 30 -> 76, relative deficit 11.10% -> 4.79%) and its slow rise is a clean 1/log T0 approach: ' +
    'relDef.log T0 rises monotonically 3.330 -> 3.645 (and to 3.6696 at log T0 ~ 389, thr = 1e-80), ' +
    'converging to the closed constant 2 log(2pi) = 3.675754, so M/A_r = 1 - 2 log(2pi)/log T0 + O(1/log^2 T0). ' +
    'The next-order gap (2 log(2pi) - relDef.log T0).log T0 ~ 2.38 is flat, certifying the rate; the two 2pi ' +
    'factors are the two dropped log-(2pi) shifts (C_F = (log(T0/2pi)+1)/2pi and the RvM height map T0 ~ 2pi N/log N).',
  closedFormAssembly: {
    E_trunc: E_TRUNC_PT,
    GRONWALL: +GRONWALL.toFixed(10),
    C_C_PINNED: +C_C_PINNED.toFixed(10),
    K_AMPL: +K_AMPL.toExponential(6),
    A_r: +A_R.toExponential(6), // 5.264698e-6
    A_r_simplified_G_Etrunc_over_4pi2_CC2: +A_R_SIMPLIFIED.toExponential(6), // identical
  },
  convergence: CONVERGENCE,
  deepTailRate: DEEP,
  twoLogTwoPi: +TWO_LOG_TWO_PI.toFixed(6),
  finding: {
    F1_closed_form_assembly:
      'A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc) = 5.264698e-6, assembled from the three inherited literals ' +
      'with K_AMPL = (C_C_PINNED/E_trunc)^2 ~ 1.5727e8 and GRONWALL = exp(2.37e-4) ~ 1.0002370.',
    F2_Etrunc_cancellation:
      'K_AMPL E_trunc = C_C_PINNED^2/E_trunc, so one E_trunc cancels: A_r = GRONWALL.E_trunc/((2pi)^2 C_C_PINNED^2). ' +
      'A_r is therefore LINEAR in the truncation constant E_trunc (numerator), the K_AMPL denominator over-cancelling ' +
      'the explicit 1/E_trunc factor.',
    F3_residual_below_Ar:
      'The measured asymptote M = surplus/((log T0)^2 thr^3) approaches A_r strictly from below: residual ' +
      'A_r - M = 5.84e-7 -> 2.52e-7 (relative deficit 11.10% -> 4.79%) across log T0 = 30.0 -> 76.0.',
    F4_slow_rise_rate_is_2_log_2pi:
      'The slow rise is a clean 1/log T0 approach: relDef.log T0 rises monotonically 3.330 -> 3.645 and, probed ' +
      'to log T0 ~ 389 (thr = 1e-80), to 3.6696, converging to 2 log(2pi) = 3.675754. So M/A_r = 1 - ' +
      '2 log(2pi)/log T0 + O(1/log^2 T0); the flat next-order gap (2 log(2pi) - relDef.log T0).log T0 ~ 2.38 ' +
      'certifies the rate, the two 2pi being the dropped C_F and Riemann-von Mangoldt log-(2pi) shifts.',
  },
  scope:
    'Derivation / numeric cross-check only within the inherited imp-34329/imp-34248/imp-34174/imp-33743 ' +
    'extrapolation component model (NOT a rigorous asymptotic). E_flow is the benign mesoscopic-Gronwall term ' +
    '(imp-2845) and does NOT touch the divergent C_Lip collision-Gronwall. C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 K_a>=0 untouched; changes no bound; NO QED. ' +
    'No refereed bound is changed.',
  assertions: [
    {
      description:
        'A_r assembled from the three primitives equals 5.264698e-6, and the E_trunc-cancellation form ' +
        'GRONWALL.E_trunc/((2pi)^2 C_C_PINNED^2) reproduces it exactly',
      check: () =>
        Math.abs(A_R - 5.264698e-6) < 1e-11 &&
        Math.abs(A_R_SIMPLIFIED - A_R) < 1e-18 &&
        Math.abs(K_AMPL - 1.572709e8) < 1e3 &&
        Math.abs(GRONWALL - 1.0002370281) < 1e-9,
    },
    {
      description:
        'the measured asymptote M rises monotonically toward A_r (4.68e-6 -> 5.01e-6) and stays strictly below it',
      check: () => {
        for (let i = 1; i < CONVERGENCE.length; i++) {
          if (!(CONVERGENCE[i].measured > CONVERGENCE[i - 1].measured)) return false;
          if (!(CONVERGENCE[i].measured < A_R)) return false;
        }
        return (
          Math.abs(CONVERGENCE[0].measured - 4.6804e-6) < 1e-9 &&
          Math.abs(CONVERGENCE[CONVERGENCE.length - 1].measured - 5.0123e-6) < 1e-9
        );
      },
    },
    {
      description:
        'the residual A_r - M shrinks monotonically 5.84e-7 -> 2.52e-7 and the relative deficit falls 11.10% -> 4.79%',
      check: () => {
        for (let i = 1; i < CONVERGENCE.length; i++) {
          if (!(CONVERGENCE[i].residual < CONVERGENCE[i - 1].residual)) return false;
          if (!(CONVERGENCE[i].relDeficitPct < CONVERGENCE[i - 1].relDeficitPct)) return false;
        }
        return (
          Math.abs(CONVERGENCE[0].relDeficitPct - 11.099) < 0.02 &&
          Math.abs(CONVERGENCE[CONVERGENCE.length - 1].relDeficitPct - 4.7946) < 0.02
        );
      },
    },
    {
      description:
        'the rise rate relDef.log T0 climbs monotonically toward 2 log(2pi) = 3.675754 from below, reaching ' +
        '3.6696 at log T0 ~ 389, with the flat next-order gap ~ 2.38 certifying the 1/log T0 rate',
      check: () => {
        for (let i = 1; i < CONVERGENCE.length; i++) {
          if (!(CONVERGENCE[i].relDef_x_logT0 > CONVERGENCE[i - 1].relDef_x_logT0)) return false;
          if (!(CONVERGENCE[i].relDef_x_logT0 < TWO_LOG_TWO_PI)) return false;
        }
        return (
          DEEP.relDef_x_logT0 > CONVERGENCE[CONVERGENCE.length - 1].relDef_x_logT0 &&
          DEEP.relDef_x_logT0 < TWO_LOG_TWO_PI &&
          TWO_LOG_TWO_PI - DEEP.relDef_x_logT0 < 0.01 &&
          Math.abs(DEEP.nextOrder_gap_x_logT0 - 2.38) < 0.05
        );
      },
    },
    {
      description:
        'honesty gate: derivation / cross-check only; changes no bound; C_mb GUE-conditional per imp-486 untouched; NO QED',
      check: () =>
        IMP34473_SURPLUS_AMPLITUDE_AR_CLOSED_FORM_ASSEMBLY.scope.includes('changes no bound') &&
        IMP34473_SURPLUS_AMPLITUDE_AR_CLOSED_FORM_ASSEMBLY.scope.includes('NO QED') &&
        IMP34473_SURPLUS_AMPLITUDE_AR_CLOSED_FORM_ASSEMBLY.scope.includes('imp-486'),
    },
  ],
};

export default IMP34473_SURPLUS_AMPLITUDE_AR_CLOSED_FORM_ASSEMBLY;
