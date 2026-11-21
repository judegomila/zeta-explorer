/**
 * @module imp-97634-mcm-onset-b4-ceiling-glossary-headwords
 * @fileoverview imp-97634 -- import-light glossary/Concepts headwords for two Route-M terms used
 *   across the imp-97432/imp-97583/imp-97601/imp-97606 cohort but never given a glossary entry:
 *   "MCM onset" (the first omega where the multiplicative-cascade monotonicity hypothesis first
 *   fails) and "b/4 ceiling" (the two-sided band |E1(b)| <= b/4 the primorial remainder stays
 *   inside), mirroring the imp-97548 Lehmann-Maehly window-gap headword format.
 *
 *   HEADWORD 1 -- MCM ONSET.
 *   -----------------------------------------------
 *   (a) DEFINITION. MCM ("multiplicative complete monotonicity") at order omega asks
 *   (D_p1...D_pj h)(x) >= 0 for every squarefree prime set of size omega = j and x >= 1, where
 *   h(m) = g(m)/m and g is the Glaisher-Kinkelin hyperfactorial log-sum. imp-97432 proved MCM is
 *   FALSE and imp-97583 located the exact onset by direct-kernel measurement across omega = 6..15
 *   at the worst case (the primorial p_omega# at x=1): MCM holds through omega = 10
 *   (T(p_10#) = +4.782772e-4, the shallowest positive margin) and first fails at omega = 11
 *   (T(p_11#) = -9.623658e-4 < 0, b = p_11# = 200560490130).
 *   (b) THE SURROGATE ONSET IS ONE ORDER EARLIER. The smooth surrogate difference alone goes
 *   negative at omega = 10 already (-5.403315e-4); the bounded remainder correction
 *   (saturating at +1.0186e-3) buys exactly one order, lifting the full-h value positive through
 *   omega = 10 but no longer at omega = 11.
 *   (c) DOES NOT TOUCH THE CEILING. Past onset the failure deepens monotonically toward the
 *   primorial limit -e^{-gamma}/12 + Rcorr = -0.045770, staying deep inside the b/4 ceiling band
 *   [-1/4, 1/4] throughout -- MCM (non-negativity) was strictly stronger than the ceiling.
 *
 *   HEADWORD 2 -- b/4 CEILING.
 *   -----------------------------------------------
 *   (a) DEFINITION. The two-sided class-uniform bound |E1(b)| <= b/4 on the Theorem-2 remainder
 *   E1(b) = L1(b) - phi(b) b((1/2) log b - 1/4) (imp-97133/imp-97158 notation), replacing the
 *   looser b(log b + 2)-scaled bound with the tight class-uniform constant
 *   C2star(b) = b/4 + 2^omega(b) (log b + 2) (imp-97208/imp-97269).
 *   (b) SHARP ON PRIMES. On a prime b only the d=1 Moebius divisor survives, giving the exact
 *   asymptotic E1(prime b) = -b/4 + (1/12) log b + ln A + O(1/b), so |E1(prime b)| < b/4 strictly
 *   and the saturation ratio r*(b) = |E1(b)|/C2star(b) -> 1 from below (0.639 at 101, 0.991 at
 *   9973, 0.9989 at 99991) -- the b/4 leading term is tight exactly where it binds.
 *   (c) SURVIVES THE MCM REFUTATION. imp-97432 showed MCM implies the ceiling but is not implied
 *   by it: MCM failing at omega = 11 leaves |T(p_11#)| = 9.7e-4, deep inside the b/4 band, so the
 *   b/4 ceiling for omega >= 11 stays open and numerically safe, not refuted.
 *
 *   STATUS: documentation only -- Concepts glossary headwords recording already-established
 *   Route-M results. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (source: MCM refuted at p_11#,
 *   b/4 ceiling survives, primorial limit -e^{-gamma}/12)
 * @see imp-97583-route-m-mcm-onset-omega11-primorial.js (source: onset ladder omega=6..15,
 *   surrogate-onset-buys-one-order measurement)
 * @see imp-97601-route-m-mcm-margin-collapse-rate-law.js (margin collapse past onset)
 * @see imp-97606-route-m-mcm-omega10-primorial-extremality-broadened.js (primorial extremality
 *   at omega=10)
 * @see imp-97208-route-m-theorem2-tighter-remainder.js (b/4 ceiling class-uniform bound,
 *   prime-class exact asymptotic)
 * @see imp-97269-route-m-e1-quarter-b-class-uniformity-crosscheck.js (b/4 saturation ratio
 *   cross-check across classes)
 *
 * Ticket: imp-97634 (meta, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import { IMP97432_RESULTS } from './imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js';
import { IMP97583_RESULTS } from './imp-97583-route-m-mcm-onset-omega11-primorial.js';

// Headword 1: MCM onset, baked verbatim from the imp-97583 measurement (no re-import of the full leaf).
const MCM_ONSET_HEADWORD = Object.freeze({
  key: 'mcm-onset-imp97583',
  term:
    'MCM onset = omega=11: the first omega where the Route-M multiplicative-cascade ' +
    'monotonicity hypothesis (D_p1...D_pj h >= 0) first fails, at the primorial worst case ' +
    'p_11# = 200560490130',
  definition:
    'MCM holds through omega = 10 (T(p_10#) = +4.782772e-4, the shallowest positive margin) and ' +
    'first fails at omega = 11 (T(p_11#) = -9.623658e-4 < 0). The surrogate-only difference goes ' +
    'negative one order earlier, at omega = 10 (-5.403315e-4); the bounded R-correction ' +
    '(saturating at +1.0186e-3) buys exactly that one order.',
  mechanism:
    'Past the onset the failure deepens monotonically toward the primorial limit ' +
    '-e^{-gamma}/12 + Rcorr = -0.045770, staying far inside the b/4 ceiling band [-1/4, 1/4] -- ' +
    'MCM (non-negativity) was strictly stronger than the b/4 ceiling it was meant to establish, ' +
    'so its failure kills the MCM route without touching the ceiling.',
  verificationStatus:
    'Re-cited from imp-97432 (proof: MCM refuted) and imp-97583 (measurement: exact onset ' +
    'located at omega=11 across omega=6..15). Naming / glossary headword only; supplies no new ' +
    'bound; RH open; no refereed bound is changed; NO QED.',
});

// Headword 2: b/4 ceiling, baked verbatim from the imp-97208/imp-97269 class-uniform bound.
const B4_CEILING_HEADWORD = Object.freeze({
  key: 'b4-ceiling-imp97208',
  term:
    'b/4 ceiling = the two-sided class-uniform bound |E1(b)| <= b/4 on the Theorem-2 remainder ' +
    'E1(b), tight on the prime class',
  definition:
    'E1(b) = L1(b) - phi(b) b((1/2) log b - 1/4) satisfies the class-uniform bound ' +
    '|E1(b)| <= C2star(b) = b/4 + 2^omega(b) (log b + 2), roughly 4 log b tighter than the older ' +
    'b(log b + 2)-scaled bound. On a prime b the exact asymptotic ' +
    'E1(prime b) = -b/4 + (1/12) log b + ln A + O(1/b) makes |E1(prime b)| < b/4 strictly, with ' +
    'the saturation ratio r*(b) -> 1 from below (0.639 at 101, 0.991 at 9973, 0.9989 at 99991).',
  mechanism:
    'The b/4 ceiling survives the MCM refutation: MCM implies the ceiling but is strictly ' +
    'stronger than it, so MCM failing at the first counterexample b = p_11# ' +
    '(|T(p_11#)| = 9.7e-4, deep inside [-1/4, 1/4]) does not refute the ceiling, which stays ' +
    'open and numerically safe for omega >= 11 (primorial limit -e^{-gamma}/12 + Rcorr = -0.0458).',
  verificationStatus:
    'Re-cited from imp-97208 (class-uniform bound, prime-class exact asymptotic) and imp-97269 ' +
    '(saturation-ratio cross-check). Naming / glossary headword only; supplies no new bound; ' +
    'RH open; no refereed bound is changed; NO QED.',
});

export const IMP97634_MCM_ONSET_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97634',
  proofSection: 'S-frontier',
  glosses: 'imp-97583',
  question: 'At what omega does the Route-M MCM hypothesis first fail?',
  headword: MCM_ONSET_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97583 measurement: MCM ' +
    'holds through omega = 10 and first fails at omega = 11 (b = p_11# = 200560490130); the ' +
    'smooth surrogate fails one order earlier and the bounded R-correction buys exactly that one ' +
    'order. No bound moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted, ceiling survives); ' +
    'imp-97583-route-m-mcm-onset-omega11-primorial.js (onset ladder, omega=6..15).',
});

export const IMP97634_B4_CEILING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97634',
  proofSection: 'S-frontier',
  glosses: 'imp-97208',
  question: 'What is the b/4 ceiling, and does the MCM refutation touch it?',
  headword: B4_CEILING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97208/imp-97269 ' +
    'class-uniform bound |E1(b)| <= b/4 + 2^omega(b)(log b + 2), tight on primes, and records ' +
    'that the imp-97432 MCM refutation does not touch it (the first counterexample stays deep ' +
    'inside the band). No bound moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97208-route-m-theorem2-tighter-remainder.js (class-uniform bound, prime-class exact ' +
    'asymptotic); imp-97269-route-m-e1-quarter-b-class-uniformity-crosscheck.js (saturation-ratio ' +
    'cross-check).',
});

export default {
  mcmOnset: IMP97634_MCM_ONSET_GLOSSARY_HEADWORD,
  b4Ceiling: IMP97634_B4_CEILING_GLOSSARY_HEADWORD,
};

// -- Tripwire assertions ------------------------------------------------------
const IMP97634_ASSERTIONS = [
  {
    id: 'imp97634-mcm-onset-headword-names-onset-and-surrogate',
    why: 'The MCM onset headword must name both the full-h onset (omega=11) and the earlier ' +
      'surrogate onset (omega=10) plus the one-order R-correction reprieve.',
    holds: () => {
      const h = IMP97634_MCM_ONSET_GLOSSARY_HEADWORD.headword;
      return (
        /omega=11/.test(h.term) &&
        /4\.782772e-4/.test(h.definition) &&
        /-9\.623658e-4/.test(h.definition) &&
        /omega = 10/.test(h.definition) &&
        /buys exactly that one order/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97634-mcm-onset-consistent-with-imp97583-source-figures',
    why: 'The re-cited onset figures must match the imp-97583 source module exactly -- this is a ' +
      'glossary headword, not an independent re-derivation.',
    holds: () =>
      IMP97583_RESULTS.onsetOmega === 11 &&
      IMP97583_RESULTS.lastHoldingOmega === 10 &&
      Math.abs(IMP97583_RESULTS.lastHoldingMargin - 4.782772e-4) < 1e-9 &&
      Math.abs(IMP97583_RESULTS.firstFailValue - -9.623658e-4) < 1e-9 &&
      IMP97583_RESULTS.rCorrectionBuysOrders === 1,
  },
  {
    id: 'imp97634-b4-ceiling-headword-names-bound-and-survival',
    why: 'The b/4 ceiling headword must name the class-uniform bound and record that the MCM ' +
      'refutation does not breach it.',
    holds: () => {
      const h = IMP97634_B4_CEILING_GLOSSARY_HEADWORD.headword;
      return (
        /b\/4/.test(h.term) &&
        /C2star\(b\) = b\/4/.test(h.definition) &&
        /survives the MCM refutation/.test(h.mechanism) &&
        /deep inside/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97634-b4-ceiling-consistent-with-imp97432-source-figures',
    why: 'The re-cited ceiling-survival figures must match the imp-97432 source module exactly.',
    holds: () =>
      IMP97432_RESULTS.mcmRefuted.Tvalue < 0 &&
      Math.abs(IMP97432_RESULTS.mcmRefuted.Tvalue - -9.624e-4) < 1e-6 &&
      Math.abs(IMP97432_RESULTS.ceilingSurvives.primorialLimit - -0.046788) < 1e-5,
  },
  {
    id: 'imp97634-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present on both ' +
      'headwords.',
    holds: () =>
      IMP97634_MCM_ONSET_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      IMP97634_B4_CEILING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97634_MCM_ONSET_GLOSSARY_HEADWORD.verdict) &&
      /NO QED/.test(IMP97634_B4_CEILING_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97634_MCM_ONSET_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97634_B4_CEILING_GLOSSARY_HEADWORD.verdict),
  },
];

for (const assertion of IMP97634_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97634-mcm-onset-b4-ceiling-glossary-headwords assertion failed: ${assertion.id}`,
    );
  }
}
