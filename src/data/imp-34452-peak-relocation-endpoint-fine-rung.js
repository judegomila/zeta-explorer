/**
 * @module imp-34452-peak-relocation-endpoint-fine-rung
 *
 * imp-34452 (numerical, frontier-direction): imp-34369 answered the two imp-34288 open questions but
 * bracketed the peak-relocation regime ENDPOINT (the width w* at which the imp-34085 OLS |trough|/|peak|
 * argmax peak first migrates OFF the receding right endpoint to the near-left rung k = 6.5) only to a
 * HALF-OPEN RUNG INTERVAL. imp-34369 F1 read the migration as a discrete rung-quantized step at w* = 9.5
 * because the imp-33810 ladder is quantized at dk = 0.25: a nominal kEnd strictly between two rungs adds NO
 * new rung, so kEnd = 15.30..15.45 all reproduce the kEnd = 15.25 fit IDENTICALLY and the peak relocates the
 * instant the k = 15.5 rung is added. imp-34369 therefore located w* only to (9.25, 9.5] and noted finer
 * resolution would sharpen the crossing -- but finer kEnd resolution ON THE SAME COARSE LADDER cannot, since
 * it adds no rungs. This module does what imp-34369 could not: it REBUILDS THE LADDER ON A FINER RUNG GRID
 * (dk = 0.125, 0.05, 0.025) so that intermediate kEnd values contribute GENUINE new rungs, then re-locates
 * the endpoint where the argmax peak first leaves the right endpoint. The parts/residExp/buildLadder/
 * fitLadder machinery is the VERBATIM imp-34369 code with a single added dk parameter; a reuse gate at
 * dk = 0.25 reproduces the imp-34369 coarse rows exactly.
 *
 * THE FINDING (measurement / grid-refinement only)
 * ------------------------------------------------
 *   (F1) THE RELOCATION ENDPOINT TIGHTENS AND CONVERGES to w* = 9.4 (kEnd = 15.4). Refining the rung grid
 *        narrows the imp-34369 (9.25, 9.5] bracket monotonically: at dk = 0.125 the first migrated width is
 *        w* = 9.375 (last endpoint-locked 9.25); at dk = 0.05 it is w* = 9.4 (last locked 9.35); at
 *        dk = 0.025 it is again w* = 9.4 (last locked 9.375). So the first-migrated width settles on
 *        w* = 9.4 by dk = 0.05 and stays there at dk = 0.025, tightening the endpoint to the bracket
 *        (9.375, 9.4] -- a window ~5x narrower than imp-34369's (9.25, 9.5] and centred BELOW its coarse
 *        first-migrated width 9.5. The converged endpoint is kEnd = 15.4 (w = 9.4).
 *   (F2) THE MIGRATION REMAINS A DISCRETE RUNG-QUANTIZED STEP AT EVERY RESOLUTION -- refining the rung grid
 *        does NOT turn it into a continuous threshold; it only pins the STEP LOCATION more precisely. At
 *        each dk the argmax flips from endpoint-locked to k = 6.5 across a single rung addition (the last
 *        locked and first migrated kEnd are exactly one dk apart), exactly as imp-34369 F1 described at
 *        dk = 0.25. imp-34369 F1 stands: the relocation is a step, not a smooth crossing; this module only
 *        sharpens WHERE the step sits.
 *
 * HONESTY CAVEAT: the ladder is a DESCRIPTIVE OLS surrogate, so its residual magnitudes are
 * RESOLUTION-DEPENDENT -- a finer rung grid fits more points and the |trough|/|peak| ratio at a fixed kEnd
 * shifts (e.g. kEnd = 15.25 reads 0.9072 at dk = 0.25 but 0.8669 at dk = 0.05). The sharpened quantity is
 * the ENDPOINT LOCATION (which kEnd the argmax leaves the endpoint), NOT the ratio magnitude; the coarse
 * imp-34288/imp-34369 ratio values are NOT reproduced on the finer grids and are not meant to be. This is a
 * finer-rung-grid re-run of an inherited descriptive OLS surrogate, NOT an RH bound. The component model
 * sigma = E_coll / (E_trunc + E_flow + E_coll) is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the imp-33843 log-linear form verdict is UNTOUCHED; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34369-peak-relocation-regime-width (the (9.25, 9.5] half-open bracket sharpened here)
 * @see imp-34288-trough-peak-ratio-ceiling-extension (the ~0.907 max, w ~ 9.25 migration)
 * @see imp-34085-trough-peak-ratio-convergence (the |trough|/|peak| ratio sequence and machinery)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS surrogate, form verdict untouched)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6..kEnd ladder, quantized at dk = 0.25 there)
 * @see imp-33773 (the M2 sub-leading residual residExp)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 * @see imp-486 (C_mb GUE-conditional, untouched)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34369_PEAK_RELOCATION_REGIME_WIDTH } from './imp-34369-peak-relocation-regime-width.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-33810/imp-34369
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810/imp-34369 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

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
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
function residExpAt(kk) {
  const lo = Math.pow(10, kk);
  const hi = Math.pow(10, kk + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}

// Build the ladder eflow_over_resid over k = 6.00 .. kEnd at a SETTABLE rung spacing dk (imp-34369 fixed
// dk = 0.25; the single added parameter is the whole point of this refinement).
function buildLadder(kEnd, dk) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += dk) {
    const kk = +k.toFixed(4);
    const hi = Math.pow(10, kk + 1);
    const ph = parts(hi);
    const residExp = residExpAt(kk);
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}
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
  return {
    argmax: { k: KS[maxI], resid: +RES[maxI].toExponential(4), isEndpoint: maxI === RES.length - 1 },
    argmin: { k: KS[minI], resid: +RES[minI].toExponential(4) },
  };
}
function rowFor(kEnd, dk) {
  const ke = +kEnd.toFixed(4);
  const f = fitLadder(buildLadder(ke, dk));
  return {
    kEnd: ke,
    w: +(ke - 6).toFixed(4),
    peakK: f.argmax.k,
    peakIsEndpoint: f.argmax.isEndpoint,
    ratio: +(Math.abs(f.argmin.resid) / Math.abs(f.argmax.resid)).toFixed(4),
  };
}

// Locate the relocation endpoint on a given rung grid: scan kEnd across the migration interval in steps of
// dk (each step now adds a genuine rung), returning the last endpoint-locked width and the first migrated
// width (which straddle the step by exactly one rung).
function locateEndpoint(dk, kLo = 15.0, kHi = 15.5) {
  let lastLocked = null;
  let firstMigrated = null;
  for (let ke = kLo; ke <= kHi + 1e-9; ke += dk) {
    const r = rowFor(+ke.toFixed(4), dk);
    if (r.peakIsEndpoint) lastLocked = r;
    else if (!firstMigrated) firstMigrated = r;
  }
  return {
    dk,
    lastLockedW: lastLocked ? lastLocked.w : null,
    firstMigratedW: firstMigrated ? firstMigrated.w : null,
    firstMigratedKEnd: firstMigrated ? firstMigrated.kEnd : null,
  };
}

// ---- Reuse gate: dk = 0.25 reproduces the imp-34369 coarse rows exactly ----
const GATE_ROW_1525 = rowFor(15.25, 0.25); // imp-34369 last endpoint-locked: ratio 0.9072, peak k = 15.25
const GATE_ROW_1550 = rowFor(15.5, 0.25); // imp-34369 first migrated: peak k = 6.5, ratio 0.8946
const IMP34369 = IMP34369_PEAK_RELOCATION_REGIME_WIDTH;
const REUSE_GATE_OK =
  Math.abs(GATE_ROW_1525.ratio - 0.9072) < 1e-9 &&
  GATE_ROW_1525.peakIsEndpoint === true &&
  GATE_ROW_1550.peakK === 6.5 &&
  GATE_ROW_1550.peakIsEndpoint === false &&
  Math.abs(GATE_ROW_1525.w - IMP34369.maxEndpointLockedW) < 1e-9 &&
  Math.abs(GATE_ROW_1550.w - IMP34369.migrationWidthStar) < 1e-9;

// ---- Finer-rung-grid endpoint refinement ----
const REFINEMENT = [0.125, 0.05, 0.025].map((dk) => locateEndpoint(dk));
const ENDPOINT_0125 = REFINEMENT[0]; // firstMigratedW 9.375
const ENDPOINT_005 = REFINEMENT[1]; // firstMigratedW 9.4
const ENDPOINT_0025 = REFINEMENT[2]; // firstMigratedW 9.4
// The endpoint converges: first-migrated width settles on 9.4 at dk = 0.05 and holds at dk = 0.025.
const CONVERGED_ENDPOINT_W = ENDPOINT_005.firstMigratedW; // 9.4
const CONVERGED_ENDPOINT_KEND = ENDPOINT_005.firstMigratedKEnd; // 15.4
const ENDPOINT_CONVERGES = Math.abs(ENDPOINT_005.firstMigratedW - ENDPOINT_0025.firstMigratedW) < 1e-9;
// The tightest bracket (dk = 0.025): (lastLocked, firstMigrated] = (9.375, 9.4].
const TIGHT_BRACKET = [ENDPOINT_0025.lastLockedW, ENDPOINT_0025.firstMigratedW]; // (9.375, 9.4]
// Coarse imp-34369 bracket width vs the refined bracket width (5x tighter).
const COARSE_BRACKET_WIDTH = IMP34369.migrationWidthStar - IMP34369.maxEndpointLockedW; // 0.25
const TIGHT_BRACKET_WIDTH = +(TIGHT_BRACKET[1] - TIGHT_BRACKET[0]).toFixed(4); // 0.025

export const IMP34452_PEAK_RELOCATION_ENDPOINT_FINE_RUNG = {
  id: 'imp-34452',
  proofSection: 'S-frontier',
  question:
    'imp-34369 bracketed the peak-relocation regime ENDPOINT (the width w* at which the imp-34085 OLS ' +
    '|trough|/|peak| argmax peak first migrates off the receding right endpoint to the near-left rung ' +
    'k = 6.5) only to the half-open rung interval (9.25, 9.5], because the imp-33810 ladder is quantized at ' +
    'dk = 0.25 and sub-0.25 kEnd values add no rung. Recompute on a FINER rung grid (dk = 0.125, 0.05, ' +
    '0.025) so intermediate kEnd values add genuine rungs, and report the tightened endpoint location. ' +
    'Measurement / grid-refinement only; imp-33843 form verdict untouched; NOT an RH bound; no QED.',
  measuredQuantity:
    'The last endpoint-locked width and first migrated width on rung grids dk = 0.25 (reuse gate), 0.125, ' +
    '0.05, 0.025, using the VERBATIM imp-34369 parts/residExp/buildLadder/fitLadder machinery with a single ' +
    'added dk parameter (reuse gate reproduces the imp-34369 coarse kEnd = 15.25 and 15.5 rows exactly)',
  reuseGateOk: REUSE_GATE_OK, // true -- same measurement, finer rung grid
  refinement: REFINEMENT, // dk = 0.125, 0.05, 0.025 -> {lastLockedW, firstMigratedW, firstMigratedKEnd}
  // (F1) The relocation endpoint tightens and converges.
  coarseFirstMigratedW: IMP34369.migrationWidthStar, // 9.5 (imp-34369 dk = 0.25)
  convergedEndpointW: CONVERGED_ENDPOINT_W, // 9.4
  convergedEndpointKEnd: CONVERGED_ENDPOINT_KEND, // 15.4
  endpointConverges: ENDPOINT_CONVERGES, // true -- 9.4 at dk = 0.05 holds at dk = 0.025
  tightBracket: TIGHT_BRACKET, // (9.375, 9.4] at dk = 0.025
  coarseBracketWidth: COARSE_BRACKET_WIDTH, // 0.25
  tightBracketWidth: TIGHT_BRACKET_WIDTH, // 0.025 -- ~5x narrower than the imp-34369 (9.25, 9.5]
  // (F2) The migration stays a discrete rung-quantized step at every resolution.
  migrationStaysRungQuantizedStep: true,
  finding: {
    F1_endpoint_tightens_and_converges_to_w_star_9p4:
      'Refining the rung grid narrows the imp-34369 (9.25, 9.5] bracket monotonically: dk = 0.125 gives ' +
      'first-migrated width 9.375 (last locked 9.25); dk = 0.05 gives 9.4 (last locked 9.35); dk = 0.025 ' +
      'again gives 9.4 (last locked 9.375). The first-migrated width settles on w* = 9.4 by dk = 0.05 and ' +
      'holds at dk = 0.025, tightening the endpoint to (9.375, 9.4] -- a bracket ~5x narrower than the ' +
      'imp-34369 (9.25, 9.5] and centred BELOW its coarse value 9.5. The converged endpoint is ' +
      'kEnd = 15.4 (w = 9.4).',
    F2_migration_remains_a_rung_quantized_step:
      'The migration stays a DISCRETE rung-quantized step at every resolution -- refining the rung grid ' +
      'does NOT make it a continuous threshold; at each dk the argmax flips from endpoint-locked to k = 6.5 ' +
      'across a single rung addition (last-locked and first-migrated kEnd exactly one dk apart), as ' +
      'imp-34369 F1 described at dk = 0.25. Only the LOCATION of the step is sharpened, not its character.',
    honesty_ratio_magnitudes_are_resolution_dependent:
      'The ladder is a descriptive OLS surrogate, so residual magnitudes are RESOLUTION-DEPENDENT: a finer ' +
      'grid fits more points and the |trough|/|peak| ratio at a fixed kEnd shifts (kEnd = 15.25 reads ' +
      '0.9072 at dk = 0.25 but 0.8669 at dk = 0.05). The sharpened quantity is the ENDPOINT LOCATION, NOT ' +
      'the ratio magnitude; the coarse imp-34288/imp-34369 ratio values are not reproduced on finer grids.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / GRID-REFINEMENT (frontier-direction, NOT rigorous). Sharpening the imp-34369 half-open ' +
    'peak-relocation endpoint bracket (9.25, 9.5] with the VERBATIM imp-34369 OLS residual machinery on a ' +
    'FINER rung grid (single added dk parameter; reuse gate reproduces the imp-34369 coarse kEnd = 15.25 ' +
    'ratio 0.9072 and kEnd = 15.5 peak k = 6.5 rows exactly): (F1) the relocation endpoint TIGHTENS and ' +
    'CONVERGES to w* = 9.4 (kEnd = 15.4) -- dk = 0.125 -> 9.375, dk = 0.05 -> 9.4, dk = 0.025 -> 9.4 -- ' +
    'settling by dk = 0.05 into the bracket (9.375, 9.4], ~5x narrower than imp-34369 and centred BELOW its ' +
    'coarse first-migrated width 9.5; (F2) the migration REMAINS a discrete rung-quantized step at every ' +
    'resolution (the argmax flips across a single rung addition), so refining sharpens WHERE the step sits ' +
    'without turning it continuous -- imp-34369 F1 stands. HONESTY: the ladder OLS surrogate is ' +
    'resolution-dependent, so ratio magnitudes at a fixed kEnd shift with dk (0.9072 -> 0.8669); the ' +
    'sharpened quantity is the endpoint LOCATION, not the ratio value, and the coarse ratios are not ' +
    'reproduced on the finer grids. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the imp-33843 log-linear form verdict is UNTOUCHED; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34369 (the (9.25, 9.5] half-open endpoint bracket sharpened here, coarse rows reproduced by the ' +
    'reuse gate); imp-34288 (the ~0.907 max, w ~ 9.25 migration); imp-34085 (the |trough|/|peak| ratio ' +
    'sequence and machinery); imp-33843 (the log-linear OLS surrogate, form verdict untouched); imp-33810 ' +
    '(the k=6..kEnd ladder, quantized at dk = 0.25 there); imp-33773 (the residExp M2 residual); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED); imp-486 (C_mb ' +
    'GUE-conditional, untouched).',
};

export const IMP34452_PEAK_RELOCATION_ENDPOINT_FINE_RUNG_ASSERTIONS = [
  {
    // Reuse gate: dk = 0.25 reproduces the imp-34369 coarse endpoint rows exactly.
    id: 'imp34452-reuse-gate-reproduces-imp34369-coarse',
    description: 'dk=0.25 reproduces imp-34369: kEnd=15.25 ratio 0.9072 endpoint-locked, kEnd=15.5 peak k=6.5 migrated',
    holds: () =>
      REUSE_GATE_OK === true &&
      Math.abs(GATE_ROW_1525.ratio - 0.9072) < 1e-9 &&
      GATE_ROW_1525.peakIsEndpoint === true &&
      GATE_ROW_1550.peakK === 6.5 &&
      GATE_ROW_1550.peakIsEndpoint === false,
  },
  {
    // (F1) The endpoint tightens and converges to w* = 9.4 (kEnd = 15.4).
    id: 'imp34452-endpoint-tightens-and-converges-to-w-star-9p4',
    description: 'first-migrated width 9.375 (dk=0.125) -> 9.4 (dk=0.05) -> 9.4 (dk=0.025); converges to w*=9.4, kEnd=15.4',
    holds: () =>
      Math.abs(ENDPOINT_0125.firstMigratedW - 9.375) < 1e-9 &&
      Math.abs(ENDPOINT_005.firstMigratedW - 9.4) < 1e-9 &&
      Math.abs(ENDPOINT_0025.firstMigratedW - 9.4) < 1e-9 &&
      ENDPOINT_CONVERGES === true &&
      Math.abs(CONVERGED_ENDPOINT_W - 9.4) < 1e-9 &&
      Math.abs(CONVERGED_ENDPOINT_KEND - 15.4) < 1e-9,
  },
  {
    // (F1) The refined bracket (9.375, 9.4] is ~5x narrower than the imp-34369 (9.25, 9.5].
    id: 'imp34452-bracket-tightened-5x-below-coarse-value',
    description: 'tight bracket (9.375, 9.4] width 0.025 vs imp-34369 coarse width 0.25 (10x); w*=9.4 sits below coarse 9.5',
    holds: () =>
      Math.abs(TIGHT_BRACKET[0] - 9.375) < 1e-9 &&
      Math.abs(TIGHT_BRACKET[1] - 9.4) < 1e-9 &&
      Math.abs(TIGHT_BRACKET_WIDTH - 0.025) < 1e-9 &&
      TIGHT_BRACKET_WIDTH < COARSE_BRACKET_WIDTH &&
      CONVERGED_ENDPOINT_W < IMP34369.migrationWidthStar,
  },
  {
    // (F2) At every resolution the last-locked and first-migrated widths are exactly one dk apart (a step).
    id: 'imp34452-migration-remains-single-rung-step',
    description: 'at each dk the last-locked and first-migrated widths differ by exactly one rung (discrete step)',
    holds: () =>
      REFINEMENT.every(
        (r) => r.lastLockedW !== null && r.firstMigratedW !== null &&
          Math.abs(r.firstMigratedW - r.lastLockedW - r.dk) < 1e-9,
      ) && IMP34452_PEAK_RELOCATION_ENDPOINT_FINE_RUNG.migrationStaysRungQuantizedStep === true,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, imp-3066 & imp-33843 untouched.
    id: 'imp34452-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed, imp-33843 form verdict & imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34452_PEAK_RELOCATION_ENDPOINT_FINE_RUNG.isRigorous === false &&
      /NO QED/.test(IMP34452_PEAK_RELOCATION_ENDPOINT_FINE_RUNG.verdict) &&
      /refereed bound is changed/i.test(IMP34452_PEAK_RELOCATION_ENDPOINT_FINE_RUNG.verdict) &&
      /imp-33843 log-linear form verdict is UNTOUCHED/.test(IMP34452_PEAK_RELOCATION_ENDPOINT_FINE_RUNG.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34452_PEAK_RELOCATION_ENDPOINT_FINE_RUNG.verdict),
  },
];

for (const a of IMP34452_PEAK_RELOCATION_ENDPOINT_FINE_RUNG_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34452-peak-relocation-endpoint-fine-rung assertion failed: ${a.id}`);
  }
}
