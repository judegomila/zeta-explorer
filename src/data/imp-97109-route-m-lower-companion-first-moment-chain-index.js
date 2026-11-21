/**
 * @module imp-97109-route-m-lower-companion-first-moment-chain-index
 * @fileoverview imp-97109 -- META cross-reference index note grouping the Route M interior
 *   second-moment lower-companion chain (imp-96750 -> imp-97054 -> imp-97071): the mean-square-to
 *   -first-moment reduction lineage, mirroring the imp-96987/imp-97092 cohort-index pattern.
 *   Read individually, a scout may re-attack imp-96750's original (UPPER, second-moment) question,
 *   or imp-97054's mean-SQUARE lower companion, and miss that imp-97071 already reduced the live
 *   residual down to a single positive first-MOMENT mean-value constant kappa > 0 (measured
 *   ~0.696, not proved). Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE CHAIN (chronological order = logical order; each step narrows what remains open).
 *     imp-96750 -- asks for a one-sided UPPER asymptotic Int(N) <= s* log N (would raise the
 *       rigorous lower conditioning ceiling toward F=3.775e7). REDUCES it, rigorously, to a single
 *       uniform lemma Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 <= s0* b + O(1). Proves the
 *       obvious term-splitting route (arithmetic part squared alone) OVERSHOOTS to M log^2 M
 *       (measured 2801 vs true 17.2 at M=1200) -- ruled out. s0* itself NOT established
 *       (oneSidedBoundProved=false); s0 ~ 1.75 is measured only.
 *     imp-97054 -- CORRECTS the premise that later tickets (imp-97016/imp-97033) mislabelled
 *       imp-96750 "PROVEN", and asks the sharper question: does REJECTING the fitted concave-quad
 *       ||G||_F turnover need the UPPER half (imp-96750) or the LOWER half? DIRECTION ANALYSIS
 *       shows the LOWER companion Q(b) >= s0_lo b - O(1) (s0_lo > 0, ANY positive constant) is the
 *       operative rejector -- and it transfers rung-free through the already two-sided imp-96708
 *       H2 sandwich. So the target narrows from imp-96750's exact-slope upper question to a
 *       weaker existence question on the LOWER side; still posed as a mean-SQUARE lower bound,
 *       still unestablished.
 *     imp-97071 -- narrows again: a RIGOROUS Cauchy-Schwarz step (Q(b) >= F(b)^2/S(b), exact, no
 *       hypothesis) reduces the imp-97054 mean-SQUARE lower companion to a strictly WEAKER
 *       first-MOMENT mean-value bound F(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b) >= kappa phi(b) b,
 *       kappa > 0. Crucially the imp-96750 term-split overshoot is a SQUARING artifact that does
 *       NOT recur here: both the arithmetic part (~+0.575 phi(b) b) and the cotangent part
 *       (~+0.121 phi(b) b) of F(b) are measured separately positive, kappa ~ 0.696 stable across
 *       primes and primorials. Transfers to Int(N) >= (36 kappa^2/pi^2) log N ~ 1.767 log N,
 *       comfortably below the true slope 3.495. kappa > 0 remains MEASURED, not proved.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-96750 poses an UPPER second-moment
 *   question, imp-97054 poses a LOWER second-moment question, and imp-97071 poses a first-MOMENT
 *   mean-value question -- three different-looking targets that a future scout might treat as
 *   three independent open problems, or worse, re-attack imp-96750's original upper asymptotic
 *   thinking it still blocks the turnover rejection. Read together, the chain is ONE narrowing
 *   sequence: imp-97054 shows the LOWER half (not imp-96750's upper half) is what the turnover
 *   rejection actually needs, and imp-97071 shows that lower need reduces further to a strictly
 *   weaker first-MOMENT constant kappa > 0, free of the term-splitting squaring artifact that
 *   obstructed imp-96750. This index bakes that reading verbatim so future work targets the
 *   SINGLE live residual -- a Bettin-Conrey cotangent MEAN VALUE lower bound kappa > 0 -- rather
 *   than re-attempting the harder mean-square upper or lower asymptotics already superseded.
 *
 *   WHAT STAYS OPEN. The first-moment constant kappa > 0 (measured ~0.696, both parts positive
 *   and of clean order phi(b) b) is not proved; the arithmetic part (~0.575) is elementary but the
 *   cotangent part (~0.121) is an unproved Bettin-Conrey cotangent mean-value estimate. No bound
 *   is claimed moved anywhere in the chain; T ~ 2.594e7 stays the anchor; compute N~9916 binds
 *   first (imp-96750/imp-97071 conclusions).
 *
 *   STATUS: a grouping/index note over three already-committed modules, not a new derivation.
 *   No bound changes; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (poses + reduces the UPPER question; term-split overshoot proved)
 * @see imp-97054-route-m-two-sided-norm-rejection-assessment.js (premise correction + direction analysis: LOWER half is operative)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (Cauchy-Schwarz reduction to the first-moment kappa > 0 residual)
 * @see imp-97092-polefree-to-weil-obstruction-cohort-index.js (sibling cohort-index this mirrors)
 *
 * Ticket: imp-97109 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const LOWER_COMPANION_FIRST_MOMENT_CHAIN = Object.freeze([
  Object.freeze({
    id: 'imp-96750',
    role: 'poses + reduces the UPPER (mean-square) asymptotic; proves term-splitting overshoots',
    result:
      'Reduces Int(N) <= s* log N rigorously to one uniform lemma Q(b) <= s0* b + O(1). Proves ' +
      'the arithmetic-only term-splitting route OVERSHOOTS to M log^2 M (measured 2801 vs true ' +
      '17.2 at M=1200) -- ruled out. s0* itself NOT established (oneSidedBoundProved=false); ' +
      's0 ~ 1.75 measured only.',
  }),
  Object.freeze({
    id: 'imp-97054',
    role: 'corrects the premise + direction analysis: the LOWER half, not the upper, rejects the turnover',
    result:
      'Corrects imp-97016/imp-97033 mislabelling imp-96750 "PROVEN". Shows REJECTING the fitted ' +
      'concave-quad ||G||_F turnover needs only the LOWER companion Q(b) >= s0_lo b - O(1) ' +
      '(s0_lo > 0, any positive constant), which transfers rung-free via the two-sided imp-96708 ' +
      'H2 sandwich. Narrows the target from an exact-slope upper question to a weaker existence ' +
      'question on the lower side; lower companion still unestablished at this step.',
  }),
  Object.freeze({
    id: 'imp-97071',
    role: 'Cauchy-Schwarz reduction: mean-SQUARE lower companion <== first-MOMENT mean-value bound',
    result:
      'EXACT Cauchy-Schwarz inequality Q(b) >= F(b)^2/S(b) reduces the imp-97054 mean-SQUARE ' +
      'lower companion to a strictly weaker first-MOMENT bound F(b) >= kappa phi(b) b, kappa > 0. ' +
      'Both the arithmetic (~+0.575 phi(b) b) and cotangent (~+0.121 phi(b) b) parts of F(b) are ' +
      'measured separately positive (kappa ~ 0.696 stable across primes and primorials) -- no ' +
      'recurrence of the imp-96750 squaring overshoot. Transfers to Int(N) >= (36 kappa^2/pi^2) ' +
      'log N ~ 1.767 log N. kappa > 0 remains MEASURED, not proved.',
  }),
]);

export const IMP97109_LOWER_COMPANION_FIRST_MOMENT_CHAIN_INDEX = Object.freeze({
  id: 'imp-97109',
  proofSection: 'S-frontier',
  chain: LOWER_COMPANION_FIRST_MOMENT_CHAIN,
  targetNarrowedTo:
    'a Bettin-Conrey cotangent MEAN VALUE lower bound kappa > 0 in F(b) = ' +
    'Sum_{a=2,(a,b)=1}^{b-1} I(a,b) >= kappa phi(b) b (measured kappa ~ 0.696, not proved) -- ' +
    'strictly weaker than either the imp-96750 upper mean-square or the imp-97054 lower ' +
    'mean-square questions it supersedes.',
  measuredKappa: 0.696,
  transferSlopeValue: (36 * 0.696 * 0.696) / (Math.PI * Math.PI), // ~1.767
  trueInteriorSlope: 3.495176,
  anyBoundMoved: false,
  question:
    'The Route M interior second-moment lower-companion chain (imp-96750, imp-97054, imp-97071) ' +
    'reads as three separate second/first-moment questions across three tickets. Grouped, which ' +
    'one is the live residual a future scout should actually attack?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The three tickets form ONE narrowing sequence, not ' +
    'three independent problems: imp-96750 poses and reduces an UPPER mean-square question (ruling ' +
    'out term-splitting by proving it overshoots); imp-97054 shows the turnover rejection actually ' +
    'needs only the LOWER mean-square companion, narrowing the target; imp-97071 reduces that ' +
    'lower need further, via an EXACT Cauchy-Schwarz step, to a strictly weaker first-MOMENT ' +
    'mean-value constant kappa > 0, free of the squaring artifact that obstructed imp-96750. The ' +
    'single live residual is therefore the imp-97071 first-moment kappa > 0 (Bettin-Conrey ' +
    'cotangent mean value, measured ~0.696, not proved) -- future work on this thread should target ' +
    'THAT, not re-attempt imp-96750s original upper asymptotic or imp-97054s mean-square lower ' +
    'companion, both already superseded by the weaker reduction. No bound moved; T ~ 2.594e7 stays ' +
    'the anchor; compute N~9916 binds first; no refereed bound is changed; RH open; NO QED.',
  citation:
    'imp-96750 (upper reduction + term-split overshoot proof); imp-97054 (premise correction + ' +
    'direction analysis, lower half operative); imp-97071 (Cauchy-Schwarz reduction to the ' +
    'first-moment kappa > 0 residual); imp-97092-polefree-to-weil-obstruction-cohort-index.js ' +
    '(sibling cohort-index this mirrors).',
});

export default IMP97109_LOWER_COMPANION_FIRST_MOMENT_CHAIN_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97109_LOWER_COMPANION_FIRST_MOMENT_CHAIN_INDEX_ASSERTIONS = [
  {
    id: 'imp97109-chain-has-all-three-members-in-order',
    why: 'The whole point of the index is grouping exactly these three modules in their narrowing ' +
      'order; a missing or reordered member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97109_LOWER_COMPANION_FIRST_MOMENT_CHAIN_INDEX.chain.map((c) => c.id);
      return (
        ids.length === 3 &&
        ids[0] === 'imp-96750' &&
        ids[1] === 'imp-97054' &&
        ids[2] === 'imp-97071'
      );
    },
  },
  {
    id: 'imp97109-transfer-slope-consistent-and-below-truth',
    why: 'The index cites the imp-97071 transfer slope; it must reproduce the same measured kappa ' +
      'and stay strictly below the true interior slope, matching the committed literals.',
    holds: () => {
      const idx = IMP97109_LOWER_COMPANION_FIRST_MOMENT_CHAIN_INDEX;
      const expected = (36 * idx.measuredKappa * idx.measuredKappa) / (Math.PI * Math.PI);
      return (
        Math.abs(idx.transferSlopeValue - expected) < 1e-12 &&
        idx.transferSlopeValue > 0 &&
        idx.transferSlopeValue < idx.trueInteriorSlope
      );
    },
  },
  {
    id: 'imp97109-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97109_LOWER_COMPANION_FIRST_MOMENT_CHAIN_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97109_LOWER_COMPANION_FIRST_MOMENT_CHAIN_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97109_LOWER_COMPANION_FIRST_MOMENT_CHAIN_INDEX.verdict),
  },
];

for (const assertion of IMP97109_LOWER_COMPANION_FIRST_MOMENT_CHAIN_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97109-route-m-lower-companion-first-moment-chain-index assertion failed: ${assertion.id}`,
    );
  }
}
