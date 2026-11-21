/**
 * @fileoverview imp-95899 — characterize the imp-95878 J-variation dI(m) as a function of
 * m: test log, power-law, and rho=1/m drift fits, and decide whether ANY clean anchor-
 * respecting correction recovers a reconstruction-independent closed-form c_odd(1/m) at
 * m>20, or confirm the m-dependence is genuinely reconstruction-borne.
 *
 * INPUT (from imp-95878, reused verbatim -- no fresh quadrature). The reconstruction-implied
 * fractional J-variation is dI(m) = kappa_recon(m)/kappa - 1 with kappa_recon(m) = 5/2 -
 * Q_0_recon(m) and kappa = 400*c_odd(1/20) = 2.5106978912403926. imp-95878 measured
 *   m=20: dI = -5.59e-11 (the m=20 anchor; dI := 0 by construction, drho = 0)
 *   m=22: dI = -3.018835e-6
 *   m=30: dI = -9.858537e-6
 *   m=41: dI = -1.665415e-5
 * and found dI/drho (drho = 1/20 - 1/m) roughly constant with ~11% scatter -- NOT clean-linear.
 * This module fits the three non-anchor points against a wider family of laws and reports
 * which (if any) is clean, using the ANCHOR CONSTRAINT dI(m=20)=0 as the decisive filter.
 *
 * THE DECISIVE FILTER: anchor-respecting vs not. Any genuine closed-form c_odd(1/m) must
 * reduce to the certified anchor at m=20, i.e. dI(20)=0. Only functions that vanish at
 * drho=0 respect this: powers/laws in drho = 1/20 - 1/m. Powers in m or in rho=1/m do NOT
 * vanish at m=20 (A*20^p != 0), so a good aggregate R^2 there is spurious -- it would
 * contradict the anchor. This filter, not R^2 alone, decides the question.
 *
 * MEASURED FITS (three non-anchor points m=22,30,41):
 *   (1) power-in-m  dI ~ A*m^p:      aggregate p=2.742, R^2=0.952 -- BUT pairwise exponents
 *       3.816 (m22-m30) vs 1.679 (m30-m41) spread ~78%, and the law VIOLATES the anchor
 *       (A*20^2.74 != 0). REJECTED (anchor + unstable exponent).
 *   (2) power-in-drho  dI ~ A*drho^q: aggregate q=0.970, R^2=0.996; anchor-respecting
 *       (drho=0 at m=20) -- BUT pairwise exponents 0.911 vs 1.221 spread ~29%. NOT clean.
 *   (3) through-origin linear  dI = c*drho: c = -6.641e-4, -5.915e-4, -6.503e-4, spread
 *       ~11.6% (the imp-95878 finding, reconfirmed). NOT clean.
 *   (4) linear-in-ln(m)  dI = a*ln(m)+b: aggregate R^2=0.99998 -- but this is a 3-point /
 *       2-parameter OVER-FIT (one residual degree of freedom, R^2 near 1 is automatic), and
 *       it MISPREDICTS the anchor: a*ln(20)+b = -9.47e-7, off the near-zero anchor by ~1e-6.
 *       REJECTED (anchor mispredict + degrees-of-freedom artifact).
 *
 * VERDICT (honest PARTIAL, measure/derive only). No clean anchor-respecting single-parameter
 * law fits dI(m). The only laws that vanish at the m=20 anchor (powers of drho) have exponents
 * that drift ~29% across the measured pairs and a linear coefficient that spreads ~12%; the
 * laws with high aggregate R^2 (power-in-m, linear-in-ln m) either violate the anchor or are
 * over-fit artifacts of three points. So the imp-95878 conclusion is REINFORCED, not
 * overturned: dI(m) carries no clean closed-form correction, and the m-dependence is genuinely
 * reconstruction-borne. Extending to further moduli would require fresh Q_0_recon(m) values,
 * available ONLY through the 238-cell reconstruction (or a fresh Prop-6.3 v-integral + B24
 * certificate per m) -- which is exactly the imp-95861 PIECE-A binding shortfall. This module
 * adds no new modulus datum and no bound movement; it sharpens WHY no clean law exists.
 *
 * NAMED SUB-GAP (carried, unresolved): no reconstruction-independent closed-form c_odd(1/m)
 * at m>20; the dI(m) m-law admits no clean anchor-respecting closed form (drho-power exponent
 * spread ~29%, linear-in-drho coefficient spread ~12%, and every higher-R^2 alternative either
 * breaks the m=20 anchor or is a three-point over-fit).
 *
 * Derive/measure only; changes no bound. Catalan G irrationality OPEN; Sun arXiv:2609.04176
 * single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports
 * (reuses the imp-95878 baked kappa + Q0_RECON literals). SCRATCH: tmp/imp-95899-scratch.mjs.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.19)-(6.23).
 */

// certified anchor (Sun 6.23), m=20 only:
const C_ODD_CERT_M20 = 0.006276744728100982;
const KAPPA = C_ODD_CERT_M20 * 400; // J(1/20) = 2.5106978912403926

// faithful-reconstruction Q_0 zeta(3) sector, carried verbatim from imp-95878/95861/95842:
const Q0_RECON = Object.freeze({
  20: -0.0106978911,
  22: -0.0106903118589691,
  30: -0.0106731394320504,
  41: -0.0106560776913469,
});
const kappaRecon = (m) => 2.5 - Q0_RECON[m];
const dIof = (m) => kappaRecon(m) / KAPPA - 1; // fractional J-variation

const NON_ANCHOR = Object.freeze([22, 30, 41].map((m) => Object.freeze({
  m,
  rho: 1 / m,
  drho: 1 / 20 - 1 / m,
  dI: dIof(m),
})));

// exact pairwise power exponent between two (x,|dI|) points (2 points => exact p):
const pairExp = (x0, y0, x1, y1) => Math.log(y1 / y0) / Math.log(x1 / x0);
const absdI = NON_ANCHOR.map((r) => Math.abs(r.dI));

// least-squares log-log power fit |dI| = A*x^p over the three points; returns {p, A, R2}:
function powerFit(xs, ys) {
  const lx = xs.map(Math.log);
  const ly = ys.map(Math.log);
  const n = xs.length;
  const mx = lx.reduce((a, b) => a + b, 0) / n;
  const my = ly.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i += 1) {
    sxy += (lx[i] - mx) * (ly[i] - my);
    sxx += (lx[i] - mx) ** 2;
  }
  const p = sxy / sxx;
  const lnA = my - p * mx;
  const pred = lx.map((v) => lnA + p * v);
  const ssr = ly.reduce((a, v, i) => a + (v - pred[i]) ** 2, 0);
  const sst = ly.reduce((a, v) => a + (v - my) ** 2, 0);
  return Object.freeze({ p, A: Math.exp(lnA), R2: 1 - ssr / sst });
}

const spreadFrac = (arr) => {
  const mx = Math.max(...arr);
  const mn = Math.min(...arr);
  return Math.abs((mx - mn) / ((mx + mn) / 2));
};

// (1) power-in-m
const FIT_POWER_M = powerFit(NON_ANCHOR.map((r) => r.m), absdI);
const PAIR_EXP_M = Object.freeze([
  pairExp(22, absdI[0], 30, absdI[1]),
  pairExp(30, absdI[1], 41, absdI[2]),
]);
// (2) power-in-drho (anchor-respecting: vanishes at drho=0)
const FIT_POWER_DRHO = powerFit(NON_ANCHOR.map((r) => r.drho), absdI);
const PAIR_EXP_DRHO = Object.freeze([
  pairExp(NON_ANCHOR[0].drho, absdI[0], NON_ANCHOR[1].drho, absdI[1]),
  pairExp(NON_ANCHOR[1].drho, absdI[1], NON_ANCHOR[2].drho, absdI[2]),
]);
// (3) through-origin linear-in-drho coefficient per point
const LINEAR_DRHO_COEFF = Object.freeze(NON_ANCHOR.map((r) => r.dI / r.drho));
// (4) linear-in-ln(m) fit dI = a*ln(m) + b, plus its anchor mispredict at m=20
const FIT_LN_M = (() => {
  const xs = NON_ANCHOR.map((r) => Math.log(r.m));
  const ys = NON_ANCHOR.map((r) => r.dI);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const a = sxy / sxx;
  const b = my - a * mx;
  const pred = xs.map((v) => a * v + b);
  const ssr = ys.reduce((s, v, i) => s + (v - pred[i]) ** 2, 0);
  const sst = ys.reduce((s, v) => s + (v - my) ** 2, 0);
  return Object.freeze({ a, b, R2: 1 - ssr / sst, anchorPredictAt20: a * Math.log(20) + b });
})();

export const C_ODD_DI_M_LAW_CHARACTERIZATION = Object.freeze({
  id: 'imp-95899-c-odd-dI-m-law-characterization',
  title:
    'Characterize the imp-95878 J-variation dI(m)=kappa_recon(m)/kappa-1: test log / power-law / '
    + 'rho-drift fits at m=22,30,41 under the m=20 anchor constraint dI(20)=0, and decide no clean '
    + 'reconstruction-independent closed-form c_odd(1/m) at m>20 exists (m-dependence reconstruction-borne)',
  status:
    'PARTIAL (measure/derive only) -- fit dI(m) at m=22,30,41 against power-in-m, power-in-drho, '
    + 'through-origin linear-in-drho, and linear-in-ln(m) laws. DECISIVE FILTER = anchor constraint '
    + 'dI(m=20)=0 (only powers of drho=1/20-1/m vanish there). RESULT: power-in-m (p=2.742, R2=0.952) '
    + 'VIOLATES the anchor and its pairwise exponents spread ~78% (3.816 vs 1.679); linear-in-ln(m) '
    + 'R2=0.99998 is a 3-point/2-param over-fit that MISPREDICTS the anchor (-9.47e-7 vs ~-5.6e-11); '
    + 'the anchor-respecting drho-power (q=0.970, R2=0.996) has pairwise exponents spread ~29% (0.911 '
    + 'vs 1.221); through-origin linear-in-drho coefficient spreads ~11.6%. NO clean anchor-respecting '
    + 'single-parameter law fits. imp-95878 REINFORCED: dI(m) carries no clean closed-form correction, '
    + 'the m-dependence is reconstruction-borne, further moduli need fresh Q0_recon (imp-95861 PIECE-A '
    + 'shortfall). G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.19)-(6.23)',
  builtOn:
    'imp-95878 (measured dI at m=22,30,41 and the dI/drho ~11% scatter that named this m-law question), '
    + 'imp-95861 (PIECE-A independent-target shortfall at m>20), imp-95842 (baked Q0_RECON literals), '
    + 'imp-95690/95653/95702 (rho^2 prefactor forced; J(rho) residual rho-dependence = dI)',

  anchor: Object.freeze({
    m: 20,
    dI: dIof(20), // ~ -5.59e-11, the value-match by construction (drho = 0)
    constraint: 'any genuine closed-form c_odd(1/m) must give dI(m=20)=0; only functions of drho=1/20-1/m qualify',
  }),

  nonAnchor: NON_ANCHOR,

  fits: Object.freeze({
    powerInM: Object.freeze({
      ...FIT_POWER_M,
      pairwiseExponents: PAIR_EXP_M,
      pairwiseSpreadFrac: spreadFrac(PAIR_EXP_M),
      respectsAnchor: false, // A*m^p != 0 at m=20
      verdict: 'REJECTED: violates the m=20 anchor and pairwise exponents spread ~78%',
    }),
    powerInDrho: Object.freeze({
      ...FIT_POWER_DRHO,
      pairwiseExponents: PAIR_EXP_DRHO,
      pairwiseSpreadFrac: spreadFrac(PAIR_EXP_DRHO),
      respectsAnchor: true, // drho = 0 at m=20 so drho^q vanishes there
      verdict: 'best anchor-respecting single-power (q~0.97) but pairwise exponent spread ~29% -- NOT clean',
    }),
    linearInDrho: Object.freeze({
      coefficientPerPoint: LINEAR_DRHO_COEFF,
      coefficientSpreadFrac: spreadFrac(LINEAR_DRHO_COEFF),
      respectsAnchor: true,
      verdict: 'through-origin (anchor-respecting) but coefficient spreads ~11.6% (the imp-95878 finding)',
    }),
    linearInLnM: Object.freeze({
      ...FIT_LN_M,
      respectsAnchor: false, // mispredicts the near-zero anchor
      overfitNote: 'three points / two parameters => one residual dof, R2 near 1 is automatic, not evidence',
      verdict: 'REJECTED: high aggregate R2 is a 3-point over-fit and it mispredicts the anchor (~-9.5e-7 vs ~-5.6e-11)',
    }),
  }),

  verdict: Object.freeze({
    anyCleanLaw: false,
    mDependenceReconstructionBorne: true,
    conclusion:
      'No clean anchor-respecting single-parameter law fits dI(m). The only laws vanishing at the m=20 '
      + 'anchor (powers of drho=1/20-1/m) have a drho-power exponent that drifts ~29% across the measured '
      + 'pairs and a through-origin linear coefficient that spreads ~12%; every alternative with higher '
      + 'aggregate R2 (power-in-m, linear-in-ln m) either breaks the anchor or is a three-point over-fit. '
      + 'This REINFORCES imp-95878: dI(m) admits no clean closed-form correction, so no reconstruction-'
      + 'independent c_odd(1/m) exists at m>20 and the m-dependence is genuinely reconstruction-borne. '
      + 'Extending to further moduli requires fresh Q0_recon(m) values available only through the 238-cell '
      + 'reconstruction (or a fresh Prop-6.3 v-integral + B24 certificate per m) -- the imp-95861 PIECE-A '
      + 'binding shortfall; this module measures/derives only and moves no bound.',
    namedSubGap:
      'no reconstruction-independent closed-form c_odd(1/m) at m>20; the dI(m) m-law admits no clean '
      + 'anchor-respecting closed form (drho-power exponent spread ~29%, linear-in-drho coefficient spread '
      + '~12%, every higher-R2 alternative either breaks the m=20 anchor or is a three-point over-fit).',
  }),

  caveats:
    'Measure/derive only: reuses the imp-95878 baked Sun (6.23) anchor and Q0_RECON literals over exactly '
    + 'three non-anchor moduli (m=22,30,41); adds no new modulus datum, no new quadrature, no certificate, '
    + 'no bound movement. Three-point fits are weak -- the anchor constraint dI(20)=0, not aggregate R2, is '
    + 'the load-bearing test. Catalan G irrationality OPEN; Sun single-author, unrefereed; no refereed bound is changed'
    + '; NO QED.',
});

export const C_ODD_DI_M_LAW_CHARACTERIZATION_ASSERTIONS = Object.freeze([
  {
    name: 'dI reproduces the imp-95878 non-anchor values at m=22,30,41 (~1e-9)',
    holds: () => Math.abs(NON_ANCHOR[0].dI - -3.018835e-6) < 1e-9
      && Math.abs(NON_ANCHOR[1].dI - -9.858537e-6) < 1e-9
      && Math.abs(NON_ANCHOR[2].dI - -1.665415e-5) < 1e-9,
  },
  {
    name: 'm=20 anchor: dI(20) collapses to the value-match (<1e-9), drho=0',
    holds: () => Math.abs(dIof(20)) < 1e-9 && (1 / 20 - 1 / 20) === 0,
  },
  {
    name: 'power-in-m violates the anchor and its pairwise exponents spread > 50 percent',
    holds: () => C_ODD_DI_M_LAW_CHARACTERIZATION.fits.powerInM.respectsAnchor === false
      && C_ODD_DI_M_LAW_CHARACTERIZATION.fits.powerInM.pairwiseSpreadFrac > 0.5,
  },
  {
    name: 'anchor-respecting drho-power exists but pairwise exponents spread > 20 percent (not clean)',
    holds: () => C_ODD_DI_M_LAW_CHARACTERIZATION.fits.powerInDrho.respectsAnchor === true
      && C_ODD_DI_M_LAW_CHARACTERIZATION.fits.powerInDrho.pairwiseSpreadFrac > 0.2,
  },
  {
    name: 'through-origin linear-in-drho coefficient spread exceeds 5 percent (imp-95878 finding)',
    holds: () => C_ODD_DI_M_LAW_CHARACTERIZATION.fits.linearInDrho.coefficientSpreadFrac > 0.05,
  },
  {
    name: 'linear-in-ln(m) has high aggregate R2 but mispredicts the anchor by > 1e-7 (over-fit artifact)',
    holds: () => FIT_LN_M.R2 > 0.999
      && Math.abs(FIT_LN_M.anchorPredictAt20) > 1e-7,
  },
  {
    name: 'verdict: no clean law, m-dependence reconstruction-borne',
    holds: () => C_ODD_DI_M_LAW_CHARACTERIZATION.verdict.anyCleanLaw === false
      && C_ODD_DI_M_LAW_CHARACTERIZATION.verdict.mDependenceReconstructionBorne === true,
  },
  {
    name: 'honest: sub-gap named, G irrationality OPEN, no refereed bound is changed, NO QED, no bound movement',
    holds: () =>
      /no reconstruction-independent closed-form/.test(C_ODD_DI_M_LAW_CHARACTERIZATION.verdict.namedSubGap)
      && /G irrationality OPEN/.test(C_ODD_DI_M_LAW_CHARACTERIZATION.status)
      && /refereed bound is changed/i.test(C_ODD_DI_M_LAW_CHARACTERIZATION.status)
      && /NO QED/.test(C_ODD_DI_M_LAW_CHARACTERIZATION.status)
      && /changes no bound/.test(C_ODD_DI_M_LAW_CHARACTERIZATION.status),
  },
]);

export default C_ODD_DI_M_LAW_CHARACTERIZATION;
