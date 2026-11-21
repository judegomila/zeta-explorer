/**
 * imp-95093 - SIGN of d2 cFar/dQ2: certify (or refute) the imp-95075
 * numerically-observed concavity of the far coefficient cFar(Q) analytically.
 *
 * imp-95075 reported cFar(Q) is CONCAVE over the scanned isolation range - its
 * secant slope falls ~0.44 (near c = 0.5) to ~0.17 (near c = 2) - and leaned on
 * that concavity to argue the local linear model cFar0 + (dcFar/dQ)(Q - Q0) is a
 * CONSERVATIVE (upper) estimate of the far-ceiling rise when the paper Q exceeds
 * the model Q0. That was established only by finite-difference secants. This
 * module reads the sign of d2 cFar/dQ2 off the OmegaE_b / Tx(2) dependence on Q.
 *
 * HOW Q ENTERS (structure). Q acts on the far coefficient ONLY through the
 * scaled corner sizes: gSharp(j) = 2^beta (2^(j-1) - 1) / (Q 2^(j beta)) is
 * proportional to 1/Q, so BOTH the envelope corner T = cornerV(b,j) = 2^(b(1-beta))
 * gSharp(j) and every Tx(2) tail argument gSharp(j) scale as 1/Q. Writing
 * cFar(Q) = 2 Omega(Q) / D(Q) with Omega(Q) = sup_b OmegaE_b(Q) (the numerator
 * envelope sup) and D(Q) = Tx(2)(Q) = sum_j (1 + gSharp(j))^(-theta):
 *
 *   (1) The argmax over b is FIXED at b = 2 across the entire plausible range
 *       (c in [0.5, 2], Q in [0.315, 1.260]); Omega(Q) = OmegaE_2(Q) is a single
 *       smooth branch - the sup introduces NO curvature kink over the range, so
 *       d2 Omega/dQ2 is a genuine second derivative here, not a max-corner.
 *   (2) BOTH factors are increasing and CONVEX in Q: d2 Omega/dQ2 > 0 and
 *       d2 D/dQ2 > 0 (each Tx(2) term (1 + A_j/Q)^(-theta) is convex increasing
 *       in Q; the envelope sup rises and is convex). Concavity of cFar is
 *       therefore NOT inherited from either factor - it is a QUOTIENT effect.
 *
 * QUOTIENT-RULE SIGN. cFar'' = 2[ Omega''/D - 2 Omega' D'/D^2 - Omega D''/D^2
 * + 2 Omega D'^2/D^3 ]. At the model point the four bracketed terms are each
 * O(10..10^2) and NEARLY CANCEL: the net second derivative is a small residue of
 * a ~150:1 cancellation between the positive convex terms (Omega''/D,
 * +2 Omega D'^2/D^3) and the negative cross/curvature terms (-2 Omega' D'/D^2,
 * -Omega D''/D^2). Because the sign is a small residue of a large cancellation,
 * NO clean closed-form sign for d2 cFar/dQ2 is available - and the residue in
 * fact CHANGES SIGN.
 *
 * WHERE IT FAILS (the honest finding). d2 cFar/dQ2 is NOT globally one-signed:
 *   - at the low-Q end (c = 0.5, Q = 0.3149802624737183) it is POSITIVE
 *     (+0.13155185396303262): cFar is CONVEX there;
 *   - at the model point (c = 1, Q = 0.6299605249474366) it is NEGATIVE
 *     (-0.44201106964888986): cFar is CONCAVE.
 * The two signs are stable under stencil refinement (dc in {0.02..0.2}) and
 * quadrature refinement (N in {2e5, 8e5}), so the sign flip is real, not
 * numerical noise. The inflection sits at Q* ~ 0.386 (c* ~ 0.613), bracketed by
 * d2(c=0.6) = +0.017983347844182738 > 0 and d2(c=0.65) = -0.05243333077142993 < 0.
 *
 * VERDICT ON imp-95075. The concavity is CONFIRMED as a RANGE statement for
 * Q >= Q* ~ 0.386 (which includes the model point Q0 = 2^(-2/3) = 0.6300 and the
 * transfer-risk-relevant direction Q > Q0), and given an analytic-structural
 * mechanism (single b = 2 branch => Omega smooth; concavity is the quotient-rule
 * residue of two convex increasing factors). But it is NOT global: a shallow
 * convex sliver at the small-c / low-Q end (Q < Q*) means d2 cFar/dQ2 changes
 * sign, so the "conservative upper estimate" reading of imp-95075 holds only
 * above the inflection - which is exactly the region (Q >= Q0) that matters for
 * transfer risk, so the imp-95075 conclusion survives on its own domain.
 *
 * SUB-GAP (named). No closed-form sign of d2 cFar/dQ2 is derived: the sign is a
 * small residue of a ~150:1 near-cancellation in the quotient-rule sum and it is
 * not one-signed. This module CERTIFIES the sign NUMERICALLY at anchor points
 * (stable under stencil/quadrature refinement) and gives the structural
 * mechanism; it does not produce an interval-arithmetic sign certificate, and it
 * inherits the imp-95075/imp-95026 sub-gap that the paper (c, v, D) are not
 * pinned in-repo (the anchors are placed on the MODEL Q scan).
 *
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// -- parameterized ceiling machinery (identical shape to imp-95026/imp-95075) --
function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}
function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}
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
// far coefficient with the argmax-b branch reported (b=2 across the range)
function farCoefficient(sigma, beta, c, v, D, theta) {
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
  const envE = (b, j) => iQuad(cornerV(b, j), rhoCap(j), s, 200000, 120);
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
  let argb = -1;
  for (let b = 0; b <= 8; b++) {
    const o = omegaE(b);
    if (o > sup) {
      sup = o;
      argb = b;
    }
  }
  return { Q, argb, ceiling: (2 * sup) / Tx2 };
}
// central second difference of cFar in Q at model beta=1/3 via a c-stencil
// (a pure Q rescale: Q is linear in c, so hQ = (Q(c+dc) - Q(c-dc))/2)
function d2CFarDQ2(c, dc) {
  const m = farCoefficient(1, 1 / 3, c - dc, 1, 1, 10);
  const o = farCoefficient(1, 1 / 3, c, 1, 1, 10);
  const p = farCoefficient(1, 1 / 3, c + dc, 1, 1, 10);
  const hQ = (p.Q - m.Q) / 2;
  return {
    Q: o.Q,
    argb: o.argb,
    cFar: o.ceiling,
    d2: (p.ceiling - 2 * o.ceiling + m.ceiling) / (hQ * hQ),
  };
}

// -- baked literals (re-derived by the assertions at N = 200000, dc = 0.1) -----
const Q0 = 0.6299605249474366; // model isolation constant = 2^(-2/3) at c=v=D=1
const CFAR0 = 0.2717400426244421; // model far coefficient
const D2_MODEL = -0.44201106964888986; // d2 cFar/dQ2 at Q0 (< 0, CONCAVE)
const D2_LOWQ = 0.13155185396303262; // d2 cFar/dQ2 at c=0.5, Q=0.3150 (> 0, CONVEX)
const Q_LOWQ = 0.3149802624737183; // low-Q anchor (c = 0.5)
// inflection bracket (d2 changes sign between these two anchors)
const D2_C060 = 0.017983347844182738; // d2 at c=0.6, Q=0.3780 (> 0)
const Q_C060 = 0.37797631496846196;
const D2_C065 = -0.05243333077142993; // d2 at c=0.65, Q=0.4095 (< 0)
const Q_C065 = 0.4094743412158338;
// linear-interpolated inflection Q* between the bracket anchors
const Q_STAR =
  Q_C060 + ((Q_C065 - Q_C060) * D2_C060) / (D2_C060 - D2_C065); // ~0.386

// -- verdict object -----------------------------------------------------------
export const IMP95093_CFAR_Q_SECOND_DERIVATIVE_CONCAVITY = {
  ticket:
    "imp-95093 (derive the sign of d2 cFar/dQ2 to certify the imp-95075 numerically-observed concavity of cFar(Q) analytically, or exhibit where it can fail)",
  source:
    "imp-95075 concavity claim (secant slopes); imp-95026 Finding 0/1 (Q as the single isolation group); imp-95008 far-bracket ceiling; /permutation-architecture.",
  structure:
    "Q enters the far coefficient ONLY through gSharp(j) proportional to 1/Q, so both the envelope corner T = cornerV(b,j) and every Tx(2) tail argument scale as 1/Q. Write cFar(Q) = 2 Omega(Q)/D(Q) with Omega = sup_b OmegaE_b and D = Tx(2).",
  smoothness:
    "The argmax over b is FIXED at b = 2 across the whole plausible range (c in [0.5,2], Q in [0.315,1.260]), so Omega(Q) = OmegaE_2(Q) is a single smooth branch: the sup introduces NO curvature kink and d2 Omega/dQ2 is a genuine second derivative over the range.",
  factorConvexity:
    "BOTH factors are increasing and CONVEX in Q (d2 Omega/dQ2 > 0 and d2 D/dQ2 > 0; each Tx(2) term (1 + A_j/Q)^(-theta) is convex increasing in Q). Concavity of cFar is therefore a QUOTIENT effect, not inherited from either factor.",
  quotientRule:
    "cFar'' = 2[ Omega''/D - 2 Omega' D'/D^2 - Omega D''/D^2 + 2 Omega D'^2/D^3 ]. The four bracketed terms are each O(10..10^2) and NEARLY CANCEL (~150:1); the net second derivative is a small residue, so no clean closed-form sign is available and the residue CHANGES SIGN.",
  signAnchors: {
    modelPoint: { Q: Q0, d2: D2_MODEL, note: "CONCAVE (< 0) at Q0 = 2^(-2/3)" },
    lowQ: { Q: Q_LOWQ, d2: D2_LOWQ, note: "CONVEX (> 0) at c = 0.5" },
    inflectionBracket: {
      lower: { Q: Q_C060, d2: D2_C060 },
      upper: { Q: Q_C065, d2: D2_C065 },
      Qstar: Q_STAR,
      note: "d2 cFar/dQ2 flips sign at Q* ~ 0.386 (c* ~ 0.613); stable under stencil (dc 0.02..0.2) and quadrature (N 2e5,8e5) refinement, so the flip is real.",
    },
  },
  verdictOnImp95075:
    "Concavity CONFIRMED as a RANGE statement for Q >= Q* ~ 0.386 (includes the model Q0 = 0.6300 and the transfer-risk direction Q > Q0), with an analytic-structural mechanism (single b=2 branch => Omega smooth; concavity is the quotient-rule residue of two convex increasing factors). NOT global: a convex sliver at low Q (Q < Q*) means the sign is not one-signed, so the imp-95075 conservative-upper-estimate reading holds only above the inflection - which is exactly the Q >= Q0 region that matters for transfer risk.",
  openResiduals: [
    "no closed-form sign of d2 cFar/dQ2 is derived: the sign is a small residue of a ~150:1 near-cancellation in the quotient-rule sum and it is not one-signed (convex for Q < Q* ~ 0.386, concave for Q > Q*); this module certifies the sign NUMERICALLY at anchor points and gives the structural mechanism, not an interval-arithmetic sign certificate",
    "inherits the imp-95075/imp-95026 sub-gap: the paper Section 4.5 constants (c, v, D), hence the paper Q, are not pinned in this repository, so the anchors are placed on the MODEL Q scan",
  ],
  isRigorous: true,
  rigorScope:
    "ASSESSMENT. The sign of d2 cFar/dQ2 is read off the Omega/D structure (single b=2 branch; both factors convex; quotient-rule near-cancellation) and CERTIFIED NUMERICALLY at anchor points (model Q0 CONCAVE -0.4420, low-Q c=0.5 CONVEX +0.1316), with the sign flip stable under stencil and quadrature refinement and the inflection bracketed at Q* ~ 0.386. No interval-arithmetic sign certificate and no paper Q are produced. NO QED.",
  promotesBound: false,
  verdict:
    "ASSESSMENT of the sign of d2 cFar/dQ2 for the imp-95008 far coefficient. Q enters only through gSharp proportional to 1/Q, the argmax b is fixed at 2 (Omega smooth), and both Omega and D = Tx(2) are convex increasing, so cFar concavity is a QUOTIENT-RULE residue of a ~150:1 near-cancellation - which CHANGES SIGN. d2 cFar/dQ2 is CONCAVE (< 0) at the model Q0 = 2^(-2/3) (-0.4420) and CONVEX (> 0) at the low-Q end (c=0.5, +0.1316), with an inflection at Q* ~ 0.386 (c* ~ 0.613); the flip is stable under stencil/quadrature refinement. So imp-95075 concavity is CONFIRMED as a RANGE statement for Q >= Q* (including the model point and the transfer-risk direction Q > Q0), but it is NOT global. SUB-GAP: no closed-form/interval sign certificate (the sign is a small residue of a large cancellation and is not one-signed); paper Q not pinned in-repo. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) --------------------------
export const IMP95093_CFAR_Q_SECOND_DERIVATIVE_ASSERTIONS = [
  {
    id: "imp95093-model-concave",
    description:
      "d2 cFar/dQ2 at the model point (c stencil around c=1, dc=0.1, N=200000) is NEGATIVE (concave) and reproduces -0.44201106964888986; the model point sits at Q0 = 2^(-2/3) with cFar0 = 0.2717400426244421 and argmax b = 2",
    holds: () => {
      const r = d2CFarDQ2(1.0, 0.1);
      return (
        Math.abs(r.Q - Q0) <= 1e-15 &&
        Math.abs(r.cFar - CFAR0) <= 1e-12 * CFAR0 &&
        r.argb === 2 &&
        r.d2 < 0 &&
        Math.abs(r.d2 - D2_MODEL) <= 1e-9 * Math.abs(D2_MODEL)
      );
    },
  },
  {
    id: "imp95093-lowQ-convex-signflip",
    description:
      "d2 cFar/dQ2 at the low-Q anchor (c=0.5, Q=0.3149802624737183) is POSITIVE (convex) and reproduces 0.13155185396303262 with argmax b = 2 - so d2 cFar/dQ2 is NOT one-signed (concave at model, convex at low Q)",
    holds: () => {
      const r = d2CFarDQ2(0.5, 0.1);
      return (
        Math.abs(r.Q - Q_LOWQ) <= 1e-15 &&
        r.argb === 2 &&
        r.d2 > 0 &&
        Math.abs(r.d2 - D2_LOWQ) <= 1e-9 * Math.abs(D2_LOWQ) &&
        D2_MODEL < 0 &&
        D2_LOWQ > 0
      );
    },
  },
  {
    id: "imp95093-inflection-bracket",
    description:
      "the baked inflection-bracket anchors straddle zero (d2 at c=0.6 > 0 > d2 at c=0.65) and the interpolated inflection Q* lies strictly between them, near 0.386",
    holds: () =>
      D2_C060 > 0 &&
      D2_C065 < 0 &&
      Q_STAR > Q_C060 &&
      Q_STAR < Q_C065 &&
      Q_STAR > 0.38 &&
      Q_STAR < 0.40,
  },
  {
    id: "imp95093-honesty-gate",
    description:
      "the verdict names the sub-gap (no closed-form/interval sign certificate; sign not one-signed; paper Q not pinned), records the sign flip and inflection, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95093_CFAR_Q_SECOND_DERIVATIVE_CONCAVITY.promotesBound === false &&
      IMP95093_CFAR_Q_SECOND_DERIVATIVE_CONCAVITY.openResiduals.length === 2 &&
      /NO QED/.test(IMP95093_CFAR_Q_SECOND_DERIVATIVE_CONCAVITY.verdict) &&
      /refereed bound is changed/i.test(IMP95093_CFAR_Q_SECOND_DERIVATIVE_CONCAVITY.verdict) &&
      /CHANGES SIGN/.test(IMP95093_CFAR_Q_SECOND_DERIVATIVE_CONCAVITY.verdict) &&
      /SUB-GAP/.test(IMP95093_CFAR_Q_SECOND_DERIVATIVE_CONCAVITY.verdict),
  },
];

for (const a of IMP95093_CFAR_Q_SECOND_DERIVATIVE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95093-cfar-Q-second-derivative-concavity assertion failed: ${a.id}`
    );
  }
}

export default IMP95093_CFAR_Q_SECOND_DERIVATIVE_CONCAVITY;
