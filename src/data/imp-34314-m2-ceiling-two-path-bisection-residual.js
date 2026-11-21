// src/data/imp-34314-m2-ceiling-two-path-bisection-residual.js
//
// imp-34314: TABULATE the residual between the two INDEPENDENT bisections of the M2-residual
// sign-change ceiling that the imp-34302 gate asserts-but-never-reports.
//
// The imp-34302 canonical-value gate live-imports both
//   (a) imp-34127's OWN independent bisection kEnd_bisected~21.2809 (its Part B, reproducing imp-34023), and
//   (b) the imp-34023/imp-34237 CANONICAL bisected ceiling kEnd*=IMP34237_RESID_ZERO_KSTAR~21.28095,
// and its assertion imp-34302-cross-module-bisections-agree only checks |a - b| < 1e-2 -- it never
// records WHAT the residual actually is. This module measures kEnd_bisected - kEnd* explicitly, so the
// two-path agreement the gate presumes is quantified in a single published literal.
//
// MEASUREMENT ONLY -- no new derivation, no bound change, NO QED. No refereed bound is changed.
//
// @see imp-34302-m2-ceiling-cohort-canonical-value-gate.js (asserts agreement <1e-2, never tabulates it)
// @see imp-34127-m2-residual-signchange-ceiling-closed-form.js (own bisection kEnd_bisected, Part B)
// @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (canonical ceiling literal)

import { IMP34127_M2_RESIDUAL_SIGNCHANGE_CEILING_CLOSED_FORM } from './imp-34127-m2-residual-signchange-ceiling-closed-form.js';
import { IMP34237_RESID_ZERO_KSTAR } from './imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';

// imp-34127's own independent bisection of resid = pEcoll*(1 - sigma) - pSigma, stored at 4-decimal precision.
const KEND_BISECTED_IMP34127 = IMP34127_M2_RESIDUAL_SIGNCHANGE_CEILING_CLOSED_FORM.closedForm.kEnd_bisected; // 21.2809
// The imp-34023/imp-34237 canonical bisected sign-change ceiling.
const KEND_STAR_CANONICAL = IMP34237_RESID_ZERO_KSTAR; // 21.28095

// The measured inter-path residual: imp-34127's own bisection MINUS the canonical bisection.
const TWO_PATH_RESIDUAL = KEND_BISECTED_IMP34127 - KEND_STAR_CANONICAL; // -5.0e-5

// imp-34127's kEnd_bisected is published rounded to 1e-4, so the true underlying bisection agreement is
// bounded by |literal residual| + one half-ULP of the 4-decimal quantization (5e-5).
const QUANTIZATION_HALF_ULP = 0.5e-4; // half of 1e-4
const AGREEMENT_UPPER_BOUND = Math.abs(TWO_PATH_RESIDUAL) + QUANTIZATION_HALF_ULP; // <= 1e-4

export const IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL = Object.freeze({
  id: 'imp-34314-m2-ceiling-two-path-bisection-residual',
  ticket: 'imp-34314',

  kEndBisectedImp34127: KEND_BISECTED_IMP34127,
  kEndStarCanonical: KEND_STAR_CANONICAL,
  twoPathResidual: +TWO_PATH_RESIDUAL.toExponential(6),
  twoPathResidualAbs: +Math.abs(TWO_PATH_RESIDUAL).toExponential(6),
  agreementUpperBound: +AGREEMENT_UPPER_BOUND.toExponential(6),

  summary:
    'The two INDEPENDENT bisections of the M2-residual sign-change ceiling -- imp-34127 own path ' +
    'kEnd_bisected=21.2809 and the imp-34023/imp-34237 canonical kEnd*=21.28095 -- differ by ' +
    'kEnd_bisected - kEnd* = -5.0e-5. Accounting for the 1e-4 quantization of imp-34127 published literal, ' +
    'the true two-path agreement is bounded by |residual| + half-ULP <= 1.0e-4, comfortably inside the ' +
    '1e-2 tolerance the imp-34302 gate asserts. This is the quantified cross-check imp-34302 presumes but ' +
    'never tabulates.',

  verdict:
    'MEASURED: the two independent code paths for the M2 sign-change ceiling agree to residual -5.0e-5 ' +
    '(|.|<=1.0e-4 including quantization), a two-path confirmation of the canonical kEnd*~21.28095. ' +
    'No bound changed; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a>=0 untouched; NO QED; ' +
    'no refereed bound is changed.',

  honest:
    'MEASUREMENT-ONLY -- tabulates the difference between two already-published bisection literals; adds ' +
    'no new derivation and changes no bound. Both paths are surrogate-model estimator readings (the ' +
    'crossing is a 2pt-vs-5pt discretization artifact per imp-34127, not an analytic ceiling). ' +
    'No refereed bound is changed.',
});

export const IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL_ASSERTIONS = [
  {
    id: 'imp-34314-residual-equals-minus-5e-5',
    description: 'the measured inter-path residual kEnd_bisected - kEnd* equals -5.0e-5',
    holds: () => Math.abs(TWO_PATH_RESIDUAL - -5.0e-5) < 1e-9,
  },
  {
    id: 'imp-34314-agreement-within-gate-tolerance',
    description: 'the two-path residual is inside the 1e-2 tolerance the imp-34302 gate asserts',
    holds: () => Math.abs(TWO_PATH_RESIDUAL) < 1e-2,
  },
  {
    id: 'imp-34314-agreement-bound-within-1e-4',
    description: 'residual plus quantization half-ULP bounds the true agreement by 1e-4',
    holds: () => AGREEMENT_UPPER_BOUND <= 1.0e-4 + 1e-12,
  },
  {
    id: 'imp-34314-canonical-unchanged',
    description: 'the canonical ceiling literal remains 21.28095',
    holds: () => Math.abs(KEND_STAR_CANONICAL - 21.28095) < 1e-9,
  },
  {
    id: 'imp-34314-imp34127-honesty-intact',
    description: 'the imp-34127 source module still self-reports isRigorous===false',
    holds: () => IMP34127_M2_RESIDUAL_SIGNCHANGE_CEILING_CLOSED_FORM.isRigorous === false,
  },
  {
    id: 'imp-34314-measurement-only-honest',
    description: 'explicitly MEASUREMENT-ONLY, NO QED, no refereed bound is changed',
    holds: () => /MEASUREMENT-ONLY/.test(IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL.honest)
      && /refereed bound is changed/i.test(IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL.honest)
      && /NO QED/.test(IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL.verdict)
      && /refereed bound is changed/i.test(IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL.verdict),
  },
];

for (const a of IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34314-m2-ceiling-two-path-bisection-residual assertion failed: ${a.id}`);
  }
}

export default IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL;
