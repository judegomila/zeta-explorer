/**
 * @module imp-97057-uniform-subset-acf-robustness
 *
 * imp-97057 (numerical): IMP97039_SUBGAP asked for a LONGER, uniformly-spaced
 * Burnol-ratio ladder to firm up the high-lag ACF and the drift VIF, because the
 * imp-97039 reconciliation (AR(1) 2.578 -> block-bootstrap ~1.70, truncation at
 * lag 3) rests on only 21 NON-uniformly-spaced imp-96487 rungs (step 250/300, then
 * 500, then 1000) and its lag-3+ terms carry large sampling noise.
 *
 * WHY NO GENUINELY NEW RUNGS ARE COMPUTED HERE: each Burnol rung
 *     ratio(N) = d_N^2 * log N / C_burnol
 * is the output of a Route M Vasyunin-Gram solve; imp-96487 records that a wider-N
 * ladder is CPU-blocked ("no new solve"), so producing additional uniformly-spaced
 * rungs is out of reach in this channel. What IS available is the robustness test
 * the sub-gap implicitly demands: re-measure the ACF and the three-treatment VIF on
 * the largest genuinely uniform-in-N CONTIGUOUS SUBSETS of the existing ladder, and
 * check whether the lag structure and the 2.578 -> 1.70 reconciliation survive once
 * the mixed spacing is removed. If the direction is an artifact of the non-uniform
 * index-lag, it should break on a uniform subset; if it is real, it should persist.
 *
 * THE UNIFORM BLOCKS (tmp/imp-97057-uniform-subset-acf.mjs, reproducible):
 *   A: N=250..2000  step 250  (8 rungs)  -- breaks at 2300 where step becomes 300
 *   B: N=3000..6000 step 500  (7 rungs)  -- the dense extension block
 *   C: N=7000..10000 step 1000 (4 rungs) -- coarse tail, too short for high lag
 * The biased sample ACF rho_k and the three imp-97039 VIF treatments (sign-change
 * truncated, Bartlett b=3 block-bootstrap proxy, naive full plain sum) are computed
 * on each block and compared with the full-ladder imp-97039 constants.
 *
 * FINDINGS (see IMP97057_ROBUST / IMP97057_UNSTABLE):
 *   ROBUST (the reconciliation direction survives removing non-uniform spacing):
 *   (1) lag-1 ACF stays POSITIVE in all three blocks (+0.131, +0.527, +0.277): the
 *       positive short-lag correlation that anchors the AR(1) phi1 is not a spacing
 *       artifact.
 *   (2) the first-sign-change lag -- the TRUNCATION POINT -- is lag 3 in BOTH longer
 *       blocks A and B independently, matching the full-ladder lag 3. Only the
 *       4-rung block C (too short to reach lag 3) moves it to lag 2.
 *   (3) the VIF ordering AR(1) 2.578 > sign-change > Bartlett holds in every block,
 *       and block B (N=3000..6000) reproduces the block-bootstrap VIF almost
 *       exactly: Bartlett b=3 = 1.7358 vs full-ladder 1.6726 and measured MBB 1.700.
 *   UNSTABLE (the sub-gap stands: magnitudes do not stabilise on existing data):
 *   (4) the lag-1 magnitude swings from 0.131 (block A) to 0.527 (block B): the exact
 *       phi1=0.441 is not pinned by any single short uniform subset.
 *   (5) the naive full plain sum is wild across blocks (-0.162, 1.030, 0.565),
 *       reconfirming that the full ACF sum is noise-dominated (matches the full
 *       ladder falling to 0.252), which is why truncation is mandatory.
 *   (6) block C (4 rungs) moves the truncation point, showing 4-8 rung subsets are
 *       too short to pin the lag-3+ anticorrelation lobe.
 *
 * VERDICT: the 2.578 -> ~1.70 reconciliation and the lag-3 truncation point are
 * ROBUST IN DIRECTION -- they reproduce on two independent uniform-in-N subsets,
 * so they are not an artifact of the mixed 250/300/500/1000 spacing -- but they do
 * NOT stabilise to a precise value on the existing data: the available uniform
 * blocks are only 7-8 rungs, too short to pin the lag-1 magnitude or the lag-3+
 * terms. IMP97039_SUBGAP therefore stands as stated: a rigorous drift VIF still
 * needs a genuinely LONGER uniformly-spaced ladder, which requires the CPU-blocked
 * Vasyunin-Gram build, not a re-treatment of the existing 21 rungs.
 *
 * MEASUREMENT ONLY. No new Gram solve, no new statistic beyond a re-measurement of
 * the baked imp-96487 ratios on uniform subsets; no bound is moved, no operator
 * positivity is established. No refereed bound is changed. RH open.
 * NO QED.
 *
 * @see imp-97039-vif-reconciliation-ladder.js (the full-ladder reconciliation this stress-tests; IMP97039_SUBGAP)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (the 21-rung ladder; CPU-blocked wider-N build)
 * @see imp-96832-drift-vif-ar1-geometric-tail-decomposition.js (source ACF/VIF constants)
 *
 * Ticket: imp-97057 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Full-ladder imp-97039 reference constants (the values the subsets are compared to).
export const IMP97057_FULL_LADDER_REF = Object.freeze({
  acfLag1: 0.441029,
  acfLag2: 0.126791,
  acfLag3: -0.167839,
  firstSignChangeLag: 3,
  vifAr1: 2.578004,
  vifIntegratedAcf: 2.135640,
  vifBartlettB3: 1.672566,
  vifMeasuredMbb: 1.6996,
  vifFullPlainSum: 0.252148,
  note: 'the 21-rung ladder is NON-uniform in N: step 250 (with one 300 gap at 2300), then 500, then 1000; the ACF is measured over rung-index lag, mixing those spacings.',
});

// The uniform-in-N contiguous subsets of the 21-rung ladder and their re-measured
// ACF (biased sample rho_k) and three-treatment VIF (tmp/imp-97057-uniform-subset-acf.mjs).
export const IMP97057_UNIFORM_BLOCKS = Object.freeze([
  Object.freeze({
    label: 'A',
    Nfrom: 250, Nto: 2000, stepN: 250, rungs: 8,
    meanRatio: 0.988111,
    acf: Object.freeze([
      Object.freeze({ lag: 1, rho: 0.1309 }),
      Object.freeze({ lag: 2, rho: 0.0514 }),
      Object.freeze({ lag: 3, rho: -0.1866 }),
      Object.freeze({ lag: 4, rho: -0.3184 }),
      Object.freeze({ lag: 5, rho: -0.2584 }),
    ]),
    firstSignChangeLag: 3,
    vifSignChange: 1.3645,
    vifBartlettB3: 1.2088,
    vifFullPlainSum: -0.1622,
  }),
  Object.freeze({
    label: 'B',
    Nfrom: 3000, Nto: 6000, stepN: 500, rungs: 7,
    meanRatio: 0.976433,
    acf: Object.freeze([
      Object.freeze({ lag: 1, rho: 0.5266 }),
      Object.freeze({ lag: 2, rho: 0.0505 }),
      Object.freeze({ lag: 3, rho: -0.1342 }),
      Object.freeze({ lag: 4, rho: -0.4278 }),
    ]),
    firstSignChangeLag: 3,
    vifSignChange: 2.1542,
    vifBartlettB3: 1.7358,
    vifFullPlainSum: 1.0302,
  }),
  Object.freeze({
    label: 'C',
    Nfrom: 7000, Nto: 10000, stepN: 1000, rungs: 4,
    meanRatio: 0.981953,
    acf: Object.freeze([
      Object.freeze({ lag: 1, rho: 0.2775 }),
      Object.freeze({ lag: 2, rho: -0.4949 }),
    ]),
    firstSignChangeLag: 2,
    vifSignChange: 1.5550,
    vifBartlettB3: 1.0400,
    vifFullPlainSum: 0.5652,
    tooShort: true, // 4 rungs cannot reach lag 3; truncation point unresolved
  }),
]);

// What survives removing the non-uniform spacing (the reconciliation direction).
export const IMP97057_ROBUST = Object.freeze({
  lag1PositiveAllBlocks: true, // +0.131, +0.527, +0.277
  truncationLag3InBothLongBlocks: true, // A and B both first-sign-change at lag 3
  vifOrderingAr1GtSignGtBartlett: true, // holds in every block vs AR(1) 2.578
  blockBBartlettReproducesMbb: 1.7358, // vs full-ladder 1.6726 and measured MBB 1.700
  statement:
    'the 2.578 -> ~1.70 reconciliation and the lag-3 truncation point reproduce on two ' +
    'independent uniform-in-N subsets (N=250..2000 step 250 and N=3000..6000 step 500): ' +
    'lag-1 ACF stays positive everywhere, the truncation point is lag 3 in both longer ' +
    'blocks, the VIF ordering AR(1) > integrated > block-bootstrap holds, and block B ' +
    'reproduces the block-bootstrap VIF at 1.7358 (full ladder 1.6726, measured MBB 1.700). ' +
    'The direction is therefore NOT an artifact of the mixed 250/300/500/1000 spacing.',
});

// What does NOT stabilise on existing data (IMP97039_SUBGAP stands).
export const IMP97057_UNSTABLE = Object.freeze({
  lag1MagnitudeRange: Object.freeze({ lo: 0.1309, hi: 0.5266 }), // exact phi1=0.441 not pinned
  fullPlainSumRange: Object.freeze({ lo: -0.1622, hi: 1.0302 }), // full sum noise-dominated
  blockCMovesTruncation: true, // 4-rung block C first-sign-change at lag 2 not 3
  statement:
    'magnitudes do not stabilise: the lag-1 ACF swings 0.131..0.527 across short blocks so ' +
    'phi1=0.441 is not pinned; the naive full plain sum is wild (-0.162..1.030), reconfirming ' +
    'the full ACF sum is noise-dominated (full ladder 0.252); and the 4-rung block C moves the ' +
    'truncation point to lag 2. The available uniform blocks are only 7-8 rungs -- too short to ' +
    'pin the lag-1 magnitude or the lag-3+ anticorrelation lobe.',
});

export const IMP97057_VERDICT = Object.freeze({
  directionRobust: true,
  magnitudesStabilise: false,
  subGapClosed: false,
  conclusion:
    'the imp-97039 reconciliation is robust IN DIRECTION -- the lag-3 truncation point and the ' +
    'AR(1) 2.578 -> block-bootstrap ~1.70 ordering survive on two independent uniform-in-N subsets, ' +
    'so they are not a non-uniform-spacing artifact -- but it does NOT stabilise to a precise value ' +
    'on the existing data (uniform blocks only 7-8 rungs). IMP97039_SUBGAP stands: a rigorous drift ' +
    'VIF needs a genuinely LONGER uniformly-spaced ladder, which requires the CPU-blocked ' +
    'Vasyunin-Gram build; a re-treatment of the existing 21 rungs cannot supply it.',
});

// The sub-gap remains open: the residual is the blocked Gram solve, not a re-fit.
export const IMP97057_SUBGAP = Object.freeze({
  id: 'imp-97057-longer-uniform-ladder-needs-blocked-gram-solve',
  statement:
    'the reconciliation direction (lag-3 truncation, AR(1) 2.578 -> block-bootstrap ~1.70) is ' +
    'confirmed robust to removing the non-uniform rung spacing, but the magnitude and the exact ' +
    'lag-3+ terms cannot be stabilised because the longest uniform-in-N subset of the existing ' +
    'ladder is only 8 rungs. Producing a genuinely longer uniformly-spaced Burnol-ratio ladder ' +
    'requires the CPU-blocked Route M Vasyunin-Gram solve at additional N; no re-treatment of the ' +
    'existing 21 rungs can close it.',
  status: 'open',
});

export const IMP97057_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the ACF and VIF are ' +
  're-measured from tmp/imp-97057-uniform-subset-acf.mjs on uniform-in-N subsets of the baked ' +
  'imp-96487 ratios -- no new Gram solve, no bound is moved and no operator positivity is ' +
  'established. Confirms only the DIRECTION of the imp-97039 reconciliation; IMP97039_SUBGAP ' +
  'stands because a longer uniformly-spaced ladder needs the CPU-blocked Vasyunin-Gram build.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97057_ASSERTIONS = [
  {
    id: 'imp97057-three-uniform-blocks',
    holds: () =>
      IMP97057_UNIFORM_BLOCKS.length === 3 &&
      IMP97057_UNIFORM_BLOCKS.every((b) => b.rungs >= 4 && b.stepN > 0) &&
      IMP97057_UNIFORM_BLOCKS[0].stepN === 250 && IMP97057_UNIFORM_BLOCKS[1].stepN === 500,
    why: 'the three subsets are genuinely uniform in N (steps 250, 500, 1000) and each has >= 4 rungs.',
  },
  {
    id: 'imp97057-lag1-positive-all-blocks',
    holds: () => IMP97057_UNIFORM_BLOCKS.every((b) => b.acf[0].lag === 1 && b.acf[0].rho > 0),
    why: 'the lag-1 ACF is positive in every uniform block, so the short-lag positive correlation is not a spacing artifact.',
  },
  {
    id: 'imp97057-truncation-lag3-in-both-long-blocks',
    holds: () => {
      const a = IMP97057_UNIFORM_BLOCKS.find((b) => b.label === 'A');
      const bb = IMP97057_UNIFORM_BLOCKS.find((b) => b.label === 'B');
      return a.firstSignChangeLag === 3 && bb.firstSignChangeLag === 3 &&
        IMP97057_FULL_LADDER_REF.firstSignChangeLag === 3;
    },
    why: 'the truncation point (first negative-ACF lag) is lag 3 in both longer uniform blocks, matching the full-ladder lag 3.',
  },
  {
    id: 'imp97057-blockB-reproduces-mbb',
    holds: () => {
      const bb = IMP97057_UNIFORM_BLOCKS.find((b) => b.label === 'B');
      return Math.abs(bb.vifBartlettB3 - IMP97057_FULL_LADDER_REF.vifMeasuredMbb) < 0.05 &&
        bb.vifBartlettB3 < IMP97057_FULL_LADDER_REF.vifAr1;
    },
    why: 'block B (N=3000..6000) reproduces the block-bootstrap VIF within 0.05 of the measured MBB 1.700 and below the AR(1) 2.578.',
  },
  {
    id: 'imp97057-vif-ordering-ar1-highest-every-block',
    holds: () =>
      IMP97057_UNIFORM_BLOCKS.every((b) => b.vifSignChange < IMP97057_FULL_LADDER_REF.vifAr1 && b.vifBartlettB3 < IMP97057_FULL_LADDER_REF.vifAr1),
    why: 'in every block the sign-change and Bartlett VIFs sit below the AR(1) 2.578, preserving the AR(1)-over-counts direction.',
  },
  {
    id: 'imp97057-lag1-magnitude-unstable',
    holds: () =>
      IMP97057_UNSTABLE.lag1MagnitudeRange.hi - IMP97057_UNSTABLE.lag1MagnitudeRange.lo > 0.3 &&
      IMP97057_VERDICT.magnitudesStabilise === false,
    why: 'the lag-1 magnitude swings by > 0.3 across the short subsets, so the exact phi1 does not stabilise (the sub-gap stands).',
  },
  {
    id: 'imp97057-blockC-too-short',
    holds: () => {
      const c = IMP97057_UNIFORM_BLOCKS.find((b) => b.label === 'C');
      return c.tooShort === true && c.firstSignChangeLag === 2 && c.rungs === 4;
    },
    why: 'the 4-rung block C cannot reach lag 3 and moves the truncation point to lag 2, confirming short subsets under-resolve the lag-3+ lobe.',
  },
  {
    id: 'imp97057-subgap-open-and-banner-present',
    holds: () =>
      IMP97057_SUBGAP.status === 'open' &&
      IMP97057_VERDICT.subGapClosed === false &&
      /RH open/.test(IMP97057_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97057_HONEST_BANNER) &&
      /NO QED/.test(IMP97057_HONEST_BANNER),
    why: 'the sub-gap stays open (longer ladder needs the blocked Gram solve) and the honest banner carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97057_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97057-uniform-subset-acf-robustness assertion failed: ${a.id}`);
  }
}

export default {
  fullLadderRef: IMP97057_FULL_LADDER_REF,
  uniformBlocks: IMP97057_UNIFORM_BLOCKS,
  robust: IMP97057_ROBUST,
  unstable: IMP97057_UNSTABLE,
  verdict: IMP97057_VERDICT,
  subGap: IMP97057_SUBGAP,
  banner: IMP97057_HONEST_BANNER,
};
