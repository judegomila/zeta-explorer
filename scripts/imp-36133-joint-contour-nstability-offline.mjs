// imp-36133 offline: measure the N-STABILITY of the imp-36096 JOINT (alpha,beta)
// recovery-basin CONTOUR by re-tracing the lobed r<=1.10 r_base / r<=1.01 r_base
// first-crossing contours at N=1e6, reproducing the imp-36096 N~488602 contour first.
//
// imp-36096 traced the non-convex joint basin only at N~488602; imp-36103 checked
// N-stability of the SINGLE-axis edges only. This script re-runs the imp-36096
// ratioAt + first-crossing-scan + 32-step-bisection kernel bit-for-bit at both N and
// prints, for each target, the [beta, delta] contour pairs plus the normalized u+v
// bulge (maxSum) and cave (minSum) shape indicators, so the data module can bake them.

const ALPHA_BASE = 0.6180339887498949;
const BETA_BASE = 2.3999632297286533;
const TWO_PI = 2 * Math.PI;
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(3e12); // ~488602 (the imp-36096 fixed rung)

// imp-36096 running-accumulator ratio r = max_i|S_i| / Sum|t_k|, t_k = cos(alpha k + beta sqrt k)/sqrt k.
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

// Single-axis edge locator (imp-36061 / imp-36103 kernel: 40-step bisection from the resonance).
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

// First-crossing delta at fixed beta: coarse outward scan (step 0.01) brackets the first
// downcross of r(delta) to the target, then 32-step bisection inside the bracket (imp-36096
// method -- NOT a monotone bisection, because r(delta) has interior revivals).
function firstCrossingDelta(beta, target, N, deltaMax = 2.0, coarse = 0.01) {
  const f = (delta) => ratioAt(TWO_PI + delta, beta, N);
  let prev = 0;
  if (f(0) <= target) return 0; // beta-axis endpoint: zero detuning already recovers
  for (let d = coarse; d <= deltaMax + 1e-12; d += coarse) {
    if (f(d) <= target) {
      let lo = prev;
      let hi = d;
      for (let i = 0; i < 32; i++) {
        const mid = 0.5 * (lo + hi);
        if (f(mid) <= target) hi = mid;
        else lo = mid;
      }
      return 0.5 * (lo + hi);
    }
    prev = d;
  }
  return NaN;
}

function traceContour(N) {
  const rBase = ratioAt(ALPHA_BASE, BETA_BASE, N);
  const rec10 = 1.1 * rBase;
  const rec1 = 1.01 * rBase;
  const alphaFn = (delta) => ratioAt(TWO_PI + delta, 0, N);
  const betaFn = (beta) => ratioAt(TWO_PI, beta, N);
  const alphaEdge10 = locateEdge(alphaFn, rec10, 1.0);
  const alphaEdge1 = locateEdge(alphaFn, rec1, 1.0);
  const betaEdge10 = locateEdge(betaFn, rec10, 4.0);
  const betaEdge1 = locateEdge(betaFn, rec1, 4.0);

  function contour(target, betaEdge, alphaEdge) {
    const pairs = [];
    const normalized = [];
    for (let i = 0; i <= 8; i++) {
      const beta = (i / 8) * betaEdge;
      const delta = firstCrossingDelta(beta, target, N);
      pairs.push([beta, delta]);
      normalized.push({ u: delta / alphaEdge, v: beta / betaEdge, sum: delta / alphaEdge + beta / betaEdge });
    }
    // Interior (drop the two axis endpoints, fixed at u+v = 1 by construction).
    const interior = normalized.slice(1, normalized.length - 1);
    const maxSum = Math.max(...interior.map((p) => p.sum));
    const minSum = Math.min(...interior.map((p) => p.sum));
    return { pairs, normalized, maxSum, minSum };
  }

  const c10 = contour(rec10, betaEdge10, alphaEdge10);
  const c1 = contour(rec1, betaEdge1, alphaEdge1);
  return { N, rBase, alphaEdge10, alphaEdge1, betaEdge10, betaEdge1, c10, c1 };
}

for (const N of [N_AT_TPT, 1e6]) {
  const r = traceContour(N);
  console.log(JSON.stringify(r));
}
