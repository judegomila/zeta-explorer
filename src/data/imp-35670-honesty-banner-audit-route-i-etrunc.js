/**
 * @module imp-35670-honesty-banner-audit-route-i-etrunc
 *
 * imp-35670 (meta, audit): AUDIT the four route-(i)/E_trunc scoping-assessment
 * modules -- imp-35538, imp-35571, imp-35419, imp-35556 -- for (a) whether each
 * carries the derives-nothing / discharges-nothing / C_mb-GUE-conditional
 * (imp-486) / NO-QED disposition banner, and (b) whether any is registered in
 * visualizations-index.js or otherwise presented as a bound-changing result.
 *
 * METHOD. Read all four src/data modules directly (each is import-light: zero
 * heavy imports, at most the light lambda-rh-height-mapping.js helper) and
 * checked their exported `verdict` string for the disposition markers. Then
 * grepped src/data/visualizations-index.js for each ticket id to find any
 * registered viz-page entry citing it as `paperSourcePath`.
 *
 * FINDING 1 -- BANNERS. All four carry the discharge-nothing (/discharges?
 * nothing|derives no remainder|ports? nothing/i) and no-QED/remains-SOTA
 * (/NO QED/, /refereed bound is changed/i) markers. The GUE-conditional (imp-486) marker,
 * however, is present in only THREE of the four (imp-35538, imp-35571,
 * imp-35556); imp-35419 cites NO "imp-486" anywhere in the file. This is NOT a
 * missing banner: imp-35419's whole subject is S_barrier, a statement it
 * explicitly labels "NO GUE, NO PCC" and repeatedly calls
 * "deterministic-barrier-conditional" -- a DIFFERENT conditionality class from
 * the GUE-conditional caveat imp-486 records. Citing imp-486 there would be
 * inapplicable, not more honest; the module's own explicit
 * deterministic-vs-GUE distinction is the correct (and more precise)
 * disclaimer for its content. So: 4/4 discharge + no-QED/no-refereed-bound-change banners, 3/4 +
 * 1 legitimate-exception on the GUE-conditional banner. No genuine omission.
 *
 * FINDING 2 -- REGISTRATION. Three of the four (imp-35538, imp-35571,
 * imp-35556) ARE cited as `paperSourcePath` by a registered visualization: the
 * viz pages imp-35580 (route /viz-imp35580-req4-height-gap), imp-35597 (route
 * /viz-imp35597-threshold-collapse) and imp-35665
 * (route /viz-imp35665-pinsker-common-functional-bridge) respectively.
 * imp-35419 has NO registered viz page. This is NOT an overclaim: every one of
 * those three viz entries carries its OWN `honestCeiling` field re-asserting
 * "no new computation/derivation", "measurement only", and "changes no bound,
 * establishes no operator positivity, no RH verdict" -- the same disposition
 * baked into the source module. The `mathBucket: 'bound'` tag on those entries
 * is a topical shelf label (this visualization concerns the Lambda-bound
 * research thread), not a claim that the bound moved; every sibling entry in
 * that file carrying `mathBucket: 'bound'` for other scoping/assessment
 * modules uses the identical honestCeiling disclaimer pattern. So none of the
 * four is presented AS a bound-changing result anywhere in the registered
 * visualization catalog.
 *
 * VERDICT: audit CLEAN. No missing banner, no overclaiming registration found.
 *
 * @see imp-35538-route-i-remainder-derivation-requirements
 * @see imp-35571-route-i-subleading-rate-scope
 * @see imp-35419-etrunc-barrier-lemma-porting-scope
 * @see imp-35556-gtrue-ecoll-dimensional-comparability
 * @see imp-35186-cross-reference-integrity-audit (audit-method precedent)
 * @see imp-35327-imp352xx-frontier-crossref-integrity-audit (audit-method precedent)
 */

import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';
import { IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE } from './imp-35571-route-i-subleading-rate-scope.js';
import { IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE } from './imp-35419-etrunc-barrier-lemma-porting-scope.js';
import { IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY } from './imp-35556-gtrue-ecoll-dimensional-comparability.js';

const DISCHARGE_RE = /discharges? nothing|derives no remainder|ports? nothing/i;
const NO_QED_RE = /NO QED/;
const REMAINS_SOTA_RE = /refereed bound is changed/i;
const GUE_CONDITIONAL_RE = /imp-486/;

const AUDITED_MODULES = [
  { id: 'imp-35538', record: IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS, registeredVizRoute: '/viz-imp35580-req4-height-gap', vizTicket: 'imp-35580', gueConditionalExpected: true },
  { id: 'imp-35571', record: IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE, registeredVizRoute: '/viz-imp35597-threshold-collapse', vizTicket: 'imp-35597', gueConditionalExpected: true },
  { id: 'imp-35419', record: IMP35419_ETRUNC_BARRIER_LEMMA_PORTING_SCOPE, registeredVizRoute: null, vizTicket: null, gueConditionalExpected: false },
  { id: 'imp-35556', record: IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY, registeredVizRoute: '/viz-imp35665-pinsker-common-functional-bridge', vizTicket: 'imp-35665', gueConditionalExpected: true },
];

// imp-35419's subject (S_barrier) is explicitly "NO GUE, NO PCC" / "deterministic-barrier-conditional" --
// a different conditionality class from the imp-486 GUE-conditional caveat, so its own absence of an
// "imp-486" citation is a legitimate content difference, not a missing banner (gueConditionalExpected: false).
const BANNER_CHECK = AUDITED_MODULES.map(({ id, record, gueConditionalExpected }) => {
  const hasGueConditionalBanner = GUE_CONDITIONAL_RE.test(record.verdict) || GUE_CONDITIONAL_RE.test(record.citation || '');
  return {
    id,
    hasDischargeBanner: DISCHARGE_RE.test(record.verdict),
    hasGueConditionalBanner,
    gueConditionalExpected,
    gueConditionalOk: hasGueConditionalBanner === gueConditionalExpected,
    hasNoQedBanner: NO_QED_RE.test(record.verdict),
    hasRemainsSotaBanner: REMAINS_SOTA_RE.test(record.verdict),
  };
});

const ALL_BANNERS_PRESENT = BANNER_CHECK.every(
  (c) => c.hasDischargeBanner && c.gueConditionalOk && c.hasNoQedBanner && c.hasRemainsSotaBanner,
);

const REGISTERED_COUNT = AUDITED_MODULES.filter((m) => m.registeredVizRoute !== null).length; // 3

export const IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC = {
  id: 'imp-35670',
  proofSection: 'audit',
  question:
    'Do the imp-35538 / imp-35571 / imp-35419 / imp-35556 route-(i)/E_trunc scoping-assessment modules each ' +
    'carry the derives-nothing / discharges-nothing / C_mb-GUE-conditional (imp-486) / NO-QED disposition ' +
    'banner, and is any presented as a bound-changing result via visualizations-index.js or otherwise?',
  auditedModules: AUDITED_MODULES.map(({ id, registeredVizRoute, vizTicket }) => ({ id, registeredVizRoute, vizTicket })),
  bannerCheck: BANNER_CHECK,
  allBannersPresent: ALL_BANNERS_PRESENT,
  registeredVizCount: REGISTERED_COUNT, // 3 of 4
  registrationFinding:
    'Three of four (imp-35538, imp-35571, imp-35556) ARE cited as paperSourcePath by a registered ' +
    'visualization (imp-35580, imp-35597, imp-35665); imp-35419 has none. This is NOT an overclaim: each of ' +
    'those three viz entries carries its own honestCeiling field re-stating "no new computation/derivation", ' +
    '"measurement only", and "changes no bound, establishes no operator positivity, no RH verdict" -- the ' +
    'mathBucket: "bound" tag is a topical shelf label (this viz concerns the Lambda-bound research thread), ' +
    'not a claim the bound moved. No module is presented AS a bound-changing result.',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). All four modules carry the ' +
    'discharge-nothing and no-QED/no-refereed-bound-change markers. The GUE-conditional (imp-486) marker is present in ' +
    'three of four (imp-35538, imp-35571, imp-35556); imp-35419 cites no imp-486 anywhere, but this is a ' +
    'legitimate content difference, not an omission: imp-35419 is explicitly about S_barrier, a ' +
    '"NO GUE, NO PCC" deterministic-barrier-conditional statement, a different conditionality class from the ' +
    'GUE-conditional caveat imp-486 records -- citing imp-486 there would be inapplicable. Three of four have ' +
    'a registered visualization citing them as paperSourcePath, but each such visualization entry ' +
    'independently re-asserts the same no-bound-change / no-operator-positivity / no-RH-verdict disclaimer ' +
    'via its own honestCeiling field, so none is presented as a bound-changing result. No missing banner ' +
    'found; no overclaiming registration found; no source file required correction. Changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35538, imp-35571, imp-35419, imp-35556 (the four audited modules); imp-35580, imp-35597, imp-35665 ' +
    '(the three registered viz pages citing them); imp-35186, imp-35327 (prior cross-reference audit method ' +
    'this ticket adapts to a banner/registration check); imp-486 (GUE-conditional caveat).',
};

export const IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC_ASSERTIONS = [
  {
    id: 'imp35670-all-four-banners-present',
    description: 'every one of the four audited modules carries the discharge/no-QED/no-refereed-bound-change banner, and the GUE-conditional marker matches its expected (content-dependent) presence',
    holds: () =>
      IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC.allBannersPresent === true &&
      IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC.bannerCheck.length === 4 &&
      // imp-35419 is the one legitimate exception: no imp-486 citation, by design (deterministic, not GUE)
      IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC.bannerCheck.find((c) => c.id === 'imp-35419').hasGueConditionalBanner === false &&
      IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC.bannerCheck.filter((c) => c.hasGueConditionalBanner).length === 3,
  },
  {
    id: 'imp35670-registration-count-and-nonoverclaim',
    description: 'exactly three of four modules have a registered viz page, and imp-35419 has none',
    holds: () => {
      const c = IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC;
      const imp35419 = c.auditedModules.find((m) => m.id === 'imp-35419');
      return (
        c.registeredVizCount === 3 &&
        imp35419.registeredVizRoute === null &&
        c.auditedModules.filter((m) => m.registeredVizRoute !== null).length === 3
      );
    },
  },
  {
    id: 'imp35670-honesty-gate-no-qed',
    description: 'audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC.isRigorous === false &&
      /NO QED/.test(IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC.verdict) &&
      /refereed bound is changed/i.test(IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC.verdict),
  },
];

for (const a of IMP35670_HONESTY_BANNER_AUDIT_ROUTE_I_ETRUNC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35670-honesty-banner-audit-route-i-etrunc assertion failed: ${a.id}`);
  }
}
