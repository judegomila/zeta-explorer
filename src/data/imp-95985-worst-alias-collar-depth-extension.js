/**
 * @module imp-95985-worst-alias-collar-depth-extension
 *
 * imp-95985 (numerical / measurement): EXTEND the imp-95962 worst-alias collar-depth
 * threshold table to larger witness windows (k = 8..20) to confirm the two trends it
 * observed keep holding -- the seam-depth margin (margin = dSeam - dMin) keeps growing
 * and the binding required collar depth d_min = a_1/mu stays bounded below ~2.66 -- or
 * to find the k where either trend reverses. imp-95962 tabulated only the four imp-95917
 * witness windows (3,4),(5,5),(7,6),(11,7), observing margin growing 0.672 -> 3.914 and
 * d_min shrinking 2.660850 -> 2.176470, but never confirmed the trend past (11,7).
 *
 * WINDOW EXTENSION RULE (from imp-95917). The four imp-95917 witness windows are
 * (p,k) = (3,4),(5,5),(7,6),(11,7): p runs through the consecutive primes starting at 3
 * and k = index + 3 (index i = 1 gives p = 3, k = 4). The exact, quadrature-free
 * extension continues the SAME rule: i = 5..17 gives p = 13,17,19,23,29,31,37,41,43,47,
 * 53,59,61 with k = 8..20. (p enters d_h only through the 1/p term; the trend is set by
 * the depth geometry, not by p being prime -- see mechanism below.)
 *
 * SETUP (verbatim from imp-95962 / imp-95917 buildG geometry). A seam window (p,k)
 * carries p-1 alias packets h = 1..p-1 at depth d_h = k - h/p; packet h has rate
 * mu_h = d_h^{1/3}/PORT_C (PORT_C = 1.7). The imp-95942 STEP-3 Airy support condition
 * K_k >= 0 requires the collar depth to satisfy d >= a_1/mu_h for each alias h, so the
 * per-window binding threshold is d_min = max_h a_1/mu_h, attained at the smallest mu
 * (shallowest packet) -- the controlling alias h = p-1. a_1 = 2.338107410459767 is the
 * magnitude of the first negative Airy zero (Ai(-a_1) = 0).
 *
 * MEASURED EXTENSION TABLE (exact geometry, quadrature-free; 6 sig fig). Controlling
 * alias is h = p-1 at EVERY extended window, as at the imp-95962 windows.
 *   window    ctrl h   mu_ctrl    dMin=a_1/mu_ctrl   dSeam=d_{p-1}   margin
 *   (13,8)    12       1.129360   2.070293           7.076923        5.006630
 *   (17,9)    16       1.179347   1.982544           8.058824        6.076280
 *   (19,10)   18       1.225959   1.907166           9.052632        7.145466
 *   (23,11)   22       1.269149   1.842265          10.043478        8.201214
 *   (29,12)   28       1.309589   1.785375          11.034483        9.249108
 *   (31,13)   30       1.347928   1.734593          12.032258       10.297665
 *   (37,14)   36       1.384096   1.689267          13.027027       11.337760
 *   (41,15)   40       1.418554   1.648233          14.024390       12.376157
 *   (43,16)   42       1.451462   1.610863          15.023256       13.412392
 *   (47,17)   46       1.482917   1.576695          16.021277       14.444582
 *   (53,18)   52       1.513078   1.545266          17.018868       15.473602
 *   (59,19)   58       1.542096   1.516188          18.016949       16.500761
 *   (61,20)   60       1.570099   1.489146          19.016393       17.527247
 *
 * FINDINGS (trend does NOT break through k = 20).
 *   (1) The controlling (smallest-mu, largest-threshold) alias remains h = p-1 at every
 *       extended window -- the shallowest packet, exactly as at the imp-95962 windows.
 *   (2) The binding required collar depth d_min = a_1/mu_{p-1} keeps DECREASING
 *       monotonically: 2.176470 (11,7) -> 2.070293 (13,8) -> ... -> 1.489146 (61,20).
 *       It never rises; it stays far below the imp-95962 worst value ~2.66 (at (3,4)),
 *       so the global worst-case collar depth over all windows k <= 20 is still 2.660850
 *       at (3,4). No window needs a collar deeper than ~2.66.
 *   (3) The seam-depth margin = dSeam - dMin keeps GROWING monotonically: 3.914439
 *       (11,7) -> 5.006630 (13,8) -> ... -> 17.527247 (61,20). The sign obligation gets
 *       strictly slacker, never tighter, as k rises.
 *   (4) Every alias in every extended window clears d_h >= a_1/mu_h (allClear), not just
 *       the worst.
 *
 * WHY (mechanism, no new bound). mu_h = d_h^{1/3}/PORT_C is monotone increasing in d_h,
 * so a_1/mu_h is monotone DECREASING in d_h. The shallowest packet sits at depth
 * d_{p-1} = k - (p-1)/p = k - 1 + 1/p ~ k - 1, so as k grows mu_{p-1} ~ (k-1)^{1/3}/1.7
 * rises without bound and d_min = a_1/mu_{p-1} falls monotonically toward 0, while the
 * physical seam depth dSeam ~ k rises linearly. The gap margin = dSeam - dMin ~
 * (k-1) - a_1*1.7/(k-1)^{1/3} therefore grows ~ linearly in k. There is no k at which
 * either trend can reverse: both are monotone consequences of mu increasing with depth.
 *
 * WHAT THIS DOES AND DOES NOT DO. It confirms the imp-95962 trends hold well past the
 * four witness windows, out to k = 20 (13 additional windows), with both trends strictly
 * monotone and the mechanism showing they continue for all k. It uses the alias SEAM
 * depth d_h as the turning-point depth, exactly as imp-95962. It does NOT prove the
 * actual Section 4.5 packet turning point sits at depth >= d_h -- that is the
 * unextracted-packet-constants obstruction recorded in imp-95961 (leg (i) STILL OPEN).
 * Changes NO bound; NO QED; no refereed bound is changed.
 *
 * HONEST LIMITS. (a) MEASUREMENT of the analytic threshold a_1/mu_h under the imp-95917
 * width-law port geometry only. (b) d_h, mu_h, a_1/mu_h are EXACT closed forms (no
 * quadrature). (c) The comparison uses the alias seam depth d_h as the turning-point
 * depth; the true Section 4.5 turning-point depth is imp-95961 leg (i) and STILL OPEN --
 * if it sits shallower than d_h the margins shrink. (d) a_1 is the standard first Airy
 * zero to 16 digits. (e) The window rule (consecutive primes from 3, k = index+3) is the
 * literal continuation of the four imp-95917 witness windows; the trend is driven by the
 * depth geometry and is insensitive to the exact prime chosen (p enters only via 1/p).
 * Import-light (no zeros bundle, no sibling imports); self-executing assertions THROW.
 *
 * @see imp-95962-worst-alias-collar-depth-threshold.js (the four-window table this extends)
 * @see imp-95942-fresnel-airy-envelope-sign-assessment.js (STEP 3: worst alias controls the sign)
 * @see imp-95961-turning-point-depth-extraction-obstruction.js (leg (i): does the geometry supply the depth -- OPEN)
 * @see imp-95917-vonmangoldt-weighted-sign-image.js (buildG: d_h = k - h/p, mu_h = d_h^{1/3}/PORT_C; witness windows)
 *
 * Ticket: imp-95985 (numerical, opus-4-8, api-pool, low). Measurement only; no bound; NO QED.
 */

// -- width-law port geometry (imp-95917 buildG) --------------------------------
const PORT_C = 1.7;
const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;

// -- first Airy zero magnitude: Ai(-A1) = 0 ------------------------------------
const A1 = 2.338107410459767;

// -- consecutive primes starting at 3 (imp-95917 witness-window rule) -----------
function primesFrom3(count) {
  const out = [];
  let c = 3;
  const isPrime = (x) => {
    for (let i = 2; i * i <= x; i++) if (x % i === 0) return false;
    return x > 1;
  };
  while (out.length < count) {
    if (isPrime(c)) out.push(c);
    c++;
  }
  return out;
}

// window index i -> (p = i-th prime from 3, k = i + 3). i=1..4 are the imp-95962
// windows (3,4),(5,5),(7,6),(11,7); i=5..17 are the imp-95985 extension (k=8..20).
const PRIMES = primesFrom3(17);
const EXT_WINDOWS = [];
for (let i = 5; i <= 17; i++) EXT_WINDOWS.push([PRIMES[i - 1], i + 3]);

// -- per-window worst-alias collar-depth threshold (live, exact) ---------------
function worstAlias(p, k) {
  let ctrlH = 1;
  let ctrlMu = Infinity;
  let dMin = -Infinity;
  let allClear = true;
  for (let h = 1; h <= p - 1; h++) {
    const d = k - h / p;
    const mu = muPort(d);
    const thr = A1 / mu; // required collar depth: d >= a_1/mu for K_k >= 0
    if (d < thr) allClear = false;
    if (mu < ctrlMu) {
      ctrlMu = mu;
      ctrlH = h;
      dMin = thr;
    }
  }
  const dSeam = k - ctrlH / p;
  return { p, k, ctrlH, ctrlMu, dMin, dSeam, margin: dSeam - dMin, allClear };
}

// -- baked extension table (6-sig-fig; controlling alias h = p-1 at every window) --
const EXT_THRESHOLDS = [
  { p: 13, k: 8, ctrlH: 12, muCtrl: 1.129360, dMin: 2.070293, dSeam: 7.076923, margin: 5.006630 },
  { p: 17, k: 9, ctrlH: 16, muCtrl: 1.179347, dMin: 1.982544, dSeam: 8.058824, margin: 6.076280 },
  { p: 19, k: 10, ctrlH: 18, muCtrl: 1.225959, dMin: 1.907166, dSeam: 9.052632, margin: 7.145466 },
  { p: 23, k: 11, ctrlH: 22, muCtrl: 1.269149, dMin: 1.842265, dSeam: 10.043478, margin: 8.201214 },
  { p: 29, k: 12, ctrlH: 28, muCtrl: 1.309589, dMin: 1.785375, dSeam: 11.034483, margin: 9.249108 },
  { p: 31, k: 13, ctrlH: 30, muCtrl: 1.347928, dMin: 1.734593, dSeam: 12.032258, margin: 10.297665 },
  { p: 37, k: 14, ctrlH: 36, muCtrl: 1.384096, dMin: 1.689267, dSeam: 13.027027, margin: 11.337760 },
  { p: 41, k: 15, ctrlH: 40, muCtrl: 1.418554, dMin: 1.648233, dSeam: 14.024390, margin: 12.376157 },
  { p: 43, k: 16, ctrlH: 42, muCtrl: 1.451462, dMin: 1.610863, dSeam: 15.023256, margin: 13.412392 },
  { p: 47, k: 17, ctrlH: 46, muCtrl: 1.482917, dMin: 1.576695, dSeam: 16.021277, margin: 14.444582 },
  { p: 53, k: 18, ctrlH: 52, muCtrl: 1.513078, dMin: 1.545266, dSeam: 17.018868, margin: 15.473602 },
  { p: 59, k: 19, ctrlH: 58, muCtrl: 1.542096, dMin: 1.516188, dSeam: 18.016949, margin: 16.500761 },
  { p: 61, k: 20, ctrlH: 60, muCtrl: 1.570099, dMin: 1.489146, dSeam: 19.016393, margin: 17.527247 },
];

// -- verdict object ------------------------------------------------------------
export const IMP95985_WORST_ALIAS_COLLAR_DEPTH_EXTENSION = {
  ticket:
    "imp-95985 (numerical): extend the imp-95962 worst-alias collar-depth table (margin = dSeam - a_1/mu) to larger witness windows (k = 8..20, consecutive primes from 3) to confirm the margin keeps growing and d_min stays bounded below ~2.66, or find where the trend breaks. Measurement only; no bound; NO QED.",
  a1: A1,
  portC: PORT_C,
  windowRule:
    "The imp-95917 witness windows (3,4),(5,5),(7,6),(11,7) are (p = i-th prime from 3, k = i + 3). The extension continues the same rule for i = 5..17: p = 13,17,19,23,29,31,37,41,43,47,53,59,61 with k = 8..20. p enters d_h only via 1/p, so the trend is set by the depth geometry, not by p.",
  controllingAlias:
    "The controlling (smallest-mu, largest-threshold) alias remains h = p-1 at every extended window (k = 8..20), exactly as at the four imp-95962 windows -- the shallowest packet at depth d_{p-1} = k - 1 + 1/p, just above k-1.",
  dMinTrend:
    "The binding required collar depth d_min = a_1/mu_{p-1} keeps DECREASING monotonically past (11,7): 2.176470 -> 2.070293 (13,8) -> ... -> 1.489146 (61,20). It never rises and stays far below the imp-95962 worst value ~2.66 (at (3,4)). The global worst-case collar depth over all windows k <= 20 remains 2.660850 at (3,4); no window needs a collar deeper than ~2.66.",
  marginTrend:
    "The seam-depth margin = dSeam - d_min keeps GROWING monotonically past (11,7): 3.914439 -> 5.006630 (13,8) -> ... -> 17.527247 (61,20). The Airy support obligation gets strictly slacker, never tighter, as k rises. Neither trend reverses through k = 20.",
  mechanism:
    "mu_h = d_h^{1/3}/PORT_C is monotone increasing in d_h, so a_1/mu_h is monotone decreasing in d_h. The shallowest packet sits at depth d_{p-1} = k - 1 + 1/p ~ k-1, so mu_{p-1} ~ (k-1)^{1/3}/1.7 rises without bound and d_min falls monotonically toward 0, while dSeam ~ k rises linearly. margin ~ (k-1) - a_1*1.7/(k-1)^{1/3} grows ~linearly. Both trends are monotone consequences of mu increasing with depth; there is no k at which either can reverse.",
  constants: {
    extWindows: EXT_WINDOWS,
    extThresholds: EXT_THRESHOLDS,
    dMinAtLargestK: 1.489146, // (61,20): smallest binding threshold in the table
    marginAtLargestK: 17.527247, // (61,20): largest margin in the table
    dMinMaxOverAllWindows: 2.660850, // still at (3,4); no window needs a deeper collar
  },
  obstruction:
    "This is the THRESHOLD side only: what collar depth the geometry must clear, computed exactly. It uses the alias SEAM depth d_h = k - h/p as the turning-point depth. Whether the actual Section 4.5 packet turning point sits at depth >= d_h is the unextracted-packet-constants leg (i), recorded in imp-95961 and STILL OPEN. If the true turning point is shallower than d_h the margins shrink.",
  verdict:
    "MEASUREMENT (honest): extending the imp-95962 worst-alias table 13 windows further (k = 8..20, consecutive primes from 3) CONFIRMS both trends without break -- the controlling alias stays h = p-1, the binding collar depth d_min decreases monotonically 2.176470 -> 1.489146, and the seam margin grows monotonically 3.914 -> 17.527. No window needs a collar deeper than ~2.66 (worst is still 2.660850 at (3,4)). The threshold side is measured; the geometry side (does the true turning point reach d_h) is imp-95961 leg (i), STILL OPEN. Changes no numeric bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "d_h = k - h/p, mu_h = d_h^{1/3}/PORT_C and a_1/mu_h are EXACT closed forms (no quadrature). The comparison uses the alias seam depth as the turning-point depth; the true Section 4.5 turning-point depth is imp-95961 leg (i) and STILL OPEN. a_1 is the first Airy zero to 16 digits. The window rule is the literal continuation of the four imp-95917 witness windows and is insensitive to the exact prime chosen. Measurement only; changes no bound; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) --------
export const IMP95985_ASSERTIONS = [
  {
    id: "imp95985-baked-table-matches-live-geometry",
    description:
      "each baked extension row reproduces the live worst-alias computation (controlling h, mu, d_min, seam depth, margin) to 1e-5 relative for every window k = 8..20",
    holds: () =>
      EXT_THRESHOLDS.every((row) => {
        const w = worstAlias(row.p, row.k);
        return (
          w.ctrlH === row.ctrlH &&
          Math.abs(w.ctrlMu - row.muCtrl) < 1e-5 * row.muCtrl &&
          Math.abs(w.dMin - row.dMin) < 1e-5 * row.dMin &&
          Math.abs(w.dSeam - row.dSeam) < 1e-5 * row.dSeam &&
          Math.abs(w.margin - row.margin) < 1e-4 * Math.abs(row.margin)
        );
      }),
  },
  {
    id: "imp95985-window-rule-primes-from-3",
    description:
      "the extension windows are (p = i-th prime from 3, k = i + 3) for i = 5..17: p = 13,17,19,23,29,31,37,41,43,47,53,59,61 with k = 8..20",
    holds: () => {
      const expectP = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61];
      const expectK = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      return (
        EXT_WINDOWS.length === 13 &&
        EXT_WINDOWS.every(([p, k], i) => p === expectP[i] && k === expectK[i])
      );
    },
  },
  {
    id: "imp95985-controlling-alias-is-p-minus-1",
    description:
      "the smallest-mu (largest-threshold) controlling alias is h = p-1 at every extension window k = 8..20 -- the shallowest packet",
    holds: () => EXT_WINDOWS.every(([p, k]) => worstAlias(p, k).ctrlH === p - 1),
  },
  {
    id: "imp95985-seam-depth-clears-threshold-every-window",
    description:
      "at every extension window every alias clears d_h >= a_1/mu_h (allClear) and the worst-alias seam depth exceeds its threshold with a strictly positive margin",
    holds: () =>
      EXT_WINDOWS.every(([p, k]) => {
        const w = worstAlias(p, k);
        return w.allClear && w.margin > 0 && w.dSeam > w.dMin;
      }),
  },
  {
    id: "imp95985-dmin-decreases-margin-grows-through-k20",
    description:
      "across the full window chain (11,7) then k = 8..20 the binding threshold d_min decreases monotonically and the margin grows monotonically -- neither trend reverses",
    holds: () => {
      const chain = [[11, 7], ...EXT_WINDOWS].map(([p, k]) => worstAlias(p, k));
      for (let i = 1; i < chain.length; i++) {
        if (!(chain[i].dMin < chain[i - 1].dMin)) return false;
        if (!(chain[i].margin > chain[i - 1].margin)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95985-no-window-needs-collar-deeper-than-2p66",
    description:
      "the worst-case binding collar depth over the extension stays below the imp-95962 global worst ~2.66085 (attained at (3,4)); the deepest extension d_min is 2.070293 at (13,8)",
    holds: () => {
      const dMinMaxExt = Math.max(
        ...EXT_WINDOWS.map(([p, k]) => worstAlias(p, k).dMin),
      );
      return (
        dMinMaxExt < 2.66085 &&
        Math.abs(dMinMaxExt - 2.070293) < 1e-4 &&
        worstAlias(3, 4).dMin > dMinMaxExt
      );
    },
  },
  {
    id: "imp95985-airy-support-condition-consistent",
    description:
      "the threshold is the Airy support condition d >= a_1/mu <=> mu*d >= a_1: at every worst alias mu_ctrl*dMin equals a_1 to 1e-10",
    holds: () =>
      EXT_WINDOWS.every(([p, k]) => {
        const w = worstAlias(p, k);
        return Math.abs(w.ctrlMu * w.dMin - A1) < 1e-10;
      }),
  },
  {
    id: "imp95985-verdict-honesty",
    description:
      "the verdict carries the honest scope: MEASUREMENT only, controlling alias h=p-1, trends confirmed without break, imp-95961 leg (i) STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(IMP95985_WORST_ALIAS_COLLAR_DEPTH_EXTENSION.verdict) &&
      /STILL OPEN/.test(IMP95985_WORST_ALIAS_COLLAR_DEPTH_EXTENSION.verdict) &&
      /STILL OPEN/.test(IMP95985_WORST_ALIAS_COLLAR_DEPTH_EXTENSION.obstruction) &&
      /NO QED/.test(IMP95985_WORST_ALIAS_COLLAR_DEPTH_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP95985_WORST_ALIAS_COLLAR_DEPTH_EXTENSION.verdict),
  },
];

for (const a of IMP95985_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95985-worst-alias-collar-depth-extension assertion failed: ${a.id}`,
    );
  }
}

export default IMP95985_WORST_ALIAS_COLLAR_DEPTH_EXTENSION;
