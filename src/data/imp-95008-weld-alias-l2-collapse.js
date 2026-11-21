/**
 * imp-95008 — The noncommuting weld [B_v, Pi_p]: exact alias decomposition and
 * a bounded-overlap l2 collapse of the correlated alias coupling.
 *
 * Setting (Permuting the Zeta Twin Ladder, Section 4.5; page
 * /permutation-architecture, "alias-packet coupling" box). The decisive object
 * of the one open family is the weld [B_v, Pi_p] != 0 between the smooth
 * zero-alias B-transform and a prime projection. The nonzero aliases are
 * shifted Fresnel-Airy transition packets at stationary points
 * u = v/(k - h/p), and the page names ONE un-enclosed scalar: the aliased
 * second moment sum_{h != 0} w(h)^2 lambda(h)^(-2/3).
 *
 * This module records two UNCONDITIONAL lemmas and their conditional
 * corollary, which together reduce the five-shell correlated weld coupling to
 * single-shell packet masses and identify the named scalar as the exact
 * quadratic controller of the weld.
 *
 * LEMMA 1 (exact alias decomposition — unconditional). With
 *   Pi_p = (1/p) sum_{h=0..p-1} M_h,   (M_h f)(n) = e(h n / p) f(n),
 * the arithmetic-progression comb (projection onto p | n), EVERY linear
 * operator B satisfies
 *   [B, Pi_p] = (1/p) sum_{h=1..p-1} [B, M_h],
 * because [B, M_0] = [B, I] = 0. The ticket statement "the h = 0 stationary
 * point pairs exactly; only the nonzero aliases create the open packet
 * theorem" is therefore an operator identity, not an estimate: the h = 0 comb
 * component contributes zero commutator defect for ANY B, Fresnel or not.
 *
 * LEMMA 2 (bounded-overlap l2 collapse — unconditional). If vectors
 * a_1, ..., a_m vanish outside index sets S_1, ..., S_m (in any one fixed
 * orthonormal picture) with overlap multiplicity
 *   K = max_xi #{ h : xi in S_h },
 * then
 *   || sum_h a_h ||^2  <=  K * sum_h ||a_h||^2,
 * by pointwise Cauchy-Schwarz over the <= K terms alive at each coordinate;
 * for K = 1 (pairwise disjoint supports) it is an exact Pythagorean EQUALITY.
 *
 * COROLLARY (conditional weld reduction). Let f = sum_{g=1..5} f_g be the
 * five-shell decomposition (Fourier-disjoint supports: the kernel-verified
 * five_shell_identity orthogonality). If the doubly-indexed alias family
 * a_{h,g} = [B, M_h] f_g (h != 0, g = 1..5) admits a picture with overlap
 * multiplicity K, then
 *   ||[B, Pi_p] f||^2  <=  (K / p^2) * sum_{h != 0} sum_g ||[B, M_h] f_g||^2 :
 * the multi-shell correlated weld collapses to SINGLE-SHELL packet masses
 * times one geometric constant (exactly, when K = 1). Feeding the page
 * packet majorant P_h <= C w(h) lambda(h)^(-1/3) ||f|| for the per-alias
 * packet norm P_h = (1/p)||[B, M_h] f|| gives
 *   ||[B, Pi_p] f||^2  <=  C^2 K [ sum_{h != 0} w(h)^2 lambda(h)^(-2/3) ] ||f||^2 —
 * the NAMED sub-gap scalar is the exact quadratic controller of the weld,
 * with the overlap multiplicity K as the only other constant.
 *
 * Quantitative comparison. Against the l1 triangle route (the family refuted
 * as a shell-decoupled majorant by imp-95006), the l2 overlap route at equal
 * packet norms improves by sqrt((p-1)/K): at p = 97 with K = 1 that is
 * sqrt(96) ~ 9.798. HONEST caveat: with K >= 2 and packet mass concentrated
 * on a single alias, the l2 overlap bound can EXCEED the l1 bound — the win
 * is specific to the equidistributed regime (which the equal-weight prime
 * comb w(h) = 1/p inhabits).
 *
 * WHAT REMAINS OPEN (named residuals — none enclosed here):
 *  (a) the overlap multiplicity K of the shifted Fresnel-Airy packets near
 *      the fold: adjacent-h stationary points u = v/(k - h/p) coalesce there,
 *      which is exactly where support disjointness fails (the Airy regime);
 *  (b) the named scalar sum_{h != 0} w(h)^2 lambda(h)^(-2/3) itself, uniform
 *      over 690988 <= N <= 54799999 and both seam sides (unchanged);
 *  (c) the passage from this l2 weld bound to the scalar |C_E,17| — the
 *      five-shell identity evaluates shells AT a point, so a duality or
 *      reproducing-kernel step with its own constant is still required.
 *
 * The numerics below CROSS-CHECK the exact identities and inequalities on a
 * finite cyclic model (they are not the claim): B is a genuine finite Fresnel
 * model chirp-DFT-chirp, Pi_p the exact comb, and the lemma inequalities are
 * exercised on both synthetic families and the true model alias family.
 * Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 */

// ── complex vector helpers (import-light; no heavy bundle) ──────────────────
const TWO_PI = 2 * Math.PI;

function czero(L) {
  return { re: new Float64Array(L), im: new Float64Array(L) };
}

function randVec(L, seed) {
  // deterministic LCG so the cross-check is reproducible
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

function phaseMul(v, theta) {
  // w(n) = exp(i * theta(n)) * v(n)
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

function dft(v) {
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

function axpy(acc, v, s) {
  const L = acc.re.length;
  for (let n = 0; n < L; n++) {
    acc.re[n] += s * v.re[n];
    acc.im[n] += s * v.im[n];
  }
}

function normSq(v) {
  let t = 0;
  const L = v.re.length;
  for (let n = 0; n < L; n++) t += v.re[n] * v.re[n] + v.im[n] * v.im[n];
  return t;
}

// modulation M_h at prime p: (M_h f)(n) = e(h n / p) f(n)
const modulate = (v, h, p) => phaseMul(v, (n) => (TWO_PI * h * n) / p);

// exact comb projection onto multiples of p
function combProject(v, p) {
  const L = v.re.length;
  const w = czero(L);
  for (let n = 0; n < L; n++) {
    if (n % p === 0) {
      w.re[n] = v.re[n];
      w.im[n] = v.im[n];
    }
  }
  return w;
}

// finite Fresnel model: chirp(a) o DFT o chirp(b)
function makeFresnel(a, b, L) {
  return (v) =>
    phaseMul(dft(phaseMul(v, (n) => (TWO_PI * b * n * n) / L)), (n) => (TWO_PI * a * n * n) / L);
}

// ── Lemma 1 cross-check: [B, Pi_p] = (1/p) sum_{h=1..p-1} [B, M_h] ──────────
function aliasDecompositionRelResidual(p, L, seed) {
  const f = randVec(L, seed);
  const B = makeFresnel(3, 7, L);
  // lhs = B(Pi f) - Pi(B f)
  const lhs = czero(L);
  axpy(lhs, B(combProject(f, p)), 1);
  axpy(lhs, combProject(B(f), p), -1);
  // rhs = (1/p) sum_{h=1..p-1} (B(M_h f) - M_h(B f))
  const rhs = czero(L);
  const Bf = B(f);
  for (let h = 1; h < p; h++) {
    axpy(rhs, B(modulate(f, h, p)), 1 / p);
    axpy(rhs, modulate(Bf, h, p), -1 / p);
  }
  const diff = czero(L);
  axpy(diff, lhs, 1);
  axpy(diff, rhs, -1);
  return Math.sqrt(normSq(diff) / (normSq(lhs) + 1e-300));
}

const ALIAS_DECOMP_RESID_P5 = aliasDecompositionRelResidual(5, 80, 20260828);
const ALIAS_DECOMP_RESID_P7 = aliasDecompositionRelResidual(7, 84, 424242);

// comb identity cross-check: Pi_p f = (1/p) sum_{h=0..p-1} M_h f (exact)
function combIdentityRelResidual(p, L, seed) {
  const f = randVec(L, seed);
  const lhs = combProject(f, p);
  const rhs = czero(L);
  for (let h = 0; h < p; h++) axpy(rhs, modulate(f, h, p), 1 / p);
  const diff = czero(L);
  axpy(diff, lhs, 1);
  axpy(diff, rhs, -1);
  return Math.sqrt(normSq(diff) / (normSq(lhs) + 1e-300));
}

const COMB_IDENTITY_RESID = combIdentityRelResidual(5, 80, 777);

// ── Lemma 2 cross-checks ────────────────────────────────────────────────────
// (i) K = 1: four random band-vectors with pairwise disjoint supports — the
// collapse must be an exact Pythagorean equality.
function pythagorasK1RelGap() {
  const L = 80;
  const bands = [0, 20, 40, 60].map((off, i) => {
    const src = randVec(L, 1000 + i);
    const v = czero(L);
    for (let n = off; n < off + 10; n++) {
      v.re[n] = src.re[n];
      v.im[n] = src.im[n];
    }
    return v;
  });
  const total = czero(L);
  let sumSq = 0;
  for (const b of bands) {
    axpy(total, b, 1);
    sumSq += normSq(b);
  }
  return Math.abs(normSq(total) - sumSq) / sumSq;
}

const PYTHAGORAS_K1_RELGAP = pythagorasK1RelGap();

// (ii) K = 2: three all-ones bands [0,20), [10,30), [20,40) — overlap
// multiplicity exactly 2. Constructive overlap makes ||sum||^2 = 100 against
// sum of squares 60: the K = 1 formula genuinely FAILS (100 > 60) while the
// K = 2 bound holds (100 <= 120). The overlap constant is load-bearing.
function overlapK2Case() {
  const L = 80;
  const mk = (lo, hi) => {
    const v = czero(L);
    for (let n = lo; n < hi; n++) v.re[n] = 1;
    return v;
  };
  const fam = [mk(0, 20), mk(10, 30), mk(20, 40)];
  const total = czero(L);
  let sumSq = 0;
  for (const b of fam) {
    axpy(total, b, 1);
    sumSq += normSq(b);
  }
  return { totalSq: normSq(total), sumSq, K: 2 };
}

const OVERLAP_K2 = overlapK2Case();

// (iii) the TRUE model alias family: a_h = [B, M_h] f for the finite Fresnel
// model. Measure the actual overlap multiplicity K in the standard picture
// (structural zeros only, tolerance-thresholded) and check the lemma bound
// against the measured K.
function weldFamilyOverlapCheck(p, L, seed) {
  const f = randVec(L, seed);
  const B = makeFresnel(3, 7, L);
  const Bf = B(f);
  const fam = [];
  for (let h = 1; h < p; h++) {
    const a = czero(L);
    axpy(a, B(modulate(f, h, p)), 1);
    axpy(a, modulate(Bf, h, p), -1);
    fam.push(a);
  }
  let gmax = 0;
  for (const a of fam) {
    for (let n = 0; n < L; n++) {
      gmax = Math.max(gmax, Math.abs(a.re[n]), Math.abs(a.im[n]));
    }
  }
  const tol = 1e-9 * gmax;
  let K = 0;
  for (let n = 0; n < L; n++) {
    let c = 0;
    for (const a of fam) {
      if (Math.abs(a.re[n]) > tol || Math.abs(a.im[n]) > tol) c += 1;
    }
    K = Math.max(K, c);
  }
  const total = czero(L);
  let sumSq = 0;
  for (const a of fam) {
    axpy(total, a, 1);
    sumSq += normSq(a);
  }
  return { totalSq: normSq(total), sumSq, K, m: p - 1 };
}

const WELD_FAMILY = weldFamilyOverlapCheck(5, 80, 555);

// ── regime comparison: l2-overlap bound vs l1 triangle bound ────────────────
// equidistributed (m = 4 equal norms 1, K = 2): l2 = sqrt(2*4) < l1 = 4
const EQUI_L2 = Math.sqrt(2 * 4);
const EQUI_L1 = 4;
// concentrated (norms 1 and 0.01, K = 2): l2 = sqrt(2*(1 + 1e-4)) > l1 = 1.01
const CONC_L2 = Math.sqrt(2 * (1 + 0.0001));
const CONC_L1 = 1.01;

// conditional illustration at the telescope prime p = 97 with K = 1
const GAIN_P97_K1 = Math.sqrt(96);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_WELD_ALIAS_L2_COLLAPSE = {
  ticket: 'imp-95008',
  source: 'Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture alias-packet coupling box; imp-95006 obstruction',
  lemma1:
    'Exact alias decomposition (unconditional): [B, Pi_p] = (1/p) sum_{h=1..p-1} [B, M_h] for every linear operator B; the h = 0 comb component contributes zero commutator defect.',
  lemma2:
    'Bounded-overlap l2 collapse (unconditional): supports with overlap multiplicity K give ||sum a_h||^2 <= K sum ||a_h||^2; exact Pythagorean equality at K = 1.',
  corollary:
    'Conditional weld reduction: overlap multiplicity K for the alias family {[B, M_h] f_g} gives ||[B,Pi_p]f||^2 <= (K/p^2) sum_{h,g} ||[B,M_h] f_g||^2, collapsing the five-shell correlated weld to single-shell packet masses; with the page packet majorant this is <= C^2 K [sum_{h != 0} w(h)^2 lambda(h)^(-2/3)] ||f||^2, so the named sub-gap scalar is the exact quadratic controller of the weld.',
  gainFactorP97K1: GAIN_P97_K1,
  concentrationCaveat:
    'With K >= 2 and packet mass concentrated on one alias the l2 overlap bound can exceed the l1 triangle bound; the sqrt((p-1)/K) win is specific to the equidistributed regime of the equal-weight prime comb.',
  namedResiduals: [
    'overlap multiplicity K of the shifted Fresnel-Airy packets near the fold (coalescing stationary points u = v/(k - h/p)) is not enclosed',
    'the scalar sum_{h != 0} w(h)^2 lambda(h)^(-2/3) uniform over 690988 <= N <= 54799999 and both seam sides is not enclosed (unchanged)',
    'the passage from the l2 weld bound to the pointwise scalar |C_E,17| (shells evaluated AT a point) needs a separate duality or reproducing-kernel step',
  ],
  isRigorous: true,
  rigorScope:
    'Lemmas 1 and 2 are unconditional; the weld reduction is conditional on the stated overlap-multiplicity hypothesis and on the page packet majorant. Numerics are cross-checks of the exact identities, not the claim.',
  promotesBound: false,
  verdict:
    'RIGOROUS SUB-LEMMA, conditional reduction: the five-shell correlated alias coupling of the weld [B_v, Pi_p] collapses to single-shell packet masses times one overlap constant K, and the named sub-gap scalar controls the weld quadratically. K near the fold, the scalar itself, and the l2-to-scalar step remain open. Changes no bound; NO QED. No refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_WELD_ALIAS_L2_COLLAPSE_ASSERTIONS = [
  {
    id: 'imp95008-alias-decomposition-exact-p5',
    description: 'Lemma 1 identity holds to float precision at p=5, L=80 for the finite Fresnel model',
    holds: () => ALIAS_DECOMP_RESID_P5 < 1e-10,
  },
  {
    id: 'imp95008-alias-decomposition-exact-p7',
    description: 'Lemma 1 identity holds to float precision at p=7, L=84',
    holds: () => ALIAS_DECOMP_RESID_P7 < 1e-10,
  },
  {
    id: 'imp95008-comb-is-modulation-average',
    description: 'Pi_p = (1/p) sum_h M_h reproduces the exact comb projection',
    holds: () => COMB_IDENTITY_RESID < 1e-10,
  },
  {
    id: 'imp95008-pythagoras-at-K1',
    description: 'disjoint supports give exact Pythagorean equality (K=1 collapse)',
    holds: () => PYTHAGORAS_K1_RELGAP < 1e-12,
  },
  {
    id: 'imp95008-overlap-constant-load-bearing',
    description: 'K=2 family: ||sum||^2 = 100 exceeds sum of squares 60 (K=1 formula fails) but respects the K=2 bound 120',
    holds: () =>
      OVERLAP_K2.totalSq > OVERLAP_K2.sumSq * 1.000001 &&
      OVERLAP_K2.totalSq <= OVERLAP_K2.K * OVERLAP_K2.sumSq * (1 + 1e-12) &&
      Math.abs(OVERLAP_K2.totalSq - 100) < 1e-9 &&
      Math.abs(OVERLAP_K2.sumSq - 60) < 1e-9,
  },
  {
    id: 'imp95008-true-weld-family-respects-measured-K',
    description: 'the actual model alias family [B,M_h]f satisfies the lemma bound at its measured overlap multiplicity',
    holds: () =>
      WELD_FAMILY.K >= 1 &&
      WELD_FAMILY.K <= WELD_FAMILY.m &&
      WELD_FAMILY.totalSq <= WELD_FAMILY.K * WELD_FAMILY.sumSq * (1 + 1e-9),
  },
  {
    id: 'imp95008-regime-comparison',
    description: 'l2-overlap beats l1 in the equidistributed regime and can lose under concentration',
    holds: () => EQUI_L2 < EQUI_L1 && CONC_L2 > CONC_L1,
  },
  {
    id: 'imp95008-gain-figure-p97',
    description: 'conditional K=1 gain at p=97 is sqrt(96) ~ 9.798',
    holds: () => Math.abs(GAIN_P97_K1 - 9.797958971132712) < 1e-12,
  },
  {
    id: 'imp95008-honesty-gate-no-qed',
    description: 'conditional reduction only: promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95008_WELD_ALIAS_L2_COLLAPSE.promotesBound === false &&
      /NO QED/.test(IMP95008_WELD_ALIAS_L2_COLLAPSE.verdict) &&
      /refereed bound is changed/i.test(IMP95008_WELD_ALIAS_L2_COLLAPSE.verdict),
  },
];

for (const a of IMP95008_WELD_ALIAS_L2_COLLAPSE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-weld-alias-l2-collapse assertion failed: ${a.id}`);
  }
}

export default IMP95008_WELD_ALIAS_L2_COLLAPSE;
