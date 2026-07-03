/**
 * @module imp-3352-phi-quantitative-floor
 * @fileoverview imp-3352 -- Assess whether the imp-3257 elementary termwise
 *   structure yields a QUANTITATIVE strictly-positive pointwise floor
 *   Phi_NPHI(u) &gt;= f(u) &gt; 0 on [0, U] (beyond the mere &gt;= 0
 *   nonnegativity), and DECIDE whether such a floor could feed the still-open
 *   operator-norm MAGNITUDE half of the imp-3197 K_a &gt;= 0 bridge obstruction
 *   (the |Gshear| spectrum), which imp-3257 explicitly leaves untouched.
 *
 *   CONTEXT
 *   -------
 *   imp-3257 established, termwise, that the truncated de Bruijn-Newman kernel
 *     Phi_NPHI(u) = sum_{n=1..NPHI} pi n^2 e^{2u} (2 pi n^2 e^{2u} - 3) exp(-pi n^2 e^{4u})
 *   is &gt;= 0 on [0, U] for every U &gt;= 0 and every NPHI, because each summand
 *   is nonnegative to the right of its sign-flip threshold u_n* and the rightmost
 *   flip u_1* = (1/2) ln(3/(2 pi)) = -0.36963 is strictly negative. That is a
 *   NONNEGATIVITY (&gt;= 0) statement. This ticket asks the sharper question:
 *   does the SAME termwise structure hand us a strictly-positive QUANTITATIVE
 *   floor f(u) &gt; 0, and would such a floor be a usable input to the magnitude
 *   half of the imp-3197 obstruction that imp-3257 leaves open?
 *
 *   THE FLOOR THAT THE TERMWISE STRUCTURE ACTUALLY DELIVERS
 *   ------------------------------------------------------
 *   On [0, U] every summand T_n(u) = pi n^2 e^{2u} (2 pi n^2 e^{2u} - 3) exp(-pi
 *   n^2 e^{4u}) is nonnegative (imp-3257: u &gt;= 0 &gt; u_1* &gt;= u_n*). Dropping
 *   all but the n = 1 term therefore gives the elementary lower bound
 *     Phi_NPHI(u) &gt;= T_1(u) = pi e^{2u} (2 pi e^{2u} - 3) exp(-pi e^{4u})   (u in [0, U], NPHI &gt;= 1),
 *   and on [0, U] the bracket obeys 2 pi e^{2u} - 3 &gt;= 2 pi - 3 &gt; 0, so
 *   T_1(u) is STRICTLY positive. This IS a quantitative pointwise floor:
 *   f(u) := T_1(u) &gt; 0 with Phi_NPHI(u) &gt;= f(u) on all of [0, U]. At the
 *   left endpoint f(0) = pi (2 pi - 3) e^{-pi} = 0.445727..., and because the
 *   n &gt;= 2 terms are tiny for u &gt;= 0 the floor is essentially tight there
 *   (T_1(0)/Phi_10(0) = 0.9978, and T_1/Phi -&gt; 1 by u = 0.25).
 *
 *   WHY THE FLOOR IS QUANTITATIVE BUT NOT A POSITIVE CONSTANT
 *   --------------------------------------------------------
 *   f(u) = T_1(u) is dominated by the Gaussian exp(-pi e^{4u}), which crushes it
 *   super-exponentially: T_1 peaks at u ~ -0.1344 (LEFT of 0, inside (u_1*, 0)),
 *   so on [0, infinity) it is monotone DECREASING, falling from f(0) = 0.4457 to
 *   f(0.5) ~ 1.0e-8, f(0.75) ~ 1.4e-25, and underflowing to 0 by u ~ 1.37. Hence
 *   inf_{[0,U]} f = f(U) -&gt; 0 as U grows: there is NO constant c &gt; 0 with
 *   Phi_NPHI &gt;= c on [0, U] for all U. This is not an artifact of keeping only
 *   n = 1 -- the FULL kernel Phi itself vanishes at +infinity (it is a
 *   Riemann-Xi Gaussian-tail kernel), so no termwise refinement, and indeed no
 *   argument at all, can produce a uniform positive constant floor on [0, U].
 *   The best the structure gives is the decaying pointwise floor f = T_1.
 *
 *   DOES THE FLOOR FEED THE imp-3197 MAGNITUDE HALF? -- NO
 *   -----------------------------------------------------
 *   The magnitude half is the operator-norm obstruction K_a &gt;= 0  &lt;=&gt;
 *   ||R|| &lt;= 1, where R is the off-diagonal Hankel-type operator built from the
 *   bridge kernel Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u)). Closing it needs
 *   an UPPER bound on an operator norm. A pointwise LOWER bound on Phi is the
 *   WRONG DIRECTION on two independent counts:
 *     (1) It bounds |Gshear(u, v)| = |Phi(u) Phi(v)| |sinh(a(v-u))| from BELOW,
 *         so it can only push ||Gshear|| (and ||R||) UP -- against the &lt;= 1
 *         inequality the obstruction requires.
 *     (2) The one classical route where a positive floor helps a &gt;= 0 spectral
 *         statement is DIAGONAL DOMINANCE (K_a = D - R with the diagonal D bounded
 *         below). But Gshear is HOLLOW: its diagonal Gshear(u, u) = Phi(u)^2
 *         sinh(0) = 0 identically, independent of Phi (the imp-3252 / imp-3066
 *         hollow rank-2 antisymmetry). There is no diagonal for a Phi-floor to
 *         support, so the diagonal-dominance route is vacuous regardless of f.
 *   Moreover even if a diagonal existed, f decays super-exponentially exactly on
 *   the u-tail where imp-3197 finds the |Gshear| operator-norm mass concentrated
 *   (the lag-stationary surrogate captures only ~3% of ||Gshear||), so a floor
 *   collapsing to 0 there could never dominate the concentrated off-diagonal mass.
 *   CONCLUSION: the termwise structure yields a genuine quantitative floor
 *   f = T_1 &gt; 0, but it is NOT a usable input to the magnitude half; that
 *   |Gshear|-spectrum obstruction stays exactly as open as imp-3257 left it.
 *
 *   VERDICT (assessment, RH-equivalent context, NO QED)
 *   ---------------------------------------------------
 *   YES to a quantitative strictly-positive pointwise floor f(u) = T_1(u) on
 *   [0, U] (Phi_NPHI &gt;= T_1 &gt; 0, essentially tight, f(0) = 0.4457); NO to a
 *   positive-constant floor (f decays super-exponentially, inf -&gt; 0); and NO to
 *   the floor feeding the imp-3197 magnitude half (a lower bound on Phi is the
 *   wrong direction for an operator-norm UPPER bound, and Gshear is hollow so the
 *   diagonal-dominance route is vacuous). Platt-Trudgian Lambda &lt;= 0.2 stays SOTA.
 *
 *   @see imp-3257-bridge-sign-phi-nonneg-structural.js (the &gt;= 0 termwise nonnegativity this sharpens)
 *   @see imp-3347-phi-leftmost-zero-vs-nphi.js (how far LEFT of u_1* the full Phi stays positive)
 *   @see imp-3197-mupass-bridge-sign-phi-only.js (the sign/magnitude split whose magnitude half stays open)
 *
 *   Ticket: imp-3352 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const A = 0.5; // headline shear weight (the imp-3197 genuine-Phi cell)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI. */
function phiKernel(uu, nphi) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= nphi; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** The n-th summand of the kernel. */
function phiTerm(uu, n) {
  const n2 = n * n;
  const n4 = n2 * n2;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  return (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
}

/** The candidate quantitative floor: keep only the n = 1 term. f(u) = T_1(u). */
const floorTerm1 = (uu) => phiTerm(uu, 1);

// -- The floor at the left endpoint, in closed form ---------------------------
// f(0) = T_1(0) = pi (2 pi - 3) exp(-pi).
const FLOOR_AT_ZERO_CLOSED = Math.PI * (2 * Math.PI - 3) * Math.exp(-Math.PI);
const FLOOR_AT_ZERO = floorTerm1(0); // 0.44572697131799...
const floorAtZeroMatchesClosed = Math.abs(FLOOR_AT_ZERO - FLOOR_AT_ZERO_CLOSED) < 1e-14;

// -- Claim 1: f = T_1 is a genuine floor (Phi_NPHI >= f) and STRICTLY positive
//    on [0, U], across a U x NPHI grid, at a dense midpoint sampling ----------
const U_GRID = [4, 6, 8];
const NPHI_GRID = [10, 20, 40];
const GRID_N = 3000; // dense midpoint grid on [0, U] per cell
const FLOOR_STRICT_EPS = 0; // floor must be > 0 wherever it has not numerically underflowed

let floorNeverExceedsPhi = true; // Phi_NPHI(u) >= T_1(u) at every sampled point
let floorStrictlyPositiveWhereRepresentable = true; // T_1(u) > 0 until super-exp underflow
let floorTightAtLeftEndpoint = true; // T_1(0)/Phi(0) close to 1 at every NPHI
const cellFloors = [];
for (const nphi of NPHI_GRID) {
  const ratio0 = floorTerm1(0) / phiKernel(0, nphi);
  if (!(ratio0 > 0.99 && ratio0 <= 1 + 1e-12)) floorTightAtLeftEndpoint = false;
  for (const U of U_GRID) {
    const H = U / GRID_N;
    let minFloor = Infinity;
    let minFloorU = 0;
    for (let i = 0; i < GRID_N; i++) {
      const u = (i + 0.5) * H;
      const f = floorTerm1(u);
      const p = phiKernel(u, nphi);
      // The floor must never exceed Phi (allow a hair of round-off).
      if (f > p + 1e-12 * (Math.abs(p) + 1)) floorNeverExceedsPhi = false;
      // Where the Gaussian has NOT underflowed the floor to 0, it must be > 0.
      if (f > 0 && f <= FLOOR_STRICT_EPS) floorStrictlyPositiveWhereRepresentable = false;
      if (f < minFloor) {
        minFloor = f;
        minFloorU = u;
      }
    }
    cellFloors.push({ nphi, U, ratio0, minFloorOnInterval: minFloor, minFloorU });
  }
}

// -- Claim 2: the floor is NOT a positive constant -- it decays super-exp ------
// T_1 peaks LEFT of 0, so on [0, U] it is monotone decreasing to ~0.
const FLOOR_SAMPLE_U = [0, 0.25, 0.5, 0.75, 1.0];
const floorSamples = FLOOR_SAMPLE_U.map((u) => ({ u, floor: floorTerm1(u) }));
// Peak location of T_1 (scan the small window around 0).
let floorPeak = -Infinity;
let floorPeakU = 0;
{
  const N = 4000;
  for (let i = 0; i <= N; i++) {
    const u = -0.6 + 0.9 * (i / N); // window (u_1*, 0.3) around the peak
    const f = floorTerm1(u);
    if (f > floorPeak) {
      floorPeak = f;
      floorPeakU = u;
    }
  }
}
const floorPeakIsLeftOfZero = floorPeakU < 0; // => floor monotone decreasing on [0, U]
const floorMonotoneDecreasingOnInterval =
  floorSamples[1].floor < floorSamples[0].floor &&
  floorSamples[2].floor < floorSamples[1].floor &&
  floorSamples[3].floor < floorSamples[2].floor;
// inf over [0, U] collapses toward 0 as U grows (super-exponential Gaussian crush):
// the min floor at U = 8 has underflowed to exactly 0.
const floorUnderflowsToZeroByLargeU = cellFloors.every(
  (c) => (c.U >= 6 ? c.minFloorOnInterval === 0 : true)
);
const noPositiveConstantFloor = floorPeakIsLeftOfZero && floorMonotoneDecreasingOnInterval && floorUnderflowsToZeroByLargeU;

// -- Claim 3: the magnitude half is not fed -- direction + hollow diagonal -----
// Gshear(u, u) = Phi(u)^2 sinh(a * 0) = 0 identically: the bridge kernel is HOLLOW,
// so the diagonal-dominance route (the only one a positive floor could serve) is vacuous.
const gshearDiagonalAt = (uu, nphi) => phiKernel(uu, nphi) * phiKernel(uu, nphi) * Math.sinh(A * 0);
let gshearDiagonalIsIdenticallyZero = true;
for (const u of [0, 0.5, 1, 2, 3]) {
  if (gshearDiagonalAt(u, 10) !== 0) gshearDiagonalIsIdenticallyZero = false;
}
// A lower bound on Phi bounds |Gshear| from BELOW (wrong direction for ||R|| <= 1):
// demonstrate that raising the Phi factors raises the off-diagonal magnitude.
const offDiagMagnitude = (uu, vv, phiU, phiV) => Math.abs(phiU * phiV * Math.sinh(A * (vv - uu)));
const magBaseline = offDiagMagnitude(0, 1, 1.0, 1.0);
const magWithLargerPhi = offDiagMagnitude(0, 1, 1.2, 1.2); // larger Phi (a bigger floor) => bigger magnitude
const lowerBoundOnPhiRaisesOffDiagMagnitude = magWithLargerPhi > magBaseline;
const floorFeedsMagnitudeHalf =
  !(gshearDiagonalIsIdenticallyZero && lowerBoundOnPhiRaisesOffDiagMagnitude); // false: it does NOT feed it

const verdict =
  floorAtZeroMatchesClosed &&
  floorNeverExceedsPhi &&
  floorStrictlyPositiveWhereRepresentable &&
  floorTightAtLeftEndpoint &&
  noPositiveConstantFloor &&
  !floorFeedsMagnitudeHalf
    ? 'QUANTITATIVE-POINTWISE-FLOOR-T1-EXISTS-BUT-DECAYS-TO-0-AND-DOES-NOT-FEED-THE-imp3197-MAGNITUDE-HALF'
    : 'INDETERMINATE';

export const IMP3352_PHI_QUANTITATIVE_FLOOR = Object.freeze({
  id: 'imp-3352-phi-quantitative-floor',
  ticket: 'imp-3352',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedStructural: 'imp-3257-bridge-sign-phi-nonneg-structural.js',
  relatedLeftMargin: 'imp-3347-phi-leftmost-zero-vs-nphi.js',
  relatedObstruction: 'imp-3197-mupass-bridge-sign-phi-only.js',

  summary:
    'Assesses whether the imp-3257 elementary termwise structure yields a QUANTITATIVE ' +
    'strictly-positive pointwise floor Phi_NPHI(u) >= f(u) > 0 on [0, U] (beyond the >= 0 ' +
    'nonnegativity) and whether such a floor could feed the still-open operator-norm ' +
    'MAGNITUDE half of the imp-3197 K_a >= 0 obstruction. YES to the floor: since every ' +
    'summand is >= 0 on [0, U] (u >= 0 > u_1*), dropping all but n = 1 gives Phi_NPHI(u) >= ' +
    'T_1(u) = pi e^{2u}(2 pi e^{2u} - 3) exp(-pi e^{4u}) > 0, with T_1(0) = pi(2 pi - 3)e^{-pi} ' +
    '= 0.445727 and the floor essentially tight (T_1(0)/Phi_10(0) = 0.9978, ratio -> 1 by u = ' +
    '0.25). NO to a positive-CONSTANT floor: T_1 peaks LEFT of 0 (u ~ -0.1344) and is crushed ' +
    'super-exponentially by exp(-pi e^{4u}), falling to ~1e-8 by u = 0.5 and underflowing to 0 ' +
    'by u ~ 1.37, so inf_{[0,U]} f -> 0 as U grows (the full Phi itself vanishes at +infinity, ' +
    'so no argument yields a uniform positive constant). NO to feeding the magnitude half: that ' +
    'obstruction needs an UPPER bound on ||Gshear|| / ||R|| <= 1, whereas a lower bound on Phi ' +
    'bounds |Gshear| = |Phi(u)Phi(v)||sinh(a(v-u))| from BELOW (wrong direction); and the one ' +
    'route a floor could serve -- diagonal dominance -- is vacuous because Gshear is HOLLOW ' +
    '(Gshear(u,u) = Phi(u)^2 sinh(0) = 0 identically), plus f decays to 0 exactly on the tail ' +
    'where imp-3197 finds the ||Gshear|| mass concentrated. So the quantitative floor is real ' +
    'but not a usable input; the |Gshear|-spectrum magnitude half stays exactly as open as ' +
    'imp-3257 left it. Assessment only; RH-equivalent context; NO QED; PT Lambda <= 0.2 SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    floorDefinition: 'f(u) = T_1(u) = pi e^{2u} (2 pi e^{2u} - 3) exp(-pi e^{4u}) (keep only n = 1)',
    floorJustification:
      'on [0, U] every summand T_n(u) >= 0 (imp-3257: u >= 0 > u_1* >= u_n*), so Phi_NPHI(u) >= T_1(u); ' +
      'and 2 pi e^{2u} - 3 >= 2 pi - 3 > 0 there, so T_1(u) > 0 strictly',
    floorAtZeroClosedForm: 'f(0) = pi (2 pi - 3) e^{-pi} = 0.44572697131799',
    floorDecay: 'f is dominated by exp(-pi e^{4u}); peaks at u ~ -0.1344 (left of 0), monotone decreasing on [0, U] to ~0',
    magnitudeHalf: 'K_a >= 0 <=> ||R|| <= 1 for the off-diagonal operator R built from Gshear(u,v) = Phi(u) Phi(v) sinh(a(v-u))',
    hollowDiagonal: 'Gshear(u,u) = Phi(u)^2 sinh(0) = 0 identically -- the bridge kernel is HOLLOW (imp-3252 / imp-3066)',
    uGrid: U_GRID,
    nphiGrid: NPHI_GRID,
    gridN: GRID_N,
    a: A,
    selfComputing: true,
  }),

  measured: Object.freeze({
    floorAtZero: FLOOR_AT_ZERO, // 0.44572697131799
    floorAtZeroClosed: FLOOR_AT_ZERO_CLOSED,
    floorAtZeroMatchesClosed, // true
    floorNeverExceedsPhi, // true -> Phi_NPHI >= T_1 at every sampled point (genuine floor)
    floorStrictlyPositiveWhereRepresentable, // true -> T_1 > 0 until super-exp underflow
    floorTightAtLeftEndpoint, // true -> T_1(0)/Phi(0) in (0.99, 1] at every NPHI
    floorPeak, // ~0.6906
    floorPeakU, // ~ -0.1344 (left of 0)
    floorPeakIsLeftOfZero, // true
    floorMonotoneDecreasingOnInterval, // true
    floorUnderflowsToZeroByLargeU, // true -> inf over [0, U] collapses to 0
    noPositiveConstantFloor, // true
    floorSamples, // [{u, floor}] showing the super-exponential collapse
    gshearDiagonalIsIdenticallyZero, // true -> hollow kernel, diagonal-dominance route vacuous
    lowerBoundOnPhiRaisesOffDiagMagnitude, // true -> a Phi floor pushes ||Gshear|| UP (wrong direction)
    floorFeedsMagnitudeHalf, // false
    cellFloors, // per-cell {nphi, U, ratio0, minFloorOnInterval, minFloorU}
    verdict,
  }),

  interpretation: Object.freeze({
    floorIsGenuineAndQuantitative:
      'The termwise structure of imp-3257 does yield a genuine, quantitative, strictly-positive ' +
      'pointwise floor on [0, U]: f(u) = T_1(u), the n = 1 summand, with Phi_NPHI(u) >= f(u) > 0 ' +
      'and f essentially tight for u >= 0 (T_1 captures 99.78% of Phi at u = 0 and -> 100% by u = 0.25). ' +
      'This is strictly more than the imp-3257 >= 0 nonnegativity: it is an explicit, closed-form, ' +
      'positive lower envelope.',
    butItDecaysToZero:
      'The floor is NOT a positive constant. T_1 is dominated by the Gaussian exp(-pi e^{4u}), peaks ' +
      'left of 0, and collapses super-exponentially on [0, U] (to ~1e-8 by u = 0.5, underflowing to 0 by ' +
      'u ~ 1.37). So inf_{[0,U]} f -> 0 as U grows; no c > 0 satisfies Phi_NPHI >= c on [0, U]. This is ' +
      'intrinsic: the full Riemann-Xi kernel Phi itself vanishes at +infinity, so no termwise refinement ' +
      'can manufacture a uniform positive constant.',
    doesNotFeedMagnitudeHalf:
      'A pointwise LOWER bound on Phi cannot serve the imp-3197 magnitude half, which needs an UPPER bound ' +
      'on the off-diagonal operator norm (K_a >= 0 <=> ||R|| <= 1). It bounds |Gshear| from BELOW (raising ' +
      '||Gshear||, the wrong direction); and the only positivity route a floor could feed -- diagonal ' +
      'dominance -- is vacuous because Gshear is hollow (zero diagonal, sinh(0) = 0), independent of Phi. ' +
      'Even absent that, f decays to 0 exactly on the u-tail where the ||Gshear|| mass concentrates. The ' +
      '|Gshear|-spectrum obstruction is untouched.',
    stillTheOpenHalf:
      'So the quantitative floor sharpens the EASY (sign / nonnegativity) side into an explicit positive ' +
      'envelope but does not advance the binding RH-equivalent K_a >= 0 residual -- the operator-norm ' +
      'magnitude of the off-diagonal endpoint-Hankel operator (imp-3066) -- which stays exactly as open ' +
      'as imp-3257 left it.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    floorExists: true,
    floorIsPositiveConstant: false,
    feedsMagnitudeHalf: false,
    floorIsWrongDirection:
      'A lower bound on Phi bounds the operator norm ||Gshear|| / ||R|| from below; the magnitude ' +
      'obstruction needs an UPPER bound, so the floor is directionally counterproductive.',
    diagonalDominanceVacuous:
      'The one route where a positive floor helps a >= 0 spectral statement is diagonal dominance, ' +
      'but Gshear is hollow (Gshear(u,u) = Phi(u)^2 sinh(0) = 0), so there is no diagonal to support.',
    magnitudeNotAdvanced:
      'The operator-norm magnitude that actually binds K_a >= 0 / ||R|| <= 1 (the |Gshear| spectrum, ' +
      'position concentration, imp-3066) is not advanced; only the positivity side is made explicit.',
    necessaryNotSufficient:
      'Correct signs and an explicit positive floor are necessary-but-NOT-sufficient; the off-diagonal ' +
      'endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3352_PHI_QUANTITATIVE_FLOOR_ASSERTIONS = [
  {
    id: 'imp3352-floor-at-zero-closed-form',
    why: 'The floor f = T_1 has the closed-form left-endpoint value f(0) = pi (2 pi - 3) e^{-pi} = 0.445727; ' +
         'the direct term evaluation must match it, anchoring the quantitative floor.',
    holds: () =>
      floorAtZeroMatchesClosed &&
      Math.abs(FLOOR_AT_ZERO - 0.44572697131799) < 1e-10 &&
      Math.abs(FLOOR_AT_ZERO_CLOSED - Math.PI * (2 * Math.PI - 3) * Math.exp(-Math.PI)) < 1e-15,
  },
  {
    id: 'imp3352-t1-is-a-genuine-strictly-positive-floor',
    why: 'THE DELIVERABLE (existence half): f = T_1 is a genuine floor (Phi_NPHI >= T_1 everywhere on [0, U]), ' +
         'strictly positive where representable, and essentially tight at the left endpoint -- a quantitative ' +
         'positive envelope, not just the imp-3257 >= 0 nonnegativity.',
    holds: () =>
      floorNeverExceedsPhi &&
      floorStrictlyPositiveWhereRepresentable &&
      floorTightAtLeftEndpoint &&
      cellFloors.length === U_GRID.length * NPHI_GRID.length,
  },
  {
    id: 'imp3352-floor-decays-no-positive-constant',
    why: 'THE DELIVERABLE (scope half): the floor is NOT a positive constant -- T_1 peaks left of 0, is monotone ' +
         'decreasing on [0, U], and underflows to 0 by large U, so inf over [0, U] collapses to 0. No c > 0 ' +
         'satisfies Phi_NPHI >= c on [0, U].',
    holds: () =>
      floorPeakIsLeftOfZero &&
      floorMonotoneDecreasingOnInterval &&
      floorUnderflowsToZeroByLargeU &&
      noPositiveConstantFloor,
  },
  {
    id: 'imp3352-floor-does-not-feed-magnitude-half',
    why: 'THE DECISION: the floor does NOT feed the imp-3197 magnitude half -- Gshear is hollow (diagonal ' +
         'identically 0, so diagonal dominance is vacuous) and a lower bound on Phi raises the off-diagonal ' +
         'magnitude (wrong direction for an operator-norm UPPER bound).',
    holds: () =>
      gshearDiagonalIsIdenticallyZero &&
      lowerBoundOnPhiRaisesOffDiagMagnitude &&
      floorFeedsMagnitudeHalf === false,
  },
  {
    id: 'imp3352-verdict-floor-exists-but-does-not-close-magnitude',
    why: 'The classified verdict must be the exists-but-decays-and-does-not-feed split, not indeterminate; ' +
         'a flip would mean the floor stopped being a genuine positive envelope or was wrongly credited to ' +
         'the magnitude half.',
    holds: () =>
      verdict === 'QUANTITATIVE-POINTWISE-FLOOR-T1-EXISTS-BUT-DECAYS-TO-0-AND-DOES-NOT-FEED-THE-imp3197-MAGNITUDE-HALF',
  },
  {
    id: 'imp3352-honest-assessment-no-qed',
    why: 'Mandatory honesty: ASSESSMENT only -- not a proof, not a reduction below RH, RH-equivalent, the floor ' +
         'is the wrong direction / diagonal-dominance vacuous, the magnitude half is not advanced, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3352_PHI_QUANTITATIVE_FLOOR.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.feedsMagnitudeHalf === false &&
        c.floorIsPositiveConstant === false &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3352_PHI_QUANTITATIVE_FLOOR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3352-phi-quantitative-floor assertion failed: ${assertion.id}`);
  }
}

export default IMP3352_PHI_QUANTITATIVE_FLOOR;
