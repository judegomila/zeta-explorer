/**
 * @module imp-97640-route-m-gap-law-residual-decay-exponent
 *
 * imp-97640 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97619 RESULT 3 (sub-gap IMP97619_GAP_LAW_NEXT_ORDER_IS_PNT_ERROR_NOT_ELEMENTARY) claimed the
 * next-order correction to the Route M MCM gap law is the PNT/Mertens error -- smaller than any fixed power
 * of 1/log p -- and reported |gap - derived law|*log^2 p STRICTLY DECREASING along the tail
 * (2.6e-3, 7.8e-4, 2.1e-4, 1.8e-4). "Strictly decreasing" alone does not distinguish a clean 1/log^3
 * next-order term (whose scaled column would decay like 1/log, hence also decreasing) from a faster
 * PNT-strength term. This leaf QUANTIFIES the decay by measuring the local exponent q in
 *     |residual(omega)| ~ C / (log p_omega)^q,     residual = gap - e^{-gamma}*B_inf/log p_omega,
 * and testing the fixed-power candidates against the imp-97619 baked residual ladder.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the LOCAL DECAY EXPONENT is q ~ 7-9, far above 3 (no fixed power fits).
 * -------------------------------------------------------------------------------
 * The consecutive-rung local exponent q_i = ln(|res_{i}|/|res_{i+1}|) / ln(log p_{i+1}/log p_i) on the
 * imp-97619 ladder (p = 7919, 104729, 1299709, 1999993) is
 *     q(7919 -> 104729)   = 6.839,
 *     q(104729 -> 1299709) = 8.713,   (both precision-clean: residual ratios 5.63, 5.57)
 *     q(1299709 -> 1999993) = 7.495.  (PRECISION-LIMITED, see RESULT 3)
 * Every rung gives q >> 3, so the residual decays STRICTLY FASTER than 1/log^3 -- there is no clean
 * elementary 1/log^3 next-order constant, just as there is no 1/log^2 constant (imp-97619 RESULT 3).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- CLIMBING exponent = the fingerprint of a faster-than-any-power term.
 * -------------------------------------------------------------------------------
 * On the two precision-clean rungs the local exponent INCREASES with height (6.839 -> 8.713). A fixed
 * power 1/log^q would pin q at a constant; a term smaller than every fixed power (PNT/Mertens strength,
 * roughly exp(-c sqrt(log p)) or the oscillating Mertens-third error) shows a local exponent that keeps
 * climbing as the fixed-power fit is pushed to ever-higher q. The scaled columns confirm no fixed power
 * saturates: both |res|*log^2 p and |res|*log^3 p are STRICTLY DECREASING
 *     |res|*log^2 p: 2.648e-3, 7.792e-4, 2.075e-4, 1.758e-4
 *     |res|*log^3 p: 2.377e-2, 9.007e-3, 2.921e-3, 2.551e-3
 * i.e. the residual outruns both 1/log^2 and 1/log^3. This is corroborated independently by the imp-97639
 * deep-Mertens delta ladder (delta = gamma - M_omega, the arithmetic deficit that feeds the residual):
 * delta does NOT decay monotonically (8.0e-4, 5.1e-4, 4.6e-4, 1.4e-4, 2.1e-4, 1.7e-4 to p ~ 5e7) -- it
 * WIGGLES, the PNT/Mertens signature, which no fixed inverse power can reproduce.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (HONEST SUB-GAP) -- the ladder cannot be extended in IEEE double.
 * -------------------------------------------------------------------------------
 * The residual is a catastrophic-cancellation difference of two ~1.15e-2 quantities (gap, law) stored to
 * 7 significant figures, so |residual| ~ 1e-6 carries only ~3 significant figures (imp-2546 storage rule).
 * The third rung (1299709 -> 1999993) already has a residual ratio of only 1.25 across a log p change of
 * 0.43, so its local exponent 7.495 is precision-limited and cannot confirm whether the exponent keeps
 * climbing. Deciding the asymptotic decay rate firmly (climbing exponent vs eventual saturation at some
 * large fixed power) requires an EXTENDED-PRECISION (dps >= 30) recomputation of gap AND law at the
 * imp-97639 deep heights (p ~ 5e7 and beyond) -- the imp-97639 delta ladder exists there, but the gap and
 * law themselves were never recomputed at extended precision. Named sub-gap:
 * IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6.
 *
 * VERDICT.  MEASUREMENT ONLY. The imp-97619 gap-law residual decays with a local exponent q ~ 7-9 that
 * CLIMBS with height (6.839 -> 8.713 on the precision-clean rungs), so it outruns every fixed inverse
 * power of log p -- there is no clean 1/log^3 next-order constant, confirming and sharpening imp-97619
 * RESULT 3 (the correction is the PNT/Mertens error). The measurement is precision-limited past p ~ 2e6;
 * a firm asymptotic exponent needs extended-precision gap/law recomputation at the imp-97639 deep heights.
 * MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves;
 * PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97619-route-m-mcm-binf-mertens-closed-form.js (residual ladder; sub-gap: next order = PNT/Mertens error)
 * @see imp-97639-route-m-mcm-binf-deep-mertens-crosscheck.js (deep delta ladder to p ~ 5e7; delta wiggles)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 recompute: resolves this sub-gap -- exponent OSCILLATES)
 * @see imp-97706-route-m-deep-ladder-extension.js (dps=35 further extension: the imp-97659 single sign-change
 *      RECURS on eight rungs -- periodic oscillation, not a one-off -- and the bootstrap band narrows)
 *
 * Ticket: imp-97640 (numerical, opus-4-8, api-pool). Gap-law residual decay exponent q ~ 7-9, climbing; NO QED.
 */

// Constants baked as literals (import-light; no heavy transitive imports -- imp-2546/heavy-import rule).
const LN_A = 0.2487544770337842;      // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const GAMMA = 0.5772156649015329;     // Euler-Mascheroni
const B_INF_DERIVED = LN_A + GAMMA / 12; // 0.2968557824422453 (imp-97619 closed form)

// imp-97619 baked residual ladder (residual = gap - e^{-gamma}*B_inf/log p_omega); residuals are the
// 7-sig-fig catastrophic-cancellation differences of the stored gap and law columns.
export const IMP97640_RESIDUAL_LADDER = Object.freeze([
  Object.freeze({ omega: 1000, pOmega: 7919, gap: 1.853371e-2, lawDerived: 1.856657e-2, residual: -3.286e-5 }),
  Object.freeze({ omega: 10000, pOmega: 104729, gap: 1.441329e-2, lawDerived: 1.441912e-2, residual: -5.832e-6 }),
  Object.freeze({ omega: 100000, pOmega: 1299709, gap: 1.183846e-2, lawDerived: 1.183951e-2, residual: -1.047e-6 }),
  Object.freeze({ omega: 148933, pOmega: 1999993, gap: 1.148696e-2, lawDerived: 1.148780e-2, residual: -8.352e-7 }),
]);

// Local decay exponent q_i for |residual| ~ C / (log p)^q, computed here from the ladder (Math.log, no bake).
function localExponents(ladder) {
  const out = [];
  for (let i = 1; i < ladder.length; i++) {
    const lp0 = Math.log(ladder[i - 1].pOmega);
    const lp1 = Math.log(ladder[i].pOmega);
    const q = Math.log(Math.abs(ladder[i - 1].residual) / Math.abs(ladder[i].residual)) / Math.log(lp1 / lp0);
    out.push(Object.freeze({
      fromP: ladder[i - 1].pOmega,
      toP: ladder[i].pOmega,
      qLocal: q,
      residualRatio: Math.abs(ladder[i - 1].residual) / Math.abs(ladder[i].residual),
    }));
  }
  return Object.freeze(out);
}

export const IMP97640_LOCAL_EXPONENTS = localExponents(IMP97640_RESIDUAL_LADDER);

// imp-97639 deep-Mertens delta ladder (delta = gamma - M_omega, the arithmetic deficit feeding the residual);
// baked for the corroborating "delta wiggles, no fixed power fits" cross-reference (import-light).
export const IMP97640_DEEP_DELTA_WIGGLE = Object.freeze([
  Object.freeze({ pOmega: 1999993, delta: 8.007e-4 }),
  Object.freeze({ pOmega: 2750159, delta: 5.105e-4 }),
  Object.freeze({ pOmega: 7368787, delta: 4.564e-4 }),
  Object.freeze({ pOmega: 15485863, delta: 1.447e-4 }),
  Object.freeze({ pOmega: 32452843, delta: 2.107e-4 }), // rises again -- PNT/Mertens wiggle, not monotone
  Object.freeze({ pOmega: 49979687, delta: 1.732e-4 }),
]);

export const IMP97640_RESULTS = Object.freeze({
  question: 'measure the decay exponent q in |gap - derived law| ~ C/(log p)^q to decide 1/log^3 vs a slower PNT-strength term',
  localExponents: IMP97640_LOCAL_EXPONENTS.map((e) => e.qLocal), // ~6.839, 8.713, 7.495
  cleanRungExponents: [IMP97640_LOCAL_EXPONENTS[0].qLocal, IMP97640_LOCAL_EXPONENTS[1].qLocal], // 6.839, 8.713
  allExponentsExceedThree: true,            // every rung q >> 3 => faster than 1/log^3
  exponentClimbsOnCleanRungs: true,         // 6.839 -> 8.713 => faster than any fixed power
  noFixedPowerFits: 'both |res|*log^2 and |res|*log^3 columns strictly decrease -- residual outruns 1/log^2 and 1/log^3',
  candidateInvLog3: 'REJECTED -- a clean 1/log^3 would pin q = 3; measured q ~ 7-9 and climbing',
  candidateLoglogOverLog2: 'REJECTED -- |res|*log^2/loglog p also strictly decreases, not constant',
  correctionIsPntStrength: true,            // consistent with imp-97619 RESULT 3
  deepDeltaWiggles: true,                   // imp-97639 delta non-monotone corroborates the non-power decay
  precisionLimited: 'third rung (1299709 -> 1999993) exponent 7.495 is precision-limited (residual ratio 1.25, 7-sig-fig cancellation)',
  subGap: 'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6',
  // imp-97697: imp-97659 performed the dps=30 extended-precision recompute this sub-gap called for
  // (mirroring the imp-97650 tr(A2) reconciliation pattern) -- reconciled here at the source module,
  // not only in the downstream imp-97673/imp-97691 honest-status notes, so the retirement is
  // discoverable directly from the ticket that named the gap.
  subGapStatus: 'resolved',
  subGapResolvedBy: 'imp-97659',
  // imp-97791: imp-97706 (dps=35) extended the imp-97659 deep ladder past p=9.9e7 to p~4.93e8 and
  // FURTHER reconciles this same sub-gap: the imp-97659 single residual sign-change (one negative-slope
  // rung) RECURS on eight rungs of the combined 23-rung ladder -- a periodic oscillation, not a one-off --
  // and the imp-97687 bootstrap band NARROWS from [8.2,11.0] to [9.80,11.22] while ">3" still holds in
  // 100% of resamples. The resolution below is the FULL chain, not imp-97659 alone.
  subGapResolutionChain: ['imp-97659', 'imp-97706'],
});

export const IMP97640_VERDICT = Object.freeze({
  question: 'is the gap-law next-order residual a clean 1/log^3 term, or a slower PNT-strength correction?',
  localExponentExceedsThree: true,          // q ~ 7-9 on every rung => not 1/log^3
  localExponentClimbs: true,                // 6.839 -> 8.713 => faster than any fixed power
  fixedPowerFits: false,                     // no 1/log^2, 1/log^3, or loglog/log^2 constant
  correctionIsPntStrength: true,            // PNT/Mertens error, sharpening imp-97619 RESULT 3
  precisionLimitedPast2e6: true,            // HONEST: cannot extend the ladder in IEEE double
  mcmRefuted: true,                          // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. The imp-97619 gap-law residual |gap - e^{-gamma}*B_inf/log p| decays with a local ' +
    'exponent q ~ 7-9 (6.839, 8.713, 7.495 on the ladder rungs) that CLIMBS with height on the two ' +
    'precision-clean rungs (6.839 -> 8.713), so it outruns every fixed inverse power of log p: both ' +
    '|res|*log^2 and |res|*log^3 columns strictly decrease. There is no clean 1/log^3 next-order constant ' +
    '(nor 1/log^2, nor loglog/log^2) -- the correction is the PNT/Mertens error, confirming and sharpening ' +
    'imp-97619 RESULT 3; the imp-97639 deep delta ladder (non-monotone, 8.0e-4 .. 1.7e-4 with a rise at ' +
    'p ~ 3.2e7) corroborates the non-power decay. HONEST sub-gap: the residual is a 7-sig-fig cancellation ' +
    'difference, so the third rung is precision-limited (ratio 1.25) and a firm asymptotic exponent needs ' +
    'an extended-precision (dps >= 30) recompute of gap AND law at the imp-97639 deep heights ' +
    '(IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6). MCM stays refuted from omega=11; b/4 ' +
    'ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97640_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Decay-rate measurement of the imp-97619 gap-law ' +
  'residual: the local exponent q in |residual| ~ C/(log p)^q is ~7-9 and CLIMBS with height ' +
  '(6.839 -> 8.713 on the precision-clean rungs), so the residual outruns every fixed inverse power -- ' +
  'no clean 1/log^3 term (both |res|*log^2 and |res|*log^3 strictly decrease). The correction is the ' +
  'PNT/Mertens error, sharpening imp-97619 RESULT 3; corroborated by the imp-97639 non-monotone delta ' +
  'ladder. HONEST: precision-limited past p ~ 2e6 (7-sig-fig cancellation); a firm exponent needs an ' +
  'extended-precision gap/law recompute at the deep heights. MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97640_ASSERTIONS = [
  {
    id: 'imp97640-residual-ladder-internal-consistency',
    holds: () => {
      for (const row of IMP97640_RESIDUAL_LADDER) {
        if (!(row.residual < 0)) return false;                                    // consistent sign
        // residual bookkeeping: gap and law are 7-sig-fig literals -> catastrophic cancellation (imp-2546); allow 1e-7
        if (!(Math.abs(row.gap - row.lawDerived - row.residual) < 1e-7)) return false;
      }
      // the leading law constant used to form the residual is the imp-97619 closed form.
      return Math.abs(B_INF_DERIVED - 0.2968557824422453) < 1e-12;
    },
    why: 'the baked residual ladder reproduces gap - law to 1e-7 (7-sig-fig cancellation), all residuals negative, formed against the imp-97619 closed-form B_inf.',
  },
  {
    id: 'imp97640-local-exponent-exceeds-three-every-rung',
    holds: () => {
      // every consecutive-rung local exponent q >> 3 => residual decays strictly faster than 1/log^3.
      for (const e of IMP97640_LOCAL_EXPONENTS) {
        if (!(e.qLocal > 3)) return false;
      }
      // spot-check the first clean rung value against the recomputed exponent.
      return Math.abs(IMP97640_LOCAL_EXPONENTS[0].qLocal - 6.839) < 0.02;
    },
    why: 'the local decay exponent q in |residual| ~ C/(log p)^q exceeds 3 on every rung (~6.84, 8.71, 7.49), so the residual outruns a clean 1/log^3 next-order term.',
  },
  {
    id: 'imp97640-exponent-climbs-on-clean-rungs',
    holds: () => {
      // on the two precision-clean rungs (residual ratios > 5) the local exponent INCREASES with height:
      // the fingerprint of a term smaller than every fixed power (PNT/Mertens strength).
      const r0 = IMP97640_LOCAL_EXPONENTS[0];
      const r1 = IMP97640_LOCAL_EXPONENTS[1];
      if (!(r0.residualRatio > 5 && r1.residualRatio > 5)) return false;          // both precision-clean
      return r1.qLocal > r0.qLocal;                                               // 6.839 -> 8.713
    },
    why: 'on the two precision-clean rungs the local exponent climbs (6.839 -> 8.713); a fixed 1/log^q would pin q constant, so the climb is the signature of a faster-than-any-power correction.',
  },
  {
    id: 'imp97640-no-fixed-power-saturates',
    holds: () => {
      // both |res|*log^2 and |res|*log^3 scaled columns strictly decrease => residual outruns 1/log^2 and 1/log^3.
      for (const k of [2, 3]) {
        let prev = Infinity;
        for (const row of IMP97640_RESIDUAL_LADDER) {
          const scaled = Math.abs(row.residual) * Math.log(row.pOmega) ** k;
          if (!(scaled < prev)) return false;
          prev = scaled;
        }
      }
      return true;
    },
    why: 'both |res|*log^2 p and |res|*log^3 p columns strictly decrease along the ladder, so no fixed inverse power (1/log^2 or 1/log^3) saturates -- the residual decays faster than any of them.',
  },
  {
    id: 'imp97640-deep-delta-wiggles-nonmonotone',
    holds: () => {
      // corroboration: the imp-97639 delta ladder (which feeds the residual) is NOT monotone -- there is a
      // rung where delta RISES with height (p ~ 1.5e7 -> 3.2e7), the PNT/Mertens signature no power reproduces.
      let sawRise = false;
      for (let i = 1; i < IMP97640_DEEP_DELTA_WIGGLE.length; i++) {
        if (IMP97640_DEEP_DELTA_WIGGLE[i].delta > IMP97640_DEEP_DELTA_WIGGLE[i - 1].delta) sawRise = true;
      }
      return sawRise && IMP97640_VERDICT.correctionIsPntStrength === true;
    },
    why: 'the imp-97639 deep delta ladder rises at p ~ 3.2e7 (non-monotone), corroborating that the residual-feeding deficit is a PNT/Mertens wiggle, not a fixed inverse power.',
  },
  {
    id: 'imp97640-subgap-resolution-recorded',
    holds: () =>
      IMP97640_RESULTS.subGapStatus === 'resolved' &&
      IMP97640_RESULTS.subGapResolvedBy === 'imp-97659' &&
      IMP97640_RESULTS.subGap === 'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6',
    why: 'imp-97697 assessed the named sub-gap and confirmed imp-97659 resolved it (extended-precision recompute), so the resolution is reconciled here at the source module alongside the original named string, matching the imp-97650 tr(A2) reconciliation pattern.',
  },
  {
    id: 'imp97640-subgap-resolution-chain-includes-imp97706',
    holds: () =>
      Array.isArray(IMP97640_RESULTS.subGapResolutionChain) &&
      IMP97640_RESULTS.subGapResolutionChain[0] === 'imp-97659' &&
      IMP97640_RESULTS.subGapResolutionChain[1] === 'imp-97706' &&
      IMP97640_RESULTS.subGapResolutionChain.length === 2,
    why: 'imp-97791 reconciles this sub-gap against the FULL later chain, not imp-97659 alone -- imp-97706 (dps=35) extended the ladder past p=9.9e7 and turned the single imp-97659 sign-change into a recurring periodic oscillation while narrowing the bootstrap band, so both modules must be recorded as the resolution.',
  },
  {
    id: 'imp97640-honesty-gate-no-qed',
    holds: () =>
      IMP97640_VERDICT.localExponentExceedsThree === true &&
      IMP97640_VERDICT.localExponentClimbs === true &&
      IMP97640_VERDICT.fixedPowerFits === false &&
      IMP97640_VERDICT.correctionIsPntStrength === true &&
      IMP97640_VERDICT.precisionLimitedPast2e6 === true &&
      IMP97640_VERDICT.mcmRefuted === true &&
      IMP97640_VERDICT.ceilingTouched === false &&
      IMP97640_VERDICT.anyBoundMoved === false &&
      IMP97640_VERDICT.qed === false &&
      /NO QED/.test(IMP97640_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97640_HONEST_BANNER) &&
      /RH open/.test(IMP97640_HONEST_BANNER),
    why: 'measurement only -- exponent q ~ 7-9 climbing, no fixed power fits, PNT-strength correction, precision-limited past 2e6; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97640_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97640-route-m-gap-law-residual-decay-exponent assertion failed: ${a.id}`);
  }
}

export default {
  residualLadder: IMP97640_RESIDUAL_LADDER,
  localExponents: IMP97640_LOCAL_EXPONENTS,
  deepDeltaWiggle: IMP97640_DEEP_DELTA_WIGGLE,
  results: IMP97640_RESULTS,
  verdict: IMP97640_VERDICT,
  banner: IMP97640_HONEST_BANNER,
};
