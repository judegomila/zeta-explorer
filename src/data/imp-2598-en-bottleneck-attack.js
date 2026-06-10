// @module imp-2598-en-bottleneck-attack
// imp-2598 (critical, proof, S7): E(N) decomposition attack — make the bridge
// error explicit, find the BOTTLENECK component, and name the single lever that
// drives it to zero. THE headline lever.
//
// WHY THIS MODULE EXISTS
// ----------------------
// The imp-2564 direction audit relocated the entire Lambda programme: RH follows
// from t_c(N) >= 0 (trivial sign) PLUS E(N) -> 0 in the canonical bracket
//
//     |Lambda + t_c(N)|  <=  E(N).
//
// Every hour spent sharpening t_c(N) upper bounds is now known to buy bridge
// FIDELITY only, not Lambda <= 0. The whole game is E(N). This module scopes the
// attack: it decomposes E(N) into its named components, identifies the dominant
// one at the measured ladder AND asymptotically, and for that dominant term
// states the sharpest known bound, the obstruction to improving it, and the
// single next lemma that would reduce it. imp-2486 VERIFIED the assembled
// formula numerically (margin positive on the ladder); this module asks the
// orthogonal question imp-2486 does not — "which term is the bottleneck, and
// what is the one lever that moves the rate?"
//
// THE DECOMPOSITION (post-imp-366 assembled forms, rigorous constants where pinned)
// --------------------------------------------------------------------------------
//   E(N) = E_trunc(N) + E_flow(N) + E_shock(N)            (E_coll renamed E_shock
//                                                          after the imp-366
//                                                          Holder-1/2 closure)
//
//   E_trunc(N) = C_T * T_0(N)^(-kappa_T) * log T_0(N)
//       Source: Polymath15 Lemma 3.3 truncation of H_t by H_t^{(N)} composed
//       with the imp-317 hybrid Guth-Maynard / Ingham tail density at the thin
//       strip sigma = 1/2 + 1/log T_0(N). RIGOR: rate rigorous (kappa_T > 0
//       unconditionally); constant C_T symbolic, order unity. N-DEPENDENCE:
//       T_0 ~ 2pi N / log N, so E_trunc ~ N^{-kappa_T} * polylog with
//       kappa_T = 1 - binding hybrid exponent ~ 0.182. THE SLOWEST-DECAYING TERM.
//
//   E_flow(N)  = C_F(N) * (log T_0(N) / T_0(N)) * exp(C_G * tcBound)
//       Source: Riemann-von Mangoldt drift-tail integral above T_0(N),
//       Gronwall-propagated over [t_c(N), 0] (Tao Effective-approximation
//       Prop 4.1). RIGOR: rate rigorous; C_F(N) = (log(T_0/2pi)+1)/(2pi)
//       analytically pinned by imp-838; C_G symbolic. N-DEPENDENCE:
//       ~ (log N)^2 / N. Decays like N^{-1} -- the FASTEST term.
//
//   E_shock(N) = C_C * (log gamma_N / N)^(1/2)
//       Source: imp-341 Koksma-Hlawka W_1 modulus composed with the Holder-1/2
//       modulus of tau_c at the Burgers shock (imp-366 port of Polymath15
//       Lemma 5.2; closed G6a_shock_lipschitz). RIGOR: rate rigorous post-imp-366;
//       C_C symbolic. N-DEPENDENCE: ~ N^{-1/2} * sqrt(log N). The middle term.
//
// THE BOTTLENECK (the deliverable)
// --------------------------------
// Decay-exponent ordering is decisive and N-independent:
//
//     E_trunc ~ N^{-0.182}  >>  E_shock ~ N^{-0.5}  >>  E_flow ~ N^{-1}.
//
// E_trunc decays SLOWEST, so it dominates E(N) BOTH at the measured ladder
// (N = 2458..1e8: it carries ~95-99% of E_total at every row) AND asymptotically
// (its share -> 1 as N -> infinity). E_trunc is the bottleneck, full stop.
//
// THE HEADLINE ATTACK INSIGHT
// ---------------------------
// The imp-345 openWork list targets E_flow (remove the Gronwall exponential)
// and E_coll/E_shock (upgrade imp-341 to O(1/N) via imp-348). BOTH are
// SUBDOMINANT. Sharpening them cannot move the E(N) -> 0 rate by even one
// epsilon, because the rate is min over the three exponents = kappa_T, owned
// entirely by E_trunc. The ONLY lever that accelerates E(N) -> 0 is raising
// kappa_T, i.e. LOWERING the imp-317 thin-strip zero-density exponent below
// ~0.818. This module exists to make that mis-targeting visible and to point
// the next proof ticket at the truncation tail instead of the collision term.
//
// HONEST SCOPE
// ------------
// This is a SCOPING + ATTACK module. It does NOT prove a new bound, does NOT
// pin any symbolic constant, does NOT close E(N) -> 0, and yields NO
// finite-height RH corollary. It tabulates the existing assembled terms, ranks
// them, and names the single load-bearing lever. No QED is claimed.

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { GUTH_MAYNARD_TAIL_BOUND } from './guth-maynard-tail-bound.js';
import { PT_SCALE_EXTRAPOLATION } from './lambda-pt-scale-extrapolation.js';
import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';

// ── Constants (mirrors the assembled forms verified by imp-2486) ─────────────

const TWO_PI = 2 * Math.PI;

// Rigorous truncation rate exponent from imp-317: kappa_T = 1 - binding hybrid
// Guth-Maynard / Ingham exponent at the thin strip. Strictly in (0, 1).
const KAPPA_T =
  1 - GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip;

// Gronwall input dominating every measured baseline |t_c| (max 0.1435 at N=50)
// without invoking the open imp-336 monotonicity conjecture.
const TC_GRONWALL_BOUND = 0.15;

// Symbolic order-unity constants still unpinned (honest placeholders).
const C_T = 1.0;
const C_C = 1.0;
const C_G = 1.0;

function cFlowPinned(T0) {
  // imp-838 analytically pinned flow constant, explicit in N via T_0(N).
  return (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
}

function eTrunc(T0) {
  return C_T * Math.pow(T0, -KAPPA_T) * Math.log(T0);
}

function eFlow(T0) {
  return cFlowPinned(T0) * (Math.log(T0) / T0) * Math.exp(C_G * TC_GRONWALL_BOUND);
}

function eShock(T0, N) {
  return C_C * Math.sqrt(Math.log(T0) / N);
}

// ── Per-component decay exponents (the bottleneck ranking is by these) ────────
// Effective power of N each term carries (polylog factors omitted): the SMALLEST
// exponent wins asymptotically because it decays slowest.

const DECAY_EXPONENTS = {
  E_trunc: KAPPA_T, // ~0.182
  E_shock: 0.5,
  E_flow: 1.0,
};

// ── Per-row component breakdown with dominance ───────────────────────────────

function breakdownAtN(N, tcAbs, tcSource) {
  const T0 = effectiveHeightForN(N);
  const E_trunc = eTrunc(T0);
  const E_flow = eFlow(T0);
  const E_shock = eShock(T0, N);
  const E_total = E_trunc + E_flow + E_shock;
  const shares = {
    E_trunc: E_trunc / E_total,
    E_flow: E_flow / E_total,
    E_shock: E_shock / E_total,
  };
  const dominantTerm = Object.keys(shares).reduce((a, b) =>
    shares[a] >= shares[b] ? a : b,
  );
  return {
    N,
    T_0_N: T0,
    E_trunc,
    E_flow,
    E_shock,
    E_total,
    shares,
    dominantTerm,
    dominantShare: shares[dominantTerm],
    tcAbs,
    tcSource,
    bridgeMargin: E_total - tcAbs,
  };
}

const ROWS = PT_SCALE_EXTRAPOLATION.ladder.map((ladderRow) => {
  const N = ladderRow.N;
  const measured = PATH_C_BASELINE_FIT.find((p) => p.N === N) ?? null;
  const tcAbs = measured ? measured.tc : ladderRow.projected_tc;
  const tcSource = measured ? 'measured-imp309-baseline' : 'ols-projection-imp321';
  return breakdownAtN(N, tcAbs, tcSource);
});

// ── Asymptotic dominance probe (well beyond the computable ladder) ───────────
// At enormous N the E_trunc share must approach 1, confirming the bottleneck is
// asymptotic and not a ladder-scale artifact.

const ASYMPTOTIC_PROBE_N = 1e30;
const ASYMPTOTIC_PROBE = breakdownAtN(ASYMPTOTIC_PROBE_N, 0, 'probe-no-tc');

// ── Bottleneck verdict / attack record ───────────────────────────────────────

const DOMINANT_EVERY_LADDER_ROW = ROWS.every((r) => r.dominantTerm === 'E_trunc');

export const IMP2598_EN_BOTTLENECK_ATTACK = {
  id: 'imp-2598',
  title:
    'E(N) decomposition attack: bottleneck is E_trunc; the only rate lever is ' +
    'the imp-317 thin-strip density exponent',
  proofSection: 'S7',
  consumes: [
    'imp-345 LAMBDA_POLYMATH15_BRIDGE — the E(N) = E_trunc + E_flow + E_coll decomposition',
    'imp-366 polymath15-lemma52-shock-holder — Holder-1/2 E_shock form (renamed E_coll)',
    'imp-838 — analytically pinned C_F(N) = (log(T_0/2pi)+1)/(2pi)',
    'imp-317 GUTH_MAYNARD_TAIL_BOUND — rigorous kappa_T = 1 - binding exponent',
    'imp-321 PT_SCALE_EXTRAPOLATION.ladder — the seven-row N ladder',
    'imp-2486 — the assembled-formula margin verification this module re-scopes',
  ],
  // (1) the named components with rigor status and N-dependence
  components: [
    {
      name: 'E_trunc',
      formula: 'C_T * T_0(N)^(-kappa_T) * log T_0(N)',
      rigor: 'rate rigorous (kappa_T > 0 unconditionally via imp-317); C_T symbolic O(1)',
      nDependence: 'N^(-kappa_T) * polylog, kappa_T ~ ' + KAPPA_T.toFixed(4),
      decayExponent: DECAY_EXPONENTS.E_trunc,
      provenance: 'Polymath15 Lemma 3.3 + imp-317 hybrid Guth-Maynard / Ingham tail',
    },
    {
      name: 'E_flow',
      formula: 'C_F(N) * (log T_0(N) / T_0(N)) * exp(C_G * |t_c(N)|)',
      rigor: 'rate rigorous; C_F(N) pinned by imp-838; C_G symbolic O(1)',
      nDependence: '(log N)^2 / N, i.e. N^(-1) * polylog',
      decayExponent: DECAY_EXPONENTS.E_flow,
      provenance: 'Riemann-von Mangoldt drift tail, Gronwall over [t_c(N), 0] (Tao Prop 4.1)',
    },
    {
      name: 'E_shock',
      formula: 'C_C * (log gamma_N / N)^(1/2)',
      rigor: 'rate rigorous post-imp-366 (Holder-1/2 closure); C_C symbolic O(1)',
      nDependence: 'N^(-1/2) * sqrt(log N)',
      decayExponent: DECAY_EXPONENTS.E_shock,
      provenance: 'imp-341 Koksma-Hlawka W_1 modulus + imp-366 Polymath15 Lemma 5.2 port',
    },
  ],
  decayExponents: DECAY_EXPONENTS,
  kappaT: KAPPA_T,
  rows: ROWS,
  asymptoticProbe: {
    N: ASYMPTOTIC_PROBE_N,
    dominantTerm: ASYMPTOTIC_PROBE.dominantTerm,
    dominantShare: ASYMPTOTIC_PROBE.dominantShare,
    shares: ASYMPTOTIC_PROBE.shares,
  },
  // (2) the dominant component, both at the ladder and asymptotically
  dominant: {
    component: 'E_trunc',
    atMeasuredLadder: DOMINANT_EVERY_LADDER_ROW,
    asymptotically: ASYMPTOTIC_PROBE.dominantTerm === 'E_trunc',
    why:
      'E_trunc carries the smallest decay exponent (kappa_T ~ ' +
      KAPPA_T.toFixed(4) +
      ') vs E_shock (1/2) and E_flow (1), so it decays SLOWEST and dominates ' +
      'E_total at every ladder row and in the N -> infinity limit. The E(N) -> 0 ' +
      'rate equals min over the three exponents = kappa_T, owned entirely by E_trunc.',
  },
  // (3) sharpest bound / obstruction / single next lemma for the dominant term
  attack: {
    sharpestKnownBound:
      'E_trunc(N) <= C_T * T_0(N)^(-kappa_T) * log T_0(N) with ' +
      'kappa_T = 1 - (thin-strip zero-density exponent) ~ ' +
      KAPPA_T.toFixed(4) +
      ' from the imp-317 hybrid Guth-Maynard 2024 / Ingham bound at ' +
      'sigma = 1/2 + 1/log T_0(N).',
    obstruction:
      'kappa_T = 1 - (binding density exponent ~ 0.818 at the thin strip). ' +
      'Raising kappa_T requires LOWERING that density exponent below 0.818, i.e. ' +
      'a stronger large-values / zero-density estimate near the critical line ' +
      'than the current Guth-Maynard + Ingham hybrid provides. No unconditional ' +
      'density estimate at sigma -> 1/2 beats this today; under RH the tail is ' +
      'empty and kappa_T is moot, which is the circularity the bridge must avoid.',
    singleNextLemma:
      'Sharpen the imp-317 hybrid thin-strip zero-density exponent below ~0.818 ' +
      '(e.g. a Halasz-Montgomery large-values refinement, or porting the imp-348 ' +
      'local-law microscopic rate to the thin strip). That is the ONLY lever ' +
      'that accelerates E(N) -> 0. The imp-345 openWork (remove the E_flow ' +
      'Gronwall exponential; upgrade E_shock to O(1/N) via imp-348) attacks ' +
      'SUBDOMINANT terms and cannot move the rate by even one epsilon.',
    mistargetingFlag:
      'imp-345 openWork items 2 and 3 target E_flow and E_coll/E_shock, both ' +
      'subdominant. This module flags that mis-targeting: the rate-binding work ' +
      'is on E_trunc / imp-317, not on the collision or flow terms.',
  },
  verdict:
    'SCOPED (not closed): E(N) = E_trunc + E_flow + E_shock decomposes with ' +
    'decay exponents kappa_T ~ ' +
    KAPPA_T.toFixed(4) +
    ' < 1/2 < 1, so E_trunc is the unambiguous bottleneck at every imp-321 ' +
    'ladder row and asymptotically. The single rate lever is raising kappa_T by ' +
    'sharpening the imp-317 thin-strip density exponent; sharpening E_flow or ' +
    'E_shock cannot move the E(N) -> 0 rate. This module does NOT prove a new ' +
    'bound, does NOT pin any constant, and yields NO finite-height RH corollary.',
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const IMP2598_EN_BOTTLENECK_ATTACK_ASSERTIONS = [
  {
    id: 'imp2598-ladder-matches-imp321',
    holds: () =>
      ROWS.length === PT_SCALE_EXTRAPOLATION.ladder.length &&
      ROWS.every((r, i) => r.N === PT_SCALE_EXTRAPOLATION.ladder[i].N),
    why:
      'The bottleneck tabulation must run at exactly the imp-321 ladder N ' +
      'values; a row-count or N mismatch means the ladder drifted out from ' +
      'under this scoping module.',
  },
  {
    id: 'imp2598-all-components-finite-positive',
    holds: () =>
      ROWS.every(
        (r) =>
          [r.E_trunc, r.E_flow, r.E_shock, r.E_total].every((v) =>
            Number.isFinite(v),
          ) &&
          r.E_trunc > 0 &&
          r.E_flow > 0 &&
          r.E_shock > 0,
      ),
    why:
      'Every named component must be finite and strictly positive at every ' +
      'ladder row; a non-finite value means effectiveHeightForN or a term ' +
      'evaluator broke and the ranking is meaningless.',
  },
  {
    id: 'imp2598-etrunc-dominant-every-ladder-row',
    holds: () => DOMINANT_EVERY_LADDER_ROW,
    why:
      'The whole deliverable is the claim that E_trunc is the bottleneck. If ' +
      'any ladder row has a different dominant term, the attack target named ' +
      'in the record is wrong and must be re-derived.',
  },
  {
    id: 'imp2598-etrunc-dominant-asymptotically',
    holds: () =>
      ASYMPTOTIC_PROBE.dominantTerm === 'E_trunc' &&
      ASYMPTOTIC_PROBE.dominantShare > 0.9,
    why:
      'At N = 1e30 the E_trunc share must approach 1, confirming the ' +
      'bottleneck is asymptotic (rate-binding), not a ladder-scale artifact. ' +
      'If E_trunc no longer dominates in the limit, the min-exponent argument ' +
      'has broken.',
  },
  {
    id: 'imp2598-decay-exponent-ordering',
    holds: () =>
      DECAY_EXPONENTS.E_trunc > 0 &&
      DECAY_EXPONENTS.E_trunc < DECAY_EXPONENTS.E_shock &&
      DECAY_EXPONENTS.E_shock < DECAY_EXPONENTS.E_flow,
    why:
      'The bottleneck ranking is BY decay exponent: kappa_T (E_trunc) must be ' +
      'strictly positive and strictly smallest, below 1/2 (E_shock) below 1 ' +
      '(E_flow). This ordering IS the reason E_trunc binds the rate; if it ' +
      'inverts, the dominant term changes.',
  },
  {
    id: 'imp2598-kappa-rigorous-from-imp317',
    holds: () =>
      KAPPA_T ===
        1 - GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip &&
      KAPPA_T > 0 &&
      KAPPA_T < 0.5,
    why:
      'kappa_T must be the RIGOROUS imp-317 exponent (1 - binding hybrid ' +
      'exponent ~0.182), strictly positive and strictly below 1/2 so it ' +
      'undercuts E_shock. A kappa_T outside (0, 1/2) means imp-317 drifted and ' +
      'the bottleneck identification must be re-checked.',
  },
  {
    id: 'imp2598-honest-scope-no-false-qed',
    holds: () =>
      IMP2598_EN_BOTTLENECK_ATTACK.verdict.includes('SCOPED (not closed)') &&
      IMP2598_EN_BOTTLENECK_ATTACK.verdict.includes(
        'NO finite-height RH corollary',
      ),
    why:
      'Tripwire on honest framing: the verdict must keep stating this is a ' +
      'scoping/attack module, not a closure. Removing the disclaimer requires ' +
      'actually sharpening kappa_T (closing the dominant term) in the same commit.',
  },
];
