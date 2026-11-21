/**
 * @module imp-97658-krein-tail-bias-signal-vs-floor-glossary-headword
 * @fileoverview imp-97658 -- import-light glossary/Concepts headword recording the imp-97625
 *   tail-bias signal-vs-floor result: the far-field relBias(3.36) = -2.72746e-5 sign is
 *   RESOLVABLE roughly four orders of magnitude above the edge-amplitude measurement floor
 *   (~1e-9), except at the Rc = 1/a sign-change radius itself, where the bias magnitude drops
 *   to the floor and only the exact crossing radius stays unresolvable.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97625 assessed whether the imp-97605/imp-97580 far-field tail bias
 *   relBias(3.36) = -2.72746e-5 sits above or inside the edge-amplitude measurement floor. Two
 *   independent floor estimates -- (1) the imp-97605 residual ratio at the measured zero
 *   crossing Rc (4.54022e-4 in ratio units => 9.42e-10 in relBias units) and (2) the R*-local
 *   direct-vs-closed ratio deviation at R* = 3.36 (1.065e-4 => 2.91e-9) -- agree to within one
 *   order of magnitude, landing at ~1e-9. |relBias(3.36)| exceeds them by 2.90e4x and 9.39e3x
 *   respectively, so its negative sign is a genuine signal, not measurement noise.
 *   (b) WHY IT IS NEW. imp-97605 reported the zero crossing Rc measured to Rc - 7.6e-5 as
 *   "inside the amplitude-measurement floor" but left the resolvability of the far-field bias at
 *   R* = 3.36 unassessed. imp-97625 closes that gap: it shows the two readings are consistent
 *   because they describe different points. Near Rc, relBias itself is O(1e-9), comparable to
 *   the floor, so the exact crossing RADIUS is not resolvable there. But at R* = 3.36, well away
 *   from Rc, relBias has grown to 2.7e-5 and its sign is unambiguous.
 *   (c) WHY IT DOES NOT THREATEN THE TAIL BAR. The resolved bias also sits 36.7x below the
 *   imp-97497 far-field tail bar (< 1e-3), so a resolved but tiny negative bias does not
 *   endanger that bar.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. Assessment only, propagating the imp-97605 baked table
 *   through a floor estimate; no operator positivity or coercivity constant established; the
 *   interval-rigorous reach stays 2a <= 0.96; the m=1/m=2 Krein enclosure remains unusable at
 *   2a = ln 3.
 *   (e) STATUS: documentation only. No bound moved; not a rigorous asymptotic; the rigorous
 *   anchor stays the trace ceiling; compute binds first; NO QED.
 *
 * @see imp-97625-krein-tail-bias-signal-vs-floor-assessment.js (source: the floor propagation
 *   and signal-vs-noise verdict this headword names)
 * @see imp-97605-krein-tail-bias-direct-ct-crossvalidation.js (the direct IBP-free relBias
 *   cross-validation and the "sign change inside the floor" report at Rc this reconciles)
 * @see imp-97580-krein-tail-bias-R-sweep-signchange.js (the relBias closed factor and sign
 *   change at Rc = 1/a)
 * @see imp-97497-krein-welloptimum-tail-converged.js (the far-field optimum R* = 3.36 and the
 *   < 1e-3 tail bar the resolved bias sits 36.7x below)
 *
 * Ticket: imp-97658 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The tail-bias signal-vs-floor headword, baked verbatim (no re-import).
const KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_HEADWORD = Object.freeze({
  key: 'krein-tail-bias-signal-vs-floor-imp97625',
  term:
    'Tail-bias signal-vs-floor: relBias(3.36) = -2.72746e-5 is resolvable ~1e4x above the ' +
    'edge-amplitude floor, except at the Rc = 1/a sign-change radius itself',
  definition:
    'The imp-97605/imp-97580 far-field tail bias relBias(R*) at the imp-97497 optimum ' +
    'R* = 3.36 measures -2.72746e-5. Two independent estimates of the edge-amplitude ' +
    'measurement floor -- the imp-97605 residual ratio at the measured zero crossing Rc = 1/a ' +
    '(=> 9.42e-10 in relBias units) and the R*-local direct-vs-closed ratio deviation ' +
    '(=> 2.91e-9) -- agree to within one order of magnitude at ~1e-9. The bias magnitude ' +
    'exceeds both floors by 2.90e4x and 9.39e3x, so its negative sign is a genuine resolvable ' +
    'signal, not noise.',
  mechanism:
    'The apparent tension with imp-97605 reporting the zero crossing "inside the floor" is ' +
    'local to Rc: near the crossing relBias itself is O(1e-9), comparable to the floor, so the ' +
    'exact sign-change RADIUS is not resolvable there. At R* = 3.36, well away from Rc, relBias ' +
    'has grown to 2.7e-5, four orders of magnitude above the floor, so its sign is unambiguous. ' +
    'The resolved bias also sits 36.7x below the imp-97497 < 1e-3 far-field tail bar, so it does ' +
    'not threaten that bar.',
  verificationStatus:
    'Re-cited from the imp-97625 assessment module ' +
    '(src/data/imp-97625-krein-tail-bias-signal-vs-floor-assessment.js), whose baked assertions ' +
    'confirm both floor estimates recompute to ~1e-9, the SNR exceeds 1e3-1e4x at R* = 3.36, ' +
    'the resolved bias sits 36.7x below the tail bar, and the sign-change radius at Rc stays ' +
    'unresolved while the sign at R* is resolved. Naming / glossary headword only; supplies no ' +
    'new bound; RH open; no refereed bound is changed; NO QED.',
});

export const IMP97658_KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97658',
  proofSection: 'S-frontier',
  glosses: 'imp-97625',
  question:
    'imp-97625 assessed whether the imp-97605/imp-97580 far-field tail bias relBias(3.36) = ' +
    '-2.72746e-5 sits above or inside the edge-amplitude measurement floor -- what is the ' +
    'headword for this result?',
  headword: KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97625 finding that the ' +
    'far-field tail bias relBias(3.36) = -2.72746e-5 is resolvable ~1e4x above the ~1e-9 ' +
    'edge-amplitude floor (a genuine signal, not noise), while the exact sign-change radius at ' +
    'Rc = 1/a stays unresolvable there. The resolved bias sits 36.7x below the imp-97497 < 1e-3 ' +
    'tail bar. No bound moved; not a rigorous asymptotic; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97625 (the floor assessment this glosses); imp-97605 (the direct cross-validation and ' +
    'zero-crossing floor); imp-97580 (the relBias closed factor and sign change); imp-97497 ' +
    '(the far-field optimum and tail bar).',
});

export default IMP97658_KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97658_KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97658-headword-names-values-and-floor',
    why: 'The headword must name the resolved bias value, its floor, and the SNR magnitude -- ' +
      'the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97658_KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /-2\.72746e-5/.test(h.definition) &&
        /9\.42e-10/.test(h.definition) &&
        /2\.91e-9/.test(h.definition) &&
        /36\.7x/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97658-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97625.',
    holds: () =>
      IMP97658_KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97658_KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97658_KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      IMP97658_KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-97625',
  },
];

for (const assertion of IMP97658_KREIN_TAIL_BIAS_SIGNAL_VS_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97658-krein-tail-bias-signal-vs-floor-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
