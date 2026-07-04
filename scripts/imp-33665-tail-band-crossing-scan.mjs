// imp-33623 offline probe: CC-vs-graded min-node ratio at band-crossing rungs n in {500,510,525}.
const NPHI = 10;
const PI = Math.PI;
const U = Math.pow(2, -52);

function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2) * Math.exp(-PI * n2 * e4);
  }
  return s;
}
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
function aDirectGradedGL(tau, hi, panels, grade) {
  let sum = 0;
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      sum += GL_W[k] * half * phiKernel(s) * phiKernel(s + tau);
    }
  }
  return sum;
}
function clenshawCurtis(N) {
  const x = new Array(N + 1);
  const w = new Array(N + 1);
  for (let k = 0; k <= N; k += 1) x[k] = Math.cos((PI * k) / N);
  for (let k = 0; k <= N; k += 1) {
    let sum = 0;
    const ck = k === 0 || k === N ? 0.5 : 1;
    for (let j = 0; j <= N / 2; j += 1) {
      const bj = j === 0 || j === N / 2 ? 1 : 2;
      sum += (bj / (1 - 4 * j * j)) * Math.cos((2 * PI * j * k) / N);
    }
    w[k] = ck * (2 / N) * sum;
  }
  return { x, w };
}
function aDirectCC(tau, hi, N) {
  const { x, w } = clenshawCurtis(N);
  const half = hi / 2;
  const mid = hi / 2;
  let sum = 0;
  for (let k = 0; k <= N; k += 1) {
    const s = mid + half * x[k];
    sum += w[k] * half * phiKernel(s) * phiKernel(s + tau);
  }
  return sum;
}
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
function aLog(tau) {
  return Math.exp(-negLnAgradedGL(tau, 10, 300, 5));
}
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const HI = 7;
const DEEP_FLOOR_ULP = 64;
const GRADE = 4;
const GRADED_MIN_PANELS = 20;
const GRADED_NODES = GRADED_MIN_PANELS * GL_X.length; // 200
const CC_LADDER = [16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192];
const LO = 960, HIRUNG = 1000;
let bandCrossCount = 0;       // rungs where CC/graded ratio >= 4
let gradedOutOfBandCount = 0; // rungs where flat 200-node graded floor left the <64 band
let conditionalCrossCount = 0;
let unconditionalCrossCount = 0;
const rows = [];
for (let n = LO; n <= HIRUNG; n += 1) {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;
  const gradedUlp = Math.abs(aDirectGradedGL(tauStar, HI, GRADED_MIN_PANELS, GRADE) - aLogVal) / ulpOfALog;
  const gradedInBand = gradedUlp < DEEP_FLOOR_ULP;
  let ccMinNodes = Infinity, ccMinN = null, ccMinUlp = Infinity;
  for (const N of CC_LADDER) {
    const ulp = Math.abs(aDirectCC(tauStar, HI, N) - aLogVal) / ulpOfALog;
    if (ulp < DEEP_FLOOR_ULP && ccMinNodes === Infinity) { ccMinNodes = N + 1; ccMinN = N; ccMinUlp = ulp; }
  }
  const ratio = ccMinNodes / GRADED_NODES;
  const cross4x = ratio >= 4;
  if (cross4x) {
    bandCrossCount += 1;
    if (gradedInBand) unconditionalCrossCount += 1; else conditionalCrossCount += 1;
  }
  if (!gradedInBand) gradedOutOfBandCount += 1;
  rows.push({ n, tauStar, gradedUlp, gradedInBand, ccMinN, ccMinNodes, ccMinUlp, ratio, cross4x });
  console.log(`n=${n} tau*=${tauStar.toFixed(6)} gradedUlp=${gradedUlp.toFixed(2)} gradedInBand=${gradedInBand} ccMinN=${ccMinN} ccMinNodes=${ccMinNodes} ccMinUlp=${ccMinUlp.toFixed(1)} ratio=${ratio.toFixed(3)} cross4x=${cross4x}`);
}
const total = rows.length;
console.log(`\nSUMMARY [${LO},${HIRUNG}] total=${total}`);
console.log(`  cross4x rungs: ${bandCrossCount}/${total} (${(100*bandCrossCount/total).toFixed(1)}%)`);
console.log(`  graded 200-node floor OUT of band: ${gradedOutOfBandCount}/${total} (${(100*gradedOutOfBandCount/total).toFixed(1)}%)`);
console.log(`  cross4x AND graded-out-of-band (CONDITIONAL): ${conditionalCrossCount}`);
console.log(`  cross4x AND graded-in-band (UNCONDITIONAL): ${unconditionalCrossCount}`);
const condFrac = bandCrossCount > 0 ? conditionalCrossCount / bandCrossCount : 0;
console.log(`  fraction of 4x crossings that are conditional: ${condFrac.toFixed(3)}`);
const distinctCC = [...new Set(rows.map(r => r.ccMinN))].sort((a, b) => a - b);
console.log(`  distinct CC min-N across region: ${distinctCC.join(',')}`);
