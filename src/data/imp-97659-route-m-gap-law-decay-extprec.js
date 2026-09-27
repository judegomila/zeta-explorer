/**
 * @module imp-97659-route-m-gap-law-decay-extprec
 *
 * imp-97659 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97640 measured the local decay exponent q of the Route M MCM gap-law residual
 *     residual(omega) = gap(omega) - e^{-gamma}*B_inf/log p_omega
 * as ~6.839 -> 8.713 (CLIMBING) on two precision-clean rungs, but flagged (sub-gap
 * IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6) that the third rung was IEEE-double
 * precision-limited: gap and law were baked to 7 sig figs, and residual is a catastrophic-cancellation
 * difference of two ~1.15e-2 quantities, so |residual| ~ 1e-6 carried only ~3 sig figs. Deciding whether
 * q keeps CLIMBING (a faster-than-any-power PNT/Mertens term) or SATURATES at a large fixed power required
 * an EXTENDED-PRECISION recompute of gap AND law at the imp-97639 deep heights (p ~ 5e7 and beyond).
 *
 * This leaf performs exactly that recompute (tmp/imp-97659-extprec-gap-law-decay.py, mpmath dps=30,
 * live sieve to p = 1e8, omega up to 5.7e6): Pi_omega = prod(1 - 1/p_i), Sigma_omega = sum log p_i/(p_i-1),
 * S = Pi_omega*(lnA - Sigma_omega/12), gap = S + e^{-gamma}/12, law = e^{-gamma}*B_inf/log p_omega with
 * B_inf = lnA + gamma/12. At dps=30 the residual keeps ~24 sig figs, so the ladder is precision-clean.
 *
 * -------------------------------------------------------------------------------
 * RESULT 0 -- the extended-precision recompute REPRODUCES the imp-97640 anchor rung.
 * -------------------------------------------------------------------------------
 * At omega = 148933 (p = 1999993) the dps=30 residual is -8.351691933e-7, matching the imp-97640 baked
 * 7-sig-fig literal -8.352e-7 to its stored precision -- the formula and the deep sieve are validated
 * against the shallow ladder before extrapolating.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the DECISION: the local exponent OSCILLATES; it neither climbs nor saturates.
 * -------------------------------------------------------------------------------
 * Across the precision-clean deep ladder (11 rungs, p = 2e6 .. 9.9e7) the consecutive-rung local exponent
 * q in |residual| ~ C/(log p)^q swings WILDLY: q_local ranges from -6.738 to +28.721, and one rung
 * (p = 2.39e7 -> 3.25e7) is NEGATIVE -- there the residual magnitude RISES with height
 * (|res| 1.369e-7 -> 1.544e-7). A single faster-than-any-power term would give a q that climbs
 * monotonically; a fixed power 1/log^q would pin q at a constant. The measured q does NEITHER -- it
 * oscillates, including a sign change. So the imp-97640 "6.839 -> 8.713 climbing" reading was a
 * two-rung sparse-ladder artifact; the true behaviour is an OSCILLATION, the definitive fingerprint of
 * the oscillating PNT/Mertens error, which no fixed inverse power (and no single monotone envelope) fits.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the average trend still outruns every fixed power <= 3.
 * -------------------------------------------------------------------------------
 * A log-log regression of |residual| against log(log p) over the full deep ladder gives an AVERAGE decay
 * exponent of ~10.18, far above 3: on average the residual outruns 1/log^3 by a wide margin, consistent
 * with imp-97640 RESULT 1 (q >> 3) and imp-97619 RESULT 3 (no elementary 1/log^2 term). The excess of the
 * average exponent over any fixed power, together with the pointwise oscillation of RESULT 1, is the
 * PNT/Mertens signature.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the "strictly decreasing scaled columns" claim is CORRECTED at depth.
 * -------------------------------------------------------------------------------
 * imp-97619/imp-97640 reported |res|*log^2 p and |res|*log^3 p STRICTLY DECREASING on the shallow ladder.
 * At the deep heights, precision-clean, both scaled columns are NON-MONOTONE: they RISE at the same rung
 * where the residual rises (p = 2.39e7 -> 3.25e7). The strict decrease was true only up to p ~ 2e7; the
 * oscillating PNT/Mertens error breaks it deeper. (This does not resurrect any fixed power: a fixed 1/log^k
 * would give a scaled column that is constant/monotone in k, not oscillating.)
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. The extended-precision (dps=30) recompute of gap AND law at the imp-97639
 * deep heights RESOLVES the imp-97640 sub-gap: the residual decay exponent NEITHER keeps climbing NOR
 * saturates at a fixed power -- it OSCILLATES (q_local from -6.738 to +28.721, one negative rung where the
 * residual rises with height), the oscillating-PNT/Mertens-error fingerprint. The average exponent ~10.18
 * still outruns every fixed power <= 3. The imp-97640 "climbing" reading and the imp-97619 "strictly
 * decreasing scaled columns" claim were shallow-ladder artifacts (the scaled columns are non-monotone at
 * depth). MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on
 * Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (shallow ladder; sub-gap PRECISION_LIMITED_PAST_2E6)
 * @see imp-97619-route-m-mcm-binf-mertens-closed-form.js (B_inf = lnA + gamma/12; next order = PNT/Mertens error)
 * @see imp-97639-route-m-mcm-binf-deep-mertens-crosscheck.js (deep delta ladder to p ~ 5e7; delta wiggles)
 *
 * Ticket: imp-97659 (numerical, opus-4-8, api-pool). Deep dps=30 gap/law: exponent OSCILLATES, not climb/saturate; NO QED.
 */

// Constants baked as literals (import-light; no heavy transitive imports -- imp-2546/heavy-import rule).
const LN_A = 0.2487544770337842;      // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1) = log(glaisher)
const GAMMA = 0.5772156649015329;     // Euler-Mascheroni
const B_INF_DERIVED = LN_A + GAMMA / 12; // 0.2968557824422453 (imp-97619 closed form)

// Extended-precision (mpmath dps=30) deep gap/law/residual ladder from tmp/imp-97659-extprec-gap-law-decay.py.
// residual = gap - e^{-gamma}*B_inf/log p_omega, carried at ~24 sig figs then rounded to ~10 here (now
// legitimately precise, unlike the imp-97640 7-sig-fig catastrophic-cancellation literals).
export const IMP97659_DEEP_LADDER = Object.freeze([
  Object.freeze({ omega: 148933, pOmega: 1999993, gap: 1.14869631865e-2, law: 1.14877983556e-2, residual: -8.351691933e-7 }),
  Object.freeze({ omega: 300000, pOmega: 4256233, gap: 1.09188976866e-2, law: 1.091939467e-2, residual: -4.969833529e-7 }),
  Object.freeze({ omega: 500000, pOmega: 7368787, gap: 1.05399835014e-2, law: 1.05403772446e-2, residual: -3.937432152e-7 }),
  Object.freeze({ omega: 1000000, pOmega: 15485863, gap: 1.00673923467e-2, law: 1.00675375236e-2, residual: -1.451769323e-7 }),
  Object.freeze({ omega: 1500000, pOmega: 23879519, gap: 9.81074597874e-3, law: 9.81088284784e-3, residual: -1.368690971e-7 }),
  Object.freeze({ omega: 2000000, pOmega: 32452843, gap: 9.63671269903e-3, law: 9.63686710892e-3, residual: -1.544098916e-7 }), // residual RISES
  Object.freeze({ omega: 2500000, pOmega: 41161739, gap: 9.50605934262e-3, law: 9.50620583257e-3, residual: -1.464899473e-7 }),
  Object.freeze({ omega: 3000000, pOmega: 49979687, gap: 9.40199496385e-3, law: 9.4021153133e-3, residual: -1.203494458e-7 }),
  Object.freeze({ omega: 4000000, pOmega: 67867967, gap: 9.24249933212e-3, law: 9.24259988649e-3, residual: -1.005543676e-7 }),
  Object.freeze({ omega: 5000000, pOmega: 86028121, gap: 9.12258052122e-3, law: 9.1226496189e-3, residual: -6.909768022e-8 }),
  Object.freeze({ omega: 5700000, pOmega: 98866927, gap: 9.05365185615e-3, law: 9.05371888677e-3, residual: -6.703062275e-8 }),
]);

// Local decay exponent q_i for |residual| ~ C/(log p)^q, recomputed here from the ladder (Math.log, no bake).
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

export const IMP97659_LOCAL_EXPONENTS = localExponents(IMP97659_DEEP_LADDER);

// Average (global) decay exponent: slope of log|residual| vs log(log p), recomputed here (least squares).
function averageExponent(ladder) {
  const xs = ladder.map((r) => Math.log(Math.log(r.pOmega)));
  const ys = ladder.map((r) => Math.log(Math.abs(r.residual)));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  return -num / den; // exponent = -slope
}

export const IMP97659_AVERAGE_EXPONENT = averageExponent(IMP97659_DEEP_LADDER); // ~10.18

export const IMP97659_RESULTS = Object.freeze({
  question: 'extended-precision (dps>=30) recompute of the Route M gap AND law at p ~ 5e7+ to decide whether the residual decay exponent keeps CLIMBING or SATURATES',
  method: 'mpmath dps=30, live sieve to p=1e8 (omega up to 5.7e6); gap = Pi_omega*(lnA - Sigma_omega/12) + e^{-gamma}/12; law = e^{-gamma}*(lnA + gamma/12)/log p_omega; residual carries ~24 sig figs',
  anchorReproduced: 'at omega=148933 (p=1999993) the dps=30 residual -8.351691933e-7 matches the imp-97640 baked literal -8.352e-7',
  localExponents: IMP97659_LOCAL_EXPONENTS.map((e) => e.qLocal), // oscillate -6.738 .. +28.721
  localExponentMin: Math.min(...IMP97659_LOCAL_EXPONENTS.map((e) => e.qLocal)), // ~ -6.738
  localExponentMax: Math.max(...IMP97659_LOCAL_EXPONENTS.map((e) => e.qLocal)), // ~ +28.721
  hasNegativeLocalExponent: true,           // residual RISES on the p=2.39e7 -> 3.25e7 rung
  exponentOscillatesNotClimbNorSaturate: true, // the DECISION: neither monotone-climb nor fixed constant
  averageExponent: IMP97659_AVERAGE_EXPONENT, // ~10.18, far above 3
  averageExponentExceedsThree: true,
  scaledColumnsNonMonotoneAtDepth: 'both |res|*log^2 and |res|*log^3 RISE at the p=2.39e7 -> 3.25e7 rung, correcting the imp-97619/imp-97640 shallow-ladder strictly-decreasing claim',
  correctionIsOscillatingPntError: true,
  climbingReadingWasSparseArtifact: 'the imp-97640 6.839 -> 8.713 climb was a two-rung sparse-ladder artifact; the precision-clean deep ladder oscillates',
  subGapResolved: 'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6',
});

export const IMP97659_VERDICT = Object.freeze({
  question: 'does the gap-law residual decay exponent keep climbing (faster than any power) or saturate at a fixed power?',
  answerNeitherItOscillates: true,          // q_local from -6.738 to +28.721, one negative rung
  hasNegativeLocalExponent: true,           // residual rises with height on one rung
  averageExponentExceedsThree: true,        // ~10.18 average => outruns every fixed power <= 3
  climbingWasSparseArtifact: true,          // corrects imp-97640 two-rung reading
  scaledColumnsNonMonotoneAtDepth: true,    // corrects imp-97619/imp-97640 strictly-decreasing claim
  correctionIsPntStrength: true,            // oscillating PNT/Mertens error
  anchorReproduced: true,                    // dps=30 residual matches imp-97640 literal at p=1999993
  mcmRefuted: true,                          // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. The extended-precision (mpmath dps=30) recompute of gap AND law at the imp-97639 ' +
    'deep heights (p = 2e6 .. 9.9e7) RESOLVES the imp-97640 sub-gap: the residual decay exponent NEITHER ' +
    'keeps climbing NOR saturates at a fixed power -- it OSCILLATES (q_local from -6.738 to +28.721, with ' +
    'one NEGATIVE rung at p = 2.39e7 -> 3.25e7 where the residual magnitude rises with height). That ' +
    'oscillation, with an average exponent ~10.18 that still outruns every fixed power <= 3, is the ' +
    'oscillating-PNT/Mertens-error fingerprint. The imp-97640 6.839 -> 8.713 climb was a two-rung sparse ' +
    'artifact, and the imp-97619/imp-97640 strictly-decreasing |res|*log^2/log^3 columns are non-monotone ' +
    'at depth (they rise at the same rung). MCM stays refuted from omega=11; b/4 ceiling untouched; ' +
    'kappa_arith unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97659_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Extended-precision (dps=30) recompute of the Route M ' +
  'gap-law residual at the deep heights p ~ 5e7 and beyond: the decay exponent q in |residual| ~ C/(log p)^q ' +
  'NEITHER keeps climbing NOR saturates -- it OSCILLATES (q_local from -6.738 to +28.721, one negative rung ' +
  'where the residual rises with height), average ~10.18 > 3, the oscillating PNT/Mertens fingerprint. This ' +
  'resolves the imp-97640 sub-gap: the earlier 6.839 -> 8.713 climb was a two-rung sparse artifact and the ' +
  'strictly-decreasing scaled columns are non-monotone at depth. MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97659_ASSERTIONS = [
  {
    id: 'imp97659-deep-ladder-internal-consistency',
    holds: () => {
      for (const row of IMP97659_DEEP_LADDER) {
        if (!(row.residual < 0)) return false;                                  // gap < law on every rung
        // residual = gap - law: rounded-literal bookkeeping, allow 1e-11 (now precision-clean, not 7-sig-fig).
        if (!(Math.abs(row.gap - row.law - row.residual) < 1e-11)) return false;
      }
      // the leading law constant is the imp-97619 closed form B_inf = lnA + gamma/12.
      return Math.abs(B_INF_DERIVED - 0.2968557824422453) < 1e-12;
    },
    why: 'the precision-clean deep ladder reproduces gap - law to 1e-11 on every rung (all residuals negative), formed against the imp-97619 closed-form B_inf.',
  },
  {
    id: 'imp97659-anchor-reproduces-imp97640-literal',
    holds: () => {
      // the deepest imp-97640 rung (p=1999993) is the top of this ladder; the dps=30 residual matches the
      // imp-97640 baked 7-sig-fig literal -8.352e-7 to its stored precision.
      const anchor = IMP97659_DEEP_LADDER[0];
      return anchor.pOmega === 1999993 && Math.abs(anchor.residual - (-8.352e-7)) < 5e-11;
    },
    why: 'the extended-precision residual at p=1999993 (-8.351691933e-7) reproduces the imp-97640 baked literal -8.352e-7, validating the formula and deep sieve before extrapolating.',
  },
  {
    id: 'imp97659-local-exponent-oscillates-with-negative-rung',
    holds: () => {
      const qs = IMP97659_LOCAL_EXPONENTS.map((e) => e.qLocal);
      const anyNeg = qs.some((q) => q < 0);            // one rung where the residual rises with height
      const spread = Math.max(...qs) - Math.min(...qs); // wide swing, not a pinned constant
      // not monotone-climbing: at least one rung decreases from the previous.
      let sawDrop = false;
      for (let i = 1; i < qs.length; i++) if (qs[i] < qs[i - 1]) sawDrop = true;
      return anyNeg && spread > 10 && sawDrop;
    },
    why: 'the deep local exponent oscillates (spread > 10, includes a negative rung and non-monotone drops), so it neither climbs monotonically nor pins at a fixed power -- the oscillating PNT/Mertens fingerprint.',
  },
  {
    id: 'imp97659-average-exponent-exceeds-three',
    holds: () => IMP97659_AVERAGE_EXPONENT > 3 && Math.abs(IMP97659_AVERAGE_EXPONENT - 10.18) < 0.5,
    why: 'the log-log average decay exponent over the deep ladder is ~10.18, far above 3, so on average the residual outruns every fixed power <= 3 (consistent with imp-97640 RESULT 1).',
  },
  {
    id: 'imp97659-scaled-columns-nonmonotone-at-depth',
    holds: () => {
      // both |res|*log^2 and |res|*log^3 RISE at some deep rung => the imp-97619/imp-97640 strictly-decreasing
      // shallow-ladder claim breaks at depth (oscillating error, not a fixed power).
      for (const k of [2, 3]) {
        let sawRise = false;
        for (let i = 1; i < IMP97659_DEEP_LADDER.length; i++) {
          const prev = Math.abs(IMP97659_DEEP_LADDER[i - 1].residual) * Math.log(IMP97659_DEEP_LADDER[i - 1].pOmega) ** k;
          const cur = Math.abs(IMP97659_DEEP_LADDER[i].residual) * Math.log(IMP97659_DEEP_LADDER[i].pOmega) ** k;
          if (cur > prev) sawRise = true;
        }
        if (!sawRise) return false;
      }
      return true;
    },
    why: 'both |res|*log^2 and |res|*log^3 rise at the p=2.39e7 -> 3.25e7 rung, so the shallow-ladder strictly-decreasing claim is non-monotone at depth -- no fixed power fits.',
  },
  {
    id: 'imp97659-honesty-gate-no-qed',
    holds: () =>
      IMP97659_VERDICT.answerNeitherItOscillates === true &&
      IMP97659_VERDICT.hasNegativeLocalExponent === true &&
      IMP97659_VERDICT.averageExponentExceedsThree === true &&
      IMP97659_VERDICT.correctionIsPntStrength === true &&
      IMP97659_VERDICT.mcmRefuted === true &&
      IMP97659_VERDICT.ceilingTouched === false &&
      IMP97659_VERDICT.anyBoundMoved === false &&
      IMP97659_VERDICT.qed === false &&
      /NO QED/.test(IMP97659_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97659_HONEST_BANNER) &&
      /RH open/.test(IMP97659_HONEST_BANNER),
    why: 'measurement only -- the deep exponent oscillates (not climb/saturate), average > 3, oscillating PNT/Mertens error; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97659_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97659-route-m-gap-law-decay-extprec assertion failed: ${a.id}`);
  }
}

export default {
  deepLadder: IMP97659_DEEP_LADDER,
  localExponents: IMP97659_LOCAL_EXPONENTS,
  averageExponent: IMP97659_AVERAGE_EXPONENT,
  results: IMP97659_RESULTS,
  verdict: IMP97659_VERDICT,
  banner: IMP97659_HONEST_BANNER,
};
