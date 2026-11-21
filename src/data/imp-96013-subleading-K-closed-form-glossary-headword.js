/**
 * @module imp-96013-subleading-K-closed-form-glossary-headword
 * @fileoverview imp-96013 -- import-light Concepts glossary headword for the imp-95983
 *   closed form of the imp-95965 accumulated-slope subleading constant:
 *     K = 11/2 - 2 gamma - 3 pi^2/8 = 0.644467019788...
 *   Documentation only: no re-import of imp-95983 (stays import-light), no re-derivation,
 *   no new quadrature. Bakes the literal so a reader can look the constant up without
 *   opening the full imp-95983 module.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   imp-95965 defined K = lim_{m->inf} (accumTotal(m) - 4 C_1 m), the O(1) subleading term
 *   of the accumulated-slope sum accumTotal(m), and measured it only coarsely (0.649960 at
 *   m=20 falling to 0.645198 at m=150, quoted K ~ 0.6452), with no closed form. imp-95983
 *   closed it exactly via Euler-Maclaurin on the four loci families:
 *     K = 2 J0 + (5/2) Iv = -C_1 + (5/2) Iv,
 *   with the two exact building blocks
 *     -C_1 = 2 INT_0^1 v^2 zeta(3,1+v) dv = 3 - 2 gamma - pi^2/6   (imp-95900),
 *     Iv   = INT_0^1 v zeta(3,1+v) dv       = 1 - pi^2/12           (per-locus telescope, imp-95983).
 *   Substituting collapses the pi^2 terms to 3 pi^2/8 and cancels zeta(3) entirely:
 *     K = 11/2 - 2 gamma - 3 pi^2/8 = 0.644467019788...
 *   confirmed offline to ~1e-8 by Richardson extrapolation (2 K_{2m} - K_m, m up to 1280).
 *
 *   WHAT THIS IS AND IS NOT
 *   -----------------------------------------------
 *   A glossary-style lookup restating the imp-95983 closed form for quick reference. It
 *   establishes nothing new, instantiates no interval, closes no sub-gap beyond what
 *   imp-95983 already closed, and moves no bound. The imp-95965 base-scalar obstruction
 *   (s_base_prime, c_base_prime jointly under-determined) is UNCHANGED by K being exact.
 *   Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; NO
 *   Lambda movement; no refereed bound is changed; NO QED.
 *
 * @see imp-95983-subleading-K-closed-form (source: the Euler-Maclaurin derivation and
 *   high-precision Richardson-extrapolation confirmation this glosses)
 * @see imp-95965 (the coarse K ~ 0.6452 measurement and the accumulated-slope attribution
 *   this constant belongs to)
 * @see imp-95900 (source of -C_1 = 3 - 2 gamma - pi^2/6)
 *
 * Ticket: imp-96013 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// fundamental constants (baked literals; standard values) -- checked arithmetically below,
// no quadrature, no re-import of imp-95983.
const GAMMA = 0.5772156649015329; // Euler-Mascheroni
const PI2 = Math.PI * Math.PI;
const K_CLOSED = 11 / 2 - 2 * GAMMA - 3 * PI2 / 8; // 0.644467019788...

const SUBLEADING_K_HEADWORD = Object.freeze({
  key: 'subleading-K-accumulated-slope-closed-form',
  term: 'Accumulated-slope subleading constant K (imp-95983 closed form)',
  definition:
    'K = lim_{m->inf} (accumTotal(m) - 4 C_1 m), the O(1) subleading term of the ' +
    'imp-95965 accumulated-slope sum. imp-95983 closed it exactly in terms of gamma and ' +
    'pi^2 only: K = 11/2 - 2 gamma - 3 pi^2/8 = 0.644467019788..., with zeta(3) cancelling ' +
    'completely between the leading-coefficient identity and the Euler-Maclaurin endpoint terms.',
  assembly:
    'K = 2 J0 + (5/2) Iv = -C_1 + (5/2) Iv, where J0 = -C_1/2 = INT_0^1 v^2 zeta(3,1+v) dv ' +
    'and Iv = INT_0^1 v zeta(3,1+v) dv. Building blocks: -C_1 = 3 - 2 gamma - pi^2/6 ' +
    '(imp-95900) and Iv = 1 - pi^2/12 (each per-locus integral telescopes; imp-95983).',
  priorCoarseValue:
    'imp-95965 measured K only coarsely on a small m grid: 0.649960 at m=20 falling to ' +
    '0.645198 at m=150, quoted as K ~ 0.6452 with no closed form.',
  confirmation:
    'Offline (EM-tail Hurwitz zeta + 2000-panel Simpson, m up to 1280): the raw residual ' +
    'K_m - K_closed is pure O(1/m), and Richardson extrapolation 2 K_{2m} - K_m converges ' +
    'to K_closed with residual shrinking from 1.03e-5 at (m=20,40) to 1.03e-8 at (m=640,1280).',
});

export const IMP96013_SUBLEADING_K_CLOSED_FORM_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96013',
  proofSection: 'S-frontier',
  glosses: 'imp-95983',
  question:
    'What is the closed form of the imp-95965 accumulated-slope subleading constant K, and ' +
    'where can a reader look it up without re-opening the full imp-95983 derivation module?',
  headword: SUBLEADING_K_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95983 result: ' +
    'K = 11/2 - 2 gamma - 3 pi^2/8 = 0.644467019788, an exact combination of the ' +
    'Euler-Mascheroni constant and pi^2 with zeta(3) fully cancelled, confirmed offline to ' +
    '~1e-8 by Richardson extrapolation. Replaces the imp-95965 coarse literal K ~ 0.6452 as ' +
    'the citable value. The imp-95965 base-scalar obstruction is UNCHANGED. Establishes ' +
    'nothing new; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95983 (the Euler-Maclaurin derivation and Richardson-extrapolation confirmation ' +
    'this headword glosses); imp-95965 (the coarse K ~ 0.6452 measurement and the ' +
    'accumulated-slope attribution K belongs to); imp-95900 (-C_1 = 3 - 2 gamma - pi^2/6); ' +
    'imp-95916 (sliding-flux route zero; HOLD term carries the -C_1 cancellation).',
});

export default IMP96013_SUBLEADING_K_CLOSED_FORM_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96013_SUBLEADING_K_CLOSED_FORM_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96013-headword-has-required-fields',
    why: 'The headword must name the closed form, the exact numeric value, and the prior ' +
      'coarse literal it replaces -- the entire point of the entry.',
    holds: () => {
      const h = IMP96013_SUBLEADING_K_CLOSED_FORM_GLOSSARY_HEADWORD.headword;
      return (
        /11\/2 - 2 gamma - 3 pi\^2\/8/.test(h.definition) &&
        /0\.644467019788/.test(h.definition) &&
        /0\.6452/.test(h.priorCoarseValue) &&
        /1\.03e-8/.test(h.confirmation)
      );
    },
  },
  {
    id: 'imp96013-arithmetic-matches-closed-form',
    why: 'The baked literal must match the arithmetic identity K = 11/2 - 2 gamma - 3 pi^2/8 ' +
      'exactly (this module does not re-import imp-95983, so it re-checks arithmetically).',
    holds: () => Math.abs(K_CLOSED - 0.644467019788) < 1e-9,
  },
  {
    id: 'imp96013-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96013_SUBLEADING_K_CLOSED_FORM_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96013_SUBLEADING_K_CLOSED_FORM_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96013_SUBLEADING_K_CLOSED_FORM_GLOSSARY_HEADWORD.verdict) &&
      IMP96013_SUBLEADING_K_CLOSED_FORM_GLOSSARY_HEADWORD.glosses === 'imp-95983',
  },
];

for (const assertion of IMP96013_SUBLEADING_K_CLOSED_FORM_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96013-subleading-K-closed-form-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
