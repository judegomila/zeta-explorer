// imp-36103 offline: measure N-stability of the imp-36061 accumulator recovery edges.
// Recompute r_base and the alpha/beta 10%/1% recovery edges at N=1e5, N~488602, N=1e6.

const U_ROUNDOFF = 2 ** -53;
const ALPHA_BASE = 0.6180339887498949;
const BETA_BASE = 2.3999632297286533;
const TWO_PI = 2 * Math.PI;

function ratioAt(alpha, beta, N) {
  let s = 0;
  let sumAbs = 0;
  let maxPartial = 0;
  for (let k = 1; k <= N; k++) {
    const t = Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);
    s += t;
    sumAbs += Math.abs(t);
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
  }
  return maxPartial / sumAbs;
}

function locateEdge(f, target, xHi) {
  let lo = 0;
  let hi = xHi;
  for (let i = 0; i < 40; i++) {
    const mid = 0.5 * (lo + hi);
    if (f(mid) <= target) hi = mid;
    else lo = mid;
  }
  return 0.5 * (lo + hi);
}

const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(3e12);

const RUNGS = [1e5, N_AT_TPT, 1e6];

for (const N of RUNGS) {
  const rBase = ratioAt(ALPHA_BASE, BETA_BASE, N);
  const rec10 = 1.1 * rBase;
  const rec1 = 1.01 * rBase;
  const alphaFn = (delta) => ratioAt(TWO_PI + delta, 0, N);
  const betaFn = (beta) => ratioAt(TWO_PI, beta, N);
  const alphaEdge10 = locateEdge(alphaFn, rec10, 1.0);
  const alphaEdge1 = locateEdge(alphaFn, rec1, 1.0);
  const betaEdge10 = locateEdge(betaFn, rec10, 4.0);
  const betaEdge1 = locateEdge(betaFn, rec1, 4.0);
  const alphaHiRatio = alphaFn(1.0);
  const betaHiRatio = betaFn(4.0);
  console.log(JSON.stringify({
    N,
    rBase,
    alphaEdge10, alphaEdge1,
    betaEdge10, betaEdge1,
    alphaHiRatio, betaHiRatio,
  }));
}
