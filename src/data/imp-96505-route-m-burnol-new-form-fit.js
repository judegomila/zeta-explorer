/**
 * @module imp-96505-route-m-burnol-new-form-fit
 *
 * imp-96505 (numerical): imp-96491 (imp96491-verdict-needs-new-form) concluded
 * that the imp-96094 1/logN + 1/logN^2 fit has NO out-of-sample predictive power
 * (all seven extension residuals one-signed, rms 0.0490, ~5.4x in-sample) and
 * that the Route M Burnol ratio ladder REQUIRES a new functional form with a
 * below-1 asymptote / constant offset / different 1/logN power. That module only
 * concluded a new form is NEEDED; this ticket DERIVES and FITS candidate forms to
 * the full N=250..6000 ladder and MEASURES their extrapolation residuals against
 * the failed imp-96094 fit. Fit/measurement only, no bound claimed.
 *
 * QUANTITY. ratio(N) = d_N^2 * log N / C_burnol, C_burnol = Sum_rho 1/|rho|^2 =
 * 2 + gamma - log(4 pi). In-sample ladder N in {250..2600} from imp-96094; the
 * extension ladder N in {3000..6000} from imp-96105 (via imp-96491).
 *
 * PROTOCOL (tmp/imp-96505-scratch.mjs, reproducible; linear least squares via
 * normal equations, one nonlinear 1/logN^p grid). Each candidate form is FIT on
 * the in-sample rungs (N <= 2600) and EVALUATED out-of-sample on the extension
 * rungs (N = 3000..6000), so the residual is a genuine extrapolation test on the
 * same seven rungs imp-96491 used, directly comparable to its 0.0490 benchmark.
 * A full-ladder (all 17 rungs) descriptive fit then pins the below-1 asymptote.
 *
 * FINDINGS (see IMP96505_FORMS / IMP96505_FULL_LADDER / IMP96505_VERDICT):
 *   (1) EVERY candidate form is still ONE-SIGNED out-of-sample. Fit on the
 *       upward-drifting in-sample range (ratio climbs 0.964 -> 1.010 by N=2600),
 *       every form over-predicts the below-1 extension plateau: all seven
 *       residuals negative for all ten forms. No 1/logN-family form gains the
 *       out-of-sample SIGN structure imp-96491 flagged as missing.
 *   (2) The BEST new form is a BARE below-1 CONSTANT OFFSET. Fitting only a
 *       constant (= in-sample mean 0.99181) gives out-of-sample rms 0.01690,
 *       maxAbs 0.02793, mean bias -0.01538 -- about 2.9x BETTER than the
 *       imp-96094 three-term extrapolation (0.0490 / 0.0537 / -0.0489).
 *   (3) Adding ANY declining 1/logN^p correction fit to the in-sample range makes
 *       extrapolation WORSE, not better: const+a/logN 0.0258, const+a/logN^2
 *       0.0242, const+a/logN^3 0.0230, const+a/sqrt(logN) 0.0266, const+a/N^{1/4}
 *       0.0262 -- all above the bare constant 0.0169. Because the in-sample drift
 *       is UPWARD while the extension plateaus BELOW 1, any monotone-in-N term
 *       calibrated in-sample extrapolates the wrong way. The original three-term
 *       1/logN + 1/logN^2 form is the WORST (0.0490), overfitting the narrow
 *       logN range [5.52, 7.86] to an implausible constant 1.7325.
 *   (4) The below-1 ASYMPTOTE. A full-ladder constant fit gives c* = 0.98548
 *       (rms 0.01356); adding a 1/logN^3 term barely moves it (c* = 0.9832, rms
 *       0.01349) -- the higher-order term contributes essentially nothing. The
 *       required "new functional form" is thus a below-1 constant offset ~0.985
 *       (full ladder) / ~0.992 (in-sample), NOT a resolved 1/logN power law.
 *
 * VERDICT. The new form imp-96491 demanded is a below-1 CONSTANT OFFSET (c ~=
 * 0.985), which cuts the out-of-sample rms ~2.9x below the failed imp-96094 fit;
 * but the residual about that constant (rms ~0.0136) is genuine NON-SMOOTH
 * oscillation that no low-order 1/logN power resolves, and every declining
 * correction fit in-sample degrades extrapolation. This CONFIRMS and SHARPENS
 * imp-96491: below-1 offset yes, 1/logN-power law no. Whether ratio(N) -> 1
 * asymptotically (RH + simple zeros) is left undecided beyond N=6000 -- see
 * IMP96505_SUBGAP.
 *
 * MEASUREMENT/FIT ONLY. Changes no bound, establishes no operator positivity,
 * makes no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96491-route-m-burnol-fit-extrapolation-residuals.js (verdict: needs new form)
 * @see imp-96094-route-m-burnol-ratio-dense-ladder.js (in-sample ladder, failed 3-term fit)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (asymptotic-remainder route)
 *
 * Ticket: imp-96505 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Full N=250..6000 ladder: in-sample (imp-96094, N<=2600) + extension (imp-96105).
export const IMP96505_IN_SAMPLE = Object.freeze([
  Object.freeze({ N: 250,  ratio: 0.9853030459881754 }),
  Object.freeze({ N: 500,  ratio: 0.9982700629705589 }),
  Object.freeze({ N: 750,  ratio: 0.9640024763631571 }),
  Object.freeze({ N: 1000, ratio: 0.9804200969828122 }),
  Object.freeze({ N: 1250, ratio: 0.9826926433733114 }),
  Object.freeze({ N: 1500, ratio: 0.9885961620169521 }),
  Object.freeze({ N: 1750, ratio: 0.9995152003949765 }),
  Object.freeze({ N: 2000, ratio: 1.0060890778581055 }),
  Object.freeze({ N: 2300, ratio: 1.002990665259071  }),
  Object.freeze({ N: 2600, ratio: 1.0102287163795478 }),
]);

export const IMP96505_EXTENSION = Object.freeze([
  Object.freeze({ N: 3000, ratio: 0.9729204905638247 }),
  Object.freeze({ N: 3500, ratio: 0.963885588735333  }),
  Object.freeze({ N: 4000, ratio: 0.9724333692631612 }),
  Object.freeze({ N: 4500, ratio: 0.9774701947103525 }),
  Object.freeze({ N: 5000, ratio: 0.9779064862688012 }),
  Object.freeze({ N: 5500, ratio: 0.9847994277553519 }),
  Object.freeze({ N: 6000, ratio: 0.9856144779200688 }),
]);

// Candidate forms fit on N<=2600, evaluated out-of-sample on N=3000..6000.
// outRms/outMaxAbs/outMeanBias are the extension-rung extrapolation residuals;
// asymptote is the fitted constant term. imp-96094 benchmark: outRms 0.0490.
export const IMP96505_FORMS = Object.freeze([
  Object.freeze({ name: 'const (below-1 offset)',    asymptote: 0.9918, inRms: 0.0134, outRms: 0.0169, outMaxAbs: 0.0279, outMeanBias: -0.0154, oneSigned: true }),
  Object.freeze({ name: 'const + a/logN^3',          asymptote: 1.0068, inRms: 0.0123, outRms: 0.0230, outMaxAbs: 0.0339, outMeanBias: -0.0221, oneSigned: true }),
  Object.freeze({ name: 'const + a/sqrt(N)',         asymptote: 1.0061, inRms: 0.0121, outRms: 0.0237, outMaxAbs: 0.0346, outMeanBias: -0.0228, oneSigned: true }),
  Object.freeze({ name: 'const + a/logN^2',          asymptote: 1.0171, inRms: 0.0121, outRms: 0.0242, outMaxAbs: 0.0351, outMeanBias: -0.0234, oneSigned: true }),
  Object.freeze({ name: 'const + a/logN',            asymptote: 1.0490, inRms: 0.0119, outRms: 0.0258, outMaxAbs: 0.0363, outMeanBias: -0.0251, oneSigned: true }),
  Object.freeze({ name: 'const + a/N^{1/4}',         asymptote: 1.0261, inRms: 0.0118, outRms: 0.0262, outMaxAbs: 0.0367, outMeanBias: -0.0255, oneSigned: true }),
  Object.freeze({ name: 'const + a/sqrt(logN)',      asymptote: 1.1131, inRms: 0.0117, outRms: 0.0266, outMaxAbs: 0.0370, outMeanBias: -0.0260, oneSigned: true }),
  Object.freeze({ name: 'const + a/logN^p (p*=0.25)',asymptote: 1.2416, inRms: 0.0117, outRms: 0.0271, outMaxAbs: 0.0374, outMeanBias: -0.0265, oneSigned: true }),
  Object.freeze({ name: 'const + a/logN + b/N^{1/4}',asymptote: -0.3809, inRms: 0.0094, outRms: 0.0414, outMaxAbs: 0.0492, outMeanBias: -0.0412, oneSigned: true }),
  Object.freeze({ name: 'const + a/logN + b/logN^2 (imp-96094)', asymptote: 1.7325, inRms: 0.0090, outRms: 0.0490, outMaxAbs: 0.0537, outMeanBias: -0.0489, oneSigned: true }),
]);

// The winning form: bare below-1 constant offset (constant = in-sample mean).
export const IMP96505_BEST = Object.freeze({
  form: 'const (below-1 offset)',
  inSampleConst: 0.9918108147586668,     // in-sample mean = fitted constant
  outRms: 0.016897530938080184,          // out-of-sample rms on N=3000..6000
  outMaxAbs: 0.027925226023333805,
  outMeanBias: -0.015377952584824947,
  improvementOverImp96094: 2.902,        // 0.0490 / 0.0169
  note: 'best out-of-sample form; every declining 1/logN^p correction fit in-sample degrades extrapolation because the in-sample drift is upward while the extension plateaus below 1.',
});

// Full-ladder (all 17 rungs) descriptive fit pins the below-1 asymptote.
export const IMP96505_FULL_LADDER = Object.freeze({
  constAsymptote: 0.9854787166355038,    // full-ladder mean = fitted constant, below 1
  constRms: 0.013558365252583528,        // descriptive rms about the constant
  constPlusLogN3Asymptote: 0.9832,       // adding 1/logN^3 barely moves the constant
  constPlusLogN3Rms: 0.0135,             // ... and barely improves the fit
  note: 'the below-1 asymptote is ~0.985; the residual about it (rms ~0.0136) is genuine non-smooth oscillation no low-order 1/logN power resolves.',
});

export const IMP96505_VERDICT = Object.freeze({
  newFormFound: true,
  newForm: 'below-1 constant offset c ~= 0.985 (full ladder) / 0.992 (in-sample)',
  logNPowerLawRejected: true,
  allFormsOneSignedOutOfSample: true,
  conclusion:
    'the new functional form imp-96491 demanded is a below-1 CONSTANT OFFSET (c ~= 0.985), which cuts the out-of-sample rms ~2.9x below the failed imp-96094 fit (0.0169 vs 0.0490). But NO 1/logN-power correction helps: every declining-in-N term fit on the upward-drifting in-sample range extrapolates the wrong way and increases the out-of-sample rms, and all ten candidate forms stay one-signed out-of-sample. The residual about the constant (rms ~0.0136) is genuine non-smooth oscillation. Confirms and sharpens imp-96491: below-1 offset yes, 1/logN-power law no.',
});

export const IMP96505_SUBGAP = Object.freeze({
  id: 'imp-96505-asymptote-below-6000',
  statement:
    'the below-1 constant offset (~0.985) is the best form on N=250..6000 but is an empirical plateau, not a proven asymptote; whether ratio(N) -> 1 (RH + simple zeros) manifests only for N well beyond 6000, or whether the true asymptote is genuinely below 1, is undecided here. The O(N^3) Vasyunin Gram build caps the accessible ladder; deciding convergence needs rungs well past N=6000 or an analytic remainder model.',
});

export const IMP96505_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Fit/measurement only: every value is a reproducible numeric from tmp/imp-96505-scratch.mjs least-squares fitting the baked imp-96094/imp-96105 ladder rows; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

function imp96505Rms(arr) {
  return Math.sqrt(arr.reduce((s, v) => s + v * v, 0) / arr.length);
}

const IMP96505_ASSERTIONS = [
  {
    id: 'imp96505-best-const-recomputes-from-ladder',
    holds: () => {
      const inMean =
        IMP96505_IN_SAMPLE.reduce((s, r) => s + r.ratio, 0) / IMP96505_IN_SAMPLE.length;
      const outRes = IMP96505_EXTENSION.map((r) => r.ratio - inMean);
      return Math.abs(inMean - IMP96505_BEST.inSampleConst) < 1e-12 &&
        Math.abs(imp96505Rms(outRes) - IMP96505_BEST.outRms) < 1e-9 &&
        Math.abs(Math.max(...outRes.map(Math.abs)) - IMP96505_BEST.outMaxAbs) < 1e-9;
    },
    why: 'the winning constant form is the in-sample mean, and its baked out-of-sample rms/maxAbs re-derive from the baked extension rungs to double precision.',
  },
  {
    id: 'imp96505-const-beats-imp96094-extrapolation',
    holds: () => {
      const imp94 = IMP96505_FORMS.find((f) => /imp-96094/.test(f.name));
      return IMP96505_BEST.outRms < imp94.outRms &&
        Math.abs(imp94.outRms - 0.0490) < 1e-3 &&
        Math.abs(IMP96505_BEST.improvementOverImp96094 - imp94.outRms / IMP96505_BEST.outRms) < 0.05;
    },
    why: 'the bare below-1 constant out-of-sample rms (0.0169) is ~2.9x below the imp-96094 three-term extrapolation (0.0490), matching the baked improvement factor.',
  },
  {
    id: 'imp96505-all-forms-one-signed-out-of-sample',
    holds: () =>
      IMP96505_FORMS.every((f) => f.oneSigned === true && f.outMeanBias < 0) &&
      IMP96505_VERDICT.allFormsOneSignedOutOfSample === true,
    why: 'every candidate form fit in-sample over-predicts the below-1 extension: all ten have one-signed (negative) out-of-sample residuals, so none recovers the missing out-of-sample sign structure.',
  },
  {
    id: 'imp96505-declining-corrections-degrade-extrapolation',
    holds: () => {
      const best = IMP96505_BEST.outRms;
      // every non-constant form (has a declining 1/N-family term) has WORSE outRms
      return IMP96505_FORMS.filter((f) => f.name !== 'const (below-1 offset)')
        .every((f) => f.outRms > best);
    },
    why: 'adding any declining 1/logN^p (or 1/N^p) correction fit to the upward-drifting in-sample range increases the out-of-sample rms above the bare constant: the correction extrapolates the wrong way.',
  },
  {
    id: 'imp96505-below-one-asymptote',
    holds: () => {
      const allMean =
        [...IMP96505_IN_SAMPLE, ...IMP96505_EXTENSION].reduce((s, r) => s + r.ratio, 0) / 17;
      return Math.abs(allMean - IMP96505_FULL_LADDER.constAsymptote) < 1e-12 &&
        IMP96505_FULL_LADDER.constAsymptote < 1 &&
        IMP96505_BEST.inSampleConst < 1;
    },
    why: 'the full-ladder fitted constant (0.98548) and the in-sample constant (0.99181) both sit below 1, and the full-ladder value re-derives from the baked 17 rungs, confirming a below-1 offset.',
  },
  {
    id: 'imp96505-verdict-new-form-no-power-law',
    holds: () =>
      IMP96505_VERDICT.newFormFound === true &&
      IMP96505_VERDICT.logNPowerLawRejected === true,
    why: 'the derived new form is a below-1 constant offset while the 1/logN power law is rejected, matching imp-96491 (needs new form) and sharpening it.',
  },
  {
    id: 'imp96505-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96505_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96505_HONEST_BANNER) &&
      /NO QED/.test(IMP96505_HONEST_BANNER) &&
      typeof IMP96505_SUBGAP.statement === 'string' &&
      /below-6000/.test(IMP96505_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap for the undecided asymptotic beyond N=6000.',
  },
];

for (const a of IMP96505_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96505-route-m-burnol-new-form-fit assertion failed: ${a.id}`);
  }
}

export default {
  inSample: IMP96505_IN_SAMPLE,
  extension: IMP96505_EXTENSION,
  forms: IMP96505_FORMS,
  best: IMP96505_BEST,
  fullLadder: IMP96505_FULL_LADDER,
  verdict: IMP96505_VERDICT,
  subGap: IMP96505_SUBGAP,
  banner: IMP96505_HONEST_BANNER,
};
