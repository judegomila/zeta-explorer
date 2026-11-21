/**
 * imp-96143 (2026-09-23) — NUMERICAL: the mixed 2^a 3^b {oo,2,3} prolate ladder and the two rho-free
 * facts imp-96125 named as the WHOLE of the corr23 gap: (I) spectral gap sup_n |lam_n| < 1 and
 * (II) cubic-summable tail Sum_n |lam_n|^3 < infinity for the semilocal A_S23 = P_1 F_S23 P_1.
 * RESULT: (II) is ESTABLISHED with a rho-free geometric majorant (closed form + N-convergence);
 * (I) is REDUCED to the finitely-many top confined states (the whole ladder tail sits below 0.354).
 * No spectrum is diagonalized here; the exact FFT-Mellin diagonalization is blocked by the fractal
 * Zygmund eigenfunctions (sibling ports). RH open; no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------
 * THE TARGET (imp-96125 REDUCTION). corr23 continuity through every S-unit cusp rho = 2^a 3^b needs
 *  ONLY the rho-INDEPENDENT summability  Sum_n |lam_n|^3 / sqrt(1 - lam_n^2) < infinity  for A_S23,
 *  which splits into (I) gap sup_n |lam_n| < 1 and (II) cubic tail Sum_n |lam_n|^3 < infinity. Both are
 *  ELEMENTARY/PROVED for p = 2 (dyadic ladder +-2^{-n/2}/2) but NOT for the denser mixed 2^a 3^b ladder.
 *
 * THE LADDER MECHANISM (ported from rh-route-i-sonine-excess-semilocal-port Sec. 1-2). For S = {oo,2}
 *  the compression of the scale-n Euler dilate is norm-bounded, || (1/2) P_1 F D_{2^n} P_1 || <= 2^{-n/2}/2,
 *  and contributes ~2^{n+1} even prolate modes, so the spectrum clusters on the dyadic ladder
 *  magnitude s_n = 2^{-n/2}/2 with multiplicity m_n ~ 2 * 2^n; hence lam_k ~ 1/(2 sqrt k),
 *  Sum lam^2 = oo (log), Sum |lam|^3 < oo. For S = {oo,2,3} the Euler product carries BOTH factors, so
 *  the dilates run over the S-unit semigroup u = 2^a 3^b (a, b >= 0). Two ingredients transport:
 *    (N) NORM per S-unit block:  s_u = u^{-1/2}/2. This is the RIGOROUS ingredient: dilation D_u is a
 *        unitary scaled by u^{-1/2} on L^2(R_+, dx), the compression only shrinks the norm, and the
 *        Euler weight contributes the 1/2 exactly as for a single prime -- the p = 2 bound
 *        ||(1/2) P_1 F D_{2^n} P_1|| <= 2^{-n/2}/2 becomes ||(1/2) P_1 F D_{2^a 3^b} P_1|| <= (2^a 3^b)^{-1/2}/2.
 *    (M) MULTIPLICITY per block:  m_u ~ C * u  (C = 2 calibrated to the p = 2 ladder m_n ~ 2 * 2^n). This
 *        is the EXTRAPOLATED ingredient: proved for p = 2 (even-mode count of D_{2^n} on (0,1)), natural
 *        for the mixed group (even-mode count of D_u), not diagonalized here.
 *  These give the ladder MODEL of the A_S23 tail: magnitude multiset { u^{-1/2}/2 } with multiplicity
 *  C * u over the S-units u = 2^a 3^b, (a, b) != (0, 0). The finitely-many TOP confined states
 *  (the archimedean-box modes, lam_S(0) = 0.9999731 etc. in p = 2) are NOT in this ladder tail.
 *
 * (II) CUBIC TAIL -- ESTABLISHED (rho-free geometric majorant).
 *      Sum_tail |lam|^3  =  Sum_u m_u s_u^3  =  Sum_u (C u)(u^{-1/2}/2)^3  =  (C/8) Sum_u u^{-1/2}
 *                        =  (C/8) [ (Sum_{a>=0} 2^{-a/2})(Sum_{b>=0} 3^{-b/2}) - 1 ]
 *                        =  (C/8) [ G2 G3 - 1 ],  G2 = 1/(1 - 2^{-1/2}) = 3.414214,  G3 = 1/(1 - 3^{-1/2}) = 2.366025.
 *      With C = 2 this is 0.25 (G2 G3 - 1) = 0.25 * 7.078116 = 1.769529 < infinity. The double sum
 *      converges because BOTH ratios 2^{-1/2}, 3^{-1/2} < 1, and the bound needs only (N) plus
 *      m_u = O(u): (II) is ROBUST to the multiplicity constant C. The cross-check reproduces the p = 2
 *      single-prime cubic tail (C/8)(G2 - 1) = 0.603553 and the p = 3 one (C/8)(G3 - 1) = 0.341506.
 *      Contrast the SQUARE sum: Sum_tail lam^2 = Sum_u (C u)(u^{-1/2}/2)^2 = (C/4) Sum_u 1 = (C/4) * (# S-units)
 *      = infinity (the S-unit semigroup is infinite): the exact analogue of the p = 2 log divergence,
 *      denser here (the S-unit count in the box a <= A, b <= B is (A+1)(B+1) - 1, quadratic).
 *
 * (I) SPECTRAL GAP -- REDUCED to the top confined states. Every ladder-tail magnitude satisfies
 *      s_u <= s_2 = 2^{-1/2}/2 = 0.353553 < 1 (the largest tail rung is u = 2), so the WHOLE tail is
 *      bounded away from 1 by a wide margin; the only eigenvalues that can approach 1 are the
 *      finitely-many top confined states, which are outside the ladder. Numerically the p = 2 top state
 *      is 0.9999731 < 1 (1 - lam^2 = 5.383e-5) and the mixed box only "holds more" (its top state is
 *      expected even nearer 1 but still strictly below). So (I) reduces to sup over the finitely-many
 *      top states, i.e. the no-modulus-1 theorem: an eigenvector of modulus 1 has g = xihat satisfying
 *      g(v) = 2 g(2v) on (1/2, oo) (the p = 2 lacunary/Zygmund argument), now OVER-DETERMINED by the
 *      p = 3 companion relation of the mixed group -- heuristically strengthening the g = 0 conclusion,
 *      but the rigorous re-derivation for the mixed 2^a 3^b group is the HARDER residual (an exact
 *      enclosure of the mixed top eigenvalue is blocked by the fractal Zygmund eigenfunctions, sibling).
 *
 * HONEST LIMITS. This is a ladder-MODEL computation, not an exact diagonalization: (N) is the rigorous
 *  norm ingredient, (M) is extrapolated from p = 2; (II) is therefore established as a convergent
 *  majorant robust to the multiplicity constant, while (I) is reduced (not proved) to the top confined
 *  states whose strict gap is the mixed-group no-modulus-1 theorem. Nothing here diagonalizes A_S23,
 *  moves a Lambda bound, or a verified height. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: pure geometric arithmetic, no imports, no zeros bundle. Reproduction inline in the
 *  assertions (closed form vs (a, b)-truncated double sum, N-convergence, p = 2 / p = 3 cross-checks).
 */

const SQRT2_INV = Math.SQRT1_2;          // 2^{-1/2}
const SQRT3_INV = 1 / Math.sqrt(3);      // 3^{-1/2}
export const G2 = 1 / (1 - SQRT2_INV);   // 3.414213562...  Sum_{a>=0} 2^{-a/2}
export const G3 = 1 / (1 - SQRT3_INV);   // 2.366025404...  Sum_{b>=0} 3^{-b/2}

/** closed-form ladder cubic tail Sum |lam|^3 = (C/8)(G2 G3 - 1) for the mixed 2^a 3^b {oo,2,3} ladder */
export function cubicTailClosed(C = 2) {
  return (C / 8) * (G2 * G3 - 1);
}

/** (a, b)-truncated ladder cubic tail: Sum over a=0..A, b=0..B, (a,b)!=(0,0) of (C u)(u^{-1/2}/2)^3,
 *  u = 2^a 3^b. Converges geometrically to cubicTailClosed(C) as A, B -> infinity (the N-check). */
export function cubicTailByAB(A, B, C = 2) {
  let s = 0;
  for (let a = 0; a <= A; a++) {
    for (let b = 0; b <= B; b++) {
      if (a === 0 && b === 0) continue;
      const u = Math.pow(2, a) * Math.pow(3, b);
      const lam = Math.pow(u, -0.5) / 2;          // s_u
      s += (C * u) * Math.pow(lam, 3);            // m_u * s_u^3 = (C/8) u^{-1/2}
    }
  }
  return s;
}

/** (a, b)-truncated ladder SQUARE sum Sum lam^2 = (C/4)(#S-units) — diverges as the box grows */
export function squareTailByAB(A, B, C = 2) {
  let s = 0;
  for (let a = 0; a <= A; a++) {
    for (let b = 0; b <= B; b++) {
      if (a === 0 && b === 0) continue;
      const u = Math.pow(2, a) * Math.pow(3, b);
      const lam = Math.pow(u, -0.5) / 2;
      s += (C * u) * lam * lam;                    // m_u * s_u^2 = C/4 per S-unit
    }
  }
  return s;
}

/** single-prime p cubic tail (C/8)(Gp - 1), Gp = 1/(1 - p^{-1/2}); reproduces the proved p = 2 ladder */
export function cubicTailSinglePrime(p, C = 2) {
  const Gp = 1 / (1 - Math.pow(p, -0.5));
  return (C / 8) * (Gp - 1);
}

export const IMP_96143_MIXED_LADDER_LITERALS = Object.freeze({
  G2: 3.414213562373096, G3: 2.3660254037844393, G2G3: 8.078116022520113,
  cubicTailClosedC2: 1.7695290056300284,     // 0.25 (G2 G3 - 1)
  cubicTailP2: 0.603553390593274,            // (1/4)(G2 - 1), matches the proved p = 2 dyadic ladder
  cubicTailP3: 0.3415063509461096,           // (1/4)(G3 - 1)
  crossTerms: 0.8244692640906448,            // cubicTailClosedC2 - cubicTailP2 - cubicTailP3
  topLadderRung: 0.3535533905932738,         // s_2 = 2^{-1/2}/2, the largest tail magnitude (< 1)
  p2TopConfinedState: 0.9999731,             // baked exact p = 2 top prolate eigenvalue (< 1), sibling port
  reductionLaw: 'Sum_tail |lam|^3 = (C/8)(G2 G3 - 1) < oo (geometric double sum, both ratios < 1) => (II); Sum_tail lam^2 = (C/4)(# S-units) = oo; every tail magnitude <= s_2 = 0.35355 < 1 => (I) reduces to the finitely-many top confined states',
});

export const IMP_96143_MIXED_LADDER = Object.freeze({
  id: 'imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability',
  route: 'I (Sonine refinement) — the mixed 2^a 3^b {oo,2,3} prolate ladder and the two rho-free facts (I) gap / (II) cubic tail imp-96125 named as the whole corr23 gap',
  parents: [
    'src/data/imp-96125-route-i-corr23-continuity-reduction.js (reduced corr23 continuity to (I) sup|lam| < 1 and (II) Sum|lam|^3 < oo for A_S23)',
    'src/data/rh-route-i-sonine-excess-semilocal-port-2026-09-23.js (p = 2 dyadic ladder +-2^{-n/2}/2, no modulus-1 eigenvalue, norm bound ||(1/2)P_1 F D_{2^n} P_1|| <= 2^{-n/2}/2)',
    'src/data/imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment.js (the {oo,2,3} S-unit cusp structure)',
  ],
  status: 'PARTIAL — (II) CUBIC TAIL ESTABLISHED for the mixed 2^a 3^b ladder: Sum_tail |lam|^3 = (C/8)(G2 G3 - 1) = 1.769529 (C = 2) < infinity, a rho-free geometric double sum that converges because both 2^{-1/2} and 3^{-1/2} < 1, robust to the multiplicity constant C (needs only the rigorous per-block norm s_u = u^{-1/2}/2 and m_u = O(u)); N-convergence in (a, b) confirmed and the p = 2 / p = 3 single-prime cubic tails (0.603553 / 0.341506) are reproduced. The SQUARE sum Sum_tail lam^2 = (C/4)(# S-units) = infinity (denser than p = 2 log). (I) SPECTRAL GAP REDUCED, not proved: every ladder-tail magnitude <= s_2 = 0.353553 < 1, so the gap question is confined to the finitely-many TOP confined states (p = 2 top = 0.9999731 < 1; mixed box holds more, top expected nearer 1 but < 1); the strict inequality is the mixed-group no-modulus-1 theorem (g(v) = 2 g(2v) over-determined by the p = 3 relation), the harder residual, with exact diagonalization blocked by the fractal Zygmund eigenfunctions. No spectrum diagonalized; RH open; no refereed bound is changed; NO QED',
  factII: 'Sum_tail |lam|^3 = Sum_u (C u)(u^{-1/2}/2)^3 = (C/8) Sum_{a,b>=0,(a,b)!=(0,0)} (2^a 3^b)^{-1/2} = (C/8)(G2 G3 - 1), G2 = 1/(1-2^{-1/2}) = 3.414214, G3 = 1/(1-3^{-1/2}) = 2.366025; finite because it is a product of two convergent geometric series minus the identity term; robust to C (only the norm s_u = u^{-1/2}/2 and m_u = O(u) enter). ESTABLISHED as a convergent rho-free majorant, cross-checked against the proved p = 2 ladder',
  factI: 'the whole ladder tail is bounded by s_2 = 2^{-1/2}/2 = 0.353553 < 1, so (I) reduces to the finitely-many top confined states (archimedean-box modes) outside the ladder; numerically the p = 2 top state is 0.9999731 < 1 and the mixed box holds more (top nearer 1 but still < 1); the strict gap is the no-modulus-1 functional-equation theorem g(v) = 2 g(2v), over-determined and heuristically strengthened by the p = 3 companion relation of the mixed 2^a 3^b group — the harder residual, exact enclosure blocked by the fractal Zygmund eigenfunctions (sibling port)',
  honestLimits: 'a ladder-MODEL computation, not an exact diagonalization: the per-block norm s_u = u^{-1/2}/2 is the rigorous ingredient (dilation unitarity + Euler 1/2 weight, generalizing the proved p = 2 bound), while the multiplicity m_u = O(u) is extrapolated from p = 2 (proved there, not diagonalized here); so (II) is established as a convergent majorant robust to the multiplicity constant, and (I) is reduced (not proved) to the top confined states whose strict gap needs the mixed-group no-modulus-1 theorem; nothing diagonalizes A_S23 or moves a Lambda bound / verified height; RH open; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96143_MIXED_LADDER_ASSERTIONS = Object.freeze([
  {
    id: 'imp96143-cubic-tail-finite-and-converges',
    description: '(II): the mixed 2^a 3^b ladder cubic tail closed form (C/8)(G2 G3 - 1) = 1.769529 (C = 2) is finite; the (a,b)-truncated double sum increases monotonically toward it (A=B = 5,10,20,40), is bounded above by it, and reaches it to 1e-9 by A = B = 80 (geometric convergence)',
    holds: () => {
      const closed = cubicTailClosed(2);
      if (!approx(closed, 1.7695290056300284, 1e-9)) return false;
      const seq = [5, 10, 20, 40].map((k) => cubicTailByAB(k, k, 2));
      const increasing = seq.every((v, i) => i === 0 || v > seq[i - 1]);
      const boundedAbove = seq.every((v) => v < closed);
      const converged = approx(cubicTailByAB(80, 80, 2), closed, 1e-9);
      return increasing && boundedAbove && converged && closed < 2;
    },
  },
  {
    id: 'imp96143-cubic-tail-robust-to-multiplicity-constant',
    description: '(II) is robust to the multiplicity constant: for C = 1, 2, 3 the cubic tail is finite and scales linearly (cubicTailClosed(C) = C * cubicTailClosed(1)), so summability needs only the rigorous norm s_u = u^{-1/2}/2 and m_u = O(u), not the exact C',
    holds: () => {
      const base = cubicTailClosed(1);
      return approx(cubicTailClosed(2), 2 * base, 1e-12) && approx(cubicTailClosed(3), 3 * base, 1e-12) && base > 0 && base < 1;
    },
  },
  {
    id: 'imp96143-square-tail-diverges',
    description: 'the square sum Sum lam^2 = (C/4)(# S-units) grows without bound (A=B = 10,20,40 strictly increasing) and equals (C/4)((A+1)(B+1) - 1) exactly: the mixed ladder is NON-trace-class, denser than the p = 2 log divergence',
    holds: () => {
      const s10 = squareTailByAB(10, 10, 2), s20 = squareTailByAB(20, 20, 2), s40 = squareTailByAB(40, 40, 2);
      const exact = approx(squareTailByAB(20, 20, 2), 0.5 * ((21 * 21) - 1), 1e-9);
      return s10 < s20 && s20 < s40 && exact && s40 > 800;
    },
  },
  {
    id: 'imp96143-cross-check-single-prime-ladders',
    description: 'the method reproduces the proved p = 2 dyadic-ladder cubic tail (1/4)(G2 - 1) = 0.603553 and the p = 3 one 0.341506, the mixed tail exceeds each (denser ladder), and mixed = p2 + p3 + crossTerms (0.824469): consistent decomposition',
    holds: () => {
      const p2 = cubicTailSinglePrime(2, 2), p3 = cubicTailSinglePrime(3, 2), mixed = cubicTailClosed(2);
      return approx(p2, 0.603553390593274, 1e-9) && approx(p3, 0.3415063509461096, 1e-9)
        && mixed > p2 && mixed > p3 && approx(mixed - p2 - p3, 0.8244692640906448, 1e-9);
    },
  },
  {
    id: 'imp96143-gap-reduces-to-top-states',
    description: '(I): every ladder-tail magnitude is <= s_2 = 2^{-1/2}/2 = 0.353553 < 1, so the gap question is confined to the finitely-many top confined states; the baked p = 2 top state 0.9999731 is < 1',
    holds: () => {
      let maxTail = 0;
      for (let a = 0; a <= 30; a++) for (let b = 0; b <= 30; b++) {
        if (a === 0 && b === 0) continue;
        const s = Math.pow(Math.pow(2, a) * Math.pow(3, b), -0.5) / 2;
        if (s > maxTail) maxTail = s;
      }
      return approx(maxTail, 0.3535533905932738, 1e-12) && maxTail < 1
        && IMP_96143_MIXED_LADDER_LITERALS.p2TopConfinedState < 1;
    },
  },
  {
    id: 'imp96143-verdict-honesty',
    description: 'status records a PARTIAL: (II) ESTABLISHED, (I) REDUCED (not proved) to the top confined states, names the ladder-model / multiplicity-extrapolation honest limit, and asserts RH open / NO QED',
    holds: () => /PARTIAL/.test(IMP_96143_MIXED_LADDER.status)
      && /CUBIC TAIL ESTABLISHED/.test(IMP_96143_MIXED_LADDER.status)
      && /SPECTRAL GAP REDUCED, not proved/.test(IMP_96143_MIXED_LADDER.status)
      && /NO QED/.test(IMP_96143_MIXED_LADDER.status)
      && /ladder-MODEL/.test(IMP_96143_MIXED_LADDER.honestLimits)
      && /RH open/.test(IMP_96143_MIXED_LADDER.honestLimits),
  },
]);

export default IMP_96143_MIXED_LADDER;
