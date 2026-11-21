/**
 * @module imp-35194-background-field-sup-n-uniformity
 *
 * imp-35194 (numerical, frontier-diagnostic, MEASUREMENT ONLY): imp-35167 scoped the g_min
 * separation certificate and flagged M2 -- a CERTIFIED N-uniform background-field sup
 * beta >= sup_{p, s < t_c} |B_p(s)| over pairs p and backward times s -- as the FIRST binding,
 * self-referential missing input to the imp-2563 min-gap sandwich lower branch. imp-2563 ASSUMES
 * beta finite (with beta g^2 < 2) but does not certify N-uniformity. THIS module MEASURES beta(N)
 * empirically: it integrates the backward Dyson flow for small N (50, 100, 200), tracks the running
 * sup of the adjacent-pair background field along the trajectory toward the collision front, and
 * reports whether the measured beta(N) looks N-uniform or grows toward the front. It certifies
 * NOTHING; it is a numerical probe of the M2 obstruction. MEASUREMENT ONLY; NO QED.
 *
 * THE BACKGROUND FIELD B_p AND THE M2 SUP beta
 * --------------------------------------------
 * Particles x_1(s) < ... < x_N(s) flow backward under the attractive rational Dyson / Calogero-Moser
 * field (de Bruijn-Newman time units, backward-flow-stability-gronwall.js line 15):
 *
 *     dx_k/ds  =  -2 sum_{j != k} 1 / (x_k - x_j),        s = -t >= 0.
 *
 * For an adjacent pair p = (a, b) with a = x_k < b = x_{k+1}, the imp-2563 gap ODE
 * du/ds = -8 + 4 B_p(s) u (u = r^2, r = b - a) carries the background field of the OTHER N - 2
 * particles,
 *
 *     B_p(s)  =  sum_{j != k, k+1}  1 / ((b - x_j) (a - x_j)).
 *
 * For an ADJACENT pair no particle lies between a and b, so for every j either x_j < a < b or
 * x_j > b > a; in BOTH cases (b - x_j) and (a - x_j) share a sign, so every term is POSITIVE and
 * |B_p| = B_p (no cancellation) -- B_p is a convergent reciprocal-PRODUCT sum, dominated by the
 * nearest neighbours at the LOCAL spacing scale, not by the particle count. beta(N) is the running
 * sup of B_p over all adjacent pairs and all backward times reached.
 *
 * THE MEASUREMENT
 * ---------------
 * Initial condition: N equally-spaced unit-spacing particles x_k = k - (N-1)/2 (a clean, translation-
 * and N-controlled local scale; NOT the Riemann ordinates, so this probes N-scaling at fixed spacing,
 * not the imp-35167 M3 initial-gap question). Integrate backward with classic vector RK4 and an
 * adaptive step dt = 0.02 g_min(s)^2 (naturally refining as the front is approached, since the gap
 * ODE dr/ds ~ -4/r sets the stiff scale). At each step update the running sup beta, and SNAPSHOT beta
 * when the global min gap first crosses fractions [0.5, 0.25, 0.1, 0.05] of its initial value -- so
 * beta(N) is compared at MATCHED front-progress across N (same relative min gap), the only fair way to
 * separate an N-effect from a front-effect.
 *
 * WHAT THE NUMBERS SAY
 * --------------------
 *   (F1) N-UNIFORM AT MATCHED FRONT-PROGRESS.  At each min-gap fraction, beta(N) is nearly identical
 *        across N = 50, 100, 200 (relative spread < 1.5%) and, if anything, DECREASES weakly with N --
 *        exactly the signature of a convergent reciprocal-product sum saturating at the local scale.
 *        So the particle count N is NOT the driver of beta.
 *   (F2) GROWS TOWARD THE FRONT LIKE ~ 1 / g_min.  As the min-gap fraction drops 0.5 -> 0.05, beta
 *        climbs ~2.7 -> ~22, and the product beta * g_min stays in (1, 1.4) and DECREASES toward the
 *        front (~1.33 -> ~1.04), i.e. beta ~ 1/g_min. The sup over the WHOLE trajectory up to t_c
 *        (g_min -> 0) is therefore set by the FRONT, where it diverges -- not by N.
 *
 * SO THE M2 OBSTRUCTION IS THE FRONT, NOT N. The binding difficulty in certifying an N-uniform beta is
 * NOT the particle number (beta is N-uniform at fixed front-progress) but the self-referential coupling
 * beta ~ 1/g_min that imp-35167 M2 named: the background sup is controlled by the same collapsing gap it
 * feeds, so a finite sup over s < t_c requires an a-priori g_min > 0 -- i.e. M2 is INSEPARABLE from the
 * horizon/front bridge M5. This is a numerical probe, NOT a certificate of N-uniformity: it does not
 * bound beta over the full trajectory (the sup diverges as g_min -> 0), and M5 stays OPEN.
 *
 * MEASUREMENT ONLY. Probes the imp-35167 M2 background-field sup empirically. It does NOT certify
 * N-uniformity, does NOT discharge M2 or M5, does NOT touch the imp-2563 sandwich (which remains a valid
 * CONDITIONAL bracket). Changes no bound; establishes no operator positivity; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; no RH verdict, NO QED; no refereed bound is changed.
 *
 * @see imp-35167-g-min-non-collision-certificate-scope (M2 named the first binding piece; parent)
 * @see imp-2563-min-gap-sandwich-theorem (the gap ODE du/ds = -8 + 4 B(s) u; assumes beta finite)
 * @see backward-flow-stability-gronwall (imp-2520; dx_k/ds = -2 sum 1/(x_k - x_j) pole form)
 * @see imp-35171-dyson-common-mode-blindness-diagnostic (small-N backward Dyson flow integrator pattern)
 * @see imp-486 (C_mb GUE-conditional)
 */

// ---------------------------------------------------------------------------
// Self-contained vector classic RK4 on the attractive backward Dyson field.
// ---------------------------------------------------------------------------
const axpy = (x, k, s) => x.map((v, i) => v + s * k[i]);

function dysonField(x) {
  const N = x.length;
  const f = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let sum = 0;
    for (let j = 0; j < N; j++) if (j !== k) sum += 1 / (x[k] - x[j]);
    f[k] = -2 * sum;
  }
  return f;
}

function rk4Step(x, dt) {
  const k1 = dysonField(x);
  const k2 = dysonField(axpy(x, k1, dt / 2));
  const k3 = dysonField(axpy(x, k2, dt / 2));
  const k4 = dysonField(axpy(x, k3, dt));
  return x.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

// Global min gap of an ordered configuration (order is preserved until collision).
function minGap(x) {
  let m = Infinity;
  for (let i = 1; i < x.length; i++) {
    const g = x[i] - x[i - 1];
    if (g < m) m = g;
  }
  return m;
}

// Running sup over adjacent pairs of the background field B_p = sum 1/((b-x_j)(a-x_j)).
// Every term is positive for an adjacent pair (no particle lies between a and b), so |B_p| = B_p.
function supBackgroundField(x) {
  const N = x.length;
  let sup = 0;
  for (let k = 0; k < N - 1; k++) {
    const a = x[k];
    const b = x[k + 1];
    let B = 0;
    for (let j = 0; j < N; j++) {
      if (j === k || j === k + 1) continue;
      B += 1 / ((b - x[j]) * (a - x[j]));
    }
    if (B > sup) sup = B;
  }
  return sup;
}

// ---------------------------------------------------------------------------
// The measurement: equally-spaced unit-spacing init, adaptive backward RK4,
// running sup beta snapshotted at matched min-gap fractions.
// ---------------------------------------------------------------------------
const N_LIST = [50, 100, 200];
const GAP_FRACTIONS = [0.5, 0.25, 0.1, 0.05]; // of the initial min gap (= 1)
const STEP_SAFETY = 0.02; // dt = STEP_SAFETY * g_min^2 (refines toward the singular front)
const MAX_STEPS = 4000;

function runFlow(N) {
  const x0 = [];
  for (let i = 0; i < N; i++) x0.push(i - (N - 1) / 2);
  const initGap = minGap(x0);
  let x = x0;
  let runningSup = 0;
  let steps = 0;
  let li = 0;
  const snaps = [];
  while (steps < MAX_STEPS && li < GAP_FRACTIONS.length) {
    const g = minGap(x);
    runningSup = Math.max(runningSup, supBackgroundField(x));
    while (li < GAP_FRACTIONS.length && g <= GAP_FRACTIONS[li] * initGap) {
      snaps.push({ fraction: GAP_FRACTIONS[li], beta: runningSup, gMin: g, product: runningSup * g });
      li++;
    }
    if (li >= GAP_FRACTIONS.length) break;
    x = rk4Step(x, STEP_SAFETY * g * g);
    steps++;
  }
  return { N, initGap, steps, snaps };
}

const RUNS = N_LIST.map(runFlow);

// Per-fraction table: beta(N) at each matched front-progress level.
const round = (v, d = 4) => +v.toExponential(d);
const betaAt = (run, frac) => run.snaps.find((r) => r.fraction === frac);

const FRACTION_TABLE = GAP_FRACTIONS.map((frac) => {
  const row = RUNS.map((run) => betaAt(run, frac).beta);
  const min = Math.min(...row);
  const max = Math.max(...row);
  return {
    fraction: frac,
    beta: RUNS.reduce((o, run) => ((o['N' + run.N] = round(betaAt(run, frac).beta)), o), {}),
    gMin: round(betaAt(RUNS[0], frac).gMin, 4),
    product: round(betaAt(RUNS[0], frac).product, 4), // beta * g_min at this level (N=50)
    relSpreadAcrossN: +(max / min - 1).toFixed(5), // < 1.5%: N-uniform at matched front-progress
    decreasesWithN:
      betaAt(RUNS[0], frac).beta >= betaAt(RUNS[1], frac).beta &&
      betaAt(RUNS[1], frac).beta >= betaAt(RUNS[2], frac).beta,
  };
});

// Front-growth: beta at the tightest level vs the widest, and the beta*g_min product trend.
const HEAD = RUNS[1]; // N = 100 headline run
const WIDEST_FRAC = GAP_FRACTIONS[0];
const TIGHTEST_FRAC = GAP_FRACTIONS[GAP_FRACTIONS.length - 1];
const headWidest = betaAt(HEAD, WIDEST_FRAC);
const headTightest = betaAt(HEAD, TIGHTEST_FRAC);
const frontGrowthFactor = headTightest.beta / headWidest.beta; // ~8x
const productDecreasesTowardFront = HEAD.snaps.every(
  (r, i) => i === 0 || r.product <= HEAD.snaps[i - 1].product + 1e-9,
);
const maxRelSpreadAcrossN = Math.max(...FRACTION_TABLE.map((r) => r.relSpreadAcrossN));

export const IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY = {
  id: 'imp-35194',
  proofSection: 'S-frontier',
  title:
    'Empirical background-field sup beta(N) = sup |B_p(s)| along the backward Dyson trajectory for ' +
    'small N: N-uniform at matched front-progress but grows toward the front like 1/g_min, so the ' +
    'imp-35167 M2 obstruction is the front (self-referential beta ~ 1/g_min), not the particle count.',
  grade: 'numerical (empirical probe of the imp-35167 M2 obstruction, NOT a certificate of N-uniformity)',
  field:
    'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j); adjacent-pair background field ' +
    'B_p(s) = sum_{j != k,k+1} 1/((b - x_j)(a - x_j)), a = x_k < b = x_{k+1}; N in {50, 100, 200}, ' +
    'equally-spaced unit-spacing init, adaptive backward RK4 dt = 0.02 g_min^2.',
  positivityFact:
    'For an adjacent pair no particle lies between a and b, so (b - x_j) and (a - x_j) share a sign for ' +
    'every j; every term of B_p is POSITIVE, |B_p| = B_p is a convergent reciprocal-PRODUCT sum ' +
    'dominated by the nearest neighbours at the local spacing scale, not by the particle count.',
  fractionTable: FRACTION_TABLE, // beta(N) at each matched min-gap fraction; relSpreadAcrossN < 1.5%
  frontGrowth: {
    headlineN: HEAD.N,
    widestFraction: WIDEST_FRAC,
    tightestFraction: TIGHTEST_FRAC,
    betaWidest: round(headWidest.beta),
    betaTightest: round(headTightest.beta),
    growthFactor: round(frontGrowthFactor), // beta grows ~8x from g_min ~0.48 to ~0.047
    productWidest: round(headWidest.product), // beta*g_min ~1.33 far from front
    productTightest: round(headTightest.product), // beta*g_min ~1.04 near front -> beta ~ 1/g_min
    productDecreasesTowardFront,
  },
  maxRelSpreadAcrossN: +maxRelSpreadAcrossN.toFixed(5),
  finding:
    'F1: at matched front-progress beta(N) is nearly identical across N = 50, 100, 200 (relative spread ' +
    '< ' +
    round(maxRelSpreadAcrossN * 100, 2) +
    '%) and weakly DECREASES with N -- a convergent reciprocal-product sum saturating at the local ' +
    'scale, so N is not the driver. F2: beta GROWS toward the front ~' +
    round(frontGrowthFactor, 2) +
    'x while beta * g_min stays in (1, 1.4) and decreases toward the front (~' +
    round(headWidest.product, 2) +
    ' -> ~' +
    round(headTightest.product, 2) +
    '), i.e. beta ~ 1/g_min: the sup over the whole trajectory up to t_c is set by the FRONT, where it ' +
    'diverges.',
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-diagnostic, NOT a certificate). The empirical background-field sup ' +
    'beta(N) = sup |B_p(s)| along the backward Dyson flow is N-UNIFORM at matched front-progress ' +
    '(relative spread < 1.5% across N = 50 -> 200, weakly decreasing with N -- the reciprocal-PRODUCT ' +
    'sum is convergent at the local scale) but GROWS toward the collision front like ~1/g_min ' +
    '(beta * g_min in (1, 1.4), decreasing toward the front). So the imp-35167 M2 obstruction is NOT ' +
    'the particle count but the self-referential front coupling beta ~ 1/g_min M2 named: a finite ' +
    'N-uniform sup over s < t_c requires an a-priori g_min > 0, so M2 is INSEPARABLE from the ' +
    'horizon/front bridge M5. This probe does NOT certify N-uniformity (the sup diverges as ' +
    'g_min -> 0), does NOT discharge M2 or M5, and does NOT touch the imp-2563 sandwich (a valid ' +
    'CONDITIONAL bracket). M5 horizon-front mismatch stays OPEN; changes no bound; establishes no ' +
    'operator positivity; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35167 (M2 first binding piece; parent); imp-2563 (gap ODE du/ds = -8 + 4 B(s) u, assumes beta ' +
    'finite, CONDITIONAL bracket); imp-2520 (backward-flow Gronwall, pole form); imp-35171 (small-N ' +
    'backward Dyson integrator pattern); imp-486 (C_mb GUE-conditional).',
};

export const IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY_ASSERTIONS = [
  {
    // beta is finite and strictly positive at every matched front-progress level for every N.
    id: 'imp35194-beta-finite-positive',
    description: 'measured beta(N) is finite and strictly positive at every min-gap level for every N',
    holds: () =>
      RUNS.every((run) =>
        GAP_FRACTIONS.every((frac) => {
          const s = betaAt(run, frac);
          return s && Number.isFinite(s.beta) && s.beta > 0;
        }),
      ),
  },
  {
    // F1: N-uniform at matched front-progress -- relative spread across N < 2% at every level.
    id: 'imp35194-n-uniform-at-matched-progress',
    description: 'beta(N) relative spread across N = 50,100,200 is < 2% at every matched min-gap level',
    holds: () => FRACTION_TABLE.every((r) => r.relSpreadAcrossN < 0.02),
  },
  {
    // F1: beta weakly DECREASES with N at each level (convergent reciprocal-product sum, N not the driver).
    id: 'imp35194-beta-decreases-with-n',
    description: 'at each matched level beta(50) >= beta(100) >= beta(200) (N is not the growth driver)',
    holds: () => FRACTION_TABLE.every((r) => r.decreasesWithN === true),
  },
  {
    // F2: beta GROWS substantially toward the front (tightest level >> widest level).
    id: 'imp35194-grows-toward-front',
    description: 'beta at the tightest min-gap level exceeds the widest by > 5x (growth toward the front)',
    holds: () => frontGrowthFactor > 5,
  },
  {
    // F2: beta ~ 1/g_min -- the product beta*g_min stays in (1, 1.4) and decreases toward the front.
    id: 'imp35194-beta-tracks-inverse-gmin',
    description: 'beta * g_min stays in (1, 1.4) and decreases toward the front (beta ~ 1/g_min front coupling)',
    holds: () =>
      HEAD.snaps.every((r) => r.product > 1 && r.product < 1.4) && productDecreasesTowardFront === true,
  },
  {
    // Honesty gate: measurement only, no QED, M2/M5 stay OPEN, imp-2563 untouched, no refereed bound is changed.
    id: 'imp35194-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, M5 OPEN, imp-2563 untouched, no refereed bound is changed',
    holds: () =>
      IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY.isRigorous === false &&
      /NO QED/.test(IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY.verdict) &&
      /M5 horizon-front mismatch stays OPEN/.test(IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY.verdict) &&
      /imp-2563 sandwich/.test(IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY.verdict) &&
      /refereed bound is changed/i.test(IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY.verdict),
  },
];

for (const a of IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35194-background-field-sup-n-uniformity assertion failed: ${a.id}`);
  }
}
