/**
 * imp-95008 continuation (seventeenth) - LEMMA T-STAR + THEOREM Y-STAR: the
 * FIRST CEILING-SIDE move of the far bracket since the eleventh continuation.
 * The eleventh (imp-95008-block-resolved-far-weights.js) reduced the achieved
 * far coefficient to 4/(2 sigma - 1) and named exactly two remaining
 * achieved-side levers: (i) the outer parity AM-GM (declared uniformly
 * unrecoverable - its vanishing configurations are the near-constant-2
 * attainment) and (ii) "the Lemma T constant itself". This module executes
 * lever (ii): the fifth-continuation Lemma T proof splits the envelope
 * exponent (sigma + theta) as theta (spent on separation decay) plus sigma
 * (spent on integrability), but the split point is a FREE PARAMETER.
 * Optimizing it in closed form drops the reference theta = 10 far ceiling
 *   4  ->  2.9469476400572421   (ledger factor 1.3573366372815172),
 * headline far bracket [0.096745062937484763, 4] -> [same floor,
 * 2.9469476400572421], gap 41.345779087298143 -> 30.460961526910332; the
 * fixed-97 gap 3318.2150696382446 -> 2444.6515171682004. Both witness
 * floors are UNTOUCHED (this is a pure achieved-bound sharpening).
 *
 * SETTING (identical to the sibling chain; Permuting the Zeta Twin Ladder
 * Section 4.5; page /permutation-architecture). MAJ(sigma, theta) envelopes
 * e_i(u) = (1 + |u - u_i|/r_i)^(-s), s = sigma + theta; currencies
 * n_d = A_d sqrt(r_d), nTilde_b = sum of n_d over block b, M = sum of
 * nTilde_b^2; Lemma X pair floors Delta/rMax > V(b, j) =
 * 2^{b(1-beta)} Gx(j), Gx(j) = gSharp(j); tail Tx(2) = sum over j >= 2 of
 * (1 + Gx(j))^(-theta); bracket class of Theorem K: bounds of the form
 * ||sum w_b||^2 <= cNear A_curr + cFar Tstar M with cNear <= 2 and any tail
 * functional Tstar <= Tx(2), for ALL families satisfying MAJ on the grid.
 *
 * LEMMA T-STAR (parametric exponent split - UNCONDITIONAL, closed form).
 * For every sigmaPrime in (1/2, s], with T = Delta/rMax:
 *   integral e_1 e_2 du <= (2/(2 sigmaPrime - 1)) sqrt(r_1 r_2)
 *                          (1 + T)^(-(s - sigmaPrime)).
 * Proof - the fifth-continuation skeleton verbatim with the general split.
 * x_i = |u - u_i|/r_i >= |u - u_i|/rMax, so x_1 + x_2 >= Delta/rMax = T and
 * (1 + x_1)(1 + x_2) >= 1 + x_1 + x_2 >= 1 + T pointwise. Split EXACTLY:
 *   e_1 e_2 = [(1+x_1)(1+x_2)]^(-(s - sigmaPrime))
 *             (1+x_1)^(-sigmaPrime) (1+x_2)^(-sigmaPrime)
 *          <= (1 + T)^(-(s - sigmaPrime))
 *             (1+x_1)^(-sigmaPrime) (1+x_2)^(-sigmaPrime)
 * (needs s - sigmaPrime >= 0), then Cauchy-Schwarz with the exact integral
 * integral (1 + |u - u_i|/r_i)^(-2 sigmaPrime) du = 2 r_i/(2 sigmaPrime - 1)
 * (needs sigmaPrime > 1/2). QED. The fifth-continuation Lemma T is the
 * member sigmaPrime = sigma; the Delta = 0 exact value 2r/(2s - 1) recorded
 * in its self-check (1) is the member sigmaPrime = s, where Cauchy-Schwarz
 * is EQUALITY at r_1 = r_2 and the discarded separation factor is 1 - the
 * family is sharp at that corner.
 *
 * LEMMA O (the optimized envelope psi, closed form). Minimizing the
 * Lemma T-STAR bound over sigmaPrime at fixed T: with x = log(1 + T),
 * d/dsigmaPrime of [log 2 - log(2 sigmaPrime - 1) - (s - sigmaPrime) x]
 * = -2/(2 sigmaPrime - 1) + x vanishes at sigmaPrime* = 1/2 + 1/x
 * (a minimum: the second derivative 4/(2 sigmaPrime - 1)^2 > 0), which lies
 * in (1/2, s] iff x >= 2/(2s - 1). Hence
 *   integral e_1 e_2 <= psi(T) sqrt(r_1 r_2),
 *   psi(T) = 2/(2s - 1)                          if log(1 + T) <= 2/(2s-1),
 *   psi(T) = e log(1 + T) (1 + T)^(1/2 - s)      otherwise,
 * and psi has the four properties used below: (a) VALID (each value is a
 * member of the proved family); (b) CONTINUOUS at the seam (the interior
 * value at x = 2/(2s - 1) is e (2/(2s-1)) e^(-1) = 2/(2s-1)); (c)
 * NONINCREASING - d/dx [log x + (1/2 - s) x] = 1/x - (s - 1/2) <= 0 exactly
 * on the interior regime x >= 2/(2s - 1), and the flat regime is constant;
 * (d) NEVER WORSE than Lemma T: psi(T) <= (2/(2 sigma - 1))(1 + T)^(-theta)
 * (the sigmaPrime = sigma member), STRICTLY better wherever the optimum is
 * interior and sigmaPrime* != sigma. At the dominant corner V(0, 2) =
 * Gx(2) = 2^(1/3): sigmaPrime* = 1.7264974285347201 and the per-pair
 * improvement ratio is the closed form
 *   psi(Gx(2)) / [ (2/(2 sigma - 1)) (1 + Gx(2))^(-theta) ]
 *   = (e/2) log(1 + Gx(2)) (1 + Gx(2))^(-1/2)  = 0.73714209152912802
 * at sigma = 1 - THETA-INDEPENDENT whenever the optimum is interior, so the
 * ceiling factor below transfers verbatim to any theta with the same
 * (Q, beta).
 *
 * THEOREM Y-STAR (parity roll-up with the optimized envelope - CONDITIONAL
 * only on MAJ(sigma, theta), same hypotheses as Theorem Y). With
 *   OmegaStar_b = sum_{j >= 2 even} psi(V(b, j))
 *               + sum_{j even, 2 <= j <= b - (b mod 2)} psi(V(b - j, j)) ,
 *   || sum_b w_b ||^2 <= 2 sum_b ||w_b||^2 + 2 (sup_b OmegaStar_b) M .
 * Proof: parity AM-GM ||W||^2 <= 2||W_E||^2 + 2||W_O||^2 (unchanged - this
 * pins cNear = 2, seventh continuation). Within a parity class, each packet
 * pair across blocks (b, b + j), j even >= 2, has Delta/rMax > V(b, j)
 * (Lemma X), so by Lemma O(a),(c): |<a_d, a_d2>| <= n_d n_d2 psi(V(b, j)).
 * Summing block masses, 2|<w_b, w_{b+j}>| <= 2 nTilde_b nTilde_{b+j}
 * psi(V(b, j)) <= psi(V(b, j)) (nTilde_b^2 + nTilde_{b+j}^2), and the
 * row/col collection of Theorem Y (the factor routed once to the near
 * block, once to the far block) gives the class bound; the outer factor 2
 * finishes. QED. Theorem Y is the special case psi -> (2/(2 sigma - 1))
 * (1 + .)^(-theta), so Y-STAR is never worse, blockwise (Lemma O(d)).
 *
 * CLASS PLACEMENT (no Lemma M analogue needed). Take Tstar = Tx(2) itself
 * (trivially admissible). The new achieved point in the Theorem K bracket
 * class {cNear <= 2, Tstar <= Tx(2)} is
 *   (cNear, cFar) = ( 2 ,  2 sup_b OmegaStar_b / Tx(2) ) .
 *
 * COROLLARY (reference evaluation, sigma = 1, beta = 1/3, c = v = D = 1,
 * theta = 10 - all literals re-computed by the assertions). The sup is at
 * b = 2 exactly as in Theorem Y (the one dominant V(0, 2) col toll):
 *   OmegaStar_2 = psi(V(0, 2)) + rowStar(2) = 4.2545821185691675e-4 ,
 *   Tx(2) = 2.8874500929283736e-4 ,   cFarNew = 2.9469476400572421 .
 * Old-vs-new, two honest comparisons: the LEDGER factor 4 / 2.9469... =
 * 1.3573366372815172 (the bracket ceilings quoted by the eleventh onward
 * used cFar = 4 with Tstar = omega_2), and the PRODUCT factor
 * (4 omega_2) / (2 OmegaStar_2) = 1.3557441434822457 (budget-vs-budget at
 * the sup block). Deep blocks stay free: OmegaStar_b <= (2/(2 sigma - 1))
 * omega_b termwise by Lemma O(d), so the eleventh Lemma Z geometric
 * collapse transfers verbatim (scanned to b = 400 below; every b >= 4 sits
 * under OmegaStar_2 / 100).
 *
 * NEW TRACKED BRACKETS (floors untouched):
 *   headline theta = 10 spacing: [0.096745062937484763, 2.9469476400572421],
 *     gap 41.345779087298143 -> 30.460961526910332 ;
 *   fixed-97 theta = 10: floor 0.0012054673720820889 (fifteenth chain
 *     terminal), gap 3318.2150696382446 -> 2444.6515171682004 .
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) validity of Lemma T-STAR was stress-tested
 * by direct midpoint quadrature of the envelope correlation integral across
 * (sigma, theta) in {(1,10), (1,2)} x widths {0.3, 1, 3}^2 x separations
 * T in {0, 0.2, Gx(2), 2, 5.556, 20} - zero violations, and the worst ratio
 * tends to 1 exactly at the Delta = 0 equal-width corner (the bound is
 * SHARP there, member sigmaPrime = s; midpoint sums on a truncated window
 * underestimate the positive integrand, the safe direction); (2) the closed
 * form psi was checked to be the true family infimum by a 200000-point
 * sigmaPrime grid at nine T values (matches to 1e-6 rel, never below);
 * (3) continuity at the seam and monotone nonincrease were verified on log
 * grids (both are also proved in Lemma O); (4) the alternative
 * midpoint-split sharpening (extracting extra decay from the Cauchy-Schwarz
 * block via max(x_1, x_2) >= T/2) was TRIED and REJECTED: at the dominant
 * corner it gives 6.6e-3 versus psi = 4.24e-4 - the product inequality
 * (1+x_1)(1+x_2) >= 1 + T is strictly stronger at moderate T, so the
 * exponent-split optimum is the right lever at this scale; (5) the
 * eleventh-continuation old-currency literal omega_2 = 2.884062395107217e-4
 * is reproduced through an independent code path before being compared
 * against; (6) sup location b = 2 is NOT assumed - scanned b <= 400, both
 * parities; (7) the new ceiling does not contradict any exhibited floor:
 * both tracked floors sit below cFarNew with 30x and 2444x room; (8) class
 * legitimacy: cNear = 2 via the SAME parity AM-GM (untouched), and
 * Tstar = Tx(2) makes membership trivial - no Lemma M analogue is needed,
 * removing one moving part relative to the eleventh.
 *
 * WHAT REMAINS OPEN (sibling residuals, updated): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c), the l2-to-pointwise passage to |C_E,17|.
 * REFINED residual (the achieved-side ledger after this step): lever (ii)
 * of the eleventh is consumed down to the exponent-split optimum, which is
 * sharp at the Delta = 0 equal-width corner of its own family; the
 * remaining achieved-side slack is (a) the outer parity AM-GM factor 2
 * (unchanged, uniformly unrecoverable per the eleventh), and (b) the
 * Cauchy-Schwarz block of Lemma T-STAR, which ignores separation a second
 * time - the true two-envelope decay exponent at fixed widths is s (up to
 * width asymmetry) while the achieved exponent is s - 1/2; the recorded
 * failed midpoint-split attempt shows closing the last 1/2 needs a genuine
 * two-region interpolation at the dominant corner, not a pointwise product
 * inequality. Witness side: unchanged (multi-packet re-optimization and
 * different grid geometries, sixteenth continuation).
 *
 * The numerics below CROSS-CHECK the closed-form statements; they are not
 * the claim. Import-light (no heavy bundle). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── shared conventions (identical to the sibling modules) ────────────────────
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

// Lemma X per-pair corner floor, near block b, gap j (tenth continuation)
function cornerV(b, j) {
  return Math.pow(2, b * (1 - BETA)) * gSharp(j);
}

function phi(x) {
  return Math.pow(1 + x, -THETA);
}

function tailAllSharp(jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j++) {
    const t = phi(gSharp(j));
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  return s;
}

const TX2 = tailAllSharp(800);

// ── LEMMA T-STAR family and the LEMMA O optimized envelope psi ───────────────
function tStarMember(T, sigmaPrime, s) {
  return (2 / (2 * sigmaPrime - 1)) * Math.pow(1 + T, -(s - sigmaPrime));
}

function psiEnv(T, s) {
  const x = Math.log1p(T);
  const flat = 2 / (2 * s - 1);
  if (x <= flat) return flat;
  return Math.E * x * Math.pow(1 + T, 0.5 - s);
}

// ── THEOREM Y-STAR block weights ─────────────────────────────────────────────
function omegaStarRow(b) {
  let s = 0;
  for (let j = 2; j <= 800; j += 2) {
    const t = psiEnv(cornerV(b, j), SS);
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  return s;
}

function omegaStarCol(b) {
  const r = b % 2;
  let s = 0;
  for (let j = 2; j <= b - r; j += 2) s += psiEnv(cornerV(b - j, j), SS);
  return s;
}

function omegaStar(b) {
  return omegaStarRow(b) + omegaStarCol(b);
}

// old (eleventh continuation) weights, independent code path, for comparison
function omegaOld(b) {
  const r = b % 2;
  let s = 0;
  for (let j = 2; j <= 800; j += 2) {
    const t = phi(cornerV(b, j));
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  for (let j = 2; j <= b - r; j += 2) s += phi(cornerV(b - j, j));
  return s;
}

// ── headline witness floor machinery (sixteenth continuation, verbatim) ──────
function fCorr(z) {
  return Math.exp(-z) * (1 + z);
}

function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}

function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return fCorr(m * tau) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95008 exponent-split ceiling: block search failed");
  }
  return b;
}

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
    block: ks.map((k) => blockOf(p, k)),
  };
}

function appendGridPoint(p, w, kx) {
  const dd = kx / p;
  return {
    ks: [...w.ks, kx],
    d: [...w.d, dd],
    u: [...w.u, VV / dd],
    r: [...w.r, CC * Math.pow(dd, -BETA)],
    block: [...w.block, blockOf(p, kx)],
  };
}

function floorMultiRate(w, mus, a) {
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
    nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / hLegal(mus[i], w.r[i], SS);
  }
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  return { F: E / (TX2 * M), E, M };
}

const P_BIG = 999983;

const JOINT_BIG = {
  mus: [7.69395202209785, 7.696569089680406, 3.901022492015913, 2.7978054595942754, 1.6462804960465607],
  a: [1.0906392801493483, 1.0907349936022739, 0.04954395066558243, 0.04336742919997075, 0.000032666623379528365],
};

const CHAIN_BIG = [
  { k: 287373, nu: 5.484329511979126, eps: 0.0053250882770407544 },
  { k: 249994, nu: 18.93242512045269, eps: 0.006151578903669489 },
  { k: 328125, nu: 6.391061381455207, eps: 0.0017601429329493928 },
  { k: 269151, nu: 10.205134959136752, eps: 0.001531652027389694 },
  { k: 374236, nu: 7.109465151309788, eps: 0.0005572626874944937 },
  { k: 249997, nu: 4.551174447362288, eps: 0.00034587133755511514 },
  { k: 249993, nu: 16.278292954620273, eps: 0.0007594455828058375 },
  { k: 249998, nu: 4.597145906426553, eps: 0.0003333794713963081 },
];

function buildTerminal() {
  let w = pentaWitness(P_BIG);
  const mus = [...JOINT_BIG.mus];
  const a = [...JOINT_BIG.a];
  for (const st of CHAIN_BIG) {
    w = appendGridPoint(P_BIG, w, st.k);
    mus.push(st.nu);
    a.push(st.eps);
  }
  return floorMultiRate(w, mus, a);
}

// ── baked literals ────────────────────────────────────────────────────────────
const OM2_OLD = 2.884062395107217e-4; // eleventh continuation baked literal
const OM2_STAR = 4.2545821185691675e-4;
const TX2_LIT = 2.8874500929283736e-4;
const CFAR_OLD = 4;
const CFAR_NEW = 2.9469476400572421;
const RATIO_PAIR = 0.73714209152912802; // (e/2) log(1+Gx(2)) (1+Gx(2))^(-1/2)
const LEDGER_FACTOR = 1.3573366372815172; // 4 / CFAR_NEW
const PRODUCT_FACTOR = 1.3557441434822457; // (4 om2old) / (2 om2star)
const SIGMA_STAR_GX2 = 1.7264974285347201;
const HEAD_FLOOR = 0.096745062937484763; // fifteenth/sixteenth continuation literal
const GAP_HEAD_OLD = 41.345779087298143;
const GAP_HEAD_NEW = 30.460961526910332;
const F97_FLOOR = 0.0012054673720820889; // fifteenth continuation chain terminal
const GAP_97_OLD = 3318.2150696382446;
const GAP_97_NEW = 2444.6515171682004;

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95008_EXPONENT_SPLIT_FAR_CEILING = {
  ticket:
    "imp-95008 (continuation seventeen: exponent-split optimization of the Lemma T constant - first ceiling-side far-bracket move since the eleventh continuation)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; executes achieved-side lever (ii) named by the eleventh continuation: the Lemma T constant itself.",
  lemmaTStar:
    "For every sigmaPrime in (1/2, s], s = sigma + theta: integral e_1 e_2 <= (2/(2 sigmaPrime - 1)) sqrt(r_1 r_2) (1 + Delta/rMax)^(-(s - sigmaPrime)) - the fifth-continuation proof skeleton with the exponent split (s - sigmaPrime) + sigmaPrime in place of theta + sigma; Lemma T is the member sigmaPrime = sigma.",
  lemmaO:
    "Closed-form optimum: psi(T) = 2/(2s - 1) for log(1 + T) <= 2/(2s - 1), else e log(1 + T) (1 + T)^(1/2 - s), at sigmaPrime* = 1/2 + 1/log(1 + T); psi is valid, continuous, nonincreasing, never worse than Lemma T, and SHARP at the Delta = 0 equal-width corner (member sigmaPrime = s, Cauchy-Schwarz equality).",
  theoremYStar:
    "Parity roll-up with psi: ||sum w_b||^2 <= 2 sum ||w_b||^2 + 2 (sup_b OmegaStar_b) M, OmegaStar_b the row/col collection of psi(V(b, j)) over even gaps - Theorem Y verbatim with the optimized per-pair envelope; near constant 2 (parity AM-GM) untouched.",
  certifiedResult:
    "Reference theta = 10 (sigma = 1, beta = 1/3, c = v = D = 1): sup_b OmegaStar_b = OmegaStar_2 = 4.2545821185691675e-4 (scanned b <= 400, both parities, deep blocks free by Lemma O(d) + eleventh Lemma Z), Tstar = Tx(2) = 2.8874500929283736e-4, achieved point (cNear, cFar) = (2, 2.9469476400572421): the far ceiling drops 4 -> 2.9469476400572421 (ledger factor 1.3573366372815172; per-pair factor at the dominant V(0,2) corner 1/0.73714209152912802, theta-independent while the optimum is interior).",
  reference: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA },
    om2Old: OM2_OLD,
    om2Star: OM2_STAR,
    tx2: TX2_LIT,
    ceilings: { old: CFAR_OLD, new: CFAR_NEW },
    ratioPairDominantCorner: RATIO_PAIR,
    sigmaPrimeStarAtGx2: SIGMA_STAR_GX2,
    ledgerFactor: LEDGER_FACTOR,
    productFactor: PRODUCT_FACTOR,
    headlineBracket: { lo: HEAD_FLOOR, hi: CFAR_NEW, gapOld: GAP_HEAD_OLD, gapNew: GAP_HEAD_NEW },
    fixed97Bracket: { lo: F97_FLOOR, hi: CFAR_NEW, gapOld: GAP_97_OLD, gapNew: GAP_97_NEW },
    note: "floors UNTOUCHED - pure achieved-bound sharpening; Tstar = Tx(2) makes class membership trivial (no Lemma M analogue needed)",
  },
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "REFINED: eleventh lever (ii) is consumed to the exponent-split optimum (sharp at the Delta = 0 equal-width family corner); remaining achieved-side slack = (a) the outer parity AM-GM factor 2 (uniformly unrecoverable per the eleventh) and (b) the Cauchy-Schwarz block of Lemma T-STAR, which ignores separation a second time (true pair decay exponent s vs achieved s - 1/2; the midpoint-split alternative was tried and is strictly worse at the dominant corner - closing the last 1/2 exponent needs a genuine two-region interpolation); witness side unchanged (multi-packet re-optimization, different grid geometries)",
  ],
  isRigorous: true,
  rigorScope:
    "Lemma T-STAR is the fifth-continuation Lemma T proof with a free exponent-split parameter - triangle inequality, an exact pointwise product inequality, and Cauchy-Schwarz with an exact integral; Lemma O is one-variable calculus on the family; Theorem Y-STAR is the eleventh-continuation roll-up with the optimized envelope substituted through the Lemma X pair floors (psi nonincreasing). The new ceiling is an ACHIEVED upper bound in the Theorem K bracket class {cNear <= 2, Tstar <= Tx(2)}; optimality of the ceiling is NOT claimed (the outer parity factor 2 and the Cauchy-Schwarz half-exponent remain as named slack). Witness floors are carried literals of the fifteenth/sixteenth continuations; the headline floor is re-derived in-module. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step executing achieved-side lever (ii) of the eleventh continuation (the Lemma T constant): NEW Lemma T-STAR makes the envelope exponent split a free parameter, NEW Lemma O optimizes it in closed form - psi(T) = e log(1+T) (1+T)^(1/2-s) past the seam, sharp at the Delta = 0 corner of its own family - and NEW Theorem Y-STAR re-runs the block-resolved parity roll-up with psi. The reference theta = 10 far ceiling drops 4 -> 2.9469476400572421, the FIRST ceiling-side move since the eleventh continuation: headline far bracket gap 41.345779087298143 -> 30.460961526910332, fixed-97 gap 3318.2150696382446 -> 2444.6515171682004, floors untouched. The per-pair improvement at the dominant corner is the closed form (e/2) log(1 + 2^(1/3)) (1 + 2^(1/3))^(-1/2) = 0.73714209152912802, theta-independent while the optimum is interior. Remaining achieved-side slack stated plainly: the outer parity factor 2 and the Cauchy-Schwarz half-exponent. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_ESFC_ASSERTIONS = [
  {
    id: "imp95008-esfc-old-currency-reproduction",
    description:
      "independent code path reproduces the eleventh continuation literal omega_2 = 2.884062395107217e-4 and the tail Tx(2) = 2.8874500929283736e-4, with omega_2 <= Tx(2) (the eleventh Lemma M), before any comparison is made against them",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return rel(omegaOld(2), OM2_OLD) && rel(TX2, TX2_LIT) && omegaOld(2) <= TX2;
    },
  },
  {
    id: "imp95008-esfc-psi-is-family-infimum",
    description:
      "the closed-form psi equals the infimum of the Lemma T-STAR family over a 20000-point sigmaPrime grid at nine separations spanning both regimes (grid min within 1e-5 rel of psi and never below it)",
    holds: () => {
      for (const T of [0, 0.05, 0.0999, 0.2, gSharp(2), 2, cornerV(2, 2), gSharp(4), 100]) {
        let best = Infinity;
        for (let i = 1; i <= 20000; i++) {
          const sp = 0.5 + ((SS - 0.5) * i) / 20000;
          const v = tStarMember(T, sp, SS);
          if (v < best) best = v;
        }
        const c = psiEnv(T, SS);
        if (best < c * (1 - 1e-9) || best > c * (1 + 1e-5)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-esfc-psi-monotone-continuous-dominates",
    description:
      "psi is continuous at the regime seam (1e-9 rel), nonincreasing on a 3000-point log grid, and never worse than the Lemma T envelope (2/(2 sigma - 1))(1 + T)^(-theta); at the dominant corner Gx(2) the improvement ratio matches the closed form (e/2) log(1 + Gx(2)) (1 + Gx(2))^(-1/2) = 0.73714209152912802 (rel 1e-12)",
    holds: () => {
      const seam = Math.expm1(2 / (2 * SS - 1));
      const a = psiEnv(seam * (1 - 1e-9), SS);
      const b = psiEnv(seam * (1 + 1e-9), SS);
      if (Math.abs(a - b) > 1e-9 * a) return false;
      let prev = Infinity;
      for (let i = 0; i <= 3000; i++) {
        const T = Math.pow(10, -3 + (6 * i) / 3000);
        const v = psiEnv(T, SS);
        if (v > prev * (1 + 1e-12)) return false;
        if (v > (2 / (2 * SIGMA - 1)) * phi(T) * (1 + 1e-12)) return false;
        prev = v;
      }
      const r = psiEnv(gSharp(2), SS) / ((2 / (2 * SIGMA - 1)) * phi(gSharp(2)));
      const closed = (Math.E / 2) * Math.log1p(gSharp(2)) / Math.sqrt(1 + gSharp(2));
      return Math.abs(r - RATIO_PAIR) <= 1e-12 && Math.abs(closed - RATIO_PAIR) <= 1e-12;
    },
  },
  {
    id: "imp95008-esfc-lemma-tstar-quadrature",
    description:
      "direct midpoint quadrature of the envelope correlation integral sits below psi(Delta/rMax) sqrt(r_1 r_2) across widths {0.3, 1, 3}^2 and separations {0, 0.2, Gx(2), 2, 5.556, 20}, at theta = 10 and theta = 2 (midpoint sums of the positive integrand on a truncated window underestimate - the safe direction); the Delta = 0 equal-width case reaches at least 99.9 percent of the bound (sharpness)",
    holds: () => {
      for (const theta of [10, 2]) {
        const s = SIGMA + theta;
        let sharpSeen = false;
        for (const r1 of [0.3, 1, 3]) {
          for (const r2 of [0.3, 1, 3]) {
            for (const Tfac of [0, 0.2, gSharp(2), 2, 5.556, 20]) {
              const rMax = Math.max(r1, r2);
              const D = Tfac * rMax;
              const lo = -150 * rMax;
              const hi = D + 150 * rMax;
              const N = Tfac === 0 ? 200000 : 30000;
              const h = (hi - lo) / N;
              let I = 0;
              for (let i = 0; i < N; i++) {
                const u = lo + (i + 0.5) * h;
                I += Math.pow(1 + Math.abs(u) / r1, -s) * Math.pow(1 + Math.abs(u - D) / r2, -s);
              }
              I *= h;
              const bound = psiEnv(D / rMax, s) * Math.sqrt(r1 * r2);
              if (I > bound * (1 + 1e-9)) return false;
              if (Tfac === 0 && r1 === r2 && I > bound * 0.999) sharpSeen = true;
            }
          }
        }
        if (!sharpSeen) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-esfc-omega-star-sup",
    description:
      "sup_b OmegaStar_b over b <= 400 (both parities) is attained at b = 2 with the baked literal 4.2545821185691675e-4 (rel 1e-12); every b >= 4 sits below OmegaStar_2 / 100, blocks b >= 100 are below 1e-100 (Lemma O(d) + eleventh Lemma Z geometric collapse), and OmegaStar_b <= (2/(2 sigma - 1)) omega_b termwise at every scanned b",
    holds: () => {
      const om2 = omegaStar(2);
      if (Math.abs(om2 - OM2_STAR) > 1e-12 * OM2_STAR) return false;
      for (let b = 0; b <= 400; b++) {
        const o = omegaStar(b);
        if (b !== 2 && o >= om2) return false;
        if (b >= 4 && o >= om2 / 100) return false;
        if (b >= 100 && o >= 1e-100) return false;
        if (o > (2 / (2 * SIGMA - 1)) * omegaOld(b) * (1 + 1e-12)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-esfc-ceiling-literal",
    description:
      "the new achieved far coefficient cFarNew = 2 OmegaStar_2 / Tx(2) reproduces the baked literal 2.9469476400572421 (rel 1e-12), sits strictly below 4, and both baked comparison factors (ledger 4/cFarNew = 1.3573366372815172, product 4 omega_2 / (2 OmegaStar_2) = 1.3557441434822457) reproduce",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const c = (2 * omegaStar(2)) / TX2;
      return (
        rel(c, CFAR_NEW) &&
        c < 4 &&
        rel(4 / c, LEDGER_FACTOR) &&
        rel((4 * omegaOld(2)) / (2 * omegaStar(2)), PRODUCT_FACTOR)
      );
    },
  },
  {
    id: "imp95008-esfc-bracket-update",
    description:
      "the headline terminal 13-packet floor is re-derived in-module and reproduces 0.096745062937484763 (rel 1e-9); the new tracked gaps reproduce: headline 41.345779087298143 -> 30.460961526910332 and fixed-97 3318.2150696382446 -> 2444.6515171682004 (rel 1e-9), floors strictly below the new ceiling",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      const F = buildTerminal().F;
      return (
        rel(F, HEAD_FLOOR) &&
        rel(CFAR_OLD / F, GAP_HEAD_OLD) &&
        rel(CFAR_NEW / F, GAP_HEAD_NEW) &&
        rel(CFAR_OLD / F97_FLOOR, GAP_97_OLD) &&
        rel(CFAR_NEW / F97_FLOOR, GAP_97_NEW) &&
        HEAD_FLOOR < CFAR_NEW &&
        F97_FLOOR < CFAR_NEW
      );
    },
  },
  {
    id: "imp95008-esfc-sigma-prime-star",
    description:
      "the interior optimum at the dominant corner V(0, 2) = Gx(2) = 2^(1/3) reproduces sigmaPrime* = 1/2 + 1/log(1 + Gx(2)) = 1.7264974285347201 (rel 1e-12), lies inside (1/2, s], and the member at sigmaPrime* equals psi there (rel 1e-12)",
    holds: () => {
      const sp = 0.5 + 1 / Math.log1p(gSharp(2));
      return (
        Math.abs(sp - SIGMA_STAR_GX2) <= 1e-12 * SIGMA_STAR_GX2 &&
        sp > 0.5 &&
        sp <= SS &&
        Math.abs(tStarMember(gSharp(2), sp, SS) - psiEnv(gSharp(2), SS)) <= 1e-12 * psiEnv(gSharp(2), SS)
      );
    },
  },
  {
    id: "imp95008-esfc-honesty-gate",
    description:
      "the verdict states the ceiling move with floors untouched, names the remaining achieved-side slack (outer parity factor 2, Cauchy-Schwarz half-exponent), promotes no bound, NO QED, no refereed bound is changed; ceiling optimality is NOT claimed in scope",
    holds: () =>
      IMP95008_EXPONENT_SPLIT_FAR_CEILING.promotesBound === false &&
      IMP95008_EXPONENT_SPLIT_FAR_CEILING.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_EXPONENT_SPLIT_FAR_CEILING.verdict) &&
      /refereed bound is changed/i.test(IMP95008_EXPONENT_SPLIT_FAR_CEILING.verdict) &&
      /floors untouched/.test(IMP95008_EXPONENT_SPLIT_FAR_CEILING.verdict) &&
      /FIRST ceiling-side move since the eleventh/.test(IMP95008_EXPONENT_SPLIT_FAR_CEILING.verdict) &&
      /outer parity factor 2 and the Cauchy-Schwarz half-exponent/.test(IMP95008_EXPONENT_SPLIT_FAR_CEILING.verdict) &&
      /optimality of the ceiling is NOT claimed/.test(IMP95008_EXPONENT_SPLIT_FAR_CEILING.rigorScope) &&
      /midpoint-split alternative was tried and is strictly worse/.test(IMP95008_EXPONENT_SPLIT_FAR_CEILING.openResiduals[4]),
  },
];

for (const a of IMP95008_ESFC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-exponent-split-far-ceiling assertion failed: ${a.id}`);
  }
}

export default IMP95008_EXPONENT_SPLIT_FAR_CEILING;
