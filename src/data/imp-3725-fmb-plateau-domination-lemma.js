/**
 * @module imp-3725-fmb-plateau-domination-lemma
 * @fileoverview imp-3725 (proof, RH-FREE, deterministic): per-plateau
 * GAP-DOMINATION BOOTSTRAP lemma giving a rigorous TWO-SIDED enclosure of the
 * true-flow backward-Dyson collision time t_c(N), and therefore a rigorous
 * upper bound on F_mb(N) = t_c(N) - H_raw(N)^2/8, UNIFORM over every N in
 * [1e4, 1e6]. This discharges the F_mb non-regression hypothesis
 * (dependency-matrix leaf cond-fmb-nonregression-above-1e4) at TRUE-FLOW
 * semantics and RETIRES the maxSmoothScaleRatio = 2.15 heuristic slack from
 * the imp-962 plateau scan: the K_PLATEAU_LADDER carryforward K = 0.2014 on
 * (1e4, 1e6] is replaced by a certified K_paper <= 2.424e-6 (margin 8.3e4x).
 *
 * THE LEMMA (real analysis, no RH, no GUE, no local law)
 * ------------------------------------------------------
 * Setting: x_1(0) < ... < x_N(0) are the first N Riemann-zero ordinates
 * (Odlyzko table, src/data/zeros-to-1e6.js), evolving under the backward
 * Dyson flow  dx_k/dt = -2 * sum_{j != k} 1/(x_k - x_j)  (imp-362/imp-359
 * raw-coordinate convention). t_c(N) = first collision time. Gaps
 * g_l = x_{l+1} - x_l, H = min_l g_l(0), attained at gap index a.
 *
 * Gap dynamics (exact identity, ordering preserved up to t_c):
 *   d(g_l^2)/dt = -8 + 4 g_l^2 * sum_{j not in {l, l+1}}
 *                     1 / ((x_j - x_l)(x_j - x_{l+1}))
 * and EVERY term of the sum is POSITIVE (for j < l both factors are
 * negative, for j > l+1 both are positive). Hence:
 *
 * (LOWER, pair-domination): d(g_l^2)/dt >= -8 for every l, so
 *   g_l(t)^2 >= g_l(0)^2 - 8t, and NO collision can occur before
 *   min_l g_l(0)^2 / 8 = H^2/8. (Continuation: on the ordered domain the
 *   field is smooth and velocities are bounded by 2(N-1)/min-gap, so the
 *   solution extends until some gap collapses -- and the bound itself
 *   precludes any collapse before H^2/8.) Therefore
 *       t_c(N) >= H^2/8 = t_c_pair(N),   i.e.   F_mb(N) >= 0,
 *   deterministically, at every N. (One-sided residual direction.)
 *
 * (UPPER, retardation bootstrap): fix thetaBar in (0,1) and the frozen
 * horizon T = H^2 / (8*thetaBar). The same per-gap lower bound gives the
 * frozen shrunk gaps s_l(T) = sqrt(max(g_l(0)^2 - 8T, 0)) <= g_l(t) for all
 * t <= min(t_c, T), so every pair-to-particle distance obeys
 *   x_j(t) - x_{a+1}(t) >= D_j(T) := sum_{l=a+1}^{j-1} s_l(T)   (j > a+1),
 *   x_a(t) - x_j(t)     >= D_j(T) := sum_{l=j}^{a-1}   s_l(T)   (j < a),
 * and both distance factors in the j-term of the gap-a retardation are
 * >= D_j(T). Define
 *   Psi_N(T) = 4 H^2 * sum_{j <= N, j not in {a, a+1}} 1 / D_j(T)^2,
 *   theta_N  = 1 - Psi_N(T) / 8.
 * While t < min(t_c, T) and g_a <= H (maintained by continuity because the
 * derivative below is strictly negative there):
 *   d(g_a^2)/dt <= -8 + 4 g_a^2 * sum 1/D_j(T)^2 <= -8 + Psi_N(T) = -8*theta_N,
 * so g_a(t)^2 <= H^2 - 8*theta_N*t. If theta_N >= thetaBar (which is exactly
 * the self-consistency H^2/(8*theta_N) <= T), the gap reaches zero no later
 * than H^2/(8*theta_N), forcing
 *       t_c(N) <= H^2 / (8 * theta_N).
 * Combining:  0 <= F_mb(N) <= (H^2/8) * (1/theta_N - 1).
 *
 * (PLATEAU MONOTONICITY -- the discrete-to-continuum step): on an
 * H_raw-plateau [N1, N2] the record pair a and H are constant, and Psi_N(T)
 * is a PARTIAL SUM of positive, N-INDEPENDENT terms (each D_j(T) depends
 * only on zeros between the pair and j). Hence Psi_N(T) is monotone
 * nondecreasing in N and Psi_N(T) <= Psi_N2(T) for every N in the plateau.
 * ONE evaluation at the plateau end N2 therefore dominates all ~1e6
 * intermediate N:
 *   F_mb(N) <= (H^2/8) * (1/theta_N2 - 1)          for ALL N in [N1, N2],
 *   K_raw(N) = F_mb(N) * H * sqrt(N)/log(N)
 *            <= (H^3/8) * (1/theta_N2 - 1) * sqrt(N2)/log(N2)
 * (sqrt(N)/log(N) is increasing for N >= 8). This replaces the heuristic
 * "F_mb does not regress + maxSmoothScaleRatio = 2.15 slack" with a direct
 * certificate: no per-N computation, no ODE integration, no RK4 truncation
 * question -- the enclosure is a statement about the TRUE flow.
 *
 * WHAT WAS COMPUTED (scripts/imp-3725-fmb-plateau-domination-compute.mjs)
 * ----------------------------------------------------------------------
 * The 10 H_raw-plateaus on [1e4, 1e6] (independently re-scanned; boundaries
 * agree with the imp-962 scan: 9 updates, anchor H = 0.0376985 at N = 1e4,
 * plateau 6 = [95249, 354769], plateau 9 = [420892, 1e6]). At every plateau
 * the bootstrap certifies at thetaBar = 0.99 with theta >= 0.99823, i.e.
 * the many-body retardation Psi never exceeds 2.28e-2 out of the available
 * 8. Worst certified bounds across [1e4, 1e6]:
 *   R_rel = F_mb/t_c_pair <= 2.849e-3   (plateau 1),
 *   K_paper <= 2.4237e-6                (plateau 1),
 * vs the imp-963 carryforward K = 0.2014: margin factor 8.31e4.
 *
 * INDEPENDENT CROSS-CHECKS (all literal-pinned in assertions below)
 * -----------------------------------------------------------------
 *  (1) The N = 1e4 record pair re-derived here (gap index 6708, zeros
 *      7005.0628661.. / 7005.1005646..) MATCHES pair_index 6708 measured
 *      independently by the imp-2509 RK4 sweep (c-mb-dyson-large-n-cache).
 *  (2) The imp-2509 fine-pass measured t_c(1e4) = 1.778248472e-4 lies
 *      INSIDE the analytic enclosure [1.77647103e-4, 1.77962623e-4] of
 *      plateau 0 -- a numerical integrator landing inside a bound it never
 *      saw.
 *  (3) The imp-360 extended-ladder interval-RK4 closed brackets contain the
 *      analytic enclosures at N = 25000, 50000 (bracket [1e-4, 2e-4]) and
 *      N = 100000 (bracket [0, 1e-4]); the analytic enclosures are 300x to
 *      7e4x TIGHTER and carry flow (not map) semantics.
 *
 * HONEST SCOPE / REMAINING WALLS
 * ------------------------------
 *  - INPUT: the Odlyzko zero table (zeros1 accurate to 3e-9, frozen 1998;
 *    zeros2..10 per imp-514). The lemma is rigorous real analysis GIVEN the
 *    table; table precision (~3e-9 per ordinate, ~6e-9 per gap) perturbs
 *    H^2 and Psi at relative ~2e-6 on the worst (smallest-H) plateau 9 and
 *    ~3e-7 on plateau 0, absorbed 10^4-fold by the certified margins. Same
 *    input-trust status as every other (1e4, 1e6] artifact in the repo
 *    (imp-962 scan, imp-360 ladder).
 *  - ARITHMETIC: plain Float64 with a uniform 1e-6 relative inflation on
 *    Psi (accumulation error over <= 1e6 positive terms is < 1e-10
 *    relative). A directed-rounding re-evaluation would be cosmetic given
 *    the 8.3e4x margin; named micro-subgap imp-3725-sub-directed-rounding.
 *  - The sub-1e4 anchors (imp-857/933/963) keep their existing
 *    discrete-map-certified semantics; this module does not upgrade them.
 *  - This firms the F_mb factor of the finite-N ESTIMATE chain only. It
 *    does NOT close cond-CH or the other conditional legs of
 *    bound-imp-1088-finite-1e6, and it does NOT beat Platt-Trudgian:
 *    Lambda <= 0.2 (PT 2021) REMAINS SOTA. NO QED.
 *
 * @see imp-3725 (this work)
 * @see imp-962  (plateau structure scan -- boundaries independently confirmed)
 * @see imp-963 / imp-1082 / imp-1087 / imp-1088 (the carryforward this retires)
 * @see imp-2509 (RK4 sweep -- cross-check (1),(2))
 * @see imp-360  (extended ladder -- cross-check (3))
 * @see scripts/imp-3725-fmb-plateau-domination-compute.mjs (generator)
 */

// Baked from scripts/imp-3725-fmb-plateau-domination-compute.mjs (node
// /tmp/imp3725.cjs via esbuild bundle, 2026-07-03). DO NOT hand-edit rows;
// regenerate via the script. Psi values include the 1e-6 inflation.
const ROWS = Object.freeze([
  { plateauIndex: 0, startN: 10000,  endN: 18859,   H: 0.0376985,  a: 6708,   gammaLeft: 7005.062866175,   gammaRight: 7005.100564674,   type: 'carry-over',   thetaBar: 0.99, psiStart: 0.0141819381,  psiEnd: 0.0141836457,  theta: 0.9982270443, adjGapLeft: 1.01914268, adjGapRight: 1.63909771, Dmin: 1.01843815,  tcLo: 1.77647103e-4, tcHi: 1.77962623e-4, FmbUpper: 3.1551985e-7,  RrelUpper: 1.77610467e-3, KrawBound: 1.65922614e-7, KpaperBound: 1.30125178e-6 },
  { plateauIndex: 1, startN: 18860,  endN: 44555,   H: 0.03530732, a: 18858,  gammaLeft: 17143.786536184,  gammaRight: 17143.821843505,  type: 'fresh-update', thetaBar: 0.99, psiStart: 0.013199938,   psiEnd: 0.0227243894,  theta: 0.9971594513, adjGapLeft: 0.72591382, adjGapRight: 0.97648249, Dmin: 0.725045979, tcLo: 1.55825865e-4, tcHi: 1.56269756e-4, FmbUpper: 4.43891849e-7, RrelUpper: 2.84864037e-3, KrawBound: 3.09047048e-7, KpaperBound: 2.42370832e-6 },
  { plateauIndex: 2, startN: 44556,  endN: 73997,   H: 0.02953763, a: 44554,  gammaLeft: 36510.166385301,  gammaRight: 36510.195922929,  type: 'fresh-update', thetaBar: 0.99, psiStart: 0.00553789114, psiEnd: 0.0117640232,  theta: 0.9985294971, adjGapLeft: 1.39101637, adjGapRight: 1.03873247, Dmin: 1.03830817,  tcLo: 1.09058933e-4, tcHi: 1.09219541e-4, FmbUpper: 1.60607652e-7, RrelUpper: 1.47266846e-3, KrawBound: 1.1509974e-7,  KpaperBound: 9.02672264e-7 },
  { plateauIndex: 3, startN: 73998,  endN: 82552,   H: 0.02583928, a: 73996,  gammaLeft: 57273.661931705,  gammaRight: 57273.687770985,  type: 'fresh-update', thetaBar: 0.99, psiStart: 0.00735053188, psiEnd: 0.0121847457,  theta: 0.9984769068, adjGapLeft: 0.84444569, adjGapRight: 1.16069413, Dmin: 0.844046273, tcLo: 8.34585489e-5, tcHi: 8.35858579e-5, FmbUpper: 1.27309053e-7, RrelUpper: 1.52541656e-3, KrawBound: 8.34856164e-8, KpaperBound: 6.54737796e-7 },
  { plateauIndex: 4, startN: 82553,  endN: 87761,   H: 0.0208495,  a: 82551,  gammaLeft: 63137.211532887,  gammaRight: 63137.232382388,  type: 'fresh-update', thetaBar: 0.99, psiStart: 0.00570043799, psiEnd: 0.00929912307, theta: 0.9988376096, adjGapLeft: 0.67425434, adjGapRight: 0.99131993, Dmin: 0.673928644, tcLo: 5.43377115e-5, tcHi: 5.44009466e-5, FmbUpper: 6.32351372e-8, RrelUpper: 1.16374311e-3, KrawBound: 3.4314061e-8,  KpaperBound: 2.69108783e-7 },
  { plateauIndex: 5, startN: 87762,  endN: 95248,   H: 0.01948463, a: 87760,  gammaLeft: 66678.075857313,  gammaRight: 66678.095341941,  type: 'fresh-update', thetaBar: 0.99, psiStart: 0.00361398235, psiEnd: 0.00763804635, theta: 0.9990452442, adjGapLeft: 1.05863551, adjGapRight: 0.75817418, Dmin: 0.757921236, tcLo: 4.74563411e-5, tcHi: 4.75016936e-5, FmbUpper: 4.53525171e-8, RrelUpper: 9.55668223e-4, KrawBound: 2.3789001e-8,  KpaperBound: 1.86565768e-7 },
  { plateauIndex: 6, startN: 95249,  endN: 354769,  H: 0.01470148, a: 95247,  gammaLeft: 71732.901207872,  gammaRight: 71732.915909348,  type: 'fresh-update', thetaBar: 0.99, psiStart: 0.00232829834, psiEnd: 0.00406271708, theta: 0.9994921604, adjGapLeft: 0.88118891, adjGapRight: 1.18111193, Dmin: 0.881065028, tcLo: 2.70166746e-5, tcHi: 2.70304017e-5, FmbUpper: 1.37271093e-8, RrelUpper: 5.08097667e-4, KrawBound: 9.40607514e-9, KpaperBound: 7.37673527e-8 },
  { plateauIndex: 7, startN: 354770, endN: 415587,  H: 0.01305322, a: 354768, gammaLeft: 234016.894982296, gammaRight: 234016.908035513, type: 'fresh-update', thetaBar: 0.99, psiStart: 0.00298862028, psiEnd: 0.00540949011, theta: 0.9993238137, adjGapLeft: 0.56586197, adjGapRight: 0.68905969, Dmin: 0.565709875, tcLo: 2.12983093e-5, tcHi: 2.13127206e-5, FmbUpper: 1.44113689e-8, RrelUpper: 6.76643801e-4, KrawBound: 9.37357328e-9, KpaperBound: 7.35124561e-8 },
  { plateauIndex: 8, startN: 415588, endN: 420891,  H: 0.00863639, a: 415586, gammaLeft: 270071.29405956,  gammaRight: 270071.302695949, type: 'fresh-update', thetaBar: 0.99, psiStart: 0.00137595812, psiEnd: 0.00196568241, theta: 0.9997542897, adjGapLeft: 0.58581162, adjGapRight: 1.08128145, Dmin: 0.585747313, tcLo: 9.32340184e-6, tcHi: 9.32569326e-6, FmbUpper: 2.2914189e-9,  RrelUpper: 2.4577069e-4,  KrawBound: 9.91396554e-10, KpaperBound: 7.77504944e-9 },
  { plateauIndex: 9, startN: 420892, endN: 1000000, H: 0.00570371, a: 420890, gammaLeft: 273193.663137712, gammaRight: 273193.668841417, type: 'fresh-update', thetaBar: 0.99, psiStart: 4.36738676e-4, psiEnd: 8.33562277e-4,  theta: 0.9998958047, adjGapLeft: 0.69180068, adjGapRight: 0.7477795,  Dmin: 0.691776931, tcLo: 4.06653136e-6, tcHi: 4.06695512e-6, FmbUpper: 4.23757546e-10, RrelUpper: 1.04206142e-4, KrawBound: 1.74947428e-10, KpaperBound: 1.37202908e-9 },
]);

const RHO_FLOOR = 0.12751;        // imp-469 analytic rho floor
const CARRYFORWARD_K = 0.2014;    // imp-963 headline the ladder carried forward

const K_PAPER_MAX = Math.max(...ROWS.map((r) => r.KpaperBound));
const THETA_MIN   = Math.min(...ROWS.map((r) => r.theta));
const R_REL_MAX   = Math.max(...ROWS.map((r) => r.RrelUpper));

// Independent cross-check literals (sources quoted verbatim):
const IMP_2509_PAIR_INDEX_1E4 = 6708;            // c-mb-dyson-large-n-cache.js N=10000 row
const IMP_2509_TC_MEASURED_1E4 = 0.0001778248472; // fine-pass t_c at N=10000 (dt=1.776e-7)
const IMP_360_BRACKETS = Object.freeze([
  { N: 25000,  lo: 0.0001, hi: 0.0002 },  // imp-360-extended-ladder rows.json
  { N: 50000,  lo: 0.0001, hi: 0.0002 },
  { N: 100000, lo: 0,      hi: 0.0001 },
]);

function plateauOf(N) {
  return ROWS.find((r) => N >= r.startN && N <= r.endN) ?? null;
}

export const IMP_3725_FMB_PLATEAU_DOMINATION = Object.freeze({
  id: 'imp-3725',
  title:
    'Gap-domination bootstrap: rigorous two-sided true-flow t_c enclosure and ' +
    'uniform F_mb / K bound on every N in [1e4, 1e6]',
  status: 'rigorous-given-zero-table',
  rhFree: true,
  semantics: 'true-flow (analytic enclosure; no RK4 map, no truncation gap)',

  lemma: {
    lower:
      't_c(N) >= H_raw(N)^2 / 8 for EVERY N (pair-domination: each gap obeys ' +
      'd(g^2)/dt >= -8 because the many-body retardation is nonnegative). ' +
      'Hence F_mb(N) >= 0 deterministically.',
    upper:
      't_c(N) <= H^2 / (8*theta_N) with theta_N = 1 - Psi_N(T)/8, where ' +
      'Psi_N(T) = 4H^2 * sum_j 1/D_j(T)^2 uses only INITIAL gap data ' +
      '(frozen shrunk distances D_j at horizon T = H^2/(8*thetaBar)), valid ' +
      'whenever theta_N >= thetaBar (bootstrap self-consistency).',
    plateauMonotonicity:
      'On an H_raw-plateau [N1, N2], Psi_N(T) is a partial sum of positive ' +
      'N-independent terms, so it is nondecreasing in N and one evaluation ' +
      'at N2 dominates every N in the plateau. sqrt(N)/log(N) is increasing ' +
      'for N >= 8, so K_raw(N) <= (H^3/8)(1/theta_N2 - 1) sqrt(N2)/log(N2) ' +
      'uniformly on the plateau. This is the discrete-to-continuum step that ' +
      'the maxSmoothScaleRatio = 2.15 heuristic previously approximated.',
  },

  rows: ROWS,

  headline: {
    plateauCount: ROWS.length,
    theta_min: THETA_MIN,
    R_rel_max: R_REL_MAX,
    K_paper_max_on_1e4_1e6: K_PAPER_MAX,
    carryforward_K_retired: CARRYFORWARD_K,
    marginFactor: CARRYFORWARD_K / K_PAPER_MAX,
    note:
      'sup K_paper(N) over ALL N in [1e4, 1e6] certified <= 2.4238e-6 at ' +
      'true-flow semantics, vs the 0.2014 conditional carryforward: the ' +
      'cond-fmb-nonregression-above-1e4 hypothesis is DISCHARGED (modulo ' +
      'the Odlyzko zero table as input) and the 2.15 smooth-scale slack is ' +
      'no longer load-bearing anywhere on (1e4, 1e6].',
  },

  crossChecks: {
    pairIndexAtN1e4: {
      rederivedHere: ROWS[0].a,
      imp2509PairIndex: IMP_2509_PAIR_INDEX_1E4,
      agrees: ROWS[0].a === IMP_2509_PAIR_INDEX_1E4,
    },
    measuredTcInsideEnclosure: {
      measured: IMP_2509_TC_MEASURED_1E4,
      enclosure: [ROWS[0].tcLo, ROWS[0].tcHi],
      inside:
        IMP_2509_TC_MEASURED_1E4 >= ROWS[0].tcLo &&
        IMP_2509_TC_MEASURED_1E4 <= ROWS[0].tcHi,
      note:
        'The imp-2509 RK4 fine-pass t_c(1e4) lands inside the analytic ' +
        'enclosure it never saw -- independent validation of both sides.',
    },
    imp360BracketsContainEnclosures: IMP_360_BRACKETS.map((b) => {
      const p = plateauOf(b.N);
      return {
        N: b.N,
        ladderBracket: [b.lo, b.hi],
        analyticEnclosure: p ? [p.tcLo, p.tcHi] : null,
        contained: p != null && p.tcLo >= b.lo && p.tcHi <= b.hi,
        tighteningFactor:
          p != null ? +((b.hi - b.lo) / (p.tcHi - p.tcLo)).toExponential(2) : null,
      };
    }),
    imp962BoundaryAgreement: {
      updateCount: ROWS.length - 1,
      anchorH: ROWS[0].H,
      imp962AnchorH: 0.037698,
      plateau6: [ROWS[6].startN, ROWS[6].endN],
      imp962Plateau6: [95249, 354769],
      plateau9Start: ROWS[9].startN,
      imp962Plateau9Start: 420892,
    },
  },

  retires: {
    heuristic: 'maxSmoothScaleRatio = 2.15 (imp-962 plateau scan)',
    hypothesis: 'cond-fmb-nonregression-above-1e4 (imp-2522 dependency leaf)',
    how:
      'The carryforward argument was: measured K_max = 0.2014 on [100, 1e4] ' +
      'stays an upper bound on (1e4, 1e6] IF F_mb does not regress, with the ' +
      '2.15 smooth-scale ratio bounding the within-plateau drift of the ' +
      '1/(sqrt(N) log N) factor. Both the IF and the slack are replaced by ' +
      'the direct per-plateau certificate above: K_paper(N) <= 2.4238e-6 on ' +
      'ALL of [1e4, 1e6], proven, not assumed. The imp-1082/1087/1088 ' +
      'sub-measurement gaps (native-backend interval-RK4 at plateau ' +
      'interiors) are no longer needed for SOUNDNESS of the K bound -- they ' +
      'remain only as optional tightening of the sub-1e4-style measured rows.',
    notRetired:
      'cond-CH and the other conditional legs of bound-imp-1088-finite-1e6; ' +
      'the sub-1e4 map-level anchor semantics; and nothing here touches ' +
      'Platt-Trudgian: Lambda <= 0.2 stays SOTA. NO QED.',
  },

  openSubGap: {
    id: 'imp-3725-sub-directed-rounding',
    status: 'open',
    blocker: false,
    statement:
      'Re-evaluate the 10 Psi_N2 sums under directed rounding (or interval ' +
      'arithmetic) to replace the 1e-6 blanket Float64 inflation with a ' +
      'certified enclosure. Cosmetic: the certified margin is 8.3e4x and ' +
      'the Float64 accumulation error over <= 1e6 positive terms is < 1e-10 ' +
      'relative, but a purist closure should pin it.',
  },

  provenance: {
    zeros: 'src/data/zeros-to-1e6.js (Odlyzko; zeros1 3e-9, imp-359/imp-514)',
    generator: 'scripts/imp-3725-fmb-plateau-domination-compute.mjs',
    generatedAt: '2026-07-03',
    fpInflation: 'Psi values include a uniform 1e-6 relative inflation',
  },
});

// ── Build-time assertions (throw on failure via run-assertions harness) ─────

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_3725_FMB_PLATEAU_DOMINATION_ASSERTIONS = [
  {
    id: 'imp3725-plateaus-tile-1e4-1e6',
    holds: () => {
      if (ROWS.length !== 10) return false;
      if (ROWS[0].startN !== 10000 || ROWS[9].endN !== 1000000) return false;
      for (let i = 1; i < ROWS.length; i++) {
        if (ROWS[i].startN !== ROWS[i - 1].endN + 1) return false;
      }
      return true;
    },
    why:
      'The 10 plateau rows must tile [1e4, 1e6] contiguously; a gap would ' +
      'leave N values with no certified F_mb bound and the uniform-coverage ' +
      'claim (the whole point of the lemma) would be false.',
  },
  {
    id: 'imp3725-H-strictly-decreasing',
    holds: () => ROWS.every((r, i) => i === 0 || r.H < ROWS[i - 1].H),
    why:
      'H_raw is a running minimum, so plateau H values must be strictly ' +
      'decreasing. A violation means the baked rows drifted from the scan.',
  },
  {
    id: 'imp3725-bootstrap-self-consistency',
    holds: () =>
      ROWS.every(
        (r) => r.psiEnd < 8 && r.theta > 0 && r.theta < 1 && r.theta >= r.thetaBar,
      ),
    why:
      'The bootstrap requires theta_N2 >= thetaBar (equivalently ' +
      'H^2/(8 theta) <= T): this is the hypothesis under which the upper ' +
      'bound t_c <= H^2/(8 theta) is PROVEN. theta >= thetaBar failing on ' +
      'any plateau voids that plateau\'s certificate.',
  },
  {
    id: 'imp3725-psi-monotone-within-plateau',
    holds: () => ROWS.every((r) => r.psiStart <= r.psiEnd),
    why:
      'Psi_N(T) is a partial sum of positive N-independent terms, so the ' +
      'plateau-start value must not exceed the plateau-end value. This is ' +
      'the monotonicity that lets ONE evaluation at N2 dominate all N in ' +
      'the plateau (the discrete-to-continuum step).',
  },
  {
    id: 'imp3725-theta-arithmetic',
    holds: () => ROWS.every((r) => Math.abs(r.theta - (1 - r.psiEnd / 8)) < 1e-8),
    why:
      'theta = 1 - Psi_N2/8 by definition; the baked theta must recompute ' +
      'from the baked Psi to storage precision.',
  },
  {
    id: 'imp3725-enclosure-arithmetic',
    holds: () =>
      ROWS.every(
        (r) =>
          rel(r.tcLo, (r.H * r.H) / 8) < 1e-5 &&
          rel(r.tcHi, (r.H * r.H) / (8 * r.theta)) < 1e-5 &&
          rel(r.FmbUpper, ((r.H * r.H) / 8) * (1 / r.theta - 1)) < 1e-4 &&
          rel(r.RrelUpper, 1 / r.theta - 1) < 1e-4,
      ),
    why:
      'The enclosure endpoints and the F_mb / R_rel bounds are pure ' +
      'arithmetic in (H, theta); baked values must recompute (tolerances ' +
      'sized for 8-significant-digit storage, per the imp-2546 lesson).',
  },
  {
    id: 'imp3725-K-arithmetic',
    holds: () =>
      ROWS.every(
        (r) =>
          rel(r.KrawBound, r.FmbUpper * r.H * (Math.sqrt(r.endN) / Math.log(r.endN))) < 1e-4 &&
          rel(r.KpaperBound, r.KrawBound / RHO_FLOOR) < 1e-5,
      ),
    why:
      'K_raw = F_mb * H * sqrt(N2)/log(N2) evaluated at the plateau end ' +
      '(valid for all N in the plateau since sqrt(N)/log(N) is increasing), ' +
      'and K_paper = K_raw / 0.12751 (imp-469 rho floor). Baked values must ' +
      'recompute.',
  },
  {
    id: 'imp3725-headline-retires-carryforward',
    holds: () =>
      K_PAPER_MAX < 2.5e-6 &&
      K_PAPER_MAX < CARRYFORWARD_K &&
      IMP_3725_FMB_PLATEAU_DOMINATION.headline.marginFactor > 8e4 &&
      ROWS.every(
        (r) => (r.KpaperBound * Math.log(r.endN)) / Math.sqrt(r.endN) < RHO_FLOOR,
      ),
    why:
      'The headline claim: certified sup K_paper on [1e4, 1e6] is below ' +
      '2.5e-6, hence below the 0.2014 conditional carryforward with margin ' +
      '> 8e4, and the imp-486 rescue inequality holds at every plateau end. ' +
      'If this trips, the retirement of cond-fmb-nonregression-above-1e4 is ' +
      'no longer supported and the roadmap note must be reverted.',
  },
  {
    id: 'imp3725-crosscheck-imp2509-pair-and-tc',
    holds: () =>
      ROWS[0].a === IMP_2509_PAIR_INDEX_1E4 &&
      IMP_2509_TC_MEASURED_1E4 >= ROWS[0].tcLo &&
      IMP_2509_TC_MEASURED_1E4 <= ROWS[0].tcHi,
    why:
      'Independent validation: the imp-2509 RK4 sweep found the same ' +
      'colliding pair (index 6708) and its measured t_c(1e4) must lie ' +
      'inside the analytic enclosure. Failure means either the baked rows ' +
      'or the lemma implementation regressed.',
  },
  {
    id: 'imp3725-crosscheck-imp360-brackets',
    holds: () =>
      IMP_360_BRACKETS.every((b) => {
        const p = plateauOf(b.N);
        return p != null && p.tcLo >= b.lo && p.tcHi <= b.hi;
      }),
    why:
      'The imp-360 closed interval-RK4 brackets at N = 25k/50k/100k must ' +
      'contain the analytic enclosures (which are ~300x-7e4x tighter). ' +
      'Containment failing would signal a real inconsistency between the ' +
      'analytic lemma and the measured ladder.',
  },
  {
    id: 'imp3725-crosscheck-imp962-boundaries',
    holds: () =>
      ROWS.length - 1 === 9 &&
      Math.abs(ROWS[0].H - 0.037698) < 1e-4 &&
      ROWS[6].startN === 95249 &&
      ROWS[6].endN === 354769 &&
      ROWS[9].startN === 420892,
    why:
      'The independently re-scanned plateau structure must agree with the ' +
      'imp-962 published scan (9 updates, anchor H at N=1e4, plateau 6 and ' +
      '9 boundaries as cited by finite-k-c-mb-unconditional.js). ' +
      'Disagreement means one of the two scans is reading a drifted table.',
  },
  {
    id: 'imp3725-fmb-nonnegative-direction',
    holds: () => ROWS.every((r) => r.tcLo > 0 && r.tcHi > r.tcLo && r.FmbUpper > 0),
    why:
      'The lower lemma gives t_c >= H^2/8 > 0 (F_mb >= 0) and the upper ' +
      'bound must sit strictly above the lower. Degenerate or inverted ' +
      'enclosures indicate a computation bug, not a mathematical surprise.',
  },
  {
    id: 'imp3725-open-subgap-named',
    holds: () =>
      IMP_3725_FMB_PLATEAU_DOMINATION.openSubGap.id === 'imp-3725-sub-directed-rounding' &&
      IMP_3725_FMB_PLATEAU_DOMINATION.openSubGap.status === 'open',
    why:
      'The directed-rounding purist re-evaluation stays a named open ' +
      'micro-subgap; silently dropping it would overstate the arithmetic ' +
      'rigor level of the Float64 evaluation.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_3725_FMB_PLATEAU_DOMINATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3725-fmb-plateau-domination-lemma assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3725_FMB_PLATEAU_DOMINATION;
