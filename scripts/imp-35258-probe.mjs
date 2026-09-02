import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// dd toolkit (verbatim from imp-35174)
function quickTwoSum(a, b) { const s = a + b; const e = b - (s - a); return [s, e]; }
function twoSum(a, b) { const s = a + b; const bb = s - a; const err = (a - (s - bb)) + (b - bb); return [s, err]; }
function split(a) { const c = 134217729 * a; const hi = c - (c - a); const lo = a - hi; return [hi, lo]; }
function twoProd(a, b) { const p = a * b; const [ah, al] = split(a); const [bh, bl] = split(b); const err = ((ah * bh - p) + ah * bl + al * bh) + al * bl; return [p, err]; }
function ddAdd(a, b) { let [s, e] = twoSum(a[0], b[0]); e += a[1] + b[1]; return quickTwoSum(s, e); }
function ddSub(a, b) { return ddAdd(a, [-b[0], -b[1]]); }
function ddMul(a, b) { let [p, e] = twoProd(a[0], b[0]); e += a[0] * b[1] + a[1] * b[0]; return quickTwoSum(p, e); }
function ddMulD(a, b) { let [p, e] = twoProd(a[0], b); e += a[1] * b; return quickTwoSum(p, e); }
function ddDivD(a, b) { const q1 = a[0] / b; const [p, pe] = twoProd(q1, b); const r = ddSub(a, [p, pe]); const q2 = r[0] / b; return quickTwoSum(q1, q2); }
function ddLog(x) { const y0 = Math.log(x[0]); const ey = Math.exp(y0); const q = ddDivD(x, ey); const corr = ddSub(q, [1, 0]); return ddAdd([y0, 0], corr); }

// Double residual of the RvM height-inverse certificate: f(m;N) = (m/2pi)(log(m/2pi)-1) - N
function fDouble(m, N) {
  const u = Math.log(m / TWO_PI);
  return (m / TWO_PI) * (u - 1) - N;
}
// dd residual, cancellation-free
function fDD(m, N) {
  const Th = ddDivD([m, 0], TWO_PI);
  const u = ddLog(Th);
  const um1 = ddSub(u, [1, 0]);
  const prod = ddMul(Th, um1);
  return ddSub(prod, [N, 0]);
}
function ulp(x) {
  // ulp of a positive double
  const e = Math.floor(Math.log2(Math.abs(x)));
  return Math.pow(2, e - 52);
}

// admissible seed band (imp-35241): centered N_cross ~ 3.2803e9, half-width rho ~1.7124e8
const N_CROSS = 3280294351.6524067;
const RHO = 1.7124e8;
const N_BOT = N_CROSS - RHO;
const N_TOP = N_CROSS + RHO;
const seeds = [N_BOT, N_CROSS - RHO/2, N_CROSS, N_CROSS + RHO/2, N_TOP, 1e9];
for (const N of seeds) {
  const m = effectiveHeightForN(N);       // double Newton root
  const fd = fDouble(m, N);
  const fdd = fDD(m, N);
  const fddVal = fdd[0] + fdd[1];
  const halfUlp = 0.5 * ulp(m);
  console.log(`N=${N.toExponential(6)}  m=T0=${m.toExponential(10)}`);
  console.log(`   f_double(m) = ${fd.toExponential(6)}`);
  console.log(`   f_dd(m)     = ${fddVal.toExponential(6)}   [hi=${fdd[0].toExponential(4)}, lo=${fdd[1].toExponential(4)}]`);
  console.log(`   0.5 ulp(m)  = ${halfUlp.toExponential(6)}   |f_dd|/halfUlp = ${(Math.abs(fddVal)/halfUlp).toExponential(4)}`);
  console.log(`   genuinely zero? ${fddVal === 0}   below double floor? ${Math.abs(fddVal) < halfUlp}`);
}
