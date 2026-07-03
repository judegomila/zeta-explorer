/**
 * @module imp-3861-moment-ratio-decay-ladder-viz-data
 * @fileoverview imp-3861 -- lightweight, import-light literal data for a
 *   visualization of the imp-3735 subleading moment-ratio correction
 *   eps_n = Q_n/tau*(n)^2 - 1 decay ladder across n=6..80, overlaid with the
 *   three candidate decay laws imp-3735 tested: the REJECTED slow
 *   16/(ln n)^2, the REJECTED c/n, and the Laplace-variance order
 *   1/(n(1+4 tau*(n))) -- plus the reduced factor
 *   eps_n * n * (1+4 tau*(n)) drifting through 1 near n~49.
 *
 *   Values below (n, tau*(n), eps_n, and the exact reduced factor
 *   eps_n * n * (1+4 tau*(n))) are baked reference literals reproduced from
 *   a one-off evaluation of imp-3735-moment-ratio-correction-tail.js (its
 *   `measured.rungs` field); this module does NOT re-run that self-computing
 *   converged de Bruijn-Newman moment quadrature, so importing it into a
 *   page costs nothing at load time. The two REJECTED candidate curves are
 *   plain closed-form functions of n, each normalized to agree with the
 *   measured eps_n at the n=6 anchor so their DIVERGING shape (not their
 *   absolute scale) is what the chart compares.
 *
 *   @see imp-3735-moment-ratio-correction-tail.js (the source measurement)
 *
 *   Ticket: imp-3861 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// eps_n = Q_n/tau*(n)^2 - 1, tau*(n) solving n = 4 pi tau* e^{4 tau*}, and the exact reduced
// factor eps_n * n * (1+4 tau*(n)) (imp-3735 measured.rungs, inner=4800 converged quadrature).
export const IMP3861_RUNGS = Object.freeze([
  { n: 6, tau: 0.207881, eps: 0.206995, reduced: 2.274694 },
  { n: 8, tau: 0.241906, eps: 0.13743, reduced: 2.163276 },
  { n: 10, tau: 0.270116, eps: 0.099211, reduced: 2.064047 },
  { n: 12, tau: 0.294278, eps: 0.075537, reduced: 1.973437 },
  { n: 14, tau: 0.315448, eps: 0.059681, reduced: 1.889799 },
  { n: 16, tau: 0.334312, eps: 0.048457, reduced: 1.812098 },
  { n: 18, tau: 0.351338, eps: 0.040178, reduced: 1.739566 },
  { n: 20, tau: 0.366866, eps: 0.033873, reduced: 1.671589 },
  { n: 22, tau: 0.381147, eps: 0.028945, reduced: 1.607659 },
  { n: 24, tau: 0.394372, eps: 0.025014, reduced: 1.547348 },
  { n: 26, tau: 0.406693, eps: 0.021821, reduced: 1.490288 },
  { n: 28, tau: 0.418227, eps: 0.019189, reduced: 1.436165 },
  { n: 30, tau: 0.429074, eps: 0.016993, reduced: 1.384705 },
  { n: 32, tau: 0.439313, eps: 0.015138, reduced: 1.335671 },
  { n: 34, tau: 0.449011, eps: 0.013558, reduced: 1.288853 },
  { n: 36, tau: 0.458223, eps: 0.012199, reduced: 1.244068 },
  { n: 38, tau: 0.466998, eps: 0.011021, reduced: 1.201153 },
  { n: 40, tau: 0.475376, eps: 0.009995, reduced: 1.159965 },
  { n: 42, tau: 0.483393, eps: 0.009093, reduced: 1.120373 },
  { n: 44, tau: 0.491079, eps: 0.008298, reduced: 1.082264 },
  { n: 46, tau: 0.498462, eps: 0.007592, reduced: 1.045534 },
  { n: 48, tau: 0.505564, eps: 0.006963, reduced: 1.01009 },
  { n: 50, tau: 0.512408, eps: 0.0064, reduced: 0.975847 },
  { n: 52, tau: 0.519012, eps: 0.005894, reduced: 0.942729 },
  { n: 54, tau: 0.525392, eps: 0.005437, reduced: 0.910666 },
  { n: 56, tau: 0.531565, eps: 0.005024, reduced: 0.879596 },
  { n: 58, tau: 0.537542, eps: 0.004649, reduced: 0.84946 },
  { n: 60, tau: 0.543337, eps: 0.004308, reduced: 0.820205 },
  { n: 62, tau: 0.54896, eps: 0.003996, reduced: 0.791783 },
  { n: 64, tau: 0.554422, eps: 0.003711, reduced: 0.764149 },
  { n: 66, tau: 0.559732, eps: 0.003449, reduced: 0.737261 },
  { n: 68, tau: 0.564898, eps: 0.003208, reduced: 0.711081 },
  { n: 70, tau: 0.569929, eps: 0.002986, reduced: 0.685574 },
  { n: 72, tau: 0.57483, eps: 0.002781, reduced: 0.660706 },
  { n: 74, tau: 0.57961, eps: 0.002592, reduced: 0.636448 },
  { n: 76, tau: 0.584274, eps: 0.002416, reduced: 0.612771 },
  { n: 78, tau: 0.588827, eps: 0.002253, reduced: 0.589648 },
  { n: 80, tau: 0.593275, eps: 0.002101, reduced: 0.567054 },
]);

const ANCHOR = IMP3861_RUNGS[0]; // n=6, both rejected candidates normalized to agree here

// REJECTED candidate 1: the slow 1/tau*^2 ~ 16/(ln n)^2 law, normalized to eps_6 at n=6.
const LAW_SLOW_SCALE = ANCHOR.eps / (16 / Math.log(ANCHOR.n) ** 2);
// REJECTED candidate 2: the c/n law, normalized to eps_6 at n=6 (c = eps_6 * 6).
const LAW_INV_N_SCALE = ANCHOR.eps * ANCHOR.n;

// Overlay ladder: measured eps_n plus the three candidate curves at the same n rungs.
// lawLaplace(n) = 1/(n(1+4 tau*(n))) is recovered EXACTLY from the baked literals as
// eps_n / reduced_n -- no extra heavy computation, just arithmetic on already-measured values.
export const IMP3861_DECAY_LADDER = Object.freeze(
  IMP3861_RUNGS.map((r) =>
    Object.freeze({
      n: r.n,
      eps: r.eps,
      lawSlow: LAW_SLOW_SCALE * (16 / Math.log(r.n) ** 2),
      lawInvN: LAW_INV_N_SCALE / r.n,
      lawLaplace: r.eps / r.reduced,
    }),
  ),
);

// The reduced factor eps_n * n * (1+4 tau*(n)) drifting through 1: > 1 through n=48, < 1 from
// n=50 on (imp-3735: exact eps_n falls slightly faster than the leading Laplace-variance order).
export const IMP3861_REDUCED_FACTOR = Object.freeze(
  IMP3861_RUNGS.map((r) => Object.freeze({ n: r.n, reduced: r.reduced })),
);

export const IMP3861_CROSSING_LO_N = 48; // reduced = 1.01009 (last rung above 1)
export const IMP3861_CROSSING_HI_N = 50; // reduced = 0.975847 (first rung below 1)
