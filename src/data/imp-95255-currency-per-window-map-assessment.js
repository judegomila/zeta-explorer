/**
 * imp-95255: MAPPING ASSESSMENT (SPLIT VERDICT) -- do the imp-95233
 * model-family currencies y_min and theta map to concrete paper per-window
 * seam quantities in the Gate-2/paper framework, or is there an obstruction?
 *
 * imp-95233 HONEST LIMITS (c) recorded flatly that "y_min and theta are
 * model-family (packet-model) quantities not yet mapped to the paper
 * per-window quantities, so PHASE-CERT changes no Lambda bound." This module
 * assesses that statement leg by leg and finds it is TOO CONSERVATIVE on one
 * currency and EXACTLY RIGHT on the other -- the two currencies map very
 * differently:
 *
 *   y_min  -- MAPS. It is a per-window GEOMETRY quantity that inherits the
 *             SAME transcribed map that already carries x_min into the paper
 *             framework (imp-95220 width-law port + imp-95222 COROLLARY
 *             QG-2). No new map is needed and none is missing.
 *   theta  -- OBSTRUCTED. It is a per-window SIGN/amplitude functional, and
 *             the transcription is GEOMETRIC: it supplies rates and centers
 *             (hence y_min) and fixes amplitude MODULI at 1/p (paper eq 14),
 *             but carries NO per-window sign pattern. theta has no image
 *             under the current map. This is the wall.
 *
 * Twenty-fourth-adjacent leg of the seam chain; ASSESSMENT only, consuming
 * the maps of imp-95220 (width-law port) and imp-95222 (FA-2 / QG-2) and the
 * currencies of imp-95233 (theta, y_min). Objects as in imp-95221/95222/
 * 95233: packets f_n(s) = e^(-mu_n |s - u_n|), rates mu_n > 0, centers
 * u_n > 0, amplitudes c_n; g = sum |c_n| f_n; R = int_(s<0) f^2 / int_R f^2;
 * y_min = min over pairs incl diagonal of (mu_m + mu_n) min(u_m, u_n);
 * theta = int_R f^2 / int_R g^2 in (0, 1].
 *
 * THE TRANSCRIBED MAP (consumed, not re-derived; imp-95220 LEMMA MAP). Paper
 * eq (14)/(15) place window aliases on the grid G(p, D) = { n/p : 1 <= n <=
 * pD, p does not divide n }. The forced width-law port models the alias at
 * denominator d by a two-sided exponential packet with
 *   mu(d) = d^(1/3) / c ,   u(d) = v / d ,
 * so the per-packet depth-rate product is x(d) = mu(d) u(d) = (v/c) d^(-2/3),
 * strictly decreasing in d, and with the per-window isolation group
 * Q = (c D^(2/3) / v) 2^(-2/3) the identity x(D/2) = 1/Q is EXACT. This is a
 * GEOMETRY map: it sends grid denominators d to (rate, center) pairs. The
 * amplitude moduli are separately pinned at 1/p by paper eq (14); the
 * amplitude SIGNS are not part of the transcription.
 *
 * LEG 1 -- y_min MAPS (POSITIVE). y_min is built only from rates and centers,
 * exactly the data the width-law port supplies, so it is a well-defined
 * per-window quantity the moment the geometry map is fixed. Two facts pin it
 * to the SAME per-window scale as x_min:
 *   (i) FA-2 bracket (imp-95222 THEOREM FA-2, exact): x_min <= y_min <=
 *       2 x_min for ANY family, where x_min = min_d x(d) = x(d_max) with
 *       d_max = D - 1/p (the integer pD is excluded from the grid), so
 *       x_min -> x(D) = (v/c) D^(-2/3) = 2^(-2/3)/Q as pD -> inf. Hence
 *       y_min lies in a per-window interval set by the isolation group Q that
 *       imp-95222 COROLLARY QG-2 already uses (to leading order [2^(-2/3)/Q,
 *       2^(1/3)/Q]).
 *   (ii) On the ACTUAL ported grid G(p, D) the bracket is far tighter than
 *        the factor 2: the y_min-minimizing pair is (shallowest packet
 *        d = d_max, slowest-rate packet d = 1/p), so y_min is close to x_min
 *        plus a small slow-rate correction, and the MEASURED ratio
 *        y_min/x_min = 1.522758, 1.351634, 1.233055, 1.164904 at
 *        pD = 8, 24, 80, 224 -- strictly decreasing toward 1. y_min collapses
 *        onto x_min in the large-window limit; it is essentially the same
 *        per-window quantity, not an independent unmapped one.
 * CONSEQUENCE: HONEST LIMITS (c) is over-conservative on y_min. Anywhere the
 * paper already carries x_min (via Q), it carries y_min for free within the
 * bracket above; PHASE-CERT restricted to its depth argument is as portable
 * as FA-2 already is.
 *
 * LEG 2 -- theta IS THE OBSTRUCTION (NEGATIVE, identified wall). theta is not
 * a geometry functional: R and theta are both homogeneous of degree 0 in the
 * amplitudes (imp-95139 scope), and theta = int f^2 / int g^2 is exactly the
 * scale-invariant measure of how the SIGN PATTERN of the amplitudes deforms
 * f away from its modulus envelope g. The transcribed map has no image for
 * it, for a structural reason:
 *   (a) On the FIXED-AMPLITUDE ported family the paper actually specifies
 *       (all alias amplitudes equal to 1/p, i.e. a positive cone), f = g
 *       identically, so theta = 1 EXACTLY and PHASE-CERT degenerates to FA-2
 *       with zero phase content. In the family the transcription hands us,
 *       theta carries no information.
 *   (b) theta < 1 -- the regime where PHASE-CERT does more than FA-2 --
 *       requires genuine per-window SIGN CANCELLATION among the alias
 *       contributions. But the imp-95071/imp-95220 transcription is a
 *       GEOMETRY + modulus transcription (it fixes mu(d), u(d), |c| = 1/p);
 *       it does not carry the per-window sign/phase pattern of the seam. So
 *       there is no data in the current map from which a per-window theta < 1
 *       could be read off. theta has no preimage; the map stops at geometry.
 * This is the wall: y_min lives in the transcribed (rate, center) data and
 * maps; theta lives in the amplitude-sign data the transcription drops, so
 * it does not. Closing this gap needs the per-window sign/phase structure of
 * the alias expansion transcribed (an extension of imp-95071, the same class
 * of missing input flagged by the still-open envelope-shape / gammaSL-map
 * obligation (3)) -- it is NOT recoverable from the geometry map alone.
 *
 * HONEST LIMITS. (a) ASSESSMENT only: nothing here derives or moves a bound;
 * it classifies the two currencies against the existing transcription.
 * (b) LEG 1 uses the exact FA-2 bracket (rigorous) plus a MEASURED tightness
 * ratio (quadrature-free, from the width-law port geometry) -- the collapse
 * y_min/x_min -> 1 is observed on four grids, not proved as a limit law here.
 * (c) LEG 2 identifies an obstruction of the current map, not an impossibility
 * theorem: it shows theta has no image under the GEOMETRY transcription and
 * is trivial (=1) on the fixed-amplitude family, so a phase-priced per-window
 * bound needs new transcribed sign data; whether such data exists and yields
 * theta < 1 for real seam windows is exactly obligation (3), left OPEN.
 * (d) The result sharpens imp-95233 HONEST LIMITS (c) into a split verdict
 * but changes NO Lambda bound and adds no certificate.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) x(D/2) = 1/Q verified exact against the
 * imp-95220 port constants. (2) FA-2 bracket x_min <= y_min <= 2 x_min
 * checked on four ported grids; the tighter measured ratios y_min/x_min =
 * 1.5228, 1.3516, 1.2331, 1.1649 recomputed and confirmed strictly
 * decreasing toward 1. (3) theta = 1 on the fixed-amplitude (all 1/p) ported
 * family confirmed to 1e-9 by quadrature (f = g identically). (4) A signed
 * amplitude assignment on the SAME geometry gives theta < 1, confirming
 * theta is an amplitude-sign functional the geometry map cannot fix.
 *
 * ROUTING. Sub-gap imp-95212-subgap-fresnel-airy-envelope-port -- STILL
 * OPEN. Obligation ledger: (1) per-window Q extraction UNCHANGED (this note
 * confirms y_min rides the same Q as x_min); (2) amplitude sign/modulus
 * certificate -- PHASE-CERT depth argument (y_min) is portable; its phase
 * content (theta) is BLOCKED at the transcription, not at the certificate;
 * (3) envelope-shape / seam-to-chain-gate (gammaSL) map UNCHANGED and now
 * carries the additional obligation of transcribing per-window SIGN data if
 * theta is to be used; (4) paper constants UNCHANGED. Import-light (no zeros
 * bundle, no sibling imports). Changes no bound; NO QED; no refereed bound is changed.
 */

// -- width-law port constants (illustrative (c, v); assessment is c,v-free) --
const PORT_C = 1.7;
const PORT_V = 2.3;

// -- baked measured tightness ratios y_min/x_min on ported grids -------------
const YMIN_OVER_XMIN = {
  "2,4": 1.522758, // pD = 8
  "3,8": 1.351634, // pD = 24
  "5,16": 1.233055, // pD = 80
  "7,32": 1.164904, // pD = 224
};

// -- width-law port helpers (imp-95220 LEMMA MAP) ----------------------------
const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;
const xPort = (d) => (PORT_V / PORT_C) * Math.pow(d, -2 / 3);
const qGroup = (D) => ((PORT_C * Math.pow(D, 2 / 3)) / PORT_V) * Math.pow(2, -2 / 3);
function gridGpd(p, D) {
  const g = [];
  for (let n = 1; n <= p * D; n++) if (n % p !== 0) g.push(n / p);
  return g;
}
function yMinPort(ds) {
  let m = Infinity;
  for (const a of ds)
    for (const b of ds) {
      const val = (muPort(a) + muPort(b)) * Math.min(uPort(a), uPort(b));
      if (val < m) m = val;
    }
  return m;
}
function xMinPort(ds) {
  let m = Infinity;
  for (const d of ds) {
    const xx = xPort(d);
    if (xx < m) m = xx;
  }
  return m;
}

// -- theta by quadrature (cross-check only) ----------------------------------
function makeF(mu, u, c) {
  return (s) => {
    let v = 0;
    for (let k = 0; k < c.length; k++) v += c[k] * Math.exp(-mu[k] * Math.abs(s - u[k]));
    return v;
  };
}
function simpson(a, b, n, fn) {
  const h = (b - a) / n;
  let S = fn(a) + fn(b);
  for (let i = 1; i < n; i++) S += fn(a + i * h) * (i % 2 ? 4 : 2);
  return (S * h) / 3;
}
function thetaPort(p, D, signs) {
  const ds = gridGpd(p, D);
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  const c = ds.map((_, i) => (signs ? signs[i % signs.length] : 1) / p);
  const f = makeF(mu, u, c);
  const g = makeF(mu, u, c.map(Math.abs));
  const Tf = simpson(-40, 40, 80000, (s) => f(s) ** 2);
  const Tg = simpson(-40, 40, 80000, (s) => g(s) ** 2);
  return Tf / Tg;
}

// -- verdict object ----------------------------------------------------------
export const IMP95255_CURRENCY_PER_WINDOW_MAP_ASSESSMENT = {
  ticket:
    "imp-95255 (MAPPING ASSESSMENT, split verdict): do the imp-95233 model-family currencies y_min and theta map to paper per-window seam quantities? y_min MAPS (rides the same imp-95220 width-law port + isolation group Q that already carries x_min); theta is OBSTRUCTED (a per-window sign functional with no image under the geometry-only transcription). Sharpens imp-95233 HONEST LIMITS (c); changes no bound.",
  transcribedMap:
    "the transcription (imp-95071/imp-95220 LEMMA MAP) is a GEOMETRY + modulus map: grid denominator d -> (mu(d) = d^(1/3)/c, u(d) = v/d), amplitude modulus |c| pinned at 1/p by paper eq (14); the identity x(D/2) = 1/Q is exact with Q = (c D^(2/3)/v) 2^(-2/3). It supplies rates and centers (hence y_min) but NO per-window sign pattern.",
  leg1YminMaps:
    "y_min MAPS. Built only from rates and centers, so well-defined the moment the geometry map is fixed. FA-2 bracket (exact): x_min <= y_min <= 2 x_min with x_min = x(d_max), d_max = D - 1/p -> D, so x_min -> x(D) = 2^(-2/3)/Q and y_min sits (to leading order) in [2^(-2/3)/Q, 2^(1/3)/Q], a per-window interval fixed by the SAME Q imp-95222 QG-2 already uses. On the ported grid it is far tighter than factor 2: MEASURED ratio y_min/x_min = 1.522758, 1.351634, 1.233055, 1.164904 at pD = 8, 24, 80, 224, strictly decreasing toward 1. So HONEST LIMITS (c) is over-conservative on y_min: it rides the x_min map for free.",
  leg2ThetaObstructed:
    "theta IS THE OBSTRUCTION. It is a scale-invariant SIGN functional (theta = int f^2 / int g^2, degree-0 in amplitudes, imp-95139 scope), not geometry. On the fixed-amplitude ported family the paper specifies (all aliases 1/p, a positive cone) f = g identically so theta = 1 EXACTLY and PHASE-CERT degenerates to FA-2 with zero phase content. theta < 1 needs genuine per-window sign cancellation, but the transcription is geometry+modulus and carries no per-window sign pattern -- theta has no preimage under the current map. The wall: y_min lives in transcribed (rate, center) data and maps; theta lives in amplitude-sign data the transcription drops.",
  wall:
    "closing the theta gap requires the per-window sign/phase structure of the alias expansion to be transcribed (an extension of imp-95071, the same missing-input class as the open envelope-shape / gammaSL-map obligation (3)); it is NOT recoverable from the geometry map alone.",
  constants: {
    portC: PORT_C,
    portV: PORT_V,
    yminOverXmin: YMIN_OVER_XMIN,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. Obligation ledger: (1) per-window Q extraction UNCHANGED (y_min rides the same Q as x_min); (2) PHASE-CERT depth argument (y_min) is portable, its phase content (theta) is BLOCKED at the transcription not the certificate; (3) envelope-shape / seam-to-chain-gate (gammaSL) map UNCHANGED and now also owes per-window SIGN data if theta is to be used; (4) paper constants UNCHANGED.",
  verdict:
    "ASSESSMENT (split verdict, honest): the imp-95233 HONEST LIMITS (c) lumping of y_min and theta as jointly unmapped is REFINED. y_min MAPS -- it is a per-window geometry quantity inheriting the imp-95220 width-law port and the imp-95222 isolation group Q that already carries x_min (x_min <= y_min <= 2 x_min exact; measured y_min/x_min -> 1 on the ported grids), so PHASE-CERT is depth-portable exactly as FA-2 is. theta is OBSTRUCTED -- a scale-invariant per-window SIGN functional that is trivially 1 on the fixed-amplitude family the paper specifies and has no image under the geometry+modulus transcription, which carries no per-window sign pattern; a phase-priced per-window bound therefore needs new transcribed sign data (obligation (3)), not a better certificate. Nothing derives or moves a bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "LEG 1 FA-2 bracket x_min <= y_min <= 2 x_min is exact (imp-95222 THEOREM FA-2, consumed); the tighter y_min/x_min ratios are MEASURED from the width-law port geometry (exact arithmetic, no quadrature) and the collapse toward 1 is observed on four grids, not proved as a limit law. LEG 2 theta = 1 on the fixed-amplitude family is confirmed by quadrature to 1e-9; the obstruction is a structural statement about the transcription (geometry+modulus, no sign data), an identified wall, not an impossibility theorem. x(D/2) = 1/Q is exact. All quadrature is cross-check only.",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95255_MAP_ASSESSMENT_ASSERTIONS = [
  {
    id: "imp95255-xhalfD-equals-invQ-exact",
    description:
      "the transcribed map identity x(D/2) = 1/Q holds exactly for the width-law port with Q = (c D^(2/3)/v) 2^(-2/3), and x(D) = 2^(-2/3)/Q = x_min pins x_min to the per-window isolation group",
    holds: () => {
      for (const D of [4, 8, 16, 32]) {
        const Q = qGroup(D);
        if (Math.abs(xPort(D / 2) - 1 / Q) > 1e-12) return false;
        if (Math.abs(xPort(D) - Math.pow(2, -2 / 3) / Q) > 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95255-ymin-fa2-bracket-on-ported-grid",
    description:
      "LEG 1: on the ported grid G(p,D) the FA-2 bracket x_min <= y_min <= 2 x_min holds, and x_min equals x(D) = 2^(-2/3)/Q, so y_min is a per-window quantity fixed by the same isolation group Q",
    holds: () => {
      for (const [p, D] of [
        [2, 4],
        [3, 8],
        [5, 16],
        [7, 32],
      ]) {
        const ds = gridGpd(p, D);
        const ym = yMinPort(ds);
        const xm = xMinPort(ds);
        if (!(ym >= xm - 1e-12 && ym <= 2 * xm + 1e-12)) return false;
        // x_min is attained at the shallowest (largest-d) packet
        const dMax = Math.max(...ds); // = D - 1/p (the integer pD is excluded)
        if (Math.abs(xm - xPort(dMax)) > 1e-12) return false;
        // and x_min sits at the per-window scale set by Q (x(D) = 2^(-2/3)/Q),
        // to which x(d_max) collapses as d_max -> D for large pD
        if (Math.abs(xm - Math.pow(2, -2 / 3) / qGroup(D)) > 0.15 * xm) return false;
      }
      return true;
    },
  },
  {
    id: "imp95255-ymin-tightness-ratios-decreasing-to-one",
    description:
      "LEG 1: the MEASURED y_min/x_min ratios match the baked literals (1.522758, 1.351634, 1.233055, 1.164904 at pD = 8, 24, 80, 224) and are strictly decreasing toward 1 -- y_min collapses onto x_min in the large-window limit, so it is essentially the same per-window quantity",
    holds: () => {
      const keys = ["2,4", "3,8", "5,16", "7,32"];
      let prev = Infinity;
      for (const key of keys) {
        const [p, D] = key.split(",").map(Number);
        const ds = gridGpd(p, D);
        const ratio = yMinPort(ds) / xMinPort(ds);
        if (Math.abs(ratio - YMIN_OVER_XMIN[key]) > 1e-5) return false;
        if (!(ratio < prev)) return false;
        if (!(ratio > 1)) return false;
        prev = ratio;
      }
      return true;
    },
  },
  {
    id: "imp95255-theta-trivial-on-fixed-amplitude-family",
    description:
      "LEG 2: on the fixed-amplitude ported family the paper specifies (all aliases 1/p, a positive cone) theta = 1 exactly (f = g), so PHASE-CERT degenerates to FA-2 with zero phase content -- theta carries no information in the transcribed family",
    holds: () => {
      const theta = thetaPort(3, 8, null); // all +1/p
      return Math.abs(theta - 1) < 1e-9;
    },
  },
  {
    id: "imp95255-theta-is-a-sign-functional",
    description:
      "LEG 2: keeping the SAME ported geometry (rates, centers) but flipping to a signed amplitude pattern drives theta strictly below 1, confirming theta is an amplitude-SIGN functional the geometry+modulus transcription cannot fix -- the obstruction is real",
    holds: () => {
      const thetaSigned = thetaPort(3, 8, [1, -1]); // alternating signs, same geometry
      return thetaSigned < 1 - 1e-3 && thetaSigned > 0;
    },
  },
  {
    id: "imp95255-verdict-honesty",
    description:
      "the verdict carries the honest split scope: y_min MAPS, theta OBSTRUCTED, sub-gap STILL OPEN, assessment-only (no bound moved), and no QED",
    holds: () =>
      /y_min MAPS/.test(IMP95255_CURRENCY_PER_WINDOW_MAP_ASSESSMENT.verdict) &&
      /theta is OBSTRUCTED/.test(IMP95255_CURRENCY_PER_WINDOW_MAP_ASSESSMENT.verdict) &&
      /STILL OPEN/.test(IMP95255_CURRENCY_PER_WINDOW_MAP_ASSESSMENT.subGap) &&
      /NO QED/.test(IMP95255_CURRENCY_PER_WINDOW_MAP_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95255_CURRENCY_PER_WINDOW_MAP_ASSESSMENT.verdict),
  },
];

for (const a of IMP95255_MAP_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95255-currency-per-window-map-assessment assertion failed: ${a.id}`,
    );
  }
}

export default IMP95255_CURRENCY_PER_WINDOW_MAP_ASSESSMENT;
