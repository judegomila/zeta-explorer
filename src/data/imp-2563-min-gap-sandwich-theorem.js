/**
 * @module imp-2563-min-gap-sandwich-theorem
 * @fileoverview Closes the named open sub-gap imp-2563-sub-sandwich-theorem
 * (deliverable B / residual R_B of imp-2563): the per-N backward-flow
 * MIN-GAP SANDWICH theorem -- the gap-propagation route that turns the
 * imp-2561/imp-2562 one-sided pinch into a TWO-sided bracket on the
 * first-collision time t_c(N). Sibling
 * imp-2563-discriminant-tc-characterization.js shipped the headline
 * discriminant ladder (Lemma S4-1..3) and named R_B "NOT in this module";
 * THIS module supplies R_B. Conventions match
 * backward-flow-stability-gronwall.js: particles x_1 < ... < x_N evolve under
 * the ATTRACTIVE rational Calogero-Moser / Dyson flow
 *
 *     dx_k/ds  =  -2 sum_{j != k} 1 / (x_k - x_j),     s = -t >= 0,
 *
 * in de Bruijn-Newman time units; t_c(N) is the first-collision time.
 *
 * THE EXACT GAP ODE (pure algebra, every finite N)
 * ------------------------------------------------
 * Fix any adjacent pair a = x_lo < b = x_hi with gap r = b - a, and write
 * B(s) = sum_{j != lo, hi} 1 / ((b - x_j)(a - x_j)) for the net field of the
 * OTHER N-2 particles on that pair. From the drift,
 *
 *     dr/ds = db/ds - da/ds
 *           = ( -2/r - 2 sum_j 1/(b - x_j) ) - ( +2/r - 2 sum_j 1/(a - x_j) )
 *           = -4/r + 2 sum_j [ 1/(a - x_j) - 1/(b - x_j) ]
 *           = -4/r + 2 r B(s),                                            (R)
 *
 * since 1/(a - x_j) - 1/(b - x_j) = (b - a)/((a - x_j)(b - x_j)) = r / ((a -
 * x_j)(b - x_j)). The self-interaction contributes the singular -4/r; every
 * background term enters only through the bounded scalar B(s). Setting
 * u = r^2 LINEARISES (R) exactly:
 *
 *     du/ds = 2 r (dr/ds) = -8 + 4 B(s) u.                                (U)
 *
 * THEOREM B (min-gap sandwich -- the two-sided pinch)
 * ---------------------------------------------------
 * Let g = g_min(0) be the smallest initial gap and let
 * beta = sup_{0 <= s < t_c} |B_p(s)| over all adjacent pairs p, assumed
 * finite with beta g^2 < 2. Then the first-collision time is sandwiched:
 *
 *     T_-(g, beta) <= t_c(N) <= T_+(g, beta),     where
 *     T_-(g, beta) = (1 / (4 beta)) log( 1 + beta g^2 / 2 ),
 *     T_+(g, beta) = (1 / (4 beta)) log( 2 / (2 - beta g^2) ).
 *
 * PROOF.
 * (Upper, t_c <= T_+) Track the min-gap pair, u(s) = r(s)^2 with u(0) = g^2.
 * Because u >= 0 and |B(s)| <= beta, (U) gives du/ds <= -8 + 4 beta u
 * pointwise on the actual trajectory. Let v solve v' = -8 + 4 beta v,
 * v(0) = g^2 (the linear comparison ODE). Then w = v - u has w(0) = 0 and
 * w' = v' - u' >= (-8 + 4 beta v) - (-8 + 4 beta u) = 4 beta w, so by Gronwall
 * w(s) >= 0, i.e. u(s) <= v(s). The explicit solution
 * v(s) = (g^2 - 2/beta) e^{4 beta s} + 2/beta reaches 0 at
 * s = T_+(g, beta); since u <= v, the tracked gap, hence the global
 * first collision, occurs no later: t_c <= T_+.
 * (Lower, t_c >= T_-) Let U(s) = min_p r_p(s)^2 be the squared GLOBAL min gap
 * (a min of finitely many C^1 functions, hence locally Lipschitz). At each s
 * its lower Dini derivative equals the min of u_p' over the active (minimising)
 * pairs, and every active pair satisfies u_p' = -8 + 4 B_p u_p >= -8 - 4 beta U
 * (using U = u_p there and |B_p| <= beta). Thus D_- U >= -8 - 4 beta U in the
 * lower-Dini sense. Comparison with the solution m of m' = -8 - 4 beta m,
 * m(0) = g^2 -- namely m(s) = (g^2 + 2/beta) e^{-4 beta s} - 2/beta, which
 * hits 0 at s = T_-(g, beta) -- gives U(s) >= m(s) > 0 for s < T_-. No pair
 * can collide before T_-, so t_c >= T_-. QED.
 *
 * Both bounds are UNCONDITIONAL (no RH): the upper uses only the min-gap
 * pair, the lower only the global-min-gap differential inequality. As g -> 0,
 * log(1 + x) and -log(1 - x) both equal x - O(x^2) with x = beta g^2 / 2, so
 *
 *     T_-  =  (g^2 / 8) ( 1 - beta g^2 / 4 + O(g^4) ),
 *     T_+  =  (g^2 / 8) ( 1 + beta g^2 / 4 + O(g^4) ),
 *
 * a SYMMETRIC bracket of half-width (beta g^2 / 4)(g^2 / 8): the sandwich pins
 * t_c(N) = (g^2 / 8)(1 + O(beta g^2)), with relative width beta g^2 / 2 -> 0.
 *
 * CONSISTENCY with imp-2561 / imp-2562 (the one-sided pinch)
 * ---------------------------------------------------------
 * Since log(1/(1 - x)) <= x/(1 - x), the upper bound satisfies
 * T_+ = (1/(4 beta)) log(1/(1 - beta g^2 / 2)) <= g^2 / (8 (1 - beta g^2 / 2)),
 * the exact imp-2561/imp-2562 one-sided pinch with their constant S read off
 * as beta. So Theorem B REPRODUCES the known upper pinch (and is never looser)
 * while ADDING the matched lower bound T_- that the one-sided route lacked --
 * this matched lower bound is the content of deliverable B / R_B.
 *
 * VERIFIED below at two controlled small-gap configurations (one embedded
 * small gap among well-separated background particles, gaps g and g/2):
 * adaptive-RK4 t_c lands inside [T_-, T_+]; the leading value g^2/8 lies
 * strictly inside; the bracket relative width scales like g^2 (halving g
 * quarters it); and T_+ <= the imp-2561 one-sided pinch at every row.
 *
 * NOT done here (kept honest, named): the EXPLICIT per-N small-gap rate
 * constant mu (residual R_C, RH-conditional) and the data-audit residual R_A
 * are separate and remain as named in the sibling module.
 *
 * @see imp-2563
 * @see imp-2563-discriminant-tc-characterization (headline deliverable; named R_B open)
 * @see imp-2561 / imp-2562 one-sided pinch t_c <= g^2 / (8 (1 - S g^2 / 2))
 * @see backward-flow-stability-gronwall (flow conventions; heat-semigroup Lemma A)
 */

// ── Self-contained finite-N machinery (no heavy imports) ─────────────────────

/** Attractive Calogero-Moser drift dx_k/ds = -2 sum_{j!=k} 1/(x_k - x_j). */
function drift(x) {
  const N = x.length;
  const d = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let acc = 0;
    for (let j = 0; j < N; j++) if (j !== k) acc += 1 / (x[k] - x[j]);
    d[k] = -2 * acc;
  }
  return d;
}

/** One classical RK4 step of size h. */
function rk4Step(x, h) {
  const k1 = drift(x);
  const x2 = x.map((v, i) => v + 0.5 * h * k1[i]);
  const k2 = drift(x2);
  const x3 = x.map((v, i) => v + 0.5 * h * k2[i]);
  const k3 = drift(x3);
  const x4 = x.map((v, i) => v + h * k3[i]);
  const k4 = drift(x4);
  return x.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

/** Index lo of the adjacent pair (lo, lo+1) realising the global min gap. */
function minGapPair(x) {
  let lo = 0;
  let best = Infinity;
  for (let i = 0; i < x.length - 1; i++) {
    const g = x[i + 1] - x[i];
    if (g < best) {
      best = g;
      lo = i;
    }
  }
  return { lo, hi: lo + 1, gap: best };
}

/** Background field B = sum_{j != lo,hi} 1/((x_hi - x_j)(x_lo - x_j)). */
function backgroundField(x, lo, hi) {
  const a = x[lo];
  const b = x[hi];
  let s = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === lo || j === hi) continue;
    s += 1 / ((b - x[j]) * (a - x[j]));
  }
  return s;
}

// ── Integrate one configuration to collision; build the sandwich ─────────────

/**
 * Adaptive-RK4 collapse of a single embedded small gap, returning the
 * measured t_c, the field bound beta = max|B| along the flow, and the
 * theorem bounds T_-, T_+ at g = initial min gap.
 */
function sandwichWitness(x0) {
  let x = x0.slice();
  const start = minGapPair(x);
  const g = start.gap;
  const lo0 = start.lo;

  let s = 0;
  let beta = 0;
  let stablePair = true;
  let gap = start.gap;
  const EPS = 1e-5; // stop a hair before the singularity; correct analytically

  // Step shrinks like gap^2 (the local collapse timescale r^2/4), so the
  // singular -4/r term stays resolved and t_c is not over-integrated.
  while (gap > EPS) {
    const p = minGapPair(x);
    if (p.lo !== lo0) stablePair = false; // the min-gap pair must not switch
    beta = Math.max(beta, Math.abs(backgroundField(x, p.lo, p.hi)));
    const h = Math.max(1e-9, Math.min(1e-5, 0.001 * gap * gap));
    x = rk4Step(x, h);
    s += h;
    gap = minGapPair(x).gap;
    if (s > 10) break; // safety: never seen, collision is at ~g^2/8
  }
  const pf = minGapPair(x);
  beta = Math.max(beta, Math.abs(backgroundField(x, pf.lo, pf.hi)));
  const tc = s + (gap * gap) / 8; // remaining-time leading correction from EPS

  const tMinus = (1 / (4 * beta)) * Math.log(1 + (beta * g * g) / 2);
  const tPlus = (1 / (4 * beta)) * Math.log(2 / (2 - beta * g * g));
  const lead = (g * g) / 8;
  const onesidedPinch = (g * g) / (8 * (1 - (beta * g * g) / 2)); // imp-2561/2562

  return {
    g,
    beta,
    tcNumeric: tc,
    tMinus,
    tPlus,
    lead,
    onesidedPinch,
    stablePair,
    relWidth: (tPlus - tMinus) / lead,
    bracketsNumeric: tMinus * (1 - 1e-3) <= tc && tc <= tPlus * (1 + 1e-3),
    bracketsLead: tMinus < lead && lead < tPlus,
    refinesPinch: tPlus <= onesidedPinch,
  };
}

// Two configurations: a fixed well-separated background {-4, -2, 3} with one
// embedded small gap of width g (config A) and g/2 (config B). Same background
// => beta is nearly constant, so the bracket relative width (~ beta g^2 / 2)
// must quarter when g halves.
const CONFIG_A = sandwichWitness([-4, -2, 0.0, 0.3, 3]);
const CONFIG_B = sandwichWitness([-4, -2, 0.075, 0.225, 3]);
const WIDTH_RATIO = CONFIG_A.relWidth / CONFIG_B.relWidth; // expect ~4 (g^2 law)

// ── Exported record ──────────────────────────────────────────────────────────

export const MIN_GAP_SANDWICH_THEOREM = {
  id: 'imp-2563-sub-sandwich-theorem',
  parent: 'imp-2563',
  closes: 'imp-2563 deliverable B / residual R_B (per-N min-gap sandwich, gap-propagation route)',
  verdict: 'CLOSED',
  status:
    'Theorem B shipped: the exact gap ODE dr/ds = -4/r + 2 r B(s) linearises ' +
    'under u = r^2 to du/ds = -8 + 4 B(s) u, and |B| <= beta sandwiches the ' +
    'first-collision time as T_-(g,beta) <= t_c(N) <= T_+(g,beta) with ' +
    'T_-/+ = (1/4beta) log(1 + beta g^2/2) and (1/4beta) log(2/(2-beta g^2)). ' +
    'Both bounds are unconditional (upper: min-gap pair comparison; lower: ' +
    'global-min-gap Dini differential inequality) and collapse to (g^2/8)' +
    '(1 +/- beta g^2/4 + O(g^4)) -- a symmetric bracket of relative width ' +
    'beta g^2/2 -> 0. T_+ never exceeds the imp-2561/2562 one-sided pinch ' +
    'g^2/(8(1 - beta g^2/2)) (its constant S = beta), so Theorem B reproduces ' +
    'the known upper pinch and ADDS the matched lower bound.',

  exactGapOde: 'dr/ds = -4/r + 2 r B(s),  B(s) = sum_{j != lo,hi} 1/((b - x_j)(a - x_j))',
  linearisedForm: 'u = r^2  =>  du/ds = -8 + 4 B(s) u  (exact, linear in u)',
  upperBound: 'T_+(g,beta) = (1/(4 beta)) log( 2 / (2 - beta g^2) )',
  lowerBound: 'T_-(g,beta) = (1/(4 beta)) log( 1 + beta g^2 / 2 )',
  leadingOrder: 't_c(N) = (g^2/8)(1 + O(beta g^2)); symmetric half-width (beta g^2/4)(g^2/8)',
  unconditional: true,
  consistencyWithPinch:
    'T_+ <= g^2/(8(1 - beta g^2/2)) = imp-2561/2562 one-sided pinch (S := beta); ' +
    'Theorem B is never looser on the upper side and supplies the new lower bound.',

  witness: {
    configA: CONFIG_A,
    configB: CONFIG_B,
    widthRatioAoverB: WIDTH_RATIO,
    note:
      'background {-4,-2,3} with one embedded small gap g (A) and g/2 (B); ' +
      'adaptive-RK4 (step ~ gap^2) collision time lands inside [T_-, T_+], ' +
      'g^2/8 strictly inside, relative width ~ g^2 (ratio ~4), T_+ <= pinch.',
  },

  namedResidualsUntouched: {
    R_A: 'imp-2563-sub-data-audit / PATH_C ladder / imp-1149 re-grade (separate; see sibling).',
    R_C: 'imp-2563-sub-small-gap-rate: explicit small-gap constant mu (RH-conditional).',
  },

  sources: [
    'src/data/imp-2563-discriminant-tc-characterization.js (headline deliverable; named R_B open)',
    'src/data/backward-flow-stability-gronwall.js (flow conventions; heat-semigroup Lemma A)',
    'imp-2561 / imp-2562 one-sided pinch t_c <= g^2/(8(1 - S g^2/2))',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const MIN_GAP_SANDWICH_THEOREM_ASSERTIONS = [
  {
    id: 'imp2563-sandwich-brackets-leading-order',
    holds: () => CONFIG_A.bracketsLead === true && CONFIG_B.bracketsLead === true,
    why:
      'Theorem B: the analytic leading value g^2/8 must lie STRICTLY inside ' +
      '[T_-(g,beta), T_+(g,beta)] at both configurations. This is the pure-' +
      'formula content of the sandwich (no integration noise); failure means ' +
      'the T_-/T_+ closed forms or their leading expansion is wrong.',
  },
  {
    id: 'imp2563-sandwich-brackets-measured-tc',
    holds: () =>
      CONFIG_A.bracketsNumeric === true &&
      CONFIG_B.bracketsNumeric === true &&
      CONFIG_A.stablePair === true &&
      CONFIG_B.stablePair === true,
    why:
      'The adaptive-RK4 measured first-collision time t_c must land inside the ' +
      'theorem bracket [T_-, T_+] (within 1e-3 integration tolerance) at both ' +
      'configurations, and the global min-gap pair must never switch (so the ' +
      'global lower-bound Dini argument applies). Failure means the gap ODE ' +
      '(R)/(U), the comparison, or the field bound beta is mis-derived.',
  },
  {
    id: 'imp2563-sandwich-width-scales-like-gsq',
    holds: () => WIDTH_RATIO > 3.6 && WIDTH_RATIO < 4.5,
    why:
      'The bracket relative width is beta g^2/2 to leading order, so halving g ' +
      '(config A -> B) must quarter it: the A/B width ratio must be ~4. This ' +
      'certifies the O(beta g^2) pinning rate, i.e. that the sandwich actually ' +
      'collapses onto t_c = g^2/8 as g -> 0.',
  },
  {
    id: 'imp2563-sandwich-refines-onesided-pinch',
    holds: () => CONFIG_A.refinesPinch === true && CONFIG_B.refinesPinch === true,
    why:
      'Consistency with imp-2561/imp-2562: the upper bound T_+ must not exceed ' +
      'the one-sided pinch g^2/(8(1 - beta g^2/2)) (their S read off as beta). ' +
      'If T_+ > pinch the new upper bound would contradict the established ' +
      'result; equality-to-leading-order is the expected matched behaviour.',
  },
];

// ── Self-executing tripwire (matches the imp-2563 sibling pattern) ────────────
for (const a of MIN_GAP_SANDWICH_THEOREM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `[imp-2563-min-gap-sandwich-theorem] build-time assertion failed: ${a.id} - ${a.why}`,
    );
  }
}
