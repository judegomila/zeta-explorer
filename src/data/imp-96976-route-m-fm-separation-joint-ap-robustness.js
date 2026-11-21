/**
 * @module imp-96976-route-m-fm-separation-joint-ap-robustness
 *
 * imp-96976 (accuracy, ROBUSTNESS AUDIT ONLY): decide whether the thin +0.50 percent Route M
 * F < M canonical-band separation (imp-96955: M_lo 3.919e7 vs F_hi 3.8991e7) survives the
 * imp-96428 lam_min power-law fit-parameter (A, p) uncertainty, and separately whether it survives
 * the imp-96912 quad-vs-tail ||G||_F model-form ambiguity. Every conditioning ceiling is solved from
 * cond#(N) = ||G||_F(N) / lam_min(N) = 1/eps with lam_min = A N^-p, so F_hi inherits BOTH the fit
 * uncertainty in (A, p) and the choice of ||G||_F extrapolant. NO bound moved; NO QED.
 *
 * -------------------------------------------------------------------------------
 * WHAT WAS OPEN.
 * -------------------------------------------------------------------------------
 * imp-96833 banded the F ceiling to the lam_min exponent p ALONE (A held fixed), reporting
 * F in [3.633e7, 3.899e7] per +/- 2 sigma, and its sub-gap flagged that "the A-uncertainty is not
 * banded here". The downstream imp-96955 F/M verdict (+0.50 percent) then leans on that p-only
 * F_hi = 3.8991e7. Two propagated uncertainties were never folded in together:
 *   (1) the JOINT (A, p) OLS fit uncertainty of lam_min = A N^-p (with the intercept/slope
 *       covariance the p-only band omits), and
 *   (2) the imp-96912 ||G||_F model-form ambiguity (quad +8.36 percent vs tail +1.37 percent),
 *       a ~6.9 percent spread that dwarfs the +0.5 percent gap.
 *
 * -------------------------------------------------------------------------------
 * METHOD (tmp/imp-96976-scratch.mjs, reproducible; pure re-analysis, no Gram rebuilt).
 * -------------------------------------------------------------------------------
 * A log-log OLS over the 12 committed imp-96428 lam_min rungs reproduces p = 1.917927,
 * A = 0.818672 (R^2 = 0.99998) EXACTLY and yields the full fit covariance:
 * SE(p) = 0.0024274, SE(ln A) = 0.020430, Cov(ln A, slope) = -4.929e-5. The F ceiling solves
 * ln N_F = (ln A - ln(eps C_F)) / (b + p) with b = 0.4781 (||G||_F ~ N^0.478, imp-96833), so its
 * joint (A, p) log-uncertainty is the OLS PREDICTION std of ln(lam_min) at x_F = ln N_F, divided by
 * the ceiling elasticity denominator (b + p):
 *     sigma(ln N_F) = s * sqrt(1/n + (x_F - xbar)^2 / Sxx) / (b + p).
 * This carries A, p AND their covariance in one term. The p-only band imp-96833 used is instead
 * sigma_ponly(ln N_F) = (x_F / (b + p)) * SE(p), which pivots the log-log line about N = 1 (x = 0)
 * rather than the data centroid xbar, over-stating the extrapolation lever arm.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the joint (A, p) band is TIGHTER than the p-only band; F < M is STRENGTHENED.
 * -------------------------------------------------------------------------------
 * sigma_joint(ln N_F) = 9.245e-3 is 0.523x the p-only sigma_ponly = 1.767e-2: pivoting about the
 * data centroid (not N = 1) roughly halves the extrapolation half-width. The +/- 2 sigma joint band
 * is F in [3.695e7, 3.834e7] (+/- 1.87 percent), versus the p-only F in [3.633e7, 3.899e7]
 * (+/- 3.60 percent, reproducing imp-96833 F_hi = 3.8991e7 to full precision as a cross-check). The
 * joint F_hi = 3.834e7 sits WELL BELOW the canonical M_lo = 3.919e7 -- the gap WIDENS from +0.51
 * percent (p-only) to +2.22 percent (joint). So the +0.50 percent F < M separation is ROBUST to,
 * and if anything strengthened by, a covariance-consistent treatment of the (A, p) fit-parameter
 * uncertainty: the imp-96833 p-only F_hi was conservative (too wide).
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the separation is NOT robust to the imp-96912 ||G||_F model-form ambiguity.
 * -------------------------------------------------------------------------------
 * The quad-vs-tail spread is +6.89 percent (imp-96912 NstarQuad 4.1029e7 vs NstarTail 3.8384e7;
 * the ticket cited ~6.22 percent, minor sibling-figure drift). The tail ceiling 3.8384e7 stays
 * below M_lo = 3.919e7 (separation preserved), but the data-favoured QUAD ceiling 4.1029e7 EXCEEDS
 * M_lo by +4.69 percent -- it INVERTS the F < M ordering entirely. Because imp-96912 found the quad
 * wins every near-field holdout split, the binding uncertainty on F < M is NOT the power-law fit
 * noise (~2 percent joint band) but the ~6.9 percent model-form choice, which is an order of
 * magnitude larger than the +0.5 percent gap and whose data-favoured branch destroys the ordering.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The +0.50 percent F < M separation is ROBUST to the imp-96428 lam_min (A, p) fit-parameter
 * uncertainty -- the joint OLS band on F_hi (3.834e7, +/- 1.87 percent) is TIGHTER than the p-only
 * imp-96833 band and stays a comfortable +2.22 percent below M_lo. But it is MARGINAL / NOT robust
 * to the imp-96912 ||G||_F model-form ambiguity: the ~6.9 percent quad-vs-tail spread dwarfs the
 * +0.5 percent gap, and the data-favoured quad ceiling (4.1029e7) exceeds M_lo, inverting F < M. So
 * the ordering survives fit-parameter noise but sits WITHIN the model-selection error bar; the F < M
 * separation is model-form-limited, not fit-noise-limited. Robustness audit only; no bound moved; no
 * operator positivity; the ceilings still inherit the non-rigorous lam_min N^-p / ||G||_F log-fit
 * extrapolations (only the trace ceiling T is a rigorous lower bound); no refereed bound is changed
 * ; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (imp-96976-fm-separation-model-form-limited). The audit RESOLVES the (A, p)
 * fit-parameter question (robust) but the model-form question is only ADJUDICATED by imp-96912's
 * near-field holdout, which cannot settle the 3.4-decade extrapolation to the ceiling scale where
 * the quad turns over (unphysical peak at N ~ 2.31e9). Deciding F < M rigorously needs fresh EXACT
 * ||G||_F rungs beyond N = 16000 (imp-96912 sub-gap, O(N^3) V-table CPU-blocked in-pool) to pin the
 * ||G||_F curvature at the ceiling scale. This module bands the fit uncertainty; it makes no ceiling
 * rigorous and does not decide the model form.
 *
 * @see imp-96955-route-m-ceiling-consumer-repoint.js (the canonical M band and the +0.50 percent F/M verdict)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min = A N^-p fit and the 12 rungs)
 * @see imp-96833-route-m-ceiling-p-sensitivity-band.js (the p-only ceiling band this audit extends to joint A,p)
 * @see imp-96912-route-m-frobenius-holdout-model-discriminator.js (quad-vs-tail ||G||_F model ambiguity)
 *
 * Ticket: imp-96976 (accuracy, opus-4-8, api-pool). Robustness audit only; NO QED.
 */

import {
  IMP96428_LAMMIN_ROWS,
  IMP96428_FIT,
} from './imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js';
import { IMP96833_CEILINGS } from './imp-96833-route-m-ceiling-p-sensitivity-band.js';
import { IMP96912_CEILINGS } from './imp-96912-route-m-frobenius-holdout-model-discriminator.js';
import { IMP96955_CANONICAL_M_BAND } from './imp-96955-route-m-ceiling-consumer-repoint.js';

// -- reproduce the log-log OLS of ln(lam_min) vs ln(N) over the 12 imp-96428 rungs -------------
const x = IMP96428_LAMMIN_ROWS.map((r) => Math.log(r.N));
const y = IMP96428_LAMMIN_ROWS.map((r) => Math.log(r.lamMin));
const n = x.length;
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const xbar = mean(x);
const ybar = mean(y);
let Sxx = 0;
let Sxy = 0;
for (let i = 0; i < n; i++) {
  Sxx += (x[i] - xbar) ** 2;
  Sxy += (x[i] - xbar) * (y[i] - ybar);
}
const slope = Sxy / Sxx; // = -p
const intercept = ybar - slope * xbar; // = ln A
let SSE = 0;
for (let i = 0; i < n; i++) SSE += (y[i] - (intercept + slope * x[i])) ** 2;
const s2 = SSE / (n - 2);
const s = Math.sqrt(s2);

export const IMP96976_OLS = Object.freeze({
  p: -slope,
  A: Math.exp(intercept),
  r2: 1 - SSE / y.reduce((acc, v) => acc + (v - ybar) ** 2, 0),
  seP: s / Math.sqrt(Sxx),
  seLnA: s * Math.sqrt(1 / n + (xbar * xbar) / Sxx),
  covLnA_slope: -s2 * xbar / Sxx, // Cov(intercept, slope); Cov(ln A, p) = +s2 xbar / Sxx
  n,
  note: 'reproduces imp-96428 p = 1.917927, A = 0.818672 exactly, plus the intercept SE and the intercept/slope covariance the p-only imp-96833 band omitted.',
});

// -- the F ceiling and its lam_max growth exponent b (||G||_F ~ N^b) ----------------------------
const F_ROW = IMP96833_CEILINGS.find((r) => r.symbol === 'F');
const F0 = F_ROW.N; // 3.7637e7 central F ceiling
const bF = F_ROW.b; // 0.4781
const xF = Math.log(F0);
const p = -slope;
const denom = bF + p; // ceiling elasticity denominator
const K_SIGMA = 2;

// Joint (A, p) log-uncertainty on F = OLS prediction std at x_F / (b + p) (carries the covariance).
const sigYhatF = s * Math.sqrt(1 / n + (xF - xbar) ** 2 / Sxx);
const sigLnN_joint = sigYhatF / denom;
// p-only band (imp-96833 convention): pivots the line about N = 1, over-stating the lever arm.
const sigLnN_ponly = (xF / denom) * (s / Math.sqrt(Sxx));

const M_LO = IMP96955_CANONICAL_M_BAND.lo; // canonical Route M lower edge, 3.919e7

export const IMP96976_F_BANDS = Object.freeze({
  fCentral: F0,
  bExponent: bF,
  joint: Object.freeze({
    sigmaLnN: sigLnN_joint,
    lo: F0 * Math.exp(-K_SIGMA * sigLnN_joint),
    hi: F0 * Math.exp(K_SIGMA * sigLnN_joint),
    halfWidthPct: (Math.exp(K_SIGMA * sigLnN_joint) - 1) * 100,
  }),
  pOnly: Object.freeze({
    sigmaLnN: sigLnN_ponly,
    lo: F0 * Math.exp(-K_SIGMA * sigLnN_ponly),
    hi: F0 * Math.exp(K_SIGMA * sigLnN_ponly),
    halfWidthPct: (Math.exp(K_SIGMA * sigLnN_ponly) - 1) * 100,
  }),
  jointOverPonlySigmaRatio: sigLnN_joint / sigLnN_ponly, // ~0.52
});

// -- FINDING 1: F < M under the joint (A, p) fit-parameter band ---------------------------------
const Fhi_joint = IMP96976_F_BANDS.joint.hi;
const Fhi_ponly = IMP96976_F_BANDS.pOnly.hi;
export const IMP96976_FM_FIT_PARAM = Object.freeze({
  mLow: M_LO,
  fHiJoint: Fhi_joint,
  fHiPonly: Fhi_ponly,
  separatedJoint: M_LO > Fhi_joint, // true
  separatedPonly: M_LO > Fhi_ponly, // true
  gapJointPct: (M_LO / Fhi_joint - 1) * 100, // ~ +2.22
  gapPonlyPct: (M_LO / Fhi_ponly - 1) * 100, // ~ +0.51 (matches imp-96955)
  jointStrengthensSeparation: (M_LO / Fhi_joint - 1) > (M_LO / Fhi_ponly - 1),
  robustToFitParam: M_LO > Fhi_joint,
});

// -- FINDING 2: F < M under the imp-96912 ||G||_F model-form ambiguity ---------------------------
const Nquad = IMP96912_CEILINGS.NstarQuad; // 4.1029e7
const Ntail = IMP96912_CEILINGS.NstarTail; // 3.8384e7
export const IMP96976_FM_MODEL_FORM = Object.freeze({
  mLow: M_LO,
  quadCeiling: Nquad,
  tailCeiling: Ntail,
  quadTailSpreadPct: (Nquad / Ntail - 1) * 100, // ~ +6.89
  ticketCitedSpreadPct: 6.22, // ticket figure; reproduced spread is ~6.89 (minor sibling drift)
  tailStaysBelowM: Ntail < M_LO, // true (separation preserved under tail model)
  quadExceedsM: Nquad > M_LO, // true (quad INVERTS F < M)
  quadOverMPct: (Nquad / M_LO - 1) * 100, // ~ +4.69
  dataFavouredModel: 'quad (wins every imp-96912 near-field holdout split)',
  robustToModelForm: Nquad < M_LO, // false -- data-favoured quad ceiling exceeds M_lo
});

export const IMP96976_VERDICT = Object.freeze({
  question:
    'does the thin +0.50 percent Route M F < M separation (M_lo 3.919e7 vs F_hi 3.8991e7) survive ' +
    'the imp-96428 lam_min power-law (A, p) fit-parameter uncertainty, and the imp-96912 ' +
    'quad-vs-tail ||G||_F model-form ambiguity?',
  robustToFitParam: IMP96976_FM_FIT_PARAM.robustToFitParam, // true (strengthened, gap +2.22%)
  robustToModelForm: IMP96976_FM_MODEL_FORM.robustToModelForm, // false (quad inverts F < M)
  bindingUncertainty: 'model-form (||G||_F quad-vs-tail, ~6.9 percent), not the ~2 percent power-law fit band',
  overallStatus: 'fit-parameter-robust but model-form-marginal',
  anyBoundMoved: false,
  conclusion:
    'THE +0.50 PERCENT F < M SEPARATION IS FIT-PARAMETER-ROBUST BUT MODEL-FORM-MARGINAL. Under a ' +
    'covariance-consistent joint (A, p) OLS band the F_hi = 3.834e7 is TIGHTER than the imp-96833 ' +
    'p-only F_hi = 3.8991e7 (sigma ratio 0.52; the p-only band pivots about N = 1, over-stating the ' +
    'extrapolation lever arm), so the gap WIDENS to +2.22 percent -- robust to the power-law fit ' +
    'uncertainty. But the imp-96912 ||G||_F model-form ambiguity is ~6.9 percent, an order of ' +
    'magnitude larger than the gap, and the data-favoured quad ceiling (4.1029e7) EXCEEDS M_lo ' +
    '(3.919e7) by +4.69 percent, inverting F < M; only the tail model preserves it. The binding ' +
    'uncertainty on F < M is model selection (which ||G||_F extrapolant), not the fit noise. ' +
    'Robustness audit only; no bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96976_SUBGAP = Object.freeze({
  id: 'imp-96976-fm-separation-model-form-limited',
  statement:
    'the audit resolves the (A, p) fit-parameter question (F < M robust, gap +2.22 percent) but the ' +
    'model-form question is only adjudicated by imp-96912 near-field holdout, which cannot settle the ' +
    '3.4-decade extrapolation to the ceiling scale where the quad turns over (unphysical peak at ' +
    'N ~ 2.31e9). Deciding F < M rigorously needs fresh EXACT ||G||_F rungs beyond N = 16000 ' +
    '(imp-96912 sub-gap, O(N^3) V-table CPU-blocked in-pool) to pin the ||G||_F curvature at the ' +
    'ceiling scale. This module bands the fit uncertainty; it makes no ceiling rigorous and does not ' +
    'decide the model form.',
});

export const IMP96976_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Robustness audit only: the 12 lam_min rungs, the ' +
  'F ceiling (b = 0.478) and the quad/tail ceilings are imported verbatim from the import-light ' +
  'siblings imp-96428 / imp-96833 / imp-96912 / imp-96955; the joint (A, p) band is the OLS ' +
  'prediction std at the ceiling divided by (b + p) (tmp/imp-96976-scratch.mjs). No Gram was ' +
  'rebuilt, no bound is claimed moved, and no ceiling is made rigorous -- only the trace ceiling T ' +
  'is a rigorous lower bound; F and M inherit the non-rigorous lam_min N^-p / ||G||_F log-fit.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96976_ASSERTIONS = [
  {
    id: 'imp96976-ols-reproduces-imp96428-fit',
    holds: () =>
      Math.abs(IMP96976_OLS.p - IMP96428_FIT.p) < 1e-5 &&
      Math.abs(IMP96976_OLS.A - IMP96428_FIT.A) < 1e-6 &&
      IMP96976_OLS.r2 > 0.9999 &&
      IMP96976_OLS.seP > 0.002 &&
      IMP96976_OLS.seP < 0.003 &&
      IMP96976_OLS.seLnA > 0.015 &&
      IMP96976_OLS.seLnA < 0.025,
    why: 'the log-log OLS over the 12 imp-96428 rungs reproduces p = 1.917927, A = 0.818672 (R^2 > 0.9999) and yields a realistic intercept SE(ln A) ~ 0.0204 and slope SE(p) ~ 0.00243.',
  },
  {
    id: 'imp96976-joint-band-tighter-than-ponly',
    holds: () =>
      IMP96976_F_BANDS.jointOverPonlySigmaRatio > 0.4 &&
      IMP96976_F_BANDS.jointOverPonlySigmaRatio < 0.7 &&
      IMP96976_F_BANDS.joint.hi < IMP96976_F_BANDS.pOnly.hi &&
      Math.abs(IMP96976_F_BANDS.pOnly.hi - 3.8991e7) < 5e4,
    why: 'the joint (A, p) prediction-band sigma is ~0.52x the p-only sigma (pivot about the data centroid, not N = 1), so the joint F_hi is tighter; the p-only F_hi reproduces imp-96833 3.8991e7.',
  },
  {
    id: 'imp96976-fm-robust-to-fit-parameter',
    holds: () =>
      IMP96976_FM_FIT_PARAM.robustToFitParam === true &&
      IMP96976_FM_FIT_PARAM.separatedJoint === true &&
      IMP96976_FM_FIT_PARAM.gapJointPct > IMP96976_FM_FIT_PARAM.gapPonlyPct &&
      IMP96976_FM_FIT_PARAM.gapJointPct > 1.5 &&
      IMP96976_FM_FIT_PARAM.gapPonlyPct > 0 &&
      IMP96976_FM_FIT_PARAM.gapPonlyPct < 1,
    why: 'under the joint (A, p) band M_lo 3.919e7 exceeds F_hi 3.834e7 with the gap widening to ~+2.22 percent (vs the p-only +0.51 percent), so F < M is robust to the fit-parameter uncertainty.',
  },
  {
    id: 'imp96976-fm-not-robust-to-model-form',
    holds: () =>
      IMP96976_FM_MODEL_FORM.robustToModelForm === false &&
      IMP96976_FM_MODEL_FORM.quadExceedsM === true &&
      IMP96976_FM_MODEL_FORM.tailStaysBelowM === true &&
      IMP96976_FM_MODEL_FORM.quadTailSpreadPct > 5 &&
      IMP96976_FM_MODEL_FORM.quadOverMPct > 3,
    why: 'the ~6.9 percent quad-vs-tail model spread dwarfs the +0.5 percent gap; the data-favoured quad ceiling 4.1029e7 exceeds M_lo 3.919e7 by ~+4.69 percent, inverting F < M, while only the tail model preserves it.',
  },
  {
    id: 'imp96976-honesty-gate-no-qed',
    holds: () =>
      IMP96976_VERDICT.anyBoundMoved === false &&
      IMP96976_VERDICT.robustToFitParam === true &&
      IMP96976_VERDICT.robustToModelForm === false &&
      /NO QED/.test(IMP96976_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96976_HONEST_BANNER) &&
      /RH open/.test(IMP96976_HONEST_BANNER) &&
      /model-form-limited/.test(IMP96976_SUBGAP.id),
    why: 'robustness audit only: no bound moved, the fit-parameter/model-form split is recorded, the honesty markers are present, and the model-form-limited sub-gap is named.',
  },
];

for (const a of IMP96976_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96976-route-m-fm-separation-joint-ap-robustness assertion failed: ${a.id}`);
  }
}

export default {
  ols: IMP96976_OLS,
  fBands: IMP96976_F_BANDS,
  fmFitParam: IMP96976_FM_FIT_PARAM,
  fmModelForm: IMP96976_FM_MODEL_FORM,
  verdict: IMP96976_VERDICT,
  subGap: IMP96976_SUBGAP,
  banner: IMP96976_HONEST_BANNER,
};
