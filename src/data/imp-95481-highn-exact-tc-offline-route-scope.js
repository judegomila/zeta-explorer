/**
 * @module imp-95481-highn-exact-tc-offline-route-scope
 * @fileoverview imp-95481 -- COSTED OFFLINE-ROUTE SCOPE for the single
 *   unexecuted high-N residual imp-2563-sub-pathc-ladder-replace-highN: the
 *   EXACT heat-semigroup discriminant recompute of t_c(N=2458) on the repaired +
 *   Riemann-Siegel-extended Odlyzko slice, flagged by the imp-95448 R_A part (a)
 *   audit as the only genuinely-remaining data-side item. This module does NOT
 *   run the recompute; it delivers a native-backend route, a precision budget, a
 *   wall-clock bracket, a checkpoint/parallel plan, and a re-pointing analysis of
 *   how an exact t_c(2458) would move the Path C lever-arm rung. ASSESSMENT ONLY:
 *   it derives NO bound, closes NO leg, fires NO certificate, imports no data
 *   table, and asserts NO exact t_c value. R_A stays OPEN; no refereed bound is changed
 *   . NO QED.
 *
 *   WHY float64 CANNOT DO IT (the wall the residual names)
 *   -----------------------------------------------------
 *   The imp-2563 Theorem S4-3 exact ladder forms the monic polynomial
 *   P0(z) = prod_{i=1}^{N} (z - gamma_i) and finds the smallest s > 0 at which
 *   the heat-evolved polynomial exp(s d^2/dz^2) P0 loses a real root (two
 *   ordinates merge). For the first N = 2458 ordinates the roots span
 *   gamma_1 ~ 14.13 up to gamma_2458 ~ 2.99e3, so the monic coefficients span a
 *   dynamic range set by the constant term c_0 = prod gamma_i. In decimal digits
 *     D_dec = sum_{i=1}^{2458} log10(gamma_i)  ~  2458 * mean(log10 gamma) ~ 7.9e3
 *   (mean log10 gamma ~ 3.2 over the range). float64 carries only ~15.95 decimal
 *   digits and an exponent reach of ~+-308, so evalPoly on such coefficients
 *   suffers total catastrophic cancellation near a merging pair -- exactly the
 *   conditioning wall imp-2563-pathc-exact-tc-ladder records past N ~ 12
 *   (EXACT_LADDER_NUMERICAL_CAP_N). The recompute is therefore an ARBITRARY-
 *   PRECISION job, not a float64 one.
 *
 *   THE NATIVE ROUTE (Arb/FLINT, the repos existing gate2 toolchain)
 *   ---------------------------------------------------------------
 *   The repo already links FLINT 3.6.0 (which folds in Arb as the arb/acb types)
 *   from /opt/homebrew in native/gate2-interval/Makefile
 *   (LDFLAGS = -L$(BREW)/lib -lflint -lpthread -lm). The recompute is a new
 *   single-file C target in that same tree (no new dependency, no new package):
 *     1. Read the first 2458 ordinates to full precision from the canonical
 *        1e6-entry Odlyzko table (src/data/zeros-to-1e6.js ZEROS_EXTENDED, which
 *        already covers indices far beyond the 870-entry ZETA_ZEROS), so the
 *        Riemann-Siegel "extension beyond 870" the residual named is a table
 *        LOOKUP, not a re-derivation -- ZEROS_EXTENDED supplies indices > 870.
 *     2. Build P0 as an arb_poly at working precision p bits (arb_poly_product_roots).
 *     3. For a trial s, form the heat-evolved poly exp(s d^2/dz^2) P0 as the
 *        finite even-derivative sum sum_k (s^k/k!) P0^{(2k)} (1229 derivative
 *        pairs for degree 2458), then COUNT distinct real roots via Arb rigorous
 *        real-root isolation (arb_poly real-root count) -- an ENCLOSURE count,
 *        so the collision (count drop by 1) is detected rigorously, not by a
 *        float sign-scan.
 *     4. Bisect s on the collision boundary (~50-80 steps, mirroring the float64
 *        witness) to bracket t_c(2458) to target relative width.
 *   This is the SAME structure as the shipped float64 witness, promoted to Arb.
 *
 *   PRECISION BUDGET
 *   ----------------
 *   To hold coefficients spanning D_dec ~ 7.9e3 decimal digits without losing the
 *   near-collision sign information, working precision must cover that range plus
 *   guard bits for the derivative sums and the root isolation:
 *     p_bits ~ D_dec * log2(10) + guard  ~  7.9e3 * 3.3219 + guard  ~  2.6e4 + guard
 *   Budget p_bits ~ 3.0e4 bits (~ 470 64-bit limbs). This is a REPRESENTATION-
 *   driven floor from the coefficient span; the true working precision needed to
 *   resolve the collision to k correct digits is p_bits + O(k) and is best pinned
 *   empirically (a short precision-doubling ladder: run at p, 2p, verify the
 *   isolated collision interval is stable). NOTE: a coefficient-free route that
 *   NEVER forms P0 (e.g. operate on the roots / a companion-matrix eigenvalue
 *   flow) would slash p_bits below this representation floor -- flagged as the
 *   preferred sharpening if the plain arb_poly route proves precision-bound.
 *
 *   WALL-CLOCK BRACKET (single core, honest order-of-magnitude)
 *   ----------------------------------------------------------
 *   Dominant cost = ~50-80 sequential s-bisection steps, each a degree
 *   d = 2458 rigorous real-root isolation at p ~ 3.0e4 bits. Real-root isolation
 *   of a degree-d Arb poly is ~O(d^2) arb multiplies per refinement sweep
 *   (~d^2 = 6.0e6 multiplies) at ~470 limbs each. Without a native micro-benchmark
 *   the per-multiply cost is only bracketed (this is exactly the gap imp-95461
 *   was scouted to close), so the honest wall-clock bracket is
 *   O(1)-O(1e2) core-hours -- minutes if Arb root isolation is near its
 *   asymptotic best, up to ~a day if the s-bisection and precision-doubling
 *   ladder compound. The job is embarrassingly CHECKPOINTABLE (each bracketed s
 *   interval is independent; persist [sLo,sHi] after every step) and the inner
 *   root isolation parallelizes over FLINT threads, so it is a fire-and-forget
 *   offline run, never an inline build-module job.
 *
 *   HOW THE EXACT t_c(2458) WOULD RE-POINT THE PATH C LEVER-ARM RUNG
 *   ---------------------------------------------------------------
 *   The Path C ladder is |t_c| = a + b/N fitted over N in {50,100,200,500,2458};
 *   N = 2458 is the highest lever-arm point. imp-2605 already REDUCES its exact
 *   value to the single scalar g_min(first 2458 zeros) via the isolated-pair law
 *   t_c ~ kappa * g_min^2 / 8 with kappa VALIDATED in [1.06, 1.19] on the five
 *   exact low-N rungs, and imp-2626 already ships the rigorous CEILING
 *   t_c^part(1e13) <= kappa_hi * delta(1e13)^2/8 ~ 7.4e-3 << 0.2. So the exact
 *   recompute would:
 *     - replace the kappa BAND at N = 2458 with a single CERTIFIED kappa (pinning
 *       the neighbour factor at the actual 2458-ordinate configuration), and
 *     - confirm the g_min scalar is read from the extended table, closing the
 *       provenance leg imp-95448 named.
 *   It would NOT move Lambda: the rung is NON-BINDING (t_c^part << the 0.2 budget),
 *   and R_A stays open through parts (b)/(c) plus imp-2621 (refuted amplified
 *   rate) and imp-35164 (E(N) does not vanish). The deliverable is AUDIT
 *   COMPLETENESS on the highest lever-arm rung, not a bound improvement.
 *
 *   GO / NO-GO
 *   ----------
 *   NO-GO inline (arbitrary-precision degree-2458 job, far too heavy for a build
 *   module -- correctly named as a residual, not a bug). FEASIBLE offline on the
 *   existing FLINT toolchain at the ~3.0e4-bit budget above, but LOW PRIORITY:
 *   the consumer is non-binding and imp-2605 (reduce) + imp-2626 (ceiling)
 *   already bracket the value, so the exact rung buys provenance closure, not a
 *   tighter Lambda. Recommended sequencing: firm the wall-clock via imp-95461's
 *   Arb multiply micro-benchmark FIRST, then decide, and prefer the
 *   coefficient-free (companion / root-flow) route if the arb_poly build proves
 *   precision-bound. No exact t_c(2458) is asserted here -- only the costed plan.
 *
 * @see src/data/imp-2563-pathc-exact-tc-ladder.js (the residual + imp-2605 reduction + imp-2626 ceiling)
 * @see src/data/imp-95448-ra-ladder-input-data-audit.js (R_A part (a) verdict naming this residual)
 * @see native/gate2-interval/Makefile (existing FLINT/Arb link line the route reuses)
 * @see src/data/imp-95461-... (scouted Arb multiply micro-benchmark that firms the wall-clock)
 */

// ── Baked scope figures (analytic estimates; NO data-table import, NO compute) ─
// gamma_2458 from the Riemann-von Mangoldt count N(T) ~ (T/2pi)(log(T/2pi) - 1):
// solving (u)(log u - 1) = 2458 gives u = T/2pi ~ 476, so gamma_2458 ~ 2.99e3.
const N_HIGH = 2458;
const GAMMA_2458_APPROX = 2.99e3;           // Riemann-von Mangoldt inversion
const MEAN_LOG10_GAMMA = 3.2;               // mean log10(gamma_i) over i=1..2458
const D_DEC = N_HIGH * MEAN_LOG10_GAMMA;     // ~7.9e3 decimal-digit coefficient span
const LOG2_10 = Math.log2(10);              // 3.321928...
const P_BITS_FLOOR = D_DEC * LOG2_10;        // ~2.6e4 representation-driven floor
const P_BITS_BUDGET = 3.0e4;                 // floor + guard, ~470 64-bit limbs
const FLOAT64_DECIMAL_DIGITS = 15.95;        // why float64 fails: << D_DEC
const S_BISECTION_STEPS = 80;                // mirrors the shipped float64 witness
const ROOT_ISO_MULTIPLIES_PER_STEP = N_HIGH * N_HIGH; // ~O(d^2) arb multiplies

export const HIGHN_EXACT_TC_OFFLINE_ROUTE_SCOPE = {
  id: 'imp-95481',
  residual: 'imp-2563-sub-pathc-ladder-replace-highN',
  ticket: 'imp-95481',
  status:
    'costed offline-route SCOPE delivered; recompute NOT run (assessment only, no bound moved)',
  title:
    'Native Arb/FLINT offline route, precision budget, wall-clock bracket and ' +
    're-pointing analysis for the exact heat-semigroup t_c(N=2458) recompute',

  whyFloat64Fails: {
    method:
      'imp-2563 Theorem S4-3 forms the monic P0(z) = prod (z - gamma_i) and finds ' +
      'the smallest s at which exp(s d^2/dz^2) P0 loses a real root (a merging pair).',
    coefficientSpanDecimalDigits: +D_DEC.toFixed(0),
    float64DecimalDigits: FLOAT64_DECIMAL_DIGITS,
    gamma2458Approx: GAMMA_2458_APPROX,
    conditioningCapN: 12,
    note:
      'The constant term prod gamma_i spans ~' + D_DEC.toFixed(0) + ' decimal digits, ' +
      'so evalPoly near a merging pair loses all significance in float64 -- the N ~ 12 ' +
      'conditioning wall recorded in imp-2563-pathc-exact-tc-ladder. Hence an ' +
      'arbitrary-precision native route is required.',
  },

  nativeRoute: {
    backend: 'FLINT 3.6.0 (Arb arb/acb types) at /opt/homebrew',
    reuses: 'native/gate2-interval/Makefile link line (-lflint -lpthread -lm); no new package',
    dataInput:
      'first 2458 ordinates from src/data/zeros-to-1e6.js ZEROS_EXTENDED (canonical ' +
      '1e6-entry Odlyzko table) -- the R-S "extension beyond index 870" is a table ' +
      'lookup, not a re-derivation',
    steps: [
      'build P0 via arb_poly_product_roots at working precision p',
      'form exp(s d^2/dz^2) P0 as the finite even-derivative sum sum_k (s^k/k!) P0^{(2k)} (1229 derivative pairs)',
      'count distinct real roots by Arb rigorous real-root ISOLATION (enclosure count, not float sign-scan)',
      'bisect s on the collision boundary (count drop by 1) for ~80 steps',
    ],
    coefficientFreeAlternative:
      'a route that never forms P0 (companion-matrix eigenvalue flow / operate on ' +
      'the roots) would drop p below the representation floor -- preferred sharpening ' +
      'if the plain arb_poly build proves precision-bound',
  },

  precisionBudget: {
    representationFloorBits: +P_BITS_FLOOR.toFixed(0),
    budgetBits: P_BITS_BUDGET,
    budgetLimbs64: Math.ceil(P_BITS_BUDGET / 64),
    derivation:
      'p_bits ~ D_dec * log2(10) + guard = ' + D_DEC.toFixed(0) + ' * ' +
      LOG2_10.toFixed(4) + ' + guard ~ ' + P_BITS_FLOOR.toFixed(0) + ' + guard; ' +
      'budget ~' + P_BITS_BUDGET + ' bits (~' + Math.ceil(P_BITS_BUDGET / 64) + ' limbs). ' +
      'Pin the true working precision empirically with a p, 2p doubling ladder that ' +
      'verifies the isolated collision interval is stable.',
  },

  wallClockBracket: {
    dominantCost:
      '~' + S_BISECTION_STEPS + ' sequential s-bisection steps, each a degree-' +
      N_HIGH + ' rigorous real-root isolation at ~' + P_BITS_BUDGET + ' bits',
    rootIsoMultipliesPerStep: ROOT_ISO_MULTIPLIES_PER_STEP,
    bracketCoreHours: [1, 100],
    uncertainty:
      'per-multiply cost at ~470 limbs is only bracketed without a native micro-' +
      'benchmark (the gap imp-95461 was scouted to close); hence an order-of-magnitude ' +
      'bracket, minutes-to-~a-day single-core',
    parallelAndCheckpoint:
      'embarrassingly checkpointable (persist [sLo,sHi] each step; each bracketed s is ' +
      'independent) and the inner root isolation parallelizes over FLINT threads -- ' +
      'a fire-and-forget offline run, never an inline build job',
  },

  rePointing: {
    consumer: 'Path C lever-arm rung N = 2458 in the |t_c| = a + b/N ladder',
    whatItChanges: [
      'replaces the imp-2605 kappa BAND [1.06, 1.19] with a single CERTIFIED kappa at the 2458-ordinate configuration',
      'closes the imp-95448 provenance leg (g_min read from the extended table)',
    ],
    whatItDoesNotChange:
      'does NOT move Lambda: t_c^part is NON-BINDING (imp-2626 ceiling ~7.4e-3 << 0.2 ' +
      'budget) and R_A stays open via parts (b)/(c) + imp-2621 (refuted amplified rate) ' +
      '+ imp-35164 (E(N) does not vanish). Deliverable = audit completeness, not a bound.',
  },

  goNoGo: {
    inline: 'NO-GO (arbitrary-precision degree-2458 job; correctly named a residual)',
    offline: 'FEASIBLE on the existing FLINT toolchain at the ~3.0e4-bit budget',
    priority:
      'LOW -- consumer non-binding; imp-2605 (reduce) + imp-2626 (ceiling) already ' +
      'bracket the value, so the exact rung buys provenance closure, not tighter Lambda',
    recommendedSequencing:
      'firm the wall-clock via the imp-95461 Arb multiply micro-benchmark FIRST, then ' +
      'decide; prefer the coefficient-free route if arb_poly proves precision-bound',
  },

  honest:
    'Costed plan only. No exact t_c(2458) is asserted, no certificate fires, no data ' +
    'table is imported, and no bound is moved. R_A remains OPEN and no refereed bound is changed' +
    '. NO QED.',

  sources: [
    'src/data/imp-2563-pathc-exact-tc-ladder.js (residual + imp-2605 reduction + imp-2626 ceiling)',
    'src/data/imp-95448-ra-ladder-input-data-audit.js (R_A part (a) verdict)',
    'native/gate2-interval/Makefile (FLINT/Arb link line reused)',
    'src/data/zeros-to-1e6.js ZEROS_EXTENDED (extended Odlyzko table the route reads)',
  ],
};

// ── Build-time assertions (pure arithmetic on the baked scope; NO heavy compute) ─
export const HIGHN_EXACT_TC_OFFLINE_ROUTE_SCOPE_ASSERTIONS = [
  {
    id: 'imp95481-precision-floor-exceeds-float64',
    holds: () =>
      P_BITS_FLOOR > 1e4 && D_DEC > FLOAT64_DECIMAL_DIGITS * 100,
    why:
      'The coefficient span (~' + D_DEC.toFixed(0) + ' decimal digits) dwarfs the ~16 ' +
      'digits of float64, so the representation-driven precision floor (~' +
      P_BITS_FLOOR.toFixed(0) + ' bits) exceeds 1e4 -- pinning WHY the recompute is an ' +
      'arbitrary-precision offline job and not a float64 build-module one.',
  },
  {
    id: 'imp95481-precision-budget-covers-floor',
    holds: () =>
      P_BITS_BUDGET >= P_BITS_FLOOR &&
      HIGHN_EXACT_TC_OFFLINE_ROUTE_SCOPE.precisionBudget.budgetLimbs64 ===
        Math.ceil(P_BITS_BUDGET / 64),
    why:
      'The stated ~' + P_BITS_BUDGET + '-bit budget must cover the representation floor ' +
      'and its limb count must be consistent, so the costed precision plan is internally ' +
      'sound.',
  },
  {
    id: 'imp95481-scope-is-assessment-only',
    holds: () =>
      HIGHN_EXACT_TC_OFFLINE_ROUTE_SCOPE.goNoGo.inline.startsWith('NO-GO') &&
      HIGHN_EXACT_TC_OFFLINE_ROUTE_SCOPE.rePointing.whatItDoesNotChange.includes('does NOT move Lambda'),
    why:
      'This ticket is a costed SCOPE: it must record NO-GO inline and that the exact ' +
      'recompute would not move Lambda (the rung is non-binding), so no reader mistakes ' +
      'the plan for a delivered bound. No QED.',
  },
];

// ── Self-executing witness (throws at import if any scope invariant regresses) ──
for (const a of HIGHN_EXACT_TC_OFFLINE_ROUTE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      '[imp-95481-highn-exact-tc-offline-route-scope] build-time assertion failed: ' +
        a.id + ' - ' + a.why,
    );
  }
}
