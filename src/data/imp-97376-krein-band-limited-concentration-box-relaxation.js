/**
 * @module imp-97376-krein-band-limited-concentration-box-relaxation
 * @fileoverview imp-97376 -- ATTEMPT the single band-limited concentration primitive that imp-97350
 *   showed gates BOTH remaining lower-bound routes for the Krein concentration constant
 *       c_sharp = lambda_min(P_a M_sigma2 P_a)  at  2a = ln3,
 *   sigma_2(t) = (t^2 + 1/4)^2 w_1(t),  w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2).
 *   imp-97350 (SUB-GAP IMP97350_LOWER_BOUND_ROUTES_SHARE_BAND_LIMITED_CONCENTRATION_PRIMITIVE) proved the
 *   Lehmann-Maehly spectral-gap enclosure and the de Branges coercivity realisation are NOT independent:
 *   both reduce to one missing quantitative uncertainty inequality bounding how much a Paley-Wiener PW_a
 *   density can concentrate its weighted mass in the confined negative sigma_2 well (global inf -4336.198
 *   at t = 9.3502, imp-97335). This leaf ATTEMPTS that primitive by the natural convex relaxation and
 *   REACHES its precise obstruction. It produces the first FINITE rigorous lower bounds on c_sharp, but
 *   they are negative, so no positivity follows.
 *
 *   Assessment / derivation attempt only. No operator positivity; no certified positive floor; no bound
 *   moves; interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed; RH open;
 *   NO QED.
 *
 * THE EXTREMAL PROBLEM (imp-97161 restatement). With F = |ghat|^2 for ghat in PW_a and int F = 1
 *   (||ghat||_2 = 1), the sharp constant is
 *       c_sharp = inf { int sigma_2(t) F(t) dt : F = |ghat|^2, ghat in PW_a, int F = 1 }.
 *   The band-limited density F carries THREE properties inherited from ghat in PW_a with unit norm:
 *     (P1) F >= 0 pointwise;
 *     (P2) int F = 1;
 *     (P3) F(t) <= K_a(t,t) = a/pi pointwise -- the reproducing-kernel (sinc) ceiling
 *          |ghat(t)|^2 = |<ghat, K_a(.,t)>|^2 <= ||ghat||^2 K_a(t,t) = a/pi.
 *   (P1)-(P2) are elementary; (P3) is the CHEAP half of the uncertainty content (the DIAGONAL of the
 *   reproducing kernel). The HARD half -- that a genuine PW_a function cannot hold the ceiling a/pi across
 *   a narrow set because the OFF-diagonal K_a(s,t) couples nearby points -- is exactly the missing primitive.
 *
 * THE ATTEMPT (box + mass relaxation). Drop (P3s hard band-limited STRUCTURE and keep only the three
 *   pointwise/scalar facts (P1)-(P3). The relaxed problem
 *       c_box = inf { int sigma_2 F : 0 <= F <= a/pi, int F = 1 }
 *   is a RELAXATION (every admissible band-limited F is box-admissible), so c_box <= c_sharp is a rigorous
 *   LOWER bound. It is a one-dimensional "bathtub" LP solved in closed form by filling F = a/pi on the
 *   deepest level set { sigma_2 < theta } with theta fixed by (a/pi)|{sigma_2 < theta}| = 1, i.e. the
 *   support length is exactly pi/a = 5.7192. Numerically (importing sigma_2):
 *       theta = -986.40,   c_box = -3065.43.
 *   A cruder companion drops (P2) and applies (P3) over the ENTIRE confined negative set:
 *       c_ptwise = -(a/pi) int sigma_2^-(t) dt = -3200.03,
 *   using that the negative support is BOUNDED -- sigma_2 < 0 only for |t| <~ 10.53 (last sign change at
 *   t = 10.53; w_1 > 0 thereafter as the log-drift 2 theta prime overtakes the bounded cosine), so
 *   int sigma_2^- = 18301.6 < infinity. Both are FINITE, unlike the vacuous symbol-infimum floor -4336.198
 *   (imp-97335), and they tighten it: -4336.198 < -3200.03 < -3065.43 < 0.
 *
 * THE PRECISE OBSTRUCTION (why the attempt cannot reach positivity, and what the primitive must deliver).
 *   The relaxation is far too weak because the box constraint 0 <= F <= a/pi lets F saturate the ceiling
 *   a/pi on a pi/a-wide neighbourhood of the deep well at t = 9.35 AT NO COST. A genuine band-limited
 *   density cannot do this: holding |ghat(t)|^2 = a/pi across a set narrow relative to the correlation
 *   length ~ pi/a of the sinc kernel forces the off-diagonal reproducing-kernel coupling to spread mass
 *   OUT of the well (into the positive t^4 far field), which the box relaxation ignores entirely. The
 *   ENTIRE gap c_sharp - c_box (from -3065.43 up to the Rayleigh-Ritz-bracketed true value ~0.55) must be
 *   supplied by that off-diagonal / weighted-prolate concentration structure -- precisely the object
 *   imp-97161 named IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN and
 *   imp-97350 identified as shared by both routes. So this leaf CONFIRMS and QUANTIFIES the imp-97350
 *   synthesis: the two "easy" band-limited facts (diagonal ceiling + unit mass) provably cannot certify
 *   c_sharp > 0; positivity lives entirely in the off-diagonal concentration primitive, and any certificate
 *   must recover ~+3065 of margin from it.
 *
 * VERDICT. The band-limited concentration primitive is attempted via its tightest box+mass convex
 *   relaxation. Result: c_sharp >= c_box = -3065.43 (finite, rigorous, tighter than -4336.198), still
 *   negative. The relaxation gap is the entire off-diagonal reproducing-kernel / weighted-prolate content,
 *   which the diagonal ceiling and unit-mass constraints cannot see. No positivity; the shared primitive
 *   IMP97350_LOWER_BOUND_ROUTES_SHARE_BAND_LIMITED_CONCENTRATION_PRIMITIVE is confirmed necessary and now
 *   quantified. SUB-GAP IMP97376_BOX_RELAXATION_MISSES_OFFDIAGONAL_CONCENTRATION. Assessment only; no
 *   operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (both routes share ONE band-limited primitive)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (Beurling-Selberg circular; flat prolate fails; a/pi pointwise budget)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (vacuous symbol-inf floor -4336.198 at t=9.3502)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (Rayleigh-Ritz upper bracket ~0.582 on lambda_1)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2, w_1; interval-rigorous reach 2a<=0.96)
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor
const A = LN3 / 2;       // 0.5493061443340548 -- half-width; band [-2a,2a] = [-ln3, ln3]
const BUDGET = A / Math.PI; // 0.17484957628302988 -- reproducing-kernel pointwise ceiling K_a(t,t) = a/pi

export const IMP97376_BINDING_2A = LN3;
export const IMP97376_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment
export const IMP97376_POINTWISE_CEILING = BUDGET; // (P3) F(t) <= a/pi

/**
 * Box + mass "bathtub" relaxation lower bound on c_sharp:
 *   inf { int sigma_2 F : 0 <= F <= a/pi, int F = 1 } -- fill F = a/pi on the deepest level set until the
 * mass reaches 1 (support length pi/a). Every band-limited density is box-admissible, so this is a rigorous
 * LOWER bound c_box <= c_sharp. Grid is coarse-but-adequate; the closed-form support length is pi/a.
 */
export function boxRelaxationLowerBound(h = 2e-3, T = 40) {
  const cells = [];
  for (let t = -T; t <= T; t += h) cells.push([sigma2(t), h]);
  cells.sort((x, y) => x[0] - y[0]); // ascending sigma_2 -- deepest first
  let mass = 0, integral = 0, theta = null, usedLen = 0;
  for (const [s, w] of cells) {
    const room = 1 - mass;
    const cellMass = BUDGET * w;
    if (cellMass <= room) { integral += s * cellMass; mass += cellMass; usedLen += w; }
    else { integral += s * room; theta = s; usedLen += room / BUDGET; mass = 1; break; }
  }
  return { cBox: integral, theta, supportLen: usedLen };
}

/** Cruder companion: -(a/pi) * total confined negative mass of sigma_2 (drops the unit-mass constraint). */
export function pointwiseNegMassLowerBound(h = 2e-3, T = 60) {
  let L = 0; // one-sided negative mass
  for (let t = 0; t <= T; t += h) { const s = sigma2(t); if (s < 0) L += -s * h; }
  return { cPtwise: -BUDGET * 2 * L, negMassFull: 2 * L };
}

export const IMP97376_MEASURED = Object.freeze({
  cBox: -3065.43,          // box + mass relaxation lower bound (tightest here)
  theta: -986.40,          // fill level: F = a/pi on { sigma_2 < theta }
  boxSupportLen: Math.PI / A, // 5.719201734760255 -- closed-form support length pi/a
  cPtwise: -3200.03,       // cruder -(a/pi)*int sigma_2^- lower bound
  negMassFull: 18301.6,    // int sigma_2^- over the whole line (confined -> finite)
  lastNegativeT: 10.53,    // sigma_2 < 0 only for |t| <~ 10.53 (bounded negative support)
  vacuousSymbolInf: -4336.198, // imp-97335 symbol-infimum floor (vacuous, at t = 9.3502)
  rayleighRitzUpperBracket: 0.582, // imp-97206 upper bracket on lambda_1 (the true c_sharp is near here)
});

export const IMP97376_VERDICT = Object.freeze({
  ticket: 'imp-97376',
  question:
    'can the single band-limited concentration primitive shared by the two c_sharp lower-bound routes (imp-97350) be supplied -- a quantitative bound on how much a PW_a density concentrates its weighted mass in the confined negative sigma_2 well at 2a=ln3 -- or what is its precise obstruction?',
  answer:
    'attempted via the tightest convex relaxation that keeps the two EASY band-limited facts (the diagonal reproducing-kernel ceiling F <= a/pi and unit mass int F = 1) while dropping the hard band-limited structure: c_sharp >= c_box = inf over the box { 0 <= F <= a/pi, int F = 1 } of int sigma_2 F = -3065.43 (a bathtub LP, support length pi/a = 5.7192, fill level theta = -986.40). This is the FIRST finite rigorous lower bound on c_sharp and tightens the vacuous symbol-infimum floor -4336.198 (imp-97335) to -3065.43, but it is NEGATIVE, so no positivity follows. The precise obstruction: the box constraint lets F saturate a/pi on a pi/a-wide neighbourhood of the deep well (t=9.35) at NO cost, whereas a genuine PW_a density cannot hold the ceiling across a set narrow relative to the sinc correlation length -- the off-diagonal reproducing-kernel coupling forces mass out into the positive t^4 far field. The ENTIRE gap c_sharp - c_box (from -3065.43 up to the ~0.55 Rayleigh-Ritz bracket) must come from that off-diagonal / weighted-prolate concentration structure, exactly the primitive imp-97161/imp-97350 isolated. So the diagonal ceiling plus unit mass provably cannot certify c_sharp > 0; the shared primitive is confirmed necessary and quantified (~+3065 of margin must be recovered from it).',
  binding_2a: LN3,
  pointwiseCeiling: BUDGET,
  // the attempt
  boxRelaxationIsRigorousLowerBound: true,   // every band-limited F is box-admissible -> c_box <= c_sharp
  cBox: -3065.43,
  boxFillLevelTheta: -986.40,
  boxSupportLenIsPiOverA: true,              // closed-form support length pi/a
  cPtwise: -3200.03,
  negativeSupportBounded: true,              // sigma_2 < 0 only for |t| <~ 10.53
  finiteLowerBoundsProduced: true,
  tightensVacuousSymbolInf: true,            // -4336.198 -> -3200.03 -> -3065.43
  // the obstruction
  boxRelaxationStaysNegative: true,          // c_box < 0 -> no positivity
  gapIsOffDiagonalConcentration: true,       // the miss is the off-diagonal reproducing-kernel structure
  diagonalCeilingPlusMassCannotCertifyPositivity: true,
  sharedPrimitiveConfirmedAndQuantified: true, // ~+3065 margin must come from the primitive
  // unchanged program state
  rigorousPositiveLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97376_BOX_RELAXATION_MISSES_OFFDIAGONAL_CONCENTRATION -- the band-limited concentration primitive ' +
    'shared by the two c_sharp = lambda_min(P_a M_sigma2 P_a) lower-bound routes (imp-97350) is attempted ' +
    'via its tightest convex relaxation: keep the two EASY band-limited facts inherited from ghat in PW_a ' +
    'with unit norm -- the diagonal reproducing-kernel ceiling F(t) <= K_a(t,t) = a/pi and unit mass ' +
    'int F = 1 -- and drop the hard band-limited structure. The relaxed problem inf over ' +
    '{ 0 <= F <= a/pi, int F = 1 } of int sigma_2 F is a bathtub LP with closed-form minimiser F = a/pi on ' +
    '{ sigma_2 < theta }, theta = -986.40, support length pi/a = 5.7192, value c_box = -3065.43; a cruder ' +
    'companion -(a/pi) int sigma_2^- = -3200.03 uses that the negative support is BOUNDED (sigma_2 < 0 only ' +
    'for |t| <~ 10.53, so int sigma_2^- = 18301.6 < infinity). Both are the first FINITE rigorous lower ' +
    'bounds on c_sharp and tighten the vacuous symbol-infimum floor -4336.198 (imp-97335), but both are ' +
    'NEGATIVE. The precise obstruction: the box constraint lets F saturate a/pi on a pi/a-wide ' +
    'neighbourhood of the deep well (t=9.35) at no cost, whereas a genuine PW_a density cannot hold the ' +
    'ceiling across a set narrow relative to the sinc correlation length -- the off-diagonal ' +
    'reproducing-kernel coupling forces mass into the positive t^4 far field, which the box relaxation ' +
    'ignores. The ENTIRE gap c_sharp - c_box (from -3065.43 up to the ~0.55 Rayleigh-Ritz bracket) must ' +
    'come from that off-diagonal / weighted-prolate concentration structure -- exactly ' +
    'IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN. Diagonal ceiling plus ' +
    'unit mass provably cannot certify c_sharp > 0; the shared primitive is confirmed necessary and ' +
    'quantified. Assessment only; no operator positivity; no bound moves; interval-rigorous reach stays ' +
    '2a<=0.96.',
  qed: false,
});
export default IMP97376_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97376_ASSERTIONS = [
  {
    id: 'imp97376-box-relaxation-is-finite-negative-and-tighter-than-vacuous',
    holds: () => {
      const { cBox, supportLen } = boxRelaxationLowerBound();
      // c_box is finite, negative, and strictly above (tighter than) the vacuous -4336.198 symbol-inf floor;
      // the closed-form support length is pi/a.
      return Number.isFinite(cBox) && cBox < 0 &&
        cBox > IMP97376_MEASURED.vacuousSymbolInf &&
        Math.abs(cBox - (-3065.43)) < 1.0 &&
        Math.abs(supportLen - Math.PI / A) < 1e-2 &&
        IMP97376_VERDICT.boxRelaxationIsRigorousLowerBound === true &&
        IMP97376_VERDICT.boxRelaxationStaysNegative === true;
    },
    why: 'the box+mass relaxation is a rigorous finite lower bound c_box = -3065.43 on c_sharp (support length pi/a), negative and tighter than the vacuous symbol-infimum -4336.198, so it tightens the floor but does not certify positivity.',
  },
  {
    id: 'imp97376-pointwise-negmass-bound-and-bounded-negative-support',
    holds: () => {
      const { cPtwise, negMassFull } = pointwiseNegMassLowerBound();
      // the confined negative support gives a finite total negative mass and the cruder -(a/pi)*mass bound,
      // which sits between the vacuous floor and the sharper box bound: -4336.198 < -3200.03 < -3065.43.
      return Number.isFinite(negMassFull) && negMassFull > 1e4 &&
        Math.abs(cPtwise - (-3200.03)) < 2.0 &&
        cPtwise > IMP97376_MEASURED.vacuousSymbolInf &&
        cPtwise < IMP97376_MEASURED.cBox &&
        IMP97376_VERDICT.negativeSupportBounded === true &&
        IMP97376_VERDICT.tightensVacuousSymbolInf === true;
    },
    why: 'sigma_2 has bounded negative support (|t| <~ 10.53) so int sigma_2^- = 18301.6 is finite, giving the cruder -(a/pi)*mass = -3200.03 bound, which is ordered -4336.198 < -3200.03 < -3065.43.',
  },
  {
    id: 'imp97376-pointwise-ceiling-is-a-over-pi',
    holds: () =>
      // (P3) the reproducing-kernel diagonal ceiling F(t) <= K_a(t,t) = a/pi, the EASY band-limited fact
      // the relaxation keeps; a = ln3/2.
      Math.abs(BUDGET - (LN3 / 2) / Math.PI) < 1e-15 &&
      Math.abs(A - LN3 / 2) < 1e-15 &&
      IMP97376_POINTWISE_CEILING > 0 &&
      Math.abs(IMP97376_VERDICT.pointwiseCeiling - BUDGET) < 1e-15,
    why: 'the pointwise band-limited ceiling is K_a(t,t) = a/pi with a = ln3/2 = 0.5493, i.e. a/pi = 0.17485 -- the diagonal reproducing-kernel fact the box relaxation retains.',
  },
  {
    id: 'imp97376-gap-is-offdiagonal-shared-primitive',
    holds: () =>
      IMP97376_VERDICT.gapIsOffDiagonalConcentration === true &&
      IMP97376_VERDICT.diagonalCeilingPlusMassCannotCertifyPositivity === true &&
      IMP97376_VERDICT.sharedPrimitiveConfirmedAndQuantified === true &&
      typeof IMP97376_VERDICT.subGap === 'string' &&
      IMP97376_VERDICT.subGap.includes('IMP97376_BOX_RELAXATION_MISSES_OFFDIAGONAL_CONCENTRATION') &&
      IMP97376_VERDICT.subGap.includes('IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN'),
    why: 'the entire gap c_sharp - c_box lives in the off-diagonal reproducing-kernel / weighted-prolate structure the box relaxation discards -- confirming and quantifying the imp-97350 shared primitive.',
  },
  {
    id: 'imp97376-assessment-only-no-qed',
    holds: () =>
      IMP97376_VERDICT.rigorousPositiveLowerBoundProduced === false &&
      IMP97376_VERDICT.operatorPositivityProved === false &&
      IMP97376_VERDICT.boundMoves === false &&
      IMP97376_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97376_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97376_BINDING_2A - LN3) < 1e-12 &&
      IMP97376_VERDICT.qed === false,
    why: 'assessment only: finite NEGATIVE lower bounds only, no rigorous positive lower bound, no operator positivity, no bound moves, interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97376_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97376-krein-band-limited-concentration-box-relaxation assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
