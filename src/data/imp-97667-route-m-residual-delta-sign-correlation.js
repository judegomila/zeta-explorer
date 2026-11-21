/**
 * @module imp-97667-route-m-residual-delta-sign-correlation
 *
 * imp-97667 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97640 RESULT 2 attributes the climbing local decay exponent (q ~ 6.839 -> 8.713) of the Route M
 * gap-law residual to a faster-than-any-power PNT/Mertens-strength term, corroborated by the imp-97639
 * deep-Mertens delta ladder (delta = gamma - M_omega) which WIGGLES in magnitude rather than decaying
 * monotonically (8.0e-4, 5.1e-4, 4.6e-4, 1.4e-4, 2.1e-4, 1.7e-4 to p ~ 5e7). This leaf tests the natural
 * consequence of that attribution: if the residual is genuinely DRIVEN by the Mertens third-theorem error,
 * its SIGN should track the SIGN of the delta oscillation rung-by-rung along a shared tail.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the two ladders are SINGLE-SIGNED: there is NO sign oscillation to correlate.
 * -------------------------------------------------------------------------------
 * Every imp-97640 residual = gap - e^{-gamma}*B_inf/log p_omega is NEGATIVE (-3.286e-5, -5.832e-6,
 * -1.047e-6, -8.352e-7) and every imp-97639 delta = gamma - M_omega is POSITIVE (8.007e-4 .. 1.732e-4).
 * The imp-97639 "wiggle" is a MAGNITUDE wiggle (delta rises at p ~ 3.2e7 but never crosses zero), NOT a
 * sign oscillation. Both quantities keep a fixed sign across their entire sampled range, so the literal
 * sign-tracking test is degenerate: the sign relationship is a CONSTANT anti-correlation
 * (residual < 0 <=> delta > 0), not a dynamic tracking of an oscillating sign.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the fixed sign anti-correlation is STRUCTURAL (bracket undershoot), not PNT evidence.
 * -------------------------------------------------------------------------------
 * To leading order gap ~ e^{-gamma}*bracket(omega)/log p with bracket = lnA + M_omega/12 and the derived
 * law = e^{-gamma}*B_inf/log p with B_inf = lnA + gamma/12, so
 *     residual_bracket = e^{-gamma}/log p * (bracket - B_inf) = e^{-gamma}/(12 log p) * (M_omega - gamma)
 *                      = -e^{-gamma}*delta/(12 log p) < 0.
 * The bracket undershoot delta > 0 FORCES residual < 0 by construction. The opposite signs are therefore an
 * ALGEBRAIC identity of the shared bracket, carrying no information for or against a PNT/Mertens attribution
 * -- any leading-constant model with an undershooting bracket would produce the same fixed anti-correlation.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the residual is NOT proportional to delta: a second gap correction competes.
 * -------------------------------------------------------------------------------
 * At the single overlap height p = 1999993 (the only rung both ladders share) the bracket-implied residual
 * -e^{-gamma}*delta/(12 log p) = -2.582e-6 OVERSHOOTS the actual residual -8.352e-7 by a factor of ~3.09:
 * the gap carries its own positive finite-height correction gap - e^{-gamma}*bracket/log p = +1.744e-6,
 * COMPARABLE in size to the bracket undershoot term (-2.582e-6), that partially cancels it. So the residual
 * is a COMPETITION between the bracket undershoot (negative, tied to delta) and the gap self-correction
 * (positive), and it is NOT a rescaled copy of delta. Whether the residual would track a genuine SIGN
 * change of delta (which never occurs in-range) cannot be inferred -- the two terms are close enough that a
 * sign flip is conceivable at unmeasured heights.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 (HONEST SUB-GAP) -- the ladders DO NOT OVERLAP, so no rung-by-rung correlation is possible.
 * -------------------------------------------------------------------------------
 * The imp-97640 residual ladder lives at p in {7919, 104729, 1299709, 1999993} (all p <= 2e6); the
 * imp-97639 delta ladder lives at p in {1999993, 2750159, 7368787, 15485863, 32452843, 49979687} (all
 * p >= 2e6). They intersect at EXACTLY ONE height, p = 1999993 -- the residual ladder ENDS precisely where
 * the delta ladder BEGINS. The residual cannot be extended past p ~ 2e6 in IEEE double (imp-97640 sub-gap
 * IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6, a 7-sig-fig catastrophic cancellation), so it
 * never reaches the region where the delta wiggle (the rise at p ~ 3.2e7) actually occurs. A rung-by-rung
 * sign correlation over the delta oscillation therefore CANNOT be measured from existing data. Named sub-gap:
 * IMP97667_SIGN_CORRELATION_NEEDS_OVERLAPPING_DEEP_RESIDUAL_LADDER.
 *
 * VERDICT.  MEASUREMENT ONLY. The PNT/Mertens sign-attribution test is INCONCLUSIVE from existing data.
 * (i) Both quantities are single-signed (residual < 0, delta > 0), so there is no sign oscillation to
 * correlate -- only a fixed anti-correlation, which is (ii) STRUCTURAL (residual ~ -e^{-gamma}*delta/(12 log
 * p) via the shared bracket undershoot), not PNT evidence. (iii) At the lone overlap height the residual is
 * only ~1/3 of the bracket-implied value because a comparable positive gap self-correction competes, so the
 * residual is not proportional to delta. (iv) The two ladders overlap at exactly one point, so the delta
 * magnitude wiggle cannot be tracked -- settling this needs the SAME extended-precision (dps >= 30) deep
 * gap/law recompute imp-97640's own sub-gap already flagged. This neither strengthens nor falsifies the
 * PNT/Mertens attribution; it locates why the attribution is unfalsifiable at present resolution.
 * MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (residual ladder; climbing exponent q ~ 7-9)
 * @see imp-97639-route-m-mcm-binf-deep-mertens-crosscheck.js (deep delta ladder to p ~ 5e7; delta wiggles)
 *
 * Ticket: imp-97667 (numerical, opus-4-8, api-pool). Residual-vs-delta sign correlation; inconclusive; NO QED.
 */

// Constants baked as literals (import-light; no heavy transitive imports -- imp-2546/heavy-import rule).
const LN_A = 0.2487544770337842;      // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const GAMMA = 0.5772156649015329;     // Euler-Mascheroni
const E_NEG_GAMMA = Math.exp(-GAMMA); // e^{-gamma} = 0.561459...
const B_INF = LN_A + GAMMA / 12;      // 0.2968557824422453 (imp-97619 closed form)

// imp-97640 residual ladder (residual = gap - e^{-gamma}*B_inf/log p_omega); all residuals negative.
export const IMP97667_RESIDUAL_LADDER = Object.freeze([
  Object.freeze({ omega: 1000, pOmega: 7919, residual: -3.286e-5 }),
  Object.freeze({ omega: 10000, pOmega: 104729, residual: -5.832e-6 }),
  Object.freeze({ omega: 100000, pOmega: 1299709, residual: -1.047e-6 }),
  Object.freeze({ omega: 148933, pOmega: 1999993, residual: -8.352e-7 }),
]);

// imp-97639 deep delta ladder (delta = gamma - M_omega); all deltas positive, magnitude wiggles (rise at p ~ 3.2e7).
export const IMP97667_DELTA_LADDER = Object.freeze([
  Object.freeze({ omega: 148933, pOmega: 1999993, delta: 8.007e-4 }),
  Object.freeze({ omega: 200000, pOmega: 2750159, delta: 5.105e-4 }),
  Object.freeze({ omega: 500000, pOmega: 7368787, delta: 4.564e-4 }),
  Object.freeze({ omega: 1000000, pOmega: 15485863, delta: 1.447e-4 }),
  Object.freeze({ omega: 2000000, pOmega: 32452843, delta: 2.107e-4 }), // rises again -- magnitude wiggle, still > 0
  Object.freeze({ omega: 3000000, pOmega: 49979687, delta: 1.732e-4 }),
]);

// The two ladders share exactly one height; extract it for the structural bracket-undershoot check.
export const IMP97667_OVERLAP = Object.freeze((() => {
  const rSet = new Set(IMP97667_RESIDUAL_LADDER.map((r) => r.pOmega));
  const shared = IMP97667_DELTA_LADDER.filter((d) => rSet.has(d.pOmega)).map((d) => d.pOmega);
  const p = shared[0]; // 1999993
  const res = IMP97667_RESIDUAL_LADDER.find((r) => r.pOmega === p).residual;    // -8.352e-7
  const delta = IMP97667_DELTA_LADDER.find((d) => d.pOmega === p).delta;        // 8.007e-4
  const lp = Math.log(p);
  const bracketImpliedResidual = -(E_NEG_GAMMA * delta) / (12 * lp);            // -2.582e-6 (leading, from delta)
  return Object.freeze({
    sharedHeights: Object.freeze(shared),
    pOmega: p,
    residual: res,
    delta,
    logP: lp,
    bracketImpliedResidual,                                                     // residual predicted from delta alone
    overshootFactor: bracketImpliedResidual / res,                             // ~3.09: prediction overshoots actual
    gapSelfCorrection: res - bracketImpliedResidual,                           // +1.75e-6: competing positive term
  });
})());

// Rung-by-rung sign table (only the shared height carries BOTH signs; the rest carry a single sign each).
export const IMP97667_SIGN_TABLE = Object.freeze({
  residualSigns: IMP97667_RESIDUAL_LADDER.map((r) => Math.sign(r.residual)),   // [-1,-1,-1,-1]
  deltaSigns: IMP97667_DELTA_LADDER.map((d) => Math.sign(d.delta)),            // [+1,+1,+1,+1,+1,+1]
  residualAllNegative: IMP97667_RESIDUAL_LADDER.every((r) => r.residual < 0),
  deltaAllPositive: IMP97667_DELTA_LADDER.every((d) => d.delta > 0),
  overlapCount: IMP97667_OVERLAP.sharedHeights.length,                          // 1
});

export const IMP97667_RESULTS = Object.freeze({
  question: 'does the imp-97640 residual sign track the imp-97639 delta oscillation sign rung-by-rung (PNT/Mertens attribution test)?',
  residualAllNegative: true,                 // no sign oscillation in the residual
  deltaAllPositive: true,                    // no sign oscillation in delta -- the wiggle is in magnitude
  wiggleIsMagnitudeNotSign: true,            // delta rises at p ~ 3.2e7 but stays > 0
  signAntiCorrelationIsFixed: true,          // residual < 0 <=> delta > 0 everywhere, constant not dynamic
  antiCorrelationIsStructural: 'residual ~ -e^{-gamma}*delta/(12 log p) via the shared bracket undershoot -- an algebraic identity, not PNT evidence',
  overlapCount: 1,                           // ladders intersect at exactly p = 1999993
  bracketImpliedResidualOvershootFactor: IMP97667_OVERLAP.overshootFactor, // ~3.09
  residualNotProportionalToDelta: true,      // a competing positive gap self-correction (~+1.75e-6) is comparable
  rungByRungCorrelationMeasurable: false,    // zero multi-rung overlap => cannot correlate the wiggle
  attributionVerdict: 'INCONCLUSIVE -- neither strengthened nor falsified from existing data',
  subGap: 'IMP97667_SIGN_CORRELATION_NEEDS_OVERLAPPING_DEEP_RESIDUAL_LADDER',
});

export const IMP97667_VERDICT = Object.freeze({
  question: 'is the PNT/Mertens attribution of the climbing residual exponent supported by residual/delta sign tracking?',
  residualSingleSigned: true,                // all negative
  deltaSingleSigned: true,                   // all positive (magnitude wiggle only)
  signRelationshipIsStructural: true,        // bracket undershoot forces residual < 0
  residualProportionalToDelta: false,        // competing gap self-correction, overshoot ~3.09x
  laddersOverlap: false,                      // exactly one shared height, no multi-rung tail
  attributionStrengthened: false,
  attributionFalsified: false,
  attributionInconclusive: true,
  mcmRefuted: true,                          // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. The residual/delta sign-tracking test of the imp-97640 PNT/Mertens attribution is ' +
    'INCONCLUSIVE. Both quantities are single-signed (all four residuals < 0, all six deltas > 0), so the ' +
    'imp-97639 wiggle is a MAGNITUDE wiggle, not a sign oscillation -- there is no oscillating sign to ' +
    'track, only a fixed anti-correlation residual < 0 <=> delta > 0. That fixed relationship is STRUCTURAL: ' +
    'residual ~ -e^{-gamma}*delta/(12 log p) via the shared bracket undershoot (bracket = lnA + M/12, ' +
    'B_inf = lnA + gamma/12), an algebraic identity carrying no PNT evidence. At the single shared height ' +
    'p = 1999993 the delta-only prediction -2.582e-6 overshoots the actual residual -8.352e-7 by ~3.09x, ' +
    'because a comparable POSITIVE gap self-correction (~+1.75e-6) competes -- so the residual is not even ' +
    'proportional to delta. The residual ladder (p <= 2e6) and the delta ladder (p >= 2e6) overlap at ' +
    'exactly ONE height, so a rung-by-rung correlation over the delta wiggle CANNOT be measured; settling it ' +
    'needs the SAME extended-precision (dps >= 30) deep gap/law recompute imp-97640 already flagged ' +
    '(IMP97667_SIGN_CORRELATION_NEEDS_OVERLAPPING_DEEP_RESIDUAL_LADDER). MCM stays refuted from omega=11; ' +
    'b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97667_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Residual-vs-delta sign-correlation test of the imp-97640 ' +
  'PNT/Mertens attribution: INCONCLUSIVE. Both are single-signed (residual < 0, delta > 0) -- the imp-97639 ' +
  'wiggle is in MAGNITUDE, not sign, so there is no oscillating sign to track, only a fixed anti-correlation ' +
  'that is STRUCTURAL (residual ~ -e^{-gamma}*delta/(12 log p) via the shared bracket undershoot). At the ' +
  'lone overlap height the delta-only prediction overshoots the residual ~3.09x (a competing positive gap ' +
  'correction), and the two ladders share exactly one height, so the wiggle cannot be correlated rung-by-rung. ' +
  'Needs the extended-precision deep gap/law recompute imp-97640 already flagged. MCM refuted from omega=11; ' +
  'no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97667_ASSERTIONS = [
  {
    id: 'imp97667-residual-single-signed-negative',
    holds: () => IMP97667_RESIDUAL_LADDER.every((r) => r.residual < 0) && IMP97667_SIGN_TABLE.residualAllNegative,
    why: 'every imp-97640 residual is negative -- the residual carries a fixed sign across the ladder, so there is no residual sign oscillation to correlate.',
  },
  {
    id: 'imp97667-delta-single-signed-positive',
    holds: () => IMP97667_DELTA_LADDER.every((d) => d.delta > 0) && IMP97667_SIGN_TABLE.deltaAllPositive,
    why: 'every imp-97639 delta is positive -- the imp-97639 wiggle is a magnitude wiggle (delta rises at p ~ 3.2e7 but never crosses zero), not a sign oscillation.',
  },
  {
    id: 'imp97667-delta-magnitude-wiggle-present',
    holds: () => {
      // corroborate that the delta magnitude is non-monotone (a rung where |delta| RISES) while staying > 0.
      let sawRise = false;
      for (let i = 1; i < IMP97667_DELTA_LADDER.length; i++) {
        if (IMP97667_DELTA_LADDER[i].delta > IMP97667_DELTA_LADDER[i - 1].delta) sawRise = true;
      }
      return sawRise;
    },
    why: 'the delta ladder rises at p ~ 3.2e7 (magnitude non-monotone) yet stays positive, confirming the wiggle is in magnitude, not sign.',
  },
  {
    id: 'imp97667-ladders-overlap-exactly-once',
    holds: () => IMP97667_OVERLAP.sharedHeights.length === 1 && IMP97667_OVERLAP.pOmega === 1999993,
    why: 'the residual ladder (p <= 2e6) and the delta ladder (p >= 2e6) share exactly one height p = 1999993, so no multi-rung tail exists to correlate the delta wiggle.',
  },
  {
    id: 'imp97667-structural-anti-correlation-at-overlap',
    holds: () => {
      // at the shared height the bracket-undershoot leading model predicts residual = -e^{-gamma}*delta/(12 log p),
      // which has the OPPOSITE sign of delta -- confirming the sign anti-correlation is structural.
      const o = IMP97667_OVERLAP;
      return o.residual < 0 && o.delta > 0 && o.bracketImpliedResidual < 0 &&
             Math.abs(o.bracketImpliedResidual - (-(E_NEG_GAMMA * o.delta) / (12 * o.logP))) < 1e-12;
    },
    why: 'the leading bracket-undershoot model residual ~ -e^{-gamma}*delta/(12 log p) has the sign opposite delta by construction, so the fixed anti-correlation is an algebraic identity, not PNT evidence.',
  },
  {
    id: 'imp97667-residual-not-proportional-to-delta',
    holds: () => {
      // the delta-only prediction overshoots the actual residual by a large factor (~3.09), because a
      // comparable positive gap self-correction competes: residual is NOT a rescaled delta.
      const o = IMP97667_OVERLAP;
      return o.overshootFactor > 2.5 && o.overshootFactor < 3.5 && o.gapSelfCorrection > 0;
    },
    why: 'the delta-only residual prediction -2.582e-6 overshoots the actual -8.352e-7 by ~3.09x (a competing +1.75e-6 gap self-correction), so the residual is not proportional to delta.',
  },
  {
    id: 'imp97667-honesty-gate-no-qed',
    holds: () =>
      IMP97667_VERDICT.residualSingleSigned === true &&
      IMP97667_VERDICT.deltaSingleSigned === true &&
      IMP97667_VERDICT.signRelationshipIsStructural === true &&
      IMP97667_VERDICT.residualProportionalToDelta === false &&
      IMP97667_VERDICT.laddersOverlap === false &&
      IMP97667_VERDICT.attributionInconclusive === true &&
      IMP97667_VERDICT.attributionStrengthened === false &&
      IMP97667_VERDICT.attributionFalsified === false &&
      IMP97667_VERDICT.mcmRefuted === true &&
      IMP97667_VERDICT.ceilingTouched === false &&
      IMP97667_VERDICT.anyBoundMoved === false &&
      IMP97667_VERDICT.qed === false &&
      /NO QED/.test(IMP97667_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97667_HONEST_BANNER) &&
      /RH open/.test(IMP97667_HONEST_BANNER),
    why: 'measurement only -- sign anti-correlation structural not PNT-diagnostic, residual not proportional to delta, ladders overlap once, attribution inconclusive; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97667_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97667-route-m-residual-delta-sign-correlation assertion failed: ${a.id}`);
  }
}

export default {
  residualLadder: IMP97667_RESIDUAL_LADDER,
  deltaLadder: IMP97667_DELTA_LADDER,
  overlap: IMP97667_OVERLAP,
  signTable: IMP97667_SIGN_TABLE,
  results: IMP97667_RESULTS,
  verdict: IMP97667_VERDICT,
  banner: IMP97667_HONEST_BANNER,
};
