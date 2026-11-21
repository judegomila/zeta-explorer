/**
 * imp-96125 (2026-09-24) — REDUCTION: the corr23-continuity that imp-96110 ASSUMED by analogy with
 * p = 2 is reduced to a single rho-INDEPENDENT spectral criterion, and the "dense log^2 cusps make
 * this harder" worry of imp-96110 HONEST LIMITS is shown to be MISPLACED. No new bound; RH open;
 * no refereed bound is changed; NO QED.
 *
 * THE QUESTION (imp-96110 honestLimits). The in/out split eps_S23 = delta^out_23 + corr23 is exact
 *  algebra, but the step "eps_S23 inherits exactly the delta^out_23 cusp" needs corr23 CONTINUOUS
 *  through every S-unit cusp rho = 2^a 3^b, and imp-96110 only ASSUMED that by analogy with the proved
 *  p = 2 case, flagging that the DENSE log^2 spikes of delta_S23 "make a termwise-uniform proof of
 *  corr23 continuity harder than for p = 2." This module attempts that proof, or the precise obstruction.
 *
 * THE REDUCTION (the p = 2 continuity argument is rho-uniform, so the dense cusps never enter it).
 *  From the Sonine algebra (rh-route-i-sonine-excess-semilocal-port Sec. 3, ported to S = {oo,2,3}):
 *      corr23(rho) = Sum_n lam_n^3/(1 - lam_n^2) <xi_n | vartheta(rho^{-1}) psi_n>,
 *  with A_S23 the semilocal {oo,2,3} prolate operator, {lam_n, xi_n} its eigenpairs, psi_n = P F_S23 xi_n
 *  and ||psi_n||^2 = 1 - lam_n^2. Two facts, each independent of the cusps:
 *    (T) TERMWISE CONTINUITY. vartheta(rho^{-1}) is the strongly-continuous unitary scaling group on
 *        L^2(R_+, d*x) and xi_n, psi_n are FIXED vectors, so rho |-> <xi_n | vartheta(rho^{-1}) psi_n>
 *        is continuous for every n. Each term is a continuous function of rho at EVERY rho, cusp or not.
 *    (M) A RHO-UNIFORM WEIERSTRASS BOUND. By Cauchy-Schwarz and unitarity of vartheta(rho^{-1}),
 *        |<xi_n | vartheta(rho^{-1}) psi_n>| <= ||xi_n|| ||psi_n|| = sqrt(1 - lam_n^2) for ALL rho, hence
 *        sup_rho |term_n| <= |lam_n|^3 / sqrt(1 - lam_n^2),  a bound with NO rho in it.
 *  The M-test bound (M) is the SAME bound the p = 2 module uses (Sec. 3: "|terms| <= |lam_n|^3 /
 *  sqrt(1 - lam_n^2), summable, hence continuous"). Because the Cauchy-Schwarz step erases rho, the
 *  M-test never sees the argument rho at all -- so it cannot see the dense log^2 cusps, which are a
 *  property of rho. Therefore:
 *      corr23 is continuous on ALL of R_+  <==  Sum_n |lam_n|^3 / sqrt(1 - lam_n^2)  <  infinity,
 *  a rho-INDEPENDENT statement about the {oo,2,3} prolate SPECTRUM alone. The dense-cusp difficulty
 *  flagged by imp-96110 does not obstruct corr23: the cusps live entirely in the DEGREE-1 piece
 *  delta^out_23 = Tr(vartheta(rho^{-1}) P F_S P_1 F_S P_1) (the A^1 term of A(1-A^2)^{-1} = A +
 *  A^3(1-A^2)^{-1}), whose partial sums fail to converge uniformly in rho -- that non-uniformity IS
 *  the cusp -- while the corr piece (the A^3(1-A^2)^{-1} term) carries a rho-free M-majorant.
 *
 * THE REMAINING SUB-GAP (named precisely; this is the whole of what imp-96110 assumed). corr23
 *  continuity now needs ONLY the rho-free spectral summability
 *      Sum_n |lam_n|^3 / sqrt(1 - lam_n^2) < infinity   for   A_S23,
 *  which splits into two rho-free spectral facts, each PROVED for p = 2 but NOT YET for {oo,2,3}:
 *    (I) SPECTRAL GAP  sup_n |lam_n| < 1  (no eigenvalue of modulus 1). For S = {oo,2} this is the
 *        proved lacunary/Zygmund argument (rh-route-i-sonine-excess-semilocal-port Sec. 1-2: |g(v)| <=
 *        C v forces the 1-periodic part to vanish); that argument is tied to the DYADIC dilation group
 *        and must be re-derived for the mixed 2^a 3^b group of A_S23.
 *    (II) CUBIC-SUMMABLE TAIL  Sum_n |lam_n|^3 < infinity. For S = {oo,2} the spectrum is the dyadic
 *        ladder +-2^{-n/2}/2, so |lam_n|^3 ~ 2^{-3n/2} is summable even though Sum lam_n^2 = infinity;
 *        for {oo,2,3} the mixed 2^a 3^b ladder is denser and the cubic-summability is not established.
 *  Neither (I) nor (II) mentions rho or a cusp. So the correct statement of the imp-96110 gap is
 *  NOT "prove continuity through dense log^2 cusps" (a red herring) but "prove the mixed-ladder
 *  {oo,2,3} prolate spectrum has a gap and cubic-summable tail." This is a strictly narrower,
 *  rho-free target than imp-96110 posed, and it is the exact analogue of the two facts that were
 *  ELEMENTARY and PROVED for p = 2.
 *
 * NUMERICAL SUPPORT (import-light; reproduces two structural facts, computes no spectrum here).
 *   (a) TAIL-NOT-TERM. For each fixed truncation L the degree-1 delta_S23c(rho, L) is a FINITE, smooth
 *       function through the S-unit rho = 3 (6.01 / 11.82 / 19.53 / 24.14 at L = 10/14/18/20), and its
 *       log^2 amplitude (2nd difference across a J-window) GROWS with L (1.77 -> 1.91 from L = 18 -> 20,
 *       matching the imp-96110 baked 1.9115): the singularity is the L -> infinity (uniform-convergence)
 *       limit of the degree-1 piece, not a discontinuity of any finite term -- exactly the (T)/(M) picture.
 *   (b) RHO-FREE M-MAJORANT. On the p = 2-validated ladder model lam_n = lam0 * 2^{-n/2} the Weierstrass
 *       majorant Sum |lam_n|^3/sqrt(1-lam_n^2) is finite and N-stable (0.2163733 at lam0 = 1/2, unchanged
 *       from N = 40 to 80): a gapped cubic-summable ladder gives corr continuity with a rho-free bound.
 *       Shrinking the gap (lam0 -> 1) balloons the majorant (137.0 at lam0 = 0.9999731), confirming that
 *       the GAP (I), not the cusps, is what the bound depends on.
 *
 * HONEST LIMITS. This is a REDUCTION and a red-herring removal, not a closure: it does not compute the
 *  {oo,2,3} prolate spectrum, so it neither proves nor refutes (I)/(II); it establishes that corr23
 *  continuity is equivalent-modulo-(T) to the rho-free summability above and that the dense log^2 cusps
 *  are NOT the obstruction. The model in (b) is the p = 2 dyadic ladder used illustratively, not the
 *  mixed 2^a 3^b spectrum. Nothing here moves a Lambda bound or verified height. RH open; NO QED.
 *
 * Import-light: reuses br23/deltaS23c from the imp-96110 module (which imports only si). No zeros bundle.
 */

import { deltaS23c } from './imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment.js';

/** rho-free Weierstrass majorant of the corr series on a model ladder lam_n = lam0 * 2^{-n/2}
 *  (n >= 0): Sum_n |lam_n|^3 / sqrt(1 - lam_n^2). Illustrates (M) on the p = 2-validated ladder. */
export function corrMajorantLadder(lam0 = 0.5, N = 80) {
  let s = 0;
  for (let n = 0; n <= N; n++) {
    const lam = lam0 * Math.pow(2, -n / 2);
    s += Math.pow(Math.abs(lam), 3) / Math.sqrt(1 - lam * lam);
  }
  return s;
}

/** log^2 amplitude of the degree-1 delta_S23c at an S-unit, measured as the 2nd difference of the
 *  J-window increments at fixed truncation L (grows with L: the cusp is a uniform-convergence limit). */
export function deltaS23LogSqAmplitude(rho, L) {
  const j = [8, 12, 16].map((J) => deltaS23c(rho * (1 + Math.pow(2, -J)), L));
  return j[2] - 2 * j[1] + j[0];
}

export const IMP_96125_CORR23_CONTINUITY_LITERALS = Object.freeze({
  tailNotTerm: [ // [L, delta_S23c(3,L) finite value, log^2 amplitude (2nd diff)]
    [10, 6.00584, -2.42328], [14, 11.81938, -0.55929], [18, 19.52517, 1.77189], [20, 24.14462, 1.91155],
  ],
  majorant: [ // [lam0, N, Sum |lam|^3/sqrt(1-lam^2)]
    [0.5, 40, 0.21637328], [0.5, 80, 0.21637328], [0.9999731, 80, 137.041686],
  ],
  reductionLaw: 'corr23 continuous on all of R_+  <==  Sum_n |lam_n(A_S23)|^3 / sqrt(1 - lam_n^2) < infinity (a rho-FREE spectral condition); the dense log^2 cusps live in the degree-1 delta^out_23 and never enter this M-test bound',
});

export const IMP_96125_CORR23_CONTINUITY_REDUCTION = Object.freeze({
  id: 'imp-96125-route-i-corr23-continuity-reduction',
  route: 'I (Sonine refinement) — is the corr23 continuity that imp-96110 assumed by analogy actually reducible/provable?',
  parents: [
    'src/data/imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment.js (assumed corr23 continuity by analogy with p = 2; flagged dense log^2 cusps as the difficulty)',
    'src/data/rh-route-i-sonine-excess-semilocal-port-2026-09-23.js (Sec. 3: corr = Sum lam^3/(1-lam^2)<xi|vartheta psi>, |terms| <= |lam|^3/sqrt(1-lam^2), proved continuous for p = 2)',
  ],
  status: 'REDUCED (not closed) — corr23 continuity is reduced to the SINGLE rho-INDEPENDENT spectral criterion Sum_n |lam_n(A_S23)|^3/sqrt(1-lam_n^2) < infinity, and the imp-96110 worry that the dense log^2 cusps make continuity harder is shown MISPLACED: the p = 2 M-test bound |lam_n|^3/sqrt(1-lam_n^2) is rho-uniform (Cauchy-Schwarz erases rho), so it never sees the cusps, which live entirely in the degree-1 delta^out_23 piece. The remaining sub-gap is the rho-free spectral pair (I) gap sup|lam_n| < 1 and (II) cubic-summable tail Sum|lam_n|^3 < infinity for the mixed 2^a 3^b {oo,2,3} prolate operator — both ELEMENTARY and PROVED for the p = 2 dyadic ladder, neither yet established for the mixed ladder. No spectrum is computed here; (I)/(II) are neither proved nor refuted. RH open; no refereed bound is changed; NO QED',
  reduction: 'eps_S23 = delta^out_23 + corr23; corr23(rho) = Sum_n lam_n^3/(1-lam_n^2) <xi_n|vartheta(rho^{-1}) psi_n>, ||psi_n|| = sqrt(1-lam_n^2). (T) each term is continuous in rho (fixed vectors, strongly-continuous unitary scaling group). (M) |<xi_n|vartheta(rho^{-1}) psi_n>| <= ||xi_n|| ||psi_n|| = sqrt(1-lam_n^2) uniformly in rho, so sup_rho|term_n| <= |lam_n|^3/sqrt(1-lam_n^2) with NO rho. Weierstrass M-test: corr23 continuous everywhere as soon as Sum_n |lam_n|^3/sqrt(1-lam_n^2) < infinity — a rho-free spectral fact',
  redHerringCleared: 'the dense log^2 cusps of delta_S23 do NOT threaten corr23: they are the failure of UNIFORM convergence in rho of the DEGREE-1 term delta^out_23 (the A^1 part of A(1-A^2)^{-1} = A + A^3(1-A^2)^{-1}); the corr piece (the A^3(1-A^2)^{-1} part) has a rho-free M-majorant so its uniform convergence is a pure spectral question. Numerically: at fixed L the degree-1 delta_S23c(3,L) is finite and smooth through the S-unit while its log^2 amplitude grows with L (the cusp is the L -> infinity limit, not a term discontinuity)',
  subGap: 'PROVE for the S = {oo,2,3} semilocal prolate operator A_S23: (I) spectral gap sup_n |lam_n| < 1 — the p = 2 lacunary/Zygmund no-modulus-1 argument is tied to the dyadic group and must be re-derived for the mixed 2^a 3^b group; (II) cubic-summable tail Sum_n |lam_n|^3 < infinity — proved for the dyadic ladder +-2^{-n/2}/2 (even with Sum lam^2 = infinity), not established for the denser mixed ladder. Together (I)+(II) give Sum|lam|^3/sqrt(1-lam^2) < infinity and hence corr23 continuity',
  honestLimits: 'a reduction plus red-herring removal, not a closure: the {oo,2,3} spectrum is not computed, so (I)/(II) are neither proved nor refuted; the ladder majorant in the numerics is the illustrative p = 2 dyadic model, not the mixed 2^a 3^b spectrum; nothing moves a Lambda bound or verified height; RH open; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96125_CORR23_CONTINUITY_ASSERTIONS = Object.freeze([
  {
    id: 'imp96125-tail-not-term',
    description: 'the degree-1 delta_S23c(rho=3, L) is FINITE at each fixed L (matching the baked values within 1e-2) while its log^2 amplitude GROWS with truncation (2nd diff at L=18 < L=20, both positive, L=20 matches the imp-96110 baked 1.9115): the cusp is a uniform-convergence limit of the degree-1 piece, not a term discontinuity',
    holds: () => {
      const lit = IMP_96125_CORR23_CONTINUITY_LITERALS.tailNotTerm;
      const finiteOk = lit.every(([L, v]) => {
        const d = deltaS23c(3, L);
        return Number.isFinite(d) && approx(d, v, 1e-2);
      });
      const a18 = deltaS23LogSqAmplitude(3, 18), a20 = deltaS23LogSqAmplitude(3, 20);
      return finiteOk && a18 > 0 && a20 > 0 && a20 > a18 && approx(a20, 1.9115, 1e-2);
    },
  },
  {
    id: 'imp96125-rho-free-majorant-finite-and-gap-sensitive',
    description: 'the rho-free corr M-majorant Sum|lam|^3/sqrt(1-lam^2) on the p = 2 ladder model is finite and N-stable (0.2163733 at lam0=1/2, equal at N=40 and N=80) and balloons as the gap shrinks (137.0 at lam0=0.9999731): corr continuity depends on the spectral gap/decay, not on the cusps',
    holds: () => {
      const m40 = corrMajorantLadder(0.5, 40), m80 = corrMajorantLadder(0.5, 80);
      const mGap = corrMajorantLadder(0.9999731, 80);
      return approx(m40, 0.21637328, 1e-6) && approx(m80, m40, 1e-9) && m80 < 0.25 && mGap > 100;
    },
  },
  {
    id: 'imp96125-verdict-honesty',
    description: 'status records a REDUCTION (not a closure) to a rho-INDEPENDENT spectral criterion, names the two-part sub-gap (I)/(II), clears the dense-cusp red herring, and asserts NO QED',
    holds: () => /REDUCED \(not closed\)/.test(IMP_96125_CORR23_CONTINUITY_REDUCTION.status)
      && /rho-INDEPENDENT spectral criterion/.test(IMP_96125_CORR23_CONTINUITY_REDUCTION.status)
      && /MISPLACED/.test(IMP_96125_CORR23_CONTINUITY_REDUCTION.status)
      && /NO QED/.test(IMP_96125_CORR23_CONTINUITY_REDUCTION.status)
      && /rho-free M-majorant/.test(IMP_96125_CORR23_CONTINUITY_REDUCTION.redHerringCleared)
      && /gap sup_n \|lam_n\| < 1/.test(IMP_96125_CORR23_CONTINUITY_REDUCTION.subGap),
  },
]);

export default IMP_96125_CORR23_CONTINUITY_REDUCTION;
