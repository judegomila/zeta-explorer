/**
 * @module imp-35282-span-vs-rvm-mean-spacing
 *
 * imp-35282 (numerical, frontier-diagnostic, MEASUREMENT ONLY): imp-35238 explained the
 * imp-35218 R2 smaller bare product beta * g_min (0.36-0.64 band) as 1/span, where the
 * neighbouring span x_2 - x_0 is the LOCAL real spacing scale at the collapsing real-ordinate
 * pair. imp-35238 measured that span as ~2.83 (N=50), ~1.88 (N=100), ~2.25 (N=200) -- a
 * NON-MONOTONE band -- but never tied it to the Riemann-von Mangoldt (RvM) mean spacing
 * 2 pi / log(T / 2 pi) at the collapse height T. THIS module measures the span factor and the
 * local RvM mean spacing at the SAME collapse location across N, and reports their ratio, to
 * test whether the non-monotone band is a MEAN-SPACING effect (span just tracks the smooth
 * RvM density trend) or a COLLAPSE-LOCATION effect (span reflects the local density
 * fluctuation of WHICH gap happens to be tightest). It certifies NOTHING; it is a numerical
 * probe. MEASUREMENT ONLY; NO QED.
 *
 * THE RESULT: THE NON-MONOTONE BAND IS A COLLAPSE-LOCATION EFFECT, NOT A MEAN-SPACING EFFECT
 * -----------------------------------------------------------------------------------------
 * Re-running the imp-35218 real-ordinate backward Dyson flow to min-gap fraction 1e-4 and
 * measuring, at the collapsing sup-field pair, the neighbouring span x_2 - x_0 and the RvM
 * mean spacing 2 pi / log(T / 2 pi) at the collapse height T (midpoint of the near-coincident
 * pair):
 *
 *     N = 50 : T ~ 112.9,  span ~ 2.825,  RvM ~ 2.176,  span/RvM ~ 1.299
 *     N = 100: T ~ 219.9,  span ~ 1.884,  RvM ~ 1.767,  span/RvM ~ 1.066
 *     N = 200: T ~ 374.8,  span ~ 2.246,  RvM ~ 1.537,  span/RvM ~ 1.461
 *
 * The RvM mean spacing is MONOTONE DECREASING in N (2.176 -> 1.767 -> 1.537): as N grows the
 * collapse sits at a larger height T, where the zero density is higher and the mean spacing is
 * smaller. The AMBIENT local real spacing tracks RvM tightly: the mean of the real gaps in a
 * +/-5 window around the collapse index divided by the RvM mean spacing is ~1.07 / 1.02 / 1.02
 * at N = 50 / 100 / 200 (i.e. the local real density IS the RvM density to within ~1-7%).
 *
 * BUT the span/RvM ratio stays NON-MONOTONE (1.299 -> 1.066 -> 1.461, a dip at N=100), exactly
 * mirroring the raw span band (2.83 -> 1.88 -> 2.25). Dividing out the smooth monotone RvM
 * trend does NOT remove the non-monotonicity. So the non-monotone band is NOT explained by the
 * mean spacing (which is monotone); it is a COLLAPSE-LOCATION effect: the span is the distance
 * from the collapsing pair to its single dominant neighbouring particle (imp-35238 jStar), and
 * that distance reflects the LOCAL fluctuation of which specific gap cluster is tightest at
 * each N, a fluctuation of order the RvM scale but NOT slaved to its monotone N-trend.
 *
 * SO: the RvM mean spacing sets the OVERALL MAGNITUDE of the span (span/RvM stays in ~1.07-1.46,
 * order 1), but the N-to-N non-monotonicity of the imp-35238 band lives in the collapse-location
 * fluctuation, not the mean-spacing density. This SHARPENS the imp-35238 reading (the band is a
 * local-fluctuation artifact, not a density trend) but changes nothing: the imp-35238 three-factor
 * invariant beta * g_min * (x_2 - x_0) -> 1 already absorbs the span exactly, and beta itself
 * still diverges ~1/g_min toward the front, so M2 still needs an a-priori g_min > 0 and stays
 * INSEPARABLE from the horizon/front bridge M5.
 *
 * MEASUREMENT ONLY. Probes the imp-35167 M2 background-field sup on real ordinates. It does NOT
 * certify N-uniformity, does NOT discharge M2 or M5, does NOT touch the imp-2563 sandwich (a valid
 * CONDITIONAL bracket). Changes no bound; establishes no operator positivity; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; M2/M5 stay OPEN; no RH verdict, NO QED; no refereed bound is changed.
 *
 * @see imp-35238-real-ordinate-three-factor-invariant (span 2.83/1.88/2.25; bare product = 1/span; parent)
 * @see imp-35218-real-ordinate-background-field-sup (R2: bare product beta*g_min ~ 0.36-0.64 on real ordinates)
 * @see imp-35215-beta-gmin-near-front-limit (unit-spacing derivation beta*g_min*(x_2-x_0)->1)
 * @see imp-35167-g-min-non-collision-certificate-scope (M2 first binding piece; M3 initial-gap regime)
 * @see imp-2563-min-gap-sandwich-theorem (gap ODE du/ds = -8 + 4 B(s) u; assumes beta finite)
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
// (identical integrator to imp-35238 / imp-35218 / imp-35215; only outputs differ).
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
  return idx;
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
// The measurement: first-N REAL ordinate init, adaptive backward RK4 to min-gap
// fraction 1e-4, then read off the collapsing sup pair, its neighbouring span
// x_2 - x_0, the collapse height T, and the RvM mean spacing 2 pi / log(T / 2 pi).
// ---------------------------------------------------------------------------
const N_LIST = [50, 100, 200];
const TIGHT_FRACTION = 0.0001; // of each run own initial min gap
const STEP_SAFETY = 0.02; // dt = STEP_SAFETY * g_min^2 (refines toward the singular front)
const MAX_STEPS = 200000;
const TWO_PI = 2 * Math.PI;
const WINDOW = 5; // +/-WINDOW real gaps around the collapse index for the local ambient spacing

function measureFlow(N) {
  const x0 = FIRST_200_ZEROS.slice(0, N);
  const initGap = minGap(x0);
  let x = x0;
  let steps = 0;
  while (steps < MAX_STEPS) {
    const g = minGap(x);
    if (g <= TIGHT_FRACTION * initGap) break;
    x = rk4Step(x, STEP_SAFETY * g * g);
    steps++;
  }
  const gMin = minGap(x);
  const { sup, arg } = supBackgroundField(x);
  const kb = arg;
  const a = x[kb];
  const b = x[kb + 1];
  // The sup field is dominated by ONE near-coincident particle jStar of the min-gap pair.
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
  // span = x_2 - x_0 = distance from the collapsing pair to its dominant neighbour jStar.
  const span = Math.max(Math.abs(a - x[jStar]), Math.abs(b - x[jStar]));
  const mgi = minGapIndex(x);
  // Collapse height T = ordinate of the near-coincident pair (a ~ b at the front).
  const T = (a + b) / 2;
  // Riemann-von Mangoldt local mean spacing at height T: 2 pi / log(T / 2 pi).
  const rvmMeanSpacing = TWO_PI / Math.log(T / TWO_PI);
  // Ambient LOCAL real spacing: mean of the ORIGINAL real gaps in a +/-WINDOW window
  // around the collapse index (the actual local density, independent of the flow).
  const lo = Math.max(1, mgi - WINDOW);
  const hi = Math.min(N - 1, mgi + WINDOW);
  let gapSum = 0;
  let gapCount = 0;
  for (let i = lo; i <= hi; i++) {
    gapSum += x0[i] - x0[i - 1];
    gapCount++;
  }
  const localMeanSpacing = gapSum / gapCount;
  return {
    N,
    steps,
    gMin,
    beta: sup,
    span,
    T,
    rvmMeanSpacing,
    spanOverRvm: span / rvmMeanSpacing, // span in units of the RvM mean spacing
    localMeanSpacing,
    localOverRvm: localMeanSpacing / rvmMeanSpacing, // does the ambient local density track RvM?
    minGapIndex: mgi,
    jStar,
  };
}

const RUNS = N_LIST.map(measureFlow);

const SPAN_RVM_TABLE = RUNS.map((r) => ({
  N: r.N,
  collapseHeight: +r.T.toFixed(3), // T at the collapse
  span: +r.span.toFixed(4), // x_2 - x_0 (reproduces imp-35238 2.83/1.88/2.25)
  rvmMeanSpacing: +r.rvmMeanSpacing.toFixed(4), // 2 pi / log(T / 2 pi) at the collapse height
  spanOverRvm: +r.spanOverRvm.toFixed(4), // span normalised by the RvM mean spacing
  localMeanSpacing: +r.localMeanSpacing.toFixed(4), // ambient local real spacing at the collapse
  localOverRvm: +r.localOverRvm.toFixed(4), // ~1 => local real density IS the RvM density
  gMin: +r.gMin.toExponential(3),
  beta: +r.beta.toFixed(2),
}));

// The raw span band is NON-monotone (a dip at the middle N): span[1] < span[0] and span[1] < span[2].
const spans = SPAN_RVM_TABLE.map((r) => r.span);
const spanNonMonotone = spans[1] < spans[0] && spans[1] < spans[2];
// The RvM mean spacing is MONOTONE DECREASING in N (larger N => larger collapse height => higher density).
const rvms = SPAN_RVM_TABLE.map((r) => r.rvmMeanSpacing);
const rvmMonotoneDown = rvms[0] > rvms[1] && rvms[1] > rvms[2];
// Dividing out the monotone RvM trend does NOT remove the non-monotonicity: span/RvM still dips.
const spanOverRvms = SPAN_RVM_TABLE.map((r) => r.spanOverRvm);
const ratioStillNonMonotone = spanOverRvms[1] < spanOverRvms[0] && spanOverRvms[1] < spanOverRvms[2];
// The ambient local real spacing tracks RvM tightly at every N (~1-7% => same density scale).
const localTracksRvm = SPAN_RVM_TABLE.every((r) => r.localOverRvm > 0.95 && r.localOverRvm < 1.15);
// The span sits at order the RvM scale (magnitude set by RvM, ~1.07-1.46) at every N.
const spanOrderRvm = SPAN_RVM_TABLE.every((r) => r.spanOverRvm > 1.0 && r.spanOverRvm < 1.6);
const spanOverRvmBand = [Math.min(...spanOverRvms), Math.max(...spanOverRvms)];

export const IMP35282_SPAN_VS_RVM_MEAN_SPACING = {
  id: 'imp-35282',
  proofSection: 'S-frontier',
  title:
    'The imp-35238 non-monotone neighbouring-span band x_2 - x_0 (2.83/1.88/2.25 at N=50/100/200) is a ' +
    'COLLAPSE-LOCATION effect, NOT a mean-spacing effect: the Riemann-von Mangoldt mean spacing ' +
    '2 pi / log(T / 2 pi) at the collapse height T is MONOTONE decreasing in N (2.18 -> 1.77 -> 1.54) and ' +
    'the ambient local real spacing tracks it to ~1-7%, but the span/RvM ratio STAYS non-monotone ' +
    '(1.30 -> 1.07 -> 1.46), so dividing out the smooth density trend does not remove the band.',
  grade:
    'numerical (empirical probe tying the imp-35238 span factor to the RvM mean spacing; SHARPENS ' +
    'imp-35238; NOT a certificate)',
  field:
    'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j); adjacent-pair background field ' +
    'B_p = sum_{j != k,k+1} 1/((b - x_j)(a - x_j)), a = x_k < b = x_{k+1}; N in {50, 100, 200}, ' +
    'initial condition = first N real Riemann ordinates gamma_1..gamma_N (Odlyzko), adaptive backward ' +
    'RK4 dt = 0.02 g_min^2, integrated to min-gap fraction 1e-4; collapse height T = midpoint of the ' +
    'near-coincident sup pair; RvM mean spacing = 2 pi / log(T / 2 pi).',
  question:
    'imp-35238 explained the imp-35218 R2 smaller bare product as 1/span, where the neighbouring span ' +
    'x_2 - x_0 is 2.83/1.88/2.25 (NON-monotone) at N=50/100/200, but never tied it to the RvM mean ' +
    'spacing. Is the non-monotone band a MEAN-SPACING effect (span tracks the smooth RvM density trend) ' +
    'or a COLLAPSE-LOCATION effect (span reflects the local fluctuation of which gap is tightest)?',
  spanRvmTable: SPAN_RVM_TABLE, // per-N span, RvM mean spacing, ratio, local spacing at the collapse
  spanNonMonotone, // imp-35238 span band reproduced: dip at the middle N
  rvmMonotoneDown, // RvM mean spacing decreases monotonically with N (density trend is smooth)
  ratioStillNonMonotone, // span/RvM stays non-monotone => trend not the source of the band
  localTracksRvm, // ambient local real spacing ~ RvM (same density scale) at every N
  spanOrderRvm, // span sits at order the RvM scale (magnitude set by RvM)
  spanOverRvmBand: [+spanOverRvmBand[0].toFixed(4), +spanOverRvmBand[1].toFixed(4)],
  finding:
    'ANSWER: the non-monotone band is a COLLAPSE-LOCATION effect, NOT a mean-spacing effect. The RvM ' +
    'mean spacing 2 pi / log(T / 2 pi) at the collapse height is MONOTONE decreasing in N (' +
    SPAN_RVM_TABLE.map((r) => r.rvmMeanSpacing.toFixed(2)).join(' -> ') +
    '), and the ambient local real spacing tracks it to within ~1-7% (localOverRvm ' +
    SPAN_RVM_TABLE.map((r) => r.localOverRvm.toFixed(2)).join(', ') +
    '), so the RvM density sets the OVERALL span magnitude (span/RvM stays in ' +
    spanOverRvmBand[0].toFixed(2) +
    '-' +
    spanOverRvmBand[1].toFixed(2) +
    ', order 1). BUT the span/RvM ratio STAYS non-monotone (' +
    SPAN_RVM_TABLE.map((r) => r.spanOverRvm.toFixed(2)).join(' -> ') +
    ', a dip at N=100), mirroring the raw span band 2.83/1.88/2.25: dividing out the monotone RvM ' +
    'trend does NOT remove the non-monotonicity. The band therefore comes from the collapse-location ' +
    'fluctuation -- the distance from the collapsing pair to its single dominant neighbour (imp-35238 ' +
    'jStar), reflecting WHICH local gap cluster is tightest at each N -- not the smooth mean-spacing ' +
    'density. This SHARPENS imp-35238 but changes nothing about M2.',
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-diagnostic, NOT a certificate). The imp-35238 non-monotone neighbouring- ' +
    'span band x_2 - x_0 (2.83/1.88/2.25 at N=50/100/200) is a COLLAPSE-LOCATION effect, NOT a ' +
    'mean-spacing effect. The RvM mean spacing 2 pi / log(T / 2 pi) at the collapse height T is MONOTONE ' +
    'decreasing in N (2.18 -> 1.77 -> 1.54: larger N sits at larger T, higher density) and the ambient ' +
    'local real spacing tracks it to ~1-7%, so RvM sets the overall span MAGNITUDE (span/RvM stays order ' +
    '1, ~1.07-1.46). But the span/RvM ratio STAYS non-monotone (1.30 -> 1.07 -> 1.46), so dividing out ' +
    'the smooth monotone density trend does NOT remove the band: it comes from the local density ' +
    'fluctuation of which gap is tightest, not the mean spacing. This SHARPENS the imp-35238 reading ' +
    '(the band is a local-fluctuation artifact of the collapse location, not a density trend) but changes ' +
    'nothing about M2: the imp-35238 three-factor invariant beta * g_min * (x_2 - x_0) -> 1 already ' +
    'absorbs the span exactly, and beta itself still diverges ~1/g_min toward the front, so a finite ' +
    'N-uniform sup over s < t_c still requires an a-priori g_min > 0. M2 stays INSEPARABLE from the ' +
    'horizon/front bridge M5. Certifies NO N-uniformity of beta, does NOT discharge M2 or M5, does NOT ' +
    'touch the imp-2563 sandwich (a valid CONDITIONAL bracket). Changes no bound; establishes no operator ' +
    'positivity; C_mb GUE-conditional per imp-486 UNTOUCHED; M2/M5 stay OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35238 (span 2.83/1.88/2.25, bare product = 1/span; parent); imp-35218 (R2 bare product ' +
    'beta*g_min ~ 0.36-0.64 on real ordinates); imp-35215 (unit-spacing beta*g_min*(x_2-x_0)->1); ' +
    'imp-35167 (M2/M5 obstructions); imp-2563 (gap ODE du/ds = -8 + 4 B(s) u, assumes beta finite, ' +
    'CONDITIONAL bracket); imp-486 (C_mb GUE-conditional); zeros-to-1e6 (ZEROS_EXTENDED, baked ' +
    'FIRST_200_ZEROS).',
};

export const IMP35282_SPAN_VS_RVM_MEAN_SPACING_ASSERTIONS = [
  {
    // The baked ordinates match the zeros-to-1e6 bundle at the known anchors and are strictly increasing.
    id: 'imp35282-ordinates-match-and-ordered',
    description: 'baked first-200 ordinates are strictly increasing and match gamma_1, gamma_25 anchors',
    holds: () => {
      const strictlyUp = FIRST_200_ZEROS.every((v, i) => i === 0 || v > FIRST_200_ZEROS[i - 1]);
      const g1 = Math.abs(FIRST_200_ZEROS[0] - 14.134725142) < 1e-6;
      const g25 = Math.abs(FIRST_200_ZEROS[24] - 88.809111208) < 1e-6;
      return FIRST_200_ZEROS.length === 200 && strictlyUp && g1 && g25;
    },
  },
  {
    // The span band reproduces imp-35238: ~2.83/1.88/2.25 at N=50/100/200 (same measurement, cross-check).
    id: 'imp35282-span-reproduces-imp35238',
    description: 'the neighbouring span x_2 - x_0 reproduces the imp-35238 band 2.83/1.88/2.25 within 0.05',
    holds: () =>
      Math.abs(SPAN_RVM_TABLE[0].span - 2.83) < 0.05 &&
      Math.abs(SPAN_RVM_TABLE[1].span - 1.88) < 0.05 &&
      Math.abs(SPAN_RVM_TABLE[2].span - 2.25) < 0.05,
  },
  {
    // THE HEADLINE (part 1): the RvM mean spacing at the collapse is MONOTONE decreasing in N.
    id: 'imp35282-rvm-monotone-down',
    description: 'the RvM mean spacing 2 pi / log(T / 2 pi) at the collapse height decreases monotonically with N',
    holds: () => rvmMonotoneDown === true,
  },
  {
    // THE HEADLINE (part 2): the span/RvM ratio STAYS non-monotone (a dip at N=100) -- band is NOT the trend.
    id: 'imp35282-ratio-still-non-monotone',
    description: 'span/RvM stays non-monotone (dips at N=100) while the raw span band also dips (collapse-location, not mean-spacing)',
    holds: () => ratioStillNonMonotone === true && spanNonMonotone === true,
  },
  {
    // The ambient LOCAL real spacing tracks the RvM mean spacing tightly (same density scale).
    id: 'imp35282-local-tracks-rvm',
    description: 'the ambient local real spacing at the collapse tracks the RvM mean spacing to within ~1-7% at every N',
    holds: () => localTracksRvm === true,
  },
  {
    // The span sits at ORDER the RvM scale (magnitude set by RvM), so RvM captures the overall size.
    id: 'imp35282-span-order-rvm',
    description: 'the span sits at order the RvM mean spacing (span/RvM in ~1.0-1.6) at every N (magnitude set by RvM)',
    holds: () => spanOrderRvm === true,
  },
  {
    // Honesty gate: measurement only, no QED, M2/M5 stay OPEN, imp-2563 untouched, no refereed bound is changed.
    id: 'imp35282-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, M2/M5 OPEN, imp-2563 untouched, no refereed bound is changed',
    holds: () =>
      IMP35282_SPAN_VS_RVM_MEAN_SPACING.isRigorous === false &&
      /NO QED/.test(IMP35282_SPAN_VS_RVM_MEAN_SPACING.verdict) &&
      /M2 stays INSEPARABLE/.test(IMP35282_SPAN_VS_RVM_MEAN_SPACING.verdict) &&
      /imp-2563 sandwich/.test(IMP35282_SPAN_VS_RVM_MEAN_SPACING.verdict) &&
      /refereed bound is changed/i.test(IMP35282_SPAN_VS_RVM_MEAN_SPACING.verdict),
  },
];

for (const a of IMP35282_SPAN_VS_RVM_MEAN_SPACING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35282-span-vs-rvm-mean-spacing assertion failed: ${a.id}`);
  }
}
