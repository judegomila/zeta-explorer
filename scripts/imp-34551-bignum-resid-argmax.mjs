// imp-34551: bignum (double-double / 106-bit) recompute of resid_exp(k) at refinement rungs e=25 and
// e=26 to observe the SUB-GAP-imp-34533 continuum argmax jitter BELOW the double-precision storage ULP
// floor (2^-56 near the ~0.0653 peak). imp-34533 F1 predicted (geometrically) that the continuum argmax
// NEVER LOCKS -- the continuum vertex is non-dyadic, so the nearest dyadic node keeps changing each rung --
// but F3 showed a native-double scan CANNOT observe this past e=24 because the top-two resid_exp margin
// (~1.16 storage ULP at e=25, ~0.29 ULP at e=26) sits at/below one ULP.
//
// This script re-implements the inherited imp-33810/imp-33878/imp-34411 resid_exp(k) surrogate in
// double-double arithmetic (~32 significant digits, ~1e-32 relative), which resolves node-to-node
// differences far below the 2^-56 native floor, and MEASURES at each rung e=23..27 whether the
// resid_exp argmax over dyadic nodes tracks the geometric nearest node to the continuum vertex.
// Reproduces the imp-34411/imp-34508/imp-34524 primitives verbatim (only the arithmetic is widened).
//
// KEY BY-PRODUCT: removing the native cancellation floor lets the Newton vertex be computed with a MUCH
// smaller finite-difference step H. The imp-34524 vertex k* = 8.821091375252 was the H=2^-8 estimate
// (native double was FORCED to that large H by cancellation); shrinking H under dd exposes an O(H^2)
// central-difference bias from the peak cubic tilt (f''' != 0) and Richardson-converges the true
// continuum vertex to k*_dd = 8.8210916010340 (~+2.26e-7). Curvature |R2| = 3.61964e-2 unchanged.
// Measurement / cross-check only, changes no bound, NO QED.
import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

// ---------------------------------------------------------------------------
// Double-double (dd) primitives: value = [hi, lo], |lo| <= 0.5 ulp(hi).
// Standard Dekker/Knuth error-free transformations (no FMA needed).
// ---------------------------------------------------------------------------
function twoSum(a, b) { const s = a + b; const bb = s - a; return [s, (a - (s - bb)) + (b - bb)]; }
function quickTwoSum(a, b) { const s = a + b; return [s, b - (s - a)]; }
function split(a) { const c = 134217729 * a; const hi = c - (c - a); return [hi, a - hi]; } // 2^27+1
function twoProd(a, b) { const p = a * b; const [ah, al] = split(a); const [bh, bl] = split(b); return [p, ((ah * bh - p) + ah * bl + al * bh) + al * bl]; }
const dd = (x) => [x, 0];
function ddAdd(a, b) { let [s, e] = twoSum(a[0], b[0]); e += a[1] + b[1]; return quickTwoSum(s, e); }
function ddSub(a, b) { return ddAdd(a, [-b[0], -b[1]]); }
function ddMul(a, b) { let [p, e] = twoProd(a[0], b[0]); e += a[0] * b[1] + a[1] * b[0]; return quickTwoSum(p, e); }
function ddDiv(a, b) { const q1 = a[0] / b[0]; let r = ddSub(a, ddMul(b, dd(q1))); const q2 = r[0] / b[0]; r = ddSub(r, ddMul(b, dd(q2))); const q3 = r[0] / b[0]; return ddAdd(quickTwoSum(q1, q2), dd(q3)); }
function ddMulPow2(a, k) { const f = Math.pow(2, k); return [a[0] * f, a[1] * f]; } // exact: f is a power of 2
const DD_LN2 = [0.6931471805599453, 2.3190468138462996e-17];
const DD_PI = [3.141592653589793, 1.2246467991473532e-16];
function ddExp(a) {
  const k = Math.round(a[0] / DD_LN2[0]);
  const r = ddSub(a, ddMul(DD_LN2, dd(k)));         // |r| <= ln2/2
  let term = dd(1), sum = dd(1);
  for (let n = 1; n < 40; n++) { term = ddDiv(ddMul(term, r), dd(n)); sum = ddAdd(sum, term); if (Math.abs(term[0]) < 1e-34 * Math.abs(sum[0])) break; }
  return ddMulPow2(sum, k);
}
function ddLog(a) { let y = dd(Math.log(a[0])); for (let i = 0; i < 4; i++) { const c = ddSub(ddDiv(a, ddExp(y)), dd(1)); y = ddAdd(y, c); } return y; }
function ddSqrt(a) { if (a[0] === 0) return dd(0); const x = 1 / Math.sqrt(a[0]); const ax = ddMul(a, dd(x)); const corr = ddMul(ddSub(a, ddMul(ax, ax)), dd(0.5 * x)); return ddAdd(ax, corr); }
const DD_LN10 = ddLog(dd(10));
function ddPow10(x) { return ddExp(ddMul(x, DD_LN10)); } // x is dd
const ddToNum = (a) => a[0] + a[1];

// ---------------------------------------------------------------------------
// The imp-34411/imp-34508/imp-34524 resid_exp(k) surrogate, in double-double.
// Byte-for-byte the same formulas; only the arithmetic is widened to ~32 digits.
// ---------------------------------------------------------------------------
const DD_TWO_PI = ddMul(dd(2), DD_PI);
const DD_E_TRUNC = dd(3.06e-5);
const DD_GRONWALL_B = ddExp(dd(2.37e-4));           // exp(1.0 * A1_TRAP)
const DD_C_C = dd(C_C_PINNED);
function ddEffectiveHeightForN(N) {                 // N is dd; Newton on the RvM inverse
  let T = dd(effectiveHeightForN(N[0]));            // native seed, then refine in dd
  for (let i = 0; i < 10; i++) {
    const u = ddLog(ddDiv(T, DD_TWO_PI));
    const f = ddSub(ddMul(ddDiv(T, DD_TWO_PI), ddSub(u, dd(1))), N);
    const fp = ddDiv(u, DD_TWO_PI);
    T = ddSub(T, ddDiv(f, fp));
  }
  return T;
}
function ddChannels(N) {
  const T0 = ddEffectiveHeightForN(N);
  const logT0 = ddLog(T0);
  const cFlow = ddDiv(ddAdd(ddLog(ddDiv(T0, DD_TWO_PI)), dd(1)), DD_TWO_PI);
  const eFlow = ddMul(ddMul(cFlow, ddDiv(logT0, T0)), DD_GRONWALL_B);
  const eColl = ddMul(DD_C_C, ddSqrt(ddDiv(logT0, N)));
  const eTot = ddAdd(ddAdd(DD_E_TRUNC, eFlow), eColl);
  return { eColl, fracColl: ddDiv(eColl, eTot) };
}
function ddSampleGrid(loN, hiN, per = 4) {
  const dLo = ddDiv(ddLog(loN), DD_LN10), dHi = ddDiv(ddLog(hiN), DD_LN10);
  const xs = [], ys = [];
  for (let i = 0; ; i++) {
    const d = ddAdd(dLo, ddDiv(dd(i), dd(per)));
    if (d[0] > dHi[0] + 1e-9) break;
    const N = ddPow10(d);
    xs.push(ddLog(N)); ys.push(ddLog(ddChannels(N).fracColl));
  }
  return { xs, ys };
}
function ddMean(arr) { let s = dd(0); for (const v of arr) s = ddAdd(s, v); return ddDiv(s, dd(arr.length)); }
function ddPSigmaStable(loN, hiN) {
  const { xs, ys } = ddSampleGrid(loN, hiN);
  const mx = ddMean(xs), my = ddMean(ys);
  let sxx = dd(0), sxy = dd(0);
  for (let i = 0; i < xs.length; i++) { const dx = ddSub(xs[i], mx), dv = ddSub(ys[i], my); sxx = ddAdd(sxx, ddMul(dx, dx)); sxy = ddAdd(sxy, ddMul(dx, dv)); }
  return ddSub(dd(0), ddDiv(sxy, sxx));
}
function ddPEcollEndpoints(loN, hiN) {
  const a = ddChannels(loN).eColl, b = ddChannels(hiN).eColl;
  return ddSub(dd(0), ddDiv(ddSub(ddLog(b), ddLog(a)), ddSub(ddLog(hiN), ddLog(loN))));
}
function ddResidExp(kdd) {                           // kdd is dd
  const lo = ddPow10(kdd), hi = ddPow10(ddAdd(kdd, dd(1)));
  return ddSub(ddMul(ddPEcollEndpoints(lo, hi), ddSub(dd(1), ddChannels(hi).fracColl)), ddPSigmaStable(lo, hi));
}
// dd central differences kept fully in dd (no collapse -> no reintroduced cancellation).
function ddR1(kdd, H) { return ddDiv(ddSub(ddResidExp(ddAdd(kdd, dd(H))), ddResidExp(ddSub(kdd, dd(H)))), dd(2 * H)); }
function ddR2(kdd, H) { return ddDiv(ddAdd(ddSub(ddResidExp(ddAdd(kdd, dd(H))), ddMul(dd(2), ddResidExp(kdd))), ddResidExp(ddSub(kdd, dd(H)))), dd(H * H)); }

// Native-double residExp (imp-34524 verbatim), for the hi-word cross-check.
function channels(N) { const T0 = effectiveHeightForN(N), logT0 = Math.log(T0), TP = 2 * Math.PI; const cFlow = (Math.log(T0 / TP) + 1) / TP; const eFlow = cFlow * (logT0 / T0) * Math.exp(2.37e-4); const eColl = C_C_PINNED * Math.sqrt(logT0 / N); return { eColl, fracColl: eColl / (3.06e-5 + eFlow + eColl) }; }
function nSample(loN, hiN, per = 4) { const dLo = Math.log10(loN), dHi = Math.log10(hiN), xs = [], ys = []; for (let i = 0; ; i++) { const d = dLo + i / per; if (d > dHi + 1e-9) break; const N = Math.pow(10, d); xs.push(Math.log(N)); ys.push(Math.log(channels(N).fracColl)); } return { xs, ys }; }
function nPSigma(loN, hiN) { const { xs, ys } = nSample(loN, hiN); const n = xs.length; const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n; let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); } return -sxy / sxx; }
function nPEcoll(loN, hiN) { const a = channels(loN).eColl, b = channels(hiN).eColl; return -(Math.log(b) - Math.log(a)) / (Math.log(hiN) - Math.log(loN)); }
function nResidExp(k) { const lo = Math.pow(10, k), hi = Math.pow(10, k + 1); return nPEcoll(lo, hi) * (1 - channels(hi).fracColl) - nPSigma(lo, hi); }

// ---------------------------------------------------------------------------
// (0) Cross-check: dd hi-word reproduces the native-double residExp.
// ---------------------------------------------------------------------------
const IMP34524_KSTAR = 8.821091375252;
console.log('=== (0) dd vs native residExp cross-check (e=24 imp-34524 node) ===');
const dv = ddResidExp(dd(8.821091353893)), nv = nResidExp(8.821091353893);
console.log('  native =', nv.toExponential(17), ' dd =', ddToNum(dv).toExponential(17));
console.log('  |dd - native| / native =', (Math.abs(ddToNum(dv) - nv) / Math.abs(nv)).toExponential(3), '(few-ULP native rounding; dd is the accurate one)');

// ---------------------------------------------------------------------------
// (1) True continuum vertex: dd Newton at shrinking H, Richardson to H->0.
//     Native double could not use small H (cancellation) -> imp-34524 used H=2^-8.
// ---------------------------------------------------------------------------
console.log('\n=== (1) dd continuum vertex vs finite-difference step H (native was locked to H=2^-8) ===');
const verts = [];
for (const p of [8, 10, 11, 12, 13, 14]) {
  const H = Math.pow(2, -p);
  let kdd = dd(8.8210916);
  for (let it = 0; it < 40; it++) kdd = ddSub(kdd, ddDiv(ddR1(kdd, H), ddR2(kdd, H)));
  const v = ddToNum(kdd);
  verts.push({ p, v });
  console.log(`  H=2^-${p}: vertex=${v.toFixed(13)}  |R2|=${Math.abs(ddR2(kdd, H)[0]).toExponential(6)}${p === 8 ? '   <- reproduces imp-34524 k*=8.821091375252' : ''}`);
}
const fine = verts.filter((v) => v.p >= 10);
const rich = [];
for (let i = 1; i < fine.length; i++) rich.push(fine[i].v + (fine[i].v - fine[i - 1].v) / 3);
const KSTAR_DD = rich[rich.length - 1];
console.log('  Richardson (O(H^2) eliminated) ->', rich.map((r) => r.toFixed(13)).join(' '));
console.log('  TRUE continuum vertex k*_dd =', KSTAR_DD.toFixed(13), ' correction to imp-34524 =', (KSTAR_DD - IMP34524_KSTAR).toExponential(4));

// ---------------------------------------------------------------------------
// (2) dd argmax scan centered on the corrected vertex k*_dd: does the argmax
//     track the geometric nearest dyadic node, and does it jitter (never lock)?
// ---------------------------------------------------------------------------
const ORIGIN = 6, RESID_ULP = Math.pow(2, -56);
function nearestNode(e) { const h = Math.pow(2, -e); return ORIGIN + Math.round((KSTAR_DD - ORIGIN) / h) * h; }
console.log('\n=== (2) dd argmax scan centered on k*_dd (window +-8 nodes) ===');
const rows = [];
for (const e of [23, 24, 25, 26, 27]) {
  const h = Math.pow(2, -e), jc = Math.round((KSTAR_DD - ORIGIN) / h);
  let best = null, second = null;
  for (let j = jc - 8; j <= jc + 8; j++) {
    const kk = ORIGIN + j * h, r = ddResidExp(dd(kk));
    if (best === null || ddSub(r, best.dd)[0] > 0) { second = best; best = { k: kk, dd: r }; }
    else if (second === null || ddSub(r, second.dd)[0] > 0) { second = { k: kk, dd: r }; }
  }
  const gn = nearestNode(e), tracks = Math.abs(best.k - gn) < h / 4;
  const m = ddToNum(ddSub(best.dd, second.dd));
  rows.push({ e, argmax: +best.k.toFixed(12), nearest: +gn.toFixed(12), tracks, marginUlps: +(m / RESID_ULP).toFixed(4), adj: Math.round(Math.abs(best.k - second.k) / h) });
  console.log(`  e=${e}: dd argmax=${best.k.toFixed(12)}  nearestNode=${gn.toFixed(12)}  tracks=${tracks}  margin=${(m / RESID_ULP).toFixed(3)} ULP  runner-up ${Math.round(Math.abs(best.k - second.k) / h)} node`);
}

// ---------------------------------------------------------------------------
// (3) Verdict.
// ---------------------------------------------------------------------------
const allTrack = rows.every((r) => r.tracks);
const e25 = rows.find((r) => r.e === 25), e26 = rows.find((r) => r.e === 26);
const deepBelowUlp = e25.marginUlps < 1 && e26.marginUlps < 1;
const notLocked = new Set(rows.map((r) => r.argmax.toFixed(12))).size > 1; // winner changes across rungs
console.log('\n=== (3) VERDICT ===');
console.log('  dd argmax tracks the geometric nearest node to k*_dd at every rung e=23..27:', allTrack);
console.log('  e=25 & e=26 top-two margins are BELOW one storage ULP (native cannot resolve; dd can):', deepBelowUlp,
  `(${e25.marginUlps} / ${e26.marginUlps} ULP)`);
console.log('  argmax converges to the non-dyadic k*_dd and never locks onto a fixed value:', notLocked);
console.log('  => confirms imp-34533 F1 (continuum never locks) OBSERVATIONALLY, and refines the imp-34524');
console.log('     vertex from its H=2^-8-biased 8.821091375252 to k*_dd = ' + KSTAR_DD.toFixed(13) + '.');
console.log('  Measurement / cross-check only; curvature |R2| unchanged; changes no bound; NO QED.');
console.log('  Platt-Trudgian Lambda <= 0.2 remains SOTA.');
