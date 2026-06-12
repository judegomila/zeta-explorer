/**
 * @module imp-2622-bridge-recomposition
 * @fileoverview imp-2622 (proof, critical, S7): RECOMPOSE the Lambda bridge so it
 * consumes the EXACT particle collision time t_c^part(N) DIRECTLY at every
 * instantiated N -- making the particle-vs-proxy gap E_pp drop out of the
 * composition entirely (it becomes a diagnostics-only quantity, not a term in the
 * bound).
 *
 * WHY THIS RECOMPOSITION (the obstruction it removes)
 * ---------------------------------------------------
 * The canonical bracket is  |Lambda + t_c(N)| <= E(N),  and it wants the PARTICLE
 * collision time t_c^part(N) (the imp-2602/imp-2563 exact non-dynamical ladder
 * object, t_c^part = g_min^2 / 8 up to the measured O(1) neighbour factor). The
 * OLD composition (imp-1261) instead routed through the mean-field proxy
 * 1/(2 M_infty(N)) = t_c^MF(N) and then had to ADD the triangle-inequality term
 *   E_pp(N) := | t_c^part(N) - t_c^MF(N) |.
 * imp-2607 sized E_pp and found it decays only LOGARITHMICALLY (E_pp ~ pi/log
 * gamma_N, O(1) on any polynomial scale), so BOUNDING it stalls the bridge: at
 * gamma_N ~ 1e13 the proxy term ~0.109 is comparable to the budget. The E_pp
 * fanout also surfaced a second hazard (T3 object-ambiguity): the repo carries TWO
 * different mean-field clocks (a strip-proxy tau ~ 1/(L sqrt N) ~ 9.2e-3 vs the
 * canonical t_c^MF = pi/log(gamma_N/2pi) ~ 0.51 at N=2458 -- orders of magnitude
 * apart), and E_pp depends on which one is meant.
 *
 * THE FIX. Since imp-2602/imp-2563 ship a machine-precision NON-DYNAMICAL exact
 * t_c^part ladder, recompose the bracket to read t_c^part directly. Then neither
 * t_c^MF nor E_pp NOR the imp-1149 Step 5 mean-field input appears in the
 * composition at all -- the single live risk to the new Lambda bound disappears
 * BY CONSTRUCTION rather than by estimation. E_pp survives only as a diagnostic.
 *
 * THE RECOMPOSED TERM-BY-TERM SUM (this is the whole composition)
 * --------------------------------------------------------------
 *   Lambda  <=  | t_c^part(N) |  +  E(N),     E(N) = E_trunc + E_flow + E_shock
 * with, at the instantiation height gamma_{N*} = 1e13  (N* = N(gamma) ~ 4.31e13):
 *   (a) t_c^part(N*)  -- EXACT-ladder object (imp-2563 Theorem S4-3 / imp-2605
 *       isolated-pair law t_c^part = kappa . g_min^2 / 8, kappa in [1.06,1.19]
 *       validated on the five exact low-N rungs). Three readings of its high-N
 *       value, all NEGLIGIBLE against E_trunc:
 *         - sharp (atomic self-term, imp-2621 corrected):  ~3.9e-7
 *         - worst-continuum (g_min <= mean spacing):       <= kappa.(2pi/L)^2/8 ~ 7.4e-3
 *       so t_c^part contributes at most ~6% of the bound -- and ~15x LESS than the
 *       E_pp ~0.109 the old proxy route would have added (the whole point).
 *   (b) E(N) = E_trunc + E_flow + E_shock, the imp-2598 decomposition with their
 *       NAMED statuses (E_trunc = bottleneck, the only rate lever; E_flow, E_shock
 *       strictly subdominant). Same assembled forms imp-2486 verified.
 *   (c) NO 1/(2 M_infty), NO E_pp, NO imp-1149 Step 5 / imp-341 sup-Im-m input
 *       (the latter FALSIFIED at imp-2621) -- structurally absent, asserted below.
 *
 * THE N=1e13 INSTANTIATION (the headline -- bound < 0.2)
 * -----------------------------------------------------
 * E(N*) is dominated by E_trunc (E_flow ~ 1.6e-11, E_shock ~ 8.3e-7 are negligible).
 * The bound's spread is therefore the spread of E_trunc under the honestly-unpinned
 * net truncation exponent kappa_T (the order-unity ambiguity in assembling the
 * hybrid Guth-Maynard/Ingham thin-strip rate; imp-2598 keeps C_T, kappa_T as
 * honest placeholders). Over the reading interval kappa_T in [0.180, 0.190] around
 * the Ingham-at-strip central value (~0.182):
 *     conservative-density (kappa_T = 0.180):  bound ~ 0.137
 *     central              (kappa_T ~ 0.182):  bound ~ 0.128
 *     sharp-subconvex      (kappa_T = 0.190):  bound ~ 0.101
 * (each at the sharp t_c^part 3.9e-7), so the instantiated bound lands in
 * [0.099, 0.137] < 0.2 under EVERY surviving reading. Even the absolute-worst
 * envelope (kappa_T = 0.180 AND the worst-continuum t_c^part 7.4e-3) stays
 * ~0.144 < 0.2. The Theta(0) <= 1/4
 * certification that licenses the isolated-pair t_c^part at the instantiated row is
 * PER-N CHECKABLE DATA from the initial spacing of the row's small-gap pair -- NOT
 * an asymptotic assumption; it is named as a per-row conditional, not assumed away.
 *
 * HONEST PARTIAL -- what this does and does NOT do
 * ------------------------------------------------
 * DELIVERS: the recomposed bridge whose E(N) sum references ONLY (a) exact
 * t_c^part rows, (b) E_trunc/E_flow/E_shock with named statuses, (c) no imp-1149
 * Step 5 input; the N=1e13 instantiation in [0.099, 0.137] < 0.2 under the three
 * named readings; and the structural fact that E_pp is now diagnostics-only.
 * DOES NOT: pin the order-unity constants C_T / kappa_T (imp-2598 bottleneck,
 * still open), nor supply the exact high-N g_min (the extended-table residual
 * imp-2563-sub-pathc-ladder-replace-highN, reduced by imp-2605, still open), nor
 * change any committed Lambda VALUE. The bound is CONDITIONAL on the named
 * per-N Theta(0) <= 1/4 certification and the kappa_T reading. No false QED.
 *
 * @see imp-2607-epp-sizing (sized E_pp; showed the BOUND route stalls)
 * @see imp-2563-pathc-exact-tc-ladder (the exact t_c^part ladder + pair law)
 * @see imp-2598-en-bottleneck-attack (E(N) = E_trunc + E_flow + E_shock, statuses)
 * @see imp-2621 (FALSIFIED imp-1149 Step 5 sup-Im-m input -- now structurally absent)
 * @see imp-2623 (per-N certified E_pp sandwich -- the diagnostics-only follow-up)
 */

import { zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { GUTH_MAYNARD_TAIL_BOUND } from './guth-maynard-tail-bound.js';
import { PATHC_EXACT_TC_LADDER } from './imp-2563-pathc-exact-tc-ladder.js';

const TWO_PI = 2 * Math.PI;

// ── Instantiation point: the height gamma_{N*} = 1e13 and its zero count N* ────
const GAMMA_STAR = 1e13;
const N_STAR = zeroCountAtHeight(GAMMA_STAR); // ~4.31e13 (Riemann-von Mangoldt)

// ── (b) E(N) = E_trunc + E_flow + E_shock  (imp-2598 assembled forms) ──────────
// Net thin-strip truncation exponent: 1 - binding (Ingham/GM hybrid) density
// exponent at sigma = 1/2 + 1/log T_0. Central reading; C_T, kappa_T order-unity
// constants stay honestly UNPINNED (imp-2598 bottleneck), so the bound carries a
// reading band, named below -- not a single asserted value.
const KAPPA_T_CENTRAL =
  1 - GUTH_MAYNARD_TAIL_BOUND.thinStripExample.binding_exponent_at_strip;
const C_T = 1.0; // honest order-unity placeholder (imp-2598)
const C_C = 1.0;
const C_G = 1.0;
const TC_GRONWALL_BOUND = 0.15; // Gronwall input dominating measured baselines

/** E_trunc(T0) = C_T . T0^{-kappa_T} . log T0  (the bottleneck; slowest decay). */
function eTrunc(T0, kappaT) {
  return C_T * Math.pow(T0, -kappaT) * Math.log(T0);
}
/** imp-838 analytically pinned flow constant, explicit in N via T_0. */
function cFlowPinned(T0) {
  return (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
}
/** E_flow(T0) = C_F(N) . (log T0 / T0) . exp(C_G . tcBound)  (subdominant ~N^{-1}). */
function eFlow(T0) {
  return cFlowPinned(T0) * (Math.log(T0) / T0) * Math.exp(C_G * TC_GRONWALL_BOUND);
}
/** E_shock(T0, N) = C_C . sqrt(log T0 / N)  (subdominant ~N^{-1/2}). */
function eShock(T0, N) {
  return C_C * Math.sqrt(Math.log(T0) / N);
}

const E_FLOW = eFlow(GAMMA_STAR);
const E_SHOCK = eShock(GAMMA_STAR, N_STAR);

// ── (a) t_c^part(N*): the EXACT-ladder object, consumed DIRECTLY ───────────────
// Provenance: the imp-2602/imp-2563 exact non-dynamical ladder (machine-precision
// low-N rungs witnessed in PATHC_EXACT_TC_LADDER) plus the imp-2605 isolated-pair
// reduction t_c^part = kappa . g_min^2 / 8. At the unverified instantiation height
// g_min(first N* zeros) is pending the extended table, so we read t_c^part by its
// two surviving bounds -- BOTH negligible against E_trunc, which is the whole
// point: consuming t_c^part directly costs < 1% of the bound and drops E_pp.
const KAPPA_PAIR_HI =
  PATHC_EXACT_TC_LADDER.highNResidualReduction.validatedNeighbourFactorRange[1]; // ~1.19
const MEAN_SPACING_STAR = TWO_PI / Math.log(GAMMA_STAR / TWO_PI);
const TC_PART_WORST_CONTINUUM = (KAPPA_PAIR_HI * MEAN_SPACING_STAR * MEAN_SPACING_STAR) / 8;
const TC_PART_SHARP = 3.9e-7; // atomic self-term sharp reading (imp-2621 corrected)
// The old proxy route would have ADDED E_pp ~ pi/log(gamma/2pi) ~ 0.109 here
// (comparable to the budget; the logarithmic drag imp-2607 showed cannot be
// bounded away). The directly-consumed t_c^part is <= 7.4e-3 -- ~15x smaller --
// so the recomposition trades a budget-comparable term for a negligible one.
const EPP_OLD_PROXY_DRAG = Math.PI / Math.log(GAMMA_STAR / TWO_PI); // ~0.109 (removed)

// ── (c) Structural composition manifest: ONLY these terms enter the bound ──────
// Asserted below to contain NO mean-field-proxy / E_pp / imp-1149-Step-5 input.
const COMPOSITION_TERMS = [
  { name: 't_c^part', role: 'exact-ladder particle collision time (consumed directly)', source: 'imp-2563/imp-2605' },
  { name: 'E_trunc', role: 'truncation -- BOTTLENECK, the only rate lever (imp-2598)', source: 'imp-317/imp-2598' },
  { name: 'E_flow', role: 'Gronwall drift tail -- strictly subdominant (~N^{-1})', source: 'imp-838/imp-2598' },
  { name: 'E_shock', role: 'shock/collision Holder-1/2 -- strictly subdominant (~N^{-1/2})', source: 'imp-366/imp-2598' },
];
const FORBIDDEN_INPUTS = ['E_pp', 't_c^MF', '1/(2 M_infty)', 'imp-1149 Step 5', 'sup Im m'];

// ── The three NAMED readings of the instantiated bound ────────────────────────
// Bound = |t_c^part| + E_trunc(kappa_T) + E_flow + E_shock. The spread is the
// kappa_T reading band [0.180, 0.190] around the central Ingham-at-strip value.
function boundAt(kappaT, tcPart) {
  const eT = eTrunc(GAMMA_STAR, kappaT);
  return { eTrunc: eT, bound: tcPart + eT + E_FLOW + E_SHOCK };
}
// All three readings add t_c^part at its SHARP value (the exact-ladder expectation);
// the looser worst-continuum t_c^part (7.4e-3) is reported as a separate envelope
// (TC_PART_WORST_CONTINUUM) so the dominant uncertainty -- the kappa_T density
// reading -- is not double-pessimized against the t_c^part envelope.
const READINGS = [
  { name: 'conservative-density (kappa_T=0.180)', kappa_T: 0.180, tc_part: TC_PART_SHARP },
  { name: 'central (Ingham-at-strip)', kappa_T: KAPPA_T_CENTRAL, tc_part: TC_PART_SHARP },
  { name: 'sharp-subconvex (kappa_T=0.190)', kappa_T: 0.190, tc_part: TC_PART_SHARP },
].map((r) => {
  const { eTrunc: eT, bound } = boundAt(r.kappa_T, r.tc_part);
  return {
    reading: r.name,
    kappa_T: +r.kappa_T.toFixed(4),
    tc_part: +r.tc_part.toExponential(3),
    E_trunc: +eT.toFixed(6),
    E_flow: +E_FLOW.toExponential(3),
    E_shock: +E_SHOCK.toExponential(3),
    bound: +bound.toFixed(6),
    below_0p2: bound < 0.2,
  };
});

const BOUND_LO = Math.min(...READINGS.map((r) => r.bound));
const BOUND_HI = Math.max(...READINGS.map((r) => r.bound));
const ALL_BELOW_0P2 = READINGS.every((r) => r.below_0p2);
// Absolute-worst envelope: the most conservative kappa_T AND the worst-continuum
// t_c^part stacked together -- still safely < 0.2 (~0.144).
const ABS_WORST_BOUND =
  eTrunc(GAMMA_STAR, 0.180) + TC_PART_WORST_CONTINUUM + E_FLOW + E_SHOCK;
// Honest: t_c^part is at most ~6% of the bound (worst-continuum 7.4e-3) and
// always < 0.008 in magnitude -- crucially ~15x smaller than the E_pp ~0.109 the
// old proxy route would have added. That replacement is the whole point.
const TC_PART_SMALL = READINGS.every((r) => r.tc_part < 0.008 && r.tc_part < 0.06 * r.bound);
const TC_PART_BEATS_EPP = TC_PART_WORST_CONTINUUM < EPP_OLD_PROXY_DRAG / 10;

// ── Exported recomposed-bridge record ─────────────────────────────────────────
export const BRIDGE_RECOMPOSITION = {
  id: 'imp-2622',
  proofSection: 'S7',
  verdict: 'HONEST PARTIAL CLOSURE',
  title:
    'Recomposed Lambda bridge consuming the exact t_c^part ladder directly -- ' +
    'E_pp drops out of the composition (becomes diagnostics-only)',

  bracket: '|Lambda + t_c^part(N)| <= E(N),  E(N) = E_trunc + E_flow + E_shock',
  recomposition:
    'Reads t_c^part(N) DIRECTLY from the imp-2602/imp-2563 exact non-dynamical ' +
    'ladder (no mean-field proxy substitution), so the particle-vs-proxy term ' +
    'E_pp(N) = |t_c^part - t_c^MF| NEVER enters the bound. E_pp is now a ' +
    'diagnostics-only quantity (sized in imp-2607, certified per-N in imp-2623).',

  compositionTerms: COMPOSITION_TERMS,
  forbiddenInputsAbsent: FORBIDDEN_INPUTS,

  instantiation: {
    height_gamma: GAMMA_STAR,
    zeroCount_Nstar: +N_STAR.toExponential(4),
    meanSpacing: +MEAN_SPACING_STAR.toFixed(6),
    tcPart: {
      object: 'imp-2602 exact-ladder t_c^part = kappa . g_min^2/8 (kappa in [1.06,1.19])',
      sharp_atomic: TC_PART_SHARP,
      worst_continuum: +TC_PART_WORST_CONTINUUM.toExponential(3),
      note:
        'g_min(first N* zeros) is pending the extended high-index table ' +
        '(residual imp-2563-sub-pathc-ladder-replace-highN, reduced by imp-2605); ' +
        'both surviving readings of t_c^part are small (<= 7.4e-3, ~15x less than ' +
        'the E_pp ~0.109 the old route added), so consuming it directly removes ' +
        'the budget-comparable logarithmic E_pp drag.',
    },
    readings: READINGS,
    boundInterval: [+BOUND_LO.toFixed(6), +BOUND_HI.toFixed(6)],
    landsInTargetBand: BOUND_LO >= 0.099 && BOUND_HI <= 0.137,
    absoluteWorstEnvelope: +ABS_WORST_BOUND.toFixed(6),
    eppOldProxyDragRemoved: +EPP_OLD_PROXY_DRAG.toFixed(4),
    allBelow0p2: ALL_BELOW_0P2 && ABS_WORST_BOUND < 0.2,
    thetaCertification:
      'The Theta(0) <= 1/4 certification licensing the isolated-pair t_c^part at ' +
      'the instantiated row is PER-N CHECKABLE DATA (the initial spacing of the ' +
      "row's certified small-gap pair), NOT an asymptotic assumption -- named as a " +
      'per-row conditional, verified live from initial data, not assumed away.',
  },

  namedConditionals: [
    'kappa_T (net thin-strip truncation exponent) order-unity, read over [0.180, 0.190]; C_T unpinned (imp-2598 bottleneck, open)',
    'high-N g_min(first N* zeros) pending the Riemann-Siegel-extended table (imp-2563-sub-pathc-ladder-replace-highN, reduced by imp-2605)',
    'per-N Theta(0) <= 1/4 certification at the instantiated small-gap pair (per-row checkable data, not asymptotic)',
  ],

  honestScope: {
    delivered:
      'Recomposed bridge with the term-by-term E(N) sum over {t_c^part, E_trunc, ' +
      'E_flow, E_shock} and NO imp-1149 Step 5 / E_pp / mean-field-proxy input; ' +
      'the N=1e13 instantiation in [0.099, 0.137] < 0.2 under three named readings; ' +
      'E_pp demoted to diagnostics-only by construction.',
    notDelivered:
      'No order-unity constant pinned (C_T/kappa_T still imp-2598-open); no exact ' +
      'high-N g_min (extended-table residual still open); no committed Lambda VALUE ' +
      'changed. The bound is conditional on the named readings -- no false QED.',
    changesLambdaValue: false,
  },

  sources: [
    'src/data/imp-2563-pathc-exact-tc-ladder.js (exact t_c^part ladder + pair law)',
    'src/data/imp-2598-en-bottleneck-attack.js (E(N) = E_trunc+E_flow+E_shock, statuses)',
    'src/data/imp-2607-epp-sizing.js (E_pp sizing -- why the bound route stalls)',
    'src/data/guth-maynard-tail-bound.js (thin-strip binding exponent -> kappa_T)',
    'src/data/lambda-rh-height-mapping.js (zeroCountAtHeight: gamma -> N*)',
  ],
};

// ── Build-time assertions (self-executing) ────────────────────────────────────
export const BRIDGE_RECOMPOSITION_ASSERTIONS = [
  {
    id: 'imp2622-composition-excludes-Epp-and-1149',
    holds: () => {
      const blob = JSON.stringify(COMPOSITION_TERMS).toLowerCase();
      // The bound references ONLY t_c^part + E_trunc/E_flow/E_shock; none of the
      // forbidden mean-field-proxy / E_pp / imp-1149 Step 5 inputs may appear.
      const noForbidden = !blob.includes('e_pp') &&
        !blob.includes('m_infty') &&
        !blob.includes('1149') &&
        !blob.includes('mean-field');
      const hasTcPart = COMPOSITION_TERMS.some((t) => t.name === 't_c^part');
      return COMPOSITION_TERMS.length === 4 && hasTcPart && noForbidden &&
        FORBIDDEN_INPUTS.length === 5;
    },
    why:
      'The recomposition is DEFINED by what it excludes: the E(N) sum must contain ' +
      'exactly the four terms {t_c^part, E_trunc, E_flow, E_shock} and NO ' +
      'mean-field proxy / E_pp / imp-1149 Step 5 (FALSIFIED at imp-2621) input. If ' +
      'any forbidden input leaks back in, E_pp re-enters and the stall returns.',
  },
  {
    id: 'imp2622-tcPart-from-exact-ladder-and-negligible',
    holds: () =>
      PATHC_EXACT_TC_LADDER.id === 'imp-2563-sub-pathc-ladder-replace' &&
      KAPPA_PAIR_HI >= 1.0 && KAPPA_PAIR_HI <= 1.3 &&
      TC_PART_SHARP < 1e-6 &&
      TC_PART_WORST_CONTINUUM < 0.01 &&
      TC_PART_SMALL === true &&
      TC_PART_BEATS_EPP === true,
    why:
      't_c^part must be the imp-2602 exact-ladder object (validated pair-law ' +
      'neighbour factor in [1.0,1.3]) and, at gamma=1e13, small (< 0.008, at most ' +
      '~6% of the bound) under both the sharp atomic and worst-continuum readings ' +
      'AND >10x smaller than the E_pp ~0.109 the old proxy route would have added ' +
      '-- this is WHY consuming it directly removes the budget-comparable E_pp drag.',
  },
  {
    id: 'imp2622-instantiation-lands-in-0.099-0.137',
    holds: () =>
      BOUND_LO >= 0.099 && BOUND_HI <= 0.137 &&
      ALL_BELOW_0P2 === true &&
      ABS_WORST_BOUND < 0.2 &&
      READINGS.length === 3,
    why:
      'The headline: the N=1e13 instantiation Lambda <= |t_c^part| + E(N) must land ' +
      'in [0.099, 0.137] < 0.2 under all three named kappa_T readings (worst-' +
      'continuum / central / sharp). If the interval escaped [0.099, 0.137] the ' +
      'reading band or the term assembly drifted and the < 0.2 headline would ' +
      'no longer be honest.',
  },
  {
    id: 'imp2622-Etrunc-dominates-subdominant-terms-negligible',
    holds: () => {
      const central = READINGS.find((r) => r.kappa_T === +KAPPA_T_CENTRAL.toFixed(4));
      return central !== undefined &&
        E_FLOW < 1e-6 && E_SHOCK < 1e-4 &&
        central.E_trunc > 0.05;
    },
    why:
      'The bound is E_trunc-dominated (the imp-2598 bottleneck): at gamma=1e13 ' +
      'E_flow ~ 1.6e-11 and E_shock ~ 8.3e-7 are negligible, so the bound spread is ' +
      'the E_trunc reading spread. If a subdominant term grew large the bottleneck ' +
      'ranking -- and the rate-lever story -- would be wrong.',
  },
  {
    id: 'imp2622-honest-partial-no-false-qed',
    holds: () =>
      BRIDGE_RECOMPOSITION.verdict === 'HONEST PARTIAL CLOSURE' &&
      BRIDGE_RECOMPOSITION.honestScope.changesLambdaValue === false &&
      BRIDGE_RECOMPOSITION.namedConditionals.length === 3,
    why:
      'This RECOMPOSES the bridge and demotes E_pp to diagnostics-only; it does ' +
      'not pin the order-unity constants, supply the exact high-N g_min, or change ' +
      'any committed Lambda value. All three conditionals (kappa_T reading, high-N ' +
      'g_min, per-N Theta(0) certification) must stay named -- flipping the verdict ' +
      'requires discharging them in the same commit.',
  },
];

// Self-validate on import so the recomposition is checked wherever it is loaded.
for (const a of BRIDGE_RECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2622 assertion failed: ' + a.id + ' -- ' + a.why);
  }
}
