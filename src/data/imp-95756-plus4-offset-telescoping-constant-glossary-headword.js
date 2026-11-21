/**
 * @module imp-95756-plus4-offset-telescoping-constant-glossary-headword
 * @fileoverview imp-95756 -- import-light glossary/Concepts headword for the imp-95720
 *   Sun Prop-6.3 +4 additive offset: the exact ten-digit J_raw(1/20)+4=kappa discrepancy is a
 *   regularized (6.17)->(6.21) telescoping constant (the divergent -2/(n+v) harmonic term
 *   absorbed by the A_rho/t subtraction), verified at m=20, m-independence OPEN.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95720's faithful 238-cell Prop-6.3 re-implementation reproduced the cell geometry and
 *   K_v curvature exactly, yet still isolated the entire anchor discrepancy as a single EXACT
 *   +4.000000000 additive offset. A reader landing on that module cold has no quick-lookup
 *   definition of why this offset is a composition/interface constant rather than a geometry
 *   or quadrature error, or of what its m-independence status actually is. This headword bakes
 *   those facts VERBATIM (no re-import of the imp-95720 module, to stay import-light) as a
 *   standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The Prop-6.3 v-integral (6.21) evaluated by the faithful 238-cell machinery gives
 *   J_raw(1/20) = -1.4893021089, while the certified anchor requires J = kappa =
 *   2.5106978912403926. The residual is an EXACT ADDITIVE OFFSET: J_raw(1/20) + 4 = kappa to
 *   1e-10 (ten digits). Because the 238-cell partition (matching the paper "238 raw cells")
 *   and the exact-cell K_v(1+v) (reproducing the exact -79/2 per-cell leading coefficient) are
 *   both independently verified, the offset cannot be a cell-certificate or quadrature error
 *   (grid == exact-B to 1e-9). It is instead a single un-ported term: the naive continuous
 *   reduction of eq (6.17) leaves a divergent -2u/u^2 = -2/(n+v) harmonic sum whose
 *   regularization against the A_rho/t subtraction is exactly the finite constant that (6.21)
 *   absorbs -- equivalently INT_0^1 Delta(v) zeta(3,1+v) dv = +4 exactly, i.e. a mean offset of
 *   8 over the zeta(3,1+v) weight (since INT_0^1 zeta(3,1+v) dv = 1/2).
 *
 *   STATUS: verified = +4 exactly at m=20 (the rho=1/20 anchor) to 1e-10; NOT yet proven
 *   m-independent off that anchor. This m-independence is the hinge imp-95720's conditional
 *   second-anchor measurement at rho2=1/19 depends on, and remains the named OPEN sub-gap.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95720 offset localization for quick reference.
 *   It establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95720-sun-prop63-second-anchor-obstruction (source: the +4 offset derivation and localization this glosses)
 * @see imp-95745-sun-prop63-plus4-offset-derivation (a companion derivation of the +4 offset)
 *
 * Ticket: imp-95756 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The +4 telescoping-constant headword, baked verbatim (no re-import).
const PLUS4_OFFSET_TELESCOPING_CONSTANT_HEADWORD = Object.freeze({
  key: 'sun-prop63-plus4-offset-telescoping-constant',
  term: 'Sun Prop-6.3 +4 additive offset (regularized (6.17)->(6.21) telescoping constant)',
  definition:
    'The exact residual J_raw(1/20) + 4 = kappa (to 1e-10, ten digits) between the faithful ' +
    '238-cell evaluation of the Prop-6.3 v-integral (6.21) and the certified anchor kappa = ' +
    'c_odd(1/20)/rho^2 = 2.5106978912403926. Because the cell partition and the exact-cell ' +
    'K_v curvature are both independently reproduced (grid == exact-B to 1e-9), the offset is ' +
    'NOT a cell-certificate or quadrature error -- it is a single un-ported regularized ' +
    'constant from the (6.17)->(6.21) telescoping reduction.',
  mechanism:
    'The naive continuous reduction of eq (6.17) leaves a divergent -2u/u^2 = -2/(n+v) ' +
    'harmonic term; its regularization against the A_rho/t subtraction is exactly the finite ' +
    'constant that (6.21) absorbs. Equivalently, INT_0^1 Delta(v) zeta(3,1+v) dv = +4 exactly, ' +
    'a mean offset of 8 over the zeta(3,1+v) weight (since INT_0^1 zeta(3,1+v) dv = 1/2).',
  verificationStatus:
    'Verified = +4 exactly (to 1e-10) at m=20, the rho=1/20 anchor where c_odd is certified. ' +
    'NOT yet proven m-independent off that single anchor -- this is the named OPEN sub-gap ' +
    'that imp-95720\'s conditional rho2=1/19 second-anchor measurement is gated on.',
});

export const IMP95756_PLUS4_OFFSET_TELESCOPING_CONSTANT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95756',
  proofSection: 'S-frontier',
  glosses: 'imp-95720',
  question:
    'imp-95720 isolated the entire Prop-6.3 anchor discrepancy as an exact +4.000000000 ' +
    'additive offset. What is this offset, why is it a composition/interface constant rather ' +
    'than a geometry or quadrature error, and what is its m-independence status, for a reader ' +
    'landing on that module cold?',
  headword: PLUS4_OFFSET_TELESCOPING_CONSTANT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95720 offset ' +
    'localization: J_raw(1/20) + 4 = kappa to 1e-10, isolated to a regularized (6.17)->(6.21) ' +
    'telescoping constant (the divergent -2/(n+v) harmonic term absorbed by the A_rho/t ' +
    'subtraction), NOT the cell certificate or quadrature. Verified exactly at m=20 only; ' +
    'm-independence remains OPEN. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95720 (the +4 offset derivation and localization this glosses); imp-95702 (named the ' +
    'blocking sub-gap this module sharpened); imp-95745 (companion +4 offset derivation).',
});

export default IMP95756_PLUS4_OFFSET_TELESCOPING_CONSTANT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95756_PLUS4_OFFSET_TELESCOPING_CONSTANT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95756-headword-has-required-fields',
    why: 'The headword must name the exact +4 offset, the telescoping-constant mechanism, and the m=20-only verification status -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95756_PLUS4_OFFSET_TELESCOPING_CONSTANT_GLOSSARY_HEADWORD.headword;
      return (
        /\+ 4 = kappa/.test(h.definition) &&
        /telescoping/i.test(h.definition) &&
        /-2\/\(n\+v\)/.test(h.mechanism) &&
        /verified = \+4 exactly/i.test(h.verificationStatus) &&
        /m-independent/i.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95756-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95756_PLUS4_OFFSET_TELESCOPING_CONSTANT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95756_PLUS4_OFFSET_TELESCOPING_CONSTANT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95756_PLUS4_OFFSET_TELESCOPING_CONSTANT_GLOSSARY_HEADWORD.verdict) &&
      IMP95756_PLUS4_OFFSET_TELESCOPING_CONSTANT_GLOSSARY_HEADWORD.glosses === 'imp-95720',
  },
];

for (const assertion of IMP95756_PLUS4_OFFSET_TELESCOPING_CONSTANT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95756-plus4-offset-telescoping-constant-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
