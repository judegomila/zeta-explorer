/**
 * @module imp-96595-route-m-lammin-certified-rungs-full-ladder
 *
 * imp-96595 (numerical, REPRODUCTION / CHECK ONLY): reproduce the imp-96563 FINDING 1
 * IMP96563_CERTIFIED_RUNGS verified-Cholesky (Higham/Rump) enclosure across the FULL
 * imp-96428 lam_min ladder (all 12 measured rungs N=250..10000, not just the 4 rungs
 * spot-listed in imp-96563), as a standalone reproducible artifact.
 *
 * imp-96563 FINDING 1 converts the double-precision lam_min MEASUREMENTS into rigorous
 * lower enclosures via the classical Higham (Cholesky backward error) / Rump (verified
 * positive-definiteness) bound: if a floating-point Cholesky of G_N - s I completes then
 * G_N - s I + Delta is PSD with |Delta_ij| <= g_{n+1} sqrt(G_ii G_jj), g_{n+1} =
 * (n+1)u/(1-(n+1)u), u = eps/2, whence in 2-norm
 *
 *     ||Delta||_2 <= ||Delta||_F <= g_{n+1} trace(G_N) = g_{n+1} I(1,1) H_N =: delta(N).
 *
 * Choosing s = lam_min_measured - delta(N) and observing the Cholesky completes CERTIFIES
 * lam_min(G_N) >= s. imp-96563 quoted delta = 2.14e-13 at N=250, 7.79e-12 at N=6000,
 * 1.37e-11 at N=1e4, hence delta/lam_min < 8e-4 at N=1e4. This module recomputes delta(N)
 * and the enclosure ratio delta/lam_min INDEPENDENTLY from the carried inputs (the
 * self-contained formula below, not by importing imp-96563), across every rung of the
 * imp-96428 ladder, and cross-checks the three spot values against the imp-96563 record.
 *
 * RESULT: the three spot values reproduce to the leading digits quoted (2.142e-13,
 * 7.792e-12, 1.370e-11), delta/lam_min = 7.84e-4 < 8e-4 at N=1e4, and ALL 12 rungs are
 * certifiable (certified lower bound > 0), with the enclosure ratio growing monotonically
 * from 1.04e-8 at N=250 to 7.84e-4 at N=1e4 -- the accessible ladder is fully certified
 * with a rounding shift under 8e-4 of lam_min throughout.
 *
 * This changes NO bound, establishes no operator positivity, makes no RH claim, and rebuilds
 * no Gram. It is a standalone recomputation of the imp-96428 / imp-96563 numbers plus the
 * standard verified-linear-algebra facts. No refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96563-route-m-lammin-rigorous-lower-bound-assessment.js (FINDING 1 table reproduced here)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (the 12-rung measured lam_min ladder)
 * @see imp-96591-route-m-lammin-cert-limit-crossover-measurement.js (double-precision cert-limit crossover)
 *
 * Ticket: imp-96595 (numerical, opus-4-8, api-pool). Reproduction / check only; NO QED.
 */

// Inputs carried verbatim (imp-96563 IMP96563_INPUTS + imp-96428 IMP96428_LAMMIN_ROWS)
// so this artifact recomputes standalone, without importing either module.
export const IMP96595_INPUTS = Object.freeze({
  eps: 2.220446049250313e-16, // double-precision machine epsilon
  u: 1.1102230246251565e-16, // unit roundoff eps/2
  i11: 1.2606614015078126, // Gram diagonal numerator I(1,1); trace(G_N) = I(1,1) H_N
  gamma: 0.5772156649015329, // Euler-Mascheroni; H_N ~ log N + gamma
});

// H_N approximated by log N + gamma; trace(G_N) = I(1,1) H_N (the imp-96548 rigorous lam_max bound too).
function traceBound(N) {
  return IMP96595_INPUTS.i11 * (Math.log(N) + IMP96595_INPUTS.gamma);
}
// Higham/Rump Cholesky backward-error 2-norm bound: delta(N) = g_{n+1} trace(G_N),
// g_{n+1} = (n+1)u/(1-(n+1)u). Independent re-implementation of the imp-96563 formula.
function choleskyRoundingShift(N) {
  const x = (N + 1) * IMP96595_INPUTS.u;
  const g = x / (1 - x);
  return g * traceBound(N);
}

// The FULL imp-96428 lam_min ladder (IMP96428_LAMMIN_ROWS, 12 measured rungs).
const LAMMIN_LADDER = Object.freeze([
  Object.freeze({ N: 250, lamMinMeasured: 2.06e-5 }),
  Object.freeze({ N: 3000, lamMinMeasured: 1.7603246535995948e-7 }),
  Object.freeze({ N: 3500, lamMinMeasured: 1.3110357936852896e-7 }),
  Object.freeze({ N: 4000, lamMinMeasured: 9.990947269105856e-8 }),
  Object.freeze({ N: 4500, lamMinMeasured: 8.127160411035654e-8 }),
  Object.freeze({ N: 5000, lamMinMeasured: 6.56754131662765e-8 }),
  Object.freeze({ N: 5500, lamMinMeasured: 5.446040156899344e-8 }),
  Object.freeze({ N: 6000, lamMinMeasured: 4.694983880281018e-8 }),
  Object.freeze({ N: 7000, lamMinMeasured: 3.4682763044531355e-8 }),
  Object.freeze({ N: 8000, lamMinMeasured: 2.6401525380046092e-8 }),
  Object.freeze({ N: 9000, lamMinMeasured: 2.1420528627612423e-8 }),
  Object.freeze({ N: 10000, lamMinMeasured: 1.7470544295391648e-8 }),
]);

// Reproduced per-rung certified lower bounds across the full ladder.
export const IMP96595_CERTIFIED_RUNGS = Object.freeze(
  LAMMIN_LADDER.map((r) => {
    const shift = choleskyRoundingShift(r.N);
    const certifiedLowerBound = r.lamMinMeasured - shift;
    return Object.freeze({
      N: r.N,
      lamMinMeasured: r.lamMinMeasured,
      choleskyRoundingShift: shift,
      shiftOverLamMin: shift / r.lamMinMeasured,
      certifiedLowerBound,
      certifiable: certifiedLowerBound > 0,
    });
  }),
);

// Cross-check the three spot values imp-96563 quoted (2.14e-13, 7.79e-12, 1.37e-11).
const rungAt = (N) => IMP96595_CERTIFIED_RUNGS.find((r) => r.N === N);
export const IMP96595_CROSSCHECK = Object.freeze({
  spotValues: Object.freeze([
    Object.freeze({ N: 250, deltaReproduced: rungAt(250).choleskyRoundingShift, deltaQuoted: 2.14e-13 }),
    Object.freeze({ N: 6000, deltaReproduced: rungAt(6000).choleskyRoundingShift, deltaQuoted: 7.79e-12 }),
    Object.freeze({ N: 10000, deltaReproduced: rungAt(10000).choleskyRoundingShift, deltaQuoted: 1.37e-11 }),
  ]),
  shiftOverLamMinAt1e4: rungAt(10000).shiftOverLamMin, // ~7.84e-4 < 8e-4
  certifiedLowerBoundAt1e4: rungAt(10000).certifiedLowerBound, // ~1.7457e-8
  allRungsCertifiable: IMP96595_CERTIFIED_RUNGS.every((r) => r.certifiable),
  shiftOverLamMinMonotoneUp: IMP96595_CERTIFIED_RUNGS.every(
    (r, i, a) => i === 0 || a[i].shiftOverLamMin > a[i - 1].shiftOverLamMin,
  ),
  note:
    'independent recomputation reproduces the imp-96563 delta(N) spot values (2.142e-13, ' +
    '7.792e-12, 1.370e-11) and delta/lam_min = 7.84e-4 < 8e-4 at N=1e4; all 12 imp-96428 rungs ' +
    'are certifiable with the enclosure ratio growing monotonically from 1.04e-8 (N=250) to ' +
    '7.84e-4 (N=1e4).',
});

export const IMP96595_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Reproduction only: this recomputes the ' +
  'imp-96563 FINDING 1 verified-Cholesky (Higham/Rump backward error) enclosure across the full ' +
  'imp-96428 lam_min ladder from carried inputs. No Gram was rebuilt, no bound is claimed moved, ' +
  'and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96595_ASSERTIONS = [
  {
    id: 'imp96595-reproduces-imp96563-spot-values',
    holds: () =>
      IMP96595_CROSSCHECK.spotValues.every(
        (s) => Math.abs(s.deltaReproduced - s.deltaQuoted) / s.deltaQuoted < 5e-3,
      ),
    why: 'the three imp-96563 delta(N) spot values (2.14e-13 at N=250, 7.79e-12 at N=6000, 1.37e-11 at N=1e4) are reproduced to within 0.5% by independent recomputation.',
  },
  {
    id: 'imp96595-full-ladder-all-certifiable',
    holds: () =>
      IMP96595_CERTIFIED_RUNGS.length === 12 &&
      IMP96595_CROSSCHECK.allRungsCertifiable === true &&
      IMP96595_CROSSCHECK.shiftOverLamMinAt1e4 < 8e-4 &&
      IMP96595_CROSSCHECK.certifiedLowerBoundAt1e4 > 1.7e-8,
    why: 'all 12 rungs of the full imp-96428 ladder are certifiable (certified lower bound > 0), with delta/lam_min < 8e-4 and certified lam_min >= ~1.746e-8 at N=1e4.',
  },
  {
    id: 'imp96595-enclosure-ratio-monotone',
    holds: () => IMP96595_CROSSCHECK.shiftOverLamMinMonotoneUp === true,
    why: 'the enclosure ratio delta/lam_min grows monotonically along the ladder (delta ~ n u log n up, lam_min ~ A n^-p down), so N=1e4 is the tightest accessible rung.',
  },
  {
    id: 'imp96595-honesty-gate-no-qed',
    holds: () =>
      /NO QED/.test(IMP96595_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96595_HONEST_BANNER) &&
      /RH open/.test(IMP96595_HONEST_BANNER),
    why: 'reproduction only: the honesty markers are present and no bound is claimed moved.',
  },
];

for (const a of IMP96595_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96595-route-m-lammin-certified-rungs-full-ladder assertion failed: ${a.id}`,
    );
  }
}

export default {
  inputs: IMP96595_INPUTS,
  certifiedRungs: IMP96595_CERTIFIED_RUNGS,
  crosscheck: IMP96595_CROSSCHECK,
  banner: IMP96595_HONEST_BANNER,
};
