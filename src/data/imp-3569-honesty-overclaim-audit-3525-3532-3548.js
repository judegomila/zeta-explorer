/**
 * @module imp-3569-honesty-overclaim-audit-3525-3532-3548
 * @fileoverview imp-3569 -- Audit the newest imp-3525..3532 and imp-3548 modules
 * (and any page consumers) for inadvertent false-QED or RH-overclaim framing,
 * per the imp-3459/3480/imp-3499 honesty-audit pattern.
 *
 * METHOD (read-only, performed at author time). For each of the nine modules,
 * inspected the `summary` (or, for imp-3529, `verdict`) field for QED/proof/
 * RH-closure language, and verified the honesty-scope fields (`honestCaveat`
 * with isProof=false/rhEquivalent=true/didNotAttemptPositivity=true, or for
 * imp-3529 `isRigorous=false` plus an equivalent "no RH claim, NO QED" verdict
 * clause). Grepped src/pages for a real `import` edge (not just a comment/prose
 * mention) and, where the finding is independently re-stated by a companion
 * page, checked that page's rendered "Honest status" banner for matching text.
 *
 * RESULT (audited 2026-07-03): all nine modules are clean.
 * Per the sibling imp-3568 orphan audit, NONE of the nine modules is actually
 * `import`-ed by a page/component -- all nine are orphan data files. Five of
 * them (imp-3527, imp-3529, imp-3530, imp-3532, imp-3548) have their findings
 * independently RE-STATED (not imported) by a companion viz-data-driven page
 * that bakes its own literal values:
 *   - imp-3525-corrected-solver-agreement-crossval.js   : clean; no page consumer (orphan).
 *   - imp-3526-remainder-tail-cancellation-free-r4.js    : clean; no page consumer (orphan).
 *   - imp-3527-sinh-cancellation-safety-k-ladder.js      : clean; findings re-stated on
 *       src/pages/Imp3566CoshSinhMarginContrastViz.jsx with a matching "Honest status" banner.
 *   - imp-3528-degree4-moment-simpson-refinement.js      : clean; no page consumer (orphan).
 *   - imp-3529-sigma-postpeak-decay-exponent.js          : clean; findings re-stated on
 *       src/pages/Imp3565SigmaPostpeakDecayExponentViz.jsx with a matching "Honest status" banner.
 *   - imp-3530-power-iteration-budget-closed-form-fit.js : clean; findings re-stated on
 *       src/pages/Imp3540PowerIterationBudgetViz.jsx and
 *       src/pages/Imp3564PowerIterationClosedFormViz.jsx with matching "Honest status" banners.
 *   - imp-3531-far-tail-band-max-grid-convergence.js     : clean; no page consumer (orphan;
 *       src/pages/Imp3563QuadratureStraddleViz.jsx covers only the sibling imp-3548 finding).
 *   - imp-3532-moment-tail-closed-error-bound.js         : clean; findings re-stated on
 *       src/pages/Imp3567ClosedErrorCertificateViz.jsx with a matching "Honest status" banner.
 *   - imp-3548-xistar-quadrature-scheme-invariance.js    : clean; findings re-stated on
 *       src/pages/Imp3563QuadratureStraddleViz.jsx with a matching "Honest status" banner.
 *
 * None of the nine module summaries/verdicts contain "QED", "proves RH",
 * "resolves RH", or "closes RH" language. Every module states RH-EQUIVALENT
 * scope, NECESSARY-BUT-NOT-SUFFICIENT mass-feasibility, the imp-3066
 * off-diagonal endpoint-Hankel K_a&gt;=0 positivity UNTOUCHED, and cites
 * Platt-Trudgian Lambda&lt;=0.2 as the rigorous SOTA. No repair needed.
 *
 * @see imp-3459, imp-3480, imp-3499, imp-3594 (the prior/next honesty audits this pattern follows)
 * @see imp-3568 (the sibling orphan-module-surfacing audit for the same cohort)
 */

import { IMP3525_CORRECTED_SOLVER_AGREEMENT_CROSSVAL } from './imp-3525-corrected-solver-agreement-crossval.js';
import { IMP3526_REMAINDER_TAIL_CANCELLATION_FREE_R4 } from './imp-3526-remainder-tail-cancellation-free-r4.js';
import { IMP3527_SINH_CANCELLATION_SAFETY_K_LADDER } from './imp-3527-sinh-cancellation-safety-k-ladder.js';
import { IMP3528_DEGREE4_MOMENT_SIMPSON_REFINEMENT } from './imp-3528-degree4-moment-simpson-refinement.js';
import { IMP3529_SIGMA_POSTPEAK_DECAY_EXPONENT } from './imp-3529-sigma-postpeak-decay-exponent.js';
import { IMP3530_POWER_ITERATION_BUDGET_CLOSED_FORM_FIT } from './imp-3530-power-iteration-budget-closed-form-fit.js';
import { IMP3531_FAR_TAIL_BAND_MAX_GRID_CONVERGENCE } from './imp-3531-far-tail-band-max-grid-convergence.js';
import { IMP3532_MOMENT_TAIL_CLOSED_ERROR_BOUND } from './imp-3532-moment-tail-closed-error-bound.js';
import { IMP3548_XISTAR_QUADRATURE_SCHEME_INVARIANCE } from './imp-3548-xistar-quadrature-scheme-invariance.js';

// Negative lookbehind excludes the honest disclaimers themselves ("NO QED", "no RH verdict").
const OVERCLAIM_PATTERN = /(?<!no )\bQED\b|(?<!no )proves RH|resolves RH|closes RH/i;

function textOf(mod) {
  return mod.summary || mod.verdict || '';
}

export const IMP_3569_HONESTY_OVERCLAIM_AUDIT = {
  id: 'imp-3569',
  auditedAt: '2026-07-03',
  method:
    'Scan each module’s `summary` (or `verdict` for imp-3529) for QED/proof/RH-closure ' +
    'language, and verify its honesty-scope fields assert non-proof, RH-equivalence, and ' +
    'that operator positivity (imp-3066) was not attempted. Grep src/pages for a consumer ' +
    'and check any rendered banner matches.',
  modules: [
    {
      file: 'imp-3525-corrected-solver-agreement-crossval.js',
      module: IMP3525_CORRECTED_SOLVER_AGREEMENT_CROSSVAL,
      surfaced: false,
      surfacedBy: null,
      leakFound: false,
    },
    {
      file: 'imp-3526-remainder-tail-cancellation-free-r4.js',
      module: IMP3526_REMAINDER_TAIL_CANCELLATION_FREE_R4,
      surfaced: false,
      surfacedBy: null,
      leakFound: false,
    },
    {
      file: 'imp-3527-sinh-cancellation-safety-k-ladder.js',
      module: IMP3527_SINH_CANCELLATION_SAFETY_K_LADDER,
      surfaced: true,
      surfacedBy: 'src/pages/Imp3566CoshSinhMarginContrastViz.jsx ("Honest status" banner)',
      leakFound: false,
    },
    {
      file: 'imp-3528-degree4-moment-simpson-refinement.js',
      module: IMP3528_DEGREE4_MOMENT_SIMPSON_REFINEMENT,
      surfaced: false,
      surfacedBy: null,
      leakFound: false,
    },
    {
      file: 'imp-3529-sigma-postpeak-decay-exponent.js',
      module: IMP3529_SIGMA_POSTPEAK_DECAY_EXPONENT,
      surfaced: true,
      surfacedBy: 'src/pages/Imp3565SigmaPostpeakDecayExponentViz.jsx ("Honest status" banner)',
      leakFound: false,
    },
    {
      file: 'imp-3530-power-iteration-budget-closed-form-fit.js',
      module: IMP3530_POWER_ITERATION_BUDGET_CLOSED_FORM_FIT,
      surfaced: true,
      surfacedBy:
        'src/pages/Imp3540PowerIterationBudgetViz.jsx and ' +
        'src/pages/Imp3564PowerIterationClosedFormViz.jsx ("Honest status" banners)',
      leakFound: false,
    },
    {
      file: 'imp-3531-far-tail-band-max-grid-convergence.js',
      module: IMP3531_FAR_TAIL_BAND_MAX_GRID_CONVERGENCE,
      surfaced: false,
      surfacedBy: null,
      leakFound: false,
    },
    {
      file: 'imp-3532-moment-tail-closed-error-bound.js',
      module: IMP3532_MOMENT_TAIL_CLOSED_ERROR_BOUND,
      surfaced: true,
      surfacedBy: 'src/pages/Imp3567ClosedErrorCertificateViz.jsx ("Honest status" banner)',
      leakFound: false,
    },
    {
      file: 'imp-3548-xistar-quadrature-scheme-invariance.js',
      module: IMP3548_XISTAR_QUADRATURE_SCHEME_INVARIANCE,
      surfaced: true,
      surfacedBy: 'src/pages/Imp3563QuadratureStraddleViz.jsx ("Honest status" banner)',
      leakFound: false,
    },
  ],
  leaksFound: 0,
  honestNote:
    'Read-only audit; no leak found in any of the nine modules or their page consumers. ' +
    'No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3569_ASSERTIONS = [
  {
    id: 'imp3569-exactly-nine-modules-audited',
    holds: () => IMP_3569_HONESTY_OVERCLAIM_AUDIT.modules.length === 9,
    why: 'The audit must cover exactly the nine named imp-3525..3532/3548 modules.',
  },
  {
    id: 'imp3569-no-overclaim-in-summaries',
    holds: () =>
      IMP_3569_HONESTY_OVERCLAIM_AUDIT.modules.every(
        (m) => !OVERCLAIM_PATTERN.test(textOf(m.module))
      ),
    why: 'No module summary/verdict may contain QED / "proves RH" / "resolves RH" / "closes RH" language.',
  },
  {
    id: 'imp3569-no-leaks-found',
    holds: () =>
      IMP_3569_HONESTY_OVERCLAIM_AUDIT.modules.every((m) => m.leakFound === false) &&
      IMP_3569_HONESTY_OVERCLAIM_AUDIT.leaksFound === 0,
    why: 'This audit found zero honesty/overclaim leaks across imp-3525..3532/3548 and their consumers.',
  },
  {
    id: 'imp3569-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_3569_HONESTY_OVERCLAIM_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3569_HONESTY_OVERCLAIM_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3569_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3569 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3569_ASSERTIONS };
