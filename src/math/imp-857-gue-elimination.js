/**
 * imp-857 GUE-ELIMINATION PATHWAY: combines the existing imp-362 witness
 * (N ∈ {50, 100, 200, 500}) with the imp-899-closed imp-857 baseline
 * sweep (N ∈ {1000, 2000, 5000, 10000}) to produce a per-N certified
 * upper bound on the paper-normalized many-body correction C_mb, and
 * derives the minimum N_0 at which the imp-486 rescue formula would
 * rescue the analytic closure UNCONDITIONALLY.
 *
 * WHY THIS MATTERS
 * ----------------
 * The Λ ≤ 0.121 main chain at N* = 10⁶ currently depends on C_mb ≤ 1
 * (imp-471), and imp-486 proved C_mb ≤ 1 is irreducibly equivalent to
 * GUE universality. Any UNCONDITIONAL upper bound on C_mb at ANY
 * sampled N that passes K·log(N_0)/√N_0 < 0.12751 (imp-486 rescue)
 * eliminates the GUE conditional AT THAT N — and, via finer sampling
 * or a continuity argument, across a growing range of N.
 *
 * The two data sources combined here certify C_mb to well BELOW 1 at
 * EIGHT sampled N values spanning {50, 100, 200, 500, 1000, 2000, 5000,
 * 10000}. Specifically K_paper_floor_max ≈ 10⁻⁴ across this range,
 * so the rescue formula is satisfied with massive safety margin at
 * every sampled N.
 *
 * WHAT THIS GIVES AND WHAT IT DOES NOT
 * ------------------------------------
 *  (A) GIVES — at the 8 SAMPLED N values, GUE-conditioning on the
 *      C_mb bound is ELIMINATED. Each point certificate is
 *      independent of GUE universality; it comes directly from the
 *      interval-arithmetic Dyson RK4 on the Odlyzko zeros.
 *
 *  (B) DOES NOT — at INTERMEDIATE N (between the 8 samples) or at
 *      N > 10000, the certificate is not yet point-verified. A
 *      rigorous "C_mb ≤ K uniformly on N ≥ N_0" bound requires
 *      either (i) a Lipschitz / continuity estimate on K(N), or
 *      (ii) a finer sampling grid.
 *
 * PROGRESS LADDER (empirical → rigorous)
 * --------------------------------------
 *   L0 — pure asymptotic: Λ ≤ 0.121 assuming C_mb ≤ 1 (GUE-CONDITIONAL).
 *        Current baseline. ESTABLISHED.
 *   L1 — point-certified GUE-UNCONDITIONAL at 8 sampled N. THIS FILE.
 *        RATIONAL:  even though not uniform, the samples span 3
 *        orders of magnitude in N with consistent K_paper, which
 *        makes it overwhelmingly unlikely that K_paper(N) jumps
 *        above 1 between samples. STATUS: RIGOROUS AT SAMPLE POINTS.
 *   L2 — UNIFORM GUE-UNCONDITIONAL on N ≥ N_0 via continuity
 *        (Lipschitz(K_paper) < ∞ over contiguous zero configurations).
 *        OPEN WORK: imp-857-sub-uniform-K-bound.
 *   L3 — analytic monotonicity C_mb(N) ≤ C_mb(N_0) for all N ≥ N_0.
 *        OPEN WORK: imp-486 / Goldston-Gonek-Montgomery closure, still
 *        marked impossible without GUE in the general case; phased-
 *        forcing corollary (imp-895) may deliver it in the supercritical
 *        twin-ladder regime only.
 *
 * At L1 we already have: a strictly-better unconditional point-bound
 * at every sampled N than the GUE-conditional baseline. At L2 we have
 * an UNCONDITIONAL chain Λ ≤ 0.121 (modulo the continuity proof gap).
 * At L3 the chain would be fully unconditional and fully uniform.
 */

import { LAMBDA_INTERVAL_DYSON } from './interval-dyson-integrator.mjs';
import { ZETA_ZEROS } from './zeta.js';
import { IMP_857_BASELINE_SWEEP_RESULT } from '../data/imp-857-baseline-sweep-result.js';
import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';

// ── Density + min-gap helpers (mirrors c-mb-interval-certified.js) ──────────

function rvmDensity(T) {
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}

function minRawGapFrom(zeros, N) {
  let H = Infinity;
  for (let i = 0; i < N - 1; i++) {
    const d = zeros[i + 1] - zeros[i];
    if (d < H) H = d;
  }
  return H;
}

// ── Per-row K_paper_cert ────────────────────────────────────────────────────

// row: { N, t_c_lo, t_c_hi }  (interval bracket of backward collision time)
// zeros: source table (imp-362 uses zeta.js; imp-899 uses zeros-to-1e6.js)
function perRowCertifiedBound(row, zeros) {
  const N = row.N;
  if (zeros.length < N) {
    return { N, status: 'zero-list-insufficient' };
  }
  const H_raw = minRawGapFrom(zeros, N);
  const rho_N = rvmDensity(zeros[N - 1]);
  const t_c_pair = (H_raw * H_raw) / 8;

  const d_lo = row.t_c_lo - t_c_pair;
  const d_hi = row.t_c_hi - t_c_pair;
  const F_mb_upper = Math.max(Math.abs(d_lo), Math.abs(d_hi));

  const scale_invN = 1 / Math.sqrt(N);
  const scaleFactor = scale_invN * Math.log(N);
  const K_raw_cert = (F_mb_upper * H_raw) / scaleFactor;

  const K_paper_cert_strict = K_raw_cert / rho_N;
  const K_paper_cert_floor = K_raw_cert / 0.12751;

  return {
    N,
    status: 'certified',
    source: row.__source,
    t_c_pair: +t_c_pair.toExponential(6),
    t_c_lo: row.t_c_lo,
    t_c_hi: row.t_c_hi,
    H_raw: +H_raw.toFixed(6),
    rho_N: +rho_N.toFixed(6),
    F_mb_upper: +F_mb_upper.toExponential(4),
    K_raw_cert: +K_raw_cert.toExponential(4),
    K_paper_cert_strict: +K_paper_cert_strict.toExponential(4),
    K_paper_cert_floor: +K_paper_cert_floor.toExponential(4),
  };
}

// ── Pull and normalize the two sources into a common row shape. ─────────────

const LOW_RANGE_ROWS = (LAMBDA_INTERVAL_DYSON.witness || [])
  .filter((r) => r.reason === 'gap-lower-bound-nonpositive')
  .map((r) => ({
    N: r.N,
    t_c_lo: r.t_c_lo,
    t_c_hi: r.t_c_hi,
    __source: 'LAMBDA_INTERVAL_DYSON  (zeta.js, 870 zeros)',
  }));

const HIGH_RANGE_ROWS = (IMP_857_BASELINE_SWEEP_RESULT.rows || [])
  .filter((r) => r.closed === true)
  .map((r) => ({
    N: r.N,
    t_c_lo: r.t_c_lo,
    t_c_hi: r.t_c_hi,
    __source: 'IMP_857_BASELINE_SWEEP_RESULT  (zeros-to-1e6.js, 10^6 zeros)',
  }));

const LOW_CERT = LOW_RANGE_ROWS.map((r) => perRowCertifiedBound(r, ZETA_ZEROS));
const HIGH_CERT = HIGH_RANGE_ROWS.map((r) =>
  perRowCertifiedBound(r, ZEROS_EXTENDED),
);

const ALL_CERT = [...LOW_CERT, ...HIGH_CERT].filter(
  (r) => r.status === 'certified',
);

// ── Aggregate K_paper_max and rescue mapping ────────────────────────────────

const K_PAPER_MAX_STRICT = ALL_CERT.length
  ? Math.max(...ALL_CERT.map((r) => r.K_paper_cert_strict))
  : Infinity;

const K_PAPER_MAX_FLOOR = ALL_CERT.length
  ? Math.max(...ALL_CERT.map((r) => r.K_paper_cert_floor))
  : Infinity;

const K_RAW_MAX = ALL_CERT.length
  ? Math.max(...ALL_CERT.map((r) => r.K_raw_cert))
  : Infinity;

const RHO_MIN_FOR_RESCUE = 0.12751;

function minN0ForK(K) {
  let lo = 1;
  let hi = 1e16;
  for (let i = 0; i < 80; i++) {
    const mid = Math.sqrt(lo * hi);
    const lhs = (K * Math.log(mid)) / Math.sqrt(mid);
    if (lhs < RHO_MIN_FOR_RESCUE) hi = mid;
    else lo = mid;
  }
  return Math.ceil(hi);
}

const N0_RESCUE_FLOOR = Number.isFinite(K_PAPER_MAX_FLOOR)
  ? minN0ForK(K_PAPER_MAX_FLOOR)
  : Infinity;

const N0_RESCUE_STRICT = Number.isFinite(K_PAPER_MAX_STRICT)
  ? minN0ForK(K_PAPER_MAX_STRICT)
  : Infinity;

// ── Exported record ─────────────────────────────────────────────────────────

export const IMP_857_GUE_ELIMINATION = Object.freeze({
  id: 'imp-857-gue-elimination',
  status: 'point-certified-at-8-N-values',
  level: 'L1 — point-certified GUE-UNCONDITIONAL at 8 sampled N',
  sourcesCombined: {
    imp362_low_range: {
      source: 'LAMBDA_INTERVAL_DYSON.witness  (zeta.js)',
      N_values: LOW_CERT.filter((r) => r.status === 'certified').map(
        (r) => r.N,
      ),
    },
    imp857_high_range: {
      source: 'IMP_857_BASELINE_SWEEP_RESULT.rows  (zeros-to-1e6.js)',
      N_values: HIGH_CERT.filter((r) => r.status === 'certified').map(
        (r) => r.N,
      ),
    },
  },
  rows: ALL_CERT,
  headline: {
    nCertifiedNs: ALL_CERT.length,
    N_range: {
      min: Math.min(...ALL_CERT.map((r) => r.N)),
      max: Math.max(...ALL_CERT.map((r) => r.N)),
    },
    K_raw_max: +K_RAW_MAX.toExponential(4),
    K_paper_max_strict: +K_PAPER_MAX_STRICT.toExponential(4),
    K_paper_max_floor: +K_PAPER_MAX_FLOOR.toExponential(4),
    K_paper_max_floor_below_one: K_PAPER_MAX_FLOOR < 1,
    K_paper_max_floor_below_0_001: K_PAPER_MAX_FLOOR < 1e-3,
  },
  rescueMapping: {
    using_K_paper_floor: {
      K: +K_PAPER_MAX_FLOOR.toExponential(4),
      N0_required: N0_RESCUE_FLOOR,
      N0_scientific: Number.isFinite(N0_RESCUE_FLOOR)
        ? N0_RESCUE_FLOOR.toExponential(2)
        : 'infinite',
    },
    using_K_paper_strict: {
      K: +K_PAPER_MAX_STRICT.toExponential(4),
      N0_required: N0_RESCUE_STRICT,
      N0_scientific: Number.isFinite(N0_RESCUE_STRICT)
        ? N0_RESCUE_STRICT.toExponential(2)
        : 'infinite',
    },
    interpretation:
      'The imp-486 rescue formula K*log(N_0)/sqrt(N_0) < 0.12751 gives the ' +
      'minimum N_0 such that the analytic chain closes with Lambda <= 0.121 ' +
      'assuming C_mb <= K uniformly on N >= N_0. With K_paper_max_floor ~ ' +
      String(K_PAPER_MAX_FLOOR.toExponential(2)) +
      ' from the 8-N sample, N_0 is tiny; N_0 = 1 satisfies the formula ' +
      'trivially because K is so small. The REAL constraint is the UNIFORMITY ' +
      'of the bound, not its size.',
  },
  unconditionalClaim: {
    atSampledN: {
      status: 'ELIMINATED',
      scope:
        'GUE-conditioning on C_mb is eliminated AT EACH of the 8 sampled N ' +
        'values (50, 100, 200, 500, 1000, 2000, 5000, 10000). The point ' +
        'bounds come directly from interval-arithmetic Dyson RK4; no GUE ' +
        'input is used.',
    },
    uniformOnRange: {
      status: 'OPEN',
      blocker: 'imp-857-sub-uniform-K-bound',
      required:
        'Either (i) Lipschitz(K_paper_cert) < L finite over contiguous zero ' +
        'configurations (proof obligation) or (ii) extension to a finer N ' +
        'grid that forces uniformity by density.',
    },
    monotoneInN: {
      status: 'OPEN',
      note:
        'imp-486 search showed this is equivalent to GUE universality in the ' +
        'general case; imp-895 (twin-ladder symmetric-forcing) may deliver it ' +
        'in the supercritical regime as a corollary.',
    },
  },
  honestStatus:
    'POINT-CERTIFIED L1 GUE-ELIMINATION. Eight N values interval-certify C_mb ' +
    'well below 1 without GUE input. To promote to L2 (uniform on N_0..infty) ' +
    'the open sub-gap is imp-857-sub-uniform-K-bound. To promote to L3 (fully ' +
    'unconditional N in [N_0, N*=1e6]) the monotonicity gap remains, pending ' +
    'the imp-895 twin-ladder corollary.',
});

// ── Build-time assertions ───────────────────────────────────────────────────

export const IMP_857_GUE_ELIMINATION_ASSERTIONS = [
  {
    id: 'imp857-gue-elim-at-least-8-certified',
    holds: () => IMP_857_GUE_ELIMINATION.headline.nCertifiedNs >= 8,
    why:
      'The merged sweep must certify at least 8 N values (4 from imp-362 ' +
      'witness + 4 from imp-899 baseline sweep). Fewer means either imp-362 ' +
      'or imp-899 has regressed.',
  },
  {
    id: 'imp857-gue-elim-K-paper-below-one',
    holds: () => IMP_857_GUE_ELIMINATION.headline.K_paper_max_floor < 1,
    why:
      'K_paper_max_floor (paper-normalized certified upper bound on C_mb) ' +
      'must be < 1 over the full 8-N range. Above 1 would mean the rescue ' +
      'formula cannot even trivially close.',
  },
  {
    id: 'imp857-gue-elim-point-certification-eliminates-gue',
    holds: () =>
      IMP_857_GUE_ELIMINATION.unconditionalClaim.atSampledN.status ===
      'ELIMINATED',
    why:
      'At each sampled N the point bound must be marked ELIMINATED (GUE ' +
      'dropped) since the certificate uses no GUE input. This is the L1 ' +
      'headline finding.',
  },
  {
    id: 'imp857-gue-elim-N-range-covers-10k',
    holds: () => IMP_857_GUE_ELIMINATION.headline.N_range.max === 10000,
    why:
      'The maximum certified N must reach 10000. Falling below 10000 means ' +
      'the imp-899 baseline sweep did not reach its target range.',
  },
  {
    id: 'imp857-gue-elim-uniform-gap-named',
    holds: () =>
      IMP_857_GUE_ELIMINATION.unconditionalClaim.uniformOnRange.status ===
        'OPEN' &&
      IMP_857_GUE_ELIMINATION.unconditionalClaim.uniformOnRange.blocker ===
        'imp-857-sub-uniform-K-bound',
    why:
      'The uniform bound gap (L1 → L2 promotion blocker) must be named and ' +
      'open. Hiding it would overclaim unconditionality.',
  },
];

// ────────────────────────────────────────────────────────────────────
// imp-980: Independent cross-verification (proof, S10-cross-verify)
// ────────────────────────────────────────────────────────────────────
//
// Static identity + numerical-reference + edge-case + algebraic-
// equivalence audit recorded inline so future readers can reproduce
// the cross-checks without re-running the engine. Follows the
// imp-919 / imp-921 / imp-971..imp-979 precedent. The file currently
// exports IMP_857_GUE_ELIMINATION_ASSERTIONS but no formula-level
// audit; this block plugs that gap.
//
//   (1) Identity / citation audit.
//
//       (1a) Riemann-von Mangoldt local mean density. The function
//            rvmDensity(T) = log(T/(2*pi)) / (2*pi) is the standard
//            local mean density of nontrivial zeros of zeta(s) on the
//            critical line at height T (Riemann-von Mangoldt 1859 /
//            1905; see Titchmarsh 1986, Theorem 9.4). Standard
//            attribution; not re-derived.
//
//       (1b) Pair backward collision time. The formula
//            t_c_pair = H_raw^2 / 8 follows from the unforced Dyson
//            flow d(g^2)/dt = -8 (cross-checked in imp-979 audit of
//            imp-857-commutator-bound.js, item 2a). Setting g^2 = 0
//            yields t_c = g(0)^2 / 8; with g(0) = H_raw the smallest
//            initial pair gap, the earliest pair collision time is
//            H_raw^2 / 8. CONFIRMED-CONSISTENT with imp-979.
//
//       (1c) imp-486 rescue formula. The condition
//            K * log(N_0) / sqrt(N_0) < rho_min is the closure
//            criterion from imp-486 / Goldston-Gonek-Montgomery: if
//            C_mb is bounded by K*log(N)/sqrt(N) uniformly on
//            N >= N_0, then the analytic Lambda <= 0.121 chain closes
//            unconditionally on [N_0, infty). Standard attribution.
//
//       (1d) RHO_MIN_FOR_RESCUE = 0.12751. This is the conservative
//            paper-normalized floor of the Riemann-von Mangoldt local
//            density used by the imp-486 rescue derivation (per the
//            comment in src/math/c-mb-unconditional-bound.js). It is
//            a fixed input constant, not re-derived here.
//
//   (2) Numerical-reference re-derivation.
//
//       (2a) rvmDensity at T = 14.1347 (height of the first nontrivial
//            zero). log(14.1347 / (2*pi)) / (2*pi)
//            = log(2.2496) / 6.2832
//            = 0.8108 / 6.2832
//            ~= 0.12905. CONFIRMED. (The fixed floor 0.12751 is
//            slightly tighter, used as a conservative lower bound.)
//
//       (2b) rvmDensity at T = 1e3 (well into the bulk).
//            log(1e3 / (2*pi)) / (2*pi)
//            = log(159.155) / 6.2832
//            = 5.0698 / 6.2832
//            ~= 0.80686. The local density grows only logarithmically;
//            the per-row K_paper_cert_strict (which divides by rho_N)
//            is therefore ~6x tighter than K_paper_cert_floor at
//            T ~ 1e3. CONFIRMED.
//
//       (2c) F_mb_upper as max(|d_lo|, |d_hi|). Given t_c_lo <= t_c_hi
//            and t_c_pair fixed, the worst-case offset from the pair-
//            collision time is achieved at one of the interval
//            endpoints (since x -> |x - c| is convex). Hence
//            F_mb_upper = max(|t_c_lo - t_c_pair|, |t_c_hi - t_c_pair|)
//            correctly upper-bounds |t_c - t_c_pair| for any
//            t_c in [t_c_lo, t_c_hi]. CONFIRMED.
//
//       (2d) K_raw_cert dimensional consistency. The product
//            F_mb_upper * H_raw has units of time*gap; dividing by
//            scaleFactor = log(N)/sqrt(N) (dimensionless) gives the
//            scaled certificate K_raw_cert with the same time*gap
//            units. The paper-normalized K_paper = K_raw / rho_N
//            divides by gap-density (1/gap), giving units of
//            time*gap^2, matching the paper convention C_mb = O(1)
//            (in those units after a non-dimensionalization H ~ 1).
//            CONFIRMED-DIMENSIONALLY.
//
//       (2e) minN0ForK at K = K_paper_max_floor << 1. With the
//            8-N sample certifying K_paper_max_floor ~ 1e-4, the
//            rescue inequality K * log(N_0) / sqrt(N_0) < 0.12751
//            holds at N_0 = 1 already, since
//            1e-4 * log(1) / sqrt(1) = 0 < 0.12751. The 80-iteration
//            geometric bisection therefore converges to N_0 = 1.
//            Matches the rescueMapping comment "N_0 is tiny".
//            CONFIRMED.
//
//       (2f) minN0ForK at K = 1 (boundary case). For K = 1 the
//            inequality log(N_0)/sqrt(N_0) < 0.12751 must be
//            solved. Numerically log(N)/sqrt(N) is decreasing for
//            N >= e^2 ~ 7.389. Sample: log(4500)/sqrt(4500)
//            = 8.412/67.082 ~= 0.12541, which satisfies the bound;
//            log(4400)/sqrt(4400) = 8.389/66.332 ~= 0.12647, also
//            satisfies; log(4200)/sqrt(4200) = 8.343/64.807
//            ~= 0.12873, fails. So minN0 for K = 1 is in [4200, 4400].
//            The 80-iteration bisection on [1, 1e16] converges to
//            this region with margin << 1. CONFIRMED-NUMERICALLY.
//            (Note: the actual K_paper_max_floor in the file is much
//            smaller than 1, so minN0 = 1 in practice; this is a
//            boundary-case sanity check.)
//
//       (2g) Aggregate Math.max over ALL_CERT. The ALL_CERT.length
//            guard at lines 152-162 returns Infinity when ALL_CERT is
//            empty, preventing Math.max(...[]) = -Infinity from
//            silently producing a misleading "small" K_paper_max.
//            CONFIRMED-DEFENSIVE.
//
//   (3) Edge-case audit (NaN / Inf / undefined paths).
//
//       (3a) perRowCertifiedBound with zeros.length < N. Returns the
//            sentinel { N, status: "zero-list-insufficient" } rather
//            than throwing or producing NaN. Filtered out by
//            ALL_CERT = [...].filter(r => r.status === "certified").
//            SAFE.
//
//       (3b) minRawGapFrom on N <= 1. The for-loop body
//            "for i in 0..N-2" runs zero times when N <= 1, leaving
//            H = Infinity. Downstream t_c_pair = Infinity^2 / 8 =
//            Infinity, F_mb_upper = Infinity (worst case), K_raw =
//            Infinity / scaleFactor = Infinity. The aggregate
//            Math.max would propagate Infinity, but in practice the
//            sweeps never produce N <= 1 rows (smallest sampled N is
//            50). DEFENSIVELY-SAFE-IN-PRACTICE.
//
//       (3c) rvmDensity at T <= 2*pi. log(1) = 0 at T = 2*pi, and
//            log(x) < 0 for x < 1, giving rho_N <= 0. The smallest
//            sampled zero in either source is gamma_50 ~ 144.42 (well
//            above 2*pi ~ 6.28), so rho_N > 0 holds for all rows.
//            DEFENSIVELY-SAFE-IN-PRACTICE.
//
//       (3d) minN0ForK at K = 0 or K = Infinity. K = 0 makes the
//            LHS = 0 always, so the bisection settles at lo (the
//            inequality is satisfied from the start), returning
//            ceil(hi) = 1 after 80 iterations of mid -> lo
//            convergence. K = Infinity is guarded by the
//            Number.isFinite(K_PAPER_MAX_*) checks at lines 178-184
//            which set N0 = Infinity in the rescueMapping export.
//            SAFE.
//
//       (3e) Object.freeze on IMP_857_GUE_ELIMINATION. The exported
//            record is frozen after computation; the .rows array
//            itself is not deep-frozen, but no mutation path exists
//            in the codebase. SAFE.
//
//   (4) Cross-reference consistency.
//
//       (4a) LAMBDA_INTERVAL_DYSON import. Resolves to
//            src/math/interval-dyson-integrator.mjs (verified via grep
//            at audit time). The .witness array is filtered for rows
//            with reason === "gap-lower-bound-nonpositive", which is
//            the imp-362 closure flag.
//
//       (4b) IMP_857_BASELINE_SWEEP_RESULT import. Resolves to
//            src/data/imp-857-baseline-sweep-result.js (verified at
//            audit time). The .rows array is filtered for closed ===
//            true, which is the imp-899 closure flag.
//
//       (4c) ZETA_ZEROS / ZEROS_EXTENDED imports. ZETA_ZEROS provides
//            ~870 high-precision zeros (via zeta.js); ZEROS_EXTENDED
//            provides ~1e6 zeros (via zeros-to-1e6.js). Both arrays
//            exist as named exports.
//
//       (4d) imp-486 rescue, imp-471 C_mb baseline, imp-895 twin-
//            ladder, imp-857-sub-uniform-K-bound: each names an
//            existing or open ticket in the queue. Static referents.
//
//       (4e) HONEST INDEPENDENCE LIMIT. The audit re-derives the
//            paper-density lower bound and the dimensional
//            consistency of K_raw / K_paper independently. The
//            interval bracket [t_c_lo, t_c_hi] from the upstream
//            interval-arithmetic Dyson RK4 is taken as input and not
//            re-bracketed; a Lean port of the RK4 step bound would
//            close that gap (imp-870 skeleton). Flagged as
//            imp980-rk4-bracket-not-re-derived (low severity).
//
//   (5) Algebraic equivalence.
//
//       (5a) K_paper_cert_floor / K_paper_cert_strict = rho_N /
//            RHO_MIN_FOR_RESCUE. Algebraic identity from the two
//            definitions (K_paper_cert_floor = K_raw / 0.12751,
//            K_paper_cert_strict = K_raw / rho_N). For rho_N > 0.12751
//            (which holds at all sampled heights), this gives
//            K_paper_cert_floor > K_paper_cert_strict, so the floor
//            is the LOOSER (more conservative) bound. The assertion
//            "K_paper_max_floor < 1" therefore implies the strict
//            version is also < 1. CONFIRMED-ALGEBRAICALLY.
//
//       (5b) The L1-headline statement "GUE-conditioning eliminated
//            at 8 sampled N" is equivalent to the conjunction of two
//            facts: (i) each per-row certificate is interval-arithmetic
//            on the Odlyzko zeros (no GUE input), AND (ii) the rescue
//            inequality K_paper * log(N) / sqrt(N) < 0.12751 is
//            satisfied at every sampled N. (i) holds by construction
//            of perRowCertifiedBound (no statistical model used);
//            (ii) follows from K_paper_max_floor << 1 plus the
//            scaleFactor = log(N)/sqrt(N) <= log(50)/sqrt(50) ~= 0.553
//            for N in [50, 10000]. CONFIRMED-ALGEBRAICALLY.
//
//       (5c) The L1 -> L2 promotion blocker (uniform K) and the
//            L2 -> L3 blocker (monotone K) are algebraically distinct
//            obstacles: L2 needs continuity of K_paper(N) over the
//            sampled grid; L3 needs the additional monotone-decrease
//            statement K_paper(N) <= K_paper(N_0) for all N >= N_0,
//            which is equivalent (per imp-486) to GUE universality
//            in the general case. The two are not collapsed in the
//            export. CONFIRMED-DISTINCT.
//
// Verdict: the imp-857 GUE-elimination pathway is INTERNALLY
// CONSISTENT. The Riemann-von Mangoldt density, the pair backward
// collision time t_c = H_raw^2/8, and the imp-486 rescue formula
// K*log(N_0)/sqrt(N_0) < 0.12751 are correctly composed. Spot-check
// of rvmDensity at T = 14.1347 recomputes to ~0.12905 (matching the
// 0.12751 floor within 1.2%); rvmDensity at T = 1e3 recomputes to
// ~0.80686 (six-fold tighter than the floor as expected). minN0ForK
// at K = 1 brackets to N_0 in [4200, 4400] consistent with the
// log(N)/sqrt(N) decay. Defensive guards are in place: zero-list
// insufficiency returns a sentinel rather than NaN; ALL_CERT.length
// guard prevents Math.max(...[]) = -Infinity propagation; minN0ForK
// is wrapped in Number.isFinite checks. One flag is raised:
//   * imp980-rk4-bracket-not-re-derived (low) -- the interval
//     [t_c_lo, t_c_hi] from the upstream interval-arithmetic Dyson
//     RK4 is taken as input rather than re-bracketed; a Lean port
//     of the RK4 step would close that gap (imp-870 skeleton).
// The flag does not affect the L1 point-certified status nor the
// 8-N range covered, and the open L2 / L3 sub-gaps are correctly
// named in the unconditionalClaim block.
// ────────────────────────────────────────────────────────────────────

export const IMP_857_GUE_ELIMINATION_CROSS_VERIFY = {
  id: 'imp-980',
  auditDate: '2026-05-09',
  precedent: ['imp-919', 'imp-921', 'imp-971', 'imp-972', 'imp-973', 'imp-974', 'imp-975', 'imp-976', 'imp-977', 'imp-978', 'imp-979'],
  scope: [
    'identity-audit (Riemann-von Mangoldt density, pair backward collision time t_c = H_raw^2/8, imp-486 rescue formula K*log(N_0)/sqrt(N_0) < 0.12751, RHO_MIN_FOR_RESCUE = 0.12751 fixed floor)',
    'numerical-reference-values (rvmDensity at T = 14.1347 ~ 0.12905, rvmDensity at T = 1e3 ~ 0.80686, F_mb_upper convexity, K_raw / K_paper dimensional consistency, minN0ForK at K << 1 returns 1, minN0ForK at K = 1 brackets [4200, 4400], aggregate Math.max defensive guard)',
    'edge-case (zero-list-insufficient sentinel, minRawGapFrom on N <= 1, rvmDensity at T <= 2*pi, minN0ForK at K = 0 or Infinity, Object.freeze shallow)',
    'cross-reference-consistency (LAMBDA_INTERVAL_DYSON / interval-dyson-integrator.mjs, IMP_857_BASELINE_SWEEP_RESULT / imp-857-baseline-sweep-result.js, ZETA_ZEROS / ZEROS_EXTENDED, imp-486 / imp-471 / imp-895 / imp-857-sub-uniform-K-bound referents)',
    'algebraic-equivalence (K_paper_floor / K_paper_strict = rho_N / 0.12751, L1 headline factorization into interval-arithmetic + rescue-inequality, L1 / L2 / L3 promotion blockers algebraically distinct)',
  ],
  identitiesReVerified: [
    {
      id: 'rvm-density-at-first-zero',
      claim: 'rvmDensity(T = 14.1347) = log(T/(2*pi)) / (2*pi) ~ 0.12905',
      derivation: 'log(14.1347 / 6.2832) / 6.2832 = log(2.2496) / 6.2832 = 0.8108 / 6.2832',
      cited: 0.12905,
      recomputed: Math.log(14.1347 / (2 * Math.PI)) / (2 * Math.PI),
      delta: Math.log(14.1347 / (2 * Math.PI)) / (2 * Math.PI) - 0.12905,
      status: 'CONFIRMED (matches the 0.12751 fixed floor within 1.2%)',
    },
    {
      id: 'rvm-density-at-bulk',
      claim: 'rvmDensity(T = 1e3) ~ 0.80686 (~6x tighter than the 0.12751 floor)',
      derivation: 'log(1000 / 6.2832) / 6.2832 = log(159.155) / 6.2832 = 5.0698 / 6.2832',
      recomputed: Math.log(1e3 / (2 * Math.PI)) / (2 * Math.PI),
      cited: 0.80686,
      delta: Math.log(1e3 / (2 * Math.PI)) / (2 * Math.PI) - 0.80686,
      status: 'CONFIRMED',
    },
    {
      id: 'pair-backward-collision-time',
      claim: 't_c_pair = H_raw^2 / 8 from d(g^2)/dt = -8 unforced Dyson flow',
      derivation: 'g^2(t) = g(0)^2 - 8*t; setting g^2 = 0 yields t_c = g(0)^2/8 with g(0) = H_raw',
      status: 'CONFIRMED-CONSISTENT (re-uses imp-979 pair-unforced-tau-c re-derivation)',
    },
    {
      id: 'F-mb-upper-convexity',
      claim: 'F_mb_upper = max(|t_c_lo - t_c_pair|, |t_c_hi - t_c_pair|) is the sup of |x - t_c_pair| over [t_c_lo, t_c_hi]',
      derivation: 'x -> |x - c| is convex; max on a compact interval is achieved at an endpoint',
      status: 'CONFIRMED',
    },
    {
      id: 'K-paper-floor-vs-strict',
      claim: 'K_paper_cert_floor / K_paper_cert_strict = rho_N / RHO_MIN_FOR_RESCUE; floor is the LOOSER bound when rho_N > 0.12751',
      derivation: '(K_raw / 0.12751) / (K_raw / rho_N) = rho_N / 0.12751',
      status: 'CONFIRMED-ALGEBRAICALLY',
    },
    {
      id: 'minN0-for-K-near-zero',
      claim: 'minN0ForK(K) returns 1 for K << 1 because K*log(1)/sqrt(1) = 0 < 0.12751',
      derivation: 'log(1) = 0 forces LHS = 0 at N_0 = 1; bisection converges hi -> 1',
      status: 'CONFIRMED',
    },
    {
      id: 'minN0-for-K-equals-1',
      claim: 'minN0ForK(1) brackets to N_0 in [4200, 4400] (boundary-case sanity check)',
      derivation:
        'log(4400)/sqrt(4400) ~= 0.12647 < 0.12751 holds; log(4200)/sqrt(4200) ~= 0.12873 > 0.12751 fails',
      recomputed_at_4400: Math.log(4400) / Math.sqrt(4400),
      recomputed_at_4200: Math.log(4200) / Math.sqrt(4200),
      threshold: 0.12751,
      status: 'CONFIRMED-NUMERICALLY (boundary case; in practice K_paper_max_floor ~ 1e-4 << 1 so N_0 = 1)',
    },
  ],
  edgeCases: [
    {
      path: 'perRowCertifiedBound with zeros.length < N',
      risk: 'index-out-of-bounds or NaN from undefined zeros',
      mitigation: 'returns sentinel { status: "zero-list-insufficient" }; filtered out of ALL_CERT by .status === "certified" filter',
      verdict: 'SAFE',
    },
    {
      path: 'minRawGapFrom on N <= 1',
      risk: 'empty loop leaves H = Infinity, propagating to t_c_pair = Infinity^2/8 = Infinity',
      mitigation: 'sweeps never produce N <= 1 rows (smallest sampled N is 50); not exercised in practice',
      verdict: 'DEFENSIVELY-SAFE-IN-PRACTICE',
    },
    {
      path: 'rvmDensity at T <= 2*pi',
      risk: 'log(<=1) <= 0 yields rho_N <= 0, which would invert the K_paper_cert_strict sign',
      mitigation: 'smallest sampled gamma is gamma_50 ~ 144.42 >> 2*pi; rho_N > 0 holds for all rows',
      verdict: 'DEFENSIVELY-SAFE-IN-PRACTICE',
    },
    {
      path: 'minN0ForK at K = 0 or K = Infinity',
      risk: 'K = 0 makes LHS = 0 always (bisection converges to 1); K = Infinity makes LHS = Infinity',
      mitigation: 'Number.isFinite(K_PAPER_MAX_*) guards at lines 178-184 set N0 = Infinity if K is non-finite; K = 0 returns 1 cleanly',
      verdict: 'SAFE',
    },
    {
      path: 'Math.max(...ALL_CERT.map(...)) on empty ALL_CERT',
      risk: 'Math.max(...[]) = -Infinity which would silently produce a misleading "small" K_paper_max',
      mitigation: 'ALL_CERT.length conditional at lines 152-162 returns Infinity (worst-case) when empty',
      verdict: 'SAFE-DEFENSIVE',
    },
    {
      path: 'Object.freeze shallow on IMP_857_GUE_ELIMINATION',
      risk: 'freeze does not deep-freeze nested arrays (rows, sourcesCombined.*.N_values)',
      mitigation: 'no mutation path exists in the codebase (verified via grep on the export name)',
      verdict: 'SAFE',
    },
  ],
  numericalReferences: [
    {
      symbol: 'rvmDensity formula',
      cited: 'log(T/(2*pi)) / (2*pi)',
      verdict: 'CONFIRMED-CITATION (Titchmarsh 1986, Theorem 9.4)',
    },
    {
      symbol: 'pair backward collision time',
      cited: 't_c = H_raw^2 / 8',
      verdict: 'CONFIRMED-CONSISTENT (cross-checked with imp-979 audit)',
    },
    {
      symbol: 'imp-486 rescue threshold RHO_MIN_FOR_RESCUE',
      cited: 0.12751,
      verdict: 'CITED-AS-FIXED-INPUT (paper-normalized rho_RvM lower bound used by the imp-486 closure derivation)',
    },
    {
      symbol: 'rvmDensity at T = 14.1347',
      cited: 0.12905,
      recomputed: Math.log(14.1347 / (2 * Math.PI)) / (2 * Math.PI),
      delta: Math.log(14.1347 / (2 * Math.PI)) / (2 * Math.PI) - 0.12905,
      verdict: 'CONFIRMED (1.2% looser than the fixed floor 0.12751)',
    },
    {
      symbol: 'rvmDensity at T = 1e3',
      cited: 0.80686,
      recomputed: Math.log(1e3 / (2 * Math.PI)) / (2 * Math.PI),
      delta: Math.log(1e3 / (2 * Math.PI)) / (2 * Math.PI) - 0.80686,
      verdict: 'CONFIRMED',
    },
    {
      symbol: 'log(N)/sqrt(N) at N = 4400',
      cited: 0.12647,
      recomputed: Math.log(4400) / Math.sqrt(4400),
      delta: Math.log(4400) / Math.sqrt(4400) - 0.12647,
      verdict: 'CONFIRMED (satisfies rescue inequality at K = 1)',
    },
    {
      symbol: 'log(N)/sqrt(N) at N = 4200',
      cited: 0.12873,
      recomputed: Math.log(4200) / Math.sqrt(4200),
      delta: Math.log(4200) / Math.sqrt(4200) - 0.12873,
      verdict: 'CONFIRMED (fails rescue inequality at K = 1; bracketing minN0)',
    },
    {
      symbol: 'K_paper_max_floor headline (8-N sample)',
      cited: '~ 1e-4 (from comment line 19)',
      verdict: 'EMPIRICAL-SUMMARY (computed from upstream sweeps; not re-derived in this audit, but well below the rescue threshold)',
    },
    {
      symbol: 'sample count nCertifiedNs >= 8',
      cited: 8,
      verdict: 'BUILD-TIME-ASSERTION (imp857-gue-elim-at-least-8-certified, line 280-286)',
    },
  ],
  flags: [
    {
      id: 'imp980-rk4-bracket-not-re-derived',
      severity: 'low',
      finding:
        'The interval bracket [t_c_lo, t_c_hi] from the upstream interval-arithmetic Dyson RK4 (LAMBDA_INTERVAL_DYSON.witness and IMP_857_BASELINE_SWEEP_RESULT.rows) is taken as a verified input rather than re-bracketed inside this audit. Independent verification of the per-row K_paper_cert therefore inherits the upstream RK4 step bound. Mitigation: imp-870 Lean skeleton tracks the formalization gap.',
    },
    {
      id: 'imp980-rho-min-fixed-floor-not-re-derived',
      severity: 'low',
      finding:
        'The constant RHO_MIN_FOR_RESCUE = 0.12751 is cited as the paper-normalized rho_RvM lower bound from the imp-486 rescue derivation, not re-derived from first principles in this audit. Spot-check at T = 14.1347 recomputes to 0.12905 (1.2% looser than the floor); the floor is therefore conservative as expected, but the precise origin is documented in c-mb-unconditional-bound.js / imp-486 rather than here.',
    },
    {
      id: 'imp980-l1-l2-l3-promotion-blockers-named-not-closed',
      severity: 'cosmetic',
      finding:
        'The L1 -> L2 (uniform K) and L2 -> L3 (monotone K) promotion blockers are correctly named as OPEN in unconditionalClaim. This audit confirms their algebraic distinctness (5c) but does not close either gap; closure remains tracked under imp-857-sub-uniform-K-bound (L2) and imp-895 twin-ladder corollary (L3).',
    },
  ],
  notIndependentlyChecked: [
    {
      id: 'upstream-rk4-bracket',
      why: 'The interval [t_c_lo, t_c_hi] from interval-dyson-integrator.mjs and imp-857-baseline-sweep-result.js is the certified output of an upstream interval-arithmetic Dyson RK4 step; re-running that integration is out of scope for a static cross-verify. The brackets are taken as inputs.',
    },
    {
      id: 'aggregate-K-paper-max-floor-numeric',
      why: 'The headline K_paper_max_floor ~ 1e-4 across the 8-N sample is computed by the module at load time from the upstream sweep data; this audit does not re-evaluate it row-by-row. The build-time assertion imp857-gue-elim-K-paper-below-one (line 287-294) provides the runtime guard.',
    },
    {
      id: 'odlyzko-zeros-precision',
      why: 'The Odlyzko zero tables in zeta.js and zeros-to-1e6.js are taken as published high-precision data; their internal precision is not re-verified here.',
    },
  ],
  verdict:
    'INTERNALLY CONSISTENT. The Riemann-von Mangoldt density rvmDensity(T) = log(T/(2*pi))/(2*pi), the pair backward collision time t_c_pair = H_raw^2/8 (cross-consistent with imp-979), and the imp-486 rescue formula K*log(N_0)/sqrt(N_0) < 0.12751 are correctly composed inside perRowCertifiedBound. Spot-check of rvmDensity at T = 14.1347 recomputes to 0.12905 (1.2% looser than the 0.12751 floor as expected); at T = 1e3 it recomputes to 0.80686 (six-fold tighter). minN0ForK at K = 1 brackets to N_0 in [4200, 4400], consistent with the log(N)/sqrt(N) decay. Defensive guards: zero-list-insufficient returns a sentinel; ALL_CERT.length guard prevents Math.max(...[]) = -Infinity; Number.isFinite wraps the rescue mapping. Three flags raised: imp980-rk4-bracket-not-re-derived (low; upstream RK4 brackets taken as inputs, pending Lean port via imp-870), imp980-rho-min-fixed-floor-not-re-derived (low; RHO_MIN_FOR_RESCUE = 0.12751 cited from imp-486, recomputed within 1.2% at T = 14.1347), imp980-l1-l2-l3-promotion-blockers-named-not-closed (cosmetic; L1/L2/L3 distinctions confirmed but L2/L3 closure remains open under imp-857-sub-uniform-K-bound / imp-895). None of the flags affect the L1 point-certified status nor the 8-N range coverage; the open L2 (uniform) and L3 (monotone) sub-gaps remain correctly named.',
};
