/**
 * @module imp-36194-step4-etrunc-eflow-constant-discharge-scope
 *
 * imp-36194 (proof/scoping, S-frontier): enumerate -- WITHOUT claiming any is
 * discharged -- what discharging the E_flow (rigorous-MODULO-constants) and the
 * E_trunc (Guth-Maynard tail) constants of the assembled E(N) bridge concretely
 * requires, and show WHY that obligation is DISTINCT in KIND from the sole
 * step-gating sub-gap G6a_shock_lipschitz (the RH-hard Hoelder-1/2 spatial
 * modulus of tau_c at the Burgers shock).
 *
 * lambda-roadmap.js Step-4 rigorousUpgradeGap lists THREE open obligations feeding
 * the additive assembly E(N) = E_coll + E_trunc + E_flow:
 *   - G6a-holder-modulus         (supplies C_H in E_coll; RH-hard, imp-35147)
 *   - G-Etrunc-Eflow-constants   (THIS ticket: the constants in E_trunc, E_flow)
 *   - G-EN-ladder-verify         (assembled-E(N) verification; imp-36195 companion)
 * imp-345 shipped only a PARTIAL closure: E_flow is rigorous MODULO unnamed
 * constants, and E_trunc is a Guth-Maynard tail whose prefactor/exponent are not
 * yet pinned unconditionally (the imp-34791 audit flagged a prefactor 3->5
 * correction and a WRONG Ramare line, so the constant chain is not certified).
 *
 * SCOPING / ASSESSMENT ONLY. Discharges no constant; pins no prefactor; ports no
 * barrier; proves no Lipschitz rate; verifies no inequality; changes no bound;
 * establishes no positivity; respects the imp-2519 no-overclaim guard; C_mb
 * GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE TWO CONSTANT FAMILIES TO DISCHARGE
 * -----------------------------------------------------------------------------
 * E_flow (heat-flow / backward-Dyson Gronwall term). Structurally
 *   E_flow ~ C_F * (heat-flow magnitude) * exp(C_G * |t_c|), with TWO constants:
 *     - C_F: the flow PREFACTOR, PINNED analytically = (log(T_0/2pi) + 1)/(2pi)
 *       (imp-398). This piece is DISCHARGED -- reported honestly as the closed leg.
 *     - C_G: the Gronwall / Lipschitz RATE. imp-2633 discharged it only to an
 *       N-DEPENDENT UPPER BOUND C_G <= 4/B(0)^2 = (log T_0)^2/pi^2, where
 *       B(0) = 2pi/log(T_0) is the mean spacing and 4/B is the Calogero-Moser
 *       drift. Backward-time monotonicity B(s) <= B(0) makes 4/B(s)^2 GROW, so
 *       there is NO clean N-independent pinned C_G. This is the CRUX of E_flow.
 * E_trunc (far-tail truncation floor above T_PT). NOMINAL value 3.06e-5 (clean
 *   count) / 5.106e-5 (imp-34791 parts-corrected), with THREE deterministic
 *   discharge needs, none RH-hard:
 *     - the Guth-Maynard tail PREFACTOR/EXPONENT pinned unconditionally
 *       (imp-34791 flagged a prefactor 3->5 correction);
 *     - the density constant chain re-derived (imp-34791 found the imp-1324
 *       Ramare line WRONG by a large factor);
 *     - the OPERATIVE statement PORTED: per imp-35419 the numeric 3.06e-5 is a
 *       count ARTIFACT and what E_trunc must actually encode is a DETERMINISTIC
 *       barrier lemma S_barrier (realness control above T_PT), which is UNPORTED.
 *
 * THE INGREDIENTS A FULL CONSTANT DISCHARGE WOULD REQUIRE (all OPEN, all NON-RH)
 * -----------------------------------------------------------------------------
 * F1 (E_flow prefactor C_F) -- CLOSED: pinned analytically = (log(T_0/2pi)+1)/(2pi)
 *    by imp-398. Reported as the one already-discharged leg, for honesty.
 * F2 (E_flow rate C_G -- the E_flow CRUX): a clean N-UNIFORM pinned C_G. Currently
 *    only C_G <= (log T_0)^2/pi^2 (imp-2633), which GROWS with N; the named
 *    blocking refinement is a Calogero-Moser GLOBAL Lipschitz lemma. DETERMINISTIC
 *    ODE-analysis obligation, NOT RH-hard.
 * F3 (E_flow heat-flow residual constants): the unnamed O(1) constants in the
 *    de Bruijn / heat-flow estimate that leave E_flow "rigorous modulo constants"
 *    (imp-345). Must be named as explicit numbers.
 * T1 (E_trunc tail prefactor/exponent): pin the Guth-Maynard far-tail bound
 *    prefactor and exponent unconditionally (imp-34791 prefactor 3->5 correction).
 * T2 (E_trunc density chain / Ramare line): re-derive the explicit-formula density
 *    constant chain, correcting the imp-1324 Ramare line the imp-34791 audit found
 *    WRONG. DETERMINISTIC number-theory bookkeeping, RH-FREE.
 * T3 (E_trunc operative barrier port -- the E_trunc CRUX): port the deterministic
 *    argument-principle / winding-number realness barrier S_barrier above T_PT
 *    (imp-35419) that the numeric 3.06e-5 stands in for. RH-FREE / deterministic
 *    (Platt-Trudgian / Dobner-Platt style), NOT the RH-hard minimal-gap modulus.
 *
 * WHY THIS IS DISTINCT IN KIND FROM G6a_shock_lipschitz
 * -----------------------------------------------------------------------------
 * G6a supplies C_H, a POINTWISE two-point SPATIAL Hoelder-1/2 modulus
 * |tau_c(x) - tau_c(x_prime)| <= C_H |x - x_prime|^{1/2}, controlled at the single
 * x where the spacing is SMALLEST (the shock front). imp-35147 graded it
 * effectively RH-EQUIVALENT: the only fitting object is a uniform minimal-gap
 * lower bound (nearest-pair front / imp-348 microscopic local law), and the
 * strictly-weaker-but-sufficient bucket is EMPTY. By contrast the E_flow/E_trunc
 * constants are NOT a modulus and NONE is RH-hard: F2 is a deterministic global
 * Lipschitz rate (Calogero-Moser), T1/T2 are deterministic arithmetic bookkeeping,
 * and T3 is a deterministic realness barrier. They are ORTHOGONAL, independent
 * obligations feeding the SAME additive assembly: closing G6a does NOT make E(N)
 * rigorous while these numbers stay un-pinned, and pinning every constant here does
 * NOT close Step 4 while the RH-hard G6a still gates it.
 *
 * READING: G-Etrunc-Eflow-constants is a DETERMINISTIC, RH-FREE discharge
 * obligation -- five open ingredients F2, F3, T1, T2, T3 (F1 already closed) --
 * categorically SEPARATE from the RH-hard G6a modulus. It is "hard bookkeeping and
 * one deterministic barrier port", not an RH-strength analytic wall; but it is
 * genuinely OPEN, and even fully discharged it moves NO Lambda bound on its own
 * (E(N) is the Step-4 bridge input, not the headline inequality; and imp-35164
 * records E(N) floors at the constant E_trunc rather than tending to 0 on the
 * current fixed-strip surrogate -- the G-EN-ladder-verify companion obligation).
 *
 * @see lambda-roadmap.js Step-4 rigorousUpgradeGap obligation G-Etrunc-Eflow-constants (closed:false)
 * @see imp-345 (partial bridge closure: E_flow rigorous modulo constants, E_trunc Guth-Maynard tail), imp-354, imp-366
 * @see imp-398 (C_F flow prefactor pinned analytically), imp-2633 (C_G <= (log T_0)^2/pi^2 N-dependent upper bound)
 * @see imp-34791 (E_trunc audit: prefactor 3->5 correction, WRONG imp-1324 Ramare line, barrier-lemma reclassification)
 * @see imp-35419 (E_trunc operative statement = deterministic UNPORTED barrier lemma S_barrier; 3.06e-5 a count artifact)
 * @see imp-35147 (G6a minimal-gap modulus effectively RH-EQUIVALENT; strictly-weaker-but-sufficient bucket EMPTY)
 * @see imp-35164 (E(N) floors at E_trunc on the fixed-strip surrogate, does not tend to 0) -- G-EN-ladder-verify (imp-36195)
 * @see imp-399 (C_C in E_coll = (1/8)sqrt(3pi), gated by the G6a C_H modulus) -- the RH-hard leg, NOT this ticket
 * @see Guth-Maynard 2024 (large-value / density tail); Platt-Trudgian 2021, Dobner-Platt (argument-principle barrier)
 */

// -- Anchor + operative constants (import-light; matching imp-36192 / imp-36193) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 ordinate count anchor at T_PT

const LOG_TPT = Math.log(T_PT); // ~28.7296

// E_flow constants (heat-flow / backward-Dyson Gronwall term).
//   C_F: the flow PREFACTOR, pinned analytically by imp-398 (DISCHARGED).
const C_F_PREFACTOR = (Math.log(T_PT / (2 * Math.PI)) + 1) / (2 * Math.PI); // ~4.4391
//   C_G: the Gronwall / Lipschitz RATE, discharged only to an N-DEPENDENT UPPER
//   bound 4/B(0)^2 = (log T_0)^2/pi^2 (imp-2633). B(0) = mean spacing (RvM).
const B0_MEAN_SPACING = (2 * Math.PI) / LOG_TPT; // ~0.2187
const C_G_UPPER_BOUND = 4 / (B0_MEAN_SPACING * B0_MEAN_SPACING); // = (log T_0)^2/pi^2 ~83.63
const C_G_UPPER_BOUND_CHECK = (LOG_TPT * LOG_TPT) / (Math.PI * Math.PI); // identical closed form

// E_trunc far-tail floor above T_PT. NOMINAL clean-count value / imp-34791 correction.
const E_TRUNC_NOMINAL = 3.06e-5; // clean count (imp-447/imp-459 Ingham at T_PT)
const E_TRUNC_CORRECTED = 5.106e-5; // imp-34791 R2 parts-corrected

// The open discharge ingredients (F1 closed; F2, F3, T1, T2, T3 open).
const OPEN_INGREDIENTS = ['F2', 'F3', 'T1', 'T2', 'T3'];
const CLOSED_INGREDIENTS = ['F1'];

export const IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE = {
  id: 'imp-36194',
  proofSection: 'S-frontier',
  question:
    'Enumerate what discharging the E_flow (rigorous-MODULO-constants) and E_trunc (Guth-Maynard ' +
    'tail) constants of the assembled E(N) = E_coll + E_trunc + E_flow bridge concretely requires, ' +
    'and show why that obligation is DISTINCT in KIND from the RH-hard G6a_shock_lipschitz ' +
    'Hoelder-1/2 spatial modulus. Scoping only; discharges no constant; changes no bound; NO QED.',
  additiveAssembly: 'E(N) = E_coll + E_trunc + E_flow (lambda-roadmap.js Step-4 bridge input)',
  eflowConstants: {
    C_F_prefactor: {
      status: 'CLOSED (F1): pinned analytically by imp-398',
      value: '(log(T_0/2pi) + 1)/(2pi)',
      numericAtTPT: C_F_PREFACTOR,
    },
    C_G_rate: {
      status: 'OPEN (F2, the E_flow CRUX): only an N-DEPENDENT UPPER BOUND',
      upperBound: 'C_G <= 4/B(0)^2 = (log T_0)^2/pi^2 (imp-2633)',
      numericUpperBoundAtTPT: C_G_UPPER_BOUND,
      obstruction:
        'backward-time monotonicity B(s) <= B(0) makes 4/B(s)^2 GROW, so no clean N-independent ' +
        'pinned C_G; the named blocking refinement is a Calogero-Moser GLOBAL Lipschitz lemma -- ' +
        'a DETERMINISTIC ODE-analysis obligation, NOT RH-hard',
    },
    heatFlowResidual: {
      status: 'OPEN (F3): unnamed O(1) constants in the de Bruijn / heat-flow estimate',
      note: 'these are the constants the imp-345 "rigorous modulo constants" status refers to',
    },
  },
  etruncConstants: {
    nominalValue: E_TRUNC_NOMINAL,
    partsCorrectedValue: E_TRUNC_CORRECTED,
    T1_tailPrefactorExponent:
      'OPEN: pin the Guth-Maynard far-tail bound prefactor and exponent unconditionally ' +
      '(imp-34791 flagged a prefactor 3->5 correction). DETERMINISTIC, RH-FREE.',
    T2_densityChainRamare:
      'OPEN: re-derive the explicit-formula density constant chain, correcting the imp-1324 Ramare ' +
      'line the imp-34791 audit found WRONG. DETERMINISTIC number-theory bookkeeping, RH-FREE.',
    T3_operativeBarrierPort:
      'OPEN (the E_trunc CRUX): per imp-35419 the numeric 3.06e-5 is a count ARTIFACT and E_trunc ' +
      'must encode a DETERMINISTIC argument-principle / winding-number realness barrier S_barrier ' +
      'above T_PT (Platt-Trudgian / Dobner-Platt style), which is UNPORTED. RH-FREE / deterministic.',
  },
  ingredients: {
    F1_eflowPrefactorCF:
      'CLOSED: C_F = (log(T_0/2pi)+1)/(2pi) pinned analytically by imp-398 (reported for honesty)',
    F2_eflowRateCG:
      'OPEN (E_flow crux): a clean N-UNIFORM pinned C_G; currently only C_G <= (log T_0)^2/pi^2 ' +
      '(imp-2633), which GROWS with N -- needs a Calogero-Moser GLOBAL Lipschitz lemma, DETERMINISTIC',
    F3_eflowHeatFlowResidual:
      'OPEN: name the unnamed O(1) heat-flow / de Bruijn constants (the imp-345 modulo-constants status)',
    T1_etruncTailPrefactorExponent:
      'OPEN: pin the Guth-Maynard tail prefactor/exponent unconditionally (imp-34791 3->5), DETERMINISTIC',
    T2_etruncDensityChainRamare:
      'OPEN: correct the WRONG imp-1324 Ramare line / re-derive the density chain (imp-34791), RH-FREE',
    T3_etruncOperativeBarrierPort:
      'OPEN (E_trunc crux): port the deterministic realness barrier S_barrier above T_PT (imp-35419), RH-FREE',
  },
  distinctFromG6a: {
    g6aObject:
      'a POINTWISE two-point SPATIAL Hoelder-1/2 modulus |tau_c(x)-tau_c(x_prime)| <= C_H |x-x_prime|^{1/2} ' +
      'controlled at the single x with SMALLEST spacing (the shock front); supplies C_H in E_coll',
    g6aStrength:
      'imp-35147 graded G6a effectively RH-EQUIVALENT: only a uniform minimal-gap lower bound ' +
      '(nearest-pair front / imp-348) fits, and the strictly-weaker-but-sufficient bucket is EMPTY',
    thisTicketStrength:
      'the E_flow/E_trunc constants are NOT a modulus and NONE is RH-hard: F2 a deterministic global ' +
      'Lipschitz rate, T1/T2 deterministic arithmetic bookkeeping, T3 a deterministic realness barrier',
    orthogonality:
      'independent obligations feeding the SAME additive assembly: closing G6a does NOT make E(N) ' +
      'rigorous while these numbers stay un-pinned, and pinning every constant here does NOT close ' +
      'Step 4 while the RH-hard G6a still gates it',
  },
  conclusion: {
    deterministicNotRHHard:
      'G-Etrunc-Eflow-constants is a DETERMINISTIC, RH-FREE discharge obligation (five open ' +
      'ingredients F2, F3, T1, T2, T3; F1 already closed), categorically SEPARATE from the RH-hard ' +
      'G6a modulus -- hard bookkeeping plus one deterministic barrier port, not an RH-strength wall',
    noBoundMovesOnItsOwn:
      'even fully discharged it moves NO Lambda bound on its own: E(N) is the Step-4 bridge input, not ' +
      'the headline inequality, and imp-35164 records E(N) floors at the constant E_trunc rather than ' +
      'tending to 0 on the current fixed-strip surrogate (the G-EN-ladder-verify companion, imp-36195)',
  },
  isRigorous: false,
  verdict:
    'SCOPING / ASSESSMENT (frontier-direction, NOT rigorous). Discharging the E_flow and E_trunc ' +
    'constants of the assembled E(N) = E_coll + E_trunc + E_flow bridge is a DETERMINISTIC, RH-FREE ' +
    'obligation DISTINCT IN KIND from the RH-hard G6a_shock_lipschitz Hoelder-1/2 spatial modulus. ' +
    'It needs FIVE open ingredients (F1, the E_flow prefactor C_F = (log(T_0/2pi)+1)/(2pi), is ' +
    'already CLOSED by imp-398): F2 a clean N-UNIFORM E_flow Gronwall rate C_G -- currently only the ' +
    'N-dependent upper bound C_G <= (log T_0)^2/pi^2 ~ 83.6 (imp-2633), needing a Calogero-Moser ' +
    'global Lipschitz lemma; F3 the unnamed heat-flow / de Bruijn residual constants (the imp-345 ' +
    'modulo-constants status); T1 the Guth-Maynard far-tail prefactor/exponent pinned unconditionally ' +
    '(imp-34791 prefactor 3->5); T2 the density constant chain re-derived, correcting the WRONG ' +
    'imp-1324 Ramare line (imp-34791); and T3 the deterministic argument-principle realness barrier ' +
    'S_barrier above T_PT that the count artifact 3.06e-5 stands in for (imp-35419), unported. UNLIKE ' +
    'G6a (imp-35147: effectively RH-EQUIVALENT, only a minimal-gap nearest-pair floor fits, ' +
    'strictly-weaker-but-sufficient bucket EMPTY), none of F2, F3, T1, T2, T3 is RH-hard; they are ' +
    'orthogonal, independent obligations feeding the SAME additive assembly, so closing G6a does not ' +
    'make E(N) rigorous while these numbers stay un-pinned, and pinning them does not close Step 4 ' +
    'while G6a gates it. Discharges no constant; pins no prefactor; ports no barrier; proves no ' +
    'Lipschitz rate; verifies no inequality; establishes no positivity; even fully discharged moves ' +
    'NO Lambda bound (E(N) floors at E_trunc on the current surrogate, imp-35164 / G-EN-ladder-verify); ' +
    'imp-2519 no-overclaim guard preserved; C_mb GUE-conditional (imp-486) untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'lambda-roadmap.js Step-4 rigorousUpgradeGap G-Etrunc-Eflow-constants (closed:false); imp-345 ' +
    '(partial bridge, E_flow rigorous modulo constants, E_trunc Guth-Maynard tail); imp-354, imp-366; ' +
    'imp-398 (C_F prefactor pinned); imp-2633 (C_G <= (log T_0)^2/pi^2 N-dependent upper bound); ' +
    'imp-34791 (E_trunc audit: prefactor 3->5, WRONG imp-1324 Ramare line, barrier reclassification); ' +
    'imp-35419 (E_trunc = deterministic UNPORTED barrier lemma S_barrier, 3.06e-5 a count artifact); ' +
    'imp-35147 (G6a minimal-gap modulus effectively RH-EQUIVALENT, weaker-but-sufficient bucket EMPTY); ' +
    'imp-35164 (E(N) floors at E_trunc, does not tend to 0); imp-399 (C_C in E_coll, the RH-hard leg); ' +
    'Guth-Maynard 2024; Platt-Trudgian 2021; Dobner-Platt (argument-principle barrier).',
};

export const IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-36192 / imp-36193.
    id: 'imp36194-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 ordinate count anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // E_flow C_F prefactor pinned analytically (imp-398); C_G only an N-dependent upper bound
    // whose two closed forms 4/B(0)^2 and (log T_0)^2/pi^2 agree.
    id: 'imp36194-eflow-constants',
    description: 'C_F ~4.44 pinned (imp-398); C_G upper bound = 4/B(0)^2 = (log T_0)^2/pi^2 ~83.6 (imp-2633)',
    holds: () =>
      Math.abs(C_F_PREFACTOR - 4.4391) < 1e-3 &&
      Math.abs(C_G_UPPER_BOUND - 83.63) < 1e-2 &&
      Math.abs(C_G_UPPER_BOUND - C_G_UPPER_BOUND_CHECK) < 1e-9 &&
      C_G_UPPER_BOUND > C_F_PREFACTOR, // the growing rate dominates the pinned prefactor
  },
  {
    // E_trunc nominal / parts-corrected values, and the corrected value exceeds the nominal
    // (imp-34791 R2 correction is upward).
    id: 'imp36194-etrunc-values',
    description: 'E_trunc nominal 3.06e-5 (clean count) / 5.106e-5 (imp-34791 parts-corrected, upward)',
    holds: () =>
      Math.abs(E_TRUNC_NOMINAL - 3.06e-5) < 1e-9 &&
      Math.abs(E_TRUNC_CORRECTED - 5.106e-5) < 1e-9 &&
      E_TRUNC_CORRECTED > E_TRUNC_NOMINAL,
  },
  {
    // Six named ingredients (F1 closed; F2, F3, T1, T2, T3 open), with the RH-free character
    // recorded and the distinction from the RH-hard G6a modulus preserved.
    id: 'imp36194-six-ingredients-one-closed',
    description: 'Six ingredients F1/F2/F3/T1/T2/T3; F1 closed, five open; distinct from RH-hard G6a',
    holds: () => {
      const ing = IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE.ingredients;
      return (
        Object.keys(ing).length === 6 &&
        CLOSED_INGREDIENTS.length === 1 &&
        OPEN_INGREDIENTS.length === 5 &&
        /CLOSED/.test(ing.F1_eflowPrefactorCF) &&
        /Calogero-Moser/.test(ing.F2_eflowRateCG) &&
        /RH-EQUIVALENT/.test(IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE.distinctFromG6a.g6aStrength) &&
        /NOT RH-hard|NONE is RH-hard/.test(
          IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE.distinctFromG6a.thisTicketStrength
        )
      );
    },
  },
  {
    // Honesty gate: scoping only; distinct in kind from G6a; no bound moved; no QED; no refereed bound is changed.
    id: 'imp36194-honesty-gate',
    description: 'Scoping only; deterministic/RH-free, distinct from RH-hard G6a; changes no bound; no QED; no refereed bound is changed',
    holds: () =>
      IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /DETERMINISTIC, RH-FREE/.test(IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE.conclusion.deterministicNotRHHard) &&
      /moves NO Lambda bound/.test(IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE.conclusion.noBoundMovesOnItsOwn) &&
      /NO QED/.test(IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE.verdict),
  },
];

for (const a of IMP36194_STEP4_ETRUNC_EFLOW_CONSTANT_DISCHARGE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36194-step4-etrunc-eflow-constant-discharge-scope assertion failed: ${a.id}`);
  }
}
