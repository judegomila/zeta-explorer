/**
 * @module imp-96691-route-m-bohr-lift-multiplicative-szego-assessment
 * @fileoverview imp-96691 (proof, assessment) -- assess whether a Bohr-lift /
 *   multiplicative-Szego (Hardy space of Dirichlet series) edge theorem can
 *   RIGOROUSLY derive the measured 0.3526 log-growth coefficient of lam_max(G_N)
 *   for the Route M Vasyunin Gram, or whether it only reproduces the soft trace
 *   upper bound. Honest PARTIAL closure with a named sub-gap; no coefficient claimed.
 *
 *   SETUP (from imp-96443 / imp-96603)
 *   ----------------------------------
 *   The Vasyunin Gram is the multiplicative (Dirichlet-Bohr) kernel
 *     G_{hk} = gcd(h,k) I(h/g, k/g) / (h k),   g = gcd(h,k),
 *   with diagonal G_kk = I(1,1)/k and I(1,1) = 2C = log(2 pi) - gamma =
 *   1.2606614015078126 (measured to full precision in imp-96443). imp-96603 already
 *   ruled out the ADDITIVE Szego/Grenander edge theorem: G is translation invariant
 *   on the multiplicative semigroup, not on Z, and its spectral edge diverges
 *   logarithmically (lam_max ~ 3.0247 + 0.3526 log N, R^2 = 0.9954). This ticket
 *   asks the natural follow-up: does the MULTIPLICATIVE analog -- the Bohr lift to
 *   the infinite torus / the Hardy space H^2 of Dirichlet series and its Toeplitz
 *   (Helson) form theory -- supply a rigorous edge statement that pins 0.3526?
 *
 *   THE BOHR LIFT
 *   -------------
 *   Bohr`s substitution z_j = p_j^{-s} is an isometry between the Hardy space H^2 of
 *   Dirichlet series (Hedenmalm-Lindqvist-Seip) and the Hardy space H^2(T^infty) of
 *   the infinite polytorus: a Dirichlet series Sum a_n n^{-s} lifts to the power
 *   series Sum a_n z^{alpha(n)}, where n = prod p_j^{alpha_j} maps to the monomial
 *   z^{alpha}. A multiplicative kernel with an Euler-product structure lifts to a
 *   Toeplitz/Helson form on H^2(T^infty). IF the lifted symbol were BOUNDED, Helson`s
 *   multiplicative-Szego theory would force the top of the form toward the essential
 *   supremum of that symbol -- a finite CONSTANT edge.
 *
 *   WHAT THE MULTIPLICATIVE ROUTE RIGOROUSLY YIELDS (the honest partial)
 *   -------------------------------------------------------------------
 *   The multiplicative diagonal structure alone gives a RIGOROUS upper bound on the
 *   log-growth coefficient c of lam_max(G_N):
 *     lam_max(G_N) <= trace(G_N) = I(1,1) H_N = (log(2 pi) - gamma)(log N + gamma + o(1)),
 *   so c <= I(1,1) = 1.2606614015078126. This is genuinely a multiplicative-structure
 *   statement (the diagonal G_kk = I(1,1)/k IS the Bohr-lifted symbol`s zeroth Fourier
 *   coefficient block, whose harmonic sum Sum 1/k = H_N is the s -> 1 pole of zeta).
 *   The rigorous ceiling on the coefficient is therefore the residue-type constant
 *   log(2 pi) - gamma, and the log-SHAPE of the growth is forced by the zeta pole at
 *   s = 1 that the Bohr lift carries. That much the multiplicative route DOES deliver.
 *
 *   WHY 0.3526 EXACTLY IS NOT DERIVED (the precise obstruction)
 *   ----------------------------------------------------------
 *   (a) UNBOUNDED SYMBOL. The Bohr-lifted Vasyunin symbol inherits the zeta(s) pole
 *   at s = 1 (equivalently the divergence of Sum 1/k), so it is NOT bounded and
 *   Helson`s bounded-symbol multiplicative-Szego edge theorem has no applicable
 *   statement -- exactly the imp-96603 obstruction (b), now confirmed to survive the
 *   passage to the multiplicative torus rather than being cured by it.
 *   (b) ISOMETRY, NOT AN EDGE THEOREM. The Bohr lift is an ISOMETRY of Hardy spaces;
 *   it transports the quadratic form faithfully but by itself yields no top-eigenvalue
 *   asymptotic. Extracting an edge constant needs a spectral-edge / localization
 *   theorem for the lifted operator, which the isometry does not provide.
 *   (c) STRICT GAP BELOW THE TRACE. The measured coefficient 0.3526253785070698 is
 *   only 0.2797 of the trace slope I(1,1) = 1.2606614015078126, i.e. the top
 *   eigenvalue captures ~28% of the trace growth. Closing from the rigorous ceiling
 *   1.2607 down to 0.3526 therefore requires a SPECTRAL-CONCENTRATION estimate
 *   (control of how the multiplicative edge localizes relative to the full trace),
 *   strictly beyond the soft trace bound and not supplied by the Bohr lift.
 *
 *   VERDICT: the Bohr-lift / multiplicative-Szego route rigorously reproduces the
 *   log-SHAPE and a rigorous coefficient CEILING c <= log(2 pi) - gamma = 1.2607, but
 *   does NOT derive the exact 0.3526 coefficient: the lifted symbol carries the zeta
 *   pole (unbounded, so no Helson edge constant) and the isometry is not a spectral-
 *   edge theorem. Named sub-gap below. Honest PARTIAL -- no coefficient claimed.
 *
 *   WHAT THIS IS AND IS NOT
 *   -----------------------
 *   A structural assessment (route evaluation) plus one soft rigorous upper bound
 *   restated from imp-96443/imp-96428. It instantiates no interval, closes no
 *   Lambda sub-gap, moves no bound, establishes no operator positivity. NO QED.
 *   No refereed bound is changed. RH open.
 *
 * @see imp-96603-vasyunin-gram-multiplicative-not-toeplitz-glossary-headword.js (additive-Szego obstruction this extends to the multiplicative torus)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max ladder; I(1,1) = 1.2606614015078126, trace = I(1,1) H_N)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (the additive assessment this parallels)
 *
 * Ticket: imp-96691 (proof, opus-4-8, api-pool). Assessment only; NO QED;
 * no refereed bound is changed.
 */

// Diagonal numerator I(1,1) = 2C = log(2 pi) - gamma (imp-96443, full precision).
export const IMP96691_I11 = 1.2606614015078126;

// Measured lam_max log-growth coefficient (imp-96443 fit; also imp-96603).
export const IMP96691_MEASURED_COEFF = 0.3526253785070698;

// Fraction of the trace slope the measured edge coefficient captures.
export const IMP96691_EDGE_TRACE_FRACTION = IMP96691_MEASURED_COEFF / IMP96691_I11;

export const IMP96691_BOHR_LIFT_MULTIPLICATIVE_SZEGO_ASSESSMENT = Object.freeze({
  id: 'imp-96691',
  proofSection: 'S-frontier',
  route: 'M',
  question:
    'imp-96603 ruled out the additive Szego edge theorem for the multiplicative ' +
    'Vasyunin Gram. Does a multiplicative analog -- the Bohr lift to the infinite ' +
    'torus / the Hardy space of Dirichlet series and its Helson-Toeplitz form ' +
    'theory -- rigorously derive the measured 0.3526 log-growth coefficient of ' +
    'lam_max(G_N)?',
  rigorousPartial: Object.freeze({
    statement:
      'The multiplicative diagonal G_kk = I(1,1)/k gives lam_max(G_N) <= trace(G_N) ' +
      '= I(1,1) H_N, so the log-growth coefficient c satisfies c <= I(1,1) = ' +
      'log(2 pi) - gamma = 1.2606614015078126; the log-SHAPE is forced by the ' +
      'zeta(s) pole at s = 1 that the Bohr lift carries.',
    coefficientCeiling: IMP96691_I11,
    shapeForced: 'logarithmic (zeta pole at s = 1)',
    isRigorous: true,
  }),
  obstruction: Object.freeze({
    unboundedSymbol:
      'The Bohr-lifted Vasyunin symbol inherits the zeta(s) pole at s = 1 ' +
      '(divergence of Sum 1/k), so it is unbounded and Helson`s bounded-symbol ' +
      'multiplicative-Szego edge theorem has no applicable statement -- the ' +
      'imp-96603 obstruction survives passage to the multiplicative torus.',
    isometryNotEdgeTheorem:
      'The Bohr lift is an isometry of Hardy spaces; it transports the form ' +
      'faithfully but yields no top-eigenvalue asymptotic by itself.',
    strictGapBelowTrace:
      'The measured coefficient 0.3526253785070698 is only ' +
      String(IMP96691_EDGE_TRACE_FRACTION) + ' of the trace slope 1.2606614015078126, ' +
      'so pinning 0.3526 needs a spectral-concentration estimate strictly beyond ' +
      'the soft trace bound.',
  }),
  subGap: Object.freeze({
    key: 'imp-96691-multiplicative-szego-edge-constant-unavailable',
    need:
      'A spectral-edge / localization theorem for the Bohr-lifted pole-carrying ' +
      '(unbounded-symbol) Vasyunin operator that pins the exact log-growth ' +
      'coefficient below the rigorous trace ceiling log(2 pi) - gamma. The Bohr-lift ' +
      'isometry and Helson`s bounded-symbol theory do not supply it.',
  }),
  anyBoundMoved: false,
  verdict:
    'The Bohr-lift / multiplicative-Szego route rigorously reproduces the log-SHAPE ' +
    'and a rigorous coefficient CEILING c <= log(2 pi) - gamma = 1.2606614015078126, ' +
    'but does NOT derive the exact measured 0.3526 coefficient: the lifted symbol ' +
    'carries the zeta pole (unbounded, so no Helson edge constant) and the isometry ' +
    'is not a spectral-edge theorem. Honest PARTIAL with named sub-gap ' +
    'imp-96691-multiplicative-szego-edge-constant-unavailable. Moves no bound; ' +
    'establishes nothing; NO QED. No refereed bound is changed.',
  citation:
    'imp-96603 (additive-Szego obstruction extended here to the multiplicative ' +
    'torus); imp-96443 (measured lam_max ladder, I(1,1) = 1.2606614015078126, ' +
    'trace = I(1,1) H_N); imp-96562 (parallel additive assessment).',
});

export default IMP96691_BOHR_LIFT_MULTIPLICATIVE_SZEGO_ASSESSMENT;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96691_BOHR_LIFT_MULTIPLICATIVE_SZEGO_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp96691-trace-ceiling-consistent',
    why: 'The rigorous coefficient ceiling is I(1,1) = log(2 pi) - gamma, and the ' +
      'measured 0.3526 coefficient must sit strictly below it (the whole point of ' +
      'the honest partial: soft rigorous bound, exact value unproven).',
    holds: () => {
      const logTwoPi = Math.log(2 * Math.PI);
      const gamma = 0.5772156649015329;
      const i11 = logTwoPi - gamma;
      return (
        Math.abs(i11 - IMP96691_I11) < 1e-12 &&
        IMP96691_MEASURED_COEFF < IMP96691_I11 &&
        Math.abs(IMP96691_EDGE_TRACE_FRACTION - IMP96691_MEASURED_COEFF / IMP96691_I11) < 1e-15
      );
    },
  },
  {
    id: 'imp96691-honesty-gate-no-qed',
    why: 'Assessment only: no bound moved, honest partial with a named sub-gap, ' +
      'no-refereed-bound-change line present, no coefficient claimed as derived.',
    holds: () => {
      const a = IMP96691_BOHR_LIFT_MULTIPLICATIVE_SZEGO_ASSESSMENT;
      return (
        a.anyBoundMoved === false &&
        /NO QED/.test(a.verdict) &&
        /refereed bound is changed/i.test(a.verdict) &&
        a.rigorousPartial.isRigorous === true &&
        /multiplicative-szego-edge-constant-unavailable/.test(a.subGap.key)
      );
    },
  },
];

for (const assertion of IMP96691_BOHR_LIFT_MULTIPLICATIVE_SZEGO_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96691-route-m-bohr-lift-multiplicative-szego-assessment assertion failed: ${assertion.id}`,
    );
  }
}
