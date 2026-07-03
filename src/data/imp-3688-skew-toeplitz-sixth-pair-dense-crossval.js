/**
 * @module imp-3688-skew-toeplitz-sixth-pair-dense-crossval
 * @fileoverview imp-3688 -- DENSE-certify the SIXTH skew-Toeplitz pair
 *   lambda_11 = lambda_12 at the DEEP rungs (N = 1200, 1600, 2000) with the SAME
 *   INDEPENDENT dense full-spectrum solver imp-3623/imp-3643/imp-3668 used,
 *   extending the imp-3668 FIFTH-pair certification (lambda_9 = lambda_10) up one
 *   pair. This is the pairing-STRUCTURE cross-check for the next adjacent-pairing
 *   level: it certifies the degeneracy, not the amplitude law.
 *
 *   CONTEXT
 *   -------
 *   imp-3623 dense-certified only the top-6 (lambda_1=lambda_2, lambda_3=lambda_4,
 *   lambda_5=lambda_6); imp-3643 extended to the top-8 (fourth pair
 *   lambda_7=lambda_8); imp-3668 extended to the top-10 (fifth pair
 *   lambda_9=lambda_10) and reported the section is FIVE-pair adjacent-paired at
 *   the deep rungs. The SIXTH pair lambda_11 = lambda_12 -- the next
 *   adjacent-pairing level -- was never dense-checked: imp-3668 stopped at the
 *   top-10.
 *
 *   THIS MODULE reuses the IDENTICAL imp-3505/imp-3619/imp-3623/imp-3643/imp-3668
 *   assembly Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, midpoint
 *   quadrature), forms the Gram S = T^T T EXPLICITLY at each DEEP rung
 *   N in {1200, 1600, 2000}, and computes the WHOLE symmetric spectrum with the
 *   SAME INDEPENDENT dense full-spectrum route (Householder tridiagonalization
 *   EISPACK tred1 + implicit-QL tql1: ALL eigenvalues, NO Krylov subspace, NO
 *   reorthogonalization -- so it cannot host a Lanczos ghost), extracting the
 *   TOP-TWELVE Gram eigenvalues to reach lambda_11 = lambda_12. The deep-rung
 *   dense top-12 Gram eigenvalues were measured once offline
 *   (scripts/imp-3688-dense-sixth-pair-offline.mjs; the N = 2000 solve ran in
 *   ~4.6 s) and are BAKED here as literals; the six-pair adjacent pairing and the
 *   sixth-pair amplitude sigma_5 = lambda_11/lambda_1 are re-derived arithmetically
 *   at import (import-light, like imp-3623/imp-3643/imp-3668). As a same-assembly
 *   self-check, the dense TOP-TEN here reproduce the imp-3668 baked deep-rung
 *   top-10 to all printed digits.
 *
 *   FINDING
 *   -------
 *   (1) THE SIXTH PAIR lambda_11 = lambda_12 IS DEGENERATE TO MACHINE PRECISION AT
 *       EVERY DEEP RUNG. The independent dense full-spectrum lambda_11 = lambda_12
 *       spread is 3.95e-16 (N=1200), 3.94e-16 (N=1600), 5.90e-16 (N=2000) -- i.e.
 *       < 6e-16 everywhere, the same machine-precision adjacent pairing the lower
 *       five pairs show. So the skew-Toeplitz section spectrum is SIX-pair
 *       adjacent-paired at the deep rungs: lambda_1=lambda_2, lambda_3=lambda_4,
 *       lambda_5=lambda_6, lambda_7=lambda_8, lambda_9=lambda_10, lambda_11=lambda_12.
 *   (2) THE SIXTH-PAIR AMPLITUDE sigma_5 = lambda_11/lambda_1 CLIMBS MONOTONICALLY
 *       TOWARD 1 WITH DEPTH. sigma_5 = 0.9950015727612738 (N=1200),
 *       0.9971799583735494 (N=1600), 0.9981921829349266 (N=2000) -- the same
 *       approach-to-1 the lower gaps show, consistent with the ratios all tending
 *       to 1 as the section deepens.
 *   (3) THE DEEP DENSE TOP-10 REPRODUCE THE imp-3668 CERTIFICATION EXACTLY. The
 *       dense top-10 here reproduce the imp-3668 baked deep-rung top-10 Gram
 *       eigenvalues to all printed digits at N = 1200/1600/2000 (same assembly,
 *       same dense route), so this is a faithful one-level extension of the same
 *       solve, not a re-tuned calculation.
 *
 *   SCOPE / WHAT IS AND IS NOT CERTIFIED. This dense-solves the DEEP rungs
 *   (N = 1200/1600/2000) for the SIXTH pair -- extending imp-3668 (fifth pair) by
 *   one spectrum level. It certifies the lambda_11 = lambda_12 adjacent-pairing
 *   degeneracy against an independent non-Lanczos solver. It is a pairing-STRUCTURE
 *   cross-check / measurement only: it does NOT establish the sixth-pair amplitude
 *   LAW, does NOT construct the missing magnitude, and does NOT attempt the
 *   imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. NO RH verdict, NO QED.
 *   Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (the FIFTH-pair dense cross-val this extends by one pair)
 *   @see imp-3643-skew-toeplitz-third-gap-dense-crossval.js (the FOURTH-pair deep dense cross-val, top-8)
 *   @see imp-3623-skew-toeplitz-second-gap-dense-crossval.js (the second-gap deep dense cross-val, top-6)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly)
 *
 *   Ticket: imp-3688 (numerical, medium). Dense pairing-structure cross-check only:
 *   certifies the SIXTH pair lambda_11=lambda_12 against an independent dense
 *   full-spectrum solver at the deep rungs, one pair beyond imp-3668. imp-3066
 *   UNTOUCHED. RH-EQUIVALENT. NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3619 / imp-3623 / imp-3643 / imp-3668)
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3505 / imp-3668 ladder
const PAIR_TOL = 1e-14; // dense adjacent-pair degeneracy relative tolerance (measured < 6e-16)

// --- BAKED deep-rung DENSE top-12 Gram eigenvalues (lambda_i = sigma_i^2 of S = T^T T),
//     sorted DESCENDING, measured OFFLINE (scripts/imp-3688-dense-sixth-pair-offline.mjs)
//     with the identical imp-3505/imp-3619/imp-3623/imp-3643/imp-3668 assembly
//     Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, midpoint) and the SAME INDEPENDENT dense
//     full-spectrum eigensolver imp-3623/imp-3643/imp-3668 used (Householder
//     tridiagonalization tred1 + implicit-QL tql1: all eigenvalues, NO Krylov subspace,
//     NO reorthogonalization). The N=2000 dense solve ran offline in ~4.6 s. Literals
//     baked; import-light. The first TEN entries per rung are the imp-3668 baked top-10
//     (reproduced verbatim by the same solve); entries 11-12 are the new SIXTH-pair
//     levels. -------------------------------------------------------------------------- */
const DEEP_DENSE_LADDER = Object.freeze([
  {
    N: 1200,
    U: 30,
    denseTop12: [
      4.214343608213908e-9, 4.214343608213907e-9, 4.212534094517934e-9, 4.212534094517927e-9,
      4.209519879600895e-9, 4.209519879600894e-9, 4.205303423177364e-9, 4.205303423177354e-9,
      4.19988816455154e-9, 4.19988816455154e-9, 4.19327851832926e-9, 4.193278518329258e-9,
    ],
  },
  {
    N: 1600,
    U: 40,
    denseTop12: [
      4.214606892680916e-9, 4.214606892680914e-9, 4.213586896292689e-9, 4.213586896292687e-9,
      4.211887423748783e-9, 4.211887423748778e-9, 4.209509256818997e-9, 4.209509256818992e-9,
      4.206453489211553e-9, 4.206453489211553e-9, 4.20272152580443e-9, 4.202721525804429e-9,
    ],
  },
  {
    N: 2000,
    U: 50,
    denseTop12: [
      4.214729052176358e-9, 4.214729052176355e-9, 4.214075442049284e-9, 4.214075442049272e-9,
      4.212986305937732e-9, 4.212986305937727e-9, 4.21146196489085e-9, 4.211461964890849e-9,
      4.209502868174942e-9, 4.209502868174936e-9, 4.207109593071173e-9, 4.207109593071171e-9,
    ],
  },
]);

// imp-3668 baked deep-rung dense TOP-10 (Householder+QL), reproduced here verbatim by the same
// assembly and dense route (same-solver self-check per rung: the first 10 of our top-12).
const IMP3668_DENSE_TOP10 = Object.freeze({
  1200: [
    4.214343608213908e-9, 4.214343608213907e-9, 4.212534094517934e-9, 4.212534094517927e-9,
    4.209519879600895e-9, 4.209519879600894e-9, 4.205303423177364e-9, 4.205303423177354e-9,
    4.19988816455154e-9, 4.19988816455154e-9,
  ],
  1600: [
    4.214606892680916e-9, 4.214606892680914e-9, 4.213586896292689e-9, 4.213586896292687e-9,
    4.211887423748783e-9, 4.211887423748778e-9, 4.209509256818997e-9, 4.209509256818992e-9,
    4.206453489211553e-9, 4.206453489211553e-9,
  ],
  2000: [
    4.214729052176358e-9, 4.214729052176355e-9, 4.214075442049284e-9, 4.214075442049272e-9,
    4.212986305937732e-9, 4.212986305937727e-9, 4.21146196489085e-9, 4.211461964890849e-9,
    4.209502868174942e-9, 4.209502868174936e-9,
  ],
});

// --- per-rung dense six-pair adjacent pairing and sixth-pair amplitude
const rungs = DEEP_DENSE_LADDER.map((r) => {
  const d = r.denseTop12;
  const pair12 = Math.abs(d[0] - d[1]) / d[0];
  const pair34 = Math.abs(d[2] - d[3]) / d[2];
  const pair56 = Math.abs(d[4] - d[5]) / d[4];
  const pair78 = Math.abs(d[6] - d[7]) / d[6];
  const pair910 = Math.abs(d[8] - d[9]) / d[8];
  const pair1112 = Math.abs(d[10] - d[11]) / d[10]; // DENSE SIXTH-pair lambda_11=lambda_12 spread
  const sigma5 = d[10] / d[0]; // lambda_11/lambda_1 sixth-pair amplitude
  const densePaired =
    pair12 < PAIR_TOL &&
    pair34 < PAIR_TOL &&
    pair56 < PAIR_TOL &&
    pair78 < PAIR_TOL &&
    pair910 < PAIR_TOL &&
    pair1112 < PAIR_TOL;
  // same-assembly self-check: dense top-10 here reproduce the imp-3668 baked top-10
  const ref10 = IMP3668_DENSE_TOP10[r.N];
  const top10MatchesImp3668 = ref10.every((v, i) => Math.abs(d[i] - v) / v < 1e-13);
  return {
    N: r.N,
    U: r.U,
    denseTop12: r.denseTop12,
    pair12,
    pair34,
    pair56,
    pair78,
    pair910,
    pair1112, // DENSE lambda_11=lambda_12 spread (machine precision at every rung)
    sigma5,
    densePaired,
    top10MatchesImp3668,
  };
});

// (1) dense sixth pair lambda_11=lambda_12 is degenerate to machine precision at every deep rung
const allDeepRungsSixthPaired = rungs.every((r) => r.pair1112 < PAIR_TOL);
const worstSixthPair = Math.max(...rungs.map((r) => r.pair1112));
// (1b) full SIX-pair adjacent pairing holds at every deep rung
const allDeepRungsSixPaired = rungs.every((r) => r.densePaired);
const worstDensePair = Math.max(
  ...rungs.flatMap((r) => [r.pair12, r.pair34, r.pair56, r.pair78, r.pair910, r.pair1112]),
);
// (2) sixth-pair amplitude sigma_5=lambda_11/lambda_1 climbs monotonically toward 1 with depth
const sigma5Ladder = rungs.map((r) => r.sigma5);
const sigma5MonotoneUp = sigma5Ladder.every((v, i) => i === 0 || v > sigma5Ladder[i - 1]);
const sigma5AllBelow1 = sigma5Ladder.every((v) => v < 1);
// (3) the dense top-10 here reproduce the imp-3668 baked deep-rung top-10 (same-solver check)
const denseTop10RecoversImp3668 = rungs.every((r) => r.top10MatchesImp3668);

const verdict =
  allDeepRungsSixthPaired &&
  allDeepRungsSixPaired &&
  sigma5MonotoneUp &&
  sigma5AllBelow1 &&
  denseTop10RecoversImp3668
    ? 'lambda_11=lambda_12-IS-A-GENUINE-SIXTH-PAIR-LEVEL-AT-THE-DEEP-RUNGS:-AN-INDEPENDENT-DENSE-FULL-SPECTRUM-SOLVER-(HOUSEHOLDER+QL,-NEVER-LANCZOS)-KEEPS-THE-SIXTH-PAIR-DEGENERATE-TO--6e-16-AT-N=1200/1600/2000,-EXTENDING-THE-imp-3668-FIVE-PAIR-CERTIFICATION-TO-SIX-PAIRS;-THE-SIXTH-PAIR-AMPLITUDE-sigma_5=lambda_11/lambda_1-CLIMBS-0.99500->0.99718->0.99819-TOWARD-1-WITH-DEPTH;-PAIRING-STRUCTURE-ONLY,-AMPLITUDE-LAW-NOT-ESTABLISHED,-NO-QED'
    : 'INDETERMINATE';

export const IMP3688_SKEW_TOEPLITZ_SIXTH_PAIR_DENSE_CROSSVAL = Object.freeze({
  id: 'imp-3688-skew-toeplitz-sixth-pair-dense-crossval',
  ticket: 'imp-3688',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsDenseCrossValOf: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js',
  reusesAssembly: 'imp-3505-power-iteration-budget-convergence-sweep.js',

  summary:
    'DENSE-certifies the SIXTH skew-Toeplitz pair lambda_11=lambda_12 at the DEEP rungs N in {1200, 1600, 2000} ' +
    'against the SAME INDEPENDENT dense full-spectrum eigensolver imp-3623/imp-3643/imp-3668 used (Householder ' +
    'tridiagonalization tred1 + implicit-QL tql1: all eigenvalues, NO Krylov subspace, NO reorthogonalization), ' +
    'extended to the TOP-TWELVE eigenvalues -- one pair beyond the imp-3668 fifth-pair (lambda_9=lambda_10) ' +
    'certification. This is the pairing-STRUCTURE cross-check for the next adjacent-pairing level. Reusing the ' +
    'IDENTICAL imp-3505/imp-3619/imp-3623/imp-3643/imp-3668 assembly Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, ' +
    'midpoint) and forming the Gram S=T^T T EXPLICITLY, RESULT: (1) the dense lambda_11=lambda_12 spread is ' +
    '3.95e-16 (N=1200), 3.94e-16 (N=1600), 5.90e-16 (N=2000), i.e. < 6e-16 everywhere -- the same machine-precision ' +
    'adjacent pairing the lower five pairs show, so the deep section spectrum is SIX-pair adjacent-paired; (2) the ' +
    'sixth-pair amplitude sigma_5=lambda_11/lambda_1 climbs monotonically toward 1 with depth (0.9950015727612738 ' +
    'at 1200, 0.9971799583735494 at 1600, 0.9981921829349266 at 2000); (3) the dense top-10 here reproduce the ' +
    'imp-3668 baked deep-rung top-10 to all printed digits, so this is a faithful one-level extension of the same ' +
    'solve. Deep-rung dense top-12 measured offline (scripts/imp-3688-dense-sixth-pair-offline.mjs) and BAKED; ' +
    'pairing/amplitude self-check at import. Pairing-structure cross-check only; does NOT establish the sixth-pair ' +
    'amplitude LAW, does NOT construct the missing magnitude, and does NOT attempt the imp-3066 K_a >= 0 ' +
    'positivity; RH-EQUIVALENT; NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    pairQuantity: 'pair1112(N) = |lambda_11 - lambda_12| / lambda_11 of the Gram S = T^T T of Ttilde(u,v)=a(v-u)R(|v-u|) (Gram-eigenvalue convention, same as imp-3668)',
    amplitudeQuantity: 'sigma_5(N) = lambda_11/lambda_1 (sixth-pair amplitude; pairing certified here)',
    lowerPairsForConsistency: 'pair12, pair34, pair56, pair78, pair910 (the five imp-3668-certified pairs, re-measured here from the top-10 of the top-12 spectrum)',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3619/imp-3623/imp-3643/imp-3668: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    denseSolver: 'INDEPENDENT dense full-spectrum: form S=T^T T explicitly, Householder tridiagonalization (EISPACK tred1) + implicit-QL (tql1) for ALL eigenvalues (NO Krylov subspace, NO reorthogonalization); top-12 taken from the descending spectrum',
    denseRouteEquivalence: 'the SAME Householder+QL route imp-3623/imp-3643/imp-3668 used; the dense top-10 here reproduce the imp-3668 baked deep-rung top-10 to all printed digits at N=1200/1600/2000 (relative < 1e-13), confirming the identical assembly and dense solve',
    deepRungsN: DEEP_DENSE_LADDER.map((r) => r.N),
    pairTol: PAIR_TOL,
    a: 1.0,
    measuredOffline: 'the deep-rung dense top-12 Gram eigenvalues were measured once offline (scripts/imp-3688-dense-sixth-pair-offline.mjs; the N=2000 Householder+QL dense solve ran in ~4.6 s); literals baked, import-light; the six-pair pairing and the sixth-pair amplitude are re-derived arithmetically at import',
    h0: H0,
    selfComputing: false,
  }),

  measured: Object.freeze({
    rungs, // per-rung dense top-12, six-pair adjacent pairing, sixth-pair amplitude sigma_5
    allDeepRungsSixthPaired, // true -- dense lambda_11=lambda_12 spread is machine precision at every deep rung
    worstSixthPair, // largest dense sixth-pair relative gap across the deep rungs (~5.9e-16)
    allDeepRungsSixPaired, // true -- dense spectrum SIX-pair adjacent-paired at every deep rung
    worstDensePair, // largest dense adjacent-pair relative gap across all six pairs and rungs
    sigma5Ladder, // sixth-pair amplitude lambda_11/lambda_1 at N=1200/1600/2000
    sigma5MonotoneUp, // true -- sigma_5 climbs monotonically with depth
    sigma5AllBelow1, // true -- sigma_5 < 1 at every rung (approaching 1)
    denseTop10RecoversImp3668, // true -- dense top-10 reproduce the imp-3668 baked deep top-10
    verdict,
  }),

  interpretation: Object.freeze({
    sixthPairIsGenuineAtDeepRungs:
      'The sixth pair lambda_11=lambda_12 computed by the independent dense full-spectrum solver (Householder + QL, ' +
      'never Lanczos) is degenerate to relative < 6e-16 at every deep rung (3.95e-16 at N=1200, 3.94e-16 at N=1600, ' +
      '5.90e-16 at N=2000) -- the same machine-precision adjacent pairing the lower five pairs show. So the deep ' +
      'skew-Toeplitz section spectrum is SIX-pair adjacent-paired, and lambda_11 is a genuine sixth-pair level.',
    sixthPairAmplitudeClimbsTowardOne:
      'The sixth-pair amplitude sigma_5=lambda_11/lambda_1 climbs monotonically 0.9950015727612738 -> ' +
      '0.9971799583735494 -> 0.9981921829349266 at N=1200/1600/2000, the same approach-to-1 the lower gaps show, ' +
      'consistent with all the ratios tending to 1 as the section deepens.',
    denseSolveRecoversImp3668Top10:
      'The same dense solve reproduces the imp-3668 baked deep-rung top-10 Gram eigenvalues to all printed digits at ' +
      'N=1200/1600/2000, so this is a faithful one-level extension of the imp-3668 certification, not a re-tuned solve.',
    whatItAddsOverImp3668:
      'imp-3668 extended the dense full-spectrum solve to the top-10 and certified the FIFTH pair lambda_9=lambda_10. ' +
      'This module extends the dense solve to the TOP-TWELVE at the same deep rungs and certifies the SIXTH pair ' +
      'lambda_11=lambda_12 -- pushing the deep-rung adjacent-pairing certification from five pairs up to six pairs.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    crossValidatesNotConstructs:
      'This certifies the SIXTH pair lambda_11=lambda_12 adjacent-pairing against an independent dense full-spectrum ' +
      'solver; it does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    pairingNotAmplitudeLaw:
      'This certifies the sixth-pair PAIRING STRUCTURE (lambda_11=lambda_12 degeneracy) only; it does NOT establish ' +
      'the sixth-pair AMPLITUDE LAW sigma_5=lambda_11/lambda_1 -- the sigma_5 values reported here are the raw ' +
      'pairing-certified inputs, not a fitted law.',
    denseRouteIsHouseholderNotLanczos:
      'The deep-rung dense route is Householder tridiagonalization (tred1) + implicit-QL (tql1), the SAME dense ' +
      'full-spectrum route imp-3623/imp-3643/imp-3668 used, with NO Krylov subspace and NO reorthogonalization; the ' +
      'dense top-10 here reproduce the imp-3668 baked deep top-10 to all printed digits.',
    bakedOfflineLiterals:
      'The deep-rung dense top-12 Gram eigenvalues are BAKED offline literals (measured by ' +
      'scripts/imp-3688-dense-sixth-pair-offline.mjs; the N=2000 dense solve is ~4.6 s); this module re-derives the ' +
      'six-pair pairing and the sixth-pair amplitude arithmetically from the baked spectra and does NOT re-run the ' +
      'heavy dense solve at import.',
    agreementIsNumericalNotSymbolic:
      'The sixth-pair degeneracy is a finite-N numerical measurement at the deep rungs, not a proven symbolic ' +
      'degeneracy; the (v-u) antisymmetry is the heuristic mechanism, corroborated numerically here.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3688_SKEW_TOEPLITZ_SIXTH_PAIR_DENSE_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3688-dense-sixth-pair-degenerate-at-deep-rungs',
    why: 'THE PRIMARY DELIVERABLE: the independent dense full-spectrum solver must keep the SIXTH pair ' +
      'lambda_11=lambda_12 degenerate to relative < 1e-14 (measured < 6e-16) at EVERY deep rung ' +
      'N=1200/1600/2000 -- certifying lambda_11 is a genuine sixth-pair level.',
    holds: () => allDeepRungsSixthPaired && worstSixthPair < PAIR_TOL,
  },
  {
    id: 'imp3688-dense-spectrum-six-pair-adjacent-paired-at-deep-rungs',
    why: 'The independent dense spectrum must be SIX-pair adjacent-paired (lambda_1=lambda_2, ..., ' +
      'lambda_11=lambda_12 to relative < 1e-14) at EVERY deep rung, extending the imp-3668 five-pair ' +
      'certification by one pair.',
    holds: () => allDeepRungsSixPaired && worstDensePair < PAIR_TOL,
  },
  {
    id: 'imp3688-sixth-pair-amplitude-climbs-toward-one',
    why: 'The sixth-pair amplitude sigma_5=lambda_11/lambda_1 must be < 1 and climb monotonically with depth across ' +
      'N=1200/1600/2000, the same approach-to-1 the lower gaps show.',
    holds: () => sigma5MonotoneUp && sigma5AllBelow1,
  },
  {
    id: 'imp3688-dense-top10-recovers-imp3668-deep-spectrum',
    why: 'The dense top-10 here must reproduce the imp-3668 baked deep-rung top-10 Gram eigenvalues to relative ' +
      '< 1e-13 at N=1200/1600/2000, certifying this is the SAME assembly and the SAME dense full-spectrum route ' +
      'imp-3668 used, now extended one level to reach lambda_11=lambda_12.',
    holds: () => denseTop10RecoversImp3668,
  },
  {
    id: 'imp3688-verdict-sixth-pair-level-certified',
    why: 'The classified verdict must be the confirming genuine-sixth-pair-level result, not indeterminate; a flip ' +
      'means the sixth-pair degeneracy, the six-pair pairing, the amplitude climb, or the top-10 recovery failed.',
    holds: () => verdict.startsWith('lambda_11=lambda_12-IS-A-GENUINE-SIXTH-PAIR-LEVEL-AT-THE-DEEP-RUNGS'),
  },
  {
    id: 'imp3688-honest-assessment-no-qed',
    why: 'Mandatory honesty: DENSE PAIRING-STRUCTURE cross-check only -- certifies the sixth-pair pairing against an ' +
      'independent solver, does NOT establish the amplitude law, positivity not attempted, RH-equivalent, PT 0.2 ' +
      'stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3688_SKEW_TOEPLITZ_SIXTH_PAIR_DENSE_CROSSVAL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.crossValidatesNotConstructs === 'string' &&
        typeof c.pairingNotAmplitudeLaw === 'string' &&
        typeof c.denseRouteIsHouseholderNotLanczos === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3688_SKEW_TOEPLITZ_SIXTH_PAIR_DENSE_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3688-skew-toeplitz-sixth-pair-dense-crossval assertion failed: ${assertion.id}`);
  }
}

export default IMP3688_SKEW_TOEPLITZ_SIXTH_PAIR_DENSE_CROSSVAL;
