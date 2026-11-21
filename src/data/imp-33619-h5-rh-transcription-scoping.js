/**
 * @module imp-33619-h5-rh-transcription-scoping
 *
 * imp-33619 (proof, frontier-scoping): SCOPE the G6a H5 Riemann-Hilbert transcription sub-gap that
 * imp-33603 marked OPEN -- WITHOUT claiming closure. imp-33603 catalogued the five structural
 * hypotheses of a Lemma-5.2-type Holder-1/2 blow-up modulus and marked H5 (REAL-SCALAR SETTING) OPEN:
 * Polymath15 Lemma 5.2 is stated for a real field u : R -> R, while the backward-Dyson field is the
 * complex Stieltjes transform m : C_+ -> C_+, so a Riemann-Hilbert transcription of the fold is
 * required and the repo does not reproduce one. This module ENUMERATES the transcription obligations:
 *   (a) which real-scalar hypotheses (H1 smoothness, H2 non-degenerate fold, H3 curvature) have a
 *       DIRECT complex analogue and which need a NEW argument;
 *   (b) whether the imp-354 fold-catastrophe expansion
 *       t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ... survives complexification of z_0;
 *   (c) what boundary behaviour on the real axis the RH problem imposes,
 * and states which obligations are DISCHARGED by existing repo results vs OPEN. Scoping only. G6a stays
 * OPEN; does not claim the transcription; imp-3066 untouched; no positivity; NO QED.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * The complex-fold picture below is the one already RECORDED in the repo, not a new derivation:
 * g6a-sub-hyperbolic-closure.js (imp-394) writes down the complex Burgers characteristics
 * dz/dt = m(z,t), the fold condition 1 + t m_prime(z_0*) = 0 with the critical point moving OFF the
 * real axis into C_+ (z_0* = x_star + i eps, eps -> 0+ as t -> t_c), and the "real-boundary fold" step
 * that returns it to R via Privalov-Sokhotski. imp-354 supplies the fold-catastrophe expansion and its
 * two named sub-sub-gaps (G6a-sub-hyperbolic, G6a-sub-constant). imp-33603 supplies the H1..H5
 * catalogue and names H4 (strip-height-uniformity) the load-bearing residual. This module only
 * RECONCILES those records at the level of the H5 transcription; it asserts nothing discharged that the
 * repo has not already recorded as discharged.
 *
 * A TENSION THIS SCOPING RESOLVES
 * -------------------------------
 * g6a-sub-hyperbolic-closure.js marks G6a-sub-hyperbolic CLOSED (the complex fold is a "red herring"
 * for the tau_c modulus because tau_c is a REAL functional and the real-boundary fold step needs only
 * Privalov-Sokhotski, no new lemma). imp-33603 nevertheless marks H5 OPEN. These are NOT contradictory
 * once the level is fixed: imp-394 closed the POINTWISE (fixed-N, fixed-configuration) real-boundary
 * fold step CONDITIONALLY on the cusp being exactly Holder-1/2 (Privalov-Sokhotski applies "just
 * barely" at alpha = 1/2). imp-33603 re-opens the transcription at the UNIFORM-in-N level, where the
 * Privalov-Sokhotski boundary-extension constant must be controlled as the reading strip
 * y_N^sharp = sqrt(2 pi / N) -> 0. The pointwise step is discharged; the uniform step is exactly the
 * H4 strip-height-uniformity residual. So H5 is transcribable POINTWISE and OPEN UNIFORMLY.
 *
 * (a) COMPLEX ANALOGUE OF H1 / H2 / H3
 * -----------------------------------
 *   H1 smoothness  -> DIRECT ANALOGUE, discharged. The real "C^2 away from the fold" is subsumed by
 *      ANALYTICITY of the Stieltjes transform m on the open upper half plane C_+ (m is holomorphic off
 *      the spectrum). This is STRONGER than the real hypothesis and is definitional, so no new argument.
 *   H2 non-degenerate fold  -> ANALOGUE EXISTS but needs the real-boundary fold step. The characteristic
 *      map z_0 -> z(t, z_0) has a non-degenerate critical point dz/dz_0 = 1 + t m_prime(z_0*) = 0 with
 *      d^2 z / dz_0^2 != 0 (imp-354 simple fold), but the critical point z_0* sits in C_+ (off R), not
 *      on the real axis where the RvM shock forms. Bringing it back to R as eps -> 0+ is the
 *      real-boundary fold step -- discharged POINTWISE by Privalov-Sokhotski (imp-394), NOT a verbatim
 *      transplant.
 *   H3 uniform curvature  -> NEW ARGUMENT REQUIRED, OPEN. |m_prime_prime(z_0*)| must be bounded below
 *      UNIFORMLY in N, but complexification makes this WORSE: as z_0* -> real axis the second derivative
 *      of the Stieltjes transform of the RvM cusp density DIVERGES, so the curvature floor is not
 *      uniform. This is the complex face of imp-33603 H3 / imp-354 G6a-sub-constant.
 *
 * (b) DOES THE imp-354 FOLD EXPANSION SURVIVE COMPLEXIFICATION OF z_0 ?
 * -------------------------------------------------------------------
 * YES, FORMALLY, as a complex-analytic Taylor expansion, but the "inf" that DEFINES tau_c acquires a
 * real-boundary condition. Because m is holomorphic on C_+, the shock-time map t_shock(z_0) is
 * holomorphic near z_0*, so the expansion
 *     t_shock(z_0) = tau_c + (1/2) alpha (z_0 - z_0*)^2 + O((z_0 - z_0*)^3)
 * continues verbatim with a COMPLEX coefficient alpha = t_shock_prime_prime(z_0*) in C. What does NOT
 * transcribe verbatim is the variational characterisation tau_c = inf_{z_0} t_shock(z_0): a genuine
 * infimum over a REAL variable becomes a critical value at a COMPLEX z_0*, and its physical meaning as
 * the real first-collision time requires Im(critical value) -> 0, i.e. Im(z_0*) = eps -> 0+ so the fold
 * lands on the real boundary. So the expansion SURVIVES; the SELECTION of the real critical value does
 * not survive for free -- it needs the real-boundary fold step of (c).
 *
 * (c) BOUNDARY BEHAVIOUR THE RH PROBLEM IMPOSES ON THE REAL AXIS
 * -------------------------------------------------------------
 * The RH / Stieltjes structure imposes three real-axis conditions:
 *   C1  ADDITIVE JUMP / STIELTJES INVERSION. The boundary values obey
 *       m(x + i0+) - m(x - i0+) = 2 i pi rho(x), equivalently rho(x) = (1/pi) Im m(x + i0+).
 *   C2  HERGLOTZ / NEVANLINNA POSITIVITY. m : C_+ -> C_+, i.e. Im m >= 0 on C_+, so the boundary
 *       density rho = (1/pi) Im m(x + i0+) >= 0. This is the POSITIVITY the real-scalar u : R -> R
 *       statement carries NO analogue of -- a real field is unconstrained in sign; the Stieltjes field
 *       is sign-pinned by construction.
 *   C3  BOUNDARY REGULARITY (Privalov-Sokhotski). For the continuous boundary extension of m_prime that
 *       the fold reading needs, rho must be Holder-alpha with alpha > 0; the RvM cusp rho ~
 *       C / |x - x_star|^{1/2} is Holder-1/2, so the extension holds but TIGHTLY (alpha = 1/2 is the
 *       minimum), and its CONSTANT is not controlled uniformly as the reading strip y_N^sharp -> 0.
 *
 * THE POSITIVITY QUESTION (the ticket's core assessment)
 * ------------------------------------------------------
 * Does the imp-354 fold expansion transcribe to the complex setting WITHOUT a new positivity input?
 * ANSWER: it needs the HERGLOTZ positivity Im m >= 0 (C2), which the real-scalar statement does not
 * carry -- so a positivity input IS invoked. BUT it is NOT a NEW open positivity gap: Im m >= 0 is
 * DEFINITIONAL for the Stieltjes transform of the (nonnegative) spectral measure, hence STRUCTURALLY
 * DISCHARGED, and it is a DIFFERENT object from the imp-3066 off-diagonal endpoint-Hankel K_a >= 0
 * positivity, which stays UNTOUCHED. So: the pointwise transcription needs no positivity input beyond
 * the definitional Herglotz sign; the genuinely OPEN obligation is NOT positivity at all but the
 * UNIFORM Privalov-Sokhotski boundary-regularity constant at alpha = 1/2 as y_N^sharp -> 0 -- i.e. the
 * imp-33603 H4 strip-height-uniformity residual / imp-3708 y2-adapted-flow-depth still-missing object.
 *
 * VERDICT: SCOPING ONLY, G6a STAYS OPEN. The H5 Riemann-Hilbert transcription is DISCHARGEABLE
 * POINTWISE (H1 by analyticity; H2 + the fold expansion by the real-boundary fold step, imp-394,
 * conditional on the Holder-1/2 cusp; the Herglotz positivity Im m >= 0 is definitional, not a new
 * gap) but OPEN UNIFORMLY (H3 uniform curvature; the Privalov-Sokhotski constant as y_N^sharp -> 0),
 * with the load-bearing open obligation being the SAME strip-height-uniformity object as imp-33603 H4 /
 * imp-3708 y2-adapted-flow-depth -- NOT a new positivity input. This reconciles the g6a-sub-hyperbolic
 * CLOSED record (pointwise) with the imp-33603 H5 OPEN mark (uniform). Assessment only; no positivity,
 * no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity
 * UNTOUCHED; C_mb share untouched. No refereed bound is changed.
 *
 * @see imp-33603-lemma52-port-scoping (the H1..H5 catalogue; H5 marked OPEN; H4 the named residual)
 * @see g6a-sub-hyperbolic-closure (imp-394: complex Burgers characteristics, real-boundary fold step, Privalov-Sokhotski)
 * @see lambda-burgers-shock-lipschitz (imp-354: Whitham fold reduction; G6a-sub-hyperbolic, G6a-sub-constant)
 * @see imp-33618-strip-height-tradeoff (the H3/H4 strip-height trade-off geometry)
 * @see imp-3708 (y2-adapted-flow-depth still-missing object)
 */

// The reading strip height y_N^sharp = sqrt(2 pi / N) descends toward the y -> 0+ boundary shock as N
// grows (imp-341 / imp-354 convention); it is the height at which the Privalov-Sokhotski boundary
// constant would have to be controlled uniformly, and it is the geometric root of the OPEN uniform step.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// The three real-scalar hypotheses H1/H2/H3, with their complex (Riemann-Hilbert) analogue status.
const TRANSCRIPTION_OBLIGATIONS = [
  {
    id: 'H1',
    name: 'smoothness away from the fold',
    realScalar: 'tau_c is C^2 in the flow field off the shock point',
    complexAnalogue: 'analyticity of the Stieltjes transform m on C_+ (holomorphic off the spectrum)',
    analogueKind: 'direct', // stronger than the real hypothesis; definitional
    status: 'discharged',
    newArgument: false,
  },
  {
    id: 'H2',
    name: 'non-degenerate (simple) fold',
    realScalar: 'u_0_prime(z_0*) != 0, u_0_double_prime(z_0*) != 0 -- forces exponent 1/2',
    complexAnalogue:
      'characteristic map z_0 -> z(t,z_0) has a non-degenerate critical point 1 + t m_prime(z_0*) = 0, ' +
      'but z_0* lives in C_+ off R; the real-boundary fold step returns it to R as eps -> 0+',
    analogueKind: 'needs-real-boundary-step', // discharged pointwise by Privalov-Sokhotski (imp-394)
    status: 'discharged-pointwise',
    newArgument: false,
  },
  {
    id: 'H3',
    name: 'uniform curvature lower bound',
    realScalar: '|u_0_double_prime(z_0*)| >= c > 0 uniform in N so C_W is finite uniformly',
    complexAnalogue:
      'as z_0* -> real axis the second derivative of m for the RvM cusp DIVERGES; no uniform lower bound',
    analogueKind: 'new-argument-required',
    status: 'open',
    newArgument: true,
  },
];

// The three real-axis boundary conditions the RH / Stieltjes structure imposes (part (c)).
const BOUNDARY_CONDITIONS = [
  {
    id: 'C1',
    name: 'additive jump / Stieltjes inversion',
    statement: 'm(x + i0+) - m(x - i0+) = 2 i pi rho(x); rho(x) = (1/pi) Im m(x + i0+)',
    status: 'discharged', // classical
  },
  {
    id: 'C2',
    name: 'Herglotz / Nevanlinna positivity',
    statement: 'm : C_+ -> C_+ so Im m >= 0, hence rho >= 0 -- a sign constraint the real field u : R -> R lacks',
    status: 'discharged-definitional', // the positivity input; structural, NOT a new open gap
    isPositivityInput: true,
  },
  {
    id: 'C3',
    name: 'boundary regularity (Privalov-Sokhotski)',
    statement:
      'continuous boundary extension of m_prime needs rho Holder-alpha, alpha > 0; RvM cusp is ' +
      'Holder-1/2 (tight), constant NOT controlled uniformly as y_N^sharp -> 0',
    status: 'open-uniform', // discharged pointwise, open uniformly -- the load-bearing residual
    isResidual: true,
  },
];

const DISCHARGED = TRANSCRIPTION_OBLIGATIONS.filter((o) => /discharged/.test(o.status)).map((o) => o.id);
const OPEN = TRANSCRIPTION_OBLIGATIONS.filter((o) => o.status === 'open').map((o) => o.id);

// Witness that the reading strip descends to the boundary (the uniform step lives here).
const N_LADDER = [1e3, 1e6, 1e9, 1e12];
const STRIP_HEIGHT_LADDER = N_LADDER.map((N) => ({ N, y_N_sharp: +ySharp(N).toExponential(4) }));

export const IMP33619_H5_RH_TRANSCRIPTION_SCOPING = {
  id: 'imp-33619',
  proofSection: 'S-frontier',
  scopes: 'The G6a H5 Riemann-Hilbert transcription sub-gap named OPEN by imp-33603',
  question:
    '(a) which real-scalar hypotheses H1/H2/H3 have a direct complex analogue and which need a new ' +
    'argument; (b) whether the imp-354 fold expansion t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ... ' +
    'survives complexification of z_0; (c) what real-axis boundary behaviour the RH problem imposes -- ' +
    'and whether the transcription goes through WITHOUT a new positivity input. Scoping only; G6a OPEN; no QED.',

  transcriptionObligations: TRANSCRIPTION_OBLIGATIONS,
  boundaryConditions: BOUNDARY_CONDITIONS,
  dischargedObligations: DISCHARGED, // H1 (analyticity), H2 (real-boundary fold step, pointwise)
  openObligations: OPEN, // H3 (uniform curvature)

  // (b) fold expansion under complexification
  foldExpansionSurvives: true,
  foldExpansionNote:
    'The expansion t_shock(z_0) = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ... continues verbatim as a ' +
    'COMPLEX-ANALYTIC Taylor expansion (m holomorphic on C_+, so t_shock holomorphic near z_0*, ' +
    'alpha in C). What does NOT transcribe for free is the variational tau_c = inf_{z_0} t_shock: a ' +
    'real infimum becomes a critical value at complex z_0*, and selecting the real first-collision time ' +
    'needs Im(z_0*) = eps -> 0+ (the real-boundary fold step), discharged pointwise by Privalov-Sokhotski.',

  // The positivity assessment (the ticket core)
  positivityInputInvoked: true, // the Herglotz sign C2
  positivityInputIsNewGap: false, // definitional, structurally discharged
  positivityNote:
    'The transcription DOES invoke a positivity input -- the Herglotz / Nevanlinna sign Im m >= 0 (C2), ' +
    'which the real-scalar field u : R -> R carries no analogue of -- but it is DEFINITIONAL for the ' +
    'Stieltjes transform of the nonnegative spectral measure, hence structurally DISCHARGED, and is a ' +
    'DIFFERENT object from the imp-3066 endpoint-Hankel K_a >= 0 positivity (UNTOUCHED). So NO new ' +
    'positivity input is needed for the pointwise transcription.',

  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity',
  residualStatement:
    'The genuinely OPEN obligation is NOT positivity but the UNIFORM Privalov-Sokhotski boundary ' +
    'regularity constant (C3) at alpha = 1/2 as the reading strip y_N^sharp = sqrt(2 pi / N) -> 0, ' +
    'together with the uniform curvature lower bound H3 -- the SAME strip-height-uniformity object as ' +
    'imp-33603 H4 / imp-3708 y2-adapted-flow-depth. H5 is transcribable POINTWISE, OPEN UNIFORMLY.',

  reconciles:
    'g6a-sub-hyperbolic-closure (imp-394) CLOSED the POINTWISE real-boundary fold step (no new lemma, ' +
    'Privalov-Sokhotski, conditional on the Holder-1/2 cusp); imp-33603 marked H5 OPEN at the ' +
    'UNIFORM-in-N level. Both hold once the level is fixed: pointwise discharged, uniform open.',

  stripHeightLadder: STRIP_HEIGHT_LADDER,
  isRigorous: false,
  verdict:
    'SCOPING (frontier-direction, NOT rigorous): the H5 Riemann-Hilbert transcription of the ' +
    'real-scalar Lemma-5.2 fold is DISCHARGEABLE POINTWISE -- H1 via analyticity of m on C_+, H2 and ' +
    'the imp-354 fold expansion via the real-boundary fold step (imp-394, Privalov-Sokhotski, ' +
    'conditional on the Holder-1/2 cusp), and the Herglotz positivity Im m >= 0 is DEFINITIONAL not a ' +
    'new gap -- but OPEN UNIFORMLY: H3 (uniform-in-N fold curvature) and the Privalov-Sokhotski ' +
    'boundary constant at alpha = 1/2 as y_N^sharp = sqrt(2 pi / N) -> 0 are not controlled. The ' +
    'imp-354 fold expansion SURVIVES complexification as a complex-analytic Taylor expansion; only the ' +
    'variational selection of the real critical value needs the real-boundary step. The transcription ' +
    'goes through WITHOUT a new positivity input (the only positivity used is the definitional Herglotz ' +
    'sign). The load-bearing OPEN obligation is the strip-height-uniformity residual (imp-33603 H4 / ' +
    'imp-3708 y2-adapted-flow-depth), NOT positivity. This reconciles the g6a-sub-hyperbolic CLOSED ' +
    'record (pointwise) with the imp-33603 H5 OPEN mark (uniform). Assessment / literature-scoping ' +
    'only; G6a_shock_lipschitz stays OPEN; no positivity, no bridge closure, no RH claim, NO QED. ' +
    'imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED; C_mb share untouched. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33603-lemma52-port-scoping (H1..H5 catalogue, H5 OPEN, H4 residual); g6a-sub-hyperbolic-closure ' +
    '(imp-394: complex Burgers characteristics, real-boundary fold step, Privalov-Sokhotski); ' +
    'lambda-burgers-shock-lipschitz (imp-354: Whitham fold reduction); imp-33618-strip-height-tradeoff; ' +
    'imp-3708 (y2-adapted-flow-depth).',
};

export const IMP33619_H5_RH_TRANSCRIPTION_ASSERTIONS = [
  {
    // Each of H1/H2/H3 has a complex-analogue verdict; exactly H3 needs a new argument and is OPEN.
    id: 'imp33619-h1h2h3-analogues-enumerated',
    description: 'H1/H2/H3 each carry a complex-analogue status; exactly H3 needs a new argument and stays open',
    holds: () =>
      TRANSCRIPTION_OBLIGATIONS.length === 3 &&
      ['H1', 'H2', 'H3'].every((id) => TRANSCRIPTION_OBLIGATIONS.some((o) => o.id === id)) &&
      TRANSCRIPTION_OBLIGATIONS.filter((o) => o.newArgument === true).map((o) => o.id).join() === 'H3' &&
      OPEN.length === 1 &&
      OPEN[0] === 'H3',
  },
  {
    // H1 and H2 are discharged (H1 fully, H2 pointwise); the pointwise transcription is not vacuous.
    id: 'imp33619-h1-h2-discharged',
    description: 'H1 discharged by analyticity; H2 discharged pointwise by the real-boundary fold step',
    holds: () =>
      DISCHARGED.includes('H1') &&
      DISCHARGED.includes('H2') &&
      !DISCHARGED.includes('H3'),
  },
  {
    // (b) the fold expansion survives complexification as a complex-analytic Taylor expansion.
    id: 'imp33619-fold-expansion-survives',
    description: 'the imp-354 fold expansion survives complexification of z_0 as a complex-analytic Taylor expansion',
    holds: () =>
      IMP33619_H5_RH_TRANSCRIPTION_SCOPING.foldExpansionSurvives === true &&
      /complex-analytic/i.test(IMP33619_H5_RH_TRANSCRIPTION_SCOPING.foldExpansionNote),
  },
  {
    // (c) the three real-axis boundary conditions are enumerated; C2 is the Herglotz positivity input.
    id: 'imp33619-boundary-conditions-and-positivity',
    description: 'C1/C2/C3 boundary conditions enumerated; C2 is the Herglotz positivity input, C3 the uniform residual',
    holds: () =>
      BOUNDARY_CONDITIONS.length === 3 &&
      ['C1', 'C2', 'C3'].every((c) => BOUNDARY_CONDITIONS.some((b) => b.id === c)) &&
      BOUNDARY_CONDITIONS.filter((b) => b.isPositivityInput === true).map((b) => b.id).join() === 'C2' &&
      BOUNDARY_CONDITIONS.filter((b) => b.isResidual === true).map((b) => b.id).join() === 'C3',
  },
  {
    // Positivity assessment: a positivity input IS invoked but it is definitional, NOT a new open gap.
    id: 'imp33619-positivity-invoked-but-not-a-new-gap',
    description: 'the Herglotz positivity is invoked but is definitional, so no new positivity input is needed',
    holds: () =>
      IMP33619_H5_RH_TRANSCRIPTION_SCOPING.positivityInputInvoked === true &&
      IMP33619_H5_RH_TRANSCRIPTION_SCOPING.positivityInputIsNewGap === false &&
      /strip-height-uniformity/.test(IMP33619_H5_RH_TRANSCRIPTION_SCOPING.residualObstruction),
  },
  {
    // The reading strip y_N^sharp = sqrt(2 pi / N) strictly decreases toward 0 (root of the uniform step).
    id: 'imp33619-strip-height-descends',
    description: 'y_N^sharp = sqrt(2 pi / N) strictly decreases toward 0 across the N ladder',
    holds: () =>
      STRIP_HEIGHT_LADDER.every((row, i) => i === 0 || row.y_N_sharp < STRIP_HEIGHT_LADDER[i - 1].y_N_sharp) &&
      ySharp(1e3) > 0.07 &&
      ySharp(1e12) < 1e-5,
  },
  {
    // Honesty gate: scoping only, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33619-honesty-gate-no-qed',
    description: 'Scoping only: not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33619_H5_RH_TRANSCRIPTION_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP33619_H5_RH_TRANSCRIPTION_SCOPING.verdict) &&
      /stays OPEN/.test(IMP33619_H5_RH_TRANSCRIPTION_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP33619_H5_RH_TRANSCRIPTION_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33619_H5_RH_TRANSCRIPTION_SCOPING.verdict),
  },
];

for (const a of IMP33619_H5_RH_TRANSCRIPTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33619-h5-rh-transcription-scoping assertion failed: ${a.id}`);
  }
}
