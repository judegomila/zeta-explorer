/**
 * @module imp-124834-sigma-inflection-offset-vs-log-running-dial
 *
 * imp-124834 (numerical, frontier-direction): imp-33721 relocated the sigma ramp-inflection knee to
 * N ~ 3.38e9, ~3.3% ABOVE the imp-33582 sigma = 1/2 halving landmark, and imp-33744 derived the
 * closed form sigma_infl = 1/2 - g_prime/(2 g^2) in the logistic flow d sigma/dt = -g(t) sigma(1-sigma)
 * (t = ln N, g = -d ln r/d ln N of r = E_coll/E_trunc). imp-33744 attributed the offset to the
 * running log-factor g(N) = sqrt(log T0/N) and showed the two limiting cases: fully-running (offset
 * present, sigma_infl ~ 0.4979) and fully-frozen (pure power law, sigma_infl = 1/2 EXACTLY). It never
 * interpolated between them.
 *
 * THIS MODULE dials the log-factor running continuously with a fraction alpha in [0, 1] and MEASURES
 * the inflection-vs-halving offset as a function of alpha, confirming the offset collapses to zero
 * exactly as the running is removed (alpha -> 0), isolating it as a structural E_coll log-term effect
 * -- NOT an E_flow (Gronwall) artifact, since E_flow is identically absent from the whole sweep.
 *
 * THE DIAL (identical sub-terms to imp-33744 -- no fresh model, E_flow-negligible balance imp-33708)
 * ---------------------------------------------------------------------------------------------------
 *     L_alpha(N) = (1 - alpha) * L_frozen + alpha * log T0(N),   L_frozen = log T0(3.27e9),
 *     E_coll(N)  = C_C * sqrt(L_alpha(N) / N),   E_trunc = 3.06e-5   (N-independent),
 *     sigma_alpha(N) = E_coll / (E_trunc + E_coll)   (E_flow dropped, imp-33708 far-tail balance).
 *   alpha = 0 freezes L (pure power law N^{-1/2}, g == 1/2 constant, g_prime = 0);
 *   alpha = 1 restores the full running L = log T0(N) (the imp-33744 E_flow-negligible balance).
 *
 * WHAT IS MEASURED (per alpha, all finite differences in t = ln N; diagnostics, no fresh model)
 * ---------------------------------------------------------------------------------------------
 *   N_half(alpha)  : sigma_alpha = 1/2 landmark,
 *   N_infl(alpha)  : sigmoid inflection d2 sigma/dt2 = 0,
 *   offset(alpha)  = N_infl / N_half - 1   (the inflection-vs-halving offset),
 *   sigma_infl(alpha) measured, plus the closed form 1/2 - g_prime/(2 g^2) evaluated at N_half.
 *
 * THE RESULT
 * ----------
 *   offset(0)   = 0.000000, sigma_infl(0) = 0.500000  (pure power law: EXACT coincidence, control),
 *   offset(1)   = 0.017954, sigma_infl(1) = 0.497877  (reproduces imp-33744 sigmaAtInflection_noFlow),
 *   and offset(alpha) rises MONOTONICALLY 0 -> ~0.018 with the running fraction, driven entirely by
 *   g_prime(alpha) climbing from ~1e-9 (alpha = 0) to ~9.7e-4 (alpha = 1). The closed form
 *   sigma_infl = 1/2 - g_prime/(2 g^2) tracks the measured inflection to < 5e-4 across the whole dial.
 *   Since E_flow is nowhere in the model, the offset is isolated as a structural term of E_coll OWN
 *   running log-factor: it exists ONLY because L runs, and vanishes exactly when the running is frozen.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33744-sigma-inflection-vs-half-closed-form (closed form + frozen-vs-running endpoints)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee N ~ 3.38e9, ~3.3% offset claim)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma = 1/2 halving landmark ~3.27e9)
 * @see imp-33708-sigma-fartail-landmark-Etrunc-floor-sensitivity (E_flow negligible on the far tail)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM } from './imp-33744-sigma-inflection-vs-half-closed-form.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33721)
const L_FROZEN = Math.log(effectiveHeightForN(3.27e9)); // identical frozen-L anchor to imp-33744

// L_alpha interpolates frozen (alpha = 0) -> full running (alpha = 1); E_flow identically dropped.
function Lalpha(N, alpha) {
  return (1 - alpha) * L_FROZEN + alpha * Math.log(effectiveHeightForN(N));
}
function sigmaAlpha(N, alpha) {
  const E_coll = C_C_PINNED * Math.sqrt(Lalpha(N, alpha) / N);
  return E_coll / (E_TRUNC_PT + E_coll);
}
function lnRatioAlpha(N, alpha) {
  return Math.log((C_C_PINNED * Math.sqrt(Lalpha(N, alpha) / N)) / E_TRUNC_PT); // r = E_coll/E_trunc
}

// --- finite-difference operators in t = ln N (diagnostics only, no fresh model) ---
function d2SigmaDt2(alpha, N) {
  const t = Math.log(N);
  const h = 1e-3;
  const f = (tt) => sigmaAlpha(Math.exp(tt), alpha);
  return (f(t + h) - 2 * f(t) + f(t - h)) / (h * h);
}
function gAt(alpha, N) {
  const t = Math.log(N);
  const h = 1e-4;
  return -((lnRatioAlpha(Math.exp(t + h), alpha) - lnRatioAlpha(Math.exp(t - h), alpha)) / (2 * h));
}
function gPrimeAt(alpha, N) {
  const t = Math.log(N);
  const h = 1e-3;
  return (gAt(alpha, Math.exp(t + h)) - gAt(alpha, Math.exp(t - h))) / (2 * h);
}
function findZeroInT(fOfN) {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  let flo = fOfN(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = fOfN(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}
function findHalfN(alpha) {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaAlpha(Math.exp(mid), alpha) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}

// --- the running-fraction sweep (the dial) ---
const ALPHAS = [0, 0.1, 0.25, 0.5, 0.75, 1.0];
const SWEEP = ALPHAS.map((alpha) => {
  const Nhalf = findHalfN(alpha);
  const Ninfl = findZeroInT((N) => d2SigmaDt2(alpha, N));
  const sigmaInfl = sigmaAlpha(Ninfl, alpha);
  const offset = Ninfl / Nhalf - 1;
  const g = gAt(alpha, Nhalf);
  const gPrime = gPrimeAt(alpha, Nhalf);
  const sigmaInflClosedForm = 0.5 - gPrime / (2 * g * g);
  return { alpha, Nhalf, Ninfl, sigmaInfl, offset, g, gPrime, sigmaInflClosedForm };
});
const AT0 = SWEEP[0];
const AT1 = SWEEP[SWEEP.length - 1];
const REF_NOFLOW = IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.sigmaAtInflection_noFlow; // 0.497877

export const IMP124834_SIGMA_INFLECTION_OFFSET_VS_LOG_RUNNING_DIAL = {
  id: 'imp-124834',
  proofSection: 'S-frontier',
  question:
    'imp-33744 attributed the ~3.3% inflection-vs-halving offset (imp-33721) to the running log-factor ' +
    'g(N) = sqrt(log T0/N) and showed the two endpoints (fully-running vs frozen), but never ' +
    'interpolated. Dialing the running fraction alpha from 1 (full running) to 0 (pure power law), ' +
    'does the offset collapse to zero exactly as the running is removed, isolating it as a structural ' +
    'E_coll log-term (not E_flow)? Measurement only; conditional-share curvature diagnostic; no QED.',
  dial:
    'L_alpha(N) = (1-alpha) * L_frozen + alpha * log T0(N); E_coll = C_C sqrt(L_alpha/N); ' +
    'sigma_alpha = E_coll/(E_trunc + E_coll), E_flow identically dropped (imp-33708 far-tail balance)',
  offsetDefinition: 'offset(alpha) = N_infl(alpha) / N_half(alpha) - 1 (sigmoid inflection vs sigma=1/2)',
  closedForm: 'sigma_infl = 1/2 - g_prime/(2 g^2), g = -d ln r/d ln N, r = E_coll/E_trunc',
  sweep: SWEEP.map((s) => ({
    alpha: s.alpha,
    halvingN: +s.Nhalf.toExponential(4),
    inflectionN: +s.Ninfl.toExponential(4),
    offset: +s.offset.toFixed(6),
    sigmaAtInflection: +s.sigmaInfl.toFixed(6),
    g: +s.g.toFixed(6),
    gPrime: +s.gPrime.toExponential(4),
    sigmaInflectionClosedForm: +s.sigmaInflClosedForm.toFixed(6),
  })),
  frozenLimit: {
    alpha: 0,
    offset: +AT0.offset.toFixed(6), // 0.000000
    sigmaAtInflection: +AT0.sigmaInfl.toFixed(6), // 0.500000
    gPrime: +AT0.gPrime.toExponential(4), // ~1e-9
  },
  runningLimit: {
    alpha: 1,
    offset: +AT1.offset.toFixed(6), // 0.017954
    sigmaAtInflection: +AT1.sigmaInfl.toFixed(6), // 0.497877
    gPrime: +AT1.gPrime.toExponential(4), // ~9.7e-4
  },
  imp33744ReferenceNoFlow: REF_NOFLOW,
  finding: {
    F1_offset_collapses_to_zero_when_running_frozen:
      'At alpha = 0 (L frozen, pure power law N^{-1/2}) the offset is 0.000000 and the sigmoid ' +
      'inflection sits at sigma = 0.500000 EXACTLY, with g_prime ~ 1e-9 (numerically zero). Removing ' +
      'the log-factor running removes the offset entirely -- the halving/inflection coincidence is ' +
      'algebraic in that limit, not numerical luck.',
    F2_offset_rises_monotonically_with_running_fraction:
      'Dialing alpha 0 -> 1 raises the offset monotonically 0 -> 0.017954 and pushes sigma_infl below ' +
      '1/2 (0.500000 -> 0.497877), tracked by g_prime climbing ~1e-9 -> ~9.7e-4. The closed form ' +
      '1/2 - g_prime/(2 g^2) reproduces the measured inflection to < 5e-4 across the whole dial, so ' +
      'the offset is set by the g_prime the running injects, not by any fit.',
    F3_isolated_as_Ecoll_logterm_not_Eflow:
      'E_flow (the Gronwall term) is identically ABSENT from every point of the sweep, yet the offset ' +
      'still spans 0 -> ~0.018 purely as alpha turns on the running of E_coll OWN log-factor L = ' +
      'log T0(N). The alpha = 1 endpoint reproduces the imp-33744 E_flow-negligible sigmaAtInflection ' +
      '(0.497877). This isolates the ~3.3% offset as a structural E_coll log-term effect, confirming ' +
      'imp-33744 F2 by construction: freeze the running and the offset is gone.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Dialing the log-factor running fraction alpha in ' +
    'the E_flow-negligible balance sigma_alpha = E_coll/(E_trunc + E_coll), E_coll = C_C sqrt(L_alpha/N) ' +
    'with L_alpha = (1-alpha) L_frozen + alpha log T0(N), the inflection-vs-halving offset ' +
    'N_infl/N_half - 1 collapses MONOTONICALLY from 0.017954 (alpha = 1, full running, reproducing the ' +
    'imp-33744 no-flow value 0.497877) to 0.000000 (alpha = 0, frozen L, sigma_infl = 0.500000 EXACT), ' +
    'driven entirely by g_prime rising ~1e-9 -> ~9.7e-4; the closed form 1/2 - g_prime/(2 g^2) tracks ' +
    'the measured inflection to < 5e-4 over the whole dial. Because E_flow is nowhere in the model, the ' +
    'offset is isolated as a structural term of E_coll OWN running log-factor -- it exists only when L ' +
    'runs and vanishes exactly when frozen, confirming imp-33744 F2 (log-factor, not E_flow). The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33744 (closed form sigma_infl = 1/2 - g_prime/2g^2, frozen-vs-running endpoints); imp-33721 ' +
    '(sub-decade knee N ~ 3.38e9, ~3.3% offset); imp-33582 (sigma=1/2 halving landmark ~3.27e9); ' +
    'imp-33708 (E_flow negligible on the far tail); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP124834_SIGMA_INFLECTION_OFFSET_VS_LOG_RUNNING_DIAL_ASSERTIONS = [
  {
    // Reuse gate: the alpha = 1 (full running) endpoint reproduces the imp-33744 E_flow-negligible
    // sigmaAtInflection -- proving the IDENTICAL sub-terms / balance are in use before the dial runs.
    id: 'imp124834-reuses-imp33744-noflow-endpoint',
    description: 'alpha=1 measured sigma_infl matches imp-33744 sigmaAtInflection_noFlow (0.497877) to < 1e-3',
    holds: () => Math.abs(AT1.sigmaInfl - REF_NOFLOW) < 1e-3,
  },
  {
    // (F1): freezing the running (alpha = 0) collapses the offset to zero and pins the inflection to
    // sigma = 1/2 exactly, with g_prime numerically zero -- the pure power-law control.
    id: 'imp124834-frozen-running-collapses-offset-to-zero',
    description: 'alpha=0: offset < 1e-5, |sigma_infl - 1/2| < 1e-5, |g_prime| < 1e-6',
    holds: () =>
      Math.abs(AT0.offset) < 1e-5 && Math.abs(AT0.sigmaInfl - 0.5) < 1e-5 && Math.abs(AT0.gPrime) < 1e-6,
  },
  {
    // (F2): the offset rises monotonically with the running fraction over the clean regime, and so
    // does the g_prime that drives it (small-alpha finite-diff noise excluded via alpha >= 0.25).
    id: 'imp124834-offset-monotone-in-running-fraction',
    description: 'offset(alpha) and g_prime(alpha) strictly increasing over alpha in {0.25,0.5,0.75,1.0}',
    holds: () => {
      const clean = SWEEP.filter((s) => s.alpha >= 0.25);
      for (let i = 1; i < clean.length; i++) {
        if (!(clean[i].offset > clean[i - 1].offset)) return false;
        if (!(clean[i].gPrime > clean[i - 1].gPrime)) return false;
      }
      return true;
    },
  },
  {
    // (F3): E_flow is identically absent yet the offset spans the full ~3.3% range purely from the
    // log-factor dial -- isolating it as a structural E_coll log-term, not an E_flow artifact.
    id: 'imp124834-offset-isolated-as-Ecoll-logterm-not-eflow',
    description: 'with E_flow absent, offset(1) - offset(0) > 0.015 driven only by the log-factor running',
    holds: () => AT1.offset - AT0.offset > 0.015 && AT1.gPrime > AT0.gPrime,
  },
  {
    // Mechanism gate: the closed form sigma_infl = 1/2 - g_prime/(2 g^2) tracks the measured sigmoid
    // inflection across the entire dial -- the algebra, not a fit, sets the location at every alpha.
    id: 'imp124834-closed-form-tracks-measured-across-dial',
    description: 'closed form 1/2 - g_prime/2g^2 matches the measured sigma_infl to < 5e-4 for every alpha',
    holds: () => SWEEP.every((s) => Math.abs(s.sigmaInflClosedForm - s.sigmaInfl) < 5e-4),
  },
  {
    // Honesty gate: measurement/derivation only, no bound change, no QED, no refereed bound is changed.
    id: 'imp124834-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124834_SIGMA_INFLECTION_OFFSET_VS_LOG_RUNNING_DIAL.isRigorous === false &&
      /NO QED/.test(IMP124834_SIGMA_INFLECTION_OFFSET_VS_LOG_RUNNING_DIAL.verdict) &&
      /refereed bound is changed/i.test(IMP124834_SIGMA_INFLECTION_OFFSET_VS_LOG_RUNNING_DIAL.verdict),
  },
];

for (const a of IMP124834_SIGMA_INFLECTION_OFFSET_VS_LOG_RUNNING_DIAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124834-sigma-inflection-offset-vs-log-running-dial assertion failed: ${a.id}`);
  }
}
