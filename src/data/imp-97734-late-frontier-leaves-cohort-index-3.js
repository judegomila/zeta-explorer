/**
 * @module imp-97734-late-frontier-leaves-cohort-index-3
 * @fileoverview imp-97734 -- META cross-reference index grouping the eleven late-frontier leaves
 *   (imp-97700, imp-97701, imp-97702, imp-97703, imp-97704, imp-97705, imp-97706, imp-97708,
 *   imp-97709, imp-97710, imp-97711) into their parent programs -- Route-M deep-ladder/sign-structure,
 *   sigma far-tail structure, DIAG3 stencil refinement, MCM kernel-precision cap, w_lin half-order,
 *   and E_GEXP analytic crossing -- with each leaf's one-line verdict, extending the imp-97674 index
 *   that stops at imp-97647. Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE ROUTE-M DEEP-LADDER & SIGN-STRUCTURE SUB-COHORT (three tickets, the gap-law deep ladder and
 *   the Bettin-Conrey reflection-weight / cancellation-sign structure).
 *     imp-97706 -- extends the dps=30 Route-M MCM gap-law residual ladder deeper: the sign-change of
 *       the local decay slope RECURS (8 negative-slope rungs, not the single imp-97659 rung), the
 *       bootstrap exponent band narrows ([8.2,11.0] -> [9.80,11.22]), and every resample stays > 3;
 *       MCM stays refuted from omega=11.
 *     imp-97701 -- attempts both available routes to pin the imp-97617 reflection weight W_refl and
 *       tests the imp-97681 cap; BOTH routes fail cleanly for two distinct reasons, and the cap test
 *       is non-discriminating -- W_refl stays uncomputed, converted into a precise two-part obstruction.
 *     imp-97709 -- measures the SIGN of the two imp-97597 kappa_smooth = (pi/2)[P2 - L2] terms:
 *       gamma_1 = -0.0728158454836767 < 0 flips the written minus into a REINFORCEMENT for
 *       same-signed normalisations; the imp-97663 cap |kappaK_period| <= 3.87e-3 is sharp under
 *       reinforcement and loosens by at most 2x (7.74e-3) under bounded-pole cancellation.
 *
 *   THE SIGMA FAR-TAIL STRUCTURE SUB-COHORT (two tickets, the post-peak decay-exponent residual and
 *   the ramp-acceleration knee, both properties of sigma(N) = E_coll/E(N) at large N).
 *     imp-97702 -- decides the FUNCTIONAL FORM of the imp-33582/imp-97404 residual (1/2 - exponent):
 *       it splits EXACTLY as (1/2)sigma + a(1-sigma) with a = (1/2) d ln(log T0)/d ln N, reproducing
 *       the pointwise residual to < 2e-5; the power-law piece falls ~N^-1/2 per decade while the log
 *       piece stays nearly flat.
 *     imp-97708 -- decides whether the imp-33701/imp-33721 knee readings (a decade apart) reconcile:
 *       a bracket-free pointwise curvature test pins log10 N* = 9.5291 (N* = 3.381e9), invariant to
 *       stencil and bracket width W in {0.1..0.3} (max deviation ~0.0008); the imp-33701 whole-decade
 *       reading is pure resolution loss (the sub-decade crossing vanishes for W >= 0.4).
 *
 *   THE DIAG3 STENCIL REFINEMENT SUB-COHORT (two tickets, cross-checking the imp-97689 three-axis
 *   additivity identity with finite-difference probes at higher order and at a fourth landmark).
 *     imp-97703 -- re-measures DIAG3 = E_CC + E_ET + E_CF with a direct finite-difference probe on the
 *       three amplitude axes: the 3-point residual reproduces the imp-97644 SUM3 exactly and quarters
 *       with eps (textbook O(eps^2) truncation); the 5-point O(eps^4) stencil cures it to the ~1e-12
 *       IEEE-double floor at all three imp-97520 landmarks.
 *     imp-97710 -- cross-validates the imp-97689 additivity derivation at a FOURTH, far-downslope
 *       landmark L5 (sigma = 0.02, N ~ 1.08e13): the closed-form amplitude-partial sum and the
 *       reconstructed elasticity sum stay machine-zero, and the reconstructed E_CC/E_ET reproduce a
 *       direct single-axis measurement to < 1e-8 relative.
 *
 *   THE MCM KERNEL-PRECISION CAP SUB-COHORT (one ticket, extending the imp-97685 divisor-cap analysis
 *   to kernel evaluation precision).
 *     imp-97704 -- confirms the noise ratio scales as d^4 (log-corrected), the cancellation model; a
 *       dps=30 kernel evaluation extends the trustworthy divisor cap by ~3200x (~1e3 -> few x 1e6);
 *       the extended cap moves neither the omega=10 ordering nor the +7.52e-5 gap.
 *
 *   THE W_LIN HALF-ORDER SUB-COHORT (one ticket, a third phase-window half-order cross-check).
 *     imp-97705 -- re-measures the w(x)-w_lin(x) residual at half=400 (plus half=100): the
 *       denominator-INDEPENDENCE found at half=200 is genuine at every half-order, not a fixed-half
 *       artifact; the residual VALUE itself drifts with the half (a window-average effect); the
 *       imp-97597 RESULT 3 mixed-kernel sub-gap STANDS.
 *
 *   THE E_GEXP ANALYTIC CROSSING SUB-COHORT (two tickets, isolating and then confirming the
 *   bisection-quantization noise floor found in the imp-97686 E_GEXP identity).
 *     imp-97700 -- shows the floor is a finite-difference-of-quantized-root artifact (the double-ULP
 *       of the bisected crossing divided by the tiny elasticity), NOT the bisection tolerance; an
 *       exact implicit-differentiation ratio confirms E_GEXP = TC_A1_TRAP * E_CF EXACTLY (to ~1 ULP)
 *       at every imp-97520 landmark, free of both noise sources.
 *     imp-97711 -- extends the L2 central-difference stencil to 7-point O(eps^6): the residual is
 *       ALREADY at the arithmetic-noise floor at the 5-point level (the 7-point rule improves it only
 *       ~1.26x versus the 3->5 step's ~4.3x, with the improvement factor scattering erratically
 *       9.34/1.26/0.85/0.31 across an eps-scan and sometimes making it worse) -- not still truncation.
 *
 *   WHY GROUP THESE (not re-derive). All eleven are late-frontier leaves committed in immediate
 *   succession that read, on their own, as an undifferentiated batch continuing past the imp-97674
 *   index's stopping point (imp-97647). Grouped by parent program, the Route-M pair/trio settle the
 *   deep-ladder recurrence and the reflection/cancellation sign structure, the sigma pair settle the
 *   far-tail residual functional form and the knee location, the DIAG3 pair confirm the additivity
 *   identity survives a finite-difference probe and a fourth landmark, the MCM leaf extends the
 *   trustworthy divisor cap without moving the omega=10 gap, the w_lin leaf confirms the
 *   denominator-independence fixed point, and the E_GEXP pair isolate and then confirm the
 *   bisection-quantization noise floor is not truncation. This index bakes that split so a future
 *   scout can find, at a glance, which of the six groups each leaf belongs to.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already committed).
 *   - Route-M deep-ladder sign-change recurs (8 rungs, not 1); bootstrap band narrows to [9.80,11.22];
 *     MCM refuted from omega=11 unchanged (imp-97706).
 *   - W_refl pinning: both routes fail, cap test non-discriminating, W_refl stays uncomputed (imp-97701).
 *   - kappa_smooth sign structure: gamma_1 < 0 forces reinforcement; imp-97663 cap sharp, loosens at
 *     most 2x under bounded-pole cancellation (imp-97709).
 *   - sigma far-tail residual splits exactly as (1/2)sigma + a(1-sigma), reproducing it to < 2e-5 (imp-97702).
 *   - sigma knee is bracket-robust at log10 N* = 9.5291; the whole-decade reading is resolution loss (imp-97708).
 *   - DIAG3 finite-difference probe reproduces the SUM3 truncation tail exactly and is cured to the
 *     IEEE floor by a 5-point stencil (imp-97703).
 *   - DIAG3 additivity cross-validated at a fourth, far-downslope landmark to < 1e-8 relative (imp-97710).
 *   - MCM kernel-precision cap extends ~3200x under dps=30 without moving the omega=10 gap (imp-97704).
 *   - w_lin denominator-independence is genuine at every half-order tested; imp-97597 RESULT 3 stands (imp-97705).
 *   - E_GEXP identity confirmed EXACT (~1 ULP) by implicit differentiation, isolating the floor as
 *     root-quantization, not bisection tolerance (imp-97700).
 *   - E_GEXP L2 residual is at the 5-point noise floor already; the 7-point stencil does not
 *     systematically improve it (imp-97711).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - W_refl, kappaK_period, and kappa_smooth stay unpinned; no coefficient newly fixed anywhere in
 *     this batch.
 *   - MCM stays verified-not-proved; onset stays omega=11, unchanged by the extended kernel-precision cap.
 *   - the w_lin linear coefficient stays isolated only to ~6e-3, not pinned to -1/pi; the imp-97597
 *     RESULT 3 mixed-kernel sub-gap STANDS.
 *   - no interval-rigorous certified reach moves; certified reach stays EXACTLY 2a<=0.96.
 *
 *   STATUS: a grouping/index note over eleven already-completed tickets, not a new derivation. No
 *   bound changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED.
 *   Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-97706-route-m-deep-ladder-extension.js (deep-ladder sign-change recurrence; bootstrap band narrows)
 * @see imp-97701-route-m-bc-reflection-weight-pinning-obstruction.js (both W_refl pinning routes fail)
 * @see imp-97709-route-m-bc-cancellation-sign-structure.js (kappa_smooth sign structure; reinforcement not cancellation)
 * @see imp-97702-sigma-fartail-exponent-residual-half-loglaw.js (exact power-law/log split of the far-tail residual)
 * @see imp-97708-sigma-knee-bracket-width-sensitivity.js (bracket-robust knee at log10 N*=9.5291)
 * @see imp-97703-diag3-5point-stencil-refine.js (finite-difference DIAG3 probe cured by a 5-point stencil)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation.js (DIAG3 additivity at a fourth, far-downslope landmark)
 * @see imp-97704-mcm-kernel-precision-cap-scaling.js (dps=30 kernel precision extends the trustworthy cap ~3200x)
 * @see imp-97705-wlin-residual-halforder-refinement.js (denominator-independence genuine at every half-order)
 * @see imp-97700-gexp-identity-analytic-crossing.js (implicit-differentiation confirms E_GEXP identity exactly)
 * @see imp-97711-gexp-l2-7point-noise-floor.js (L2 residual already at the 5-point noise floor)
 * @see imp-97674-late-frontier-leaves-cohort-index-2.js (predecessor meta index: imp-97640..97647)
 *
 * Ticket: imp-97734 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- reference constant carried from the predecessor index

const ROUTE_M_DEEP_LADDER_SIGN_STRUCTURE_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97706',
    step: 'extend the dps=30 Route-M MCM gap-law residual deep ladder and re-test the sign-change recurrence',
    result:
      'the local decay-slope sign-change RECURS (8 negative-slope rungs on the combined ladder, not the ' +
      'single imp-97659 rung); the bootstrap exponent band narrows [8.2,11.0] -> [9.80,11.22]; every ' +
      'resample still exceeds 3; MCM stays refuted from omega=11.',
  }),
  Object.freeze({
    id: 'imp-97701',
    step: 'try both available routes to pin the imp-97617 reflection weight W_refl and test the imp-97681 cap',
    result:
      'BOTH routes fail cleanly for two distinct, now-explicit reasons, and the cap consistency test is ' +
      'non-discriminating; W_refl stays uncomputed, converted into a precise two-part obstruction.',
  }),
  Object.freeze({
    id: 'imp-97709',
    step: 'measure the sign structure of the two imp-97597 kappa_smooth = (pi/2)[P2 - L2] contributing terms',
    result:
      'gamma_1 = -0.0728158454836767 < 0 flips the written minus into a REINFORCEMENT for same-signed ' +
      'normalisations; the imp-97663 cap |kappaK_period| <= 3.87e-3 is SHARP under reinforcement and ' +
      'loosens by at most 2x (7.74e-3) under bounded-pole cancellation; the measured sign-swing is a ' +
      'windowing artifact, not the analytic sign.',
  }),
]);

const SIGMA_FARTAIL_STRUCTURE_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97702',
    step: 'decide the functional form of the imp-33582/imp-97404 post-peak decay-exponent residual (1/2 - exponent)',
    result:
      'splits EXACTLY as (1/2)sigma + a(1-sigma), a = (1/2) d ln(log T0)/d ln N, reproducing the ' +
      'pointwise residual to < 2e-5; the power-law piece (1/2)sigma falls ~N^-1/2 per decade while the ' +
      'log piece stays nearly flat -- a genuine two-piece law, not a single asymptotic.',
  }),
  Object.freeze({
    id: 'imp-97708',
    step: 'decide whether the imp-33701 (whole-decade) and imp-33721 (quarter-decade) knee readings, a decade apart, reconcile',
    result:
      'a bracket-free pointwise ramp-curvature test pins log10 N* = 9.5291 (N* = 3.381e9), invariant to ' +
      'the differencing stencil and to bracket width W in {0.1..0.3} (max deviation ~0.0008); the ' +
      'imp-33701 whole-decade reading is pure resolution loss (the sub-decade crossing vanishes for W >= 0.4).',
  }),
]);

const DIAG3_STENCIL_REFINEMENT_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97703',
    step: 're-measure DIAG3 = E_CC + E_ET + E_CF with a direct finite-difference probe on the three amplitude axes',
    result:
      'the 3-point O(eps^2) value reproduces the imp-97644 SUM3 residual exactly (+3.282e-7 at L2 down ' +
      'to +5.684e-11 at L4) and quarters when eps halves -- textbook truncation, not a real additivity ' +
      'residual; the 5-point O(eps^4) stencil cures it to the ~1e-12 IEEE-double floor at all three ' +
      'imp-97520 landmarks.',
  }),
  Object.freeze({
    id: 'imp-97710',
    step: 'cross-validate the imp-97689 three-axis additivity derivation at a fourth, far-downslope landmark L5 (sigma=0.02)',
    result:
      'at L5 (N ~ 1.08e13, ~34x past L4) the closed-form amplitude-partial sum and the reconstructed ' +
      'elasticity sum both stay machine-zero, and the reconstructed E_CC/E_ET reproduce a direct ' +
      'single-axis central-difference measurement to < 1e-8 relative.',
  }),
]);

const MCM_KERNEL_PRECISION_CAP_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97704',
    step: 'test whether raising the kernel evaluation precision (dps=30 vs IEEE-double) extends the exact-Rexact divisor cap',
    result:
      'confirms the cancellation model (noise ratio scales as d^4, log-corrected); a dps=30 kernel ' +
      'evaluation extends the trustworthy cap by ~3200x (~1e3 -> a few x 1e6); the extended cap moves ' +
      'neither the omega=10 ordering nor the +7.520579e-5 gap.',
  }),
]);

const WLIN_HALF_ORDER_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97705',
    step: 're-measure the w(x)-w_lin(x) node-by-node residual at a third phase-window half-order (400, plus 100)',
    result:
      'the denominator-INDEPENDENCE found at half=200 is a genuine feature at every half-order tested, ' +
      'not a fixed-half artifact; the residual VALUE itself drifts monotonically with the half (a ' +
      'window-average effect); the imp-97597 RESULT 3 mixed-kernel sub-gap STANDS.',
  }),
]);

const EGEXP_ANALYTIC_CROSSING_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97700',
    step: 'isolate whether the imp-97686 E_GEXP identity floor is set by the bisection tolerance or by root quantization',
    result:
      'the floor is a finite-difference-of-quantized-root artifact (double-ULP of the bisected crossing ' +
      'divided by the tiny elasticity), not the bisection budget; an exact implicit-differentiation ' +
      'ratio confirms E_GEXP = TC_A1_TRAP * E_CF EXACTLY (to ~1 ULP) at every imp-97520 landmark.',
  }),
  Object.freeze({
    id: 'imp-97711',
    step: 'extend the L2 central-difference stencil for the E_GEXP identity to 7-point O(eps^6)',
    result:
      'the L2 residual is ALREADY at the arithmetic-noise floor at the 5-point level: the 7-point rule ' +
      'improves the primary residual only ~1.26x (versus the 3->5 step’s ~4.3x), and the 5->7 ' +
      'improvement factor scatters erratically (9.34/1.26/0.85/0.31) across an eps-scan, sometimes making ' +
      'it worse -- not still truncation-limited.',
  }),
]);

export const IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3 = Object.freeze({
  id: 'imp-97734',
  proofSection: 'S-frontier',
  routeMCohort: ROUTE_M_DEEP_LADDER_SIGN_STRUCTURE_SUBCOHORT,
  sigmaCohort: SIGMA_FARTAIL_STRUCTURE_SUBCOHORT,
  diag3Cohort: DIAG3_STENCIL_REFINEMENT_SUBCOHORT,
  mcmCohort: MCM_KERNEL_PRECISION_CAP_SUBCOHORT,
  wLinCohort: WLIN_HALF_ORDER_SUBCOHORT,
  eGexpCohort: EGEXP_ANALYTIC_CROSSING_SUBCOHORT,
  measuredSignal:
    'eleven late-frontier measurement/derivation leaves (imp-97700/97701/97702/97703/97704/97705/' +
    '97706/97708/97709/97710/97711), grouped by parent program: three Route-M deep-ladder/sign-' +
    'structure leaves, two sigma far-tail structure leaves, two DIAG3 stencil-refinement leaves, one ' +
    'MCM kernel-precision-cap leaf, one w_lin half-order leaf, and two E_GEXP analytic-crossing leaves.',
  namedResiduals: [
    'IMP97706_ROUTEM_SIGNCHANGE_RECURS_NOT_ONEOFF',
    'IMP97701_WREFL_PINNING_OBSTRUCTED_BOTH_ROUTES',
    'IMP97709_KAPPASMOOTH_SIGN_IS_REINFORCEMENT',
    'IMP97702_SIGMA_FARTAIL_RESIDUAL_EXACT_TWOPIECE_SPLIT',
    'IMP97708_SIGMA_KNEE_BRACKET_ROBUST_AT_9P5291',
    'IMP97703_DIAG3_FINITEDIFF_PROBE_CURED_BY_5POINT',
    'IMP97710_DIAG3_ADDITIVITY_HOLDS_AT_FOURTH_LANDMARK',
    'IMP97704_MCM_KERNEL_PRECISION_CAP_EXTENDS_3200X',
    'IMP97705_WLIN_DENOM_INDEPENDENCE_GENUINE_EVERY_HALF',
    'IMP97700_EGEXP_IDENTITY_EXACT_VIA_IMPLICIT_DIFF',
    'IMP97711_EGEXP_L2_AT_5POINT_NOISE_FLOOR',
  ],
  certifiedReach: 0.96,
  routeM97706BootstrapBandLow: 9.80,
  routeM97706BootstrapBandHigh: 11.22,
  routeM97706SignChangeRungCount: 8,
  routeM97709Gamma1: -0.0728158454836767,
  routeM97709CapSharp: 3.87e-3,
  routeM97709CapMaxLoosened: 7.74e-3,
  sigma97708KneeLog10NStar: 9.5291,
  diag3_97703FivePointFloor: 1e-12,
  mcm97704CapExtensionFactor: 3200,
  mcm97704OnsetOmega: 11,
  wLin97705Result3SubGapStands: true,
  eGexp97700IdentityExact: true,
  eGexp97711L2AtFivePointFloor: true,
  lowerBoundOnLambda2Proved: false,
  coercivityConstantProved: false,
  mcmProved: false,
  wRefLPinned: false,
  kappaSmoothPinned: false,
  anyBoundMoved: false,
  question:
    'The eleven late-frontier leaves imp-97700/97701/97702/97703/97704/97705/97706/97708/97709/97710/' +
    '97711, committed after the imp-97674 index stopped at imp-97647, read as an undifferentiated ' +
    'batch. Split by program -- Route-M deep-ladder/sign-structure (imp-97701/97706/97709) versus ' +
    'sigma far-tail structure (imp-97702/97708) versus DIAG3 stencil refinement (imp-97703/97710) ' +
    'versus MCM kernel-precision cap (imp-97704) versus w_lin half-order (imp-97705) versus E_GEXP ' +
    'analytic crossing (imp-97700/97711) -- does each group settle a distinct question with a distinct ' +
    'verdict, and does none move any bound?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The Route-M trio (imp-97701/97706/97709) extends the ' +
    'deep gap-law ladder (sign-change recurs, not one-off), fails to pin the reflection weight W_refl ' +
    'by either available route, and pins the kappa_smooth sign structure as reinforcement (sharp cap, ' +
    'at most 2x looser under cancellation). The sigma pair (imp-97702/97708) settles the far-tail ' +
    'residual as an exact two-piece power-law/log split and pins the ramp-acceleration knee as ' +
    'bracket-robust at log10 N*=9.5291, reconciling the two prior decade-apart readings as resolution ' +
    'loss. The DIAG3 pair (imp-97703/97710) confirms the three-axis additivity identity survives both a ' +
    'direct finite-difference probe (cured to the IEEE floor by a 5-point stencil) and a fourth, ' +
    'far-downslope landmark. The MCM leaf (imp-97704) extends the trustworthy kernel-precision cap ' +
    '~3200x without moving the omega=10 gap. The w_lin leaf (imp-97705) confirms the denominator-' +
    'independence fixed point is genuine at every half-order tested. The E_GEXP pair (imp-97700/97711) ' +
    'isolates the identity noise floor as root-quantization (not bisection tolerance) and confirms the ' +
    'L2 residual is already at the 5-point noise floor. No bound moves in any group: interval-rigorous ' +
    'certified reach stays EXACTLY 2a<=0.96, MCM stays verified-not-proved with onset unchanged at ' +
    'omega=11, and no coefficient (W_refl, kappaK_period, kappa_smooth, the w_lin linear coefficient) is ' +
    'newly pinned. RH open; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97706 (deep-ladder sign-change recurrence); imp-97701 (W_refl pinning obstruction); ' +
    'imp-97709 (kappa_smooth reinforcement sign structure); imp-97702 (far-tail residual two-piece ' +
    'split); imp-97708 (bracket-robust knee at 9.5291); imp-97703 (DIAG3 finite-difference probe cured ' +
    'by 5-point stencil); imp-97710 (DIAG3 additivity at a fourth landmark); imp-97704 (kernel-precision ' +
    'cap extension); imp-97705 (w_lin denominator-independence at every half); imp-97700 (E_GEXP ' +
    'identity exact via implicit differentiation); imp-97711 (E_GEXP L2 at the 5-point noise floor).',
  ln3: LN3,
});

export default IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3_ASSERTIONS = [
  {
    id: 'imp97734-routeM-subcohort-has-all-three-members',
    why: 'The Route-M split must contain exactly the three deep-ladder/sign-structure leaves; a ' +
      'missing member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.routeMCohort.map((c) => c.id);
      return (
        ids.length === 3 &&
        ids.includes('imp-97701') &&
        ids.includes('imp-97706') &&
        ids.includes('imp-97709')
      );
    },
  },
  {
    id: 'imp97734-sigma-subcohort-has-both-members',
    why: 'The sigma far-tail-structure split must contain exactly the residual-form and knee leaves.',
    holds: () => {
      const ids = IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.sigmaCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97702') && ids.includes('imp-97708');
    },
  },
  {
    id: 'imp97734-diag3-subcohort-has-both-members',
    why: 'The DIAG3 stencil-refinement split must contain exactly the finite-difference and ' +
      'fourth-landmark leaves.',
    holds: () => {
      const ids = IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.diag3Cohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97703') && ids.includes('imp-97710');
    },
  },
  {
    id: 'imp97734-mcm-and-wlin-subcohorts-have-their-one-member',
    why: 'The MCM kernel-precision-cap split and the w_lin half-order split must each contain ' +
      'exactly their one leaf, not overlap the other groups.',
    holds: () => {
      const idx = IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3;
      const mcmIds = idx.mcmCohort.map((c) => c.id);
      const wLinIds = idx.wLinCohort.map((c) => c.id);
      return (
        mcmIds.length === 1 &&
        mcmIds.includes('imp-97704') &&
        wLinIds.length === 1 &&
        wLinIds.includes('imp-97705')
      );
    },
  },
  {
    id: 'imp97734-egexp-subcohort-has-both-members',
    why: 'The E_GEXP analytic-crossing split must contain exactly the implicit-differentiation and ' +
      '7-point-stencil leaves.',
    holds: () => {
      const ids = IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.eGexpCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97700') && ids.includes('imp-97711');
    },
  },
  {
    id: 'imp97734-eleven-tickets-total-no-overlap',
    why: 'The index covers exactly eleven tickets split into six disjoint groups; an overlap or a ' +
      'dropped ticket would misreport the batch.',
    holds: () => {
      const idx = IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3;
      const allIds = [
        ...idx.routeMCohort.map((c) => c.id),
        ...idx.sigmaCohort.map((c) => c.id),
        ...idx.diag3Cohort.map((c) => c.id),
        ...idx.mcmCohort.map((c) => c.id),
        ...idx.wLinCohort.map((c) => c.id),
        ...idx.eGexpCohort.map((c) => c.id),
      ];
      const noOverlap = new Set(allIds).size === allIds.length;
      return (
        allIds.length === 11 &&
        noOverlap &&
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 11
      );
    },
  },
  {
    id: 'imp97734-routeM97706-bootstrap-band-narrows',
    why: 'imp-97706 established the bootstrap exponent band narrows on the deeper ladder; the index ' +
      'must not misreport the direction or bounds.',
    holds: () => {
      const idx = IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3;
      const oldWidth = 11.0 - 8.2;
      const newWidth = idx.routeM97706BootstrapBandHigh - idx.routeM97706BootstrapBandLow;
      return (
        idx.routeM97706BootstrapBandHigh > idx.routeM97706BootstrapBandLow &&
        newWidth < oldWidth &&
        idx.routeM97706SignChangeRungCount === 8
      );
    },
  },
  {
    id: 'imp97734-routeM97709-gamma1-negative-and-cap-bounds-ordered',
    why: 'imp-97709 established gamma_1 < 0 (the reinforcement sign) and that the cap loosens by at ' +
      'most 2x, not further; the index must not misreport either.',
    holds: () => {
      const idx = IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3;
      return (
        idx.routeM97709Gamma1 < 0 &&
        idx.routeM97709CapMaxLoosened > idx.routeM97709CapSharp &&
        Math.abs(idx.routeM97709CapMaxLoosened / idx.routeM97709CapSharp - 2) < 0.01
      );
    },
  },
  {
    id: 'imp97734-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.anyBoundMoved === false &&
      IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.certifiedReach === 0.96 &&
      IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.certifiedReach < IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.ln3 &&
      /NO QED/.test(IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.verdict) &&
      /remains SOTA/.test(IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.verdict) &&
      /2a<=0\.96/.test(IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.verdict),
  },
];

for (const assertion of IMP97734_LATE_FRONTIER_LEAVES_COHORT_INDEX_3_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97734-late-frontier-leaves-cohort-index-3 assertion failed: ${assertion.id}`,
    );
  }
}
