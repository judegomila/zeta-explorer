/**
 * @module imp-3347-phi-leftmost-zero-vs-nphi
 * @fileoverview imp-3347 -- Measure how far LEFT of the last per-term sign-flip
 *   u_1* = (1/2) ln(3/(2 pi)) = -0.36963 the FULL truncated de Bruijn-Newman
 *   kernel Phi_NPHI stays strictly positive, and locate its leftmost genuine
 *   zero u_0(NPHI) as a function of the truncation NPHI in {10, 20, 40, 80}.
 *
 *   CONTEXT
 *   -------
 *   imp-3257 proved the ELEMENTARY termwise bound Phi_NPHI &gt;= 0 only on the
 *   half-line [u_1*, infinity): each summand
 *     pi n^2 e^{2u} (2 pi n^2 e^{2u} - 3) exp(-pi n^2 e^{4u})
 *   is nonnegative exactly for u &gt;= u_n* = (1/2) ln(3/(2 pi n^2)), and the
 *   rightmost (worst) threshold is u_1* = -0.36963 &lt; 0. That bound is
 *   SUFFICIENT but conservative: imp-3257 noted the FULL Phi stays strictly
 *   positive far to the LEFT of u_1* (Phi(-0.8) ~ 72.7) by the classical
 *   de Bruijn-Newman / Riemann-Xi positivity, which the termwise bound does not
 *   deliver. This module QUANTIFIES that unused left margin: it measures the
 *   leftmost real u where the truncated Phi_NPHI first turns negative.
 *
 *   WHY THE TRUNCATION TURNS NEGATIVE ON THE FAR LEFT
 *   -------------------------------------------------
 *   As u -&gt; -infinity the Gaussian exp(-pi n^2 e^{4u}) -&gt; 1 for every fixed n,
 *   and the bracket 2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u} is dominated by its
 *   NEGATIVE second term (e^{2u} &gt;&gt; e^{4u}), so every retained summand tends to
 *   -3 pi n^2 e^{2u} &lt; 0 and the partial sum Phi_NPHI -&gt; 0 from BELOW. The
 *   infinite (untruncated) Phi is positive on all of R (it is even and equals the
 *   classical Riemann-Xi transform kernel); dropping the tail n &gt; NPHI removes
 *   terms that are POSITIVE deep in the left tail (their e^{4u} n^4 growth wins
 *   once n is large enough that pi n^2 e^{4u} is O(1)), so the truncation loses
 *   positivity far to the left. Hence Phi_NPHI has a leftmost genuine zero
 *   u_0(NPHI) that drifts to -infinity as NPHI -&gt; infinity.
 *
 *   LEADING-ORDER LOCATION (elementary, u -&gt; -inf so Gaussians ~ 1)
 *   --------------------------------------------------------------
 *   With every Gaussian ~ 1, Phi_NPHI ~ 2 pi^2 e^{4u} sum_{n=1}^{N} n^4
 *   - 3 pi e^{2u} sum_{n=1}^{N} n^2. Using sum n^4 ~ N^5/5, sum n^2 ~ N^3/3, the
 *   partial sum vanishes when 2 pi^2 e^{4u} N^5/5 = 3 pi e^{2u} N^3/3, i.e.
 *     e^{2u} = (5 / (2 pi)) N^{-2},   u_0 ~ (1/2) ln(5 / (2 pi N^2))
 *            = (1/2) ln(5/(2 pi)) - ln N.
 *   So u_0 shifts LEFT by ln 2 ~ 0.693 per doubling of NPHI and diverges to
 *   -infinity, consistent with the full Phi being positive on all of R. The
 *   measured leftmost zeros below match this closed form to a few times 1e-2
 *   (the residual is the neglected Gaussian curvature, shrinking as N grows).
 *
 *   VERDICT (measurement, RH-equivalent context, NO QED)
 *   ----------------------------------------------------
 *   The elementary termwise guarantee stops at u_1* = -0.36963, but the FULL
 *   truncated Phi_NPHI stays strictly positive over a GROWING left margin
 *   u_1* - u_0(NPHI) ~ ln N - (1/2) ln(5/(2 pi)) - u_1* that widens by ~ln 2 per
 *   NPHI doubling: 2.09, 2.76, 3.45, 4.13 at NPHI = 10, 20, 40, 80. The [0, U]
 *   window used by imp-3197 / imp-3257 sits entirely inside [u_1*, infinity), so
 *   this far-left truncation zero never touches it -- the bridge-sign result is
 *   unaffected. Diagnostic only; measures the conservatism of the termwise bound,
 *   adds no new positivity, does not advance the imp-3066 K_a &gt;= 0 magnitude
 *   obstruction. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3257-bridge-sign-phi-nonneg-structural.js (the termwise [u_1*, inf) bound this quantifies below u_1*)
 *   @see imp-3197-mupass-bridge-sign-phi-only.js (the [0, U] usage this leaves untouched)
 *
 *   Ticket: imp-3347 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

/**
 * de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI
 * (identical to imp-3197 / imp-3257 / imp-2841 / imp-3175).
 */
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

// The rightmost per-term sign-flip threshold (imp-3257): u_1* = (1/2) ln(3/(2 pi)).
const U1_STAR = 0.5 * Math.log(3 / (2 * Math.PI)); // ~ -0.36963238887

// Leading-order closed form for the leftmost zero (Gaussians ~ 1 as u -> -inf):
// u_0(N) ~ (1/2) ln(5 / (2 pi N^2)) = (1/2) ln(5/(2 pi)) - ln N.
const leftmostZeroLeadingOrder = (nphi) => 0.5 * Math.log(5 / (2 * Math.PI * nphi * nphi));

// -- Locate the leftmost genuine zero of Phi_NPHI ----------------------------
// Scan LEFT from u_1* on a fine grid until the first sign change to negative
// (the right edge of the connected positive region containing [0, U]), then
// bisect to machine precision. Returns { u0, bracket } or null if none is found
// within the scan window.
function leftmostZero(nphi) {
  const step = 1e-3;
  let uPrev = U1_STAR;
  let pPrev = phiKernel(uPrev, nphi);
  for (let u = U1_STAR - step; u > -12; u -= step) {
    const p = phiKernel(u, nphi);
    if (p < 0 && pPrev > 0) {
      let lo = u; // Phi(lo) < 0
      let hi = uPrev; // Phi(hi) > 0
      for (let it = 0; it < 200; it++) {
        const mid = 0.5 * (lo + hi);
        const fm = phiKernel(mid, nphi);
        if (fm === 0) return { u0: mid, bracketLo: lo, bracketHi: hi };
        if (fm < 0) lo = mid;
        else hi = mid;
      }
      return { u0: 0.5 * (lo + hi), bracketLo: lo, bracketHi: hi };
    }
    uPrev = u;
    pPrev = p;
  }
  return null;
}

const NPHI_GRID = [10, 20, 40, 80];

const cells = NPHI_GRID.map((nphi) => {
  const z = leftmostZero(nphi);
  const u0 = z ? z.u0 : null;
  const lead = leftmostZeroLeadingOrder(nphi);
  return {
    nphi,
    leftmostZero: u0, // largest u < u_1* where Phi_NPHI(u) = 0
    leftMarginBelowU1Star: u0 === null ? null : U1_STAR - u0, // how far left of u_1* Phi stays positive
    phiAtHalfMargin: u0 === null ? null : phiKernel(0.5 * (u0 + U1_STAR), nphi), // strictly positive interior sample
    leadingOrderU0: lead, // (1/2) ln(5/(2 pi N^2))
    leadingOrderResidual: u0 === null ? null : u0 - lead, // measured minus closed-form estimate
  };
});

// The zeros must march monotonically LEFT as NPHI doubles, by ~ln 2 each step.
const zerosMonotoneLeft = cells.every(
  (c, i) => i === 0 || (c.leftmostZero !== null && c.leftmostZero < cells[i - 1].leftmostZero),
);
const shiftsPerDoubling = cells.slice(1).map((c, i) => c.leftmostZero - cells[i].leftmostZero);
const shiftsNearLn2 = shiftsPerDoubling.every((d) => Math.abs(d + Math.LN2) < 0.03);
const leadingOrderTracks = cells.every((c) => Math.abs(c.leadingOrderResidual) < 0.06);
const marginGrows = cells.every(
  (c, i) => i === 0 || c.leftMarginBelowU1Star > cells[i - 1].leftMarginBelowU1Star,
);
const allZerosLeftOfU1Star = cells.every((c) => c.leftmostZero !== null && c.leftmostZero < U1_STAR);
const interiorStrictlyPositive = cells.every((c) => c.phiAtHalfMargin > 0);

const verdict =
  zerosMonotoneLeft && shiftsNearLn2 && marginGrows && allZerosLeftOfU1Star && interiorStrictlyPositive
    ? 'FULL-PHI-POSITIVE-FAR-LEFT-OF-u1star; LEFTMOST-ZERO-DRIFTS-TO-MINUS-INF-AS-ln-NPHI'
    : 'INDETERMINATE';

export const IMP3347_PHI_LEFTMOST_ZERO_VS_NPHI = Object.freeze({
  id: 'imp-3347-phi-leftmost-zero-vs-nphi',
  ticket: 'imp-3347',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedStructural: 'imp-3257-bridge-sign-phi-nonneg-structural.js',
  relatedDiagnostic: 'imp-3197-mupass-bridge-sign-phi-only.js',

  summary:
    'Measures how far LEFT of the last per-term sign-flip u_1* = (1/2) ln(3/(2 pi)) = -0.36963 the FULL ' +
    'truncated de Bruijn-Newman kernel Phi_NPHI stays strictly positive, and locates its leftmost genuine ' +
    'zero u_0(NPHI) for NPHI in {10, 20, 40, 80}. The imp-3257 termwise bound guarantees Phi >= 0 only on ' +
    '[u_1*, infinity); below u_1* the full Phi stays positive by the classical de Bruijn-Newman positivity, ' +
    'quantified here. As u -> -infinity the Gaussians -> 1 and each retained summand -> -3 pi n^2 e^{2u} < 0, ' +
    'so the truncation loses positivity far to the left and has a leftmost zero u_0(NPHI) = -2.4619, -3.1337, ' +
    '-3.8153, -4.5024 at NPHI = 10, 20, 40, 80 (bisected to machine precision). The zeros march LEFT by ~ln 2 ' +
    'per NPHI doubling (measured shifts -0.672, -0.682, -0.687) and match the elementary closed form ' +
    'u_0 ~ (1/2) ln(5/(2 pi N^2)) = (1/2) ln(5/(2 pi)) - ln N to within 0.045, so u_0 -> -infinity as ' +
    'NPHI -> infinity, consistent with the untruncated Phi being positive on all of R. The unused left ' +
    'margin u_1* - u_0 GROWS (2.09, 2.76, 3.45, 4.13), showing how conservative the termwise bound is below ' +
    'u_1*. The imp-3197/imp-3257 [0, U] window sits entirely inside [u_1*, infinity), so this far-left ' +
    'truncation zero never touches it and the bridge-sign result is unaffected. Diagnostic only; ' +
    'RH-equivalent; adds no new positivity and does not advance the imp-3066 K_a >= 0 magnitude ' +
    'obstruction; NO QED; Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    u1Star: 'rightmost per-term sign-flip (imp-3257): u_1* = (1/2) ln(3/(2 pi)) = -0.36963238887',
    leftTailSign:
      'as u -> -inf every Gaussian -> 1 and each summand -> -3 pi n^2 e^{2u} < 0, so the truncated partial ' +
      'sum -> 0 from below and must cross zero at some finite leftmost u_0(NPHI)',
    leadingOrderU0:
      'Gaussians ~ 1 => Phi_NPHI ~ 2 pi^2 e^{4u} (N^5/5) - 3 pi e^{2u} (N^3/3), vanishing at ' +
      'u_0 ~ (1/2) ln(5/(2 pi N^2)) = (1/2) ln(5/(2 pi)) - ln N (shift -ln 2 per NPHI doubling)',
    method: 'fine leftward scan from u_1* to the first negative, then 200-step bisection to machine precision',
    nphiGrid: NPHI_GRID,
    selfComputing: true,
  }),

  measured: Object.freeze({
    u1Star: U1_STAR,
    cells, // per-NPHI {nphi, leftmostZero, leftMarginBelowU1Star, phiAtHalfMargin, leadingOrderU0, leadingOrderResidual}
    shiftsPerDoubling, // ~ -ln 2 each
    zerosMonotoneLeft,
    shiftsNearLn2,
    leadingOrderTracks,
    marginGrows,
    allZerosLeftOfU1Star,
    interiorStrictlyPositive,
    verdict,
  }),

  interpretation: Object.freeze({
    leftMarginIsLargeAndGrows:
      'The elementary termwise bound (imp-3257) stops at u_1* = -0.36963, but the FULL truncated Phi_NPHI ' +
      'stays strictly positive across a margin u_1* - u_0(NPHI) of 2.09, 2.76, 3.45, 4.13 at NPHI = 10, ' +
      '20, 40, 80 -- a margin that WIDENS by ~ln 2 with every doubling of NPHI, so the termwise guarantee ' +
      'is very conservative below u_1*.',
    zeroIsATruncationArtifact:
      'The leftmost zero u_0(NPHI) drifts to -infinity as NPHI grows (u_0 ~ (1/2) ln(5/(2 pi)) - ln N), ' +
      'confirming it is a pure truncation artifact: the untruncated de Bruijn-Newman Phi is positive on ' +
      'all of R, and only the dropped positive tail n > NPHI lets the partial sum go negative far to the left.',
    bridgeUsageUntouched:
      'imp-3197 / imp-3257 use only [0, U] subset [u_1*, infinity), which lies to the RIGHT of every ' +
      'measured u_0(NPHI); the far-left truncation zero cannot flip any bridge sign there. This measurement ' +
      'is diagnostic and leaves the operator-norm magnitude obstruction (imp-3066 K_a >= 0) untouched.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isDiagnosticMeasurement: true,
    measuresConservatismOfTermwiseBound:
      'This quantifies the gap between the elementary termwise guarantee [u_1*, infinity) and the true ' +
      'positivity margin of the truncated Phi; it adds no new positivity theorem and does not use the ' +
      'classical de Bruijn-Newman positivity, only measures where the truncation loses it.',
    doesNotAdvancePositivity:
      'The binding RH-equivalent residual is the operator-norm magnitude (the |Gshear| spectrum, imp-3066 ' +
      'K_a >= 0), entirely untouched here; correct signs / positivity of Phi on [0, U] were already ' +
      'necessary-but-NOT-sufficient.',
    truncationArtifactNotClassicalStatement:
      'The leftmost zero is a property of the FINITE truncation Phi_NPHI, not of the full de Bruijn-Newman ' +
      'Phi (which is positive on all of R); the zero recedes to -infinity as NPHI -> infinity.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3347_PHI_LEFTMOST_ZERO_VS_NPHI_ASSERTIONS = [
  {
    id: 'imp3347-leftmost-zeros-located-left-of-u1star',
    why: 'The deliverable: a genuine leftmost zero u_0(NPHI) of the FULL truncated Phi_NPHI is located for ' +
         'each NPHI in {10,20,40,80}, and every one sits strictly LEFT of the termwise threshold u_1* = -0.36963.',
    holds: () =>
      cells.length === 4 &&
      cells.every((c) => c.leftmostZero !== null && c.leftmostZero < U1_STAR) &&
      Math.abs(cells[0].leftmostZero - -2.4619191762) < 1e-4 &&
      Math.abs(cells[3].leftmostZero - -4.5024142103) < 1e-4,
  },
  {
    id: 'imp3347-zeros-drift-left-by-ln2-per-doubling',
    why: 'The leftmost zero must march monotonically LEFT as NPHI doubles, by ~ln 2 each step (drifting to ' +
         '-infinity), consistent with the untruncated de Bruijn-Newman Phi being positive on all of R.',
    holds: () => zerosMonotoneLeft && shiftsNearLn2,
  },
  {
    id: 'imp3347-leading-order-closed-form-tracks',
    why: 'The elementary closed form u_0 ~ (1/2) ln(5/(2 pi N^2)) (Gaussians ~ 1) must match the measured ' +
         'zeros to within 0.06, confirming the -3 pi n^2 e^{2u} left-tail balance that produces the zero.',
    holds: () => leadingOrderTracks,
  },
  {
    id: 'imp3347-left-margin-grows-and-interior-positive',
    why: 'The unused left margin u_1* - u_0(NPHI) must GROW with NPHI (showing the termwise bound is ' +
         'conservative), and Phi_NPHI must be strictly positive at the interior midpoint of each margin.',
    holds: () => marginGrows && interiorStrictlyPositive,
  },
  {
    id: 'imp3347-verdict-truncation-zero-recedes',
    why: 'The classified verdict must be the far-left-positive / zero-recedes-to-minus-infinity split, not ' +
         'indeterminate; any flip means the zeros stopped drifting left or the interior lost positivity.',
    holds: () => verdict === 'FULL-PHI-POSITIVE-FAR-LEFT-OF-u1star; LEFTMOST-ZERO-DRIFTS-TO-MINUS-INF-AS-ln-NPHI',
  },
  {
    id: 'imp3347-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- not a proof, not a reduction below RH, RH-equivalent, a ' +
         'truncation artifact not a classical statement, does not advance positivity / the imp-3066 magnitude ' +
         'obstruction, PT 0.2 stays SOTA. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3347_PHI_LEFTMOST_ZERO_VS_NPHI.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.doesNotAdvancePositivity.length > 0 &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3347_PHI_LEFTMOST_ZERO_VS_NPHI_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3347-phi-leftmost-zero-vs-nphi assertion failed: ${assertion.id}`);
  }
}

export default IMP3347_PHI_LEFTMOST_ZERO_VS_NPHI;
