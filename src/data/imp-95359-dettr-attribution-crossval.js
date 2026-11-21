/**
 * @module imp-95359-dettr-attribution-crossval
 * @fileoverview imp-95359 -- independent numerical cross-validation of the
 *   imp-95331 (THEOREM RZ-PEN5, LEMMA ROOT-MONO plus W-SPLIT) skeptical
 *   REFUTATION of the imp-95330 det-over-trace attribution.
 *
 *   WHAT imp-95331 CLAIMS
 *   -----------------------------------------------
 *   imp-95330 attributed up to a 1.66x floor gain to replacing the
 *   det-over-trace lower bound lam_min >= det / tr = C / (2 B) by the exact
 *   smaller quadratic root of A lam^2 - 2 B lam + C, i.e.
 *     lam_min = C / (B + sqrt(B^2 - A C)).
 *   imp-95331 REFUTES this as a standalone lever: the exact-root step gains
 *   at most 1.006x on its own (unsplit chart floor over the RZ-PEN4 floor),
 *   and at most 1.025x layered on top of the side-weight split, because the
 *   trace-cap and numerator-truncation legs are COUPLED through the
 *   discriminant B^2 - A C. The 1.66x gap is only visible at the TRUE
 *   (B, C); it is unreachable while the trace is capped (B large) and the
 *   numerator truncated to the kept pairs (C small), which both drive the
 *   discriminant back toward B^2 where the root degenerates to det over tr.
 *   The actual carrier of the diagnosed corner gain is the side-weight
 *   split, not the exact root.
 *
 *   WHAT THIS MODULE DOES (cross-validation only)
 *   -----------------------------------------------
 *   Independently, without importing the imp-95331 module, it (1) builds the
 *   exact smaller root of A lam^2 - 2 B lam + C at the corner theta = pi and
 *   evaluates the exact-root over det-over-tr ratio
 *     R(B, C) = 2 B / (B + sqrt(B^2 - A C)) = 2 / (1 + sqrt(1 - A C / B^2))
 *   at the three configurations named in the ticket --
 *     (i)   capped trace + truncated numerator  (the REACHABLE floor state),
 *     (ii)  exact trace   + truncated numerator  (numerator still capped),
 *     (iii) exact trace   + exact numerator      (the TRUE B, C),
 *   across rho in {10, e^6} and r in {2, e^3, e^5.9}; and (2) reproduces the
 *   floor-level figures directly: the unsplit exact-root chart floor over the
 *   RZ-PEN4 det-over-tr floor, and the exact-root marginal layered on the
 *   split-weight floor.
 *
 *   RESULT: config (iii) recovers R = 1.6683x at rho = e^6, r = 2, theta = pi
 *   (with true B = 0.1109 vs capped B = 0.4749, matching the imp-95331
 *   hand-decomposition true B ~ 0.111 vs cap ~ 0.488), i.e. the 1.66x gap IS
 *   present at the true values; but config (i) at the reachable capped-and-
 *   truncated state gives only R = 1.0100x pointwise, and the unsplit
 *   exact-root chart floor gains at most 1.00574x over the RZ-PEN4 floor
 *   (below 1.006x) while the split-root marginal is at most 1.02434x (below
 *   1.025x). The intermediate config (ii) at 1.3071x shows the coupling: the
 *   ratio only climbs as BOTH the trace and the numerator are released. The
 *   attribution split 1.006x / 1.025x / 1.66x is confirmed: the det-over-tr
 *   step is near-vacuous in the reachable regime and the 1.66x lived at the
 *   unreachable true (B, C). No bound is changed. NO QED; no refereed bound is changed.
 *
 *   HONEST SCOPE
 *   -----------------------------------------------
 *   This confirms the imp-95331 refutation numerically and independently. It
 *   validates the discriminant-coupling diagnosis and the attribution split;
 *   it does NOT establish any new floor, does NOT touch the OTHER RZ-PEN legs
 *   (pair-identity truncation beyond the kept pairs, c3n tail, b-uniform t3),
 *   and changes no Lambda bound. Model family and dyadic skeleton only.
 */

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * PI) / a / Math.cosh((PI * w) / a);

// --- true pencil symbols at theta: A, B (trace side), C (ordered-pair numerator)
function trueSymbols(theta, a, b, NN = 14) {
  const tau = b / a;
  let fa = 0;
  let br = 0;
  const Ps = [];
  for (let n = -NN; n <= NN; n++) {
    const w = theta + 2 * PI * n;
    const p = kernelP(w, a);
    Ps.push(p);
    fa += p;
    br += p * Math.cos(w * tau);
  }
  let C = 0;
  for (let i = 0; i < Ps.length; i++) {
    for (let j = 0; j < Ps.length; j++) {
      if (i === j) continue;
      const sn = Math.sin(PI * Math.abs(i - j) * tau);
      C += 2 * sn * sn * Ps[i] * Ps[j];
    }
  }
  const s = sechHalf(b);
  const A = 1 - s * s;
  const B = fa - s * br;
  return { A, B, C };
}

// --- imp-95329 per-term t3 weight plus tail (verbatim, self-contained)
function pen3(a) {
  const c = Math.cosh(a / 2);
  const pi2 = PI * PI;
  const kap = (4 * c) / (a * a);
  const kap2 = 4 / (a * a);
  const e2 = Math.exp((-2 * pi2) / a);
  const e3 = Math.exp((-3 * pi2) / a);
  const tA = (((8 * PI) / a) * e3) / (1 - e2);
  const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + (kap2 * w) * w);
  const c3n = cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
  return { tw, c3n };
}

const side = (th, a) => kernelP(2 * PI - th, a) + kernelP(2 * PI + th, a);

// --- capped trace B_up = (A / 2) T at theta (unsplit RZ-PEN4-style trace cap)
function cappedB(theta, a, b) {
  const { tw, c3n } = pen3(a);
  const s = sechHalf(b);
  const A = 1 - s * s;
  const T =
    tw(theta) * kernelP(theta, a) +
    tw(2 * PI + theta) * side(theta, a) +
    c3n;
  return (A / 2) * T;
}

// --- truncated numerator C_low: kept ordered pairs {0, +-1} only
function truncC(theta, a, b) {
  const tau = b / a;
  const q = Math.sin(PI * tau) ** 2;
  const X =
    kernelP(theta, a) *
    (kernelP(2 * PI - theta, a) + kernelP(2 * PI + theta, a));
  return 4 * q * X;
}

// --- exact-root over det-over-tr ratio = 2 / (1 + sqrt(1 - A C / B^2))
function rootOverDetTr(A, B, C) {
  const z = Math.max(0, Math.min(1, (A * C) / (B * B)));
  return 2 / (1 + Math.sqrt(1 - z));
}

// --- three-config decomposition at theta = pi (the corner where the RZ-PEN4
//     trace cap is loosest and the imp-95331 hand-decomposition lives)
function threeConfigAtCorner(rho, r) {
  const a = Math.log(rho);
  const b = Math.log(r);
  const th = PI;
  const { A, B: Btrue, C: Ctrue } = trueSymbols(th, a, b);
  const Bup = cappedB(th, a, b);
  const Clow = truncC(th, a, b);
  return {
    rho,
    r,
    Btrue,
    Bup,
    cappedTruncated: rootOverDetTr(A, Bup, Clow), // (i)
    exactTraceTruncated: rootOverDetTr(A, Btrue, Clow), // (ii)
    exactBoth: rootOverDetTr(A, Btrue, Ctrue), // (iii)
  };
}

// --- floor-level machinery (chartwise, min over K = 256 charts)
function V4(a, t0, t1) {
  const { tw, c3n } = pen3(a);
  const P1 = kernelP(t1, a);
  const S0 = side(t0, a);
  return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
}
function psiUnsplit(a, t0, t1, mu) {
  const { tw, c3n } = pen3(a);
  const X = kernelP(t1, a) * side(t0, a);
  const T = tw(t1) * kernelP(t0, a) + tw(2 * PI + t1) * side(t1, a) + c3n;
  const d = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(d));
}
function psiSplit(a, t0, t1, mu) {
  const { tw, c3n } = pen3(a);
  const xLo = kernelP(t1, a);
  const y1 = kernelP(2 * PI - t0, a);
  const y2 = kernelP(2 * PI + t1, a);
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3n;
  const X = xLo * (y1 + y2);
  const d = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(d));
}
const prefac = (a, b) => Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;
function scan(f) {
  let w = Infinity;
  for (let k = 0; k < 256; k++) {
    const v = f((PI * k) / 256, (PI * (k + 1)) / 256);
    if (v < w) w = v;
  }
  return w;
}
function floorFigures(rho, r) {
  const a = Math.log(rho);
  const b = Math.log(r);
  const mu = prefac(a, b);
  const w4 = scan((t0, t1) => V4(a, t0, t1));
  const wUnsplitRoot = scan((t0, t1) =>
    Math.max(V4(a, t0, t1), psiUnsplit(a, t0, t1, mu)),
  );
  const wSplitDT = scan((t0, t1) => Math.max(V4(a, t0, t1), psiSplit(a, t0, t1, 0)));
  const wSplitRoot = scan((t0, t1) =>
    Math.max(V4(a, t0, t1), psiSplit(a, t0, t1, mu)),
  );
  return {
    rho,
    r,
    unsplitRootGain: wUnsplitRoot / w4, // <= 1.006 expected
    splitRootMarginal: wSplitRoot / wSplitDT, // <= 1.025 expected
  };
}

const E6 = Math.exp(6);
const CONFIGS = [
  threeConfigAtCorner(10, 2),
  threeConfigAtCorner(E6, 2),
  threeConfigAtCorner(E6, Math.exp(3)),
  threeConfigAtCorner(E6, Math.exp(5.9)),
];
const FLOORS = [floorFigures(10, 2), floorFigures(E6, 2), floorFigures(E6, Math.exp(3))];
const cornerE6R2 = CONFIGS[1];
const maxUnsplitGain = Math.max(...FLOORS.map((f) => f.unsplitRootGain));
const maxSplitMarginal = Math.max(...FLOORS.map((f) => f.splitRootMarginal));

export const IMP95359_DETTR_ATTRIBUTION_CROSSVAL = {
  id: 'imp-95359',
  glosses: 'imp-95331',
  scopes:
    'THEOREM RZ-PEN5 skeptical refutation of the imp-95330 det-over-trace ' +
    'attribution: the exact smaller root of A lam^2 - 2 B lam + C gains at ' +
    'most 1.006x standalone and 1.025x atop the split because trace-cap and ' +
    'numerator-truncation couple through the discriminant B^2 - A C',
  method:
    'Independent build of the exact smaller root and the ratio R = 2 / ' +
    '(1 + sqrt(1 - A C / B^2)) at theta = pi for three configs (capped ' +
    'trace plus truncated numerator; exact trace plus truncated numerator; ' +
    'exact both) over rho in {10, e^6}, r in {2, e^3, e^5.9}; plus a direct ' +
    'chartwise floor-level reproduction of the unsplit exact-root gain and ' +
    'the split-root marginal. No import of the imp-95331 module.',
  // (1) three-config pointwise decomposition at the corner theta = pi
  threeConfig: CONFIGS,
  cornerE6R2Detail: {
    Btrue: cornerE6R2.Btrue, // ~ 0.1109 (imp-95331 hand note: true B ~ 0.111)
    Bcapped: cornerE6R2.Bup, // ~ 0.4749 (imp-95331 hand note: cap ~ 0.488)
    ratioCappedTruncated: cornerE6R2.cappedTruncated, // (i) ~ 1.0100
    ratioExactTraceTruncated: cornerE6R2.exactTraceTruncated, // (ii) ~ 1.3071
    ratioExactBoth: cornerE6R2.exactBoth, // (iii) ~ 1.6683
  },
  // (2) floor-level figures reproduced directly
  floorFigures: FLOORS,
  maxUnsplitRootGainOverW4: maxUnsplitGain, // ~ 1.00574 (< 1.006)
  maxSplitRootMarginal: maxSplitMarginal, // ~ 1.02434 (< 1.025)
  // attribution split confirmed
  attributionSplitConfirmed:
    maxUnsplitGain <= 1.006 &&
    maxSplitMarginal <= 1.025 &&
    cornerE6R2.exactBoth > 1.6 &&
    cornerE6R2.cappedTruncated < 1.02,
  discriminantCouplingConfirmed:
    cornerE6R2.exactBoth > cornerE6R2.exactTraceTruncated &&
    cornerE6R2.exactTraceTruncated > cornerE6R2.cappedTruncated,
  anyEnclosureEstablished: false,
  verdict:
    'CONFIRMED: the exact smaller root of A lam^2 - 2 B lam + C recovers the ' +
    '1.66x det-over-tr gap ONLY at the true (B, C) (R = 1.6683x at rho = e^6, ' +
    'r = 2, theta = pi, with true B = 0.1109 vs capped B = 0.4749 matching ' +
    'the imp-95331 hand-decomposition), while the reachable capped-and-' +
    'truncated config (i) gives only 1.0100x pointwise; independently the ' +
    'unsplit exact-root chart floor gains at most 1.00574x over the RZ-PEN4 ' +
    'floor (below 1.006x) and the split-root marginal is at most 1.02434x ' +
    '(below 1.025x). The intermediate config (ii) at 1.3071x confirms the ' +
    'discriminant coupling B^2 - A C: the ratio climbs only as both trace ' +
    'and numerator are released. The imp-95331 refutation of the imp-95330 ' +
    'attribution is reproduced independently. Cross-validation only; changes ' +
    'no bound; NO QED; no refereed bound is changed.',
};

const IMP95359_DETTR_ATTRIBUTION_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp95359-config-i-near-vacuous',
    why:
      'At the reachable capped-trace plus truncated-numerator state the ' +
      'exact-root over det-over-tr ratio is near 1 at every sampled cell ' +
      '(<= 1.02x), so the det-over-tr step is near-vacuous standalone.',
    holds: () =>
      IMP95359_DETTR_ATTRIBUTION_CROSSVAL.threeConfig.every(
        (c) => c.cappedTruncated >= 1 && c.cappedTruncated < 1.02,
      ),
  },
  {
    id: 'imp95359-config-iii-recovers-1p66x',
    why:
      'At the true (B, C) the exact-root over det-over-tr ratio reaches ' +
      '1.6683x at rho = e^6, r = 2 -- the 1.66x gap imp-95330 attributed to ' +
      'the det-over-tr step is present at the true values.',
    holds: () => {
      const c = IMP95359_DETTR_ATTRIBUTION_CROSSVAL.cornerE6R2Detail;
      return (
        Math.abs(c.ratioExactBoth - 1.6683) < 5e-3 &&
        Math.abs(c.Btrue - 0.1109) < 5e-3 &&
        Math.abs(c.Bcapped - 0.4749) < 5e-3
      );
    },
  },
  {
    id: 'imp95359-discriminant-coupling',
    why:
      'The ratio is monotone across the configs (i) < (ii) < (iii): it ' +
      'climbs only as BOTH the trace cap and the numerator truncation are ' +
      'released, confirming the coupling through the discriminant B^2 - A C.',
    holds: () =>
      IMP95359_DETTR_ATTRIBUTION_CROSSVAL.discriminantCouplingConfirmed === true,
  },
  {
    id: 'imp95359-floor-level-1p006-and-1p025',
    why:
      'Direct chartwise reproduction: the unsplit exact-root floor gains at ' +
      'most 1.00574x over the RZ-PEN4 floor (below 1.006x) and the split-' +
      'root marginal is at most 1.02434x (below 1.025x).',
    holds: () =>
      IMP95359_DETTR_ATTRIBUTION_CROSSVAL.maxUnsplitRootGainOverW4 <= 1.006 &&
      IMP95359_DETTR_ATTRIBUTION_CROSSVAL.maxSplitRootMarginal <= 1.025,
  },
  {
    id: 'imp95359-attribution-split-confirmed',
    why:
      'All three attribution figures 1.006x / 1.025x / 1.66x reproduce, ' +
      'confirming the imp-95331 refutation of the imp-95330 det-over-tr ' +
      'attribution.',
    holds: () =>
      IMP95359_DETTR_ATTRIBUTION_CROSSVAL.attributionSplitConfirmed === true,
  },
  {
    id: 'imp95359-honesty-gate-no-qed',
    why:
      'Cross-validation only: no enclosure established, no-refereed-bound-change line ' +
      'present, scope glosses the single finding being checked.',
    holds: () =>
      IMP95359_DETTR_ATTRIBUTION_CROSSVAL.anyEnclosureEstablished === false &&
      /refereed bound is changed/i.test(IMP95359_DETTR_ATTRIBUTION_CROSSVAL.verdict) &&
      IMP95359_DETTR_ATTRIBUTION_CROSSVAL.glosses === 'imp-95331',
  },
];

for (const assertion of IMP95359_DETTR_ATTRIBUTION_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95359-dettr-attribution-crossval assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP95359_DETTR_ATTRIBUTION_CROSSVAL;
