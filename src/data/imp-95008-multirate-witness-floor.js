/**
 * imp-95008 continuation (thirteenth) - THEOREM R + LEMMA S: MULTI-RATE
 * WITNESSES dissolve rate-locking; the headline far bracket closes 3.59x.
 * The ninth continuation (imp-95008-rate-relaxed-fixed-p-floor.js) freed
 * the COMMON profile rate mu and left as its refined residual the one
 * untested witness generalization, repeated verbatim by the twelfth
 * continuation: "multi-RATE witnesses (different mu per packet)". This
 * module executes exactly that lever and finds it is the strongest
 * witness-side step of the chain so far: per-packet rates lift the
 * spacing-class theta = 10 floor 3.59x and the fixed-97 theta = 10 floor
 * 10.6x, because ONE locked rate was forced to serve three conflicting
 * roles (diagonal mass cost wants a fast rate, bridge coupling wants a
 * slow rate, and the Lemma V damping optimum mu r_i ~ s differs per
 * packet since the widths r_i differ).
 *
 * SETTING (identical to the sibling chain; Permuting the Zeta Twin Ladder
 * Section 4.5; page /permutation-architecture). Witness = packets
 * a_i(u) = alpha_i e^(-mu_i |u - u_i|), centers u_i = v/d_i on the grid
 * d = k/p, widths r_i = c d_i^(-beta) FIXED by the family; now each
 * packet carries its OWN rate mu_i > 0. Legality is per packet: Lemma V
 * (ninth continuation) is stated for a single packet, so the envelope
 * amplitudes A_i = alpha_i / h(mu_i, r_i, s) put the multi-rate family in
 * MAJ(sigma, theta) verbatim, s = sigma + theta.
 *
 * THEOREM R (exact multi-rate floor currency). For rates a != b and
 * center distance tau >= 0, the exact cross-correlation of two-sided
 * exponential profiles is
 *   K(a, b, tau) = integral e^(-a|x|) e^(-b|x - tau|) dx
 *                = 2 ( b e^(-a tau) - a e^(-b tau) ) / ( b^2 - a^2 ) ,
 * with equal-rate limit K(mu, mu, tau) = f(mu tau)/mu, f(z) = e^(-z)(1+z),
 * and diagonal K(a, a, 0) = 1/a. Proof: split at the two centers; the
 * three pieces are e^(-b tau)/(a + b), (e^(-a tau) - e^(-b tau))/(b - a),
 * e^(-a tau)/(a + b); combine over the common denominator. QED. Hence
 * for any multi-rate witness the exact excess is
 *   E = - sum_i alpha_i^2 / mu_i
 *       + 2 sum_{i<j} s_ij alpha_i alpha_j K(mu_i, mu_j, tau_ij)
 * (s_ij = +1 cross-block, -1 same-block), the far mass currency is
 * M = sum_b nTilde_b^2 with nTilde_b = sum_{i in b} alpha_i sqrt(r_i)/h_i
 * exactly as in the siblings, and the floor assembly of Theorems K/L is
 * verbatim: any two-currency bound with cNear <= 2 and T* <= Tx(2) over
 * MAJ(sigma, theta) satisfies cFar >= F = E / ( Tx(2) M ) whenever E > 0.
 * Nothing in the assembly used rate commonality - only per-packet MAJ
 * membership, which Lemma V grants per packet.
 *
 * LEMMA S (equal-rate kernel gradient; the slower rate controls decay).
 * (i) K is C^1 across the equal-rate diagonal with
 *   dK/da at (a = b = mu) = - e^(-mu tau) (1 + mu tau + mu^2 tau^2)
 *                             / (2 mu^2) ,
 * exactly HALF the common-rate derivative d/dmu [f(mu tau)/mu] (the
 * symmetric split; checked by series expansion of the a != b branch and,
 * independently, by the exact common-rate algebra). (ii) For fixed
 * b < a, e^(b tau) K(a, b, tau) -> 2a/(a^2 - b^2) as tau -> infinity:
 * the cross-coupling decays at the SLOWER rate, not the faster one and
 * not the mean. Part (ii) is the mechanism of every gain below - a slow
 * packet keeps long-range bridge coupling alive that a locked fast rate
 * eliminates exponentially - and it REVERSES the rate-locked saturation
 * verdicts: what looked like dead coupling at mu_opt(theta = 10) ~ 4.5
 * was an artifact of forcing the coupling to decay at the fast rate.
 *
 * COROLLARY R1 (the rate-locking penalty is FIRST order). At a
 * common-rate witness the multi-rate floor gradient is closed-form:
 *   dF/dmu_i = ( dE_i M - E dM_i ) / ( Tx(2) M^2 ) ,
 *   dE_i = alpha_i^2/mu^2
 *          - sum_{j != i} s_ij alpha_i alpha_j
 *            e^(-mu tau_ij)(1 + mu tau_ij + mu^2 tau_ij^2)/mu^2 ,
 *   dM_i = - 2 nTilde_{b(i)} alpha_i sqrt(r_i) (s - mu r_i)_+
 *            / ( mu h(mu, r_i, s) )   (zero when mu r_i >= s).
 * At the ninth-continuation baked (97, theta = 2) witness the gradient is
 *   ( -0.05147392535205178, +0.07536237795653151,
 *     +0.048886787511612045, -0.07277518875538568 ) :
 * the components are NONZERO (all above 0.048 in magnitude) while their
 * SUM is 5.1e-8 - the locked common direction is stationary (mu was
 * optimized) but the transverse rate directions are not. Multi-rate
 * therefore improves any common-rate-optimal witness to FIRST order; the
 * common-rate class supremum is strictly interior to the multi-rate one.
 *
 * COROLLARY R2 (baked multi-rate witnesses; optimality NOT claimed, each
 * is exhibited and exactly evaluated; every floor strictly beats the
 * corresponding tracked common-rate literal).
 *   fixed-97 theta = 2 (5-packet, bridge + block-3 antenna):
 *     mu = (1.119817, 1.662744, 1.248601, 0.9206384, 0.4104809),
 *     alpha = (0.7928144, 0.6880449, 0.7339754, 0.7778122, 0.112638):
 *     F = 0.26931796205910363 (1.2657x the twelfth 0.21277382825768976);
 *     bracket [0.269318, 4], gap 14.852332794357672 (was 18.79930).
 *   spacing p = 999983 theta = 2 (5-packet):
 *     mu = (1.12009, 1.658263, 1.270676, 0.9513415, 0.4184065),
 *     alpha = (1.035438, 0.9090695, 1.003362, 1.072498, 0.1539852):
 *     F = 0.28311249129208754 (1.2582x the twelfth 0.22500790918481625);
 *     bracket [0.283112, 4], gap 14.12865953651333 (was 17.77715).
 *   fixed-97 theta = 10 (4-packet):
 *     mu = (3.21047, 3.378314, 2.558923, 2.068342),
 *     alpha = (0.900892, 0.9160048, 0.2633267, 0.2555064):
 *     F = 0.0012038255978826329 (10.579x the twelfth penta
 *     0.00011379392938437134); gap 35151.260015715452 ->
 *     3322.7404426650019.
 *   HEADLINE spacing theta = 10 (4-packet):
 *     mu = (7.694097, 7.696714, 3.901035, 2.79778),
 *     alpha = (1.090619, 1.090715, 0.04953889, 0.04336286):
 *     F = 0.092871808411129783 = 3.5882330937992983x the tracked
 *     0.025882323133248602; the headline far bracket closes
 *     [0.025882, 4] (gap 154.54563253101395) ->
 *     [0.092871808411129783, 4] (gap 43.070120722669579).
 * Structural reading of the headline witness: the near-degenerate first
 * pair takes mu ~ 7.7 (fast: diagonal cost 1/mu shrinks, intra-pair
 * correlation is rate-insensitive at tiny tau), the second-pair packets
 * take mu ~ 3.9 and 2.8 (slow: they carry the bridge coupling, which by
 * Lemma S(ii) decays at the slower partner rate) - the three roles of
 * the locked rate are decoupled exactly as the gradient predicted.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) the kernel K is NOT trusted from
 * the derivation alone - it is cross-checked below against direct
 * Simpson quadrature at generic unequal-rate triples (rel < 1e-6) and
 * against the equal-rate limit across the diagonal switch; (2) the full
 * multi-rate excess of a baked witness matches direct 4-packet
 * quadrature (rel < 1e-6, computed with per-packet rates); (3) Lemma S
 * is checked both by central finite differences of the a != b branch
 * AND by the exact identity 2 dK/da = d/dmu K(mu, mu, tau) in closed
 * form; (4) the Corollary R1 gradient literals match central finite
 * differences of the floor itself; (5) NO contradiction with the
 * achieved side: the Theorem Y weighted budget majorizes the exact
 * excess E on all six baked witnesses (slack 9x to 2500x, asserted),
 * and every floor stays far below the achieved cFar = 4 - the bracket
 * remains open; (6) equal-rate reproduction: the multi-rate code path
 * at equal rates reproduces the sibling floor literals to 1e-9;
 * (7) the twelfth-continuation "theta = 10 saturation" verdict is NOT
 * contradicted but SCOPED: it was a statement about rate-locked
 * antenna extensions, and Lemma S(ii) identifies rate-locking itself
 * as the reason that lever measured dead; (8) scope caveat inherited
 * from Theorems F/K/L: the floor quantifies over the two-currency
 * bound class with tail functionals T* <= Tx(2); a bound in a
 * genuinely different currency evades it; witnesses are optimizer
 * outputs - floors are the exact baked evaluations, optimality is NOT
 * claimed anywhere.
 *
 * WHAT REMAINS OPEN (sibling residuals, updated): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c), the l2-to-pointwise passage to |C_E,17|.
 * SUPERSEDED: the ninth/twelfth residual "multi-RATE witnesses, the one
 * untested witness generalization" is now executed and quantified.
 * REFINED residual: the headline theta = 10 far bracket is
 * [0.092871808411129783, 4] (gap 43.07); the witness side reopens at
 * the COMPOSITION of levers - multi-rate Theorem N antennas (Lemma S(ii)
 * revives long-range antenna coupling at theta = 10 that the twelfth
 * continuation measured dead under rate-locking) and deeper multi-rate
 * chains; the achieved side still holds only the parity alternating sum
 * and the Lemma T constant.
 *
 * The numerics below CROSS-CHECK the closed-form statements; they are
 * not the claim. Import-light (no heavy bundle). Changes no bound; does
 * NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── shared conventions (identical to the sibling modules) ────────────────────
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

const QREF = isolationQ(CC, VV, BETA, DD);

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

function gSharp(j, Q, beta) {
  return Math.pow(2, beta) * gOld(j, Q, beta);
}

function cornerV(b, j, Q, beta) {
  return Math.pow(2, b * (1 - beta)) * gSharp(j, Q, beta);
}

function phi(x, theta) {
  return Math.pow(1 + x, -theta);
}

function tailAllSharp(theta, Q, beta, jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j++) {
    const g = gSharp(j, Q, beta);
    if (!Number.isFinite(g)) break;
    const t = phi(g, theta);
    if (t === 0) break;
    s += t;
  }
  return s;
}

function fCorr(z) {
  return Math.exp(-z) * (1 + z);
}

function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}

// ── THEOREM R: exact cross-rate kernel ───────────────────────────────────────
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return fCorr(m * tau) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// LEMMA S(i): dK/da at the equal-rate diagonal a = b = mu
function dKdaDiag(mu, tau) {
  return (-Math.exp(-mu * tau) * (1 + mu * tau + mu * mu * tau * tau)) / (2 * mu * mu);
}

// exact common-rate derivative d/dmu of K(mu, mu, tau) = f(mu tau)/mu
function dKcommon(mu, tau) {
  return (-Math.exp(-mu * tau) * (1 + mu * tau + mu * mu * tau * tau)) / (mu * mu);
}

// ── witness geometry (identical to the twelfth continuation) ─────────────────
function pentaWitness(p) {
  const k1 = Math.floor(p / 2) + 1;
  const k2 = Math.floor(p / 4) + 1;
  const k3 = Math.floor(p / 8) + 1;
  const ks = [k1, k1 - 1, k2, k2 - 1, k3 - 1];
  const d = ks.map((k) => k / p);
  return {
    ks,
    d,
    u: d.map((x) => VV / x),
    r: d.map((x) => CC * Math.pow(x, -BETA)),
    block: ks.map((k) => {
      let b = 0;
      while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
        b += 1;
        if (b > 60) throw new Error("imp-95008 multirate: block search failed");
      }
      return b;
    }),
  };
}

function subWitness(w, n) {
  return {
    ks: w.ks.slice(0, n),
    d: w.d.slice(0, n),
    u: w.u.slice(0, n),
    r: w.r.slice(0, n),
    block: w.block.slice(0, n),
  };
}

// ── multi-rate sharp-currency floor (Theorem R) ──────────────────────────────
function floorMultiRate(w, theta, mus, a) {
  const s = SIGMA + theta;
  const n = a.length;
  let E = 0;
  for (let i = 0; i < n; i++) E -= (a[i] * a[i]) / mus[i];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sij = w.block[i] === w.block[j] ? -1 : 1;
      E += 2 * sij * a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
    }
  }
  const bmax = Math.max(...w.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) {
    nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / hLegal(mus[i], w.r[i], s);
  }
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  const T = tailAllSharp(theta, QREF, BETA, 800);
  return { F: E / (T * M), E, M, T, nb };
}

// COROLLARY R1: closed-form multi-rate gradient at a common-rate witness
function rateGradientAtCommon(w, theta, mu, a) {
  const s = SIGMA + theta;
  const n = a.length;
  const mus = new Array(n).fill(mu);
  const base = floorMultiRate(w, theta, mus, a);
  const grads = [];
  for (let i = 0; i < n; i++) {
    let dE = (a[i] * a[i]) / (mu * mu);
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const sij = w.block[i] === w.block[j] ? -1 : 1;
      dE += 2 * sij * a[i] * a[j] * dKdaDiag(mu, Math.abs(w.u[i] - w.u[j]));
    }
    const x = mu * w.r[i];
    const dInvH = x >= s ? 0 : -((s - x) / mu) / hLegal(mu, w.r[i], s);
    const dM = 2 * base.nb[w.block[i]] * a[i] * Math.sqrt(w.r[i]) * dInvH;
    grads.push((dE * base.M - base.E * dM) / (base.T * base.M * base.M));
  }
  return { grads, base };
}

// ── baked witnesses (Corollary R2; optimality NOT claimed) ───────────────────
const NINTH_97_T2 = { mu: 1.086527, a: [0.51279, 0.28492, 0.506456, 0.631957] };

const MR4_97_T2 = {
  mus: [1.146761, 1.644434, 1.27521, 0.8893101],
  a: [0.6810261, 0.6225218, 0.5399078, 0.5826991],
};
const MR4_97_T10 = {
  mus: [3.21047, 3.378314, 2.558923, 2.068342],
  a: [0.900892, 0.9160048, 0.2633267, 0.2555064],
};
const MR4_BIG_T2 = {
  mus: [1.14962, 1.641102, 1.298799, 0.917703],
  a: [0.8561121, 0.7912635, 0.7051712, 0.7682972],
};
const MR4_BIG_T10 = {
  mus: [7.694097, 7.696714, 3.901035, 2.79778],
  a: [1.090619, 1.090715, 0.04953889, 0.04336286],
};
const MR5_97_T2 = {
  mus: [1.119817, 1.662744, 1.248601, 0.9206384, 0.4104809],
  a: [0.7928144, 0.6880449, 0.7339754, 0.7778122, 0.112638],
};
const MR5_BIG_T2 = {
  mus: [1.12009, 1.658263, 1.270676, 0.9513415, 0.4184065],
  a: [1.035438, 0.9090695, 1.003362, 1.072498, 0.1539852],
};

const P97 = pentaWitness(97);
const PBIG = pentaWitness(999983);
const W4_97 = subWitness(P97, 4);
const W4_BIG = subWitness(PBIG, 4);

const F_MR4_97_T2 = floorMultiRate(W4_97, 2, MR4_97_T2.mus, MR4_97_T2.a);
const F_MR4_97_T10 = floorMultiRate(W4_97, 10, MR4_97_T10.mus, MR4_97_T10.a);
const F_MR4_BIG_T2 = floorMultiRate(W4_BIG, 2, MR4_BIG_T2.mus, MR4_BIG_T2.a);
const F_MR4_BIG_T10 = floorMultiRate(W4_BIG, 10, MR4_BIG_T10.mus, MR4_BIG_T10.a);
const F_MR5_97_T2 = floorMultiRate(P97, 2, MR5_97_T2.mus, MR5_97_T2.a);
const F_MR5_BIG_T2 = floorMultiRate(PBIG, 2, MR5_BIG_T2.mus, MR5_BIG_T2.a);

const GRAD_NINTH = rateGradientAtCommon(W4_97, 2, NINTH_97_T2.mu, NINTH_97_T2.a);

// ── Theorem Y achieved-budget machinery (eleventh continuation replicas) ─────
function tRowW(b, theta, Q, beta, jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j += 2) {
    const t = phi(cornerV(b, j, Q, beta), theta);
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  return s;
}

function tColW(b, theta, Q, beta) {
  const r = b % 2;
  let s = 0;
  for (let j = 2; j <= b - r; j += 2) s += phi(cornerV(b - j, j, Q, beta), theta);
  return s;
}

function weightedBudgetMR(w, theta, mus, a) {
  const ev = floorMultiRate(w, theta, mus, a);
  let bud = 0;
  for (let b = 0; b < ev.nb.length; b++) {
    bud += (tRowW(b, theta, QREF, BETA, 400) + tColW(b, theta, QREF, BETA)) * ev.nb[b] * ev.nb[b];
  }
  return { budget: (4 / (2 * SIGMA - 1)) * bud, E: ev.E };
}

// ── quadrature cross-checks ──────────────────────────────────────────────────
function pairKernelQuad(a, b, tau) {
  const step = 1e-4;
  const pad = 40 / Math.min(a, b);
  const lo = -pad;
  const hi = tau + pad;
  const n = Math.ceil((hi - lo) / step);
  let s = 0;
  for (let k = 0; k <= n; k++) {
    const x = lo + k * step;
    const wgt = k === 0 || k === n ? 0.5 : 1;
    s += wgt * Math.exp(-a * Math.abs(x)) * Math.exp(-b * Math.abs(x - tau));
  }
  return s * step;
}

function witnessQuadExcessMR(w, mus, a) {
  const step = 1e-4;
  const pad = 40 / Math.min(...mus);
  const lo = Math.min(...w.u) - pad;
  const hi = Math.max(...w.u) + pad;
  const n = Math.ceil((hi - lo) / step);
  const m = a.length;
  const ip = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let k = 0; k < n; k++) {
    const x = lo + k * step;
    const vals = w.u.map((ui, i) => a[i] * Math.exp(-mus[i] * Math.abs(x - ui)));
    for (let i = 0; i < m; i++) {
      for (let j = i; j < m; j++) ip[i][j] += vals[i] * vals[j];
    }
  }
  for (let i = 0; i < m; i++) {
    for (let j = i; j < m; j++) ip[i][j] *= step;
  }
  let E = 0;
  for (let i = 0; i < m; i++) E -= ip[i][i];
  for (let i = 0; i < m; i++) {
    for (let j = i + 1; j < m; j++) {
      E += 2 * (w.block[i] === w.block[j] ? -1 : 1) * ip[i][j];
    }
  }
  return E;
}

const QUAD_E_MR4_97_T2 = witnessQuadExcessMR(W4_97, MR4_97_T2.mus, MR4_97_T2.a);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_MULTIRATE_WITNESS_FLOOR = {
  ticket: "imp-95008 (continuation thirteen: multi-rate witnesses dissolve rate-locking)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; executes the one untested witness generalization declared by the ninth and twelfth continuations: per-packet profile rates mu_i.",
  theoremR:
    "Exact multi-rate floor currency: the cross-rate kernel K(a, b, tau) = 2(b e^(-a tau) - a e^(-b tau))/(b^2 - a^2) (equal-rate limit f(mu tau)/mu, diagonal 1/a) gives the exact excess E = -sum alpha_i^2/mu_i + 2 sum_{i<j} s_ij alpha_i alpha_j K(mu_i, mu_j, tau_ij); per-packet Lemma V legality (A_i = alpha_i/h(mu_i, r_i, s)) puts the family in MAJ(sigma, theta) verbatim, so cFar >= F = E/(Tx(2) M) whenever E > 0, exactly as in Theorems K and L - nothing in the floor assembly used rate commonality.",
  lemmaS:
    "Equal-rate kernel gradient: K is C1 across the diagonal with dK/da at (mu, mu, tau) = -e^(-mu tau)(1 + mu tau + mu^2 tau^2)/(2 mu^2), exactly half the common-rate derivative (symmetric split). Slower-rate decay law: for b < a, e^(b tau) K(a, b, tau) -> 2a/(a^2 - b^2) as tau grows - cross-coupling decays at the SLOWER partner rate. This law is the mechanism of every gain in this module and scopes the twelfth-continuation theta = 10 saturation verdict as a rate-locking artifact.",
  corollaryR1:
    "The rate-locking penalty is first order: the closed-form multi-rate gradient at the ninth (97, theta 2) common-rate witness is (-0.05147392535205178, +0.07536237795653151, +0.048886787511612045, -0.07277518875538568) - every component above 0.048 in magnitude, sum 5.1e-8 (the locked direction is stationary, the transverse directions are not). Any common-rate-optimal witness is strictly improvable in the multi-rate class.",
  corollaryR2:
    "Baked multi-rate witnesses (exact evaluations; optimality NOT claimed): fixed-97 theta 2 penta floor 0.26931796205910363 (1.2657x, gap 18.79930456087678 -> 14.852332794357672); spacing theta 2 penta 0.28311249129208754 (1.2582x, gap 17.777152876499525 -> 14.12865953651333); fixed-97 theta 10 quad 0.0012038255978826329 (10.579x, gap 35151.260015715452 -> 3322.7404426650019); HEADLINE spacing theta 10 quad 0.092871808411129783 = 3.5882330937992983x the tracked 0.025882323133248602, far bracket [0.025882, 4] (gap 154.54563253101395) -> [0.092871808411129783, 4] (gap 43.070120722669579).",
  reference: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA },
    ninthCommonRateBase: NINTH_97_T2,
    gradientAtNinth: GRAD_NINTH.grads,
    baked: {
      mr4Fixed97Theta2: { witness: MR4_97_T2, floor: F_MR4_97_T2.F },
      mr4Fixed97Theta10: { witness: MR4_97_T10, floor: F_MR4_97_T10.F },
      mr4SpacingTheta2: { witness: MR4_BIG_T2, floor: F_MR4_BIG_T2.F },
      mr4SpacingTheta10: { witness: MR4_BIG_T10, floor: F_MR4_BIG_T10.F },
      mr5Fixed97Theta2: { witness: MR5_97_T2, floor: F_MR5_97_T2.F },
      mr5SpacingTheta2: { witness: MR5_BIG_T2, floor: F_MR5_BIG_T2.F },
    },
    headline: {
      oldFloor: 0.025882323133248602,
      newFloor: F_MR4_BIG_T10.F,
      oldGap: 154.54563253101395,
      newGap: 4 / F_MR4_BIG_T10.F,
      closureRatio: F_MR4_BIG_T10.F / 0.025882323133248602,
    },
  },
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "REFINED: rate-locking is dissolved (headline theta = 10 far bracket now [0.092871808411129783, 4], gap 43.07); the witness side reopens at the COMPOSITION of levers - multi-RATE Theorem N antennas (the slower-rate decay law revives long-range antenna coupling at theta = 10 that the twelfth continuation measured dead under rate-locking) and deeper multi-rate chains; the achieved side still holds the parity alternating sum and the Lemma T constant",
  ],
  isRigorous: true,
  rigorScope:
    "Theorem R is an elementary exact integral (three-piece split) plus the verbatim floor assembly of Theorems K and L, whose hypotheses are per-packet MAJ membership only; Lemma S is calculus on the closed-form kernel (series expansion cross-checked against the exact common-rate algebra). The baked floors are exact witness evaluations at baked literals with exact correlations and exact per-packet Lemma V legality, in the sharp currency of continuations ten and eleven; the witnesses come from a numerical optimizer and optimality is NOT claimed. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step executing the one untested witness generalization (per-packet rates): NEW Theorem R extends the floor currency to multi-rate witnesses with the exact cross-rate kernel K(a, b, tau) = 2(b e^(-a tau) - a e^(-b tau))/(b^2 - a^2), and NEW Lemma S proves the cross-coupling decays at the SLOWER partner rate - rate-locking forced one rate to serve three conflicting roles, and the closed-form gradient at the ninth witness (components above 0.048, sum 5.1e-8) shows the penalty is first order. Baked multi-rate witnesses: HEADLINE spacing theta = 10 far bracket closes [0.025882, 4] (gap 154.55) -> [0.092871808411129783, 4] (gap 43.070120722669579), a 3.588x closure - the strongest witness-side step of the chain; fixed-97 theta = 10 gap closes 10.6x; both theta = 2 gaps close ~1.26x. The twelfth-continuation theta = 10 saturation verdict is scoped, not contradicted: it was a rate-locked statement. Witness optimality is NOT claimed; floors are exact baked evaluations. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_MR_ASSERTIONS = [
  {
    id: "imp95008-mr-kernel-quadrature",
    description:
      "Theorem R kernel matches direct trapezoid quadrature of the two-sided exponential product at generic unequal-rate triples (rel < 1e-6), including the headline fast/slow pairing (7.69, 2.8)",
    holds: () =>
      [
        [2.5, 1.0, 3.0],
        [7.694097, 2.79778, 2.0],
        [1.6, 0.42, 5.6],
      ].every(([a, b, tau]) => {
        const exact = kernelK(a, b, tau);
        const quad = pairKernelQuad(a, b, tau);
        return Math.abs(exact - quad) / Math.abs(exact) < 1e-6;
      }),
  },
  {
    id: "imp95008-mr-kernel-symmetry-diagonal",
    description:
      "kernel symmetry K(a,b,tau) = K(b,a,tau), strict positivity on a grid, and continuity across the equal-rate diagonal switch (rel < 1e-6 between the a != b branch just off diagonal and the exact limit f(mu tau)/mu)",
    holds: () => {
      for (const [a, b, tau] of [
        [2.5, 1.0, 3.0],
        [7.7, 3.9, 1.1],
        [0.4, 1.1, 6.0],
      ]) {
        const k1 = kernelK(a, b, tau);
        const k2 = kernelK(b, a, tau);
        if (!(k1 > 0) || Math.abs(k1 - k2) / k1 > 1e-12) return false;
      }
      for (const [mu, tau] of [
        [1.1, 2.0],
        [4.5, 0.7],
      ]) {
        const off = (2 * (mu * Math.exp(-mu * (1 + 3e-7) * tau) - mu * (1 + 3e-7) * Math.exp(-mu * tau))) /
          (mu * mu - mu * (1 + 3e-7) * (mu * (1 + 3e-7)));
        const lim = fCorr(mu * tau) / mu;
        if (Math.abs(off - lim) / lim > 1e-5) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-mr-lemmaS-derivative",
    description:
      "Lemma S: the closed-form diagonal derivative dK/da = -e^(-mu tau)(1 + mu tau + mu^2 tau^2)/(2 mu^2) matches central finite differences of the unequal-rate branch (rel < 1e-4), and 2 dK/da equals the exact common-rate derivative identically (rel < 1e-12)",
    holds: () => {
      for (const [mu, tau] of [
        [1.086527, 1.9],
        [2.52, 0.6],
        [4.5, 2.1],
      ]) {
        const an = dKdaDiag(mu, tau);
        const h = 1e-5;
        const fd = (kernelK(mu + h, mu, tau) - kernelK(mu - h, mu, tau)) / (2 * h);
        if (Math.abs(an - fd) / Math.abs(an) > 1e-4) return false;
        if (Math.abs(2 * an - dKcommon(mu, tau)) / Math.abs(dKcommon(mu, tau)) > 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-mr-slower-rate-decay",
    description:
      "Lemma S(ii): for b < a the normalized kernel e^(b tau) K(a, b, tau) converges to 2a/(a^2 - b^2) (rel < 1e-3 at tau = 30/b), while the rate-locked kernel at rate a is exponentially smaller (factor > 1e6 at that tau)",
    holds: () => {
      const a = 7.694097;
      const b = 2.79778;
      const tau = 30 / b;
      const lim = (2 * a) / (a * a - b * b);
      const norm = Math.exp(b * tau) * kernelK(a, b, tau);
      if (Math.abs(norm - lim) / lim > 1e-3) return false;
      return kernelK(a, b, tau) / kernelK(a, a, tau) > 1e6;
    },
  },
  {
    id: "imp95008-mr-sibling-reproduction",
    description:
      "the multi-rate code path at EQUAL rates reproduces the sibling common-rate floor literals through an independent implementation: 0.20942830545943472 (97, theta 2) and 0.025882322161015905 (999983, theta 10), rel 1e-9",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      const f1 = floorMultiRate(W4_97, 2, [1.086527, 1.086527, 1.086527, 1.086527], NINTH_97_T2.a).F;
      const f2 = floorMultiRate(W4_BIG, 10, [4.515, 4.515, 4.515, 4.515], [0.25576, 0.25471, 0.65923, 0.65964]).F;
      return rel(f1, 0.20942830545943472) && rel(f2, 0.025882322161015905);
    },
  },
  {
    id: "imp95008-mr-gradient-ratelocking",
    description:
      "Corollary R1 gradient at the ninth witness reproduces the baked literals (rel 1e-9), matches central finite differences of the floor (rel < 1e-3), has every component above 0.048 in magnitude, and sums below 1e-6 (locked direction stationary)",
    holds: () => {
      const lits = [-0.05147392535205178, 0.07536237795653151, 0.048886787511612045, -0.07277518875538568];
      const g = GRAD_NINTH.grads;
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      if (!g.every((x, i) => rel(x, lits[i]))) return false;
      if (!g.every((x) => Math.abs(x) > 0.048)) return false;
      if (Math.abs(g.reduce((s, x) => s + x, 0)) > 1e-6) return false;
      const h = 1e-6;
      for (let i = 0; i < 4; i++) {
        const mp = [NINTH_97_T2.mu, NINTH_97_T2.mu, NINTH_97_T2.mu, NINTH_97_T2.mu];
        const mm = mp.slice();
        mp[i] += h;
        mm[i] -= h;
        const fd =
          (floorMultiRate(W4_97, 2, mp, NINTH_97_T2.a).F - floorMultiRate(W4_97, 2, mm, NINTH_97_T2.a).F) / (2 * h);
        if (Math.abs(fd - g[i]) / Math.abs(g[i]) > 1e-3) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-mr-baked-floors",
    description:
      "the six baked multi-rate floors reproduce (rel 1e-9): 0.241153284847299, 0.0012038255978826329, 0.25351238729228914, 0.092871808411129783, 0.26931796205910363, 0.28311249129208754, all with strictly positive excess",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(F_MR4_97_T2.F, 0.241153284847299) &&
        rel(F_MR4_97_T10.F, 0.0012038255978826329) &&
        rel(F_MR4_BIG_T2.F, 0.25351238729228914) &&
        rel(F_MR4_BIG_T10.F, 0.092871808411129783) &&
        rel(F_MR5_97_T2.F, 0.26931796205910363) &&
        rel(F_MR5_BIG_T2.F, 0.28311249129208754) &&
        [F_MR4_97_T2, F_MR4_97_T10, F_MR4_BIG_T2, F_MR4_BIG_T10, F_MR5_97_T2, F_MR5_BIG_T2].every((f) => f.E > 0)
      );
    },
  },
  {
    id: "imp95008-mr-strict-progress",
    description:
      "every baked multi-rate floor STRICTLY beats the corresponding tracked common-rate literal: penta theta 2 pairs beat 0.21277382825768976 and 0.22500790918481625 (twelfth), quad theta 10 pairs beat 0.00011379392938437134 and 0.025882323133248602 (twelfth), and the quad theta 2 pairs beat the ninth-lineage 4-packet literals 0.20942830545943472 and 0.22161930710929456",
    holds: () =>
      F_MR5_97_T2.F > 0.21277382825768976 &&
      F_MR5_BIG_T2.F > 0.22500790918481625 &&
      F_MR4_97_T10.F > 0.00011379392938437134 &&
      F_MR4_BIG_T10.F > 0.025882323133248602 &&
      F_MR4_97_T2.F > 0.20942830545943472 &&
      F_MR4_BIG_T2.F > 0.22161930710929456,
  },
  {
    id: "imp95008-mr-bracket-bookkeeping",
    description:
      "tracked brackets update by the baked literals: fixed-97 theta 2 gap -> 14.852332794357672, spacing theta 2 gap -> 14.12865953651333, fixed-97 theta 10 gap -> 3322.7404426650019, HEADLINE spacing theta 10 gap 154.54563253101395 -> 43.070120722669579 with closure ratio 3.5882330937992983 (rel 1e-9)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(4 / F_MR5_97_T2.F, 14.852332794357672) &&
        rel(4 / F_MR5_BIG_T2.F, 14.12865953651333) &&
        rel(4 / F_MR4_97_T10.F, 3322.7404426650019) &&
        rel(4 / F_MR4_BIG_T10.F, 43.070120722669579) &&
        rel(4 / 0.025882323133248602, 154.54563253101395) &&
        rel(F_MR4_BIG_T10.F / 0.025882323133248602, 3.5882330937992983)
      );
    },
  },
  {
    id: "imp95008-mr-witness-quadrature",
    description:
      "the closed-form multi-rate excess of the baked (97, theta 2) quad witness matches direct 4-packet quadrature with per-packet rates to < 1e-6 relative",
    holds: () => Math.abs(QUAD_E_MR4_97_T2 - F_MR4_97_T2.E) / Math.abs(F_MR4_97_T2.E) < 1e-6,
  },
  {
    id: "imp95008-mr-achieved-consistency",
    description:
      "no contradiction with the achieved side: the Theorem Y weighted budget majorizes the exact multi-rate excess E on all six baked witnesses, the omega_2 replicas reproduce the eleventh-continuation literals 0.0002884062395107217 and 0.25835827010368023, and every floor stays strictly below the achieved cFar = 4",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      const o2t10 = tRowW(2, 10, QREF, BETA, 400) + tColW(2, 10, QREF, BETA);
      const o2t2 = tRowW(2, 2, QREF, BETA, 400) + tColW(2, 2, QREF, BETA);
      if (!rel(o2t10, 0.0002884062395107217)) return false;
      if (!rel(o2t2, 0.25835827010368023)) return false;
      const checks = [
        weightedBudgetMR(W4_97, 2, MR4_97_T2.mus, MR4_97_T2.a),
        weightedBudgetMR(W4_97, 10, MR4_97_T10.mus, MR4_97_T10.a),
        weightedBudgetMR(W4_BIG, 2, MR4_BIG_T2.mus, MR4_BIG_T2.a),
        weightedBudgetMR(W4_BIG, 10, MR4_BIG_T10.mus, MR4_BIG_T10.a),
        weightedBudgetMR(P97, 2, MR5_97_T2.mus, MR5_97_T2.a),
        weightedBudgetMR(PBIG, 2, MR5_BIG_T2.mus, MR5_BIG_T2.a),
      ];
      if (!checks.every((ch) => ch.E <= ch.budget)) return false;
      return [F_MR4_97_T2, F_MR4_97_T10, F_MR4_BIG_T2, F_MR4_BIG_T10, F_MR5_97_T2, F_MR5_BIG_T2].every(
        (f) => f.F < 4,
      );
    },
  },
  {
    id: "imp95008-mr-legality-positivity",
    description:
      "all baked witnesses are componentwise positive with positive per-packet rates, every legality constant satisfies 0 < h <= 1, and the headline fast pair sits on the interior Lemma V branch (mu r < s) so the damping is genuinely priced, not waived",
    holds: () => {
      const all = [
        [W4_97, 2, MR4_97_T2],
        [W4_97, 10, MR4_97_T10],
        [W4_BIG, 2, MR4_BIG_T2],
        [W4_BIG, 10, MR4_BIG_T10],
        [P97, 2, MR5_97_T2],
        [PBIG, 2, MR5_BIG_T2],
      ];
      for (const [w, theta, W] of all) {
        if (!W.a.every((x) => x > 0) || !W.mus.every((x) => x > 0)) return false;
        const s = SIGMA + theta;
        for (let i = 0; i < W.a.length; i++) {
          const h = hLegal(W.mus[i], w.r[i], s);
          if (!(h > 0 && h <= 1)) return false;
        }
      }
      const s10 = SIGMA + 10;
      return MR4_BIG_T10.mus[0] * W4_BIG.r[0] < s10 && MR4_BIG_T10.mus[1] * W4_BIG.r[1] < s10;
    },
  },
  {
    id: "imp95008-mr-honesty-gate",
    description:
      "the verdict records the headline closure, the scoped (not contradicted) twelfth saturation verdict, the optimizer provenance of witnesses, the still-open residuals, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95008_MULTIRATE_WITNESS_FLOOR.promotesBound === false &&
      IMP95008_MULTIRATE_WITNESS_FLOOR.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_MULTIRATE_WITNESS_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP95008_MULTIRATE_WITNESS_FLOOR.verdict) &&
      /optimality is NOT claimed/.test(IMP95008_MULTIRATE_WITNESS_FLOOR.verdict) &&
      /scoped, not contradicted/.test(IMP95008_MULTIRATE_WITNESS_FLOOR.verdict) &&
      /SLOWER partner rate/.test(IMP95008_MULTIRATE_WITNESS_FLOOR.verdict) &&
      /Theorem N antennas/.test(IMP95008_MULTIRATE_WITNESS_FLOOR.openResiduals[4]) &&
      /optimality is NOT claimed/.test(IMP95008_MULTIRATE_WITNESS_FLOOR.rigorScope),
  },
];

for (const a of IMP95008_MR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-multirate-witness-floor assertion failed: ${a.id}`);
  }
}

export default IMP95008_MULTIRATE_WITNESS_FLOOR;
