// @module imp-2491-esy-obstacle-coupling-matrix
// imp-2491 (improvement for ticket imp-370, high, proof): SYNTHESIS across the
// three independent ESY-port obstacle audits. The per-obstacle audits each
// answer "is THIS obstacle closable?" in isolation:
//   O1 -> esy-o1-closure.js          (imp-508; partial, residual C_poly < 1)
//   O2 -> imp-2492-...o2-backward... (imp-2492; backward heat ill-posed)
//   O3 -> imp-2493-...o3-derandom... (imp-2493; high-prob does not derandomize)
// What NO existing file answers is the JOINT question: which single research
// input would close which obstacles, and therefore how many INDEPENDENT inputs
// the imp-370 angle (b) route actually needs before it stops being conditional.
// This module builds that coupling matrix and computes the minimum-input lower
// bound and the highest-leverage research direction.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'esy-port-needs-two-orthogonal-inputs-arithmetic-and-pde'
//
// The three obstacles do NOT lie on one axis. O1 (sub-Selberg discrepancy for
// the deterministic zeros) and O3 (high-probability to deterministic
// derandomization) both live on an ARITHMETIC / EQUIDISTRIBUTION axis: a single
// quantitative GUE-equidistribution / Bourgade-rigidity input for {gamma_k}
// addresses O3 fully and O1 (at the pair-correlation level) simultaneously --
// this is exactly approachSuggestion (i) in esy-rigidity-port.js. O2, by
// contrast, is a PDE WELL-POSEDNESS fact (the backward de Bruijn heat flow is
// ill-posed, imp-2492): no equidistribution or discrepancy statement touches it;
// only a backward-stability / unique-continuation (Tao-Vu time-reversal,
// Carleman, logarithmic-convexity) input can. These two axes are ORTHOGONAL, so
// NO single currently-conceived input closes all three obstacles. The minimum
// number of independent research-grade inputs to close angle (b) is therefore at
// least TWO -- one arithmetic, one PDE -- not one. The highest-leverage single
// lever is the GUE-equidistribution input (it spans O1 + O3); even granting it,
// O2 still demands a separate backward-stability input. imp-370 angle (b) is NOT
// closed by this synthesis; it quantifies the distance-to-closure as >= 2
// independent inputs across two orthogonal axes.
//
// HONESTY: this does NOT close O1, O2, O3, or imp-370. It is a SCOPING /
// dependency-structure record that turns three isolated "still open" verdicts
// into a single statement about how many independent breakthroughs are required
// and which one has the most leverage.
//
// SYNTAX SAFETY: no star-slash sequences in comments; single-quoted strings
// contain no apostrophes; subscripts written as k_{max}, C_{poly} in prose.
//
// @see imp-370   -- the ticket (close imp-348 angle (b) via local-law rigidity)
// @see imp-407   -- esy-rigidity-port.js (O1/O2/O3 + OPEN_SUB_GAPS + approachSuggestions)
// @see imp-508   -- esy-o1-closure.js (O1 partial closure; residual C_{poly} < 1)
// @see imp-2492  -- O2 backward-flow ill-posedness audit (this run is its sibling)
// @see imp-2493  -- O3 derandomization audit (high-prob does not transfer)

// =========================================================================
// SECTION (a) -- The three obstacles, tagged by their structural AXIS.
// =========================================================================
//
// Two orthogonal axes:
//   ARITHMETIC  : equidistribution / discrepancy / concentration of the fixed
//                 deterministic sequence {gamma_k}. Hosts O1 and O3.
//   PDE         : well-posedness of the backward de Bruijn-Newman heat flow.
//                 Hosts O2 alone.

const OBSTACLE_AXES = Object.freeze({
  O1: {
    subGapId: 'esy-port-O1-unconditional-rigidity',
    axis: 'arithmetic',
    state: 'partial', // C_{poly} = 1 baseline closed (imp-508); residual C_{poly} < 1 open.
    residual: 'O1-remaining-concentration (sub-Selberg discrepancy, C_{poly} < 1)',
    audit: 'esy-o1-closure.js (imp-508)',
  },
  O2: {
    subGapId: 'esy-port-O2-backward-flow-coupling',
    axis: 'pde',
    state: 'open',
    residual: 'backward de Bruijn heat flow is ill-posed (exp(+t k^2) amplification)',
    audit: 'imp-2492-esy-o2-backward-flow-illposedness-audit.js',
  },
  O3: {
    subGapId: 'esy-port-O3-derandomization',
    axis: 'arithmetic',
    state: 'open',
    residual: 'a measure-1 ensemble set can exclude the single fixed sequence {gamma_k}',
    audit: 'imp-2493-esy-o3-derandomization-audit.js',
  },
});

// =========================================================================
// SECTION (b) -- Candidate research inputs and what each one closes.
// =========================================================================
//
// closes value semantics per obstacle: 'full' | 'partial' | 'none'.
// These reflect the project narrative: approachSuggestion (i) of
// esy-rigidity-port.js states a GUE-equidistribution input addresses O3 and
// PARTIALLY O1; approachSuggestion (ii) is the Tao-Vu time-reversal route for
// O2; the O1 residual (C_{poly} < 1) is a sub-Selberg discrepancy bound.

const CANDIDATE_INPUTS = Object.freeze({
  gueEquidistribution: {
    name: 'Quantitative GUE-equidistribution / Bourgade rigidity for {gamma_k}',
    references: 'Montgomery-Dyson pair correlation; Bourgade rigidity; Rudnick-Sarnak n-level',
    axis: 'arithmetic',
    closes: { O1: 'partial', O2: 'none', O3: 'full' },
    note:
      'A statement that the deterministic zeros equidistribute like a GUE ' +
      'sample. Derandomizes O3 fully and supplies the pair-correlation level ' +
      'of O1; says nothing about backward-flow well-posedness (O2).',
  },
  backwardStability: {
    name: 'Backward-stability / unique-continuation for the de Bruijn-Newman flow',
    references: 'Tao-Vu time-reversal coupling; Carleman / logarithmic-convexity estimate',
    axis: 'pde',
    closes: { O1: 'none', O2: 'full', O3: 'none' },
    note:
      'Tames the exp(+t k^2) backward amplification on the relevant frequency ' +
      'band. Purely a PDE well-posedness input; orthogonal to equidistribution.',
  },
  subSelbergDiscrepancy: {
    name: 'Sub-Selberg deterministic discrepancy bound (C_{poly} < 1)',
    references: 'new exponential-sum / Montgomery PCC-level estimate for the zeros',
    axis: 'arithmetic',
    closes: { O1: 'full', O2: 'none', O3: 'none' },
    note:
      'Closes the residual O1-remaining-concentration directly. A strict ' +
      'subset (pair-correlation consequence) of the gueEquidistribution input.',
  },
});

// =========================================================================
// SECTION (c) -- Leverage and the minimum-input lower bound.
// =========================================================================
//
// leverage(input) = number of obstacles the input closes fully OR partially.
// minimumIndependentInputsLowerBound: the decisive rigorous claim. Because O2
// sits on the PDE axis and ONLY backwardStability touches it, while every other
// obstacle sits on the arithmetic axis, the obstacle set cannot be covered by
// fewer than 2 inputs drawn from 2 distinct axes. So the lower bound is 2, and
// no single input closes all three.

function obstaclesTouchedBy(input) {
  return Object.values(input.closes).filter((v) => v === 'full' || v === 'partial').length;
}

function inputClosesAll(input) {
  return input.closes.O1 === 'full' && input.closes.O2 === 'full' && input.closes.O3 === 'full';
}

const LEVERAGE = Object.freeze({
  gueEquidistribution: obstaclesTouchedBy(CANDIDATE_INPUTS.gueEquidistribution), // 2 (O1 partial + O3 full)
  backwardStability: obstaclesTouchedBy(CANDIDATE_INPUTS.backwardStability), // 1 (O2)
  subSelbergDiscrepancy: obstaclesTouchedBy(CANDIDATE_INPUTS.subSelbergDiscrepancy), // 1 (O1)
});

const HIGHEST_LEVERAGE_INPUT = 'gueEquidistribution';

// The arithmetic axis can be covered by a single input (gueEquidistribution
// spans O1 + O3). The PDE axis (O2) requires a separate input. Two axes, each
// needing at least one input -> lower bound 2.
const DISTINCT_AXES_WITH_OPEN_OBSTACLES = Array.from(
  new Set(
    Object.values(OBSTACLE_AXES)
      .filter((o) => o.state !== 'closed')
      .map((o) => o.axis),
  ),
);
const MINIMUM_INDEPENDENT_INPUTS_LOWER_BOUND = DISTINCT_AXES_WITH_OPEN_OBSTACLES.length; // = 2

const VERDICT = 'esy-port-needs-two-orthogonal-inputs-arithmetic-and-pde';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2491_ESY_OBSTACLE_COUPLING_MATRIX = Object.freeze({
  id: 'imp-2491',
  ticket: 'imp-370',
  synthesisOf: Object.freeze(['imp-508 (O1)', 'imp-2492 (O2)', 'imp-2493 (O3)']),
  axis: 'joint dependency structure across the three obstacle axes',
  question:
    'Each obstacle audit answers closability in isolation. Jointly: which ' +
    'single research input closes which obstacles, and how many INDEPENDENT ' +
    'inputs does imp-370 angle (b) need before it stops being conditional?',
  obstacleAxes: OBSTACLE_AXES,
  candidateInputs: CANDIDATE_INPUTS,
  leverage: LEVERAGE,
  highestLeverageInput: HIGHEST_LEVERAGE_INPUT,
  distinctAxesWithOpenObstacles: DISTINCT_AXES_WITH_OPEN_OBSTACLES,
  minimumIndependentInputsLowerBound: MINIMUM_INDEPENDENT_INPUTS_LOWER_BOUND,
  verdict: VERDICT,
  couplingClosesTicket: false,
  noSingleInputClosesAll: true,
  finding:
    'O1 and O3 lie on one ARITHMETIC / equidistribution axis (a single ' +
    'GUE-equidistribution input spans both -- approachSuggestion (i)); O2 lies ' +
    'on an orthogonal PDE well-posedness axis (only a backward-stability input ' +
    'reaches it). Hence no single input closes all three, and the minimum ' +
    'number of independent research-grade inputs to close angle (b) is at ' +
    'least 2: one arithmetic, one PDE. Highest leverage: the GUE-equidistribution ' +
    'input (closes O1 + O3); even granting it, O2 remains.',
  honestScope: Object.freeze([
    'This synthesis does NOT close O1, O2, O3, or imp-370 angle (b). It records ' +
    'the dependency structure linking the three previously-isolated obstacle ' +
    'audits and converts three separate "still open" verdicts into one ' +
    'statement: angle (b) needs >= 2 independent inputs across 2 orthogonal axes.',
    'The rigorous, defensible core is the LOWER BOUND >= 2 (and the negative ' +
    '"no single input closes all three"), which follows purely from O2 being ' +
    'the unique obstacle on the PDE axis while every other obstacle is on the ' +
    'arithmetic axis. The exact value (2 vs 3) depends on whether the ' +
    'GUE-equidistribution input fully closes O1 or only its pair-correlation ' +
    'level, leaving the residual O1-remaining-concentration to a separate ' +
    'sub-Selberg discrepancy input.',
    'Decision-relevance: the highest-leverage research direction is the ' +
    'GUE-equidistribution / Bourgade-rigidity input (leverage 2), matching ' +
    'approachSuggestion (i) of esy-rigidity-port.js; the backward-stability ' +
    'input for O2 cannot be substituted by any arithmetic progress.',
  ]),
  parallelTickets: Object.freeze(['imp-370', 'imp-407', 'imp-508', 'imp-2492', 'imp-2493']),
});

export default IMP2491_ESY_OBSTACLE_COUPLING_MATRIX;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2491_ESY_OBSTACLE_COUPLING_MATRIX_ASSERTIONS = [
  {
    id: 'imp2491-no-single-input-closes-all',
    holds: () => {
      const inputs = Object.values(IMP2491_ESY_OBSTACLE_COUPLING_MATRIX.candidateInputs);
      const anyClosesAll = inputs.some(
        (i) => i.closes.O1 === 'full' && i.closes.O2 === 'full' && i.closes.O3 === 'full',
      );
      return anyClosesAll === false && IMP2491_ESY_OBSTACLE_COUPLING_MATRIX.noSingleInputClosesAll === true;
    },
    why:
      'The central negative: no single currently-conceived research input closes ' +
      'all of O1, O2, O3. If some input were marked as closing all three, the ' +
      'route would be one-breakthrough-conditional, contradicting the orthogonal ' +
      'two-axis structure (arithmetic O1/O3 vs PDE O2) this synthesis establishes.',
  },
  {
    id: 'imp2491-O2-is-the-only-pde-axis-obstacle',
    holds: () => {
      const ax = IMP2491_ESY_OBSTACLE_COUPLING_MATRIX.obstacleAxes;
      const pdeObstacles = Object.entries(ax).filter(([, o]) => o.axis === 'pde').map(([k]) => k);
      const inputs = IMP2491_ESY_OBSTACLE_COUPLING_MATRIX.candidateInputs;
      // Only the backwardStability input reaches O2; no arithmetic input touches it.
      const onlyBackwardTouchesO2 =
        inputs.gueEquidistribution.closes.O2 === 'none' &&
        inputs.subSelbergDiscrepancy.closes.O2 === 'none' &&
        inputs.backwardStability.closes.O2 === 'full';
      return pdeObstacles.length === 1 && pdeObstacles[0] === 'O2' && onlyBackwardTouchesO2;
    },
    why:
      'O2 is the unique obstacle on the PDE well-posedness axis, and only the ' +
      'backward-stability input reaches it. This orthogonality is what forces ' +
      'the >= 2 minimum-input bound; if an arithmetic input were allowed to ' +
      'close O2, the lower bound would collapse and the synthesis would be wrong.',
  },
  {
    id: 'imp2491-minimum-inputs-lower-bound-two',
    holds: () => {
      const r = IMP2491_ESY_OBSTACLE_COUPLING_MATRIX;
      return (
        r.minimumIndependentInputsLowerBound === 2 &&
        r.distinctAxesWithOpenObstacles.length === 2 &&
        r.distinctAxesWithOpenObstacles.includes('arithmetic') &&
        r.distinctAxesWithOpenObstacles.includes('pde')
      );
    },
    why:
      'The distance-to-closure is at least 2 independent inputs because the open ' +
      'obstacles span exactly 2 distinct axes (arithmetic + pde). Demoting this ' +
      'to 1 would falsely assert a single breakthrough suffices.',
  },
  {
    id: 'imp2491-highest-leverage-is-gue-equidistribution',
    holds: () => {
      const r = IMP2491_ESY_OBSTACLE_COUPLING_MATRIX;
      const lev = r.leverage;
      return (
        r.highestLeverageInput === 'gueEquidistribution' &&
        lev.gueEquidistribution === 2 &&
        lev.gueEquidistribution > lev.backwardStability &&
        lev.gueEquidistribution > lev.subSelbergDiscrepancy
      );
    },
    why:
      'The GUE-equidistribution input has strictly the highest leverage (spans ' +
      'O1 + O3 = 2 obstacles) and is the decision-relevant first target, matching ' +
      'approachSuggestion (i) of esy-rigidity-port.js. If another input tied or ' +
      'exceeded it, the recommended research ordering would change.',
  },
  {
    id: 'imp2491-does-not-close-ticket',
    holds: () => {
      const r = IMP2491_ESY_OBSTACLE_COUPLING_MATRIX;
      const ax = r.obstacleAxes;
      // O2 and O3 must remain open; O1 stays partial. None may read 'closed'.
      return (
        r.couplingClosesTicket === false &&
        ax.O1.state === 'partial' &&
        ax.O2.state === 'open' &&
        ax.O3.state === 'open'
      );
    },
    why:
      'This is a synthesis / scoping record, not a closure. couplingClosesTicket ' +
      'must stay false and the per-obstacle states (O1 partial, O2 open, O3 open) ' +
      'must be preserved; flipping any to closed here would overclaim a result ' +
      'the underlying obstacle audits (imp-508 / imp-2492 / imp-2493) do not support.',
  },
  {
    id: 'imp2491-leverage-matches-closes-table',
    holds: () => {
      const r = IMP2491_ESY_OBSTACLE_COUPLING_MATRIX;
      const count = (c) => [c.O1, c.O2, c.O3].filter((v) => v === 'full' || v === 'partial').length;
      const ci = r.candidateInputs;
      return (
        r.leverage.gueEquidistribution === count(ci.gueEquidistribution.closes) &&
        r.leverage.backwardStability === count(ci.backwardStability.closes) &&
        r.leverage.subSelbergDiscrepancy === count(ci.subSelbergDiscrepancy.closes)
      );
    },
    why:
      'Leverage must equal the number of obstacles each input closes (full or ' +
      'partial) in the candidate-input table. A drift between the headline ' +
      'leverage numbers and the underlying closes-table would make the ' +
      'highest-leverage ranking and the minimum-input bound internally inconsistent.',
  },
];
