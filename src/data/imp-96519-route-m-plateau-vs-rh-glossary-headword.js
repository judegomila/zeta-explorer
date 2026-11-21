/**
 * @module imp-96519-route-m-plateau-vs-rh-glossary-headword
 * @fileoverview imp-96519 -- import-light glossary/Concepts headword distinguishing
 *   the imp-96487 Route M Burnol-ratio MEASURED finite-N plateau (~0.985 over
 *   N<=1e4) from the still-undecided TRUE asymptotic (RH predicts ratio->1).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96487 fit a decaying-oscillation remainder model to the 21-rung
 *   N=250..10000 Route M ratio(N) ladder and found the RH asymptote (ratio->1)
 *   is disfavored by ~1.9x in rms against a free plateau at c0~0.9846, robust
 *   across trial frequencies and decay exponents. But the log-N window is only
 *   3.689 wide (~2.26 oscillation periods) with the decay exponent p degenerate
 *   over {0,1,2} -- so the fit BOUNDS the finite-N behavior without being able
 *   to RULE OUT a centerline that creeps upward toward 1 on a scale beyond
 *   N=1e4. Conflating "the data prefer a plateau" with "the plateau is the true
 *   asymptote" would overstate what was measured. This headword names that
 *   distinction as a standalone quick-lookup entry, baking the imp-96487
 *   figures verbatim (no re-import, to stay import-light).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   PLATEAU-VS-ASYMPTOTE DISTINCTION (imp-96487, Route M Burnol ratio): the
 *   MEASURED finite-N reading -- a decaying-oscillation remainder about a
 *   centerline c0~0.9846, preferred over the RH value 1 by rms ratio ~1.85x-1.98x
 *   across decay exponents p in {0,1,2} -- is NOT the same claim as "the true
 *   asymptotic is 0.9846, not 1". The 3.689-wide log-N window (N=250..10000)
 *   holds only ~2.26 periods of the best-fit oscillation and cannot separate
 *   the centerline from the decay exponent, so it cannot exclude a slow drift
 *   of the true asymptote to 1 beyond N=1e4. What is established is a bound on
 *   the accessible range, not a resolution of the limit.
 *
 *   STATUS: a naming/classification headword restating the imp-96487 verdict
 *   and its explicit sub-gap, not a fresh derivation.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96487 verdict for quick
 *   reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model (source: the fit and sub-gap this glosses)
 * @see imp-96094-route-m-burnol-ratio-dense-ladder (N=250..2600 rungs)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000 (N=3000..6000 rungs; names the remainder-model route)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run (N=7000..10000 rungs)
 *
 * Ticket: imp-96519 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The plateau-vs-asymptote headword, baked verbatim
// (no re-import of the imp-96487 module).
const ROUTE_M_PLATEAU_VS_RH_HEADWORD = Object.freeze({
  key: 'route-m-plateau-vs-rh-distinction',
  term:
    'The imp-96487 Route M Burnol-ratio finite-N plateau (~0.985), and why it ' +
    'is a MEASURED bound on N<=1e4, not a resolution of the true ratio(N) ' +
    'asymptotic that RH predicts equals 1',
  definition:
    'A distinction between what is MEASURED and what is DECIDED: imp-96487 fit ' +
    'a decaying-oscillation remainder model ratio(N) = c0 + L^{-p}(a cos(wL)+b sin(wL)), ' +
    'L=log N, to the 21-rung N=250..10000 Route M Burnol-normalized ratio ' +
    'ladder and found the free plateau c0~0.9846 fits ~1.9x better in rms than ' +
    'forcing the RH asymptote c0=1, robustly across trial frequencies ' +
    '(c0 in [0.982,0.985] for w in {1,2,3,5,8,12,3.85}) and decay exponents ' +
    '(p in {0,1,2} all give c0~0.9845). That is a genuine finite-N reading, not ' +
    'an artifact of one fit choice. But the log-N window spans only 3.689 ' +
    '(N=250 to N=10000), holding just ~2.26 periods of the best-fit ' +
    'oscillation, and the centerline c0 and decay exponent p are jointly ' +
    'underdetermined over that span -- so the model cannot exclude a true ' +
    'asymptote that creeps upward to 1 on a log-N scale beyond what N=1e4 ' +
    'reaches.',
  mechanism:
    'The decisive test forces c0=1 and refits only the remainder: rms inflates ' +
    'by 1.9849x (p=2), 1.919x (p=1), 1.850x (p=0) versus the free-c0 fit -- the ' +
    'accessible ladder positively prefers the plateau over convergence to 1 at ' +
    'every tested decay exponent. Yet because p in {0,1,2} all reproduce ' +
    'c0~0.9845 with comparable rms, the fit cannot tell a slowly-decaying ' +
    'remainder (which could still relax toward 1 far beyond N=1e4) from a ' +
    'remainder that has already reached its true centerline. The N>=3000 tail ' +
    'mean 0.9784 corroborates the plateau reading but does not add resolving ' +
    'power on the exponent. Deciding the true asymptote needs a longer Gram ' +
    'ladder (wider log-N reach), not a further fit -- the CPU-blocked wider-N ' +
    'build this route was proposed as an alternative to remains the only ' +
    'route that could move this from "bounded" to "decided".',
  verificationStatus:
    'Measurement classification (fit-only, no new solve), not a rigorous ' +
    'derivation. Changes no bound; establishes no operator positivity; ' +
    'RH open; no refereed bound is changed; NO QED.',
});

export const IMP96519_ROUTE_M_PLATEAU_VS_RH_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96519',
  proofSection: 'S-frontier',
  glosses: 'imp-96487',
  question:
    'imp-96487 found the Route M Burnol ratio(N) ladder prefers a ~0.985 ' +
    'plateau over the RH value 1 by ~1.9x in rms. How should a reader ' +
    'distinguish that MEASURED finite-N reading from a claim about the TRUE ' +
    'asymptotic, and what would it take to decide the latter?',
  headword: ROUTE_M_PLATEAU_VS_RH_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-96487 ' +
    'finding -- a decaying-oscillation remainder about a plateau c0~0.9846, ' +
    'RH value 1 disfavored ~1.9x in rms across decay exponents p in {0,1,2} -- ' +
    'as a bound on the accessible N<=1e4 range, not a resolution of the true ' +
    'asymptotic, because the 3.689-wide log-N window (~2.26 periods) leaves ' +
    'the centerline and decay exponent jointly underdetermined. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96487 (the asymptotic-remainder fit and sub-gap this glosses, ' +
    'c0~0.9846, rms ratio 1.9849x at p=2); imp-96094/imp-96105/imp-96325 ' +
    '(the 21-rung N=250..10000 ladder); imp-96105 (names the remainder-model ' +
    'route as the untried alternative to the CPU-blocked wider-N Gram build).',
});

export default IMP96519_ROUTE_M_PLATEAU_VS_RH_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96519_ROUTE_M_PLATEAU_VS_RH_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96519-headword-names-plateau-and-window',
    why: 'The headword must name the measured plateau, the rms preference over ' +
      'the RH value, and the narrow log-N window that leaves it undecided -- ' +
      'the entire point of the entry.',
    holds: () => {
      const h = IMP96519_ROUTE_M_PLATEAU_VS_RH_GLOSSARY_HEADWORD.headword;
      return (
        /0\.9846/.test(h.definition) &&
        /3\.689/.test(h.definition) &&
        /1\.9849/.test(h.mechanism) &&
        /longer Gram ladder/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96519-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96519_ROUTE_M_PLATEAU_VS_RH_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96519_ROUTE_M_PLATEAU_VS_RH_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96519_ROUTE_M_PLATEAU_VS_RH_GLOSSARY_HEADWORD.verdict) &&
      IMP96519_ROUTE_M_PLATEAU_VS_RH_GLOSSARY_HEADWORD.glosses === 'imp-96487',
  },
];

for (const assertion of IMP96519_ROUTE_M_PLATEAU_VS_RH_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96519-route-m-plateau-vs-rh-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
