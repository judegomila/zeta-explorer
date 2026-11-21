/**
 * @module imp-96920-route-m-ceiling-ordering-glossary-headword
 * @fileoverview imp-96920 -- import-light glossary/Concepts headword distinguishing the
 *   three Route M conditioning ceilings T (rigorous trace, ~2.594e7), F (Frobenius fit,
 *   ~3.764e7), M (measured lam_max fit, ~4.109e7), and recording that their strict
 *   ordering T < F < M is p-INVARIANT: it cannot be reshuffled by uncertainty in the
 *   shared imp-96428 lam_min power-law exponent p, because all three ceilings are
 *   solved from the same cond#(N) = lam_max(N) / lam_min(N) = 1/eps equation with a
 *   COMMON lam_min = A N^-p factor.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96693 first reported the three ceilings; imp-96833 then asked whether their
 *   strict ordering could be an artifact of the unpublished uncertainty on the shared
 *   exponent p. This headword bakes the imp-96833 answer verbatim (no re-import of the
 *   imp-96833 module, to stay import-light) as a standalone quick-lookup entry
 *   distinguishing what each of T/F/M actually is and why their order is structural.
 *
 *   THE THREE CEILINGS
 *   -----------------------------------------------
 *   T (rigorous):  N ~ 2.594e7 -- uses the provable bound lam_max <= trace = O(log N),
 *                  so it is a genuine LOWER ceiling (compute binds no later than this).
 *   F (fit):       N ~ 3.764e7 -- uses the fitted Frobenius-norm proxy ||G||_F ~ N^0.478.
 *   M (measured):  N ~ 4.109e7 -- uses the fitted measured lam_max ~ N^0.353 log-law.
 *   All three solve the SAME equation cond#(N) = lam_max(N)/lam_min(N) = 1/eps against a
 *   single shared lam_min(N) = A N^-p fit (imp-96428, p = 1.917927), differing only in
 *   which lam_max proxy (rigorous bound, Frobenius fit, or direct measurement fit) is
 *   used in the numerator.
 *
 *   WHY THE ORDERING T < F < M IS P-INVARIANT
 *   -----------------------------------------------
 *   Because every ceiling shares the identical 1/p exponent from the common lam_min
 *   factor, any two ceilings' ratio N_i/N_j = (pi_j/pi_i)^(1/p) keeps the SIGN of
 *   (pi_i - pi_j) for every p > 0 -- no value of p (in or outside its uncertainty band)
 *   can reorder T, F, and M. Numerically, imp-96833 found the OLS standard error on p is
 *   only SE(p)/p = 0.127%, so even a +/-2-sigma excursion moves each ceiling by at most
 *   ~4.4% and the resulting bands do not overlap: T in [2.484e7, 2.708e7], F in
 *   [3.633e7, 3.899e7], M in [3.958e7, 4.266e7] -- T_hi < F_lo < F_hi < M_lo. The
 *   ordering rests on structure (a shared exponent), not on the numerical size of the
 *   uncertainty.
 *
 *   STATUS: a glossary distinction + sensitivity restatement, not a new measurement and
 *   not a rigorous derivation. Only T is a rigorous lower bound; F and M inherit their
 *   parent log-fit extrapolations. Every ceiling sits >= 1500x above the imp-96352
 *   wall-clock compute ceiling, so compute binds first regardless of which ceiling
 *   (or which point in the p-band) is used.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup distinguishing the three named ceilings and restating why
 *   their order is p-invariant. It establishes nothing, instantiates no interval, closes
 *   no sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96833-route-m-ceiling-p-sensitivity-band.js (source: the p-sensitivity band and ordering proof this glosses)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the three reported ceilings T/F/M)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (shared lam_min = A N^-p fit, p = 1.917927)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916, binds first)
 *
 * Ticket: imp-96920 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The T/F/M distinguishing headword, baked verbatim (no re-import).
const CEILING_ORDERING_HEADWORD = Object.freeze({
  key: 'route-m-three-ceiling-tfm-ordering-p-invariant',
  term:
    'Route M reports THREE conditioning ceilings from the same cond#(N) = 1/eps equation: ' +
    'T (rigorous trace bound, ~2.594e7) < F (Frobenius fit, ~3.764e7) < M (measured fit, ' +
    '~4.109e7). Their strict order is p-invariant: no uncertainty in the shared lam_min ' +
    'exponent p can reorder them, because all three share the identical 1/p exponent.',
  definition:
    'T, F, and M differ only in which lam_max(N) proxy is used in the numerator of ' +
    'cond#(N) = lam_max(N)/lam_min(N): T uses the provable bound lam_max <= trace = ' +
    'O(log N) (a genuine lower ceiling); F uses the fitted Frobenius-norm proxy ' +
    '||G||_F ~ N^0.478; M uses the fitted directly-measured lam_max ~ N^0.353 log-law. ' +
    'All three are solved against the SAME shared lam_min(N) = A N^-p fit (imp-96428, ' +
    'p = 1.917927), so every ceiling is N_ceiling = (A/(eps * lam_max-proxy-constant))^(1/p).',
  mechanism:
    'Because the shared lam_min factor contributes the identical 1/p exponent to every ' +
    'ceiling, the ratio of any two ceilings N_i/N_j = (pi_j/pi_i)^(1/p) preserves the sign ' +
    'of (pi_i - pi_j) for every p > 0 -- the ordering is a structural consequence of the ' +
    'shared exponent, not a numerical coincidence that could flip under refitting. ' +
    'imp-96833 quantified the residual risk anyway: the OLS standard error on p is only ' +
    'SE(p)/p = 0.127%, and propagating a +/-2-sigma excursion through the ceiling ' +
    'elasticity d(log N)/dp ~ -7.3 to -8.9 moves each ceiling by at most ~4.4%, giving ' +
    'non-overlapping bands T in [2.484e7, 2.708e7], F in [3.633e7, 3.899e7], M in ' +
    '[3.958e7, 4.266e7] (T_hi < F_lo < F_hi < M_lo).',
  verificationStatus:
    'Glossary distinction + sensitivity restatement (imp-96833), not a new measurement ' +
    'and not a rigorous derivation. Only T is a rigorous lower bound; F and M inherit ' +
    'their parent log-fit extrapolation sub-gaps (imp-96684 / imp-96443). Every ceiling ' +
    'sits >= 1500x above the imp-96352 wall-clock compute ceiling ~9916, so compute binds ' +
    'first regardless of which ceiling or p-band point is used. Changes no bound; ' +
    'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96920_ROUTE_M_CEILING_ORDERING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96920',
  proofSection: 'S-frontier',
  glosses: 'imp-96833',
  question:
    'Route M reports three conditioning ceilings T (rigorous), F (Frobenius fit), M ' +
    '(measured fit) from the same cond#(N) = 1/eps equation. What distinguishes them, ' +
    'and can uncertainty in the shared lam_min exponent p reorder T < F < M?',
  headword: CEILING_ORDERING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). T, F, M differ only in their ' +
    'lam_max proxy (rigorous trace bound / Frobenius fit / measured fit) but share the ' +
    'identical lam_min = A N^-p factor, so the strict ordering T < F < M is p-INVARIANT ' +
    'by construction and survives the imp-96833 non-overlapping +/-2-sigma bands. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96833 (the p-sensitivity band and ordering proof this glosses); imp-96693 (the ' +
    'three reported ceilings T/F/M); imp-96428 (shared lam_min power law, p = 1.917927); ' +
    'imp-96352 (wall-clock compute ceiling ~9916).',
});

export default IMP96920_ROUTE_M_CEILING_ORDERING_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96920_ROUTE_M_CEILING_ORDERING_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96920-headword-has-required-fields',
    why: 'The headword must name all three ceiling symbols/values and state the ' +
      'p-invariance mechanism -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96920_ROUTE_M_CEILING_ORDERING_GLOSSARY_HEADWORD.headword;
      return (
        /2\.594e7/.test(h.term) &&
        /3\.764e7/.test(h.term) &&
        /4\.109e7/.test(h.term) &&
        /1\.917927/.test(h.definition) &&
        (/p-invariant/i.test(h.mechanism) || /1\/p/.test(h.mechanism))
      );
    },
  },
  {
    id: 'imp96920-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96920_ROUTE_M_CEILING_ORDERING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96920_ROUTE_M_CEILING_ORDERING_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96920_ROUTE_M_CEILING_ORDERING_GLOSSARY_HEADWORD.verdict) &&
      IMP96920_ROUTE_M_CEILING_ORDERING_GLOSSARY_HEADWORD.glosses === 'imp-96833',
  },
];

for (const assertion of IMP96920_ROUTE_M_CEILING_ORDERING_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96920-route-m-ceiling-ordering-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
