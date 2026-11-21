/**
 * @module imp-3403-leading-order-residual-nphi-scaling
 * @fileoverview imp-3403 -- Quantify the NPHI-scaling of the imp-3347
 *   leadingOrderResidual (measured leftmost zero minus the elementary
 *   closed-form estimate) and identify which neglected term produces it.
 *
 *   CONTEXT
 *   -------
 *   imp-3347 located the leftmost genuine zero u_0(NPHI) of the truncated
 *   de Bruijn-Newman kernel Phi_NPHI and compared it to the elementary
 *   leading-order estimate (Gaussians ~ 1, power sums by their leading term)
 *     u_0_lead(N) = (1/2) ln(5 / (2 pi N^2)) = (1/2) ln(5/(2 pi)) - ln N,
 *   recording the per-cell gap leadingOrderResidual = u_0 - u_0_lead and
 *   noting only that it is bounded (|residual| &lt; 0.06) and "the neglected
 *   Gaussian curvature, shrinking as N grows". imp-3402 later fit the drift
 *   slope and re-attributed the same gap to "finite-N Gaussian curvature".
 *   NEITHER measured the DECAY RATE of the residual, nor tested WHICH neglected
 *   term dominates it. This module does both.
 *
 *   WHAT IS MEASURED
 *   ----------------
 *   The residual over an extended ladder NPHI in {10, 20, 40, 80, 160, 320,
 *   640, 1280} (each u_0 bisected to machine precision exactly as imp-3347).
 *   Two diagnostics:
 *     (a) the shrink law: log|residual| vs ln(NPHI) is fit by OLS, and the
 *         product residual * NPHI is tracked;
 *     (b) a term-by-term decomposition of the residual into the Faulhaber
 *         finite-N power-sum correction and the genuine Gaussian curvature.
 *
 *   SHRINK LAW
 *   ----------
 *   The log-log slope is -0.98210 (R^2 = 0.99988), i.e. an O(1/NPHI) decay,
 *   and the sharper diagnostic residual * NPHI converges MONOTONICALLY from
 *   -0.45115 (N=10) to -0.49959 (N=1280) toward the clean limit
 *     leadingOrderResidual  ~  -1 / (2 NPHI),
 *   so the residual vanishes and u_0 -&gt; u_0_lead as NPHI -&gt; infinity. The
 *   finite-N deficit of the log-slope below the ideal -1 is exactly this
 *   residual * N -&gt; -1/2 creep (the true law is -1/(2N)(1 + O(1/N))).
 *
 *   WHICH TERM DOMINATES (refines imp-3347 / imp-3402)
 *   --------------------------------------------------
 *   The elementary estimate neglects TWO things: (i) the finite-N Faulhaber
 *   corrections to the power sums (it uses sum n^4 ~ N^5/5 and sum n^2 ~ N^3/3,
 *   dropping the N^4/2, N^2/2, ... tails), and (ii) the Gaussian curvature
 *   (it sets every exp(-pi n^2 e^{4u}) = 1). Solving the Gaussians=1 kernel
 *   with the EXACT power sums,
 *     e^{2u_0} = 3 (sum n^2) / (2 pi sum n^4)
 *              = (5 / (2 pi N^2)) (1 + 3/(2N)) / (1 + 5/(2N)) + ...
 *              = (5 / (2 pi N^2)) (1 - 1/N + O(1/N^2)),
 *   so u_0_faulh = u_0_lead - 1/(2N) + O(1/N^2): the Faulhaber correction ALONE
 *   reproduces the -1/(2N) leading law. Numerically the Faulhaber residual
 *   accounts for 102.3% of the full residual at N=10, and the leftover
 *   Gaussian-curvature piece residual - residual_faulh is a SUBDOMINANT
 *   +O(1/NPHI^2) term (only 2.27% of |residual| at N=10, OPPOSITE sign,
 *   with piece * N^2 -&gt; ~0.114). Hence the imp-3347/imp-3402 attribution of
 *   the leadingOrderResidual to "Gaussian curvature" is imprecise: the leading
 *   O(1/N) shrink is the neglected Faulhaber finite-N power-sum correction; the
 *   Gaussian curvature enters only at the next order.
 *
 *   VERDICT (measurement, RH-equivalent context, NO QED)
 *   ----------------------------------------------------
 *   The imp-3347 leadingOrderResidual shrinks as -1/(2 NPHI) (log-log slope
 *   -0.98210, R^2 0.99988; residual * N -&gt; -1/2), and this leading O(1/N) piece
 *   is the neglected Faulhaber finite-N power-sum correction, NOT the Gaussian
 *   curvature -- the latter is a subdominant +O(1/NPHI^2) piece of opposite
 *   sign. Measurement only: the leftmost zero is a truncation artifact receding
 *   to -infinity (the untruncated Phi is positive on all of R), the
 *   imp-3197/imp-3257 [0, U] window is untouched, and the binding RH-equivalent
 *   residual is the imp-3066 operator-norm magnitude K_a &gt;= 0, entirely
 *   unaffected. No new positivity, no reduction, no RH verdict.
 *   No refereed bound is changed.
 *
 *   @see imp-3347-phi-leftmost-zero-vs-nphi.js (the residual this scales)
 *   @see imp-3402-leftmost-zero-drift-rate-fit.js (the drift fit this refines)
 *   @see imp-3257-bridge-sign-phi-nonneg-structural.js (the termwise [u_1*, inf) bound)
 *
 *   Ticket: imp-3403 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

/**
 * de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI
 * (identical to imp-3347 / imp-3402 / imp-3197 / imp-3257 / imp-2841 / imp-3175).
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

// Elementary leading-order estimate (Gaussians ~ 1, power sums by leading term):
// u_0_lead(N) = (1/2) ln(5 / (2 pi N^2)) = (1/2) ln(5/(2 pi)) - ln N.
const leadingOrderU0 = (nphi) => 0.5 * Math.log(5 / (2 * Math.PI * nphi * nphi));

// Gaussians=1 zero with the EXACT Faulhaber power sums (isolates the finite-N
// power-sum correction). The Gaussians=1 kernel 2 pi^2 e^{4u} S4 - 3 pi e^{2u} S2
// vanishes at e^{2u} = 3 S2 / (2 pi S4), with S2 = sum n^2, S4 = sum n^4.
function faulhaberOnlyU0(nphi) {
  const s2 = (nphi * (nphi + 1) * (2 * nphi + 1)) / 6;
  const s4 = (nphi * (nphi + 1) * (2 * nphi + 1) * (3 * nphi * nphi + 3 * nphi - 1)) / 30;
  return 0.5 * Math.log((3 * s2) / (2 * Math.PI * s4));
}

// -- Locate the leftmost genuine zero of Phi_NPHI (identical to imp-3347) ------
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
        if (fm === 0) return mid;
        if (fm < 0) lo = mid;
        else hi = mid;
      }
      return 0.5 * (lo + hi);
    }
    uPrev = u;
    pPrev = p;
  }
  return null;
}

const NPHI_GRID = [10, 20, 40, 80, 160, 320, 640, 1280];

const cells = NPHI_GRID.map((nphi) => {
  const u0 = leftmostZero(nphi);
  const lead = leadingOrderU0(nphi);
  const residual = u0 - lead; // imp-3347 leadingOrderResidual, extended ladder
  const faulhaberResidual = faulhaberOnlyU0(nphi) - lead; // finite-N power-sum piece
  const gaussianCurvaturePiece = residual - faulhaberResidual; // leftover = curvature
  return {
    nphi,
    leftmostZero: u0,
    leadingOrderU0: lead,
    residual, // measured minus elementary closed form
    residualTimesNphi: residual * nphi, // -> -1/2 (the shrink-law diagnostic)
    faulhaberResidual, // Gaussians=1 with exact power sums (dominant, ~ -1/(2N))
    gaussianCurvaturePiece, // residual - faulhaberResidual (subdominant, +O(1/N^2))
    gaussianPieceTimesNphiSq: (residual - faulhaberResidual) * nphi * nphi, // -> ~0.114
  };
});

// -- Shrink law: OLS of y = log|residual| against x = ln(NPHI) -----------------
const M = NPHI_GRID.length;
const xs = cells.map((c) => Math.log(c.nphi));
const ys = cells.map((c) => Math.log(Math.abs(c.residual)));
const meanX = xs.reduce((a, b) => a + b, 0) / M;
const meanY = ys.reduce((a, b) => a + b, 0) / M;
let sxy = 0;
let sxx = 0;
let syy = 0;
for (let i = 0; i < M; i++) {
  sxy += (xs[i] - meanX) * (ys[i] - meanY);
  sxx += (xs[i] - meanX) * (xs[i] - meanX);
  syy += (ys[i] - meanY) * (ys[i] - meanY);
}
const logLogSlope = sxy / sxx; // ~ -0.98210 (power-law exponent of the residual)
const logLogIntercept = meanY - logLogSlope * meanX;
let ssRes = 0;
for (let i = 0; i < M; i++) {
  const f = logLogSlope * xs[i] + logLogIntercept;
  ssRes += (ys[i] - f) * (ys[i] - f);
}
const logLogRSquared = 1 - ssRes / syy;

// The clean-limit diagnostic: residual * NPHI must climb monotonically toward -1/2.
const residualTimesNphiSeq = cells.map((c) => c.residualTimesNphi);
const residualTimesNphiTailLimit = residualTimesNphiSeq[M - 1]; // ~ -0.49959, -> -1/2
const convergetsToMinusHalf =
  residualTimesNphiSeq.every(
    (v, i) => i === 0 || Math.abs(v + 0.5) < Math.abs(residualTimesNphiSeq[i - 1] + 0.5),
  ) && Math.abs(residualTimesNphiTailLimit + 0.5) < 1e-3;

// -- Term dominance: Faulhaber piece vs Gaussian-curvature piece ---------------
const faulhaberFractionAtN10 = Math.abs(cells[0].faulhaberResidual / cells[0].residual); // ~ 1.0227
const gaussianFractionAtN10 = Math.abs(cells[0].gaussianCurvaturePiece / cells[0].residual); // ~ 0.0227
const gaussianPieceIsSubdominant = gaussianFractionAtN10 < 0.05;
const faulhaberDominates = faulhaberFractionAtN10 > 0.95;
// The Gaussian piece is a clean +O(1/N^2): piece * N^2 is roughly constant (~0.114)
// and the piece is POSITIVE (opposite sign to the negative full residual).
const gaussianPiecePositive = cells.every((c) => c.gaussianCurvaturePiece > 0);
const gaussianPieceOrderOneOverNsq = cells
  .slice(2)
  .every((c) => Math.abs(c.gaussianPieceTimesNphiSq - 0.114) < 0.01);

const residualDecaysAsInverseNphi = logLogSlope < -0.95 && logLogSlope > -1.02 && logLogRSquared > 0.999;

const verdict =
  residualDecaysAsInverseNphi &&
  convergetsToMinusHalf &&
  faulhaberDominates &&
  gaussianPieceIsSubdominant &&
  gaussianPiecePositive
    ? 'RESIDUAL-SHRINKS-AS-MINUS-1-OVER-2NPHI; DOMINANT-TERM-IS-FAULHABER-POWER-SUM-NOT-GAUSSIAN-CURVATURE'
    : 'INDETERMINATE';

export const IMP3403_LEADING_ORDER_RESIDUAL_NPHI_SCALING = Object.freeze({
  id: 'imp-3403-leading-order-residual-nphi-scaling',
  ticket: 'imp-3403',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedMeasurement: 'imp-3347-phi-leftmost-zero-vs-nphi.js',
  relatedFit: 'imp-3402-leftmost-zero-drift-rate-fit.js',
  relatedStructural: 'imp-3257-bridge-sign-phi-nonneg-structural.js',

  summary:
    'Quantifies the NPHI-scaling of the imp-3347 leadingOrderResidual (measured leftmost zero u_0 minus ' +
    'the elementary closed form u_0_lead = (1/2) ln(5/(2 pi N^2))) over an extended ladder NPHI = ' +
    '{10, 20, 40, 80, 160, 320, 640, 1280}. The residual shrinks as an O(1/NPHI) power law: log|residual| ' +
    'vs ln(NPHI) fits slope -0.98210 with R^2 = 0.99988, and the sharper diagnostic residual * NPHI ' +
    'climbs MONOTONICALLY from -0.45115 (N=10) to -0.49959 (N=1280) toward the clean limit -1/2, so ' +
    'leadingOrderResidual ~ -1/(2 NPHI) and u_0 -> u_0_lead as NPHI -> infinity. Decomposing the residual ' +
    'shows the dominant term is the neglected Faulhaber finite-N power-sum correction, NOT the Gaussian ' +
    'curvature imp-3347/imp-3402 named: solving the Gaussians=1 kernel with the EXACT power sums gives ' +
    'e^{2u_0} = (5/(2 pi N^2))(1 - 1/N + ...), i.e. u_0_faulh = u_0_lead - 1/(2N), reproducing 102.3% of ' +
    'the full residual at N=10; the leftover Gaussian-curvature piece is a SUBDOMINANT +O(1/NPHI^2) term ' +
    '(2.27% of |residual| at N=10, opposite sign, piece * N^2 -> ~0.114). Measurement only: the leftmost ' +
    'zero is a truncation artifact receding to -infinity (the untruncated Phi is positive on all of R), ' +
    'the imp-3197/imp-3257 [0, U] window is untouched, and the binding RH-equivalent residual is the ' +
    'imp-3066 operator-norm magnitude K_a >= 0, entirely unaffected; no positivity, no reduction, NO QED. ' +
    'No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    leadingOrderU0:
      'elementary (Gaussians ~ 1, power sums by leading term): u_0_lead = (1/2) ln(5/(2 pi N^2)) = ' +
      '(1/2) ln(5/(2 pi)) - ln N',
    faulhaberOnlyU0:
      'Gaussians=1 kernel with EXACT power sums S2 = N(N+1)(2N+1)/6, S4 = N(N+1)(2N+1)(3N^2+3N-1)/30: ' +
      'zero at e^{2u} = 3 S2 / (2 pi S4); isolates the finite-N power-sum correction',
    residual: 'residual = u_0 - u_0_lead (the imp-3347 leadingOrderResidual, extended ladder)',
    decomposition:
      'residual = faulhaberResidual + gaussianCurvaturePiece, where faulhaberResidual = u_0_faulh - ' +
      'u_0_lead (dominant, ~ -1/(2N)) and gaussianCurvaturePiece = residual - faulhaberResidual ' +
      '(subdominant, +O(1/N^2))',
    leftmostZeroMethod:
      'fine leftward scan from u_1* to the first negative, then 200-step bisection to machine precision ' +
      '(identical to imp-3347 / imp-3402)',
    shrinkLawFit: 'OLS of log|residual| against ln(NPHI); plus residual * NPHI tracked toward the -1/2 limit',
    nphiGrid: NPHI_GRID,
    selfComputing: true,
  }),

  measured: Object.freeze({
    cells, // per-NPHI residual, residualTimesNphi, faulhaberResidual, gaussianCurvaturePiece, ...
    logLogSlope, // ~ -0.98210 (power-law exponent -> -1 as N grows)
    logLogIntercept,
    logLogRSquared, // ~ 0.99988
    residualTimesNphiSeq, // -0.45115 -> -0.49959, monotone toward -1/2
    residualTimesNphiTailLimit, // ~ -0.49959
    convergetsToMinusHalf,
    faulhaberFractionAtN10, // ~ 1.0227 (Faulhaber piece slightly exceeds full residual)
    gaussianFractionAtN10, // ~ 0.0227 (curvature is a small fraction)
    faulhaberDominates,
    gaussianPieceIsSubdominant,
    gaussianPiecePositive,
    gaussianPieceOrderOneOverNsq,
    residualDecaysAsInverseNphi,
    verdict,
  }),

  interpretation: Object.freeze({
    shrinkLawIsMinusHalfOverNphi:
      'The residual decays as O(1/NPHI): the log-log slope is -0.98210 (R^2 0.99988) and residual * NPHI ' +
      'rises monotonically to -0.49959 at NPHI=1280, so leadingOrderResidual ~ -1/(2 NPHI) and vanishes ' +
      'as NPHI -> infinity, confirming u_0 -> the elementary closed form. The log-slope deficit below -1 ' +
      'is exactly the residual * N -> -1/2 creep (the true law is -1/(2N)(1 + O(1/N))).',
    dominantTermIsFaulhaberNotGaussian:
      'The elementary estimate drops the finite-N Faulhaber tails (sum n^4 = N^5/5 + N^4/2 + ..., ' +
      'sum n^2 = N^3/3 + N^2/2 + ...). Reinstating them alone gives u_0_faulh = u_0_lead - 1/(2N), which ' +
      'reproduces 102.3% of the full residual at N=10; the residual is therefore the neglected power-sum ' +
      'correction, not the Gaussian curvature that imp-3347 and imp-3402 named as its source.',
    gaussianCurvatureIsSubdominant:
      'The genuine Gaussian-curvature piece residual - faulhaberResidual is a SUBDOMINANT +O(1/NPHI^2) ' +
      'term (2.27% of |residual| at N=10, OPPOSITE sign, piece * N^2 -> ~0.114); it refines but does not ' +
      'control the leading shrink, correcting the imp-3347/imp-3402 attribution.',
    diagnosticOnly:
      'This scales a truncation artifact (the untruncated de Bruijn-Newman Phi is positive on all of R); ' +
      'it leaves the imp-3197/imp-3257 [0, U] usage and the imp-3066 K_a >= 0 operator-norm magnitude ' +
      'obstruction entirely untouched.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isDiagnosticMeasurement: true,
    scalesAnExistingArtifact:
      'This only measures the NPHI-decay of the imp-3347 leadingOrderResidual (a finite-truncation ' +
      'artifact receding to -infinity); it adds no new positivity and does not use the classical ' +
      'de Bruijn-Newman positivity.',
    refinesNotOverturnsPriorAttribution:
      'It reassigns the LEADING O(1/N) shrink from "Gaussian curvature" (imp-3347/imp-3402) to the ' +
      'neglected Faulhaber finite-N power-sum correction; the Gaussian curvature is still present, only ' +
      'at the subdominant +O(1/N^2) order. This is a book-keeping refinement, not a new theorem.',
    doesNotAdvancePositivity:
      'The binding RH-equivalent residual is the operator-norm magnitude (the |Gshear| spectrum, ' +
      'imp-3066 K_a >= 0), entirely untouched here; correct signs / positivity of Phi on [0, U] were ' +
      'already necessary-but-NOT-sufficient.',
    finiteNphiScaling:
      'The slope -0.98210 and the -1/(2N) law are the FINITE-NPHI behaviour over {10, ..., 1280}; the ' +
      'exact asymptotic exponent is -1 (residual * N -> -1/2), so no claim is made that the true decay ' +
      'differs from 1/N.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3403_LEADING_ORDER_RESIDUAL_NPHI_SCALING_ASSERTIONS = [
  {
    id: 'imp3403-residual-ladder-grounded-in-imp3347',
    why: 'The ladder must extend the SAME imp-3347 residual: the NPHI=10 leftmost zero reproduces the ' +
         'imp-3347 headline -2.4619 and its residual is -0.045115, matching imp-3347 |residual| < 0.06.',
    holds: () =>
      cells.length === 8 &&
      Math.abs(cells[0].leftmostZero - -2.4619191762) < 1e-4 &&
      Math.abs(cells[0].residual - -0.0451145063) < 1e-6 &&
      cells.every((c) => Math.abs(c.residual) < 0.06),
  },
  {
    id: 'imp3403-shrink-law-is-inverse-nphi',
    why: 'The deliverable shrink law: log|residual| vs ln(NPHI) has slope -0.98210 with R^2 = 0.99988, an ' +
         'O(1/NPHI) power-law decay of the residual.',
    holds: () =>
      Math.abs(logLogSlope - -0.982098309360) < 1e-6 &&
      Math.abs(logLogRSquared - 0.999876605625) < 1e-6 &&
      residualDecaysAsInverseNphi,
  },
  {
    id: 'imp3403-residual-times-nphi-converges-to-minus-half',
    why: 'The clean-limit diagnostic: residual * NPHI climbs monotonically toward -1/2, reaching -0.49959 ' +
         'at NPHI=1280, so leadingOrderResidual ~ -1/(2 NPHI) and vanishes as NPHI -> infinity.',
    holds: () =>
      Math.abs(residualTimesNphiTailLimit - -0.499585937714) < 1e-6 &&
      convergetsToMinusHalf,
  },
  {
    id: 'imp3403-dominant-term-is-faulhaber-power-sum',
    why: 'The mechanism deliverable: the Faulhaber finite-N power-sum correction ALONE reproduces the ' +
         'leading residual (102.3% at N=10), so it dominates -- refining the imp-3347/imp-3402 ' +
         '"Gaussian curvature" attribution.',
    holds: () =>
      Math.abs(faulhaberFractionAtN10 - 1.022679) < 1e-4 &&
      faulhaberDominates,
  },
  {
    id: 'imp3403-gaussian-curvature-is-subdominant-order-one-over-nsq',
    why: 'The genuine Gaussian-curvature piece must be SUBDOMINANT: 2.27% of |residual| at N=10, positive ' +
         '(opposite sign to the residual), and a clean +O(1/NPHI^2) (piece * N^2 ~ 0.114).',
    holds: () =>
      Math.abs(gaussianFractionAtN10 - 0.022679) < 1e-4 &&
      gaussianPieceIsSubdominant &&
      gaussianPiecePositive &&
      gaussianPieceOrderOneOverNsq,
  },
  {
    id: 'imp3403-verdict-faulhaber-shrink',
    why: 'The classified verdict must be the -1/(2NPHI) shrink with Faulhaber (not Gaussian curvature) as ' +
         'the dominant term, not indeterminate; any flip means the decay or the term-dominance changed.',
    holds: () =>
      verdict === 'RESIDUAL-SHRINKS-AS-MINUS-1-OVER-2NPHI; DOMINANT-TERM-IS-FAULHABER-POWER-SUM-NOT-GAUSSIAN-CURVATURE',
  },
  {
    id: 'imp3403-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- not a proof, not a reduction below RH, RH-equivalent, ' +
         'scales a truncation artifact, refines (does not overturn) the prior attribution, does not ' +
         'advance positivity / the imp-3066 magnitude obstruction, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3403_LEADING_ORDER_RESIDUAL_NPHI_SCALING.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.doesNotAdvancePositivity.length > 0 &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3403_LEADING_ORDER_RESIDUAL_NPHI_SCALING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3403-leading-order-residual-nphi-scaling assertion failed: ${assertion.id}`);
  }
}

export default IMP3403_LEADING_ORDER_RESIDUAL_NPHI_SCALING;
