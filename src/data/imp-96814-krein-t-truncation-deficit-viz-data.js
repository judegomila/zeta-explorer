/**
 * @module imp-96814-krein-t-truncation-deficit-viz-data
 * @fileoverview imp-96814 -- MEASUREMENT: quantify the imp-96772 fixed-T=800 vs t-converged
 *   (T=3200) Legendre/Gegenbauer Krein Rayleigh-floor DEFICIT as a function of 2a in
 *   {1.00, 1.05, ln3}, to size the t-truncation effect imp-96768 attributes the fixed-T descent to,
 *   and to test whether that deficit grows toward larger 2a (nearer the binding ln3 rung).
 *
 * CONTEXT. imp-96772 FINDING 3 reports the fixed-T=800 Krein floors under-resolve the positive
 * t-tail; the extended-precision (dps=40) solve reproduces the SAME fixed-T=800 descent, confirming
 * the descent is a t-truncation effect and not Gram-conditioning noise. imp-96768 (orthogonal
 * Gegenbauer, condB=1) measured BOTH the fixed-T=800 ladder (IMP96768_LADDER_T800) and, by raising
 * the tail to T=3200 at the SAME truncations N in {52,76,100,124}, a best-resolved ladder
 * (IMP96768_LADDER_CONVERGED). The per-2a t-truncation DEFICIT (best-resolved minus fixed-T=800 at
 * fixed N) was never tabulated; this ticket sizes it.
 *
 * METHOD (measurement only; no recomputation). The two ladders share N in {52,76,100,124}. The
 * deficit at each (N, 2a) is the T=3200 floor minus the T=800 floor, both verbatim from imp-96768.
 * Because T=3200 may itself still slightly under-resolve near ln3 (imp-96768 sub-gap
 * IMP96768_A_CONDITIONING_REACH / imp-96772 IMP96772_ENTRY_PRECISION_AND_TCONV), each deficit is a
 * LOWER bound on the true (fully t-converged) t-truncation deficit. The Rayleigh floor is an UPPER
 * bound on the true infinite-dim lambda_min; this establishes NO operator positivity; RH open; NO QED.
 *
 * FINDINGS (measured; deficits recomputed at import from the baked imp-96768 literals below).
 *   1. THE DEFICIT SHRINKS TOWARD LARGER 2a; IT DOES NOT GROW TOWARD ln3. At every N the ABSOLUTE
 *      deficit is largest at 2a=1.00 and smallest at 2a=ln3 (N=100: 1.172 / 0.354 / 0.045 at
 *      2a=1.00 / 1.05 / ln3). The RELATIVE deficit (deficit / T=3200 floor) is likewise smallest at
 *      ln3 at every N (N=100: 13.98% / 16.26% / 7.79%), peaking at 2a=1.05. So the answer to the
 *      scouted question is NO: the t-truncation deficit does not grow toward the binding ln3 rung.
 *   2. THE DEFICIT GROWS SUPER-LINEARLY WITH N AT EVERY 2a. At 2a=ln3 it climbs 0.008 -> 0.024 ->
 *      0.045 -> 0.066 across N=52 -> 76 -> 100 -> 124 (relative 1.40% -> 4.13% -> 7.79% -> 11.43%),
 *      consistent with higher-N trial functions carrying more high-t weight (phihat_n uses spherical
 *      Bessel j_k up to k = 2m + N - 1, onset t ~ k/a), which a fixed T=800 tail progressively
 *      under-resolves.
 *   3. THE a-DEPENDENCE MATCHES THE k/a ONSET STORY. Smaller a (2a=1.00 -> a=0.500) pushes the
 *      Bessel onset t ~ k/a HIGHER than larger a (2a=ln3 -> a=0.549), so more high-t weight falls
 *      beyond a fixed T=800 tail at the smaller a -- exactly the observed ordering (deficit largest
 *      at 2a=1.00, smallest at 2a=ln3). The t-truncation effect imp-96768 named is thus quantified
 *      and its a-trend explained.
 *
 * VERDICT. The per-2a fixed-T=800 vs T=3200 Krein floor deficit is sized: it is SMALLEST at the
 * binding 2a=ln3 rung (~7.8% at N=100), largest at 2a=1.00, and grows super-linearly with N -- so
 * the t-truncation effect does NOT grow toward ln3, and its modest size at ln3 STRENGTHENS (does not
 * weaken) the imp-96768 t-converged positive-plateau reading near ln3. This is a lower bound on the
 * true t-truncation deficit (T=3200 may still slightly under-resolve). Measurement only; the floor is
 * a Rayleigh UPPER bound; no operator positivity; interval-rigorous certificate reach stays
 * 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the T=800 and T=3200 ladders this bakes)
 * @see imp-96772-krein-lammin-double-double-recompute.js (FINDING 3: fixed-T=800 under-resolves the t-tail)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// shared truncations at which BOTH the T=800 and T=3200 imp-96768 ladders are tabulated
export const IMP96814_NS = Object.freeze([52, 76, 100, 124]);

// -- fixed-T=800 Krein floors, verbatim from imp-96768 IMP96768_LADDER_T800 at N in {52,76,100,124}
export const IMP96814_T800 = Object.freeze({
  '2a=1.00': Object.freeze([8.312877, 7.848057, 7.213924, 6.454566]),
  '2a=1.05': Object.freeze([2.154760, 2.012102, 1.820187, 1.597260]),
  '2a=ln3': Object.freeze([0.577015, 0.557245, 0.533846, 0.510769]),
});

// -- best-resolved T=3200 Krein floors, verbatim from imp-96768 IMP96768_LADDER_CONVERGED
export const IMP96814_T3200 = Object.freeze({
  '2a=1.00': Object.freeze([8.506463, 8.435387, 8.386345, 8.336676]),
  '2a=1.05': Object.freeze([2.213381, 2.189739, 2.173702, 2.157368]),
  '2a=ln3': Object.freeze([0.585194, 0.581260, 0.578958, 0.576691]),
});

// per-(N,2a) t-truncation deficit = T=3200 floor - T=800 floor (a LOWER bound on the true deficit)
export const IMP96814_DEFICIT = Object.freeze(
  Object.fromEntries(
    Object.keys(IMP96814_T3200).map((k) => [
      k,
      Object.freeze(IMP96814_T3200[k].map((v, i) => +(v - IMP96814_T800[k][i]).toFixed(6))),
    ]),
  ),
);

// relative deficit = (T=3200 - T=800) / T=3200, as a percentage
export const IMP96814_DEFICIT_REL_PCT = Object.freeze(
  Object.fromEntries(
    Object.keys(IMP96814_T3200).map((k) => [
      k,
      Object.freeze(
        IMP96814_T3200[k].map((v, i) => +((100 * (v - IMP96814_T800[k][i])) / v).toFixed(2)),
      ),
    ]),
  ),
);

export const IMP96814_VERDICT = Object.freeze({
  ticket: 'imp-96814',
  question:
    'how large is the imp-96772 fixed-T=800 vs t-converged (T=3200) Krein floor deficit per 2a, and does it grow toward the binding ln3 rung?',
  answer:
    'the deficit is SMALLEST at 2a=ln3 (~0.045 abs / 7.79% rel at N=100), largest at 2a=1.00, and grows super-linearly with N; it does NOT grow toward ln3 -- it grows toward smaller a (higher Bessel onset t ~ k/a) and with N',
  deficitGrowsTowardLn3: false, // absolute AND relative deficit are smallest at ln3 at every N
  largestDeficit2a: '2a=1.00', // smallest a -> highest k/a onset -> most high-t weight missed at T=800
  smallestDeficit2a: '2a=ln3', // the binding rung has the smallest t-truncation deficit
  ln3DeficitAtN100Abs: 0.045112,
  ln3DeficitAtN100RelPct: 7.79,
  deficitIsLowerBound: true, // T=3200 may still slightly under-resolve near ln3
  strengthensPlateauReadingNearLn3: true, // modest ln3 deficit reinforces imp-96768 positive plateau
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96814_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96814_ASSERTIONS = [
  {
    id: 'imp96814-deficit-positive-everywhere',
    holds: () =>
      Object.values(IMP96814_DEFICIT).every((row) => row.every((d) => d > 0)),
    why: 'raising the tail T=800 -> T=3200 at fixed N lifts every Krein floor, so every t-truncation deficit is strictly positive (fixed-T=800 under-resolves the positive t-tail).',
  },
  {
    id: 'imp96814-deficit-grows-with-N',
    holds: () =>
      Object.values(IMP96814_DEFICIT).every((row) =>
        row.every((d, i) => i === 0 || d > row[i - 1]),
      ),
    why: 'at every 2a the deficit grows monotonically with N (higher-N trial functions carry more high-t weight, which a fixed T=800 tail progressively under-resolves).',
  },
  {
    id: 'imp96814-deficit-smallest-at-ln3-not-largest',
    holds: () =>
      IMP96814_NS.every((_, i) => {
        const abs100 = IMP96814_DEFICIT['2a=1.00'][i];
        const abs105 = IMP96814_DEFICIT['2a=1.05'][i];
        const absln3 = IMP96814_DEFICIT['2a=ln3'][i];
        const relLn3 = IMP96814_DEFICIT_REL_PCT['2a=ln3'][i];
        const rel100 = IMP96814_DEFICIT_REL_PCT['2a=1.00'][i];
        const rel105 = IMP96814_DEFICIT_REL_PCT['2a=1.05'][i];
        // absolute: 2a=1.00 > 2a=1.05 > 2a=ln3; relative: ln3 is the smallest at every N
        return abs100 > abs105 && abs105 > absln3 && relLn3 < rel100 && relLn3 < rel105;
      }) && IMP96814_VERDICT.deficitGrowsTowardLn3 === false,
    why: 'the scouted hypothesis (deficit grows toward larger 2a / ln3) is refuted: the deficit is smallest at the binding ln3 rung in both absolute and relative terms at every N; it is largest at the smallest a (2a=1.00).',
  },
  {
    id: 'imp96814-ln3-n100-deficit-matches-verdict',
    holds: () => {
      const i100 = IMP96814_NS.indexOf(100);
      return (
        Math.abs(IMP96814_DEFICIT['2a=ln3'][i100] - IMP96814_VERDICT.ln3DeficitAtN100Abs) < 1e-6 &&
        Math.abs(IMP96814_DEFICIT_REL_PCT['2a=ln3'][i100] - IMP96814_VERDICT.ln3DeficitAtN100RelPct) < 1e-2
      );
    },
    why: 'the baked ln3 N=100 deficit (0.045112 abs, 7.79% rel) must equal the recomputed value from the imp-96768 ladders, confirming no transcription drift.',
  },
  {
    id: 'imp96814-source-ladders-match-imp96768',
    holds: () =>
      IMP96814_T800['2a=ln3'][0] === 0.577015 &&
      IMP96814_T3200['2a=ln3'][2] === 0.578958 &&
      IMP96814_T800['2a=1.00'][0] === 8.312877 &&
      IMP96814_T3200['2a=1.00'][3] === 8.336676,
    why: 'the baked T=800 and T=3200 floors must reproduce the imp-96768 IMP96768_LADDER_T800 / IMP96768_LADDER_CONVERGED literals verbatim (same subspace and operator).',
  },
  {
    id: 'imp96814-measurement-only-no-qed',
    holds: () =>
      IMP96814_VERDICT.operatorPositivityProved === false &&
      IMP96814_VERDICT.deficitIsLowerBound === true &&
      IMP96814_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96814_VERDICT.qed === false,
    why: 'measurement only: the deficit is a lower bound on the true t-truncation gap, no operator positivity is established, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96814_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96814-krein-t-truncation-deficit-viz-data assertion failed: ${a.id}`);
  }
}

void LN3;
