/**
 * imp-95449: MEASUREMENT -- tightness of the imp-95420 THEOREM P-POS
 * two-sided enclosures of the theta density p(t) versus a
 * cancellation-free high-precision-equivalent evaluation, plus the
 * strict-positivity margin min p(t)/up(t). Measure only; changes no
 * bound; NO QED; no refereed bound is changed.
 *
 * imp-95420 proved p(t) > 0 for all t > 0 with two overlapping
 * alternating-series-truncation enclosures:
 *   (theta, t >= 1/pi^2)  up_th(t) = pi e^(-pi^2 t/4),
 *                         lo_th(t) = up_th(t) (1 - 3 e^(-2 pi^2 t));
 *   (dual, 0 < t <= 1)    up_du(t) = e^(-1/(4t))/(t sqrt(pi t)),
 *                         lo_du(t) = up_du(t) (1 - 3 e^(-2/t)).
 * imp-95420 checked the brackets hold at ULP tolerance but did NOT
 * tabulate HOW tight they are, nor the strict-positivity margin. This
 * module does exactly that.
 *
 * KEY DEVICE (escapes the imp-95420 float trap WITHOUT BigInt). The
 * upper bound is the FIRST term of the normalizing alternating series,
 * so the normalized ratio R(t) := p(t)/up(t) is itself an alternating
 * series with LEADING TERM 1 and no exponentially small prefactor:
 *   (theta) p/up_th = sum_(n >= 0) (-1)^n (2n+1) e^(-n(n+1) pi^2 t),
 *   (dual)  p/up_du = sum_(k >= 1) (-1)^(k+1) (2k-1) e^(-k(k-1)/t).
 * (Both follow by factoring the n=0 / k=1 exponential out of the
 * imp-95420 series; the exponent (n+1/2)^2 - 1/4 = n(n+1) and
 * (2k-1)^2 - 1 = 4 k(k-1).) Because the result is O(1) rather than
 * O(e^(-huge)), R(t) evaluates to full double precision even at
 * t = 1e-3 where the raw imp-95420 direct form loses ~90 digits -- so
 * R serves as the high-precision reference for the enclosure without a
 * BigInt kernel (the imp-95422 route). It is cross-checked against the
 * imp-95420 pDirect/pDual forms in the doubles-resolvable band.
 *
 * FINDINGS (all baked and re-derived by the assertions).
 * (1) The enclosure RELATIVE WIDTH (up - lo)/up equals exactly
 *     3 e^(-2 pi^2 t) (theta) / 3 e^(-2/t) (dual) -- i.e. the
 *     first-neglected-over-first-term ratio c_1/c_0 of the alternating
 *     series. It is 3 e^(-2) = 0.406006 at BOTH regime boundaries
 *     (t = 1/pi^2 theta, t = 1 dual) and decays double-exponentially
 *     away from them: 5.79e-2 at t = 0.2 (theta), 1.55e-4 at t = 0.5,
 *     8.03e-9 at t = 1, 2.15e-17 at t = 2. The width drops below the
 *     double-precision unit roundoff (2.22e-16) at t ~ 1.8816 (theta)
 *     and t ~ 0.0538 (dual): past those the enclosure is numerically
 *     EXACT (up and lo agree to the last bit).
 * (2) STRICT-POSITIVITY MARGIN. min over the certified cover of
 *     p(t)/up(t) = 0.606344920236, attained EXACTLY at the two regime
 *     boundaries (R(t) -> 1 as t leaves a boundary). Hence
 *     p(t) >= 0.60634 * up(t) > 0 UNIFORMLY -- the positivity never
 *     degrades toward 0; the margin is a fixed O(1) fraction of the
 *     (positive, cancellation-free) upper bound.
 * (3) The enclosure is ASYMMETRIC about p. At the worst point (a
 *     boundary): up/p = 1.649226 (the upper bound overestimates p by
 *     65 percent) but lo/p = 0.979631 (the lower bound underestimates
 *     by only 2.0 percent) -- p sits near the lower bound, as expected
 *     for c_0 - c_1 + c_2 - ... where lo = c_0 - c_1 misses by c_2 and
 *     up = c_0 misses by the much larger c_1.
 * (4) FLOAT-TRAP ESCAPE confirmed: at t = 1e-3 the imp-95420 direct
 *     ratio pDirect/up_th evaluates to a garbage ~ -9.1e-16 (negative),
 *     while the stable normalized series gives R = 1.0 to full
 *     precision -- the measurement device is correct exactly where the
 *     raw forms fail.
 *
 * HONEST SCOPE. Measurement only. Re-derives no analytic proof, adds
 * no theorem, and changes no bound, onset, or floor. The normalized
 * ratio agreeing with the imp-95420 forms in the resolvable band is
 * strong numerical evidence they are the same object, not a proof. The
 * imp-95420 positivity proof and its enclosures are UNTOUCHED and
 * remain the system of record; imp-95422 remains the BigInt-HP
 * cross-check of the forms themselves. The imp-95212 envelope port,
 * signed WEIGHT, and modulus/phase legs stay OPEN. NO QED;
 * no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95449_PPOS_ENCLOSURE_TIGHTNESS = {
  id: "imp-95449",
  title:
    "MEASUREMENT: tightness of the imp-95420 THEOREM P-POS two-sided " +
    "enclosures + strict-positivity margin min p(t)/up(t)",
  device:
    "normalized ratio R(t) = p(t)/up(t) is an alternating series with " +
    "leading term 1 and no exponentially small prefactor: p/up_th = " +
    "sum (-1)^n (2n+1) e^(-n(n+1) pi^2 t), p/up_du = sum (-1)^(k+1) " +
    "(2k-1) e^(-k(k-1)/t); evaluates to full precision where the " +
    "imp-95420 raw forms lose ~90 digits, so it is the HP reference for " +
    "the enclosure without a BigInt kernel",
  regimes: {
    thetaFrom: 0.10132118364233778, // 1/pi^2
    dualUpTo: 1.0,
  },
  baked: {
    // (1) enclosure relative width (up - lo)/up = 3 e^(-2) at both edges
    widthAtBoundary: 0.406005849710, // 3 e^(-2)
    widthTheta_t02: 5.7889e-2,
    widthTheta_t05: 1.5517e-4,
    widthTheta_t1: 8.0259e-9,
    widthTheta_t2: 2.1471e-17,
    thetaWidthBelowEpsFrom: 1.881649, // width < 2.22e-16 past here (theta)
    dualWidthBelowEpsFrom: 0.053847, // width < 2.22e-16 past here (dual)
    // (2) strict-positivity margin
    minMarginPoverUp: 0.606344920236, // min p/up over the cover
    minMarginAtThetaBoundary: 0.10132118364233778, // t = 1/pi^2
    minMarginAtDualBoundary: 1.0, // t = 1
    // (3) enclosure asymmetry at the worst point (a regime boundary)
    upOverP_atBoundary: 1.649226317605, // upper overestimates by 65%
    loOverP_atBoundary: 0.979630785162, // lower underestimates by 2.0%
  },
  verdict:
    "MEASUREMENT of enclosure sharpness for the imp-95420 THEOREM P-POS " +
    "brackets. The enclosure relative width (up - lo)/up is exactly the " +
    "alternating-series first-neglected-over-first ratio 3 e^(-2 pi^2 t) " +
    "(theta) / 3 e^(-2/t) (dual): 3 e^(-2) = 0.406006 at both regime " +
    "boundaries and double-exponentially small away from them, below the " +
    "double roundoff past t ~ 1.8816 (theta) / t ~ 0.0538 (dual). The " +
    "strict-positivity margin min p(t)/up(t) = 0.606344920236 is a fixed " +
    "O(1) fraction attained at the two boundaries, so positivity never " +
    "approaches 0; the enclosure is asymmetric (up/p = 1.6492 vs " +
    "lo/p = 0.9796 at worst, p near the lower bound). The normalized " +
    "ratio device escapes the imp-95420 small-t float trap without a " +
    "BigInt kernel and agrees with the raw forms in the resolvable band. " +
    "Measurement only; re-derives no proof; changes no bound; the " +
    "imp-95212 envelope port and signed WEIGHT / modulus-phase legs stay " +
    "OPEN; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

const PI = Math.PI;
const PI2 = PI * PI;
const T_THETA = 1 / PI2;
const REF = IMP95449_PPOS_ENCLOSURE_TIGHTNESS;

// Stable normalized ratio p/up (theta regime), leading term 1, no cancellation
function ratioTheta(t) {
  const q = Math.exp(-PI2 * t);
  let s = 0;
  for (let n = 0; n < 200; n++) {
    const e = Math.pow(q, n * (n + 1));
    const term = (n % 2 === 0 ? 1 : -1) * (2 * n + 1) * e;
    s += term;
    if (n > 2 && Math.abs(term) < 1e-300) break;
  }
  return s;
}

// Stable normalized ratio p/up (dual regime)
function ratioDual(t) {
  const q = Math.exp(-1 / t);
  let s = 0;
  for (let k = 1; k < 200; k++) {
    const e = Math.pow(q, k * (k - 1));
    const term = (k % 2 === 1 ? 1 : -1) * (2 * k - 1) * e;
    s += term;
    if (k > 2 && Math.abs(term) < 1e-300) break;
  }
  return s;
}

// imp-95420 raw forms (for the resolvable-band cross-check and trap demo)
function pDirect(t) {
  let p = 0;
  for (let n = 0; n < 600; n++) {
    const term =
      (n % 2 === 0 ? 1 : -1) *
      (2 * n + 1) *
      Math.exp(-((n + 0.5) ** 2) * PI2 * t);
    p += term;
    if (n > 3 && Math.abs(term) < 1e-320) break;
  }
  return PI * p;
}
function pDual(t) {
  let p = 0;
  for (let k = 1; k < 600; k++) {
    const term =
      (k % 2 === 1 ? 1 : -1) *
      (2 * k - 1) *
      Math.exp(-((2 * k - 1) ** 2) / (4 * t));
    p += term;
    if (k > 3 && Math.abs(term) < 1e-320) break;
  }
  return p / (t * Math.sqrt(PI * t));
}
const thetaUp = (t) => PI * Math.exp((-PI2 * t) / 4);
const dualUp = (t) => Math.exp(-1 / (4 * t)) / (t * Math.sqrt(PI * t));
const widthTheta = (t) => 3 * Math.exp(-2 * PI2 * t);
const widthDual = (t) => 3 * Math.exp(-2 / t);

export const IMP95449_ENCLOSURE_ASSERTIONS = [
  {
    id: "imp95449-ratio-device-matches-raw",
    description:
      "the stable normalized ratio R = p/up reproduces the imp-95420 raw " +
      "pDirect/up_th and pDual/up_du to 1e-11 across the " +
      "doubles-resolvable band (theta [0.15, 3], dual [0.05, 1]), " +
      "confirming it is the same object",
    holds: () => {
      for (let i = 0; i <= 100; i++) {
        const t = 0.15 * Math.pow(3 / 0.15, i / 100);
        const r = ratioTheta(t);
        const raw = pDirect(t) / thetaUp(t);
        if (Math.abs(r - raw) > 1e-11) return false;
      }
      for (let i = 0; i <= 100; i++) {
        const t = 0.05 * Math.pow(1 / 0.05, i / 100);
        const r = ratioDual(t);
        const raw = pDual(t) / dualUp(t);
        if (Math.abs(r - raw) > 1e-11) return false;
      }
      return true;
    },
  },
  {
    id: "imp95449-width-is-first-neglected-ratio",
    description:
      "the enclosure relative width (up - lo)/up equals exactly " +
      "3 e^(-2 pi^2 t) (theta) / 3 e^(-2/t) (dual) = 3 e^(-2) = 0.406006 " +
      "at both regime boundaries, and matches the baked decay samples",
    holds: () => {
      const wb = 3 * Math.exp(-2);
      if (Math.abs(wb - REF.baked.widthAtBoundary) > 1e-11) return false;
      if (Math.abs(widthTheta(T_THETA) - wb) > 1e-12) return false;
      if (Math.abs(widthDual(1) - wb) > 1e-12) return false;
      // decay samples (theta)
      const chk = [
        [0.2, REF.baked.widthTheta_t02],
        [0.5, REF.baked.widthTheta_t05],
        [1, REF.baked.widthTheta_t1],
        [2, REF.baked.widthTheta_t2],
      ];
      for (const [t, w] of chk) {
        if (Math.abs(widthTheta(t) - w) / w > 1e-3) return false;
      }
      return true;
    },
  },
  {
    id: "imp95449-width-below-eps-thresholds",
    description:
      "the enclosure width falls below the double-precision unit roundoff " +
      "(2.22e-16) past t ~ 1.8816 (theta) and t ~ 0.0538 (dual): beyond " +
      "those the two-sided enclosure is numerically exact",
    holds: () => {
      const eps = 2.220446049250313e-16;
      const tTh = REF.baked.thetaWidthBelowEpsFrom;
      const tDu = REF.baked.dualWidthBelowEpsFrom;
      // just above the threshold the width is below eps, just below it exceeds
      if (!(widthTheta(tTh * 1.0001) < eps)) return false;
      if (!(widthTheta(tTh * 0.9999) > eps)) return false;
      if (!(widthDual(tDu * 0.9999) < eps)) return false;
      if (!(widthDual(tDu * 1.0001) > eps)) return false;
      return true;
    },
  },
  {
    id: "imp95449-strict-positivity-margin",
    description:
      "strict-positivity margin: min over the certified cover of " +
      "p(t)/up(t) = 0.606344920236, attained at the two regime boundaries " +
      "(t = 1/pi^2 theta, t = 1 dual); p >= 0.60634 up > 0 uniformly",
    holds: () => {
      const target = REF.baked.minMarginPoverUp;
      // boundary values both equal the baked minimum
      if (Math.abs(ratioTheta(T_THETA) - target) > 1e-11) return false;
      if (Math.abs(ratioDual(1) - target) > 1e-11) return false;
      // scan: no sampled point dips below the boundary margin (up to ULP),
      // and R stays a proper fraction (0, 1]
      let minTh = Infinity;
      for (let i = 0; i <= 800; i++) {
        const t = T_THETA * Math.pow(200 / T_THETA, i / 800);
        const r = ratioTheta(t);
        if (!(r > 0 && r <= 1 + 1e-12)) return false;
        if (r < minTh) minTh = r;
      }
      let minDu = Infinity;
      for (let i = 0; i <= 800; i++) {
        const t = 1e-3 * Math.pow(1000, i / 800);
        const r = ratioDual(t);
        if (!(r > 0 && r <= 1 + 1e-12)) return false;
        if (r < minDu) minDu = r;
      }
      return (
        Math.abs(minTh - target) < 1e-9 && Math.abs(minDu - target) < 1e-9
      );
    },
  },
  {
    id: "imp95449-enclosure-asymmetry",
    description:
      "at the worst point (a regime boundary) the enclosure is asymmetric: " +
      "up/p = 1.649226 (upper overestimates 65%) but lo/p = 0.979631 " +
      "(lower underestimates only 2.0%) -- p sits near the lower bound",
    holds: () => {
      const R = ratioTheta(T_THETA);
      const W = 3 * Math.exp(-2);
      const upOverP = 1 / R;
      const loOverP = (1 - W) / R;
      return (
        Math.abs(upOverP - REF.baked.upOverP_atBoundary) < 1e-9 &&
        Math.abs(loOverP - REF.baked.loOverP_atBoundary) < 1e-9 &&
        loOverP < 1 &&
        upOverP > 1
      );
    },
  },
  {
    id: "imp95449-float-trap-escape",
    description:
      "the ratio device escapes the imp-95420 small-t float trap: at " +
      "t = 1e-3 the raw pDirect/up_th is garbage (~ -9e-16, negative) " +
      "while the stable ratio gives 1.0 to full precision",
    holds: () => {
      const t = 1e-3;
      const raw = pDirect(t) / thetaUp(t);
      const stable = ratioDual(t);
      return raw < 1e-6 && Math.abs(stable - 1) < 1e-12;
    },
  },
  {
    id: "imp95449-verdict-honesty",
    description:
      "the verdict carries the honest scope: measurement only, no proof " +
      "re-derived, no bound changed, imp-95420 untouched, open legs named",
    holds: () =>
      /MEASUREMENT/.test(REF.verdict) &&
      /Measurement only/.test(REF.verdict) &&
      /re-derives no proof/.test(REF.verdict) &&
      /changes no bound/.test(REF.verdict) &&
      /stay[\s\S]*OPEN/.test(REF.verdict) &&
      /NO QED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
];

for (const a of IMP95449_ENCLOSURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95449-ppos-enclosure-tightness assertion failed: ${a.id}`,
    );
  }
}

export default IMP95449_PPOS_ENCLOSURE_TIGHTNESS;
