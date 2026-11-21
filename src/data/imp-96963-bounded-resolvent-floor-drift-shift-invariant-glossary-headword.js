/**
 * @module imp-96963-bounded-resolvent-floor-drift-shift-invariant-glossary-headword
 * @fileoverview imp-96963 -- import-light glossary/Concepts headword for the imp-96935
 *   finding IMP96935_BOUNDED_RESOLVENT_FLOOR_DRIFT_IS_SHIFT_INVARIANT: the imp-96911
 *   bounded-resolvent Ritz floor drift over the Nbig=24..240 ladder at 2a=ln3 does NOT
 *   depend on the shift m used to form the compressed resolvent R_N = P_N (K+m)^{-1} P_N.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96911 fixed the shift at m=1 and measured the top Ritz value eta drifting with
 *   Nbig, so the recovered floor lam1_ritz = 1/eta - m drifts down ~0.13 over the ladder
 *   -- the open coupled (N,T) truncation wall of IMP96889_SHIFTINVERT_REEXPRESSES_NT_RATE.
 *   imp-96935 swept m across {0.25,0.5,1,2,4,8,16,32} at every Nbig rung to check whether
 *   a different shift compresses that drift (floor stabilizes) or leaves it untouched.
 *   This headword bakes that verdict verbatim (no re-import of the imp-96935 module, to
 *   stay import-light) so a reader does not mistake "the raw eta drift shrinks with m" for
 *   "a bigger shift conditions the floor" -- the two are not the same thing.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE FLOOR IS SHIFT-INVARIANT PER RUNG. At every Nbig rung the recovered floor
 *   lam1_ritz = 1/eta - m is identical across the whole m sweep to 3-4 digits (Nbig=24:
 *   0.6071020 for every m in {0.25..32}), because eta ~ 1/(m+mu) where mu is the Ritz
 *   estimate of lam_min(K) -- the shift relabels eta, it does not change the eigenvalue
 *   it encodes.
 *   (b) THE COMPRESSING eta DRIFT IS A SCALE ILLUSION. The raw eta drift over the ladder
 *   shrinks from 0.2124 (m=0.25) to 0.0001 (m=32) purely because the eta scale itself
 *   shrinks like ~1/m; the 1/eta map amplifies the compressed eta drift straight back to
 *   the same floor swing, so "smaller eta drift" must not be read as "better conditioned".
 *   (c) THE FLOOR DRIFT ITSELF BARELY MOVES. floor(Nbig=24) - floor(Nbig=240) stays
 *   0.1320 (m=0.25) to 0.1293 (m=32): a 2.06% relative spread over a 128x change in m,
 *   log-log slope d(log|drift|)/d(log m) = -0.0042 ~ 0. The tiny decrease at large m runs
 *   the WRONG way for stabilization -- it comes from precision loss in the near-singular
 *   high-Nbig inversion at large shift, not convergence.
 *   (d) THE T-ARM IS ALSO SHIFT-INVARIANT. Raising T from 800 to 1600 at Nbig=240 lifts
 *   the floor essentially identically at m=1 (0.4756 -> 0.5108) and m=8 (0.4767 ->
 *   0.5108), so the shift buys no separation between the Nbig and T truncations.
 *   (e) NOT A CONDITIONING LEVER. A well-conditioned bounded resolvent is not reachable
 *   by shift alone; the wall is exactly the (N,T) truncation of imp-96889/imp-96827, not
 *   a shift-removable artifact.
 *
 *   STATUS: a sensitivity scout closing one lever (the shift m) on an already-open wall.
 *   Ritz value is an UPPER bound, so the floor is an upper estimate, not a certified
 *   lower bound. Not a proof, not a new bound, not an operator-positivity result. NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-96935-krein-shift-drift-sensitivity.js (source scout: the shift sweep and
 *   IMP96935_BOUNDED_RESOLVENT_FLOOR_DRIFT_IS_SHIFT_INVARIANT sub-gap this glosses)
 * @see imp-96911-krein-eta-nconvergence-scout.js (fixed m=1; the original Nbig/T floor
 *   drift measurement this scout re-checks across shifts)
 * @see imp-96889-krein-shiftinvert-katotemple-scout.js (the bounded shift-invert
 *   reformulation and the open (N,T) rate, IMP96889_SHIFTINVERT_REEXPRESSES_NT_RATE)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (the open t-truncation rate
 *   the floor bias couples to)
 *
 * Ticket: imp-96963 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The shift-invariance headword, baked verbatim (no re-import).
const BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_HEADWORD = Object.freeze({
  key: 'bounded-resolvent-floor-drift-is-shift-invariant',
  term:
    'imp-96935 finding IMP96935_BOUNDED_RESOLVENT_FLOOR_DRIFT_IS_SHIFT_INVARIANT: the ' +
    'imp-96911 bounded-resolvent Ritz floor drift over Nbig=24..240 at 2a=ln3 does not ' +
    'depend on the shift m -- varying m over {0.25..32} leaves the floor drift at ~0.13 ' +
    '(2.06% spread, log-log slope ~0), so a well-conditioned resolvent is not reachable ' +
    'by shift alone',
  definition:
    'At 2a=ln3, N=16, T=800, the compressed bounded resolvent R_N = P_N (K+m)^{-1} P_N ' +
    'has top Ritz value eta, and the recovered floor is lam1_ritz = 1/eta - m. Sweeping ' +
    'm over {0.25,0.5,1,2,4,8,16,32} shows the floor at each Nbig rung is identical to ' +
    '3-4 digits across the whole sweep (Nbig=24: 0.6071020 for every m), because ' +
    'eta ~ 1/(m+mu) with mu the Ritz estimate of lam_min(K), so 1/eta-m always recovers ' +
    'mu regardless of the shift used to reach it. The floor DRIFT over the ladder -- ' +
    'floor(Nbig=24) minus floor(Nbig=240) -- stays 0.1320 (m=0.25) to 0.1293 (m=32), a ' +
    '2.06% relative spread over a 128x change in m.',
  mechanism:
    'The raw eta drift over the Nbig ladder does shrink sharply with m (0.2124 at ' +
    'm=0.25 down to 0.0001 at m=32), which could look like improved conditioning at a ' +
    'larger shift. But that shrinkage is a scale illusion: eta itself scales like ~1/m, ' +
    'so the 1/eta map used to recover the floor amplifies the compressed eta drift back ' +
    'up to the same floor swing. The actual floor drift is shift-invariant (slope ' +
    '-0.0042 in log m, essentially flat), and the small residual 2% decrease at large m ' +
    'runs the WRONG way for stabilization -- it is precision loss in the near-singular ' +
    'high-Nbig inversion at large shift, not convergence. Raising T from 800 to 1600 at ' +
    'Nbig=240 reopens the drift identically at m=1 and m=8 (agreeing to 4 digits at ' +
    'T=1600), so the shift buys no separation between the Nbig and T truncations either. ' +
    'The wall stays the open coupled (N,T) resolvent-truncation wall of imp-96889/' +
    'imp-96827, not a shift-removable conditioning artifact.',
  verificationStatus:
    'Shift sweep over m in {0.25,0.5,1,2,4,8,16,32} at fixed N=16 across the Nbig=24..240 ' +
    'ladder (T=800), plus a T=800-vs-1600 cross-check at Nbig=240 for two shifts, reusing ' +
    'the imp-96911/imp-96889/imp-96768 pole-free Gegenbauer Galerkin build (tmp/imp-96935-' +
    'shift-drift-sensitivity.py, /tmp/rhvenv scipy 1.18). A single sensitivity scout ' +
    'closing the shift lever; Ritz value is an upper bound so the floor is an upper ' +
    'estimate, not a certified lower bound; establishes no operator positivity; ' +
    'interval-rigorous reach stays 2a<=0.96; RH open; no refereed bound is changed; ' +
    'NO QED.',
});

export const IMP96963_BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96963',
  proofSection: 'S-frontier',
  glosses: 'imp-96935',
  question:
    'imp-96935 swept the shift m over {0.25..32} at every Nbig rung of the imp-96911 ' +
    'bounded-resolvent Ritz floor drift at 2a=ln3. Does a larger shift compress the ' +
    'drift (floor stabilizes), or is the coupled (N,T) truncation wall shift-invariant?',
  headword: BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96935 ' +
    'finding IMP96935_BOUNDED_RESOLVENT_FLOOR_DRIFT_IS_SHIFT_INVARIANT: the recovered ' +
    'floor at each Nbig rung is shift-invariant (eta ~ 1/(m+mu) so 1/eta-m always ' +
    'recovers mu), the shrinking raw eta drift with larger m is a scale illusion (eta ' +
    'itself scales ~1/m), and the actual floor drift stays ~0.13 with a 2.06% spread ' +
    'and a ~0 log-log slope across a 128x change in m -- with the small residual motion ' +
    'running the wrong way (large-m precision loss, not convergence). A well-conditioned ' +
    'resolvent is therefore not reachable by shift alone; the wall stays the open ' +
    'coupled (N,T) truncation of imp-96889/imp-96827. Establishes nothing; instantiates ' +
    'no interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96935 (the shift-sweep scout and IMP96935_BOUNDED_RESOLVENT_FLOOR_DRIFT_IS_' +
    'SHIFT_INVARIANT sub-gap this glosses); imp-96911 (the original m=1 Nbig/T floor ' +
    'drift measurement); imp-96889 (the bounded shift-invert reformulation and the open ' +
    '(N,T) rate).',
});

export default IMP96963_BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96963_BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96963-headword-has-required-fields',
    why: 'The headword must name both the shift-invariance mechanism (eta ~ 1/(m+mu)) ' +
      'and the scale-illusion distinction -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96963_BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_GLOSSARY_HEADWORD.headword;
      return (
        /shift[-_]invariant/i.test(h.term) &&
        /eta ~ 1\/\(m\+mu\)/.test(h.definition) &&
        /scale illusion/i.test(h.mechanism) &&
        /2\.06%/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96963-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96963_BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96963_BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96963_BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_GLOSSARY_HEADWORD.verdict) &&
      IMP96963_BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_GLOSSARY_HEADWORD.glosses === 'imp-96935',
  },
];

for (const assertion of IMP96963_BOUNDED_RESOLVENT_FLOOR_DRIFT_SHIFT_INVARIANT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96963-bounded-resolvent-floor-drift-shift-invariant-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
