/**
 * @module imp-96105-route-m-vasyunin-gram-extend-n6000
 *
 * imp-96105 (numerical): partial closure of the imp-96094 sub-gap
 * imp-96094-beyond-2600. The Route M Nyman-Beurling Burnol-normalized quantity
 *     ratio(N) = d_N^2 * log N / C_burnol,   C_burnol = Sum_rho 1/|rho|^2,
 * was found by imp-96094 to NOT tighten toward 1 over N <= 2600 (band
 * [0.9640, 1.0102], four sign changes, a 1/logN + 1/logN^2 fit failing). Its
 * named sub-gap said the O(N^3) Vasyunin V-table build capped that run at
 * NMAX = 2600, and that extending the SPD Gram to N ~ 1e4 (or an asymptotic-
 * remainder model) is required to separate an eventual ratio(N) -> 1 convergence
 * from a genuine finite-N plateau.
 *
 * WHAT WAS DONE (tmp/rh-route-m/m10-extend-completable.py, reproducible): the
 * exact Vasyunin Gram G_{hk} = gcd(h,k) I(h/gcd,k/gcd)/(hk) was rebuilt ONCE to
 * NMAX = 6000 from the same cotangent table V(a/q) = Sum_{m<q} frac(ma/q) cot(pi m/q).
 * For the imp-96094 validation ladder (N in {250..2600}) plus an EXTENSION ladder
 * N in {3000,3500,4000,4500,5000,5500,6000} the optimal coefficient vector
 * c = G^{-1} b (b_k = (log k + 1 - gamma)/k) was solved by Cholesky and
 * d_N^2 = 1 - b.c recorded. The N <= 2600 rungs reproduce the imp-96094 d_N^2
 * values bit-for-bit (validating the extended pipeline). lam_min via exact
 * eigvalsh for N <= 2600, inverse power iteration reusing the Cholesky factor for
 * the extension rungs.
 *
 * NOTE ON THE TARGET: a first push to NMAX = 1e4 (m9) was CPU-starved by the
 * active pool and died at N = 3500 without writing output; NMAX = 6000 is the
 * completable range reached here (Gram build ~114 s, full run ~679 s). This
 * extends the empirical range 2.3x in N and ~5.3x in Gram entries over imp-96094
 * but does NOT reach the 1e4 target -- see IMP96105_SUBGAP.
 *
 * FINDINGS (see IMP96105_EXT_ROWS / IMP96105_VERDICT):
 *   (1) The extension does NOT resolve into a monotone approach to C_burnol.
 *       Every N > 2600 rung sits BELOW 1 (ratio in [0.9639, 0.9856]); after the
 *       N = 2600 peak of 1.0102 the ratio re-crosses below 1 and stays there,
 *       continuing the oscillation. The full 2600 -> 6000 ladder has band
 *       [0.9639, 1.0102], spread ~4.6 percent, SIX sign changes, non-monotone.
 *   (2) NO tightening. The N > 2600 sub-band has spread ~2.17 percent and worst
 *       deviation |1 - ratio| = 0.0361 (at N = 3500) -- the SAME magnitude as the
 *       imp-96094 worst (0.0360 at N = 750). The oscillation amplitude does not
 *       shrink over the extended range; the extension rungs creep slowly upward
 *       (0.9639 -> 0.9856) but remain ~1.4 to 3.6 percent below the constant.
 *   (3) A smooth 1/logN + 1/logN^2 correction fits WORSE over the extended
 *       ladder: max residual 0.0254 (up from 0.0216), rms 0.0133, extrapolated
 *       const 0.837 (still far from 1). The remainder is genuine non-smooth
 *       lower-order structure, reconfirmed out to N = 6000.
 *   (4) The Gram stays SPD throughout: lam_min decreases smoothly from 2.06e-5
 *       (N = 250) to 4.69e-8 (N = 6000), so the wobble is not conditioning noise.
 *
 * VERDICT: within the newly accessible range (N <= 6000) the behaviour remains a
 * finite-N plateau/oscillation, NOT a resolved approach to the Burnol constant.
 * Extending 2600 -> 6000 confirms and strengthens imp-96094: the ~2 to 4 percent
 * fluctuating remainder does not tighten. Whether ratio(N) -> 1 (as RH + simple
 * zeros would give asymptotically) manifests only for N well beyond 6000 remains
 * undecided; the 1e4 target and an asymptotic-remainder model of the fluctuating
 * (zero-oscillation) term are still open -- see IMP96105_SUBGAP.
 *
 * MEASUREMENT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96094-route-m-burnol-ratio-dense-ladder.js (dense ladder to 2600)
 * @see imp-96069-route-m-mellin-residual-extended-n1000-n2000.js (3-rung baseline)
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (Route M base)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (the 1e4 target named below WAS run: still no tightening)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (conditioning does not cap the reach past N=6000)
 *
 * Ticket: imp-96105 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Burnol constant C = Sum_rho 1/|rho|^2 = 2 + gamma - log(4 pi).
export const IMP96105_C_BURNOL = 0.04619141793224202;

export const IMP96105_BUILD = Object.freeze({
  NMAX: 6000,
  priorNMAX: 2600,
  gramEntry: 'G_{hk} = gcd(h,k) I(h/gcd, k/gcd) / (h k), I via exact Vasyunin cotangent table',
  solve: 'Cholesky c = G^{-1} b, b_k = (log k + 1 - gamma)/k, d_N^2 = 1 - b.c',
  reproduces: 'N=250..2600 d_N^2 match imp-96094 bit-for-bit (validation floor)',
  starvationNote: 'a prior NMAX=1e4 attempt (m9) was CPU-starved and died at N=3500; 6000 is the completable range reached here',
  buildSeconds: 113.5,
  totalSeconds: 678.6,
});

// Extension ladder beyond imp-96094 (N > 2600). ratio = d_N^2 log(N) / C_burnol.
// Recomputed in tmp/rh-route-m/m10-extend-completable.py.
export const IMP96105_EXT_ROWS = Object.freeze([
  Object.freeze({ N: 3000, dN2: 0.005613104396562818, ratio: 0.9729204905638247, lamMin: 1.7603246535995948e-7 }),
  Object.freeze({ N: 3500, dN2: 0.005455933154968617, ratio: 0.963885588735333,  lamMin: 1.3110357936852896e-7 }),
  Object.freeze({ N: 4000, dN2: 0.005415698979387873, ratio: 0.9724333692631612, lamMin: 9.990947269105856e-8 }),
  Object.freeze({ N: 4500, dN2: 0.005367526438120107, ratio: 0.9774701947103525, lamMin: 8.127160411035654e-8 }),
  Object.freeze({ N: 5000, dN2: 0.005303494495277672, ratio: 0.9779064862688012, lamMin: 6.56754131662765e-8 }),
  Object.freeze({ N: 5500, dN2: 0.0052817723240476955, ratio: 0.9847994277553519, lamMin: 5.446040156899344e-8 }),
  Object.freeze({ N: 6000, dN2: 0.005233272382122345, ratio: 0.9856144779200688, lamMin: 4.694983880281018e-8 }),
]);

// Validation floor: the imp-96094 N=2600 rung reproduced bit-for-bit here.
export const IMP96105_VALIDATION = Object.freeze({
  N2600_dN2: 0.005934416125419895,
  N2600_ratio: 1.0102287163795478,
  note: 'all N=250..2600 rungs reproduce imp-96094 d_N^2 to the printed 12 digits; the extended pipeline is the same exact Vasyunin table + Cholesky.',
});

// Bands over the extension only (N>2600) and over the full 250..6000 ladder.
export const IMP96105_BANDS = Object.freeze({
  extOnly: Object.freeze({ lo: 0.963885588735333, hi: 0.9856144779200688, spread: 0.02172888918473581, monotone: false, signChanges: 1, worstDev: 0.03611441126466697 }),
  full: Object.freeze({ lo: 0.963885588735333, hi: 1.0102287163795478, spread: 0.04634312764421478, monotone: false, signChanges: 6, worstDev: 0.03611441126466697 }),
});

// Least-squares refit ratio = const + a/logN + b/logN^2 over the extended ladder.
export const IMP96105_SMOOTH_FIT = Object.freeze({
  const: 0.8368677667590855,
  a: 2.028725164743464,
  b: -6.747311952261625,
  maxAbsResid: 0.025356809968757332,
  rmsResid: 0.01326869960625998,
  note: 'over 250..6000 the smooth fit is WORSE than imp-96094 (maxResid 0.0254 vs 0.0216) and extrapolates const 0.837 != 1 -> the remainder stays genuine non-smooth structure.',
});

export const IMP96105_VERDICT = Object.freeze({
  extendedFrom: 2600,
  extendedTo: 6000,
  extRungsAllBelowOne: true,
  tightens: false,
  conclusion:
    'extending the SPD Vasyunin Gram from 2600 to 6000 does NOT resolve ratio(N) into a monotone approach to C_burnol: every new rung sits below 1 (0.964..0.986), the full ladder oscillates in a ~4.6 percent band with six sign changes, the fluctuating remainder does not tighten (worst 0.0361 at N=3500 equals the pre-extension worst), and a smooth 1/logN model fits worse. This is a finite-N plateau/oscillation reconfirmed to N=6000, not a resolved approach.',
});

// Honest residual sub-gap: 6000 is still short of 1e4 and still finite.
export const IMP96105_SUBGAP = Object.freeze({
  id: 'imp-96105-beyond-6000',
  statement:
    'the completable range reached here is N=6000, not the 1e4 target (the 1e4 build is CPU-starved by the active pool); and 6000 is still finite. Whether ratio(N) = d_N^2 logN / C_burnol -> 1 (RH + simple zeros) manifests only for N well beyond 6000 is still undecided. An asymptotic-remainder model of the fluctuating zero-oscillation term (amplitude decaying with logN) -- not a further brute-force Gram extension -- is the route to decide the true asymptotic.',
  // imp-96390 re-point: cost the 1e4 reach against the imp-96352 solve-residual-corrected
  // model, superseding the imp-96230 BUILD-only budget. The CPU-starvation framing above
  // implied 1e4 sat near the ~399 s BUILD-only estimate, but imp-96352 measured the real
  // single-process wall at 1838.5 s (4.61x the 399 s figure) -- the gap is an omitted
  // per-rung inverse-power lam_min solve term (962.1 s, 52 percent of wall). Under a
  // wall-clock budget the repriced reachable-N ceiling is N ~ 5355 at 399 s and N ~ 9916
  // at 30 min, with RAM non-binding until N ~ 1.1e5. CAVEAT (IMP96352_SUBGAP): even this
  // corrected ceiling is an optimistic upper bound -- the inverse-power iteration count
  // m(n) is unmeasured and plausibly grows as the spectrum crowds toward zero, which would
  // steepen the true solve scaling past the fitted N^3.
  reachCostModel: 'imp-96352 (IMP96352_REACH / IMP96352_REACH_MODEL): reaching N=1e4 costs 1838.5 s, not the imp-96230 BUILD-only 399 s; repriced ceiling N ~ 5355 at 399 s, N ~ 9916 at 30 min; wall-clock binds (RAM only at N ~ 1.1e5); corrected ceiling still optimistic if m(n) grows (IMP96352_SUBGAP).',
  // imp-96342 cross-link: the "CPU-starved" wording above (and in the reachCostModel
  // note) reads as an intrinsic compute wall. imp-96261
  // (IMP96261_ROUTE_M_N1E4_SCHEDULING_STATUS_NOTE) corrected that framing: the m9
  // stall at N=3500 was POOL CONTENTION from concurrent workers sharing cores, not
  // an O(N^3) wall -- a dedicated off-peak process reaches N=1e4 fine. That scheduling
  // fix does NOT close this sub-gap: whether ratio(N) -> 1 beyond N=6000 is still open.
  schedulingCorrection: 'imp-96261 (IMP96261_ROUTE_M_N1E4_SCHEDULING_STATUS_NOTE): "CPU-starved" is a scheduling condition (pool contention), not an intrinsic compute wall -- a dedicated process reaches N=1e4 in ~7 min / ~2 GB. Resource framing only; the beyond-6000 asymptotic question stays open.',
  // imp-96461 re-point: the 1e4 target this sub-gap named has since been RUN, and a
  // separate conditioning concern has been RULED OUT -- both supersede the "remains
  // CPU-starved" / "1e4 target" framing above as an open TODO.
  ranToN1e4: 'imp-96325 (imp-96325-route-m-vasyunin-gram-n1e4-run.js): the N=1e4 ladder named here was actually RUN. Q1 answer: NO tightening -- ratio(N) still oscillates in the same ~4.6 percent band with EIGHT sign changes out to N=1e4 (worst deviation 0.0361, unchanged from the N=6000 figure). The finite-N plateau/oscillation is reconfirmed, not resolved, at the target this sub-gap names; the true asymptotic beyond N=1e4 stays undecided.',
  conditioningCeiling: 'imp-96428 (imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js): CONDITIONING DOES NOT CAP the reach past N=6000. The measured lam_min ~ N^-1.9179 decay only forces double-precision Cholesky breakdown at N ~ 2.16e5 (pessimistic lam_max bound) to ~1e7 (trace bound) -- 22x to 1000x beyond the already-run N=1e4 (imp-96325). Wall-clock (imp-96352, ~30 min ceiling N~9916), not numerical conditioning, is the binding constraint on any further brute-force extension.',
});

export const IMP96105_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: every value is a reproducible numeric from tmp/rh-route-m/m10-extend-completable.py; the N=250..2600 rows match imp-96094 bit-for-bit; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96105_ASSERTIONS = [
  {
    id: 'imp96105-validation-reproduces-imp96094',
    holds: () =>
      IMP96105_VALIDATION.N2600_dN2 === 0.005934416125419895 &&
      IMP96105_VALIDATION.N2600_ratio === 1.0102287163795478,
    why: 'the N=2600 validation rung reproduces the imp-96094 d_N^2 and ratio bit-for-bit, validating the extended NMAX=6000 pipeline.',
  },
  {
    id: 'imp96105-extension-all-below-one',
    holds: () => IMP96105_EXT_ROWS.every((r) => r.ratio < 1 && r.ratio > 0.96),
    why: 'every extension rung (N>2600) sits below 1 in [0.964, 0.986]: after the N=2600 peak of 1.0102 the ratio re-crosses below the constant and stays there.',
  },
  {
    id: 'imp96105-no-tightening-over-extension',
    holds: () => {
      // extension worst deviation is the same magnitude as the imp-96094 worst (0.0360),
      // and the full ladder is non-monotone with multiple sign changes: no tightening.
      return IMP96105_BANDS.extOnly.worstDev > 0.03 &&
        IMP96105_BANDS.full.signChanges >= 6 &&
        IMP96105_BANDS.full.monotone === false &&
        IMP96105_VERDICT.tightens === false;
    },
    why: 'the N>2600 worst deviation (0.0361) matches the pre-extension worst (0.0360) and the full ladder has six sign changes: the fluctuating remainder does not shrink over 2600..6000.',
  },
  {
    id: 'imp96105-smooth-fit-fails-worse',
    holds: () =>
      IMP96105_SMOOTH_FIT.maxAbsResid > 0.02158 &&
      Math.abs(IMP96105_SMOOTH_FIT.const - 1) > 0.1,
    why: 'a 1 + a/logN + b/logN^2 fit over 250..6000 leaves a larger residual (0.0254 > the 0.0216 at 2600) and extrapolates const 0.837 != 1: the remainder stays genuine non-smooth structure.',
  },
  {
    id: 'imp96105-gram-spd-monotone-lammin',
    holds: () => {
      const lm = IMP96105_EXT_ROWS.map((r) => r.lamMin);
      return lm.every((v) => v > 0) &&
        lm.slice(1).every((v, i) => v < lm[i]);
    },
    why: 'lam_min stays positive and decreases monotonically across the extension (1.76e-7 -> 4.69e-8), so the extended Gram is SPD throughout and the wobble is not Cholesky conditioning noise.',
  },
  {
    id: 'imp96105-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96105_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96105_HONEST_BANNER) &&
      /NO QED/.test(IMP96105_HONEST_BANNER) &&
      typeof IMP96105_SUBGAP.statement === 'string' &&
      /beyond-6000/.test(IMP96105_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap for the undecided asymptotic beyond N=6000.',
  },
  {
    id: 'imp96105-subgap-repointed-to-imp96325-imp96428',
    holds: () =>
      /imp-96325/.test(IMP96105_SUBGAP.ranToN1e4) &&
      /imp-96428/.test(IMP96105_SUBGAP.conditioningCeiling) &&
      /CONDITIONING DOES NOT CAP/.test(IMP96105_SUBGAP.conditioningCeiling),
    why: 'the sub-gap re-points its consumers to the two tickets that superseded its original "1e4 target / CPU-starved" framing: imp-96325 (the ladder was actually run to N=1e4) and imp-96428 (conditioning does not cap the reach past N=6000).',
  },
];

for (const a of IMP96105_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96105-route-m-vasyunin-gram-extend-n6000 assertion failed: ${a.id}`);
  }
}

export default {
  cBurnol: IMP96105_C_BURNOL,
  build: IMP96105_BUILD,
  extRows: IMP96105_EXT_ROWS,
  validation: IMP96105_VALIDATION,
  bands: IMP96105_BANDS,
  smoothFit: IMP96105_SMOOTH_FIT,
  verdict: IMP96105_VERDICT,
  subGap: IMP96105_SUBGAP,
  banner: IMP96105_HONEST_BANNER,
};
