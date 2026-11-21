/**
 * @module imp-96642-lammin-nuniform-nogo-glossary-headword
 * @fileoverview imp-96642 -- import-light glossary/Concepts headword for the imp-96613
 *   FINDING 4 verdict: no N-uniform analytic lower bound lam_min(G_N) >= A N^-p is in
 *   reach because the Vasyunin Gram is a NON-COMPACT MULTIPLICATIVE operator with 0 in
 *   its limiting spectrum, and the GCD-sum / large-sieve literature -- the one body of
 *   theory that speaks the right (multiplicative) language -- bounds only the TOP edge
 *   of the spectrum, not the lower frame.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96613 assessed whether any limiting-spectrum / Szego-type statement could
 *   supply an N-uniform analytic lam_min(G_N) >= A N^-p bound -- the only object that
 *   would bypass the imp-96591 double-precision certification crossover (N ~ 1.08e5)
 *   and the imp-96584 double-double reach (N ~ 2.67e10). It found NO such bound is
 *   available and none is in reach of the named machinery. This headword bakes that
 *   verdict verbatim (no re-import of the imp-96613 module, to stay import-light) as a
 *   standalone quick-lookup entry, with emphasis on FINDING 4: the closest analytic
 *   machinery (GCD-sum / Gal-type theory) bounds the WRONG edge.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The needed statement is an N-uniform coercivity / lower-frame bound
 *   <G_N x, x> >= A N^-p ||x||^2 for all x in C^N -- an edge-SCALING rate, not a
 *   limiting spectral-distribution statement (the limiting spectrum's bottom edge is
 *   already known to be 0, imp-96582, so a Szego/Grenander statement gives only the
 *   trivial lam_min -> 0 with no rate). Three structural obstructions block it: (a)
 *   WRONG GROUP -- the kernel gcd(h,k) I(h/g,k/g)/(hk) is translation invariant on the
 *   multiplicative semigroup, not the additive group Z, so neither Szego nor additive
 *   Fisher-Hartwig/Widom edge-scaling applies; (b) NON-COMPACT top edge -- it diverges
 *   as ~0.3526 log N (imp-96562), blocking stable-finite-section transfer of a per-rung
 *   enclosure into a uniform rate; (c) COLLECTIVE effect -- the peak row is
 *   Hilbert-Schmidt (imp-96586), so no mean-field/rank-one surrogate carries the
 *   log-divergence. FINDING 4 adds a fourth, independent point: the GCD-sum / Gal-type
 *   literature (Gal 1949; Lindqvist-Seip; Bondarenko-Seip; Montgomery-Vaughan large
 *   sieve) is the natural analytic home for this multiplicative kernel, but it only
 *   produces UPPER bounds on gcd(h,k)/(hk)-type quadratic forms -- i.e. it controls the
 *   TOP of the spectrum (already covered by the imp-96548 rigorous upper bound), not the
 *   LOWER frame / coercivity inequality lam_min >= A N^-p needs. So the one body of
 *   theory in the right language addresses the wrong edge.
 *
 *   STATUS: a structural assessment consolidating four prior findings (ruling out a
 *   proof route), not a numerical measurement and not a derivation of A or p.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96613 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96613-route-m-lammin-nuniform-lowerbound-obstruction-assessment.js (source: the assessment this glosses)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (top edge log-divergence; wrong-group obstruction)
 * @see imp-96582-route-m-lammin-bottom-edge-szego-assessment.js (bottom edge value 0)
 * @see imp-96586-route-m-lammax-meanfield-cesaro-proxy.js (Hilbert-Schmidt peak row; collective effect)
 * @see imp-96591-route-m-lammin-cert-limit-crossover-measurement.js (double-precision crossover N~1.08e5)
 *
 * Ticket: imp-96642 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The N-uniform-lower-bound no-go headword, baked verbatim (no re-import).
const LAMMIN_NUNIFORM_NOGO_HEADWORD = Object.freeze({
  key: 'lammin-nuniform-lowerbound-nogo-wrong-edge-machinery',
  term:
    'imp-96613 verdict: NO N-uniform analytic lam_min(G_N) >= A N^-p bound is in reach ' +
    'because the Vasyunin Gram is a NON-COMPACT MULTIPLICATIVE operator with 0 in its ' +
    'limiting spectrum, and the GCD-sum / large-sieve literature -- the one machinery ' +
    'in the right (multiplicative) language -- bounds only the TOP edge, not the lower frame',
  definition:
    'A per-rung verified-Cholesky enclosure certifies lam_min(G_N) > 0 only at the ' +
    'single N run, and expires at the double-precision crossover N ~ 1.08e5 ' +
    '(imp-96591) / the double-double reach N ~ 2.67e10 (imp-96584). The only object ' +
    'that bypasses this precision crossover for every N at once is a proved ' +
    'N-uniform coercivity bound <G_N x, x> >= A N^-p ||x||^2. Such a bound is an ' +
    'edge-SCALING rate, not a limiting spectral-distribution statement -- the ' +
    'limiting spectrum bottom edge is already known to be 0 (imp-96582), so a ' +
    'Szego/Grenander statement gives only the trivial lam_min -> 0 with no rate.',
  mechanism:
    'Four independent obstructions block the needed bound. (a) WRONG GROUP: the ' +
    'kernel gcd(h,k) I(h/g,k/g)/(hk) is translation invariant on the multiplicative ' +
    'semigroup, not the additive group Z, so neither the additive Szego edge theorem ' +
    'nor additive Fisher-Hartwig/Widom edge-scaling applies. (b) NON-COMPACT TOP ' +
    'EDGE: it diverges as ~0.3526 log N (imp-96562), blocking the stable-finite-' +
    'section (Baxter / Gohberg-Feldman) route that would upgrade a per-rung ' +
    'enclosure into a uniform rate. (c) COLLECTIVE, NO MEAN-FIELD SURROGATE: the ' +
    'peak (k=1) row is Hilbert-Schmidt (Sum_k G_{1,k}^2 -> ~4.055, imp-96586), so ' +
    'every rank-one / averaged-symbol surrogate saturates and carries no ' +
    'log-divergence -- not even a heuristic derivation of A or p is available. (d) ' +
    'WRONG-EDGE MACHINERY (FINDING 4): the GCD-sum / Gal-type literature (Gal 1949; ' +
    'Lindqvist-Seip; Bondarenko-Seip large GCD sums; Montgomery-Vaughan large sieve) ' +
    'is the natural analytic home for this multiplicative kernel, but it produces ' +
    'only UPPER bounds on gcd(h,k)/(hk)-type quadratic forms -- a lam_max / ' +
    'off-diagonal-mass (top-edge) control, already covered by the rigorous ' +
    'imp-96548 trace-domination upper bound. It supplies no lower-frame / ' +
    'coercivity analog and no large-sieve LOWER inequality, so the one body of ' +
    'theory speaking the right language addresses the wrong edge.',
  verificationStatus:
    'Structural assessment consolidating four prior findings (rules out a proof ' +
    'route), not a numerical measurement and not a derivation of A or p. Changes no ' +
    'bound; establishes no operator positivity; no refereed bound is changed; RH ' +
    'open; NO QED.',
});

export const IMP96642_LAMMIN_NUNIFORM_NOGO_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96642',
  proofSection: 'S-frontier',
  glosses: 'imp-96613',
  question:
    'What limiting-spectrum / Szego-type statement would give an N-uniform analytic ' +
    'lower bound lam_min(G_N) >= A N^-p, bypassing the imp-96591 double-precision ' +
    'certification crossover, and does the GCD-sum / large-sieve literature -- the ' +
    'natural analytic home for this multiplicative kernel -- supply it?',
  headword: LAMMIN_NUNIFORM_NOGO_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96613 ' +
    'verdict: NO -- no N-uniform analytic lam_min(G_N) >= A N^-p bound is available ' +
    'or in reach. The Vasyunin Gram is a non-compact multiplicative operator with 0 ' +
    'in its limiting spectrum (wrong group; non-compact unbounded top edge; ' +
    'collective, no mean-field surrogate), and the GCD-sum / large-sieve machinery -- ' +
    'the one body of theory in the right language -- bounds only the TOP edge, not ' +
    'the lower frame (FINDING 4). Establishes nothing; instantiates no interval; ' +
    'moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96613 (the structural consolidation and finding this glosses); imp-96562 ' +
    '(top edge log-divergence); imp-96582 (bottom edge value 0); imp-96586 ' +
    '(Hilbert-Schmidt peak row); imp-96591 / imp-96584 (precision crossovers).',
});

export default IMP96642_LAMMIN_NUNIFORM_NOGO_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96642_LAMMIN_NUNIFORM_NOGO_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96642-headword-names-wrong-edge-machinery',
    why: 'The headword must name FINDING 4 explicitly: the GCD-sum/large-sieve ' +
      'machinery bounds the top edge, not the lower frame lam_min needs -- the crux ' +
      'of this specific glossary entry (distinct from the imp-96603 headword).',
    holds: () => {
      const h = IMP96642_LAMMIN_NUNIFORM_NOGO_GLOSSARY_HEADWORD.headword;
      return (
        /GCD-sum/.test(h.mechanism) &&
        /UPPER bounds/.test(h.mechanism) &&
        /wrong edge/.test(h.mechanism) &&
        /large sieve/i.test(h.mechanism) &&
        /non-compact/i.test(h.definition + h.mechanism)
      );
    },
  },
  {
    id: 'imp96642-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96642_LAMMIN_NUNIFORM_NOGO_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96642_LAMMIN_NUNIFORM_NOGO_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96642_LAMMIN_NUNIFORM_NOGO_GLOSSARY_HEADWORD.verdict) &&
      IMP96642_LAMMIN_NUNIFORM_NOGO_GLOSSARY_HEADWORD.glosses === 'imp-96613',
  },
];

for (const assertion of IMP96642_LAMMIN_NUNIFORM_NOGO_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96642-lammin-nuniform-nogo-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
