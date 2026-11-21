/**
 * @module imp-96731-route-m-trace-ceiling-tightening-assessment
 *
 * imp-96731 (numerical, ASSESSMENT ONLY): the imp-96713 residual sub-gap records that only
 * the trace-domination lower ceiling T = 2.594e7 (imp-96548) is a RIGOROUS lower bound on the
 * Route M lam_max conditioning ceiling, while the Frobenius F = 3.775e7 (imp-96694) and the
 * measured M = 4.109e7 (imp-96443) ceilings are ~four-decade log-fit extrapolations, giving
 * F/T = 1.4555 (the rigorous->fit leg carries most of the M/T = 1.5842 total). This ticket
 * asks the named lever: can the trace-domination bound itself be SHARPENED to raise T toward F
 * and shrink the rigorous leg? Report any improved rigorous lower ceiling, or a clear
 * obstruction to tightening.
 *
 * This changes NO bound, establishes no operator positivity, makes no RH claim. It is a
 * re-analysis of the imp-96548 / imp-96667 / imp-96694 / imp-96708 / imp-96713 record and a
 * localisation of exactly where the rigor gap lives. NO QED.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the trace is NOT the tightest rigorous per-N upper bound; Frobenius already is.
 * -------------------------------------------------------------------------------
 * For the SPD Vasyunin Gram G_N the top eigenvalue is the operator (Schatten-infinity) norm,
 * and the Schatten-p norms decrease in p: lam_max = ||G||_inf <= ... <= ||G||_2 = ||G||_F <=
 * ||G||_1 = trace. So the Frobenius bound lam_max <= ||G||_F = sqrt(Sum_hk G_hk^2) is a
 * RIGOROUS unconditional upper bound STRICTLY TIGHTER than the trace at every finite N, and the
 * Wolkowicz-Styan two-moment bound is tighter still. At the top rebuilt rung N=12000 the exact
 * matrix quantities are ||G||_F = 7.005027 vs trace = 12.568692, i.e. the trace overstates the
 * best rigorous per-N bound by a factor 1.7942 (imp-96694 rows). So the "sharper rigorous upper
 * bound on lam_max" the ticket asks for ALREADY EXISTS and is elementary -- it is the Frobenius
 * / Wolkowicz-Styan moment bound, not the trace.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the F/T = 1.4555 gap is an EXTRAPOLATION-rigor gap, NOT a bound-mechanism gap.
 * -------------------------------------------------------------------------------
 * The trace ceiling T is labelled "rigorous" for one reason only: the trace has a proven
 * closed-form asymptotic trace(G_N) = I(1,1) H_N = I(1,1)(log N + gamma) + O(1/N), so its
 * extrapolation to the breakdown scale N ~ 1e7 is rigorous. The Frobenius bound is tighter at
 * every COMPUTED N (through N=12000) but its extrapolation to N ~ 3.78e7 rests on a log-fit
 * with no proven asymptotic -- that, and only that, is why F is labelled "fit". Because
 * lam_max enters cond# = lam_max/lam_min only linearly and a SMALLER upper bound on lam_max
 * pushes the cond# = 1/eps breakdown scale further out, a rigorous closed-form asymptotic for
 * ||G||_F of the measured shape would raise the rigorous LOWER ceiling from T = 2.594e7 toward
 * F = 3.775e7. The whole F/T = 1.4555 leg is therefore recoverable in principle; the missing
 * ingredient is a proven asymptotic for the Frobenius sum, not a better inequality.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the obstruction is ONE named, strictly one-sided open piece.
 * -------------------------------------------------------------------------------
 * imp-96667 already reduces the Frobenius second moment exactly and handles two of its three
 * pieces RIGOROUSLY: ||G_N||_F^2 = D(N) + B(N) + Int(N) with the diagonal D(N) -> I(1,1)^2
 * zeta(2) = 2.614240 (exact) and the border B(N) -> ~8.08 (a convergent constant, via the
 * rigorous cotangent asymptotic I(1,b) = (1/2)log b + (C+1/2) + o(1)). imp-96708 then shows the
 * interior series Int(N) DIVERGES (genuine log-N growth, not saturation). The ONLY residual
 * obstruction to a rigorous Frobenius asymptotic -- and hence to raising T toward F -- is a
 * rigorous handle on the interior second-moment leading coefficient, the mean-square of the
 * two-variable Vasyunin coprime coefficient I(a,b) over coprime a,b>=2 (the Bettin-Conrey
 * cotangent second moment). Crucially, raising the rigorous LOWER ceiling needs only a
 * one-sided UPPER bound Int(N) <= s* log N, NOT the exact coefficient: this is STRICTLY WEAKER
 * than the imp-96548 off-diagonal-mass / Szego sub-gap (which needs the exact spectral
 * coefficient 0.3526) and weaker than pinning the interior slope exactly. The minimal missing
 * lemma is a rigorous one-sided bound on the two-variable cotangent sum V(a,b) for general
 * coprime a,b>=2 (the a=1 border case is already rigorous in imp-96667); until that exists no
 * improved rigorous lower ceiling can be POSTED, so T = 2.594e7 stays the rigorously-anchored
 * value today.
 *
 * -------------------------------------------------------------------------------
 * FINDING 4 -- how much the lever would buy if that upper bound were proven.
 * -------------------------------------------------------------------------------
 * If the interior upper asymptotic were proven, the rigorous lower ceiling would rise from
 * T = 2.594e7 to ~3.78e7 (log-linear best case, = F) or ~3.98e7 (the imp-96667 sqrt(s log N)
 * functional form with the measured s = 5.8048), landing within ~3% of the measured composed
 * M = 4.109e7. In log-ceiling terms the F/T leg is a fraction log(F/T)/log(M/T) = 0.8158 of the
 * total rigorous->measured M/T gap (linear (F-T)/(M-T) = 0.7797), so proving it would close
 * ~78-82% of the trace->measured conditioning-ceiling gap, leaving only the intrinsic
 * fit->measured leg M/F = 1.0884 (the Frobenius-vs-spectral slack that no moment bound removes).
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The named lever is REAL but the sharpening is NOT available as a bound-mechanism upgrade: a
 * strictly tighter rigorous per-N upper bound on lam_max already exists (Frobenius / WS, ~1.79x
 * below the trace at N=12000), so the trace is not the tightest rigorous bound -- it is only the
 * one with a proven closed-form asymptotic. The F/T = 1.4555 leg is an EXTRAPOLATION-rigor gap:
 * closing it requires a rigorous closed-form asymptotic for the imp-96667 interior second moment
 * Int(N), specifically a one-sided UPPER bound Int(N) <= s* log N, which is strictly weaker than
 * the imp-96548 spectral sub-gap and reduces to a rigorous one-sided bound on the two-variable
 * Vasyunin cotangent sum V(a,b) for coprime a,b>=2. No such bound is in the record, so NO improved
 * rigorous lower ceiling is posted; T = 2.594e7 remains the rigorous anchor. Were the bound
 * proven, T would rise to ~3.78-3.98e7, closing ~78-82% of the trace->measured gap. Assessment
 * only; changes no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (named): imp-96731-interior-second-moment-upper-bound -- a rigorous one-sided
 * upper asymptotic Int(N) <= s* log N for the imp-96667 interior second moment, reducing to a
 * rigorous one-sided bound on the two-variable Vasyunin cotangent sum V(a,b) (coprime a,b>=2).
 * It is strictly weaker than the imp-96548 off-diagonal Szego sub-gap and than the exact
 * interior slope; proving it raises the rigorous lower ceiling T -> ~3.78-3.98e7.
 *
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (trace bound + off-diagonal sub-gap)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (D exact, B convergent, interior open)
 * @see imp-96708-route-m-interior-second-moment-dichotomy.js (interior diverges -> genuine log growth)
 * @see imp-96694-route-m-majorant-ladder-above-9000.js (exact ||G||_F rows through N=12000; ceilings)
 * @see imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js (the T<F<M residual decomposition)
 *
 * Ticket: imp-96731 (numerical, opus-4-8, api-pool). Assessment only; NO QED.
 */

import { IMP96713_CEILINGS } from './imp-96713-route-m-conditioning-ceiling-decomposition-reaudit.js';
import { IMP96694_NEW_ROWS } from './imp-96694-route-m-majorant-ladder-above-9000.js';

// The three ceilings, imported from the imp-96713 re-audit (single source of truth).
const T = IMP96713_CEILINGS.trace.N; // 2.593728e7 (imp-96548 rigorous lower)
const F = IMP96713_CEILINGS.frobenius.N; // 3.775077e7 (imp-96694 Frobenius fit)
const M = IMP96713_CEILINGS.measured.N; // 4.108890e7 (imp-96443 measured composed)

// The top exact-Gram rung: ||G||_F is a rigorous per-N upper bound STRICTLY below the trace.
const TOP = IMP96694_NEW_ROWS[IMP96694_NEW_ROWS.length - 1]; // N=12000

// Finding 1: at every finite N the Frobenius bound is the tighter rigorous upper bound on lam_max.
export const IMP96731_PER_N_BOUND = Object.freeze({
  N: TOP.N, // 12000
  traceExact: TOP.trace, // 12.568692
  frobeniusExact: TOP.frobenius, // 7.005027412
  lamMaxMeasured: TOP.lamMax, // 6.242153271
  traceOverFrobenius: TOP.trace / TOP.frobenius, // ~1.7942 -- trace overstates the best rigorous bound
  frobeniusBelowTrace: TOP.frobenius < TOP.trace,
  frobeniusAboveLamMax: TOP.frobenius > TOP.lamMax, // still a valid (over-)estimate of lam_max
  note:
    'lam_max = ||G||_inf <= ||G||_F = ||G||_2 <= trace = ||G||_1 (Schatten norms decrease in p). ' +
    'The Frobenius / Wolkowicz-Styan two-moment bound is a rigorous per-N upper bound ~1.79x ' +
    'below the trace at N=12000: the trace is NOT the tightest rigorous bound available.',
});

// Finding 2/4: the F/T leg is an extrapolation-rigor gap; quantify what closing it would buy.
export const IMP96731_CEILING_LEG = Object.freeze({
  traceRigorousN: T, // 2.594e7
  frobeniusFitN: F, // 3.775e7
  measuredN: M, // 4.109e7
  frobeniusOverTrace: F / T, // ~1.4555 (the rigorous->fit leg)
  measuredOverFrobenius: M / F, // ~1.0884 (the intrinsic fit->measured leg)
  measuredOverTrace: M / T, // ~1.5842 (total)
  logGapFractionCovered: Math.log(F / T) / Math.log(M / T), // ~0.8158 (log-ceiling)
  linearGapFractionCovered: (F - T) / (M - T), // ~0.7797 (linear)
  sqrtFormCeilingN: 3.98e7, // imp-96667 sqrt(s log N) with measured s=5.8048 (illustrative, not rigorous)
  note:
    'the trace ceiling is rigorous only because trace has a proven closed-form asymptotic ' +
    'I(1,1) H_N; the Frobenius bound is tighter per-N but its ceiling F rests on a log-fit ' +
    'extrapolation. A rigorous closed-form asymptotic for ||G||_F would raise the rigorous ' +
    'lower ceiling T -> ~3.78-3.98e7, closing ~78-82% of the trace->measured gap.',
});

// Finding 3: the obstruction is one named, strictly one-sided open piece.
export const IMP96731_OBSTRUCTION = Object.freeze({
  id: 'imp-96731-interior-second-moment-upper-bound',
  diagonalExact: 2.6142397080254725, // imp-96667 D -> I(1,1)^2 zeta(2), rigorous
  borderConvergentApprox: 8.08, // imp-96667 B -> ~8.08, rigorous (summable)
  interiorDiverges: true, // imp-96708: Int(N) genuine log-N growth, not saturation
  needsOnlyUpperBound: true, // raising the LOWER ceiling needs Int(N) <= s* log N, not exact s
  strictlyWeakerThanSzego: true, // weaker than the imp-96548 exact-coefficient 0.3526 sub-gap
  minimalMissingLemma:
    'a rigorous one-sided upper bound on the two-variable Vasyunin cotangent sum V(a,b) for ' +
    'coprime a,b>=2 (the a=1 border case is already rigorous in imp-96667), giving Int(N) <= ' +
    's* log N; this is the Bettin-Conrey cotangent second moment and is not in the record.',
  postedImprovedCeiling: false, // no rigorous number can be posted without that lemma
});

export const IMP96731_VERDICT = Object.freeze({
  question:
    'can the imp-96548 trace-domination lower ceiling T = 2.594e7 be sharpened toward the ' +
    'Frobenius fit ceiling F = 3.775e7 to shrink the Route M rigorous-vs-fit conditioning-' +
    'ceiling gap F/T = 1.4555?',
  tighterRigorousPerNBoundExists: true, // Frobenius / WS, ~1.79x below trace
  traceIsTightestRigorousBound: false,
  gapIsExtrapolationRigorNotMechanism: true,
  obstructionIsOneSidedInteriorUpperBound: true,
  improvedRigorousCeilingPosted: false,
  achievableRigorousCeilingIfProven: '~3.78-3.98e7',
  gapClosedIfProvenLogFraction: IMP96731_CEILING_LEG.logGapFractionCovered, // ~0.8158
  anyBoundMoved: false,
  conclusion:
    'The named lever is REAL, but the sharpening is not a bound-mechanism upgrade: a strictly ' +
    'tighter rigorous per-N upper bound on lam_max already exists (Frobenius / Wolkowicz-Styan, ' +
    '~1.79x below the trace at N=12000), so the trace is not the tightest rigorous bound -- only ' +
    'the one with a proven closed-form asymptotic. The F/T = 1.4555 leg is an EXTRAPOLATION-rigor ' +
    'gap; closing it needs a rigorous closed-form asymptotic for the imp-96667 interior second ' +
    'moment Int(N), specifically a one-sided UPPER bound Int(N) <= s* log N -- strictly weaker ' +
    'than the imp-96548 Szego sub-gap and reducing to a rigorous one-sided bound on the ' +
    'two-variable Vasyunin cotangent sum V(a,b) (coprime a,b>=2). No such bound is in the record, ' +
    'so NO improved rigorous lower ceiling is posted; T = 2.594e7 remains the rigorous anchor. ' +
    'Were it proven, T would rise to ~3.78-3.98e7, closing ~78-82% of the trace->measured gap. ' +
    'Assessment only; no bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96731_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the tighter per-N bound is ' +
  'elementary Schatten-norm monotonicity on the same exact Vasyunin Gram (imp-96694 rows through ' +
  'N=12000); the second-moment reduction (diagonal exact, border convergent, interior open) is ' +
  'imp-96667 / imp-96708; the ceiling arithmetic is pure re-analysis of imp-96713. No bound is ' +
  'claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96731_ASSERTIONS = [
  {
    id: 'imp96731-frobenius-is-tighter-rigorous-per-n-bound',
    holds: () =>
      IMP96731_PER_N_BOUND.frobeniusBelowTrace &&
      IMP96731_PER_N_BOUND.frobeniusAboveLamMax &&
      IMP96731_PER_N_BOUND.traceOverFrobenius > 1.75 &&
      IMP96731_PER_N_BOUND.traceOverFrobenius < 1.82,
    why: 'at N=12000 ||G||_F = 7.005 sits strictly between lam_max = 6.242 and trace = 12.569, ~1.79x below the trace: the Frobenius bound is the tighter rigorous per-N upper bound, not the trace.',
  },
  {
    id: 'imp96731-ceiling-leg-and-gap-fraction',
    holds: () =>
      IMP96731_CEILING_LEG.frobeniusOverTrace > 1.45 &&
      IMP96731_CEILING_LEG.frobeniusOverTrace < 1.46 &&
      Math.abs(
        IMP96731_CEILING_LEG.frobeniusOverTrace * IMP96731_CEILING_LEG.measuredOverFrobenius -
          IMP96731_CEILING_LEG.measuredOverTrace,
      ) /
        IMP96731_CEILING_LEG.measuredOverTrace <
        1e-12 &&
      IMP96731_CEILING_LEG.logGapFractionCovered > 0.80 &&
      IMP96731_CEILING_LEG.logGapFractionCovered < 0.83 &&
      IMP96731_CEILING_LEG.linearGapFractionCovered > 0.77 &&
      IMP96731_CEILING_LEG.linearGapFractionCovered < 0.79,
    why: 'the F/T = 1.4555 leg composes exactly into M/T = 1.5842 with M/F = 1.0884, and closing it covers ~0.8158 of the log-ceiling gap (linear 0.7797): ~78-82% of the trace->measured gap.',
  },
  {
    id: 'imp96731-obstruction-is-one-sided-and-strictly-weaker',
    holds: () =>
      IMP96731_OBSTRUCTION.interiorDiverges === true &&
      IMP96731_OBSTRUCTION.needsOnlyUpperBound === true &&
      IMP96731_OBSTRUCTION.strictlyWeakerThanSzego === true &&
      IMP96731_OBSTRUCTION.postedImprovedCeiling === false &&
      Math.abs(IMP96731_OBSTRUCTION.diagonalExact - 2.6142397080254725) < 1e-12 &&
      /V\(a,b\)/.test(IMP96731_OBSTRUCTION.minimalMissingLemma),
    why: 'imp-96667 handles the diagonal (exact 2.614) and border (convergent ~8.08) rigorously and imp-96708 shows the interior diverges; the only residual is a one-sided UPPER bound on the interior, reducing to a rigorous bound on V(a,b) -- strictly weaker than the imp-96548 exact-coefficient sub-gap.',
  },
  {
    id: 'imp96731-no-rigorous-ceiling-posted-honesty-gate',
    holds: () =>
      IMP96731_VERDICT.anyBoundMoved === false &&
      IMP96731_VERDICT.improvedRigorousCeilingPosted === false &&
      IMP96731_VERDICT.traceIsTightestRigorousBound === false &&
      IMP96731_VERDICT.gapIsExtrapolationRigorNotMechanism === true &&
      /NO QED/.test(IMP96731_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96731_HONEST_BANNER) &&
      /RH open/.test(IMP96731_HONEST_BANNER) &&
      /interior-second-moment-upper-bound/.test(IMP96731_OBSTRUCTION.id),
    why: 'assessment only: no bound moved, no improved rigorous ceiling posted, the extrapolation-rigor reframing recorded, and the honesty markers plus the named one-sided sub-gap present.',
  },
];

for (const a of IMP96731_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96731-route-m-trace-ceiling-tightening-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  perNBound: IMP96731_PER_N_BOUND,
  ceilingLeg: IMP96731_CEILING_LEG,
  obstruction: IMP96731_OBSTRUCTION,
  verdict: IMP96731_VERDICT,
  banner: IMP96731_HONEST_BANNER,
};
