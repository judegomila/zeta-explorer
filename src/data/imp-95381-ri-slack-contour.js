/**
 * imp-95381: contour of the imp-95271 RI tightness-ratio SLACK across the full
 * bump wedge { x < 1, 1 < r < r_star(x) }, refining imp-95271 finding (3).
 * MEASUREMENT ONLY -- this changes no bound of the Lambda program and asserts
 * no QED; THEOREM RATE-MONO (imp-95231) already proves the RI margin
 * M(x, r) >= 0 everywhere, so RI holds even where its tightness ratio -> 1.
 *
 * OBJECT. Same kernel as imp-95271-ri-margin-map.js: with w1 = e^(-x),
 * P = w1 e^(-r x), h = (w1 - w2)(1+r)/(r-1) (w2 = e^(-r x)) and Lambda_2 the
 * larger root of L^2 - S L + P^2 (S = 2P + h^2), the REDUCED INEQUALITY (RI)
 * is h h_r Lambda_2 <= x P (Lambda_2 - P), and its TIGHTNESS is the ratio
 *   ratio(x, r) = LHS/RHS = h h_r Lambda_2 / (x P (Lambda_2 - P)) in [0, 1].
 * The SLACK is 1 - ratio. imp-95271 finding (3) reported the grid supremum
 * 0.99998744 only at the corner (x -> 0, r -> 1) and slack >= 8% on the single
 * deep-interior slice x in [0.3, 0.9], r in [1.5, r_star(x)] (ratio <= 0.9166
 * at x = 0.3, r = 1.5). This ticket contours the slack across the whole wedge
 * to test whether that >= 8% margin is uniform off the corner.
 *
 * FINDINGS (dense per-x sweep over the full r-extent (1, r_star(x)] of the bump).
 *  (1) THE MAX IS ALWAYS ON THE r -> 1 (COALESCENCE) EDGE. For every fixed x in
 *      (0, 1) the per-x maximum of ratio(x, .) is attained as r -> 1+, not in
 *      the r-interior; so the tightest point at each depth sits on the
 *      coalescence boundary of the bump. The per-x max ratio decreases
 *      monotonically in x along that edge:
 *        x=0.05 -> 0.998687, 0.10 -> 0.994489, 0.15 -> 0.987009,
 *        x=0.20 -> 0.975843, 0.25 -> 0.960582, 0.30 -> 0.940821,
 *        x=0.35 -> 0.916163, 0.40 -> 0.886220, 0.50 -> 0.809017,
 *        x=0.70 -> 0.576196, 0.90 -> 0.224536.
 *  (2) THE >= 8% MARGIN IS NOT UNIFORM OVER THE WHOLE WEDGE -- IT IS UNIFORM
 *      ONLY ABOVE x_c ~ 0.343. Over the FULL r-extent (down to r -> 1) the
 *      per-x max ratio crosses 0.92 (= 8% slack) at x_c = 0.342857; for
 *      x >= x_c the slack is >= 8% uniformly in r, but for x < x_c the ratio
 *      exceeds 0.92 as r -> 1. imp-95271 finding (3)'s >= 8% claim held because
 *      its slice both sat above x_c AND excluded the r -> 1 edge (its r >= 1.5
 *      cut); at x = 0.3 the true per-x max is 0.9408 on the edge, above the
 *      slice value 0.9166 at r = 1.5.
 *  (3) NEAR-SATURATION IS THE WHOLE x -> 0 EDGE, NOT A SINGLE CORNER. The
 *      ratio -> 1 as x -> 0+ UNIFORMLY IN r (checked r = 1.05 .. 100:
 *      ratio(1e-2, r) = 0.99995 .. 0.99963, ratio(1e-4, r) = 1.000000 to
 *      6 places at every r). So excluding a collar of radius delta around the
 *      point (x=0, r=1) does NOT drop the global max: with the corner point
 *      removed the max stays 0.999999 (attained along the small-x edge at
 *      r > 1). RI saturates asymptotically along the entire x -> 0 segment of
 *      the bump, of which imp-95271's (x->0, r->1) corner is one endpoint.
 *  (4) SLACK IS MONOTONE INCREASING IN DEPTH x ALONG THE EDGE. slack(x) =
 *      1 - maxRatio(x) rises monotonically from ~1.3e-3 (x=0.05) through
 *      5.9e-2 (x=0.30), 8.4e-2 (x=0.35), 1.9e-1 (x=0.50) to 7.8e-1 (x=0.90):
 *      deeper cells carry ever more comfortable RI margin, and the only
 *      near-tight region is the shallow x -> 0 edge (closed analytically by
 *      THEOREM RATE-MONO / COAL-DESC).
 *
 * READING. imp-95271 finding (3) is refined: the RI near-saturation set is the
 * whole shallow edge x -> 0 (uniformly in r), and the >= 8% interior margin is
 * uniform only for x >= x_c ~ 0.343. The margin M >= 0 remains proven
 * everywhere (THEOREM RATE-MONO); this contour only characterizes WHERE RI is
 * numerically tight, which is exactly the analytically-closed shallow edge.
 *
 * VERDICT. MEASUREMENT ONLY. Changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: no imports; identical to imp-95271)
// ---------------------------------------------------------------------------

function hOf(x, r) {
  const w1 = Math.exp(-x);
  return (-w1 * Math.expm1(-(r - 1) * x) * (1 + r)) / (r - 1);
}
function lam2(x, r) {
  const w1 = Math.exp(-x);
  const h = hOf(x, r);
  const P = w1 * Math.exp(-r * x);
  return P + (h * h) / 2 + (h / 2) * Math.sqrt(h * h + 4 * P);
}
function hprime(x, r) {
  const e = 1e-7;
  return (hOf(x, r + e) - hOf(x, r - e)) / (2 * e);
}
function riRatio(x, r) {
  const w1 = Math.exp(-x);
  const P = w1 * Math.exp(-r * x);
  const h = hOf(x, r);
  const L = lam2(x, r);
  return (h * hprime(x, r) * L) / (x * P * (L - P));
}
function rStar(x) {
  let lo = 1 + 1e-6;
  let hi = 2;
  while (hprime(x, hi) > 0 && hi < 1e4) hi *= 2;
  if (hprime(x, hi) > 0) return Infinity;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (hprime(x, mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
// per-x maximum of riRatio over the full r-extent (1, r_star(x)] of the bump
function maxRatioAtX(x, nr = 1200) {
  const rs = Math.min(rStar(x), 500);
  let best = -Infinity;
  let br = 1;
  const lrLo = Math.log(1 + 1e-6);
  const lrHi = Math.log(rs);
  for (let j = 0; j <= nr; j++) {
    const r = Math.exp(lrLo + (lrHi - lrLo) * (j / nr));
    const v = riRatio(x, r);
    if (isFinite(v) && v > best) {
      best = v;
      br = r;
    }
  }
  return { max: best, r: br, slack: 1 - best };
}

// ---------------------------------------------------------------------------
// Reference record (baked from the per-x sweep; see tmp/imp-95381-*.mjs)
// ---------------------------------------------------------------------------

export const IMP95381_RI_SLACK_CONTOUR = {
  id: "imp-95381",
  title:
    "Contour of the imp-95271 RI tightness-ratio slack across the full bump " +
    "wedge: the max is always on the r -> 1 edge, the >= 8% margin is uniform " +
    "only for x >= x_c ~ 0.343, and near-saturation is the whole x -> 0 edge " +
    "(uniformly in r), not a single corner",
  ratioDefinition:
    "ratio(x, r) = LHS/RHS = h h_r Lambda_2 / (x P (Lambda_2 - P)) in [0, 1]; " +
    "slack = 1 - ratio; RI holds IFF margin M = RHS - LHS >= 0 (proven " +
    "everywhere by THEOREM RATE-MONO, so ratio -> 1 is tightness not violation)",
  maxOnCoalescenceEdge:
    "for every fixed x in (0, 1) the per-x max of ratio(x, .) is attained as " +
    "r -> 1+ (the coalescence boundary of the bump), never in the r-interior",
  perXMaxRatioEdge: {
    "0.05": 0.998687,
    "0.10": 0.994489,
    "0.15": 0.987009,
    "0.20": 0.975843,
    "0.25": 0.960582,
    "0.30": 0.940821,
    "0.35": 0.916163,
    "0.40": 0.886220,
    "0.50": 0.809017,
    "0.70": 0.576196,
    "0.90": 0.224536,
  },
  eightPercentMarginThreshold:
    "over the full r-extent the per-x max ratio crosses 0.92 (= 8% slack) at " +
    "x_c = 0.342857; the >= 8% interior margin is uniform in r for x >= x_c but " +
    "NOT for x < x_c (where ratio > 0.92 as r -> 1)",
  xCritical: 0.342857,
  imp95271SliceReconciliation:
    "imp-95271 finding (3)'s <= 0.9166 held because its slice x in [0.3,0.9], " +
    "r in [1.5, r_star] both sat above x_c AND excluded the r -> 1 edge (r >= " +
    "1.5); the true per-x max at x = 0.3 is 0.9408 on the r -> 1 edge",
  nearSaturationIsWholeShallowEdge:
    "ratio -> 1 as x -> 0+ UNIFORMLY IN r (r = 1.05 .. 100: ratio(1e-4, r) = " +
    "1.000000 to 6 places at every r); removing a collar around the point " +
    "(x=0, r=1) leaves the global max at 0.999999 along the small-x edge at " +
    "r > 1, so near-saturation is the whole x -> 0 segment not one corner",
  slackMonotoneInDepth:
    "slack(x) = 1 - maxRatio(x) rises monotonically with x: ~1.3e-3 (0.05), " +
    "5.9e-2 (0.30), 8.4e-2 (0.35), 1.9e-1 (0.50), 7.8e-1 (0.90) -- deeper " +
    "cells carry ever more RI margin; the only near-tight region is the " +
    "shallow x -> 0 edge closed analytically by THEOREM RATE-MONO / COAL-DESC",
  verdict:
    "MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed" +
    ". Refines imp-95271 finding (3): the RI near-saturation set is " +
    "the whole shallow x -> 0 edge (uniformly in r), and the >= 8% interior " +
    "margin is uniform only for x >= x_c ~ 0.343; M >= 0 stays proven everywhere.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light; coarse sweeps for build speed)
// ---------------------------------------------------------------------------

export const IMP95381_RI_SLACK_CONTOUR_ASSERTIONS = [
  {
    id: "imp95381-max-on-coalescence-edge",
    description:
      "for each fixed x the per-x max of the RI ratio sits on the r -> 1 edge " +
      "of the bump (argmax r within a hair of coalescence)",
    holds: () => {
      for (const x of [0.1, 0.3, 0.5, 0.7, 0.9]) {
        const m = maxRatioAtX(x, 1500);
        if (!(m.r < 1.02)) return false; // argmax pinned to the r -> 1 edge
      }
      return true;
    },
  },
  {
    id: "imp95381-per-x-max-matches-record",
    description:
      "per-x max ratio on the r -> 1 edge reproduces the baked table to ~1e-3",
    holds: () => {
      const tbl = IMP95381_RI_SLACK_CONTOUR.perXMaxRatioEdge;
      for (const key of Object.keys(tbl)) {
        const x = parseFloat(key);
        const got = maxRatioAtX(x, 1500).max;
        if (Math.abs(got - tbl[key]) > 2e-3) return false;
      }
      return true;
    },
  },
  {
    id: "imp95381-eight-percent-threshold-not-uniform",
    description:
      "the >= 8% margin (ratio <= 0.92) holds for x >= x_c ~ 0.343 but fails " +
      "just below it (ratio > 0.92 as r -> 1), so it is not uniform over the wedge",
    holds: () => {
      const xc = IMP95381_RI_SLACK_CONTOUR.xCritical;
      if (!(maxRatioAtX(xc + 0.02, 1500).max < 0.92)) return false; // above: >=8%
      if (!(maxRatioAtX(xc - 0.05, 1500).max > 0.92)) return false; // below: <8%
      return true;
    },
  },
  {
    id: "imp95381-near-saturation-is-whole-shallow-edge",
    description:
      "the RI ratio -> 1 as x -> 0 uniformly in r, so near-saturation is the " +
      "whole shallow edge and not just the (x->0, r->1) corner",
    holds: () => {
      for (const r of [1.05, 1.5, 5, 50]) {
        if (!(riRatio(1e-4, r) > 0.9999)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95381-slack-monotone-in-depth",
    description:
      "slack(x) = 1 - maxRatio(x) is strictly increasing in x across the wedge",
    holds: () => {
      let prev = -Infinity;
      for (const x of [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9]) {
        const s = maxRatioAtX(x, 1200).slack;
        if (!(s > prev)) return false;
        prev = s;
      }
      return true;
    },
  },
  {
    id: "imp95381-record-honesty",
    description:
      "the record is measurement-only, refines imp-95271, carries NO QED and " +
      "the no-refereed-bound-change line",
    holds: () =>
      IMP95381_RI_SLACK_CONTOUR.xCritical > 0.34 &&
      IMP95381_RI_SLACK_CONTOUR.xCritical < 0.345 &&
      /imp-95271/.test(IMP95381_RI_SLACK_CONTOUR.verdict) &&
      /MEASUREMENT ONLY/.test(IMP95381_RI_SLACK_CONTOUR.verdict) &&
      /NO QED/.test(IMP95381_RI_SLACK_CONTOUR.verdict) &&
      /refereed bound is changed/i.test(IMP95381_RI_SLACK_CONTOUR.verdict),
  },
];

for (const a of IMP95381_RI_SLACK_CONTOUR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95381-ri-slack-contour assertion failed: ${a.id}`);
  }
}

export default IMP95381_RI_SLACK_CONTOUR;
