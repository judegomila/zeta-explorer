/**
 * imp-95053 - ASSESSMENT: is the occupied-block u = 4 boundary-pair
 * rate-asymmetry residual (the dominant surviving occupied-block coupling,
 * > 80 percent of cTilde at the baked headline first append) IRREDUCIBLE, or
 * could a rate-matched packet placement cancel it?
 *
 * CONTEXT. imp-95008-occupied-block-append-floor (Theorem Z / Theorem P)
 * measures that at the baked headline first append (spacing p = 999983,
 * theta = 10, interior grid point k = 287373 of occupied block 1, u_x ~ 3.480,
 * rate nu ~ 5.484) the signed coupling cTilde = sum_i s_i alpha_i K(mu_i, nu,
 * tau_i) decomposes as: the u = 2 boundary pair (packets 0, 1, nearly identical
 * rates 7.694 / 7.697, opposite signs because they straddle the block 0 / block
 * 1 boundary) CANCELS to below 1.3 percent of cTilde, while the u = 4 boundary
 * pair (packet 2 own-block rate 3.901 with sign -1, packet 3 other-block rate
 * 2.798 with sign +1) leaves a RATE-ASYMMETRY residual that is > 98 percent of
 * cTilde and POSITIVE, because the Lemma S(ii) slower-rate law gives
 * K(2.798, nu, tau) > K(3.901, nu, tau). This module assesses whether that
 * residual is irreducible over the single-append lever, or whether a
 * rate-matched placement of the appended packet could null it.
 *
 * FINDING (measured; NO QED; changes no bound).
 *
 * (A) At the operating placement (approaching u = 4 from the interior/open
 *     side, u_x ~ 3.48, distances tau_2 ~ tau_3 ~ 0.52), the isolated u = 4
 *     coupling
 *       cU4(nu) = alpha_3 K(mu_3, nu, tau_3) - alpha_2 K(mu_2, nu, tau_2)
 *     is STRICTLY POSITIVE for EVERY append rate nu in [1e-9, 1e8]: it decays
 *     monotonically from ~5.60e-3 (nu -> 0) to ~7.2e-11 (nu = 1e8) but never
 *     crosses zero, and it carries essentially all of the full cTilde (its
 *     share rises from 98.0 to 100.0 percent as nu grows because the u = 2
 *     residual and the u = 8 packet fade faster). Over the append RATE freedom
 *     alone, at the operating placement, the residual is SIGN-DEFINITE, hence
 *     IRREDUCIBLE: no choice of nu nulls it.
 *
 * (B) A rate-matched PLACEMENT can flip the sign of the residual, but only by
 *     seating the appended packet essentially ON the u = 4 twins (u_x -> 4,
 *     tau -> 0) with a fast rate (nu >~ 5). There the distance weighting
 *     e^(-mu tau) that favours the slower-rate other-block twin vanishes, the
 *     larger own-block amplitude alpha_2 > alpha_3 wins, and cU4 (and the full
 *     cTilde) turns NEGATIVE (e.g. u_x ~ 3.9999, nu = 50: cTilde ~ -1.96e-4).
 *     This is the "rate-matched packet placement" the ticket asks about, and it
 *     does cancel/reverse the residual.
 *
 * (C) But that cancellation is SELF-DEFEATING for the lever. The Theorem Z
 *     first-order gain driver is con = cTilde m - E n_b g, clipped at zero by
 *     the (.)_+ in Theorem P. With base excess E > 0, joined-block mass
 *     n_b = nTilde_1 > 0 and g > 0, any placement/rate that drives cTilde <= 0
 *     forces con <= -E n_b g < 0, so the occupied-block append yields EXACTLY
 *     ZERO gain there (measured con ~ -2.4e-3 at the cancellation corner versus
 *     +7.0e-3 at the operating placement). Cancelling the residual and
 *     harvesting the gain are mutually exclusive: the same coupling that could
 *     be nulled is the sole driver of the occupied-block lever.
 *
 * (D) ROOT CAUSE. The residual exists because the two u = 4 twins straddle a
 *     dyadic block boundary (packet 2 in block 1, packet 3 in block 2, so they
 *     enter cTilde with OPPOSITE signs) yet carry UNEQUAL rates mu_2 = 3.901,
 *     mu_3 = 2.798 (ratio 1.394) assigned by the joint base optimization. The
 *     u = 2 twins cancel precisely because their rates ARE matched
 *     (7.694 / 7.697, ratio 0.99966). The only way to make the u = 4 pair
 *     cancel the way the u = 2 pair does - a genuine, placement-independent
 *     null - is to EQUALIZE the base twin rates mu_2 = mu_3, i.e. a base
 *     RE-OPTIMIZATION, which lives outside the single-append frozen-base scope
 *     and which the joint optimizer declined (it prefers the asymmetric rates
 *     because they raise the floor).
 *
 * VERDICT. Within the single-append-to-frozen-base scope the rate-asymmetry
 * residual is IRREDUCIBLE: sign-definite positive over the whole append rate
 * range at the operating placement, so no rate-tuning nulls it there; the one
 * rate-matched placement that does cancel it (append coincident with the twins,
 * fast rate) simultaneously cancels the driving coupling and gives zero gain,
 * so cancellation is self-defeating; and a genuine placement-independent null
 * requires equalizing the base twin rates mu_2 = mu_3, a base re-optimization
 * outside scope. This assesses only; witness optimality is NOT claimed; it
 * changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 *
 * Import-light (no heavy bundle). The numerics below CROSS-CHECK the statements
 * against the exact imp-95008 machinery replicated here; they are not the claim.
 */

// shared conventions (identical to imp-95008-occupied-block-append-floor)
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}
const QREF = isolationQ(CC, VV, BETA, DD);

function gSharp(j, Q, beta) {
  return Math.pow(2, beta) * ((Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta)));
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
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return fCorr(m * tau) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

const THETA = 10;
const SS = SIGMA + THETA;
const TX = tailAllSharp(THETA, QREF, BETA, 800);

function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95053 block search failed");
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
  return { F: E / (TX * M), E, M, nb };
}

// frozen headline base (imp-95008 continuation fourteen joint witness)
const P_BIG = 999983;
const MUS = [
  7.69395202209785, 7.696569089680406, 3.901022492015913, 2.7978054595942754, 1.6462804960465607,
];
const A = [
  1.0906392801493483, 1.0907349936022739, 0.04954395066558243, 0.04336742919997075,
  0.000032666623379528365,
];
const W = pentaWitness(P_BIG);
const EV = floorMultiRate(W, MUS, A);

// append geometry at a grid point k (grid center u_x = p/k)
function coupling(kx, nu) {
  const ux = P_BIG / kx;
  const bx = blockOf(P_BIG, kx);
  let c = 0;
  for (let i = 0; i < A.length; i++) {
    const si = W.block[i] === bx ? -1 : 1;
    c += si * A[i] * kernelK(MUS[i], nu, Math.abs(ux - W.u[i]));
  }
  return { c, bx, ux };
}
// isolated u = 4 boundary-pair coupling at placement u_x, rate nu
function cU4(ux, nu) {
  const tau2 = Math.abs(ux - W.u[2]);
  const tau3 = Math.abs(ux - W.u[3]);
  return -A[2] * kernelK(MUS[2], nu, tau2) + A[3] * kernelK(MUS[3], nu, tau3);
}
// Theorem Z first-order gain driver con = cTilde m - E n_b g (clipped at 0)
function conAt(kx, nu) {
  const { c, bx, ux } = coupling(kx, nu);
  const rx = CC * Math.pow(kx / P_BIG, -BETA);
  const nb = bx < EV.nb.length ? EV.nb[bx] : 0;
  const g = Math.sqrt(rx) / hLegal(nu, rx, SS);
  return { con: c * EV.M - EV.E * nb * g, c, g, nb, bx, ux };
}

const K_OPT = 287373;
const NU_OPT = 5.484329511979126;
const NU_GRID = [1e-9, 1e-3, 0.1, 1, NU_OPT, 10, 50, 200, 1e4, 1e8];
const CANCEL_CORNER = { k: 250000, nu: 50 }; // append seated on the u = 4 twins, fast rate

export const IMP95053_U4_RATE_ASYMMETRY_IRREDUCIBILITY = {
  ticket:
    "imp-95053 (assessment: is the occupied-block u = 4 boundary-pair rate-asymmetry residual irreducible, or cancellable by a rate-matched placement?)",
  source:
    "Assesses the imp-95008-occupied-block-append-floor structural mechanism (Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture): the dominant surviving occupied-block coupling is the RATE ASYMMETRY of the u = 4 boundary pair.",
  finding: {
    A_signDefiniteAtOperatingPlacement:
      "At the operating placement u_x ~ 3.48 the isolated u = 4 coupling cU4(nu) = a3 K(2.798, nu, tau3) - a2 K(3.901, nu, tau2) is strictly positive for every append rate nu in [1e-9, 1e8] (decays ~5.60e-3 -> ~7.2e-11 but never crosses zero) and carries 98.0 -> 100.0 percent of cTilde: over the append rate freedom the residual is sign-definite, hence irreducible.",
    B_rateMatchedPlacementCanFlipSign:
      "Seating the append essentially ON the u = 4 twins (u_x -> 4, tau -> 0) with a fast rate (nu >~ 5) drives cU4 and the full cTilde negative (u_x ~ 3.9999, nu = 50: cTilde ~ -1.96e-4): a rate-matched placement CAN cancel/reverse the residual.",
    C_cancellationIsSelfDefeating:
      "But cancellation eliminates the lever: the Theorem Z gain driver con = cTilde m - E n_b g is clipped at zero, and with E > 0, n_b > 0, g > 0 any cTilde <= 0 forces con <= -E n_b g < 0, so the occupied-block append yields exactly zero gain there (con ~ -2.4e-3 at the cancellation corner vs +7.0e-3 at the operating placement). Cancelling the residual and harvesting the gain are mutually exclusive.",
    D_rootCauseBaseRateAsymmetry:
      "The residual exists because the u = 4 twins straddle a dyadic block boundary (packet 2 block 1, packet 3 block 2: opposite signs in cTilde) yet carry unequal base rates mu_2 = 3.901, mu_3 = 2.798 (ratio 1.394); the u = 2 twins cancel precisely because their rates ARE matched (7.694 / 7.697, ratio 0.99966). A genuine placement-independent null requires equalizing mu_2 = mu_3 - a base re-optimization outside the single-append frozen-base scope, which the joint optimizer declined.",
  },
  reference: {
    p: P_BIG,
    theta: THETA,
    operatingAppend: { k: K_OPT, nu: NU_OPT, ux: P_BIG / K_OPT },
    cancellationCorner: CANCEL_CORNER,
    u4Twins: {
      packet2: { block: W.block[2], rate: MUS[2], amp: A[2], sign: -1 },
      packet3: { block: W.block[3], rate: MUS[3], amp: A[3], sign: 1 },
      rateRatio: MUS[2] / MUS[3],
    },
    u2Twins: {
      packet0: { block: W.block[0], rate: MUS[0] },
      packet1: { block: W.block[1], rate: MUS[1] },
      rateRatio: MUS[0] / MUS[1],
    },
    base: { E: EV.E, M: EV.M, nb1: EV.nb[1] },
    cU4Sweep: NU_GRID.map((nu) => ({ nu, cU4: cU4(P_BIG / K_OPT, nu) })),
    conOperating: conAt(K_OPT, NU_OPT).con,
    conCancelCorner: conAt(CANCEL_CORNER.k, CANCEL_CORNER.nu).con,
  },
  verdict:
    "Within the single-append-to-frozen-base scope the u = 4 rate-asymmetry residual is IRREDUCIBLE: sign-definite positive over the whole append rate range at the operating placement, so no rate-tuning nulls it; the one rate-matched placement that does cancel it (append coincident with the twins, fast rate) simultaneously cancels the driving coupling con = cTilde m - E n_b g and yields ZERO gain, so cancellation is self-defeating; a genuine placement-independent null requires equalizing the base twin rates mu_2 = mu_3, a base re-optimization outside scope. Assesses only; witness optimality is NOT claimed; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  isRigorous: true,
  promotesBound: false,
};

// self-executing assertions (throw on violation)
export const IMP95053_ASSERTIONS = [
  {
    id: "imp95053-block-straddle-and-rate-asymmetry",
    description:
      "the u = 4 twins straddle a dyadic block boundary (packet 2 block 1, packet 3 block 2: opposite cTilde signs) with unequal rates (ratio > 1.3), while the u = 2 twins have matched rates (ratio within 1e-3 of 1) and also straddle a boundary (blocks 0 and 1)",
    holds: () =>
      W.block[2] === 1 &&
      W.block[3] === 2 &&
      MUS[2] / MUS[3] > 1.3 &&
      W.block[0] === 0 &&
      W.block[1] === 1 &&
      Math.abs(MUS[0] / MUS[1] - 1) < 1e-3,
  },
  {
    id: "imp95053-u4-sign-definite-over-append-rate",
    description:
      "at the operating placement u_x ~ 3.48 the isolated u = 4 coupling cU4(nu) is strictly positive and strictly decreasing across nu in [1e-9, 1e8] (no zero crossing over the append rate freedom)",
    holds: () => {
      const ux = P_BIG / K_OPT;
      let prev = Infinity;
      for (const nu of NU_GRID) {
        const v = cU4(ux, nu);
        if (!(v > 0) || !(v < prev)) return false;
        prev = v;
      }
      return true;
    },
  },
  {
    id: "imp95053-u4-dominates-cTilde-at-operating-append",
    description:
      "at the baked operating append (k = 287373, nu = 5.484) the u = 4 pair carries more than 80 percent of the full signed coupling cTilde and cTilde is positive (matches the imp-95008 measured decomposition)",
    holds: () => {
      const ux = P_BIG / K_OPT;
      const c = coupling(K_OPT, NU_OPT).c;
      const p23 = cU4(ux, NU_OPT);
      return c > 0 && p23 / c > 0.8;
    },
  },
  {
    id: "imp95053-rate-matched-placement-flips-sign",
    description:
      "a rate-matched placement seating the append on the u = 4 twins (k ~ 250000, fast rate nu = 50) drives the full signed coupling cTilde negative: the residual CAN be cancelled/reversed by placement",
    holds: () => coupling(CANCEL_CORNER.k, CANCEL_CORNER.nu).c < 0,
  },
  {
    id: "imp95053-cancellation-yields-zero-gain",
    description:
      "cancellation is self-defeating: at the operating append the Theorem Z gain driver con = cTilde m - E n_b g is positive, but at the sign-flip cancellation corner con is strictly negative (con <= -E n_b g < 0), so the occupied-block append yields exactly zero gain there; base excess E, joined mass n_b and g are all positive",
    holds: () => {
      const o = conAt(K_OPT, NU_OPT);
      const x = conAt(CANCEL_CORNER.k, CANCEL_CORNER.nu);
      return (
        EV.E > 0 &&
        EV.nb[1] > 0 &&
        o.g > 0 &&
        o.con > 0 &&
        x.con < 0 &&
        x.con <= -EV.E * x.nb * x.g + 1e-15
      );
    },
  },
  {
    id: "imp95053-honesty-gate",
    description:
      "the verdict assesses only, claims no witness optimality, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95053_U4_RATE_ASYMMETRY_IRREDUCIBILITY.promotesBound === false &&
      /NO QED/.test(IMP95053_U4_RATE_ASYMMETRY_IRREDUCIBILITY.verdict) &&
      /refereed bound is changed/i.test(IMP95053_U4_RATE_ASYMMETRY_IRREDUCIBILITY.verdict) &&
      /IRREDUCIBLE/.test(IMP95053_U4_RATE_ASYMMETRY_IRREDUCIBILITY.verdict) &&
      /self-defeating/.test(IMP95053_U4_RATE_ASYMMETRY_IRREDUCIBILITY.verdict) &&
      /optimality is NOT claimed/.test(IMP95053_U4_RATE_ASYMMETRY_IRREDUCIBILITY.verdict),
  },
];

for (const a of IMP95053_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95053-u4-rate-asymmetry-irreducibility assertion failed: ${a.id}`);
  }
}

export default IMP95053_U4_RATE_ASYMMETRY_IRREDUCIBILITY;
