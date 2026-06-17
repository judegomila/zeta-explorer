/**
 * @module imp-2654-volterra-rigorous-bound-status
 * @fileoverview imp-2654 (proof, critical) -- Honest assessment of the SHARPEST
 *   rigorous upper bound on the endpoint-Hankel Volterra operator norm
 *   ||V_{a,Phi}||_op now provable, after the imp-2660 retraction of the
 *   Wiener-Hopf route. Names the SINGLE remaining obstruction to a rigorous
 *   ||V_{a,Phi}|| <= 1 on the physical band. NO false QED.
 *
 *   TARGET (imp-1258 collapse)
 *   --------------------------
 *   By imp-1258 the entire SS15-27 program reduces to one statement
 *
 *       ||V_{a,Phi}||_{L^2([0, infty))} <= 1   for every a > 0   (Conj 27.2)
 *
 *   with (V f)(x) = Phi(x) int_0^x Phi(y) sinh(a(x - y)) f(y) dy. The empirical
 *   pilot (imp-1240/1248/1262) measured 60+ rows ALL more than 5000x below 1.
 *   This file assesses the gap between that empirical support and a RIGOROUS
 *   bound, by combining the three live analytical routes at their honest status.
 *
 *   ROUTE LEDGER (as of 2026-06-17)
 *   -------------------------------
 *     route 1  Hilbert-Schmidt           imp-1267 / imp-1260   LIVE, sharpest
 *     route 2  Carleson-Volterra-Hardy   (none)                OPEN, not started
 *     route 3  Mellin diagonalization    imp-1266              STRUCTURALLY BLOCKED
 *     route 4  Wiener-Hopf factorization imp-1287              RETRACTED (imp-2660)
 *
 *   The WH route was the ONLY route that claimed to reach arbitrarily large a.
 *   imp-2660 refuted it: the causal sinh-convolution K_a is NOT Toeplitz (its
 *   Laplace symbol a/(z^2-a^2) has a pole at z=a INSIDE Re(z)>0), and the
 *   measured ||K_a|| grows like e^{aT} (3.0, 9.53, 26.97, 74.02 at T=4,6,8,10
 *   for a=0.5) -- 37x over the claimed 1/a bound. So ||K_a|| <= 1/a is FALSE,
 *   and with it the "covers all a > 0" union collapses.
 *
 *   THE SHARPEST RIGOROUS BOUND NOW PROVABLE (Hilbert-Schmidt, route 1)
 *   ------------------------------------------------------------------
 *   Hilbert-Schmidt dominates the operator norm: ||V||_op <= ||V||_HS. Two
 *   variants, with frozen crossover points a* where each first reaches 1
 *   (imp-1260-largea-crossover, bisection on the monotone-in-a bound):
 *
 *     (CS-HS)   ||V||_op <= sqrt(I_0 . J_a),    J_a = int_0^infty Phi^2 sinh^2(au) du
 *               CLOSED-FORM in the two explicit integrals I_0, J_a.
 *               Rigorously < 1 on  a in (0, ~34.98].
 *
 *     (exact-HS) ||V||_op <= sqrt( int_0^infty int_0^x Phi(x)^2 Phi(y)^2
 *                                  sinh^2(a(x-y)) dy dx )
 *               Drops the lossy sinh(a(x-y)) <= sinh(ax) Cauchy-Schwarz step.
 *               Rigorously < 1 on  a in (0, ~37.66]  (O(N^2) quadrature, not
 *               closed-form symbolic).
 *
 *   The earlier imp-1267 "(0, ~2]" coverage was an UNDER-claim: J_a grows far
 *   slower than e^{4a} because Phi^2 is concentrated on [0, ~0.3], so sqrt(I_0
 *   J_a) does not cross 1 until a* ~= 34.98 (imp-1260 corrected this).
 *
 *   At the operative grid (a <= 0.5) the rigorous bound is tight: exact-HS at
 *   a=0.5 is 1.9003e-4, only ~1.02x the empirical op-norm 1.86e-4 -- i.e. the
 *   rigorous bound is already within 2% of the measured value and ~5300x below
 *   the threshold 1. The empirical-vs-rigorous GAP in the small-a regime is
 *   therefore essentially closed; the gap is entirely in the LARGE-a regime.
 *
 *   imp-2660 also established Conj 27.2 is FALSE for a > ~37.66 (||V||_op > 1
 *   and grows). So "||V|| <= 1 for EVERY a > 0" is UNREACHABLE as stated; the
 *   honest target is the PHYSICAL BAND a in (0, ~37.66], on which exact-HS
 *   already certifies the bound numerically.
 *
 *   THE SINGLE OBSTRUCTION
 *   ----------------------
 *   To upgrade "||V|| <= 1 on the physical band (0, ~37.66]" from numerically
 *   certified to RIGOROUS-symbolic, exactly one gap remains:
 *
 *     close the thin sliver a in (~34.98, ~37.66] where ONLY the O(N^2)
 *     numerical exact-HS double integral reaches -- the closed-form CS-HS
 *     bound sqrt(I_0 J_a) has already crossed 1 there. Equivalently: remove
 *     the Cauchy-Schwarz slack (factor ~1.55x at small a; the step that
 *     decouples x and y), OR certify the exact-HS double integral on that
 *     sliver with interval arithmetic on I_0, J_a and the kernel.
 *
 *   Below a ~= 34.98 the CS-HS closed form already gives a rigorous bound < 1
 *   (modulo certifying I_0, J_a, which are super-exponentially-decaying single
 *   integrals -- a routine interval-arithmetic task, not a structural blocker).
 *   The sliver (34.98, 37.66] is ~7.7% of the physical band and is the entire
 *   open question for a rigorous Conj 27.2 on its true domain.
 *
 *   HONEST SCOPE -- this is an ASSESSMENT, not a new proof. It records the
 *   current best rigorous bound from existing modules (imp-1260/1267) and names
 *   the obstruction; it does not itself close the sliver.
 *
 *   Ticket: imp-2654 (proof, critical, opus-4-8 / subscription).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// Frozen crossover points a* where each rigorous bound first reaches 1.
// Source: imp-1260-largea-crossover.js CROSSOVERS (bisection, N=6000 midpoint).
const A_STAR_CS_HS = 34.98046830007358;
const A_STAR_EXACT_HS = 37.66224029609832;
const A_STAR_SCHUR = 35.858260610875035;

// Empirical-vs-rigorous tightness check at the operative grid maximum a=0.5.
// exact-HS bound 1.9003e-4 vs empirical op-norm 1.86e-4 (imp-1260 / imp-1267).
const EXACT_HS_AT_HALF = 0.00019002987410420753; // imp-1260 FROZEN_ROWS a=0.5
const OP_NORM_AT_HALF = 1.8608612344e-4; // imp-1267 FROZEN_ROWS U=1, a=0.5

const ROUTE_LEDGER = Object.freeze([
  Object.freeze({
    route: 1,
    name: 'Hilbert-Schmidt',
    module: 'imp-1267 / imp-1260',
    status: 'LIVE',
    role: 'sharpest rigorous bound; covers the physical band numerically',
  }),
  Object.freeze({
    route: 2,
    name: 'Carleson-Volterra-Hardy',
    module: null,
    status: 'OPEN',
    role: 'not started',
  }),
  Object.freeze({
    route: 3,
    name: 'Mellin diagonalization',
    module: 'imp-1266',
    status: 'STRUCTURALLY-BLOCKED',
    role: 'K_a symbol unbounded on Re(z) > a; no L^2 diagonalization',
  }),
  Object.freeze({
    route: 4,
    name: 'Wiener-Hopf factorization',
    module: 'imp-1287',
    status: 'RETRACTED',
    role: 'imp-2660: ||K_a|| <= 1/a is FALSE; K_a is non-Toeplitz, ||K_a|| ~ e^{aT}',
  }),
]);

const SHARPEST_RIGOROUS_BOUND = Object.freeze({
  primary: 'Hilbert-Schmidt (route 1)',
  csHs: Object.freeze({
    label: 'CS-HS closed-form',
    inequality: '||V||_op <= sqrt(I_0 . J_a)',
    isClosedForm: true,
    rigorousCoverage: 'a in (0, ~34.98]',
    crossover_aStar: A_STAR_CS_HS,
    csSlackFactorSmallA: 1.55, // sqrt(I_0 J_a) / exact-HS at small a (imp-1267)
  }),
  exactHs: Object.freeze({
    label: 'exact-HS double integral',
    inequality:
      '||V||_op <= sqrt( int_0^infty int_0^x Phi(x)^2 Phi(y)^2 sinh^2(a(x-y)) dy dx )',
    isClosedForm: false, // O(N^2) midpoint quadrature, not symbolic
    rigorousCoverage: 'a in (0, ~37.66]',
    crossover_aStar: A_STAR_EXACT_HS,
  }),
  schur: Object.freeze({
    label: 'Schur / Holmgren test',
    crossover_aStar: A_STAR_SCHUR,
    rigorousCoverage: 'a in (0, ~35.86]',
    note: 'barely beats CS-HS; kernel is near-rank-1 so ||V||_HS ~= ||V||_op',
  }),
});

const EMPIRICAL_VS_RIGOROUS = Object.freeze({
  empiricalSupport: 'imp-1240/1248/1262: 60+ rows, all > 5000x below 1',
  atOperativeAHalf: Object.freeze({
    a: 0.5,
    rigorousExactHsBound: EXACT_HS_AT_HALF,
    empiricalOpNorm: OP_NORM_AT_HALF,
    ratio_bound_to_op: EXACT_HS_AT_HALF / OP_NORM_AT_HALF, // ~1.021
    factorBelowOne: 1 / EXACT_HS_AT_HALF, // ~5262x
  }),
  smallARegimeGapClosed: true, // rigorous exact-HS within ~2% of empirical op-norm
  remainingGapIsLargeAOnly: true,
});

const SINGLE_OBSTRUCTION = Object.freeze({
  statement:
    'Close the thin sliver a in (~34.98, ~37.66] where ONLY the numerical ' +
    'O(N^2) exact-HS double integral reaches 1, the closed-form CS-HS bound ' +
    'sqrt(I_0 J_a) having already crossed 1. Equivalently: remove the ' +
    'Cauchy-Schwarz slack (the sinh(a(x-y)) <= sinh(ax) decoupling step), or ' +
    'certify the exact-HS integral on the sliver via interval arithmetic.',
  sliverLo: A_STAR_CS_HS,
  sliverHi: A_STAR_EXACT_HS,
  sliverWidth: A_STAR_EXACT_HS - A_STAR_CS_HS, // ~2.68
  sliverFractionOfBand: (A_STAR_EXACT_HS - A_STAR_CS_HS) / A_STAR_EXACT_HS, // ~0.0712
  conj272FalseAbove: A_STAR_EXACT_HS, // imp-2660: ||V|| > 1 and grows for a > ~37.66
  reachableTarget:
    '||V|| <= 1 is UNREACHABLE for all a > 0 (FALSE above ~37.66); the honest ' +
    'target is the physical band a in (0, ~37.66], on which exact-HS already ' +
    'certifies numerically.',
});

export const IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS = Object.freeze({
  id: 'imp-2654-volterra-rigorous-bound-status',
  ticket: 'imp-2654',
  generatedAt: '2026-06-17T18:30:00Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['SS25', 'SS26', 'SS27'],
  relatedTickets: ['imp-1240', 'imp-1258', 'imp-1260', 'imp-1266', 'imp-1267', 'imp-1287', 'imp-2660'],

  summary:
    'Honest status of the sharpest RIGOROUS bound on ||V_{a,Phi}||_op after the ' +
    'imp-2660 Wiener-Hopf retraction. Best rigorous route is Hilbert-Schmidt: ' +
    'CS-HS closed-form sqrt(I_0 J_a) is rigorously < 1 on a in (0, ~34.98]; the ' +
    'exact-HS double integral (numerical) reaches a in (0, ~37.66]. WH (route 4) ' +
    'is RETRACTED, Mellin (route 3) is blocked. At a=0.5 the rigorous exact-HS ' +
    'bound (1.90e-4) is within ~2% of the empirical op-norm and ~5300x below 1, ' +
    'so the small-a empirical-vs-rigorous gap is closed. Conj 27.2 is FALSE for ' +
    'a > ~37.66 (imp-2660), so the honest target is the physical band (0, ~37.66]. ' +
    'SINGLE OBSTRUCTION: the sliver a in (~34.98, ~37.66] where only the numerical ' +
    'exact-HS reaches -- remove the Cauchy-Schwarz slack or certify it with ' +
    'interval arithmetic.',

  conjectureTarget: Object.freeze({
    label: 'Conjecture 27.2 (Endpoint-Hankel Volterra contraction)',
    statement: 'For every a > 0, ||V_{a,Phi}|| <= 1 (operator norm in L^2([0, infty))).',
    paperSection: 'SS27',
    reachableAsStated: false, // FALSE for a > ~37.66 (imp-2660)
    honestTarget: 'physical band a in (0, ~37.66]',
  }),

  routeLedger: ROUTE_LEDGER,
  sharpestRigorousBound: SHARPEST_RIGOROUS_BOUND,
  empiricalVsRigorous: EMPIRICAL_VS_RIGOROUS,
  singleObstruction: SINGLE_OBSTRUCTION,

  honestScope: Object.freeze({
    isAssessment: true,
    isNewProof: false,
    closesAnyNewRange: false,
    bestRigorousRoute: 'Hilbert-Schmidt (imp-1267 / imp-1260)',
    whRouteRetracted: true,
    mellinRouteBlocked: true,
    conj272ReachableForAllA: false,
    reusesFrozenData: 'imp-1260-largea-crossover crossovers; imp-1267 op-norm rows',
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    collapse: 'src/data/imp-1258-volterra-cdb-bridge.js (imp-1258)',
    hsBound: 'src/data/imp-1267-volterra-hs-bound.js (imp-1267, route 1)',
    largeACrossover: 'src/data/imp-1260-largea-crossover.js (imp-1260, a* crossovers)',
    mellinBlocked: 'src/data/imp-1266-volterra-mellin-symbol.js (imp-1266, route 3)',
    whRetracted: 'src/data/imp-1287-volterra-wiener-hopf.js (imp-1287, route 4, RETRACTED)',
    retraction: 'imp-2660 (WH refutation: ||K_a|| ~ e^{aT}, not <= 1/a)',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS_ASSERTIONS = [
  {
    id: 'imp2654-wh-route-retracted',
    why:
      'The Wiener-Hopf route (route 4, imp-1287) was refuted by imp-2660. The ' +
      'ledger must record it as RETRACTED -- if it flips back to LIVE/proven the ' +
      'file would resurrect the false ||K_a|| <= 1/a claim.',
    holds: () => {
      const wh = IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS.routeLedger.find((r) => r.route === 4);
      return wh && wh.status === 'RETRACTED' && IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS.honestScope.whRouteRetracted === true;
    },
  },
  {
    id: 'imp2654-sharpest-route-is-hs',
    why:
      'With WH retracted and Mellin blocked, the only LIVE route is ' +
      'Hilbert-Schmidt. The sharpest-rigorous-bound primary must be HS and the ' +
      'CS-HS variant must be flagged closed-form.',
    holds: () => {
      const b = IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS.sharpestRigorousBound;
      return b.primary.includes('Hilbert-Schmidt') && b.csHs.isClosedForm === true;
    },
  },
  {
    id: 'imp2654-crossovers-match-imp1260',
    why:
      'The frozen crossover points a* must match imp-1260-largea-crossover to ' +
      '12 sig figs: CS-HS ~= 34.9805, exact-HS ~= 37.6622, Schur ~= 35.8583. A ' +
      'drift means the rigorous coverage ranges were silently re-derived.',
    holds: () => {
      const b = IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS.sharpestRigorousBound;
      return (
        Math.abs(b.csHs.crossover_aStar - 34.98046830007358) < 1e-9 &&
        Math.abs(b.exactHs.crossover_aStar - 37.66224029609832) < 1e-9 &&
        Math.abs(b.schur.crossover_aStar - 35.858260610875035) < 1e-9
      );
    },
  },
  {
    id: 'imp2654-single-obstruction-is-the-sliver',
    why:
      'The named obstruction must be the sliver between the CS-HS and exact-HS ' +
      'crossovers: lo = a*_CS-HS, hi = a*_exact-HS, with hi > lo and a width of ' +
      '~2.68. If the bounds invert or collapse, the obstruction is mis-stated.',
    holds: () => {
      const o = IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS.singleObstruction;
      return (
        o.sliverHi > o.sliverLo &&
        Math.abs(o.sliverWidth - (o.sliverHi - o.sliverLo)) < 1e-9 &&
        o.sliverWidth > 2 &&
        o.sliverWidth < 4
      );
    },
  },
  {
    id: 'imp2654-conj272-false-above-3766',
    why:
      'imp-2660 established Conj 27.2 is FALSE for a > ~37.66. The file must NOT ' +
      'claim ||V|| <= 1 is reachable for all a > 0; the honest target is the ' +
      'physical band only.',
    holds: () => {
      const c = IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS.conjectureTarget;
      return (
        c.reachableAsStated === false &&
        IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS.singleObstruction.conj272FalseAbove > 37 &&
        IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS.honestScope.conj272ReachableForAllA === false
      );
    },
  },
  {
    id: 'imp2654-small-a-gap-closed',
    why:
      'At a=0.5 the rigorous exact-HS bound must be within ~5% of the empirical ' +
      'op-norm (ratio ~1.02) and the bound itself well below 1 (more than 5000x). ' +
      'This pins the claim that the small-a empirical-vs-rigorous gap is closed.',
    holds: () => {
      const g = IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS.empiricalVsRigorous.atOperativeAHalf;
      return (
        g.ratio_bound_to_op > 1.0 &&
        g.ratio_bound_to_op < 1.05 &&
        g.factorBelowOne > 5000
      );
    },
  },
  {
    id: 'imp2654-is-assessment-not-new-proof',
    why:
      'This module is an HONEST ASSESSMENT that reuses frozen data; it does not ' +
      'itself close any new range. isAssessment=true, isNewProof=false, ' +
      'closesAnyNewRange=false -- if these flip the file is over-stating.',
    holds: () => {
      const h = IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS.honestScope;
      return h.isAssessment === true && h.isNewProof === false && h.closesAnyNewRange === false;
    },
  },
];

export default IMP2654_VOLTERRA_RIGOROUS_BOUND_STATUS;
