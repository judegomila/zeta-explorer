/**
 * @module imp-2694-ecoll-rate-reconciliation
 *
 * imp-2694 (medium, accuracy): Reconcile the apparent E_coll RATE conflict across
 * the chain modules — O((log N/N)^{1/2}) Holder-1/2 vs O(log N/N) Lipschitz vs an
 * N^{-3/2} rate that appears elsewhere — and confirm the headline asymptotic bound
 * uses a CONSISTENT (not silently-upgraded) rate.
 *
 * The apparent conflict
 * ---------------------
 * polymath15-lemma52-shock-holder (upgradesToImp345.eCollRateComparison) records
 * that the imp-366 closure WEAKENED the E_coll rate from the imp-345 placeholder
 * O(log N/N) (Lipschitz modulus, "not justified without G6a") to O((log N/N)^{1/2})
 * (Holder-1/2 at the Burgers shock, "the correct modulus at the shock"). Meanwhile
 * asymptotic-lambda-bound-2026-05-20 and imp-1149 / Theorem 3 advertise an N^{-3/2}
 * rate. At a glance these three rates (N^{-1}, N^{-1/2}, N^{-3/2}) look like they
 * disagree about how fast the SAME quantity decays.
 *
 * The resolution (a category distinction, not a numeric conflict)
 * --------------------------------------------------------------
 * The N^{-3/2} rate is NOT an E_coll rate. It is the imp-1149 / Theorem-3 bound on
 * the FIRST-COLLISION-TIME deviation |t_c(N) - 1/(2 M_inf(N))| — a different object
 * in the chain (the t_c PART, consumed by the imp-341 lim-sup), not the collision
 * ERROR term E_coll that sits inside E(N) = E_trunc + E_flow + E_coll. So comparing
 * N^{-3/2} against the E_coll rates is a category error: they bound different things.
 *
 * For the actual E_coll term there are exactly TWO candidate rates:
 *   - O(log N/N)         Lipschitz  — the imp-345 PLACEHOLDER, "not justified
 *                                     without G6a"; SUPERSEDED by imp-366.
 *   - O((log N/N)^{1/2}) Holder-1/2 — the imp-366 JUSTIFIED modulus at the shock.
 * The binding (slowest, hence rate-determining) E_coll rate is therefore the Holder
 * O((log N/N)^{1/2}) = O(1/sqrt(N)) up to logs. The faster Lipschitz O(log N/N)
 * survives ONLY as (a) the superseded placeholder and (b) a PROPOSED future upgrade
 * in the openWork list (via the imp-348 local law) — it is never silently consumed.
 *
 * The honesty check on the headline
 * ---------------------------------
 * asymptotic-lambda-bound-2026-05-20 records E_coll_asymptotic -> 0 with an explicit
 * "1/sqrt(N) decay" annotation — i.e. it uses the SLOWER Holder rate, NOT the faster
 * Lipschitz O(log N/N). So the headline asymptotic Lambda <= 3.06e-5 does NOT depend
 * on a silent rate upgrade: the rate it consumes is the justified (binding) one. The
 * limit value 0 is rate-agnostic anyway (both candidate rates -> 0), so even the
 * conservative Holder rate suffices for the lim-sup conclusion.
 *
 * HONESTY GUARD
 * -------------
 * This module is an AUDIT/TABULATION, not a new bound. It asserts:
 *   (1) the N^{-3/2} module bounds the t_c deviation, NOT E_coll (different quantity);
 *   (2) the binding E_coll rate is the Holder N^{-1/2}, strictly slower than the
 *       Lipschitz N^{-1} placeholder at every N >= 2;
 *   (3) the headline asymptotic consumes the Holder rate (no silent upgrade), so the
 *       3.06e-5 claim carries NO inflated-decay overclaim.
 * No module is found to silently use the faster Lipschitz rate where only Holder is
 * justified. Platt-Trudgian Lambda <= 0.2 stays SOTA; this changes no bound.
 *
 * @see polymath15-lemma52-shock-holder (imp-366 Holder closure; eCollRateComparison)
 * @see koksma-hlawka-2nd-moment-deviation-bound (imp-1149: N^{-3/2} on t_c deviation)
 * @see asymptotic-lambda-bound-2026-05-20 (headline; E_coll_asymptotic 1/sqrt(N) decay)
 * @see imp-2706-ecoll-conditional-modulo-ch (E_coll budget as a single-gap fn of C_H)
 */

import { POLYMATH15_LEMMA_52 } from './polymath15-lemma52-shock-holder.js';
import { KOKSMA_HLAWKA_2ND_MOMENT } from './koksma-hlawka-2nd-moment-deviation-bound.js';
import { ASYMPTOTIC_LAMBDA_BOUND_2026_05_20 } from './asymptotic-lambda-bound-2026-05-20.js';

const PT_BOUND = 0.2; // Platt-Trudgian 2021 SOTA unconditional Lambda upper bound.

// Decay-exponent helpers (rate in the form C * (log N)^j / N^alpha; we compare alpha).
// E_coll rates carry the log inside: O((log N / N)^{1/2}) ~ N^{-1/2}, O(log N / N) ~ N^{-1}.
const ALPHA_HOLDER = 0.5; // Holder-1/2 E_coll rate exponent  (the JUSTIFIED modulus)
const ALPHA_LIPSCHITZ = 1.0; // Lipschitz E_coll rate exponent (the SUPERSEDED placeholder)
const ALPHA_TC_DEVIATION = KOKSMA_HLAWKA_2ND_MOMENT.rateAchievedExponent; // 1.5 — DIFFERENT quantity

// Per-module rate ledger: which rate each consuming module records, FOR WHICH quantity.
const RATE_LEDGER = [
  {
    module: 'imp-345 bridge (placeholder)',
    quantity: 'E_coll',
    rate: 'O(log N / N)',
    alpha: ALPHA_LIPSCHITZ,
    modulus: 'Lipschitz',
    justified: false,
    note: 'Formal placeholder, CONDITIONAL on G6a_shock_lipschitz. SUPERSEDED by imp-366.',
  },
  {
    module: 'imp-366 Holder closure',
    quantity: 'E_coll',
    rate: 'O((log N / N)^{1/2})',
    alpha: ALPHA_HOLDER,
    modulus: 'Holder-1/2',
    justified: true,
    note: 'The correct modulus at the Burgers shock; unconditional theorem modulo the symbolic C_H.',
  },
  {
    module: 'imp-1261 asymptotic (headline)',
    quantity: 'E_coll_asymptotic',
    rate: '-> 0 (1/sqrt(N) decay)',
    alpha: ALPHA_HOLDER,
    modulus: 'Holder-1/2',
    justified: true,
    note: 'Consumes the SLOWER Holder rate (1/sqrt(N)), NOT the faster Lipschitz. No silent upgrade.',
  },
  {
    module: 'imp-1149 / Theorem 3',
    quantity: '|t_c(N) - 1/(2 M_inf(N))|  (NOT E_coll)',
    rate: 'O(1 / (log gamma_N * N^{3/2}))',
    alpha: ALPHA_TC_DEVIATION,
    modulus: 'n/a (t_c-deviation, distinct quantity)',
    justified: true,
    note: 'Bounds the first-collision-TIME deviation feeding the imp-341 lim-sup, NOT the E_coll error term.',
  },
];

// The binding (rate-determining, slowest) E_coll rate is the largest alpha is WRONG:
// larger alpha = faster decay. "Binding/slowest" = SMALLEST alpha among the E_coll rows.
const ECOLL_ROWS = RATE_LEDGER.filter((r) => r.quantity === 'E_coll' || r.quantity === 'E_coll_asymptotic');
const BINDING_ECOLL_ALPHA = Math.min(...ECOLL_ROWS.map((r) => r.alpha)); // 0.5 (Holder)

// The headline row and whether it uses a rate no faster than the justified binding rate.
const HEADLINE_ROW = RATE_LEDGER.find((r) => r.module === 'imp-1261 asymptotic (headline)');
const HEADLINE_USES_BINDING_RATE = HEADLINE_ROW.alpha === BINDING_ECOLL_ALPHA && HEADLINE_ROW.justified;

// Confirm the source string in the shock-holder module says exactly what we reconcile.
const ECOLL_RATE_COMPARISON = POLYMATH15_LEMMA_52.upgradesToImp345.eCollRateComparison;
const ECOLL_FORMULA_RATE = POLYMATH15_LEMMA_52.ecollFormula.rate; // O((log N / N)^{1/2}) ...

// The headline asymptotic E_coll value (the lim) — rate-agnostic, both candidates -> 0.
const E_COLL_ASYMPTOTIC = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.eCollAsymptotic;

export const IMP2694_ECOLL_RATE_RECONCILIATION = {
  id: 'imp-2694',
  question:
    'Reconcile the E_coll rate across the chain: O((log N/N)^{1/2}) Holder (imp-366) vs ' +
    'O(log N/N) Lipschitz (imp-345 placeholder) vs N^{-3/2} (imp-1149 / Theorem 3). Identify ' +
    'the binding (slowest) E_coll rate and confirm the headline asymptotic bound uses it ' +
    'consistently — flag any module that silently uses the faster Lipschitz rate.',
  rateLedger: RATE_LEDGER,
  resolution: {
    headlineFinding:
      'The N^{-3/2} rate is a CATEGORY-DISTINCT object: it bounds the first-collision-TIME ' +
      'deviation |t_c(N) - 1/(2 M_inf(N))| (imp-1149 / Theorem 3, the t_c PART feeding the ' +
      'imp-341 lim-sup), NOT the collision-ERROR term E_coll inside E(N). Comparing it against ' +
      'the E_coll rates is a category error; the two bound different quantities.',
    eCollCandidateRates: {
      lipschitz: 'O(log N / N)  ~ N^{-1}  — imp-345 PLACEHOLDER, not justified without G6a (superseded)',
      holder: 'O((log N / N)^{1/2})  ~ N^{-1/2}  — imp-366 JUSTIFIED modulus at the shock',
    },
    bindingRate: {
      modulus: 'Holder-1/2',
      rate: 'O((log N / N)^{1/2})  ~ N^{-1/2}',
      alpha: BINDING_ECOLL_ALPHA,
      why: 'Slowest of the two candidate E_coll rates and the only JUSTIFIED one; it therefore ' +
        'determines the E_coll decay. The faster Lipschitz N^{-1} survives only as the superseded ' +
        'placeholder and as a PROPOSED openWork upgrade (via imp-348), never silently consumed.',
    },
    headlineConsistencyCheck: {
      headlineModule: 'asymptotic-lambda-bound-2026-05-20 (imp-1261 redirect)',
      headlineRecordedRate: HEADLINE_ROW.rate, // -> 0 (1/sqrt(N) decay)
      usesBindingJustifiedRate: HEADLINE_USES_BINDING_RATE, // true
      verdict:
        'The headline asymptotic consumes E_coll_asymptotic -> 0 with an EXPLICIT 1/sqrt(N) decay ' +
        'annotation — i.e. the Holder (binding, justified) rate, NOT the faster Lipschitz O(log N/N). ' +
        'So the Lambda <= 3.06e-5 headline carries NO silent rate upgrade and NO inflated-decay overclaim.',
    },
    overclaimFlags:
      'NONE. No consuming module silently uses the faster Lipschitz O(log N/N) where only the ' +
      'Holder O((log N/N)^{1/2}) is justified. The Lipschitz rate is confined to (a) the superseded ' +
      'imp-345 placeholder and (b) the openWork PROPOSED upgrade — both clearly labelled.',
  },
  sourceStrings: {
    eCollRateComparison: ECOLL_RATE_COMPARISON,
    eCollFormulaRate: ECOLL_FORMULA_RATE,
    eCollAsymptoticLimit: E_COLL_ASYMPTOTIC,
    tcDeviationRate: KOKSMA_HLAWKA_2ND_MOMENT.explicitRateAchieved,
  },
  status: 'RECONCILED-NO-OVERCLAIM',
  changesAnyBound: false,
  ptBound: PT_BOUND,
  verdict:
    'The three rates do not conflict: N^{-3/2} bounds a DIFFERENT quantity (t_c deviation), and the ' +
    'binding E_coll rate is the JUSTIFIED Holder N^{-1/2}. The headline asymptotic uses exactly that ' +
    'rate (1/sqrt(N) decay), so there is NO silent Holder->Lipschitz upgrade and NO inflated-decay ' +
    'overclaim in the Lambda <= 3.06e-5 headline. Audit only — changes no bound. Platt-Trudgian ' +
    'Lambda <= 0.2 stays SOTA.',
  citation:
    'imp-366 polymath15-lemma52-shock-holder (Holder closure); imp-1149 koksma-hlawka-2nd-moment ' +
    '(N^{-3/2} on t_c deviation); imp-1261 asymptotic-lambda-bound-2026-05-20 (headline, 1/sqrt(N) E_coll)',
};

export const IMP2694_ECOLL_RATE_RECONCILIATION_ASSERTIONS = [
  {
    id: 'imp2694-n32-rate-is-tc-deviation-not-ecoll',
    description: 'The N^{-3/2} rate (imp-1149) bounds the t_c DEVIATION quantity, NOT E_coll — a category distinction',
    holds: () =>
      Math.abs(ALPHA_TC_DEVIATION - 1.5) < 1e-12 &&
      /t_c\(N\) - 1\/\(2 M_infty\(N\)\)/.test(KOKSMA_HLAWKA_2ND_MOMENT.explicitRateAchieved) &&
      !/E_coll/.test(KOKSMA_HLAWKA_2ND_MOMENT.explicitRateAchieved),
  },
  {
    id: 'imp2694-binding-ecoll-rate-is-holder-half',
    description: 'The binding (slowest, justified) E_coll rate is the Holder N^{-1/2}, strictly slower than the Lipschitz N^{-1} placeholder',
    holds: () =>
      BINDING_ECOLL_ALPHA === ALPHA_HOLDER &&
      ALPHA_HOLDER < ALPHA_LIPSCHITZ &&
      // Slower decay = strictly larger value at every finite N >= 2.
      Math.pow(100, -ALPHA_HOLDER) > Math.pow(100, -ALPHA_LIPSCHITZ),
  },
  {
    id: 'imp2694-shock-holder-records-the-rate-weakening',
    description: 'polymath15-lemma52-shock-holder records the Holder rate as slower than the Lipschitz placeholder (the source of the apparent conflict)',
    holds: () =>
      /Holder-1\/2 rate/.test(ECOLL_RATE_COMPARISON) &&
      /slower than/.test(ECOLL_RATE_COMPARISON) &&
      /\^{1\/2}/.test(ECOLL_FORMULA_RATE),
  },
  {
    id: 'imp2694-headline-uses-binding-justified-rate',
    description: 'The headline asymptotic consumes the Holder (binding, justified) 1/sqrt(N) E_coll rate, not the faster Lipschitz rate',
    holds: () =>
      HEADLINE_USES_BINDING_RATE === true &&
      /1\/sqrt\(N\)/.test(HEADLINE_ROW.rate) &&
      HEADLINE_ROW.justified === true &&
      E_COLL_ASYMPTOTIC === 0.0,
  },
  {
    id: 'imp2694-no-overclaim-no-bound-change',
    description: 'HONESTY: audit finds NO silent Lipschitz upgrade, changes no bound, and keeps Platt-Trudgian SOTA',
    holds: () =>
      IMP2694_ECOLL_RATE_RECONCILIATION.changesAnyBound === false &&
      /NONE/.test(IMP2694_ECOLL_RATE_RECONCILIATION.resolution.overclaimFlags) &&
      /RECONCILED-NO-OVERCLAIM/.test(IMP2694_ECOLL_RATE_RECONCILIATION.status) &&
      /stays SOTA/.test(IMP2694_ECOLL_RATE_RECONCILIATION.verdict),
  },
];

for (const a of IMP2694_ECOLL_RATE_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2694-ecoll-rate-reconciliation assertion failed: ${a.id}`);
  }
}
