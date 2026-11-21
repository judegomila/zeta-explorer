/**
 * @module imp-97031-residmeas-extend-c-attribution
 * @fileoverview imp-97031 -- MEASUREMENT (honest closure of the imp-97018 sub-gap): extend the
 *   imp-96995 residMeas driver past N=124 to N in {136,148,160} so the imp-97018 C-decline
 *   attribution can be tested across the WHOLE {88..160} range rather than the {88..124} overlap
 *   corner. Reuses the imp-96995 orthogonal-Gegenbauer window build verbatim (2a=ln3, T=12800 full
 *   window, T=3200 low window); the ONLY change is adding the three high-N rungs where the C decline
 *   actually lives. Measurement only; the Rayleigh floor is an UPPER bound; all rungs are PAST the
 *   2a<=0.96 interval-verified reach and UNVERIFIED; changes no bound; RH open; NO QED.
 *
 * SUB-GAP CLOSED. imp-97018 named REFINED SUB-GAP imp-97018-residmeas-high-N-unmeasured: over the
 * only overlap grid {88..124} where imp-96995 supplies residMeas the gap OVER-explained the 1/C rise
 * by 2.29x (cancelled by a compensating fall in lam_min(A_full)/scaleB) while C stayed flat at 0.18%
 * drift; the bulk 5.68% C decline lives at {136,148,160} where NO residMeas existed, so the imp-96997
 * attribution ("the C decline IS the residMeasured-vs-residFirstOrder gap") was untestable exactly
 * where the decline occurs. This leaf supplies the missing residMeas rungs and settles the test.
 *
 * RAYLEIGH IDENTITY (phi = A_lo minimiser, ||phi||=1; scaleB = a^{4M+1}):
 *   1/C = lam_min(A_lo)/scaleB + residFO = lam_min(A_full)/scaleB + (residFO - residMeas),
 * with residMeas = (lam_min(A_full) - lam_min(A_lo))/scaleB and gapAbs = residFO - residMeas.
 * So gapAbs is a genuine additive ingredient of 1/C; the question is how much of the 1/C rise it
 * accounts for once the range reaches the rungs {136,148,160} that carry the decline.
 *
 * WHAT THE EXTENSION SHOWS.
 *   (1) residMeas EXTENDS CLEANLY AND ITS SUPER-CUBIC EXPONENT MILDLY FLATTENS. residMeas rises
 *       monotonically with near-constant high-N increments (~1.14e-3 per 12-step): 2.999e-3 (124) ->
 *       4.135e-3 (136) -> 5.272e-3 (148) -> 6.415e-3 (160). The log-log exponent over {88..160} is
 *       3.163, slightly BELOW the {88..124} value 3.228 (imp-96957 target): the floor lift grows a
 *       touch SLOWER (locally near-linear) at high N as the gap opens.
 *   (2) THE 2.29x OVER-EXPLANATION IS A LOW-N CORNER ARTIFACT -- IT COLLAPSES TO ~1.03x WHERE THE
 *       DECLINE LIVES. The gap-over-explanation factor d(gapAbs)/d(1/C) is 2.20x over {88..124}
 *       (reproducing imp-97018's ~2.29x) but drops to 1.03x over {124..160} and stays 1.02-1.06x at
 *       every high-N rung (124->136->148->160). So over the range that carries the 5.68% C decline the
 *       gap tracks the 1/C rise ALMOST EXACTLY -- the imp-96997 attribution becomes QUANTITATIVELY
 *       correct precisely where it matters, not merely directional.
 *   (3) THE COMPENSATING lam_min(A_full)/scaleB FALL SHRINKS TO NEGLIGIBLE AT HIGH N. lam_min(A_full)
 *       /scaleB keeps falling monotonically (0.581866 at N=76 down to 0.578824 at N=160) but its
 *       per-window drop shrinks from -1.287e-3 over {88..124} (which cancelled ~55% of the gap there)
 *       to only -8.79e-4 over the far larger {124..160} move -- i.e. from ~120% of d(1/C) at low N to
 *       just ~2.6% at high N. The two-drift cancellation that muddied the low-N corner all but vanishes.
 *   (4) THE GAP RATIO G = residMeas/residFO KEEPS PLUNGING: 0.547 (124) -> 0.408 -> 0.265 -> 0.147
 *       (160), i.e. by N=160 the tail relaxation has removed ~85% of the first-order tail residual,
 *       consistent with residFO growing ~N^{4.6} while residMeas grows only ~N^{3.16}.
 *   (5) C CROSS-CHECK: the reconstructed C = 1/(lam_min(A_lo)/scaleB + residFO) matches the imp-96997
 *       baked C to < 1.3e-4 at every rung {88..160}, validating that this build reproduces the same
 *       ladder imp-96997/imp-97018 measured.
 *
 * VERDICT. Extending the imp-96995 residMeas driver to {136,148,160} SETTLES the imp-97018 sub-gap:
 * the imp-96997 attribution is not just directionally correct but QUANTITATIVELY accurate over the
 * range where the C decline actually lives -- the 2.29x over-explanation was a low-N artifact of the
 * near-flat {88..124} plateau (tiny d(1/C) in the denominator) and collapses to ~1.03x over {124..160}
 * as the compensating lam_min(A_full)/scaleB drift becomes negligible (~2.6% of the move). Measurement
 * only; the floor is a Rayleigh UPPER bound; no operator positivity; interval-rigorous reach stays
 * 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97018-c-drift-vs-residmeas-gap.js (named the sub-gap imp-97018-residmeas-high-N-unmeasured this closes)
 * @see imp-96995-minimiser-coeff-spectrum-supercubic.js (the residMeas driver, extended here from {..124} to {..160})
 * @see imp-96997-sigma2-weighted-tail-envelope-model.js (Finding 1: C=wtf/rfo, the attribution settled here)
 * driver tmp/imp-97031-residmeas-extend.py (reuses the imp-96995 Gegenbauer build verbatim; adds N=136,148,160)
 */

const LN3 = Math.log(3); // 1.0986122886681098 (2a=ln3)

export const IMP97031_NS = Object.freeze([88, 100, 112, 124, 136, 148, 160]);
export const IMP97031_NEW_NS = Object.freeze([136, 148, 160]); // the rungs added past the imp-96995 stop at 124

// Extended per-rung measurements (2a=ln3, T=12800 full window). residFO/residMeas at {88..124}
// reproduce imp-96995; {136,148,160} are new. lamFull = lam_min(A_full)/scaleB, gapAbs = residFO-residMeas,
// G = residMeas/residFO, invC = lam_min(A_lo)/scaleB + residFO (Rayleigh identity).
export const IMP97031_ROWS = Object.freeze({
  88:  Object.freeze({ residFO: 1.1222615e-3, residMeas: 9.9756324e-4, gapAbs: 1.24698e-4, G: 0.88889, lamFull: 0.580991, invC: 0.581115, C: 1.72083 }),
  100: Object.freeze({ residFO: 1.8620583e-3, residMeas: 1.4899689e-3, gapAbs: 3.72089e-4, G: 0.80017, lamFull: 0.580446, invC: 0.580818, C: 1.72171 }),
  112: Object.freeze({ residFO: 3.1859335e-3, residMeas: 2.1885184e-3, gapAbs: 9.97415e-4, G: 0.68693, lamFull: 0.580010, invC: 0.581007, C: 1.72115 }),
  124: Object.freeze({ residFO: 5.4812899e-3, residMeas: 2.9993719e-3, gapAbs: 2.48192e-3, G: 0.54720, lamFull: 0.579704, invC: 0.582186, C: 1.71767 }),
  136: Object.freeze({ residFO: 1.0141535e-2, residMeas: 4.1354253e-3, gapAbs: 6.00611e-3, G: 0.40777, lamFull: 0.579491, invC: 0.585497, C: 1.70795 }),
  148: Object.freeze({ residFO: 1.9915512e-2, residMeas: 5.2718356e-3, gapAbs: 1.46437e-2, G: 0.26471, lamFull: 0.579230, invC: 0.593873, C: 1.68386 }),
  160: Object.freeze({ residFO: 4.3682526e-2, residMeas: 6.4152179e-3, gapAbs: 3.72673e-2, G: 0.14686, lamFull: 0.578824, invC: 0.616092, C: 1.62314 }),
});

// (1) residMeas super-cubic exponent MILDLY FLATTENS once the high-N rungs are included.
export const IMP97031_P_RESIDMEAS_OVERLAP = 3.228; // {88..124} (imp-96957 target, reproduced)
export const IMP97031_P_RESIDMEAS_FULL = 3.163; // {88..160}: floor lift grows a touch slower at high N
export const IMP97031_P_GAPABS_FULL = 9.422; // gapAbs = residFO - residMeas (residFO ~N^4.6 dominates)

// (2) the 2.29x gap over-explanation is a LOW-N corner artifact; it collapses to ~1.03x at high N.
//   over-explanation factor = d(gapAbs)/d(1/C) per window.
export const IMP97031_OVEREXPLAIN = Object.freeze({
  '88_124': 2.20, // reproduces imp-97018's ~2.29x (near-flat plateau => tiny d(1/C) denominator)
  '124_160': 1.03, // where the C decline lives: gap tracks the 1/C rise almost exactly
  '88_160': 1.06,
});
// per-rung over the decline range: stable ~1.02-1.06x (no residual over-explanation)
export const IMP97031_OVEREXPLAIN_PER_RUNG = Object.freeze({
  '124_136': 1.06, '136_148': 1.03, '148_160': 1.02,
});

// (3) the compensating lam_min(A_full)/scaleB fall shrinks to negligible where the decline lives.
export const IMP97031_D_LAMFULL = Object.freeze({
  '88_124': -1.2870e-3, // cancelled ~120% of d(1/C)=+1.070e-3 at low N (the two-drift muddle)
  '124_160': -8.7937e-4, // only ~2.6% of d(1/C)=+3.391e-2 at high N -- the cancellation vanishes
});

export const IMP97031_VERDICT = Object.freeze({
  ticket: 'imp-97031',
  subGapClosed: 'imp-97018-residmeas-high-N-unmeasured',
  question:
    'extend the imp-96995 residMeas driver past N=124 to {136,148,160} and test whether the imp-97018 2.29x gap over-explanation of the 1/C rise persists, grows, or reverses across the WHOLE C-decline range',
  answer:
    'the 2.29x over-explanation REVERSES toward exact accounting: it is a low-N corner artifact of the near-flat {88..124} plateau (tiny d(1/C) denominator) and COLLAPSES to 1.03x over {124..160} (1.02-1.06x per rung) -- the range that carries the 5.68% C decline -- as the compensating lam_min(A_full)/scaleB fall shrinks from ~120% of d(1/C) at low N to ~2.6% at high N. So the imp-96997 attribution ("the C decline IS the residMeasured-vs-residFirstOrder gap") is not merely directionally correct but QUANTITATIVELY accurate precisely where the decline lives. residMeas extends cleanly (2.999e-3->6.415e-3 over {124..160}) with its super-cubic exponent mildly flattening 3.228->3.163',
  overExplainCollapsesToUnityAtHighN: true, // 2.20x over {88..124} -> 1.03x over {124..160}
  lamFullCompensationVanishesAtHighN: true, // -1.287e-3 (~120% of d(1/C)) -> -8.79e-4 (~2.6% of d(1/C))
  residMeasExponentMildlyFlattens: true, // 3.228 ({88..124}) -> 3.163 ({88..160})
  cReconMatchesImp96997: true, // reconstructed C matches imp-96997 baked C to < 1.3e-4 at every rung
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97031_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97031_ASSERTIONS = [
  {
    id: 'imp97031-residmeas-extends-monotone-nearlinear',
    holds: () => {
      const N = IMP97031_NS;
      // residMeas strictly increasing across the whole grid
      for (let i = 1; i < N.length; i++) {
        if (IMP97031_ROWS[N[i]].residMeas <= IMP97031_ROWS[N[i - 1]].residMeas) return false;
      }
      // at high N the per-12-step increment is near-constant (locally near-linear): the three
      // top increments all sit within ~1% of each other around ~1.14e-3
      const inc136 = IMP97031_ROWS[136].residMeas - IMP97031_ROWS[124].residMeas;
      const inc148 = IMP97031_ROWS[148].residMeas - IMP97031_ROWS[136].residMeas;
      const inc160 = IMP97031_ROWS[160].residMeas - IMP97031_ROWS[148].residMeas;
      const spread = Math.max(inc136, inc148, inc160) / Math.min(inc136, inc148, inc160);
      // and the three new rungs land above the N=124 value
      return spread < 1.02 && IMP97031_NEW_NS.every((n) => IMP97031_ROWS[n].residMeas > IMP97031_ROWS[124].residMeas);
    },
    why: 'residMeas extends cleanly past the imp-96995 stop at N=124 to {136,148,160}, rising monotonically (2.999e-3 -> 6.415e-3) with near-constant high-N increments (~1.14e-3 per 12-step, within ~1%), so the floor lift is locally near-linear in N there -- exactly why the log-log exponent flattens 3.228 -> 3.163.',
  },
  {
    id: 'imp97031-overexplain-collapses-to-unity-at-high-N',
    holds: () =>
      IMP97031_OVEREXPLAIN['88_124'] > 2.0 &&
      IMP97031_OVEREXPLAIN['124_160'] < 1.15 &&
      Object.values(IMP97031_OVEREXPLAIN_PER_RUNG).every((x) => x > 0.95 && x < 1.15),
    why: 'the gap over-explanation d(gapAbs)/d(1/C) is 2.20x over the near-flat {88..124} plateau (reproducing imp-97018) but collapses to 1.03x over {124..160} and stays 1.02-1.06x per high-N rung, so the 2.29x over-explanation is a low-N corner artifact and the gap tracks the 1/C rise almost exactly where the decline lives.',
  },
  {
    id: 'imp97031-lamfull-compensation-vanishes',
    holds: () => {
      // lamFull/scaleB falls in both windows, but the fall is a huge fraction of d(1/C) at low N
      // (>1) and negligible at high N (<0.05).
      const dInvC_lo = IMP97031_ROWS[124].invC - IMP97031_ROWS[88].invC;
      const dInvC_hi = IMP97031_ROWS[160].invC - IMP97031_ROWS[124].invC;
      const fracLo = Math.abs(IMP97031_D_LAMFULL['88_124']) / dInvC_lo;
      const fracHi = Math.abs(IMP97031_D_LAMFULL['124_160']) / dInvC_hi;
      return (
        IMP97031_D_LAMFULL['88_124'] < 0 && IMP97031_D_LAMFULL['124_160'] < 0 &&
        fracLo > 1.0 && fracHi < 0.05
      );
    },
    why: 'the compensating lam_min(A_full)/scaleB fall is ~120% of the 1/C rise over {88..124} (the two-drift cancellation that muddied the low-N corner) but only ~2.6% of the far larger 1/C rise over {124..160}, so the cancellation vanishes and the gap alone accounts for the high-N C decline.',
  },
  {
    id: 'imp97031-C-recon-matches-imp96997',
    holds: () => {
      const baked = { 88: 1.72075, 100: 1.72166, 112: 1.72118, 124: 1.71771, 136: 1.70790, 148: 1.68374, 160: 1.62306 };
      return IMP97031_NS.every((n) => Math.abs(IMP97031_ROWS[n].C - baked[n]) < 1.3e-4);
    },
    why: 'the reconstructed C = 1/(lam_min(A_lo)/scaleB + residFO) matches the imp-96997 baked C = weightedTailFrac/residFirstOrder to < 1.3e-4 at every rung {88..160}, confirming this build reproduces the same ladder imp-96997/imp-97018 measured.',
  },
  {
    id: 'imp97031-rayleigh-identity-holds',
    holds: () =>
      // invC = lamFull + gapAbs at every rung (the Rayleigh decomposition)
      IMP97031_NS.every((n) => {
        const r = IMP97031_ROWS[n];
        return Math.abs(r.invC - (r.lamFull + r.gapAbs)) < 1e-3;
      }),
    why: 'at every rung the reconstructed 1/C equals lam_min(A_full)/scaleB + (residFO - residMeas), so the additive Rayleigh identity underlying the imp-97018 attribution holds across the full extended {88..160} grid.',
  },
  {
    id: 'imp97031-gap-ratio-plunges',
    holds: () => {
      const N = IMP97031_NS;
      for (let i = 1; i < N.length; i++) {
        if (IMP97031_ROWS[N[i]].G >= IMP97031_ROWS[N[i - 1]].G) return false;
      }
      return IMP97031_ROWS[160].G < 0.2; // ~85% of the first-order tail residual relaxed away by N=160
    },
    why: 'the gap ratio G = residMeas/residFO plunges monotonically 0.889 (88) -> 0.147 (160), so by N=160 the tail relaxation has removed ~85% of the first-order tail residual, consistent with residFO ~N^4.6 dominating residMeas ~N^3.16.',
  },
  {
    id: 'imp97031-measurement-only-no-qed',
    holds: () =>
      IMP97031_VERDICT.overExplainCollapsesToUnityAtHighN === true &&
      IMP97031_VERDICT.lamFullCompensationVanishesAtHighN === true &&
      IMP97031_VERDICT.operatorPositivityProved === false &&
      IMP97031_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97031_VERDICT.qed === false,
    why: 'measurement only: extending residMeas settles the imp-97018 sub-gap (the over-explanation collapses to unity at high N) but proves no operator positivity, moves no bound, keeps the certificate reach at 2a<=0.96, and claims no QED.',
  },
];

for (const a of IMP97031_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97031-residmeas-extend-c-attribution assertion failed: ${a.id}`);
  }
}

void LN3;
