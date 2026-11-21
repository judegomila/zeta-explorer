/**
 * @module imp-96097-route-i-vanishing-moment-corner-reading-path
 * @fileoverview imp-96097 -- import-light Concepts reading-path note making the SUBSPACE-VS-CORNER
 *   distinction for the Route I two-vanishing-moment lever: rh-route-i-pencil-highres-map (measured
 *   margin ladder m(k) = 1 - mu_max(a; k)) and imp-96063 (the certificate assessment) together show
 *   that two vanishing moments hhat(0) = hhat'(0) = 0 buy a large uniform margin m(2) >= 0.539 on
 *   [0.30, (ln 3)/2] -- but ONLY on the constrained subspace V_k of pole-free h with k vanishing
 *   moments. The deleted k-dimensional "low-moment corner" C_k (spanned by the pole-free generators
 *   exp(-u/2), exp(u/2) and u^0, ..., u^{k-2}) carries the FULL unconstrained hardness m(0) = 2.8e-3
 *   at (ln 3)/2, shrinking to 0 as 2a -> ln 3, and this residual is provably NOT reducible by adding
 *   more moments: extra constraints relocate the corner, they do not shrink its positivity content.
 *   Reading-path note only, baked verbatim (no re-import), matching the imp-96104 headword pattern.
 *
 *   THE READING PATH
 *   -----------------------------------------------
 *   1. The margin ladder (rh-route-i-pencil-highres-map, imp-96063 section 1). At a = (ln 3)/2,
 *      N = 96, the pole-free space split by k vanishing moments int u^j h(u) du = 0 (j < k) gives
 *        m(0) = 0.00284,  m(1) = 0.06845,  m(2) = 0.53950,  m(3) = 0.77201, ...
 *      One large jump (k = 1 -> 2), then diminishing parity-gated steps as the extremal is pushed
 *      outward through the p = 2 resonance windows I_1 -> I_2 -> ... (imp-96063 section 2).
 *   2. The subspace-corner split (imp-96063 section 3). Any pole-free h = h_perp + h_par splits
 *      into h_perp in V_k (k vanishing moments) and h_par in the k-dimensional corner C_k. Then
 *        W_S(h) = W_S(h_perp) + 2 Re W_S(h_perp, h_par) + W_S(h_par).
 *      The high-res map certifies a large margin on the FIRST term only: W_S(h_perp) >= 0.539
 *      L_S(h_perp) for k = 2, uniformly on a in [0.30, (ln 3)/2]. It says nothing about the other
 *      two terms.
 *   3. Why more moments do not help (imp-96063 section 3, point A). The k = 0 extremal is even
 *      with hhat(0) != 0 -- precisely a C_k direction, so the WHOLE unconstrained residual m(0) =
 *      2.8e-3 already lives on the corner, not on V_k. Adding a moment REMOVES a direction from
 *      V_k (shrinking the subspace the margin has to cover) -- it does not touch W_S restricted
 *      to C_k, and the corner check that must eventually be closed always reproduces the same
 *      2.8e-3 (-> 0 as 2a -> ln 3), never the comfortable 0.539. The cross term 2 Re W_S(h_perp,
 *      h_par) is additionally sign-indefinite and uncontrolled by m(k) alone.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A reading-path lookup naming the subspace-vs-corner distinction for a reader landing on the
 *   Route I moment-lever thread cold. Establishes nothing new, moves no bound, closes no sub-gap:
 *   imp-96063-corner (the k-dimensional corner positivity + cross-term bound) remains open and is
 *   named as the residual that any moment-based certificate must still close separately. RH open;
 *   NO QED; no refereed bound is changed.
 *
 * @see rh-route-i-pencil-highres-map-2026-09-23 (source: measured margin ladder m(k), N = 64/96/128)
 * @see imp-96063-route-i-constraint-count-margin-certificate-assessment (subspace/corner/cross-term split, imp-96063-corner)
 *
 * Ticket: imp-96097 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The subspace-vs-corner reading path, baked verbatim (no re-import of imp-96063).
const ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH = Object.freeze({
  key: 'route-i-vanishing-moment-corner-reading-path',
  term:
    'Two-vanishing-moment margin lever m(2) >= 0.539 (rh-route-i-pencil-highres-map) -> ' +
    'subspace-vs-corner split (imp-96063) -> why more moments do not touch the corner',
  sources:
    'rh-route-i-pencil-highres-map-2026-09-23.js (measured margin ladder m(k) = 1 - mu_max(a; k), ' +
    'N = 64/96/128 Legendre-Galerkin); imp-96063-route-i-constraint-count-margin-certificate-' +
    'assessment.js (subspace/corner/cross-term decomposition and certificate verdict).',
  definition:
    'On the pole-free subspace V_k of h in L^2(-a, a) with k vanishing moments int u^j h(u) du = 0 ' +
    '(j < k, i.e. hhat vanishing to order k at t = 0), the normalized Weil-positivity margin ' +
    'm(k) = 1 - mu_max(a; k) = min_h W_S(h) / L_S(h) (W_S = Arch - P_2 = L_S - D_S) climbs sharply: ' +
    'm(0) = 0.00284, m(1) = 0.06845, m(2) = 0.53950, uniformly for a in [0.30, (ln 3)/2]. The ' +
    'deleted k-dimensional "low-moment corner" C_k (span of the pole-free generators exp(-u/2), ' +
    'exp(u/2) and u^0, ..., u^{k-2}) is NOT covered by this margin.',
  chain:
    'Step 1 (margin ladder): m(0) = 0.00284 -> m(1) = 0.06845 -> m(2) = 0.53950, a single large ' +
    'jump at k = 1 -> 2 then diminishing parity-gated steps as the extremal migrates outward through ' +
    'the p = 2 resonance windows I_1, I_2, ... . Step 2 (subspace-corner split): h = h_perp + h_par ' +
    '(h_perp in V_k, h_par in C_k) gives W_S(h) = W_S(h_perp) + 2 Re W_S(h_perp, h_par) + W_S(h_par); ' +
    'the 0.539 margin bounds only the first term. Step 3 (why moments do not help): the k = 0 ' +
    'extremal already sits ON C_k (hhat(0) != 0), so the corner alone carries the full m(0) = 2.8e-3 ' +
    'unconstrained residual; adding moments shrinks V_k, leaving W_S restricted to C_k untouched, and ' +
    'the cross term 2 Re W_S(h_perp, h_par) is sign-indefinite and uncontrolled by m(k).',
  consequence:
    'The two-vanishing-moment margin 0.539 is real but lives entirely on the constrained subspace; ' +
    'the finite-constraint lever relocates the hardness into a fixed k-dimensional corner (named ' +
    'imp-96063-corner) plus an uncontrolled cross term, it does not shrink it. A certificate for ' +
    'D_S <= L_S on the whole pole-free space must still close imp-96063-corner (residual 2.8e-3 at ' +
    '(ln 3)/2, shrinking to 0 as 2a -> ln 3) by a separate explicit few-parameter argument -- adding ' +
    'more moments provably cannot do this on its own.',
});

export const IMP96097_ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH = Object.freeze({
  id: 'imp-96097',
  proofSection: 'S-frontier',
  glosses: 'imp-96063',
  question:
    'rh-route-i-pencil-highres-map and imp-96063 together show two vanishing moments buy a uniform ' +
    'margin m(2) >= 0.539. Why does this not close the whole pole-free space, and what does the ' +
    'deleted low-moment corner carry, for a reader landing on the Route I moment-lever thread cold?',
  headword: ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH,
  anyBoundMoved: false,
  verdict:
    'READING-PATH NOTE ONLY (documentation, not a proof). Two vanishing moments give a uniform ' +
    'margin m(2) >= 0.539 on the constrained subspace V_k, a. in [0.30, (ln 3)/2] (rh-route-i-' +
    'pencil-highres-map), but the deleted k-dimensional low-moment corner C_k carries the FULL ' +
    'unconstrained hardness m(0) = 2.8e-3 (-> 0 as 2a -> ln 3, imp-96063) and this residual is ' +
    'provably not improved by adding moments: extra constraints shrink V_k, they do not act on ' +
    'W_S restricted to C_k. The corner-plus-cross-term residual (imp-96063-corner) remains the open ' +
    'sub-gap. Establishes nothing; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'rh-route-i-pencil-highres-map-2026-09-23 (margin ladder m(k), N = 64/96/128); imp-96063-route-' +
    'i-constraint-count-margin-certificate-assessment (subspace/corner/cross-term split, imp-96063-' +
    'corner sub-gap, unconstrainedMargin = 0.0028411, twoMomentUniformMargin = 0.539).',
});

export default IMP96097_ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96097_ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH_ASSERTIONS = [
  {
    id: 'imp96097-reading-path-names-margins-and-corner',
    why: 'The reading-path note must state the margin ladder values m(0), m(1), m(2), name the ' +
      'subspace-vs-corner split, and link to imp-96063 and rh-route-i-pencil-highres-map.',
    holds: () => {
      const h = IMP96097_ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH.headword;
      return (
        /0\.00284/.test(h.definition) &&
        /0\.06845/.test(h.definition) &&
        /0\.53950/.test(h.definition) &&
        /V_k/.test(h.chain) &&
        /C_k/.test(h.chain) &&
        /rh-route-i-pencil-highres-map/.test(h.sources) &&
        /imp-96063/.test(h.sources)
      );
    },
  },
  {
    id: 'imp96097-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, the ' +
      'imp-96063-corner sub-gap named as still open.',
    holds: () =>
      IMP96097_ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH.anyBoundMoved === false &&
      /NO QED/.test(IMP96097_ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH.verdict) &&
      /refereed bound is changed/i.test(IMP96097_ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH.verdict) &&
      /imp-96063-corner/.test(IMP96097_ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH.verdict),
  },
];

for (const assertion of IMP96097_ROUTE_I_VANISHING_MOMENT_CORNER_READING_PATH_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96097-route-i-vanishing-moment-corner-reading-path assertion failed: ${assertion.id}`,
    );
  }
}
