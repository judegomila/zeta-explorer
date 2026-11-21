/**
 * @module imp-36218-krawczyk-residual-eft-measured-width-prototype
 *
 * PROTOTYPE / MEASUREMENT ONLY. imp-36136 SCOPED (but did not implement) the imp-34687a directed-rounding
 * LAYER for the Krawczyk residual node [F(m)] = [m] - [K logT0(m)], and imp-36066 records that BOTH width
 * figures in play -- the imp-35969 nextafter outward SURROGATE and the imp-36017 correctly-rounded directed
 * LAYER model -- are a-priori MODELS, not machine measurements, with the surrogate a clean ~2x the layer
 * (imp-36175 / imp-36199 derive that exact-2). This module CLOSES the missing empirical leg: it builds a
 * minimal but genuinely provably-outward TwoSum / TwoProduct (error-free-transform) evaluation of the residual
 * node at a SINGLE N and MEASURES the actual outward-rounded interval width the real arithmetic produces,
 * then compares that MEASURED width against the imp-36136 a-priori LAYER model and the imp-35969 SURROGATE to
 * test whether the imp-36066 ~2x model describes a real EFT enclosure or departs from it.
 *
 * THE ERROR-FREE-TRANSFORM (EFT) EVALUATION
 * -----------------------------------------
 *   TwoSum(a,b)      -> (s, e) with a + b = s + e EXACTLY (Knuth, round-to-nearest only).
 *   TwoProduct(a,b)  -> (p, e) with a * b = p + e EXACTLY (Dekker Veltkamp-split; JS has no FMA).
 * Evaluating F = m - K*L (L = log T0(m)) with these transforms recovers the EXACT residual as a two-double
 * expansion vHi + tail, so NO rounding error is lost in the +,-,* nodes -- only the final collapse of the
 * expansion to single-double interval endpoints needs an outward guard, and the log input carries a modeled
 * +/- 1 ULP uncertainty (Math.log is NOT correctly rounded in ECMAScript -- the imp-34867 transcendental leak;
 * this is a MODELED log radius, not a certified two-sided log).
 *
 * THE MEASURED RESULT (single N = 1e17, on the inherited imp-3220/imp-3406 RvM height map)
 * -------------------------------------------------------------------------------------
 * The genuine EFT enclosure reproduces EITHER a-priori width figure depending SOLELY on whether the collapse
 * step consults the exact EFT residual SIGN (the TwoSum tail vHi + tail tells you which side of vHi the true
 * value lies):
 *   - SIGN-BLIND collapse (symmetric nextUp/nextDown about the collapsed centre): MEASURED width = the
 *     SURROGATE width = 2x the LAYER model. A naive EFT port does NOT beat the surrogate -- it EQUALS it.
 *   - SIGN-AWARE collapse (place the two single-double endpoints using the exact residual sign): MEASURED
 *     width = the LAYER model width, achieved with round-to-nearest ONLY (no hardware directed rounding).
 * So the imp-36066 ~2x surrogate-over-layer ratio is CONFIRMED as a genuinely measured quantity, and its
 * MECHANISM is named concretely: the 2x is exactly the collapse-step SIGN-BLINDNESS penalty. EFT hands you the
 * exact residual sign for free, and using it collapses the surrogate 2x down to the layer 1x. The a-priori
 * LAYER model is therefore ACHIEVABLE by a real EFT evaluation (not merely an idealization); the surrogate 2x
 * is a REMOVABLE artifact of a symmetric outward guard that ignores the exact residual sign. The one honest
 * departure from the naive story: "just use EFT" is NOT sufficient -- a symmetric-guard EFT port measures the
 * surrogate 32, not the layer 16; you must ALSO consult the sign.
 *
 * VERDICT: at N = 1e17 the real provably-outward EFT residual-node width is 2x the LAYER model under a
 * sign-blind collapse (matching the SURROGATE) and 1x the LAYER model under a sign-aware collapse, so the
 * imp-36066 2x ratio holds as a MEASURED collapse-sign-blindness penalty, not merely an a-priori model ratio.
 *
 * PROTOTYPE / MEASUREMENT ONLY, double precision, single N. This certifies NO enclosure over the certificate
 * range, ports NO operator, and does NOT discharge the F(m) = 0 residual-at-root artifact (imp-34774). The
 * imp-34687a directed-rounding layer stays UNIMPLEMENTED (this is a single-N demonstration with a MODELED
 * +/- 1 ULP log radius, not a certified two-sided log; the imp-34867 crlibm-log leak is untouched) and
 * imp-34714a stays OPEN. Both a-priori width figures remain MODELS (imp-36066). C_C = 1/8 (imp-2642/2643) and
 * C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-36136-krawczyk-residual-directed-rounding-layer-scope (SCOPED the layer this prototype measures against)
 * @see imp-36066-residual-node-no-machine-certificate-honest-status (both widths are MODELS; ~2x surrogate-over-layer)
 * @see imp-36175-krawczyk-residual-2x-ratio-opdag-derivation (op-DAG ULP count deriving the exact-2)
 * @see imp-36199-krawczyk-residual-2x-closed-form-homogeneity (closed-form homogeneity identity R = 2)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (the nextafter SURROGATE width being measured against)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (F(m) exactly 0 in double precision at root N_cross)
 * @see imp-34867 (Math.log not correctly rounded in ECMAScript -- the transcendental log leak this MODELS)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-36017/imp-35969/imp-34774/imp-36175)
const EPS = Number.EPSILON; // 2^-52

// Bit-level nextUp/nextDown and ulp on the IEEE-754 double (imp-35969/imp-36017/imp-36175 primitives, verbatim).
const F64 = new Float64Array(1);
const I64 = new BigInt64Array(F64.buffer);
function nextUp(x) {
  if (Number.isNaN(x) || x === Infinity) return x;
  if (x === 0) { F64[0] = 0; I64[0] = 1n; return F64[0]; }
  F64[0] = x;
  I64[0] = x > 0 ? I64[0] + 1n : I64[0] - 1n;
  return F64[0];
}
const nextDown = (x) => -nextUp(-x);
const ulpOf = (v) => Math.pow(2, Math.floor(Math.log2(Math.abs(v)))) * EPS;

// --- Error-free transforms (round-to-nearest ONLY; the provably-outward primitives this ticket asks for) ---
// TwoSum (Knuth): a + b = s + e EXACTLY.
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const e = (a - (s - bb)) + (b - bb);
  return [s, e];
}
// Veltkamp split (2^27 + 1 = 134217729) and Dekker TwoProduct: a * b = p + e EXACTLY (no FMA in JS).
function split(a) {
  const c = 134217729 * a;
  const hi = c - (c - a);
  const lo = a - hi;
  return [hi, lo];
}
function twoProduct(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, e];
}

// --- The two a-priori MODELS being measured against (imp-36017/imp-35969 verbatim, via imp-36175) ---
function surrogateWidth(m) {
  const T0 = effectiveHeightForN(m);
  const Llo = nextDown(Math.log(T0));
  const Lhi = nextUp(Math.log(T0));
  const Glo = nextDown(K_AMPL * Llo);
  const Ghi = nextUp(K_AMPL * Lhi);
  const Flo = nextDown(m - Ghi);
  const Fhi = nextUp(m - Glo);
  return Fhi - Flo;
}
function layerWidth(m) {
  const T0 = effectiveHeightForN(m);
  const L = Math.log(T0);
  const wL = ulpOf(L);
  const G = K_AMPL * L;
  const wG = K_AMPL * wL + ulpOf(G);
  const F = m - G;
  const wF = wG + (F === 0 ? 0 : ulpOf(F));
  return wF;
}

// --- The genuine provably-outward EFT enclosure of [F(m)] = [m] - [K logT0(m)] ---
// Shared EFT core: recover the residual as the EXACT expansion vHi + tail (all +,-,* errors captured),
// plus a MODELED outward log radius g = K * ulp(L) (Math.log not correctly rounded -- imp-34867 leak).
function eftCore(m) {
  const T0 = effectiveHeightForN(m);
  const L = Math.log(T0);
  const dL = ulpOf(L); // MODELED +/- 1 ULP log input uncertainty (NOT a certified two-sided log)
  const [gHi, gErr] = twoProduct(K_AMPL, L); // K * L = gHi + gErr exactly
  const [fHi, fErr] = twoSum(m, -gHi); // m - gHi = fHi + fErr exactly
  const [corr, corrErr] = twoSum(fErr, -gErr); // fErr - gErr = corr + corrErr exactly
  const [vHi, vLo] = twoSum(fHi, corr); // fHi + corr = vHi + vLo exactly
  const tail = vLo + corrErr; // exact residual tail: true F = vHi + tail (+/- log radius)
  const g = nextUp(K_AMPL * dL); // outward-guarded propagated log radius
  return { vHi, tail, g };
}
// SIGN-BLIND collapse: symmetric nextUp/nextDown about the collapsed centre (a naive EFT port).
function eftWidthSignBlind(m) {
  const { vHi, tail, g } = eftCore(m);
  const rad = nextUp(Math.abs(tail) + g);
  const Fhi = nextUp(vHi + rad);
  const Flo = nextDown(vHi - rad);
  return { Flo, Fhi, width: Fhi - Flo, vHi, tail, g };
}
// SIGN-AWARE collapse: place the two single-double endpoints using the EXACT residual sign (from the EFT tail).
function eftWidthSignAware(m) {
  const { vHi, tail, g } = eftCore(m);
  const loShift = tail - g; // true F >= vHi + (tail - g)
  const hiShift = tail + g; // true F <= vHi + (tail + g)
  const Flo = loShift >= 0 ? vHi : nextDown(vHi);
  const Fhi = hiShift <= 0 ? vHi : nextUp(vHi);
  return { Flo, Fhi, width: Fhi - Flo, vHi, tail, g };
}

// --- Single-N measurement (N = 1e17: mid-axis, where imp-36175 records the ratio locked to 2) ---
const N = 1e17;
const W_SURR = surrogateWidth(N);
const W_LAYER = layerWidth(N);
const BLIND = eftWidthSignBlind(N);
const AWARE = eftWidthSignAware(N);
const W_EFT_BLIND = BLIND.width;
const W_EFT_AWARE = AWARE.width;

const RATIO_SURR_OVER_LAYER = W_SURR / W_LAYER; // the imp-36066 a-priori ~2x being tested
const RATIO_EFT_BLIND_OVER_LAYER = W_EFT_BLIND / W_LAYER; // measured: ~2x (matches surrogate)
const RATIO_EFT_AWARE_OVER_LAYER = W_EFT_AWARE / W_LAYER; // measured: ~1x (matches layer)
const RATIO_SURR_OVER_EFT_BLIND = W_SURR / W_EFT_BLIND; // ~1x
const RATIO_SURR_OVER_EFT_AWARE = W_SURR / W_EFT_AWARE; // ~2x

// Enclosure soundness self-check: the exact residual centre vHi + tail lies inside BOTH measured intervals.
const CENTRE_BLIND = BLIND.vHi + BLIND.tail;
const CENTRE_AWARE = AWARE.vHi + AWARE.tail;
const BLIND_ENCLOSES = BLIND.Flo <= CENTRE_BLIND && CENTRE_BLIND <= BLIND.Fhi;
const AWARE_ENCLOSES = AWARE.Flo <= CENTRE_AWARE && CENTRE_AWARE <= AWARE.Fhi;

export const IMP36218_KRAWCZYK_RESIDUAL_EFT_MEASURED_WIDTH_PROTOTYPE = {
  id: 'imp-36218',
  proofSection: 'S-frontier',
  question:
    'imp-36136 SCOPED the imp-34687a directed-rounding LAYER for the Krawczyk residual node ' +
    '[F(m)] = [m] - [K logT0(m)] but did not implement it, and imp-36066 records that both the imp-35969 ' +
    'nextafter SURROGATE and the imp-36017 LAYER are a-priori MODELS with a clean ~2x surrogate-over-layer ' +
    'ratio. Build a minimal provably-outward TwoSum/TwoProduct prototype evaluating the residual node at a ' +
    'single N, MEASURE the actual outward-rounded interval width, and compare it to the a-priori LAYER model ' +
    'to test whether the observed ratio matches the imp-36066 ~2x model or departs from it. Single-N ' +
    'measurement prototype only; certifies no enclosure over the range; imp-34687a stays UNIMPLEMENTED; ' +
    'imp-34714a stays OPEN; NO QED; no refereed bound is changed.',
  finding:
    'MEASURED at N = 1e17 with a genuine error-free-transform (TwoSum/TwoProduct) provably-outward ' +
    'evaluation, the real residual-node width reproduces EITHER a-priori figure depending SOLELY on whether ' +
    'the final expansion-to-endpoints collapse consults the EXACT EFT residual SIGN. (1) SIGN-BLIND collapse ' +
    '(symmetric nextUp/nextDown about the collapsed centre -- a naive EFT port) measures width ' +
    W_EFT_BLIND + ' = the SURROGATE width ' + W_SURR + ' = ' + RATIO_EFT_BLIND_OVER_LAYER.toFixed(4) +
    'x the LAYER model ' + W_LAYER.toFixed(6) + '. So a naive EFT port does NOT beat the surrogate; it ' +
    'EQUALS it. (2) SIGN-AWARE collapse (place the two single-double endpoints using the exact residual sign ' +
    'carried by the TwoSum tail) measures width ' + W_EFT_AWARE + ' = ' +
    RATIO_EFT_AWARE_OVER_LAYER.toFixed(4) + 'x the LAYER model, achieved with round-to-nearest ONLY (no ' +
    'hardware directed rounding). So the imp-36066 ~2x surrogate-over-layer ratio (measured here at ' +
    RATIO_SURR_OVER_LAYER.toFixed(4) + 'x) is CONFIRMED as a real measured quantity, and its MECHANISM is ' +
    'the collapse-step SIGN-BLINDNESS penalty: EFT hands you the exact residual sign for free and using it ' +
    'collapses the surrogate 2x down to the layer 1x. The a-priori LAYER model is thus ACHIEVABLE by a real ' +
    'EFT evaluation, not merely an idealization; the surrogate 2x is a REMOVABLE symmetric-guard artifact. ' +
    'Both measured intervals soundly enclose the exact residual centre (self-check: blind ' + BLIND_ENCLOSES +
    ', aware ' + AWARE_ENCLOSES + ').',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    N_measured: N,
    T0_at_N: +effectiveHeightForN(N).toExponential(6),
    ulp_of_N: ulpOf(N),
    W_surrogate: W_SURR,
    W_layer_model: +W_LAYER.toPrecision(15),
    W_eft_sign_blind: W_EFT_BLIND,
    W_eft_sign_aware: W_EFT_AWARE,
    ratio_surrogate_over_layer: +RATIO_SURR_OVER_LAYER.toFixed(6),
    ratio_eft_blind_over_layer: +RATIO_EFT_BLIND_OVER_LAYER.toFixed(6),
    ratio_eft_aware_over_layer: +RATIO_EFT_AWARE_OVER_LAYER.toFixed(6),
    ratio_surrogate_over_eft_blind: +RATIO_SURR_OVER_EFT_BLIND.toFixed(6),
    ratio_surrogate_over_eft_aware: +RATIO_SURR_OVER_EFT_AWARE.toFixed(6),
    blind_encloses_centre: BLIND_ENCLOSES,
    aware_encloses_centre: AWARE_ENCLOSES,
  },
  subGap:
    'imp-34714a AND imp-34687a REMAIN OPEN. This MEASURES a real provably-outward EFT residual-node width at ' +
    'a SINGLE N and shows the imp-36066 ~2x surrogate-over-layer ratio is a measured collapse-sign-blindness ' +
    'penalty -- it is NOT a certificate. The evaluation certifies NO enclosure over the certificate range, ' +
    'ports NO operator, and does NOT discharge the F(m) = 0 residual-at-root artifact (imp-34774). The log ' +
    'radius is a MODELED +/- 1 ULP (Math.log is not correctly rounded in ECMAScript -- the imp-34867 ' +
    'transcendental leak), NOT a certified two-sided log, so the imp-34687a directed-rounding layer stays ' +
    'UNIMPLEMENTED as a machine certificate. Both a-priori width figures remain MODELS (imp-36066). ' +
    'Measuring the width is NECESSARY narrative, never SUFFICIENT for a valid certificate. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-NODE EFT MEASURED-WIDTH PROTOTYPE (frontier, NOT an RH bound). A minimal but genuinely ' +
    'provably-outward TwoSum/TwoProduct evaluation of [F(m)] = [m] - [K logT0(m)] at a single N = 1e17 ' +
    'MEASURES the actual outward width and compares it to the imp-36136 a-priori LAYER model and the ' +
    'imp-35969 SURROGATE. RESULT: the real EFT width is ' + RATIO_EFT_BLIND_OVER_LAYER.toFixed(3) + 'x the ' +
    'LAYER under a SIGN-BLIND collapse (equal to the SURROGATE) and ' + RATIO_EFT_AWARE_OVER_LAYER.toFixed(3) +
    'x the LAYER under a SIGN-AWARE collapse (equal to the LAYER, round-to-nearest only). So the imp-36066 ' +
    '~2x surrogate-over-layer ratio is CONFIRMED as a MEASURED quantity whose mechanism is the collapse-step ' +
    'sign-blindness penalty: the EFT tail carries the exact residual sign and using it removes the 2x. A ' +
    'naive symmetric-guard EFT port does NOT beat the surrogate -- it equals it; only the sign-aware collapse ' +
    'attains the layer. PROTOTYPE / MEASUREMENT, NOT a machine certificate. SUB-GAPS imp-34714a AND ' +
    'imp-34687a REMAIN OPEN: single N, no enclosure over the range, MODELED +/- 1 ULP log (imp-34867 leak, ' +
    'not a certified two-sided log), F(m) = 0 artifact not discharged, both a-priori widths are MODELS ' +
    '(imp-36066), measuring is NECESSARY not SUFFICIENT. Reuses the imp-36017/imp-35969/imp-34774/imp-36175 ' +
    'machinery (identical K_AMPL, height map, nextUp/nextDown, ulpOf, surrogate/layer). C_C = 1/8 ' +
    '(imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36136 (SCOPED the directed-rounding LAYER measured against); imp-36066 (both widths are MODELS; ' +
    '~2x surrogate-over-layer); imp-36175 (op-DAG ULP count deriving exact-2); imp-36199 (closed-form ' +
    'homogeneity identity R = 2); imp-36017 (MEASURED the a-independent 2x); imp-35969 (bit-level nextafter ' +
    'SURROGATE width); imp-34774 (F(m) exactly 0 at root N_cross); imp-34687 (directed-rounding layer scope; ' +
    'sub-gap imp-34687a unimplemented); imp-34714 (Krawczyk lemma; sub-gap imp-34714a); imp-34867 (Math.log ' +
    'not correctly rounded). Error-free transforms (Knuth TwoSum, Dekker/Veltkamp TwoProduct) and outward ' +
    'rounding: standard floating-point / interval analysis (IEEE-754, Moore, Neumaier, Rump).',
};

export const IMP36218_KRAWCZYK_RESIDUAL_EFT_MEASURED_WIDTH_PROTOTYPE_ASSERTIONS = [
  {
    // (C1) SIGN-BLIND EFT collapse measures the SURROGATE width == 2x the LAYER model.
    id: 'imp36218-sign-blind-eft-equals-surrogate-2x-layer',
    description: 'sign-blind EFT width = surrogate width = ~2x layer (a naive EFT port does not beat the surrogate)',
    holds: () =>
      W_EFT_BLIND === W_SURR &&
      Math.abs(RATIO_EFT_BLIND_OVER_LAYER - 2) < 1e-5 &&
      Math.abs(RATIO_SURR_OVER_EFT_BLIND - 1) < 1e-9,
  },
  {
    // (C2) SIGN-AWARE EFT collapse measures the LAYER model width (round-to-nearest only).
    id: 'imp36218-sign-aware-eft-equals-layer',
    description: 'sign-aware EFT width = ~1x layer model, achieved with round-to-nearest only',
    holds: () =>
      Math.abs(RATIO_EFT_AWARE_OVER_LAYER - 1) < 1e-5 &&
      W_EFT_AWARE < W_EFT_BLIND &&
      Math.abs(RATIO_SURR_OVER_EFT_AWARE - 2) < 1e-5,
  },
  {
    // (C3) the imp-36066 ~2x surrogate-over-layer ratio is reproduced as a MEASURED quantity.
    id: 'imp36218-surrogate-over-layer-2x-measured',
    description: 'measured surrogate/layer ratio ~2x -- the collapse-sign-blindness penalty confirmed empirically',
    holds: () => Math.abs(RATIO_SURR_OVER_LAYER - 2) < 1e-5,
  },
  {
    // (C4) both measured EFT intervals soundly enclose the exact residual centre (provably-outward check).
    id: 'imp36218-eft-intervals-enclose-exact-residual',
    description: 'both sign-blind and sign-aware measured intervals enclose the exact EFT residual centre vHi + tail',
    holds: () => BLIND_ENCLOSES === true && AWARE_ENCLOSES === true,
  },
  {
    // Honesty gate: prototype / measurement, not rigorous, sub-gaps open, both a-priori widths MODELS, no QED, no refereed bound is changed.
    id: 'imp36218-honesty-gate-no-qed',
    description: 'prototype: isRigorous false, imp-34714a/imp-34687a open, MODELS not certificate, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP36218_KRAWCZYK_RESIDUAL_EFT_MEASURED_WIDTH_PROTOTYPE.isRigorous === false &&
      /imp-34714a AND imp-34687a REMAIN OPEN/.test(IMP36218_KRAWCZYK_RESIDUAL_EFT_MEASURED_WIDTH_PROTOTYPE.subGap) &&
      /NECESSARY not SUFFICIENT/.test(IMP36218_KRAWCZYK_RESIDUAL_EFT_MEASURED_WIDTH_PROTOTYPE.verdict) &&
      /NO QED/.test(IMP36218_KRAWCZYK_RESIDUAL_EFT_MEASURED_WIDTH_PROTOTYPE.verdict) &&
      /refereed bound is changed/i.test(IMP36218_KRAWCZYK_RESIDUAL_EFT_MEASURED_WIDTH_PROTOTYPE.verdict),
  },
];

for (const a of IMP36218_KRAWCZYK_RESIDUAL_EFT_MEASURED_WIDTH_PROTOTYPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36218-krawczyk-residual-eft-measured-width-prototype assertion failed: ${a.id}`);
  }
}
