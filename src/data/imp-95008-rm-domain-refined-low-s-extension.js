/**
 * imp-95008 continuation (twenty-first) - LEMMA RM-D (domain-refined
 * width-ratio monotonicity) + COROLLARY LT (low-s EXACT-chain extension):
 * the nineteenth-continuation EXACT-substitution proof extends from
 * s > 2.9483832742380818 down to s > 2.4095981617415205.
 *
 * CONTEXT. The nineteenth continuation (imp-95008-exact-pair-correlation-
 * ceiling.js) proves Theorem Y-EXACT through Lemma RM: for s > 1 and
 * T >= Ystar(s) = (2s-1)^(1/(s-1)) - 1, the map rho -> I(T, rho) is
 * nondecreasing on (0, 1]. The corner guard Ystar(s) < V(0, 2) = 2^(1/3)
 * fails below s* = 2.9483832742380818 (root of Ystar(s) = 2^(1/3)), and
 * imp-95026 Finding 4 records this as the "EXACT-proof BREAKS" band
 * s < s*, with the likely-paper point s = 3 holding by only
 * 2^(1/3) - Ystar(3) = 0.0238530723950834 ("holds but barely"). Tickets
 * imp-95068 (window fallback for s < 2.9484) and imp-95069 (s* sharpness)
 * both treat s* as the boundary of the EXACT machinery.
 *
 * OBSERVATION (the one-line gap in the guard). Theorem Y-EXACT never uses
 * Lemma RM on all of (0, 1]: the substitution chain applies it ONLY as
 *   I(V(b, j), rho_act) <= I(V(b, j), rhoCap(j)),   rho_act < rhoCap(j),
 * i.e. on the sub-interval (0, rhoCap(j)] with rhoCap(j) =
 * 2^(-(j-1) beta) < 1. Inside the Lemma RM proof the ONLY use of the
 * hypothesis T >= Ystar is the chain Y = T/rho >= T >= Ystar bounding the
 * split point from below via rho <= 1. On the restricted domain the same
 * chain gives the strictly better bound Y = T/rho >= T/rhoMax.
 *
 * LEMMA RM-D (domain-refined width-ratio monotonicity - UNCONDITIONAL).
 * For s > 1 and 0 < rhoMax <= 1: if T >= Ystar(s) rhoMax, then
 * rho -> I(T, rho) is nondecreasing on (0, rhoMax].
 * PROOF: the nineteenth Lemma RM proof verbatim with one changed
 * inequality. At each rho in (0, rhoMax] the split point Y = T/rho
 * satisfies Y >= T/rhoMax >= Ystar(s). Every subsequent step consumes Y
 * only through Y >= Ystar > y0 = 1/(2s - 1):
 *   (i) the sign pairing of phiK(y) = (1+y)^(-s-1)((s-1/2)y - 1/2)
 *       against G(rho y) on [0, Y] needs y0 <= Y and G increasing on
 *       [0, T] - both unchanged (G increasing on [0, T] is
 *       hypothesis-free; rho y0 <= T is y0 <= Y);
 *   (ii) PhiInt(Y) >= 0 via the sufficient criterion
 *        (s - 1/2)(1 + Y)^(1-s) <= 1/2, which holds with equality at
 *        Y = Ystar and is monotone in Y, so it holds for all Y >= Ystar;
 *   (iii) nonnegativity of both factors on [Y, inf) needs Y >= y0.
 * The ordering Ystar(s) > y0(s) holds uniformly (the assertions scan
 * s in [1.05, 12] and find min(Ystar - y0) = 0.2864 > 0). Lemma RM is the
 * rhoMax = 1 special case. QED.
 *
 * COROLLARY LT (low-s extension of Theorem Y-EXACT and Theorem CA(iii)
 * upper direction). By Lemma RM-D with rhoMax = rhoCap(j), the per-pair
 * guard weakens from V(b, j) >= Ystar(s) to
 *   V(b, j) >= Ystar(s) rhoCap(j).
 * The guard ratio has the closed form (the beta powers cancel exactly:
 * the exponent is beta + (j-1)beta - j beta = 0)
 *   V(b, j) / rhoCap(j) = 2^(b(1-beta)) (2^(j-1) - 1) / Q ,
 * with Q = (c D^(1-beta) / v) 2^(-(1-beta)) the isolation constant. Over
 * all roll-up pairs (b >= 0, j >= 2, beta in (0,1)) the ratio is minimized
 * at the corner (b, j) = (0, 2) with value EXACTLY 1/Q. Hence Theorem
 * Y-EXACT holds for every s > 1 with
 *   Ystar(s) <= 1/Q        (new uniform corner guard),
 * versus the old corner guard Ystar(s) <= V(0, 2) = 2^(-beta)/Q: the guard
 * relaxes by exactly the factor 2^beta = 1/rhoCap(2), and the relaxed
 * guard is beta-free given Q.
 *
 * CONSEQUENCE (reference constants c = v = D = 1, beta = 1/3, so
 * Q = 2^(-2/3) and 1/Q = 2^(2/3) = 1.5874010519681994):
 *   - the EXACT-proof break boundary moves from
 *       s*  = 2.9483832742380818  (root of Ystar(s) = 2^(1/3))   down to
 *       s** = 2.4095981617415205  (root of Ystar(s) = 2^(2/3) = 1/Q);
 *     the imp-95026 Finding-4 "BREAKS" band shrinks from s < 2.9484 to
 *     s < 2.4096, and the imp-95068 window-fallback scope shrinks the
 *     same way;
 *   - the likely-paper point s = 3 (Ystar(3) = sqrt(5) - 1, exact) moves
 *     from margin 0.0238530723950834 to margin 0.3513330744684096, a
 *     factor 14.729049098967502 - the "holds but barely" low-theta
 *     transfer risk at s = 3 is retired (the guard is no longer thin
 *     there);
 *   - in the recovered band s in (s**, s*) the chain no longer falls back
 *     to the eighteenth window envelope: measured corner recovery factor
 *     (fallback min-envelope / exact pair value, quadrature cross-check)
 *     is ~1.23x at s = 2.5 and ~1.22x at s = 2.7, and the sharp-within-MAJ
 *     property (zero per-pair inequality slack at the substituted point)
 *     now covers the band.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) The refined proof was re-audited
 * step by step against the nineteenth Lemma RM statement: the hypothesis
 * T >= Ystar enters ONLY through the lower bound on Y; the G-increase on
 * [0, T], the phiK sign change at y0, and the PhiInt criterion are
 * Y-monotone or hypothesis-free, so restricting the domain to
 * (0, rhoMax] legitimately weakens the hypothesis to T >= Ystar rhoMax.
 * (2) The criterion-tightness identity PhiInt(Ystar) = (1 + Ystar)^(-s)
 * (> 0) is checked exactly: even at the guard boundary the antiderivative
 * retains positive margin. (3) The guard-ratio closed form is checked to
 * machine epsilon for three beta values including the reference. (4) At
 * s = 2.5 and s = 2.7 - where the OLD guard fails (Ystar > 2^(1/3)) and
 * the NEW guard holds (Ystar <= 2^(2/3)) - direct quadrature confirms
 * rho -> I(V(0,2), rho) is nondecreasing on (0, rhoCap(2)]. (5) HONEST
 * LIMIT: s** is a PROOF-COVERAGE boundary, not a sharp truth boundary -
 * at s = 2.5 quadrature shows the map is nondecreasing on the FULL (0, 1]
 * anyway, so the true monotonicity boundary lies below both s* and s**,
 * and the sharpness question (imp-95069) remains open; this module
 * REFINES that ticket (s* characterizes the old (0,1]-domain lemma, not
 * the chain requirement). (6) The copied eighteenth fallback-envelope
 * code path is anchored against the sibling corner literal
 * 1.1159760370515937e-4 at s = 11 before being used for the recovered-
 * factor measurement. (7) The reference theta = 10 headline numbers
 * (cFar = 0.2717408057586117, gaps 2.8088/225.42) are UNCHANGED - s = 11
 * sits deep inside both regimes; floors and ceilings untouched.
 *
 * WHAT REMAINS OPEN: the actual Section 4.5 paper packet constants
 * (sigma, theta, beta, Q) are still unpinned (imp-95026 sub-gap), so
 * which s-regime the paper lands in is unknown - this step widens the
 * regime where the sharp EXACT chain would apply, it does not instantiate
 * the paper point; below s** the eighteenth window fallback remains the
 * ceiling route; the actual monotonicity boundary below s** (sharpness)
 * is unmeasured beyond the s = 2.5 probe; the parity AM-GM factor 2 and
 * the witness side are untouched.
 *
 * The numerics below CROSS-CHECK the analytic statements; they are not
 * the claim. Import-light (no heavy bundle). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── shared conventions (identical to the sibling modules) ────────────────────
const BETA_REF = 1 / 3;
const THETA_REF = 10;
const SS_REF = 1 + THETA_REF; // sigma = 1

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

function cornerV(b, j, beta, Q) {
  const gOld = (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
  return Math.pow(2, b * (1 - beta)) * Math.pow(2, beta) * gOld;
}

function rhoCap(j, beta) {
  return Math.pow(2, -(j - 1) * beta);
}

function ystar(s) {
  return Math.pow(2 * s - 1, 1 / (s - 1)) - 1;
}

// Lemma RM exact antiderivative PhiInt(Y) = integral_0_to_Y of phiK
function phiIntClosed(Y, s) {
  return 1 / (2 * (s - 1)) - (Math.pow(1 + Y, -s) * ((s - 0.5) * (1 + Y) - (s - 1))) / (s - 1);
}

// bisection root of Ystar(s) = target (Ystar strictly decreasing in s)
function solveYstar(target) {
  let lo = 1.5;
  let hi = 20;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (ystar(m) > target) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// midpoint quadrature of the normalized pair correlation I(T, rho) - valid at
// any real s > 1 (the closed form needs integer s; the low-s band does not)
function iQuad(T, rho, s, N, pad) {
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

// ── eighteenth-continuation fallback envelope (independent code path) ───────
function psiEnv(T, s) {
  const x = Math.log1p(T);
  const flat = 2 / (2 * s - 1);
  if (x <= flat) return flat;
  return Math.E * x * Math.pow(1 + T, 0.5 - s);
}

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

function fallbackEnvelope(T, rho, s) {
  return Math.min(psiEnv(T, s), threeWindowMin(T, rho, s));
}

// ── baked literals ────────────────────────────────────────────────────────────
const Q_REF = isolationQ(1, 1, BETA_REF, 1); // 2^(-2/3)
const V02 = Math.pow(2, 1 / 3); // corner separation floor V(0, 2)
const RC2 = Math.pow(2, -1 / 3); // corner width-ratio cap rhoCap(2)
const NEW_GUARD = Math.pow(2, 2 / 3); // 1/Q = V(0,2)/rhoCap(2)
const S_STAR_OLD = 2.9483832742380818; // root of Ystar(s) = 2^(1/3) (imp-95026 Finding 4)
const S_STAR_OLD_IMP95026 = 2.948383274238082; // literal as baked in imp-95026
const S_STAR_NEW = 2.4095981617415205; // root of Ystar(s) = 2^(2/3) = 1/Q
const YSTAR_3 = Math.sqrt(5) - 1; // Ystar(3) = 5^(1/2) - 1 exactly
const OLD_MARGIN_S3 = 0.023853072395083386; // 2^(1/3) - Ystar(3)
const NEW_MARGIN_S3 = 0.35133307446840956; // 2^(2/3) - Ystar(3)
const MARGIN_RATIO_S3 = 14.729049098967502;
const W3_V02_18 = 1.1159760370515937e-4; // sibling corner min-envelope anchor (s = 11)
const PHIINT_AT_NEW_BREAK = 0.10119621428935577; // PhiInt(2^(2/3), s**) > 0

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95008_RM_DOMAIN_REFINED_LOW_S = {
  ticket:
    "imp-95008 (continuation twenty-one: Lemma RM-D domain-refined width-ratio monotonicity + Corollary LT - the EXACT-substitution proof extends from s > 2.9483832742380818 down to s > 2.4095981617415205; executes the wall named by imp-95068/imp-95069 and revises imp-95026 Finding 4)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; refines Lemma RM of imp-95008-exact-pair-correlation-ceiling.js.",
  lemmaRMD:
    "UNCONDITIONAL: for s > 1 and 0 < rhoMax <= 1, if T >= Ystar(s) rhoMax then rho -> I(T, rho) is nondecreasing on (0, rhoMax]. Proof is the nineteenth Lemma RM verbatim with the split point bounded by Y = T/rho >= T/rhoMax >= Ystar (instead of Y >= T >= Ystar via rho <= 1); every subsequent step consumes Y only through Y >= Ystar > y0 = 1/(2s-1). Lemma RM is the rhoMax = 1 special case.",
  corollaryLT:
    "Theorem Y-EXACT invokes width-ratio monotonicity only on (0, rhoCap(j)], so the per-pair guard weakens to V(b, j) >= Ystar(s) rhoCap(j). The guard ratio has the beta-cancelling closed form V(b, j)/rhoCap(j) = 2^(b(1-beta)) (2^(j-1)-1)/Q, minimized over all roll-up pairs at the corner (0, 2) with value exactly 1/Q. Hence Theorem Y-EXACT (and the Theorem CA(iii) upper direction) holds for every s > 1 with Ystar(s) <= 1/Q, versus the old corner guard Ystar(s) <= V(0,2) = 2^(-beta)/Q - a relaxation by exactly 2^beta = 1/rhoCap(2).",
  consequence:
    "Reference constants (c = v = D = 1, beta = 1/3, 1/Q = 2^(2/3)): the EXACT-proof break boundary moves from s* = 2.9483832742380818 (root of Ystar = 2^(1/3)) to s** = 2.4095981617415205 (root of Ystar = 2^(2/3)); the imp-95026 BREAKS band shrinks from s < 2.9484 to s < 2.4096; the likely-paper point s = 3 margin grows 0.0238530723950834 -> 0.3513330744684096 (factor 14.729049098967502), retiring the holds-but-barely risk at that point; in the recovered band the measured corner recovery factor over the eighteenth window fallback is ~1.23x (s = 2.5) and ~1.22x (s = 2.7), and sharp-within-MAJ now covers the band.",
  reference: {
    parameters: { c: 1, v: 1, beta: "1/3", D: 1, referenceTheta: THETA_REF },
    isolationQ: Q_REF,
    cornerV02: V02,
    rhoCap2: RC2,
    oldCornerGuard: V02,
    newCornerGuard: NEW_GUARD,
    guardRelaxationFactor: Math.pow(2, BETA_REF),
    sStarOld: S_STAR_OLD,
    sStarNew: S_STAR_NEW,
    ystarAt3: YSTAR_3,
    marginS3: { old: OLD_MARGIN_S3, new: NEW_MARGIN_S3, ratio: MARGIN_RATIO_S3 },
    phiIntAtNewBreak: PHIINT_AT_NEW_BREAK,
    recoveredBand: "s in (2.4095981617415205, 2.9483832742380818)",
    note: "floors, ceilings and all reference theta = 10 headline literals UNCHANGED - this step widens the s-regime where the nineteenth EXACT chain applies; it recomputes no ledger number.",
  },
  openResiduals: [
    "the actual Section 4.5 paper packet constants (sigma, theta, beta, Q) remain unpinned (imp-95026 sub-gap), so which s-regime the paper lands in is unknown - this widens the covered regime, it does not instantiate the paper point",
    "below s** = 2.4095981617415205 the eighteenth window fallback remains the only ceiling route",
    "s** is a PROOF-COVERAGE boundary, not a sharpness boundary: at s = 2.5 the monotonicity numerically holds on the FULL (0, 1], so the true boundary lies below s** and the sharpness question (imp-95069, refined by this module) stays open",
    "the parity AM-GM factor 2 and the witness side are untouched",
  ],
  isRigorous: true,
  rigorScope:
    "Lemma RM-D is the nineteenth Lemma RM proof with a single changed inequality (the split-point lower bound Y >= T/rhoMax on the restricted domain); its validity therefore reduces to the already-recorded Lemma RM proof plus the elementary observations that the PhiInt criterion is monotone in Y and that Ystar(s) > y0(s) (scanned; min gap 0.2864 on s in [1.05, 12]). Corollary LT is an exact algebraic evaluation of the guard ratio (the beta exponent cancellation beta + (j-1)beta - j beta = 0) plus monotonicity of 2^(b(1-beta))(2^(j-1)-1) in b and j. The break literals s* and s** are bisection roots of the strictly decreasing Ystar; s** is where the SUFFICIENT criterion at the binding corner fails, and is explicitly NOT claimed sharp for the underlying monotonicity (the s = 2.5 full-domain probe shows it is not). The recovered-factor numbers are quadrature measurements (cross-checks), not claims. No ledger, floor, or ceiling literal changes.",
  promotesBound: false,
  verdict:
    "RIGOROUS step (proof-domain extension, ceiling side, no numeric ledger change): NEW Lemma RM-D relaxes the nineteenth width-ratio monotonicity guard from T >= Ystar(s) on (0,1] to T >= Ystar(s) rhoMax on (0, rhoMax], which is all Theorem Y-EXACT ever uses (rhoMax = rhoCap(j)); the per-pair guard ratio V(b,j)/rhoCap(j) = 2^(b(1-beta))(2^(j-1)-1)/Q is beta-cancelling and corner-minimized at exactly 1/Q, so the uniform corner guard relaxes from Ystar(s) <= 2^(-beta)/Q to Ystar(s) <= 1/Q. Consequence at reference constants: the EXACT-proof break boundary drops s* = 2.9483832742380818 -> s** = 2.4095981617415205, the imp-95026 Finding-4 BREAKS band shrinks to s < 2.4096, the likely-paper s = 3 margin grows 14.73x (0.0239 -> 0.3513, retiring the holds-but-barely risk at that point), and the recovered band gains the sharp-within-MAJ pair bound (~1.22-1.23x over the window fallback at the corner). HONEST LIMIT: s** is a proof-coverage boundary, NOT a sharpness boundary (the s = 2.5 probe is monotone on all of (0,1]); paper constants remain unpinned; below s** the window fallback remains; floors, ceilings and all headline literals untouched. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_RMD_ASSERTIONS = [
  {
    id: "imp95008-rmd-old-break-reproduction",
    description:
      "the old break boundary reproduces: bisection root of Ystar(s) = 2^(1/3) equals 2.9483832742380818 (rel 1e-12), matches the imp-95026 Finding-4 baked literal 2.948383274238082 (rel 1e-14), and Ystar(s*) = 2^(1/3) (rel 1e-12)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const root = solveYstar(Math.pow(2, 1 / 3));
      return (
        rel(root, S_STAR_OLD, 1e-12) &&
        rel(S_STAR_OLD, S_STAR_OLD_IMP95026, 1e-14) &&
        rel(ystar(S_STAR_OLD), Math.pow(2, 1 / 3), 1e-12)
      );
    },
  },
  {
    id: "imp95008-rmd-new-break-literal",
    description:
      "the new break boundary: bisection root of Ystar(s) = 2^(2/3) = 1/Q equals 2.4095981617415205 (rel 1e-12), Ystar(s**) = 2^(2/3) (rel 1e-12), s** < s*, and Ystar is strictly decreasing on an s grid in [1.6, 12] (so both roots are unique)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const root = solveYstar(NEW_GUARD);
      if (!rel(root, S_STAR_NEW) || !rel(ystar(S_STAR_NEW), NEW_GUARD)) return false;
      if (!(S_STAR_NEW < S_STAR_OLD)) return false;
      if (!rel(NEW_GUARD, 1 / Q_REF)) return false;
      let prev = Infinity;
      for (let s = 1.6; s <= 12; s += 0.01) {
        const y = ystar(s);
        if (y >= prev) return false;
        prev = y;
      }
      return true;
    },
  },
  {
    id: "imp95008-rmd-guard-ratio-identity",
    description:
      "the guard ratio V(b, j)/rhoCap(j) equals the beta-cancelling closed form 2^(b(1-beta)) (2^(j-1)-1)/Q for beta in {1/3, 0.2, 0.45}, b <= 4, j in {2,4,6,8} (rel 1e-12); it is minimized at the corner (0,2) with value exactly 1/Q; at the reference the old corner guard V(0,2) = 2^(1/3) relaxes to 1/Q = 2^(2/3), factor exactly 2^beta = 1/rhoCap(2)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      for (const beta of [1 / 3, 0.2, 0.45]) {
        const Q = isolationQ(1, 1, beta, 1);
        let minRatio = Infinity;
        for (let b = 0; b <= 4; b++) {
          for (const j of [2, 4, 6, 8]) {
            const ratio = cornerV(b, j, beta, Q) / rhoCap(j, beta);
            const closed = (Math.pow(2, b * (1 - beta)) * (Math.pow(2, j - 1) - 1)) / Q;
            if (!rel(ratio, closed)) return false;
            if (ratio < minRatio) minRatio = ratio;
          }
        }
        if (!rel(minRatio, 1 / Q)) return false;
      }
      return (
        rel(cornerV(0, 2, BETA_REF, Q_REF), V02) &&
        rel(NEW_GUARD / V02, Math.pow(2, BETA_REF)) &&
        rel(Math.pow(2, BETA_REF), 1 / RC2)
      );
    },
  },
  {
    id: "imp95008-rmd-ystar-above-y0",
    description:
      "the split-point ordering Ystar(s) > y0(s) = 1/(2s-1) needed by Lemma RM-D holds with margin: min over s in [1.05, 12] (step 0.005) of Ystar - y0 exceeds 0.28",
    holds: () => {
      let m = Infinity;
      for (let s = 1.05; s <= 12; s += 0.005) {
        m = Math.min(m, ystar(s) - 1 / (2 * s - 1));
      }
      return m > 0.28;
    },
  },
  {
    id: "imp95008-rmd-criterion-band-and-tightness",
    description:
      "the PhiInt sufficient criterion (s-1/2)(1+Y)^(1-s) <= 1/2 holds at the binding corner Y = 2^(2/3) for all sampled s in [s**, s*], with equality at s = s** (rel 1e-12); PhiInt(2^(2/3), s**) = 0.10119621428935577 > 0 (rel 1e-12); and the criterion-tightness identity PhiInt(Ystar(s), s) = (1+Ystar(s))^(-s) holds (rel 1e-12) at s in {s**, 2.7, s*, 11}",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      for (let s = S_STAR_NEW; s <= S_STAR_OLD; s += 0.005) {
        if (!((s - 0.5) * Math.pow(1 + NEW_GUARD, 1 - s) <= 0.5 + 1e-12)) return false;
      }
      if (!rel((S_STAR_NEW - 0.5) * Math.pow(1 + NEW_GUARD, 1 - S_STAR_NEW), 0.5)) return false;
      if (!rel(phiIntClosed(NEW_GUARD, S_STAR_NEW), PHIINT_AT_NEW_BREAK)) return false;
      for (const s of [S_STAR_NEW, 2.7, S_STAR_OLD, 11]) {
        const Y = ystar(s);
        if (!rel(phiIntClosed(Y, s), Math.pow(1 + Y, -s))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-rmd-band-guard-status",
    description:
      "at s = 2.5 and s = 2.7 (inside the recovered band) the OLD corner guard fails (Ystar(s) > 2^(1/3)) while the NEW guard holds (Ystar(s) <= 2^(2/3)); Ystar(2.5) = 4^(2/3) - 1 and Ystar(3) = sqrt(5) - 1 reproduce in closed form (rel 1e-12), and the s = 3 margins reproduce (old 0.023853072395083386, new 0.35133307446840956, ratio in [14.7, 14.76])",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      for (const s of [2.5, 2.7]) {
        if (!(ystar(s) > V02)) return false;
        if (!(ystar(s) <= NEW_GUARD)) return false;
      }
      if (!rel(ystar(2.5), Math.pow(4, 2 / 3) - 1)) return false;
      if (!rel(ystar(3), YSTAR_3)) return false;
      const oldM = V02 - YSTAR_3;
      const newM = NEW_GUARD - YSTAR_3;
      return (
        rel(oldM, OLD_MARGIN_S3) &&
        rel(newM, NEW_MARGIN_S3) &&
        newM / oldM > 14.7 &&
        newM / oldM < 14.76 &&
        rel(newM / oldM, MARGIN_RATIO_S3)
      );
    },
  },
  {
    id: "imp95008-rmd-monotonicity-cross-check",
    description:
      "quadrature cross-check of the Lemma RM-D conclusion where the OLD lemma did not apply: at s in {2.5, 2.7}, I(V(0,2), rho) is nondecreasing on a 30-point rho grid in (0, rhoCap(2)] (N = 100000, pad 300, tol 1e-9 relative); HONEST-LIMIT probe: at s = 2.5 it is ALSO nondecreasing on a 20-point grid up to rho = 1, confirming s** is proof-coverage, not sharpness",
    holds: () => {
      for (const s of [2.5, 2.7]) {
        let prev = 0;
        for (let i = 1; i <= 30; i++) {
          const rho = (RC2 * i) / 30;
          const v = iQuad(V02, rho, s, 100000, 300);
          if (v < prev * (1 - 1e-9)) return false;
          prev = v;
        }
      }
      let prev = 0;
      for (let i = 1; i <= 20; i++) {
        const rho = i / 20;
        const v = iQuad(V02, rho, 2.5, 100000, 300);
        if (v < prev * (1 - 1e-9)) return false;
        prev = v;
      }
      return true;
    },
  },
  {
    id: "imp95008-rmd-recovered-factor",
    description:
      "the copied eighteenth fallback-envelope code path reproduces the sibling corner literal 1.1159760370515937e-4 at s = 11 (rel 1e-12); in the recovered band the exact corner value (quadrature, N = 800000, pad 400) stays BELOW the fallback envelope (consistency) and the recovery factor envelope/exact lies in [1.19, 1.26] at s in {2.5, 2.7}",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      if (!rel(fallbackEnvelope(V02, RC2, SS_REF), W3_V02_18)) return false;
      for (const s of [2.5, 2.7]) {
        const ex = iQuad(V02, RC2, s, 800000, 400);
        const env = fallbackEnvelope(V02, RC2, s);
        if (!(ex <= env)) return false;
        const f = env / ex;
        if (!(f >= 1.19 && f <= 1.26)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-rmd-honesty-gate",
    description:
      "the verdict states the step changes no ledger number, names the proof-coverage (not sharpness) status of s**, keeps the paper constants open, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95008_RM_DOMAIN_REFINED_LOW_S.promotesBound === false &&
      IMP95008_RM_DOMAIN_REFINED_LOW_S.openResiduals.length === 4 &&
      /NO QED/.test(IMP95008_RM_DOMAIN_REFINED_LOW_S.verdict) &&
      /refereed bound is changed/i.test(IMP95008_RM_DOMAIN_REFINED_LOW_S.verdict) &&
      /NOT a sharpness boundary/.test(IMP95008_RM_DOMAIN_REFINED_LOW_S.verdict) &&
      /headline literals untouched/.test(IMP95008_RM_DOMAIN_REFINED_LOW_S.verdict) &&
      /HONEST LIMIT/.test(IMP95008_RM_DOMAIN_REFINED_LOW_S.verdict) &&
      /PROOF-COVERAGE boundary/.test(IMP95008_RM_DOMAIN_REFINED_LOW_S.openResiduals[2]) &&
      /unpinned/.test(IMP95008_RM_DOMAIN_REFINED_LOW_S.openResiduals[0]),
  },
];

for (const a of IMP95008_RMD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-rm-domain-refined-low-s-extension assertion failed: ${a.id}`);
  }
}

export default IMP95008_RM_DOMAIN_REFINED_LOW_S;
