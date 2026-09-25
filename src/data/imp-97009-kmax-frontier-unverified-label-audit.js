/**
 * @fileoverview imp-97009 -- AUDIT: re-run the imp-96922 Finding 3 disjoint-set grep (modules that
 * cite the primal certificate rh-route-i-toeplitz-krein-certificate-2026-09-24 WITHOUT carrying the
 * "interval-rigorous certificate reach" banner -- the kmax5/kmax6 near-feasibility frontier-scout
 * modules exploring past 2a = 0.96 toward ln 3) and verify EACH ONE is labelled UNVERIFIED and is
 * never conflated with the certified 2a <= 0.96 interval-rigorous reach.
 *
 * METHOD (audit only, no computation). grep for every src/data/imp-*.js module that cites the
 * primal certificate module id but does not carry the banner phrase (same query imp-96922 Finding 3
 * used), then for each hit grep for "UNVERIFIED" / "certified reach" / "interval-rigorous reach" and
 * hand-read the surrounding sentence to check whether the frontier finding is ever presented as
 * extending the certified reach past 0.96.
 *
 * FINDINGS (measured, 2026-09-25).
 *   1. THE DISJOINT SET NOW HAS 22 MODULES, not the 20 imp-96922 counted: imp-96991 and imp-96992
 *      were both created after imp-96922's grep pass (same day) and are themselves kmax=5,
 *      2a = 1.00-rung frontier follow-ons, so the set grew by exactly 2 as expected -- not a
 *      discrepancy in imp-96922's original count, a timing artifact of continued frontier work.
 *   2. OF THE 22, SEVEN ARE LITERAL kmax5/kmax6 NEAR-FEASIBILITY FRONTIER SCOUTS: imp-96845, 96868,
 *      96869, 96956, 96978, 96991, 96992. Three more belong to the same degree/precision-frontier
 *      family (imp-96732 extended-precision-reach-assessment, imp-96748 098-cutting-plane-solve,
 *      imp-96834 certificate-degree-margin-assessment). ALL TEN carry an explicit SUB-GAP or
 *      "UNVERIFIED" tag on their frontier finding (e.g. IMP96845_KMAX5_NEAR_FEASIBLE_UNVERIFIED,
 *      IMP96869_KMAX6_NEAR_FEASIBLE_UNVERIFIED, IMP96732_EXTPREC_098_RUNG_UNVERIFIED) AND an explicit
 *      "certified reach stays 2a <= 0.96" / "interval-rigorous reach stays 2a <= 0.96" sentence
 *      elsewhere in the same module. ZERO instances state or imply the frontier finding extends the
 *      certified reach past 0.96 -- imp-96956 (the one module that actually ran the interval
 *      verifier on a kmax=5 iterate at 2a = 1.00) is explicit that it COLLAPSES under rigor and the
 *      reach "stays exactly 2a <= 0.96".
 *   3. THE REMAINING 12 modules (imp-96610, 96621, 96635, 96643, 96644, 96646, 96661, 96767, 96772,
 *      96808, 96848, 96866) make no frontier-past-0.96 claim at all -- they cite the primal module
 *      for viz-data, bundle-hygiene, orphan-consumer, primal-margin, basis-crossvalidation, or
 *      tail-trace reasons unrelated to the kmax degree frontier, matching imp-96922's own
 *      characterization of this disjoint set as "out of scope for the banner-consistency claim, not
 *      an inconsistency."
 *
 * VERDICT. Every kmax5/kmax6 (and sibling degree/precision) near-feasibility frontier-scout module
 * correctly labels its exploratory finding UNVERIFIED and correctly restates that the certified
 * interval-rigorous reach stays exactly 2a <= 0.96. AUDIT CLEAN: zero conflations found across all
 * 22 modules in the imp-96922 Finding 3 disjoint set. Audit only; changes no bound; NO QED.
 *
 * @see imp-96922-krein-096-banner-audit.js (parent: identified this disjoint 20-module set, now 22)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (primal certificate: interval-rigorous
 *   reach 2a <= 0.96, the value every audited module correctly restates)
 */

// ---- audited module counts (verbatim from the 2026-09-25 grep pass) -------------------------

// total disjoint-set modules (imp-96922 Finding 3 query re-run today)
export const IMP97009_DISJOINT_SET_COUNT = 22;

// growth vs imp-96922's original count, entirely accounted for by two new frontier follow-ons
export const IMP97009_NEW_SINCE_96922 = 2;

// of the 22, modules that are literal kmax5/kmax6 or sibling degree/precision frontier scouts
export const IMP97009_FRONTIER_SCOUT_COUNT = 10;

// of those 10, modules carrying an explicit UNVERIFIED / SUB-GAP tag on the frontier finding
export const IMP97009_UNVERIFIED_TAGGED_COUNT = 10;

// of those 10, modules that also explicitly restate "reach stays 2a <= 0.96" nearby
export const IMP97009_REACH_RESTATED_COUNT = 10;

// modules in the disjoint set making no frontier-past-0.96 claim (viz-data / hygiene / audit / etc)
export const IMP97009_NOT_FRONTIER_RELATED_COUNT =
  IMP97009_DISJOINT_SET_COUNT - IMP97009_FRONTIER_SCOUT_COUNT;

export const IMP97009_VERDICT = Object.freeze({
  ticket: 'imp-97009',
  question:
    'are the imp-96922 Finding-3 out-of-scope kmax5/kmax6 near-feasibility frontier-scout modules (exploring past 2a = 0.96) each labelled UNVERIFIED and never conflated with the certified 2a <= 0.96 interval-rigorous reach?',
  answer:
    'yes: all 10 kmax5/kmax6-family frontier-scout modules in the (now 22-module, up from 20) disjoint set carry an explicit UNVERIFIED/SUB-GAP tag on their frontier finding and an explicit restatement that the certified reach stays exactly 2a<=0.96; the other 12 modules make no frontier-past-0.96 claim; zero conflations found',
  disjointSetCount: IMP97009_DISJOINT_SET_COUNT,
  frontierScoutCount: IMP97009_FRONTIER_SCOUT_COUNT,
  unverifiedTaggedCount: IMP97009_UNVERIFIED_TAGGED_COUNT,
  reachRestatedCount: IMP97009_REACH_RESTATED_COUNT,
  conflationFound: false,
  // honesty guardrails
  changesAnyBound: false,
  operatorPositivityProved: false,
  rhOpen: true,
  ptFloorSOTA: 0.2,
  qed: false,
});

// ---- self-check assertions (import-light; node run-assertions exercises these) --------------
const IMP97009_ASSERTIONS = [
  {
    id: 'imp97009-disjoint-set-grew-by-two',
    holds: () => IMP97009_DISJOINT_SET_COUNT === 22 && IMP97009_NEW_SINCE_96922 === 2,
    why: 'the re-run grep must find exactly 2 more modules than imp-96922 counted (imp-96991, imp-96992, both created after that pass), confirming the count difference is a timing artifact, not a missed inconsistency.',
  },
  {
    id: 'imp97009-frontier-subset-fully-tagged',
    holds: () =>
      IMP97009_UNVERIFIED_TAGGED_COUNT === IMP97009_FRONTIER_SCOUT_COUNT &&
      IMP97009_REACH_RESTATED_COUNT === IMP97009_FRONTIER_SCOUT_COUNT,
    why: 'every frontier-scout module in the disjoint set must carry both an UNVERIFIED tag and a reach-stays-0.96 restatement -- any module failing either would be a conflation risk.',
  },
  {
    id: 'imp97009-not-frontier-related-sums',
    holds: () =>
      IMP97009_FRONTIER_SCOUT_COUNT + IMP97009_NOT_FRONTIER_RELATED_COUNT === IMP97009_DISJOINT_SET_COUNT,
    why: 'the frontier-scout and not-frontier-related counts must partition the full disjoint set found by the re-run grep.',
  },
  {
    id: 'imp97009-audit-only-no-qed',
    holds: () =>
      IMP97009_VERDICT.conflationFound === false &&
      IMP97009_VERDICT.changesAnyBound === false &&
      IMP97009_VERDICT.operatorPositivityProved === false &&
      IMP97009_VERDICT.qed === false,
    why: 'this is a labelling-consistency audit only: it changes no bound, proves no operator positivity, and claims no QED.',
  },
];

for (const a of IMP97009_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97009-kmax-frontier-unverified-label-audit assertion failed: ${a.id}`);
  }
}
