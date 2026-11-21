/**
 * @fileoverview imp-95878 — INDEPENDENT-route PIECE A for the imp-95861 per-m kappa
 * certification: derive the only closed-form c_odd(1/m) that generalizes Sun eq (6.23)
 * WITHOUT re-deriving the v-integral, evaluate it at m=22,30,41, and compare against the
 * baked Q0_RECON reconstruction to test integrand-faithfulness at those moduli.
 *
 * WHAT PIECE A NEEDS (from imp-95861). A genuine per-m kappa certification needs an
 * independent TARGET for Q_true(m) / c_odd(1/m) obtained WITHOUT the 238-cell
 * reconstruction. At m=20 this is Sun (6.23): the certified anchor c_odd(1/20) =
 * 0.006276744728100982, giving kappa = 400*c_odd(1/20) = 2.5106978912403926. At m>20 no
 * such independent closed form is on the ledger -- that absence is exactly the binding
 * PIECE-A shortfall.
 *
 * THE ONLY CLOSED FORM THAT GENERALIZES (6.23) WITHOUT NEW WORK. Sun (6.19)-(6.21) force
 * the rho^2 PREFACTOR structurally (the t=rho/u substitution, verified in imp-95690), so
 *   c_odd(rho) = rho^2 * J(rho),   rho = 1/m,   J(1/20) = kappa.
 * The ONE closed form obtainable from the single m=20 anchor alone, with NO fresh
 * v-integral, is the pure-rho^2-shape NULL that treats J as the constant kappa:
 *   c_odd_null(1/m) = kappa / m^2.
 * This is the imp-95653/95702 shape hypothesis. It is a genuine closed form, independent
 * of the reconstruction, evaluable at any m -- so it is the natural INDEPENDENT-route
 * candidate for PIECE A. This module derives it, evaluates it at m=22,30,41, and tests it.
 *
 * THE TEST (integrand-faithfulness axis). The reconstruction supplies, per modulus, its own
 * J value J_recon(1/m) = kappa_recon(m) = 5/2 - Q_0_recon(m) (imp-95745: kappa(m)=5/2-Q(m)),
 * hence a reconstruction-implied c_odd_recon(1/m) = (5/2 - Q_0_recon(m)) / m^2. The DEPARTURE
 * of the independent closed-form candidate from the reconstruction is
 *   c_odd_recon(1/m) - c_odd_null(1/m) = (kappa_recon(m) - kappa) / m^2,
 * and its fractional form is exactly the imp-95653/95690/95702 J-VARIATION
 *   dI(m) = kappa_recon(m)/kappa - 1  (= the fractional rho-variation of the Prop-6.3
 * v-integrand, the quantity those tickets named OPEN). MEASURED here:
 *   m=20: dI = -5.59e-11 (the value-match, by construction the anchor)
 *   m=22: dI = -3.02e-6
 *   m=30: dI = -9.86e-6
 *   m=41: dI = -1.67e-5
 * dI is nonzero and GROWS monotonically with m (shrinking rho). A pure-rho^2-shape closed
 * form CANNOT reproduce it: it forces dI=0 identically. So the candidate FAILS as PIECE A at
 * m>20 -- the failure margin is precisely the measured J-variation.
 *
 * IS THE DEPARTURE ITSELF A CLEAN CLOSED FORM? Tested dI against a linear law in
 * drho = 1/20 - rho: dI/drho = -6.64e-4, -5.92e-4, -6.50e-4 at m=22,30,41 -- roughly
 * constant but with ~11% scatter, NOT a clean linear closed form. So no simple correction
 * term recovers an independent c_odd(1/m); the m-dependence is genuinely reconstruction-borne.
 *
 * VERDICT (honest PARTIAL). The only closed form generalizing (6.23) without a fresh
 * v-integral is the pure-rho^2 null kappa/m^2, and it is REFUTED as an independent PIECE-A
 * target at m=22,30,41 by a nonzero, growing, non-clean J-variation. An actual independent
 * c_odd(1/m) at m>20 would have to carry that J-variation, which is available ONLY through
 * the reconstruction (or a fresh 238-cell + B24 certificate at each m) -- i.e. PIECE A stays
 * the binding shortfall (imp-95861), and the pure-shape shortcut does not discharge it.
 * NAMED SUB-GAP: "no reconstruction-independent closed-form c_odd(1/m) at m>20; the
 * pure-rho^2 null fails by the measured J-variation dI(m), whose own m-law is not clean."
 *
 * Derive/measure only; changes no bound. Catalan G irrationality OPEN; Sun arXiv:2609.04176
 * single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED. NO heavy
 * imports (reuses the imp-95861 baked anchor + Q0_RECON literals).
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.19)-(6.23). SCRATCH:
 * tmp/imp-95878-scratch.mjs (null-vs-reconstruction table + dI linearity probe).
 */

// certified anchor (Sun 6.23), m=20 only:
const C_ODD_CERT_M20 = 0.006276744728100982;
const KAPPA = C_ODD_CERT_M20 * 400; // J(1/20) = 2.5106978912403926

// faithful-reconstruction Q_0 zeta(3) sector, carried verbatim from imp-95861/95842:
const Q0_RECON = Object.freeze({
  20: -0.0106978911,
  22: -0.0106903118589691,
  30: -0.0106731394320504,
  41: -0.0106560776913469,
});

// the pure-rho^2-shape NULL closed form (the only c_odd(1/m) generalizing 6.23 with no
// fresh v-integral): c_odd_null(1/m) = kappa / m^2.
const cOddNull = (m) => KAPPA / (m * m);
// reconstruction-implied c_odd(1/m) = (5/2 - Q_0_recon(m)) / m^2 = kappa_recon(m)/m^2.
const kappaRecon = (m) => 2.5 - Q0_RECON[m];
const cOddRecon = (m) => kappaRecon(m) / (m * m);

const PER_MODULUS = Object.freeze([20, 22, 30, 41].map((m) => {
  const cn = cOddNull(m);
  const cr = cOddRecon(m);
  return Object.freeze({
    m,
    rho: 1 / m,
    kappaRecon: kappaRecon(m),
    cOddNull: cn,
    cOddRecon: cr,
    departure: cr - cn, // = (kappa_recon - kappa)/m^2
    dI: kappaRecon(m) / KAPPA - 1, // fractional J-variation (imp-95653/95690/95702 dI)
    isAnchor: m === 20,
  });
}));

// dI vs linear-in-drho probe (drho = 1/20 - rho): NOT a clean law.
const DI_LINEARITY = Object.freeze(PER_MODULUS.filter((r) => r.m !== 20).map((r) => {
  const drho = 1 / 20 - r.rho;
  return Object.freeze({ m: r.m, drho, dIperDrho: r.dI / drho });
}));

export const C_ODD_NULL_VS_RECONSTRUCTION_WIDE_MODULUS = Object.freeze({
  id: 'imp-95878-c-odd-null-vs-reconstruction-wide-modulus',
  title:
    'Derive the imp-95861 INDEPENDENT-route PIECE A candidate: the only closed-form c_odd(1/m) '
    + 'generalizing Sun (6.23) without a fresh v-integral is the pure-rho^2 null kappa/m^2; '
    + 'evaluate it at m=22,30,41 and test integrand-faithfulness against the baked Q0_RECON',
  status:
    'PARTIAL (derive/measure only) -- the ONLY closed form generalizing Sun (6.23) with no fresh '
    + 'v-integral is the pure-rho^2-shape null c_odd_null(1/m)=kappa/m^2 (prefactor rho^2 forced by '
    + '6.19-6.21 / imp-95690, J treated as the constant kappa). Evaluated at m=22,30,41 and compared '
    + 'to the reconstruction-implied c_odd_recon(1/m)=(5/2-Q0_recon(m))/m^2, it is REFUTED as an '
    + 'independent PIECE-A target: the departure is exactly the imp-95653/95690/95702 fractional '
    + 'J-variation dI(m)=kappa_recon(m)/kappa-1 = -3.02e-6, -9.86e-6, -1.67e-5 (nonzero, GROWING with '
    + 'm; -5.59e-11 at the m=20 anchor by construction), which a pure-rho^2 form forces to 0. dI itself '
    + 'is not a clean linear-in-rho law (dI/drho spread ~11%). So NO reconstruction-independent '
    + 'closed-form c_odd(1/m) at m>20 exists; PIECE A stays the binding shortfall (imp-95861). '
    + 'G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.19)-(6.23)',
  builtOn:
    'imp-95861 (per-m certification = PIECE A independent target + PIECE B enclosure; PIECE A '
    + 'binding at m>20), imp-95842 (baked Q0_RECON wide-modulus reconstruction), imp-95690 (rho^2 '
    + 'prefactor structurally forced; J(rho) carries residual rho-dependence), imp-95653/95702 '
    + '(pure-rho^2 shape null + the fractional J-variation as the decisive unmeasured quantity)',

  anchor: Object.freeze({
    m: 20,
    cOddCert: C_ODD_CERT_M20, // Sun (6.23)
    kappa: KAPPA, // 400 * c_odd(1/20)
    note: 'the sole reconstruction-independent closed form; every m>20 value below is a NULL, not a certificate',
  }),

  // the derived closed-form candidate and its per-modulus test:
  closedFormCandidate: Object.freeze({
    formula: 'c_odd_null(1/m) = kappa / m^2  (rho^2 prefactor forced; J := kappa constant)',
    isReconstructionIndependent: true,
    forcesJVariationZero: true, // the structural reason it fails at m>20
  }),

  // imp-95915: reciprocal reading path across the three per-m kappa certification modules.
  readingPath: Object.freeze({
    position: '3 of 3',
    previous: Object.freeze({
      id: 'imp-95861',
      relation: 'names the PIECE A/PIECE B decomposition and the INDEPENDENT route this module attempts',
    }),
    sibling: Object.freeze({
      id: 'imp-95877',
      relation: 'attempts the TRANSPORT route -- the other way to supply PIECE A at m>20',
    }),
  }),

  perModulus: PER_MODULUS,
  dILinearityProbe: DI_LINEARITY,

  verdict: Object.freeze({
    bindingShortfall: 'PIECE A (a reconstruction-independent c_odd(1/m)) -- the pure-rho^2 null does not supply it at m>20',
    departureIsJVariation: true, // c_odd_recon - c_odd_null = (kappa_recon-kappa)/m^2, fractional = dI
    dIGrowsWithM: true,
    dINotCleanLinear: true, // dI/drho spread ~11% across m=22,30,41
    conclusion:
      'The only closed form generalizing Sun (6.23) without a fresh Prop-6.3 v-integral is the '
      + 'pure-rho^2-shape null kappa/m^2. Evaluated at m=22,30,41 it deviates from the reconstruction '
      + 'by exactly the fractional J-variation dI(m) (-3.02e-6, -9.86e-6, -1.67e-5), which is nonzero, '
      + 'grows with m, and is not a clean linear-in-rho law -- so the null is REFUTED as an independent '
      + 'PIECE-A target and no simple correction recovers one. An actual independent c_odd(1/m) at m>20 '
      + 'must carry the J-variation, available only through the reconstruction (or a fresh 238-cell + '
      + 'B24 certificate per m); PIECE A therefore stays the binding shortfall named by imp-95861.',
    namedSubGap:
      'no reconstruction-independent closed-form c_odd(1/m) at m>20; the pure-rho^2 null fails by the '
      + 'measured J-variation dI(m), whose own m-law is not clean (dI/drho spread ~11%).',
  }),

  caveats:
    'Derive/measure only: reuses the imp-95861 baked Sun (6.23) anchor and the imp-95842 grid-converged '
    + 'Q0_RECON literals; constructs no new quadrature and no new certificate. The pure-rho^2 null is a '
    + 'genuine closed form but is shown NOT to be a valid independent PIECE-A target at m>20. Catalan G '
    + 'irrationality OPEN; Sun single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const C_ODD_NULL_VS_RECONSTRUCTION_WIDE_MODULUS_ASSERTIONS = Object.freeze([
  {
    name: 'kappa = 400 * c_odd(1/20) from the Sun (6.23) anchor',
    holds: () => Math.abs(KAPPA - C_ODD_CERT_M20 * 400) < 1e-15 && Math.abs(KAPPA - 2.5106978912403926) < 1e-12,
  },
  {
    name: 'pure-rho^2 null closed form is c_odd_null(1/m) = kappa/m^2 at each modulus',
    holds: () => PER_MODULUS.every((r) => Math.abs(r.cOddNull - KAPPA / (r.m * r.m)) < 1e-18),
  },
  {
    name: 'reconstruction-implied c_odd_recon(1/m) = (5/2 - Q0_recon(m))/m^2',
    holds: () => PER_MODULUS.every((r) => Math.abs(r.cOddRecon - (2.5 - Q0_RECON[r.m]) / (r.m * r.m)) < 1e-18),
  },
  {
    name: 'departure equals the fractional J-variation: c_odd_recon - c_odd_null = kappa*rho^2*dI',
    holds: () => PER_MODULUS.every((r) => Math.abs(r.departure - KAPPA * r.rho * r.rho * r.dI) < 1e-18),
  },
  {
    name: 'dI is nonzero and grows monotonically with m at m>20 (null cannot reproduce it)',
    holds: () => {
      const g = PER_MODULUS.filter((r) => r.m !== 20);
      return g.every((r) => Math.abs(r.dI) > 1e-9)
        && Math.abs(g[0].dI) < Math.abs(g[1].dI)
        && Math.abs(g[1].dI) < Math.abs(g[2].dI);
    },
  },
  {
    name: 'm=20 is the anchor: dI collapses to the value-match (<1e-9) by construction',
    holds: () => {
      const a = PER_MODULUS.find((r) => r.m === 20);
      return a.isAnchor === true && Math.abs(a.dI) < 1e-9;
    },
  },
  {
    name: 'dI is not a clean linear-in-drho law: dI/drho spread exceeds 5 percent',
    holds: () => {
      const vals = DI_LINEARITY.map((r) => r.dIperDrho);
      const mx = Math.max(...vals), mn = Math.min(...vals);
      return Math.abs((mx - mn) / ((mx + mn) / 2)) > 0.05;
    },
  },
  {
    name: 'reading path: position 3 of 3, back to imp-95861, sibling imp-95877 (transport route)',
    holds: () => {
      const rp = C_ODD_NULL_VS_RECONSTRUCTION_WIDE_MODULUS.readingPath;
      return rp.position === '3 of 3'
        && rp.previous.id === 'imp-95861'
        && rp.sibling.id === 'imp-95877';
    },
  },
  {
    name: 'honest: PIECE A binding, null REFUTED, sub-gap named, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /PIECE A/.test(C_ODD_NULL_VS_RECONSTRUCTION_WIDE_MODULUS.verdict.bindingShortfall)
      && /REFUTED/.test(C_ODD_NULL_VS_RECONSTRUCTION_WIDE_MODULUS.status)
      && /no reconstruction-independent closed-form/.test(C_ODD_NULL_VS_RECONSTRUCTION_WIDE_MODULUS.verdict.namedSubGap)
      && /G irrationality OPEN/.test(C_ODD_NULL_VS_RECONSTRUCTION_WIDE_MODULUS.status)
      && /refereed bound is changed/i.test(C_ODD_NULL_VS_RECONSTRUCTION_WIDE_MODULUS.status)
      && /NO QED/.test(C_ODD_NULL_VS_RECONSTRUCTION_WIDE_MODULUS.status),
  },
]);

export default C_ODD_NULL_VS_RECONSTRUCTION_WIDE_MODULUS;
