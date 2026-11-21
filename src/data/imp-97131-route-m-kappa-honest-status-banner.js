/**
 * @module imp-97131-route-m-kappa-honest-status-banner
 * @fileoverview imp-97131 -- import-light honest-status banner recording that the Route M
 *   first-moment lower-bound constant kappa (in F(b) >= kappa phi(b) b) is MEASURED, not proved,
 *   because the whole chain rests on an OPEN varying-modulus Bettin-Conrey mean value.
 *
 *   WHY A BANNER (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97071 reduced the Route M mean-square lower companion to a strictly weaker first-moment
 *   requirement F(b) >= kappa phi(b) b via an exact Cauchy-Schwarz step. imp-97096 then proved the
 *   arithmetic half of kappa EXACTLY: kappa_arith = (3/2)C - 3/8 = 0.5704960511. imp-97097 showed
 *   the cotangent half kappa_cot ~ +0.12 is carried entirely by a varying-modulus Vasyunin average
 *   whose fixed-modulus reciprocity gives only zero (an a <-> b-a antisymmetry), leaving the whole
 *   leading moment open. imp-97116 recast that open piece as an inverse-line Bettin-Conrey
 *   cotangent-sum average and dominated it by a cancellation-free absolute-value sum (MEASURED
 *   ~0.14 phi(b) b, comfortably below kappa_arith), but the explicit constant is still MEASURED,
 *   not proved -- the sole remaining input is a uniform bound on the frequency of small modular
 *   inverses b-inverse mod a (a Bettin-Conrey / Kloosterman-type mean value), which is NOT
 *   elementary. This banner states that status plainly wherever the Route M kappa>0 chain is
 *   presented, so a reader does not read kappa~0.696 as an established constant.
 *
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (Cauchy-Schwarz reduction to the first moment)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (kappa_arith = (3/2)C - 3/8, EXACT)
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (fixed-modulus half = 0; the open varying-modulus half)
 * @see imp-97116-route-m-cotangent-varying-modulus-abs-value-reduction.js (abs-value reduction; c MEASURED not proved)
 * @see imp-97107-cauchy-schwarz-mean-square-to-first-moment-glossary-headword.js (sibling glossary headword)
 *
 * Ticket: imp-97131 (content, medium, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

export const IMP97131_KAPPA_STATUS = Object.freeze({
  question:
    'Is the Route M first-moment constant kappa (F(b) >= kappa phi(b) b, kappa = kappa_arith + ' +
    'kappa_cot ~ 0.696) an established lower bound, or does it still rest on an open estimate?',
  kappaArithExact: 0.5704960511308594, // imp-97096: (3/2)C - 3/8, PROVED
  kappaArithProved: true,
  kappaCotMeasured: 0.121, // imp-97097/imp-97116: varying-modulus cotangent half, MEASURED not proved
  kappaCotProved: false,
  kappaTotalMeasured: 0.696,
  restsOn:
    'imp-97116 varying-modulus inverse-line Bettin-Conrey mean value: a cancellation-free ' +
    'absolute-value bound A(b) <= c phi(b) b (c < kappa_arith) with c MEASURED ~0.14 but not ' +
    'proved; the sole remaining input is a uniform bound on the frequency of small modular ' +
    'inverses b-inverse mod a (Bettin-Conrey / Kloosterman-type, NOT elementary).',
  anyBoundMoved: false,
});

export const IMP97131_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. The Route M first-moment lower bound ' +
  'F(b) >= kappa phi(b) b (kappa ~ 0.696) is NOT yet rigorous: kappa splits into an EXACT ' +
  'arithmetic part kappa_arith = (3/2)C - 3/8 = 0.5705 (imp-97096, PROVED) plus a cotangent part ' +
  'kappa_cot ~ +0.12 that lives entirely in an OPEN varying-modulus Bettin-Conrey mean value ' +
  '(imp-97097, imp-97116) which reciprocity alone does not close. kappa > 0 remains MEASURED, ' +
  'not proved, and the whole Route M lower-companion chain (imp-97071) rests on that open ' +
  'estimate. No bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97131_ASSERTIONS = [
  {
    id: 'imp97131-kappa-split-matches-committed-constants',
    holds: () =>
      Math.abs(IMP97131_KAPPA_STATUS.kappaArithExact - 0.5704960511308594) < 1e-12 &&
      IMP97131_KAPPA_STATUS.kappaArithProved === true &&
      IMP97131_KAPPA_STATUS.kappaCotProved === false &&
      Math.abs(
        IMP97131_KAPPA_STATUS.kappaArithExact +
          IMP97131_KAPPA_STATUS.kappaCotMeasured -
          IMP97131_KAPPA_STATUS.kappaTotalMeasured,
      ) < 0.01,
    why:
      'The status object must record the EXACT proved arithmetic part, the MEASURED unproved ' +
      'cotangent part, and their sum matching the committed kappa~0.696 total.',
  },
  {
    id: 'imp97131-honesty-gate-no-qed',
    holds: () =>
      IMP97131_KAPPA_STATUS.anyBoundMoved === false &&
      /NO QED/.test(IMP97131_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97131_HONEST_BANNER) &&
      /RH open/.test(IMP97131_HONEST_BANNER) &&
      /MEASURED/.test(IMP97131_HONEST_BANNER) &&
      /not proved/.test(IMP97131_HONEST_BANNER),
    why:
      'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, and the ' +
      'MEASURED-not-proved status stated explicitly.',
  },
];

for (const assertion of IMP97131_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97131-route-m-kappa-honest-status-banner assertion failed: ${assertion.id}`,
    );
  }
}

export default {
  status: IMP97131_KAPPA_STATUS,
  banner: IMP97131_HONEST_BANNER,
};
