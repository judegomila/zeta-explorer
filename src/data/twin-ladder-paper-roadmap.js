// @module data/twin-ladder-paper-roadmap
// imp-1217: Master index of every section of the user's working paper
// research-inputs/twin_ladder_consolidated_v52.pdf (consolidated draft v52,
// 191 pages, dated 2026-05-10). Source of truth for the
// /twin-ladder-paper-roadmap app page (companion file
// src/pages/TwinLadderPaperRoadmapPage.jsx).
//
// PURPOSE
// -------
// The paper has 29 main sections (§1..§29) plus two appendix runs:
//   - First run:  A..V (log-concavity through Euler-safe Taylor-ball cells).
//   - W, X, Y stand-alones (glossary, checklist, Cauchy-ball attempt).
//   - Second run: A..Q (ACB-backed near-critical Taylor cells through
//     extended ACB-certified vertical strip).
// 56 entries in total. A reader who lands on the paper has no easy way to
// navigate it; this roadmap is that single entry point.
//
// FIELD SEMANTICS
// ---------------
// Each entry carries:
//   id            slug used for keys + URL fragments
//   sectionNumber human-readable label (e.g. "§15", "App A", "App2 A")
//   title         exactly the paper's title for the section
//   paperPageRange "start-end" page numbers in the rendered PDF
//   appRoute      string app route covering this section, or null
//   appPageStatus 'has-page'         — appRoute is live in src/App.jsx today
//                 'planned-imp-XXXX' — covered by an open ticket
//                 'not-covered'      — no app coverage, no open ticket
//   auditStatus   one of 'audited-subsumed', 'audited-partial',
//                 'audited-independent', 'literature-audited',
//                 'numerical-pilot', 'reference-only', 'unaudited'
//   summary       one-line gist OR 'see PDF page X-Y' if the TOC alone is
//                 insufficient to write a faithful one-liner.
//
// HONEST SCOPE
// ------------
// 1. App routes are cross-checked against src/App.jsx as of 2026-05-26.
//    Anything labelled has-page actually has a live <Route> in App.jsx.
// 2. Anything labelled planned-imp-XXXX has a matching pending entry in
//    src/data/improvement-queue.js; the ticket id is named explicitly.
// 3. Most appendix entries carry summary='see PDF page X-Y' rather than
//    paraphrasing — the appendix detail is too dense for a faithful
//    one-liner from the TOC alone.
// 4. Audit statuses lift verdicts from existing audit tickets (imp-1163,
//    imp-1202, imp-1209, imp-1210) and are 'unaudited' otherwise.
// 5. This file does NOT claim any mathematical result. It is a navigation
//    backbone, not a re-proof.

export const PAPER_ROADMAP = Object.freeze({
  id: 'twin-ladder-paper-roadmap',
  ticket: 'imp-1217',
  paperSourcePath: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperTitle: 'Twin-Ladder Deformations of the Riemann ξ-Function',
  paperSubtitle:
    'Coherent Shell Transfer, Pressure, Hamiltonians, Shift Bridges, ' +
    'and a Program for Rigorous Numerics',
  paperVersion: 'Consolidated draft v52',
  paperDate: '2026-05-10',
  paperTotalPages: 191,
  paperMainSectionCount: 29,
  generatedAt: '2026-05-26T18:00:00Z',

  // ── §1..§29 main sections ────────────────────────────────────────────
  mainSections: Object.freeze([
    Object.freeze({
      id: 's1-introduction',
      sectionNumber: '§1',
      title: 'Introduction',
      paperPageRange: '13-13',
      appRoute: '/paper',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Framing of the twin-ladder project: oscillatory (log-prime delays) ' +
        'and completed (heat-kernel) views of the same xi function.',
    }),
    Object.freeze({
      id: 's2-classical-structures',
      sectionNumber: '§2',
      title: 'Classical structures any twin-ladder model must respect',
      paperPageRange: '14-15',
      appRoute: '/zeta',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Four invariants: theta-Mellin representation, Hardy Z + Riemann-Siegel, ' +
        'de Bruijn-Newman heat flow, prime-zero duality.',
    }),
    Object.freeze({
      id: 's3-twin-ladder-scaffold',
      sectionNumber: '§3',
      title: 'The twin-ladder scaffold',
      paperPageRange: '15-16',
      appRoute: '/twin-ladder',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Twin pullback construction: prime ladders coupled to a completed ' +
        'heat-kernel representative via moment matching or bridges.',
    }),
    Object.freeze({
      id: 's4-pressure-inverse-temperature',
      sectionNumber: '§4',
      title: 'Pressure and inverse temperature',
      paperPageRange: '16-17',
      appRoute: '/supercritical',
      appPageStatus: 'has-page',
      auditStatus: 'literature-audited',
      summary:
        'Pressure (P) and inverse temperature (beta) parameters. NOTE: §4.5 ' +
        'Conjecture 1 was audited as SUBSUMED-BY-HR-BOURGADE (imp-1163).',
    }),
    Object.freeze({
      id: 's5-supercriticality',
      sectionNumber: '§5',
      title: 'Supercriticality',
      paperPageRange: '17-18',
      appRoute: '/supercritical',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Distinction between analytic supercriticality (§5.1) and ' +
        'computational supercriticality (§5.2).',
    }),
    Object.freeze({
      id: 's6-zero-temperature-infinite-pressure',
      sectionNumber: '§6',
      title: 'Zero temperature and infinite pressure',
      paperPageRange: '18-18',
      appRoute: '/supercritical',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Limit regimes of the (beta, P) phase space; freezing-style endpoints.',
    }),
    Object.freeze({
      id: 's7-frozen-ladders-kernel-proxies',
      sectionNumber: '§7',
      title: 'Frozen ladders and kernel proxies',
      paperPageRange: '18-19',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 18-19 — frozen ladders correspond to coherent shell kernel proxies.',
    }),
    Object.freeze({
      id: 's8-relations-to-other-rh-adjacent-programs',
      sectionNumber: '§8',
      title: 'Relations to other RH-adjacent programs',
      paperPageRange: '19-19',
      appRoute: '/rh-equivalents',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Brief cross-walk to Newman, de Bruijn, polymath15, Connes, ' +
        'Berry-Keating, etc.',
    }),
    Object.freeze({
      id: 's9-pascal-decorations-phase-sectors',
      sectionNumber: '§9',
      title: 'Pascal decorations and phase sectors',
      paperPageRange: '19-19',
      appRoute: '/pascal',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Pascal-triangle decoration of ladders + associated phase sectors.',
    }),
    Object.freeze({
      id: 's10-lc-ladder-control-system-avatars',
      sectionNumber: '§10',
      title: 'LC-ladder and control-system avatars',
      paperPageRange: '19-19',
      appRoute: '/control',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'LC-ladder, scattering-matrix, and passive-control avatars of the ' +
        'twin-ladder.',
    }),
    Object.freeze({
      id: 's11-information-geometry',
      sectionNumber: '§11',
      title: 'Information geometry',
      paperPageRange: '20-20',
      appRoute: '/info-theory',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Fisher metric / KL-divergence avatar of the (beta, P) family.',
    }),
    Object.freeze({
      id: 's12-hamiltonian-models',
      sectionNumber: '§12',
      title: 'Hamiltonian models',
      paperPageRange: '20-20',
      appRoute: '/hamiltonian',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Hilbert-Polya / Berry-Keating-style Hamiltonian avatars of zeta zeros.',
    }),
    Object.freeze({
      id: 's13-action-angle-fourier-heat-lens',
      sectionNumber: '§13',
      title: 'Action-angle variables and the Fourier-heat lens',
      paperPageRange: '21-21',
      appRoute: '/fourier',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Action-angle coordinates on the twin-ladder phase space; Fourier-heat ' +
        'integral kernel as a lens.',
    }),
    Object.freeze({
      id: 's14-coherent-low-shell-observables',
      sectionNumber: '§14',
      title: 'Coherent low-shell observables and pilot numerics',
      paperPageRange: '22-22',
      appRoute: '/oscillators',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Low-shell observables; first pilot numerics on the twin-ladder.',
    }),
    Object.freeze({
      id: 's15-shift-bridge-positivity',
      sectionNumber: '§15',
      title: 'Shift-Bridge Reflection Positivity and a Godelian Witness Principle',
      paperPageRange: '23-28',
      appRoute: '/shift-bridge-positivity',
      appPageStatus: 'has-page',
      auditStatus: 'literature-audited',
      summary:
        'Shift-bridge threshold theorem: RH is equivalent to K_a >= 0 for ' +
        'every a > 0. Conj 15.4 cross-checked (imp-1202) as RH-implied.',
    }),
    Object.freeze({
      id: 's16-four-closure-routes',
      sectionNumber: '§16',
      title: 'Four Equivalent Closure Routes for the Zero-Bridge-Thickness Problem',
      paperPageRange: '28-33',
      appRoute: '/closure-routes',
      appPageStatus: 'has-page',
      auditStatus: 'audited-partial',
      summary:
        'Four routes (Schur, de Branges, hidden-square, Weil) shown ' +
        'mathematically equivalent (Theorem 16.1). Connes cross-walk imp-1205.',
    }),
    Object.freeze({
      id: 's17-inverse-blaschke-ghosts',
      sectionNumber: '§17',
      title: 'Attack on the Wall: Inverse Blaschke Ghosts and the Pontryagin Decomposition',
      paperPageRange: '34-38',
      appRoute: '/blaschke-ghosts',
      appPageStatus: 'has-page',
      auditStatus: 'audited-partial',
      summary:
        'Single inverse Blaschke ghost = one rank-one negative square. ' +
        'Krein-Langer identity cross-checked vs imp-1147 (imp-1209).',
    }),
    Object.freeze({
      id: 's18-three-direct-attacks',
      sectionNumber: '§18',
      title: 'Three Direct Attacks on Ghost Absence',
      paperPageRange: '38-43',
      appRoute: '/three-attacks',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Attack I (kernel/passivity), II (prime-delay domination), ' +
        'III (Weil/Pontryagin index). Conj 18.2 numerical pilot imp-1203 (open).',
    }),
    Object.freeze({
      id: 's19-twistor-riemann-hilbert-avatar',
      sectionNumber: '§19',
      title: 'Twistor-like Riemann-Hilbert avatar',
      paperPageRange: '43-43',
      appRoute: '/twistor',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Twistor-like Riemann-Hilbert presentation of the bridge problem.',
    }),
    Object.freeze({
      id: 's20-rigorous-numerics-program',
      sectionNumber: '§20',
      title: 'Rigorous-numerics program',
      paperPageRange: '43-44',
      appRoute: null,
      appPageStatus: 'planned-imp-1220',
      auditStatus: 'unaudited',
      summary:
        'Stages I (classical), II (pressure-temperature), III (interval). ' +
        'Page planned via imp-1220.',
    }),
    Object.freeze({
      id: 's21-falsifiability-failure-modes',
      sectionNumber: '§21',
      title: 'Falsifiability and failure modes',
      paperPageRange: '44-44',
      appRoute: '/rigor-dashboard',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Falsifiability checklist and failure-mode catalog.',
    }),
    Object.freeze({
      id: 's22-conjectures-and-theorem-targets',
      sectionNumber: '§22',
      title: 'Conjectures and theorem targets',
      paperPageRange: '44-44',
      appRoute: null,
      appPageStatus: 'planned-imp-1218',
      auditStatus: 'literature-audited',
      summary:
        'Conj 22.1-22.4. imp-1210 audit: 22.4 SUBSUMED-BY-RH, 22.2/22.3 ' +
        'PARTIALLY-RELATED, 22.1 INDEPENDENT-NOVEL.',
    }),
    Object.freeze({
      id: 's23-freezing-bridge-renorm-no-ghost',
      sectionNumber: '§23',
      title: 'Freezing, Bridge Renormalization, and a Targeted No-Ghost Attack',
      paperPageRange: '44-48',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 44-48 — Schur-complement freezing preserves negative index; ' +
        'endpoint bridges as finite-window positivity repairs.',
    }),
    Object.freeze({
      id: 's24-what-remains-to-get-proof-working',
      sectionNumber: '§24',
      title: 'What remains to get the proof working',
      paperPageRange: '48-49',
      appRoute: '/proof-overview',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Pedagogical recap of remaining proof targets after §15-§23.',
    }),
    Object.freeze({
      id: 's25-off-diagonal-commutator-hidden-square',
      sectionNumber: '§25',
      title: 'Off-Diagonal Commutator and the Hidden-Square Attempt',
      paperPageRange: '49-54',
      appRoute: null,
      appPageStatus: 'planned-imp-1219',
      auditStatus: 'unaudited',
      summary:
        'Cosine-sine channels, a-flow identity, off-diagonal obstruction. ' +
        'Page planned via imp-1219 (combined with §26-§27).',
    }),
    Object.freeze({
      id: 's26-measure-domination-volterra',
      sectionNumber: '§26',
      title: 'Measure Domination and Volterra Absorption of the Off-Diagonal Shear',
      paperPageRange: '54-59',
      appRoute: null,
      appPageStatus: 'planned-imp-1219',
      auditStatus: 'unaudited',
      summary:
        'Difference-frequency positivity, exact shear representation, ' +
        'scalar domination + Volterra absorption target.',
    }),
    Object.freeze({
      id: 's27-endpoint-hankel-renormalization',
      sectionNumber: '§27',
      title: 'Endpoint-Hankel Renormalization and the Volterra-Contraction Target',
      paperPageRange: '59-63',
      appRoute: null,
      appPageStatus: 'planned-imp-1219',
      auditStatus: 'unaudited',
      summary:
        'Endpoint-Hankel Volterra reduction of the shear bound + finite-window ' +
        'numerical diagnostic.',
    }),
    Object.freeze({
      id: 's28-discussion',
      sectionNumber: '§28',
      title: 'Discussion',
      paperPageRange: '63-63',
      appRoute: '/paper',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary: 'Discussion paragraph closing the main body.',
    }),
    Object.freeze({
      id: 's29-conclusion',
      sectionNumber: '§29',
      title: 'Conclusion',
      paperPageRange: '63-63',
      appRoute: '/paper',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary: 'Conclusion paragraph.',
    }),
  ]),

  // ── Appendices A..V (first run) ──────────────────────────────────────
  appendicesFirstRun: Object.freeze([
    Object.freeze({
      id: 'app-a-log-concavity-midpoint-absorption',
      sectionNumber: 'App A',
      title: 'Log-Concavity, Midpoint Absorption, and the Total-Positivity Target',
      paperPageRange: '63-67',
      appRoute: null,
      appPageStatus: 'planned-imp-1200',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 63-67 — log-concavity audit for the Riemann kernel.',
    }),
    Object.freeze({
      id: 'app-b-reciprocal-total-positivity',
      sectionNumber: 'App B',
      title: 'Reciprocal Total Positivity: Correcting the Naive Kernel Target',
      paperPageRange: '67-71',
      appRoute: null,
      appPageStatus: 'planned-imp-1200',
      auditStatus: 'unaudited',
      summary:
        'Direct PF-infinity target is impossible (B.2); correct Schoenberg ' +
        'object is reciprocal (B.3).',
    }),
    Object.freeze({
      id: 'app-c-reciprocal-mobius-mollifier',
      sectionNumber: 'App C',
      title: 'Reciprocal Mobius Ladders and the Uniform Mollifier Closure',
      paperPageRange: '71-74',
      appRoute: null,
      appPageStatus: 'planned-imp-1200',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 71-74 — reciprocal Mobius bridge, safe-region tails, ' +
        'mollifier theorem target.',
    }),
    Object.freeze({
      id: 'app-d-reciprocal-mollifier-nyman-beurling',
      sectionNumber: 'App D',
      title: 'Reciprocal Mollifier Certificates and the Nyman-Beurling Fit',
      paperPageRange: '74-78',
      appRoute: null,
      appPageStatus: 'planned-imp-1200',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 74-78 — exact finite Mobius defect; Nyman-Beurling as ' +
        'Hilbert version of reciprocal freezing.',
    }),
    Object.freeze({
      id: 'app-e-reciprocal-schur-lifts',
      sectionNumber: 'App E',
      title: 'Reciprocal Schur Lifts and Two-Step No-Ghost Certificates',
      paperPageRange: '79-83',
      appRoute: null,
      appPageStatus: 'planned-imp-1200',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 79-83 — reciprocal model defect + non-circular residual ' +
        'margin + optimal local reciprocal lift.',
    }),
    Object.freeze({
      id: 'app-f-hardy-corona-extremals',
      sectionNumber: 'App F',
      title: 'Hardy-Corona Extremals for the Reciprocal Schur Lift',
      paperPageRange: '84-87',
      appRoute: null,
      appPageStatus: 'planned-imp-1200',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 84-87 — pointwise extremal geometry; no-free-lunch ' +
        'theorem for unrestricted Schur lifts.',
    }),
    Object.freeze({
      id: 'app-g-restricted-passive-reciprocal-lifts',
      sectionNumber: 'App G',
      title: 'Restricted Passive Reciprocal Lifts and Exhaustion Certificates',
      paperPageRange: '87-91',
      appRoute: null,
      appPageStatus: 'planned-imp-1200',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 87-91 — second-order cone certificate; constrained ' +
        'extremal number; dual obstruction.',
    }),
    Object.freeze({
      id: 'app-h-first-finite-restricted-lift',
      sectionNumber: 'App H',
      title: 'First Finite Restricted-Lift Certificates and Mesh-to-Window Lifting',
      paperPageRange: '92-95',
      appRoute: null,
      appPageStatus: 'has-page',
      auditStatus: 'numerical-pilot',
      summary:
        'First a=0.025 pilot reproduced in imp-1204 (passing); a=0.010 hits ' +
        'central-band conditioning barrier.',
    }),
    Object.freeze({
      id: 'app-i-quantitative-restricted-lift-margins',
      sectionNumber: 'App I',
      title: 'Quantitative Restricted-Lift Margins and the Remaining Uniformity Theorem',
      paperPageRange: '95-98',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 95-98 — least-squares restricted reciprocal lifts; ' +
        'uniform restricted-lift theorem target.',
    }),
    Object.freeze({
      id: 'app-j-pole-regularized-reciprocal-lifts',
      sectionNumber: 'App J',
      title: 'Pole-Regularized Reciprocal Lifts: First Mesh Certificates and a New Conditioning Barrier',
      paperPageRange: '99-101',
      appRoute: null,
      appPageStatus: 'planned-imp-1207',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 99-101 — artificial pole at s=1; pole-regularized basis.',
    }),
    Object.freeze({
      id: 'app-k-interval-mesh-passive-rational',
      sectionNumber: 'App K',
      title: 'Interval Mesh Certificates and Passive Rational Stabilization',
      paperPageRange: '102-106',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 102-106 — mesh-to-window theorem; Cauchy variant; ' +
        'coefficient-radius robustness.',
    }),
    Object.freeze({
      id: 'app-l-guarded-restricted-lift-search',
      sectionNumber: 'App L',
      title: 'Guarded Restricted-Lift Search and the Conditioning Wall',
      paperPageRange: '106-108',
      appRoute: null,
      appPageStatus: 'planned-imp-1207',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 106-108 — guarded mesh results; positive-residue ' +
        'stabilizer pilot.',
    }),
    Object.freeze({
      id: 'app-m-kyp-state-space',
      sectionNumber: 'App M',
      title: 'KYP State-Space Passive Lifts and a Certified Stabilizer Subcone',
      paperPageRange: '109-112',
      appRoute: '/kyp-bounded-real',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'KYP state-space passive lifts; collocated oscillator atoms; full KYP ' +
        'lift target. Live in /kyp-bounded-real (imp-1201).',
    }),
    Object.freeze({
      id: 'app-n-bounded-real-delay-signed-mobius',
      sectionNumber: 'App N',
      title: 'Bounded-Real Delay Lifts and the Signed-Mobius Barrier',
      paperPageRange: '113-115',
      appRoute: '/kyp-bounded-real',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Parallel-delay realization; delay-sector uncertainty; signed-Mobius ' +
        'passive barrier. Live in /kyp-bounded-real.',
    }),
    Object.freeze({
      id: 'app-o-delay-gram-bounded-real',
      sectionNumber: 'App O',
      title: 'Delay-Gram Bounded-Real Certificates',
      paperPageRange: '116-118',
      appRoute: '/kyp-bounded-real',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Window Gram matrix; reproducing leverage bound; robust no-ghost ' +
        'certificate with Gram uncertainty. Live in /kyp-bounded-real.',
    }),
    Object.freeze({
      id: 'app-p-delay-gram-leverage-frame',
      sectionNumber: 'App P',
      title: 'Delay-Gram Leverage Control and Frame Lower Bounds',
      paperPageRange: '119-121',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 119-121 — regularized leverage; mesh-to-window leverage bound.',
    }),
    Object.freeze({
      id: 'app-q-first-guarded-finite-window',
      sectionNumber: 'App Q',
      title: 'First Guarded Finite-Window Certificates and the Leverage Exhaustion Target',
      paperPageRange: '122-125',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 122-125 — guarded finite-window pilot; wider-window failure; ' +
        'leverage-controlled exhaustion theorem.',
    }),
    Object.freeze({
      id: 'app-r-patchwise-reciprocal-lift-sheaves',
      sectionNumber: 'App R',
      title: 'Patchwise Reciprocal Lift Sheaves and Local No-Ghost Certificates',
      paperPageRange: '125-127',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 125-127 — guarded patchwise diagnostic; patchwise ' +
        'exhaustion theorem.',
    }),
    Object.freeze({
      id: 'app-s-adaptive-patch-refinement',
      sectionNumber: 'App S',
      title: 'Adaptive Patch Refinement: First Small-Thickness Stress Test',
      paperPageRange: '128-131',
      appRoute: null,
      appPageStatus: 'planned-imp-1207',
      auditStatus: 'numerical-pilot',
      summary:
        'a=0.025 refinement passes; a=0.010 hits central-band conditioning ' +
        'barrier. Stress-test planned via imp-1207.',
    }),
    Object.freeze({
      id: 'app-t-first-interval-microcell-certificates',
      sectionNumber: 'App T',
      title: 'First Interval-Style Microcell Certificates and the Dependency Barrier',
      paperPageRange: '131-134',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 131-134 — Euler-safe interval model; tested restricted lift; ' +
        'Taylor-ball certificate target.',
    }),
    Object.freeze({
      id: 'app-u-taylor-ball-certificate-engine',
      sectionNumber: 'App U',
      title: 'Taylor-Ball Certificate Engine for Patchwise No-Ghost Proofs',
      paperPageRange: '134-137',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 134-137 — Taylor-ball cells; derivative formulas; Cauchy ' +
        'variant; ball-arithmetic certification protocol.',
    }),
    Object.freeze({
      id: 'app-v-euler-safe-derivative-enclosed-taylor-ball',
      sectionNumber: 'App V',
      title: 'Euler-safe derivative-enclosed Taylor-ball certificates',
      paperPageRange: '137-140',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 137-140 — Euler-safe setup; derivative enclosures; ' +
        'first derivative-enclosed cells.',
    }),
  ]),

  // ── Stand-alone appendices W, X, Y ───────────────────────────────────
  appendicesStandalone: Object.freeze([
    Object.freeze({
      id: 'app-w-glossary',
      sectionNumber: 'App W',
      title: 'Glossary',
      paperPageRange: '140-140',
      appRoute: '/concepts',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary: 'Glossary of twin-ladder terminology.',
    }),
    Object.freeze({
      id: 'app-x-checklist',
      sectionNumber: 'App X',
      title: 'Checklist for twin-ladder experiments',
      paperPageRange: '140-140',
      appRoute: '/rigor-dashboard',
      appPageStatus: 'has-page',
      auditStatus: 'reference-only',
      summary:
        'Operational checklist of items any twin-ladder numerical pilot must satisfy.',
    }),
    Object.freeze({
      id: 'app-y-cauchy-ball-attempt',
      sectionNumber: 'App Y',
      title: 'Cauchy-Ball Attempt and the Need for Direct Derivative Balls',
      paperPageRange: '141-141',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 141 — Cauchy-ball variant; motivation for direct derivative balls.',
    }),
  ]),

  // ── Second appendix run: A..Q (ACB-backed). Disambiguated as App2 X. ─
  appendicesSecondRun: Object.freeze([
    Object.freeze({
      id: 'app2-a-acb-near-critical-taylor',
      sectionNumber: 'App2 A',
      title: 'ACB-Backed Near-Critical Taylor Cells',
      paperPageRange: '142-144',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 142-144 — ACB ball formula for the shifted certificate; ' +
        'first near-critical cells.',
    }),
    Object.freeze({
      id: 'app2-b-acb-patch-level-taylor-covers',
      sectionNumber: 'App2 B',
      title: 'Patch-Level ACB Taylor Covers for Local No-Ghost Certificates',
      paperPageRange: '144-146',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 144-146 — patch-cover geometry; first patch-level ' +
        'certificates; honest scope on what is and is not proved.',
    }),
    Object.freeze({
      id: 'app2-c-uniform-passive-lifts',
      sectionNumber: 'App2 C',
      title: 'Uniform Passive Lifts: Equivalence, Density, and the Remaining Non-Circular Step',
      paperPageRange: '146-150',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 146-150 — local reciprocal certificate; conditional ' +
        'density theorem; remaining non-circular theorem.',
    }),
    Object.freeze({
      id: 'app2-d-attempted-a-priori-passive-margin',
      sectionNumber: 'App2 D',
      title: 'Attempted A Priori Passive Margin Closure and the Exact Non-Circular Obstruction',
      paperPageRange: '150-153',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 150-153 — pointwise extremal value of the certificate; ' +
        'local-density equivalence; non-circular proof requirement.',
    }),
    Object.freeze({
      id: 'app2-e-operational-closure-pieces',
      sectionNumber: 'App2 E',
      title: 'Operational Closure Pieces: Frame Bounds, Passive Blocks, and Terminating Local Certificates',
      paperPageRange: '153-157',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 153-157 — Piece I frame bounds, Piece II passive blocks, ' +
        'Piece III endpoint-Hankel contraction, Piece IV terminating patch certificates.',
    }),
    Object.freeze({
      id: 'app2-f-ridge-leverage-exhaustion',
      sectionNumber: 'App2 F',
      title: 'Ridge-Leverage Exhaustion for Reciprocal Delay Frames',
      paperPageRange: '157-161',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 157-161 — ridge delay-Gram frames; leverage-controlled ' +
        'reciprocal certificates; discrete sampling and frame stability.',
    }),
    Object.freeze({
      id: 'app2-g-shrinking-bridge-margin-scaling',
      sectionNumber: 'App2 G',
      title: 'Shrinking-Bridge Margin Scaling and Adaptive Patch Refinement',
      paperPageRange: '161-164',
      appRoute: null,
      appPageStatus: 'planned-imp-1207',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 161-164 — first-order margin law; adaptive split diagnostics; ' +
        'scaling theorem target.',
    }),
    Object.freeze({
      id: 'app2-h-first-order-hermite-reciprocal-lifts',
      sectionNumber: 'App2 H',
      title: 'First-Order Hermite Reciprocal Lifts and the Stable Patch-Radius Law',
      paperPageRange: '164-167',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 164-167 — ideal local Hermite reciprocal lift; numerical ' +
        'jet-scaling audit; passive Hermite lift theorem target.',
    }),
    Object.freeze({
      id: 'app2-i-infinitesimal-drift-caratheodory',
      sectionNumber: 'App2 I',
      title: 'Infinitesimal Drift Barrier and the Caratheodory No-Ghost Target',
      paperPageRange: '167-171',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 167-171 — margin-drift expansion; off-line zeros generate ' +
        'negative-drift regions; Caratheodory drift theorem.',
    }),
    Object.freeze({
      id: 'app2-j-differential-margin-adaptive-cover',
      sectionNumber: 'App2 J',
      title: 'Differential Margin Law, Adaptive Cover Complexity, and the Next Non-Circular Target',
      paperPageRange: '171-175',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 171-175 — differential margin law; Taylor-cell complexity; ' +
        'second-order and adaptive lifts.',
    }),
    Object.freeze({
      id: 'app2-k-second-order-hermite-curvature',
      sectionNumber: 'App2 K',
      title: 'Second-Order Hermite Reciprocal Lifts and Curvature Certificates',
      paperPageRange: '175-178',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 175-178 — second-order Taylor certificate; Hermite ' +
        'reciprocal lift at a point; diagnostic Hermite fits.',
    }),
    Object.freeze({
      id: 'app2-l-local-hermite-reciprocal-sheaves',
      sectionNumber: 'App2 L',
      title: 'Local Hermite Reciprocal Sheaves and Jet-Level No-Ghost Patches',
      paperPageRange: '178-180',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 178-180 — local Hermite target; second-order patch ' +
        'certificate; diagnostic local Hermite sheaf experiment.',
    }),
    Object.freeze({
      id: 'app2-m-ball-ready-local-hermite',
      sectionNumber: 'App2 M',
      title: 'Ball-Ready Local Hermite Sheaves and Disk-Level Jet Certificates',
      paperPageRange: '181-183',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 181-183 — what remains for a proof-grade implementation.',
    }),
    Object.freeze({
      id: 'app2-n-acb-enclosed-local-hermite',
      sectionNumber: 'App2 N',
      title: 'ACB-Enclosed Local Hermite Disk Certificates',
      paperPageRange: '184-185',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 184-185 — ACB disk certificate; first ACB-enclosed cells.',
    }),
    Object.freeze({
      id: 'app2-o-first-acb-certified-patch-covers',
      sectionNumber: 'App2 O',
      title: 'First ACB-Certified Patch Covers',
      paperPageRange: '186-187',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 186-187 — first certified patch covers + honest scope.',
    }),
    Object.freeze({
      id: 'app2-p-first-acb-certified-strip-segment',
      sectionNumber: 'App2 P',
      title: 'First ACB-Certified Vertical Strip Segment',
      paperPageRange: '188-189',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 188-189 — first certified strip segment; honest scope.',
    }),
    Object.freeze({
      id: 'app2-q-extended-acb-certified-strip-segment',
      sectionNumber: 'App2 Q',
      title: 'Extended ACB-Certified Vertical Strip Segment',
      paperPageRange: '190-191',
      appRoute: null,
      appPageStatus: 'not-covered',
      auditStatus: 'unaudited',
      summary:
        'see PDF page 190-191 — extended certified strip; next scaling step.',
    }),
  ]),

  references: Object.freeze({
    paper:        'research-inputs/twin_ladder_consolidated_v52.pdf',
    closureRoutes: 'src/data/closure-routes-section.js (imp-1197)',
    blaschkeGhosts: 'src/data/blaschke-ghosts-section.js (imp-1198)',
    threeAttacks: 'src/data/three-attacks-section.js (imp-1199)',
    shiftBridge:  'src/data/shift-bridge-positivity-section.js (imp-1196)',
    kypBoundedReal: 'src/data/kyp-bounded-real-section.js (imp-1201)',
    audit_4_5:    'src/data/imp-1163-conjecture-4-5-literature-audit.js',
    audit_15_4:   'src/data/imp-1202-conjecture-15-4-numerical-audit.js',
    audit_17:     'src/data/imp-1209-ghost-count-crosscheck.js',
    audit_22:     'src/data/imp-1210-conjecture-22-literature-audit.js',
  }),
});

// ── Helper: flatten all entries into a single array (page consumers).
// Not frozen because the array literal is built fresh each call. The
// underlying entry objects are frozen.
export function getAllEntries() {
  return [
    ...PAPER_ROADMAP.mainSections,
    ...PAPER_ROADMAP.appendicesFirstRun,
    ...PAPER_ROADMAP.appendicesStandalone,
    ...PAPER_ROADMAP.appendicesSecondRun,
  ];
}

// ── Helper: counts per app-coverage status across ALL entries.
export function getCoverageCounts() {
  const counts = { 'has-page': 0, 'planned': 0, 'not-covered': 0 };
  for (const e of getAllEntries()) {
    if (e.appPageStatus === 'has-page') counts['has-page']++;
    else if (e.appPageStatus.startsWith('planned-')) counts['planned']++;
    else if (e.appPageStatus === 'not-covered') counts['not-covered']++;
  }
  return counts;
}

// ── Helper: counts per audit status across ALL entries.
export function getAuditCounts() {
  const counts = {};
  for (const e of getAllEntries()) {
    counts[e.auditStatus] = (counts[e.auditStatus] || 0) + 1;
  }
  return counts;
}

// ── Build-time tripwires (>= 6) ──────────────────────────────────────
// Loaded by scripts/run-assertions.mjs; failing tripwires fail the build.

const ALLOWED_AUDIT_STATUSES = new Set([
  'audited-subsumed',
  'audited-partial',
  'audited-independent',
  'literature-audited',
  'numerical-pilot',
  'reference-only',
  'unaudited',
]);

function entryShapeOk(e) {
  if (!e || typeof e !== 'object') return false;
  if (typeof e.id !== 'string' || e.id.length < 4) return false;
  if (typeof e.sectionNumber !== 'string') return false;
  if (typeof e.title !== 'string' || e.title.length < 5) return false;
  if (typeof e.paperPageRange !== 'string' || !/^\d+-\d+$/.test(e.paperPageRange)) return false;
  if (e.appRoute !== null && (typeof e.appRoute !== 'string' || !e.appRoute.startsWith('/'))) return false;
  if (typeof e.appPageStatus !== 'string') return false;
  if (typeof e.summary !== 'string' || e.summary.length < 10) return false;
  if (!ALLOWED_AUDIT_STATUSES.has(e.auditStatus)) return false;
  return true;
}

function pageStatusOk(s) {
  return s === 'has-page' || s === 'not-covered' || /^planned-imp-\d+$/.test(s);
}

export const PAPER_ROADMAP_ASSERTIONS = [
  {
    id: 'imp1217-29-main-sections-present',
    why:
      'The paper has exactly 29 numbered main sections (§1..§29). Drift in ' +
      'the main-section count would silently misrepresent the paper structure.',
    holds: () =>
      Array.isArray(PAPER_ROADMAP.mainSections) &&
      PAPER_ROADMAP.mainSections.length === 29 &&
      PAPER_ROADMAP.mainSections.every((e, idx) =>
        e.sectionNumber === `§${idx + 1}`
      ),
  },
  {
    id: 'imp1217-appendix-counts-correct',
    why:
      'First appendix run A..V = 22 entries; standalones W/X/Y = 3 entries; ' +
      'second run A..Q = 17 entries. Total 42 appendix entries.',
    holds: () =>
      PAPER_ROADMAP.appendicesFirstRun.length === 22 &&
      PAPER_ROADMAP.appendicesStandalone.length === 3 &&
      PAPER_ROADMAP.appendicesSecondRun.length === 17 &&
      getAllEntries().length === 29 + 22 + 3 + 17,
  },
  {
    id: 'imp1217-every-entry-shape-valid',
    why:
      'Every entry must carry the required fields (id, sectionNumber, title, ' +
      'paperPageRange "X-Y", appRoute null or "/...", appPageStatus in the ' +
      'allowed set, summary >=10 chars, auditStatus in the allowed set).',
    holds: () => getAllEntries().every(entryShapeOk),
  },
  {
    id: 'imp1217-app-page-status-valid',
    why:
      'appPageStatus must be one of has-page, not-covered, or planned-imp-NNNN. ' +
      'Any other value breaks the legend in the companion page.',
    holds: () => getAllEntries().every((e) => pageStatusOk(e.appPageStatus)),
  },
  {
    id: 'imp1217-app-coverage-counts-correct',
    why:
      'Coverage counts must sum to total-entry count (29+22+3+17=71). Any ' +
      'sum mismatch indicates a typo in appPageStatus that the legend would silently hide.',
    holds: () => {
      const c = getCoverageCounts();
      return c['has-page'] + c['planned'] + c['not-covered'] === getAllEntries().length;
    },
  },
  {
    id: 'imp1217-known-has-page-routes-actually-exist',
    why:
      'For the small set of routes we know exist today (§15-§18 paper sections ' +
      'plus the KYP page from imp-1201), the entry must claim has-page. Drift ' +
      'in either direction (e.g., demotion of /closure-routes to planned) breaks ' +
      'the dashboard counts.',
    holds: () => {
      const required = new Map([
        ['s15-shift-bridge-positivity', '/shift-bridge-positivity'],
        ['s16-four-closure-routes',    '/closure-routes'],
        ['s17-inverse-blaschke-ghosts', '/blaschke-ghosts'],
        ['s18-three-direct-attacks',   '/three-attacks'],
        ['app-m-kyp-state-space',      '/kyp-bounded-real'],
      ]);
      for (const [id, route] of required) {
        const hit = getAllEntries().find((e) => e.id === id);
        if (!hit) return false;
        if (hit.appPageStatus !== 'has-page') return false;
        if (hit.appRoute !== route) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1217-audit-counts-non-trivial',
    why:
      'At least 5 entries must carry a non-trivial audit status (anything ' +
      'other than unaudited or reference-only). This pins the load-bearing ' +
      'audit lineage of imp-1163, imp-1202, imp-1209, imp-1210.',
    holds: () => {
      const c = getAuditCounts();
      const trivial = (c['unaudited'] || 0) + (c['reference-only'] || 0);
      return getAllEntries().length - trivial >= 5;
    },
  },
  {
    id: 'imp1217-paper-metadata-pinned',
    why:
      'Paper metadata (total pages 191, main-section count 29, version v52) ' +
      'must match the actual PDF. Drift would mis-attribute the roadmap.',
    holds: () =>
      PAPER_ROADMAP.paperTotalPages === 191 &&
      PAPER_ROADMAP.paperMainSectionCount === 29 &&
      PAPER_ROADMAP.paperVersion.includes('v52') &&
      PAPER_ROADMAP.paperSourcePath === 'research-inputs/twin_ladder_consolidated_v52.pdf',
  },
  {
    id: 'imp1217-ids-unique',
    why:
      'Entry ids are used as React keys and URL fragments. Duplicates would ' +
      'corrupt navigation and silently render only one of the duplicates.',
    holds: () => {
      const ids = getAllEntries().map((e) => e.id);
      return new Set(ids).size === ids.length;
    },
  },
];
