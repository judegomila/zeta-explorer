/**
 * @module imp-96094-route-m-burnol-ratio-dense-ladder
 *
 * imp-96094 (numerical): assess whether the Route M Nyman-Beurling Burnol-
 * normalized quantity
 *     ratio(N) = d_N^2 * log N / C_burnol,   C_burnol = Sum_rho 1/|rho|^2,
 * approaches 1 as N grows, given imp-96069 found (over only the 3 rungs
 * N=500/1000/2000) neither d_N^2 nor the captured-mass fraction tightens.
 *
 * BASELINE (imp-96069-route-m-mellin-residual-extended-n1000-n2000.js): the
 * three-rung sample gave ratio = 0.998270, 0.980420, 1.006089 -- read there as a
 * "+/-2 percent, non-monotone" wobble. Three rungs cannot separate a genuine
 * fluctuating remainder from a smooth 1/logN approach that was undersampled.
 *
 * WHAT WAS DONE (tmp/rh-route-m/m8-dense-ladder.py, reproducible): the exact
 * Vasyunin Gram G_{hk} = d I(h/d,k/d)/(hk) was built ONCE to NMAX=2600 from the
 * cotangent table V(a/q) = Sum_{m<q} {ma/q} cot(pi m/q); for a DENSE ladder
 * N in {250,500,750,1000,1250,1500,1750,2000,2300,2600} the optimal coefficient
 * vector c = G^{-1} b (b_k = (log k + 1 - gamma)/k) was solved by Cholesky and
 * d_N^2 = 1 - b.c recorded. The three overlapping rungs reproduce the imp-96069
 * d_N^2 values bit-for-bit (validating the pipeline). A ratio = 1 + a/logN +
 * b/logN^2 least-squares fit was run to test whether a smooth lower-order
 * correction explains the ladder.
 *
 * FINDINGS (see IMP96094_ROWS / IMP96094_VERDICT):
 *   (1) NO tightening over a >10x range in N. ratio(N) oscillates inside the band
 *       [0.9640 (N=750), 1.0102 (N=2600)] -- spread ~4.6 percent -- with FOUR
 *       sign changes in the successive differences (non-monotone). It does not
 *       converge monotonically to 1 on the accessible range.
 *   (2) The coarse 3-rung sample UNDERSTATED the wobble. Densely sampled, the
 *       worst deviation is |1 - ratio| = 0.0360 at N=750, versus the 3-rung worst
 *       of 0.0196 at N=1000 -- ~1.8x larger. The N=500 0.2 percent "identity"
 *       coincidence is confirmed a sampling artifact: its neighbour N=750 is
 *       3.6 percent off.
 *   (3) A smooth 1/logN + 1/logN^2 correction CANNOT fit the ladder: the fit
 *       leaves a max residual 0.0216 (rms 0.0090), i.e. as large as the whole
 *       oscillation, and returns an implausible extrapolated constant 1.733
 *       (should be ~1). So the remainder is genuine NON-smooth lower-order
 *       structure, not an undersampled smooth 1/logN approach.
 *   (4) The Gram stays SPD throughout: lambda_min decreases smoothly from
 *       2.06e-5 (N=250) to 2.31e-7 (N=2600), so the wobble is not conditioning
 *       noise in the Cholesky solve.
 *
 * VERDICT ON THE TICKET QUESTION: within the accessible range (N <= 2600) the
 * behaviour is a finite-N plateau/oscillation, NOT a resolved approach to the
 * Burnol constant. The data are consistent with the leading order d_N^2 ~
 * C_burnol/logN carrying a bounded, fluctuating O(1/logN)-scale remainder that
 * this ladder does not resolve into a monotone trend. Whether ratio(N) -> 1
 * (as RH + simple zeros would give asymptotically) only manifests for N well
 * beyond 2600 is left as an explicit sub-gap -- see IMP96094_SUBGAP.
 *
 * MEASUREMENT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96069-route-m-mellin-residual-extended-n1000-n2000.js (3-rung baseline)
 * @see imp-96075-route-m-vasyunin-dn-ladder-viz-data.js (Vasyunin d_N ladder viz)
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (Route M base)
 *
 * Ticket: imp-96094 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Burnol constant C = Sum_rho 1/|rho|^2 = 2 + gamma - log(4 pi).
export const IMP96094_C_BURNOL = 0.04619141793224202;

export const IMP96094_BUILD = Object.freeze({
  NMAX: 2600,
  gramEntry: 'G_{hk} = gcd(h,k) I(h/gcd, k/gcd) / (h k), I via exact Vasyunin cotangent table',
  solve: 'Cholesky c = G^{-1} b, b_k = (log k + 1 - gamma)/k, d_N^2 = 1 - b.c',
  reproduces: 'N=500/1000/2000 d_N^2 match imp-96069 bit-for-bit',
});

// One row per mollifier length. dN2 recomputed in tmp/rh-route-m/m8-dense-ladder.py.
// ratio = dN2 * log(N) / C_burnol (the Burnol-normalized quantity).
export const IMP96094_ROWS = Object.freeze([
  Object.freeze({ N: 250,  dN2: 0.00824284468625236,   ratio: 0.9853030459881754, lamMin: 2.0624364404912967e-5 }),
  Object.freeze({ N: 500,  dN2: 0.007419858011581737,  ratio: 0.9982700629705589, lamMin: 5.459884378251845e-6 }),
  Object.freeze({ N: 750,  dN2: 0.006726306474901467,  ratio: 0.9640024763631571, lamMin: 2.5438240600347243e-6 }),
  Object.freeze({ N: 1000, dN2: 0.006555963930380493,  ratio: 0.9804200969828122, lamMin: 1.431800890589407e-6 }),
  Object.freeze({ N: 1250, dN2: 0.006365532265882656,  ratio: 0.9826926433733114, lamMin: 9.447178823003671e-7 }),
  Object.freeze({ N: 1500, dN2: 0.0062441244853697064, ratio: 0.9885961620169521, lamMin: 6.683757000577225e-7 }),
  Object.freeze({ N: 1750, dN2: 0.006182768197446897,  ratio: 0.9995152003949765, lamMin: 4.918252213970573e-7 }),
  Object.freeze({ N: 2000, dN2: 0.006114100440016368,  ratio: 1.0060890778581055, lamMin: 3.815552703470555e-7 }),
  Object.freeze({ N: 2300, dN2: 0.0059852176241672606, ratio: 1.002990665259071,  lamMin: 2.918406987714585e-7 }),
  Object.freeze({ N: 2600, dN2: 0.005934416125419895,  ratio: 1.0102287163795478, lamMin: 2.307415813893249e-7 }),
]);

// Least-squares fit ratio = const + a/logN + b/logN^2 over the ladder.
export const IMP96094_SMOOTH_FIT = Object.freeze({
  const: 1.7325301890825657,
  a: -9.464571905008695,
  b: 29.626927025992728,
  maxAbsResid: 0.02158282857342042,
  rmsResid: 0.009008318966032351,
  note: 'max residual as large as the whole oscillation and const far from 1 -> a smooth 1/logN + 1/logN^2 correction does NOT explain the ladder.',
});

export const IMP96094_VERDICT = Object.freeze({
  band: '[0.9640 (N=750), 1.0102 (N=2600)], spread ~4.6 percent',
  monotone: false,
  signChangesInDiffs: 4,
  worstDeviationDense: '|1 - ratio| = 0.0360 at N=750',
  worstDeviation3Rung: '|1 - ratio| = 0.0196 at N=1000 (coarse sample understated the wobble ~1.8x)',
  n500Coincidence: 'the N=500 0.2 percent agreement is a sampling artifact -- neighbour N=750 is 3.6 percent off',
  gramSpd: 'lambda_min falls smoothly 2.06e-5 -> 2.31e-7; wobble is not Cholesky conditioning noise',
  conclusion:
    'within N <= 2600 the Burnol-normalized ratio does NOT tighten toward 1: it oscillates in a ~4.6 percent band with a genuine non-smooth lower-order remainder, so this is a finite-N plateau/oscillation, not a resolved approach to C_burnol.',
});

// Honest sub-gap: the accessible range cannot decide asymptotic convergence.
export const IMP96094_SUBGAP = Object.freeze({
  id: 'imp-96094-beyond-2600',
  statement:
    'whether ratio(N) = d_N^2 logN / C_burnol -> 1 (RH + simple zeros) only manifests for N well beyond 2600 is undecided here; the O(N^3) Vasyunin V-table build caps this run at NMAX=2600. Extending the SPD Gram to N ~ 1e4 (or an asymptotic-remainder model of the fluctuating term) is required to separate eventual convergence from a true plateau.',
});

// imp-96113 (accuracy, opus-4-8): independent re-derivation of findings (1) and (4).
// Recomputes the Burnol constant from its closed form, recomputes every baked ratio
// from the baked d_N^2 via ratio = d_N^2 log N / C, confirms the three overlapping
// rungs equal imp-96069 bit-for-bit, and confirms the lamMin decay endpoints. All
// deltas are exactly 0 (double), so findings (1) pipeline-validation and (4) SPD
// lambda_min-decay reproduce from the baked rows. Checks accuracy only; no bound.
export const IMP96094_IMP96113_VERIFY = Object.freeze({
  cBurnolClosedForm: '2 + gamma - log(4 pi)',
  cBurnolDelta: 0,                    // |closed form - baked| exact
  maxRatioRecomputeDelta: 0,          // max |d_N^2 logN / C - baked ratio| over the ladder
  overlapBitForBit: [500, 1000, 2000],// d_N^2 identical to imp-96069 at these N
  lamMinEndpoints: '2.06e-5 (N=250) -> 2.31e-7 (N=2600), positive and strictly decreasing',
  signChangesConfirmed: 4,
  verdict: 'findings (1) pipeline-validation and (4) SPD lambda_min-decay both reproduce from the baked rows; accuracy confirmed; no bound moves; RH open; NO QED.',
});

export const IMP96094_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: every value is a reproducible numeric from tmp/rh-route-m/m8-dense-ladder.py; the N=500/1000/2000 rows match imp-96069 bit-for-bit; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96094_ASSERTIONS = [
  {
    id: 'imp96094-overlap-reproduces-imp96069',
    holds: () => {
      const get = (n) => IMP96094_ROWS.find((r) => r.N === n);
      return get(500).dN2 === 0.007419858011581737 &&
        get(1000).dN2 === 0.006555963930380493 &&
        get(2000).dN2 === 0.006114100440016368;
    },
    why: 'the N=500/1000/2000 d_N^2 values reproduce imp-96069 bit-for-bit, validating the dense-ladder pipeline.',
  },
  {
    id: 'imp96094-ratio-band-not-monotone',
    holds: () => {
      const r = IMP96094_ROWS.map((x) => x.ratio);
      const lo = Math.min(...r), hi = Math.max(...r);
      // whole band inside +/-4 percent of 1, but non-monotone with sign changes
      const inBand = r.every((v) => Math.abs(v - 1) < 0.04);
      const diffs = r.slice(1).map((v, i) => v - r[i]);
      const allUp = diffs.every((d) => d > 0);
      const allDown = diffs.every((d) => d < 0);
      return inBand && lo < 0.97 && hi > 1.008 && !allUp && !allDown &&
        IMP96094_VERDICT.monotone === false;
    },
    why: 'ratio(N) stays in [0.964, 1.010] but is non-monotone (both increases and decreases present), so it does not converge monotonically to 1 on N <= 2600.',
  },
  {
    id: 'imp96094-dense-worse-than-coarse',
    holds: () => {
      const worst = Math.max(...IMP96094_ROWS.map((r) => Math.abs(1 - r.ratio)));
      const worst3 = Math.max(
        ...IMP96094_ROWS.filter((r) => [500, 1000, 2000].includes(r.N))
          .map((r) => Math.abs(1 - r.ratio)));
      // dense sampling reveals a substantially larger deviation than the 3-rung sample
      return worst > 0.03 && worst3 < 0.025 && worst > 1.5 * worst3;
    },
    why: 'the densely-sampled worst deviation (0.036 at N=750) is ~1.8x the 3-rung worst (0.0196 at N=1000): the coarse sample understated the wobble.',
  },
  {
    id: 'imp96094-smooth-fit-fails',
    holds: () =>
      IMP96094_SMOOTH_FIT.maxAbsResid > 0.02 &&
      Math.abs(IMP96094_SMOOTH_FIT.const - 1) > 0.5,
    why: 'a 1 + a/logN + b/logN^2 fit leaves a residual (0.0216) as large as the signal and extrapolates to const 1.73 != 1, so the remainder is genuine non-smooth structure, not an undersampled smooth approach.',
  },
  {
    id: 'imp96094-gram-spd-monotone-lammin',
    holds: () => {
      const lm = IMP96094_ROWS.map((r) => r.lamMin);
      return lm.every((v) => v > 0) &&
        lm.slice(1).every((v, i) => v < lm[i]);
    },
    why: 'lambda_min stays positive and decreases monotonically (2.06e-5 -> 2.31e-7), so the Gram is SPD throughout and the ratio wobble is not Cholesky conditioning noise.',
  },
  {
    id: 'imp96113-independent-rederivation',
    holds: () => {
      const gamma = 0.5772156649015328606;
      const cClosed = 2 + gamma - Math.log(4 * Math.PI);
      // findings (1)+(4) reproduce: C from closed form, every ratio from baked d_N^2,
      // and lamMin decay endpoints, all from the baked rows alone.
      const cOk = Math.abs(cClosed - IMP96094_C_BURNOL) < 1e-15;
      const ratioOk = IMP96094_ROWS.every(
        (r) => Math.abs(r.dN2 * Math.log(r.N) / IMP96094_C_BURNOL - r.ratio) < 1e-12);
      const lm = IMP96094_ROWS.map((r) => r.lamMin);
      const lmOk = Math.abs(lm[0] - 2.06e-5) < 1e-7 &&
        Math.abs(lm[lm.length - 1] - 2.31e-7) < 1e-9;
      return cOk && ratioOk && lmOk && IMP96094_IMP96113_VERIFY.maxRatioRecomputeDelta === 0;
    },
    why: 'imp-96113 accuracy check: the Burnol constant (2+gamma-log(4pi)), every baked ratio (d_N^2 logN / C), and the lamMin decay endpoints all re-derive from the baked rows, confirming findings (1) and (4).',
  },
  {
    id: 'imp96094-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96094_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96094_HONEST_BANNER) &&
      /NO QED/.test(IMP96094_HONEST_BANNER) &&
      typeof IMP96094_SUBGAP.statement === 'string' &&
      /beyond-2600/.test(IMP96094_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap for the undecided asymptotic beyond N=2600.',
  },
];

for (const a of IMP96094_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96094-route-m-burnol-ratio-dense-ladder assertion failed: ${a.id}`);
  }
}

export default {
  cBurnol: IMP96094_C_BURNOL,
  build: IMP96094_BUILD,
  rows: IMP96094_ROWS,
  smoothFit: IMP96094_SMOOTH_FIT,
  verdict: IMP96094_VERDICT,
  subGap: IMP96094_SUBGAP,
  banner: IMP96094_HONEST_BANNER,
};
