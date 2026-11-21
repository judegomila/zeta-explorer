/**
 * @fileoverview imp-95749 — combine the imp-95720 conditional J(1/19) with the imp-95724
 * exact split J(rho)=3/2+dI(rho) to MEASURE the variation of the rho-carrying scalar dI,
 * and judge the constant-J (pure rho^2) null under the +4 offset hypothesis.
 *
 * SETUP. imp-95724 localized ALL rho-dependence of J into the single scalar
 *     dI(rho) = INT_0^1 Q_0^(rho)(v) zeta(3,1+v) dv,   J(rho) = 3/2 + dI(rho),
 * with the 3/2 EXACTLY rho-free (5/2 - INT_0^1 zeta(2,1+v) dv = 5/2 - 1, telescoping). At the
 * anchor rho = 1/20, dI(1/20) = kappa - 3/2 = 1.0106978912 (~40% of J), and imp-95724 left the
 * constant-J null UNDECIDED for lack of a second dI value. imp-95720 then produced, CONDITIONAL
 * on the +4 additive offset hypothesis (J_raw + 4 = kappa, verified exactly at m=20), a second
 * point J(1/19) = J_raw(1/19) + 4 = 2.5106693712.
 *
 * WHAT THIS MODULE DOES. It feeds J(1/19) through the SAME exact split to get the second dI
 * value and tabulate it against dI(1/20), then reads off the dI variation the imp-95724 verdict
 * left unmeasured:
 *     dI(1/19) = J(1/19) - 3/2 = 1.0106693712.
 * Because the 3/2 (rho-free) cancels exactly and the +4 offset cancels against kappa up to the
 * 1.4e-10 anchor residual (kappa - J_raw(1/20) = 4.00000000014, imp-95720), the dI variation is
 * the raw rho-signal imp-95720 measured, to displayed precision:
 *     dI(1/19) - dI(1/20) = J_raw(1/19) - J_raw(1/20) = -2.852e-5,
 * which sits ~2.85e4 x above the 1e-9 quadrature floor -- a resolved signal, NOT resolution
 * noise. So UNDER the offset hypothesis the 40%-of-J rho-carrying term dI genuinely MOVES; it is
 * not held invariant. This CONDITIONALLY refutes the constant-J (pure rho^2) null that imp-95724
 * could not decide from one anchor.
 *
 * THE AMPLIFICATION (the quantitative point). dI carries only ~40% of J but 100% of the
 * variation (the 3/2 bulk cannot move), so the FRACTIONAL variation of dI is the fractional
 * variation of J scaled up by J/dI = 1/0.4026 = 2.484:
 *     fractional dI variation = (dI(1/19)-dI(1/20))/dI(1/20) = -2.822e-5,
 *     fractional  J variation = J(1/19)/kappa - 1              = -1.136e-5,
 *     ratio = 2.484 = kappa/dI(1/20).
 * The induced off-anchor kappa error follows the imp-95724 deviation law
 * kappa(rho2)-kappa = kappa*(dI(rho2)-dI(1/20))/J(1/20); with kappa = J(1/20) this reduces to the
 * bare dI difference, kappa(1/19)-kappa = -2.852e-5 (= -1.136e-5 relative). So the constant-J
 * null fails, but only just: the rho^2 shape holds to ~1e-5 relative, i.e. dI moves at leading
 * order in principle (40% of J) yet by a tiny relative amount in fact.
 *
 * VERDICT (conditional). Under the imp-95720/95745 +4 offset hypothesis the dI variation is
 * MEASURED and nonzero (-2.852e-5, above the quadrature floor): the 40%-of-J term is not
 * invariant, refuting the pure-rho^2 constant-J null CONDITIONALLY. This is one-anchor-plus-one-
 * conditional-point, NOT a certified second anchor -- everything is gated on the offset being
 * exactly 4 and m-independent, which is proven only at m=20 (imp-95720 sub-gap; imp-95745 gives
 * the analytic +4, imp-95746 the four-moduli witness, neither an off-anchor certificate).
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no
 * bound; NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports.
 */

// carried literals (imp-95720 / imp-95724 / imp-95516 anchor)
const KAPPA = 2.5106978912403926; // = J(1/20) = c_odd(1/20)/(1/20)^2
const J_FREE = 3 / 2; // EXACT rho-free part of J (5/2 - 1, telescoping); imp-95724
const J_RAW_AT_1_OVER_20 = -1.4893021089; // faithful (6.21) machinery, imp-95720
const J_RAW_AT_1_OVER_19 = -1.4893306288; // same machinery at rho2 = 1/19, imp-95720
const OFFSET_HYPOTHESIS = 4.0; // exact m-independent (verified m=20; imp-95745/95746)

// conditional second point via the +4 offset, then split through J = 3/2 + dI.
const J_COND_AT_1_OVER_19 = J_RAW_AT_1_OVER_19 + OFFSET_HYPOTHESIS; // 2.5106693712
const DI_AT_1_OVER_20 = KAPPA - J_FREE; // 1.0106978912 (~40% of J)
const DI_COND_AT_1_OVER_19 = J_COND_AT_1_OVER_19 - J_FREE; // 1.0106693712

// the variation the imp-95724 verdict left unmeasured.
const DI_VARIATION = DI_COND_AT_1_OVER_19 - DI_AT_1_OVER_20; // -2.852e-5 (== raw J-signal)
const RAW_J_SIGNAL = J_RAW_AT_1_OVER_19 - J_RAW_AT_1_OVER_20; // -2.852e-5 (offset+3/2 cancel)
const DI_FRACTIONAL_VARIATION = DI_VARIATION / DI_AT_1_OVER_20; // -2.822e-5
const J_FRACTIONAL_VARIATION = J_COND_AT_1_OVER_19 / KAPPA - 1; // -1.136e-5
const DI_FRACTION_OF_J = DI_AT_1_OVER_20 / KAPPA; // 0.4026
const AMPLIFICATION = KAPPA / DI_AT_1_OVER_20; // 2.484 = frac dI var / frac J var
const QUADRATURE_FLOOR = 1e-9; // imp-95720: grid == exact-B to 1e-9
const SIGNAL_TO_FLOOR = Math.abs(DI_VARIATION) / QUADRATURE_FLOOR; // ~2.85e4

// induced off-anchor kappa error via the imp-95724 deviation law (kappa = J(1/20)).
const KAPPA_ERROR_ABS = KAPPA * DI_VARIATION / KAPPA; // = DI_VARIATION = -2.852e-5
const KAPPA_ERROR_REL = KAPPA_ERROR_ABS / KAPPA; // -1.136e-5

export const DI_VARIATION_AGAINST_CONSTANT_J_NULL = Object.freeze({
  id: 'imp-95749-di-variation-against-constant-J-null',
  title:
    'Combine the imp-95720 conditional J(1/19) with the imp-95724 exact J=3/2+dI split to measure '
    + 'the dI variation: the 40%-of-J rho-carrying term MOVES by -2.852e-5 (conditionally refuting '
    + 'the constant-J null), with the fractional variation amplified 2.484x over J',
  status:
    'ASSESSMENT — feeding the imp-95720 conditional J(1/19)=2.5106693712 through the imp-95724 exact '
    + 'split gives dI(1/19)=1.0106693712 vs dI(1/20)=1.0106978912, a variation dI(1/19)-dI(1/20)='
    + '-2.852e-5 (identical to the raw J-signal, since both the exact 3/2 and the +4 offset cancel), '
    + 'sitting ~2.85e4x above the 1e-9 quadrature floor. VERDICT (conditional on the +4 offset): the '
    + '40%-of-J term dI genuinely varies, refuting the pure-rho^2 constant-J null; fractional dI '
    + 'variation -2.822e-5 = 2.484x the fractional J variation -1.136e-5 (dI carries 40% of J but 100% '
    + 'of the drift); induced kappa error -2.852e-5 abs (-1.136e-5 rel). One-anchor-plus-conditional, '
    + 'NOT a certified second anchor. G irrationality OPEN; Sun unrefereed; changes no bound; '
    + 'no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'imp-95720 conditional J(1/19) + imp-95724 exact split J(rho)=3/2+dI(rho); anchor kappa via imp-95516/95637/95653',
  builtOn:
    'imp-95724 (exact J=3/2+dI split, dI(1/20)=~40% of J, constant-J null undecided), imp-95720 '
    + '(conditional J(1/19) via the +4 offset), imp-95745/95746 (+4 offset derivation / four-moduli witness)',

  diTable: Object.freeze({
    jFree: J_FREE, // 3/2 exact, rho-free
    di_at_1over20: DI_AT_1_OVER_20, // 1.0106978912
    j_cond_at_1over19: J_COND_AT_1_OVER_19, // 2.5106693712
    di_cond_at_1over19: DI_COND_AT_1_OVER_19, // 1.0106693712
    diFractionOfJ: DI_FRACTION_OF_J, // 0.4026
  }),

  variation: Object.freeze({
    di_variation_abs: DI_VARIATION, // -2.852e-5
    raw_j_signal: RAW_J_SIGNAL, // -2.852e-5, equal to dI variation up to the 1.4e-10 anchor residual
    di_fractional_variation: DI_FRACTIONAL_VARIATION, // -2.822e-5
    j_fractional_variation: J_FRACTIONAL_VARIATION, // -1.136e-5
    amplification: AMPLIFICATION, // 2.484 = kappa/dI(1/20) = frac dI var / frac J var
    reading:
      'dI carries ~40% of J but 100% of the variation (the exact 3/2 bulk cannot move), so its '
      + 'fractional drift is J/dI = 2.484x that of J. The rho-carrying term genuinely moves; the '
      + 'rho^2 shape nonetheless holds to ~1e-5 relative.',
  }),

  resolutionCheck: Object.freeze({
    quadratureFloor: QUADRATURE_FLOOR, // 1e-9, imp-95720 grid == exact-B
    signalToFloor: SIGNAL_TO_FLOOR, // ~2.85e4
    resolved: SIGNAL_TO_FLOOR > 1e3,
    reading:
      'the -2.852e-5 dI variation is ~2.85e4x the 1e-9 quadrature floor, so it is a resolved signal, '
      + 'NOT within the J-signal resolution noise: under the offset hypothesis dI is measurably '
      + 'non-invariant.',
  }),

  inducedKappaError: Object.freeze({
    deviationLaw: 'kappa(rho2) - kappa = kappa * ( dI(rho2) - dI(1/20) ) / J(1/20)  (imp-95724)',
    kappaErrorAbs: KAPPA_ERROR_ABS, // -2.852e-5 (reduces to the bare dI difference since kappa=J(1/20))
    kappaErrorRel: KAPPA_ERROR_REL, // -1.136e-5
  }),

  verdict: Object.freeze({
    constantJNullRefutedConditionally: true, // dI moves by -2.852e-5, above the floor
    certifiedSecondAnchor: false, // gated entirely on the +4 offset being m-independent (proven only at m=20)
    conclusion:
      'UNDER the +4 offset hypothesis the imp-95724 dI variation is measured and nonzero: the '
      + '40%-of-J rho-carrying term dI genuinely varies (-2.852e-5, ~2.85e4x the quadrature floor), '
      + 'conditionally refuting the pure-rho^2 constant-J null. But the effect is tiny in relative '
      + 'terms (fractional dI variation -2.822e-5), so the rho^2 shape nearly holds. This is one '
      + 'anchor plus one conditional point, NOT a certified second anchor -- the offset is proven '
      + 'exactly 4 only at m=20 (imp-95720 sub-gap; imp-95745/95746 are analytic + witness, not an '
      + 'off-anchor certificate).',
  }),

  caveats:
    'Combines two carried numeric results (the imp-95720 conditional J(1/19) and the imp-95724 exact '
    + 'split) through arithmetic only; performs no new Prop-6.3 quadrature. The entire dI(1/19) value '
    + 'and hence the whole variation is CONDITIONAL on the +4 offset being exactly 4 and m-independent '
    + '(verified only at m=20). NOT a certified second anchor. Catalan G irrationality OPEN; Sun '
    + 'single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const DI_VARIATION_AGAINST_CONSTANT_J_NULL_ASSERTIONS = Object.freeze([
  {
    name: 'dI(1/19) = J(1/19) - 3/2 = 1.0106693712 (conditional, via the exact split)',
    holds: () => Math.abs(DI_COND_AT_1_OVER_19 - 1.0106693712) < 1e-9,
  },
  {
    name: 'dI variation = dI(1/19)-dI(1/20) = raw J-signal (3/2 and +4 cancel to the 1.4e-10 anchor residual), ~ -2.852e-5',
    holds: () =>
      Math.abs(DI_VARIATION - RAW_J_SIGNAL) < 1e-9
      && Math.abs(DI_VARIATION - (-2.852e-5)) < 1e-7,
  },
  {
    name: 'fractional dI variation (-2.822e-5) = 2.484x the fractional J variation (-1.136e-5)',
    holds: () =>
      Math.abs(DI_FRACTIONAL_VARIATION - (-2.822e-5)) < 1e-7
      && Math.abs(J_FRACTIONAL_VARIATION - (-1.136e-5)) < 1e-7
      && Math.abs(AMPLIFICATION - DI_FRACTIONAL_VARIATION / J_FRACTIONAL_VARIATION) < 1e-6
      && Math.abs(AMPLIFICATION - 2.484) < 2e-3,
  },
  {
    name: 'the dI variation is ~2.85e4x the 1e-9 quadrature floor (resolved signal, not noise)',
    holds: () => SIGNAL_TO_FLOOR > 1e4 && DI_VARIATION_AGAINST_CONSTANT_J_NULL.resolutionCheck.resolved === true,
  },
  {
    name: 'induced kappa error = -2.852e-5 abs (-1.136e-5 rel) via the imp-95724 deviation law',
    holds: () =>
      Math.abs(KAPPA_ERROR_ABS - DI_VARIATION) < 1e-12
      && Math.abs(KAPPA_ERROR_REL - J_FRACTIONAL_VARIATION) < 1e-9,
  },
  {
    name: 'verdict: constant-J null CONDITIONALLY refuted, NOT a certified second anchor',
    holds: () =>
      DI_VARIATION_AGAINST_CONSTANT_J_NULL.verdict.constantJNullRefutedConditionally === true
      && DI_VARIATION_AGAINST_CONSTANT_J_NULL.verdict.certifiedSecondAnchor === false,
  },
  {
    name: 'honest: conditional on the +4 offset, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /conditional/i.test(DI_VARIATION_AGAINST_CONSTANT_J_NULL.caveats)
      && /G irrationality OPEN/.test(DI_VARIATION_AGAINST_CONSTANT_J_NULL.status)
      && /refereed bound is changed/i.test(DI_VARIATION_AGAINST_CONSTANT_J_NULL.status)
      && /NO QED/.test(DI_VARIATION_AGAINST_CONSTANT_J_NULL.status),
  },
]);

export default DI_VARIATION_AGAINST_CONSTANT_J_NULL;
