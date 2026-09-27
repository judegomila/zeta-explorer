/**
 * @module imp-97679-route-m-residual-delta-deep-overlap-correlation
 *
 * imp-97679 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97667 RAN the residual-vs-delta sign-correlation test but hit a HARD sub-gap
 * (IMP97667_SIGN_CORRELATION_NEEDS_OVERLAPPING_DEEP_RESIDUAL_LADDER): the IEEE-double residual ladder
 * ended at p ~ 2e6, exactly where the imp-97639 delta ladder begins, so the two ladders overlapped at
 * EXACTLY ONE height (p = 1999993) and no rung-by-rung correlation of the delta magnitude wiggle was
 * possible. imp-97659 has since recomputed the Route M gap AND law at extended precision (mpmath dps=30,
 * live sieve to p = 1e8), producing a precision-clean deep residual ladder
 *     residual(omega) = gap(omega) - e^{-gamma}*B_inf/log p_omega,   B_inf = lnA + gamma/12,
 * over p = 2e6 .. 9.9e7 -- the region where the imp-97639 delta = gamma - M_omega wiggle actually occurs.
 * This leaf re-runs the imp-97667 test on that now-overlapping deep ladder.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the ladders now OVERLAP at FIVE heights (was one), so the test is finally measurable.
 * -------------------------------------------------------------------------------
 * The imp-97659 dps=30 residual ladder and the imp-97639 delta ladder share p in
 *     {1999993, 7368787, 15485863, 32452843, 49979687}
 * -- five common heights spanning the delta wiggle, versus the single p = 1999993 imp-97667 had. The
 * imp-97667 sub-gap IMP97667_SIGN_CORRELATION_NEEDS_OVERLAPPING_DEEP_RESIDUAL_LADDER is UNBLOCKED.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the residual MAGNITUDE tracks the delta wiggle rung-by-rung: 4/4 direction agreement.
 * -------------------------------------------------------------------------------
 * On the five shared rungs both |residual| and delta move in the SAME direction on every one of the four
 * transitions (down, down, UP, down). The UP rung is p = 15485863 -> 32452843: delta RISES
 * 1.447e-4 -> 2.107e-4 and |residual| RISES 1.452e-7 -> 1.544e-7 at the SAME rung -- the imp-97639 "rise at
 * p ~ 3.2e7" magnitude wiggle and the imp-97659 negative-exponent rung are the SAME feature. The Pearson
 * correlation of |residual| against delta on the shared heights is +0.993. So the magnitude relationship
 * the imp-97667 single overlap could not test is now confirmed: the residual magnitude DOES track the delta
 * magnitude wiggle rung-by-rung.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the SIGN relationship is still a FIXED structural anti-correlation, not a sign oscillation.
 * -------------------------------------------------------------------------------
 * As in imp-97667, all five residuals stay NEGATIVE and all five deltas stay POSITIVE across the deep
 * overlap: the wiggle is a MAGNITUDE wiggle on BOTH ladders, not a sign oscillation. The fixed sign
 * anti-correlation (residual < 0 <=> delta > 0) is the algebraic consequence of the shared bracket
 * undershoot residual ~ -e^{-gamma}*delta/(12 log p) (bracket = lnA + M/12, B_inf = lnA + gamma/12), so it
 * carries no PNT evidence by itself -- exactly the imp-97667 RESULT 2 structural reading, now confirmed to
 * hold unbroken across five deep rungs rather than one.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 -- the residual is still NOT proportional to delta: the competing gap self-correction persists.
 * -------------------------------------------------------------------------------
 * The delta-only bracket-implied residual -e^{-gamma}*delta/(12 log p) OVERSHOOTS the actual residual on
 * every shared rung by a factor that itself varies (2.82 .. 3.80, ~3.09 at p = 1999993 matching imp-97667),
 * and the gap self-correction residual - (bracket-implied) is POSITIVE on all five rungs. So the residual
 * remains a COMPETITION between the delta-tied bracket undershoot (negative) and a positive gap
 * self-correction, corroborating imp-97667 RESULT 3 across the full deep overlap: the residual tracks the
 * delta wiggle in DIRECTION but is not a rescaled copy of delta.
 *
 * VERDICT.  MEASUREMENT ONLY. Re-running the imp-97667 residual-vs-delta test on the imp-97659 dps=30 deep
 * ladder RESOLVES the imp-97667 sub-gap: the ladders now overlap at FIVE heights, and the residual MAGNITUDE
 * tracks the imp-97639 delta magnitude wiggle rung-by-rung (4/4 direction agreement, the rise coincident at
 * p ~ 3.2e7, Pearson +0.993). The SIGN relationship remains a FIXED structural anti-correlation
 * (residual < 0, delta > 0 -- both single-signed, both magnitude-wiggling), and the residual is still NOT
 * proportional to delta (overshoot 2.82 .. 3.80, positive competing gap self-correction). This CORROBORATES
 * the imp-97640 PNT/Mertens attribution at the level of magnitude tracking -- the residual and the
 * Mertens-error delta share the same finite-height wiggle -- while confirming (imp-97667 RESULT 3) that the
 * residual carries a second competing correction, so it is not a rescaled delta. MCM stays refuted from
 * omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA;
 * RH open; NO QED.
 *
 * @see imp-97667-route-m-residual-delta-sign-correlation.js (single-overlap test; sub-gap raised here)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 deep residual ladder p = 2e6 .. 9.9e7)
 * @see imp-97639-route-m-mcm-binf-deep-mertens-crosscheck.js (deep delta ladder; delta magnitude wiggles at p ~ 3.2e7)
 *
 * Ticket: imp-97679 (numerical, opus-4-8, api-pool). Deep-overlap residual/delta correlation; magnitude tracks; NO QED.
 */

// Constants baked as literals (import-light; no heavy transitive imports -- imp-2546/heavy-import rule).
const LN_A = 0.2487544770337842;      // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const GAMMA = 0.5772156649015329;     // Euler-Mascheroni
const E_NEG_GAMMA = Math.exp(-GAMMA); // e^{-gamma} = 0.561459...
const B_INF = LN_A + GAMMA / 12;      // 0.2968557824422453 (imp-97619 closed form)

// imp-97659 dps=30 deep residual ladder (residual = gap - e^{-gamma}*B_inf/log p_omega); precision-clean.
export const IMP97679_RESIDUAL_LADDER = Object.freeze([
  Object.freeze({ omega: 148933, pOmega: 1999993, residual: -8.351691933e-7 }),
  Object.freeze({ omega: 500000, pOmega: 7368787, residual: -3.937432152e-7 }),
  Object.freeze({ omega: 1000000, pOmega: 15485863, residual: -1.451769323e-7 }),
  Object.freeze({ omega: 2000000, pOmega: 32452843, residual: -1.544098916e-7 }), // residual RISES
  Object.freeze({ omega: 3000000, pOmega: 49979687, residual: -1.203494458e-7 }),
]);

// imp-97639 deep delta ladder (delta = gamma - M_omega); all positive, magnitude wiggles (rise at p ~ 3.2e7).
export const IMP97679_DELTA_LADDER = Object.freeze([
  Object.freeze({ omega: 148933, pOmega: 1999993, delta: 8.007e-4 }),
  Object.freeze({ omega: 500000, pOmega: 7368787, delta: 4.564e-4 }),
  Object.freeze({ omega: 1000000, pOmega: 15485863, delta: 1.447e-4 }),
  Object.freeze({ omega: 2000000, pOmega: 32452843, delta: 2.107e-4 }), // delta RISES at the same rung
  Object.freeze({ omega: 3000000, pOmega: 49979687, delta: 1.732e-4 }),
]);

// The five shared heights, each carrying BOTH quantities plus the structural bracket-undershoot check.
export const IMP97679_OVERLAP = Object.freeze((() => {
  const dMap = new Map(IMP97679_DELTA_LADDER.map((d) => [d.pOmega, d.delta]));
  const rows = IMP97679_RESIDUAL_LADDER.filter((r) => dMap.has(r.pOmega)).map((r) => {
    const delta = dMap.get(r.pOmega);
    const logP = Math.log(r.pOmega);
    const bracketImpliedResidual = -(E_NEG_GAMMA * delta) / (12 * logP); // residual predicted from delta alone
    return Object.freeze({
      pOmega: r.pOmega,
      residual: r.residual,
      absResidual: Math.abs(r.residual),
      delta,
      logP,
      bracketImpliedResidual,
      overshootFactor: bracketImpliedResidual / r.residual,  // >1: delta-only prediction overshoots actual
      gapSelfCorrection: r.residual - bracketImpliedResidual, // competing positive term
    });
  });
  return Object.freeze(rows);
})());

// Rung-by-rung direction agreement of |residual| and delta over the shared heights.
export const IMP97679_DIRECTION = Object.freeze((() => {
  const rows = IMP97679_OVERLAP;
  const transitions = [];
  let agree = 0;
  for (let i = 1; i < rows.length; i++) {
    const dDelta = Math.sign(rows[i].delta - rows[i - 1].delta);
    const dAbsRes = Math.sign(rows[i].absResidual - rows[i - 1].absResidual);
    const match = dDelta === dAbsRes;
    if (match) agree++;
    transitions.push(Object.freeze({
      fromP: rows[i - 1].pOmega,
      toP: rows[i].pOmega,
      deltaDirection: dDelta,
      absResidualDirection: dAbsRes,
      match,
    }));
  }
  return Object.freeze({
    transitions: Object.freeze(transitions),
    agreements: agree,
    total: transitions.length,
    allAgree: agree === transitions.length,
    // the single UP rung -- the coincident magnitude wiggle
    wiggleRiseRung: Object.freeze(transitions.filter((t) => t.deltaDirection > 0 && t.absResidualDirection > 0).map((t) => `${t.fromP}->${t.toP}`)),
  });
})());

// Pearson correlation of |residual| against delta on the shared heights.
export const IMP97679_PEARSON = (() => {
  const rows = IMP97679_OVERLAP;
  const n = rows.length;
  const mx = rows.reduce((a, r) => a + r.delta, 0) / n;
  const my = rows.reduce((a, r) => a + r.absResidual, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (const r of rows) {
    sxy += (r.delta - mx) * (r.absResidual - my);
    sxx += (r.delta - mx) * (r.delta - mx);
    syy += (r.absResidual - my) * (r.absResidual - my);
  }
  return sxy / Math.sqrt(sxx * syy);
})(); // ~ +0.993

export const IMP97679_RESULTS = Object.freeze({
  question: 'on the imp-97659 dps=30 deep residual ladder (now overlapping the imp-97639 delta ladder), does residual sign/magnitude track the delta wiggle rung-by-rung?',
  overlapCount: IMP97679_OVERLAP.length,          // 5 (was 1 in imp-97667)
  sharedHeights: Object.freeze(IMP97679_OVERLAP.map((r) => r.pOmega)),
  subGapUnblocked: 'IMP97667_SIGN_CORRELATION_NEEDS_OVERLAPPING_DEEP_RESIDUAL_LADDER',
  directionAgreements: IMP97679_DIRECTION.agreements, // 4
  directionTotal: IMP97679_DIRECTION.total,           // 4
  directionAllAgree: IMP97679_DIRECTION.allAgree,     // true
  wiggleRiseCoincident: IMP97679_DIRECTION.wiggleRiseRung, // ['15485863->32452843']
  pearson: IMP97679_PEARSON,                          // ~ +0.993
  magnitudeTracksWiggle: true,                        // |residual| tracks delta magnitude wiggle rung-by-rung
  residualSingleSignedNegative: true,                 // no residual sign oscillation
  deltaSingleSignedPositive: true,                    // no delta sign oscillation -- wiggle is magnitude
  signAntiCorrelationIsFixedStructural: true,         // residual < 0 <=> delta > 0, algebraic bracket undershoot
  overshootFactorMin: Math.min(...IMP97679_OVERLAP.map((r) => r.overshootFactor)),
  overshootFactorMax: Math.max(...IMP97679_OVERLAP.map((r) => r.overshootFactor)),
  gapSelfCorrectionAllPositive: IMP97679_OVERLAP.every((r) => r.gapSelfCorrection > 0),
  residualNotProportionalToDelta: true,               // varying overshoot + competing positive correction
  attributionVerdict: 'CORROBORATED at magnitude level -- residual and Mertens-error delta share the same finite-height wiggle; residual not a rescaled delta',
});

export const IMP97679_VERDICT = Object.freeze({
  question: 'does the imp-97659 deep residual track the imp-97639 delta wiggle rung-by-rung now that the ladders overlap?',
  laddersOverlapMultiRung: true,             // five shared heights, was one
  magnitudeTracksRungByRung: true,           // 4/4 direction agreement, coincident rise, Pearson ~ +0.993
  residualSingleSigned: true,                // all negative
  deltaSingleSigned: true,                   // all positive (magnitude wiggle only)
  signRelationshipIsStructural: true,        // fixed anti-correlation, bracket undershoot identity
  residualProportionalToDelta: false,        // overshoot varies 2.82 .. 3.80, competing positive gap self-correction
  attributionCorroborated: true,             // magnitude tracking supports imp-97640 PNT/Mertens attribution
  attributionFalsified: false,
  subGapResolved: 'IMP97667_SIGN_CORRELATION_NEEDS_OVERLAPPING_DEEP_RESIDUAL_LADDER',
  mcmRefuted: true,                          // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Re-running the imp-97667 residual-vs-delta test on the imp-97659 dps=30 deep ladder ' +
    'RESOLVES the imp-97667 sub-gap: the residual and delta ladders now overlap at FIVE heights ' +
    '(1999993, 7368787, 15485863, 32452843, 49979687) instead of one. Over those five rungs the residual ' +
    'MAGNITUDE tracks the imp-97639 delta magnitude wiggle rung-by-rung -- 4/4 direction agreement, with the ' +
    'rise coincident at p = 15485863 -> 32452843 (the imp-97639 p ~ 3.2e7 wiggle = the imp-97659 negative ' +
    'exponent rung), Pearson +0.993. The SIGN relationship remains a FIXED structural anti-correlation ' +
    '(all residuals < 0, all deltas > 0 -- both magnitude-wiggling, neither sign-oscillating), the algebraic ' +
    'consequence of the shared bracket undershoot residual ~ -e^{-gamma}*delta/(12 log p). The residual is ' +
    'still NOT proportional to delta (overshoot 2.82 .. 3.80, positive competing gap self-correction on every ' +
    'rung), corroborating imp-97667 RESULT 3. Net: the imp-97640 PNT/Mertens attribution is CORROBORATED at ' +
    'the magnitude level while the residual carries a second competing correction. MCM stays refuted from ' +
    'omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA; ' +
    'RH open; NO QED.',
});

export const IMP97679_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Re-run of the imp-97667 residual-vs-delta test on the ' +
  'imp-97659 dps=30 deep ladder: the ladders now overlap at FIVE heights (was one), resolving the imp-97667 ' +
  'sub-gap. The residual MAGNITUDE tracks the imp-97639 delta magnitude wiggle rung-by-rung (4/4 direction ' +
  'agreement, rise coincident at p ~ 3.2e7, Pearson +0.993). The SIGN relationship stays a FIXED structural ' +
  'anti-correlation (residual < 0, delta > 0 -- both magnitude-wiggling, neither sign-oscillating), and the ' +
  'residual is still not proportional to delta (overshoot 2.82 .. 3.80, competing positive gap self-correction). ' +
  'This corroborates the imp-97640 PNT/Mertens attribution at magnitude level. MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97679_ASSERTIONS = [
  {
    id: 'imp97679-ladders-overlap-five-heights',
    holds: () =>
      IMP97679_OVERLAP.length === 5 &&
      IMP97679_OVERLAP.map((r) => r.pOmega).join(',') === '1999993,7368787,15485863,32452843,49979687',
    why: 'the imp-97659 dps=30 residual ladder and the imp-97639 delta ladder now share five heights, so the imp-97667 single-overlap sub-gap is unblocked.',
  },
  {
    id: 'imp97679-magnitude-direction-agreement-4-of-4',
    holds: () => IMP97679_DIRECTION.agreements === 4 && IMP97679_DIRECTION.total === 4 && IMP97679_DIRECTION.allAgree,
    why: 'on all four transitions |residual| and delta move the same way (down, down, up, down), so the residual magnitude tracks the delta magnitude wiggle rung-by-rung.',
  },
  {
    id: 'imp97679-wiggle-rise-coincident',
    holds: () =>
      IMP97679_DIRECTION.wiggleRiseRung.length === 1 &&
      IMP97679_DIRECTION.wiggleRiseRung[0] === '15485863->32452843',
    why: 'both |residual| and delta RISE at the same rung p = 15485863 -> 32452843 -- the imp-97639 p ~ 3.2e7 magnitude wiggle is the imp-97659 negative-exponent rung.',
  },
  {
    id: 'imp97679-pearson-strong-positive',
    holds: () => IMP97679_PEARSON > 0.9 && Math.abs(IMP97679_PEARSON - 0.993) < 0.02,
    why: 'the Pearson correlation of |residual| against delta on the five shared heights is ~ +0.993, a strong positive magnitude correlation.',
  },
  {
    id: 'imp97679-both-single-signed',
    holds: () =>
      IMP97679_RESIDUAL_LADDER.every((r) => r.residual < 0) &&
      IMP97679_DELTA_LADDER.every((d) => d.delta > 0),
    why: 'all residuals stay negative and all deltas stay positive across the deep overlap -- both wiggle in magnitude, neither oscillates in sign, so the sign relationship is a fixed anti-correlation.',
  },
  {
    id: 'imp97679-structural-anti-correlation-holds',
    holds: () =>
      IMP97679_OVERLAP.every((r) =>
        r.residual < 0 && r.delta > 0 && r.bracketImpliedResidual < 0 &&
        Math.abs(r.bracketImpliedResidual - (-(E_NEG_GAMMA * r.delta) / (12 * r.logP))) < 1e-15),
    why: 'the leading bracket-undershoot model residual ~ -e^{-gamma}*delta/(12 log p) has the sign opposite delta on every shared rung, so the fixed anti-correlation is an algebraic identity, not PNT evidence.',
  },
  {
    id: 'imp97679-residual-not-proportional-to-delta',
    holds: () => {
      const mn = Math.min(...IMP97679_OVERLAP.map((r) => r.overshootFactor));
      const mx = Math.max(...IMP97679_OVERLAP.map((r) => r.overshootFactor));
      // overshoot varies (not a constant rescaling) and every gap self-correction is positive.
      return mn > 2.5 && mx < 4.0 && (mx - mn) > 0.5 && IMP97679_OVERLAP.every((r) => r.gapSelfCorrection > 0);
    },
    why: 'the delta-only prediction overshoots the actual residual by a VARYING factor (2.82 .. 3.80) with a positive competing gap self-correction on every rung, so the residual tracks delta in direction but is not a rescaled copy.',
  },
  {
    id: 'imp97679-anchor-matches-imp97667',
    holds: () => {
      // the shared anchor p=1999993 reproduces the imp-97667 overshoot ~3.09 and residual -8.35e-7.
      const a = IMP97679_OVERLAP.find((r) => r.pOmega === 1999993);
      return Math.abs(a.residual - (-8.351691933e-7)) < 5e-11 && Math.abs(a.overshootFactor - 3.09) < 0.05;
    },
    why: 'the deep-overlap anchor p=1999993 reproduces the imp-97667 single-overlap reading (residual -8.35e-7, overshoot ~3.09), validating continuity with the earlier test before extending to the deep rungs.',
  },
  {
    id: 'imp97679-honesty-gate-no-qed',
    holds: () =>
      IMP97679_VERDICT.laddersOverlapMultiRung === true &&
      IMP97679_VERDICT.magnitudeTracksRungByRung === true &&
      IMP97679_VERDICT.residualSingleSigned === true &&
      IMP97679_VERDICT.deltaSingleSigned === true &&
      IMP97679_VERDICT.signRelationshipIsStructural === true &&
      IMP97679_VERDICT.residualProportionalToDelta === false &&
      IMP97679_VERDICT.attributionCorroborated === true &&
      IMP97679_VERDICT.attributionFalsified === false &&
      IMP97679_VERDICT.mcmRefuted === true &&
      IMP97679_VERDICT.ceilingTouched === false &&
      IMP97679_VERDICT.anyBoundMoved === false &&
      IMP97679_VERDICT.qed === false &&
      /NO QED/.test(IMP97679_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97679_HONEST_BANNER) &&
      /RH open/.test(IMP97679_HONEST_BANNER),
    why: 'measurement only -- five-rung overlap, magnitude tracks the delta wiggle, sign anti-correlation structural, residual not proportional to delta; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97679_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97679-route-m-residual-delta-deep-overlap-correlation assertion failed: ${a.id}`);
  }
}

export default {
  residualLadder: IMP97679_RESIDUAL_LADDER,
  deltaLadder: IMP97679_DELTA_LADDER,
  overlap: IMP97679_OVERLAP,
  direction: IMP97679_DIRECTION,
  pearson: IMP97679_PEARSON,
  results: IMP97679_RESULTS,
  verdict: IMP97679_VERDICT,
  banner: IMP97679_HONEST_BANNER,
};
