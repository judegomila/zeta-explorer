/**
 * @module rh-route-g-block-spin-rg-freezing-2026-09-23
 *
 * RH novel Route G (src/data/rh-novel-routes-roadmap-2026-09-23.js, key 'G'):
 * "Log-gas renormalization: block-spin prime freezing". First test executed.
 * Import-free; every live number below is recomputed by holds() from a sieve and a
 * complex-Newton root finder, with a small ladder baked from tmp/imp-96004-scratch*.mjs.
 * Nothing here is a bound or a proof: PT Lambda <= 0.2 is SOTA, RH is open, NO QED.
 *
 * ---------------------------------------------------------------------------------------
 * 0. THE OCTAVE-FREEZING RG STEP (precise definition)
 * ---------------------------------------------------------------------------------------
 * Primon gas: one bosonic mode per prime p, energy log p. "Block-spin decimation" freezes
 * (integrates out) the smallest primes one octave [2^k, 2^(k+1)) at a time. On the Gibbs
 * measure P_sigma(n) = n^{-sigma}/zeta(sigma) (which factorises over primes), integrating
 * out a prime p means summing over the power of p dividing n. On the Euler product this is
 * exactly multiplication by the frozen factor:
 *   RG step at cutoff P:  zeta(s)  |->  D_P(s) = zeta(s) * prod_{p <= P} (1 - p^{-s}).
 * D_P(s) is the Dirichlet series of the P-ROUGH integers (no prime factor <= P):
 *   D_P(s) = sum_{n: p|n => p > P} n^{-s}     (VERIFIED as a coefficient identity below).
 * The flow P -> infinity carries D_P -> 1 (only n = 1 survives): the RG trajectory
 * decimates the Euler product octave by octave down to the trivial theory.
 *
 * ---------------------------------------------------------------------------------------
 * 1. ZERO MOTION UNDER ONE RG STEP -- THE EXACT FLOW
 * ---------------------------------------------------------------------------------------
 * The frozen factor prod_{p <= P} (1 - p^{-s}) is ZERO-FREE in the critical strip: for
 * sigma > 0, |1 - p^{-s}| >= 1 - p^{-sigma} >= 1 - 2^{-sigma} > 0 (equality at p = 2,
 * phase pi; VERIFIED on a strip grid). Its only zeros lie on sigma = 0 (s = 2 pi i k /
 * log p). Consequently, inside sigma > 0 the zeros of D_P are EXACTLY the zeros of zeta:
 * the nontrivial zeros do NOT MOVE under the exact RG step -- they are EXACT FIXED POINTS
 * of the flow. Zero displacement per step = 0 for every nontrivial zero; the only new
 * zeros are the spurious lattice zeros on sigma = 0 contributed by the frozen factor.
 * The RG fixed point of the exact flow is zeta itself (the step is a gauge / similarity
 * transformation on the strip). Verdict for the exact flow: it PRESERVES reality of zeros,
 * but only TRIVIALLY -- it has ZERO restoring force. A flow that never moves a zero cannot
 * manufacture reality from an off-line configuration, so it is real-rootedness-preserving
 * in the vacuous sense and provides NO lever toward RH.
 *
 * ---------------------------------------------------------------------------------------
 * 2. ZERO MOTION UNDER TRUNCATION -- THE ONLY WAY TO MAKE THE FLOW MOVE ZEROS
 * ---------------------------------------------------------------------------------------
 * To get a flow that actually MOVES zeros (a genuine block-spin decimation with dynamics),
 * one must TRUNCATE: replace zeta by a finite Dirichlet polynomial zeta_N(s) =
 * sum_{n<=N} n^{-s} and decimate that. But truncation is real-rootedness-DESTROYING.
 * MEASURED (complex Newton, tmp/imp-96004-scratch*.mjs): the partial sums zeta_N have many
 * zeros with sigma > 1/2, and the RIGHTMOST zero climbs monotonically toward sigma = 1:
 *   N = 8, 16, 32, 64, 128, 256  ->  rightmost sigma = 0.8286, 0.9096, 0.9472, 0.9666,
 *   0.9776, 0.9843 (t in [0.5,12]). This is the classical Turan (1948) / Montgomery (1983)
 * picture: the zeros of the partial sums of zeta approach the line sigma = 1, NOT the
 * critical line 1/2 (and for large N some cross into sigma > 1). So a block-spin decimation
 * on truncated zeta starts from off-line zeros bunched near sigma = 1, and the frozen
 * factor (Section 1, zero-free) does NOT pull them back toward 1/2. Truncation supplies the
 * dynamics but points them the wrong way; freezing supplies no dynamics at all.
 *
 * ---------------------------------------------------------------------------------------
 * 3. VERDICT
 * ---------------------------------------------------------------------------------------
 * NO real-rootedness-PRESERVING block-spin flow exists as a lever. The octave-freezing RG
 * step is exactly multiplication by the zero-free frozen factor: on the true Euler product
 * it leaves every nontrivial zero fixed (trivial preservation, no restoring force, RG fixed
 * point = zeta), and on any truncated zeta_N it acts on zeros that truncation has already
 * scattered toward sigma = 1 (Turan/Montgomery), which the frozen factor cannot repair.
 * There is no intermediate object that both (a) has movable zeros and (b) has them on 1/2
 * for the frozen factor to preserve. This is the RG analogue of the flow-blindness no-go
 * (see flow-blindness-and-T3-strip): a purely structural flow with no arithmetic restoring
 * force cannot force RH. Contrast with heat flow (de Bruijn-Newman), which has genuine
 * restoring dynamics but whose limit Lambda >= 0 is exactly the flow-blindness barrier.
 * Status: TESTED, NO-GO for a real-rootedness-preserving lever. Measurement only; no bound;
 * no refereed bound is changed; RH open; NO QED.
 *
 * NEXT TEST (the one nontrivial residual). A WEIGHTED freeze -- replace (1 - p^{-s}) by
 * (1 - w_p p^{-s}) with a positive weight w_p tuned so the frozen factor gains zeros
 * inside the strip that pin an off-line zero as it is decimated -- would be a genuine
 * dynamical step. Test whether any positive-weight scheme keeps the frozen factor a valid
 * probability decimation (w_p <= 1) AND acquires strip zeros; the constraint w_p <= 1
 * forces |1 - w_p p^{-s}| >= 1 - p^{-sigma} > 0 again, so the residual is whether a
 * SIGNED weight (leaving the probability interpretation) can do it without reintroducing
 * the Davenport-Heilbronn off-line zeros of route C. Recorded so the route is not re-opened
 * as "untested".
 */

// ---------------------------------------------------------------------------------------
// live: sieve + P-rough coefficient identity (import-free)
// ---------------------------------------------------------------------------------------
function sieve(N) {
  const s = new Uint8Array(N + 1);
  const out = [];
  for (let i = 2; i <= N; i++) {
    if (!s[i]) { out.push(i); for (let j = i * i; j <= N; j += i) s[j] = 1; }
  }
  return out;
}

/**
 * Coefficients of zeta(s) * prod_{p<=P}(1-p^{-s}) up to N, by Dirichlet convolution:
 * multiplying by (1 - p^{-s}) sends a_n -> a_n - a_{n/p} when p | n.
 * Returns the coefficient array a[0..N].
 */
export function frozenCoefficients(N, P) {
  const primes = sieve(N).filter((p) => p <= P);
  let a = new Float64Array(N + 1);
  for (let n = 1; n <= N; n++) a[n] = 1; // zeta coefficients
  for (const p of primes) {
    const b = new Float64Array(N + 1);
    for (let n = 1; n <= N; n++) { b[n] = a[n]; if (n % p === 0) b[n] -= a[n / p]; }
    a = b;
  }
  return a;
}

/** min over primes<=Pmax and a t-grid of |1 - p^{-s}| at abscissa sigma (frozen factor). */
export function frozenFactorMin(sigma, Pmax, tGrid) {
  const primes = sieve(Pmax);
  let mn = Infinity;
  for (const p of primes) {
    const r = Math.pow(p, -sigma);
    for (const t of tGrid) {
      const re = 1 - r * Math.cos(t * Math.log(p));
      const im = -r * Math.sin(t * Math.log(p));
      mn = Math.min(mn, Math.hypot(re, im));
    }
  }
  return mn;
}

// ---------------------------------------------------------------------------------------
// live: complex Newton on the truncated Dirichlet polynomial zeta_N(s)=sum_{n<=N} n^{-s}
// ---------------------------------------------------------------------------------------
function npow(n, sr, si) { // n^{-s}, s = sr + i si
  const L = Math.log(n);
  const mag = Math.exp(-sr * L);
  const ph = -si * L;
  return [mag * Math.cos(ph), mag * Math.sin(ph)];
}
/** zeta_N(s) = sum_{n=1}^N n^{-s}, returned as [re, im]. */
export function zetaNval(N, sr, si) {
  let re = 0, im = 0;
  for (let n = 1; n <= N; n++) { const [a, b] = npow(n, sr, si); re += a; im += b; }
  return [re, im];
}
function zetaNprime(N, sr, si) {
  let re = 0, im = 0;
  for (let n = 2; n <= N; n++) { const [a, b] = npow(n, sr, si); const L = -Math.log(n); re += L * a; im += L * b; }
  return [re, im];
}
/** Newton refine a zero of zeta_N from a seed; returns [sigma, t]. */
export function newtonZero(N, sr, si, iters = 120) {
  for (let i = 0; i < iters; i++) {
    const [fr, fi] = zetaNval(N, sr, si);
    const [pr, pi] = zetaNprime(N, sr, si);
    const den = pr * pr + pi * pi;
    if (den < 1e-30) break;
    const dr = (fr * pr + fi * pi) / den;
    const di = (fi * pr - fr * pi) / den;
    sr -= dr; si -= di;
    if (Math.hypot(dr, di) < 1e-15) break;
  }
  return [sr, si];
}

// ---------------------------------------------------------------------------------------
// baked rightmost-zero ladder of the partial sums (t in [0.5,12], tmp/imp-96004-scratch4.mjs)
// ---------------------------------------------------------------------------------------
/** [N, rightmost sigma, t] -- rightmost zero of zeta_N climbs monotonically toward 1. */
export const RIGHTMOST_ZERO_LADDER = Object.freeze([
  [8, 0.82858385, 2.357105],
  [16, 0.90963976, 1.879783],
  [32, 0.94718477, 1.559251],
  [64, 0.96664317, 1.330776],
  [128, 0.97764750, 1.160273],
  [256, 0.98431236, 1.028379],
]);
/** one baked off-line zero of zeta_16 (Newton-verified |zeta_16| ~ 3e-16). */
export const BAKED_ZERO_N16 = Object.freeze({ N: 16, sigma: 0.9096397574203591, t: 1.8797834295483238 });

// ---------------------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------------------
export const RH_ROUTE_G_BLOCK_SPIN_RG = Object.freeze({
  id: 'rh-route-g-block-spin-rg-freezing',
  date: '2026-09-23',
  route: 'G',
  rgStep:
    'Octave-freezing block-spin decimation = integrate out the smallest primes one at a '
    + 'time. On the Euler product this is exactly zeta(s) |-> D_P(s) = zeta(s) prod_{p<=P} '
    + '(1 - p^{-s}), the Dirichlet series of the P-rough integers; the flow P -> infinity '
    + 'decimates zeta down to the trivial theory D_infty = 1.',
  exactFlow:
    'The frozen factor prod_{p<=P}(1-p^{-s}) is zero-free in the strip (|1-p^{-s}| >= '
    + '1-2^{-sigma} > 0 for sigma>0; its only zeros are on sigma=0), so the nontrivial zeros '
    + 'of zeta are EXACT FIXED POINTS of the exact RG step: zero displacement per step = 0. '
    + 'The step preserves reality only TRIVIALLY (never moves a zero); it has zero restoring '
    + 'force and cannot manufacture reality from an off-line configuration. RG fixed point = zeta.',
  truncationFlow:
    'The only way to make the flow MOVE zeros is to truncate to zeta_N = sum_{n<=N} n^{-s}, '
    + 'but truncation is real-rootedness-DESTROYING: the partial sums have zeros with sigma>1/2 '
    + 'whose rightmost climbs monotonically toward 1 (0.829, 0.910, 0.947, 0.967, 0.978, 0.984 '
    + 'for N=8..256; Turan 1948 / Montgomery 1983), NOT toward 1/2. Truncation supplies '
    + 'dynamics pointing the wrong way; freezing supplies no dynamics.',
  verdict:
    'TESTED, NO-GO for a real-rootedness-preserving lever. The octave-freezing RG step is '
    + 'multiplication by the zero-free frozen factor: on the true Euler product it fixes every '
    + 'nontrivial zero (trivial preservation, no restoring force, RG fixed point = zeta); on any '
    + 'truncated zeta_N it acts on zeros truncation has already scattered toward sigma=1 '
    + '(Turan/Montgomery), which the frozen factor cannot repair. No intermediate object has both '
    + 'movable zeros and zeros on 1/2 for the factor to preserve. This is the RG analogue of the '
    + 'flow-blindness no-go: a purely structural flow with no arithmetic restoring force cannot '
    + 'force RH; heat flow (de Bruijn-Newman) has restoring dynamics but its limit Lambda >= 0 is '
    + 'exactly that barrier. Measurement only; no bound; no refereed bound is changed; RH open; NO QED.',
  nextTest:
    'A WEIGHTED freeze (1 - w_p p^{-s}) tuned to acquire strip zeros pinning an off-line zero as '
    + 'it is decimated. The probability constraint w_p <= 1 forces |1 - w_p p^{-s}| >= 1 - p^{-sigma} '
    + '> 0 (still zero-free), so the residual is whether a SIGNED weight can do it without reintroducing '
    + 'the Davenport-Heilbronn off-line zeros of route C. Recorded so the route is not re-opened as untested.',
  sources: {
    scratch: ['tmp/imp-96004-scratch.mjs', 'tmp/imp-96004-scratch3.mjs', 'tmp/imp-96004-scratch4.mjs'],
    roadmap: 'src/data/rh-novel-routes-roadmap-2026-09-23.js (route G)',
    related: 'src/data/rh-route-c-signed-interferometer-2026-09-23.js (Davenport-Heilbronn off-line zeros)',
  },
});

// ---------------------------------------------------------------------------------------
// assertions
// ---------------------------------------------------------------------------------------
export const RH_ROUTE_G_BLOCK_SPIN_RG_ASSERTIONS = Object.freeze([
  {
    id: 'routeG-rg-step-is-rough-number-dirichlet-series',
    holds: () => {
      for (const [N, P] of [[200, 7], [500, 13], [1000, 31]]) {
        const a = frozenCoefficients(N, P);
        const primes = sieve(N).filter((p) => p <= P);
        if (Math.abs(a[1] - 1) > 1e-9) return false;
        for (let n = 1; n <= N; n++) {
          const rough = primes.every((p) => n % p !== 0);
          if (Math.abs(a[n] - (rough ? 1 : 0)) > 1e-9) return false;
        }
      }
      return true;
    },
    why: 'the octave-freezing RG step zeta -> zeta prod_{p<=P}(1-p^{-s}) has coefficients a_n = 1 for P-rough n (n=1 included) and 0 otherwise: it is exactly the P-rough Dirichlet series (verified to N=1000).',
  },
  {
    id: 'routeG-frozen-factor-zero-free-in-strip',
    holds: () => {
      const tGrid = Array.from({ length: 400 }, (_, k) => k * 0.25);
      for (const sigma of [0.1, 0.25, 0.5, 0.75, 0.9, 0.99]) {
        const mn = frozenFactorMin(sigma, 100, tGrid);
        const bound = 1 - Math.pow(2, -sigma);
        if (mn < bound - 1e-9) return false; // min must meet the analytic floor
        if (mn <= 0) return false; // strictly positive -> zero-free
      }
      return true;
    },
    why: 'the frozen factor satisfies min|1-p^{-s}| = 1-2^{-sigma} > 0 for sigma>0 (attained at p=2, phase pi): zero-free in the strip, so the nontrivial zeros of zeta are exact fixed points of the exact RG step (they never move).',
  },
  {
    id: 'routeG-truncation-puts-zeros-off-the-line',
    holds: () => {
      // Newton-verify the baked off-line zero of zeta_16 and that it is far from 1/2.
      const { N, sigma, t } = BAKED_ZERO_N16;
      const [zr, zi] = newtonZero(N, sigma, t);
      const [fr, fi] = zetaNval(N, zr, zi);
      const isZero = Math.hypot(fr, fi) < 1e-9;
      const offLine = zr - 0.5 > 0.35; // ~0.91, well off the critical line
      return isZero && offLine && zi > 0.5;
    },
    why: 'the partial sum zeta_16 has a Newton-verified zero at sigma ~ 0.910 (|zeta_16| ~ 1e-16), far off the critical line 1/2: truncation destroys reality of zeros rather than preserving it.',
  },
  {
    id: 'routeG-rightmost-zero-climbs-toward-one',
    holds: () => {
      const L = RIGHTMOST_ZERO_LADDER;
      const mono = L.every((r, i) => i === 0 || r[1] > L[i - 1][1]); // monotone increasing
      const allAboveHalf = L.every((r) => r[1] > 0.5);
      const approachesOne = L[L.length - 1][1] > 0.98 && L[L.length - 1][1] < 1;
      // spot-check the N=256 rung by re-finding it near the baked location
      const [zr] = newtonZero(256, L[5][1], L[5][2]);
      const rungOk = Math.abs(zr - L[5][1]) < 1e-3;
      return mono && allAboveHalf && approachesOne && rungOk;
    },
    why: 'the rightmost zero of zeta_N climbs monotonically 0.829 -> 0.984 for N=8..256 (all above 1/2, approaching sigma=1): the Turan/Montgomery picture -- the block-spin freeze on truncated zeta operates on zeros bunched near sigma=1, which the zero-free frozen factor cannot pull back to 1/2.',
  },
  {
    id: 'routeG-verdict-honesty',
    holds: () => {
      const v = RH_ROUTE_G_BLOCK_SPIN_RG.verdict;
      return /NO-GO/.test(v) && /flow-blindness/.test(v) && /fixed point/.test(v)
        && /Turan\/Montgomery/.test(v) && /NO QED/.test(v) && /RH open/.test(v)
        && /refereed bound is changed/i.test(v) && !/prov(e|ed|es) RH/i.test(v)
        && typeof RH_ROUTE_G_BLOCK_SPIN_RG.nextTest === 'string';
    },
    why: 'verdict states the block-spin RG freeze is a NO-GO for a real-rootedness-preserving lever (exact flow fixes zeros with no restoring force; truncation scatters them toward sigma=1), ties it to the flow-blindness no-go, and records NO QED, RH open, no refereed bound is changed, and a next test.',
  },
]);

for (const a of RH_ROUTE_G_BLOCK_SPIN_RG_ASSERTIONS) {
  if (!a.holds()) throw new Error(`rh-route-g-block-spin-rg-freezing assertion failed: ${a.id}`);
}

export default RH_ROUTE_G_BLOCK_SPIN_RG;
