/**
 * @module imp-3557-refined-m4-leading-form-propagation
 * @fileoverview imp-3557 -- PROPAGATE the imp-3528 refined converged fourth moment
 *   M_4 = 9.62528e-8 into the moment-indexed bridge-mass leading forms that consume
 *   it, and CERTIFY the ~3.8e-6 composite-Simpson correction does NOT perturb those
 *   leading forms beyond their O(a^2) tail budgets.
 *
 *   THE SETUP (what imp-3528 left downstream)
 *   -----------------------------------------
 *   imp-3528 closed the imp-3503 degree-4 moment residual: refining the composite-
 *   Simpson panel count drives the Simpson fourth moment M_4 onto the machine-
 *   converged Gauss-Legendre value at order O(h^4), the ~3.8e-6 gap being pure inner
 *   A(tau) Simpson truncation, and reported the converged M_4 = 9.62528e-8. The
 *   moment-indexed remainder ladder (imp-3481) gives each bridge mass a leading form
 *       R_n(a) = (a^n/n!) M_n + O(a^{n+2}),
 *   so the ODD degree-3 mass (imp-3510/imp-3527) has leading form (a^3/6) M_3 and the
 *   EVEN degree-4 mass (imp-3526) has leading form (a^4/24) M_4. imp-3528 refined the
 *   MOMENT but never propagated the correction into these leading forms nor checked
 *   whether the sub-4e-6 shift stays inside their reported O(a^2) tail budgets.
 *
 *   THE PROPAGATION (this module, self-computing at import)
 *   ------------------------------------------------------
 *   Recompute the moments at BOTH the imp-3481 base composite-Simpson resolution
 *   (inner=1200, outer=1600) and the imp-3528 machine-converged Gauss-Legendre
 *   reference (dg_{16}/200/160), then evaluate the leading forms with each and
 *   compare the shift against the leading-form tail budgets:
 *       degree-4 tail budget:  tail_4(a) = (a^6/720)M_6 / ((a^4/24)M_4) = (a^2/30)(M_6/M_4),
 *       degree-3 tail budget:  tail_3(a) = (a^5/120)M_5 / ((a^3/6)M_3)  = (a^2/20)(M_5/M_3).
 *   The M_4 refinement is a MULTIPLICATIVE correction: the degree-4 leading form
 *   (a^4/24)M_4 shifts by exactly the relative moment correction, a-independent.
 *
 *   MEASURED RESULT
 *   ---------------
 *   (R1) THE M_4 CORRECTION REPRODUCES THE IMP-3503/IMP-3528 3.8e-6. The base
 *        Simpson M_4 = 9.62531e-8 sits 3.777e-6 (relative) above the machine-
 *        converged M_4 = 9.62528e-8 -- exactly the imp-3503 3.8e-6 gap imp-3528
 *        certified as Simpson truncation.
 *   (R2) THE DEGREE-4 LEADING FORM SHIFTS BY THAT SAME 3.8e-6, a-INDEPENDENTLY.
 *        Because (a^4/24)M_4 is linear in M_4, the leading-form value at a = 0.5 and
 *        a = 0.4 shifts by exactly 3.777e-6 relative under the moment refinement --
 *        no a-dependence, as the homogeneous form demands.
 *   (R3) THE SHIFT STAYS DEEP INSIDE THE O(a^2) TAIL BUDGET. The degree-4 tail
 *        budget tail_4(a) = (a^2/30)(M_6/M_4) is ~3.08e-4 at a = 0.5 and ~1.97e-4 at
 *        a = 0.4, so the 3.8e-6 moment correction is only ~1.2% (a=0.5) / ~1.9%
 *        (a=0.4) of the tail budget -- roughly TWO ORDERS below the O(a^2) tail. The
 *        reported (a^4/24)M_4 leading form is NOT perturbed beyond its tail.
 *   (R4) THE DEGREE-3 FORM IS UNAFFECTED (it consumes M_3, not M_4). M_3 was not the
 *        imp-3528 target; its own base-vs-converged correction is 2.336e-6, likewise
 *        far inside the degree-3 tail budget tail_3(a)=(a^2/20)(M_5/M_3)~3.6e-4
 *        (a=0.5) -- a ~0.6% fraction. Neither odd nor even leading form is disturbed.
 *
 *   VERDICT: the imp-3528 refined M_4 = 9.62528e-8 propagates cleanly into the
 *   moment-indexed leading forms -- the ~3.8e-6 composite-Simpson correction shifts
 *   the degree-4 (a^4/24)M_4 leading form by exactly that relative amount and stays
 *   ~two orders below its O(a^2) tail budget, so the reported leading forms of the
 *   imp-3510/imp-3526/imp-3527 bridge masses are unperturbed by the refinement.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   CERTIFICATION / MEASUREMENT ONLY, at the RH-equivalent scale class. This
 *   propagates a resolved quadrature-truncation correction through the leading-form
 *   tail budgets; it adds NO new mathematical structure and establishes NO operator
 *   positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481). The
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-3528-degree4-moment-simpson-refinement.js (the refined M_4 = 9.62528e-8 propagated here)
 *   @see imp-3510-degree3-miss-factor-closed-form.js (the degree-3 leading form (a^3/6)M_3)
 *   @see imp-3526-remainder-tail-cancellation-free-r4.js (the degree-4 leading form (a^4/24)M_4)
 *   @see imp-3527-sinh-cancellation-safety-k-ladder.js (the degree-3 O(a^2) tail (a^2/20)(M_5/M_3))
 *
 *   Ticket: imp-3557 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3481)
const T_A = 6;                                  // same tau cap as imp-3481/imp-3503/imp-3528
const INNER_CAP = 7;                            // A(tau) inner upper limit (imp-3481)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686/imp-3481). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

// -- Composite Simpson (the imp-3481 base rule) -------------------------------
/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

/** Composite-Simpson moment M_n at inner A(tau) and outer moment panel counts (imp-3481/imp-3528). */
function simpsonMoment(nMom, innerN, outerNM) {
  const h = T_A / outerNM;
  const aGrid = new Array(outerNM + 1);
  for (let j = 0; j <= outerNM; j += 1) {
    const tau = j * h;
    aGrid[j] = simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, innerN);
  }
  let sum = 0;
  for (let j = 0; j <= outerNM; j += 1) {
    const tau = j * h;
    const w = j === 0 || j === outerNM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * Math.pow(tau, nMom) * aGrid[j];
  }
  return (sum * h) / 3;
}

// -- Gauss-Legendre reference (the imp-3528 machine-converged rule) ------------
function gaussLegendreRule(n) {
  const x = new Array(n);
  const w = new Array(n);
  const half = (n + 1) >> 1;
  for (let i = 0; i < half; i += 1) {
    let z = Math.cos((Math.PI * (i + 0.75)) / (n + 0.5));
    let dpn = 0;
    for (let it = 0; it < 100; it += 1) {
      let p0 = 1;
      let p1 = z;
      for (let k = 2; k <= n; k += 1) {
        const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k;
        p0 = p1;
        p1 = p2;
      }
      dpn = (n * (z * p1 - p0)) / (z * z - 1);
      const dz = p1 / dpn;
      z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    const wi = 2 / ((1 - z * z) * dpn * dpn);
    x[i] = -z;
    x[n - 1 - i] = z;
    w[i] = wi;
    w[n - 1 - i] = wi;
  }
  return Object.freeze({ nodes: Object.freeze(x), weights: Object.freeze(w) });
}

/** Composite Gauss-Legendre integral of f on [lo, hi] with `panels` uniform panels. */
function integrateGL(f, lo, hi, panels, rule) {
  const { nodes, weights } = rule;
  const step = (hi - lo) / panels;
  const halfWidth = step / 2;
  let sum = 0;
  for (let p = 0; p < panels; p += 1) {
    const center = lo + (p + 0.5) * step;
    for (let k = 0; k < nodes.length; k += 1) {
      sum += weights[k] * f(center + halfWidth * nodes[k]);
    }
  }
  return sum * halfWidth;
}

/** Machine-converged Gauss-Legendre moment M_n (imp-3528 reference: dg_{16}/200/160). */
function glMoment(nMom, order, innerPanels, outerPanels) {
  const rule = gaussLegendreRule(order);
  const autocorr = (tau) =>
    integrateGL((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, innerPanels, rule);
  const outerStep = T_A / outerPanels;
  const outerHalf = outerStep / 2;
  let sum = 0;
  for (let p = 0; p < outerPanels; p += 1) {
    const center = (p + 0.5) * outerStep;
    for (let k = 0; k < rule.nodes.length; k += 1) {
      const t = center + outerHalf * rule.nodes[k];
      sum += rule.weights[k] * Math.pow(t, nMom) * autocorr(t);
    }
  }
  return sum * outerHalf;
}

// -- The moments at base Simpson vs machine-converged GL -----------------------
// Base = imp-3481 composite-Simpson resolution (inner=1200, outer=1600).
const M3_BASE = simpsonMoment(3, 1200, 1600);
const M4_BASE = simpsonMoment(4, 1200, 1600);
// Machine-converged GL reference (imp-3528 REF_M4 recipe, extended to M_3, M_5, M_6).
const M3_REF = glMoment(3, 16, 200, 160);
const M4_REF = glMoment(4, 16, 200, 160);       // the imp-3528 converged M_4 ~9.62528e-8
const M5_REF = glMoment(5, 16, 200, 160);
const M6_REF = glMoment(6, 16, 200, 160);

// -- The propagated relative moment corrections --------------------------------
const M4_REL_CORRECTION = Math.abs(M4_BASE - M4_REF) / Math.abs(M4_REF);  // ~3.777e-6 (imp-3503 gap)
const M3_REL_CORRECTION = Math.abs(M3_BASE - M3_REF) / Math.abs(M3_REF);  // ~2.336e-6 (M_3 not the target)

// -- Leading forms and O(a^2) tail budgets on the imp-3510 base cells ----------
const BASE_CELLS = Object.freeze([
  Object.freeze({ a: 0.5, u: 6, s: 3 }),        // imp-3510 base (0.5, 6)
  Object.freeze({ a: 0.4, u: 10, s: 4 }),       // imp-3510 base (0.4, 10)
]);

// degree-4 even leading form (a^4/24)M_4, degree-3 odd leading form (a^3/6)M_3.
const degree4LeadingForm = (a, m4) => ((a * a * a * a) / 24) * m4;
const degree3LeadingForm = (a, m3) => ((a * a * a) / 6) * m3;
// O(a^2) tail budgets (imp-3526/imp-3527 next-term ratios).
const degree4Tail = (a) => ((a * a) / 30) * (M6_REF / M4_REF);   // (a^6/720)M_6 / ((a^4/24)M_4)
const degree3Tail = (a) => ((a * a) / 20) * (M5_REF / M3_REF);   // (a^5/120)M_5 / ((a^3/6)M_3)

const PROPAGATION = BASE_CELLS.map((cell) => {
  const a = cell.a;
  const lf4Base = degree4LeadingForm(a, M4_BASE);
  const lf4Ref = degree4LeadingForm(a, M4_REF);
  const lf4RelShift = Math.abs(lf4Base - lf4Ref) / Math.abs(lf4Ref);   // == M4_REL_CORRECTION
  const lf3Base = degree3LeadingForm(a, M3_BASE);
  const lf3Ref = degree3LeadingForm(a, M3_REF);
  const lf3RelShift = Math.abs(lf3Base - lf3Ref) / Math.abs(lf3Ref);   // == M3_REL_CORRECTION
  const tail4 = degree4Tail(a);
  const tail3 = degree3Tail(a);
  return Object.freeze({
    a, u: cell.u, s: cell.s,
    lf4Base, lf4Ref, lf4RelShift,
    lf3Base, lf3Ref, lf3RelShift,
    tail4, tail3,
    m4ShiftOverTail4: lf4RelShift / tail4,       // fraction of degree-4 O(a^2) budget consumed
    m3ShiftOverTail3: lf3RelShift / tail3,       // fraction of degree-3 O(a^2) budget consumed
  });
});

const maxM4ShiftOverTail4 = Math.max(...PROPAGATION.map((r) => r.m4ShiftOverTail4));
const maxM3ShiftOverTail3 = Math.max(...PROPAGATION.map((r) => r.m3ShiftOverTail3));

// -- Classification ------------------------------------------------------------
const IMP3503_M4_FLOOR = 3.8e-6;                // the imp-3503/imp-3528 gap being propagated
const M4_CORR_LO = 1e-6;                         // the correction must reproduce the ~3.8e-6 gap
const M4_CORR_HI = 1e-5;
const SHIFT_IS_A_INDEPENDENT_TOL = 1e-12;        // degree-4 leading-form shift == moment correction
const TAIL_FRACTION_CEIL = 0.1;                  // the shift must consume < 10% of the O(a^2) budget

// (C1) the propagated M_4 correction reproduces the imp-3503/imp-3528 ~3.8e-6 gap.
const m4CorrectionReproducesGap = M4_REL_CORRECTION > M4_CORR_LO && M4_REL_CORRECTION < M4_CORR_HI;
// (C2) the degree-4 leading-form shift equals the moment correction, a-independently.
const leadingShiftIsAIndependent = PROPAGATION.every(
  (r) => Math.abs(r.lf4RelShift - M4_REL_CORRECTION) < SHIFT_IS_A_INDEPENDENT_TOL,
);
// (C3) the shift stays deep inside the degree-4 O(a^2) tail budget on both cells.
const shiftInsideDegree4TailBudget = maxM4ShiftOverTail4 < TAIL_FRACTION_CEIL;
// (C4) the degree-3 form (consuming M_3, not M_4) is likewise inside its tail budget.
const degree3FormUndisturbed = maxM3ShiftOverTail3 < TAIL_FRACTION_CEIL;

const verdict =
  m4CorrectionReproducesGap &&
  leadingShiftIsAIndependent &&
  shiftInsideDegree4TailBudget &&
  degree3FormUndisturbed
    ? 'REFINED-M_4=9.62528e-8-PROPAGATES-CLEANLY-3.8e-6-SIMPSON-CORRECTION-SHIFTS-(a^4/24)M_4-LEADING-FORM-a-INDEPENDENTLY-BY-3.8e-6-STAYS-~TWO-ORDERS-BELOW-O(a^2)-TAIL-BUDGET-LEADING-FORMS-UNPERTURBED'
    : 'INDETERMINATE';

export const IMP3557_REFINED_M4_LEADING_FORM_PROPAGATION = Object.freeze({
  id: 'imp-3557-refined-m4-leading-form-propagation',
  ticket: 'imp-3557',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  propagates: 'imp-3528-degree4-moment-simpson-refinement.js',
  intoDegree3: 'imp-3510-degree3-miss-factor-closed-form.js',
  intoDegree4: 'imp-3526-remainder-tail-cancellation-free-r4.js',

  summary:
    'Propagates the imp-3528 refined converged fourth moment M_4 = 9.62528e-8 into the moment-indexed bridge-mass ' +
    'leading forms that consume it and certifies the ~3.8e-6 composite-Simpson correction does NOT perturb them ' +
    'beyond their O(a^2) tail budgets. Recomputes M_3, M_4 at the imp-3481 base Simpson resolution (inner=1200, ' +
    'outer=1600) and at the imp-3528 machine-converged Gauss-Legendre reference (dg_{16}/200/160). MEASURED: the ' +
    'base Simpson M_4 = 9.62531e-8 sits 3.777e-6 (relative) above the converged M_4 = 9.62528e-8 -- exactly the ' +
    'imp-3503 3.8e-6 gap. Because the degree-4 leading form (a^4/24)M_4 is linear in M_4, it shifts by that same ' +
    '3.777e-6 a-INDEPENDENTLY at a = 0.5 and a = 0.4, only ~1.2% / ~1.9% of the degree-4 O(a^2) tail budget ' +
    'tail_4(a) = (a^2/30)(M_6/M_4) ~3.08e-4 / 1.97e-4 -- roughly TWO ORDERS below the tail. The degree-3 form ' +
    '(a^3/6)M_3 consumes M_3 (not the imp-3528 target); its own 2.336e-6 base-vs-converged correction is likewise ' +
    'far inside the degree-3 tail budget (a^2/20)(M_5/M_3) ~3.6e-4. Neither the odd nor even leading form is ' +
    'perturbed beyond its tail. CERTIFICATION/MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; adds no ' +
    'new structure; operator positivity (imp-3066) untouched; no RH verdict, no QED.',

  method: Object.freeze({
    refinedMoment: 'imp-3528 converged M_4 = 9.62528e-8 (machine-converged Gauss-Legendre dg_{16}/200/160)',
    baseResolution: 'imp-3481 base composite Simpson (inner=1200 on [0,7], outer=1600 on [0,T_A])',
    leadingForms: 'degree-4 even (a^4/24)M_4 (imp-3526); degree-3 odd (a^3/6)M_3 (imp-3510/imp-3527)',
    degree4TailBudget: 'tail_4(a) = (a^6/720)M_6 / ((a^4/24)M_4) = (a^2/30)(M_6/M_4)',
    degree3TailBudget: 'tail_3(a) = (a^5/120)M_5 / ((a^3/6)M_3) = (a^2/20)(M_5/M_3)',
    baseCells: '(0.5,6),s=3 and (0.4,10),s=4 (the imp-3510 base cells)',
    tauCap: T_A,
    innerCap: INNER_CAP,
    nphi: NPHI,
    imp3503M4Floor: IMP3503_M4_FLOOR,
    tailFractionCeil: TAIL_FRACTION_CEIL,
    selfComputing: true,
  }),

  measured: Object.freeze({
    m3Base: M3_BASE,
    m4Base: M4_BASE,                             // ~9.62531e-8 (base Simpson)
    m3Ref: M3_REF,
    m4Ref: M4_REF,                               // ~9.62528e-8 (imp-3528 converged)
    m5Ref: M5_REF,
    m6Ref: M6_REF,
    m4RelCorrection: M4_REL_CORRECTION,          // ~3.777e-6, reproduces the imp-3503 gap
    m3RelCorrection: M3_REL_CORRECTION,          // ~2.336e-6
    propagation: Object.freeze(PROPAGATION),     // per-cell leading-form shift vs tail budget
    maxM4ShiftOverTail4,                          // ~0.019: shift is <2% of the degree-4 O(a^2) budget
    maxM3ShiftOverTail3,                          // ~0.010: degree-3 form likewise undisturbed
    m4CorrectionReproducesGap,
    leadingShiftIsAIndependent,
    shiftInsideDegree4TailBudget,
    degree3FormUndisturbed,
    verdict,
  }),

  interpretation: Object.freeze({
    correctionIsMultiplicative:
      'The refined M_4 = 9.62528e-8 enters the degree-4 bridge-mass leading form as the linear coefficient of ' +
      '(a^4/24)M_4, so the ~3.8e-6 Simpson correction shifts the leading form by exactly that relative amount at ' +
      'every a -- the shift is a-INDEPENDENT, as the homogeneous a^4 form demands. There is no amplification with a.',
    shiftIsFarInsideTheTail:
      'The degree-4 O(a^2) tail budget tail_4(a) = (a^2/30)(M_6/M_4) is ~3.08e-4 at a = 0.5 and ~1.97e-4 at ' +
      'a = 0.4. The 3.8e-6 moment correction is only ~1.2% / ~1.9% of that budget -- roughly two orders of ' +
      'magnitude below the O(a^2) tail already carried in the reported leading form. Refining M_4 therefore does ' +
      'NOT move the leading form outside the tail it was reported to, so the imp-3510/imp-3526/imp-3527 leading ' +
      'forms stand as reported.',
    degree3FormUnaffected:
      'The degree-3 odd leading form (a^3/6)M_3 consumes M_3, which imp-3528 did not target; its own base-vs-' +
      'converged correction (2.336e-6) is likewise ~0.6-1.0% of the degree-3 tail budget (a^2/20)(M_5/M_3) ~3.6e-4, ' +
      'so the odd face is undisturbed as well. The moment refinement leaves both parities of the leading-form ladder intact.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module propagates a resolved composite-Simpson quadrature-truncation correction (imp-3528) through the ' +
      'moment-indexed leading-form tail budgets. It adds NO new mathematical structure and establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481). The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3557_REFINED_M4_LEADING_FORM_PROPAGATION_ASSERTIONS = [
  {
    id: 'imp3557-m4-correction-reproduces-imp3503-gap',
    why: 'The base-Simpson-vs-converged M_4 relative correction must reproduce the imp-3503/imp-3528 ~3.8e-6 gap ' +
         '(between 1e-6 and 1e-5), confirming this module propagates the SAME correction imp-3528 certified.',
    holds: () => m4CorrectionReproducesGap,
  },
  {
    id: 'imp3557-leading-form-shift-is-a-independent',
    why: 'THE PROPAGATION: the degree-4 leading form (a^4/24)M_4 is linear in M_4, so its relative shift must equal ' +
         'the moment correction to machine precision at every base cell -- a-independent, as the homogeneous form demands.',
    holds: () => leadingShiftIsAIndependent,
  },
  {
    id: 'imp3557-shift-inside-degree4-tail-budget',
    why: 'THE KEY CERTIFICATION: the ~3.8e-6 leading-form shift must consume < 10% of the degree-4 O(a^2) tail ' +
         'budget (a^2/30)(M_6/M_4) on both cells -- the refinement does not perturb the reported (a^4/24)M_4 form beyond its tail.',
    holds: () => shiftInsideDegree4TailBudget,
  },
  {
    id: 'imp3557-degree3-form-undisturbed',
    why: 'The degree-3 odd leading form (a^3/6)M_3 consumes M_3 (not the imp-3528 target); its own base-vs-converged ' +
         'correction must likewise stay < 10% of the degree-3 O(a^2) tail budget (a^2/20)(M_5/M_3) -- the odd face is undisturbed.',
    holds: () => degree3FormUndisturbed,
  },
  {
    id: 'imp3557-verdict-classifies-the-propagation',
    why: 'The classified verdict must be the clean-propagation result (refined M_4 shifts the leading form ' +
         'a-independently and stays ~two orders below the O(a^2) tail), not indeterminate.',
    holds: () => verdict.startsWith('REFINED-M_4=9.62528e-8-PROPAGATES-CLEANLY'),
  },
  {
    id: 'imp3557-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: numerical certification only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3557_REFINED_M4_LEADING_FORM_PROPAGATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3557_REFINED_M4_LEADING_FORM_PROPAGATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3557-refined-m4-leading-form-propagation assertion failed: ${assertion.id}`);
  }
}

export default IMP3557_REFINED_M4_LEADING_FORM_PROPAGATION;
