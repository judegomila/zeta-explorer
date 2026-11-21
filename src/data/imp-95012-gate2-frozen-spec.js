/**
 * imp-95012 — Frozen Gate-2 spec recovery from the committed paper source.
 *
 * Source: research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf
 * ("Permuting the Zeta Twin Ladder / Permutation Architecture, revised"), J. Gomila,
 * committed to research-inputs/ by this ticket. This module bakes the FROZEN
 * definitions of the Gate-2 lane so downstream evaluators (imp-95013 native scanner,
 * imp-95014 Arb audit, imp-95015 probe) share one auditable literal record and do not
 * re-transcribe constants from the PDF. This is spec transcription only: it derives no
 * bound and closes no gap (NO QED). No refereed bound is changed.
 *
 * ── eq. (8): the frozen active 0.14 row (Section 4.1) ──────────────────────────
 * The exact row under the positive-height barrier framework:
 *   t0 = 24727519 / 200000000 = 0.123637595
 *   y0 = 1809 / 10000        = 0.1809
 *   X  = 6000000185827  (verified zeta-zero height anchor; (1+y0)/2 verified to X/2)
 *   alpha = t0 + sqrt(1 - y0^2),  beta = sqrt(1 - 2 t0)
 *   t0 + y0^2 / 2 = 7/50 = 0.14   (the row target)
 *
 * ── eq. (10): the two-ladder coefficient vector ───────────────────────────────
 *   b_n = exp( (log n)^2 / 4 )
 * carried on the unsieved two-ladder approximant F_N; the same n carries both
 * ladders and the cross-chart gamma ratio (freeze the rung before splitting the
 * two summands, or the B-dual correlation is destroyed).
 *
 * ── eq. (11): the residual cocycle E97 ────────────────────────────────────────
 *   R97 = diagonal projection onto integers coprime to every prime p <= 97
 *   A97(x) = prod_{p <= 97} (1 - b_p p^{-sB(x)})
 *   MA = R97 - A97 * I
 *   E97(x) = L( MA(x) c(x) ),   L(c) = sum_n c_n
 * Every later packet, shell, carrier, and transform is a representation of this one
 * scalar object. The 25-factor A97 product uses the 25 primes p <= 97.
 *
 * ── eqs. (17)-(20): carrier remainder and the correlated-center target ─────────
 *   rho_m = 877 / (2^(m+1) (m+1)!)                                 (17)
 *   m = 17 shell/evaluation charge = 590221 / 61030685553249484800
 *                                  = 9.67088923628475e-15          (18)
 *   Rex (exact complete cocycle allowance) = 0.2796881955526244146123... (19)
 *   downward-rounded sufficient correlated-center target:
 *     |C_E,17| < 0.27968819555261474                               (20)
 *
 * ── anchor cell (the one closed positive-width source cell) ────────────────────
 *   N = 690988, |x - x*| <= 1/40000000000, |E97(x)| < 0.2141254901198318 < Rex
 *   reserve (documented) = 0.0655627054327926
 * The OPEN family that Gate-2 must cover uniformly:
 *   690988 <= N <= 54799999.
 * A uniform raw-tiling atlas at the anchor width would need > 7.20e26 cells, so raw
 * tiling is not a viable global architecture; the global |C_E,17| < 0.27968819555261474
 * over the family, every window parameter, and both seam sides remains open.
 */

// ── eq. (8) frozen row ─────────────────────────────────────────────────────────
export const GATE2_ROW = {
  equation: 8,
  t0: { num: 24727519, den: 200000000, value: 24727519 / 200000000 }, // 0.123637595
  y0: { num: 1809, den: 10000, value: 1809 / 10000 }, // 0.1809
  X: 6000000185827,
  rowTarget: { num: 7, den: 50, value: 7 / 50 }, // t0 + y0^2/2 = 0.14
  alphaFormula: 't0 + sqrt(1 - y0^2)',
  betaFormula: 'sqrt(1 - 2 t0)',
  heightHypothesis: '(1 + y0)/2 = 11809/20000 = 0.59045 (> 1/2) verified to X/2 by published zeta-zero verification (imp-95048: the 0.1399 row reuses the same verified HEIGHT X, not the literal 233/400; 233/400 = 0.5825 is the 0.1399 row y*=33/200 abscissa, distinct from this y0=0.1809 row)',
};

// ── eq. (10) two-ladder coefficient vector b_n = exp((log n)^2 / 4) ────────────
export function bCoefficient(n) {
  const ln = Math.log(n);
  return Math.exp((ln * ln) / 4);
}
// reference vector b_1..b_10 (b_1 = 1 exactly; growth is super-polynomial)
export const B_COEFFICIENTS_1_TO_10 = Array.from({ length: 10 }, (_, i) => bCoefficient(i + 1));

// ── eq. (11) residual cocycle E97 structural spec ──────────────────────────────
export const PRIMES_LE_97 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
]; // 25 primes -> the 25-factor A97 product
export const E97_SPEC = {
  equation: 11,
  R97: 'diagonal projection onto integers coprime to every prime p <= 97',
  A97: 'prod_{p <= 97} (1 - b_p p^{-sB(x)})   (25 factors)',
  MA: 'R97 - A97 * I',
  cocycle: 'E97(x) = L(MA(x) c(x)),  L(c) = sum_n c_n',
  primeCount: 25,
  sieveBoundPrime: 97,
};

// ── eqs. (17)-(20) carrier remainder + correlated-center target ────────────────
export const CARRIER_M = 17;
export function rhoM(m) {
  // rho_m = 877 / (2^(m+1) (m+1)!)
  let fact = 1;
  for (let k = 2; k <= m + 1; k++) fact *= k;
  return 877 / (Math.pow(2, m + 1) * fact);
}
export const GATE2_TARGETS = {
  shellChargeEq18: { num: 590221, den: 61030685553249484800, value: 590221 / 61030685553249484800 }, // 9.67088923628475e-15
  RexExact: 0.2796881955526244146123, // eq (19), exact complete cocycle allowance
  correlatedCenterTargetEq20: 0.27968819555261474, // eq (20), downward-rounded sufficient target
  anchor: {
    N: 690988,
    halfWidth: { num: 1, den: 40000000000, value: 1 / 40000000000 },
    E97Peak: 0.2141254901198318, // measured |E97|(690988) < target
    reserveDocumented: 0.0655627054327926,
  },
  openFamily: { Nmin: 690988, Nmax: 54799999 },
  rawTilingCellLowerBound: 7.2e26,
};

/**
 * The 0.1399-row dependency decision (Lemma 4.4 / Theorem 4.5, Section 4.10).
 *
 * DECISION: UNPARK the explicit-0.1399 row as an INDEPENDENT conditional audit
 * target; it does NOT presuppose the open Gate-2 family 690988 <= N <= 54799999.
 *
 * Reading. Theorem 4.5 (Conditional explicit 0.1399 program) puts y* = 33/200,
 * t* = 10103/80000, so t* + y*^2/2 = 1399/10000 = 0.1399, and reaches Lambda <= 0.1399
 * from TWO sharply delimited NEW hypotheses: (a) the rectangular slab (4.4)
 *   H_tau(u + iv) != 0 on [X, X+1] x [y*, 1] x [0, t*]
 * (Lemma 4.4 rectangular-slab inheritance supplies the intermediate wedge and the
 * short final join), and (b) a directed final-time-tail proof
 *   H_{t*}(x + iv) != 0 for x >= X+1, y* <= v <= sqrt(1 - 2 t*).
 * The initial condition reuses the SAME published zeta-zero verification as the 0.14
 * row ((1 + y*)/2 = 233/400 > 1/2, verified height exceeds X/2).
 *
 * Neither new hypothesis is certified by the project, so Theorem 4.5 is an exact
 * research target, not a reported improvement. Crucially it is NOT built on the
 * Gate-2 cocycle E97 or the open family: it TRADES the old single cocycle weld for a
 * larger compact slab plus one new final-time tail. The paper explicitly notes the
 * external larger-slab preprint [20] "is not an antecedent of Theorem 4.5 or of any
 * claimed project status" (audit target only). Therefore the 0.1399 row is
 * independent of the Gate-2 open-family question and should be tracked on its own
 * slab+tail lane, not eliminated with, nor blocked on, Gate-2.
 */
export const ROW_01399_DECISION = {
  disposition: 'UNPARK-INDEPENDENT',
  theorem: '4.5',
  lemma: '4.4',
  yStar: { num: 33, den: 200, value: 33 / 200 }, // 0.165
  tStar: { num: 10103, den: 80000, value: 10103 / 80000 },
  target: { num: 1399, den: 10000, value: 1399 / 10000 }, // 0.1399
  presupposesOpenFamily: false,
  newHypotheses: [
    'rectangular slab (4.4): H_tau != 0 on [X, X+1] x [y*, 1] x [0, t*]',
    'directed final-time tail: H_{t*}(x+iv) != 0 for x >= X+1, y* <= v <= sqrt(1 - 2 t*)',
  ],
  sharedInitialCondition: '(1 + y*)/2 = 233/400 verified to X/2 (same zeta-zero verification as the 0.14 row)',
  note: 'Trades the single Gate-2 cocycle weld for a larger compact slab plus one final-time tail; the external [20] larger-slab preprint is an audit target only, not an antecedent.',
};

export const IMP_95012_GATE2_FROZEN_SPEC = {
  id: 'imp-95012',
  title: 'Frozen Gate-2 spec (eqs. 8, 10, 11, 17-20, anchor) + 0.1399-row dependency decision',
  source: 'research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf',
  proofSection: 'gate2-producer MOVE 1 / K1',
  row: GATE2_ROW,
  cocycle: E97_SPEC,
  targets: GATE2_TARGETS,
  row01399: ROW_01399_DECISION,
  verdict:
    'Spec transcription only: bakes the frozen Gate-2 definitions from the committed ' +
    'paper source and records the 0.1399-row decision (independent conditional target, ' +
    'not presupposing the open family). Derives no bound; closes no gap; NO QED. ' +
    'No refereed bound is changed.',
};

// ── assertions (import-light; no heavy bundle) ─────────────────────────────────
export const IMP_95012_ASSERTIONS = [
  {
    id: 'imp-95012-row-target-is-014',
    holds: () => Math.abs(GATE2_ROW.t0.value + (GATE2_ROW.y0.value * GATE2_ROW.y0.value) / 2 - 0.14) < 1e-12,
    why: 'The frozen row (8) satisfies t0 + y0^2/2 = 7/50 = 0.14 exactly (0.123637595 + 0.1809^2/2).',
  },
  {
    id: 'imp-95012-b1-is-one',
    holds: () => Math.abs(bCoefficient(1) - 1) < 1e-15,
    why: 'The two-ladder coefficient b_n = exp((log n)^2/4) gives b_1 = exp(0) = 1 exactly.',
  },
  {
    id: 'imp-95012-25-primes-le-97',
    holds: () => PRIMES_LE_97.length === 25 && PRIMES_LE_97[24] === 97,
    why: 'The A97 product (11) has exactly 25 factors, one per prime p <= 97, the largest being 97.',
  },
  {
    id: 'imp-95012-shell-charge-eq18',
    holds: () => Math.abs(GATE2_TARGETS.shellChargeEq18.value - 9.67088923628475e-15) < 1e-24,
    why: 'The m=17 shell/evaluation charge (18) equals 590221/61030685553249484800 = 9.67088923628475e-15.',
  },
  {
    id: 'imp-95012-anchor-below-target-below-rex',
    holds: () =>
      GATE2_TARGETS.anchor.E97Peak < GATE2_TARGETS.correlatedCenterTargetEq20 &&
      GATE2_TARGETS.correlatedCenterTargetEq20 < GATE2_TARGETS.RexExact,
    why: 'The anchor peak 0.2141254901198318 sits below the downward-rounded target (20) 0.27968819555261474, which sits below the exact allowance Rex (19) 0.2796881955526244 -- the closed positive-width cell.',
  },
  {
    id: 'imp-95048-shared-initial-condition-arithmetic',
    holds: () =>
      Math.abs((1 + ROW_01399_DECISION.yStar.value) / 2 - 233 / 400) < 1e-15 &&
      Math.abs(233 / 400 - 0.5825) < 1e-15 &&
      Math.abs((1 + GATE2_ROW.y0.value) / 2 - 11809 / 20000) < 1e-15 &&
      (1 + ROW_01399_DECISION.yStar.value) / 2 > 0.5 &&
      (1 + GATE2_ROW.y0.value) / 2 > 0.5,
    why: 'imp-95048: y*=33/200 gives (1+y*)/2 = 233/400 = 0.5825 exactly (the 0.1399-row abscissa), while the 0.14 row y0=0.1809 gives (1+y0)/2 = 11809/20000 = 0.59045 -- distinct ratios, both > 1/2. The two rows share the verified HEIGHT X (6000000185827), not the literal 233/400; 233/400 (closer to the critical line 1/2) is the tighter case, so a verification to X/2 covering it a fortiori covers the 0.14 row.',
  },
  {
    id: 'imp-95012-01399-independent-of-open-family',
    holds: () =>
      ROW_01399_DECISION.presupposesOpenFamily === false &&
      Math.abs(ROW_01399_DECISION.tStar.value + (ROW_01399_DECISION.yStar.value ** 2) / 2 - 0.1399) < 1e-12,
    why: 'Theorem 4.5 reaches 0.1399 (t* + y*^2/2 = 1399/10000) from a larger slab plus a new final-time tail, not from the Gate-2 cocycle E97 or the open family 690988 <= N <= 54799999 -- an independent conditional target.',
  },
  {
    id: 'imp-95050-eq17-20-closed-form-reverify',
    holds: () => {
      // eq (17): rho_m = 877 / (2^(m+1) (m+1)!) at m=17, re-derived from the closed form
      let fact = 1;
      for (let k = 2; k <= CARRIER_M + 1; k++) fact *= k;
      const rho17 = 877 / (Math.pow(2, CARRIER_M + 1) * fact);
      const rho17ClosedFormOk =
        Math.abs(rhoM(CARRIER_M) - rho17) < 1e-30 && Math.abs(rho17 - 5.225389294223831e-19) < 1e-30;
      // eq (18): shell/evaluation charge, re-derived exactly from BigInt integers then scaled by 1e30
      const sc = GATE2_TARGETS.shellChargeEq18;
      const scValue = Number((590221n * 10n ** 30n) / 61030685553249484800n) / 1e30;
      const shellOk = Math.abs(scValue - 9.67088923628475e-15) < 1e-24 && Math.abs(scValue - sc.value) < 1e-24;
      // eq (17) is NOT eq (18): the carrier remainder rho_17 (5.2e-19) is 4 orders below the shell charge (9.7e-15)
      const eq17NotEq18 = rho17 < sc.value / 1000;
      // the shell charge (18), not rho_17, is the quantity that sits below R_NUM_BOUND = 9.671e-15 (imp-95007/95011)
      const shellBelowRnum = sc.value < 9.671e-15;
      // eqs (19)-(20): the downward-rounded target sits below the exact allowance Rex by about one r_num
      const targetBelowRex =
        GATE2_TARGETS.correlatedCenterTargetEq20 < GATE2_TARGETS.RexExact &&
        GATE2_TARGETS.RexExact - GATE2_TARGETS.correlatedCenterTargetEq20 < 1.0e-14;
      return rho17ClosedFormOk && shellOk && eq17NotEq18 && shellBelowRnum && targetBelowRex;
    },
    why: 'imp-95050: re-derives eqs (17)-(20) from their closed forms. eq (17) rho_17 = 877/(2^18 * 18!) = 5.225389294223831e-19 is the carrier remainder, DISTINCT from eq (18) -- the ticket premise that rho_17 evaluates to 9.6709e-15 conflates the two quantities. eq (18) shell/evaluation charge 590221/61030685553249484800 = 9.67088923628475e-15 (BigInt-exact) is the quantity that sits below R_NUM_BOUND = 9.671e-15. eq (20) target 0.27968819555261474 sits below eq (19) Rex 0.2796881955526244 by ~9.66e-15 (about one r_num), a downward-rounded sufficient center. Measure only; changes no bound; no refereed bound is changed.',
  },
];

export default IMP_95012_GATE2_FROZEN_SPEC;
