/**
 * imp-95008 continuation (second) - the l2-to-pointwise duality step of
 * residual (c) closed as an exact reproducing-kernel lemma: the duality
 * constant IS the diagonal reproducing kernel sqrt(K_W(x,x)) (an inverse
 * Christoffel function), it is attained, it equals sqrt(|W|/L) at EVERY
 * evaluation point in an equimodular (DFT) picture, and it never exceeds 1
 * in the coordinate picture - so the pointwise step is NOT the binding
 * constraint of the weld budget (explicit allowance 1.4327 at p = 97).
 *
 * SETTING (Permuting the Zeta Twin Ladder Section 4.5; page
 * /permutation-architecture "conditional alias-coupling reduction" box;
 * modules imp-95008-weld-alias-l2-collapse.js and
 * imp-95008-alias-separation-curvature-floor.js). The recorded conditional
 * chain bounds the l2 norm of the weld defect,
 *   ||[B, Pi_p] f||^2 <= C^2 K S ||f||^2,   S = sum_{h != 0} w(h)^2 lambda(h)^(-2/3),
 * with the conditional closed form S <= S_bar = 2 mu^(-2/3) p^(-4/3)
 * sum_{j <= (p-1)/2} j^(-2/3) (= 0.0381116 at p = 97, mu = 1). Both prior
 * modules name residual (c): the scalar |C_E,17| evaluates shells AT a point
 * (the Lean-verified five_shell_identity writes E97 as a linear functional
 * L_N paired against shell vectors), so "a duality or reproducing-kernel
 * step with its own constant is still required" to pass from the l2 bound
 * to the pointwise scalar. THIS MODULE closes that step as a lemma with an
 * EXACT constant and shows where its weight actually lands.
 *
 * LEMMA E (exact evaluation-norm identity - UNCONDITIONAL). Let
 * {phi_i : i in W} be a finite orthonormal family in an inner-product space
 * of functions on a set X, H_W = span{phi_i}, and for v = sum_i c_i phi_i
 * write v(x) = sum_i c_i phi_i(x). Then for every x in X
 *   sup { |v(x)| : v in H_W, ||v|| <= 1 }  =  sqrt( K_W(x,x) ),
 *   K_W(x,x) = sum_{i in W} |phi_i(x)|^2,
 * ATTAINED at the normalized reproducing kernel v = k_x / ||k_x||,
 * k_x = sum_i conj(phi_i(x)) phi_i. Proof: Parseval makes ||v|| the
 * coefficient l2 norm; Cauchy-Schwarz on sum_i c_i phi_i(x) gives <=, and
 * aligning c_i with conj(phi_i(x)) gives equality. K_W(x,x) is the diagonal
 * of the reproducing kernel of H_W - the reciprocal of the Christoffel
 * function of the system at x. SHARPNESS SCOPE: the sup is over ALL of H_W;
 * over the strict subset of weld outputs [B, Pi_p] f it can only be smaller
 * (potential future gain, not a defect of the bound).
 *
 * COROLLARY E1 (equimodular pictures - UNCONDITIONAL).
 *  (i) Coordinate picture (W = all L standard coordinates of C^L):
 *      K(x,x) = 1 for every x, so |y(x)| <= ||y||_2 with constant EXACTLY 1,
 *      no spectral hypothesis at all. The pointwise step therefore costs at
 *      most a factor 1 on top of the recorded l2 weld bound.
 *  (ii) DFT picture: the unitary DFT basis of C^L has |phi_xi(n)|^2 = 1/L
 *      for every mode xi and every point n, so for ANY mode set W
 *      K_W(n,n) = |W|/L <= 1 AT EVERY n - the duality constant is
 *      evaluation-point INDEPENDENT. The "both seam sides / every window
 *      parameter" quantifier (insofar as it moves the evaluation point) is
 *      EXACT and free at this step, not estimated.
 *  CONTINUUM CAVEAT (why residual (c) was a real gap): on a continuum L2
 *  space pointwise evaluation is UNBOUNDED without a finite-dimensionality
 *  or band-limitation hypothesis; the lemma is what makes it finite, and
 *  for a band of measure Omega the same argument gives the classical
 *  band-limited bound |f(x)| <= sqrt(Omega) ||f||_2.
 *
 * LEMMA F (trace identity - UNCONDITIONAL). On an L-point set with counting
 * measure, sum_x K_W(x,x) = sum_{i in W} ||phi_i||^2 = |W| for EVERY
 * orthonormal family. Hence the AVERAGE of the squared duality constant is
 * |W|/L in every picture; the equimodular picture is exactly the one whose
 * worst case equals that average. A non-equimodular carrier picture can
 * concentrate: the constant at a specific point can exceed sqrt(|W|/L)
 * (classical Christoffel-function endpoint growth for polynomial-moment
 * systems - cross-checked below on an 18-mode power-moment system, matching
 * the 18-moment carrier dimension of Gate 2).
 *
 * THEOREM G (conditional budget assembly at p = 97). Chaining Lemma E after
 * the recorded conditional weld reduction and the Theorem-D closed form:
 *   |([B, Pi_p] f)(x)| <= sqrt(K_W(x,x)) * C * sqrt(K * S_bar) * ||f||,
 * and with S_bar(97, mu=1) = 0.0381116..., sqrt(S_bar) = 0.1952220...,
 * the strict open-family target holds iff the residual constant product
 *   Q := sqrt(K_W(x,x)) * C * sqrt(K) * ||f||
 * satisfies Q < 0.27968819555261474 / sqrt(S_bar) = 1.4326672... Since
 * sqrt(K_W(x,x)) <= 1 in either equimodular picture (Corollary E1), the
 * duality step is NOT the binding constraint - the entire load moves to the
 * already-named constants (packet constant C for the paper phase, curvature
 * normalization mu, overlap K) plus ONE new finite object: the Christoffel
 * diagonal K_17(x,x) = sum_{i=0..17} |phi_i(x)|^2 of the actual 18-mode
 * carrier system at the seam evaluation points - 18 numbers per point, a
 * concrete finite computation, replacing the abstract "duality step with
 * its own constant". Comparison at unit constants (illustrative): the l1
 * pointwise route caps at 2 p^(-2/3) sum_{j<=48} j^(-1/3) = 1.79768 (6.4x
 * ABOVE the 0.27968... target - it cannot close), while the l2+duality
 * route caps at sqrt(S_bar) = 0.19522 (below target with the 1.4327
 * allowance), a 9.21x separation - the pointwise upgrade of the sqrt(96)
 * l2 gain recorded by the first module.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) Lemma E is Cauchy-Schwarz plus
 * attainment - elementary, but the recorded chain twice names exactly this
 * step as open, and the content here is the EXACT constant (not an
 * estimate), its attainment (no better generic duality step exists - any
 * closure must come from the specific constants or from the weld-range
 * restriction), and the exact point-uniformity of E1(ii); (2) the trap
 * "evaluation costs 1, so the budget closes at C = K = ||f|| = 1" is NOT
 * claimed: C_E,17 is not identified in-repo as ([B,Pi_p]f)(x) with
 * normalized f - that identification (which picture, which normalization)
 * is listed as the open residual it is; (3) the continuum caveat is stated
 * because on continuum L2 the lemma FAILS without band-limitation -
 * unbounded evaluation is exactly why (c) was a gap and not a triviality;
 * (4) Lemma F is not circular: trace = |W| holds even for non-orthogonal
 * normalized families, so the numerics check orthonormality separately via
 * the Gram matrix; (5) the l1-vs-l2 comparison uses the same worst-case
 * curvature min_k |k - h/p| = ||h/p|| on both sides (no asymmetric
 * favoritism), both at unit constants.
 *
 * WHAT REMAINS OPEN (honest residuals):
 *  - the IDENTIFICATION step: expressing C_E,17 (equivalently the
 *    five-shell functional L_N pairing) as an evaluation of a weld output
 *    in a specific orthonormal picture with explicit ||f|| normalization -
 *    not in-repo; until then Theorem G is a budget template, not a bound;
 *  - the Christoffel diagonal K_17(x,x) of the paper 18-mode carrier
 *    system at the seam points (18 numbers per point; equals 18/L only if
 *    that system is equimodular, which is NOT established);
 *  - the packet constant C for the paper phase, the curvature
 *    normalization mu, and the high-curvature ceiling D (unchanged from
 *    the sibling module);
 *  - K at the high-curvature end (dyadic bracket recorded, ceiling open).
 *
 * The numerics below CROSS-CHECK the exact statements on finite models
 * (they are not the claim): kernel attainment and point-uniformity in the
 * DFT picture, the bound on the true finite-Fresnel weld output, the trace
 * identity plus genuine Christoffel concentration on an 18-mode
 * power-moment system, and the budget constants. Import-light (no heavy
 * bundle). Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 */

// ── complex helpers (import-light; local to this module) ────────────────────
const TWO_PI = 2 * Math.PI;

function czero(L) {
  return { re: new Float64Array(L), im: new Float64Array(L) };
}

function randVec(L, seed) {
  let s = seed >>> 0;
  const next = () => {
    s = (Math.imul(1103515245, s) + 12345) >>> 0;
    return (s / 4294967296) * 2 - 1;
  };
  const v = czero(L);
  for (let n = 0; n < L; n++) {
    v.re[n] = next();
    v.im[n] = next();
  }
  return v;
}

function normSq(v) {
  let t = 0;
  for (let n = 0; n < v.re.length; n++) t += v.re[n] * v.re[n] + v.im[n] * v.im[n];
  return t;
}

// ── Lemma E / Corollary E1(ii) in the DFT picture ───────────────────────────
// phi_xi(n) = e(n xi / L) / sqrt(L); W a mode set. Build the kernel k_x and
// verify: (a) |k_x(x)| / ||k_x|| = sqrt(|W|/L) to float precision (attainment),
// (b) no random unit v in H_W exceeds sqrt(|W|/L) at any point,
// (c) K_W(n,n) is identical over ALL n (point-uniformity, exact).
const DFT_L = 64;
const DFT_W = [1, 3, 4, 7, 11, 18, 25, 26, 40, 51, 59, 63]; // 12 arbitrary modes

function dftSynth(coeffs, L, W) {
  // v(n) = (1/sqrt(L)) sum_i c_i e(n W_i / L)
  const v = czero(L);
  const s = 1 / Math.sqrt(L);
  for (let n = 0; n < L; n++) {
    let re = 0;
    let im = 0;
    for (let i = 0; i < W.length; i++) {
      const th = (TWO_PI * n * W[i]) / L;
      const c = Math.cos(th);
      const sn = Math.sin(th);
      re += c * coeffs.re[i] - sn * coeffs.im[i];
      im += sn * coeffs.re[i] + c * coeffs.im[i];
    }
    v.re[n] = re * s;
    v.im[n] = im * s;
  }
  return v;
}

function dftKernelAttainment(x0) {
  // kernel coefficients c_i = conj(phi_i(x0)) = e(-x0 W_i / L)/sqrt(L)
  const m = DFT_W.length;
  const coeffs = { re: new Float64Array(m), im: new Float64Array(m) };
  for (let i = 0; i < m; i++) {
    const th = (-TWO_PI * x0 * DFT_W[i]) / DFT_L;
    coeffs.re[i] = Math.cos(th) / Math.sqrt(DFT_L);
    coeffs.im[i] = Math.sin(th) / Math.sqrt(DFT_L);
  }
  const k = dftSynth(coeffs, DFT_L, DFT_W);
  const valAtX0 = Math.hypot(k.re[x0], k.im[x0]);
  return valAtX0 / Math.sqrt(normSq(k)); // should equal sqrt(|W|/L)
}

const DFT_CONST = Math.sqrt(DFT_W.length / DFT_L);
const ATTAIN_X5 = dftKernelAttainment(5);
const ATTAIN_X40 = dftKernelAttainment(40);

function dftRandomMaxRatio(trials) {
  let worst = 0;
  for (let t = 0; t < trials; t++) {
    const m = DFT_W.length;
    const raw = randVec(m, 9000 + t);
    const nrm = Math.sqrt(normSq(raw));
    const coeffs = { re: new Float64Array(m), im: new Float64Array(m) };
    for (let i = 0; i < m; i++) {
      coeffs.re[i] = raw.re[i] / nrm;
      coeffs.im[i] = raw.im[i] / nrm;
    }
    const v = dftSynth(coeffs, DFT_L, DFT_W);
    for (let n = 0; n < DFT_L; n++) {
      worst = Math.max(worst, Math.hypot(v.re[n], v.im[n]));
    }
  }
  return worst; // must stay <= sqrt(|W|/L)
}

const DFT_RANDOM_MAX = dftRandomMaxRatio(24);

function dftDiagonalSpread() {
  // K_W(n,n) = sum_i |phi_i(n)|^2 = |W|/L exactly, for every n
  let lo = Infinity;
  let hi = -Infinity;
  for (let n = 0; n < DFT_L; n++) {
    let kd = 0;
    for (let i = 0; i < DFT_W.length; i++) {
      const th = (TWO_PI * n * DFT_W[i]) / DFT_L;
      // |e(th)/sqrt(L)|^2 computed the honest way (not simplified by hand)
      const re = Math.cos(th) / Math.sqrt(DFT_L);
      const im = Math.sin(th) / Math.sqrt(DFT_L);
      kd += re * re + im * im;
    }
    lo = Math.min(lo, kd);
    hi = Math.max(hi, kd);
  }
  return { lo, hi, expected: DFT_W.length / DFT_L };
}

const DFT_DIAG = dftDiagonalSpread();

// ── true weld output cross-check (finite Fresnel model, as in the siblings) ─
function phaseMul(v, theta) {
  const L = v.re.length;
  const w = czero(L);
  for (let n = 0; n < L; n++) {
    const c = Math.cos(theta(n));
    const sn = Math.sin(theta(n));
    w.re[n] = c * v.re[n] - sn * v.im[n];
    w.im[n] = sn * v.re[n] + c * v.im[n];
  }
  return w;
}

function dftFull(v) {
  const L = v.re.length;
  const w = czero(L);
  const s = 1 / Math.sqrt(L);
  for (let k = 0; k < L; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < L; n++) {
      const th = (-TWO_PI * n * k) / L;
      const c = Math.cos(th);
      const sn = Math.sin(th);
      re += c * v.re[n] - sn * v.im[n];
      im += sn * v.re[n] + c * v.im[n];
    }
    w.re[k] = re * s;
    w.im[k] = im * s;
  }
  return w;
}

function idftFull(v) {
  const L = v.re.length;
  const w = czero(L);
  const s = 1 / Math.sqrt(L);
  for (let n = 0; n < L; n++) {
    let re = 0;
    let im = 0;
    for (let k = 0; k < L; k++) {
      const th = (TWO_PI * n * k) / L;
      const c = Math.cos(th);
      const sn = Math.sin(th);
      re += c * v.re[k] - sn * v.im[k];
      im += sn * v.re[k] + c * v.im[k];
    }
    w.re[n] = re * s;
    w.im[n] = im * s;
  }
  return w;
}

function weldOutputEvaluationCheck() {
  const p = 5;
  const L = 80;
  const f = randVec(L, 424242);
  const B = (v) =>
    phaseMul(dftFull(phaseMul(v, (n) => (TWO_PI * 7 * n * n) / L)), (n) => (TWO_PI * 3 * n * n) / L);
  const comb = (v) => {
    const w = czero(L);
    for (let n = 0; n < L; n++) {
      if (n % p === 0) {
        w.re[n] = v.re[n];
        w.im[n] = v.im[n];
      }
    }
    return w;
  };
  // y = [B, Pi_p] f
  const y = czero(L);
  const a = B(comb(f));
  const b = comb(B(f));
  for (let n = 0; n < L; n++) {
    y.re[n] = a.re[n] - b.re[n];
    y.im[n] = a.im[n] - b.im[n];
  }
  const yNorm = Math.sqrt(normSq(y));
  let yMax = 0;
  for (let n = 0; n < L; n++) yMax = Math.max(yMax, Math.hypot(y.re[n], y.im[n]));
  // spectral projection onto 20 low modes, then the E1(ii) bound
  const W = 20;
  const yh = dftFull(y);
  const yhTrunc = czero(L);
  for (let k = 0; k < W; k++) {
    yhTrunc.re[k] = yh.re[k];
    yhTrunc.im[k] = yh.im[k];
  }
  const yW = idftFull(yhTrunc);
  const yWNorm = Math.sqrt(normSq(yW));
  let yWMax = 0;
  for (let n = 0; n < L; n++) yWMax = Math.max(yWMax, Math.hypot(yW.re[n], yW.im[n]));
  return {
    coordRatio: yMax / yNorm, // Corollary E1(i): must be <= 1
    bandRatio: yWMax / yWNorm, // Corollary E1(ii): must be <= sqrt(W/L)
    bandCap: Math.sqrt(W / L),
  };
}

const WELD_EVAL = weldOutputEvaluationCheck();

// ── Lemma F + Christoffel concentration on an 18-mode power-moment system ───
// Orthonormalize {1, x, ..., x^17} on 60 equispaced points in [-1, 1]
// (two-pass modified Gram-Schmidt for numerical orthogonality). This is a
// NON-equimodular 18-dimensional carrier-like system: the trace identity
// forces average K(x,x) = 18/60, while the diagonal concentrates hard at the
// endpoints (Christoffel growth) - the duality constant genuinely varies.
function powerMomentSystem(L, m) {
  const xs = new Float64Array(L);
  for (let j = 0; j < L; j++) xs[j] = -1 + (2 * j) / (L - 1);
  const cols = [];
  for (let i = 0; i < m; i++) {
    const c = new Float64Array(L);
    for (let j = 0; j < L; j++) c[j] = Math.pow(xs[j], i);
    cols.push(c);
  }
  const dot = (u, v) => {
    let t = 0;
    for (let j = 0; j < L; j++) t += u[j] * v[j];
    return t;
  };
  const phis = [];
  for (let i = 0; i < m; i++) {
    const v = Float64Array.from(cols[i]);
    for (let pass = 0; pass < 2; pass++) {
      for (const q of phis) {
        const s = dot(q, v);
        for (let j = 0; j < L; j++) v[j] -= s * q[j];
      }
    }
    const nrm = Math.sqrt(dot(v, v));
    for (let j = 0; j < L; j++) v[j] /= nrm;
    phis.push(v);
  }
  // Gram orthonormality residual
  let gramErr = 0;
  for (let a = 0; a < m; a++) {
    for (let b = 0; b < m; b++) {
      const g = dot(phis[a], phis[b]);
      gramErr = Math.max(gramErr, Math.abs(g - (a === b ? 1 : 0)));
    }
  }
  // Christoffel diagonal K(j,j) and trace
  const diag = new Float64Array(L);
  let trace = 0;
  for (let j = 0; j < L; j++) {
    let kd = 0;
    for (const q of phis) kd += q[j] * q[j];
    diag[j] = kd;
    trace += kd;
  }
  let maxDiag = 0;
  let argMax = -1;
  for (let j = 0; j < L; j++) {
    if (diag[j] > maxDiag) {
      maxDiag = diag[j];
      argMax = j;
    }
  }
  // Lemma E attainment in this NON-equimodular picture at the max point
  const kx = czero(L);
  for (const q of phis) {
    for (let j = 0; j < L; j++) kx.re[j] += q[argMax] * q[j];
  }
  const attain = Math.abs(kx.re[argMax]) / Math.sqrt(normSq(kx));
  return {
    gramErr,
    trace,
    avgDiag: trace / L,
    maxDiag,
    argMax,
    endpointConcentration: maxDiag / (m / L),
    attainRatio: attain / Math.sqrt(maxDiag), // should be 1
  };
}

const MOMENT18 = powerMomentSystem(60, 18);

// ── Theorem G budget constants at p = 97 ────────────────────────────────────
const P = 97;
const TARGET = 0.27968819555261474; // strict |C_E,17| target of the open family

function sumPow(m, e) {
  let s = 0;
  for (let j = 1; j <= m; j++) s += Math.pow(j, e);
  return s;
}

const S_BAR_97 = 2 * Math.pow(P, -4 / 3) * sumPow(48, -2 / 3); // Theorem D, mu = 1
const SQRT_S_BAR = Math.sqrt(S_BAR_97);
const ALLOWANCE_Q = TARGET / SQRT_S_BAR; // closure iff Q < this
const L1_POINTWISE_CAP = 2 * Math.pow(P, -2 / 3) * sumPow(48, -1 / 3);
const L1_OVER_L2_RATIO = L1_POINTWISE_CAP / SQRT_S_BAR;

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_EVALUATION_CHRISTOFFEL_DUALITY = {
  ticket: "imp-95008 (continuation: residual (c) - the l2-to-pointwise duality step)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture conditional alias-coupling reduction box; imp-95008-weld-alias-l2-collapse.js residual (c); imp-95008-alias-separation-curvature-floor.js; Lean five_shell_identity (E97 as an L_N functional pairing)",
  lemmaE:
    "UNCONDITIONAL, exact, attained: for a finite orthonormal system, sup{|v(x)| : v in H_W, ||v|| <= 1} = sqrt(K_W(x,x)) with K_W(x,x) = sum_i |phi_i(x)|^2 (inverse Christoffel function), attained at the normalized reproducing kernel. Sharp over H_W; over the weld range it can only be smaller.",
  corollaryE1:
    "UNCONDITIONAL: coordinate picture gives constant exactly 1 with no hypothesis; DFT picture gives K_W(n,n) = |W|/L <= 1 at EVERY n, so the duality constant is evaluation-point independent - the seam-side/window quantifier is exact and free at this step. Continuum caveat: without band-limitation, L2 evaluation is unbounded, which is why residual (c) was a genuine gap.",
  lemmaF:
    "UNCONDITIONAL trace identity: sum_x K_W(x,x) = |W| in every orthonormal picture, so the average squared duality constant is |W|/L; non-equimodular carrier pictures can concentrate above it (Christoffel endpoint growth), cross-checked on an 18-mode power-moment system.",
  theoremG:
    "CONDITIONAL budget assembly: |([B,Pi_p]f)(x)| <= sqrt(K_W(x,x)) C sqrt(K S_bar) ||f||; at p = 97, mu = 1 the strict target holds iff Q = sqrt(K_W(x,x)) C sqrt(K) ||f|| < 1.4326672. Since sqrt(K_W) <= 1 in equimodular pictures, the duality step is NOT binding; the load moves to C, mu, K, the identification of C_E,17 as a weld evaluation, and the 18-mode carrier Christoffel diagonal at the seam points (18 numbers per point).",
  numbersAtP97: {
    sBar: S_BAR_97,
    sqrtSBar: SQRT_S_BAR,
    strictTarget: TARGET,
    allowanceQ: ALLOWANCE_Q,
    l1PointwiseCap: L1_POINTWISE_CAP,
    l1OverL2Ratio: L1_OVER_L2_RATIO,
  },
  namedResiduals: [
    "IDENTIFICATION: expressing C_E,17 (the five-shell L_N pairing) as an evaluation of a weld output in a specific orthonormal picture with explicit ||f|| normalization is not in-repo; Theorem G is a budget template until then",
    "the Christoffel diagonal K_17(x,x) of the paper 18-mode carrier system at the seam evaluation points (equals 18/L only if that system is equimodular, which is NOT established)",
    "the packet constant C for the paper phase, the curvature normalization mu, and the high-curvature ceiling D (unchanged)",
    "overlap K at the high-curvature end (dyadic bracket recorded, ceiling open)",
  ],
  isRigorous: true,
  rigorScope:
    "Lemma E, Corollary E1 and Lemma F are unconditional exact linear algebra; Theorem G is conditional on the previously recorded packet-majorant, overlap and curvature-normalization hypotheses and is a budget template, not a bound. Numerics are cross-checks of the exact statements, not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS SUB-LEMMA closing the residual-(c) duality step: the l2-to-pointwise constant is EXACTLY the diagonal reproducing kernel sqrt(K_W(x,x)) (attained - no better generic duality step exists), equal to sqrt(|W|/L) at every point in the DFT picture and at most 1 in the coordinate picture, with average |W|/L in every picture by the trace identity. The weld budget allowance for all remaining constants is 1.4327 at p = 97, so the pointwise step is not the binding constraint; residual (c) transforms into the finite identification + 18-mode Christoffel computation named above. Changes no bound; NO QED. No refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_EVALUATION_CHRISTOFFEL_DUALITY_ASSERTIONS = [
  {
    id: "imp95008c-kernel-attains-exact-constant",
    description:
      "Lemma E attainment in the DFT picture: |k_x(x)|/||k_x|| equals sqrt(|W|/L) to float precision at two evaluation points",
    holds: () =>
      Math.abs(ATTAIN_X5 - DFT_CONST) < 1e-12 && Math.abs(ATTAIN_X40 - DFT_CONST) < 1e-12,
  },
  {
    id: "imp95008c-random-unit-vectors-never-exceed",
    description: "24 random unit vectors of H_W stay pointwise below sqrt(|W|/L) (+1e-12)",
    holds: () => DFT_RANDOM_MAX <= DFT_CONST + 1e-12 && DFT_RANDOM_MAX > 0.5 * DFT_CONST,
  },
  {
    id: "imp95008c-dft-diagonal-point-uniform",
    description:
      "Corollary E1(ii): K_W(n,n) = |W|/L at EVERY n in the DFT picture (spread < 1e-12) - the seam/window quantifier is free at this step",
    holds: () =>
      Math.abs(DFT_DIAG.lo - DFT_DIAG.expected) < 1e-12 &&
      Math.abs(DFT_DIAG.hi - DFT_DIAG.expected) < 1e-12,
  },
  {
    id: "imp95008c-true-weld-output-respects-both-pictures",
    description:
      "the finite-Fresnel weld output [B,Pi_p]f obeys the coordinate-picture constant 1 and, band-limited to 20 of 80 modes, the sqrt(W/L) = 0.5 constant",
    holds: () =>
      WELD_EVAL.coordRatio <= 1 + 1e-9 &&
      WELD_EVAL.bandRatio <= WELD_EVAL.bandCap + 1e-9 &&
      Math.abs(WELD_EVAL.bandCap - 0.5) < 1e-15,
  },
  {
    id: "imp95008c-moment-system-orthonormal",
    description: "the 18-mode power-moment system is numerically orthonormal (Gram residual < 1e-8)",
    holds: () => MOMENT18.gramErr < 1e-8,
  },
  {
    id: "imp95008c-trace-identity-exact",
    description: "Lemma F: trace of the Christoffel diagonal equals |W| = 18 (to 1e-9), so the average is 18/60",
    holds: () =>
      Math.abs(MOMENT18.trace - 18) < 1e-9 && Math.abs(MOMENT18.avgDiag - 0.3) < 1e-10,
  },
  {
    id: "imp95008c-christoffel-concentration-real",
    description:
      "non-equimodular concentration: the 18-mode moment system max diagonal exceeds 1.5x the average (endpoint Christoffel growth) - the carrier-picture constant is a genuine open number, not decoration",
    holds: () => MOMENT18.endpointConcentration > 1.5,
  },
  {
    id: "imp95008c-attainment-nonequimodular",
    description: "Lemma E attainment also holds in the non-equimodular picture (kernel ratio = 1 to 1e-8)",
    holds: () => Math.abs(MOMENT18.attainRatio - 1) < 1e-8,
  },
  {
    id: "imp95008c-budget-allowance-exceeds-one",
    description:
      "Theorem G at p = 97: sqrt(S_bar) in (0.1945, 0.1960) and the residual-constant allowance Q_max = target/sqrt(S_bar) in (1.4326, 1.4328) - strictly above 1, so an equimodular duality constant is never the binding factor",
    holds: () =>
      SQRT_S_BAR > 0.1945 &&
      SQRT_S_BAR < 0.196 &&
      ALLOWANCE_Q > 1.4326 &&
      ALLOWANCE_Q < 1.4328 &&
      ALLOWANCE_Q > 1,
  },
  {
    id: "imp95008c-l1-route-fails-l2-route-fits",
    description:
      "at unit constants the l1 pointwise cap 1.7977 exceeds the 0.27968... target (route closed) while sqrt(S_bar) = 0.1952 sits below it; separation ratio in (9.1, 9.3)",
    holds: () =>
      L1_POINTWISE_CAP > TARGET &&
      L1_POINTWISE_CAP > 1.79 &&
      L1_POINTWISE_CAP < 1.81 &&
      SQRT_S_BAR < TARGET &&
      L1_OVER_L2_RATIO > 9.1 &&
      L1_OVER_L2_RATIO < 9.3,
  },
  {
    id: "imp95008c-honesty-gate-no-qed",
    description:
      "promotes no bound, keeps the identification + carrier-Christoffel + (C, mu, D, K) residuals named, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95008_EVALUATION_CHRISTOFFEL_DUALITY.promotesBound === false &&
      IMP95008_EVALUATION_CHRISTOFFEL_DUALITY.namedResiduals.length === 4 &&
      /NO QED/.test(IMP95008_EVALUATION_CHRISTOFFEL_DUALITY.verdict) &&
      /refereed bound is changed/i.test(IMP95008_EVALUATION_CHRISTOFFEL_DUALITY.verdict),
  },
];

for (const a of IMP95008_EVALUATION_CHRISTOFFEL_DUALITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95008-evaluation-christoffel-duality assertion failed: ${a.id}`
    );
  }
}

export default IMP95008_EVALUATION_CHRISTOFFEL_DUALITY;
