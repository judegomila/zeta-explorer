/**
 * imp-95100 - INSTANTIATE the imp-95076 mass M(A) = A^2 M(1) on the imp-95008
 * witness radii and MEASURE the assembled roll-up ceiling term
 *   ceilTerm = 2 (sup_b OmegaE_b) M
 * at a representative packet amplitude. MEASUREMENT only, NO QED, no bound
 * change.
 *
 * CONTEXT. imp-95076 (imp-95076-adin-cancellation-trace.js) Findings C/D
 * established STRUCTURE only: the far coefficient cFar = 2 (sup_b OmegaE_b)/Tx(2)
 * is amplitude-invariant (the shape functionals cornerV, rhoCap, s, phiTail take
 * no amplitude), while the mass M = sum_b n_b^2 with currency n_b = A sqrt(r_b)
 * factors as M(A) = A^2 sum_b r_b for ANY positive radii - a proportionality, not
 * a paper number. imp-95076 measured that proportionality on the REPRESENTATIVE
 * radii r_b = rhoCap(b+1) (giving M(1) = 4.241406839130188 and ceilTerm/A^2 =
 * 0.0003327244461629), but never assembled it with the concrete imp-95008
 * witness radii. This module does that assembly: it takes the imp-95076
 * ceiling-COEFFICIENT side (sup_b OmegaE_b, Tx(2), cFar, re-derived on the SAME
 * independent Simpson path as imp-95076) and instantiates the MASS side on the
 * imp-95008 pentaWitness radii r_i = c d_i^(-beta) at the large-p base geometry
 * (imp-95008-witness-floor-pin.js, P_BIG = 999983), then evaluates
 *   ceilTerm(A) = 2 (sup_b OmegaE_b) M(A),  M(A) = A^2 sum_i r_i
 * across a representative amplitude scan. The ledger SPLIT is thereby exhibited
 * as a concrete number: cFar coefficient FIXED (amplitude-invariant), mass side
 * A^2-scaled on real witness radii, rather than a proportionality.
 *
 * FINDING A (ceiling COEFFICIENT re-derivation, independent path). The imp-95076
 * composite-Simpson machinery re-derives the ceiling-shape functionals at the
 * model point (sigma=1, beta=1/3, c=v=D=1, theta=10, s=11):
 *   sup_b OmegaE_b = 3.9223358991795465e-5 (attained at b=2),
 *   Tx(2) = 2.8874500929283736e-4,
 *   cFar = 2 (sup_b OmegaE_b)/Tx(2) = 0.2716816410981926.
 * These reproduce the imp-95076 Finding-A/B literals bit-for-bit; the coefficient
 * side carries no amplitude.
 *
 * FINDING B (the imp-95008 witness radii, a concrete mass base). The imp-95008
 * pentaWitness at P_BIG = 999983 places five packets at grid centers with radii
 *   r_i = [1.2599206299143302, 1.2599214698759762, 1.5874005228258727,
 *          1.5874026393994125, 2.0000046667677798]
 * (blocks [0,1,1,2,3], centers u -> {2,2,4,4,8}), whose sum is
 *   sum_i r_i = 7.694649928783372.
 * This is the concrete imp-95008 witness radius set, 1.814x larger than the
 * imp-95076 representative sum 4.241406839130188.
 *
 * FINDING C (the assembled ceiling term as a concrete number). Instantiating the
 * imp-95076 uniform-currency mass M(A) = A^2 sum_i r_i on those witness radii,
 * the assembled roll-up ceiling term is
 *   ceilTerm(A) = 2 (sup_b OmegaE_b) M(A) = 7.844671798359093e-5 * A^2 * 7.694649928783372,
 * i.e. ceilTerm(A)/A^2 = 6.036200329457272e-4 EXACTLY across the amplitude scan
 * A in {0.5,1,2,3,7} (ceilTerm at A=1 is 6.036200329457272e-4). The ledger split
 * is now a number, not a proportionality: the coefficient cFar = 0.2716816410981926
 * is bit-invariant across the scan while the mass side scales as A^2 on the real
 * witness radii. Cross-check: the SAME machinery on the imp-95076 representative
 * radii reproduces the baked imp-95076 Finding-D figure ceilTerm/A^2 =
 * 0.0003327244461629, so the witness-radii figure differs from it exactly by the
 * radius-sum ratio 7.694649928783372 / 4.241406839130188.
 *
 * SUB-GAP (honest, named; inherited imp-95076 openResiduals[0] + imp-95008
 * openResiduals). (1) The actual Section 4.5 paper packet radii r_d and amplitude
 * A_d are NOT pinned in this repository; the radii used here are the imp-95008
 * MODEL-FAMILY grid radii (pentaWitness at P_BIG), not the paper packets, and the
 * amplitude scan is a representative sweep, not the paper A_d. (2) The mass form
 * used is the imp-95076 UNIFORM-currency mass M(A) = A^2 sum_i r_i (n_b = A
 * sqrt(r_b)); the imp-95008 witness carries a DIFFERENT, legality- and
 * amplitude-weighted mass M = sum_b (sum_i a_i sqrt(r_i)/h_i)^2 with non-uniform
 * a_i - this module does NOT claim to reproduce that witness mass, only to
 * instantiate the imp-95076 proportionality on the imp-95008 radii. So no single
 * paper ceiling term is CLAIMED; this is the STRUCTURE assembled to a concrete
 * representative number.
 *
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// -- imp-95076 ceiling-coefficient machinery (composite Simpson; amplitude is an
//    EXPLICIT argument that the SHAPE functionals do not consume) ---------------
function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

// composite Simpson of the normalized pair correlation (imp-95076 path;
// deterministic, so baked literals reproduce exactly)
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

// ceiling-shape functionals: sup_b OmegaE_b, Tx(2), cFar. Amplitude A is threaded
// but NONE of these consume it (imp-95076 Finding B); it only enters the mass.
function ceilingCoefficient(sigma, beta, c, v, D, theta) {
  const Q = isolationQ(c, v, beta, D);
  const s = sigma + theta;
  const gSharp = (j) => Math.pow(2, beta) * gOld(j, Q, beta);
  const cornerV = (b, j) => Math.pow(2, b * (1 - beta)) * gSharp(j);
  const rhoCap = (j) => Math.pow(2, -(j - 1) * beta);
  const phiTail = (x) => Math.pow(1 + x, -theta);
  let Tx2 = 0;
  for (let j = 2; j <= 800; j++) {
    const t = phiTail(gSharp(j));
    if (!Number.isFinite(t) || t === 0) break;
    Tx2 += t;
  }
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
  return { Q, s, Tx2, sup, argb, cFar: (2 * sup) / Tx2, rhoCap };
}

// -- imp-95008 witness radii (pentaWitness base geometry; matches
//    imp-95008-witness-floor-pin.js) --------------------------------------------
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;
const THETA = 10;
const P_BIG = 999983;

function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95100: block search failed");
  }
  return b;
}

function pentaWitnessRadii(p) {
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

// -- assemble the ceiling term ------------------------------------------------
const COEF = ceilingCoefficient(SIGMA, BETA, CC, VV, DD, THETA);
const WITNESS = pentaWitnessRadii(P_BIG);
const SUM_WITNESS_R = WITNESS.r.reduce((acc, x) => acc + x, 0);

// imp-95076 uniform-currency mass M(A) = A^2 sum_i r_i on the witness radii, and
// the assembled roll-up ceiling term ceilTerm(A) = 2 (sup_b OmegaE_b) M(A).
function massWitness(A) {
  return A * A * SUM_WITNESS_R;
}
function ceilTermWitness(A) {
  return 2 * COEF.sup * massWitness(A);
}

// representative-radii cross-check against the imp-95076 baked Finding-D figure
let SUM_REP_R = 0;
for (let b = 0; b <= 8; b++) SUM_REP_R += COEF.rhoCap(b + 1);
const REP_CEIL_TERM_PER_A2 = 2 * COEF.sup * SUM_REP_R;

const AMP_SCAN = [0.5, 1, 2, 3, 7];

// -- baked literals (all re-derived by the assertions) ------------------------
const SUP_OMEGA = 3.9223358991795465e-5; // sup_b OmegaE_b at the model point (b=2)
const TX2_LIT = 2.8874500929283736e-4;
const CFAR_LIT = 0.2716816410981926; // amplitude-invariant coefficient (imp-95076)
const SUM_WITNESS_R_LIT = 7.694649928783372; // sum of imp-95008 pentaWitness radii
const CEIL_TERM_PER_A2_WITNESS = 6.036200329457272e-4; // ceilTerm/A^2 on witness radii
const REP_CEIL_TERM_PER_A2_LIT = 0.0003327244461629; // imp-95076 Finding-D figure
const SUM_REP_R_LIT = 4.241406839130188; // imp-95076 representative M(1)

// -- verdict object -----------------------------------------------------------
export const IMP95100_WITNESS_RADII_MASS_INSTANTIATION = {
  ticket:
    "imp-95100 (instantiate the imp-95076 mass M(A)=A^2 M(1) on the imp-95008 witness radii and measure the assembled roll-up ceiling term 2 (sup_b OmegaE_b) M at a representative amplitude)",
  source:
    "imp-95076-adin-cancellation-trace.js Findings C/D (mass proportionality); imp-95008-witness-floor-pin.js pentaWitness radii (P_BIG=999983); Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture.",
  findingACeilingCoefficient:
    "The imp-95076 composite-Simpson machinery re-derives the ceiling-shape functionals at the model point: sup_b OmegaE_b = 3.9223358991795465e-5 (at b=2), Tx(2) = 2.8874500929283736e-4, cFar = 2 (sup_b OmegaE_b)/Tx(2) = 0.2716816410981926 - reproducing the imp-95076 literals bit-for-bit; the coefficient side carries no amplitude.",
  findingBWitnessRadii:
    "The imp-95008 pentaWitness at P_BIG=999983 places five packets (blocks [0,1,1,2,3], centers u -> {2,2,4,4,8}) with radii summing to sum_i r_i = 7.694649928783372, the concrete witness radius base (1.814x the imp-95076 representative sum 4.241406839130188).",
  findingCAssembledCeilingTerm:
    "Instantiating the imp-95076 uniform-currency mass M(A) = A^2 sum_i r_i on those witness radii, the assembled roll-up ceiling term is ceilTerm(A) = 2 (sup_b OmegaE_b) M(A) with ceilTerm(A)/A^2 = 6.036200329457272e-4 EXACTLY across A in {0.5,1,2,3,7} (ceilTerm at A=1 is 6.036200329457272e-4). The ledger split is now a number: cFar = 0.2716816410981926 is bit-invariant across the scan while the mass side scales as A^2 on the real witness radii. Cross-check: the same machinery on the imp-95076 representative radii reproduces the baked Finding-D figure ceilTerm/A^2 = 0.0003327244461629, differing from the witness figure exactly by the radius-sum ratio 7.694649928783372/4.241406839130188.",
  reference: {
    modelPoint: { sigma: SIGMA, beta: "1/3", c: CC, v: VV, D: DD, theta: THETA, s: SIGMA + THETA },
    supOmega: SUP_OMEGA,
    Tx2: TX2_LIT,
    cFar: CFAR_LIT,
    pBig: P_BIG,
    witnessRadii: WITNESS.r,
    witnessBlocks: WITNESS.block,
    sumWitnessRadii: SUM_WITNESS_R_LIT,
    massWitnessAt1: SUM_WITNESS_R_LIT,
    ceilTermPerA2Witness: CEIL_TERM_PER_A2_WITNESS,
    sumRepresentativeRadii: SUM_REP_R_LIT,
    ceilTermPerA2Representative: REP_CEIL_TERM_PER_A2_LIT,
    radiusSumRatio: SUM_WITNESS_R_LIT / SUM_REP_R_LIT,
    amplitudeScan: AMP_SCAN,
    note: "assembly/measurement only; cFar amplitude-invariant, mass A^2-scaled on the imp-95008 witness radii; no paper (r_d, A_d) pinned; uniform-currency mass, NOT the legality-weighted imp-95008 witness mass.",
  },
  openResiduals: [
    "the actual Section 4.5 paper packet radii r_d and amplitude A_d are not pinned in this repository; the radii used are the imp-95008 model-family grid radii (pentaWitness at P_BIG) and the amplitude scan is representative, not the paper A_d",
    "the mass form is the imp-95076 uniform-currency mass M(A) = A^2 sum_i r_i (n_b = A sqrt(r_b)); the imp-95008 witness carries a different legality- and amplitude-weighted mass M = sum_b (sum_i a_i sqrt(r_i)/h_i)^2 - this module does not reproduce that witness mass, only instantiates the imp-95076 proportionality on the imp-95008 radii; no single paper ceiling term is claimed",
  ],
  isRigorous: false,
  rigorScope:
    "MEASUREMENT only, NO theorem. The ceiling coefficient (sup_b OmegaE_b, Tx(2), cFar) is an exact evaluation on the imp-95076 composite-Simpson path; the mass M(A) = A^2 sum_i r_i is an exact algebraic factorization on the imp-95008 witness radii. No paper radius or amplitude is instantiated, so no numeric paper ceiling term is CLAIMED; the uniform-currency mass is not the legality-weighted imp-95008 witness mass. The numerics ARE the measurement. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT assembling the imp-95076 mass proportionality on the imp-95008 witness radii. FINDING A: the imp-95076 Simpson machinery re-derives the ceiling coefficient sup_b OmegaE_b = 3.9223358991795465e-5 (b=2), Tx(2) = 2.8874500929283736e-4, cFar = 0.2716816410981926 (amplitude-free). FINDING B: the imp-95008 pentaWitness (P_BIG=999983) radii sum to 7.694649928783372 (blocks [0,1,1,2,3]). FINDING C: instantiating M(A) = A^2 sum_i r_i, the assembled roll-up ceiling term is ceilTerm(A) = 2 (sup_b OmegaE_b) M(A) with ceilTerm/A^2 = 6.036200329457272e-4 EXACTLY across A in {0.5,1,2,3,7} - the ledger split is a concrete number (cFar bit-invariant, mass A^2-scaled on real witness radii), cross-checking the imp-95076 Finding-D representative figure 0.0003327244461629 by the exact radius-sum ratio. SUB-GAP named plainly: the Section 4.5 paper radii r_d and amplitude A_d are not pinned here (imp-95008 model-family radii + representative amplitude used), and the mass is the imp-95076 uniform-currency form, NOT the legality-weighted imp-95008 witness mass - no single paper ceiling term is claimed. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) --------------------------
export const IMP95100_ASSERTIONS = [
  {
    id: "imp95100-ceiling-coefficient-reproduces-imp95076",
    description:
      "Finding A: the imp-95076 Simpson machinery re-derives sup_b OmegaE_b = 3.9223358991795465e-5 (at b=2), Tx(2) = 2.8874500929283736e-4 and cFar = 0.2716816410981926 (rel 1e-12), reproducing the imp-95076 coefficient literals",
    holds: () =>
      Math.abs(COEF.sup - SUP_OMEGA) <= 1e-12 * SUP_OMEGA &&
      Math.abs(COEF.Tx2 - TX2_LIT) <= 1e-12 * TX2_LIT &&
      Math.abs(COEF.cFar - CFAR_LIT) <= 1e-12 * CFAR_LIT &&
      COEF.argb === 2 &&
      COEF.s === 11,
  },
  {
    id: "imp95100-witness-radii-sum",
    description:
      "Finding B: the imp-95008 pentaWitness (P_BIG=999983) has five packets with blocks [0,1,1,2,3] and radii summing to 7.694649928783372 (rel 1e-12)",
    holds: () =>
      WITNESS.r.length === 5 &&
      WITNESS.block.join(",") === "0,1,1,2,3" &&
      Math.abs(SUM_WITNESS_R - SUM_WITNESS_R_LIT) <= 1e-12 * SUM_WITNESS_R_LIT,
  },
  {
    id: "imp95100-assembled-ceiling-term-per-a2-constant",
    description:
      "Finding C: the assembled ceiling term ceilTerm(A) = 2 (sup_b OmegaE_b) A^2 sum_i r_i has ceilTerm/A^2 = 6.036200329457272e-4 EXACTLY across A in {0.5,1,2,3,7} (mass A^2-scaled on the witness radii), with M(1) = 7.694649928783372",
    holds: () =>
      AMP_SCAN.every(
        (A) =>
          Math.abs(ceilTermWitness(A) / (A * A) - CEIL_TERM_PER_A2_WITNESS) <=
          1e-9 * CEIL_TERM_PER_A2_WITNESS,
      ) && Math.abs(massWitness(1) - SUM_WITNESS_R_LIT) <= 1e-12 * SUM_WITNESS_R_LIT,
  },
  {
    id: "imp95100-cross-check-representative-radii-imp95076",
    description:
      "the same machinery on the imp-95076 representative radii r_b=rhoCap(b+1) reproduces the baked Finding-D figure ceilTerm/A^2 = 0.0003327244461629 (rel 1e-6), and the witness figure exceeds it exactly by the radius-sum ratio 7.694649928783372/4.241406839130188 (rel 1e-9)",
    holds: () => {
      const ratio = CEIL_TERM_PER_A2_WITNESS / REP_CEIL_TERM_PER_A2;
      return (
        Math.abs(REP_CEIL_TERM_PER_A2 - REP_CEIL_TERM_PER_A2_LIT) <=
          1e-6 * REP_CEIL_TERM_PER_A2_LIT &&
        Math.abs(SUM_REP_R - SUM_REP_R_LIT) <= 1e-12 * SUM_REP_R_LIT &&
        Math.abs(ratio - SUM_WITNESS_R_LIT / SUM_REP_R_LIT) <=
          1e-9 * (SUM_WITNESS_R_LIT / SUM_REP_R_LIT)
      );
    },
  },
  {
    id: "imp95100-honesty-gate",
    description:
      "the verdict names the sub-gap (paper radii/amplitude not pinned; uniform-currency mass, not the legality-weighted witness mass), records the amplitude-invariant cFar and A^2 mass scaling, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95100_WITNESS_RADII_MASS_INSTANTIATION.promotesBound === false &&
      IMP95100_WITNESS_RADII_MASS_INSTANTIATION.isRigorous === false &&
      IMP95100_WITNESS_RADII_MASS_INSTANTIATION.openResiduals.length === 2 &&
      /NO QED/.test(IMP95100_WITNESS_RADII_MASS_INSTANTIATION.verdict) &&
      /refereed bound is changed/i.test(IMP95100_WITNESS_RADII_MASS_INSTANTIATION.verdict) &&
      /MEASUREMENT/.test(IMP95100_WITNESS_RADII_MASS_INSTANTIATION.verdict) &&
      /A\^2/.test(IMP95100_WITNESS_RADII_MASS_INSTANTIATION.verdict) &&
      /SUB-GAP/.test(IMP95100_WITNESS_RADII_MASS_INSTANTIATION.verdict),
  },
];

for (const a of IMP95100_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95100-witness-radii-mass-instantiation assertion failed: ${a.id}`,
    );
  }
}

export default IMP95100_WITNESS_RADII_MASS_INSTANTIATION;
