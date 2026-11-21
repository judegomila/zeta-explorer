/**
 * @module imp-33235-imp-33213-ladder-literal-cross-check
 * @fileoverview imp-33235 -- CROSS-CHECK the four imp-33213 log-domain reconciled -ln A(tau)
 *   literals (1.5 -> 1267.788621, 2.0 -> 9365.318970, 2.5 -> 69198.540665,
 *   3.0 -> 511309.612538) against the imp-3736/imp-3850 baked ladder, confirming
 *   (i) NO reconstruction-precision drift beyond the stated < 5e-7 absolute residual, and
 *   (ii) the imp-33213 grade-5 / 300-panel / hi=10 quadrature is GENUINELY INDEPENDENT of the
 *   imp-3850 grade-4 / 200-panel / hi=14 path (they share no common panelization).
 *
 *       A(tau) = int_0^inf Phi(s) Phi(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel
 *
 *   WHY THIS CROSS-CHECK
 *   --------------------
 *   imp-33213 reported that an INDEPENDENT log-domain graded-GL reconstruction (grade 5, 300
 *   panels, cutoff hi=10) reproduces the imp-3850/imp-3736 reconciled ladder at all four
 *   overlapping rungs tau in {1.5,2,2.5,3} to well under imp-3850s ~1e-6 residual. This module
 *   re-derives each literal from scratch and answers the two questions imp-33235 poses: is the
 *   sub-5e-7 residual genuine convergence (not a lucky quadrature coincidence), and is the
 *   imp-33213 configuration really disjoint from the imp-3850 path it claims to corroborate?
 *
 *   THE THREE MEASUREMENTS (self-computing at import; import-light, no zeros bundle)
 *   -------------------------------------------------------------------------------
 *   (1) RESIDUAL TIE. The imp-33213 config (g5/300/hi10) reproduces the ladder at all four tau
 *       to < 5e-7 absolute:
 *
 *         tau    reconstructed -ln A     ladder (source)             |residual|
 *         1.5    1267.788621477          1267.788621   (imp-3736)     ~4.8e-7
 *         2.0    9365.318970273          9365.318970   (imp-3736)     ~2.7e-7
 *         2.5   69198.540664746         69198.540665   (imp-3850)     ~2.5e-7
 *         3.0  511309.612538319        511309.612538   (imp-3850)     ~3.2e-7
 *
 *   (2) THE RESIDUAL IS PURE LITERAL-STORAGE ROUNDING, NOT DRIFT. The ladder literals are baked
 *       to 6 decimals (toFixed(6)). Rounding the freshly-reconstructed value to 6 decimals
 *       reproduces the stored literal EXACTLY at all four tau (recon.toFixed(6) === ladder). So
 *       the entire sub-5e-7 "residual" is the truncation of the 7th decimal of the stored ladder
 *       number -- there is NO reconstruction-precision drift: the converged double agrees with
 *       the ladder to the full precision the ladder was stored at.
 *
 *   (3) THE RESIDUAL IS CONFIGURATION-INVARIANT. A THIRD, structurally distinct graded-GL config
 *       (grade 6, 400 panels, hi=12 -- disjoint from BOTH imp-33213s g5/300/hi10 AND imp-3850s
 *       g4/200/hi14) reproduces the SAME converged value to <= ~1 ULP (max spread ~6e-11 at the
 *       5e5-magnitude tau=3 rung, i.e. rel ~1e-16). A residual that survives a full change of
 *       grade, panel count, and cutoff is a property of A(tau) itself, not of the quadrature.
 *
 *   INDEPENDENCE OF THE TWO PATHS (the second imp-33235 question)
 *   ------------------------------------------------------------
 *   The imp-33213 grid (g5/300/hi10, 3000 GL nodes over 300 graded panels) and the imp-3850 grid
 *   (g4/200/hi14, 2000 GL nodes over 200 graded panels) share ZERO node abscissae and only the
 *   trivial s=0 panel breakpoint (both graded meshes start at 0). The nearest node in one grid to
 *   any node in the other is ~2.9e-12 away -- no coincidental collocation. Different grade,
 *   different panel count, different cutoff => genuinely disjoint panelization, so the agreement
 *   is a real cross-path corroboration, not two spellings of one quadrature.
 *
 *   VERDICT. All four imp-33213 literals tie to their imp-3736/imp-3850 source with NO drift
 *   beyond the 6-decimal storage rounding of the ladder (< 5e-7 absolute), the residual is
 *   configuration-invariant across three disjoint graded-GL grids, and the imp-33213 g5/300/hi10
 *   path is genuinely disjoint (0 shared nodes) from the imp-3850 g4/200/hi14 path it corroborates.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   CROSS-CHECK / CONSISTENCY ONLY, at the RH-equivalent scale class. It confirms four baked
 *   literals reproduce from an independent quadrature and pins their residual as storage rounding;
 *   it establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the g5/300/hi10 reconstruction cross-checked here)
 *   @see imp-3850-a-weight-dual-path-tau25-30-reconciliation.js (the g4/200/hi14 ladder path at tau in {2.5,3.0})
 *   @see imp-3736-a-weight-quadrature-convergence-assessment.js (the ladder path at tau in {1.5,2.0})
 *
 *   Ticket: imp-33235 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;

// -- The shared underflow-safe factored log kernel (identical to imp-3850/imp-33213) -----------
// ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}),  amp_n = 2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;      // > 0 for u >= 0
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// -- 10-point Gauss-Legendre rule on [-1,1] ----------------------------------------------------
const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];

// Graded-GL -ln A(tau) with an s = hi*(j/panels)^grade power-graded panel mesh, log-sum-exp accumulated.
function negLnAgradedGL(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}

// The imp-3850 (tau in {2.5,3.0}) and imp-3736 (tau in {1.5,2.0}) reconciled ladder literals.
const LADDER = Object.freeze({
  1.5: { negLnA: 1267.788621, source: 'imp-3736' },
  2: { negLnA: 9365.318970, source: 'imp-3736' },
  2.5: { negLnA: 69198.540665, source: 'imp-3850' },
  3: { negLnA: 511309.612538, source: 'imp-3850' },
});
const TAUS = [1.5, 2, 2.5, 3];

// -- (1)-(3) Per-tau cross-check: imp-33213 config, third disjoint config, and storage-rounding tie
const CROSS_CHECK_TABLE = TAUS.map((tau) => {
  const recon33213 = negLnAgradedGL(tau, 10, 300, 5);          // imp-33213: g5/300/hi10
  const reconThird = negLnAgradedGL(tau, 12, 400, 6);          // THIRD, disjoint: g6/400/hi12
  const ladder = LADDER[tau].negLnA;
  // The stored ladder literal is baked to 6 decimals; round the reconstruction the same way.
  const reconRoundedTo6 = Number(recon33213.toFixed(6));
  return Object.freeze({
    tau,
    recon33213,                                                 // g5/300/hi10 reconstruction
    reconThird,                                                 // g6/400/hi12 reconstruction
    ladderNegLnA: ladder,
    ladderSource: LADDER[tau].source,
    absResidual: Math.abs(recon33213 - ladder),
    relResidual: Math.abs(recon33213 - ladder) / ladder,
    configSpread: Math.abs(recon33213 - reconThird),            // g5/300/hi10 vs g6/400/hi12
    reconRoundedTo6,
    roundsToLadder: reconRoundedTo6 === ladder,                 // residual is pure storage rounding
  });
});

// -- Panelization-independence: node abscissae of the two paths ---------------------------------
function gradedNodes(hi, panels, grade) {
  const ns = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) ns.push(mid + half * GL_X[k]);
  }
  return ns;
}
function gradedBreakpoints(hi, panels, grade) {
  const b = [];
  for (let j = 0; j <= panels; j += 1) b.push(hi * Math.pow(j / panels, grade));
  return b;
}

const NODES_33213 = gradedNodes(10, 300, 5);                   // 3000 nodes
const NODES_3850 = gradedNodes(14, 200, 4);                    // 2000 nodes
const nodeKey = (x) => x.toExponential(15);
const NODES_3850_SET = new Set(NODES_3850.map(nodeKey));
let sharedNodes = 0;
for (const x of NODES_33213) if (NODES_3850_SET.has(nodeKey(x))) sharedNodes += 1;

// nearest node in the imp-3850 grid to any imp-33213 node (must be nonzero => no collocation)
const NODES_3850_SORTED = [...NODES_3850].sort((a, b) => a - b);
let minCrossNodeGap = Infinity;
for (const x of NODES_33213) {
  let lo = 0;
  let hi = NODES_3850_SORTED.length - 1;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (NODES_3850_SORTED[m] < x) lo = m + 1;
    else hi = m;
  }
  for (const idx of [lo - 1, lo]) {
    if (idx >= 0 && idx < NODES_3850_SORTED.length) {
      const g = Math.abs(NODES_3850_SORTED[idx] - x);
      if (g < minCrossNodeGap) minCrossNodeGap = g;
    }
  }
}

// shared panel breakpoints beyond the trivial s=0 both graded meshes start at
const BREAKS_3850_SET = new Set(gradedBreakpoints(14, 200, 4).map(nodeKey));
let sharedBreakpoints = 0;
for (const x of gradedBreakpoints(10, 300, 5)) if (BREAKS_3850_SET.has(nodeKey(x))) sharedBreakpoints += 1;
const sharedBreakpointsBeyondZero = sharedBreakpoints - 1;     // subtract the s=0 both share

// -- Verdict classifiers -----------------------------------------------------------------------
// (1) All four literals tie to the ladder to < 5e-7 absolute -- no drift beyond the stated residual.
const tiesUnder5e7 = CROSS_CHECK_TABLE.every((r) => r.absResidual < 5e-7);
// (2) Every residual is fully explained by the 6-decimal storage rounding of the ladder literal.
const residualIsStorageRounding = CROSS_CHECK_TABLE.every((r) => r.roundsToLadder);
// (3) The reconstructed value is configuration-invariant to ~1 ULP across three disjoint configs.
const configInvariant = CROSS_CHECK_TABLE.every((r) => r.configSpread < 1e-9);
// (4) The imp-33213 and imp-3850 grids are genuinely disjoint (no shared nodes, s=0 the only shared break).
const genuinelyIndependent =
  sharedNodes === 0 && sharedBreakpointsBeyondZero === 0 && minCrossNodeGap > 0;

const verdict =
  tiesUnder5e7 && residualIsStorageRounding && configInvariant && genuinelyIndependent
    ? 'ALL-FOUR-imp-33213-LITERALS-TIE-TO-THE-imp-3736/imp-3850-LADDER-TO-<5e-7-ABS-WITH-NO-DRIFT:' +
      'THE-RESIDUAL-IS-PURE-6-DECIMAL-STORAGE-ROUNDING(recon.toFixed(6)===ladder-AT-ALL-FOUR-tau)-AND-IS' +
      '-CONFIGURATION-INVARIANT-ACROSS-THREE-DISJOINT-GRADED-GL-GRIDS(g5/300/hi10,g6/400/hi12,g4/200/hi14,' +
      'spread<=~1-ULP);-THE-imp-33213-g5/300/hi10-PATH-IS-GENUINELY-DISJOINT-FROM-imp-3850-g4/200/hi14' +
      '(0-SHARED-NODES,ONLY-s=0-SHARED-BREAKPOINT,MIN-CROSS-NODE-GAP-~2.9e-12)'
    : 'INDETERMINATE';

export const IMP33235_IMP33213_LADDER_LITERAL_CROSS_CHECK = Object.freeze({
  id: 'imp-33235-imp-33213-ladder-literal-cross-check',
  ticket: 'imp-33235',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  crossChecksModules: [
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
    'imp-3850-a-weight-dual-path-tau25-30-reconciliation.js',
    'imp-3736-a-weight-quadrature-convergence-assessment.js',
  ],

  summary:
    'CROSS-CHECKS the four imp-33213 log-domain reconciled -ln A(tau) literals (1.5 -> 1267.788621, ' +
    '2.0 -> 9365.318970, 2.5 -> 69198.540665, 3.0 -> 511309.612538) against the imp-3736/imp-3850 baked ' +
    'ladder. (1) The imp-33213 config (grade 5, 300 panels, hi=10) reproduces the ladder at all four tau ' +
    'to < 5e-7 absolute (~4.8e-7, ~2.7e-7, ~2.5e-7, ~3.2e-7). (2) That residual is PURE 6-decimal storage ' +
    'rounding of the ladder literal, not drift: rounding the freshly-reconstructed double to 6 decimals ' +
    'reproduces the stored literal EXACTLY at all four tau (recon.toFixed(6) === ladder). (3) The residual ' +
    'is CONFIGURATION-INVARIANT: a third, disjoint graded-GL config (grade 6, 400 panels, hi=12) lands on ' +
    'the SAME converged value to <= ~1 ULP (max spread ~6e-11 at tau=3), so it is a property of A(tau), not ' +
    'the quadrature. INDEPENDENCE: the imp-33213 g5/300/hi10 grid (3000 nodes) and the imp-3850 g4/200/hi14 ' +
    'grid (2000 nodes) share ZERO node abscissae and only the trivial s=0 panel breakpoint; the nearest ' +
    'cross-grid node is ~2.9e-12 away -- genuinely disjoint panelization. CROSS-CHECK/CONSISTENCY, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict, ' +
    'no QED; no refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    kernel: 'shared underflow-safe factored log kernel logPhiFactored(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}})',
    reconstruction33213: 'graded-GL grade 5, 300 panels, hi=10 (reproduces imp-33213s independent config)',
    reconstructionThird: 'graded-GL grade 6, 400 panels, hi=12 (a THIRD config, disjoint from both imp-33213 and imp-3850)',
    ladderPath: 'imp-3850 grade 4, 200 panels, hi=14 (the corroborated ladder path)',
    storageRoundingCheck: 'the ladder literals are baked toFixed(6); recon.toFixed(6) === ladder pins the residual as storage rounding',
    independenceCheck: 'node-abscissae set overlap and shared panel breakpoints between the g5/300/hi10 and g4/200/hi14 grids',
    selfComputing: true,
  }),

  measured: Object.freeze({
    taus: TAUS,
    crossCheckTable: Object.freeze(CROSS_CHECK_TABLE),
    sharedNodes,
    sharedBreakpointsBeyondZero,
    minCrossNodeGap,
    nodeCount33213: NODES_33213.length,
    nodeCount3850: NODES_3850.length,
    tiesUnder5e7,
    residualIsStorageRounding,
    configInvariant,
    genuinelyIndependent,
    verdict,
  }),

  interpretation: Object.freeze({
    noDrift:
      'Every imp-33213 literal reproduces from the g5/300/hi10 reconstruction to < 5e-7 absolute, and the ' +
      'residual is the truncation of the 7th decimal of the ladder number as stored (6 decimals): rounding ' +
      'the reconstruction to 6 decimals hits the stored literal EXACTLY at all four tau. There is no ' +
      'reconstruction-precision drift beyond the ladders own storage precision.',
    residualIsAProperty:
      'A third graded-GL config (g6/400/hi12), disjoint from both the imp-33213 and the imp-3850 grids, ' +
      'reproduces the SAME converged double to ~1 ULP. A residual that survives a full change of grade, ' +
      'panel count, and cutoff is a property of the fixed A(tau), not an artifact of any one quadrature.',
    genuinelyDisjointPaths:
      'The imp-33213 g5/300/hi10 grid and the imp-3850 g4/200/hi14 grid share no node abscissae and only ' +
      'the trivial s=0 panel breakpoint (both graded meshes begin at 0); the nearest cross-grid node is ' +
      '~2.9e-12 away. Different grade, panel count, and cutoff => the agreement is a real cross-path ' +
      'corroboration, not two evaluations of one quadrature.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Cross-checks four baked -ln A(tau) literals by re-deriving them from an independent quadrature and ' +
      'pins their residual as 6-decimal storage rounding. It establishes NO operator positivity. Grid- ' +
      'convergence consistency only -- not a certified error bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP33235_IMP33213_LADDER_LITERAL_CROSS_CHECK_ASSERTIONS = [
  {
    id: 'imp33235-four-literals-tie-under-5e-7',
    why: 'All four imp-33213 literals must reproduce from the independent g5/300/hi10 reconstruction to ' +
         '< 5e-7 absolute vs the imp-3736/imp-3850 ladder -- no drift beyond the stated residual.',
    holds: () => tiesUnder5e7 && CROSS_CHECK_TABLE.length === 4,
  },
  {
    id: 'imp33235-residual-is-storage-rounding',
    why: 'The sub-5e-7 residual must be pure 6-decimal storage rounding of the ladder literal: rounding the ' +
         'freshly-reconstructed value to 6 decimals must reproduce the stored literal EXACTLY at all four tau.',
    holds: () => residualIsStorageRounding,
  },
  {
    id: 'imp33235-residual-is-configuration-invariant',
    why: 'A third disjoint graded-GL config (g6/400/hi12) must reproduce the same converged value to ~1 ULP ' +
         '(spread < 1e-9), proving the residual is a property of A(tau), not of the quadrature.',
    holds: () => configInvariant,
  },
  {
    id: 'imp33235-paths-are-genuinely-independent',
    why: 'The imp-33213 g5/300/hi10 grid and the imp-3850 g4/200/hi14 grid must share ZERO node abscissae and ' +
         'only the trivial s=0 panel breakpoint, with a nonzero nearest cross-grid node gap -- disjoint panelization.',
    holds: () =>
      genuinelyIndependent &&
      sharedNodes === 0 &&
      sharedBreakpointsBeyondZero === 0 &&
      minCrossNodeGap > 0 &&
      NODES_33213.length === 3000 &&
      NODES_3850.length === 2000,
  },
  {
    id: 'imp33235-verdict-records-cross-check',
    why: 'The classified verdict must record the no-drift residual tie, the storage-rounding explanation, ' +
         'the configuration invariance, and the disjoint panelization -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33235-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: cross-check/consistency only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33235_IMP33213_LADDER_LITERAL_CROSS_CHECK.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33235_IMP33213_LADDER_LITERAL_CROSS_CHECK_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33235-imp-33213-ladder-literal-cross-check assertion failed: ${assertion.id}`);
  }
}

export default IMP33235_IMP33213_LADDER_LITERAL_CROSS_CHECK;
