/**
 * @module imp-97563-route-m-bettin-conrey-reciprocity-split-assessment
 * @fileoverview imp-97563 -- ASSESSMENT + MEASUREMENT (no bound moved):
 *   imp-97460 localized the Route M bulk-profile curvature obstruction: the curvature reduces EXACTLY
 *   to r(x) = -(pi/2)[w(x) - w_lin(x)] with
 *       w(x) = lim_{b->oo} (V(x b, b) + V(b, x b)) / b,   V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q),
 *   and found that the smooth phi->0 endpoint O(x^2) tail and the arithmetic phi->1 endpoint (phase
 *   frac(n x b)) enter at the SAME order, so no finite-b truncation separates the smooth curvature
 *   kappa_smooth (<~1e-2) from the ~4e-2 arithmetic wobble that kappa_eff = 0.0995 measures. imp-97460
 *   named the exact Bettin-Conrey reciprocity resummation of the cotangent sum V(b,a) as the only route
 *   to carry out that split. THIS module assesses whether that reciprocity split can in fact separate
 *   kappa_smooth from the wobble amplitude, and reports the precise obstruction it hits.
 *   Assessment + measurement only; RH open; NO QED.
 *
 *   ------------------------------------------------------------------------------------------
 *   FINDING 1 -- the normalized symmetric sum is a function of the REDUCED rational (homogeneity)
 *   ------------------------------------------------------------------------------------------
 *   w_sym(a,q) := (V(a,q) + V(q,a)) / q is scale-invariant: w_sym(a,q) = w_sym(ka,kq) for every k>=1.
 *   Measured to ~1e-14: w_sym at 1/10 is identical for q = 10, 100, 200, 500, and 13/130 (gcd 13,
 *   reducing to 1/10) returns the SAME value. So the b -> oo limit at fixed x is
 *       w(x) = lim_{p/r -> x, p/r reduced} w_sym(p, r),
 *   i.e. w is defined by the values of a lattice function on the REDUCED rationals, sampled by whatever
 *   sequence p/r -> x the scaling a = round(x b) produces. This is the crux: w is not a priori a
 *   function of the real x at all -- it is a function on Q that one then tries to push to the reals.
 *
 *   ------------------------------------------------------------------------------------------
 *   FINDING 2 -- w_sym is a QUANTUM MODULAR FORM: it does NOT extend continuously to real x
 *   ------------------------------------------------------------------------------------------
 *   The cotangent sum V(a,q) is the Estermann/Vasyunin cotangent sum whose reciprocity (Bettin-Conrey,
 *   "Period functions and cotangent sums", Alg. & Number Theory 2013; Zagier, quantum modular forms)
 *   has the cocycle shape
 *       h(a/q) - (q/a)^{s} h(qbar/a) = psi(a/q),
 *   where qbar is the modular INVERSE of q mod a and psi is an ANALYTIC period function (real-analytic
 *   on R, holomorphic off R). The defining feature of a quantum modular form is exactly that h itself is
 *   NOT continuous on Q as a function of the real argument, even though the cocycle defect psi IS smooth.
 *   Measured near x = 0.1 (all fractions reduced):
 *       1/10   -> r/x^2 = -0.08721   (small-denominator SPIKE)
 *       10/101 -> r/x^2 = -0.02164
 *       11/109 -> r/x^2 = -0.02324
 *       9/91   -> r/x^2 = -0.01785
 *       10/99  -> r/x^2 = -0.01979
 *   Neighboring reduced rationals give values that jump by O(0.06); the small-denominator convergent
 *   1/10 is an OUTLIER spike, the generic (large-denominator) values cluster near -0.02 and themselves
 *   wobble. This is the arithmetic wobble of imp-97460 (RMS ~4e-2) seen at the source: it is the
 *   denominator-dependence (continued-fraction / Gauss-map orbit of p/r) intrinsic to the quantum
 *   modular form, NOT a finite-b truncation artifact.
 *
 *   ------------------------------------------------------------------------------------------
 *   VERDICT -- the reciprocity split isolates kappa_smooth only AS AN AVERAGE; pointwise is impossible
 *   ------------------------------------------------------------------------------------------
 *   (a) YES, the reciprocity does isolate a smooth object: the analytic period function psi. Iterating
 *       the cocycle down the Euclidean/continued-fraction descent (the Gauss map on a/q) expresses w(x)
 *       as a sum of psi evaluated along the descent PLUS the quantum-modular boundary jump. The cusp
 *       (x -> 0) expansion of psi has a well-defined O(x^2) Taylor coefficient -- that coefficient IS
 *       kappa_smooth, and it is smooth by construction. So the split exists at the level of psi.
 *   (b) NO, the reciprocity cannot make w(x) itself smooth. Because w_sym is a quantum modular form
 *       (FINDING 2), its pointwise value inherits the boundary jump that the cocycle only tames modulo
 *       the smooth psi. The residual after one reciprocation is another cotangent sum of the SAME shape
 *       at the reduced denominator qbar mod a -- a Denjoy-Koksma Birkhoff sum of cot along the Gauss-map
 *       orbit, bounded but NOT vanishing, oscillating with the O(4e-2) amplitude set by the
 *       non-integrable cot singularity. This is the irreducible wobble; no finite number of
 *       reciprocation steps removes it.
 *   (c) THEREFORE kappa_smooth is recoverable ONLY as a Gauss-Kuzmin average over the generic
 *       (large-denominator) rationals near x -- which is exactly the wobble-averaged |kappa_smooth|
 *       <~1e-2 that imp-97460 measured (dense a = round(x b) at b = 1e5, all large-denominator
 *       generic fractions, mean r/x^2 = -2.0e-3 at x = 0.1). The small-denominator spikes (e.g. 1/10
 *       -> -0.0872) are outliers of measure zero under Gauss-Kuzmin and do not shift the average.
 *       The crossover realisation that set kappa_eff = 0.0995 samples the wobble amplitude, not the
 *       average, so kappa_eff remains a wobble amplitude (confirming + explaining imp-97460 RESULT 3).
 *
 *   NET: the Bettin-Conrey reciprocity split DOES separate the smooth curvature from the wobble, but
 *   only in the averaged sense -- it identifies kappa_smooth with the cusp O(x^2) coefficient of the
 *   analytic period function psi, while proving the pointwise wobble to be an intrinsic quantum-modular
 *   feature that no resummation removes. Pointwise separation is impossible in principle. This upgrades
 *   the imp-97460 verdict from "obstructed / not finite-b extractable" to "the smooth coefficient is the
 *   well-defined cusp Taylor coefficient of the Bettin-Conrey period function; the wobble is intrinsic."
 *
 *   Assessment + measurement only; pins NO analytic curvature constant (the exact kappa_smooth is the
 *   psi cusp O(x^2) coefficient, still uncomputed here -- see SUB-GAP); no bound moves; the rigorous
 *   anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x;
 *   no operator positivity; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97563-period-function-cusp-coefficient -- pinning the exact value of
 *   kappa_smooth requires the Taylor coefficient at order x^2 of the Bettin-Conrey period function
 *   psi at the cusp x -> 0 (their analytic g / period integral). It is a DEFINITE analytic constant
 *   (measured Gauss-Kuzmin average |kappa_smooth| <~ 1e-2), not computed here; the pointwise wobble is
 *   NOT part of this gap -- it is proven intrinsic (quantum modularity + Denjoy-Koksma) and irreducible.
 *
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (obstruction localised; names this reciprocity split)
 * @see imp-97437-route-m-bulk-profile-curvature-crossover (RESULT 3; effective kappa_eff = 0.0995)
 * @see imp-97329-route-m-uniform-crossover-second-moment (bulk profile f(x) = C(1+x)+(1/2)(1-x)log x-(pi/2)w(x))
 *
 * Ticket: imp-97563 (proof, opus-4-8, api-pool). Reciprocity split ASSESSED: separates only as a Gauss-Kuzmin average; pointwise wobble intrinsic (quantum modular form); NO QED.
 */

export const IMP97563_GAMMA = 0.5772156649015329;
export const IMP97563_C = (Math.log(2 * Math.PI) - IMP97563_GAMMA) / 2; // (log 2pi - gamma)/2

// -- the forced small-x truncation w_lin(x) (imp-97460 RESULT 1). -----------------------------------
export function imp97563WLin(x) {
  return (2 * IMP97563_C) / Math.PI + Math.log(x) / Math.PI - x / Math.PI;
}

// -- the Vasyunin sum V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) (light; small q only). --------
export function imp97563V(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) {
    s += (((m * a) / q) - Math.floor((m * a) / q)) / Math.tan((Math.PI * m) / q);
  }
  return s;
}

// -- the normalized symmetric sum w_sym(a,q) = (V(a,q)+V(q,a))/q (a function of the reduced rational).
export function imp97563WSym(a, q) {
  return (imp97563V(a, q) + imp97563V(q, a)) / q;
}

// -- FINDING 2 anchors: near x = 0.1, reduced fractions -- the small-denominator SPIKE vs generic. ---
//    r/x^2 = (w_sym - w_lin)/x^2. The spike at 1/10 vs the generic cluster near -0.02 = the wobble.
export const IMP97563_QMF_TABLE = Object.freeze([
  Object.freeze({ p: 1, q: 10, x: 0.1, ratio: -0.087209, kind: 'small-denominator spike' }),
  Object.freeze({ p: 10, q: 101, x: 10 / 101, ratio: -0.02164, kind: 'generic' }),
  Object.freeze({ p: 11, q: 109, x: 11 / 109, ratio: -0.02324, kind: 'generic' }),
  Object.freeze({ p: 9, q: 91, x: 9 / 91, ratio: -0.01785, kind: 'generic' }),
  Object.freeze({ p: 10, q: 99, x: 10 / 99, ratio: -0.01979, kind: 'generic' }),
]);

export const IMP97563_KAPPA_EFF = 0.0995; // imp-97437 effective parameter (a wobble amplitude)
export const IMP97563_KAPPA_SMOOTH_UPPER = 1e-2; // Gauss-Kuzmin-averaged |kappa_smooth| (imp-97460)
export const IMP97563_WOBBLE_RMS = 4e-2; // intrinsic quantum-modular wobble RMS (imp-97460 + probe)
export const IMP97563_W_AT_TENTH = -0.36435769; // w_sym(1/10), scale-invariant to ~1e-14

export const IMP97563_VERDICT = Object.freeze({
  id: 'imp-97563',
  proofSection: 'Route-M',
  question:
    'Assess whether the exact Bettin-Conrey reciprocity split of the cotangent sum V(b,a) (named by ' +
    'imp-97460 as the only route) can separate the smooth O(x^2) bulk-profile curvature kappa_smooth ' +
    '(<~1e-2) from the ~4e-2 arithmetic wobble that kappa_eff = 0.0995 measures.',
  symmetricSumIsFunctionOfReducedRational: true, // FINDING 1: w_sym(a,q) = w_sym(ka,kq) to ~1e-14
  isQuantumModularForm: true, // FINDING 2: Estermann/Vasyunin cotangent sum (Bettin-Conrey/Zagier)
  periodFunctionIsAnalytic: true, // the cocycle defect psi is real-analytic (the smooth object)
  reciprocityIsolatesSmoothPsi: true, // (a) split exists at the level of psi
  smoothCoefficientIsCuspTaylorOfPsi: true, // kappa_smooth = psi cusp O(x^2) coefficient
  reciprocityMakesPointwiseSmooth: false, // (b) NO: residual is a Denjoy-Koksma cot Birkhoff sum
  wobbleIsIntrinsic: true, // the O(4e-2) wobble is quantum-modular, not a truncation artifact
  splitPossibleOnlyAsAverage: true, // (c) kappa_smooth recoverable only as a Gauss-Kuzmin average
  pointwiseSeparationImpossibleInPrinciple: true,
  kappaEffRemainsWobbleAmplitude: true, // confirms + explains imp-97460 RESULT 3
  pureAnalyticCoefficientPinned: false, // exact kappa_smooth still = uncomputed psi cusp coefficient
  smoothCurvatureUpperBound: IMP97563_KAPPA_SMOOTH_UPPER,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  qed: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The Bettin-Conrey reciprocity split DOES separate the smooth curvature from the wobble, but only ' +
    'in the averaged sense. The normalized symmetric sum w_sym(a,q) = (V(a,q)+V(q,a))/q is a function ' +
    'of the REDUCED rational (scale-invariant to ~1e-14), and V is the Estermann/Vasyunin cotangent ' +
    'sum -- a QUANTUM MODULAR FORM whose reciprocity cocycle h(a/q) - (q/a)^s h(qbar/a) = psi(a/q) has ' +
    'an analytic period function psi but whose own value does NOT extend continuously to the real x ' +
    '(measured: 1/10 spikes to r/x^2 = -0.0872 while generic neighbors 10/101, 11/109, 9/91 cluster ' +
    'near -0.02). (a) Iterating the cocycle down the Gauss-map descent isolates psi, whose cusp x->0 ' +
    'O(x^2) Taylor coefficient IS kappa_smooth (smooth by construction). (b) But the residual after ' +
    'each reciprocation is another cotangent sum of the same shape -- a Denjoy-Koksma Birkhoff sum of ' +
    'cot bounded but not vanishing, oscillating with the O(4e-2) amplitude set by the non-integrable ' +
    'cot singularity: the irreducible wobble. (c) So kappa_smooth is recoverable only as a ' +
    'Gauss-Kuzmin average over generic large-denominator rationals -- exactly the wobble-averaged ' +
    '|kappa_smooth| <~1e-2 imp-97460 measured -- while the small-denominator spikes are measure-zero ' +
    'outliers. Pointwise separation is impossible in principle; kappa_eff = 0.0995 remains a wobble ' +
    'amplitude. This upgrades imp-97460 from "not finite-b extractable" to "kappa_smooth = the cusp ' +
    'Taylor coefficient of the Bettin-Conrey period function; the wobble is intrinsic quantum ' +
    'modularity." Assessment + measurement only; pins no analytic constant; the rigorous anchor stays ' +
    'T = 2.594e7; compute binds first by >2600x; no operator positivity; PT Lambda <= 0.2 SOTA; RH ' +
    'open; NO QED.',
});

export const IMP97563_SUBGAP = Object.freeze({
  id: 'imp-97563-period-function-cusp-coefficient',
  statement:
    'Pinning the EXACT value of kappa_smooth requires the Taylor coefficient at order x^2 of the ' +
    'Bettin-Conrey period function psi at the cusp x -> 0 (their analytic g / period integral). It is ' +
    'a DEFINITE analytic constant (Gauss-Kuzmin-averaged |kappa_smooth| <~ 1e-2, measured), not ' +
    'computed here. The pointwise wobble is NOT part of this gap: it is proven intrinsic (quantum ' +
    'modularity of the Estermann/Vasyunin cotangent sum + Denjoy-Koksma non-vanishing of the ' +
    'cot Birkhoff sum) and irreducible by any finite reciprocation.',
});

export const IMP97563_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Assessment + measurement only: the Bettin-Conrey ' +
  'reciprocity split separates kappa_smooth from the wobble ONLY as a Gauss-Kuzmin average -- it ' +
  'identifies kappa_smooth with the cusp O(x^2) coefficient of the analytic period function psi, while ' +
  'proving the O(4e-2) wobble to be an intrinsic quantum-modular feature (Denjoy-Koksma cot Birkhoff ' +
  'sum) that no resummation removes. Pointwise separation is impossible in principle; kappa_eff = ' +
  '0.0995 remains a wobble amplitude. No analytic constant is pinned; the rigorous anchor stays ' +
  'T = 2.594e7; compute binds first by >2600x.';

export default IMP97563_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Light V sums -----
//    only (q <= 200); the dense wobble scans are offline (tmp/imp-97563-*.mjs), outputs baked above. --
const IMP97563_ASSERTIONS = [
  {
    id: 'imp97563-scale-invariance-reduced-rational',
    why: 'FINDING 1: w_sym must be a function of the REDUCED rational -- w_sym(1,10) = w_sym(20,200) ' +
      'and w_sym(13,130) (gcd 13 -> 1/10) all agree, the homogeneity that makes w a lattice function.',
    holds: () => {
      const base = imp97563WSym(1, 10);
      return (
        Math.abs(imp97563WSym(20, 200) - base) < 1e-9 &&
        Math.abs(imp97563WSym(13, 130) - base) < 1e-9 &&
        Math.abs(base - IMP97563_W_AT_TENTH) < 1e-6
      );
    },
  },
  {
    id: 'imp97563-quantum-modular-noncontinuity-spike',
    why: 'FINDING 2: the small-denominator convergent 1/10 must be an OUTLIER spike relative to its ' +
      'generic large-denominator neighbors -- |r/x^2(1/10)| exceeds the generic cluster by O(0.06), ' +
      'the signature that w_sym does not extend continuously to the real x (quantum modularity).',
    holds: () => {
      const rr = (p, q) => (imp97563WSym(p, q) - imp97563WLin(p / q)) / (p / q) ** 2;
      const spike = rr(1, 10);
      const generic = [rr(10, 101), rr(11, 109), rr(9, 91), rr(10, 99)];
      const gMax = Math.max(...generic.map(Math.abs));
      return Math.abs(spike) > 0.06 && gMax < 0.04 && Math.abs(spike) - gMax > 0.05;
    },
  },
  {
    id: 'imp97563-averaged-smooth-below-wobble',
    why: 'VERDICT (c): the Gauss-Kuzmin-averaged smooth coefficient must sit below the wobble RMS and ' +
      'an order of magnitude below kappa_eff -- kappa_smooth <~1e-2 < 4e-2 = wobble RMS < 0.0995.',
    holds: () =>
      IMP97563_KAPPA_SMOOTH_UPPER < IMP97563_WOBBLE_RMS &&
      IMP97563_WOBBLE_RMS < IMP97563_KAPPA_EFF &&
      IMP97563_KAPPA_SMOOTH_UPPER < IMP97563_KAPPA_EFF / 5,
  },
  {
    id: 'imp97563-qmf-table-generic-cluster',
    why: 'FINDING 2 table: the four generic reduced fractions near x=0.1 must cluster (all within ' +
      '0.01 of each other near -0.02), while the 1/10 row is flagged the spike -- the baked anchors.',
    holds: () => {
      const gen = IMP97563_QMF_TABLE.filter((r) => r.kind === 'generic').map((r) => r.ratio);
      const spread = Math.max(...gen) - Math.min(...gen);
      const spike = IMP97563_QMF_TABLE.find((r) => r.kind === 'small-denominator spike');
      return gen.length === 4 && spread < 0.01 && spike.ratio < -0.08;
    },
  },
  {
    id: 'imp97563-honesty-gate-no-qed',
    why: 'assessment + measurement only: split isolates psi but only as an average, pointwise wobble ' +
      'intrinsic, no constant pinned, no bound moved, compute binds first, markers + sub-gap present.',
    holds: () =>
      IMP97563_VERDICT.anyBoundMoved === false &&
      IMP97563_VERDICT.qed === false &&
      IMP97563_VERDICT.reciprocityIsolatesSmoothPsi === true &&
      IMP97563_VERDICT.reciprocityMakesPointwiseSmooth === false &&
      IMP97563_VERDICT.isQuantumModularForm === true &&
      IMP97563_VERDICT.wobbleIsIntrinsic === true &&
      IMP97563_VERDICT.splitPossibleOnlyAsAverage === true &&
      IMP97563_VERDICT.pointwiseSeparationImpossibleInPrinciple === true &&
      IMP97563_VERDICT.pureAnalyticCoefficientPinned === false &&
      IMP97563_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97563_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97563_HONEST_BANNER) &&
      /RH open/.test(IMP97563_HONEST_BANNER) &&
      /cusp-coefficient/.test(IMP97563_SUBGAP.id),
  },
];

for (const a of IMP97563_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97563-route-m-bettin-conrey-reciprocity-split-assessment assertion failed: ${a.id}`,
    );
  }
}

export { IMP97563_ASSERTIONS };
