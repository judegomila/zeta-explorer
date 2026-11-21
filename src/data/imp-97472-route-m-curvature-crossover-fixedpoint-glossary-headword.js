/**
 * @module imp-97472-route-m-curvature-crossover-fixedpoint-glossary-headword
 * @fileoverview imp-97472 -- import-light glossary/Concepts headword recording the imp-97437
 *   Route M boundary-to-bulk crossover formula: the transcendental fixed point
 *       x*(eps) = (eps / kappa) [ (C + 1/2) + (1/2) log(1/x*) ],
 *   with effective curvature kappa_eff = 0.0995 (band 0.0974..0.1017), converting the MEASURED
 *   crossover fraction x*(eps) of imp-97419 into an ANALYTIC function of tolerance. This EXPLAINS
 *   the b-independence imp-97419 measured (x* depends only on eps, C, kappa -- all b-free) and
 *   predicts the log-enhanced growth between tolerances, while leaving the PURE analytic O(x^2)
 *   curvature coefficient of the bulk profile f(x) obstructed (model-dependent + wobble-masked,
 *   per imp-97437 RESULT 3).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) DEFINITION. Writing the Route M Vasyunin coefficient I(a,b) = b f(a/b) with linearized
 *   small-x truncation f_lin(x) = x g(x), g(x) = (C+1/2) + (1/2) log(1/x) (imp-97330 boundary-layer
 *   slope), the relative deviation (I - I_lin)/I = r(x)/f(x) with curvature remainder
 *   r(x) = f(x) - f_lin(x) = O(x^2). Setting r(x) ~ kappa x^2 locally, the crossover criterion
 *   (I - I_lin)/I = eps becomes the fixed-point equation x*(eps) = (eps/kappa) g(x*).
 *   (b) EFFECTIVE CURVATURE. Back-solving kappa = eps g(x*)/x* from the two CONVERGED imp-97419
 *   crossovers (x*(2%) = 0.3311, x*(1%) = 0.199) gives 0.101661 and 0.097365 respectively, agreeing
 *   to 4.4%; the mean kappa_eff = 0.09951 reproduces both to ~1-2% (predicts x*(2%) = 0.3366,
 *   x*(1%) = 0.1956), VALIDATING the formula.
 *   (c) WHAT IT EXPLAINS. The b-independence of x*(eps) that imp-97419 measured but left
 *   unexplained now follows algebraically: x*(eps) is a function of eps, C, and kappa alone, with
 *   no b-dependence anywhere in the fixed point.
 *   (d) HONEST LIMIT. kappa_eff is a wobble-AVERAGED effective constant, not the pinned analytic
 *   O(x^2) coefficient: imp-97437 RESULT 3 shows the pure coefficient is model-dependent (deg-2
 *   poly c2 = 0.177 vs log-model A = 0.014, an x^2 log x admixture) and masked by the V(b,a)
 *   arithmetic period-a wobble (window-unstable, rms floor ~ signal). Pinning it needs the exact
 *   Bettin-Conrey reciprocity smooth/fluctuation split of V(b,a), unavailable at finite b.
 *
 *   STATUS: documentation only. No bound moves; this headword names an already-derived and
 *   validated crossover formula (imp-97437) and its honest scope limit. NO QED.
 *
 * @see imp-97437-route-m-bulk-profile-curvature-crossover.js (source: the crossover formula
 *   derivation, kappa_eff validation, and the curvature-pinning obstruction this glosses)
 * @see imp-97419-route-m-uniform-profile-crossover-scale.js (the measured x*(eps) crossovers this
 *   formula converts into an analytic threshold)
 * @see imp-97330-route-m-smalla-intercept-closed-form.js (the boundary-layer slope
 *   g(x) = (C+1/2)+(1/2)log(1/x) used in the fixed point)
 *
 * Ticket: imp-97472 (content, medium, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The curvature-crossover-fixed-point headword, baked verbatim (no re-import).
const CURVATURE_CROSSOVER_FIXEDPOINT_HEADWORD = Object.freeze({
  key: 'route-m-curvature-crossover-fixedpoint-imp97437',
  term:
    'Route M boundary-to-bulk crossover fixed point: x*(eps) = (eps/kappa)[(C+1/2)+(1/2)log(1/x*)], ' +
    'with effective curvature kappa_eff = 0.0995, converting the imp-97419 measured crossover ' +
    'fraction into an analytic function of the tolerance eps.',
  definition:
    'From I(a,b) = b f(a/b) and the linearized small-x truncation f_lin(x) = x g(x) with ' +
    'boundary-layer slope g(x) = (C+1/2)+(1/2)log(1/x) (imp-97330), the crossover criterion ' +
    '(I - I_lin)/I = eps becomes the transcendental fixed point x*(eps) = (eps/kappa) g(x*), ' +
    'where the curvature remainder r(x) = f(x) - f_lin(x) = O(x^2) is modeled locally as kappa x^2.',
  validation:
    'Back-solving kappa = eps g(x*)/x* from the two CONVERGED imp-97419 crossovers gives ' +
    '0.101661 (from x*(2%)=0.3311) and 0.097365 (from x*(1%)=0.199), agreeing to 4.4%. The mean ' +
    'kappa_eff = 0.09951 reproduces both to ~1-2% (predicts x*(2%)=0.3366, x*(1%)=0.1956), ' +
    'validating the formula against independent data.',
  explains:
    'The imp-97419 b-independence of x*(eps), previously an unexplained empirical fact, follows ' +
    'algebraically: x*(eps) depends only on eps, C, and kappa, with no b anywhere in the fixed ' +
    'point, and predicts the log-enhanced growth of x*(eps) between tolerances (x*(2%)/x*(1%) > 1.5).',
  honestLimit:
    'kappa_eff = 0.0995 is a wobble-AVERAGED effective curvature, not the pinned pure analytic ' +
    'O(x^2) coefficient: imp-97437 RESULT 3 found the pure coefficient OBSTRUCTED -- ' +
    'model-dependent (deg-2 poly c2=0.177 vs log-model A=0.014) and masked by the V(b,a) ' +
    'arithmetic wobble (window-unstable, residual rms floor ~ signal). Pinning it needs the ' +
    'exact Bettin-Conrey reciprocity smooth/fluctuation split of V(b,a), not finite-b compute.',
  verificationStatus:
    'Re-cited from the imp-97437 measurement module ' +
    '(src/data/imp-97437-route-m-bulk-profile-curvature-crossover.js), where the crossover ' +
    'formula, kappa_eff back-solve, and curvature obstruction are all verified directly. Naming / ' +
    'glossary headword only; supplies no new bound; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP97472_CURVATURE_CROSSOVER_FIXEDPOINT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97472',
  proofSection: 'Route-M',
  glosses: 'imp-97437',
  question:
    'imp-97437 derived and validated the analytic crossover formula x*(eps) = ' +
    '(eps/kappa)[(C+1/2)+(1/2)log(1/x*)] with kappa_eff = 0.0995. What is the headword for this ' +
    'fixed point, and does it pin the pure analytic curvature constant?',
  headword: CURVATURE_CROSSOVER_FIXEDPOINT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97437 analytic ' +
    'boundary-to-bulk crossover formula x*(eps) = (eps/kappa)[(C+1/2)+(1/2)log(1/x*)], the ' +
    'kappa_eff = 0.0995 (band 0.0974..0.1017) that validates it against both converged imp-97419 ' +
    'crossovers, and the honest scope limit that the pure analytic O(x^2) curvature coefficient ' +
    'remains obstructed (model-dependent, wobble-masked). No bound moved; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97437 (the crossover formula derivation, kappa_eff validation, and curvature obstruction ' +
    'this glosses); imp-97419 (the measured crossover fractions the formula converts to analytic ' +
    'thresholds); imp-97330 (the boundary-layer slope g(x) used in the fixed point).',
});

export default IMP97472_CURVATURE_CROSSOVER_FIXEDPOINT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97472_CURVATURE_CROSSOVER_FIXEDPOINT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97472-headword-cites-formula-and-kappa',
    why: 'The headword must name the fixed-point formula x*(eps)=(eps/kappa)[(C+1/2)+(1/2)log(1/x*)], ' +
      'the effective curvature kappa_eff = 0.0995, and the two converged crossovers it validates -- ' +
      'the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97472_CURVATURE_CROSSOVER_FIXEDPOINT_GLOSSARY_HEADWORD.headword;
      return (
        /0\.09951/.test(h.validation) &&
        /0\.3311/.test(h.validation) &&
        /0\.199/.test(h.validation) &&
        /\(C\+1\/2\)\+\(1\/2\)log\(1\/x\)/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97472-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97437, ' +
      'and the honest limit (pure coefficient not pinned) must be present.',
    holds: () =>
      IMP97472_CURVATURE_CROSSOVER_FIXEDPOINT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97472_CURVATURE_CROSSOVER_FIXEDPOINT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97472_CURVATURE_CROSSOVER_FIXEDPOINT_GLOSSARY_HEADWORD.verdict) &&
      IMP97472_CURVATURE_CROSSOVER_FIXEDPOINT_GLOSSARY_HEADWORD.glosses === 'imp-97437' &&
      /OBSTRUCTED/.test(
        IMP97472_CURVATURE_CROSSOVER_FIXEDPOINT_GLOSSARY_HEADWORD.headword.honestLimit,
      ),
  },
];

for (const assertion of IMP97472_CURVATURE_CROSSOVER_FIXEDPOINT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97472-route-m-curvature-crossover-fixedpoint-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
