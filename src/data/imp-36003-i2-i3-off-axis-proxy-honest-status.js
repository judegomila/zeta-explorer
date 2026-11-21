/**
 * @module imp-36003-i2-i3-off-axis-proxy-honest-status
 * @fileoverview imp-36003 -- standalone HONEST-STATUS note (imp-35789-style banner pattern)
 *   recording the imp-35951 finding that the imp-35727 I2 (per-panel |Delta arg f| < pi cap)
 *   and I3 (modulus floor |f| >= delta > 0 on dR) winding-ingredient SIZING rests entirely on
 *   the HELD imp-33923 OFF-AXIS MODEL CUSP proxy rho = |x|^{-1/2} (a scale-free leading
 *   amplitude sampled on a theta parameterization, isRigorous:false), NOT on the true
 *   H_t = A + B - C evaluated on the transition-rectangle boundary dR at T_PT = 3e12. Read-only
 *   note: imports the imp-35951 module verbatim (no re-derivation, no new numerics) and states
 *   the honesty boundary plainly for a reader who lands on this ticket without reading imp-35951
 *   in full -- the imp-33923 slope |d arg/d theta| = 3/2 is a dimensionless per-radian density
 *   on the model-cusp theta parameterization, not the along-line Riemann-Siegel rate ~13.45
 *   rad/unit height imp-35757 uses, and the quadrature modulus C_PS = pi/sqrt(2) ~ 2.2214 is the
 *   model leading-amplitude modulus, not a lower bound on |H_t|. So imp-35951 CERTIFIES NEITHER
 *   the I2 cap NOR the I3 floor: both stay GREENFIELD, gated on the imp-35681 Part A / imp-35725
 *   A + B - C interval evaluator.
 *
 *   Ticket: imp-36003 (content, low). Note only; re-reads nothing new; changes no bound;
 *   C_mb GUE-conditional (imp-486) untouched; no refereed bound is changed; NO QED.
 *
 *   @see imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy.js (source module this note restates)
 *   @see imp-33923-off-axis-phase-winding-quadrature (held sampled slope -3/2 and modulus C_PS, isRigorous:false)
 *   @see imp-35727-w2-certified-winding-count-ingredients-scope (I1-I5 enumerated, all GREENFIELD)
 *   @see imp-35757-i2-panel-width-count-scope (I2 sized instead from the SMOOTH Riemann-Siegel mean rate)
 *   @see imp-35789-w2-ingredients-greenfield-honest-status-banner.js (the banner pattern this note follows)
 */

import { IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY } from './imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy.js';

const SRC = IMP35951_I2_I3_SIZING_FROM_IMP33923_SAMPLED_PROXY;

export const IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS = Object.freeze({
  id: 'imp-36003',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: the imp-35951 I2/I3 winding-ingredient sizing rests on the OFF-AXIS ' +
    'MODEL CUSP proxy rho = |x|^{-1/2}, NOT the true H_t = A + B - C on dR at T_PT -- it ' +
    'certifies neither the I2 cap nor the I3 floor',
  sourceModule: 'imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy.js',

  heldProxy: Object.freeze({
    source: SRC.heldProxy.source,
    windingSlopeMagnitude: SRC.heldProxy.windingSlopeMagnitude,
    quadratureModulus: SRC.heldProxy.quadratureModulus,
  }),
  i2SizedPanels: Object.freeze({
    borderline: SRC.i2PanelSizing.panelsBorderline,
    margin2: SRC.i2PanelSizing.panelsMargin2,
    margin4: SRC.i2PanelSizing.panelsMargin4,
    sampleIntrinsicMargin: SRC.i2PanelSizing.sampledNode.intrinsicMargin,
  }),
  i3CandidateDelta: SRC.i3ModulusFloorSizing.candidateDelta,
  isRigorous: SRC.isRigorous,

  honestyBoundary:
    'The imp-33923 proxy is the OFF-AXIS MODEL CUSP rho = |x|^{-1/2}, evaluated on a theta ' +
    'parameterization, NOT the true H_t = A + B - C on the transition-rectangle boundary dR at ' +
    'T_PT = 3e12. The sampled slope |d arg/d theta| = 3/2 is a dimensionless per-radian density ' +
    'on that theta parameterization -- NOT the along-line Riemann-Siegel rate ~13.45 rad per ' +
    'unit height that imp-35757 already used to size I2 from the smooth mean winding rate -- so ' +
    'the two panel counts are NOT one-to-one comparable. The quadrature modulus C_PS = ' +
    'pi/sqrt(2) ~ 2.2214 is the model leading-amplitude modulus, NOT a lower bound on |H_t|. A ' +
    'certified I2 cap needs an interval UPPER bound on the LOCAL rate of the true f, and a ' +
    'certified I3 floor needs an interval LOWER bound on |H_t| -- both gated on the greenfield ' +
    'imp-35681 Part A / imp-35725 A + B - C interval evaluator.',

  conclusion:
    'imp-35951 sizes I2 (panel counts 1/2/3 at margins m=1/2/4, intrinsic sample margin ~12) and ' +
    'I3 (candidate delta = C_PS ~ 2.2214) entirely from the HELD imp-33923 sampled off-axis ' +
    'proxy. Because that proxy is a model-cusp quantity and not the true H_t on dR, imp-35951 ' +
    'CERTIFIES NEITHER the I2 cap NOR the I3 floor: it instantiates no interval enclosure, ' +
    'certifies no cap, certifies no delta > 0, counts no zeros, and changes no bound. Both I2 ' +
    'and I3 stay GREENFIELD.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    certifiesI2Cap: false,
    certifiesI3Floor: false,
    changesAnyBound: false,
    reDerivesAnything: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-35951: the I2/I3 winding-ingredient sizing (panel ' +
    'counts 1/2/3, candidate I3 delta = C_PS ~ 2.2214) rests on the HELD imp-33923 OFF-AXIS ' +
    'MODEL CUSP proxy rho = |x|^{-1/2}, NOT the true H_t = A + B - C on dR at T_PT = 3e12, so it ' +
    'CERTIFIES NEITHER the I2 cap NOR the I3 floor -- both stay GREENFIELD, gated on the ' +
    'imp-35681 Part A / imp-35725 interval evaluator. Restatement only; changes no bound; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
});

export const IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36003-source-is-not-rigorous',
    why: 'The core claim of this note is that the imp-35951 sizing is a proxy, not a certified result -- the source module must itself be marked isRigorous:false.',
    holds: () =>
      IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS.isRigorous === false && SRC.isRigorous === false,
  },
  {
    id: 'imp36003-panel-counts-match-source',
    why: 'The recorded I2 panel counts must match the imp-35951 source literals (1, 2, 3 panels at margins 1/2/4).',
    holds: () => {
      const p = IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS.i2SizedPanels;
      return (
        p.borderline === 1 &&
        p.margin2 === 2 &&
        p.margin4 === 3 &&
        Math.abs(p.sampleIntrinsicMargin - 12) < 1e-9
      );
    },
  },
  {
    id: 'imp36003-i3-delta-matches-source',
    why: 'The recorded I3 candidate delta must match the imp-35951 source literal C_PS = pi/sqrt(2) ~ 2.2214.',
    holds: () =>
      Math.abs(IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS.i3CandidateDelta - Math.PI / Math.SQRT2) < 1e-9,
  },
  {
    id: 'imp36003-honesty-boundary-mentions-off-axis-cusp',
    why: 'The honesty-boundary text must plainly name the off-axis model cusp proxy, distinguishing it from the true H_t on dR.',
    holds: () =>
      /OFF-AXIS MODEL CUSP/.test(IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS.honestyBoundary) &&
      /NOT the true H_t = A \+ B - C/.test(IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS.honestyBoundary),
  },
  {
    id: 'imp36003-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim it certifies the I2 cap or the I3 floor, nor claim a bound change.',
    holds: () =>
      IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS.honestCaveat.certifiesI2Cap === false &&
      IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS.honestCaveat.certifiesI3Floor === false &&
      IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36003-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36003-i2-i3-off-axis-proxy-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36003_I2_I3_OFF_AXIS_PROXY_HONEST_STATUS;
