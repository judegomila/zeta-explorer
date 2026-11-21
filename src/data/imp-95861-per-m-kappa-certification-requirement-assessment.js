/**
 * @fileoverview imp-95861 — assess what a GENUINE per-m kappa certification would actually require
 * for the imp-95842 q0-wide-modulus reconstruction, and characterize the residual conditionality
 * precisely. imp-95842 named the certification-level residual (only m=20 has a Sun-certified kappa;
 * m=22,30,41 anchored only CONDITIONALLY) and ruled out the B24 Euler-Maclaurin lever. This module
 * takes the next step: it decomposes a genuine per-m certification into its two required pieces and
 * contrasts the INDEPENDENT route (a fresh per-modulus target at each m) with the TRANSPORT route
 * (one symbolic identity carrying the single m=20 anchor to all m).
 *
 * CONTEXT (from imp-95720/95745/95746/95780/95822/95842). The (6.21) integrand splits as
 *   INT621(m) = C + Q(m),  C = const sector = 3/2 (m-FREE),  Q(m) = INT_0^1 Q_0(m,v) zeta(3,1+v) dv
 * with J_raw(m) = -INT621(m) and kappa(m) = J_raw(m) + 4. The +4 offset is analytically m-FREE
 * (imp-95745), so kappa(m) = 5/2 - Q(m). The ONLY independent per-modulus anchor is Sun eq (6.23):
 * the certified c_odd(1/20) at m=20, which forces kappa_cert(20) = 400*c_odd(1/20) and hence a
 * TARGET Q_forced(20) = 5/2 - kappa_cert(20); the faithful 238-cell reconstruction independently
 * produces Q_recon(20), matching to 1.40e-10 (that value cross-check is what anchors m=20).
 *
 * TWO PIECES A GENUINE PER-m CERTIFICATION NEEDS. Certifying kappa(m) at a single m rigorously means
 * proving kappa_true(m) lies in a rigorous interval that also contains kappa_recon(m). Because
 * kappa_recon(m) = 5/2 - Q_recon(m) is built ENTIRELY from the reconstruction, this requires BOTH:
 *   PIECE A (independent TARGET): a value for Q_true(m) -- equivalently c_odd(1/m) or kappa_true(m) --
 *     obtained WITHOUT the reconstruction (a closed form, or an independent rigorous enclosure of
 *     Sun Prop-6.3 as-written). This is the "does the reconstruction integrand equal the intended
 *     integrand" axis.
 *   PIECE B (rigorous ENCLOSURE of the reconstruction): a rigorous interval for Q_recon(m) itself,
 *     i.e. a certified quadrature of the 238-cell reconstructed integrand. This is the "is the
 *     computed number exactly the integral of the reconstructed integrand" axis.
 * Certification = the two intervals from A and B OVERLAP. imp-95842 established that a (6.26) B24
 * Euler-Maclaurin certificate delivers PIECE B at any m (per-cell analytic integrand + B24 remainder
 * => rigorous width) but delivers NOTHING for PIECE A. So the binding shortfall of a per-m
 * certification is PIECE A, and B24 addresses only PIECE B -- which imp-95822 already settled
 * empirically to ~1e-11. At m=20 BOTH pieces are effectively present: PIECE A = Sun (6.23) closed
 * form; PIECE B = the 1.40e-10 agreement stands in for a (looser) enclosure. At m=22,30,41 PIECE B
 * is available (or derivable) but PIECE A is ABSENT.
 *
 * INDEPENDENT ROUTE vs TRANSPORT ROUTE (the two ways to supply PIECE A at m>20).
 *   INDEPENDENT: derive a fresh per-modulus target at EACH m in {22,30,41} -- a closed-form
 *     c_odd(1/m) generalizing Sun (6.23), or an independent rigorous enclosure of Q_true(m) from
 *     Prop 6.3 not routed through the reconstruction. Cost = THREE separate anchors (one per modulus,
 *     and one more for every future modulus added to the sweep). Yields genuinely per-m,
 *     modulus-by-modulus certification.
 *   TRANSPORT: prove ONE symbolic identity -- that the reconstructed integrand equals Sun
 *     Prop-6.3 IDENTICALLY as a function of m (a proof that the m-parametric reconstruction algorithm
 *     reproduces Prop 6.3 for all m, not just numerically at m=20). Cost = ONE proof, independent of
 *     how many moduli are in the sweep. It converts the single m=20 anchor + the m-free structure
 *     (curvature -(4m-1)/2, 3/2 const sector, +4 offset; NOTE the CELL COUNT itself is NOT m-free --
 *     the breakpoint set B (6.24) has O(m) points, so 238 is only the m=20 value, per imp-95877) into
 *     an UNCONDITIONAL anchor at every m, retiring the conditionality outright rather than
 *     re-establishing PIECE A per modulus.
 * Both routes still need PIECE B (the B24 quadrature enclosure) to close the loop rigorously; they
 * differ only in how PIECE A is supplied. The transport route is the leaner one (one identity vs a
 * growing family of anchors) and is the ONLY route that scales to an open-ended modulus sweep.
 *
 * PRECISE CHARACTERIZATION OF THE RESIDUAL CONDITIONALITY. What is currently established at m>20 is
 * the single CONDITIONAL statement:
 *   IF the reconstructed 238-cell integrand equals Sun Q_0(m,v) at this m (integrand-faithfulness),
 *   THEN kappa_true(m) = 5/2 - Q_recon(m) up to the (small) quadrature error of Q_recon(m).
 * The antecedent (integrand-faithfulness at m>20) is exactly PIECE A and is verified only at m=20.
 * So the conditionality is a SINGLE hypothesis -- integrand-faithfulness -- attached identically to
 * each of m=22,30,41; it is NOT three independent conditionalities and NOT a quadrature-accuracy
 * caveat (that is PIECE B, already ~1e-11). The transport route discharges this one hypothesis for
 * all m at once; the independent route discharges it modulus-by-modulus.
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound;
 * NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.11)-(6.26). SCRATCH: none (assessment reuses
 * the imp-95842 baked reconstruction values and m-free structure).
 */

// certified anchor (Sun 6.23), m=20 only:
const C_ODD_CERT_M20 = 0.006276744728100982;
const KAPPA_CERT_M20 = C_ODD_CERT_M20 * 400; // 2.5106978912403926

// m-free pieces (imp-95745/95746): kappa(m) = 5/2 - Q(m), offset = 4, const sector = 3/2.
const CONST_SECTOR = 1.5;
const OFFSET = 4.0;

// faithful-reconstruction Q_0 zeta(3) sector, grid-converged to ~1e-11 (imp-95822 finest grid),
// carried verbatim from imp-95842:
const Q0_RECON = Object.freeze({
  20: -0.0106978911,
  22: -0.0106903118589691,
  30: -0.0106731394320504,
  41: -0.0106560776913469,
});

const Q_FORCED_M20 = 2.5 - KAPPA_CERT_M20; // -0.0106978912403926
const M20_VALUE_MATCH = Math.abs(Q_FORCED_M20 - Q0_RECON[20]); // ~1.40e-10

// per-modulus certification-piece status. PIECE A = independent target (integrand-faithfulness),
// PIECE B = rigorous quadrature enclosure of the reconstruction. Only m=20 has PIECE A.
const PER_MODULUS = Object.freeze([20, 22, 30, 41].map((m) => Object.freeze({
  m,
  q0Recon: Q0_RECON[m],
  kappaRecon: 2.5 - Q0_RECON[m],
  pieceAIndependentTarget: m === 20, // Sun (6.23) closed form exists only at m=20
  pieceBQuadratureEnclosure: true,   // B24 Euler-Maclaurin derivable at any m (imp-95842)
  certified: m === 20,               // certified <=> both pieces present
})));

export const PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT = Object.freeze({
  id: 'imp-95861-per-m-kappa-certification-requirement-assessment',
  title:
    'Assess what a genuine per-m kappa certification would require for the imp-95842 q0-wide-modulus '
    + 'reconstruction (independent per-modulus target at m=22,30,41 vs symbolic transport from the '
    + 'single m=20 Sun-certified anchor) and characterize the residual conditionality precisely',
  status:
    'ASSESSED (assess only) -- a genuine per-m certification of kappa(m)=5/2-Q(m) needs TWO pieces: '
    + 'PIECE A an independent target for Q_true(m) (integrand-faithfulness: closed-form c_odd(1/m) or '
    + 'an independent Prop-6.3 enclosure), and PIECE B a rigorous quadrature enclosure of the 238-cell '
    + 'reconstruction Q_recon(m). imp-95842 showed the B24 lever supplies PIECE B at any m but NOTHING '
    + 'for PIECE A; PIECE A is the binding shortfall at m>20. Two ways to supply PIECE A: the '
    + 'INDEPENDENT route (a fresh per-modulus anchor at each of m=22,30,41 -- three anchors, growing '
    + 'with the sweep) or the TRANSPORT route (ONE symbolic identity that the reconstructed integrand '
    + 'equals Sun Prop-6.3 for all m -- discharges the conditionality unconditionally and scales to an '
    + 'open-ended sweep). RESIDUAL CONDITIONALITY = a SINGLE hypothesis (integrand-faithfulness at '
    + 'm>20) attached identically to each modulus, verified only at m=20; NOT a quadrature caveat '
    + '(that is PIECE B, already ~1e-11). G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed'
    + '; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26)',
  builtOn:
    'imp-95842 (B24 is the wrong lever; named the CONDITIONAL anchoring at m=22,30,41), imp-95822 '
    + '(re-quadrature to ~1e-11; named the certification-level residual), imp-95720 (faithful 238-cell '
    + 'partition + the +4 obstruction), imp-95745 (analytic m-free +4 derivation), imp-95746/95780 '
    + '(m-independence witness across moduli)',

  certificationStructure: Object.freeze({
    constSector: CONST_SECTOR, // 3/2, m-free
    offset: OFFSET,            // 4, analytically m-free (imp-95745)
    kappaFormula: 'kappa(m) = 5/2 - Q(m), Q(m) = INT_0^1 Q_0(m,v) zeta(3,1+v) dv',
    onlyAnchorModulus: 20,     // Sun eq (6.23) closed form exists only at m=20
  }),

  // the two pieces a genuine per-m certification must supply:
  requiredPieces: Object.freeze({
    pieceA: Object.freeze({
      name: 'independent TARGET (integrand-faithfulness)',
      what: 'a value/enclosure for Q_true(m) (equivalently c_odd(1/m) or kappa_true(m)) obtained '
        + 'WITHOUT the reconstruction -- the axis "does the reconstructed integrand equal Sun Q_0".',
      suppliedByB24: false, // imp-95842: B24 supplies nothing here
      availableAtMGt20: false,
      isBindingShortfall: true,
    }),
    pieceB: Object.freeze({
      name: 'rigorous ENCLOSURE of the reconstruction (quadrature)',
      what: 'a rigorous interval for Q_recon(m) itself -- certified quadrature of the 238-cell '
        + 'reconstructed integrand; the axis "is the computed number exactly the integral".',
      suppliedByB24: true, // imp-95842: per-cell analytic integrand + B24 remainder
      availableAtMGt20: true, // derivable at any m; already ~1e-11 empirically (imp-95822)
      isBindingShortfall: false,
    }),
    certifiedIff: 'the PIECE-A interval and the PIECE-B interval OVERLAP at the modulus',
  }),

  // the two routes to supply PIECE A at m>20:
  routes: Object.freeze({
    independent: Object.freeze({
      name: 'INDEPENDENT per-modulus anchor',
      requires: 'a fresh target at EACH m in {22,30,41}: a closed-form c_odd(1/m) generalizing Sun '
        + '(6.23), or an independent rigorous enclosure of Q_true(m) from Prop 6.3 not routed '
        + 'through the reconstruction.',
      cost: 'THREE separate anchors now, plus one more per modulus added to the sweep (scales '
        + 'linearly with the sweep).',
      yields: 'genuinely per-m, modulus-by-modulus certification.',
    }),
    transport: Object.freeze({
      name: 'symbolic TRANSPORT from m=20',
      requires: 'ONE symbolic identity: the reconstructed 238-cell integrand equals Sun Prop-6.3 '
        + 'IDENTICALLY as a function of m (the m-parametric algorithm reproduces Prop 6.3 for all m, '
        + 'not merely numerically at m=20).',
      cost: 'ONE proof, independent of the number of moduli in the sweep.',
      yields: 'converts the single m=20 anchor + m-free structure into an UNCONDITIONAL anchor at '
        + 'every m; the ONLY route that scales to an open-ended modulus sweep.',
    }),
    bothStillNeedPieceB: true, // the B24 quadrature enclosure closes the loop rigorously either way
    leaner: 'transport', // one identity vs a growing family of anchors
  }),

  // imp-95915: reciprocal reading path across the three per-m kappa certification modules.
  readingPath: Object.freeze({
    position: '1 of 3 (start here)',
    next: Object.freeze([
      Object.freeze({
        id: 'imp-95877',
        relation: 'attempts the TRANSPORT route named here (partially tractable; TIER-3 sub-leading '
          + 'coefficients are the binding obstruction)',
      }),
      Object.freeze({
        id: 'imp-95878',
        relation: 'attempts the INDEPENDENT route named here (the pure-rho^2 null candidate; REFUTED '
          + 'as a PIECE-A target at m>20)',
      }),
    ]),
  }),

  perModulus: PER_MODULUS,

  m20AnchorHasBothPieces: Object.freeze({
    pieceA: 'Sun (6.23) closed form c_odd(1/20) => Q_forced(20) = 5/2 - kappa_cert',
    pieceB: 'the 1.40e-10 reconstruction-vs-forced agreement (stands in for a looser enclosure)',
    qForcedM20: Q_FORCED_M20,
    qReconM20: Q0_RECON[20],
    valueMatch: M20_VALUE_MATCH, // ~1.40e-10
  }),

  // precise characterization of what remains conditional at m>20:
  residualConditionality: Object.freeze({
    statement:
      'IF the reconstructed 238-cell integrand equals Sun Q_0(m,v) at this m (integrand-faithfulness), '
      + 'THEN kappa_true(m) = 5/2 - Q_recon(m) up to the small quadrature error of Q_recon(m).',
    antecedentIsPieceA: true, // the hypothesis IS PIECE A (integrand-faithfulness)
    verifiedOnlyAt: 20,
    isSingleHypothesisAcrossModuli: true, // the SAME hypothesis attached identically to 22,30,41
    isNotThreeIndependentConditionalities: true,
    isNotAQuadratureCaveat: true, // quadrature is PIECE B, already ~1e-11
    dischargedBy: Object.freeze({
      transport: 'all m at once (one identity)',
      independent: 'modulus-by-modulus (one anchor per m)',
    }),
  }),

  verdict: Object.freeze({
    bindingShortfall: 'PIECE A (independent target / integrand-faithfulness), not PIECE B (quadrature)',
    conclusion:
      'A genuine per-m kappa certification at m=22,30,41 requires supplying PIECE A (an independent '
      + 'target for Q_true(m)) in addition to the PIECE-B quadrature enclosure that B24 already '
      + 'provides; PIECE A is the binding shortfall. It can be supplied per modulus (INDEPENDENT '
      + 'route: three anchors) or once for all m (TRANSPORT route: one symbolic Prop-6.3 identity). '
      + 'The transport route is leaner and the only one that scales; it discharges the residual '
      + 'conditionality -- a SINGLE integrand-faithfulness hypothesis attached identically to each '
      + 'modulus -- unconditionally, whereas the independent route retires it modulus-by-modulus.',
  }),

  caveats:
    'Assessment only (no new heavy quadrature): reuses the imp-95822 grid-converged Q_0 sector values '
    + 'and the imp-95745/95746 m-free offset/const-sector structure carried through imp-95842. The '
    + 'assessment characterizes what a certification would require; it does NOT construct either route '
    + 'and changes no bound. CORRECTION (imp-95908, per imp-95877): the "238 cells" figure in the '
    + 'transport-route description above is the m-free QUALITATIVE structure only for curvature/const '
    + 'sector/offset -- the raw CELL COUNT itself grows with m (breakpoint set B (6.24) has O(m) '
    + 'points), so 238 is specifically the m=20 value, not an m-free constant. Catalan G irrationality '
    + 'OPEN; Sun single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    name: 'kappa(m) = 5/2 - Q(m) with const sector 3/2, m-free offset 4, sole anchor m=20',
    holds: () => {
      const s = PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.certificationStructure;
      return Math.abs(s.constSector - 1.5) < 1e-12
        && Math.abs(s.offset - 4) < 1e-12
        && s.onlyAnchorModulus === 20;
    },
  },
  {
    name: 'PIECE A is the binding shortfall (not supplied by B24); PIECE B is supplied by B24',
    holds: () => {
      const p = PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.requiredPieces;
      return p.pieceA.suppliedByB24 === false
        && p.pieceA.isBindingShortfall === true
        && p.pieceA.availableAtMGt20 === false
        && p.pieceB.suppliedByB24 === true
        && p.pieceB.isBindingShortfall === false
        && p.pieceB.availableAtMGt20 === true;
    },
  },
  {
    name: 'independent route needs three per-m anchors; transport route needs one identity and is leaner',
    holds: () => {
      const r = PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.routes;
      return /THREE/.test(r.independent.cost)
        && /ONE proof/.test(r.transport.cost)
        && r.bothStillNeedPieceB === true
        && r.leaner === 'transport';
    },
  },
  {
    name: 'per-modulus: only m=20 has PIECE A / is certified; kappa_recon = 5/2 - q0Recon at each',
    holds: () => {
      const rows = PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.perModulus;
      return rows.length === 4
        && rows.map((r) => r.m).join(',') === '20,22,30,41'
        && rows.filter((r) => r.pieceAIndependentTarget).map((r) => r.m).join(',') === '20'
        && rows.filter((r) => r.certified).map((r) => r.m).join(',') === '20'
        && rows.every((r) => r.pieceBQuadratureEnclosure === true)
        && rows.every((r) => Math.abs((2.5 - r.q0Recon) - r.kappaRecon) < 1e-12);
    },
  },
  {
    name: 'm=20 has both pieces: forced target matches reconstruction to ~1.4e-10',
    holds: () => {
      const a = PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.m20AnchorHasBothPieces;
      return a.valueMatch < 1e-9 && a.valueMatch > 1e-11
        && Math.abs(a.qForcedM20 - (2.5 - KAPPA_CERT_M20)) < 1e-15;
    },
  },
  {
    name: 'reading path: position 1 of 3, points forward to the imp-95877 transport and imp-95878 independent attempts',
    holds: () => {
      const rp = PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.readingPath;
      return rp.position === '1 of 3 (start here)'
        && rp.next.map((n) => n.id).join(',') === 'imp-95877,imp-95878';
    },
  },
  {
    name: 'residual conditionality is a SINGLE integrand-faithfulness hypothesis, not a quadrature caveat',
    holds: () => {
      const c = PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.residualConditionality;
      return c.antecedentIsPieceA === true
        && c.verifiedOnlyAt === 20
        && c.isSingleHypothesisAcrossModuli === true
        && c.isNotThreeIndependentConditionalities === true
        && c.isNotAQuadratureCaveat === true;
    },
  },
  {
    name: 'obstruction named (PIECE A binding) and honest disclaimers present',
    holds: () =>
      /PIECE A/.test(PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.verdict.bindingShortfall)
      && /G irrationality OPEN/.test(PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.status)
      && /refereed bound is changed/i.test(PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.status)
      && /NO QED/.test(PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT.status),
  },
]);

export default PER_M_KAPPA_CERTIFICATION_REQUIREMENT_ASSESSMENT;
