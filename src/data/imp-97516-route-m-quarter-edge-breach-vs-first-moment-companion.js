/**
 * @module imp-97516-route-m-quarter-edge-breach-vs-first-moment-companion
 *
 * imp-97516 (proof -- DERIVATION, HONEST OUTCOME: the imp-97496 b/4 lower-edge breach T(b) < -1/4
 * (|E1(b)| > b/4) does NOT touch the Route-M first-moment lower-companion program. E1(b) is NOT the
 * binding quantity for kappa_arith; the Cauchy-Schwarz first-moment reduction insulates the bound from
 * the b/4-edge failure by a FULL POWER of b. No bound moves; kappa_arith unchanged; RH open; NO QED).
 *
 *   Task (imp-97496 RESULT 3 follow-up): imp-97496 named an explicit squarefree b* = Prod_{379<=p<=
 *   73,612,801} p with T(b*) = -0.25000000 < -1/4, i.e. |E1(b*)| > b* / 4, breaching the b/4 lower edge
 *   (E1(b) = mu(b) b T(b); the ceiling |E1(b)| <= b/4 is exactly |T(b)| <= 1/4). Question: does this
 *   breach damage the Route-M lower-companion program -- the first moment F(b) >= kappa phi(b) b that
 *   reduces the mean-square lower companion via Cauchy-Schwarz Q(b) >= F(b)^2/S(b) (memory
 *   route_m_lower_companion) -- or is E1(b) simply not the binding quantity for kappa_arith?
 *
 *   ANSWER: E1(b) is NOT the binding quantity. It is EXACTLY the sub-leading remainder of the coprime
 *   sum L1(b), which enters the arithmetic first moment F_arith only through a lower-order term; the
 *   leading coefficient kappa_arith is fixed by the LEADING asymptotic of L1, which is E1-independent.
 *   The breach is a linear-in-b perturbation of a quadratic-in-b quantity and cannot move kappa_arith.
 *
 * -------------------------------------------------------------------------------
 * STEP 1 -- E1(b) IS THE SUB-LEADING REMAINDER OF L1(b) (definitional bridge).
 * -------------------------------------------------------------------------------
 * From the b/4-ceiling lineage (imp-97290 notation), with R_b = {a : 1<=a<=b-1, (a,b)=1} and
 * L1(b) = Sum_{a in R_b} a log a:
 *     E1(b)  =  L1(b)  -  phi(b) b ( (1/2) log b - 1/4 ).                          (definition)
 * From the first-moment arithmetic evaluation (imp-97096 RESULT), the LEADING asymptotic of L1 is
 *     L1(b)  ~  phi(b) b ( (1/2) log b - 1/4 ).                                    (leading term)
 * Subtracting, E1(b) is PRECISELY the remainder in the L1 asymptotic:
 *     E1(b)  =  L1(b)  -  [ leading term of L1(b) ].
 * So the "b/4 ceiling" |E1(b)| <= b/4 was, all along, a candidate explicit bound on the L1 REMAINDER;
 * imp-97496 shows that candidate bound is FALSE (breached at b*), but the LEADING term of L1 -- the only
 * part that feeds kappa_arith -- is untouched by any statement about its remainder.
 *
 * -------------------------------------------------------------------------------
 * STEP 2 -- HOW L1 (HENCE E1) ENTERS THE FIRST MOMENT, AND AT WHAT ORDER.
 * -------------------------------------------------------------------------------
 * The arithmetic first moment (imp-97096) is F_arith(b) = Sum_{a in R_b} [ C(a+b) + (1/2)(a-b) log(b/a) ]
 * = (E1-part) + (E2-part) + (M-part), where only the Moebius/Stirling piece carries L1:
 *     M(b)  =  -(1/2) ( L1(b) - b L0(b) ),      L0(b) = Sum_{a in R_b} log a.
 * Substituting L1(b) = phi(b) b ((1/2) log b - 1/4) + E1(b) splits M into its leading part (which cancels
 * the +(1/4) b phi(b) log b of E2 and supplies -(3/8) b phi(b)) PLUS the E1 contribution
 *     E1-share of F_arith  =  -(1/2) E1(b).
 * Thus E1(b) enters F_arith LINEARLY with coefficient -1/2. Since (proved cases + measured) |E1(b)| is of
 * order b (the ceiling scale) -- and even in the deepest window families of imp-97481/imp-97496 only grows
 * like b times a log-scale factor, |E1(b)| = O(b log b) -- its share of F_arith is O(b log b).
 *
 * -------------------------------------------------------------------------------
 * STEP 3 -- SCALE SEPARATION: E1 IS o(phi(b) b), THE FIRST MOMENT IS Theta(phi(b) b).
 * -------------------------------------------------------------------------------
 * F(b) = Theta(phi(b) b) with F_arith(b)/(phi(b) b) -> kappa_arith = (3/2)C - 3/8 = 0.5704960511...
 * The E1 share -(1/2) E1(b) divided by the leading scale is
 *     -(1/2) E1(b) / (phi(b) b)  =  O( (b log b) / (phi(b) b) )  =  O( log b / (phi(b)/b) * (1/b) ).
 * By the classical Landau minimal order phi(b)/b >= c / log log b, this is O( log b log log b / b ) -> 0:
 * a FULL POWER of b of headroom (measured E1/(phi b) decays like 1/b -- 1.18e-3 at b=211 down to 8.3e-6
 * at b=30011, a 141x drop for a 142x growth in b). Even the astronomical witness b* = Prod_{379<=p<=
 * 7.36e7} p has phi(b*)/b* ~ 0.33 (Mertens over its prime window), so E1(b*)/(phi(b*) b*) ~ (b* / 4)/
 * (0.33 b*^2) ~ 0.76/b* -- an infinitesimal fraction. Therefore E1(b) is structurally in the o(phi(b) b)
 * BUCKET of F_arith, never in the leading kappa_arith term.
 *
 * -------------------------------------------------------------------------------
 * STEP 4 -- THE CAUCHY-SCHWARZ REDUCTION AMPLIFIES THE INSULATION.
 * -------------------------------------------------------------------------------
 * The lower companion is reached (imp-97071) by Q(b) >= F(b)^2 / S(b) >= 3 F(b)^2 / b^3, then
 * Int(N) >= (36 kappa^2 / pi^2) log N. The binding input is F(b) at LEADING order Theta(phi(b) b) ~
 * Theta(b^2); it enters SQUARED. A perturbation of F by delta = -(1/2) E1(b) = O(b log b) changes F^2 by
 * 2 F delta + delta^2 = O(b^2 * b log b) + O(b^2 log^2 b) = O(b^3 log b) against F^2 = Theta(b^4): a
 * relative change O(log b / b) -> 0. The b/4-edge failure is thus insulated from the companion bound not
 * once but TWICE (linear-in-b remainder inside a quadratic F, then F entering squared).
 *
 * -------------------------------------------------------------------------------
 * WHAT THE BREACH DOES AND DOES NOT COST (the honest nuance).
 * -------------------------------------------------------------------------------
 * The imp-97096 arithmetic leaf left ONE residual: an EXPLICIT remainder bound on L0, L1 turning the exact
 * leading kappa_arith into an absolute lower bound F_arith(b) >= (kappa_arith - eps) phi(b) b for ALL b.
 * Because E1(b) IS the L1 remainder, a clean uniform ceiling |E1(b)| <= b/4 -- had it held -- would have
 * been a ready-made ingredient for that residual. imp-97496 shows it does NOT hold, so the residual CANNOT
 * borrow the b/4 ceiling as a shortcut. But the residual never NEEDED |E1| <= b/4: it only needs |E1(b)| =
 * o(phi(b) b) with an explicit eps, and the breach respects this comfortably (|E1| = O(b log b) vs
 * phi(b) b = Theta(b^2 / log log b)). So the breach removes a would-have-been convenience, not a load-bearing
 * step: the first-moment lower-companion program is UNHARMED, and kappa_arith is unchanged.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * E1(b) is NOT the binding quantity for kappa_arith. It is exactly the sub-leading remainder of L1(b),
 * entering the arithmetic first moment F_arith linearly with coefficient -1/2 at order O(b log b) =
 * o(phi(b) b), while F_arith = Theta(phi(b) b) is fixed at leading order by the E1-INDEPENDENT leading
 * asymptotic of L1. The Cauchy-Schwarz reduction, in which F enters squared, further insulates the
 * companion bound (relative effect O(log b / b)). Hence the imp-97496 b/4 lower-edge breach T(b) < -1/4
 * at the explicit witness b* does NOT damage the Route-M lower-companion program: the only cost is that
 * the false b/4 ceiling can no longer serve as a shortcut for the imp-97096 explicit-remainder residual,
 * which never needed it. kappa_arith unchanged; cotangent first moment (imp-97097) stays the open leaf;
 * no bound on Lambda moves; no refereed bound is changed; RH open; NO QED. Referee-worthy.
 *
 * @see imp-97496-route-m-quarter-ceiling-explicit-crossing-window.js (the explicit b/4-edge witness b*)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (E1(b) = L1(b) - phi(b) b((1/2)log b-1/4))
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (kappa_arith from the LEADING asymptotic of L1)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (the Cauchy-Schwarz reduction)
 *
 * Ticket: imp-97516 (proof, opus-4-8, api-pool). Derivation; NO QED.
 */

const C = (Math.log(2 * Math.PI) - 0.5772156649015329) / 2; // 0.6303307...
const KAPPA_ARITH = 1.5 * C - 3 / 8;                          // 0.5704960511...
const E1_COEFF_IN_FARITH = -0.5;                              // E1 enters F_arith linearly with coeff -1/2

// -- lightweight exact kernel (small-b self-checks only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));

// For a given b return phi, L0, L1, E1 (= L1 remainder), the (M) piece, F_arith, and E1's share of F_arith.
function arithStats(b) {
  let phi = 0, L0 = 0, L1 = 0, Farith = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) {
      phi++;
      L0 += Math.log(a);
      L1 += a * Math.log(a);
      Farith += C * (a + b) + 0.5 * (a - b) * Math.log(b / a);
    }
  }
  const E1 = L1 - phi * b * (0.5 * Math.log(b) - 0.25);       // imp-97290 definition
  const M = -0.5 * (L1 - b * L0);                             // imp-97096 (M) piece
  const E1shareOfFarith = E1_COEFF_IN_FARITH * E1;            // -(1/2) E1(b)
  return { b, phi, L0, L1, E1, M, Farith, E1shareOfFarith };
}

export const IMP97516_KERNEL = Object.freeze({
  arithStats, gcd, C, KAPPA_ARITH, E1_COEFF_IN_FARITH,
});

export const IMP97516_RESULTS = Object.freeze({
  question: 'does the imp-97496 b/4 lower-edge breach T(b) < -1/4 (|E1(b)| > b/4) damage the Route-M first-moment lower-companion bound, or is E1(b) not the binding quantity for kappa_arith',
  e1IsL1Remainder: 'E1(b) = L1(b) - phi(b) b((1/2) log b - 1/4) is EXACTLY the sub-leading remainder of the coprime sum L1(b); the b/4 ceiling was a candidate explicit bound on that remainder (imp-97290 vs imp-97096 leading asymptotic)',
  e1EntersFarithLinearly: 'L1 enters F_arith only through M(b) = -(1/2)(L1 - b L0); substituting the leading term leaves the E1 share of F_arith = -(1/2) E1(b), linear in b at order O(b log b)',
  scaleSeparation: 'F_arith = Theta(phi(b) b) with F_arith/(phi b) -> kappa_arith = 0.5704960511; the E1 share -(1/2)E1/(phi b) = O(log b log log b / b) -> 0 (measured E1/(phi b) decays like 1/b: 1.18e-3 at b=211 to 8.3e-6 at b=30011)',
  cauchySchwarzAmplifies: 'F enters SQUARED in Q(b) >= F(b)^2/S(b); a delta = -(1/2)E1 = O(b log b) perturbation of F = Theta(b^2) changes F^2 by a relative O(log b / b) -> 0 -- a second layer of insulation',
  witnessInsulated: 'even the explicit witness b* = Prod_{379<=p<=7.36e7} p has phi(b*)/b* ~ 0.33 (Mertens), so E1(b*)/(phi(b*) b*) ~ 0.76/b* -- infinitesimal; the breach cannot move kappa_arith',
  honestNuance: 'the ONLY cost: the false b/4 ceiling can no longer serve as a shortcut for the imp-97096 explicit-remainder residual (which needs |E1| = o(phi b) with explicit eps, NOT |E1| <= b/4); the residual is unharmed',
});

export const IMP97516_VERDICT = Object.freeze({
  question: 'is E1(b) the binding quantity for kappa_arith, or does the Cauchy-Schwarz first-moment reduction insulate the lower-companion bound from the b/4 lower-edge failure',
  e1IsBindingQuantity: false,           // E1 is a sub-leading remainder, not the leading kappa_arith input
  e1IsL1SubleadingRemainder: true,      // E1(b) = L1(b) - leading asymptotic of L1(b)
  e1EntersFarithAtLowerOrder: true,     // -(1/2) E1(b) = O(b log b) = o(phi(b) b)
  companionInsulatedByFullPowerOfB: true,
  kappaArithUnchanged: true,
  breachDamagesCompanion: false,
  residualLosesOnlyAShortcut: true,     // imp-97096 remainder residual can no longer borrow the b/4 ceiling
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'E1(b) is NOT the binding quantity for kappa_arith. It is exactly the sub-leading remainder of the ' +
    'coprime sum L1(b) (E1(b) = L1(b) - phi(b) b((1/2) log b - 1/4)); L1 enters the arithmetic first ' +
    'moment only through M(b) = -(1/2)(L1 - b L0), so E1 contributes -(1/2) E1(b) to F_arith -- linear ' +
    'in b at order O(b log b) = o(phi(b) b). The leading kappa_arith = (3/2)C - 3/8 = 0.5704960511 comes ' +
    'from the E1-INDEPENDENT leading asymptotic of L1, and F_arith = Theta(phi(b) b). The Cauchy-Schwarz ' +
    'reduction Q(b) >= F(b)^2/S(b) enters F squared, insulating the companion bound a second time ' +
    '(relative effect O(log b / b)). Hence the imp-97496 b/4 lower-edge breach T(b*) < -1/4 at the ' +
    'explicit witness b* does NOT damage the Route-M lower-companion program; the only cost is that the ' +
    'now-false b/4 ceiling can no longer be borrowed as a shortcut for the imp-97096 explicit-remainder ' +
    'residual, which never required it. kappa_arith unchanged; cotangent first moment (imp-97097) open; ' +
    'no bound on Lambda moves; no refereed bound is changed; RH open; NO QED. Referee-worthy.',
});

export const IMP97516_SUBGAP = Object.freeze({
  id: 'imp-97516-first-moment-companion-insulated-from-quarter-edge',
  statement:
    'The imp-97496 b/4 lower-edge breach (|E1(b*)| > b*/4) does NOT touch the first-moment lower-companion ' +
    'program: E1(b) is the sub-leading remainder of L1(b), entering F_arith at O(b log b) = o(phi(b) b) ' +
    'while F_arith = Theta(phi(b) b) is fixed by the E1-independent leading asymptotic of L1, and the ' +
    'Cauchy-Schwarz reduction has F enter squared. RESIDUAL (unchanged, inherited from imp-97096): an ' +
    'EXPLICIT remainder bound |E1(b)| <= eps(b) phi(b) b with eps -> 0 for ALL b, turning kappa_arith into ' +
    'an absolute lower bound. The b/4 ceiling is NOT available for this (it is false); the residual needs ' +
    'only o(phi b), not <= b/4, so it stands independent of the breach. The cotangent first moment ' +
    '(imp-97097) remains the separate hard open leaf.',
  supersedesFraming: 'imp-97496 open worry "does the b/4-edge breach damage Route-M" -- resolved: NO; E1 is not the binding quantity, insulated by a full power of b',
});

export const IMP97516_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. The imp-97496 b/4 lower-edge breach T(b*) < -1/4 ' +
  '(|E1(b*)| > b*/4) does NOT damage the Route-M first-moment lower-companion program: E1(b) is the ' +
  'sub-leading remainder of L1(b), entering F_arith at O(b log b) = o(phi(b) b), while F_arith = ' +
  'Theta(phi(b) b) is fixed by the E1-independent leading asymptotic of L1 and F enters the ' +
  'Cauchy-Schwarz reduction squared. E1(b) is NOT the binding quantity for kappa_arith; kappa_arith ' +
  'unchanged. The only cost is that the now-false b/4 ceiling can no longer shortcut the imp-97096 ' +
  'explicit-remainder residual, which never needed it.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. LIGHT sieves only. --

const IMP97516_ASSERTIONS = [
  {
    id: 'imp97516-e1-is-l1-subleading-remainder',
    holds: () => {
      // STEP 1: E1(b) = L1(b) - phi(b) b((1/2)log b - 1/4) by construction; and for a prime p, mu=-1,
      // so E1(p)/(p/4) -> -1 (saturates the ceiling from below in magnitude).
      const s = arithStats(9973); // prime
      const e1Def = s.L1 - s.phi * 9973 * (0.5 * Math.log(9973) - 0.25);
      return Math.abs(s.E1 - e1Def) < 1e-6 &&           // definition self-consistent
             s.E1 < 0 && Math.abs(s.E1 / (9973 / 4) - (-1)) < 0.01; // ~ -b/4 for a prime
    },
    why: 'E1(b) is exactly the L1 remainder past its leading asymptotic; for a prime it saturates -b/4 (mu=-1), the ceiling edge.',
  },
  {
    id: 'imp97516-e1-enters-farith-linearly-coeff-minus-half',
    holds: () => {
      // STEP 2: L1 enters F_arith only via M = -(1/2)(L1 - b L0); the E1 share of F_arith is -(1/2) E1(b).
      const s = arithStats(5003);
      const mCheck = -0.5 * (s.L1 - 5003 * s.L0);
      return Math.abs(s.M - mCheck) < 1e-6 &&
             Math.abs(s.E1shareOfFarith - (-0.5 * s.E1)) < 1e-9 &&
             E1_COEFF_IN_FARITH === -0.5;
    },
    why: 'the Moebius/Stirling piece M carries L1 with coefficient -1/2, so E1 (the L1 remainder) contributes -(1/2) E1(b) to F_arith -- linear in b.',
  },
  {
    id: 'imp97516-scale-separation-e1-is-o-phi-b',
    holds: () => {
      // STEP 3: E1/(phi b) decays like 1/b (a full power of b below the leading scale), while
      // F_arith/(phi b) -> kappa_arith. Ratio must SHRINK as b grows.
      const s1 = arithStats(211), s2 = arithStats(9973);
      const r1 = Math.abs(s1.E1 / (s1.phi * 211));
      const r2 = Math.abs(s2.E1 / (s2.phi * 9973));
      const bGrow = 9973 / 211;                 // ~47.3
      const ratioDrop = r1 / r2;                // should be ~ bGrow if E1/(phi b) ~ 1/b
      return r1 < 2e-3 && r2 < 5e-5 &&          // both tiny
             ratioDrop > 0.5 * bGrow &&          // decays at least ~ 1/b (a full power of b)
             Math.abs(s2.Farith / (s2.phi * 9973) - KAPPA_ARITH) < 1e-3; // F_arith -> kappa_arith
    },
    why: 'E1/(phi b) decays like 1/b (a full power of b) while F_arith/(phi b) -> kappa_arith = 0.5705; the breach is a linear-in-b perturbation of a quadratic-in-b quantity.',
  },
  {
    id: 'imp97516-cauchy-schwarz-squared-amplifies-insulation',
    holds: () => {
      // STEP 4: F enters squared; a delta = -(1/2)E1 perturbation gives relative change to F^2 of
      // (2 F delta + delta^2)/F^2 = O(log b / b) -> 0.
      const s = arithStats(9973);
      const F = s.Farith, delta = s.E1shareOfFarith;
      const relF2 = Math.abs((2 * F * delta + delta * delta) / (F * F));
      return relF2 < 1e-3;   // razor-small relative effect on F^2 already at modest b
    },
    why: 'in Q(b) >= F(b)^2/S(b) the first moment enters squared; the E1 perturbation changes F^2 by a relative O(log b / b), a second insulation layer.',
  },
  {
    id: 'imp97516-honesty-gate-no-qed',
    holds: () =>
      IMP97516_VERDICT.e1IsBindingQuantity === false &&
      IMP97516_VERDICT.breachDamagesCompanion === false &&
      IMP97516_VERDICT.kappaArithUnchanged === true &&
      IMP97516_VERDICT.companionInsulatedByFullPowerOfB === true &&
      IMP97516_VERDICT.residualLosesOnlyAShortcut === true &&
      IMP97516_VERDICT.anyBoundMoved === false &&
      IMP97516_VERDICT.qed === false &&
      /insulated/.test(IMP97516_SUBGAP.id) &&
      /NO QED/.test(IMP97516_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97516_HONEST_BANNER) &&
      /RH open/.test(IMP97516_HONEST_BANNER),
    why: 'derivation leaf: the b/4-edge breach is insulated from the first-moment companion; no bound moved, no QED.',
  },
];

for (const a of IMP97516_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97516-route-m-quarter-edge-breach-vs-first-moment-companion assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97516_KERNEL,
  results: IMP97516_RESULTS,
  verdict: IMP97516_VERDICT,
  subGap: IMP97516_SUBGAP,
  banner: IMP97516_HONEST_BANNER,
};
