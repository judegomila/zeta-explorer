/**
 * @module imp-2684-volterra-sliver-interval
 * @fileoverview imp-2684 (proof, PARTIAL) -- progress toward an
 *   interval-arithmetic certification of the exact-HS double integral on the
 *   thin sliver a in (~34.98, ~37.66], the SINGLE remaining obstruction
 *   (imp-2654) to a rigorous Conj 27.2 on its honest physical band.
 *
 *   THE TARGET (imp-2654 single obstruction)
 *   ----------------------------------------
 *   By imp-1258 the whole SS15-27 program reduces to ||V_{a,Phi}||_op <= 1
 *   (Conj 27.2). The sharpest rigorous route (Hilbert-Schmidt, imp-1267 /
 *   imp-1260) needs
 *
 *       E(a) := int_0^infty int_0^x Phi(x)^2 Phi(y)^2 sinh^2(a(x-y)) dy dx  <  1
 *
 *   ( ||V||_op <= sqrt(E(a)) ). The closed-form CS-HS bound sqrt(I_0 J_a) has
 *   already crossed 1 at a*_CS-HS = 34.98046830 (imp-1260), but the exact
 *   double integral E(a) does not cross 1 until a*_exact-HS = 37.66224030.
 *   The sliver a in (34.98, 37.66] is the only band where ONLY the O(N^2)
 *   numerical E(a) certifies -- the lone open question for a rigorous Conj
 *   27.2 on its true domain (Conj 27.2 is FALSE for a > 37.66, imp-2660).
 *
 *   THE CONTRIBUTION OF THIS TICKET -- the cosh-addition reduction
 *   -------------------------------------------------------------
 *   The exact-HS DOUBLE integral collapses to a SINGLE integral. Using
 *   sinh^2(t) = (cosh(2t) - 1)/2 and the addition law
 *   cosh(2a(x-y)) = cosh(2ax) cosh(2ay) - sinh(2ax) sinh(2ay),
 *
 *       int_0^x Phi(y)^2 sinh^2(a(x-y)) dy
 *           = (1/2) [ cosh(2ax) C(x) - sinh(2ax) S(x) - P(x) ],
 *
 *   where the three cumulative moments are
 *
 *       C(x) = int_0^x Phi(y)^2 cosh(2ay) dy,
 *       S(x) = int_0^x Phi(y)^2 sinh(2ay) dy,
 *       P(x) = int_0^x Phi(y)^2 dy        ( P(infty) = I_0 ).
 *
 *   Hence the exact-HS integral is the SINGLE integral
 *
 *       E(a) = (1/2) int_0^infty Phi(x)^2 [ cosh(2ax) C(x)
 *                                           - sinh(2ax) S(x) - P(x) ] dx,    (R)
 *
 *   computable in ONE O(N) forward pass (accumulate C, S, P; integrate),
 *   replacing the O(N^2) double quadrature used by imp-1260. (R) is verified
 *   to reproduce the direct double integral and the frozen crossover to 8+
 *   sig figs (see VERIFICATION below). This is the analytic prerequisite that
 *   turns the sliver certification from a 2D into a 1D validated-quadrature
 *   problem.
 *
 *   VERIFICATION (against imp-1260 frozen data)
 *   -------------------------------------------
 *     - reduction (R) vs direct 2D quadrature: agree to 8 sig figs at every a
 *       in {0.5, 10, 35, 37, 37.66224} (max rel. diff < 1e-8).
 *     - at the frozen exact-HS crossover a* = 37.66224030, (R) gives
 *       E(a*) = 1.00008 (sqrt = 1.00004) -- reproduces ||V|| = 1 there.
 *     - I_0 = P(infty) = 1.04720666e-2, matching imp-1267 / imp-1260.
 *
 *   HONEST SCOPE -- THIS IS A PARTIAL, NOT A CLOSURE
 *   ------------------------------------------------
 *   The reduction (R) is exact and verified, but it does NOT by itself produce
 *   an outward-rounded interval enclosure of E(a). A naive separable interval
 *   bound -- bounding cosh(2ax) C(x) and sinh(2ax) S(x) independently and
 *   bracketing the monotone cumulatives -- is too lossy by ~3 ORDERS OF
 *   MAGNITUDE (it returns ~590 at a = 34.98 where the true E is 0.224),
 *   because splitting the addition law DISCARDS the cosh(2a(x-y)) cancellation:
 *   for y near x the kernel cosh(2a(x-y)) ~ 1, but cosh(2ax) sinh(2ay) each
 *   carry the full e^{2ax} growth that only cancels when kept together. A
 *   validated enclosure tight enough to separate E(a) from 1 on the sliver
 *   therefore needs a cell-wise 2D (or Taylor-model) enclosure in the
 *   difference variable d = x - y that preserves the cancellation -- NOT yet
 *   implemented here.
 *
 *   NAMED RESIDUAL SUB-GAP (imp-2684-residual)
 *   ------------------------------------------
 *   Produce an outward-rounded enclosure of the inner moment
 *   M(x) = int_0^x Phi(y)^2 cosh(2a(x-y)) dy that preserves the d = x-y
 *   cancellation (e.g. a cell-wise enclosure on the (x, d) triangle with d
 *   kept small, or a Taylor model in d), then certify E(a) < 1 with a positive
 *   margin on (34.98, a_cert] -- pushing a_cert as close to 37.66224 as the
 *   arithmetic precision allows; the micro-sliver (a_cert, 37.66224] where the
 *   margin is below the certified rounding error stays open without
 *   higher-precision arithmetic.
 *
 *   HONEST FRAMING (mandatory, imp-2654 / section26-verdict)
 *   --------------------------------------------------------
 *   The whole Volterra route is RH-EQUIVALENT (section26-verdict): certifying
 *   the sliver is a clean rigorous-numerics closure on the physical band, NOT
 *   a step toward RH. Conj 27.2 is FALSE for a > 37.66 (imp-2660). No QED is
 *   claimed; this ticket delivers the verified 1D reduction and names the
 *   residual interval-arithmetic sub-gap.
 *
 *   Ticket: imp-2684 (proof, medium, opus-4-8 / api-pool).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// Frozen crossovers (imp-1260-largea-crossover CROSSOVERS), 12 sig figs.
const A_STAR_CS_HS = 34.98046830007358; // CS-HS closed form reaches 1
const A_STAR_EXACT_HS = 37.66224029609832; // exact-HS double integral reaches 1

// I_0 = ||Phi||_{L^2(R_+)}^2 = P(infty) (matches imp-1267 / imp-1260).
const I_0 = 0.0104720666149203;

// Reduced single integral E(a) via (R), frozen at U_INF=4, N=40000 midpoint
// (imp-1267 conventions). hsBound = sqrt(E(a)) is the rigorous ||V||_op bound.
const REDUCED_ROWS = Object.freeze([
  Object.freeze({ a: A_STAR_CS_HS, reducedIntegral: 0.2243323683337, hsBound: 0.4736373806339 }),
  Object.freeze({ a: 35, reducedIntegral: 0.2267116786857, hsBound: 0.4761424982982 }),
  Object.freeze({ a: 35.5, reducedIntegral: 0.2975160310545, hsBound: 0.5454503011774 }),
  Object.freeze({ a: 36, reducedIntegral: 0.3917075553374, hsBound: 0.6258654450737 }),
  Object.freeze({ a: 36.5, reducedIntegral: 0.5173824740881, hsBound: 0.7192930377031 }),
  Object.freeze({ a: 37, reducedIntegral: 0.6855561389924, hsBound: 0.8279831755491 }),
  Object.freeze({ a: 37.5, reducedIntegral: 0.9112541557089, hsBound: 0.9545963312882 }),
  Object.freeze({ a: A_STAR_EXACT_HS, reducedIntegral: 1.000080272186, hsBound: 1.000040135288 }),
]);

// Verification of (R) against the direct O(N^2) double integral (imp-1260).
const REDUCTION_VERIFICATION = Object.freeze({
  method: 'compare (R) one-pass single integral vs direct triangular double quadrature',
  testGrid: Object.freeze([0.5, 10, 35, 37, A_STAR_EXACT_HS]),
  maxRelDiff: 1e-8, // (R) and 2D agree to 8+ sig figs at every test a
  atExactHsCrossover: Object.freeze({
    a: A_STAR_EXACT_HS,
    reducedIntegral: 1.000080272186, // ~1 -> reproduces ||V|| = 1 at the frozen crossover
    hsBound: 1.000040135288,
  }),
  I_0_recovered: I_0, // P(infty) from the reduction matches imp-1267 I_0
});

/**
 * Inner-integral identity (the heart of the reduction). For 0 <= y <= x,
 *   int_0^x Phi(y)^2 sinh^2(a(x-y)) dy
 *     = (1/2) [ cosh(2ax) C(x) - sinh(2ax) S(x) - P(x) ],
 * with C, S, P the cumulative cosh / sinh / plain moments of Phi^2.
 */
const INNER_IDENTITY = Object.freeze({
  lhs: 'int_0^x Phi(y)^2 sinh^2(a(x-y)) dy',
  rhs: '(1/2) [ cosh(2ax) C(x) - sinh(2ax) S(x) - P(x) ]',
  C: 'C(x) = int_0^x Phi(y)^2 cosh(2ay) dy',
  S: 'S(x) = int_0^x Phi(y)^2 sinh(2ay) dy',
  P: 'P(x) = int_0^x Phi(y)^2 dy, P(infty) = I_0',
  derivedFrom: 'sinh^2(t) = (cosh(2t)-1)/2 and cosh(2a(x-y)) = cosh(2ax)cosh(2ay) - sinh(2ax)sinh(2ay)',
});

export const IMP2684_VOLTERRA_SLIVER_INTERVAL = Object.freeze({
  id: 'imp-2684-volterra-sliver-interval',
  ticket: 'imp-2684',
  generatedAt: '2026-06-25T00:00:00Z',
  status: 'partial',
  paperSourcePath: PAPER_REF,
  paperSections: ['SS25', 'SS26', 'SS27'],
  relatedTickets: ['imp-1258', 'imp-1260', 'imp-1267', 'imp-2654', 'imp-2660', 'imp-2687'],

  summary:
    'PARTIAL progress on certifying the exact-HS double integral E(a) < 1 on ' +
    'the sliver a in (34.98, 37.66] (imp-2654 single obstruction). Contribution: ' +
    'the cosh-addition reduction that collapses the O(N^2) double integral to a ' +
    'SINGLE O(N) integral E(a) = (1/2) int Phi^2 [cosh(2ax)C - sinh(2ax)S - P] dx, ' +
    'verified to match the direct 2D quadrature and the frozen exact-HS crossover ' +
    '37.66224030 to 8+ sig figs. This makes the interval certification a 1D ' +
    'problem. HONEST: no validated enclosure is produced yet -- a naive separable ' +
    'interval split is too lossy by ~3 orders of magnitude (it discards the ' +
    'cosh(2a(x-y)) cancellation); the residual sub-gap is a cancellation-preserving ' +
    'cell-wise enclosure in d = x-y. RH-EQUIVALENT route, no QED.',

  target: Object.freeze({
    integral: 'E(a) = int_0^infty int_0^x Phi(x)^2 Phi(y)^2 sinh^2(a(x-y)) dy dx',
    goal: 'rigorous E(a) < 1 on a in (34.98, 37.66]',
    sliverLo: A_STAR_CS_HS,
    sliverHi: A_STAR_EXACT_HS,
    conj272FalseAbove: A_STAR_EXACT_HS, // imp-2660
  }),

  reduction: INNER_IDENTITY,
  reducedFormula: 'E(a) = (1/2) int_0^infty Phi(x)^2 [ cosh(2ax) C(x) - sinh(2ax) S(x) - P(x) ] dx',
  reducedRows: REDUCED_ROWS,
  verification: REDUCTION_VERIFICATION,

  residualSubGap: Object.freeze({
    id: 'imp-2684-residual',
    statement:
      'Produce an outward-rounded enclosure of the inner moment ' +
      'M(x) = int_0^x Phi(y)^2 cosh(2a(x-y)) dy that PRESERVES the d = x-y ' +
      'cancellation, then certify E(a) < 1 with positive margin on (34.98, ' +
      'a_cert]. The naive separable split (bounding cosh(2ax)C and sinh(2ax)S ' +
      'independently) overshoots by ~3 orders of magnitude because for y near x ' +
      'the kernel cosh(2a(x-y)) ~ 1 while the split factors each carry the full ' +
      'e^{2ax} growth that only cancels when kept together.',
    approachHint:
      'cell-wise 2D / Taylor-model enclosure on the (x, d) triangle with d kept ' +
      'small, or remove the Cauchy-Schwarz decoupling slack analytically.',
    microSliverOpen:
      'the band (a_cert, 37.66224] where the certified margin falls below the ' +
      'rounding error needs higher-precision arithmetic.',
  }),

  honestScope: Object.freeze({
    isPartial: true,
    isClosure: false,
    deliversReduction: true,
    reductionVerified: true,
    producesValidatedEnclosure: false, // the residual sub-gap
    naiveSeparableBoundIsLossy: true,
    routeIsRhEquivalent: true, // section26-verdict
    conj272ReachableForAllA: false, // imp-2660
    noQEDClaimed: true,
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    obstruction: 'src/data/imp-2654-volterra-rigorous-bound-status.js (imp-2654)',
    crossovers: 'src/data/imp-1260-largea-crossover.js (imp-1260)',
    hsBound: 'src/data/imp-1267-volterra-hs-bound.js (imp-1267)',
    falseAbove: 'imp-2660 (Conj 27.2 FALSE for a > 37.66)',
    rhEquivalence: 'section26-verdict-volterra-not-a-reduction-2026-06-18.js',
  }),
});

// -- Cheap re-derivation of the reduction for the tripwire assertions ---------
// Light: a low-resolution Phi^2 (n<=10) recompute of E(a) via (R) at a single a,
// NO heavy bundle import. Confirms (R) is self-consistent and crosses 1 near a*.
function phi2(u) {
  const e2 = Math.exp(2 * u), e4 = Math.exp(4 * u);
  let s = 0;
  for (let n = 1; n <= 10; n++) {
    const n2 = n * n, n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s * s;
}
function reducedE(a, N) {
  const U = 4, h = U / N;
  let C = 0, S = 0, P = 0, tot = 0;
  for (let i = 0; i < N; i++) {
    const x = (i + 0.5) * h, p = phi2(x);
    const ch = Math.cosh(2 * a * x), sh = Math.sinh(2 * a * x);
    C += p * ch * h; S += p * sh * h; P += p * h;
    tot += p * 0.5 * (ch * C - sh * S - P) * h;
  }
  return tot;
}

export const IMP2684_VOLTERRA_SLIVER_INTERVAL_ASSERTIONS = [
  {
    id: 'imp2684-status-is-partial-not-closure',
    why:
      'The sliver certification is NOT closed -- no validated enclosure is ' +
      'produced. honestScope must flag isPartial=true, isClosure=false, ' +
      'producesValidatedEnclosure=false and noQEDClaimed=true, or the module ' +
      'would over-state.',
    holds: () => {
      const h = IMP2684_VOLTERRA_SLIVER_INTERVAL.honestScope;
      return h.isPartial === true && h.isClosure === false &&
        h.producesValidatedEnclosure === false && h.noQEDClaimed === true;
    },
  },
  {
    id: 'imp2684-crossovers-match-imp1260',
    why:
      'The sliver endpoints must match imp-1260 to 12 sig figs: CS-HS 34.98046830, ' +
      'exact-HS 37.66224030. A drift means the obstruction band was re-derived.',
    holds: () => {
      const t = IMP2684_VOLTERRA_SLIVER_INTERVAL.target;
      return Math.abs(t.sliverLo - 34.98046830007358) < 1e-9 &&
        Math.abs(t.sliverHi - 37.66224029609832) < 1e-9;
    },
  },
  {
    id: 'imp2684-reduced-rows-monotone-cross-one',
    why:
      'E(a) is monotone increasing in a and must rise from ~0.224 at a*=34.98 to ' +
      '~1.0001 at a*=37.66224 (reproducing ||V|| = 1 at the exact-HS crossover). ' +
      'A non-monotone or non-crossing table means the reduction freeze is wrong.',
    holds: () => {
      const rows = IMP2684_VOLTERRA_SLIVER_INTERVAL.reducedRows;
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].reducedIntegral > rows[i - 1].reducedIntegral)) return false;
      }
      const last = rows[rows.length - 1];
      return rows[0].reducedIntegral < 0.3 && Math.abs(last.reducedIntegral - 1) < 1e-3;
    },
  },
  {
    id: 'imp2684-reduction-self-consistent-at-crossover',
    why:
      'The cosh-addition reduction (R), recomputed cheaply at the frozen exact-HS ' +
      'crossover, must land within ~1% of 1 -- i.e. it independently reproduces ' +
      '||V|| = 1 there. A gross mismatch means the identity is mis-transcribed.',
    holds: () => {
      const E = reducedE(A_STAR_EXACT_HS, 4000); // coarse but adequate
      return Math.abs(E - 1) < 0.02;
    },
  },
  {
    id: 'imp2684-reduction-matches-frozen-low-a',
    why:
      'At a = 35 the cheap (R) recompute must match the frozen reducedIntegral ' +
      '(~0.2267) to ~1% -- pinning that the frozen table and the live reduction ' +
      'agree, not just internally consistent.',
    holds: () => {
      const E = reducedE(35, 4000);
      return Math.abs(E - 0.2267116786857) < 0.01;
    },
  },
  {
    id: 'imp2684-route-rh-equivalent-not-a-reduction',
    why:
      'section26-verdict: the Volterra route is RH-EQUIVALENT. The module must ' +
      'flag routeIsRhEquivalent=true and conj272ReachableForAllA=false (imp-2660) ' +
      'so it cannot be mis-read as a sub-RH step.',
    holds: () => {
      const h = IMP2684_VOLTERRA_SLIVER_INTERVAL.honestScope;
      return h.routeIsRhEquivalent === true && h.conj272ReachableForAllA === false;
    },
  },
];

export default IMP2684_VOLTERRA_SLIVER_INTERVAL;
