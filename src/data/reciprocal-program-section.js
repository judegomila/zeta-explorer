// @module data/reciprocal-program-section
// imp-1200: structured record of Appendices B-G of the user's paper at
// research-inputs/twin_ladder_consolidated_v52.pdf -- the "reciprocal
// program". This module now records the 2026-07-23 skeptical audit: the
// Schoenberg variable must be rotated to 1/X(is), and the finite reciprocal
// constructions below are compact diagnostics, not a global proof route.
//
// PURPOSE
// -------
// A certified negative 5-by-5 Toeplitz minor rules out PF-infinity for the
// actual Riemann kernel. The reciprocal idea must use the rotated entire
// function Xi(z)=X(iz): Schoenberg theory concerns 1/X(is), not 1/X(s).
// The manuscript chain is retained here only with its audited scope:
//
//   App B (reciprocal total positivity):  rotation correction to 1/X(is).
//   App C (reciprocal Mobius ladders):    exact only in Re(s)>1; the printed
//          safe-tail and global finite-mollifier claims are retracted.
//   App D (reciprocal mollifier certs):   the coefficient-optimized finite
//          problem is the Nyman-Beurling distance; a fixed Mobius vector is
//          only a trial residual and upper bound.
//   App E (reciprocal Schur lifts):       two-step no-ghost certificate via a
//          reciprocal model defect + non-circular residual margin.
//   App F (Hardy-corona extremals):       pointwise extremal geometry; a
//          NO-FREE-LUNCH theorem rules out unrestricted Schur lifts.
//   App G (restricted passive lifts):     finite compact-window diagnostics;
//          universal exhaustion remains RH-equivalent.
//
// No finite window, finite Pick matrix, or finite Dirichlet polynomial settles
// RH. Universal certificate termination would itself be RH-equivalent.

export const RECIPROCAL_PROGRAM_SECTION = Object.freeze({
  id: 'reciprocal-program-section',
  ticket: 'imp-1200',
  paperSourcePath: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSections: 'Apps B-G',
  paperPageRange: '67-91',
  generatedAt: '2026-05-28T22:00:00Z',

  title: 'The Reciprocal Program Audit (Apps B-G)',
  oneLine:
    'Audited scope: Schoenberg theory uses the rotated reciprocal 1/X(is), ' +
    'not 1/X(s). The Mobius, Schur-lift, and SOC constructions shown here are ' +
    'compact diagnostics only; they provide no global finite-mollifier gap, ' +
    'automatic tail, or unconditional implication to RH.',

  // ── App B Reciprocal Total Positivity ─────────────────────────────────
  reciprocalTotalPositivity: Object.freeze({
    sectionId: 'App B',
    title: 'Reciprocal Total Positivity: Correcting the Naive Kernel Target',
    pages: '67-71',
    whyDirectFails:
      'Audited no-go: an independently replayed negative 5-by-5 Toeplitz minor ' +
      'for the actual Riemann kernel rules out PF_5 and therefore PF-infinity. ' +
      'Log-concavity proves only PF_2 and cannot be promoted to the missing ' +
      'all-orders certificate.',
    correctReciprocalObject:
      'Rotation correction: put Xi(z)=X(iz)=xi(1/2+iz). RH says that Xi has ' +
      'only real zeros, so Schoenberg theory concerns a reciprocal transform ' +
      'of 1/X(is). The manuscript expression 1/X(s) uses the wrong spectral ' +
      'variable. A real shift before rotation becomes a complex modulation, ' +
      'so a passive realization of 1/X(w+a) does not follow automatically.',
    keyClaimB2:
      'Claim B.2 (direct PF-inf impossibility): there is NO direct ' +
      'total-positivity (PF-infinity) certificate for the tilted Riemann ' +
      'kernel. The naive Schoenberg target is unattainable.',
    keyClaimB3:
      'Claim B.3 (audited rotation): any RH-equivalent reciprocal ' +
      'Schoenberg formulation must be built from 1/X(is), with the transform ' +
      'convention and function class stated. The unrotated 1/X(s) formulation ' +
      'does not supply the claimed passive bridge.',
    verdict:
      'The direct PF-infinity route is excluded. The rotated reciprocal is an ' +
      'RH-equivalent object after a correct setup, not a strict reduction and ' +
      'not an automatic passive realization.',
  }),

  // ── App C Reciprocal Mobius Ladders ───────────────────────────────────
  reciprocalMobiusLadders: Object.freeze({
    sectionId: 'App C',
    title: 'Reciprocal Mobius Ladders: Safe-Half-Plane and Compact Scope',
    pages: '71-74',
    mobiusBridge:
      'The exact Dirichlet expansion 1/zeta(s) = sum mu(n) n^{-s} is valid ' +
      'absolutely only for Re(s) > 1. Its finite truncations are useful ' +
      'Mobius diagnostics there, but this identity alone supplies no norm ' +
      'control in the critical half-strip and no direct approximation to the ' +
      'rotated completed object 1/X(is).',
    safeRegionTails:
      'Retraction: the printed noninteger-cutoff tail bound omitted an x^(-sigma) ' +
      'term. A valid elementary bound is sum_{n>x} n^(-sigma) <= x^(-sigma) + ' +
      'x^(1-sigma)/(sigma-1), or the integral bound may be used after an integer ' +
      'cutoff. Neither bound reaches the critical half-strip.',
    mollifierClosureTarget:
      'Retraction: no finite Dirichlet polynomial M can satisfy ' +
      'sup_{Re(s)>1/2}|1-zeta(s)M(s)| < 1, because approaching a known ' +
      'critical-line zero forces the defect to tend to 1. Only compact ' +
      'window diagnostics with margins allowed to shrink are viable.',
    keyClaimC:
      'Claim C (audited status): the advertised safe-tail/global uniform ' +
      'finite-mollifier closure is false. Finite Mobius ladders remain ' +
      'computable compact diagnostics in regions where their error is ' +
      'independently controlled.',
    verdict:
      'Compact diagnostic only. There is no proved global tail or uniform ' +
      'finite-mollifier margin connecting these truncations to RH.',
  }),

  // ── App D Reciprocal Mollifier Certificates / Nyman-Beurling ──────────
  reciprocalMollifierNymanBeurling: Object.freeze({
    sectionId: 'App D',
    title: 'Reciprocal Mollifier Certificates and the Nyman-Beurling Fit',
    pages: '74-78',
    exactFiniteDefect:
      'The coefficient-optimized finite Nyman-Beurling distance d_X is a finite ' +
      'quadratic optimization problem on the span of rho(1/(n x)), n <= X. ' +
      'Evaluating a prescribed Mobius coefficient vector gives only a trial ' +
      'residual, hence an upper bound on d_X; it is not d_X itself. The supplied ' +
      'manuscript artifacts do not include replayable leaf data for the ' +
      'advertised global certificate tables.',
    nymanBeurlingFit:
      'Nyman-Beurling-Baez-Duarte fit: RH is equivalent to 1_{(0,1]} lying in ' +
      'the closed L^2(0,infinity) span of rho(1/(n x)), n >= 1. The ' +
      'coefficient-optimized finite problem is exactly the distance to the ' +
      'first X basis functions. A fixed Mobius truncation is only one trial ' +
      'point in that optimization.',
    hilbertClosure:
      'Hilbert closure: RH <=> the Nyman-Beurling distance d_X -> 0 as the basis ' +
      'window X -> infinity. Fixed reciprocal-mollifier residuals are finite-X ' +
      'upper bounds only when evaluated in this same Hilbert-space problem.',
    keyClaimD:
      'Claim D (Nyman-Beurling Hilbert closure): the optimized finite-window ' +
      'distance d_X tends to zero if and only if RH. A chosen reciprocal ' +
      'mollifier sequence supplies trial upper bounds; it equals d_X only if ' +
      'it solves the corresponding coefficient optimization.',
    verdict:
      'Identifies the program with the classical Nyman-Beurling criterion: the ' +
      'optimized finite distance is the RH-equivalent Hilbert-space quantity, ' +
      'while fixed Mobius residuals are merely trial upper bounds. This is a ' +
      'reformulation, not a strict reduction or a finite proof.',
  }),

  // ── App E Reciprocal Schur Lifts ──────────────────────────────────────
  reciprocalSchurLifts: Object.freeze({
    sectionId: 'App E',
    title: 'Reciprocal Schur Lifts and Two-Step No-Ghost Certificates',
    pages: '79-83',
    reciprocalModelDefect:
      'Reciprocal model defect: measure how far the reciprocal object is from ' +
      'a Schur-class (bounded-by-one analytic) model on the relevant disk/' +
      'half-plane. This is step one of the two-step certificate.',
    nonCircularResidualMargin:
      'Proposed residual margin: step two would need a margin proved without ' +
      'assuming zero-freeness or the desired bridge inequality. The audit did ' +
      'not find such a global non-circular margin in the supplied artifacts.',
    optimalLocalLift:
      'Optimal local reciprocal lift: the best Schur lift restricted to a ' +
      'local window; its existence is the lift problem App F then analyzes ' +
      'extremally.',
    keyClaimE:
      'Claim E (conditional template): a reciprocal model defect plus a ' +
      'genuinely non-circular residual margin would give a local Schur-lift ' +
      'certificate. Proving compatible coverage and the margin on a universal ' +
      'exhaustion remains RH-strength.',
    verdict:
      'A conditional certificate template and compact numerical diagnostic, ' +
      'not a proved global Schur lift. Early windows crossing an artificial ' +
      'pole and non-covering patch radii cannot support an RH conclusion.',
  }),

  // ── App F Hardy-Corona Extremals ──────────────────────────────────────
  hardyCoronaExtremals: Object.freeze({
    sectionId: 'App F',
    title: 'Hardy-Corona Extremals for the Reciprocal Schur Lift',
    pages: '84-87',
    extremalGeometry:
      'Pointwise extremal geometry: the optimal unrestricted Schur lift is ' +
      'governed by a Hardy-space / Carleson-corona extremal problem -- find ' +
      'the H^infinity function solving the corona-type interpolation that ' +
      'realizes the lift pointwise.',
    noFreeLunchTheorem:
      'NO-FREE-LUNCH theorem: the unrestricted Schur lift cannot succeed -- ' +
      'the corona extremal that would close no-ghost forces a bound that ' +
      'violates the available data. Unrestricted lifts are ruled out, exactly ' +
      'as the direct PF-inf target was in B.2. The program must be ' +
      'RESTRICTED.',
    keyClaimF:
      'Claim F (no-free-lunch for unrestricted lifts): there is no ' +
      'unrestricted reciprocal Schur lift closing no-ghost; the Hardy-corona ' +
      'extremal obstructs it. Restriction (App G) is mandatory, not optional.',
    verdict:
      'The crucial honest obstruction: like B.2 for the direct kernel, App F ' +
      'shows the UNRESTRICTED reciprocal Schur lift is impossible. This ' +
      'forces the restricted passive lifts of App G and the conditioning ' +
      'barrier seen in the App H pilot.',
  }),

  // ── App G Restricted Passive Reciprocal Lifts ─────────────────────────
  restrictedPassiveLifts: Object.freeze({
    sectionId: 'App G',
    title: 'Restricted Passive Reciprocal Lifts and Exhaustion Certificates',
    pages: '87-91',
    secondOrderConeCertificate:
      'A restricted passive lift can be posed as a finite second-order-cone ' +
      '(SOC) feasibility problem. Feasibility is evidence only for the exact ' +
      'finite data and compact window encoded by that program.',
    constrainedExtremalNumber:
      'A constrained extremal number summarizes a finite optimization. ' +
      'Positivity on one or many sampled windows does not control unsampled ' +
      'points, poles, or the global tail. Universal verified exhaustion would ' +
      'be RH-equivalent rather than a finite shortcut.',
    dualObstruction:
      'Dual obstruction: the SOC dual exposes exactly what blocks the ' +
      'restricted lift -- the same central-band / pair-correlation structure ' +
      'that obstructs the other ESY-closure routes.',
    keyClaimG:
      'Claim G (audited scope): finite restricted passive SOC programs are ' +
      'compact diagnostics. A complete implication would require replayable ' +
      'certificates, gap-free coverage, pole control, a global tail, and a ' +
      'termination theorem; that universal package is not proved.',
    verdict:
      'COMPACT DIAGNOSTICS ONLY. The reported App H / imp-1204 finite runs do ' +
      'not prove a global reciprocal margin, stable Schur contractivity, or RH.',
  }),

  // ── Synthesis: the corrected target chain ─────────────────────────────
  correctedTargetChain: Object.freeze({
    line1: 'Kernel audit: PF_2 holds, but a negative 5-by-5 minor rules out PF-infinity',
    line2: 'App B.2 ↓ direct PF-infinity total-positivity target is IMPOSSIBLE',
    line3: 'App B.3 ↓ rotation correction: Schoenberg object is 1/X(is), not 1/X(s)',
    line4: 'App C ↓ safe-tail/global finite-mollifier closure claims are RETRACTED',
    line5: 'App D ↓ Nyman-Beurling is an RH-equivalent Hilbert-space criterion',
    line6: 'App E ↓ local Schur lifts need an unproved global non-circular margin',
    line7: 'App F ↓ unrestricted fitting supplies no shortcut past bridge positivity',
    line8: 'App G ↓ finite restricted SOC programs are COMPACT DIAGNOSTICS ONLY',
  }),

  // ── Implications for the wider proof program ──────────────────────────
  implicationsForRH: Object.freeze({
    twinReversalStructure:
      'The audit rules out the direct PF-infinity target and corrects the ' +
      'reciprocal variable to 1/X(is). Restricted fitting avoids some local ' +
      'no-go examples, but it does not create a new global proof target: the ' +
      'exact Twin Ladder residual remains the sole global frontier.',
    nymanBeurlingBridge:
      'App D identifies the reciprocal mollifier certificate with the ' +
      'classical Nyman-Beurling distance, connecting the paper to the ' +
      'Baez-Duarte / Nyman-Beurling Hilbert-space reformulation of RH.',
    sharedPCCObstruction:
      'Per imp-1184: the App G dual obstruction is the same central-band / ' +
      'Montgomery pair-correlation structure that obstructs every live ' +
      'ESY-closure route. The reciprocal program does NOT bypass PCC; it ' +
      'localizes the obstruction into the SOC dual.',
    whatThisGives:
      'Finite convex experiments on stated compact windows. These can expose ' +
      'conditioning, poles, or local counterexamples, but they carry no ' +
      'unconditional Lambda bound and no global RH verdict.',
    futureExperiment:
      'If continued, imp-1200-sub-reciprocal-soc-pilot should be framed as a ' +
      'compact diagnostic: regularize artificial poles, verify actual coverage, ' +
      'and publish replayable finite certificates. It must not advertise a ' +
      'global exhaustion or RH implication without a separate theorem.',
  }),

  references: Object.freeze({
    paper: 'research-inputs/twin_ladder_consolidated_v52.pdf Apps B-G (pp. 67-91)',
    paperRoadmap: 'src/data/twin-ladder-paper-roadmap.js -- App B-G roadmap entries',
    restrictedLiftPilot: 'src/data/imp-1204-restricted-lift-pilot.js (App H) -- first finite restricted-lift pilot',
    hiddenSquare: 'src/data/hidden-square-program-section.js (imp-1219) -- §25-27 hidden-square chain',
    schoenberg: 'I. J. Schoenberg, total positivity and Polya frequency functions (PF-inf theory)',
    nymanBeurling: 'Nyman 1950 / Beurling 1955 / Baez-Duarte 2003 -- Hilbert-space reformulation of RH',
    corona: 'L. Carleson corona theorem; H^infinity interpolation extremals',
  }),
});

export const RECIPROCAL_PROGRAM_SECTION_ASSERTIONS = [
  {
    id: 'imp1200-paper-source-path-correct',
    why: 'The paper-source-path field must point at the actual PDF in research-inputs/.',
    holds: () => RECIPROCAL_PROGRAM_SECTION.paperSourcePath === 'research-inputs/twin_ladder_consolidated_v52.pdf',
  },
  {
    id: 'imp1200-six-apps-covered',
    why: 'Page synthesizes Apps B through G -- all six sub-records must be present with the right section ids.',
    holds: () => {
      const r = RECIPROCAL_PROGRAM_SECTION;
      return r.reciprocalTotalPositivity.sectionId === 'App B' &&
             r.reciprocalMobiusLadders.sectionId === 'App C' &&
             r.reciprocalMollifierNymanBeurling.sectionId === 'App D' &&
             r.reciprocalSchurLifts.sectionId === 'App E' &&
             r.hardyCoronaExtremals.sectionId === 'App F' &&
             r.restrictedPassiveLifts.sectionId === 'App G';
    },
  },
  {
    id: 'imp1200-key-claims-named',
    why: 'Each appendix must cite its load-bearing claim (B.2, B.3, C, D, E, F, G) so each step in the ' +
         'corrected target chain traces to a named statement.',
    holds: () => {
      const r = RECIPROCAL_PROGRAM_SECTION;
      return r.reciprocalTotalPositivity.keyClaimB2.includes('B.2') &&
             r.reciprocalTotalPositivity.keyClaimB3.includes('B.3') &&
             r.reciprocalMobiusLadders.keyClaimC.includes('C') &&
             r.reciprocalMollifierNymanBeurling.keyClaimD.includes('D') &&
             r.reciprocalSchurLifts.keyClaimE.includes('E') &&
             r.hardyCoronaExtremals.keyClaimF.includes('F') &&
             r.restrictedPassiveLifts.keyClaimG.includes('G');
    },
  },
  {
    id: 'imp1200-direct-pf-inf-impossibility-stated',
    why: 'The whole program is a CORRECTION: App B.2 proves the naive direct PF-infinity target is ' +
         'impossible. If this honest framing is dropped the page misrepresents the reciprocal program ' +
         'as a free choice rather than a forced one.',
    holds: () => {
      const b = RECIPROCAL_PROGRAM_SECTION.reciprocalTotalPositivity;
      return b.whyDirectFails.includes('PF') && b.keyClaimB2.toLowerCase().includes('impossib');
    },
  },
  {
    id: 'imp1200-schoenberg-variable-is-rotated',
    why: 'The audited reciprocal target must be 1/X(is); the unrotated 1/X(s) expression is the wrong spectral variable.',
    holds: () => {
      const b = RECIPROCAL_PROGRAM_SECTION.reciprocalTotalPositivity;
      return b.correctReciprocalObject.includes('1/X(is)') &&
             b.correctReciprocalObject.includes('1/X(s)') &&
             b.keyClaimB3.includes('1/X(is)');
    },
  },
  {
    id: 'imp1200-global-mollifier-and-safe-tail-retracted',
    why: 'The false noninteger safe-tail formula and impossible global finite-mollifier gap must stay explicitly retracted.',
    holds: () => {
      const c = RECIPROCAL_PROGRAM_SECTION.reciprocalMobiusLadders;
      return c.mobiusBridge.includes('Re(s) > 1') &&
             c.safeRegionTails.includes('Retraction') &&
             c.safeRegionTails.includes('x^(-sigma)') &&
             c.mollifierClosureTarget.includes('no finite Dirichlet polynomial') &&
             c.verdict.includes('Compact diagnostic only');
    },
  },
  {
    id: 'imp1200-nyman-beurling-identified',
    why: 'App D distinguishes the coefficient-optimized Nyman-Beurling distance from a fixed Mobius ' +
         'trial residual, which supplies only an upper bound. The RH-equivalent bridge must stay explicit.',
    holds: () => {
      const d = RECIPROCAL_PROGRAM_SECTION.reciprocalMollifierNymanBeurling;
      return d.nymanBeurlingFit.includes('Nyman-Beurling') &&
             d.nymanBeurlingFit.includes('rho(1/(n x))') &&
             d.exactFiniteDefect.includes('upper bound on d_X') &&
             d.keyClaimD.includes('equals d_X only if') &&
             d.hilbertClosure.includes('RH');
    },
  },
  {
    id: 'imp1200-no-free-lunch-honest',
    why: 'App F is the second impossibility (no-free-lunch for unrestricted Schur lifts). Surfacing it is ' +
         'what justifies the RESTRICTED lifts of App G; omitting it would overclaim that an unrestricted ' +
         'lift could close the proof.',
    holds: () => {
      const f = RECIPROCAL_PROGRAM_SECTION.hardyCoronaExtremals;
      return f.noFreeLunchTheorem.toLowerCase().includes('no-free-lunch') ||
             f.keyClaimF.toLowerCase().includes('no-free-lunch');
    },
  },
  {
    id: 'imp1200-corrected-chain-eight-lines',
    why: 'The audited chain must preserve all eight appendix checkpoints while recording the rotation and retractions.',
    holds: () => {
      const c = RECIPROCAL_PROGRAM_SECTION.correctedTargetChain;
      const lines = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6', 'line7', 'line8'];
      return lines.every((k) => c[k] && c[k].length > 20);
    },
  },
  {
    id: 'imp1200-restricted-soc-is-compact-diagnostic-only',
    why: 'App G finite SOC runs must be labelled compact diagnostics, not the live global RH target.',
    holds: () => {
      const g = RECIPROCAL_PROGRAM_SECTION.restrictedPassiveLifts;
      return g.secondOrderConeCertificate.includes('SOC') &&
             g.keyClaimG.includes('compact diagnostics') &&
             g.verdict.includes('COMPACT DIAGNOSTICS ONLY') &&
             RECIPROCAL_PROGRAM_SECTION.implicationsForRH.twinReversalStructure.includes('sole global frontier');
    },
  },
  {
    id: 'imp1200-shared-pcc-obstruction-honest',
    why: 'Per imp-1184: all live ESY-closure routes share the Montgomery PCC / central-band obstruction. ' +
         'The reciprocal program localizes it into the App G SOC dual but does not bypass it. Honest ' +
         'scope MUST surface this so the chain is not mistaken for an unconditional path.',
    holds: () => {
      const i = RECIPROCAL_PROGRAM_SECTION.implicationsForRH.sharedPCCObstruction;
      return i.includes('PCC') && i.includes('imp-1184');
    },
  },
  {
    id: 'imp1200-future-experiment-named',
    why: 'A concrete follow-up ticket (imp-1200-sub-reciprocal-soc-pilot) must be named so the reader has ' +
         'an actionable next step from the page.',
    holds: () => RECIPROCAL_PROGRAM_SECTION.implicationsForRH.futureExperiment.includes('reciprocal-soc-pilot'),
  },
];
