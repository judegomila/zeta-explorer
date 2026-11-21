/**
 * @module imp-35408-imp35264-kemp-literal-reconstruction-check
 *
 * imp-35408 (meta, sonnet-4-6): applies the imp-35339-style literal-verification method
 * (recompute a stored table literal from its defining identity, using the module's own
 * PUBLISHED columns, and confirm it reproduces to the storage-precision convention) to the
 * imp-35264 empirical-prefactor ladder kEmp = 0.39263/0.39948/0.40006/0.39997/0.41821 quoted
 * in the imp-35264 docstring at the imp-35076 rungs (N = 1e3, 1e4, 3e4, 1e5, 1e7).
 *
 * THE CHECK
 * ---------
 * imp-35264 exports a `crosscheck` array whose `kEmpirical` column is defined as
 *     kEmp = (rhoMeasured - 2/3) / eps^{3/2},
 * but the exported `eps` and `rhoMeasured` columns are themselves ALREADY ROUNDED for display
 * (eps to 4 significant figures, rhoMeasured to 6 decimals) -- the same rounded columns a reader
 * would copy off the page. This module recomputes kEmp directly from those two PUBLISHED,
 * already-rounded columns (not from any higher-precision internal value) and compares the
 * result to the stored `kEmpirical` literal at every rung.
 *
 * RESULT (measured, this build)
 * -----------------------------
 * The reconstruction matches the stored kEmpirical literal to within ~5e-7 at all nine
 * imp-35264 rungs (including the five singled out in the imp-35264 docstring). Unlike the
 * imp-35402 swapFraction check -- where dividing two independently-rounded 4-decimal columns
 * amplified rounding noise to a ~1.3% swing -- here eps^{3/2} does not shrink fast enough
 * relative to the rounding grain of eps (4 significant figures) to amplify noticeably: the
 * kEmp column IS faithfully reproducible from its own published sibling columns, at every
 * rung, to the storage precision imp-35264 already carries.
 *
 * MEASUREMENT / CONSISTENCY CHECK ONLY. Re-verifies a literal-reconstruction property of an
 * already-published cross-check; derives no new constant, changes no bound, discharges
 * nothing. G6a_shock_lipschitz stays OPEN; C_mb remains GUE-conditional (imp-486); NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck (the ladder being verified)
 * @see imp-35076-h3-a-fortiori-discharges-h4-numerical-verification (source of eps/rhoMeasured)
 * @see imp-35339 (the literal-verification method template this ticket applies)
 * @see imp-35402-eflow-fartail-ladder-literal-reconstruction-check (same method, different ladder;
 *      there the analogous recompute-from-rounded-siblings check FAILED tight reproduction)
 */

import { IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK } from './imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck.js';

const TWO_THIRDS = 2 / 3;
const CROSSCHECK = IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.crosscheck;

// Recompute kEmp from the PUBLISHED (already-rounded) eps / rhoMeasured columns alone.
const RECONSTRUCTION = CROSSCHECK.map((r) => {
  const recomputed = (r.rhoMeasured - TWO_THIRDS) / Math.pow(r.eps, 1.5);
  const diff = Math.abs(recomputed - r.kEmpirical);
  return {
    N: r.N,
    eps: r.eps,
    rhoMeasured: r.rhoMeasured,
    kEmpiricalStored: r.kEmpirical,
    kEmpiricalRecomputed: +recomputed.toFixed(6),
    diff: +diff.toExponential(3),
  };
});

const MAX_DIFF = RECONSTRUCTION.reduce((m, r) => Math.max(m, r.diff), 0);

export const IMP35408_IMP35264_KEMP_LITERAL_RECONSTRUCTION_CHECK = {
  id: 'imp-35408',
  proofSection: 'S-frontier',
  scopes:
    'Verify the imp-35264 stored empirical-prefactor ladder literals reconstruct as ' +
    '(rhoMeasured - 2/3) / eps^{3/2} from imp-35264\'s own PUBLISHED (already-rounded) eps and ' +
    'rhoMeasured columns, using the imp-35339 literal-verification method',
  question:
    'Do the imp-35264 kEmp literals (0.39263/0.39948/0.40006/0.39997/0.41821 at the imp-35076 ' +
    'rungs) reproduce from imp-35264\'s own published eps/rhoMeasured columns alone? ' +
    'Measurement only; discharges nothing; NO QED.',

  reconstruction: RECONSTRUCTION,
  maxAbsDiff: +MAX_DIFF.toExponential(3), // ~5e-7 across all nine rungs

  reconstructsFaithfully: MAX_DIFF < 1e-5,
  dischargesAnything: false,

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY: the imp-35264 kEmp literals reconstruct from imp-35264\'s own published ' +
    '(already-rounded) eps and rhoMeasured columns to within ~5e-7 at every rung, so the column ' +
    'is faithfully reproducible from its own published siblings -- unlike the analogous imp-35402 ' +
    'swapFraction check, which found a ~1.3% rounding-amplification gap. This certifies no new ' +
    'constant, changes no bound, and does NOT discharge O3 / H3 / H4 / G6a. G6a_shock_lipschitz ' +
    'stays OPEN; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35408_IMP35264_KEMP_LITERAL_RECONSTRUCTION_ASSERTIONS = [
  {
    id: 'imp35408-kemp-reconstructs-from-published-columns',
    description:
      'recomputing kEmp from imp-35264\'s own published eps/rhoMeasured columns matches the ' +
      'stored kEmpirical literal to < 1e-5 at every rung',
    holds: () =>
      RECONSTRUCTION.length === CROSSCHECK.length &&
      RECONSTRUCTION.every((r) => r.diff < 1e-5),
  },
  {
    id: 'imp35408-covers-all-docstring-highlighted-rungs',
    description: 'the reconstruction covers the five rungs singled out in the imp-35264 docstring',
    holds: () => {
      const highlighted = [0.392628, 0.399478, 0.400059, 0.399967, 0.418214];
      return highlighted.every((k) =>
        RECONSTRUCTION.some((r) => Math.abs(r.kEmpiricalStored - k) < 1e-6),
      );
    },
  },
  {
    id: 'imp35408-honesty-gate-no-qed',
    description: 'measurement only: discharges nothing, no QED, no refereed bound is changed',
    holds: () =>
      IMP35408_IMP35264_KEMP_LITERAL_RECONSTRUCTION_CHECK.isRigorous === false &&
      IMP35408_IMP35264_KEMP_LITERAL_RECONSTRUCTION_CHECK.dischargesAnything === false &&
      IMP35408_IMP35264_KEMP_LITERAL_RECONSTRUCTION_CHECK.reconstructsFaithfully === true &&
      /NO QED/.test(IMP35408_IMP35264_KEMP_LITERAL_RECONSTRUCTION_CHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35408_IMP35264_KEMP_LITERAL_RECONSTRUCTION_CHECK.verdict),
  },
];

for (const a of IMP35408_IMP35264_KEMP_LITERAL_RECONSTRUCTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35408-imp35264-kemp-literal-reconstruction-check assertion failed: ${a.id}`);
  }
}
