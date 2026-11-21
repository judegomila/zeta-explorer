/**
 * @module imp-3148-forced-excess-mass-sweep
 * @fileoverview imp-3148 -- Sweep the imp-3007 forced-excess passive mass
 *   E(a, U) = int_0^U [cosh(a*tau) - max(1, sinh(a*tau))] d(tau) across a grid of
 *   the shear weight a AND the lag cutoff U, to measure how far the FORCED smooth
 *   even cosh-completion sits above the MINIMAL kinked patch max(1, sinh) as a
 *   function of the cell -- and to settle whether that excess stays BOUNDED or
 *   DIVERGES as the cell stretches.
 *
 *   WHAT imp-3007 LEFT OPEN
 *   -----------------------
 *   imp-3007 (imp-3007-mupass-overflow-cover.js) item (2) gives the forced-excess
 *   mass E(a) in closed form but EVALUATES it at the single headline cell
 *   a = 0.5, U = 6 (E ~ 0.9661). It never tabulates E across the cell, so the
 *   growth law -- and whether the "price of the smooth even no-ghost weight" stays
 *   finite as the cell stretches -- was left unmeasured. This module fills exactly
 *   that gap. Diagnostic only: the scalar cover residual stays 0 (imp-3007), no
 *   operator step is attempted, no RH verdict is implied.
 *
 *   THE CLOSED FORM (re-derived, with the e^{-arcsinh(1)} = sqrt2 - 1 identity)
 *   --------------------------------------------------------------------------
 *   With crossover tau_star = arcsinh(1)/a (where sinh(a*tau_star) = 1) the two
 *   regimes are:
 *
 *     OVERFLOW (tau_star < U, i.e. a*U > arcsinh(1)):
 *       head = int_0^{tau_star} (cosh(a*tau) - 1) d(tau) = 1/a - tau_star
 *       tail = int_{tau_star}^U (cosh - sinh) d(tau) = (e^{-a*tau_star} - e^{-a*U})/a
 *            = (sqrt2 - 1 - e^{-a*U})/a            [since e^{-arcsinh(1)} = sqrt2 - 1]
 *       E(a, U) = head + tail = (sqrt2 - arcsinh(1) - e^{-a*U}) / a.
 *
 *     NO OVERFLOW (tau_star >= U, i.e. a*U <= arcsinh(1)):
 *       E(a, U) = int_0^U (cosh(a*tau) - 1) d(tau) = sinh(a*U)/a - U.
 *
 *   THE FINDING -- A SIMILARITY COLLAPSE IN THE SINGLE VARIABLE a*U
 *   --------------------------------------------------------------
 *   Multiplying through by a, BOTH regimes depend ONLY on the product x = a*U (the
 *   cell area in shear units):
 *
 *       a * E(a, U) = f(x),   x = a*U,
 *       f(x) = sinh(x) - x                      for x <= arcsinh(1),
 *       f(x) = sqrt2 - arcsinh(1) - e^{-x}      for x >  arcsinh(1),
 *
 *   continuous at the crossover x = arcsinh(1) (both branches give 1 - arcsinh(1)
 *   ~ 0.11863). So the forced excess is a UNIVERSAL PROFILE: E(a, U) = f(a*U)/a.
 *   f is monotone increasing and SATURATES, f(x) -> C := sqrt2 - arcsinh(1)
 *   ~ 0.53283998 as x -> infinity, at exponential rate (C - f(x) = e^{-x} in the
 *   overflow regime). Hence, for every fixed a,
 *
 *       E(a, U) < C / a    UNIFORMLY in U,   and   E(a, U) -> C/a  as U -> infinity.
 *
 *   VERDICT: BOUNDED, NOT DIVERGENT.
 *   -------------------------------
 *   - Stretching the cell in U at fixed a does NOT make the excess diverge: it
 *     saturates to the finite ceiling E_inf(a) = C/a (~1.0657 at a = 0.5), approached
 *     at rate e^{-a*U}/a.
 *   - Stretching the cell by shrinking a at FIXED U makes the excess VANISH:
 *     once a*U < arcsinh(1) the no-overflow branch gives E ~ a^2 U^3 / 6 -> 0.
 *   - The ONLY way the excess grows without bound is the JOINT limit a -> 0 with
 *     a*U -> infinity, and even there the growth is purely the 1/a saturation
 *     prefactor C/a, NOT a U-divergence at fixed a.
 *   So the "price of the smooth even no-ghost weight" is uniformly controlled by
 *   C/a on any fixed-a cell; it never runs away with the lag cutoff.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   STRUCTURAL / DIAGNOSTIC. This measures the forced-excess mass only; it does
 *   NOT touch the operator step. The imp-3007 scalar cover residual stays EXACTLY
 *   0 and is necessary-but-NOT-sufficient for K_a >= 0; the off-diagonal
 *   endpoint-Hankel contraction remains the lone open obstruction. No reduction,
 *   no RH verdict. No refereed bound is changed.
 *
 *   @see imp-3007-mupass-overflow-cover.js (imp-3007: E(a) at the single cell a=0.5,U=6)
 *   @see imp-2686-mupass-construction.js (the cosh-completion + pointwise margin)
 *
 *   Ticket: imp-3148 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);          // arcsinh(1) = ln(1+sqrt2) ~ 0.88137359
const SQRT2 = Math.SQRT2;              // ~ 1.41421356
const C_SAT = SQRT2 - ASINH1;          // saturation constant of f ~ 0.53283998

const A_GRID = Object.freeze([1.0, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01]);
const U_GRID = Object.freeze([3, 6, 12, 24, 48]);
const N = 20000;                       // midpoint nodes for the numeric cross-check (tight at the kink)

/** Closed-form forced-excess mass E(a, U) (both regimes), see header. */
function excessMassClosed(a, U) {
  const tauStar = ASINH1 / a;
  return tauStar < U
    ? (SQRT2 - ASINH1 - Math.exp(-a * U)) / a          // overflow
    : Math.sinh(a * U) / a - U;                          // no overflow
}

/** The universal similarity profile f(x), x = a*U; satisfies a*E(a,U) = f(x). */
function profile(x) {
  return x <= ASINH1 ? Math.sinh(x) - x : C_SAT - Math.exp(-x);
}

/** Numeric midpoint cross-check of E(a, U) on [0, U] (tripwire, not headline). */
function excessMassNumeric(a, U) {
  const h = U / N;
  let s = 0;
  for (let k = 0; k < N; k++) {
    const tau = (k + 0.5) * h;
    s += (Math.cosh(a * tau) - Math.max(1, Math.sinh(a * tau))) * h;
  }
  return s;
}

function row(a, U) {
  const E = excessMassClosed(a, U);
  const x = a * U;                       // cell area in shear units
  const Einf = C_SAT / a;                // U -> infinity saturation ceiling
  return Object.freeze({
    a,
    U,
    cellArea: x,                         // = a*U, the single similarity variable
    hasOverflow: ASINH1 / a < U,
    excessMass: E,                       // E(a, U)
    excessMassNumeric: excessMassNumeric(a, U),
    saturationCeiling: Einf,             // E_inf(a) = (sqrt2 - arcsinh1)/a
    fractionOfCeiling: E / Einf,         // = f(a*U)/C, a function of a*U alone
    aTimesE: a * E,                      // = f(a*U); collapses the grid to one curve
  });
}

const ROWS = Object.freeze(A_GRID.flatMap((a) => U_GRID.map((U) => row(a, U))));
const HEADLINE = ROWS.find((r) => r.a === 0.5 && r.U === 6); // ties back to imp-3007

export const IMP3148_FORCED_EXCESS_MASS_SWEEP = Object.freeze({
  id: 'imp-3148-forced-excess-mass-sweep',
  ticket: 'imp-3148',
  paperSourcePath: PAPER_REF,
  paperSections: ['25', '26', '27'],
  relatedCover: 'imp-3007-mupass-overflow-cover.js',

  summary:
    'Sweeps the imp-3007 forced-excess passive mass E(a, U) = int_0^U ' +
    '[cosh(a*tau) - max(1, sinh(a*tau))] d(tau) -- the price of the smooth even ' +
    'cosh-completion over the minimal kinked patch -- across a grid of the shear ' +
    'weight a and the lag cutoff U. Closed form: E(a, U) = ' +
    '(sqrt2 - arcsinh(1) - e^{-a*U})/a where a*U > arcsinh(1), else sinh(a*U)/a - U. ' +
    'The excess COLLAPSES to a universal similarity profile a*E(a, U) = f(a*U) ' +
    'depending only on the cell area a*U, monotone and SATURATING to ' +
    'C = sqrt2 - arcsinh(1) ~ 0.53284. Hence E(a, U) < C/a uniformly in U: the ' +
    'forced excess stays BOUNDED -- it saturates as U stretches (never diverges), ' +
    'vanishes as a -> 0 at fixed U, and grows only via the 1/a ceiling C/a in the ' +
    'joint a->0, a*U->infinity limit. Diagnostic only; the imp-3007 scalar cover ' +
    'residual stays 0; no operator step, no RH verdict.',

  constants: Object.freeze({
    arcsinh1: ASINH1,
    sqrt2: SQRT2,
    saturationConstantC: C_SAT,                 // = sqrt2 - arcsinh1, the sup of f
    crossoverCellArea: ASINH1,                  // a*U = arcsinh1 separates the two regimes
    profileAtCrossover: 1 - ASINH1,             // f(arcsinh1) = 1 - arcsinh1 ~ 0.11863
  }),

  closedForm: Object.freeze({
    overflow: 'E(a, U) = (sqrt2 - arcsinh(1) - e^{-a*U}) / a   when a*U > arcsinh(1)',
    noOverflow: 'E(a, U) = sinh(a*U)/a - U   when a*U <= arcsinh(1)',
    similarityCollapse: 'a*E(a, U) = f(a*U), f(x) = sinh(x)-x for x<=arcsinh1, else sqrt2-arcsinh1-e^{-x}',
    saturationCeiling: 'E_inf(a) = (sqrt2 - arcsinh(1))/a, approached at rate e^{-a*U}/a',
  }),

  verdict: Object.freeze({
    boundedInU: true,
    divergesInU: false,
    vanishesAsAtoZeroFixedU: true,
    onlyGrowthIsCeilingPrefactor: '1/a (the C/a saturation ceiling), only in the joint a->0, a*U->inf limit',
    statement:
      'The forced excess is BOUNDED, not divergent: for every fixed a it is capped ' +
      'uniformly in U by E_inf(a) = (sqrt2 - arcsinh1)/a and saturates to it as the ' +
      'cell stretches in U. Shrinking a at fixed U sends E -> 0. The excess never ' +
      'runs away with the lag cutoff; its only unbounded growth is the 1/a ' +
      'saturation prefactor along the joint small-a, large-area limit.',
  }),

  headlineCell: Object.freeze({
    a: HEADLINE.a,
    U: HEADLINE.U,
    excessMass: HEADLINE.excessMass,            // ~0.96611, matches imp-3007
    saturationCeiling: HEADLINE.saturationCeiling,
    fractionOfCeiling: HEADLINE.fractionOfCeiling,
  }),

  method: Object.freeze({
    measure: 'degree-0 (Lebesgue on lag tau over [0, U]), the RH-equivalent scale class',
    aGrid: A_GRID,
    uGrid: U_GRID,
    N,
    discretizationRule: 'midpoint (numeric cross-check only; headline numbers are closed form)',
    selfComputing: true,
  }),

  rows: ROWS,

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    scalarCoverResidualStaysZero: true,
    operatorStepNotAttempted: true,
    necessaryNotSufficient:
      'measures only the forced-excess MASS; the imp-3007 scalar cover residual ' +
      'stays exactly 0 and is necessary-but-NOT-sufficient for K_a >= 0; the ' +
      'off-diagonal endpoint-Hankel contraction remains the lone open obstruction',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3148_FORCED_EXCESS_MASS_SWEEP_ASSERTIONS = [
  {
    id: 'imp3148-row-count',
    why: 'One row per (a, U) cell in the 7x5 grid; a mis-count means the self-computing ' +
         'sweep dropped or duplicated a cell.',
    holds: () => ROWS.length === A_GRID.length * U_GRID.length && ROWS.length === 35,
  },
  {
    id: 'imp3148-closed-form-matches-numeric',
    why: 'The closed-form E(a, U) must match the midpoint numeric integral on every cell ' +
         '(both regimes), confirming the (sqrt2 - arcsinh1 - e^{-a*U})/a derivation and its ' +
         'no-overflow companion. A mismatch means the closed form is wrong.',
    holds: () => ROWS.every((r) => Math.abs(r.excessMass - r.excessMassNumeric) < 5e-6),
  },
  {
    id: 'imp3148-headline-matches-imp3007',
    why: 'The a=0.5, U=6 cell must reproduce the imp-3007 headline excess ~0.96611, anchoring ' +
         'this sweep to the single-cell value it generalizes.',
    holds: () => Math.abs(HEADLINE.excessMass - 0.9661058) < 1e-6,
  },
  {
    id: 'imp3148-similarity-collapse-in-aU',
    why: 'The core finding: a*E(a, U) depends ONLY on the cell area a*U, equalling the universal ' +
         'profile f(a*U). Two cells with equal a*U must give equal a*E. If they diverge the ' +
         'similarity collapse is broken.',
    holds: () => ROWS.every((r) => Math.abs(r.aTimesE - profile(r.cellArea)) < 1e-12),
  },
  {
    id: 'imp3148-bounded-below-ceiling',
    why: 'Boundedness verdict: on every cell the excess stays at or below the saturation ceiling ' +
         'E_inf(a) = (sqrt2 - arcsinh1)/a (fraction <= 1; the bound is strict mathematically but ' +
         'e^{-a*U} drops below the ULP of C and rounds the fraction to exactly 1 at large a*U). A ' +
         'fraction exceeding 1 would contradict the uniform-in-U bound.',
    holds: () => ROWS.every((r) => r.fractionOfCeiling <= 1 && r.fractionOfCeiling > 0),
  },
  {
    id: 'imp3148-saturates-monotonically-in-U',
    why: 'At fixed a the excess increases with U and approaches the ceiling: the largest-U cell ' +
         'per a must have the largest fraction-of-ceiling. Non-monotonicity would mean E does ' +
         'not saturate.',
    holds: () => A_GRID.every((a) => {
      const byA = ROWS.filter((r) => r.a === a).sort((p, q) => p.U - q.U);
      for (let i = 1; i < byA.length; i++) {
        if (!(byA[i].fractionOfCeiling > byA[i - 1].fractionOfCeiling)) return false;
      }
      return true;
    }),
  },
  {
    id: 'imp3148-profile-continuous-at-crossover',
    why: 'The two branches of f must agree at the crossover x = arcsinh(1) (both give 1 - arcsinh1), ' +
         'so E(a, U) is continuous across the overflow/no-overflow boundary.',
    holds: () => Math.abs((Math.sinh(ASINH1) - ASINH1) - (C_SAT - Math.exp(-ASINH1))) < 1e-12,
  },
  {
    id: 'imp3148-honest-diagnostic-only',
    why: 'Mandatory honesty: this is a structural/diagnostic mass sweep, not a proof or reduction; ' +
         'the imp-3007 scalar cover residual stays 0, the operator step is untouched, and no refereed bound is changed' +
         '. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3148_FORCED_EXCESS_MASS_SWEEP.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.scalarCoverResidualStaysZero === true &&
        c.operatorStepNotAttempted === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3148_FORCED_EXCESS_MASS_SWEEP_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3148-forced-excess-mass-sweep assertion failed: ${a.id}`);
}

export default IMP3148_FORCED_EXCESS_MASS_SWEEP;
