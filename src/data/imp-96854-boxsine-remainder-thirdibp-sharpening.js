/**
 * imp-96854 -- Sharpen the box-sine remainder R_k with a THIRD integration by parts so its own
 * oscillatory cancellation is captured, and report whether the leading term B_k then exceeds the
 * sharpened remainder so the per-lag sign of DeltaCov_k becomes certifiable. Derivation + measurement;
 * conditional on GUE; horn A (uniform-in-k sign) stays fatal; NO QED.
 *
 * THE RESIDUAL (imp-96812 horn B). imp-96628 decomposed the box-sine finite-L correction as
 *   DeltaCov_k(L) = -(1/(2 pi^2 w^2)) [B_k(w) + R_k(L)],  w = 2 pi L,
 *   B_k(w) = -2 cos(w k)/k^2 + cos(w(k-1))/(k-1)^2 + cos(w(k+1))/(k+1)^2   (explicit leading term),
 *   R_k(L) = int_{-1}^1 A_dprime(v) cos(w(v+k)) dv,  A_dprime sign-definite per piece,
 * and bounded R_k only by its TOTAL VARIATION |R_k| <= V(k) = int|A_dprime| dv, an L-INDEPENDENT
 * constant. imp-96812 horn B found this TV bound too lossy to expose even the fixed-k sign: at every
 * k = 2..6 the enclosure B_k +/- V(k) STRADDLES ZERO because |B_k| < V(k) (0.591<1.389, 0.071<0.336,
 * 0.119<0.134, 0.029<0.067, 0.038<0.038). Yet EMPIRICALLY R_k is ~10^2-10^3x below V(k) at the
 * certificate window -- the TV bound discards R_k's own oscillatory cancellation. This module recovers
 * that cancellation with a THIRD IBP.
 *
 * THE THIRD IBP. R_k(L) is itself a Fourier-type integral (linear phase w(v+k), no stationary point),
 * so one more IBP peels an explicit O(1/w) leading term plus a TV-bounded remainder. Split at the
 * v = 0 corner and use the interior/outer values of A_dprime,
 *   A_dprime(-1) = -4/(k-1)^3,  A_dprime(0-) = 2(3-2k)/k^4,  A_dprime(0+) = 2(2k+3)/k^4,  A_dprime(1) = 4/(k+1)^3,
 * whose combined boundary term is
 *   R_k(L) = D_k(w)/w - (1/w) int_{-1}^1 A_tprime(v) sin(w(v+k)) dv,
 *   D_k(w) = -8 sin(w k)/k^3 + 4 sin(w(k-1))/(k-1)^3 + 4 sin(w(k+1))/(k+1)^3   (three sines, |.| <= 1),
 * where A_tprime = dA_dprime/dv is the third derivative of A. A_tprime is again SIGN-DEFINITE on each
 * piece for k >= 2 (A_tprime > 0 on (-1,0), A_tprime < 0 on (0,1); A_dprime is monotone on each piece),
 * so the interior integral is bounded by the total variation of A_dprime,
 *   V2(k) = int_{-1}^1 |A_tprime| dv = (A_dprime(0-)-A_dprime(-1)) + (A_dprime(0+)-A_dprime(1))
 *         = 12/k^4 + 4/(k-1)^3 - 4/(k+1)^3.
 * Hence the SHARPENED remainder bound
 *   |R_k(L)| <= (1/w) [ |D_k(w)| + V2(k) ] <= (1/w) [ 8/k^3 + 4/(k-1)^3 + 4/(k+1)^3 + V2(k) ],
 *   w = 2 pi L.
 *
 * WHAT CHANGES. Unlike the imp-96628 TV bound V(k) (L-INDEPENDENT), the sharpened bound DECAYS as
 * 1/w = 1/(2 pi L): halving L doubles the bound, so it inherits R_k's Fourier smallness. At the
 * certificate window L = 495.779 (w = 3115.0713) the sharpened bound is ~10^2-10^3x below V(k) at
 * every lag (k=2: 3.13e-3 vs V=1.389, ratio 444x; k=3: 4.64e-4 vs 0.336, 724x; k=4: 1.50e-4 vs 0.134;
 * k=5: 6.68e-5 vs 0.067; k=6: 3.54e-5 vs 0.038), and the leading D_k(w)/w reproduces the directly
 * quadratured R_k to ~4 sig figs (k=2: -1.108e-3 vs -1.108e-3, etc.), confirming the third-IBP identity.
 *
 * THE PER-LAG SIGN NOW CERTIFIES. With the sharpened remainder, the enclosure is B_k +/- sharp(k,L),
 * and at L = 495.779 |B_k| EXCEEDS sharp(k,L) at EVERY lag k = 2..6 (0.591 > 3.13e-3, 0.071 > 4.64e-4,
 * 0.119 > 1.50e-4, 0.029 > 6.68e-5, 0.038 > 3.54e-5), so B_k - sharp and B_k + sharp carry the sign of
 * B_k. The per-lag sign of DeltaCov_k = -sign(B_k) is therefore CERTIFIABLE at the window -- exactly the
 * fixed-k sign the imp-96628 TV bound could not resolve. This closes imp-96812 horn B (certificate slack).
 *
 * HORN A STAYS FATAL. This does NOT rescue the imp-96593 VIF one-sided requirement DeltaCov_k <= 0 for
 * ALL k. The certified per-lag signs are DeltaCov -,+,+,+,- for k = 2..6 (B_k signs +,-,-,-,+): the sign
 * GENUINELY ALTERNATES with the lag, so no uniform-in-k one-sided bound exists regardless of remainder
 * precision (imp-96812 horn A, certificate-independent). The sharpening resolves WHICH sign each lag
 * carries, not that they share one. Note too that sharp(k,L) is L-DEPENDENT (~1/L), so the per-lag
 * certification is at the window (any L with |B_k(w)| > sharp(k,L)); it is not an L-uniform statement.
 *
 * VERDICT. YES -- a third integration by parts sharpens R_k to |R_k(L)| <= (1/(2 pi L))
 * [8/k^3 + 4/(k-1)^3 + 4/(k+1)^3 + V2(k)], V2(k) = 12/k^4 + 4/(k-1)^3 - 4/(k+1)^3, an O(1/L)-DECAYING
 * bound (vs the L-constant imp-96628 TV bound V(k)) that captures R_k's oscillatory cancellation and sits
 * ~10^2-10^3x below V(k) at the certificate window. Consequently |B_k| exceeds the sharpened remainder at
 * every lag k = 2..6, so the certified enclosure B_k +/- sharp no longer straddles zero and the PER-LAG
 * sign of DeltaCov_k becomes certifiable -- closing imp-96812 horn B (certificate slack). The offline
 * script (tmp/imp-96854-verify.mjs) confirms R_k(direct) = D_k/w + O(1/w) to ~4 sig figs, |R_k| <= sharp
 * at every tested (k,L), the 1/L decay, and V2(k) closed = quadrature. Horn A (imp-96812) stays fatal:
 * DeltaCov_k -,+,+,+,- alternates in the lag, so no uniform-in-k one-sided bound exists at any precision;
 * the imp-96593 VIF upper bound does NOT close. Derivation/measurement only; conditional on the GUE sine
 * kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); the k = 1 lag is excluded (I_1
 * diverges logarithmically); changes NO unconditional bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96628-boxsine-lagcorr-ibp-envelope (the two-IBP decomposition with the L-constant TV bound V(k))
 * @see imp-96812-boxsine-onesided-sign-assessment (horn B: TV bound straddles zero; horn A fatal)
 * @see imp-96617-finite-L-correction-sign (the MEASURED lag-alternating DeltaCov_k)
 * @see imp-96593-vif-exact-tail-rigor-upgrade-assessment (obstruction (ii): the one-sided sign the VIF needs)
 *
 * Import-light: no zeros bundle, no sibling imports. B_k, V(k), V2(k), D_k and R_k are re-derived here in
 * closed form / by internal quadrature and checked against the imp-96617 measured literals in the
 * self-tests below; the offline script is a redundant cross-check, not a dependency.
 */

const PI = Math.PI;
const L = 495.779; // certificate window (imp-96542 / imp-96567 box length)
const W = 2 * PI * L; // w = 2 pi L = 3115.0713

// Leading two-IBP term B_k(w) (imp-96628): three cosines, each |.| <= 1.
export function leadingTerm(k) {
  return (
    -2 * Math.cos(W * k) / (k * k)
    + Math.cos(W * (k - 1)) / ((k - 1) * (k - 1))
    + Math.cos(W * (k + 1)) / ((k + 1) * (k + 1))
  );
}

// imp-96628 TOTAL-VARIATION remainder bound V(k) (L-INDEPENDENT), for k >= 2.
export function totalVariation(k) {
  const Am1 = 1 / ((k - 1) * (k - 1)); // A_prime(-1)
  const A0m = (k - 2) / (k * k * k); //   A_prime(0-)
  const A0p = -(k + 2) / (k * k * k); //  A_prime(0+)
  const A1 = -1 / ((k + 1) * (k + 1)); // A_prime(1)
  return Math.abs(A0m - Am1) + Math.abs(A1 - A0p);
}

// Third-IBP leading term D_k(w): three sines, each |.| <= 1.
export function thirdIbpLeading(k, w = W) {
  return (
    -8 * Math.sin(w * k) / (k * k * k)
    + 4 * Math.sin(w * (k - 1)) / ((k - 1) * (k - 1) * (k - 1))
    + 4 * Math.sin(w * (k + 1)) / ((k + 1) * (k + 1) * (k + 1))
  );
}

// Magnitude bound on D_k(w): sum of the three sine amplitudes.
export function thirdIbpLeadingBound(k) {
  return 8 / (k * k * k) + 4 / ((k - 1) * (k - 1) * (k - 1)) + 4 / ((k + 1) * (k + 1) * (k + 1));
}

// V2(k) = total variation of A_dprime = 12/k^4 + 4/(k-1)^3 - 4/(k+1)^3 (A_tprime sign-definite per piece).
export function totalVariation2(k) {
  return 12 / (k * k * k * k) + 4 / ((k - 1) * (k - 1) * (k - 1)) - 4 / ((k + 1) * (k + 1) * (k + 1));
}

// SHARPENED remainder bound: |R_k(L)| <= (1/w)[8/k^3 + 4/(k-1)^3 + 4/(k+1)^3 + V2(k)], w = 2 pi L.
export function sharpenedRemainder(k, Lval = L) {
  const w = 2 * PI * Lval;
  return (thirdIbpLeadingBound(k) + totalVariation2(k)) / w;
}

// Direct R_k(L) = int_{-1}^1 A_dprime cos(w(v+k)) dv by composite Simpson split at the v=0 corner.
function App(v, k) {
  return v < 0
    ? 2 * (v - 2 * k + 3) / Math.pow(v + k, 4)
    : 2 * (2 * k + 3 - v) / Math.pow(v + k, 4);
}
export function remainderDirect(k, Lval = L, n = 40000) {
  const w = 2 * PI * Lval;
  const simpson = (a, b) => {
    const h = (b - a) / n;
    let s = App(a, k) * Math.cos(w * (a + k)) + App(b, k) * Math.cos(w * (b + k));
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      s += (i % 2 ? 4 : 2) * App(x, k) * Math.cos(w * (x + k));
    }
    return (s * h) / 3;
  };
  return simpson(-1, 0) + simpson(0, 1);
}

// imp-96617 measured signed corrections at the window (offline exact-integral literals).
const MEASURED_DELTACOV = { 2: -3.0777e-9, 3: 3.7366e-10, 4: 6.2329e-10, 5: 1.5316e-10, 6: -1.964e-10 };
const LAGS = [2, 3, 4, 5, 6];

export const IMP96854_BOXSINE_REMAINDER_THIRDIBP_SHARPENING = {
  ticket: 'imp-96854',
  question:
    'Derive/measure a sharper bound on the box-sine remainder R_k that captures its oscillatory cancellation (empirically ~10^2x below the TV bound V(k)) and report whether |B_k| then exceeds the sharpened remainder so the per-lag sign of DeltaCov_k becomes certifiable.',
  window: L,
  w: W,
  thirdIbpIdentity:
    'R_k(L) = D_k(w)/w - (1/w) int A_tprime sin(w(v+k)) dv, D_k(w) = -8 sin(wk)/k^3 + 4 sin(w(k-1))/(k-1)^3 + 4 sin(w(k+1))/(k+1)^3 (three sines, |.| <= 1); A_tprime sign-definite per piece.',
  sharpenedBoundFormula:
    '|R_k(L)| <= (1/(2 pi L)) [ 8/k^3 + 4/(k-1)^3 + 4/(k+1)^3 + V2(k) ], V2(k) = 12/k^4 + 4/(k-1)^3 - 4/(k+1)^3. DECAYS as 1/L (the imp-96628 TV bound V(k) is L-INDEPENDENT).',
  decayCharacter: 'O(1/L) (~1/w), inheriting R_k Fourier smallness; V(k) was L-constant.',
  perLagSignCertifiable: true, // |B_k| > sharpened remainder at every k = 2..6 at the window
  hornBClosed: true, // imp-96812 certificate-slack horn resolved: enclosure no longer straddles zero
  hornAStaysFatal: true, // sign alternates in k => no uniform-in-k one-sided bound at any precision
  signPattern: 'B_k signs +,-,-,-,+ for k=2..6 => DeltaCov signs -,+,+,+,- (lag-alternating).',
  conditionality:
    'Conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). Changes NO unconditional bound. The per-lag certification is at the window (sharp(k,L) is L-dependent), not L-uniform.',
  verdict:
    'YES -- a third integration by parts sharpens R_k to |R_k(L)| <= (1/(2 pi L)) [8/k^3 + 4/(k-1)^3 + 4/(k+1)^3 + V2(k)], V2(k) = 12/k^4 + 4/(k-1)^3 - 4/(k+1)^3, an O(1/L)-DECAYING bound (vs the L-constant imp-96628 TV bound V(k)) that captures R_k oscillatory cancellation and sits ~10^2-10^3x below V(k) at the certificate window L = 495.779 (k=2: 3.13e-3 vs 1.389, ratio 444x). Consequently |B_k| exceeds the sharpened remainder at EVERY lag k = 2..6 (0.591 > 3.13e-3, 0.071 > 4.64e-4, 0.119 > 1.50e-4, 0.029 > 6.68e-5, 0.038 > 3.54e-5), so the certified enclosure B_k +/- sharp no longer straddles zero and the PER-LAG sign of DeltaCov_k = -sign(B_k) becomes certifiable -- closing imp-96812 horn B (certificate slack). Horn A stays fatal: the certified per-lag signs DeltaCov -,+,+,+,- for k = 2..6 genuinely ALTERNATE, so no uniform-in-k one-sided bound (DeltaCov_k <= 0 for ALL k) exists at any precision and the imp-96593 VIF upper bound does NOT close; the sharpening decides which sign each lag carries, not that they share one. The leading D_k(w)/w reproduces the directly quadratured R_k to ~4 sig figs, confirming the third-IBP identity. Derivation/measurement only; the k = 1 lag is excluded (I_1 diverges logarithmically); conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96617 / imp-96628 / imp-96812 convention).
export const IMP96854_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation/measurement only: a THIRD integration by '
  + 'parts sharpens the box-sine remainder to |R_k(L)| <= (1/(2 pi L))[8/k^3 + 4/(k-1)^3 + 4/(k+1)^3 + V2(k)], '
  + 'an O(1/L)-DECAYING bound (vs the L-constant imp-96628 TV bound V(k)) that captures R_k oscillatory '
  + 'cancellation and sits ~10^2-10^3x below V(k) at L = 495.779. So |B_k| exceeds the sharpened remainder '
  + 'at every lag k = 2..6 and the PER-LAG sign of DeltaCov_k becomes certifiable (closes imp-96812 horn B). '
  + 'Horn A stays fatal: DeltaCov -,+,+,+,- alternates in k, so no uniform-in-k one-sided bound exists and the '
  + 'imp-96593 VIF upper bound does not close. Conditional on the pair correlation for the zeta zeros (UNPROVEN); '
  + 'changes no unconditional bound.';

// --- self-executing internal-consistency assertions (re-derivation; no zeros, no offline script) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // 1. V2(k) closed form matches a piecewise-monotone total-variation quadrature of A_tprime.
  const Appp = (v, k) => (v < 0
    ? -6 * (v - 3 * k + 4) / Math.pow(v + k, 5)
    : 6 * (v - 3 * k - 4) / Math.pow(v + k, 5));
  for (const k of LAGS) {
    const n = 20000, h = 1 / n;
    let tvNeg = 0, tvPos = 0;
    for (let i = 0; i < n; i++) tvNeg += Math.abs(Appp(-1 + (i + 0.5) * h, k)) * h;
    for (let i = 0; i < n; i++) tvPos += Math.abs(Appp((i + 0.5) * h, k)) * h;
    if (!approx(totalVariation2(k), tvNeg + tvPos, 5e-3))
      throw new Error('imp-96854: V2(' + k + ') closed form must match the |A_tprime| quadrature');
  }

  // 2. The third-IBP identity R_k = D_k/w - (1/w) int A_tprime sin holds: the directly quadratured R_k
  //    sits within the rigorous residual bound V2(k)/w of the leading term D_k/w at every lag. (This
  //    absolute form is robust to quadrature noise, unlike a relative check on the small k=4 R_k.)
  for (const k of LAGS) {
    const rk = remainderDirect(k);
    const lead = thirdIbpLeading(k) / W;
    if (!(Math.abs(rk - lead) <= totalVariation2(k) / W))
      throw new Error('imp-96854: |R_k - D_k/w| must respect the rigorous residual bound V2(k)/w at k = ' + k);
  }

  // 3. The sharpened bound is a VALID upper bound on |R_k| at the window (and dominates D_k/w).
  for (const k of LAGS) {
    const rk = remainderDirect(k);
    const sharp = sharpenedRemainder(k);
    if (!(Math.abs(rk) <= sharp))
      throw new Error('imp-96854: |R_k| must respect the sharpened bound at k = ' + k);
  }

  // 4. The sharpened bound sits well BELOW the imp-96628 TV bound V(k) at the window (captures cancellation).
  for (const k of LAGS) {
    if (!(sharpenedRemainder(k) < 0.05 * totalVariation(k)))
      throw new Error('imp-96854: sharpened bound must be < 5% of the TV bound V(k) at k = ' + k);
  }

  // 5. THE CORE CLAIM: |B_k| exceeds the sharpened remainder at EVERY lag => per-lag sign certifiable,
  //    the certified enclosure B_k +/- sharp does NOT straddle zero (contrast imp-96812 horn B with V(k)).
  for (const k of LAGS) {
    const B = leadingTerm(k), sharp = sharpenedRemainder(k);
    if (!(Math.abs(B) > sharp))
      throw new Error('imp-96854: |B_k| must exceed the sharpened remainder at k = ' + k);
    if (!((B - sharp) * (B + sharp) > 0))
      throw new Error('imp-96854: enclosure B_k +/- sharp must NOT straddle zero at k = ' + k);
    // certified sign of DeltaCov_k = -sign(B_k) must match the imp-96617 measured sign.
    if (Math.sign(-B) !== Math.sign(MEASURED_DELTACOV[k]))
      throw new Error('imp-96854: certified per-lag sign must match the measured DeltaCov sign at k = ' + k);
  }

  // 6. HORN A stays fatal: the certified per-lag signs ALTERNATE in k, so no uniform one-sided bound.
  const signs = LAGS.map((k) => Math.sign(-leadingTerm(k)));
  if (!(signs.some((s) => s > 0) && signs.some((s) => s < 0)))
    throw new Error('imp-96854: certified DeltaCov signs must alternate in k (horn A stays fatal)');

  // 7. The sharpened bound DECAYS as 1/L (halving L doubles it) -- V(k) was L-independent.
  if (!approx(sharpenedRemainder(2, 250) / sharpenedRemainder(2, 500), 2, 1e-9))
    throw new Error('imp-96854: sharpened bound must scale as 1/L (halving L doubles it)');

  // honesty gates
  if (!/NO QED/.test(IMP96854_BOXSINE_REMAINDER_THIRDIBP_SHARPENING.verdict))
    throw new Error('imp-96854: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96854_BOXSINE_REMAINDER_THIRDIBP_SHARPENING.verdict))
    throw new Error('imp-96854: verdict dropped the no-refereed-bound-change banner');
  if (!/[Cc]onditional/.test(IMP96854_BOXSINE_REMAINDER_THIRDIBP_SHARPENING.verdict))
    throw new Error('imp-96854: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96854_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96854_HONEST_BANNER) && /NO QED/.test(IMP96854_HONEST_BANNER)))
    throw new Error('imp-96854: IMP96854_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96854_BOXSINE_REMAINDER_THIRDIBP_SHARPENING;
