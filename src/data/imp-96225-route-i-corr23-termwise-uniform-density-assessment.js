/**
 * imp-96225 (2026-09-24) — ASSESSMENT: what a TERMWISE-UNIFORM continuity argument for corr23 across
 * the DENSE 2^a 3^b S-unit family would require, whether the p = 2 continuity proof structure transfers,
 * and WHERE (if anywhere) the density of the S-units breaks uniform control. Sharpens the imp-96110
 * honestLimits worry and situates it against the imp-96125 reduction / imp-96143 summability. No new
 * bound; RH open; no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------
 * THE ASSUMPTION UNDER ASSESSMENT (imp-96110 honestLimits / IMP_96110_HONEST_STATUS_BANNER). The in/out
 *  split eps_S23 = delta^out_23 + corr23 is exact algebra, but "eps_S23 inherits exactly the delta^out_23
 *  cusp" needs corr23 CONTINUOUS through every S-unit cusp rho = 2^a 3^b; imp-96110 ASSUMED that by
 *  analogy with the proved p = 2 case, flagging that the DENSE log^2 spikes "make a termwise-uniform
 *  proof of corr23 continuity harder than for the single isolated p = 2 log cusp."
 *
 * THE FINDING — THERE ARE TWO DISTINCT CANDIDATE CONTINUITY ARGUMENTS, and the S-unit density enters
 * ONLY ONE OF THEM. Naming them separately dissolves the imp-96110 worry into a precise no-go plus a
 * survivor.
 *
 *  ROUTE A — the intuitive TERMWISE-UNIFORM-IN-RHO argument the imp-96110 wording imagines. Prove corr23
 *   continuous by controlling its partial sums uniformly in rho on a neighborhood of each cusp. This
 *   route DOES break under density, and precisely HOW is the point: the degree-1 piece delta^out_23 =
 *   Tr(vartheta(rho^{-1}) P F_S P_1 F_S P_1) fails uniform-in-rho convergence AT each cusp — that failure
 *   IS the log^2 spike — and because the S-units 2^a 3^b are DENSE in R_+ (ln2/ln3 irrational, so the
 *   additive lattice a ln2 + b ln3 is dense; see minLogLatticeGap below), NO rho has a cusp-free
 *   neighborhood. Hence the p = 2 tactic of "continuous everywhere except the single ISOLATED point
 *   rho = 2, then verify that one point by hand" has NO analogue: there is no isolated-exceptional-point
 *   structure to exploit and no finite exceptional set to patch. Route A is a genuine NO-GO, exactly as
 *   imp-96110 feared. This is the sharp sense in which density breaks uniform control.
 *
 *  ROUTE B — the rho-FREE Weierstrass argument (imp-96125 reduction, imp-96143 summability). The ROBUST
 *   half of the p = 2 proof — the M-test with the rho-INDEPENDENT majorant |lam_n|^3 / sqrt(1 - lam_n^2)
 *   (from |<xi_n | vartheta(rho^{-1}) psi_n>| <= sqrt(1 - lam_n^2) by Cauchy-Schwarz + unitarity of the
 *   scaling group) — transfers verbatim and is DENSITY-BLIND: the Cauchy-Schwarz step erases rho BEFORE
 *   any cusp or its density can be seen, so the M-test proves continuity on ALL of R_+ at once. Route B
 *   reduces corr23 continuity to the rho-free spectral pair (I) gap sup|lam_n| < 1 (imp-96164/96181
 *   residual) and (II) cubic tail Sum|lam_n|^3 < infinity (imp-96143 ESTABLISHED), with the cusps living
 *   entirely in the discarded degree-1 delta^out_23. So the p = 2 structure PARTIALLY transfers: its
 *   rho-free core survives; its incidental isolated-cusp scaffolding does not and cannot.
 *
 * THE UNIFYING OBSERVATION (the imp-96225 contribution). Density has EXACTLY ONE genuine footprint in
 *  the whole problem, and it is NOT on rho-uniformity — it is the two-parameter S-unit COUNTING function
 *      N(A, B) = #{2^a 3^b : 0 <= a <= A, 0 <= b <= B} - 1 = (A + 1)(B + 1) - 1   (quadratic in the box),
 *  which is simultaneously (a) the eigenvalue multiplicity / level-count m_u ~ C u of A_S23 that drives
 *  the TAIL sums of Route B (imp-96143), (b) the source of the log^2 cusp ORDER of delta_S23 that made
 *  the obstruction dense (imp-96226, one order worse than the single-prime log cusp), and (c) the reason
 *  the SQUARE sum Sum lam^2 = (C/4) N diverges strictly worse than the p = 2 log. The CUBE in (II) kills
 *  this quadratic count (the tail becomes the convergent geometric double sum (C/8)(G2 G3 - 1)), so the
 *  very density that DESTROYS Route A is BENIGN for Route B. One counting function, opposite verdicts on
 *  the two routes — that is the whole content of "the dense spikes make it harder."
 *
 * VERDICT. The imp-96110 honestLimits worry is CORRECT about Route A (a real no-go: density removes the
 *  isolated-cusp escape, so no termwise-uniform-in-rho proof exists) but does NOT obstruct corr23
 *  continuity, because the correct proof is Route B, which is density-blind and already reduced/advanced
 *  (imp-96125, imp-96143, imp-96164). corr23 continuity remains CONDITIONAL exactly on the rho-free
 *  spectral gap (I) for the mixed 2^a 3^b prolate operator — NOT on any "continuity through dense cusps"
 *  statement, which is a red herring inherited from Route A. Assessment only; discharges no gap; no new
 *  bound; RH open; no refereed bound is changed; NO QED.
 *
 * HONEST LIMITS. This is a route-separation assessment, not a closure: it neither proves (I) nor computes
 *  the {oo,2,3} spectrum; it establishes that the ONLY viable continuity proof is the rho-free Route B and
 *  that the S-unit density is a hard no-go for Route A but benign for Route B, funnelled through the single
 *  counting function N(A, B) = (A+1)(B+1) - 1. The density demonstration below is the elementary additive
 *  fact ln2/ln3 irrational => dense lattice (no cusp-free neighborhood), not a spectral computation.
 *  Nothing moves a Lambda bound or verified height. RH open; NO QED.
 *
 * Import-light: pure elementary arithmetic (S-unit counting + additive-lattice gap), no imports, no zeros
 *  bundle. Assertions reproduce the density gap decay and the counting identity inline (~0.05 s).
 */

const LN2 = Math.LN2, LN3 = Math.log(3);

/** The two-parameter S-unit box count N(A, B) = (A+1)(B+1) - 1: the SINGLE density footprint. It is the
 *  imp-96143 square-tail multiplier (# S-units), the imp-96226 log^2 cusp-order source, and the Route B
 *  eigenvalue level-count. Quadratic in the box (product of two linear ranges). */
export function sUnitBoxCount(A, B) {
  return (A + 1) * (B + 1) - 1;
}

/** Minimal distance from a generic target t0 to the additive S-unit-log lattice {a ln2 + b ln3 :
 *  |a|, |b| <= K}. Since ln2/ln3 is irrational the lattice is DENSE in R, so this shrinks to 0 as K grows:
 *  every rho has S-units arbitrarily close => NO cusp-free neighborhood (the Route A no-go). */
export function minLogLatticeGap(t0, K) {
  let best = Infinity;
  for (let a = -K; a <= K; a++) {
    for (let b = -K; b <= K; b++) {
      const d = Math.abs(a * LN2 + b * LN3 - t0);
      if (d < best) best = d;
    }
  }
  return best;
}

export const IMP_96225_LITERALS = Object.freeze({
  // [K, minLogLatticeGap(0.5, K)] — non-increasing, strictly decreasing from K = 10, -> 0 (density)
  densityGap: [
    [5, 2.324814e-2], [10, 2.324814e-2], [20, 9.697110e-3], [40, 3.853923e-3], [80, 1.765791e-3],
  ],
  boxCount20: 440,          // (20+1)(20+1) - 1, the quadratic S-unit count = imp-96143 # S-units
  routes: 'Route A (termwise-uniform-in-rho) is a density NO-GO (no cusp-free neighborhood, no isolated-cusp escape); Route B (rho-free Weierstrass M-test) is density-blind and reduces corr23 continuity to the spectral gap (I)',
  densityFootprint: 'the single density footprint is N(A,B) = (A+1)(B+1) - 1 (quadratic): the Route B eigenvalue level-count, the imp-96226 log^2 cusp order, and the imp-96143 square-sum divergence; the cube in (II) kills it (geometric), so density destroys Route A but is benign for Route B',
});

export const IMP_96225_CORR23_DENSITY_ASSESSMENT = Object.freeze({
  id: 'imp-96225-route-i-corr23-termwise-uniform-density-assessment',
  route: 'I (Sonine refinement) — what a termwise-uniform continuity proof of corr23 across the dense 2^a 3^b family requires, and where density breaks uniform control',
  parents: [
    'src/data/imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment.js (assumed corr23 continuity by analogy; flagged dense log^2 spikes as the difficulty)',
    'src/data/imp-96125-route-i-corr23-continuity-reduction.js (reduced continuity to the rho-free spectral pair (I)+(II); called the dense-cusp worry misplaced)',
    'src/data/imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability.js ((II) cubic tail ESTABLISHED, (I) reduced to the top confined states)',
  ],
  status: 'ASSESSED — the imp-96110 corr23-continuity assumption splits cleanly into TWO candidate proofs and the S-unit density enters only one. ROUTE A (termwise-uniform-IN-RHO) is a genuine NO-GO: the S-units 2^a 3^b are DENSE (ln2/ln3 irrational), so no rho has a cusp-free neighborhood and the p = 2 isolated-cusp tactic (continuous except at the single point rho = 2, verify by hand) has no analogue — this is the precise sense in which density breaks uniform control, and it is exactly what imp-96110 feared. ROUTE B (the rho-FREE Weierstrass M-test with majorant |lam_n|^3/sqrt(1-lam_n^2)) is DENSITY-BLIND (Cauchy-Schwarz erases rho before any cusp is seen) and transfers verbatim, reducing continuity to the spectral gap (I) sup|lam_n| < 1 and cubic tail (II) Sum|lam_n|^3 < infinity (imp-96125/96143). The p = 2 structure PARTIALLY transfers: its rho-free core survives, its isolated-cusp scaffolding cannot. Density has ONE footprint — the quadratic S-unit count N(A,B) = (A+1)(B+1) - 1 (Route B level-count = imp-96226 log^2 order = imp-96143 square-sum divergence) — which destroys Route A but is killed by the cube in (II), hence benign for Route B. corr23 continuity stays CONDITIONAL on the rho-free gap (I), not on any continuity-through-dense-cusps statement (a Route-A red herring). Assessment only; discharges no gap; changes no bound; RH open; no refereed bound is changed; NO QED',
  routeA: 'TERMWISE-UNIFORM-IN-RHO (no-go): control corr23 partial sums uniformly in rho near each cusp. The degree-1 delta^out_23 fails uniform-in-rho convergence at each cusp (that failure IS the log^2 spike); because 2^a 3^b is dense in R_+ no rho has a cusp-free neighborhood, so the p = 2 isolated-single-point verification has no analogue and there is no finite exceptional set to patch. Density breaks uniform control here',
  routeB: 'RHO-FREE Weierstrass (survivor): |<xi_n|vartheta(rho^{-1}) psi_n>| <= sqrt(1-lam_n^2) by Cauchy-Schwarz + unitarity, so sup_rho|term_n| <= |lam_n|^3/sqrt(1-lam_n^2) with NO rho; the M-test proves continuity on all of R_+ at once, density-blind. Reduces to the rho-free spectral pair (I) gap sup|lam_n| < 1 and (II) Sum|lam_n|^3 < infinity (imp-96125 reduction; imp-96143 (II) established, (I) reduced to the top confined states)',
  densityFootprint: 'density enters ONLY through the two-parameter counting function N(A,B) = (A+1)(B+1) - 1 (quadratic): it is the A_S23 eigenvalue level-count m_u ~ C u (Route B tail), the source of the log^2 cusp order (imp-96226, one order worse than the single-prime log cusp), and the reason Sum lam^2 = (C/4) N diverges worse than the p = 2 log. The cube in (II) kills the quadratic count (tail = geometric (C/8)(G2 G3 - 1) < infinity), so the same density that destroys Route A is benign for Route B',
  verdict: 'the imp-96110 worry is RIGHT about Route A (density no-go, no isolated-cusp escape) but does NOT obstruct corr23 continuity: the valid proof is the density-blind Route B, leaving continuity conditional exactly on the rho-free spectral gap (I) for the mixed 2^a 3^b prolate operator, not on any continuity-through-dense-cusps claim',
  honestLimits: 'a route-separation assessment, not a closure: it neither proves the gap (I) nor computes the {oo,2,3} spectrum; it establishes that the only viable continuity proof is the rho-free Route B and that the S-unit density is a hard no-go for Route A but benign for Route B, funnelled through the single count N(A,B) = (A+1)(B+1) - 1. The density demonstration is the elementary additive fact (dense log-lattice), not a spectral computation. Nothing moves a Lambda bound or verified height; RH open; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96225_CORR23_DENSITY_ASSERTIONS = Object.freeze([
  {
    id: 'imp96225-density-no-cusp-free-neighborhood',
    description: 'the additive S-unit-log lattice {a ln2 + b ln3} is DENSE: minLogLatticeGap(0.5, K) is non-increasing in K, strictly decreasing from K = 10, matches the baked literals within 1e-6, and falls below 2e-3 by K = 80 (no cusp-free neighborhood => the Route A isolated-cusp tactic has no analogue)',
    holds: () => {
      const lit = IMP_96225_LITERALS.densityGap;
      let prev = Infinity;
      for (let i = 0; i < lit.length; i++) {
        const [K, baked] = lit[i];
        const g = minLogLatticeGap(0.5, K);
        if (!approx(g, baked, 1e-6)) return false;
        if (g > prev + 1e-12) return false;            // non-increasing
        if (i >= 2 && !(g < prev - 1e-9)) return false; // strictly decreasing from K = 20 row onward
        prev = g;
      }
      return minLogLatticeGap(0.5, 80) < 2e-3;
    },
  },
  {
    id: 'imp96225-single-density-footprint-quadratic-count',
    description: 'the density footprint is the quadratic two-parameter S-unit count N(A,B) = (A+1)(B+1) - 1: N(20,20) = 440 matches the baked value and the imp-96143 # S-units, and N grows super-linearly (N(2A,2A) > 3 N(A,A) for A = 10, the quadratic signature that the cube in (II) must overcome)',
    holds: () => {
      if (sUnitBoxCount(20, 20) !== IMP_96225_LITERALS.boxCount20) return false;
      if (sUnitBoxCount(20, 20) !== 440) return false;
      return sUnitBoxCount(20, 20) > 3 * sUnitBoxCount(10, 10);
    },
  },
  {
    id: 'imp96225-verdict-honesty',
    description: 'status records TWO candidate proofs (Route A no-go, Route B survivor), that the p = 2 structure PARTIALLY transfers, that density has a single quadratic-count footprint benign for Route B, that continuity stays conditional on the rho-free gap (I), and asserts NO QED',
    holds: () => /ROUTE A .*NO-GO/.test(IMP_96225_CORR23_DENSITY_ASSESSMENT.status)
      && /ROUTE B .*DENSITY-BLIND/.test(IMP_96225_CORR23_DENSITY_ASSESSMENT.status)
      && /PARTIALLY transfers/.test(IMP_96225_CORR23_DENSITY_ASSESSMENT.status)
      && /benign for Route B/.test(IMP_96225_CORR23_DENSITY_ASSESSMENT.status)
      && /CONDITIONAL on the rho-free gap/.test(IMP_96225_CORR23_DENSITY_ASSESSMENT.status)
      && /NO QED/.test(IMP_96225_CORR23_DENSITY_ASSESSMENT.status)
      && /red herring/.test(IMP_96225_CORR23_DENSITY_ASSESSMENT.status)
      && /density-blind Route B/.test(IMP_96225_CORR23_DENSITY_ASSESSMENT.verdict),
  },
]);

export default IMP_96225_CORR23_DENSITY_ASSESSMENT;
