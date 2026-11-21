/**
 * imp-95540 -- alpha_{k,h} > 1 majorant-mass fraction across all 25 sieving primes
 * p <= 97, at the window endpoints N = 690988 and N = 54799999.
 *
 * imp-95519 section 4 reports the alpha > 1 weld-majorant-mass fraction for a few
 * primes only: 59.26% at p = 97; 47-60% for p >= 7; zero for p <= 5. This module
 * tabulates that fraction for EVERY sieving prime p <= 97 against the alpha > 1
 * threshold and confirms the p <= 5 exemption.
 *
 * Definitions (imp-95519 section 4, eqs 15/16):
 *   alpha_{k,h} = log u_{k,h} / log T,  u_{k,h} = v / (k - h/p),  v = x/(4 pi),  T = x/2.
 *   alpha_{k,h} > 1  <=>  k - h/p < 1/(2 pi)  <=>  k = 1 and h > (1 - 1/(2 pi)) p = 0.8408 p.
 * The majorant weight of alias h (measured from the pole at h = p) is j^{-2/3} with
 * j = p - h; the named-scalar majorant is Sbar_p = 2 p^{-4/3} sum_{j=1}^{(p-1)/2} j^{-2/3}.
 * The alpha > 1 aliases are exactly j = p - h < p/(2 pi), i.e. the small-j (largest-weight)
 * end of the sum, so the over-one fraction share_p = (sum_{j < p/(2 pi)} j^{-2/3}) / (sum_j j^{-2/3}).
 *
 * KEY STRUCTURAL FACT: the alpha > 1 condition k - h/p < 1/(2 pi) is N-independent
 * (pure combinatorics of h/p vs 1/(2 pi)), so share_p is IDENTICAL at both window
 * endpoints. Only alpha_max(N) = alpha_{1,p-1}(N) moves with N (1.0953 at N = 690988,
 * 1.0730 at N = 54799999) -- it stays above 1 across the whole window, so no alias
 * crosses the alpha = 1 line as N varies. The over-one fraction table below is thus a
 * single N-flat column, reported once with the two alpha_max endpoints alongside.
 *
 * Report only; NO bound change; NO QED. No refereed bound is changed.
 * Import-light: no zeros bundle, no sibling imports. All literals re-derived here.
 */

const TWO_PI = 2 * Math.PI;
const T0 = 24727519 / 200000000; // 0.123637595
const N_LO = 690988;
const N_HI = 54799999;
const THRESHOLD_COEFF = 1 - 1 / TWO_PI; // 0.8408450569...

const xOfN = (N) => 4 * Math.PI * N * N - T0 / 16;
const heightT = (N) => xOfN(N) / 2;
const stationaryV = (N) => heightT(N) / TWO_PI;

// alpha_{k,h} = log(v / xi) / log T,  xi = k - h/p (here the floor alias xi = 1/p)
function alphaOfXi(xi, N) {
  const T = heightT(N);
  return Math.log(stationaryV(N) / xi) / Math.log(T);
}

// Over-one alias count and majorant-mass fraction for a single prime p.
// count = # of h in {1..p-1} with 1 - h/p < 1/(2 pi) (all at k = 1).
// share = fraction of the Fresnel majorant Sbar_p carried by those aliases.
function alphaOverOneShare(p) {
  let count = 0;
  for (let h = 1; h <= p - 1; h++) if (1 - h / p < 1 / TWO_PI) count += 1;
  let tot = 0;
  let over = 0;
  for (let j = 1; j <= (p - 1) / 2; j++) {
    const t = Math.pow(j, -2 / 3);
    tot += t;
    if (j / p < 1 / TWO_PI) over += t;
  }
  // p = 2 has an empty j-sum (tot = 0); its over-one fraction is 0 by count.
  const share = tot > 0 ? over / tot : 0;
  return {
    p,
    thresholdH: THRESHOLD_COEFF * p, // 0.8408 p
    hMin: p - count, // smallest h with alpha > 1 (p - count); no such h when count = 0
    overOneCount: count,
    totalAliases: p - 1,
    majorant: 2 * Math.pow(p, -4 / 3) * tot, // Sbar_p
    overOneShare: share,
  };
}

const SIEVING_PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
];

const ROWS = SIEVING_PRIMES.map((p) => {
  const s = alphaOverOneShare(p);
  return {
    p,
    thresholdH: s.thresholdH, // 0.8408 p
    hMin: s.overOneCount > 0 ? s.hMin : null, // null when no alpha > 1 alias exists
    overOneCount: s.overOneCount,
    totalAliases: s.totalAliases,
    overOneFraction: s.overOneShare, // N-independent
    overOnePercent: s.overOneShare * 100,
    alphaMaxLo: alphaOfXi(1 / p, N_LO), // floor alias h = p-1 at N = 690988
    alphaMaxHi: alphaOfXi(1 / p, N_HI), // floor alias h = p-1 at N = 54799999
    exempt: s.overOneCount === 0, // p <= 5 exemption
  };
});

// Aggregate cross-checks against imp-95519 section 4 spot values.
const rowFor = (p) => ROWS.find((r) => r.p === p);
const SMALL_PRIME_EXEMPT = ROWS.filter((r) => r.p <= 5).every((r) => r.exempt && r.overOneCount === 0);
const P7_PLUS_RANGE = (() => {
  const fr = ROWS.filter((r) => r.p >= 7).map((r) => r.overOnePercent);
  return { min: Math.min(...fr), max: Math.max(...fr) };
})();

export const IMP95540_ALPHA_OVER_ONE_FRACTION_TABLE = {
  ticket: 'imp-95540',
  source:
    'imp-95519 section 4 (Permuting the Zeta Twin Ladder eqs 15/16); alphaOverOneShare re-derived import-light',
  window: { N_LO, N_HI, note: 'alpha > 1 fraction is N-independent; alpha_max endpoints differ only in magnitude' },
  thresholdCoeff: THRESHOLD_COEFF, // 1 - 1/(2 pi) = 0.8408450569081046
  thresholdRule: 'alpha_{k,h} > 1 <=> k = 1 and h > (1 - 1/(2 pi)) p = 0.8408 p',
  rows: ROWS,
  crossChecks: {
    p97Fraction: rowFor(97).overOnePercent, // 59.26 (imp-95519: 59.26%)
    p97Count: `${rowFor(97).overOneCount}/${rowFor(97).totalAliases}`, // 15/96
    p97AlphaMaxLo: rowFor(97).alphaMaxLo, // 1.0953
    p97AlphaMaxHi: rowFor(97).alphaMaxHi, // 1.0730
    p7Fraction: rowFor(7).overOnePercent, // 47.38 (imp-95519: 47-60% for p >= 7)
    p7PlusRange: P7_PLUS_RANGE, // ~47.38 to ~59.49 percent
    smallPrimeExemptConfirmed: SMALL_PRIME_EXEMPT, // p <= 5 all zero
  },
  verdict:
    'The alpha > 1 majorant-mass fraction is N-flat (fixed by h/p vs 1/(2 pi)): it is 0 for p <= 5, 47.38% at p = 7, 59.26% at p = 97, and lies in the 35.09%-59.49% band for every p >= 7 (measured min at p = 11, max at p = 89) -- slightly wider than the 47-60% imp-95519 section 4 quoted from its small spot sample, with a shallow rise toward ~59% as p grows and dips to ~35-44% for the smaller p in {11, 17}. alpha_max stays in (1, 1.0953] across the whole window, so no alias crosses alpha = 1 as N moves. This tabulates imp-95519 section 4; it changes no bound and asserts no QED. No refereed bound is changed; the zero-side route stays PCC-gated for the p >= 7 primes.',
};

export default IMP95540_ALPHA_OVER_ONE_FRACTION_TABLE;
