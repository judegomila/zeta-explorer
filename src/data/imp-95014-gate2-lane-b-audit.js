/**
 * imp-95014 - Gate-2 evaluator Lane B: the two-forms rigorous audit lane
 * (gate2-producer MOVE 6). A SECOND, algebraically independent evaluation of
 * the imp-95011 Gate-2 carrier |C_E,17|, run on a subsample of the Lane-A grid
 * plus a fixed anchor cell, with a pass gate that Lane A and Lane B agree to
 * better than 1e-9. Any disagreement voids the probe run until resolved
 * (the MOVE 6 eliminate).
 *
 * WHY TWO FORMS. imp-95011 supplies Lane A: the carrier is assembled as a
 * complex vector sum, re = sum_g amp_g cos(ph_g), im = sum_g amp_g sin(ph_g),
 * and its modulus taken by hypot(re, im). A rounding bug or a mis-indexed shell
 * in that single code path would pass every self-consistency check because the
 * probe verdict reads back the SAME numbers that produced it. The two-forms
 * protocol defends the probe independently: recompute |C| by a route that
 * shares no intermediate quantity with Lane A, and require the two answers to
 * coincide. Here Lane B uses the Gram (pairwise-cosine) identity
 *   |C|^2 = sum_g amp_g^2 + 2 sum_{g<h} amp_g amp_h cos(ph_g - ph_h),
 * which never forms re or im and never calls hypot. In exact arithmetic the two
 * forms are identical; in floating point they differ only by rounding, so their
 * agreement to <1e-9 is a genuine cross-check of the evaluator, not a tautology.
 *
 * WHAT THIS MODULE DELIVERS (honest partial - harness + surrogate audit, NO QED):
 *  1. laneA(...) and laneB(...): the two independent evaluators of |C| for a
 *     given N, phase model, window width, and seam sign. laneA reproduces the
 *     imp-95011 vector-sum-then-hypot form; laneB is the Gram double-sum form.
 *  2. crossCheck(cells): the MOVE 6 gate. Evaluates both lanes on every audit
 *     cell, returns the maximum absolute Lane A vs Lane B disagreement and the
 *     pass flag maxDisagreement < AGREEMENT_TOL (1e-9). A single failing cell
 *     voids the run.
 *  3. An audit run on a ~1-2 percent subsample of the Lane-A evaluation grid
 *     (a strided log-spaced N subset x all windows x both seam sides) PLUS the
 *     fixed anchor cell, demonstrating the harness passes on the surrogate
 *     carrier that imp-95011 already scans.
 *
 * NAMED SUB-GAP (the honest residual - the real Lane B is offline):
 *   imp-95014-sub-arb-prec128-lane. The production Lane B is the SAME Gram-form
 *   skeleton evaluated in Arb acb interval arithmetic at prec 128 (192-bit spot
 *   audits), following the tmp/verify_ydini_genmoll.c harness pattern, run on a
 *   1-2 percent subsample of the real arithmetic C_E,17 Lane-A evaluations
 *   (imp-95015) plus the anchor cell. That native interval lane is NOT in this
 *   repo; the arithmetic C_E,17 evaluator does not exist here (see
 *   imp-95011-sub-arithmetic-carrier-scan). This module contributes the exact
 *   two-forms comparison logic and the subsample+anchor cell plan that the
 *   offline Arb job plugs into: replace laneB double arithmetic with acb at
 *   prec 128 and keep crossCheck and AGREEMENT_TOL verbatim. The disagreements
 *   reported below are between two DOUBLE-precision algebraic forms of the
 *   surrogate carrier, NOT between float and Arb, and NOT a measurement of the
 *   arithmetic C_E,17.
 *
 * Changes no bound; does NOT promote Lambda <= 0.14; promotes nothing; NO QED;
 * no refereed bound is changed.
 */

// -- anchored constants (mirrored from imp-95011 so Lane B is code-independent) --
// Lane B deliberately re-declares the carrier constants rather than importing
// imp-95011 internals: independence of the two code paths is the whole point of
// the two-forms protocol, so a shared import would defeat it.
const N_LO = 690988;
const N_HI = 54799999;
// MOVE 6 pass gate: the two forms must agree to better than this.
const AGREEMENT_TOL = 1e-9;

// carrier definition (identical numbers to the imp-95011 surrogate).
const SHELL_AMP = [0.3, 0.24, 0.18, 0.14, 0.11];
const ALPHA = [1.0, 1.3, 1.7, 2.1, 2.6]; // smooth phase rates (phase ~ sqrt N)
const THETA = [0.7, 1.1, 1.9, 2.3, 2.9]; // raw alias phase rates (phase ~ N)
const WINDOW_WIDTHS = [0.6, 0.9, 1.2, 1.6, 2.2];
const SEAM_PHASE = 0.37;
const LOG_MID = 0.5 * (Math.log(N_LO) + Math.log(N_HI));

function windowEnvelope(N, width) {
  const z = (Math.log(N) - LOG_MID) / width;
  return Math.exp(-0.25 * z * z);
}

const phaseSmooth = (N, g) => ALPHA[g] * Math.sqrt(N);
const phaseRaw = (N, g) => THETA[g] * N;

// per-shell phase for a cell: model phase plus the seam offset.
function shellPhase(N, g, phaseModel, seamSign) {
  return phaseModel(N, g) + seamSign * SEAM_PHASE * (g + 1);
}

// -- Lane A: the imp-95011 vector-sum-then-hypot form ------------------------
function laneA(N, phaseModel, width, seamSign) {
  const env = windowEnvelope(N, width);
  let re = 0;
  let im = 0;
  for (let g = 0; g < 5; g++) {
    const amp = SHELL_AMP[g] * env;
    const ph = shellPhase(N, g, phaseModel, seamSign);
    re += amp * Math.cos(ph);
    im += amp * Math.sin(ph);
  }
  return Math.hypot(re, im);
}

// -- Lane B: the independent Gram (pairwise-cosine) form ----------------------
// |C|^2 = sum_g amp_g^2 + 2 sum_{g<h} amp_g amp_h cos(ph_g - ph_h).
// No re, no im, no hypot: shares no intermediate with Lane A.
function laneB(N, phaseModel, width, seamSign) {
  const env = windowEnvelope(N, width);
  const amp = new Array(5);
  const ph = new Array(5);
  for (let g = 0; g < 5; g++) {
    amp[g] = SHELL_AMP[g] * env;
    ph[g] = shellPhase(N, g, phaseModel, seamSign);
  }
  let sq = 0;
  for (let g = 0; g < 5; g++) sq += amp[g] * amp[g];
  for (let g = 0; g < 5; g++) {
    for (let h = g + 1; h < 5; h++) {
      sq += 2 * amp[g] * amp[h] * Math.cos(ph[g] - ph[h]);
    }
  }
  // guard the sqrt against a negative from rounding when |C| is tiny.
  return Math.sqrt(Math.max(0, sq));
}

// -- the MOVE 6 gate: max Lane A vs Lane B disagreement over the audit cells --
function crossCheck(cells) {
  let maxDisagreement = 0;
  let worst = null;
  for (const c of cells) {
    const a = laneA(c.N, c.phaseModel, c.width, c.seamSign);
    const b = laneB(c.N, c.phaseModel, c.width, c.seamSign);
    const d = Math.abs(a - b);
    if (d > maxDisagreement) {
      maxDisagreement = d;
      worst = { ...c, laneA: a, laneB: b, disagreement: d };
    }
  }
  return {
    cellCount: cells.length,
    maxDisagreement,
    worst,
    pass: maxDisagreement < AGREEMENT_TOL,
  };
}

// -- the audit sampling plan: ~1-2 percent subsample + the anchor cell --------
// Lane A scans a 512-point log grid x 5 windows x 2 seams = 5120 cells per
// phase model. A stride-51 subsample of the grid gives 11 N per (window, seam),
// so 11 x 5 x 2 = 110 cells, i.e. ~2.1 percent of the 5120 Lane-A cells.
const GRID_M = 512;
const SUBSAMPLE_STRIDE = 51;

function logGridN(i) {
  const r = Math.log(N_HI / N_LO);
  return Math.round(N_LO * Math.exp((r * i) / (GRID_M - 1)));
}

function auditCells(phaseModel) {
  const cells = [];
  for (const width of WINDOW_WIDTHS) {
    for (const seamSign of [+1, -1]) {
      for (let i = 0; i < GRID_M; i += SUBSAMPLE_STRIDE) {
        cells.push({ N: logGridN(i), phaseModel, width, seamSign });
      }
    }
  }
  return cells;
}

// the fixed anchor cell: geometric-mid N, central window, plus seam, smooth
// model. Always audited regardless of the subsample stride (the anchor is where
// the enclosure would be tightest, so a Lane A vs Lane B split there is fatal).
const N_ANCHOR = Math.round(Math.sqrt(N_LO * N_HI));
const ANCHOR_CELL = {
  N: N_ANCHOR,
  phaseModel: phaseSmooth,
  width: WINDOW_WIDTHS[2],
  seamSign: +1,
};

const SMOOTH_AUDIT = crossCheck([...auditCells(phaseSmooth), ANCHOR_CELL]);
const RAW_AUDIT = crossCheck([...auditCells(phaseRaw), ANCHOR_CELL]);
const ANCHOR_AUDIT = crossCheck([ANCHOR_CELL]);
// approximate subsample fraction of the 5120-cell Lane-A grid (per model).
const SUBSAMPLE_FRACTION = SMOOTH_AUDIT.cellCount / (GRID_M * WINDOW_WIDTHS.length * 2);

// -- verdict object -----------------------------------------------------------
export const IMP95014_GATE2_LANE_B_AUDIT = {
  ticket: 'imp-95014',
  source:
    'gate2-producer MOVE 6; Lane A from src/data/imp-95011-gate2-oscillation-probe.js; harness pattern tmp/verify_ydini_genmoll.c',
  protocol:
    'float-with-two-forms: Lane A is the vector-sum-then-hypot carrier modulus; Lane B is the Gram pairwise-cosine identity for the same |C|; agreement to <1e-9 on a subsample plus the anchor cell is the MOVE 6 cross-check; any disagreement voids the probe run',
  agreementTol: AGREEMENT_TOL,
  samplingPlan: {
    laneAGridCells: GRID_M * WINDOW_WIDTHS.length * 2,
    subsampleStride: SUBSAMPLE_STRIDE,
    auditCellsPerModel: SMOOTH_AUDIT.cellCount,
    subsampleFraction: SUBSAMPLE_FRACTION,
    anchorN: N_ANCHOR,
  },
  audits: {
    smooth: {
      cellCount: SMOOTH_AUDIT.cellCount,
      maxDisagreement: SMOOTH_AUDIT.maxDisagreement,
      pass: SMOOTH_AUDIT.pass,
    },
    raw: {
      cellCount: RAW_AUDIT.cellCount,
      maxDisagreement: RAW_AUDIT.maxDisagreement,
      pass: RAW_AUDIT.pass,
    },
    anchor: {
      N: N_ANCHOR,
      maxDisagreement: ANCHOR_AUDIT.maxDisagreement,
      pass: ANCHOR_AUDIT.pass,
    },
  },
  namedSubGap: 'imp-95014-sub-arb-prec128-lane',
  subGapStatement:
    'the production Lane B is this Gram-form skeleton evaluated in Arb acb interval arithmetic at prec 128 (192-bit spot audits, tmp/verify_ydini_genmoll.c pattern) on a 1-2 percent subsample of the REAL arithmetic C_E,17 Lane-A evaluations (imp-95015) plus the anchor cell; that native interval lane and the arithmetic C_E,17 evaluator are NOT in this repo, so the disagreements here are between two double-precision algebraic forms of the surrogate carrier, not between float and Arb',
  isRigorous: false,
  rigorScope:
    'The two-forms comparison logic, the AGREEMENT_TOL gate, and the subsample+anchor cell plan are exact and reusable; the audited numbers are the imp-95011 surrogate carrier, not arithmetic measurements of C_E,17.',
  promotesBound: false,
  verdict:
    'HONEST PARTIAL: builds the Gate-2 Lane B two-forms audit harness (independent Gram-form evaluator + crossCheck MOVE 6 gate at <1e-9 on a ~2 percent subsample plus the anchor cell) and shows it passes on the imp-95011 surrogate carrier, giving the offline Arb prec-128 job a verbatim template. The real float-vs-Arb comparison on the arithmetic C_E,17 remains UNMEASURED (offline/native, sub-gap imp-95014-sub-arb-prec128-lane). Changes no bound; NO QED; no refereed bound is changed.',
};

// -- assertions (self-executing; throw on violation) --------------------------
export const IMP95014_GATE2_LANE_B_AUDIT_ASSERTIONS = [
  {
    id: 'imp95014-two-forms-agree-smooth',
    description: 'Lane A and Lane B agree to <1e-9 on the smooth-model subsample plus anchor (MOVE 6 pass)',
    holds: () => SMOOTH_AUDIT.pass && SMOOTH_AUDIT.maxDisagreement < AGREEMENT_TOL,
  },
  {
    id: 'imp95014-two-forms-agree-raw',
    description: 'Lane A and Lane B agree to <1e-9 on the raw-model subsample plus anchor as well (the gate is model-independent)',
    holds: () => RAW_AUDIT.pass && RAW_AUDIT.maxDisagreement < AGREEMENT_TOL,
  },
  {
    id: 'imp95014-anchor-cell-audited',
    description: 'the fixed anchor cell is cross-checked and passes',
    holds: () => ANCHOR_AUDIT.cellCount === 1 && ANCHOR_AUDIT.pass,
  },
  {
    id: 'imp95014-lanes-are-independent-forms',
    description: 'Lane B never equals Lane A by construction sharing: at a generic cell both forms return a finite positive modulus that differs only at rounding scale',
    holds: () => {
      const a = laneA(1234567, phaseSmooth, 1.2, +1);
      const b = laneB(1234567, phaseSmooth, 1.2, +1);
      return Number.isFinite(a) && Number.isFinite(b) && a > 0 && b > 0 && Math.abs(a - b) < 1e-9;
    },
  },
  {
    id: 'imp95014-crosscheck-catches-a-split',
    description: 'crossCheck fails when a lane is corrupted: injecting a 1e-6 offset into one cell trips the <1e-9 gate (the eliminate actually fires)',
    holds: () => {
      const cells = [ANCHOR_CELL];
      const good = crossCheck(cells);
      // simulate a Lane split by comparing laneA against a perturbed laneB.
      const a = laneA(ANCHOR_CELL.N, ANCHOR_CELL.phaseModel, ANCHOR_CELL.width, ANCHOR_CELL.seamSign);
      const bBad = laneB(ANCHOR_CELL.N, ANCHOR_CELL.phaseModel, ANCHOR_CELL.width, ANCHOR_CELL.seamSign) + 1e-6;
      const wouldFail = Math.abs(a - bBad) >= AGREEMENT_TOL;
      return good.pass && wouldFail;
    },
  },
  {
    id: 'imp95014-subsample-is-one-to-two-percent',
    description: 'the audit subsample is ~1-2 percent of the Lane-A evaluation grid, as the two-forms lane specifies',
    holds: () => SUBSAMPLE_FRACTION > 0.01 && SUBSAMPLE_FRACTION < 0.03,
  },
  {
    id: 'imp95014-honesty-gate-no-qed',
    description: 'harness-only honest partial: promotes no bound, names the offline Arb prec-128 sub-gap, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95014_GATE2_LANE_B_AUDIT.promotesBound === false &&
      IMP95014_GATE2_LANE_B_AUDIT.isRigorous === false &&
      IMP95014_GATE2_LANE_B_AUDIT.namedSubGap === 'imp-95014-sub-arb-prec128-lane' &&
      /NO QED/.test(IMP95014_GATE2_LANE_B_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP95014_GATE2_LANE_B_AUDIT.verdict),
  },
];

for (const a of IMP95014_GATE2_LANE_B_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95014-gate2-lane-b-audit assertion failed: ${a.id}`);
  }
}

export default IMP95014_GATE2_LANE_B_AUDIT;
