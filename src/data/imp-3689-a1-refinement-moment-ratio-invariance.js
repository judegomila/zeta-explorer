/**
 * @module imp-3689-a1-refinement-moment-ratio-invariance
 * @fileoverview imp-3689 -- ASSESS whether the imp-3665 ~30% refinement of the A-weight
 *   magnitude A(1) (converged ~2.1e-75 vs the imp-3646-quoted ~3e-75) shifts the imp-3646
 *   log-divergent moment-ratio prefactor C_n ~ (ln n)^2/(16 n^2) and the bias law
 *   D_n = C_(n+2) - C_n numerically, or is confined to the single autocorrelation magnitude.
 *
 *   THE QUESTION imp-3665 LEFT
 *   --------------------------
 *   imp-3665 independently confirmed the leading law A(tau) ~ exp(-pi e^{4 tau}) but
 *   CORRECTED imp-3646's quoted A(1) ~ 3e-75 to a converged ~2.1e-75: the imp-3646
 *   autocorrelation used a coarse n=1200 Simpson on [0,7] that under-resolves the sharp
 *   near-s=0 peak of Phi(s)Phi(s+tau). imp-3646's entire large-n story -- the
 *   log-divergent leading coefficient C_n ~ (ln n)^2/(16 n^2) and the negative shrinking
 *   bias coefficient D_n -- is built on the moment ratios Q_n = M_(n+2)/M_n with
 *   M_m = int_0^{T_A} tau^m A(tau) d(tau). Does the ~30% magnitude refinement propagate
 *   into those ratios and move the printed C_n / D_n, or does it CANCEL?
 *
 *   THE STRUCTURAL REASON IT SHOULD CANCEL
 *   --------------------------------------
 *   C_n and D_n are built ONLY from RATIOS of moments:
 *       C_n = M_(n+2)/((n+1)(n+2) M_n),   D_n = C_(n+2) - C_n.
 *   Any tau-INDEPENDENT rescaling of A(tau) cancels exactly in every ratio. The imp-3665
 *   correction is NOT tau-independent -- it is a grid-resolution refinement of the
 *   Phi(s)Phi(s+tau) inner peak -- but it is very nearly a uniform multiplicative shift of
 *   the whole A(tau) profile across the moment-dominant tau range (the Laplace saddle
 *   tau*(n) = (ln n)/4 sits in ~[0.27, 0.72] over n=3..18, where A is 4.5e-11..~e-40 and
 *   the grid effect is a smooth amplitude factor, not a shape distortion). So the ratios
 *   should be nearly invariant even though the magnitude moves ~30%.
 *
 *   MEASURED (self-computing; both grids on the SAME NM=1600 [0,T_A] moment reference)
 *   ----------------------------------------------------------------------------------
 *   COARSE = the exact imp-3646 autocorr (n=1200 Simpson on [0,7]);
 *   REFINED = the imp-3665-class autocorr (n=12000 Simpson on [0,12]; the underflow-to-0
 *   past tau~1.4 is HARMLESS for the moments, whose integrand tau^m A(tau) is already
 *   ~e-500 there and contributes nothing). The single-magnitude correction is reproduced:
 *       A(1): coarse ~3.01e-75  ->  refined ~2.09e-75   (a ~30% amplitude drop),
 *   yet the moment ratios barely move:
 *       n     Q_n rel shift     n^2 C_n (both, 4 dp)     D_n (both, 4 sig fig)
 *       3     -2.95e-6          0.0131                   -3.938e-4
 *       10    -8.12e-6          0.0608                   -9.582e-5
 *       18    -1.63e-5          0.1095                    (n>16: D_n needs M_22)
 *   The Q_n relative shift is ~3e-6..1.6e-5 at every rung -- roughly FOUR-TO-FIVE ORDERS
 *   OF MAGNITUDE smaller than the ~30% (3e-1) magnitude correction -- so n^2 C_n is
 *   unchanged to imp-3646's printed 4 dp (0.0131 -> 0.1095) and D_n is unchanged to its
 *   printed 4 sig figs at every rung. The bias law is preserved verbatim on the refined
 *   grid: D_n < 0 and |D_n| strictly decreasing (3.938e-4 -> 4.505e-5), n^2 C_n strictly
 *   increasing (the log-divergent (ln n)^2/(16 n^2) prefactor), Q_n strictly increasing.
 *
 *   VERDICT: the imp-3665 A(1) correction is CONFINED to the single autocorrelation
 *   magnitude. It does NOT shift the imp-3646 log-divergent prefactor C_n ~ (ln n)^2/
 *   (16 n^2) or the D_n bias law at the printed precision -- the ~30% amplitude effect
 *   cancels in the moment RATIOS to within ~1e-5. imp-3646's asymptotic conclusions stand
 *   unchanged on the refined grid.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / STABILITY-CHECK ONLY, at the RH-equivalent scale class. This confirms a
 *   ratio family is insensitive to a magnitude refinement of its shared weight; it
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT.
 *   The operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-3665-a-weight-superexp-decay-crosscheck.js (the A(1) correction under test)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (the C_n/D_n laws being stress-tested)
 *   @see imp-3581-remainder-tail-exponent-derivation.js (the closed C_n/D_n and bias law)
 *
 *   Ticket: imp-3689 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation
const PI = Math.PI;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686/imp-3646). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2) * Math.exp(-PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// The EXACT imp-3646 autocorr grid (coarse: n=1200 Simpson on [0,7]).
function autocorrCoarse(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}
// The imp-3665-class refined autocorr (n=12000 Simpson on [0,12]); the underflow-to-0
// past tau~1.4 is harmless for the moments (integrand ~e-500 there, contributes nothing).
function autocorrRefined(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 12, 12000);
}

// -- Moments M_0..M_20 on the SAME fixed NM=1600 [0,T_A] Simpson reference as imp-3646 --
const T_A = 6;
const NM = 1600;
const H_A = T_A / NM;
const MMAX = 20;

function momentsFrom(autocorr) {
  const A = [];
  for (let j = 0; j <= NM; j += 1) A.push(autocorr(j * H_A));
  const M = {};
  for (let m = 0; m <= MMAX; m += 1) {
    let sum = 0;
    for (let j = 0; j <= NM; j += 1) {
      const tau = j * H_A;
      const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
      sum += w * Math.pow(tau, m) * A[j];
    }
    M[m] = (sum * H_A) / 3;
  }
  return M;
}

const M_COARSE = momentsFrom(autocorrCoarse);
const M_REFINED = momentsFrom(autocorrRefined);

// -- The imp-3646 closed coefficients, evaluated on each moment set -------------------
function momentRatio(M, n) {
  return M[n + 2] / M[n];                        // Q_n = M_(n+2)/M_n
}
function leadingCoeff(M, n) {
  return M[n + 2] / ((n + 1) * (n + 2) * M[n]);  // C_n = Q_n/((n+1)(n+2))
}
function nextOrderCoeff(M, n) {
  return leadingCoeff(M, n + 2) - leadingCoeff(M, n);  // D_n = C_(n+2) - C_n
}

// -- The measured coarse-vs-refined rung table ---------------------------------------
const RUNGS = [];
for (let n = 3; n <= 18; n += 1) {
  const qc = momentRatio(M_COARSE, n);
  const qr = momentRatio(M_REFINED, n);
  const n2cc = n * n * leadingCoeff(M_COARSE, n);
  const n2cr = n * n * leadingCoeff(M_REFINED, n);
  const dc = n <= 16 ? nextOrderCoeff(M_COARSE, n) : null;   // D_n needs M_(n+4) <= M_20
  const dr = n <= 16 ? nextOrderCoeff(M_REFINED, n) : null;
  RUNGS.push(
    Object.freeze({
      n,
      qCoarse: qc,
      qRefined: qr,
      qRelShift: (qr - qc) / qc,                 // relative shift of Q_n (coarse -> refined)
      n2CoeffCoarse: n2cc,                        // n^2 C_n on the coarse grid
      n2CoeffRefined: n2cr,                       // n^2 C_n on the refined grid
      n2CoeffRelShift: (n2cr - n2cc) / n2cc,
      dCoarse: dc,                                // D_n = C_(n+2) - C_n (coarse)
      dRefined: dr,                               // D_n (refined)
      dRelShift: dc === null ? null : (dr - dc) / dc,
    })
  );
}

// -- The single-magnitude correction imp-3665 reported (reproduced here) --------------
const A1_COARSE = autocorrCoarse(1);             // ~3.01e-75 (imp-3646 coarse grid)
const A1_REFINED = autocorrRefined(1);           // ~2.09e-75 (imp-3665 converged)
const A1_RELATIVE_DROP = (A1_COARSE - A1_REFINED) / A1_COARSE;   // ~0.30

// -- Diagnostics ---------------------------------------------------------------------
function strictlyIncreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] <= vals[i - 1]) return false;
  return true;
}
function strictlyDecreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] >= vals[i - 1]) return false;
  return true;
}

const Q_REL_SHIFTS = RUNGS.map((r) => Math.abs(r.qRelShift));
const N2C_REL_SHIFTS = RUNGS.map((r) => Math.abs(r.n2CoeffRelShift));
const D_REL_SHIFTS = RUNGS.filter((r) => r.dRelShift !== null).map((r) => Math.abs(r.dRelShift));

const maxQRelShift = Math.max(...Q_REL_SHIFTS);
const maxN2CRelShift = Math.max(...N2C_REL_SHIFTS);
const maxDRelShift = Math.max(...D_REL_SHIFTS);

// The magnitude correction is real (~30%) but the ratio shifts are ~4-5 orders smaller.
const magnitudeCorrectionIsReal = A1_RELATIVE_DROP > 0.25 && A1_RELATIVE_DROP < 0.35;
const ratioShiftsAreNegligible = maxQRelShift < 1e-4 && maxN2CRelShift < 1e-4 && maxDRelShift < 1e-4;
const ratioShiftFarBelowMagnitude = maxQRelShift < A1_RELATIVE_DROP / 1e3;   // >=1000x smaller

// n^2 C_n unchanged to imp-3646's printed 4 dp at every rung.
const n2CoeffMatchesPrinted4dp = RUNGS.every(
  (r) => r.n2CoeffCoarse.toFixed(4) === r.n2CoeffRefined.toFixed(4)
);
// D_n unchanged to imp-3646's printed 4 significant figures at every rung.
function toSig4(x) {
  return x === 0 ? '0' : x.toExponential(3);
}
const dCoeffMatchesPrinted4sig = RUNGS.filter((r) => r.dRefined !== null).every(
  (r) => toSig4(r.dCoarse) === toSig4(r.dRefined)
);

// The imp-3646 qualitative laws survive verbatim on the REFINED grid.
const refinedQGrows = strictlyIncreasing(RUNGS.map((r) => r.qRefined));
const refinedN2CGrows = strictlyIncreasing(RUNGS.map((r) => r.n2CoeffRefined));
const refinedDAllNegative = RUNGS.filter((r) => r.dRefined !== null).every((r) => r.dRefined < 0);
const refinedDMagnitudeShrinks = strictlyDecreasing(
  RUNGS.filter((r) => r.dRefined !== null).map((r) => Math.abs(r.dRefined))
);
const refinedLawsIntact =
  refinedQGrows && refinedN2CGrows && refinedDAllNegative && refinedDMagnitudeShrinks;

const verdict =
  magnitudeCorrectionIsReal &&
  ratioShiftsAreNegligible &&
  ratioShiftFarBelowMagnitude &&
  n2CoeffMatchesPrinted4dp &&
  dCoeffMatchesPrinted4sig &&
  refinedLawsIntact
    ? 'A(1)-30pct-REFINEMENT-CONFINED-TO-SINGLE-MAGNITUDE:-MOMENT-RATIOS-Q_n-SHIFT-<=1.6e-5-(~4-5-ORDERS-BELOW-30pct)-SO-C_n~(ln n)^2/(16 n^2)-AND-D_n-BIAS-LAW-UNCHANGED-AT-PRINTED-PRECISION-(n^2 C_n-4dp,-D_n-4sig)-ON-THE-REFINED-GRID'
    : 'INDETERMINATE';

export const IMP3689_A1_REFINEMENT_MOMENT_RATIO_INVARIANCE = Object.freeze({
  id: 'imp-3689-a1-refinement-moment-ratio-invariance',
  ticket: 'imp-3689',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  correctionUnderTest: 'imp-3665-a-weight-superexp-decay-crosscheck.js',
  lawsUnderStressTest: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',
  relatedDerivation: 'imp-3581-remainder-tail-exponent-derivation.js',

  summary:
    'ASSESSES whether the imp-3665 ~30% refinement of the A-weight magnitude A(1) (converged ~2.1e-75 vs imp-3646-quoted ' +
    '~3e-75) shifts the imp-3646 log-divergent moment-ratio prefactor C_n ~ (ln n)^2/(16 n^2) and the bias law ' +
    'D_n = C_(n+2)-C_n, or is confined to the single autocorrelation magnitude. Recomputes the moment ratios Q_n = ' +
    'M_(n+2)/M_n on BOTH the exact imp-3646 coarse autocorr (n=1200 Simpson [0,7]) and an imp-3665-class refined autocorr ' +
    '(n=12000 [0,12]) over the SAME NM=1600 [0,T_A] moment reference. RESULT (confirming/stabilising): the single-magnitude ' +
    'correction is reproduced (A(1): 3.01e-75 -> 2.09e-75, ~30% drop) but the moment RATIOS barely move -- |Q_n| relative ' +
    'shift is ~3e-6..1.6e-5 at every rung n=3..18, roughly 4-5 ORDERS OF MAGNITUDE below the ~30% magnitude correction. ' +
    'Consequently n^2 C_n is unchanged to imp-3646 printed 4 dp (0.0131 -> 0.1095) and D_n unchanged to its printed 4 sig ' +
    'figs at every rung, and the qualitative laws survive verbatim on the refined grid (Q_n and n^2 C_n strictly increasing, ' +
    'D_n < 0 and |D_n| strictly decreasing). VERDICT: the A(1) correction is CONFINED to the single autocorrelation ' +
    'magnitude and does NOT shift the C_n ~ (ln n)^2/(16 n^2) prefactor or the D_n bias law at printed precision -- the ~30% ' +
    'effect cancels in the moment ratios to ~1e-5, and imp-3646 asymptotics stand. MEASUREMENT/STABILITY-CHECK, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict, no QED.',

  method: Object.freeze({
    ratioStructure: 'C_n = M_(n+2)/((n+1)(n+2) M_n) and D_n = C_(n+2) - C_n depend ONLY on moment ratios; a tau-independent rescaling of A cancels exactly',
    coarseGrid: 'imp-3646 autocorr: A(tau) = int_0^7 Phi(s)Phi(s+tau) ds by n=1200 composite Simpson (under-resolves near-s=0 peak)',
    refinedGrid: 'imp-3665-class autocorr: n=12000 Simpson on [0,12]; underflow-to-0 past tau~1.4 is harmless (integrand ~e-500, contributes nothing to the moments)',
    sharedMomentReference: 'both grids feed the SAME NM=1600 [0,T_A=6] Simpson moment quadrature as imp-3646',
    saddleRange: 'the moment-dominant Laplace saddle tau*(n)=(ln n)/4 sits in ~[0.27,0.72] over n=3..18, where the grid effect is a smooth amplitude factor',
    selfComputing: true,
  }),

  measured: Object.freeze({
    a1Coarse: A1_COARSE,
    a1Refined: A1_REFINED,
    a1RelativeDrop: A1_RELATIVE_DROP,            // ~0.30 (the single-magnitude correction)
    maxQRelShift,                                // ~1.6e-5 (moment-ratio shift, max over rungs)
    maxN2CRelShift,
    maxDRelShift,
    rungs: Object.freeze(RUNGS),
    magnitudeCorrectionIsReal,
    ratioShiftsAreNegligible,
    ratioShiftFarBelowMagnitude,
    n2CoeffMatchesPrinted4dp,
    dCoeffMatchesPrinted4sig,
    refinedQGrows,
    refinedN2CGrows,
    refinedDAllNegative,
    refinedDMagnitudeShrinks,
    refinedLawsIntact,
    verdict,
  }),

  interpretation: Object.freeze({
    correctionIsRealButLocal:
      'The imp-3665 correction is genuine: on the coarse imp-3646 grid A(1) ~ 3.01e-75, on the refined grid ~2.09e-75, ' +
      'a ~30% amplitude drop from resolving the sharp near-s=0 peak of Phi(s)Phi(s+1). But this is a magnitude effect on a ' +
      'single autocorrelation value, not a distortion of the A(tau) SHAPE across the moment-dominant range.',
    ratiosCancelTheCorrection:
      'C_n and D_n are ratios of moments, and the grid refinement is very nearly a uniform multiplicative amplitude factor ' +
      'over the saddle band tau in ~[0.27,0.72]. So it cancels: the moment ratio Q_n = M_(n+2)/M_n shifts by only ' +
      '~3e-6..1.6e-5 across n=3..18 -- 4-5 orders of magnitude below the 30% magnitude correction. n^2 C_n is unchanged to ' +
      'the printed 4 dp and D_n to its printed 4 sig figs at every rung.',
    lawsUnchanged:
      'The imp-3646 asymptotic conclusions are UNCHANGED on the refined grid: Q_n and n^2 C_n stay strictly increasing (the ' +
      'log-divergent (ln n)^2/(16 n^2) prefactor, NOT a fixed b^2/n^2), and D_n stays negative with |D_n| strictly ' +
      'decreasing (the genuine bias-decay law). The A(1) refinement neither creates a finite Q_n ceiling nor alters the ' +
      'D_n -> 0 rate at printed precision.',
    scopeOfCorrection:
      'ANSWER to the ticket: the imp-3665 A(1) refinement is CONFINED to the single autocorrelation magnitude. It does not ' +
      'propagate into the imp-3646 log-divergent moment-ratio prefactor or the D_n bias law at the printed precision.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Confirms a coefficient family (C_n, D_n), being built from moment RATIOS, is insensitive to a ~30% magnitude ' +
      'refinement of its shared autocorrelation weight. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3689_A1_REFINEMENT_MOMENT_RATIO_INVARIANCE_ASSERTIONS = [
  {
    id: 'imp3689-a1-magnitude-correction-is-real-30pct',
    why: 'The imp-3665 correction is reproduced: A(1) drops from the coarse imp-3646 grid (~3.01e-75) to the refined grid ' +
         '(~2.09e-75), a ~30% amplitude refinement -- the single-magnitude effect under assessment.',
    holds: () => magnitudeCorrectionIsReal,
  },
  {
    id: 'imp3689-moment-ratio-shift-negligible-below-1e-4',
    why: 'THE KEY MEASUREMENT: the moment ratio Q_n = M_(n+2)/M_n, and hence n^2 C_n and D_n, shift by < 1e-4 relative at ' +
         'every rung when the autocorr grid is refined -- the ~30% magnitude correction cancels in the ratios.',
    holds: () => ratioShiftsAreNegligible,
  },
  {
    id: 'imp3689-ratio-shift-4-5-orders-below-magnitude',
    why: 'The maximum moment-ratio shift (~1.6e-5) is at least 1000x smaller than the ~30% (3e-1) magnitude correction, ' +
         'quantifying that the refinement is confined to the single autocorrelation magnitude.',
    holds: () => ratioShiftFarBelowMagnitude,
  },
  {
    id: 'imp3689-n2-leading-coeff-unchanged-printed-4dp',
    why: 'n^2 C_n is identical to imp-3646 printed 4 dp (0.0131 -> 0.1095) on the coarse and refined grids at every rung: ' +
         'the log-divergent prefactor is unmoved at printed precision.',
    holds: () => n2CoeffMatchesPrinted4dp,
  },
  {
    id: 'imp3689-next-order-coeff-unchanged-printed-4sig',
    why: 'D_n = C_(n+2) - C_n is identical to imp-3646 printed 4 significant figures on both grids at every rung n=3..16: ' +
         'the bias law is unmoved at printed precision.',
    holds: () => dCoeffMatchesPrinted4sig,
  },
  {
    id: 'imp3689-imp3646-laws-intact-on-refined-grid',
    why: 'The imp-3646 qualitative laws survive verbatim on the refined grid: Q_n and n^2 C_n strictly increasing ' +
         '(log-divergent (ln n)^2/(16 n^2), no fixed ceiling), D_n < 0 with |D_n| strictly decreasing (the bias-decay law).',
    holds: () => refinedLawsIntact,
  },
  {
    id: 'imp3689-verdict-confined-to-single-magnitude',
    why: 'The classified verdict must record that the A(1) correction is confined to the single autocorrelation magnitude ' +
         'and leaves C_n ~ (ln n)^2/(16 n^2) and the D_n bias law unchanged at printed precision, not indeterminate.',
    holds: () =>
      verdict ===
      'A(1)-30pct-REFINEMENT-CONFINED-TO-SINGLE-MAGNITUDE:-MOMENT-RATIOS-Q_n-SHIFT-<=1.6e-5-(~4-5-ORDERS-BELOW-30pct)-SO-C_n~(ln n)^2/(16 n^2)-AND-D_n-BIAS-LAW-UNCHANGED-AT-PRINTED-PRECISION-(n^2 C_n-4dp,-D_n-4sig)-ON-THE-REFINED-GRID',
  },
  {
    id: 'imp3689-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/stability-check only, mass-feasibility necessary-but-not-sufficient, operator ' +
         'positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3689_A1_REFINEMENT_MOMENT_RATIO_INVARIANCE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3689_A1_REFINEMENT_MOMENT_RATIO_INVARIANCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3689-a1-refinement-moment-ratio-invariance assertion failed: ${assertion.id}`);
  }
}

export default IMP3689_A1_REFINEMENT_MOMENT_RATIO_INVARIANCE;
