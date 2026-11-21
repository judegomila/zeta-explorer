/**
 * @fileoverview imp-97050 -- INDEPENDENT-INTERVAL-LIBRARY full [0,40] verify4 cell-local
 * pipeline sweep. Closes the imp-97034 sub-gap IMP97034_FULLPIPELINE_SECONDIMPL_SWEEP_NOT_RUN.
 * Import-light: all values are frozen literals from the completed runs in
 * tmp/imp-97050-indep-interval-sweep.py on /tmp/rhvenv (mpmath 1.4.1, numpy 2.5.3).
 *
 * WHY. imp-97034 re-verified the cell-local |w1-prime-prime| ENCLOSURE and the tail FORMULA on a
 * second implementation, but flagged that the full verify4 SWEEP itself -- the 80000-cell fine-grid
 * solve, the sigma interval evaluation, periodic_min, and the rf safe-step selection -- had only
 * ever run once, under mpmath built-in iv interval type at iv.prec=80 (tmp/imp-97012-verify4-
 * celllocal.py). This leaf re-runs the ENTIRE verdict-path interval arithmetic under a SECOND,
 * from-scratch interval library that shares none of mpmath.iv code:
 *
 *   class Iv -- outward-rounded interval on mpmath.mp at prec=220, every primitive
 *   (+, -, *, /, integer-pow, log, sqrt, cos, sin, abs) re-derived with explicit endpoint
 *   epsilon-inflation. The sigma_2 midpoint enclosure (s_m, ds_m), the cell w1/w1-prime magnitude
 *   enclosures feeding C2, and the tail bracket are all recomputed under Iv. The FLOAT parts of the
 *   pipeline (numpy fine-grid lower_bound, periodic_min, the cell-local |w1-prime-prime| majorant,
 *   the rf safe-step) are byte-identical to the imp-97012 script -- those are not "the interval
 *   library". What changes is the library producing every rigorous enclosure the verdict rests on.
 *
 * The sweep was run on the imp-96970 round-12 kmax=5 iterate (59 atoms, l1=7.030,
 * tmp/imp-96970/iterate-snap.json) at 2a=1.00, hc=5e-4, over the full [0,40] domain, in both the
 * cell-local B configuration and the constant-B (W1PP=32.80) control -- the exact A/B of imp-97012.
 *
 * FINDING 1 -- THE INDEPENDENT SWEEP REPRODUCES imp-97012 TO THE VERDICT. Under the from-scratch Iv
 * library the cell-local run returns 0 failing cells and CERTIFICATE VERIFIED at 2a=1.00; the
 * constant-B control returns the 59-fail collapse and NOT VERIFIED. Both verdicts, both fine-grid
 * point counts (192,808 cell-local; 3,897,895 constant), the tail bracket (+0.458135), and the
 * worst-fail location (t=37.809, C2=6.735e7) match the imp-97012 mpmath.iv run. The rf safe-step
 * and the badf sub-cell refinement took identical branches on the two interval libraries -- no cell
 * flipped its pass/fail or its refinement decision -- which is why the fine-point counts agree to
 * the digit.
 *
 * FINDING 2 -- THE ONE VERDICT-IRRELEVANT DIVERGENCE IS AT THE 5e-10 LEVEL. The single quantity that
 * differs is the deepest rigorous lower bound across the 59 constant-B fails: imp-97012 (iv, prec80)
 * reports -0.954363556514616; the independent Iv (mp, prec220) reports -0.954363556048962, a
 * difference of 4.66e-10. This is the sigma_2 midpoint enclosure width differing between the two
 * interval arithmetics; it is far below the |0.95| depth of the fail and does not move any verdict,
 * fail count, or the >0 cell-local pass. The cell-local worst rigorous lower bound is +0.913144,
 * comfortably positive across all 80000 cells.
 *
 * FINDING 3 -- AUXILIARY: THE SUPERSEDED kmax=4 2a=0.96 ITERATE DOES NOT CLEAR THIS FLOW TAIL. Running
 * the older 154-atom 2a=0.96 snapshot (tmp/imp-96633-cert096.json, kmax=4) through the same flow
 * pipeline gives a NEGATIVE tail bracket (-4.218743, from periodic minimum ptop >= -3.994153): that
 * pre-cell-local kmax=4 iterate is not a flow-positive certificate on [0,40]. This is expected -- the
 * project certified reach 2a<=0.96 comes from the interval-rigorous Toeplitz T_a certificate
 * (rh-route-i-toeplitz-krein-certificate-2026-09-24), a different verification path, not from this
 * flow-positivity sweep -- and it is reported here only as an honest secondary data point.
 *
 * VERDICT. The full [0,40] verify4 cell-local pipeline sweep REPRODUCES on a second, method-
 * independent interval library: same verdict (cell-local VERIFIED / constant NOT VERIFIED), same
 * 0-vs-59 fail split, same fine-grid counts, same tail bracket, same worst-fail cell. Sub-gap
 * IMP97034_FULLPIPELINE_SECONDIMPL_SWEEP_NOT_RUN is CLOSED: step (a) of imp-97034 (the enclosure,
 * the tail formula, AND now the full pipeline sweep) is confirmed on independent arithmetic.
 *
 * WHAT THIS DOES NOT DO. This is a numerical cross-implementation reproduction, not a machine-checked
 * proof, and it does not touch step (b) -- the interpretive step from a verified T_a[sigma_2] >= 0
 * certificate to any Weil / operator positivity (the operator floor is a Rayleigh UPPER bound; the
 * Sonine port is obstructed at 2a=ln2). Certified reach stays 2a <= 0.96; operator positivity not
 * proved; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97034-independent-celllocal-reverify.js (step (a) enclosure + tail formula, second impl)
 * @see imp-97012-krein-kmax5-100-celllocal-w1pp-verify.js (the imp-97012 mpmath.iv run under test)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// The independent interval library used for every rigorous enclosure on the verdict path.
export const IMP97050_LIBRARY = Object.freeze({
  name: 'from-scratch outward-rounded interval Iv on mpmath.mp',
  prec: 220, // working precision (the imp-97012 run used mpmath.iv at iv.prec=80)
  sharesWithMpmathIv: 'none -- interval type, error propagation, and transcendental code all re-derived',
  floatPartsIdentical: 'numpy fine-grid lower_bound, periodic_min, |w1-prime-prime| majorant, rf safe-step',
  iterate: 'tmp/imp-96970/iterate-snap.json', // round-12 kmax=5, 59 atoms, l1=7.030, 2a=1.00
  hc: 5.0e-4,
  domain: '[0,40]',
});

// FINDING 1 -- the A/B sweep verdict reproduces imp-97012 under the independent library.
export const IMP97050_SWEEP = Object.freeze({
  cellLocal: Object.freeze({
    ncells: 80000,
    finePoints: 192808, // matches imp-97012 exactly
    nfails: 0,
    verified: true,
    worstRigLowerBound: 0.9131441750506937, // min rigorous Flow lb over all 80000 cells (positive)
    secs: 583.7,
  }),
  constantB: Object.freeze({
    ncells: 80000,
    finePoints: 3897895, // matches imp-97012 exactly
    nfails: 59,
    verified: false,
    deepestLowerBound: -0.954363556048962, // deepest rigorous lb across the 59 fails
    worstFailT: 37.808968749998506,
    worstFailC2: 67349733.08771612, // 6.735e7 -- dominated by the q^2*W1PP curvature term
    secs: 576.6,
  }),
  // identical in both configurations and matching imp-97012
  tailBracket: 0.45813477807479813,
  twoTheta2Deriv40: 1.653294, // 2 theta-prime tail monotone lower bound at T=40
});

// FINDING 2 -- the ONLY verdict-irrelevant divergence, at the 5e-10 level.
export const IMP97050_CROSS_LIBRARY_DEVIATION = Object.freeze({
  quantity: 'deepest rigorous lower bound across the 59 constant-B fails',
  imp97012_mpmathIv_prec80: -0.954363556514616,
  imp97050_indepIv_prec220: -0.954363556048962,
  absDiff: 4.656540708580792e-10, // sigma_2 midpoint enclosure width; below the |0.95| fail depth
  movesAnyVerdict: false,
});

// FINDING 3 -- auxiliary: the superseded kmax=4 2a=0.96 snapshot fails THIS flow tail.
export const IMP97050_KMAX4_096_AUX = Object.freeze({
  snapshot: 'tmp/imp-96633-cert096.json', // kmax=4, 154 atoms, 2a=0.96
  periodicMin: -3.994153,
  tailBracket: -4.218743, // negative -- not a flow-positive certificate on [0,40]
  note: 'certified reach 2a<=0.96 is from the Toeplitz T_a certificate, a different path, not this flow sweep',
});

export const IMP97050_VERDICT = Object.freeze({
  subGapClosed: 'IMP97034_FULLPIPELINE_SECONDIMPL_SWEEP_NOT_RUN',
  reproduces: true,
  claim: 'full [0,40] verify4 cell-local pipeline reproduces imp-97012 (0 vs 59 fails, same fine counts, same tail bracket, same worst-fail cell) on a second method-independent interval library',
  certifiedReach: 0.96,
  operatorPositivityProved: false,
  stepBUntouched: true,
  rhStatus: 'open',
  noQED: true,
});
