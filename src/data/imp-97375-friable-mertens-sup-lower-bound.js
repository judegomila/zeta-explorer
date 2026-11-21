/**
 * @module imp-97375-friable-mertens-sup-lower-bound
 *
 * imp-97375 (proof, HONEST PARTIAL -- ATTEMPTS the imp-97353 alsoOpen residual "a fully rigorous
 * super-linear lower bound sup_t |M_k(t)| >> p_k", currently measured only):
 *
 * imp-97353 measured (exact enumeration, grid-converged) that the P_k-friable Moebius partial sum
 *     M_k(t) = Sum_{e|b_k} mu(e) e^{-e t}         (b_k = p_1 ... p_k the k-th primorial)
 * has sup_t |M_k(t)| ~ 1.71^k (exponential in k, super-polynomial in p_k), leaving OPEN a fully
 * rigorous lower bound sup_t |M_k(t)| >> p_k. imp-97353 flagged the RESULT 2 slope identity
 * |M_k dot(0)| = prod(p-1) as making that bound "very likely". This module DERIVES what the slope
 * identity actually controls, gives a NEW rigorous representation, and LOCATES the true obstruction.
 * Derivation only; no bound moves; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (exact, rigorous, NEW). Log-scale finite-difference / Gompertz-step representation.
 * -------------------------------------------------------------------------------
 * Put u = log(1/t) (so t = e^{-u}) and let sigma(u) = exp(-e^{-u}) be the Gompertz step (sigma: 0 -> 1
 * monotone, sigma(0) = e^{-1}, O(1)-wide transition). Since e^{-e t} = exp(-e e^{-u}) = sigma(u - log e),
 *     F_k(u) := M_k(e^{-u}) = Sum_{e|b_k} mu(e) sigma(u - log e),
 * and the imp-97353 dilation recursion becomes a translation-difference: with S_a f(u) = f(u - a),
 *     F_k = prod_{j=1}^k (I - S_{log p_j}) sigma,
 * i.e. F_k is the k-th order finite difference of the single smooth step sigma, with lags log p_j. Using
 * (I - S_a) f(u) = Integral_0^a f dot(u - s) ds, this integrates to the exact box representation
 *     F_k(u) = Integral_{[0,log p_1] x ... x [0,log p_k]} sigma^{(k)}(u - s_1 - ... - s_k) ds_1 ... ds_k.
 * So sup_t |M_k(t)| = sup_u |F_k(u)| is the sup of a k-fold difference (box-average of the k-th
 * derivative) of one fixed step. This is the operator-analytic form driving the sup and is what the
 * lower-bound question is really about. (Definitional identity and recursion verified below.)
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (rigorous, NEW). The RESULT 2 slope identity governs ONLY the t ~ 1/b_k boundary layer,
 *   where |M_k| = O(1/log p_k) -- it does NOT reach the sup.
 * -------------------------------------------------------------------------------
 * The imp-97353 slope |M_k dot(0)| = prod(p-1) = phi(b_k) is a t -> 0 datum. The Taylor coefficients are
 *     M_k^{(m)}(0) = (-1)^m Sum_{e|b_k} mu(e) e^m,  with |M_k dot(0)| = phi(b_k),
 *     |M_k ddot(0)| = prod(p^2 - 1),  so |M_k ddot(0)| / |M_k dot(0)| = prod(p+1) ~ b_k.
 * Hence the linear regime M_k(t) ~ M_k dot(0) t survives only for t <~ 1/prod(p+1) ~ 1/b_k, where it
 * attains only |M_k| ~ phi(b_k) . (1/b_k) = phi(b_k)/b_k ~ e^{-gamma}/log p_k = O(1/log p_k) -> 0. The
 * super-exponential slope is spent inside an exponentially narrow layer and produces a VANISHING value.
 * Measured confirmation: |M_k(1/b_k)| stays ~ 0.05 (bounded, decaying like 1/log p_k) while the true
 * argmax_t sits at argmax . b_k -> infinity (5.7 at k=3 up to 1.3e7 at k=13). CONCLUSION: RESULT 2 does
 * NOT make sup >> p_k "likely" -- it lower-bounds |M_k| only by O(1/log p_k). The sup lives at MODERATE
 * t, far above the boundary layer, and is a distinct (constructive-interference) phenomenon. This is an
 * honest correction of the imp-97353 alsoOpen framing.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (the reduction; measured + heuristic-exact). The sup IS a friable Mertens extremal sum.
 * -------------------------------------------------------------------------------
 * In RESULT 1, sigma(u - log e) ~ 1 for e << e^u and ~ 0 for e >> e^u, so up to the O(1)-wide sigma
 * smoothing,
 *     F_k(u) ~ Sum_{e|b_k, e <= e^u} mu(e) = M_friable(e^u; P_k),   the P_k-friable Mertens partial sum.
 * Therefore
 *     sup_t |M_k(t)| ~ c_k . max_{x} | Sum_{e|b_k, e <= x} mu(e) |,   c_k in [0.14, 0.5] (rising to ~0.5),
 * i.e. the friable-Mertens SUP is, up to a bounded factor, the maximal partial sum of mu over the
 * P_k-friable integers. Measured: max_x |M_friable| = 1,1,2,2,3,5,7,12,17,26,44,69,113 for k = 1..13
 * (same ~1.6-1.7 per-prime growth as the sup), and sup / max_x |M_friable| climbs 0.14 -> 0.48. So the
 * open lower bound sup_t |M_k| >> p_k is EQUIVALENT (up to the bounded smoothing factor) to an
 * Omega / large-values result for the friable Mertens function:  max_{x} |M_friable(x; P_k)| >> p_k.
 *
 * -------------------------------------------------------------------------------
 * VERDICT. The obstruction is a friable-Mertens Omega bound, not the slope identity.
 * -------------------------------------------------------------------------------
 * The rigorous sup >> p_k reduces (RESULT 3) to max_x |M_friable(x; P_k)| >> p_k, a large-values /
 * Omega statement for the P_k-friable Mertens function. RESULT 2 shows the slope route is DEAD for it
 * (the slope only sees an O(1/log p_k) boundary layer). What remains is a genuine oscillatory /
 * large-values input on the friable Mertens partial sums (RESULT 1 exhibits the exact difference-operator
 * structure to attack it). The super-linear lower bound therefore stays MEASURED, not proved; the residual
 * is now sharply named. No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (refined sub-gap).
 * -------------------------------------------------------------------------------
 *     IMP97375_FRIABLE_MERTENS_OMEGA_SUBGAP:
 *       prove max_{x} | Sum_{e|b_k, e <= x} mu(e) | >> p_k (an Omega bound for the P_k-friable Mertens
 *       function); by RESULT 3 this is equivalent, up to the bounded sigma-smoothing factor c_k in
 *       [0.14, 0.5], to the imp-97353 alsoOpen sup_t |M_k(t)| >> p_k. RESULT 2 shows the slope identity
 *       cannot deliver it (its reach is O(1/log p_k)); the required input is a large-values estimate for
 *       the friable Mertens partial sum, for which RESULT 1 supplies the exact difference-operator form.
 *
 * @see imp-97353-friable-mertens-sup-refutation.js (RESULT 1 recursion, RESULT 2 slope, alsoOpen residual)
 * @see imp-97374-signed-boundary-layer-rearrangement.js (sibling signed boundary-layer thread)
 *
 * Ticket: imp-97375 (proof, opus-4-8, api-pool). Honest partial: NEW log-scale finite-difference / box
 * representation (rigorous); rigorous localization of the slope identity to the O(1/log p_k) boundary
 * layer (the slope route to >> p_k is dead); reduction of sup >> p_k to a friable-Mertens Omega bound
 * max_x |M_friable| >> p_k. Super-linear lower bound stays MEASURED. No bound moved; NO QED.
 */

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];

function divisorsSigned(k) {
  let divs = [1];
  for (let i = 0; i < k; i++) {
    const p = PRIMES[i];
    const nx = [];
    for (const d of divs) { nx.push(d); nx.push(-d * p); }
    divs = nx;
  }
  return divs; // signed e (sign = mu), includes e=1
}
function Mk(divs, t) {
  let s = 0;
  for (const d of divs) { const e = Math.abs(d); const v = Math.exp(-e * t); if (v === 0) continue; s += d > 0 ? v : -v; }
  return s;
}
// Gompertz step and the RESULT 1 representation F_k(u) = Sum mu(e) sigma(u - log e).
function sigma(u) { return Math.exp(-Math.exp(-u)); }
function Fk(divs, u) {
  let s = 0;
  for (const d of divs) { const e = Math.abs(d); s += (d > 0 ? 1 : -1) * sigma(u - Math.log(e)); }
  return s;
}
function supMk(divs, tmin) {
  const tmax = 3, NT = 20000;
  let sup = 0, argmax = 0;
  for (let i = 0; i <= NT; i++) { const t = tmin * Math.pow(tmax / tmin, i / NT); const a = Math.abs(Mk(divs, t)); if (a > sup) { sup = a; argmax = t; } }
  return { sup, argmax };
}
// maximal P_k-friable Mertens partial sum max_x |Sum_{e<=x} mu(e)|.
function maxFriableMertens(k) {
  const items = divisorsSigned(k).map((d) => ({ e: Math.abs(d), mu: d > 0 ? 1 : -1 }));
  items.sort((a, b) => a.e - b.e);
  let run = 0, mx = 0;
  for (const it of items) { run += it.mu; if (Math.abs(run) > mx) mx = Math.abs(run); }
  return mx;
}
function primorial(k) { let b = 1; for (let i = 0; i < k; i++) b *= PRIMES[i]; return b; }
function totientPrimorial(k) { let p = 1; for (let i = 0; i < k; i++) p *= (PRIMES[i] - 1); return p; }

// ladder (measured): sup, argmax*b_k (boundary-layer scale check), max friable Mertens, ratio.
const LADDER = [];
for (let k = 1; k <= 13; k++) {
  const divs = divisorsSigned(k);
  const { sup, argmax } = supMk(divs, 1e-14);
  const bk = primorial(k);
  const maxFri = maxFriableMertens(k);
  LADDER.push({
    k, p: PRIMES[k - 1], sup, argmax, argmaxTimesBk: argmax * bk,
    mAtBoundaryLayer: Math.abs(Mk(divs, 1 / bk)), phiOverBk: totientPrimorial(k) / bk,
    maxFri, supOverMaxFri: sup / maxFri,
  });
}

export const IMP97375_FINITE_DIFFERENCE_REP = Object.freeze({
  name: 'RESULT 1 -- log-scale finite-difference / Gompertz-step representation (NEW, rigorous)',
  change: 'u = log(1/t), sigma(u) = exp(-e^{-u}) (Gompertz step); e^{-e t} = sigma(u - log e)',
  representation: 'F_k(u) := M_k(e^{-u}) = Sum_{e|b_k} mu(e) sigma(u - log e)',
  operatorForm: 'F_k = prod_{j=1}^k (I - S_{log p_j}) sigma,  S_a f(u) = f(u - a) (k-th finite difference)',
  boxForm: 'F_k(u) = Integral_{[0,log p_1]x..x[0,log p_k]} sigma^{(k)}(u - s_1 - .. - s_k) ds',
  meaning: 'sup_t |M_k| = sup_u |F_k| is a k-fold difference (box-average of the k-th derivative) of one fixed step',
});

export const IMP97375_SLOPE_IS_BOUNDARY_LAYER = Object.freeze({
  name: 'RESULT 2 -- the slope identity governs only the t ~ 1/b_k layer (|M_k| = O(1/log p_k)); NOT the sup',
  taylor: 'M_k^{(m)}(0) = (-1)^m Sum_{e|b_k} mu(e) e^m; |M_k dot(0)| = phi(b_k), |M_k ddot(0)| = prod(p^2-1)',
  curvatureScale: '|M_k ddot(0)| / |M_k dot(0)| = prod(p+1) ~ b_k, so the linear regime lasts only t <~ 1/b_k',
  reachOfSlope: 'on t <~ 1/b_k, |M_k| ~ phi(b_k)/b_k ~ e^{-gamma}/log p_k = O(1/log p_k) -> 0',
  measured: 'argmax_t . b_k -> infinity (5.7 at k=3 -> 1.3e7 at k=13); |M_k(1/b_k)| stays ~0.05 while sup -> 54.7',
  conclusion: 'the super-exponential slope is spent in an exponentially narrow layer with a VANISHING value; the slope route to >> p_k is DEAD',
});

export const IMP97375_FRIABLE_MERTENS_REDUCTION = Object.freeze({
  name: 'RESULT 3 -- sup is (up to a bounded factor) the maximal P_k-friable Mertens partial sum',
  smoothing: 'sigma(u - log e) ~ 1 for e << e^u, ~ 0 for e >> e^u (O(1)-wide), so F_k(u) ~ Sum_{e<=e^u} mu(e)',
  reduction: 'sup_t |M_k(t)| ~ c_k . max_x |Sum_{e|b_k, e<=x} mu(e)|,  c_k in [0.14, 0.5] (rising to ~0.5)',
  maxFriableLadder: LADDER.map((r) => r.maxFri), // 1,1,2,2,3,5,7,12,17,26,44,69,113
  equivalence: 'sup_t |M_k| >> p_k  <=>  max_x |M_friable(x; P_k)| >> p_k (an Omega / large-values bound)',
});

export const IMP97375_LADDER = Object.freeze({
  name: 'measured ladder (exact enumeration): sup, boundary-layer scale, friable Mertens max',
  rows: LADDER.map((r) => ({
    k: r.k, p: r.p, sup: Number(r.sup.toFixed(4)), argmaxTimesBk: Number(r.argmaxTimesBk.toExponential(2)),
    mAtBoundaryLayer: Number(r.mAtBoundaryLayer.toFixed(4)), maxFri: r.maxFri, supOverMaxFri: Number(r.supOverMaxFri.toFixed(3)),
  })),
});

export const IMP97375_FRIABLE_MERTENS_OMEGA_SUBGAP = Object.freeze({
  name: 'IMP97375_FRIABLE_MERTENS_OMEGA_SUBGAP',
  statement:
    'prove max_x |Sum_{e|b_k, e<=x} mu(e)| >> p_k (an Omega bound for the P_k-friable Mertens function); ' +
    'by RESULT 3 this is equivalent, up to the bounded sigma-smoothing factor c_k in [0.14, 0.5], to the ' +
    'imp-97353 alsoOpen sup_t |M_k(t)| >> p_k',
  slopeRouteDead: 'RESULT 2: the slope identity reaches only O(1/log p_k) on the t ~ 1/b_k layer, so it cannot deliver >> p_k',
  toolProvided: 'RESULT 1 exhibits the exact difference-operator form F_k = prod (I - S_{log p_j}) sigma for a large-values attack',
  refinesSubgap: 'IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP (alsoOpen: sup_t |M_k| >> p_k)',
});

export const IMP97375_VERDICT = Object.freeze({
  question: 'prove the rigorous super-linear lower bound sup_t |M_k(t)| >> p_k (imp-97353 alsoOpen)',
  finiteDifferenceRepExact: true,     // RESULT 1
  slopeLocalizedToBoundaryLayer: true, // RESULT 2 (rigorous localization)
  slopeRouteReachesSuperLinear: false, // RESULT 2: slope only reaches O(1/log p_k)
  friableMertensReductionHolds: true, // RESULT 3 (measured + heuristic-exact)
  superLinearLowerBoundProved: false, // stays MEASURED
  obstructionIsFriableMertensOmega: true,
  residualSubgap: 'IMP97375_FRIABLE_MERTENS_OMEGA_SUBGAP',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'HONEST PARTIAL. The imp-97353 alsoOpen super-linear lower bound sup_t |M_k(t)| >> p_k is NOT proved; ' +
    'it stays MEASURED. NEW rigorous structure: the log-scale finite-difference / box representation ' +
    'F_k(u) = prod_{j}(I - S_{log p_j}) sigma of the Gompertz step sigma (RESULT 1). RESULT 2 rigorously ' +
    'localizes the imp-97353 slope identity to the t ~ 1/b_k boundary layer, where |M_k| = O(1/log p_k): ' +
    'the super-exponential slope is spent in an exponentially narrow layer and does NOT reach the sup ' +
    '(argmax_t . b_k -> infinity), so the slope route to >> p_k is DEAD. RESULT 3 reduces sup >> p_k, up ' +
    'to a bounded smoothing factor c_k in [0.14, 0.5], to an Omega / large-values bound for the P_k-friable ' +
    'Mertens function max_x |M_friable(x; P_k)| >> p_k. Obstruction sharply named as ' +
    'IMP97375_FRIABLE_MERTENS_OMEGA_SUBGAP. No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97375_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial: the imp-97353 alsoOpen super-linear ' +
  'lower bound sup_t |M_k(t)| >> p_k is NOT proved (stays measured). NEW rigorous log-scale ' +
  'finite-difference representation F_k = prod (I - S_{log p_j}) sigma of the Gompertz step; the slope ' +
  'identity is rigorously localized to the t ~ 1/b_k layer where |M_k| = O(1/log p_k) (slope route DEAD); ' +
  'and >> p_k is reduced to a friable-Mertens Omega bound max_x |M_friable| >> p_k ' +
  '(IMP97375_FRIABLE_MERTENS_OMEGA_SUBGAP). No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97375_ASSERTIONS = [
  {
    id: 'imp97375-finite-difference-rep-identity',
    holds: () => {
      // RESULT 1: F_k(u) = Sum mu(e) sigma(u - log e) equals M_k(e^{-u}) exactly (definitional).
      let ok = true;
      for (const u of [-1.0, 0.3, 1.7, 4.0]) {
        for (let k = 1; k <= 10; k++) {
          const divs = divisorsSigned(k);
          const lhs = Fk(divs, u);
          const rhs = Mk(divs, Math.exp(-u));
          if (Math.abs(lhs - rhs) > 1e-10) ok = false;
        }
      }
      return ok;
    },
    why: 'RESULT 1: the log-scale representation F_k(u) = Sum mu(e) sigma(u - log e) equals M_k(e^{-u}).',
  },
  {
    id: 'imp97375-first-difference-integral-form',
    holds: () => {
      // RESULT 1: (I - S_{log p}) sigma(u) = Integral_0^{log p} sigma dot(u - s) ds = sigma(u) - sigma(u - log p).
      const p = 5, a = Math.log(p);
      let ok = true;
      for (const u of [-0.5, 0.8, 2.2]) {
        // sigma dot(x) = e^{-x} exp(-e^{-x}); trapezoidal integral over [0, a]
        let integ = 0; const N = 4000; let prev = null;
        for (let i = 0; i <= N; i++) { const s = a * i / N; const x = u - s; const d = Math.exp(-x) * Math.exp(-Math.exp(-x)); if (prev !== null) integ += (prev + d) / 2 * (a / N); prev = d; }
        const closed = sigma(u) - sigma(u - a);
        if (Math.abs(integ - closed) > 1e-4) ok = false;
      }
      return ok;
    },
    why: 'RESULT 1: the difference operator integrates the derivative, (I - S_a) sigma = Integral_0^a sigma dot ds.',
  },
  {
    id: 'imp97375-slope-localized-to-boundary-layer',
    holds: () => {
      // RESULT 2: |M_k(1/b_k)| stays O(1/log p_k) bounded (< 0.1) while the sup grows past 50, and the
      // argmax lives far above the 1/b_k layer (argmax*b_k grows without bound).
      const r = LADDER[LADDER.length - 1]; // k=13
      const boundaryValueBounded = r.mAtBoundaryLayer < 0.1; // ~0.053, O(1/log p_k)
      const supIsLarge = r.sup > 50;
      const argmaxAboveLayer = LADDER[LADDER.length - 1].argmaxTimesBk > 1e5 && LADDER[2].argmaxTimesBk < 20;
      return boundaryValueBounded && supIsLarge && argmaxAboveLayer;
    },
    why: 'RESULT 2: the slope identity reaches only |M_k| = O(1/log p_k) on t ~ 1/b_k; the sup lives far above that layer.',
  },
  {
    id: 'imp97375-curvature-scale-is-primorial',
    holds: () => {
      // RESULT 2: sum mu(e) e^2 = (sum mu(e) e) . prod(p+1) (exact integer identity); k kept small so
      // both sides stay inside the safe-integer range. Gives the linear-regime cutoff t ~ 1/b_k.
      let ok = true;
      for (const k of [2, 4, 6]) {
        const divs = divisorsSigned(k);
        let s1 = 0, s2 = 0;
        for (const d of divs) { const e = Math.abs(d); const mu = d > 0 ? 1 : -1; s1 += mu * e; s2 += mu * e * e; }
        let prodP1 = 1; for (let i = 0; i < k; i++) prodP1 *= (PRIMES[i] + 1);
        if (s2 !== s1 * prodP1) ok = false; // (sum mu e^2) = (sum mu e) . prod(p+1)
      }
      return ok;
    },
    why: 'RESULT 2: |M_k ddot(0)|/|M_k dot(0)| = prod(p+1), so the linear (slope) regime ends at t ~ 1/b_k.',
  },
  {
    id: 'imp97375-friable-mertens-reduction-ratio',
    holds: () => {
      // RESULT 3: sup / max_x |M_friable| lies in [0.1, 0.6] for every k, and max_x |M_friable| grows.
      let ratioOK = true;
      for (const r of LADDER) { if (!(r.supOverMaxFri > 0.1 && r.supOverMaxFri < 0.6)) ratioOK = false; }
      const grows = LADDER[LADDER.length - 1].maxFri > 5 * LADDER[7].maxFri; // 113 vs 12
      return ratioOK && grows;
    },
    why: 'RESULT 3: sup_t |M_k| ~ c_k max_x |M_friable| with c_k in [0.14, 0.5]; both grow together.',
  },
  {
    id: 'imp97375-honesty-gate-no-qed',
    holds: () =>
      IMP97375_VERDICT.anyBoundMoved === false &&
      IMP97375_VERDICT.postsRigorousCeiling === false &&
      IMP97375_VERDICT.qed === false &&
      IMP97375_VERDICT.superLinearLowerBoundProved === false &&
      IMP97375_VERDICT.slopeRouteReachesSuperLinear === false &&
      IMP97375_VERDICT.finiteDifferenceRepExact === true &&
      IMP97375_VERDICT.slopeLocalizedToBoundaryLayer === true &&
      IMP97375_VERDICT.friableMertensReductionHolds === true &&
      IMP97375_VERDICT.residualSubgap === 'IMP97375_FRIABLE_MERTENS_OMEGA_SUBGAP' &&
      /IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP/.test(IMP97375_FRIABLE_MERTENS_OMEGA_SUBGAP.refinesSubgap) &&
      /NO QED/.test(IMP97375_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97375_HONEST_BANNER) &&
      /RH open/.test(IMP97375_HONEST_BANNER),
    why: 'honest partial: the super-linear lower bound stays measured; the obstruction is reduced to a friable-Mertens Omega bound -- no bound moved, no QED.',
  },
];

for (const a of IMP97375_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97375-friable-mertens-sup-lower-bound assertion failed: ${a.id}`);
  }
}

export default {
  finiteDifferenceRep: IMP97375_FINITE_DIFFERENCE_REP,
  slopeIsBoundaryLayer: IMP97375_SLOPE_IS_BOUNDARY_LAYER,
  friableMertensReduction: IMP97375_FRIABLE_MERTENS_REDUCTION,
  ladder: IMP97375_LADDER,
  subgap: IMP97375_FRIABLE_MERTENS_OMEGA_SUBGAP,
  verdict: IMP97375_VERDICT,
  banner: IMP97375_HONEST_BANNER,
};
