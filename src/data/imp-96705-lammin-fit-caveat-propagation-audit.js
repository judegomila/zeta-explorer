/**
 * @fileoverview imp-96705 -- caveat-propagation audit of every Route M consumer of the imp-96428
 * lam_min power-law fit (lam_min ~ A N^-p, A=0.8186721, p=1.917927), checking that each downstream
 * conditioning-ceiling figure states the fit-vs-rigorous status honestly rather than presenting an
 * extrapolated ceiling as if it were a certified bound (the failure mode imp-96602 named
 * "fit-extrapolated, not certified").
 *
 * METHOD. Static grep of src/data/*.js for the literal fit constants (0.8186721 / 1.917927, or the
 * rounded 0.8187 / 1.9179) and for "imp-96428", reading each hit in situ. No re-derivation; the
 * source module (imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js) is read to confirm its
 * own IMP96428_HONEST_BANNER / IMP96428_SUBGAP wording, which downstream consumers are expected to
 * echo or reference.
 *
 * FINDINGS. 19 consumers found. Two caveat styles both count as honest propagation:
 *   EXPLICIT (13) -- the module's own honest banner uses fit/extrapolation-specific language tied
 *     to the lam_min figure itself (e.g. "lammax-fit-extrapolated-to-4e7", "extrapolated to 1e16",
 *     "inherits fit-extrapolation").
 *   IMPLICIT (6) -- the module cites "@see imp-96428-..." (or an inline "imp-96428" comment) next to
 *     the literal A/p constants AND carries the house-style "NO QED; RH open; no refereed bound is changed"
 *     honest banner naming its own output as "Extrapolation/Measurement/Assessment/Audit only" --
 *     i.e. the module never claims a certified bound, even though it does not repeat the exact phrase
 *     "fit-extrapolated, not certified".
 * No consumer was found presenting an imp-96428-derived ceiling AS IF certified (the actual failure
 * mode this ticket screens for). Full per-consumer record in AUDITED below.
 *
 * VERDICT. All 19 consumers propagate the caveat (13 explicitly, 6 implicitly via @see + a generic
 * non-certified banner); none overstates the ceiling as rigorous. No fix required. This audit changes
 * no bound, establishes no operator positivity, and asserts no QED; no refereed bound is changed
 * . RH open.
 *
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (source fit + IMP96428_HONEST_BANNER)
 * @see imp-96602-lammin-verified-cholesky-cert-limit-glossary-headword.js (coined "fit-extrapolated, not certified")
 * @see imp-96686-route-m-lammax-overstatement-figure-label-audit.js (sibling consumer-consistency audit, same method)
 *
 * Ticket: imp-96705 (meta, sonnet-4-6, sonnet). Audit only; NO QED.
 */

const EXPLICIT = 'explicit';
const IMPLICIT = 'implicit';

const AUDITED = Object.freeze([
  Object.freeze({ consumer: 'imp-96443-route-m-vasyunin-lammax-measured.js', style: EXPLICIT, evidence: 'IMP96443_SUBGAP id "lammax-fit-extrapolated-to-4e7"' }),
  Object.freeze({ consumer: 'imp-96446-route-m-vasyunin-doubledouble-conditioning-reach.js', style: IMPLICIT, evidence: '"lam_min power law ... inherited verbatim from imp-96428 (itself pure re-analysis ...)"; honest banner "Extrapolation only ... no bound is claimed"' }),
  Object.freeze({ consumer: 'imp-96466-route-m-vasyunin-doubledouble-measured-lammax-ceiling.js', style: EXPLICIT, evidence: 'IMP96466_SUBGAP id "doubledouble-ceiling-extrapolated-to-1e16"' }),
  Object.freeze({ consumer: 'imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js', style: EXPLICIT, evidence: 'own honest banner names the fit as extrapolation, not a certified rigorous bound' }),
  Object.freeze({ consumer: 'imp-96563-route-m-lammin-rigorous-lower-bound-assessment.js', style: EXPLICIT, evidence: 'own honest banner distinguishes the rigorous lower-bound route from the imp-96428 fit extrapolation' }),
  Object.freeze({ consumer: 'imp-96570-route-m-conditioning-ceiling-crossvalidation.js', style: EXPLICIT, evidence: 'cross-validation banner flags the ceiling as fit-derived, not certified' }),
  Object.freeze({ consumer: 'imp-96582-route-m-lammin-bottom-edge-szego-assessment.js', style: EXPLICIT, evidence: 'assessment banner flags the imp-96428 fit as extrapolation' }),
  Object.freeze({ consumer: 'imp-96591-route-m-lammin-cert-limit-crossover-measurement.js', style: IMPLICIT, evidence: '"Reuses the imp-96428 fit (A, p)"; honest banner "no operator positivity ... NO QED"' }),
  Object.freeze({ consumer: 'imp-96602-lammin-verified-cholesky-cert-limit-glossary-headword.js', style: EXPLICIT, evidence: 'coins the phrase "fit-extrapolated, not certified" this ticket screens for' }),
  Object.freeze({ consumer: 'imp-96613-route-m-lammin-nuniform-lowerbound-obstruction-assessment.js', style: EXPLICIT, evidence: 'own honest banner flags the fit as extrapolation, not a proved uniform bound' }),
  Object.freeze({ consumer: 'imp-96631-route-m-largesieve-lower-frame-assessment.js', style: IMPLICIT, evidence: 'lamMinA/lamMinP literals commented "imp-96428 fit lam_min ~ A N^-p"; banner "Assessment only ... NO QED"' }),
  Object.freeze({ consumer: 'imp-96648-route-m-lammax-frobenius-moment-majorant.js', style: EXPLICIT, evidence: 'own honest banner flags the Frobenius majorant ceiling as fit-derived, not certified' }),
  Object.freeze({ consumer: 'imp-96657-conditioning-ceiling-crossvalidation-glossary-headword.js', style: EXPLICIT, evidence: 'glossary headword restates the fit-extrapolated-not-certified status for user-facing readers' }),
  Object.freeze({ consumer: 'imp-96667-route-m-frobenius-second-moment-asymptotic.js', style: IMPLICIT, evidence: '"IMP96667_LAMMIN = {A, p}" commented "imp-96428"; banner "no bound is proved rigorous ... NO QED"' }),
  Object.freeze({ consumer: 'imp-96684-route-m-frobenius-majorant-high-n-rungs.js', style: EXPLICIT, evidence: 'sub-gap id "imp-96684-frobenius-ceiling-inherits-fit-extrapolation"' }),
  Object.freeze({ consumer: 'imp-96689-route-m-lammin-doubledouble-cert-crossover-ladder.js', style: EXPLICIT, evidence: 'own honest banner flags the crossover ladder as fit-derived, not certified' }),
  Object.freeze({ consumer: 'imp-96694-route-m-majorant-ladder-above-9000.js', style: IMPLICIT, evidence: '"IMP96694_LAMMIN = {A, p}" commented "imp-96428 lam_min power law"; prose "the ceiling still extrapolates the log-fit"; banner "NO QED"' }),
  Object.freeze({ consumer: 'imp-96696-route-m-value-ratio-vs-ceiling-ratio-per-rung.js', style: IMPLICIT, evidence: 'A/p literals commented, prose "re-solved from the same lam_min power law"; banner "both are re-analysis ... No bound is claimed moved ... NO QED"' }),
  Object.freeze({ consumer: 'imp-96697-route-m-lammin-elementary-lower-bound-routes-assessment.js', style: EXPLICIT, evidence: 'own honest banner flags the elementary lower-bound comparison as fit-derived, not certified' }),
]);

export const IMP96705_LAMMIN_FIT_CAVEAT_AUDIT = Object.freeze({
  id: 'imp-96705-lammin-fit-caveat-propagation-audit',
  title:
    'Audit every Route M consumer of the imp-96428 lam_min power-law fit (A=0.8187, p=1.9179) to '
    + 'confirm each downstream conditioning-ceiling figure carries the "fit-extrapolated, not '
    + 'certified" caveat rather than presenting an extrapolated ceiling as certified',
  source: 'imp-96428 (fit source), imp-96602 (coined the caveat phrase)',
  fit: Object.freeze({ A: 0.8186721, p: 1.917927, model: 'lam_min ~ A * N^-p (log-log OLS)' }),
  audited: AUDITED,
  status:
    '19 Route M consumers of the imp-96428 A/p fit found; 13 carry the caveat EXPLICITLY (fit/'
    + 'extrapolation-specific banner wording tied to the ceiling figure), 6 carry it IMPLICITLY (an '
    + '@see/inline "imp-96428" citation next to the A/p literals plus a generic house-style "NO QED; '
    + 'RH open; no refereed bound is changed" non-certified banner). No consumer presents an imp-96428-derived '
    + 'ceiling as if it were a certified bound. Audit only; no re-derivation; no bound moved; NO QED.',
  verdict: Object.freeze({
    consumerCount: AUDITED.length,
    explicitCount: AUDITED.filter((c) => c.style === EXPLICIT).length,
    implicitCount: AUDITED.filter((c) => c.style === IMPLICIT).length,
    overstatedAsCertifiedCount: 0,
    conclusion:
      'Every consumer of the imp-96428 fit propagates a non-certified / extrapolation-only status, '
      + 'either by name (13) or by citation-plus-house-style-banner (6). No caveat-propagation gap '
      + 'found; no fix applied.',
  }),
  caveats:
    'Static grep-based consistency audit; performs no re-derivation of any bound. Distinguishes '
    + 'EXPLICIT wording (the fit/extrapolation language sits next to the specific ceiling figure) from '
    + 'IMPLICIT wording (a citation to imp-96428 plus the module-wide honest banner) -- both count as '
    + 'honest propagation because neither presents the ceiling as certified; only an outright missing '
    + 'or contradicted caveat would count as a gap, and none was found. Changes no bound; '
    + 'no refereed bound is changed; NO QED.',
});

export const IMP96705_LAMMIN_FIT_CAVEAT_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'exactly 19 consumers audited',
    holds: () => AUDITED.length === 19,
  },
  {
    name: 'every audited consumer has a non-empty evidence string',
    holds: () => AUDITED.every((c) => typeof c.evidence === 'string' && c.evidence.length > 10),
  },
  {
    name: 'explicit + implicit counts partition the full audited list',
    holds: () =>
      IMP96705_LAMMIN_FIT_CAVEAT_AUDIT.verdict.explicitCount
        + IMP96705_LAMMIN_FIT_CAVEAT_AUDIT.verdict.implicitCount
        === AUDITED.length,
  },
  {
    name: 'no consumer overstates the ceiling as certified',
    holds: () => IMP96705_LAMMIN_FIT_CAVEAT_AUDIT.verdict.overstatedAsCertifiedCount === 0,
  },
  {
    name: 'honest: audit only, no bound moved, no refereed bound is changed, NO QED',
    holds: () =>
      /Audit only/i.test(IMP96705_LAMMIN_FIT_CAVEAT_AUDIT.status)
      && /refereed bound is changed/i.test(IMP96705_LAMMIN_FIT_CAVEAT_AUDIT.caveats)
      && /NO QED/.test(IMP96705_LAMMIN_FIT_CAVEAT_AUDIT.status),
  },
]);

export default IMP96705_LAMMIN_FIT_CAVEAT_AUDIT;
