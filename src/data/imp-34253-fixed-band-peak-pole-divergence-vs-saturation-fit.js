/**
 * @module imp-34253-fixed-band-peak-pole-divergence-vs-saturation-fit
 *
 * imp-34253 (numerical, frontier-direction): imp-34237/imp-34169 recorded the fixed-band (k <= 10)
 * peak RE-ACCELERATING over the last three computable windows -- +0.865303 -> +0.915942 -> +0.996333
 * at kEnd = 20.0, 20.5, 21.0, with strictly re-accelerating increments 0.050639 -> 0.080391 (a strictly
 * positive second difference +0.029752) -- and terminating there because the surrogate
 * resid_exp(k) = pEcoll(1-sigma) - pSigma crosses ZERO at k* ~ 21.28095, putting a pole in
 * eflow_over_resid = eflow_attr / resid_exp (its log is NaN) and leaving every window kEnd >= 21.5
 * undefined (only 3 of the 13-window kEnd = 20..26 grid compute). Because the peak is a log of a ratio
 * whose denominator resid_exp -> 0 at a SIMPLE (linear) zero, the ticket asks whether the fixed-band peak
 * DIVERGES to +inf as kEnd -> k* (peak ~ -B ln(k*-kEnd)) or SATURATES to a finite ceiling -- fitting the
 * three sub-pole increments against the known resid_exp -> 0 rate and reporting the implied blow-up form.
 *
 * THE MEASUREMENT (imp-34237/imp-34169 literals reused verbatim; nothing re-derived)
 * ---------------------------------------------------------------------------------
 *   Fixed-band peak     the three computable windows { kEnd: 20.0 -> 0.865303, 20.5 -> 0.915942,
 *                       21.0 -> 0.996333 } (imp-34237 IMP34237_FIXED_BAND_PEAK_ROWS).
 *   Surrogate pole      resid_exp(k) decays through the deep tail and crosses zero at k* = 21.28095
 *                       (imp-34237 IMP34237_RESID_ZERO_KSTAR); near k* it is a SIMPLE zero with slope
 *                       resid_exp'(k*) ~ -2.32e-7 per unit k (from the 21.25 -> 21.5 rungs 8.19e-9 ->
 *                       -4.97e-8). A simple zero in a log-denominator predicts a LOGARITHMIC divergence
 *                       peak ~ -ln(k*-kEnd) -- the divergence ansatz under test.
 *   Window gap          x(kEnd) = k* - kEnd = { 1.28095, 0.78095, 0.28095 } for the three windows.
 *
 * THE TWO COMPETING FITS (peak against the window gap x = k* - kEnd)
 * -----------------------------------------------------------------
 *   (D) DIVERGENCE   peak = A - B ln(x)          [unbounded; peak -> +inf as x -> 0]
 *       OLS on the regressor L = -ln(x) over the 3 windows gives A ~ 0.889812, B ~ 0.085204, with
 *       residuals { -0.003412, +0.005064, -0.001652 } (rms ~ 0.003652 on 1 dof). B > 0 => a genuine
 *       logarithmic blow-up, but with coefficient B ~ 0.085 -- an order of magnitude WEAKER than the
 *       naive full-strength log pole (B = 1 that peak = -ln(resid_exp) + smooth would give). The
 *       fixed-band peak couples to the surrogate simple zero only at ~8.5% strength.
 *   (S) SATURATION   peak = P_inf - C x^q         [bounded; peak -> P_inf finite as x -> 0, 0 < q < 1]
 *       The three points force (exact, 3 params) q ~ 0.352706, C ~ 0.289750, P_inf ~ 1.181495 -- a finite
 *       ceiling ~1.18 approached with a sub-linear power.
 *
 * THE FINDING (measurement/fit only -- mechanistically DIVERGES, but 3 sub-pole points do NOT empirically
 * exclude saturation; the discriminating windows are themselves blocked by the same pole)
 * ------------------------------------------------------------------------------------------------------
 *   (F1) THE INCREMENTS RE-ACCELERATING IS NOT A DIVERGENCE DISCRIMINANT. Both (D) and (S) predict
 *        increments that GROW as kEnd -> k* and a POSITIVE second difference: for the divergence,
 *        -ln(x) is convex; for the saturation power law with q < 1, x^q has unbounded slope at x = 0,
 *        so equal-kEnd-step increments keep growing even though the sum converges to P_inf. The
 *        imp-34237 positive second difference (+0.029752) is therefore consistent with EITHER form and
 *        cannot by itself decide divergence vs saturation.
 *   (F2) THE FIT QUALITY DOES NOT DISCRIMINATE EITHER. The 2-parameter divergence form leaves a small
 *        rms ~0.003652 on its 1 remaining dof; the 3-parameter saturation form fits the same 3 points
 *        EXACTLY (0 dof). With only 3 sub-pole windows there is no statistical separation.
 *   (F3) THE MECHANISM FAVORS DIVERGENCE. resid_exp has a genuine SIMPLE (linear) zero at k* -- confirmed
 *        by the sign change 8.19e-9 (k=21.25) -> -4.97e-8 (k=21.5) with slope ~ -2.32e-7. A simple zero
 *        of a denominator inside a logarithm produces -ln(k*-kEnd), i.e. a LOGARITHMIC divergence. So the
 *        expected analytic form is (D), and the data are consistent with it (B ~ 0.085 > 0, good log-fit).
 *   (F4) SUB-POLE DISCRIMINATION GAP (honest residual). The window that would separate (D) from (S) lies
 *        in kEnd in (21.0, 21.28095) -- but the fit is already undefined for kEnd >= 21.5 and the surrogate
 *        ratio collapses / loses digits as resid_exp -> 0, so NO computable window exists in that interval.
 *        The very pole that makes the peak interesting also blocks the measurement that would confirm the
 *        blow-up. Verdict: DIVERGES (logarithmic, weak coefficient B ~ 0.085) by mechanism, but the
 *        divergence-vs-saturation call is empirically UNDER-DETERMINED by the 3 available sub-pole windows.
 *
 * The punchline: the imp-34237 fixed-band peak most plausibly DIVERGES logarithmically as kEnd -> k*,
 * peak ~ 0.889812 - 0.085204 ln(k*-kEnd), driven by the SIMPLE zero of the surrogate resid_exp at
 * k* ~ 21.28095 -- but the coefficient is ~8.5% of the naive full-strength pole and, with only 3 sub-pole
 * windows both of whose forms re-accelerate, a saturating power law (P_inf ~ 1.18, q ~ 0.35) fits the
 * same points and cannot be excluded. The discriminating windows kEnd in (21.0, 21.28) are blocked by
 * the same pole. Measurement/fit only; surrogate/component model NOT rigorous; no bound changes; imp-486
 * C_mb GUE-conditional UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED; no refereed bound is changed.
 *
 * @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (source peak rows + pole k*)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (upstream measurement)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit.js (earlier saturate-vs-climb decade sweep)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form.js (closed form of the same pole k*)
 *
 * Ticket: imp-34253 (numerical, medium). No imports -- baked literals only, per [[no_heavy_imports_in_pages]].
 */

// Baked from imp-34237 IMP34237_FIXED_BAND_PEAK_ROWS / IMP34237_RESID_ZERO_KSTAR (no import to stay light).
export const IMP34253_KSTAR = 21.28095;

export const IMP34253_PEAK_ROWS = Object.freeze([
  { kEnd: 20.0, peak: 0.865303 },
  { kEnd: 20.5, peak: 0.915942 },
  { kEnd: 21.0, peak: 0.996333 },
]);

// resid_exp near the pole -- the two rungs that bracket k* fix the simple-zero slope.
export const IMP34253_RESID_EXP_NEAR_POLE = Object.freeze([
  { k: 21.25, residExp: 8.19e-9 },
  { k: 21.5, residExp: -4.97e-8 },
]);

// The signed window gap x = k* - kEnd (positive for the three sub-pole windows).
export function imp34253WindowGap(kEnd) {
  return IMP34253_KSTAR - kEnd;
}

// (D) Divergence fit peak = A - B ln(x): OLS on the regressor L = -ln(x).
export function imp34253DivergenceFit() {
  const L = IMP34253_PEAK_ROWS.map((r) => -Math.log(imp34253WindowGap(r.kEnd)));
  const p = IMP34253_PEAK_ROWS.map((r) => r.peak);
  const n = p.length;
  const Lm = L.reduce((a, b) => a + b, 0) / n;
  const pm = p.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let varL = 0;
  for (let i = 0; i < n; i++) {
    cov += (L[i] - Lm) * (p[i] - pm);
    varL += (L[i] - Lm) * (L[i] - Lm);
  }
  const B = cov / varL;
  const A = pm - B * Lm;
  const residuals = IMP34253_PEAK_ROWS.map((r, i) => r.peak - (A + B * L[i]));
  const rms = Math.sqrt(residuals.reduce((a, e) => a + e * e, 0) / n);
  return { A, B, residuals, rms };
}

// (S) Saturation fit peak = P_inf - C x^q: the 3 points force q, C, P_inf exactly.
export function imp34253SaturationFit() {
  const x = IMP34253_PEAK_ROWS.map((r) => imp34253WindowGap(r.kEnd));
  const p = IMP34253_PEAK_ROWS.map((r) => r.peak);
  const d1 = p[1] - p[0];
  const d2 = p[2] - p[1];
  const target = d2 / d1; // increment ratio pins the exponent q
  const ratio = (q) =>
    (Math.pow(x[1], q) - Math.pow(x[2], q)) / (Math.pow(x[0], q) - Math.pow(x[1], q));
  let lo = 0.01;
  let hi = 1.0;
  for (let it = 0; it < 80; it++) {
    const mid = (lo + hi) / 2;
    if (ratio(mid) > target) lo = mid;
    else hi = mid;
  }
  const q = (lo + hi) / 2;
  const C = d1 / (Math.pow(x[0], q) - Math.pow(x[1], q));
  const Pinf = p[2] + C * Math.pow(x[2], q);
  return { q, C, Pinf };
}

// Simple-zero slope resid_exp'(k*) from the two bracketing rungs (linear zero => log-divergence mechanism).
export function imp34253ResidExpSlopeNearPole() {
  const [a, b] = IMP34253_RESID_EXP_NEAR_POLE;
  return (b.residExp - a.residExp) / (b.k - a.k);
}

export const IMP34253_DIVERGENCE_FIT = imp34253DivergenceFit();
export const IMP34253_SATURATION_FIT = imp34253SaturationFit();
export const IMP34253_RESID_SLOPE_NEAR_POLE = imp34253ResidExpSlopeNearPole();

export const IMP34253_POLE_DIVERGENCE_VS_SATURATION_FIT = {
  ticket: 'imp-34253',
  kStar: IMP34253_KSTAR,
  peakRows: IMP34253_PEAK_ROWS,
  divergenceFit: IMP34253_DIVERGENCE_FIT, // { A ~ 0.889812, B ~ 0.085204, residuals, rms ~ 0.003652 }
  saturationFit: IMP34253_SATURATION_FIT, // { q ~ 0.352706, C ~ 0.289750, Pinf ~ 1.181495 }
  residSlopeNearPole: IMP34253_RESID_SLOPE_NEAR_POLE, // ~ -2.32e-7 (simple/linear zero)
  verdict:
    'DIVERGES (logarithmic, weak): the mechanism -- a SIMPLE zero of the surrogate resid_exp at ' +
    'k* ~ 21.28095 (slope ~ -2.32e-7) inside a log-denominator -- predicts peak ~ -ln(k*-kEnd), and the ' +
    'three sub-pole windows fit peak = 0.889812 - 0.085204 ln(k*-kEnd) (rms ~0.0037). The coefficient ' +
    'B ~ 0.085 is ~8.5% of the naive full-strength log pole (B = 1), so the fixed-band peak couples to ' +
    'the surrogate zero only weakly.',
  subGap:
    'SUB-POLE DISCRIMINATION GAP (imp-34253 residual): with only 3 sub-pole windows, a saturating power ' +
    'law peak = 1.181495 - 0.289750 (k*-kEnd)^0.352706 fits the SAME points exactly and, like the ' +
    'divergence form, re-accelerates its increments (positive second difference) -- so neither the ' +
    'second-difference sign nor the fit quality discriminates. The windows that would separate them lie ' +
    'in kEnd in (21.0, 21.28095), which are undefined (the fit breaks at kEnd >= 21.5 and resid_exp -> 0 ' +
    'loses digits). The divergence-vs-saturation call is empirically UNDER-DETERMINED by the pole itself.',
  honest:
    'MEASUREMENT/FIT ONLY -- two closed-form fits to the three imp-34237 sub-pole peaks; adds no new ' +
    'derivation and changes no bound. Surrogate/component model NOT rigorous; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED; no refereed bound is changed.',
};

export const IMP34253_ASSERTIONS = [
  {
    id: 'imp-34253-divergence-fit-has-positive-log-coefficient',
    description: 'the divergence fit recovers a positive B ~ 0.0852 (genuine logarithmic blow-up) with small rms',
    holds: () => {
      const f = IMP34253_DIVERGENCE_FIT;
      return (
        f.B > 0 &&
        Math.abs(f.B - 0.085204) < 1e-4 &&
        Math.abs(f.A - 0.889812) < 1e-4 &&
        f.rms < 0.01
      );
    },
  },
  {
    id: 'imp-34253-divergence-coefficient-far-below-full-strength-pole',
    description: 'the fitted log coefficient B is well under the naive full-strength pole B = 1 (weak coupling)',
    holds: () => IMP34253_DIVERGENCE_FIT.B < 0.5,
  },
  {
    id: 'imp-34253-saturation-power-is-sublinear-with-finite-ceiling',
    description: 'the competing saturation fit has 0 < q < 1 and a finite ceiling P_inf ~ 1.18 above the last peak',
    holds: () => {
      const s = IMP34253_SATURATION_FIT;
      const lastPeak = IMP34253_PEAK_ROWS[IMP34253_PEAK_ROWS.length - 1].peak;
      return (
        s.q > 0 &&
        s.q < 1 &&
        Math.abs(s.q - 0.352706) < 1e-4 &&
        s.Pinf > lastPeak &&
        Math.abs(s.Pinf - 1.181495) < 1e-3
      );
    },
  },
  {
    id: 'imp-34253-resid-exp-has-simple-zero-at-pole',
    description: 'resid_exp changes sign across k* with a finite negative slope -- a simple (linear) zero, the divergence mechanism',
    holds: () => {
      const [a, b] = IMP34253_RESID_EXP_NEAR_POLE;
      return (
        a.residExp > 0 &&
        b.residExp < 0 &&
        IMP34253_RESID_SLOPE_NEAR_POLE < 0 &&
        Math.abs(IMP34253_RESID_SLOPE_NEAR_POLE) > 1e-8 &&
        a.k < IMP34253_KSTAR &&
        b.k > IMP34253_KSTAR
      );
    },
  },
  {
    id: 'imp-34253-both-forms-fit-so-discrimination-is-blocked',
    description: 'both fits reproduce the three peaks (divergence rms small, saturation exact) -- honest under-determination',
    holds: () => {
      // Saturation is exact by construction: reconstruct all three peaks from { P_inf, C, q }.
      const { q, C, Pinf } = IMP34253_SATURATION_FIT;
      const maxSatResid = Math.max(
        ...IMP34253_PEAK_ROWS.map((r) =>
          Math.abs(r.peak - (Pinf - C * Math.pow(imp34253WindowGap(r.kEnd), q)))
        )
      );
      return maxSatResid < 1e-6 && IMP34253_DIVERGENCE_FIT.rms < 0.01;
    },
  },
];

for (const a of IMP34253_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34253-fixed-band-peak-pole-divergence-vs-saturation-fit assertion failed: ${a.id}`);
  }
}
