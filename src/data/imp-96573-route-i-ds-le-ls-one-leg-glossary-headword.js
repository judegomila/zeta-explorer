/**
 * @module imp-96573-route-i-ds-le-ls-one-leg-glossary-headword
 * @fileoverview imp-96573 -- import-light glossary/Concepts headword restating the imp-96544
 *   verdict on the Route I D_S <= L_S certificate (rh-route-i-uncertainty-concentration-certificate-
 *   2026-09-24: W(h) = Arch(h) - P_2(h) >= 9.04e-4 ||h||^2 on pole-free h in L^2(-a,a), 2a <= ln 3).
 *   That certificate was established in DOUBLE precision and is explicitly "NOT interval-verified".
 *   imp-96544 ported two of its four legs -- (B) the floor constant m_T and (D) the Bernstein-ellipse
 *   tail ||K Q_N|| -- to rigorous mpmath.iv interval arithmetic, leaving EXACTLY ONE un-enclosed leg:
 *   (E) the constrained Galerkin smallest-eigenvalue lambda_min(K_N|V_N).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   This bakes the imp-96544 triage verbatim (no re-import of the certificate or the interval-port
 *   modules, to stay import-light) as a standalone quick-lookup entry for a reader who wants the
 *   headline distinction: the Route I D_S <= L_S certificate is still a DOUBLE-precision result, but
 *   it is no longer "fully un-enclosed" -- two of its four legs are now rigorously interval-verified,
 *   and the whole certificate rests on exactly one remaining leg.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The Route I D_S <= L_S certificate factors as W(h) >= m_T ||h||^2 + <h,Kh>, with
 *   <h,Kh> >= min(lambda_min(K_N|V_N), 0) - 2||K Q_N||, i.e. into four legs: (A) analytic nesting,
 *   (B) the floor constant m_T = 2 theta'(T) - M_2, (C) the analytic operator-split identity, and
 *   (D) the Bernstein-ellipse tail ||K Q_N||, plus (E) the constrained Galerkin smallest eigenvalue
 *   lambda_min(K_N|V_N). Legs (A) and (C) are analytic identities needing no interval computation.
 *   imp-96544 rigorously enclosed (B) (m_T strictly positive, m_400 in [0.80677657222220,
 *   0.80677657222720], containing the baked double 0.80677657222470) and (D) (Bernstein tail
 *   <= 3.306e-24 at (T,N) = (400,320), twenty orders below the 9.04e-4 margin). Only leg (E) resists:
 *   it needs a rigorous Arb enclosure of ~160x160/sector oscillatory Galerkin integrals plus a
 *   verified smallest-eigenvalue lower bound (Rump/interval-Cholesky) to absolute accuracy < 9e-4,
 *   against the threshold lambda_min(K_N|V_N) >= -0.8067765722222 (double value -0.8058722, margin
 *   9.04e-4).
 *
 *   STATUS: a documentation/triage restatement, not a new interval enclosure. Establishes nothing
 *   beyond what imp-96544 already established.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96544 verdict for quick reference. It establishes
 *   nothing, instantiates no interval, closes no sub-gap, moves no bound. Fixed-window positivity
 *   implies nothing about RH. NO QED. No refereed bound is changed.
 *
 * @see imp-96544-route-i-ds-le-ls-interval-port-triage (source: the triage this glosses)
 * @see rh-route-i-uncertainty-concentration-certificate-2026-09-24 (the double-precision certificate)
 *
 * Ticket: imp-96573 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The double-precision / one-remaining-leg headword, baked verbatim (no re-import).
const ROUTE_I_DS_LE_LS_ONE_LEG_HEADWORD = Object.freeze({
  key: 'route-i-ds-le-ls-certificate-double-precision-one-leg-remaining',
  term:
    'imp-96544 verdict: the Route I D_S<=L_S certificate (W(h)>=9.04e-4||h||^2, pole-free, ' +
    '2a<=ln3) is DOUBLE-precision and NOT interval-verified as a whole, but reduces to ' +
    'exactly ONE un-enclosed leg (E) after imp-96544’s interval port',
  definition:
    'The Route I D_S<=L_S certificate W(h) >= 9.04e-4 ||h||^2 (pole-free h, 2a <= ln3) was ' +
    'established in DOUBLE precision and is explicitly not interval-verified. It factors ' +
    'into four legs: (A) analytic nesting, (B) the floor constant m_T, (C) the analytic ' +
    'operator-split identity, and (D) the Bernstein-ellipse tail ||K Q_N||, plus a fifth ' +
    'quantity (E) the constrained Galerkin smallest eigenvalue lambda_min(K_N|V_N). imp-96544 ' +
    'rigorously interval-enclosed legs (B) and (D) via mpmath.iv, leaving lambda_min(K_N|V_N) ' +
    '-- leg (E) -- as the sole quantity still resting on a double-precision (non-interval) ' +
    'computation.',
  mechanism:
    'Leg (B), the floor constant m_T = 2 theta’(T) - M_2, is enclosed via a closed-form ' +
    'M_2 (width ~7e-59) and a positive convergent series for Re psi(1/4 + iy) with an ' +
    'integral-test tail bound -- no interval digamma needed. Result: m_400 in ' +
    '[0.80677657222220, 0.80677657222720], strictly positive, containing the baked double. ' +
    'Leg (D), the Bernstein-ellipse tail, is bounded in closed form given a rigorous ' +
    'over-estimate of the analytic sup Phi <= 10: the tail at (T,N) = (400,320) is ' +
    '<= 3.306e-24, twenty orders of magnitude below the 9.04e-4 certificate margin, hence ' +
    'non-binding. With both legs enclosed, the certificate holds rigorously as soon as leg ' +
    '(E) satisfies lambda_min(K_N|V_N) >= -0.8067765722222; the double value is -0.8058722, ' +
    'exceeding that threshold by the full 9.04e-4 margin. Leg (E) resists a lightweight ' +
    'enclosure because it needs Arb-scale rigorous quadrature of ~160x160-per-sector ' +
    'oscillatory Galerkin integrals plus a verified smallest-eigenvalue lower bound ' +
    '(Rump/interval-Cholesky) to absolute accuracy < 9e-4.',
  verificationStatus:
    'Documentation/triage restatement of imp-96544, not a new interval enclosure. The overall ' +
    'Route I D_S<=L_S certificate remains a double-precision result pending leg (E); nothing ' +
    'here localises a zero or moves the conditional bound. No refereed bound is changed; RH open; ' +
    'NO QED.',
});

export const IMP96573_ROUTE_I_DS_LE_LS_ONE_LEG_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96573',
  proofSection: 'S-frontier',
  glosses: 'imp-96544',
  question:
    'The Route I D_S<=L_S certificate (W(h)>=9.04e-4||h||^2, pole-free, 2a<=ln3) was ' +
    'established in DOUBLE precision and is explicitly not interval-verified. imp-96544 ' +
    'ported two of its four legs to rigorous interval arithmetic -- what is the resulting ' +
    'verification status, and what exactly remains?',
  headword: ROUTE_I_DS_LE_LS_ONE_LEG_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96544 verdict: ' +
    'the Route I D_S<=L_S certificate is DOUBLE-precision and NOT interval-verified as a ' +
    'whole, but after imp-96544’s mpmath.iv port of legs (B) floor constant and (D) ' +
    'Bernstein tail, it rests on EXACTLY ONE un-enclosed leg (E): the constrained Galerkin ' +
    'smallest eigenvalue lambda_min(K_N|V_N). Establishes nothing new; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96544 (the interval-port triage this glosses, source of the four-leg factoring ' +
    'and the leg-(E) residual); rh-route-i-uncertainty-concentration-certificate-2026-09-24 ' +
    '(the double-precision certificate W(h) >= 9.04e-4 ||h||^2 being triaged).',
});

export default IMP96573_ROUTE_I_DS_LE_LS_ONE_LEG_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96573_ROUTE_I_DS_LE_LS_ONE_LEG_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96573-headword-has-required-fields',
    why: 'The headword must name the certificate constant, the pole-free window bound, and ' +
      'the single remaining leg -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96573_ROUTE_I_DS_LE_LS_ONE_LEG_GLOSSARY_HEADWORD.headword;
      return (
        /9\.04e-4/.test(h.definition) &&
        /2a <= ln3/.test(h.definition) &&
        /lambda_min\(K_N\|V_N\)/.test(h.definition) &&
        /-0\.8067765722222/.test(h.mechanism) &&
        /3\.306e-24/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96573-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96573_ROUTE_I_DS_LE_LS_ONE_LEG_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96573_ROUTE_I_DS_LE_LS_ONE_LEG_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96573_ROUTE_I_DS_LE_LS_ONE_LEG_GLOSSARY_HEADWORD.verdict) &&
      IMP96573_ROUTE_I_DS_LE_LS_ONE_LEG_GLOSSARY_HEADWORD.glosses === 'imp-96544',
  },
];

for (const assertion of IMP96573_ROUTE_I_DS_LE_LS_ONE_LEG_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96573-route-i-ds-le-ls-one-leg-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
