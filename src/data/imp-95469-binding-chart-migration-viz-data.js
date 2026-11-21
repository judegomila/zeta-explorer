/**
 * imp-95469: viz-data for the imp-95341 binding-chart migration
 * k*(a, mu) across rho. Every value below is copied verbatim from
 * IMP95341_BINDING_CHART_MIGRATION (no re-derivation, no re-execution
 * of the underlying 256-chart numerics beyond what imp-95341 already
 * computes at import). Presentation only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

import { IMP95341_BINDING_CHART_MIGRATION } from './imp-95341-binding-chart-migration.js';

const REC = IMP95341_BINDING_CHART_MIGRATION;

// numeric a for each ledger label, matching imp-95341's own aOf() convention
function aOf(s) {
  if (s === 'ln 2') return Math.LN2;
  if (s === 'ln 4') return Math.log(4);
  if (s === 'ln 10') return Math.log(10);
  return Number(s);
}

const ledgerPoints = REC.rhoMigrationUniform.ledger.map((row) => ({
  aLabel: row.a,
  aValue: aOf(row.a),
  rho: row.rho,
  kBind: row.kBind,
  thetaMidOverPi: row.thetaMidOverPi,
  branch: row.branch,
  isPeak: false,
}));

const peakPoint = {
  aLabel: String(REC.rhoMigrationUniform.peak.aApprox),
  aValue: REC.rhoMigrationUniform.peak.aApprox,
  rho: REC.rhoMigrationUniform.peak.rhoApprox,
  kBind: REC.rhoMigrationUniform.peak.kBind,
  thetaMidOverPi: REC.rhoMigrationUniform.peak.thetaMidOverPi,
  branch: 'Psi6',
  isPeak: true,
};

// migration curve: ledger points plus the peak, ordered by a
export const IMP95469_MIGRATION_CURVE = [...ledgerPoints, peakPoint].sort(
  (p, q) => p.aValue - q.aValue,
);

export const IMP95469_BRANCH_CROSSOVER = {
  aApprox: REC.rhoMigrationUniform.branchCrossover.aApprox,
  rhoApprox: REC.rhoMigrationUniform.branchCrossover.rhoApprox,
};

// r-invariance spread ladder (0 charts of 256 except near the crossover)
export const IMP95469_R_INVARIANCE = REC.rInvariance.spreadByA.map((row) => ({
  aLabel: row.a,
  aValue: aOf(row.a),
  spreadCharts: row.spreadCharts,
}));

export const IMP95469_ASSERTIONS = [
  {
    id: 'imp95469-migration-curve-matches-source',
    description:
      'the migration curve has 8 points (7 ledger rows + 1 peak), is ' +
      'sorted by a ascending, and its far-rho anchor reproduces k* = 114 ' +
      'at a = 6 verbatim from imp-95341',
    holds: () => {
      if (IMP95469_MIGRATION_CURVE.length !== 8) return false;
      for (let i = 1; i < IMP95469_MIGRATION_CURVE.length; i++) {
        if (IMP95469_MIGRATION_CURVE[i].aValue <= IMP95469_MIGRATION_CURVE[i - 1].aValue) {
          return false;
        }
      }
      const last = IMP95469_MIGRATION_CURVE[IMP95469_MIGRATION_CURVE.length - 1];
      return last.kBind === 114 && last.aValue === 6;
    },
  },
  {
    id: 'imp95469-peak-is-flagged-and-highest',
    description:
      'exactly one point is flagged isPeak, its kBind is the maximum ' +
      'over the curve, and it matches imp-95341 peak.kBind = 144',
    holds: () => {
      const peaks = IMP95469_MIGRATION_CURVE.filter((p) => p.isPeak);
      if (peaks.length !== 1) return false;
      const maxK = Math.max(...IMP95469_MIGRATION_CURVE.map((p) => p.kBind));
      return peaks[0].kBind === maxK && peaks[0].kBind === 144;
    },
  },
  {
    id: 'imp95469-crossover-matches-source',
    description: 'the branch crossover marker reproduces imp-95341 verbatim',
    holds: () =>
      IMP95469_BRANCH_CROSSOVER.aApprox === REC.rhoMigrationUniform.branchCrossover.aApprox &&
      IMP95469_BRANCH_CROSSOVER.rhoApprox === REC.rhoMigrationUniform.branchCrossover.rhoApprox,
  },
  {
    id: 'imp95469-r-invariance-matches-source',
    description:
      'the r-invariance ladder has 5 rows and reproduces the imp-95341 ' +
      'spread-by-a table verbatim, including the 5-chart crossover spread',
    holds: () => {
      if (IMP95469_R_INVARIANCE.length !== 5) return false;
      const crossoverRow = IMP95469_R_INVARIANCE.find((r) => r.aLabel === 'ln 10');
      return !!crossoverRow && crossoverRow.spreadCharts === 5;
    },
  },
];

for (const a of IMP95469_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95469-binding-chart-migration-viz-data assertion failed: ${a.id}`);
  }
}
