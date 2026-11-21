/**
 * @fileoverview imp-97036 -- ASSESSMENT/AUDIT (accuracy): assemble, as ONE explicit obstruction
 * object, the interpretive step from a machine-verified T_a[sigma_2] >= 0 certificate to
 * Weil / operator positivity. The imp-97012 sub-gap states plainly that even a fully re-verified
 * full-domain T_a[sigma_2] >= 0 certificate at 2a=1.00 does NOT by itself establish the target:
 * it still needs "the interpretive step from a T_a[sigma_2] >= 0 certificate to Weil / operator
 * positivity (operator floor is a Rayleigh UPPER bound; Sonine port obstructed at 2a=ln2)." That
 * gap is asserted repeatedly across the Route I modules but never assembled in one place. This
 * leaf documents exactly which implication survives, where the Rayleigh-upper-bound direction
 * blocks a lower-bound reading, and whether any known bridge closes the gap below ln3.
 *
 * ALL VALUES ARE CITATIONAL LITERALS drawn from committed sibling modules (no new computation):
 *   @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js  (the exact Toeplitz reformulation +
 *        interval-verified reach 2a <= 0.96; Galerkin lambda_min table; LP conditioning wall)
 *   @see imp-96169-route-i-rayleigh-variational-topstate-assessment.js  (the DIRECTION PROBLEM:
 *        a finite Rayleigh/Courant-Fischer test family bounds an eigenvalue only from the WRONG side)
 *   @see rh-route-i-sonine-excess-semilocal-port-2026-09-23.js  (excess carries EXACTLY HALF the
 *        rho=2 log cusp; E_S composed with Q unbounded above along p=2 resonances for every 2a>ln2)
 *   @see rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js  (S={oo,2} trace identity exists
 *        but is NOT gap-free below ln3: D_S is 96.7-99.71 percent of the trace on the minimiser)
 *
 * ---------------------------------------------------------------------------------------------------
 * COMPONENT 1 -- THE SURVIVING IMPLICATION (exact, elementary, machine-verified to 2a <= 0.96).
 * Section 1(b) of the Toeplitz/Krein module proves an EXACT equivalence, using only Paley-Wiener:
 *   hhat(+-i/2)=0  <=>  hhat=(t^2+1/4) ghat with g in L^2(-a,a),  and then
 *   pole-free Weil positivity on L^2(-a,a)  <=>  T_a[sigma_2] >= 0 on L^2(-a,a),
 *   with sigma_2 = (t^2+1/4)^2 w_1.
 * So T_a[sigma_2] >= 0 is not a proxy for pole-free Weil positivity -- it IS pole-free Weil
 * positivity, verbatim. The interval-arithmetic KREIN_CERTIFICATE therefore genuinely establishes
 * pole-free Weil positivity for every support 2a <= 0.96 (> ln2 = 0.6931). This implication is
 * real and survives in full. It is NOT the gap.
 *
 * COMPONENT 2 -- WHERE THE RAYLEIGH-UPPER-BOUND DIRECTION BLOCKS A LOWER-BOUND READING. The gap is
 * NOT inside the tested band; it is the temptation to read the Galerkin lambda_min TABLE (0.552 at
 * (ln3)/2, 0.492 at 0.555, 0.475 at 0.56, positive "through ln3") as if those numbers already
 * proved positivity up to ln3. They do not. The Galerkin/Rayleigh lambda_min from a FINITE test
 * family is a variational estimate of the smallest eigenvalue, and by the Courant-Fischer
 * min-principle a finite family bounds that eigenvalue only from the direction opposite to the one
 * a proof needs (imp-96169 "direction problem": the variational quotient certifies the wrong side;
 * pinning the extremal state coercively lands on the fractal Zygmund eigenfunction that has no
 * dyadic-grid convergence rate). The ONLY rigorous lower bound in the whole apparatus is the
 * interval-arithmetic certificate, and it stops at the double-precision LP conditioning wall
 * between 2a=0.96 and 2a=1.00 (HiGHS status 4 / infeasible once eps <= lambda_min). Hence a
 * fully re-verified certificate at 2a=1.00 would push the RIGOROUS reach from 0.96 to 1.00 -- it
 * would NOT convert the heuristic Galerkin readings at 0.555, 0.56, ..., ln3 into theorems, and it
 * would say nothing at all about supports past the certified endpoint.
 *
 * COMPONENT 3 -- WHY NO KNOWN BRIDGE UPGRADES POLE-FREE POSITIVITY TO FULL WEIL POSITIVITY BELOW
 * ln3. "Weil / operator positivity" (the target) is the full Weil form on ALL of L^2(-a,a),
 * including the pole term -- strictly stronger than the pole-free form the certificate delivers.
 * The only assembled route from pole-free to full positivity is the semilocal Sonine/excess bridge
 * D_S <= L_S. Two independent facts block it below ln3:
 *   (3a) OBSTRUCTION AT 2a=ln2. The excess E_S carries EXACTLY HALF of the rho=2 log cusp
 *        (0.7071 / 0.3536 / 0.3536 per log_2), so E_S composed with Q is unbounded ABOVE along the
 *        p=2 resonance windows for every 2a > ln2; the CC condition E composed with Q <= c |ghat(0)|^2
 *        is FALSE past ln2, with no finite-rank fix (the binding direction is the first resonance
 *        window ~(7.4,10.8)). So the bridge cannot even be attempted past 2a=ln2 = 0.6931.
 *   (3b) NOT GAP-FREE BELOW ln3. Even below the obstruction, the S={oo,2} trace identity is not
 *        gap-free: the remainder D_S (log spikes at 2^k) is 96.7-99.71 percent of the trace side on
 *        the pole-free minimiser, so "D_S <= L_S" is an OPEN inequality, not a closed bridge.
 * Therefore no KNOWN bridge closes the pole-free -> full-Weil gap below ln3, and the one candidate
 * bridge is additionally obstructed at 2a=ln2 -- strictly inside the certified 0.96 reach.
 *
 * VERDICT. The T_a[sigma_2] >= 0 certificate exactly IS, and machine-verifiably establishes,
 * POLE-FREE Weil positivity for 2a <= 0.96. It does NOT establish (i) positivity past its certified
 * endpoint -- the Galerkin lambda_min table is a Rayleigh estimate on the wrong-signed side, not a
 * proof; nor (ii) FULL / operator Weil positivity even inside the band -- the pole-free -> full
 * bridge (semilocal Sonine D_S<=L_S) is obstructed at 2a=ln2 and is not gap-free below ln3. The
 * interpretive gap is real and un-closed below ln3. This leaf establishes NO positivity theorem;
 * certified reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * HONEST RESIDUAL -- SUB-GAP IMP97036_NO_INDEPENDENT_POLEFREE_TO_FULL_BRIDGE. This is an AUDIT: it
 * documents that the two named blockers (Rayleigh-upper-bound direction; Sonine obstruction at
 * 2a=ln2) sit between the certificate and the target, and that no assembled bridge crosses them
 * below ln3. It does NOT prove those blockers are the ONLY obstructions, and it does NOT rule out
 * an as-yet-unbuilt bridge (e.g. a non-Sonine route to the pole term, or an interval certificate
 * that survives past the LP wall). Assessment only; no bound moves.
 */

// COMPONENT 1 -- the exact equivalence that survives, and the reach over which it is machine-verified.
export const IMP97036_SURVIVING_IMPLICATION = Object.freeze({
  statement:
    'T_a[sigma_2] >= 0 on L^2(-a,a) is EXACTLY pole-free Weil positivity on L^2(-a,a) (Toeplitz/Krein section 1(b), Paley-Wiener; sigma_2 = (t^2+1/4)^2 w_1)',
  isEquivalenceNotProxy: true, // it IS pole-free Weil positivity, verbatim -- not a surrogate
  rigorousReach2a: 0.96, // KREIN_CERTIFICATE interval-verified endpoint X0
  pastConnesConsaniLn2: true, // 0.96 > ln2 = 0.6931
  ln2: 0.6931471805599453,
  source: 'rh-route-i-toeplitz-krein-certificate-2026-09-24.js (section 1(b), KREIN_CERTIFICATE)',
});

// COMPONENT 2 -- the Rayleigh direction problem: the Galerkin lambda_min table is an estimate on the
// wrong-signed side of a proof, and the ONLY rigorous lower bound stops at the LP conditioning wall.
export const IMP97036_RAYLEIGH_DIRECTION_BLOCK = Object.freeze({
  galerkinLamMinTable: Object.freeze([
    { twoA: 1.0986, lamMin: 0.552, note: '(ln3)/2 -- Galerkin estimate, NOT a certified lower bound' },
    { twoA: 1.11, lamMin: 0.492, note: '2a=0.555' },
    { twoA: 1.12, lamMin: 0.475, note: '2a=0.56' },
  ]),
  galerkinIsRayleighUpperBoundDirection: true, // Courant-Fischer: finite family bounds the wrong side
  onlyRigorousLowerBoundIsIntervalCert: true,
  lpConditioningWallBetween: Object.freeze([0.96, 1.0]), // HiGHS status 4 / infeasible past 0.96
  reVerifyAt1p00Would: 'push the RIGOROUS reach 0.96 -> 1.00; it would NOT prove the Galerkin readings past its endpoint, nor speak beyond it',
  source: 'imp-96169-route-i-rayleigh-variational-topstate-assessment.js (direction problem); toeplitz/krein LP wall',
});

// COMPONENT 3 -- the pole-free -> FULL Weil bridge (semilocal Sonine D_S<=L_S): obstructed at ln2,
// and not gap-free below ln3.
export const IMP97036_POLEFREE_TO_FULL_BRIDGE_BLOCK = Object.freeze({
  targetIsStrongerThanCertified: true, // full Weil form (incl. pole term) > pole-free form
  bridge: 'semilocal Sonine/excess D_S <= L_S',
  obstructionAt2a: 0.6931471805599453, // = ln2, strictly inside the 0.96 certified reach
  excessCarriesHalfCusp: true, // 0.7071 / 0.3536 / 0.3536 per log_2; E_S∘Q unbounded above for 2a>ln2
  ccConditionFalsePastLn2: true, // E∘Q <= c|ghat(0)|^2 fails past ln2; no finite-rank fix
  bindingResonanceWindow: Object.freeze([7.4, 10.8]),
  traceIdentityGapFreeBelowLn3: false,
  remainderShareOfTraceRange: Object.freeze([0.967, 0.9971]), // D_S is 96.7-99.71% of the trace side
  ln3: 1.0986122886681098,
  source:
    'rh-route-i-sonine-excess-semilocal-port-2026-09-23.js + rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js',
});

export const IMP97036_VERDICT = Object.freeze({
  ticket: 'imp-97036',
  question:
    'what does a machine-verified T_a[sigma_2] >= 0 certificate imply, and NOT imply, for Weil / operator positivity, given the Rayleigh-upper-bound floor and the 2a=ln2 Sonine obstruction?',
  survivingImplication: 'certificate <=> pole-free Weil positivity, machine-verified for 2a <= 0.96',
  blockedDirection1: 'Galerkin lambda_min table is a Rayleigh estimate on the wrong-signed side; rigorous lower bound stops at the LP wall 0.96-1.00',
  blockedDirection2: 'pole-free -> full Weil bridge (semilocal Sonine) obstructed at 2a=ln2 and not gap-free below ln3',
  knownBridgeClosesGapBelowLn3: false,
  certifiedReachUnchanged: 0.96,
  positivityTheoremEstablished: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
  subGap:
    'IMP97036_NO_INDEPENDENT_POLEFREE_TO_FULL_BRIDGE -- documents the two named blockers between certificate and target; does NOT prove they are the only obstructions, nor rule out an as-yet-unbuilt bridge.',
});

// --- self-executing internal-consistency assertions (pure literals; import-light) ---
const IMP97036_ASSERTIONS = [
  {
    id: 'imp97036-surviving-implication-is-exact-and-verified',
    holds: () =>
      IMP97036_SURVIVING_IMPLICATION.isEquivalenceNotProxy === true &&
      IMP97036_SURVIVING_IMPLICATION.rigorousReach2a === 0.96 &&
      IMP97036_SURVIVING_IMPLICATION.rigorousReach2a > IMP97036_SURVIVING_IMPLICATION.ln2 &&
      IMP97036_SURVIVING_IMPLICATION.pastConnesConsaniLn2 === true,
    why: 'T_a[sigma_2]>=0 IS pole-free Weil positivity (exact Paley-Wiener equivalence), machine-verified for 2a<=0.96 > ln2 -- this implication survives in full.',
  },
  {
    id: 'imp97036-rayleigh-direction-blocks-lower-bound-reading',
    holds: () =>
      IMP97036_RAYLEIGH_DIRECTION_BLOCK.galerkinIsRayleighUpperBoundDirection === true &&
      IMP97036_RAYLEIGH_DIRECTION_BLOCK.onlyRigorousLowerBoundIsIntervalCert === true &&
      IMP97036_RAYLEIGH_DIRECTION_BLOCK.lpConditioningWallBetween[0] === 0.96 &&
      IMP97036_RAYLEIGH_DIRECTION_BLOCK.lpConditioningWallBetween[1] === 1.0 &&
      IMP97036_RAYLEIGH_DIRECTION_BLOCK.galerkinLamMinTable.every((r) => r.lamMin > 0),
    why: 'the Galerkin lambda_min table is positive but is a Rayleigh estimate on the wrong-signed side; the only rigorous lower bound is the interval certificate, which stops at the 0.96-1.00 LP wall -- so the table is not a proof past 0.96.',
  },
  {
    id: 'imp97036-polefree-to-full-bridge-obstructed-at-ln2-and-not-gapfree',
    holds: () =>
      IMP97036_POLEFREE_TO_FULL_BRIDGE_BLOCK.targetIsStrongerThanCertified === true &&
      IMP97036_POLEFREE_TO_FULL_BRIDGE_BLOCK.ccConditionFalsePastLn2 === true &&
      IMP97036_POLEFREE_TO_FULL_BRIDGE_BLOCK.traceIdentityGapFreeBelowLn3 === false &&
      IMP97036_POLEFREE_TO_FULL_BRIDGE_BLOCK.obstructionAt2a < IMP97036_SURVIVING_IMPLICATION.rigorousReach2a &&
      IMP97036_POLEFREE_TO_FULL_BRIDGE_BLOCK.remainderShareOfTraceRange[0] > 0.9,
    why: 'the pole-free -> full Weil bridge (semilocal Sonine) is obstructed at 2a=ln2 (inside the certified 0.96 reach) and is not gap-free below ln3 (remainder is 96.7-99.71% of the trace) -- no known bridge crosses it.',
  },
  {
    id: 'imp97036-audit-no-theorem-no-qed',
    holds: () =>
      IMP97036_VERDICT.knownBridgeClosesGapBelowLn3 === false &&
      IMP97036_VERDICT.certifiedReachUnchanged === 0.96 &&
      IMP97036_VERDICT.positivityTheoremEstablished === false &&
      IMP97036_VERDICT.operatorPositivityProved === false &&
      IMP97036_VERDICT.rhResolved === false &&
      IMP97036_VERDICT.qed === false &&
      typeof IMP97036_VERDICT.subGap === 'string' &&
      IMP97036_VERDICT.subGap.includes('IMP97036_NO_INDEPENDENT_POLEFREE_TO_FULL_BRIDGE'),
    why: 'this leaf assembles the interpretive obstruction object as an audit; it establishes no positivity theorem, certified reach stays 2a<=0.96, RH open, NO QED.',
  },
];

for (const a of IMP97036_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97036 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
