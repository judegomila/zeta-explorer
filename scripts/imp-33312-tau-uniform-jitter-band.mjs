// imp-33312 offline probe: is the imp-33296 min-node graded-GL lattice-jitter band
// tau-INDEPENDENT across heights tau in {7,8,9,10}? Same +/-2-panel lattice scan of a
// resolved-region grade6 neighbourhood, single-tau gold per height (imp-33293 route).

const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52);
const HI = 14;

function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}
const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845, 0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806, 0.0666713443086881,
];
function negLnAgradedGL(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}
const tauStar = (panels, grade) => (grade * Math.log(panels) - Math.log(4 * PI * HI)) / 4;
const panelsForTauStar = (T, grade) => Math.ceil(Math.exp((4 * T + Math.log(4 * PI * HI)) / grade));

const HEIGHTS = [7, 8, 9, 10];
const GOLD_MARGIN = 3.5;
const BAR = 1.0;
const STEP = 2;
const GRADE = 6;
// resolved-region neighbourhood: tau*(p,6) > ~6.96 (above the imp-33293 crossover ~6.95)
const LO = 245;
const HI_P = 325;

function quantile(sortedAsc, q) {
  return sortedAsc[Math.floor(q * (sortedAsc.length - 1))];
}

const rowsOut = [];
for (const tau of HEIGHTS) {
  const T = tau + GOLD_MARGIN;
  const v5 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 5), 5);
  const v6 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 6), 6);
  const ref = 0.5 * (v5 + v6);
  const clusterUlp = Math.abs(v5 - v6) / (Math.abs(ref) * EPS);
  const ulp = Math.abs(ref) * EPS;
  const peakRatio = ref / (PI * Math.exp(4 * tau));

  const rows = [];
  for (let p = LO; p <= HI_P; p += STEP) {
    const worstUlp = Math.abs(negLnAgradedGL(tau, HI, p, GRADE) - ref) / ulp;
    rows.push({ panels: p, worstUlp, passes: worstUlp < BAR });
  }
  const n = rows.length;
  const ulps = rows.map((r) => r.worstUlp);
  const passCount = rows.filter((r) => r.passes).length;
  const mean = ulps.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(ulps.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const sorted = [...ulps].sort((a, b) => a - b);
  const min = sorted[0], max = sorted[n - 1];
  const median = quantile(sorted, 0.5), p90 = quantile(sorted, 0.9);
  let longestPassRun = 0, cur = 0;
  for (const r of rows) {
    if (r.passes) { cur += 1; if (cur > longestPassRun) longestPassRun = cur; }
    else cur = 0;
  }
  rowsOut.push({
    tau, clusterUlp, peakRatio, tauStarLo: tauStar(LO, GRADE), tauStarHi: tauStar(HI_P, GRADE),
    n, passCount, passFraction: passCount / n, mean, median, std, min, max, p90, longestPassRun,
  });
}

console.log('height  clusterUlp peakRatio  passFrac  mean   median  min    max    p90    lpr');
for (const r of rowsOut) {
  console.log(
    `tau=${r.tau}  ${r.clusterUlp.toFixed(3)}     ${r.peakRatio.toFixed(6)}  ` +
    `${(r.passFraction * 100).toFixed(1)}%     ${r.mean.toFixed(2)}   ${r.median.toFixed(2)}    ` +
    `${r.min.toFixed(2)}   ${r.max.toFixed(2)}   ${r.p90.toFixed(2)}   ${r.longestPassRun}`
  );
}
const passFracs = rowsOut.map((r) => r.passFraction);
const means = rowsOut.map((r) => r.mean);
const maxes = rowsOut.map((r) => r.max);
const mins = rowsOut.map((r) => r.min);
const p90s = rowsOut.map((r) => r.p90);
const medians = rowsOut.map((r) => r.median);
console.log('\n-- cross-height spreads (max-min) --');
console.log('passFraction spread:', (Math.max(...passFracs) - Math.min(...passFracs)).toFixed(4));
console.log('mean spread:', (Math.max(...means) - Math.min(...means)).toFixed(4));
console.log('median spread:', (Math.max(...medians) - Math.min(...medians)).toFixed(4));
console.log('band-floor(min) spread:', (Math.max(...mins) - Math.min(...mins)).toFixed(4));
console.log('band-ceiling(max) spread:', (Math.max(...maxes) - Math.min(...maxes)).toFixed(4));
console.log('p90 spread:', (Math.max(...p90s) - Math.min(...p90s)).toFixed(4));
console.log('ceiling ratio max/min:', (Math.max(...maxes) / Math.min(...maxes)).toFixed(3));
console.log('mean ratio max/min:', (Math.max(...means) / Math.min(...means)).toFixed(3));
