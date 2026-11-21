/**
 * @module imp-97465-mcm-refutation-glossary-headword
 * @fileoverview imp-97465 -- import-light glossary/Concepts headword recording the imp-97432
 *   MCM (multiplicative complete monotonicity) refutation: the hypothesis that every iterated
 *   multiplicative difference (D_{p1}...D_{pj})(h)(x) >= 0 (h = g/m, g the Glaisher-Kinkelin
 *   log-remainder function, D_p f(x) = f(x) - f(px)) holds for ALL finite prime sets and x >= 1
 *   is FALSE: it holds through omega <= 10 and first breaks at omega = 11, at the primorial
 *   b = p_11# = 200560490130, where T(p_11#) = -9.624e-4 < 0. The weaker b/4 quarter-ceiling
 *   that MCM was meant to imply (imp-97422) SURVIVES the refutation: |T(p_11#)| = 9.7e-4 is
 *   deep inside the band [-1/4, 1/4], and the primorial family converges to
 *   -e^{-gamma}/12 + Rcorr = -0.0458, comfortably inside.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) DEFINITION. MCM (multiplicative complete monotonicity): for h = g/m and every finite
 *   prime set {p1,...,pj}, the iterated multiplicative difference (D_{p1}...D_{pj} h)(x) >= 0
 *   for all x >= 1, where (D_p f)(x) = f(x) - f(px). imp-97422 reduced both b/4-ceiling
 *   conditions at omega(b) >= 4 to this hypothesis.
 *   (b) BREAKDOWN VALUE. MCM holds through omega <= 10 (T(p_9#) = +2.098e-3, T(p_10#) =
 *   +4.783e-4) and first fails at omega = 11, at the smallest omega=11 squarefree number
 *   b = p_11# = 2*3*5*7*11*13*17*19*23*29*31 = 200560490130, where T(p_11#) = -9.624e-4 < 0.
 *   (c) PRIMORIAL ASYMPTOTE. The smooth surrogate has a finite limit
 *   surrogate(p_j#) -> -e^{-gamma}/12 = -0.046788 (by Mertens), so
 *   T(p_j#) -> -e^{-gamma}/12 + 1.0186e-3 = -0.04577 as j -> infinity, comfortably above -1/4.
 *   (d) HONEST OUTCOME: THE CEILING SURVIVES. The b/4 ceiling only needs the two-sided band
 *   -1/4 <= T(b) <= 1/4, which is strictly weaker than MCM's non-negativity. The counterexample
 *   |T(p_11#)| = 9.7e-4 stays deep inside the band, so MCM's failure kills the imp-97422 proof
 *   ROUTE (dead beyond omega = 10) without refuting the ceiling itself; omega >= 11 remains
 *   numerically safe but open (cross-ref imp-97442 omega=5,6 subgrid verification, which
 *   independently confirms MCM on that range before the omega=11 breakdown).
 *
 *   STATUS: documentation only. No bound moves; this headword names an already-established
 *   refutation (imp-97432) and its honest, safe-ceiling outcome. NO QED.
 *
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (source: the refutation, the
 *   omega=11 counterexample, the primorial limit, and the ceiling-survives verdict this glosses)
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (the MCM
 *   hypothesis and the omega >= 4 ceiling reduction that MCM was meant to close, now refuted)
 * @see imp-97442-route-m-mcm-omega56-subgrid-verification.js (independent omega=5,6 subgrid
 *   verification of MCM on the range below the omega=11 breakdown)
 *
 * Ticket: imp-97465 (content, medium, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The MCM refutation headword, baked verbatim (no re-import).
const MCM_REFUTATION_HEADWORD = Object.freeze({
  key: 'mcm-refutation-omega11-imp97432',
  term:
    'MCM (multiplicative complete monotonicity) refutation at omega = 11: the imp-97422 ' +
    'non-negativity hypothesis for iterated multiplicative differences of h = g/m holds ' +
    'through omega <= 10 and first fails at b = p_11# = 200560490130, with T(p_11#) = ' +
    '-9.624e-4 < 0 -- yet the b/4 quarter-ceiling survives.',
  definition:
    'MCM asserts that for h = g/m (g the Glaisher-Kinkelin log-remainder function) and every ' +
    'finite prime set {p1,...,pj}, the iterated multiplicative difference ' +
    '(D_{p1}...D_{pj} h)(x) >= 0 for all x >= 1, where (D_p f)(x) = f(x) - f(px). imp-97422 ' +
    'used this hypothesis to reduce both b/4-ceiling conditions at omega(b) >= 4 to a single ' +
    'sign claim, verifying it numerically only up to omega <= 6.',
  breakdown:
    'MCM holds through omega = 10 (T(p_9#) = +2.098e-3, T(p_10#) = +4.783e-4) and first fails ' +
    'at omega = 11, at the smallest omega=11 squarefree number ' +
    'b = p_11# = 2*3*5*7*11*13*17*19*23*29*31 = 200560490130, where T(p_11#) = -9.624e-4 < 0 ' +
    '(rigorous to a tail bound < 1e-19). The primorial surrogate has a finite limit ' +
    'surrogate(p_j#) -> -e^{-gamma}/12 = -0.046788 by Mertens, so T(p_j#) -> ' +
    '-e^{-gamma}/12 + 1.0186e-3 = -0.04577 as j -> infinity.',
  ceilingSurvives:
    'The b/4 ceiling only needs the strictly weaker two-sided band -1/4 <= T(b) <= 1/4, not ' +
    'MCM non-negativity. At the counterexample |T(p_11#)| = 9.7e-4, deep inside the band, and ' +
    'the primorial limit -0.0458 stays comfortably above -1/4. MCM failing kills the imp-97422 ' +
    'proof route beyond omega = 10 without refuting the ceiling; omega >= 11 is numerically ' +
    'safe but its closure now needs the two-sided band directly (cross-ref imp-97442 ' +
    'independent omega=5,6 subgrid verification of MCM below the breakdown).',
  verificationStatus:
    'Re-cited from the imp-97432 measurement module ' +
    '(src/data/imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js), where the exact ' +
    'reweighted-mean characterization, the omega=11 counterexample, and the primorial limit ' +
    'are all verified directly. Naming / glossary headword only; supplies no new bound; RH ' +
    'open; no refereed bound is changed; NO QED.',
});

export const IMP97465_MCM_REFUTATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97465',
  proofSection: 'Route-M',
  glosses: 'imp-97432',
  question:
    'imp-97432 disproved the imp-97422 MCM hypothesis at omega = 11 but showed the b/4 ceiling ' +
    'survives the counterexample. What is the headword for this refutation, and does it move ' +
    'any bound?',
  headword: MCM_REFUTATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97432 refutation of ' +
    'MCM (first counterexample b = p_11# = 200560490130, T(p_11#) = -9.624e-4 < 0) and the ' +
    'primorial asymptote T(p_j#) -> -e^{-gamma}/12 + 1.0186e-3 = -0.04577, plus the honest ' +
    'outcome that the b/4 ceiling survives (|T(p_11#)| = 9.7e-4 deep inside [-1/4, 1/4]). No ' +
    'bound moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97432 (the refutation, omega=11 counterexample, and primorial limit this glosses); ' +
    'imp-97422 (the MCM hypothesis and ceiling reduction now refuted as a route); imp-97442 ' +
    '(independent omega=5,6 subgrid verification of MCM below the breakdown).',
});

export default IMP97465_MCM_REFUTATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97465_MCM_REFUTATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97465-headword-cites-breakdown-value-and-primorial-limit',
    why: 'The headword must name the omega=11 breakdown value T(p_11#) = -9.624e-4, the ' +
      'counterexample b = 200560490130, and the primorial asymptote -e^{-gamma}/12 -- the ' +
      'entire content of the glossary entry.',
    holds: () => {
      const h = IMP97465_MCM_REFUTATION_GLOSSARY_HEADWORD.headword;
      return (
        /-9\.624e-4/.test(h.breakdown) &&
        /200560490130/.test(h.breakdown) &&
        /e\^\{-gamma\}\/12/.test(h.breakdown) &&
        /-1\/4 <= T\(b\) <= 1\/4/.test(h.ceilingSurvives)
      );
    },
  },
  {
    id: 'imp97465-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97432.',
    holds: () =>
      IMP97465_MCM_REFUTATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97465_MCM_REFUTATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97465_MCM_REFUTATION_GLOSSARY_HEADWORD.verdict) &&
      IMP97465_MCM_REFUTATION_GLOSSARY_HEADWORD.glosses === 'imp-97432',
  },
];

for (const assertion of IMP97465_MCM_REFUTATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97465-mcm-refutation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
