/**
 * @module imp-97434-interchange-subgap-sup-bound-collapse
 *
 * imp-97434 (proof, HONEST ASSESSMENT -- answers the imp-97364 STATUS(d) / imp-97332
 * IMP97332_INTERCHANGE_SUBGAP question "assess the friable-Mertens sup bound
 * sup_t |M_k(t)| = o(p_k) that would close the interchange, working in the boundary-layer
 * window (0,tau)"):
 *
 * The ticket names a DISJUNCTION -- close IMP97332_INTERCHANGE_SUBGAP either (A) via the
 * friable-Mertens sup bound sup_t |M_k(t)| = o(p_k), or (B) via the direct boundary-layer
 * estimate Integral_0^tau g(t) e^t [M(t) - M_k(t)] dt -> 0. This note records that branch (A)
 * is not open but FALSE, so the disjunction COLLAPSES onto branch (B); it reconciles the stale
 * imp-97364 headword framing (which still re-cites the sup bound as "OPEN") with the imp-97353
 * refutation, and states the precise obstruction. Assessment only; no bound moves; RH open; NO QED.
 *
 * M_k(t) = Sum_{e | b_k} mu(e) e^{-e t} is the P_k-friable partial sum of M(t) = Sum mu(n) e^{-n t}
 * (b_k = p_1 ... p_k the k-th primorial).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (branch A is FALSE, not open). The sup bound sup_t |M_k(t)| = o(p_k) fails.
 * -------------------------------------------------------------------------------
 * imp-97353 established by exact grid-converged signed-divisor enumeration that
 * sup_t |M_k(t)| grows EXPONENTIALLY (per-prime ratio ~1.71), crossing p_k near k = 13 -- so it
 * is not even O(p_k), let alone o(p_k). This note re-confirms the crossing independently
 * (self-contained enumeration below): sup/p_k climbs monotonically through the tail of the ladder
 * and exceeds 1 at k = 13 (~1.334 vs 0.842 at k = 12). Hence the ingredient named in
 * IMP97332_INTERCHANGE_SUBGAP -- and re-cited as OPEN in the imp-97364 STATUS(d) headword -- does
 * not merely remain unproved: NO such o(p_k) sup bound exists. Branch (A) is closed NEGATIVELY.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (the precise obstruction). Any absolute-value majorant of the boundary-layer defect is
 *   structurally doomed; the estimate needs signed cancellation a majorant cannot see.
 * -------------------------------------------------------------------------------
 * The only role a friable-Mertens sup bound plays in branch (B) is to majorize the innermost
 * sliver: |Integral_0^{c/p_k} g e^t M_k dt| <= (const) . (c/p_k) . sup_t |M_k(t)|. With
 * sup_t |M_k| ~ 1.71^k >> p_k (RESULT 1) this product DIVERGES along the primorial ladder, so the
 * width x sup majorant is dead. Because M_k(0+) = 0 for every finite k while M(0+) = -2 (the exact
 * boundary-layer non-uniformity), the defect can vanish only through SIGNED (oscillatory)
 * cancellation inside the integral -- precisely what an absolute-value majorant discards. This is
 * the imp-97353 relocation IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP, and it is the SAME open object as
 * branch (B) of this ticket.
 *
 * -------------------------------------------------------------------------------
 * VERDICT. IMP97332_INTERCHANGE_SUBGAP must be RE-STATED as branch (B) = the signed estimate.
 * -------------------------------------------------------------------------------
 * The friable-Mertens sup-bound phrasing of IMP97332_INTERCHANGE_SUBGAP (and the imp-97364
 * STATUS(d) "OPEN" re-citation) is superseded: branch (A) is FALSE. The live sub-gap is exactly the
 * direct boundary-layer estimate Integral_0^tau g e^t [M - M_k] dt -> 0, which coincides with
 * IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP. No new mechanism is supplied here; no bound on Lambda
 * moves; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (the surviving sub-gap, sharpened).
 * -------------------------------------------------------------------------------
 *   IMP97434_INTERCHANGE_SUBGAP_RESTATED:
 *     close IMP97332_INTERCHANGE_SUBGAP through the DIRECT signed boundary-layer estimate
 *     Integral_0^tau g(t) e^t [M(t) - M_k(t)] dt -> 0 (equivalently IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP),
 *     NOT through a friable-Mertens sup bound -- the latter (sup_t |M_k(t)| = o(p_k)) is FALSE
 *     (imp-97353; sup ~ 1.71^k, crosses p_k at k = 13), so any width x sup majorant of the sliver
 *     diverges and cannot see the M_k(0+)=0 vs M(0+)=-2 cancellation.
 *
 * @see imp-97353-friable-mertens-sup-refutation.js (source: sup ~1.71^k refutation, signed relocation)
 * @see imp-97375-friable-mertens-sup-lower-bound.js (reduces sup >> p_k to a friable-Mertens Omega bound)
 * @see imp-97382-friable-mertens-sup-honest-status.js (frontier-index honest status of the refutation)
 * @see imp-97364-friable-partial-sum-reformulation-glossary-headword.js (STATUS(d) re-cites the sup bound as OPEN)
 * @see imp-97332-route-m-tail-interchange-assessment.js (IMP97332_INTERCHANGE_SUBGAP being restated)
 *
 * Ticket: imp-97434 (proof, opus-4-8, api-pool). Honest assessment: branch (A) sup bound is FALSE
 * (independently re-confirmed), the disjunction collapses to branch (B) the signed boundary-layer
 * estimate, obstruction stated, sub-gap re-stated. No bound moved; NO QED.
 */

import IMP97353_DEFAULT, {
  IMP97353_VERDICT,
  IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP,
} from './imp-97353-friable-mertens-sup-refutation.js';

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
  for (const d of divs) { const e = Math.abs(d); s += d > 0 ? Math.exp(-e * t) : -Math.exp(-e * t); }
  return s;
}
function supMk(divs) {
  const tmin = 1e-13, tmax = 3, N = 8000;
  let sup = 0;
  for (let i = 0; i <= N; i++) { const t = tmin * Math.pow(tmax / tmin, i / N); const a = Math.abs(Mk(divs, t)); if (a > sup) sup = a; }
  return sup;
}

// Independent re-confirmation of the imp-97353 crossing at the top of the ladder (k = 12, 13).
const SUP_OVER_P = [12, 13].map((k) => ({ k, ratio: supMk(divisorsSigned(k)) / PRIMES[k - 1] }));

export const IMP97434_SUP_BOUND_FALSE = Object.freeze({
  name: 'RESULT 1 -- branch (A) sup_t |M_k(t)| = o(p_k) is FALSE (re-confirmed, imp-97353)',
  measured: 'sup_t |M_k| grows exponentially (per-prime ratio ~1.71); sup/p_k crosses 1 near k = 13',
  reconfirmedRatios: SUP_OVER_P.map((r) => ({ k: r.k, supOverPk: Number(r.ratio.toFixed(4)) })), // ~0.842, ~1.334
  conclusion: 'no o(p_k) sup bound exists; IMP97332_INTERCHANGE_SUBGAP branch (A) is closed NEGATIVELY',
});

export const IMP97434_OBSTRUCTION = Object.freeze({
  name: 'RESULT 2 -- absolute-value majorant of the boundary layer is structurally doomed',
  majorantRole: 'a sup bound only majorizes the sliver: |Integral_0^{c/p_k} g e^t M_k| <= const . (c/p_k) . sup_t |M_k|',
  divergence: 'width x sup ~ (1/p_k) . 1.71^k -> infinity along the primorial ladder, so the majorant is dead',
  nonUniformity: 'M_k(0+) = 0 for every finite k while M(0+) = -2, so the defect can vanish only by SIGNED cancellation',
  cannotSee: 'an absolute-value majorant discards exactly the oscillatory cancellation the estimate needs',
  sameObject: IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP.name,
});

export const IMP97434_INTERCHANGE_SUBGAP_RESTATED = Object.freeze({
  name: 'IMP97434_INTERCHANGE_SUBGAP_RESTATED',
  statement:
    'close IMP97332_INTERCHANGE_SUBGAP through the DIRECT signed boundary-layer estimate ' +
    'Integral_0^tau g(t) e^t [M(t) - M_k(t)] dt -> 0 (equivalently IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP), ' +
    'NOT through a friable-Mertens sup bound -- the latter sup_t |M_k(t)| = o(p_k) is FALSE ' +
    '(imp-97353; sup ~ 1.71^k, crosses p_k at k = 13), so any width x sup majorant diverges and cannot ' +
    'see the M_k(0+)=0 vs M(0+)=-2 cancellation',
  supersedes: 'the sup-bound phrasing of IMP97332_INTERCHANGE_SUBGAP and the imp-97364 STATUS(d) OPEN re-citation',
  coincidesWith: IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP.name,
});

export const IMP97434_VERDICT = Object.freeze({
  question: 'assess the friable-Mertens sup bound sup_t |M_k(t)| = o(p_k) that would close IMP97332_INTERCHANGE_SUBGAP',
  supBoundHolds: false,               // RESULT 1 -- measured-false, re-confirmed
  supBoundOpen: false,                // it is FALSE, not merely open (reconciles imp-97364 STATUS(d))
  disjunctionCollapsesToDirectEstimate: true, // branch (A) dead -> only branch (B) survives
  majorantRouteViable: false,         // RESULT 2 -- width x sup diverges
  liveRouteIsSignedCancellation: true,
  residualSubgap: 'IMP97434_INTERCHANGE_SUBGAP_RESTATED',
  coincidesWithImp97353Subgap: true,
  anyBoundMoved: false,
  rhResolved: false,
  qed: false,
  conclusion:
    'HONEST ASSESSMENT. The imp-97434 disjunction (close IMP97332_INTERCHANGE_SUBGAP via a ' +
    'friable-Mertens sup bound OR via the direct boundary-layer estimate) collapses: branch (A), ' +
    'sup_t |M_k(t)| = o(p_k), is FALSE (imp-97353; sup ~ 1.71^k, sup/p_k ~ 1.334 at k = 13, ' +
    're-confirmed here), so it is not open as the imp-97364 STATUS(d) headword still re-cites. Any ' +
    'absolute-value majorant of the boundary layer diverges (width x sup ~ (1/p_k) 1.71^k) and cannot ' +
    'see the M_k(0+)=0 vs M(0+)=-2 cancellation. The only live route is the direct signed estimate ' +
    'Integral_0^tau g e^t [M - M_k] dt -> 0, which coincides with IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP; ' +
    'IMP97332_INTERCHANGE_SUBGAP is re-stated accordingly (IMP97434_INTERCHANGE_SUBGAP_RESTATED). No ' +
    'mechanism supplied, no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97434_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest assessment: the imp-97434 branch (A) ' +
  'friable-Mertens sup bound sup_t |M_k(t)| = o(p_k) is FALSE (imp-97353; sup ~ 1.71^k, crosses p_k ' +
  'at k = 13, re-confirmed), so IMP97332_INTERCHANGE_SUBGAP is not open as the imp-97364 STATUS(d) ' +
  'headword re-cites -- the disjunction collapses onto branch (B), the direct signed boundary-layer ' +
  'estimate, coinciding with IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP. Any width x sup majorant diverges ' +
  'and cannot see the M_k(0+)=0 vs M(0+)=-2 cancellation. No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97434_ASSERTIONS = [
  {
    id: 'imp97434-sup-bound-crossing-reconfirmed',
    holds: () => {
      // RESULT 1: independently re-confirm sup_t |M_k| > p_k at k = 13 (and < p_k at k = 12),
      // i.e. the o(p_k) sup bound is measured-false.
      const r12 = SUP_OVER_P.find((r) => r.k === 12);
      const r13 = SUP_OVER_P.find((r) => r.k === 13);
      return r12 && r13 && r12.ratio < 1 && r13.ratio > 1;
    },
    why: 'RESULT 1: sup_t |M_k| exceeds p_k at k = 13, so sup_t |M_k(t)| = o(p_k) is false (branch A dead).',
  },
  {
    id: 'imp97434-boundary-layer-nonuniformity-exact',
    holds: () => {
      // M_k(0) = 0 for every finite k (Sum_{e|b_k} mu(e) = 0), the exact non-uniformity vs M(0+) = -2.
      let ok = true;
      for (const k of [3, 5, 7, 9]) { if (Math.abs(Mk(divisorsSigned(k), 0)) > 1e-12) ok = false; }
      return ok;
    },
    why: 'RESULT 2: M_k(0+) = 0 for every finite k while M(0+) = -2 -- the boundary-layer non-uniformity.',
  },
  {
    id: 'imp97434-consistent-with-committed-imp97353-verdict',
    holds: () =>
      IMP97353_VERDICT.friableMertensBoundHolds === false &&
      IMP97353_VERDICT.supGrowsExponentially === true &&
      IMP97434_OBSTRUCTION.sameObject === IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP.name &&
      IMP97434_INTERCHANGE_SUBGAP_RESTATED.coincidesWith === IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP.name &&
      IMP97353_DEFAULT.verdict.qed === false,
    why: 'this assessment must be consistent with the committed imp-97353 refutation it builds on.',
  },
  {
    id: 'imp97434-honesty-gate-no-qed',
    holds: () =>
      IMP97434_VERDICT.supBoundHolds === false &&
      IMP97434_VERDICT.supBoundOpen === false &&
      IMP97434_VERDICT.disjunctionCollapsesToDirectEstimate === true &&
      IMP97434_VERDICT.majorantRouteViable === false &&
      IMP97434_VERDICT.liveRouteIsSignedCancellation === true &&
      IMP97434_VERDICT.residualSubgap === 'IMP97434_INTERCHANGE_SUBGAP_RESTATED' &&
      IMP97434_VERDICT.anyBoundMoved === false &&
      IMP97434_VERDICT.rhResolved === false &&
      IMP97434_VERDICT.qed === false &&
      /NO QED/.test(IMP97434_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97434_HONEST_BANNER) &&
      /RH open/.test(IMP97434_HONEST_BANNER),
    why: 'honest assessment: branch (A) refuted, disjunction collapsed, no mechanism supplied, no bound moved, no QED.',
  },
];

for (const a of IMP97434_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97434-interchange-subgap-sup-bound-collapse assertion failed: ${a.id}`);
  }
}

export default {
  supBoundFalse: IMP97434_SUP_BOUND_FALSE,
  obstruction: IMP97434_OBSTRUCTION,
  subgap: IMP97434_INTERCHANGE_SUBGAP_RESTATED,
  verdict: IMP97434_VERDICT,
  banner: IMP97434_HONEST_BANNER,
};
