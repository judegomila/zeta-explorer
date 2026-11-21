/**
 * @module imp-97094-frobenius-intermediate-rung-discriminator-scope
 *
 * imp-97094 (numerical, SCOPING MEASUREMENT ONLY): scope the smallest intermediate
 * EXACT Vasyunin-Gram ||G||_F rung -- between the top existing exact rung N=16000 and
 * the conditioning scale N* ~ 4e7 -- that would DISCRIMINATE the two imp-96890 concave
 * norm models (monotone +d/N vs concave quadratic), i.e. separate the narrowed lower
 * ceiling window [line N*=3.775e7, +d/N N*=3.838e7] from the rejected quad top end
 * N*=4.103e7. imp-97081 named this "candidate (2)" as the direct test of the
 * interior-second-moment anchor F=3.775e7, but it is blocked on the imp-97078/imp-97093
 * exact R-evaluator sub-gap (the O(N^2 logN) reciprocity descent currently reproduces
 * the ladder to only 3.3e-6). This module measures WHERE (which N) a single exact rung
 * separates the models and WHAT it would cost, to scope reachability once imp-97093 lands.
 * Scoping measurement only; no rigorous ceiling is posted; no bound moves; NO QED.
 *
 * METHOD. Refit the three imp-96890 norm models to the frozen 18-rung IMP96912_LADDER
 * by least squares (line a+bL, quad a+bL+cL^2, tail a+bL+d/N with L=logN) and measure
 * the model-prediction separation |quad(N) - tail(N)| as a function of N. A single exact
 * rung discriminates the ceiling models when the exact value (machine-precision, once the
 * imp-97093 exact c(x) R-evaluator lands) lands clearly on one curve, i.e. when the
 * quad-vs-tail separation exceeds the binding fit-band width. Reproducible:
 * tmp/imp-97094-scope.py (numpy lstsq over the 18 rungs; the all-18 refit reproduces the
 * committed leave-top-2-out predictions quad 7.0949/7.1208, tail 7.1067/7.1349).
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the discriminating rung sits in the low-tens-of-thousands, NOT at N*.
 * -------------------------------------------------------------------------------
 * The quad-vs-tail model separation grows from ~1.0e-2 at N=16000 to ~4.0e-2 at N=32000,
 * ~5.0e-2 at N~3.8e4, ~6.8e-2 at N=50000. The binding uncertainty is the fit-band, not the
 * (noise-free) exact rung: the in-sample fit RMS is quad 1.63e-3, tail 6.24e-3. Requiring
 * the separation to clear ~8x the tail fit RMS (>= 5.0e-2) for an UNAMBIGUOUS single-rung
 * verdict puts the smallest discriminating rung at N ~ 3.8e4; a comfortable rung at
 * N=5.0e4 gives separation ~6.8e-2 (~11x the tail fit RMS). This is only ~2.4x-3.1x past
 * the current top rung N=16000 in N, NOT the ~4e7 conditioning scale.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the O(N^2 logN) descent cost of that rung is a small multiple of the
 *              N=16000 baseline -- reachable once imp-97093 lands.
 * -------------------------------------------------------------------------------
 * Normalising the O(N^2 logN) reciprocity-descent cost to the N=16000 exact-rung baseline:
 * N=32000 -> ~4.3x, N~3.8e4 -> ~6.1x, N=50000 -> ~10.9x. All are trivially affordable on
 * the O(N^2 logN) descent that imp-97078 established and imp-97093 is sharpening to machine
 * precision. By contrast, reaching the ceiling scale N* ~ 4e7 DIRECTLY as an exact rung
 * costs ~1.1e7x the N=16000 baseline -- infeasible. So candidate (2) is reachable AS AN
 * INTERMEDIATE RUNG (N ~ 4e4-5e4), and only as an intermediate rung; the ceiling scale
 * itself stays out of exact reach.
 *
 * -------------------------------------------------------------------------------
 * SUB-GAP (honest, named) -- an intermediate rung sharpens near-field model selection but
 *              does NOT by itself certify the far-field ceiling.
 * -------------------------------------------------------------------------------
 * A single exact rung at N ~ 4e4-5e4 tests the SAME near-field curvature the imp-96912
 * holdout already probed (fit-then-predict within the measured decade): it would add a
 * decisive out-of-sample point favouring quad OR tail, but it cannot resolve the far-field
 * turnover that makes the quad unphysical at the ceiling scale (quad peaks at N ~ 2.31e9,
 * imp-96890 Finding 3). So the intermediate rung narrows the credible ceiling band and its
 * direction; it does not close the +d/N-vs-quad ceiling ambiguity at N* ~ 4e7. The residual
 * blocker remains the imp-97093 exact R-evaluator (3.3e-6 -> machine precision) that would
 * make ANY rung past N=16000 exact in the first place. No bound moves; the rigorous trace
 * ceiling T ~ 2.594e7 and the T<F<M ordering are unaffected; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-97081-route-m-frobenius-ceiling-band-discriminator (candidate (2): intermediate exact rung)
 * @see imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword (the near-field holdout verdict)
 * @see imp-96912-route-m-frobenius-holdout-model-discriminator (IMP96912_LADDER, the frozen 18 rungs)
 * @see imp-97078-route-m-vasyunin-reciprocity-nsq-logn-feasibility (O(N^2 logN) descent; 3.3e-6 residual)
 * @see imp-97093 (exact c(x) R-evaluator that would unblock exact rungs past N=16000)
 *
 * Ticket: imp-97094 (numerical, opus-4-8, api-pool). Scoping measurement only; NO QED.
 */

// Model-prediction separation |quad(N) - tail(N)| from the all-18 refit (fit RMS: quad
// 1.63e-3, tail 6.24e-3, line 2.31e-2). Reproducible: tmp/imp-97094-scope.py.
export const IMP97094_SEPARATION = Object.freeze([
  Object.freeze({ N: 16000, quad: 7.121857, tail: 7.131854, line: 7.150550, sepQuadTail: 9.9966e-3 }),
  Object.freeze({ N: 20000, quad: 7.210615, tail: 7.228690, line: 7.254467, sepQuadTail: 1.8075e-2 }),
  Object.freeze({ N: 24000, quad: 7.281886, tail: 7.307721, line: 7.339374, sepQuadTail: 2.5835e-2 }),
  Object.freeze({ N: 32000, quad: 7.392058, tail: 7.432291, line: 7.473346, sepQuadTail: 4.0233e-2 }),
  Object.freeze({ N: 38000, quad: 7.456536, tail: 7.506642, line: 7.553376, sepQuadTail: 5.0106e-2 }),
  Object.freeze({ N: 50000, quad: 7.557434, tail: 7.625302, line: 7.681180, sepQuadTail: 6.7868e-2 }),
  Object.freeze({ N: 100000, quad: 7.800940, tail: 7.924717, line: 8.003976, sepQuadTail: 1.2378e-1 }),
]);

// The smallest discriminating rung under three separation thresholds tied to the fit-band.
export const IMP97094_DISCRIMINATOR = Object.freeze({
  fitRmsQuad: 1.63e-3,
  fitRmsTail: 6.24e-3,
  // separation >= 1.0e-2 (tail holdout RMS; the N=16000 verdict scale): already met at N ~ 1.6e4
  smallestN_thr1e2: 1.6e4,
  // separation >= 5.0e-2 (~8x tail fit RMS; unambiguous single-rung verdict): N ~ 3.8e4
  smallestN_thr5e2: 3.8e4,
  // a comfortable rung with margin (~11x tail fit RMS)
  comfortableN: 5.0e4,
  comfortableSep: 6.7868e-2,
});

// O(N^2 logN) reciprocity-descent cost, normalised to the N=16000 exact-rung baseline.
export const IMP97094_DESCENT_COST = Object.freeze([
  Object.freeze({ N: 16000, relCost: 1.0 }),
  Object.freeze({ N: 20000, relCost: 1.599 }),
  Object.freeze({ N: 24000, relCost: 2.344 }),
  Object.freeze({ N: 32000, relCost: 4.286 }),
  Object.freeze({ N: 38000, relCost: 6.14 }),
  Object.freeze({ N: 50000, relCost: 10.92 }),
  Object.freeze({ N: 4.0e7, relCost: 1.13e7 }), // ceiling scale as a DIRECT exact rung: infeasible
]);

export const IMP97094_VERDICT = Object.freeze({
  smallestDiscriminatingRungN: 3.8e4, // separation >= 5e-2, ~8x tail fit RMS
  comfortableRungN: 5.0e4,
  descentCostVs16000: 10.92, // at the comfortable N=5e4 rung
  ceilingScaleAsDirectRungCost: 1.13e7, // vs N=16000; infeasible
  reachableOnceImp97093Lands: true, // O(N^2 logN) descent at N~4e4-5e4 is cheap
  resolvesNearFieldModelSelection: true, // adds a decisive out-of-sample point
  resolvesFarFieldCeiling: false, // quad turnover at N~2.31e9 untested by a near-field rung
  residualBlocker: 'imp-97093 exact c(x) R-evaluator (3.3e-6 -> machine precision)',
  boundMoved: false,
  traceCeilingUnaffected: true,
  qed: false,
});

// Self-executing invariants (import-light; pure literals only; no heavy transitive imports).
const IMP97094_ASSERTIONS = [
  {
    id: 'separation-monotone-increasing',
    holds: () => {
      const s = IMP97094_SEPARATION;
      for (let i = 1; i < s.length; i += 1) {
        if (!(s[i].sepQuadTail > s[i - 1].sepQuadTail)) return false;
      }
      return s[0].N === 16000 && s[s.length - 1].N === 100000;
    },
    why: 'the quad-vs-tail model separation grows monotonically with N, from ~1.0e-2 at N=16000 to ~1.24e-1 at N=1e5.',
  },
  {
    id: 'smallest-rung-in-low-tens-of-thousands',
    holds: () =>
      IMP97094_DISCRIMINATOR.smallestN_thr5e2 > 16000 &&
      IMP97094_DISCRIMINATOR.smallestN_thr5e2 < 1e5 &&
      IMP97094_DISCRIMINATOR.smallestN_thr5e2 === IMP97094_VERDICT.smallestDiscriminatingRungN,
    why: 'the smallest unambiguous discriminating rung sits at N ~ 3.8e4 (separation >= 5e-2 ~ 8x tail fit RMS), not at the ceiling scale.',
  },
  {
    id: 'descent-cost-cheap-vs-ceiling-scale',
    holds: () => {
      const c = IMP97094_DESCENT_COST;
      const at5e4 = c.find((r) => r.N === 50000);
      const atCeiling = c.find((r) => r.N === 4.0e7);
      return at5e4.relCost < 20 && atCeiling.relCost > 1e6 && at5e4.relCost < atCeiling.relCost;
    },
    why: 'an N~5e4 intermediate rung costs ~11x the N=16000 baseline (cheap), while a direct N*~4e7 exact rung costs ~1.1e7x (infeasible).',
  },
  {
    id: 'honest-subgap-and-no-qed',
    holds: () =>
      IMP97094_VERDICT.reachableOnceImp97093Lands === true &&
      IMP97094_VERDICT.resolvesNearFieldModelSelection === true &&
      IMP97094_VERDICT.resolvesFarFieldCeiling === false &&
      IMP97094_VERDICT.boundMoved === false &&
      IMP97094_VERDICT.qed === false,
    why: 'the intermediate rung is reachable and sharpens near-field model selection but does NOT resolve the far-field ceiling; the imp-97093 R-evaluator remains the blocker; no bound moves; NO QED.',
  },
];

for (const a of IMP97094_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97094 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}

export default IMP97094_VERDICT;
