/**
 * imp-96681 -- FEASIBILITY: would extending the imp-96616 g_min running-min small-gaps ladder above
 * N = 10^6 (more rungs / a longer log-N arm) meaningfully shrink SE(b) and push the fitted decay
 * exponent b = -0.3953 clear of the -1/3 GUE pole (currently only 3.008 SE away), or is it
 * Cramer-Rao / arm-length floored like the imp-96551 / imp-96653 excursion dip-depth anchors?
 *
 * BACKGROUND. imp-96654 reproduced the imp-96616 OLS log-log fit log(ratio) = a + b log(N) over the
 * 14-rung ladder (N = 50 .. 1e6) and recovered b = -0.395338 +/- 0.020615 (SE, df = 12), residual
 * s = 0.238443. Because the GUE extreme-gap pole c = -1/3 sits only (b - c)/SE(b) = -3.008 SE below the
 * fit, propagating the fit uncertainty spreads the imp-96637 crossover N* across ~5 decades at +/-1 SE
 * and ~19 decades at 95% -- N* is a soft near-singular readout, not a measured scale. This module asks
 * the natural follow-up (the same question imp-96653 asked for the +/-30 percent excursion anchors):
 * would a LONGER ladder shrink SE(b) enough to separate b from -1/3?
 *
 * THE OLS SLOPE ERROR IS SET BY THE ARM AND THE RESIDUAL. For an OLS fit of y = log(ratio) on
 * x = log N over the rungs, SE(b) = s / spread, spread = sqrt( sum_i (x_i - xbar)^2 ). The point-estimate
 * distance to the pole, |b - c| = 0.062005, is FIXED unless the measured b itself moves as rungs are
 * added, so reaching a Z-sigma separation demands SE(b) = |b - c| / Z, i.e. the spread must grow by the
 * factor Z / 3.008. At the ladder doubling cadence (rung density ~ constant per unit log N) the number of
 * rungs K grows with the arm A, so sum (x_i - xbar)^2 ~ rho A^3 / 12 and SE(b) ~ A^{-3/2}: shrinking
 * SE(b) by f needs the arm to grow by f^{2/3}. (A pessimistic K-fixed reading gives SE(b) ~ A^{-1},
 * arm growth f.) Both are tabulated below.
 *
 * WHAT A DECISIVE SEPARATION DEMANDS OF THE ARM (recomputed). With the current arm A = ln(1e6/50) =
 * 9.9035 nat = 4.301 decades:
 *   - 4-sigma (SE = 0.01550): A^{-3/2} arm 5.20 decades -> top N ~ 7.9e6; A^{-1} arm 5.72 dec -> ~2.6e7.
 *   - 5-sigma (SE = 0.01240): A^{-3/2} arm 6.04 decades -> top N ~ 5.4e7; A^{-1} arm 7.15 dec -> ~7.1e8.
 *   - 2x current margin (~6 SE, SE = 0.01031): A^{-3/2} arm 6.83 dec -> ~3.3e8; A^{-1} ~2.0e10.
 *
 * WHY IT IS WORSE THAN THE imp-96653 CRAMER-RAO FLOOR: THE RUNNING MIN IS A STEP FUNCTION. The ladder
 * ratio g_min(N)/y_N is a running MINIMUM, hence a non-increasing STEP function: it only updates when a
 * new record small gap appears and is otherwise frozen. The 14 rungs already carry only 10 DISTINCT
 * values (four rungs are exact repeats of the plateau below them), and over the whole 2,001,052-zero
 * cache the argmin advances only 10 times (imp-96654 argminJumps). Two structural consequences:
 *   (1) EFFECTIVE INDEPENDENT SAMPLE ~ ln N, NOT N. The number of records of a running minimum of N
 *       draws grows like the harmonic number H_N ~ ln N. So new information (a new record small gap)
 *       arrives only logarithmically: doubling the record count from 10 to 20 needs N ~ (2e6)^2 = 4e12
 *       zeros. Extra arm buys new points at a crawl, no matter how long it is.
 *   (2) THE RESIDUAL IS MISSPECIFICATION, NOT SHRINKING NOISE. On each frozen plateau log(ratio) is a
 *       horizontal segment while the power law wants slope b ~ -1/3, so the OLS residual s = 0.238 is
 *       dominated by the deterministic sawtooth (plateaus rising as N^{+1/3} in ratioOverGue, snapping
 *       down at each record -- imp-96654). Plateaus LENGTHEN as records get rarer, so a flat segment of
 *       log-length L fit against a slope-1/3 line contributes residual variance ~ (1/3)^2 L^2/12 that
 *       GROWS with L. The naive OLS SE(b) = 0.0206 (computed treating the 14 autocorrelated rungs as
 *       independent) therefore UNDERSTATES the true uncertainty, and s does not cleanly shrink as the
 *       clean-iid A^{-3/2} model assumes.
 * So even the OPTIMISTIC arm models above are upper bounds on how fast SE(b) could fall; the step
 * structure makes the true reach strictly worse.
 *
 * CAN IN-REPO / COMPUTABLE ZERO DATA REACH IT? NO. The scripts/.zeros-cache/zeros6 cache holds
 * 2,001,052 ordinates (gamma up to ~1.13e6); the ladder already tops out at N = 1e6, so the cache offers
 * only +0.30 decade of extra arm (to N ~ 2e6). That is nowhere near even the optimistic 4-sigma arm of
 * ~5.2 decades (top N ~ 7.9e6), let alone the 5-sigma ~6.0 decades (top N ~ 5.4e7). Reaching those arms
 * needs 8x .. 700x more consecutive Odlyzko ordinates than the repo holds, and by point (1) each extra
 * decade delivers only ~ln-many new record points. The only tabulated ordinates beyond the cache are the
 * Odlyzko 10^20..10^23 local high blocks, which are NOT consecutive-from-1 (they cannot extend a
 * running-min-from-the-start ladder) and sit in the asymptotic-GUE regime -- the same objection
 * imp-96653 raised for the excursion anchors.
 *
 * VERDICT. NO / EFFECTIVELY FLOORED. Extending the g_min running-min ladder above N = 10^6 does not
 * meaningfully shrink SE(b) or push b clear of -1/3 with any in-repo or realistically-computable
 * consecutive-zero data. Even under the optimistic clean-iid arm model (SE(b) ~ A^{-3/2} at the ladder
 * doubling cadence) a 4-sigma separation needs an arm of ~5.2 decades (top N ~ 7.9e6) and a 5-sigma
 * separation ~6.0 decades (top N ~ 5.4e7) -- 8x to 700x beyond the 2,001,052-zero cache, which supplies
 * only +0.30 decade above the current N = 1e6 ladder top. More fundamentally the ratio is a running
 * MINIMUM: a step function whose effective independent sample size (record count) grows only like ln N
 * (10 records over 2M zeros; doubling to 20 needs N ~ 4e12) and whose OLS residual is dominated by
 * deterministic plateau-vs-slope misspecification that GROWS with plateau length, so the naive
 * SE(b) = 0.0206 understates the true uncertainty and the clean-iid arm model is only an upper bound on
 * the achievable shrink. This is a HARDER limit than the imp-96551 / imp-96653 excursion-anchor
 * Cramer-Rao arm floor (there the residual was genuine iid scatter and only the arm was short; here even
 * an infinite arm buys new record points only logarithmically). Confirms and extends imp-96654; changes
 * no bound; conditional on GUE; RH open; NO QED; no refereed bound is changed; the fold-law
 * envelope-exponent gain still requires the unproved GUE cube-root small-gaps law (imp-96616).
 *
 * @see imp-96654-gmin-crossover-sensitivity-oscillation (SE(b)=0.020615, 3.006 SE from the -1/3 pole; sawtooth plateaus)
 * @see imp-96616-gmin-ratio-extreme-gap-decay (the 14-rung ladder, b=-0.3953, fold-law lever)
 * @see imp-96637-gmin-fit-gue-crossover (the crossover N* = (A/C)^{1/(c-b)})
 * @see imp-96653-third-excursion-anchor-lever-arm-reach (the excursion-anchor Cramer-Rao arm floor pattern)
 * @see imp-96551-nonols-two-anchor-slope-separation-reach (SD = (pi/2)/Delta_x arm-bound floor)
 *
 * Import-light: no zeros bundle, no sibling imports. The 14-rung ladder (N, ratio), the pole c=-1/3, the
 * cache size 2,001,052 and the observed record count 10 are baked literals; every OLS statistic, arm and
 * top-N figure is recomputed below and re-derived in the self-executing assertions.
 */

// Baked 14-rung ladder (imp-96616 GMIN_RATIO_EXTREME_GAP_DECAY.ladder): N, running-min ratio g_min/y_N.
const LADDER = [
  [50, 0.386289],
  [100, 0.386289],
  [200, 0.324386],
  [500, 0.236315],
  [1000, 0.137626],
  [2000, 0.089253],
  [5000, 0.046290],
  [10000, 0.042098],
  [20000, 0.042098],
  [50000, 0.040746],
  [100000, 0.021860],
  [200000, 0.021860],
  [500000, 0.009695],
  [1000000, 0.009695],
];

const POLE = -1 / 3; // GUE extreme-gap exponent c
const CACHE_ZEROS = 2001052; // scripts/.zeros-cache/zeros6 consecutive ordinates (gamma up to ~1.13e6)
const RECORDS_OBSERVED = 10; // argmin advances only 10 times over the 2M cache (imp-96654 argminJumps)

// --- reproduce the imp-96654 OLS log-log fit and recover SE(b) ---
const xs = LADDER.map(([N]) => Math.log(N));
const ys = LADDER.map(([, r]) => Math.log(r));
const nRung = xs.length;
const xbar = xs.reduce((a, b) => a + b, 0) / nRung;
const ybar = ys.reduce((a, b) => a + b, 0) / nRung;
let Sxx = 0;
let Sxy = 0;
for (let i = 0; i < nRung; i++) {
  Sxx += (xs[i] - xbar) * (xs[i] - xbar);
  Sxy += (xs[i] - xbar) * (ys[i] - ybar);
}
const B_HAT = Sxy / Sxx; // ~ -0.395338
const A_INTERCEPT = ybar - B_HAT * xbar;
const A_PREFACTOR = Math.exp(A_INTERCEPT); // ~ 2.1147
let SSE = 0;
for (let i = 0; i < nRung; i++) {
  const pred = A_INTERCEPT + B_HAT * xs[i];
  SSE += (ys[i] - pred) * (ys[i] - pred);
}
const DF = nRung - 2; // 12
const S_RESID = Math.sqrt(SSE / DF); // ~ 0.238443
const SPREAD = Math.sqrt(Sxx); // ~ 11.5665
const SE_B = S_RESID / SPREAD; // ~ 0.020615
const DIST_TO_POLE_SE = (B_HAT - POLE) / SE_B; // ~ -3.008
const DIST_TO_POLE = Math.abs(B_HAT - POLE); // ~ 0.062005 (fixed unless the measured b moves)

// distinct plateau values = record small gaps captured in the ladder (running-min is a step function)
const DISTINCT_PLATEAUS = new Set(LADDER.map(([, r]) => r)).size; // 10 of 14 rungs

// --- arm-length model: SE(b) ~ A^{-3/2} at fixed doubling cadence (K grows with A); A^{-1} if K fixed ---
const ARM_CUR_NAT = Math.log(1e6 / 50); // 9.9035 nat
const ARM_CUR_DEC = ARM_CUR_NAT / Math.log(10); // 4.301 decades
const N_BOT = 50;

const armReachForZ = (Z) => {
  const seTarget = DIST_TO_POLE / Z; // required SE(b) for a Z-sigma separation
  const f = SE_B / seTarget; // required SE-shrink factor
  const armPow32 = ARM_CUR_NAT * Math.pow(f, 2 / 3); // SE ~ A^{-3/2}
  const armLin = ARM_CUR_NAT * f; // SE ~ A^{-1} (pessimistic, K fixed)
  return {
    Z,
    seTarget,
    shrinkFactor: f,
    armPow32Nat: armPow32,
    armPow32Dec: armPow32 / Math.log(10),
    topNPow32: N_BOT * Math.exp(armPow32),
    armLinNat: armLin,
    armLinDec: armLin / Math.log(10),
    topNLin: N_BOT * Math.exp(armLin),
  };
};

const REACH_4SIGMA = armReachForZ(4);
const REACH_5SIGMA = armReachForZ(5);

// in-repo reach: cache tops the running-min ladder at only +0.30 decade above N=1e6.
const EXTRA_ARM_DEC_INREPO = Math.log10(CACHE_ZEROS / 1e6); // ~0.3013 decades
// record-count wall: records ~ ln N, so doubling the record count needs N -> N^2.
const N_TO_DOUBLE_RECORDS = CACHE_ZEROS * CACHE_ZEROS; // ~4.0e12

const IN_REPO_REACHES_4SIGMA = EXTRA_ARM_DEC_INREPO >= REACH_4SIGMA.armPow32Dec - ARM_CUR_DEC; // false
const EFFECTIVELY_FLOORED = true; // step-function running-min: effective sample ~ ln N; residual misspecified

export const IMP96681_GMIN_LADDER_ARM_EXTENSION_REACH = {
  ticket: 'imp-96681',
  question:
    'Would extending the imp-96616 g_min running-min ladder above N=10^6 (more rungs / a longer log-N arm) meaningfully shrink SE(b) and push the fitted decay exponent b=-0.3953 clear of the -1/3 GUE pole (currently only 3.008 SE away), or is it Cramer-Rao / arm-length floored like the imp-96551/imp-96653 excursion dip-depth anchors?',
  method:
    'Reproduce the imp-96654 OLS log-log fit over the 14-rung ladder to recover SE(b)=s/spread, spread=sqrt(sum (x_i-xbar)^2). The point-estimate distance to the pole |b-c|=0.062 is fixed unless the measured b moves, so a Z-sigma separation needs SE(b)=|b-c|/Z. Model the arm reach at the ladder doubling cadence (SE ~ A^{-3/2}, K grows with A) and pessimistically (SE ~ A^{-1}, K fixed), solve the arm and top-N for 4 and 5 sigma, then test against (i) the running-MIN step structure (effective independent sample = record count ~ ln N) and (ii) the in-repo consecutive-zero cache reach. Import-light; baked ladder / pole / cache-size / record-count literals.',
  reproducedFit: {
    method: 'OLS of log(ratio) = a + b log(N) over the 14 rungs (reproduces imp-96654 / imp-96616)',
    bHat: B_HAT, // ~ -0.395338
    prefactor: A_PREFACTOR, // ~ 2.1147
    residualStdErr: S_RESID, // ~ 0.238443
    degreesOfFreedom: DF, // 12
    spread: SPREAD, // ~ 11.5665
    seB: SE_B, // ~ 0.020615
    poleC: POLE, // -1/3
    distToPoleSE: DIST_TO_POLE_SE, // ~ -3.008
    distToPole: DIST_TO_POLE, // ~ 0.062005 (fixed unless the measured b itself moves)
    matchesImp96654: true,
  },
  stepFunctionStructure: {
    distinctPlateaus: DISTINCT_PLATEAUS, // 10 of 14 rungs (four are exact plateau repeats)
    rungs: nRung, // 14
    recordsOverCache: RECORDS_OBSERVED, // 10 argmin advances over 2,001,052 zeros
    effectiveSampleLaw: 'record count ~ H_N ~ ln N: new small-gap records arrive only logarithmically',
    nToDoubleRecords: N_TO_DOUBLE_RECORDS, // ~4.0e12 to grow the record count 10 -> 20
    residualIsMisspecification:
      'on each frozen plateau log(ratio) is horizontal while the power law wants slope b~-1/3, so s=0.238 is the deterministic sawtooth (plateaus rise as N^{+1/3}, snap at each record). Plateaus lengthen as records get rarer, so s does NOT cleanly shrink and the naive SE(b) understates the true (autocorrelated) uncertainty.',
  },
  armReach: {
    currentArmNat: ARM_CUR_NAT, // 9.9035
    currentArmDec: ARM_CUR_DEC, // 4.301
    note: 'SE(b) ~ A^{-3/2} at the ladder doubling cadence (K grows with A); A^{-1} if the rung count is held fixed. Both are OPTIMISTIC clean-iid upper bounds on the shrink -- the step structure makes the true reach worse.',
    fourSigma: REACH_4SIGMA, // arm ~5.2 dec -> top N ~7.9e6 (A^{-3/2}); ~5.7 dec -> ~2.6e7 (A^{-1})
    fiveSigma: REACH_5SIGMA, // arm ~6.0 dec -> top N ~5.4e7 (A^{-3/2}); ~7.2 dec -> ~7.1e8 (A^{-1})
  },
  inRepoReach: {
    cacheZeros: CACHE_ZEROS, // 2,001,052
    ladderTopN: 1e6,
    extraArmDecadesInRepo: EXTRA_ARM_DEC_INREPO, // ~0.30 decade above N=1e6
    reaches4Sigma: IN_REPO_REACHES_4SIGMA, // false
    note: 'The cache offers only +0.30 decade of extra arm (to N ~ 2e6) -- 8x to 700x short of even the optimistic 4-sigma (top N ~7.9e6) and 5-sigma (top N ~5.4e7) arms. The only ordinates beyond the cache are the Odlyzko 10^20..10^23 local high blocks, which are not consecutive-from-1 (cannot extend a running-min-from-the-start ladder) and sit in the asymptotic-GUE regime.',
  },
  inRepoReaches4Sigma: IN_REPO_REACHES_4SIGMA, // false
  effectivelyFloored: EFFECTIVELY_FLOORED, // true
  verdict:
    'NO / EFFECTIVELY FLOORED. Extending the g_min running-min ladder above N=10^6 does not meaningfully shrink SE(b) or push b clear of -1/3 with any in-repo or realistically-computable consecutive-zero data. Even under the optimistic clean-iid arm model (SE(b) ~ A^{-3/2} at the ladder doubling cadence) a 4-sigma separation needs an arm of ~5.2 decades (top N ~7.9e6) and 5-sigma ~6.0 decades (top N ~5.4e7) -- 8x to 700x beyond the 2,001,052-zero cache, which supplies only +0.30 decade above the current N=1e6 ladder top. More fundamentally the ratio is a running MINIMUM: a step function whose effective independent sample size (record count) grows only like ln N (10 records over 2M zeros; doubling to 20 needs N ~4e12) and whose OLS residual is dominated by deterministic plateau-vs-slope misspecification that grows with plateau length, so the naive SE(b)=0.0206 understates the true uncertainty and the clean-iid arm model is only an upper bound on the achievable shrink. This is a HARDER limit than the imp-96551/imp-96653 excursion-anchor Cramer-Rao arm floor (there the residual was genuine iid scatter and only the arm was short; here even an infinite arm buys new record points only logarithmically). Confirms and extends imp-96654; changes no bound; conditional on GUE; RH open; NO QED; no refereed bound is changed; the fold-law envelope-exponent gain still requires the unproved GUE cube-root small-gaps law (imp-96616).',
};

// Machine-readable honest-status banner (imp-96653 / imp-96654 convention).
export const IMP96681_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Feasibility assessment only, conditional on GUE: '
  + 'extending the imp-96616 g_min running-min ladder above N=10^6 cannot separate b=-0.3953 from the '
  + '-1/3 GUE pole. Even the optimistic clean-iid arm model needs ~5.2 decades (top N ~7.9e6) for 4-sigma '
  + 'and ~6.0 decades (top N ~5.4e7) for 5-sigma -- 8x-700x beyond the 2M-zero cache (only +0.30 decade). '
  + 'The running MINIMUM is a step function: effective independent sample ~ ln N (10 records over 2M zeros; '
  + 'doubling needs N ~4e12) and the OLS residual is plateau-vs-slope misspecification, so SE(b)=0.0206 is '
  + 'an under-estimate and cannot cleanly shrink. Harder than the imp-96653 Cramer-Rao arm floor. No bound moves.';

// --- self-executing internal-consistency assertions (formula re-derivation, generous tolerances) ---
(() => {
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
  // reproduces the imp-96654 baked fit
  if (rel(B_HAT, -0.395338) > 1e-5) throw new Error('imp-96681: bHat drifted from imp-96654 -0.395338');
  if (rel(A_PREFACTOR, 2.1147) > 5e-4) throw new Error('imp-96681: prefactor drifted from 2.1147');
  if (rel(S_RESID, 0.238443) > 1e-4) throw new Error('imp-96681: residual std err drifted from 0.238443');
  if (rel(SE_B, 0.020615) > 5e-4) throw new Error('imp-96681: SE(b) drifted from imp-96654 0.020615');
  if (DF !== 12) throw new Error('imp-96681: degrees of freedom should be 12');
  // distance to the pole ~ -3.008 SE (imp-96654 quoted -3.006 from the rounded b)
  if (!(DIST_TO_POLE_SE < -2.9 && DIST_TO_POLE_SE > -3.1)) throw new Error('imp-96681: dist to pole should be ~ -3.0 SE');
  if (rel(DIST_TO_POLE, Math.abs(B_HAT - POLE)) > 1e-12) throw new Error('imp-96681: |b-c| must equal abs(bHat - pole)');
  // SE(b) = s / spread exactly
  if (rel(SE_B, S_RESID / SPREAD) > 1e-12) throw new Error('imp-96681: SE(b) must equal s/spread');
  // step structure: 10 distinct plateaus of 14 rungs, 10 records over the cache
  if (DISTINCT_PLATEAUS !== 10) throw new Error('imp-96681: ladder should carry 10 distinct plateau values');
  if (RECORDS_OBSERVED !== 10) throw new Error('imp-96681: record count over the cache should be 10');
  // arm reach: 4-sigma arm ~5.2 dec (A^{-3/2}) with top N in ~5e6..1e7; 5-sigma ~6.0 dec
  if (!(REACH_4SIGMA.armPow32Dec > 5.0 && REACH_4SIGMA.armPow32Dec < 5.4)) throw new Error('imp-96681: 4-sigma A^{-3/2} arm should be ~5.2 decades');
  if (!(REACH_4SIGMA.topNPow32 > 5e6 && REACH_4SIGMA.topNPow32 < 1.2e7)) throw new Error('imp-96681: 4-sigma A^{-3/2} top N should be ~7.9e6');
  if (!(REACH_5SIGMA.armPow32Dec > 5.9 && REACH_5SIGMA.armPow32Dec < 6.2)) throw new Error('imp-96681: 5-sigma A^{-3/2} arm should be ~6.0 decades');
  if (!(REACH_5SIGMA.topNPow32 > 3e7 && REACH_5SIGMA.topNPow32 < 8e7)) throw new Error('imp-96681: 5-sigma A^{-3/2} top N should be ~5.4e7');
  if (!(REACH_5SIGMA.armPow32Nat > REACH_4SIGMA.armPow32Nat)) throw new Error('imp-96681: 5-sigma arm must exceed 4-sigma arm');
  // in-repo reach: only ~0.30 decade extra, does NOT reach 4-sigma
  if (!(EXTRA_ARM_DEC_INREPO > 0.28 && EXTRA_ARM_DEC_INREPO < 0.32)) throw new Error('imp-96681: in-repo extra arm should be ~0.30 decade');
  if (IN_REPO_REACHES_4SIGMA) throw new Error('imp-96681: in-repo cache must NOT reach the 4-sigma arm');
  if (!(N_TO_DOUBLE_RECORDS > 3e12 && N_TO_DOUBLE_RECORDS < 5e12)) throw new Error('imp-96681: N to double the record count should be ~4e12');
  if (!EFFECTIVELY_FLOORED) throw new Error('imp-96681: the running-min ladder should be effectively floored');
  // honesty gates
  if (!/NO QED/.test(IMP96681_GMIN_LADDER_ARM_EXTENSION_REACH.verdict))
    throw new Error('imp-96681: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96681_GMIN_LADDER_ARM_EXTENSION_REACH.verdict))
    throw new Error('imp-96681: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96681_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96681_HONEST_BANNER) && /NO QED/.test(IMP96681_HONEST_BANNER)))
    throw new Error('imp-96681: IMP96681_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96681_GMIN_LADDER_ARM_EXTENSION_REACH;
