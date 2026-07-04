/**
 * @fileoverview Baked (import-light, no zeros-bundle) viz literals for imp-33261: the imp-33234
 *   saddle-window direct-vs-log A(tau) cross-validation. Presentation only; no computation here.
 *   @see imp-33234-saddle-window-direct-vs-log-a-cross-validation.js (source of every literal below)
 */

// -- Per-rung overlap table across the saddle-support window tau*(n) in [0.27,0.59], n=10..80 ----
export const IMP33261_OVERLAP_TABLE = [
  { n: 10, tauStar: 0.2701160816195898, aDirect: 4.1025526152037874e-5, aLog: 4.10255260491834e-5, relDiff: 2.507084779149153e-9 },
  { n: 20, tauStar: 0.3668663935302453, aDirect: 5.806365112951e-7, aLog: 5.806365036385238e-7, relDiff: 1.3186522185713439e-8 },
  { n: 30, tauStar: 0.4290744763293156, aDirect: 1.3093657445958867e-8, aLog: 1.3093656964651846e-8, relDiff: 3.675879134144293e-8 },
  { n: 40, tauStar: 0.47537606820209377, aDirect: 3.877794815934344e-10, aLog: 3.877794513241557e-10, relDiff: 7.805796886522438e-8 },
  { n: 50, tauStar: 0.5124081436155259, aDirect: 1.3845903338715382e-11, aLog: 1.384590137220568e-11, relDiff: 1.4202827031907038e-7 },
  { n: 60, tauStar: 0.5433366302801128, aDirect: 5.684797899802943e-13, aLog: 5.68479657106183e-13, relDiff: 2.3373585761761456e-7 },
  { n: 70, tauStar: 0.5699287362799905, aDirect: 2.6055357567418572e-14, aLog: 2.605534822996308e-14, relDiff: 3.58369884911307e-7 },
  { n: 80, tauStar: 0.5932749351881934, aDirect: 1.3065922723388718e-15, aLog: 1.3065915912905744e-15, relDiff: 5.212401082044391e-7 },
];

// -- n=80 direct-Simpson O(h^4) convergence-to-log ladder over inner N = 1200..19200 -------------
export const IMP33261_CONVERGENCE_TABLE = [
  { innerN: 1200, relToLog: 2.014807873891159e-3, ratioVsPrev: null },
  { innerN: 2400, relToLog: 1.315895891082798e-4, ratioVsPrev: 15.311301506027611 },
  { innerN: 4800, relToLog: 8.316555139260524e-6, ratioVsPrev: 15.822607666854266 },
  { innerN: 9600, relToLog: 5.212403798958312e-7, ratioVsPrev: 15.955316318590993 },
  { innerN: 19200, relToLog: 3.260032548573195e-8, ratioVsPrev: 15.988809072595311 },
];

export const IMP33261_TAU_WINDOW_LO = 0.2701160816195898;
export const IMP33261_TAU_WINDOW_HI = 0.5932749351881934;
export const IMP33261_WORST_REL_DIFF = 5.212401082044391e-7;
export const IMP33261_SUB_MICRO_LINE = 1e-6;
export const IMP33261_EXPECTED_SIMPSON_RATIO = 16;
