// scripts/imp-36212-clustered-depth-75shape-offline.mjs
// imp-36212: densify the imp-36132 37-shape clustered-order slack-vs-depth fit to ~75
// pairing-tree shapes (depth 12..~4099) at fixed N ~ 488602 under the imp-35852 clustered
// same-sign term order, and MEASURE the OLS depth-scaling exponent + nominal 95% interval.
// Prints the numbers to bake into the data module. Measurement only; no bound; NO QED.

const T_PT = 3e12;
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT);
const EPS_DOUBLE = 2 ** -52;
const ALPHA = 0.6180339887498949;
const BETA = 2.3999632297286533;
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);
const LEAF = 128;

function sumTree(terms, splitter, leaf) {
  const n = terms.length;
  let maxDepth = 0;
  const stack = [{ lo: 0, hi: n, depth: 0, stage: 0, leftVal: 0, mid: 0 }];
  let result = 0;
  while (stack.length) {
    const f = stack[stack.length - 1];
    if (f.depth > maxDepth) maxDepth = f.depth;
    if (f.hi - f.lo <= leaf) {
      let a = 0;
      for (let i = f.lo; i < f.hi; i++) a += terms[i];
      result = a;
      stack.pop();
      continue;
    }
    if (f.stage === 0) {
      let mid = splitter(f.lo, f.hi, leaf);
      if (mid <= f.lo) mid = f.lo + 1;
      if (mid >= f.hi) mid = f.hi - 1;
      f.mid = mid;
      f.stage = 1;
      stack.push({ lo: f.lo, hi: mid, depth: f.depth + 1, stage: 0, leftVal: 0, mid: 0 });
    } else if (f.stage === 1) {
      f.leftVal = result;
      f.stage = 2;
      stack.push({ lo: f.mid, hi: f.hi, depth: f.depth + 1, stage: 0, leftVal: 0, mid: 0 });
    } else {
      result = f.leftVal + result;
      stack.pop();
    }
  }
  return { sum: result, maxDepth };
}

const FRAC_BITS = 96n;
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);
function doubleToFixedBigInt(x) {
  if (x === 0) return 0n;
  _dv.setFloat64(0, x);
  const hi = _dv.getUint32(0);
  const lo = _dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) exp = -1074;
  else { mant |= 1n << 52n; exp = exp - 1075; }
  const shift = BigInt(exp) + FRAC_BITS;
  let num = sign * mant;
  num = shift >= 0n ? num << shift : num >> -shift;
  return num;
}
function normalizedError(schemeResult, trueNum, sumAbs) {
  const err = doubleToFixedBigInt(schemeResult) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / 2 ** 96;
  return absErrDouble / sumAbs;
}

const _base = new Float64Array(N_AT_TPT);
let _sumAbs = 0;
for (let k = 1; k <= N_AT_TPT; k++) { const t = TERM(k); _base[k - 1] = t; _sumAbs += Math.abs(t); }
let _trueNum = 0n;
for (let i = 0; i < N_AT_TPT; i++) _trueNum += doubleToFixedBigInt(_base[i]);

const _neg = [], _pos = [];
for (let i = 0; i < N_AT_TPT; i++) { if (_base[i] < 0) _neg.push(_base[i]); else _pos.push(_base[i]); }
const CLUSTERED_TERMS = Float64Array.from(_neg.concat(_pos));

const skewSplit = (f) => (lo, hi) => lo + Math.floor((hi - lo) * f);
const catBlocksL = (m) => (lo, hi, leaf) => lo + m * leaf;
const catBlocksR = (m) => (lo, hi, leaf) => hi - m * leaf;

// 75-shape family: the imp-36081 37 shapes (SUPERSET so imp-36132 reconciles) + 38 more.
const SKEWS = [
  0.45, 0.4, 0.38, 0.35, 0.32, 0.3, 0.28, 0.25, 0.22, 0.2, 0.18, 0.15, 0.13, 0.12, 0.11,
  0.1, 0.09, 0.08, 0.07, 0.06, 0.055, 0.05, 0.045, 0.04, 0.035, 0.03, 0.028, 0.025, 0.022,
  0.02, 0.018, 0.015, 0.013, 0.012, 0.011, 0.01, 0.009, 0.008, 0.007, 0.006, 0.0055, 0.005,
  0.0045, 0.004, 0.0035, 0.003, 0.0025, 0.002,
];
const CATL = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 32, 48];
const CATR = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];
const TREE_SHAPES = [
  ['balanced(0.5)', (lo, hi) => (lo + hi) >> 1],
  ...SKEWS.map((f) => [`skew${f}`, skewSplit(f)]),
  ...CATL.map((m) => [`catL${m}`, catBlocksL(m)]),
  ...CATR.map((m) => [`catR${m}`, catBlocksR(m)]),
];

const POINTS = TREE_SHAPES.map(([name, splitter]) => {
  const { sum, maxDepth } = sumTree(CLUSTERED_TERMS, splitter, LEAF);
  const errClustered = normalizedError(sum, _trueNum, _sumAbs);
  const slackClustered = (maxDepth * EPS_DOUBLE) / errClustered;
  return { shape: name, treeDepth: maxDepth, errClustered, slackClustered,
    logDepth: Math.log10(maxDepth), logSlack: Math.log10(slackClustered) };
}).sort((a, b) => a.treeDepth - b.treeDepth);

function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = (sxy * sxy) / (sxx * syy);
  const rssFree = syy - slope * sxy;
  const seSlope = Math.sqrt((rssFree / (n - 2)) / sxx);
  return { slope, intercept, r2, n, mx, my, sxx, syy, rssFree, seSlope };
}
const XS = POINTS.map((p) => p.logDepth), YS = POINTS.map((p) => p.logSlack);
const FIT = ols(XS, YS);
const Z95 = 1.96;
const CI_LO = FIT.slope - Z95 * FIT.seSlope, CI_HI = FIT.slope + Z95 * FIT.seSlope;
function crss(m) { let r = 0; for (let i = 0; i < XS.length; i++) { const e = (YS[i] - FIT.my) - m * (XS[i] - FIT.mx); r += e * e; } return r; }
const RSS_FLAT = crss(0), RSS_SQRT = crss(0.5), RSS_LINEAR = crss(1);
const POINTS_NO_L = POINTS.filter((p) => p.shape !== 'catL1');
const NO_L_FIT = ols(POINTS_NO_L.map((p) => p.logDepth), POINTS_NO_L.map((p) => p.logSlack));
const FLOOR_SPREAD = Math.max(...POINTS.map((p) => p.errClustered)) / Math.min(...POINTS.map((p) => p.errClustered));

console.log('N_AT_TPT', N_AT_TPT);
console.log('n_shapes', POINTS.length);
console.log('depthRange', POINTS[0].treeDepth, POINTS[POINTS.length - 1].treeDepth);
console.log('exponent', FIT.slope.toFixed(6));
console.log('intercept', FIT.intercept.toFixed(6));
console.log('r2', FIT.r2.toFixed(6));
console.log('seSlope', FIT.seSlope.toFixed(6));
console.log('ci95', CI_LO.toFixed(6), CI_HI.toFixed(6), 'width', (CI_HI - CI_LO).toFixed(6));
console.log('exponent_no_catL1', NO_L_FIT.slope.toFixed(6), 'n', NO_L_FIT.n);
console.log('catL1_leverage', (NO_L_FIT.slope - FIT.slope).toFixed(6));
console.log('RSS free', FIT.rssFree.toFixed(4), 'flat', RSS_FLAT.toFixed(4), 'sqrt', RSS_SQRT.toFixed(4), 'linear', RSS_LINEAR.toFixed(4));
console.log('ratio flat', (RSS_FLAT / FIT.rssFree).toFixed(4), 'sqrt', (RSS_SQRT / FIT.rssFree).toFixed(4), 'linear', (RSS_LINEAR / FIT.rssFree).toFixed(4));
console.log('floorSpread', FLOOR_SPREAD.toExponential(3));
console.log('contains0.5', CI_LO < 0.5 && CI_HI > 0.5, 'excludes1', CI_HI < 1);
// The imp-36132 37-point exponent for the shift diagnostic.
console.log('--- shapes present (for superset check) ---');
console.log('has_all_36081_37', ['balanced(0.5)',
  ...[0.4,0.35,0.3,0.25,0.2,0.15,0.12,0.1,0.08,0.06,0.05,0.04,0.03,0.025,0.02,0.015,0.012,0.01,0.008,0.006,0.005,0.004,0.003,0.002].map((f)=>`skew${f}`),
  ...[1,2,3,4,6,8,12,16].map((m)=>`catL${m}`),
  ...[1,2,4,8].map((m)=>`catR${m}`)].every((nm)=>POINTS.some((p)=>p.shape===nm)));
