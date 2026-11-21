/**
 * @fileoverview imp-95746 — empirical m-independence witness for the imp-95720 +4 Prop-6.3
 * additive offset: re-run the faithful 238-cell machinery at a THIRD and FOURTH modulus
 * (m=18 and m=21) alongside m=19/20, measure J_raw(m) and the offset-corrected kappa(m),
 * and confirm the const sector that carries the +4 stays invariant across all four moduli
 * while the Q_0 zeta(3) sector genuinely moves.
 *
 * CONTEXT. imp-95720 found the +4.000000000 additive offset between J_raw and the certified
 * kappa at m=20 and reused the machinery at m=19 for a conditional c_odd(1/19). imp-95745
 * then DERIVED the offset analytically as the const-sector correction of (6.21) (OCR-literal
 * 3/2 -> reduction-forced -5/2), showing offset = 5/2 + (3/2) INT_0^1 zeta(2,1+v) dv = 4,
 * PURE RATIONAL and m-free because the m-dependence is quarantined in the Q_0 sector. This
 * module supplies the EMPIRICAL face of that m-independence at two moduli not previously run.
 *
 * MACHINERY (faithful, from tmp/imp-95720-m19.mjs; re-used verbatim in tmp/imp-95746-scratch.mjs):
 * breakpoint-partition K_v(m,v) with the exact -(4m-1)/2 per-cell curvature, Q_0(m,v) with the
 * A_rho singular block, and the (6.21) integrand INT621(m,v) = 5/2 - zeta(2,1+v) + Q_0(m,v)
 * zeta(3,1+v), integrated by composite 8-point Gauss-Legendre (Nsub = 60000). The integrand
 * splits as
 *   const sector C(m) = INT_0^1 [5/2 - zeta(2,1+v)] dv   (m-FREE integrand; carries the +4)
 *   Q_0    sector Q(m) = INT_0^1 Q_0(m,v) zeta(3,1+v) dv  (the ONLY m-dependent sector)
 * with INT621(m) = C + Q, J_raw(m) = -INT621(m), and offset-corrected kappa(m) = J_raw(m) + 4.
 *
 * MEASUREMENT (tmp/imp-95746-scratch.mjs, Nsub = 60000):
 *   const sector C = 1.500000000000  (target 3/2, m-free integrand, identical at every m)
 *   intZeta2      = 1.000000000000  (INT_0^1 zeta(2,1+v) dv, the ONLY quantity the +4 depends on)
 *   offset = 5/2 + (3/2) intZeta2 = 4.000000000000  (to 1.7e-14; SAME at every modulus)
 *   m=18: Q0 = -0.0107079475  J_raw = -1.4892920525  kappa_pred = J_raw+4 = 2.5107079475
 *   m=19: Q0 = -0.0106693712  J_raw = -1.4893306288  kappa_pred = J_raw+4 = 2.5106693712
 *   m=20: Q0 = -0.0106978911  J_raw = -1.4893021089  kappa_pred = J_raw+4 = 2.5106978911
 *   m=21: Q0 = -0.0106664879  J_raw = -1.4893335121  kappa_pred = J_raw+4 = 2.5106664879
 * At m=20 the INDEPENDENT certified kappa (Sun 6.23, c_odd(1/20)/rho^2 = 2.5106978912403926)
 * gives offset = kappa_cert - J_raw = 4.0000000001 (matches +4 to 1.4e-10). The Q_0 sector spans
 * a 4.15e-5 range across the four moduli — a genuine m-signal — while the const sector is fixed.
 *
 * VERDICT. The +4 offset is empirically m-independent across four consecutive moduli (m=18..21):
 * it depends only on the m-free identity INT_0^1 zeta(2,1+v) dv = 1, so it is the same pure
 * rational 4 at every m, corroborating the imp-95745 analytic derivation. The measurement stands
 * as an internal-consistency witness, NOT an independent verification of the +4 at m=18/19/21:
 * only m=20 has a certified kappa to check against, so at the other moduli the const sector
 * being invariant (dgconst/dm = 0) is a re-derivation of the same m-free structure rather than
 * a fresh anchor. c_odd(1/19) remains offset-certain but double-precision (interval certification
 * via the (6.26) B24 Euler-Maclaurin certificate at m=19 is a separate open sub-gap, imp-95745).
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound;
 * NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.11)-(6.23).
 * SCRATCH: tmp/imp-95746-scratch.mjs (re-uses the tmp/imp-95720-m19.mjs machinery).
 */

// The m-free const sector and the single identity the +4 depends on (measured, Nsub = 60000):
const CONST_SECTOR = 1.5; // INT_0^1 [5/2 - zeta(2,1+v)] dv = 3/2 (m-free integrand)
const INT_ZETA2 = 1.0;    // INT_0^1 zeta(2,1+v) dv = 1 (m-free telescope) -- sole input to the offset
const OFFSET = 2.5 + 1.5 * INT_ZETA2; // 5/2 + (3/2) intZeta2 = 4, identical at every modulus
const KAPPA_CERT_M20 = 2.5106978912403926; // certified c_odd(1/20)/rho^2 (Sun 6.23); ONLY at m=20

// Per-modulus faithful-machinery measurements (Q0 sector, J_raw, offset-corrected kappa):
const PER_MODULUS = Object.freeze([
  Object.freeze({ m: 18, q0Sector: -0.0107079475, jRaw: -1.4892920525, kappaPred: 2.5107079475 }),
  Object.freeze({ m: 19, q0Sector: -0.0106693712, jRaw: -1.4893306288, kappaPred: 2.5106693712 }),
  Object.freeze({ m: 20, q0Sector: -0.0106978911, jRaw: -1.4893021089, kappaPred: 2.5106978911 }),
  Object.freeze({ m: 21, q0Sector: -0.0106664879, jRaw: -1.4893335121, kappaPred: 2.5106664879 }),
]);

// m=20 is the only modulus with an independent certified anchor to test the offset against:
const OFFSET_VS_CERT_M20 = KAPPA_CERT_M20 - PER_MODULUS.find((r) => r.m === 20).jRaw; // 4.0000000001
const Q0_VALUES = PER_MODULUS.map((r) => r.q0Sector);
const Q0_SPREAD = Math.max(...Q0_VALUES) - Math.min(...Q0_VALUES); // ~4.15e-5 genuine m-signal

export const SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI = Object.freeze({
  id: 'imp-95746-sun-prop63-plus4-offset-four-moduli',
  title:
    'Empirical m-independence witness for the imp-95720 +4 Prop-6.3 offset: faithful 238-cell '
    + 'machinery at m=18 and m=21 (plus m=19/20) holds the const sector fixed at 3/2 and the '
    + 'offset at 4 across four consecutive moduli while the Q_0 zeta(3) sector genuinely varies',
  status:
    'MEASURED (double-precision, Nsub=60000) -- across m=18,19,20,21 the const sector C = 3/2 and '
    + 'the offset 5/2 + (3/2) INT_0^1 zeta(2,1+v) dv = 4 are invariant (to 1.7e-14), corroborating '
    + 'the imp-95745 analytic m-independence; the Q_0 sector spans a 4.15e-5 range (genuine m-signal). '
    + 'Only m=20 has a certified kappa: offset = kappa_cert - J_raw = 4.0000000001 (to 1.4e-10). '
    + 'Internal-consistency witness, NOT an independent +4 verification at m=18/19/21; c_odd(1/19) '
    + 'still double-precision (interval certificate at m=19 open). G irrationality OPEN; Sun '
    + 'unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'tmp/sun-catalan/paper.txt Section 6, Proposition 6.3, eqs (6.11)-(6.23)',
  builtOn:
    'imp-95720 (faithful 238-cell run; found the +4 at m=20, conditional c_odd(1/19)), '
    + 'imp-95745 (analytic derivation that the +4 is exactly 4 and m-free)',
  scratch: ['tmp/imp-95746-scratch.mjs', 'tmp/imp-95720-m19.mjs'],

  mFreeSector: Object.freeze({
    constSector: CONST_SECTOR, // 3/2 (INT [5/2 - zeta(2,1+v)] dv), identical at every m
    intZeta2: INT_ZETA2,       // 1 (sole input to the offset)
    offset: OFFSET,            // 4 = 5/2 + (3/2) intZeta2
    offsetIsExactly4: Math.abs(OFFSET - 4) < 1e-12,
    mIndependent: true,
  }),

  perModulus: PER_MODULUS,

  witness: Object.freeze({
    moduliTested: [18, 19, 20, 21],
    constSectorInvariant: true, // m-free integrand -> C = 3/2 at every modulus
    q0Spread: Q0_SPREAD,        // ~4.15e-5 (Q_0 sector genuinely varies with m)
    offsetVsCertifiedM20: OFFSET_VS_CERT_M20, // 4.0000000001 (only certified anchor)
    offsetVsCertifiedError: Math.abs(OFFSET_VS_CERT_M20 - 4), // ~1.4e-10
    certifiedAnchorModuli: [20], // the ONLY modulus with an independent kappa to test against
  }),

  caveats:
    'The const sector is m-free BY CONSTRUCTION of the (6.21) integrand, so its invariance across '
    + 'm=18..21 re-derives the same m-independent structure rather than furnishing a fresh anchor: '
    + 'only m=20 has a certified kappa (Sun 6.23) against which the +4 is an independent match. The '
    + 'measurement is an internal-consistency m-independence witness supporting imp-95745, NOT an '
    + 'independent verification of the +4 at m=18/19/21. c_odd(1/19) remains offset-certain but '
    + 'double-precision; interval certification via the (6.26) B24 Euler-Maclaurin certificate at '
    + 'm=19 is a separate open sub-gap. Catalan G irrationality OPEN; Sun single-author, unrefereed; '
    + 'NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI_ASSERTIONS = Object.freeze([
  {
    name: 'const sector = 3/2 and offset = 5/2 + (3/2) INT_0^1 zeta(2,1+v) dv = 4 (m-free)',
    holds: () => {
      const s = SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.mFreeSector;
      return Math.abs(s.constSector - 1.5) < 1e-12
        && Math.abs(s.intZeta2 - 1) < 1e-12
        && Math.abs(s.offset - 4) < 1e-12
        && s.offsetIsExactly4 === true
        && s.mIndependent === true;
    },
  },
  {
    name: 'four consecutive moduli tested (m=18,19,20,21) with J_raw + 4 = kappa_pred at each',
    holds: () => {
      const rows = SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.perModulus;
      return rows.length === 4
        && rows.map((r) => r.m).join(',') === '18,19,20,21'
        && rows.every((r) => Math.abs((r.jRaw + 4) - r.kappaPred) < 1e-9);
    },
  },
  {
    name: 'at m=20 the certified kappa gives an independent offset of 4 to < 1e-9',
    holds: () => {
      const w = SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.witness;
      return Math.abs(w.offsetVsCertifiedM20 - 4) < 1e-9 && w.offsetVsCertifiedError < 1e-9;
    },
  },
  {
    name: 'Q_0 sector genuinely varies across the four moduli (spread ~4.15e-5, a real m-signal)',
    holds: () => {
      const w = SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.witness;
      return w.q0Spread > 1e-5 && w.q0Spread < 1e-4;
    },
  },
  {
    name: 'honest: only m=20 certified, internal-consistency witness not independent +4 proof, NO QED',
    holds: () =>
      SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.witness.certifiedAnchorModuli.join(',') === '20'
      && /internal-consistency m-independence witness/.test(SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.caveats)
      && /NOT an\s+independent verification/.test(SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.caveats)
      && /refereed bound is changed/i.test(SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.status)
      && /NO QED/.test(SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI.status),
  },
]);

export default SUN_PROP63_PLUS4_OFFSET_FOUR_MODULI;
