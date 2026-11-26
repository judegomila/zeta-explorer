#!/usr/bin/env node
// imp-2440: stress-test the imp-2427 Weil-positivity margin toward lambda_min -> 0.
//
// CONTEXT
// -------
//   imp-2427 found the Riemann-Weil quadratic form PSD on a 6-dim even bump-pair
//   basis (diagonal-normalised lambda_min = +2.4e-5). A 6-dim PSD check is thin.
//   This script pushes the same explicit-formula machinery along three axes and
//   tracks lambda_min:
//     (a) DIMENSION   -- pack K = 6..16 even bump pairs into a FIXED support
//                        window (denser centers) to sample a selected finite
//                        bump family at constant support;
//     (b) SUPPORT     -- fix K=8 and widen the support window (max center grows);
//     (c) PARITY      -- add an ODD bump-pair block (sine transforms) and track
//                        its own lambda_min.
//   Under RH every such Gram matrix is PSD; a stable strictly-positive lambda_min
//   across a richer basis is stronger evidence, while a drift toward 0 localises
//   the hardest test direction.
//
//   EXPLICIT FORMULA (same as imp-2427):
//       sum_rho h(gamma) = h(i/2)+h(-i/2)
//                        + (1/2pi) int h(r)[Re psi(1/4+ir/2) - log pi] dr
//                        - 2 sum_{n>=2} Lambda(n) n^{-1/2} g(log n),
//   with F_k(r) the (cosine, even / sine, odd) transform of bump pair f_k and
//   h_{ij}(r) = F_i(r) F_j(r). The Gram entry is
//       W_{ij} = 2 F_i(i/2)F_j(i/2) + (1/pi) int_0^inf F_iF_j Phi_inf dr
//                + (1/pi) int_0^inf F_iF_j D(r) dr,
//   where D(r) = -2 sum_n Lambda(n) n^{-1/2} cos(r log n) is the PRIME KERNEL.
//   Folding the prime sum into D(r) (computed once on the r-grid, independent of
//   the basis) replaces imp-2427's per-prime O(K^2 * nPrimes * grid) cost by a
//   single O(K^2 * grid) assembly -- which is what makes the sweep tractable.
//   The prime sum truncates EXACTLY at n > exp(2*Lspan) because g_{ij}=f_i (conv)
//   f_j is supported on |x| <= 2*Lspan (Lspan = bump radius + max center).
//
//   CORRECTION 2026-11-01: for odd real f, put H=int f exp(-x/2) dx.
//   S(i/2)=-iH, S(-i/2)=iH, so h=S_i*S_j has pole term -2H_iH_j.
//   The historical +2HH^T odd block had an extra +4HH^T and is invalidated.
//   The even convention remains +2HH^T. These floating matrices have no rigorous
//   quadrature / transform-tail / rounding enclosure; a negative computed
//   eigenvalue alone is not a negative actual Weil vector or an RH counterexample.
//
//   NUMERICAL EVIDENCE ONLY. Not a proof of RH.
//
// OUTPUT: JSON summary to stdout.

import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import { weilPoleBlock, symmetricEigenDiagnostics, summarizeWeilRows } from '../src/math/weil-pick-safety.mjs';

const LOG_PI = Math.log(Math.PI);

// ---- complex digamma psi(z) (recurrence + asymptotic), z = zr + i zi ----
function digamma(zr, zi) {
  let re = 0, im = 0;
  while (zr < 12) {
    const den = zr * zr + zi * zi;
    re -= zr / den;
    im -= -zi / den;
    zr += 1;
  }
  const modsq = zr * zr + zi * zi;
  re += 0.5 * Math.log(modsq);
  im += Math.atan2(zi, zr);
  re -= 0.5 * zr / modsq;
  im -= 0.5 * (-zi) / modsq;
  const invr = zr / modsq, invi = -zi / modsq;
  let wr = invr * invr - invi * invi;
  let wi = 2 * invr * invi;
  const B = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66];
  let pr = wr, pi = wi;
  for (let k = 0; k < B.length; k++) {
    const c = B[k] / (2 * (k + 1));
    re -= c * pr;
    im -= c * pi;
    const npr = pr * wr - pi * wi;
    const npi = pr * wi + pi * wr;
    pr = npr; pi = npi;
  }
  return { re, im };
}

// archimedean density Phi_inf(r) = Re psi(1/4 + i r/2) - log pi
function phiInf(r) {
  return digamma(0.25, r / 2).re - LOG_PI;
}

// von Mangoldt prime data: pairs [logn, Lambda(n)/sqrt(n)] for n up to nMax
function primePowerData(nMax) {
  const isComposite = new Uint8Array(nMax + 1);
  const out = [];
  for (let p = 2; p <= nMax; p++) {
    if (isComposite[p]) continue;
    for (let m = 2 * p; m <= nMax; m += p) isComposite[m] = 1;
    const logp = Math.log(p);
    let n = p;
    while (n <= nMax) {
      out.push([Math.log(n), logp / Math.sqrt(n)]);
      n *= p;
    }
  }
  return out;
}

// ---- Simpson quadrature nodes on r in [0, R] ----
function rGrid(R, M) {
  const h = R / M;
  const r = new Float64Array(M + 1);
  const w = new Float64Array(M + 1);
  for (let i = 0; i <= M; i++) {
    r[i] = i * h;
    w[i] = (i === 0 || i === M) ? 1 : (i % 2 === 1 ? 4 : 2);
  }
  return { h, r, w, scale: h / 3 };
}

// Finite residual-checked floating eigensolver; not an interval certificate.
function jacobiEig(Ain) {
  const result = symmetricEigenDiagnostics(Ain);
  if (result.status !== 'diagnostic') throw new RangeError(result.reason);
  return result;
}

// ---- bump pairs: smooth b(x)=exp(-1/(1-(x/L)^2)) on (-L,L) ----
// even: f_k(x) = b(x-c_k) + b(x+c_k);  odd: f_k(x) = b(x-c_k) - b(x+c_k).
function makeBasis(L, centers, parity) {
  const bump = (x) => {
    if (x <= -L || x >= L) return 0;
    const t = x / L;
    return Math.exp(-1 / (1 - t * t));
  };
  const sgn = parity === 'odd' ? -1 : 1;
  return centers.map((c) => (x) => bump(x - c) + sgn * bump(x + c));
}

// F_k(r) = int f_k(x) trig(r x) dx (cos for even, sin for odd); half = int f e^{-x/2}.
function makeF(fk, xHalfSpan, MX, parity) {
  const hx = (2 * xHalfSpan) / MX;
  const xs = new Float64Array(MX + 1);
  const wq = new Float64Array(MX + 1);
  const fv = new Float64Array(MX + 1);
  for (let i = 0; i <= MX; i++) {
    xs[i] = -xHalfSpan + i * hx;
    wq[i] = (i === 0 || i === MX) ? 1 : (i % 2 === 1 ? 4 : 2);
    fv[i] = fk(xs[i]);
  }
  const sc = hx / 3;
  const trig = parity === 'odd' ? Math.sin : Math.cos;
  const Fr = (r) => {
    let acc = 0;
    for (let i = 0; i <= MX; i++) acc += wq[i] * fv[i] * trig(r * xs[i]);
    return acc * sc;
  };
  let half = 0;
  for (let i = 0; i <= MX; i++) half += wq[i] * fv[i] * Math.exp(-0.5 * xs[i]);
  half *= sc;
  return { Fr, half };
}

// linspace including endpoints; for odd basis drop the 0 center (b(x)-b(x)=0).
function centersFor(maxCenter, K, parity) {
  if (parity === 'odd') {
    const out = [];
    for (let i = 1; i <= K; i++) out.push((maxCenter * i) / K);
    return out;
  }
  const out = [];
  for (let i = 0; i < K; i++) out.push(K === 1 ? 0 : (maxCenter * i) / (K - 1));
  return out;
}

// prime kernel D(r) = -2 sum_n Lambda(n) n^{-1/2} cos(r log n), on the r-grid.
function primeKernel(rG, primes) {
  const D = new Float64Array(rG.length);
  for (let p = 0; p < primes.length; p++) {
    const ln = primes[p][0], coef = primes[p][1];
    for (let k = 0; k < rG.length; k++) D[k] += coef * Math.cos(rG[k] * ln);
  }
  for (let k = 0; k < rG.length; k++) D[k] *= -2;
  return D;
}

// assemble the Weil Gram matrix for one single-parity basis and return its
// eigenvalues plus the diagonal-normalized (correlation) spectrum.
function assembleGram(L, maxCenter, K, parity, gridG, phiTab, Dcache) {
  const centers = centersFor(maxCenter, K, parity);
  const basis = makeBasis(L, centers, parity);
  const xHalfSpan = L + Math.max(...centers) + 0.5;
  const Fs = basis.map((fk) => makeF(fk, xHalfSpan, 6000, parity));
  const { w: wG, scale: scG, r: rG } = gridG;

  // prime kernel depends only on support (=> nMax); cache by nMax key.
  const nMax = Math.min(2000000, Math.ceil(Math.exp(2 * xHalfSpan)) + 5);
  let entry = Dcache.get(nMax);
  if (!entry) {
    const primes = primePowerData(nMax);
    entry = { D: primeKernel(rG, primes), nPrimes: primes.length };
    Dcache.set(nMax, entry);
  }
  const D = entry.D;

  const Fgrid = Fs.map(({ Fr }) => {
    const arr = new Float64Array(rG.length);
    for (let i = 0; i < rG.length; i++) arr[i] = Fr(rG[i]);
    return arr;
  });
  const Fhalf = Fs.map(({ half }) => half);
  const poleBlock = weilPoleBlock(Fhalf, parity);

  const W = Array.from({ length: K }, () => new Float64Array(K));
  for (let i = 0; i < K; i++) {
    for (let j = i; j < K; j++) {
      const Fi = Fgrid[i], Fj = Fgrid[j];
      let archAcc = 0, primeAcc = 0;
      for (let k = 0; k < rG.length; k++) {
        const pij = Fi[k] * Fj[k];
        archAcc += wG[k] * pij * phiTab[k];
        primeAcc += wG[k] * pij * D[k];
      }
      const arch = (archAcc * scG) / Math.PI;
      const prime = (primeAcc * scG) / Math.PI;
      const pole = poleBlock[i][j];
      W[i][j] = W[j][i] = pole + arch + prime;
    }
  }
  const diagW = jacobiEig(W);
  const eigW = diagW.eigenpairs;

  // Diagonal congruence preserves inertia in exact arithmetic for nonzero scales.
  // This floating normalization does not separate true indefiniteness from error.
  const C = Array.from({ length: K }, () => new Float64Array(K));
  for (let i = 0; i < K; i++)
    for (let j = 0; j < K; j++)
      C[i][j] = W[i][j] / Math.sqrt(Math.abs(W[i][i]) * Math.abs(W[j][j]));
  const diagC = jacobiEig(C);
  const eigC = diagC.eigenpairs;

  // dominant components of the C min-eigvec => which centers stress positivity.
  const sv = eigC[0].vec;
  const stress = centers
    .map((c, idx) => ({ center: Number(c.toFixed(3)), weight: Number(sv[idx].toFixed(4)) }))
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 3);

  return {
    status: 'diagnostic',
    certified: false,
    eigenResidualW: diagW.relativeResidual,
    eigenResidualC: diagC.relativeResidual,
    quadratureAndTailEnclosed: false,
    K,
    parity,
    maxCenter: Number(maxCenter.toFixed(3)),
    bumpRadiusL: L,
    nMax,
    nPrimes: entry.nPrimes,
    lambdaMinW: Number(eigW[0].value.toExponential(4)),
    lambdaMinC: Number(eigC[0].value.toExponential(4)),
    lambdaMaxC: Number(eigC[K - 1].value.toExponential(4)),
    psdC: eigC[0].value > -1e-8,
    stressCenters: stress,
  };
}

// Catch individual block failures without silently discarding them.
function checkedGram(...args) {
  try { return assembleGram(...args); }
  catch (error) {
    return { status: 'invalid', certified: false, K: args[2], parity: args[3],
      reason: error.message, lambdaMinC: null, lambdaMinW: null, psdC: false };
  }
}

export function main() {
  const t0 = performance.now();
  const gridG = rGrid(120, 20000);
  const phiTab = new Float64Array(gridG.r.length);
  for (let i = 0; i < gridG.r.length; i++) phiTab[i] = phiInf(gridG.r[i]);
  const Dcache = new Map();

  // -------- calibration: reproduce imp-2427's 6-dim even basis --------
  // imp-2427 used L=1.6, centers [0,0.7,1.4,2.1,2.8,3.5] (maxCenter 3.5, K=6,
  // even spacing 0.7) and reported diagonal-normalized lambda_min = +2.4e-5.
  const calib = checkedGram(1.6, 3.5, 6, 'even', gridG, phiTab, Dcache);

  // -------- (a) DIMENSION sweep: fixed support, K = 6..16 --------
  const dimension = [];
  for (const K of [6, 8, 10, 12, 14, 16]) {
    dimension.push(checkedGram(1.6, 3.5, K, 'even', gridG, phiTab, Dcache));
  }

  // -------- (b) SUPPORT sweep: fixed K=8, widen max center --------
  const support = [];
  for (const mc of [2.1, 3.5, 4.9]) {
    support.push(checkedGram(1.6, mc, 8, 'even', gridG, phiTab, Dcache));
  }

  // -------- (c) PARITY: odd bump-pair block, K = 6..12 --------
  const odd = [];
  for (const K of [6, 8, 10, 12]) {
    odd.push(checkedGram(1.6, 3.5, K, 'odd', gridG, phiTab, Dcache));
  }

  // -------- finite-sample diagnostics; no continuum floor claim --------
  const dimMins = dimension.map((r) => r.lambdaMinC);
  const oddMins = odd.map((r) => r.lambdaMinC);
  const evenSummary = summarizeWeilRows([calib, ...dimension, ...support]);
  const oddSummary = summarizeWeilRows(odd);
  const summary = summarizeWeilRows([calib, ...dimension, ...support, ...odd]);
  const allEvenPSD = evenSummary.allSampledAboveTolerance;
  const allOddPSD = oddSummary.allSampledAboveTolerance;
  const allPSD = summary.allSampledAboveTolerance;
  const minEverSeen = summary.status === 'diagnostic'
    ? Math.min(calib.lambdaMinC, ...dimMins, ...oddMins, ...support.map((r) => r.lambdaMinC)) : null;
  // Chosen heuristic comparison scale only; not a proved numerical error bound.
  const CONDITIONING_FLOOR = 1e-9;
  const oddSinksToFloor =
    oddSummary.status === 'diagnostic' && oddMins[oddMins.length - 1] < CONDITIONING_FLOOR && oddMins[oddMins.length - 1] < oddMins[0];
  // Compare only the observed finite minimum with the chosen heuristic scale.
  const finiteSampleMinimumExceedsHeuristicFloor = minEverSeen !== null && minEverSeen > CONDITIONING_FLOOR;

  const out = {
    ticket: 'imp-2440',
    parent: 'imp-2427',
    object:
      'Weil explicit-formula quadratic form on enriched compactly-supported test bases (dimension / support / parity sweeps), tracking lambda_min',
    method:
      'Prime sum folded into a precomputed prime kernel D(r) = -2 sum_n Lambda(n) n^{-1/2} cos(r log n); W_{ij}=paritySign*2H_iH_j+(1/pi)int F_iF_j (Phi_inf + D) dr; paritySign=+1 even, -1 odd. Diagonal-normalized (correlation) lambda_min reported as the indefiniteness proxy.',
    calibration: {
      note: 'reproduce imp-2427 6-dim even basis (L=1.6, maxCenter 3.5); target diagonal-normalized lambda_min ~ +2.4e-5',
      lambdaMinC: calib.lambdaMinC,
      lambdaMinW: calib.lambdaMinW,
      status: calib.status,
      matchesImp2427: calib.status === 'diagnostic' && Math.abs(calib.lambdaMinC - 2.4e-5) < 1e-5,
    },
    dimensionSweep: {
      note: 'K even bump pairs packed into fixed support (maxCenter 3.5); denser centers sample a finite family at constant support; no completeness claim',
      rows: dimension,
      lambdaMinCByK: dimMins,
    },
    supportSweep: {
      note: 'fixed K=8, widen max center (and hence support / prime cutoff)',
      rows: support,
    },
    parityOddSweep: {
      note: 'corrected odd sine-product pole sign; floating diagnostic only, no certified PSD',
      rows: odd,
      lambdaMinCByK: oddMins,
    },
    verdict: {
      status: summary.status,
      allSampledAboveTolerance: allPSD,
      noNegativeEigenvalueAnywhere: null, // legacy literal claim withdrawn
      positivityTolerance: -1e-8,
      allEvenBlocksMeetTolerance: allEvenPSD,
      allOddBlocksMeetTolerance: allOddPSD,
      smallestLambdaMinCSeen: minEverSeen === null ? null : Number(minEverSeen.toExponential(4)),
      finiteSampleMinimumExceedsHeuristicFloor,
      oddFinalSampleBelowHeuristicFloorAndFirstSample: oddSinksToFloor,
      heuristicFloor: CONDITIONING_FLOOR,
      reading: summary.reading,
      namedSubGap: 'imp-2440-conditioning-floor',
      subGapDescription: 'Rigorous transform-tail, quadrature and eigenvalue enclosures remain absent. The conditioning floor is a heuristic, not a certified error or continuum lower bound.',
      caveat: 'Single-parity finite floating diagnostics only. Neither a positive nor negative numerical estimate settles the actual Weil form or RH.',
      historicalInvalidated: {
        oddMargins: '7e-10 -> 2e-12',
        priorClaim: 'every even and odd tested block is PSD',
        status: 'pre-correction-odd-output-invalidated',
        reason: 'The old odd pole term added +4HH^T. These old numbers are not corrected results; even convention retained but still not certified.',
      },
    },
    elapsedMs: Math.round(performance.now() - t0),
  };
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

// Importing this file for focused tests must not launch the expensive sweep.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();

