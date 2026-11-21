/**
 * @module imp-96275-route-bd-margin-decay-discriminator-glossary-headword
 * @fileoverview imp-96275 -- import-light Concepts glossary headword for the imp-96148/imp-96173
 *   Route B/D margin decay law: two competing T-decay fits to the worst-support (N=32) on-line
 *   signed-force margin rho(32,T), and the POSITIVE-FLOOR DISCRIMINATOR (higher R2 plus a
 *   decelerating per-segment slope sequence) that selects the reciprocal-log-with-floor law
 *   over the naive log-linear crossing law.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96148 derived the two competing fits and imp-96173 consolidated them into a seven-row
 *   reader-facing table with the six per-segment slopes, but neither module names the
 *   discriminator itself as a standalone, reusable lookup concept: the two-part test (R2
 *   comparison AND slope-deceleration signature) that tells a reader which decay law to trust
 *   on a short, noisy T-column. imp-96172 already restates the imp-96148 VERDICT (the floor
 *   value c ~ 0.143 and the relocation-off-the-line conclusion); this headword instead names
 *   the DISCRIMINATOR METHOD itself, citing the imp-96173 table's per-segment slope sequence
 *   verbatim, so the two headwords are complementary, not duplicates. Bakes the facts verbatim
 *   (no re-import of either module, to stay import-light) as a standalone lookup entry.
 *
 * @see imp-96148-route-bd-online-margin-decay-law (source: the two OLS fits this glosses)
 * @see imp-96173-route-bd-margin-decay-fits-table (source: the seven-row table and six per-segment slopes)
 * @see imp-96172-route-bd-margin-floor-glossary-headword (the existing imp-96148 VERDICT headword this complements)
 *
 * Ticket: imp-96275 (content, low). Documentation only; establishes nothing; changes no bound;
 * NO QED; no refereed bound is changed.
 */

// The decay-law discriminator headword, baked verbatim (no re-import).
const ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_HEADWORD = Object.freeze({
  key: 'route-bd-margin-decay-law-positive-floor-discriminator',
  term:
    'imp-96148/imp-96173: the positive-floor discriminator for the Route B/D margin decay ' +
    'law -- higher R2 PLUS a decelerating per-segment slope, not either alone',
  definition:
    'Two candidate T-decay laws compete on the seven-point worst-support (N=32) on-line ' +
    'signed-force margin column rho(32,T) from imp-96020: a constant-slope log-linear law ' +
    'rho = a + b*ln T (R2 = 0.96687) that would naively cross rho = 0 near T ~ 93297, and a ' +
    'reciprocal-log-with-floor law rho = c + d/ln T (R2 = 0.99093, floor c = 0.14256) that ' +
    'never crosses zero. The discriminator is the joint test that selects between them.',
  discriminator:
    'imp-96173 tabulates the six per-segment slopes drho/dlnT across the seven-point column: ' +
    '-0.1702, -0.1112, -0.1076, -0.0591, -0.0724, -0.0975 -- decelerating in magnitude from ' +
    '~0.17 down to ~0.06-0.10 rather than staying constant. A constant slope is required by ' +
    'the log-linear crossing model; a decelerating slope is the signature the floor model ' +
    'predicts. The two-part discriminator is: (1) the reciprocal-log-with-floor fit has the ' +
    'strictly higher R2 (0.99093 vs 0.96687), AND (2) the observed per-segment slopes ' +
    'decelerate rather than holding constant. Either signal alone is suggestive; both ' +
    'agreeing is what selects the floor law over the crossing law here.',
  verificationStatus:
    'DOCUMENTATION only: names a discriminator method already applied in imp-96148/imp-96173, ' +
    'proves no new bound, and settles nothing about RH. The floor-law verdict itself (positive ' +
    'floor c ~ 0.143, obstruction relocated off the critical line) is the subject of the ' +
    'separate imp-96172 headword this one complements, not restates.',
});

export const IMP96275_ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96275',
  proofSection: 'S-frontier',
  glosses: 'imp-96148',
  scopes: 'imp-96173',
  question:
    'imp-96148 fit two competing T-decay laws to the worst-support on-line margin rho(32,T), ' +
    'and imp-96173 tabulated both fits with the six per-segment slopes. What is the actual ' +
    'discriminator that tells a reader which fit to trust, stated as a standalone lookup ' +
    'concept rather than buried inside the two source modules?',
  headword: ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the two-part discriminator ' +
    'used by imp-96148/imp-96173 to select the reciprocal-log-with-floor law (R2 = 0.99093, ' +
    'floor c = 0.14256) over the log-linear crossing law (R2 = 0.96687, naive crossing at ' +
    'T ~ 93297): the higher R2 AND the six per-segment slopes decelerating in magnitude ' +
    '(0.1702 -> 0.0975) rather than staying constant. Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96148 (the two competing OLS fits); imp-96173 (the seven-row table and six ' +
    'per-segment slopes this discriminator is drawn from); imp-96172 (the complementary ' +
    'imp-96148 verdict headword: the floor value and the off-line relocation conclusion).',
});

export default IMP96275_ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96275_ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96275-headword-has-required-fields',
    why: 'The headword must name both R2 values, the naive crossing height, and the ' +
      'decelerating per-segment slope sequence -- the entire point of the discriminator.',
    holds: () => {
      const h = IMP96275_ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_GLOSSARY_HEADWORD.headword;
      return (
        /0\.99093/.test(h.definition) &&
        /0\.96687/.test(h.definition) &&
        /93297/.test(h.definition) &&
        /-0\.1702/.test(h.discriminator) &&
        /-0\.0975/.test(h.discriminator) &&
        /decelerat/i.test(h.discriminator)
      );
    },
  },
  {
    id: 'imp96275-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96275_ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96275_ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96275_ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_GLOSSARY_HEADWORD.verdict) &&
      IMP96275_ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_GLOSSARY_HEADWORD.glosses === 'imp-96148' &&
      IMP96275_ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_GLOSSARY_HEADWORD.scopes === 'imp-96173',
  },
];

for (const assertion of IMP96275_ROUTE_BD_MARGIN_DECAY_DISCRIMINATOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96275-route-bd-margin-decay-discriminator-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
