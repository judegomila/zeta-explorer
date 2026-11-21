/**
 * @module imp-97680-residual-exponent-vs-mertens-delta-phaselock
 *
 * imp-97680 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97659 RESULT 1 found that the local decay exponent q of the Route M gap-law residual
 *     residual(omega) = gap(omega) - e^{-gamma}*B_inf/log p_omega
 * OSCILLATES across p = 2e6 .. 9.9e7 (q_local from -6.738 to +28.721), with one NEGATIVE rung at
 * p = 2.39e7 -> 3.25e7 where |residual| RISES with height (1.369e-7 -> 1.544e-7). imp-97639 FINDING 2
 * independently reported that the Mertens undershoot delta = gamma - M_omega WIGGLES at fine deep
 * resolution: it dips (bracket) / rises (delta) near p ~ 3.2e7 rather than decreasing smoothly.
 *
 * This leaf asks whether those two effects are PHASE-LOCKED -- a genuine cross-correlation now that both
 * live on the same dps=30 / deep-sieve heights -- or independent. Both ladders were computed on the SAME
 * omega grid at five COMMON heights (omega = 148933, 500000, 1000000, 2000000, 3000000; p = 1999993,
 * 7368787, 15485863, 32452843, 49979687), so |residual| (imp-97659) and delta = gamma - M (imp-97639) can
 * be compared rung-for-rung with no interpolation.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the two ladders turn on the SAME rung: co-movement is exact on the common heights.
 * -------------------------------------------------------------------------------
 * Across the four consecutive common-height rungs the sign of the change agrees 4/4:
 *   1999993 -> 7368787 : |res| DOWN, delta DOWN
 *   7368787 -> 15485863: |res| DOWN, delta DOWN
 *   15485863 -> 32452843: |res| UP,  delta UP   <-- the single rise, in BOTH ladders, lands at p = 3.25e7
 *   32452843 -> 49979687: |res| DOWN, delta DOWN
 * The lone rise (the imp-97659 negative-exponent rung and the imp-97639 delta wiggle) is the SAME rung in
 * both series -- both turn upward landing at omega = 2e6, p = 32452843. Sign concordance = 4/4 = 1.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- strong positive correlation on the common heights (Pearson r ~ 0.993).
 * -------------------------------------------------------------------------------
 * The Pearson correlation between |residual| and delta over the five common heights is ~0.9932: they
 * co-vary tightly. This is the expected fingerprint -- the imp-97619 sub-gap identifies the residual
 * next-order term AS the PNT/Mertens error, and delta = gamma - M_omega IS that Mertens error, so the two
 * are the same oscillating quantity up to a slowly-varying prefactor.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (HONEST NUANCE) -- phase-locked, but NOT a fixed proportion.
 * -------------------------------------------------------------------------------
 * The ratio |residual|/delta is not constant across the common heights: it drifts from ~1.04e-3 to
 * ~6.9e-4 (max/min ~1.50). So the two series share the same turning rung and sign of change (phase-lock)
 * but not a single multiplicative constant -- consistent with the residual carrying an extra slowly-varying
 * 1/log p factor relative to delta (the law term e^{-gamma}*B_inf/log p_omega). Phase, not amplitude, is
 * what is locked.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. The imp-97659 residual-exponent oscillation and the imp-97639 Mertens delta
 * wiggle ARE phase-locked on their shared dps=30 deep heights: the single upward turn is the SAME rung in
 * both series (landing at p = 32452843), sign-of-change agrees 4/4, and the two series correlate at
 * Pearson r ~ 0.993. They are NOT independent -- both are the same oscillating PNT/Mertens error, as the
 * imp-97619 sub-gap predicts. HONEST nuance: the lock is in phase, not amplitude (|res|/delta drifts ~1.5x,
 * not a fixed proportion). MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged;
 * no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97659-route-m-gap-law-decay-extprec.js (residual decay exponent OSCILLATES; negative rung at p ~ 3.25e7)
 * @see imp-97639-route-m-mcm-binf-deep-mertens-crosscheck.js (delta = gamma - M wiggles; bracket dips at p ~ 3.2e7)
 * @see imp-97619-route-m-mcm-binf-mertens-closed-form.js (next-order term IS the PNT/Mertens error, not elementary)
 *
 * Ticket: imp-97680 (numerical, opus-4-8, api-pool). Residual oscillation vs Mertens delta wiggle: phase-locked; NO QED.
 */

// Common-height rows: |residual| from imp-97659 IMP97659_DEEP_LADDER, delta = gamma - M from imp-97639
// IMP97639_DEEP_LADDER, at the five omega values present in BOTH ladders (import-light -- values baked as
// literals per the imp-2546/heavy-import rule; both source leaves carry the same figures).
export const IMP97680_COMMON_LADDER = Object.freeze([
  Object.freeze({ omega: 148933, pOmega: 1999993, absResidual: 8.351691933e-7, delta: 8.007e-4 }),
  Object.freeze({ omega: 500000, pOmega: 7368787, absResidual: 3.937432152e-7, delta: 4.564e-4 }),
  Object.freeze({ omega: 1000000, pOmega: 15485863, absResidual: 1.451769323e-7, delta: 1.447e-4 }),
  Object.freeze({ omega: 2000000, pOmega: 32452843, absResidual: 1.544098916e-7, delta: 2.107e-4 }), // BOTH rise
  Object.freeze({ omega: 3000000, pOmega: 49979687, absResidual: 1.203494458e-7, delta: 1.732e-4 }),
]);

// Rung-by-rung change signs for the two series, recomputed here (no bake).
function changeSigns(ladder, key) {
  const out = [];
  for (let i = 1; i < ladder.length; i++) {
    out.push(Object.freeze({
      fromP: ladder[i - 1].pOmega,
      toP: ladder[i].pOmega,
      sign: Math.sign(ladder[i][key] - ladder[i - 1][key]),
    }));
  }
  return Object.freeze(out);
}

export const IMP97680_RESIDUAL_CHANGE_SIGNS = changeSigns(IMP97680_COMMON_LADDER, 'absResidual');
export const IMP97680_DELTA_CHANGE_SIGNS = changeSigns(IMP97680_COMMON_LADDER, 'delta');

// Sign-concordance fraction (rungs where |residual| and delta change in the same direction).
function signConcordance(ladder) {
  let agree = 0;
  const n = ladder.length - 1;
  for (let i = 1; i < ladder.length; i++) {
    const dRes = Math.sign(ladder[i].absResidual - ladder[i - 1].absResidual);
    const dDelta = Math.sign(ladder[i].delta - ladder[i - 1].delta);
    if (dRes === dDelta) agree++;
  }
  return { agree, total: n, fraction: agree / n };
}

export const IMP97680_SIGN_CONCORDANCE = Object.freeze(signConcordance(IMP97680_COMMON_LADDER)); // 4/4 = 1

// Pearson correlation between |residual| and delta over the common heights, recomputed here.
function pearson(ladder) {
  const xs = ladder.map((r) => r.absResidual);
  const ys = ladder.map((r) => r.delta);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) * (xs[i] - mx);
    dy += (ys[i] - my) * (ys[i] - my);
  }
  return num / Math.sqrt(dx * dy);
}

export const IMP97680_PEARSON_R = pearson(IMP97680_COMMON_LADDER); // ~0.9932

// Ratio |residual|/delta across common heights: drifts (phase-locked, not a fixed proportion).
export const IMP97680_RATIO_DRIFT = (() => {
  const ratios = IMP97680_COMMON_LADDER.map((r) => r.absResidual / r.delta);
  return Object.freeze({ ratios: Object.freeze(ratios), max: Math.max(...ratios), min: Math.min(...ratios), spread: Math.max(...ratios) / Math.min(...ratios) });
})();

export const IMP97680_RESULTS = Object.freeze({
  question: 'is the imp-97659 residual-exponent oscillation (negative rung at p ~ 3.25e7) phase-locked to the imp-97639 Mertens delta = gamma - M wiggle on their shared dps=30 deep heights?',
  method: 'compare |residual| (imp-97659) and delta (imp-97639) rung-for-rung at the five COMMON omega heights (148933, 500000, 1000000, 2000000, 3000000); sign-of-change concordance + Pearson correlation + ratio drift',
  commonHeights: IMP97680_COMMON_LADDER.map((r) => r.pOmega),
  riseRungLandsAtSamePOmega: 32452843,        // the single upward turn in BOTH series lands at p = 3.25e7 (omega = 2e6)
  signConcordanceFraction: IMP97680_SIGN_CONCORDANCE.fraction, // 4/4 = 1
  pearsonR: IMP97680_PEARSON_R,               // ~0.9932
  phaseLocked: true,                          // same turning rung, same sign of change, strong correlation
  fixedProportion: false,                     // |res|/delta drifts ~1.50x -- lock is in phase, not amplitude
  ratioSpread: IMP97680_RATIO_DRIFT.spread,   // ~1.50
  sameOscillatingPntError: true,              // both ARE the PNT/Mertens error (imp-97619 sub-gap)
});

export const IMP97680_VERDICT = Object.freeze({
  question: 'are the residual-exponent oscillation and the Mertens delta wiggle phase-locked (same rungs/phase) or independent?',
  phaseLocked: true,                          // single rise is the same rung; sign concordance 4/4; r ~ 0.993
  riseOnSameRung: true,                       // both turn upward landing at p = 32452843 (omega = 2e6)
  signConcordanceIsOne: true,                 // 4/4 consecutive common-height rungs agree in direction
  strongCorrelation: true,                    // Pearson r ~ 0.993 over the common heights
  notFixedProportion: true,                   // |res|/delta drifts ~1.50x -- phase-locked, not amplitude-locked
  sameOscillatingPntError: true,              // both are the same PNT/Mertens error, as imp-97619 predicts
  mcmRefuted: true,                           // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. On the five COMMON dps=30 deep heights (p = 1999993 .. 49979687) the imp-97659 ' +
    'gap-law residual magnitude and the imp-97639 Mertens delta = gamma - M ARE phase-locked: the single ' +
    'upward turn is the SAME rung in both series (landing at p = 32452843, omega = 2e6), the sign of the ' +
    'rung-to-rung change agrees 4/4, and the two series correlate at Pearson r ~ 0.993. They are NOT ' +
    'independent -- both are the same oscillating PNT/Mertens error (imp-97619 sub-gap: the residual ' +
    'next-order term IS the Mertens error). HONEST nuance: the lock is in phase, not amplitude -- ' +
    '|residual|/delta drifts ~1.50x across the heights, so there is no single multiplicative constant ' +
    '(consistent with the residual carrying an extra 1/log p factor from the law term). MCM stays refuted ' +
    'from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP97680_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-correlation of the imp-97659 residual-exponent ' +
  'oscillation and the imp-97639 Mertens delta = gamma - M wiggle on their shared dps=30 deep heights: they ' +
  'are PHASE-LOCKED -- the single upward turn is the same rung in both series (landing at p = 32452843, ' +
  'omega = 2e6), sign-of-change agrees 4/4, and Pearson r ~ 0.993. Both are the same oscillating ' +
  'PNT/Mertens error (imp-97619 sub-gap), NOT independent. HONEST nuance: the lock is in phase not ' +
  'amplitude (|res|/delta drifts ~1.50x, no fixed proportion). MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97680_ASSERTIONS = [
  {
    id: 'imp97680-common-ladder-internal-consistency',
    holds: () => {
      const expectedP = [1999993, 7368787, 15485863, 32452843, 49979687];
      if (IMP97680_COMMON_LADDER.length !== expectedP.length) return false;
      for (let i = 0; i < IMP97680_COMMON_LADDER.length; i++) {
        const row = IMP97680_COMMON_LADDER[i];
        if (row.pOmega !== expectedP[i]) return false;   // the five heights common to both source ladders
        if (!(row.absResidual > 0)) return false;         // |residual| magnitude
        if (!(row.delta > 0)) return false;               // delta = gamma - M is a positive undershoot
      }
      return true;
    },
    why: 'the common-height ladder carries the five omega heights shared by imp-97659 and imp-97639, with positive |residual| and positive delta on each rung.',
  },
  {
    id: 'imp97680-single-rise-is-same-rung',
    holds: () => {
      // exactly one rung rises in each series, and it is the same rung (lands at p = 32452843).
      const rises = (signs) => signs.filter((s) => s.sign > 0);
      const resRise = rises(IMP97680_RESIDUAL_CHANGE_SIGNS);
      const deltaRise = rises(IMP97680_DELTA_CHANGE_SIGNS);
      return resRise.length === 1 && deltaRise.length === 1 &&
        resRise[0].toP === 32452843 && deltaRise[0].toP === 32452843;
    },
    why: 'both series have a single upward turn on the common heights and it lands on the SAME rung (p = 32452843, omega = 2e6) -- the imp-97659 negative-exponent rung coincides with the imp-97639 delta wiggle.',
  },
  {
    id: 'imp97680-sign-concordance-is-one',
    holds: () => IMP97680_SIGN_CONCORDANCE.agree === 4 && IMP97680_SIGN_CONCORDANCE.total === 4 &&
      IMP97680_SIGN_CONCORDANCE.fraction === 1,
    why: 'the sign of the rung-to-rung change of |residual| and delta agrees on all four common-height rungs (4/4) -- the two series move together.',
  },
  {
    id: 'imp97680-strong-positive-correlation',
    holds: () => IMP97680_PEARSON_R > 0.95 && Math.abs(IMP97680_PEARSON_R - 0.9932) < 0.005,
    why: 'the Pearson correlation between |residual| and delta over the common heights is ~0.9932, a strong positive co-variation -- both track the same oscillating PNT/Mertens error.',
  },
  {
    id: 'imp97680-phase-locked-not-fixed-proportion',
    holds: () => IMP97680_RATIO_DRIFT.spread > 1.3 && Math.abs(IMP97680_RATIO_DRIFT.spread - 1.50) < 0.1,
    why: 'the ratio |residual|/delta drifts ~1.50x across the heights, so the two are phase-locked (same turning rung, same sign) but NOT a fixed proportion -- the lock is in phase, not amplitude.',
  },
  {
    id: 'imp97680-honesty-gate-no-qed',
    holds: () =>
      IMP97680_VERDICT.phaseLocked === true &&
      IMP97680_VERDICT.riseOnSameRung === true &&
      IMP97680_VERDICT.signConcordanceIsOne === true &&
      IMP97680_VERDICT.strongCorrelation === true &&
      IMP97680_VERDICT.notFixedProportion === true &&
      IMP97680_VERDICT.sameOscillatingPntError === true &&
      IMP97680_VERDICT.mcmRefuted === true &&
      IMP97680_VERDICT.ceilingTouched === false &&
      IMP97680_VERDICT.anyBoundMoved === false &&
      IMP97680_VERDICT.qed === false &&
      /NO QED/.test(IMP97680_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97680_HONEST_BANNER) &&
      /RH open/.test(IMP97680_HONEST_BANNER),
    why: 'measurement only -- the residual oscillation and the Mertens delta wiggle are phase-locked (same rung, 4/4 concordance, r ~ 0.993), the same PNT/Mertens error; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97680_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97680-residual-exponent-vs-mertens-delta-phaselock assertion failed: ${a.id}`);
  }
}

export default {
  commonLadder: IMP97680_COMMON_LADDER,
  residualChangeSigns: IMP97680_RESIDUAL_CHANGE_SIGNS,
  deltaChangeSigns: IMP97680_DELTA_CHANGE_SIGNS,
  signConcordance: IMP97680_SIGN_CONCORDANCE,
  pearsonR: IMP97680_PEARSON_R,
  ratioDrift: IMP97680_RATIO_DRIFT,
  results: IMP97680_RESULTS,
  verdict: IMP97680_VERDICT,
  banner: IMP97680_HONEST_BANNER,
};
