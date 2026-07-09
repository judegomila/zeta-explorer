// imp-34790: Energy of the Hamiltonian around phase-change boundaries in the
// Twin-Ladder / primon-gas picture.
//
// Computes six things (all classical machinery, no zeros bundle, no repo imports):
//
// A. IDENTITY: T_zpo(x) := sum_p (log p)^2 p^{-x} / (1-p^{-x})^2  ==  (log zeta)''(x)
//    for x > 1, verified numerically (sieve prime sum vs Borwein-eta zeta derivatives).
//    This is the HamiltonianPage "kinetic curvature" term at x = 2*sigma, so the ZPO
//    kinetic kernel IS the primon-gas specific-heat kernel at beta = 2*sigma.
//
// B. DIVERGENCE LAW at sigma -> 1/2+ (i.e. x = 2 sigma -> 1+):
//    (log zeta)''(1+u) = 1/u^2 - (gamma^2 + 2*gamma_1) + (3*gamma_2 + 6*gamma*gamma_1 + 2*gamma^3)*u + O(u^2)
//    so T_zpo(sigma) = (2 sigma - 1)^{-2} - c0 + c1*(2 sigma - 1) + ...
//    with c0 = gamma^2 + 2 gamma_1, c1 = 3 gamma_2 + 6 gamma gamma_1 + 2 gamma^3.
//
// C. INTERNAL ENERGY LAW at the sigma=1 (Hagedorn/Bost-Connes) boundary:
//    U(beta) = -(log zeta)'(beta) = 1/(beta-1) - gamma + O(beta-1),
//    C_v(beta) = beta^2 (log zeta)''(beta), C_v * (beta-1)^2 -> 1 (exponent 2, one-sided).
//
// D. TRUNCATION LAW at the boundary itself: T_P(x=1) = sum_{p<=P} (log p)^2 / p / (1-1/p)^2
//    grows like (log P)^2 / 2 (Mertens), i.e. the finite-prime "value at sigma=1/2"
//    is a logarithmically divergent truncation artifact.
//
// E. NO SINGULARITY of zeta itself at real sigma = 1/2: zeta(sigma), (log|zeta|)''(sigma)
//    smooth and O(1) through sigma = 1/2 on the real axis (t=0).
//
// F. The page's FULL finite-N Hamiltonian kinetic term (symmetrized ladder energy)
//    T_N(sigma,t) = sum_{p<=p_N} (1/2) log p * (|H_p(s)|^2 + |H_p(1-s)|^2),
//    H_p = 1/(1-p^{-s}): measure the curvature K_N = d^2 T_N / d sigma^2 at
//    sigma=1/2, t=gamma_1=14.134725 as N grows -- does the claimed "strict convexity"
//    converge or is it cutoff-dominated?

// ---------- Borwein algorithm for eta(s), eta'(s), eta''(s), real s > 0 ----------
function borweinD(n) {
  // d_k = n * sum_{i=0}^{k} (n+i-1)! 4^i / ((n-i)! (2i)!)
  const d = new Array(n + 1).fill(0);
  for (let k = 0; k <= n; k++) {
    let s = 0;
    // term_i = (n+i-1)! 4^i / ((n-i)! (2i)!)  -- build iteratively in log space
    let t = 1; // i = 0 term: (n-1)!/n! = 1/n -> times n later; keep exact recurrence
    // i=0: (n-1)! * 1 / (n! * 0!) = 1/n
    t = 1 / n;
    s += t;
    for (let i = 1; i <= k; i++) {
      // ratio term_i / term_{i-1} = 4*(n+i-1)*(n-i+1) / ((2i)*(2i-1))
      t *= (4 * (n + i - 1) * (n - i + 1)) / ((2 * i) * (2 * i - 1));
      s += t;
    }
    d[k] = n * s;
  }
  return d;
}

const BORWEIN_N = 60;
const BD = borweinD(BORWEIN_N);

function etaAndDerivs(s) {
  // eta^{(m)}(s) ~ (1/d_n) sum_{k=0}^{n-1} (-1)^k (d_k - d_n) * (-log(k+1))^m * (k+1)^{-s}
  let e0 = 0, e1 = 0, e2 = 0;
  for (let k = 0; k < BORWEIN_N; k++) {
    const sign = k % 2 === 0 ? 1 : -1;
    const w = sign * (BD[k] - BD[BORWEIN_N]);
    const L = Math.log(k + 1);
    const base = w * Math.pow(k + 1, -s);
    e0 += base;
    e1 += base * -L;
    e2 += base * L * L;
  }
  // Borwein P1: eta(s) = -(1/d_n) sum_{k=0}^{n-1} (-1)^k (d_k - d_n) (k+1)^{-s}
  return [-e0 / BD[BORWEIN_N], -e1 / BD[BORWEIN_N], -e2 / BD[BORWEIN_N]];
}

function zetaAndLogDerivs(s) {
  // zeta = eta / B, B = 1 - 2^{1-s}; returns [zeta, (log zeta)', (log zeta)'']
  const [A, A1, A2] = etaAndDerivs(s);
  const ln2 = Math.LN2;
  const twoPow = Math.pow(2, 1 - s);
  const B = 1 - twoPow;
  const B1 = ln2 * twoPow;         // dB/ds
  const B2 = -ln2 * ln2 * twoPow;  // d2B/ds2
  const la1 = A1 / A, la2 = A2 / A - la1 * la1;   // (log A)', (log A)''
  const lb1 = B1 / B, lb2 = B2 / B - lb1 * lb1;   // (log B)', (log B)''
  return { zeta: A / B, dlog: la1 - lb1, d2log: la2 - lb2 };
}

// ---------- Prime sieve ----------
function sievePrimes(limit) {
  const isC = new Uint8Array(limit + 1);
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (!isC[i]) {
      primes.push(i);
      for (let j = i * i; j <= limit; j += i) isC[j] = 1;
    }
  }
  return primes;
}

console.error('sieving to 1e7...');
const PRIMES = sievePrimes(10_000_000);
console.error(`${PRIMES.length} primes`);

// Stieltjes constants (reference literals)
const GAMMA = 0.5772156649015329;
const GAMMA1 = -0.07281584548367672;
const GAMMA2 = -0.009690363192872318;
const C0 = GAMMA * GAMMA + 2 * GAMMA1;                       // ~ 0.18754623...
const C1 = 3 * GAMMA2 + 6 * GAMMA * GAMMA1 + 2 * GAMMA ** 3; // ~ 0.10340...

// ---------- A. Identity T_zpo(x) = (log zeta)''(x) ----------
function tZpo(x, primes) {
  let s = 0;
  for (const p of primes) {
    const px = Math.pow(p, -x);
    if (px < 1e-320) break;
    const d = 1 - px;
    s += Math.log(p) * Math.log(p) * px / (d * d);
  }
  return s;
}

const identityChecks = [1.5, 2, 2.5, 3, 4].map(x => {
  const primeSum = tZpo(x, PRIMES);
  const { d2log } = zetaAndLogDerivs(x);
  return { x, primeSum, logZetaSecondDeriv: d2log, relErr: Math.abs(primeSum - d2log) / Math.abs(d2log) };
});

// ---------- B. Divergence law at u -> 0+ ----------
const divergenceLaw = [0.3, 0.1, 0.03, 0.01, 0.003, 0.001].map(u => {
  const { d2log } = zetaAndLogDerivs(1 + u);
  const g = d2log - 1 / (u * u);
  return { u, sigma: (1 + u) / 2, g, gMinusLinear: g - C1 * u };
});
// slope fit from two smallest u
const [ga, gb] = [divergenceLaw[4], divergenceLaw[5]];
const fittedSlope = (ga.g - gb.g) / (ga.u - gb.u);

// ---------- C. Internal energy / specific heat at beta -> 1+ ----------
const hagedornLaw = [0.3, 0.1, 0.03, 0.01, 0.003, 0.001].map(u => {
  const { dlog, d2log } = zetaAndLogDerivs(1 + u);
  const U = -dlog;
  const Cv = (1 + u) * (1 + u) * d2log;
  return { u, UminusPole: U - 1 / u, CvTimesU2: Cv * u * u };
});

// ---------- D. Truncation law at x = 1 (sigma = 1/2) ----------
const truncationLaw = [];
{
  let s = 0, next = 1000;
  for (const p of PRIMES) {
    while (p > next) {
      const lp = Math.log(next);
      truncationLaw.push({ P: next, T_P: s, mertensLead: lp * lp / 2, offset: s - lp * lp / 2 });
      next *= 10;
    }
    const lg = Math.log(p);
    const inv = 1 / p, d = 1 - inv;
    s += lg * lg * inv / (d * d);
  }
  const lp = Math.log(10_000_000);
  truncationLaw.push({ P: 10_000_000, T_P: s, mertensLead: lp * lp / 2, offset: s - lp * lp / 2 });
}

// ---------- E. Smoothness through sigma = 1/2 on the real axis ----------
const realAxisScan = [];
for (let sigma = 0.3; sigma <= 0.7001; sigma += 0.05) {
  const { zeta, d2log } = zetaAndLogDerivs(sigma);
  realAxisScan.push({ sigma: +sigma.toFixed(2), zeta, d2logAbsZeta: d2log });
}
const zetaHalf = zetaAndLogDerivs(0.5).zeta; // reference: -1.4603545088095868

// ---------- F. Finite-N viz-Hamiltonian curvature at sigma=1/2, t=14.134725 ----------
function kineticSym(sigma, t, primes, N) {
  let T = 0;
  for (let i = 0; i < N; i++) {
    const p = primes[i], lp = Math.log(p);
    for (const sg of [sigma, 1 - sigma]) {
      const r = Math.pow(p, -sg);
      const re = 1 - r * Math.cos(t * lp);
      const im = r * Math.sin(t * lp);
      T += 0.5 * lp / (re * re + im * im); // (1/2) log p * |1/(1-p^{-s})|^2
    }
  }
  return T;
}

const T_FIXED = 14.134725;
const vizCurvature = [10, 25, 50, 100, 200, 400, 800, 1600, 3200].map(N => {
  const h = 1e-3;
  const f0 = kineticSym(0.5, T_FIXED, PRIMES, N);
  const fp = kineticSym(0.5 + h, T_FIXED, PRIMES, N);
  const fm = kineticSym(0.5 - h, T_FIXED, PRIMES, N);
  return { N, pMax: PRIMES[N - 1], T_at_half: f0, curvature: (fp - 2 * f0 + fm) / (h * h) };
});

// ---------- Report ----------
const out = {
  constants: { GAMMA, GAMMA1, GAMMA2, C0, C1 },
  identityChecks,
  divergenceLaw,
  fittedSlope,
  hagedornLaw,
  truncationLaw,
  realAxisScan,
  zetaHalf,
  vizCurvature,
};
console.log(JSON.stringify(out, (k, v) => (typeof v === 'number' ? +v.toPrecision(10) : v), 2));
