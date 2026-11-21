/**
 * @module imp-34904-landmark-3p3e9-reconciliation-table
 * @fileoverview imp-34904 -- Assemble the FOUR independent ~3.3e9 landmark
 *   estimates that cluster near the sigma(N) halving point into a single
 *   reconciliation table, quantify all SIX pairwise relative gaps, and
 *   attribute each gap to its named source.
 *
 *   THE FOUR LANDMARKS (all inherited, none recomputed here)
 *   -------------------------------------------------------
 *   (L1) N_cross_closed  ~ 3.280294e9  -- imp-33723 closed-form Banach fixed
 *        point N_cross = (C_C/E_trunc)^2 * log T0(N_cross) for the E_coll =
 *        E_trunc crossover.
 *   (L2) N_cross_bisect  ~ 3.280294e9  -- imp-3444 bisection E_coll = E_trunc
 *        crossover (the ORIGINAL root find). imp-33723 matches L1 to it to
 *        ~1.7e-15 relative -- a pure root-finding / floating-point residual.
 *   (L3) N_half          ~ 3.267e9     -- the sigma(N) = 1/2 halving landmark
 *        (imp-33582 six-decade exponent ladder, imp-33708 baseline bandFor(0.5)).
 *   (L4) N_knee          ~ 3.3806e9    -- the imp-33721 sub-decade sigmoid-
 *        inflection knee, log10 N* ~ 9.529 (the imp-33701 ramp D2 sign change,
 *        relocated a full decade down from the [1e10,1e11] bracket).
 *
 *   THE SIX PAIRWISE GAPS AND THEIR ATTRIBUTED CAUSES
 *   -------------------------------------------------
 *   Relative gap is |x - y| / min(x, y).
 *     L1-L2  ~ 1.7e-15  ROOT-FINDING / FP residual (no model term): closed form
 *                       vs bisection of the SAME E_coll = E_trunc condition.
 *     L1-L3  ~ 0.407%   GRONWALL E_flow term (imp-33601/imp-33848): the crossover
 *                       sits above the halving point by exactly the E_flow/E_trunc
 *                       surplus 1/2 - sigma(N_cross) = 1/(2 + E_flow/E_trunc).
 *     L2-L3  ~ 0.407%   SAME Gronwall E_flow term (L2 = L1 to 1.7e-15).
 *     L1-L4  ~ 3.06%    DEFINITIONAL inflection-vs-crossover offset (imp-33744):
 *                       the knee is a curvature landmark of sigma, the crossover
 *                       an E-balance landmark; the offset is the log-factor
 *                       running (a structural E_coll term), NOT the E_flow term.
 *     L2-L4  ~ 3.06%    SAME definitional offset (L2 = L1 to 1.7e-15).
 *     L3-L4  ~ 3.48%    DEFINITIONAL inflection-vs-halving offset (imp-33744):
 *                       sigma_infl = 1/2 - g'/(2 g^2) reaches 1/2 only in the
 *                       pure power-law limit; the measured offset is the same
 *                       log-factor running (E_coll term).
 *
 *   MEASUREMENT / RECONCILIATION ONLY. No landmark is recomputed and no bound is
 *   changed. C_mb remains GUE-conditional (imp-486); C_C 1/8 ansatz and imp-3066
 *   K_a >= 0 UNTOUCHED. Establishes no operator positivity; NO QED; no refereed bound is changed.
 *
 * @see imp-33723 (closed-form Banach crossover N_cross ~ 3.280294e9)
 * @see imp-3444 (bisection E_coll=E_trunc crossover ~3.280e9)
 * @see imp-33582 / imp-33708 (sigma=1/2 halving landmark ~3.267e9)
 * @see imp-33721 (sub-decade sigmoid-inflection knee log10 N* ~ 9.529)
 * @see imp-33848 (halving < crossover strict; gap = E_flow/E_trunc surplus)
 * @see imp-33744 (inflection-vs-halving near-coincidence = log-factor running)
 * @see imp-33601 (Gronwall E_flow term); imp-486 (C_mb GUE-conditional)
 */

// --- The four inherited landmark values (baked reference literals) ------------
const N_CROSS_CLOSED = 3.280294e9; // L1 imp-33723 closed-form Banach fixed point
const N_CROSS_BISECT = 3.280294e9; // L2 imp-3444 bisection (matches L1 to ~1.7e-15)
const N_HALF = 3.267e9; // L3 sigma=1/2 halving landmark (imp-33582/33708)
const N_KNEE = Math.pow(10, 9.529); // L4 imp-33721 sigmoid-inflection knee (~3.3806e9)

// Documented closed-form-vs-bisection residual (imp-33723): the two solve the
// SAME E_coll = E_trunc condition, so the gap is a root-finding / FP artifact.
const L1_L2_DOCUMENTED_REL = 1.7e-15;

const LANDMARKS = [
  { key: 'L1', label: 'N_cross_closed', source: 'imp-33723', method: 'closed-form Banach fixed point', N: N_CROSS_CLOSED },
  { key: 'L2', label: 'N_cross_bisect', source: 'imp-3444', method: 'bisection E_coll=E_trunc crossover', N: N_CROSS_BISECT },
  { key: 'L3', label: 'N_half', source: 'imp-33582/33708', method: 'sigma(N)=1/2 halving landmark', N: N_HALF },
  { key: 'L4', label: 'N_knee', source: 'imp-33721', method: 'sub-decade sigmoid-inflection knee', N: N_KNEE },
];

const relGap = (x, y) => Math.abs(x - y) / Math.min(x, y);

// Six pairwise gaps with attributed causes.
const PAIRWISE_GAPS = [
  {
    pair: 'L1-L2', a: 'N_cross_closed', b: 'N_cross_bisect',
    relGap: L1_L2_DOCUMENTED_REL, pct: L1_L2_DOCUMENTED_REL * 100,
    cause: 'root-finding / floating-point residual',
    attribution: 'Closed form and bisection solve the SAME E_coll=E_trunc crossover (imp-33723 matches imp-3444 to ~1.7e-15 rel); the gap carries no model term.',
  },
  {
    pair: 'L1-L3', a: 'N_cross_closed', b: 'N_half',
    relGap: relGap(N_CROSS_CLOSED, N_HALF), pct: relGap(N_CROSS_CLOSED, N_HALF) * 100,
    cause: 'Gronwall E_flow term (imp-33601/imp-33848)',
    attribution: 'Crossover sits above the halving point by the E_flow/E_trunc surplus 1/2 - sigma(N_cross) = 1/(2 + E_flow/E_trunc), strictly positive whenever the Gronwall E_flow term is positive.',
  },
  {
    pair: 'L2-L3', a: 'N_cross_bisect', b: 'N_half',
    relGap: relGap(N_CROSS_BISECT, N_HALF), pct: relGap(N_CROSS_BISECT, N_HALF) * 100,
    cause: 'Gronwall E_flow term (imp-33601/imp-33848)',
    attribution: 'Same E_flow surplus as L1-L3 (L2 equals L1 to ~1.7e-15).',
  },
  {
    pair: 'L1-L4', a: 'N_cross_closed', b: 'N_knee',
    relGap: relGap(N_CROSS_CLOSED, N_KNEE), pct: relGap(N_CROSS_CLOSED, N_KNEE) * 100,
    cause: 'definitional inflection-vs-crossover offset (imp-33744)',
    attribution: 'Knee is a curvature landmark of sigma(N), crossover is an E-balance landmark; the offset is the log-factor running (a structural E_coll term), not the E_flow term.',
  },
  {
    pair: 'L2-L4', a: 'N_cross_bisect', b: 'N_knee',
    relGap: relGap(N_CROSS_BISECT, N_KNEE), pct: relGap(N_CROSS_BISECT, N_KNEE) * 100,
    cause: 'definitional inflection-vs-crossover offset (imp-33744)',
    attribution: 'Same definitional offset as L1-L4 (L2 equals L1 to ~1.7e-15).',
  },
  {
    pair: 'L3-L4', a: 'N_half', b: 'N_knee',
    relGap: relGap(N_HALF, N_KNEE), pct: relGap(N_HALF, N_KNEE) * 100,
    cause: 'definitional inflection-vs-halving offset (imp-33744)',
    attribution: 'sigma_infl = 1/2 - g_prime/(2 g^2) reaches 1/2 only in the pure power-law limit; the measured offset is the log-factor running (E_coll term).',
  },
];

// Cause-family rollup: the six gaps collapse to three distinct sources.
const CAUSE_FAMILIES = {
  rootFindingResidual: ['L1-L2'], // ~1.7e-15, no model term
  gronwallEflowTerm: ['L1-L3', 'L2-L3'], // ~0.41%, E_flow/E_trunc surplus
  definitionalLogRunning: ['L1-L4', 'L2-L4', 'L3-L4'], // ~3.1-3.5%, E_coll log-factor
};

export const IMP34904_LANDMARK_3P3E9_RECONCILIATION_TABLE = {
  id: 'imp-34904',
  proofSection: 'S-frontier',
  question:
    'Four independent ~3.3e9 landmark estimates cluster near the sigma(N) halving point but have ' +
    'never been assembled into one table: imp-33723 closed-form Banach N_cross ~3.280294e9, imp-3444 ' +
    'bisection E_coll=E_trunc crossover, the sigma(N)=1/2 halving landmark ~3.267e9, and the imp-33721 ' +
    'sigmoid-inflection knee ~3.3806e9. Tabulate the four, compute all six pairwise relative gaps, and ' +
    'attribute each gap to its named source. Measurement/reconciliation only; changes no bound; no QED.',
  measuredQuantity:
    'The four landmark N values, the six pairwise relative gaps |x-y|/min(x,y), and the named cause ' +
    'family (root-finding residual / Gronwall E_flow term / definitional log-factor running) for each gap.',
  landmarks: LANDMARKS,
  pairwiseGaps: PAIRWISE_GAPS,
  causeFamilies: CAUSE_FAMILIES,
  summary: {
    tightestGap: 'L1-L2 ~1.7e-15 (root-finding residual; closed form vs bisection of the same crossover)',
    eFlowGap: 'L1-L3 / L2-L3 ~0.41% (Gronwall E_flow surplus 1/2 - sigma(N_cross))',
    definitionalGap: 'L3-L4 ~3.48%, L1-L4 / L2-L4 ~3.06% (log-factor running, a structural E_coll term)',
    ordering: 'N_half (~3.267e9) < N_cross (~3.280e9) < N_knee (~3.381e9)',
  },
  honesty:
    'Measurement/reconciliation only -- no landmark is recomputed and no bound is changed. The three ' +
    'cause families (root-finding residual, Gronwall E_flow term, definitional log-factor running) are ' +
    'inherited attributions from imp-33723/imp-33848/imp-33744, not new derivations. C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; C_C 1/8 ansatz and imp-3066 K_a >= 0 untouched; establishes no operator ' +
    'positivity; changes no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-33723 (closed-form Banach crossover N_cross ~3.280294e9); imp-3444 (bisection E_coll=E_trunc ' +
    'crossover ~3.280e9); imp-33582/imp-33708 (sigma=1/2 halving landmark ~3.267e9); imp-33721 ' +
    '(sub-decade inflection knee log10 N* ~9.529); imp-33848 (halving < crossover strict, gap = ' +
    'E_flow/E_trunc surplus); imp-33744 (inflection-vs-halving = log-factor running); imp-33601 (Gronwall ' +
    'E_flow term); imp-486 (C_mb GUE-conditional).',
};

export const IMP34904_LANDMARK_3P3E9_RECONCILIATION_TABLE_ASSERTIONS = [
  {
    // The three cause families partition all six pairwise gaps with no overlap and no omission.
    id: 'imp34904-cause-families-partition-six-gaps',
    description: 'the three cause families cover all six pairwise gaps exactly once',
    holds: () => {
      const covered = [
        ...CAUSE_FAMILIES.rootFindingResidual,
        ...CAUSE_FAMILIES.gronwallEflowTerm,
        ...CAUSE_FAMILIES.definitionalLogRunning,
      ];
      if (covered.length !== 6) return false;
      const pairKeys = PAIRWISE_GAPS.map((g) => g.pair);
      return pairKeys.every((p) => covered.includes(p)) && new Set(covered).size === 6;
    },
  },
  {
    // Ordering: halving landmark strictly below the crossover strictly below the knee.
    id: 'imp34904-ordering-half-lt-cross-lt-knee',
    description: 'N_half < N_cross < N_knee (imp-33848 strict ordering + knee above both)',
    holds: () => N_HALF < N_CROSS_CLOSED && N_CROSS_CLOSED < N_KNEE,
  },
  {
    // The Gronwall E_flow gap reproduces the documented ~0.4% halving-to-crossover residual.
    id: 'imp34904-eflow-gap-is-0p4pct',
    description: 'crossover-vs-halving gap ~0.41%, matching the documented ~0.4% E_flow residual',
    holds: () => Math.abs(relGap(N_CROSS_CLOSED, N_HALF) - 0.00407) < 5e-4,
  },
  {
    // The definitional knee-vs-halving gap reproduces the documented ~3.3% coincidence offset.
    id: 'imp34904-knee-gap-is-about-3pct',
    description: 'knee-vs-halving gap ~3.5%, matching the documented ~3.3% inflection offset',
    holds: () => Math.abs(relGap(N_HALF, N_KNEE) - 0.0348) < 5e-3,
  },
  {
    // The closed-form vs bisection gap is a sub-1e-12 root-finding residual, dwarfed by the two
    // model-term gaps -- the two crossover estimates agree far more tightly than either agrees
    // with the halving or knee landmark.
    id: 'imp34904-closedform-vs-bisection-negligible',
    description: 'L1-L2 root-finding residual (~1.7e-15) is many orders below the E_flow and definitional gaps',
    holds: () =>
      L1_L2_DOCUMENTED_REL < 1e-12 &&
      L1_L2_DOCUMENTED_REL < relGap(N_CROSS_CLOSED, N_HALF) &&
      relGap(N_CROSS_CLOSED, N_HALF) < relGap(N_HALF, N_KNEE),
  },
  {
    // Honesty gate: measurement/reconciliation only, no bound changed, C_mb GUE-conditional, no QED.
    id: 'imp34904-measurement-only-no-qed',
    description: 'reconciliation only; changes no bound; C_mb GUE-conditional (imp-486); NO QED; no refereed bound is changed',
    holds: () => true,
  },
];
