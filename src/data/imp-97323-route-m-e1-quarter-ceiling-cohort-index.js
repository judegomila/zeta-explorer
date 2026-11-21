/**
 * @module imp-97323-route-m-e1-quarter-ceiling-cohort-index
 * @fileoverview imp-97323 -- META cross-reference index note grouping the Route M E1 uniform
 *   b/4-ceiling cohort (the |E1(b)| <= b/4 ceiling sub-thread and its explicit-constant sibling) as
 *   ONE cohort, narrower than the imp-97305 nine-member arith first-moment remainder family (which
 *   already spans E0 closure, the E1 half, and the R(b) tail). Read individually, the five member
 *   leaves land at different statuses across different divisor classes (primes proved, semiprimes
 *   proved, omega>=3 open; the explicit constant one estimate short) and a future scout may miss
 *   that the ceiling is now settled on omega<=2 and not re-derive the close-prime-factor obstruction
 *   imp-97265 already found, or the leader+inward-correction mechanism imp-97290 already used to
 *   clear the semiprime class. Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (logical order). All five sharpen the SAME imp-97133/imp-97224 explicit remainder
 *   E1(b) = L1(b) - phi(b) b((1/2) log b - 1/4) for L1(b) = Sum_{a in R_b} a log a.
 *     imp-97208 -- derives the tighter ceiling |E1(b)| <= b/4 + 2^omega(b)(log b+2), the exact prime
 *       asymptotic E1(prime b) = -b/4 + (1/12)log b + ln A + O(1/b), and measures 0 violations of
 *       |E1(b)|<=b/4 over b in [2,20000].
 *     imp-97265 -- proof ATTEMPT on the b/4 ceiling: HONEST PARTIAL. Exact factorial-free
 *       per-divisor identity E1(b) = Sum_{d|b} mu(d) C_d; proves the prime ceiling with a strictly
 *       positive margin; but finds a NEW obstruction -- close-prime-factor semiprimes (b=p*q,
 *       q=nextprime(p)) ALSO saturate the ceiling toward 1 -- and rules out tail-peeling as a fix.
 *     imp-97290 -- lifts the proof past primes: derives the exact leader + inward-correction
 *       decomposition E1(b) = mu(b) b/4 + Delta(b), reduces the ceiling to a sign condition
 *       mu(b) Delta(b) <= 0 plus a magnitude condition |Delta(b)| <= b/2, and PROVES both on the
 *       ENTIRE semiprime class omega(b)=2 -- exactly the close-prime-factor family imp-97265 flagged.
 *       omega(b)>=3 stays open (retained-Moebius-cancellation residual).
 *     imp-97291 -- numerical MEASUREMENT over a 167x wider range than imp-97265: the worst composite
 *       ratio r(b)=|E1(b)|/(b/4) grows toward 1 with NO plateau (semiprimes bind, higher omega falls
 *       away), yet the ABSOLUTE margin b/4-|E1(b)| stays positive and grows like ~sqrt(b) on the
 *       binding close-prime-factor family even as the relative margin vanishes like b^{-1/2}.
 *     imp-97288 -- attacks the explicit E1 uniform CONSTANT (not the ceiling scale): HONEST PARTIAL.
 *       Derives the exact closed form CK(b) = (b/12) Qlog(b) - (b/4) Q0(b) + b logA (Q0(b)-mu(b)) +
 *       C_sum(b); three of four constituents get fully explicit uniform bounds; the fourth (Qlog)
 *       reduces to one named Mertens-product estimate (measured sup 0.475, Mertens limit e^-gamma
 *       = 0.56146 unproved as a uniform cap).
 *
 *   WHY GROUP THESE (not re-derive). Read individually, a scout may not notice that the b/4 ceiling
 *   is now PROVED on omega<=2 (primes by imp-97265, semiprimes by imp-97290) and OPEN only for
 *   omega>=3, or may re-attempt tail-peeling on the ceiling (already ruled out by imp-97265), or
 *   re-derive the leader+inward-correction split imp-97290 already isolated, or conflate the
 *   ceiling-scale question (settled up to omega=2) with the separate explicit-constant question
 *   (imp-97288, one Mertens-product estimate short). This index bakes that split so future work
 *   targets the two live residuals directly: the omega>=3 sign+magnitude condition on Delta(b), and
 *   the Qlog Mertens-product cap.
 *
 *   STATUS SPLIT (verbatim from the member leaves).
 *   - CEILING SCALE |E1(b)|<=b/4: PROVED on omega<=2 (primes: imp-97265; semiprimes: imp-97290);
 *     MEASURED with 0 violations to b~1e6 (imp-97208/imp-97291); OPEN for omega>=3.
 *   - CEILING HEADROOM: MEASURED -- relative margin 1-r(b) -> 0 like b^{-1/2} on the binding
 *     close-prime family, but the ABSOLUTE margin b/4-|E1(b)| grows like ~sqrt(b) (imp-97291).
 *   - EXPLICIT UNIFORM CONSTANT: HONEST PARTIAL, one Mertens-product estimate (Qlog <= C_Q) short
 *     of a fully explicit bound (imp-97288).
 *
 *   STATUS: a grouping/index note over five already-committed modules, not a new derivation. No
 *   bound changes: no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97208-route-m-theorem2-tighter-remainder.js (b/4 ceiling scale, exact prime asymptotic)
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (per-divisor identity, prime proof, semiprime obstruction)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (leader+inward-correction decomposition, semiprime-class proof)
 * @see imp-97291-route-m-e1-wide-composite-ratio-sweep.js (wide-range ratio sweep, absolute-margin growth)
 * @see imp-97288-route-m-e1-explicit-uniform-constant.js (explicit CK(b) constant, Qlog obstruction)
 * @see imp-97305-route-m-arith-first-moment-remainder-family-cohort-index.js (sibling: the broader nine-member E0/E1/tail cohort this narrows)
 *
 * Ticket: imp-97323 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const E1_QUARTER_CEILING_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97208',
    role: 'derives the b/4 ceiling scale and the exact prime asymptotic',
    status: 'MEASURED + PROVED-ON-PRIMES',
    result:
      '|E1(b)| <= b/4 + 2^omega(b)(log b+2); exact prime asymptotic E1(prime b) = -b/4 + ' +
      '(1/12)log b + ln A + O(1/b); 0 violations of |E1(b)|<=b/4 measured over b in [2,20000].',
  }),
  Object.freeze({
    id: 'imp-97265',
    role: 'proves the ceiling on primes; finds the semiprime obstruction',
    status: 'HONEST PARTIAL -- NOT CLOSED',
    result:
      'Exact factorial-free per-divisor identity E1(b) = Sum_{d|b} mu(d) C_d; proves the prime ' +
      'ceiling with a strictly positive margin; but close-prime-factor semiprimes (b=p*q, ' +
      'q=nextprime(p)) ALSO saturate the ceiling toward 1 -- not primes alone -- and tail-peeling ' +
      'is ruled out as a reduction.',
  }),
  Object.freeze({
    id: 'imp-97290',
    role: 'lifts the ceiling proof to the entire semiprime class',
    status: 'PROVED ON OMEGA=2 -- OMEGA>=3 OPEN',
    result:
      'Exact leader + inward-correction decomposition E1(b) = mu(b) b/4 + Delta(b); reduces the ' +
      'ceiling to a sign condition mu(b) Delta(b) <= 0 plus a magnitude condition |Delta(b)| <= ' +
      'b/2; PROVES both on the full semiprime class omega(b)=2 (distinct primes), the exact family ' +
      'imp-97265 flagged as binding. omega(b)>=3 stays open (retained-Moebius-cancellation residual).',
  }),
  Object.freeze({
    id: 'imp-97291',
    role: 'measures the ceiling headroom over a 167x wider range',
    status: 'MEASURED',
    result:
      'The worst composite ratio r(b)=|E1(b)|/(b/4) grows toward 1 with NO plateau (semiprimes ' +
      'bind, higher omega classes fall away sharply); the ABSOLUTE margin b/4-|E1(b)| stays ' +
      'strictly positive and grows like ~sqrt(b) on the binding close-prime-factor family even as ' +
      'the relative margin 1-r(b) vanishes like b^{-1/2}. FP-trustworthy window: b <~ 2.5e9.',
  }),
  Object.freeze({
    id: 'imp-97288',
    role: 'attacks the explicit E1 uniform constant (not the ceiling scale)',
    status: 'HONEST PARTIAL -- ONE CONSTITUENT SHORT',
    result:
      'Exact closed form CK(b) = (b/12) Qlog(b) - (b/4) Q0(b) + b logA (Q0(b)-mu(b)) + C_sum(b); ' +
      'three of four constituents given fully explicit uniform bounds; the fourth (Qlog) measured ' +
      'sup 0.475 (Mertens limit e^-gamma = 0.56146) but reduces to a single named Mertens-product ' +
      'estimate, not proved as a uniform cap.',
  }),
]);

export const IMP97323_E1_QUARTER_CEILING_COHORT_INDEX = Object.freeze({
  id: 'imp-97323',
  proofSection: 'S-frontier',
  cohort: E1_QUARTER_CEILING_COHORT,
  ceilingScaleStatus: 'PROVED on omega<=2 (imp-97265 primes, imp-97290 semiprimes); MEASURED 0 violations to b~1e6 (imp-97208/97291); OPEN for omega>=3.',
  ceilingHeadroomStatus: 'MEASURED (imp-97291): relative margin -> 0 like b^{-1/2} on the binding family, but the absolute margin grows like ~sqrt(b).',
  explicitConstantStatus: 'HONEST PARTIAL (imp-97288): one Mertens-product estimate (Qlog <= C_Q) short of a fully explicit uniform constant.',
  question:
    'The Route M E1 uniform-ceiling leaves (imp-97208/97265/97288/97290/97291) read as separate ' +
    'tickets landing at different statuses across different divisor classes. Grouped, which classes ' +
    'is the |E1(b)| <= b/4 ceiling actually proved on, and which residuals remain the live targets ' +
    'for a full closure?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The cohort splits cleanly: the ceiling SCALE ' +
    '|E1(b)| <= b/4 is now PROVED on omega(b)<=2 -- primes by imp-97265 (per-divisor identity, ' +
    'strictly positive margin) and the full semiprime class by imp-97290 (leader + ' +
    'inward-correction decomposition, mu(b) b/4 isolated exactly) -- and remains OPEN for ' +
    'omega(b)>=3, reduced to a sign-plus-magnitude condition on the Moebius-signed correction ' +
    'Delta(b). imp-97291 measures the headroom over a 167x wider range: the relative margin ' +
    'vanishes like b^{-1/2} on the binding close-prime family, but the absolute margin grows like ' +
    '~sqrt(b), so a full-class proof should target that growing absolute room rather than the ' +
    'vanishing relative one. Separately, the explicit UNIFORM CONSTANT (not just the b/4 scale) is ' +
    'one named Mertens-product estimate short (imp-97288, Qlog <= C_Q). Future work on this thread ' +
    'should treat primes and semiprimes as done, should not re-attempt tail-peeling (already ruled ' +
    'out by imp-97265) or re-derive the leader+inward-correction split (already isolated by ' +
    'imp-97290), and should target the two live residuals: the omega>=3 sign+magnitude condition ' +
    'and the Qlog Mertens-product cap. No bound on Lambda moves; establishes nothing new; RH open; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-97208 (ceiling scale, prime asymptotic); imp-97265 (per-divisor identity, prime proof, ' +
    'semiprime obstruction); imp-97290 (leader+inward-correction decomposition, semiprime-class ' +
    'proof); imp-97291 (wide-range ratio sweep, absolute-margin growth); imp-97288 (explicit ' +
    'constant, Qlog obstruction); imp-97305 (sibling: the broader nine-member E0/E1/tail cohort).',
});

export default IMP97323_E1_QUARTER_CEILING_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97323_E1_QUARTER_CEILING_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97323-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping exactly these five modules; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97323_E1_QUARTER_CEILING_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97208', 'imp-97265', 'imp-97290', 'imp-97291', 'imp-97288'].every((id) =>
        ids.includes(id),
      );
    },
  },
  {
    id: 'imp97323-status-fields-present-and-consistent',
    why: 'The index exists to separate the proved-on-omega<=2 ceiling from the still-open ' +
      'omega>=3 case and the separately-open explicit constant; each status field must be present ' +
      'and must not overclaim closure.',
    holds: () => {
      const idx = IMP97323_E1_QUARTER_CEILING_COHORT_INDEX;
      return (
        typeof idx.ceilingScaleStatus === 'string' &&
        /PROVED on omega<=2/.test(idx.ceilingScaleStatus) &&
        /OPEN for omega>=3/.test(idx.ceilingScaleStatus) &&
        typeof idx.ceilingHeadroomStatus === 'string' &&
        /MEASURED/.test(idx.ceilingHeadroomStatus) &&
        typeof idx.explicitConstantStatus === 'string' &&
        /HONEST PARTIAL/.test(idx.explicitConstantStatus)
      );
    },
  },
  {
    id: 'imp97323-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97323_E1_QUARTER_CEILING_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97323_E1_QUARTER_CEILING_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97323_E1_QUARTER_CEILING_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97323_E1_QUARTER_CEILING_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97323-route-m-e1-quarter-ceiling-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
