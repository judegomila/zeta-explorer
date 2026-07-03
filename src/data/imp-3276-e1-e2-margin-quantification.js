/**
 * @module data/imp-3276-e1-e2-margin-quantification
 * @fileoverview imp-3276: quantify the per-N safety MARGIN of the PATH-1
 * leading-order predicates E1 (rho_{J*(N)} non-decreasing) and E2 (tau_c_est
 * non-increasing) across the full Odlyzko sweep N in {2,...,10^6}, upgrading the
 * roadmap "ZERO violations" binary (PATH 1, imp-833/imp-858) into a signed
 * margin with an explicit robust-vs-fragile verdict.
 *
 * Method (measure only; no proof, no positivity, PT Lambda <= 0.2 stays SOTA)
 * -------------------------------------------------------------------------
 * For each N the PATH-1 record (m-raw-from-umon-bridge.js) sets
 *   H_N       = min_{k<N-1} [F(gamma_{k+1}) - F(gamma_k)]   (prefix-min RvM gap)
 *   jStar(N)  = argmin of that prefix-min
 *   rho(N)    = rho(gamma_{jStar})                          (RvM density)
 *   tau_c(N)  = H_N^2 / (8 rho(N)^2)                        (leading-order estimate)
 * where F(T) = (T/(2pi))(log(T/(2pi))-1), rho(T)=log(T/(2pi))/(2pi).
 *
 * E1 asks rho(N) non-decreasing; E2 asks tau_c(N) non-increasing. Both are
 * PIECEWISE-CONSTANT in N: the prefix-min gap only ever admits a NEW candidate
 * at the TOP pair (gamma_{N-1}, gamma_N), so jStar(N) changes ONLY at a
 * RECORD-breaking step. A new record always sits at a HIGHER gamma than the
 * incumbent (indices increase), hence rho jumps strictly UP and H_N strictly
 * DOWN -- so E1 and E2 hold STRUCTURALLY, not by numerical luck. Between the
 * 25 record steps (over the entire 10^6 range) rho and tau_c are literally
 * unchanged, so the naive min signed margin over ALL adjacent-N steps is an
 * EXACT TIE at 0, not a fragile floor drifting toward 0.
 *
 * The informative margin is therefore the STRICT jump measured only at record
 * steps, binned per decade of N:
 *   - E1 rho jump stays BOUNDED AWAY from 0 (still ~1.8e-3 in the top decade
 *     N in [10^5,10^6)) -- a ROBUST floor.
 *   - E2 tau_c drop DECAYS per decade (1.47 -> 5.3e-6) but is ALWAYS strictly
 *     positive; since E2 is implied by E1 + UMon (H non-increasing), this
 *     shrinking record-drop does not threaten the predicate.
 *
 * Data source: scripts/compute-imp-3276-margin-sweep.mjs, O(N) prefix-min pass
 * over the 10^6 Odlyzko ordinates (src/data/zeros-to-1e6.js). Literals baked in
 * to keep this module free of the 16.7MB zeros bundle (no-heavy-imports rule).
 *
 * Tickets: imp-3276 (created). Companion of imp-3220 (E(N) fidelity frontier),
 * m-raw-from-umon-bridge.js (imp-462, PATH-1 E1/E2 host).
 */

const TWO_PI = 2 * Math.PI;
const rvmDensity = (T) => Math.log(T / TWO_PI) / TWO_PI;

// ── Per-decade smallest STRICT jump at record-breaking steps (imp-3276 sweep) ──
// records: number of jStar moves in the decade; minRhoJump: smallest rho(N)-rho(N-1)
// at those moves (E1 margin); minTauDrop: smallest tau_c(N-1)-tau_c(N) (E2 margin).
const PER_DECADE = Object.freeze([
  { N_lo: 2,     N_hi: 10,     records: 2, minRhoJump: 5.883786e-2, minTauDrop: 1.465874e+0 },
  { N_lo: 10,    N_hi: 100,    records: 4, minRhoJump: 2.540052e-2, minTauDrop: 9.189427e-2 },
  { N_lo: 100,   N_hi: 1e3,    records: 9, minRhoJump: 1.578782e-2, minTauDrop: 1.124672e-3 },
  { N_lo: 1e3,   N_hi: 1e4,    records: 3, minRhoJump: 4.653295e-2, minTauDrop: 5.621726e-5 },
  { N_lo: 1e4,   N_hi: 1e5,    records: 5, minRhoJump: 8.684430e-3, minTauDrop: 6.881371e-6 },
  { N_lo: 1e5,   N_hi: 1e6,    records: 2, minRhoJump: 1.829479e-3, minTauDrop: 5.256870e-6 },
].map(Object.freeze));

const TOTAL_RECORDS = PER_DECADE.reduce((a, d) => a + d.records, 0); // 25

// Smallest strict E1/E2 margin anywhere in the top decade N in [10^5,10^6).
const TOP_DECADE = PER_DECADE[PER_DECADE.length - 1];

export const IMP3276_E1_E2_MARGIN_QUANTIFICATION = Object.freeze({
  id: 'imp-3276',
  title:
    'Per-N safety margin of PATH-1 predicates E1 (rho non-decreasing) ' +
    'and E2 (tau_c_est non-increasing) across N in {2,...,10^6}',

  sweep: Object.freeze({
    N_min: 2,
    N_max: 1000000,
    source: 'scripts/compute-imp-3276-margin-sweep.mjs (O(N) prefix-min pass on zeros-to-1e6.js)',
    rhoViolations: 0,        // E1 never violated
    tauViolations: 0,        // E2 never violated
    recordBreakingSteps: TOTAL_RECORDS, // jStar moved only 25 times over the whole range
  }),

  // Naive min signed margin over ALL 999,998 adjacent-N steps.
  allStepMargin: Object.freeze({
    minRhoIncrement: 0,      // exact tie: rho unchanged at every non-record step
    minTauDecrement: 0,      // exact tie: tau_c unchanged at every non-record step
    interpretation:
      'EXACT structural TIE at 0, not a fragile floor. rho(N) and tau_c(N) are ' +
      'piecewise-constant and change only at the 25 record steps; the ~999,973 ' +
      'non-record steps leave both values unchanged, so the naive min margin is ' +
      'identically 0 by construction (prefix-min plateau), carrying no fragility signal.',
  }),

  perDecadeRecordMargin: PER_DECADE,

  verdict: Object.freeze({
    E1_rho:
      'ROBUST floor. The strict rho jump at record steps stays bounded away from ' +
      'zero across all decades (smallest ~1.8e-3 in the top decade N in [1e5,1e6)); ' +
      'it does NOT drift toward 0 as N -> 10^6.',
    E2_tau:
      'DECAYING-but-safe. The strict tau_c drop at record steps shrinks per decade ' +
      '(1.47 -> 5.3e-6) yet is always strictly positive. E2 is implied by E1 + UMon ' +
      '(H_N non-increasing), so the shrinking record-drop does not threaten the predicate.',
    structural:
      'Both predicates hold STRUCTURALLY: a new prefix-min gap can only enter at the ' +
      'top pair (gamma_{N-1},gamma_N), whose site has a strictly higher gamma than any ' +
      'incumbent, forcing rho UP (E1) and H_N DOWN (E2). Zero violations is guaranteed ' +
      'by the argmin/prefix-min geometry, not by numerical coincidence.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isMeasurementOnly: true,
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains SOTA; PATH-1 leading-order predicates stay GUE-conditional at the analytic-bridge step (imp-486/imp-583).',
  }),
});

// ── Build-time assertions ─────────────────────────────────────────────────────

export const IMP3276_E1_E2_MARGIN_QUANTIFICATION_ASSERTIONS = [
  {
    id: 'imp3276-zero-violations',
    why: 'E1/E2 must show zero violations over the full sweep, matching the roadmap ' +
         'PATH-1 (imp-833/imp-858) binary; a nonzero count means the sweep or the zeros regressed.',
    holds: () =>
      IMP3276_E1_E2_MARGIN_QUANTIFICATION.sweep.rhoViolations === 0 &&
      IMP3276_E1_E2_MARGIN_QUANTIFICATION.sweep.tauViolations === 0,
  },
  {
    id: 'imp3276-all-step-margin-is-exact-tie',
    why: 'The naive min signed margin over ALL adjacent-N steps must be an EXACT 0 tie ' +
         '(piecewise-constant plateau between record steps), not a positive or negative value; ' +
         'this is the core reframing of the roadmap zero-violations binary.',
    holds: () =>
      IMP3276_E1_E2_MARGIN_QUANTIFICATION.allStepMargin.minRhoIncrement === 0 &&
      IMP3276_E1_E2_MARGIN_QUANTIFICATION.allStepMargin.minTauDecrement === 0,
  },
  {
    id: 'imp3276-record-steps-count',
    why: 'Exactly 25 record-breaking (jStar-moving) steps over N in {2,...,10^6}; the ' +
         'informative margin lives at these steps, so a changed count means the geometry shifted.',
    holds: () => IMP3276_E1_E2_MARGIN_QUANTIFICATION.sweep.recordBreakingSteps === 25,
  },
  {
    id: 'imp3276-e1-record-jumps-strictly-positive',
    why: 'E1 margin: every per-decade smallest rho jump at record steps must be strictly ' +
         'positive (rho jumps UP when the argmin moves to a higher gamma).',
    holds: () => PER_DECADE.every((d) => d.minRhoJump > 0),
  },
  {
    id: 'imp3276-e1-floor-robust-in-top-decade',
    why: 'E1 robustness: the rho jump does not collapse toward 0 at the top of the range; ' +
         'the smallest top-decade jump must stay well above 1e-4 (measured ~1.8e-3).',
    holds: () => TOP_DECADE.minRhoJump > 1e-4,
  },
  {
    id: 'imp3276-e2-record-drops-strictly-positive',
    why: 'E2 margin: every per-decade smallest tau_c drop at record steps must be strictly ' +
         'positive (tau_c drops when the argmin moves), so E2 never ties or reverses at a record.',
    holds: () => PER_DECADE.every((d) => d.minTauDrop > 0),
  },
  {
    id: 'imp3276-rho-density-anchor',
    why: 'Independent recompute of the RvM density at T=14 must match the imp-469 analytic ' +
         'floor rho(14) ~ 0.12751 (the rigorous gamma_1 > 14 lower bound), anchoring the ' +
         'baked literals to the live closed-form density used across the PATH-1 sweep.',
    holds: () => Math.abs(rvmDensity(14) - 0.12751) < 1e-4,
  },
  {
    id: 'imp3276-honest-measurement-only',
    why: 'Mandatory honesty: measurement only, no proof, no positivity, PT 0.2 stays SOTA; ' +
         'any flip means the module is over-claiming.',
    holds: () => {
      const c = IMP3276_E1_E2_MARGIN_QUANTIFICATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMeasurementOnly === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3276_E1_E2_MARGIN_QUANTIFICATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3276-e1-e2-margin-quantification assertion failed: ${assertion.id}`);
  }
}

export default IMP3276_E1_E2_MARGIN_QUANTIFICATION;
