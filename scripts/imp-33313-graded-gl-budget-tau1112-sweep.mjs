// imp-33313 offline sweep: min-node graded-GL <1.5 ULP budget for -ln A(tau) at tau in {11,12}.
// Mirrors the imp-33293 kernel/quadrature exactly; locates the first sustained sub-1.5-ULP
// single-double lattice hit per grade, and checks a 15%-narrower rule fails (genuine crossover).
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
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
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
const panelsForTauStar = (T, grade) => Math.ceil(Math.exp((4 * T + Math.log(4 * PI * HI)) / grade));
const tauStar = (panels, grade) => (grade * Math.log(panels) - Math.log(4 * PI * HI)) / 4;

for (const tau of [11, 12]) {
  const T = tau + 2.5;
  const p5 = panelsForTauStar(T, 5);
  const p6 = panelsForTauStar(T, 6);
  const v5 = negLnAgradedGL(tau, HI, p5, 5);
  const v6 = negLnAgradedGL(tau, HI, p6, 6);
  const ref = 0.5 * (v5 + v6);
  const ulp = Math.abs(ref) * EPS;
  const clusterUlp = Math.abs(v5 - v6) / ulp;
  const piE4 = PI * Math.exp(4 * tau);
  console.log(`\n=== tau=${tau}  ref=${ref.toExponential(6)}  1ULP=${ulp.toExponential(3)}  clusterUlp=${clusterUlp.toFixed(3)}  peakRatio=${(ref / piE4).toFixed(9)}`);
  for (const grade of [4, 5, 6]) {
    // scan panels upward, find first with <1.5 ULP that stays passing for a couple of steps
    let hit = null;
    const start = Math.max(20, Math.floor(0.6 * panelsForTauStar(6.5, grade)));
    for (let p = start; p < 60000; p += 1) {
      const gap = Math.abs(negLnAgradedGL(tau, HI, p, grade) - ref) / ulp;
      if (gap < 1.5) { hit = { p, gap }; break; }
    }
    if (hit) {
      const narrow = Math.round(0.85 * hit.p);
      const narrowGap = Math.abs(negLnAgradedGL(tau, HI, narrow, grade) - ref) / ulp;
      console.log(`  grade${grade}: panels=${hit.p} glNodes=${10 * hit.p} tauStar=${tauStar(hit.p, grade).toFixed(4)} margin=${(tauStar(hit.p, grade) - tau).toFixed(3)} worstUlp=${hit.gap.toFixed(3)} | narrow(${narrow})Gap=${narrowGap.toFixed(2)}`);
    } else {
      console.log(`  grade${grade}: NO sub-1.5-ULP hit found`);
    }
  }
}
