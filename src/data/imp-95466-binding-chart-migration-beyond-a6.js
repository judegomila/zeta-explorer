/**
 * imp-95466: MEASUREMENT -- extension of the imp-95341 binding-chart
 * migration BEYOND a = 6 (rho > e^6) into the named large-a
 * uniform-branch headroom. imp-95341 maps the binding chart k*(a, mu) of
 * the imp-95332 min-over-charts floor W6(a, mu) = min_{k=0..255}
 * max(V4_k, Psi5_k, Psi6_k(mu)) only up to a = 6 (the SOTA-relevant far
 * end) and lists large-a uniform-branch headroom as a residual. This
 * module measures how the binding index k*, its theta-window centre
 * theta* / pi = (k* + 1/2) / K, and the floor value W6 behave for a > 6
 * on the r-and-m-uniform certificate mu = 16 / a^2, to localize whether
 * the imp-95332 Psi6 interior window keeps controlling the floor or a
 * new binding window appears. Measurement only; recomputes ONLY
 * quantities already proven in imp-95330/95331/95332; changes NO bound;
 * NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95332 / imp-95341 normalization, verbatim). a = ln rho,
 * b = ln r in (0, a), tau = b / a, K = 256 uniform charts I_k =
 * [pi k / K, pi (k + 1) / K] of [0, pi]. Chart floor
 * max(V4_k, Psi5_k, Psi6_k(mu)) with the imp-95330 carried floor V4_k,
 * the imp-95331 split-weight exact-root floor Psi5_k and the imp-95332
 * per-chart-tail floor Psi6_k; uniform certificate mu = 16 / a^2. The
 * binding chart is k*(a, mu) = argmin_k of the chartwise max.
 *
 * THREE MEASURED FINDINGS.
 *
 * (1) INTERIOR RETREAT CONTINUES on a in (6, ~8.01]. The imp-95341
 * a = 6 retreat (k* = 114, theta* ~ 0.447 pi, Psi6 branch) is NOT the
 * end of the sweep: k* keeps decreasing monotonically past chart 114 --
 *     a = 6   k* = 114   theta* / pi = 0.4473   Psi6   W6 = 1.3369e-1
 *     a = 7   k* = 102   theta* / pi = 0.4004   Psi6   W6 = 1.5339e-1
 *     a = 8   k* =  89   theta* / pi = 0.3496   Psi6   W6 = 1.6494e-1
 * -- the interior Psi6 window drifts LEFT (toward theta = 0) as rho
 * grows past e^6.
 *
 * (2) A NEW RIGHT-EDGE WINDOW SUPERSEDES THE INTERIOR near a ~ 8.01. At
 * a ~ 8.01 the binding chart JUMPS discontinuously from the interior
 * (k* ~ 89) to the RIGHT EDGE chart k* = 255 (theta* -> pi). Just below
 * the jump the interior Psi6 window and the right-edge chart are
 * near-degenerate (max ~ 1.6494e-1 interior vs ~ 1.6504e-1 right edge at
 * a = 8.00); above it the right-edge chart binds for ALL a in
 * ~ (8.01, a*). So the ticket question is answered: the imp-95332 Psi6
 * INTERIOR window does NOT keep controlling the floor for all a > 6 -- a
 * right-edge (theta -> pi) window appears and takes over above a ~ 8.
 *
 * (3) TAIL-MAJORANT DOMAIN WALL at a* = 2 pi^2 / ln 4 ~ 14.2388
 * (rho* = e^a* ~ 1.527e6). The proven closed-form chart floors
 * (imp-95330/95332) use the geometric tail-sum constant
 * tQ proportional to 1 / (1 - 4 e^{-2 pi^2 / a}). That denominator flips
 * sign exactly at a* = 2 pi^2 / ln 4: 1 - 4 e^{-2 pi^2 / a} > 0 iff
 * a < a*. For a > a* the tail constant tQ (and hence c3n, Psi5, Psi6)
 * turn NEGATIVE and the min-over-charts floor W6 becomes spuriously
 * negative (e.g. W6 = -3.3e-5 at a = 20), i.e. the certificate formula
 * is outside its validated domain. The migration measurement is
 * therefore MEANINGFUL only for a < a* ~ 14.24 (rho < ~ 1.5e6); across
 * that whole live band W6 stays O(1.3e-1..1.65e-1) and NO certificate
 * fires (the uniform certificate fires only in the SOTA-relevant
 * regime, imp-95332), so nothing here changes the bound.
 *
 * ACTIONABLE READING. The imp-95341 large-a uniform-branch headroom
 * residual is now localized: (i) the a = 6 interior retreat continues
 * one chart-band further before (ii) a right-edge window supersedes the
 * interior near a ~ 8, and (iii) the entire uniform-side floor loses
 * analytic validity at the explicit tail-series wall a* = 2 pi^2 / ln 4
 * ~ 14.2388 -- a genuine domain boundary of the geometric-tail majorant,
 * not merely unmapped numerics. Any large-a uniform-branch sharpening
 * must first re-close the tail majorant beyond 4 e^{-2 pi^2 / a} = 1
 * (a shorter geometric ratio) before the a > a* region is even
 * addressable; and beyond a ~ 8 the binding window to target is the
 * right edge, not the interior chart-114 window that governs at e^6.
 *
 * HONEST LIMITS. (a) Measurement only: k* / theta* / W6 are argmin and
 * value of already proven chart floors; no floor value, bound or onset
 * is changed. (b) Dyadic-skeleton and model family only (imp-95232
 * residual). (c) K = 256 chart resolution: k* to one chart, theta* / pi
 * to ~ 1/512; the transition a ~ 8.01 and the wall a* are reported to
 * that resolution / to closed form respectively. (d) The a > a* region
 * is NOT measured (formula invalid there); the wall is the finding, not
 * a claim about behaviour past it. (e) No paper per-window / gammaSL
 * mapping (obligation (3) unchanged); imp-95212 Fresnel-Airy
 * envelope-port sub-gap STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics recompute
 * quantities proven in the cited modules; they are the measurement
 * itself, never a claim of a new bound.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95466_BINDING_CHART_BEYOND_A6 = {
  id: "imp-95466",
  title:
    "MEASUREMENT: extension of the imp-95341 binding-chart migration " +
    "beyond a = 6 (rho > e^6) -- interior retreat continues to a ~ 8.01, " +
    "then a right-edge window (theta -> pi) supersedes it, and the " +
    "geometric-tail majorant loses validity at a* = 2 pi^2 / ln 4 ~ 14.24",
  object:
    "K = 256 uniform charts of [0, pi]; binding chart k*(a, mu) = " +
    "argmin_k max(V4_k, Psi5_k, Psi6_k(mu)) with the r-and-m-uniform " +
    "certificate mu = 16 / a^2; theta-window centre theta* / pi = " +
    "(k* + 1/2) / K; floor W6 = min-over-charts value",
  K: 256,
  N: 12,
  interiorRetreat: {
    finding:
      "the imp-95341 a = 6 retreat continues: k* keeps decreasing " +
      "monotonically past chart 114 as rho grows, the interior Psi6 " +
      "window drifting toward theta = 0",
    ledger: [
      { a: 6, rho: "e^6", kBind: 114, thetaMidOverPi: 0.447265625, branch: "Psi6" },
      { a: 7, rho: "e^7", kBind: 102, thetaMidOverPi: 0.400390625, branch: "Psi6" },
      { a: 8, rho: "e^8", kBind: 89, thetaMidOverPi: 0.349609375, branch: "Psi6" },
    ],
  },
  rightEdgeTakeover: {
    aApprox: 8.01,
    note:
      "at a ~ 8.01 the binding chart jumps from the interior (k* ~ 89) " +
      "to the RIGHT edge k* = 255 (theta* -> pi); just below the jump " +
      "the interior Psi6 window and the right-edge chart are " +
      "near-degenerate (max ~ 1.6494e-1 vs ~ 1.6504e-1 at a = 8.00); " +
      "the right-edge chart then binds for all a in ~ (8.01, a*)",
    interiorMaxAtA8: 1.6494e-1,
    rightEdgeMaxAtA8: 1.6504e-1,
  },
  tailDomainWall: {
    aStar: 14.238829324987504,
    aStarClosedForm: "2 pi^2 / ln 4",
    rhoStarApprox: 1.527e6,
    mechanism:
      "the proven chart floors use the geometric tail-sum constant tQ " +
      "proportional to 1 / (1 - 4 e^{-2 pi^2 / a}); this denominator is " +
      "positive iff a < a* = 2 pi^2 / ln 4, and flips sign at a*; for " +
      "a > a* the tail constant (hence c3n, Psi5, Psi6) go negative and " +
      "the min-over-charts floor W6 turns spuriously negative " +
      "(W6 = -3.3e-5 at a = 20), i.e. the formula is outside its " +
      "validated domain",
    meaningfulBand:
      "the migration measurement is meaningful only for a < a* ~ 14.24 " +
      "(rho < ~ 1.5e6); across that live band W6 stays O(1.3e-1..1.65e-1)",
  },
  actionableReading:
    "the imp-95341 large-a uniform-branch headroom residual is " +
    "localized: the a = 6 interior retreat continues one chart-band " +
    "further to a ~ 8.01, a right-edge (theta -> pi) window then " +
    "supersedes the interior, and the whole uniform-side floor loses " +
    "analytic validity at the explicit tail-series wall a* = 2 pi^2 / " +
    "ln 4 ~ 14.2388; any large-a sharpening must first re-close the " +
    "geometric-tail majorant beyond 4 e^{-2 pi^2 / a} = 1, and beyond " +
    "a ~ 8 the binding window is the right edge, not the interior " +
    "chart-114 window that governs at e^6",
  consistencyWithImp95341:
    "reproduces the imp-95341 / imp-95332 anchor k* = 114 at a = 6 " +
    "(rho = e^6) on the Psi6 branch, and continues its documented " +
    "monotone retreat past that endpoint",
  honestScope:
    "measurement only -- k*, theta* and W6 are the argmin / value of " +
    "already proven chart floors; changes NO floor value, bound or " +
    "onset; dyadic-skeleton and model family only; K = 256 resolution " +
    "(theta* / pi to ~ 1/512); the a > a* region is NOT measured " +
    "(formula invalid there) -- the wall is the finding; no gammaSL " +
    "mapping; imp-95212 sub-gap still open",
  verdict:
    "MEASUREMENT: beyond a = 6 the imp-95341 interior retreat CONTINUES " +
    "(k* = 114 -> 102 -> 89 at a = 6, 7, 8, theta* drifting toward 0), " +
    "then a NEW right-edge window (theta -> pi, k* = 255) supersedes the " +
    "interior Psi6 window near a ~ 8.01, so the interior window does NOT " +
    "control the floor for all rho > e^6; and the geometric-tail " +
    "majorant underlying the proven chart floors loses validity at the " +
    "explicit wall a* = 2 pi^2 / ln 4 ~ 14.2388 (rho* ~ 1.527e6), where " +
    "1 - 4 e^{-2 pi^2 / a} flips sign and W6 turns spuriously negative. " +
    "The measurement is meaningful only on a < a*; across it W6 stays " +
    "O(1.3e-1..1.65e-1) and no certificate fires. Recomputes only " +
    "imp-95330/95331/95332 quantities; changes no bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric machinery (self-contained, import-light; verbatim conventions
// of imp-95332-chart-tail-pencil-floor.js / imp-95341)
// ---------------------------------------------------------------------------

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * PI) / a / Math.cosh((PI * w) / a);

function baseConstants(a) {
  const pi2 = PI * PI;
  const c = Math.cosh(a / 2);
  const kap = (4 * c) / (a * a);
  const e2 = Math.exp((-2 * pi2) / a);
  const e3 = Math.exp((-3 * pi2) / a);
  const tA = (((8 * PI) / a) * e3) / (1 - e2);
  const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
  return { kap, tA, tQ };
}
function pen3Constants(a) {
  const { kap, tA, tQ } = baseConstants(a);
  const kap2 = 4 / (a * a);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  const c3n = cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
  return { tw, c3n, kap, kap2, cAlpha };
}
const sideSum = (th, a) => kernelP(2 * PI - th, a) + kernelP(2 * PI + th, a);

function chartV4(a, t0, t1) {
  const { tw, c3n } = pen3Constants(a);
  const P1 = kernelP(t1, a);
  const S0 = sideSum(t0, a);
  return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
}
function chartPsi5(a, t0, t1, mu) {
  const { tw, c3n } = pen3Constants(a);
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3n;
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}
function c3nChart(a, t0, t1, N = 12) {
  const { tw, kap, kap2, cAlpha } = pen3Constants(a);
  let s = 0;
  for (let m = 2; m <= N; m++) {
    s += tw(2 * PI * m + t1) * kernelP(2 * PI * m + t0, a);
    s += tw(2 * PI * m - t0) * kernelP(2 * PI * m - t1, a);
  }
  const pi2 = PI * PI;
  const e2 = Math.exp((-2 * pi2) / a);
  const eA = Math.exp((-(2 * N + 1) * pi2) / a);
  const tAr = (((8 * PI) / a) * eA) / (1 - e2);
  const tQr = (((8 * (2 * N + 3) ** 2 * PI ** 3) / a) * eA) / (1 - 4 * e2);
  const rem = cAlpha * tAr + Math.min(kap * tQr, 2 * tAr + kap2 * tQr);
  return s + rem;
}
function chartPsi6(a, t0, t1, mu, N = 12) {
  const { tw } = pen3Constants(a);
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3nChart(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}

// binding chart = argmin over K charts of the chartwise floor max;
// returns index k*, its theta-window centre, the binding branch label
// and the floor value W6
function bindingChart(a, mu, K = 256, N = 12) {
  let worst = Infinity;
  let kBind = -1;
  let branch = "";
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v4 = chartV4(a, t0, t1);
    const p5 = chartPsi5(a, t0, t1, mu);
    const p6 = chartPsi6(a, t0, t1, mu, N);
    const v = Math.max(v4, p5, p6);
    if (v < worst) {
      worst = v;
      kBind = k;
      branch = v === v4 ? "V4" : v === p5 ? "Psi5" : "Psi6";
    }
  }
  return { kBind, thetaMidOverPi: (kBind + 0.5) / K, branch, floor: worst };
}

const REC = IMP95466_BINDING_CHART_BEYOND_A6;

// ---------------------------------------------------------------------------
// Self-executing assertions (cross-checks of the measured extension)
// ---------------------------------------------------------------------------

export const IMP95466_ASSERTIONS = [
  {
    id: "imp95466-anchor-a6-reproduces",
    description:
      "the a = 6 anchor reproduces the imp-95341 / imp-95332 binding " +
      "chart k* = 114 on the Psi6 branch (uniform mu = 16 / a^2)",
    holds: () => {
      const bc = bindingChart(6, 16 / 36);
      return bc.kBind === 114 && bc.branch === "Psi6";
    },
  },
  {
    id: "imp95466-interior-retreat-continues",
    description:
      "beyond a = 6 the interior Psi6 window keeps retreating: k* = 114, " +
      "102, 89 at a = 6, 7, 8 with matching theta* / pi, all on the Psi6 " +
      "branch",
    holds: () => {
      for (const row of REC.interiorRetreat.ledger) {
        const bc = bindingChart(row.a, 16 / (row.a * row.a));
        if (bc.kBind !== row.kBind) return false;
        if (bc.branch !== row.branch) return false;
        if (Math.abs(bc.thetaMidOverPi - row.thetaMidOverPi) > 1e-12)
          return false;
      }
      // strictly decreasing across the three anchors
      const ks = REC.interiorRetreat.ledger.map((r) => r.kBind);
      return ks[0] > ks[1] && ks[1] > ks[2];
    },
  },
  {
    id: "imp95466-right-edge-takeover",
    description:
      "the binding chart jumps from the interior (k* = 89 at a = 8.00) " +
      "to the right edge k* = 255 (theta* -> pi) just above a ~ 8.01 and " +
      "stays there through a = 12 (still below the tail wall)",
    holds: () => {
      if (bindingChart(8.0, 16 / 64).kBind !== 89) return false;
      // just above the transition the right edge binds
      for (const a of [8.05, 9, 10, 12]) {
        const bc = bindingChart(a, 16 / (a * a));
        if (bc.kBind !== 255) return false;
      }
      return true;
    },
  },
  {
    id: "imp95466-tail-domain-wall",
    description:
      "the geometric-tail constant 1 - 4 e^{-2 pi^2 / a} is positive " +
      "below a* = 2 pi^2 / ln 4 and negative above it; the closed-form " +
      "a* matches the recorded value and the floor W6 turns negative " +
      "past the wall (W6 < 0 at a = 20)",
    holds: () => {
      const aStar = (2 * PI * PI) / Math.log(4);
      if (Math.abs(aStar - REC.tailDomainWall.aStar) > 1e-9) return false;
      const tail = (a) => 1 - 4 * Math.exp((-2 * PI * PI) / a);
      if (!(tail(aStar - 0.5) > 0)) return false;
      if (!(tail(aStar + 0.5) < 0)) return false;
      if (Math.abs(tail(aStar)) > 1e-9) return false;
      // formula loses validity: floor spuriously negative past the wall
      return bindingChart(20, 16 / 400).floor < 0;
    },
  },
  {
    id: "imp95466-live-band-positive-O1",
    description:
      "across the live band a in [6, 14] (below the wall) the floor W6 " +
      "stays positive and O(1.3e-1..1.7e-1); no certificate fires and " +
      "no bound is changed",
    holds: () => {
      for (let a = 6; a <= 14.0001; a += 0.5) {
        const w = bindingChart(a, 16 / (a * a)).floor;
        if (!(w > 0.1 && w < 0.5)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95466-honesty-gate",
    description:
      "the verdict is measurement-only, names the interior retreat, the " +
      "right-edge takeover and the tail-majorant wall, promotes no " +
      "bound, NO QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(REC.verdict) &&
      /retreat CONTINUES/.test(REC.verdict) &&
      /right-edge window/.test(REC.verdict) &&
      /loses validity/.test(REC.verdict) &&
      /changes no bound/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /measurement only/.test(REC.honestScope),
  },
];

for (const a of IMP95466_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95466-binding-chart-migration-beyond-a6 assertion failed: ${a.id}`,
    );
  }
}

export default IMP95466_BINDING_CHART_BEYOND_A6;
