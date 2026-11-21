/**
 * @module imp-97493-route-m-curvature-crossover-cohort-index
 * @fileoverview imp-97493 -- META cross-reference index note grouping the Route M Vasyunin
 *   bulk-profile curvature-crossover cohort: imp-97437, imp-97441, imp-97459, imp-97460, imp-97464,
 *   imp-97472. Six leaves attacking the SAME question -- the O(x^2) curvature of the bulk profile
 *   f(x) beyond its linearized boundary layer f_lin(x), and how that curvature governs the
 *   boundary-to-bulk crossover fraction x*(eps) -- from derivation, tabulation, resonance
 *   explanation, analytic reduction, alternative fitting, and documentation angles. Index/meta
 *   only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE SHARED QUESTION. imp-97419 measured the crossover scale A(b) = x*(eps) b as LINEAR in b
 *   with a b-independent fraction x*(eps), but left the underlying O(x^2) curvature of the bulk
 *   profile f(x) = C(1+x) + (1/2)(1-x) log x - (pi/2) w(x) (imp-97329) underived. This cohort is
 *   every subsequent leaf that works that single open thread.
 *
 *   imp-97437 -- derives the analytic fixed-point formula x*(eps) = (eps/kappa)[(C+1/2) +
 *     (1/2)log(1/x*)] converting the measured x*(eps) into a function of tolerance alone (b-free),
 *     back-solves an effective curvature kappa_eff = 0.09951 from the two converged imp-97419
 *     crossovers (agreeing to 4.4%), and REPORTS THE OBSTRUCTION: the pure analytic O(x^2)
 *     coefficient is model-dependent (deg-2 poly c2=0.17713 vs log-model A=0.01390, an
 *     order-of-magnitude swing) and masked by the b-independent V(b,a) arithmetic wobble
 *     (window-unstable, rms floor ~ signal).
 *   imp-97441 -- completes the tolerance sweep imp-97437 needed: tabulates x*(eps) at
 *     eps in {0.5%,1%,2%,5%} across the b-ladder {1000..16000}, confirms b-independence to 3-4
 *     digits at 0.5%/2%/5%, and finds the 1% row BIMODAL (steps 0.199 -> 0.1665 at b=4000). Fitting
 *     the imp-97437 kappa_eff back against all four crossings shows it reproduces x*(eps) only in
 *     the MID band (~1%-2%; back-solved kappa 0.102-0.122) and fails at both ends (0.5%: 0.114,
 *     5%: 0.061) -- kappa_eff is NOT tolerance-uniform.
 *   imp-97459 -- explains the imp-97441 bimodal 1% row: the two crests straddling the 1% level are
 *     the 1/6 and 1/5 cotangent-sum arithmetic resonances. The 1/5 crest sits at a fixed 1.3934%
 *     (every ladder b divisible by 5) always above 1%; the 1/6 crest's sampled tip climbs
 *     0.9100% -> 1.0920% toward a 1.1130% continuum tip, crossing 1% between b=2000 and b=4000 --
 *     which is exactly the imp-97441 step point. Names the mechanism precisely, no new bound.
 *   imp-97460 -- takes the ANALYTIC route: reduces the curvature EXACTLY to r(x) = -(pi/2)[w(x) -
 *     w_lin(x)] (the elementary C(1+x) and (1/2)(1-x)log x parts contribute nothing beyond O(x)),
 *     then localizes the obstruction inside the cotangent-sum's endpoint (Riemann-Lebesgue)
 *     expansion: the smooth phi->0 endpoint's O(x^2) Laurent tail and the arithmetic phi->1
 *     frac(nxb)-wobble endpoint enter at the SAME order, so no finite-b truncation separates them
 *     without the exact Bettin-Conrey reciprocity resummation. SHARPENS imp-97437's verdict:
 *     wobble-averaging over dense a-windows shows the smooth curvature is |kappa_smooth| <~ 1e-2,
 *     an order of magnitude BELOW kappa_eff = 0.0995 -- so kappa_eff measures the ~4e-2 arithmetic
 *     wobble amplitude, not a smooth curvature coefficient at all.
 *   imp-97464 -- tests whether a richer two-term model r = c2 x^2 + c3 x^3 (named but never fit in
 *     imp-97437 R3a) rescues the imp-97441 mid-band-only failure. Finds the smooth signal is
 *     sub-wobble (signal/wobble ~0.03-0.05, confirming imp-97437/imp-97460's obstruction from a
 *     third angle), (c2,c3) swing wildly with sign flips across fit protocols
 *     (c2 in [-0.036, +0.177]), and the two-term model reproduces NONE of the four crossovers --
 *     doing WORSE than the one-term kappa_eff fixed point. Confirms extra parameters cannot rescue
 *     what is a wobble-masking problem, not a model-order problem.
 *   imp-97472 -- bakes the imp-97437 crossover formula and its honest scope limit as a Concepts
 *     glossary headword (documentation only, import-light, no re-derivation).
 *
 *   WHY GROUP THESE (not re-derive). Read separately, imp-97441's tabulation, imp-97459's
 *   resonance identification, imp-97460's analytic endpoint reduction, and imp-97464's two-term
 *   fit attempt could each look like an independent numerical exercise. Grouped, they are FIVE
 *   angles on the ONE obstruction imp-97437 first named: the smooth O(x^2) curvature of f(x) is
 *   masked by an O(x) arithmetic V(b,a) wobble of comparable size, and no finite-b compute --
 *   denser tabulation (imp-97441), resonance bookkeeping (imp-97459), an exact endpoint reduction
 *   (imp-97460), or a richer polynomial model (imp-97464) -- isolates it without the exact
 *   Bettin-Conrey reciprocity smooth/fluctuation split of V(b,a). This index bakes that convergent
 *   verdict so a future scout does not re-spend a ticket re-attempting a sixth numerical route to
 *   the same wobble wall.
 *
 *   WHAT STAYS OPEN (at the time of this cohort). The pure analytic O(x^2)/O(x^2 log x) curvature
 *   coefficient of the Route M bulk profile is UNPINNED: it is provably small (|kappa_smooth| <~
 *   1e-2, imp-97460) and Bettin-Conrey-reciprocity-locked, not merely under-fitted. Pinning it
 *   needs the exact reciprocity resummation of the cotangent-sum endpoints, unavailable at finite
 *   b -- a genuinely different (non-numerical) tool, not more compute. No bound on Lambda moves;
 *   no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97437-route-m-bulk-profile-curvature-crossover.js (analytic fixed point; kappa_eff=0.0995; names the model/wobble obstruction)
 * @see imp-97441-route-m-crossover-fraction-tolerance-table.js (four-tolerance x*(eps) table; b-independence; bimodal 1% row; kappa_eff mid-band-only)
 * @see imp-97459-route-m-bimodal-1pct-crossover-peaks.js (identifies the 1/6, 1/5 resonance crests that straddle the 1% level)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route.js (exact reduction to w(x); endpoint-level obstruction; kappa_eff shown to be a wobble amplitude)
 * @see imp-97464-route-m-twoterm-curvature-crossover-fit.js (two-term model fit fails worse than one-term; confirms sub-wobble signal from a third angle)
 * @see imp-97472-route-m-curvature-crossover-fixedpoint-glossary-headword.js (glossary headword documenting the imp-97437 formula)
 * @see imp-97419-route-m-uniform-profile-crossover-scale (upstream: measures x*(eps) linear-in-b crossover, leaves curvature underived)
 * @see imp-97329-route-m-uniform-crossover-second-moment (bulk profile f(x) = C(1+x)+(1/2)(1-x)log x-(pi/2)w(x))
 *
 * Ticket: imp-97493 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const ROUTE_M_CEILING = 0.25;

const CURVATURE_CROSSOVER_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97437',
    role: 'derives the analytic crossover fixed point; back-solves kappa_eff; names the obstruction',
    result:
      'Fixed point x*(eps) = (eps/kappa)[(C+1/2)+(1/2)log(1/x*)] validated against the two ' +
      'converged imp-97419 crossovers (kappa_eff = 0.09951, agree to 4.4%). The pure analytic O(x^2) ' +
      'coefficient is model-dependent (c2=0.17713 vs A=0.01390) and masked by the V(b,a) wobble.',
  }),
  Object.freeze({
    id: 'imp-97441',
    role: 'tabulates x*(eps) across four tolerances and a b-ladder; tests kappa_eff uniformity',
    result:
      'b-independence confirmed to 3-4 digits at eps=0.5%,2%,5%; the 1% row is BIMODAL (steps ' +
      '0.199 -> 0.1665 at b=4000). kappa_eff = 0.0995 reproduces x*(eps) only in the mid band ' +
      '(~1%-2%); back-solved kappa ranges 0.061 (5%) to 0.114 (0.5%) -- NOT tolerance-uniform.',
  }),
  Object.freeze({
    id: 'imp-97459',
    role: 'identifies the arithmetic resonances behind the imp-97441 bimodal 1% row',
    result:
      'The two crests straddling 1% are the 1/6 and 1/5 cotangent-sum resonances: the 1/5 crest is ' +
      'a fixed 1.3934% (always above 1%); the 1/6 crest climbs 0.9100% -> 1.0920% toward a 1.1130% ' +
      'tip, crossing 1% between b=2000 and b=4000, exactly reproducing the imp-97441 step point.',
  }),
  Object.freeze({
    id: 'imp-97460',
    role: 'analytic route: reduces the curvature exactly to w(x) and localizes the obstruction',
    result:
      'r(x) = -(pi/2)[w(x)-w_lin(x)] exactly; the smooth phi->0 endpoint and the arithmetic ' +
      'frac(nxb) phi->1 endpoint enter at the SAME O(x^2) order (Bettin-Conrey-reciprocity-locked). ' +
      'Wobble-averaging shows |kappa_smooth| <~ 1e-2, an order of magnitude below kappa_eff=0.0995 ' +
      '-- kappa_eff is a wobble AMPLITUDE, not a smooth curvature coefficient.',
  }),
  Object.freeze({
    id: 'imp-97464',
    role: 'fits a two-term curvature model to test whether extra parameters rescue x*(eps)',
    result:
      'Smooth signal is sub-wobble (signal/wobble ~0.03-0.05, third independent confirmation of the ' +
      'obstruction); (c2,c3) swing wildly with sign flips across fit protocols; the two-term model ' +
      'reproduces NONE of the four crossovers, doing WORSE than the one-term kappa_eff fixed point.',
  }),
  Object.freeze({
    id: 'imp-97472',
    role: 'Concepts glossary headword documenting the imp-97437 crossover formula (docs only)',
    result:
      'Bakes the fixed-point formula, kappa_eff=0.0995 validation, the b-independence explanation, ' +
      'and the honest model/wobble scope limit as a citable glossary headword. No re-derivation.',
  }),
]);

export const IMP97493_CURVATURE_CROSSOVER_COHORT_INDEX = Object.freeze({
  id: 'imp-97493',
  proofSection: 'S-frontier',
  cohort: CURVATURE_CROSSOVER_COHORT,
  routeMCeiling: ROUTE_M_CEILING,
  sharedObstruction:
    'The pure analytic O(x^2) curvature coefficient of the Route M bulk profile f(x) is masked by ' +
    'a same-order arithmetic V(b,a) wobble (imp-97437), confirmed to be Bettin-Conrey-reciprocity- ' +
    'locked at the endpoint level (imp-97460) and unrescued by denser tabulation (imp-97441), ' +
    'resonance bookkeeping (imp-97459), or a richer polynomial model (imp-97464).',
  question:
    'Read separately, do the tabulation (imp-97441), resonance identification (imp-97459), ' +
    'analytic endpoint reduction (imp-97460), and two-term fit (imp-97464) look like independent ' +
    'numerical exercises, or are they five convergent angles on the single wobble obstruction ' +
    'imp-97437 first named -- and does that convergence rule out any further finite-b numerical ' +
    'attempt at pinning the smooth curvature?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). Six leaves converge on one verdict: the Route M ' +
    'bulk-profile curvature crossover is analytically characterized (imp-97437 fixed point, ' +
    'imp-97460 exact w(x) reduction) and its effective parameter kappa_eff = 0.0995 is explained ' +
    'and cross-validated (imp-97441 tolerance table, imp-97459 resonance mechanism), but the ' +
    'PURE smooth analytic curvature coefficient stays unpinned -- provably sub-wobble ' +
    '(|kappa_smooth| <~ 1e-2, imp-97460) and confirmed unfittable by a richer model (imp-97464). ' +
    'No further finite-b numerical route is open; pinning it needs the exact Bettin-Conrey ' +
    'reciprocity resummation, a different tool entirely. No bound on Lambda moves; RH open; NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-97437 (analytic fixed point + kappa_eff + obstruction); imp-97441 (four-tolerance table; ' +
    'bimodal 1% row); imp-97459 (1/6, 1/5 resonance mechanism); imp-97460 (exact w(x) reduction; ' +
    'endpoint-level obstruction; kappa_eff = wobble amplitude); imp-97464 (two-term fit fails); ' +
    'imp-97472 (glossary headword); imp-97419 (upstream measured crossover); imp-97329 (bulk profile).',
});

export default IMP97493_CURVATURE_CROSSOVER_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97493_CURVATURE_CROSSOVER_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97493-cohort-has-all-six-members',
    why: 'The whole point of the index is grouping the six named tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97493_CURVATURE_CROSSOVER_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97437', 'imp-97441', 'imp-97459', 'imp-97460', 'imp-97464', 'imp-97472'].every(
        (id) => ids.includes(id),
      );
    },
  },
  {
    id: 'imp97493-shared-obstruction-and-question-present',
    why: 'The shared obstruction and grouping question are what turn six standalone leaves into ' +
      'a cohort; a missing or empty field would silently drop the cross-reference payload.',
    holds: () => {
      const idx = IMP97493_CURVATURE_CROSSOVER_COHORT_INDEX;
      return (
        typeof idx.sharedObstruction === 'string' &&
        idx.sharedObstruction.length > 0 &&
        typeof idx.question === 'string' &&
        idx.question.length > 0
      );
    },
  },
  {
    id: 'imp97493-ceiling-value-present',
    why: 'The b/4 ceiling constant anchors this cohort within the wider Route M program; a wrong ' +
      'value would mis-state the surrounding context.',
    holds: () => IMP97493_CURVATURE_CROSSOVER_COHORT_INDEX.routeMCeiling === 0.25,
  },
  {
    id: 'imp97493-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97493_CURVATURE_CROSSOVER_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97493_CURVATURE_CROSSOVER_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97493_CURVATURE_CROSSOVER_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97493_CURVATURE_CROSSOVER_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97493-route-m-curvature-crossover-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
