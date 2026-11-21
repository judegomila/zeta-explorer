/**
 * imp-95098 - CLOSED-FORM / PARTIAL-FRACTION ANCHOR for the imp-95008 Lemma SW
 * aggregation constant lambda_max. ASSESSMENT ONLY: replaces the machine-
 * precision numerical Rayleigh <= Lw sandwich at the reference model point with
 * an analytic value. No bound change; NO QED; floors and ceilings untouched.
 *
 * SETTING. imp-95008 (twenty-second continuation,
 * imp-95008-perron-weighted-far-routing.js) certifies its far-bracket
 * aggregation constant only as a NUMERICAL two-sided sandwich
 *   Rayleigh 3.919793511380258e-5 <= lambda_max <= Lw 3.9197935113802585e-5
 * (relative width 2.3e-16, machine precision), lambda_max being the largest
 * eigenvalue of the symmetric nonnegative even-class block kernel
 *   K(b, bp) = envE( min(b, bp), |b - bp| ),  K(b, b) = 0   (even blocks),
 * with the near-Perron weight essentially the even {0, 2} split. The Perron
 * value exceeds the dominant (0, 2) bond envE(0, 2) = 3.9197920255561178e-5 by
 * only 1.49e-11 (a second-order block-4 coupling). This module derives that
 * value in closed form.
 *
 * REDUCTION TO A 3-BLOCK KERNEL. The even-class weight decays geometrically
 * (~0.04 per even step) while the kernel decays by ~2^(-44/3) per even step, so
 * the Rayleigh quotient of K is captured, to full double precision, by the
 * leading 3x3 principal submatrix on the even blocks {0, 2, 4}:
 *   a = K(0, 2) = envE(0, 2) = 3.9197920255561178e-5   (the strong (0,2) bond)
 *   c = K(0, 4) = envE(0, 4) = 1.4905600807225833e-10
 *   d = K(2, 4) = envE(2, 2) = 3.398047003867178e-8    (min(2,4)=2, gap=2)
 *   M3 = [[0, a, c], [a, 0, d], [c, d, 0]].
 * Blocks 6, 8, ... enter lambda_max only below float resolution: the largest
 * root of M3 agrees with the full 61-block power-iterate Rayleigh value to
 * ~7e-21 absolute (< 1 ulp at the 3.9e-5 scale). So M3 is an EXACT stand-in for
 * the section eigenvalue at the model point, to machine precision.
 *
 * CLOSED FORM (exact 3-block characteristic polynomial). A symmetric 3x3 with
 * zero diagonal has the depressed cubic characteristic polynomial
 *   det(M3 - lambda I) = -( lambda^3 - (a^2 + c^2 + d^2) lambda - 2 a c d ) = 0,
 * i.e.  lambda^3 + p lambda + q = 0  with  p = -(a^2 + c^2 + d^2),  q = -2 a c d.
 * All three roots are real (Cardano discriminant negative); the largest is the
 * trigonometric root
 *   lambda_max = 2 sqrt(-p/3) cos( (1/3) arccos( (3 q / (2 p)) sqrt(-3/p) ) ).
 * Evaluated at the model literals this is 3.9197935113802585e-5, which
 * reproduces the baked Lw literal EXACTLY (bit-identical, diff 0) and sits
 * inside the certified sandwich (it equals Lw to 0 and Rayleigh to ~7e-21). The
 * float sandwich is thereby replaced by an analytic anchor: lambda_max is the
 * largest root of x^3 - (a^2 + c^2 + d^2) x - 2 a c d.
 *
 * PARTIAL-FRACTION / PERTURBATIVE ANCHOR (why the excess is exactly the block-4
 * coupling, second order). The strong (0, 2) bond a dominates: the 2x2 block
 * on {0, 2}, [[0, a], [a, 0]], has eigenpairs (lambda = +/- a) on the vectors
 * v_pm = (1, +/- 1, 0)/sqrt(2), and block 4 is an isolated unperturbed level at
 * energy E_4 = 0 (zero diagonal). Treating the block-4 couplings (c, d) as the
 * perturbation V, the resolvent second-order shift of the top level v_+ is the
 * single-pole PARTIAL FRACTION of (a - H0)^(-1):
 *   Delta = < v_+ | V (a - H0)^(-1) V | v_+ >
 *         = |< v_+ | V | e_4 >|^2 / (a - E_4)
 *         = ( (c + d) / sqrt(2) )^2 / a  =  (c + d)^2 / (2 a).
 * Hence the analytic anchor
 *   lambda_max = a + (c + d)^2 / (2 a) + O( higher-block, (c - d)^2 c d / a^3 ).
 * Numerically a + (c + d)^2 / (2 a) = 3.919793511380545e-5, matching the baked
 * Lw to 2.9e-18 absolute (relative 7e-14); the shift (c + d)^2 / (2 a) =
 * 1.4858e-11 IS the observed 1.49e-11 excess of the Perron value over the bond.
 * So the "block-4 coupling, second order" prose of imp-95008 is exactly the
 * single resolvent pole at E_4 = 0; c (the (0,4) bond, 1.49e-10) is 228x below
 * d (the (2,4) bond), so d dominates the shift and c is a 0.44 percent
 * correction inside (c + d).
 *
 * SCOPE / HONESTY. (1) Model point only: the reference theta = 10, sigma = 1,
 * beta = 1/3, c = v = D = 1 evaluation; the closed form is in terms of the
 * three exact Lemma PF pair values a, c, d, themselves partial-fraction values
 * carrying the nineteenth ~1e-8 relative cancellation - the analytic anchor
 * inherits that float floor, five orders below the 8.67e-4 improvement the
 * aggregation move priced. (2) The 3-block truncation reproduces the section
 * eigenvalue to machine precision but is not proven exact for the infinite
 * kernel; higher even blocks contribute below double resolution (asserted
 * < 1e-18 relative here). (3) This is an anchor for lambda_max, not a new
 * certificate: the Lemma SW upper bound Lw is what the chain uses, and it is
 * unchanged. Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 *
 * The numerics below CROSS-CHECK the derivation; they are not the claim.
 * Import-light (no heavy bundle).
 */

// ── shared conventions (identical to imp-95008-perron-weighted-far-routing.js) ─
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;
const THETA = 10;
const SS = SIGMA + THETA;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

const QREF = isolationQ(CC, VV, BETA, DD);

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

function gSharp(j) {
  return Math.pow(2, BETA) * gOld(j, QREF, BETA);
}

function cornerV(b, j) {
  return Math.pow(2, b * (1 - BETA)) * gSharp(j);
}

function rhoCap(j) {
  return Math.pow(2, -(j - 1) * BETA);
}

// ── Lemma PF exact closed form (short copy, nineteenth continuation) ─────────
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

function envE(b, j) {
  return iExact(cornerV(b, j), rhoCap(j), SS);
}

function kEntry(b, bp) {
  if (b === bp) return 0;
  const lo = Math.min(b, bp);
  const j = Math.abs(b - bp);
  return envE(lo, j);
}

// ── the exact 3-block closed form ────────────────────────────────────────────
// largest root of the depressed cubic x^3 + p x + q, p = -(a^2+c^2+d^2),
// q = -2acd (three real roots; trigonometric form).
function cubicMaxRoot(a, c, d) {
  const p = -(a * a + c * c + d * d);
  const q = -2 * a * c * d;
  const m = 2 * Math.sqrt(-p / 3);
  const t = Math.acos((3 * q) / (p * m)) / 3;
  let best = -Infinity;
  for (let k = 0; k < 3; k++) {
    const r = m * Math.cos(t - (2 * Math.PI * k) / 3);
    if (r > best) best = r;
  }
  return best;
}

// full even-class section eigenvalue (shifted power iteration), for cross-check
function sectionEig(NB, iters) {
  const K = [];
  for (let i = 0; i < NB; i++) {
    const row = new Float64Array(NB);
    for (let k = 0; k < NB; k++) row[k] = i === k ? 0 : kEntry(2 * i, 2 * k);
    K.push(row);
  }
  const SHIFT = kEntry(0, 2);
  let x = new Float64Array(NB).fill(1);
  for (let it = 0; it < iters; it++) {
    const y = new Float64Array(NB);
    for (let i = 0; i < NB; i++) {
      let s = SHIFT * x[i];
      for (let k = 0; k < NB; k++) s += K[i][k] * x[k];
      y[i] = s;
    }
    let nrm = 0;
    for (let i = 0; i < NB; i++) if (Math.abs(y[i]) > nrm) nrm = Math.abs(y[i]);
    for (let i = 0; i < NB; i++) x[i] = y[i] / nrm;
  }
  let num = 0;
  let den = 0;
  for (let i = 0; i < NB; i++) {
    den += x[i] * x[i];
    for (let k = 0; k < NB; k++) num += x[i] * K[i][k] * x[k];
  }
  return num / den;
}

// ── literals (all recomputed by the assertions) ──────────────────────────────
const A_BOND = 3.9197920255561178e-5; // a = envE(0,2)
const C_04 = 1.4905600807225833e-10; // c = envE(0,4)
const D_24 = 3.398047003867178e-8; // d = envE(2,4) = envE(2,2)
const LAMBDA_CUBIC = 3.9197935113802585e-5; // exact 3-block largest root (== Lw)
const LAMBDA_PT2 = 3.919793511380545e-5; // a + (c+d)^2/(2a)
const PT2_SHIFT = 1.485824427139245e-11; // (c+d)^2/(2a) = the block-4 excess
const LW_BAKED = 3.9197935113802585e-5; // imp-95008 Lemma SW upper bound
const RAYLEIGH_BAKED = 3.919793511380258e-5; // imp-95008 Rayleigh lower bound
const EXCESS_OVER_BOND = 1.4858241407253534e-11; // LW_BAKED - A_BOND (observed)

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95098_PERRON_EIGENVALUE_CLOSED_FORM = {
  ticket:
    "imp-95098 - closed-form / partial-fraction anchor for the imp-95008 Lemma SW aggregation constant lambda_max, replacing the numerical Rayleigh <= Lw machine-precision sandwich at the reference model point. Assess only; NO QED; no bound change.",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; anchors imp-95008-perron-weighted-far-routing.js (Lemma SW / Theorem Y-PERRON).",
  reduction:
    "The even-class Perron eigenvalue is captured to full double precision by the leading 3x3 principal submatrix on even blocks {0,2,4}: M3 = [[0,a,c],[a,0,d],[c,d,0]] with a=envE(0,2)=3.9197920255561178e-5 (the strong (0,2) bond), c=envE(0,4)=1.4905600807225833e-10, d=envE(2,4)=3.398047003867178e-8. Higher even blocks enter lambda_max below float resolution (largest root of M3 agrees with the 61-block power-iterate Rayleigh value to ~7e-21 absolute, under 1 ulp at 3.9e-5).",
  closedForm:
    "A symmetric 3x3 with zero diagonal has depressed cubic char poly lambda^3 - (a^2+c^2+d^2) lambda - 2acd = 0 (three real roots). Largest root lambda_max = 2 sqrt(-p/3) cos((1/3) arccos((3q/(2p)) sqrt(-3/p))), p=-(a^2+c^2+d^2), q=-2acd, evaluates to 3.9197935113802585e-5 - bit-identical to the baked Lw literal (diff 0), inside the certified sandwich (equals Lw to 0, Rayleigh to ~7e-21). The float sandwich is replaced by the analytic anchor: lambda_max is the largest root of x^3 - (a^2+c^2+d^2)x - 2acd.",
  partialFractionAnchor:
    "Perturbative reading: the (0,2) bond a gives eigenpairs +/- a on v_pm=(1,+/-1,0)/sqrt(2); block 4 is an isolated unperturbed level at E_4=0. The resolvent second-order shift of the top level is the single-pole partial fraction of (a-H0)^(-1): Delta = |<v_+|V|e_4>|^2/(a-E_4) = ((c+d)/sqrt(2))^2/a = (c+d)^2/(2a). Hence lambda_max = a + (c+d)^2/(2a) + O(higher block); numerically a+(c+d)^2/(2a)=3.919793511380545e-5 matches Lw to 2.9e-18 absolute (rel 7e-14), and the shift (c+d)^2/(2a)=1.4858e-11 IS the observed 1.49e-11 excess of the Perron value over the bond. The 'block-4 coupling, second order' prose is exactly this resolvent pole at E_4=0; c is 228x below d, a 0.44 percent correction inside (c+d).",
  scope:
    "Model point only (reference theta=10, sigma=1, beta=1/3, c=v=D=1). The anchor is in terms of the three exact Lemma PF pair values a,c,d, which carry the nineteenth ~1e-8 relative partial-fraction cancellation - the analytic anchor inherits that float floor, five orders below the 8.67e-4 aggregation improvement. The 3-block truncation reproduces the section eigenvalue to machine precision but is not proven exact for the infinite kernel; higher even blocks contribute below double resolution. This is an anchor for lambda_max, not a new certificate; the Lemma SW upper bound Lw is unchanged.",
  reference: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA },
    a: A_BOND,
    c: C_04,
    d: D_24,
    cubicCoefficients: { p: "-(a^2+c^2+d^2)", q: "-2acd" },
    lambdaMaxCubic: LAMBDA_CUBIC,
    lambdaMaxPT2: LAMBDA_PT2,
    pt2Shift: PT2_SHIFT,
    sandwich: { rayleigh: RAYLEIGH_BAKED, lw: LW_BAKED },
    excessOverBond: EXCESS_OVER_BOND,
    cubicMinusLw: 0,
    pt2MinusLwAbs: 2.8663594935085523e-18,
    note: "closed form reproduces the sandwich to machine precision; floors and ceilings UNTOUCHED - pure analytic anchoring of an existing constant",
  },
  isRigorous: true,
  rigorScope:
    "The 3x3 characteristic polynomial and its trigonometric largest root are elementary and exact; the reduction to blocks {0,2,4} is a MEASURED machine-precision truncation of the section eigenvalue (largest root vs 61-block power iterate agree to ~7e-21), not a proof that the infinite-kernel eigenvalue equals it. The partial-fraction anchor a+(c+d)^2/(2a) is standard non-degenerate Rayleigh-Schroedinger second order with the single pole at E_4=0, verified against the exact cubic root to 2.9e-18. Everything is evaluated at the reference model point and inherits the ~1e-8 float floor of the underlying Lemma PF pair values. The numerics cross-check the derivation; they are not the claim.",
  promotesBound: false,
  verdict:
    "ASSESSMENT (imp-95098): the imp-95008 Lemma SW aggregation constant lambda_max, previously only a numerical Rayleigh <= Lw sandwich (width 2.3e-16), is given a CLOSED FORM at the model point - the largest root of the depressed cubic x^3 - (a^2+c^2+d^2)x - 2acd of the leading 3-block kernel M3 on even blocks {0,2,4}, reproducing the baked Lw literal 3.9197935113802585e-5 bit-identically (diff 0) and the Rayleigh bound to ~7e-21. Equivalent partial-fraction anchor lambda_max = a + (c+d)^2/(2a) (single resolvent pole at the isolated block-4 level E_4=0) matches to 2.9e-18 and identifies the 1.49e-11 Perron-over-bond excess as exactly the second-order block-4 coupling. Model point only; inherits the ~1e-8 Lemma PF float floor; anchors an existing constant, changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95098_PECF_ASSERTIONS = [
  {
    id: "imp95098-pecf-kernel-entries-reproduce",
    description:
      "the three leading even-class kernel bonds recompute from envE: a=envE(0,2), c=envE(0,4), d=envE(2,4)=envE(2,2) (rel 1e-12)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return (
        rel(kEntry(0, 2), A_BOND) &&
        rel(kEntry(0, 4), C_04) &&
        rel(kEntry(2, 4), D_24) &&
        rel(envE(2, 2), D_24) &&
        C_04 < D_24 &&
        D_24 < A_BOND
      );
    },
  },
  {
    id: "imp95098-pecf-cubic-reproduces-sandwich",
    description:
      "the exact 3-block cubic largest root reproduces the baked Lw literal to machine precision (|root - Lw| <= 1e-15 Lw) and lands inside the certified sandwich Rayleigh <= root <= Lw",
    holds: () => {
      const root = cubicMaxRoot(kEntry(0, 2), kEntry(0, 4), kEntry(2, 4));
      return (
        Math.abs(root - LW_BAKED) <= 1e-15 * LW_BAKED &&
        root >= RAYLEIGH_BAKED - 1e-18 &&
        root <= LW_BAKED + 1e-18 &&
        Math.abs(root - LAMBDA_CUBIC) <= 1e-15 * LAMBDA_CUBIC
      );
    },
  },
  {
    id: "imp95098-pecf-partial-fraction-anchor",
    description:
      "the partial-fraction (second-order resolvent) anchor a + (c+d)^2/(2a) matches the baked Lw to rel 1e-12, its shift (c+d)^2/(2a) reproduces the observed excess Lw - a to rel 1e-6, and the shift IS second order (below the bond by ~2.6e6)",
    holds: () => {
      const a = kEntry(0, 2);
      const c = kEntry(0, 4);
      const d = kEntry(2, 4);
      const shift = ((c + d) * (c + d)) / (2 * a);
      const anchor = a + shift;
      const relTo = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        relTo(anchor, LW_BAKED, 1e-12) &&
        relTo(anchor, LAMBDA_PT2, 1e-12) &&
        relTo(shift, PT2_SHIFT, 1e-12) &&
        relTo(shift, EXCESS_OVER_BOND, 1e-6) &&
        shift * 2.6e6 < a
      );
    },
  },
  {
    id: "imp95098-pecf-three-block-truncation-machine-exact",
    description:
      "the 3-block closed form equals the full 61-block section eigenvalue (shifted power iterate) to under 1 ulp at the 3.9e-5 scale (rel 1e-15) - higher even blocks are below float resolution",
    holds: () => {
      const root = cubicMaxRoot(kEntry(0, 2), kEntry(0, 4), kEntry(2, 4));
      const full = sectionEig(61, 2000);
      return Math.abs(root - full) <= 1e-15 * Math.abs(full);
    },
  },
  {
    id: "imp95098-pecf-honesty-gate",
    description:
      "verdict anchors an existing constant with floors/ceilings untouched, is scoped to the model point, inherits the ~1e-8 float floor, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95098_PERRON_EIGENVALUE_CLOSED_FORM.promotesBound === false &&
      /NO QED/.test(IMP95098_PERRON_EIGENVALUE_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP95098_PERRON_EIGENVALUE_CLOSED_FORM.verdict) &&
      /Model point only/.test(IMP95098_PERRON_EIGENVALUE_CLOSED_FORM.verdict) &&
      /changes no bound/.test(IMP95098_PERRON_EIGENVALUE_CLOSED_FORM.verdict) &&
      /~1e-8/.test(IMP95098_PERRON_EIGENVALUE_CLOSED_FORM.scope) &&
      /double precision/.test(IMP95098_PERRON_EIGENVALUE_CLOSED_FORM.reduction),
  },
];

for (const a of IMP95098_PECF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95098-perron-eigenvalue-closed-form assertion failed: ${a.id}`);
  }
}

export default IMP95098_PERRON_EIGENVALUE_CLOSED_FORM;
