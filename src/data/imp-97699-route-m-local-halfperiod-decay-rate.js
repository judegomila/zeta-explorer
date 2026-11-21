/**
 * @module imp-97699-route-m-local-halfperiod-decay-rate
 *
 * imp-97699 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97687 RESULT 3 showed the imp-97659 ~10.18 "average decay exponent" of the Route M MCM gap-law
 * residual
 *     residual(omega) = gap(omega) - e^{-gamma}*B_inf/log p_omega
 * is a WHOLE-LADDER average, not a converged local rate: different p-windows return ~10 -> ~15, exactly
 * what the imp-97659 RESULT-1 pointwise oscillation (q_local from -6.738 to +28.721, one NEGATIVE rung
 * where the residual RISES with height) predicts. The open question this leaf settles by measurement:
 * does restricting the log|residual| regression to a SINGLE MONOTONE HALF-PERIOD -- the stretch between
 * two consecutive imp-97659 RESULT-1 sign changes (turning points of |residual| vs height) -- recover a
 * STABLE, converged local exponent q, or does the oscillation persist below the single sign change?
 *
 * The imp-97659 dps=30 precision-clean ladder (11 rungs, p = 2e6 .. 9.9e7) has exactly ONE interior
 * oscillation: |residual| falls on rungs 0..4 (p up to 2.39e7), RISES once on rung 4 -> 5
 * (p = 2.39e7 -> 3.25e7, the negative-q rung), then falls again on rungs 5..10 (p up to 9.9e7). That
 * single rise is bounded by TWO direction sign changes, splitting the ladder into two monotone
 * half-periods:
 *     Segment A  = rows 0..4  (omega 148933 .. 1.5e6, p 2.0e6 .. 2.39e7): 5 pts, |residual| decreasing
 *     Segment B  = rows 5..10 (omega 2.0e6 .. 5.7e6, p 3.25e7 .. 9.9e7): 6 pts, |residual| decreasing
 * This leaf regresses log|residual| within each monotone half-period (import-light; reuses the imp-97659
 * ladder as the single source of truth; recomputes every diagnostic here -- imp-2546/heavy-import rule).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- NO stable local q in the 1/(log p)^q model: the half-periods disagree (12.3 vs 14.6).
 * -------------------------------------------------------------------------------
 * Segment A (pre-rise) fits an exponent ~12.28 (R^2 ~ 0.959); Segment B (post-rise) fits ~14.58
 * (R^2 ~ 0.956). Restricting to a single monotone half-period does NOT collapse the ~10 -> ~15 spread
 * imp-97687 saw: the two half-periods still differ by ~2.3, and dropping the local-maximum row from
 * Segment B pushes it to ~16.6. So the window dependence is NOT an artifact of straddling the single sign
 * change -- a monotone half-period is still not a converged local rate.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the oscillation persists BELOW the half-period: within-segment q_local still swings wildly.
 * -------------------------------------------------------------------------------
 * The consecutive-rung local exponent inside each monotone half-period is itself far from constant:
 * Segment A gives {10.23, 6.59, 21.74, 2.28} and Segment B gives {3.86, 17.85, 10.50, 28.72, 4.00}.
 * Even with |residual| strictly monotone, q_local ranges over an order of magnitude (2.3 -> 28.7). So the
 * imp-97659 RESULT-1 oscillation is NOT the single p ~ 2.4e7 turning point plus otherwise-clean power law:
 * the PNT/Mertens wiggle is present at every scale inside the half-period. No half-period yields a stable q.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the 1/p^s parameterisation is far MORE stable across half-periods (s ~ 0.78 -> 0.82).
 * -------------------------------------------------------------------------------
 * Regressing the SAME half-periods against log p (the abscissa proper to a |residual| ~ C/p^s model)
 * gives Segment A s ~ 0.782 (R^2 ~ 0.962) and Segment B s ~ 0.817 (R^2 ~ 0.958) -- a spread of only ~0.035,
 * an order of magnitude tighter (relative to the value) than the 1/(log p)^q spread of ~2.3. This confirms
 * imp-97687 RESULT 4 from the local side: "exponent ~10-15" is an artifact of the log(log p) abscissa
 * (which barely varies across the ladder, ~2.67 -> ~2.91, amplifying the slope); the residual is closer to
 * a slowly-decaying inverse power of p (s well below 1) with an oscillating PNT/Mertens overlay. This is a
 * measured reparameterisation, NOT a fit good enough to name a decay law and NOT a bound on anything.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. Restricting the imp-97659 residual regression to a single monotone
 * half-period between the two RESULT-1 sign changes does NOT recover a stable local decay exponent: the two
 * half-periods disagree (12.3 vs 14.6 in the 1/(log p)^q model), and the within-half-period consecutive
 * exponent still swings 2.3 -> 28.7. The oscillating PNT/Mertens fingerprint lives below the single sign
 * change, not just at it, so "converged local q" does not exist at these heights. The only comparatively
 * stable reading is the 1/p^s abscissa (s ~ 0.78 -> 0.82 across half-periods), corroborating imp-97687
 * RESULT 4 that the large 1/(log p)^q exponent is a log(log p)-abscissa amplification. All half-period
 * exponents stay far above 3, so "outruns every fixed power <= 3" is unchanged. MCM stays refuted from
 * omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-97687-route-m-avg-exponent-robustness.js (RESULT 3 window dependence ~10 -> ~15; RESULT 4 abscissa)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (deep dps=30 ladder; RESULT 1 oscillation + negative rung)
 * @see imp-97619-route-m-mcm-binf-mertens-closed-form.js (B_inf = lnA + gamma/12; next order = PNT/Mertens error)
 *
 * Ticket: imp-97699 (numerical, opus-4-8, api-pool). Local half-period decay rate: no converged q; NO QED.
 */

import { IMP97659_DEEP_LADDER } from './imp-97659-route-m-gap-law-decay-extprec.js';

const LADDER = IMP97659_DEEP_LADDER;

// -- abscissa (model) choices for the log-linear fit of log|residual| vs abscissa(row) --
const abLogLogP = (r) => Math.log(Math.log(r.pOmega)); // proper to |residual| ~ C/(log p)^q
const abLogP = (r) => Math.log(r.pOmega);              // proper to |residual| ~ C/p^s

// least-squares fit of log|residual| vs abscissa; returns { exponent = -slope, r2, n }.
function fit(rows, abscissa) {
  const xs = rows.map(abscissa);
  const ys = rows.map((r) => Math.log(Math.abs(r.residual)));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
    syy += (ys[i] - my) * (ys[i] - my);
  }
  if (den === 0 || syy === 0) return { exponent: NaN, r2: NaN, n };
  return { exponent: -num / den, r2: (num * num) / (den * syy), n };
}

// consecutive-rung local exponent q for |residual| ~ C/(log p)^q, recomputed from the rows.
function localExponents(rows) {
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const lp0 = Math.log(rows[i - 1].pOmega);
    const lp1 = Math.log(rows[i].pOmega);
    out.push(Math.log(Math.abs(rows[i - 1].residual) / Math.abs(rows[i].residual)) / Math.log(lp1 / lp0));
  }
  return out;
}

// -- locate the direction sign changes of |residual| vs height (imp-97659 RESULT-1 turning points) --
// dir[i] compares row i+1 vs row i: "down" if |residual| falls, "up" if it rises.
function directionTurningPoints(rows) {
  const dir = [];
  for (let i = 1; i < rows.length; i++) dir.push(Math.abs(rows[i].residual) < Math.abs(rows[i - 1].residual) ? 'down' : 'up');
  const turns = [];
  for (let i = 1; i < dir.length; i++) if (dir[i] !== dir[i - 1]) turns.push(i);
  return { dir, turns };
}
const { turns: TURNS } = directionTurningPoints(LADDER);
// exactly one interior rise => exactly two direction sign changes, at ladder rungs 4 (down->up) and 5 (up->down).

// -- the two monotone half-periods bounded by the single oscillation --
const SEG_A = LADDER.slice(0, 5);  // rows 0..4: omega 148933..1.5e6, |residual| decreasing (pre-rise)
const SEG_B = LADDER.slice(5);     // rows 5..10: omega 2.0e6..5.7e6, |residual| decreasing (post-rise)
const SEG_B_STRICT = LADDER.slice(6); // rows 6..10: strictly after the local maximum row

const FIT_A_LOGLOGP = fit(SEG_A, abLogLogP);        // ~12.28, R^2 ~ 0.959
const FIT_B_LOGLOGP = fit(SEG_B, abLogLogP);        // ~14.58, R^2 ~ 0.956
const FIT_B_STRICT_LOGLOGP = fit(SEG_B_STRICT, abLogLogP); // ~16.59
const FIT_A_LOGP = fit(SEG_A, abLogP);              // s ~ 0.782, R^2 ~ 0.962
const FIT_B_LOGP = fit(SEG_B, abLogP);              // s ~ 0.817, R^2 ~ 0.958

const LOCAL_A = localExponents(SEG_A); // {10.23, 6.59, 21.74, 2.28}
const LOCAL_B = localExponents(SEG_B); // {3.86, 17.85, 10.50, 28.72, 4.00}
const spread = (arr) => Math.max(...arr) - Math.min(...arr);

export const IMP97699_HALFPERIOD = Object.freeze({
  question:
    'does restricting the imp-97659 log|residual| regression to a single monotone half-period (between the two RESULT-1 sign changes) recover a stable, converged local decay exponent q?',
  method:
    'reuse the imp-97659 dps=30 precision-clean ladder (11 rungs, p=2e6..9.9e7); split at the single |residual| direction reversal (p~2.4e7) into two monotone half-periods; least-squares log|residual| vs log(log p) and vs log p within each; also within-segment consecutive q_local',
  directionTurningPointCount: TURNS.length, // 2: the single rise is bounded by two sign changes
  segmentA: Object.freeze({
    pRange: [SEG_A[0].pOmega, SEG_A[SEG_A.length - 1].pOmega],
    points: SEG_A.length,
    exponentLogLogP: FIT_A_LOGLOGP.exponent, // ~12.28
    r2LogLogP: FIT_A_LOGLOGP.r2,
    exponentLogP: FIT_A_LOGP.exponent,       // s ~ 0.782
    r2LogP: FIT_A_LOGP.r2,
    localExponents: Object.freeze(LOCAL_A),  // {10.23, 6.59, 21.74, 2.28}
    localSpread: spread(LOCAL_A),
  }),
  segmentB: Object.freeze({
    pRange: [SEG_B[0].pOmega, SEG_B[SEG_B.length - 1].pOmega],
    points: SEG_B.length,
    exponentLogLogP: FIT_B_LOGLOGP.exponent, // ~14.58
    r2LogLogP: FIT_B_LOGLOGP.r2,
    exponentLogP: FIT_B_LOGP.exponent,       // s ~ 0.817
    r2LogP: FIT_B_LOGP.r2,
    localExponents: Object.freeze(LOCAL_B),  // {3.86, 17.85, 10.50, 28.72, 4.00}
    localSpread: spread(LOCAL_B),
  }),
  segmentBStrictExponentLogLogP: FIT_B_STRICT_LOGLOGP.exponent, // ~16.59, dropping the local-max row
  logLogPHalfPeriodSpread: Math.abs(FIT_B_LOGLOGP.exponent - FIT_A_LOGLOGP.exponent), // ~2.3, NOT collapsed
  logPHalfPeriodSpread: Math.abs(FIT_B_LOGP.exponent - FIT_A_LOGP.exponent),          // ~0.035, tight
});

export const IMP97699_VERDICT = Object.freeze({
  question: 'does a single monotone half-period yield a stable converged local decay exponent for the Route M residual?',
  halfPeriodRecoversStableLogLogQ: false, // 12.28 vs 14.58: still ~2.3 apart, not converged
  oscillationPersistsBelowHalfPeriod: true, // within-segment q_local swings 2.3 -> 28.7
  logPParameterisationMoreStable: true,     // s ~ 0.782 vs 0.817: spread ~0.035
  allHalfPeriodExponentsExceedThree: true,  // "outruns every fixed power <= 3" unchanged
  windowDependenceNotSignChangeArtifact: true, // splitting at the reversal does not remove it
  mcmRefuted: true,
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Restricting the imp-97659 residual regression to a single monotone half-period ' +
    'between the two RESULT-1 sign changes does NOT recover a stable local decay exponent: the pre-rise ' +
    'half-period fits ~12.28 and the post-rise half-period ~14.58 (still ~2.3 apart; dropping the ' +
    'local-max row pushes it to ~16.6), and the within-half-period consecutive exponent still swings ' +
    '2.3 -> 28.7. The oscillating PNT/Mertens fingerprint lives below the single sign change, so a ' +
    'converged local q does not exist at these heights. The only comparatively stable reading is the ' +
    '1/p^s abscissa (s ~ 0.782 -> 0.817 across half-periods, spread ~0.035), corroborating imp-97687 ' +
    'RESULT 4 that the large 1/(log p)^q exponent is a log(log p)-abscissa amplification. All ' +
    'half-period exponents stay far above 3. MCM stays refuted from omega=11; b/4 ceiling untouched; ' +
    'kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97699_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Local half-period decay rate of the imp-97659 Route M ' +
  'residual: restricting the log|residual| regression to a single monotone half-period between the two ' +
  'RESULT-1 sign changes does NOT converge the local exponent (pre-rise ~12.28 vs post-rise ~14.58, still ' +
  '~2.3 apart; within-segment q_local still swings 2.3 -> 28.7), so no window yields a stable local q. The ' +
  '1/p^s abscissa is far tighter (s ~ 0.782 -> 0.817), confirming the large 1/(log p)^q exponent is a ' +
  'log(log p)-abscissa amplification (imp-97687 RESULT 4). All half-period exponents exceed 3. No bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97699_ASSERTIONS = [
  {
    id: 'imp97699-single-oscillation-two-sign-changes',
    holds: () => TURNS.length === 2 && SEG_A.length === 5 && SEG_B.length === 6,
    why: 'the imp-97659 ladder has exactly one interior |residual| rise (p~2.4e7), giving two direction sign changes that split it into a 5-point and a 6-point monotone half-period.',
  },
  {
    id: 'imp97699-halfperiods-disagree-loglogq',
    holds: () =>
      FIT_A_LOGLOGP.exponent > 3 &&
      FIT_B_LOGLOGP.exponent > 3 &&
      Math.abs(FIT_A_LOGLOGP.exponent - 12.28) < 0.2 &&
      Math.abs(FIT_B_LOGLOGP.exponent - 14.58) < 0.2 &&
      Math.abs(FIT_B_LOGLOGP.exponent - FIT_A_LOGLOGP.exponent) > 1.5,
    why: 'the two monotone half-periods return ~12.28 and ~14.58 in the 1/(log p)^q model -- still >1.5 apart, so a single half-period is NOT a converged local rate.',
  },
  {
    id: 'imp97699-oscillation-persists-below-halfperiod',
    holds: () => spread(LOCAL_A) > 10 && spread(LOCAL_B) > 10,
    why: 'inside each monotone half-period the consecutive-rung local exponent still swings by more than 10 (2.3 -> 28.7), so the PNT/Mertens oscillation lives below the single sign change, not just at it.',
  },
  {
    id: 'imp97699-logp-parameterisation-more-stable',
    holds: () =>
      FIT_A_LOGP.exponent > 0.5 &&
      FIT_A_LOGP.exponent < 1 &&
      FIT_B_LOGP.exponent > 0.5 &&
      FIT_B_LOGP.exponent < 1 &&
      Math.abs(FIT_B_LOGP.exponent - FIT_A_LOGP.exponent) < 0.1 &&
      Math.abs(FIT_B_LOGP.exponent - FIT_A_LOGP.exponent) <
        Math.abs(FIT_B_LOGLOGP.exponent - FIT_A_LOGLOGP.exponent),
    why: 'the same half-periods fit s ~ 0.782 and ~0.817 against log p, a spread ~0.035 far tighter than the ~2.3 of the 1/(log p)^q model -- the large exponent is a log(log p)-abscissa amplification (imp-97687 RESULT 4).',
  },
  {
    id: 'imp97699-honesty-gate-no-qed',
    holds: () =>
      IMP97699_VERDICT.halfPeriodRecoversStableLogLogQ === false &&
      IMP97699_VERDICT.oscillationPersistsBelowHalfPeriod === true &&
      IMP97699_VERDICT.logPParameterisationMoreStable === true &&
      IMP97699_VERDICT.mcmRefuted === true &&
      IMP97699_VERDICT.ceilingTouched === false &&
      IMP97699_VERDICT.anyBoundMoved === false &&
      IMP97699_VERDICT.qed === false &&
      /NO QED/.test(IMP97699_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97699_HONEST_BANNER) &&
      /RH open/.test(IMP97699_HONEST_BANNER),
    why: 'measurement only -- no monotone half-period yields a stable local q; the oscillation persists below the sign change; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97699_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97699-route-m-local-halfperiod-decay-rate assertion failed: ${a.id}`);
  }
}

export default {
  halfPeriod: IMP97699_HALFPERIOD,
  verdict: IMP97699_VERDICT,
  banner: IMP97699_HONEST_BANNER,
};
