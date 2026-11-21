/**
 * @module imp-97210-route-m-kappa-obligation-ledger
 * @fileoverview imp-97210 -- a single OBLIGATION LEDGER tabulating the certified-vs-measured status of
 *   every component of the Route M first-moment constant kappa = kappa_arith + kappa_cot ~ 0.696 that
 *   the imp-97155 cohort index calls a MEASURED total, not a certified one. The four leaves the index
 *   groups (imp-97096/97097/97119/97122) plus their follow-ups (imp-97202/97180/97203/97204) never
 *   present their component statuses side by side; this leaf does exactly that -- one row per component
 *   with its value, EXACT/PROVED/MEASURED status, the specific open input, and the owning ticket.
 *   Report/cross-validation only; asserts nothing beyond the already-established per-leaf status;
 *   changes no bound; no refereed bound is changed; RH open; NO QED.
 *
 *   THE FIRST-MOMENT DECOMPOSITION (imp-97071/97096/97097). The Route M lower companion uses the
 *   Cauchy-Schwarz bound Q(b) >= F(b)^2/S(b), reducing the mean-square lower companion to the first
 *   moment F(b) >= kappa phi(b) b. F splits as F = F_arith - (pi/2) Phi, with
 *     F_arith(b)/(phi(b) b) -> kappa_arith    (arithmetic part, imp-97096)
 *     -(pi/2) Phi(b)/(phi(b) b) -> kappa_cot  (cotangent part, imp-97097)
 *   and Phi(b) = -V(1,b) + S(b), S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) the operative varying-modulus
 *   half, V(1,b) the boundary term. The measured total is kappa = kappa_arith + kappa_cot ~ 0.696.
 *
 *   WHAT THIS LEDGER ADDS (not a new derivation). Read across the leaves one at a time, kappa_arith
 *   looks CLOSED (exact coefficient), the cotangent half looks HALF-CLOSED (fixed-modulus zero,
 *   boundary proved), and the varying-modulus half looks like a lone open mean value. Tabulated
 *   together, the true obligation surface is: TWO components are EXACT/PROVED and contribute a
 *   certified positive leading term modulo one explicit-remainder corner; ONE component (the operative
 *   cotangent coefficient kappa_cot ~ +0.12) is a MEASURED mean value whose certification is DOMINATED
 *   (imp-97204 termwise triangle) by a SINGLE absolute-value constant c_1 ~ 0.29 that must be certified
 *   below kappa_arith = 0.5705, and that c_1 is itself only MEASURED (imp-97180 ruled out the elementary
 *   termwise route; imp-97203 reduced it to a mean-square M2w < 0.32546). So the whole positivity of
 *   kappa rests on ONE open scalar inequality, not four separate gaps -- a consolidation the four
 *   leaves never state jointly. This ledger bakes that reading so future work targets the single c_1
 *   (equivalently M2w) obligation and does NOT re-attempt the already-PROVED fixed-modulus / boundary
 *   corners or the already-EXACT arithmetic coefficient.
 *
 *   HONESTY. Every row restates a status already established (and cited) in its owning ticket; no row
 *   upgrades a MEASURED status to PROVED. kappa ~ 0.696 > 0 stays a measurement. No bound on Lambda
 *   moves. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97155-route-m-first-moment-evaluation-cohort-index.js (the cohort this ledger tabulates)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith)
 * @see imp-97202-route-m-arith-first-moment-uniform-remainder.js (uniform L0/E0 remainder derivation)
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (fixed-modulus half = 0)
 * @see imp-97119-route-m-boundary-cotangent-asymptotic.js (boundary V(1,b) proved)
 * @see imp-97204-route-m-cotangent-signed-firstmoment-lower-bound.js (signed half dominated by A(b))
 * @see imp-97180-route-m-cotangent-absvalue-bulk-firstmoment-obstruction.js (c < kappa_arith open)
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (c_1 -> mean-square M2w)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97210 (accuracy, medium, opus-4-8). Report/cross-validation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...
const KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594 (imp-97096, exact)
const KAPPA_COT_MEASURED = 0.12; // varying-modulus half, measured stable (imp-97097/97204)
const KAPPA_TOTAL_MEASURED = 0.696; // kappa_arith + kappa_cot, measured (imp-97155)
const C1_MEASURED = 0.29; // Sum_a |c_0(h_a/a)| / Sum_a a, measured (imp-97203)
const M2W_TARGET = KAPPA_ARITH * KAPPA_ARITH; // 0.32546..., squared certification target for c_1

// One row per kappa component. status is one of EXACT | PROVED | MEASURED.
const KAPPA_OBLIGATION_LEDGER = Object.freeze([
  Object.freeze({
    component: 'kappa_arith (arithmetic-part leading coefficient)',
    value: '0.5704960511308594 = (3/2) C - 3/8, C = (log 2pi - gamma)/2',
    status: 'EXACT',
    openInput:
      'explicit uniform-in-b remainder on the coprime sums L0/L1: imp-97202 DERIVED the L0/E0 leg ' +
      '|E0(b)| <= (1/2) log b + (1/2) log 2pi + 11/8 + (1/6) sigma(b)/b (no 2^omega prefactor); the ' +
      'matching L1 explicit-remainder corner is not yet fully certified.',
    owner: 'imp-97096 (coefficient), imp-97202 (uniform L0/E0 remainder)',
  }),
  Object.freeze({
    component: 'fixed-modulus cotangent half',
    value: '0 (exactly), for every b >= 2',
    status: 'PROVED',
    openInput: 'none -- collapses to exactly zero by the a <-> b-a antisymmetry.',
    owner: 'imp-97097',
  }),
  Object.freeze({
    component: 'boundary term V(1,b)',
    value: 'V(1,b) = -(b/pi)(log(b/(2pi)) + gamma) - 1/pi + O(1/b) = o(phi(b) b)',
    status: 'PROVED',
    openInput: 'none -- rigorous classical asymptotic; confirms o(phi(b) b) via Landau totient bound.',
    owner: 'imp-97119',
  }),
  Object.freeze({
    component: 'kappa_cot (operative varying-modulus half coefficient)',
    value: '~ +0.12 (measured, stable); = -(pi/2) S(b)/(phi(b) b), S(b) = Sum_a V(b,a)',
    status: 'MEASURED',
    openInput:
      'absolute lower bound kappa_cot > -kappa_arith on a Bettin-Conrey period-function mean value ' +
      'with no elementary closed form; imp-97204 proves (termwise triangle) |S(b)| <= A(b), so this ' +
      'reduces to the single absolute-value constant c_1 below.',
    owner: 'imp-97097 (isolation), imp-97204 (dominated by A(b))',
  }),
  Object.freeze({
    component: 'c_1 (absolute-value bound constant, the sole open scalar)',
    value: '~ 0.29 (measured) = Sum_a |c_0(h_a/a)| / Sum_a a; must certify c_1 < kappa_arith = 0.5705',
    status: 'MEASURED',
    openInput:
      'no rigorous c_1 < kappa_arith: imp-97180 ruled out the elementary termwise route (the ' +
      '(a/h) log a shape fails in the bulk h ~ a/2), imp-97203 reduced it via exact Cauchy-Schwarz to ' +
      'a mean-square M2w, so c_1 < 0.5705 is IMPLIED by certifying M2w < 0.5705^2 = 0.32546.',
    owner: 'imp-97180 (obstruction), imp-97203 (Cauchy-Schwarz reduction to M2w)',
  }),
  Object.freeze({
    component: 'kappa = kappa_arith + kappa_cot (total)',
    value: '~ 0.696 (measured), > 0',
    status: 'MEASURED',
    openInput:
      'certified only once the c_1 (equivalently M2w) inequality is proved: the arithmetic half is ' +
      'exact modulo the L1 remainder corner, the cotangent half is exact-minus-a-mean-value modulo the ' +
      'c_1 positivity estimate. No certified kappa > 0 yet.',
    owner: 'imp-97155 (measured total), imp-97210 (this ledger)',
  }),
]);

export const IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER = Object.freeze({
  id: 'imp-97210',
  proofSection: 'S-frontier',
  ledger: KAPPA_OBLIGATION_LEDGER,
  kappaArith: KAPPA_ARITH,
  kappaCotMeasured: KAPPA_COT_MEASURED,
  kappaTotalMeasured: KAPPA_TOTAL_MEASURED,
  c1Measured: C1_MEASURED,
  c1Target: KAPPA_ARITH,
  m2wTarget: M2W_TARGET,
  soleOpenScalar:
    'c_1 = Sum_a |c_0(h_a/a)| / Sum_a a (measured ~0.29), certified below kappa_arith = 0.5705 ' +
    'iff M2w < 0.32546; this one inequality controls the positivity of the whole first-moment kappa.',
  anyBoundMoved: false,
  question:
    'The kappa = kappa_arith + kappa_cot ~ 0.696 total is spread across eight tickets that never ' +
    'tabulate their component statuses together. Assembled into one ledger, how many components are ' +
    'EXACT/PROVED, and does the residual positivity obligation reduce to a single open scalar or stay ' +
    'a diffuse set of gaps?',
  verdict:
    'OBLIGATION LEDGER / CROSS-VALIDATION ONLY (no new derivation). Of the six rows: kappa_arith is ' +
    'EXACT (imp-97096) modulo an L1 remainder corner (L0/E0 leg already uniform via imp-97202); the ' +
    'fixed-modulus cotangent half is PROVED zero (imp-97097); the boundary term V(1,b) is PROVED ' +
    '(imp-97119). The remaining positivity of kappa rests on the operative cotangent coefficient ' +
    'kappa_cot ~ +0.12 (MEASURED), which imp-97204 dominates termwise by a SINGLE absolute-value ' +
    'constant c_1 ~ 0.29 (MEASURED), and c_1 < kappa_arith is IMPLIED (imp-97203 Cauchy-Schwarz) by ' +
    'the mean-square M2w < 0.32546. So the whole first-moment positivity consolidates into ONE open ' +
    'scalar inequality, not four separate gaps -- a reading the individual leaves never state ' +
    'jointly. Restates only already-established statuses; upgrades no MEASURED row to PROVED; moves no ' +
    'bound; kappa ~ 0.696 stays a measurement; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97155 (cohort index / measured total); imp-97096 + imp-97202 (exact kappa_arith + uniform ' +
    'remainder); imp-97097 (fixed-modulus zero); imp-97119 (boundary term); imp-97204 (signed half ' +
    'dominated by A(b)); imp-97180 + imp-97203 (c_1 obstruction and mean-square reduction).',
});

export default IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER_ASSERTIONS = [
  {
    id: 'imp97210-ledger-has-six-rows',
    why: 'The ledger tabulates the full component list (arithmetic coefficient, fixed-modulus half, ' +
      'boundary term, operative cotangent coefficient, c_1, total); a missing row silently drops an ' +
      'obligation from the cross-validation.',
    holds: () => IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER.ledger.length === 6,
  },
  {
    id: 'imp97210-every-row-has-status-and-owner',
    why: 'The point of the ledger is one status + owning ticket per component; a blank status or owner ' +
      'defeats the tabulation.',
    holds: () =>
      IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER.ledger.every(
        (r) =>
          ['EXACT', 'PROVED', 'MEASURED'].includes(r.status) &&
          typeof r.owner === 'string' &&
          r.owner.length > 0 &&
          typeof r.openInput === 'string' &&
          r.openInput.length > 0,
      ),
  },
  {
    id: 'imp97210-kappa-arith-matches-imp97096',
    why: 'The arithmetic-coefficient row must quote the imp-97096 exact value bit-for-bit, not a ' +
      'rounded restatement.',
    holds: () => Math.abs(IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER.kappaArith - 0.5704960511308594) < 1e-12,
  },
  {
    id: 'imp97210-m2w-target-is-kappa-arith-squared',
    why: 'The consolidated obligation is c_1 < kappa_arith iff M2w < kappa_arith^2; the recorded ' +
      'mean-square target must equal that square, matching imp-97203.',
    holds: () => {
      const l = IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER;
      return Math.abs(l.m2wTarget - l.kappaArith * l.kappaArith) < 1e-15 && Math.abs(l.m2wTarget - 0.32546) < 1e-3;
    },
  },
  {
    id: 'imp97210-total-measured-not-upgraded',
    why: 'The whole honesty gate: the total kappa stays MEASURED and no bound moves; a PROVED total ' +
      'here would be a false QED.',
    holds: () => {
      const total = IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER.ledger.find((r) =>
        r.component.startsWith('kappa = '),
      );
      return (
        total &&
        total.status === 'MEASURED' &&
        IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER.anyBoundMoved === false
      );
    },
  },
  {
    id: 'imp97210-honesty-gate-no-qed',
    why: 'Report/cross-validation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      /NO QED/.test(IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER.verdict) &&
      /refereed bound is changed/i.test(IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER.verdict) &&
      /RH open/.test(IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER.verdict),
  },
];

for (const assertion of IMP97210_ROUTE_M_KAPPA_OBLIGATION_LEDGER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97210-route-m-kappa-obligation-ledger assertion failed: ${assertion.id}`,
    );
  }
}
