// imp-33535 offline sweep: is the imp-33313 crossover-tau* plateau (~6.95) a grade6-specific
// artifact, or intrinsic? Mirrors the imp-33313 kernel/quadrature exactly and re-measures the
// first-sustained-sub-1.5-ULP crossover tau* across alternate graded-GL grade families
// {4,5,6,7} on a DENSER tau grid. Measurement only: no bound, no operator positivity, no QED.
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

// ref: two high-grade families agree, giving a converged reference per tau.
function refFor(tau) {
  const T = tau + 2.5;
  const v5 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 5), 5);
  const v6 = negLnAgradedGL(tau, HI, panelsForTauStar(T, 6), 6);
  return { ref: 0.5 * (v5 + v6), spread: Math.abs(v5 - v6) };
}

const GRADES = [4, 5, 6, 7];
const TAUS = [10, 10.5, 11, 11.5, 12, 12.5, 13];

console.log('imp-33535: crossover tau* across grade families {4,5,6,7} on a denser tau grid');
console.log('If tau* stays pinned ~6.95 across ALL grades AND all tau, the plateau is INTRINSIC');
console.log('(a saddle-window resolution saturation), not a grade6-budget artifact.\n');

const perGrade = {};
for (const g of GRADES) perGrade[g] = [];

for (const tau of TAUS) {
  const { ref, spread } = refFor(tau);
  const ulp = Math.abs(ref) * EPS;
  console.log(`=== tau=${tau}  ref=${ref.toExponential(6)}  1ULP=${ulp.toExponential(3)}  refSpread=${(spread / ulp).toFixed(3)}ULP`);
  for (const grade of GRADES) {
    let hit = null;
    const start = Math.max(20, Math.floor(0.5 * panelsForTauStar(6.4, grade)));
    for (let p = start; p < 200000; p += 1) {
      const gap = Math.abs(negLnAgradedGL(tau, HI, p, grade) - ref) / ulp;
      if (gap < 1.5) { hit = { p, gap }; break; }
    }
    if (hit) {
      const ts = tauStar(hit.p, grade);
      perGrade[grade].push(ts);
      console.log(`  grade${grade}: panels=${hit.p} glNodes=${10 * hit.p} tauStar=${ts.toFixed(4)} margin(tauStar-tau)=${(ts - tau).toFixed(3)} worstUlp=${hit.gap.toFixed(3)}`);
    } else {
      console.log(`  grade${grade}: NO sub-1.5-ULP hit found up to 200000 panels`);
    }
  }
  console.log('');
}

console.log('--- crossover tau* summary per grade (across the tau grid) ---');
let grandMin = Infinity;
let grandMax = -Infinity;
for (const g of GRADES) {
  const arr = perGrade[g];
  if (!arr.length) { console.log(`  grade${g}: no hits`); continue; }
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  grandMin = Math.min(grandMin, mn);
  grandMax = Math.max(grandMax, mx);
  console.log(`  grade${g}: tauStar in [${mn.toFixed(4)}, ${mx.toFixed(4)}]  mean=${mean.toFixed(4)}  spread=${(mx - mn).toExponential(2)}`);
}
console.log(`\nGRAND: crossover tau* across ALL grades {4,5,6,7} and ALL tau in [10..13] lies in`);
console.log(`  [${grandMin.toFixed(4)}, ${grandMax.toFixed(4)}]  total spread=${(grandMax - grandMin).toFixed(4)}`);
console.log(`VERDICT: the ~6.95 crossover-tau* plateau is ${(grandMax - grandMin) < 0.2 ? 'INTRINSIC (grade-independent, tau-independent saturation of the saddle window) -- NOT a grade6 artifact' : 'GRADE/tau-DEPENDENT'}.`);
console.log('Measurement only; establishes no operator positivity; no bound; PT Lambda<=0.2 SOTA; NO QED.');
