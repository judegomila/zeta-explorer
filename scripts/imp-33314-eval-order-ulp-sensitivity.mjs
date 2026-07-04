// imp-33314 -- cross-platform libm exp/log ULP-sensitivity of the imp-33296/imp-33249
// min-node graded-GL node budget for -ln A(tau). Offline generator / self-check: recompute
// the min-node lattice scan under alternate but equally-valid exp/log evaluation orderings and
// measure the induced shift in the worst-in-window ULP, the ~12% strict-<1-ULP pass-fraction and
// the [~0.7,5] ULP robust band endpoints. Assessment only; no new bound; NPHI=10 inherited.

const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52);
const HI = 14;

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

// Inner kernel with an evaluation-order knob. 'reverse' sums the n-loop high->low.
function logPhiFactored(u, order) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  if (order === 'reverse') {
    for (let n = NPHI; n >= 1; n -= 1) {
      const n2 = n * n;
      const n4 = n2 * n2;
      const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
      acc += amp * Math.exp(-PI * (n2 - 1) * e4);
    }
  } else {
    for (let n = 1; n <= NPHI; n += 1) {
      const n2 = n * n;
      const n4 = n2 * n2;
      const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
      acc += amp * Math.exp(-PI * (n2 - 1) * e4);
    }
  }
  return -PI * e4 + Math.log(acc);
}

// Outer graded-GL log-sum-exp with an evaluation-order knob:
//   baseline : forward accumulation of exp(t-mx), plain log            (identical to imp-33296)
//   reverse  : reversed n-loop AND reversed outer accumulation
//   sorted   : ascending-magnitude accumulation of exp(t-mx)           (round-off-minimal order)
//   log1p    : log1p over the non-max residual: acc = 1 + sum_{i!=argmax} exp(t_i-mx)
function negLnAgradedGL(tau, hi, panels, grade, order) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s, order) + logPhiFactored(s + tau, order));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  if (order === 'sorted') {
    const scaled = terms.map((t) => Math.exp(t - mx)).sort((x, y) => x - y);
    let acc = 0;
    for (const v of scaled) acc += v;
    return -(mx + Math.log(acc));
  }
  if (order === 'log1p') {
    let argmax = 0;
    for (let i = 1; i < terms.length; i += 1) if (terms[i] > terms[argmax]) argmax = i;
    let rest = 0;
    for (let i = 0; i < terms.length; i += 1) if (i !== argmax) rest += Math.exp(terms[i] - mx);
    return -(mx + Math.log1p(rest));
  }
  if (order === 'reverse') {
    let acc = 0;
    for (let i = terms.length - 1; i >= 0; i -= 1) acc += Math.exp(terms[i] - mx);
    return -(mx + Math.log(acc));
  }
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}

const panelsForTauStar = (T, grade) => Math.ceil(Math.exp((4 * T + Math.log(4 * PI * HI)) / grade));
const tauStar = (panels, grade) => (grade * Math.log(panels) - Math.log(4 * PI * HI)) / 4;

const TAU_GRID = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
const GOLD_MARGIN = 2.5;
const BAR = 1.0;
const STEP = 2;
const NEIGHBOURHOODS = [
  { grade: 6, lo: 155, hi: 235, anchor: 171 },
  { grade: 5, lo: 560, hi: 680, anchor: 600 },
];
const ORDERS = ['baseline', 'reverse', 'sorted', 'log1p'];

function goldFor(order) {
  return TAU_GRID.map((tau) => {
    const T = tau + GOLD_MARGIN;
    const v4 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 4), 4, order);
    const v5 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 5), 5, order);
    const ref = 0.5 * (v4 + v5);
    return { tau, ref, clusterUlp: Math.abs(v4 - v5) / (Math.abs(ref) * EPS) };
  });
}

function worstInWindow(gold, panels, grade, order) {
  let worst = 0;
  for (const { tau, ref } of gold) {
    const ulp = Math.abs(ref) * EPS;
    const gap = Math.abs(negLnAgradedGL(tau, HI, panels, grade, order) - ref) / ulp;
    if (gap > worst) worst = gap;
  }
  return worst;
}

function stats(order) {
  const gold = goldFor(order);
  const goldWorst = gold.reduce((m, g) => Math.max(m, g.clusterUlp), 0);
  const nbhd = NEIGHBOURHOODS.map(({ grade, lo, hi, anchor }) => {
    const rows = [];
    for (let p = lo; p <= hi; p += STEP) rows.push({ panels: p, worstUlp: worstInWindow(gold, p, grade, order) });
    const ulps = rows.map((r) => r.worstUlp);
    const pass = rows.filter((r) => r.worstUlp < BAR).length;
    const anchorUlp = rows.find((r) => r.panels === anchor).worstUlp;
    return {
      grade, n: rows.length, passFraction: pass / rows.length,
      minUlp: Math.min(...ulps), maxUlp: Math.max(...ulps),
      meanUlp: ulps.reduce((a, b) => a + b, 0) / ulps.length, anchorUlp,
    };
  });
  return { order, goldWorst, nbhd };
}

const byOrder = {};
for (const o of ORDERS) byOrder[o] = stats(o);

// Direct cross-ordering evaluation-shift: |v_order - v_baseline|/ulp at the SAME (panels,grade,tau).
const goldBase = goldFor('baseline');
const evalShift = {};
for (const o of ORDERS) {
  if (o === 'baseline') { evalShift[o] = 0; continue; }
  let worst = 0;
  for (const { grade, lo, hi } of NEIGHBOURHOODS) {
    for (let p = lo; p <= hi; p += STEP) {
      for (const { tau, ref } of goldBase) {
        const ulp = Math.abs(ref) * EPS;
        const vb = negLnAgradedGL(tau, HI, p, grade, 'baseline');
        const vo = negLnAgradedGL(tau, HI, p, grade, o);
        const d = Math.abs(vo - vb) / ulp;
        if (d > worst) worst = d;
      }
    }
  }
  evalShift[o] = worst;
}

console.log('=== per-ordering statistics ===');
for (const o of ORDERS) {
  const s = byOrder[o];
  console.log(`\n[${o}] goldWorst=${s.goldWorst.toFixed(4)} ULP`);
  for (const nb of s.nbhd) {
    console.log(`  grade${nb.grade}: passFrac=${(nb.passFraction * 100).toFixed(1)}% ` +
      `band=[${nb.minUlp.toFixed(3)},${nb.maxUlp.toFixed(3)}] mean=${nb.meanUlp.toFixed(3)} anchorUlp=${nb.anchorUlp.toFixed(3)}`);
  }
}
console.log('\n=== direct cross-ordering evaluation shift (max ULP vs baseline) ===');
for (const o of ORDERS) console.log(`  ${o}: ${evalShift[o].toFixed(4)} ULP`);

// cross-ordering spreads
const g6pf = ORDERS.map((o) => byOrder[o].nbhd.find((x) => x.grade === 6).passFraction);
const g5pf = ORDERS.map((o) => byOrder[o].nbhd.find((x) => x.grade === 5).passFraction);
const ceilAll = ORDERS.map((o) => Math.max(...byOrder[o].nbhd.map((x) => x.maxUlp)));
const floorAll = ORDERS.map((o) => Math.min(...byOrder[o].nbhd.map((x) => x.minUlp)));
const anchor6 = ORDERS.map((o) => byOrder[o].nbhd.find((x) => x.grade === 6).anchorUlp);
console.log('\n=== cross-ordering spreads ===');
console.log(`  grade6 passFrac range: [${(Math.min(...g6pf) * 100).toFixed(1)}, ${(Math.max(...g6pf) * 100).toFixed(1)}]%`);
console.log(`  grade5 passFrac range: [${(Math.min(...g5pf) * 100).toFixed(1)}, ${(Math.max(...g5pf) * 100).toFixed(1)}]%`);
console.log(`  band ceiling range: [${Math.min(...ceilAll).toFixed(3)}, ${Math.max(...ceilAll).toFixed(3)}] ULP`);
console.log(`  band floor range:   [${Math.min(...floorAll).toFixed(3)}, ${Math.max(...floorAll).toFixed(3)}] ULP`);
console.log(`  grade6/171p anchor ULP range: [${Math.min(...anchor6).toFixed(3)}, ${Math.max(...anchor6).toFixed(3)}] (bar=1.0)`);
console.log(`  anchor passes under: ${ORDERS.filter((o, i) => anchor6[i] < BAR).join(',') || 'NONE'}`);
console.log(`  max eval-order shift over all orderings: ${Math.max(...ORDERS.map((o) => evalShift[o])).toFixed(4)} ULP`);
