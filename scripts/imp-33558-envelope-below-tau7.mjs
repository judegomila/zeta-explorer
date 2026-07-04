// imp-33558 offline probe: extend the imp-33538 tau-uniform envelope-constant measurement to
// LOWER heights tau in {5,6}. Reproduce the imp-33312 min-node grade6/171p lattice-jitter band
// per-height ceilings (max worst-in-window ULP over the FIXED resolved neighbourhood [245,325])
// and report whether the ~10.78 ULP envelope (set at tau=8 over tau in {7..10}) still
// upper-bounds worst-in-window below tau=7. Same machinery as imp-33312; measure only.

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

const GOLD_MARGIN = 3.5;
const BAR = 1.0;
const STEP = 2;
const GRADE = 6;
const NBHD_LO = 245;
const NBHD_HI = 325;
const ENVELOPE = 10.7793; // imp-33538 constant, set at tau=8 over tau in {7..10}

function perHeight(tau) {
  const T = tau + GOLD_MARGIN;
  const v5 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 5), 5);
  const v6 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 6), 6);
  const ref = 0.5 * (v5 + v6);
  const ulp = Math.abs(ref) * EPS;
  const clusterUlp = Math.abs(v5 - v6) / ulp;
  const rows = [];
  for (let p = NBHD_LO; p <= NBHD_HI; p += STEP) {
    rows.push(Math.abs(negLnAgradedGL(tau, HI, p, GRADE) - ref) / ulp);
  }
  const n = rows.length;
  const passCount = rows.filter((u) => u < BAR).length;
  const max = Math.max(...rows);
  const min = Math.min(...rows);
  const mean = rows.reduce((a, b) => a + b, 0) / n;
  return { tau, goldClusterUlp: clusterUlp, n, passFraction: passCount / n, minUlp: min, maxUlp: max, meanUlp: mean };
}

console.log('neighbourhood tau*(245,6)=%s tau*(325,6)=%s  (resolved for tau<=~6.96)',
  tauStar(NBHD_LO, GRADE).toFixed(4), tauStar(NBHD_HI, GRADE).toFixed(4));
console.log('envelope E (imp-33538, set at tau=8) = %s ULP\n', ENVELOPE.toFixed(4));
console.log('tau  goldClusterUlp  passFrac   min     mean    CEILING(max)   <=E?');
for (const tau of [5, 6, 7, 8, 9, 10]) {
  const h = perHeight(tau);
  console.log(
    `${tau}    ${h.goldClusterUlp.toFixed(3)}          ${(h.passFraction * 100).toFixed(1)}%   ` +
    `${h.minUlp.toFixed(3)}   ${h.meanUlp.toFixed(3)}   ${h.maxUlp.toFixed(4)}      ${h.maxUlp <= ENVELOPE ? 'YES' : 'NO -- BINDS BELOW tau=7'}`
  );
}
