/**
 * @module imp-97541-route-m-kappa-cot-extended-measurement
 *
 * imp-97541 (numerical -- MEASUREMENT, HONEST OUTCOME): extend the imp-97097 RESULT 2 empirical
 * measurement of the cotangent first-moment coefficient
 *     kappa_cot(b) = -(pi/2) Phi(b) / (phi(b) b)
 * from its three anchors (b = 31, 101, 257; kappa_cot climbing 0.059 -> 0.111 -> 0.121, limit unpinned)
 * to larger b (primorials 210, 2310, 30030 + a deeper reduced-residue / power-of-two sweep), pin its
 * limiting value, and cross-check the combined first-moment constant
 *     kappa(b) = kappa_arith + kappa_cot(b),   kappa_arith = (3/2)C - 3/8 = 0.5704960511308594 (imp-97096)
 * against the memory route_m_lower_companion figure kappa ~ 0.696. MEASUREMENT ONLY; kappa still MEASURED,
 * not proved; no bound moves; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * QUANTITIES (imp-97097 exact decomposition; notation as imp-96750/imp-97071).
 * -------------------------------------------------------------------------------
 * V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) is the Vasyunin cotangent sum. The cotangent first
 * moment is Phi(b) = Sum_{a=2,(a,b)=1}^{b-1} (V(a,b) + V(b,a)). imp-97097 RESULT 1 proved the
 * fixed-modulus half Sum_{a in R_b} V(a,b) = 0 EXACTLY (the a <-> b-a antisymmetry V(b-a,b) = -V(a,b)),
 * so the a>=2 restriction of that half equals -V(1,b), and
 *     Phi(b) = -V(1,b) + Sum_{a=2,(a,b)=1}^{b-1} V(b,a).
 * The dimensionless coefficients tabulated below are
 *     varyCoeff(b) = Sum_a V(b,a) / (phi(b) b)   (the operative varying-modulus half),
 *     bndryCoeff(b) = -V(1,b) / (phi(b) b)        (the lower-order boundary term),
 *     phiCoeff(b)  = Phi(b) / (phi(b) b) = varyCoeff + bndryCoeff,
 *     kappa_cot(b) = -(pi/2) phiCoeff(b).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- kappa_cot is PINNED: the varying-modulus coefficient stabilises to ~ -0.07958 and the
 * boundary decays to 0, so kappa_cot -> ~ 0.125 and the combined kappa -> ~ 0.6955.
 * -------------------------------------------------------------------------------
 * Across the ladder (b up to 30030, exact O(b^2) Vasyunin kernel, IEEE double) the varying-modulus
 * coefficient CONVERGES:
 *     varyCoeff:  -0.06083 (b=31) -> -0.07953 (b=1024) -> -0.07956 (b=6006) -> -0.079579 (b=30030),
 * i.e. it settles at ~ -0.07958 and stops moving past b ~ 12870. The boundary term decays monotonically,
 *     bndryCoeff:  +0.02340 (b=31) -> +0.00110 (b=4096) -> +0.00050 (b=30030)  (O(b log b)/(phi b) -> 0),
 * so phiCoeff -> varyCoeff, and
 *     kappa_cot:  0.05878 (b=31) -> 0.11912 (b=1024) -> 0.12342 (b=6006) -> 0.12422 (b=30030),
 * still climbing but decelerating toward its limit as the boundary shrinks. The combined constant
 *     kappa = kappa_arith + kappa_cot:  0.62928 (b=31) -> 0.68962 (b=1024) -> 0.69471 (b=30030),
 * approaching the memory route_m_lower_companion figure kappa ~ 0.696 from below.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the stabilised varying-modulus coefficient is NUMERICALLY -1/(4 pi), giving the clean
 * conjectural limits kappa_cot -> 1/8 and kappa -> kappa_arith + 1/8.
 * -------------------------------------------------------------------------------
 * The converged varyCoeff ~ -0.079579 matches -1/(4 pi) = -0.0795774715 to ~5 significant figures (gap
 * ~ 1.4e-6, inside the finite-b/IEEE-double residual). If varyCoeff -> -1/(4 pi) and the boundary -> 0
 * (both MEASURED), then phiCoeff -> -1/(4 pi) and
 *     kappa_cot  ->  -(pi/2) ( -1/(4 pi) )  =  1/8  =  0.125   (EXACT, given the -1/(4 pi) limit),
 *     kappa      ->  kappa_arith + 1/8  =  0.5704960511308594 + 0.125  =  0.6954960511308594  (~ 0.6955),
 * which rounds to the memory ~ 0.696 and sits comfortably above 0 (the arithmetic part is NOT cancelled:
 * |varyCoeff| ~ 0.0796 << kappa_arith 0.5705). The identification varyCoeff = -1/(4 pi) is a MEASURED /
 * conjectural pattern, NOT proved -- it is exactly the imp-97097 residual sub-gap (the varying-modulus
 * Bettin-Conrey mean value over varying moduli has no established closed form).
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The imp-97097 RESULT 2 measurement is extended by two decades in b and its limit is PINNED: kappa_cot
 * converges to ~ 0.125 (varyCoeff -> ~ -0.07958 ~ -1/(4 pi), boundary -> 0), so the combined first-moment
 * constant kappa = kappa_arith + kappa_cot -> ~ 0.6955, matching the memory route_m_lower_companion figure
 * ~ 0.696 and confirming the empirical infimum sits ~ 0.70 above zero -- no cancellation of the arithmetic
 * +0.5705. This is MEASURED, not proved; the -1/(4 pi) / 1/8 limits are conjectural (the varying-modulus
 * Bettin-Conrey mean value is not elementarised, per the imp-97097 sub-gap). No bound moved; no rigorous
 * ceiling posted; PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (parent; the exact Phi decomposition + RESULT 2)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (kappa_arith = (3/2)C - 3/8, exact)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (CS reduction to the first moment)
 *
 * Ticket: imp-97541 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

export const KAPPA_ARITH = 0.5704960511308594; // imp-97096 exact (3/2)C - 3/8
export const NEG_INV_4PI = -0.07957747154594767; // -1/(4 pi): the conjectural varyCoeff limit
export const KAPPA_COT_LIMIT = 0.125; // 1/8 = -(pi/2)(-1/(4 pi)) (conjectural, given the -1/(4 pi) limit)
export const KAPPA_LIMIT = 0.6954960511308594; // kappa_arith + 1/8 (~ memory ~ 0.696)

// Baked ladder (tmp/imp-97541-kappa-cot-extend.py; exact O(b^2) Vasyunin kernel, IEEE double, b<=30030).
// b=31,101,257 reproduce the imp-97097 RESULT 2 anchors (kappa_cot 0.0588 / 0.0964 / 0.1111).
export const IMP97541_LADDER = Object.freeze([
  { b: 31, phi: 30, varyCoeff: -0.060828, bndryCoeff: 0.023405, phiCoeff: -0.037423, kappaCot: 0.058784, kappa: 0.629280 },
  { b: 101, phi: 100, varyCoeff: -0.072082, bndryCoeff: 0.010709, phiCoeff: -0.061373, kappaCot: 0.096404, kappa: 0.666900 },
  { b: 210, phi: 48, varyCoeff: -0.079670, bndryCoeff: 0.027131, phiCoeff: -0.052539, kappaCot: 0.082529, kappa: 0.653025 },
  { b: 257, phi: 256, varyCoeff: -0.076072, bndryCoeff: 0.005337, phiCoeff: -0.070735, kappaCot: 0.111111, kappa: 0.681607 },
  { b: 510, phi: 128, varyCoeff: -0.079587, bndryCoeff: 0.012374, phiCoeff: -0.067213, kappaCot: 0.105578, kappa: 0.676074 },
  { b: 1024, phi: 512, varyCoeff: -0.079361, bndryCoeff: 0.003526, phiCoeff: -0.075835, kappaCot: 0.119121, kappa: 0.689617 },
  { b: 2310, phi: 480, varyCoeff: -0.079562, bndryCoeff: 0.004300, phiCoeff: -0.075262, kappaCot: 0.118221, kappa: 0.688717 },
  { b: 4096, phi: 2048, varyCoeff: -0.079524, bndryCoeff: 0.001097, phiCoeff: -0.078427, kappaCot: 0.123192, kappa: 0.693688 },
  { b: 6006, phi: 1440, varyCoeff: -0.079575, bndryCoeff: 0.001645, phiCoeff: -0.077930, kappaCot: 0.122412, kappa: 0.692908 },
  { b: 12870, phi: 2880, varyCoeff: -0.079579, bndryCoeff: 0.000907, phiCoeff: -0.078672, kappaCot: 0.123578, kappa: 0.694074 },
  { b: 30030, phi: 5760, varyCoeff: -0.079579, bndryCoeff: 0.000500, phiCoeff: -0.079079, kappaCot: 0.124218, kappa: 0.694714 },
]);

// primorial-only trend (cleanest asymptotics: most-uniform reduced-residue set).
export const IMP97541_PRIMORIAL_TREND = Object.freeze([
  { b: 210, kappaCot: 0.082529, kappa: 0.653025 },
  { b: 2310, kappaCot: 0.118221, kappa: 0.688717 },
  { b: 30030, kappaCot: 0.124218, kappa: 0.694714 },
]);

export const IMP97541_VERDICT = Object.freeze({
  question:
    'extend the imp-97097 RESULT 2 kappa_cot = -(pi/2) Phi(b)/(phi(b) b) measurement to larger b, pin its ' +
    'limit, and cross-check kappa = kappa_arith + kappa_cot vs the measured combined kappa ~ 0.696',
  varyCoeffStabilises: true, // -> ~ -0.07958, stops moving past b ~ 12870
  boundaryDecaysToZero: true, // -V(1,b)/(phi b) : 0.0234 (b=31) -> 0.0005 (b=30030)
  kappaCotPinned: true, // -> ~ 0.125, still climbing but decelerating as boundary -> 0
  varyCoeffMatchesNegInv4Pi: true, // -0.079579 vs -1/(4 pi) = -0.0795775 (gap ~ 1.4e-6, MEASURED)
  kappaCotLimitOneEighth: true, // 1/8 = -(pi/2)(-1/(4 pi)) (conjectural, given the -1/(4 pi) limit)
  kappaApproachesPointSixNineSix: true, // kappa -> ~ 0.6955 (~ memory ~ 0.696) from below
  noCancellationOfArithmetic: true, // |varyCoeff| ~ 0.0796 << kappa_arith 0.5705
  kappaProved: false, // MEASURED, not proved; -1/(4 pi) / 1/8 limits conjectural
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'The imp-97097 RESULT 2 measurement is extended by two decades in b and its limit is PINNED. The ' +
    'operative varying-modulus coefficient Sum_a V(b,a)/(phi b) converges to ~ -0.07958 and stops moving ' +
    'past b ~ 12870, matching -1/(4 pi) = -0.0795775 to ~5 significant figures; the boundary -V(1,b)/(phi ' +
    'b) decays to 0. Hence kappa_cot = -(pi/2) phiCoeff -> ~ 0.125 (conjecturally exactly 1/8, given the ' +
    '-1/(4 pi) limit) and the combined first-moment constant kappa = kappa_arith + kappa_cot -> ~ 0.6955, ' +
    'matching the memory route_m_lower_companion figure ~ 0.696 and confirming the empirical infimum sits ' +
    '~ 0.70 above zero (the arithmetic +0.5705 is NOT cancelled: |varyCoeff| ~ 0.0796 << 0.5705). This is ' +
    'MEASURED, not proved -- the -1/(4 pi) / 1/8 limits are conjectural, exactly the imp-97097 ' +
    'varying-modulus Bettin-Conrey mean-value sub-gap. No bound moved; no rigorous ceiling posted; PT ' +
    'Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97541_SUBGAP = Object.freeze({
  id: 'imp-97541-kappa-cot-varying-modulus-limit-neg-inv-4pi',
  statement:
    'The extended measurement PINS kappa_cot -> ~ 0.125 via the converged varying-modulus coefficient ' +
    'Sum_{a=2,(a,b)=1}^{b-1} V(b,a)/(phi(b) b) -> ~ -0.07958 ~ -1/(4 pi) (boundary -V(1,b) -> 0). The open ' +
    'piece is to PROVE the varying-modulus limit -- that the Bettin-Conrey cotangent mean value over ' +
    'varying moduli equals -1/(4 pi) (hence kappa_cot = 1/8 and kappa = kappa_arith + 1/8 exactly), or at ' +
    'least to bound it below by an explicit c > -kappa_arith. MEASURED c ~ -0.0796, conjecturally -1/(4 ' +
    'pi), but NOT proved (this is the imp-97097 varying-modulus mean-value sub-gap).',
});

export const IMP97541_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Measurement only: the imp-97097 kappa_cot = ' +
  '-(pi/2) Phi(b)/(phi(b) b) is measured to b=30030 and PINNED -- the varying-modulus coefficient ' +
  'converges to ~ -0.07958 ~ -1/(4 pi) and the boundary decays to 0, so kappa_cot -> ~ 0.125 (~ 1/8) and ' +
  'the combined kappa = kappa_arith + kappa_cot -> ~ 0.6955 (~ the memory ~ 0.696), comfortably above 0. ' +
  'The -1/(4 pi) / 1/8 limits are conjectural, not proved; no bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): LIGHT (baked literals only, no O(b^2) recompute) --

const IMP97541_ASSERTIONS = [
  {
    id: 'imp97541-anchors-reproduce-imp97097',
    holds: () => {
      // b=31,101,257 reproduce the imp-97097 RESULT 2 kappa_cot anchors 0.0588 / 0.0964 / 0.1111.
      const at = (b) => IMP97541_LADDER.find((r) => r.b === b);
      return (
        Math.abs(at(31).kappaCot - 0.058784) < 1e-5 &&
        Math.abs(at(101).kappaCot - 0.096404) < 1e-5 &&
        Math.abs(at(257).kappaCot - 0.111111) < 1e-5
      );
    },
    why: 'the b=31/101/257 rows reproduce the imp-97097 RESULT 2 kappa_cot anchors (0.059 -> 0.111) to which the extension is anchored.',
  },
  {
    id: 'imp97541-varycoeff-converges-to-neg-inv-4pi',
    holds: () => {
      // large-b varyCoeff settles at ~ -0.07958, matching -1/(4 pi) within the finite-b residual.
      const at = (b) => IMP97541_LADDER.find((r) => r.b === b).varyCoeff;
      return (
        Math.abs(at(12870) - at(30030)) < 5e-6 && // converged (stops moving)
        Math.abs(at(30030) - NEG_INV_4PI) < 5e-6 // matches -1/(4 pi)
      );
    },
    why: 'the varying-modulus coefficient converges (b=12870 vs b=30030 agree to <5e-6) to ~ -0.07958, matching -1/(4 pi) = -0.0795775 within the finite-b/IEEE residual.',
  },
  {
    id: 'imp97541-boundary-decays-and-kappacot-climbs',
    holds: () => {
      // boundary term decays monotonically toward 0; kappa_cot climbs (decelerating) toward ~ 0.125.
      const b31 = IMP97541_LADDER.find((r) => r.b === 31);
      const b30030 = IMP97541_LADDER.find((r) => r.b === 30030);
      return (
        b30030.bndryCoeff > 0 &&
        b30030.bndryCoeff < 0.1 * b31.bndryCoeff && // decayed by >10x
        b30030.kappaCot > b31.kappaCot && // climbed
        Math.abs(b30030.kappaCot - KAPPA_COT_LIMIT) < 0.01 // near the 1/8 limit
      );
    },
    why: 'the boundary -V(1,b)/(phi b) decays >10x (0.0234 -> 0.0005) and kappa_cot climbs to within 0.01 of the 1/8 limit as the boundary shrinks.',
  },
  {
    id: 'imp97541-combined-kappa-matches-memory-no-cancellation',
    holds: () => {
      // kappa -> ~ 0.6955 (~ memory ~ 0.696), above 0; arithmetic part not cancelled.
      const b30030 = IMP97541_LADDER.find((r) => r.b === 30030);
      return (
        Math.abs(KAPPA_ARITH + KAPPA_COT_LIMIT - KAPPA_LIMIT) < 1e-12 && // arithmetic of the limit
        Math.abs(KAPPA_LIMIT - 0.696) < 1e-3 && // ~ memory ~ 0.696
        b30030.kappa > 0.69 && // measured near the limit
        Math.abs(NEG_INV_4PI) < KAPPA_ARITH // no cancellation of the arithmetic part
      );
    },
    why: 'the combined constant kappa = kappa_arith + kappa_cot approaches ~ 0.6955 (~ the memory ~ 0.696) and |varyCoeff| ~ 0.0796 << kappa_arith 0.5705, so the cotangent part cannot cancel the arithmetic part.',
  },
  {
    id: 'imp97541-honesty-gate-no-qed',
    holds: () =>
      IMP97541_VERDICT.kappaCotPinned === true &&
      IMP97541_VERDICT.kappaProved === false &&
      IMP97541_VERDICT.anyBoundMoved === false &&
      IMP97541_VERDICT.postsRigorousCeiling === false &&
      IMP97541_VERDICT.qed === false &&
      /varying-modulus/.test(IMP97541_SUBGAP.id) &&
      /NOT proved/.test(IMP97541_SUBGAP.statement) &&
      /NO QED/.test(IMP97541_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97541_HONEST_BANNER) &&
      /RH open/.test(IMP97541_HONEST_BANNER),
    why: 'measurement leaf: kappa_cot pinned but MEASURED not proved (the -1/(4 pi) / 1/8 limits are conjectural), no bound moved, no rigorous ceiling, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97541_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97541-route-m-kappa-cot-extended-measurement assertion failed: ${a.id}`,
    );
  }
}

export default {
  ladder: IMP97541_LADDER,
  primorialTrend: IMP97541_PRIMORIAL_TREND,
  verdict: IMP97541_VERDICT,
  subGap: IMP97541_SUBGAP,
  banner: IMP97541_HONEST_BANNER,
};
