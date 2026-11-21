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
 * does not promote Lambda <= 0.14; NO QED; no refereed bound is changed
 * . Import-light (no heavy bundle).
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

// ── imp-95275: sub-corner extension via cancellation-free quadrature ─────────
// The Lemma PF closed form (iExact above) is float-valid only for T >= the
// dominant corner V(0,2); below it the FAR piece (farFolded) carries a
// pole-confluence singularity at T = 1 - rho, where a = rho + T -> 1 so the
// (a-1)^-(2s-k) and (1-a)^-(2s-k) partial-fraction terms diverge and the
// alternating sum loses all significant digits. Assessment for imp-95275: a
// rearranged partial-fraction (folded vs unfolded) evaluation CANNOT cross
// that confluence without a separate confluent closed form / series in (a-1);
// but the normalized pair correlation is a manifestly cancellation-free
// integral of a POSITIVE integrand, so a refined midpoint quadrature extends
// the EXACT curve below the corner - it reproduces iExact above the corner and
// continues smoothly and monotonically down to small T, staying below both
// envelope treatments (which upper-bound it). So the three-treatment envelope
// comparison CAN be sampled below the corner, using quadrature as the exact
// surrogate. Measurement/viz only; floors untouched; changes no bound; NO QED.

export const IMP95275_T_CONFLUENCE = 1 - IMP95038_RHO; // far-piece pole coincidence a = rho + T = 1

// cancellation-free reference: midpoint quadrature of the positive integrand
// (1 + |u|/rho)^-s (1 + |u - T|)^-s, normalized by rho^-1/2. N and pad chosen
// so the sub-corner relative accuracy is ~1e-5 at trivial module-load cost.
function iQuadRef(T, rho, s, N, pad) {
  const lo = -pad;
  const hi = T + pad;
  const h = (hi - lo) / N;
  let acc = 0;
  for (let i = 0; i < N; i++) {
    const u = lo + (i + 0.5) * h;
    acc += Math.pow(1 + Math.abs(u) / rho, -s) * Math.pow(1 + Math.abs(u - T), -s);
  }
  return (acc * h) / Math.sqrt(rho);
}

const SUB_N = 100000;
const SUB_PAD = 40;
const N_SUB_SAMPLES = 18;
const SUB_T_MIN = 0.05;
const SUB_T_MAX = IMP95038_V02 * 0.98; // just below the dominant corner

// sub-corner sample grid (log-spaced in T, strictly below the corner), with the
// exact curve carried by cancellation-free quadrature instead of the ill-
// conditioned closed form. Same twoWindow / threeWindow envelope treatments.
export const IMP95275_SUBCORNER_CURVE = Array.from({ length: N_SUB_SAMPLES }, (_, i) => {
  const t = SUB_T_MIN * Math.pow(SUB_T_MAX / SUB_T_MIN, i / (N_SUB_SAMPLES - 1));
  return {
    T: t,
    twoWindow: psiEnv(t, SS),
    threeWindow: threeWindowMin(t, IMP95038_RHO, SS),
    exactQuad: iQuadRef(t, IMP95038_RHO, SS, SUB_N, SUB_PAD),
  };
});

// measured float-validity boundary: relative gap between the closed form and
// the cancellation-free quadrature at three separations spanning the corner.
export const IMP95275_CLOSED_FORM_CONDITIONING = [IMP95038_V02, 0.5, 0.3].map((T) => {
  const q = iQuadRef(T, IMP95038_RHO, SS, SUB_N, SUB_PAD);
  const e = iExact(T, IMP95038_RHO, SS);
  return { T, exactClosedForm: e, exactQuad: q, relGap: Math.abs(e - q) / Math.abs(q) };
});

// ── imp-95275 assertions (self-executing) ────────────────────────────────────
function assertQuadReproducesCornerExact() {
  const q = iQuadRef(IMP95038_V02, IMP95038_RHO, SS, SUB_N, SUB_PAD);
  const e = iExact(IMP95038_V02, IMP95038_RHO, SS);
  if (Math.abs(q - e) > 1e-3 * Math.abs(e)) {
    throw new Error('imp-95275: quadrature does not reproduce the closed form at the dominant corner');
  }
}

function assertClosedFormDivergesBelowCorner() {
  // at T = 0.3 (below the corner, past the far-piece confluence onset) the
  // closed form has lost all digits vs the cancellation-free quadrature.
  const rec = IMP95275_CLOSED_FORM_CONDITIONING.find((r) => r.T === 0.3);
  if (!rec || !(rec.relGap > 1e3)) {
    throw new Error('imp-95275: expected catastrophic closed-form conditioning breakdown below the corner');
  }
}

function assertSubcornerQuadValidAndBounded() {
  let prev = -Infinity; // grid is increasing in T, so exactQuad must be decreasing
  for (const p of IMP95275_SUBCORNER_CURVE) {
    if (!Number.isFinite(p.exactQuad) || p.exactQuad <= 0) {
      throw new Error('imp-95275: sub-corner quadrature value not finite-positive');
    }
    const env = Math.min(p.twoWindow, p.threeWindow);
    if (p.exactQuad > env * (1 + 1e-4)) {
      throw new Error('imp-95275: sub-corner exact curve exceeds its envelope upper bound');
    }
  }
  for (let i = IMP95275_SUBCORNER_CURVE.length - 1; i >= 0; i--) {
    const v = IMP95275_SUBCORNER_CURVE[i].exactQuad;
    if (v < prev * (1 - 1e-6)) {
      throw new Error('imp-95275: sub-corner exact curve not monotone as separation shrinks');
    }
    prev = v;
  }
}

function assertQuadConvergesUnderRefinement() {
  const T = 0.3;
  const coarse = iQuadRef(T, IMP95038_RHO, SS, SUB_N / 4, SUB_PAD);
  const fine = iQuadRef(T, IMP95038_RHO, SS, SUB_N, SUB_PAD);
  if (Math.abs(coarse - fine) > 1e-3 * Math.abs(fine)) {
    throw new Error('imp-95275: cancellation-free quadrature does not converge under refinement');
  }
}

assertQuadReproducesCornerExact();
assertClosedFormDivergesBelowCorner();
assertSubcornerQuadValidAndBounded();
assertQuadConvergesUnderRefinement();
