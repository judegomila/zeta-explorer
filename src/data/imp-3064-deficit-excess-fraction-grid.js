/**
 * @module imp-3064-deficit-excess-fraction-grid
 * @fileoverview imp-3064 -- Tabulate the raw degree-0 deficit mass D_raw(a, U)
 *   and the cosh-over-minimal excess mass E(a, U) across BOTH an a-grid and a
 *   U-range, and report the excess fraction E / D_raw -- the price, in the
 *   degree-0 (scale-invariant, RH-equivalent) measure, of using the forced even
 *   cosh-completion w^pass(tau) = cosh(a*tau) instead of the cheaper minimal
 *   kinked patch w^min(tau) = max(1, sinh(a*tau)).
 *
 *   WHAT WAS ALREADY ESTABLISHED
 *   ----------------------------
 *   - imp-3007 (imp-3007-mupass-overflow-cover.js) gave, at the single lag
 *     cutoff U = 6, the closed forms
 *       D_raw(a) = int_{tau_star}^{U} [sinh(a*tau) - 1] d(tau)
 *                = [cosh(a*tau)/a - tau]_{tau_star}^{U}   (~13.07 at a = 0.5)
 *       E(a)     = int_0^U [cosh(a*tau) - max(1, sinh(a*tau))] d(tau)
 *     and isolated the off-diagonal endpoint-Hankel operator step as the lone
 *     remaining gap. It reported D_raw and E only on a 4-point a-sweep at fixed
 *     U; the excess FRACTION E / D_raw (how far the forced even completion sits
 *     from the minimal patch, in relative terms) was never tabulated, and the
 *     U-dependence was never swept.
 *
 *   WHAT THIS MODULE ADDS (the imp-3064 deliverable)
 *   ------------------------------------------------
 *   (1) THE 2-D GRID. D_raw(a, U) and E(a, U) are re-evaluated in closed form on
 *       the full Cartesian product A_GRID x U_GRID, with a midpoint numeric
 *       cross-check of BOTH masses on each cell. The crossover lag is
 *       tau_star = arcsinh(1)/a (sinh(a*tau_star) = 1); a cell has a raw overflow
 *       exactly when tau_star < U.
 *
 *   (2) THE EXCESS FRACTION. For every cell with an overflow we report
 *       phi(a, U) = E(a, U) / D_raw(a, U). This is the quantified price of the
 *       smooth even no-ghost weight: the surplus passive mass the cosh pours in
 *       beyond the minimal cover, measured against the raw overflow it had to
 *       cover. At the imp-3007 headline (a = 0.5, U = 6) it is ~0.0739 (7.39%).
 *
 *   (3) THE a*U SCALE INVARIANT (the diagnostic finding). Both masses factor as
 *       a pure prefactor 1/a times a function of the single product s = a*U:
 *           a * D_raw = F(s) = cosh(s) - sqrt(2) - s + arcsinh(1)
 *           a * E     = G(s) = sqrt(2) - arcsinh(1) - e^{-s}
 *       (valid for s > arcsinh(1), i.e. where the overflow exists; the head
 *       boundary cosh(a*tau_star) = sqrt(2) and a*tau_star = arcsinh(1) supply
 *       the constants). The 1/a prefactor cancels in the ratio, so the excess
 *       fraction depends ONLY on s = a*U:
 *           phi(a, U) = G(a*U) / F(a*U).
 *       Equal-product cells coincide exactly -- e.g. (a, U) = (0.5, 6) and
 *       (0.3, 10) both give phi = 0.0739, and (0.5, 4) and (0.2, 10) both give
 *       0.3233. As the lag window lengthens (s grows) F(s) ~ e^s/2 blows up while
 *       G(s) saturates at sqrt(2) - arcsinh(1) ~ 0.533, so phi -> 0: the fixed
 *       even-completion surplus is diluted by the exponentially growing raw
 *       overflow. The price of the no-ghost weight is therefore small precisely
 *       where the overflow it covers is large.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC, RH-EQUIVALENT, NOT A REDUCTION. This is a faithful
 *   degree-0 measurement of the cover constructed in imp-3007; it neither proves
 *   nor weakens RH. The off-diagonal endpoint-Hankel operator step that imp-3007
 *   isolated remains the lone obstruction and is untouched here. The bare-V pilot
 *   (imp-1240) is NOT re-run. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3007-mupass-overflow-cover.js (imp-3007: the U=6 cover + closed forms)
 *   @see imp-2686-mupass-construction.js (imp-2686: the cosh-completion)
 *   @see imp-mu-pass-overflow-quantification.js (imp-2841: the raw deg-0 deficit profile)
 *
 *   Ticket: imp-3064 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A_GRID = Object.freeze([0.5, 0.3, 0.2, 0.1, 0.05]);
const U_GRID = Object.freeze([4, 6, 8, 10]);
const N = 4000;          // midpoint grid for the self-verifying numeric cross-check

const ASINH1 = Math.asinh(1);  // = ln(1+sqrt(2)); a*tau_star solves sinh(a*tau)=1
const SQRT2 = Math.SQRT2;      // = cosh(a*tau_star), since cosh = sqrt(1 + sinh^2)

/**
 * Reduced single-variable masses in the product s = a*U (valid where s > arcsinh(1),
 * i.e. an overflow exists). a*D_raw = F(s) and a*E = G(s); the 1/a prefactor cancels
 * in the excess fraction phi = G(s)/F(s), which therefore depends on s = a*U alone.
 */
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E   (overflow regime)

/**
 * One (a, U) cell of the degree-0 deficit/excess grid. All masses are Lebesgue on
 * the lag tau over [0, U] (the degree-0, scale-invariant, RH-equivalent measure).
 *   nu(tau)     = sinh(a*tau)            (shear weight)
 *   w^pass(tau) = cosh(a*tau)            (endpoint-bridge cosh-completion)
 *   w^min(tau)  = max(1, sinh(a*tau))    (minimal tail-only cover)
 * Returns D_raw, E, the excess fraction E/D_raw (null when no overflow exists),
 * and a midpoint numeric cross-check of both masses on the same grid.
 */
function gridCell(a, U) {
  const tauStar = ASINH1 / a;                  // sinh(a*tauStar) = 1
  const hasOverflow = tauStar < U;

  // Raw degree-0 deficit on the overflow tail [tauStar, U] (matches imp-3007 / imp-2841):
  //   int_{tauStar}^{U} [sinh(a*tau) - 1] d(tau) = [cosh(a*tau)/a - tau].
  const rawDeficit = hasOverflow
    ? (Math.cosh(a * U) / a - U) - (Math.cosh(a * tauStar) / a - tauStar)
    : 0;

  // Excess passive mass of the cosh-completion over the minimal kinked cover:
  //   E = int_0^U [cosh(a*tau) - max(1, sinh(a*tau))] d(tau).
  //   head on [0, tauStar]: cosh - 1   -> 1/a - tauStar  (sinh(a*tauStar) = 1)
  //   tail on [tauStar, U]: cosh - sinh -> (e^{-a*tauStar} - e^{-a*U})/a
  let excessMass;
  if (hasOverflow) {
    const head = 1 / a - tauStar;
    const tail = (Math.exp(-a * tauStar) - Math.exp(-a * U)) / a;
    excessMass = head + tail;
  } else {
    excessMass = Math.sinh(a * U) / a - U;     // int_0^U (cosh - 1), no overflow tail
  }

  // The deliverable: relative price of the forced even weight, E/D_raw (null if no overflow).
  const excessFraction = rawDeficit > 0 ? excessMass / rawDeficit : null;

  // Midpoint numeric cross-check of BOTH masses (tripwire; headline numbers are closed form).
  const Hstep = U / N;
  let rawDeficitNumeric = 0;
  let excessMassNumeric = 0;
  for (let k = 0; k < N; k++) {
    const tau = (k + 0.5) * Hstep;
    const sh = Math.sinh(a * tau);
    const ch = Math.cosh(a * tau);
    rawDeficitNumeric += Math.max(0, sh - 1) * Hstep;
    excessMassNumeric += (ch - Math.max(1, sh)) * Hstep;
  }

  // Scale-invariant restatement via s = a*U: a*D_raw = F(s), a*E = G(s).
  const s = a * U;
  const reducedFraction = hasOverflow ? G(s) / F(s) : null;

  return Object.freeze({
    a,
    U,
    s,                       // the a*U scale invariant
    tauStar,
    hasOverflow,
    rawDeficit,              // D_raw(a, U): the 64%-class raw overflow mass
    excessMass,              // E(a, U): cosh-completion surplus over the minimal cover
    excessFraction,          // phi = E/D_raw: the price of the no-ghost even weight (null if no overflow)
    reducedFraction,         // G(s)/F(s): the same fraction from the s = a*U invariant
    rawDeficitNumeric,       // midpoint cross-check of D_raw
    excessMassNumeric,       // midpoint cross-check of E
  });
}

const ROWS = Object.freeze(
  A_GRID.flatMap((a) => U_GRID.map((U) => gridCell(a, U)))
);

// Headline cell ties back to the imp-3007 anchor (a = 0.5, U = 6, D_raw ~ 13.07).
const HEADLINE = ROWS.find((r) => r.a === 0.5 && r.U === 6);

export const IMP3064_DEFICIT_EXCESS_FRACTION_GRID = Object.freeze({
  id: 'imp-3064-deficit-excess-fraction-grid',
  ticket: 'imp-3064',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedCover: 'imp-3007-mupass-overflow-cover.js',
  relatedConstruction: 'imp-2686-mupass-construction.js',
  relatedProfile: 'imp-mu-pass-overflow-quantification.js',

  summary:
    'Tabulates the raw degree-0 deficit mass D_raw(a, U) and the cosh-over-minimal ' +
    'excess mass E(a, U) across an a-grid x U-range, and reports the excess fraction ' +
    'phi = E/D_raw -- the relative price, in the degree-0 (scale-invariant, ' +
    'RH-equivalent) measure, of the forced even cosh-completion over the minimal ' +
    'kinked cover max(1, sinh). Both masses factor as 1/a times a function of the ' +
    'single product s = a*U (a*D_raw = F(s) = cosh(s) - sqrt(2) - s + arcsinh(1), ' +
    'a*E = G(s) = sqrt(2) - arcsinh(1) - e^{-s}), so the fraction phi = G(s)/F(s) ' +
    'depends on s = a*U alone: equal-product cells coincide, and phi -> 0 as the lag ' +
    'window lengthens (F blows up, G saturates) -- the no-ghost surplus is small ' +
    'precisely where the overflow it covers is large. At the imp-3007 headline ' +
    '(a = 0.5, U = 6) phi ~ 0.0739. RH-EQUIVALENT; STRUCTURAL/DIAGNOSTIC; NOT a reduction.',

  weights: Object.freeze({
    shear: 'nu(tau) = sinh(a*tau)',
    enrichedPassive: 'w^pass(tau) = cosh(a*tau)  (endpoint-bridge cosh-completion, imp-2686)',
    minimalCover: 'w^min(tau) = max(1, sinh(a*tau))  (supplies only the overflow; kinked at tau_star)',
  }),

  method: Object.freeze({
    measure: 'degree-0 (Lebesgue on lag tau over [0, U]), the RH-equivalent scale class',
    rawDeficitFunctional: 'D_raw(a,U) = int_{tau_star}^{U} [sinh(a*tau) - 1] d(tau) = [cosh(a*tau)/a - tau]_{tau_star}^{U}',
    excessMassFunctional: 'E(a,U) = int_0^U [cosh(a*tau) - max(1, sinh(a*tau))] d(tau)',
    excessFraction: 'phi(a,U) = E(a,U) / D_raw(a,U)  (the deliverable: relative price of the even cosh weight)',
    crossoverTauStar: 'tau_star = arcsinh(1)/a  (sinh(a*tau_star) = 1); overflow exists iff tau_star < U',
    scaleInvariant: 'a*D_raw = F(s), a*E = G(s) with s = a*U; phi = G(s)/F(s) depends on a*U alone',
    aGrid: A_GRID,
    uGrid: U_GRID,
    N,
    discretizationRule: 'midpoint (numeric cross-check only; headline numbers are closed form)',
    selfComputing: true,
  }),

  /* the headline cell at a = 0.5, U = 6 (the imp-3007 anchor) */
  headline: Object.freeze({
    a: HEADLINE.a,
    U: HEADLINE.U,
    rawDeficitMass: HEADLINE.rawDeficit,        // ~13.07
    excessMass: HEADLINE.excessMass,            // ~0.966
    excessFraction: HEADLINE.excessFraction,    // ~0.0739
    statement:
      'At the imp-3007 anchor the forced even cosh-completion over-supplies the ' +
      'minimal kinked cover by ~7.39% of the raw degree-0 overflow it must dominate.',
  }),

  rows: ROWS,

  /* the diagnostic finding: the excess fraction is a function of a*U alone */
  scaleInvariantFinding: Object.freeze({
    invariant: 's = a*U',
    aTimesRawDeficit: 'F(s) = cosh(s) - sqrt(2) - s + arcsinh(1)',
    aTimesExcessMass: 'G(s) = sqrt(2) - arcsinh(1) - e^{-s}',
    fraction: 'phi = G(s)/F(s)',
    saturationCeiling: SQRT2 - ASINH1,          // lim_{s->inf} a*E
    behaviour:
      'phi decreases monotonically in s = a*U: F(s) ~ e^s/2 diverges while G(s) ' +
      'saturates at sqrt(2) - arcsinh(1) ~ 0.533, so the relative price of the ' +
      'no-ghost even weight vanishes as the lag window lengthens.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'This measures the imp-3007 scalar cover; the off-diagonal endpoint-Hankel ' +
      'operator positivity (R = Gpass^{-1/2} Gshear Gpass^{-1/2} a contraction) ' +
      'remains the lone obstruction and is NOT addressed here.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3064_DEFICIT_EXCESS_FRACTION_GRID_ASSERTIONS = [
  {
    id: 'imp3064-grid-cell-count',
    why: 'One row per (a, U) cell of the full Cartesian product A_GRID x U_GRID ' +
         '(5 x 4 = 20); a mis-count means the self-computing grid dropped or duplicated a cell.',
    holds: () => ROWS.length === A_GRID.length * U_GRID.length && ROWS.length === 20,
  },
  {
    id: 'imp3064-headline-matches-imp3007',
    why: 'The (a = 0.5, U = 6) cell must reproduce the imp-3007 anchor: raw deficit ~13.07 ' +
         'and excess ~0.966, with excess fraction ~0.0739. A drift means the shear weight or ' +
         'the cosh-completion drifted from the established cover.',
    holds: () => HEADLINE !== undefined &&
      Math.abs(HEADLINE.rawDeficit - 13.06964) < 1e-3 &&
      Math.abs(HEADLINE.excessMass - 0.96611) < 1e-3 &&
      Math.abs(HEADLINE.excessFraction - 0.07392) < 1e-4,
  },
  {
    id: 'imp3064-closed-form-matches-numeric',
    why: 'Both closed-form masses must match the midpoint numeric cross-check on every cell; ' +
         'a divergence means a closed form was mis-derived.',
    holds: () => ROWS.every((r) =>
      Math.abs(r.rawDeficit - r.rawDeficitNumeric) < 1e-3 * (1 + r.rawDeficit) &&
      Math.abs(r.excessMass - r.excessMassNumeric) < 1e-3 * (1 + r.excessMass)),
  },
  {
    id: 'imp3064-excess-fraction-positive-where-overflow',
    why: 'Where an overflow exists the cosh strictly over-supplies the minimal cover and the ' +
         'raw deficit is positive, so the excess fraction E/D_raw must be finite and positive; ' +
         'where none exists it is reported as null.',
    holds: () => ROWS.every((r) => r.hasOverflow
      ? (r.rawDeficit > 0 && r.excessMass > 0 && r.excessFraction > 0 && Number.isFinite(r.excessFraction))
      : (r.rawDeficit === 0 && r.excessFraction === null)),
  },
  {
    id: 'imp3064-fraction-depends-on-aU-only',
    why: 'The diagnostic finding: the excess fraction depends on s = a*U alone, so the per-cell ' +
         'closed-form fraction must equal the reduced G(s)/F(s), and two cells with equal a*U ' +
         '(here (0.5, 6) and (0.3, 10), both s = 3) must coincide.',
    holds: () => {
      const matchesReduced = ROWS.every((r) => !r.hasOverflow ||
        Math.abs(r.excessFraction - r.reducedFraction) < 1e-12);
      const c1 = ROWS.find((r) => r.a === 0.5 && r.U === 6);
      const c2 = ROWS.find((r) => r.a === 0.3 && r.U === 10);
      const equalProductCoincide = Math.abs(c1.excessFraction - c2.excessFraction) < 1e-12;
      return matchesReduced && equalProductCoincide;
    },
  },
  {
    id: 'imp3064-fraction-monotone-decreasing-in-U',
    why: 'For fixed a the excess fraction must strictly decrease as the lag window U grows ' +
         '(F blows up, G saturates), confirming the no-ghost price is diluted by the growing ' +
         'overflow. Checked on a = 0.5, which has an overflow on every U in the grid.',
    holds: () => {
      const fixedA = ROWS.filter((r) => r.a === 0.5).sort((x, y) => x.U - y.U);
      for (let i = 1; i < fixedA.length; i++) {
        if (!(fixedA[i].excessFraction < fixedA[i - 1].excessFraction)) return false;
      }
      return fixedA.length === U_GRID.length;
    },
  },
  {
    id: 'imp3064-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: the grid is RH-EQUIVALENT, structural/diagnostic, leaves the ' +
         'operator step untouched, is not a proof, not a reduction below RH, and no refereed bound is changed' +
         '. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3064_DEFICIT_EXCESS_FRACTION_GRID.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3064_DEFICIT_EXCESS_FRACTION_GRID_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3064-deficit-excess-fraction-grid assertion failed: ${a.id}`);
}

export default IMP3064_DEFICIT_EXCESS_FRACTION_GRID;
