/**
 * imp-95206 - T-P1 tail repricing probe for the 0.1399 certification campaign
 * (executes the rank-1 first computation of imp-95201).
 * HONEST STATUS: PRICING PROBE (grade: measured/arb-certified-probe). This
 * module freezes the result of re-parametrizing the 0.1787854 v3 all-N tail
 * verifier (verify_tail_arb.c, sealed audit copy a74738de) to the 0.1399 row
 * coordinates and binary-searching the minimal cutoff N1*. It prices the
 * campaign's dominant cost and tests failure criteria K1/K2. It derives no
 * bound, certifies no lane, and closes no gap. NO QED. No refereed bound is changed
 *  (PT-floor audit: verified height binds).
 *
 * VERDICT IN ONE LINE: K1 does NOT fire (a minimal cutoff exists:
 * N1* = 220,495,706, boundary exact at 320 and 512 bits) but K2 FIRES
 * DECISIVELY: N1* is 4.01x the ~5.5e7 economic cutoff line, and the T2b
 * finite transition lane would need N1* - 690988 = 219,804,718 rows --
 * 69.8x the v3 full-replay campaign and 4.06x the whole Gate-2 family
 * scale. In the verbatim endpoint-cap / exact-convolution architecture with
 * the P1113 mollifier, the 0.1399 tail lane is economically dead.
 *
 * WHAT WAS RUN. verify_tail_arb_01399.c (scripts/imp-95206-tail-repricing/),
 * a re-parametrization of the reference verifier with: t point interval
 * 10103/80000, y-box the exact point 33/200 (y*^2 = 1089/40000), extended
 * hull top 8645375/10^7 (exact-integer over-bracket of beta* =
 * sqrt(59794/80000)), N1 a runtime parameter, M = 153814 and the P1113
 * lambda vector verbatim. All t-dependent quantities (delta_hat, kappa_hat,
 * sigma1/sigma2, b_t(n), cap weights, eC0 exponent) are recomputed from the
 * exact t* inside Arb. Every decisive comparison is a fail-closed Arb strict
 * comparison; precision 320 bits, boundary re-confirmed at 512.
 *
 * GRADE BOUNDARY (why "probe", not "certificate"): (i) the paper's uniform
 * error decimals (0.626, 6.66, 1.24, 10.50, x-12) and the gamma-kernel
 * constant 0.02 transfer verbatim from the reference discipline (stated for
 * 0 < t <= 1/2, 0 < y <= 1); re-deriving t*-specific constants is T2a work.
 * (ii) The P1113 mollifier was optimized at t = 129/800; a re-optimized
 * vector at t* could lower N1*, so N1* prices THIS architecture verbatim,
 * an upper-bound-shaped price. (iii) The v3 regression corridors were
 * re-pinned from the N1* run itself (replay guards, not independent checks).
 */

import { IMP95201_CAMPAIGN } from './imp-95201-01399-certification-campaign.js';

// ── probe setup (frozen) ─────────────────────────────────────────────────────
export const PROBE_SETUP = Object.freeze({
  source: 'scripts/imp-95206-tail-repricing/verify_tail_arb_01399.c',
  base: 'research-inputs/gate2-evaluator-inputs/verify_tail_arb.c (sealed audit copy, commit a74738de)',
  toolchain: 'FLINT 3.6.0 (bundled Arb), Apple clang 21.0.0, macOS arm64',
  precisionBits: [320, 512],
  tStar: { num: 10103, den: 80000, value: 10103 / 80000 }, // point interval
  yStar: { num: 33, den: 200, value: 33 / 200 }, // y-box is this exact point
  yStarSquared: { num: 1089, den: 40000, value: 1089 / 40000 },
  bandTopSquared: { num: 59794, den: 80000, value: 59794 / 80000 }, // 1 - 2t*
  extHullTop: { num: 8645375, den: 10000000, value: 0.8645375 }, // >= beta*, exact-integer bracket
  MHEAD: 153814, // architecture constant, verbatim
  MERR: 3000,
  lambdaVector: 'P1113 (11 divisors, lambda_1 = 1, sum|lambda| = 9918746/1000000), verbatim',
  searchBracketSpec: [690989, 55000000], // the imp-95201 T-P1 bracket (K2 line at top)
  secondsPerEvaluation: 0.36, // measured, 320 bits (M=153814 head)
});

// ── toolchain validation: reference package reproduced first ─────────────────
export const REFERENCE_REPRODUCTION = Object.freeze({
  what: 'unmodified verify_tail_arb.c compiled and run at 320 bits BEFORE any probe',
  gates: '36/36 PASS',
  dUpper: 0.999720909388749415, // matches frozen v3 literal 0.9997209093887508
  flowLower: 0.000173532608938017,
  marginLower: 0.000173520937334581, // matches frozen v3 slackLowerBound 0.0001735209373337
  agreesWithSealedLiterals: true,
});

// ── measured contraction along the search axis (D upper points, 320 bits) ────
// D = P + TR + OV + Mmax*AB must be < 1; flow = (1-D)/Mmax must exceed err.
export const PROBE_POINTS = Object.freeze([
  Object.freeze({ N1: 690989, dUpper: 11.8928662535195710, note: 'bracket bottom (seam anchor + 1); SC3 and three GN gates also fail' }),
  Object.freeze({ N1: 3840000, dUpper: 7.1902575639485530, note: 'v3 anchor: reference D was 0.9997209 at t=129/800 -- earlier t* explodes it 7.19x' }),
  Object.freeze({ N1: 55000000, dUpper: 2.1537003789018250, note: 'K2 economic eliminate line: contraction still 115% above closing' }),
  Object.freeze({ N1: 100000000, dUpper: 1.5581402346327461, note: 'above the spec bracket' }),
  Object.freeze({ N1: 220495705, dUpper: 1.0000000014873569, note: 'N1* - 1: fails D < 1 (boundary, both precisions)' }),
  Object.freeze({ N1: 220495706, dUpper: 0.9999999989161343, note: 'N1*: all decisive gates strict-PASS (both precisions)' }),
  Object.freeze({ N1: 300000000, dUpper: 0.8396672624800176, note: '' }),
  Object.freeze({ N1: 1000000000, dUpper: 0.4294016698458207, note: '' }),
  Object.freeze({ N1: 10000000000, dUpper: 0.1491044714846459, note: 'confirms D -> 0: the architecture closes, just far too late' }),
]);

// ── the frozen result ────────────────────────────────────────────────────────
export const N1_STAR_RESULT = Object.freeze({
  n1Star: 220495706,
  binarySearch: '27 bisection evaluations on [1e8, 3e8] after endpoint probes; predicate (all decisive gates strict-PASS) verified monotone along all probe points',
  boundary: Object.freeze({
    atN1Star: Object.freeze({
      gatesNoPin: '28/28 PASS (320 and 512 bits)',
      gatesPinned: '36/36 PASS (320 and 512 bits; 8 corridors re-pinned at N1*)',
      dUpper: 0.9999999989161343,
      oneMinusD: 1.0838657e-9, // razor-thin: v3 had 2.79e-4 of 1-D headroom
      flowLower: 6.67978418767637e-10,
      errUpper: 1.20052251745429e-10,
      marginLower: 5.47926167022208e-10,
    }),
    atN1StarMinus1: Object.freeze({
      dUpper: 1.0000000014873569,
      failedGates: ['P width < 1-D', 'D < 1', 'flow > err > 0'],
    }),
  }),
  componentsAtN1Star: Object.freeze({
    P: 0.1476164750582683,
    TR: 0.3310024215555584,
    OV: 0.0238034632124955,
    Mmax: 1.6226059348332891,
    AB: 0.3066534075884140,
  }),
  totalArbCost: 'about 40 evaluations x 0.36 s = under 15 s of Arb time (vs the < 1 core-day budget)',
});

// ── eliminate verdicts ────────────────────────────────────────────────────────────
export const KILL_VERDICTS = Object.freeze({
  K1: Object.freeze({
    fires: false,
    finding:
      'the endpoint-cap contraction DOES close at t* (D < 1 for all N1 >= 220,495,706, decreasing to 0.149 at 1e10), so the architecture is not analytically dead -- N1* exists',
  }),
  K2: Object.freeze({
    fires: true,
    finding:
      'N1* = 220,495,706 > 5.5e7: 4.01x the economic cutoff line. T2b rows = N1* - 690988 = 219,804,718: 69.8x the v3 full-replay campaign (3,149,013 rows, ~1e3 core-hours) and 4.06x the entire Gate-2 family scale (54,109,012 rows) that K2 names as the cutoff threshold. The trade Theorem 4.5 was designed to win (cocycle weld -> two delimited tasks) is lost: the tail transition lane alone regrows past open-family size, implying ~7e4 core-hours of sealed-replay row production before the slab lane spends anything',
  }),
  campaignPredictionConfirmed:
    'imp-95201 flagged that the v3 slack 1.735e-4 would weaken at the earlier t*; measured: at the unchanged v3 anchor N1 = 3,840,000 the contraction explodes from 0.9997209 to 7.1903 (the slack does not merely weaken -- D grows 7.19x past closing)',
  consequence:
    'the 0.1399 tail lane (T2a/T2b) PARKS in the verbatim architecture. Residual outs, in order: (i) re-optimize the mollifier vector at t* (P1113 was tuned at t = 129/800; Mmax*AB = 0.4976 and TR = 0.3310 dominate D at N1*), (ii) a genuinely new tail estimate (K1 language), (iii) retreat to a later-t* row. None is priced here.',
});

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95206_TAIL_REPRICING = Object.freeze({
  ticket: 'imp-95206',
  title: 'T-P1 tail repricing probe: minimal cutoff N1* for the 0.1399 all-N tail',
  proofSection: 'S-frontier / Theorem 4.5 campaign, tail lane pricing',
  source:
    'imp-95201 CAMPAIGN_TASKS T-P1 spec; verify_tail_arb.c (a74738de) re-parametrized to (t*, y*^2) = (10103/80000, 1089/40000); FLINT/Arb 3.6.0 at 320+512 bits',
  grade: 'measured/arb-certified-probe',
  gradeNote:
    'Arb interval arithmetic with fail-closed strict comparisons (certified-style runs, reference package reproduced 36/36 first); PROBE because the uniform-error decimal constants and the 0.02 gamma-kernel constant transfer verbatim (T2a re-derivation pending) and the P1113 mollifier is reused unoptimized at t*. NOT a shadow: no floating-point or mpmath surrogate was used.',
  setup: PROBE_SETUP,
  referenceReproduction: REFERENCE_REPRODUCTION,
  probePoints: PROBE_POINTS,
  result: N1_STAR_RESULT,
  killVerdicts: KILL_VERDICTS,
  t2bCost: Object.freeze({
    rows: 219804718, // N1* - 690988
    vsV3Replay: 69.8, // x 3,149,013 rows
    vsGate2FamilyScale: 4.06, // x 54,109,012 rows
  }),
  provesBound: false,
  isRigorous: false, // the probe is interval-rigorous but certifies no lemma
  movesRigorousBound: false,
  changesConditionalFrontier: false, // pricing only; the 0.1399 row's status is unchanged (parked harder)
  verdict:
    'PRICING PROBE ONLY: the ranked first computation of the 0.1399 campaign. ' +
    'K1 clear (the re-parametrized all-N tail closes: minimal cutoff N1* = 220,495,706, ' +
    'exact boundary at 320 and 512 bits, 36/36 pinned gates at N1*), but K2 FIRES: ' +
    'N1* is 4.01x the economic cutoff line and the finite transition lane would need ' +
    '219,804,718 rows, 69.8x the v3 replay and 4.06x the Gate-2 family scale. The ' +
    '0.1399 tail lane parks in the verbatim endpoint-cap architecture; residual outs ' +
    '(mollifier re-optimization at t*, new tail estimate) are unpriced. This probe ' +
    'changes no bound and certifies no lane; NO QED; no refereed bound is changed' +
    '.',
});

// ── assertions (self-executing; import-light; throw on violation) ────────────
export const IMP95206_TAIL_REPRICING_ASSERTIONS = [
  {
    id: 'imp95206-coordinates-match-campaign',
    description: 'probe coordinates equal the imp-95201 frozen row: t* + y*^2/2 = 0.1399, band top^2 = 1 - 2t*',
    holds: () =>
      Math.abs(PROBE_SETUP.tStar.value - IMP95201_CAMPAIGN.coords.tStar) < 1e-15 &&
      Math.abs(PROBE_SETUP.yStar.value - IMP95201_CAMPAIGN.coords.yStar) < 1e-15 &&
      Math.abs(PROBE_SETUP.tStar.value + PROBE_SETUP.yStarSquared.value / 2 - 0.1399) < 1e-15 &&
      Math.abs(PROBE_SETUP.bandTopSquared.value - (1 - 2 * PROBE_SETUP.tStar.value)) < 1e-15 &&
      10103 + 1089 === 11192 && 11192 * 10000 === 1399 * 80000 &&
      80000 - 2 * 10103 === 59794,
  },
  {
    id: 'imp95206-ext-hull-top-brackets-beta-star',
    description: 'exact-integer bracket: (8645375/1e7)^2 >= 59794/80000 > (8645374/1e7)^2 (checked in scaled BigInt)',
    holds: () =>
      8645375n * 8645375n * 40000n >= 29897n * 10000000n * 10000000n &&
      8645374n * 8645374n * 40000n < 29897n * 10000000n * 10000000n,
  },
  {
    id: 'imp95206-reference-reproduced-before-probe',
    description: 'the unmodified v3 verifier reproduced 36/36 with the sealed literals (toolchain validation)',
    holds: () =>
      REFERENCE_REPRODUCTION.agreesWithSealedLiterals &&
      Math.abs(REFERENCE_REPRODUCTION.dUpper - IMP95201_CAMPAIGN.referenceClosure.pieces[2].literals.contractionUpperBound) < 1e-12 &&
      Math.abs(REFERENCE_REPRODUCTION.marginLower - IMP95201_CAMPAIGN.referenceClosure.pieces[2].literals.slackLowerBound) < 1e-12,
  },
  {
    id: 'imp95206-contraction-monotone-along-probes',
    description: 'measured D upper points strictly decrease in N1 (the monotone predicate the binary search relies on)',
    holds: () =>
      PROBE_POINTS.every((p, i) => i === 0 || (p.N1 > PROBE_POINTS[i - 1].N1 && p.dUpper < PROBE_POINTS[i - 1].dUpper)),
  },
  {
    id: 'imp95206-boundary-straddles-one',
    description: 'exact boundary: D > 1 at N1* - 1 and D < 1 at N1*, at consecutive integers',
    holds: () => {
      const below = PROBE_POINTS.find((p) => p.N1 === 220495705);
      const at = PROBE_POINTS.find((p) => p.N1 === 220495706);
      return (
        below && at && below.dUpper > 1 && at.dUpper < 1 &&
        at.N1 - below.N1 === 1 && at.N1 === N1_STAR_RESULT.n1Star
      );
    },
  },
  {
    id: 'imp95206-margin-arithmetic-at-n1star',
    description: 'at N1*: flow > err > 0, margin ~ flow - err (7-sig-fig storage tolerance), 1-D consistent with dUpper',
    holds: () => {
      const b = N1_STAR_RESULT.boundary.atN1Star;
      return (
        b.flowLower > b.errUpper && b.errUpper > 0 && b.marginLower > 0 &&
        Math.abs(b.marginLower - (b.flowLower - b.errUpper)) < 1e-15 &&
        Math.abs(1 - b.dUpper - b.oneMinusD) < 1e-15
      );
    },
  },
  {
    id: 'imp95206-components-sum-to-D',
    description: 'P + TR + OV + Mmax*AB reproduces the D upper point at N1* (7-sig-fig tolerance)',
    holds: () => {
      const c = N1_STAR_RESULT.componentsAtN1Star;
      const d = c.P + c.TR + c.OV + c.Mmax * c.AB;
      return Math.abs(d - N1_STAR_RESULT.boundary.atN1Star.dUpper) < 1e-6;
    },
  },
  {
    id: 'imp95206-k2-fires-k1-clear',
    description: 'K1 clear (N1* exists), K2 fires: N1* > 5.5e7 spec top; rows = N1* - 690988 exceed both pricing anchors',
    holds: () =>
      KILL_VERDICTS.K1.fires === false &&
      KILL_VERDICTS.K2.fires === true &&
      N1_STAR_RESULT.n1Star > PROBE_SETUP.searchBracketSpec[1] &&
      IMP95206_TAIL_REPRICING.t2bCost.rows === N1_STAR_RESULT.n1Star - 690988 &&
      IMP95206_TAIL_REPRICING.t2bCost.rows > 3149013 &&
      IMP95206_TAIL_REPRICING.t2bCost.rows > 54799999 - 690988 + 1 &&
      Math.abs(IMP95206_TAIL_REPRICING.t2bCost.rows / 3149013 - 69.8) < 0.05 &&
      Math.abs(IMP95206_TAIL_REPRICING.t2bCost.rows / (54799999 - 690988 + 1) - 4.06) < 0.005 &&
      Math.abs(N1_STAR_RESULT.n1Star / 5.5e7 - 4.01) < 0.005,
  },
  {
    id: 'imp95206-earlier-tstar-explodes-v3-anchor',
    description: 'at the unchanged v3 anchor N1 = 3,840,000 the t* contraction is > 7 (v3 had 0.9997209): the campaign K1-risk prediction confirmed in direction and magnitude',
    holds: () => {
      const v3anchor = PROBE_POINTS.find((p) => p.N1 === 3840000);
      return v3anchor && v3anchor.dUpper > 7 && v3anchor.dUpper < 7.2;
    },
  },
  {
    id: 'imp95206-probe-hygiene',
    description: 'grade is probe (not certificate), no bound claimed, verdict carries NO QED + no-refereed-bound-change, conditional frontier unchanged',
    holds: () =>
      IMP95206_TAIL_REPRICING.grade === 'measured/arb-certified-probe' &&
      IMP95206_TAIL_REPRICING.provesBound === false &&
      IMP95206_TAIL_REPRICING.isRigorous === false &&
      IMP95206_TAIL_REPRICING.movesRigorousBound === false &&
      IMP95206_TAIL_REPRICING.changesConditionalFrontier === false &&
      /NO QED/.test(IMP95206_TAIL_REPRICING.verdict) &&
      /refereed bound is changed/i.test(IMP95206_TAIL_REPRICING.verdict),
  },
];

for (const a of IMP95206_TAIL_REPRICING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95206-t-p1-tail-repricing assertion failed: ${a.id}`);
  }
}

export default IMP95206_TAIL_REPRICING;
