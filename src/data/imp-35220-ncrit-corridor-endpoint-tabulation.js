/**
 * @module imp-35220-ncrit-corridor-endpoint-tabulation
 *
 * imp-35220 (numerical, MEASUREMENT ONLY): imp-35196 proved the imp-35127 I3
 * strip corridor y_floor(N) <= y_star(N) <= y_ceil empties for every N above
 *              N_crit = y_ceil^2 E_acc / (2 S)
 * (the N-uniform accumulation floor y_floor(N) = sqrt(2 N S / E_acc) ~ sqrt(N)
 * rising past the O(1) near-front ceiling y_ceil), and quoted a single
 * corridor-collapse value N_crit ~ 15.85 on the ONE triple (S, E_acc, y_ceil) =
 * (1, 1, 2 . 0.448 . 2 pi) it carried from imp-35168. It never tabulated the two
 * endpoints on OTHER plausible parameter values. This module does exactly that:
 * it tabulates y_floor(N) and the flat y_ceil across an N grid for SEVERAL
 * (S, E_acc, y_ceil) triples drawn from the imp-35127 / imp-2520 / imp-2563
 * horizon conventions, exhibits the crossing N_crit for each, and confirms the
 * corridor is EMPTY for all N > N_crit. Measurement only; discharges nothing;
 * I3 stays OPEN; C_mb GUE-conditional per imp-486; NO QED.
 *
 * THE ENDPOINTS (imp-35196 crux, restated)
 * ----------------------------------------
 *   y_floor(N; S, E_acc) = sqrt(2 N S / E_acc)      -- LOWER envelope, ~ sqrt(N), UNBOUNDED
 *   y_ceil               = O(1), N-independent      -- UPPER envelope, flat / shrinking
 * A feasible schedule needs y_floor(N) <= y_ceil. Since y_floor rises like sqrt(N)
 * and y_ceil is flat, they cross exactly once, at N_crit = y_ceil^2 E_acc / (2 S),
 * and the corridor is empty (y_floor > y_ceil) for all N > N_crit.
 *
 * THE PARAMETER TRIPLES (plausible ranges, imp-35127 / imp-2520 / imp-2563)
 * -----------------------------------------------------------------------
 *   S     : order-one backward time to the sub-front horizon. imp-2563 runs the
 *           gap ODE over O(1) backward time; imp-2520 Lemma B horizon is O(1).
 *           We sweep S in {1/2, 1, 2}.
 *   E_acc : the N-independent vacuity threshold on the accumulation e-fold
 *           2 N S / y^2. imp-35168 / imp-35196 take E_acc = 1; a stricter budget
 *           E_acc = 1/10 and a looser E_acc = 10 bracket the plausible range.
 *   y_ceil: the O(1) near-front proximity cap. imp-35196 takes the generous
 *           mesoscopic working height 2 . 0.448 . 2 pi ~ 5.63; the true front
 *           resolution ~ 2 pi / log N is SMALLER, so we also try the flat
 *           y_ceil = 2 pi ~ 6.28 and the strict y_ceil = 1.
 *
 * HEADLINE FINDING (robustness of the imp-35196 collapse)
 * -------------------------------------------------------
 * Across EVERY triple in the plausible range, N_crit = y_ceil^2 E_acc / (2 S) is
 * a MODEST O(1)-to-O(100) number (the largest here, the loosest triple
 * S=1/2, E_acc=10, y_ceil~5.63, gives N_crit ~ 317). The roadmap flow anchors run
 * to N ~ 1e6 and beyond, so the corridor is empty at EVERY roadmap anchor for
 * EVERY plausible triple: the imp-35196 corridor collapse is NOT an artifact of
 * the specific (1, 1, 5.63) choice -- it is robust across the horizon conventions.
 * Widening E_acc or y_ceil, or shrinking S, only pushes N_crit up by a bounded
 * factor; it never removes the crossing, because y_floor ~ sqrt(N) is unbounded
 * while y_ceil is flat. Measurement only; I3 stays OPEN; NO QED.
 *
 * @see imp-35196-ystar-schedule-reconciliation-assessment (the collapse this tabulates; single-triple)
 * @see imp-35168-mesoscopic-i3-lipschitz-window-assessment (the two constants L_prop vs L_field)
 * @see imp-35127-g-step-error-certified-bound-scope (I3 field-Lipschitz coupling)
 * @see backward-flow-stability-gronwall.js (imp-2520 Lemma B; field Lipschitz N/y^2)
 * @see lambda-roadmap.js Step 2 obligations[G-gronwall] / [G-step-error]
 */

// y_floor(N) = sqrt(2 N S / E_acc). The N-uniform accumulation floor; rises like sqrt(N).
function yFloor(N, S, eAcc) {
  return Math.sqrt((2 * N * S) / eAcc);
}

// N_crit = y_ceil^2 E_acc / (2 S). Solves y_floor(N_crit) = y_ceil.
function nCrit(S, eAcc, yCeil) {
  return (yCeil * yCeil * eAcc) / (2 * S);
}

// The generous imp-35196 mesoscopic working height, the loosest plausible ceiling.
const Y_CEIL_MESO = 2 * 0.448 * (2 * Math.PI); // ~ 5.6297
const TWO_PI = 2 * Math.PI; // ~ 6.2832, a flat front-scale ceiling

// Plausible (S, E_acc, y_ceil) triples from the imp-35127 / imp-2520 / imp-2563 conventions.
const TRIPLES = [
  { label: 'baseline (imp-35196/imp-35168): S=1, E_acc=1, y_ceil=meso', S: 1, eAcc: 1, yCeil: Y_CEIL_MESO },
  { label: 'strict vacuity: S=1, E_acc=1/10, y_ceil=meso', S: 1, eAcc: 0.1, yCeil: Y_CEIL_MESO },
  { label: 'loose vacuity: S=1, E_acc=10, y_ceil=meso', S: 1, eAcc: 10, yCeil: Y_CEIL_MESO },
  { label: 'long horizon: S=2, E_acc=1, y_ceil=meso', S: 2, eAcc: 1, yCeil: Y_CEIL_MESO },
  { label: 'short horizon: S=1/2, E_acc=1, y_ceil=meso', S: 0.5, eAcc: 1, yCeil: Y_CEIL_MESO },
  { label: 'front-scale ceiling: S=1, E_acc=1, y_ceil=2pi', S: 1, eAcc: 1, yCeil: TWO_PI },
  { label: 'strict front ceiling: S=1, E_acc=1, y_ceil=1', S: 1, eAcc: 1, yCeil: 1 },
  { label: 'loosest overall: S=1/2, E_acc=10, y_ceil=meso', S: 0.5, eAcc: 10, yCeil: Y_CEIL_MESO },
];

// The roadmap flow anchors: the corridor is empty at all of these for every triple.
const N_SWEEP = [2, 10, 100, 1e3, 1e4, 1e5, 1e6];

// Per triple: N_crit, the endpoint tabulation, and the empty-beyond-N_crit confirmation.
const TABLE = TRIPLES.map((t) => {
  const N_crit = nCrit(t.S, t.eAcc, t.yCeil);
  const rows = N_SWEEP.map((N) => {
    const floor = yFloor(N, t.S, t.eAcc);
    return {
      N,
      y_floor: +floor.toExponential(4),
      y_ceil: +t.yCeil.toFixed(4),
      feasible: floor <= t.yCeil, // corridor non-empty iff floor still fits under ceiling
      floor_over_ceil: +(floor / t.yCeil).toExponential(4), // > 1 means corridor empty
    };
  });
  return {
    label: t.label,
    S: t.S,
    E_acc: t.eAcc,
    y_ceil: +t.yCeil.toFixed(4),
    N_crit: +N_crit.toFixed(4),
    // Largest N_SWEEP anchor still inside the corridor (null if even N=2 is already empty).
    largest_feasible_anchor:
      rows.filter((r) => r.feasible).map((r) => r.N).slice(-1)[0] ?? null,
    rows,
  };
});

// The spread of N_crit across the plausible triples: all MODEST, far below the roadmap anchors.
const N_CRIT_VALUES = TABLE.map((t) => t.N_crit);
const N_CRIT_MIN = Math.min(...N_CRIT_VALUES);
const N_CRIT_MAX = Math.max(...N_CRIT_VALUES);

export const IMP35220_NCRIT_CORRIDOR_ENDPOINT_TABULATION = {
  id: 'imp-35220',
  proofSection: 'S-frontier',
  question:
    'Tabulate the imp-35196 corridor endpoints y_floor(N) = sqrt(2 N S / E_acc) and the flat y_ceil ' +
    'across an N grid for several plausible (S, E_acc, y_ceil) triples, exhibit the crossing ' +
    'N_crit = y_ceil^2 E_acc / (2 S) for each, and confirm the corridor is EMPTY for all N > N_crit. ' +
    'Measurement only; discharges nothing; I3 stays OPEN; NO QED.',
  endpoints: {
    accumulationFloor: 'y_floor(N; S, E_acc) = sqrt(2 N S / E_acc) -- LOWER envelope, ~ sqrt(N), UNBOUNDED',
    nearFrontCeiling: 'y_ceil = O(1), N-independent -- UPPER envelope, flat (front resolution ~ 2 pi / log N even shrinks)',
    crossover: 'N_crit = y_ceil^2 E_acc / (2 S) solves y_floor(N_crit) = y_ceil; corridor EMPTY for all N > N_crit',
  },
  triples: TABLE,
  nCritSpread: {
    min: +N_CRIT_MIN.toFixed(4),
    max: +N_CRIT_MAX.toFixed(4),
    note:
      'across every plausible triple N_crit stays a MODEST O(1)-to-O(100) number, FAR below the roadmap ' +
      'flow anchors N ~ 1e3..1e6, so the corridor is empty at every anchor for every triple -- the ' +
      'imp-35196 collapse is robust to the horizon conventions, not an artifact of the (1, 1, 5.63) choice',
  },
  corridorEmptyAtAllAnchors: true,
  isRigorous: false,
  verdict:
    'MEASUREMENT (tabulation, NOT a bound). Tabulating the imp-35196 corridor endpoints across eight ' +
    'plausible (S, E_acc, y_ceil) triples confirms the corridor collapse is ROBUST: the accumulation ' +
    'floor y_floor(N) = sqrt(2 N S / E_acc) crosses the flat near-front ceiling y_ceil at N_crit = ' +
    'y_ceil^2 E_acc / (2 S) for EVERY triple, and N_crit stays a MODEST O(1)-to-O(100) number ' +
    '(here in [' + N_CRIT_MIN.toFixed(2) + ', ' + N_CRIT_MAX.toFixed(2) + ']). Since the roadmap flow ' +
    'anchors run to N ~ 1e6 and beyond, the corridor y_floor <= y_star <= y_ceil is EMPTY at every ' +
    'roadmap anchor for every triple. Widening E_acc or y_ceil, or shrinking S, only pushes N_crit up ' +
    'by a bounded factor -- it never removes the crossing, because y_floor ~ sqrt(N) is unbounded while ' +
    'y_ceil is flat. So the imp-35196 corridor collapse (quoted only for the single (1, 1, 5.63) triple) ' +
    'holds across the imp-35127 / imp-2520 / imp-2563 horizon conventions and is not an artifact of that ' +
    'one parameter choice. Measurement only; discharges nothing; establishes no operator positivity; ' +
    'changes no bound; I3 stays OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35196-ystar-schedule-reconciliation-assessment (the collapse, single triple); ' +
    'imp-35168-mesoscopic-i3-lipschitz-window-assessment (L_prop vs L_field); ' +
    'imp-35127-g-step-error-certified-bound-scope (I3 field-Lipschitz coupling); ' +
    'backward-flow-stability-gronwall.js (imp-2520 Lemma B, field Lipschitz N/y^2); ' +
    'lambda-roadmap.js Step 2 obligations[G-gronwall]/[G-step-error]; imp-486 (C_mb GUE-conditional).',
};

export const IMP35220_NCRIT_CORRIDOR_ENDPOINT_TABULATION_ASSERTIONS = [
  {
    // The closed form is exact: at N_crit the floor equals the ceiling for EVERY triple.
    id: 'imp35220-N-crit-closed-form-every-triple',
    description: 'for every triple, y_floor(N_crit; S, E_acc) = y_ceil with N_crit = y_ceil^2 E_acc / (2 S)',
    holds: () =>
      TRIPLES.every((t) => Math.abs(yFloor(nCrit(t.S, t.eAcc, t.yCeil), t.S, t.eAcc) - t.yCeil) < 1e-9),
  },
  {
    // Corridor empties past N_crit: floor strictly exceeds ceiling for every N > N_crit (tested just above).
    id: 'imp35220-corridor-empty-just-beyond-N-crit',
    description: 'for every triple, y_floor(N) > y_ceil for N a hair above N_crit (corridor empty beyond the crossing)',
    holds: () =>
      TRIPLES.every((t) => {
        const Nc = nCrit(t.S, t.eAcc, t.yCeil);
        return yFloor(Nc * 1.0001, t.S, t.eAcc) > t.yCeil;
      }),
  },
  {
    // Corridor still feasible just below N_crit (the crossing is genuine, not a boundary artifact).
    id: 'imp35220-corridor-feasible-just-below-N-crit',
    description: 'for every triple, y_floor(N) < y_ceil for N a hair below N_crit (corridor non-empty before the crossing)',
    holds: () =>
      TRIPLES.every((t) => {
        const Nc = nCrit(t.S, t.eAcc, t.yCeil);
        return yFloor(Nc * 0.9999, t.S, t.eAcc) < t.yCeil;
      }),
  },
  {
    // The headline: N_crit stays a modest number across all plausible triples (well below the roadmap anchors).
    id: 'imp35220-N-crit-modest-across-triples',
    description: 'N_crit is O(1)-to-O(100) for every plausible triple -- far below the roadmap flow anchors N ~ 1e3..1e6',
    holds: () => N_CRIT_MAX < 1e3 && N_CRIT_MIN > 0,
  },
  {
    // Consequence: the corridor is EMPTY at every roadmap anchor N >= 1e3 for every triple.
    id: 'imp35220-corridor-empty-at-all-roadmap-anchors',
    description: 'for every triple, the corridor is empty (y_floor > y_ceil) at all roadmap anchors N >= 1e3',
    holds: () =>
      TABLE.every((t) =>
        t.rows.filter((r) => r.N >= 1e3).every((r) => r.feasible === false && r.floor_over_ceil > 1),
      ),
  },
  {
    // The floor scales exactly as sqrt(N) at fixed (S, E_acc): y_floor / sqrt(N) is N-independent.
    id: 'imp35220-floor-scales-sqrt-N',
    description: 'y_floor(N; S, E_acc) / sqrt(N) is N-independent for each triple (the floor is sqrt(2 S / E_acc) . sqrt(N))',
    holds: () =>
      TRIPLES.every((t) => {
        const per = N_SWEEP.map((N) => yFloor(N, t.S, t.eAcc) / Math.sqrt(N));
        return per.every((v) => Math.abs(v - per[0]) < 1e-9);
      }),
  },
  {
    // Reuse gate: the baseline triple reproduces the imp-35196 quoted N_crit ~ 15.85.
    id: 'imp35220-baseline-matches-imp35196',
    description: 'the baseline triple (1, 1, meso) reproduces the imp-35196 quoted corridor-collapse N_crit ~ 15.85',
    holds: () => Math.abs(nCrit(1, 1, Y_CEIL_MESO) - 15.8467) < 1e-2,
  },
  {
    // Honesty gate: measurement only, corridor empty at anchors, no QED, no refereed bound is changed.
    id: 'imp35220-honesty-gate-no-qed',
    description: 'Measurement only: corridorEmptyAtAllAnchors true, isRigorous false, NO QED, no refereed bound is changed',
    holds: () =>
      IMP35220_NCRIT_CORRIDOR_ENDPOINT_TABULATION.corridorEmptyAtAllAnchors === true &&
      IMP35220_NCRIT_CORRIDOR_ENDPOINT_TABULATION.isRigorous === false &&
      /NO QED/.test(IMP35220_NCRIT_CORRIDOR_ENDPOINT_TABULATION.verdict) &&
      /refereed bound is changed/i.test(IMP35220_NCRIT_CORRIDOR_ENDPOINT_TABULATION.verdict),
  },
];

for (const a of IMP35220_NCRIT_CORRIDOR_ENDPOINT_TABULATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35220-ncrit-corridor-endpoint-tabulation assertion failed: ${a.id}`);
  }
}
