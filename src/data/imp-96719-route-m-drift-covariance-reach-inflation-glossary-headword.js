/**
 * @module imp-96719-route-m-drift-covariance-reach-inflation-glossary-headword
 * @fileoverview imp-96719 -- import-light glossary/Concepts headword for the imp-96692
 *   finding: the imp-96569/imp-96601 SE-of-mean reach projection treats the 21
 *   imp-96487 ladder rungs as INDEPENDENT, but they carry a MEASURED positive lag-1
 *   serial correlation phi1 = 0.44 (drift covariance). Honouring that covariance
 *   inflates the effective sampling variance by a Bartlett/red-noise factor
 *   VIF ~ 2.58 (AR(1) proxy), which inflates the required reach N by ~0.4-1.9 orders
 *   of magnitude (representative 3-sigma/1-logN corner: ~11.6x, ~1.06 orders) and
 *   tightens the drift-aware gap-resolution floor to only ~1.09 covariance-inflated
 *   sigma (below the SE-of-mean model's 1.74 sigma).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96692 measured the drift covariance directly from the ladder and re-solved
 *   the imp-96569 reach equation with the inflated variance. This headword bakes
 *   that verdict verbatim (no re-import of the imp-96692 module, to stay
 *   import-light) as a standalone quick-lookup entry: a reader must not treat the
 *   imp-96569 SE-of-mean reach figures as anything but an OPTIMISTIC lower bound,
 *   because the ladder rungs are not independent draws.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) MEASURED DRIFT COVARIANCE. The 21-rung imp-96487 ratio ladder has lag-1
 *   serial correlation phi1 = 0.4410 about its mean (neighbouring rungs drift
 *   together), with integrated autocorrelation time tauInt = 0.5678.
 *   (b) VARIANCE INFLATION AT DC. For positively correlated fluctuations the
 *   Bartlett/red-noise factor VIF = 1 + 2*sum(rho_k) inflates the mean's variance
 *   above the naive sigma/sqrt(m) SE-of-mean model. Three consistent estimates
 *   bracket it: AR(1) proxy VIF = 2.578 (primary), integrated-ACF VIF = 2.136,
 *   oscillation-coherence VIF = 4.645. Equivalently, an SE-of-mean decision at
 *   confidence z becomes a drift-aware decision at z_eff = z*sqrt(2.578) = z*1.606.
 *   (c) REACH INFLATES. Re-solving the imp-96569 reach equation with the inflated
 *   variance across the same 9 (z, q, noise) corners inflates the required N by a
 *   factor that grows with slower drift decay q: from ~2.8x (z=2, q=2) to ~87x
 *   (z=5, q=1); the representative 3-sigma/1-logN corner inflates ~11.6x
 *   (~1.06 orders of magnitude further out in N than the SE-of-mean figure).
 *   (d) GAP FLOOR TIGHTENS. The full RH-vs-plateau gap, expressed in
 *   covariance-inflated sigma units (gapFull / (sqrt(VIF)*sigma_MB)), is only
 *   ~1.09 sigma -- strictly tighter than the 1.74 sigma the SE-of-mean model
 *   reported, so even at infinite N a drift-aware reading falls short of a 2-sigma
 *   separation.
 *
 *   STATUS: a measurement/projection that quantifies an already-flagged caveat
 *   (imp-96601), not a new bound or a rigorous power calculation -- the VIF is
 *   bracketed from only 21 non-uniformly-spaced rungs.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96692 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96692-route-m-reach-drift-covariance-inflation.js (source: the measurement this glosses)
 * @see imp-96569-route-m-window-reach-projection.js (SE-of-mean lower-bound reach that gets inflated)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (drift degeneracy, the 21-rung ladder)
 *
 * Ticket: imp-96719 (content, medium, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The drift-covariance reach-inflation headword, baked verbatim (no re-import).
const DRIFT_COVARIANCE_REACH_INFLATION_HEADWORD = Object.freeze({
  key: 'route-m-drift-covariance-reach-inflation',
  term:
    'imp-96692 finding: the measured drift covariance (phi1 = 0.44, AR(1) VIF ~ 2.58) ' +
    'in the imp-96487 ladder inflates the imp-96569 SE-of-mean reach by ~0.4-1.9 ' +
    'orders of magnitude in N (representative ~12x) and tightens the drift-aware ' +
    'gap-resolution floor to ~1.09 sigma',
  definition:
    'The imp-96569 reach projection models the m averaging rungs as INDEPENDENT ' +
    'draws, so its SE-of-mean formula SE = sigma/sqrt(m) undercounts the sampling ' +
    'variance whenever the rungs are serially correlated. The imp-96487 21-rung ' +
    'ratio ladder has a measured lag-1 serial correlation phi1 = 0.4410291360666976 ' +
    '(positive: neighbouring rungs drift together) with integrated autocorrelation ' +
    'time tauInt = 0.5678202654320192 -- exactly the low-frequency drift degeneracy ' +
    'imp-96487 already flagged as a caveat.',
  mechanism:
    'For positively correlated fluctuations the mean variance inflates by the ' +
    'Bartlett/red-noise factor VIF = 1 + 2*sum(rho_k). Three consistent estimates ' +
    'bracket the true VIF: AR(1) proxy (1+phi1)/(1-phi1) = 2.57800402319117 ' +
    '(primary), integrated-ACF 1+2*tauInt = 2.1356405308640385, and ' +
    'oscillation-coherence rungsPerL*(T_L/2) = 4.645302223026322. This is ' +
    'equivalent to replacing the confidence target z with z_eff = z*sqrt(2.578) = ' +
    'z*1.605616399764019 in the reach solve. Re-solving the imp-96569 reach ' +
    'equation over the same 9 (z,q,noise) corners inflates the required N by ' +
    '2.759x (z=2,q=2, fastest decay) up to 86.685x (z=5,q=1); the representative ' +
    'z=3,q=1 MB corner inflates 11.605x (~1.06 orders of magnitude further out). ' +
    'The full RH-vs-plateau gap, in covariance-inflated sigma units, shrinks from ' +
    'the SE-of-mean model’s 1.7432927017415112 sigma to only ' +
    '1.0857 sigma -- below a 2-sigma separation even at infinite N.',
  verificationStatus:
    'Measurement/projection quantifying an already-flagged caveat (imp-96601), not ' +
    'a rigorous power calculation: the VIF is bracketed from only 21 ' +
    'non-uniformly-spaced ladder rungs. The direction is robust and one-sided -- ' +
    'honouring the measured positive serial correlation can only ENLARGE the reach ' +
    'and TIGHTEN the gap floor, never shrink either. Changes no bound; establishes ' +
    'no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96719_DRIFT_COVARIANCE_REACH_INFLATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96719',
  proofSection: 'S-frontier',
  glosses: 'imp-96692',
  question:
    'imp-96569 projected the reach N needed to decide the imp-96487 ratio(N) -> 1 ' +
    'asymptote using an SE-of-mean model that treats the averaging rungs as ' +
    'independent. imp-96601 flagged that this ignores the ladder’s low-frequency ' +
    'drift degeneracy. How much does honouring the MEASURED drift covariance ' +
    'actually inflate the required reach?',
  headword: DRIFT_COVARIANCE_REACH_INFLATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96692 ' +
    'verdict: the measured drift covariance (phi1 = 0.44, AR(1) VIF ~ 2.58) inflates ' +
    'the imp-96569 SE-of-mean reach by ~0.4-1.9 orders of magnitude across the MB ' +
    'corners (representative 3-sigma/1-logN corner ~11.6x, ~1.06 orders) and ' +
    'tightens the drift-aware gap-resolution floor to only ~1.09 covariance-inflated ' +
    'sigma, below the SE-of-mean model’s 1.74 sigma. This CONFIRMS and QUANTIFIES ' +
    'the imp-96569 lower-bound caveat; it overturns no plateau reading. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96692 (the drift-covariance measurement and reach re-solve this glosses); ' +
    'imp-96569 (the SE-of-mean reach projection that gets inflated); imp-96601 ' +
    '(the headword that first flagged the independence-assumption caveat); ' +
    'imp-96487 (the 21-rung ladder and drift-degeneracy source).',
});

export default IMP96719_DRIFT_COVARIANCE_REACH_INFLATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96719_DRIFT_COVARIANCE_REACH_INFLATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96719-headword-has-required-fields',
    why: 'The headword must name the measured serial correlation, the primary VIF, ' +
      'the representative reach inflation, and the tightened gap floor -- the ' +
      'entire point of the glossary entry.',
    holds: () => {
      const h = IMP96719_DRIFT_COVARIANCE_REACH_INFLATION_GLOSSARY_HEADWORD.headword;
      return (
        /0\.4410291360666976/.test(h.definition) &&
        /2\.57800402319117/.test(h.mechanism) &&
        /11\.605/.test(h.mechanism) &&
        /1\.0857/.test(h.mechanism) &&
        /INDEPENDENT/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96719-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96719_DRIFT_COVARIANCE_REACH_INFLATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96719_DRIFT_COVARIANCE_REACH_INFLATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96719_DRIFT_COVARIANCE_REACH_INFLATION_GLOSSARY_HEADWORD.verdict) &&
      IMP96719_DRIFT_COVARIANCE_REACH_INFLATION_GLOSSARY_HEADWORD.glosses === 'imp-96692',
  },
];

for (const assertion of IMP96719_DRIFT_COVARIANCE_REACH_INFLATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96719-route-m-drift-covariance-reach-inflation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
