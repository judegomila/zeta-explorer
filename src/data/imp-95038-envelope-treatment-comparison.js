/**
 * imp-95038 - viz-only companion to the imp-95008 far-bracket ceiling chain.
 * Samples the THREE successive per-pair envelope treatments as functions of
 * separation T, at the fixed dominant-corner width ratio rho = rhoCap(2) =
 * 2^(-1/3), s = sigma + theta = 11 (theta = 10, reference parameters):
 *   twoWindow   - seventeenth continuation, two-region Cauchy-Schwarz
 *                 exponent-split envelope (psi ~ T^(1/2-s) asymptotics),
 *   threeWindow - eighteenth continuation, width-pinned three-window
 *                 interpolation (grid-searched window split),
 *   exact       - nineteenth continuation, exact closed form (Lemma PF
 *                 partial fractions; true T^(-s) asymptotics).
 * Formulas reproduced verbatim from the assertions in
 * src/data/imp-95008-exact-pair-correlation-ceiling.js (Lemma PF's closed
 * form is float-valid only for T >= dominant corner V(0,2) = 2^(1/3), per
 * that module's recorded small-T conditioning trap - so this sample grid
 * starts exactly at the corner and never dips below it). The three curves
 * at T = V(0,2) reproduce the module's baked literals: min(twoWindow,
 * threeWindow) = 1.1159760370515937e-4 (eighteenth min-envelope) and
 * exact = 3.9197920255561178e-5 (nineteenth exact corner value).
 *
 * Content/viz follow-up only - no new lemma, no new bound. Floors untouched;
 * does not promote Lambda <= 0.14; NO QED; Platt-Trudgian Lambda <= 0.2
 * remains SOTA. Import-light (no heavy bundle).
 */

const SIGMA = 1;
const THETA = 10;
const SS = SIGMA + THETA;

export const IMP95038_RHO = Math.pow(2, -1 / 3); // rhoCap(2), the dominant-corner width ratio
export const IMP95038_V02 = Math.pow(2, 1 / 3); // cornerV(0, 2), the dominant-corner separation

// seventeenth continuation: two-region exponent-split envelope
function psiEnv(T, s) {
  const x = Math.log1p(T);
  const flat = 2 / (2 * s - 1);
  if (x <= flat) return flat;
  return Math.E * x * Math.pow(1 + T, 0.5 - s);
}

// eighteenth continuation: width-pinned three-window envelope, minimized over the window split
function threeWindow(T, rho, d1, d2, s) {
  const c2s = Math.SQRT2 / (2 * s - 1);
  const L = c2s * Math.pow(1 + (1 - d1) * T, 0.5 - s);
  const R = c2s * Math.pow(1 + ((1 - d2) * T) / rho, 0.5 - s);
  const m1 = (d1 * T) / rho;
  const m2 = d2 * T;
  const B = 1 + T + (d1 * d2 * T * T) / rho;
  const P = (1 + m1) * (1 + m2);
  let sp;
  const x = Math.log(B / P);
  if (x >= 2 / (2 * s - 1)) sp = 0.5 + 1 / x;
  else sp = s;
  const M = (1 / (2 * sp - 1)) * Math.pow(B, -(s - sp)) * Math.pow(P, 0.5 - sp);
  return L + R + M;
}

function threeWindowMin(T, rho, s) {
  let best = Infinity;
  let bd1 = 0;
  let bd2 = 0;
  for (let i = 0; i <= 19; i++) {
    for (let k = 0; i * 0.05 + k * 0.05 <= 1 && k <= 19; k++) {
      const v = threeWindow(T, rho, i * 0.05, k * 0.05, s);
      if (v < best) {
        best = v;
        bd1 = i * 0.05;
        bd2 = k * 0.05;
      }
    }
  }
  for (let i = -4; i <= 4; i++) {
    for (let k = -4; k <= 4; k++) {
      const a = bd1 + i * 0.0125;
      const b = bd2 + k * 0.0125;
      if (a < 0 || b < 0 || a + b > 1) continue;
      const v = threeWindow(T, rho, a, b, s);
      if (v < best) best = v;
    }
  }
  return best;
}

// nineteenth continuation: exact closed form (Lemma PF partial fractions)
function binom(n, k) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

function outerFolded(rho, bb, s) {
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(bb - rho, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(rho - bb, -(2 * s - k));
    sum += (ck * Math.pow(rho, s + 1 - k) + dk * Math.pow(rho, s) * Math.pow(bb, 1 - k)) / (k - 1);
  }
  const c1s = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(bb - rho, -(2 * s - 1)) * Math.pow(rho, s);
  return sum + (c1s === 0 ? 0 : c1s * Math.log(bb / rho));
}

function farFolded(rho, T, s) {
  const a = rho + T;
  const rs = Math.pow(rho, s);
  if (rs === 0) return 0;
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(1 - a, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(a - 1, -(2 * s - k));
    sum += (rs * (ck * Math.pow(a, 1 - k) + dk)) / (k - 1);
  }
  const c1 = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(1 - a, -(2 * s - 1));
  return sum + (c1 === 0 ? 0 : rs * c1 * Math.log(1 / a));
}

function middleFolded(rho, T, s) {
  const c = 1 + T;
  const rs = Math.pow(rho, s);
  let sum = 0;
  for (let k = 1; k <= s; k++) {
    const pk = binom(2 * s - k - 1, s - k) * Math.pow(rho + c, -(2 * s - k));
    if (pk === 0) continue;
    const Ja =
      k === 1
        ? rs === 0
          ? 0
          : rs * Math.log((T + rho) / rho)
        : (Math.pow(rho, s + 1 - k) - rs * Math.pow(T + rho, 1 - k)) / (k - 1);
    const Jc = k === 1 ? rs * Math.log(c) : (rs * (1 - Math.pow(c, 1 - k))) / (k - 1);
    sum += pk * (Ja + Jc);
  }
  return sum;
}

function iExact(T, rho, s) {
  return Math.pow(rho, -0.5) * (outerFolded(rho, 1 + T, s) + middleFolded(rho, T, s) + farFolded(rho, T, s));
}

// sample grid: log-spaced in T from the dominant corner V(0,2) up to 20 x
// that separation (the domain where the exact closed form is float-valid,
// per the recorded small-T conditioning trap)
const N_SAMPLES = 40;
const T_MAX = 20;

export const IMP95038_ENVELOPE_CURVE = Array.from({ length: N_SAMPLES }, (_, i) => {
  const t = IMP95038_V02 * Math.pow(T_MAX / IMP95038_V02, i / (N_SAMPLES - 1));
  return {
    T: t,
    twoWindow: psiEnv(t, SS),
    threeWindow: threeWindowMin(t, IMP95038_RHO, SS),
    exact: iExact(t, IMP95038_RHO, SS),
  };
});

export const IMP95038_CORNER_VALUES = {
  T: IMP95038_V02,
  twoWindow: psiEnv(IMP95038_V02, SS),
  threeWindow: threeWindowMin(IMP95038_V02, IMP95038_RHO, SS),
  exact: iExact(IMP95038_V02, IMP95038_RHO, SS),
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
const CORNER_THREE_WINDOW_LIT = 1.1159760370515937e-4;
const CORNER_EXACT_LIT = 3.9197920255561178e-5;

function assertReproducesCorner() {
  const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
  if (!rel(IMP95038_CORNER_VALUES.threeWindow, CORNER_THREE_WINDOW_LIT)) {
    throw new Error('imp-95038-envelope-treatment-comparison: three-window corner literal mismatch');
  }
  if (!rel(IMP95038_CORNER_VALUES.exact, CORNER_EXACT_LIT)) {
    throw new Error('imp-95038-envelope-treatment-comparison: exact corner literal mismatch');
  }
}

function assertMonotoneDecreasing() {
  let prevTwo = Infinity;
  let prevThree = Infinity;
  let prevExact = Infinity;
  for (const p of IMP95038_ENVELOPE_CURVE) {
    if (p.twoWindow > prevTwo * (1 + 1e-9)) {
      throw new Error('imp-95038-envelope-treatment-comparison: two-window curve not monotone');
    }
    if (p.threeWindow > prevThree * (1 + 1e-9)) {
      throw new Error('imp-95038-envelope-treatment-comparison: three-window curve not monotone');
    }
    if (p.exact > prevExact * (1 + 1e-9)) {
      throw new Error('imp-95038-envelope-treatment-comparison: exact curve not monotone');
    }
    prevTwo = p.twoWindow;
    prevThree = p.threeWindow;
    prevExact = p.exact;
  }
}

assertReproducesCorner();
assertMonotoneDecreasing();
