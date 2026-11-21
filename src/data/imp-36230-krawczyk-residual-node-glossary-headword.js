/**
 * @module imp-36230-krawczyk-residual-node-glossary-headword
 * @fileoverview imp-36230 -- import-light glossary/Concepts headword for the
 *   imp-36154 Krawczyk existence/uniqueness sub-gap (imp-34714a): the residual
 *   node F(m) = m - K log T0(m), the (H1) nonvanishing-derivative margin
 *   (F-prime(N_cross) ~ 0.9546), and the R1-R6 requirement ladder.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-36154 enumerated six concrete requirements (R1-R6) a certified
 *   unique-fixed-point enclosure for [F(m)] needs, but a reader landing on
 *   that module cold has no quick-lookup definition of the residual node
 *   itself, the (H1) margin figure, or what the R1-R6 ladder names. This
 *   headword bakes those facts VERBATIM (no re-import of the imp-36154
 *   module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Residual node: F(m) = m - K log T0(m), K = (C_C/E_trunc)^2 ~ 1.5727e8,
 *   T0(m) the Riemann-von Mangoldt height inverse. F(N_cross) = 0 at the
 *   certificate centre N_cross ~ 3.28e9. Exact derivative F-prime(m) =
 *   1 - K * 2 pi / (T0(m) log(T0(m)/2 pi)), evaluating to ~0.9546 at the
 *   centre -- comfortably away from 0, so the (H1) nonvanishing hypothesis
 *   holds with a LARGE margin. The R1-R6 ladder (value, derivative, (H1)
 *   test, (H2) self-map, directed-rounding layer, seed+assembly) is what a
 *   certified unique-fixed-point enclosure additionally requires; R2
 *   (derivative enclosure) and R5 (directed-rounding layer) are the live
 *   obstruction, NOT the operator math.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-36154 residual-node definition
 *   and R1-R6 ladder names for quick reference. It establishes nothing,
 *   instantiates no interval, closes no sub-gap. imp-34714a stays OPEN;
 *   imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-36154-krawczyk-existence-uniqueness-subgap-requirements (source: the R1-R6 requirements this glosses)
 * @see imp-36136-krawczyk-residual-directed-rounding-layer-construction-scope (residual-VALUE width side, R1)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact (H1)-(H2) lemma; sub-gap imp-34714a)
 *
 * Ticket: imp-36230 (content, medium). Documentation only; establishes no
 * enclosure; imp-34714a stays OPEN; NO QED; no refereed bound is changed.
 */

// The Krawczyk residual-node glossary headword, baked verbatim (no re-import).
const KRAWCZYK_RESIDUAL_NODE_HEADWORD = Object.freeze({
  key: 'krawczyk-residual-node',
  term: 'Krawczyk residual node F(m) (imp-34714a existence/uniqueness sub-gap)',
  definition:
    'The fixed-point operator F(m) = m - K log T0(m), K = (C_C/E_trunc)^2 ~ ' +
    '1.5727e8, T0(m) the Riemann-von Mangoldt height inverse (effectiveHeightForN). ' +
    'F(N_cross) = 0 at the certificate centre N_cross ~ 3.28e9.',
  h1Margin:
    'Exact derivative F-prime(m) = 1 - K * 2 pi / (T0(m) log(T0(m)/2 pi)) ~ 0.9546 ' +
    'at the centre -- comfortably away from 0, so the (H1) nonvanishing-derivative ' +
    'hypothesis holds with a LARGE margin (existence/uniqueness is NOT obstructed ' +
    'by any near-degeneracy of the residual node).',
  r1ToR6Ladder:
    'R1 certified residual VALUE [F(m)] (structure AVAILABLE via imp-36136); ' +
    'R2 certified DERIVATIVE enclosure [F-prime(m)] (GREENFIELD, never built); ' +
    'R3 the (H1) 0-not-in-[F-prime] test; R4 the (H2) Krawczyk self-map ' +
    'inclusion K([m]) subset int([m]); R5 the imp-34687a directed-rounding ' +
    'arithmetic layer (UNIMPLEMENTED, shared by R1-R4); R6 a certified seed ' +
    'bracket plus the (H1)+(H2) => unique-enclosed-root assembly.',
  liveObstruction:
    'the un-built certified derivative enclosure (R2) and the UNIMPLEMENTED ' +
    'directed-rounding layer (R5) -- NOT the operator math, which has a large ' +
    '(H1) margin.',
});

export const IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-36230',
  proofSection: 'S-frontier',
  glosses: 'imp-36154',
  scopes: 'imp-34714a',
  question:
    'imp-36154 enumerated the R1-R6 requirements for a certified unique-fixed-' +
    'point enclosure of the residual node F(m). What is the residual node, what ' +
    'is the (H1) margin, and what does the R1-R6 ladder name for a reader?',
  headword: KRAWCZYK_RESIDUAL_NODE_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-36154 ' +
    'residual node F(m) = m - K log T0(m), its (H1) nonvanishing-derivative ' +
    'margin (F-prime(N_cross) ~ 0.9546, large), and the R1-R6 requirement ladder ' +
    'for quick reference. Establishes nothing; instantiates no interval; closes ' +
    'no sub-gap; imp-34714a stays OPEN; NO QED. No refereed bound is changed' +
    '.',
  citation: 'imp-36154 (source R1-R6 requirements); imp-36136 (residual-VALUE op-DAG); imp-34714 (existence/uniqueness lemma).',
});

export default IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp36230-headword-has-required-fields',
    why: 'The headword must define the residual node, name the (H1) margin figure, and summarize the R1-R6 ladder -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD.headword;
      return (
        /F\(m\) = m - K log T0\(m\)/.test(h.definition) &&
        /0\.9546/.test(h.h1Margin) &&
        /R1/.test(h.r1ToR6Ladder) &&
        /R6/.test(h.r1ToR6Ladder) &&
        /R2/.test(h.liveObstruction) &&
        /R5/.test(h.liveObstruction)
      );
    },
  },
  {
    id: 'imp36230-honesty-gate-no-qed',
    why: 'Documentation only: no enclosure claimed established, imp-34714a stays OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD.anyEnclosureEstablished === false &&
      /NO QED/.test(IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD.verdict) &&
      /imp-34714a stays OPEN/.test(IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD.verdict) &&
      IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD.glosses === 'imp-36154' &&
      IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD.scopes === 'imp-34714a',
  },
];

for (const assertion of IMP36230_KRAWCZYK_RESIDUAL_NODE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36230-krawczyk-residual-node-glossary-headword assertion failed: ${assertion.id}`);
  }
}
