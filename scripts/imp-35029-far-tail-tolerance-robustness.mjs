// imp-35029 -- Robustness of the imp-34948 far-tail exponents / band under
// tightened bisection tolerance and finer central-difference step.
//
// MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate, IEEE-754 double.
// Re-runs the imp-34933/imp-34948 inflection + half-N locators on the far-tail
// rungs 1e14..1e18 at (a) more bisection iterations and (b) several central-
// difference step sizes h, and reports whether the -2.013 (sigmoid) / -1.949
// (ramp) decay exponents and the still-rising offsetN*(t-1)^2 band survive.
// Changes no bound; no QED.
import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function sigmaNoFlow(N, eTrunc) {
  const E = eColl(N);
  return E / (eTrunc + E);
}
// finite-difference operators in t = ln N, step h configurable
function d2SigmaDt2(N, eTrunc, h) {
  const t = Math.log(N);
  const f = (tt) => sigmaNoFlow(Math.exp(tt), eTrunc);
  return (f(t + h) - 2 * f(t) + f(t - h)) / (h * h);
}
// inner first-difference (log-slope), step hp; imp-34948 fixed hp = 1e-3
function localExponentP(N, eTrunc, hp) {
  const t = Math.log(N);
  const ls = (tt) => Math.log(sigmaNoFlow(Math.exp(tt), eTrunc));
  return -((ls(t + hp) - ls(t - hp)) / (2 * hp));
}
// outer second-difference of the log-slope, step hpp; imp-34948 fixed hpp = 2e-3
function d2PDt2(N, eTrunc, hpp, hp) {
  const t = Math.log(N);
  return (
    (localExponentP(Math.exp(t + hpp), eTrunc, hp) -
      2 * localExponentP(Math.exp(t), eTrunc, hp) +
      localExponentP(Math.exp(t - hpp), eTrunc, hp)) /
    (hpp * hpp)
  );
}
function findHalfN(eTrunc, iters) {
  let lo = Math.log(1e2), hi = Math.log(1e20);
  for (let i = 0; i < iters; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaNoFlow(Math.exp(mid), eTrunc) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
function findInflectionN(diag, center, iters) {
  let lo = Math.log(center / 1e3), hi = Math.log(center * 1e3);
  let flo = diag(Math.exp(lo));
  for (let i = 0; i < iters; i++) {
    const mid = (lo + hi) / 2;
    const fm = diag(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) { lo = mid; flo = fm; }
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}

const TARGET_SCALES = [1e14, 1e15, 1e16, 1e17, 1e18];

function runLadder(hSig, hpp, hp, iters) {
  const ladder = TARGET_SCALES.map((target) => {
    const eTrunc = eColl(target);
    const nHalf = findHalfN(eTrunc, iters);
    const t = Math.log(nHalf);
    const nInflSig = findInflectionN((N) => d2SigmaDt2(N, eTrunc, hSig), nHalf, iters);
    const nInflRamp = findInflectionN((N) => d2PDt2(N, eTrunc, hpp, hp), nHalf, iters);
    const oSig = nInflSig / nHalf - 1;
    const oRamp = nInflRamp / nHalf - 1;
    return { t, oSig, oRamp, prodSig: oSig * (t - 1) ** 2, prodRamp: oRamp * (t - 1) ** 2 };
  });
  const LO = ladder[0], HI = ladder[ladder.length - 1];
  const expSig = Math.log(HI.oSig / LO.oSig) / Math.log(HI.t / LO.t);
  const expRamp = Math.log(HI.oRamp / LO.oRamp) / Math.log(HI.t / LO.t);
  const prodSig = ladder.map((r) => r.prodSig);
  const prodRamp = ladder.map((r) => r.prodRamp);
  return {
    expSig, expRamp,
    driftSig: Math.max(...prodSig) / Math.min(...prodSig),
    driftRamp: Math.max(...prodRamp) / Math.min(...prodRamp),
    prodSigLo: Math.min(...prodSig), prodSigHi: Math.max(...prodSig),
    prodRampLo: Math.min(...prodRamp), prodRampHi: Math.max(...prodRamp),
  };
}

// imp-34948 baseline: hSig=1e-3 (sigmoid FD), hpp=2e-3 (ramp outer), hp=1e-3
// (ramp inner), 200 bisection iters. Probe both step directions + a tighter
// bisection (400 iters) to separate genuine asymptotics from FD/tolerance floor.
const CASES = [
  { label: 'baseline hSig=1e-3 hpp=2e-3 hp=1e-3 iters=200', hSig: 1e-3, hpp: 2e-3, hp: 1e-3, iters: 200 },
  { label: 'tighter-bisect same-steps        iters=400', hSig: 1e-3, hpp: 2e-3, hp: 1e-3, iters: 400 },
  { label: 'finer   hSig=5e-4 hpp=1e-3 hp=5e-4 iters=200', hSig: 5e-4, hpp: 1e-3, hp: 5e-4, iters: 200 },
  { label: 'finer   hSig=2e-4 hpp=4e-4 hp=2e-4 iters=300', hSig: 2e-4, hpp: 4e-4, hp: 2e-4, iters: 300 },
  { label: 'coarser hSig=2e-3 hpp=4e-3 hp=2e-3 iters=200', hSig: 2e-3, hpp: 4e-3, hp: 2e-3, iters: 200 },
  { label: 'ramp-inner-only-finer hp=5e-4          iters=200', hSig: 1e-3, hpp: 2e-3, hp: 5e-4, iters: 200 },
];

console.log('imp-35029 far-tail tolerance/step robustness (rungs 1e14..1e18)\n');
const rows = CASES.map((c) => ({ ...c, ...runLadder(c.hSig, c.hpp, c.hp, c.iters) }));
for (const r of rows) {
  console.log(r.label);
  console.log(
    `  expSig=${r.expSig.toFixed(4)}  expRamp=${r.expRamp.toFixed(4)}` +
    `  driftSig=${r.driftSig.toFixed(4)}  driftRamp=${r.driftRamp.toFixed(4)}`);
  console.log(
    `  prodSig[${r.prodSigLo.toFixed(3)},${r.prodSigHi.toFixed(3)}]` +
    `  prodRamp[${r.prodRampLo.toFixed(3)},${r.prodRampHi.toFixed(3)}]`);
}

const expSigs = rows.map((r) => r.expSig);
const expRamps = rows.map((r) => r.expRamp);
const spread = (a) => Math.max(...a) - Math.min(...a);
console.log('\nAcross all step/tolerance cases:');
console.log(`  expSig spread  = ${spread(expSigs).toExponential(3)}  (min ${Math.min(...expSigs).toFixed(4)}, max ${Math.max(...expSigs).toFixed(4)})`);
console.log(`  expRamp spread = ${spread(expRamps).toExponential(3)}  (min ${Math.min(...expRamps).toFixed(4)}, max ${Math.max(...expRamps).toFixed(4)})`);
console.log(`  all expSig within 0.06 of -2 : ${expSigs.every((e) => Math.abs(e + 2) < 0.06)}`);
console.log(`  all expRamp in (-2.1,-1.9)   : ${expRamps.every((e) => e < -1.9 && e > -2.1)}`);
console.log(`  all driftSig < 1.03          : ${rows.every((r) => r.driftSig < 1.03)}`);
console.log(`  all prodSig above 8.1 band   : ${rows.every((r) => r.prodSigLo > 8.1)}`);
console.log(`  all prodRamp above 22.4 band : ${rows.every((r) => r.prodRampLo > 22.4)}`);
