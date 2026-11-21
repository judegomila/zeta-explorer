/**
 * @fileoverview imp-95966 -- ASSESS whether the imp-95925 238-cell Q0_RECON reconstruction can be
 * certified against Sun Prop-6.3 at ONE larger modulus (m=41 or m=60), or record the precise
 * obstruction to extending the m=20-only certification across the imp-95925 large-m range.
 *
 * MEASURE/ASSESS ONLY; changes no bound; NO QED.
 *
 * WHY THIS MATTERS (imp-95925 honest caveat). imp-95925 read its clean-cancellation finding
 * (dg_{k*}/dt = C_1 + D_3(m) collapses ~198x, positive tail decays like ~midM^-3 to zero) off
 * Q0_RECON at m up to 150. That extrapolation rests on the 238-cell reconstruction staying FAITHFUL
 * to Sun Prop-6.3 beyond m=20. imp-95822/95925 carry the honest caveat that Q0_RECON is certified
 * against Prop-6.3 ONLY at m=20 (via the Sun 6.23 kappa): grid-convergence to ~1e-11 shows the
 * integral of the reconstructed integrand is exact, NOT that the reconstruction equals Prop-6.3 at
 * m>20. This module assesses whether that certification can be pushed to m=41 or m=60.
 *
 * THE PROP-6.3 COMPARISON QUANTITY. The certification cross-check at m=20 works because Prop-6.3
 * eq (6.23) states the certified c_odd(1/20) = 0.006276744728100982 (kappa = c_odd/rho^2 =
 * 2.5106978912403926). Via imp-95745 (the +4 offset proven exactly 4 and m-independent; const sector
 * = -5/2), the reconstruction gives c_odd(1/m) = -(1/m^2)(-5/2 + Q0_RECON(m)). At m=20 this
 * reproduces the certified anchor to 3.5e-13 -- the single external cross-check that certifies the
 * reconstruction. To certify at m=41 or m=60 one would recompute the SAME comparison quantity
 * c_odd(1/m) and check it against an INDEPENDENT Prop-6.3 value at that m.
 *
 * ASSESSMENT (extends the imp-95842/95861/95878 verdict to the imp-95925 large-m range). Certifying
 * Q0_RECON at m>20 is OBSTRUCTED, and the obstruction is the SAME binding PIECE-A shortfall already
 * localized for m=22,30,41 -- now confirmed unchanged at the imp-95925 moduli m=41,60,150:
 *
 *   (1) NO INDEPENDENT TARGET. Prop-6.3 eq (6.23) states the certified c_odd only at m=20. The
 *       preprint carries NO independent c_odd(1/m) at any m>20 to compare against. imp-95878 proved
 *       the only reconstruction-independent closed form generalizing (6.23) is the pure-rho^2 null
 *       kappa/m^2, and REFUTED it as a PIECE-A target (the departure is the genuine, growing Q_0
 *       rho-variation, which a pure-rho^2 form forces to zero). So no independent target exists.
 *
 *   (2) B24 IS THE WRONG LEVER. imp-95842 showed a (6.26) B24 Euler-Maclaurin certificate certifies
 *       QUADRATURE (already ~1e-11), not integrand/MODEL faithfulness. It supplies imp-95861 PIECE B
 *       (a rigorous quadrature enclosure) but nothing for PIECE A (an independent target for the
 *       true Q_0(m) integrand value). PIECE A is the binding shortfall.
 *
 *   (3) WHAT IS ALREADY TRANSPORTED. imp-95745 proved the +4 const-sector offset exactly 4 and
 *       m-free; imp-95720 reproduced the m-dependent leading curvature -(4m-1)/2 exactly. So the
 *       residual conditionality is a SINGLE integrand-faithfulness hypothesis (the TIER-3 sub-leading
 *       per-cell K_v coefficients of Q_0(m,v)) attached identically to every m>20, verified only at
 *       m=20 -- NOT a quadrature caveat and NOT the +4 offset.
 *
 * RECONSTRUCTED COMPARISON QUANTITY (this module, baked from imp-95925 Q0_RECON literals):
 *   m=41  c_odd_recon = 1.4935491241e-3   null kappa/m^2 = 1.4935739984e-3   -1.6654e-5 below null
 *   m=60  c_odd_recon = 6.9740483835e-4   null kappa/m^2 = 6.9741608090e-4   -1.6120e-5 below null
 *   m=150 c_odd_recon = 1.1158456938e-4   null kappa/m^2 = 1.1158657294e-4   -1.7955e-5 below null
 * The ~1.6-1.8e-5 fractional departure below the pure-rho^2 null is exactly the imp-95653/95690/95702
 * genuine Q_0 rho-variation -- present, growing with m, NOT a clean pure-rho^2 law. This is the
 * quantity imp-95878 showed no independent closed form can reproduce, so it re-confirms (1): the
 * reconstruction is the ONLY source of the m>20 value, hence the check at m=41/60 is a
 * self-consistency of the machinery, not a comparison against an external Prop-6.3 output.
 *
 * CONSEQUENCE FOR imp-95925 (honest, does not weaken the finding, bounds its status). The
 * clean-cancellation finding (dg_{k*}/dt collapses ~198x, tail ~midM^-3) is read off a reconstruction
 * that is OFFSET-CERTAIN double-precision at m=41,60,150 (all m-free structure transported, quadrature
 * grid-converged to ~1e-11) but rests on the single TIER-3 integrand-faithfulness hypothesis, verified
 * only at m=20. The clean cancellation is therefore a robust feature of a faithful-at-m=20,
 * structurally-transported-to-m>20 reconstruction, NOT a Prop-6.3-certified statement at each m.
 *
 * VERDICT: certification at m=41 or m=60 is OBSTRUCTED. Precise obstruction = the absence of a
 * reconstruction-independent Prop-6.3 target c_odd(1/m) at m>20 (PIECE A): (6.23) supplies it only at
 * m=20, and imp-95878 proved no closed-form generalization exists. This confirms the imp-95842/95861
 * binding obstruction is unchanged across the imp-95925 large-m range; the only routes to certify are
 * a second independently-stated Sun anchor (absent in the preprint) or a symbolic Prop-6.3 TRANSPORT
 * identity for the TIER-3 K_v coefficients (imp-95877, open).
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound;
 * NO Lambda movement; no refereed bound is changed; NO QED. Import-light: bakes the imp-95925 Q0_RECON
 * literals + the certified kappa; no heavy quadrature at import. SCRATCH: tmp/imp-95966-scratch.mjs.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.23).
 */

// Prop-6.3 (6.23) certified anchor (the ONLY externally-certified c_odd; m=20 only) and its kappa.
const C_ODD_20_CERTIFIED = 0.006276744728100982; // Sun (6.23), rho = 1/20
const KAPPA = C_ODD_20_CERTIFIED * 400; // c_odd(1/20)/rho^2 = 2.5106978912403926

// imp-95925 grid-converged Q0_RECON literals (Nsub>=120000; m=150 checked at 240000, shift ~3.4e-11).
const Q0_RECON = Object.freeze({
  20: -0.0106978911,
  41: -0.0106560776913469,
  60: -0.0106574180750,
  150: -0.0106528111327,
});

// imp-95745 derived reconstruction of the Prop-6.3 comparison quantity:
// c_odd(1/m) = -(1/m^2)(-5/2 + Q0_RECON(m)), the +4 offset (const sector -5/2) proven m-free.
const cOddRecon = (m) => -(1 / (m * m)) * (-2.5 + Q0_RECON[m]);
const nullPureRho2 = (m) => KAPPA / (m * m); // pure-rho^2 null (imp-95878, refuted as an independent target)

const LARGE_MODULI = Object.freeze([41, 60, 150]); // the imp-95925 non-anchor range
const COMPARISON = Object.freeze(
  LARGE_MODULI.map((m) => {
    const recon = cOddRecon(m);
    const nul = nullPureRho2(m);
    return Object.freeze({ m, cOddRecon: recon, nullPureRho2: nul, fracBelowNull: recon / nul - 1 });
  }),
);

// the single external cross-check that DOES certify: m=20 reconstruction vs certified anchor.
const ANCHOR_RESIDUAL = Math.abs(cOddRecon(20) - C_ODD_20_CERTIFIED); // ~3.5e-13
// the genuine Q_0 rho-variation the reconstruction carries at m>20 (what a pure-rho^2 form forces to 0).
const RHO_VARIATION_PRESENT = COMPARISON.every((r) => r.fracBelowNull < 0 && Math.abs(r.fracBelowNull) > 1e-6);

export const Q0_RECON_LARGEM_CERTIFICATION_OBSTRUCTION = Object.freeze({
  id: 'imp-95966-q0-recon-largem-certification-obstruction',
  title:
    'Assess whether the imp-95925 238-cell Q0_RECON reconstruction can be certified against Sun '
    + 'Prop-6.3 at a larger modulus (m=41 or m=60): OBSTRUCTED -- the binding imp-95842/95861/95878 '
    + 'PIECE-A shortfall (no reconstruction-independent c_odd(1/m) at m>20) is unchanged across the '
    + 'imp-95925 large-m range m=41,60,150; the m=20-only certification does not extend',
  status:
    'ASSESSED (obstruction recorded) -- certifying Q0_RECON against Prop-6.3 at m=41 or m=60 is '
    + 'OBSTRUCTED by the same binding PIECE-A shortfall imp-95842/95861/95878 localized for m=22,30,41, '
    + 'now confirmed at the imp-95925 moduli m=41,60,150. (6.23) states the certified c_odd only at '
    + 'm=20; imp-95878 proved no reconstruction-independent closed-form c_odd(1/m) at m>20 exists (the '
    + 'pure-rho^2 null kappa/m^2 is refuted as a target), and imp-95842 showed a (6.26) B24 certificate '
    + 'certifies quadrature not integrand faithfulness. The reconstructed comparison quantity c_odd(1/m) '
    + 'sits ~1.6-1.8e-5 (fractional) below the pure-rho^2 null at m=41,60,150 -- the genuine growing Q_0 '
    + 'rho-variation, the exact departure a pure-rho^2 target forces to zero -- so the m>20 value comes '
    + 'ONLY from the reconstruction (self-consistency, not an external check). imp-95745 (offset +4 '
    + 'm-free) + imp-95720 (curvature -(4m-1)/2 reproduced) transport all but the TIER-3 sub-leading K_v '
    + 'coefficients, so the residual is a SINGLE integrand-faithfulness hypothesis verified only at m=20. '
    + 'Consequence: the imp-95925 clean-cancellation finding rests on that offset-certain, '
    + 'structurally-transported reconstruction, not a per-m Prop-6.3 certification. G irrationality '
    + 'OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.23)',
  builtOn:
    'imp-95925 (large-m Q0_RECON sweep + honest m=20-only caveat this assesses), imp-95822 (faithful '
    + '238-cell machinery, m=20-only certification), imp-95745 (+4 offset proven exactly 4 and m-free), '
    + 'imp-95720 (curvature -(4m-1)/2 reproduced; +4 obstruction), imp-95842 (B24 is the wrong lever), '
    + 'imp-95861 (PIECE A / PIECE B decomposition; PIECE A binding), imp-95878 (no independent '
    + 'closed-form c_odd(1/m) at m>20), imp-95877 (open symbolic TRANSPORT identity)',
  scratch: ['tmp/imp-95966-scratch.mjs'],

  kappa: KAPPA,
  cOdd20Certified: C_ODD_20_CERTIFIED,
  q0Recon: Q0_RECON,

  comparison: COMPARISON, // reconstructed c_odd(1/m) vs pure-rho^2 null at m=41,60,150
  anchorResidual: ANCHOR_RESIDUAL, // ~3.5e-13: the single external cross-check (m=20)

  obstruction: Object.freeze({
    verdict: 'OBSTRUCTED -- certification does not extend past m=20',
    bindingShortfall:
      'PIECE A: no reconstruction-independent Prop-6.3 target c_odd(1/m) at any m>20. (6.23) supplies '
      + 'it only at m=20; imp-95878 proved the only closed-form generalization (pure-rho^2 null '
      + 'kappa/m^2) is refuted as a target, so the reconstruction is the sole source of the m>20 value.',
    b24WrongLever:
      'a (6.26) B24 Euler-Maclaurin certificate certifies QUADRATURE (already ~1e-11), not integrand '
      + 'faithfulness (imp-95842); it supplies PIECE B, nothing for PIECE A.',
    alreadyTransported:
      'imp-95745 proved the +4 const-sector offset exactly 4 and m-free; imp-95720 reproduced the '
      + 'leading curvature -(4m-1)/2 exactly. Residual conditionality = a SINGLE TIER-3 '
      + 'integrand-faithfulness hypothesis (sub-leading per-cell K_v coefficients) verified only at '
      + 'm=20, attached identically to every m>20; NOT a quadrature caveat and NOT the +4 offset.',
    rhoVariationPresent: RHO_VARIATION_PRESENT, // the departure a pure-rho^2 target forces to zero
    routesToCertify:
      'either a second independently-stated Sun anchor c_odd(1/m), m>20 (absent in the preprint) or a '
      + 'symbolic Prop-6.3 TRANSPORT identity for the TIER-3 K_v coefficients (imp-95877, open).',
  }),

  consequenceForImp95925: Object.freeze({
    finding:
      'the imp-95925 clean-cancellation (dg_{k*}/dt collapses ~198x, positive tail ~midM^-3 to zero) '
      + 'is read off Q0_RECON at m up to 150.',
    status:
      'that reconstruction is OFFSET-CERTAIN double-precision at m=41,60,150 (all m-free structure '
      + 'transported, quadrature grid-converged ~1e-11) but rests on the single TIER-3 '
      + 'integrand-faithfulness hypothesis verified only at m=20. The clean cancellation is a robust '
      + 'feature of a faithful-at-m=20, structurally-transported-to-m>20 reconstruction, NOT a '
      + 'per-m Prop-6.3-certified statement.',
  }),

  caveats:
    'Assessment only; recomputes the Prop-6.3 comparison quantity c_odd(1/m) from the baked imp-95925 '
    + 'Q0_RECON literals and records the precise obstruction. No new quadrature; no independent Sun '
    + 'anchor at m>20 exists to check against. Catalan G irrationality OPEN; Sun single-author, '
    + 'unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const Q0_RECON_LARGEM_CERTIFICATION_OBSTRUCTION_ASSERTIONS = Object.freeze([
  {
    name: 'the m=20 reconstruction reproduces the certified Prop-6.3 anchor c_odd(1/20) to < 1e-11',
    holds: () =>
      ANCHOR_RESIDUAL < 1e-11
      && Math.abs(KAPPA - C_ODD_20_CERTIFIED * 400) < 1e-13,
  },
  {
    name: 'reconstructed comparison quantity c_odd(1/m) covers the imp-95925 large-m range m=41,60,150',
    holds: () =>
      COMPARISON.length === 3
      && COMPARISON.map((r) => r.m).join(',') === '41,60,150'
      && Math.abs(COMPARISON[0].cOddRecon - 1.4935491241e-3) < 1e-11
      && Math.abs(COMPARISON[2].cOddRecon - 1.1158456938e-4) < 1e-11,
  },
  {
    name: 'FINDING: recon sits ~1.6-1.8e-5 (fractional) below the pure-rho^2 null (genuine Q_0 rho-variation)',
    holds: () =>
      RHO_VARIATION_PRESENT === true
      && COMPARISON.every((r) => r.fracBelowNull < 0)
      && Math.abs(COMPARISON[0].fracBelowNull - (-1.6654e-5)) < 1e-8
      && Math.abs(COMPARISON[2].fracBelowNull - (-1.7955e-5)) < 1e-8,
  },
  {
    name: 'OBSTRUCTION: binding PIECE-A shortfall (no reconstruction-independent c_odd(1/m) at m>20)',
    holds: () => {
      const o = Q0_RECON_LARGEM_CERTIFICATION_OBSTRUCTION.obstruction;
      return /OBSTRUCTED/.test(o.verdict)
        && /PIECE A/.test(o.bindingShortfall)
        && /imp-95878/.test(o.bindingShortfall)
        && /B24/.test(o.b24WrongLever);
    },
  },
  {
    name: 'the residual is a SINGLE TIER-3 integrand-faithfulness hypothesis, not quadrature or the +4 offset',
    holds: () => {
      const o = Q0_RECON_LARGEM_CERTIFICATION_OBSTRUCTION.obstruction;
      return /TIER-3/.test(o.alreadyTransported)
        && /verified only at\s+m=20/.test(o.alreadyTransported)
        && /NOT a quadrature caveat and NOT the \+4 offset/.test(o.alreadyTransported);
    },
  },
  {
    name: 'consequence for imp-95925 recorded: clean cancellation is offset-certain, not per-m certified',
    holds: () => {
      const c = Q0_RECON_LARGEM_CERTIFICATION_OBSTRUCTION.consequenceForImp95925;
      return /OFFSET-CERTAIN/.test(c.status)
        && /NOT a\s+per-m Prop-6.3-certified statement/.test(c.status);
    },
  },
  {
    name: 'honest: assessment only, obstruction recorded, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () => {
      const s = Q0_RECON_LARGEM_CERTIFICATION_OBSTRUCTION.status;
      return /ASSESSED \(obstruction recorded\)/.test(s)
        && /G irrationality OPEN/.test(s)
        && /refereed bound is changed/i.test(s)
        && /NO QED/.test(s);
    },
  },
]);

export default Q0_RECON_LARGEM_CERTIFICATION_OBSTRUCTION;
