// @module imp-2486-en-ladder-assembly-verification
// imp-2486 (critical, proof, S7): Step 4 E(N) assembly verification — tabulate
// the bridge inequality |Lambda - (-t_c(N))| <= E(N) on the imp-321 ladder.
//
// WHAT THIS MODULE DOES
// ---------------------
// LAMBDA_CHAIN_STEPS step 4 (the unique critical blocker of the Lambda-attack
// per imp-347) carries verification grade "numerical", and its named next
// action after the imp-366 G6a closure is: verify the ASSEMBLED E(N) formula
// at the imp-321 ladder. This module performs that verification. The assembled
// formula is the imp-345 decomposition with every post-closure refinement
// substituted in:
//
//   E(N) = E_trunc(N) + E_flow(N) + E_shock(N)
//
//   E_trunc(N) = C_T * T_0(N)^(-kappa_T) * log T_0(N)
//       with kappa_T = 1 - (imp-317 binding hybrid Guth-Maynard exponent at
//       the thin strip), the RIGOROUS rate exponent (~0.182), NOT the imp-345
//       illustrative ansatz kappa = 0.5;
//   E_flow(N)  = C_F(N) * (log T_0(N) / T_0(N)) * exp(C_G * tcBound)
//       with C_F(N) = (log(T_0(N)/2pi) + 1) / (2pi) analytically pinned by
//       imp-838 (skp3-002), no longer a unit placeholder;
//   E_shock(N) = C_C * (log gamma_N / N)^(1/2)
//       the POST-imp-366 Holder-1/2 form from the Polymath15 Lemma 5.2 port
//       that closed G6a_shock_lipschitz. Note the imp-345 atLadder rows still
//       evaluate the PRE-closure linear placeholder log gamma_N / N; this
//       module evaluates the assembled square-root form, which is LARGER
//       (weaker) — the honest direction after the closure.
//
// At every imp-321 ladder N (PT_SCALE_EXTRAPOLATION.ladder, seven rows from
// N = 2458 to N = 1e8) the module tabulates E(N), the best available
// |t_c(N)| (measured imp-309 baseline where the ladder N coincides with a
// recorded measured point, OLS projection otherwise), and the bridge margin
//
//   margin(N) = E(N) - |t_c(N)|.
//
// margin(N) >= 0 is exactly the statement that the conjectured value
// Lambda = 0 lies inside the per-N bridge band
// [|t_c(N)| - E(N), |t_c(N)| + E(N)], i.e. the assembled bridge is CONSISTENT
// with Lambda = 0 (and with Rodgers-Tao Lambda >= 0) at that row.
//
// BINDING SCALE (falsifiability)
// ------------------------------
// With unit symbolic constants and the rigorous kappa_T, E(N) is O(1) on the
// whole ladder (1.93 down to 0.72), so the margin is slack everywhere — the
// verification at ladder scale checks FORM (finite, positive, strictly
// decreasing, correct term shapes), not tightness. To quantify when the
// inequality would become binding, the module scans upward in log10 N for the
// first scale at which E(N) drops below the OLS asymptotic ceiling
// a = lim |t_c(N)| (~0.0066): below that scale the band trivially contains
// both 0 and the ceiling; above it the bridge starts to discriminate. Under
// unit constants that scale is ~10^24.5 — far beyond computation, which is the
// honest reason step 4 closure must come from carrying the Polymath15
// constants symbolically, not from pushing the ladder higher.
//
// HONEST SCOPE — what this does NOT do
// ------------------------------------
// This is a NUMERICAL verification of the assembled formula under unit
// symbolic constants (C_T = C_C = C_G = 1; only C_F and kappa_T are pinned).
// It does NOT prove the bridge inequality, does NOT pin the remaining
// constants, and does NOT yield a per-N Lambda bound or any finite-height RH
// corollary. Step 4 remains open pending the symbolic-constants programme
// (LAMBDA_POLYMATH15_BRIDGE.openWork). No QED is claimed.

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { GUTH_MAYNARD_TAIL_BOUND } from './guth-maynard-tail-bound.js';
import { PT_SCALE_EXTRAPOLATION } from './lambda-pt-scale-extrapolation.js';
import { LAMBDA_POLYMATH15_BRIDGE } from './lambda-polymath15-bridge.js';
import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';

// ── Assembled constants ──────────────────────────────────────────────────────

const TWO_PI = 2 * Math.PI;

// Rigorous rate exponent from imp-317: kappa_T = 1 - binding hybrid exponent
// at the thin strip sigma = 1/2 + 1/log T_0. Strictly positive (Ingham binds
// at ~0.818). This replaces the imp-345 illustrative ansatz kappa = 0.5.
const KAPPA_T = 1 - GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip;

// Gronwall input: a bound on |t_c(N)| valid for EVERY ladder N without
// invoking the open imp-336 monotonicity conjecture. The largest measured
// |t_c| on the imp-309 baseline is 0.1435 (at N = 50); 0.15 covers it with
// slack, and exp(0.15) ~ 1.162 keeps the Gronwall factor benign.
const TC_GRONWALL_BOUND = 0.15;
const MAX_BASELINE_TC = Math.max(...PATH_C_BASELINE_FIT.map((p) => p.tc));

// Unit symbolic placeholders still NOT pinned by any closed ticket. Flagged
// honestly; pinning them is the named openWork of imp-345.
const UNIT_SYMBOLIC = { C_T: 1.0, C_C: 1.0, C_G: 1.0 };

// imp-838 analytically pinned flow constant, explicit in N via T_0(N).
function cFlowPinned(T0) {
  return (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
}

// ── Assembled term evaluators ────────────────────────────────────────────────

function eTrunc(T0) {
  return UNIT_SYMBOLIC.C_T * Math.pow(T0, -KAPPA_T) * Math.log(T0);
}

function eFlow(T0) {
  const gronwall = Math.exp(UNIT_SYMBOLIC.C_G * TC_GRONWALL_BOUND);
  return cFlowPinned(T0) * (Math.log(T0) / T0) * gronwall;
}

function eShock(T0, N) {
  // POST-imp-366 assembled form: Holder-1/2 in (log gamma_N / N).
  return UNIT_SYMBOLIC.C_C * Math.sqrt(Math.log(T0) / N);
}

function eTotalAtN(N) {
  const T0 = effectiveHeightForN(N);
  return eTrunc(T0) + eFlow(T0) + eShock(T0, N);
}

// ── Tabulation on the imp-321 ladder ─────────────────────────────────────────

const ROWS = PT_SCALE_EXTRAPOLATION.ladder.map((ladderRow) => {
  const N = ladderRow.N;
  const T0 = effectiveHeightForN(N);
  const measured = PATH_C_BASELINE_FIT.find((p) => p.N === N) ?? null;
  const tcAbs = measured ? measured.tc : ladderRow.projected_tc;
  const E_trunc = eTrunc(T0);
  const E_flow = eFlow(T0);
  const E_shock = eShock(T0, N);
  const E_total = E_trunc + E_flow + E_shock;
  return {
    N,
    T_0_N: T0,
    E_trunc,
    E_flow,
    E_shock,
    E_shock_preClosureLinearForm: Math.log(T0) / N,
    E_total,
    tcAbs,
    tcSource: measured ? 'measured-imp309-baseline' : 'ols-projection-imp321',
    bridgeMargin: E_total - tcAbs,
    lambdaBand: [tcAbs - E_total, tcAbs + E_total],
    zeroInBand: tcAbs <= E_total,
  };
});

const ALL_TERMS_FINITE_POSITIVE = ROWS.every(
  (r) =>
    [r.E_trunc, r.E_flow, r.E_shock, r.E_total, r.bridgeMargin].every(
      (v) => Number.isFinite(v),
    ) &&
    r.E_trunc > 0 &&
    r.E_flow > 0 &&
    r.E_shock > 0,
);

const E_STRICTLY_DECREASING = ROWS.every(
  (r, i) => i === 0 || r.E_total < ROWS[i - 1].E_total,
);

const MARGIN_POSITIVE_EVERY_ROW = ROWS.every((r) => r.bridgeMargin > 0);

// ── Binding scale: first log10 N where E(N) < OLS asymptotic ceiling ─────────

const OLS_CEILING = PT_SCALE_EXTRAPOLATION.asymptoticCeiling;

function findBindingScaleLog10N() {
  for (let lg = 8; lg <= 80; lg += 0.25) {
    if (eTotalAtN(Math.pow(10, lg)) < OLS_CEILING) return lg;
  }
  return null;
}

const BINDING_SCALE_LOG10N = findBindingScaleLog10N();

// ── Record ───────────────────────────────────────────────────────────────────

export const IMP2486_EN_LADDER_ASSEMBLY_VERIFICATION = {
  id: 'imp-2486',
  title:
    'Step 4 E(N) assembly verification: bridge inequality margin tabulated ' +
    'on the imp-321 ladder',
  proofSection: 'S7',
  consumes: [
    'imp-345 LAMBDA_POLYMATH15_BRIDGE — the E(N) decomposition and term provenance',
    'imp-366 polymath15-lemma52-shock-holder — Holder-1/2 E_shock form (G6a closure)',
    'imp-838 — analytically pinned C_F(N) = (log(T_0/2pi) + 1) / (2pi)',
    'imp-317 GUTH_MAYNARD_TAIL_BOUND — rigorous kappa_T = 1 - binding exponent',
    'imp-321 PT_SCALE_EXTRAPOLATION.ladder — the seven-row N ladder',
    'imp-309 PATH_C_BASELINE_FIT — measured |t_c| anchor at N = 2458',
  ],
  assembledFormula:
    'E(N) = C_T * T_0(N)^(-kappa_T) * log T_0(N) ' +
    '+ C_F(N) * (log T_0(N) / T_0(N)) * exp(C_G * 0.15) ' +
    '+ C_C * (log gamma_N / N)^(1/2), with kappa_T = ' +
    KAPPA_T.toFixed(6) +
    ' (rigorous, from imp-317) and C_F(N) pinned by imp-838; C_T = C_C = ' +
    'C_G = 1 remain unit symbolic placeholders.',
  kappaT: KAPPA_T,
  tcGronwallBound: TC_GRONWALL_BOUND,
  gronwallFactor: Math.exp(UNIT_SYMBOLIC.C_G * TC_GRONWALL_BOUND),
  unitSymbolicConstants: UNIT_SYMBOLIC,
  rows: ROWS,
  flags: {
    allTermsFinitePositive: ALL_TERMS_FINITE_POSITIVE,
    eTotalStrictlyDecreasing: E_STRICTLY_DECREASING,
    bridgeMarginPositiveEveryRow: MARGIN_POSITIVE_EVERY_ROW,
  },
  bindingScale: {
    olsAsymptoticCeiling: OLS_CEILING,
    log10N_whereEDropsBelowCeiling: BINDING_SCALE_LOG10N,
    meaning:
      'Below this scale the bridge band [|t_c| - E, |t_c| + E] trivially ' +
      'contains both Lambda = 0 and the OLS ceiling, so the ladder check is ' +
      'a consistency check on FORM, not tightness. Under unit constants the ' +
      'binding scale is ~10^24.5 — unreachable by computation, which is why ' +
      'step 4 closure must come from the symbolic-constants programme rather ' +
      'than a taller ladder.',
  },
  verdict:
    'VERIFIED (numerical, under unit symbolic constants): the assembled ' +
    'E(N) = E_trunc + E_flow + E_shock evaluates finite and strictly positive ' +
    'at every imp-321 ladder N, is strictly monotone decreasing across the ' +
    'ladder (consistent with E(N) -> 0), and the bridge inequality margin ' +
    'E(N) - |t_c(N)| is positive at every row including the measured ' +
    'N = 2458 anchor — the per-N bridge band contains Lambda = 0 at all ' +
    'seven rows. This verifies the assembled formula numerically; it does ' +
    'NOT claim the rigorous closure of step 4, does NOT pin C_T, C_C, C_G, ' +
    'and yields NO finite-height RH corollary.',
};

// ── Build-time assertions ────────────────────────────────────────────────────

export const IMP2486_EN_LADDER_ASSEMBLY_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp2486-ladder-matches-imp321',
    holds: () =>
      ROWS.length === PT_SCALE_EXTRAPOLATION.ladder.length &&
      ROWS.every((r, i) => r.N === PT_SCALE_EXTRAPOLATION.ladder[i].N),
    why:
      'The verification must run at exactly the imp-321 ladder N values. A ' +
      'row-count or N mismatch means the ladder drifted out from under this ' +
      'module and the tabulation no longer verifies what the roadmap names.',
  },
  {
    id: 'imp2486-all-terms-finite-positive',
    holds: () => ALL_TERMS_FINITE_POSITIVE,
    why:
      'Every assembled term E_trunc, E_flow, E_shock must be finite and ' +
      'strictly positive at every ladder row; a non-finite value means ' +
      'effectiveHeightForN or a term evaluator broke.',
  },
  {
    id: 'imp2486-etotal-strictly-decreasing',
    holds: () => E_STRICTLY_DECREASING,
    why:
      'The assembled E(N) must decay strictly along the ladder — the ' +
      'numerical face of E(N) -> 0. Non-monotone rows mean a term has been ' +
      'miscoded or an imported constant drifted. Note the rigorous kappa_T ' +
      'makes E_trunc decreasing only for T_0 > e^(1/kappa_T) ~ 243, which ' +
      'every ladder row satisfies (T_0 >= 2990).',
  },
  {
    id: 'imp2486-bridge-margin-positive-every-row',
    holds: () => MARGIN_POSITIVE_EVERY_ROW,
    why:
      'margin(N) = E(N) - |t_c(N)| > 0 at every ladder row is the statement ' +
      'that Lambda = 0 lies inside every per-N bridge band — the assembled ' +
      'bridge is consistent with the conjectured Lambda value and with ' +
      'Rodgers-Tao Lambda >= 0 at every measured and projected row.',
  },
  {
    id: 'imp2486-measured-anchor-present',
    holds: () => {
      const measured = ROWS.filter(
        (r) => r.tcSource === 'measured-imp309-baseline',
      );
      return measured.length >= 1 && measured.every((r) => r.bridgeMargin > 0);
    },
    why:
      'At least one ladder row (N = 2458) must use a MEASURED |t_c| from the ' +
      'imp-309 baseline, so the bridge-margin check is anchored to a real ' +
      'collision measurement and is not projection-against-projection at ' +
      'every row.',
  },
  {
    id: 'imp2486-shock-term-post-closure-sqrt-form',
    holds: () =>
      ROWS.every(
        (r) =>
          Math.abs(r.E_shock - Math.sqrt(Math.log(r.T_0_N) / r.N)) <
            1e-12 * Math.max(1, r.E_shock) &&
          r.E_shock >= r.E_shock_preClosureLinearForm,
      ),
    why:
      'E_shock must use the POST-imp-366 Holder-1/2 form (log gamma_N / N)^(1/2), ' +
      'and since log gamma_N / N < 1 on the whole ladder the sqrt form is the ' +
      'LARGER (weaker) bound — the honest direction. If E_shock ever drops ' +
      'below the pre-closure linear placeholder, someone reverted the G6a ' +
      'closure form without flipping this module.',
  },
  {
    id: 'imp2486-kappa-rigorous-from-imp317',
    holds: () =>
      KAPPA_T ===
        1 -
          GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip &&
      KAPPA_T > 0 &&
      KAPPA_T < 1,
    why:
      'This module must use the RIGOROUS rate exponent kappa_T = 1 - binding ' +
      'hybrid exponent from imp-317 (~0.182), not the imp-345 illustrative ' +
      'ansatz 0.5. kappa_T outside (0, 1) means imp-317 drifted and the ' +
      'truncation rate argument collapsed.',
  },
  {
    id: 'imp2486-g6a-closed-prerequisite',
    holds: () =>
      LAMBDA_POLYMATH15_BRIDGE.errorBoundE_N.openSubgap.status === 'closed',
    why:
      'The ASSEMBLED formula only exists because imp-366 closed ' +
      'G6a_shock_lipschitz. If the closure is ever reverted, this entire ' +
      'verification must be re-scoped to the conditional formula in the ' +
      'same commit.',
  },
  {
    id: 'imp2486-gronwall-bound-covers-measured-baseline',
    holds: () =>
      TC_GRONWALL_BOUND >= MAX_BASELINE_TC &&
      Math.exp(UNIT_SYMBOLIC.C_G * TC_GRONWALL_BOUND) < 1.2,
    why:
      'The Gronwall input must dominate every MEASURED baseline |t_c| ' +
      '(max 0.1435 at N = 50) so no monotonicity conjecture is invoked, and ' +
      'the resulting factor must stay benign (< 1.2) so E_flow is not ' +
      'silently inflated.',
  },
  {
    id: 'imp2486-binding-scale-beyond-ladder',
    holds: () =>
      BINDING_SCALE_LOG10N !== null &&
      BINDING_SCALE_LOG10N > Math.log10(ROWS[ROWS.length - 1].N),
    why:
      'The scan must find a finite binding scale, and it must lie beyond the ' +
      'ladder top (10^8) — confirming the documented honest framing that the ' +
      'ladder check verifies form, not tightness, and that step 4 cannot be ' +
      'closed by computation at reachable N under unit constants.',
  },
  {
    id: 'imp2486-honest-scope-no-false-qed',
    holds: () =>
      IMP2486_EN_LADDER_ASSEMBLY_VERIFICATION.verdict.includes('does NOT') &&
      IMP2486_EN_LADDER_ASSEMBLY_VERIFICATION.verdict.includes(
        'NO finite-height RH corollary',
      ),
    why:
      'Tripwire on the honest framing: the verdict must keep stating that ' +
      'this is a numerical verification under unit symbolic constants, not a ' +
      'rigorous closure of step 4. Removing the disclaimer requires actually ' +
      'pinning the constants in the same commit.',
  },
];
