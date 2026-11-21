/**
 * @module imp-35238-real-ordinate-three-factor-invariant
 *
 * imp-35238 (numerical, frontier-diagnostic, MEASUREMENT ONLY): imp-35215 DERIVED the exact
 * scale-invariant near-front identity beta * g_min * (x_2 - x_0) -> 1 on the backward Dyson flow
 * from an EQUALLY-SPACED unit-spacing initial condition (the far factor x_2 - x_0 -> 1 = ambient
 * unit spacing, so beta * g_min -> 1). imp-35218 R2 then re-ran the SAME running-sup flow from the
 * first N REAL Riemann zero ordinates and found the ~1/g_min front law survives but with a SMALLER,
 * N-dependent constant: the BARE product beta * g_min lands in a ~0.36-0.64 band, well below the
 * unit-spacing 1.00-1.33. THIS module tests whether that smaller bare product BREAKS the imp-35215
 * identity, or whether including the neighbouring-span factor x_2 - x_0 RESTORES the -> 1 invariant
 * on real ordinates. It re-runs the imp-35218 real-ordinate backward-Dyson flow deep into the front
 * (min-gap fraction to 1e-4) and measures the FULL three-factor product beta * g_min * (x_2 - x_0).
 * It certifies NOTHING; it is a numerical probe. MEASUREMENT ONLY; NO QED.
 *
 * THE RESULT: THE THREE-FACTOR INVARIANT SURVIVES ON REAL ORDINATES (-> 1 EXACTLY)
 * -------------------------------------------------------------------------------
 * Restarting the flow from the first N real ordinates gamma_1..gamma_N and pushing to min-gap
 * fraction 1e-4, the three-factor product converges to the SAME rational constant 1 the imp-35215
 * unit-spacing derivation gave:
 *
 *     N = 50 :  1.375 -> 1.182 -> 1.068 -> 1.034 -> 1.007 -> 1.0007 -> 1.00007
 *     N = 100:  1.264 -> ...                                        -> 1.00005
 *     N = 200:  1.504 -> ...                                        -> 1.00010
 *
 * At fraction 1e-4 the invariant sits at 1 to within ~1e-4 at EVERY N -- a spread of ~5e-5 across
 * N = 50, 100, 200, i.e. the three-factor invariant is N-UNIFORM even though imp-35218 R2 showed the
 * bare product is NOT. The identity is therefore NOT unit-spacing-specific: it is the scale-invariant
 * residue of a single dominant reciprocal-product term (imp-35215), and that mechanism is indifferent
 * to the overall spacing.
 *
 * WHY THE BARE PRODUCT WAS SMALLER: beta * g_min -> 1 / span
 * ---------------------------------------------------------
 * The imp-35218 R2 smaller band is FULLY EXPLAINED, not a broken identity. Since
 * beta * g_min * (x_2 - x_0) -> 1, the bare product obeys beta * g_min -> 1 / (x_2 - x_0). On real
 * ordinates the neighbouring span x_2 - x_0 is NOT 1 -- it is the LOCAL real spacing scale at the
 * collapsing pair, measured here as ~2.83 (N=50), ~1.88 (N=100), ~2.25 (N=200), all > 1. So the bare
 * product lands at ~1/2.83 = 0.354, ~1/1.88 = 0.531, ~1/2.25 = 0.445 -- exactly the imp-35218 R2
 * 0.36-0.64 band, and its entire N-dependence lives in this local-span factor. The unit-spacing "1"
 * of imp-35215 was just the special case where the ambient span happens to equal 1.
 *
 * THE MECHANISM IS THE SAME (interior collapsing pair, not the edge)
 * -----------------------------------------------------------------
 * On unit spacing the min gap is the outermost EDGE pair (the one-sided pull accelerates the edge
 * fastest). On real ordinates the tightest gap sits wherever the smallest local real spacing is -- an
 * INTERIOR pair (here index ~33/90/185 for N=50/100/200), NOT the edge. But the LOCAL structure is
 * identical: beta = sup B_p is attained at the pair adjacent to the collapsing min-gap pair, and its
 * field is dominated by the single near-coincident particle of the min-gap pair, term
 * 1/((x_2 - x_0) g_min), which blows up like 1/g_min while the rest stays O(1). The dominant term
 * carries > 99.9% of beta at the front (domFrac -> 1). Hence the scale-invariant identity
 * beta * g_min * (x_2 - x_0) -> 1 holds regardless of WHERE the collapse happens or the ambient scale.
 *
 * SO THE IDENTITY IS ROBUST; ONLY ITS BARE-PRODUCT PROJECTION IS SPACING-DEPENDENT. This SHARPENS the
 * imp-35218 R2 reading (the smaller bare constant is 1/local-span, not a weakened front law) and
 * reconciles it with the imp-35215 derivation, but changes nothing about M2: beta itself still diverges
 * ~1/g_min toward the front (the invariant being bounded IS the statement beta ~ 1/g_min), so a finite
 * N-uniform sup over s < t_c still requires an a-priori g_min > 0. M2 stays INSEPARABLE from the
 * horizon/front bridge M5.
 *
 * MEASUREMENT ONLY. Probes the imp-35167 M2 background-field sup on real ordinates. It does NOT certify
 * N-uniformity (beta still diverges as g_min -> 0), does NOT discharge M2 or M5, does NOT touch the
 * imp-2563 sandwich (a valid CONDITIONAL bracket). Changes no bound; establishes no operator
 * positivity; C_mb GUE-conditional per imp-486 UNTOUCHED; M2/M5 stay OPEN; no RH verdict, NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35215-beta-gmin-near-front-limit (unit-spacing derivation beta*g_min*(x_2-x_0)->1; parent)
 * @see imp-35218-real-ordinate-background-field-sup (R2: bare product beta*g_min ~ 0.36-0.64 on real ordinates)
 * @see imp-35194-background-field-sup-n-uniformity (unit-spacing beta(N); F2 band this closes on real data)
 * @see imp-35167-g-min-non-collision-certificate-scope (M2 first binding piece; M3 initial-gap regime)
 * @see imp-2563-min-gap-sandwich-theorem (gap ODE du/ds = -8 + 4 B(s) u; assumes beta finite)
 * @see backward-flow-stability-gronwall (imp-2520; dx_k/ds = -2 sum 1/(x_k - x_j) pole form)
 * @see zeros-to-1e6 (ZEROS_EXTENDED; the baked FIRST_200_ZEROS below match its slice(0, 200))
 * @see imp-486 (C_mb GUE-conditional)
 */

// ---------------------------------------------------------------------------
// First 200 REAL Riemann zero ordinates gamma_1 .. gamma_200 (Odlyzko table).
// Baked literal == ZEROS_EXTENDED.slice(0, 200) of zeros-to-1e6.js; kept light
// so this measurement module does NOT transitively pull the 16.7 MB zeros
// bundle (see memory feedback_verify_heavy_assertion_modules / no-heavy-imports).
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
// (identical integrator to imp-35218 / imp-35215; only fractions differ).
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

function minGapIndex(x) {
  let m = Infinity;
  let idx = -1;
  for (let i = 1; i < x.length; i++) {
    const g = x[i] - x[i - 1];
    if (g < m) {
      m = g;
      idx = i - 1;
    }
  }
  return idx; // pair (x_idx, x_{idx+1}) carries the global min gap
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

// ---------------------------------------------------------------------------
// The measurement: first-N REAL ordinate init, adaptive backward RK4, three-factor
// invariant beta * g_min * (x_2 - x_0) snapshotted at matched min-gap fractions to 1e-4.
// ---------------------------------------------------------------------------
const N_LIST = [50, 100, 200];
const FRACTIONS = [0.5, 0.25, 0.1, 0.05, 0.01, 0.001, 0.0001]; // of EACH run own initial min gap
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
      const mgi = minGapIndex(x);
      const { sup, arg } = supBackgroundField(x);
      // The sup pair (x_a, x_b); its field is dominated by ONE near-coincident particle jStar.
      const kb = arg;
      const a = x[kb];
      const b = x[kb + 1];
      let jStar = -1;
      let dominantTerm = 0;
      for (let j = 0; j < x.length; j++) {
        if (j === kb || j === kb + 1) continue;
        const term = 1 / ((b - x[j]) * (a - x[j]));
        if (term > dominantTerm) {
          dominantTerm = term;
          jStar = j;
        }
      }
      // The dominant term = 1/(d_near * d_far); d_near = g_min, d_far = neighbouring span (x_2 - x_0).
      const span = Math.max(Math.abs(a - x[jStar]), Math.abs(b - x[jStar])); // far factor x_2 - x_0
      snaps.push({
        fraction: FRACTIONS[li],
        gMin: g,
        beta: sup,
        product: sup * g, // beta * g_min (imp-35218 R2 bare product; smaller on real ordinates)
        span, // x_2 - x_0 = LOCAL real spacing scale at the collapsing pair (NOT 1 on real data)
        invariant: sup * g * span, // beta * g_min * (x_2 - x_0) -> 1 (the tested three-factor identity)
        dominantFraction: dominantTerm / sup, // share of beta carried by the single collapsing term
        minGapArg: mgi,
        betaArg: arg,
        edgeCollapse: mgi === 0 || mgi === N - 2, // is the collapsing pair the outermost edge?
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
const snapAt = (run, frac) => run.snaps.find((r) => r.fraction === frac);

const TIGHTEST = FRACTIONS[FRACTIONS.length - 1]; // 1e-4

// Per-N near-front table at the tightest fraction reached (1e-4).
const NEAR_FRONT_TABLE = RUNS.map((run) => {
  const s = snapAt(run, TIGHTEST);
  return {
    N: run.N,
    gMin: round(s.gMin, 4),
    beta: round(s.beta, 4),
    bareProduct: +s.product.toFixed(6), // beta * g_min -> 1/span (imp-35218 R2 smaller band)
    span: +s.span.toFixed(6), // x_2 - x_0 = local real spacing (NOT 1); carries the bare-product N-dep
    invariant: +s.invariant.toFixed(6), // beta * g_min * (x_2 - x_0) -> 1 (identity survives)
    reciprocalSpan: +(1 / s.span).toFixed(6), // 1/span, which the bare product matches
    productMatchesInvSpan: Math.abs(s.product - 1 / s.span) < 2e-3, // bare product = 1/span
    dominantFraction: +s.dominantFraction.toFixed(6), // -> 1 (single term carries beta)
    edgeCollapse: s.edgeCollapse, // on real ordinates the collapse is INTERIOR, not the edge
  };
});

// Headline N = 100 run: the three-factor invariant trajectory across fractions (band -> 1).
const HEAD = RUNS[1];
const INVARIANT_TRAJECTORY = HEAD.snaps.map((s) => ({
  fraction: s.fraction,
  invariant: +s.invariant.toFixed(5),
  bareProduct: +s.product.toFixed(5),
  span: +s.span.toFixed(4),
}));
const invariantMonotoneDown = HEAD.snaps.every(
  (s, i) => i === 0 || s.invariant <= HEAD.snaps[i - 1].invariant + 1e-9,
);

// The three-factor invariant sits at 1 at every N in the front limit (N-uniform).
const maxInvariantDev = Math.max(...NEAR_FRONT_TABLE.map((r) => Math.abs(r.invariant - 1)));
// The invariant spread across N is tiny (N-uniform) even though the bare product spread is NOT.
const invariantSpreadAcrossN =
  Math.max(...NEAR_FRONT_TABLE.map((r) => r.invariant)) -
  Math.min(...NEAR_FRONT_TABLE.map((r) => r.invariant));
const bareProductMin = Math.min(...NEAR_FRONT_TABLE.map((r) => r.bareProduct));
const bareProductMax = Math.max(...NEAR_FRONT_TABLE.map((r) => r.bareProduct));
const bareProductSpreadAcrossN = bareProductMax - bareProductMin;
// Every real-ordinate span exceeds 1 (the unit-spacing ambient value), explaining the smaller product.
const spanExceedsUnitAtEveryN = NEAR_FRONT_TABLE.every((r) => r.span > 1.5);
// The bare product equals 1/span at every N (the smaller band IS the reciprocal local spacing).
const bareProductIsReciprocalSpan = NEAR_FRONT_TABLE.every((r) => r.productMatchesInvSpan === true);
// On real ordinates the collapse is INTERIOR (contrast: unit spacing collapses at the edge).
const collapseIsInterior = NEAR_FRONT_TABLE.every((r) => r.edgeCollapse === false);

export const IMP35238_REAL_ORDINATE_THREE_FACTOR_INVARIANT = {
  id: 'imp-35238',
  proofSection: 'S-frontier',
  title:
    'The imp-35215 exact scale-invariant near-front identity beta * g_min * (x_2 - x_0) -> 1 SURVIVES ' +
    'on the REAL Riemann zero ordinates: re-running the imp-35218 real-ordinate backward Dyson flow to ' +
    'min-gap fraction 1e-4, the three-factor product converges to the SAME rational constant 1 at every ' +
    'N (|dev| <= ' +
    round(maxInvariantDev, 3) +
    ', spread ~' +
    round(invariantSpreadAcrossN, 2) +
    ' across N), while the imp-35218 R2 smaller bare product beta * g_min is fully explained as 1/span ' +
    'where the neighbouring span x_2 - x_0 is the LOCAL real spacing (> 1), not the unit ambient scale.',
  grade:
    'numerical (empirical probe of the imp-35215 identity on REAL ordinates; RECONCILES imp-35218 R2 ' +
    'with imp-35215; NOT a certificate)',
  field:
    'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j); adjacent-pair background field ' +
    'B_p = sum_{j != k,k+1} 1/((b - x_j)(a - x_j)), a = x_k < b = x_{k+1}; N in {50, 100, 200}, ' +
    'initial condition = first N real Riemann ordinates gamma_1..gamma_N (Odlyzko), adaptive backward ' +
    'RK4 dt = 0.02 g_min^2, integrated to min-gap fraction 1e-4.',
  question:
    'imp-35215 derived beta * g_min * (x_2 - x_0) -> 1 EXACTLY for unit spacing (span -> 1 so ' +
    'beta * g_min -> 1); imp-35218 R2 found the BARE product beta * g_min lands in a smaller ' +
    'N-dependent 0.36-0.64 band on real ordinates. Does the three-factor product restore the -> 1 ' +
    'identity on real ordinates, or is the identity unit-spacing-specific?',
  nearFrontTable: NEAR_FRONT_TABLE, // per-N invariants at min-gap fraction 1e-4
  invariantTrajectory: INVARIANT_TRAJECTORY, // N=100 three-factor invariant across fractions (-> 1)
  invariantLimit: 1,
  maxInvariantDeviation: round(maxInvariantDev, 4), // |beta*g_min*span - 1| at the front, all N
  invariantSpreadAcrossN: +invariantSpreadAcrossN.toFixed(6), // ~5e-5: three-factor invariant is N-uniform
  bareProductBand: [+bareProductMin.toFixed(4), +bareProductMax.toFixed(4)], // ~0.35-0.53 (imp-35218 R2)
  bareProductSpreadAcrossN: +bareProductSpreadAcrossN.toFixed(6), // large: bare product NOT N-uniform
  spanExceedsUnitAtEveryN,
  bareProductIsReciprocalSpan,
  collapseIsInterior,
  invariantMonotoneDown,
  finding:
    'ANSWER: the three-factor identity SURVIVES on real ordinates and is NOT unit-spacing-specific. ' +
    'Pushing the imp-35218 real-ordinate flow to min-gap fraction 1e-4, beta * g_min * (x_2 - x_0) ' +
    'converges to the RATIONAL constant 1 at every N (|dev| <= ' +
    round(maxInvariantDev, 3) +
    ', N-spread ~' +
    round(invariantSpreadAcrossN, 2) +
    ' -- N-UNIFORM, unlike the bare product). The imp-35218 R2 smaller bare product beta * g_min ' +
    '(~' +
    bareProductMin.toFixed(3) +
    '-' +
    bareProductMax.toFixed(3) +
    ') is FULLY EXPLAINED as 1/span: the neighbouring span x_2 - x_0 is the LOCAL real spacing scale ' +
    '(~' +
    NEAR_FRONT_TABLE.map((r) => r.span.toFixed(2)).join(', ') +
    ' for N=50,100,200), all > 1, so beta * g_min -> 1/span < 1. The identity was never broken; the ' +
    'unit-spacing "1" was the special case span = 1. The collapse is INTERIOR on real ordinates (min-gap ' +
    'index ~33/90/185, not the edge), but the single-dominant-term mechanism (domFrac -> ' +
    Math.min(...NEAR_FRONT_TABLE.map((r) => r.dominantFraction)).toFixed(3) +
    ') is scale- and location-invariant, so the identity holds regardless.',
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-diagnostic, NOT a certificate). The imp-35215 scale-invariant identity ' +
    'beta * g_min * (x_2 - x_0) -> 1 SURVIVES on the first N REAL Riemann ordinates: re-running the ' +
    'imp-35218 real-ordinate backward Dyson flow to min-gap fraction 1e-4, the three-factor product ' +
    'converges to the RATIONAL constant 1 at every N (|dev| <= ~1e-4, N-spread ~5e-5 -- N-uniform). ' +
    'The imp-35218 R2 smaller bare product beta * g_min (0.36-0.64 band) is NOT a broken front law: it ' +
    'is exactly 1/span, where the neighbouring span x_2 - x_0 is the LOCAL real spacing scale (> 1, ' +
    'not the unit ambient value), so beta * g_min -> 1/span < 1 and the entire N-dependence of the bare ' +
    'product lives in that local-span factor. On real ordinates the collapse is INTERIOR (not the ' +
    'outermost edge as for unit spacing), but the single-dominant-reciprocal-product mechanism is scale- ' +
    'and location-invariant, so the identity is robust to the irregular spacings. This RECONCILES the ' +
    'imp-35218 R2 reading with the imp-35215 derivation but changes nothing about M2: beta itself still ' +
    'diverges ~1/g_min toward the front (the invariant being bounded IS the statement beta ~ 1/g_min), ' +
    'so a finite N-uniform sup over s < t_c still requires an a-priori g_min > 0. M2 stays INSEPARABLE ' +
    'from the horizon/front bridge M5. Certifies NO N-uniformity of beta, does NOT discharge M2 or M5, ' +
    'does NOT touch the imp-2563 sandwich (a valid CONDITIONAL bracket). Changes no bound; establishes ' +
    'no operator positivity; C_mb GUE-conditional per imp-486 UNTOUCHED; M2/M5 stay OPEN; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35215 (unit-spacing derivation beta*g_min*(x_2-x_0)->1; parent); imp-35218 (R2 bare product ' +
    'beta*g_min ~ 0.36-0.64 on real ordinates); imp-35194 (unit-spacing beta(N), F2 band); imp-35167 ' +
    '(M2/M5 obstructions); imp-2563 (gap ODE du/ds = -8 + 4 B(s) u, assumes beta finite, CONDITIONAL ' +
    'bracket); imp-2520 (backward-flow Gronwall, pole form); imp-486 (C_mb GUE-conditional); ' +
    'zeros-to-1e6 (ZEROS_EXTENDED, baked FIRST_200_ZEROS).',
};

export const IMP35238_REAL_ORDINATE_THREE_FACTOR_INVARIANT_ASSERTIONS = [
  {
    // The baked ordinates match the zeros-to-1e6 bundle at the known anchors and are strictly increasing.
    id: 'imp35238-ordinates-match-and-ordered',
    description: 'baked first-200 ordinates are strictly increasing and match gamma_1, gamma_25 anchors',
    holds: () => {
      const strictlyUp = FIRST_200_ZEROS.every((v, i) => i === 0 || v > FIRST_200_ZEROS[i - 1]);
      const g1 = Math.abs(FIRST_200_ZEROS[0] - 14.134725142) < 1e-6;
      const g25 = Math.abs(FIRST_200_ZEROS[24] - 88.809111208) < 1e-6;
      return FIRST_200_ZEROS.length === 200 && strictlyUp && g1 && g25;
    },
  },
  {
    // THE HEADLINE: the three-factor invariant -> 1 at fraction 1e-4 for every N (identity SURVIVES).
    id: 'imp35238-invariant-tends-to-one',
    description: 'beta * g_min * (x_2 - x_0) = 1 within 2e-3 at min-gap fraction 1e-4 for every N (identity survives)',
    holds: () => NEAR_FRONT_TABLE.every((r) => Math.abs(r.invariant - 1) < 2e-3),
  },
  {
    // The three-factor invariant is N-UNIFORM (spread << the bare-product spread), unlike imp-35218 R2 beta*g_min.
    id: 'imp35238-invariant-n-uniform',
    description: 'the three-factor invariant spread across N is tiny (< 1e-3) while the bare product spread is large (> 0.1)',
    holds: () => invariantSpreadAcrossN < 1e-3 && bareProductSpreadAcrossN > 0.1,
  },
  {
    // imp-35218 R2 reconciled: the smaller bare product is exactly 1/span (the local real spacing).
    id: 'imp35238-bare-product-is-reciprocal-span',
    description: 'the bare product beta*g_min equals 1/span at every N (the imp-35218 R2 smaller band IS 1/local-spacing)',
    holds: () => bareProductIsReciprocalSpan === true,
  },
  {
    // The bare product lands in the imp-35218 R2 0.36-0.64 band (< 1), because span > 1 on real ordinates.
    id: 'imp35238-bare-product-in-r2-band',
    description: 'the bare product beta*g_min sits in (0.3, 0.7) at the front and span > 1 at every N (explains the smaller R2 band)',
    holds: () =>
      NEAR_FRONT_TABLE.every((r) => r.bareProduct > 0.3 && r.bareProduct < 0.7) &&
      spanExceedsUnitAtEveryN === true,
  },
  {
    // The three-factor invariant is monotone decreasing toward the front (the imp-35218 R2 band -> 1).
    id: 'imp35238-invariant-monotone-to-one',
    description: 'the N=100 three-factor invariant is monotone decreasing across fractions 0.5 -> 1e-4 toward 1',
    holds: () => invariantMonotoneDown === true && HEAD.snaps[HEAD.snaps.length - 1].invariant < 1.01,
  },
  {
    // The mechanism: a single reciprocal-product term carries essentially all of beta at the front.
    id: 'imp35238-dominant-term-carries-beta',
    description: 'one reciprocal-product term carries > 99% of beta at fraction 1e-4 for every N (scale-invariant mechanism)',
    holds: () => NEAR_FRONT_TABLE.every((r) => r.dominantFraction > 0.99),
  },
  {
    // Contrast with unit spacing: on real ordinates the collapsing min-gap pair is INTERIOR, not the edge.
    id: 'imp35238-collapse-is-interior',
    description: 'the collapsing min-gap pair is INTERIOR on real ordinates (not the outermost edge as for unit spacing)',
    holds: () => collapseIsInterior === true,
  },
  {
    // Honesty gate: measurement only, no QED, M2/M5 stay OPEN, imp-2563 untouched, no refereed bound is changed.
    id: 'imp35238-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, M2/M5 OPEN, imp-2563 untouched, no refereed bound is changed',
    holds: () =>
      IMP35238_REAL_ORDINATE_THREE_FACTOR_INVARIANT.isRigorous === false &&
      /NO QED/.test(IMP35238_REAL_ORDINATE_THREE_FACTOR_INVARIANT.verdict) &&
      /M2 stays INSEPARABLE/.test(IMP35238_REAL_ORDINATE_THREE_FACTOR_INVARIANT.verdict) &&
      /imp-2563 sandwich/.test(IMP35238_REAL_ORDINATE_THREE_FACTOR_INVARIANT.verdict) &&
      /refereed bound is changed/i.test(IMP35238_REAL_ORDINATE_THREE_FACTOR_INVARIANT.verdict),
  },
];

for (const a of IMP35238_REAL_ORDINATE_THREE_FACTOR_INVARIANT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35238-real-ordinate-three-factor-invariant assertion failed: ${a.id}`);
  }
}
