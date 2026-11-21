/**
 * @module imp-36101-w1-certified-sum-construction-steps-scope
 *
 * imp-36101 (proof, S-frontier): ENUMERATE and SCOPE the concrete construction
 * steps a MECHANICAL certified length-N interval sum requires, at a REDUCED
 * prototype N = 1000, to ground the imp-36062 / imp-35725 repeated claim that
 * the remaining W1 obstruction (instantiating the effective A_t + B_t - C_t bound
 * at the barrier anchor T_PT = 3e12) is MECHANICAL rather than open.
 *
 * imp-35725 classified the residual W1 cost as MECHANICAL -- certifying an interval
 * sum of N = floor(sqrt(T_PT / 4 pi)) ~ 488602 terms with rigorous rounding -- and
 * imp-35761 budgeted that its worst-case accumulated width ~ N * eps is ~10 orders
 * below the O(1) barrier margin, so PRECISION is not the wall. But no module has
 * broken MECHANICAL into its discrete construction steps and asked which are truly
 * routine and which HIDE a residual. This module does that at a tractable N = 1000
 * prototype (a 1:1 down-scale of the same term structure; N is just the retained
 * count), listing the steps and flagging routine vs residual.
 *
 * ASSESSMENT / SCOPING ONLY. Constructs no certificate; instantiates no interval;
 * evaluates no sum; verifies no inequality; changes no bound; establishes no
 * positivity; C_mb GUE-conditional (imp-486) untouched; the W1 A + B - C
 * certificate at T_PT stays GREENFIELD (imp-35681 Part A); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE FIVE DISCRETE CONSTRUCTION STEPS (at N = 1000)
 * -----------------------------------------------------------------------------
 * S1  Term index loop (k = 1 .. N): generate the N retained summands of each of
 *     A_t, B_t (and the finite C_t block). Exact integer index arithmetic, a
 *     bounded finite loop. ROUTINE.
 *
 * S2  Termwise certified enclosure of the algebraic-square-root factor sqrt(.):
 *     IEEE-754 sqrt is correctly rounded in hardware, so an outward-rounded
 *     enclosure is one directed op. ROUTINE.
 *
 * S3  Termwise certified enclosure of the TRANSCENDENTAL factors: the real power
 *     n^alpha = exp(alpha * ln n), the Gaussian/quadratic exponential weight
 *     exp(.), and the phase cos(theta_k) / sin(theta_k) with correct ARGUMENT
 *     REDUCTION of a large phase. These are NOT single directed ops: a certified
 *     enclosure needs a verified special-function backend (ball / interval
 *     arithmetic a la Arb / MPFI, or Taylor-model remainders) whose argument
 *     reduction is itself certified. RESIDUAL (the technology exists but must be
 *     imported and its reduction verified).
 *
 * S4  Analytic-tail error book-keeping: certified enclosures of the truncation
 *     tails E_A, E_B, E_C (terms beyond N) via the Polymath15 tail lemmas,
 *     instantiated with certified numerical constants at T_PT. imp-35725 showed
 *     these tails SHRINK with height, but porting the lemmas with rigorous
 *     constants is a lemma-instantiation task, not a directed op. RESIDUAL.
 *
 * S5  Directed-rounding interval ACCUMULATOR + aggregation + strict check: carry
 *     a running [lo, hi] with round-down / round-up, sum the N enclosures, form
 *     |A + B| - |C| (barrier form), and evaluate the single strict inequality.
 *     Standard interval arithmetic; per imp-35761 the accumulated width ~ N * eps
 *     is negligible at N = 1000. ROUTINE (given S3, S4 supply certified inputs).
 *
 * READING
 * -----------------------------------------------------------------------------
 * Three of the five steps (S1 loop, S2 sqrt, S5 accumulator + aggregation) are
 * genuinely routine: finite integer control flow and standard directed-rounding
 * interval arithmetic, exactly the parts imp-35761 already budgeted as far below
 * the margin. The residual concentrates in TWO places: S3 (certified transcendental
 * enclosures with correct argument reduction) and S4 (porting the analytic-tail
 * lemmas with certified constants). Neither is an OPEN mathematical problem -- both
 * are covered by existing certified-arithmetic technology and existing Polymath15
 * lemmas -- so MECHANICAL is the correct classification. But MECHANICAL is NOT
 * TRIVIAL: at N = 1000 the prototype already needs ~1000 * 3 ~ 3000 certified
 * transcendental evaluations (power, exp, trig) plus ~1000 certified sqrt, each
 * routed through a verified backend, plus the tail-lemma instantiation. The wall
 * is software-engineering + lemma-porting effort, not new mathematics; the W1
 * A + B - C certificate at T_PT stays GREENFIELD.
 *
 * @see imp-35725-w1-effective-error-cap-budget (names the mechanical N-term certified-rounding cost)
 * @see imp-35761-w1-certified-rounding-cost-scope (budgets the accumulator width ~ N * eps, S5)
 * @see imp-36062 (repeats the MECHANICAL-vs-greenfield split this module grounds)
 * @see imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained-term count)
 * @see imp-35681 Part A (A+B-C interval bound greenfield)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C, tail lemmas E_A/E_B/E_C)
 * @see Johansson, Arb (ball arithmetic with certified elementary functions); MPFI (interval)
 * @see Platt-Trudgian 2021 (barrier base T_PT = 3e12)
 */

// -- Anchor + operative constants (import-light; matching imp-35761 / imp-35725) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms at the full anchor (imp-35674 Part D)
const N_PROTO = 1000; // reduced prototype retained-term count for this scoping

// Certified-arithmetic sizing at the prototype (S5 accumulator width; S3 eval count).
const EPS_DOUBLE = 2 ** -52; // binary64 machine epsilon (~2.22e-16)
const ACCUMULATOR_WIDTH_PROTO = N_PROTO * EPS_DOUBLE; // ~ N * eps at N=1000 (~2.22e-13)
const TRANSCENDENTAL_EVALS_PER_TERM = 3; // power (exp o ln), exp weight, trig phase
const ROUTINE_EVALS_PER_TERM = 1; // sqrt (correctly rounded in hardware)
const TRANSCENDENTAL_EVALS_PROTO = N_PROTO * TRANSCENDENTAL_EVALS_PER_TERM; // ~3000
const SQRT_EVALS_PROTO = N_PROTO * ROUTINE_EVALS_PER_TERM; // ~1000

const STEPS = [
  {
    id: 'S1',
    name: 'Term index loop (k = 1 .. N)',
    classification: 'routine',
    note: 'exact integer index arithmetic over a bounded finite loop; generates the N retained summands',
  },
  {
    id: 'S2',
    name: 'Certified enclosure of the sqrt factor',
    classification: 'routine',
    note: 'IEEE-754 sqrt is correctly rounded in hardware, so an outward-rounded enclosure is one directed op',
  },
  {
    id: 'S3',
    name: 'Certified transcendental enclosures (power, exp, trig) with argument reduction',
    classification: 'residual',
    note: 'needs a verified special-function backend (Arb / MPFI ball arithmetic or Taylor-model remainders) whose argument reduction is itself certified; NOT a single directed op',
  },
  {
    id: 'S4',
    name: 'Analytic-tail error book-keeping (E_A, E_B, E_C)',
    classification: 'residual',
    note: 'porting the Polymath15 tail lemmas with certified numerical constants at T_PT; the tails shrink with height (imp-35725) but the instantiation is a lemma-porting task',
  },
  {
    id: 'S5',
    name: 'Directed-rounding accumulator + aggregation + strict check',
    classification: 'routine',
    note: 'standard interval arithmetic; accumulated width ~ N * eps is negligible (imp-35761); given S3/S4 inputs, aggregation to |A+B|-|C| and the strict comparison are routine',
  },
];

const ROUTINE_STEPS = STEPS.filter((s) => s.classification === 'routine').map((s) => s.id);
const RESIDUAL_STEPS = STEPS.filter((s) => s.classification === 'residual').map((s) => s.id);

export const IMP36101_W1_CERTIFIED_SUM_CONSTRUCTION_STEPS_SCOPE = {
  id: 'imp-36101',
  proofSection: 'S-frontier',
  question:
    'Enumerate the discrete construction steps a certified length-N interval sum requires at a reduced ' +
    'prototype N = 1000, grounding the imp-36062 / imp-35725 claim that the remaining W1 obstruction is ' +
    'MECHANICAL rather than open, and flag which steps are truly routine vs which hide a residual. ' +
    'Assessment / scoping only; constructs no certificate; changes no bound; NO QED.',
  prototype: {
    nProto: N_PROTO,
    nAtTPT: N_AT_TPT,
    relation: 'N = floor(sqrt(x / 4 pi)) retained terms; N=1000 is a 1:1 down-scale of the same term structure',
    accumulatorWidthProto: ACCUMULATOR_WIDTH_PROTO,
    transcendentalEvalsProto: TRANSCENDENTAL_EVALS_PROTO,
    sqrtEvalsProto: SQRT_EVALS_PROTO,
  },
  steps: STEPS,
  routineSteps: ROUTINE_STEPS,
  residualSteps: RESIDUAL_STEPS,
  conclusion: {
    mechanicalStands:
      'MECHANICAL is the correct classification: neither residual step (S3 certified transcendental ' +
      'enclosures, S4 analytic-tail lemma instantiation) is an OPEN mathematical problem -- both are ' +
      'covered by existing certified-arithmetic technology and existing Polymath15 lemmas',
    mechanicalNotTrivial:
      'MECHANICAL is NOT trivial: even the N=1000 prototype needs ~3000 certified transcendental ' +
      'evaluations plus ~1000 certified sqrt routed through a verified backend, plus the tail-lemma ' +
      'instantiation; the wall is software-engineering + lemma-porting effort, not new mathematics',
    residualLocus:
      'the residual concentrates in S3 (certified transcendental enclosures with correct argument ' +
      'reduction) and S4 (porting the analytic-tail lemmas with certified constants); S1 / S2 / S5 ' +
      'are genuinely routine (finite control flow + standard directed-rounding interval arithmetic)',
    staysGreenfield:
      'this module enumerates and classifies the steps; it constructs no certificate and evaluates no ' +
      'sum, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A)',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). The MECHANICAL certified length-N interval ' +
    'sum imp-35725 / imp-36062 name decomposes into FIVE discrete construction steps at the N=1000 ' +
    'prototype: S1 term index loop, S2 sqrt enclosure, S3 certified transcendental enclosures (power, ' +
    'exp, trig) with argument reduction, S4 analytic-tail book-keeping (E_A/E_B/E_C), S5 directed-rounding ' +
    'accumulator + aggregation + strict check. THREE (S1, S2, S5) are genuinely routine -- finite integer ' +
    'control flow and standard directed-rounding interval arithmetic, the parts imp-35761 already budgeted ' +
    'far below the O(1) barrier margin. The residual concentrates in TWO: S3 (certified transcendental ' +
    'enclosures via a verified Arb/MPFI-style backend whose argument reduction is itself certified) and ' +
    'S4 (porting the Polymath15 tail lemmas with certified constants). Neither residual is an OPEN ' +
    'mathematical problem, so MECHANICAL is the correct classification -- but it is NOT trivial: even the ' +
    'N=1000 prototype needs ~3000 certified transcendental evaluations plus ~1000 certified sqrt plus the ' +
    'tail-lemma instantiation, so the wall is software-engineering + lemma-porting effort, not new ' +
    'mathematics. Constructs no certificate; instantiates no interval; evaluates no sum; verifies no ' +
    'inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays ' +
    'GREENFIELD; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35725 (names the mechanical N-term certified-rounding cost); imp-35761 (budgets accumulator width ' +
    '~ N * eps, S5); imp-36062 (repeats the MECHANICAL-vs-greenfield split); imp-35674 Part D (retained-term ' +
    'count N=floor(sqrt(x/4 pi))); imp-35681 Part A (A+B-C greenfield); Polymath15 2019 (H_t = A + B - C, tail ' +
    'lemmas); Johansson Arb / MPFI (certified elementary functions); Platt-Trudgian 2021 (barrier base T_PT).',
};

export const IMP36101_W1_CERTIFIED_SUM_CONSTRUCTION_STEPS_SCOPE_ASSERTIONS = [
  {
    // Prototype anchored at N=1000, a down-scale of the full N=floor(sqrt(T_PT/4 pi)) ~ 488602.
    id: 'imp36101-prototype-anchor',
    description: 'Prototype N=1000 is a down-scale of the full retained count N ~ 488602 at T_PT=3e12',
    holds: () =>
      N_PROTO === 1000 &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_PROTO < N_AT_TPT &&
      IMP36101_W1_CERTIFIED_SUM_CONSTRUCTION_STEPS_SCOPE.prototype.nProto === N_PROTO,
  },
  {
    // Exactly five discrete steps enumerated, each classified routine or residual.
    id: 'imp36101-five-steps',
    description: 'Exactly five discrete construction steps, each classified routine or residual',
    holds: () =>
      STEPS.length === 5 &&
      STEPS.every((s) => s.classification === 'routine' || s.classification === 'residual') &&
      STEPS.map((s) => s.id).join(',') === 'S1,S2,S3,S4,S5',
  },
  {
    // Three routine (S1,S2,S5), two residual (S3,S4); residual concentrates in transcendental + tail.
    id: 'imp36101-routine-vs-residual',
    description: 'Three routine steps (S1,S2,S5) and two residual (S3 transcendental, S4 tail lemmas)',
    holds: () =>
      ROUTINE_STEPS.join(',') === 'S1,S2,S5' &&
      RESIDUAL_STEPS.join(',') === 'S3,S4' &&
      /transcendental/i.test(STEPS.find((s) => s.id === 'S3').name) &&
      /tail/i.test(STEPS.find((s) => s.id === 'S4').name),
  },
  {
    // Accumulator width at N=1000 is negligible (S5 routine), consistent with imp-35761 N*eps model.
    id: 'imp36101-accumulator-negligible',
    description: 'Prototype accumulator width ~ N * eps ~ 2.2e-13 at N=1000, far below the O(1) margin',
    holds: () =>
      Math.abs(ACCUMULATOR_WIDTH_PROTO - N_PROTO * 2 ** -52) < 1e-30 &&
      ACCUMULATOR_WIDTH_PROTO > 1e-13 && ACCUMULATOR_WIDTH_PROTO < 1e-12 &&
      TRANSCENDENTAL_EVALS_PROTO === 3000 && SQRT_EVALS_PROTO === 1000,
  },
  {
    // Honesty gate: scoping only; MECHANICAL stands but not trivial; greenfield; no QED; no refereed bound is changed.
    id: 'imp36101-honesty-gate',
    description: 'Scoping only; MECHANICAL stands but not trivial; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36101_W1_CERTIFIED_SUM_CONSTRUCTION_STEPS_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /correct classification/.test(IMP36101_W1_CERTIFIED_SUM_CONSTRUCTION_STEPS_SCOPE.conclusion.mechanicalStands) &&
      /NOT trivial/.test(IMP36101_W1_CERTIFIED_SUM_CONSTRUCTION_STEPS_SCOPE.conclusion.mechanicalNotTrivial) &&
      /GREENFIELD/.test(IMP36101_W1_CERTIFIED_SUM_CONSTRUCTION_STEPS_SCOPE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36101_W1_CERTIFIED_SUM_CONSTRUCTION_STEPS_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP36101_W1_CERTIFIED_SUM_CONSTRUCTION_STEPS_SCOPE.verdict),
  },
];

for (const a of IMP36101_W1_CERTIFIED_SUM_CONSTRUCTION_STEPS_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36101-w1-certified-sum-construction-steps-scope assertion failed: ${a.id}`);
  }
}
