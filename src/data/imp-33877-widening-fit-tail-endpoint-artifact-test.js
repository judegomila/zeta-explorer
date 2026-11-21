/**
 * @module imp-33877-widening-fit-tail-endpoint-artifact-test
 *
 * imp-33877 (numerical, frontier-direction): imp-33858 localized the imp-33843 aggregate
 * RMSE ~0.116 log-linear widening residual and found the single largest signed residual is a
 * positive far-tail excursion at k=11 (max e ~ +0.2479), the END rung of the finite imp-33810
 * ladder (windows [10^k,10^(k+1)], k = 6.00..11.00). An excursion pinned to the LAST rung of a
 * truncated fit window can be a boundary/truncation artifact -- a single OLS line over a finite,
 * gently-concave curve necessarily places its largest positive residual at whichever rung happens
 * to sit at the far edge -- rather than a physical feature located AT k=11. imp-33858 never tested
 * this. This module extends the imp-33810 ladder past k=11 to k=11.25..12 with the SAME inherited
 * effectiveHeightForN / C_C_PINNED sub-terms, re-runs the imp-33843 OLS log-linear fit on the
 * enlarged ladder, and reports whether the k=11 residual PERSISTS as an interior feature or RELAXES
 * toward the fit line once it is no longer the endpoint -- separating genuine tail curvature from a
 * finite-ladder truncation artifact.
 *
 * THE MEASUREMENT (imp-33810 ladder reused verbatim for k<=11; extension rungs use the same model)
 * ----------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810 (E_trunc = 3.06e-5 fixed strip, E_coll =
 *                    C_C_PINNED sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall, T0 =
 *                    effectiveHeightForN(N)). Verified to reproduce the imp-33810 k<=11 ladder to
 *                    machine precision (reuse gate below), so the extension is the SAME measurement
 *                    pushed four quarter-decade rungs further, not a fresh model.
 *   Ladders          BASE   k = 6.00..11.00 (21 rungs, the imp-33810/imp-33858 window)
 *                    EXT12  k = 6.00..12.00 (25 rungs, +k = 11.25,11.50,11.75,12.00)
 *                    EXT115 k = 6.00..11.50 (23 rungs, an intermediate boundary for the migration test)
 *   Response  y_k = ln(eflow_over_resid_k);   Fit  y = a + b k  (the imp-33843 log-linear WINNER),
 *   re-run by OLS on EACH ladder; signed residual e_k = y_k - (a + b k) tabulated per rung.
 *
 * THE FINDING (measurement only -- the k=11 excursion is a finite-ladder ENDPOINT artifact)
 * ----------------------------------------------------------------------------------------
 *   (R1) THE k=11 RESIDUAL COLLAPSES ONCE IT IS NO LONGER THE ENDPOINT. On the BASE k=6..11 ladder
 *        the k=11 residual is +0.2479 (the single largest, at the endpoint, per imp-33858). Extending
 *        the fit window to k=11.5 drops the k=11 residual to +0.1390 (now interior), and extending to
 *        k=12 drops it to +0.0345 -- a ~86% collapse toward the fit line. The k=11 excursion does NOT
 *        persist as an interior feature; it relaxes off the boundary. This is the signature of a
 *        truncation artifact, not of a physical feature anchored at k=11.
 *   (R2) THE LARGEST POSITIVE RESIDUAL MIGRATES TO -- AND GROWS AT -- THE NEW ENDPOINT. The argmax
 *        residual tracks the ladder edge: k=11 (+0.2479, BASE) -> k=11.5 (+0.3218, EXT115) -> k=12
 *        (+0.3830, EXT12). It never stays at k=11; it sits at whatever the last rung is, and the peak
 *        value even GROWS as the boundary recedes. Symmetrically the negative trough migrates outward
 *        with the window (argmin k=9.00 -> 9.25 -> 9.50). The whole residual pattern is boundary-locked.
 *   (R3) THE UNDERLYING TAIL DECELERATION (CONCAVITY) IS GENUINE, ITS k=11 PEAK VALUE IS NOT. The RMSE
 *        of the refit RISES (0.1160 -> 0.1482 -> 0.1818) and R^2 dips (0.99715 -> 0.99594 -> 0.99459)
 *        as the ladder lengthens, i.e. the ln-ratio curve keeps decelerating (staying concave) into
 *        k = 11.25..12, so there IS a real, boundary-independent tail curvature. What is an ARTIFACT is
 *        the imp-33858 reading that this curvature "peaks at k=11": the peak is pinned to the fit-window
 *        EDGE, not to the physical location k=11. A single OLS line over a concave curve always parks
 *        its largest positive residual at the last rung; move the last rung and the peak moves with it.
 *
 * The punchline: the imp-33858 far-tail excursion max e ~ +0.2479 at k=11 is a finite-ladder
 * ENDPOINT/TRUNCATION artifact. Extending the imp-33810 ladder to k=12 collapses the k=11 residual by
 * ~86% (to +0.0345, interior) and moves the largest positive residual to the new endpoint k=12
 * (+0.3830), with the trough migrating outward in lock-step. The genuine, boundary-independent feature
 * is a continuing tail deceleration (concavity, rising RMSE), which any single log-linear OLS line
 * necessarily converts into an endpoint-anchored positive residual -- so "peaks at k=11" reflects the
 * truncation of the fit window, not a physical feature located at k=11.
 *
 * MEASUREMENT / ENDPOINT-ARTIFACT TEST ONLY. A diagnostic re-fit of an inherited surrogate on an
 * extended inherited ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form
 * selection (the imp-33843 log-linear verdict is untouched; R^2 stays > 0.994). The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate is
 * descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-33858-widening-fit-residual-localization (the k=11 far-tail excursion tested here)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS fit re-run on the extended ladder)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6..11 ladder extended here, reused verbatim below)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631, exactly as imp-33810)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33773 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582/imp-33730 definition: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  return -olsSlope(xs, ys);
}

// imp-33620/imp-33727 definition (magnitude): p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// s_flow = d ln E_flow / d ln N via a symmetric log-N central difference (small, negative).
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// Plain OLS slope of ys against xs (used for both the sigma exponent and the log-linear widening fit).
function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
function ols(xs, ys) {
  const b = olsSlope(xs, ys);
  const mx = xs.reduce((a, c) => a + c, 0) / xs.length;
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  return { a: my - b * mx, b };
}

// Build the quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), same as imp-33810.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const lo = Math.pow(10, kk);
    const hi = Math.pow(10, kk + 1);
    const pSigma = olsSigmaExponent(lo, hi);
    const pEcoll = ecollExponentMag(lo, hi);
    const ph = parts(hi);
    const residExp = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi)); // attributed E_flow term
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}

// Fit the imp-33843 log-linear surrogate on a ladder; return fit, per-rung signed residual, and stats.
function fitLadder(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  const RES = KS.map((k, i) => Y[i] - (F.a + F.b * k));
  let minI = 0;
  let maxI = 0;
  for (let i = 0; i < RES.length; i++) {
    if (RES[i] < RES[minI]) minI = i;
    if (RES[i] > RES[maxI]) maxI = i;
  }
  const my = Y.reduce((a, b) => a + b, 0) / Y.length;
  const ssTot = Y.reduce((s, y) => s + (y - my) ** 2, 0);
  const ssRes = RES.reduce((s, e) => s + e * e, 0);
  return {
    KS,
    RES,
    series: KS.map((k, i) => ({ k, resid: +RES[i].toExponential(4) })),
    fit: { a: +F.a.toFixed(6), b: +F.b.toFixed(6) },
    rmse: +Math.sqrt(ssRes / RES.length).toExponential(4),
    r2: +(1 - ssRes / ssTot).toFixed(6),
    argmax: { k: KS[maxI], resid: +RES[maxI].toExponential(4), isEndpoint: maxI === RES.length - 1 },
    argmin: { k: KS[minI], resid: +RES[minI].toExponential(4) },
    residAtK: (kq) => +RES[KS.indexOf(kq)].toExponential(4),
  };
}

// BASE k=6..11 (the imp-33810/imp-33858 window), EXT115 k=6..11.5, EXT12 k=6..12.
const BASE_LADDER = buildLadder(11);
const EXT115_LADDER = buildLadder(11.5);
const EXT12_LADDER = buildLadder(12);
const BASE = fitLadder(BASE_LADDER);
const EXT115 = fitLadder(EXT115_LADDER);
const EXT12 = fitLadder(EXT12_LADDER);

// Reuse gate: the replicated model reproduces the imp-33810 k<=11 ladder to machine precision.
const IMP33810_LADDER = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
let MAX_REL_DIFF_VS_IMP33810 = 0;
for (let i = 0; i < IMP33810_LADDER.length; i++) {
  const a = IMP33810_LADDER[i].eflow_over_resid;
  const b = BASE_LADDER[i].eflow_over_resid;
  MAX_REL_DIFF_VS_IMP33810 = Math.max(MAX_REL_DIFF_VS_IMP33810, Math.abs(a - b) / Math.abs(a));
}

// The k=11 residual as the fit boundary recedes: endpoint -> interior -> deeper interior.
const K11_BASE = BASE.residAtK(11); // +0.2479 (endpoint, the imp-33858 far-tail excursion)
const K11_EXT115 = EXT115.residAtK(11); // +0.1390 (interior once k=11.5 is added)
const K11_EXT12 = EXT12.residAtK(11); // +0.0345 (interior once k=12 is added) -- ~86% collapse
const K11_RELAX_FRACTION = +(1 - K11_EXT12 / K11_BASE).toFixed(4); // ~0.86

// The largest positive residual always sits at the current endpoint, and grows as it recedes.
const ENDPOINT_PEAK_SEQUENCE = [BASE.argmax.resid, EXT115.argmax.resid, EXT12.argmax.resid]; // +0.2479,+0.3218,+0.3830

export const IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST = {
  id: 'imp-33877',
  proofSection: 'S-frontier',
  question:
    'imp-33858 flagged the single largest signed residual of the imp-33843 log-linear widening fit ' +
    'as a positive far-tail excursion at k=11 (max e ~ +0.2479), the END rung of the finite imp-33810 ' +
    'ladder. Is that excursion a finite-ladder ENDPOINT/truncation artifact or a physical feature at ' +
    'k=11? Extend the imp-33810 ladder to k=11.25..12 with the same inherited sub-terms, re-run the ' +
    'imp-33843 OLS, and report whether the k=11 residual persists as an interior point or relaxes off ' +
    'the boundary. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'The imp-33843 log-linear OLS y = a + b k re-fit on the imp-33810 ladder extended from k=6..11 ' +
    '(21 rungs) to k=6..11.5 (23 rungs) and k=6..12 (25 rungs), tracking the signed residual at k=11 ' +
    'and the location/value of the largest positive residual as the fit window boundary recedes',
  reuseGateMaxRelDiffVsImp33810: +MAX_REL_DIFF_VS_IMP33810.toExponential(3), // ~0 -- same inherited model
  base: { kEnd: 11, rungs: BASE.KS.length, fit: BASE.fit, rmse: BASE.rmse, r2: BASE.r2, argmax: BASE.argmax, argmin: BASE.argmin, series: BASE.series },
  ext115: { kEnd: 11.5, rungs: EXT115.KS.length, fit: EXT115.fit, rmse: EXT115.rmse, r2: EXT115.r2, argmax: EXT115.argmax, argmin: EXT115.argmin, series: EXT115.series },
  ext12: { kEnd: 12, rungs: EXT12.KS.length, fit: EXT12.fit, rmse: EXT12.rmse, r2: EXT12.r2, argmax: EXT12.argmax, argmin: EXT12.argmin, series: EXT12.series },
  k11ResidualAcrossBoundaries: { base_endpoint: K11_BASE, ext115_interior: K11_EXT115, ext12_interior: K11_EXT12 },
  k11RelaxFraction: K11_RELAX_FRACTION, // ~0.86 collapse of the k=11 residual once it is interior
  endpointPeakSequence: ENDPOINT_PEAK_SEQUENCE, // +0.2479 (k=11) -> +0.3218 (k=11.5) -> +0.3830 (k=12)
  verdictIsEndpointArtifact: true,
  finding: {
    R1_k11_residual_collapses_off_the_boundary:
      'On the BASE k=6..11 ladder the k=11 residual is +0.2479 (the imp-33858 largest, at the ' +
      'endpoint). Extending the fit window to k=11.5 drops it to +0.1390 (now interior) and to k=12 ' +
      'drops it to +0.0345 -- a ~86% collapse toward the fit line. The k=11 excursion does NOT ' +
      'persist as an interior feature; it relaxes off the boundary, the signature of a truncation ' +
      'artifact rather than a feature physically anchored at k=11.',
    R2_largest_residual_migrates_to_and_grows_at_the_new_endpoint:
      'The argmax residual tracks the ladder edge: k=11 (+0.2479) -> k=11.5 (+0.3218) -> k=12 ' +
      '(+0.3830), never staying at k=11 and even GROWING as the boundary recedes; the negative ' +
      'trough migrates outward in lock-step (argmin k=9.00 -> 9.25 -> 9.50). The residual pattern is ' +
      'boundary-locked.',
    R3_tail_deceleration_genuine_but_its_k11_peak_value_is_not:
      'The refit RMSE RISES (0.1160 -> 0.1482 -> 0.1818) and R^2 dips (0.99715 -> 0.99594 -> ' +
      '0.99459) as the ladder lengthens, so a real boundary-independent tail deceleration (concavity ' +
      'of ln-ratio vs k) continues into k=11.25..12. What is an ARTIFACT is the imp-33858 reading ' +
      'that this curvature peaks AT k=11: the peak is pinned to the fit-window edge, not the physical ' +
      'location k=11, because a single OLS line over a concave curve always parks its largest ' +
      'positive residual at the last rung. The imp-33843 log-linear verdict is untouched (R^2 > 0.994).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / ENDPOINT-ARTIFACT TEST (frontier-direction, NOT rigorous). Extending the imp-33810 ' +
    'ladder from k=6..11 to k=6..12 with the identical inherited sub-terms (reuse gate: the replicated ' +
    'model reproduces the imp-33810 k<=11 ladder to machine precision) and re-running the imp-33843 ' +
    'log-linear OLS shows the imp-33858 far-tail excursion at k=11 (max e ~ +0.2479) is a finite-ladder ' +
    'ENDPOINT/TRUNCATION artifact: the k=11 residual collapses ~86% (to +0.0345) once it is interior, ' +
    'the largest positive residual migrates to -- and grows at -- the new endpoint (k=12, +0.3830), and ' +
    'the trough migrates outward in lock-step. The underlying tail deceleration (concavity, rising ' +
    'RMSE 0.116 -> 0.182) is genuine and boundary-independent, but its APPEARANCE as a peak "at k=11" ' +
    'is an artifact of truncating the fit window there -- a single OLS line always anchors its largest ' +
    'positive residual at the last rung. Distinct from any form selection; the imp-33843 ' +
    'log-linear-over-power-law verdict is untouched (R^2 stays > 0.994). The OLS surrogate is ' +
    'descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33858 (the k=11 far-tail excursion tested here); imp-33843 (the log-linear OLS re-run on the ' +
    'extended ladder); imp-33810 (the k=6..11 ladder extended here, reused verbatim); imp-33773 (M2 ' +
    'refutation the ladder locks); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST_ASSERTIONS = [
  {
    // Reuse gate: the replicated model reproduces the imp-33810 k<=11 ladder to machine precision,
    // so the extension is the same inherited measurement, not a fresh model.
    id: 'imp33877-reuse-gate-reproduces-imp33810-ladder',
    description: 'replicated model matches the imp-33810 k<=11 ladder to < 1e-6 rel; base is 21 rungs, ext12 is 25',
    holds: () =>
      MAX_REL_DIFF_VS_IMP33810 < 1e-6 &&
      BASE.KS.length === 21 &&
      EXT12.KS.length === 25 &&
      BASE.KS[20] === 11 &&
      EXT12.KS[24] === 12,
  },
  {
    // Baseline gate: the BASE k=6..11 refit reproduces the imp-33858 far-tail excursion (max +0.2479
    // at the k=11 endpoint) and RMSE ~0.116.
    id: 'imp33877-base-reproduces-imp33858-k11-excursion',
    description: 'BASE argmax at k=11 (endpoint), resid ~ +0.2479, RMSE ~0.116',
    holds: () =>
      BASE.argmax.k === 11 &&
      BASE.argmax.isEndpoint === true &&
      Math.abs(BASE.argmax.resid - 0.2479) < 0.01 &&
      BASE.rmse > 0.10 &&
      BASE.rmse < 0.13,
  },
  {
    // (R1) The k=11 residual RELAXES off the boundary: +0.2479 (endpoint) -> +0.0345 (interior at
    // ext12), a ~86% collapse. NOT a persistent interior feature.
    id: 'imp33877-k11-residual-relaxes-off-boundary',
    description: 'k=11 residual collapses from ~+0.2479 (endpoint) to ~+0.0345 (interior); relax fraction ~0.86',
    holds: () =>
      Math.abs(K11_BASE - 0.2479) < 0.01 &&
      K11_EXT115 < K11_BASE &&
      K11_EXT12 < K11_EXT115 &&
      Math.abs(K11_EXT12 - 0.0345) < 0.01 &&
      K11_RELAX_FRACTION > 0.8,
  },
  {
    // (R2) The largest positive residual migrates to -- and grows at -- the new endpoint; it never
    // stays at k=11. Trough migrates outward in lock-step.
    id: 'imp33877-largest-residual-migrates-to-new-endpoint',
    description: 'argmax at the endpoint every time (k=11->11.5->12), peak grows +0.2479->+0.3218->+0.3830; trough migrates 9->9.5',
    holds: () =>
      EXT115.argmax.k === 11.5 &&
      EXT115.argmax.isEndpoint === true &&
      EXT12.argmax.k === 12 &&
      EXT12.argmax.isEndpoint === true &&
      ENDPOINT_PEAK_SEQUENCE[0] < ENDPOINT_PEAK_SEQUENCE[1] &&
      ENDPOINT_PEAK_SEQUENCE[1] < ENDPOINT_PEAK_SEQUENCE[2] &&
      BASE.argmin.k === 9 &&
      EXT12.argmin.k > BASE.argmin.k,
  },
  {
    // (R3) The underlying tail deceleration is genuine (RMSE rises, R^2 dips as the ladder lengthens)
    // but the log-linear form verdict is untouched (R^2 stays > 0.994).
    id: 'imp33877-tail-deceleration-genuine-form-untouched',
    description: 'RMSE rises 0.116->0.182 and R^2 dips as ladder lengthens, but R^2 stays > 0.994 (form verdict intact)',
    holds: () =>
      EXT12.rmse > EXT115.rmse &&
      EXT115.rmse > BASE.rmse &&
      EXT12.r2 < EXT115.r2 &&
      EXT115.r2 < BASE.r2 &&
      EXT12.r2 > 0.994,
  },
  {
    // Honesty gate: endpoint-artifact verdict, isRigorous false, form verdict untouched, no QED, no refereed bound is changed.
    id: 'imp33877-honesty-gate-no-qed',
    description: 'Measurement only: endpoint-artifact verdict, isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.verdictIsEndpointArtifact === true &&
      IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.isRigorous === false &&
      /NO QED/.test(IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.verdict) &&
      /refereed bound is changed/i.test(IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.verdict),
  },
];

for (const a of IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33877-widening-fit-tail-endpoint-artifact-test assertion failed: ${a.id}`);
  }
}
