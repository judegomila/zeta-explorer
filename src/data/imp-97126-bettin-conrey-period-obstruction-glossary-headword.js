/**
 * @module imp-97126-bettin-conrey-period-obstruction-glossary-headword
 * @fileoverview imp-97126 -- import-light Concepts glossary headword recording the imp-97097
 *   obstruction: the Route M cotangent first-moment reciprocity collapse succeeds EXACTLY on the
 *   fixed-modulus half (which contributes zero) and fails to elementarise the varying-modulus half
 *   that carries the entire leading moment, because that half is a Bettin-Conrey PERIOD FUNCTION
 *   average, not a rational/log closed form. A reader skimming "reciprocity collapses the
 *   cotangent first moment" (imp-97071 route (3)) could mistake this for a completed closed-form
 *   evaluation; this headword bakes the precise obstruction verbatim (no re-import) so it is on
 *   record as a genuine non-elementarity, not an unfinished computation.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The Vasyunin/Dedekind reciprocity c_0(h/k) + (k/h) c_0(k/h) is NOT an elementary rational/log
 *   expression -- it equals a Bettin-Conrey PERIOD function (the Estermann/Eisenstein period
 *   g(h/k)), numerically confirmed at (h,k)=(2,5): the reciprocity value 0.080325 matches neither
 *   candidate rational/log form (1/pi)(k/h - h/k - 1/(hk)) = 0.6366 nor -(1/pi)(h/k + k/h + 1/(hk))
 *   = -0.9549. Applied to the Route M cotangent first moment Phi(b) = Sum_{a=2,(a,b)=1}^{b-1}
 *   (V(a,b) + V(b,a)): the a <-> b-a antisymmetry V(b-a,b) = -V(a,b) makes the FIXED-modulus half
 *   Sum_{a in R_b} V(a,b) vanish EXACTLY (a fixed-point-free involution on reduced residues) --
 *   but that is precisely the half where a reduced-residue permutation exists, and it contributes
 *   nothing. The VARYING-modulus half Sum_a V(b,a) (a now the modulus, not a multiplier) carries
 *   the entire leading -0.077 phi(b) b moment, and there a is not a fixed set being permuted, so
 *   no elementary reciprocity applies: V(b,a) trades for a cotangent sum at the modular inverse
 *   plus a non-elementary Bettin-Conrey period term, over a VARYING modulus a.
 *
 *   STATUS: documentation glossary headword only, not a re-derivation or a new computation.
 *   Establishes nothing new; moves no bound. The residual absolute lower bound on the
 *   varying-modulus Vasyunin mean value (imp-97097's named sub-gap) remains open. NO QED.
 *   No refereed bound is changed; RH open.
 *
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (source: full derivation, the exact
 *   fixed-modulus vanishing, and the varying-modulus obstruction this headword glosses)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (parent: route (3), the
 *   reciprocity closed-form hope this leaf refutes as stated)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (sibling: the arithmetic part, which DOES
 *   have an exact closed form -- the contrast that makes the cotangent obstruction notable)
 *
 * Ticket: imp-97126 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

import { IMP97097_MEASURED, IMP97097_REDUCTION } from './imp-97097-route-m-cotangent-first-moment-reciprocity.js';

// The Bettin-Conrey period-function obstruction glossary headword, baked verbatim.
const BETTIN_CONREY_PERIOD_OBSTRUCTION_HEADWORD = Object.freeze({
  key: 'bettin-conrey-period-function-obstruction-varying-modulus-vasyunin-reciprocity',
  term:
    'the varying-modulus Vasyunin/Dedekind reciprocity is NON-ELEMENTARY: it collapses to a ' +
    'Bettin-Conrey period function, not a rational/log closed form',
  definition:
    'Vasyunin/Dedekind reciprocity c_0(h/k) + (k/h) c_0(k/h) equals a Bettin-Conrey period ' +
    '(Estermann/Eisenstein period g(h/k)), NOT an elementary rational/log expression -- verified ' +
    'numerically at (h,k)=(2,5): reciprocity value 0.080325 matches neither ' +
    '(1/pi)(k/h - h/k - 1/(hk)) = 0.6366 nor -(1/pi)(h/k + k/h + 1/(hk)) = -0.9549.',
  mechanism:
    'In the Route M cotangent first moment, the reciprocity/permutation trick succeeds exactly on ' +
    'the FIXED-modulus half Sum_{a in R_b} V(a,b) -- there a permutes a fixed reduced-residue set, ' +
    'and the sharper a <-> b-a antisymmetry forces exact vanishing (0, no error term). But that half ' +
    'contributes NOTHING to the leading moment. The entire leading moment lives in the VARYING-' +
    'modulus half Sum_a V(b,a), where a is itself the modulus -- no reduced-residue set is being ' +
    'permuted there, so the reciprocity identity applies but its output (a Bettin-Conrey period ' +
    'average over varying moduli) is not elementary. The obstruction is structural, not a gap in ' +
    'execution: the half that is easy to elementarise is exactly the half that vanishes.',
  verificationStatus:
    'Fixed-modulus vanishing is EXACT (imp-97097, verified to machine precision for even and odd b). ' +
    'The varying-modulus half is measured (coefficient ~ -0.076 phi(b) b, stable across b=31..257) ' +
    'but its non-elementarity as a Bettin-Conrey period average is a numerically-confirmed structural ' +
    'fact, not a closed form; no absolute lower bound on it is proved. No bound moved; NO QED; no refereed bound is changed' +
    '; RH open.',
});

export const IMP97126_BETTIN_CONREY_PERIOD_OBSTRUCTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97126',
  proofSection: 'S-frontier',
  glosses: 'imp-97097',
  question:
    'imp-97071 route (3) hoped Vasyunin/Dedekind reciprocity would elementarise the cotangent first ' +
    'moment. imp-97097 carried the reciprocity out. What exactly blocks it from producing a closed ' +
    'form, and where precisely does that obstruction sit?',
  headword: BETTIN_CONREY_PERIOD_OBSTRUCTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97097 finding: the ' +
    'varying-modulus Vasyunin reciprocity is non-elementary because it reduces to a Bettin-Conrey ' +
    'period function (Estermann/Eisenstein period), not a rational/log expression, while the ' +
    'fixed-modulus half that IS elementary (via the a <-> b-a antisymmetry) contributes exactly ' +
    'zero. Readers should read imp-97071 route (3) as REFUTED as stated -- not incomplete, but ' +
    'structurally obstructed on the half that carries the leading moment. Establishes nothing new; ' +
    'moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-97097 (the full derivation, the exact fixed-modulus vanishing, and the varying-modulus ' +
    'Bettin-Conrey obstruction this headword glosses); imp-97071 (the parent route (3) this leaf ' +
    'refutes as stated); imp-97096 (the sibling arithmetic part, which DOES admit an exact closed ' +
    'form, for contrast).',
});

export default IMP97126_BETTIN_CONREY_PERIOD_OBSTRUCTION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97126_BETTIN_CONREY_PERIOD_OBSTRUCTION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97126-headword-names-period-function-and-example',
    why: 'The headword must name the Bettin-Conrey period function and the numerical example that ' +
      'refutes the elementary rational/log candidates -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97126_BETTIN_CONREY_PERIOD_OBSTRUCTION_GLOSSARY_HEADWORD.headword;
      return (
        /Bettin-Conrey/.test(h.term) &&
        /period/.test(h.term) &&
        /0\.080325/.test(h.definition) &&
        /fixed-point-free|a <-> b-a/.test(h.mechanism) &&
        /varying-modulus/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97126-headword-consistent-with-source-measurements',
    why: 'The headword must record the same fixed-modulus-vanishes / varying-modulus-carries ' +
      'structure as its source module (imp-97097), not a re-typed approximation.',
    holds: () =>
      IMP97097_REDUCTION.fixedModulusVanishes.includes('= 0') &&
      Math.abs(IMP97097_MEASURED.varyingModulusCoeff - -0.076) < 1e-9,
  },
  {
    id: 'imp97126-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97126_BETTIN_CONREY_PERIOD_OBSTRUCTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97126_BETTIN_CONREY_PERIOD_OBSTRUCTION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97126_BETTIN_CONREY_PERIOD_OBSTRUCTION_GLOSSARY_HEADWORD.verdict) &&
      IMP97126_BETTIN_CONREY_PERIOD_OBSTRUCTION_GLOSSARY_HEADWORD.glosses === 'imp-97097',
  },
];

for (const assertion of IMP97126_BETTIN_CONREY_PERIOD_OBSTRUCTION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97126-bettin-conrey-period-obstruction-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
