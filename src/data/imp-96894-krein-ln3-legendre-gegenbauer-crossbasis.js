/**
 * @fileoverview imp-96894 -- MEASUREMENT: cross-basis numeric agreement of the Route I Krein
 * Rayleigh floor lambda_min(T_a[sigma_2]) at the BINDING endpoint 2a=ln3 between the imp-96749
 * Legendre-basis N-trend ladder and the imp-96768 Gegenbauer C_n^{13/2} condB=1 (diagonal-Gram)
 * ladder. Companion to imp-96852, which ran the same Legendre-vs-Gegenbauer cross-check only at
 * 2a=0.96.
 *
 * CONTEXT. imp-96852 cross-validated the two independent bases at 2a=0.96 (|G-L| <= 6.5e-6) but the
 * binding endpoint 2a=ln3 was never tabulated as a matched-N cross-basis table, even though both
 * ladders were separately measured: imp-96749 IMP96749_LADDER['2a=ln3'] (Legendre explicit Gram,
 * tail-inclusive T=800, N in {20..76}, capped by condB ~ 1e13) and imp-96768 IMP96768_LADDER_T800
 * ['2a=ln3'] (Gegenbauer condB=1, tail-inclusive T=800, N in {20..124}). imp-96768 Finding 1 already
 * ASSERTS these reproduce IMP96749_LADDER "bit-for-bit" (e.g. 2a=ln3 N=76: Gegenbauer 0.557245 vs
 * Legendre 0.557246); this leaf makes that matched-N agreement EXPLICIT at 2a=ln3, the same way
 * imp-96852 did at 2a=0.96. The Rayleigh floor min_x (x^T A x)/(x^T B x) over the degree-<N span is
 * basis-INDEPENDENT, so the Legendre and Gegenbauer ladders MUST coincide up to numerical
 * conditioning; any divergence would be a conditioning flag, not a spectral disagreement.
 *
 * METHOD (measurement only; no new solve). Every floor literal below is copied VERBATIM from the two
 * committed modules at matched (2a=ln3, T=800): leg = imp-96749 IMP96749_LADDER['2a=ln3'][i];
 * gegen = imp-96768 IMP96768_LADDER_T800['2a=ln3'][i] over the shared N grid {20,28,36,44,52,60,68,76}.
 * absDiff / relDiff are the differences of those 6-significant-figure printed values, so they are
 * resolved only to the ~1e-6 printing granularity. NOTE the Rayleigh floor is an UPPER bound on the
 * true infinite-dim lambda_min; agreement is a basis-independence consistency check, NOT an operator
 * positivity theorem; NO QED.
 *
 * FINDINGS (measured).
 *   1. THE TWO BASES AGREE TO THE 6-DIGIT PRINTING GRANULARITY ACROSS THE MATCHED N GRID. Over the
 *      shared N in {20..76} at 2a=ln3 the per-rung |Legendre - Gegenbauer| is 0.0 at every N except
 *      N=76, where it is a single last-print-digit 1e-6 (0.557246 vs 0.557245, rel 1.794e-6). The
 *      worst-case matched-N disagreement is therefore <= 1e-6 absolute -- the same clean basis-
 *      independence signature imp-96852 recorded at 2a=0.96 (|G-L| <= 6.5e-6), confirming the ~0.58
 *      binding-endpoint floor is genuinely basis-independent, not a Gegenbauer artifact.
 *   2. THE MATCHED-N COMPARISON ENDS AT N=76 -- THE N-TREND GAP BETWEEN THE TWO LADDERS. imp-96749 is
 *      capped at N=76 by the Legendre-Gram conditioning wall (condB ~ 1e13), while imp-96768 pushes
 *      the condB=1 Gegenbauer ladder to N in {88,100,112,124} (0.545630/0.533846/0.521953/0.510769 at
 *      T=800) with NO Legendre partner. The cross-basis check is therefore only DIRECT out to N=76;
 *      past that the Legendre ladder is unavailable, exactly the open IMP96749_UNIFORM_N_GAP_UNSETTLED
 *      obstruction. (The imp-96768 tail descent is a t=800 truncation effect, not a collapse: its
 *      t-converged N=124 floor stays 0.576691, and imp-96876 measures a direct t-converged N=100 floor
 *      L ~ 0.58044615 -- both firmly positive, but neither is a matched-N Legendre comparison.)
 *   3. NO RUNG DIVERGES. The single non-zero matched diff (N=76) is monotone-consistent with the mild
 *      Legendre-Gram conditioning growth imp-96852 saw at 2a=0.96; the ln3 endpoint shows the same
 *      "diff hides below the last printed digit" behaviour, staying orders of magnitude under the
 *      floor-vs-plateau margins, so the positive-floor reading at 2a=ln3 is basis-robust.
 *
 * VERDICT. The 2a=ln3 Krein Rayleigh floor is CROSS-BASIS CONSISTENT over the matched N grid: the
 * imp-96749 Legendre ladder and the imp-96768 Gegenbauer condB=1 ladder coincide to <= 1e-6 absolute
 * (rel <= 1.8e-6) at every shared N in {20..76} at T=800, extending the imp-96852 2a=0.96 cross-check
 * to the binding endpoint. The direct comparison ends at N=76 (the imp-96749 conditioning cap); the
 * uniform-in-N spectral gap stays open. Measurement / cross-validation only; the floor stays a
 * Rayleigh UPPER bound; no operator positivity; interval-rigorous certificate reach stays 2a <= 0.96;
 * RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96852-krein-096-legendre-gegenbauer-crossbasis.js (companion cross-basis check at 2a=0.96)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_LADDER Legendre ladder, N-trend cap N=76)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (IMP96768_LADDER_T800 Gegenbauer condB=1 ladder)
 * @see imp-96876-krein-tresidual-crossval-measurement.js (direct t-converged N=100 floor ~0.58044615)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0)
 */

const LN3 = Math.log(3); // 1.0986122886681098

export const IMP96894_TWO_A = LN3;
export const IMP96894_T = 800; // both ladders tail-inclusive at T=800
// matched N grid = intersection of imp-96749 IMP96749_NS and imp-96768 IMP96768_NS on {20..76}
export const IMP96894_NS = Object.freeze([20, 28, 36, 44, 52, 60, 68, 76]);

// per-rung matched-N cross-basis table at 2a=ln3, T=800 (all floors VERBATIM from the two modules).
// leg = imp-96749 IMP96749_LADDER['2a=ln3'][i]; gegen = imp-96768 IMP96768_LADDER_T800['2a=ln3'][i];
// absDiff = |leg - gegen| of the 6-sig-fig printed values; relDiff = absDiff / gegen.
export const IMP96894_CROSSBASIS = Object.freeze([
  Object.freeze({ N: 20, leg: 0.625397, gegen: 0.625397, absDiff: 0.0, relDiff: 0.0 }),
  Object.freeze({ N: 28, leg: 0.598141, gegen: 0.598141, absDiff: 0.0, relDiff: 0.0 }),
  Object.freeze({ N: 36, leg: 0.588067, gegen: 0.588067, absDiff: 0.0, relDiff: 0.0 }),
  Object.freeze({ N: 44, leg: 0.583422, gegen: 0.583422, absDiff: 0.0, relDiff: 0.0 }),
  Object.freeze({ N: 52, leg: 0.577015, gegen: 0.577015, absDiff: 0.0, relDiff: 0.0 }),
  Object.freeze({ N: 60, leg: 0.570500, gegen: 0.570500, absDiff: 0.0, relDiff: 0.0 }),
  Object.freeze({ N: 68, leg: 0.564589, gegen: 0.564589, absDiff: 0.0, relDiff: 0.0 }),
  Object.freeze({ N: 76, leg: 0.557246, gegen: 0.557245, absDiff: 1.0e-6, relDiff: 1.794e-6 }),
]);

// headline: worst-case matched-N absolute / relative cross-basis disagreement (both at N=76)
export const IMP96894_MAX_ABS_DIFF = 1.0e-6;
export const IMP96894_MAX_REL_DIFF = 1.794e-6;

// Gegenbauer-only tail (imp-96768 IMP96768_LADDER_T800), NO Legendre partner -- the N-trend gap.
export const IMP96894_GEGEN_ONLY_TAIL = Object.freeze([
  Object.freeze({ N: 88, gegen: 0.545630 }),
  Object.freeze({ N: 100, gegen: 0.533846 }),
  Object.freeze({ N: 112, gegen: 0.521953 }),
  Object.freeze({ N: 124, gegen: 0.510769 }),
]);
export const IMP96894_MATCHED_NMAX = 76; // imp-96749 Legendre cap (condB ~ 1e13); direct check ends here

export const IMP96894_VERDICT = Object.freeze({
  ticket: 'imp-96894',
  question:
    'do the imp-96749 Legendre ladder and the imp-96768 Gegenbauer condB=1 ladder give the SAME Krein Rayleigh floor lambda_min(T_a[sigma_2]) at the binding endpoint 2a=ln3 across the matched N grid, and by how much do they numerically differ?',
  answer:
    'yes: over the shared N in {20..76} at T=800 the Legendre and Gegenbauer floors coincide to <=1e-6 absolute (rel <=1.8e-6) -- identical to all 6 printed digits at every N except a single last-digit 1e-6 at N=76 -- extending the imp-96852 2a=0.96 cross-basis agreement to the binding endpoint; the direct comparison ends at N=76 where the Legendre Gram conditioning caps imp-96749, while imp-96768 pushes the condB=1 ladder to N=124 with no Legendre partner',
  basisA: 'Legendre P_n, explicit non-diagonal Gram (imp-96749), N-trend capped at N=76 by condB ~ 1e13',
  basisB: 'Gegenbauer C_n^{13/2}, Gram B = a^{4m+1} I, condB=1 (imp-96768), reaches N=124',
  matchedNmax: 76,
  maxAbsDiff: 1.0e-6,
  maxRelDiff: 1.794e-6,
  companionAt096: 'imp-96852', // same cross-check at 2a=0.96 (|G-L| <= 6.5e-6)
  basisIndependenceConfirmed: true, // agreement at the 6-digit printing granularity across matched N
  // honesty guardrails
  rayleighFloorIsUpperBound: true,
  operatorPositivityProved: false,
  uniformNGapSettled: false, // imp-96749 IMP96749_UNIFORM_N_GAP_UNSETTLED remains open
  matchedComparisonEndsAtN76: true, // past N=76 there is no Legendre partner
  intervalRigorousReachUnchanged: 0.96,
  rhOpen: true,
  ptFloorSOTA: 0.2,
  qed: false,
});

// -- self-check assertions (import-light; node run-assertions exercises these) -----------------------
const IMP96894_ASSERTIONS = [
  {
    id: 'imp96894-two-a-is-ln3',
    holds: () => Math.abs(IMP96894_TWO_A - Math.log(3)) < 1e-12,
    why: 'the tabulation is at the binding endpoint 2a = ln3, distinct from the imp-96852 companion at 2a = 0.96.',
  },
  {
    id: 'imp96894-bases-agree-to-print-granularity',
    holds: () => IMP96894_CROSSBASIS.every((r) => r.absDiff <= 1e-6 && r.relDiff <= 2e-6),
    why: 'the Legendre and Gegenbauer floors must coincide to <=1e-6 absolute (rel <=2e-6) at every matched N -- a basis-independence confirmation of the ~0.58 floor at 2a = ln3, matching the imp-96852 result at 2a = 0.96.',
  },
  {
    id: 'imp96894-diff-only-at-N76',
    holds: () => {
      const nonzero = IMP96894_CROSSBASIS.filter((r) => r.absDiff > 0);
      return nonzero.length === 1 && nonzero[0].N === 76 && nonzero[0].absDiff === 1e-6;
    },
    why: 'the only non-zero matched-N diff is the single last-print-digit 1e-6 at N=76 (0.557246 vs 0.557245); every lower N is identical to all 6 printed digits.',
  },
  {
    id: 'imp96894-floor-firmly-positive-both-bases',
    holds: () => IMP96894_CROSSBASIS.every((r) => r.leg > 0.5 && r.gegen > 0.5),
    why: 'both bases must report a firmly-positive (>0.5) floor across the matched N grid at 2a = ln3, reproducing the imp-96749/imp-96768 positivity independently of the basis choice.',
  },
  {
    id: 'imp96894-gegen-tail-descending-no-partner',
    holds: () => {
      const t = IMP96894_GEGEN_ONLY_TAIL;
      for (let i = 0; i < t.length - 1; i++) {
        if (!(t[i].gegen > t[i + 1].gegen)) return false;
      }
      return t[0].N === 88 && t[t.length - 1].N === 124;
    },
    why: 'the Gegenbauer-only tail (N in {88..124}) is the N-trend gap: it descends monotonically at T=800 with no Legendre partner, since imp-96749 is capped at N=76.',
  },
  {
    id: 'imp96894-measurement-only-no-qed',
    holds: () =>
      IMP96894_VERDICT.rayleighFloorIsUpperBound === true &&
      IMP96894_VERDICT.operatorPositivityProved === false &&
      IMP96894_VERDICT.uniformNGapSettled === false &&
      IMP96894_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96894_VERDICT.qed === false,
    why: 'measurement only: the floor is an UPPER bound, no operator positivity is proved, the uniform-in-N gap stays unsettled, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96894_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96894-krein-ln3-legendre-gegenbauer-crossbasis assertion failed: ${a.id}`);
  }
}

void LN3;
