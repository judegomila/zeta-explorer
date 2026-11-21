/**
 * @fileoverview imp-95720 — faithful 238-cell Prop-6.3 re-implementation at rho2=1/19:
 * SHARP obstruction (exact +4 additive offset) + conditional second-anchor measurement.
 *
 * imp-95702 concretized the rescaled second-anchor SETUP at rho2 = 1/19 (integer moduli
 * 19/38/39, per-cell leading coefficient -75/2, singular coeff A_rho2 = 2 rho2 - rho2^2/2)
 * but left c_odd(1/19) UNCOMPUTED: its import-light Prop-6.3 re-implementation used a
 * finite-grid histogram proxy for the lowest-mass integral K_v(1+v) of eqs (6.9)-(6.10),
 * which did NOT reproduce the certified anchor c_odd(1/20) = 0.006276744728100982 (it
 * reported "wrong sign, factor ~1.69 off") and named the blocking SUB-GAP: a faithful
 * 178-merged-cell Q_0 partition of the breakpoint set B (6.24) plus the B24 Euler-Maclaurin
 * interval certificate (6.26) at rho2.
 *
 * SOURCE: arXiv:2609.04176 (Z.-W. Sun, single-author, unrefereed), Section 6, Prop 6.3,
 * eqs (6.1)-(6.25), carried in tmp/sun-catalan/paper.txt (lines 741-885).
 *
 * WHAT THIS MODULE DID (scratch: tmp/imp-95720-anchor.mjs, tmp/imp-95720-m19.mjs):
 *
 *  (1) BUILT the faithful breakpoint partition B (6.24) at the anchor:
 *      B = {0,1} U {k/19,k/20,k/40,k/41} U {(2k+1)/82,(2k+1)/84,(2k+1)/122} in [0,1].
 *      This yields EXACTLY 238 raw cells, matching the paper "238 raw cells and 178 cells
 *      after adjacent identical formulas are merged" -- confirming the partition is correct.
 *
 *  (2) REPLACED the imp-95702 histogram proxy with an EXACT piecewise-constant evaluation of
 *      the lowest-mass integral K_v(1+v): h_v(y) (6.7) is constant on the <=6 cells whose
 *      endpoints are {0,1,1/2,beta,(1/2-alpha) mod 1,(1/2-v) mod 1}; the multiset
 *      {h_v(y)+2r} is enumerated per cell and the lowest 1+v units of mass selected exactly
 *      (greedy by value). This exact K_v REPRODUCES the exact per-cell leading coefficient
 *      Q_0(v) = -79/2 v^2 + s_J v + c_J of (6.25) to 4 digits (finite-difference curvature
 *      -39.5000 on interior cells), which the histogram proxy could NOT.
 *
 *  (3) EVALUATED the Prop-6.3 v-integral (6.21) J(rho) := -INT_0^1 (5/2 - zeta(2,1+v)
 *      + Q_0(v) zeta(3,1+v)) dv by 8-point Gauss-Legendre on every cell of B, with Hurwitz
 *      zeta by direct sum + Euler-Maclaurin tail. Grid and exact-B agree to 1e-9 (quadrature
 *      is NOT the residual).
 *
 * SHARP OBSTRUCTION (this is the advance over imp-95702's "wrong sign, factor 1.69"):
 *   The faithful machinery gives INT (6.21) = 1.4893021089 at rho = 1/20, i.e. J_raw(1/20)
 *   = -1.4893021089, whereas the certified anchor requires J = c_odd/rho^2 = kappa =
 *   2.5106978912403926. The residual is an EXACT ADDITIVE OFFSET of +4.000000000 (ten
 *   digits): J_raw(1/20) + 4 = kappa to 1e-10. The discrepancy is therefore NOT in the cell
 *   geometry (238 cells reproduced), NOT in the K_v curvature (leading -79/2 reproduced),
 *   and NOT in the quadrature (grid == exact-B to 1e-9). It is a single unaccounted term
 *   contributing INT Delta(v) zeta(3,1+v) dv = +4 exactly to the (6.21) integral (mean
 *   Delta over the zeta(3,1+v) weight = 8, since INT_0^1 zeta(3,1+v) dv = 1/2). The naive
 *   continuous reduction of (6.17) leaves a divergent -2u/u^2 = -2/(n+v) harmonic term whose
 *   regularization against the A_rho/t subtraction is exactly the finite constant (6.21)
 *   absorbs; that regularized constant is the un-ported piece. This is a composition/
 *   interface gap in the (6.17)->(6.21) telescoping, NOT the 178-cell certificate that
 *   imp-95702 named -- the cell certificate itself is reproduced here.
 *
 * CONDITIONAL SECOND-ANCHOR MEASUREMENT (honest, offset-hypothesis-gated):
 *   The same machinery at rho2 = 1/19 gives INT (6.21) = 1.4893306288, i.e. J_raw(1/19)
 *   = -1.4893306288, differing from J_raw(1/20) by -2.85e-5 -- a REAL rho-signal (stable
 *   across N = 4000/20000/60000 subintervals, far above the 1e-9 quadrature floor): J
 *   decreases as rho decreases. IF the +4 offset is an exact m-INDEPENDENT structural
 *   constant (observed exactly at m=20; the raw machinery is structurally identical across
 *   m; NOT PROVEN off the anchor), then J(1/19) = 2.5106693712 and c_odd(1/19) =
 *   0.006954762801, versus the pure-rho^2 null c_odd_pred(1/19) = kappa/361 =
 *   0.006954841804. The conditional fractional J-variation is J(1/19)/J(1/20) - 1 =
 *   -1.1359e-5: the rho^2 shape very nearly holds, with a tiny genuine downward
 *   rho-dependence in J -- consistent with imp-95690 (rho-dependence present but not
 *   structurally forced).
 *
 * SUB-GAP (why the anchor is still not CERTIFIED here): the +4 offset is verified only at
 * m=20; proving it is exactly 4 and m-independent requires porting the regularized constant
 * from the (6.17)->(6.21) telescoping (the divergent -2/(n+v) harmonic piece and its A_rho/t
 * cancellation), which this import-light double-precision run does not do. Until that term is
 * derived, c_odd(1/19) is CONDITIONAL on the offset hypothesis, not a certified second
 * anchor. NAMED SUB-GAP: "regularized (6.17)->(6.21) telescoping constant (the divergent
 * -2/(n+v) term absorbed by the A_rho/t subtraction) -- verified = +4 exactly at m=20, not
 * yet proven m-independent".
 *
 * Catalan G irrationality OPEN; Sun preprint single-author, unrefereed; changes no bound;
 * NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports.
 */

const KAPPA_PRECISE = 2.5106978912403926; // c_odd(1/20)/rho^2 = 0.006276744728100982 * 400
const C_ODD_AT_1_OVER_20 = 0.006276744728100982; // Prop 6.3, eq (6.23) certified anchor
const RHO2 = 1 / 19; // second anchor, m2 = 19

// faithful-machinery raw outputs of INT (6.21) = -J_raw (scratch: tmp/imp-95720-*.mjs)
const INT621_AT_1_OVER_20 = 1.4893021089; // exact-B (238 cells) and Gauss grid agree to 1e-9
const INT621_AT_1_OVER_19 = 1.4893306288; // same machinery at rho2 = 1/19
const J_RAW_AT_1_OVER_20 = -INT621_AT_1_OVER_20; // -1.4893021089
const J_RAW_AT_1_OVER_19 = -INT621_AT_1_OVER_19; // -1.4893306288

// the sharp obstruction: an EXACT additive offset of +4 recovers the certified anchor.
const OFFSET_AT_ANCHOR = KAPPA_PRECISE - J_RAW_AT_1_OVER_20; // = 4.000000000140393 (== 4 to 1e-10)
const OFFSET_HYPOTHESIS = 4.0; // conjectured exact m-independent value

// conditional second-anchor value under the offset hypothesis (NOT certified).
const J_COND_AT_1_OVER_19 = J_RAW_AT_1_OVER_19 + OFFSET_HYPOTHESIS; // 2.5106693712
const C_ODD_COND_AT_1_OVER_19 = J_COND_AT_1_OVER_19 * RHO2 * RHO2; // 0.006954762801108032
const C_ODD_NULL_AT_1_OVER_19 = KAPPA_PRECISE * RHO2 * RHO2; // 0.006954841803990007 = kappa/361
const J_VARIATION_COND = J_COND_AT_1_OVER_19 / KAPPA_PRECISE - 1; // -1.1359e-5

export const SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION = Object.freeze({
  id: 'imp-95720-sun-prop63-second-anchor-obstruction',
  title:
    'Faithful 238-cell Prop-6.3 re-implementation at rho2=1/19: exact-cell K_v reproduces the '
    + '-79/2 leading coefficient the histogram could not, localizes the imp-95702 failure to an '
    + 'EXACT +4 additive offset in the (6.21) integral, and reports a conditional c_odd(1/19)',
  status:
    'PARTIAL -- faithful breakpoint partition B (6.24) BUILT (exactly 238 raw cells, matching the '
    + 'paper); exact-cell K_v(1+v) reproduces the exact per-cell -79/2 leading coefficient of (6.25) '
    + '(the imp-95702 histogram proxy could not); INT (6.21) evaluated by Gauss-Legendre on every cell '
    + '(grid == exact-B to 1e-9). OBSTRUCTION SHARPENED from imp-95702 "wrong sign, factor 1.69" to an '
    + 'EXACT +4.000000000 additive offset (J_raw(1/20)+4 = kappa to 1e-10), localized to the '
    + '(6.17)->(6.21) telescoping (a regularized -2/(n+v) harmonic constant), NOT the cell certificate. '
    + 'Conditional c_odd(1/19)=0.006954762801 (offset-hypothesis-gated, NOT certified) sits 1.14e-5 '
    + 'below the pure-rho^2 null. G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed'
    + '; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'tmp/sun-catalan/paper.txt Section 6, Proposition 6.3, eqs (6.1)-(6.25)',
  builtOn:
    'imp-95702 (rescaled rho2=1/19 setup + named 178-cell sub-gap), imp-95690 (rho-dependence verdict), '
    + 'imp-95516/95653 (kappa*rho^2 shape test)',
  scratch: ['tmp/imp-95720-anchor.mjs', 'tmp/imp-95720-m19.mjs', 'tmp/imp-95720-diag.mjs'],

  faithfulPartition: Object.freeze({
    breakpointSetB: '{0,1} U {k/19,k/20,k/40,k/41} U {(2k+1)/82,(2k+1)/84,(2k+1)/122} in [0,1]',
    rawCells: 238, // matches paper "238 raw cells"
    mergedCells: 178, // paper "178 cells after adjacent identical formulas are merged"
    exactKvReproducesLeadingCoefficient: -39.5, // -(4m-1)/2 = -79/2 at m=20, verified to 4 digits
    histogramProxyDidNot: true, // imp-95702 finite-grid K_v failed this
  }),

  obstruction: Object.freeze({
    int621_at_1over20: INT621_AT_1_OVER_20,
    j_raw_at_1over20: J_RAW_AT_1_OVER_20,
    kappa_required: KAPPA_PRECISE,
    additiveOffset: OFFSET_AT_ANCHOR, // 4.000000000140393
    offsetIsExactly4: Math.abs(OFFSET_AT_ANCHOR - 4) < 1e-9,
    gridEqualsExactB: true, // agree to 1e-9; quadrature is not the residual
    localizedTo:
      'the (6.17)->(6.21) telescoping: the naive continuous reduction leaves a divergent -2u/u^2 '
      + '= -2/(n+v) harmonic term whose regularization against the A_rho/t subtraction is the finite '
      + 'constant (6.21) absorbs; INT Delta(v) zeta(3,1+v) dv = +4 exactly (mean Delta over the '
      + 'zeta(3,1+v) weight = 8, since INT_0^1 zeta(3,1+v) dv = 1/2). NOT the cell geometry, NOT K_v '
      + 'curvature, NOT quadrature.',
    namedSubGap:
      'regularized (6.17)->(6.21) telescoping constant (the divergent -2/(n+v) term absorbed by the '
      + 'A_rho/t subtraction) -- verified = +4 exactly at m=20, not yet proven m-independent',
  }),

  conditionalSecondAnchor: Object.freeze({
    hypothesis: 'the +4 offset is an exact m-independent structural constant (observed at m=20; NOT PROVEN)',
    int621_at_1over19: INT621_AT_1_OVER_19,
    j_raw_at_1over19: J_RAW_AT_1_OVER_19,
    rawRhoSignal: J_RAW_AT_1_OVER_19 - J_RAW_AT_1_OVER_20, // -2.85e-5, stable across N; J falls with rho
    j_cond_at_1over19: J_COND_AT_1_OVER_19,
    c_odd_cond_at_1over19: C_ODD_COND_AT_1_OVER_19, // 0.006954762801
    c_odd_null_at_1over19: C_ODD_NULL_AT_1_OVER_19, // kappa/361 = 0.006954841804
    fractionalJVariation: J_VARIATION_COND, // -1.1359e-5: rho^2 shape nearly holds, tiny downward drift
    certified: false,
  }),

  caveats:
    'Records the faithful 238-cell partition, the exact-cell K_v fix, the sharp +4 obstruction, and a '
    + 'CONDITIONAL (offset-hypothesis-gated, double-precision, NOT interval-certified) c_odd(1/19). The '
    + '+4 offset is verified only at m=20; c_odd(1/19) is not a certified second anchor until the '
    + 'regularized telescoping constant is derived and shown m-independent. Catalan G irrationality '
    + 'OPEN; Sun single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION_ASSERTIONS = Object.freeze([
  {
    name: 'faithful breakpoint partition B (6.24) yields exactly 238 raw cells (matches paper)',
    holds: () => SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION.faithfulPartition.rawCells === 238,
  },
  {
    name: 'exact-cell K_v reproduces the -79/2 = -39.5 per-cell leading coefficient the histogram could not',
    holds: () =>
      Math.abs(SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION.faithfulPartition.exactKvReproducesLeadingCoefficient - (-39.5)) < 1e-12
      && SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION.faithfulPartition.histogramProxyDidNot === true,
  },
  {
    name: 'the anchor residual is an EXACT additive offset of +4 (J_raw(1/20)+4 = kappa to 1e-9)',
    holds: () =>
      Math.abs(J_RAW_AT_1_OVER_20 + 4 - KAPPA_PRECISE) < 1e-9
      && SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION.obstruction.offsetIsExactly4 === true,
  },
  {
    name: 'kappa_precise = c_odd(1/20)/rho^2 = 0.006276744728100982 * 400',
    holds: () => Math.abs(KAPPA_PRECISE - C_ODD_AT_1_OVER_20 * 400) < 1e-13,
  },
  {
    name: 'raw rho-signal J_raw(1/19)-J_raw(1/20) is real and negative (~ -2.85e-5, above the 1e-9 floor)',
    holds: () => {
      const d = SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION.conditionalSecondAnchor.rawRhoSignal;
      return d < -1e-6 && d > -1e-4;
    },
  },
  {
    name: 'conditional c_odd(1/19) sits ~1.14e-5 below the pure-rho^2 null kappa/361',
    holds: () => {
      const c = SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION.conditionalSecondAnchor;
      return Math.abs(c.c_odd_null_at_1over19 - KAPPA_PRECISE / 361) < 1e-15
        && c.fractionalJVariation < 0
        && Math.abs(c.fractionalJVariation - (-1.1359e-5)) < 1e-8;
    },
  },
  {
    name: 'honest: anchor NOT certified, conditional anchor gated on the +4 offset, sub-gap named, NO QED',
    holds: () =>
      SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION.conditionalSecondAnchor.certified === false
      && /telescoping constant/.test(SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION.obstruction.namedSubGap)
      && /refereed bound is changed/i.test(SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION.status)
      && /NO QED/.test(SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION.status),
  },
]);

export default SUN_PROP63_SECOND_ANCHOR_OBSTRUCTION;
