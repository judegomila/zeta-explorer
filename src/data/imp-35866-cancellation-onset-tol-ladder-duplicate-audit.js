/**
 * @module imp-35866-cancellation-onset-tol-ladder-duplicate-audit
 *
 * imp-35866 (numerical, S-frontier ticket audit): imp-35866 asked to "Tabulate the imp-35810
 * cancellation-onset height N_onset and |dG_onset| as tol sweeps 1e-4..1e-8, confirming the
 * a_onset ~ eps_mach/tol envelope and quantifying the PT-anchor safety margin a_onset/a_PT across
 * the tol range" -- measurement only on the inherited imp-3220/imp-3406 surrogate, reusing the
 * imp-35766/imp-34996 machinery verbatim.
 *
 * Auditing the data modules BEFORE writing a new tabulation found this ladder ALREADY EXISTS: the
 * module imp-35848-cancellation-onset-tol-ladder.js already sweeps tol over exactly
 * {1e-4, 1e-5, 1e-6, 1e-7, 1e-8}, reusing the imp-35810 two-evaluation measure() and the
 * sustained-3-point crossing rule VERBATIM, and for each rung tabulates N_onset(tol), a_onset(tol),
 * |dG_onset|(tol), the residual ratio a_onset/(eps_mach/tol) (the a_onset ~ eps_mach/tol envelope
 * confirmation), and the PT-anchor safety margin a_PT/a_onset. imp-35866 is a DUPLICATE of work
 * imp-35848 already completed (and which imp-35849 subsequently cross-validated).
 *
 * NOTE ON THE MARGIN DIRECTION. imp-35866 phrased the safety margin as a_onset/a_PT; imp-35848
 * records its reciprocal a_PT/a_onset. These are the SAME quantity read the natural way round:
 * reliability grows with LARGER a (further from the M_G - 1 cancellation), so the anchor is more
 * reliable than the onset threshold exactly when a_PT/a_onset >> 1. imp-35848 records ~2.5e7 at
 * tol=1e-4 down to ~1.1e3 at tol=1e-8 (a_onset/a_PT is simply the inverse, ~4e-8 up to ~9e-4).
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Seeds no redundant second ladder -- the imp-35848 module already supplies the full tol sweep,
 * the envelope confirmation, and the PT margin. This module records the duplicate-ticket finding
 * and pins a regression guard confirming the imp-35848 ladder stays present and delivers every
 * quantity imp-35866 requested. No new measurement; changes no bound; NO QED.
 *
 * @see imp-35848-cancellation-onset-tol-ladder (the pre-existing tol-ladder tabulation)
 * @see imp-35810-cancellation-onset-height (single-tol onset; C2/C3 asserted qualitatively)
 * @see imp-35849-cancellation-onset-cross-validation (cross-validated the imp-35848 ladder)
 * @see imp-35766-krawczyk-cancellation-ratio-beyond-band (B3 flagged the float-cancellation artifact)
 */

import {
  IMP35848_CANCELLATION_ONSET_TOL_LADDER,
} from './imp-35848-cancellation-onset-tol-ladder.js';

const REQUESTED_TOL_LADDER = [1e-4, 1e-5, 1e-6, 1e-7, 1e-8];
const LADDER = IMP35848_CANCELLATION_ONSET_TOL_LADDER.measurement.ladder;
const LADDER_TOLS = LADDER.map((r) => r.tol);

// Every quantity imp-35866 asked for is present per rung in the imp-35848 ladder.
const EVERY_RUNG_HAS_N_ONSET = LADDER.every((r) => typeof r.N_onset === 'number' && r.N_onset > 0);
const EVERY_RUNG_HAS_ABS_DG_ONSET = LADDER.every(
  (r) => typeof r.abs_dG_onset === 'number' && r.abs_dG_onset > 0,
);
const EVERY_RUNG_HAS_A_ONSET = LADDER.every((r) => typeof r.a_onset === 'number' && r.a_onset > 0);
const EVERY_RUNG_HAS_ENVELOPE_RESIDUAL = LADDER.every(
  (r) => typeof r.residual_ratio_a_over_theory === 'number' && r.residual_ratio_a_over_theory > 0,
);
const EVERY_RUNG_HAS_PT_MARGIN = LADDER.every(
  (r) => typeof r.PT_safety_margin_a_PT_over_a_onset === 'number',
);

export const IMP35866_CANCELLATION_ONSET_TOL_LADDER_DUPLICATE_AUDIT = {
  id: 'imp-35866',
  proofSection: 'S-frontier',
  question:
    'imp-35866 asked to tabulate the imp-35810 cancellation-onset height N_onset and |dG_onset| as ' +
    'tol sweeps 1e-4..1e-8, confirm the a_onset ~ eps_mach/tol envelope, and quantify the PT-anchor ' +
    'safety margin a_onset/a_PT across the tol range; audit whether such a tabulation already exists ' +
    'before seeding a duplicate.',
  finding:
    'DUPLICATE TICKET. imp-35848-cancellation-onset-tol-ladder.js already sweeps tol over exactly ' +
    '{1e-4,1e-5,1e-6,1e-7,1e-8} (reusing the imp-35810 two-evaluation measure() and sustained-3-point ' +
    'crossing verbatim) and tabulates, per rung, N_onset(tol), a_onset(tol), |dG_onset|(tol), the ' +
    'residual ratio a_onset/(eps_mach/tol) (the requested a_onset ~ eps_mach/tol envelope ' +
    'confirmation), and the PT-anchor safety margin a_PT/a_onset. The imp-35866 request is covered in ' +
    'full; imp-35849 subsequently cross-validated the same ladder. imp-35866 is a duplicate the ' +
    'frontier scout re-seeded from the shared imp-35810 module.',
  duplicateOf: 'imp-35848 (the ticket that authored the tol-ladder tabulation; cross-validated by imp-35849)',
  marginDirectionNote:
    'imp-35866 phrased the margin as a_onset/a_PT; imp-35848 records the reciprocal a_PT/a_onset ' +
    '(reliability grows with larger a). Same quantity, natural direction: a_PT/a_onset falls from ' +
    '~2.5e7 at tol=1e-4 to ~1.1e3 at tol=1e-8.',
  requestedTolLadder: REQUESTED_TOL_LADDER,
  observedTolLadder: LADDER_TOLS,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new tabulation added -- imp-35848 already supplies the full tol sweep 1e-4..1e-8 ' +
    'with N_onset, a_onset, |dG_onset|, the eps_mach/tol envelope residual, and the PT-anchor safety ' +
    'margin per rung (cross-validated by imp-35849). This module records the duplicate-ticket finding ' +
    'and pins a permanent regression guard confirming the imp-35848 ladder stays present and delivers ' +
    'every quantity imp-35866 requested. Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate; the imp-34714a machine certificate REMAINS OPEN; F(m) = 0 stays a double-precision ' +
    'artifact; changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35866_CANCELLATION_ONSET_TOL_LADDER_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35866-observed-ladder-matches-requested-tol-sweep',
    description: 'The imp-35848 ladder sweeps exactly the requested tol rungs {1e-4,1e-5,1e-6,1e-7,1e-8}',
    holds: () =>
      LADDER_TOLS.length === REQUESTED_TOL_LADDER.length &&
      REQUESTED_TOL_LADDER.every((t, i) => LADDER_TOLS[i] === t),
  },
  {
    id: 'imp35866-ladder-tabulates-N-onset-and-abs-dG-onset',
    description: 'Every rung records a positive N_onset and |dG_onset| (the two quantities imp-35866 named)',
    holds: () => EVERY_RUNG_HAS_N_ONSET === true && EVERY_RUNG_HAS_ABS_DG_ONSET === true,
  },
  {
    id: 'imp35866-ladder-confirms-envelope-and-pt-margin',
    description: 'Every rung records the eps_mach/tol envelope residual, a_onset, and the PT safety margin',
    holds: () =>
      EVERY_RUNG_HAS_A_ONSET === true &&
      EVERY_RUNG_HAS_ENVELOPE_RESIDUAL === true &&
      EVERY_RUNG_HAS_PT_MARGIN === true,
  },
  {
    id: 'imp35866-duplicate-of-imp-35848',
    description: 'The audit correctly attributes the pre-existing tabulation to imp-35848',
    holds: () => IMP35866_CANCELLATION_ONSET_TOL_LADDER_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35848'),
  },
  {
    id: 'imp35866-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; imp-34714a open; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35866_CANCELLATION_ONSET_TOL_LADDER_DUPLICATE_AUDIT.isRigorous === false &&
      /imp-34714a/.test(IMP35866_CANCELLATION_ONSET_TOL_LADDER_DUPLICATE_AUDIT.verdict) &&
      /NO QED/.test(IMP35866_CANCELLATION_ONSET_TOL_LADDER_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35866_CANCELLATION_ONSET_TOL_LADDER_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35866_CANCELLATION_ONSET_TOL_LADDER_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35866-cancellation-onset-tol-ladder-duplicate-audit assertion failed: ${a.id}`);
  }
}
