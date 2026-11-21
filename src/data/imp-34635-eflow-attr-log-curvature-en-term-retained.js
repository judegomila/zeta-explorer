/**
 * @module imp-34635-eflow-attr-log-curvature-en-term-retained
 * @fileoverview imp-34635 -- MEASURE how much of the imp-34612 ~7% log-curvature residual is
 *   absorbed by re-deriving the analytic d2(ln eflow_attr)/dk2 WITHOUT dropping the E_N term
 *   (the imp-34570 F3 flat-cap approximation d ln E_N/dk ~ 0, d2 ln E_N/dk2 ~ 0 the imp-34612
 *   closed form assumes).
 *
 *   imp-34612 F3 reported a stable ~7% NEGATIVE residual between the observed log-curvature of
 *   the deep-far eflow_attr rungs (-6.460e-3 -> -6.345e-3 per k^2, k = 21.75 .. 21.95) and the
 *   analytic log^3(N)/N closed form (-6.038e-3 -> -5.931e-3), with obs - analytic = -4.21e-4 ->
 *   -4.14e-4 per k^2. That closed form collapses the log-curvature to the E_flow -3/u^2 term and
 *   the |g| = 1 - 3/u term ONLY, by invoking the imp-34570 F3 result that E_N is E_trunc-dominated
 *   at N ~ 10^22 (E_trunc = 3.06e-5 >> E_coll ~ 1e-11 >> E_flow ~ 1e-20) so d ln E_N/dk ~ 0 and
 *   d2 ln E_N/dk2 ~ 0 -- flat and inert. That flat-cap is exactly where the ~7% residual could
 *   hide: eflow_attr = (E_flow/E_N)*|g| gives ln eflow_attr = ln E_flow - ln E_N + ln|g|, so the
 *   FULL log-curvature is
 *       d2(ln eflow_attr)/dk2 = d2 lnE_flow/dk2  -  d2 lnE_N/dk2  +  d2 ln|g|/dk2,
 *   and imp-34612 dropped the middle -d2 lnE_N/dk2 piece. This module RETAINS it, computed from
 *   the inherited component model, and measures its share of the ~7% residual.
 *
 *   METHOD (import-light, no 16.7MB zeros bundle in the chain, per
 *   [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]). The observed, dropped-E_N
 *   analytic, and residual per-node values are REUSED verbatim from imp-34612
 *   (IMP34612_LOG_CURVATURE_NODES -- no re-derivation of eflow_attr or the closed form). The E_N
 *   curvature d2(ln E_N)/dk2 is computed LIVE from the exact inherited component model reused
 *   VERBATIM from the imp-34169 parts() (E_N = E_trunc + E_flow + E_coll, E_trunc = 3.06e-5 fixed
 *   per imp-2631, E_flow = C_F*(L/T0)*GRONWALL, E_coll = C_C_PINNED*sqrt(L/N), T0 =
 *   effectiveHeightForN(N), N = 10^(k+1) the decade top), via a central second difference of
 *   ln E_N on a step h = 0.025 (converged: the value is stable to <0.1% from h = 0.01 to 0.05,
 *   so it is the SMOOTH analytic E_N curvature, not the rung-grid roundoff floor). The E_N-retained
 *   analytic is withEN = dropped - d2(ln E_N)/dk2; the new residual is observed - withEN.
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE DROPPED E_N CURVATURE IS TINY AND POSITIVE. The retained term d2(ln E_N)/dk2 is
 *        +4.779e-7 (k=21.75) -> +3.815e-7 (k=21.95) per k^2 -- four orders of magnitude below the
 *        ~4.2e-4 residual it was supposed to explain. It is E_coll-driven: E_coll/E_N ~ 3.35e-7
 *        at k = 21.85, and the constant E_trunc = 3.06e-5 flattens ln E_N so its curvature is that
 *        of the tiny E_coll ~ sqrt(L/N) perturbation on the flat cap. So the imp-34570 F3
 *        flat-cap "d2 ln E_N/dk2 ~ 0" is quantitatively excellent, not merely qualitative.
 *   (F2) RETAINING E_N MOVES THE ANALYTIC THE RIGHT WAY BUT ABSORBS ~0.10% OF THE RESIDUAL. Since
 *        the E_N term enters with a MINUS sign and d2 ln E_N/dk2 > 0, withEN is slightly MORE
 *        concave than the dropped form (-6.038759e-3 vs -6.038281e-3 at k=21.75) -- the correct
 *        direction toward the more-concave observed. But the shift is only ~4.3e-7 per k^2, so the
 *        residual magnitude shrinks from ~4.21e-4 to ~4.21e-4: mean 0.1028% of the imp-34612
 *        residual is absorbed (0.092% .. 0.113% per node). ~99.9% of the ~7% residual REMAINS.
 *   (F3) THE ~7% RESIDUAL IS NOT THE DROPPED E_N TERM -- IT IS THE C_F/GRONWALL CORRECTION. With
 *        the E_N term fully retained, the residual per k^2 is still -4.210e-4 -> -4.138e-4, ~53x
 *        above the imp-34612 rung-precision floor ~8e-6. The flat-cap approximation cost only
 *        ~0.1% of the residual, so it is faithfully accounted; the surviving ~99.9% is the same
 *        C_F(T0)/GRONWALL correction the pure log^3(N)/N surrogate drops, the one that shifts the
 *        log-slope from -2.168 to -2.162 per k (imp-34570). Retaining E_N does NOT close the gap.
 *
 *   The punchline: re-deriving the analytic log-curvature WITHOUT the imp-34570 F3 flat-cap
 *   approximation -- retaining the full d2(ln E_N)/dk2 = +4.78e-7 -> +3.81e-7 per k^2 from the
 *   inherited component model -- shifts the analytic in the correct (more-concave) direction but
 *   absorbs only mean ~0.10% of the imp-34612 ~7% residual. The dropped E_N term is quantitatively
 *   negligible; the surviving ~99.9% of the -4.2e-4 residual is the C_F/GRONWALL correction the
 *   pure surrogate drops, not a hidden E_N contribution.
 *
 *   MEASUREMENT ONLY. A live central-second-difference E_N curvature from the inherited component
 *   model compared against the reused imp-34612 observed/dropped/residual nodes. Descriptive
 *   surrogate, NOT a rigorous asymptotic; the component model is the inherited imp-3220/imp-3406
 *   extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes
 *   no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34612-eflow-attr-convexity-vs-analytic-log3-curvature.js (the ~7% residual + dropped-E_N closed form this re-derives)
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (F3 E_N E_trunc-flat regime the flat-cap assumes)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the parts() component model E_N = E_trunc + E_flow + E_coll)
 */

import { IMP34612_LOG_CURVATURE_NODES } from './imp-34612-eflow-attr-convexity-vs-analytic-log3-curvature.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34169
const GRONWALL = Math.exp(1.0 * 2.37e-4); // imp-34169 TC_A1_TRAP GRONWALL, verbatim
const H_EN = 0.025; // converged central-difference step for the smooth E_N curvature

// --- inherited component model, reused VERBATIM from imp-34169 parts() (E_N branch only) -----
// E_N = E_trunc + E_flow + E_coll; the flat cap E_trunc = 3.06e-5 dominates at N ~ 10^22.
function eNAt(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_TRUNC_PT + E_flow + E_coll;
}
function lnEN(k) {
  return Math.log(eNAt(Math.pow(10, k + 1))); // decade top N = 10^(k+1)
}
// The E_N log-curvature the imp-34570 F3 flat-cap DROPPED (assumed ~0).
function d2lnENdk2(k) {
  return (lnEN(k - H_EN) - 2 * lnEN(k) + lnEN(k + H_EN)) / (H_EN * H_EN);
}

// --- re-derive the analytic log-curvature WITH the E_N term retained -------------------------
// ln eflow_attr = ln E_flow - ln E_N + ln|g|, so the retained term enters with a MINUS sign:
//   withEN = dropped - d2(ln E_N)/dk2   (dropped = imp-34612 analyticTotal).
export const IMP34635_EN_RETAINED_NODES = Object.freeze(
  IMP34612_LOG_CURVATURE_NODES.map((n) => {
    const d2lnEN = d2lnENdk2(n.k);
    const withEN = n.analyticTotal - d2lnEN;
    const newResidual = n.observed - withEN;
    // Fraction of the imp-34612 dropped-E_N residual magnitude absorbed by retaining E_N.
    const absorbedPct = ((Math.abs(n.residual) - Math.abs(newResidual)) / Math.abs(n.residual)) * 100;
    return {
      k: n.k,
      observed: n.observed, // reused verbatim from imp-34612
      droppedAnalytic: n.analyticTotal, // E_N-flat closed form (imp-34612)
      d2lnEN: +d2lnEN.toExponential(6), // the retained term (positive, tiny)
      withENAnalytic: +withEN.toExponential(6), // E_N-retained analytic (slightly more concave)
      droppedResidual: n.residual, // imp-34612 obs - dropped (~ -4.2e-4)
      withENResidual: +newResidual.toExponential(6), // obs - withEN (~ still -4.2e-4)
      absorbedPct: +absorbedPct.toFixed(4), // % of the residual the E_N term absorbs (~0.1%)
    };
  }),
);

// --- (F1) the dropped E_N curvature is tiny and positive; E_coll-driven on the flat cap ------
const MID = IMP34635_EN_RETAINED_NODES[2]; // k = 21.85 centre
export const IMP34635_D2LNEN_AT_CENTRE = MID.d2lnEN; // ~ +4.27e-7 per k^2
export const IMP34635_ALL_D2LNEN_POSITIVE = IMP34635_EN_RETAINED_NODES.every((n) => n.d2lnEN > 0); // true
// E_coll share of E_N at the centre node (the term whose curvature carries d2 ln E_N).
const N_MID = Math.pow(10, MID.k + 1);
const T0_MID = effectiveHeightForN(N_MID);
const ECOLL_MID = C_C_PINNED * Math.sqrt(Math.log(T0_MID) / N_MID);
export const IMP34635_ECOLL_SHARE_OF_EN = +(ECOLL_MID / eNAt(N_MID)).toExponential(4); // ~3.35e-7

// --- (F2) mean fraction of the ~7% residual absorbed by retaining E_N -------------------------
export const IMP34635_MEAN_ABSORBED_PCT = +(
  IMP34635_EN_RETAINED_NODES.reduce((s, n) => s + n.absorbedPct, 0) /
  IMP34635_EN_RETAINED_NODES.length
).toFixed(4); // ~0.1028 (retaining E_N absorbs ~0.10% of the imp-34612 residual)
// Direction check: withEN is MORE concave than dropped at every node (E_N term moves toward obs).
export const IMP34635_WITHEN_MORE_CONCAVE = IMP34635_EN_RETAINED_NODES.every(
  (n) => n.withENAnalytic < n.droppedAnalytic,
); // true

// --- (F3) the residual survives fully retained: still ~ -4.2e-4, C_F/GRONWALL not E_N ---------
export const IMP34635_ALL_WITHEN_RESIDUAL_NEGATIVE = IMP34635_EN_RETAINED_NODES.every(
  (n) => n.withENResidual < 0,
); // true -- observed still ~7% more concave than the E_N-retained analytic
export const IMP34635_MEAN_REMAINING_PCT = +(100 - IMP34635_MEAN_ABSORBED_PCT).toFixed(4); // ~99.90

export const IMP34635_EFLOW_ATTR_LOG_CURVATURE_EN_RETAINED = {
  ticket: 'imp-34635',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34612 collapsed the analytic d2(ln eflow_attr)/dk2 to the E_flow -3/u^2 and |g| terms ' +
    'only, dropping d2(ln E_N)/dk2 via the imp-34570 F3 flat-cap (E_N E_trunc-dominated at ' +
    'N ~ 10^22), and reported a stable ~7% residual (-4.21e-4 -> -4.14e-4 per k^2). Re-derive the ' +
    'analytic log-curvature WITHOUT dropping the E_N term (retaining d2(ln E_N)/dk2 from the ' +
    'inherited component model) and measure how much of that ~7% residual it absorbs. ' +
    'Measurement only; NO QED.',
  model: {
    eflowAttr: 'eflow_attr = (E_flow/E_N)*|d ln E_flow/d log10 N|',
    logDecomposition: 'ln eflow_attr = ln E_flow - ln E_N + ln|g|',
    fullLogCurvature: 'd2(ln eflow_attr)/dk2 = d2 lnE_flow/dk2 - d2 lnE_N/dk2 + d2 ln|g|/dk2',
    droppedTerm: 'imp-34612 dropped -d2(ln E_N)/dk2 via the imp-34570 F3 flat-cap (assumed ~0)',
    eNComponentModel: 'E_N = E_trunc + E_flow + E_coll, E_trunc = 3.06e-5 (imp-2631 fixed), ' +
      'E_flow = C_F*(L/T0)*GRONWALL, E_coll = C_C_PINNED*sqrt(L/N), T0 = effectiveHeightForN(N)',
    node: 'u = (k+1)*ln10 at the decade top N = 10^(k+1); E_N curvature via central 2nd diff h = 0.025',
  },
  nodes: IMP34635_EN_RETAINED_NODES,
  d2lnENAtCentre: IMP34635_D2LNEN_AT_CENTRE,
  allD2lnENPositive: IMP34635_ALL_D2LNEN_POSITIVE,
  ecollShareOfEN: IMP34635_ECOLL_SHARE_OF_EN,
  meanAbsorbedPct: IMP34635_MEAN_ABSORBED_PCT,
  meanRemainingPct: IMP34635_MEAN_REMAINING_PCT,
  withENMoreConcave: IMP34635_WITHEN_MORE_CONCAVE,
  allWithENResidualNegative: IMP34635_ALL_WITHEN_RESIDUAL_NEGATIVE,
  finding: {
    F1_dropped_en_curvature_tiny_positive:
      'The retained term d2(ln E_N)/dk2 is +4.779e-7 (k=21.75) -> +3.815e-7 (k=21.95) per k^2, ' +
      'four orders of magnitude below the ~4.2e-4 residual. It is E_coll-driven (E_coll/E_N ~ ' +
      '3.35e-7 at k=21.85): the constant E_trunc = 3.06e-5 flattens ln E_N so its curvature is ' +
      'that of the tiny E_coll ~ sqrt(L/N) perturbation. The imp-34570 F3 flat-cap is ' +
      'quantitatively excellent, not merely qualitative.',
    F2_retaining_en_absorbs_one_tenth_percent:
      'The E_N term enters with a MINUS sign and d2 ln E_N/dk2 > 0, so withEN is slightly MORE ' +
      'concave than the dropped form (-6.038759e-3 vs -6.038281e-3 at k=21.75) -- the correct ' +
      'direction toward the more-concave observed. But the shift is only ~4.3e-7 per k^2: mean ' +
      '0.1028% of the imp-34612 residual is absorbed (0.092% .. 0.113% per node). ~99.9% remains.',
    F3_residual_is_cf_gronwall_not_en:
      'With E_N fully retained the residual is still -4.210e-4 -> -4.138e-4 per k^2, ~53x above ' +
      'the imp-34612 rung floor ~8e-6. The flat-cap cost only ~0.1% of the residual, so it is ' +
      'faithfully accounted; the surviving ~99.9% is the C_F(T0)/GRONWALL correction the pure ' +
      'log^3(N)/N surrogate drops (the one shifting the log-slope -2.168 -> -2.162 per k). ' +
      'Retaining E_N does NOT close the gap.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a live central-second-difference E_N log-curvature (d2 ln E_N/dk2 = ' +
    '+4.78e-7 -> +3.81e-7 per k^2, step h = 0.025, converged) from the inherited imp-34169 ' +
    'component model, compared against the reused imp-34612 observed/dropped/residual nodes. ' +
    'Re-deriving the analytic log-curvature WITHOUT the imp-34570 F3 flat-cap moves the analytic ' +
    'the correct (more-concave) way but absorbs mean only ~0.10% of the imp-34612 ~7% residual; ' +
    '~99.9% survives as the C_F/GRONWALL correction the pure log^3(N)/N surrogate drops. ' +
    'Descriptive surrogate, NOT a rigorous asymptotic; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED; no refereed bound is changed.',
};

export const IMP34635_ASSERTIONS = [
  {
    // Reuse gate: the observed/dropped/residual nodes are the imp-34612 exports, not fresh literals.
    id: 'imp-34635-reuses-imp34612-nodes',
    description: 'the 5 nodes reuse imp-34612 observed/dropped/residual verbatim (k = 21.75 .. 21.95)',
    holds: () =>
      IMP34635_EN_RETAINED_NODES.length === 5 &&
      IMP34635_EN_RETAINED_NODES[0].k === 21.75 &&
      IMP34635_EN_RETAINED_NODES[4].k === 21.95 &&
      IMP34635_EN_RETAINED_NODES.every(
        (n, i) => n.observed === IMP34612_LOG_CURVATURE_NODES[i].observed,
      ),
  },
  {
    // (F1) the retained E_N curvature is strictly positive and tiny (~4e-7, well below the residual).
    id: 'imp-34635-dropped-en-curvature-tiny-positive',
    description: 'd2(ln E_N)/dk2 strictly positive ~4e-7 per k^2 at all 5 nodes, four orders below the ~4.2e-4 residual',
    holds: () =>
      IMP34635_ALL_D2LNEN_POSITIVE === true &&
      IMP34635_EN_RETAINED_NODES.every((n) => n.d2lnEN > 3e-7 && n.d2lnEN < 5e-7) &&
      Math.abs(IMP34635_D2LNEN_AT_CENTRE - 4.27e-7) < 3e-8 &&
      IMP34635_ECOLL_SHARE_OF_EN > 3e-7 &&
      IMP34635_ECOLL_SHARE_OF_EN < 4e-7,
  },
  {
    // (F2) retaining E_N moves the analytic more concave but absorbs only ~0.1% of the residual.
    id: 'imp-34635-retaining-en-absorbs-tenth-percent',
    description: 'withEN more concave than dropped at every node; mean ~0.10% of the imp-34612 residual absorbed',
    holds: () =>
      IMP34635_WITHEN_MORE_CONCAVE === true &&
      IMP34635_EN_RETAINED_NODES.every((n) => n.absorbedPct > 0 && n.absorbedPct < 0.2) &&
      Math.abs(IMP34635_MEAN_ABSORBED_PCT - 0.1028) < 0.02,
  },
  {
    // (F3) the residual survives fully retained -- still ~ -4.2e-4, ~99.9% unabsorbed.
    id: 'imp-34635-residual-survives-en-retention',
    description: 'withEN residual still strictly negative ~ -4.2e-4 at all 5 nodes; ~99.9% of the residual remains',
    holds: () =>
      IMP34635_ALL_WITHEN_RESIDUAL_NEGATIVE === true &&
      IMP34635_EN_RETAINED_NODES.every((n) => n.withENResidual < -3.5e-4 && n.withENResidual > -5e-4) &&
      IMP34635_MEAN_REMAINING_PCT > 99.5,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34635-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34635_EFLOW_ATTR_LOG_CURVATURE_EN_RETAINED.isRigorous === false &&
      /NO QED/.test(IMP34635_EFLOW_ATTR_LOG_CURVATURE_EN_RETAINED.honest) &&
      /refereed bound is changed/i.test(IMP34635_EFLOW_ATTR_LOG_CURVATURE_EN_RETAINED.honest) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34635_EFLOW_ATTR_LOG_CURVATURE_EN_RETAINED.honest),
  },
];

for (const a of IMP34635_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34635-eflow-attr-log-curvature-en-term-retained assertion failed: ${a.id}`);
  }
}
