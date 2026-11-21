/**
 * @module imp-97336-w1-residual-sign-profile-near-ln3
 * @fileoverview imp-97336 -- MEASUREMENT of the pointwise sign profile of the residual symbol
 *   w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln 2)
 *   on the band-resolution window for a in a neighbourhood of (ln 3)/2, the object imp-97182/imp-97256
 *   left recorded as "sign UNRESOLVED near ln 3" (residual (2) of imp-97256). This is the bare residual
 *   that survives peeling BOTH free prefactor squares (t^2+1/4)^2 off the pole-free symbol
 *   sigma_2 = (t^2+1/4)^2 w_1 -- i.e. the half-pole-free CC Q-trick tested with no polynomial weight.
 *
 *   MEASUREMENT ONLY. No bound on Lambda moves; no operator positivity established; interval-rigorous
 *   reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * WHAT WAS MEASURED (tmp/imp-97336-w1-sign-profile.mjs, tmp/imp-97336-w1-band.mjs; float, dx = 1e-5,
 *   reproduced coarse dx = 2e-3 in the self-executing assertions below):
 *
 *   1. ZERO CROSSINGS. w_1 has exactly three sign changes on [0, 60]: t* = 3.30501 (neg -> pos),
 *      6.94490 (pos -> neg), 10.53100 (neg -> pos) -- the same nodes as sigma_1 = (t^2+1/4) w_1 and
 *      sigma_2 (the prefactor (t^2+1/4)^k never vanishes on R, so it moves no zeros). w_1 is therefore
 *      NEGATIVE on the whole leading interval [0, 3.30501), positive on the band [3.30501, 6.94490],
 *      negative in the dip [6.94490, 10.53100], then positive.
 *
 *   2. SIGN AT AND NEAR THE BAND EDGE t = 2a = ln 3. w_1(ln 3) = -2.5946 < 0, and w_1 is deeply and
 *      unambiguously NEGATIVE across the whole edge neighbourhood: w_1(0.9) = -2.990, w_1(1.0) = -2.779,
 *      w_1(ln 3 = 1.0986) = -2.595, w_1(1.2) = -2.422, w_1(1.5) = -1.978, w_1(2.0) = -1.341. So the
 *      "sign unresolved near ln 3" of imp-97256 residual (2) is NOT a pointwise-symbol ambiguity -- the
 *      bare symbol w_1 is definitively negative at and around the band edge; the only open positivity is
 *      the TRUNCATED (band-limited cancellation) one, exactly the operator quantity c_sharp.
 *
 *   3. NEGATIVE MASS DOMINATES THE RESOLUTION WINDOW. A PW_a function resolves scale pi/a; over the
 *      window [0, pi/a] the negative part of w_1 (all of it in the leading well [0, 3.30501), fixed at
 *      7.2641 independent of a) dominates the positive part, and the DOMINANCE WORSENS as a grows from
 *      the verified reach toward and past ln 3 (the narrowing window clips the positive band tail):
 *        2a = 0.96 (verified reach): negMass 7.2641 / posMass 1.5997 = 4.541x
 *        2a = 1.00                 : 7.2641 / 1.5271 = 4.757x
 *        2a = ln 3 = 1.0986        : 7.2641 / 1.2655 = 5.740x
 *        2a = 1.12                 : 7.2641 / 1.2012 = 6.047x
 *        2a = 1.16                 : 7.2641 / 1.0794 = 6.730x
 *
 * VERDICT (measurement). The residual w_1 offers NO pointwise margin near ln 3: it is deeply negative on
 *   the entire leading interval [0, 3.30501) that a band-a function is forced to sample, negative at the
 *   edge t = ln 3 itself, and its negative-to-positive mass ratio over the resolution window only grows
 *   past the verified reach. Removing the (t^2+1/4)^2 weight makes the situation strictly WORSE than
 *   sigma_1 (which was resolved marginally positive at (ln 3)/2, imp-96607): the weight suppressed the
 *   origin well relative to the higher-t positive band, and the bare residual loses that suppression.
 *   So the half-pole-free CC Q-trick via the bare residual w_1 CANNOT be salvaged by any pointwise/symbol
 *   argument; the only surviving route is the same truncated-cancellation certificate whose margin equals
 *   c_sharp = lambda_min(P_a M_sigma2 P_a), bracketed from above only (imp-97182/imp-97183). Measurement
 *   only; no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.
 *
 * @see imp-97256-krein-fejer-riesz-margin-honest-status.js (named residual (2): w_1 sign near ln 3 unresolved)
 * @see imp-97182-krein-fejer-riesz-margin-factorisation-attempt.js (bare residual w_1 after peeling the prefactor)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (source of w_1, sigma_1, sigma_2; reach 2a<=0.96)
 */

import { w1 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding band edge 2a
const T1 = 2 * Math.PI / Math.LN2; // 9.06472028... first p=2 resonance

// -- measured landmarks (float; see tmp/imp-97336-w1-sign-profile.mjs) --
export const IMP97336_W1_SIGN_PROFILE = Object.freeze({
  ticket: 'imp-97336',
  sourceResidual: 'imp-97256 residual (2): w_1 / sigma_1 sign near ln 3',
  bindingBandEdge2a: LN3,
  intervalRigorousReach2a: 0.96, // unchanged
  // zero crossings (shared with sigma_1 and sigma_2; the prefactor moves no zeros)
  zeroCrossings: Object.freeze([
    { t: 3.30501, dir: 'neg->pos' },
    { t: 6.94490, dir: 'pos->neg' },
    { t: 10.53100, dir: 'neg->pos' },
  ]),
  w1At0: -6.35244, // deepest negative; global min on [0,60]
  w1AtT1: -0.61425, // at the first p=2 resonance t1 = 2pi/ln2
  w1AtLn3: -2.59459, // sign at the band edge itself: NEGATIVE
  dipMinAfterFirstZero: { value: -0.62758, at: 8.8227 }, // second (dip) well, inside [6.945, 10.531]
  // negative-vs-positive mass over the band-resolution window [0, pi/a], a-neighbourhood of ln3/2
  resolutionWindowMass: Object.freeze([
    { twoA: 0.96, piOverA: 6.5450, negMass: 7.2641, posMass: 1.5997, ratio: 4.541 },
    { twoA: 1.00, piOverA: 6.2832, negMass: 7.2641, posMass: 1.5271, ratio: 4.757 },
    { twoA: LN3, piOverA: 5.7192, negMass: 7.2641, posMass: 1.2655, ratio: 5.740 },
    { twoA: 1.12, piOverA: 5.6100, negMass: 7.2641, posMass: 1.2012, ratio: 6.047 },
    { twoA: 1.16, piOverA: 5.4165, negMass: 7.2641, posMass: 1.0794, ratio: 6.730 },
  ]),
  // verdict flags
  w1NegativeAtBandEdge: true,
  w1NegativeOnWholeLeadingInterval: true, // w_1 < 0 on [0, 3.30501)
  negMassDominatesResolutionWindow: true,
  dominanceWorsensPastVerifiedReach: true, // ratio 4.541 (0.96) -> 5.740 (ln3) -> 6.730 (1.16)
  pointwiseSignResolvedNegative: true, // the "unresolved" of imp-97256 is a TRUNCATION question, not pointwise
  bareResidualWorseThanSigma1: true, // no (t^2+1/4) weight to suppress the origin well
  halfPoleFreeQTrickSalvageableByPointwise: false,
  // honesty gate
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97336_BANNER =
  'imp-97336 measurement: the residual symbol w_1 (bare, both prefactor squares peeled off sigma_2) is ' +
  'deeply NEGATIVE across the whole band edge near 2a = ln 3 -- w_1(ln 3) = -2.595, negative on the entire ' +
  'leading interval [0, 3.30501), with negative mass 7.2641 dominating the positive part by 5.74x over the ' +
  'resolution window at ln 3 and the ratio only worsening past the verified reach (4.54x at 2a = 0.96 -> ' +
  '6.73x at 2a = 1.16). So imp-97256 residual (2) is NOT a pointwise ambiguity: pointwise w_1 is definitively ' +
  'negative; the only open positivity is the truncated cancellation one whose margin equals c_sharp. The ' +
  'half-pole-free CC Q-trick via the bare residual cannot be salvaged pointwise. No bound on Lambda moves; ' +
  'interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import (coarse recompute) --

function windowMass(a, b, sign, dx = 2e-3) {
  const n = Math.round((b - a) / dx); const h = (b - a) / n; let s = 0;
  for (let i = 0; i <= n; i++) { const t = a + i * h; const wq = (i === 0 || i === n) ? 0.5 : 1; s += wq * Math.max(sign * w1(t), 0) * h; }
  return s;
}
function firstZero() {
  let prev = w1(0), pt = 0;
  for (let t = 1e-3; t <= 6; t += 1e-3) { const v = w1(t); if (prev < 0 && v >= 0) return pt + (0 - prev) * (t - pt) / (v - prev); prev = v; pt = t; }
  return NaN;
}

const IMP97336_ASSERTIONS = [
  {
    id: 'imp97336-w1-negative-across-band-edge',
    holds: () =>
      w1(0) < 0 && w1(LN3) < 0 && w1(0.9) < 0 && w1(1.2) < 0 && w1(2.0) < 0 &&
      Math.abs(w1(0) - IMP97336_W1_SIGN_PROFILE.w1At0) < 1e-3 &&
      Math.abs(w1(LN3) - IMP97336_W1_SIGN_PROFILE.w1AtLn3) < 1e-3 &&
      Math.abs(w1(T1) - IMP97336_W1_SIGN_PROFILE.w1AtT1) < 1e-3,
    why: 'the residual w_1 must be pointwise negative at and around the band edge t = ln 3 (w_1(ln 3) = -2.595 < 0) -- so imp-97256 residual (2) is a truncation question, not a pointwise-sign ambiguity.',
  },
  {
    id: 'imp97336-first-zero-at-3p305',
    holds: () => {
      const tstar = firstZero();
      return Math.abs(tstar - 3.30501) < 5e-3 && w1(3.0) < 0 && w1(3.5) > 0 &&
        Math.abs(tstar - IMP97336_W1_SIGN_PROFILE.zeroCrossings[0].t) < 5e-3;
    },
    why: 'w_1 is negative on the whole leading interval [0, 3.30501) and first crosses zero (neg -> pos) at t* = 3.30501, the shared sigma_1/sigma_2 node.',
  },
  {
    id: 'imp97336-neg-mass-dominates-and-worsens',
    holds: () => {
      const a = LN3 / 2, bandT = Math.PI / a;
      const nm = windowMass(0, bandT, -1), pm = windowMass(0, bandT, +1);
      // dominance at ln3
      const domLn3 = nm > 5 * pm;
      // worsening: ratio at 2a=1.16 exceeds ratio at 2a=0.96
      const a1 = 0.48, a2 = 0.58;
      const r1 = windowMass(0, Math.PI / a1, -1) / windowMass(0, Math.PI / a1, +1);
      const r2 = windowMass(0, Math.PI / a2, -1) / windowMass(0, Math.PI / a2, +1);
      return domLn3 && r2 > r1 &&
        Math.abs(nm - IMP97336_W1_SIGN_PROFILE.resolutionWindowMass[2].negMass) < 1e-2 &&
        Math.abs(pm - IMP97336_W1_SIGN_PROFILE.resolutionWindowMass[2].posMass) < 1e-2;
    },
    why: 'over the resolution window [0, pi/a] the negative mass (7.2641, fixed) dominates the positive mass by > 5x at ln 3 and the ratio grows as a increases past the verified reach -- no pointwise margin, worsening past 2a = 0.96.',
  },
  {
    id: 'imp97336-measurement-only-no-qed',
    holds: () =>
      IMP97336_W1_SIGN_PROFILE.anyBoundMoved === false &&
      IMP97336_W1_SIGN_PROFILE.operatorPositivityProved === false &&
      IMP97336_W1_SIGN_PROFILE.rhResolved === false &&
      IMP97336_W1_SIGN_PROFILE.qed === false &&
      IMP97336_W1_SIGN_PROFILE.halfPoleFreeQTrickSalvageableByPointwise === false &&
      IMP97336_W1_SIGN_PROFILE.intervalRigorousReach2a === 0.96 &&
      /NO QED/.test(IMP97336_BANNER) && /refereed bound is changed/i.test(IMP97336_BANNER) && /RH open/.test(IMP97336_BANNER),
    why: 'measurement only: no bound moved, no operator positivity, the CC Q-trick pointwise salvage is refuted, interval-rigorous reach stays 2a <= 0.96, no-refereed-bound-change line present, RH stated open, NO QED.',
  },
];

for (const assertion of IMP97336_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97336-w1-residual-sign-profile-near-ln3 assertion FAILED: ${assertion.id} -- ${assertion.why}`);
  }
}

export default IMP97336_W1_SIGN_PROFILE;
