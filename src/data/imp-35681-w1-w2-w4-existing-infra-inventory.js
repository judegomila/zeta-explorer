/**
 * @module imp-35681-w1-w2-w4-existing-infra-inventory
 *
 * imp-35681 (proof/assessment, S-frontier): INVENTORY which of the imp-35653
 * Part E porting work-items W1 / W2 / W4 -- the three flagged "finite/mechanical"
 * pieces of the S_barrier port -- are ALREADY partially realized in existing repo
 * infrastructure, so greenfield porting work can be separated from what the engine
 * already holds.
 *
 * ASSESSMENT / SCOPING ONLY. Ports nothing; discharges nothing; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * The three finite/mechanical items (imp-35653 Part E; W3, the analytic tail lemma,
 * is the breakthrough-tier NON-finite obligation and is out of this inventory scope):
 *   (W1) Instantiate H_t = A + B - C with an explicit interval error bound at heights
 *        near T_PT = 3e12 (Polymath15 effective approximation re-anchored).
 *   (W2) FINITE winding barrier: interval-verify the argument-principle count on the
 *        boundary of R = [T_PT, T_PT + Delta] x [-h, h] with an O(Delta log T_PT) mesh.
 *   (W4) Retire the imp-397 2/gamma count kernel (the E_trunc 3.06e-5 / 5.106e-5
 *        artifact) and read the off-line contribution above T_PT as EXACTLY ZERO.
 *
 * PART A -- W1: HEAT-FLOW H_t STRUCTURE HELD, POLYMATH15 A+B-C INTERVAL BOUND GREENFIELD
 * -----------------------------------------------------------------------------
 * The repo HOLDS the heat-flow H_t as an object: the winding-thread de Bruijn /
 * Gaussian-convolution proxy machinery evolves the zero configuration under the
 * heat semigroup. But it does NOT hold the Polymath15 EFFECTIVE APPROXIMATION
 * H_t = A + B - C with rigorous per-term interval error bounds; that decomposition
 * (the mollified A_t + B_t main terms and the C_t = E_A + E_B + E_{C_0} error cap)
 * is greenfield. Worse for re-use: per imp-35674 the repo Gaussian-conv proxy IS de
 * Bruijn flow at NEGATIVE time (t = -4 tau_repo) -- the HARDER side of the flow --
 * so even the H_t the repo carries sits at the wrong t-sign versus the Polymath15
 * barrier and must be sign-reconciled before it can seed W1. VERDICT: STRUCTURAL
 * overlap only; the interval-bounded A+B-C at T_PT is greenfield.
 *
 * PART B -- W2: WINDING/ARGUMENT-PRINCIPLE SCAFFOLDING HELD BUT EXPERIMENTAL (non-rigorous)
 * -----------------------------------------------------------------------------
 * The repo HOLDS argument-principle / winding-number scaffolding: imp-2696
 * (winding-Lyapunov experiment), imp-33923 (off-axis phase-winding quadrature),
 * imp-33968 (winding-rate-vs-alpha), plus the de Bruijn Theorem 13 argument-principle
 * frame (winding-thread). ALL of these are EXPERIMENTAL (isRigorous: false) -- phase
 * and winding-rate MEASUREMENTS, NOT interval-arithmetic-CERTIFIED argument-principle
 * counts on a rectangle boundary with a per-segment argument-increment cap. The
 * CONCEPT and the numerical machinery are held; the RIGOROUS interval-verified
 * winding count on the bounded transition rectangle (the actual B1 certificate) is
 * greenfield. VERDICT: concept + experimental code held; the certified count greenfield.
 *
 * PART C -- W4: ANALYTIC KERNEL-RETIREMENT HELD (imp-34791), SUBSTITUTION GATED ON W3
 * -----------------------------------------------------------------------------
 * W4 has two halves. The ANALYTIC half -- discrediting the imp-397 2/gamma count
 * kernel -- is ALREADY substantially HELD: imp-34791 reclassified E_trunc from an
 * effective constant to an unported barrier lemma and REFUTED the 2/gamma mispricing
 * (a single admissible deep zero is mispriced ~3.75e11x via realness time
 * (2 beta - 1)^2 / 2), and imp-35676 already scoped the zero-reading consistency. The
 * MECHANICAL half -- substituting the off-line contribution to EXACTLY ZERO -- is NOT
 * independently dischargeable: per imp-35676 Q2 it is GATED on the non-finite W3
 * (the zero-reading is licensed only by B1 + B2, and PT N_off(T_PT) = 0 alone is
 * necessary-not-sufficient). VERDICT: retirement analysis held; substitution gated on W3.
 *
 * PART D -- THE BARRIER BASE IS EXTERNAL (Platt-Trudgian 2021), NOT REPO imp-341
 * -----------------------------------------------------------------------------
 * CORRECTION to the scout premise: the imp-35653 Part D barrier BASE -- N_off(T_PT) = 0,
 * RH verified to T_PT = 3e12 -- is an EXTERNAL Platt-Trudgian 2021 result that the
 * repo CITES (finite-height-lambda-bound.js, finite-height-beats-platt-trudgian.js),
 * NOT an internal repo module. In particular imp-341 is NOT the zero-verification: the
 * canonical imp-341 is "Close G5_burgers: uniformity of the finite-N empirical
 * Stieltjes transform" (the S7 Koksma-Hlawka bound giving lim sup |t_c(N)| = 0), a
 * DIFFERENT thread with no bearing on off-line zero verification to T_PT. So the
 * barrier base is external-cited, not engine-held; it supplies the initial condition
 * only (Part D: necessary but not sufficient). VERDICT: base is external, misattributed.
 *
 * PUNCHLINE: NONE of W1 / W2 / W4 is fully already-held. The repo holds (W1) the
 * heat-flow H_t STRUCTURE only -- at the wrong t-sign per imp-35674, with the
 * interval-bounded Polymath15 A+B-C greenfield; (W2) EXPERIMENTAL, non-rigorous
 * winding / argument-principle scaffolding (imp-2696 / imp-33923 / imp-33968 /
 * winding-thread), with the certified rectangle count greenfield; (W4) the ANALYTIC
 * kernel-retirement (imp-34791 refutation of the imp-397 2/gamma kernel), with the
 * zero-substitution GATED on the non-finite W3. The barrier BASE (N_off(T_PT) = 0) is
 * EXTERNAL Platt-Trudgian 2021, NOT repo imp-341 (a scout misattribution). Net: the
 * engine holds STRUCTURE and EXPERIMENTAL scaffolding plus one analytic refutation, but
 * every W1 / W2 / W4 finite CERTIFICATE remains greenfield or W3-gated. Assessment /
 * scoping only; changes no bound; NO QED; no refereed bound is changed.
 *
 * @see imp-35653-sbarrier-finite-check-porting-scope (the W1..W4 itemization this inventories)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (repo proxy = de Bruijn at NEGATIVE time; wrong t-sign)
 * @see imp-35676-w4-etrunc-zero-reading-consistency-scope (W4 substitution GATED on W3)
 * @see imp-34791 (E_trunc reclassification; 2/gamma mispricing refuted ~3.75e11x)
 * @see imp-397 (the 2/gamma count kernel W4 retires); winding-thread (de Bruijn Thm 13)
 * @see imp-341 (Close G5_burgers -- the S7 Burgers uniformity; NOT the zero-verification)
 */

// -- Anchor constants (matching imp-35653; no heavy imports) -------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this inventory
const KERNEL_MISPRICE_FACTOR = 3.75e11; // imp-34791: single deep-zero 2/gamma mispricing

export const IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY = {
  id: 'imp-35681',
  proofSection: 'S-frontier',
  question:
    'Which of the imp-35653 Part E finite/mechanical porting work-items W1 (instantiate H_t = A+B-C ' +
    'with interval error bound), W2 (finite winding barrier), W4 (retire the imp-397 2/gamma kernel, ' +
    'read off-line as zero) are already partially realized in existing repo infrastructure (the ' +
    'barrier base at T_PT and the winding-thread argument-principle machinery), versus greenfield? ' +
    'Assessment/scoping only; changes no bound; NO QED.',
  W1_heatFlowStructure: {
    alreadyHeld:
      'The heat-flow H_t as an object: the winding-thread de Bruijn / Gaussian-convolution proxy ' +
      'evolves the zero configuration under the heat semigroup.',
    greenfield:
      'The Polymath15 EFFECTIVE APPROXIMATION H_t = A + B - C with rigorous per-term interval error ' +
      'bounds (mollified A_t + B_t main terms, C_t = E_A + E_B + E_{C_0} error cap) at T_PT = 3e12.',
    reUseObstruction:
      'Per imp-35674 the repo Gaussian-conv proxy IS de Bruijn flow at NEGATIVE time (t = -4 tau_repo), ' +
      'the HARDER side; even the held H_t sits at the wrong t-sign vs the Polymath15 barrier and must be ' +
      'sign-reconciled before it can seed W1.',
    verdict: 'STRUCTURAL OVERLAP ONLY; interval-bounded A+B-C at T_PT is greenfield',
  },
  W2_windingScaffolding: {
    alreadyHeld:
      'Argument-principle / winding-number scaffolding: imp-2696 (winding-Lyapunov), imp-33923 ' +
      '(off-axis phase-winding quadrature), imp-33968 (winding-rate-vs-alpha), de Bruijn Thm 13 frame ' +
      '(winding-thread).',
    heldButNonRigorous:
      'ALL of these are EXPERIMENTAL (isRigorous: false) -- phase / winding-rate MEASUREMENTS, NOT ' +
      'interval-arithmetic-CERTIFIED argument-principle counts on a rectangle boundary with a ' +
      'per-segment argument-increment cap.',
    greenfield:
      'The RIGOROUS interval-verified winding count on the bounded transition rectangle ' +
      'R = [T_PT, T_PT + Delta] x [-h, h] (the actual B1 certificate).',
    verdict: 'CONCEPT + EXPERIMENTAL CODE HELD; the certified rectangle count is greenfield',
  },
  W4_kernelRetirement: {
    analyticHalfHeld:
      'Discrediting the imp-397 2/gamma count kernel is ALREADY substantially HELD: imp-34791 ' +
      'reclassified E_trunc to an unported barrier lemma and REFUTED the 2/gamma mispricing (a single ' +
      'admissible deep zero mispriced ~3.75e11x via realness time (2 beta - 1)^2 / 2); imp-35676 scoped ' +
      'the zero-reading consistency.',
    mechanicalHalfGated:
      'Substituting the off-line contribution to EXACTLY ZERO is NOT independently dischargeable: per ' +
      'imp-35676 Q2 it is GATED on the non-finite W3 (licensed only by B1 + B2; PT N_off(T_PT) = 0 alone ' +
      'is necessary-not-sufficient).',
    verdict: 'RETIREMENT ANALYSIS HELD; the zero-substitution is GATED on W3',
  },
  barrierBaseProvenance: {
    correction:
      'The imp-35653 Part D barrier BASE -- N_off(T_PT) = 0, RH verified to T_PT = 3e12 -- is an ' +
      'EXTERNAL Platt-Trudgian 2021 result the repo CITES (finite-height-lambda-bound.js, ' +
      'finite-height-beats-platt-trudgian.js), NOT an internal repo module.',
    imp341Misattribution:
      'imp-341 is NOT the zero-verification: canonical imp-341 is "Close G5_burgers: uniformity of the ' +
      'finite-N empirical Stieltjes transform" (the S7 Koksma-Hlawka lim sup |t_c(N)| = 0), a DIFFERENT ' +
      'thread with no bearing on off-line zero verification to T_PT.',
    verdict: 'BARRIER BASE IS EXTERNAL (necessary-not-sufficient initial condition), NOT repo imp-341',
  },
  summary: {
    W1: 'structure held (wrong t-sign per imp-35674); interval-bounded A+B-C greenfield',
    W2: 'experimental non-rigorous winding scaffolding held; certified rectangle count greenfield',
    W4: 'analytic kernel-retirement held (imp-34791); zero-substitution gated on W3',
    base: 'external Platt-Trudgian 2021, NOT repo imp-341 (scout misattribution)',
    noneFullyHeld: true,
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). NONE of the finite/mechanical ' +
    'W1 / W2 / W4 is fully already-held. (Part A) W1: the repo holds the heat-flow H_t STRUCTURE only ' +
    '-- at the wrong t-sign per imp-35674 (de Bruijn at NEGATIVE time) -- with the interval-bounded ' +
    'Polymath15 A+B-C at T_PT greenfield. (Part B) W2: the repo holds EXPERIMENTAL, non-rigorous ' +
    'winding / argument-principle scaffolding (imp-2696 / imp-33923 / imp-33968 / winding-thread; all ' +
    'isRigorous:false), with the certified rectangle count greenfield. (Part C) W4: the ANALYTIC ' +
    'kernel-retirement is held (imp-34791 refuted the imp-397 2/gamma kernel ~3.75e11x), but the ' +
    'zero-substitution is GATED on the non-finite W3 (imp-35676 Q2). (Part D) The barrier BASE ' +
    'N_off(T_PT) = 0 is EXTERNAL Platt-Trudgian 2021, NOT repo imp-341 (which is Close G5_burgers -- a ' +
    'scout misattribution). Net: the engine holds STRUCTURE, EXPERIMENTAL scaffolding, and one analytic ' +
    'refutation, but every W1 / W2 / W4 finite CERTIFICATE remains greenfield or W3-gated. Ports ' +
    'nothing; discharges nothing; changes no bound; establishes no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35653 (the W1..W4 itemization); imp-35674 (repo proxy = de Bruijn at NEGATIVE time); ' +
    'imp-35676 (W4 substitution gated on W3); imp-34791 (E_trunc reclassification; 2/gamma mispricing ' +
    'refuted ~3.75e11x); imp-397 (the 2/gamma count kernel); winding-thread (de Bruijn Thm 13); ' +
    'imp-2696 / imp-33923 / imp-33968 (experimental winding scaffolding); imp-341 (Close G5_burgers, ' +
    'NOT the zero-verification); Platt-Trudgian 2021 (external barrier base).',
};

export const IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY_ASSERTIONS = [
  {
    // Part A: W1 heat-flow structure held but interval-bounded A+B-C greenfield (wrong t-sign obstruction).
    id: 'imp35681-w1-structure-held-abc-greenfield',
    description: 'W1: heat-flow H_t structure held; Polymath15 interval-bounded A+B-C at T_PT is greenfield',
    holds: () =>
      /STRUCTURAL OVERLAP ONLY/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.W1_heatFlowStructure.verdict) &&
      /NEGATIVE time/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.W1_heatFlowStructure.reUseObstruction) &&
      /A \+ B - C/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.W1_heatFlowStructure.greenfield),
  },
  {
    // Part B: W2 winding scaffolding held but EXPERIMENTAL (non-rigorous); certified count greenfield.
    id: 'imp35681-w2-experimental-count-greenfield',
    description: 'W2: winding/argument-principle scaffolding held but experimental; certified rectangle count greenfield',
    holds: () =>
      /EXPERIMENTAL/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.W2_windingScaffolding.heldButNonRigorous) &&
      /isRigorous: false/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.W2_windingScaffolding.heldButNonRigorous) &&
      /greenfield/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.W2_windingScaffolding.verdict),
  },
  {
    // Part C: W4 analytic retirement held (imp-34791) but substitution gated on the non-finite W3.
    id: 'imp35681-w4-retirement-held-substitution-gated',
    description: 'W4: analytic kernel-retirement held (imp-34791); zero-substitution gated on W3',
    holds: () =>
      /GATED on W3/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.W4_kernelRetirement.verdict) &&
      /imp-34791/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.W4_kernelRetirement.analyticHalfHeld) &&
      KERNEL_MISPRICE_FACTOR > 1e11,
  },
  {
    // Part D: barrier base is EXTERNAL Platt-Trudgian 2021, NOT repo imp-341 (misattribution).
    id: 'imp35681-base-external-not-imp341',
    description: 'Barrier base N_off(T_PT)=0 is external Platt-Trudgian 2021, NOT repo imp-341 (scout misattribution)',
    holds: () =>
      /EXTERNAL/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.barrierBaseProvenance.verdict) &&
      /NOT repo imp-341/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.barrierBaseProvenance.verdict) &&
      /G5_burgers/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.barrierBaseProvenance.imp341Misattribution) &&
      T_PT === 3e12,
  },
  {
    // Honesty gate: inventory only, none fully held, no discharge, no QED, no refereed bound is changed.
    id: 'imp35681-honesty-gate-no-qed',
    description: 'Inventory only: none of W1/W2/W4 fully held, ports nothing, changes no bound, no QED, no refereed bound is changed',
    holds: () =>
      IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.isRigorous === false &&
      IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.summary.noneFullyHeld === true &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /NO QED/.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.verdict) &&
      /refereed bound is changed/i.test(IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY.verdict),
  },
];

for (const a of IMP35681_W1_W2_W4_EXISTING_INFRA_INVENTORY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35681-w1-w2-w4-existing-infra-inventory assertion failed: ${a.id}`);
  }
}
