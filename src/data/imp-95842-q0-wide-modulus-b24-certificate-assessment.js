/**
 * @fileoverview imp-95842 — assess an independent (6.26) B24 Euler-Maclaurin certificate for the
 * faithful 238-cell Q_0(m,v) reconstruction at the non-anchor moduli m=22,30,41, where only m=20
 * has a Sun-certified kappa. Verdict: a B24 certificate is the WRONG LEVER for this residual
 * sub-gap -- it certifies QUADRATURE (already at ~1e-11, imp-95822), not MODEL faithfulness.
 *
 * CONTEXT. imp-95822 re-quadratured the Q_0 zeta(3) sector at m=22,30,41 to ~1e-11 grid
 * convergence and named the residual sub-gap at the CERTIFICATION level: only m=20 has an
 * independent certified kappa (Sun 6.23), so grid convergence shows the integral of the
 * reconstructed 238-cell integrand is exact, NOT that the reconstructed integrand equals Sun
 * Prop-6.3 at m>20. The ticket asks whether a (6.26) B24 Euler-Maclaurin interval certificate
 * paralleling the m=20 anchor can independently certify Q_0(m,v) at the wide moduli.
 *
 * CERTIFICATION STRUCTURE (from imp-95720/95745/95746/95780/95822). The (6.21) integrand splits
 *   INT621(m) = C + Q(m),   C = const sector = 3/2 (m-FREE),   Q(m) = INT_0^1 Q_0(m,v) zeta(3,1+v) dv
 * with J_raw(m) = -INT621(m) and kappa(m) = J_raw(m) + 4. The +4 offset is analytically m-FREE
 * (imp-95745: 5/2 + (3/2) INT_0^1 zeta(2,1+v) dv = 4), so
 *   kappa(m) = 5/2 - Q(m).
 * The ONLY independent per-modulus anchor is Sun eq (6.23): c_odd(1/20) at m=20.
 *
 * THE M=20 ANCHOR IS A VALUE CROSS-CHECK, NOT A QUADRATURE CERTIFICATE. At m=20 the certified
 * c_odd(1/20)=0.006276744728100982 forces kappa_cert=2.5106978912403926, hence a TARGET value
 * Q_forced(20) = 5/2 - kappa_cert = -0.0106978912403926. The faithful reconstruction independently
 * produces Q_recon(20) = -0.0106978911, matching the forced target to 1.40e-10. THAT agreement --
 * reconstruction value vs an externally-supplied closed form -- is what anchors m=20. The (6.26)
 * B24 Euler-Maclaurin certificate in Sun is used to certify the QUADRATURE of HIS integral (that a
 * finite evaluation equals the true integral within a rigorous interval); it is orthogonal to the
 * value cross-check.
 *
 * WHY A B24 CERTIFICATE DOES NOT ANCHOR m=22,30,41. A B24 Euler-Maclaurin interval certificate is
 * derivable in principle at any m: on each of the 238 cells the integrand Q_0(m,v) zeta(3,1+v) is
 * analytic, so composite Euler-Maclaurin with the B24 (24th Bernoulli) remainder yields a rigorous
 * enclosure of Q(m) with certified width. But that certifies exactly the axis imp-95822 already
 * settled EMPIRICALLY to ~1e-11 (a 4x-Nsub grid-doubling shift of at most 7.9e-11): it upgrades
 * "quadrature converged to 1e-11" to "quadrature rigorously enclosed to interval width epsilon".
 * It supplies a rigorous NUMBER for the reconstruction integral -- it does NOT supply the missing
 * independent TARGET number. At m>20 the paper gives no closed-form c_odd(1/m) or kappa(m) to
 * compare the rigorous enclosure against, so "rigorous enclosure of the reconstruction" is still
 * not "the reconstruction equals Sun Prop-6.3".
 *
 * WHAT IS ACTUALLY TRANSPORTED TO m>20 (the honest partial anchoring). The reconstruction algorithm
 * is m-parametric and identical at every m; the pieces verified AGAINST the anchor at m=20 that are
 * structurally m-parametric therefore hold at m>20 as forms: the breakpoint partition (exactly 238
 * raw cells), the exact-cell K_v curvature -(4m-1)/2, the m-free const sector 3/2, and the
 * analytically m-free +4 offset. So the certification of everything in kappa(m) EXCEPT the Q_0
 * sector value transports to the wide moduli. The ONE quantity with no independent per-modulus check
 * at m>20 is the Q_0 sector value Q(m) itself -- and a B24 certificate certifies its quadrature, not
 * its faithfulness.
 *
 * PRECISE REMAINING OBSTRUCTION. The binding gap is the ABSENCE of an independent evaluation of
 * Q_0(m,v) (equivalently c_odd(1/m) or kappa(m)) at m>20: Sun eq (6.23) is stated only at m=20.
 * Closing it requires either (a) a second closed-form anchor generalizing (6.23) to m>20, or (b) a
 * symbolic proof that the reconstructed integrand equals Sun Prop-6.3 identically as a function of
 * m. The B24 Euler-Maclaurin route addresses quadrature error, which is NOT the binding obstruction.
 * VERDICT: the faithful 238-cell reconstruction is anchored at m=22,30,41 only CONDITIONALLY (via
 * the m-parametric structure + the m-free +4 offset transporting the m=20 certification of all but
 * the Q_0 sector); a B24 certificate cannot upgrade this to an independent per-modulus anchor.
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound;
 * NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.11)-(6.26). SCRATCH: tmp/imp-95842-scratch.mjs.
 */

// certified anchor (Sun 6.23), m=20 only:
const C_ODD_CERT_M20 = 0.006276744728100982;
const KAPPA_CERT_M20 = C_ODD_CERT_M20 * 400; // 2.5106978912403926

// m-free pieces (imp-95745/95746): kappa(m) = 5/2 - Q(m), offset = 4, const sector = 3/2.
const CONST_SECTOR = 1.5;
const OFFSET = 4.0;

// faithful-reconstruction Q_0 zeta(3) sector, grid-converged to ~1e-11 (imp-95822 finest grid):
const Q0_RECON = Object.freeze({
  20: -0.0106978911,
  22: -0.0106903118589691,
  30: -0.0106731394320504,
  41: -0.0106560776913469,
});

// m=20 value cross-check: the certified anchor FORCES Q_forced(20) = 5/2 - kappa_cert; the
// reconstruction produces Q_recon(20) independently. Their agreement is what anchors m=20.
const Q_FORCED_M20 = 2.5 - KAPPA_CERT_M20; // -0.0106978912403926
const M20_VALUE_MATCH = Math.abs(Q_FORCED_M20 - Q0_RECON[20]); // ~1.40e-10

// per-modulus reconstruction-implied kappa (kappa = 5/2 - Q); at m>20 there is NO closed-form target.
const PER_MODULUS = Object.freeze([20, 22, 30, 41].map((m) => Object.freeze({
  m,
  q0Recon: Q0_RECON[m],
  kappaRecon: 2.5 - Q0_RECON[m],
  hasIndependentTarget: m === 20, // Sun (6.23) closed form exists only at m=20
})));

export const Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT = Object.freeze({
  id: 'imp-95842-q0-wide-modulus-b24-certificate-assessment',
  title:
    'Assess an independent (6.26) B24 Euler-Maclaurin certificate for the faithful 238-cell '
    + 'Q_0(m,v) reconstruction at m=22,30,41: a B24 certificate certifies QUADRATURE (already at '
    + '~1e-11, imp-95822), not the MODEL faithfulness the residual sub-gap needs -- so it cannot '
    + 'anchor the wide moduli; the binding obstruction is the absence of a closed-form c_odd(1/m) '
    + 'at m>20 (Sun 6.23 is stated only at m=20)',
  status:
    'ASSESSED (derive/assess only) -- the m=20 anchor is a VALUE cross-check, not a quadrature '
    + 'certificate: the certified c_odd(1/20) forces Q_forced(20)=5/2-kappa_cert=-0.0106978912404, '
    + 'and the faithful reconstruction produces Q_recon(20)=-0.0106978911 independently, matching to '
    + '1.40e-10. A (6.26) B24 Euler-Maclaurin certificate is derivable at any m (per-cell analytic '
    + 'integrand + B24 remainder => rigorous enclosure of Q(m)) but certifies only the QUADRATURE '
    + 'axis imp-95822 already settled to ~1e-11 -- it supplies a rigorous NUMBER for the '
    + 'reconstruction, NOT the missing independent TARGET number. VERDICT: reconstruction anchored '
    + 'at m=22,30,41 only CONDITIONALLY (m-parametric structure + m-free +4 offset transport the '
    + 'm=20 certification of all but the Q_0 sector value); a B24 certificate cannot upgrade this to '
    + 'an independent per-modulus anchor. OBSTRUCTION: no closed-form c_odd(1/m) at m>20. G '
    + 'irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26)',
  builtOn:
    'imp-95822 (re-quadrature m=22,30,41 to ~1e-11; named the certification-level residual sub-gap), '
    + 'imp-95720 (faithful 238-cell partition + the +4 obstruction), imp-95745 (analytic m-free +4 '
    + 'derivation), imp-95746/95780 (m-independence witness across moduli)',
  scratch: ['tmp/imp-95842-scratch.mjs'],

  certificationStructure: Object.freeze({
    constSector: CONST_SECTOR, // 3/2, m-free
    offset: OFFSET,            // 4, analytically m-free (imp-95745)
    kappaFormula: 'kappa(m) = 5/2 - Q(m), Q(m) = INT_0^1 Q_0(m,v) zeta(3,1+v) dv',
    onlyAnchorModulus: 20,     // Sun eq (6.23) closed form exists only at m=20
  }),

  m20AnchorIsValueCheck: Object.freeze({
    cOddCertM20: C_ODD_CERT_M20,
    kappaCertM20: KAPPA_CERT_M20,
    qForcedM20: Q_FORCED_M20,     // 5/2 - kappa_cert = -0.0106978912404
    qReconM20: Q0_RECON[20],      // reconstruction, independent = -0.0106978911
    valueMatch: M20_VALUE_MATCH,  // ~1.40e-10 (this agreement anchors m=20)
    reading:
      'the m=20 anchor is a match between the reconstruction value and an externally-supplied closed '
      + 'form, NOT a B24 quadrature certificate; the B24 certificate in Sun certifies HIS integral, '
      + 'orthogonal to this value cross-check.',
  }),

  b24Assessment: Object.freeze({
    derivableAtAnyM: true, // per-cell analytic integrand + B24 remainder => rigorous enclosure of Q(m)
    certifiesQuadratureNotModel: true, // enclosure of the reconstruction integral, not its faithfulness
    quadratureAlreadySettled: 7.9e-11, // imp-95822 max grid shift over a 4x Nsub refinement
    suppliesTargetValue: false, // does NOT supply an independent c_odd(1/m)/kappa(m) to compare against
    reading:
      'a B24 Euler-Maclaurin interval certificate upgrades quadrature from empirically-converged '
      + '(~1e-11) to rigorously-enclosed, but the residual sub-gap is at the MODEL level, not the '
      + 'quadrature level -- so a B24 certificate is the wrong lever for it.',
  }),

  perModulus: PER_MODULUS,

  verdict: Object.freeze({
    b24IsWrongLever: true,
    reconstructionAnchoredAtWideModuli: false, // not independently; only conditionally
    conditionalTransport:
      'the m-parametric structure (238 cells, -(4m-1)/2 curvature, 3/2 const sector) and the m-free '
      + '+4 offset transport the m=20 certification of everything in kappa(m) EXCEPT the Q_0 sector '
      + 'value; the Q_0 sector value at m>20 has no independent per-modulus check.',
    conclusion:
      'A (6.26) B24 Euler-Maclaurin certificate cannot anchor the faithful 238-cell Q_0(m,v) '
      + 'reconstruction at m=22,30,41: it certifies quadrature (already ~1e-11), not the model '
      + 'faithfulness the residual sub-gap requires. The reconstruction is anchored at the wide '
      + 'moduli only CONDITIONALLY, via the m-free structure + offset transporting the m=20 '
      + 'certification of all but the Q_0 sector value.',
  }),

  remainingObstruction:
    'ABSENCE of an independent evaluation of Q_0(m,v) (equivalently c_odd(1/m) or kappa(m)) at m>20: '
    + 'Sun eq (6.23) is stated only at m=20. Closing it requires either a second closed-form anchor '
    + 'generalizing (6.23) to m>20, or a symbolic proof that the reconstructed integrand equals Sun '
    + 'Prop-6.3 identically in m. The B24 Euler-Maclaurin route addresses quadrature error, NOT this '
    + 'binding obstruction.',

  caveats:
    'Assessment only (no new heavy quadrature): re-uses the imp-95822 grid-converged Q_0 sector '
    + 'values and the imp-95745/95746 m-free offset/const-sector structure. The verdict is that a '
    + 'B24 certificate is orthogonal to the residual model/faithfulness sub-gap, not that it is '
    + 'impossible to derive. Catalan G irrationality OPEN; Sun single-author, unrefereed; NO Lambda '
    + 'movement; no refereed bound is changed; NO QED.',
});

export const Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    name: 'kappa(m) = 5/2 - Q(m) with const sector 3/2 and m-free offset 4',
    holds: () => {
      const s = Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT.certificationStructure;
      return Math.abs(s.constSector - 1.5) < 1e-12
        && Math.abs(s.offset - 4) < 1e-12
        && s.onlyAnchorModulus === 20;
    },
  },
  {
    name: 'm=20 anchor is a value cross-check: Q_forced(20) matches Q_recon(20) to ~1.4e-10',
    holds: () => {
      const a = Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT.m20AnchorIsValueCheck;
      return Math.abs(a.qForcedM20 - (2.5 - a.kappaCertM20)) < 1e-15
        && Math.abs(a.kappaCertM20 - a.cOddCertM20 * 400) < 1e-13
        && a.valueMatch < 1e-9
        && a.valueMatch > 1e-11;
    },
  },
  {
    name: 'B24 certificate is derivable at any m but certifies quadrature, not model faithfulness',
    holds: () => {
      const b = Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT.b24Assessment;
      return b.derivableAtAnyM === true
        && b.certifiesQuadratureNotModel === true
        && b.suppliesTargetValue === false
        && b.quadratureAlreadySettled < 1e-9;
    },
  },
  {
    name: 'per-modulus: only m=20 has an independent target; kappa_recon = 5/2 - q0Recon at each',
    holds: () => {
      const rows = Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT.perModulus;
      return rows.length === 4
        && rows.map((r) => r.m).join(',') === '20,22,30,41'
        && rows.filter((r) => r.hasIndependentTarget).map((r) => r.m).join(',') === '20'
        && rows.every((r) => Math.abs((2.5 - r.q0Recon) - r.kappaRecon) < 1e-12);
    },
  },
  {
    name: 'verdict: B24 is the wrong lever; wide moduli anchored only conditionally',
    holds: () => {
      const v = Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT.verdict;
      return v.b24IsWrongLever === true
        && v.reconstructionAnchoredAtWideModuli === false
        && /conditionally/i.test(v.conclusion);
    },
  },
  {
    name: 'obstruction named (no closed-form c_odd(1/m) at m>20) and honest disclaimers present',
    holds: () =>
      /no closed-form|ABSENCE of an independent evaluation/i.test(
        Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT.remainingObstruction,
      )
      && /G irrationality OPEN/.test(Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT.status)
      && /refereed bound is changed/i.test(Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT.status)
      && /NO QED/.test(Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT.status),
  },
]);

export default Q0_WIDE_MODULUS_B24_CERTIFICATE_ASSESSMENT;
