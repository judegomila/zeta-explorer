#!/usr/bin/env node
// imp-2427: numerically test positive-definiteness of the Weil explicit-formula
// quadratic form on a finite basis of compactly-supported test functions.
// (Wave-2 fan-out: Weil positivity, Path C / Route D crosswalk of imp-1236.)
//
// CONTEXT
// -------
//   Weil positivity is RH-equivalent: RH holds iff the Weil functional
//       W(h) = sum_rho h(gamma_rho)
//   is >= 0 for every test function h of positive type (h = |F|^2). By the
//   Riemann-Weil explicit formula the SAME functional is computable WITHOUT the
//   zeros, from archimedean + pole + prime data:
//       sum_rho h(gamma) =  h(i/2) + h(-i/2)                          [pole]
//                         + (1/2pi) integral h(r) [Re psi(1/4 + i r/2) - log pi] dr   [arch]
//                         - 2 sum_{n>=2} Lambda(n) n^{-1/2} g(log n),  [prime]
//   where g(x) = (1/2pi) integral h(r) e^{-i r x} dr and gamma_rho are the
//   imaginary parts of the nontrivial zeros (real iff RH).
//
//   On a finite basis {f_1,...,f_K} of real even compactly-supported functions,
//   take h_{ij}(r) = F_i(r) F_j(r) with F_k(r) = integral f_k(x) e^{i r x} dx
//   (real, even). The Weil GRAM MATRIX is
//       W_{ij} = pole_{ij} + arch_{ij} - prime_{ij},
//   and by the explicit formula W_{ij} = sum_rho F_i(gamma) F_j(gamma); when
//   every gamma is real this is a genuine Gram matrix of the vectors
//   (F_k(gamma))_gamma and is therefore positive semidefinite. So:
//       RH  ==>  lambda_min(W) >= 0   for every basis.
//   A negative smallest eigenvalue on any basis would DISPROVE RH; finding
//   lambda_min(W) >= 0 is consistent with (but does not prove) RH.
//
//   We separately report the "prime + archimedean part" W0 = W - pole. The
//   rank-1 pole term is itself positive; W0 is the indefinite remainder, so its
//   most-negative eigenvalue and eigenvector identify which test functions
//   STRESS positivity (i.e. where the prime sum most nearly overruns arch+pole).
//
//   VALIDATION: before touching the basis we calibrate the explicit-formula
//   implementation on a Gaussian h(r) = sigma*sqrt(2pi) e^{-sigma^2 r^2/2}, for
//   which the zero side 2*sum_{gamma>0} h(gamma) can be summed over the known
//   first nontrivial zeros and compared to the EF right-hand side. Agreement to
//   ~1e-3 certifies the arch + pole + prime assembly used for the Gram matrix.
//
//   NUMERICAL EVIDENCE ONLY. Not a proof of RH.
//
// OUTPUT: JSON summary to stdout.

import { performance } from 'node:perf_hooks';

// ---- first nontrivial zeta zeros (imaginary parts), for EF validation ----
const ZEROS = [
  14.134725142, 21.022039639, 25.010857580, 30.424876126, 32.935061588,
  37.586178159, 40.918719012, 43.327073281, 48.005150881, 49.773832478,
  52.970321478, 56.446247697, 59.347044003, 60.831778525, 65.112544048,
  67.079810529, 69.546401711, 72.067157674, 75.704690699, 77.144840069,
  79.337375020, 82.910380854, 84.735492981, 87.425274613, 88.809111208,
  92.491899271, 94.651344041, 95.870634228, 98.831194218, 101.317851006,
  103.725538040, 105.446623052, 107.168611184, 111.029535543, 111.874659177,
  114.320220915, 116.226680321, 118.790782866, 121.370125002, 122.946829294,
];

const LOG_PI = Math.log(Math.PI);

// ---- complex digamma psi(z), z = zr + i zi (recurrence + asymptotic) ----
function digamma(zr, zi) {
  let re = 0, im = 0;
  // shift up until real part is comfortably large
  while (zr < 12) {
    const den = zr * zr + zi * zi;
    re -= zr / den;   // subtract Re(1/z)
    im -= -zi / den;  // subtract Im(1/z) = -zi/den
    zr += 1;
  }
  // asymptotic: psi(z) ~ ln z - 1/(2z) - sum B_{2k}/(2k z^{2k})
  // ln z
  const modsq = zr * zr + zi * zi;
  re += 0.5 * Math.log(modsq);
  im += Math.atan2(zi, zr);
  // -1/(2z)
  re -= 0.5 * zr / modsq;
  im -= 0.5 * (-zi) / modsq;
  // Bernoulli terms via powers of 1/z^2
  // 1/z = (zr - i zi)/modsq
  const invr = zr / modsq, invi = -zi / modsq;
  // w = (1/z)^2
  let wr = invr * invr - invi * invi;
  let wi = 2 * invr * invi;
  const B = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66]; // B2,B4,B6,B8,B10
  // term_k = B_{2k}/(2k) * (1/z)^{2k}; running power pr+ipi = (1/z)^{2k}
  let pr = wr, pi = wi;
  for (let k = 0; k < B.length; k++) {
    const c = B[k] / (2 * (k + 1));
    re -= c * pr;
    im -= c * pi;
    // advance power by (1/z)^2
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

// ---- Simpson quadrature nodes on r in [0, R] (h even -> 2x half-line) ----
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

// ---- explicit-formula RHS for a test function given by h(r) and g(logn) ----
// hOfR: function(r) -> h(r) (real, even). hAtHalf: value h(i/2). gAt: function(x)->g(x).
// Returns {pole, arch, prime, total}.
function efRHS(hOfR, hAtHalf, gAt, grid, primes) {
  // pole: h(i/2) + h(-i/2) = 2 h(i/2)  (h even)
  const pole = 2 * hAtHalf;
  // arch: (1/2pi) int_{-inf}^{inf} h(r) Phi_inf(r) dr = (1/pi) int_0^inf ...
  let archAcc = 0;
  const { r, w, scale } = grid;
  for (let i = 0; i < r.length; i++) archAcc += w[i] * hOfR(r[i]) * phiInf(r[i]);
  const arch = (archAcc * scale) / Math.PI; // (2 * 1/2pi) = 1/pi already folded
  // prime: -2 sum Lambda(n)/sqrt(n) g(log n)
  let prime = 0;
  for (const [logn, coef] of primes) prime += coef * gAt(logn);
  prime *= -2;
  return { pole, arch, prime, total: pole + arch + prime };
}

// ---- Jacobi eigenvalue algorithm for real symmetric matrices ----
function jacobiEig(Ain, n) {
  const A = Ain.map((row) => Float64Array.from(row));
  const V = Array.from({ length: n }, (_, i) => {
    const v = new Float64Array(n); v[i] = 1; return v;
  });
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p], akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k], aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p], vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  const eig = [];
  for (let i = 0; i < n; i++) eig.push({ value: A[i][i], vec: V.map((row) => row[i]) });
  eig.sort((a, b) => a.value - b.value);
  return eig;
}

// ---- compactly-supported even test-function basis ----
// smooth bump b(x) = exp(-1/(1-(x/L)^2)) on (-L,L), else 0.
// basis: even combinations  f_k(x) = b(x - c_k) + b(x + c_k)  (c_0 = 0 => 2 b(x)).
function makeBasis(L, centers) {
  const bump = (x) => {
    if (x <= -L || x >= L) return 0;
    const t = x / L;
    return Math.exp(-1 / (1 - t * t));
  };
  return centers.map((c) => (x) => bump(x - c) + bump(x + c));
}

// F_k(r) = int f_k(x) cos(r x) dx (real, even). Quadrature in x.
// also returns helper to evaluate F at a real r, and F(i/2) = int f(x) e^{-x/2} dx.
function makeF(fk, xHalfSpan, MX) {
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
  const Fr = (r) => {
    let acc = 0;
    for (let i = 0; i <= MX; i++) acc += wq[i] * fv[i] * Math.cos(r * xs[i]);
    return acc * sc;
  };
  let half = 0;
  for (let i = 0; i <= MX; i++) half += wq[i] * fv[i] * Math.exp(-0.5 * xs[i]);
  half *= sc;
  return { Fr, half };
}

function main() {
  const t0 = performance.now();

  // -------- 1. EF validation on Gaussians --------
  const gridValid = rGrid(200, 40000);
  const primesValid = primePowerData(100000);
  const sigmas = [0.15, 0.2, 0.25, 0.3];
  const validation = [];
  for (const sigma of sigmas) {
    const amp = sigma * Math.sqrt(2 * Math.PI);
    const hOfR = (r) => amp * Math.exp(-0.5 * sigma * sigma * r * r);
    const hAtHalf = amp * Math.exp(0.5 * sigma * sigma * 0.25); // h(i/2): r=i/2 -> -s^2(i/2)^2/2 = +s^2/8
    const gAt = (x) => Math.exp(-(x * x) / (2 * sigma * sigma));
    const rhs = efRHS(hOfR, hAtHalf, gAt, gridValid, primesValid);
    let zeroSide = 0;
    for (const g of ZEROS) zeroSide += 2 * hOfR(g); // +/- pairs
    const relErr = Math.abs(rhs.total - zeroSide) / Math.abs(zeroSide);
    validation.push({
      sigma,
      zeroSide: Number(zeroSide.toFixed(8)),
      efTotal: Number(rhs.total.toFixed(8)),
      pole: Number(rhs.pole.toFixed(6)),
      arch: Number(rhs.arch.toFixed(6)),
      prime: Number(rhs.prime.toFixed(6)),
      relErr: Number(relErr.toExponential(3)),
    });
  }
  const validationOk = validation.every((v) => Number(v.relErr) < 5e-3);

  // -------- 2. Weil Gram matrix on compactly-supported basis --------
  const L = 1.6;                                  // bump radius (support of each lobe)
  const centers = [0.0, 0.7, 1.4, 2.1, 2.8, 3.5]; // even bump-pair centers
  const basis = makeBasis(L, centers);
  const K = basis.length;
  const xHalfSpan = L + Math.max(...centers) + 0.5;
  const Fs = basis.map((fk) => makeF(fk, xHalfSpan, 6000));

  // r-grid for Gram integrals (test functions are smooth & supported => F decays)
  const gridG = rGrid(120, 24000);
  // prime data up to n = exp(2*xHalfSpan): g_{ij}(log n) = 0 beyond support 2*span
  const nMax = Math.min(2000000, Math.ceil(Math.exp(2 * xHalfSpan)) + 5);
  const primesG = primePowerData(nMax);

  // precompute F_k(r) on the grid, F_k(i/2)
  const Fgrid = Fs.map(({ Fr }) => {
    const arr = new Float64Array(gridG.r.length);
    for (let i = 0; i < gridG.r.length; i++) arr[i] = Fr(gridG.r[i]);
    return arr;
  });
  const Fhalf = Fs.map(({ half }) => half);
  // precompute F_k(r) at prime nodes (cos already folded via g integral): we need
  // g_{ij}(log n) = (1/2pi) int F_i F_j cos(r log n) dr = (1/pi) int_0^inf ...
  // Precompute cos(r * logn) per prime is heavy; instead integrate per (i,j,n).
  // To keep it tractable, precompute for each prime the vector cos(r*logn) once.
  const logns = primesG.map((p) => p[0]);
  const coefs = primesG.map((p) => p[1]);
  const cosTab = logns.map((ln) => {
    const arr = new Float64Array(gridG.r.length);
    for (let i = 0; i < gridG.r.length; i++) arr[i] = Math.cos(gridG.r[i] * ln);
    return arr;
  });

  const { w: wG, scale: scG, r: rG } = gridG;
  const phiTab = new Float64Array(rG.length);
  for (let i = 0; i < rG.length; i++) phiTab[i] = phiInf(rG[i]);

  // assemble matrices
  const W = Array.from({ length: K }, () => new Float64Array(K));
  const W0 = Array.from({ length: K }, () => new Float64Array(K));
  const Pole = Array.from({ length: K }, () => new Float64Array(K));
  const Arch = Array.from({ length: K }, () => new Float64Array(K));
  const Prime = Array.from({ length: K }, () => new Float64Array(K));

  for (let i = 0; i < K; i++) {
    for (let j = i; j < K; j++) {
      const Fi = Fgrid[i], Fj = Fgrid[j];
      // arch_{ij} = (1/pi) int_0^inf F_i F_j Phi_inf dr
      let archAcc = 0;
      for (let k = 0; k < rG.length; k++) archAcc += wG[k] * Fi[k] * Fj[k] * phiTab[k];
      const arch = (archAcc * scG) / Math.PI;
      // prime_{ij} = -2 sum coef_n * g_{ij}(log n),  g_{ij}(logn) = (1/pi) int_0^inf F_i F_j cos(r logn) dr
      let prime = 0;
      for (let p = 0; p < logns.length; p++) {
        const ct = cosTab[p];
        let gacc = 0;
        for (let k = 0; k < rG.length; k++) gacc += wG[k] * Fi[k] * Fj[k] * ct[k];
        const gij = (gacc * scG) / Math.PI;
        prime += coefs[p] * gij;
      }
      prime *= -2;
      // pole_{ij} = 2 F_i(i/2) F_j(i/2)
      const pole = 2 * Fhalf[i] * Fhalf[j];
      const total = pole + arch + prime;
      W[i][j] = W[j][i] = total;
      W0[i][j] = W0[j][i] = arch + prime;
      Pole[i][j] = Pole[j][i] = pole;
      Arch[i][j] = Arch[j][i] = arch;
      Prime[i][j] = Prime[j][i] = prime;
    }
  }

  const eigW = jacobiEig(W, K);
  const eigW0 = jacobiEig(W0, K);

  // diagonal-normalized correlation form of the full W (separates indefiniteness
  // from ill-conditioning of the near-dependent smooth basis).
  const C = Array.from({ length: K }, () => new Float64Array(K));
  for (let i = 0; i < K; i++)
    for (let j = 0; j < K; j++)
      C[i][j] = W[i][j] / Math.sqrt(Math.abs(W[i][i]) * Math.abs(W[j][j]));
  const eigC = jacobiEig(C, K);

  const lamMinW = eigW[0];
  const lamMinW0 = eigW0[0];
  // which test functions stress positivity: dominant components of W0 min eigvec
  const stressVec = lamMinW0.vec;
  const stress = centers
    .map((c, idx) => ({ center: c, weight: Number(stressVec[idx].toFixed(4)) }))
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  const out = {
    ticket: 'imp-2427',
    object: 'Weil explicit-formula quadratic form on a finite compactly-supported test-function basis',
    explicitFormula:
      'sum_rho h(gamma) = h(i/2)+h(-i/2) + (1/2pi) int h(r)[Re psi(1/4+ir/2) - log pi] dr - 2 sum Lambda(n) n^{-1/2} g(log n)',
    validation: {
      method: 'Gaussian h(r)=sigma*sqrt(2pi) exp(-sigma^2 r^2/2); compare EF RHS to 2*sum_{gamma>0} h(gamma) over first 40 zeros',
      zerosUsed: ZEROS.length,
      rows: validation,
      passed: validationOk,
    },
    basis: {
      type: 'even smooth bump pairs b(x-c)+b(x+c), b(x)=exp(-1/(1-(x/L)^2))',
      bumpRadiusL: L,
      centers,
      dimension: K,
      primePowersSummed: primesG.length,
      nMax,
    },
    fullWeilForm: {
      note: 'W = pole + arch - prime = sum_rho F_i(gamma) F_j(gamma); PSD under RH',
      lambdaMin: Number(lamMinW.value.toExponential(6)),
      lambdaMax: Number(eigW[K - 1].value.toExponential(6)),
      eigenvalues: eigW.map((e) => Number(e.value.toExponential(4))),
      psd: lamMinW.value > -1e-9 * Math.abs(eigW[K - 1].value),
    },
    correlationForm: {
      note: 'diagonal-normalized W (unit diagonal) isolates genuine indefiniteness from ill-conditioning',
      lambdaMin: Number(eigC[0].value.toExponential(6)),
      lambdaMax: Number(eigC[K - 1].value.toExponential(6)),
      psd: eigC[0].value > -1e-8,
    },
    primePlusArchPart: {
      note: 'W0 = arch - prime (pole removed). Indefinite remainder; its min eigenpair shows which test functions stress positivity',
      lambdaMin: Number(lamMinW0.value.toExponential(6)),
      lambdaMax: Number(eigW0[K - 1].value.toExponential(6)),
      stressingTestFunctions: stress,
    },
    elapsedMs: Math.round(performance.now() - t0),
    scope: 'NUMERICAL evidence for Weil positivity on this basis. Consistent with RH; not a proof. lambda_min(W) < 0 on any basis would disprove RH.',
  };
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

main();
