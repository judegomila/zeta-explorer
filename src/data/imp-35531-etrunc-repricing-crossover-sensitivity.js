/**
 * @module imp-35531-etrunc-repricing-crossover-sensitivity
 *
 * imp-35531 (accuracy/sensitivity, S-frontier): assess what an HONESTLY-PRICED
 * count integral would yield for E_trunc -- replacing the vestigial C_T = 1, B = 0
 * idealization the recorded 3.06e-5 encodes (imp-2631, flagged mispriced by
 * imp-35419/imp-35459) with realistic explicit zero-density constants (C_T >> 1,
 * B >= 2) -- and MEASURE how the imp-33723 sigma E_coll=E_trunc crossover landmark
 * N_cross ~ 3.280294e9 shifts across a plausible repriced-E_trunc range.
 *
 * THE SENSITIVITY LAW (why the landmark is fragile)
 * -----------------------------------------------------------------------------
 * The crossover N_cross(E_trunc) solves E_coll(N) = E_trunc on the inherited
 * imp-3220/imp-3406 surrogate, with E_coll(N) = C_C_PINNED * sqrt(L/N),
 * L = log T0(N), T0 = effectiveHeightForN(N) (identical model to imp-35042). Since
 * E_coll DECREASES in N and L varies only logarithmically,
 *     N_cross ~ (C_C / E_trunc)^2 * L(N_cross),   i.e.   N_cross ~ E_trunc^{-2}.
 * So a repricing factor f = E_trunc_new / 3.06e-5 moves the crossover by ~ f^{-2}
 * (a bounded +L-correction rides on top). The crossover is thus DOUBLY-EXPONENTIALLY
 * sensitive to the E_trunc floor in decades: every honest explicit repricing makes
 * E_trunc LARGER (imp-35459 Part C -- the explicit direction runs the wrong way),
 * which drives N_cross DOWN by twice as many decades as E_trunc rises.
 *
 * MEASURED SHIFTS (offline bisection of the exact self-consistent crossover;
 * scripts/imp-35531-etrunc-repricing-crossover-sensitivity.mjs -- baseline
 * reproduces the imp-33723 headline 3.280294e9 to all printed figures)
 * -----------------------------------------------------------------------------
 *   E_trunc source                              E_trunc     f        N_cross      d(dec)
 *   clean C_T=1,B=0 (imp-2631 recorded)         3.06e-5     1.00     3.2803e9      0.000
 *   parts-corrected C_T=1,B=0 (imp-34791 R2)    5.106e-5    1.67     1.1207e9     -0.466
 *   Kadiri-Lumley-Ng 2021 (sigma=0.9)           1.22e-3     39.9     1.3431e6     -3.388
 *   Chourasiya-Simonic 2025 (explicit 3/4)      3.34        1.09e5   3.7642e-2   -10.940
 *   Ramare 2016 (sigma=3/4)                     1.67e5      5.46e9    below floor  (~ -19.5 predicted)
 * The measured decade shifts track the frozen-L f^{-2} law (-2 log10 f) to within
 * ~0.9 decade over the whole in-range menu; the L-correction is subdominant.
 *
 * VERDICT: the N_cross ~ 3.28e9 landmark exists ONLY at the optimistic C_T=1,B=0
 * floor 3.06e-5. The sharpest honest explicit constant (Chourasiya-Simonic 2025)
 * collapses the crossover ~10.9 decades to 3.76e-2 -- far below the PT-verified
 * height anchor T_PT=3e12 and below any physically meaningful zero index, so the
 * crossover ceases to be a landmark at all; Ramare pushes it out of the model range
 * entirely. Therefore N_cross ~ 3.28e9 is NOT robust to E_trunc repricing -- it is an
 * artifact of the vestigial C_T=1,B=0 idealization, consistent with the imp-35419/
 * imp-35459 reclassification of 3.06e-5 as a mispriced count value with no Lambda
 * leverage. Measurement/sensitivity only; re-derives NO new certified E_trunc;
 * changes no bound; C_mb GUE-conditional per imp-486; NO QED. No refereed bound is changed.
 *
 * @see imp-35459-etrunc-ct-kappat-dependence-scope (the C_T/kappa_T functional form + repricing menu)
 * @see imp-35419-etrunc-barrier-lemma-porting-scope (the barrier reclassification the sensitivity confirms)
 * @see imp-35042-inflection-offset (the identical surrogate crossover model + effectiveHeightForN channel)
 * @see imp-33723 (the E_coll=E_trunc Banach fixed-point crossover, closed form, headline 3.280294e9)
 * @see imp-2631 (the recorded fixed-strip E_trunc = 3.06e-5); imp-35489 (its closed-form literal recompute)
 */

const E_TRUNC_RECORDED = 3.06e-5; // imp-2631 recorded floor (C_T = 1, B = 0 idealization)
const N_CROSS_HEADLINE = 3.280294e9; // imp-33723 baseline crossover (baked; offline baseline reproduces it)

// Repriced-E_trunc menu with the offline-measured self-consistent crossover N_cross.
// N_cross === null marks a repricing that drives the crossover out of the model range.
const REPRICING_ROWS = [
  { label: 'clean C_T=1,B=0 (imp-2631 recorded)', eTrunc: 3.06e-5, nCross: 3.2803e9, decShift: 0.0 },
  { label: 'parts-corrected C_T=1,B=0 (imp-34791 R2)', eTrunc: 5.106e-5, nCross: 1.1207e9, decShift: -0.466 },
  { label: 'Kadiri-Lumley-Ng 2021 (sigma=0.9)', eTrunc: 1.22e-3, nCross: 1.3431e6, decShift: -3.388 },
  { label: 'Chourasiya-Simonic 2025 (explicit 3/4)', eTrunc: 3.34, nCross: 3.7642e-2, decShift: -10.94 },
  { label: 'Ramare 2016 (sigma=3/4)', eTrunc: 1.67e5, nCross: null, decShift: -19.47 }, // out of range; f^-2 prediction
];

const T_PT = 3e12; // Platt-Trudgian 2021 verified height anchor
const CS_DECADE_COLLAPSE = 10.94; // Chourasiya-Simonic honest-explicit crossover collapse (decades below 3.28e9)

export const IMP35531_ETRUNC_REPRICING_CROSSOVER_SENSITIVITY = {
  id: 'imp-35531',
  proofSection: 'S-frontier',
  question:
    'Assess what an honestly-priced count integral (realistic C_T, nonzero B) would yield for E_trunc ' +
    'in place of the vestigial C_T=1, B=0 idealization (imp-35419/imp-35459), and MEASURE how the ' +
    'sigma E_coll=E_trunc crossover landmark N_cross ~ 3.28e9 shifts under a plausible repriced range. ' +
    'Assessment/sensitivity only; re-derives no new certified E_trunc; changes no bound; NO QED.',
  sensitivityLaw:
    'N_cross(E_trunc) solves E_coll(N) = C_C_PINNED*sqrt(L/N) = E_trunc on the imp-3220/imp-3406 ' +
    'surrogate; E_coll decreases in N and L is logarithmic, so N_cross ~ (C_C/E_trunc)^2 * L ~ E_trunc^{-2}. ' +
    'A repricing factor f moves the crossover by ~ f^{-2} (bounded +L-correction), so the landmark is ' +
    'doubly sensitive in decades: N_cross falls by ~2 log10 f for every decade E_trunc rises.',
  baseline: {
    eTruncRecorded: E_TRUNC_RECORDED, // 3.06e-5
    nCrossHeadline: N_CROSS_HEADLINE, // 3.280294e9 (imp-33723; offline baseline reproduces it)
  },
  repricingMenu: REPRICING_ROWS,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier, NOT rigorous). The N_cross ~ 3.28e9 crossover exists ONLY at ' +
    'the optimistic C_T=1, B=0 floor 3.06e-5. Honest explicit repricing makes E_trunc LARGER (imp-35459 ' +
    'Part C) and, via N_cross ~ E_trunc^{-2}, collapses the crossover by twice as many decades: the ' +
    'parts-corrected 5.106e-5 moves it -0.47 dec to 1.12e9; Kadiri-Lumley-Ng 1.22e-3 moves it -3.39 dec ' +
    'to 1.34e6; the sharpest explicit constant Chourasiya-Simonic 2025 (3.34) collapses it ~10.9 dec to ' +
    '3.76e-2 -- far below the PT-verified height anchor T_PT=3e12 and below any meaningful zero index, so ' +
    'the crossover ceases to be a landmark; Ramare 1.67e5 pushes it out of the model range entirely. So ' +
    'N_cross ~ 3.28e9 is NOT robust to E_trunc repricing -- it is an artifact of the vestigial C_T=1,B=0 ' +
    'idealization, consistent with the imp-35419/imp-35459 reclassification of 3.06e-5 as a mispriced ' +
    'count value with no Lambda leverage. Re-derives NO new certified E_trunc; changes no bound; C_mb ' +
    'GUE-conditional per imp-486; NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-35459 (E_trunc = (2 C_T/kappa_T)(log T_PT)^B T_PT^{-kappa_T} functional form + repricing menu; ' +
    'kappa_T locked, C_T/B direction runs wrong); imp-35419 (barrier-lemma reclassification); imp-35042 ' +
    '(identical surrogate crossover model + effectiveHeightForN); imp-33723 (E_coll=E_trunc crossover ' +
    '3.280294e9); imp-2631 (recorded E_trunc = 3.06e-5); imp-35489 (its literal recompute); ' +
    'Chourasiya-Simonic 2025; Kadiri-Lumley-Ng 2021; Ramare 2016; Platt-Trudgian 2021.',
};

export const IMP35531_ETRUNC_REPRICING_CROSSOVER_SENSITIVITY_ASSERTIONS = [
  {
    // Baseline: the recorded floor reproduces the imp-33723 headline crossover.
    id: 'imp35531-baseline-reproduces-headline',
    description: 'baseline E_trunc = 3.06e-5 places N_cross at the imp-33723 headline 3.280294e9',
    holds: () =>
      Math.abs(E_TRUNC_RECORDED - 3.06e-5) < 1e-12 &&
      Math.abs(REPRICING_ROWS[0].nCross - N_CROSS_HEADLINE) / N_CROSS_HEADLINE < 2e-5 &&
      Math.abs(REPRICING_ROWS[0].decShift) < 1e-9, // baseline shift is exactly zero
  },
  {
    // The frozen-L f^{-2} law: each in-range measured decade shift tracks -2 log10 f to within ~1 decade.
    id: 'imp35531-fminus2-law-tracks-measured-shifts',
    description: 'measured decade shifts track the frozen-L N_cross ~ E_trunc^{-2} law (-2 log10 f) within ~1 decade',
    holds: () =>
      REPRICING_ROWS.filter((r) => r.nCross !== null).every((r) => {
        const f = r.eTrunc / E_TRUNC_RECORDED;
        const pred = -2 * Math.log10(f);
        return Math.abs(r.decShift - pred) < 1.0; // L-correction bounded below one decade
      }),
  },
  {
    // imp-35566 regression guard: the coarse <1.0-decade bound above would still pass if a future
    // edit drifted the max deviation up toward 1.0 dec or down toward 0 -- neither matches the
    // documented "~0.9 decade" claim (module header + imp-35531 verdict). Pin the MAX deviation
    // across the in-range menu to a tight band around the recorded ~0.9-decade figure so a change
    // to REPRICING_ROWS or the law itself is caught, not silently absorbed by the loose bound.
    id: 'imp35566-fminus2-law-tight-tolerance-guard',
    description:
      'max deviation of measured decade shifts from the frozen-L -2 log10 f prediction across the ' +
      'in-range repricing menu stays within the recorded ~0.9-decade tolerance (documented max ~0.86 ' +
      'dec at Chourasiya-Simonic), tighter than the coarse <1.0 dec bound above',
    holds: () => {
      const inRange = REPRICING_ROWS.filter((r) => r.nCross !== null);
      const maxDev = Math.max(
        ...inRange.map((r) => {
          const f = r.eTrunc / E_TRUNC_RECORDED;
          const pred = -2 * Math.log10(f);
          return Math.abs(r.decShift - pred);
        })
      );
      return maxDev < 0.95 && maxDev > 0.8;
    },
  },
  {
    // Monotone collapse: larger E_trunc strictly lowers N_cross (the crossover is fragile, one-directional).
    id: 'imp35531-monotone-collapse',
    description: 'a larger repriced E_trunc strictly lowers N_cross across the in-range menu',
    holds: () => {
      const inRange = REPRICING_ROWS.filter((r) => r.nCross !== null);
      for (let i = 1; i < inRange.length; i++) {
        if (!(inRange[i].eTrunc > inRange[i - 1].eTrunc)) return false;
        if (!(inRange[i].nCross < inRange[i - 1].nCross)) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: the sharpest honest explicit repricing collapses the landmark below T_PT; NOT robust; NO QED.
    id: 'imp35531-not-robust-no-qed',
    description: 'Chourasiya-Simonic honest explicit collapses N_cross > 10 decades below 3.28e9 and below T_PT; landmark NOT robust; NO QED',
    holds: () => {
      const cs = REPRICING_ROWS.find((r) => /Chourasiya-Simonic/.test(r.label));
      return (
        CS_DECADE_COLLAPSE > 10 &&
        cs.nCross < 1 && // collapsed to sub-unity N -- no meaningful zero index
        cs.nCross < T_PT &&
        IMP35531_ETRUNC_REPRICING_CROSSOVER_SENSITIVITY.isRigorous === false &&
        /NOT robust/.test(IMP35531_ETRUNC_REPRICING_CROSSOVER_SENSITIVITY.verdict) &&
        /artifact of the vestigial/.test(IMP35531_ETRUNC_REPRICING_CROSSOVER_SENSITIVITY.verdict) &&
        /NO QED/.test(IMP35531_ETRUNC_REPRICING_CROSSOVER_SENSITIVITY.verdict) &&
        /refereed bound is changed/i.test(IMP35531_ETRUNC_REPRICING_CROSSOVER_SENSITIVITY.verdict)
      );
    },
  },
];

for (const a of IMP35531_ETRUNC_REPRICING_CROSSOVER_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35531-etrunc-repricing-crossover-sensitivity assertion failed: ${a.id}`);
  }
}
