/**
 * @module imp-96675-conditioning-ceiling-confidence-interval-glossary-headword
 * @fileoverview imp-96675 -- import-light glossary/Concepts headword for the imp-96656
 *   error-propagation verdict: the Route M double-precision conditioning ceiling is now
 *   reported as a delta-method log-normal CONFIDENCE INTERVAL, not the imp-96570 bare
 *   point range, and the asymmetric band (dense 95% spans ~2.4x, all-rung 95% spans only
 *   ~1.16x) still leaves the compute-binds-first ordering intact.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96656 propagated the OLS fit standard errors on the log-log cond#(N) = C N^q
 *   power-law exponent q and intercept lnC through the ceiling map N* = (1/(eps C))^(1/q)
 *   via the delta method, replacing the imp-96570 bare point ceilings (3.78e7 all-rung /
 *   4.30e7 dense) with error-bounded intervals. This headword bakes that verdict verbatim
 *   (no re-import of the imp-96656 module, to stay import-light) as a standalone
 *   quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Fitting ln cond# = lnC + q ln N by OLS on the five accessible rungs and carrying the
 *   full (lnC, q) covariance through the delta method gives a log-normal ceiling band
 *   because N* is exponentially sensitive to q: all-rung (5 rungs, df=3) N* = 3.78e7 with
 *   95% CI [3.50e7, 4.07e7] -- a factor ~1.16x wide -- while dense (4 rungs, df=2, no
 *   N=250 anchor) N* = 4.30e7 with 95% CI [2.76e7, 6.69e7] -- a factor ~2.4x wide. The
 *   extra low-N=250 anchor in the all-rung fit lengthens the log-N lever arm and shrinks
 *   Var(q) ~4.5x, which is why it is the tighter band. Even at the widest (dense, 95%)
 *   lower edge N_lo = 2.76e7, the ordering 9916 (imp-96352 compute ceiling) < 2.59e7
 *   (imp-96548 rigorous trace-domination lower ceiling) < N_lo holds -- compute binds
 *   first robustly, >=2000x below every band edge -- but the margin of N_lo over the
 *   rigorous lower ceiling is only ~6.5% on the dense fit (vs a comfortable ~35% on the
 *   all-rung fit), so that is the one tight spot in an otherwise robust chain.
 *
 *   STATUS: an error-propagation pass (quantifies sampling uncertainty of an existing
 *   fit), not a new measurement and not a rigorous derivation. The interval inherits the
 *   same non-rigorous lam_min N^-p / lam_max a+b log N extrapolations the point ceiling
 *   already rested on, and the small-sample Student-t band assumes homoscedastic
 *   log-normal residuals at df=2 (dense) / df=3 (all).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96656 verdict for quick reference. It
 *   establishes nothing, instantiates no interval beyond what imp-96656 already computed,
 *   closes no sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96656-route-m-conditioning-ceiling-confidence-interval.js (source: the CI this glosses)
 * @see imp-96570-route-m-conditioning-ceiling-crossvalidation.js (the bare point range replaced)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (rigorous lower ceiling 2.59e7)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (compute ceiling ~9916)
 *
 * Ticket: imp-96675 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The confidence-interval headword, baked verbatim (no re-import).
const CONDITIONING_CEILING_CONFIDENCE_INTERVAL_HEADWORD = Object.freeze({
  key: 'route-m-conditioning-ceiling-error-bounded-confidence-interval',
  term:
    'imp-96656 verdict: the Route M double-precision conditioning ceiling is an ' +
    'error-bounded delta-method log-normal interval, not a bare point -- all-rung 95% ' +
    'CI [3.50e7, 4.07e7] (~1.16x wide) vs dense 95% CI [2.76e7, 6.69e7] (~2.4x wide) -- ' +
    'and the compute-binds-first ordering 9916 < 2.59e7 < ceiling survives the full band',
  definition:
    'The imp-96570 conditioning ceiling was reported as a bare point range (3.78e7 ' +
    'all-rung / 4.30e7 dense) from a log-log OLS fit cond#(N) = C N^q, with no error ' +
    'band even though the fitted slope q and intercept lnC each carry standard errors ' +
    'and a covariance. imp-96656 propagates that fit uncertainty through the ceiling ' +
    'map ln N* = (ln(1/eps) - lnC)/q via the delta method -- Var(ln N*) built from ' +
    'Var(q), Var(lnC), and Cov(lnC,q) -- to produce a log-normal Student-t confidence ' +
    'band around each point ceiling.',
  mechanism:
    'All-rung (N=250,3000,4000,5000,6000; df=3): q = 1.9837 +/- 0.0048, R^2 = 0.99998, ' +
    'N* = 3.78e7 with 95% CI [3.50e7, 4.07e7]. Dense (N=3000..6000 only; df=2): ' +
    'q = 1.9557 +/- 0.0219, R^2 = 0.99975, N* = 4.30e7 with 95% CI [2.76e7, 6.69e7]. ' +
    'Because N* is exponentially sensitive to q, the band is markedly asymmetric in N: ' +
    'the all-rung fit (tightened ~4.5x on Var(q) by the extra low N=250 anchor ' +
    'lengthening the log-N lever arm) spans only a factor ~1.16x at 95%, while the ' +
    'sparser dense fit spans ~2.4x. Even at the widest lower edge (dense, N_lo = 2.76e7) ' +
    'the ordering 9916 (imp-96352 compute ceiling) < 2.59e7 (imp-96548 rigorous ' +
    'trace-domination lower ceiling) < N_lo holds, and every 95% lower edge sits ' +
    '>=2000x above the compute ceiling, so compute binds first robustly. The one tight ' +
    'spot is the dense-fit lower edge sitting only ~6.5% above the rigorous lower ' +
    'ceiling 2.59e7, versus a comfortable ~35% margin on the all-rung fit.',
  verificationStatus:
    'Error-propagation pass (quantifies sampling uncertainty of the already-committed ' +
    'imp-96570 cond#(N) rows), not a new measurement and not a rigorous derivation. The ' +
    'band inherits the same non-rigorous lam_min N^-p / lam_max a+b log N ' +
    'extrapolations the point ceiling rested on, and the small-sample Student-t band ' +
    'assumes homoscedastic log-normal residuals at df=2/df=3. Changes no bound; ' +
    'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96675_CONDITIONING_CEILING_CONFIDENCE_INTERVAL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96675',
  proofSection: 'S-frontier',
  glosses: 'imp-96656',
  question:
    'imp-96570 reported the Route M conditioning ceiling as a bare point range with no ' +
    'error band. Does propagating the log-log OLS fit-exponent standard errors through ' +
    'the ceiling map via the delta method leave the compute-binds-first ordering ' +
    '(9916 < 2.59e7 < ceiling) intact, and how wide is the resulting interval?',
  headword: CONDITIONING_CEILING_CONFIDENCE_INTERVAL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96656 ' +
    'verdict: the delta-method log-normal ceiling interval is N* = 3.78e7 (all-rung, ' +
    '95% CI [3.50e7, 4.07e7], ~1.16x wide) / 4.30e7 (dense, 95% CI [2.76e7, 6.69e7], ' +
    '~2.4x wide), the compute-binds-first ordering 9916 < 2.59e7 < fitted-ceiling 95% ' +
    'lower edge survives on both subsets (>=2000x margin over compute), and the sole ' +
    'tight spot is the dense-fit lower edge sitting ~6.5% above the rigorous lower ' +
    'ceiling. Establishes nothing; instantiates no interval beyond imp-96656; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96656 (the confidence interval this glosses); imp-96570 (the bare point range ' +
    'replaced); imp-96548 (rigorous trace lower ceiling 2.59e7); imp-96352 (compute ' +
    'ceiling ~9916).',
});

export default IMP96675_CONDITIONING_CEILING_CONFIDENCE_INTERVAL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96675_CONDITIONING_CEILING_CONFIDENCE_INTERVAL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96675-headword-has-required-fields',
    why: 'The headword must name both 95% CI widths, the exponent standard errors, and ' +
      'the compute-binds-first ordering -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96675_CONDITIONING_CEILING_CONFIDENCE_INTERVAL_GLOSSARY_HEADWORD.headword;
      return (
        /3\.50e7, 4\.07e7/.test(h.mechanism) &&
        /2\.76e7, 6\.69e7/.test(h.mechanism) &&
        /1\.9837/.test(h.mechanism) &&
        /1\.9557/.test(h.mechanism) &&
        /2\.59e7/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96675-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96675_CONDITIONING_CEILING_CONFIDENCE_INTERVAL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96675_CONDITIONING_CEILING_CONFIDENCE_INTERVAL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96675_CONDITIONING_CEILING_CONFIDENCE_INTERVAL_GLOSSARY_HEADWORD.verdict) &&
      IMP96675_CONDITIONING_CEILING_CONFIDENCE_INTERVAL_GLOSSARY_HEADWORD.glosses === 'imp-96656',
  },
];

for (const assertion of IMP96675_CONDITIONING_CEILING_CONFIDENCE_INTERVAL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96675-conditioning-ceiling-confidence-interval-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
