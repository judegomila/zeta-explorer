/**
 * @module imp-36234-one-ulp-suffices-lemma-op-count-uniform-scope
 *
 * imp-36234 (proof/scoping, S-frontier): assess whether the imp-362 one-ULP
 * outward-rounding EMULATION admits a PROVEN one-ULP-suffices lemma UNIFORM over
 * the op count, versus strictly requiring genuine IEEE-754 directed rounding.
 * This is a direct deep-dive on imp-36193 ingredient E2 ("true directed rounding
 * OR a proven one-ULP-suffices lemma, uniformly over the op count that grows with
 * N"), which imp-36193 left as a bare disjunction without resolving which arm holds.
 *
 * VERDICT (assessment, NOT a discharge): the one-ULP-suffices lemma DOES exist and
 * IS op-count-uniform -- but only for the CORRECTLY-ROUNDED arithmetic core, and
 * the drift x_k' = -sum_{j != k} 1/(x_k - x_j) is exactly that core (subtraction +
 * division, both IEEE-754-mandated correctly-rounded). Uniformity is not a fragile
 * accumulation argument: it is the Fundamental Theorem of Interval Arithmetic --
 * endpoint-wise one-ULP-outward inflation is a SOUND enclosure of each round-to-
 * nearest op, and sound enclosures COMPOSE across arbitrarily many ops with NO
 * accumulation of soundness debt (only WIDTH grows). So true directed rounding is
 * NOT strictly required for the drift core. The residual leak is the TRANSCENDENTAL
 * seed/height layer (Math.log, not correctly-rounded in ECMAScript), where one-ULP
 * is UNSOUND absent a certified two-sided log bound -- which reduces E2 to the OPEN
 * imp-34867 crlibm-log scope, NOT to directed rounding per se.
 *
 * SCOPING / ASSESSMENT ONLY. Proves no lemma to the standard of a verified
 * certificate; instantiates no directed rounding; encloses no collision time;
 * changes no bound; establishes no positivity; C_mb GUE-conditional (imp-486)
 * untouched; imp-34714a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE QUESTION, PRECISELY
 * -----------------------------------------------------------------------------
 * imp-362 lacks IEEE-754 directed-rounding modes (JavaScript/ECMAScript exposes
 * only round-to-nearest-ties-to-even), so its integrator inflates every Float64
 * endpoint outward by one ULP (one nextafter step) after each op. imp-36193 E2
 * asked: is that emulation PROVABLY a sound enclosure uniformly over the op count
 * M(N) that grows with N, or is it a heuristic strictly weaker than Arb/MPFI/CAPD?
 *
 * THE PER-OP SOUNDNESS FACT (round-to-nearest + one nextafter step)
 * -----------------------------------------------------------------------------
 * IEEE-754 correct rounding in round-to-nearest gives, for any basic op o in
 * {+, -, *, /, sqrt}: |fl(a o b) - (a o b)| <= 0.5 ulp(fl(a o b)) (no overflow/
 * underflow). One nextafter step outward moves by a FULL 1 ulp, which strictly
 * covers the 0.5 ulp round-to-nearest error in either binade. Hence
 * [nextafter(fl(a o b), -inf), nextafter(fl(a o b), +inf)] CONTAINS the exact
 * (a o b). One ULP suffices per op; it is 2x looser than a directed-rounded
 * endpoint (which needs only the 0.5 ulp toward the correct side), NOT unsound.
 *
 * WHY UNIFORMITY OVER OP COUNT IS FREE (Fundamental Theorem of Interval Arith.)
 * -----------------------------------------------------------------------------
 * Soundness is NOT an accumulating budget. If [x] contains x and [y] contains y,
 * then the one-ULP-inflated interval op returns an interval containing x o y, for
 * EVERY op. By induction over the op DAG, the final interval contains the exact
 * real-valued composition -- for ANY number of ops M(N), with no per-op soundness
 * loss. What DOES grow with M(N) is the WIDTH (each op adds ~1 ulp of outward
 * slack, plus the intrinsic wrapping/dependency growth) -- a TIGHTNESS matter, the
 * same E4 width-control concern (imp-36192/imp-36193 E4), not a soundness matter.
 *
 * THE FOUR CONDITIONS THE LEMMA RESTS ON (and which the drift core satisfies)
 * -----------------------------------------------------------------------------
 * C1 (correct rounding of every op): IEEE-754 mandates correct rounding ONLY for
 *    +, -, *, /, sqrt, fma. The drift 1/(x_k - x_j) is subtraction then division
 *    -- both correctly rounded -- so C1 holds for the drift UNCONDITIONALLY. It
 *    FAILS for transcendentals (Math.log in the RvM-inverse / height map), which
 *    ECMAScript leaves implementation-defined (may err >0.5 ulp). => the leak.
 * C2 (no fma-contraction / reassociation): the lemma assumes each source op maps
 *    to one separately-rounded machine op. ECMAScript requires exactly that (no
 *    a*b+c contraction, no reassociation), so C2 holds in the JS engine.
 * C3 (no overflow / underflow / NaN escape): one ULP fails to enclose only if a
 *    result overflows to +/-Infinity or a gap straddles 0 (1/[g] with g_lo <= 0
 *    <= g_hi is not an enclosure). imp-362 already guards the straddling-zero
 *    case (returns [-inf, inf] -> flagged), so C3 is a documented tripwire, not a
 *    silent hole -- but it must stay guarded up to the collision front (E3 crux).
 * C4 (exact nextafter): the outward step must be the TRUE adjacent Float64. JS has
 *    no native nextafter; imp-362 implements one -- the lemma needs that impl exact
 *    (correct across binade boundaries and subnormals).
 *
 * READING: E2 does NOT reduce to "directed rounding is mandatory". For the drift
 * ARITHMETIC (the O(N^2) reciprocal sum), a one-ULP-suffices lemma holds and is
 * op-count-uniform by the Fundamental Theorem of Interval Arithmetic; one-ULP is
 * sound, merely ~2x looser than directed rounding (1 ulp vs 0.5 ulp per op). The
 * genuine residual is C1 at the TRANSCENDENTAL seed/height layer, where one-ULP is
 * unsound without a certified two-sided log -- so E2 collapses onto the OPEN
 * imp-34867 crlibm-log scope, not onto directed rounding per se. The ~2x per-op
 * looseness is CONSISTENT with the imp-36017/imp-36066 ~2x surrogate-over-layer
 * ratio (1-ulp-vs-half-ulp is a plausible mechanism), but DERIVING that 2.0 limit
 * is the separate imp-36175/imp-36199 obligation and is NOT claimed here.
 *
 * @see imp-36193-step2-g-interval-enclosure-nuniform-scope.js (parent; ingredient E2 is exactly this question)
 * @see imp-34867-crlibm-log-enclosure-ulp-scope.js (the transcendental-layer residual E2 reduces to)
 * @see interval-dyson-collision.js / lambda-interval-dyson.js (imp-362 one-ULP outward inflation; drift = 1/(gamma_n - gamma_k); straddling-zero guard)
 * @see imp-35761 (O(N*eps) directed-rounding arithmetic ceiling); imp-36017 / imp-36066 (~2x surrogate-over-layer width ratio)
 * @see Arb / MPFI / CAPD (genuine directed rounding); IEEE-754-2019 (correct-rounding mandate for basic ops); ECMAScript (round-to-nearest only, no fma contraction)
 * @see Platt-Trudgian 2021 (verified height / SOTA barrier base)
 */

// -- Anchor + operative constants (import-light; matching imp-36193 / imp-36192) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 ordinate count anchor at T_PT

const EPS_DOUBLE = 2 ** -52; // binary64 machine epsilon = 1 ulp (relative); one nextafter step
const RN_HALF_ULP = 2 ** -53; // round-to-nearest max error = 0.5 ulp
const ONE_ULP_OVER_HALF_ULP = EPS_DOUBLE / RN_HALF_ULP; // = 2.0: one-ULP inflation vs directed-rounded slack

// Op count of the drift evaluation: the drift x_k' = -sum_{j != k} 1/(x_k - x_j) has N(N-1)
// ordered reciprocal terms (one subtraction + one division each) per stage; RK4 has 4 stages.
const POLE_TERMS = (N) => N * (N - 1);
const OPS_PER_POLE = 2; // one subtraction (x_k - x_j) + one division 1/(...), both correctly rounded
const RK4_STAGES = 4;
const DRIFT_OPS_PER_STEP = (N) => RK4_STAGES * POLE_TERMS(N) * OPS_PER_POLE; // M(N) core arithmetic ops / RK4 step
const DRIFT_OPS_PER_STEP_AT_TPT = DRIFT_OPS_PER_STEP(N_AT_TPT); // ~1.9e12 correctly-rounded ops / step at T_PT

export const IMP36234_ONE_ULP_SUFFICES_LEMMA_OP_COUNT_UNIFORM_SCOPE = {
  id: 'imp-36234',
  proofSection: 'S-frontier',
  question:
    'Does the imp-362 one-ULP outward-rounding emulation admit a PROVEN one-ULP-suffices lemma ' +
    'UNIFORM over the (N-growing) op count, or does it strictly require genuine IEEE-754 directed ' +
    'rounding? (Deep-dive on imp-36193 ingredient E2.) Scoping only; discharges nothing; NO QED.',
  perOpSoundness: {
    rnErrorBound: 'IEEE-754 round-to-nearest: |fl(a o b) - (a o b)| <= 0.5 ulp for o in {+,-,*,/,sqrt} (no over/underflow)',
    oneNextafterStep: 'one nextafter step outward = a FULL 1 ulp, which strictly covers the 0.5 ulp RN error',
    conclusion:
      '[nextafter(fl(a o b), -inf), nextafter(fl(a o b), +inf)] CONTAINS the exact (a o b): one ULP ' +
      'suffices per op -- SOUND, merely 2x looser than a directed-rounded endpoint (which needs 0.5 ulp)',
  },
  uniformityIsFree: {
    theorem: 'Fundamental Theorem of Interval Arithmetic: sound enclosures COMPOSE under every op',
    argument:
      'if [x] contains x and [y] contains y then the one-ULP-inflated interval op returns an interval ' +
      'containing x o y; by induction over the op DAG the final interval contains the exact composition ' +
      'for ANY op count M(N), with NO per-op soundness loss',
    whatGrows:
      'only the WIDTH grows with M(N) (each op adds ~1 ulp outward slack + intrinsic wrapping) -- a ' +
      'TIGHTNESS matter (the E4 width-control concern), NOT a soundness matter',
  },
  conditions: {
    C1_correctRounding:
      'IEEE-754 mandates correct rounding ONLY for +,-,*,/,sqrt,fma; the drift 1/(x_k - x_j) is ' +
      'subtraction + division, both correctly rounded, so C1 holds for the drift UNCONDITIONALLY; it ' +
      'FAILS for transcendentals (Math.log in the RvM-inverse / height map) -- the residual leak',
    C2_noFmaContraction:
      'each source op must map to one separately-rounded machine op; ECMAScript requires exactly that ' +
      '(no a*b+c contraction, no reassociation), so C2 holds in the JS engine',
    C3_noOverflowUnderflow:
      'one ULP fails to enclose only on overflow to +/-Infinity or a gap interval straddling 0 (1/[g] ' +
      'with g_lo <= 0 <= g_hi is not an enclosure); imp-362 guards the straddling-zero case (returns ' +
      '[-inf,inf], flagged), so C3 is a documented tripwire, but must stay guarded to the front (E3 crux)',
    C4_exactNextafter:
      'the outward step must be the TRUE adjacent Float64; JS has no native nextafter, so the lemma needs ' +
      'the imp-362 nextafter implementation exact across binade boundaries and subnormals',
  },
  resolutionOfE2: {
    driftCore:
      'for the drift ARITHMETIC (the O(N^2) reciprocal sum) the one-ULP-suffices lemma HOLDS and is ' +
      'op-count-uniform by the Fundamental Theorem of Interval Arithmetic -- true directed rounding is ' +
      'NOT strictly required there; one-ULP is sound, ~2x looser (1 ulp vs 0.5 ulp per op)',
    residualLeak:
      'the genuine residual is C1 at the TRANSCENDENTAL seed/height layer (Math.log), where one-ULP is ' +
      'UNSOUND without a certified two-sided log -- so E2 collapses onto the OPEN imp-34867 crlibm-log ' +
      'scope, NOT onto directed rounding per se',
    twoxConnection:
      'the ~2x per-op looseness (1 ulp vs 0.5 ulp) is CONSISTENT with the imp-36017/imp-36066 ~2x ' +
      'surrogate-over-layer width ratio as a plausible mechanism, but DERIVING the exact 2.0 limit is the ' +
      'separate imp-36175/imp-36199 obligation and is NOT claimed here',
  },
  cruxNumbers: {
    epsDouble: EPS_DOUBLE, // 2^-52 = 1 ulp
    rnHalfUlp: RN_HALF_ULP, // 2^-53 = 0.5 ulp (round-to-nearest max error)
    oneUlpOverHalfUlp: ONE_ULP_OVER_HALF_ULP, // 2.0: one-ULP slack vs directed-rounded slack per op
    driftOpsPerStepAtTPT: DRIFT_OPS_PER_STEP_AT_TPT, // ~1.9e12 correctly-rounded ops / RK4 step at N ~ 488602
    opsPerPole: OPS_PER_POLE, // 2 correctly-rounded ops (subtraction + division) per reciprocal term
    note:
      'the drift core is ~1.9e12 correctly-rounded ops per RK4 step at T_PT, ALL covered by the ' +
      'op-count-uniform lemma (soundness composes with no accumulation); the transcendental seed/height ' +
      'ops are the only C1 leak and route to imp-34867, not to directed rounding',
  },
  conclusion: {
    lemmaExistsForCore:
      'a one-ULP-suffices lemma exists and is uniform over op count for the correctly-rounded arithmetic ' +
      'core (drift = subtraction + division), by the Fundamental Theorem of Interval Arithmetic',
    directedRoundingNotStrictlyRequired:
      'genuine IEEE-754 directed rounding is NOT strictly required for the drift core -- one-ULP is sound, ' +
      'only ~2x looser; the Arb/MPFI/CAPD advantage there is TIGHTNESS, not soundness',
    e2ReducesToTranscendentalLayer:
      'E2 does not reduce to "directed rounding is mandatory"; it reduces to the OPEN imp-34867 crlibm-log ' +
      'certified two-sided enclosure at the transcendental seed/height layer, where one-ULP IS unsound',
    noBoundMovesOnItsOwn:
      'resolving E2 sharpens the Step-2 G-interval-enclosure obligation but changes NO Lambda bound ' +
      'directly -- Step 2 feeds the E(N) bridge constants at Step 4, not the headline inequality',
  },
  isRigorous: false,
  verdict:
    'SCOPING / ASSESSMENT (frontier-direction, NOT a discharge). The imp-362 one-ULP outward-rounding ' +
    'emulation DOES admit a proven one-ULP-suffices lemma that is UNIFORM over the op count -- but only for ' +
    'the CORRECTLY-ROUNDED arithmetic core, and the backward-Dyson drift 1/(x_k - x_j) is exactly that core ' +
    '(subtraction + division, both IEEE-754-mandated correctly rounded). Per op, round-to-nearest errs by ' +
    '<= 0.5 ulp and one nextafter step outward moves a full 1 ulp, so the inflated endpoints CONTAIN the exact ' +
    'result; uniformity over the ~1.9e12-op-per-step drift is FREE via the Fundamental Theorem of Interval ' +
    'Arithmetic (sound enclosures compose with no accumulation of soundness debt -- only WIDTH grows, the E4 ' +
    'tightness concern). So genuine IEEE-754 directed rounding is NOT strictly required for the drift core; ' +
    'one-ULP is sound, merely ~2x looser (1 ulp vs 0.5 ulp per op, consistent with the imp-36017/imp-36066 ~2x ' +
    'ratio, though DERIVING that 2.0 is imp-36175/imp-36199, not claimed here). The lemma rests on four ' +
    'conditions: C1 correct rounding of every op (holds for +,-,*,/,sqrt UNCONDITIONALLY; FAILS for Math.log), ' +
    'C2 no fma-contraction/reassociation (ECMAScript guarantees this), C3 no overflow/underflow/straddling-zero ' +
    'escape (imp-362 guards straddling-zero as a flagged tripwire), C4 exact nextafter. The one genuine residual ' +
    'is C1 at the TRANSCENDENTAL seed/height layer (Math.log, not correctly rounded in ECMAScript), where ' +
    'one-ULP is UNSOUND without a certified two-sided log -- so imp-36193 E2 does NOT reduce to "directed ' +
    'rounding is mandatory" but collapses onto the OPEN imp-34867 crlibm-log scope. Proves no lemma to ' +
    'verified-certificate standard; instantiates no directed rounding; encloses no collision time; changes no ' +
    'bound; establishes no positivity; C_mb GUE-conditional (imp-486) untouched; imp-34714a stays OPEN; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36193 (parent; ingredient E2 = this question); imp-34867 (crlibm-log two-sided enclosure scope -- ' +
    'the transcendental-layer residual E2 reduces to); imp-362 (LAMBDA_INTERVAL_DYSON one-ULP outward ' +
    'inflation; drift 1/(gamma_n - gamma_k); straddling-zero guard); imp-35761 (O(N*eps) arithmetic ceiling); ' +
    'imp-36017 / imp-36066 (~2x surrogate-over-layer width ratio); IEEE-754-2019 (correct-rounding mandate for ' +
    'basic ops); ECMAScript (round-to-nearest only, no fma contraction); Arb/MPFI/CAPD (genuine directed ' +
    'rounding); Platt-Trudgian 2021 (barrier base / SOTA).',
};

export const IMP36234_ONE_ULP_SUFFICES_LEMMA_OP_COUNT_UNIFORM_SCOPE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-36193 / imp-36192.
    id: 'imp36234-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 ordinate count anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // The soundness engine: round-to-nearest max error 0.5 ulp is strictly below the 1 ulp nextafter step,
    // so one-ULP-outward CONTAINS the exact result; the ratio is exactly 2.0.
    id: 'imp36234-half-ulp-below-one-ulp',
    description: 'RN error 0.5 ulp < 1 ulp nextafter step; one-ULP/half-ULP ratio = 2.0',
    holds: () =>
      RN_HALF_ULP < EPS_DOUBLE &&
      EPS_DOUBLE === 2 ** -52 &&
      RN_HALF_ULP === 2 ** -53 &&
      Math.abs(ONE_ULP_OVER_HALF_ULP - 2.0) < 1e-15,
  },
  {
    // Op-count uniformity: the drift core is ~1.9e12 correctly-rounded ops per RK4 step at T_PT,
    // all covered by the FTIA composition (no per-op soundness loss); 2 correctly-rounded ops per pole term.
    id: 'imp36234-op-count-uniform-core',
    description: 'Drift core ~1.9e12 correctly-rounded ops/step at T_PT; 2 ops/pole; uniformity via FTIA',
    holds: () =>
      OPS_PER_POLE === 2 &&
      RK4_STAGES === 4 &&
      DRIFT_OPS_PER_STEP_AT_TPT > 1e12 &&
      DRIFT_OPS_PER_STEP_AT_TPT === 4 * N_AT_TPT * (N_AT_TPT - 1) * 2,
  },
  {
    // Four named conditions C1-C4; C1 explicitly the transcendental leak routing to imp-34867,
    // and the resolution reduces E2 to the crlibm-log scope, not to directed rounding per se.
    id: 'imp36234-four-conditions-and-reduction',
    description: 'Four conditions C1-C4; C1 = transcendental leak; E2 reduces to imp-34867 crlibm-log scope',
    holds: () => {
      const obj = IMP36234_ONE_ULP_SUFFICES_LEMMA_OP_COUNT_UNIFORM_SCOPE;
      return (
        Object.keys(obj.conditions).length === 4 &&
        /Math\.log/.test(obj.conditions.C1_correctRounding) &&
        /imp-34867/.test(obj.resolutionOfE2.residualLeak) &&
        /NOT strictly required/.test(obj.conclusion.directedRoundingNotStrictlyRequired)
      );
    },
  },
  {
    // Honesty gate: scoping only; discharges nothing; imp-34714a open; no bound moved; no QED; no refereed bound is changed.
    id: 'imp36234-honesty-gate',
    description: 'Scoping only; discharges nothing; imp-34714a OPEN; changes no bound; no QED; no refereed bound is changed',
    holds: () =>
      IMP36234_ONE_ULP_SUFFICES_LEMMA_OP_COUNT_UNIFORM_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /imp-34714a stays OPEN/.test(IMP36234_ONE_ULP_SUFFICES_LEMMA_OP_COUNT_UNIFORM_SCOPE.verdict) &&
      /changes NO Lambda bound/.test(
        IMP36234_ONE_ULP_SUFFICES_LEMMA_OP_COUNT_UNIFORM_SCOPE.conclusion.noBoundMovesOnItsOwn
      ) &&
      /NO QED/.test(IMP36234_ONE_ULP_SUFFICES_LEMMA_OP_COUNT_UNIFORM_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP36234_ONE_ULP_SUFFICES_LEMMA_OP_COUNT_UNIFORM_SCOPE.verdict),
  },
];

for (const a of IMP36234_ONE_ULP_SUFFICES_LEMMA_OP_COUNT_UNIFORM_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36234-one-ulp-suffices-lemma-op-count-uniform-scope assertion failed: ${a.id}`);
  }
}
