// @module data/reciprocal-program-section
// imp-1200: structured record of Appendices B-G of the user's paper at
// research-inputs/twin_ladder_consolidated_v52.pdf -- the "reciprocal
// program": the CORRECTED proof target after the naive direct
// Polya-frequency (PF-infinity) total-positivity target was shown impossible.
//
// PURPOSE
// -------
// App A (log-concavity audit) showed the direct tilted Riemann kernel is NOT a
// Polya frequency function of infinite order. Appendix B.2 makes this a
// theorem: the naive "direct PF-inf" target cannot be met. The whole point of
// Apps B-G is to REPLACE that broken target with a chain of reciprocal
// objects that ARE the right Schoenberg/Schur-class targets:
//
//   App B (reciprocal total positivity):  the correct Schoenberg object is the
//          RECIPROCAL kernel (B.3), not the direct one (B.2 impossibility).
//   App C (reciprocal Mobius ladders):    uniform mollifier closure built from
//          reciprocal Mobius bridges + safe-region tails.
//   App D (reciprocal mollifier certs):   exact finite Mobius defect; the
//          Nyman-Beurling criterion is the Hilbert-space version of the
//          reciprocal freezing.
//   App E (reciprocal Schur lifts):       two-step no-ghost certificate via a
//          reciprocal model defect + non-circular residual margin.
//   App F (Hardy-corona extremals):       pointwise extremal geometry; a
//          NO-FREE-LUNCH theorem rules out unrestricted Schur lifts.
//   App G (restricted passive lifts):     second-order-cone certificate;
//          constrained extremal number; the dual obstruction.
//
// The chain is the corrected, numerically-tractable proof route. The honest
// punchline (App F no-free-lunch -> App G restriction -> App H pilot) is that
// only RESTRICTED passive lifts survive, and the first finite restricted-lift
// pilot (imp-1204, App H) already hits a central-band conditioning barrier.

export const RECIPROCAL_PROGRAM_SECTION = Object.freeze({
  id: 'reciprocal-program-section',
  ticket: 'imp-1200',
  paperSourcePath: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSections: 'Apps B-G',
  paperPageRange: '67-91',
  generatedAt: '2026-05-28T22:00:00Z',

  title: 'The Reciprocal Program (Apps B-G)',
  oneLine:
    'The corrected proof target: after the naive direct PF-infinity kernel is ' +
    'proven impossible (B.2), the right Schoenberg/Schur objects are all ' +
    'RECIPROCAL -- reciprocal total positivity, Mobius mollifiers, ' +
    'Nyman-Beurling closure, Schur lifts, and restricted passive lifts.',

  // ── App B Reciprocal Total Positivity ─────────────────────────────────
  reciprocalTotalPositivity: Object.freeze({
    sectionId: 'App B',
    title: 'Reciprocal Total Positivity: Correcting the Naive Kernel Target',
    pages: '67-71',
    whyDirectFails:
      'B.2 impossibility: the direct tilted Riemann kernel cannot be a Polya ' +
      'frequency function of infinite order (PF-inf). A PF-inf kernel has a ' +
      'Schoenberg representation whose reciprocal generating function is ' +
      'entire of genus <= 1 with only NEGATIVE real zeros; the completed ' +
      'zeta factor 1/xi has the wrong zero geometry, so no direct total-' +
      'positivity certificate can exist. The naive target is dead on arrival.',
    correctReciprocalObject:
      'B.3 correct object: the right Schoenberg object is the RECIPROCAL ' +
      'kernel. Total-positivity / variation-diminishing structure is sought ' +
      'for 1/xi-type objects, where the Hadamard product over zeros lands in ' +
      'the Laguerre-Polya class the Schoenberg theory actually requires.',
    keyClaimB2:
      'Claim B.2 (direct PF-inf impossibility): there is NO direct ' +
      'total-positivity (PF-infinity) certificate for the tilted Riemann ' +
      'kernel. The naive Schoenberg target is unattainable.',
    keyClaimB3:
      'Claim B.3 (reciprocal Schoenberg object): the corrected target is the ' +
      'reciprocal kernel, whose generating function sits in the ' +
      'Laguerre-Polya class iff RH. This relocates the entire program from ' +
      'direct to reciprocal total positivity.',
    verdict:
      'Foundational correction: kills the naive direct PF-inf target and ' +
      'fixes the reciprocal kernel as the correct Schoenberg object. ' +
      'Everything downstream (C-G) is built on the reciprocal side.',
  }),

  // ── App C Reciprocal Mobius Ladders ───────────────────────────────────
  reciprocalMobiusLadders: Object.freeze({
    sectionId: 'App C',
    title: 'Reciprocal Mobius Ladders and the Uniform Mollifier Closure',
    pages: '71-74',
    mobiusBridge:
      'Reciprocal Mobius bridge: 1/zeta(s) = sum mu(n) n^{-s} provides the ' +
      'arithmetic ladder on the reciprocal side; truncations are the Mobius ' +
      'mollifiers M_X(s) = sum_{n<=X} mu(n) n^{-s}.',
    safeRegionTails:
      'Safe-region tails: outside a finite mollifier window the reciprocal ' +
      'object is controlled by tail bounds that keep the ladder uniform in ' +
      'the shift parameter.',
    mollifierClosureTarget:
      'Uniform mollifier closure target: the family of reciprocal Mobius ' +
      'mollifiers is dense (uniformly in the relevant region) in the ' +
      'reciprocal Schoenberg object, so the B.3 target is approachable by ' +
      'finite arithmetic ladders.',
    keyClaimC:
      'Claim C (uniform mollifier closure): the reciprocal Mobius ladder, ' +
      'with safe-region tails, closes uniformly onto the reciprocal ' +
      'Schoenberg object. This is the arithmetic engine for the program.',
    verdict:
      'Supplies the arithmetic ladder (Mobius mollifiers) and a uniform ' +
      'closure target, converting the B.3 reciprocal object into a sequence ' +
      'of finite, computable approximants.',
  }),

  // ── App D Reciprocal Mollifier Certificates / Nyman-Beurling ──────────
  reciprocalMollifierNymanBeurling: Object.freeze({
    sectionId: 'App D',
    title: 'Reciprocal Mollifier Certificates and the Nyman-Beurling Fit',
    pages: '74-78',
    exactFiniteDefect:
      'Exact finite Mobius defect: for a finite mollifier window the residual ' +
      'between the reciprocal object and its Mobius approximant is computed ' +
      'exactly (a finite quadratic defect), giving a concrete certificate ' +
      'number per window.',
    nymanBeurlingFit:
      'Nyman-Beurling fit: the criterion that 1_{(0,1)} lies in the closed L^2 ' +
      'span of dilations of the fractional-part function {rho(theta/x)} is ' +
      'EXACTLY the Hilbert-space version of the reciprocal freezing -- ' +
      'minimizing the Mobius defect IS the Nyman-Beurling approximation.',
    hilbertClosure:
      'Hilbert closure: RH <=> the Nyman-Beurling distance d_X -> 0 as the ' +
      'mollifier window X -> infinity. The reciprocal mollifier certificates ' +
      'are finite-X upper bounds on this distance.',
    keyClaimD:
      'Claim D (Nyman-Beurling Hilbert closure): the reciprocal mollifier ' +
      'certificate sequence is the finite-window Nyman-Beurling fit; its ' +
      'limit being zero is equivalent to RH. The reciprocal freezing is the ' +
      'Hilbert-space form of the same fit.',
    verdict:
      'Identifies the program with the classical Nyman-Beurling criterion: ' +
      'the reciprocal mollifier defect IS the Nyman-Beurling distance, ' +
      'tying the paper to a 70-year-old Hilbert-space reformulation of RH.',
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
      'Non-circular residual margin: step two adds a residual margin that is ' +
      'built WITHOUT assuming RH (non-circular), so the two-step certificate ' +
      'is a genuine sufficient condition rather than a tautology.',
    optimalLocalLift:
      'Optimal local reciprocal lift: the best Schur lift restricted to a ' +
      'local window; its existence is the lift problem App F then analyzes ' +
      'extremally.',
    keyClaimE:
      'Claim E (two-step no-ghost certificate): a reciprocal model defect ' +
      'plus a non-circular residual margin yields a Schur-lift no-ghost ' +
      'certificate. If the optimal local lift has margin >= 0 for all ' +
      'windows, no-ghost (hence RH) follows.',
    verdict:
      'Reframes no-ghost as a Schur-class lifting problem on the reciprocal ' +
      'side, with an explicit two-step (defect + non-circular margin) ' +
      'certificate. Sets up the extremal analysis of App F.',
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
      'Second-order-cone (SOC) certificate: the restricted passive lift is a ' +
      'convex feasibility problem -- a finite SOC program whose feasibility ' +
      'is a no-ghost certificate on the restricted window.',
    constrainedExtremalNumber:
      'Constrained extremal number: the optimal value of the restricted ' +
      'extremal problem; positivity of this number on every exhausting ' +
      'window is the exhaustion certificate.',
    dualObstruction:
      'Dual obstruction: the SOC dual exposes exactly what blocks the ' +
      'restricted lift -- the same central-band / pair-correlation structure ' +
      'that obstructs the other ESY-closure routes.',
    keyClaimG:
      'Claim G (restricted-lift exhaustion): a sequence of restricted passive ' +
      'reciprocal lifts, each a feasible SOC program, exhausting all windows ' +
      'with a positive constrained extremal number, certifies no-ghost. The ' +
      'dual obstruction is the remaining open content.',
    verdict:
      'Lands the program at a concrete convex (SOC) certificate that is ' +
      'numerically checkable per window. The first finite instance (App H / ' +
      'imp-1204) passes at a=0.025 but hits a central-band conditioning ' +
      'barrier at a=0.010.',
  }),

  // ── Synthesis: the corrected target chain ─────────────────────────────
  correctedTargetChain: Object.freeze({
    line1: 'App A: direct tilted Riemann kernel fails log-concavity audit',
    line2: 'App B.2 ↓ direct PF-infinity total-positivity target is IMPOSSIBLE',
    line3: 'App B.3 ↓ correct Schoenberg object is the RECIPROCAL kernel',
    line4: 'App C ↓ reciprocal Mobius ladders give uniform mollifier closure',
    line5: 'App D ↓ reciprocal mollifier defect = Nyman-Beurling Hilbert closure',
    line6: 'App E ↓ two-step reciprocal Schur lift (defect + non-circular margin)',
    line7: 'App F ↓ NO-FREE-LUNCH: unrestricted Schur lift impossible (Hardy-corona)',
    line8: 'App G ↓ RESTRICTED passive lift: SOC exhaustion certificate (the live target)',
  }),

  // ── Implications for the wider proof program ──────────────────────────
  implicationsForRH: Object.freeze({
    twinReversalStructure:
      'The reciprocal program has the SAME shape twice: a naive target is ' +
      'proven impossible (B.2 direct PF-inf; F no-free-lunch unrestricted ' +
      'lift) and replaced by a restricted reciprocal object. The live target ' +
      'is the restricted passive SOC lift of App G.',
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
      'A CONCRETE convex (second-order-cone) certificate per window, ' +
      'numerically checkable on real reciprocal-kernel data. Even without ' +
      'closing the dual obstruction, restricted passive lifts can be tested ' +
      'at finite windows -- which is exactly the App H pilot reproduced in ' +
      'imp-1204.',
    futureExperiment:
      'imp-1200-sub-reciprocal-soc-pilot: implement the App G restricted ' +
      'passive SOC certificate across an exhausting window family and the ' +
      'a-grid from imp-1204, mapping the central-band conditioning barrier ' +
      'that stops the a=0.010 lift.',
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
    id: 'imp1200-nyman-beurling-identified',
    why: 'App D identifies the reciprocal mollifier defect with the classical Nyman-Beurling distance -- ' +
         'the bridge to the known Hilbert-space reformulation of RH. This connection must be explicit.',
    holds: () => {
      const d = RECIPROCAL_PROGRAM_SECTION.reciprocalMollifierNymanBeurling;
      return d.nymanBeurlingFit.includes('Nyman-Beurling') && d.hilbertClosure.includes('RH');
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
    why: 'The corrected-target-chain synthesis must have all 8 lines (App A fail -> B.2 impossible -> B.3 ' +
         'reciprocal -> C closure -> D Nyman-Beurling -> E Schur lift -> F no-free-lunch -> G restricted ' +
         'SOC). Missing any line breaks the two-reversal narrative.',
    holds: () => {
      const c = RECIPROCAL_PROGRAM_SECTION.correctedTargetChain;
      const lines = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6', 'line7', 'line8'];
      return lines.every((k) => c[k] && c[k].length > 20);
    },
  },
  {
    id: 'imp1200-live-target-is-restricted-soc',
    why: 'The live, numerically-checkable target is the App G restricted passive second-order-cone ' +
         'certificate. The verdict must identify it as the concrete target and tie it to the App H / ' +
         'imp-1204 pilot, not to an unrestricted or direct object.',
    holds: () => {
      const g = RECIPROCAL_PROGRAM_SECTION.restrictedPassiveLifts;
      return g.secondOrderConeCertificate.includes('SOC') && g.verdict.includes('imp-1204');
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
