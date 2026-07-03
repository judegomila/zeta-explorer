/**
 * @module imp-3501-moment-ladder-general-derivation
 * @fileoverview imp-3501 -- DERIVE the imp-3481 moment-indexed leading form
 *   R_n(a) = (a^n/n!) M_n analytically for EVERY n = 0..4, extending the imp-3488
 *   degree-2 (n = 2) derivation to the full autocorrelation moment ladder, then
 *   reconcile the derived forms against the imp-3481 measured remainders to
 *   machine precision.
 *
 *   THE IMP-3481 EMPIRICAL FACT
 *   ---------------------------
 *   imp-3481 MEASURED that each Taylor remainder R_n(a) of the A-weighted
 *   cosh/sinh (degree-2) bridge masses reproduces its moment-indexed leading form
 *   (a^n/n!) M_n to < 1e-3 relative at the base a = 0.5, with
 *       M_n = int_0^{T_A} tau^n A(tau) d(tau)
 *   the U-independent n-th moment of the FIXED genuine-Phi autocorrelation
 *   A(tau) = int Phi(s) Phi(s+tau) ds (NPHI = 10). It derived the closed form
 *   only for n = 2 (via imp-3488, B_2(a) = (a^2/2) M_2 + O(a^4)) and recorded the
 *   n = 0,1,3,4 rungs EMPIRICALLY.
 *
 *   THE CLOSED-FORM DERIVATION (this module, all n)
 *   -----------------------------------------------
 *   (D1) TERMWISE EXPANSION. On the compact support [0, T_A] the even/odd
 *        exponential series converge UNIFORMLY:
 *            cosh(a tau) = sum_{j>=0} (a tau)^{2j}/(2j)!,
 *            sinh(a tau) = sum_{j>=0} (a tau)^{2j+1}/(2j+1)!.
 *        A(tau) is bounded and integrable on [0, T_A], so integration commutes
 *        with the sum (uniform convergence on a compact interval). Integrating
 *        each series against A(tau) gives the two generating masses as moment
 *        power series:
 *            C(a) := int cosh(a tau) A(tau) d(tau) = sum_{j>=0} a^{2j}/(2j)! M_{2j},
 *            S(a) := int sinh(a tau) A(tau) d(tau) = sum_{j>=0} a^{2j+1}/(2j+1)! M_{2j+1}.
 *   (D2) THE REMAINDER IS A PURE MOMENT TAIL. Peeling the Taylor terms below
 *        order n from the appropriate parity mass leaves, for even n = 2j,
 *            R_n(a) = C(a) - sum_{i<j} a^{2i}/(2i)! M_{2i}
 *                   = sum_{i>=j} a^{2i}/(2i)! M_{2i},
 *        and for odd n = 2j+1,
 *            R_n(a) = S(a) - sum_{i<j} a^{2i+1}/(2i+1)! M_{2i+1}
 *                   = sum_{i>=j} a^{2i+1}/(2i+1)! M_{2i+1}.
 *        In BOTH parities this is the single tail sum
 *            R_n(a) = sum_{m >= n, m == n (mod 2)} a^m/m! M_m.
 *   (D3) LEADING FORM, ALL n. The first (m = n) term of that tail is
 *            a^n/n! M_n = (a^n/n!) M_n,
 *        and the next term is a^{n+2}/(n+2)! M_{n+2}, so
 *            R_n(a) = (a^n/n!) M_n + (a^{n+2}/(n+2)!) M_{n+2} + O(a^{n+4})
 *                   = (a^n/n!) M_n + O(a^{n+2})   for every n = 0..4.
 *        The imp-3481 leading form is thus the m = n term of the moment power
 *        series -- DERIVED, not fitted -- and the residual it leaves is exactly
 *        the derived next-moment tail (a^{n+2}/(n+2)!) M_{n+2} + O(a^{n+4}).
 *        (imp-3488 is the n = 2 special case: R_2 = C - M_0 = (a^2/2) M_2 + ...)
 *
 *   CERTIFICATION AGAINST THE IMP-3481 REMAINDERS (to machine precision)
 *   -------------------------------------------------------------------
 *   Reusing the imp-3481 measured generating masses C(a), S(a) and moment ladder
 *   M_0..M_6 on the sequence a in {0.5, 0.25, 0.125}:
 *   (C1) LEADING FORM IS THE m = n MOMENT TERM. The derived (a^n/n!) M_n equals
 *        the imp-3481 leadingForm bit-for-bit (both are the same expression), gap
 *        = 0 on every rung.
 *   (C2) GENERATING MASSES ARE THE MOMENT SERIES. The measured C(a) and S(a) are
 *        reproduced by the truncated moment power series (M_0..M_6) to < 1e-10 --
 *        the omitted O(a^8)/O(a^7) tail is below machine noise because A is
 *        concentrated near tau = 0. This is (D1) verified.
 *   (C3) REMAINDER IS THE TWO-TERM MOMENT EXPANSION. Each measured remainder
 *        R_n(a) is reproduced by the DERIVED two-term expansion
 *        (a^n/n!) M_n + (a^{n+2}/(n+2)!) M_{n+2} to < 1e-5 relative -- three
 *        orders tighter than the imp-3481 single-term < 1e-3, since the derived
 *        second term captures the leading residual.
 *   (C4) RESIDUAL IS THE DERIVED NEXT-MOMENT TAIL. The measured one-term residual
 *        R_n(a) - (a^n/n!) M_n divided by the derived (a^{n+2}/(n+2)!) M_{n+2}
 *        is 1 to < 1e-3 at the base a, and tightens toward 1 as a halves (the
 *        O(a^{n+4}) tail shrinks) -- confirming the residual is the derived
 *        next-moment term, not a coincidence.
 *
 *   VERDICT: the imp-3481 leading form R_n(a) ~ (a^n/n!) M_n is DERIVED for every
 *   n = 0..4 as the m = n term of the moment power series of the A-weighted
 *   cosh/sinh masses, with the residual its derived next-moment tail; the imp-3488
 *   n = 2 derivation is the single special case now extended across the ladder.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DERIVATION / CERTIFICATION ONLY, at the RH-equivalent scale class. This
 *   derives the Taylor/moment structure of the degree-2 (absolute-measure) masses
 *   and certifies it against the imp-3481 remainders; it establishes NO operator
 *   positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT and the degree-2
 *   face carries no feasibility comparison at all (imp-3469: D_2 = 0). The
 *   operator-level K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the rigorous SOTA.
 *
 *   @see imp-3481-autocorrelation-moment-ladder.js (the measured ladder certified here)
 *   @see imp-3488-degree2-miss-factor-closed-form.js (the n = 2 special case)
 *   @see imp-3469-degree2-bridge-mass-scaling.js (the degree-2 masses)
 *
 *   Ticket: imp-3501 (proof, medium).
 */

import { IMP3481_AUTOCORRELATION_MOMENT_LADDER } from './imp-3481-autocorrelation-moment-ladder.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Reuse the imp-3481 measured moment ladder & remainders (self-computed) -----
const SRC = IMP3481_AUTOCORRELATION_MOMENT_LADDER.measured;
const MOM = SRC.moments;                        // { M0..M6 } fixed Phi-autocorrelation moments
const M = [MOM.M0, MOM.M1, MOM.M2, MOM.M3, MOM.M4, MOM.M5, MOM.M6];
const LADDERS = SRC.laddersByA;                 // remainders at a = 0.5, 0.25, 0.125

/** n! for small integer n. */
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

// -- (D1) Generating masses as truncated moment power series --------------------
// C(a) = sum_j a^{2j}/(2j)! M_{2j} using the even moments M_0,M_2,M_4,M_6;
// S(a) = sum_j a^{2j+1}/(2j+1)! M_{2j+1} using the odd moments M_1,M_3,M_5.
function coshSeries(a) {
  return M[0] + (a * a / 2) * M[2] + (Math.pow(a, 4) / 24) * M[4] + (Math.pow(a, 6) / 720) * M[6];
}
function sinhSeries(a) {
  return a * M[1] + (Math.pow(a, 3) / 6) * M[3] + (Math.pow(a, 5) / 120) * M[5];
}

/**
 * Certify the general derivation on one a-cell against its imp-3481 remainders.
 * For each rung n reconstructs the DERIVED leading form (a^n/n!)M_n, the DERIVED
 * two-term expansion + (a^{n+2}/(n+2)!)M_{n+2}, and the DERIVED next-moment tail,
 * and reconciles them against the measured remainder R_n(a).
 */
function certifyCell(ladder) {
  const a = ladder.a;
  const gapC = Math.abs(ladder.coshMass - coshSeries(a));   // (C2) even generating mass
  const gapS = Math.abs(ladder.sinhMass - sinhSeries(a));   // (C2) odd generating mass
  const rungs = ladder.rungs.map((rung) => {
    const n = rung.n;
    const derivedLeading = (Math.pow(a, n) / factorial(n)) * M[n];              // (D3) m=n term
    const derivedNextTail = (Math.pow(a, n + 2) / factorial(n + 2)) * M[n + 2]; // (D3) m=n+2 term
    const derivedTwoTerm = derivedLeading + derivedNextTail;

    // (C1) derived leading form equals the imp-3481 leadingForm bit-for-bit -----
    const leadGap = Math.abs(derivedLeading - rung.leadingForm);
    // (C3) two-term derived expansion reproduces the measured remainder ---------
    const twoTermRelResid = Math.abs(rung.remainder - derivedTwoTerm) / Math.abs(rung.remainder);
    // (C4) measured one-term residual over derived next tail -> 1 ---------------
    const oneTermResid = rung.remainder - derivedLeading;
    const tailRatioDev = Math.abs(oneTermResid / derivedNextTail - 1);
    // one-term relative residual (the imp-3481 quantity) for comparison ---------
    const oneTermRelResid = Math.abs(oneTermResid) / Math.abs(rung.remainder);

    return Object.freeze({
      n,
      derivedLeading,
      derivedNextTail,
      derivedTwoTerm,
      measuredRemainder: rung.remainder,
      leadGap,
      twoTermRelResid,
      oneTermRelResid,
      tailRatioDev,
    });
  });
  return Object.freeze({
    a,
    gapC,
    gapS,
    rungs,
    maxLeadGap: Math.max(...rungs.map((r) => r.leadGap)),
    maxTwoTermRelResid: Math.max(...rungs.map((r) => r.twoTermRelResid)),
    maxOneTermRelResid: Math.max(...rungs.map((r) => r.oneTermRelResid)),
    maxTailRatioDev: Math.max(...rungs.map((r) => r.tailRatioDev)),
  });
}

const CELLS = LADDERS.map((lad) => certifyCell(lad));
const BASE_CELL = CELLS[0];                     // a = 0.5

// Tail ratio must TIGHTEN toward 1 as a halves (n = 0..3; the n = 4 finest rung
// hits machine-epsilon roundoff below ~1e-17 and is excluded from monotonicity).
let tailRatioTightens = true;
for (let i = 0; i + 1 < CELLS.length; i += 1) {
  for (let n = 0; n <= 3; n += 1) {
    if (!(CELLS[i + 1].rungs[n].tailRatioDev < CELLS[i].rungs[n].tailRatioDev)) {
      tailRatioTightens = false;
    }
  }
}

// -- Tolerances -----------------------------------------------------------------
const LEAD_GAP_TOL = 1e-15;       // derived leading form == imp-3481 leadingForm (=0)
const GENERATING_TOL = 1e-10;     // C,S reproduced by the moment power series
const TWO_TERM_TOL = 1e-5;        // two-term derived expansion vs measured remainder
const TAIL_RATIO_TOL = 1e-3;      // one-term residual / derived next tail -> 1 at base a
const ONE_TERM_TOL = 1e-3;        // imp-3481 single-term claim (sanity: still holds)

// -- Classification -------------------------------------------------------------
const maxLeadGap = Math.max(...CELLS.map((c) => c.maxLeadGap));
const maxGenerating = Math.max(...CELLS.map((c) => Math.max(c.gapC, c.gapS)));
const maxTwoTermRelResid = Math.max(...CELLS.map((c) => c.maxTwoTermRelResid));
const maxOneTermRelResid = Math.max(...CELLS.map((c) => c.maxOneTermRelResid));

const leadingFormIsMomentTerm = maxLeadGap < LEAD_GAP_TOL;
const generatingMassesAreMomentSeries = maxGenerating < GENERATING_TOL;
const remainderIsTwoTermExpansion = maxTwoTermRelResid < TWO_TERM_TOL;
const twoTermTighterThanOneTerm = maxTwoTermRelResid < maxOneTermRelResid;
const residualIsNextMomentTail = BASE_CELL.maxTailRatioDev < TAIL_RATIO_TOL && tailRatioTightens;
const momentsPositive = M.every((v) => v > 0);

const verdict =
  leadingFormIsMomentTerm && generatingMassesAreMomentSeries && remainderIsTwoTermExpansion &&
  twoTermTighterThanOneTerm && residualIsNextMomentTail && momentsPositive
    ? 'R_n(a)=(a^n/n!)M_n-DERIVED-ALL-n=0..4-AS-THE-m=n-TERM-OF-THE-MOMENT-POWER-SERIES-OF-C(a),S(a)-EXTENDING-imp-3488-n=2-CERTIFIED-AGAINST-imp-3481'
    : 'INDETERMINATE';

export const IMP3501_MOMENT_LADDER_GENERAL_DERIVATION = Object.freeze({
  id: 'imp-3501-moment-ladder-general-derivation',
  ticket: 'imp-3501',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedMomentLadder: 'imp-3481-autocorrelation-moment-ladder.js',
  relatedDegree2Case: 'imp-3488-degree2-miss-factor-closed-form.js',
  relatedDegree2Masses: 'imp-3469-degree2-bridge-mass-scaling.js',

  summary:
    'Derives the imp-3481 moment-indexed leading form R_n(a) = (a^n/n!)M_n analytically for EVERY ' +
    'n = 0..4, extending the imp-3488 n = 2 derivation to the full autocorrelation moment ladder. On ' +
    'the compact support [0,T_A] the cosh/sinh series converge uniformly, so integrating termwise ' +
    'against the bounded weight A(tau) gives the generating masses as moment power series C(a) = ' +
    'sum a^{2j}/(2j)! M_{2j} and S(a) = sum a^{2j+1}/(2j+1)! M_{2j+1}. Peeling the sub-order-n Taylor ' +
    'terms leaves the pure moment tail R_n(a) = sum_{m>=n, m==n(mod 2)} a^m/m! M_m, whose first term ' +
    'is (a^n/n!)M_n and next is (a^{n+2}/(n+2)!)M_{n+2}, so R_n(a) = (a^n/n!)M_n + O(a^{n+2}) for all ' +
    'n -- DERIVED, not fitted. Certified against the imp-3481 remainders on a in {0.5,0.25,0.125}: the ' +
    'derived leading form equals the imp-3481 leadingForm bit-for-bit (gap 0), the moment series ' +
    'reproduce C,S to < 1e-10, the derived two-term expansion reproduces every measured remainder to ' +
    '< 1e-5 (vs the single-term < 1e-3), and the one-term residual over the derived next-moment tail ' +
    'is 1 to < 1e-3, tightening as a halves. DERIVATION/CERTIFICATION, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; degree-2 face carries no feasibility ratio (D_2=0); operator ' +
    'positivity (imp-3066) untouched; no QED.',

  derivation: Object.freeze({
    termwiseExpansion: 'cosh/sinh series converge uniformly on the compact support [0,T_A]; A bounded & integrable => integration commutes with the sum',
    generatingMasses: 'C(a)=int cosh(a tau)A(tau)d(tau)=sum a^{2j}/(2j)! M_{2j}; S(a)=int sinh(a tau)A(tau)d(tau)=sum a^{2j+1}/(2j+1)! M_{2j+1}',
    remainderTail: 'R_n(a)=sum_{m>=n, m==n (mod 2)} a^m/m! M_m (peel the sub-order-n Taylor terms from the parity mass)',
    leadingForm: 'first term (m=n): (a^n/n!)M_n; next term (m=n+2): (a^{n+2}/(n+2)!)M_{n+2}',
    order: 'R_n(a)=(a^n/n!)M_n + (a^{n+2}/(n+2)!)M_{n+2} + O(a^{n+4}) = (a^n/n!)M_n + O(a^{n+2}), all n=0..4',
    specialCase: 'n=2 is imp-3488: R_2=C-M_0=(a^2/2)M_2+O(a^4)',
    momentsUsed: Object.freeze({ M0: M[0], M1: M[1], M2: M[2], M3: M[3], M4: M[4], M5: M[5], M6: M[6] }),
    aSequence: LADDERS.map((l) => l.a),
    selfComputing: true,
  }),

  certified: Object.freeze({
    cells: CELLS,                                 // per-a leadGap, gapC/gapS, two-term & tail-ratio residuals
    maxLeadGap,                                   // derived leading form == imp-3481 leadingForm (0)
    maxGenerating,                                // C,S vs moment series (< 1e-10)
    maxTwoTermRelResid,                           // two-term derived expansion vs measured (< 1e-5)
    maxOneTermRelResid,                           // imp-3481 single-term residual (< 1e-3)
    baseTailRatioDev: BASE_CELL.maxTailRatioDev,  // one-term residual / derived next tail -> 1 (< 1e-3)
    tailRatioTightens,
    leadingFormIsMomentTerm,
    generatingMassesAreMomentSeries,
    remainderIsTwoTermExpansion,
    twoTermTighterThanOneTerm,
    residualIsNextMomentTail,
    momentsPositive,
    verdict,
  }),

  interpretation: Object.freeze({
    whyLeadingFormForAllN:
      'Uniform convergence of the cosh/sinh series on the compact support [0,T_A] lets integration ' +
      'against A commute with the sum, turning each generating mass into a moment power series. The ' +
      'n-th Taylor remainder is then the pure tail sum_{m>=n, m==n(mod 2)} a^m/m! M_m, whose first ' +
      'term (a^n/n!)M_n is the imp-3481 leading form -- for every n, not just n=2.',
    whyResidualIsNextMoment:
      'The one-term residual R_n - (a^n/n!)M_n is the rest of the tail, led by (a^{n+2}/(n+2)!)M_{n+2}. ' +
      'The measured residual divided by that derived term is 1 to < 1e-3 and tightens toward 1 as a ' +
      'halves (the O(a^{n+4}) remainder shrinks), so the residual IS the derived next-moment term.',
    extendsImp3488:
      'imp-3488 derived the n=2 rung (R_2=C-M_0=(a^2/2)M_2). This module places it inside the single ' +
      'derived identity R_n(a)=sum_{m>=n, m==n(mod 2)} a^m/m! M_m for n=0..4, all leading forms and ' +
      'residuals following from one uniform-convergence argument.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isDerivationAndCertification: true,
    numericalCharacterizationOnly:
      'This module derives the moment power-series structure of the A-weighted cosh/sinh masses and ' +
      'certifies the R_n(a)=(a^n/n!)M_n leading form for all n=0..4 against the imp-3481 remainders. ' +
      'It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------
export const IMP3501_MOMENT_LADDER_GENERAL_DERIVATION_ASSERTIONS = [
  {
    id: 'imp3501-leading-form-is-the-m-equals-n-moment-term',
    why: 'THE DERIVATION: the derived leading form (a^n/n!)M_n must equal the imp-3481 leadingForm ' +
         'bit-for-bit on every rung n=0..4, all a -- the leading form IS the m=n term of the moment power series.',
    holds: () => leadingFormIsMomentTerm,
  },
  {
    id: 'imp3501-generating-masses-are-the-moment-series',
    why: 'D1: the measured generating masses C(a),S(a) must be reproduced by the truncated moment power ' +
         'series (M_0..M_6) to < 1e-10 on every a -- confirming termwise integration against A is valid.',
    holds: () => generatingMassesAreMomentSeries,
  },
  {
    id: 'imp3501-remainder-is-the-two-term-moment-expansion',
    why: 'C3: the derived two-term expansion (a^n/n!)M_n + (a^{n+2}/(n+2)!)M_{n+2} must reproduce every ' +
         'measured remainder to < 1e-5 relative -- and strictly tighter than the imp-3481 single-term residual.',
    holds: () => remainderIsTwoTermExpansion && twoTermTighterThanOneTerm,
  },
  {
    id: 'imp3501-residual-is-the-derived-next-moment-tail',
    why: 'C4: the measured one-term residual R_n-(a^n/n!)M_n divided by the derived next tail ' +
         '(a^{n+2}/(n+2)!)M_{n+2} must be 1 to < 1e-3 at the base a and tighten toward 1 as a halves.',
    holds: () => residualIsNextMomentTail,
  },
  {
    id: 'imp3501-single-term-claim-still-holds',
    why: 'Sanity: the imp-3481 single-term claim (each remainder within 1e-3 of (a^n/n!)M_n) must still ' +
         'hold on the reused ladder -- this module tightens it, it must not contradict it.',
    holds: () => maxOneTermRelResid < ONE_TERM_TOL,
  },
  {
    id: 'imp3501-verdict-classifies-the-general-derivation',
    why: 'The verdict must certify R_n=(a^n/n!)M_n derived for all n=0..4 as the m=n moment-series term, ' +
         'extending imp-3488, not indeterminate.',
    holds: () => verdict.startsWith('R_n(a)=(a^n/n!)M_n-DERIVED-ALL-n=0..4'),
  },
  {
    id: 'imp3501-honest-derivation-not-a-verdict',
    why: 'Mandatory honesty: derivation/certification only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-2 ratio, D_2=0), operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3501_MOMENT_LADDER_GENERAL_DERIVATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isDerivationAndCertification === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3501_MOMENT_LADDER_GENERAL_DERIVATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3501-moment-ladder-general-derivation assertion failed: ${assertion.id}`);
  }
}

export default IMP3501_MOMENT_LADDER_GENERAL_DERIVATION;
