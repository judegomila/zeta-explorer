/**
 * @module imp-97124-route-m-kappa-arith-glossary-headword
 * @fileoverview imp-97124 -- import-light Concepts glossary headword recording the imp-97096
 *   result: the ARITHMETIC part of the Route M first moment has an EXACT leading coefficient
 *   kappa_arith = (3/2) C - 3/8 = 0.5704960511308594..., where C = (log 2pi - gamma)/2. A reader
 *   skimming imp-97071's measured "~0.575 arithmetic part" could mistake it for a numerical
 *   estimate; this headword bakes the closed-form derivation verbatim (no re-import) so the exact
 *   value and its two-exact-plus-one-cancelling-log structure are on record without re-deriving.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   kappa_arith is the b -> infinity limit of F_arith(b)/(phi(b) b), where F_arith(b) is the sum
 *   of the arithmetic part A(a,b) = C(a+b) + (1/2)(a-b)log(b/a) over the phi(b) reduced residues
 *   a mod b. Two sub-parts are EXACT (no error term), from the elementary reduced-residue
 *   identities Sum_{a in R_b} 1 = phi(b) and Sum_{a in R_b} a = (1/2) b phi(b): the constant/linear
 *   part gives (3/2) C b phi(b), and the log b part gives -(1/4) b phi(b) log b. The remaining
 *   Moebius/Stirling coprime-sum part supplies +(1/4) b phi(b) log b - (3/8) b phi(b); its log b
 *   term CANCELS the exact -(1/4) b phi(b) log b term exactly, leaving the constant leading
 *   coefficient kappa_arith = (3/2) C - 3/8 = 0.5704960511308594..., matching the imp-97071
 *   measured ~0.575 (which drifts down to 0.5705 as b grows).
 *
 *   STATUS: documentation glossary headword only, not a re-derivation or a new computation.
 *   Establishes nothing new; moves no bound. The explicit remainder bound turning this exact
 *   leading coefficient into an absolute lower bound for all b remains open (imp-97096's named
 *   residual), as does the cotangent first moment (imp-97097). NO QED. No refereed bound is changed
 *   ; RH open.
 *
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (source: full derivation, exact value,
 *   and the named residual this headword glosses)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (parent: the ~0.575 measured
 *   reading this closed form matches)
 *
 * Ticket: imp-97124 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

import { IMP97096_KAPPA_ARITH } from './imp-97096-route-m-arith-first-moment-evaluation.js';

// The kappa_arith glossary headword, baked verbatim (no re-import of the derivation text).
const ROUTE_M_KAPPA_ARITH_HEADWORD = Object.freeze({
  key: 'route-m-arithmetic-first-moment-exact-leading-coefficient-kappa-arith',
  term:
    'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594..., the EXACT leading coefficient of the ' +
    'ARITHMETIC part of the Route M first moment F_arith(b)/(phi(b) b), where ' +
    'C = (log 2pi - gamma)/2',
  definition:
    'F_arith(b) = Sum over the phi(b) reduced residues a mod b of A(a,b) = C(a+b) + ' +
    '(1/2)(a-b)log(b/a). Two sub-parts are EXACT via Sum_{a in R_b} 1 = phi(b) and ' +
    'Sum_{a in R_b} a = (1/2) b phi(b): (3/2) C b phi(b) [constant/linear] and ' +
    '-(1/4) b phi(b) log b [log b part]. The remaining Moebius/Stirling coprime-sum part ' +
    'contributes +(1/4) b phi(b) log b - (3/8) b phi(b); its log b term cancels the exact one, ' +
    'leaving kappa_arith = (3/2) C - 3/8 = (3/4)(log 2pi - gamma) - 3/8.',
  mechanism:
    'The log b divergence appears in both the exact elementary part (E2) and the Moebius/Stirling ' +
    'part (M) individually, with opposite signs, so it cancels rigorously in the sum -- confirmed ' +
    'numerically (the normalized residual (F_arith - kappa_arith phi(b) b)/(phi(b) b log b) decays ' +
    'toward 0 as b grows). What survives is a pure constant expressed in the classical constants ' +
    'gamma and log 2pi that already define C, not a numerically-fit estimate.',
  verificationStatus:
    'Closed-form value derived and machine-verified at finite b (imp-97096); matches the imp-97071 ' +
    'measured ~0.575 arithmetic-part reading (which drifts to 0.5705 as b grows, 0.570495 at the ' +
    'primorial b=2310). Explicit remainder bound for all b not yet proved; establishes no bound; ' +
    'NO QED; no refereed bound is changed; RH open.',
});

export const IMP97124_ROUTE_M_KAPPA_ARITH_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97124',
  proofSection: 'S-frontier',
  glosses: 'imp-97096',
  question:
    'imp-97071 measured the arithmetic part of the Route M first moment at ~0.575 phi(b) b and ' +
    'flagged it as "elementary -- in principle rigorously evaluable." Is that leading coefficient ' +
    'an exact closed form, and if so, what is it?',
  headword: ROUTE_M_KAPPA_ARITH_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97096 finding: the ' +
    'arithmetic first moment has EXACT leading coefficient kappa_arith = (3/2) C - 3/8 = ' +
    '0.5704960511308594... = (3/4)(log 2pi - gamma) - 3/8, with two exact elementary sub-parts and ' +
    'a provable log b cancellation between them and the Moebius/Stirling remainder. Readers should ' +
    'read the ~0.575 imp-97071 figure as converging to this exact constant, not as an independent ' +
    'numerical estimate. Establishes nothing new; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97096 (the full derivation, exact value, and named remainder-bound residual this ' +
    'headword glosses); imp-97071 (the parent measured ~0.575 reading this closed form matches).',
});

export default IMP97124_ROUTE_M_KAPPA_ARITH_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97124_ROUTE_M_KAPPA_ARITH_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97124-headword-matches-source-value',
    why: 'The headword must record the same exact numeric value as its source module ' +
      '(imp-97096), not a re-typed approximation.',
    holds: () => Math.abs(IMP97096_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
  },
  {
    id: 'imp97124-headword-names-closed-form',
    why: 'The headword must name the closed form and the classical-constants expression -- the ' +
      'entire point of the glossary entry.',
    holds: () => {
      const h = IMP97124_ROUTE_M_KAPPA_ARITH_GLOSSARY_HEADWORD.headword;
      return (
        /\(3\/2\) C - 3\/8/.test(h.term) &&
        /0\.5704960511/.test(h.term) &&
        /log 2pi/.test(h.definition) &&
        /cancels/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97124-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97124_ROUTE_M_KAPPA_ARITH_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97124_ROUTE_M_KAPPA_ARITH_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97124_ROUTE_M_KAPPA_ARITH_GLOSSARY_HEADWORD.verdict) &&
      IMP97124_ROUTE_M_KAPPA_ARITH_GLOSSARY_HEADWORD.glosses === 'imp-97096',
  },
];

for (const assertion of IMP97124_ROUTE_M_KAPPA_ARITH_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97124-route-m-kappa-arith-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
