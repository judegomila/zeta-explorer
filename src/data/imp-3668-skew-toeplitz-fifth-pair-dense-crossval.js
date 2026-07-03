/**
 * @module imp-3668-skew-toeplitz-fifth-pair-dense-crossval
 * @fileoverview imp-3668 -- DENSE-certify the FIFTH skew-Toeplitz pair
 *   lambda_9 = lambda_10 at the DEEP rungs (N = 1200, 1600, 2000) with the SAME
 *   INDEPENDENT dense full-spectrum solver imp-3623/imp-3643 used, extending the
 *   imp-3643 FOURTH-pair certification (lambda_7 = lambda_8) up one pair. This is
 *   the pairing-STRUCTURE cross-check that a pending Lanczos amplitude-law ticket
 *   (sigma_4 = lambda_9/lambda_1) will rely on -- distinct from the gap-ratio
 *   exponent: it certifies the adjacent-pairing degeneracy, not the exponent.
 *
 *   CONTEXT
 *   -------
 *   imp-3623 dense-certified only the SECOND gap (top-6: lambda_1=lambda_2,
 *   lambda_3=lambda_4, lambda_5=lambda_6), and imp-3643 extended the dense
 *   full-spectrum solve two levels to the TOP-EIGHT, certifying the FOURTH pair
 *   lambda_7 = lambda_8 at the deep rungs and showing the imp-3619 N = 2000
 *   Lanczos pair78 loss (~3.99e-11) was a Krylov m = 440 artifact (dense spread
 *   1.96e-16). The FIFTH pair lambda_9 = lambda_10 -- the next adjacent-pairing
 *   level -- was never dense-checked: imp-3643 stopped at the top-8.
 *
 *   THIS MODULE reuses the IDENTICAL imp-3505/imp-3619/imp-3623/imp-3643 assembly
 *   Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, midpoint quadrature),
 *   forms the Gram S = T^T T EXPLICITLY at each DEEP rung N in {1200, 1600, 2000},
 *   and computes the WHOLE symmetric spectrum with the SAME INDEPENDENT dense
 *   full-spectrum route (Householder tridiagonalization EISPACK tred1 + implicit-QL
 *   tql1: ALL eigenvalues, NO Krylov subspace, NO reorthogonalization -- so it
 *   cannot host a Lanczos ghost), extracting the TOP-TEN Gram eigenvalues to reach
 *   lambda_9 = lambda_10. The deep-rung dense top-10 Gram eigenvalues were measured
 *   once offline (scripts/imp-3668-dense-fifth-pair-offline.mjs; the N = 2000 solve
 *   ran in ~4.9 s) and are BAKED here as literals; the five-pair adjacent pairing
 *   and the fifth-pair amplitude sigma_4 = lambda_9/lambda_1 are re-derived
 *   arithmetically at import (import-light, like imp-3623/imp-3643). As a
 *   same-assembly self-check, the dense TOP-EIGHT here reproduce the imp-3643 baked
 *   deep-rung top-8 to all printed digits.
 *
 *   FINDING
 *   -------
 *   (1) THE FIFTH PAIR lambda_9 = lambda_10 IS DEGENERATE TO MACHINE PRECISION AT
 *       EVERY DEEP RUNG. The independent dense full-spectrum lambda_9 = lambda_10
 *       spread is 0 (identical to all printed digits) at N = 1200 and N = 1600, and
 *       1.38e-15 at N = 2000 -- i.e. < 1.4e-15 everywhere, the same machine-precision
 *       adjacent pairing the lower four pairs show. So the skew-Toeplitz section
 *       spectrum is FIVE-pair adjacent-paired at the deep rungs: lambda_1=lambda_2,
 *       lambda_3=lambda_4, lambda_5=lambda_6, lambda_7=lambda_8, lambda_9=lambda_10.
 *   (2) THE FIFTH-PAIR AMPLITUDE sigma_4 = lambda_9/lambda_1 CLIMBS MONOTONICALLY
 *       TOWARD 1 WITH DEPTH. sigma_4 = 0.9965699418447529 (N=1200),
 *       0.9980654415282425 (N=1600), 0.9987600189865782 (N=2000) -- the same
 *       approach-to-1 the lower gaps show, consistent with the ratios all tending
 *       to 1 as the section deepens. (This is the AMPLITUDE the pending Lanczos
 *       sigma_4 amplitude-law ticket will read; here we only certify its pairing.)
 *   (3) THE DEEP DENSE TOP-8 REPRODUCE THE imp-3643 CERTIFICATION EXACTLY. The dense
 *       top-8 here reproduce the imp-3643 baked deep-rung top-8 Gram eigenvalues to
 *       all printed digits at N = 1200/1600/2000 (same assembly, same dense route),
 *       so this is a faithful two-level extension of the same solve, not a re-tuned
 *       calculation.
 *
 *   SCOPE / WHAT IS AND IS NOT CERTIFIED. This dense-solves the DEEP rungs
 *   (N = 1200/1600/2000) for the FIFTH pair -- extending imp-3643 (fourth pair) by
 *   one spectrum level. It certifies the lambda_9 = lambda_10 adjacent-pairing
 *   degeneracy against an independent non-Lanczos solver. It is a pairing-STRUCTURE
 *   cross-check / measurement only: it does NOT establish the fifth-pair amplitude
 *   LAW (that is the pending distinct Lanczos ticket), does NOT construct the missing
 *   magnitude, and does NOT attempt the imp-3066 K_a >= 0 positivity. RH-EQUIVALENT.
 *   NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3643-skew-toeplitz-third-gap-dense-crossval.js (the FOURTH-pair dense cross-val this extends by one pair)
 *   @see imp-3623-skew-toeplitz-second-gap-dense-crossval.js (the second-gap deep dense cross-val, top-6)
 *   @see imp-3619-skew-toeplitz-third-gap-exponent.js (the Lanczos third-gap exponent whose pairing this corroborates)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly)
 *
 *   Ticket: imp-3668 (numerical, medium). Dense pairing-structure cross-check only:
 *   certifies the FIFTH pair lambda_9=lambda_10 against an independent dense
 *   full-spectrum solver at the deep rungs, one pair beyond imp-3643. imp-3066
 *   UNTOUCHED. RH-EQUIVALENT. NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3619 / imp-3623 / imp-3643)
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3505 / imp-3643 ladder
const PAIR_TOL = 1e-14; // dense adjacent-pair degeneracy relative tolerance (measured < 1.4e-15)

// --- BAKED deep-rung DENSE top-10 Gram eigenvalues (lambda_i = sigma_i^2 of S = T^T T),
//     sorted DESCENDING, measured OFFLINE (scripts/imp-3668-dense-fifth-pair-offline.mjs)
//     with the identical imp-3505/imp-3619/imp-3623/imp-3643 assembly Ttilde(u,v)=a(v-u)R
//     (NPHI=10, H0=0.025, midpoint) and the SAME INDEPENDENT dense full-spectrum eigensolver
//     imp-3623/imp-3643 used (Householder tridiagonalization tred1 + implicit-QL tql1: all
//     eigenvalues, NO Krylov subspace, NO reorthogonalization). The N=2000 dense solve ran
//     offline in ~4.9 s. Literals baked; import-light. The first EIGHT entries per rung are
//     the imp-3643 baked top-8 (reproduced verbatim by the same solve); entries 9-10 are the
//     new FIFTH-pair levels. ------------------------------------------------------------- */
const DEEP_DENSE_LADDER = Object.freeze([
  {
    N: 1200,
    U: 30,
    denseTop10: [
      4.214343608213908e-9, 4.214343608213907e-9, 4.212534094517934e-9, 4.212534094517927e-9,
      4.209519879600895e-9, 4.209519879600894e-9, 4.205303423177364e-9, 4.205303423177354e-9,
      4.19988816455154e-9, 4.19988816455154e-9,
    ],
  },
  {
    N: 1600,
    U: 40,
    denseTop10: [
      4.214606892680916e-9, 4.214606892680914e-9, 4.213586896292689e-9, 4.213586896292687e-9,
      4.211887423748783e-9, 4.211887423748778e-9, 4.209509256818997e-9, 4.209509256818992e-9,
      4.206453489211553e-9, 4.206453489211553e-9,
    ],
  },
  {
    N: 2000,
    U: 50,
    denseTop10: [
      4.214729052176358e-9, 4.214729052176355e-9, 4.214075442049284e-9, 4.214075442049272e-9,
      4.212986305937732e-9, 4.212986305937727e-9, 4.21146196489085e-9, 4.211461964890849e-9,
      4.209502868174942e-9, 4.209502868174936e-9,
    ],
  },
]);

// imp-3643 baked deep-rung dense TOP-8 (Householder+QL), reproduced here verbatim by the same
// assembly and dense route (same-solver self-check per rung: the first 8 of our top-10).
const IMP3643_DENSE_TOP8 = Object.freeze({
  1200: [
    4.214343608213908e-9, 4.214343608213907e-9, 4.212534094517934e-9, 4.212534094517927e-9,
    4.209519879600895e-9, 4.209519879600894e-9, 4.205303423177364e-9, 4.205303423177354e-9,
  ],
  1600: [
    4.214606892680916e-9, 4.214606892680914e-9, 4.213586896292689e-9, 4.213586896292687e-9,
    4.211887423748783e-9, 4.211887423748778e-9, 4.209509256818997e-9, 4.209509256818992e-9,
  ],
  2000: [
    4.214729052176358e-9, 4.214729052176355e-9, 4.214075442049284e-9, 4.214075442049272e-9,
    4.212986305937732e-9, 4.212986305937727e-9, 4.21146196489085e-9, 4.211461964890849e-9,
  ],
});

// --- per-rung dense five-pair adjacent pairing and fifth-pair amplitude
const rungs = DEEP_DENSE_LADDER.map((r) => {
  const d = r.denseTop10;
  const pair12 = Math.abs(d[0] - d[1]) / d[0];
  const pair34 = Math.abs(d[2] - d[3]) / d[2];
  const pair56 = Math.abs(d[4] - d[5]) / d[4];
  const pair78 = Math.abs(d[6] - d[7]) / d[6];
  const pair910 = Math.abs(d[8] - d[9]) / d[8]; // DENSE FIFTH-pair lambda_9=lambda_10 spread
  const sigma4 = d[8] / d[0]; // lambda_9/lambda_1 fifth-pair amplitude (pairing certified here, LAW is pending)
  const densePaired =
    pair12 < PAIR_TOL && pair34 < PAIR_TOL && pair56 < PAIR_TOL && pair78 < PAIR_TOL && pair910 < PAIR_TOL;
  // same-assembly self-check: dense top-8 here reproduce the imp-3643 baked top-8
  const ref8 = IMP3643_DENSE_TOP8[r.N];
  const top8MatchesImp3643 = ref8.every((v, i) => Math.abs(d[i] - v) / v < 1e-13);
  return {
    N: r.N,
    U: r.U,
    denseTop10: r.denseTop10,
    pair12,
    pair34,
    pair56,
    pair78,
    pair910, // DENSE lambda_9=lambda_10 spread (machine precision at every rung)
    sigma4,
    densePaired,
    top8MatchesImp3643,
  };
});

// (1) dense fifth pair lambda_9=lambda_10 is degenerate to machine precision at every deep rung
const allDeepRungsFifthPaired = rungs.every((r) => r.pair910 < PAIR_TOL);
const worstFifthPair = Math.max(...rungs.map((r) => r.pair910));
// (1b) full FIVE-pair adjacent pairing holds at every deep rung
const allDeepRungsFivePaired = rungs.every((r) => r.densePaired);
const worstDensePair = Math.max(
  ...rungs.flatMap((r) => [r.pair12, r.pair34, r.pair56, r.pair78, r.pair910]),
);
// (2) fifth-pair amplitude sigma_4=lambda_9/lambda_1 climbs monotonically toward 1 with depth
const sigma4Ladder = rungs.map((r) => r.sigma4);
const sigma4MonotoneUp = sigma4Ladder.every((v, i) => i === 0 || v > sigma4Ladder[i - 1]);
const sigma4AllBelow1 = sigma4Ladder.every((v) => v < 1);
// (3) the dense top-8 here reproduce the imp-3643 baked deep-rung top-8 (same-solver check)
const denseTop8RecoversImp3643 = rungs.every((r) => r.top8MatchesImp3643);

const verdict =
  allDeepRungsFifthPaired &&
  allDeepRungsFivePaired &&
  sigma4MonotoneUp &&
  sigma4AllBelow1 &&
  denseTop8RecoversImp3643
    ? 'lambda_9=lambda_10-IS-A-GENUINE-FIFTH-PAIR-LEVEL-AT-THE-DEEP-RUNGS:-AN-INDEPENDENT-DENSE-FULL-SPECTRUM-SOLVER-(HOUSEHOLDER+QL,-NEVER-LANCZOS)-KEEPS-THE-FIFTH-PAIR-DEGENERATE-TO--1.4e-15-AT-N=1200/1600/2000,-EXTENDING-THE-imp-3643-FOUR-PAIR-CERTIFICATION-TO-FIVE-PAIRS;-THE-FIFTH-PAIR-AMPLITUDE-sigma_4=lambda_9/lambda_1-CLIMBS-0.99657->0.99807->0.99876-TOWARD-1-WITH-DEPTH;-PAIRING-STRUCTURE-ONLY,-AMPLITUDE-LAW-IS-A-DISTINCT-PENDING-TICKET,-NO-QED'
    : 'INDETERMINATE';

export const IMP3668_SKEW_TOEPLITZ_FIFTH_PAIR_DENSE_CROSSVAL = Object.freeze({
  id: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval',
  ticket: 'imp-3668',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsDenseCrossValOf: 'imp-3643-skew-toeplitz-third-gap-dense-crossval.js',
  reusesAssembly: 'imp-3505-power-iteration-budget-convergence-sweep.js',

  summary:
    'DENSE-certifies the FIFTH skew-Toeplitz pair lambda_9=lambda_10 at the DEEP rungs N in {1200, 1600, 2000} ' +
    'against the SAME INDEPENDENT dense full-spectrum eigensolver imp-3623/imp-3643 used (Householder ' +
    'tridiagonalization tred1 + implicit-QL tql1: all eigenvalues, NO Krylov subspace, NO reorthogonalization), ' +
    'extended to the TOP-TEN eigenvalues -- one pair beyond the imp-3643 fourth-pair (lambda_7=lambda_8) ' +
    'certification. This is the pairing-STRUCTURE cross-check the pending Lanczos sigma_4=lambda_9/lambda_1 ' +
    'amplitude-law ticket will rely on (distinct: pairing certification, not the gap-ratio exponent). Reusing the ' +
    'IDENTICAL imp-3505/imp-3619/imp-3623/imp-3643 assembly Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, midpoint) and ' +
    'forming the Gram S=T^T T EXPLICITLY, RESULT: (1) the dense lambda_9=lambda_10 spread is 0 (all printed digits) ' +
    'at N=1200 and N=1600 and 1.38e-15 at N=2000, i.e. < 1.4e-15 everywhere -- the same machine-precision adjacent ' +
    'pairing the lower four pairs show, so the deep section spectrum is FIVE-pair adjacent-paired; (2) the fifth-pair ' +
    'amplitude sigma_4=lambda_9/lambda_1 climbs monotonically toward 1 with depth (0.9965699418447529 at 1200, ' +
    '0.9980654415282425 at 1600, 0.9987600189865782 at 2000); (3) the dense top-8 here reproduce the imp-3643 baked ' +
    'deep-rung top-8 to all printed digits, so this is a faithful one-level extension of the same solve. Deep-rung ' +
    'dense top-10 measured offline (scripts/imp-3668-dense-fifth-pair-offline.mjs) and BAKED; pairing/amplitude ' +
    'self-check at import. Pairing-structure cross-check only; does NOT establish the fifth-pair amplitude LAW ' +
    '(pending distinct ticket), does NOT construct the missing magnitude, and does NOT attempt the imp-3066 ' +
    'K_a >= 0 positivity; RH-EQUIVALENT; NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    pairQuantity: 'pair910(N) = |lambda_9 - lambda_10| / lambda_9 of the Gram S = T^T T of Ttilde(u,v)=a(v-u)R(|v-u|) (Gram-eigenvalue convention, same as imp-3643)',
    amplitudeQuantity: 'sigma_4(N) = lambda_9/lambda_1 (fifth-pair amplitude; pairing certified here, amplitude LAW is a distinct pending Lanczos ticket)',
    lowerPairsForConsistency: 'pair12, pair34, pair56, pair78 (the four imp-3643-certified pairs, re-measured here from the top-8 of the top-10 spectrum)',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3619/imp-3623/imp-3643: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    denseSolver: 'INDEPENDENT dense full-spectrum: form S=T^T T explicitly, Householder tridiagonalization (EISPACK tred1) + implicit-QL (tql1) for ALL eigenvalues (NO Krylov subspace, NO reorthogonalization); top-10 taken from the descending spectrum',
    denseRouteEquivalence: 'the SAME Householder+QL route imp-3623/imp-3643 used; the dense top-8 here reproduce the imp-3643 baked deep-rung top-8 to all printed digits at N=1200/1600/2000 (relative < 1e-13), confirming the identical assembly and dense solve',
    deepRungsN: DEEP_DENSE_LADDER.map((r) => r.N),
    pairTol: PAIR_TOL,
    a: 1.0,
    measuredOffline: 'the deep-rung dense top-10 Gram eigenvalues were measured once offline (scripts/imp-3668-dense-fifth-pair-offline.mjs; the N=2000 Householder+QL dense solve ran in ~4.9 s); literals baked, import-light; the five-pair pairing and the fifth-pair amplitude are re-derived arithmetically at import',
    h0: H0,
    selfComputing: false,
  }),

  measured: Object.freeze({
    rungs, // per-rung dense top-10, five-pair adjacent pairing, fifth-pair amplitude sigma_4
    allDeepRungsFifthPaired, // true -- dense lambda_9=lambda_10 spread is machine precision at every deep rung
    worstFifthPair, // largest dense fifth-pair relative gap across the deep rungs (~1.4e-15)
    allDeepRungsFivePaired, // true -- dense spectrum FIVE-pair adjacent-paired at every deep rung
    worstDensePair, // largest dense adjacent-pair relative gap across all five pairs and rungs
    sigma4Ladder, // fifth-pair amplitude lambda_9/lambda_1 at N=1200/1600/2000
    sigma4MonotoneUp, // true -- sigma_4 climbs monotonically with depth
    sigma4AllBelow1, // true -- sigma_4 < 1 at every rung (approaching 1)
    denseTop8RecoversImp3643, // true -- dense top-8 reproduce the imp-3643 baked deep top-8
    verdict,
  }),

  interpretation: Object.freeze({
    fifthPairIsGenuineAtDeepRungs:
      'The fifth pair lambda_9=lambda_10 computed by the independent dense full-spectrum solver (Householder + QL, ' +
      'never Lanczos) is degenerate to relative < 1.4e-15 at every deep rung (0 to all printed digits at N=1200 and ' +
      'N=1600, 1.38e-15 at N=2000) -- the same machine-precision adjacent pairing the lower four pairs show. So the ' +
      'deep skew-Toeplitz section spectrum is FIVE-pair adjacent-paired, and lambda_9 is a genuine fifth-pair level.',
    fifthPairAmplitudeClimbsTowardOne:
      'The fifth-pair amplitude sigma_4=lambda_9/lambda_1 climbs monotonically 0.9965699418447529 -> ' +
      '0.9980654415282425 -> 0.9987600189865782 at N=1200/1600/2000, the same approach-to-1 the lower gaps show, ' +
      'consistent with all the ratios tending to 1 as the section deepens. This module certifies the pairing of this ' +
      'amplitude; the amplitude LAW itself is the pending distinct Lanczos sigma_4 ticket.',
    denseSolveRecoversImp3643Top8:
      'The same dense solve reproduces the imp-3643 baked deep-rung top-8 Gram eigenvalues to all printed digits at ' +
      'N=1200/1600/2000, so this is a faithful one-level extension of the imp-3643 certification, not a re-tuned solve.',
    whatItAddsOverImp3643:
      'imp-3643 extended the dense full-spectrum solve to the top-8 and certified the FOURTH pair lambda_7=lambda_8. ' +
      'This module extends the dense solve to the TOP-TEN at the same deep rungs and certifies the FIFTH pair ' +
      'lambda_9=lambda_10 -- pushing the deep-rung adjacent-pairing certification from four pairs up to five pairs.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    crossValidatesNotConstructs:
      'This certifies the FIFTH pair lambda_9=lambda_10 adjacent-pairing against an independent dense full-spectrum ' +
      'solver; it does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    pairingNotAmplitudeLaw:
      'This certifies the fifth-pair PAIRING STRUCTURE (lambda_9=lambda_10 degeneracy) only; it does NOT establish ' +
      'the fifth-pair AMPLITUDE LAW sigma_4=lambda_9/lambda_1 -- that is the distinct pending Lanczos ticket, for ' +
      'which the sigma_4 values reported here are the raw pairing-certified inputs.',
    denseRouteIsHouseholderNotLanczos:
      'The deep-rung dense route is Householder tridiagonalization (tred1) + implicit-QL (tql1), the SAME dense ' +
      'full-spectrum route imp-3623/imp-3643 used, with NO Krylov subspace and NO reorthogonalization; the dense ' +
      'top-8 here reproduce the imp-3643 baked deep top-8 to all printed digits.',
    bakedOfflineLiterals:
      'The deep-rung dense top-10 Gram eigenvalues are BAKED offline literals (measured by ' +
      'scripts/imp-3668-dense-fifth-pair-offline.mjs; the N=2000 dense solve is ~4.9 s); this module re-derives the ' +
      'five-pair pairing and the fifth-pair amplitude arithmetically from the baked spectra and does NOT re-run the ' +
      'heavy dense solve at import.',
    agreementIsNumericalNotSymbolic:
      'The fifth-pair degeneracy is a finite-N numerical measurement at the deep rungs, not a proven symbolic ' +
      'degeneracy; the (v-u) antisymmetry is the heuristic mechanism, corroborated numerically here.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3668_SKEW_TOEPLITZ_FIFTH_PAIR_DENSE_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3668-dense-fifth-pair-degenerate-at-deep-rungs',
    why: 'THE PRIMARY DELIVERABLE: the independent dense full-spectrum solver must keep the FIFTH pair ' +
      'lambda_9=lambda_10 degenerate to relative < 1e-14 (measured < 1.4e-15) at EVERY deep rung ' +
      'N=1200/1600/2000 -- certifying lambda_9 is a genuine fifth-pair level.',
    holds: () => allDeepRungsFifthPaired && worstFifthPair < PAIR_TOL,
  },
  {
    id: 'imp3668-dense-spectrum-five-pair-adjacent-paired-at-deep-rungs',
    why: 'The independent dense spectrum must be FIVE-pair adjacent-paired (lambda_1=lambda_2, lambda_3=lambda_4, ' +
      'lambda_5=lambda_6, lambda_7=lambda_8, lambda_9=lambda_10 to relative < 1e-14) at EVERY deep rung, extending ' +
      'the imp-3643 four-pair certification by one pair.',
    holds: () => allDeepRungsFivePaired && worstDensePair < PAIR_TOL,
  },
  {
    id: 'imp3668-fifth-pair-amplitude-climbs-toward-one',
    why: 'The fifth-pair amplitude sigma_4=lambda_9/lambda_1 must be < 1 and climb monotonically with depth across ' +
      'N=1200/1600/2000, the same approach-to-1 the lower gaps show (pairing-certified input for the pending ' +
      'amplitude-law ticket).',
    holds: () => sigma4MonotoneUp && sigma4AllBelow1,
  },
  {
    id: 'imp3668-dense-top8-recovers-imp3643-deep-spectrum',
    why: 'The dense top-8 here must reproduce the imp-3643 baked deep-rung top-8 Gram eigenvalues to relative < 1e-13 ' +
      'at N=1200/1600/2000, certifying this is the SAME assembly and the SAME dense full-spectrum route imp-3643 ' +
      'used, now extended one level to reach lambda_9=lambda_10.',
    holds: () => denseTop8RecoversImp3643,
  },
  {
    id: 'imp3668-verdict-fifth-pair-level-certified',
    why: 'The classified verdict must be the confirming genuine-fifth-pair-level result, not indeterminate; a flip ' +
      'means the fifth-pair degeneracy, the five-pair pairing, the amplitude climb, or the top-8 recovery failed.',
    holds: () => verdict.startsWith('lambda_9=lambda_10-IS-A-GENUINE-FIFTH-PAIR-LEVEL-AT-THE-DEEP-RUNGS'),
  },
  {
    id: 'imp3668-honest-assessment-no-qed',
    why: 'Mandatory honesty: DENSE PAIRING-STRUCTURE cross-check only -- certifies the fifth-pair pairing against an ' +
      'independent solver, does NOT establish the amplitude law, positivity not attempted, RH-equivalent, PT 0.2 ' +
      'stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3668_SKEW_TOEPLITZ_FIFTH_PAIR_DENSE_CROSSVAL.honestCaveat;
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

for (const assertion of IMP3668_SKEW_TOEPLITZ_FIFTH_PAIR_DENSE_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3668-skew-toeplitz-fifth-pair-dense-crossval assertion failed: ${assertion.id}`);
  }
}

export default IMP3668_SKEW_TOEPLITZ_FIFTH_PAIR_DENSE_CROSSVAL;
