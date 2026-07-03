/**
 * @module imp-3256-vhs-crossval
 * @fileoverview imp-3256 -- Per-N cross-validation of the Volterra Hilbert-Schmidt
 *   norm ||V||_HS between the section26-mupass verdict genuine-Phi construction
 *   (NPHI=10, a=0.5, U=6, hsReference=1.90e-4) and the imp-1267 construction
 *   (NPHI=10, a=0.5, U=5, hs_exact_window=1.8985e-4). The verdict asserts the two
 *   "independently match (~0.08% apart)" but the per-N table behind that claim was
 *   never produced. This module produces it.
 *
 *   SAME OBJECT, TWO WINDOWS
 *   ------------------------
 *   Both quantities are the SAME lower-triangular Volterra Hilbert-Schmidt norm of
 *   the shear-Gram kernel
 *       k(x, y) = Phi(x) Phi(y) sinh(a(x - y)) * 1_{0 <= y <= x},
 *       ||V||_HS = ( int_0^U int_0^x |k|^2 dy dx )^{1/2},
 *   with the identical de Bruijn-Newman Phi (NPHI=10) and a=0.5. The ONLY nominal
 *   difference is the integration window: imp-1267 uses U=5, the verdict uses U=6.
 *
 *   MEASUREMENT (scripts/compute-imp3256-vhs-crossval.mjs, run 2026-07-02)
 *   ---------------------------------------------------------------------
 *   ||V||_HS(a=0.5, U, N) tabulated at matched node count N and at matched step
 *   size h across U in {5, 6}:
 *
 *     N      h        HS(U=5)         HS(U=6, matched-N)   HS(U=6, matched-h)
 *     500    1.0e-2   1.89296091e-4   1.88972262e-4        1.89296091e-4
 *     1000   5.0e-3   1.89847853e-4   1.89766946e-4        1.89847853e-4
 *     2000   2.5e-3   1.89985751e-4   1.89965527e-4        1.89985751e-4
 *     4000   1.25e-3  1.90020222e-4   1.90015166e-4        1.90020222e-4
 *     8000   6.25e-4  1.90028840e-4   1.90027576e-4        1.90028840e-4
 *
 *   TWO DECISIVE OBSERVATIONS
 *   -------------------------
 *   (A) MATCHED STEP SIZE h => BIT-IDENTICAL. At equal h, HS(U=5) and HS(U=6) agree
 *       to every printed digit at every resolution, because Phi(u)^2 underflows to
 *       fp-zero past u ~ 2 (super-exponential decay). Extending the window from 5 to
 *       6 adds literally nothing. There is NO normalization or grid-convention offset
 *       between the two constructions -- they are the same Hilbert-Schmidt norm.
 *   (B) MATCHED N => a finite-h boundary discrepancy that VANISHES under refinement.
 *       At equal node count N (but unequal h, since h = U/N differs by 6/5), the two
 *       differ by relGap = 1.71e-3 at N=500 shrinking monotonically to 6.65e-6 at
 *       N=8000 -- i.e. O(h) and -> 0 as h -> 0. So even the matched-N discrepancy is a
 *       quadrature-resolution artifact, not a genuine convention gap.
 *
 *   WHY imp-1267 READS 1.8985e-4 AND THE VERDICT READS 1.90e-4
 *   ----------------------------------------------------------
 *   imp-1267's frozen hs_exact_window(a=0.5, U=5, N=1000) = 1.8984785338e-4 is
 *   reproduced EXACTLY here at N=1000 (1.89847853e-4), pinning imp-1267 to the
 *   N=1000 grid. Rounding 1.8985e-4 to 3 significant figures gives 1.90e-4 -- which
 *   is precisely the verdict's hsReference. Both values round to 0.000190. The
 *   asserted "~0.08% apart" is therefore PURE 3-vs-5 significant-figure ROUNDING of
 *   ONE number, NOT two independently converged values carrying a fixed offset.
 *
 *   VERDICT
 *   -------
 *   CONFIRMED SAME HILBERT-SCHMIDT NORM. The verdict ||V||_HS = 1.90e-4 and imp-1267
 *   1.8985e-4 are the identical lower-triangular Volterra HS norm at (NPHI=10, a=0.5)
 *   evaluated on windows (U=5 vs U=6) that are equivalent to fp precision. The 0.08%
 *   gap is significant-figure rounding, not a normalization/grid convention gap. As a
 *   cross-check the "independent match" is REAL but NOT independent evidence: it is the
 *   same computation quoted at two precisions. Both windows converge together to
 *   ~1.9003e-4 as h -> 0 (still creeping up ~0.02% from the N=1000 value under midpoint
 *   refinement; the headline 3-sig-fig 1.90e-4 is resolution-stable).
 *
 *   HONEST SCOPE (mandatory)
 *   ------------------------
 *   Numerical cross-validation only, RH-EQUIVALENT; imp-3066 untouched, no reduction,
 *   no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA. This resolves the tabulation
 *   sub-gap (the missing per-N table) and reclassifies the "independent match" as a
 *   same-object precision-rounding identity, NOT a second independent measurement.
 *
 *   @see section26-mupass-operator-verdict-2026-06-30.js (hsReference = 1.90e-4)
 *   @see imp-1267-volterra-hs-bound.js (hs_exact_window = 1.8985e-4 at U=5)
 *   @see imp-3267-section26-mupass-verdict-lock.js (L2 band [1.895e-4, 1.905e-4])
 *
 *   Ticket: imp-3256 (numerical, medium).
 */

// Frozen per-N cross-validation rows (a=0.5), from the compute script.
const CROSSVAL_ROWS = Object.freeze([
  Object.freeze({ N: 500,  h5: 1.00e-2,  hs_U5: 1.8929609149e-4, hs_U6_matchedN: 1.8897226221e-4, hs_U6_matchedH: 1.8929609149e-4, N6_matchedH: 600,   relGap_matchedN: 1.7107024145e-3 }),
  Object.freeze({ N: 1000, h5: 5.00e-3,  hs_U5: 1.8984785338e-4, hs_U6_matchedN: 1.8976694562e-4, hs_U6_matchedH: 1.8984785338e-4, N6_matchedH: 1200,  relGap_matchedN: 4.2617e-4 }),
  Object.freeze({ N: 2000, h5: 2.50e-3,  hs_U5: 1.8998575072e-4, hs_U6_matchedN: 1.8996552718e-4, hs_U6_matchedH: 1.8998575072e-4, N6_matchedH: 2400,  relGap_matchedN: 1.0645e-4 }),
  Object.freeze({ N: 4000, h5: 1.25e-3,  hs_U5: 1.9002022234e-4, hs_U6_matchedN: 1.9001516611e-4, hs_U6_matchedH: 1.9002022234e-4, N6_matchedH: 4800,  relGap_matchedN: 2.6609e-5 }),
  Object.freeze({ N: 8000, h5: 6.25e-4,  hs_U5: 1.9002884032e-4, hs_U6_matchedN: 1.9002757572e-4, hs_U6_matchedH: 1.9002884032e-4, N6_matchedH: 9600,  relGap_matchedN: 6.6549e-6 }),
]);

const _finest = CROSSVAL_ROWS[CROSSVAL_ROWS.length - 1];

export const IMP3256_VHS_CROSSVAL = Object.freeze({
  id: 'imp-3256-vhs-crossval',
  ticket: 'imp-3256',
  generatedAt: '2026-07-02T00:00:00Z',
  category: 'numerical',
  cell: Object.freeze({ NPHI: 10, a: 0.5, U_imp1267: 5, U_verdict: 6 }),

  summary:
    'Per-N cross-validation confirms the section26-mupass verdict ||V||_HS=1.90e-4 (U=6) ' +
    'and imp-1267 1.8985e-4 (U=5) are the SAME lower-triangular Volterra HS norm. At matched ' +
    'step size h the two windows are bit-identical (Phi underflows past u~2, so extending the ' +
    'window adds nothing); at matched node count N they differ only by an O(h) boundary term ' +
    'that shrinks 1.71e-3 -> 6.65e-6 under refinement. imp-1267 1.8984785338e-4 is reproduced ' +
    'EXACTLY at N=1000, and 1.8985e-4 rounds to 1.90e-4 at 3 sig figs. The asserted ~0.08% gap ' +
    'is significant-figure ROUNDING of one number, NOT a grid/normalization convention offset.',

  kernel: Object.freeze({
    formula: 'k(x, y) = Phi(x) Phi(y) sinh(a(x - y)) for 0 <= y <= x; else 0',
    norm: '||V||_HS = ( int_0^U int_0^x |k|^2 dy dx )^{1/2}',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
  }),

  rows: CROSSVAL_ROWS,
  finest: _finest,

  imp1267_frozen_at_N1000: 1.8984785338e-4,
  verdict_hsReference: 1.90e-4,
  bothRoundTo3SigFigs: '0.000190',
  convergedValue_h_to_zero: 1.9003e-4,

  verdict_conclusion: Object.freeze({
    sameHilbertSchmidtNorm: true,
    normalizationOrGridOffset: false,
    gapIsSignificantFigureRounding: true,
    matchedStepSizeBitIdentical: true,
    matchedN_discrepancy_is_On_h_vanishing: true,
    independentMatchIsReal_butNotIndependentEvidence:
      'the "independent match" is the SAME computation quoted at two precisions (3 vs 5 sig figs), ' +
      'not a second independent measurement',
  }),

  honestScope: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    scope: 'numerical cross-validation, RH-EQUIVALENT',
    residualOpen: 'operator-positivity K_a >= 0 (imp-3066, untouched)',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    resolvesSubGap: 'the missing per-N cross-validation table behind the verdict ~0.08% match claim',
  }),

  computeScript: 'scripts/compute-imp3256-vhs-crossval.mjs',
});

export const IMP3256_VHS_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3256-reproduces-imp1267-at-N1000',
    why:
      'The imp-1267 frozen hs_exact_window(a=0.5, U=5, N=1000) = 1.8984785338e-4 must be ' +
      'reproduced EXACTLY (to ~1e-6 relative, storage precision) by the U=5 measurement at ' +
      'N=1000. This pins imp-1267 to the N=1000 grid and proves the two files compute the ' +
      'identical object. A drift means the kernel or grid convention differs.',
    holds: () => {
      const row = IMP3256_VHS_CROSSVAL.rows.find((r) => r.N === 1000);
      return row != null &&
        Math.abs(row.hs_U5 - IMP3256_VHS_CROSSVAL.imp1267_frozen_at_N1000) /
          IMP3256_VHS_CROSSVAL.imp1267_frozen_at_N1000 < 1e-6;
    },
  },
  {
    id: 'imp3256-matched-h-bit-identical',
    why:
      'DECISIVE SAME-OBJECT CHECK: at matched step size h, HS on window U=5 and window U=6 ' +
      'must agree to ~1e-9 relative at every row, because Phi underflows to fp-zero past u~2 so ' +
      'the extra [5,6] window contributes nothing. If they differ, there is a genuine ' +
      'normalization/convention offset between the two constructions.',
    holds: () =>
      IMP3256_VHS_CROSSVAL.rows.every(
        (r) => Math.abs(r.hs_U6_matchedH - r.hs_U5) / r.hs_U5 < 1e-9,
      ),
  },
  {
    id: 'imp3256-matched-N-gap-vanishes',
    why:
      'The matched-N (unequal-h) discrepancy between U=5 and U=6 must be O(h) and shrink ' +
      'MONOTONICALLY as N grows -- confirming it is a finite-resolution boundary artifact, not a ' +
      'fixed offset. If the gap plateaus or grows, the two constructions would carry a real ' +
      'convention difference.',
    holds: () => {
      const gaps = IMP3256_VHS_CROSSVAL.rows.map((r) => r.relGap_matchedN);
      for (let i = 1; i < gaps.length; i++) {
        if (gaps[i] >= gaps[i - 1]) return false;
      }
      return gaps[gaps.length - 1] < 1e-5;
    },
  },
  {
    id: 'imp3256-both-round-to-verdict-headline',
    why:
      'Both the imp-1267 value (1.8985e-4) and the finest converged U=5/U=6 measurements must ' +
      'round to the verdict hsReference 1.90e-4 at 3 significant figures. This is the crux: the ' +
      '~0.08% "gap" is significant-figure rounding of ONE number, not two independent values.',
    holds: () => {
      const v = IMP3256_VHS_CROSSVAL;
      return (
        Number(v.imp1267_frozen_at_N1000.toPrecision(3)) === v.verdict_hsReference &&
        Number(v.finest.hs_U5.toPrecision(3)) === v.verdict_hsReference &&
        Number(v.finest.hs_U6_matchedN.toPrecision(3)) === v.verdict_hsReference
      );
    },
  },
  {
    id: 'imp3256-in-imp3267-lock-band',
    why:
      'The measured HS values at N>=1000 (imp-1267 grid and finer) must sit inside the imp-3267 ' +
      'lock band [1.895e-4, 1.905e-4] (the L2 guard consistent with the "1.90e-4" headline). The ' +
      'coarsest N=500 row is intentionally below-band to exhibit convergence; the converged rows ' +
      'must stay in-band or the cross-validation would contradict the locked verdict.',
    holds: () =>
      IMP3256_VHS_CROSSVAL.rows
        .filter((r) => r.N >= 1000)
        .every(
          (r) => r.hs_U5 >= 1.895e-4 && r.hs_U5 <= 1.905e-4 &&
                 r.hs_U6_matchedN >= 1.895e-4 && r.hs_U6_matchedN <= 1.905e-4,
        ),
  },
  {
    id: 'imp3256-honest-scope-not-proof',
    why:
      'MANDATORY HONESTY GATE: this is numerical cross-validation only, RH-EQUIVALENT, not a ' +
      'proof or reduction; the operator-positivity residual (imp-3066) stays open and ' +
      'Platt-Trudgian Lambda <= 0.2 stays SOTA. If these flags flip the module over-claims.',
    holds: () => {
      const h = IMP3256_VHS_CROSSVAL.honestScope;
      const c = IMP3256_VHS_CROSSVAL.verdict_conclusion;
      return (
        h.isProof === false &&
        h.isReductionBelowRH === false &&
        h.scope.includes('RH-EQUIVALENT') &&
        c.sameHilbertSchmidtNorm === true &&
        c.normalizationOrGridOffset === false
      );
    },
  },
];

for (const assertion of IMP3256_VHS_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error('imp-3256-vhs-crossval assertion failed: ' + assertion.id);
  }
}

export default IMP3256_VHS_CROSSVAL;
