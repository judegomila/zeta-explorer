/**
 * imp-95116 - ASSEMBLE the far-ceiling roll-up term with the TRUE
 * legality-weighted imp-95008 witness mass, versus the imp-95100 uniform-currency
 * proxy. MEASUREMENT only, NO QED, no bound change.
 *
 * CONTEXT. imp-95100 (imp-95100-witness-radii-mass-instantiation.js) instantiated
 * the roll-up ceiling term ceilTerm = 2 (sup_b OmegaE_b) M using the imp-95076
 * UNIFORM-currency mass M(A) = A^2 sum_i r_i (currency n_i = A sqrt(r_i), unit
 * amplitude, no legality weighting), landing ceilTerm/A^2 = 6.036200329457272e-4
 * on the imp-95008 pentaWitness radii (sum_i r_i = 7.694649928783372). Its
 * SUB-GAP (openResiduals[1]) states plainly that the imp-95008 witness carries a
 * DIFFERENT, legality- and amplitude-weighted mass
 *   M = sum_b (sum_i a_i sqrt(r_i) / h_i)^2,  h_i = hLegal(mu_i, r_i, s),
 * with NON-UNIFORM per-packet amplitudes a_i, which imp-95100 did NOT reproduce.
 * This module measures that true witness mass and assembles the ceiling term with
 * it, placing the two mass conventions on ONE concrete number.
 *
 * The legality-weighted mass form is exactly the M returned by the imp-95008
 * floorMultiRate machinery (imp-95008-witness-floor-pin.js, floor = E/(Tx(2) M)):
 * per-packet currency n_i = a_i sqrt(r_i) / h_i is grouped by dyadic block b(k)
 * BEFORE squaring, so co-block packets add coherently. The base amplitudes a_i
 * and rates mu_i are the imp-95008 headline JOINT_BIG five-packet base at
 * P_BIG = 999983 (matching imp-95100 pentaWitness); the ceiling coefficient
 * sup_b OmegaE_b is re-derived on the SAME imp-95076 composite-Simpson path so the
 * assembly is independent.
 *
 * FINDING A (ceiling coefficient, independent re-derivation). The imp-95076
 * Simpson machinery re-derives sup_b OmegaE_b = 3.9223358991795465e-5 (b=2),
 * reproducing the imp-95100 / imp-95076 literal bit-for-bit; the coefficient side
 * carries no amplitude.
 *
 * FINDING B (the true legality-weighted witness mass). On the imp-95008
 * pentaWitness at P_BIG = 999983 (blocks [0,1,1,2,3], radii r_i, amplitudes
 * a_i = JOINT_BIG.a, rates mu_i = JOINT_BIG.mus), the per-packet legality heights
 *   h_i = [0.9191548894247307, 0.9195635830482034, 0.22032934519461947,
 *          0.03278406687418538, 0.0038446660252138753]
 * inflate the outer-packet currencies (block-2 term 1.6666, block-3 term 0.0120),
 * but the outer amplitudes a_i are TINY (down to 3.27e-5), so the block-grouped
 * mass is
 *   M_legal = sum_b nb^2 = 7.159056371719082,
 * with nb = [1.3318767167657697, 1.6147118187210323, 1.6666499753931803,
 *            0.012016033490453375]. This is SMALLER than the uniform-currency
 * proxy sum_i r_i = 7.694649928783372: the height inflation is outweighed by the
 * true amplitude decay of the outer packets.
 *
 * FINDING C (the assembled ceiling term and the mass-convention ratio). With the
 * true witness mass the assembled roll-up ceiling term is
 *   ceilTerm_legal = 2 (sup_b OmegaE_b) M_legal = 5.616044762208765e-4,
 * versus the imp-95100 uniform-currency proxy 6.036200329457272e-4. Since the
 * amplitude-free coefficient sup_b OmegaE_b is common, the ratio is exactly the
 * mass ratio
 *   ceilTerm_legal / 6.036200329457272e-4 = M_legal / sum_i r_i
 *     = 0.9303940319544888,
 * i.e. the true legality- and amplitude-weighted witness mass gives a ceiling
 * term ~6.96 percent BELOW the uniform-currency proxy. The two mass conventions
 * are now a single concrete number, not a proportionality.
 *
 * SUB-GAP (honest, named; inherited). (1) The base amplitudes a_i and rates mu_i
 * are the imp-95008 JOINT_BIG optimizer output (near-optimal, optimality NOT
 * claimed), not the paper Section 4.5 packet amplitudes A_d, which are not pinned
 * in this repository; the ratio 0.9304 is therefore a MODEL-FAMILY measurement of
 * the two conventions, not a paper ceiling term. (2) Only the five-packet base is
 * used (matching the imp-95100 pentaWitness comparison); the full 13-packet
 * terminal witness would carry a larger, appended mass - not the object imp-95100
 * proxied. No single paper ceiling term is CLAIMED.
 *
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// -- shared conventions (identical to imp-95008 / imp-95100) ------------------
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;
const THETA = 10;
const SS = SIGMA + THETA;
const P_BIG = 999983;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

// per-packet Lemma V legality height h(mu, r, s) (imp-95008 hLegal)
function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}

// -- imp-95076 ceiling-coefficient machinery (composite Simpson) --------------
function iSimpson(T, rho, s, N, pad) {
  if (N % 2 === 1) N += 1;
  const lo = -pad;
  const hi = T + pad;
  const h = (hi - lo) / N;
  const f = (u) =>
    Math.pow(1 + Math.abs(u) / rho, -s) * Math.pow(1 + Math.abs(u - T), -s);
  let acc = f(lo) + f(hi);
  for (let i = 1; i < N; i++) {
    acc += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return ((acc * h) / 3) / Math.sqrt(rho);
}

// ceiling-shape functional sup_b OmegaE_b (imp-95076 / imp-95100 path)
function supOmegaE(sigma, beta, c, v, D, theta) {
  const Q = isolationQ(c, v, beta, D);
  const s = sigma + theta;
  const gSharp = (j) => Math.pow(2, beta) * ((Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta)));
  const cornerV = (b, j) => Math.pow(2, b * (1 - beta)) * gSharp(j);
  const rhoCap = (j) => Math.pow(2, -(j - 1) * beta);
  const envE = (b, j) => iSimpson(cornerV(b, j), rhoCap(j), s, 40000, 120);
  const omegaE = (b) => {
    let sum = 0;
    for (let j = 2; j <= 40; j += 2) {
      const t = envE(b, j);
      if (!Number.isFinite(t) || t === 0) break;
      sum += t;
    }
    const r = b % 2;
    for (let j = 2; j <= b - r; j += 2) sum += envE(b - j, j);
    return sum;
  };
  let sup = 0;
  let argb = 0;
  for (let b = 0; b <= 8; b++) {
    const o = omegaE(b);
    if (o > sup) {
      sup = o;
      argb = b;
    }
  }
  return { sup, argb };
}

// -- imp-95008 pentaWitness base geometry (matches imp-95100) -----------------
function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95116: block search failed");
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
    r: d.map((x) => CC * Math.pow(x, -BETA)),
    block: ks.map((k) => blockOf(p, k)),
    u: d.map((x) => VV / x),
  };
}

// imp-95008 headline JOINT_BIG five-packet base amplitudes / rates (P_BIG)
const JOINT_BASE = {
  mus: [7.69395202209785, 7.696569089680406, 3.901022492015913, 2.7978054595942754, 1.6462804960465607],
  a: [1.0906392801493483, 1.0907349936022739, 0.04954395066558243, 0.04336742919997075, 0.000032666623379528365],
};

// -- assemble the legality-weighted mass and ceiling term ---------------------
const WITNESS = pentaWitness(P_BIG);
const SUM_WITNESS_R = WITNESS.r.reduce((acc, x) => acc + x, 0);

// true legality-weighted witness mass M = sum_b (sum_i a_i sqrt(r_i)/h_i)^2,
// per-packet currency grouped by dyadic block BEFORE squaring (imp-95008 form)
function legalityWeightedMass() {
  const heights = [];
  const currencies = [];
  const bmax = Math.max(...WITNESS.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < WITNESS.r.length; i++) {
    const h = hLegal(JOINT_BASE.mus[i], WITNESS.r[i], SS);
    const cur = (JOINT_BASE.a[i] * Math.sqrt(WITNESS.r[i])) / h;
    heights.push(h);
    currencies.push(cur);
    nb[WITNESS.block[i]] += cur;
  }
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  return { M, nb, heights, currencies };
}

const COEF = supOmegaE(SIGMA, BETA, CC, VV, DD, THETA);
const MASS = legalityWeightedMass();
const M_LEGAL = MASS.M;
const CEIL_TERM_LEGAL = 2 * COEF.sup * M_LEGAL;
// imp-95100 uniform-currency proxy ceilTerm/A^2 = 2 (sup_b OmegaE_b) sum_i r_i
const CEIL_TERM_UNIFORM = 2 * COEF.sup * SUM_WITNESS_R;
const MASS_RATIO = M_LEGAL / SUM_WITNESS_R;

// -- baked literals (all re-derived by the assertions) ------------------------
const SUP_OMEGA_LIT = 3.9223358991795465e-5; // sup_b OmegaE_b at the model point (b=2)
const SUM_WITNESS_R_LIT = 7.694649928783372; // uniform-currency mass base (imp-95100)
const M_LEGAL_LIT = 7.159056371719082; // true legality-weighted witness mass
const CEIL_TERM_LEGAL_LIT = 5.616044762208765e-4; // ceilTerm with the true mass
const CEIL_TERM_UNIFORM_LIT = 6.036200329457272e-4; // imp-95100 uniform-currency proxy
const MASS_RATIO_LIT = 0.9303940319544888; // legality-weighted / uniform-currency
const HEIGHTS_LIT = [
  0.9191548894247307, 0.9195635830482034, 0.22032934519461947,
  0.03278406687418538, 0.0038446660252138753,
];
const NB_LIT = [1.3318767167657697, 1.6147118187210323, 1.6666499753931803, 0.012016033490453375];

// -- verdict object -----------------------------------------------------------
export const IMP95116_LEGALITY_WEIGHTED_WITNESS_MASS = {
  ticket:
    "imp-95116 (assemble the far-ceiling roll-up term with the TRUE legality-weighted imp-95008 witness mass M = sum_b (sum_i a_i sqrt(r_i)/h_i)^2, versus the imp-95100 uniform-currency proxy 6.036200329457272e-4)",
  source:
    "imp-95100-witness-radii-mass-instantiation.js SUB-GAP(2) (uniform-currency, not legality-weighted mass); imp-95008-witness-floor-pin.js floorMultiRate mass M and JOINT_BIG base (P_BIG=999983); imp-95076-adin-cancellation-trace.js ceiling coefficient; Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture.",
  findingACeilingCoefficient:
    "The imp-95076 composite-Simpson machinery re-derives the ceiling coefficient sup_b OmegaE_b = 3.9223358991795465e-5 (attained at b=2), reproducing the imp-95100 / imp-95076 literal bit-for-bit; the coefficient side carries no amplitude.",
  findingBLegalityWeightedMass:
    "On the imp-95008 pentaWitness at P_BIG=999983 (blocks [0,1,1,2,3], amplitudes JOINT_BIG.a, rates JOINT_BIG.mus) the per-packet legality heights h_i = [0.9192, 0.9196, 0.2203, 0.03278, 0.003845] inflate the outer-packet currencies (block-2 term 1.6666, block-3 term 0.0120), but the outer amplitudes a_i are tiny (down to 3.27e-5), so the block-grouped true mass M_legal = sum_b nb^2 = 7.159056371719082 (nb = [1.3319, 1.6147, 1.6666, 0.01202]) is SMALLER than the uniform-currency proxy sum_i r_i = 7.694649928783372 - the height inflation is outweighed by the true amplitude decay of the outer packets.",
  findingCAssembledTermAndRatio:
    "With the true witness mass the assembled roll-up ceiling term is ceilTerm_legal = 2 (sup_b OmegaE_b) M_legal = 5.616044762208765e-4, versus the imp-95100 uniform-currency proxy 6.036200329457272e-4. Since the amplitude-free coefficient is common, the ratio is exactly the mass ratio ceilTerm_legal / 6.036200329457272e-4 = M_legal / sum_i r_i = 0.9303940319544888 - the true legality- and amplitude-weighted witness mass gives a ceiling term ~6.96 percent BELOW the uniform-currency proxy. The two mass conventions are now a single concrete number.",
  reference: {
    modelPoint: { sigma: SIGMA, beta: "1/3", c: CC, v: VV, D: DD, theta: THETA, s: SS },
    pBig: P_BIG,
    supOmega: SUP_OMEGA_LIT,
    witnessRadii: WITNESS.r,
    witnessBlocks: WITNESS.block,
    baseAmplitudes: JOINT_BASE.a,
    baseRates: JOINT_BASE.mus,
    legalityHeights: HEIGHTS_LIT,
    blockCurrencies: NB_LIT,
    massLegalityWeighted: M_LEGAL_LIT,
    massUniformCurrency: SUM_WITNESS_R_LIT,
    ceilTermLegalityWeighted: CEIL_TERM_LEGAL_LIT,
    ceilTermUniformCurrency: CEIL_TERM_UNIFORM_LIT,
    massConventionRatio: MASS_RATIO_LIT,
    note: "measurement only; the two mass conventions placed on one number; base amplitudes are the imp-95008 JOINT_BIG optimizer output (optimality NOT claimed), not the paper A_d; five-packet base only.",
  },
  openResiduals: [
    "the base amplitudes a_i and rates mu_i are the imp-95008 JOINT_BIG optimizer output (near-optimal, optimality NOT claimed), not the paper Section 4.5 packet amplitudes A_d which are not pinned here; the ratio 0.9304 is a model-family measurement of the two conventions, not a paper ceiling term",
    "only the five-packet base is used (matching the imp-95100 pentaWitness comparison); the full 13-packet terminal witness carries a larger appended mass, not the object imp-95100 proxied; no single paper ceiling term is claimed",
  ],
  isRigorous: false,
  rigorScope:
    "MEASUREMENT only, NO theorem. The ceiling coefficient sup_b OmegaE_b is an exact evaluation on the imp-95076 composite-Simpson path; the legality-weighted mass M = sum_b (sum_i a_i sqrt(r_i)/h_i)^2 is an exact evaluation of the imp-95008 floorMultiRate mass form on the JOINT_BIG base amplitudes. The base amplitudes are an optimizer output (optimality is NOT claimed) and no paper amplitude A_d is instantiated, so no numeric paper ceiling term is CLAIMED. The numerics ARE the measurement. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT assembling the far-ceiling roll-up term with the TRUE legality-weighted imp-95008 witness mass, versus the imp-95100 uniform-currency proxy. FINDING A: the imp-95076 Simpson machinery re-derives sup_b OmegaE_b = 3.9223358991795465e-5 (b=2, amplitude-free). FINDING B: on the imp-95008 pentaWitness (P_BIG=999983) the legality-weighted mass M_legal = sum_b (sum_i a_i sqrt(r_i)/h_i)^2 = 7.159056371719082 comes in BELOW the uniform-currency proxy sum_i r_i = 7.694649928783372 - the outer-packet height inflation (h down to 0.003845) is outweighed by the true amplitude decay (a down to 3.27e-5). FINDING C: the assembled ceiling term ceilTerm_legal = 2 (sup_b OmegaE_b) M_legal = 5.616044762208765e-4, a ratio 0.9303940319544888 to the uniform-currency proxy 6.036200329457272e-4 - the two mass conventions placed on one concrete number (~6.96 percent below). SUB-GAP named plainly: the base amplitudes are the imp-95008 JOINT_BIG optimizer output (optimality NOT claimed), not the paper A_d, and only the five-packet base is used - no single paper ceiling term is claimed. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) --------------------------
export const IMP95116_ASSERTIONS = [
  {
    id: "imp95116-ceiling-coefficient-reproduces-imp95100",
    description:
      "Finding A: the imp-95076 Simpson machinery re-derives sup_b OmegaE_b = 3.9223358991795465e-5 (at b=2), reproducing the imp-95100 coefficient literal (rel 1e-12)",
    holds: () =>
      Math.abs(COEF.sup - SUP_OMEGA_LIT) <= 1e-12 * SUP_OMEGA_LIT && COEF.argb === 2,
  },
  {
    id: "imp95116-legality-weighted-mass",
    description:
      "Finding B: the true legality-weighted witness mass M = sum_b (sum_i a_i sqrt(r_i)/h_i)^2 = 7.159056371719082 (rel 1e-9), with the baked per-packet heights and block currencies, is SMALLER than the uniform-currency proxy sum_i r_i = 7.694649928783372",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      const heightsOk = MASS.heights.every((h, i) => rel(h, HEIGHTS_LIT[i]) && h > 0 && h <= 1);
      const nbOk = MASS.nb.every((x, i) => rel(x, NB_LIT[i]));
      return (
        rel(M_LEGAL, M_LEGAL_LIT) &&
        rel(SUM_WITNESS_R, SUM_WITNESS_R_LIT) &&
        M_LEGAL < SUM_WITNESS_R &&
        heightsOk &&
        nbOk
      );
    },
  },
  {
    id: "imp95116-assembled-term-and-ratio",
    description:
      "Finding C: ceilTerm_legal = 2 (sup_b OmegaE_b) M_legal = 5.616044762208765e-4, the uniform-currency proxy = 6.036200329457272e-4, and the ratio ceilTerm_legal/proxy = M_legal/sum_i r_i = 0.9303940319544888 (rel 1e-9)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(CEIL_TERM_LEGAL, CEIL_TERM_LEGAL_LIT) &&
        rel(CEIL_TERM_UNIFORM, CEIL_TERM_UNIFORM_LIT) &&
        rel(MASS_RATIO, MASS_RATIO_LIT) &&
        rel(CEIL_TERM_LEGAL / CEIL_TERM_UNIFORM, MASS_RATIO_LIT)
      );
    },
  },
  {
    id: "imp95116-honesty-gate",
    description:
      "the verdict names the sub-gap (optimizer-output amplitudes not the paper A_d; five-packet base only), records the two mass conventions on one number, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95116_LEGALITY_WEIGHTED_WITNESS_MASS.promotesBound === false &&
      IMP95116_LEGALITY_WEIGHTED_WITNESS_MASS.isRigorous === false &&
      IMP95116_LEGALITY_WEIGHTED_WITNESS_MASS.openResiduals.length === 2 &&
      /NO QED/.test(IMP95116_LEGALITY_WEIGHTED_WITNESS_MASS.verdict) &&
      /refereed bound is changed/i.test(IMP95116_LEGALITY_WEIGHTED_WITNESS_MASS.verdict) &&
      /MEASUREMENT/.test(IMP95116_LEGALITY_WEIGHTED_WITNESS_MASS.verdict) &&
      /SUB-GAP/.test(IMP95116_LEGALITY_WEIGHTED_WITNESS_MASS.verdict) &&
      /optimality is NOT claimed/i.test(IMP95116_LEGALITY_WEIGHTED_WITNESS_MASS.rigorScope),
  },
];

for (const a of IMP95116_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95116-legality-weighted-witness-mass assertion failed: ${a.id}`,
    );
  }
}

export default IMP95116_LEGALITY_WEIGHTED_WITNESS_MASS;
