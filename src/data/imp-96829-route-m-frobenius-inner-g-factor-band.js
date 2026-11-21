/**
 * @module imp-96829-route-m-frobenius-inner-g-factor-band
 *
 * imp-96829 (numerical, MEASUREMENT ONLY): measure WHERE in the bounded [1, zeta(2)]
 * band the imp-96688 F-route inner-g factor
 *
 *     R(N) := ||G_N||_F^2 / T(N)
 *
 * actually sits across the tabulated rungs, to quantify how tight the coprime-core
 * reduction of the Route M Frobenius second moment is.
 *
 * imp-96688 Result 1 proved the EXACT identity (elementary algebra + Fubini)
 *   ||G_N||_F^2 = Sum_{gcd(a,b)=1} I(a,b)^2/(a^2 b^2) * Sum_{g=1}^{floor(N/max(a,b))} 1/g^2,
 * and Result 2 observed that the per-pair inner factor Sum_{g<=M} 1/g^2 lies in the bounded
 * interval [1, zeta(2)=1.6449] for every pair, so the effective ratio
 * R(N) = ||G_N||_F^2 / T(N) (an I-weighted mean of those per-pair inner factors, with
 * T(N) = Sum_{gcd(a,b)=1, a,b<=N} I(a,b)^2/(a^2 b^2)) must itself lie in [1, zeta(2)]. But
 * NO module had ever MEASURED R(N) at the tabulated rungs -- the [1, zeta(2)] band was a
 * proved envelope, not a located value. The F ~ T reduction is only as tight as R(N) is
 * near a constant. This module locates R(N) using the imp-96684 measured ||G||_F rungs
 * (Frobenius norm, exact matrix quantity on the exact Vasyunin Gram) and the imp-96828
 * measured coprime-core T(N) rungs (exact Vasyunin kernel).
 *
 * No bound is proved; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * MEASUREMENT (common rungs N where BOTH ||G||_F (imp-96684/imp-96648) and T(N)
 * (imp-96828) are tabulated: N = 250,500,1000,2000,3000,4000). R = ||G||_F^2 / T(N),
 * band position = (R-1)/(zeta(2)-1) in [0,1]:
 *   N     ||G||_F^2    T(N)        R=F2/T      band pos    dR (from prev)
 *   250   26.589004    18.133685   1.4662770   0.7230      --
 *   500   30.580874    20.584815   1.4856036   0.7530      +1.933e-2
 *   1000  34.596694    23.038479   1.5016917   0.7779      +1.609e-2
 *   2000  38.626192    25.495803   1.5150020   0.7985      +1.331e-2
 *   3000  40.987146    26.933298   1.5218020   0.8091      +6.800e-3
 *   4000  42.663432    27.953658   1.5262200   0.8159      +4.418e-3
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- R(N) sits in the UPPER band and DRIFTS UP; it does NOT stabilize to a
 * constant over the measured range.
 * -------------------------------------------------------------------------------
 * R(N) rises monotonically 1.4663 -> 1.5262, occupying the upper ~72-82% of the proved
 * envelope [1, zeta(2)] (band position 0.723 -> 0.816). It is well above the lower edge 1
 * and below the ceiling zeta(2)=1.6449, exactly as the imp-96688 identity requires. So the
 * F ~ T reduction is NOT asymptotically exact with factor 1: the effective inner-g factor
 * is a slowly-varying number ~1.5, not a fixed constant, over N <= 4000.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- but R(N) appears to be CONVERGING (slowly) to a limit in the upper band:
 * the increments dR shrink monotonically 1.93e-2 -> 4.42e-3 (a ~4.4x deceleration across
 * the ladder). The drift is toward zeta(2) from below with a decaying step, consistent
 * with the diagonal / small-pair mass -- whose per-pair inner factor -> zeta(2) as N grows
 * (imp-96688 Result 2(i): the a=b=1 term alone -> I(1,1)^2 zeta(2)) -- steadily dominating
 * the I-weighted mean. R does not reach zeta(2) because high-max(a,b) pairs keep entering
 * with per-pair inner factor near 1, holding the weighted mean below the ceiling.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the bounded, slowly-drifting R is the RIGOROUS tie that reconciles the
 * apparent imp-96828 / imp-96688 growth-rate mismatch.
 * -------------------------------------------------------------------------------
 * imp-96828 measured T(N) ~ 3.542 log N (linear-in-log) over N <= 4000, while imp-96688
 * read the imp-96684 fit ||G||_F ~ 2.55 + 0.478 log N as ||G||_F^2 ~ 0.478^2 (log N)^2
 * (quadratic-in-log). Taken naively those are DIFFERENT growth rates -- but the exact
 * identity forces R = ||G||_F^2 / T in [1, zeta(2)] for ALL N, so ||G||_F^2 and T(N)
 * CANNOT have different asymptotic exponents (their ratio would diverge or vanish). The
 * measured bounded R (staying inside the band, drifting only within it) is the finite-N
 * witness of that constraint: the imp-96828 linear-T and imp-96688 quadratic-F^2 fits are
 * two views of ONE finite-N object with a SHARED exponent, not a genuine rate discrepancy.
 * Over the measured window the (log N)^2 leading term of ||G||_F^2 is still sub-dominant to
 * its 2ab log N + a^2 tail, which is exactly why T reads as ~linear here.
 *
 * -------------------------------------------------------------------------------
 * HONEST CAVEAT (finite-N). R(N) is measured only at N <= 4000 (the common reach of the
 * imp-96828 T-ladder; imp-96684 has ||G||_F to N=9000 but imp-96828 stops at 4000). The
 * limiting value of R -- whether it settles below zeta(2) or creeps to it -- is NOT decided
 * by six rungs; the shrinking-increment trend suggests a limit strictly inside the upper
 * band but cannot prove it. What IS rigorous (imp-96688) is R in [1, zeta(2)] for every N;
 * this module only LOCATES the measured value inside that proved envelope.
 *
 * Measurement only; no bound moved; no growth law proved; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-96688-route-m-frobenius-g-factorization-assessment.js (the exact g-factorization identity + [1,zeta(2)] envelope)
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (measured ||G||_F rungs used here)
 * @see imp-96828-coprime-core-vasyunin-second-moment-growth.js (measured T(N) rungs used here)
 * @see imp-96830-... (the uniform coprime-weighted cotangent-sum second moment obstruction)
 *
 * Ticket: imp-96829 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

export const IMP96829_ZETA2 = Math.PI * Math.PI / 6; // 1.6449340668482264

// Measured rungs common to imp-96684 (||G||_F, from the imp-96648 rows) and imp-96828 (T).
// frobenius = ||G_N||_F (exact matrix norm); T = coprime-core Vasyunin second moment.
export const IMP96829_INPUTS = Object.freeze([
  Object.freeze({ N: 250, frobenius: 5.156452701268937, T: 18.133684530438746 }),
  Object.freeze({ N: 500, frobenius: 5.529997674354878, T: 20.584814764399923 }),
  Object.freeze({ N: 1000, frobenius: 5.8818954543089985, T: 23.038479470637625 }),
  Object.freeze({ N: 2000, frobenius: 6.214997339611781, T: 25.49580252308367 }),
  Object.freeze({ N: 3000, frobenius: 6.402120438801899, T: 26.933298313973683 }),
  Object.freeze({ N: 4000, frobenius: 6.5317250252564945, T: 27.953657571026298 }),
]);

// R(N) = ||G_N||_F^2 / T(N); bandPos = (R-1)/(zeta(2)-1) locates R inside [1, zeta(2)].
export const IMP96829_LADDER = Object.freeze(
  IMP96829_INPUTS.map((row) => {
    const frobeniusSq = row.frobenius * row.frobenius;
    const R = frobeniusSq / row.T;
    return Object.freeze({
      N: row.N,
      frobeniusSq,
      T: row.T,
      R,
      bandPos: (R - 1) / (IMP96829_ZETA2 - 1),
    });
  }),
);

// Increment ladder dR (Finding 2: shrinking steps => slow convergence).
export const IMP96829_INCREMENTS = Object.freeze(
  IMP96829_LADDER.slice(1).map((row, i) =>
    Object.freeze({ from: IMP96829_LADDER[i].N, to: row.N, dR: row.R - IMP96829_LADDER[i].R }),
  ),
);

const R_VALUES = IMP96829_LADDER.map((r) => r.R);
export const IMP96829_STATS = Object.freeze({
  Rmin: Math.min(...R_VALUES), // ~1.4663 (N=250)
  Rmax: Math.max(...R_VALUES), // ~1.5262 (N=4000)
  bandPosMin: IMP96829_LADDER[0].bandPos, // ~0.7230
  bandPosMax: IMP96829_LADDER[IMP96829_LADDER.length - 1].bandPos, // ~0.8159
  monotonicIncreasing: R_VALUES.every((v, i) => i === 0 || v > R_VALUES[i - 1]),
  incrementsShrink: IMP96829_INCREMENTS.every(
    (row, i) => i === 0 || row.dR < IMP96829_INCREMENTS[i - 1].dR,
  ),
  allInsideBand: R_VALUES.every((v) => v >= 1 && v <= IMP96829_ZETA2),
  totalDrift: IMP96829_LADDER[IMP96829_LADDER.length - 1].R - IMP96829_LADDER[0].R, // ~0.0599
});

export const IMP96829_VERDICT = Object.freeze({
  question:
    'where in the bounded [1, zeta(2)] band does the imp-96688 F-route inner-g factor ' +
    'R(N) = ||G_N||_F^2 / T(N) actually sit across the tabulated rungs, and does it ' +
    'stabilize to a constant (making the F ~ T reduction asymptotically exact) or drift?',
  bandLocated: 'upper band: R in [1.4663, 1.5262], band position 0.723 -> 0.816 of [1, zeta(2)]',
  stabilizesToConstant: false, // R drifts up monotonically over N <= 4000
  driftsUpward: true,
  incrementsDecelerate: true, // dR 1.93e-2 -> 4.42e-3 (~4.4x), suggesting a slow limit
  limitDecided: false, // six rungs do not pin the limiting value
  reductionTightToBoundedFactor: true, // R ~1.5 bounded, but NOT a fixed constant 1
  anyBoundMoved: false,
  reconcilesLinearVsQuadratic:
    'R bounded in [1, zeta(2)] forces ||G||_F^2 (imp-96688 fit ~quadratic-in-log) and T(N) ' +
    '(imp-96828 measured ~linear-in-log) to share ONE asymptotic exponent -- the apparent ' +
    'mismatch is a finite-N fit artifact, not a real rate difference.',
  conclusion:
    'MEASURED. The effective inner-g factor R(N) = ||G_N||_F^2 / T(N) sits in the UPPER part ' +
    'of the proved [1, zeta(2)] envelope (1.4663 at N=250 -> 1.5262 at N=4000, band position ' +
    '0.72 -> 0.82), rising monotonically toward zeta(2)=1.6449 with SHRINKING increments ' +
    '(dR 1.93e-2 -> 4.42e-3). So the coprime-core reduction ||G||_F^2 ~ T(N) is tight to a ' +
    'bounded factor ~1.5 but is NOT asymptotically exact with factor 1: R drifts, it does not ' +
    'stabilize to a constant over the measured range. The drift stays strictly inside the ' +
    'band, which is the rigorous tie that reconciles the imp-96828 measured-linear T and the ' +
    'imp-96688 fitted-quadratic ||G||_F^2 as one finite-N object with a shared growth ' +
    'exponent. No bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96829_SUBGAP = Object.freeze({
  id: 'imp-96829-inner-g-factor-drifts-upward-limit-undecided',
  statement:
    'the effective inner-g factor R(N) = ||G_N||_F^2 / T(N) is measured in the upper band ' +
    '[1.4663, 1.5262] over N <= 4000, drifting up with decelerating increments, so the F ~ T ' +
    'reduction is bounded but NOT constant. Deciding the limiting value of R (whether it ' +
    'settles strictly below zeta(2) or creeps to it) needs T(N) rungs past N=4000 to match ' +
    'the imp-96684 ||G||_F reach (N=9000), or the uniform coprime-weighted cotangent-sum ' +
    'second moment named in imp-96830. R in [1, zeta(2)] itself is rigorous for all N ' +
    '(imp-96688 Result 2); only its located value and limit are finite-N here.',
});

export const IMP96829_HONEST_BANNER =
  'Measurement only. The effective inner-g factor R(N) = ||G_N||_F^2 / T(N) is LOCATED in ' +
  'the upper part of the proved [1, zeta(2)] envelope (R in [1.4663, 1.5262] over N <= 4000, ' +
  'band position 0.72 -> 0.82), rising monotonically with shrinking increments: the F ~ T ' +
  'reduction is tight to a bounded factor ~1.5 but does NOT stabilize to a constant over the ' +
  'measured range. R in [1, zeta(2)] is rigorous for all N (imp-96688); the located value and ' +
  'its limit are finite-N. No bound moved; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96829_ASSERTIONS = [
  {
    id: 'imp96829-R-recompute-matches-and-inside-band',
    holds: () =>
      IMP96829_LADDER.every((r) => {
        const recomputed = r.frobeniusSq / r.T;
        return (
          Math.abs(r.R - recomputed) < 1e-12 &&
          r.R >= 1 &&
          r.R <= IMP96829_ZETA2 &&
          r.bandPos > 0 &&
          r.bandPos < 1
        );
      }),
    why: 'R(N) = ||G||_F^2 / T recomputes exactly and every rung lies strictly inside the proved [1, zeta(2)] envelope, as the imp-96688 identity requires.',
  },
  {
    id: 'imp96829-R-in-upper-band',
    holds: () =>
      IMP96829_STATS.Rmin > 1.46 &&
      IMP96829_STATS.Rmax < 1.53 &&
      IMP96829_STATS.bandPosMin > 0.72 &&
      IMP96829_STATS.bandPosMax < 0.82,
    why: 'the located inner-g factor sits in the upper ~72-82% of [1, zeta(2)] (R in [1.4663, 1.5262]), well above the lower edge 1 and below zeta(2)=1.6449.',
  },
  {
    id: 'imp96829-R-drifts-up-does-not-stabilize',
    holds: () =>
      IMP96829_STATS.monotonicIncreasing === true &&
      IMP96829_STATS.totalDrift > 0.05 &&
      IMP96829_VERDICT.stabilizesToConstant === false,
    why: 'R rises monotonically by ~0.06 across the ladder -- it drifts upward toward zeta(2), it does NOT stabilize to a constant, so the F ~ T reduction is bounded but not asymptotically exact with factor 1.',
  },
  {
    id: 'imp96829-increments-decelerate',
    holds: () =>
      IMP96829_STATS.incrementsShrink === true &&
      IMP96829_INCREMENTS[0].dR > 4 * IMP96829_INCREMENTS[IMP96829_INCREMENTS.length - 1].dR,
    why: 'the R increments shrink monotonically (dR 1.93e-2 -> 4.42e-3, a ~4.4x deceleration), consistent with a slow convergence to a limit inside the upper band.',
  },
  {
    id: 'imp96829-honesty-gate-no-qed',
    holds: () =>
      IMP96829_VERDICT.anyBoundMoved === false &&
      IMP96829_STATS.allInsideBand === true &&
      /NO QED/.test(IMP96829_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96829_HONEST_BANNER) &&
      /RH open/.test(IMP96829_HONEST_BANNER) &&
      /limit-undecided/.test(IMP96829_SUBGAP.id),
    why: 'measurement only: no bound moved, every rung inside the proved band, the finite-N limit-undecided sub-gap and the honesty markers are present.',
  },
];

for (const a of IMP96829_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96829-route-m-frobenius-inner-g-factor-band assertion failed: ${a.id}`,
    );
  }
}

export default {
  zeta2: IMP96829_ZETA2,
  inputs: IMP96829_INPUTS,
  ladder: IMP96829_LADDER,
  increments: IMP96829_INCREMENTS,
  stats: IMP96829_STATS,
  verdict: IMP96829_VERDICT,
  subGap: IMP96829_SUBGAP,
  banner: IMP96829_HONEST_BANNER,
};
