/**
 * @module imp-33962-attenuation-rung-by-rung-decomposition
 *
 * imp-33962 (accuracy, frontier-direction): imp-33922 R3 measured the attribution attenuation
 *   F2 * F3 * F4 = 0.05022
 * (with the E_N normaliser factor F2 carrying ~92% of it on a log scale) ONLY as a single endpoint
 * slice roe(11)/roe(6) spanning the whole 5-decade head-to-tail window. That one number tells us the
 * NET attenuation of the raw (log N)^3/N over-prediction, but it says nothing about whether the
 * normaliser dominance is a UNIFORM local property along N or a fortuitous cancellation of the
 * endpoints. This module recomputes the four multiplicative factors RUNG-BY-RUNG across the full
 * imp-33810 quarter-decade ladder (adjacent-rung ratios, 20 steps over the 21 rungs) using the SAME
 * inherited imp-3406/imp-33810 sub-terms, and asks whether the F2 dominance of the attenuation is
 * boundary-stable or drifts.
 *
 * WHAT IS DECOMPOSED (same inherited imp-3406/imp-33810 sub-terms as imp-33884/imp-33885/imp-33922)
 * ------------------------------------------------------------------------------------------------
 *   The attributed ratio is roe = resid / eflow with eflow = (E_flow/E_N) |s_flow|, so between two
 *   adjacent ladder rungs a (lower k) and b (higher k) the local widening factorises exactly:
 *     roe(b)/roe(a) = F1 * F2 * F3 * F4,   with (per step)
 *       F1 = E_flow(a)/E_flow(b)   -- the RAW E_flow decay (the (log N)^3/N law), > 1
 *       F2 = E_N(b)/E_N(a)         -- the normaliser ratio (E_N -> E_trunc as N grows), < 1
 *       F3 = sflow(a)/sflow(b)     -- the E_flow log-slope ratio, ~ 1
 *       F4 = resid(b)/resid(a)     -- the imp-33773 M2 sub-leading residual ratio
 *   The per-step ATTENUATION is F2 * F3 * F4 (the part the analytic raw decay does not touch). Because
 *   the ladder is a telescoping chain, the PRODUCT of each per-step factor over the 20 steps must
 *   collapse back to the imp-33922 endpoint slice (F1 = 17992.16, F2 = 0.06332, ..., widening 903.538)
 *   to machine precision -- that is the consistency gate. The DRIFT is then read off the sequence of
 *   per-step factors.
 *
 * THE FINDING (accuracy / measurement only)
 * -----------------------------------------
 *   (R1) THE PER-STEP FACTORS TELESCOPE EXACTLY TO THE imp-33922 ENDPOINT SLICE. Multiplying the 20
 *        adjacent-rung factors recovers prod F1 = 17992.16, prod F2 = 0.06332, prod F3 = 0.90709,
 *        prod F4 = 0.87432, prod attenuation F2*F3*F4 = 0.05022 and prod widening = 903.538 -- each
 *        matching the imp-33922 head-to-tail endpoints to rel ~1e-13. The rung-by-rung decomposition
 *        is the same measurement resolved at 20 steps, not a new model.
 *   (R2) THE NORMALISER LOG-ATTENUATION PER STEP WEAKENS MONOTONICALLY TOWARD THE TAIL. ln F2 rises
 *        strictly monotonically from -0.2549 at the head (k=6.00->6.25) to -0.0191 at the tail
 *        (k=10.75->11.00): each quarter-decade the E_N normaliser collapses LESS, because as E_coll
 *        comes to dominate E_N the ratio E_N(b)/E_N(a) -> 1. So F2 is FRONT-LOADED -- its attenuation
 *        is strongest at the head and saturates into the tail, it is NOT uniform along N.
 *   (R3) THE F2 DOMINANCE OF THE ATTENUATION IS NOT BOUNDARY-STABLE -- IT DRIFTS AND IS LOST IN THE
 *        TAIL. The per-step magnitude share |ln F2|/(|ln F2|+|ln F3|+|ln F4|) is FAR from a constant
 *        0.92: it starts at 0.871 at the head, DIPS to a mid-ladder minimum ~0.599 (k~7.5), rises to
 *        an interior peak ~0.905 (k~8.75->9.00), then COLLAPSES monotonically to 0.079 in the tail as
 *        the residual factor F4 (whose ratio crosses unity near k~8.9, flipping from amplifying to
 *        attenuating) takes over. So the imp-33922 endpoint reading "92% of the attenuation is F2" is a
 *        NET AGGREGATE artifact (the aggregate |ln| share is 0.9225, reproducing imp-33922 exactly) --
 *        it is NOT representative of any single rung; locally F2 carries anywhere from 8% to 90.5%.
 *
 * The punchline: decomposing the imp-33922 F2*F3*F4 = 0.05022 attribution attenuation rung-by-rung
 * across the imp-33810 quarter-decade ladder shows the normaliser dominance is NOT boundary-stable. The
 * per-step factors telescope exactly to the endpoint slice (prod = 903.538, rel ~1e-13), but the local
 * F2 magnitude share drifts from 0.871 at the head through a mid-ladder dip (~0.599) and an interior
 * peak (~0.905) down to 0.079 in the tail, where the sub-leading residual factor F4 -- not the
 * normaliser -- carries the attenuation. The clean monotone signal is ln F2 itself, which weakens
 * strictly (-0.2549 -> -0.0191) as the E_N collapse saturates. The "92% is F2" headline is a net
 * aggregate of the whole 5-decade window, not a property of any rung.
 *
 * ACCURACY / MEASUREMENT ONLY. Cross-check / reconciliation diagnostic, NOT an RH bound. The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the factor identity is exact WITHIN
 * that model only; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * the C_mb GUE-conditional share per imp-486 is UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33922-eflow-analytic-decay-vs-widening-crosscheck (the endpoint F1..F4 slice this refines)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21 quarter-decade rungs)
 * @see imp-33884-eflow-resid-widening-fullprec-recompute (the exact 903.538 widening + factors)
 * @see imp-28895-eflow-resid-widening-model-derivation (the four-factor decomposition)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884/imp-33922 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-33810/imp-33922 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582/imp-33730 defn: p_sigma = -slope OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// One imp-33810 rung: sliding window [10^k, 10^(k+1)] evaluated at the upper endpoint 10^(k+1).
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  const eflow = (ph.E_flow / ph.E_N) * sflow; // attributed E_flow term
  return { k, E_flow: ph.E_flow, E_N: ph.E_N, sflow, resid, eflow, roe: resid / eflow };
}

// The full 21-rung quarter-decade ladder k = 6.00, 6.25, ..., 11.00 (imp-33810).
const RUNGS = [];
for (let k = 6; k <= 11 + 1e-9; k += 0.25) RUNGS.push(rung(+k.toFixed(2)));

// Adjacent-rung (per-step) factor decomposition -- 20 steps across the 21 rungs.
const STEPS = [];
for (let i = 0; i < RUNGS.length - 1; i++) {
  const a = RUNGS[i];
  const b = RUNGS[i + 1];
  const F1 = a.E_flow / b.E_flow; // raw E_flow decay (the (log N)^3/N law)
  const F2 = b.E_N / a.E_N; // normaliser ratio
  const F3 = a.sflow / b.sflow; // slope ratio
  const F4 = b.resid / a.resid; // sub-leading residual ratio
  const lnF2 = Math.log(F2);
  const lnF3 = Math.log(F3);
  const lnF4 = Math.log(F4);
  const attenuation = F2 * F3 * F4;
  // Robust local dominance measure: fraction of the attenuation log-magnitude carried by F2. Uses
  // absolute values because F4 changes the sign of its log across the ladder (amplifying at the head,
  // attenuating in the tail), so a signed share ln F2/(ln F2+ln F3+ln F4) blows up where the
  // denominator passes through zero and is not a faithful local diagnostic.
  const magShareF2 = Math.abs(lnF2) / (Math.abs(lnF2) + Math.abs(lnF3) + Math.abs(lnF4));
  STEPS.push({
    from_k: a.k,
    to_k: b.k,
    F1: +F1.toFixed(6),
    F2: +F2.toFixed(6),
    F3: +F3.toFixed(6),
    F4: +F4.toFixed(6),
    attenuation: +attenuation.toFixed(6),
    ln_F2: +lnF2.toFixed(6),
    magShareF2: +magShareF2.toFixed(6),
    // raw doubles kept for the telescoping product gate below
    _F1: F1,
    _F2: F2,
    _F3: F3,
    _F4: F4,
  });
}

// R1: telescoped products must collapse to the imp-33922 endpoint slice (machine floor).
const PROD_F1 = STEPS.reduce((p, s) => p * s._F1, 1); // ~17992.16
const PROD_F2 = STEPS.reduce((p, s) => p * s._F2, 1); // ~0.06332
const PROD_F3 = STEPS.reduce((p, s) => p * s._F3, 1); // ~0.90709
const PROD_F4 = STEPS.reduce((p, s) => p * s._F4, 1); // ~0.87432
const PROD_ATTENUATION = PROD_F2 * PROD_F3 * PROD_F4; // ~0.05022
const PROD_WIDENING = PROD_F1 * PROD_ATTENUATION; // ~903.538
const ENDPOINT_WIDENING = RUNGS[RUNGS.length - 1].roe / RUNGS[0].roe; // exact imp-33884/imp-33922 903.538
const TELESCOPE_REL = Math.abs(PROD_WIDENING - ENDPOINT_WIDENING) / ENDPOINT_WIDENING; // ~1e-13

// R2: per-step normaliser log-attenuation ln F2 weakens strictly (rises toward 0) head -> tail.
const LN_F2_SERIES = STEPS.map((s) => Math.log(s._F2));
const LN_F2_HEAD = LN_F2_SERIES[0]; // ~-0.2549
const LN_F2_TAIL = LN_F2_SERIES[LN_F2_SERIES.length - 1]; // ~-0.0191
const LN_F2_MONOTONE_WEAKENING = LN_F2_SERIES.every((x, i) => i === 0 || x > LN_F2_SERIES[i - 1]);

// R3: the F2 magnitude-share drifts -- not boundary-stable.
const MAG_SHARE_SERIES = STEPS.map((s) => Math.abs(Math.log(s._F2)) / (Math.abs(Math.log(s._F2)) + Math.abs(Math.log(s._F3)) + Math.abs(Math.log(s._F4))));
const MAG_SHARE_HEAD = MAG_SHARE_SERIES[0]; // ~0.871
const MAG_SHARE_TAIL = MAG_SHARE_SERIES[MAG_SHARE_SERIES.length - 1]; // ~0.079
const MAG_SHARE_MIN = Math.min(...MAG_SHARE_SERIES); // ~0.079 (tail)
const MAG_SHARE_MAX = Math.max(...MAG_SHARE_SERIES); // ~0.905 (interior peak, k~8.75->9)
const MAG_SHARE_SPREAD = MAG_SHARE_MAX - MAG_SHARE_MIN; // ~0.826 -- far from constant
// Aggregate (endpoint-style) |ln| share, using the totals -- reproduces the imp-33922 0.9222 net figure.
const AGG_MAG_SHARE_F2 = Math.abs(Math.log(PROD_F2)) / (Math.abs(Math.log(PROD_F2)) + Math.abs(Math.log(PROD_F3)) + Math.abs(Math.log(PROD_F4))); // ~0.9225

// Strip the raw-double helpers from the exported ladder (keep it display-clean).
const LADDER = STEPS.map(({ _F1, _F2, _F3, _F4, ...rest }) => rest);

export const IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION = {
  id: 'imp-33962',
  proofSection: 'S-frontier',
  question:
    'imp-33922 R3 measured the attribution attenuation F2*F3*F4 = 0.05022 (E_N normaliser F2 carrying ' +
    '~92% on a log scale) ONLY as an endpoint slice roe(11)/roe(6). Recompute the four factors ' +
    'rung-by-rung (adjacent-rung ratios) across the full imp-33810 quarter-decade ladder using the SAME ' +
    'inherited sub-terms, and measure whether the normaliser dominance of the attenuation is ' +
    'boundary-stable or drifts along N. Report the per-rung ln-share of each factor. Cross-check only; ' +
    'component model NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'per adjacent-rung step a->b (20 steps over the 21 rungs k=6.00..11.00): F1=E_flow(a)/E_flow(b), ' +
    'F2=E_N(b)/E_N(a), F3=sflow(a)/sflow(b), F4=resid(b)/resid(a); the per-step attenuation F2*F3*F4; ' +
    'the normaliser magnitude share |ln F2|/(|ln F2|+|ln F3|+|ln F4|); and the telescoped products',
  ladder: LADDER,
  telescope: {
    prod_F1_raw_eflow_decay: +PROD_F1.toFixed(4), // 17992.1557 (matches imp-33922 F1)
    prod_F2_normaliser: +PROD_F2.toFixed(6), // 0.063320 (matches imp-33922 F2)
    prod_F3_slope: +PROD_F3.toFixed(6), // 0.907093
    prod_F4_resid: +PROD_F4.toFixed(6), // 0.874320
    prod_attenuation_F2F3F4: +PROD_ATTENUATION.toExponential(5), // ~5.02184e-2 (matches imp-33922)
    prod_widening: +PROD_WIDENING.toFixed(5), // 903.53792
    endpoint_widening: +ENDPOINT_WIDENING.toFixed(5), // 903.53792 (imp-33884/imp-33922)
    telescope_rel_residual: +TELESCOPE_REL.toExponential(3), // ~1e-13 (machine floor)
  },
  normaliserDrift: {
    ln_F2_head_step: +LN_F2_HEAD.toFixed(5), // -0.25490 (k=6.00->6.25)
    ln_F2_tail_step: +LN_F2_TAIL.toFixed(5), // -0.01906 (k=10.75->11.00)
    ln_F2_monotone_weakening: LN_F2_MONOTONE_WEAKENING, // true: E_N collapse saturates into the tail
    mag_share_F2_head: +MAG_SHARE_HEAD.toFixed(4), // 0.8707
    mag_share_F2_tail: +MAG_SHARE_TAIL.toFixed(4), // 0.0795 (dominance LOST in the tail)
    mag_share_F2_min: +MAG_SHARE_MIN.toFixed(4), // 0.0795
    mag_share_F2_max: +MAG_SHARE_MAX.toFixed(4), // 0.9050 (interior peak, k~8.75->9.00)
    mag_share_F2_spread: +MAG_SHARE_SPREAD.toFixed(4), // 0.8255 -- far from constant, NOT boundary-stable
    aggregate_mag_share_F2: +AGG_MAG_SHARE_F2.toFixed(4), // 0.9225 (the imp-33922 net endpoint figure)
  },
  finding: {
    R1_perstep_factors_telescope_to_endpoint:
      'Multiplying the 20 adjacent-rung factors recovers prod F1 = 17992.16, prod F2 = 0.06332, ' +
      'prod F3 = 0.90709, prod F4 = 0.87432, prod attenuation = 0.05022 and prod widening = 903.538, ' +
      'each matching the imp-33922 head-to-tail endpoints to rel ~1e-13. The rung-by-rung ' +
      'decomposition is the same measurement at 20-step resolution, not a new model.',
    R2_normaliser_attenuation_weakens_monotonically:
      'The per-step normaliser log-attenuation ln F2 rises strictly monotonically from -0.2549 at the ' +
      'head (k=6.00->6.25) to -0.0191 at the tail (k=10.75->11.00): each quarter-decade the E_N ' +
      'normaliser collapses LESS, because as E_coll comes to dominate E_N the ratio E_N(b)/E_N(a) ' +
      'tends to 1. So F2 is front-loaded -- its attenuation is strongest at the head and saturates ' +
      'into the tail, NOT uniform along N.',
    R3_F2_dominance_drifts_not_boundary_stable:
      'The per-step magnitude share |ln F2|/(|ln F2|+|ln F3|+|ln F4|) is FAR from a constant 0.92: it ' +
      'starts at 0.871 at the head, dips to a mid-ladder minimum ~0.599 (k~7.5), rises to an interior ' +
      'peak ~0.905 (k~8.75->9.00), then collapses monotonically to 0.079 in the tail as the residual ' +
      'factor F4 (whose ratio crosses unity near k~8.9) takes over. So the imp-33922 endpoint reading ' +
      '"92% of the attenuation is F2" is a NET AGGREGATE (aggregate |ln| share 0.9225, reproducing ' +
      'imp-33922 exactly), NOT a property of any single rung -- locally F2 carries from 8% to 90.5%.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / CROSS-CHECK (frontier-direction, NOT rigorous). Decomposing the imp-33922 ' +
    'F2*F3*F4 = 0.05022 attribution attenuation rung-by-rung across the imp-33810 quarter-decade ' +
    'ladder shows the normaliser dominance is NOT boundary-stable. The 20 per-step factors telescope ' +
    'exactly to the endpoint slice (prod widening = 903.538, rel ~1e-13, matching imp-33922 F1..F4), ' +
    'but the local F2 magnitude share drifts from 0.871 at the head through a mid-ladder dip (~0.599) ' +
    'and an interior peak (~0.905) down to 0.079 in the tail, where the sub-leading residual factor F4 ' +
    '-- not the normaliser -- carries the attenuation. The one clean monotone signal is ln F2 itself, ' +
    'which weakens strictly (-0.2549 -> -0.0191) as the E_N collapse saturates. The imp-33922 ' +
    '"92% is F2" headline (aggregate |ln| share 0.9225) is a net figure over the whole 5-decade ' +
    'window, not a per-rung property. The inherited imp-3220/imp-3406 component model is NOT a ' +
    'rigorous asymptotic; the factor identity is exact WITHIN the model only; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33922 (the endpoint F1..F4 slice this refines rung-by-rung); imp-33810 (the 21 ' +
    'quarter-decade rungs); imp-33884/imp-33885 (the exact 903.538 widening + per-rung ' +
    'cross-validation); imp-28895 (the four-factor decomposition); lambda-rh-height-mapping (RvM ' +
    'height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION_ASSERTIONS = [
  {
    // (R1) The 20 per-step factors telescope to the imp-33922 endpoint slice to machine precision.
    id: 'imp33962-perstep-factors-telescope-to-endpoint',
    description: 'prod F1..F4 and prod widening (903.538) match the imp-33922 endpoints to rel < 1e-9',
    holds: () =>
      RUNGS.length === 21 &&
      STEPS.length === 20 &&
      TELESCOPE_REL < 1e-9 &&
      Math.abs(PROD_F1 - 17992.16) < 1 &&
      Math.abs(PROD_F2 - 0.06332) < 1e-4 &&
      Math.abs(PROD_WIDENING - 903.53792) < 1e-3,
  },
  {
    // (R2) The per-step normaliser log-attenuation ln F2 weakens strictly (rises toward 0) head->tail.
    id: 'imp33962-normaliser-attenuation-weakens-monotonically',
    description: 'ln F2 strictly increasing across the 20 steps, from ~-0.255 (head) to ~-0.019 (tail)',
    holds: () =>
      LN_F2_MONOTONE_WEAKENING &&
      LN_F2_HEAD < -0.24 &&
      LN_F2_HEAD > -0.27 &&
      LN_F2_TAIL < 0 &&
      LN_F2_TAIL > -0.03,
  },
  {
    // (R3) The F2 magnitude share is NOT boundary-stable: big spread, dominance lost in the tail.
    id: 'imp33962-F2-dominance-drifts-not-boundary-stable',
    description: 'mag share head ~0.87, tail ~0.08, interior peak ~0.905, spread ~0.83 -- far from constant',
    holds: () =>
      MAG_SHARE_HEAD > 0.85 &&
      MAG_SHARE_HEAD < 0.89 &&
      MAG_SHARE_TAIL > 0.06 &&
      MAG_SHARE_TAIL < 0.1 &&
      MAG_SHARE_MAX > 0.9 &&
      MAG_SHARE_SPREAD > 0.7,
  },
  {
    // (R3) The aggregate |ln| share reproduces the imp-33922 net 92% -- confirming it is an aggregate,
    // not a local rung property (which ranges 8%..90.5%).
    id: 'imp33962-aggregate-share-reproduces-imp33922-net-92pct',
    description: 'aggregate |ln| share ~0.9225 matches the imp-33922 endpoint F2 share (0.9222)',
    holds: () => Math.abs(AGG_MAG_SHARE_F2 - 0.9222) < 0.001 && AGG_MAG_SHARE_F2 > MAG_SHARE_MAX,
  },
  {
    // Honesty gate: accuracy/measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp33962-honesty-gate-no-qed',
    description: 'Cross-check only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION.isRigorous === false &&
      /NO QED/.test(IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION.verdict),
  },
];

for (const a of IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33962-attenuation-rung-by-rung-decomposition assertion failed: ${a.id}`);
  }
}
