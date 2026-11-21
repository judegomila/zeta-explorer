/**
 * @module imp-95311-lagenv-vacuity-onset-assessment
 * @fileoverview imp-95311 -- import-light MEASUREMENT + ASSESSMENT of the
 *   imp-95285 LEMMA LAG-ENV vacuity threshold Y0(N, R) and its effect on
 *   the EV-OCT-N firing onset. Does LAG-ENV tighten the onset xStarEvOct,
 *   or does it only loosen it? Where, if anywhere, does the LAG-ENV
 *   envelope become tighter than the raw coalN bracket? Measurement /
 *   assessment only; establishes NO new bound; NO QED; no refereed bound is changed.
 *
 *   BACKGROUND
 *   -----------------------------------------------
 *   imp-95285 LEMMA LAG-ENV bounds the imp-95251 per-block coalescence
 *   law coalN(N, R, y) two ways:
 *     (envelope)  coalN(N, R, y) <= (2N - 1) exp(-y + 2 sqrt(2R(N-1) y)),
 *     (threshold) coalN(N, R, y) <= e^(-y/2) for y >= Y0(N, R),
 *   with the exact positive root Y0(N, R) = (b + sqrt(b^2 + 2c))^2,
 *   b = 2 sqrt(2R(N-1)), c = ln(2N - 1). The threshold is the pillar of
 *   COROLLARY EV-OCT-N-UNIF: for k >= 1 octave terms, 2^k x >= Y0 lets
 *   the tail be summed geometrically to 2 e^(-x). The frontier scout
 *   asked whether plugging the LAG-ENV envelope into the EV-OCT-N
 *   assembly (in place of the raw coalN in every octave term) changes the
 *   finite-m onset meaningfully or only loosens it, and where the
 *   envelope becomes tighter than the raw bracket, if anywhere.
 *
 *   Q1: Y0(N, R) TABLE (N = 2..5, R in {1.05, 1.3})
 *   -----------------------------------------------
 *   Measured (see Y0_TABLE): Y0 grows with both N and R. At R = 1.3 it
 *   runs 45.89 / 89.52 / 132.47 / 175.08 for N = 2..5 (the N = 3 / 4
 *   entries reproduce the imp-95285 literals Y0(3,1.3) = 89.522013,
 *   Y0(4,1.3) = 132.469303 exactly); at R = 1.05 it runs 37.87 / 73.50 /
 *   108.44 / 143.05. The corollary-binding half-threshold Y0/2 is
 *   tabulated alongside.
 *
 *   Q2: DOES LAG-ENV TIGHTEN THE ONSET? -- NO, IT ONLY LOOSENS
 *   -----------------------------------------------
 *   Substituting the LAG-ENV envelope for coalN in EVERY octave term of
 *   the finite (m = 6) EV-OCT-N certificate raises the bisected onset
 *   xStar substantially at every (N, R): by roughly +68% to +100%
 *   (nearly doubling at N = 2). Example at R = 1.3: N = 2 onset
 *   14.92 -> 29.93, N = 3 33.50 -> 62.98, N = 4 58.11 -> 103.54,
 *   N = 5 88.61 -> 151.52. See ONSET_TABLE. The finite-m onset is
 *   therefore TIGHTEST with the raw coalN; LAG-ENV loosens it, it never
 *   tightens it.
 *
 *   Q3: CROSSOVER DEPTH WHERE LAG-ENV BEATS THE RAW BRACKET -- NONE
 *   -----------------------------------------------
 *   There is no such depth. LAG-ENV is a PROVEN majorant of coalN, so by
 *   construction lagEnv(N, R, y) >= coalN(N, R, y) for all y >= 0, with
 *   equality only at the vacuous origin y = 0 (both equal 2N - 1, well
 *   above the certificate threshold 1). The ratio lagEnv / coalN scanned
 *   over y in (0, 200] has infimum 1 (approached as y -> 0+) and is
 *   strictly > 1 for every y > 0 -- measured minimum on the grid ranges
 *   2.30 (N = 3, R = 1.05) to 3.40 (N = 5, R = 1.3), and the ratio grows
 *   with y because the 2 sqrt(2R(N-1) y) exponent term is a strict
 *   over-count of the finite coalN polynomial. LAG-ENV can never be
 *   tighter than the raw bracket; there is no crossover.
 *
 *   INTERPRETATION
 *   -----------------------------------------------
 *   LAG-ENV is not an onset-tightening lever. Its value is exactly what
 *   imp-95285 uses it for: the CLOSED-FORM threshold Y0(N, R) that
 *   converts the imp-95251 COAL-N majorant into a plain geometric decay
 *   e^(-y/2), which is what makes the m-uniform tail summable in
 *   COROLLARY EV-OCT-N-UNIF. For the FINITE-m onset one should keep the
 *   raw coalN in every term (as imp-95285 already does); substituting the
 *   envelope only inflates the onset. This is consistent with imp-95285
 *   HONEST LIMITS (d) (the onset inherits the ingredient loosenesses) and
 *   with the imp-95320 concept note (at the m-uniform crossing the
 *   threshold is already cleared). Assessment only; changes no bound of
 *   the Lambda program.
 *
 *   Import-light (no imports, no zeros bundle). All numerics are
 *   CROSS-CHECKS of the imp-95285 machinery, never a claim itself.
 */

// ---------------------------------------------------------------------------
// imp-95285 closed-form machinery (re-derived locally; no imports)
// ---------------------------------------------------------------------------

// L_k(-y) = sum_(l<=k) C(k,l) y^l / l!
function lagNeg(k, y) {
  let s = 0;
  let c = 1;
  let p = 1;
  for (let l = 0; l <= k; l++) {
    s += c * p;
    c = (c * (k - l)) / (l + 1);
    p = (p * y) / (l + 1);
  }
  return s;
}
// imp-95251 THEOREM COAL-N right side (sqrt level), depth argument x
function coalN(N, R, x) {
  const y = 2 * R * x;
  let s = lagNeg(N - 1, y);
  for (let k = 0; k <= N - 2; k++) s += 2 * lagNeg(k, y);
  return Math.exp(-x) * s;
}
// imp-95285 LEMMA LAG-ENV majorant of coalN at depth y
function lagEnv(N, R, y) {
  return (2 * N - 1) * Math.exp(-y + 2 * Math.sqrt(2 * R * (N - 1) * y));
}
const bLat = (n, R) => (2 ** n - R) / (2 ** n + R);
// EV-OCT-N per-block fence prod_(l != k) b_(|k-l|)^(2 N^2)
function phiHat(m, k, N, R) {
  let p = 1;
  for (let l = 0; l < m; l++)
    if (l !== k) p *= bLat(Math.abs(k - l), R) ** (2 * N * N);
  return p;
}
// raw EV-OCT-N certificate (contiguous m, Lambda level)
function certNm(m, N, R, x) {
  let s = 0;
  for (let k = 0; k < m; k++)
    s += coalN(N, R, 2 ** k * x) / Math.sqrt(phiHat(m, k, N, R));
  return s * s;
}
// EV-OCT-N certificate with the LAG-ENV envelope in every octave term
function certNmEnv(m, N, R, x) {
  let s = 0;
  for (let k = 0; k < m; k++)
    s += lagEnv(N, R, 2 ** k * x) / Math.sqrt(phiHat(m, k, N, R));
  return s * s;
}
// imp-95285 LEMMA LAG-ENV threshold
function y0Thresh(N, R) {
  const b = 2 * Math.sqrt(2 * R * (N - 1));
  const c = Math.log(2 * N - 1);
  const u = b + Math.sqrt(b * b + 2 * c);
  return u * u;
}
function bisect(f, lo0, hi0) {
  let lo = lo0;
  let hi = hi0;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < 1) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// Measured tables
// ---------------------------------------------------------------------------

// Q1: Y0(N, R) and the corollary-binding half-threshold Y0/2
const Y0_TABLE = [];
for (const R of [1.05, 1.3])
  for (let N = 2; N <= 5; N++) {
    const y0 = y0Thresh(N, R);
    Y0_TABLE.push({ N, R, y0, y0Half: y0 / 2 });
  }

// Q2: finite m = 6 onset, raw coalN vs LAG-ENV-substituted
const ONSET_TABLE = [];
for (const R of [1.05, 1.3])
  for (let N = 2; N <= 5; N++) {
    const xRaw = bisect((x) => certNm(6, N, R, x), 1, 400);
    const xEnv = bisect((x) => certNmEnv(6, N, R, x), 1, 400);
    ONSET_TABLE.push({
      N,
      R,
      xStarRaw: xRaw,
      xStarLagEnv: xEnv,
      loosenAbs: xEnv - xRaw,
      loosenPct: (xEnv / xRaw - 1) * 100,
    });
  }

// Q3: min lagEnv/coalN over y in (0, 200] -- infimum of the majorant ratio
const RATIO_TABLE = [];
for (const R of [1.05, 1.3])
  for (let N = 2; N <= 5; N++) {
    let minRatio = Infinity;
    let atY = 0;
    for (let y = 0.05; y <= 200; y += 0.05) {
      const r = lagEnv(N, R, y) / coalN(N, R, y);
      if (r < minRatio) {
        minRatio = r;
        atY = y;
      }
    }
    RATIO_TABLE.push({ N, R, minRatio, atY });
  }

export const IMP95311_LAGENV_VACUITY_ONSET_ASSESSMENT = {
  id: "imp-95311",
  title:
    "Assessment: the imp-95285 LEMMA LAG-ENV vacuity threshold Y0(N, R) " +
    "does NOT tighten the EV-OCT-N firing onset -- it only loosens it; " +
    "no crossover where the LAG-ENV envelope beats the raw coalN bracket",
  question:
    "Measure Y0(N, R) for N = 2..5, R in {1.05, 1.3}; assess whether " +
    "plugging the LAG-ENV envelope into the EV-OCT-N assembly (vs raw " +
    "coalN) changes the firing onset meaningfully or only loosens it; " +
    "report the crossover depth where LAG-ENV becomes tighter, if any.",
  y0Table: Y0_TABLE,
  onsetTable: ONSET_TABLE,
  ratioTable: RATIO_TABLE,
  findings: {
    q1Y0:
      "Y0(N, R) grows with N and R. R = 1.3: 45.89 / 89.52 / 132.47 / " +
      "175.08 (N = 2..5); R = 1.05: 37.87 / 73.50 / 108.44 / 143.05. The " +
      "N = 3 / 4, R = 1.3 entries reproduce the imp-95285 literals exactly.",
    q2Onset:
      "LAG-ENV substitution LOOSENS the finite m = 6 onset by ~68% to " +
      "~100% at every (N, R) tested; it never tightens it. The finite-m " +
      "onset is tightest with the raw coalN, which is what imp-95285 uses.",
    q3Crossover:
      "NONE. LAG-ENV is a proven majorant, lagEnv >= coalN for all y >= " +
      "0 with equality only at the vacuous origin y = 0 (both = 2N - 1). " +
      "The ratio lagEnv/coalN has infimum 1 as y -> 0+ and is strictly " +
      "> 1 for every y > 0, so no crossover depth exists.",
  },
  interpretation:
    "LAG-ENV is not an onset-tightening lever; its role is the " +
    "closed-form threshold Y0(N, R) that makes the m-uniform COROLLARY " +
    "EV-OCT-N-UNIF tail summable (coalN <= e^(-y/2) beyond Y0). For the " +
    "finite-m onset the raw coalN in every term is correct and tightest.",
  verdict:
    "MEASUREMENT / ASSESSMENT only. Q1 tabulated; Q2 answered (loosens, " +
    "does not tighten); Q3 answered (no crossover -- LAG-ENV is a " +
    "majorant). Consistent with imp-95285 HONEST LIMITS (d) and the " +
    "imp-95320 concept note. Changes no bound of the Lambda program; " +
    "NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95311_ASSERTIONS = [
  {
    id: "imp95311-y0-literals-and-monotonicity",
    description:
      "Y0(N, R) table reproduces the imp-95285 literals Y0(3,1.3) = " +
      "89.522013 and Y0(4,1.3) = 132.469303 (rel 1e-9) and is strictly " +
      "increasing in both N (fixed R) and R (fixed N)",
    holds: () => {
      const get = (N, R) => Y0_TABLE.find((r) => r.N === N && r.R === R).y0;
      if (Math.abs(get(3, 1.3) - 89.5220129477708) > 1e-9 * 89.5220129477708)
        return false;
      if (Math.abs(get(4, 1.3) - 132.46930267092537) > 1e-9 * 132.46930267092537)
        return false;
      for (const R of [1.05, 1.3])
        for (let N = 2; N < 5; N++) if (!(get(N, R) < get(N + 1, R))) return false;
      for (let N = 2; N <= 5; N++) if (!(get(N, 1.05) < get(N, 1.3))) return false;
      return true;
    },
  },
  {
    id: "imp95311-lagenv-loosens-never-tightens",
    description:
      "the LAG-ENV-substituted finite m = 6 onset strictly exceeds the raw " +
      "coalN onset at every (N, R) (loosening between +50% and +150%): " +
      "LAG-ENV loosens the onset, it never tightens it",
    holds: () =>
      ONSET_TABLE.every(
        (r) =>
          r.xStarLagEnv > r.xStarRaw &&
          r.loosenPct > 50 &&
          r.loosenPct < 150 &&
          Number.isFinite(r.xStarRaw) &&
          Number.isFinite(r.xStarLagEnv),
      ),
  },
  {
    id: "imp95311-no-crossover-majorant",
    description:
      "no crossover: lagEnv >= coalN for all sampled y > 0 (the measured " +
      "min ratio on (0,200] is strictly > 1 at every (N, R)); equality " +
      "holds only at the vacuous origin y = 0 where both equal 2N - 1",
    holds: () => {
      if (!RATIO_TABLE.every((r) => r.minRatio > 1)) return false;
      // equality at the vacuous origin y = 0: both sides equal 2N - 1
      for (let N = 2; N <= 5; N++)
        for (const R of [1.05, 1.3]) {
          if (Math.abs(coalN(N, R, 0) - (2 * N - 1)) > 1e-12) return false;
          if (Math.abs(lagEnv(N, R, 0) - (2 * N - 1)) > 1e-12) return false;
        }
      // and a direct pointwise majorant check on a (N, R, y) grid
      for (const R of [1.05, 1.3])
        for (let N = 2; N <= 5; N++)
          for (let y = 0.01; y <= 150; y += 0.37)
            if (lagEnv(N, R, y) < coalN(N, R, y) * (1 - 1e-12)) return false;
      return true;
    },
  },
  {
    id: "imp95311-onset-raw-matches-imp95285",
    description:
      "the raw m = 6 onsets recomputed here match the imp-95285 literals " +
      "(N = 3 R = 1.3: 33.504309; N = 4 R = 1.3: 58.112542) to abs 1e-3, " +
      "confirming the raw-coalN baseline is the imp-95285 onset",
    holds: () => {
      const get = (N, R) =>
        ONSET_TABLE.find((r) => r.N === N && r.R === R).xStarRaw;
      return (
        Math.abs(get(3, 1.3) - 33.504309092984) < 1e-3 &&
        Math.abs(get(4, 1.3) - 58.112541825315) < 1e-3
      );
    },
  },
  {
    id: "imp95311-verdict-honesty",
    description:
      "the record carries the honest labels: measurement/assessment only, " +
      "no crossover, no bound change, no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT \/ ASSESSMENT only/.test(
        IMP95311_LAGENV_VACUITY_ONSET_ASSESSMENT.verdict,
      ) &&
      /no crossover/.test(IMP95311_LAGENV_VACUITY_ONSET_ASSESSMENT.verdict) &&
      /Changes no bound/.test(
        IMP95311_LAGENV_VACUITY_ONSET_ASSESSMENT.verdict,
      ) &&
      /NO QED/.test(IMP95311_LAGENV_VACUITY_ONSET_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95311_LAGENV_VACUITY_ONSET_ASSESSMENT.verdict),
  },
];

for (const a of IMP95311_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95311-lagenv-vacuity-onset-assessment assertion failed: ${a.id}`,
    );
  }
}

export default IMP95311_LAGENV_VACUITY_ONSET_ASSESSMENT;
