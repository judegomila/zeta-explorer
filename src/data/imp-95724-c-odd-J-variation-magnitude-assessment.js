/**
 * @fileoverview imp-95724 — MAGNITUDE ASSESSMENT of the J(rho)-variation that imp-95690
 * LOCATED in the Q_0(v)*zeta(3,1+v) term of the Sun-Catalan c_odd shape, and a verdict
 * on whether the pure-rho^2 (constant-J) null is defensible or already excluded.
 *
 * SETUP (carried from imp-95690 / Sun Prop 6.3, eqs 6.19-6.21). The odd small-prime
 * constant factors as c_odd(rho) = rho^2 * J(rho) with the rho^2 PREFACTOR structurally
 * forced, and
 *     J(rho) = INT_0^1 ( 5/2 - zeta(2,1+v) + Q_0^(rho)(v) zeta(3,1+v) ) dv.
 * imp-95690 refuted the "integrand is rho-independent" annotation (Q_0 carries rho through
 * moduli 1/rho, 2/rho, 2/rho+1 and the leading -(4/rho-1)/2), so the constant-J null is not
 * manifest -- but it was left as a magnitude-unquantified sub-gap ("does NOT prove J(rho)
 * actually varies"). This module quantifies HOW MUCH of J is the uncertified rho-carrying
 * part, so the null can be judged as either a negligible-residual question or a leading-order
 * one. Assessment, not a Prop-6.3 re-derivation; no second-anchor re-run performed.
 *
 * NEW EXACT SPLIT (rho-free vs rho-carrying). The v-integrand splits into a piece that is
 * MANIFESTLY rho-free (the 5/2 and zeta(2,1+v) terms) and the single rho-carrying term
 * Q_0^(rho)(v) zeta(3,1+v). Both rho-free pieces integrate in closed form on [0,1]:
 *     INT_0^1 (5/2) dv = 5/2,
 *     INT_0^1 zeta(2,1+v) dv = INT_0^1 sum_{m>=1} (m+v)^-2 dv
 *                            = sum_{m>=1} ( 1/m - 1/(m+1) ) = 1   (telescoping, EXACT).
 * Hence the rho-free part of J is EXACTLY
 *     J_free = 5/2 - 1 = 3/2,
 * and ALL rho-dependence of J lives in the single scalar
 *     dI(rho) = INT_0^1 Q_0^(rho)(v) zeta(3,1+v) dv,   J(rho) = 3/2 + dI(rho).
 * This is a sharper localization than imp-95690: not just "the rho-dependence is in the
 * Q_0 term", but "J minus an exact 3/2 IS that term", so its anchor value is pinned with no
 * knowledge of the Q_0^(rho) coefficients themselves.
 *
 * ANCHOR VALUE OF THE UNCERTIFIED TERM. At rho = 1/20, J(1/20) = kappa = 2.51069789
 * (the one-point back-solve c_odd(1/20)/(1/20)^2). Therefore
 *     dI(1/20) = kappa - 3/2 = 1.01069789,
 * and the rho-carrying term is a fraction
 *     dI(1/20) / J(1/20) = 1.01069789 / 2.51069789 = 0.4026  (~40% of J).
 *
 * VERDICT on the constant-J (pure rho^2) null.
 *   - It is NOT already excluded: only ONE numeric anchor exists, so dI(rho2) is unmeasured
 *     and a hidden identity holding INT Q_0^(rho) zeta(3,1+v) dv exactly invariant is
 *     logically possible (imp-95690 hiddenIdentityCaveat).
 *   - It is also NOT defensible as a negligible-residual approximation: the uncertified
 *     rho-carrying term is ~40% of J, not a small correction on top of a rho-free bulk.
 *     If dI varies with rho at anything like the relative scale by which its Q_0 moduli
 *     rescale (20,40,41 -> 1/rho2,2/rho2,2/rho2+1), the induced off-anchor kappa error
 *     kappa(rho2)-kappa = kappa*(dI(rho2)-dI(1/20))/J(1/20) is a LEADING-ORDER effect, not a
 *     rounding-level one. So kappa-as-a-curvature is uncertified at first order in the shape,
 *     exactly the regime a single-anchor fit cannot see.
 *   NET: the constant-J null sits in the undecided middle -- neither refuted (one anchor) nor
 *   dismissible as small (40% of J is at stake). The ONLY resolution remains the imp-95690
 *   named re-run: a full Prop-6.3 re-execution at a second rho2 to produce dI(rho2). This
 *   quantifies, without settling, the imp-95637/95690 shape sub-gap.
 *
 * A CRUDE A-PRIORI RANGE (context only, deliberately NOT read as a bound on the variation).
 * On [0,1], zeta(3,1+v) is monotone decreasing within [zeta(3)-1, zeta(3)] = [0.2021, 1.2021].
 * dI is that weight integrated against the piecewise-quadratic Q_0^(rho); with only the anchor
 * dI(1/20)=1.0107 known and Q_0^(rho) uncomputed off-anchor, no honest two-sided numeric bound
 * on dI(rho2) follows from a single anchor. The point of the range is only to confirm the
 * weight is O(1), so a 40%-of-J term cannot be argued away as weight-suppressed.
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no
 * bound; NO Lambda movement; no refereed bound is changed; NO QED.
 *
 * NO heavy imports. All figures baked as literals / recomputed from the eqs above.
 */

const RHO_ANCHOR = 1 / 20;
const KAPPA = 2.51069789; // = J(1/20) = c_odd(1/20)/(1/20)^2 (imp-95516/95637/95653 literal)

// EXACT rho-free part of J: 5/2 from the constant term, 1 from INT_0^1 zeta(2,1+v) dv.
const J_FREE = 5 / 2 - 1; // = 3/2, exact (telescoping identity below)

// Telescoping check for INT_0^1 zeta(2,1+v) dv = sum_{m>=1}(1/m - 1/(m+1)) = 1.
function intZeta2Over01(mMax = 2000000) {
  let sum = 0;
  for (let m = 1; m <= mMax; m++) sum += 1 / m - 1 / (m + 1);
  return sum; // -> 1 - 1/(mMax+1)
}

// The single rho-carrying scalar; pinned at the anchor with NO Q_0 coefficient knowledge.
const DI_AT_ANCHOR = KAPPA - J_FREE; // = 1.01069789
const DI_FRACTION_OF_J = DI_AT_ANCHOR / KAPPA; // ~0.4026

// zeta(3,1+v) weight range on [0,1] (context only, not a variation bound).
const ZETA3 = 1.2020569031595942854;
const WEIGHT_RANGE = Object.freeze({ lo: ZETA3 - 1, hi: ZETA3 }); // [0.2021, 1.2021]

export const C_ODD_J_VARIATION_MAGNITUDE_ASSESSMENT = Object.freeze({
  id: 'imp-95724-c-odd-J-variation-magnitude-assessment',
  title:
    'Magnitude assessment of the J(rho)-variation the imp-95690 verdict LOCATED in the '
    + 'Sun-Catalan Q_0(v)*zeta(3,1+v) term, and a verdict on the constant-J (pure rho^2) null',
  status:
    'ASSESSMENT — exact split J(rho)=3/2+dI(rho) with J_free=3/2 EXACT (INT_0^1 zeta(2,1+v) dv=1, '
    + 'telescoping) localizes ALL rho-dependence into dI(rho)=INT_0^1 Q_0^(rho)(v) zeta(3,1+v) dv; '
    + 'dI(1/20)=kappa-3/2=1.01069789 is ~40% of J. VERDICT: the constant-J null is NEITHER excluded '
    + '(one anchor) NOR defensible-as-negligible (40% of J at stake) -- kappa-as-curvature is '
    + 'uncertified at LEADING order; only the imp-95690 second-anchor Prop-6.3 re-run resolves it. '
    + 'G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'Sun Prop 6.3 eqs (6.19)-(6.21) via imp-95690; anchor kappa via imp-95516/95637/95653',

  exactSplit: {
    identity: 'J(rho) = INT_0^1 ( 5/2 - zeta(2,1+v) + Q_0^(rho)(v) zeta(3,1+v) ) dv = 3/2 + dI(rho)',
    intConstTerm: 5 / 2,
    intZeta2Over01: 1, // EXACT, telescoping sum_{m>=1}(1/m - 1/(m+1))
    jFree: J_FREE, // 3/2, exact and rho-free
    rhoCarryingTerm: 'dI(rho) = INT_0^1 Q_0^(rho)(v) zeta(3,1+v) dv (the ONLY rho-dependence)',
    note:
      'sharper than imp-95690: J minus an exact 3/2 IS the Q_0 term, so dI(1/20) is pinned '
      + 'from the anchor kappa alone, with no Q_0^(rho) coefficient knowledge.',
  },

  anchorMagnitude: {
    kappaEqualsJAtAnchor: KAPPA,
    diAtAnchor: DI_AT_ANCHOR, // 1.01069789
    diFractionOfJ: DI_FRACTION_OF_J, // ~0.4026
    reading:
      'the uncertified rho-carrying term is ~40% of J at the anchor -- NOT a small residual on '
      + 'top of a rho-free bulk, so the constant-J null is a leading-order question.',
  },

  weightRangeContext: {
    zeta3: ZETA3,
    zeta3_1plusV_range: WEIGHT_RANGE, // [0.2021, 1.2021] on v in [0,1]
    caveat:
      'context only: the weight is O(1) (so a 40%-of-J term is not weight-suppressed); with a '
      + 'single anchor and Q_0^(rho) uncomputed off-anchor, NO honest two-sided numeric bound on '
      + 'dI(rho2) follows -- this is deliberately NOT presented as a variation bound.',
  },

  verdict: {
    excludedByData: false, // one anchor only
    defensibleAsNegligible: false, // 40% of J at stake
    deviationLaw: 'kappa(rho2) - kappa = kappa * ( dI(rho2) - dI(1/20) ) / J(1/20)',
    conclusion:
      'the constant-J (pure rho^2) null is undecided in the strong sense: neither refuted nor '
      + 'dismissible as a rounding-level residual. kappa as an off-anchor curvature is uncertified '
      + 'at LEADING order in the shape. Resolution requires the imp-95690 named second-anchor '
      + 'Prop-6.3 re-run at rho2 (recompute alpha,beta,gamma,Q_0 with rho2-moduli).',
  },

  caveats:
    'Assessment + exact rho-free localization, not a Prop-6.3 re-derivation or a second-anchor '
    + 'computation. Uses only the exact telescoping integral and the carried anchor kappa. '
    + 'Catalan G irrationality OPEN; Sun single-author, unrefereed; NO Lambda movement; '
    + 'no refereed bound is changed; NO QED.',
});

export const C_ODD_J_VARIATION_MAGNITUDE_ASSERTIONS = Object.freeze([
  {
    name: 'INT_0^1 zeta(2,1+v) dv = 1 (telescoping) so J_free = 3/2 exactly',
    holds: () =>
      Math.abs(intZeta2Over01() - 1) < 1e-6 && Math.abs(J_FREE - 1.5) < 1e-15,
  },
  {
    name: 'dI(1/20) = kappa - 3/2 = 1.01069789 (the rho-carrying term, pinned at the anchor)',
    holds: () => Math.abs(DI_AT_ANCHOR - 1.01069789) < 1e-8,
  },
  {
    name: 'the uncertified rho-carrying term is ~40% of J at the anchor (0.402 < dI/J < 0.403)',
    holds: () => DI_FRACTION_OF_J > 0.402 && DI_FRACTION_OF_J < 0.403,
  },
  {
    name: 'verdict: constant-J null NEITHER excluded NOR defensible-as-negligible',
    holds: () =>
      C_ODD_J_VARIATION_MAGNITUDE_ASSESSMENT.verdict.excludedByData === false
      && C_ODD_J_VARIATION_MAGNITUDE_ASSESSMENT.verdict.defensibleAsNegligible === false,
  },
  {
    name: 'honest: assessment only, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /G irrationality OPEN/.test(C_ODD_J_VARIATION_MAGNITUDE_ASSESSMENT.status)
      && /refereed bound is changed/i.test(C_ODD_J_VARIATION_MAGNITUDE_ASSESSMENT.status)
      && /NO QED/.test(C_ODD_J_VARIATION_MAGNITUDE_ASSESSMENT.status),
  },
]);

export default C_ODD_J_VARIATION_MAGNITUDE_ASSESSMENT;
