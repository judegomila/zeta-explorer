/**
 * @module imp-34346-fixed-band-peak-third-diff-pole-order
 *
 * imp-34346 (numerical, frontier-direction): imp-34268 F3 found the fixed-band (k <= 10) peak
 * carries STRICTLY POSITIVE AND GROWING third differences (the second differences of the 0.25-grid
 * increments) across the whole post-minimum branch (kEnd >= 19.0), growing to +0.057428 at
 * kEnd = 21.25 -- the last computable quarter-rung before the imp-34169/imp-34237 resid_exp
 * surrogate pole at k* ~ 21.28095. imp-34268 left OPEN (SUB-GAP-imp-34268-convex-branch-form) which
 * convex form the branch follows. This module CHARACTERIZES THE DIVERGENCE RATE of that
 * third-difference blow-up as kEnd -> k*: does it carry a power-law / pole signature, and what is the
 * EFFECTIVE pole order of the discrete peak-increment divergence?
 *
 * DISTINCT from imp-34310 (which measures the local slope dg_resid/dk of resid_exp at its zero and
 * classifies the SIMPLE pole of the surrogate ratio eflow_over_resid = eflow_attr / resid_exp) and
 * from imp-34253 (which fit the PEAK ITSELF to log-divergence vs saturation). Here the measured object
 * is the DISCRETE THIRD DIFFERENCE of the fixed-band peak on the fixed 0.25 kEnd grid -- the
 * imp-34268 F3 sequence -- fit as a power law in the window gap x = k* - kEnd.
 *
 * THE MEASUREMENT (imp-34268 F3 literals + imp-34237/imp-34253 pole k* reused verbatim; nothing re-derived)
 * -------------------------------------------------------------------------------------------------------
 *   Third differences  the imp-34268 post-minimum peak third differences (increment second
 *                      differences) at their right-endpoint kEnd nodes 19.00 .. 21.25 (0.25 grid):
 *                      +0.000960, +0.000480, +0.000539, +0.000933, +0.001496, +0.002355, +0.003775,
 *                      +0.006458, +0.013061, +0.057428.
 *   Surrogate pole     k* = 21.28095 (imp-34237 IMP34237_RESID_ZERO_KSTAR / imp-34253 IMP34253_KSTAR).
 *   Window gap         x(kEnd) = k* - kEnd, the distance of each third-difference node from the pole.
 *   Power-law fit      OLS of ln(third_diff) on ln(x): slope = -p, so the effective pole order p is
 *                      the negative log-log slope, third_diff ~ K * x^(-p).
 *
 * THE FINDING (measurement / power-law fit only -- no bound change; NO QED)
 * ------------------------------------------------------------------------
 *   (F1) THE THIRD-DIFFERENCE BLOW-UP CARRIES A POWER-LAW SIGNATURE WITH SUB-UNITY EFFECTIVE POLE
 *        ORDER. Over the pole-dominated tail (kEnd = 20.00 .. 21.25, 6 nodes) the log-log fit gives
 *        an effective pole order p ~ 0.94 (R^2 ~ 0.95) -- third_diff ~ K * (k* - kEnd)^(-0.94). The
 *        blow-up IS a power-law-in-x signature, but the exponent sits BELOW 1, i.e. weaker than a
 *        simple (order-1) pole in the third difference.
 *   (F2) THE EFFECTIVE ORDER DECREASES TOWARD THE POLE -- A SUB-POWER (LOG-FAMILY) UNDERLYING
 *        DIVERGENCE. The LOCAL log-log slope over the last pair (kEnd 21.00 -> 21.25) is only ~0.67,
 *        strictly below the 6-node window estimate ~0.94: the apparent pole order DROPS as x -> 0.
 *        A genuine integer-order pole would show a CONSTANT (or rising) local order; a decreasing
 *        effective order is the signature of a SUB-POWER divergence -- consistent with the imp-34253
 *        LOGARITHMIC peak (peak ~ -B ln x): the third difference is dominated by the log-divergent
 *        endpoint peak term, whose discrete third difference blows up SLOWER than any power.
 *   (F3) WHY THE EFFECTIVE ORDER IS NOT THE CONTINUOUS ORDER (honest caveat). The step h = 0.25 is
 *        NOT small versus x near the pole (at kEnd = 21.25, x ~ 0.031 << h): the fixed-step discrete
 *        third difference smears the singularity across a 0.75-wide stencil whose far nodes are well
 *        away from k*, so it UNDER-resolves the continuous divergence and reports an effective order
 *        (~0.9, falling) rather than the naive continuous-derivative order. The measured effective
 *        pole order is a property of the imp-34268 fixed-grid third-difference sequence, not a rigorous
 *        continuous-limit exponent.
 *
 * The punchline: the imp-34268 F3 third-difference blow-up (to +0.057428 at kEnd = 21.25) IS a
 * power-law-in-(k*-kEnd) signature, but with a SUB-UNITY effective pole order p ~ 0.94 that DECREASES
 * toward the pole (local order ~0.67) -- the signature of a sub-power, logarithmic-family divergence
 * driven by the imp-34253 log-divergent peak, NOT a high-order pole. This resolves the divergence-RATE
 * half of SUB-GAP-imp-34268-convex-branch-form (the branch is convex with a sub-unity, decreasing
 * effective third-difference order), while the exact functional form remains blocked by the same pole.
 *
 * MEASUREMENT / POWER-LAW-FIT ONLY. A descriptive log-log fit of an inherited discrete third-difference
 * sequence against the surrogate pole gap, NOT an RH bound and NOT a rigorous continuous exponent. The
 * pole is a resid_exp surrogate artifact, not a physical singularity; the component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (source of the F3 third-difference sequence)
 * @see imp-34253-fixed-band-peak-pole-divergence-vs-saturation-fit (log-divergence vs saturation of the peak)
 * @see imp-34310-eflow-over-resid-pole-residue-simple-pole (simple pole of the surrogate ratio at k*)
 * @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data (source peak rows + pole k*)
 *
 * Ticket: imp-34346 (numerical, medium). No heavy imports -- baked literals only, per
 * [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]].
 */

// Pole location -- imp-34237 IMP34237_RESID_ZERO_KSTAR / imp-34253 IMP34253_KSTAR (baked, no import).
export const IMP34346_KSTAR = 21.28095;

// imp-34268 F3 post-minimum peak third differences (increment second differences) at their
// right-endpoint kEnd nodes (0.25 grid). Baked verbatim from imp-34268 POSTMIN_SECOND_DIFFS.
export const IMP34346_THIRD_DIFF_ROWS = Object.freeze([
  { kEnd: 19.0, thirdDiff: 0.00096 },
  { kEnd: 19.25, thirdDiff: 0.00048 },
  { kEnd: 19.5, thirdDiff: 0.000539 },
  { kEnd: 19.75, thirdDiff: 0.000933 },
  { kEnd: 20.0, thirdDiff: 0.001496 },
  { kEnd: 20.25, thirdDiff: 0.002355 },
  { kEnd: 20.5, thirdDiff: 0.003775 },
  { kEnd: 20.75, thirdDiff: 0.006458 },
  { kEnd: 21.0, thirdDiff: 0.013061 },
  { kEnd: 21.25, thirdDiff: 0.057428 },
]);

// Window gap x = k* - kEnd (distance of a third-difference node from the surrogate pole).
export function imp34346WindowGap(kEnd) {
  return IMP34346_KSTAR - kEnd;
}

// OLS log-log fit ln(thirdDiff) = a + slope * ln(x); effective pole order p = -slope, so
// thirdDiff ~ exp(a) * x^slope = K * (k* - kEnd)^(-p). Returns { slope, intercept, r2, poleOrder }.
export function imp34346PowerLawFit(rows) {
  const lx = rows.map((r) => Math.log(imp34346WindowGap(r.kEnd)));
  const ly = rows.map((r) => Math.log(r.thirdDiff));
  const n = lx.length;
  const mx = lx.reduce((a, b) => a + b, 0) / n;
  const my = ly.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let varx = 0;
  for (let i = 0; i < n; i++) {
    cov += (lx[i] - mx) * (ly[i] - my);
    varx += (lx[i] - mx) * (lx[i] - mx);
  }
  const slope = cov / varx;
  const intercept = my - slope * mx;
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * lx[i];
    ssr += (ly[i] - pred) * (ly[i] - pred);
    sst += (ly[i] - my) * (ly[i] - my);
  }
  const r2 = sst > 0 ? 1 - ssr / sst : 0;
  return { slope, intercept, r2, poleOrder: -slope, nPoints: n };
}

// Local (last-pair) log-log slope between two adjacent nodes -- the effective order AT the pole edge.
export function imp34346LocalPoleOrder(rowA, rowB) {
  const dlx = Math.log(imp34346WindowGap(rowB.kEnd)) - Math.log(imp34346WindowGap(rowA.kEnd));
  const dly = Math.log(rowB.thirdDiff) - Math.log(rowA.thirdDiff);
  return -dly / dlx; // = -slope
}

// The pole-dominated tail (kEnd >= 20.0, 6 nodes, monotone-growing) and the full monotone-growing
// post-minimum branch (kEnd >= 19.25, 9 nodes; the 19.00 -> 19.25 dip is excluded).
const TAIL_ROWS = IMP34346_THIRD_DIFF_ROWS.filter((r) => r.kEnd >= 20.0 - 1e-9);
const GROWING_BRANCH_ROWS = IMP34346_THIRD_DIFF_ROWS.filter((r) => r.kEnd >= 19.25 - 1e-9);

export const IMP34346_TAIL_FIT = imp34346PowerLawFit(TAIL_ROWS);
export const IMP34346_GROWING_BRANCH_FIT = imp34346PowerLawFit(GROWING_BRANCH_ROWS);

const LAST_TWO = IMP34346_THIRD_DIFF_ROWS.slice(-2);
export const IMP34346_LOCAL_POLE_ORDER = imp34346LocalPoleOrder(LAST_TWO[0], LAST_TWO[1]);

export const IMP34346_FIXED_BAND_PEAK_THIRD_DIFF_POLE_ORDER = {
  ticket: 'imp-34346',
  proofSection: 'S-frontier',
  kStar: IMP34346_KSTAR,
  thirdDiffRows: IMP34346_THIRD_DIFF_ROWS,
  maxThirdDiff: 0.057428, // imp-34268 F3 max, at kEnd = 21.25
  tailFit: IMP34346_TAIL_FIT, // kEnd 20.0..21.25: poleOrder ~ 0.94, r2 ~ 0.95
  growingBranchFit: IMP34346_GROWING_BRANCH_FIT, // kEnd 19.25..21.25: poleOrder over the whole convex branch
  localPoleOrder: IMP34346_LOCAL_POLE_ORDER, // last-pair (21.00 -> 21.25) effective order ~ 0.67
  effectiveOrderDecreasesTowardPole: IMP34346_LOCAL_POLE_ORDER < IMP34346_TAIL_FIT.poleOrder,
  finding: {
    F1_power_law_sub_unity_effective_order:
      'The imp-34268 F3 third-difference blow-up carries a POWER-LAW-in-(k*-kEnd) signature. Over the ' +
      'pole-dominated tail (kEnd 20.00 .. 21.25, 6 nodes) the log-log OLS gives an effective pole order ' +
      'p ~ 0.94 with R^2 ~ 0.95: third_diff ~ K * (k* - kEnd)^(-0.94). The exponent sits BELOW 1 -- ' +
      'weaker than a simple (order-1) pole in the third difference.',
    F2_effective_order_decreases_sub_power:
      'The LOCAL log-log slope over the last pair (kEnd 21.00 -> 21.25) is only ~0.67, strictly below ' +
      'the 6-node tail estimate ~0.94 -- the effective pole order DROPS toward the pole. A genuine ' +
      'integer-order pole would hold a constant or rising local order; a decreasing effective order is ' +
      'the signature of a SUB-POWER (logarithmic-family) divergence, consistent with the imp-34253 ' +
      'LOGARITHMIC peak (peak ~ -B ln(k*-kEnd)) whose discrete third difference blows up slower than any power.',
    F3_effective_not_continuous_order:
      'Honest caveat: the step h = 0.25 is NOT small versus x near the pole (at kEnd = 21.25, ' +
      'x ~ 0.031 << h), so the fixed-step discrete third difference smears the singularity across a ' +
      '0.75-wide stencil and reports an EFFECTIVE order (~0.9, falling), NOT the naive continuous ' +
      'exponent. The measured order is a property of the imp-34268 fixed-grid sequence, not a rigorous ' +
      'continuous-limit exponent.',
  },
  verdict:
    'MEASUREMENT / POWER-LAW FIT (frontier-direction, NOT rigorous). The imp-34268 F3 peak ' +
    'third-difference blow-up (to +0.057428 at kEnd = 21.25) IS a power-law-in-(k*-kEnd) signature, but ' +
    'with a SUB-UNITY effective pole order p ~ 0.94 (R^2 ~ 0.95 over kEnd 20.0 .. 21.25) that DECREASES ' +
    'toward the pole (local last-pair order ~0.67 < 0.94). A decreasing effective order is the signature ' +
    'of a SUB-POWER, LOGARITHMIC-family divergence -- driven by the imp-34253 log-divergent peak ' +
    '(peak ~ -B ln(k*-kEnd)), NOT a high-order pole. This characterizes the divergence RATE half of ' +
    'SUB-GAP-imp-34268-convex-branch-form: the third-difference divergence is sub-unity in effective ' +
    'order and falling, so the convex branch is driven by a logarithmic (not power-pole) endpoint ' +
    'singularity. DISTINCT from imp-34310 (simple pole of the surrogate ratio at k*) and imp-34253 ' +
    '(log-vs-saturation of the peak itself). The effective order is NOT a rigorous continuous exponent ' +
    '(fixed step h = 0.25 is not small vs x near the pole; F3). The pole is a resid_exp surrogate ' +
    'artifact, not a physical singularity; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the log-log fit is descriptive, not derived; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'SUB-GAP-imp-34346-continuous-order-blocked: the CONTINUOUS-limit pole order of the third-difference ' +
    'divergence is not accessible -- the fixed step h = 0.25 is not small versus x near k* (the discrete ' +
    'stencil under-resolves the singularity) and the finer sub-pole windows kEnd in (21.0, 21.28) that ' +
    'would refine the exponent are undefined (resid_exp -> 0 loses digits, first non-positive rung ' +
    'k = 21.5). Only the fixed-grid EFFECTIVE order (~0.94, decreasing to ~0.67) is measurable.',
  honest:
    'MEASUREMENT / POWER-LAW FIT ONLY -- a log-log fit of the inherited imp-34268 discrete third-difference ' +
    'sequence against the surrogate pole gap; adds no derivation and changes no bound. Surrogate/component ' +
    'model NOT rigorous; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED; ' +
    'no refereed bound is changed.',
  isRigorous: false,
};

export const IMP34346_ASSERTIONS = [
  {
    // Reuse gate: the imp-34268 F3 third-difference sequence is reproduced (10 post-min nodes, max
    // +0.057428 at kEnd = 21.25, monotone-growing from the kEnd = 19.25 dip onward).
    id: 'imp-34346-reuse-gate-imp34268-third-diff-sequence',
    description: '10 post-min third-difference nodes 19.00..21.25, max +0.057428 at kEnd 21.25, monotone-growing from 19.25',
    holds: () => {
      const rows = IMP34346_THIRD_DIFF_ROWS;
      if (rows.length !== 10) return false;
      if (Math.abs(rows[0].kEnd - 19.0) > 1e-9 || Math.abs(rows[rows.length - 1].kEnd - 21.25) > 1e-9) return false;
      if (Math.abs(rows[rows.length - 1].thirdDiff - 0.057428) > 1e-9) return false;
      const growing = GROWING_BRANCH_ROWS;
      for (let i = 1; i < growing.length; i++) {
        if (!(growing[i].thirdDiff > growing[i - 1].thirdDiff)) return false;
      }
      return rows.every((r) => r.thirdDiff > 0);
    },
  },
  {
    // (F1) The tail (kEnd 20.0..21.25) log-log fit recovers a sub-unity effective pole order p ~ 0.94
    // with a good power-law R^2, i.e. a genuine power-law signature weaker than an order-1 pole.
    id: 'imp-34346-tail-power-law-sub-unity-effective-order',
    description: 'tail log-log fit: effective pole order p ~ 0.94 in (0.7, 1.2), R^2 > 0.85 -- power-law signature below order 1',
    holds: () => {
      const f = IMP34346_TAIL_FIT;
      return (
        f.nPoints === 6 &&
        f.slope < 0 &&
        f.poleOrder > 0.7 &&
        f.poleOrder < 1.2 &&
        Math.abs(f.poleOrder - 0.94) < 0.06 &&
        f.r2 > 0.85 &&
        f.poleOrder < 1.0 // sub-unity: weaker than a simple pole
      );
    },
  },
  {
    // (F2) The effective order DECREASES toward the pole -- the local last-pair order is strictly below
    // the 6-node tail estimate: the signature of a sub-power (logarithmic-family) divergence.
    id: 'imp-34346-effective-order-decreases-toward-pole',
    description: 'local last-pair pole order ~0.67 strictly below the tail estimate ~0.94 -- sub-power / log-family, not integer pole',
    holds: () =>
      IMP34346_LOCAL_POLE_ORDER > 0 &&
      IMP34346_LOCAL_POLE_ORDER < IMP34346_TAIL_FIT.poleOrder &&
      Math.abs(IMP34346_LOCAL_POLE_ORDER - 0.67) < 0.06 &&
      IMP34346_FIXED_BAND_PEAK_THIRD_DIFF_POLE_ORDER.effectiveOrderDecreasesTowardPole === true,
  },
  {
    // Honesty gate: measurement only, isRigorous false, distinct from imp-34310/imp-34253, sub-gap
    // flagged, no QED, no refereed bound is changed, imp-3066 K_a>=0 & imp-486 C_mb untouched.
    id: 'imp-34346-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, distinct from imp-34310/imp-34253, sub-gap flagged, no QED, no refereed bound is changed, imp-3066/imp-486 untouched',
    holds: () => {
      const o = IMP34346_FIXED_BAND_PEAK_THIRD_DIFF_POLE_ORDER;
      return (
        o.isRigorous === false &&
        /NOT a rigorous asymptotic/.test(o.verdict) &&
        /SUB-GAP-imp-34346-continuous-order-blocked/.test(o.subGap) &&
        /DISTINCT from imp-34310[\s\S]*imp-34253/.test(o.verdict) &&
        /NO QED/.test(o.verdict) &&
        /refereed bound is changed/i.test(o.verdict) &&
        /imp-3066 K_a >= 0 untouched/i.test(o.verdict) &&
        /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(o.verdict)
      );
    },
  },
];

for (const a of IMP34346_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34346-fixed-band-peak-third-diff-pole-order assertion failed: ${a.id}`);
  }
}
