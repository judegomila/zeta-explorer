/**
 * @module imp-1260-largea-crossover
 * @fileoverview imp-1260 (PARTIAL) -- large-a crossover analysis for the central
 *   contraction conjecture of the entire SS15-27 program:
 *
 *       ||V_{a,Phi}||_op <= 1   for every a > 0     (Conjecture 27.2)
 *
 *   with  (V_{a,Phi} f)(x) = Phi(x) int_0^x Phi(y) sinh(a(x - y)) f(y) dy
 *   on L^2([0, infty)) and kernel k(x,y) = Phi(x) Phi(y) sinh(a(x-y)) 1_{y<=x}.
 *
 *   WHY THIS TICKET
 *   ---------------
 *   By imp-1258 the whole SS15-27 proof program reduces to Conj 27.2. imp-1260
 *   lists four analytical routes to the bound; the status before this file was:
 *     route 1 (Hilbert-Schmidt, imp-1267): closed-form ||V|| <= sqrt(I_0 J_a),
 *         DOCUMENTED as covering only "a in (0, ~2]" with a > 2 needing a
 *         sharper technique.
 *     route 3 (Mellin, imp-1266): structurally blocked (NEGATIVE result).
 *     routes 2 (Carleson) / 4 (Wiener-Hopf): open.
 *   The "single remaining open sub-gap" was therefore believed to be the
 *   large-a regime a > 2.
 *
 *   THE FINDING (corrects imp-1267 coverage claim)
 *   ----------------------------------------------
 *   Direct numerical evaluation of the THREE rigorous bounds below shows the
 *   imp-1267 "(0, ~2]" coverage statement was far too pessimistic. The
 *   Cauchy-Schwarz HS bound sqrt(I_0 J_a) does NOT cross 1 near a = 2 -- it
 *   crosses 1 at
 *
 *       a*_CS-HS  ~=  34.98          (resolution-stable to 7 sig figs).
 *
 *   The reason: J_a = int_0^infty Phi(u)^2 sinh^2(au) du does NOT grow like
 *   e^{4a}. Phi(u)^2 is concentrated on u in [0, ~0.3] (super-exponential
 *   decay, Phi(0.5) ~ 1e-8), so the effective exponential growth rate of J_a
 *   is only ~ e^{2 a u_eff} with u_eff ~ 0.1 -- giving a crossover an ORDER OF
 *   MAGNITUDE beyond the documented a = 2.
 *
 *   THREE RIGOROUS BOUNDS, EACH WITH ITS CROSSOVER a*
 *   ------------------------------------------------
 *     (1) CS-HS    ||V|| <= sqrt(I_0 J_a)                     a* ~= 34.98
 *     (2) exact-HS ||V|| <= sqrt( int int_{y<=x} |k|^2 )      a* ~= 37.66
 *     (3) Schur    ||V|| <= sqrt( sup_x R(x) . sup_y C(y) )   a* ~= 35.86
 *           R(x) = int_0^x k(x,y) dy   (row sum, k >= 0)
 *           C(y) = int_y^infty k(x,y) dx   (col sum)
 *
 *   exact-HS (dropping the lossy sinh(a(x-y)) <= sinh(ax) Cauchy-Schwarz step
 *   of imp-1267) is the sharpest of the three and extends the rigorously-closed
 *   range to a in (0, ~37.66]. (Schur barely beats CS-HS here because the
 *   kernel is rank-1-ish -- consistent with the imp-1266 finding that
 *   ||V||_HS ~= ||V||_op to 2%.)
 *
 *   NET EFFECT ON imp-1260
 *   ----------------------
 *   The open sub-gap shrinks from the previously-documented "a > 2" to
 *
 *       a > ~37.66       (open: still needs Wiener-Hopf / Carleson / a
 *                         growth-rate argument for the J_a tail).
 *
 *   This is a ~19x widening of the rigorously-closed interval. It does NOT
 *   close Conj 27.2 (which is for ALL a > 0); imp-1260 stays OPEN. But it
 *   pins the remaining work to a clean, narrow target: an a-uniform argument
 *   for a > ~38. Since the App-S operative range is a <= 0.5 (imp-1240/1248),
 *   the bound is now closed across the entire operative regime with a margin
 *   of ~70x in a.
 *
 *   HONEST SCOPE
 *   ------------
 *   1. The crossovers a* are evaluated by fine quadrature (midpoint, N=6000 on
 *      [0, U_INF=3], h=5e-4) + bisection, NOT in closed form. They are
 *      resolution-stable: a*_CS-HS = 34.980468 at N=6000 and 34.980465 at
 *      N=12000 (agree to 7 sig figs).
 *   2. Phi is truncated at n=10 (same as imp-1240/1266/1267); the tail is
 *      floating-point zero past u ~ 0.8.
 *   3. The integration window [0, 3] is irrelevant to J_a / HS for the swept a
 *      because Phi(u)^2 underflows to exactly 0 past u ~ 0.8 (so sinh growth at
 *      large u multiplies a zero). Confirmed: a* is identical at U_INF in
 *      {2.5, 3, 4}.
 *   4. exact-HS and Schur require an O(N^2) double quadrature; the crossover
 *      bisection on these is the dominant cost (~9 s total).
 *   5. This is a NUMERICAL quantification of three RIGOROUS bounds, not a
 *      symbolic proof. imp-1260 remains OPEN for a > ~37.66.
 *
 *   RAW DATA SOURCE
 *   ---------------
 *   scripts/compute-imp1260-largea-crossover.mjs, run 2026-05-29.
 *
 *   RELATED
 *   -------
 *   - imp-1267 (src/data/imp-1267-volterra-hs-bound.js) -- route 1 HS bound
 *     whose "(0, ~2]" coverage claim this file corrects to (0, ~34.98].
 *   - imp-1266 (src/data/imp-1266-volterra-mellin-symbol.js) -- route 3 blocked;
 *     its rigorous effective-support bound gave a <= ~12.6 (this file extends
 *     it to ~37.66 via the exact double integral).
 *   - imp-1286 (src/data/imp-1286-tail-bound-transfer.js) -- tail transfer.
 *
 *   Ticket: imp-1260 (proof, critical, OPUS -- PARTIAL: large-a sub-gap pinned).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// I_0 = ||Phi||_{L^2(R_+)}^2 on [0, U_INF=3], N=6000 midpoint (matches imp-1267).
const I_0 = 0.010472039381481349;

// ── The three rigorous bounds at representative a (frozen 2026-05-29 run) ────
// Each (csHs, exactHs, schur) is a rigorous UPPER bound on ||V_{a,Phi}||_op.
const FROZEN_ROWS = Object.freeze([
  Object.freeze({ a: 0.5, csHs: 0.00029353273499239946, exactHs: 0.00019002987410420753, schur: 0.0002927234070958092 }),
  Object.freeze({ a: 1, csHs: 0.000587918655416264, exactHs: 0.0003805465135209245, schur: 0.0005863073698938988 }),
  Object.freeze({ a: 2, csHs: 0.001182708780009155, exactHs: 0.000765011199084746, schur: 0.0011795374367007823 }),
  Object.freeze({ a: 3, csHs: 0.0017914899662472747, exactHs: 0.0011574419069099607, schur: 0.0017868167968190978 }),
  Object.freeze({ a: 4, csHs: 0.0024218920175488193, exactHs: 0.0015621527293729596, schur: 0.0024156866505122576 }),
  Object.freeze({ a: 5, csHs: 0.0030823459273085136, exactHs: 0.001983874795921836, schur: 0.003074331826852202 }),
  Object.freeze({ a: 6, csHs: 0.0037824206731696293, exactHs: 0.0024279295961039567, schur: 0.003771848474875488 }),
  Object.freeze({ a: 8, csHs: 0.005347905418762319, exactHs: 0.003408553471005064, schur: 0.0053264520203953935 }),
  Object.freeze({ a: 10, csHs: 0.0072354840784629604, exactHs: 0.004567451410394594, schur: 0.007184558225137379 }),
]);

// ── Crossovers a* where each bound first reaches 1 (bisection on monotone f) ─
const CROSSOVERS = Object.freeze({
  csHs: 34.98046830007358,
  exactHs: 37.66224029609832,
  schur: 35.858260610875035,
  resolutionCheck: Object.freeze({
    csHs_N6000: 34.98046830007358,
    csHs_N12000: 34.980464692508605,
    agreesToSigFigs: 7,
  }),
});

export const IMP1260_LARGEA_CROSSOVER = Object.freeze({
  id: 'imp-1260-largea-crossover',
  ticket: 'imp-1260',
  generatedAt: '2026-05-29T05:30:00Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['SS25', 'SS26', 'SS27'],
  parentTicket: 'imp-1260',
  relatedTickets: ['imp-1258', 'imp-1266', 'imp-1267', 'imp-1286'],
  status: 'partial-open',

  summary:
    'Large-a crossover analysis for Conj 27.2 (||V_{a,Phi}|| <= 1). Corrects ' +
    'the imp-1267 "(0, ~2]" coverage claim: the Cauchy-Schwarz HS bound ' +
    'sqrt(I_0 J_a) actually crosses 1 at a* ~= 34.98, not ~2, because ' +
    'J_a = int Phi^2 sinh^2(au) du grows far slower than e^{4a} (Phi^2 is ' +
    'concentrated on [0, ~0.3]). The exact HS double integral (no CS step) ' +
    'extends the rigorously-closed range to a in (0, ~37.66]; Schur gives ' +
    '~35.86. The open sub-gap of imp-1260 shrinks from a > 2 to a > ~37.66 ' +
    '(~19x wider closed interval). imp-1260 stays OPEN for all a > 0.',

  conjectureTarget: Object.freeze({
    label: 'Conjecture 27.2 (Endpoint-Hankel Volterra contraction)',
    statement: 'For every a > 0, ||V_{a,Phi}|| <= 1 (operator norm in L^2([0, infty))).',
    paperSection: 'SS27',
  }),

  bounds: Object.freeze({
    csHs: Object.freeze({
      label: 'CS-HS (route 1, imp-1267)',
      formula: '||V||_op <= sqrt(I_0 . J_a),  J_a = int_0^infty Phi(u)^2 sinh^2(au) du',
      crossover_aStar: CROSSOVERS.csHs,
      coverage: 'a in (0, ~34.98]',
      note: 'Lossy step sinh(a(x-y)) <= sinh(ax) decouples x and y.',
    }),
    exactHs: Object.freeze({
      label: 'exact-HS (drops the CS step)',
      formula: '||V||_op <= sqrt( int_0^infty int_0^x Phi(x)^2 Phi(y)^2 sinh^2(a(x-y)) dy dx )',
      crossover_aStar: CROSSOVERS.exactHs,
      coverage: 'a in (0, ~37.66]',
      note: 'Sharpest of the three; keeps the y-decay of the difference term.',
    }),
    schur: Object.freeze({
      label: 'Schur / Holmgren test',
      formula: '||V||_op <= sqrt( sup_x R(x) . sup_y C(y) ),  R(x)=int_0^x k, C(y)=int_y^infty k',
      crossover_aStar: CROSSOVERS.schur,
      coverage: 'a in (0, ~35.86]',
      note: 'Barely beats CS-HS: kernel is rank-1-ish (||V||_HS ~= ||V||_op, imp-1266).',
    }),
  }),

  method: Object.freeze({
    quadrature: 'midpoint on [0, U_INF=3], N=6000 nodes (h=5e-4)',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: 10,
    crossoverMethod: 'bisection on each (monotone-increasing-in-a) bound to f(a*)=1',
    windowIrrelevance: 'a* identical for U_INF in {2.5, 3, 4} (Phi^2 underflows to 0 past u~0.8)',
    I_0_value: I_0,
  }),

  rows: FROZEN_ROWS,
  crossovers: CROSSOVERS,

  openSubGap: Object.freeze({
    range: 'a > ~37.66',
    previouslyDocumented: 'a > 2 (imp-1267)',
    wideningFactor: '~19x (closed interval extends from ~2 to ~37.66)',
    operativeRangeFullyCovered: 'a <= 0.5 (App-S / imp-1240/1248) -- margin ~70x in a',
    remainingTechniques: ['Wiener-Hopf (route 4, imp-1287)', 'Carleson-Volterra-Hardy (route 2)', 'closed-form J_a growth-rate bound'],
  }),

  honestScope: Object.freeze({
    isNumericalQuantification: true,
    isProof: false,
    closesImp1260: false,
    correctsImp1267CoverageClaim: true,
    coverageRangeClosed: 'a in (0, ~37.66] (best of three rigorous bounds)',
    notCoveredRange: 'a > ~37.66',
    crossoverResolutionStable: true,
    boundsAreRigorousNumbersNotSymbolic: true,
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    hsRoute: 'src/data/imp-1267-volterra-hs-bound.js (imp-1267)',
    mellinRoute: 'src/data/imp-1266-volterra-mellin-symbol.js (imp-1266)',
    tailTransfer: 'src/data/imp-1286-tail-bound-transfer.js (imp-1286)',
    cdbBridge: 'src/data/imp-1258-volterra-cdb-bridge.js (imp-1258)',
    computeScript: 'scripts/compute-imp1260-largea-crossover.mjs',
    schurTest: 'Halmos-Sunder, Bounded Integral Operators on L^2 Spaces -- Schur test',
  }),
});

// ── Tripwire assertions ──────────────────────────────────────────────────────
export const IMP1260_LARGEA_CROSSOVER_ASSERTIONS = [
  {
    id: 'imp1260-row-count-9',
    why: 'The sample table covers a in {0.5,1,2,3,4,5,6,8,10} -- exactly 9 rows. ' +
         'A mis-count means the freeze dropped or duplicated rows.',
    holds: () => IMP1260_LARGEA_CROSSOVER.rows.length === 9,
  },
  {
    id: 'imp1260-all-sample-bounds-far-below-one',
    why: 'Every rigorous bound at every sampled a (<= 10) must be << 1 -- the ' +
         'largest sampled a=10 gives csHs ~7.2e-3. A row breaching even 1e-2 ' +
         'means the freeze was overwritten with a wrong sweep.',
    holds: () => IMP1260_LARGEA_CROSSOVER.rows.every(
      (r) => r.csHs < 1e-2 && r.exactHs < 1e-2 && r.schur < 1e-2,
    ),
  },
  {
    id: 'imp1260-exactHs-sharpest-csHs-loosest',
    why: 'exact-HS drops the lossy Cauchy-Schwarz step, so exactHs <= csHs at ' +
         'every row. If this ordering flips, the bounds are computed ' +
         'inconsistently with their definitions.',
    holds: () => IMP1260_LARGEA_CROSSOVER.rows.every(
      (r) => r.exactHs <= r.csHs && r.exactHs <= r.schur,
    ),
  },
  {
    id: 'imp1260-crossover-far-beyond-two',
    why: 'The headline correction: the CS-HS crossover is ~35, NOT ~2 as ' +
         'imp-1267 documented. a*_CS-HS must be > 30 (it is 34.98). If it ' +
         'drops near 2, the finding has been silently reverted.',
    holds: () => IMP1260_LARGEA_CROSSOVER.crossovers.csHs > 30,
  },
  {
    id: 'imp1260-exactHs-crossover-extends-csHs',
    why: 'exact-HS is sharper than CS-HS, so its crossover must be LARGER: ' +
         'a*_exact >= a*_CS-HS. This is the basis for the (0, ~37.66] coverage ' +
         'claim that extends imp-1267.',
    holds: () => {
      const c = IMP1260_LARGEA_CROSSOVER.crossovers;
      return c.exactHs >= c.csHs && c.exactHs > 37 && c.exactHs < 39;
    },
  },
  {
    id: 'imp1260-crossover-resolution-stable',
    why: 'The headline crossover must be resolution-stable: N=6000 and N=12000 ' +
         'agree to ~7 sig figs (34.9804683 vs 34.9804647). If these diverge, ' +
         'the quadrature is under-resolved and the crossover is unreliable.',
    holds: () => {
      const rc = IMP1260_LARGEA_CROSSOVER.crossovers.resolutionCheck;
      return Math.abs(rc.csHs_N6000 - rc.csHs_N12000) < 1e-4;
    },
  },
  {
    id: 'imp1260-stays-open',
    why: 'imp-1260 is for ALL a > 0; this file only pins the large-a sub-gap. ' +
         'honestScope must flag closesImp1260=false and isProof=false -- the ' +
         'central conjecture is NOT resolved here.',
    holds: () => {
      const h = IMP1260_LARGEA_CROSSOVER.honestScope;
      return h.closesImp1260 === false && h.isProof === false &&
             h.correctsImp1267CoverageClaim === true;
    },
  },
  {
    id: 'imp1260-I0-matches-imp1267',
    why: 'I_0 = ||Phi||_L2^2 must match the imp-1267 value ~1.0472e-2 to 4 sig ' +
         'figs. A drift means the Phi kernel was reparameterized, invalidating ' +
         'every bound that depends on it.',
    holds: () => Math.abs(IMP1260_LARGEA_CROSSOVER.method.I_0_value - 1.0472e-2) < 1e-5,
  },
  {
    id: 'imp1260-open-subgap-named',
    why: 'The open sub-gap range must be explicitly recorded as a > ~37.66 ' +
         '(the exact-HS crossover boundary). If this string drifts, the ' +
         'honest-scope record no longer matches the computed crossover.',
    holds: () => IMP1260_LARGEA_CROSSOVER.openSubGap.range.includes('37.66'),
  },
];

export default IMP1260_LARGEA_CROSSOVER;
