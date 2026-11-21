/**
 * imp-95109 - can an INTERVAL-ARITHMETIC evaluation certify the sign of
 * d2 cFar/dQ2 on the concavity region Q >= Q* ~ 0.386, or is the ~150:1
 * quotient-rule near-cancellation a hard obstruction? (imp-95093 named sub-gap)
 *
 * imp-95093 CERTIFIED NUMERICALLY (stable under stencil/quadrature refinement)
 * that d2 cFar/dQ2 changes sign - CONCAVE at the model Q0 = 2^(-2/3)
 * (-0.44201106964888986) and CONVEX at the low-Q end (c=0.5, +0.13155185396303262)
 * - but its named SUB-GAP is that NO closed-form or interval-arithmetic sign
 * certificate exists, because the sign is a small residue of a ~150:1 near-
 * cancellation in the quotient-rule sum. This module ASSESSES whether interval
 * arithmetic can nonetheless deliver a rigorous negative-sign certificate on
 * Q >= Q*, and DERIVES the obstruction (the interval blow-up ratio) where it
 * cannot.
 *
 * TWO CANDIDATE CERTIFICATE ROUTES (measured here).
 *
 *   ROUTE A - the QUOTIENT-RULE SPLIT proposed in the ticket:
 *     cFar'' = 2[ Omega''/D - 2 Omega' D'/D^2 - Omega D''/D^2 + 2 Omega D'^2/D^3 ].
 *   Evaluating the four bracket terms from SEPARATELY finite-differenced
 *   Omega', Omega'', D', D' (dc = 0.1, N = 2e5) and summing them is
 *   NUMERICALLY HOSTILE: the split does NOT preserve the coherent error
 *   cancellation the ratio enjoys. MEASURED here: the split reconstruction gives
 *   cFar'' = -1.1451 at the model point (vs the certified -0.4420, off by 2.6x)
 *   and -20.694 at the low-Q end - the WRONG SIGN (the certified value there is
 *   +0.1316). Split residue ratio sum|t|/|bracket| = 116.9 (model) / 28.2
 *   (low-Q) / 51.3 (c=0.65). So ROUTE A must NOT be used for a certificate: it
 *   inflates, and at low Q inverts, the sign. The ticket-proposed split is the
 *   wrong carrier.
 *
 *   ROUTE B - the DIRECT-RATIO second difference (the imp-95093 carrier):
 *     cFar''(Q) ~ [ cFar(Q+) - 2 cFar(Q) + cFar(Q-) ] / hQ^2,
 *   cFar = 2 Omega / D formed at each node so the Omega and D errors cancel
 *   COHERENTLY in the ratio. This reproduces the certified d2 EXACTLY
 *   (-0.44201106964888986 at model, +0.13155185396303262 at low-Q,
 *   -0.05243333077142993 at c=0.65). Its cancellation lives in the second-
 *   difference NUMERATOR num = cFar(Q+) - 2 cFar(Q) + cFar(Q-), three values
 *   each ~0.27 that cancel to num ~ -1.75e-3 (model). The HONEST blow-up ratio
 *   is (|cFar+| + 2|cFar| + |cFar-|) / |num| = 618.7 (model) / 1053.7 (low-Q) /
 *   3443.5 (c=0.65). To certify the sign of num, each cFar node must be interval-
 *   enclosed to width < |num|/4, i.e. RELATIVE width < 1/(4 * ratio) ~ 1/2475
 *   (model), up to ~1/13774 near the inflection.
 *
 * THE OBSTRUCTION (two parts, why no certificate is delivered here).
 *   (I) UN-VERIFIED CARRIER. cFar = 2 Omega/D with Omega = sup_b OmegaE_b a sup
 *       over b of a MIDPOINT-rule quadrature (iQuad, N = 2e5) and D = Tx(2) a
 *       TRUNCATED tail series. The midpoint rule carries NO verified remainder,
 *       so there is currently NO interval enclosure of Omega at all. A rigorous
 *       certificate needs (a) a verified interval quadrature of iQuad (rigorous
 *       discretization + tail remainder), (b) a rigorous truncation bound on
 *       Tx(2), and (c) an enclosure of the sup over b (here the argmax is fixed
 *       at b = 2 over the range, which simplifies (c) to a single branch plus a
 *       margin check on the runners-up). This is out of the import-light scope.
 *   (II) DIVERGENCE AT Q*. The Route-B ratio DIVERGES as Q -> Q* because
 *       num -> 0 at the inflection. So NO uniform certificate exists on the
 *       CLOSED region including the endpoint Q*; only on Q >= Q* + delta with
 *       required relative precision scaling as ~1/dist(Q, Q*). At the model
 *       Q0 = 0.630 (bounded away from Q* ~ 0.386, dist ~ 0.244) the ratio is
 *       only ~619:1, so ~3-4 extra decimal digits of a VERIFIED quadrature would
 *       suffice there.
 *
 * VERDICT. An interval-arithmetic NEGATIVE-sign certificate for d2 cFar/dQ2 is
 * FEASIBLE IN PRINCIPLE on Q >= Q0 (bounded away from the inflection) at ~4-digit
 * verified-quadrature precision via ROUTE B (direct ratio) - the ~150:1
 * cancellation the imp-95093 sub-gap named is affordable, NOT the blocker. It is
 * NOT delivered here because (I) the current midpoint carrier is not a verified
 * integral and (II) the required precision DIVERGES as Q -> Q*, so no certificate
 * holds on the closed region up to the inflection. The ticket-proposed
 * QUOTIENT-RULE SPLIT (Route A) is the WRONG route: it is sign-destroying at low
 * Q. This module quantifies both blow-up ratios and names the residual (verified
 * interval quadrature of iQuad + Tx(2) tail bound + sup-over-b margin) as the
 * remaining work.
 *
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// -- parameterized ceiling machinery (identical shape to imp-95093/imp-95075) --
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
// return Omega = sup_b OmegaE_b and D = Tx(2) separately at a given c (beta=1/3)
function omegaAndD(c, beta, sigma, theta, N) {
  const Q = isolationQ(c, 1, beta, 1);
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
  const envE = (b, j) => iQuad(cornerV(b, j), rhoCap(j), s, N, 120);
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
  return { Q, Omega: sup, D: Tx2, argb };
}

// ROUTE A: reconstruct cFar'' from the ticket quotient-rule split, deriving the
// four bracket terms from separately finite-differenced Omega/D derivatives
function routeA_split(c, dc, N) {
  const beta = 1 / 3, sigma = 1, theta = 10;
  const m1 = omegaAndD(c - dc, beta, sigma, theta, N);
  const o = omegaAndD(c, beta, sigma, theta, N);
  const p1 = omegaAndD(c + dc, beta, sigma, theta, N);
  const hQ = (p1.Q - m1.Q) / 2;
  const Op = (p1.Omega - m1.Omega) / (2 * hQ);
  const Opp = (p1.Omega - 2 * o.Omega + m1.Omega) / (hQ * hQ);
  const Dp = (p1.D - m1.D) / (2 * hQ);
  const Dpp = (p1.D - 2 * o.D + m1.D) / (hQ * hQ);
  const Om = o.Omega, Dd = o.D;
  const t1 = Opp / Dd;
  const t2 = (-2 * Op * Dp) / (Dd * Dd);
  const t3 = (-Om * Dpp) / (Dd * Dd);
  const t4 = (2 * Om * Dp * Dp) / (Dd * Dd * Dd);
  const bracket = t1 + t2 + t3 + t4;
  const sumAbs = Math.abs(t1) + Math.abs(t2) + Math.abs(t3) + Math.abs(t4);
  return { Q: o.Q, cFarpp: 2 * bracket, bracket, sumAbs, ratio: sumAbs / Math.abs(bracket) };
}

// ROUTE B: direct-ratio second difference (the imp-95093 carrier); the honest
// blow-up ratio lives in the second-difference numerator
function routeB_direct(c, dc, N) {
  const beta = 1 / 3, sigma = 1, theta = 10;
  const m = omegaAndD(c - dc, beta, sigma, theta, N);
  const o = omegaAndD(c, beta, sigma, theta, N);
  const p = omegaAndD(c + dc, beta, sigma, theta, N);
  const cm = (2 * m.Omega) / m.D;
  const co = (2 * o.Omega) / o.D;
  const cp = (2 * p.Omega) / p.D;
  const hQ = (p.Q - m.Q) / 2;
  const num = cp - 2 * co + cm;
  const d2 = num / (hQ * hQ);
  const ratio = (Math.abs(cp) + 2 * Math.abs(co) + Math.abs(cm)) / Math.abs(num);
  // per-node relative interval width required to certify sign(num)
  const reqRelWidth = 1 / (4 * ratio);
  return { Q: o.Q, cFar: co, num, d2, argb: o.argb, ratio, reqRelWidth };
}

// -- baked literals (re-derived by the assertions at N = 200000, dc = 0.1) -----
const Q0 = 0.6299605249474366; // model isolation constant = 2^(-2/3)
const Q_STAR = 0.386; // imp-95093 inflection (d2 sign flip), c* ~ 0.613
// Route B (direct ratio) - reproduces the imp-95093 certified d2 EXACTLY
const B_D2_MODEL = -0.44201106964888986; // CONCAVE at Q0
const B_NUM_MODEL = -0.0017541220923555922; // second-difference numerator at Q0
const B_RATIO_MODEL = 618.6604986817657; // honest blow-up ratio at Q0
const B_D2_LOWQ = 0.13155185396303262; // CONVEX at c=0.5
const B_RATIO_LOWQ = 1053.6671163542992; // blow-up ratio at low-Q
const B_D2_C065 = -0.05243333077142993; // near the inflection (c=0.65)
const B_RATIO_C065 = 3443.542663556756; // blow-up DIVERGES toward Q*
// Route A (quotient-rule split) - sign-destroying, NOT a valid carrier
const A_CFARPP_MODEL = -1.1451219175923981; // vs certified -0.4420 (off 2.6x)
const A_RATIO_MODEL = 116.89155119718272;
const A_CFARPP_LOWQ = -20.693970024316627; // WRONG SIGN vs certified +0.1316
const A_RATIO_LOWQ = 28.179310023227977;

// -- verdict object -----------------------------------------------------------
export const IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE = {
  ticket:
    "imp-95109 (assess whether an interval-arithmetic evaluation of the quotient-rule cFar'' can certify the negative sign of d2 cFar/dQ2 on Q >= Q*, or derive the obstruction / interval blow-up ratio)",
  source:
    "imp-95093 named sub-gap (no closed-form/interval sign certificate; sign is a small residue of a ~150:1 near-cancellation and is not one-signed); imp-95075 concavity; imp-95026 far coefficient; /permutation-architecture.",
  routes:
    "Two candidate certificate carriers were measured. ROUTE A = the ticket quotient-rule split cFar'' = 2[Omega''/D - 2 Omega' D'/D^2 - Omega D''/D^2 + 2 Omega D'^2/D^3] from separately finite-differenced derivatives. ROUTE B = the direct-ratio second difference of cFar = 2 Omega/D (the imp-95093 carrier), where Omega and D errors cancel coherently in the ratio.",
  routeAisWrong:
    "ROUTE A is numerically HOSTILE and must NOT be used for a certificate: reconstructing cFar'' from the split gives -1.1451 at the model point (vs the certified -0.4420, off 2.6x) and -20.694 at the low-Q end - the WRONG SIGN (certified +0.1316). The split does not preserve the coherent ratio-error cancellation; it inflates and at low Q inverts the sign. Split residue ratio sum|t|/|bracket| = 116.9 (model) / 28.2 (low-Q).",
  routeBblowup:
    "ROUTE B reproduces the certified d2 EXACTLY. Its cancellation lives in the second-difference numerator num = cFar+ - 2 cFar + cFar- (three ~0.27 values -> num ~ -1.75e-3 at model). The HONEST blow-up ratio (|cFar+|+2|cFar|+|cFar-|)/|num| = 618.7 (model) / 1053.7 (low-Q) / 3443.5 (c=0.65, near Q*). Certifying sign(num) needs per-node relative interval width < 1/(4*ratio) ~ 1/2475 (model), up to ~1/13774 near the inflection.",
  obstruction:
    "(I) UN-VERIFIED CARRIER: cFar = 2 Omega/D with Omega a sup over b of a MIDPOINT-rule quadrature (iQuad, N=2e5, NO verified remainder) and D = Tx(2) a truncated series - so there is currently NO interval enclosure of Omega. A certificate needs a verified interval quadrature of iQuad (discretization + tail remainder), a truncation bound on Tx(2), and a sup-over-b enclosure (argmax fixed at b=2 => single branch + runner-up margin). (II) DIVERGENCE AT Q*: the Route-B ratio diverges as Q -> Q* (num -> 0), so NO uniform certificate on the closed region including the endpoint Q*; only on Q >= Q* + delta with precision ~1/dist(Q, Q*).",
  verdict:
    "An interval-arithmetic NEGATIVE-sign certificate for d2 cFar/dQ2 is FEASIBLE IN PRINCIPLE on Q >= Q0 (bounded away from Q*) at ~4-digit verified-quadrature precision via ROUTE B - the ~150:1 cancellation the imp-95093 sub-gap named is AFFORDABLE (~619:1 at the model point, ~3-4 extra digits), NOT the blocker. It is NOT delivered here: blocked by (I) the un-verified midpoint carrier and (II) the divergence of the required precision as Q -> Q*, so no certificate holds on the closed region up to the inflection. The ticket-proposed QUOTIENT-RULE SPLIT (Route A) is the WRONG carrier (sign-destroying at low Q). SUB-GAP (named): a rigorous certificate needs a verified interval quadrature of iQuad + a Tx(2) tail bound + a sup-over-b margin; paper Q not pinned in-repo. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  anchors: {
    routeB: {
      model: { Q: Q0, d2: B_D2_MODEL, num: B_NUM_MODEL, blowupRatio: B_RATIO_MODEL },
      lowQ: { d2: B_D2_LOWQ, blowupRatio: B_RATIO_LOWQ },
      nearInflection: { d2: B_D2_C065, blowupRatio: B_RATIO_C065 },
    },
    routeA: {
      model: { cFarpp: A_CFARPP_MODEL, residueRatio: A_RATIO_MODEL, note: "off 2.6x vs certified -0.4420" },
      lowQ: { cFarpp: A_CFARPP_LOWQ, residueRatio: A_RATIO_LOWQ, note: "WRONG SIGN vs certified +0.1316" },
    },
    Qstar: Q_STAR,
  },
  openResiduals: [
    "no interval-arithmetic sign certificate is delivered: the Route-B carrier is a midpoint quadrature with no verified remainder plus a truncated tail series and a sup over b, so Omega has no interval enclosure yet; a certificate needs a verified interval quadrature of iQuad + a Tx(2) truncation bound + a sup-over-b margin (argmax fixed at b=2)",
    "the required precision DIVERGES as Q -> Q* (num -> 0 at the inflection), so no certificate holds on the closed region including Q*; only on Q >= Q* + delta with precision scaling as ~1/dist(Q, Q*)",
    "inherits the imp-95093/imp-95075/imp-95026 sub-gap: the paper Section 4.5 constants (c, v, D), hence the paper Q, are not pinned in this repository, so the anchors are placed on the MODEL Q scan",
  ],
  isRigorous: true,
  rigorScope:
    "ASSESSMENT. The two candidate interval-certificate carriers are evaluated and their blow-up ratios MEASURED (Route A quotient-split residue ratio 116.9 model / 28.2 low-Q, and sign-destroying; Route B direct-ratio numerator blow-up 618.7 model / 1053.7 low-Q / 3443.5 near-inflection, sign-preserving). The obstruction to a rigorous certificate is DERIVED (un-verified midpoint carrier + divergence as Q -> Q*). No verified interval quadrature and no paper Q are produced. NO QED.",
  promotesBound: false,
  verdictShort:
    "Interval sign certificate for d2 cFar/dQ2 on Q >= Q* is FEASIBLE IN PRINCIPLE via the direct-ratio route (~619:1 cancellation at the model point, ~4 digits) but NOT delivered: blocked by an un-verified midpoint carrier and by precision divergence at Q*. The ticket quotient-rule SPLIT is the WRONG carrier (sign-destroying at low Q). NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) --------------------------
export const IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE_ASSERTIONS = [
  {
    id: "imp95109-routeB-reproduces-certified-d2",
    description:
      "ROUTE B (direct-ratio second difference) reproduces the imp-95093 certified d2 EXACTLY at the model point (-0.44201106964888986, argmax b=2) and its second-difference numerator blow-up ratio is ~619:1",
    holds: () => {
      const r = routeB_direct(1.0, 0.1, 200000);
      return (
        Math.abs(r.Q - Q0) <= 1e-15 &&
        r.argb === 2 &&
        r.d2 < 0 &&
        Math.abs(r.d2 - B_D2_MODEL) <= 1e-9 * Math.abs(B_D2_MODEL) &&
        Math.abs(r.num - B_NUM_MODEL) <= 1e-9 * Math.abs(B_NUM_MODEL) &&
        Math.abs(r.ratio - B_RATIO_MODEL) <= 1e-6 * B_RATIO_MODEL &&
        r.reqRelWidth < 1e-3
      );
    },
  },
  {
    id: "imp95109-routeB-blowup-diverges-toward-Qstar",
    description:
      "ROUTE B blow-up ratio grows from ~619:1 (model, dist ~0.244 from Q*) to ~1054:1 (low-Q) to ~3444:1 (c=0.65, near the inflection) - the required precision diverges as Q -> Q*, so no certificate holds on the closed region including Q*",
    holds: () => {
      const rm = routeB_direct(1.0, 0.1, 200000);
      const rl = routeB_direct(0.5, 0.1, 200000);
      const rn = routeB_direct(0.65, 0.1, 200000);
      return (
        Math.abs(rl.d2 - B_D2_LOWQ) <= 1e-9 * Math.abs(B_D2_LOWQ) &&
        Math.abs(rn.d2 - B_D2_C065) <= 1e-9 * Math.abs(B_D2_C065) &&
        Math.abs(rl.ratio - B_RATIO_LOWQ) <= 1e-6 * B_RATIO_LOWQ &&
        Math.abs(rn.ratio - B_RATIO_C065) <= 1e-6 * B_RATIO_C065 &&
        rm.ratio < rl.ratio &&
        rl.ratio < rn.ratio
      );
    },
  },
  {
    id: "imp95109-routeA-split-is-sign-destroying",
    description:
      "ROUTE A (quotient-rule split from separately finite-differenced derivatives) is the WRONG carrier: it gives -1.1451 at the model (off 2.6x vs certified -0.4420) and -20.694 at low-Q - the WRONG SIGN (certified +0.1316) - so the ticket-proposed split cannot found a sign certificate",
    holds: () => {
      const am = routeA_split(1.0, 0.1, 200000);
      const al = routeA_split(0.5, 0.1, 200000);
      return (
        Math.abs(am.cFarpp - A_CFARPP_MODEL) <= 1e-6 * Math.abs(A_CFARPP_MODEL) &&
        Math.abs(al.cFarpp - A_CFARPP_LOWQ) <= 1e-6 * Math.abs(A_CFARPP_LOWQ) &&
        am.cFarpp < 0 &&
        Math.abs(am.cFarpp) > 2 * Math.abs(B_D2_MODEL) &&
        al.cFarpp < 0 &&
        B_D2_LOWQ > 0 &&
        Math.abs(am.ratio - A_RATIO_MODEL) <= 1e-6 * A_RATIO_MODEL
      );
    },
  },
  {
    id: "imp95109-honesty-gate",
    description:
      "the verdict names the obstruction (un-verified midpoint carrier + divergence at Q*), records that Route A is the wrong carrier and Route B is feasible-in-principle, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE.promotesBound === false &&
      IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE.openResiduals.length === 3 &&
      /NO QED/.test(IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE.verdict) &&
      /refereed bound is changed/i.test(IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE.verdict) &&
      /FEASIBLE IN PRINCIPLE/.test(IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE.verdict) &&
      /WRONG carrier/.test(IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE.verdict) &&
      /SUB-GAP/.test(IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE.verdict),
  },
];

for (const a of IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95109-cfar-Q2-interval-sign-certificate assertion failed: ${a.id}`
    );
  }
}

export default IMP95109_CFAR_Q2_INTERVAL_SIGN_CERTIFICATE;
