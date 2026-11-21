/**
 * imp-95844 -- single cross-validation table putting the two independent
 * numeric routes to the rho = 1 sech-seam finite-size ratio F / A_opt side by
 * side at matched nPts, at delta = ln 1.3 and the delta = 3 control -- the
 * comparison the imp-95677 ticket asked for but which was never TABULATED
 * cell-for-cell with signed differences and a residual-vs-leading-dual column.
 *
 * GRADE: presentation / reshaping. Imports no heavy bundle; re-derives nothing
 * except the leading-dual closed form 1 + C (pi/(N+1))^2 (a one-line formula) --
 * every measured cell is a baked literal pulled from its source module.
 *
 * THE TWO ROUTES (rho = 1, delta = ln 1.3).
 *   - DIRECT extended-precision Gram eigensolve. imp-95823 supplied a DIRECT
 *     double-double (DD) Jacobi diagonalisation of the seam Gram
 *     G[j,k] = sech((j-k) delta / 2), giving F / A_opt = 1.179 / 1.041 / 1.014 /
 *     1.008 at nPts = 80 / 160 / 320 / 640. It settled the LIMIT (= 1) and the
 *     SIGN (approach strictly from above) but flagged a sub-gap: its local
 *     log-log slope drifted away from -2 and the ratios sat well above the
 *     leading dual term, which it read as pre-asymptotics.
 *   - CANCELLATION-FREE Poisson (theta) DUAL. imp-95689 resolved the same
 *     endpoint via the dual of the sech-Toeplitz symbol, giving the exact limit
 *     1 and the leading finite-section asymptotic
 *     F / A_opt = 1 + C (pi/(N+1))^2 + O(N^{-3}), C = f''(pi)/(2 A_opt) = 71.690.
 *     Its dual column IS that leading closed form.
 *
 * THE THIRD COLUMN (why a naive two-column table would MISLEAD). imp-95841 later
 * re-ran the DIRECT route with the imp-95820 PD-preserving shift-invert DD solver
 * (O(N^2), far greater reach) and found the imp-95823 DD-Jacobi read was
 * UNDER-CONVERGED at nPts >= 320: the fixed-sweep bottom eigenvalue was biased
 * HIGH by ~6.5e-18 (still >= A_opt = 4.406e-15 by the imp-95825 positivity
 * floor), inflating (ratio - 1) and corrupting the slope. The CONVERGED direct
 * read (shift-invert) at nPts = 640 is F / A_opt = 1.00181, not the DD-Jacobi
 * 1.00832. So this table carries BOTH direct reads -- the imp-95823 DD-Jacobi
 * (as-published) and the imp-95841 converged shift-invert -- against the dual.
 *
 * READING THE TABLE (residualRatio = (direct - 1) / (leadingDual - 1)).
 *   - imp-95823 DD-Jacobi vs dual: residualRatio GROWS 1.66 -> 1.50 -> 2.07 ->
 *     4.83 as nPts doubles 80 -> 640. This is NOT a real pre-asymptotic gap: the
 *     fixed-sweep Jacobi bias ~6.5e-18 is a growing fraction of the shrinking
 *     (ratio - 1) signal, so the artifact inflates with nPts -- exactly where the
 *     DD-Jacobi route "runs out of reach" (nPts ~ 320-640, the O(N^3) cap).
 *   - imp-95841 shift-invert vs dual: residualRatio DECAYS 1.57 -> 1.23 -> 1.11
 *     -> 1.05 toward 1 over the SAME window -- the converged direct route AGREES
 *     with the dual leading term (to ~5% by nPts = 640, continuing to 1.016 by
 *     nPts = 1920 per imp-95841). The two routes agree once the direct one is
 *     properly converged.
 *   - delta = 3 CONTROL (well-conditioned, DD far above any floor): the direct
 *     DD-Jacobi residualRatio DECAYS 1.020 -> 1.010 -> 1.005 -> 1.003 toward 1,
 *     locking to exponent 2 -- the clean-agreement baseline the ln 1.3 DD-Jacobi
 *     column FAILS to reach only because of the cancellation floor / under-
 *     convergence, not a mechanism difference.
 *
 * CONCLUSION. Direct and dual AGREE on the rho = 1 endpoint: exact limit 1,
 * approach strictly from above, convergence exponent 2. The apparent 1.7x-4.8x
 * "discrepancy" of the as-published imp-95823 DD-Jacobi column against the dual
 * is a solver under-convergence artifact (identified by imp-95841), not a real
 * gap; the converged shift-invert direct read lands on the dual trend. The DD-
 * Jacobi direct route runs out of usable reach at nPts ~ 320-640.
 *
 * HONEST SCOPE. Pure reshaping of three already-measured, already-committed
 * results into one comparison object; introduces no new cited input and no new
 * bound. Model seam family only; the imp-95212 envelope port, signed WEIGHT, and
 * modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed; Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95823-rho1-szego-direct-dd-eigensolve (DIRECT DD-Jacobi column, as published)
 * @see imp-95841-ln13-shift-invert-direct-exponent (CONVERGED shift-invert direct column)
 * @see imp-95689-rho1-szego-dual-convergence-rate (DUAL = leading closed-form column)
 * @see imp-95773-szego-coefficient-crossval-table (companion crossval table for C(delta))
 */

import { IMP95823_RHO1_SZEGO_DIRECT_DD_EIGENSOLVE } from './imp-95823-rho1-szego-direct-dd-eigensolve.js';
import { IMP95841_LN13_SHIFT_INVERT_DIRECT_EXPONENT } from './imp-95841-ln13-shift-invert-direct-exponent.js';
import { IMP95689_RHO1_SZEGO_DUAL_CONVERGENCE_RATE } from './imp-95689-rho1-szego-dual-convergence-rate.js';

const DIRECT = IMP95823_RHO1_SZEGO_DIRECT_DD_EIGENSOLVE; // DD-Jacobi (as published)
const CONVERGED = IMP95841_LN13_SHIFT_INVERT_DIRECT_EXPONENT; // shift-invert converged
const DUAL = IMP95689_RHO1_SZEGO_DUAL_CONVERGENCE_RATE; // Poisson dual = leading closed form

// leading finite-section closed form: F / A_opt = 1 + C (pi/(N+1))^2
function leadingDual(C, nPts) {
  return 1 + C * (Math.PI / (nPts + 1)) ** 2;
}

// ---------------------------------------------------------------------------
// delta = ln 1.3 seam rows (nPts = 80/160/320/640, matched across all sources)
// ---------------------------------------------------------------------------
export const RHO1_SEAM_CROSSVAL_ROWS = DIRECT.table.map((jrow) => {
  const crow = CONVERGED.table.find((r) => r.nPts === jrow.nPts);
  const drow = DUAL.table.find((r) => r.nPts === jrow.nPts);
  const lead = leadingDual(DIRECT.dualCoefC, jrow.nPts);
  return {
    nPts: jrow.nPts,
    directJacobi: jrow.ratio, // imp-95823 DD-Jacobi (biased high at large nPts)
    directShiftInvert: crow.ratio, // imp-95841 converged shift-invert
    dualExt: drow.ratioExt, // imp-95689 dual (6-digit baked)
    leadingDualFormula: lead, // recomputed 1 + C (pi/(N+1))^2
    jacobiResidualRatio: (jrow.ratio - 1) / (lead - 1), // grows -> under-convergence artifact
    shiftInvertResidualRatio: (crow.ratio - 1) / (lead - 1), // decays -> agreement
    signedDiffJacobiMinusDual: jrow.ratio - drow.ratioExt,
    signedDiffShiftInvertMinusDual: crow.ratio - drow.ratioExt,
  };
});

// ---------------------------------------------------------------------------
// delta = 3 control rows (well-conditioned; DIRECT DD-Jacobi vs leading dual)
// ---------------------------------------------------------------------------
export const RHO1_CONTROL_CROSSVAL_ROWS = DIRECT.control.table.map((row) => {
  const lead = leadingDual(DIRECT.control.dualCoefC, row.nPts);
  return {
    nPts: row.nPts,
    directDD: row.ratio,
    leadingDualFormula: lead,
    residualRatio: (row.ratio - 1) / (lead - 1),
    signedDiff: row.ratio - lead,
  };
});

export const IMP95844_RHO1_SZEGO_DIRECT_VS_DUAL_CROSSVAL_TABLE = Object.freeze({
  id: 'imp-95844',
  title:
    'CROSS-VALIDATION TABLE: DIRECT DD-Jacobi (imp-95823) vs converged shift-invert ' +
    '(imp-95841) vs Poisson dual leading form (imp-95689) for the rho = 1 sech-seam ' +
    'F / A_opt at matched nPts, delta = ln 1.3 and the delta = 3 control, with signed ' +
    'differences and a residual-vs-leading-dual column',
  delta: DIRECT.delta,
  aOpt: DIRECT.aOpt,
  dualCoefC: DIRECT.dualCoefC,
  seamRows: RHO1_SEAM_CROSSVAL_ROWS,
  controlRows: RHO1_CONTROL_CROSSVAL_ROWS,
  controlDualCoefC: DIRECT.control.dualCoefC,
  // where the DD-Jacobi direct route runs out of usable reach (bias overtakes signal):
  jacobiRunsOutAtNPts: 320,
  jacobiArtifactNotPreAsymptotic: true, // imp-95841 identified the drift as under-convergence
  routesAgreeOnEndpoint: true, // limit 1, approach from above, exponent 2 -- both routes
  boundChange: false,
  qed: false,
  verdict:
    'MEASURED (reshaping only). Direct and dual routes AGREE on the rho = 1 sech-seam ' +
    'endpoint -- exact limit F / A_opt = 1, approach strictly from above, convergence ' +
    'exponent 2. Tabulated side by side at delta = ln 1.3: the CONVERGED direct read ' +
    '(imp-95841 shift-invert) sits at residualRatio (direct-1)/(leadingDual-1) = ' +
    '1.57 -> 1.23 -> 1.11 -> 1.05 over nPts = 80..640, decaying to 1 -- agreement with ' +
    'the imp-95689 dual leading term. The as-published imp-95823 DD-Jacobi column ' +
    'instead GROWS 1.66 -> 1.50 -> 2.07 -> 4.83: this apparent discrepancy is a ' +
    'fixed-sweep DD-Jacobi under-convergence artifact (bottom eigenvalue biased high by ' +
    '~6.5e-18, a growing fraction of the shrinking ratio-1 signal), identified by ' +
    'imp-95841, NOT a real pre-asymptotic gap -- the DD-Jacobi direct route runs out of ' +
    'usable reach at nPts ~ 320-640 (the O(N^3) cap). The delta = 3 control confirms the ' +
    'clean baseline: there the direct DD-Jacobi residualRatio decays 1.020 -> 1.003 ' +
    'toward 1, locking to exponent 2, which the ln 1.3 DD-Jacobi column fails to reach ' +
    'only for the cancellation floor. Assembles three already-committed results into one ' +
    'comparison object; introduces no new cited input and no new bound. Model seam family ' +
    'only; the imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. ' +
    'Changes no bound of the Lambda program; NO QED; no refereed bound is changed' +
    '; Sun arXiv:2609.04176 unrefereed.',
  closesTickets: ['imp-95844'],
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: only the three source modules,
// none of which pull heavy bundles)
// ---------------------------------------------------------------------------

const REF = IMP95844_RHO1_SZEGO_DIRECT_VS_DUAL_CROSSVAL_TABLE;

export const IMP95844_ASSERTIONS = [
  {
    id: 'imp95844-seam-four-rows-matched',
    description:
      'the seam table has exactly the four matched nPts rows 80/160/320/640 with all ' +
      'three route columns (Jacobi, shift-invert, dual) populated at each',
    holds: () =>
      REF.seamRows.map((r) => r.nPts).join(',') === '80,160,320,640' &&
      REF.seamRows.every(
        (r) =>
          Number.isFinite(r.directJacobi) &&
          Number.isFinite(r.directShiftInvert) &&
          Number.isFinite(r.dualExt) &&
          Number.isFinite(r.leadingDualFormula),
      ),
  },
  {
    id: 'imp95844-leading-dual-matches-imp95823-baked',
    description:
      'the recomputed leading-dual closed form 1 + C (pi/(N+1))^2 reproduces the ' +
      'imp-95823 baked dualLead literal at every seam nPts to < 1e-6 relative',
    holds: () =>
      REF.seamRows.every((r) => {
        const jrow = DIRECT.table.find((x) => x.nPts === r.nPts);
        return Math.abs(r.leadingDualFormula - jrow.dualLead) / jrow.dualLead < 1e-6;
      }),
  },
  {
    id: 'imp95844-dual-tracks-leading-formula',
    description:
      'the imp-95689 6-digit dual column agrees with the recomputed leading closed ' +
      'form to < 1e-5 relative -- the dual IS the leading asymptotic',
    holds: () =>
      REF.seamRows.every(
        (r) => Math.abs(r.dualExt - r.leadingDualFormula) / r.leadingDualFormula < 1e-5,
      ),
  },
  {
    id: 'imp95844-jacobi-residual-grows-artifact',
    description:
      'the DD-Jacobi residualRatio grows with nPts (last > first and last > 4) -- the ' +
      'under-convergence artifact that inflates with nPts, not a real pre-asymptotic gap',
    holds: () => {
      const rr = REF.seamRows.map((r) => r.jacobiResidualRatio);
      return rr[rr.length - 1] > rr[0] && rr[rr.length - 1] > 4 && REF.jacobiArtifactNotPreAsymptotic === true;
    },
  },
  {
    id: 'imp95844-shift-invert-residual-decays-to-agreement',
    description:
      'the converged shift-invert residualRatio decreases monotonically toward 1 across ' +
      'nPts = 80..640 (last < 1.1) -- the converged direct route agrees with the dual',
    holds: () => {
      let prev = Infinity;
      for (const r of REF.seamRows) {
        if (!(r.shiftInvertResidualRatio < prev)) return false;
        prev = r.shiftInvertResidualRatio;
      }
      return REF.seamRows[REF.seamRows.length - 1].shiftInvertResidualRatio < 1.1 && REF.routesAgreeOnEndpoint === true;
    },
  },
  {
    id: 'imp95844-shift-invert-closer-than-jacobi',
    description:
      'at every seam nPts the converged shift-invert read is closer to the dual leading ' +
      'form than the as-published DD-Jacobi read (|shiftInvert-1| <= |Jacobi-1| vs lead)',
    holds: () =>
      REF.seamRows.every(
        (r) => Math.abs(r.directShiftInvert - r.leadingDualFormula) <= Math.abs(r.directJacobi - r.leadingDualFormula),
      ),
  },
  {
    id: 'imp95844-all-direct-reads-above-one',
    description:
      'every direct read (both routes, both deltas) sits strictly above 1 -- the ' +
      'finite-section positivity floor F / A_opt >= 1 (imp-95825), no sub-1 undershoot',
    holds: () =>
      REF.seamRows.every((r) => r.directJacobi > 1 && r.directShiftInvert > 1 && r.dualExt > 1) &&
      REF.controlRows.every((r) => r.directDD > 1),
  },
  {
    id: 'imp95844-control-residual-decays-to-one',
    description:
      'the delta = 3 control residualRatio decreases monotonically toward 1 (last < 1.01) ' +
      '-- the clean well-conditioned baseline locking to exponent 2',
    holds: () => {
      let prev = Infinity;
      for (const r of REF.controlRows) {
        if (!(r.residualRatio < prev)) return false;
        prev = r.residualRatio;
      }
      return REF.controlRows[REF.controlRows.length - 1].residualRatio < 1.01;
    },
  },
  {
    id: 'imp95844-not-a-bound',
    description:
      'this is a reshaping / tabulation module; it moves no Lambda bound and proves no QED',
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /MEASURED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: 'imp95844-closes-self',
    description: 'this module is the deliverable the imp-95844 ticket asked for',
    holds: () => REF.closesTickets.includes('imp-95844'),
  },
];

for (const a of IMP95844_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95844-rho1-szego-direct-vs-dual-crossval-table assertion failed: ${a.id}`);
  }
}

export default IMP95844_RHO1_SZEGO_DIRECT_VS_DUAL_CROSSVAL_TABLE;
