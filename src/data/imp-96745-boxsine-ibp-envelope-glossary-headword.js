/**
 * @module imp-96745-boxsine-ibp-envelope-glossary-headword
 * @fileoverview imp-96745 -- import-light glossary/Concepts headword for the imp-96628
 *   result: the box sine-kernel lag-correlation finite-L correction DeltaCov_k(L) obeys the
 *   CERTIFIED two-sided envelope |DeltaCov_k(L)| <= C(k)/L^2 for all L > 0 and all lags
 *   k >= 2, with the explicit closed constant
 *   C(k) = (1/(8 pi^4)) [2/k^2 + 1/(k-1)^2 + 1/(k+1)^2 + V(k)],
 *   obtained by two integrations by parts on the oscillatory correction integral.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96638 bakes a headword for the imp-96617 SIGN finding (the correction oscillates,
 *   so no one-sided bound is possible) but names the imp-96628 upgrade only as a forward
 *   pointer -- it has no standalone entry of its own. This headword bakes the imp-96628
 *   certified envelope verbatim (no re-import, to stay import-light) as a standalone
 *   quick-lookup entry: a reader must not confuse the earlier MEASURED constant
 *   (C ~ 2.07e-3, Simpson-fit, uncertified) with this CERTIFIED closed-form C(k).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE MECHANISM: TWO INTEGRATIONS BY PARTS. The correction integral
 *   DeltaCov_k(L) = (1/(2 pi^2)) int_{-1}^{1} (1-|v|) cos(2 pi L (v+k)) / (v+k)^2 dv has a
 *   LINEAR phase in v (no stationary point), so plain IBP -- not stationary phase --
 *   supplies the decay. The FIRST IBP kills the naively-expected O(1/L) boundary term
 *   because the Bartlett triangle weight (1-|v|) VANISHES at the box edges v = +/-1. The
 *   SECOND IBP (split at the v=0 corner of the triangle weight) produces an explicit
 *   O(1/L^2) leading term B_k(w) = -2cos(wk)/k^2 + cos(w(k-1))/(k-1)^2 + cos(w(k+1))/(k+1)^2
 *   (w = 2 pi L, each |cos| <= 1) plus a remainder R_k bounded by a total-variation
 *   constant V(k) (the second derivative A'' is sign-definite on each piece for k >= 2).
 *   (b) THE CERTIFIED CONSTANT. Triangle-inequality on B_k + R_k gives the L-UNIFORM bound
 *   C(k) = (1/(8 pi^4)) [2/k^2 + 1/(k-1)^2 + 1/(k+1)^2 + V(k)] for k >= 2 (k=1 excluded:
 *   I_1 diverges logarithmically). At k=2 the bracket is exactly 3 (V(2)=1+7/18=1.3889), so
 *   C(2) = 3/(8 pi^4) = 3.850e-3, which DOMINATES the imp-96617 measured envelope 2.07e-3
 *   by a factor 1.86 (as expected: the triangle-inequality bound is looser than the
 *   numerically observed sup, since B_k and R_k rarely align in phase). C(k) decays with
 *   lag: C(3)=1.117e-3, C(4)=5.258e-4, C(5)=3.041e-4, C(6)=1.977e-4.
 *
 *   STATUS: a derivation that upgrades a measured constant to a certified one; it does not
 *   restore the one-sided-bound route imp-96617 closed (the envelope stays two-sided) and
 *   is conditional on the GUE sine-kernel / Montgomery pair correlation (UNPROVEN).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96628 verdict for quick reference. It
 *   establishes nothing new, instantiates no interval, closes no sub-gap, moves no
 *   unconditional bound. NO QED.
 *
 * @see imp-96628-boxsine-lagcorr-ibp-envelope.js (source: the derivation this glosses)
 * @see imp-96638-box-sine-kernel-two-sided-approx-glossary-headword.js (sibling headword for
 *   the imp-96617 sign finding that this envelope certifies the residual of)
 * @see imp-96617-finite-L-correction-sign.js (the sign measurement + measured C ~ 2.07e-3)
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the closed form Cov_k(inf) this corrects)
 *
 * Ticket: imp-96745 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The certified-envelope headword, baked verbatim (no re-import).
const BOXSINE_IBP_ENVELOPE_HEADWORD = Object.freeze({
  key: 'box-sine-kernel-two-ibp-certified-lagcorr-envelope',
  term:
    'imp-96628 certified envelope: the box sine-kernel lag-correlation finite-L ' +
    'correction obeys |DeltaCov_k(L)| <= C(k)/L^2 for all L > 0, all lags k >= 2, with ' +
    'C(k) = (1/(8 pi^4)) [2/k^2 + 1/(k-1)^2 + 1/(k+1)^2 + V(k)], obtained by two ' +
    'integrations by parts on the oscillatory correction integral',
  definition:
    'The finite-L correction DeltaCov_k(L) = Cov_k(L) - Cov_k(inf) to the box sine-kernel ' +
    'lag-k covariance equals (1/(2 pi^2)) int_{-1}^{1} (1-|v|) cos(2 pi L (v+k)) / (v+k)^2 ' +
    'dv. Two integrations by parts on this oscillatory (linear-phase) integral produce an ' +
    'explicit, L-UNIFORM upper bound on its magnitude: |DeltaCov_k(L)| <= C(k)/L^2, with ' +
    'the closed constant C(k) = (1/(8 pi^4)) [2/k^2 + 1/(k-1)^2 + 1/(k+1)^2 + V(k)] for ' +
    'k >= 2 (V(k) a total-variation constant, independent of L). This is a CERTIFIED bound, ' +
    'replacing the earlier imp-96617 MEASURED envelope constant C ~ 2.07e-3 (a Simpson fit ' +
    'over an L-period, never proven).',
  mechanism:
    'TWO INTEGRATIONS BY PARTS (two IBPs) on the oscillatory correction integral. The ' +
    'FIRST integration by parts kills the naively-expected O(1/L) boundary term ' +
    'because the Bartlett triangle weight (1-|v|) VANISHES at the box edges v = +/-1: ' +
    'A(+/-1) = 0. The SECOND integration by parts (splitting at the v=0 corner of the ' +
    'triangle weight) yields an explicit O(1/L^2) leading term B_k(w) = -2cos(wk)/k^2 + ' +
    'cos(w(k-1))/(k-1)^2 + cos(w(k+1))/(k+1)^2 (w = 2 pi L, every |cos| <= 1) plus a ' +
    'remainder R_k bounded by the total-variation constant V(k), since the second ' +
    'derivative of the amplitude is sign-definite on each piece for k >= 2. Triangle ' +
    'inequality on B_k + R_k, divided by w^2 = 4 pi^2 L^2, gives the certified ' +
    'C(k) = (1/(8 pi^4)) [2/k^2 + 1/(k-1)^2 + 1/(k+1)^2 + V(k)]. At k=2 the bracket is ' +
    'exactly 3 (V(2) = |0-1| + |-1/9-(-1/2)| = 1.3889), so C(2) = 3/(8 pi^4) = 3.850e-3, ' +
    'which DOMINATES the imp-96617 measured 2.07e-3 by a factor 1.86 -- the ' +
    'triangle-inequality bound is looser than the observed sup, as expected, since B_k and ' +
    'R_k rarely align in phase. C(k) decays with lag: C(3)=1.117e-3, C(4)=5.258e-4, ' +
    'C(5)=3.041e-4, C(6)=1.977e-4. The k=1 lag is excluded (I_1 diverges logarithmically).',
  verificationStatus:
    'A derivation (two IBPs) that upgrades a measured constant to a certified, L-uniform ' +
    'one; it does NOT reopen the one-sided-bound route imp-96617 closed (the envelope is ' +
    'still two-sided) and is conditional on the GUE sine-kernel / Montgomery pair ' +
    'correlation for the zeta zeros (UNPROVEN, GRH-flavored). Changes no unconditional ' +
    'bound; establishes no operator positivity; no refereed bound is changed; RH open; ' +
    'NO QED.',
});

export const IMP96745_BOXSINE_IBP_ENVELOPE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96745',
  proofSection: 'S-frontier',
  glosses: 'imp-96628',
  question:
    'imp-96617 measured the finite-L correction to the box sine-kernel lag correlation to ' +
    'be genuinely oscillatory in sign (closing the one-sided-bound route) but left its ' +
    'O(1/L^2) envelope constant only MEASURED (C ~ 2.07e-3, Simpson fit), not certified. ' +
    'imp-96628 later certified this envelope via two integrations by parts. Does that ' +
    'certified result have a standalone glossary headword of its own?',
  headword: BOXSINE_IBP_ENVELOPE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96628 verdict: ' +
    'the box sine-kernel lag-correlation finite-L correction DeltaCov_k(L) obeys the ' +
    'CERTIFIED two-sided envelope |DeltaCov_k(L)| <= C(k)/L^2 for all L > 0, all lags ' +
    'k >= 2, with C(k) = (1/(8 pi^4)) [2/k^2 + 1/(k-1)^2 + 1/(k+1)^2 + V(k)] obtained by ' +
    'two integrations by parts (first kills the O(1/L) boundary term via the vanishing ' +
    'Bartlett weight; second gives an explicit O(1/L^2) leading term plus a ' +
    'total-variation-bounded remainder). C(2) = 3/(8 pi^4) = 3.850e-3 dominates the ' +
    'imp-96617 measured 2.07e-3 (ratio 1.86). Establishes nothing new; instantiates no ' +
    'interval; moves no unconditional bound; conditional on the GUE sine kernel; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96628 (the two-IBP derivation and certified constant this glosses); imp-96617 ' +
    '(the sign finding and measured envelope this certifies the residual of); imp-96638 ' +
    '(sibling headword for the imp-96617 sign finding).',
});

export default IMP96745_BOXSINE_IBP_ENVELOPE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96745_BOXSINE_IBP_ENVELOPE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96745-headword-has-required-fields',
    why: 'The headword must name the two-IBP mechanism, the certified C(k) formula, and ' +
      'the dominance-over-measured ratio -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96745_BOXSINE_IBP_ENVELOPE_GLOSSARY_HEADWORD.headword;
      return (
        /two integrations by parts|two IBPs|IBP/i.test(h.mechanism) &&
        /Bartlett/.test(h.mechanism) &&
        /C\(k\) = \(1\/\(8 pi\^4\)\)/.test(h.definition) &&
        /3\.850e-3/.test(h.mechanism) &&
        /1\.86/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96745-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96745_BOXSINE_IBP_ENVELOPE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96745_BOXSINE_IBP_ENVELOPE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96745_BOXSINE_IBP_ENVELOPE_GLOSSARY_HEADWORD.verdict) &&
      IMP96745_BOXSINE_IBP_ENVELOPE_GLOSSARY_HEADWORD.glosses === 'imp-96628',
  },
];

for (const assertion of IMP96745_BOXSINE_IBP_ENVELOPE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96745-boxsine-ibp-envelope-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
