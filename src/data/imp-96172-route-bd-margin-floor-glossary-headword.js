/**
 * @module imp-96172-route-bd-margin-floor-glossary-headword
 * @fileoverview imp-96172 -- import-light glossary/Concepts headword for the imp-96148
 *   Route B/D verdict: the on-line signed-force worst-support margin rho(32,T) FLATTENS
 *   to a strictly positive floor c ~ 0.143 as T grows (it never crosses zero), which
 *   RELOCATES the uniform-in-T obstruction OFF the critical line (a Weil-positivity-
 *   strength statement) rather than leaving it as an on-line margin-crossing question.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96148 fit two candidate decay laws to the seven-point worst-support (N=32)
 *   on-line margin column from imp-96020: a constant-slope log-linear law that would
 *   naively cross rho=0 near T ~ 9.3e4, and a reciprocal-log-with-floor law that fits
 *   strictly better (R2=0.991 vs 0.967) and asymptotes to c ~ 0.14256 > 0. The
 *   decelerating per-segment slope (|slope| trending ~0.17 -> ~0.07-0.10, not constant)
 *   selects the floor law and flags the naive crossing as a constant-slope extrapolation
 *   artifact. A reader landing on imp-96148 cold has no quick-lookup definition of what
 *   "the obstruction is relocated off the line" means or why the crossing law is wrong.
 *   This headword bakes those facts VERBATIM (no re-import of the imp-96148 module, to
 *   stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The worst-support (N=32) on-line signed-force feasibility margin rho(32,T) does not
 *   decay to zero: it flattens to a strictly positive floor c ~ 0.143 as T -> infinity,
 *   so the on-line Riemann-Siegel construction stays strictly feasible at every height.
 *   The genuine uniform-in-T obstruction therefore lives OFF the critical line, on
 *   complex pairs where no coefficient set has a universal confining sign -- a
 *   Weil-positivity-strength statement, inaccessible to the on-line construction.
 *
 *   MECHANISM: two OLS fits compete on the seven-point rho(32,T) column. The
 *   log-linear law rho = a + b*ln T (R2=0.967) assumes a constant decay slope and
 *   naively crosses zero at T ~ 93297. The reciprocal-log-with-floor law
 *   rho = c + d/ln T (R2=0.991) fits strictly better and has a strictly positive
 *   asymptote c = 0.14256. The per-segment slope drho/dlnT decelerates across the six
 *   segments rather than staying constant, which is exactly the signature the floor law
 *   predicts and the crossing law rules out.
 *
 *   STATUS: a DERIVATION / RELOCATION only. It upgrades the imp-96020 prose sub-gap
 *   ("precise obstruction to uniformity in T") to a quantitative statement, but proves
 *   no new bound and settles nothing about RH. The remaining binding wall is the named
 *   OFF-line uniform LP (Weil-positivity strength), unchanged from imp-96020/imp-96148.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96148 Route B/D verdict for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap,
 *   moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96148-route-bd-online-margin-decay-law (source: the decay-law derivation this glosses)
 * @see imp-96020-lp-signed-force-feasibility (LP setup and rho(N,T) grid origin)
 * @see imp-96167-route-bd-online-margin-floor-extended (independent height extension confirming imp-96148)
 *
 * Ticket: imp-96172 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The Route B/D margin-floor relocation headword, baked verbatim (no re-import).
const ROUTE_BD_MARGIN_FLOOR_HEADWORD = Object.freeze({
  key: 'route-bd-online-margin-positive-floor-relocation',
  term:
    'imp-96148 Route B/D verdict: the worst-support on-line margin rho(32,T) floors at ' +
    'c ~ 0.143 > 0 (never crosses zero), relocating the uniform-in-T obstruction OFF the ' +
    'critical line',
  definition:
    'A decay-law fit to the seven-point worst-support (N=32) on-line signed-force ' +
    'feasibility margin rho(32,T) from imp-96020. The reciprocal-log-with-floor law ' +
    'rho = c + d/ln T (c = 0.14256, d = 2.50166, R2 = 0.99093) beats a constant-slope ' +
    'log-linear law (R2 = 0.96687) that would naively cross rho = 0 near T ~ 93297. ' +
    'Because the fitted floor c is strictly positive, the on-line margin never reaches ' +
    'zero at any finite T.',
  mechanism:
    'The per-segment decay rate drho/dlnT decelerates across the six segments of the ' +
    'grid (magnitude trending from ~0.17 down to ~0.07-0.10, not constant). A constant ' +
    'slope is required by the log-linear crossing model; a decelerating slope is the ' +
    'signature of the positive-floor model. Both the higher R2 and the decelerating ' +
    'slope sequence select the floor law over the crossing law.',
  verificationStatus:
    'DERIVED, not a new bound: upgrades the imp-96020 prose sub-gap ("precise ' +
    'obstruction to uniformity in T") to a quantitative statement. The uniform-in-T ' +
    'obstruction is relocated OFF the critical line, onto complex pairs where Route B ' +
    'Test 2 found no coefficient set has a universal confining sign -- a ' +
    'Weil-positivity-strength statement out of reach of the on-line construction. ' +
    'Independently confirmed at higher height by imp-96167 (R2 gap widens further in ' +
    'favour of the floor law). Changes no bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96172_ROUTE_BD_MARGIN_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96172',
  proofSection: 'S-frontier',
  glosses: 'imp-96148',
  question:
    'imp-96148 fit the decay law of the worst-support on-line signed-force feasibility ' +
    'margin rho(32,T) and asked whether it crosses zero at finite T or floors positive. ' +
    'What did it find, and where does that put the uniform-in-T obstruction, for a ' +
    'reader landing on that module cold?',
  headword: ROUTE_BD_MARGIN_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96148 ' +
    'Route B/D verdict: the worst-support on-line margin rho(32,T) FLOATS to a strictly ' +
    'positive floor c ~ 0.143 (reciprocal-log fit R2 = 0.991, beating a log-linear fit ' +
    'R2 = 0.967 whose naive crossing at T ~ 9.3e4 is a constant-slope extrapolation ' +
    'artifact), so the on-line construction stays feasible at every height and the ' +
    'genuine uniform-in-T obstruction lives OFF the line as a Weil-positivity-strength ' +
    'statement. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96148 (the decay-law derivation this glosses); imp-96020 (LP setup and ' +
    'rho(N,T) grid origin); imp-96167 (independent height-extension confirmation).',
});

export default IMP96172_ROUTE_BD_MARGIN_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96172_ROUTE_BD_MARGIN_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96172-headword-has-required-fields',
    why: 'The headword must name the positive floor value, the R2 comparison, and the ' +
      'decelerating-slope discriminator -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96172_ROUTE_BD_MARGIN_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /0\.14256/.test(h.definition) &&
        /93297/.test(h.definition) &&
        /decelerates/i.test(h.mechanism) &&
        /OFF the critical line/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp96172-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96172_ROUTE_BD_MARGIN_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96172_ROUTE_BD_MARGIN_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96172_ROUTE_BD_MARGIN_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      IMP96172_ROUTE_BD_MARGIN_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-96148',
  },
];

for (const assertion of IMP96172_ROUTE_BD_MARGIN_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96172-route-bd-margin-floor-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
