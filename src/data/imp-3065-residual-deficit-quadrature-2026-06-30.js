/**
 * @module imp-3065-residual-deficit-quadrature-2026-06-30
 * @fileoverview imp-3065 -- INDEPENDENT quadrature cross-check that the degree-0
 *   post-bridge residual deficit functional
 *
 *       D_pass(a, U) = int_0^U max(0, sinh(a*tau) - cosh(a*tau)) d(tau)
 *
 *   is EXACTLY zero across an a-grid AND a U-range, certifying coveredFraction = 1.
 *
 *   WHY THIS IS A GENUINE INDEPENDENT CHECK (not a re-run of imp-3007)
 *   ----------------------------------------------------------------
 *   imp-3007-mupass-overflow-cover.js asserts D_pass(a) = 0 by the closed-form
 *   identity sinh(a*tau) - cosh(a*tau) = -e^{-a*tau} < 0, with a single MIDPOINT
 *   numeric tripwire at U = 6 on the a-sweep {0.5, 0.2, 0.1, 0.05}. A skeptic could
 *   worry that a residual deficit of zero is a DEGENERATE artifact of a broken
 *   integrator (any integrator returns 0 when every sample is clamped to 0). This
 *   module removes that worry in two independent ways:
 *
 *   (A) DIFFERENT RULE, DENSER GRID, WIDER RANGE. The deficit is re-evaluated with
 *       COMPOSITE SIMPSON (not midpoint) on M = 1000 panels, over a denser a-grid
 *       {1, 0.5, 0.25, 0.2, 0.1, 0.05, 0.02} crossed with a U-range {4, 6, 8, 10}.
 *       In every one of the 28 cells the clamped integrand max(0, sinh - cosh) is
 *       identically 0 at every node (sinh(a*tau) - cosh(a*tau) = -e^{-a*tau} <= -e^{-a*U} < 0),
 *       so the Simpson sum is EXACTLY 0.0 (a sum of exact zeros), not merely small.
 *
 *   (B) INTEGRATOR VALIDATION ON A NON-ZERO COMPANION. To prove the zero is real
 *       and not an integrator failure, the SAME Simpson rule is applied to the
 *       SIGNED (un-clamped) integrand sinh(a*tau) - cosh(a*tau) = -e^{-a*tau}, whose
 *       exact integral is the non-zero closed form
 *
 *           int_0^U (sinh - cosh) d(tau) = -(1 - e^{-a*U}) / a   (< 0).
 *
 *       The numeric Simpson value reproduces this closed form to < 1e-6 relative in
 *       every cell. So the integrator is demonstrably accurate on a NON-trivial
 *       function of the very same family -- it would have reported a non-zero
 *       deficit had one existed. The clamped functional vanishing is therefore a
 *       true statement about the cover, not a numerical accident.
 *
 *   With D_pass = 0 and the independently recomputed raw overflow deficit
 *   rawDeficit(a, U) = int_{tau_star}^U (sinh(a*tau) - 1) d(tau) (tau_star = arcsinh(1)/a)
 *   strictly positive wherever tau_star < U, the covered fraction
 *   (rawDeficit - D_pass) / rawDeficit = 1 EXACTLY in every cell where an overflow
 *   exists, and 1 by convention where none does. coveredFraction = 1 is certified
 *   across the whole a-grid x U-range.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   SCALAR COVER ONLY. This certifies the degree-0 pointwise/diagonal residual
 *   deficit is zero -- the same SCALAR statement imp-3007 makes, now cross-checked
 *   by an independent rule over a wider grid. The OPERATOR step (the off-diagonal
 *   endpoint-Hankel R = Gpass^{-1/2} Gshear Gpass^{-1/2} contraction, the RH-hard
 *   content) is explicitly OUT OF SCOPE and untouched. STRUCTURAL / DIAGNOSTIC,
 *   RH-EQUIVALENT, NOT a reduction, NOT a proof. Platt-Trudgian Lambda <= 0.2
 *   remains the rigorous SOTA. No false QED.
 *
 *   @see imp-3007-mupass-overflow-cover.js (the closed-form cover + midpoint tripwire)
 *   @see imp-2686-mupass-construction.js (the cosh-completion + pointwise margin)
 *
 *   Ticket: imp-3065 (numerical, medium).
 */

const A_GRID = Object.freeze([1.0, 0.5, 0.25, 0.2, 0.1, 0.05, 0.02]);
const U_GRID = Object.freeze([4, 6, 8, 10]);
const M = 1000; // composite-Simpson panels (even); independent of imp-3007 N=200 midpoint
const ASINH1 = Math.asinh(1); // a*tau_star solves sinh(a*tau_star) = 1

/**
 * Composite Simpson integral of f over [0, U] with M (even) panels.
 * Independent of the imp-3007 midpoint rule.
 */
function simpson(f, U, m) {
  const h = U / m;
  let s = f(0) + f(U);
  for (let k = 1; k < m; k++) {
    s += (k % 2 === 0 ? 2 : 4) * f(k * h);
  }
  return (s * h) / 3;
}

/**
 * One quadrature cell at shear weight a and cutoff U (degree-0 Lebesgue measure).
 *   nu(tau)     = sinh(a*tau)            (shear weight)
 *   w^pass(tau) = cosh(a*tau)            (endpoint-bridge cosh-completion)
 * Reports the independently-recomputed raw overflow deficit, the Simpson residual
 * deficit (= 0 exactly), the integrator-validation companion against the non-zero
 * signed closed form, and the covered fraction (= 1).
 */
function quadCell(a, U) {
  const tauStar = ASINH1 / a;          // sinh(a*tauStar) = 1
  const hasOverflow = tauStar < U;

  // Raw degree-0 overflow deficit on [tauStar, U] (independent closed form):
  //   int_{tauStar}^U (sinh(a*tau) - 1) d(tau) = [cosh(a*tau)/a - tau].
  const rawDeficit = hasOverflow
    ? (Math.cosh(a * U) / a - U) - (Math.cosh(a * tauStar) / a - tauStar)
    : 0;

  // (A) Clamped residual deficit by Simpson: integrand max(0, sinh - cosh).
  //     Every node value is 0 (sinh - cosh = -e^{-a*tau} < 0), so the sum is exactly 0.
  const residualDeficitNumeric =
    simpson((tau) => Math.max(0, Math.sinh(a * tau) - Math.cosh(a * tau)), U, M);

  // (B) Integrator validation on the NON-ZERO signed companion sinh - cosh = -e^{-a*tau}:
  //     Simpson value vs exact closed form -(1 - e^{-a*U})/a. Proves the rule is accurate
  //     on a non-trivial function of the same family (so the clamped zero is real).
  const signedIntegralNumeric =
    simpson((tau) => Math.sinh(a * tau) - Math.cosh(a * tau), U, M);
  const signedIntegralClosed = -(1 - Math.exp(-a * U)) / a;
  const integratorRelError =
    Math.abs(signedIntegralNumeric - signedIntegralClosed) / Math.abs(signedIntegralClosed);

  // Covered fraction: the bridge removes 100% of the raw overflow.
  const coveredFraction = rawDeficit > 0 ? (rawDeficit - residualDeficitNumeric) / rawDeficit : 1;

  return Object.freeze({
    a,
    U,
    tauStar,
    hasOverflow,
    rawDeficit,
    residualDeficitNumeric,      // = 0 exactly (Simpson, M = 1000)
    signedIntegralNumeric,       // non-zero companion (integrator validation)
    signedIntegralClosed,        // -(1 - e^{-a*U})/a
    integratorRelError,          // < 1e-6 -> integrator demonstrably accurate
    coveredFraction,             // = 1
  });
}

const CELLS = Object.freeze(
  A_GRID.flatMap((a) => U_GRID.map((U) => quadCell(a, U)))
);

const WORST_INTEGRATOR_REL_ERROR = CELLS.reduce((m, c) => Math.max(m, c.integratorRelError), 0);

export const IMP3065_RESIDUAL_DEFICIT_QUADRATURE = Object.freeze({
  id: 'imp-3065-residual-deficit-quadrature-2026-06-30',
  ticket: 'imp-3065',
  relatedCover: 'imp-3007-mupass-overflow-cover.js',
  relatedConstruction: 'imp-2686-mupass-construction.js',

  summary:
    'Independent quadrature cross-check of the degree-0 post-bridge residual deficit ' +
    'D_pass(a, U) = int_0^U max(0, sinh(a*tau) - cosh(a*tau)) d(tau). Using COMPOSITE ' +
    'SIMPSON (M = 1000 panels, distinct from the imp-3007 midpoint rule) over an a-grid ' +
    '{1, 0.5, 0.25, 0.2, 0.1, 0.05, 0.02} crossed with a U-range {4, 6, 8, 10} -- 28 cells ' +
    'in all -- the residual deficit is EXACTLY 0 in every cell. To rule out a degenerate ' +
    'integrator the SAME rule is validated against the non-zero signed companion ' +
    'int_0^U (sinh - cosh) = -(1 - e^{-a*U})/a, reproduced to < 1e-6 relative everywhere. ' +
    'With the independently recomputed raw overflow deficit strictly positive, the covered ' +
    'fraction is 1 EXACTLY across the whole grid. SCALAR cover only; the off-diagonal ' +
    'operator step is out of scope. RH-EQUIVALENT; STRUCTURAL/DIAGNOSTIC; NOT a reduction.',

  method: Object.freeze({
    measure: 'degree-0 (Lebesgue on lag tau over [0, U]), the RH-equivalent scale class',
    residualDeficitFunctional: 'int_0^U max(0, sinh(a*tau) - cosh(a*tau)) d(tau) = 0 (exact)',
    integrator: 'composite Simpson, M = 1000 panels (independent of imp-3007 midpoint N = 200)',
    integratorValidation: 'int_0^U (sinh - cosh) d(tau) = -(1 - e^{-a*U})/a, matched to < 1e-6 relative',
    rawDeficitFunctional: 'int_{tau_star}^U (sinh(a*tau) - 1) d(tau) = [cosh(a*tau)/a - tau]',
    crossoverTauStar: 'tau_star = arcsinh(1)/a',
    aGrid: A_GRID,
    uGrid: U_GRID,
    cellCount: A_GRID.length * U_GRID.length,
    selfComputing: true,
  }),

  cells: CELLS,
  worstIntegratorRelError: WORST_INTEGRATOR_REL_ERROR,

  remainingGap: Object.freeze({
    scalarCoverCrossChecked: true,
    operatorStepOpen: true,
    whatRemains:
      'the RH-equivalent operator positivity K_a >= 0, i.e. the off-diagonal endpoint-Hankel ' +
      'R = Gpass^{-1/2} Gshear Gpass^{-1/2} contraction -- untouched and out of scope here',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    scalarCoverOnly: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3065_RESIDUAL_DEFICIT_QUADRATURE_ASSERTIONS = [
  {
    id: 'imp3065-cell-count',
    why: 'One cell per (a, U) in the 7 x 4 grid; a mis-count means the self-computing sweep ' +
         'dropped or duplicated a cell.',
    holds: () => CELLS.length === A_GRID.length * U_GRID.length && CELLS.length === 28,
  },
  {
    id: 'imp3065-residual-deficit-exactly-zero',
    why: 'The cover, cross-checked by an INDEPENDENT rule: composite Simpson of ' +
         'max(0, sinh - cosh) is EXACTLY 0 in every cell (every node is clamped to 0 since ' +
         'sinh - cosh = -e^{-a*tau} < 0). A non-zero value would refute the cover.',
    holds: () => CELLS.every((c) => c.residualDeficitNumeric === 0),
  },
  {
    id: 'imp3065-integrator-validated-on-nonzero-companion',
    why: 'The zero is real, not a broken integrator: the SAME Simpson rule reproduces the ' +
         'NON-ZERO signed companion int_0^U (sinh - cosh) = -(1 - e^{-a*U})/a to < 1e-6 ' +
         'relative in every cell -- so it would have reported a positive deficit had one existed.',
    holds: () => CELLS.every((c) => c.integratorRelError < 1e-6),
  },
  {
    id: 'imp3065-covered-fraction-is-one',
    why: 'With residual deficit 0 and raw deficit recomputed independently, the bridge removes ' +
         '100% of the raw overflow: coveredFraction = 1 EXACTLY in every cell (1 by convention ' +
         'where no overflow exists).',
    holds: () => CELLS.every((c) => c.coveredFraction === 1),
  },
  {
    id: 'imp3065-raw-overflow-strictly-positive-where-it-exists',
    why: 'At least one cell must carry a genuine raw overflow (rawDeficit > 0) so that ' +
         'coveredFraction = 1 is a non-vacuous statement, not merely the empty-overflow convention.',
    holds: () => CELLS.some((c) => c.hasOverflow && c.rawDeficit > 0),
  },
  {
    id: 'imp3065-signed-companion-is-negative',
    why: 'The signed companion sinh - cosh = -e^{-a*tau} is strictly negative, so its integral ' +
         'is strictly negative in every cell; this is exactly why the CLAMPED deficit vanishes.',
    holds: () => CELLS.every((c) => c.signedIntegralClosed < 0 && c.signedIntegralNumeric < 0),
  },
  {
    id: 'imp3065-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: this is a SCALAR cross-check, RH-EQUIVALENT, structural/diagnostic, ' +
         'not a proof, not a reduction below RH, the operator step stays open, and PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3065_RESIDUAL_DEFICIT_QUADRATURE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.scalarCoverOnly === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota) &&
        IMP3065_RESIDUAL_DEFICIT_QUADRATURE.remainingGap.operatorStepOpen === true
      );
    },
  },
];

for (const a of IMP3065_RESIDUAL_DEFICIT_QUADRATURE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3065-residual-deficit-quadrature assertion failed: ${a.id}`);
}

export default IMP3065_RESIDUAL_DEFICIT_QUADRATURE;
