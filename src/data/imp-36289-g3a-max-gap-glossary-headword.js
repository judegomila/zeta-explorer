/**
 * @module imp-36289-g3a-max-gap-glossary-headword
 * @fileoverview imp-36289 -- import-light glossary/Concepts headword defining the
 *   Route-C open sub-gap G3a_max_gap: the extremal max-gap statistic at the
 *   density-squeeze argmin site that sets the magnitude and N-scaling of the
 *   imp-337/imp-342/imp-343 integrated per-N bound, and why its closure via a
 *   GUE-type sqrt(log N) max-gap scale risks importing extremal statistics beyond
 *   pure Weyl (and, per imp-36259, actually ELIMINATES the squeeze rather than pinning it).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-36259 already scopes G3a_max_gap in full (the gap object, the R_critical
 *   threshold, the GUE illustration) and imp-451/g3a-extremal-closure already
 *   diagnoses the near+tail obstruction, but neither offers a quick-lookup
 *   definition of the term for readers landing on Route-C material. This headword
 *   bakes a one-paragraph restatement VERBATIM (no re-import, to stay import-light)
 *   as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   G3a_max_gap: Route-C (imp-337) needs, at the backward-flow argmin site k*(t), a
 *   density squeeze S_{k*}(t) >= c(N)/B(t)^2 with c(N) > 2. imp-355 splits the
 *   near part with the normalised argmin-site MAX nearest-neighbour gap
 *   R_N = Delta_max(k*) * rho_infty(gamma_{k*}), giving c_near(R) = 2/(R*(R+1)) and,
 *   with the imp-342 rigorous Weyl tail c_tail = 2*(pi^2/6 - 1) ~ 1.2899,
 *   c_total(R) = c_near(R) + c_tail. The squeeze survives iff R_N < R_critical
 *   ~ 1.2512 (root of 2/(R*(R+1)) + c_tail = 2). G3a_max_gap is the OPEN gap of
 *   supplying a bound on R_N with a pinned N-scaling AND R_N <= R_critical -
 *   epsilon uniformly in N -- without which there is no r_C(N) at all, not a
 *   slower one.
 *   R_N is an EXTREMAL statistic at a density-0 argmin site, not a mean-density
 *   quantity, so pinning it imports extremal input BEYOND pure Weyl (matching
 *   Route-A's C_mb caveat). Per imp-36259, feeding in a GUE-type sqrt(log N)
 *   max-gap scale does not merely "import extremal statistics" abstractly -- it
 *   concretely EXCEEDS R_critical for every N >= 5, driving c_total -> c_tail
 *   ~ 1.29 < 2, so the squeeze FAILS and the conditional r_C(N) is VACUOUS. This
 *   is the same near+tail obstruction imp-451 diagnosed on the min-gap reading.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-36259 gap-object scoping and the
 *   imp-451 obstruction diagnosis for quick reference. It establishes nothing,
 *   instantiates no interval, derives no remainder, changes no bound, closes no
 *   sub-gap. G3a_max_gap and the Route-C per-N translation REMAIN OPEN; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-36259-routeC-g3a-maxgap-residual-scope.js (source: the gap-object scoping this glosses)
 * @see g3a-extremal-closure.js (imp-451 diagnostic: near+tail c_total -> 0 under GUE)
 * @see imp-36151-routeC-vs-routeB-perN-exponent-comparison.js (Route-C readiness-vs-exponent resolution)
 * @see lambda-roadmap.js (Route-C route object; G3a_max_gap OPEN; closesIf)
 *
 * Ticket: imp-36289 (content, low). Documentation only; establishes no enclosure;
 * G3a_max_gap and Route-C per-N translation stay OPEN; NO QED; no refereed bound is changed.
 */

// The G3a_max_gap headword definition, baked verbatim (no re-import of imp-36259).
const G3A_MAX_GAP_HEADWORD = Object.freeze({
  key: 'g3a-max-gap',
  term: 'G3a_max_gap (Route-C argmin-site max-gap residual; imp-337/342/343/imp-36259)',
  definition:
    'Route-C needs, at the backward-flow argmin site k*(t), a density squeeze ' +
    'S_{k*}(t) >= c(N)/B(t)^2 with c(N) > 2. Splitting the near part with the ' +
    'normalised argmin-site MAX nearest-neighbour gap R_N = Delta_max(k*) * ' +
    'rho_infty(gamma_{k*}) gives c_near(R) = 2/(R*(R+1)) and, with the imp-342 ' +
    'Weyl tail c_tail = 2*(pi^2/6 - 1) ~ 1.2899, c_total(R) = c_near(R) + c_tail. ' +
    'The squeeze survives iff R_N < R_critical ~ 1.2512 (root of ' +
    '2/(R*(R+1)) + c_tail = 2). G3a_max_gap is the OPEN gap of supplying a bound ' +
    'on R_N with (i) a pinned N-scaling and (ii) R_N <= R_critical - epsilon ' +
    'uniformly in N.',
  whyBeyondPureWeyl:
    'R_N is an EXTREMAL (max-gap) statistic at a density-0 argmin site; the Weyl ' +
    'law fixes only the MEAN density of zeros, so pinning R_N imports extremal ' +
    'statistics beyond pure Weyl -- the same caveat Route-A carries for its C_mb ' +
    'microscopic-rigidity input.',
  gueClosureRisk:
    'A GUE-type sqrt(log N) max-gap scale does not merely "import extremal ' +
    'statistics" in the abstract: per imp-36259, R_N ~ sqrt(log N) EXCEEDS ' +
    'R_critical ~ 1.2512 for every N >= 5, driving c_total(N) -> c_tail ~ 1.29 < 2. ' +
    'The squeeze c(N) > 2 then FAILS, the strict drift is not established, and the ' +
    'conditional r_C(N) is VACUOUS -- matching the imp-451 near+tail obstruction on ' +
    'the min-gap reading.',
  liveObstruction:
    'G3a_max_gap is OPEN; per imp-36259 its residual research content lives at the ' +
    'successor sub-gap G3a_sub_fullsum_dynamical (a Dyson-ODE argument, imp-507), ' +
    'not at any static max-gap bound. Route-C has no pinned per-N exponent until ' +
    'this closes.',
});

export const IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-36289',
  proofSection: 'S-frontier',
  glosses: 'imp-36259',
  scopes: 'G3a_max_gap',
  question:
    'What is the Route-C open sub-gap G3a_max_gap, what does its magnitude and ' +
    'N-scaling set in the imp-337/imp-342/imp-343 integrated per-N bound, and why ' +
    'does closing it via a GUE-type sqrt(log N) max-gap scale risk importing ' +
    'extremal statistics beyond pure Weyl?',
  headword: G3A_MAX_GAP_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Defines G3a_max_gap as ' +
    'the open gap of pinning the normalised argmin-site max nearest-neighbour gap ' +
    'R_N below R_critical ~ 1.2512 uniformly in N, and restates the imp-36259 ' +
    'finding that a GUE-type sqrt(log N) closure EXCEEDS R_critical for all N >= 5 ' +
    'and eliminates the squeeze rather than pinning a per-N exponent. Establishes ' +
    'nothing; instantiates no interval; closes no sub-gap; G3a_max_gap and the ' +
    'Route-C per-N translation stay OPEN; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36259 (gap-object scoping and GUE illustration); imp-451/g3a-extremal-' +
    'closure (near+tail c_total -> 0 diagnostic); imp-337/imp-342/imp-343 (Route-C ' +
    'density squeeze and Weyl tail); imp-36151 (Route-C readiness-vs-exponent ' +
    'resolution); imp-36045 (Route-C route-readiness ranking).',
});

export default IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp36289-headword-has-required-fields',
    why: 'The headword must define G3a_max_gap, explain the beyond-pure-Weyl caveat, and state the GUE closure risk -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD.headword;
      return (
        /R_critical/.test(h.definition) &&
        /beyond pure Weyl/.test(h.whyBeyondPureWeyl) &&
        /VACUOUS/.test(h.gueClosureRisk) &&
        /OPEN/.test(h.liveObstruction)
      );
    },
  },
  {
    id: 'imp36289-honesty-gate-no-qed',
    why: 'Documentation only: no enclosure claimed established, G3a_max_gap stays OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD.anyEnclosureEstablished === false &&
      /NO QED/.test(IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD.verdict) &&
      /stay OPEN/.test(IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD.verdict) &&
      IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD.glosses === 'imp-36259' &&
      IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD.scopes === 'G3a_max_gap',
  },
];

for (const assertion of IMP36289_G3A_MAX_GAP_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36289-g3a-max-gap-glossary-headword assertion failed: ${assertion.id}`);
  }
}
