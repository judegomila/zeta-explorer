/**
 * imp-95135: MEASUREMENT of sup R inside the imp-95225 open corridor
 * 1.4427 x < N < 11.6893 x, to record which of the two frontiers can be
 * tightened. Measurement only; no bound is claimed and no Lambda changes.
 *
 * Setup (imp-95221..95226). Co-centered signed packets at common center
 * delta collapse (LEMMA SEG-N) to an exponential sum, and
 *   R = int_(s<0) f^2 / int_R f^2,   x = m delta,   y_min = 2 delta.
 * Two frontiers bracket the count-priced regime:
 *   (LEFT, certificate vacuity) imp-95225 PROP C-VAC: the SGN-C bound
 *     B(N, x, K) >= 2^(N-1) e^(-x), so the certificate is vacuous (bound
 *     >= 1) once N >= 1 + x/ln 2 = 1 + 1.4427 x.
 *   (RIGHT, saturation) imp-95224 THEOREM SGN-SAT: the explicit family
 *     phi_K(t) = e^(-t)(1 - e^(-t/K))^K (K+1 distinct rates in [1, 2],
 *     co-centered at delta = x with m = 1) has R >= (1/2)(1 - eps_K),
 *     eps_K = (x/K)(x e^2 / (K(1 - 1/e)))^(2K), which the SUFFICIENT
 *     condition eps_K -> 0 forces small only once K > 11.6893 x.
 * imp-95225 PROP C-VAC recorded the intervening band 1.4427 x < N <
 * 11.6893 x (factor 8.1) as OPEN on both sides.
 *
 * WHAT IS MEASURED. R(phi_K, x) is evaluated directly from the
 * cancellation-free form phi_K(t) = e^(-t)(1 - e^(-t/K))^K by Simpson
 * quadrature of int_(0,inf) phi_K^2 and int_(delta,inf) phi_K^2 (delta = x,
 * m = 1). This is the stable evaluation: the alternating-coefficient
 * expansion phi_K = sum_j (-1)^j C(K,j) e^(-(1+j/K)t) loses all digits by
 * K ~ 9 (the imp-95224/95225 recorded double-precision TRAP), so the
 * coefficient sum is NOT used. Because SGN-SAT proves sup R = 1/2 for
 * co-centered signed families (the hard symmetry ceiling, W < T/2 strictly),
 * R(phi_K, x) is an achievability LOWER bound on sup R whose limit is the
 * sup itself; the N at which R(phi_K, x) first comes within a fixed
 * tolerance of 1/2 is therefore an UPPER bound on the true saturation onset.
 *
 * FINDING (which side moves). The measured saturation onset sits far below
 * the crude sufficient frontier 11.6893 x:
 *   N*(tol 1e-3) = 6, 8, 10, 13, 15, 17 at x = 1..6  (Nstar/x = 6.0 down to 2.83)
 *   N*(tol 1e-6) = 8, 11, 14         at x = 1, 2, 3   (Nstar/x = 8.0, 5.5, 4.67)
 *   N*(tol 1e-9) = 10, 14, 17        at x = 1, 2, 3   (Nstar/x = 10.0, 7.0, 5.67)
 * so R(phi_K, x) is already within 1e-3 of the 1/2 ceiling by N ~ 2.2 x + 4
 * (Nstar/x DECREASING in x toward ~2.8), versus the 11.6893 x sufficient
 * constant. The 11.6893 x figure is an artifact of the elementary eps_K
 * fence, not the true onset: the RIGHT frontier moves DOWN by roughly a
 * factor of 3-4. The LEFT frontier is comparatively tight -- just above
 * the vacuity threshold ceil(1.4427 x) the measured R is still well under
 * 1/2 (at x = 3, the first corridor row N = 5 has R = 0.2548), so a sharper
 * certificate has only a modest band to gain before R climbs to the ceiling.
 * Net: the genuinely open band collapses from factor 8.1 to roughly factor 2
 * (about [1.4427 x, ~2.8 x]); the movable side is the saturation (right) one.
 *
 * CROSS-CHECK. The quadrature reproduces the imp-95224 checkpoint
 * R(phi_8, x=1) = 1/2 - 7.5585e-9 exactly. R(phi_K, x) is monotone
 * increasing in K and strictly below 1/2 on the reliable range (K <= 12),
 * consistent with THEOREM SGN-SAT.
 *
 * HONEST LIMITS. (a) sup R is probed through the single SGN-SAT family; a
 * different co-centered family could reach within tolerance of 1/2 at an
 * even smaller N, so the measured onsets are UPPER bounds on the true
 * saturation onset -- which only strengthens "the right frontier moves
 * down". (b) The left (certificate) frontier 1.4427 x is a hard property of
 * the SGN-C bound B, not of sup R; the measurement shows there is room above
 * it but proving a certificate that bites there is a separate open task
 * (imp-95212 obligation (2), still open). (c) Tolerance-defined onsets: R
 * approaches 1/2 but is never equal (strict symmetry ceiling), so N* depends
 * on the chosen tolerance; three tolerances are reported. (d) Model-family
 * measurement; no bound changes, no QED, no refereed bound is changed.
 *
 * Import-light (no zeros bundle, no sibling imports); self-executing
 * assertions recompute every baked number. Sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port stays OPEN.
 */

// ── frontier constants (imp-95225 PROP C-VAC / imp-95224 SGN-SAT) ─────────────
const VAC_SLOPE = 1.442695040889; // 1/ln 2: certificate vacuous once N >= 1 + 1.4427 x
const SAT_SLOPE = 11.6893; // crude sufficient K for eps_K -> 0

// ── measured saturation onsets N*(x) = min N with 1/2 - R(phi_(N-1), x) < tol ─
const ONSET_1EM3 = [6, 8, 10, 13, 15, 17]; // x = 1..6
const ONSET_1EM6 = [8, 11, 14]; // x = 1, 2, 3
const ONSET_1EM9 = [10, 14, 17]; // x = 1, 2, 3
const SAT_CHECK_GAP = 7.5585e-9; // 1/2 - R(phi_8, x=1), the imp-95224 checkpoint
const FIRST_CORRIDOR_R_X3 = 0.2548025646; // R(phi_4, x=3): first corridor row at x = 3

// ── stable quadrature of R(phi_K, delta) ──────────────────────────────────────
function phiSq(t, K) {
  const v = Math.exp(-t) * Math.pow(1 - Math.exp(-t / K), K);
  return v * v;
}
function integ(A, Tmax, n, K) {
  const h = (Tmax - A) / n;
  let s = phiSq(A, K) + phiSq(Tmax, K);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * phiSq(A + i * h, K);
  return (s * h) / 3;
}
// R = int_(delta,inf) phi^2 / (2 int_(0,inf) phi^2); delta = x since m = 1.
export function satR(K, x, n, Tmax) {
  const nn = n || 8000;
  const tm = Tmax || 45;
  return integ(x, tm, nn, K) / (2 * integ(0, tm, nn, K));
}
export function onsetN(x, tol) {
  for (let K = 2; K <= Math.ceil(SAT_SLOPE * x) + 2; K++) {
    if (0.5 - satR(K, x) < tol) return K + 1; // N = K + 1 distinct rates
  }
  return Infinity;
}

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95135_CORRIDOR_SUP_R_MEASUREMENT = {
  ticket:
    "imp-95135 (measure sup R inside the imp-95225 open corridor 1.4427 x < N < 11.6893 x to record which frontier can be tightened; measurement only, no bound claimed)",
  setup:
    "co-centered signed packets at center delta collapse (LEMMA SEG-N) to an exponential sum with R = int_(s<0) f^2 / int_R f^2, x = m delta, y_min = 2 delta; the SGN-SAT family phi_K(t) = e^(-t)(1 - e^(-t/K))^K (K+1 distinct rates, m = 1, delta = x) achieves R -> 1/2, the hard co-centered symmetry ceiling.",
  method:
    "R(phi_K, x) evaluated from the cancellation-free form by Simpson quadrature of int phi_K^2 (the alternating-coefficient expansion loses all digits by K ~ 9, the recorded double-precision trap, so it is not used); N* = smallest N = K+1 with 1/2 - R within tolerance of the ceiling. Because sup R = 1/2 for co-centered signed families, R(phi_K, x) lower-bounds sup R and N* upper-bounds the true saturation onset.",
  finding:
    "the measured saturation onset sits far below the crude sufficient frontier 11.6893 x: N*(tol 1e-3) = 6, 8, 10, 13, 15, 17 at x = 1..6 (N*/x = 6.0 down to 2.83), N*(tol 1e-6) = 8, 11, 14 and N*(tol 1e-9) = 10, 14, 17 at x = 1, 2, 3. R is within 1e-3 of 1/2 by N ~ 2.2 x + 4, N*/x decreasing toward ~2.8 -- the 11.6893 x figure is an eps_K-fence artifact, not the onset. The RIGHT (saturation) frontier moves DOWN by a factor ~3-4; the LEFT (certificate vacuity, 1.4427 x) frontier is comparatively tight (at x = 3 the first corridor row N = 5 has R = 0.2548). The genuinely open band collapses from factor 8.1 to roughly factor 2.",
  crossCheck:
    "the quadrature reproduces the imp-95224 checkpoint R(phi_8, x=1) = 1/2 - 7.5585e-9 exactly, and R(phi_K, x) is monotone increasing in K and strictly below 1/2 on the reliable range K <= 12, consistent with THEOREM SGN-SAT.",
  constants: {
    vacSlope: VAC_SLOPE,
    satSlope: SAT_SLOPE,
    onset1em3: ONSET_1EM3,
    onset1em6: ONSET_1EM6,
    onset1em9: ONSET_1EM9,
    satCheckGap: SAT_CHECK_GAP,
    firstCorridorRatX3: FIRST_CORRIDOR_R_X3,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. This is a measurement, not a certificate: obligation (2) (a signed certificate that bites in the corridor) is UNCHANGED. What the measurement records: the SGN-SAT saturation frontier 11.6893 x is loose (measured onset ~2.8 x at large x), so the RIGHT side of the corridor moves down; the certificate vacuity frontier 1.4427 x has a modest band above it before sup R reaches 1/2, so a sharper certificate could in principle gain there. The measured onsets are UPPER bounds on the true saturation onset (probed via one family), which only strengthens the right-side movement.",
  verdict:
    "MEASUREMENT (no bound): sup R inside the imp-95225 corridor 1.4427 x < N < 11.6893 x, probed via the SGN-SAT achievability family phi_K whose limit is the co-centered ceiling 1/2. The saturation onset is measured far below the crude 11.6893 x sufficient frontier (N*(1e-3) = 6, 8, 10, 13, 15, 17 at x = 1..6, N*/x decreasing toward ~2.8), so the RIGHT frontier is the loose one and moves down by a factor ~3-4; the LEFT certificate-vacuity frontier 1.4427 x is comparatively tight, with only a modest band above it before R climbs to 1/2. The open band collapses from factor 8.1 to roughly factor 2. The quadrature reproduces the imp-95224 checkpoint 1/2 - 7.5585e-9 exactly. HONEST: onsets are tolerance-defined and are upper bounds on the true onset (single-family probe); the left frontier is a property of the SGN-C bound, and proving a certificate that bites above it stays open (imp-95212 obligation (2)); no bound changed, NO QED, no refereed bound is changed.",
};

// ── assertions (self-executing; import-light; THROW on violation) ─────────────
export const IMP95135_MEASUREMENT_ASSERTIONS = [
  {
    id: "imp95135-sgn-sat-checkpoint",
    description:
      "the stable quadrature reproduces the imp-95224 checkpoint R(phi_8, x=1) = 1/2 - 7.5585e-9 (the alternating-coefficient form would lose all digits here; the direct phi_K form does not)",
    holds: () => {
      const gap = 0.5 - satR(8, 1);
      return Math.abs(gap - SAT_CHECK_GAP) < 5e-11 && gap > 0;
    },
  },
  {
    id: "imp95135-onset-below-sufficient-frontier",
    description:
      "the measured saturation onsets N*(1e-3) at x = 1..6 reproduce [6,8,10,13,15,17] and every one lies far below the crude sufficient frontier 11.6893 x (the right frontier moves down); N*/x is decreasing in x",
    holds: () => {
      let prevRatio = Infinity;
      for (let i = 0; i < 6; i++) {
        const x = i + 1;
        const N = onsetN(x, 1e-3);
        if (N !== ONSET_1EM3[i]) return false;
        if (!(N < SAT_SLOPE * x)) return false;
        const ratio = N / x;
        if (!(ratio <= prevRatio + 1e-12)) return false;
        prevRatio = ratio;
      }
      return true;
    },
  },
  {
    id: "imp95135-tighter-tolerance-onsets",
    description:
      "at x = 1, 2, 3 the tighter onsets reproduce N*(1e-6) = [8,11,14] and N*(1e-9) = [10,14,17], all still below 11.6893 x -- the saturation onset stays well inside the corridor even at 1e-9",
    holds: () => {
      for (let i = 0; i < 3; i++) {
        const x = i + 1;
        if (onsetN(x, 1e-6) !== ONSET_1EM6[i]) return false;
        if (onsetN(x, 1e-9) !== ONSET_1EM9[i]) return false;
        if (!(ONSET_1EM9[i] < SAT_SLOPE * x)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95135-monotone-below-ceiling",
    description:
      "R(phi_K, x=1) is strictly increasing in K and strictly below the 1/2 co-centered symmetry ceiling on the reliable range K = 2..12 (consistent with THEOREM SGN-SAT: W < T/2)",
    holds: () => {
      let prev = -Infinity;
      for (let K = 2; K <= 12; K++) {
        const R = satR(K, 1);
        if (!(R > prev)) return false;
        if (!(R < 0.5)) return false;
        prev = R;
      }
      return true;
    },
  },
  {
    id: "imp95135-left-frontier-band",
    description:
      "the LEFT frontier is comparatively tight: at x = 3 the first corridor row N = 5 (K = 4, just above ceil(1.4427*3) = 5) has R = 0.2548, well below 1/2, so a modest band remains above the certificate-vacuity frontier before sup R reaches the ceiling",
    holds: () => {
      const firstN = Math.ceil(VAC_SLOPE * 3); // = 5
      if (firstN !== 5) return false;
      const R = satR(firstN - 1, 3); // K = N - 1 = 4
      return (
        Math.abs(R - FIRST_CORRIDOR_R_X3) < 1e-6 && R > 0.2 && R < 0.3
      );
    },
  },
  {
    id: "imp95135-verdict-honesty",
    description:
      "the verdict records measurement-only scope: sub-gap STILL OPEN, no bound changed, the onsets are upper bounds (single-family probe), the corridor narrows, NO QED, no refereed bound is changed",
    holds: () =>
      /STILL OPEN/.test(IMP95135_CORRIDOR_SUP_R_MEASUREMENT.subGap) &&
      /UPPER bounds/.test(IMP95135_CORRIDOR_SUP_R_MEASUREMENT.subGap) &&
      /MEASUREMENT \(no bound\)/.test(
        IMP95135_CORRIDOR_SUP_R_MEASUREMENT.verdict,
      ) &&
      /right frontier is the loose one/i.test(
        IMP95135_CORRIDOR_SUP_R_MEASUREMENT.verdict,
      ) &&
      /NO QED/.test(IMP95135_CORRIDOR_SUP_R_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95135_CORRIDOR_SUP_R_MEASUREMENT.verdict),
  },
];

for (const a of IMP95135_MEASUREMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95135-corridor-sup-r-measurement assertion failed: ${a.id}`,
    );
  }
}

export default IMP95135_CORRIDOR_SUP_R_MEASUREMENT;
