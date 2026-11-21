/**
 * @module imp-35283-min-gap-prefactor-multipoint-regression
 *
 * imp-35283 (numerical, MEASUREMENT ONLY): refine the imp-35239 real-ordinate min-gap
 * prefactor growth exponent p_gap. imp-35239 fit beta(N) ~ N^p from a TWO-POINT log-log
 * ENDPOINT slope p = log(beta_200 / beta_50) / log 4 over N = 50, 100, 200 only, reading
 * off p ~ 0.645 (matched min-gap fraction 0.5) and p ~ 0.572 (fraction 0.05) -- both in
 * (1/2, 2/3), strictly sub-linear (p_gap < 1 = strip p_strip). A two-point endpoint slope
 * is fragile: it uses ONLY the two extreme runs and is sensitive to non-monotone wiggle in
 * either endpoint. This module re-runs the imp-35218 real-ordinate running-sup beta
 * measurement over a DENSER N grid (N = 25, 50, 75, 100, 125, 150, 175, 200) and fits
 * p_gap by LEAST-SQUARES over the full 8-point log-log set at each matched front-progress
 * fraction, reporting whether p_gap stays strictly sub-linear (p < 1, beats the imp-35196
 * strip 2N) or drifts toward 1 (advantage collapse). Assessment/measurement only; I3 stays
 * OPEN; NO QED.
 *
 * THE MEASUREMENT (identical integrator to imp-35218; only the N grid is denser)
 * -----------------------------------------------------------------------------
 * Particles x_1 < ... < x_N flow backward under the attractive rational Dyson field
 *     dx_k/ds = -2 sum_{j != k} 1 / (x_k - x_j),   s = -t >= 0,
 * from the first N REAL Riemann zero ordinates gamma_1 .. gamma_N (baked FIRST_200_ZEROS,
 * matching zeros-to-1e6 slice(0, 200); kept light so this module does NOT pull the 16.7 MB
 * zeros bundle). For an adjacent pair p = (a, b), a = x_k < b = x_{k+1}, the imp-2563 gap
 * ODE du/ds = -8 + 4 B_p(s) u carries the POSITIVE reciprocal-product background field
 *     B_p(s) = sum_{j != k, k+1} 1 / ((b - x_j) (a - x_j)),
 * and beta(N) is its running sup over adjacent pairs and backward times, snapshotted when
 * the global min gap first crosses matched fractions [0.5, 0.25, 0.1, 0.05] of each run own
 * initial min gap. This reproduces the imp-35218 literals at N = 50, 100, 200 exactly
 * (beta ~ 1.10 / 1.71 / 2.69 at fraction 0.5; ~9.18 / 15.68 / 20.28 at fraction 0.05).
 *
 * WHAT THE MULTI-POINT REGRESSION SAYS
 * ------------------------------------
 * Least-squares fit of log beta(N) on log N over ALL 8 grid points:
 *
 *   fraction 0.5 : p_gap = 0.641, R^2 = 0.936   (two-point endpoint slope 0.641 -- agrees)
 *   fraction 0.05: p_gap = 0.652, R^2 = 0.866   (two-point endpoint slope 0.572 -- endpoint UNDERSTATED)
 *
 * BOTH multi-point exponents remain strictly SUB-LINEAR (p_gap < 1 = p_strip), confirming
 * the imp-35239 verdict with a regression that uses every run rather than just the two
 * extremes. At fraction 0.5 the multi-point p (0.641) matches the imp-35239 endpoint slope
 * (0.645) essentially exactly. At fraction 0.05 the endpoint slope (0.572) UNDERSTATED the
 * growth: the N = 200 running-sup dipped below the N = 150 point (a non-monotone wiggle from
 * the discrete zero table), dragging the two-point endpoint slope down; the least-squares fit
 * over all 8 points recovers p = 0.652, still comfortably below 1. So the endpoint fit was
 * fragile but not misleading -- the sub-linear verdict is robust to the fit method.
 *
 * NO DRIFT TOWARD 1 WITHIN THE OBSERVED RANGE
 * -------------------------------------------
 * Splitting the grid and fitting the local slope on each half tests for drift toward the
 * strip exponent 1 as N grows:
 *   fraction 0.5 : p_lower(N=25..100) = 0.773, p_upper(N=100..200) = 0.606
 *   fraction 0.05: p_lower(N=25..100) = 0.917, p_upper(N=100..200) = 0.321
 * The UPPER-half local slope is LOWER than the lower-half at both fractions -- the exponent
 * does NOT drift toward 1 as N grows over the observed range; if anything it flattens. So
 * over N = 25..200 there is no sign of advantage collapse: p_gap stays bounded below 1 and
 * the min-gap advantage factor 2 N^{1 - p_gap} keeps growing.
 *
 * HONEST SCOPE LIMIT (the sub-gap this measurement does NOT close)
 * ---------------------------------------------------------------
 * The N grid is CAPPED at 200 -- the length of the baked real-ordinate table. This is a
 * DENSER sample of the SAME 25..200 window imp-35239 used, not an EXTENSION to larger N.
 * It therefore CANNOT test whether p_gap eventually drifts toward 1 far beyond N = 200; that
 * would require more baked ordinates (or the heavy zeros bundle) and a longer backward
 * integration budget. So this module SHARPENS the imp-35239 sub-linear verdict (robust to
 * the fit method, no drift within 25..200) but leaves the asymptotic-N behaviour OPEN --
 * sub-gap G-35283a: extend the real-ordinate beta regression beyond N = 200.
 *
 * MEASUREMENT ONLY. Probes the imp-35167 M2 background-field sup exponent on real ordinates.
 * It does NOT certify N-uniformity (imp-35218 R1 already refuted it), does NOT discharge M2
 * or M5, does NOT touch the imp-2563 sandwich (a valid CONDITIONAL bracket). Changes no
 * bound; establishes no operator positivity; I3 stays OPEN; C_mb GUE-conditional per imp-486
 * UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35239-min-gap-prefactor-real-spacing-reassessment (the two-point endpoint slope refined here)
 * @see imp-35218-real-ordinate-background-field-sup (the running-sup measurement re-run on a denser grid)
 * @see imp-35196-ystar-schedule-reconciliation-assessment (strip route eliminated; L_strip = 2N/y^2, p_strip = 1)
 * @see imp-35167-g-min-non-collision-certificate-scope (M2/M5/M3 min-gap certificate; the OPEN Q3)
 * @see imp-2563-min-gap-sandwich-theorem (the gap ODE du/ds = -8 + 4 B(s) u; assumes beta finite)
 * @see imp-486 (C_mb GUE-conditional)
 */

// ---------------------------------------------------------------------------
// First 200 REAL Riemann zero ordinates gamma_1 .. gamma_200 (Odlyzko table),
// baked == ZEROS_EXTENDED.slice(0, 200) of zeros-to-1e6.js. Kept light so this
// measurement does NOT transitively pull the 16.7 MB zeros bundle (memory
// feedback_verify_heavy_assertion_modules / no_heavy_imports_in_pages).
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
// (identical integrator to imp-35218; only the N grid is denser).
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

// Running sup over adjacent pairs of B_p = sum 1/((b-x_j)(a-x_j)); every term positive.
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

const GAP_FRACTIONS = [0.5, 0.25, 0.1, 0.05]; // of EACH run own initial min gap
const STEP_SAFETY = 0.02; // dt = STEP_SAFETY * g_min^2
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
      snaps.push({ fraction: GAP_FRACTIONS[li], beta: runningSup, gMin: g });
      li++;
    }
    if (li >= GAP_FRACTIONS.length) break;
    x = rk4Step(x, STEP_SAFETY * g * g);
    steps++;
  }
  return { N, initGap, snaps };
}

// Denser N grid than imp-35239 (which used only 50, 100, 200), capped at the 200-zero table.
const N_GRID = [25, 50, 75, 100, 125, 150, 175, 200];
const FIT_FRACTIONS = [0.5, 0.05]; // the two matched fractions imp-35239 reported
const RUNS = N_GRID.map(runFlow);

const betaAt = (run, frac) => run.snaps.find((r) => r.fraction === frac).beta;

// Ordinary least-squares slope/intercept/R^2 of ys on xs.
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx, r2: (sxy * sxy) / (sxx * syy) };
}

// Two-point log-log endpoint slope over N = 50 -> 200 (the imp-35239 method) on this grid.
function endpointSlope(frac) {
  const b50 = betaAt(RUNS[N_GRID.indexOf(50)], frac);
  const b200 = betaAt(RUNS[N_GRID.indexOf(200)], frac);
  return Math.log(b200 / b50) / Math.log(200 / 50);
}

const round = (v, d = 4) => +v.toFixed(d);

const P_STRIP = 1; // strip prefactor L_strip = 2N/y^2 is EXACTLY N-linear

// Per-fraction multi-point regression + endpoint comparison + upper/lower drift diagnostic.
const REGRESSION_TABLE = FIT_FRACTIONS.map((frac) => {
  const logN = [], logBeta = [], betaByN = {};
  for (const run of RUNS) {
    const b = betaAt(run, frac);
    logN.push(Math.log(run.N));
    logBeta.push(Math.log(b));
    betaByN['N' + run.N] = round(b, 4);
  }
  const fit = ols(logN, logBeta);
  // Local slopes on the lower (N <= 100) and upper (N >= 100) halves to test drift toward 1.
  const lo = { x: [], y: [] }, hi = { x: [], y: [] };
  for (const run of RUNS) {
    const lx = Math.log(run.N), ly = Math.log(betaAt(run, frac));
    if (run.N <= 100) { lo.x.push(lx); lo.y.push(ly); }
    if (run.N >= 100) { hi.x.push(lx); hi.y.push(ly); }
  }
  return {
    fraction: frac,
    betaByN,
    p_gap_multipoint: round(fit.slope),
    r2: round(fit.r2),
    p_gap_endpoint_50_200: round(endpointSlope(frac)),
    p_lower_25_100: round(ols(lo.x, lo.y).slope),
    p_upper_100_200: round(ols(hi.x, hi.y).slope),
    subLinear: fit.slope < P_STRIP,
    driftsTowardOne: ols(hi.x, hi.y).slope > ols(lo.x, lo.y).slope + 0.1,
  };
});

const allSubLinear = REGRESSION_TABLE.every((r) => r.subLinear);
const anyDriftsTowardOne = REGRESSION_TABLE.some((r) => r.driftsTowardOne);

export const IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION = {
  id: 'imp-35283',
  proofSection: 'S-frontier',
  title:
    'Refine the imp-35239 real-ordinate min-gap prefactor growth exponent p_gap by a ' +
    'LEAST-SQUARES regression over a denser N grid (N = 25..200, 8 points) instead of the ' +
    'imp-35239 two-point log-log endpoint slope over N = 50, 100, 200. Multi-point p_gap ' +
    'stays strictly SUB-LINEAR (p ~ 0.64-0.65 < 1 = strip p_strip) at both matched fractions, ' +
    'and the upper-half local slope is LOWER than the lower-half -- no drift toward 1 within ' +
    'the observed range. Measurement only; I3 stays OPEN; NO QED.',
  grade:
    'numerical (denser re-run of the imp-35218 real-ordinate running-sup beta measurement; ' +
    'sharpens but does NOT extend the imp-35239 two-point endpoint fit)',
  method:
    'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) from the first N real Riemann ordinates; adjacent-pair ' +
    'B_p(s) = sum_{j != k,k+1} 1/((b - x_j)(a - x_j)); beta(N) = running sup snapshotted at matched ' +
    'min-gap fractions; least-squares fit of log beta on log N over N in {25,50,75,100,125,150,175,200}.',
  regressionTable: REGRESSION_TABLE,
  p_strip: P_STRIP,
  allFractionsSubLinear: allSubLinear,
  anyFractionDriftsTowardOne: anyDriftsTowardOne,
  // The denser fit reproduces the imp-35239 endpoint slope at frac 0.5 and RECOVERS a value the
  // frac 0.05 endpoint understated (the N=200 running-sup dipped below N=150) -- both still < 1.
  reproducesImp35239Endpoint: true,
  // HONEST scope limit: grid capped at N = 200 (baked table). Cannot test asymptotic drift beyond 200.
  gridCappedAtN200: true,
  subGap: 'G-35283a: extend the real-ordinate beta regression beyond N = 200 (needs more baked ordinates / longer integration budget) to test asymptotic p_gap drift.',
  i3Discharged: false,
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-diagnostic, NOT a certificate). imp-35239 fit the real-ordinate ' +
    'min-gap prefactor exponent p_gap from a TWO-POINT log-log endpoint slope over N = 50, 100, 200 ' +
    'only, reading p ~ 0.645 (fraction 0.5) and ~0.572 (fraction 0.05). Re-running the imp-35218 ' +
    'running-sup beta measurement over a DENSER 8-point grid (N = 25..200) and fitting p_gap by ' +
    'LEAST-SQUARES over the full log-log set gives p_gap ~ 0.641 (fraction 0.5, R^2 ~ 0.94) and ' +
    '~0.652 (fraction 0.05, R^2 ~ 0.87) -- BOTH strictly SUB-LINEAR (p_gap < 1 = strip p_strip). ' +
    'At fraction 0.5 the multi-point fit MATCHES the imp-35239 endpoint slope; at fraction 0.05 the ' +
    'endpoint slope (0.572) UNDERSTATED the growth (the N=200 running-sup dipped below N=150, a ' +
    'non-monotone wiggle from the discrete zero table), and the least-squares fit over all 8 points ' +
    'recovers 0.652 -- still comfortably below 1. Splitting the grid, the UPPER-half local slope ' +
    '(N=100..200) is LOWER than the lower-half (N=25..100) at BOTH fractions, so p_gap does NOT ' +
    'drift toward the strip exponent 1 as N grows over the observed range -- no sign of advantage ' +
    'collapse; the min-gap advantage factor 2 N^{1-p_gap} keeps growing. HONEST SCOPE LIMIT: the N ' +
    'grid is CAPPED at 200 (the baked real-ordinate table), so this is a denser sample of the SAME ' +
    '25..200 window, NOT an extension to larger N; it CANNOT test whether p_gap eventually drifts ' +
    'toward 1 far beyond N = 200 (sub-gap G-35283a). So the imp-35239 sub-linear verdict is ' +
    'SHARPENED (robust to the fit method; no drift within 25..200) but the asymptotic-N behaviour ' +
    'stays OPEN. This probe does NOT certify N-uniformity (imp-35218 R1 refuted it), does NOT ' +
    'discharge M2 or M5, does NOT touch the imp-2563 sandwich (a valid CONDITIONAL bracket). I3 ' +
    'stays OPEN; changes no bound; establishes no operator positivity; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35239-min-gap-prefactor-real-spacing-reassessment (two-point endpoint slope refined here); ' +
    'imp-35218-real-ordinate-background-field-sup (running-sup beta measurement re-run denser); ' +
    'imp-35196-ystar-schedule-reconciliation-assessment (strip route eliminated; L_strip = 2N/y^2, p_strip = 1); ' +
    'imp-35167-g-min-non-collision-certificate-scope (M2/M5/M3 min-gap certificate; the OPEN Q3); ' +
    'imp-2563-min-gap-sandwich-theorem (gap ODE du/ds = -8 + 4 B(s) u, CONDITIONAL bracket); ' +
    'imp-486 (C_mb GUE-conditional).',
};

export const IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION_ASSERTIONS = [
  {
    // The denser measurement reproduces the imp-35218 literals at the shared N = 50, 100, 200.
    id: 'imp35283-reproduces-imp35218-literals',
    description: 'beta at N = 50, 100, 200 (fraction 0.5) reproduces the imp-35218 literals ~1.10 / 1.71 / 2.69',
    holds: () => {
      const t = REGRESSION_TABLE.find((r) => r.fraction === 0.5).betaByN;
      return (
        Math.abs(t.N50 - 1.1) < 0.05 &&
        Math.abs(t.N100 - 1.71) < 0.05 &&
        Math.abs(t.N200 - 2.69) < 0.05
      );
    },
  },
  {
    // Multi-point least-squares p_gap is strictly SUB-LINEAR at every matched fraction.
    id: 'imp35283-multipoint-sub-linear',
    description: 'least-squares p_gap over N = 25..200 is in (1/2, 1) -- strictly below the strip p_strip = 1 -- at both fractions',
    holds: () =>
      REGRESSION_TABLE.every((r) => r.p_gap_multipoint > 0.5 && r.p_gap_multipoint < P_STRIP),
  },
  {
    // The regression is a reasonable power-law fit (R^2 well above 0.5) at both fractions.
    id: 'imp35283-regression-fit-quality',
    description: 'log-log regression R^2 exceeds 0.8 at both matched fractions (power-law fit is reasonable)',
    holds: () => REGRESSION_TABLE.every((r) => r.r2 > 0.8),
  },
  {
    // The multi-point fit at frac 0.5 matches the imp-35239 endpoint slope (agreement of methods).
    id: 'imp35283-frac05-matches-endpoint',
    description: 'at fraction 0.5 the multi-point p_gap matches the two-point endpoint slope to within 0.02',
    holds: () => {
      const r = REGRESSION_TABLE.find((x) => x.fraction === 0.5);
      return Math.abs(r.p_gap_multipoint - r.p_gap_endpoint_50_200) < 0.02;
    },
  },
  {
    // No drift toward 1: the upper-half local slope is NOT larger than the lower-half at any fraction.
    id: 'imp35283-no-drift-toward-one',
    description: 'the upper-half (N=100..200) local slope is not larger than the lower-half (N=25..100) -- p_gap does not drift toward the strip exponent 1 within the range',
    holds: () => REGRESSION_TABLE.every((r) => r.p_upper_100_200 <= r.p_lower_25_100 && !r.driftsTowardOne),
  },
  {
    // Honesty gate: measurement only, grid capped, sub-gap named, I3 OPEN, NO QED, no refereed bound is changed.
    id: 'imp35283-honesty-gate-no-qed',
    description: 'Measurement only: allSubLinear true, no drift, grid capped at 200, sub-gap named, I3 OPEN, isRigorous false, NO QED, no refereed bound is changed',
    holds: () =>
      IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION.allFractionsSubLinear === true &&
      IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION.anyFractionDriftsTowardOne === false &&
      IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION.gridCappedAtN200 === true &&
      /G-35283a/.test(IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION.subGap) &&
      IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION.i3Discharged === false &&
      IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION.isRigorous === false &&
      /NO QED/.test(IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION.verdict) &&
      /refereed bound is changed/i.test(IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION.verdict),
  },
];

for (const a of IMP35283_MIN_GAP_PREFACTOR_MULTIPOINT_REGRESSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35283-min-gap-prefactor-multipoint-regression assertion failed: ${a.id}`);
  }
}
