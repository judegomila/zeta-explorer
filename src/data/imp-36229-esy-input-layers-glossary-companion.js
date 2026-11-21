/**
 * @module imp-36229-esy-input-layers-glossary-companion
 * @fileoverview imp-36229 -- import-light glossary-companion entry for the
 *   imp-36180 ESY (Erdos-Schlein-Yau) local-law THREE input layers (I spectral-
 *   measure statement / II microscopic rigidity scale / III C_mb coupling),
 *   naming what each layer supplies for random/regular data versus what stays
 *   OPEN for the deterministic arithmetic seed {gamma_k}.
 *
 *   WHY A GLOSSARY-COMPANION (not a re-derivation)
 *   -----------------------------------------------
 *   imp-36180 broke the idealized "ESY local law" black box gating the
 *   irreducible C_mb GUE-conditional (G5-cmb-gue, imp-486) into three concrete
 *   layers. A reader landing on that module cold has to reconstruct which layer
 *   is which and what "supplied vs open" means per layer. This companion bakes
 *   the three layer definitions VERBATIM (no re-import of lambda-roadmap.js, to
 *   stay import-light) as a standalone lookup, alongside the CM-DBM literature
 *   split and the deterministic-seed obstruction.
 *
 *   THE THREE LAYERS (verbatim from imp-36180)
 *   -------------------------------------------
 *   I   spectral-measure statement -- a local semicircle law for the
 *       Calogero-Moser (CM) empirical spectral measure down to the microscopic
 *       (mean-spacing) scale. Random/regular data: proven for Wigner-type
 *       ensembles and beta-ensembles with analytic potential (the CM flow is
 *       beta=2 Dyson dynamics). Deterministic seed: OPEN -- the CM system here
 *       is seeded by the arithmetic zeros {gamma_k}, not a random ensemble, so
 *       the standard input does not transfer (the imp-486 object).
 *   II  rigidity scale -- microscopic-scale rigidity of particle locations at
 *       the optimal fluctuation scale, N-uniformly. Random/regular data:
 *       theorem for Wigner / post-relaxation DBM. Deterministic seed: the
 *       imp-3725 true-flow enclosure gives WINDOW-LOCAL control on [1e4, 1e6]
 *       with zero GUE input (imp-36079 surrogate); N-uniform rigidity as
 *       N -> infinity stays OPEN.
 *   III C_mb coupling -- the map from local spacing statistics to the
 *       collision-drift average that IS C_mb. Random/regular data: a computable
 *       functional given a GUE local-statistics input (imp-462/imp-486
 *       machinery). Deterministic seed: only as strong as the (open)
 *       universality feeding it -- imp-486 found no unconditional substitute
 *       (GGM, Huxley both fail), so C_mb stays GUE-conditional.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-36180 three-layer split for quick
 *   reference. It establishes nothing, discharges no conditional, claims no
 *   input available, and changes no bound. The C_mb GUE-conditional (imp-486)
 *   stays irreducible; imp-2519 no-overclaim guard preserved; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-36180-esy-cmb-local-law-input-scope (source: the three-layer scoping this glosses)
 * @see imp-486 (exhaustive search confirming no unconditional C_mb bound -- src/math/c-mb-unconditional-bound.js)
 * @see imp-36181-step5-obligation-chain-cross-reference (Step-5 six-item overview naming G5-cmb-gue)
 *
 * Ticket: imp-36229 (content, medium). Documentation only; establishes no local
 * law; C_mb stays GUE-conditional; NO QED; no refereed bound is changed.
 */

// The three ESY-input-layer glossary headwords, baked verbatim (no re-import).
const ESY_INPUT_LAYER_HEADWORDS = Object.freeze([
  Object.freeze({
    key: 'esy-input-spectral-measure-statement',
    term: 'ESY input layer I -- spectral-measure statement',
    definition:
      'A local semicircle law for the Calogero-Moser empirical spectral measure, ' +
      'down to the microscopic (mean-spacing) scale.',
    randomDataSupplies:
      'Proven for Wigner-type ensembles and analytic-potential beta-ensembles ' +
      '(the CM flow is beta=2 Dyson dynamics).',
    deterministicSeedOpen:
      'OPEN -- the CM system is seeded by the deterministic arithmetic zeros ' +
      '{gamma_k}, not a random ensemble; the standard input does not transfer ' +
      '(the imp-486 object).',
  }),
  Object.freeze({
    key: 'esy-input-rigidity-scale',
    term: 'ESY input layer II -- rigidity scale',
    definition:
      'Microscopic-scale rigidity of particle locations, N-uniformly, at the ' +
      'optimal fluctuation scale.',
    randomDataSupplies:
      'Theorem for Wigner matrices and DBM after local relaxation.',
    deterministicSeedOpen:
      'The imp-3725 true-flow enclosure gives WINDOW-LOCAL control on ' +
      '[1e4, 1e6] with zero GUE input (imp-36079 surrogate); N-uniform ' +
      'rigidity as N -> infinity stays OPEN.',
  }),
  Object.freeze({
    key: 'esy-input-cmb-coupling',
    term: 'ESY input layer III -- coupling to C_mb',
    definition:
      'The map from local spacing statistics to the collision-drift average ' +
      'that constitutes the many-body correction C_mb.',
    randomDataSupplies:
      'A computable functional given a GUE local-statistics input ' +
      '(imp-462/imp-486 machinery).',
    deterministicSeedOpen:
      'OPEN -- only as strong as the universality input feeding it: imp-486 ' +
      'exhaustive search found no unconditional substitute (GGM, Huxley both ' +
      'fail), so C_mb stays GUE-conditional.',
  }),
]);

export const IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION = Object.freeze({
  id: 'imp-36229',
  proofSection: 'S-frontier',
  glosses: 'imp-36180',
  scopes: 'imp-486',
  question:
    'imp-36180 scoped the idealized ESY local law gating G5-cmb-gue into three ' +
    'concrete input layers. What does each layer mean, what does it supply for ' +
    'random/regular data, and what stays OPEN for the deterministic arithmetic seed?',
  esyInputLayerHeadwords: ESY_INPUT_LAYER_HEADWORDS,
  anyInputEstablished: false,
  verdict:
    'GLOSSARY-COMPANION ONLY (documentation, not a proof). Restates the imp-36180 ' +
    'three ESY-input layers for quick reference: (I) spectral-measure statement, ' +
    '(II) rigidity scale, (III) C_mb coupling -- each proven for random/regular ' +
    'data by the CM/DBM literature but OPEN for the deterministic arithmetic seed ' +
    '{gamma_k}. Establishes nothing; discharges no conditional; the C_mb ' +
    'GUE-conditional (imp-486) stays irreducible; NO QED. No refereed bound is changed' +
    '.',
  citation: 'imp-36180 (source three-layer scoping); imp-486 (C_mb irreducibility); imp-36181 (Step-5 overview).',
});

export default IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION;

// -- Tripwire assertions ------------------------------------------------------
export const IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION_ASSERTIONS = [
  {
    id: 'imp36229-three-headwords-in-order',
    why: 'Exactly the three ESY-input-layer headwords (spectral-measure statement, rigidity scale, C_mb coupling) must be present in order, matching imp-36180.',
    holds: () => {
      const L = IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION.esyInputLayerHeadwords;
      return (
        L.length === 3 &&
        L.map((x) => x.key).join(',') ===
          'esy-input-spectral-measure-statement,esy-input-rigidity-scale,esy-input-cmb-coupling'
      );
    },
  },
  {
    id: 'imp36229-each-headword-has-random-vs-open-split',
    why: 'Every headword must record BOTH what random/regular data supplies AND what stays open for the deterministic seed -- the entire point of the glossary entry.',
    holds: () => {
      const L = IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION.esyInputLayerHeadwords;
      return L.every(
        (x) =>
          typeof x.randomDataSupplies === 'string' &&
          x.randomDataSupplies.length > 0 &&
          typeof x.deterministicSeedOpen === 'string' &&
          /OPEN/.test(x.deterministicSeedOpen),
      );
    },
  },
  {
    id: 'imp36229-honesty-gate-no-qed',
    why: 'Documentation only: no input claimed established, C_mb stays GUE-conditional, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION.anyInputEstablished === false &&
      /NO QED/.test(IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION.verdict) &&
      /refereed bound is changed/i.test(IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION.verdict) &&
      IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION.scopes === 'imp-486' &&
      IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION.glosses === 'imp-36180',
  },
];

for (const assertion of IMP36229_ESY_INPUT_LAYERS_GLOSSARY_COMPANION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36229-esy-input-layers-glossary-companion assertion failed: ${assertion.id}`);
  }
}
