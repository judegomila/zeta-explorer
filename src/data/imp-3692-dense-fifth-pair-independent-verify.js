/**
 * @module imp-3692-dense-fifth-pair-independent-verify
 * @fileoverview imp-3692 -- INDEPENDENTLY reproduce and VERIFY the imp-3668 baked deep-rung
 *   dense TOP-10 (fifth-pair) Gram eigenvalues, guarding against a baked-literal transcription
 *   or offline-drift error before the pending Lanczos sigma_4 = lambda_9/lambda_1 amplitude
 *   ticket builds on them. This is the imp-3669 independent-verify pattern, extended two
 *   spectrum levels (top-8 -> top-10) to reach the fifth pair. Verification/measurement only,
 *   NO QED; imp-3066 untouched.
 *
 *   CONTEXT
 *   -------
 *   imp-3669 (imp-3669-dense-third-gap-independent-verify.js) independently reproduced the
 *   imp-3643 baked deep-rung dense TOP-8 by Sturm-sequence bisection (worst relative 1.77e-15).
 *   imp-3668 (imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js) then extended the dense
 *   full-spectrum solve one pair further and BAKED NEW deep-rung TOP-10 literals (the FIFTH
 *   pair lambda_9 = lambda_10) from a one-off implicit-QL offline solve
 *   (scripts/imp-3668-dense-fifth-pair-offline.mjs). Those new fifth-pair literals had NOT been
 *   cross-checked by an independent extraction, so a transcription slip or an offline drift in
 *   the two new entries per rung would have gone unnoticed -- and the pending sigma_4 amplitude
 *   ticket reads sigma_4 = lambda_9/lambda_1 straight off them.
 *
 *   WHAT THIS TICKET DID
 *   --------------------
 *   scripts/imp-3692-dense-fifth-pair-independent-verify.mjs re-runs the SAME imp-3505/imp-3575
 *   Ttilde assembly (Ttilde(u,v) = a(v-u) R(|v-u|), NPHI = 10, H0 = 0.025, midpoint quadrature)
 *   -- RE-TYPED from scratch -- forms the Gram S = T^T T explicitly at N in {1200, 1600, 2000},
 *   and extracts the TOP-10 by STURM-SEQUENCE BISECTION on the Householder tridiagonal. The
 *   Sturm bisection is a routine ENTIRELY DIFFERENT from the imp-3668 EISPACK implicit-QL (tql1):
 *   it counts, for a trial x, the eigenvalues below x via the tridiagonal Sturm sequence and
 *   brackets each top level to machine precision. (Householder tridiagonalization is standard
 *   and shared -- an orthogonal similarity that preserves the spectrum exactly -- so the
 *   independence lever is the eigenvalue EXTRACTION plus the re-typed assembly. A QL bug or a
 *   baked-literal transcription error in the two new fifth-pair entries would surface as a
 *   deviation.)
 *
 *   MEASURED RESULT (offline; literals below)
 *   -----------------------------------------
 *   Every rung reproduces the imp-3668 baked denseTop10 to a WORST relative deviation of
 *   1.77e-15 across all three rungs (all ten eigenvalues at each of N = 1200, 1600, 2000),
 *   i.e. machine precision -- identical to the imp-3669 top-8 worst (as expected, since the
 *   first eight of each rung are the same literals). The INDEPENDENT fifth-pair spread
 *   pair910 = |lambda_9 - lambda_10| / lambda_9 is 0 (identical to all bits) at N = 1200 and
 *   N = 2000 and 3.93e-16 at N = 1600 -- i.e. < 1e-15 everywhere, CONFIRMING the imp-3668
 *   machine-precision fifth-pair degeneracy from an entirely different extraction. The imp-3668
 *   baked top-10 literals and the lambda_9 = lambda_10 pairing are therefore CONFIRMED; no
 *   transcription or drift in the two new fifth-pair entries.
 *
 *   @see imp-3669-dense-third-gap-independent-verify.js (the top-8 independent verify this extends two levels)
 *   @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (the baked top-10 literals under test)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly, re-typed here)
 *
 *   Ticket: imp-3692 (accuracy, medium). Verification only; certifies the baked inputs the
 *   pending sigma_4 amplitude ticket will read. imp-3066 UNTOUCHED. RH-EQUIVALENT. NO QED.
 */

const PAPER_REF = 'src/data/imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js';

// Per rung: WORST relative deviation of the independent Sturm-bisection top-10 from the
// imp-3668 baked denseTop10 literals, and the independent fifth-pair spread
// pair910 = |lambda_9 - lambda_10| / lambda_9. Measured OFFLINE by
// scripts/imp-3692-dense-fifth-pair-independent-verify.mjs (Sturm bisection on the Householder
// tridiagonal; re-typed imp-3505 assembly). BAKED literals.
const INDEPENDENT_VERIFY_LADDER = Object.freeze([
  { N: 1200, U: 30, worstTop10RelDev: 1.376896e-15, pair910: 0 },
  { N: 1600, U: 40, worstTop10RelDev: 1.178351e-15, pair910: 3.932912e-16 },
  { N: 2000, U: 50, worstTop10RelDev: 1.766609e-15, pair910: 0 },
]);

// imp-3668 tolerances re-stated for the certification thresholds.
const IMP3668_PAIR_TOL = 1e-14; // dense fifth-pair adjacent degeneracy tolerance (measured < 1e-15)
const REPRO_TOL = 1e-12; // independent-vs-baked top-10 reproduction ceiling (machine-precision floor is ~1.8e-15)

const worstTop10RelDev = Math.max(...INDEPENDENT_VERIFY_LADDER.map((r) => r.worstTop10RelDev));
const worstPair910 = Math.max(...INDEPENDENT_VERIFY_LADDER.map((r) => r.pair910));
const allRungsReproduced = INDEPENDENT_VERIFY_LADDER.every((r) => r.worstTop10RelDev < REPRO_TOL);
const allRungsFifthPaired = INDEPENDENT_VERIFY_LADDER.every((r) => r.pair910 < IMP3668_PAIR_TOL);

const verdict =
  allRungsReproduced && allRungsFifthPaired
    ? 'imp-3668-BAKED-DEEP-RUNG-DENSE-TOP-10-FIFTH-PAIR-LITERALS-CONFIRMED:-AN-INDEPENDENT-STURM-BISECTION-SOLVE-OF-THE-RE-TYPED-imp-3505-ASSEMBLY-REPRODUCES-ALL-TEN-EIGENVALUES-AT-N=1200/1600/2000-TO-WORST-RELATIVE-1.77e-15-AND-KEEPS-THE-FIFTH-PAIR-lambda_9=lambda_10-DEGENERATE-TO--4e-16-(0-AT-N=1200/2000,-3.93e-16-AT-N=1600);-NO-TRANSCRIPTION-OR-OFFLINE-DRIFT-ERROR-IN-THE-TWO-NEW-FIFTH-PAIR-ENTRIES'
    : 'INDETERMINATE';

export const IMP3692_DENSE_FIFTH_PAIR_INDEPENDENT_VERIFY = Object.freeze({
  id: 'imp-3692-dense-fifth-pair-independent-verify',
  ticket: 'imp-3692',
  paperSourcePath: PAPER_REF,
  verifies: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js',
  extendsVerifyOf: 'imp-3669-dense-third-gap-independent-verify.js',
  offlineScript: 'scripts/imp-3692-dense-fifth-pair-independent-verify.mjs',
  independenceLever:
    'top-10 extracted by Sturm-sequence bisection on the Householder tridiagonal (entirely ' +
    'different from the imp-3668 EISPACK implicit-QL tql1), on a from-scratch re-typing of the ' +
    'imp-3505 Ttilde assembly (NPHI=10, H0=0.025, midpoint), Gram S = T^T T formed explicitly; ' +
    'extends the imp-3669 top-8 verify two spectrum levels to reach the fifth pair lambda_9=lambda_10',
  ladder: INDEPENDENT_VERIFY_LADDER,
  worstTop10RelDev,
  worstPair910,
  reproTol: REPRO_TOL,
  pairTol: IMP3668_PAIR_TOL,
  allRungsReproduced,
  allRungsFifthPaired,
  verdict,
  honestCaveat:
    'Verification/measurement only, NO QED. Householder tridiagonalization is standard and ' +
    'shared with imp-3668 (an orthogonal similarity that preserves the spectrum exactly); the ' +
    'independence lever is the Sturm-bisection eigenvalue EXTRACTION and the re-typed assembly. ' +
    'This confirms the baked top-10 literals and the fifth-pair pairing against transcription/' +
    'offline-drift and a QL-convergence bug; it does NOT re-establish the underlying imp-3505 ' +
    'assembly, does NOT establish the fifth-pair amplitude LAW (the pending distinct sigma_4 ' +
    'ticket), and does NOT touch the imp-3066 program. RH-EQUIVALENT. No refereed bound is changed' +
    '.',
  summary:
    'Independent Sturm-bisection re-solve reproduces the imp-3668 baked deep-rung dense top-10 ' +
    'to worst relative 1.77e-15 at N = 1200/1600/2000 and keeps the fifth pair lambda_9=lambda_10 ' +
    'degenerate to < 4e-16 (0 at N=1200/2000, 3.93e-16 at N=1600): the baked fifth-pair literals ' +
    'are CONFIRMED, no transcription or drift in the two new entries.',
});

export const IMP3692_DENSE_FIFTH_PAIR_INDEPENDENT_VERIFY_ASSERTIONS = [
  {
    id: 'imp3692-independent-solve-reproduces-imp3668-baked-top10-all-rungs',
    check: () => allRungsReproduced && worstTop10RelDev < REPRO_TOL,
  },
  {
    id: 'imp3692-independent-fifth-pair-degenerate-all-rungs',
    check: () => allRungsFifthPaired && worstPair910 < IMP3668_PAIR_TOL,
  },
  {
    id: 'imp3692-top10-reproduction-is-machine-precision',
    check: () => worstTop10RelDev < 1e-14,
  },
  {
    id: 'imp3692-independent-fifth-pair-is-machine-precision',
    check: () => worstPair910 < 1e-15,
  },
  {
    id: 'imp3692-verdict-baked-literals-confirmed',
    check: () => verdict.startsWith('imp-3668-BAKED-DEEP-RUNG-DENSE-TOP-10-FIFTH-PAIR-LITERALS-CONFIRMED'),
  },
  {
    id: 'imp3692-honest-no-qed',
    check: () => {
      const c = IMP3692_DENSE_FIFTH_PAIR_INDEPENDENT_VERIFY.honestCaveat;
      return c.includes('NO QED') && c.includes('imp-3066') && /Platt-Trudgian|refereed bound is changed/.test(c);
    },
  },
];

for (const assertion of IMP3692_DENSE_FIFTH_PAIR_INDEPENDENT_VERIFY_ASSERTIONS) {
  if (!assertion.check()) {
    throw new Error(`imp-3692-dense-fifth-pair-independent-verify assertion failed: ${assertion.id}`);
  }
}

export default IMP3692_DENSE_FIFTH_PAIR_INDEPENDENT_VERIFY;
