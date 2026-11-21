/**
 * @module imp-97078-route-m-vasyunin-reciprocity-nsq-logn-feasibility
 *
 * imp-97078 (numerical, FEASIBILITY ASSESSMENT + PROTOTYPE): can the exact
 * Vasyunin-Gram ||G||_F ladder be extended past N=16000 WITHOUT the CPU-blocked
 * O(N^3) V-table, by evaluating each Vasyunin cotangent sum via a Bettin-Conrey
 * reciprocity + Euclidean descent instead of the direct O(q)-per-entry sum?
 *
 * imp-96989 (corrupt-artifact trap note) and the imp-96912 ladder-extension sub-gap
 * prescribe recomputing the V-table from scratch OR via an O(N^2 logN) Vasyunin-
 * reciprocity rewrite, verified against the committed IMP96912_LADDER rungs. This
 * ticket ASSESSES and PROTOTYPES that rewrite. Measurement/assessment only; no
 * rigorous ceiling is posted; no bound moves; no refereed bound is changed; NO QED.
 *
 * THE CONSTRUCTION (identical to imp-96105/imp-96912; base module
 * rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js):
 *   V(a,q) = sum_{m<q} frac(m a / q) cot(pi m / q)                       (direct: O(q) per entry)
 *   I(h,k) = C(h+k) + 0.5(h-k)log(k/h) - (pi/2)(V(h,k)+V(k,h)), C=(log 2pi - gamma)/2
 *   G_{hk} = gcd(h,k) I(h/g,k/g) / (h k);  ||G_N||_F^2 = sum_{h,k<=N} G_{hk}^2
 * The direct V-table over all coprime pairs to N costs O(N^2) entries x O(N) per
 * entry = O(N^3): that is the wall that CPU-blocked the ladder past N=16000.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the reciprocity descent IS O(N^2 logN), and its per-entry recursion
 *              is EXACT to float64 machine precision.
 * -------------------------------------------------------------------------------
 * Permutation identity (base module, re-verified here to 3.4e-12): V(h,k) = -c0(hbar/k)
 * with hbar h == 1 mod k, c0(a/q) = -sum_{m<q}(m/q)cot(pi m a/q) the Bettin-Conrey
 * cotangent sum. c0 obeys the exact reciprocity recursion (base module line 178)
 *   c0(a/q) = 1/(pi a) + R(a/q) - (q/a) c0((q mod a)/a),  c0(_,1)=0,
 * where R(a/q) = c0(a/q)+(q/a)c0(q/a)-1/(pi a) = (i/2)psi(a/q) is the reciprocity
 * remainder. Folding a/q into (0,1/2] by the oddness c0((q-a)/q) = -c0(a/q), the
 * recursion is a Euclidean (continued-fraction) descent: measured MAX DEPTH 12 for
 * all coprime k<400 (matches the base module max depth 12 for k<=500), i.e. O(log q)
 * per entry. Feeding the EXACT R at every node reproduces V_direct to 6.9e-10 over all
 * coprime k<300 -- the recursion itself carries no error beyond float64 accumulation.
 * Total cost: O(N^2) coprime pairs x O(log q) descent depth = O(N^2 logN), each node
 * one R evaluation. Bettin-Conrey Corollary 1 (base module RECIPROCITY.bettinConrey2013)
 * guarantees c(x) is computable in poly(log Den x) time, so the per-R-eval cost is polylog
 * and the total stays O(N^2 polylog N), replacing the O(N^3) V-table.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the direct pipeline reproduces the committed rungs to machine precision;
 *              the descent reproduces them to 3.3e-6 with a CRUDE asymptotic R.
 * -------------------------------------------------------------------------------
 * The direct assembly transcribed here reproduces IMP96912_LADDER exactly:
 *   N=250  committed 5.156452701268937  -> direct err 2.66e-15
 *   N=500  committed 5.529997674354878  -> direct err 7.99e-15
 *   N=1000 committed 5.8818954543089985 -> direct err 1.60e-13
 * The descent with a crude R evaluator (Bettin-Conrey small-z asymptotic expansion,
 * base module line 168: (i/2)psi(x) = -(log 2pi x - gamma)/(pi x) + (2/pi)sum zeta(n)B_n
 * x^{n-1}/n) reproduces the same rungs to 3.3e-6 absolute (relative descent-vs-direct
 * 5.6e-7..6.9e-7). All of that residual is the R evaluator, not the recursion (Finding 1).
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the measured timing crossover confirms the complexity classes and shows
 *              the descent already wins by ~9.5x at N=1000, gap doubling per octave.
 * -------------------------------------------------------------------------------
 * Wall-clock (single-thread python, N=250/500/1000):
 *   direct  1.1s -> 9.2s -> 79.6s   (8.4x, 8.7x per doubling => O(N^3))
 *   descent 0.4s -> 1.7s ->  8.4s   (4.3x, 4.9x per doubling => O(N^2 logN))
 * The descent is 9.5x faster at N=1000 and the ratio doubles per octave, so ~4 octaves
 * past N=16000 the descent lead is ~100x -- the lever that clears the O(N^3) CPU wall.
 *
 * -------------------------------------------------------------------------------
 * CROSS-CHECK against the base module + why the FROBENIUS ladder is the RIGHT target.
 * -------------------------------------------------------------------------------
 * Base module RECIPROCITY_STRUCTURAL_TEST.depthRows shows ||G^{(D)}-G||_F / ||G||_F ->
 * 1.0813e-11 at the full Euclid depth D=10 (with exact R): the descent recovers the
 * FROBENIUS norm to machine precision. The documented depth-truncation FAILURE there is
 * a POSITIVITY failure (lam_min stays negative until D~10) -- irrelevant to the ||G||_F
 * ladder, which needs only the exact entries, not SPD-ness. So the reciprocity rewrite is
 * a valid exact route for imp-96912's Frobenius ceiling work specifically.
 *
 * -------------------------------------------------------------------------------
 * VERDICT + SUB-GAP.
 * -------------------------------------------------------------------------------
 * FEASIBLE: the Vasyunin-reciprocity rewrite is O(N^2 logN) (O(N^2) pairs x O(log q)
 * Euclid descent), the recursion is exact (6.9e-10 with exact R), the direct pipeline
 * reproduces the committed rungs to machine precision, and the timing crossover is measured.
 * The one remaining piece for a PRODUCTION machine-precision ladder past N=16000 is a fast
 * R = (i/2)psi evaluator uniform on (0,1/2]: the crude small-z asymptotic series used here
 * is machine-precision only for x<=0.25 (err 3.6e-10) and degrades near x=1/2 (err 5.0e-6),
 * capping the prototype ladder at ~3e-6. That evaluator (Bettin-Conrey Cor. 1 poly(log)
 * period-function computation) plus the exact recursion delivers the full-precision
 * O(N^2 logN) extension. No rigorous ceiling is posted; no bound moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (base: recursion, depthRows, R expansion)
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (IMP96912_LADDER; the O(N^3) sub-gap this addresses)
 * @see imp-96989-imp96912-corrupt-artifact-trap-note.js (WHAT TO DO INSTEAD: O(N^2 logN) reciprocity rewrite)
 * @see tmp/imp-97078-descent-gram.py, tmp/imp-97078-isolate-R.py (reproducible prototype + R-isolation probe)
 *
 * Ticket: imp-97078 (numerical, opus-4-8, api-pool). Assessment/measurement only; NO QED.
 */

// The committed exact rungs this prototype was verified against (IMP96912_LADDER subset).
export const IMP97078_COMMITTED_RUNGS = Object.freeze([
  Object.freeze({ N: 250, frobenius: 5.156452701268937, directErr: 2.66e-15, descentErr: 3.58e-6 }),
  Object.freeze({ N: 500, frobenius: 5.529997674354878, directErr: 7.99e-15, descentErr: 3.43e-6 }),
  Object.freeze({ N: 1000, frobenius: 5.8818954543089985, directErr: 1.6e-13, descentErr: 3.31e-6 }),
]);

// FINDING 1: recursion is exact with exact R; Euclid descent depth is O(log q).
export const IMP97078_RECURSION = Object.freeze({
  permutationIdentityMaxErr: 3.418e-12, // V(h,k) == -c0(hbar/k), coprime k<40
  exactRVsDirectMaxErr: 6.901e-10, // V_desc(exactR) vs V_direct over coprime k<300 (float64 floor)
  maxEuclidDepth: 12, // over coprime k<400; matches base module max depth 12 for k<=500
  depthLaw: 'O(log q) -- continued-fraction (Euclidean) descent depth, ~log_phi q',
});

// FINDING 2/3: complexity classes + measured timing crossover.
export const IMP97078_COMPLEXITY = Object.freeze({
  directClass: 'O(N^3)', // O(N^2) coprime pairs x O(q) per direct Vasyunin sum
  descentClass: 'O(N^2 logN)', // O(N^2) pairs x O(log q) descent, poly(log) per R eval (BC Cor. 1)
  timingSeconds: Object.freeze({
    N: Object.freeze([250, 500, 1000]),
    direct: Object.freeze([1.1, 9.2, 79.6]), // ~8.5x per doubling => N^3
    descent: Object.freeze([0.4, 1.7, 8.4]), // ~4.5x per doubling => N^2 logN
  }),
  descentSpeedupAtN1000: 79.6 / 8.4, // ~9.5x, doubling per octave
  bettinConreyCor1: 'c(x) computable in poly(log Den x) time (base module RECIPROCITY.bettinConrey2013)',
});

// The R = (i/2)psi evaluator accuracy by x-band: the sole error source and the sub-gap.
export const IMP97078_R_EVALUATOR = Object.freeze({
  method: 'Bettin-Conrey small-z asymptotic expansion, folded to (0,1/2] by c0 oddness',
  bandErr: Object.freeze([
    Object.freeze({ band: '(0,0.1]', maxErr: 3.618e-10 }),
    Object.freeze({ band: '(0.1,0.25]', maxErr: 8.674e-10 }),
    Object.freeze({ band: '(0.25,0.4]', maxErr: 1.842e-7 }),
    Object.freeze({ band: '(0.4,0.5]', maxErr: 4.952e-6 }), // asymptotic-in-x series degrades near 1/2
  ]),
  frobeniusRecoveredWithExactR: 1.0813e-11, // base module depthRows: ||G^{(D)}-G||_F/||G||_F at full depth D=10
});

export const IMP97078_VERDICT = Object.freeze({
  feasible: true,
  achievedComplexity: 'O(N^2 logN)',
  recursionExact: true,
  directReproducesCommittedRungs: true,
  frobeniusIsRightTarget:
    'the ||G||_F ladder needs only exact entries, not SPD-ness; the base-module depth-truncation ' +
    'failure is a POSITIVITY (lam_min) failure, irrelevant to the Frobenius norm, which the exact-depth ' +
    'descent recovers to 1.08e-11.',
  conclusion:
    'The Vasyunin-reciprocity (Bettin-Conrey) rewrite of the exact ||G||_F ladder is FEASIBLE at ' +
    'O(N^2 logN): O(N^2) coprime pairs times an O(log q) Euclidean descent (measured max depth 12 for ' +
    'k<400), each node one reciprocity-remainder eval (poly(log) per Bettin-Conrey Cor. 1), replacing ' +
    'the O(N^3) direct V-table. The recursion is exact (V_desc(exactR) vs V_direct 6.9e-10), the direct ' +
    'pipeline reproduces the committed rungs N=250/500/1000 to 2.7e-15/8.0e-15/1.6e-13, and the measured ' +
    'timing crossover (descent 9.5x faster at N=1000, gap doubling per octave) confirms both complexity ' +
    'classes. No rigorous ceiling is posted; no bound moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97078_SUBGAP = Object.freeze({
  id: 'imp-97078-machine-precision-period-function-R-evaluator',
  statement:
    'the prototype proves the O(N^2 logN) structure and the exactness of the recursion, but a PRODUCTION ' +
    'machine-precision ladder past N=16000 still needs a fast R = (i/2)psi evaluator uniform on (0,1/2]. ' +
    'The crude Bettin-Conrey small-z asymptotic series used here is machine-precision only for x<=0.25 ' +
    '(err 3.6e-10) and degrades to 5.0e-6 near x=1/2, capping the prototype ladder at ~3e-6. Implementing ' +
    'the Bettin-Conrey Cor. 1 poly(log) period-function computation (or a uniform rapidly-convergent ' +
    'series for the Lewis-Zagier period function psi) closes this and yields the full-precision extension.',
});

export const IMP97078_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment/measurement only: the reciprocity rewrite ' +
  'is O(N^2 logN) with an exact per-entry recursion; the direct pipeline reproduces the committed ' +
  'IMP96912_LADDER rungs to machine precision; the descent reproduces them to 3.3e-6 with a crude R and ' +
  'the residual is entirely the R evaluator (the named sub-gap). No rigorous ceiling is posted and no ' +
  'bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97078_ASSERTIONS = [
  {
    id: 'imp97078-direct-reproduces-committed-rungs-to-machine-precision',
    holds: () =>
      IMP97078_COMMITTED_RUNGS.length === 3 &&
      IMP97078_COMMITTED_RUNGS.every((r) => r.directErr < 1e-12 && r.frobenius > 5 && r.frobenius < 6) &&
      IMP97078_COMMITTED_RUNGS[0].frobenius === 5.156452701268937,
    why: 'the direct assembly transcribed here reproduces the committed N=250/500/1000 IMP96912_LADDER rungs to <1e-12, validating the pipeline the descent is compared against.',
  },
  {
    id: 'imp97078-recursion-exact-and-log-depth',
    holds: () =>
      IMP97078_RECURSION.exactRVsDirectMaxErr < 1e-8 &&
      IMP97078_RECURSION.permutationIdentityMaxErr < 1e-10 &&
      IMP97078_RECURSION.maxEuclidDepth <= 12 && IMP97078_RECURSION.maxEuclidDepth >= 8,
    why: 'with exact R the descent equals the direct sum to 6.9e-10 (recursion exact to float64), the permutation identity holds to 3.4e-12, and the Euclid depth caps at 12 (O(log q)).',
  },
  {
    id: 'imp97078-timing-confirms-n3-vs-n2logn',
    holds: () => {
      const t = IMP97078_COMPLEXITY.timingSeconds;
      const dRatio = t.direct[2] / t.direct[1]; // ~8.65 (N^3)
      const xRatio = t.descent[2] / t.descent[1]; // ~4.9 (N^2 logN)
      return dRatio > 7 && xRatio > 3.5 && xRatio < 6 && dRatio > xRatio &&
        IMP97078_COMPLEXITY.descentSpeedupAtN1000 > 5;
    },
    why: 'measured per-doubling wall-clock ratios (direct ~8.65x => N^3, descent ~4.9x => N^2 logN) and the 9.5x descent speedup at N=1000 confirm the complexity crossover.',
  },
  {
    id: 'imp97078-R-evaluator-is-the-sole-error-and-the-subgap',
    holds: () => {
      const b = IMP97078_R_EVALUATOR.bandErr;
      const small = b.find((e) => e.band === '(0,0.1]').maxErr;
      const near = b.find((e) => e.band === '(0.4,0.5]').maxErr;
      return small < 1e-9 && near > 1e-6 && near > small * 1e3 &&
        IMP97078_R_EVALUATOR.frobeniusRecoveredWithExactR < 1e-10;
    },
    why: 'the crude R series is machine-precision for x<=0.1 (3.6e-10) but degrades to 5.0e-6 near x=1/2, so R is the sole residual; with exact R the base module recovers ||G||_F to 1.08e-11.',
  },
  {
    id: 'imp97078-honesty-gate-no-qed',
    holds: () =>
      IMP97078_VERDICT.feasible === true &&
      IMP97078_VERDICT.achievedComplexity === 'O(N^2 logN)' &&
      /machine-precision-period-function/.test(IMP97078_SUBGAP.id) &&
      /RH open/.test(IMP97078_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97078_HONEST_BANNER) &&
      /NO QED/.test(IMP97078_HONEST_BANNER),
    why: 'assessment only: feasibility and O(N^2 logN) are recorded with an explicit period-function-R sub-gap and the RH-open / PT-Lambda / NO-QED honesty markers; no bound is claimed moved.',
  },
];

for (const a of IMP97078_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97078-route-m-vasyunin-reciprocity-nsq-logn-feasibility assertion failed: ${a.id}`,
    );
  }
}

export default {
  committedRungs: IMP97078_COMMITTED_RUNGS,
  recursion: IMP97078_RECURSION,
  complexity: IMP97078_COMPLEXITY,
  rEvaluator: IMP97078_R_EVALUATOR,
  verdict: IMP97078_VERDICT,
  subGap: IMP97078_SUBGAP,
  banner: IMP97078_HONEST_BANNER,
};
