/**
 * @module imp-36284-krawczyk-certificate-half-width-a-glossary-headword
 * @fileoverview imp-36284 -- import-light glossary/Concepts headword defining the Krawczyk
 *   CERTIFICATE HALF-WIDTH a: the radius of the candidate box [X] = [N_cross - a, N_cross + a]
 *   that the imp-34714 Krawczyk existence/uniqueness test brackets around the imp-36017/imp-36153
 *   residual node F(m) = m - K log T0(m), and why the imp-36153 surrogate/layer width ratio
 *   behaves differently at a -> 0 (ULP floor, ~2x) versus macroscopic a (shared propagated-input
 *   width, ratio -> 1).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-36153 already measured the a-dependence in full and imp-34714 already states the general
 *   Krawczyk lemma in T-space, but neither module offers a quick-lookup definition of the box
 *   half-width parameter a itself, nor a one-paragraph restatement of WHY the same 2x factor that
 *   looked "a-independent" in imp-36017/imp-36066 collapses to 1x once a leaves the ULP floor.
 *   This headword bakes that restatement VERBATIM (no re-import of the imp-36153 module, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Certificate half-width a: for the fixed point N_cross of the residual node F(m) = m - K log
 *   T0(m) (imp-36017/imp-34774), the Krawczyk existence/uniqueness test of imp-34714 operates on a
 *   candidate box [X] = [N_cross - a, N_cross + a] rather than the bare point N_cross; a is the
 *   RADIUS of that box (a = 0 recovers point evaluation).
 *   a -> 0 (ULP floor): the surrogate-over-layer width ratio W_surr/W_layer pins to the imp-36017
 *   point value (~1.8418 at N_cross, up to a 2x ceiling elsewhere) because at this scale both
 *   widths are dominated by per-operation ROUNDING SLACK -- the imp-35969 nextafter surrogate pushes
 *   ~2 ULP per op, the a-priori correctly-rounded layer only ~1 ULP per op.
 *   Macroscopic a (a >> ULP(N)): the ratio decays monotonically to EXACTLY 1.0, because the
 *   a-proportional PROPAGATED-INPUT width ~2a(1 + g') is IDENTICAL in both models and dilutes the
 *   rounding-slack gap to nothing; the crossover half-width itself scales up with ULP(N) (imp-36153
 *   F3), so the 2x reading survives to larger a at greater height.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-36153 a-dependence finding and the imp-34714 box
 *   parameterization for quick reference. It establishes nothing, instantiates no interval, derives
 *   no remainder, changes no bound, closes no sub-gap. imp-34714a and imp-34687a REMAIN OPEN; NO
 *   QED. No refereed bound is changed.
 *
 * @see imp-36153-krawczyk-residual-surrogate-layer-ratio-a-dependence.js (source: the a-sweep this glosses)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma.js (source: the Krawczyk existence/uniqueness test the box a instruments)
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy.js (source of the point-input "a-independent 2x" claim being refined)
 * @see imp-36230-krawczyk-residual-node-glossary-headword.js (sibling headword: the residual node F(m) itself)
 *
 * Ticket: imp-36284 (content, low). Documentation only; establishes no enclosure;
 * imp-34714a/imp-34687a stay OPEN; NO QED; no refereed bound is changed.
 */

// The Krawczyk certificate half-width a definition and its a -> 0 vs macroscopic behavior, baked verbatim (no re-import).
const KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_HEADWORD = Object.freeze({
  key: 'krawczyk-certificate-half-width-a',
  term:
    'Krawczyk certificate half-width a (imp-34714 box parameter; imp-36153 a-dependence)',
  definition:
    'For the fixed point N_cross of the residual node F(m) = m - K log T0(m) (imp-36017/imp-34774), ' +
    'the imp-34714 Krawczyk existence/uniqueness test operates on a candidate box [X] = ' +
    '[N_cross - a, N_cross + a] rather than the bare point N_cross. The parameter a is the RADIUS ' +
    'of that box -- a = 0 recovers point evaluation, larger a widens the certificate.',
  behaviorAtAZero:
    'As a -> 0 (below the local rounding-slack scale, ~5e-7 at N_cross), the imp-36153 ' +
    'surrogate-over-layer width ratio W_surr/W_layer pins to the imp-36017 point value (~1.8418 at ' +
    'N_cross, never exceeding a 2x ceiling), because at this scale both widths are dominated by ' +
    'per-operation ROUNDING SLACK: the imp-35969 nextafter surrogate pushes both endpoints ~2 ULP ' +
    'per op while the a-priori correctly-rounded layer brackets each result to ~1 ULP per op.',
  behaviorAtMacroscopicA:
    'As a grows past the local ULP(N) scale, the ratio decays STRICTLY MONOTONICALLY toward EXACTLY ' +
    '1.0, because the a-proportional PROPAGATED-INPUT width ~2a(1 + g′) is IDENTICAL in the ' +
    'surrogate and layer models and dilutes the per-op rounding-slack gap to nothing. The crossover ' +
    'half-width itself SCALES WITH ULP(N) (imp-36153 F3): at greater height the 2x reading survives ' +
    'out to a larger a before decaying.',
  liveObstruction:
    'none as a glossary fact -- this restates a measurement (imp-36153), not an open sub-gap. ' +
    'imp-34714a (machine-checked Krawczyk certificate) and imp-34687a (directed-rounding layer) ' +
    'REMAIN OPEN independently of this a-dependence reading.',
});

export const IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-36284',
  proofSection: 'S-frontier',
  glosses: 'imp-36153',
  scopes: 'imp-34714a',
  question:
    'imp-34714 brackets the Krawczyk existence/uniqueness test around N_cross with a candidate box ' +
    '[X] = [N_cross - a, N_cross + a]. What is the half-width a, and why does the imp-36153 ' +
    'surrogate/layer width ratio behave differently at a -> 0 (ULP floor, ~2x) versus macroscopic a ' +
    '(shared propagated-input width, ratio -> 1)?',
  headword: KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Defines the Krawczyk certificate ' +
    'half-width a as the radius of the candidate box [X] = [N_cross - a, N_cross + a] (imp-34714), ' +
    'and restates the imp-36153 finding that the surrogate/layer width ratio pins to ~1.8418-2x at ' +
    'the a -> 0 ULP floor (per-op rounding-slack dominates) but decays to exactly 1x at macroscopic a ' +
    '(shared propagated-input width dominates). Establishes nothing; instantiates no interval; ' +
    'closes no sub-gap; imp-34714a and imp-34687a stay OPEN; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36153 (source a-dependence sweep); imp-34714 (Krawczyk existence/uniqueness lemma; box ' +
    'parameter a); imp-36017 (point-input "a-independent 2x" claim); imp-35969 (nextafter surrogate ' +
    'machinery); imp-34687 (directed-rounding layer scope).',
});

export default IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp36284-headword-has-required-fields',
    why: 'The headword must define the box half-width a and explain BOTH the a -> 0 and macroscopic-a ratio behaviors -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD.headword;
      return (
        /\[N_cross - a, N_cross \+ a\]/.test(h.definition) &&
        /ROUNDING SLACK/.test(h.behaviorAtAZero) &&
        /PROPAGATED-INPUT width/.test(h.behaviorAtMacroscopicA) &&
        /SCALES WITH ULP\(N\)/.test(h.behaviorAtMacroscopicA)
      );
    },
  },
  {
    id: 'imp36284-honesty-gate-no-qed',
    why: 'Documentation only: no enclosure claimed established, imp-34714a stays OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD.anyEnclosureEstablished === false &&
      /NO QED/.test(IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD.verdict) &&
      /imp-34714a and imp-34687a stay OPEN/.test(IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD.verdict) &&
      IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD.glosses === 'imp-36153' &&
      IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD.scopes === 'imp-34714a',
  },
];

for (const assertion of IMP36284_KRAWCZYK_CERTIFICATE_HALF_WIDTH_A_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36284-krawczyk-certificate-half-width-a-glossary-headword assertion failed: ${assertion.id}`);
  }
}
