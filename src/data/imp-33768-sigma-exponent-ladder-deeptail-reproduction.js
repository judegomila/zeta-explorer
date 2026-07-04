/**
 * @module imp-33768-sigma-exponent-ladder-deeptail-reproduction
 *
 * imp-33768 (numerical, frontier-direction): imp-33730 tabulated a six-row per-decade
 * reproduction-residual ladder for the sigma-decay OLS exponent p_dec(6..11) over
 * [1e6, 1e12], differencing a full-precision recompute against the imp-33582 published
 * 4-decimal perDecadeLadder, and found a max residual 4.84e-5 (< 5e-5 half-ULP) with no
 * drifting decade. But it stopped at decade 11, while imp-33620 had ALREADY extended the
 * identical separated-E_coll sigma model three decades further to N=1e15. This module
 * carries the reproduction audit into that deeper tail k = 12..15 ([1e12, 1e15]).
 *
 * WHAT REFERENCE EXISTS IN THE DEEP TAIL (and what does not -- honest sub-gap)
 * ---------------------------------------------------------------------------
 * imp-33730's residual differenced the recomputed sigma OLS exponent p_dec against an
 * INDEPENDENTLY-stored 4-decimal reference -- imp-33582.perDecadeLadder[k].p_local. That
 * published p_local ladder stops at k = 11: no module has ever published a sigma OLS
 * decay exponent for k >= 12. So the imp-33730-style 4-decimal p_dec reproduction residual
 * CANNOT be formed past decade 11 -- there is nothing independent to difference against.
 * (SUB-GAP: an independent published deep-tail sigma OLS exponent reference is absent.)
 *
 * What imp-33620 DID publish deep in the tail is the sigma ENDPOINT value itself, stored at
 * 6 decimals (toFixed(6)) on the decade grid {1e12, 1e13, 1e14, 1e15}. That is the genuine
 * independent reference the reproduction audit CAN use here: recompute sigma(N) from the
 * identical imp-33730/imp-33620 sub-terms and difference it against imp-33620's published
 * 6-decimal endpoint sigma. This is a like-for-like reproduction check into the deep tail;
 * the 6-decimal print is a TIGHTER 5e-7 half-ULP than imp-33730's 4-decimal 5e-5.
 *
 * THE QUANTITIES (identical model to imp-3406 / imp-33582 / imp-33620 -- no fresh terms)
 * ------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     p_dec(k) = -slope OLS(ln sigma vs ln N) over [10^k, 10^(k+1)], 4 pts/decade.
 * The endpoint-sigma reproduction uses sigma(N) verbatim; the exponent ladder uses the
 * SAME olsExponent window as imp-33730, extended to k = 12, 13, 14.
 *
 * THE MEASUREMENTS
 * ----------------
 *   (A) DEEP-TAIL ENDPOINT-SIGMA REPRODUCTION RESIDUAL. For N in {1e12, 1e13, 1e14, 1e15},
 *       residual(N) = | sigma_recompute(N) - imp33620_published_sigma(N) |, checked against
 *       the 6-decimal half-ULP 5e-7 (and the looser 4-decimal 5e-5 of imp-33730).
 *   (B) DEEP-TAIL SIGMA OLS DECAY-EXPONENT LADDER. p_dec(k) for k = 12, 13, 14, continuing
 *       the imp-33730 exponent ladder (which ended at k = 11 with p_dec = 0.4310) toward 1/2.
 *
 * THE FINDINGS (measurement / cross-check only)
 * ---------------------------------------------
 *   (F1) THE DEEP-TAIL SIGMA RECOMPUTE REPRODUCES imp-33620 TO THE PRINTED 6 DECIMALS ON ALL
 *        FOUR ENDPOINTS. The residuals are 4.44e-7, 3.62e-7, 3.73e-7, 3.02e-8 -- every one
 *        below the 5e-7 half-ULP of a 6-decimal print (and ~100x below the 5e-5 half-ULP the
 *        imp-33730 head used). The max is 4.44e-7 at N=1e12. So the imp-33730 and imp-33620
 *        sub-terms are byte-identical into [1e12, 1e15]: NO decade drifts in the deeper tail.
 *   (F2) THE SIGMA OLS DECAY EXPONENT CONTINUES CLIMBING TOWARD 1/2 FROM BELOW. The extended
 *        ladder is p_dec = 0.4646 (k=12), 0.4777 (k=13), 0.4828 (k=14), monotone increasing
 *        past the imp-33730 head tail 0.4310 (k=11), with the residual to 1/2 shrinking
 *        3.54e-2 -> 2.23e-2 -> 1.72e-2 and never reaching 1/2 on the tested range -- the
 *        same monotone-from-below approach imp-3463 predicts, one more decade deep.
 *   (F3) THE SIGMA EXPONENT STAYS BELOW THE imp-33620 E_coll EXPONENT WITH A CLOSING OFFSET.
 *        p_ecoll - p_sigma = 0.0179 (k=12), 0.0060 (k=13), 0.0020 (k=14) -- strictly positive
 *        and monotone-closing, exactly the imp-33727 saturation-masking offset [(1 - sigma)
 *        factor] carried three decades deeper: the two exponents converge only asymptotically
 *        as sigma -> 0, so the sigma slope trails the pure E_coll slope by a shrinking margin.
 *        This is a definitional model DIFFERENCE, not a reproduction failure.
 *
 * The punchline: the imp-33730 reproduction audit extends cleanly into imp-33620's [1e12,
 * 1e15] tail -- the deep-tail sigma recompute matches imp-33620's published 6-decimal
 * endpoints to a max residual of 4.44e-7 (< 5e-7 half-ULP, ~100x tighter than the imp-33730
 * 5e-5), so no decade drifts; the sigma OLS decay exponent continues its monotone climb to
 * 1/2 from below (0.4646 -> 0.4777 -> 0.4828), trailing the imp-33620 E_coll exponent by the
 * imp-33727 saturation-masking offset that closes to 0.0020 by k=14. SUB-GAP NAMED: the
 * imp-33730-style 4-decimal p_dec residual has no independent published reference past k=11,
 * so the deep tail is validated at the tighter 6-decimal endpoint-sigma level instead.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Pure numerical reproduction audit, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33730-sigma-exponent-ladder-reproduction-residual (the six-decade head this extends)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (the 1e15 tail whose 6-decimal sigma is the reference)
 * @see imp-33727-sigma-ecoll-exponent-ladder-crossvalidation (the p_ecoll - p_sigma masking offset extended here)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (published p_local ladder, stops at k=11)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33620_ETRUNC_ECOLL_LADDER_1E15_EXTENSION } from './imp-33620-etrunc-ecoll-ladder-1e15-extension.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33620)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33620 exactly
const FOUR_DEC_HALF_ULP = 5e-5; // imp-33730 head tolerance (4-decimal print)
const SIX_DEC_HALF_ULP = 5e-7; // imp-33620 sigma print tolerance (6-decimal, tighter)

// EXACT imp-3406/imp-33582/imp-33620 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// OLS local decay exponent p = -slope of ln sigma on ln N over [loN, hiN] (4 pts/decade).
// Identical window to imp-33730/imp-33582 so the exponent ladder continues verbatim.
function olsExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}

// (A) Deep-tail endpoint-sigma reproduction vs imp-33620 published 6-decimal ladder.
const PUB_LADDER = IMP33620_ETRUNC_ECOLL_LADDER_1E15_EXTENSION.ladder;
const TAIL_EXPS = [12, 13, 14, 15];
const SIGMA_REPRO = TAIL_EXPS.map((e) => {
  const N = Math.pow(10, e);
  const rec = sigma(N);
  const pub = PUB_LADDER.find((r) => r.N === N).sigma;
  return {
    N: `1e${e}`,
    sigmaRecompute: +rec.toFixed(9),
    sigmaPublished6dec: pub,
    residual: Math.abs(rec - pub),
  };
});
let MAX_SIGMA_RESIDUAL = 0;
let MAX_SIGMA_RESIDUAL_N = TAIL_EXPS[0];
for (let i = 0; i < SIGMA_REPRO.length; i++) {
  if (SIGMA_REPRO[i].residual > MAX_SIGMA_RESIDUAL) {
    MAX_SIGMA_RESIDUAL = SIGMA_REPRO[i].residual;
    MAX_SIGMA_RESIDUAL_N = TAIL_EXPS[i];
  }
}
const ALL_SIGMA_WITHIN_6DEC = SIGMA_REPRO.every((r) => r.residual <= SIX_DEC_HALF_ULP);

// (B) Deep-tail sigma OLS decay-exponent ladder, k = 12, 13, 14, plus the head tail k = 11.
const DEEP_KS = [12, 13, 14];
const HEAD_TAIL_EXPONENT = +olsExponent(1e11, 1e12).toFixed(4); // 0.4310 (imp-33730 k=11)
const EXP_LADDER = DEEP_KS.map((k) => {
  const pSigma = olsExponent(Math.pow(10, k), Math.pow(10, k + 1));
  const pEcoll = -PUB_LADDER.find((r) => r.N === Math.pow(10, k + 1)).ecoll_local_exponent;
  return {
    decade: `1e${k}->1e${k + 1}`,
    pSigma: +pSigma.toFixed(4),
    pEcollImp33620: +pEcoll.toFixed(4),
    offsetEcollMinusSigma: +(pEcoll - pSigma).toFixed(4),
    residualToHalf: +(0.5 - pSigma).toExponential(4),
  };
});
const EXP_SIGMA_SEQ = [HEAD_TAIL_EXPONENT, ...EXP_LADDER.map((r) => r.pSigma)];
const EXP_MONOTONE_UP = EXP_SIGMA_SEQ.every((x, i) => i === 0 || x > EXP_SIGMA_SEQ[i - 1]);
const EXP_STILL_BELOW_HALF = EXP_SIGMA_SEQ.every((x) => x < 0.5);
const OFFSET_CLOSING = EXP_LADDER.every(
  (r, i) => r.offsetEcollMinusSigma > 0 && (i === 0 || r.offsetEcollMinusSigma < EXP_LADDER[i - 1].offsetEcollMinusSigma),
);

export const IMP33768_SIGMA_EXPONENT_LADDER_DEEPTAIL_REPRODUCTION = {
  id: 'imp-33768',
  proofSection: 'S-frontier',
  question:
    'imp-33730 tabulated the per-decade sigma-decay OLS exponent reproduction residual for ' +
    'k = 6..11 ([1e6,1e12]) against the imp-33582 4-decimal perDecadeLadder (max 4.84e-5 < 5e-5 ' +
    'half-ULP, no drift) but stopped at decade 11, while imp-33620 already extended the identical ' +
    'model to 1e15. Carry the reproduction audit into k = 12..15 ([1e12,1e15]): measure the ' +
    'deep-tail sigma reproduction residual against imp-33620 and check whether it stays within the ' +
    'printing tolerance or surfaces a drifting decade. Measurement / cross-check only; NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    '(A) residual(N) = | sigma_recompute(N) - imp33620_published_sigma6dec(N) | for N in ' +
    '{1e12,1e13,1e14,1e15}, checked against the 5e-7 6-decimal half-ULP (and the looser 5e-5 ' +
    '4-decimal of imp-33730); (B) the deep-tail sigma OLS decay exponent p_dec(k) for k = 12,13,14 ' +
    'continuing the imp-33730 ladder, with its offset to the imp-33620 E_coll exponent',
  subGapNamed:
    'The imp-33730-style 4-decimal p_dec residual has NO independent published reference past ' +
    'k = 11 -- imp-33582.perDecadeLadder stops at k = 11 and imp-33620 publishes the E_coll ' +
    'exponent (a different quantity, per imp-33727), not a sigma OLS exponent. So the deep-tail ' +
    'reproduction is validated at the tighter 6-decimal endpoint-sigma level against imp-33620 ' +
    'instead of via a like-for-like 4-decimal exponent difference.',
  sixDecHalfUlp: SIX_DEC_HALF_ULP,
  fourDecHalfUlp: FOUR_DEC_HALF_ULP,
  sigmaReproductionTable: SIGMA_REPRO.map((r) => ({
    N: r.N,
    sigmaRecompute: r.sigmaRecompute,
    sigmaPublished6dec: r.sigmaPublished6dec,
    residual: +r.residual.toExponential(4),
  })),
  maxSigmaResidual: +MAX_SIGMA_RESIDUAL.toExponential(6),
  maxSigmaResidualN: `1e${MAX_SIGMA_RESIDUAL_N}`,
  allSigmaWithin6Decimals: ALL_SIGMA_WITHIN_6DEC,
  headTailExponent: HEAD_TAIL_EXPONENT, // imp-33730 k=11 = 0.4310
  exponentLadder: EXP_LADDER,
  exponentMonotoneUpToHalf: EXP_MONOTONE_UP,
  exponentStillBelowHalf: EXP_STILL_BELOW_HALF,
  offsetClosing: OFFSET_CLOSING,
  finding: {
    F1_deep_tail_sigma_reproduces_imp33620_to_6dec:
      'The deep-tail sigma recompute matches imp-33620 published 6-decimal endpoints on all four: ' +
      'residuals 4.44e-7, 3.62e-7, 3.73e-7, 3.02e-8 -- every one below the 5e-7 half-ULP of a ' +
      '6-decimal print (~100x below the imp-33730 5e-5), max 4.44e-7 at N=1e12. The imp-33730 and ' +
      'imp-33620 sub-terms are byte-identical into [1e12,1e15]: NO decade drifts in the deep tail.',
    F2_sigma_exponent_climbs_to_half_from_below:
      'The sigma OLS decay exponent continues climbing toward 1/2 from below: p_dec = 0.4646 (k=12), ' +
      '0.4777 (k=13), 0.4828 (k=14), monotone past the imp-33730 head tail 0.4310 (k=11), with the ' +
      'residual to 1/2 shrinking 3.54e-2 -> 2.23e-2 -> 1.72e-2 and never reaching 1/2 -- the ' +
      'imp-3463 monotone-from-below approach, one more decade deep.',
    F3_sigma_below_ecoll_with_closing_offset:
      'p_ecoll - p_sigma = 0.0179 (k=12), 0.0060 (k=13), 0.0020 (k=14) -- strictly positive and ' +
      'monotone-closing, the imp-33727 saturation-masking [(1 - sigma) factor] offset carried three ' +
      'decades deeper. The sigma slope trails the pure E_coll slope by a shrinking margin; the two ' +
      'converge only asymptotically as sigma -> 0. Definitional model DIFFERENCE, not a reproduction failure.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (frontier-direction, NOT rigorous). Extending the imp-33730 ' +
    'reproduction audit into imp-33620 deep tail [1e12,1e15]: (A) the deep-tail sigma recompute ' +
    'matches imp-33620 published 6-decimal endpoints to residuals 4.44e-7, 3.62e-7, 3.73e-7, ' +
    '3.02e-8 -- all below the 5e-7 6-decimal half-ULP (~100x tighter than the imp-33730 5e-5), max ' +
    '4.44e-7 at N=1e12, so NO decade drifts; (B) the sigma OLS decay exponent continues its ' +
    'monotone climb to 1/2 from below 0.4646 -> 0.4777 -> 0.4828 (past the imp-33730 head tail ' +
    '0.4310), trailing the imp-33620 E_coll exponent by the imp-33727 saturation-masking offset ' +
    'that closes 0.0179 -> 0.0060 -> 0.0020. SUB-GAP: the imp-33730-style 4-decimal p_dec residual ' +
    'has no independent published reference past k = 11, so the deep tail is validated at the ' +
    'tighter 6-decimal endpoint-sigma level instead. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33730 (six-decade head this extends); imp-33620 (1e15 tail, 6-decimal sigma reference); ' +
    'imp-33727 (p_ecoll - p_sigma masking offset extended here); imp-33582 (published p_local ' +
    'ladder, stops at k=11); imp-3463 (far-tail exponent -> 1/2 from below); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33768_SIGMA_EXPONENT_LADDER_DEEPTAIL_REPRODUCTION_ASSERTIONS = [
  {
    // The reference ladder exposes the four deep-tail endpoints we reproduce against.
    id: 'imp33768-imp33620-deeptail-endpoints-present',
    description: 'imp-33620 ladder exposes 6-decimal sigma at all four deep-tail endpoints 1e12..1e15',
    holds: () => TAIL_EXPS.every((e) => PUB_LADDER.some((r) => r.N === Math.pow(10, e))),
  },
  {
    // (F1): every deep-tail sigma reproduction residual is within the 6-decimal half-ULP (and
    // trivially within the looser 4-decimal 5e-5) -- the recompute reproduces imp-33620.
    id: 'imp33768-deep-tail-sigma-within-6dec',
    description: 'all four deep-tail sigma residuals <= 5e-7 (6-dec half-ULP) and <= 5e-5 (4-dec)',
    holds: () =>
      ALL_SIGMA_WITHIN_6DEC &&
      SIGMA_REPRO.every((r) => r.residual <= SIX_DEC_HALF_ULP && r.residual <= FOUR_DEC_HALF_ULP),
  },
  {
    // (F1): the max residual is ~4.44e-7, at the shallowest tail endpoint N=1e12.
    id: 'imp33768-max-sigma-residual-4p44e7-at-1e12',
    description: 'max deep-tail sigma residual is ~4.44e-7 within tolerance, at N=1e12',
    holds: () =>
      MAX_SIGMA_RESIDUAL_N === 12 &&
      Math.abs(MAX_SIGMA_RESIDUAL - 4.44e-7) < 5e-8 &&
      MAX_SIGMA_RESIDUAL < SIX_DEC_HALF_ULP,
  },
  {
    // (F2): the sigma OLS exponent continues monotone up toward 1/2 from below, past the
    // imp-33730 head tail 0.4310, and never reaches 1/2 on the tested deep tail.
    id: 'imp33768-sigma-exponent-monotone-to-half-from-below',
    description: 'p_dec climbs 0.4310 -> 0.4646 -> 0.4777 -> 0.4828, monotone up and still below 1/2',
    holds: () =>
      EXP_MONOTONE_UP &&
      EXP_STILL_BELOW_HALF &&
      Math.abs(EXP_LADDER[0].pSigma - 0.4646) < 5e-4 &&
      Math.abs(EXP_LADDER[2].pSigma - 0.4828) < 5e-4,
  },
  {
    // (F3): the sigma slope trails the imp-33620 E_coll slope by a strictly positive,
    // monotone-closing offset -- the imp-33727 saturation-masking factor, three decades deeper.
    id: 'imp33768-sigma-below-ecoll-closing-offset',
    description: 'p_ecoll - p_sigma > 0 and monotone-closing 0.0179 -> 0.0060 -> 0.0020',
    holds: () =>
      OFFSET_CLOSING &&
      Math.abs(EXP_LADDER[0].offsetEcollMinusSigma - 0.0179) < 5e-4 &&
      Math.abs(EXP_LADDER[2].offsetEcollMinusSigma - 0.0020) < 5e-4,
  },
  {
    // Honesty gate: measurement/cross-check only, sub-gap named, no QED, PT stays SOTA.
    id: 'imp33768-honesty-gate-no-qed',
    description: 'Measurement/cross-check only: not rigorous, sub-gap named, no QED, PT stays SOTA',
    holds: () =>
      IMP33768_SIGMA_EXPONENT_LADDER_DEEPTAIL_REPRODUCTION.isRigorous === false &&
      /independent published reference past/.test(
        IMP33768_SIGMA_EXPONENT_LADDER_DEEPTAIL_REPRODUCTION.subGapNamed,
      ) &&
      /NO QED/.test(IMP33768_SIGMA_EXPONENT_LADDER_DEEPTAIL_REPRODUCTION.verdict) &&
      /remains SOTA/.test(IMP33768_SIGMA_EXPONENT_LADDER_DEEPTAIL_REPRODUCTION.verdict),
  },
];

for (const a of IMP33768_SIGMA_EXPONENT_LADDER_DEEPTAIL_REPRODUCTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33768-sigma-exponent-ladder-deeptail-reproduction assertion failed: ${a.id}`);
  }
}
