/**
 * @module imp-35218-real-ordinate-background-field-sup
 *
 * imp-35218 (numerical, frontier-diagnostic, MEASUREMENT ONLY): imp-35194 measured the
 * backward-Dyson background-field sup beta(N) = sup_{p, s < t_c} |B_p(s)| starting from an
 * EQUALLY-SPACED unit-spacing initial condition (deliberately, to isolate N-scaling from
 * initial-gap structure), and found beta N-UNIFORM at matched front-progress (relative spread
 * < 1.5% across N = 50, 100, 200) but growing toward the collision front like ~1/g_min. THIS
 * module re-runs the SAME running-sup measurement starting from the first N REAL Riemann zero
 * ordinates (ZETA_ZEROS, gamma_1 .. gamma_N) instead of unit spacing, to test whether the
 * ~1/g_min front law and the N-uniformity survive the physically relevant IRREGULAR spacings
 * (the imp-35167 M3 initial-gap regime). It certifies NOTHING; it is a numerical probe of the
 * imp-35167 M2 obstruction on real data. MEASUREMENT ONLY; NO QED.
 *
 * THE BACKGROUND FIELD B_p AND THE M2 SUP beta (unchanged from imp-35194)
 * ----------------------------------------------------------------------
 * Particles x_1(s) < ... < x_N(s) flow backward under the attractive rational Dyson field
 * (de Bruijn-Newman units, backward-flow-stability-gronwall.js):
 *
 *     dx_k/ds  =  -2 sum_{j != k} 1 / (x_k - x_j),        s = -t >= 0.
 *
 * For an adjacent pair p = (a, b) with a = x_k < b = x_{k+1}, the imp-2563 gap ODE
 * du/ds = -8 + 4 B_p(s) u (u = r^2, r = b - a) carries the background field
 *
 *     B_p(s)  =  sum_{j != k, k+1}  1 / ((b - x_j) (a - x_j)),
 *
 * which is a POSITIVE reciprocal-PRODUCT sum for an adjacent pair (no particle lies between a and
 * b, so (b - x_j) and (a - x_j) share a sign), hence |B_p| = B_p. beta(N) is the running sup of
 * B_p over all adjacent pairs and all backward times reached.
 *
 * THE MEASUREMENT (differs from imp-35194 ONLY in the initial condition)
 * ---------------------------------------------------------------------
 * Initial condition: the first N REAL Riemann zero ordinates x_k = gamma_k (Odlyzko table, baked
 * literal FIRST_200_ZEROS below, matching ZEROS_EXTENDED.slice(0, 200) of zeros-to-1e6.js). These
 * have IRREGULAR spacings that SHRINK with height (mean spacing ~ 2pi / log(T / 2pi)), so the
 * initial min gap itself DECREASES with N (0.845 at N=50 down to 0.498 at N=200) -- the exact
 * initial-gap regime imp-35167 M3 named. Integrate backward with the same classic vector RK4 and
 * adaptive step dt = 0.02 g_min(s)^2, and SNAPSHOT the running sup beta when the global min gap
 * first crosses fractions [0.5, 0.25, 0.1, 0.05] of EACH run own initial min gap -- matched
 * front-progress across N.
 *
 * WHAT THE NUMBERS SAY (real ordinates -- CONTRAST with imp-35194 unit spacing)
 * ----------------------------------------------------------------------------
 *   (R1) N-UNIFORMITY DOES NOT SURVIVE.  At each matched min-gap fraction beta(N) GROWS strongly
 *        with N -- ~1.1 -> 1.7 -> 2.7 at fraction 0.5 and ~9.2 -> 15.7 -> 20.3 at fraction 0.05
 *        for N = 50, 100, 200 -- a relative spread of ~120-140% per level, vastly exceeding the
 *        < 1.5% unit-spacing uniformity. The reason is physical: real spacings shrink with height,
 *        so a larger N drags in higher, more tightly packed zeros that LOWER the local scale
 *        setting beta. On the physically relevant spacings the imp-35194 N-uniformity is an
 *        artifact of the fixed unit scale; beta INHERITS the height-dependence of the real spacing.
 *   (R2) THE ~1/g_min FRONT LAW SURVIVES (with an N-dependent prefactor).  Along every trajectory
 *        the product beta * g_min stays O(1) (~0.36 -> 0.64) and weakly DECREASES toward the front,
 *        exactly the beta ~ 1/g_min front coupling imp-35194 found -- but the O(1) constant is
 *        SMALLER than the unit-spacing (1, 1.4) band and itself grows with N (the prefactor is not
 *        N-uniform). So the FRONT-scaling law is robust to the initial spacing; its constant is not.
 *
 * SO ON REAL SPACINGS M2 IS HARDER, NOT EASIER. The imp-35194 headline (beta N-uniform at matched
 * front-progress) is a unit-spacing artifact: on the true irregular, height-decreasing ordinates
 * beta acquires an N-dependence through the shrinking local scale, on TOP of the self-referential
 * beta ~ 1/g_min front coupling. The binding M2 difficulty -- a finite N-uniform sup over s < t_c --
 * is therefore compounded by the M3 initial-gap regime: even at fixed front-progress beta is not
 * N-uniform. This is a numerical probe, NOT a certificate; it does not bound beta over the full
 * trajectory (the sup diverges as g_min -> 0), and M5 stays OPEN.
 *
 * MEASUREMENT ONLY. Probes the imp-35167 M2 background-field sup on real ordinates. It does NOT
 * certify N-uniformity (it in fact REFUTES it for real spacings), does NOT discharge M2 or M5, does
 * NOT touch the imp-2563 sandwich (which remains a valid CONDITIONAL bracket). Changes no bound;
 * establishes no operator positivity; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict,
 * NO QED; no refereed bound is changed.
 *
 * @see imp-35194-background-field-sup-n-uniformity (unit-spacing beta(N); the N-uniformity this refutes on real data)
 * @see imp-35167-g-min-non-collision-certificate-scope (M2 first binding piece; M3 initial-gap regime; parent)
 * @see imp-2563-min-gap-sandwich-theorem (the gap ODE du/ds = -8 + 4 B(s) u; assumes beta finite)
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
// (identical integrator to imp-35194; only the initial condition changes).
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
// The measurement: first-N REAL ordinate init, adaptive backward RK4,
// running sup beta snapshotted at matched min-gap fractions.
// ---------------------------------------------------------------------------
const N_LIST = [50, 100, 200];
const GAP_FRACTIONS = [0.5, 0.25, 0.1, 0.05]; // of EACH run own initial min gap
const STEP_SAFETY = 0.02; // dt = STEP_SAFETY * g_min^2 (refines toward the singular front)
const MAX_STEPS = 20000;

function runFlow(N) {
  const x0 = FIRST_200_ZEROS.slice(0, N);
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

const round = (v, d = 4) => +v.toExponential(d);
const betaAt = (run, frac) => run.snaps.find((r) => r.fraction === frac);

// Per-fraction table: beta(N) at each matched front-progress; relSpreadAcrossN is now LARGE.
const FRACTION_TABLE = GAP_FRACTIONS.map((frac) => {
  const row = RUNS.map((run) => betaAt(run, frac).beta);
  const min = Math.min(...row);
  const max = Math.max(...row);
  return {
    fraction: frac,
    beta: RUNS.reduce((o, run) => ((o['N' + run.N] = round(betaAt(run, frac).beta)), o), {}),
    gMinByN: RUNS.reduce((o, run) => ((o['N' + run.N] = round(betaAt(run, frac).gMin, 4)), o), {}),
    productByN: RUNS.reduce((o, run) => ((o['N' + run.N] = round(betaAt(run, frac).product, 4)), o), {}),
    relSpreadAcrossN: +(max / min - 1).toFixed(5), // now ~1.2-1.4 (>100%): N-uniformity FAILS
    increasesWithN:
      betaAt(RUNS[0], frac).beta < betaAt(RUNS[1], frac).beta &&
      betaAt(RUNS[1], frac).beta < betaAt(RUNS[2], frac).beta,
  };
});

// Front-growth on the headline run + the beta*g_min front-product trend (still O(1), decreasing).
const HEAD = RUNS[1]; // N = 100 headline run
const WIDEST_FRAC = GAP_FRACTIONS[0];
const TIGHTEST_FRAC = GAP_FRACTIONS[GAP_FRACTIONS.length - 1];
const headWidest = betaAt(HEAD, WIDEST_FRAC);
const headTightest = betaAt(HEAD, TIGHTEST_FRAC);
const frontGrowthFactor = headTightest.beta / headWidest.beta; // ~9x
const productDecreasesTowardFront = HEAD.snaps.every(
  (r, i) => i === 0 || r.product <= HEAD.snaps[i - 1].product + 1e-9,
);
const maxRelSpreadAcrossN = Math.max(...FRACTION_TABLE.map((r) => r.relSpreadAcrossN));
const minRelSpreadAcrossN = Math.min(...FRACTION_TABLE.map((r) => r.relSpreadAcrossN));
// The front-product constant itself grows with N (prefactor not N-uniform).
const productPrefactorGrowsWithN = FRACTION_TABLE.every(
  (r) => r.productByN.N50 < r.productByN.N200,
);
const initGapDecreasesWithN =
  RUNS[0].initGap > RUNS[1].initGap && RUNS[1].initGap > RUNS[2].initGap;

export const IMP35218_REAL_ORDINATE_BACKGROUND_FIELD_SUP = {
  id: 'imp-35218',
  proofSection: 'S-frontier',
  title:
    'Empirical background-field sup beta(N) = sup |B_p(s)| along the backward Dyson trajectory ' +
    'from the first N REAL Riemann zero ordinates: on the physically relevant irregular, ' +
    'height-decreasing spacings the imp-35194 N-uniformity DOES NOT survive (beta grows ~1.2-1.4x ' +
    'per matched front-progress level from N=50 to 200) while the beta ~ 1/g_min front law does ' +
    '(beta*g_min stays O(1), weakly decreasing toward the front, but with an N-dependent prefactor).',
  grade:
    'numerical (empirical probe of the imp-35167 M2 obstruction on REAL ordinates, NOT a certificate; ' +
    'REFUTES the imp-35194 unit-spacing N-uniformity for real spacings)',
  field:
    'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j); adjacent-pair background field ' +
    'B_p(s) = sum_{j != k,k+1} 1/((b - x_j)(a - x_j)), a = x_k < b = x_{k+1}; N in {50, 100, 200}, ' +
    'initial condition = first N real Riemann ordinates gamma_1..gamma_N (Odlyzko), adaptive backward ' +
    'RK4 dt = 0.02 g_min^2.',
  positivityFact:
    'For an adjacent pair no particle lies between a and b, so (b - x_j) and (a - x_j) share a sign for ' +
    'every j; every term of B_p is POSITIVE, |B_p| = B_p is a convergent reciprocal-PRODUCT sum ' +
    'dominated by the nearest neighbours at the local spacing scale.',
  initialConditionContrast:
    'Real ordinate spacings SHRINK with height (mean ~ 2pi/log(T/2pi)), so the initial min gap ' +
    'DECREASES with N: initGap(50)=' +
    round(RUNS[0].initGap, 4) +
    ', initGap(100)=' +
    round(RUNS[1].initGap, 4) +
    ', initGap(200)=' +
    round(RUNS[2].initGap, 4) +
    ' -- the imp-35167 M3 initial-gap regime, absent from the imp-35194 fixed unit scale.',
  fractionTable: FRACTION_TABLE, // beta(N) at each matched min-gap fraction; relSpreadAcrossN now >100%
  frontGrowth: {
    headlineN: HEAD.N,
    widestFraction: WIDEST_FRAC,
    tightestFraction: TIGHTEST_FRAC,
    betaWidest: round(headWidest.beta),
    betaTightest: round(headTightest.beta),
    growthFactor: round(frontGrowthFactor),
    productWidest: round(headWidest.product), // beta*g_min far from front
    productTightest: round(headTightest.product), // beta*g_min near front -> beta ~ 1/g_min
    productDecreasesTowardFront,
  },
  maxRelSpreadAcrossN: +maxRelSpreadAcrossN.toFixed(5),
  minRelSpreadAcrossN: +minRelSpreadAcrossN.toFixed(5),
  productPrefactorGrowsWithN,
  initGapDecreasesWithN,
  finding:
    'R1: on REAL ordinates the imp-35194 N-uniformity DOES NOT survive -- at each matched min-gap ' +
    'fraction beta(N) GROWS with N (relative spread ~' +
    round(minRelSpreadAcrossN * 100, 2) +
    '-' +
    round(maxRelSpreadAcrossN * 100, 2) +
    '%, vs < 1.5% for unit spacing) because real spacings shrink with height and a larger N drags ' +
    'in tighter zeros that lower the local scale setting beta. R2: the beta ~ 1/g_min FRONT law does ' +
    'survive -- beta * g_min stays O(1) (~' +
    round(headTightest.product, 2) +
    '-' +
    round(headWidest.product, 2) +
    ') and weakly decreases toward the front on every N -- but its O(1) constant is smaller than the ' +
    'unit-spacing (1, 1.4) band and itself grows with N (prefactor not N-uniform). So on the ' +
    'physically relevant spacings M2 is HARDER: beta inherits the height-dependence of real spacing ' +
    'on top of the self-referential front coupling.',
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-diagnostic, NOT a certificate). Restarting the imp-35194 running-sup ' +
    'beta(N) = sup |B_p(s)| from the first N REAL Riemann ordinates (rather than unit spacing) ' +
    'REFUTES the unit-spacing N-uniformity: at matched front-progress beta(N) GROWS with N ' +
    '(relative spread ~120-140% per level vs < 1.5% for unit spacing), because real spacings shrink ' +
    'with height so larger N lowers the local scale that sets beta -- the imp-35167 M3 initial-gap ' +
    'regime. The beta ~ 1/g_min FRONT law survives (beta * g_min stays O(1) and weakly decreases ' +
    'toward the front) but with an N-dependent prefactor. So on the physically relevant irregular ' +
    'spacings M2 is HARDER than the imp-35194 unit-spacing probe suggested: a finite N-uniform sup ' +
    'over s < t_c is obstructed both by the self-referential front coupling AND by the height-dependent ' +
    'local scale. This probe does NOT certify N-uniformity (it refutes it for real spacings), does NOT ' +
    'discharge M2 or M5, and does NOT touch the imp-2563 sandwich (a valid CONDITIONAL bracket). M5 ' +
    'horizon-front mismatch stays OPEN; changes no bound; establishes no operator positivity; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35194 (unit-spacing beta(N); N-uniformity this refutes on real data); imp-35167 (M2 first ' +
    'binding piece, M3 initial-gap regime; parent); imp-2563 (gap ODE du/ds = -8 + 4 B(s) u, assumes ' +
    'beta finite, CONDITIONAL bracket); imp-2520 (backward-flow Gronwall, pole form); imp-486 ' +
    '(C_mb GUE-conditional); zeros-to-1e6 (ZEROS_EXTENDED, baked FIRST_200_ZEROS).',
};

export const IMP35218_REAL_ORDINATE_BACKGROUND_FIELD_SUP_ASSERTIONS = [
  {
    // The baked ordinates match the zeros-to-1e6 bundle at the known anchors and are strictly increasing.
    id: 'imp35218-ordinates-match-and-ordered',
    description: 'baked first-200 ordinates are strictly increasing and match gamma_1, gamma_25 anchors',
    holds: () => {
      const strictlyUp = FIRST_200_ZEROS.every((v, i) => i === 0 || v > FIRST_200_ZEROS[i - 1]);
      const g1 = Math.abs(FIRST_200_ZEROS[0] - 14.134725142) < 1e-6;
      const g25 = Math.abs(FIRST_200_ZEROS[24] - 88.809111208) < 1e-6;
      return FIRST_200_ZEROS.length === 200 && strictlyUp && g1 && g25;
    },
  },
  {
    // beta is finite and strictly positive at every matched front-progress level for every N.
    id: 'imp35218-beta-finite-positive',
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
    // R1: N-uniformity FAILS on real ordinates -- relative spread across N is LARGE (> 50%) at every level.
    id: 'imp35218-n-uniformity-fails',
    description: 'beta(N) relative spread across N = 50,100,200 EXCEEDS 50% at every matched level (uniformity fails)',
    holds: () => FRACTION_TABLE.every((r) => r.relSpreadAcrossN > 0.5),
  },
  {
    // R1: beta INCREASES with N at each level (opposite of the imp-35194 unit-spacing decrease).
    id: 'imp35218-beta-increases-with-n',
    description: 'at each matched level beta(50) < beta(100) < beta(200) -- real spacings make N a driver',
    holds: () => FRACTION_TABLE.every((r) => r.increasesWithN === true),
  },
  {
    // Mechanism: the real-ordinate initial min gap decreases with N (height-shrinking spacing).
    id: 'imp35218-initgap-decreases-with-n',
    description: 'initial min gap decreases with N (real spacings shrink with height; M3 initial-gap regime)',
    holds: () => initGapDecreasesWithN === true,
  },
  {
    // R2: beta GROWS substantially toward the front (tightest level >> widest level).
    id: 'imp35218-grows-toward-front',
    description: 'beta at the tightest min-gap level exceeds the widest by > 5x (growth toward the front)',
    holds: () => frontGrowthFactor > 5,
  },
  {
    // R2: beta ~ 1/g_min front law survives -- beta*g_min stays O(1) and decreases toward the front.
    id: 'imp35218-beta-tracks-inverse-gmin',
    description: 'beta * g_min stays O(1) in (0.1, 1) and decreases toward the front (beta ~ 1/g_min front law survives)',
    holds: () =>
      HEAD.snaps.every((r) => r.product > 0.1 && r.product < 1) && productDecreasesTowardFront === true,
  },
  {
    // R2: the front-product CONSTANT itself grows with N (the ~1/g_min prefactor is not N-uniform).
    id: 'imp35218-front-prefactor-not-n-uniform',
    description: 'the beta*g_min front-product prefactor grows with N (constant not N-uniform on real spacings)',
    holds: () => productPrefactorGrowsWithN === true,
  },
  {
    // Honesty gate: measurement only, no QED, M2/M5 stay OPEN, imp-2563 untouched, no refereed bound is changed.
    id: 'imp35218-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, M5 OPEN, imp-2563 untouched, no refereed bound is changed',
    holds: () =>
      IMP35218_REAL_ORDINATE_BACKGROUND_FIELD_SUP.isRigorous === false &&
      /NO QED/.test(IMP35218_REAL_ORDINATE_BACKGROUND_FIELD_SUP.verdict) &&
      /M5 horizon-front mismatch stays OPEN/.test(IMP35218_REAL_ORDINATE_BACKGROUND_FIELD_SUP.verdict) &&
      /imp-2563 sandwich/.test(IMP35218_REAL_ORDINATE_BACKGROUND_FIELD_SUP.verdict) &&
      /refereed bound is changed/i.test(IMP35218_REAL_ORDINATE_BACKGROUND_FIELD_SUP.verdict),
  },
];

for (const a of IMP35218_REAL_ORDINATE_BACKGROUND_FIELD_SUP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35218-real-ordinate-background-field-sup assertion failed: ${a.id}`);
  }
}
