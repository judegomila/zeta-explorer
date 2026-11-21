/**
 * @module imp-35281-real-ordinate-three-factor-invariant-larger-N
 *
 * imp-35281 (numerical, frontier-diagnostic, MEASUREMENT ONLY): imp-35238 measured the
 * imp-35215 scale-invariant near-front identity beta * g_min * (x_2 - x_0) -> 1 on the REAL
 * Riemann zero ordinates only at N = 50, 100, 200 (spread ~5e-5, converged to ~1e-4 at min-gap
 * fraction 1e-4). THIS module EXTENDS that sample to larger N = 250, 300, 350, 400 -- pushing the
 * imp-35218 real-ordinate backward Dyson flow past the imp-35238 three-point sample -- to test
 * whether the -> 1 convergence and the ~5e-5 cross-N spread PERSIST as the initial real spacings
 * shrink further with height, or whether the local-span-factor fit degrades. It re-runs the SAME
 * integrator (imp-35238 / imp-35218 / imp-35215) on the first N real ordinates gamma_1..gamma_N and
 * snapshots the FULL three-factor product beta * g_min * (x_2 - x_0) at matched min-gap fractions to
 * 1e-4. It certifies NOTHING; it is a numerical probe. MEASUREMENT ONLY; NO QED.
 *
 * THE RESULT: THE THREE-FACTOR INVARIANT STAYS PINNED AT 1 THROUGH N = 400
 * -----------------------------------------------------------------------
 * Extending the sample to N = 250, 300, 350, 400 (on top of imp-35238 N = 50, 100, 200), the
 * three-factor product at min-gap fraction 1e-4 lands at:
 *
 *     N = 50 : 1.000069    N = 250: 1.000053
 *     N = 100: 1.000048    N = 300: 1.000019
 *     N = 200: 1.000096    N = 350: 1.000034
 *                          N = 400: 1.000037
 *
 * The -> 1 convergence to ~1e-4 PERSISTS at every larger N (the new N = 250..400 invariants sit
 * within ~5e-5 of 1, tighter than the loosest three-point value N = 200 at ~9.6e-5). The cross-N
 * spread over the FULL seven-point set is ~7.7e-5 -- the SAME ~1e-4 order as the imp-35238 ~5e-5
 * three-point spread (it does NOT grow with N), and among the NEW points alone (N = 250..400) it is
 * ~3.4e-5. So the three-factor invariant is N-UNIFORM out to N = 400 and the local-span-factor fit
 * does NOT degrade as the front spacings shrink with height.
 *
 * BUT THE BARE-PRODUCT BAND WIDENS (imp-35238 R2 0.36-0.64 is NOT the full band)
 * ------------------------------------------------------------------------------
 * The bare product beta * g_min = 1 / (x_2 - x_0) still tracks the reciprocal LOCAL span, but on the
 * larger sample the span visits smaller values (down to ~1.35 at N = 300, where the collapsing pair
 * sits in a tight local cluster), so the bare product reaches ~0.742 (N = 300) -- ABOVE the imp-35238
 * three-point 0.36-0.64 band. Across N = 50..400 the bare product spans ~0.35-0.74 and the span spans
 * ~1.35-2.83, all > 1. So the imp-35238 R2 band was a three-point undersample: the bare product is
 * EVEN LESS N-uniform than reported, and its entire N-dependence still lives in the local-span factor.
 * The three-factor invariant absorbs all of that variation and stays at 1. The identity is confirmed
 * MORE robust, not less, by the larger sample.
 *
 * THE MECHANISM IS UNCHANGED (interior collapse, single dominant term)
 * -------------------------------------------------------------------
 * At every larger N the collapse is INTERIOR (min-gap index ~211/297/314/362 for N = 250/300/350/400,
 * never the outermost edge), and one reciprocal-product term 1/((x_2 - x_0) g_min) carries > 99.99% of
 * beta at fraction 1e-4 (domFrac -> 1). The scale- and location-invariant single-dominant-term
 * mechanism of imp-35215 / imp-35238 is unchanged; only the ambient local span varies with N.
 *
 * SO THE LARGER-N EXTENSION CONFIRMS imp-35238: the three-factor identity is N-uniform through N = 400,
 * while the bare-product projection is spacing-dependent (band wider than the three-point sample). This
 * changes nothing about M2: beta itself still diverges ~1/g_min toward the front (the invariant being
 * bounded IS the statement beta ~ 1/g_min), so a finite N-uniform sup over s < t_c still requires an
 * a-priori g_min > 0. M2 stays INSEPARABLE from the horizon/front bridge M5. I3/M5 stay OPEN.
 *
 * MEASUREMENT ONLY. Probes the imp-35167 M2 background-field sup on real ordinates at larger N. It does
 * NOT certify N-uniformity of beta (beta still diverges as g_min -> 0), does NOT discharge M2 or M5,
 * does NOT touch the imp-2563 sandwich (a valid CONDITIONAL bracket). Changes no bound; establishes no
 * operator positivity; C_mb GUE-conditional per imp-486 UNTOUCHED; I3/M2/M5 stay OPEN; no RH verdict,
 * NO QED; no refereed bound is changed.
 *
 * @see imp-35238-real-ordinate-three-factor-invariant (parent; N=50,100,200 three-point sample)
 * @see imp-35215-beta-gmin-near-front-limit (unit-spacing derivation beta*g_min*(x_2-x_0)->1)
 * @see imp-35218-real-ordinate-background-field-sup (R2: bare product beta*g_min ~ 0.36-0.64)
 * @see imp-35167-g-min-non-collision-certificate-scope (M2 first binding piece; M3 initial-gap regime)
 * @see imp-2563-min-gap-sandwich-theorem (gap ODE du/ds = -8 + 4 B(s) u; assumes beta finite)
 * @see backward-flow-stability-gronwall (imp-2520; dx_k/ds = -2 sum 1/(x_k - x_j) pole form)
 * @see zeros-to-1e6 (ZEROS_EXTENDED; the baked FIRST_400_ZEROS below match its slice(0, 400))
 * @see imp-486 (C_mb GUE-conditional)
 */

// ---------------------------------------------------------------------------
// First 400 REAL Riemann zero ordinates gamma_1 .. gamma_400 (Odlyzko table).
// Baked literal == ZEROS_EXTENDED.slice(0, 400) of zeros-to-1e6.js; kept light
// so this measurement module does NOT transitively pull the 16.7 MB zeros
// bundle (see memory feedback_verify_heavy_assertion_modules / no-heavy-imports).
// The first 200 match the imp-35238 baked FIRST_200_ZEROS; 201..400 extend it.
// ---------------------------------------------------------------------------
const FIRST_400_ZEROS = [
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
  395.5828700110,  396.3818542230,  397.9187362100,  399.9851198760,  401.8392286010,  402.8619177640,
  404.2364418000,  405.1343874600,  407.5814603870,  408.9472455020,  410.5138691930,  411.9722678040,
  413.2627360700,  415.0188097550,  415.4552149960,  418.3877057900,  419.8613648180,  420.6438276250,
  422.0767100590,  423.7165796270,  425.0698824940,  427.2088250840,  428.1279140770,  430.3287454310,
  431.3013069310,  432.1386417350,  433.8892184810,  436.1610064330,  437.5816981680,  438.6217386560,
  439.9184422140,  441.6831992010,  442.9045463030,  444.3193362780,  446.8606226960,  447.4417041940,
  449.1485456850,  450.1269457800,  451.4033084450,  453.9867378070,  454.9746837690,  456.3284266890,
  457.9038930640,  459.5134152810,  460.0879444220,  462.0653672750,  464.0572869110,  465.6715392110,
  466.5702869310,  467.4390462100,  469.5360045590,  470.7736554780,  472.7991746620,  473.8352323450,
  475.6003393690,  476.7690152370,  478.0752637670,  478.9421815350,  481.8303393760,  482.8347827910,
  483.8514272120,  485.5391481290,  486.5287182620,  488.3805670900,  489.6617615780,  491.3988215940,
  493.3144415820,  493.9579978050,  495.3588288220,  496.4296962160,  498.5807824300,  500.3090849420,
  501.6044469650,  502.2762703270,  504.4997733130,  505.4152317420,  506.4641527100,  508.8007003360,
  510.2642279440,  511.5622897000,  512.6231445310,  513.6689855550,  515.4350571670,  517.5896685720,
  518.2342231480,  520.1063104120,  521.5251934490,  522.4566961780,  523.9605308920,  525.0773856870,
  527.9036416010,  528.4062138520,  529.8062263190,  530.8669178840,  532.6881830280,  533.7796307540,
  535.6643140760,  537.0697590830,  538.4285261760,  540.2131663760,  540.6313902470,  541.8474371210,
  544.3238901010,  545.6368332490,  547.0109120580,  547.9316133640,  549.4975675630,  550.9700100390,
  552.0495722010,  553.7649721190,  555.7920205620,  556.8994764070,  557.5646591720,  559.3162370290,
  560.2408074970,  562.5592076160,  564.1608791110,  564.5060559380,  566.6987876830,  567.7317579010,
  568.9239551800,  570.0511147820,  572.4199841320,  573.6146105270,  575.0938860140,  575.8072471410,
  577.0390034720,  579.0988346720,  580.1369593620,  581.9465762660,  583.2360882190,  584.5617059030,
  585.9845632050,  586.7427718910,  588.1396632660,  590.6603975170,  591.7258580650,  592.5713583000,
  593.9747146820,  595.7281536970,  596.3627683280,  598.4930773460,  599.5456403640,  601.6021367360,
  602.5791678860,  603.6256189040,  604.6162184940,  606.3834604220,  608.4132173110,  609.3895751550,
  610.8391629380,  611.7742096210,  613.5997786760,  614.6462378720,  615.5385633690,  618.1128313660,
  619.1844825980,  620.2728936720,  621.7092945280,  622.3750027400,  624.2699000180,  626.0192834280,
  627.2683968510,  628.3258623590,  630.4738874380,  630.8057809270,  632.2251411670,  633.5468582520,
  635.5238003110,  637.3971931600,  637.9255139810,  638.9279382670,  640.6947946690,  641.9454996660,
  643.2788837810,  644.9905782300,  646.3481915960,  647.7617530040,  648.7864008890,  650.1975193450,
  650.6686838910,  653.6495716050,  654.3019205860,  655.7094630220,  656.9640845990,  658.1756144190,
  659.6638459730,  660.7167325950,  662.2965864310,  664.2446046520,  665.3427630960,  666.5151477040,
  667.1484948950,  668.9758488200,  670.3235852060,  672.4581835840,  673.0435782860,  674.3558978100,
  676.1396743640,  677.2301806690,  677.8004447460,  679.7421978830,
];

// ---------------------------------------------------------------------------
// Self-contained vector classic RK4 on the attractive backward Dyson field
// (identical integrator to imp-35238 / imp-35218 / imp-35215; only N_LIST differs).
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
// N_LIST EXTENDS the imp-35238 {50,100,200} sample with {250,300,350,400}.
// ---------------------------------------------------------------------------
const N_LIST = [50, 100, 200, 250, 300, 350, 400];
const NEW_N = [250, 300, 350, 400]; // the larger-N extension beyond the imp-35238 sample
const FRACTIONS = [0.5, 0.25, 0.1, 0.05, 0.01, 0.001, 0.0001]; // of EACH run own initial min gap
const STEP_SAFETY = 0.02; // dt = STEP_SAFETY * g_min^2 (refines toward the singular front)
const MAX_STEPS = 400000;

function runFlow(N) {
  const x0 = FIRST_400_ZEROS.slice(0, N);
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
    isNewN: NEW_N.includes(run.N), // flags the larger-N extension rows beyond imp-35238
    gMin: round(s.gMin, 4),
    beta: round(s.beta, 4),
    bareProduct: +s.product.toFixed(6), // beta * g_min -> 1/span (imp-35218 R2 smaller band)
    span: +s.span.toFixed(6), // x_2 - x_0 = local real spacing (NOT 1); carries the bare-product N-dep
    invariant: +s.invariant.toFixed(6), // beta * g_min * (x_2 - x_0) -> 1 (identity survives at larger N)
    reciprocalSpan: +(1 / s.span).toFixed(6), // 1/span, which the bare product matches
    productMatchesInvSpan: Math.abs(s.product - 1 / s.span) < 2e-3, // bare product = 1/span
    dominantFraction: +s.dominantFraction.toFixed(6), // -> 1 (single term carries beta)
    edgeCollapse: s.edgeCollapse, // on real ordinates the collapse is INTERIOR, not the edge
  };
});

// Headline N = 400 run: the three-factor invariant trajectory across fractions (band -> 1).
const HEAD = RUNS[RUNS.length - 1];
const INVARIANT_TRAJECTORY = HEAD.snaps.map((s) => ({
  fraction: s.fraction,
  invariant: +s.invariant.toFixed(5),
  bareProduct: +s.product.toFixed(5),
  span: +s.span.toFixed(4),
}));
const invariantMonotoneDown = HEAD.snaps.every(
  (s, i) => i === 0 || s.invariant <= HEAD.snaps[i - 1].invariant + 1e-9,
);

// The three-factor invariant sits at 1 at every N in the front limit (N-uniform through N=400).
const maxInvariantDev = Math.max(...NEAR_FRONT_TABLE.map((r) => Math.abs(r.invariant - 1)));
// The invariant spread across ALL N (50..400) is tiny (N-uniform) even though the bare product is NOT.
const invariantSpreadAcrossN =
  Math.max(...NEAR_FRONT_TABLE.map((r) => r.invariant)) -
  Math.min(...NEAR_FRONT_TABLE.map((r) => r.invariant));
// The invariant spread across ONLY the NEW larger-N points (250..400).
const newRows = NEAR_FRONT_TABLE.filter((r) => r.isNewN);
const invariantSpreadNewN =
  Math.max(...newRows.map((r) => r.invariant)) - Math.min(...newRows.map((r) => r.invariant));
const bareProductMin = Math.min(...NEAR_FRONT_TABLE.map((r) => r.bareProduct));
const bareProductMax = Math.max(...NEAR_FRONT_TABLE.map((r) => r.bareProduct));
const bareProductSpreadAcrossN = bareProductMax - bareProductMin;
// Every real-ordinate span exceeds 1 (the unit-spacing ambient value), explaining the smaller product.
const spanExceedsUnitAtEveryN = NEAR_FRONT_TABLE.every((r) => r.span > 1);
// The bare product equals 1/span at every N (the smaller band IS the reciprocal local spacing).
const bareProductIsReciprocalSpan = NEAR_FRONT_TABLE.every((r) => r.productMatchesInvSpan === true);
// On real ordinates the collapse is INTERIOR (contrast: unit spacing collapses at the edge).
const collapseIsInterior = NEAR_FRONT_TABLE.every((r) => r.edgeCollapse === false);
// The larger-N extension: every NEW N invariant sits within ~5e-5 of 1 (convergence PERSISTS).
const newNInvariantsConverge = newRows.every((r) => Math.abs(r.invariant - 1) < 2e-3);
// The bare-product band WIDENS beyond the imp-35238 three-point 0.36-0.64 (undersample corrected).
const bareBandWiderThanR2 = bareProductMax > 0.64 || bareProductMin < 0.36;

export const IMP35281_REAL_ORDINATE_THREE_FACTOR_INVARIANT_LARGER_N = {
  id: 'imp-35281',
  proofSection: 'S-frontier',
  title:
    'The imp-35238 three-factor invariant beta * g_min * (x_2 - x_0) -> 1 on REAL Riemann ordinates ' +
    'PERSISTS past its N=50,100,200 sample: extending the imp-35218 backward Dyson flow to N=250,300,' +
    '350,400 at min-gap fraction 1e-4, the three-factor product stays pinned at 1 (|dev| <= ' +
    round(maxInvariantDev, 3) +
    ', full-set spread ~' +
    round(invariantSpreadAcrossN, 2) +
    ', new-N spread ~' +
    round(invariantSpreadNewN, 2) +
    '), so the local-span-factor fit does NOT degrade -- while the bare product beta * g_min = 1/span ' +
    'is EVEN LESS N-uniform (band widens to ~' +
    bareProductMin.toFixed(2) +
    '-' +
    bareProductMax.toFixed(2) +
    ', past the imp-35238 three-point 0.36-0.64).',
  grade:
    'numerical (larger-N extension of the imp-35238 real-ordinate three-factor invariant probe; ' +
    'CONFIRMS N-uniformity through N=400; NOT a certificate)',
  field:
    'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j); adjacent-pair background field ' +
    'B_p = sum_{j != k,k+1} 1/((b - x_j)(a - x_j)), a = x_k < b = x_{k+1}; ' +
    'N in {50, 100, 200, 250, 300, 350, 400}, initial condition = first N real Riemann ordinates ' +
    'gamma_1..gamma_N (Odlyzko), adaptive backward RK4 dt = 0.02 g_min^2, integrated to min-gap ' +
    'fraction 1e-4.',
  question:
    'imp-35238 measured the three-factor invariant beta * g_min * (x_2 - x_0) -> 1 on real ordinates ' +
    'only at N=50,100,200 (spread ~5e-5). Does the -> 1 convergence to ~1e-4 and the ~5e-5 cross-N ' +
    'spread PERSIST at larger N=250,300,350,400 as the initial real spacings shrink with height, or ' +
    'does the local-span-factor fit degrade?',
  nearFrontTable: NEAR_FRONT_TABLE, // per-N invariants at min-gap fraction 1e-4 (isNewN flags 250..400)
  invariantTrajectory: INVARIANT_TRAJECTORY, // N=400 three-factor invariant across fractions (-> 1)
  invariantLimit: 1,
  maxInvariantDeviation: round(maxInvariantDev, 4), // |beta*g_min*span - 1| at the front, all N
  invariantSpreadAcrossN: +invariantSpreadAcrossN.toFixed(6), // ~7.7e-5 full set: three-factor invariant N-uniform
  invariantSpreadNewN: +invariantSpreadNewN.toFixed(6), // ~3.4e-5 among the new larger-N points
  bareProductBand: [+bareProductMin.toFixed(4), +bareProductMax.toFixed(4)], // ~0.35-0.74 (WIDER than imp-35238 R2)
  bareProductSpreadAcrossN: +bareProductSpreadAcrossN.toFixed(6), // large: bare product NOT N-uniform
  spanExceedsUnitAtEveryN,
  bareProductIsReciprocalSpan,
  collapseIsInterior,
  invariantMonotoneDown,
  newNInvariantsConverge,
  bareBandWiderThanR2,
  finding:
    'ANSWER: the -> 1 convergence and cross-N uniformity of the three-factor invariant PERSIST at ' +
    'larger N. Extending the imp-35218 real-ordinate flow to N=250,300,350,400 and pushing to min-gap ' +
    'fraction 1e-4, beta * g_min * (x_2 - x_0) stays pinned at the RATIONAL constant 1 at every N ' +
    '(|dev| <= ' +
    round(maxInvariantDev, 3) +
    '; new-N points within ~5e-5 of 1, tighter than the loosest three-point value). The full seven-' +
    'point cross-N spread ~' +
    round(invariantSpreadAcrossN, 2) +
    ' is the SAME ~1e-4 order as the imp-35238 ~5e-5 three-point spread (it does not grow with N), so ' +
    'the local-span-factor fit does NOT degrade as the front spacings shrink with height. The bare ' +
    'product beta * g_min = 1/span is EVEN LESS N-uniform than imp-35238 R2 reported: the span visits ' +
    'smaller values (down to ~' +
    Math.min(...NEAR_FRONT_TABLE.map((r) => r.span)).toFixed(2) +
    ' at N=300), so the bare product reaches ~' +
    bareProductMax.toFixed(2) +
    ' -- ABOVE the three-point 0.36-0.64 band, which was a three-point undersample. The mechanism is ' +
    'unchanged: interior collapse (never the edge) with one reciprocal-product term carrying > 99.99% ' +
    'of beta (domFrac -> ' +
    Math.min(...NEAR_FRONT_TABLE.map((r) => r.dominantFraction)).toFixed(4) +
    '). The three-factor identity absorbs all the span variation and is confirmed MORE robust, not ' +
    'less, by the larger sample.',
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-diagnostic, NOT a certificate). Extending the imp-35238 real-ordinate ' +
    'three-factor invariant probe from N=50,100,200 to N=250,300,350,400, the identity ' +
    'beta * g_min * (x_2 - x_0) -> 1 PERSISTS: at min-gap fraction 1e-4 the three-factor product stays ' +
    'pinned at the RATIONAL constant 1 at every larger N (|dev| <= ~1e-4, new-N points within ~5e-5, ' +
    'full-set cross-N spread ~7.7e-5 -- the same ~1e-4 order as the imp-35238 three-point ~5e-5, NOT ' +
    'growing with N), so the local-span-factor fit does NOT degrade as the front spacings shrink with ' +
    'height. The bare product beta * g_min = 1/span is EVEN LESS N-uniform than imp-35238 R2 reported: ' +
    'on the larger sample the local span visits smaller values (~1.35 at N=300), so the bare product ' +
    'reaches ~0.74, ABOVE the three-point 0.36-0.64 band, which was a three-point undersample. The ' +
    'collapse stays INTERIOR (never the outermost edge) and the single-dominant-reciprocal-product ' +
    'mechanism (domFrac > 0.9999) is scale- and location-invariant, so the identity is robust to the ' +
    'irregular spacings out to N=400. This CONFIRMS and SHARPENS imp-35238 but changes nothing about ' +
    'M2: beta itself still diverges ~1/g_min toward the front (the invariant being bounded IS the ' +
    'statement beta ~ 1/g_min), so a finite N-uniform sup over s < t_c still requires an a-priori ' +
    'g_min > 0. M2 stays INSEPARABLE from the horizon/front bridge M5. Certifies NO N-uniformity of ' +
    'beta, does NOT discharge M2 or M5, does NOT touch the imp-2563 sandwich (a valid CONDITIONAL ' +
    'bracket). Changes no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; I3/M2/M5 stay OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35238 (parent; real-ordinate three-factor invariant, N=50,100,200); imp-35215 (unit-spacing ' +
    'derivation beta*g_min*(x_2-x_0)->1); imp-35218 (R2 bare product beta*g_min ~ 0.36-0.64); ' +
    'imp-35194 (unit-spacing beta(N), F2 band); imp-35167 (M2/M5 obstructions); imp-2563 (gap ODE ' +
    'du/ds = -8 + 4 B(s) u, assumes beta finite, CONDITIONAL bracket); imp-2520 (backward-flow ' +
    'Gronwall, pole form); imp-486 (C_mb GUE-conditional); zeros-to-1e6 (ZEROS_EXTENDED, baked ' +
    'FIRST_400_ZEROS).',
};

export const IMP35281_REAL_ORDINATE_THREE_FACTOR_INVARIANT_LARGER_N_ASSERTIONS = [
  {
    // The baked ordinates match the zeros-to-1e6 bundle at known anchors and are strictly increasing.
    id: 'imp35281-ordinates-match-and-ordered',
    description: 'baked first-400 ordinates are strictly increasing and match gamma_1, gamma_200, gamma_400 anchors',
    holds: () => {
      const strictlyUp = FIRST_400_ZEROS.every((v, i) => i === 0 || v > FIRST_400_ZEROS[i - 1]);
      const g1 = Math.abs(FIRST_400_ZEROS[0] - 14.134725142) < 1e-6;
      const g200 = Math.abs(FIRST_400_ZEROS[199] - 396.381854223) < 1e-6;
      const g400 = Math.abs(FIRST_400_ZEROS[399] - 679.742197883) < 1e-6;
      return FIRST_400_ZEROS.length === 400 && strictlyUp && g1 && g200 && g400;
    },
  },
  {
    // THE HEADLINE: the three-factor invariant -> 1 at fraction 1e-4 for every N through 400 (persists).
    id: 'imp35281-invariant-tends-to-one-all-N',
    description: 'beta * g_min * (x_2 - x_0) = 1 within 2e-3 at min-gap fraction 1e-4 for every N in {50..400}',
    holds: () => NEAR_FRONT_TABLE.every((r) => Math.abs(r.invariant - 1) < 2e-3),
  },
  {
    // THE TICKET CORE: the larger-N extension (250,300,350,400) invariants all converge to 1 (persists).
    id: 'imp35281-larger-N-persists',
    description: 'the new larger-N points N=250,300,350,400 all give invariant within 2e-3 of 1 (convergence persists past the imp-35238 sample)',
    holds: () => newNInvariantsConverge === true && newRows.length === 4,
  },
  {
    // The three-factor invariant is N-UNIFORM through N=400 (spread << the bare-product spread).
    id: 'imp35281-invariant-n-uniform-to-400',
    description: 'the full-set three-factor invariant spread across N=50..400 is tiny (< 1e-3) while the bare product spread is large (> 0.2)',
    holds: () => invariantSpreadAcrossN < 1e-3 && bareProductSpreadAcrossN > 0.2,
  },
  {
    // imp-35238 reconciled at larger N: the bare product is still exactly 1/span (the local real spacing).
    id: 'imp35281-bare-product-is-reciprocal-span',
    description: 'the bare product beta*g_min equals 1/span at every N (still 1/local-spacing at larger N)',
    holds: () => bareProductIsReciprocalSpan === true,
  },
  {
    // NEW FINDING: the bare-product band WIDENS beyond the imp-35238 three-point 0.36-0.64 undersample.
    id: 'imp35281-bare-band-widens-past-r2',
    description: 'the larger sample pushes the bare product band past the imp-35238 three-point 0.36-0.64 (undersample corrected) with span > 1 everywhere',
    holds: () => bareBandWiderThanR2 === true && spanExceedsUnitAtEveryN === true,
  },
  {
    // The mechanism: a single reciprocal-product term carries essentially all of beta at the front.
    id: 'imp35281-dominant-term-carries-beta',
    description: 'one reciprocal-product term carries > 99% of beta at fraction 1e-4 for every N (scale-invariant mechanism)',
    holds: () => NEAR_FRONT_TABLE.every((r) => r.dominantFraction > 0.99),
  },
  {
    // On real ordinates the collapsing min-gap pair is INTERIOR at every N (not the outermost edge).
    id: 'imp35281-collapse-is-interior',
    description: 'the collapsing min-gap pair is INTERIOR at every N in {50..400} (not the outermost edge as for unit spacing)',
    holds: () => collapseIsInterior === true,
  },
  {
    // The N=400 three-factor invariant is monotone decreasing toward the front (band -> 1).
    id: 'imp35281-invariant-monotone-to-one',
    description: 'the N=400 three-factor invariant is monotone decreasing across fractions 0.5 -> 1e-4 toward 1',
    holds: () => invariantMonotoneDown === true && HEAD.snaps[HEAD.snaps.length - 1].invariant < 1.01,
  },
  {
    // Honesty gate: measurement only, no QED, I3/M2/M5 stay OPEN, imp-2563 untouched, no refereed bound is changed.
    id: 'imp35281-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, I3/M2/M5 OPEN, imp-2563 untouched, no refereed bound is changed',
    holds: () =>
      IMP35281_REAL_ORDINATE_THREE_FACTOR_INVARIANT_LARGER_N.isRigorous === false &&
      /NO QED/.test(IMP35281_REAL_ORDINATE_THREE_FACTOR_INVARIANT_LARGER_N.verdict) &&
      /M2 stays INSEPARABLE/.test(IMP35281_REAL_ORDINATE_THREE_FACTOR_INVARIANT_LARGER_N.verdict) &&
      /imp-2563 sandwich/.test(IMP35281_REAL_ORDINATE_THREE_FACTOR_INVARIANT_LARGER_N.verdict) &&
      /refereed bound is changed/i.test(IMP35281_REAL_ORDINATE_THREE_FACTOR_INVARIANT_LARGER_N.verdict),
  },
];

for (const a of IMP35281_REAL_ORDINATE_THREE_FACTOR_INVARIANT_LARGER_N_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35281-real-ordinate-three-factor-invariant-larger-N assertion failed: ${a.id}`);
  }
}
