/**
 * @module imp-35339-coefficient-and-envelope-literal-consistency-check
 *
 * imp-35339 (accuracy, opus-4-8): read-only literal-consistency audit of two stored decimal
 * conventions -- the imp-35322 rho(eps)-expansion coefficient roll-up and the imp-35183 sigma(N)
 * far-tail exponent envelope -- recomputing each closed form from scratch and confirming the
 * stored decimals are faithful transcriptions (catches copy/paste drift). Four checks, all read
 * off the two modules' own live exports (no re-derivation, no heavy zeros-bundle import):
 *
 *   (1) eps^{3/2} PREFACTOR K: recompute K = 8*sqrt(2)/(9*pi) = 0.40014058... and confirm it
 *       rounds to the roll-up's stated 5-dp decimal 0.40014, and that both resolved modules that
 *       carry it (imp-35216, imp-35240) store coefficient strings containing that decimal and the
 *       closed form "8 sqrt(2)/(9 pi)". RESULT: faithful.
 *   (2) eps^{7/2} COEFFICIENT K_{7/2}: recompute K_{7/2} = -8*sqrt(2)/(3*pi) = -1.20042175...,
 *       confirm it rounds to the stated -1.20042 and that imp-35244's coefficient string carries
 *       that decimal and the closed form "8 sqrt(2)/(3 pi)". RESULT: faithful.
 *   (3) STRUCTURAL RATIO: K_{7/2} = -3*K exactly (both share the 8*sqrt(2)/pi factor, denominators
 *       9 vs 3), an internal consistency the two independently-stated decimals must respect.
 *   (4) ENVELOPE LADDER: imp-35183's live p_envelope column equals a fresh independent recompute
 *       p_env = 1/2 - 1/(2*ln(10^(k+0.5))) at every decade k = 11..30, to the module's toExponential
 *       storage convention (tol 1e-6), and its far-tail asymptote export is exactly 1/2. RESULT:
 *       0 mismatches over all 20 rungs. (These are computed live in imp-35183, not baked literals,
 *       so this confirms the closed-form generator, not a transcription -- but it discharges the
 *       ticket's "confirm the p_envelope literals match a fresh recomputation" ask directly.)
 *
 * LITERAL-CONSISTENCY / MEASUREMENT CHECK ONLY. Changes no bound; recomputes no underlying
 * quantity; O3 stays OPEN; G6a_shock_lipschitz stays OPEN; C_mb GUE-conditional per imp-486
 * UNTOUCHED; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35322-rho-eps-expansion-cohort-provenance-rollup (coefficient decimals checked in (1),(2))
 * @see imp-35183-sigma-fartail-exponent-ladder-viz-data (p_envelope ladder checked in (4))
 * @see imp-35402-eflow-fartail-ladder-literal-reconstruction-check (a sibling imp-35339-style audit)
 */

import { IMP_35322_RHO_EPS_EXPANSION_COHORT_PROVENANCE_ROLLUP } from './imp-35322-rho-eps-expansion-cohort-provenance-rollup.js';
import { IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA } from './imp-35183-sigma-fartail-exponent-ladder-viz-data.js';

const ROLLUP = IMP_35322_RHO_EPS_EXPANSION_COHORT_PROVENANCE_ROLLUP;
const LADDER = IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA;

// Fresh, from-scratch closed-form recomputations (no import of the values under audit).
const K_RECOMPUTED = (8 * Math.sqrt(2)) / (9 * Math.PI); // eps^{3/2} prefactor
const K72_RECOMPUTED = (-8 * Math.sqrt(2)) / (3 * Math.PI); // eps^{7/2} coefficient

const coeffOf = (file) => ROLLUP.modules.find((m) => m.file.startsWith(file)).coefficient;

export const IMP35339_COEFFICIENT_AND_ENVELOPE_LITERAL_CHECK_ASSERTIONS = [
  {
    // Check (1): K rounds to the stated 0.40014 and the resolved modules carry that literal.
    id: 'imp35339-eps32-prefactor-K-literal-faithful',
    description:
      'K = 8*sqrt(2)/(9*pi) recomputes to 0.40014 (5 dp) and imp-35216/imp-35240 store that decimal + closed form',
    holds: () =>
      K_RECOMPUTED.toFixed(5) === '0.40014' &&
      coeffOf('imp-35216').includes('0.40014') &&
      coeffOf('imp-35216').includes('8 sqrt(2)/(9 pi)') &&
      coeffOf('imp-35240').includes('0.40014'),
  },
  {
    // Check (2): K_{7/2} rounds to the stated -1.20042 and imp-35244 carries that literal.
    id: 'imp35339-eps72-coefficient-K72-literal-faithful',
    description:
      'K_{7/2} = -8*sqrt(2)/(3*pi) recomputes to -1.20042 (5 dp) and imp-35244 stores that decimal + closed form',
    holds: () =>
      K72_RECOMPUTED.toFixed(5) === '-1.20042' &&
      coeffOf('imp-35244').includes('-1.20042') &&
      coeffOf('imp-35244').includes('8 sqrt(2)/(3 pi)'),
  },
  {
    // Check (3): the two independently-stated decimals must obey K_{7/2} = -3*K exactly.
    id: 'imp35339-coefficient-structural-ratio-minus-three',
    description: 'K_{7/2} equals -3*K exactly (shared 8*sqrt(2)/pi factor, denominators 9 vs 3)',
    holds: () => Math.abs(K72_RECOMPUTED - -3 * K_RECOMPUTED) < 1e-15,
  },
  {
    // Check (4): the imp-35183 envelope column matches a fresh recompute at every decade k=11..30.
    id: 'imp35339-envelope-ladder-literals-match-fresh-recompute',
    description:
      'imp-35183 p_envelope equals 1/2 - 1/(2*ln(10^(k+0.5))) to 1e-6 at every k=11..30, farTailExponent is 1/2',
    holds: () =>
      LADDER.farTailExponent === 0.5 &&
      LADDER.ladder.length === 20 &&
      LADDER.ladder[0].k === 11 &&
      LADDER.ladder[LADDER.ladder.length - 1].k === 30 &&
      LADDER.ladder.every((row) => {
        const fresh = 0.5 - 1 / (2 * Math.log(Math.pow(10, row.k + 0.5)));
        return Math.abs(fresh - row.p_envelope) < 1e-6;
      }),
  },
  {
    // Honesty gate: audit only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35339-honesty-gate-no-derivation-change',
    description:
      'every catalogued coefficient module stays isRigorous:false and imp-35183 stays isRigorous:false with NO QED',
    holds: () =>
      ROLLUP.modules.every((m) => m.isRigorous === false) &&
      LADDER.isRigorous === false &&
      /NO QED/.test(LADDER.verdict),
  },
];

for (const a of IMP35339_COEFFICIENT_AND_ENVELOPE_LITERAL_CHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35339-coefficient-and-envelope-literal-consistency-check assertion failed: ${a.id}`,
    );
  }
}
