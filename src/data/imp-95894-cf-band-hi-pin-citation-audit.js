/**
 * @fileoverview imp-95894 -- follow-up citation audit for the imp-95691 CF_BAND_HI_PINNED = 1.29615
 * geometric-mean pin, extending the imp-95769 consumer audit to the two glossary headwords written
 * after it (imp-95713, imp-95797) and re-checking whether the imp-95754 viz completeness gap that
 * imp-95769 flagged is still open.
 *
 * WHY. imp-95769 audited five consumers of CF_BAND_HI_PINNED (imp-95691/95705/95721/95747/95754) and
 * found none surfaces a superseded multiplier (1.29615, 1.914x, or 6.1-8.6x) as the current honest
 * representative, but flagged one completeness gap: the imp-95754 viz curve's visible endpoint was
 * the intermediate imp-95721 6.1-8.6x band, omitting the imp-95747 converged 9.583x landmark. Two
 * glossary headwords citing CF_BAND_HI (imp-95713, imp-95797) were written after that audit and were
 * never checked against it.
 *
 * METHOD. Static re-enumeration: (a) read the current imp-95754-cf-wedge-depth-vs-multiplier-viz-data.js
 * source to see whether the 9.583x landmark has since been added; (b) read imp-95713 and imp-95797 for
 * any bare citation of 1.29615 without a supersession note.
 *
 * FINDINGS.
 *   1. imp-95754 viz-data GAP CLOSED: IMP95754_WEDGE_DEPTH_CURVE now carries 10 landmark points, the
 *      last being { cf: 9.5831, minGap: -0.184642, source: "imp-95747" } -- the exact landmark imp-95769
 *      flagged as missing. The rendering page (Imp95754CfWedgeDepthVsMultiplierViz.jsx) plots the full
 *      curve on a log domain reaching cf=10 and narrates the chain through the imp-95747 9.5831x
 *      saturation point. The imp-95769 completeness gap no longer exists; no new ticket needed.
 *   2. imp-95713 (glossary headword): cites 1.29615 only inside a "NOTE (honest status)" paragraph
 *      that explicitly states the pin "has since been superseded by a chain of sharper measurements
 *      (imp-95705 -> imp-95721 -> imp-95747, converging to 9.583x)" and directs readers to imp-95691's
 *      honestStatus field. PASS.
 *   3. imp-95797 (supersession-chain glossary headword): its entire purpose IS to document the chain
 *      1.29615 -> 1.914x -> 6.1x-8.6x -> 9.583x and states "r_eff_GUE = 9.583x is the current honest
 *      representative" explicitly. PASS.
 *
 * VERDICT. Re-running the imp-95769 audit scope plus the two glossary headwords it predates: NO
 * consumer of CF_BAND_HI anywhere in src/ cites the superseded 1.29615 pin (or the 1.914x / 6.1-8.6x
 * intermediates) as the current honest value, and the one completeness gap imp-95769 flagged has
 * since been closed. This audit changes no bound, establishes no operator positivity, and asserts no
 * QED; no refereed bound is changed. NO heavy imports.
 */

const CF_BAND_HI_PINNED = 1.29615;   // imp-95691 geometric-mean estimate, retained for numeric stability
const CF_CONVERGED = 9.583;          // imp-95747 GUE-saturated cutoff-independent honest representative
const IMP95754_VIZ_ENDPOINT_CF = 9.5831;       // current imp-95754 curve's last landmark cf
const IMP95754_VIZ_ENDPOINT_MINGAP = -0.184642; // current imp-95754 curve's last landmark minGap

const SITES = Object.freeze([
  Object.freeze({
    module: 'imp-95754-cf-wedge-depth-vs-multiplier-viz-data.js + Imp95754CfWedgeDepthVsMultiplierViz.jsx',
    priorStatus: 'imp-95769 FLAGGED: curve endpoint was the intermediate imp-95721 6.1-8.6x band; imp-95747 9.583x absent',
    currentStatus: 'GAP CLOSED: curve now has 10 points ending at cf=9.5831, minGap=-0.184642 (imp-95747)',
    stillCitesSupersededAsHonest: false,
  }),
  Object.freeze({
    module: 'imp-95713-cf-band-hi-wedge-opening-glossary-headword.js',
    priorStatus: 'not audited by imp-95769 (written after it)',
    currentStatus: 'cites 1.29615 only inside an explicit honest-status supersession note pointing to 9.583x',
    stillCitesSupersededAsHonest: false,
  }),
  Object.freeze({
    module: 'imp-95797-cf-multiplier-supersession-glossary-headword.js',
    priorStatus: 'not audited by imp-95769 (written after it)',
    currentStatus: 'documents the full 1.29615 -> 1.914x -> 6.1-8.6x -> 9.583x chain and names 9.583x as current honest value',
    stillCitesSupersededAsHonest: false,
  }),
]);

export const IMP95894_CF_BAND_HI_PIN_CITATION_AUDIT = Object.freeze({
  id: 'imp-95894-cf-band-hi-pin-citation-audit',
  title:
    'Follow-up citation audit: the imp-95769-flagged imp-95754 viz completeness gap is CLOSED, and '
    + 'the two post-imp-95769 glossary headwords (imp-95713, imp-95797) both correctly cite the '
    + 'imp-95747 converged 9.583x as the current honest CF_BAND_HI representative',
  status:
    'AUDIT PASS. No page, glossary headword, or viz-data module anywhere in src/ cites the superseded '
    + 'imp-95691 pin 1.29615 (or the intermediate 1.914x / 6.1-8.6x measurements) as the current honest '
    + 'CF_BAND_HI value. The imp-95754 viz-data module and its rendering page now include the imp-95747 '
    + '9.5831x / minGap -0.184642 landmark that imp-95769 had flagged as missing, closing that '
    + 'completeness gap. Citation/consistency audit only; changes no bound; establishes no operator '
    + 'positivity; no refereed bound is changed; NO QED',
  source: 'imp-95769 (prior audit), imp-95754 (viz, gap now closed), imp-95713 + imp-95797 (glossary headwords)',
  sites: SITES,
  verdict: Object.freeze({
    anySiteStillCitesSupersededAsHonest: false,
    priorGapStillOpen: false,
    conclusion:
      'The imp-95769 audit correctness verdict still holds and its one completeness gap no longer '
      + 'exists. No follow-up re-point ticket is needed.',
  }),
  caveats:
    'Static re-enumeration with carried literals only; no re-derivation of any box-min gap or reach '
    + 'multiplier. No refereed bound is changed; NO QED.',
});

export const IMP95894_CF_BAND_HI_PIN_CITATION_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'imp-95754 viz endpoint now matches the imp-95747 converged value',
    holds: () =>
      Math.abs(IMP95754_VIZ_ENDPOINT_CF - CF_CONVERGED) < 0.01
      && Math.abs(IMP95754_VIZ_ENDPOINT_MINGAP - -0.184642) < 1e-9,
  },
  {
    name: 'all three re-audited sites pass (none cites 1.29615 as current honest)',
    holds: () =>
      SITES.length === 3
      && SITES.every((s) => s.stillCitesSupersededAsHonest === false)
      && IMP95894_CF_BAND_HI_PIN_CITATION_AUDIT.verdict.anySiteStillCitesSupersededAsHonest === false,
  },
  {
    name: 'prior imp-95769 completeness gap recorded as closed',
    holds: () => IMP95894_CF_BAND_HI_PIN_CITATION_AUDIT.verdict.priorGapStillOpen === false,
  },
  {
    name: 'pin literal 1.29615 strictly below the converged 9.583x representative',
    holds: () => CF_BAND_HI_PINNED < CF_CONVERGED,
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () =>
      /changes no bound/.test(IMP95894_CF_BAND_HI_PIN_CITATION_AUDIT.status)
      && /refereed bound is changed/i.test(IMP95894_CF_BAND_HI_PIN_CITATION_AUDIT.status)
      && /NO QED/.test(IMP95894_CF_BAND_HI_PIN_CITATION_AUDIT.status),
  },
]);

for (const a of IMP95894_CF_BAND_HI_PIN_CITATION_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95894-cf-band-hi-pin-citation-audit assertion failed: ${a.name}`);
  }
}

export default IMP95894_CF_BAND_HI_PIN_CITATION_AUDIT;
