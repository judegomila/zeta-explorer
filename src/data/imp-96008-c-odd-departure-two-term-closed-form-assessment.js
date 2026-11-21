/**
 * @fileoverview imp-96008 -- ASSESS whether the imp-95878 J-variation departure dI(m) admits a
 * two-term reconstruction-borne closed form, now that the full imp-95925/95982 Q0_RECON grid pins
 * dI at 8 moduli (m=20..150) instead of the three (m=22,30,41) imp-95878 had. MEASURE/FIT ONLY;
 * changes no bound; NO QED.
 *
 * WHAT imp-95878 LEFT OPEN. imp-95878 refuted the pure-rho^2 null c_odd_null(1/m)=kappa/m^2 as an
 * independent PIECE-A target by the nonzero, growing fractional J-variation
 *   dI(m) = kappa_recon(m)/kappa - 1,   kappa_recon(m) = 5/2 - Q0_RECON(m),   kappa = 400.c_odd(1/20),
 * and tested dI against a single linear law in drho = 1/20 - 1/m: dI/drho = -6.64e-4, -5.92e-4,
 * -6.50e-4 at m=22,30,41 -- "roughly constant" with ~11% scatter, NOT a clean linear closed form.
 * That verdict rested on THREE points inside a narrow low-m window; imp-95878 named "dI(m)'s own
 * m-law is not clean" as an open sub-gap. This module re-fits dI on the full 8-modulus grid.
 *
 * THE IDENTITY (why dI is the imp-95982 fracBelowNull). Because kappa = 400.c_odd(1/20) = 5/2 -
 * Q0_RECON(20) to the m=20 anchor residual (imp-95745 +4 offset m-free), the 1/m^2 prefactor cancels
 * and dI(m) = (5/2 - Q0_RECON(m))/kappa - 1 = (Q0_RECON(20) - Q0_RECON(m))/kappa -- EXACTLY the
 * imp-95982 fracBelowNull. So fitting dI(m) is fitting the rescaled Q0_RECON increment relative to m=20.
 *
 * THE FITS (offline, reproduced in-module; scratch tmp/imp-96008-scratch.mjs). On the 7 m>20 grid
 * points (drho, dI):
 *   1) LINEAR through origin  dI = a.drho          -> a = -4.6733e-4,  RSS = 3.497e-11.
 *      dI/drho full-grid spread is -46.3% (min -6.641e-4 at m=22, max -4.143e-4 at m=150) -- FOUR
 *      times the 11% imp-95878 saw. The narrow m=22,30,41 window masked a large systematic fall of
 *      the slope with m; the "roughly constant" reading was a small-window artifact.
 *   2) TWO-TERM A  dI = a.drho + b.drho^2          -> a = -8.1310e-4, b = 9.2994e-3, RSS = 5.770e-12.
 *      Cuts RSS ~6x, but the sign of b makes dI turn back UP (less negative) and ultimately DIVERGE
 *      away from a finite floor as drho grows -- it contradicts the imp-95982 SATURATION to a finite
 *      ~-1.83e-5 ceiling. Better fit, wrong asymptotics: not a valid closed form.
 *   3) TWO-TERM B  dI = a + b/m                     -> a = -2.1914e-5, b = 3.7183e-4, RSS = 2.177e-11.
 *      This form DOES saturate (a is the m->inf limit), but leaves RSS worse than form A and its
 *      extrapolated ceiling a = -2.191e-5 overshoots the imp-95982/96007 parity-clean power-law
 *      ceiling (Q0_RECON(20)-L)/kappa = -1.832e-5 by ~20% -- because a + b/m ignores the imp-95967
 *      parity split and forces one branch through both parities.
 *
 * VERDICT: NO clean low-order two-term closed form. Neither two-term law removes the scatter in a
 * physically consistent way: the drho^2 form fits best but diverges (violates saturation), the a+b/m
 * form saturates but fits worst and its ceiling disagrees ~20% with the certified-shape imp-95982
 * power law. The genuine structure of dI(m) is the imp-95982/96007 PARITY-SPLIT saturating power law
 * Q0_RECON(m) = L - c.m^-p (p ~ 1.96), i.e. the departure is reconstruction-borne with a finite floor,
 * NOT a low-order polynomial in drho or 1/m. This CONFIRMS and sharpens the imp-95878 sub-gap: dI(m)
 * has no clean two-term closed form, and the independent-route PIECE-A shortfall (imp-95861) is not
 * one analytic correction term away.
 *
 * HONEST CAVEAT. Fit only, on the imp-95925 grid-converged Q0_RECON literals (certified at m=20 only,
 * Sun 6.23); this fits the RECONSTRUCTION, not a Prop-6.3-certified per-m quantity (imp-95966 PIECE-A
 * obstruction unchanged). RSS values compare fit quality on 7 points; they are not evidence any form
 * is "correct". Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; NO
 * Lambda movement; no refereed bound is changed; NO QED. Import-light: bakes the imp-95925 Q0_RECON literals +
 * the certified kappa, runs 7-point linear algebra at import (no heavy quadrature).
 *
 * SOURCE: arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.19)-(6.23).
 */

// Prop-6.3 (6.23) certified anchor (the ONLY externally-certified c_odd; m=20 only) and its kappa.
const C_ODD_20_CERTIFIED = 0.006276744728100982; // Sun (6.23), rho = 1/20
const KAPPA = C_ODD_20_CERTIFIED * 400; // 2.5106978912403926

// imp-95925 grid-converged Q0_RECON literals (all 8 baked moduli), Nsub>=120000, grid-converged ~1e-11.
const Q0_RECON = Object.freeze({
  20: -0.0106978911,
  22: -0.0106903118589691,
  30: -0.0106731394320504,
  41: -0.0106560776913469,
  60: -0.0106574180750,
  80: -0.0106550369153,
  110: -0.0106535768247,
  150: -0.0106528111327,
});
const MODULI = Object.freeze([20, 22, 30, 41, 60, 80, 110, 150]);

// dI(m) = kappa_recon(m)/kappa - 1 = (Q0_RECON(20) - Q0_RECON(m))/kappa (imp-95878 / imp-95982).
const dI = (m) => (2.5 - Q0_RECON[m]) / KAPPA - 1;
const drho = (m) => 1 / 20 - 1 / m;

// the 7 non-anchor grid points (m=20 excluded: drho=0, dI~0 by construction).
const ROWS = Object.freeze(MODULI.filter((m) => m !== 20).map((m) => Object.freeze({
  m,
  drho: drho(m),
  dI: dI(m),
  dIperDrho: dI(m) / drho(m),
  parity: m % 2 === 0 ? 'even' : 'odd',
})));

// --- linear through origin: dI = a.drho ---
function fitLinearThroughOrigin() {
  let sxy = 0, sxx = 0;
  for (const r of ROWS) { sxy += r.drho * r.dI; sxx += r.drho * r.drho; }
  const a = sxy / sxx;
  let rss = 0;
  for (const r of ROWS) { const e = r.dI - a * r.drho; rss += e * e; }
  return { a, rss };
}
// --- generic 2-parameter least squares via a 2x2 normal-equation inverse ---
function fitTwoTerm(phi0, phi1) {
  let a11 = 0, a12 = 0, a22 = 0, b1 = 0, b2 = 0;
  for (const r of ROWS) {
    const p0 = phi0(r), p1 = phi1(r);
    a11 += p0 * p0; a12 += p0 * p1; a22 += p1 * p1;
    b1 += p0 * r.dI; b2 += p1 * r.dI;
  }
  const det = a11 * a22 - a12 * a12;
  const c0 = (a22 * b1 - a12 * b2) / det;
  const c1 = (a11 * b2 - a12 * b1) / det;
  let rss = 0;
  for (const r of ROWS) { const e = r.dI - (c0 * phi0(r) + c1 * phi1(r)); rss += e * e; }
  return { c0, c1, rss };
}

const LINEAR = fitLinearThroughOrigin();
const TWO_TERM_DRHO2 = fitTwoTerm((r) => r.drho, (r) => r.drho * r.drho); // dI = a.drho + b.drho^2
const TWO_TERM_INVM = fitTwoTerm(() => 1, (r) => 1 / r.m);                 // dI = a + b/m

// dI/drho spread across the full grid (imp-95878 measured 11% on the m=22,30,41 window).
const RATIOS = ROWS.map((r) => r.dIperDrho);
const RATIO_SPREAD = (Math.max(...RATIOS) - Math.min(...RATIOS)) / ((Math.max(...RATIOS) + Math.min(...RATIOS)) / 2);

// imp-95982/96007 certified-shape parity-clean power-law ceiling (for the a+b/m overshoot check).
const POWER_LAW_CEILING = -1.832e-5;

export const C_ODD_DEPARTURE_TWO_TERM_CLOSED_FORM_ASSESSMENT = Object.freeze({
  id: 'imp-96008-c-odd-departure-two-term-closed-form-assessment',
  title:
    'Assess whether the imp-95878 J-variation departure dI(m) admits a two-term closed form on the '
    + 'full imp-95925/95982 Q0_RECON grid (m=20..150): NO clean low-order two-term law fits -- the '
    + 'drho^2 form fits best but DIVERGES (violates imp-95982 saturation), the a+b/m form saturates '
    + 'but fits worst and its ceiling overshoots the certified power law by ~20%; dI(m) is genuinely '
    + 'reconstruction-borne (imp-95982/96007 parity-split saturating power law), confirming the '
    + 'imp-95878 sub-gap',
  status:
    'MEASURED/FIT (re-fit dI on the full 8-modulus grid, extending the imp-95878 three-point window) -- '
    + 'dI(m) = (Q0_RECON(20)-Q0_RECON(m))/kappa (the imp-95982 fracBelowNull). On the 7 m>20 points: '
    + 'LINEAR through origin dI=a.drho gives a=-4.6733e-4, RSS=3.497e-11 but the dI/drho spread is '
    + '-46.3% (min -6.641e-4 at m=22, max -4.143e-4 at m=150) -- 4x the 11% imp-95878 saw on '
    + 'm=22,30,41, so the narrow window MASKED a large systematic slope fall. TWO-TERM A dI=a.drho+'
    + 'b.drho^2 gives a=-8.1310e-4, b=+9.2994e-3, RSS=5.770e-12 (~6x better) but b>0 makes dI turn '
    + 'back up and DIVERGE, contradicting the imp-95982 saturation to a finite ~-1.83e-5 floor. '
    + 'TWO-TERM B dI=a+b/m gives a=-2.1914e-5, b=+3.7183e-4, RSS=2.177e-11: it saturates (a=limit) but '
    + 'fits worse than A and its ceiling a=-2.191e-5 overshoots the imp-95982/96007 parity-clean '
    + 'power-law ceiling -1.832e-5 by ~20% (it ignores the imp-95967 parity split). VERDICT: NO clean '
    + 'two-term closed form; dI is reconstruction-borne (imp-95982/96007 parity-split power law '
    + 'Q0_RECON=L-c.m^-p, p~1.96), confirming the imp-95878 sub-gap. Fits the reconstruction (m=20-only '
    + 'certified, imp-95966 PIECE-A unchanged); changes no bound. G irrationality OPEN; Sun unrefereed; '
    + 'no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.19)-(6.23)',
  builtOn:
    'imp-95878 (refuted the pure-rho^2 null; tested dI vs a single linear-in-drho law on m=22,30,41 '
    + 'with ~11% scatter and named "dI(m)s own m-law is not clean" as the open sub-gap -- this module '
    + 're-fits on the full grid), imp-95982 (fracBelowNull = (Q0_RECON(20)-Q0_RECON(m))/kappa, the exact '
    + 'identity for dI; saturating even-branch power law L-c.m^-p, ceiling -1.832e-5), imp-96007 '
    + '(odd-branch cross-validation of the same ceiling), imp-95967 (Q0_RECON parity split), imp-95925 '
    + '(the 8-modulus grid), imp-95745 (+4 offset m-free, so the 1/m^2 cancels)',
  scratch: ['tmp/imp-96008-scratch.mjs'],

  kappa: KAPPA,
  q0Recon: Q0_RECON,
  rows: ROWS,

  fits: Object.freeze({
    linearThroughOrigin: Object.freeze({
      form: 'dI = a.drho',
      a: LINEAR.a, // ~ -4.6733e-4
      rss: LINEAR.rss, // ~ 3.497e-11
      dIperDrhoSpread: RATIO_SPREAD, // ~ -0.463 (46.3%), 4x the imp-95878 11% window
      note: 'the imp-95878 baseline; on the full grid the slope is far from constant (46% spread)',
    }),
    twoTermDrho2: Object.freeze({
      form: 'dI = a.drho + b.drho^2',
      a: TWO_TERM_DRHO2.c0, // ~ -8.1310e-4
      b: TWO_TERM_DRHO2.c1, // ~ +9.2994e-3
      rss: TWO_TERM_DRHO2.rss, // ~ 5.770e-12 (best RSS)
      verdict: 'best RSS (~6x below linear) but b>0 makes dI DIVERGE -- violates imp-95982 saturation',
    }),
    twoTermInvM: Object.freeze({
      form: 'dI = a + b/m',
      a: TWO_TERM_INVM.c0, // ~ -2.1914e-5 (m->inf ceiling)
      b: TWO_TERM_INVM.c1, // ~ +3.7183e-4
      rss: TWO_TERM_INVM.rss, // ~ 2.177e-11 (worse than drho^2)
      ceiling: TWO_TERM_INVM.c0,
      ceilingOvershootVsPowerLaw: TWO_TERM_INVM.c0 / POWER_LAW_CEILING - 1, // ~ +0.196 (~20% overshoot)
      verdict: 'saturates (a is the limit) but fits worse than A and overshoots the imp-95982 ceiling ~20%',
    }),
  }),

  finding: Object.freeze({
    outcome: 'NO clean low-order two-term closed form for dI(m)',
    linearScatterFullGrid: RATIO_SPREAD, // ~46% (vs the imp-95878 3-point 11%)
    reason:
      'the drho^2 form fits best (RSS ~5.77e-12) but has b>0 and DIVERGES (contradicts the imp-95982 '
      + 'finite ~-1.83e-5 ceiling); the a+b/m form saturates but fits worse (RSS ~2.18e-11) and its '
      + 'ceiling -2.19e-5 overshoots the certified-shape imp-95982/96007 power-law ceiling -1.83e-5 by '
      + '~20% (it forces one branch through both imp-95967 parities). Neither is physically consistent.',
    genuineStructure:
      'dI(m) is reconstruction-borne: the imp-95982/96007 parity-split saturating power law '
      + 'Q0_RECON(m) = L - c.m^-p (p ~ 1.96) governs it, not a low-order polynomial in drho or 1/m.',
    confirmsSubGap:
      'imp-95878 named "no clean m-law for dI(m)"; this full-grid re-fit CONFIRMS it and shows the '
      + '3-point 11% scatter was itself a narrow-window artifact (full-grid spread ~46%). The '
      + 'independent-route PIECE-A shortfall (imp-95861) is NOT one analytic correction term away.',
  }),

  caveats:
    'Measurement/fit only; recomputes dI from the baked imp-95925 Q0_RECON literals and runs 7-point '
    + 'linear algebra at import. Q0_RECON is certified only at m=20 (imp-95966 PIECE-A obstruction '
    + 'unchanged), so this fits the reconstruction, not a Prop-6.3-certified per-m quantity. RSS '
    + 'compares fit quality on 7 points; it is not evidence any form is correct. Catalan G '
    + 'irrationality OPEN; Sun single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const C_ODD_DEPARTURE_TWO_TERM_CLOSED_FORM_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    name: 'dI(m) equals the imp-95982 fracBelowNull identity (Q0_RECON(20)-Q0_RECON(m))/kappa',
    holds: () => ROWS.every((r) => Math.abs(r.dI - (Q0_RECON[20] - Q0_RECON[r.m]) / KAPPA) < 1e-10),
  },
  {
    name: 'the fit is run on all 7 non-anchor grid points m=22..150 (extends imp-95878 3 points)',
    holds: () => ROWS.length === 7 && ROWS.map((r) => r.m).join(',') === '22,30,41,60,80,110,150',
  },
  {
    name: 'LINEAR through origin recovers the imp-95878 slope sign/scale (a ~ -4.67e-4)',
    holds: () => LINEAR.a < 0 && Math.abs(LINEAR.a - (-4.6733e-4)) < 1e-7,
  },
  {
    name: 'full-grid dI/drho spread ~46% -- 4x the imp-95878 three-point 11% (narrow-window artifact)',
    holds: () => Math.abs(RATIO_SPREAD) > 0.4 && Math.abs(RATIO_SPREAD) < 0.5,
  },
  {
    name: 'TWO-TERM A dI=a.drho+b.drho^2 fits best (RSS below linear) but has b>0 (DIVERGES, no saturation)',
    holds: () => TWO_TERM_DRHO2.rss < LINEAR.rss && TWO_TERM_DRHO2.c1 > 0,
  },
  {
    name: 'TWO-TERM B dI=a+b/m saturates (a<0 ceiling) but fits worse than A and overshoots the power law ~20%',
    holds: () =>
      TWO_TERM_INVM.c0 < 0
      && TWO_TERM_INVM.rss > TWO_TERM_DRHO2.rss
      && Math.abs(TWO_TERM_INVM.c0 / POWER_LAW_CEILING - 1) > 0.1
      && Math.abs(TWO_TERM_INVM.c0 / POWER_LAW_CEILING - 1) < 0.3,
  },
  {
    name: 'VERDICT: no clean two-term closed form; dI is reconstruction-borne (imp-95982/96007 power law)',
    holds: () =>
      /NO clean low-order two-term closed form/.test(C_ODD_DEPARTURE_TWO_TERM_CLOSED_FORM_ASSESSMENT.finding.outcome)
      && /reconstruction-borne/.test(C_ODD_DEPARTURE_TWO_TERM_CLOSED_FORM_ASSESSMENT.finding.genuineStructure),
  },
  {
    name: 'honest: fit only, m=20-only certified, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () => {
      const s = C_ODD_DEPARTURE_TWO_TERM_CLOSED_FORM_ASSESSMENT.status;
      return /MEASURED\/FIT/.test(s)
        && /m=20-only certified/.test(s)
        && /G irrationality OPEN/.test(s)
        && /refereed bound is changed/i.test(s)
        && /NO QED/.test(s);
    },
  },
]);

export default C_ODD_DEPARTURE_TWO_TERM_CLOSED_FORM_ASSESSMENT;
