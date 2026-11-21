// imp-95069 (opus-4-8, api-pool): DERIVATION of the far-coefficient
// break-boundary sharpness for the imp-95026 Finding 4 corner guard.
//
// The nineteenth-continuation EXACT-substitution proof (Lemma RM) of the
// imp-95008 far-bracket ledger requires the corner domain separation
//   V(0, 2) = 2^(1/3) = 1.2599210498948732
// to strictly dominate the corner-guard functional
//   Ystar(s) = (2 s - 1)^(1/(s - 1)) - 1,   s = sigma + theta.
// Below the break boundary s* the guard 2^(1/3) > Ystar(s) fails and the
// EXACT machinery falls back to the eighteenth window envelope (finite, no
// longer sharp - the imp-95068 fallback regime). imp-95026 Finding 4 pins
//   s* = sigma + theta = 2.948383274238082   with   Ystar(s*) = 2^(1/3).
//
// This module CHARACTERIZES that boundary three ways:
//   (A) s* is the root of Ystar(s) = 2^(1/3): Ystar(s*) reproduces 2^(1/3)
//       to under one ULP (|diff| = 2.22e-16), and an independent bisection
//       on Ystar(s) - 2^(1/3) recovers s* = 2.948383274238082 to 16 digits.
//   (B) Ystar is STRICTLY DECREASING on s >= 2 (so the guard is a clean
//       single threshold, no second crossing). Write Ystar + 1 = exp(f),
//       f(s) = ln(2s - 1)/(s - 1). Then f prime = g(s)/(s - 1)^2 with
//       g(s) = 2(s - 1)/(2s - 1) - ln(2s - 1). Its derivative
//       g prime = 2/(2s - 1)^2 - 2/(2s - 1) < 0 for s > 1 (since 2s - 1 > 1),
//       so g is decreasing; g(2) = 2/3 - ln 3 = -0.4319 < 0 gives g(s) < 0
//       for all s >= 2, hence f prime < 0 and Ystar strictly decreasing.
//       A 0.001-step grid scan on [2.1, 30] confirms a strictly negative
//       slope everywhere (max derivative -0.00424).
//   (C) The likely-paper point s = 3 clears the guard by only the THIN
//       margin 2^(1/3) - Ystar(3) = 0.023853072395083386, where the guard
//       value has the closed form Ystar(3) = 5^(1/2) - 1 = sqrt(5) - 1. The
//       model point s = 11 clears it comfortably (margin 0.9040). So the
//       concrete low-decay transfer risk sits entirely in the s = 3 packet.
//
// Measurement/derivation only; instantiates no paper constant, changes no
// bound, promotes no Lambda; no refereed bound is changed. NO QED.

// ── corner-guard functional and separations ──────────────────────────────────
function ystar(s) {
  return Math.pow(2 * s - 1, 1 / (s - 1)) - 1;
}
// derivative-numerator of f(s) = ln(2s-1)/(s-1); f prime = gNumer/(s-1)^2
function gNumer(s) {
  return (2 * (s - 1)) / (2 * s - 1) - Math.log(2 * s - 1);
}

const V02 = Math.pow(2, 1 / 3); // corner separation V(0, 2) = 2^(1/3)
const S_STAR = 2.948383274238082; // sigma + theta where Ystar(s*) = 2^(1/3)

// ── baked literals (all re-derived by the assertions) ────────────────────────
const YSTAR_AT_STAR = 1.259921049894873; // Ystar(s*), matches 2^(1/3) to <1 ULP
const YSTAR3_CLOSED = Math.sqrt(5) - 1; // Ystar(3) = 5^(1/2) - 1
const MARGIN_PAPER = 0.023853072395083386; // 2^(1/3) - Ystar(3), thin
const MARGIN_MODEL = 0.9040389432010265; // 2^(1/3) - Ystar(11), comfortable
const G_AT_2 = -0.43194562200144293; // g(2) = 2/3 - ln 3 < 0 (monotonicity seed)

// independent bisection on Ystar(s) - 2^(1/3) to reconfirm s* to 16 digits
function bisectStar() {
  let lo = 2.5,
    hi = 3.5;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (ystar(mid) > V02) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95069_BREAK_BOUNDARY_SHARPNESS = {
  ticket:
    "imp-95069 (derive the far-coefficient break-boundary s* = 2.948383274238082 sharpness: Ystar(s) = 2^(1/3) corner-guard characterization)",
  source:
    "imp-95026-paper-packet-ceiling-transfer.js Finding 4; the imp-95008 nineteenth-continuation Lemma RM corner domain guard; /permutation-architecture.",
  findingARootPinned:
    "s* = 2.948383274238082 is the root of Ystar(s) = 2^(1/3): Ystar(s*) = 1.259921049894873 reproduces V(0,2) = 2^(1/3) = 1.2599210498948732 to under one ULP (|diff| = 2.22e-16), and an independent bisection on Ystar(s) - 2^(1/3) recovers s* to 16 significant digits.",
  findingBStrictlyDecreasing:
    "Ystar is strictly decreasing on s >= 2, so the guard 2^(1/3) > Ystar(s) is a single clean threshold with no second crossing. Writing Ystar + 1 = exp(f), f(s) = ln(2s-1)/(s-1), the derivative sign is that of g(s) = 2(s-1)/(2s-1) - ln(2s-1); g prime = 2/(2s-1)^2 - 2/(2s-1) < 0 for s > 1 so g decreases, and g(2) = 2/3 - ln 3 = -0.4319 < 0 forces g < 0 (hence Ystar decreasing) for all s >= 2. A 0.001-step grid scan on [2.1, 30] confirms a strictly negative slope everywhere.",
  findingCThinPaperMargin:
    "The likely-paper point s = 3 clears the guard by only 2^(1/3) - Ystar(3) = 0.023853072395083386, with the closed form Ystar(3) = 5^(1/2) - 1 = sqrt(5) - 1; the model point s = 11 clears it by 0.9040. The concrete low-decay transfer risk is confined to the s = 3 packet, which holds but barely.",
  reference: {
    cornerSeparationV02: V02,
    breakBoundaryS: S_STAR,
    ystarAtStar: YSTAR_AT_STAR,
    ystar3Closed: YSTAR3_CLOSED,
    marginPaperS3: MARGIN_PAPER,
    marginModelS11: MARGIN_MODEL,
    gAt2: G_AT_2,
    note: "derivation only; s* is the sharp single-crossing break boundary of the Lemma RM corner guard; model s=11 and paper s=3 both clear it (the latter by only 0.0238), consistent with imp-95026 Finding 4 and the imp-95068 fallback regime below s*.",
  },
  openResiduals: [
    "the actual Section 4.5 paper decay s = sigma + theta is not pinned in this repository (imp-95026 openResiduals[0]); if the paper packet has s < s* the guard fails and the eighteenth window envelope fallback (imp-95068) governs the ceiling instead of the sharp nineteenth form",
  ],
  isRigorous: true,
  rigorScope:
    "Finding A is a numeric root verification (independent bisection). Finding B is an EXACT analytic monotonicity argument (sign chase on g and g prime), cross-checked by a fine grid scan. Finding C records the closed form Ystar(3) = sqrt(5) - 1 and the thin margin. No paper constant is instantiated and no ceiling is transferred; this only characterizes the corner-guard threshold. NO QED.",
  promotesBound: false,
  verdict:
    "DERIVATION of the imp-95026 Finding 4 break boundary. (A) s* = 2.948383274238082 is the root of Ystar(s) = 2^(1/3) (Ystar(s*) matches 2^(1/3) to <1 ULP; bisection reconfirms s* to 16 digits). (B) Ystar is STRICTLY DECREASING on s >= 2 by an exact sign chase (g(s) = 2(s-1)/(2s-1) - ln(2s-1) has g prime < 0 and g(2) = 2/3 - ln 3 < 0), so the corner guard is a clean single threshold. (C) The paper point s = 3 clears the guard by only 0.0238 with Ystar(3) = sqrt(5) - 1, while the model s = 11 clears it by 0.9040 - the low-decay transfer risk is confined to s = 3. Sub-gap: the Section 4.5 decay s is not pinned in this repo. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95069_SHARPNESS_ASSERTIONS = [
  {
    id: "imp95069-root-pinned",
    description:
      "Finding A: Ystar(s*) reproduces 2^(1/3) to under one ULP and an independent bisection recovers s* = 2.948383274238082",
    holds: () => {
      const y = ystar(S_STAR);
      return (
        y === YSTAR_AT_STAR &&
        Math.abs(y - V02) <= 3e-16 &&
        Math.abs(bisectStar() - S_STAR) <= 1e-13
      );
    },
  },
  {
    id: "imp95069-strictly-decreasing",
    description:
      "Finding B: the analytic monotonicity seed g(2) = 2/3 - ln 3 < 0 with g prime < 0, and a fine grid scan on [2.1, 30] shows Ystar strictly decreasing with a negative max slope",
    holds: () => {
      // analytic seed: g(2) = 2/3 - ln 3, and g decreasing (g prime < 0)
      if (Math.abs(gNumer(2) - (2 / 3 - Math.log(3))) > 1e-15) return false;
      if (!(gNumer(2) < 0)) return false;
      const gp = (s) => 2 / Math.pow(2 * s - 1, 2) - 2 / (2 * s - 1);
      if (!(gp(2) < 0 && gp(11) < 0)) return false;
      // numeric monotonicity + strictly negative slope on the relevant range
      let prev = Infinity,
        maxSlope = -Infinity;
      for (let s = 2.1; s <= 30; s += 0.001) {
        const y = ystar(s);
        if (y >= prev) return false;
        const d = (ystar(s + 1e-6) - ystar(s - 1e-6)) / 2e-6;
        if (d > maxSlope) maxSlope = d;
        prev = y;
      }
      return maxSlope < 0;
    },
  },
  {
    id: "imp95069-paper-margin-thin-model-comfortable",
    description:
      "Finding C: Ystar(3) = sqrt(5) - 1 clears 2^(1/3) by only 0.0238, while Ystar(11) clears it by 0.9040; both guards hold",
    holds: () => {
      const mPaper = V02 - ystar(3);
      const mModel = V02 - ystar(11);
      return (
        Math.abs(ystar(3) - YSTAR3_CLOSED) <= 1e-15 &&
        V02 > ystar(3) &&
        V02 > ystar(11) &&
        Math.abs(mPaper - MARGIN_PAPER) <= 1e-15 &&
        Math.abs(mModel - MARGIN_MODEL) <= 1e-13 &&
        mPaper < 0.03 &&
        mModel > 0.5
      );
    },
  },
  {
    id: "imp95069-honesty-gate",
    description:
      "the verdict promotes no bound, names the sub-gap, and keeps the NO QED / no-refereed-bound-change discipline",
    holds: () =>
      IMP95069_BREAK_BOUNDARY_SHARPNESS.promotesBound === false &&
      IMP95069_BREAK_BOUNDARY_SHARPNESS.openResiduals.length === 1 &&
      /NO QED/.test(IMP95069_BREAK_BOUNDARY_SHARPNESS.verdict) &&
      /refereed bound is changed/i.test(IMP95069_BREAK_BOUNDARY_SHARPNESS.verdict) &&
      /STRICTLY DECREASING/.test(IMP95069_BREAK_BOUNDARY_SHARPNESS.verdict),
  },
];

for (const a of IMP95069_SHARPNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95069-break-boundary-sharpness assertion failed: ${a.id}`);
  }
}

export default IMP95069_BREAK_BOUNDARY_SHARPNESS;
