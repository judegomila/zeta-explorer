/**
 * @module imp-35301-three-factor-invariant-convergence-rate
 *
 * imp-35301 (numerical, frontier-diagnostic, MEASUREMENT ONLY): imp-35238 tabulated the real-ordinate
 * three-factor product beta * g_min * (x_2 - x_0) approaching 1 from ABOVE as the min-gap fraction
 * shrinks (N=50: 1.375 -> 1.182 -> 1.068 -> 1.034 -> 1.007 -> 1.0007 -> 1.00007 at fractions
 * 0.5 .. 1e-4) but NEVER characterized the DECAY LAW of that approach. THIS module MEASURES the
 * convergence-rate exponent q in |beta * g_min * (x_2 - x_0) - 1| ~ (min-gap fraction)^q across
 * N = 50, 100, 200, tests whether q is N-uniform, and identifies the subdominant reciprocal-product
 * term (imp-35215 single-dominant-term residue) that sets the approach. It re-runs the SAME
 * imp-35238 real-ordinate backward-Dyson flow and integrator; only the diagnostics differ. It
 * certifies NOTHING; it is a numerical probe. MEASUREMENT ONLY; NO QED.
 *
 * THE RESULT: THE APPROACH IS LINEAR (q -> 1) AND N-UNIFORM
 * --------------------------------------------------------
 * Regressing log|invariant - 1| on log(min-gap fraction) over the deep-front fractions
 * (<= 0.05, where the dominant term already carries > 95% of beta) gives a slope q_front that pins
 * to 1 at every N:
 *
 *     N = 50 :  q_front = 0.9960   (global q = 1.0091)
 *     N = 100:  q_front = 1.0004   (global q = 1.0100)
 *     N = 200:  q_front = 0.9962   (global q = 1.0012)
 *
 * The three exponents span only ~0.004 (front) / ~0.009 (global), so q is N-UNIFORM: the invariant
 * closes on 1 LINEARLY in the min-gap fraction, indifferent to N. Equivalently
 * |beta * g_min * (x_2 - x_0) - 1| ~ C_N * g_min, and since g_min = fraction * initGap the deviation
 * is exactly proportional to the fraction.
 *
 * THE RESIDUE COEFFICIENT: dev / g_min STABILIZES (a cleaner N-invariant of the RATE)
 * ---------------------------------------------------------------------------------
 * The prefactor C_N = (invariant - 1) / g_min is essentially constant across the deep-front
 * fractions (last-three relative spread < 2e-3 at every N): C_50 ~ 0.844, C_100 ~ 0.677,
 * C_200 ~ 2.053. So the RATE is clean (q = 1) but its COEFFICIENT is N-dependent, tracking the
 * local collapse geometry, NOT the invariant limit 1 (which is N-uniform, imp-35238). The linear
 * rate is the fingerprint of a single subdominant correction, not a fractional-power crossover.
 *
 * THE SUBDOMINANT TERM SETS THE APPROACH (imp-35215 residue), AND IT DECAYS AT THE SAME q = 1
 * -------------------------------------------------------------------------------------------
 * At the collapsing sup pair (x_a, x_b) the background field B_p = sum 1/((b - x_j)(a - x_j)) is
 * dominated by ONE near-coincident particle jStar (dominant fraction -> 1, > 0.999 at the front).
 * The residue of the invariant from 1 is carried by the SECOND-largest reciprocal-product term (the
 * next-nearest particle). Its share of beta decays with the SAME exponent as the deviation:
 *
 *     N = 50 :  q_sub_front = 0.9960     subFrac(1e-4) = 2.67e-5
 *     N = 100:  q_sub_front = 0.9977     subFrac(1e-4) = 8.80e-6
 *     N = 200:  q_sub_front = 0.9899     subFrac(1e-4) = 5.52e-5
 *
 * So the approach to 1 is governed by the single subdominant reciprocal-product term, which (like the
 * min gap itself) shrinks linearly toward the front. This SHARPENS imp-35238 (the approach it saw
 * from above is q = 1 linear, N-uniform in exponent though not in coefficient) and matches the
 * imp-35215 single-dominant-term picture (a leading term giving exactly 1, plus an O(g_min) residue).
 *
 * MEASUREMENT ONLY. Probes the imp-35167 M2 background-field sup on real ordinates. It does NOT certify
 * N-uniformity of beta (beta still diverges ~1/g_min toward the front; the invariant being bounded IS
 * the statement beta ~ 1/g_min), does NOT discharge M2 or M5, does NOT touch the imp-2563 sandwich (a
 * valid CONDITIONAL bracket). Changes no bound; establishes no operator positivity; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; M2/M5 stay OPEN; no RH verdict, NO QED; no refereed bound is changed.
 *
 * @see imp-35238-real-ordinate-three-factor-invariant (parent: approach-to-1 from above, decay law unmeasured)
 * @see imp-35281-real-ordinate-three-factor-invariant-larger-N (extends N=250..400; invariant stays pinned at 1)
 * @see imp-35282-span-vs-rvm-mean-spacing (span factor vs RvM mean spacing; distinct axis)
 * @see imp-35215-beta-gmin-near-front-limit (single-dominant-term derivation beta*g_min*(x_2-x_0)->1)
 * @see imp-35167-g-min-non-collision-certificate-scope (M2 first binding piece)
 * @see imp-2563-min-gap-sandwich-theorem (gap ODE du/ds = -8 + 4 B(s) u; assumes beta finite)
 * @see imp-486 (C_mb GUE-conditional)
 */

// ---------------------------------------------------------------------------
// First 200 REAL Riemann zero ordinates gamma_1 .. gamma_200 (Odlyzko table).
// Baked literal == ZEROS_EXTENDED.slice(0, 200) of zeros-to-1e6.js; kept light
// so this measurement module does NOT transitively pull the 16.7 MB zeros bundle
// (see memory feedback_verify_heavy_assertion_modules / no-heavy-imports).
// ---------------------------------------------------------------------------
const FIRST_200_ZEROS = [
  14.1347251420,  21.0220396390,  25.0108575800,  30.4248761260,  32.9350615880,  37.5861781590,
  40.9187190120,  43.3270732810,  48.0051508810,  49.7738324780,  52.9703214780,  56.4462476970,
  59.3470440030,  60.8317785250,  65.1125440480,  67.0798105290,  69.5464017110,  72.0671576740,
  75.7046906990,  77.1448400690,  79.3373750200,  82.9103808540,  84.7354929810,  87.4252746130,
  88.8091112080,  92.4918992710,  94.6513440410,  95.8706342280,  98.8311942180,  101.3178510060,
  103.7255380400,  105.4466230520,  107.1686111840,  111.0295355430,  111.8746591770,  114.3202209150,
  116.2266803210,  118.7907828660,  121.3701250020,  122.9468292940,  124.2568185540,  127.5166838800,
  129.5787042000,  131.0876885310,  133.4977372030,  134.7565097530,  138.1160420550,  139.7362089520,
  141.1237074040,  143.1118458080,  146.0009824870,  147.4227653430,  150.0535204210,  150.9252576120,
  153.0246938110,  156.1129092940,  157.5975918180,  158.8499881710,  161.1889641380,  163.0307096870,
  165.5370691880,  167.1844399780,  169.0945154160,  169.9119764790,  173.4115365200,  174.7541915230,
  176.4414342980,  178.3774077760,  179.9164840200,  182.2070784840,  184.8744678480,  185.5987836780,
  187.2289225840,  189.4161586560,  192.0266563610,  193.0797266040,  195.2653966800,  196.8764818410,
  198.0153096760,  201.2647519440,  202.4935945140,  204.1896718030,  205.3946972020,  207.9062588880,
  209.5765097170,  211.6908625950,  213.3479193600,  214.5470447830,  216.1695385080,  219.0675963490,
  220.7149188390,  221.4307055550,  224.0070002550,  224.9833246700,  227.4214442800,  229.3374133060,
  231.2501887000,  231.9872352530,  233.6934041790,  236.5242296660,  237.7698204810,  239.5554775730,
  241.0491577960,  242.8232719340,  244.0708984970,  247.1369900750,  248.1019900600,  249.5736896450,
  251.0149477950,  253.0699867480,  255.3062564550,  256.3807136940,  258.6104394920,  259.8744069900,
  260.8050845050,  263.5738939050,  265.5578518390,  266.6149737820,  267.9219150830,  269.9704490240,
  271.4940556420,  273.4596091880,  275.5874926490,  276.4520495030,  278.2507435300,  279.2292509280,
  282.4651147650,  283.2111857330,  284.8359639810,  286.6674453630,  287.9119205010,  289.5798549290,
  291.8462913290,  293.5584341390,  294.9653696190,  295.5732548790,  297.9792770620,  299.8403260540,
  301.6493254620,  302.6967495900,  304.8643713410,  305.7289126020,  307.2194961280,  310.1094631470,
  311.1651415300,  312.4278011810,  313.9852857310,  315.4756160890,  317.7348059420,  318.8531042560,
  321.1601343090,  322.1445586720,  323.4669695580,  324.8628660520,  327.4439012620,  329.0330716800,
  329.9532397280,  331.4744675830,  333.6453785250,  334.2113548330,  336.8418504280,  338.3399928510,
  339.8582167250,  341.0422611110,  342.0548775100,  344.6617029400,  346.3478705660,  347.2726775840,
  349.3162608710,  350.4084193490,  351.8786490250,  353.4889004890,  356.0175749770,  357.1513022520,
  357.9526851020,  359.7437549530,  361.2893616960,  363.3313305790,  364.7360241140,  366.2127102880,
  367.9935754820,  368.9684380960,  370.0509192120,  373.0619283720,  373.8648739110,  375.8259127670,
  376.3240922310,  378.4366802500,  379.8729753470,  381.4844686170,  383.4435294500,  384.9561168150,
  385.8613008460,  387.2228902220,  388.8461283540,  391.4560835640,  392.2450833400,  393.4277438440,
  395.5828700110,  396.3818542230,
];

// ---------------------------------------------------------------------------
// Self-contained vector classic RK4 on the attractive backward Dyson field
// (identical integrator to imp-35238 / imp-35218 / imp-35215; only diagnostics differ).
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

function minGap(x) {
  let m = Infinity;
  for (let i = 1; i < x.length; i++) {
    const g = x[i] - x[i - 1];
    if (g < m) m = g;
  }
  return m;
}

// Background field of adjacent pair (x_k, x_{k+1}); every term positive (imp-35194 positivityFact).
function backgroundField(x, k) {
  const a = x[k];
  const b = x[k + 1];
  let B = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === k || j === k + 1) continue;
    B += 1 / ((b - x[j]) * (a - x[j]));
  }
  return B;
}

// (running sup, argmax pair index) of the background field over adjacent pairs.
function supBackgroundField(x) {
  let sup = 0;
  let arg = -1;
  for (let k = 0; k < x.length - 1; k++) {
    const B = backgroundField(x, k);
    if (B > sup) {
      sup = B;
      arg = k;
    }
  }
  return { sup, arg };
}

// Ordinary least-squares slope of y on x over an array of [x, y] points.
function olsSlope(pts) {
  const n = pts.length;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (const [x, y] of pts) {
    sx += x;
    sy += y;
    sxx += x * x;
    sxy += x * y;
  }
  return (n * sxy - sx * sy) / (n * sxx - sx * sx);
}

// ---------------------------------------------------------------------------
// The measurement: first-N REAL ordinate init, adaptive backward RK4, and at each
// matched min-gap fraction snapshot the three-factor invariant plus the dominant
// AND subdominant reciprocal-product term shares of beta.
// ---------------------------------------------------------------------------
const N_LIST = [50, 100, 200];
const FRACTIONS = [0.5, 0.25, 0.1, 0.05, 0.01, 0.001, 0.0001]; // of EACH run own initial min gap
const FRONT_FRACTION = 0.05; // fractions <= this define the deep-front regime for the rate fit
const STEP_SAFETY = 0.02; // dt = STEP_SAFETY * g_min^2 (refines toward the singular front)
const MAX_STEPS = 200000;

function runFlow(N) {
  const x0 = FIRST_200_ZEROS.slice(0, N);
  const initGap = minGap(x0);
  let x = x0;
  let li = 0;
  let steps = 0;
  const snaps = [];
  while (steps < MAX_STEPS && li < FRACTIONS.length) {
    const g = minGap(x);
    while (li < FRACTIONS.length && g <= FRACTIONS[li] * initGap) {
      const { sup, arg } = supBackgroundField(x);
      const kb = arg;
      const a = x[kb];
      const b = x[kb + 1];
      // Dominant AND subdominant reciprocal-product terms of B_p (nearest / next-nearest particle).
      let t1 = 0;
      let j1 = -1;
      let t2 = 0;
      for (let j = 0; j < x.length; j++) {
        if (j === kb || j === kb + 1) continue;
        const term = 1 / ((b - x[j]) * (a - x[j]));
        if (term > t1) {
          t2 = t1;
          t1 = term;
          j1 = j;
        } else if (term > t2) {
          t2 = term;
        }
      }
      const span = Math.max(Math.abs(a - x[j1]), Math.abs(b - x[j1])); // far factor x_2 - x_0
      const invariant = sup * g * span; // beta * g_min * (x_2 - x_0) -> 1
      snaps.push({
        fraction: FRACTIONS[li],
        gMin: g,
        invariant,
        dev: invariant - 1, // approaches 0 from above; |dev| ~ fraction^q is what we measure
        residueCoef: (invariant - 1) / g, // (invariant - 1) / g_min: the RATE prefactor C_N
        dominantFraction: t1 / sup, // -> 1 (single term carries beta)
        subFraction: t2 / sup, // share of beta in the SECOND-largest term (the residue driver)
      });
      li++;
    }
    if (li >= FRACTIONS.length) break;
    x = rk4Step(x, STEP_SAFETY * g * g);
    steps++;
  }
  return { N, initGap, steps, snaps };
}

const RUNS = N_LIST.map(runFlow);
const round = (v, d = 6) => +v.toExponential(d);

// Per-N convergence-rate fits: q over ALL fractions and over the deep front (<= 0.05).
const RATE_TABLE = RUNS.map((run) => {
  const all = run.snaps.map((s) => [Math.log(s.fraction), Math.log(Math.abs(s.dev))]);
  const front = run.snaps
    .filter((s) => s.fraction <= FRONT_FRACTION)
    .map((s) => [Math.log(s.fraction), Math.log(Math.abs(s.dev))]);
  const subFront = run.snaps
    .filter((s) => s.fraction <= FRONT_FRACTION)
    .map((s) => [Math.log(s.fraction), Math.log(s.subFraction)]);
  const last3 = run.snaps.slice(-3).map((s) => s.residueCoef);
  const residueCoefRelSpread =
    (Math.max(...last3) - Math.min(...last3)) / Math.min(...last3);
  const tail = run.snaps[run.snaps.length - 1];
  return {
    N: run.N,
    qGlobal: +olsSlope(all).toFixed(4), // decay exponent over all fractions
    qFront: +olsSlope(front).toFixed(4), // deep-front decay exponent (-> 1, LINEAR)
    qSubFront: +olsSlope(subFront).toFixed(4), // subdominant-term share decays at the SAME exponent
    residueCoef: +tail.residueCoef.toFixed(5), // C_N = (invariant - 1)/g_min at the front (N-dependent)
    residueCoefRelSpread: round(residueCoefRelSpread, 3), // < 2e-3: coefficient is stable (single term)
    subFractionFront: round(tail.subFraction, 3), // share of beta in the subdominant term at 1e-4
    dominantFractionFront: +tail.dominantFraction.toFixed(5), // -> 1: one term carries beta
  };
});

// The N=50 deviation trajectory, showing the linear q=1 decay term by term.
const HEAD = RUNS[0];
const DEVIATION_TRAJECTORY = HEAD.snaps.map((s) => ({
  fraction: s.fraction,
  dev: round(s.dev, 4),
  residueCoef: +s.residueCoef.toFixed(5), // dev / g_min: flat across fractions (linear rate)
  subFraction: round(s.subFraction, 4),
}));

// q is N-UNIFORM: the front exponents span a tiny range and every one pins to 1.
const qFrontValues = RATE_TABLE.map((r) => r.qFront);
const qFrontSpreadAcrossN = Math.max(...qFrontValues) - Math.min(...qFrontValues);
const maxQFrontDevFromOne = Math.max(...qFrontValues.map((q) => Math.abs(q - 1)));
const qSubFrontValues = RATE_TABLE.map((r) => r.qSubFront);
const maxQSubFrontDevFromOne = Math.max(...qSubFrontValues.map((q) => Math.abs(q - 1)));
// The rate is LINEAR (q -> 1) at every N; the residue coefficient is N-dependent (NOT N-uniform).
const rateIsLinearEveryN = qFrontValues.every((q) => Math.abs(q - 1) < 0.05);
const residueCoefIsNDependent =
  Math.max(...RATE_TABLE.map((r) => r.residueCoef)) /
    Math.min(...RATE_TABLE.map((r) => r.residueCoef)) >
  1.5;
const residueCoefStableEveryN = RATE_TABLE.every((r) => r.residueCoefRelSpread < 5e-3);
const dominantFractionToOneEveryN = RATE_TABLE.every((r) => r.dominantFractionFront > 0.999);

export const IMP35301_THREE_FACTOR_INVARIANT_CONVERGENCE_RATE = {
  id: 'imp-35301',
  proofSection: 'S-frontier',
  title:
    'The imp-35238 real-ordinate three-factor invariant beta * g_min * (x_2 - x_0) closes on 1 ' +
    'LINEARLY in the min-gap fraction: regressing log|invariant - 1| on log(fraction) over the deep ' +
    'front gives a decay exponent q_front = 1 at every N (q in [' +
    Math.min(...qFrontValues).toFixed(3) +
    ', ' +
    Math.max(...qFrontValues).toFixed(3) +
    '], spread ~' +
    round(qFrontSpreadAcrossN, 2) +
    ' -- N-UNIFORM), driven by the single SUBDOMINANT reciprocal-product term (which decays at the ' +
    'same q ~ 1); the RATE COEFFICIENT C_N = (invariant - 1)/g_min is stable per N but N-dependent ' +
    '(~0.84, 0.68, 2.05 for N=50,100,200).',
  grade:
    'numerical (empirical decay-law probe of the imp-35238 three-factor invariant on REAL ordinates; ' +
    'SHARPENS imp-35238; NOT a certificate)',
  field:
    'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j); adjacent-pair background field ' +
    'B_p = sum_{j != k,k+1} 1/((b - x_j)(a - x_j)), a = x_k < b = x_{k+1}; N in {50, 100, 200}, ' +
    'initial condition = first N real Riemann ordinates gamma_1..gamma_N (Odlyzko), adaptive backward ' +
    'RK4 dt = 0.02 g_min^2, invariant snapshotted at min-gap fractions 0.5 .. 1e-4; decay exponent q ' +
    'from an OLS fit of log|invariant - 1| on log(fraction).',
  question:
    'imp-35238 tabulated beta * g_min * (x_2 - x_0) approaching 1 from ABOVE as the min-gap fraction ' +
    'shrinks but never characterized the DECAY LAW. What is the convergence-rate exponent q in ' +
    '|invariant - 1| ~ fraction^q, is q N-uniform, and which term sets the approach?',
  rateTable: RATE_TABLE, // per-N q_global, q_front, q_sub_front, residue coefficient
  deviationTrajectory: DEVIATION_TRAJECTORY, // N=50 dev + flat residue coefficient across fractions
  convergenceExponent: 1, // q_front -> 1: the approach to 1 is LINEAR in the min-gap fraction
  qFrontBand: [+Math.min(...qFrontValues).toFixed(4), +Math.max(...qFrontValues).toFixed(4)],
  qFrontSpreadAcrossN: round(qFrontSpreadAcrossN, 4), // tiny: q is N-uniform
  maxQFrontDeviationFromOne: round(maxQFrontDevFromOne, 4),
  maxQSubFrontDeviationFromOne: round(maxQSubFrontDevFromOne, 4),
  residueCoefBand: [
    +Math.min(...RATE_TABLE.map((r) => r.residueCoef)).toFixed(4),
    +Math.max(...RATE_TABLE.map((r) => r.residueCoef)).toFixed(4),
  ],
  rateIsLinearEveryN,
  residueCoefIsNDependent,
  residueCoefStableEveryN,
  dominantFractionToOneEveryN,
  finding:
    'ANSWER: the approach is LINEAR (q = 1) and N-UNIFORM in exponent. An OLS fit of ' +
    'log|invariant - 1| on log(min-gap fraction) over the deep front (<= 0.05) gives q_front = ' +
    qFrontValues.map((q) => q.toFixed(3)).join(', ') +
    ' for N=50,100,200 -- all pinned to 1 (max |q - 1| ~ ' +
    round(maxQFrontDevFromOne, 2) +
    ', cross-N spread ~' +
    round(qFrontSpreadAcrossN, 2) +
    '). Equivalently |invariant - 1| ~ C_N * g_min, so the deviation is exactly proportional to the ' +
    'fraction; the residue coefficient C_N = (invariant - 1)/g_min is stable within each N ' +
    '(last-three relative spread < 2e-3) but N-DEPENDENT (~0.84, 0.68, 2.05), tracking the local ' +
    'collapse geometry, not the invariant limit 1 (which IS N-uniform, imp-35238). The approach is ' +
    'set by the single SUBDOMINANT reciprocal-product term (the next-nearest particle at the sup ' +
    'pair): its share of beta decays at the SAME exponent (q_sub_front = ' +
    qSubFrontValues.map((q) => q.toFixed(3)).join(', ') +
    ') while the dominant term carries > 99.9% of beta at the front. This is the imp-35215 ' +
    'single-dominant-term residue made quantitative: leading term = 1, subdominant residue = O(g_min).',
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-diagnostic, NOT a certificate). The imp-35238 real-ordinate three-factor ' +
    'invariant beta * g_min * (x_2 - x_0) closes on 1 LINEARLY in the min-gap fraction: an OLS fit of ' +
    'log|invariant - 1| on log(fraction) over the deep front (<= 0.05) gives q_front = 1 at every N ' +
    '(band [' +
    Math.min(...qFrontValues).toFixed(3) +
    ', ' +
    Math.max(...qFrontValues).toFixed(3) +
    '], cross-N spread ~' +
    round(qFrontSpreadAcrossN, 2) +
    ' -- N-uniform in exponent). Equivalently |invariant - 1| ~ C_N * g_min with a per-N stable but ' +
    'N-DEPENDENT coefficient C_N ~ 0.84, 0.68, 2.05 (N=50,100,200). The approach is driven by the ' +
    'single SUBDOMINANT reciprocal-product term (next-nearest particle at the sup pair), whose beta ' +
    'share decays at the SAME q ~ 1 while the dominant term carries > 99.9% of beta -- the imp-35215 ' +
    'single-dominant-term residue made quantitative (leading = 1, subdominant residue = O(g_min)). ' +
    'This SHARPENS imp-35238 (its approach-from-above is linear, N-uniform in exponent though not in ' +
    'coefficient) but changes nothing about M2: beta itself still diverges ~1/g_min toward the front ' +
    '(the invariant being bounded IS the statement beta ~ 1/g_min), so a finite N-uniform sup over ' +
    's < t_c still requires an a-priori g_min > 0. M2 stays INSEPARABLE from the horizon/front bridge ' +
    'M5. Certifies NO N-uniformity of beta, does NOT discharge M2 or M5, does NOT touch the imp-2563 ' +
    'sandwich (a valid CONDITIONAL bracket). Changes no bound; establishes no operator positivity; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; M2/M5 stay OPEN; no RH verdict, NO QED; no refereed bound is changed' +
    '.',
  citation:
    'imp-35238 (parent: approach-to-1 from above, decay law unmeasured); imp-35281 (extends N=250..400); ' +
    'imp-35282 (span vs RvM mean spacing); imp-35215 (single-dominant-term derivation); imp-35167 ' +
    '(M2/M5 obstructions); imp-2563 (gap ODE du/ds = -8 + 4 B(s) u, assumes beta finite, CONDITIONAL ' +
    'bracket); imp-486 (C_mb GUE-conditional); zeros-to-1e6 (ZEROS_EXTENDED, baked FIRST_200_ZEROS).',
};

export const IMP35301_THREE_FACTOR_INVARIANT_CONVERGENCE_RATE_ASSERTIONS = [
  {
    // The baked ordinates match the zeros-to-1e6 bundle at the known anchors and are strictly increasing.
    id: 'imp35301-ordinates-match-and-ordered',
    description: 'baked first-200 ordinates are strictly increasing and match gamma_1, gamma_25 anchors',
    holds: () => {
      const strictlyUp = FIRST_200_ZEROS.every((v, i) => i === 0 || v > FIRST_200_ZEROS[i - 1]);
      const g1 = Math.abs(FIRST_200_ZEROS[0] - 14.134725142) < 1e-6;
      const g25 = Math.abs(FIRST_200_ZEROS[24] - 88.809111208) < 1e-6;
      return FIRST_200_ZEROS.length === 200 && strictlyUp && g1 && g25;
    },
  },
  {
    // THE HEADLINE: the deep-front decay exponent q_front is 1 (LINEAR approach) at every N.
    id: 'imp35301-q-front-is-one',
    description: 'the deep-front decay exponent q_front = 1 within 0.05 at every N (LINEAR approach to 1)',
    holds: () => RATE_TABLE.every((r) => Math.abs(r.qFront - 1) < 0.05),
  },
  {
    // q is N-UNIFORM: the front exponents span a tiny range across N.
    id: 'imp35301-q-front-n-uniform',
    description: 'the deep-front decay exponent q_front spread across N is tiny (< 0.02): q is N-uniform',
    holds: () => qFrontSpreadAcrossN < 0.02 && rateIsLinearEveryN === true,
  },
  {
    // The subdominant reciprocal-product term decays at the SAME exponent as the deviation.
    id: 'imp35301-subdominant-term-same-exponent',
    description: 'the subdominant-term beta share decays at the same exponent q_sub_front = 1 (within 0.05) at every N',
    holds: () => RATE_TABLE.every((r) => Math.abs(r.qSubFront - 1) < 0.05),
  },
  {
    // The residue coefficient C_N = dev/g_min is STABLE within each N (single-term signature).
    id: 'imp35301-residue-coef-stable-per-n',
    description: 'the residue coefficient (invariant-1)/g_min has last-three relative spread < 5e-3 at every N (single dominant residue)',
    holds: () => residueCoefStableEveryN === true,
  },
  {
    // ...but the coefficient is N-DEPENDENT (contrast: the invariant limit 1 is N-uniform, imp-35238).
    id: 'imp35301-residue-coef-n-dependent',
    description: 'the residue coefficient varies by > 1.5x across N (the RATE prefactor is N-dependent even though the exponent is N-uniform)',
    holds: () => residueCoefIsNDependent === true,
  },
  {
    // The dominant reciprocal-product term carries essentially all of beta at the front.
    id: 'imp35301-dominant-term-carries-beta',
    description: 'one reciprocal-product term carries > 99.9% of beta at fraction 1e-4 for every N (subdominant sets only the residue)',
    holds: () => dominantFractionToOneEveryN === true,
  },
  {
    // Honesty gate: measurement only, no QED, M2/M5 stay OPEN, imp-2563 untouched, no refereed bound is changed.
    id: 'imp35301-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, M2/M5 OPEN, imp-2563 untouched, no refereed bound is changed',
    holds: () =>
      IMP35301_THREE_FACTOR_INVARIANT_CONVERGENCE_RATE.isRigorous === false &&
      /NO QED/.test(IMP35301_THREE_FACTOR_INVARIANT_CONVERGENCE_RATE.verdict) &&
      /M2 stays INSEPARABLE/.test(IMP35301_THREE_FACTOR_INVARIANT_CONVERGENCE_RATE.verdict) &&
      /imp-2563 sandwich/.test(IMP35301_THREE_FACTOR_INVARIANT_CONVERGENCE_RATE.verdict) &&
      /refereed bound is changed/i.test(IMP35301_THREE_FACTOR_INVARIANT_CONVERGENCE_RATE.verdict),
  },
];

for (const a of IMP35301_THREE_FACTOR_INVARIANT_CONVERGENCE_RATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35301-three-factor-invariant-convergence-rate assertion failed: ${a.id}`);
  }
}
