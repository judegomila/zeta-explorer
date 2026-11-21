/**
 * @module imp-97406-pwa-concentration-primitive-glossary-headword
 * @fileoverview imp-97406 -- import-light glossary/Concepts headword recording the imp-97350 /
 *   imp-97384 shared band-limited (PW_a) concentration primitive: the SINGLE missing analytic
 *   object that both remaining routes to a positive lower bound on the Krein concentration
 *   constant c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a = ln3 reduce to.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE PRIMITIVE. A quantitative band-limited (Paley-Wiener, PW_a) concentration /
 *   uncertainty inequality bounding how much a PW_a function can concentrate its weighted mass
 *   in the confined negative sigma_2 well (global inf -4336.198 at t=9.3502, w_1>0 only past
 *   t~17, imp-97335).
 *   (b) WHY TWO ROUTES COLLAPSE TO ONE. imp-97350 showed the Lehmann-Maehly / spectral-gap
 *   eigenvalue enclosure and the de Branges coercivity realisation are NOT independent levers:
 *   Lehmann-Maehly (m=1) needs an a-priori rho with lambda_1 < rho <= lambda_2, which requires
 *   bounding the count/location of low eigenvalues the confined well can inject via band-limited
 *   concentration; de Branges coercivity T_a[sigma_2] >= c*I needs the concentration constant c
 *   directly (imp-97137 restated c = lambda_min itself). Both needs are exactly the same
 *   weighted-PSWF-or-Fejer-Riesz margin imp-97161 already isolated as missing.
 *   (c) WHAT DOES NOT SUPPLY IT. The imp-97206 measured coupled N,T joint limit ~0.582 is an
 *   UPPER bracket on lambda_1 (Rayleigh-Ritz), not a lower bound on lambda_2 -- wrong eigenvalue,
 *   wrong direction -- so it does not instantiate the primitive (imp-97350 Finding 1).
 *   (d) THE GATE. imp-97384 records this synthesis as a do-not-treat-as-independent gate: future
 *   frontier work should target the shared primitive directly, not re-fund the two routes as if
 *   they were separate levers.
 *   (e) STATUS: documentation only. No rigorous positive lower bound on c_sharp exists; no
 *   operator positivity established; interval-rigorous reach stays 2a<=0.96; no bound moves.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   synthesis. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (source: the three-finding
 *   derivation establishing the two routes share one missing primitive)
 * @see imp-97384-krein-csharp-routes-not-independent-gate.js (the honest-status note + gate this
 *   headword names)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (the confined negative sigma_2 well the
 *   primitive must control concentration against)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (the measured plateau that does NOT
 *   instantiate the primitive)
 *
 * Ticket: imp-97406 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The shared-primitive headword, baked verbatim (no re-import).
const PWA_CONCENTRATION_PRIMITIVE_HEADWORD = Object.freeze({
  key: 'pwa-band-limited-concentration-primitive-imp97350',
  term:
    'shared band-limited (PW_a) concentration primitive: the single missing quantitative ' +
    'uncertainty inequality that both remaining c_sharp lower-bound routes (Lehmann-Maehly ' +
    'spectral-gap, de Branges coercivity) reduce to',
  definition:
    'A quantitative Paley-Wiener (PW_a) concentration / uncertainty inequality bounding how much ' +
    'a band-limited function can concentrate its weighted mass in the confined negative sigma_2 ' +
    'well (global inf -4336.198 at t=9.3502, w_1(t)>0 only past t~17, imp-97335).',
  mechanism:
    'For the Lehmann-Maehly (m=1) eigenvalue enclosure this primitive supplies the a-priori rho ' +
    'with lambda_1 < rho <= lambda_2, by bounding the count/location of low-lying eigenvalues the ' +
    'confined well can inject via band-limited concentration. For de Branges coercivity ' +
    'T_a[sigma_2] >= c*I it IS the concentration constant c, which imp-97137 already restated as ' +
    'c = lambda_min itself. imp-97161 named this same object the ' +
    'IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN sub-gap.',
  verificationStatus:
    'Re-cited from the imp-97350 synthesis module ' +
    '(src/data/imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js) and the imp-97384 ' +
    'gate (src/data/imp-97384-krein-csharp-routes-not-independent-gate.js). The imp-97206 measured ' +
    'joint limit ~0.582 (range [0.5817,0.5842]) is confirmed an UPPER bracket on lambda_1 and does ' +
    'NOT instantiate the primitive. Naming / glossary headword only; supplies no new bound; RH ' +
    'open; no refereed bound is changed; NO QED.',
});

export const IMP97406_PWA_CONCENTRATION_PRIMITIVE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97406',
  proofSection: 'S-frontier',
  glosses: 'imp-97350',
  question:
    'imp-97350 established that the Lehmann-Maehly spectral-gap enclosure and the de Branges ' +
    'coercivity realisation for the Krein c_sharp lower bound at 2a=ln3 are not independent -- ' +
    'both reduce to one missing band-limited concentration primitive, and imp-97384 gated that ' +
    'synthesis. What is the headword for this shared primitive?',
  headword: PWA_CONCENTRATION_PRIMITIVE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97350/imp-97384 shared ' +
    'band-limited (PW_a) concentration primitive: a quantitative uncertainty inequality bounding ' +
    'concentration against the confined negative sigma_2 well, needed identically by the ' +
    'Lehmann-Maehly a-priori rho and the de Branges coercivity constant c. No bound moved; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97350 (the three-finding derivation of the synthesis this glosses); imp-97384 (the ' +
    'honest-status note + do-not-treat-as-independent gate).',
});

export default IMP97406_PWA_CONCENTRATION_PRIMITIVE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97406_PWA_CONCENTRATION_PRIMITIVE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97406-headword-names-primitive-and-both-routes',
    why: 'The headword must name the PW_a concentration primitive and both routes it gates -- ' +
      'the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97406_PWA_CONCENTRATION_PRIMITIVE_GLOSSARY_HEADWORD.headword;
      return (
        /Paley-Wiener/.test(h.definition) &&
        /-4336\.198/.test(h.definition) &&
        /Lehmann-Maehly/.test(h.mechanism) &&
        /de Branges/.test(h.mechanism) &&
        /FEJER_RIESZ/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97406-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97350.',
    holds: () =>
      IMP97406_PWA_CONCENTRATION_PRIMITIVE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97406_PWA_CONCENTRATION_PRIMITIVE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97406_PWA_CONCENTRATION_PRIMITIVE_GLOSSARY_HEADWORD.verdict) &&
      IMP97406_PWA_CONCENTRATION_PRIMITIVE_GLOSSARY_HEADWORD.glosses === 'imp-97350',
  },
];

for (const assertion of IMP97406_PWA_CONCENTRATION_PRIMITIVE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97406-pwa-concentration-primitive-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
