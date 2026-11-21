/**
 * @module imp-96179-route-l-power-law-reach-glossary-headword
 * @fileoverview imp-96179 -- import-light glossary/Concepts headword for the imp-96149
 *   Route L (Li-Herglotz-CMV) power-law reach refinement: the detector height reach
 *   gamma_det(N) ~ 2.212 * N^0.786 and the clean-prefix height reach
 *   gamma_reach(N) ~ 13.55 * N^0.367 are both SUBLINEAR power laws, superseding the
 *   stale imp-96059 linear "gamma_{N/10}" string.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96149 refit the Route L reach data in log-log and found both measured series are
 *   power laws, not the linear law imp-96059 had recorded. A reader landing on imp-96149
 *   cold has no quick-lookup definition of what changed and why Route L stays a fixed-cost
 *   detector rather than becoming a lever. This headword bakes that refinement VERBATIM
 *   (no re-import of the imp-96149 module, to stay import-light) as a standalone lookup
 *   entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For the Route L (Li-Herglotz-CMV) off-line-displacement detector at truncation order N,
 *   the height reach is a POWER law in N, not linear:
 *     - detector reach:      gamma_det(N)   ~ 2.212158 * N^0.786358   (r2 = 0.976)
 *     - clean-prefix reach:  gamma_reach(N) ~ 13.550752 * N^0.367443  (r2 = 0.979)
 *   Both are sublinear (exponents < 1), so the earlier imp-96059 linear string
 *   "gamma_{N/10}" is stale and refuted by direct power-law fit.
 *
 *   MECHANISM: extrapolating each law to the Platt-Trudgian verified height
 *   T0 ~ 3.0001e12 needs N ~ 3.29e15 (detector) to N ~ 7.5e30 (clean-prefix) -- 1 to 16
 *   orders of magnitude beyond the ~1.24e14 the refuted linear law implied, and
 *   incomparably above what the verified-zero route already covers. The detector
 *   (off-line sensitivity) reaches a given height at a far lower N than the clean-prefix
 *   (true-zero reproduction) needs, but both diverge astronomically at PT height.
 *
 *   STATUS: a REFIT restating imp-96149's measured power laws only. It corrects a stale
 *   linear-reach string but proves no new bound and settles nothing about RH. Route L
 *   remains a fixed-cost, verified-height-dominated detector, not a lever.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96149 power-law reach refinement for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves
 *   no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96149-route-l-detector-reach-law-fit (source: the power-law refit this glosses)
 * @see imp-96059-detector-reach-ladder-viz-data (the stale linear-reach string this corrects)
 *
 * Ticket: imp-96179 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The Route L power-law reach headword, baked verbatim (no re-import).
const ROUTE_L_POWER_LAW_REACH_HEADWORD = Object.freeze({
  key: 'route-l-power-law-reach-detector-fixed-cost',
  term:
    'imp-96149 Route L power-law reach: gamma_det(N) ~ 2.212 * N^0.786 (detector) and ' +
    'gamma_reach(N) ~ 13.55 * N^0.367 (clean-prefix), both sublinear, superseding the ' +
    'stale imp-96059 linear "gamma_{N/10}" string',
  definition:
    'For the Route L (Li-Herglotz-CMV) off-line-displacement detector at Levinson ' +
    'truncation order N, two measured reach series are power laws in log-log: the ' +
    'detector height reach gamma_det(N) = 2.212158 * N^0.786358 (from the inverse of ' +
    'N_det = 0.364336 * gamma_0^1.271686, r2 = 0.976), and the clean-prefix height reach ' +
    'gamma_reach(N) = 13.550752 * N^0.367443 (r2 = 0.979, index K ~ 1.436881 * N^0.553694). ' +
    'Both exponents are less than 1, so the reach is sublinear in N.',
  mechanism:
    'Extrapolating each law to the Platt-Trudgian verified height T0 ~ 3.0001e12 requires ' +
    'N ~ 3.2897e15 for the detector and N ~ 7.517e30 for the clean-prefix reproduction -- ' +
    '1 to 16 orders of magnitude beyond the ~1.2363e14 the earlier (refuted) linear law ' +
    'implied. The detector resolves a displaced off-line zero at a much lower N than the ' +
    'clean-prefix needs to reproduce the same height of true zeros to 1e-12, but both ' +
    'diverge astronomically at PT height, so Route L stays a fixed-cost detector rather ' +
    'than a scalable lever.',
  verificationStatus:
    'REFIT, not a new bound: restates the imp-96149 power-law least-squares fit against ' +
    'the imp-96059 measured data (detector rows N_det vs gamma_0; imp-96045 clean-prefix ' +
    'reach vs N), correcting the stale linear-reach string. Cross-checked at N = 400: the ' +
    'first undetected zero (index 40, gamma = 122.9468) sits 0.4 past the fitted ' +
    'clean-prefix reach (122.482), consistent with the power law, not a positivity ' +
    'failure. Changes no bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96179_ROUTE_L_POWER_LAW_REACH_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96179',
  proofSection: 'S-frontier',
  glosses: 'imp-96149',
  question:
    'imp-96149 refit the Route L detector and clean-prefix reach data and found both are ' +
    'power laws, correcting the imp-96059 linear "gamma_{N/10}" string. What are the fitted ' +
    'laws and why does Route L stay a fixed-cost detector rather than a lever, for a reader ' +
    'landing on that module cold?',
  headword: ROUTE_L_POWER_LAW_REACH_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96149 power-law ' +
    'reach refinement: detector reach gamma_det ~ 2.212 * N^0.786 (r2 = 0.976), clean-prefix ' +
    'reach gamma_reach ~ 13.55 * N^0.367 (r2 = 0.979), both sublinear and superseding the ' +
    'stale imp-96059 linear string. Extrapolating to Platt-Trudgian height needs N ~ 3.3e15 ' +
    'to ~7.5e30, so Route L remains a fixed-cost, verified-height-dominated detector, not a ' +
    'lever. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96149 (the power-law refit this glosses); imp-96059 (the stale linear-reach ' +
    'string this corrects).',
});

export default IMP96179_ROUTE_L_POWER_LAW_REACH_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96179_ROUTE_L_POWER_LAW_REACH_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96179-headword-has-required-fields',
    why: 'The headword must name both fitted power-law exponents and the extrapolated ' +
      'astronomical N requirement -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96179_ROUTE_L_POWER_LAW_REACH_GLOSSARY_HEADWORD.headword;
      return (
        /0\.786358/.test(h.definition) &&
        /0\.367443/.test(h.definition) &&
        /3\.2897e15/.test(h.mechanism) &&
        /7\.517e30/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96179-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96179_ROUTE_L_POWER_LAW_REACH_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96179_ROUTE_L_POWER_LAW_REACH_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96179_ROUTE_L_POWER_LAW_REACH_GLOSSARY_HEADWORD.verdict) &&
      IMP96179_ROUTE_L_POWER_LAW_REACH_GLOSSARY_HEADWORD.glosses === 'imp-96149',
  },
];

for (const assertion of IMP96179_ROUTE_L_POWER_LAW_REACH_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96179-route-l-power-law-reach-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
