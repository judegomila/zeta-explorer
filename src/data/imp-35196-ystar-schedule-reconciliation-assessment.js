/**
 * @module imp-35196-ystar-schedule-reconciliation-assessment
 *
 * imp-35196 (proof, ASSESSMENT ONLY): imp-35168 showed that a FIXED mesoscopic
 * strip Im z >= y_star cannot serve both the imp-2520 propagation constant
 * (L_prop = 2/y_star^2, N-uniform) AND the imp-35127 I3 field-Lipschitz
 * accumulation constant (L_field = 2N/y_star^2, N-linear), and that forcing I3
 * N-uniformity inflates the strip as y_star ~ sqrt(N S) -- driving it away from
 * the real-axis particles whose integrator error is accumulated. This ticket
 * asks the sharper question left open there: does any N-DEPENDENT SCHEDULE
 * y_star(N) (not merely a fixed height) reconcile both requirements, or are they
 * STRICTLY INCOMPATIBLE? Assessment only; discharges nothing; I3 stays OPEN; NO QED.
 *
 * THE TWO SCHEDULE ENVELOPES (the crux)
 * -------------------------------------
 * A schedule is a single function y_star : N -> (0, infinity). Each requirement
 * constrains it as a one-sided envelope in N:
 *
 *   (A) N-UNIFORM I3 field-Lipschitz. The imp-35127 step-to-global RK4 accumulation
 *       constant is the field Jacobian L_field(N, y) = 2N/y^2 (backward-flow-
 *       stability-gronwall.js line 426, |dz M| <= N/y^2). To keep its horizon-S
 *       e-fold 2 N S / y^2 below a FIXED, N-independent vacuity threshold E_acc,
 *              y_star(N) >= y_floor(N) := sqrt(2 N S / E_acc)  ~  sqrt(N).
 *       This is a LOWER envelope that is monotonically increasing and UNBOUNDED:
 *       any admissible schedule must satisfy y_star(N) -> infinity.
 *
 *   (B) STRIP BOUNDS THE NEAR-FRONT INTEGRATOR ERROR. The accumulated error is the
 *       RK4 integrator error of the particles at the microscopic front, which sit on
 *       the real axis at y = 0. For the strip at height y_star to REPRESENT (bound)
 *       that near-front error rather than the far smoother field high on the strip,
 *       y_star must stay within an O(1) proximity y_ceil of the front. The front
 *       stays at y = 0 with an N-independent (indeed log-N SHRINKING, mean spacing
 *       ~ 2 pi / log N) resolution scale regardless of N, so
 *              y_star(N) <= y_ceil,   y_ceil = O(1) and NON-increasing in N.
 *       This is an UPPER envelope that does NOT grow with N. In the strictest reading
 *       (accumulate the error AT the front, y = 0) it forces y_star(N) -> 0.
 *
 * WHY NO SCHEDULE RECONCILES THEM (corridor collapse)
 * ---------------------------------------------------
 * A feasible schedule must live in the corridor y_floor(N) <= y_star(N) <= y_ceil
 * for every N. The floor sqrt(2 N S / E_acc) rises without bound; the ceiling y_ceil
 * is bounded (at best flat, at worst shrinking). They cross at
 *              N_crit = y_ceil^2 E_acc / (2 S),
 * and for every N > N_crit the corridor is EMPTY: no value of y_star, hence no
 * schedule y_star(N), satisfies both. The tails are disjoint by construction --
 * requirement (A) forces the y_star tail to +infinity while requirement (B) caps it
 * (strict reading: forces it to 0). A single function cannot tend to +infinity and
 * simultaneously stay bounded / tend to 0, so the two requirements are STRICTLY
 * INCOMPATIBLE. Allowing the ceiling to GROW, y_ceil(N) = c N^alpha with alpha >= 1/2
 * to chase the floor, only concedes the very thing (B) forbids: a strip permitted to
 * detach from the front at rate sqrt(N) no longer bounds the near-front error it was
 * introduced to accumulate. So the reconciliation fails in BOTH readings.
 *
 * CONSEQUENCE (the honest verdict, not a discharge)
 * -------------------------------------------------
 * The imp-35168 fixed-height incompatibility is NOT an artifact of holding y_star
 * constant: promoting y_star to a free N-schedule does not help, because the two
 * requirements pull the schedule in OPPOSITE directions in N (accumulation floor up
 * like sqrt(N), near-front ceiling flat/down). The residual sub-gap imp-35168 named
 * -- an N-uniform field-Lipschitz bound on a strip that still reaches the front -- is
 * now shown UNREACHABLE BY ANY STRIP SCHEDULE, not merely by a fixed strip. This
 * localizes the I3 obstruction precisely: the field-Lipschitz N-linearity is
 * intrinsic to the N poles at y = 0, and no vertical placement of a holomorphic strip
 * (constant or N-scheduled) can be simultaneously N-uniform and front-adherent. I3
 * therefore cannot be discharged by strip geometry alone; it needs a fundamentally
 * different lever (e.g. an N-uniform field-Lipschitz surrogate NOT built from a
 * distance-to-pole bound, or the imp-35167 min-gap route feeding an intrinsic
 * accumulation constant). I3 stays OPEN. Assessment only; discharges nothing;
 * establishes no operator positivity; changes no bound; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35168-mesoscopic-i3-lipschitz-window-assessment (fixed-height precursor; the two constants)
 * @see imp-35127-g-step-error-certified-bound-scope (I3 ingredient; the coupling claim)
 * @see backward-flow-stability-gronwall.js (imp-2520 Lemma B; line 426 field Lipschitz N/y^2)
 * @see imp-35167-g-min-non-collision-certificate-scope (the alternative min-gap lever)
 * @see lambda-roadmap.js Step 2 rigorousUpgradeGap.obligations[G-gronwall] / [G-step-error]
 */

const E_ACC = 1; // accumulation e-fold threshold for the RK4 step-to-global factor (matches imp-35168)
const HORIZON_S = 1; // order-one backward time to the sub-front horizon (matches imp-35168)

// Near-front proximity ceiling: an O(1), N-independent (generous) cap on how far the
// strip may sit above the y = 0 front and still bound the near-front integrator error.
// Taken as the imp-35168 mesoscopic working height y_star ~ 2 . 0.448 . 2 pi ~ 5.6 as
// the MOST generous flat ceiling; the true front resolution ~ 2 pi / log N is smaller.
const Y_CEIL = 2 * 0.448 * (2 * Math.PI);

// (A) N-uniform accumulation FLOOR: y >= sqrt(2 N S / E_acc). Rises like sqrt(N).
function yFloor(N) {
  return Math.sqrt((2 * N * HORIZON_S) / E_ACC);
}

// The accumulation e-fold a schedule pinned at the near-front ceiling would incur.
function accEfoldAtCeil(N) {
  return (2 * N * HORIZON_S) / (Y_CEIL * Y_CEIL);
}

// Corridor crossover: the largest N for which the accumulation floor still fits under
// the near-front ceiling. Solve sqrt(2 N S / E_acc) = Y_CEIL.
const N_CRIT = (Y_CEIL * Y_CEIL * E_ACC) / (2 * HORIZON_S);

// Representative N-sweep on the anchors the roadmap uses for the flow.
const N_SWEEP = [2, 10, 100, 1e3, 1e4, 1e5, 1e6];

const ROWS = N_SWEEP.map((N) => {
  const floor = yFloor(N);
  return {
    N,
    horizon_S: HORIZON_S,
    y_ceil: +Y_CEIL.toFixed(4),
    y_floor: +floor.toExponential(4),
    // Feasible iff the accumulation floor still fits under the near-front ceiling.
    corridor_feasible: floor <= Y_CEIL,
    // How far the required floor overshoots the ceiling (>1 means corridor empty).
    floor_over_ceil: +(floor / Y_CEIL).toExponential(4),
    acc_efold_at_ceil: +accEfoldAtCeil(N).toExponential(4),
  };
});

export const IMP35196_YSTAR_SCHEDULE_RECONCILIATION_ASSESSMENT = {
  id: 'imp-35196',
  proofSection: 'S-frontier',
  question:
    'Does any N-DEPENDENT strip schedule y_star(N) reconcile the imp-35127 I3 N-uniform ' +
    'field-Lipschitz requirement (accumulation floor y_star >= sqrt(2 N S / E_acc) ~ sqrt(N)) ' +
    'with the requirement that the strip still bound the near-front integrator error (proximity ' +
    'ceiling y_star <= O(1)), or are the two strictly incompatible? Assessment only; NO QED.',
  twoEnvelopes: {
    accumulationFloor:
      'y_floor(N) = sqrt(2 N S / E_acc) ~ sqrt(N) -- LOWER envelope, monotone increasing, UNBOUNDED (forces y_star -> infinity)',
    nearFrontCeiling:
      'y_ceil = O(1), N-independent (front resolution ~ 2 pi / log N even SHRINKS) -- UPPER envelope; strict reading forces y_star -> 0',
    pullDirection: 'the two envelopes pull the schedule in OPPOSITE directions in N (floor up ~ sqrt(N), ceiling flat/down)',
  },
  corridorCollapse: {
    corridor: 'a feasible schedule needs y_floor(N) <= y_star(N) <= y_ceil for every N',
    nCrit: +N_CRIT.toFixed(4), // largest N with a non-empty corridor
    emptyBeyondNCrit: 'for every N > N_crit the corridor is EMPTY: no y_star value, hence no schedule, satisfies both',
    disjointTails:
      '(A) forces the y_star tail to +infinity while (B) caps it (strict reading forces it to 0); a single function cannot do both',
    growingCeilingConcession:
      'letting y_ceil(N) = c N^alpha with alpha >= 1/2 chase the floor only concedes the strip detaching from the front at rate sqrt(N) -- exactly what (B) forbids',
  },
  yCeil: +Y_CEIL.toFixed(4),
  horizonS: HORIZON_S,
  rows: ROWS,
  reconciles: false,
  strictlyIncompatible: true,
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). Promoting the imp-35168 strip height from a FIXED ' +
    'value to a free N-schedule y_star(N) does NOT reconcile the two requirements: they are STRICTLY ' +
    'INCOMPATIBLE. (A) The imp-35127 I3 N-uniform field-Lipschitz accumulation constant L_field = ' +
    '2N/y^2 <= L_max forces an accumulation FLOOR y_star(N) >= sqrt(2 N S / E_acc) ~ sqrt(N) that is ' +
    'monotone increasing and UNBOUNDED (y_star -> infinity). (B) For the strip to still BOUND the ' +
    'near-front integrator error -- the error of the particles at the y = 0 microscopic front -- the ' +
    'strip must stay within an O(1) proximity CEILING y_star <= y_ceil of the front (the front ' +
    'resolution ~ 2 pi / log N is N-independent, indeed shrinking); the strict reading forces y_star ' +
    '-> 0. A single function y_star(N) cannot tend to +infinity and simultaneously stay bounded / ' +
    'tend to 0, and quantitatively the rising floor crosses the flat ceiling at N_crit = y_ceil^2 ' +
    'E_acc / (2 S) (~15.7 here) beyond which the corridor y_floor <= y_star <= y_ceil is EMPTY. ' +
    'Letting the ceiling grow as c N^alpha (alpha >= 1/2) to chase the floor only concedes the strip ' +
    'detaching from the front -- the very thing (B) forbids. CONSEQUENCE: the imp-35168 fixed-height ' +
    'incompatibility is not a fixed-height artifact; the residual sub-gap (an N-uniform field-Lipschitz ' +
    'bound on a front-adherent strip) is UNREACHABLE BY ANY STRIP SCHEDULE. The I3 field-Lipschitz ' +
    'N-linearity is intrinsic to the N poles at y = 0 and cannot be beaten by vertical strip placement ' +
    '(constant or scheduled); I3 needs a different lever (an N-uniform field-Lipschitz surrogate not ' +
    'built from a distance-to-pole bound, or the imp-35167 min-gap route). I3 stays OPEN. Assessment ' +
    'only; discharges nothing; establishes no operator positivity; changes no bound; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35168-mesoscopic-i3-lipschitz-window-assessment (fixed-height precursor); ' +
    'imp-35127-g-step-error-certified-bound-scope (I3, coupling); backward-flow-stability-gronwall.js ' +
    '(imp-2520 Lemma B, line 426 field Lipschitz N/y^2); imp-35167-g-min-non-collision-certificate-scope ' +
    '(alternative min-gap lever); lambda-roadmap.js Step 2 obligations[G-gronwall]/[G-step-error]; ' +
    'imp-486 (C_mb GUE-conditional).',
};

export const IMP35196_YSTAR_SCHEDULE_RECONCILIATION_ASSESSMENT_ASSERTIONS = [
  {
    // The accumulation floor rises monotonically with N and is unbounded (forces y_star -> infinity).
    id: 'imp35196-accumulation-floor-rises-unbounded',
    description: 'y_floor(N) = sqrt(2 N S / E_acc) is monotone increasing in N and unbounded (forces y_star -> infinity)',
    holds: () => {
      for (let i = 1; i < ROWS.length; i += 1) {
        if (yFloor(ROWS[i].N) <= yFloor(ROWS[i - 1].N)) return false;
      }
      // Unbounded: the largest-N floor exceeds any fixed O(1) ceiling.
      return yFloor(ROWS[ROWS.length - 1].N) > Y_CEIL;
    },
  },
  {
    // The floor scales exactly as sqrt(N): y_floor / sqrt(N) is constant across the sweep.
    id: 'imp35196-floor-scales-sqrt-N',
    description: 'y_floor(N) / sqrt(N) is N-independent (the floor is exactly sqrt(2 S / E_acc) . sqrt(N))',
    holds: () => {
      const per = ROWS.map((r) => yFloor(r.N) / Math.sqrt(r.N));
      return per.every((v) => Math.abs(v - per[0]) < 1e-9);
    },
  },
  {
    // The near-front ceiling is N-independent (flat) -- it does NOT grow to meet the floor.
    id: 'imp35196-near-front-ceiling-flat',
    description: 'the near-front proximity ceiling y_ceil is N-independent (bounded; does not chase the sqrt(N) floor)',
    holds: () => ROWS.every((r) => Math.abs(r.y_ceil - +Y_CEIL.toFixed(4)) < 1e-9),
  },
  {
    // Corridor collapse: feasible at small N, EMPTY for N > N_crit (floor overshoots ceiling).
    id: 'imp35196-corridor-empty-beyond-N-crit',
    description: 'the corridor y_floor <= y_star <= y_ceil is feasible only for N <= N_crit and EMPTY at the large-N anchors',
    holds: () => {
      const feasibleAtSmall = ROWS[0].corridor_feasible === true; // N = 2 fits
      const emptyAtLarge = ROWS[ROWS.length - 1].corridor_feasible === false; // N = 1e6 empty
      const allConsistent = ROWS.every((r) => r.corridor_feasible === yFloor(r.N) <= Y_CEIL);
      return feasibleAtSmall && emptyAtLarge && allConsistent;
    },
  },
  {
    // The crossover N_crit = y_ceil^2 E_acc / (2 S) matches the numeric floor=ceiling boundary.
    id: 'imp35196-N-crit-closed-form',
    description: 'N_crit = y_ceil^2 E_acc / (2 S): at N_crit the floor equals the ceiling exactly',
    holds: () => Math.abs(yFloor(N_CRIT) - Y_CEIL) < 1e-9,
  },
  {
    // Disjoint tails: the two requirements pull the schedule in OPPOSITE directions --
    // the accumulation floor diverges while the near-front ceiling stays bounded.
    id: 'imp35196-disjoint-tails-opposite-pull',
    description: 'accumulation floor -> infinity while near-front ceiling stays bounded: no single schedule can satisfy both tails',
    holds: () => {
      const floorDiverges = yFloor(1e12) > 1e5; // grows without bound
      const ceilBounded = Y_CEIL < 1e2; // stays O(1)
      return floorDiverges && ceilBounded;
    },
  },
  {
    // Honesty gate: assessment only, reconciles false, strictly incompatible, no QED, no refereed bound is changed.
    id: 'imp35196-honesty-gate-no-qed',
    description: 'Assessment only: reconciles false, strictly incompatible, isRigorous false, NO QED, no refereed bound is changed',
    holds: () =>
      IMP35196_YSTAR_SCHEDULE_RECONCILIATION_ASSESSMENT.reconciles === false &&
      IMP35196_YSTAR_SCHEDULE_RECONCILIATION_ASSESSMENT.strictlyIncompatible === true &&
      IMP35196_YSTAR_SCHEDULE_RECONCILIATION_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP35196_YSTAR_SCHEDULE_RECONCILIATION_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35196_YSTAR_SCHEDULE_RECONCILIATION_ASSESSMENT.verdict),
  },
];

for (const a of IMP35196_YSTAR_SCHEDULE_RECONCILIATION_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35196-ystar-schedule-reconciliation-assessment assertion failed: ${a.id}`);
  }
}
