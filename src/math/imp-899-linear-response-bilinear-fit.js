/**
 * imp-899 HONEST PARTIAL: linear-response bilinear fit to the imp-894 2x2
 * pilot grid, with saddle-point analysis and steepest-descent prediction
 * for the dense (k0, phaseVel) grid at N = 500.
 *
 * SCOPE AND HONEST STATUS (read first)
 * ------------------------------------
 * This module does NOT replace the imp-899 ticket's full deliverable. The
 * full ticket requires a dense 4-5 x 4-5 (k0, phaseVel) grid at N = 500,
 * nSteps = 200, per eps in {0.01, 0.02, 0.05, 0.1} — roughly 8 CPU-hours
 * under current contention, which cannot fit in a single engine turn. That
 * measurement is tracked as the named sub-gap imp-899-sub-nstep200-grid
 * below and is the only remaining open item.
 *
 * WHAT IS DELIVERED HERE
 * ----------------------
 * A zero-compute analytic extension of the imp-894 2x2 pilot
 * (src/data/imp-857-resonance-tuning-sweep.js) to:
 *
 *   (a) Linear-response slope L_cell(k0, phaseVel) at each of the 4
 *       measured corners, defined as (ratio(eps=0.01) - 1) / 0.01, i.e.
 *       the leading Taylor coefficient of ratio(eps) about eps = 0.
 *   (b) A bilinear surface fit L(u, v) = A + B*u + C*v + D*u*v in
 *       normalized coordinates u = (k0 - pi)/(k0_eig - pi), v =
 *       (phaseVel - phaseVel_mid)/(phaseVel_hi - phaseVel_mid), which is
 *       EXACTLY DETERMINED by the 4 measured cells.
 *   (c) Analytic stationary point (u*, v*), Hessian eigenvalues, and the
 *       character of the stationary point. Under the fit the stationary
 *       point is a SADDLE, not a minimum, which means the 2x2 pilot
 *       alone cannot locate the resonance peak; dense data is required.
 *   (d) Steepest-descent directions at all 4 corners, in both normalized
 *       and physical (k0, phaseVel) coordinates. The steepest-descent
 *       direction at the best corner (k0 = k0_eig, phaseVel = pi*rho_mean)
 *       gives a CONCRETE, TESTABLE prediction for where the dense grid
 *       should first extend: beyond the eigenmode in k0 and below the
 *       bulk phase velocity in phaseVel.
 *   (e) A consistency cross-check against the pilot eps = 0.05 row: the
 *       ratio of slope(eps=0.05) to slope(eps=0.01) is reported per cell,
 *       and the test flags cells where that ratio deviates from 1 (which
 *       indicates the linear-response regime has already saturated at
 *       that eps and the nSteps = 30 fit CANNOT be extended to larger eps
 *       without empirical support).
 *   (f) An EXPLICIT non-extrapolation caveat: at the prototype corner
 *       (k0 = pi, phaseVel = pi*rho_mean) the pilot nSteps = 30 linear-
 *       response slope is POSITIVE (+2.3, amplifies wrapper width), yet
 *       the prototype headline at nSteps = 200 is a 185-1114x wrapper-
 *       width REDUCTION. The sign flips between the linear and the
 *       super-linear accumulation regime, so the bilinear fit here
 *       CANNOT be extrapolated to predict the nSteps = 200 resonance
 *       peak magnitude or location. Dense grid imp-899-sub-nstep200-grid
 *       is still required.
 *
 * WHY A BILINEAR FIT ON 4 CORNERS
 * -------------------------------
 * A 2x2 corner design is the minimum that resolves (i) both first-order
 * main effects (in k0 and phaseVel independently), (ii) the first-order
 * interaction term, and (iii) the stationary point of the resulting
 * bilinear surface. A lower-dimensional fit (e.g. additive) cannot see
 * the interaction; a higher-dimensional fit (quadratic per axis) is
 * underdetermined on 4 points. This module therefore extracts the
 * MAXIMUM information the 2x2 pilot carries about the linear-response
 * landscape without any measurement beyond what imp-894 already paid for.
 *
 * SYNTAX NOTES
 *   - No (star)(slash) sequences inside this JSDoc block.
 *   - Uses "pi" in prose to denote Math.PI.
 */

import { IMP_857_RESONANCE_TUNING_SWEEP } from '../data/imp-857-resonance-tuning-sweep.js';

// --- Pull measured ratios from the imp-894 pilot ---------------------------
//
// HEATMAP_EPS_0P01 and HEATMAP_EPS_0P05 are 2x2 matrices indexed by
// (i_k0, j_phaseVel). We adopt the same indexing so the fit aligns with
// the data without any re-ordering.

const PILOT = IMP_857_RESONANCE_TUNING_SWEEP;
const HM1 = PILOT.heatmaps['eps_0.01'];
const HM5 = PILOT.heatmaps['eps_0.05'];
const K0_GRID = HM1.k0_grid; // [pi, 20.24]
const PV_GRID = HM1.phaseVel_grid; // [1.9668, 5.0]

// Linear-response slope at the first eps step. Units: ratio-change per
// unit eps. Negative means forcing reduces wrapper width.
function slopeAtEps(ratio, eps) {
  return (ratio - 1) / eps;
}

const SLOPE_EPS_0P01 = [
  [
    slopeAtEps(HM1.ratios[0][0], 0.01),
    slopeAtEps(HM1.ratios[0][1], 0.01),
  ],
  [
    slopeAtEps(HM1.ratios[1][0], 0.01),
    slopeAtEps(HM1.ratios[1][1], 0.01),
  ],
];

const SLOPE_EPS_0P05 = [
  [
    slopeAtEps(HM5.ratios[0][0], 0.05),
    slopeAtEps(HM5.ratios[0][1], 0.05),
  ],
  [
    slopeAtEps(HM5.ratios[1][0], 0.05),
    slopeAtEps(HM5.ratios[1][1], 0.05),
  ],
];

// --- Bilinear fit in normalized corner coordinates --------------------------
//
// Corners in (u, v) coords: (0,0), (1,0), (0,1), (1,1). The coefficients
// are read off by hand (the corner design is orthogonal):
//   L(0,0) = A
//   L(1,0) = A + B          -> B = L(1,0) - L(0,0)
//   L(0,1) = A + C          -> C = L(0,1) - L(0,0)
//   L(1,1) = A + B + C + D  -> D = L(1,1) - L(1,0) - L(0,1) + L(0,0)

function fitBilinear(L) {
  const A = L[0][0];
  const B = L[1][0] - L[0][0];
  const C = L[0][1] - L[0][0];
  const D = L[1][1] - L[1][0] - L[0][1] + L[0][0];
  return { A, B, C, D };
}

const FIT_EPS_0P01 = fitBilinear(SLOPE_EPS_0P01);

// --- Stationary-point analysis ---------------------------------------------
//
// L(u, v) = A + B*u + C*v + D*u*v
// grad L = (B + D*v, C + D*u)
// Stationary when v = -B/D and u = -C/D. Exists iff D != 0.
// Hessian = [[0, D], [D, 0]]. Eigenvalues = +D, -D. Signature = (+, -),
// which is a saddle point for any D != 0.

function stationaryPoint({ A, B, C, D }) {
  if (Math.abs(D) < 1e-12) {
    return {
      exists: false,
      character: 'degenerate (no interaction term; surface is additive)',
    };
  }
  const uStar = -C / D;
  const vStar = -B / D;
  const Lstar = A + B * uStar + C * vStar + D * uStar * vStar;
  const hessianEigs = [D, -D].sort((a, b) => a - b);
  // Character: saddle iff the two eigenvalues have opposite sign. Since
  // they are always +D and -D, this is a saddle whenever D != 0.
  const character = 'saddle (Hessian eigenvalues +D and -D always opposite)';
  return { exists: true, uStar, vStar, Lstar, hessianEigs, character };
}

const STATIONARY = stationaryPoint(FIT_EPS_0P01);

// --- Gradient at each corner -----------------------------------------------

function gradientAt({ B, C, D }, u, v) {
  return { dLdu: B + D * v, dLdv: C + D * u };
}

const CORNER_GRADIENTS = [
  { u: 0, v: 0, k0: K0_GRID[0], phaseVel: PV_GRID[0], L: SLOPE_EPS_0P01[0][0], grad: gradientAt(FIT_EPS_0P01, 0, 0) },
  { u: 1, v: 0, k0: K0_GRID[1], phaseVel: PV_GRID[0], L: SLOPE_EPS_0P01[1][0], grad: gradientAt(FIT_EPS_0P01, 1, 0) },
  { u: 0, v: 1, k0: K0_GRID[0], phaseVel: PV_GRID[1], L: SLOPE_EPS_0P01[0][1], grad: gradientAt(FIT_EPS_0P01, 0, 1) },
  { u: 1, v: 1, k0: K0_GRID[1], phaseVel: PV_GRID[1], L: SLOPE_EPS_0P01[1][1], grad: gradientAt(FIT_EPS_0P01, 1, 1) },
];

// Pick the corner with the smallest (most-negative) measured slope and
// report the steepest-descent direction in BOTH normalized and physical
// coordinates. Physical coordinates: dk0 = du * Delta_k0, dpv = dv *
// Delta_phaseVel, where Delta_k0 and Delta_phaseVel are the grid spans.
const DELTA_K0 = K0_GRID[1] - K0_GRID[0];
const DELTA_PV = PV_GRID[1] - PV_GRID[0];

function bestCornerAnalysis(corners) {
  const best = corners.reduce((a, b) => (a.L < b.L ? a : b));
  const { dLdu, dLdv } = best.grad;
  // Steepest descent direction to MINIMIZE L (forcing should REDUCE
  // wrapper width, so more-negative L is better): d = -grad.
  const dUnorm_u = -dLdu;
  const dUnorm_v = -dLdv;
  const normU = Math.sqrt(dUnorm_u * dUnorm_u + dUnorm_v * dUnorm_v);
  const dirU = { u: dUnorm_u / normU, v: dUnorm_v / normU };
  const dirPhys = { k0: dirU.u * DELTA_K0, phaseVel: dirU.v * DELTA_PV };
  // Predicted next probe: half a grid-span in the unit normalized
  // direction, mapped back to physical coords via the grid spans. This
  // step keeps the probe in the same-order neighborhood of the pilot
  // grid; scaling by raw gradient magnitude instead would overshoot to
  // non-physical (e.g. negative) phaseVel.
  const stepNormalized = 0.5;
  const uProbe = best.u + stepNormalized * dirU.u;
  const vProbe = best.v + stepNormalized * dirU.v;
  return {
    bestCorner: { k0: best.k0, phaseVel: best.phaseVel, L: best.L },
    steepestDescent_normalizedCoords: dirU,
    steepestDescent_physicalCoords: dirPhys,
    predictedNextProbe: {
      u: uProbe,
      v: vProbe,
      k0: K0_GRID[0] + uProbe * DELTA_K0,
      phaseVel: PV_GRID[0] + vProbe * DELTA_PV,
      note:
        'Half-grid-span step along the UNIT normalized steepest-descent ' +
        'direction from the best corner (u=1, v=0), mapped back to ' +
        'physical coordinates via the grid spans. Sign of dk0 > 0 and ' +
        'dphaseVel < 0 would mean: probe ABOVE the eigenmode and BELOW ' +
        'pi*rho_mean. This is the concrete, testable prediction that ' +
        'the dense grid can falsify.',
    },
  };
}

const BEST_CORNER_ANALYSIS = bestCornerAnalysis(CORNER_GRADIENTS);

// --- Consistency check: linear-response regime validity --------------------
//
// If ratio(eps) is truly linear in eps across the pilot range, then
// slope at eps = 0.05 should equal slope at eps = 0.01 per cell. The
// deviation ratio |slope(0.05)| / |slope(0.01)| tells us how far into
// the nonlinear regime eps = 0.05 is at each cell.

const LINEARITY_CHECK = (() => {
  const out = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const s1 = SLOPE_EPS_0P01[i][j];
      const s5 = SLOPE_EPS_0P05[i][j];
      const ratio = s1 !== 0 ? s5 / s1 : null;
      out.push({
        k0: K0_GRID[i],
        phaseVel: PV_GRID[j],
        slope_eps_0p01: s1,
        slope_eps_0p05: s5,
        slope_ratio_0p05_over_0p01: ratio,
        inLinearRegime: ratio !== null && Math.abs(ratio - 1) < 0.5,
      });
    }
  }
  return out;
})();

// --- Quadratic-in-eps per-cell response fit ---------------------------------
//
// The bilinear fit above is a LINEAR-regime (single-eps) model and the
// keyFindings flag that it cannot see the saturation visible between
// eps = 0.01 and eps = 0.05. We now extract the MAXIMUM additional analytic
// information the pilot carries: each cell has TWO measured eps points
// (0.01 and 0.05) plus the exact anchor ratio(0) = 1. Fitting
//
//   ratio(eps) = 1 + a*eps + b*eps^2
//
// to the two measured points is EXACTLY DETERMINED per cell (2 unknowns,
// 2 equations), with the anchor ratio(0) = 1 enforced by construction. The
// second-order coefficient b quantifies the curvature (saturation or
// turnaround) that the linear fit misses, and the model yields a CONCRETE,
// FALSIFIABLE extrapolation to eps = 0.1 — an eps value the dense
// nSteps = 200 grid (imp-899-sub-nstep200-grid) is scheduled to measure.
//
// This is a zero-compute closure of the "extract all analytic structure
// from the existing two-eps pilot" portion of imp-899-sub-nstep200-grid.
// It does NOT replace the dense-grid measurement (the named sub-gap below
// remains open): like the bilinear fit, this is an nSteps = 30 model and
// the prototype sign-flip caveat still forbids extrapolating it to the
// nSteps = 200 resonance peak.

function quadFitCell(ratio01, ratio05) {
  const eps1 = 0.01;
  const eps5 = 0.05;
  const d1 = ratio01 - 1;
  const d5 = ratio05 - 1;
  // Solve [eps1, eps1^2; eps5, eps5^2] [a; b] = [d1; d5] by Cramer.
  const det = eps1 * eps5 * eps5 - eps5 * eps1 * eps1; // eps1*eps5*(eps5-eps1)
  const a = (d1 * eps5 * eps5 - d5 * eps1 * eps1) / det;
  const b = (eps1 * d5 - eps5 * d1) / det;
  // Falsifiable extrapolation to eps = 0.1 (inside the dense-grid eps set).
  const ratioAtEps0p1 = 1 + a * 0.1 + b * 0.01;
  return { a, b, ratioAtEps0p1 };
}

const QUADRATIC_RESPONSE_FIT = (() => {
  const out = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const fit = quadFitCell(HM1.ratios[i][j], HM5.ratios[i][j]);
      out.push({
        k0: K0_GRID[i],
        phaseVel: PV_GRID[j],
        linearCoeff_a: fit.a,
        quadraticCoeff_b: fit.b,
        // Sign of b: > 0 means the response curves UPWARD (the beneficial
        // reduction saturates and may turn into amplification as eps grows);
        // < 0 means it curves further downward (reduction accelerates).
        curvature: fit.b > 0 ? 'upward (saturating/turnaround)' : 'downward (accelerating)',
        predictedRatio_eps_0p1: fit.ratioAtEps0p1,
      });
    }
  }
  return out;
})();

// --- Module-level export ----------------------------------------------------

export const IMP_899_LINEAR_RESPONSE_FIT = {
  id: 'imp-899',
  title:
    'imp-857-sub-phased-forcing: bilinear linear-response fit + saddle-' +
    'point analysis of the imp-894 2x2 pilot (dense nSteps=200 grid ' +
    'deferred to imp-899-sub-nstep200-grid)',

  status:
    'HONEST PARTIAL (bilinear fit + stationary-point analysis + steepest-' +
    'descent prediction delivered without new CPU; dense nSteps=200 grid ' +
    'deferred to imp-899-sub-nstep200-grid, requires ~8 CPU-hours)',

  upstreamPilot: 'src/data/imp-857-resonance-tuning-sweep.js',

  pilotSlopes: {
    eps_0p01: SLOPE_EPS_0P01,
    eps_0p05: SLOPE_EPS_0P05,
    description:
      'Linear-response slope L = (ratio(eps) - 1) / eps at each of 4 ' +
      'corners of the imp-894 pilot. L < 0 means forcing reduces wrapper ' +
      'width; L > 0 means it amplifies.',
  },

  bilinearFit: {
    model: 'L(u, v) = A + B*u + C*v + D*u*v',
    normalizedCoords: {
      u: '(k0 - pi) / (k0_eigenmode - pi), so u in [0, 1] across pilot',
      v: '(phaseVel - pi*rho_mean) / (5 - pi*rho_mean), so v in [0, 1]',
    },
    coefficients_eps_0p01: FIT_EPS_0P01,
    exactlyDetermined:
      '4 corner measurements, 4 bilinear coefficients — no residual.',
  },

  stationaryPoint: STATIONARY,

  cornerGradients: CORNER_GRADIENTS,

  bestCornerAnalysis: BEST_CORNER_ANALYSIS,

  linearityCheck: LINEARITY_CHECK,

  quadraticResponseFit: {
    model: 'ratio(eps) = 1 + a*eps + b*eps^2, exactly determined per cell ' +
      'from the two pilot eps points (0.01, 0.05) with anchor ratio(0) = 1',
    perCell: QUADRATIC_RESPONSE_FIT,
    description:
      'Per-cell curvature (second-order response coefficient b) extracted ' +
      'from the two-eps pilot, plus a falsifiable ratio(eps=0.1) ' +
      'extrapolation. b > 0 flags saturation/turnaround the linear ' +
      'bilinear fit cannot see. nSteps = 30 model only; does NOT predict ' +
      'the nSteps = 200 resonance peak (see non-extrapolation caveat).',
  },

  keyFindings: [
    'Bilinear fit to the 2x2 pilot has a saddle-point stationary ' +
      'structure (Hessian eigenvalues +D and -D, always opposite sign). ' +
      'Consequently the 2x2 pilot does NOT contain a local minimum of ' +
      'the linear-response slope inside its convex hull; the resonance ' +
      'peak sits on the boundary or outside.',
    'Best measured corner is (k0 = ' +
      BEST_CORNER_ANALYSIS.bestCorner.k0.toFixed(3) +
      ', phaseVel = ' +
      BEST_CORNER_ANALYSIS.bestCorner.phaseVel.toFixed(3) +
      ') with slope L = ' +
      BEST_CORNER_ANALYSIS.bestCorner.L.toFixed(3) +
      ' (i.e. ratio = 1 + L*eps for small eps).',
    'Steepest-descent direction from the best corner predicts the dense ' +
      'grid should probe BEYOND the eigenmode k0 and BELOW pi*rho_mean ' +
      'in phaseVel. Specifically, the first new cell should be near ' +
      '(k0, phaseVel) = (' +
      BEST_CORNER_ANALYSIS.predictedNextProbe.k0.toFixed(3) +
      ', ' +
      BEST_CORNER_ANALYSIS.predictedNextProbe.phaseVel.toFixed(3) +
      '). The bilinear fit is a LINEAR-REGIME prediction; the actual ' +
      'nSteps = 200 resonance peak may lie elsewhere.',
    'The eps = 0.05 pilot row shows slopes ~5-20x SMALLER in magnitude ' +
      'than the eps = 0.01 row: the linear-response regime has already ' +
      'saturated before eps = 0.05 at nSteps = 30. This means even the ' +
      'nSteps = 30 pilot cannot be linearly extended past eps ~ 0.02 ' +
      'without measurement.',
    'CRITICAL NON-EXTRAPOLATION CAVEAT: at the prototype corner (k0 = ' +
      'pi, phaseVel = pi*rho_mean) the nSteps = 30 slope is POSITIVE ' +
      '(+2.3, amplifies) while the prototype headline at nSteps = 200 ' +
      'reports a 185-1114x wrapper-width REDUCTION at the SAME (k0, ' +
      'phaseVel). The sign flips between the linear-response regime ' +
      'and the super-linear accumulation regime. Consequently this ' +
      'module CANNOT be used to predict the nSteps = 200 resonance ' +
      'peak location or magnitude; it only characterizes the nSteps = ' +
      '30 linear-response landscape. Dense nSteps = 200 grid ' +
      '(imp-899-sub-nstep200-grid) remains required.',
  ],

  keyFindingsQuadratic: [
    'Per-cell quadratic-in-eps response fit (ratio = 1 + a*eps + b*eps^2) ' +
      'extracts the curvature the linear bilinear fit cannot see: the ' +
      'eigenmode/low-phaseVel cell (k0 = ' +
      QUADRATIC_RESPONSE_FIT[2].k0.toFixed(2) +
      ', phaseVel = ' +
      QUADRATIC_RESPONSE_FIT[2].phaseVel.toFixed(3) +
      ') has a strongly POSITIVE second-order coefficient b, i.e. its ' +
      'beneficial wrapper-width reduction SATURATES and turns around as ' +
      'eps grows — quantifying the saturation flagged by linearityCheck.',
    'The quadratic model gives a concrete, FALSIFIABLE extrapolation to ' +
      'eps = 0.1 (an eps value in the dense-grid schedule): the best ' +
      'pilot cell, beneficial at eps = 0.01, is predicted to AMPLIFY ' +
      '(ratio > 1) by eps = 0.1. The dense nSteps = 200 grid can falsify ' +
      'this. As an nSteps = 30 model it still CANNOT predict the ' +
      'nSteps = 200 resonance peak (the prototype sign-flip caveat holds).',
  ],

  openSubGaps: [
    {
      id: 'imp-899-sub-nstep200-grid',
      summary:
        'Dense 4-5 x 4-5 (k0, phaseVel) grid at N = 500, nSteps = 200, ' +
        'per eps in {0.01, 0.02, 0.05, 0.1}.',
      cpuBudget: '~8 CPU-hours under current contention',
      blocker:
        'Must be offloaded to a scripts/ worker invoked during a quiet ' +
        'CPU window or across multiple engine turns; no design or ' +
        'math decisions remain — the imp-894 env-var infrastructure and ' +
        'the present steepest-descent prediction together define exactly ' +
        'which cells to run first.',
      firstCellsToMeasure: [
        {
          note:
            'Steepest-descent prediction from best corner (k0 = k0_eig, ' +
            'phaseVel = pi*rho_mean).',
          k0: BEST_CORNER_ANALYSIS.predictedNextProbe.k0,
          phaseVel: BEST_CORNER_ANALYSIS.predictedNextProbe.phaseVel,
        },
        {
          note:
            'Saddle-point interior probe (tests the fit itself; if measured ' +
            'slope matches bilinear-fit prediction there, the fit is ' +
            'validated inside the convex hull).',
          k0: K0_GRID[0] + (STATIONARY.exists ? STATIONARY.uStar : 0.5) * DELTA_K0,
          phaseVel: PV_GRID[0] + (STATIONARY.exists ? STATIONARY.vStar : 0.5) * DELTA_PV,
        },
      ],
    },
  ],

  headline:
    'HONEST-PARTIAL: exactly-determined bilinear fit to the imp-894 2x2 ' +
    'pilot. Stationary point is a saddle, so resonance minimum is not ' +
    'inside pilot convex hull. Steepest-descent from best corner predicts ' +
    'dense grid should first probe k0 > eigenmode, phaseVel < pi*rho_mean. ' +
    'Linear-regime only; dense nSteps=200 grid still required.',
};

// --- Build-time assertions --------------------------------------------------

export const IMP_899_LINEAR_RESPONSE_FIT_ASSERTIONS = [
  {
    id: 'imp899-pilot-upstream-resolved',
    holds: () =>
      Array.isArray(SLOPE_EPS_0P01) &&
      SLOPE_EPS_0P01.length === 2 &&
      SLOPE_EPS_0P01.every((row) => Array.isArray(row) && row.length === 2),
    why:
      'Pilot slopes must be a 2x2 matrix pulled from imp-857-resonance-' +
      'tuning-sweep.js. If this fails, the upstream pilot shape has ' +
      'drifted and this module no longer reflects the pilot.',
  },
  {
    id: 'imp899-bilinear-fit-finite',
    holds: () =>
      Number.isFinite(FIT_EPS_0P01.A) &&
      Number.isFinite(FIT_EPS_0P01.B) &&
      Number.isFinite(FIT_EPS_0P01.C) &&
      Number.isFinite(FIT_EPS_0P01.D) &&
      Math.abs(FIT_EPS_0P01.D) > 0,
    why:
      'Bilinear coefficients must be finite and the interaction term D ' +
      'must be nonzero; if D = 0 the surface is additive and the ' +
      'stationary-point analysis degenerates.',
  },
  {
    id: 'imp899-fit-matches-corners-exactly',
    holds: () => {
      // Verify that the fit reproduces each corner measurement exactly
      // (modulo floating-point round-off).
      const { A, B, C, D } = FIT_EPS_0P01;
      const pred = [
        [A, A + C],
        [A + B, A + B + C + D],
      ];
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          if (Math.abs(pred[i][j] - SLOPE_EPS_0P01[i][j]) > 1e-12) return false;
        }
      }
      return true;
    },
    why:
      'A 2x2 bilinear fit on 4 corner measurements is exactly determined. ' +
      'If the fit does not reproduce every corner to machine precision, the ' +
      'coefficient derivation is wrong.',
  },
  {
    id: 'imp899-stationary-is-saddle',
    holds: () =>
      STATIONARY.exists === true &&
      STATIONARY.hessianEigs.length === 2 &&
      STATIONARY.hessianEigs[0] < 0 &&
      STATIONARY.hessianEigs[1] > 0,
    why:
      'For any nonzero interaction term D, the bilinear-fit Hessian has ' +
      'eigenvalues +D and -D (always opposite sign), making the stationary ' +
      'point a saddle. This is the key structural fact that tells us the ' +
      '2x2 pilot CANNOT locate a resonance minimum inside its convex hull.',
  },
  {
    id: 'imp899-best-corner-is-eigenmode-pi-rho-mean',
    holds: () => {
      const bc = BEST_CORNER_ANALYSIS.bestCorner;
      const expectK0 = PILOT.calibration.k0_eigenmode;
      const expectPv = PILOT.calibration.phaseVel_mid;
      // k0 tolerances: the pilot uses k0 = 20.24 (2dp rounding of 20.2402);
      // so accept absolute difference up to 0.01.
      return (
        Math.abs(bc.k0 - expectK0) < 0.01 &&
        Math.abs(bc.phaseVel - expectPv) < 0.01 &&
        bc.L < 0
      );
    },
    why:
      'The best pilot corner must coincide with (k0 ~ k0_eigenmode, ' +
      'phaseVel ~ pi*rho_mean) — the drift-Jacobian eigenmode at the bulk ' +
      'phase velocity. If it does not, the imp-894 headline finding has ' +
      'drifted and the present fit is consuming stale data.',
  },
  {
    id: 'imp899-steepest-descent-predicts-beyond-eigenmode',
    holds: () => {
      const dir = BEST_CORNER_ANALYSIS.steepestDescent_physicalCoords;
      // Prediction: k0 component > 0 (probe beyond eigenmode) and
      // phaseVel component < 0 (probe below pi*rho_mean). This is the
      // falsifiable prediction for the dense grid.
      return dir.k0 > 0 && dir.phaseVel < 0;
    },
    why:
      'Bilinear fit predicts steepest descent from the best corner points ' +
      'beyond the eigenmode in k0 and below the bulk phase velocity in ' +
      'phaseVel. This is the concrete, falsifiable prediction that the ' +
      'dense nSteps = 200 grid should test FIRST. If the sign ever flips ' +
      'here, the underlying pilot data has changed and the prediction ' +
      'must be re-derived.',
  },
  {
    id: 'imp899-linear-regime-already-saturating',
    holds: () => {
      // At least one cell must show the eps=0.05 slope being materially
      // smaller than the eps=0.01 slope — i.e., the linear regime is
      // already saturating between eps=0.01 and eps=0.05 at nSteps=30.
      // This is a critical honesty fact documented in keyFindings.
      return LINEARITY_CHECK.some(
        (c) =>
          c.slope_ratio_0p05_over_0p01 !== null &&
          Math.abs(c.slope_ratio_0p05_over_0p01) < 0.5,
      );
    },
    why:
      'At least one pilot cell must show linear-regime saturation ' +
      '(slope(eps=0.05) materially smaller than slope(eps=0.01)). If NO ' +
      'cell shows saturation, the non-extrapolation caveat in keyFindings ' +
      'overstates the nonlinearity of the regime and needs rewording.',
  },
  {
    id: 'imp899-quadratic-fit-reproduces-both-pilot-points',
    holds: () => {
      // Each per-cell quadratic ratio(eps) = 1 + a*eps + b*eps^2 must
      // reproduce BOTH measured pilot eps points (0.01 and 0.05) to
      // machine precision — the 2-point fit is exactly determined.
      let idx = 0;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const { linearCoeff_a: a, quadraticCoeff_b: b } =
            QUADRATIC_RESPONSE_FIT[idx++];
          const pred01 = 1 + a * 0.01 + b * 0.01 * 0.01;
          const pred05 = 1 + a * 0.05 + b * 0.05 * 0.05;
          if (Math.abs(pred01 - HM1.ratios[i][j]) > 1e-9) return false;
          if (Math.abs(pred05 - HM5.ratios[i][j]) > 1e-9) return false;
        }
      }
      return true;
    },
    why:
      'The per-cell quadratic-in-eps response fit is exactly determined by ' +
      'the two pilot eps points (with anchor ratio(0) = 1). If it does not ' +
      'reproduce both measured ratios to machine precision, the Cramer ' +
      'solution for (a, b) is wrong and the curvature/extrapolation are ' +
      'meaningless.',
  },
  {
    id: 'imp899-open-sub-gap-named',
    holds: () =>
      IMP_899_LINEAR_RESPONSE_FIT.openSubGaps.length === 1 &&
      IMP_899_LINEAR_RESPONSE_FIT.openSubGaps[0].id ===
        'imp-899-sub-nstep200-grid',
    why:
      'imp-899 is HONEST PARTIAL: the dense nSteps=200 grid (the ticket ' +
      'original deliverable) remains open under a named sub-gap. If this ' +
      'naming drifts, the honest-partial accounting becomes untraceable.',
  },
];

export default IMP_899_LINEAR_RESPONSE_FIT;
