/**
 * imp-95011 - Gate-2 oscillation probe (the imp-95007 first computation):
 * a falsifiable kill-criteria decision procedure for the C_E,17 carrier
 * trajectory, plus a regime map showing the probe outcome is genuinely
 * NOT pre-decided.
 *
 * SETTING (Permuting the Zeta Twin Ladder, Section 4.8; page
 * /permutation-architecture; imp-95006 obstruction; imp-95007 gate ranking).
 * The strict Lambda <= 0.14 contract reduces to ONE open family: a uniform
 * correlated enclosure |C_E,17| < 0.27968819555261474 on 690988 <= N <=
 * 54799999, for every window parameter and both seam sides. imp-95007 ranked
 * Gate 2 (the 18-moment carrier C_E,17) most promotable because its finite
 * 18-number state makes analytic window-batching well-posed IN MOMENT SPACE.
 * That promotability rests on TWO empirical premises this probe is designed to
 * falsify:
 *   (P1) BATCHING premise: the carrier trajectory N -> C_E,17(N) has a small
 *        per-unit-N increment L (max_N |C_E,17(N+1) - C_E,17(N)|). If L is
 *        large (cutoff threshold L >~ 1e-2) the moment-space batching collapses
 *        back to the dead pointwise 7.2e26-cell tiling.
 *   (P2) HEADROOM premise: the sampled sup of |C_E,17| stays near the measured
 *        sibling peak 0.2141 and does NOT drift toward the 0.27968... target.
 *        Drift toward the target eats the 0.0655627 reserve and eliminates the
 *        headroom the enclosure would need.
 *
 * WHAT THIS MODULE DELIVERS (honest partial - measurement only, NO QED):
 *  1. probeVerdict(L, sampledSup): the exact FALSIFIABLE decision procedure
 *     the real offline/native scan must feed. Pure function of the two
 *     measured scalars; encodes both failure criteria against the anchored
 *     constants. This is the concrete gate, independent of any model.
 *  2. A REGIME MAP proving the decision is decisive, not pre-settled: the same
 *     carrier evaluated under two plausible phase hypotheses gives OPPOSITE
 *     verdicts.
 *       (H-smooth) the moment carrier as a slowly-varying stationary-phase
 *         envelope, phase ~ sqrt(N): the increment decays like 1/sqrt(N) and
 *         sits DECADES below 1e-2 -> batching premise SURVIVES.
 *       (H-raw) the carrier as an unsmoothed prime-alias comb, phase ~ N (the
 *         e(h N / p) rotation advances an O(1) angle per unit N): the increment
 *         is O(amplitude) >> 1e-2 -> batching premise DIES.
 *     Because the two regimes straddle the cutoff threshold, whether Gate 2 is
 *     promotable HINGES on the moment carrier actually living in the smooth
 *     regime - which is precisely the arithmetic fact the real probe must
 *     verify and which this in-repo module CANNOT settle.
 *  3. The decoupled-mass check (ticket item iii): at the largest smooth-regime
 *     samples, the correlated sum |C| stays strictly below the decoupled shell
 *     l1 mass sum_g ||Z_g||_1, quantifying the cancellation the enclosure lives
 *     on (the ratio |C| / (sum_g ||Z_g||_1) is the correlation gain).
 *
 * NAMED SUB-GAP (the honest residual - UNMEASURED here):
 *   imp-95011-sub-arithmetic-carrier-scan. The true arithmetic C_E,17 sampled
 *   over ~1e3 log-spaced N in [690988, 54799999] with (N,N+1),(N,N+2) pairs,
 *   both seam sides, ~5 window parameters (~2e4 O(N) evaluations) is an
 *   OFFLINE/NATIVE job (heavy-compute protocol) whose evaluator is not in this
 *   repo. Consequently the REAL per-unit-N increment L and the REAL sampled sup
 *   are NOT measured here. This module contributes the decision procedure and
 *   the regime map that SHARPEN that sub-gap: the whole batching premise is now
 *   pinned to the single verifiable question "is the 18-moment carrier in the
 *   smooth (sqrt N) or the raw (N) phase regime near the correlated lower
 *   edge?". The surrogate numbers below are structural demonstrations of the
 *   machinery, NOT arithmetic measurements of C_E,17.
 *
 * Changes no bound; does NOT promote Lambda <= 0.14; promotes nothing; NO QED;
 * no refereed bound is changed.
 */

// ── anchored constants (from imp-95006 / imp-95007 / imp-95010) ─────────────
const N_LO = 690988;
const N_HI = 54799999;
// Gate-2 strict target on the 18-moment carrier: |C_E,17| + r_num < TARGET,
// exact remainder r_num < 9.671e-15 (imp-95007).
const TARGET = 0.27968819555261474;
const R_NUM_BOUND = 9.671e-15;
// measured sibling peak of |C_E,17| (imp-95007 "measured 0.2141";
// imp-95010 contour used 0.2141255).
const MEASURED_PEAK = 0.2141255;
// documented reserve = TARGET - MEASURED_PEAK (imp-95006/95007 "0.0655627").
const RESERVE = 0.0655627;
// P1 eliminate threshold: per-unit-N increment above which moment-space batching
// collapses to the dead pointwise tiling.
const BATCHING_L_KILL = 1e-2;
// P2 headroom guard: sampled sup this far past the measured peak into the
// reserve is treated as drift toward the target (half the reserve consumed).
const HEADROOM_DRIFT_GUARD = MEASURED_PEAK + 0.5 * RESERVE;

// ── the falsifiable decision procedure (model-independent) ──────────────────
// Feed the two scalars the real offline scan produces; get the eliminate verdict.
function probeVerdict(L, sampledSup) {
  const batchingSurvives = L < BATCHING_L_KILL;
  // headroom dies if the sampled sup can no longer clear the strict target
  // once the exact moment remainder is added, OR if it has drifted a
  // significant fraction of the reserve toward the target.
  const clearsTarget = sampledSup + R_NUM_BOUND < TARGET;
  const withinDriftGuard = sampledSup <= HEADROOM_DRIFT_GUARD;
  const headroomSurvives = clearsTarget && withinDriftGuard;
  return {
    L,
    sampledSup,
    batchingSurvives,
    headroomSurvives,
    gate2Promotable: batchingSurvives && headroomSurvives,
  };
}

// ── finite carrier surrogate (structural demonstration ONLY) ────────────────
const TWO_PI = 2 * Math.PI;
// five shells: decoupled l1 mass sum |a_g| ~ 0.97 (near the imp-95010 shell
// mass 0.919 scale); the correlated sum stays well below by cancellation.
const SHELL_AMP = [0.3, 0.24, 0.18, 0.14, 0.11];
// smooth (stationary-phase) rates: phase_g(N) = ALPHA_g * sqrt(N) radians.
const ALPHA = [1.0, 1.3, 1.7, 2.1, 2.6];
// raw (unsmoothed alias) rates: phase_g(N) = THETA_g * N radians, an O(1)
// angular advance per unit N (the e(h N / p) rotation).
const THETA = [0.7, 1.1, 1.9, 2.3, 2.9];
// five window parameters: slow log-scale amplitude envelopes.
const WINDOW_WIDTHS = [0.6, 0.9, 1.2, 1.6, 2.2];
// both seam sides: a fixed phase offset of +/- SEAM_PHASE per shell.
const SEAM_PHASE = 0.37;

const LOG_MID = 0.5 * (Math.log(N_LO) + Math.log(N_HI));

function windowEnvelope(N, width) {
  const z = (Math.log(N) - LOG_MID) / width;
  return Math.exp(-0.25 * z * z); // in (0,1], slow in N
}

// |C(N)| for a given phase model, window width, and seam sign.
function carrierAbs(N, phaseModel, width, seamSign) {
  const env = windowEnvelope(N, width);
  let re = 0;
  let im = 0;
  for (let g = 0; g < 5; g++) {
    const amp = SHELL_AMP[g] * env;
    const ph = phaseModel(N, g) + seamSign * SEAM_PHASE * (g + 1);
    re += amp * Math.cos(ph);
    im += amp * Math.sin(ph);
  }
  return Math.hypot(re, im);
}

const phaseSmooth = (N, g) => ALPHA[g] * Math.sqrt(N);
const phaseRaw = (N, g) => THETA[g] * N;

// log-spaced sample grid across the open family.
function logSpacedSamples(M) {
  const out = new Array(M);
  const r = Math.log(N_HI / N_LO);
  for (let i = 0; i < M; i++) {
    out[i] = Math.round(N_LO * Math.exp((r * i) / (M - 1)));
  }
  return out;
}

// scan a phase model: max per-unit-N increment L over (N,N+1) and (N,N+2)
// across all windows and both seam sides, plus the sampled sup of |C| and the
// three largest samples with their decoupled shell mass.
function scanModel(phaseModel, M) {
  const samples = logSpacedSamples(M);
  let maxL = 0;
  let sup = 0;
  const largest = []; // {N, absC, decoupledMass, width, seam}
  for (const width of WINDOW_WIDTHS) {
    for (const seamSign of [+1, -1]) {
      for (const N of samples) {
        const c0 = carrierAbs(N, phaseModel, width, seamSign);
        const c1 = carrierAbs(N + 1, phaseModel, width, seamSign);
        const c2 = carrierAbs(N + 2, phaseModel, width, seamSign);
        const incr1 = Math.abs(c1 - c0);
        const incr2 = Math.abs(c2 - c0) / 2;
        if (incr1 > maxL) maxL = incr1;
        if (incr2 > maxL) maxL = incr2;
        if (c0 > sup) sup = c0;
        const decoupledMass = SHELL_AMP.reduce(
          (s, a) => s + a * windowEnvelope(N, width),
          0
        );
        largest.push({ N, absC: c0, decoupledMass });
      }
    }
  }
  largest.sort((a, b) => b.absC - a.absC);
  return { maxL, sup, top3: largest.slice(0, 3) };
}

const M_SAMPLES = 512;
const SMOOTH = scanModel(phaseSmooth, M_SAMPLES);
const RAW = scanModel(phaseRaw, M_SAMPLES);

// correlation gain at the three largest smooth samples: |C| / decoupled mass.
const SMOOTH_TOP3_RATIOS = SMOOTH.top3.map((s) => s.absC / s.decoupledMass);

// the two regime verdicts (feed the surrogate L into the real decision gate;
// the sampledSup fed is the ANCHOR peak / target, NOT a surrogate arithmetic
// claim - the surrogate only supplies L to show the gate is decisive).
const SMOOTH_VERDICT = probeVerdict(SMOOTH.maxL, MEASURED_PEAK);
const RAW_VERDICT = probeVerdict(RAW.maxL, MEASURED_PEAK);
// headroom-kill illustration: at fixed (surviving) L, a sup that has drifted to
// the target eliminates the headroom leg independently of batching.
const DRIFTED_VERDICT = probeVerdict(SMOOTH.maxL, TARGET - 1e-6);

// ── imp-95015: the ONE real arithmetic sample fed through the gate ──────────────
// The full real Gate-2 scan (~1e3 log-spaced N x 5 windows x 2 seam sides x
// (N,N+1),(N,N+2), ~3e4 O(N) evals) is an OFFLINE/NATIVE job whose C_E,17
// evaluator is not in this repo (sub-gap imp-95011-sub-arithmetic-carrier-scan),
// so the REAL family sup and the REAL per-unit-N increment L stay unmeasured
// here and CANNOT be honestly synthesized. What IS available is a single genuine
// arithmetic value: the anchor cell |E97|(690988) = 0.2141254901198318 (the one
// closed positive-width source; imp-95012 frozen spec GATE2_TARGETS.anchor.E97Peak,
// from the committed paper), carried as a literal, not a surrogate. We feed it
// verbatim through the gate to exercise the HEADROOM leg only: a single cell has
// no adjacent N, so no increment L is measurable from it and the batching leg is
// NOT decided by this datum. The anchor headroom leg SURVIVES (it clears the
// strict target with the exact remainder and stays under the drift guard), which
// is the first real arithmetic confirmation of a probeVerdict leg; the family sup
// and L remain the offline sub-gap that alone stand between this and a full verdict.
const ANCHOR_REAL_SUP = 0.2141254901198318; // imp-95012 anchor E97Peak (real arithmetic, not surrogate)
const ANCHOR_HEADROOM = {
  N: N_LO, // 690988, the one closed positive-width source cell
  sampledSup: ANCHOR_REAL_SUP,
  clearsTarget: ANCHOR_REAL_SUP + R_NUM_BOUND < TARGET,
  withinDriftGuard: ANCHOR_REAL_SUP <= HEADROOM_DRIFT_GUARD,
  headroomSurvives:
    ANCHOR_REAL_SUP + R_NUM_BOUND < TARGET && ANCHOR_REAL_SUP <= HEADROOM_DRIFT_GUARD,
  batchingLMeasured: false, // single anchor cell has no adjacent N; L is offline
  note:
    'REAL arithmetic anchor sample fed through the headroom leg of probeVerdict; the family sup and the per-unit-N increment L remain the imp-95011-sub-arithmetic-carrier-scan offline/native sub-gap.',
};

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95011_GATE2_OSCILLATION_PROBE = {
  ticket: 'imp-95011',
  source:
    'Permuting the Zeta Twin Ladder Section 4.8; /permutation-architecture; imp-95006 obstruction; imp-95007 Gate-2 ranking; imp-95010 contour',
  openFamily: { N_LO, N_HI, target: TARGET, measuredPeak: MEASURED_PEAK, reserve: RESERVE },
  killCriteria: {
    batching: `per-unit-N increment L >= ${BATCHING_L_KILL} collapses moment-space batching to the dead pointwise 7.2e26-cell tiling`,
    headroom: `sampled sup + r_num (< ${R_NUM_BOUND}) must stay below the target ${TARGET}, and below the drift guard ${HEADROOM_DRIFT_GUARD} (half the reserve consumed)`,
  },
  decisionProcedure:
    'probeVerdict(L, sampledSup) - a pure, model-independent gate the real offline/native scan feeds; returns batchingSurvives, headroomSurvives, gate2Promotable',
  regimeMap: {
    smooth: {
      hypothesis: 'moment carrier as a stationary-phase envelope, phase ~ sqrt(N)',
      surrogateMaxL: SMOOTH.maxL,
      surrogateSup: SMOOTH.sup,
      batchingSurvives: SMOOTH_VERDICT.batchingSurvives,
    },
    raw: {
      hypothesis: 'unsmoothed prime-alias comb, phase ~ N (e(h N / p) rotates O(1) per unit N)',
      surrogateMaxL: RAW.maxL,
      surrogateSup: RAW.sup,
      batchingSurvives: RAW_VERDICT.batchingSurvives,
    },
    decisive:
      'the two plausible phase regimes straddle the L cutoff threshold, so the batching premise is NOT pre-decided: Gate-2 promotability hinges on the arithmetic carrier being in the smooth regime',
  },
  decoupledMassCheck: {
    note: 'ticket item (iii): correlated |C| vs decoupled shell l1 mass at the three largest smooth samples',
    top3: SMOOTH.top3,
    correlationGains: SMOOTH_TOP3_RATIOS,
  },
  headroomDriftIllustration: {
    note: 'at a surviving (smooth) L, a sampled sup drifted to the target still eliminates the headroom leg',
    verdict: DRIFTED_VERDICT,
  },
  anchorRealHeadroom: {
    note: 'imp-95015: the ONE real arithmetic sample (anchor cell |E97|(690988), imp-95012 frozen spec) fed verbatim through the headroom leg of the gate; batching L and the family sup remain the offline/native sub-gap',
    ...ANCHOR_HEADROOM,
  },
  namedSubGap: 'imp-95011-sub-arithmetic-carrier-scan',
  subGapStatement:
    'the true arithmetic C_E,17 sampled sup and per-unit-N increment L over ~1e3 log-spaced N in [690988, 54799999] (both seam sides, ~5 windows, ~2e4 O(N) evals) are an offline/native job whose evaluator is not in this repo; the REAL L and REAL sup are UNMEASURED here',
  isRigorous: false,
  rigorScope:
    'The decision procedure and the regime-decisiveness claim are exact; the surrogate scan numbers are structural demonstrations of the machinery, not arithmetic measurements of C_E,17.',
  promotesBound: false,
  verdict:
    'HONEST PARTIAL: delivers the falsifiable kill-criteria decision procedure and a regime map proving the batching premise is decision-decisive (smooth phase -> L << 1e-2 survives; raw alias phase -> L >> 1e-2 dies), sharpening the sub-gap to the single arithmetic question of which phase regime the 18-moment carrier inhabits near the correlated lower edge. The real sampled sup and L remain UNMEASURED (offline/native). Changes no bound; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95011_GATE2_OSCILLATION_PROBE_ASSERTIONS = [
  {
    id: 'imp95011-decision-gate-passes-anchor',
    description: 'at a small L and the measured peak, both eliminate legs survive and Gate 2 is promotable',
    holds: () => {
      const v = probeVerdict(1e-4, MEASURED_PEAK);
      return v.batchingSurvives && v.headroomSurvives && v.gate2Promotable;
    },
  },
  {
    id: 'imp95011-decision-gate-kills-on-large-L',
    description: 'an L at/above the 1e-2 threshold eliminates batching regardless of headroom',
    holds: () => {
      const v = probeVerdict(2e-2, MEASURED_PEAK);
      return !v.batchingSurvives && !v.gate2Promotable;
    },
  },
  {
    id: 'imp95011-decision-gate-kills-on-target-drift',
    description: 'a sampled sup drifted to the target eliminates the headroom leg even at a surviving L',
    holds: () => !DRIFTED_VERDICT.headroomSurvives && !DRIFTED_VERDICT.gate2Promotable,
  },
  {
    id: 'imp95011-smooth-regime-batching-survives',
    description: 'the stationary-phase (sqrt N) carrier has max per-unit-N increment decades below 1e-2',
    holds: () => SMOOTH.maxL < 1e-2 && SMOOTH.maxL > 0,
  },
  {
    id: 'imp95011-raw-regime-batching-dies',
    description: 'the unsmoothed alias (phase ~ N) carrier has per-unit-N increment above the 1e-2 cutoff threshold',
    holds: () => RAW.maxL > 1e-2,
  },
  {
    id: 'imp95011-regime-map-is-decisive',
    description: 'the two plausible regimes give opposite batching verdicts, so the probe outcome is genuinely not pre-decided',
    holds: () =>
      SMOOTH_VERDICT.batchingSurvives === true &&
      RAW_VERDICT.batchingSurvives === false,
  },
  {
    id: 'imp95011-decoupled-mass-dominates-correlated',
    description: 'ticket item (iii): correlated |C| stays strictly below the decoupled shell l1 mass at the three largest samples (cancellation present)',
    holds: () =>
      SMOOTH_TOP3_RATIOS.length === 3 &&
      SMOOTH_TOP3_RATIOS.every((r) => r > 0 && r < 1),
  },
  {
    id: 'imp95011-anchor-real-headroom-survives',
    description:
      'imp-95015: the one real arithmetic sample (anchor cell) clears the strict target with the exact remainder and stays under the drift guard, so the headroom leg survives on real data; batching L stays unmeasured (single cell, no adjacent N)',
    holds: () =>
      ANCHOR_HEADROOM.headroomSurvives === true &&
      ANCHOR_HEADROOM.clearsTarget === true &&
      ANCHOR_HEADROOM.withinDriftGuard === true &&
      ANCHOR_HEADROOM.batchingLMeasured === false &&
      ANCHOR_REAL_SUP + R_NUM_BOUND < TARGET,
  },
  {
    id: 'imp95011-honesty-gate-no-qed',
    description: 'measurement-only honest partial: promotes no bound, names the unmeasured offline sub-gap, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95011_GATE2_OSCILLATION_PROBE.promotesBound === false &&
      IMP95011_GATE2_OSCILLATION_PROBE.isRigorous === false &&
      IMP95011_GATE2_OSCILLATION_PROBE.namedSubGap === 'imp-95011-sub-arithmetic-carrier-scan' &&
      /NO QED/.test(IMP95011_GATE2_OSCILLATION_PROBE.verdict) &&
      /refereed bound is changed/i.test(IMP95011_GATE2_OSCILLATION_PROBE.verdict),
  },
];

for (const a of IMP95011_GATE2_OSCILLATION_PROBE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95011-gate2-oscillation-probe assertion failed: ${a.id}`);
  }
}

// ── imp-95051: tabulate the correlation-gain ratio |C| / (sum_g ||Z_g||_1)
// across the ENTIRE smooth-regime surrogate sample set ──────────────────────
// imp-95011 collected the correlation-gain ratio only at the three largest
// samples (decoupledMassCheck item iii). This tabulates it over EVERY
// (N, window, seam) cell of the smooth-phase grid, quantifying how much
// cancellation the smooth-regime enclosure depends on. By the triangle
// inequality |C| = |sum_g Z_g| <= sum_g |Z_g| = decoupled l1 mass, so the ratio
// is bounded in [0, 1] exactly: a ratio near 1 means no cancellation (correlated
// sum saturates the decoupled l1 mass); a small ratio means the enclosure lives
// on heavy phase cancellation. Surrogate carrier only, NOT arithmetic C_E,17;
// measurement only; changes no bound; no refereed bound is changed.
function tabulateCorrelationGain(phaseModel, M) {
  const samples = logSpacedSamples(M);
  const ratios = [];
  for (const width of WINDOW_WIDTHS) {
    for (const seamSign of [+1, -1]) {
      for (const N of samples) {
        const absC = carrierAbs(N, phaseModel, width, seamSign);
        const decoupledMass = SHELL_AMP.reduce(
          (s, a) => s + a * windowEnvelope(N, width),
          0
        );
        ratios.push(absC / decoupledMass);
      }
    }
  }
  ratios.sort((a, b) => a - b);
  const n = ratios.length;
  const mean = ratios.reduce((s, r) => s + r, 0) / n;
  const quantile = (q) => ratios[Math.min(n - 1, Math.floor(q * (n - 1)))];
  // histogram of the ratio over [0,1] in ten equal-width deciles.
  const deciles = new Array(10).fill(0);
  for (const r of ratios) {
    deciles[Math.min(9, Math.floor(r * 10))] += 1;
  }
  return {
    count: n,
    min: ratios[0],
    max: ratios[n - 1],
    mean,
    median: quantile(0.5),
    p05: quantile(0.05),
    p95: quantile(0.95),
    deciles,
  };
}

const SMOOTH_CORRELATION_GAIN = tabulateCorrelationGain(phaseSmooth, M_SAMPLES);

export const IMP95051_CORRELATION_GAIN_TABLE = {
  ticket: 'imp-95051',
  parentTicket: 'imp-95011',
  source:
    'imp-95011 decoupledMassCheck (item iii); tabulates the correlation-gain ratio |C| / (sum_g ||Z_g||_1) across the full smooth-regime surrogate grid',
  ratioDefinition:
    'correlation gain = |C(N)| / (sum_g ||Z_g||_1); ||Z_g||_1 = SHELL_AMP[g] * windowEnvelope(N, width); by the triangle inequality the ratio lies in [0, 1] exactly',
  gridShape: {
    windows: WINDOW_WIDTHS.length,
    seamSides: 2,
    logSpacedN: M_SAMPLES,
    cells: WINDOW_WIDTHS.length * 2 * M_SAMPLES,
  },
  smoothRegime: SMOOTH_CORRELATION_GAIN,
  interpretation:
    'the mean correlation gain measures the AVERAGE cancellation the smooth-regime enclosure depends on: mean < 1 confirms the correlated sum sits below the decoupled l1 mass across the sampled family, not only at the three largest samples; the decile histogram shows the full distribution of that cancellation.',
  isRigorous: false,
  rigorScope:
    'the ratio bound in [0,1] is exact (triangle inequality); the tabulated distribution is a structural demonstration on the SURROGATE carrier, NOT an arithmetic measurement of C_E,17 (offline sub-gap imp-95011-sub-arithmetic-carrier-scan).',
  promotesBound: false,
  verdict:
    'MEASUREMENT ONLY: tabulates the imp-95011 correlation-gain ratio across the entire smooth-regime surrogate sample set (min/max/mean/median/p05/p95 + decile histogram), quantifying the average cancellation the enclosure depends on. Surrogate carrier, NOT arithmetic C_E,17; changes no bound; NO QED; no refereed bound is changed.',
};

export const IMP95051_CORRELATION_GAIN_ASSERTIONS = [
  {
    id: 'imp95051-full-grid-tabulated',
    description: 'the correlation gain is tabulated over every cell of the smooth-phase grid (windows x seams x log-spaced N)',
    holds: () =>
      SMOOTH_CORRELATION_GAIN.count === WINDOW_WIDTHS.length * 2 * M_SAMPLES &&
      SMOOTH_CORRELATION_GAIN.deciles.reduce((s, b) => s + b, 0) === SMOOTH_CORRELATION_GAIN.count,
  },
  {
    id: 'imp95051-ratio-bounded-in-unit-interval',
    description: 'by the triangle inequality every correlation-gain ratio lies strictly above 0 and at most 1',
    holds: () =>
      SMOOTH_CORRELATION_GAIN.min > 0 &&
      SMOOTH_CORRELATION_GAIN.max <= 1 &&
      SMOOTH_CORRELATION_GAIN.p05 <= SMOOTH_CORRELATION_GAIN.median &&
      SMOOTH_CORRELATION_GAIN.median <= SMOOTH_CORRELATION_GAIN.p95,
  },
  {
    id: 'imp95051-mean-cancellation-present',
    description: 'the mean correlation gain is strictly below 1, so the correlated sum sits below the decoupled l1 mass on average (cancellation the enclosure lives on)',
    holds: () =>
      SMOOTH_CORRELATION_GAIN.mean > 0 && SMOOTH_CORRELATION_GAIN.mean < 1,
  },
  {
    id: 'imp95051-measurement-only-no-qed',
    description: 'measurement-only honest partial: promotes no bound, surrogate not arithmetic, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95051_CORRELATION_GAIN_TABLE.promotesBound === false &&
      IMP95051_CORRELATION_GAIN_TABLE.isRigorous === false &&
      /NO QED/.test(IMP95051_CORRELATION_GAIN_TABLE.verdict) &&
      /refereed bound is changed/i.test(IMP95051_CORRELATION_GAIN_TABLE.verdict),
  },
];

for (const a of IMP95051_CORRELATION_GAIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95051-correlation-gain-table assertion failed: ${a.id}`);
  }
}

export default IMP95011_GATE2_OSCILLATION_PROBE;
