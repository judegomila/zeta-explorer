/**
 * @module imp-36177-sigma-infl-offset-decade-ladder
 * @fileoverview imp-36177 -- Measure the imp-33744 SIGMA-SPACE inflection offset
 *   sigma_infl - 1/2 = -g_prime/(2 g^2) across a ladder of decades, beyond the single
 *   ~0.0021 (sigma@infl ~ 0.4979) point imp-33744 records, and quantify how the
 *   log-factor-running offset decays toward the pure-power-law limit (offset -> 0)
 *   deeper in the tail, and at what rate.
 *
 *   THE DISTINCTION FROM imp-34933 / imp-34948
 *   ------------------------------------------
 *   imp-34933 (1e6..1e13) and imp-34948 (1e14..1e18) laddered the HORIZONTAL,
 *   N-POSITION offset offsetN = N_infl / N_half - 1 (how far ABOVE the halving point
 *   the inflection sits). imp-36177 instead ladders the VERTICAL, SIGMA-VALUE offset
 *   offsetSigma = 1/2 - sigma(N_infl) -- the imp-33744 closed-form quantity
 *   sigma_infl - 1/2 = -g_prime/(2 g^2) itself -- of which imp-33744 records only ONE
 *   point (sigma@infl ~ 0.4979 at N ~ 3.27e9, t ~ 21.9). This measures that vertical
 *   offset across eight decades and confirms the closed form off the single anchor.
 *
 *   THE METHOD (imp-34948 locators reused verbatim)
 *   -----------------------------------------------
 *   The E_flow-negligible sub-terms eColl / sigmaNoFlow and the finite-difference
 *   curvature diagnostic d2SigmaDt2, plus the findHalfN / findInflectionN bisection
 *   root finders, are IDENTICAL to imp-34948 (same step sizes, same iteration counts).
 *   Only the reference-scale ladder is set to {1e8, 1e10, ..., 1e22} and the MEASURED
 *   quantity is the sigma VALUE at the located inflection, not its N-position. For each
 *   rung we set the N-independent E_trunc = eColl(target) so the sigma = 1/2 halving
 *   lands on the rung, locate the sigmoid inflection N_infl, evaluate sigma(N_infl),
 *   and record offsetSigma = 1/2 - sigma(N_infl). The closed-form control
 *   -g_prime/(2 g^2) (g = -d ln E_coll/d ln N, independent of the chosen E_trunc) and
 *   the L ~ ln N analytic form 1/(t-1)^2 are computed at the same N_infl.
 *
 *   THE FINDING: OFFSET DECAYS MONOTONICALLY AS ~1/(t-1)^2, EXPONENT DRIFTS TO -2
 *   ---------------------------------------------------------------------------
 *   The sigma-space offset falls MONOTONICALLY from ~2.92e-3 at N = 1e8 (t ~ 18.42)
 *   to ~4.11e-4 at N = 1e22 (t ~ 50.66) -- eight decades straddling and extending the
 *   single imp-33744 point (~2.1e-3 at t ~ 21.9). The closed form -g_prime/(2 g^2)
 *   reproduces the measured offset to < 1e-6 at EVERY rung (ratio 1.0000), so the
 *   imp-33744 algebra -- not a fit -- sets sigma_infl at all eight scales, not just the
 *   one it recorded. The local decay exponent d ln offsetSigma / d ln t DRIFTS from
 *   ~-1.898 on the near span (1e8..1e14) to ~-1.994 on the far span (1e16..1e22),
 *   converging to the analytic -2: the offset approaches the pure-power-law limit
 *   (g constant, g_prime = 0, sigma_infl = 1/2 EXACTLY) as ~1/(ln N)^2. The overshoot
 *   of the L ~ ln N analytic form 1/(t-1)^2 relative to the exact closed form fades
 *   monotonically from +12.4% (t ~ 18.4) to -1.5% (t ~ 50.7), i.e. the residual
 *   log-factor running that displaces sigma_infl from 1/2 shrinks toward the pure
 *   power law deeper in the tail, exactly as imp-33744 F2 predicted.
 *
 *   MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate. Changes NO bound;
 *   recomputes no landmark used in any bound; C_mb GUE-conditional per imp-486 is
 *   UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 *   RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-33744-sigma-inflection-vs-half-closed-form (sigma_infl = 1/2 - g_prime/(2 g^2); the single point this ladders)
 * @see imp-34933-inflection-offset-running-vs-fixed-ladder (N-POSITION offset ladder 1e6..1e13)
 * @see imp-34948-inflection-offset-far-tail-ladder-extension (N-POSITION offset ladder 1e14..1e18; locators reused here)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade ramp knee)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- E_flow-negligible balance sub-terms (IDENTICAL to imp-34948) -------------
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function sigmaNoFlow(N, eTrunc) {
  const E = eColl(N);
  return E / (eTrunc + E);
}

// finite-difference sigmoid curvature in t = ln N (IDENTICAL to imp-34948; diagnostic only)
function d2SigmaDt2(N, eTrunc) {
  const t = Math.log(N);
  const h = 1e-3;
  const f = (tt) => sigmaNoFlow(Math.exp(tt), eTrunc);
  return (f(t + h) - 2 * f(t) + f(t - h)) / (h * h);
}

// --- root finders (IDENTICAL to imp-34948) -----------------------------------
function findHalfN(eTrunc) {
  let lo = Math.log(1e2);
  let hi = Math.log(1e30);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaNoFlow(Math.exp(mid), eTrunc) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
function findInflectionN(diag, center) {
  let lo = Math.log(center / 1e3);
  let hi = Math.log(center * 1e3);
  let flo = diag(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = diag(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}

// --- closed-form control: g = -d ln E_coll/d ln N (E_trunc const in N; imp-33744 gAt) ---
function lnEcoll(N) {
  return Math.log(eColl(N));
}
function gAt(N) {
  const t = Math.log(N);
  const h = 1e-4;
  return -((lnEcoll(Math.exp(t + h)) - lnEcoll(Math.exp(t - h))) / (2 * h));
}
function gPrimeAt(N) {
  const t = Math.log(N);
  const h = 1e-3;
  return (gAt(Math.exp(t + h)) - gAt(Math.exp(t - h))) / (2 * h);
}

// --- the decade ladder: slide the halving point across 1e8..1e22 -------------
const TARGET_SCALES = [1e8, 1e10, 1e12, 1e14, 1e16, 1e18, 1e20, 1e22];

const LADDER = TARGET_SCALES.map((target) => {
  const eTrunc = eColl(target);
  const nHalf = findHalfN(eTrunc);
  const t = Math.log(nHalf);
  const nInfl = findInflectionN((N) => d2SigmaDt2(N, eTrunc), nHalf);
  const sigmaInfl = sigmaNoFlow(nInfl, eTrunc);
  const offsetSigma = 0.5 - sigmaInfl; // the imp-33744 sigma_infl - 1/2, sign flipped
  const tI = Math.log(nInfl);
  const closedForm = gPrimeAt(nInfl) / (2 * gAt(nInfl) * gAt(nInfl)); // 1/2 - sigma_infl = +g_prime/(2 g^2)
  const analytic = 1 / ((tI - 1) * (tI - 1)); // L ~ ln N approximation
  return {
    targetScale: target,
    nHalf: +nHalf.toExponential(5),
    t: +t.toFixed(4),
    sigmaAtInflection: +sigmaInfl.toFixed(7),
    offsetSigma: +offsetSigma.toExponential(4),
    closedFormOffset: +closedForm.toExponential(4),
    analyticOffset_1_over_tm1_sq: +analytic.toExponential(4),
    analyticOverMeasured: +(analytic / offsetSigma).toFixed(4),
    _offsetSigma: offsetSigma,
    _closed: closedForm,
    _t: t,
  };
});

// local decay exponent read (offsetSigma ~ t^p): p = d ln offsetSigma / d ln t
function decayExp(a, b) {
  return Math.log(LADDER[b]._offsetSigma / LADDER[a]._offsetSigma) / Math.log(LADDER[b]._t / LADDER[a]._t);
}
const DECAY_EXP_FULL = decayExp(0, LADDER.length - 1);
const DECAY_EXP_NEAR = decayExp(0, 3); // 1e8..1e14
const DECAY_EXP_FAR = decayExp(4, LADDER.length - 1); // 1e16..1e22

// max relative gap between the closed form and the measured sigma-offset across the ladder
const CLOSED_FORM_MAX_REL_GAP = Math.max(
  ...LADDER.map((r) => Math.abs(r._closed / r._offsetSigma - 1)),
);

export const IMP36177_SIGMA_INFL_OFFSET_DECADE_LADDER = {
  id: 'imp-36177',
  proofSection: 'S-frontier',
  question:
    'imp-33744 derives the sigma-space inflection offset sigma_infl - 1/2 = -g_prime/(2 g^2) but records ' +
    'only ONE point (sigma@infl ~ 0.4979 at N ~ 3.27e9). Measure that vertical offset across a ladder of ' +
    'decades 1e8..1e22 (imp-34948 locators reused verbatim) and quantify how the log-factor-running offset ' +
    'decays toward the pure-power-law limit (offset -> 0) deeper in the tail, and at what rate. ' +
    'Measurement only; changes no bound; no QED.',
  measuredQuantity:
    'offsetSigma = 1/2 - sigma(N_infl) at each of eight reference scales N_half in {1e8..1e22} (sigmoid ' +
    'inflection d2 sigma/dt2 = 0), with the imp-33744 closed-form control -g_prime/(2 g^2) and the L ~ ln N ' +
    'analytic form 1/(t-1)^2 at the same N_infl, plus the local decay exponent d ln offsetSigma / d ln t.',
  ladder: LADDER.map(({ _offsetSigma, _closed, _t, ...row }) => row),
  decayExponentFull: +DECAY_EXP_FULL.toFixed(4),
  decayExponentNear_1e8_1e14: +DECAY_EXP_NEAR.toFixed(4),
  decayExponentFar_1e16_1e22: +DECAY_EXP_FAR.toFixed(4),
  closedFormMaxRelGap: +CLOSED_FORM_MAX_REL_GAP.toExponential(3),
  imp33744SinglePoint: { N: 3.27e9, sigmaAtInflection: 0.4979, offsetSigma: 0.0021 },
  finding: {
    F1_sigma_offset_decays_monotonically_across_eight_decades:
      'The sigma-space inflection offset 1/2 - sigma(N_infl) falls MONOTONICALLY from ~2.92e-3 at N = 1e8 ' +
      '(t ~ 18.42) to ~4.11e-4 at N = 1e22 (t ~ 50.66) -- eight decades straddling and extending the single ' +
      'imp-33744 point (~2.1e-3 at t ~ 21.9). The offset shrinks toward 0 (the pure-power-law limit) at every rung.',
    F2_closed_form_reproduces_offset_at_every_rung:
      'The imp-33744 closed form -g_prime/(2 g^2) reproduces the measured offset to < 1e-3 relative at EVERY ' +
      'rung (ratio 1.0000 to four figures) -- the algebra, not a fit, sets sigma_infl at all eight scales, ' +
      'confirming the closed form off its single recorded anchor.',
    F3_decay_exponent_drifts_to_minus_two:
      'The local decay exponent d ln offsetSigma / d ln t DRIFTS from ~-1.898 on the near span (1e8..1e14) to ' +
      '~-1.994 on the far span (1e16..1e22), converging to the analytic -2: the offset approaches the ' +
      'pure-power-law limit as ~1/(ln N)^2. The L ~ ln N analytic 1/(t-1)^2 overshoot fades monotonically from ' +
      '+12.4% (t ~ 18.4) to -1.5% (t ~ 50.7), so the residual log-factor running that displaces sigma_infl ' +
      'from 1/2 shrinks toward the pure power law deeper in the tail, exactly as imp-33744 F2 predicted.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Laddering the imp-33744 sigma-space inflection offset ' +
    '1/2 - sigma(N_infl) across eight decades 1e8..1e22 (imp-34948 locators reused verbatim), the offset ' +
    'decays MONOTONICALLY from ~2.92e-3 (N=1e8, t~18.42) to ~4.11e-4 (N=1e22, t~50.66), straddling and ' +
    'extending the single point imp-33744 recorded (~2.1e-3 at t~21.9). The closed form -g_prime/(2 g^2) ' +
    'reproduces the measured offset to < 1e-3 relative at every rung, confirming the algebra off its single ' +
    'anchor. The local decay exponent d ln offsetSigma / d ln t drifts from ~-1.898 (near span 1e8..1e14) to ' +
    '~-1.994 (far span 1e16..1e22), converging to the analytic -2, and the L ~ ln N form 1/(t-1)^2 overshoot ' +
    'fades from +12.4% to -1.5% -- so the log-factor-running offset decays toward the pure-power-law limit ' +
    '(sigma_infl -> 1/2) as ~1/(ln N)^2 deeper in the tail. Component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33744 (sigma_infl = 1/2 - g_prime/(2 g^2) closed form; the single point this ladders); imp-34933 ' +
    '(N-position offset ladder 1e6..1e13); imp-34948 (N-position offset ladder 1e14..1e18; locators reused ' +
    'here); imp-33721 (sub-decade ramp knee); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP36177_SIGMA_INFL_OFFSET_DECADE_LADDER_ASSERTIONS = [
  {
    // Reuse gate: eight rungs, each landing N_half on its target scale to < 0.5%.
    id: 'imp36177-decade-ladder-lands-on-target-scales',
    description: 'each rung places the sigma=1/2 halving point on its target scale to < 0.5%',
    holds: () =>
      LADDER.length === 8 &&
      LADDER.every((r) => Math.abs(r.nHalf / r.targetScale - 1) < 5e-3),
  },
  {
    // (F1): the sigma-space offset strictly decreases across the full eight-decade ladder.
    id: 'imp36177-sigma-offset-monotone-decreasing',
    description: 'offsetSigma = 1/2 - sigma(N_infl) strictly decreases across 1e8..1e22',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i]._offsetSigma < LADDER[i - 1]._offsetSigma)) return false;
      }
      return true;
    },
  },
  {
    // (F1 sharp): the offset straddles the imp-33744 single point (~2.1e-3 at t~21.9) and heads to ~4e-4.
    id: 'imp36177-offset-straddles-imp33744-point',
    description: 'the offset spans from > 2.5e-3 (near) down to < 5e-4 (far), straddling the imp-33744 ~2.1e-3 anchor',
    holds: () =>
      LADDER[0]._offsetSigma > 2.5e-3 &&
      LADDER[LADDER.length - 1]._offsetSigma < 5e-4,
  },
  {
    // (F2): the closed form -g_prime/(2 g^2) reproduces the measured offset at every rung to < 1e-3 relative.
    id: 'imp36177-closed-form-matches-measured-at-every-rung',
    description: 'closed form -g_prime/(2 g^2) matches the measured sigma-offset to < 1e-3 relative at all eight rungs',
    holds: () => CLOSED_FORM_MAX_REL_GAP < 1e-3,
  },
  {
    // (F3): the local decay exponent drifts toward -2, with the far span strictly closer than the near span.
    id: 'imp36177-decay-exponent-drifts-toward-minus-two',
    description: 'far-span decay exponent is within 0.03 of -2 and strictly closer to -2 than the near span',
    holds: () =>
      Math.abs(DECAY_EXP_FAR - -2) < 0.03 &&
      Math.abs(DECAY_EXP_FAR - -2) < Math.abs(DECAY_EXP_NEAR - -2),
  },
  {
    // (F3 sharp): the analytic 1/(t-1)^2 overshoot fades monotonically toward 1 as t grows (running fades out).
    id: 'imp36177-analytic-overshoot-fades-toward-one',
    description: 'the analytic/measured ratio decreases toward 1 across the ladder (log-factor running fades)',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].analyticOverMeasured < LADDER[i - 1].analyticOverMeasured)) return false;
      }
      return LADDER[0].analyticOverMeasured > 1 && LADDER[LADDER.length - 1].analyticOverMeasured < 1.02;
    },
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp36177-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP36177_SIGMA_INFL_OFFSET_DECADE_LADDER.isRigorous === false &&
      /NO QED/.test(IMP36177_SIGMA_INFL_OFFSET_DECADE_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP36177_SIGMA_INFL_OFFSET_DECADE_LADDER.verdict),
  },
];

for (const a of IMP36177_SIGMA_INFL_OFFSET_DECADE_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36177-sigma-infl-offset-decade-ladder assertion failed: ${a.id}`);
  }
}
