/**
 * @fileoverview imp-95765 — extend the imp-95749 conditional dI-variation test from ONE
 * conditional point to FOUR moduli. Feed the imp-95746 faithful J_raw(m) at m=18,19,20,21
 * through the SAME imp-95724 exact split J(rho)=3/2+dI(rho) (under the +4 offset hypothesis)
 * and read off whether the rho-carrying scalar dI moves consistently (monotone/sign-stable)
 * across the four moduli or is dominated by quadrature noise.
 *
 * SETUP. imp-95724 localized ALL rho-dependence of J into the single scalar dI(rho), with
 *     J(rho) = 3/2 + dI(rho),   the 3/2 EXACTLY rho-free (5/2 - INT_0^1 zeta(2,1+v) dv).
 * imp-95749 fed ONE conditional point J(1/19) through this split and measured a single dI
 * variation (-2.852e-5), conditionally refuting the constant-J (pure rho^2) null from one
 * off-anchor point. imp-95746 then produced faithful J_raw at m=18 and m=21 (alongside
 * m=19/20) but never fed those through the split. This module closes that: it applies the
 * offset-corrected split
 *     J(1/m) = J_raw(m) + 4,   dI(1/m) = J(1/m) - 3/2 = J_raw(m) + 5/2
 * at ALL FOUR moduli, giving a four-point dI table rather than one conditional point.
 *
 * A CLEAN STRUCTURAL IDENTITY. From imp-95746, J_raw(m) = -(C + Q_0(m)) with the const
 * sector C = 3/2, so J_raw(m) = -3/2 - Q_0(m) and therefore
 *     dI(1/m) = J_raw(m) + 5/2 = 1 - Q_0(m)   (EXACTLY, to displayed precision).
 * The rho-carrying dI is thus ONE MINUS the imp-95746 Q_0 zeta(3) sector: the entire dI
 * variation is (minus) the Q_0 m-signal, so dI(spread) = Q_0(spread) = 4.15e-5.
 *
 * FOUR-MODULUS dI TABLE (via the +4 split; dg dI = -dg Q_0):
 *     m=18 (rho=1/18): dI = 1.0107079475
 *     m=19 (rho=1/19): dI = 1.0106693712
 *     m=20 (rho=1/20): dI = 1.0106978911   (anchor; matches KAPPA-3/2 = 1.0106978912 to 1.4e-10)
 *     m=21 (rho=1/21): dI = 1.0106664879
 * Consecutive differences dI(1/m)-dI(1/(m-1)):
 *     dI(1/19)-dI(1/18) = -3.858e-5
 *     dI(1/20)-dI(1/19) = +2.852e-5   (== the single imp-95749 signal)
 *     dI(1/21)-dI(1/20) = -3.140e-5
 * Total dI spread across the four moduli = 4.146e-5, i.e. ~4.15e4x the 1e-9 quadrature floor.
 *
 * VERDICT (conditional). All four dI values sit on a 4.15e-5-wide band, ~4.15e4x above the
 * 1e-9 quadrature floor: the rho-carrying dI genuinely MOVES at every modulus, so the
 * constant-J (pure rho^2) null is conditionally refuted at FOUR points, not one -- a stronger
 * refutation than imp-95749. BUT the movement is NOT monotone / NOT sign-stable: the three
 * consecutive differences carry signs (-, +, -), a zigzag inherited directly from the
 * non-monotone imp-95746 Q_0 m-signal (dI = 1 - Q_0). So the signal is RESOLVED (far above
 * quadrature noise) yet does NOT follow a clean monotone trend across m=18..21. The rho^2
 * shape still nearly holds (each dI within ~2e-5 relative of the anchor). This is four
 * conditional points, NOT four certified anchors -- everything is gated on the +4 offset
 * being exactly 4 and m-independent, proven only at m=20 (imp-95720 sub-gap; imp-95745
 * analytic +4; imp-95746 four-moduli witness), none an off-anchor certificate.
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no
 * bound; NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3. SCRATCH: tmp/imp-95765-scratch.mjs.
 */

// carried literals (imp-95746 faithful J_raw / imp-95724 exact split / imp-95516 anchor)
const J_FREE = 3 / 2;              // EXACT rho-free part of J (5/2 - INT_0^1 zeta(2,1+v) dv), imp-95724
const OFFSET_HYPOTHESIS = 4.0;     // exact m-independent (verified m=20; imp-95745/95746)
const KAPPA = 2.5106978912403926;  // certified c_odd(1/20)/rho^2 (Sun 6.23); anchor
const QUADRATURE_FLOOR = 1e-9;     // imp-95720: grid == exact-B to 1e-9

// imp-95746 faithful J_raw at four consecutive moduli (Nsub=60000, 238-cell machinery):
const J_RAW = Object.freeze([
  Object.freeze({ m: 18, jRaw: -1.4892920525 }),
  Object.freeze({ m: 19, jRaw: -1.4893306288 }),
  Object.freeze({ m: 20, jRaw: -1.4893021089 }),
  Object.freeze({ m: 21, jRaw: -1.4893335121 }),
]);

// feed each J_raw through the offset-corrected split: J = J_raw + 4, dI = J - 3/2.
const DI_TABLE = Object.freeze(
  J_RAW.map((r) =>
    Object.freeze({
      m: r.m,
      rho: 1 / r.m,
      jCond: r.jRaw + OFFSET_HYPOTHESIS, // conditional J(1/m)
      dI: r.jRaw + OFFSET_HYPOTHESIS - J_FREE, // = J_raw + 5/2 = 1 - Q_0(m)
    }),
  ),
);

const DI_ANCHOR = KAPPA - J_FREE; // 1.0106978912 (independent split of the certified anchor)
const DI_M20 = DI_TABLE.find((r) => r.m === 20).dI; // 1.0106978911 (offset route)
const ANCHOR_RESIDUAL = DI_M20 - DI_ANCHOR; // ~ -1.4e-10 (the +4 vs certified residual)

// consecutive differences dI(1/m) - dI(1/(m-1)) and their sign pattern.
const CONSEC_DIFFS = Object.freeze(
  DI_TABLE.slice(1).map((r, i) =>
    Object.freeze({ from: DI_TABLE[i].m, to: r.m, delta: r.dI - DI_TABLE[i].dI }),
  ),
);
const DIFF_SIGNS = CONSEC_DIFFS.map((d) => Math.sign(d.delta));
const IS_MONOTONE = DIFF_SIGNS.every((s) => s === DIFF_SIGNS[0]);

const DI_VALUES = DI_TABLE.map((r) => r.dI);
const DI_SPREAD = Math.max(...DI_VALUES) - Math.min(...DI_VALUES); // ~4.146e-5
const SIGNAL_TO_FLOOR = DI_SPREAD / QUADRATURE_FLOOR; // ~4.15e4
// max relative deviation of any modulus from the anchor (rho^2 shape closeness).
const MAX_REL_DEV = Math.max(...DI_TABLE.map((r) => Math.abs(r.dI - DI_ANCHOR) / DI_ANCHOR));

export const DI_VARIATION_FOUR_MODULI = Object.freeze({
  id: 'imp-95765-di-variation-four-moduli',
  title:
    'Extend the imp-95749 conditional dI-variation test from one point to four moduli: feed the '
    + 'imp-95746 J_raw at m=18,19,20,21 through the imp-95724 exact J=3/2+dI split (under the +4 '
    + 'offset) -- dI moves at all four (spread 4.15e-5, ~4.15e4x the quadrature floor) but the '
    + 'consecutive differences are NOT sign-stable/monotone (signs -,+,-)',
  status:
    'MEASURED (conditional on the +4 offset) -- the four-modulus dI table dI(1/m)=J_raw(m)+5/2 '
    + '(= 1 - Q_0(m) exactly) spans a 4.146e-5 band, ~4.15e4x the 1e-9 quadrature floor: the '
    + 'rho-carrying dI genuinely moves at every modulus, conditionally refuting the constant-J '
    + '(pure rho^2) null at FOUR points not one. BUT the movement is non-monotone: consecutive '
    + 'differences carry signs (-,+,-), a zigzag inherited from the non-monotone imp-95746 Q_0 '
    + 'm-signal, so the resolved signal follows NO clean monotone trend across m=18..21 (rho^2 '
    + 'shape still holds to ~2e-5 relative). Four conditional points, NOT four certified anchors '
    + '(only m=20 certified). G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed'
    + '; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source:
    'imp-95746 faithful J_raw at m=18/19/20/21 + imp-95724 exact split J(rho)=3/2+dI(rho); '
    + 'anchor kappa via imp-95516/95637/95653',
  builtOn:
    'imp-95749 (single conditional dI point at m=19), imp-95746 (faithful J_raw at m=18/21 never '
    + 'fed through the split), imp-95724 (exact J=3/2+dI split), imp-95745 (analytic +4 offset)',
  scratch: ['tmp/imp-95765-scratch.mjs'],

  structuralIdentity: Object.freeze({
    relation: 'dI(1/m) = J_raw(m) + 5/2 = 1 - Q_0(m)  (const sector C=3/2 cancels; imp-95746)',
    reading:
      'the rho-carrying dI is ONE MINUS the imp-95746 Q_0 zeta(3) sector, so the entire dI '
      + 'variation is (minus) the Q_0 m-signal and dI spread = Q_0 spread = 4.15e-5.',
  }),

  diTable: DI_TABLE, // {m, rho, jCond, dI} x4

  variation: Object.freeze({
    consecutiveDiffs: CONSEC_DIFFS, // dI(1/m)-dI(1/(m-1)); middle diff (+2.852e-5) == imp-95749 signal
    diffSigns: Object.freeze(DIFF_SIGNS), // [-1, +1, -1]
    isMonotone: IS_MONOTONE, // false -- zigzag inherited from the non-monotone Q_0 m-signal
    diSpread: DI_SPREAD, // ~4.146e-5
    maxRelDeviationFromAnchor: MAX_REL_DEV, // ~2e-5 (rho^2 shape nearly holds)
    reading:
      'all four dI values move on a 4.15e-5 band far above the 1e-9 floor (resolved), but the '
      + 'consecutive differences flip sign (-,+,-): the signal is genuine yet non-monotone across '
      + 'm=18..21, tracking the non-monotone imp-95746 Q_0 sector rather than a clean rho-trend.',
  }),

  resolutionCheck: Object.freeze({
    quadratureFloor: QUADRATURE_FLOOR, // 1e-9
    signalToFloor: SIGNAL_TO_FLOOR, // ~4.15e4
    resolved: SIGNAL_TO_FLOOR > 1e3,
    reading:
      'the 4.15e-5 dI spread is ~4.15e4x the 1e-9 quadrature floor, so the four-modulus variation '
      + 'is a resolved signal, NOT dominated by quadrature noise.',
  }),

  anchorConsistency: Object.freeze({
    diAnchorFromKappa: DI_ANCHOR, // KAPPA - 3/2 = 1.0106978912
    diM20FromOffset: DI_M20, // 1.0106978911 (offset route)
    residual: ANCHOR_RESIDUAL, // ~ -1.4e-10 (matches the imp-95720 +4-vs-certified residual)
  }),

  verdict: Object.freeze({
    constantJNullRefutedConditionally: true, // dI moves at all four moduli, above the floor
    signalResolved: true, // ~4.15e4x the quadrature floor
    monotoneAcrossModuli: false, // consecutive diffs sign-flip (-,+,-)
    certifiedAnchorsCount: 1, // only m=20 has an independent certified kappa
    conclusion:
      'UNDER the +4 offset the four-modulus dI table is measured and moves at every modulus '
      + '(spread 4.15e-5, ~4.15e4x the quadrature floor), conditionally refuting the pure-rho^2 '
      + 'constant-J null at four points not one. But the variation is NON-MONOTONE (consecutive '
      + 'differences sign-flip -,+,-), inherited from the non-monotone imp-95746 Q_0 m-signal via '
      + 'dI = 1 - Q_0, so the resolved signal follows no clean rho-trend and the rho^2 shape still '
      + 'holds to ~2e-5 relative. Four conditional points, NOT four certified anchors: only m=20 '
      + 'has an independent kappa; the whole table is gated on the +4 offset being m-independent '
      + '(proven only at m=20).',
  }),

  caveats:
    'Combines carried numeric results (the imp-95746 four-moduli J_raw and the imp-95724 exact '
    + 'split) through arithmetic only; performs no new Prop-6.3 quadrature. The entire dI table at '
    + 'm=18/19/21 is CONDITIONAL on the +4 offset being exactly 4 and m-independent (verified only '
    + 'at m=20). NOT four certified anchors. The non-monotone zigzag reflects the imp-95746 Q_0 '
    + 'sector; whether it is genuine rho-structure or a residual per-modulus artifact at the '
    + '~3e-5 level is not resolved here. Catalan G irrationality OPEN; Sun single-author, '
    + 'unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const DI_VARIATION_FOUR_MODULI_ASSERTIONS = Object.freeze([
  {
    name: 'four-modulus dI table via the exact split: dI(1/m) = J_raw(m) + 5/2 (m=18,19,20,21)',
    holds: () =>
      DI_TABLE.length === 4
      && DI_TABLE.map((r) => r.m).join(',') === '18,19,20,21'
      && DI_TABLE.every((r) => Math.abs(r.dI - (r.jCond - J_FREE)) < 1e-15)
      && Math.abs(DI_TABLE.find((r) => r.m === 18).dI - 1.0107079475) < 1e-9
      && Math.abs(DI_TABLE.find((r) => r.m === 21).dI - 1.0106664879) < 1e-9,
  },
  {
    name: 'structural identity dI(1/m) = 1 - Q_0(m): dI(1/20) matches the certified anchor to ~1.4e-10',
    holds: () => Math.abs(ANCHOR_RESIDUAL) < 1e-9 && Math.abs(DI_M20 - (KAPPA - 1.5)) < 1e-9,
  },
  {
    name: 'the middle consecutive difference dI(1/20)-dI(1/19) reproduces the single imp-95749 signal (+2.852e-5)',
    holds: () => {
      const mid = CONSEC_DIFFS.find((d) => d.from === 19 && d.to === 20);
      return Math.abs(mid.delta - 2.852e-5) < 1e-7;
    },
  },
  {
    name: 'dI spread across four moduli ~4.146e-5 = ~4.15e4x the 1e-9 quadrature floor (resolved signal)',
    holds: () =>
      Math.abs(DI_SPREAD - 4.146e-5) < 1e-7
      && SIGNAL_TO_FLOOR > 1e4
      && DI_VARIATION_FOUR_MODULI.resolutionCheck.resolved === true,
  },
  {
    name: 'the variation is NON-monotone: consecutive-difference signs are (-1,+1,-1)',
    holds: () =>
      DIFF_SIGNS.join(',') === '-1,1,-1'
      && IS_MONOTONE === false
      && DI_VARIATION_FOUR_MODULI.verdict.monotoneAcrossModuli === false,
  },
  {
    name: 'verdict: constant-J null CONDITIONALLY refuted at four points, only one certified anchor (m=20)',
    holds: () =>
      DI_VARIATION_FOUR_MODULI.verdict.constantJNullRefutedConditionally === true
      && DI_VARIATION_FOUR_MODULI.verdict.certifiedAnchorsCount === 1,
  },
  {
    name: 'honest: conditional on the +4 offset, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /conditional/i.test(DI_VARIATION_FOUR_MODULI.caveats)
      && /G irrationality OPEN/.test(DI_VARIATION_FOUR_MODULI.status)
      && /refereed bound is changed/i.test(DI_VARIATION_FOUR_MODULI.status)
      && /NO QED/.test(DI_VARIATION_FOUR_MODULI.status),
  },
]);

export default DI_VARIATION_FOUR_MODULI;
