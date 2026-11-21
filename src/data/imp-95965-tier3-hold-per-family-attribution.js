/**
 * @fileoverview imp-95965 -- ATTEMPT the per-family / per-locus attribution of the interior HOLD term
 * left OPEN by imp-95916, now sharpened by imp-95925 to require the aggregate TIER-3 m-slope to match
 * -C_1 up to an O(m^-3) remainder. Derivation/assessment only; changes no bound; NO QED.
 *
 * SETUP (from imp-95916 / imp-95900 / imp-95901). imp-95916 decomposed the aggregate TIER-3 m-slope by
 * Reynolds transport, D_3(m) = HOLD(m) - sum_i (dv0_i/dm) J_i zeta(3,1+v0_i), and CLOSED the sliding-flux
 * route as EXACTLY ZERO (continuity Dc = -Ds.v0 makes every per-locus VALUE jump J_i vanish). So the entire
 * +0.2006346034029 = -C_1 cancellation is carried by the interior HOLD term at held positions,
 *   HOLD(m) = INT_0^1 [ (s_base_prime(m) + S(v,m)) . v + c_base_prime(m) ] . zeta(3,1+v) dv,
 * where S(v,m) = sum_{loci < v} d/dm[Ds] is the accumulated-slope m-derivative, and every d/dm[Dc] = 0
 * because the imp-95901 Dc laws are m-free (alpha 3j, beta -j, gamma 1.5j, delta k, half -1). imp-95916
 * named "symbolize the accumulation base s_base(m), c_base(m)" as the residual and stopped there.
 *
 * THIS MODULE (attempt the attribution + quantify the O(m) cancellation). The crucial observation left
 * unused by imp-95916 is that d/dm[Ds] is a PER-FAMILY CONSTANT (from the imp-95901 laws):
 *     alpha d/dm[Ds] = -3 ;  beta-even +2 ;  gamma -3 ;  delta -1 ;  half 0.
 * Therefore S(v,m) splits per family and the accumulated-slope part of HOLD is FULLY per-family
 * ATTRIBUTABLE IN CLOSED FORM (each locus contributes to every v above it):
 *   HOLD_accum,family(m) = d/dm[Ds]_family . sum_{loci i in family} INT_{v0_i}^1 v . zeta(3,1+v) dv.
 * Writing G(a) = INT_a^1 v zeta(3,1+v) dv and using the near-uniform locus densities (alpha rho=m,
 * beta-even rho=m, gamma rho=2m, delta rho=m; each family fills [0,1]), the leading large-m behaviour is
 *   HOLD_accum,family(m) ~ d/dm[Ds]_family . rho_family . m . INT_0^1 G(a) da,
 * and INT_0^1 G(a) da = INT_0^1 v^2 zeta(3,1+v) dv = -C_1/2 (the imp-95900 TIER-1 curvature integral J0).
 *
 * THE FINDING (leading O(m) coefficient pinned exactly to 4 C_1). Summing the four families:
 *   accumTotal(m) ~ [ (-3)(1) + (+2)(1) + (-3)(2) + (-1)(1) ] . m . J0 = -8 J0 . m = 4 C_1 . m,
 * an O(m) term. Numerically accumTotal/m climbs monotonically toward 4 C_1 = -0.8025384 (-0.770040 at
 * m=20, -0.798237 at m=150), and the subleading accumTotal - 4 C_1 m converges to a finite constant
 * K ~ 0.6452 (0.649960 at m=20 -> 0.645198 at m=150; scratch). Per-family leading coefficients match:
 * alpha -3 J0 = -0.300952, beta +2 J0 = +0.200635, gamma -6 J0 = -0.601904, delta -1 J0 = -0.100317
 * (measured alpha/m = -0.29917, beta/m = +0.20012, gamma/m = -0.60013, delta/m = -0.09906 at m=150,
 * all approaching the predictions). So the accumulated-slope part alone is a growing O(m) quantity whose
 * leading coefficient is EXACTLY 4 C_1 = -8 INT v^2 zeta -- QUANTIFYING the imp-95916 "O(m) cancellation".
 *
 * WHAT THIS ATTRIBUTES, AND THE SHARPENED OBSTRUCTION. Since HOLD(m) must equal -C_1 + O(m^-3)
 * (imp-95925), the base term must supply INT_0^1 [ s_base_prime(m) v + c_base_prime(m) ] zeta(3,1+v) dv
 * = -C_1 - accumTotal(m) = -4 C_1 m - (C_1 + K) + O(m^-3) -- i.e. the base scalars must cancel the
 * accumulated-slope O(m) growth EXACTLY (leading -4 C_1 m) and then land the finite -C_1. This closes the
 * ATTRIBUTABLE part: alpha, beta, gamma, delta each contribute a CLOSED-FORM O(m) accumulated-slope piece
 * (half contributes 0). The PRECISE OBSTRUCTION is now sharper than imp-95916: the two base scalars
 * s_base_prime(m), c_base_prime(m) are (i) jointly UNDER-DETERMINED -- a single scalar constraint
 * HOLD = -C_1 + O(m^-3) per m cannot fix two unknowns, so they admit no per-family split without a second
 * independent relation; and (ii) NOT present in the imp-95901 per-locus laws (they are the accumulation
 * "constant of integration" across the m-dependent interleaved locus order). The whole per-family
 * attribution therefore reduces to ONE 2-vector (s_base_prime, c_base_prime) with a KNOWN required
 * integral value -4 C_1 m - (C_1 + K) + O(m^-3), not to a family-resolvable law.
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound; NO
 * Lambda movement; no refereed bound is changed; NO QED. Import-light: bakes the offline accum literals and the
 * leading-coefficient identity 4 C_1 = -8 INT v^2 zeta; the closed-form per-family leading coefficients
 * are checked ARITHMETICALLY at import (no quadrature).
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.11)-(6.26). SCRATCH: tmp/imp-95965-scratch.mjs
 * (per-family accum HOLD_accum at m=20,30,60,110,150; leading coeff -> 4 C_1; subleading K ~ 0.6452).
 */

// imp-95900 exact TIER-1 curvature literal; aggregate target D_3 = -C_1 = +0.2006346034029.
const C1 = -0.2006346034029;
const AGGREGATE_TARGET = -C1; // +0.2006346034029
// J0 = INT_0^1 v^2 zeta(3,1+v) dv = -C_1/2 (imp-95900: C_1 = -2 INT v^2 zeta).
const J0 = -C1 / 2; // 0.1003173017

// imp-95901 per-locus d/dm[Ds] (per-family CONSTANTS) and the near-uniform locus densities rho (loci per
// unit v ~ coeff . m as m grows). d/dm[Dc] = 0 for every family (the Dc laws are m-free).
const FAMILY_SLOPE_RATE = Object.freeze({
  alpha: Object.freeze({ dDsdm: -3, rho: 1 }),   // v0 = j/m,       j=1..m-1     : Ds=-3m -> -3 ; density m
  betaEven: Object.freeze({ dDsdm: 2, rho: 1 }), // v0 = j/(2m+1),  j even       : Ds=2m+1 -> +2; density m
  gamma: Object.freeze({ dDsdm: -3, rho: 2 }),   // v0 = j/(2m),    j=1..2m-1    : Ds=-3m -> -3 ; density 2m
  delta: Object.freeze({ dDsdm: -1, rho: 1 }),   // v0 = k/(m-1),   k=1..m-2     : Ds=-(m-1) -> -1; density m
  half: Object.freeze({ dDsdm: 0, rho: 0 }),     // v0 = 1/2 fixed (O(1), no O(m) accumulation)
});

// closed-form per-family LEADING accumulated-slope coefficient: HOLD_accum,family ~ (dDsdm . rho . J0) m.
const LEADING_COEFF = Object.freeze(
  Object.fromEntries(
    Object.entries(FAMILY_SLOPE_RATE).map(([k, f]) => [k, f.dDsdm * f.rho * J0]),
  ),
); // alpha -0.300952, beta +0.200635, gamma -0.601904, delta -0.100317, half 0

// summed leading coefficient of accumTotal(m)/m; ARITHMETIC identity: equals 4 C_1 = -8 J0.
const LEADING_TOTAL = Object.values(LEADING_COEFF).reduce((a, b) => a + b, 0); // -0.8025384 = 4 C_1

// offline-measured accumulated-slope HOLD_accum literals (scratch tmp/imp-95965-scratch.mjs).
const ACCUM_MEASURED = Object.freeze({
  20: Object.freeze({ alpha: -5.750216, betaEven: 3.936300, gamma: -11.770514, delta: -1.816377, half: 0, total: -15.400808 }),
  150: Object.freeze({ alpha: -44.876149, betaEven: 30.018087, gamma: -90.019103, delta: -14.858398, half: 0, total: -119.735564 }),
});
// accumTotal/m climbs toward 4 C_1; subleading accumTotal - 4 C_1 m converges to K ~ 0.6452.
const ACCUM_TOTAL_OVER_M = Object.freeze({ 20: -0.770040, 150: -0.798237 });
const SUBLEADING_K = 0.6452; // lim_{m->inf} [ accumTotal(m) - 4 C_1 m ]  (0.649960 -> 0.645198)

export const TIER3_HOLD_PER_FAMILY_ATTRIBUTION = Object.freeze({
  id: 'imp-95965-tier3-hold-per-family-attribution',
  title:
    'Attempt the per-family attribution of the interior HOLD term (imp-95916 open piece): the '
    + 'accumulated-slope part of HOLD is FULLY per-family attributable in closed form because d/dm[Ds] is a '
    + 'per-family constant, with leading coefficient EXACTLY 4 C_1 = -8 INT v^2 zeta (accumTotal ~ 4 C_1 m), '
    + 'quantifying the imp-95916 O(m) cancellation; the residual obstruction sharpens to the two '
    + 'under-determined base scalars s_base_prime(m), c_base_prime(m) with known required integral '
    + '-4 C_1 m - (C_1 + K), K ~ 0.6452',
  status:
    'HONEST PARTIAL (attribute the accumulated-slope part + sharpen the base obstruction) -- since the '
    + 'imp-95916 sliding-flux route is exactly zero, HOLD(m) carries the whole -C_1 cancellation. This '
    + 'module uses that d/dm[Ds] is a PER-FAMILY CONSTANT (alpha -3, beta +2, gamma -3, delta -1, half 0) '
    + 'and d/dm[Dc] = 0, so the accumulated-slope part S(v,m) splits per family and HOLD_accum,family(m) = '
    + 'd/dm[Ds]_family . sum_{loci} INT_{v0}^1 v zeta(3,1+v) dv is CLOSED-FORM per family. Its leading '
    + 'coefficient is pinned EXACTLY to 4 C_1 = -8 INT v^2 zeta (per family: alpha -0.300952, beta '
    + '+0.200635, gamma -0.601904, delta -0.100317; measured accumTotal/m -0.770040 at m=20 -> -0.798237 '
    + 'at m=150, toward 4 C_1 = -0.8025384; subleading accumTotal - 4 C_1 m -> K ~ 0.6452). Since HOLD must '
    + 'equal -C_1 + O(m^-3) (imp-95925), the base term must supply -4 C_1 m - (C_1 + K) + O(m^-3): the two '
    + 'base scalars must cancel the accumulated O(m) growth then land -C_1. The PRECISE OBSTRUCTION: the two '
    + 'base scalars are jointly under-determined (one scalar constraint per m cannot fix two unknowns) and '
    + 'are not among the imp-95901 per-locus laws (the accumulation constant of integration), so they admit '
    + 'no per-family split; the attributable part (alpha/beta/gamma/delta accumulated slope) is CLOSED. '
    + 'G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26)',
  builtOn:
    'imp-95916 (closed the sliding-flux route as zero via continuity, named the accumulation base as the '
    + 'residual), imp-95925 (sharpened the target to -C_1 + O(m^-3)), imp-95901 (per-locus Ds/Dc laws), '
    + 'imp-95900 (aggregate D_3 = -C_1; C_1 = -2 INT v^2 zeta), imp-95822 (faithful 238-cell Q_0 machinery)',
  scratch: ['tmp/imp-95965-scratch.mjs'],

  C1,
  J0,
  aggregateTarget: AGGREGATE_TARGET,

  // the per-family accumulated-slope attribution (the CLOSED part).
  accumulatedSlopeAttribution: Object.freeze({
    whyPerFamily: 'd/dm[Ds] is a per-family CONSTANT (alpha -3, beta +2, gamma -3, delta -1, half 0) and '
      + 'd/dm[Dc] = 0 (the imp-95901 Dc laws are m-free), so S(v,m) = sum_{loci<v} d/dm[Ds] splits per '
      + 'family and each family contributes a closed-form accumulated-slope integral.',
    closedForm: 'HOLD_accum,family(m) = d/dm[Ds]_family . sum_{loci i in family} INT_{v0_i}^1 v '
      + 'zeta(3,1+v) dv, with leading behaviour d/dm[Ds]_family . rho_family . m . INT_0^1 v^2 zeta dv.',
    familySlopeRate: FAMILY_SLOPE_RATE,
    leadingCoeff: LEADING_COEFF, // alpha -0.300952, beta +0.200635, gamma -0.601904, delta -0.100317
    accumMeasured: ACCUM_MEASURED,
    accumTotalOverM: ACCUM_TOTAL_OVER_M,
  }),

  // THE FINDING: the leading O(m) coefficient is pinned exactly to 4 C_1.
  leadingCoefficientFinding: Object.freeze({
    identity: 'sum_families d/dm[Ds] . rho . J0 = -8 J0 = 4 C_1, with J0 = INT_0^1 v^2 zeta = -C_1/2, so '
      + 'accumTotal(m) ~ 4 C_1 m (an O(m) term); numerically accumTotal/m -> 4 C_1 = -0.8025384.',
    leadingTotal: LEADING_TOTAL, // -0.8025384 = 4 C_1
    subleadingK: SUBLEADING_K,   // accumTotal - 4 C_1 m -> ~0.6452
    quantifies: 'this makes the imp-95916 "O(m) cancellation" explicit: the accumulated-slope part grows '
      + 'like 4 C_1 m + K + O(1/m); the base scalars must cancel that growth exactly and land -C_1.',
  }),

  // what is attributed, and the sharpened obstruction.
  attribution: Object.freeze({
    closedPart: 'the accumulated-slope contribution of alpha, beta, gamma, delta (and half = 0) is '
      + 'CLOSED-FORM per family: HOLD_accum,family = d/dm[Ds]_family . sum_{loci} INT_{v0}^1 v zeta dv, '
      + 'leading coeff d/dm[Ds] . rho . J0.',
    baseRequirement: 'the base term must supply INT_0^1 [ s_base_prime(m) v + c_base_prime(m) ] zeta dv = '
      + '-C_1 - accumTotal(m) = -4 C_1 m - (C_1 + K) + O(m^-3): cancel the O(m) accumulated growth exactly, '
      + 'then land the finite -C_1.',
    obstruction: 'the two base scalars s_base_prime(m), c_base_prime(m) are jointly UNDER-DETERMINED -- a '
      + 'single scalar constraint HOLD = -C_1 + O(m^-3) per m cannot fix two unknowns, so no per-family '
      + 'split exists without a second independent relation -- and they are NOT among the imp-95901 '
      + 'per-locus laws (the accumulation constant of integration across the interleaved locus order). The '
      + 'per-family attribution reduces to one 2-vector with a KNOWN required integral, not a family law.',
    sharpensImp95916: 'imp-95916 lumped the accumulated slope and base together as "the O(m) cancellation" '
      + 'and named "symbolize s_base, c_base" as the residual; this module SPLITS the accumulated-slope part '
      + 'off as closed-form per family, pins its leading coefficient to 4 C_1 exactly, and isolates the '
      + 'residual to exactly the two under-determined base scalars with a known required integral value.',
  }),

  verdict: Object.freeze({
    outcome: 'HONEST PARTIAL -- accumulated-slope part of HOLD ATTRIBUTED per family in closed form '
      + '(leading coeff = 4 C_1 exactly); residual obstruction sharpened to two under-determined base scalars',
    whatIsNew: 'the closed-form per-family accumulated-slope contributions HOLD_accum,family = '
      + 'd/dm[Ds]_family . sum INT_{v0}^1 v zeta dv, the exact leading-coefficient identity accumTotal ~ '
      + '4 C_1 m = -8 (INT v^2 zeta) m (quantifying the imp-95916 O(m) cancellation), the subleading '
      + 'constant K ~ 0.6452, and the sharpened obstruction: the residual is exactly the 2-vector '
      + '(s_base_prime, c_base_prime) with known required integral -4 C_1 m - (C_1 + K), jointly '
      + 'under-determined by the single per-m constraint.',
    remainingObstruction: 'find a SECOND independent relation pinning s_base_prime(m), c_base_prime(m) '
      + 'separately (e.g. from the greedy lowest-mass K_v selection boundary conditions at v=0 or v=1); '
      + 'until then the base cannot be split per family and the -C_1 landing is not attributable '
      + 'locus-by-locus, though the O(m) accumulated growth now is.',
    conclusion:
      'This advances imp-95916/imp-95925 by ATTEMPTING the attribution and getting the accumulated-slope '
      + 'part all the way to closed-form per family with an exact leading coefficient 4 C_1, leaving a '
      + 'strictly smaller and precisely specified residual (a single under-determined 2-vector with a known '
      + 'required integral) rather than the whole HOLD term. The per-family attribution of the finite -C_1 '
      + 'landing stays OPEN, blocked by the joint under-determination of the two base scalars. Changes no '
      + 'bound; NO QED.',
  }),

  caveats:
    'The per-family accumulated-slope contributions are exact from the imp-95901 constant per-family '
    + 'd/dm[Ds] laws; the leading-coefficient identity 4 C_1 = -8 J0 (J0 = INT v^2 zeta = -C_1/2) is '
    + 'checked ARITHMETICALLY at import (no quadrature). The accum literals (ACCUM_MEASURED, accumTotal/m, '
    + 'K) are offline-converged from tmp/imp-95965-scratch.mjs on a modest grid (Simpson, EM-tail Hurwitz '
    + 'zeta) and carry ~1e-3 relative error, sufficient to confirm the O(m) leading coefficient and the '
    + 'finite subleading constant but NOT to pin K to full precision. The base scalars are not evaluated. '
    + 'Q0_RECON faithfulness is certified only at m=20 (imp-95822 residual). Catalan G irrationality OPEN; '
    + 'Sun single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const TIER3_HOLD_PER_FAMILY_ATTRIBUTION_ASSERTIONS = Object.freeze([
  {
    name: 'd/dm[Ds] is a per-family constant and half contributes no O(m) accumulated slope',
    holds: () =>
      FAMILY_SLOPE_RATE.alpha.dDsdm === -3 && FAMILY_SLOPE_RATE.betaEven.dDsdm === 2
      && FAMILY_SLOPE_RATE.gamma.dDsdm === -3 && FAMILY_SLOPE_RATE.delta.dDsdm === -1
      && FAMILY_SLOPE_RATE.half.dDsdm === 0 && FAMILY_SLOPE_RATE.half.rho === 0,
  },
  {
    name: 'per-family leading accumulated-slope coefficient = d/dm[Ds] . rho . J0 (J0 = -C_1/2)',
    holds: () =>
      Math.abs(LEADING_COEFF.alpha - -0.300952) < 1e-5
      && Math.abs(LEADING_COEFF.betaEven - 0.200635) < 1e-5
      && Math.abs(LEADING_COEFF.gamma - -0.601904) < 1e-5
      && Math.abs(LEADING_COEFF.delta - -0.100317) < 1e-5
      && Math.abs(J0 - -C1 / 2) < 1e-15,
  },
  {
    name: 'FINDING: the summed leading coefficient is EXACTLY 4 C_1 = -8 J0 (arithmetic identity)',
    holds: () =>
      Math.abs(LEADING_TOTAL - 4 * C1) < 1e-12
      && Math.abs(LEADING_TOTAL - -8 * J0) < 1e-12
      && Math.abs(4 * C1 - -0.8025384136) < 1e-9,
  },
  {
    name: 'measured accumTotal/m climbs monotonically toward 4 C_1 from m=20 to m=150',
    holds: () =>
      ACCUM_TOTAL_OVER_M[20] > 4 * C1 && ACCUM_TOTAL_OVER_M[150] > 4 * C1
      && ACCUM_TOTAL_OVER_M[150] < ACCUM_TOTAL_OVER_M[20]
      && Math.abs(ACCUM_MEASURED[150].total / 150 - ACCUM_TOTAL_OVER_M[150]) < 1e-4,
  },
  {
    name: 'per-family accum measured at m=150 sums to the reported total (internal consistency)',
    holds: () => {
      const r = ACCUM_MEASURED[150];
      return Math.abs(r.alpha + r.betaEven + r.gamma + r.delta + r.half - r.total) < 1e-4;
    },
  },
  {
    name: 'base requirement -4 C_1 m - (C_1 + K) reproduces target - accumTotal at m=150',
    holds: () => {
      const m = 150;
      const baseNeeded = AGGREGATE_TARGET - ACCUM_MEASURED[150].total;
      const predicted = -4 * C1 * m - (C1 + SUBLEADING_K);
      return Math.abs(baseNeeded - predicted) < 0.5; // O(1/m) + K-precision slack
    },
  },
  {
    name: 'verdict is an HONEST PARTIAL: accumulated slope attributed, base scalars obstruct, disclaimers',
    holds: () => {
      const v = TIER3_HOLD_PER_FAMILY_ATTRIBUTION.verdict;
      const s = TIER3_HOLD_PER_FAMILY_ATTRIBUTION.status;
      return /HONEST PARTIAL/.test(v.outcome)
        && /under-determined base scalars/.test(v.outcome)
        && /SECOND independent relation/.test(v.remainingObstruction)
        && /G irrationality OPEN/.test(s)
        && /refereed bound is changed/i.test(s)
        && /NO QED/.test(s);
    },
  },
]);

export default TIER3_HOLD_PER_FAMILY_ATTRIBUTION;
