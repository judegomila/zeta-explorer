/**
 * @module imp-97258-two-parity-residual-sign-law-glossary-headword
 * @fileoverview imp-97258 -- import-light glossary/Concepts headword recording the imp-97156
 *   two-parity residual sign law: the imp-97140 leading Liouville-parity rule for
 *   sign(r(b)) = (-1)^(omega(b)+1) is UNIVERSALLY taken over by a subleading Moebius-parity
 *   rule sign(r(b)) = (-1)^omega(b) = mu(b) at every primorial P5..P8 (b = 2310, 30030,
 *   510510, 9699690) and at near-primorial squarefree smooth moduli (570570, 690690). The
 *   takeover is driven by packing omega distinct SMALL primes (maximal smoothness of a
 *   squarefree modulus), not by omega parity alone: a repeated-prime-power control
 *   (b = 1021020 = 2^2.3.5.7.11.13.17) deepens |r| to the same scale but keeps the leading sign.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) TWO COMPETING PARITY TERMS. r(b) = F_arith(b)/(phi(b) b) - kappa_arith carries a
 *   LEADING term whose sign follows Liouville parity, sign(r(b)) = (-1)^(omega(b)+1), and a
 *   SUBLEADING term whose sign follows Moebius parity, sign(r(b)) = (-1)^omega(b) = mu(b)
 *   (since a squarefree modulus has lambda(b) = mu(b) up to the always-opposite sign of the
 *   corrected leading rule). At generic b in [200,3000] the leading term dominates (holds for
 *   2799/2801 of that range, imp-97140); at maximally smooth squarefree b the subleading term
 *   takes over instead.
 *   (b) THE TAKEOVER IS UNIVERSAL ACROSS PRIMORIALS, NOT A COINCIDENCE. Every primorial P5..P8
 *   flips: b = 2310 (omega=5, |r|=1.068e-6), 30030 (omega=6, |r|=3.598e-7), 510510 (omega=7,
 *   |r|=3.471e-8), 9699690 (omega=8, |r|=2.485e-9) -- each observed sign is the literal Moebius
 *   value mu(b) = (-1)^omega(b), exactly opposite the leading Liouville rule. |r| collapses
 *   ~10x per added small prime (cancellation depth 632 -> 2.72e5 relative to the omega=1 scale).
 *   (c) SMOOTHNESS, NOT EXACT-PRIMORIALITY, IS THE DRIVER. Near-primorial squarefree moduli
 *   570570 = 2.3.5.7.11.13.19 and 690690 = 2.3.5.7.11.13.23 (omega=7, swapping the last small
 *   prime for a slightly larger one) also flip. The control 1021020 = 2^2.3.5.7.11.13.17
 *   (omega=7 via a repeated prime power, not a new distinct prime) does NOT flip -- it deepens
 *   |r| to the P8 scale yet keeps the leading sign. So the takeover needs new DISTINCT small
 *   primes, not omega parity by itself.
 *   (d) STATUS: measurement only. No uniform remainder bound is supplied by this law (the
 *   imp-97096 sub-gap stays open); it sharpens what any future explicit remainder bound must
 *   control -- two competing parity terms whose crossover is governed by smoothness.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording a measured sign law.
 *   Not a proof, not a new bound, no uniform remainder supplied. NO QED.
 *
 * @see imp-97156-route-m-primorial-signlaw-extension.js (source measurement: primorial P5..P8
 *   ladder, near-primorial smooth-modulus extension, repeated-prime-power control)
 * @see imp-97140-route-m-fixed-omega-residual-cohorts.js (the leading Liouville-parity sign law
 *   being extended, and the corrected orientation (-1)^(omega+1))
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith + the still-open
 *   explicit-remainder sub-gap this law does not close)
 *
 * Ticket: imp-97258 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The two-parity residual sign law headword, baked verbatim (no re-import).
const TWO_PARITY_RESIDUAL_SIGN_LAW_HEADWORD = Object.freeze({
  key: 'two-parity-residual-sign-law-imp97156-primorial-takeover',
  term:
    'imp-97156 two-parity residual sign law: the imp-97140 leading Liouville-parity rule ' +
    'sign(r(b)) = (-1)^(omega(b)+1) is universally taken over by the subleading Moebius-parity ' +
    'rule sign(r(b)) = (-1)^omega(b) = mu(b) at every primorial and at near-primorial squarefree ' +
    'smooth moduli',
  definition:
    'r(b) = F_arith(b)/(phi(b) b) - kappa_arith has two competing parity-dependent terms: a ' +
    'LEADING term following Liouville parity (-1)^(omega(b)+1), dominant at generic b (2799/2801 ' +
    'of b in [200,3000], imp-97140), and a SUBLEADING term following Moebius parity mu(b) = ' +
    '(-1)^omega(b) that dominates instead at maximally smooth squarefree moduli. Every primorial ' +
    'P5..P8 (b = 2310, 30030, 510510, 9699690) flips to the subleading rule, with |r| collapsing ' +
    '~10x per added small prime (1.068e-6 -> 3.598e-7 -> 3.471e-8 -> 2.485e-9).',
  mechanism:
    'The takeover is governed by smoothness (packing omega distinct SMALL primes), not by omega ' +
    'parity alone. Near-primorial squarefree moduli 570570 = 2.3.5.7.11.13.19 and 690690 = ' +
    '2.3.5.7.11.13.23 (omega=7) also flip to the Moebius-parity sign. The control 1021020 = ' +
    '2^2.3.5.7.11.13.17 (omega=7 via a repeated prime power instead of a new distinct prime) ' +
    'deepens |r| to the same P8 scale but keeps the LEADING sign -- confirming the flip needs ' +
    'new distinct small primes, not omega parity by itself.',
  verificationStatus:
    'Re-cited from the imp-97156 measurement module ' +
    '(src/data/imp-97156-route-m-primorial-signlaw-extension.js), independent O(b) Kahan-' +
    'compensated coprime-sum recompute agreeing to ~1e-14 at b=9699690. Naming / glossary ' +
    'headword only; supplies no uniform remainder bound (the imp-97096 sub-gap stays open); no ' +
    'bound moved; RH open; no refereed bound is changed; NO QED.',
});

export const IMP97258_TWO_PARITY_RESIDUAL_SIGN_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97258',
  proofSection: 'Route-M',
  glosses: 'imp-97156',
  question:
    'imp-97156 measured that the imp-97140 leading Liouville-parity residual sign law flips at ' +
    'every primorial P5..P8 and at near-primorial smooth moduli, with the flipped sign equal to ' +
    'the literal Moebius mu(b). What is the headword for this two-parity takeover, and does it ' +
    'move any bound?',
  headword: TWO_PARITY_RESIDUAL_SIGN_LAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97156 two-parity ' +
    'residual sign law: leading Liouville lambda-parity sign(r) = (-1)^(omega+1) dominates ' +
    'generically, but subleading Moebius-parity sign(r) = mu(b) = (-1)^omega universally takes ' +
    'over at primorials P5..P8 and near-primorial smooth moduli, driven by packing distinct ' +
    'small primes (smoothness), not omega parity alone. No bound moved; the imp-97096 sub-gap ' +
    'stays open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97156 (the primorial P5..P8 ladder, near-primorial extension, and repeated-prime-power ' +
    'control this glosses); imp-97140 (the leading Liouville-parity sign law being extended); ' +
    'imp-97096 (the still-open explicit-remainder sub-gap).',
});

export default IMP97258_TWO_PARITY_RESIDUAL_SIGN_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97258_TWO_PARITY_RESIDUAL_SIGN_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97258-headword-cites-primorial-ladder-and-mechanism',
    why: 'The headword must name the primorial takeover magnitudes and the smoothness ' +
      'mechanism (distinct small primes vs repeated prime power) -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP97258_TWO_PARITY_RESIDUAL_SIGN_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /2310/.test(h.definition) &&
        /9699690/.test(h.definition) &&
        /mu\(b\)/.test(h.definition) &&
        /distinct/i.test(h.mechanism) &&
        /1021020/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97258-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, sub-gap left open, no QED, no-refereed-bound-change line ' +
      'present.',
    holds: () =>
      IMP97258_TWO_PARITY_RESIDUAL_SIGN_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97258_TWO_PARITY_RESIDUAL_SIGN_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97258_TWO_PARITY_RESIDUAL_SIGN_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP97258_TWO_PARITY_RESIDUAL_SIGN_LAW_GLOSSARY_HEADWORD.glosses === 'imp-97156',
  },
];

for (const assertion of IMP97258_TWO_PARITY_RESIDUAL_SIGN_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97258-two-parity-residual-sign-law-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
