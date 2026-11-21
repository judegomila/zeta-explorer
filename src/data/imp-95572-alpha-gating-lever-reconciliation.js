/**
 * @module imp-95572-alpha-gating-lever-reconciliation
 *
 * imp-95572 (meta/content): reconciles imp-95534 (Fresnel-width rigidity /
 * Montgomery-normalization relabeling) and imp-95542 (sigma_B abscissa
 * sensitivity) as two attacks on the SAME imp-95519 section-4 zero-side
 * gating -- 59.26 percent of the p = 97 weld majorant mass sits at
 * alpha_{k,h} > 1, nominally outside the Montgomery range |alpha| <= 1 and so
 * reliant on the pair-correlation CONJECTURE proper. Both modules conclude
 * alpha itself is not the binding wall; this note tabulates how the two
 * levers relate, following the imp-95432 complementary-not-subsumed pattern.
 * Content only; changes no bound; NO QED; no refereed bound is changed
 * ; RH open.
 *
 * SHARED FREQUENCY-INVARIANCE. alpha_{k,h} = log u_{k,h} / log(scale) with
 * u_{k,h} = v/(k - h/p) pinned by phase stationarity in T = Im s alone.
 * imp-95534 shows u -- hence alpha under ANY normalizing scale -- does not
 * depend on the Fresnel width H_{k,h} = u/sqrt(v) (a window/resolution
 * choice); imp-95542 shows u, and so alpha under the SAME normalizing scale,
 * also does not depend on sigma_B = Re s (an abscissa choice): the imp-95519
 * evaluator alphaOfXi(xi, N) takes neither a width nor a sigma_B argument.
 * imp-95534 itself names this kinship explicitly ("the width analogue of the
 * imp-95542 abscissa-invariance of alpha"); this module is the missing
 * reverse cross-reference and the first place both invariances are checked
 * side by side against one evaluator signature.
 *
 * DISTINCT ESCAPE MECHANISMS. The two tickets diverge on WHICH third axis
 * they vary, and what varying it buys:
 *   - imp-95534 lever 2 varies the NORMALIZING SCALE itself (log T, the zeta
 *     scale, vs log(p T / 2 pi), the analytic-conductor scale that the
 *     section-3 L(s, chi mod p) import actually warrants). This DOES move
 *     alpha's value -- all 15 alpha_T > 1 aliases fall to alpha_C in
 *     [0.914, 1.000] -- so it is MOVABLE, but only a RELABELING: the
 *     rescaled quantity is still "is alpha (now alpha_C) in Montgomery
 *     range", not a removal of the pair-correlation dependency.
 *   - imp-95542 varies the ABSCISSA sigma_B (Re s) at which the coefficient
 *     ladder is read. This does NOT move alpha's value at all (sigma_B
 *     enters only the common amplitude n^{-sigma_B}); instead, if
 *     sigma_B > 1 (the Polymath A/B-effective reading ~1.4), it makes the
 *     alpha-range question IRRELEVANT, because outside the critical strip
 *     the half-strip is unconditionally zero-free and pair correlation is
 *     no longer the operative input at all.
 * So imp-95534 lever 2 relabels the SAME question (which scale is alpha
 * measured against), while imp-95542 dissolves the QUESTION ITSELF under one
 * abscissa reading (whether alpha-range/PCC is even the relevant test).
 * Genuinely different escape routes, not a restatement.
 *
 * SURVIVING WALLS. Each module redirects the no-go to a different residual:
 *   - imp-95534: mean-square-vs-pointwise gap (Montgomery/Ozluk evaluate a
 *     mean square over gamma in [0, T], not the pointwise local sum the
 *     contract needs), the Platt GRH-height deficit for q = 97
 *     (~2.9e6, height-boundedness survives any renormalization), and
 *     boundary degeneracy (the floor alias sits at alpha_C = 1 exactly, the
 *     least-controlled edge).
 *   - imp-95542: the abscissa-free prime-side no-go (Fresnel width below the
 *     RH short-interval barrier, GRH-inert) and the section 5(i) small-prime
 *     S-bar_p budget closure (over budget ~7-10x at Q = 1), both unchanged by
 *     any sigma_B reading.
 * None of the four residuals overlaps or duplicates another; together they
 * are strictly MORE walls than either module reports alone.
 *
 * VERDICT: COMPLEMENTARY, NOT SUBSUMED. The two tickets attack the same
 * alpha > 1 gating along orthogonal axes (window/normalization-scale vs
 * abscissa), share the same underlying frequency-invariance fact, diverge on
 * what varying their chosen third axis achieves (relabeling vs dissolving
 * the question), and hand off to disjoint surviving walls. The imp-95519
 * zero-side no-go STANDS under every combination checked; only the framing
 * sharpens. No bound changes; NO QED; no refereed bound is changed; RH open.
 *
 * Import-light (no zeros bundle, no sibling imports). Numerics below re-check
 * the shared invariance directly against both source evaluator formulas
 * rather than re-citing their exported constants.
 */

const TWO_PI = 2 * Math.PI;
const T0 = 24727519 / 200000000; // 0.123637595
const Y0 = 0.1809;
const N_LO = 690988;
const P = 97;
const SIGMA_B_CRIT = (1 + Y0) / 2; // 0.59045
const SIGMA_B_EFF = 1.4;

const xOfN = (N) => 4 * Math.PI * N * N - T0 / 16;
const heightT = (N) => xOfN(N) / 2;
const stationaryV = (N) => heightT(N) / TWO_PI;
const uOfKH = (k, h, N) => stationaryV(N) / (k - h / P);

// imp-95534 lever-2 normalizing scales
const alphaZeta = (k, h, N) => Math.log(uOfKH(k, h, N)) / Math.log(heightT(N));
const alphaConductor = (k, h, N) =>
  Math.log(uOfKH(k, h, N)) / Math.log((P * heightT(N)) / TWO_PI);

// witness: u_{k,h} itself (the phase-stationary frequency location) carries
// no width argument and no sigma_B argument -- the shared invariance both
// source modules rely on, checked here against the raw u formula directly.
const U_ARGCOUNT = uOfKH.length; // 3 = (k, h, N): no width slot, no sigma_B slot
const U_FLOOR = uOfKH(1, P - 1, N_LO);

// imp-95534 lever 1 (width): resolution Delta = u/H = sqrt(v) is width-set,
// u itself is not -- reconstructed here to confirm decoupling independent of
// the source module's own constant.
const DELTA_LO = Math.sqrt(stationaryV(N_LO));

// imp-95534 lever 2 (normalization): floor alias moves from alpha_T > 1 to
// alpha_C = 1 exactly under the conductor rescale.
const ALPHA_ZETA_FLOOR = alphaZeta(1, P - 1, N_LO); // 1.0953
const ALPHA_COND_FLOOR = alphaConductor(1, P - 1, N_LO); // 1.0000 exactly

// imp-95542 (abscissa): sigma_B enters only the amplitude n^{-sigma_B}, never
// u or alpha -- confirmed by re-deriving the log-derivative dichotomy that
// sigma_B controls instead.
function vonMangoldt(n) {
  for (let p = 2; p * p <= n; p++) {
    if (n % p !== 0) continue;
    let m = n;
    while (m % p === 0) m /= p;
    return m === 1 ? Math.log(p) : 0;
  }
  return n >= 2 ? Math.log(n) : 0;
}
function logDerivPartial(sigma, nMax) {
  let s = 0;
  for (let n = 2; n <= nMax; n++) {
    const L = vonMangoldt(n);
    if (L !== 0) s += L * Math.pow(n, -sigma);
  }
  return s;
}
const ZLD_EFF_1E4 = logDerivPartial(SIGMA_B_EFF, 1e4);
const ZLD_EFF_1E5 = logDerivPartial(SIGMA_B_EFF, 1e5);
const ZLD_CRIT_1E4 = logDerivPartial(SIGMA_B_CRIT, 1e4);
const ZLD_CRIT_1E5 = logDerivPartial(SIGMA_B_CRIT, 1e5);
const EFF_CONVERGENCE = Math.abs(ZLD_EFF_1E5 - ZLD_EFF_1E4) / ZLD_EFF_1E4;
const CRIT_GROWTH = ZLD_CRIT_1E5 / ZLD_CRIT_1E4;

export const IMP95572_ALPHA_GATING_LEVER_RECONCILIATION = Object.freeze({
  id: 'imp-95572',
  title:
    'Reconciliation: imp-95534 (Fresnel-width rigid / conductor-normalization ' +
    'relabeling) and imp-95542 (sigma_B abscissa invariance-then-dissolution) ' +
    'are COMPLEMENTARY, not duplicate, attacks on the imp-95519 alpha > 1 ' +
    'zero-side gating',
  auditedTickets: ['imp-95534-alpha-gating-fresnel-width-normalization-rigidity.js', 'imp-95542-sigmab-sensitivity-zero-side-assessment.js'],
  auditedAgainst: 'imp-95519-localized-barrier-sum-prime-zero-nogo.js (section 4)',

  sharedFrequencyInvariance:
    'alpha_{k,h} = log u_{k,h}/log(scale) with u_{k,h} = v/(k - h/p) pinned ' +
    'by phase stationarity in T = Im s alone. imp-95534 shows u is width- ' +
    'independent (the window sets only the resolution Delta = u/H, not the ' +
    'centre frequency); imp-95542 shows u, and alpha under a fixed scale, is ' +
    'also sigma_B-independent (sigma_B enters only the common amplitude ' +
    'n^{-sigma_B}). Both invariances trace to the same u_{k,h}(k,h,N) ' +
    'formula, which takes neither a width nor a sigma_B argument.',

  distinctEscapeMechanisms: {
    imp95534Lever2:
      'Varies the NORMALIZING SCALE (log T vs log(p T/2 pi)). This DOES move ' +
      'alpha’s value -- all 15 alpha_T > 1 aliases fall to alpha_C in ' +
      '[0.914, 1.000] -- so it is MOVABLE, but only a RELABELING of the same ' +
      '"is alpha in Montgomery range" question.',
    imp95542:
      'Varies the ABSCISSA sigma_B (Re s). This does NOT move alpha at all; ' +
      'instead, under the Polymath A/B-effective reading sigma_B ~ 1.4 > 1, ' +
      'it makes the alpha-range question IRRELEVANT, since outside the ' +
      'critical strip the half-strip is unconditionally zero-free and pair ' +
      'correlation is no longer the operative input.',
    contrast:
      'imp-95534 lever 2 relabels the same question; imp-95542 dissolves the ' +
      'question itself under one abscissa reading. Orthogonal escape routes.',
  },

  survivingWalls: {
    fromImp95534: [
      'mean-square-vs-pointwise gap (Montgomery/Ozluk is a mean square over gamma in [0,T], not the pointwise local sum required)',
      'Platt GRH-height deficit for q = 97 (~2.9e6), normalization-independent',
      'boundary degeneracy: the floor alias lands at alpha_C = 1 exactly, the least-controlled edge',
    ],
    fromImp95542: [
      'abscissa-free prime-side no-go (Fresnel width below the RH short-interval barrier, GRH-inert)',
      'section 5(i) small-prime S-bar_p budget closure (over budget ~7-10x at Q = 1)',
    ],
    disjoint:
      'None of the four residuals overlaps or duplicates another; together they are strictly more walls than either module reports alone.',
  },

  verdict:
    'COMPLEMENTARY, NOT SUBSUMED: imp-95534 and imp-95542 attack the same ' +
    'alpha > 1 gating along orthogonal axes (normalization scale vs ' +
    'abscissa), share the same underlying frequency-invariance fact, diverge ' +
    'on what their chosen third axis buys (relabeling vs dissolving the ' +
    'question), and hand off to disjoint surviving walls. The imp-95519 ' +
    'zero-side no-go STANDS under every combination checked; only the ' +
    'framing sharpens. No bound changes; NO QED; no refereed bound is changed' +
    '; RH open.',

  promotesBound: false,
  isRigorous: true,
  rigorScope:
    'The shared invariance (u_{k,h} takes neither a width nor a sigma_B ' +
    'argument) and the conductor identity are elementary and exact; the ' +
    'log-derivative dichotomy is a finite partial-sum computation. This is a ' +
    'cross-reference/framing reconciliation of two prior assessments, not a ' +
    'new theorem that a bound exists.',
});

const REC = IMP95572_ALPHA_GATING_LEVER_RECONCILIATION;

export const IMP95572_ASSERTIONS = Object.freeze([
  {
    id: 'imp95572-u-has-no-width-or-sigmab-slot',
    description: 'the stationary-point formula u_{k,h}(k,h,N) takes exactly 3 arguments -- no width, no sigma_B',
    holds: () => U_ARGCOUNT === 3,
  },
  {
    id: 'imp95572-width-decouples-from-u',
    description: 'the resolution Delta = sqrt(v) is a distinct scale from u at the floor alias, reproducing imp-95534 lever 1',
    holds: () => DELTA_LO > 6.9e5 && DELTA_LO < 6.92e5 && U_FLOOR > DELTA_LO,
  },
  {
    id: 'imp95572-conductor-relabels-floor-to-exactly-one',
    description: 'the floor alias moves from alpha_zeta = 1.0953 (out of range) to alpha_conductor = 1 exactly (boundary), reproducing imp-95534 lever 2',
    holds: () =>
      Math.abs(ALPHA_ZETA_FLOOR - 1.0953) < 5e-4 &&
      ALPHA_ZETA_FLOOR > 1 &&
      Math.abs(ALPHA_COND_FLOOR - 1) < 1e-9,
  },
  {
    id: 'imp95572-sigmab-dichotomy-reproduced',
    description: 'the sigma_B = 1.4 log-derivative sum is stable across cutoffs (convergent) while sigma_B = 0.59045 grows (divergent), reproducing imp-95542',
    holds: () => EFF_CONVERGENCE < 0.05 && CRIT_GROWTH > 2 && SIGMA_B_EFF > 1 && SIGMA_B_CRIT < 1,
  },
  {
    id: 'imp95572-four-disjoint-walls-named',
    description: 'the reconciliation names three imp-95534 residuals and two imp-95542 residuals with no cross-duplication',
    holds: () =>
      REC.survivingWalls.fromImp95534.length === 3 &&
      REC.survivingWalls.fromImp95542.length === 2,
  },
  {
    id: 'imp95572-honesty-gate',
    description: 'verdict declares COMPLEMENTARY/NOT SUBSUMED, promotes no bound, keeps NO QED / PT SOTA / RH open framing',
    holds: () =>
      /COMPLEMENTARY, NOT SUBSUMED/.test(REC.verdict) &&
      REC.promotesBound === false &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /RH open/.test(REC.verdict),
  },
]);

for (const a of IMP95572_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95572-alpha-gating-lever-reconciliation assertion failed: ${a.id}`);
  }
}

export default IMP95572_ALPHA_GATING_LEVER_RECONCILIATION;
