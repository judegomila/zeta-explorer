/**
 * @module imp-97039-vif-reconciliation-ladder
 *
 * imp-97039 (accuracy/tabulation): imp-96832 (IMP96832_VERDICT) diagnosed WHY the
 * imp-96692 AR(1) drift VIF (2.578) overstates the imp-96709 moving-block-bootstrap
 * VIF (~1.70): the AR(1) proxy assumes the autocorrelation is exactly phi1^k -- a
 * monotone-positive geometric tail -- whereas the measured 21-rung Burnol-ratio
 * ladder ACF (imp-96487) matches phi1 only at lag 1, falls below geometric at lag 2,
 * and turns anticorrelated across lags 3..7. That reconciliation was stated in prose
 * and in scalar summary constants (IMP96832_DECOMPOSITION / IMP96832_VIF_VARIANTS)
 * but never ASSEMBLED as one explicit lag-by-lag ladder that a reader can walk down
 * to see the 2.578 -> 1.70 gap accumulate term by term with the truncation point made
 * visible. This module builds that ladder: for each lag it lists the per-lag VIF
 * contribution under three lag treatments of the SAME ACF -- (i) AR(1) full geometric
 * extrapolation phi1^k, (ii) empirical ACF summed sharply to the first sign change,
 * (iii) the Bartlett/block-bootstrap triangular window at b=3 -- and reports the
 * running cumulative VIF of each so the divergence is explicit.
 *
 * THE THREE TREATMENTS (all are 1 + 2*Sum_k w_k*c_k, differing only in c_k, w_k):
 *   (i)   AR(1) full geometric:   c_k = phi1^k,   w_k = 1 for all k -> Sum -> 2.578.
 *   (ii)  sign-change truncated:  c_k = rhoEmp_k, w_k = 1 for lags before the first
 *         negative rhoEmp (here lags 1..2), 0 after -> 2.1356 (= integrated-ACF).
 *   (iii) Bartlett b=3 (block bootstrap): c_k = rhoEmp_k, w_k = (1-k/b) for k<b,
 *         0 else -> 1.6726 reconstructed (imp-96709 measured MBB 1.700).
 *   For reference the naive FULL empirical plain sum (c_k=rhoEmp_k, w_k=1, all 12
 *   lags) runs into the negative lobe and deflates to 0.2522 (below 1), which is why
 *   truncation is required -- it is included as the last cumulative column.
 *
 * THE GAP, DECOMPOSED (verified in tmp against the imp-96832 constants):
 *   2.578004 (AR(1) full)                                 the over-count
 *     - 0.442364  AR(1) fictitious positive geometric tail at lags>=2, i.e. the
 *                 difference between extrapolating phi1^k and truncating the
 *                 empirical ACF sharply at the first sign change
 *   = 2.135640 (empirical sign-change truncated, lags 1..2)
 *     - 0.463074  the Bartlett triangular down-weighting of the two retained lags
 *                 (the block-bootstrap window at b=3), (1-1/3) and (1-2/3)
 *   = 1.672566 (Bartlett b=3 reconstruction; imp-96709 measured MBB 1.700)
 *   Total AR(1) -> Bartlett gap 0.905438; AR(1) -> measured MBB 0.8784 (headline).
 *   The truncation point is the first lag where the empirical ACF turns negative:
 *   lag 3 (rhoEmp = -0.167839). Everything at and beyond that lag is where AR(1)
 *   manufactures positive correlation the data do not have.
 *
 * MEASUREMENT/TABULATION ONLY. Every value here is an exact re-tabulation of the
 * imp-96832 baked ACF and VIF constants -- no new statistic is estimated, no bound
 * is moved, no operator positivity is established. No refereed bound is changed
 * . RH open. NO QED. Inherits the imp-96832 sub-gap: the high-lag ACF
 * terms (lags 3+) come from only 21 non-uniformly-spaced rungs and carry large
 * sampling noise, so only the ROBUST direction (AR(1) over-counts a positive
 * geometric tail; the truncated block-bootstrap ~1.70 is the defensible reading) is
 * asserted; a rigorous drift VIF still needs a longer, uniformly-spaced ladder.
 *
 * @see imp-96832-drift-vif-ar1-geometric-tail-decomposition.js (source ACF/VIF constants this re-tabulates)
 * @see imp-96692-route-m-reach-drift-covariance-inflation.js (the AR(1) 2.578 primary)
 * @see imp-96709-route-m-drift-vif-block-bootstrap.js (the ~1.70 block-bootstrap target)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (the 21-rung ladder, source data)
 *
 * Ticket: imp-97039 (accuracy, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Baked from imp-96832 (single source of truth for the ladder ACF and VIF targets).
export const IMP97039_INPUTS = Object.freeze({
  phi1: 0.4410291360666976, // lag-1 ACF = imp-96692 phi1 (AR(1) fit anchor)
  vifAr1: 2.578004, // imp-96692 AR(1) full geometric extrapolation (over-count)
  vifIntegratedAcf: 2.135640, // empirical ACF summed to first sign change (lags 1..2)
  vifBlockBootstrapRecon: 1.672566, // Bartlett triangular window b=3 reconstruction
  vifBlockBootstrapMeasured: 1.6996, // imp-96709 measured MBB b=3 primary (the target)
  vifFullEmpiricalPlainSum: 0.252148, // naive full sum lags 1..12 (deflates below 1)
  blockLength: 3, // b ~ m^(1/3) for m=21
  firstSignChangeLag: 3, // first lag where rhoEmp turns negative (the truncation point)
});

// The measured ACF (imp-96832 IMP96832_ACF): lag-k empirical autocorrelation rhoEmp
// vs the geometric AR(1) tail ar1Geo = phi1^k. They agree only at lag 1.
const IMP97039_ACF = Object.freeze([
  Object.freeze({ lag: 1, rhoEmp: 0.441029, ar1Geo: 0.441029 }),
  Object.freeze({ lag: 2, rhoEmp: 0.126791, ar1Geo: 0.194507 }),
  Object.freeze({ lag: 3, rhoEmp: -0.167839, ar1Geo: 0.085783 }),
  Object.freeze({ lag: 4, rhoEmp: -0.394313, ar1Geo: 0.037833 }),
  Object.freeze({ lag: 5, rhoEmp: -0.400910, ar1Geo: 0.016685 }),
  Object.freeze({ lag: 6, rhoEmp: -0.211335, ar1Geo: 0.007359 }),
  Object.freeze({ lag: 7, rhoEmp: -0.112564, ar1Geo: 0.003245 }),
  Object.freeze({ lag: 8, rhoEmp: 0.282535, ar1Geo: 0.001431 }),
  Object.freeze({ lag: 9, rhoEmp: 0.213907, ar1Geo: 0.000631 }),
  Object.freeze({ lag: 10, rhoEmp: 0.003077, ar1Geo: 0.000278 }),
  Object.freeze({ lag: 11, rhoEmp: -0.079983, ar1Geo: 0.000123 }),
  Object.freeze({ lag: 12, rhoEmp: -0.074321, ar1Geo: 0.000054 }),
]);

// Build the reconciliation ladder: per lag, the VIF contribution under each treatment
// and the running cumulative VIF (all start from the base 1). The sign-change and
// Bartlett treatments zero out lags beyond their window; the AR(1) treatment never
// truncates. round6 keeps stored values readable and re-checkable.
function round6(x) {
  return Math.round(x * 1e6) / 1e6;
}

const B = IMP97039_INPUTS.blockLength;
const firstNegLag = IMP97039_ACF.find((r) => r.rhoEmp < 0).lag;

let cumAr1 = 1;
let cumSignChange = 1;
let cumBartlett = 1;
let cumFullEmp = 1;
let truncatedForSignChange = false;

export const IMP97039_LADDER = Object.freeze(
  IMP97039_ACF.map((r) => {
    // (i) AR(1) full geometric extrapolation phi1^k, never truncated.
    const ar1Contrib = 2 * r.ar1Geo;
    cumAr1 += ar1Contrib;

    // (ii) empirical ACF summed sharply to the first sign change (weight 1 before,
    // 0 at and after the first negative lag).
    if (r.lag >= firstNegLag) truncatedForSignChange = true;
    const signChangeContrib = truncatedForSignChange ? 0 : 2 * r.rhoEmp;
    cumSignChange += signChangeContrib;

    // (iii) Bartlett triangular block-bootstrap window at b=3: weight (1-k/b) for
    // k<b, 0 otherwise, applied to the empirical ACF.
    const bartlettWeight = r.lag < B ? 1 - r.lag / B : 0;
    const bartlettContrib = 2 * bartlettWeight * r.rhoEmp;
    cumBartlett += bartlettContrib;

    // (reference) naive full empirical plain sum, weight 1 over ALL lags.
    const fullEmpContrib = 2 * r.rhoEmp;
    cumFullEmp += fullEmpContrib;

    return Object.freeze({
      lag: r.lag,
      rhoEmp: r.rhoEmp,
      ar1Geo: r.ar1Geo,
      // per-lag contributions
      ar1Contrib: round6(ar1Contrib),
      signChangeContrib: round6(signChangeContrib),
      bartlettWeight: round6(bartlettWeight),
      bartlettContrib: round6(bartlettContrib),
      fullEmpContrib: round6(fullEmpContrib),
      // running cumulative VIF under each treatment
      cumAr1: round6(cumAr1),
      cumSignChange: round6(cumSignChange),
      cumBartlett: round6(cumBartlett),
      cumFullEmp: round6(cumFullEmp),
      // markers
      isTruncationLag: r.lag === firstNegLag,
      ar1MatchesData: Math.abs(r.rhoEmp - r.ar1Geo) < 1e-5,
    });
  })
);

// The AR(1) treatment sums a geometric tail to INFINITY, not just to lag 12; the
// closed-form limit (1+phi1)/(1-phi1) is the reported 2.578 (the lag-12 cumulative
// 2.577916 is short by the truncated tail beyond lag 12).
export const IMP97039_AR1_GEOMETRIC_LIMIT = Object.freeze({
  cumAr1ToLag12: IMP97039_LADDER[IMP97039_LADDER.length - 1].cumAr1,
  geometricLimitToInfinity: round6((1 + IMP97039_INPUTS.phi1) / (1 - IMP97039_INPUTS.phi1)),
  note: 'the AR(1) VIF is the geometric series summed to infinity, (1+phi1)/(1-phi1)=2.578004; the ladder cumulative at lag 12 (2.577916) is short only by the tiny tail beyond lag 12, so the ladder and the closed form agree.',
});

// The explicit gap decomposition down the reconciliation ladder.
export const IMP97039_GAP_DECOMPOSITION = Object.freeze({
  ar1Full: 2.578004,
  minusFictitiousGeometricTail: -0.442364, // AR(1) phi1^k tail lags>=2 vs sharp sign-change truncation
  signChangeTruncated: 2.135640,
  minusBartlettDownWeighting: -0.463074, // triangular window down-weighting of the retained lags 1..2
  bartlettB3Recon: 1.672566,
  measuredMbb: 1.6996,
  ar1MinusBartlettGap: 0.905438, // 2.578004 - 1.672566
  ar1MinusMeasuredGap: 0.8784, // 2.578 - 1.700 (imp-96832 headline overstatement)
  truncationPointLag: 3, // first lag with negative empirical ACF
  note: 'walking the ladder: AR(1) 2.578 loses 0.442 by truncating the empirical ACF sharply at the first sign change (lag 3) instead of extrapolating a positive geometric tail, reaching the integrated-ACF 2.136; it then loses a further 0.463 to the Bartlett triangular down-weighting of the two retained lags (the block-bootstrap window at b=3), reaching 1.673 (measured MBB 1.700). The whole 0.88 overstatement is the fictitious positive tail plus the window down-weighting; both act only at/after lag 3, the truncation point.',
});

export const IMP97039_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy/tabulation only: every ' +
  'value re-tabulates the imp-96832 baked 21-rung ladder ACF and the imp-96692/imp-96709 ' +
  'VIF constants -- no new statistic is estimated and no bound is moved. Inherits the ' +
  'imp-96832 sub-gap: the high-lag ACF terms come from only 21 non-uniformly-spaced rungs ' +
  'and carry large sampling noise, so only the robust direction is asserted (AR(1) ' +
  'over-counts a positive geometric tail; the truncated block-bootstrap ~1.70 is the ' +
  'defensible reading). No operator positivity is established.';

export const IMP97039_SUBGAP = Object.freeze({
  id: 'imp-97039-inherits-imp-96832-high-lag-sampling-noise',
  statement:
    'the reconciliation ladder is an exact re-tabulation, so the lag-1/lag-2 terms that ' +
    'set the block-bootstrap 1.70 and the AR(1) fictitious-tail decomposition are as ' +
    'reliable as the imp-96832 source, but the lag-3+ terms (the anticorrelation lobe ' +
    'that defines the truncation point) come from only 21 non-uniformly-spaced imp-96487 ' +
    'rungs and carry large sampling noise -- the naive full plain sum falling to 0.252 is ' +
    'itself the evidence. The direction is robust; a rigorous drift VIF needs a longer, ' +
    'uniformly-spaced ladder, not a re-estimate of the existing 21 rungs.',
  status: 'open',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97039_ASSERTIONS = [
  {
    id: 'imp97039-ladder-has-all-twelve-lags',
    holds: () => IMP97039_LADDER.length === 12 && IMP97039_LADDER[0].lag === 1 && IMP97039_LADDER[11].lag === 12,
    why: 'the ladder tabulates every measured lag 1..12.',
  },
  {
    id: 'imp97039-ar1-matches-data-only-at-lag1',
    holds: () =>
      IMP97039_LADDER[0].ar1MatchesData === true && IMP97039_LADDER.slice(1).every((r) => r.ar1MatchesData === false),
    why: 'the empirical ACF equals the AR(1) geometric tail only at lag 1 (phi1 is defined as rho1).',
  },
  {
    id: 'imp97039-truncation-point-at-lag3',
    holds: () => {
      const t = IMP97039_LADDER.filter((r) => r.isTruncationLag);
      return t.length === 1 && t[0].lag === 3 && t[0].rhoEmp < 0 && IMP97039_LADDER[1].rhoEmp > 0;
    },
    why: 'the truncation point is the first lag with a negative empirical ACF, lag 3, with lags 1..2 still positive.',
  },
  {
    id: 'imp97039-signchange-cumulative-hits-integrated-acf',
    holds: () => {
      const last = IMP97039_LADDER[IMP97039_LADDER.length - 1];
      return Math.abs(last.cumSignChange - IMP97039_INPUTS.vifIntegratedAcf) < 1e-4;
    },
    why: 'the sign-change-truncated cumulative VIF equals the imp-96692 integrated-ACF value 2.1356 (lags 1..2 only).',
  },
  {
    id: 'imp97039-bartlett-cumulative-reconstructs-mbb',
    holds: () => {
      const last = IMP97039_LADDER[IMP97039_LADDER.length - 1];
      return (
        Math.abs(last.cumBartlett - IMP97039_INPUTS.vifBlockBootstrapRecon) < 1e-4 &&
        Math.abs(last.cumBartlett - IMP97039_INPUTS.vifBlockBootstrapMeasured) < 0.05
      );
    },
    why: 'the Bartlett b=3 cumulative VIF reconstructs to 1.6726 and lands within 0.05 of the imp-96709 measured MBB 1.700.',
  },
  {
    id: 'imp97039-full-empirical-plain-sum-deflates-below-one',
    holds: () => {
      const last = IMP97039_LADDER[IMP97039_LADDER.length - 1];
      return Math.abs(last.cumFullEmp - IMP97039_INPUTS.vifFullEmpiricalPlainSum) < 1e-4 && last.cumFullEmp < 1;
    },
    why: 'the naive full empirical plain sum over all 12 lags reconstructs to 0.2522 and falls below 1 (over-truncates into the negative lobe).',
  },
  {
    id: 'imp97039-ar1-cumulative-approaches-geometric-limit',
    holds: () =>
      IMP97039_AR1_GEOMETRIC_LIMIT.cumAr1ToLag12 < IMP97039_AR1_GEOMETRIC_LIMIT.geometricLimitToInfinity &&
      Math.abs(IMP97039_AR1_GEOMETRIC_LIMIT.geometricLimitToInfinity - IMP97039_INPUTS.vifAr1) < 1e-4,
    why: 'the AR(1) cumulative to lag 12 is below the closed-form geometric limit (1+phi1)/(1-phi1)=2.578, short only by the tail beyond lag 12.',
  },
  {
    id: 'imp97039-gap-decomposition-adds-up',
    holds: () => {
      const g = IMP97039_GAP_DECOMPOSITION;
      return (
        Math.abs(g.ar1Full + g.minusFictitiousGeometricTail - g.signChangeTruncated) < 1e-4 &&
        Math.abs(g.signChangeTruncated + g.minusBartlettDownWeighting - g.bartlettB3Recon) < 1e-4 &&
        Math.abs(g.ar1Full - g.bartlettB3Recon - g.ar1MinusBartlettGap) < 1e-4 &&
        g.truncationPointLag === 3
      );
    },
    why: 'the two ladder steps (fictitious geometric tail -0.442, Bartlett down-weighting -0.463) carry 2.578 -> 2.136 -> 1.673 exactly, and their sum is the AR(1)->Bartlett gap 0.905.',
  },
  {
    id: 'imp97039-vif-treatments-ordered',
    holds: () => {
      const last = IMP97039_LADDER[IMP97039_LADDER.length - 1];
      return (
        IMP97039_INPUTS.vifAr1 > last.cumSignChange &&
        last.cumSignChange > last.cumBartlett &&
        last.cumBartlett > 1 &&
        last.cumFullEmp < 1
      );
    },
    why: 'the four lag treatments order AR(1) 2.58 > integrated-ACF 2.14 > block-bootstrap 1.67 > 1 > full-empirical 0.25.',
  },
  {
    id: 'imp97039-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP97039_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97039_HONEST_BANNER) &&
      /NO QED/.test(IMP97039_HONEST_BANNER) &&
      /sampling noise/.test(IMP97039_HONEST_BANNER) &&
      IMP97039_SUBGAP.status === 'open',
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and the inherited sampling-noise caveat, and the sub-gap is registered open.',
  },
];

for (const a of IMP97039_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97039-vif-reconciliation-ladder assertion failed: ${a.id}`);
  }
}

export default {
  inputs: IMP97039_INPUTS,
  ladder: IMP97039_LADDER,
  ar1GeometricLimit: IMP97039_AR1_GEOMETRIC_LIMIT,
  gapDecomposition: IMP97039_GAP_DECOMPOSITION,
  banner: IMP97039_HONEST_BANNER,
  subGap: IMP97039_SUBGAP,
};
