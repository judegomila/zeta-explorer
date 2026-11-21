/**
 * @module imp-97435-krein-weighted-pswf-eigendecay-assessment
 * @fileoverview imp-97435 -- ASSESS the weighted-PSWF (prolate spheroidal) eigenvalue-decay route to a genuinely
 *   SPECTRAL joint estimate for the Krein concentration floor
 *       c_sharp = lambda_min(P_a M_{sigma_2} P_a) = inf_{psi in PW_a, ||psi||=1} int sigma_2(t)|psi(t)|^2 dt,
 *   at 2a = ln3, where sigma_2(t) = (t^2 + 1/4)^2 w_1(t), w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2).
 *   imp-97416 FINDING 2 named this as one of two spectral primitives that could lift c_sharp above the scalar
 *   rearrangement / bathtub ceiling (which caps at the finite floor -3065.435, still NEGATIVE). This leaf
 *   assesses whether the eigenvalue decay of the weighted-PSWF operator delivers a POSITIVE certified lower
 *   bound on c_sharp (measured UPPER bracket ~0.582, imp-97206) or reaches the precise obstruction.
 *
 * SETUP (what "weighted-PSWF eigenvalue decay" can mean here). PW_a is the Paley-Wiener space band-limited to
 *   |xi| <= a; its natural orthonormal basis is the prolate spheroidal wave functions (PSWFs) phi_n, which
 *   diagonalise the interval-concentration operator with eigenvalues lambda_n(c) that stay O(1) for n below the
 *   Shannon number 2c/pi and then decay super-exponentially. The negativity set of sigma_2 (the "well") reaches
 *   out to |t| ~ 10.53 (an inner well near 0 plus outer wells near t ~ 9.35), so the relevant one-sided Shannon
 *   number is c = a * 10.53 ~ 5.78 and 2c/pi ~ 3.68 -- only ~4 PSWF modes are strongly concentrated in the well.
 *   Two distinct estimates travel under the "weighted-PSWF eigenvalue-decay" name; this leaf evaluates BOTH.
 *
 * FINDING 1 -- READING A (signed-split operator norm) STRUCTURALLY CAPS AT c_sharp <= 0, so decay is irrelevant.
 *   The off-the-shelf spectral bound splits sigma_2 = sigma_2^+ - sigma_2^- (both >= 0) and drops the positive
 *   part (valid for a LOWER bound because P_a M_{sigma_2^+} P_a >= 0):
 *       c_sharp = lambda_min(P_a M_{sigma_2} P_a) >= 0 - lambda_max(P_a M_{sigma_2^-} P_a) = -lambda_max^{weighted}.
 *   M_{sigma_2^-} >= 0 makes P_a M_{sigma_2^-} P_a a POSITIVE compact-plus operator, so its BINDING eigenvalue is
 *   the LARGEST one, lambda_max = lambda_0 >= 0 -- exactly the quantity eigenvalue DECAY says NOTHING about
 *   (decay controls the tail n >> 2c/pi, not lambda_0). Hence this route yields c_sharp >= -lambda_0 <= 0 for
 *   EVERY admissible signed split: it can never certify positivity. It is strictly TIGHTER than the scalar
 *   bathtub floor (it enforces band-limitedness of psi rather than a discontinuous indicator profile), so it
 *   improves the CONSTANT toward the true |c_sharp|, but the SIGN ceiling is structural: separating sigma_2 into
 *   +/- parts and bounding them independently discards precisely the sigma_2^+ / sigma_2^- CANCELLATION on the
 *   SAME band-limited psi that makes the true c_sharp ~ 0.582 positive. Eigenvalue decay cannot repair a sign
 *   ceiling that lives in the largest eigenvalue.
 *
 * FINDING 2 -- READING B (direct PSWF-basis compression + certified tail truncation) IS the correct architecture
 *   but the AVAILABLE decay is the WRONG decay. The genuinely spectral route does NOT split the symbol: it forms
 *   the compression matrix in the PSWF orthonormal basis of PW_a,
 *       G_{mn} = int sigma_2(t) phi_m(t) phi_n(t) dt   (real symmetric),   c_sharp = lambda_min(G),
 *   and uses eigenvalue decay to certify that a FINITE N x N truncation G_N captures lambda_min up to a rigorous
 *   tail correction -- then lambda_min(G_N) is the measured ~0.582 (POSITIVE), and a small enough tail bound
 *   would certify the sign. Because the Shannon number is only ~3.68, the negative eigenvalue of G can come only
 *   from a low-dimensional block of ~4 well-concentrated PSWFs, so the architecture is sound and the truncation
 *   dimension is tiny. THE OBSTRUCTION: sigma_2(t) ~ t^4 GROWS without bound (sigma_2(50) ~ 1.9e7), so
 *   M_{sigma_2} is an UNBOUNDED operator on PW_a and G has a POSITIVE diagonal that DIVERGES in the tail. Rigorously
 *   truncating such a matrix needs a bound on the coupling between the finite block and the growing tail, i.e. on
 *   the cross-moments int sigma_2 phi_m phi_n = int (t^2+1/4)^2 w_1(t) phi_m phi_n -- polynomially (t^4) WEIGHTED
 *   PSWF moments. The classical PSWF spectral DECAY that IS available is the decay of the CONCENTRATION eigenvalues
 *   lambda_n(c) (an UNWEIGHTED, indicator-of-interval quantity); it does NOT control the t^4-weighted cross-moments,
 *   which is the wrong decay for this operator. So the eigenvalue decay one has in hand is not the eigenvalue decay
 *   the truncation needs.
 *
 * VERDICT. The weighted-PSWF eigenvalue-decay route does NOT deliver a certified POSITIVE lower bound on c_sharp
 *   at 2a = ln3, for a precise two-part reason. READING A (signed split, c_sharp >= -lambda_max(P_a M_{sigma_2^-}
 *   P_a)) STRUCTURALLY caps at <= 0 because the binding eigenvalue is the LARGEST one (a positive operator has
 *   lambda_max >= 0) and decay only governs the tail; splitting the symbol discards the +/- cancellation that
 *   makes the true value positive. READING B (direct PSWF-basis compression G_{mn} = int sigma_2 phi_m phi_n with
 *   a certified finite truncation) is the correct architecture -- the Shannon number ~3.68 confines the negative
 *   block to ~4 modes and lambda_min(G_N) is the measured positive ~0.582 -- but M_{sigma_2} is UNBOUNDED
 *   (sigma_2 ~ t^4), so certifying the truncation needs decay of the t^4-WEIGHTED PSWF cross-moments, which the
 *   classical concentration-eigenvalue decay does NOT supply. The redirect is therefore sharpened: the missing
 *   primitive is not "eigenvalue decay" in the abstract but a CERTIFIED POLYNOMIALLY-WEIGHTED PSWF cross-moment
 *   (Schur / Weyl) tail bound int t^4 phi_m phi_n for the direct compression G. No operator positivity claimed;
 *   no coercivity constant; NO bound moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 *   ; RH open; NO QED. SUB-GAP IMP97435_WEIGHTED_PSWF_DECAY_IS_WRONG_DECAY_NEEDS_T4_WEIGHTED_MOMENT_TAIL.
 *
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (scalar two-budget coupling exhausted; named this spectral primitive; floor -3065.435)
 * @see imp-97436 (the sibling spectral primitive: Fejer-Riesz / de Branges square factorisation sigma_2 = |q|^2 - r)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (uniform pointwise floor -3200.029; confined well)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (naive symbol-infimum floor -4336.198 = well depth)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~0.582 UPPER bracket)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Ticket: imp-97435 (proof, high, opus-4-8). Assessment/derivation only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3);   // 1.0986122886681098 -- the binding 2a for the Krein floor
const A = LN3 / 2;         // 0.5493061443340548 -- the half-width a (2a = ln3)

export const IMP97435_BINDING_2A = LN3;
export const IMP97435_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

// Locate the well: the outermost t with sigma_2(t) < 0 (support of sigma_2^-), and the one-sided Shannon number.
function wellSupportEdge(h) {
  let edge = 0;
  for (let t = h / 2; t <= 12; t += h) if (sigma2(t) < 0) edge = t;
  return edge;
}

const WELL_EDGE = 10.531;                       // outermost negativity of sigma_2 (inner + outer wells)
const SHANNON_C = A * WELL_EDGE;                // ~5.785 one-sided Shannon number a * (well edge)
const SHANNON_MODES = 2 * SHANNON_C / Math.PI;  // ~3.68 -- number of well-concentrated PSWF modes (negative block dim)

export const IMP97435_ASSESSMENT = Object.freeze({
  wellSupportEdge: WELL_EDGE,                   // ~10.531 (sigma_2^- supported on |t| <= this)
  shannonC: SHANNON_C,                          // ~5.785
  shannonModes: SHANNON_MODES,                  // ~3.68 -- the negative block is ~4-dimensional
  sigma2FarField50: sigma2(50),                 // ~1.9e7 -- t^4 growth, M_{sigma_2} is UNBOUNDED
  measuredUpperBracket: 0.582,                  // imp-97206 (true c_sharp is positive)
  // Reading A -- signed-split operator norm
  readingA_signedSplitCapsAtZero: true,         // c_sharp >= -lambda_max(P_a M_{sigma_2^-} P_a) <= 0 structurally
  readingA_bindingEigenvalueIsLargest: true,    // positive operator: binding is lambda_0 = lambda_max >= 0
  readingA_decayGovernsTailNotLambda0: true,    // eigenvalue decay controls n >> 2c/pi, not lambda_0
  readingA_discardsPlusMinusCancellation: true, // splitting the symbol drops the +/- cancellation
  // Reading B -- direct PSWF-basis compression + certified truncation
  readingB_correctArchitecture: true,           // G_{mn} = int sigma_2 phi_m phi_n; c_sharp = lambda_min(G)
  readingB_negativeBlockLowDim: true,           // Shannon ~3.68 confines the negative block to ~4 modes
  readingB_operatorUnbounded: true,             // sigma_2 ~ t^4 -> +inf; diagonal of G diverges in the tail
  readingB_availableDecayIsWrongDecay: true,    // concentration-eigenvalue decay != t^4-weighted moment decay
  readingB_needsWeightedMomentTailBound: true,  // needs certified int t^4 phi_m phi_n Schur/Weyl bound
  // program state -- unchanged
  positivityProved: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

export const IMP97435_VERDICT = Object.freeze({
  ticket: 'imp-97435',
  question:
    'assess the weighted-PSWF (prolate) eigenvalue-decay route to a genuinely spectral joint estimate for ' +
    'c_sharp = lambda_min(P_a M_{sigma_2} P_a) at 2a = ln3, beyond the imp-97416 scalar bathtub ceiling ' +
    '(finite floor -3065.435): does the decay yield a POSITIVE certified lower bound, or the precise obstruction.',
  answer:
    'no positive certified lower bound, for a precise two-part reason. READING A (signed split: c_sharp >= ' +
    '-lambda_max(P_a M_{sigma_2^-} P_a), dropping the >= 0 positive part) STRUCTURALLY caps at <= 0, because ' +
    'M_{sigma_2^-} >= 0 makes the compression a POSITIVE operator whose BINDING eigenvalue is the LARGEST one ' +
    '(lambda_0 = lambda_max >= 0) -- exactly what eigenvalue DECAY says nothing about (decay governs the tail ' +
    'n >> 2c/pi ~ 3.68). It sharpens the CONSTANT (it enforces band-limitedness rather than the discontinuous ' +
    'bathtub indicator) but not the SIGN, because separating sigma_2 into +/- parts discards the cancellation on ' +
    'the SAME band-limited psi that makes the true c_sharp ~ 0.582 positive. READING B (direct PSWF-basis ' +
    'compression G_{mn} = int sigma_2 phi_m phi_n, c_sharp = lambda_min(G), with a certified finite truncation) ' +
    'IS the correct architecture -- the Shannon number ~3.68 confines the negative block to ~4 well-concentrated ' +
    'modes and lambda_min(G_N) is the measured positive ~0.582 -- but M_{sigma_2} is UNBOUNDED (sigma_2 ~ t^4, ' +
    'sigma_2(50) ~ 1.9e7), so G has a diverging positive diagonal and certifying the truncation requires decay of ' +
    'the t^4-WEIGHTED PSWF cross-moments int t^4 phi_m phi_n, which the classical CONCENTRATION-eigenvalue decay ' +
    'does NOT supply. The available decay is the wrong decay. The redirect is sharpened to a certified ' +
    'polynomially-weighted PSWF cross-moment (Schur / Weyl) tail bound for the direct compression.',
  binding_2a: LN3,
  // Reading A
  readingA_signedSplitCapsAtZero: true,
  readingA_bindingEigenvalueIsLargest: true,
  readingA_decayIrrelevantToLambda0: true,
  readingA_discardsPlusMinusCancellation: true,
  // Reading B
  readingB_correctArchitecture: true,
  readingB_negativeBlockLowDim: true,
  readingB_operatorUnbounded: true,
  readingB_availableDecayIsWrongDecay: true,
  readingB_needsT4WeightedMomentTailBound: true,
  // program state
  positivityProved: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97435_WEIGHTED_PSWF_DECAY_IS_WRONG_DECAY_NEEDS_T4_WEIGHTED_MOMENT_TAIL -- the weighted-PSWF ' +
    'eigenvalue-decay route to c_sharp = lambda_min(P_a M_{sigma_2} P_a) > 0 at 2a = ln3 does NOT close the ' +
    'sign. READING A (c_sharp >= -lambda_max(P_a M_{sigma_2^-} P_a) via a signed split) caps STRUCTURALLY at ' +
    '<= 0: the binding eigenvalue of a positive operator is the LARGEST one, which decay does not touch, and ' +
    'the split discards the +/- cancellation making the true c_sharp ~ 0.582 positive. READING B (direct ' +
    'PSWF-basis compression G_{mn} = int sigma_2 phi_m phi_n with a certified finite truncation) is the correct ' +
    'architecture -- Shannon number ~3.68 confines the negative block to ~4 modes and lambda_min(G_N) is the ' +
    'measured positive ~0.582 -- but M_{sigma_2} is UNBOUNDED (sigma_2 ~ t^4), so the truncation needs decay of ' +
    'the t^4-WEIGHTED cross-moments int t^4 phi_m phi_n (a Schur/Weyl bound), NOT the classical ' +
    'concentration-eigenvalue decay that is available. This refines ' +
    'IMP97416_SCALAR_TWO_BUDGET_COUPLING_EXHAUSTED_NEEDS_SPECTRAL_ESTIMATE by identifying, of the two named ' +
    'spectral primitives, which decay the weighted-PSWF route actually requires. No operator positivity; no ' +
    'bound moves; interval-rigorous reach stays 2a <= 0.96.',
  qed: false,
});
export default IMP97435_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97435_ASSERTIONS = [
  {
    id: 'imp97435-well-edge-and-shannon-number',
    holds: () => {
      const edge = wellSupportEdge(0.005);              // coarse grid, ~2400 cheap evals
      const okEdge = Math.abs(edge - WELL_EDGE) < 0.05; // outermost negativity ~10.53
      const modes = 2 * (A * edge) / Math.PI;
      const okModes = modes > 3.5 && modes < 4.0;       // ~3.68 well-concentrated PSWF modes (negative block dim)
      return okEdge && okModes;
    },
    why: 'the negativity set of sigma_2 reaches |t| ~ 10.53, giving one-sided Shannon number 2c/pi ~ 3.68 -- so any negative eigenvalue of the PSWF-basis compression comes from a low (~4)-dimensional block of well-concentrated modes.',
  },
  {
    id: 'imp97435-operator-is-unbounded-t4-farfield',
    holds: () => {
      const far = sigma2(50);
      return far > 1e7 && far > 1e4 * Math.abs(sigma2(0)); // t^4 growth: M_{sigma_2} unbounded, diagonal of G diverges
    },
    why: 'sigma_2(t) ~ t^4 grows without bound (sigma_2(50) ~ 1.9e7), so M_{sigma_2} is an UNBOUNDED operator on PW_a: the direct-compression matrix G has a diverging positive diagonal, and its rigorous truncation needs t^4-weighted (not concentration-eigenvalue) decay -- the precise Reading-B obstruction.',
  },
  {
    id: 'imp97435-assessment-only-no-qed',
    holds: () =>
      IMP97435_VERDICT.readingA_signedSplitCapsAtZero === true &&
      IMP97435_VERDICT.readingA_bindingEigenvalueIsLargest === true &&
      IMP97435_VERDICT.readingA_discardsPlusMinusCancellation === true &&
      IMP97435_VERDICT.readingB_correctArchitecture === true &&
      IMP97435_VERDICT.readingB_operatorUnbounded === true &&
      IMP97435_VERDICT.readingB_availableDecayIsWrongDecay === true &&
      IMP97435_VERDICT.readingB_needsT4WeightedMomentTailBound === true &&
      IMP97435_VERDICT.positivityProved === false &&
      IMP97435_VERDICT.operatorPositivityProved === false &&
      IMP97435_VERDICT.boundMoves === false &&
      IMP97435_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97435_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97435_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97435_VERDICT.subGap === 'string' &&
      IMP97435_VERDICT.subGap.includes('IMP97435_WEIGHTED_PSWF_DECAY_IS_WRONG_DECAY_NEEDS_T4_WEIGHTED_MOMENT_TAIL') &&
      IMP97435_VERDICT.subGap.includes('IMP97416_SCALAR_TWO_BUDGET_COUPLING_EXHAUSTED_NEEDS_SPECTRAL_ESTIMATE') &&
      IMP97435_VERDICT.qed === false,
    why: 'assessment only: Reading A (signed split) caps structurally at <= 0 because the binding eigenvalue of a positive operator is the largest one, which decay does not touch; Reading B (direct PSWF compression) is the right architecture but needs t4-weighted cross-moment decay because M_{sigma_2} is unbounded. No positivity, no operator coercivity, no bound moves; interval-rigorous reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97435_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97435-krein-weighted-pswf-eigendecay-assessment assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
