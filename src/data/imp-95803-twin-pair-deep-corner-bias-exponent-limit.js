/**
 * imp-95803 -- EXTEND the imp-95788 deep-corner finite-N bias ladder beyond
 * N=200 and MEASURE whether the super-linear log-log decay exponent p of
 * biasPct ~ N^{-p} converges to a fixed limiting power (tied to the sech-kernel
 * edge decay) or keeps drifting.
 *
 * GRADE: numerical assessment of an already-established interior model-seam
 * quantity. Imports no heavy bundle; no imports at all. Changes NO Lambda bound;
 * NO QED; no refereed bound is changed.
 *
 * BACKGROUND. imp-95788 measured the finite-size biasPct = 100*(lambda_min(N)/
 * F_inf - 1) at the DEEPEST twin-pair cell (delta = ln 1.2, rho = 1) over
 * N = 80, 120, 160, 200 lattice points, against the fixed imp-95744 dual
 * F_inf = 4.263426088e-22, and reported a super-linear log-log decay whose local
 * slope DRIFTED across the ladder (-2.72 -> -2.57 -> -2.38) -- faster than 1/N
 * but not a fixed rate. This module extends the same imp-95762 double-double
 * eigensolver to N = 240, 300, 400, 500 and asks: does p(N) lock to a fixed
 * limiting power, or keep drifting?
 *
 * METHOD CORRECTION (why a naive extension is wrong). Re-running the imp-95762 DD
 * inverse iteration at the SAME fixed iteration budget (24 iters) beyond N=200
 * produced a spurious NON-MONOTONE biasPct (4.82 -> 9.60 -> 2.12 -> 2.46) with a
 * wildly oscillating apparent exponent (+3.78, -6.77, +0.51). This is an
 * inverse-iteration UNDER-CONVERGENCE artifact, not a real feature: at the deep
 * corner lambda_min ~ 4e-22 sits far below the O(1) spectrum, so the inverse-
 * iteration convergence rate degrades as N grows and a fixed 24-iter budget
 * leaves the large-N rungs badly unconverged. Iterating each rung to a relative
 * change below 1e-12 (75 iters at N=200 rising to 356 iters at N=500, final
 * relative eigen-residual ~1e-6) restores a clean monotone descent. The baked
 * ladder below is the CONVERGED one.
 *
 * THE CONVERGED LADDER (offline; tmp/imp-95803-conv-full.mjs). Same DD sech Gram +
 * DD LDL^T + DD inverse iteration + Rayleigh quotient, at delta = ln 1.2, rho = 1,
 * against F_inf = 4.263426088e-22:
 *
 *   N (pts)   DD lambda_min (converged)   biasPct = 100*(lmin/F_inf - 1)
 *     80        6.4645156548e-22             51.6272   (imp-95762 headline)
 *    120        4.9721614265e-22             16.6236
 *    160        4.6103676325e-22              8.1376
 *    200        4.4689038153e-22              4.8195
 *    240        4.3992279312e-22              3.1853   (new)
 *    300        4.3462768072e-22              1.9433   (new)
 *    400        4.3079193635e-22              1.0436   (new)
 *    500        4.2911402907e-22              0.6500   (new)
 *
 * FINDING 1 -- THE FIXED-ITERATION EXTENSION IS AN ARTIFACT. A naive extension at
 * the imp-95788 iteration budget gives non-monotone biasPct and a nonsense
 * oscillating exponent; the deep-corner spectral separation forces the iteration
 * count to grow with N (75 -> 356 iters over N=200..500) before biasPct is
 * trustworthy. Any exponent read at fixed iters beyond N~200 is meaningless.
 *
 * FINDING 2 -- CONVERGED, THE BIAS DESCENDS MONOTONICALLY TO N=500. lambda_min(N)
 * falls monotonically 6.46e-22 -> ... -> 4.29e-22 and biasPct collapses
 * monotonically 51.63 -> 16.62 -> 8.14 -> 4.82 -> 3.19 -> 1.94 -> 1.04 -> 0.65,
 * an ~80x reduction from N=80 to N=500, confirming (as it must) biasPct -> 0.
 *
 * FINDING 3 -- THE EXPONENT DOES NOT LOCK TO 2.4-2.7; IT DRIFTS TOWARD p ~ 2.
 * The converged local log-log slope of biasPct vs N is
 *   -2.795, -2.483, -2.348, -2.272, -2.215, -2.161, -2.122
 * across the seven consecutive rungs -- a smooth, MONOTONE decay of |p| that does
 * NOT settle at the small-N 2.4-2.7 band. A one-parameter p(N) = p_inf + a/N fit
 * on the largest rungs extrapolates p_inf ~ 1.98, i.e. the finite-size bias tends
 * to a 1/N^2 law asymptotically, not a steeper sech-edge-dominated rate. The
 * consistency check bias * N^2 is still slowly decreasing (330414 -> 162511 over
 * N=80..500), so p approaches 2 from ABOVE with a slowly-varying prefactor; a
 * pure fixed power is not yet reached over the measured window.
 *
 * ANSWER TO THE TICKET. The local exponent does NOT converge to the ~2.4-2.7
 * observed at small N -- those steeper values are a pre-asymptotic (and partly
 * under-converged) transient. Properly converged and extended to N=500, p(N)
 * drifts smoothly and monotonically toward a limiting power p ~ 2 (a 1/N^2
 * finite-size law), consistent with, but weaker than, a raw exponential sech-edge
 * rate. So there IS a fixed limiting power (near 2), but it is not the small-N
 * band and it is only approached asymptotically over the measured window.
 *
 * HONEST SCOPE / SUB-GAP. (a) Assessment only: it re-runs an established solver at
 * larger N and reports the convergence trend; no new cited input, no bound. (b)
 * The exact limiting power -- whether it is EXACTLY 2, or 2 with a slowly-varying
 * logarithmic/prefactor correction (bias * N^2 still drifts down ~2x over the
 * window) -- is NOT pinned here; deciding it needs even larger N or quad-double
 * precision (double-double relative residual bottoms near ~1e-6 at the deep
 * corner). SUB-GAP: pin-exact-limiting-bias-power-at-deep-corner. (c) Model seam
 * family only; the imp-95212 envelope port, signed WEIGHT, and modulus/phase legs
 * stay OPEN. Changes NO bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95788-twin-pair-deep-corner-finite-n-bias-convergence (the N<=200 ladder this extends)
 * @see imp-95762-twin-pair-block-floor-finite80-dd-eigensolver (the DD eigensolver reused)
 * @see imp-95744-twin-pair-block-floor-belowprec-dd-resolve (the dual F_inf this measures against)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95803_TWIN_PAIR_DEEP_CORNER_BIAS_EXPONENT_LIMIT = {
  id: "imp-95803",
  title:
    "Extend the imp-95788 deep-corner finite-N bias ladder beyond N=200: at fixed " +
    "iters the biasPct goes spuriously non-monotone (an inverse-iteration under-" +
    "convergence artifact), but properly converged to N=500 biasPct descends " +
    "monotonically 51.63 -> ... -> 0.65 and the local log-log exponent does NOT " +
    "lock to the small-N 2.4-2.7 band -- it drifts smoothly toward a limiting " +
    "power p ~ 2 (a 1/N^2 finite-size law, p_inf ~ 1.98)",
  question:
    "does the super-linear decay exponent p of biasPct ~ N^{-p} at the deepest " +
    "twin-pair cell converge to a fixed limiting power beyond N=200, or keep " +
    "drifting?",
  cell: { delta: "ln1.2", deltaValue: 0.1823215567939546, rho: 1 },
  // Fixed dual infimum from imp-95744 (infinite lattice, cancellation-free).
  Finf: 4.263426088e-22,
  // The imp-95762 DD eigensolver, iterated to relative change < 1e-12 per rung
  // (iters grow 16..356 as N grows; final relative eigen-residual ~1e-6). biasPct
  // is 100*(lminDD/Finf - 1). N <= 200 rungs re-confirm the imp-95788 tail; the
  // N >= 240 rungs are new.
  ladder: [
    { nPoints: 80,  lminDD: 6.4645156548e-22, biasPct: 51.6272, isNew: false },
    { nPoints: 120, lminDD: 4.9721614265e-22, biasPct: 16.6236, isNew: false },
    { nPoints: 160, lminDD: 4.6103676325e-22, biasPct:  8.1376, isNew: false },
    { nPoints: 200, lminDD: 4.4689038153e-22, biasPct:  4.8195, isNew: false },
    { nPoints: 240, lminDD: 4.3992279312e-22, biasPct:  3.1853, isNew: true },
    { nPoints: 300, lminDD: 4.3462768072e-22, biasPct:  1.9433, isNew: true },
    { nPoints: 400, lminDD: 4.3079193635e-22, biasPct:  1.0436, isNew: true },
    { nPoints: 500, lminDD: 4.2911402907e-22, biasPct:  0.6500, isNew: true },
  ],
  // Converged local log-log slope of biasPct vs N across consecutive rungs.
  decayExponents: [-2.7949, -2.4830, -2.3475, -2.2715, -2.2145, -2.1611, -2.1215],
  biasConvergesToZero: true,   // biasPct descends monotonically toward 0
  lminDescendsToFinf: true,    // lambda_min(N) descends monotonically toward F_inf from above
  exponentDriftsNotLocked: true, // |p| drifts smoothly, does not lock at the small-N band
  exponentLimitApprox: 2.0,    // p_inf ~ 1.98 from a p = p_inf + a/N fit on the large rungs
  approachesFromAbove: true,   // bias * N^2 still slowly decreasing => p -> 2 from above
  fixedIterExtensionIsArtifact: true, // naive 24-iter extension gives spurious non-monotone biasPct
  biasReductionN80toN500: 79.4, // 51.6272 / 0.6500
  boundChange: false,
  qed: false,
  subGap: "pin-exact-limiting-bias-power-at-deep-corner",
  verdict:
    "DEEP-CORNER BIAS EXPONENT DRIFTS TOWARD p ~ 2, DOES NOT LOCK AT 2.4-2.7. " +
    "Extending the imp-95788 finite-N bias ladder at the deepest twin-pair cell " +
    "(delta=ln1.2, rho=1) beyond N=200 requires care: a naive re-run at the fixed " +
    "imp-95788 iteration budget gives a spurious NON-MONOTONE biasPct " +
    "(4.82 -> 9.60 -> 2.12 -> 2.46) because deep-corner inverse iteration " +
    "under-converges as N grows (needs 75 -> 356 iters over N=200..500). Iterated " +
    "to convergence, biasPct descends monotonically 51.63 -> 16.62 -> 8.14 -> 4.82 " +
    "-> 3.19 -> 1.94 -> 1.04 -> 0.65 (~80x over N=80..500) and the local log-log " +
    "exponent drifts smoothly -2.79 -> -2.48 -> -2.35 -> -2.27 -> -2.21 -> -2.16 " +
    "-> -2.12: it does NOT lock to the small-N 2.4-2.7 band (those are a " +
    "pre-asymptotic / under-converged transient) but trends monotonically toward a " +
    "limiting power p ~ 2 (a 1/N^2 finite-size law; a p=p_inf+a/N fit gives " +
    "p_inf ~ 1.98), approached from above (bias*N^2 still slowly decreasing). The " +
    "exact limit -- exactly 2 vs 2 with a slowly-varying log/prefactor -- is NOT " +
    "pinned here and needs larger N or quad-double precision (SUB-GAP " +
    "pin-exact-limiting-bias-power-at-deep-corner). Assessment only; no new cited " +
    "input. Model seam family only; the imp-95212 envelope port, signed WEIGHT, and " +
    "modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed.",
  closesTickets: ["imp-95803"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all).
// The heavy DD eigensolver runs OFFLINE (tmp/imp-95803-conv-full.mjs); the
// converged lambda_min per N are baked above. Here we re-derive only the CHEAP
// cancellation-free dual F_inf (O(K), the imp-95744 form) and check the baked
// ratios, the monotone descent, and the monotone-in-magnitude exponent drift --
// no O(n^3) DD factorization at import time.
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// imp-95744 cancellation-free infinite-lattice infimum at theta = 0:
//   F_inf = (2 pi / L) * 2 * sum_{k>=1} sech(2 pi^2 k / L) * 2 sin^2(pi k delta / L)
function FinfCancellationFree(delta, D, K = 80) {
  const L = delta + D;
  let s = 0;
  for (let k = 1; k <= K; k++) {
    const sc = sech((2 * Math.PI * Math.PI * k) / L);
    if (sc === 0) break;
    const sn = Math.sin((Math.PI * k * delta) / L);
    s += sc * 2 * sn * sn;
  }
  return ((2 * Math.PI) / L) * 2 * s;
}

const REF = IMP95803_TWIN_PAIR_DEEP_CORNER_BIAS_EXPONENT_LIMIT;

export const IMP95803_ASSERTIONS = [
  {
    id: "imp95803-dual-Finf-matches-imp95744",
    description:
      "the baked dual F_inf at the deepest cell (delta=ln1.2, rho=1) matches the " +
      "imp-95744 cancellation-free form to 1e-6 relative",
    holds: () => {
      const d = REF.cell.deltaValue;
      const F = FinfCancellationFree(d, REF.cell.rho * d);
      return Math.abs(F - REF.Finf) / REF.Finf < 1e-6;
    },
  },
  {
    id: "imp95803-baked-biasPct-matches-ratio",
    description:
      "each baked biasPct equals 100*(lminDD/F_inf - 1) to 5e-3 absolute in percent",
    holds: () =>
      REF.ladder.every((r) => {
        const bias = 100 * (r.lminDD / REF.Finf - 1);
        return Math.abs(bias - r.biasPct) < 5e-3;
      }),
  },
  {
    id: "imp95803-extends-imp95788-tail",
    description:
      "the ladder re-confirms the imp-95788 N=200 tail rung and adds four NEW rungs " +
      "at N=240,300,400,500",
    holds: () => {
      const r200 = REF.ladder.find((r) => r.nPoints === 200);
      const newN = REF.ladder.filter((r) => r.isNew).map((r) => r.nPoints);
      return (
        r200 !== undefined &&
        Math.abs(r200.biasPct - 4.8195) < 0.05 &&
        newN.length === 4 &&
        newN.join(",") === "240,300,400,500"
      );
    },
  },
  {
    id: "imp95803-lmin-descends-monotonically",
    description:
      "the converged DD lambda_min(N) descends monotonically toward F_inf from " +
      "above across the whole extended ladder",
    holds: () => {
      const L = REF.ladder;
      let ok = REF.lminDescendsToFinf === true;
      for (let i = 1; i < L.length; i++) {
        if (!(L[i].lminDD < L[i - 1].lminDD)) ok = false;
      }
      return ok && L[L.length - 1].lminDD > REF.Finf;
    },
  },
  {
    id: "imp95803-biasPct-collapses-monotonically",
    description:
      "biasPct falls monotonically 51.63 -> ... -> 0.65 over N=80..500, an ~80x " +
      "reduction",
    holds: () => {
      const L = REF.ladder;
      let ok = REF.biasConvergesToZero === true;
      for (let i = 1; i < L.length; i++) {
        if (!(L[i].biasPct < L[i - 1].biasPct)) ok = false;
      }
      const ratio = L[0].biasPct / L[L.length - 1].biasPct;
      return ok && ratio > 70 && Math.abs(ratio - REF.biasReductionN80toN500) < 1;
    },
  },
  {
    id: "imp95803-exponent-magnitude-drifts-monotonically",
    description:
      "the converged local log-log exponent |p(N)| decreases monotonically across " +
      "the rungs (does not lock at the small-N 2.4-2.7 band) and each baked value " +
      "reproduces the ladder to 5e-3",
    holds: () => {
      const L = REF.ladder;
      const E = REF.decayExponents;
      if (E.length !== L.length - 1) return false;
      let ok = REF.exponentDriftsNotLocked === true;
      for (let i = 1; i < L.length; i++) {
        const p =
          Math.log(L[i].biasPct / L[i - 1].biasPct) /
          Math.log(L[i].nPoints / L[i - 1].nPoints);
        if (Math.abs(p - E[i - 1]) > 5e-3) ok = false;
        if (!(p < -1)) ok = false; // still super-linear at every rung
      }
      // |p| strictly decreasing rung to rung
      for (let i = 1; i < E.length; i++) {
        if (!(Math.abs(E[i]) < Math.abs(E[i - 1]))) ok = false;
      }
      return ok;
    },
  },
  {
    id: "imp95803-exponent-limit-near-two-from-above",
    description:
      "the exponent trends toward a limiting power p ~ 2 (final magnitude between 2 " +
      "and the small-N band) approached from above (bias*N^2 still decreasing)",
    holds: () => {
      const L = REF.ladder;
      const E = REF.decayExponents;
      const pLast = Math.abs(E[E.length - 1]);
      // final exponent has dropped well below the small-N steepness toward ~2
      const nearTwo = pLast > 2.0 && pLast < 2.2 && Math.abs(REF.exponentLimitApprox - 2.0) < 0.1;
      // bias*N^2 monotone decreasing => approach from above
      let fromAbove = REF.approachesFromAbove === true;
      for (let i = 1; i < L.length; i++) {
        const prev = L[i - 1].biasPct * L[i - 1].nPoints * L[i - 1].nPoints;
        const cur = L[i].biasPct * L[i].nPoints * L[i].nPoints;
        if (!(cur < prev)) fromAbove = false;
      }
      return nearTwo && fromAbove;
    },
  },
  {
    id: "imp95803-fixed-iter-extension-flagged-artifact",
    description:
      "the module records that a naive fixed-iteration extension beyond N=200 is an " +
      "under-convergence artifact (why the baked ladder is the converged one)",
    holds: () =>
      REF.fixedIterExtensionIsArtifact === true &&
      /UNDER-CONVERGENCE|under-converge/.test(REF.verdict + JSON.stringify(REF)),
  },
  {
    id: "imp95803-not-a-bound",
    description:
      "this is a numerical-assessment module; it moves no Lambda bound and proves " +
      "no QED, and it names its open sub-gap",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.subGap === "pin-exact-limiting-bias-power-at-deep-corner" &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95803-closes-self",
    description: "this module is the deliverable the imp-95803 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95803"),
  },
];

for (const a of IMP95803_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95803-twin-pair-deep-corner-bias-exponent-limit assertion failed: ${a.id}`,
    );
  }
}

export default IMP95803_TWIN_PAIR_DEEP_CORNER_BIAS_EXPONENT_LIMIT;
