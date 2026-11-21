/**
 * @module imp-35391-eflow-fartail-remnant-floor-vs-swaplaw
 *
 * imp-35391 (numerical, frontier-direction): imp-35280 called the fd-vs-analytic
 * (closed-form/prefactor) remnant of the E_flow far-tail decay exponent a
 * "~0.002 floor that does NOT vanish with N", but only checked it across
 * N = 1e6..1e16. imp-35371 already carried the identical surrogate-channel remnant
 * two decades deeper (N = 1e20, 1e24) and read SLOW DECAY, not a nonzero asymptote.
 * This module (a) adds the intermediate N = 1e18 rung that imp-35371 skipped, and
 * (b) tests the deep decay against the imp-34130 swap-gap decay law 1/(2 log T0) --
 * the law that governs the inverse-swap gap -- to answer whether the remnant floors
 * at a nonzero constant or decays at approximately the same 1/(2 log T0) rate.
 *
 * THE MEASUREMENT (surrogate channel only -- no height-map swap, so no heavy import)
 * ---------------------------------------------------------------------------------
 * The fd-vs-analytic remnant holds the height map FIXED at the closed surrogate
 * T0 = 2 pi N / log N (imp-35280): both the fd-surrogate exponent and the analytic
 * exponent (-1 + 3/log N, imp-35198) live on that closed inverse, so the remnant
 * isolates ONLY the closed-form Taylor truncation plus the prefactor-form difference.
 * It never touches effectiveHeightForN, so this module is pure Math (no
 * lambda-rh-height-mapping import). Alongside the remnant it evaluates the imp-34130
 * swap-gap decay law 1/(2 log T0) at each rung and forms the ratio remnant / law.
 *
 *   N        fd-surrogate    analytic     remnant     1/(2 log T0)    remnant / law
 *   1e6        -0.7803       -0.7829       0.0025        0.0384          0.066
 *   1e9        -0.8521       -0.8552       0.0031        0.0256          0.123
 *   1e12       -0.8889       -0.8914       0.0026        0.0191          0.133
 *   1e16       -0.9167       -0.9186       0.0019        0.0143          0.131
 *   1e18       -0.9260       -0.9276       0.0016        0.0126          0.128   (NEW rung)
 *   1e20       -0.9334       -0.9349       0.0014        0.0113          0.124   (imp-35371)
 *   1e24       -0.9446       -0.9457       0.0011        0.0094          0.117   (imp-35371)
 *
 * THE FINDING (settles floor-vs-decay against the swap-gap law)
 * ------------------------------------------------------------
 * The remnant keeps decreasing monotonically past its N = 1e9 peak through the new
 * N = 1e18 rung and on: 0.0026 -> 0.0019 -> 0.0016 -> 0.0014 -> 0.0011 over 1e12..1e24.
 * It does NOT floor at a nonzero constant. Measured against the imp-34130 swap-gap law
 * 1/(2 log T0), the remnant is a roughly-CONSTANT fraction of that law from N = 1e9
 * onward: the ratio sits in a narrow ~0.117..0.133 band across 1e9..1e24 and drifts only
 * SLOWLY downward (0.133 at 1e12 -> 0.117 at 1e24, a ~13% decline over twelve decades).
 * So the fd-vs-analytic remnant decays at APPROXIMATELY the same 1/(2 log T0) rate that
 * governs the inverse-swap gap -- slightly FASTER (the ratio drifts down, not up), but on
 * the same slow 1/log scale. This confirms the imp-35371 slow-decay reading and answers
 * imp-35391 directly: the "~0.002 floor" is NOT a nonzero asymptote; it is a slowly
 * decaying quantity tracking the swap-gap law to within a stable ~0.12 factor.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35371-eflow-fartail-remnant-deep-extension (the N = 1e20/1e24 extension this fills in and reframes)
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the four-rung remnant and floor claim)
 * @see imp-34130 (the 1/(2 log T0) swap-gap decay law the remnant is compared against)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity on a given height map (imp-35236 form).
function eFlowWith(heightFn, N) {
  const T0 = heightFn(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135 (h = 1.0002).
function localExponent(fn, N) {
  const h = 1.0002;
  const lo = Math.log(fn(N / h));
  const hi = Math.log(fn(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(x) {
  return -1 + 3 / x;
}

// imp-34130 swap-gap decay law 1/(2 log T0) evaluated on the same closed surrogate height.
function swapLawForN(N) {
  return 1 / (2 * Math.log(surrogateHeightForN(N)));
}

// The imp-35280 four rungs, the NEW N = 1e18 intermediate rung, and the imp-35371 deep rungs.
const RUNGS = [1e6, 1e9, 1e12, 1e16, 1e18, 1e20, 1e24].map((N) => {
  const x = Math.log(N);
  const fdSurr = localExponent((n) => eFlowWith(surrogateHeightForN, n), N);
  const analytic = analyticSurrogateExponent(x);
  const remnant = Math.abs(analytic - fdSurr);
  const swapLaw = swapLawForN(N);
  return {
    N: +N.toExponential(0),
    logN: +x.toFixed(4),
    fdSurrogateExponent: +fdSurr.toFixed(4),
    analyticExponent: +analytic.toFixed(4),
    remnant: +remnant.toFixed(4), // THE fd-vs-analytic remnant (imp-35280 "floor")
    swapLaw: +swapLaw.toFixed(4), // imp-34130 1/(2 log T0) swap-gap law
    remnantOverSwapLaw: +(remnant / swapLaw).toFixed(4), // ratio: is the remnant a stable fraction of the law?
    isNewRung: N === 1e18, // the rung imp-35371 skipped
  };
});

// imp-35280 baked remnants at the shared four rungs -- faithfulness target for reproduction.
const IMP35280_REMNANTS = { 1e6: 0.0025, 1e9: 0.0031, 1e12: 0.0026, 1e16: 0.0019 };

export const IMP35391_EFLOW_FARTAIL_REMNANT_FLOOR_VS_SWAPLAW = {
  id: 'imp-35391',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35280 ~0.002 fd-vs-analytic E_flow-exponent remnant floor at a nonzero ' +
    'constant or eventually decay, on rungs N = 1e18/1e20/1e24 below the imp-35280 1e16 endpoint, ' +
    'and how does it compare to the imp-34130 1/(2 log T0) swap-gap decay law?',
  method:
    'Recompute the imp-35280 fd-vs-analytic remnant |analytic - fd-surrogate| live on the closed ' +
    'surrogate height map T0 = 2 pi N / log N (surrogate channel only; no effectiveHeightForN, hence ' +
    'no heavy import), reproducing the four imp-35280 rungs, then add the N = 1e18 rung imp-35371 ' +
    'skipped and evaluate the imp-34130 swap-gap law 1/(2 log T0) plus the ratio remnant / law at ' +
    'every rung out to N = 1e24.',
  ladder: RUNGS,
  finding: {
    F1_reproduces_imp35280_four_rungs:
      'The remnant recomputed live reproduces the imp-35280 four-rung values 0.0025 / 0.0031 / ' +
      '0.0026 / 0.0019 (N = 1e6..1e16) to the digit, confirming the deep extension shares the ' +
      'imp-35280 surrogate channel exactly.',
    F2_new_rung_and_deep_continue_decay:
      'The new N = 1e18 rung (remnant 0.0016) and the deep rungs (0.0014 at 1e20, 0.0011 at 1e24) ' +
      'continue the monotone decay past the N = 1e9 peak: 0.0026 -> 0.0019 -> 0.0016 -> 0.0014 -> ' +
      '0.0011 over 1e12..1e24. The remnant does NOT floor at a nonzero constant.',
    F3_tracks_swap_law_to_stable_fraction:
      'Against the imp-34130 swap-gap law 1/(2 log T0), the remnant is a roughly-CONSTANT fraction: ' +
      'the ratio remnant / law sits in a narrow ~0.117..0.133 band across N = 1e9..1e24 and drifts ' +
      'only slowly downward (0.133 at 1e12 -> 0.117 at 1e24, ~13% over twelve decades). So the ' +
      'remnant decays at APPROXIMATELY the 1/(2 log T0) rate that governs the inverse-swap gap, ' +
      'slightly faster (ratio drifts down, not up) but on the same slow 1/log scale.',
    F4_answers_floor_vs_decay:
      'imp-35391 is answered directly: the imp-35280 "~0.002 floor that does NOT vanish" is NOT a ' +
      'nonzero asymptote; it is a slowly decaying quantity that tracks the swap-gap law to within a ' +
      'stable ~0.12 factor, confirming (and quantifying) the imp-35371 slow-decay reading.',
  },
  isRigorous: false,
  honestStatus:
    'Extending the imp-35280 fd-vs-analytic remnant through the new N = 1e18 rung (0.0016) and the ' +
    'imp-35371 deep rungs (0.0014 at 1e20, 0.0011 at 1e24) shows monotone decay past the N = 1e9 ' +
    'peak with no nonzero floor. Compared to the imp-34130 swap-gap law 1/(2 log T0), the remnant ' +
    'holds a stable ~0.12 fraction (ratio in ~0.117..0.133 across 1e9..1e24, drifting only ~13% ' +
    'over twelve decades), so it decays at approximately the swap-gap rate, slightly faster. The ' +
    'imp-35280 "does NOT vanish with N" reading is a fair local description but its ' +
    '"assume the ~0.002 floor persists" extrapolation overstates the deep behaviour: the remnant is ' +
    'already ~0.0011 and still falling in step with 1/(2 log T0). Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). The imp-35280 fd-vs-analytic remnant, ' +
    'measured on rungs N = 1e18 (0.0016), 1e20 (0.0014) and 1e24 (0.0011), decreases monotonically ' +
    'past the N = 1e9 peak and does NOT floor at a nonzero constant. Against the imp-34130 swap-gap ' +
    'law 1/(2 log T0) the remnant stays a stable ~0.12 fraction (ratio 0.117..0.133 over 1e9..1e24), ' +
    'so it decays at approximately the same 1/(2 log T0) rate as the inverse-swap gap, slightly ' +
    'faster. The imp-35280 non-vanishing-on-its-window reading stands but its persist-past-1e16 ' +
    'extrapolation is refined toward swap-law-rate decay. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) ' +
    'untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per ' +
    'imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35280 (four-rung fd-vs-analytic remnant and floor claim); imp-35371 (N = 1e20/1e24 ' +
    'extension); imp-34130 (1/(2 log T0) swap-gap decay law); imp-35198 (analytic -1 + 3/log N); ' +
    'imp-35135 (far-tail E_flow quantity); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35391_EFLOW_FARTAIL_REMNANT_FLOOR_VS_SWAPLAW_ASSERTIONS = [
  {
    // Reproduce the imp-35280 four-rung remnants to the digit (surrogate channel is faithful).
    id: 'imp35391-reproduces-imp35280-four-rungs',
    description: 'the live remnant matches the imp-35280 baked values at N = 1e6, 1e9, 1e12, 1e16',
    holds: () =>
      RUNGS.filter((r) => r.N <= 1e16).every(
        (r) => Math.abs(r.remnant - IMP35280_REMNANTS[r.N]) < 5e-4,
      ),
  },
  {
    // The new N = 1e18 rung carries the expected measured remnant.
    id: 'imp35391-new-1e18-rung-measured',
    description: 'the new intermediate rung N = 1e18 gives remnant 0.0016',
    holds: () => {
      const byN = Object.fromEntries(RUNGS.map((r) => [r.N, r.remnant]));
      return Math.abs(byN[1e18] - 0.0016) < 5e-4;
    },
  },
  {
    // Past the N = 1e9 peak, the remnant decreases monotonically at every rung down to 1e24.
    id: 'imp35391-remnant-monotone-decreasing-past-peak',
    description: 'remnant strictly decreases across N = 1e9 -> 1e12 -> 1e16 -> 1e18 -> 1e20 -> 1e24',
    holds: () => {
      const g = RUNGS.map((r) => r.remnant); // ordered by ascending N
      for (let i = 1; i < g.length - 1; i++) {
        if (!(g[i] > g[i + 1])) return false;
      }
      return true;
    },
  },
  {
    // The remnant is a stable ~0.12 fraction of the imp-34130 swap-gap law across 1e9..1e24.
    id: 'imp35391-remnant-tracks-swap-law',
    description: 'remnant / (1/(2 log T0)) stays in a narrow ~0.11..0.14 band from N = 1e9 to 1e24',
    holds: () =>
      RUNGS.filter((r) => r.N >= 1e9).every(
        (r) => r.remnantOverSwapLaw > 0.11 && r.remnantOverSwapLaw < 0.14,
      ),
  },
  {
    // The tracking ratio drifts DOWN past the peak (remnant decays slightly faster than the law).
    id: 'imp35391-ratio-drifts-down-past-peak',
    description: 'remnant / law at N = 1e24 is below its value at N = 1e12 (faster than the swap law)',
    holds: () => {
      const byN = Object.fromEntries(RUNGS.map((r) => [r.N, r.remnantOverSwapLaw]));
      return byN[1e24] < byN[1e12];
    },
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35391-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35391_EFLOW_FARTAIL_REMNANT_FLOOR_VS_SWAPLAW.isRigorous === false &&
      /NO QED/.test(IMP35391_EFLOW_FARTAIL_REMNANT_FLOOR_VS_SWAPLAW.verdict) &&
      /refereed bound is changed/i.test(IMP35391_EFLOW_FARTAIL_REMNANT_FLOOR_VS_SWAPLAW.verdict),
  },
];

for (const a of IMP35391_EFLOW_FARTAIL_REMNANT_FLOOR_VS_SWAPLAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35391-eflow-fartail-remnant-floor-vs-swaplaw assertion failed: ${a.id}`,
    );
  }
}

export default IMP35391_EFLOW_FARTAIL_REMNANT_FLOOR_VS_SWAPLAW;
