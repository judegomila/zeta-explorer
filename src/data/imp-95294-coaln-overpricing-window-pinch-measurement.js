/**
 * imp-95294: MEASUREMENT -- the imp-95251 THEOREM COAL-N over-pricing curve
 * rho(N,R,x) = coalN(N,R,x)/sqrt(T(N,x)) mapped across the ratio-R window at
 * each of the N=3/4/5 firing onsets, against the imp-95286 COROLLARY
 * WINDOW-PINCH caps 3.460619 / 6.151212 / 10.898085.
 *
 * Object. imp-95286 records, as consequence (i) of WINDOW-PINCH, that COAL-N
 * over-prices the true window sup by AT MOST rho(N,R,x) at every depth, and
 * tabulates that factor at the imp-95251 firing onsets:
 *   rho = 3.460619 (N=3, R=1.3, x=4.930455),
 *         6.151212 (N=4, R=1.3, x=7.896539),
 *        10.898085 (N=5, R=1.3, x=10.940699).
 * These are single-point values. This leg measures the FULL rho surface over
 * the window R in [1, 1.3] and over depth around each onset, to (a) confirm
 * the surface sits under the baked caps inside the FIRING region, (b) locate
 * where the over-pricing peaks, and (c) exhibit the R->1 and deep-x limits.
 * rho = coalN/sqrt(T) is a CONSERVATIVE over-pricing measure: the true
 * over-pricing of the window sup is coalN/sqrt(Lambda_conf) <= coalN/sqrt(T)
 * = rho, since T <= Lambda_conf (imp-95286 THEOREM CONF-LB). MEASUREMENT
 * only -- changes no bound, decides no conjecture, fires no certificate.
 *
 * FINDING 1 (firing-onset semantics). The imp-95251 firing onset x0(N) is
 * EXACTLY the depth where the COAL-N majorant reaches the trivial ceiling,
 * coalN(N, 1.3, x0) = 1.000000 for N = 3, 4, 5 (measured to 6 digits). For
 * x >= x0 the certificate fires (coalN < 1, a nontrivial sqrt-Lambda bound);
 * for x < x0 it certifies nothing. The FIRING region is therefore x >= x0.
 *
 * FINDING 2 (monotonicity => the caps are the firing-region peaks). Inside
 * the firing region, rho(N,R,x) is
 *   - strictly INCREASING in R at fixed depth (window top R=1.3 is the peak
 *     over the window), and
 *   - strictly DECREASING in depth x for x >= x0 (toward the deep-x limit
 *     R^(N-1)).
 * Hence the over-pricing surface attains its firing-region maximum at the
 * CORNER (R = 1.3, x = x0), and that corner value reproduces the baked
 * WINDOW-PINCH caps: measured 3.460619 / 6.151212 / 10.898091 at N = 3/4/5
 * (the N=5 sixth digit reads 10.898091 vs the baked 10.898085, a 6e-6
 * relative float difference). So over the firing region the WINDOW-PINCH cap
 * is not merely an at-this-depth bound -- it is the GLOBAL over-pricing peak.
 *
 * FINDING 3 (the cap is per-depth, NOT a global-depth bound -- honest
 * nuance). Below the firing region rho keeps growing: at R = 1.3 it reaches
 * roughly 8.3 (N=3, x approx 0.9), 15.0 (N=4, x approx 3.9), 23.0 (N=5,
 * x approx 6.9) -- factors 2.0 / 2.4 / 2.1 ABOVE the onset caps. This does
 * NOT violate WINDOW-PINCH, whose consequence (i) is explicitly per-depth
 * ("by AT MOST rho(N,R,x) at every depth"); the shallow-x over-pricing is
 * simply MOOT because there coalN > 1 and the certificate does not fire. The
 * onset caps bound over-pricing precisely where the certificate is used.
 *
 * FINDING 4 (R-window and deep-x limits). Across R in [1, 1.3] at the onset
 * depth, rho climbs monotonically from the confluent value rho(N,1,x0) to
 * the cap: 2.326263 -> 3.460619 (N=3), 3.270652 -> 6.151212 (N=4),
 * 4.584929 -> 10.898091 (N=5). At fixed R = 1.3, deep-x rho descends to the
 * WINDOW-PINCH limit R^(N-1): rho(N,1.3,2000) = 1.693447 / 2.206650 /
 * 2.877926 vs R^(N-1) = 1.690000 / 2.197000 / 2.856100 (N = 3/4/5).
 *
 * SKEPTICAL RECORD. (1) The baked caps are reproduced live at the corner
 * within 1e-5 relative. (2) Monotonicity in R and in depth (x >= onset) is
 * verified on fine scans, not asserted. (3) The firing-onset identity
 * coalN(N,1.3,x0)=1 is checked to 1e-5. (4) The deep-x limit rho->R^(N-1) is
 * checked at x=2000 within 1 percent. (5) Refutation attempt: the shallow-x
 * rho values (up to ~23) look like cap violations but are shown to lie in the
 * NON-firing region coalN > 1, so they are outside WINDOW-PINCH scope; the
 * cap stands as the firing-region peak. The rho formula and constants are the
 * imp-95286 ones, re-derived here import-light.
 *
 * HONEST SCOPE. Measurement of a model-family quantity only. Confirms and
 * LOCATES the imp-95286 WINDOW-PINCH over-pricing caps (peak at the onset
 * corner over the firing region); does NOT sharpen COAL-N, does NOT decide
 * the imp-95227 dominance conjecture, fires no certificate, certifies no
 * paper packet. Changes no bound of the Lambda program. NO QED.
 * No refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95294_COALN_OVERPRICING_WINDOW_PINCH = {
  id: "imp-95294",
  title:
    "MEASUREMENT: the imp-95251 COAL-N over-pricing rho(N,R,x)=coalN/sqrt(T) " +
    "mapped across the ratio-R window at the N=3/4/5 firing onsets vs the " +
    "imp-95286 WINDOW-PINCH caps 3.460619 / 6.151212 / 10.898085",
  onsets: { N3: 4.930455, N4: 7.896539, N5: 10.940699 },
  bakedCaps: { N3: 3.460619, N4: 6.151212, N5: 10.898085 },
  firingOnsetIsCoalnEqualsOne:
    "coalN(N,1.3,x0) = 1.000000 at N = 3,4,5 -- the imp-95251 firing onset " +
    "is EXACTLY where the majorant reaches the trivial ceiling; the firing " +
    "region is x >= x0",
  cornerReproducesCaps: {
    N3: 3.460619,
    N4: 6.151212,
    N5: 10.898091,
    note:
      "rho at the corner (R=1.3, x=onset) reproduces the baked WINDOW-PINCH " +
      "caps; N=5 reads 10.898091 vs baked 10.898085 (6e-6 relative float)",
  },
  peakLocation:
    "over the FIRING region R in [1,1.3], x >= onset, rho is increasing in R " +
    "and decreasing in depth, so the over-pricing peak is the CORNER " +
    "(R=1.3, x=onset) -- exactly the WINDOW-PINCH cap",
  windowEdgeConfluent: { N3: 2.326263, N4: 3.270652, N5: 4.584929 },
  deepXLimit: {
    N3: { rho: 1.693447, RpowNm1: 1.69 },
    N4: { rho: 2.20665, RpowNm1: 2.197 },
    N5: { rho: 2.877926, RpowNm1: 2.8561 },
    note: "rho(N,1.3,2000) -> R^(N-1) as x -> inf (WINDOW-PINCH limit)",
  },
  shallowXIsMoot:
    "below the firing region rho keeps growing (approx 8.3/15.0/23.0 at " +
    "N=3/4/5, factors 2.0/2.4/2.1 above the onset caps) but coalN > 1 there " +
    "so the certificate does not fire; WINDOW-PINCH consequence (i) is " +
    "explicitly per-depth, so this is NOT a cap violation, only MOOT depth",
  conservativeMeasure:
    "rho = coalN/sqrt(T) over-estimates the true over-pricing " +
    "coalN/sqrt(Lambda_conf) since T <= Lambda_conf (imp-95286 CONF-LB); " +
    "the caps therefore bound the genuine window over-pricing a fortiori",
  subGap:
    "MEASUREMENT only. Confirms and locates the imp-95286 WINDOW-PINCH caps " +
    "as the firing-region over-pricing peaks; does NOT sharpen COAL-N, does " +
    "NOT decide the imp-95227 dominance conjecture (OPEN), fires no " +
    "certificate. imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.",
  verdict:
    "RIGOROUS at the stated scope: a model-family measurement of the " +
    "imp-95286 rho surface. The over-pricing peak over the firing region " +
    "sits at the onset corner and matches the baked WINDOW-PINCH caps; the " +
    "shallow-x growth is outside the firing region and moot. Changes no " +
    "bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

// Laguerre values L_0..L_kMax at u via the stable three-term recurrence
function laguerreVals(kMax, u) {
  const L = [1];
  if (kMax >= 1) L.push(1 - u);
  for (let k = 1; k < kMax; k++) {
    L.push(((2 * k + 1 - u) * L[k] - k * L[k - 1]) / (k + 1));
  }
  return L;
}

// DL_k(y) = L_k(y) - L_(k-1)(y), with L_(-1) = 0
function dLag(k, y) {
  if (k === 0) return 1;
  const L = laguerreVals(k, y);
  return L[k] - L[k - 1];
}

// imp-95251 THEOREM COAL-N majorant (sqrt-Lambda currency)
function coalN(N, R, x) {
  const Ln = laguerreVals(Math.max(N - 1, 1), -2 * R * x);
  let s = Ln[N - 1];
  for (let k = 0; k <= N - 2; k++) s += 2 * Ln[k];
  return Math.exp(-x) * s;
}

// e^(x)-free over-pricing ratio rho(N,R,x) = coalN/sqrt(T) (safe at deep x)
function rhoRatio(N, R, x) {
  const Ln = laguerreVals(Math.max(N - 1, 1), -2 * R * x);
  let num = Ln[N - 1];
  for (let k = 0; k <= N - 2; k++) num += 2 * Ln[k];
  let S = 0;
  for (let k = 0; k < N; k++) S += dLag(k, 2 * x) ** 2;
  return num / Math.sqrt(S);
}

const ONSETS = { 3: 4.930455, 4: 7.896539, 5: 10.940699 };

export const IMP95294_COALN_OVERPRICING_ASSERTIONS = [
  {
    id: "imp95294-firing-onset-is-coaln-one",
    description:
      "the imp-95251 firing onset x0(N) is where the COAL-N majorant reaches " +
      "the trivial ceiling: coalN(N,1.3,x0) = 1 at N = 3,4,5 (rel < 1e-5)",
    holds: () => {
      for (const N of [3, 4, 5]) {
        if (Math.abs(coalN(N, 1.3, ONSETS[N]) - 1) > 1e-5) return false;
      }
      return true;
    },
  },
  {
    id: "imp95294-corner-reproduces-caps",
    description:
      "rho at the corner (R=1.3, x=onset) reproduces the imp-95286 " +
      "WINDOW-PINCH caps 3.460619 / 6.151212 / 10.898085 (rel < 1e-5)",
    holds: () => {
      const caps = IMP95294_COALN_OVERPRICING_WINDOW_PINCH.bakedCaps;
      return (
        Math.abs(rhoRatio(3, 1.3, ONSETS[3]) - caps.N3) / caps.N3 < 1e-5 &&
        Math.abs(rhoRatio(4, 1.3, ONSETS[4]) - caps.N4) / caps.N4 < 1e-5 &&
        Math.abs(rhoRatio(5, 1.3, ONSETS[5]) - caps.N5) / caps.N5 < 1e-5
      );
    },
  },
  {
    id: "imp95294-rho-increasing-in-R",
    description:
      "at each onset depth rho(N,R,x0) is strictly increasing in R across " +
      "[1, 1.3], so the window top R=1.3 is the over-pricing peak in R",
    holds: () => {
      for (const N of [3, 4, 5]) {
        let prev = -Infinity;
        for (let R = 1.0; R <= 1.3001; R += 0.01) {
          const r = rhoRatio(N, R, ONSETS[N]);
          if (r < prev - 1e-12) return false;
          prev = r;
        }
      }
      return true;
    },
  },
  {
    id: "imp95294-rho-decreasing-in-depth",
    description:
      "at R=1.3, rho(N,1.3,x) is strictly decreasing in depth for x >= onset " +
      "(toward R^(N-1)), so the onset is the over-pricing peak in depth over " +
      "the firing region",
    holds: () => {
      for (const N of [3, 4, 5]) {
        let prev = Infinity;
        for (let x = ONSETS[N]; x <= ONSETS[N] + 30.0001; x += 0.5) {
          const r = rhoRatio(N, 1.3, x);
          if (r > prev + 1e-12) return false;
          prev = r;
        }
      }
      return true;
    },
  },
  {
    id: "imp95294-firing-region-peak-is-corner",
    description:
      "the firing-region 2D peak of rho over R in [1,1.3], x in " +
      "[onset, onset+20] sits at the corner (R=1.3, x=onset) and equals the " +
      "WINDOW-PINCH cap (rel < 1e-4)",
    holds: () => {
      for (const N of [3, 4, 5]) {
        const x0 = ONSETS[N];
        let peak = -1, pR = 0, pX = 0;
        for (let R = 1.0; R <= 1.3001; R += 0.01) {
          for (let x = x0; x <= x0 + 20.0001; x += 0.2) {
            const r = rhoRatio(N, R, x);
            if (r > peak) { peak = r; pR = R; pX = x; }
          }
        }
        const cap = rhoRatio(N, 1.3, x0);
        if (Math.abs(peak - cap) / cap > 1e-4) return false;
        if (Math.abs(pR - 1.3) > 1e-9 || Math.abs(pX - x0) > 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: "imp95294-shallow-x-is-moot-not-a-violation",
    description:
      "below the firing region rho exceeds the onset cap (measured > 1.5x the " +
      "cap for N=3) but coalN > 1 there so the certificate does not fire -- " +
      "not a WINDOW-PINCH violation, only moot depth",
    holds: () => {
      // N=3: a shallow depth where rho tops the cap yet coalN > 1
      const xShallow = 1.0;
      const cap = rhoRatio(3, 1.3, ONSETS[3]);
      return (
        rhoRatio(3, 1.3, xShallow) > 1.5 * cap &&
        coalN(3, 1.3, xShallow) > 1
      );
    },
  },
  {
    id: "imp95294-deep-x-limit-RpowNm1",
    description:
      "deep-x limit rho(N,1.3,2000) -> R^(N-1) within 1 percent for N = 3,4,5",
    holds: () => {
      for (const N of [3, 4, 5]) {
        const r = rhoRatio(N, 1.3, 2000);
        const lim = 1.3 ** (N - 1);
        if (Math.abs(r - lim) / lim > 0.01) return false;
      }
      return true;
    },
  },
  {
    id: "imp95294-honest-scope",
    description:
      "honest-scope strings present: NO QED, no refereed bound is changed, dominance NOT decided, " +
      "MEASUREMENT only, sub-gap STILL OPEN",
    holds: () => {
      const o = IMP95294_COALN_OVERPRICING_WINDOW_PINCH;
      return (
        /NO QED/.test(o.verdict) &&
        /refereed bound is changed/i.test(o.verdict) &&
        /STILL OPEN/.test(o.subGap) &&
        /does NOT decide/.test(o.subGap) &&
        /MEASUREMENT only/.test(o.subGap)
      );
    },
  },
];

for (const a of IMP95294_COALN_OVERPRICING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95294-coaln-overpricing-window-pinch-measurement assertion failed: ${a.id}`
    );
  }
}

export default IMP95294_COALN_OVERPRICING_WINDOW_PINCH;
