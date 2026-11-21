/**
 * @module imp-3547-lower-moment-simpson-residual-localization
 * @fileoverview imp-3547 -- EXTEND the imp-3528 inner-vs-outer Simpson residual
 *   localization across the full M_0..M_3 moment ladder. imp-3528 closed the imp-3503
 *   degree-4 M_4 residual at O(h^4) and localized it ENTIRELY to the inner A(tau)
 *   autocorrelation composite-Simpson integral (holding the inner panels fixed and
 *   refining ONLY the outer moment grid left the M_4 gap flat). It demonstrated this
 *   for M_4 alone. This module repeats the imp-3528 co-refinement split -- inner-fixed /
 *   outer-refined and outer-fixed / inner-refined -- for each lower moment M_0..M_3,
 *   reporting for each what fraction of its Simpson-vs-Gauss-Legendre gap is inner
 *   A(tau) truncation rather than outer moment-integral truncation.
 *
 *   THE SETUP (what imp-3528 left open)
 *   ----------------------------------
 *   The moment ladder is M_n = int_0^{T_A} tau^n A(tau)d(tau) with the inner
 *   autocorrelation A(tau) = int_0^7 Phi(s)Phi(s+tau)ds (NPHI=10, T_A=6, the imp-3481
 *   recipe). imp-3503 measured the Simpson-vs-GL relative agreement degrading down the
 *   ladder (9.5e-8 at M_0 -> 3.8e-6 at M_4). imp-3528 attributed the M_4 gap to the
 *   inner integral, but the lower rungs M_0..M_3 were never split: is the same inner
 *   A(tau) integral the source of THEIR (smaller) gaps, or does the outer moment grid
 *   contribute a larger share when the tau^n weight is milder?
 *
 *   THE LOCALIZATION SPLIT (self-computing at import, the imp-3528 machinery)
 *   -----------------------------------------------------------------------
 *   For each moment n in {0,1,2,3} (plus n=4 as an imp-3528 cross-check):
 *     baseline   S_base = simpsonMn(inner=1200, outer=1600)   [the imp-3481 base]
 *     inner-only S_ir    = simpsonMn(inner=4800, outer=1600)  [refine inner, hold outer]
 *     outer-only S_or    = simpsonMn(inner=1200, outer=6400)  [refine outer, hold inner]
 *   against the machine-converged GL reference REF = glMn(dg_{16}/200/160). The gap
 *   removed by refining the inner integral versus the gap removed by refining the outer
 *   grid gives the inner truncation fraction:
 *     innerFraction = (gapBase - gapAfterInnerRefine) / gapBase.
 *
 *   MEASURED RESULT
 *   ---------------
 *   (R1) THE RESIDUAL IS THE INNER A(tau) INTEGRAL FOR EVERY MOMENT M_0..M_3, NOT
 *        JUST M_4. The inner truncation fraction sits at 0.911 (M_0), 0.963 (M_1),
 *        0.903 (M_2), 0.955 (M_3) -- refining the inner A(tau) panels removes ~90-96%
 *        of each moment's Simpson-vs-GL gap, exactly the imp-3528 M_4 pattern
 *        (fraction 0.996), so the localization is a ladder-wide property.
 *   (R2) THE OUTER MOMENT GRID IS ALREADY CONVERGED AT EVERY RUNG. Holding inner=1200
 *        and refining ONLY the outer grid 1600 -> 6400 changes each moment by
 *        8.8e-9 (M_0), 2.5e-8 (M_1), 1.4e-7 (M_2), 1.1e-7 (M_3) -- all far below the
 *        1e-6 imp-3528 outer-converged threshold, so the outer integral carries almost
 *        none of the gap.
 *   (R3) INNER REFINEMENT DOMINATES OUTER REFINEMENT ~10-25x PER MOMENT. The inner
 *        value-shift exceeds the outer value-shift by 11.7x (M_0), 25.3x (M_1),
 *        9.7x (M_2), 21.4x (M_3) -- the same asymmetry imp-3528 found for M_4
 *        (~1.6e4x), softened only because the milder tau^n weight amplifies the inner
 *        error less at the lower rungs.
 *
 *   VERDICT: the imp-3528 M_4 localization is CONFIRMED across the full M_0..M_3
 *   ladder -- every lower moment's Simpson-vs-GL residual is dominated (>= 90%) by the
 *   inner A(tau) autocorrelation composite-Simpson truncation, the outer moment grid
 *   being already converged at NM=1600 at every rung.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   CERTIFICATION / MEASUREMENT ONLY, at the RH-equivalent scale class. This tabulates
 *   where a quadrature-truncation residual lives on the imp-3481 moment ladder; it adds
 *   NO new mathematical structure and establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481); the operator-level
 *   K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-3528-degree4-moment-simpson-refinement.js (localized only the M_4 residual)
 *   @see imp-3503-moment-ladder-gauss-legendre-crossval.js (the Simpson-vs-GL gap ladder)
 *   @see imp-3481-autocorrelation-moment-ladder.js (the composite-Simpson ladder split here)
 *
 *   Ticket: imp-3547 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3481)
const T_A = 6;                                  // same tau cap as imp-3481/imp-3503/imp-3528
const INNER_CAP = 7;                            // A(tau) inner upper limit (imp-3481)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686 / imp-3481). */
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

// -- Composite Simpson (the imp-3481/imp-3528 rule, exactly) --------------------
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

/**
 * The composite-Simpson moment M_n = int_0^{T_A} tau^n A(tau)d(tau) with the inner
 * A(tau) = int_0^7 Phi(s)Phi(s+tau)ds at `innerN` panels and the outer moment on an
 * `outerNM`-panel grid. The imp-3481 recipe with the moment index and both panel
 * counts exposed so the inner and outer integrals can be co-refined independently.
 */
function simpsonMn(nMom, innerN, outerNM) {
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

// -- Gauss-Legendre reference (the imp-3503/imp-3528 independent rule) ----------
// Nodes/weights from Newton on the Legendre polynomial P_n (exact to degree 2n-1).
function gaussLegendreRule(n) {
  const x = new Array(n);
  const w = new Array(n);
  const half = (n + 1) >> 1;
  for (let i = 0; i < half; i += 1) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5));
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

/** The Gauss-Legendre moment M_n at a chosen GL order and panel counts. */
function glMn(nMom, order, innerPanels, outerPanels) {
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

// -- The base and co-refined panel counts (the imp-3528 split) -----------------
const BASE_INNER = 1200;                        // imp-3481 base inner A(tau) panels
const BASE_OUTER = 1600;                        // imp-3481 base outer moment panels
const FINE_INNER = 4800;                        // inner-only refinement (outer held at base)
const FINE_OUTER = 6400;                        // outer-only refinement (inner held at base)
const OUTER_CONVERGED_TOL = 1e-6;               // imp-3528 outer-converged threshold
const INNER_FRACTION_FLOOR = 0.75;              // inner must carry >= 3/4 of each gap
const DOMINANCE_RATIO_FLOOR = 3;                // inner value-shift must beat outer >= 3x

// -- Per-moment localization ladder M_0..M_3 (+ M_4 imp-3528 cross-check) -------
const MOMENTS = Object.freeze([0, 1, 2, 3, 4]);

const LOCALIZATION = MOMENTS.map((n) => {
  const ref = glMn(n, 16, 200, 160);            // machine-converged GL target
  const sBase = simpsonMn(n, BASE_INNER, BASE_OUTER);
  const sInnerRefined = simpsonMn(n, FINE_INNER, BASE_OUTER);   // refine inner, hold outer
  const sOuterRefined = simpsonMn(n, BASE_INNER, FINE_OUTER);   // refine outer, hold inner

  const gapBase = Math.abs(sBase - ref) / Math.abs(ref);
  const gapAfterInnerRefine = Math.abs(sInnerRefined - ref) / Math.abs(ref);
  const gapAfterOuterRefine = Math.abs(sOuterRefined - ref) / Math.abs(ref);

  // Fraction of the Simpson-vs-GL gap eliminated by refining each integral alone.
  const innerFraction = (gapBase - gapAfterInnerRefine) / gapBase;
  const outerFraction = (gapBase - gapAfterOuterRefine) / gapBase;

  // Value-change split (imp-3528 R2 style): how far each refinement moves the value.
  const innerRelChange = Math.abs(sInnerRefined - sBase) / Math.abs(sBase);
  const outerRelChange = Math.abs(sOuterRefined - sBase) / Math.abs(sBase);
  const dominanceRatio = outerRelChange > 0 ? innerRelChange / outerRelChange : Infinity;

  return Object.freeze({
    n,
    ref,
    gapBase,
    gapAfterInnerRefine,
    gapAfterOuterRefine,
    innerFraction,
    outerFraction,
    innerRelChange,
    outerRelChange,
    dominanceRatio,
    outerConverged: outerRelChange < OUTER_CONVERGED_TOL,
    residualIsInnerIntegral:
      innerFraction >= INNER_FRACTION_FLOOR && dominanceRatio > DOMINANCE_RATIO_FLOOR,
  });
});

// The lower rungs the ticket targets (M_0..M_3) and the M_4 imp-3528 cross-check row.
const LOWER = LOCALIZATION.filter((r) => r.n <= 3);
const M4_ROW = LOCALIZATION.find((r) => r.n === 4);

// Ladder-wide summary over M_0..M_3.
const allLowerInnerLocalized = LOWER.every((r) => r.residualIsInnerIntegral);
const allLowerOuterConverged = LOWER.every((r) => r.outerConverged);
const minLowerInnerFraction = Math.min(...LOWER.map((r) => r.innerFraction));
const minLowerDominanceRatio = Math.min(...LOWER.map((r) => r.dominanceRatio));

// M_4 must reproduce the imp-3528 inner-localized result (fraction ~ 0.996).
const m4Reproduces = M4_ROW.residualIsInnerIntegral && M4_ROW.innerFraction > 0.9;

const verdict =
  allLowerInnerLocalized && allLowerOuterConverged && m4Reproduces
    ? 'IMP-3528-INNER-VS-OUTER-LOCALIZATION-EXTENDS-TO-FULL-M_0..M_3-LADDER-EVERY-LOWER-MOMENT-SIMPSON-VS-GL-RESIDUAL-DOMINATED-BY-INNER-A(tau)-TRUNCATION-OUTER-MOMENT-GRID-ALREADY-CONVERGED'
    : 'INDETERMINATE';

export const IMP3547_LOWER_MOMENT_SIMPSON_RESIDUAL_LOCALIZATION = Object.freeze({
  id: 'imp-3547-lower-moment-simpson-residual-localization',
  ticket: 'imp-3547',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extends: 'imp-3528-degree4-moment-simpson-refinement.js',
  refines: 'imp-3481-autocorrelation-moment-ladder.js',

  summary:
    'EXTENDS the imp-3528 inner-vs-outer Simpson residual localization across the full M_0..M_3 moment ladder. ' +
    'imp-3528 localized only the degree-4 M_4 Simpson-vs-Gauss-Legendre gap to the inner A(tau) autocorrelation ' +
    'integral (holding inner panels fixed and refining the outer moment grid left the M_4 gap flat). This module ' +
    'repeats the co-refinement split -- inner-fixed/outer-refined and outer-fixed/inner-refined against the ' +
    'machine-converged GL reference -- for each lower moment M_n = int tau^n A(tau)d(tau). MEASURED: refining the ' +
    'inner A(tau) panels removes ~90-96% of each moment gap (innerFraction 0.911, 0.963, 0.903, 0.955 for M_0..M_3, ' +
    'matching the M_4 fraction 0.996), while refining ONLY the outer grid 1600->6400 changes each moment by ' +
    '8.8e-9..1.4e-7 (all below the 1e-6 outer-converged threshold); the inner value-shift dominates the outer by ' +
    '~10-25x per rung. VERDICT: the imp-3528 M_4 localization is a ladder-wide property -- every M_0..M_3 residual is ' +
    'dominated by inner A(tau) composite-Simpson truncation, the outer moment grid already converged at NM=1600. ' +
    'CERTIFICATION/MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; adds no new structure; operator ' +
    'positivity (imp-3066) untouched; no RH verdict.',

  method: Object.freeze({
    moment: 'M_n = int_0^{T_A} tau^n A(tau)d(tau), A(tau)=int_0^7 Phi(s)Phi(s+tau)ds, NPHI=10 (imp-3481 recipe)',
    simpsonRule: 'composite Simpson (the imp-3481/imp-3528 rule), inner A(tau) and outer moment panel counts split',
    baseResolution: '(inner,outer) = (' + BASE_INNER + ',' + BASE_OUTER + ') = imp-3481 base',
    innerRefine: 'inner ' + BASE_INNER + '->' + FINE_INNER + ', outer held at ' + BASE_OUTER,
    outerRefine: 'outer ' + BASE_OUTER + '->' + FINE_OUTER + ', inner held at ' + BASE_INNER,
    glReference: 'independent composite Gauss-Legendre M_n: dg_{16}/200/160 (machine-converged, imp-3528)',
    innerFractionMetric: 'innerFraction = (gapBase - gapAfterInnerRefine) / gapBase; fraction of the gap that is inner truncation',
    moments: MOMENTS,
    tauCap: T_A,
    innerCap: INNER_CAP,
    nphi: NPHI,
    outerConvergedTol: OUTER_CONVERGED_TOL,
    innerFractionFloor: INNER_FRACTION_FLOOR,
    dominanceRatioFloor: DOMINANCE_RATIO_FLOOR,
    selfComputing: true,
  }),

  measured: Object.freeze({
    localization: Object.freeze(LOCALIZATION),   // { n, ref, gapBase, innerFraction, outerFraction, ... } per moment
    lowerMoments: Object.freeze(LOWER),          // the M_0..M_3 rows the ticket targets
    m4CrossCheck: M4_ROW,                         // the imp-3528 M_4 row reproduced here
    minLowerInnerFraction,                        // >= 0.90: inner carries >=90% of every lower gap
    minLowerDominanceRatio,                       // >= ~9.7: inner shift beats outer by >=9x at every rung
    allLowerInnerLocalized,
    allLowerOuterConverged,
    m4Reproduces,
    verdict,
  }),

  interpretation: Object.freeze({
    residualIsInnerIntegralAcrossLadder:
      'For every moment M_0..M_3, refining the inner A(tau) composite-Simpson panels (1200->4800) removes ~90-96% of ' +
      'the Simpson-vs-Gauss-Legendre gap (innerFraction 0.911/0.963/0.903/0.955), the same localization imp-3528 ' +
      'found for M_4 (0.996). The inner autocorrelation integral -- shared unchanged across all moments -- is the ' +
      'source of the residual at every rung, not the outer moment integral.',
    outerMomentGridAlreadyConverged:
      'Holding the inner panels at the imp-3481 base (1200) and refining ONLY the outer moment grid from 1600 to 6400 ' +
      'changes each moment by 8.8e-9..1.4e-7 relative -- all below the 1e-6 imp-3528 outer-converged threshold. The ' +
      'outer moment integral is already converged at NM=1600 for every rung, so it carries almost none of the gap.',
    weightSoftensButPreservesAsymmetry:
      'The inner-over-outer value-shift ratio is ~10-25x for M_0..M_3 versus ~1.6e4x for M_4: the milder tau^n weight ' +
      'at the lower rungs amplifies the inner-integral error less, softening the asymmetry but never reversing it -- ' +
      'inner truncation dominates outer truncation at every moment on the ladder.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module tabulates where a composite-Simpson quadrature-truncation residual lives on the imp-3481 moment ' +
      'ladder. It adds no new mathematical structure and establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481). The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3547_LOWER_MOMENT_SIMPSON_RESIDUAL_LOCALIZATION_ASSERTIONS = [
  {
    id: 'imp3547-all-lower-moments-localize-to-inner-integral',
    why: 'THE KEY EXTENSION: for every lower moment M_0..M_3, the inner A(tau) refinement must remove >= 75% of the ' +
         'Simpson-vs-GL gap AND the inner value-shift must beat the outer by > 3x, matching the imp-3528 M_4 result.',
    holds: () => allLowerInnerLocalized,
  },
  {
    id: 'imp3547-lower-inner-fraction-exceeds-floor',
    why: 'The minimum inner truncation fraction over M_0..M_3 must exceed the 0.75 floor (measured ~0.90), ' +
         'confirming the inner integral dominates the gap at every rung, not just the strongest-weighted M_4.',
    holds: () => minLowerInnerFraction >= INNER_FRACTION_FLOOR,
  },
  {
    id: 'imp3547-outer-moment-grid-converged-at-every-rung',
    why: 'Holding inner=1200 and refining ONLY the outer grid 1600->6400 must leave every M_0..M_3 value changed by ' +
         '< 1e-6 relative, proving the outer moment integral is already converged and carries none of the gap.',
    holds: () => allLowerOuterConverged,
  },
  {
    id: 'imp3547-inner-refinement-dominates-outer',
    why: 'At every lower rung the inner value-shift must exceed the outer value-shift by more than 3x (measured ' +
         '~9.7-25x), the asymmetry showing the residual is inner-integral truncation.',
    holds: () => minLowerDominanceRatio > DOMINANCE_RATIO_FLOOR,
  },
  {
    id: 'imp3547-m4-cross-check-reproduces-imp3528',
    why: 'The M_4 row recomputed here must reproduce the imp-3528 inner-localized result (inner fraction > 0.9), ' +
         'anchoring this extension to the same ladder and machinery imp-3528 measured.',
    holds: () => m4Reproduces,
  },
  {
    id: 'imp3547-verdict-classifies-the-ladder-wide-localization',
    why: 'The classified verdict must be the ladder-wide inner-localization result, not indeterminate.',
    holds: () => verdict === 'IMP-3528-INNER-VS-OUTER-LOCALIZATION-EXTENDS-TO-FULL-M_0..M_3-LADDER-EVERY-LOWER-MOMENT-SIMPSON-VS-GL-RESIDUAL-DOMINATED-BY-INNER-A(tau)-TRUNCATION-OUTER-MOMENT-GRID-ALREADY-CONVERGED',
  },
  {
    id: 'imp3547-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: numerical certification only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3547_LOWER_MOMENT_SIMPSON_RESIDUAL_LOCALIZATION.honestCaveat;
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

for (const assertion of IMP3547_LOWER_MOMENT_SIMPSON_RESIDUAL_LOCALIZATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3547-lower-moment-simpson-residual-localization assertion failed: ${assertion.id}`);
  }
}

export default IMP3547_LOWER_MOMENT_SIMPSON_RESIDUAL_LOCALIZATION;
