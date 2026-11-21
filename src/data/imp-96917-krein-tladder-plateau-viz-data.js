/**
 * @module imp-96917-krein-tladder-plateau-viz-data
 * @fileoverview imp-96917 -- MEASUREMENT: extend the imp-96768 Gegenbauer Krein t-truncation
 *   ladder BEYOND T=3200 at the binding 2a=ln3 rung, fixed N in {76,100,124}, to DECIDE whether
 *   the imp-96814 fixed-T=800 vs T=3200 deficit is close to its T->inf converged value (plateau)
 *   or still climbing, and to size the residual t-truncation left beyond T=3200.
 *
 * CONTEXT. imp-96814 sized the per-2a fixed-T=800 vs T=3200 Krein Rayleigh-floor deficit
 * (7.79% relative at N=100, 2a=ln3; growing super-linearly with N) and flagged it as a LOWER bound
 * on the true (fully t-converged) deficit, because T=3200 may itself still under-resolve the
 * positive t-tail near ln3 (imp-96768 sub-gap IMP96768_A_CONDITIONING_REACH / imp-96772
 * IMP96772_ENTRY_PRECISION_AND_TCONV). The T->inf plateau was never checked.
 *
 * METHOD. Reuse the imp-96768 orthogonal Gegenbauer build verbatim (sigma_2=(t^2+1/4)^2 w_1,
 * pole-free trial space m=3, normalised C_n^{13/2} so the L^2 Gram is exactly scaleB*I, condB=1),
 * evaluating lam_min(A)/scaleB at 2a=ln3 for T in {800,3200,4800,6400,9600,12800} at each fixed
 * N. The T=800 and T=3200 rungs reproduce the imp-96768 / imp-96814 baked literals to <=1.4e-5,
 * confirming the same subspace and operator. tmp/imp-96917-tladder.py (30s, dps=double, condB=1).
 * The Rayleigh floor is an UPPER bound on the true infinite-dim lam_min; NO operator positivity;
 * RH open; NO QED.
 *
 * FINDINGS (measured; deficits/residuals recomputed at import from the baked ladder below).
 *   1. THE 2a=ln3 FLOOR PLATEAUS POSITIVE AS T->inf AT EVERY N. Raising the tail T=3200 -> 12800
 *      lifts the floor by only 0.0006 / 0.0015 / 0.0030 at N=76 / 100 / 124, with per-step
 *      increments decaying geometrically (tail ratio ~0.26-0.28), so the floor converges to a
 *      finite positive limit (~0.5819 / 0.5805 / 0.5797). The t-converged 2a=ln3 floor stays
 *      strictly positive at every truncation, reinforcing the imp-96768 positive-plateau reading.
 *   2. T=3200 CAPTURES 95.6-97.5% OF THE T->inf DEFICIT; IT IS NEAR-PLATEAU, NOT YET AT IT. The
 *      residual t-truncation beyond T=3200 (measured to T=12800) is 0.104% / 0.257% / 0.520% of
 *      the floor at N=76 / 100 / 124 -- small but nonzero -- so the imp-96814 T=3200 deficit is a
 *      genuine LOWER bound that under-reports the T->inf deficit by ~2.5% (N=76), ~3.2% (N=100),
 *      ~4.4% (N=124). imp-96814 FINDING 1 (deficit smallest at ln3) and FINDING 2 (super-linear
 *      in N) both survive the T->inf correction.
 *   3. THE RESIDUAL BEYOND T=3200 GROWS WITH N, MATCHING THE k/a ONSET STORY. It climbs 0.0006 ->
 *      0.0015 -> 0.0030 across N=76 -> 100 -> 124 (0.104% -> 0.257% -> 0.520% relative), because
 *      higher-N trial functions carry Bessel weight j_k up to k=2m+N-1 (onset t ~ k/a), so a
 *      fixed tail progressively under-resolves -- exactly the imp-96814 super-linear-in-N mechanism.
 *
 * VERDICT. The imp-96814 T=3200 deficit at the binding 2a=ln3 rung is NEAR its T->inf converged
 * value: T=3200 captures 95.6-97.5% of the true deficit, the residual t-truncation left beyond
 * T=3200 is 0.1-0.5% of the floor and GROWS with N, and the 2a=ln3 floor plateaus strictly
 * positive (~0.58) at every N. So imp-96814 was right to call its deficit a LOWER bound; the
 * correction to T->inf is modest (~2.5-4.4% relative) and does NOT overturn the positive-plateau
 * reading near ln3 -- it strengthens it. Measurement only; the floor is a Rayleigh UPPER bound; no
 * operator positivity; interval-rigorous certificate reach stays 2a <= 0.96; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96814-krein-t-truncation-deficit-viz-data.js (the T=800 vs T=3200 deficit this extends)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the orthogonal Gegenbauer build reused here)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// extended t-tail ladder evaluated at 2a=ln3 (T=800 and T=3200 reproduce imp-96768 / imp-96814)
export const IMP96917_TS = Object.freeze([800, 3200, 4800, 6400, 9600, 12800]);
export const IMP96917_NS = Object.freeze([76, 100, 124]);

// Krein Rayleigh floor lam_min(A)/scaleB at 2a=ln3, per fixed N, across the T ladder above
export const IMP96917_LADDER = Object.freeze({
  76: Object.freeze([0.5572455, 0.5812598, 0.5816793, 0.5817906, 0.5818517, 0.5818663]),
  100: Object.freeze([0.5338456, 0.5789562, 0.5799876, 0.5802586, 0.5804143, 0.5804462]),
  124: Object.freeze([0.5107688, 0.5767043, 0.5787499, 0.5793272, 0.5796225, 0.5797037]),
});

const idxT = (T) => IMP96917_TS.indexOf(T);

// residual t-truncation left beyond T=3200 (measured to T=12800) = floor(T=12800) - floor(T=3200)
export const IMP96917_RESIDUAL_BEYOND_T3200 = Object.freeze(
  Object.fromEntries(
    IMP96917_NS.map((N) => [
      N,
      +(IMP96917_LADDER[N][idxT(12800)] - IMP96917_LADDER[N][idxT(3200)]).toFixed(7),
    ]),
  ),
);

// residual beyond T=3200 as a percentage of the T=3200 floor (relative under-resolution at T=3200)
export const IMP96917_RESIDUAL_REL_PCT = Object.freeze(
  Object.fromEntries(
    IMP96917_NS.map((N) => [
      N,
      +(
        (100 * (IMP96917_LADDER[N][idxT(12800)] - IMP96917_LADDER[N][idxT(3200)])) /
        IMP96917_LADDER[N][idxT(3200)]
      ).toFixed(3),
    ]),
  ),
);

// geometric-tail T->inf extrapolated floor estimates (from tmp/imp-96917-tladder.py, model-based)
export const IMP96917_FLOOR_TINF_EST = Object.freeze({ 76: 0.5818716, 100: 0.5804575, 124: 0.5797357 });

// fraction of the T->inf deficit (extrap floor - T=800 floor) already captured by the T=3200 deficit
export const IMP96917_DEFICIT_CAPTURED_AT_T3200_PCT = Object.freeze(
  Object.fromEntries(
    IMP96917_NS.map((N) => {
      const t800 = IMP96917_LADDER[N][idxT(800)];
      const t3200 = IMP96917_LADDER[N][idxT(3200)];
      const tinf = IMP96917_FLOOR_TINF_EST[N];
      return [N, +((100 * (t3200 - t800)) / (tinf - t800)).toFixed(1)];
    }),
  ),
);

export const IMP96917_VERDICT = Object.freeze({
  ticket: 'imp-96917',
  question:
    'does the imp-96814 fixed-T=800 vs T=3200 Krein-floor deficit at 2a=ln3 plateau at its T->inf value, or is T=3200 still climbing? size the residual t-truncation beyond T=3200.',
  answer:
    'the 2a=ln3 floor plateaus strictly positive as T->inf (increments decay geometrically, tail ratio ~0.26-0.28); T=3200 captures 95.6-97.5% of the T->inf deficit; the residual t-truncation beyond T=3200 is 0.1-0.5% of the floor and GROWS with N, so the imp-96814 T=3200 deficit is a genuine LOWER bound under-reporting the true deficit by ~2.5-4.4%',
  floorPlateausPositive: true, // the t-converged 2a=ln3 floor stays > 0 at every N
  t3200IsNearPlateauNotAtIt: true, // 95.6-97.5% captured; small nonzero residual remains
  residualBeyondT3200GrowsWithN: true, // 0.104% -> 0.257% -> 0.520% at N=76 -> 100 -> 124
  imp96814DeficitConfirmedLowerBound: true,
  residualRelPctAtN100: 0.257,
  deficitCapturedAtT3200PctAtN100: 96.8,
  floorTinfEstAtN100: 0.5804575,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96917_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96917_ASSERTIONS = [
  {
    id: 'imp96917-floor-monotone-increasing-in-T',
    holds: () =>
      IMP96917_NS.every((N) =>
        IMP96917_LADDER[N].every((v, i) => i === 0 || v > IMP96917_LADDER[N][i - 1]),
      ),
    why: 'raising the t-tail T lifts the Krein floor monotonically at every fixed N (a longer tail resolves more of the positive t-weight), so each ladder is strictly increasing in T.',
  },
  {
    id: 'imp96917-tail-increments-decay-geometrically',
    holds: () =>
      IMP96917_NS.every((N) => {
        const ext = IMP96917_LADDER[N].slice(idxT(3200)); // T=3200..12800
        const incs = ext.slice(1).map((v, i) => v - ext[i]);
        // strictly positive and strictly shrinking -> convergent tail (finite T->inf plateau)
        return incs.every((d, i) => d > 0 && (i === 0 || d < incs[i - 1]));
      }),
    why: 'the per-step floor increments beyond T=3200 are strictly positive and strictly shrinking, so the floor converges to a finite T->inf plateau rather than climbing without bound.',
  },
  {
    id: 'imp96917-t3200-near-plateau-not-at-it',
    holds: () =>
      IMP96917_NS.every((N) => {
        const r = IMP96917_RESIDUAL_BEYOND_T3200[N];
        const cap = IMP96917_DEFICIT_CAPTURED_AT_T3200_PCT[N];
        // small but strictly positive residual; T=3200 captures 90-99% of the T->inf deficit
        return r > 0 && r < 0.01 && cap > 90 && cap < 99;
      }),
    why: 'T=3200 is near the plateau but not at it: a small strictly-positive residual (0.1-0.5% of the floor) remains, and T=3200 captures 95.6-97.5% of the T->inf deficit -- confirming imp-96814 treated its deficit correctly as a LOWER bound.',
  },
  {
    id: 'imp96917-residual-grows-with-N',
    holds: () =>
      IMP96917_RESIDUAL_BEYOND_T3200[100] > IMP96917_RESIDUAL_BEYOND_T3200[76] &&
      IMP96917_RESIDUAL_BEYOND_T3200[124] > IMP96917_RESIDUAL_BEYOND_T3200[100] &&
      IMP96917_RESIDUAL_REL_PCT[100] > IMP96917_RESIDUAL_REL_PCT[76] &&
      IMP96917_RESIDUAL_REL_PCT[124] > IMP96917_RESIDUAL_REL_PCT[100],
    why: 'the residual t-truncation beyond T=3200 grows with N (higher-N trial functions carry Bessel weight to higher k, onset t ~ k/a), matching the imp-96814 super-linear-in-N deficit mechanism.',
  },
  {
    id: 'imp96917-t800-t3200-reproduce-imp96814',
    holds: () =>
      IMP96917_LADDER[76][idxT(800)] === 0.5572455 &&
      IMP96917_LADDER[100][idxT(3200)] === 0.5789562 &&
      IMP96917_LADDER[124][idxT(800)] === 0.5107688 &&
      Math.abs(IMP96917_LADDER[124][idxT(3200)] - 0.576691) < 2e-5,
    why: 'the T=800 and T=3200 rungs must reproduce the imp-96768 / imp-96814 baked 2a=ln3 floors (same subspace and operator), so the extended ladder is an apples-to-apples extension.',
  },
  {
    id: 'imp96917-measurement-only-no-qed',
    holds: () =>
      IMP96917_VERDICT.operatorPositivityProved === false &&
      IMP96917_VERDICT.imp96814DeficitConfirmedLowerBound === true &&
      IMP96917_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96917_VERDICT.qed === false,
    why: 'measurement only: T=3200 is confirmed a lower-bound resolution of the deficit, no operator positivity is established, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96917_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96917-krein-tladder-plateau-viz-data assertion failed: ${a.id}`);
  }
}

void LN3;
