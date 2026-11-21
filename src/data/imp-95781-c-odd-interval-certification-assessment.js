/**
 * @fileoverview imp-95781 — can the conditional second anchor c_odd(1/19) =
 * 0.006954762801108032 be interval-certified, or is it stuck as a double-precision
 * conditional value? imp-95768 finding (C) flagged that its trailing displayed digits move
 * for an offset error of only ~3.61e-10 (~2.57x the m=20 residual). This module assesses the
 * achievable interval half-width by decomposing the two legs that would enter a rigorous
 * interval-certified c_odd(1/19), and identifies which leg binds.
 *
 * SETUP. Under the imp-95720 offset hypothesis,
 *     c_odd(1/19) = (J_raw(1/19) + O) * rho2^2,   rho2 = 1/19,  O verified = 4 only at m=20.
 * An interval-certified c_odd(1/19) would need certified intervals for BOTH factors:
 *   (leg 1) a rigorous interval quadrature of J_raw(1/19) (the (6.21) v-integral over the
 *           faithful 238-cell partition, with certified Hurwitz-zeta tail enclosure), and
 *   (leg 2) a certified interval for the additive offset O AT m=19.
 * c_odd is affine in each: half-width w(c_odd) = (w_J(quad) + w_O) * rho2^2 to first order,
 * since d c_odd/dJ = d c_odd/dO = rho2^2 = 1/361 (imp-95768 slope).
 *
 * LEG 1 — QUADRATURE (achievable). imp-95720 reports the 8-point Gauss-Legendre grid on every
 * cell of B agrees with the exact piecewise-B evaluation to 1e-9, and the raw rho-signal
 * J_raw(1/19)-J_raw(1/20) = -2.85e-5 is stable across N = 4000/20000/60000 subintervals — i.e.
 * the quadrature floor is ~1e-9 in J, well below the signal. A rigorous interval quadrature
 * (certified Euler-Maclaurin Hurwitz-zeta tail + Gauss error bound) can therefore plausibly
 * reach w_J ~ 1e-9 in J, i.e. w_J * rho2^2 = 2.770e-12 in c_odd. This leg is NOT the
 * obstruction: it is a finite, achievable numerical target.
 *
 * LEG 2 — OFFSET (binding). The offset O is verified = 4 ONLY at m=20, with residual
 * |O_meas - 4| = 1.404e-10 there (imp-95720). Off m=20 — in particular at m=19 — O carries NO
 * certified interval at all: proving O is exactly 4 and m-independent is the imp-95720 named
 * sub-gap (the regularized -2/(n+v) telescoping constant of (6.17)->(6.21) absorbed by the
 * A_rho/t subtraction). So w_O at m=19 is not a small number to be tightened — it is UNBOUNDED
 * pending the derivation. If (hypothetically) O were certified at m=19 to the SAME tightness as
 * the m=20 pin (1.404e-10), the combined half-width would be
 *     (w_J + w_O) * rho2^2 = (1e-9 + 1.404e-10)/361 = 3.159e-12 in c_odd,
 * dominated by the quadrature leg (offset residual contributes only 3.889e-13). But that is a
 * CONDITIONAL floor, not achievable: the offset is uncertified off m=20.
 *
 * VERDICT. NO — c_odd(1/19) cannot be interval-certified with current inputs. The achievable
 * interval half-width from the quadrature leg alone would be ~2.77e-12 in c_odd (~1e-9 in J),
 * and even a hypothetical m=19 offset pinned as tightly as m=20 would give only ~3.16e-12 — but
 * the offset carries no certified interval at m=19, so the true attainable half-width is
 * UNBOUNDED until the imp-95720 telescoping constant is derived and shown m-independent. The
 * binding obstruction is the offset m-independence (a structural derivation), NOT the
 * quadrature (a finite numerical target). This is consistent with imp-95768 (C): the trailing
 * displayed digits are residual-limited precisely because the offset, not the quadrature, is
 * the uncertified factor. Assessment only; no new quadrature; conditional on the imp-95720
 * offset; changes no bound; Sun arXiv:2609.04176 single-author, unrefereed; Catalan G
 * irrationality OPEN; no refereed bound is changed; NO QED. NO heavy imports.
 */

// carried literals (imp-95720 / imp-95768)
const KAPPA = 2.5106978912403926; // certified anchor J(1/20), offset-free
const J_RAW_AT_1_OVER_19 = -1.4893306288; // faithful (6.21) machinery at rho2 = 1/19
const RHO2 = 1 / 19; // second-anchor modulus m2 = 19
const RHO2_SQ = RHO2 * RHO2; // 1/361, the shared affine slope d c_odd/dJ = d c_odd/dO
const OFFSET_EXACT = 4.0;

const C_ODD_COND = (J_RAW_AT_1_OVER_19 + OFFSET_EXACT) * RHO2_SQ; // 0.006954762801108032

// leg 1: quadrature. imp-95720 grid == exact-B to 1e-9; a rigorous interval quadrature target.
const QUAD_FLOOR_IN_J = 1e-9; // achievable interval half-width in J from certified quadrature
const QUAD_HALF_WIDTH_IN_C_ODD = QUAD_FLOOR_IN_J * RHO2_SQ; // 2.770e-12

// leg 2: offset. certified only at m=20 (residual 1.404e-10); UNCERTIFIED (unbounded) at m=19.
const OFFSET_M20_RESIDUAL = 1.403925864451594e-10; // |O_meas - 4| at m=20 (imp-95720)
const OFFSET_M20_HALF_WIDTH_IN_C_ODD = OFFSET_M20_RESIDUAL * RHO2_SQ; // 3.889e-13
const OFFSET_CERTIFIED_AT_M19 = false; // the imp-95720 sub-gap: no interval off m=20

// hypothetical combined floor IF the offset were certified at m=19 to the m=20 tightness.
const HYPO_COMBINED_IN_J = QUAD_FLOOR_IN_J + OFFSET_M20_RESIDUAL; // 1.140e-9
const HYPO_COMBINED_IN_C_ODD = HYPO_COMBINED_IN_J * RHO2_SQ; // 3.159e-12

export const C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT = Object.freeze({
  id: 'imp-95781-c-odd-interval-certification-assessment',
  title:
    'Interval-certifiability of the conditional second anchor c_odd(1/19)=0.006954762801108032: '
    + 'the quadrature leg is an achievable ~2.77e-12 half-width, but the offset leg is UNCERTIFIED '
    + '(unbounded) at m=19, so c_odd(1/19) cannot be interval-certified until the imp-95720 '
    + 'telescoping constant is derived m-independent',
  status:
    'ASSESSMENT — c_odd(1/19) = (J_raw(1/19)+O)*rho2^2 is affine in both factors with slope '
    + 'rho2^2 = 1/361, so an interval-certified value needs certified intervals for (leg 1) the '
    + '(6.21) quadrature of J_raw(1/19) and (leg 2) the offset O at m=19. LEG 1 is achievable: '
    + 'imp-95720 grid == exact-B to 1e-9 and the rho-signal is stable across N, so a rigorous '
    + 'interval quadrature can reach w_J ~ 1e-9 in J = 2.770e-12 in c_odd. LEG 2 BINDS: O is '
    + 'verified = 4 only at m=20 (residual 1.404e-10) and carries NO certified interval at m=19 '
    + '(the imp-95720 telescoping-constant sub-gap). A hypothetical m=19 offset pinned as tightly '
    + 'as m=20 would give a combined half-width 3.159e-12 (quadrature-dominated), but that is '
    + 'conditional, not achievable. VERDICT: NO interval-certified c_odd(1/19) with current inputs; '
    + 'the binding obstruction is the offset m-independence (a derivation), NOT the quadrature (a '
    + 'finite target). Assessment only; no new quadrature; changes no bound; Sun unrefereed; G '
    + 'irrationality OPEN; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'imp-95720 faithful (6.21) machinery + measured m=20 offset; imp-95768 finding (C) trailing-digit sensitivity',
  builtOn:
    'imp-95720 (238-cell Prop-6.3 re-implementation; conditional c_odd(1/19); named telescoping-constant '
    + 'sub-gap; grid == exact-B to 1e-9), imp-95768 (offset-error budget; c_odd trailing figures move at '
    + '~2.57x the m=20 residual)',

  conditionalValue: Object.freeze({
    cOddCond: C_ODD_COND, // 0.006954762801108032
    lawInFactors: 'c_odd(1/19) = (J_raw(1/19) + O) * rho2^2,  affine slope rho2^2 = 1/361 in both J and O',
    rho2Sq: RHO2_SQ,
  }),

  quadratureLeg: Object.freeze({
    achievable: true,
    gridEqualsExactB: '1e-9 (imp-95720); rho-signal -2.85e-5 stable across N = 4000/20000/60000',
    quadFloorInJ: QUAD_FLOOR_IN_J, // 1e-9
    quadHalfWidthInCOdd: QUAD_HALF_WIDTH_IN_C_ODD, // 2.770e-12
    reading:
      'a rigorous interval quadrature (certified Euler-Maclaurin Hurwitz-zeta tail + Gauss error) '
      + 'can reach ~1e-9 in J = 2.770e-12 in c_odd; this leg is a finite achievable numerical target, '
      + 'NOT the obstruction.',
  }),

  offsetLeg: Object.freeze({
    certifiedAtM19: OFFSET_CERTIFIED_AT_M19, // false
    offsetM20Residual: OFFSET_M20_RESIDUAL, // 1.404e-10 (only certified pin, at m=20)
    offsetM20HalfWidthInCOdd: OFFSET_M20_HALF_WIDTH_IN_C_ODD, // 3.889e-13
    subGap:
      'proving O = 4 exactly and m-independent (the regularized -2/(n+v) telescoping constant of '
      + '(6.17)->(6.21) absorbed by the A_rho/t subtraction) -- the imp-95720 named sub-gap. Off m=20, '
      + 'O carries no certified interval, so w_O at m=19 is unbounded pending this derivation.',
    reading:
      'the offset is the binding leg: it is a structural derivation, not a number to be tightened. '
      + 'Until it is derived m-independent, the attainable c_odd(1/19) interval half-width is unbounded.',
  }),

  hypotheticalFloor: Object.freeze({
    note: 'IF (counterfactually) O were certified at m=19 to the m=20 tightness (1.404e-10)',
    combinedInJ: HYPO_COMBINED_IN_J, // 1.140e-9
    combinedInCOdd: HYPO_COMBINED_IN_C_ODD, // 3.159e-12
    quadratureDominated: QUAD_HALF_WIDTH_IN_C_ODD > OFFSET_M20_HALF_WIDTH_IN_C_ODD, // true
    reading:
      'the conditional floor 3.159e-12 is quadrature-dominated (offset residual contributes only '
      + '3.889e-13), but it is conditional on an offset interval that does not exist at m=19.',
  }),

  verdict: Object.freeze({
    intervalCertifiable: false,
    bindingLeg: 'offset (m-independence derivation), NOT quadrature',
    achievableQuadratureHalfWidthInCOdd: QUAD_HALF_WIDTH_IN_C_ODD, // 2.770e-12
    conditionalCombinedHalfWidthInCOdd: HYPO_COMBINED_IN_C_ODD, // 3.159e-12
    conclusion:
      'c_odd(1/19) cannot be interval-certified with current inputs. The quadrature leg is an '
      + 'achievable ~2.770e-12 half-width in c_odd (~1e-9 in J), and even a hypothetical m=19 offset '
      + 'pinned as tightly as m=20 would give only ~3.159e-12 (quadrature-dominated) -- but the offset '
      + 'carries no certified interval at m=19, so the true attainable half-width is unbounded until the '
      + 'imp-95720 telescoping constant is derived and shown m-independent. The binding obstruction is '
      + 'the offset m-independence, not the quadrature. This matches imp-95768 (C): the trailing digits '
      + 'of c_odd(1/19) are residual-limited because the offset, not the quadrature, is the uncertified '
      + 'factor. It remains a double-precision conditional value, not a certified second anchor.',
  }),

  caveats:
    'Decomposes the interval-certification of c_odd(1/19) into its quadrature and offset legs using '
    + 'carried literals + arithmetic only; performs no new (6.21) quadrature and derives no telescoping '
    + 'constant. The quadrature half-width is an achievable target inferred from the imp-95720 grid == '
    + 'exact-B agreement, not a run interval bound. The whole analysis is CONDITIONAL on the offset '
    + 'hypothesis (verified only at m=20; imp-95720 sub-gap). Changes no bound; Catalan G irrationality '
    + 'OPEN; Sun single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    name: 'conditional c_odd(1/19) = (J_raw(1/19)+4)*rho2^2 = 0.006954762801108032',
    holds: () => Math.abs(C_ODD_COND - 0.006954762801108032) < 1e-18,
  },
  {
    name: 'affine slope d c_odd/dJ = d c_odd/dO = rho2^2 = 1/361',
    holds: () => Math.abs(RHO2_SQ - 1 / 361) < 1e-15,
  },
  {
    name: 'quadrature leg: achievable half-width ~1e-9 in J = 2.770e-12 in c_odd',
    holds: () =>
      Math.abs(QUAD_HALF_WIDTH_IN_C_ODD - 2.7700831024930747e-12) < 1e-20
      && C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT.quadratureLeg.achievable === true,
  },
  {
    name: 'offset leg: uncertified at m=19; m=20 residual half-width = 3.889e-13 in c_odd',
    holds: () =>
      C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT.offsetLeg.certifiedAtM19 === false
      && Math.abs(OFFSET_M20_HALF_WIDTH_IN_C_ODD - 3.8889913142703426e-13) < 1e-21,
  },
  {
    name: 'hypothetical combined floor 3.159e-12 in c_odd is quadrature-dominated',
    holds: () =>
      Math.abs(HYPO_COMBINED_IN_C_ODD - 3.158982233920109e-12) < 1e-20
      && C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT.hypotheticalFloor.quadratureDominated === true,
  },
  {
    name: 'verdict: NOT interval-certifiable; binding leg is the offset m-independence, not quadrature',
    holds: () =>
      C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT.verdict.intervalCertifiable === false
      && /offset/.test(C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT.verdict.bindingLeg),
  },
  {
    name: 'honest: assessment only, conditional on the offset, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /Assessment only/.test(C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT.status)
      && /G irrationality OPEN/.test(C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT.status)
      && /refereed bound is changed/i.test(C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT.status)
      && /NO QED/.test(C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT.status),
  },
]);

export default C_ODD_INTERVAL_CERTIFICATION_ASSESSMENT;
