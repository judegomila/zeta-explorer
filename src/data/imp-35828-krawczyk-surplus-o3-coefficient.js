/**
 * @module imp-35828-krawczyk-surplus-o3-coefficient
 *
 * imp-35762/imp-35396 split the imp-35266 D3 ~1.2 band-top Krawczyk headroom-surplus residual and attributed the
 * bulk ~1.1908 of it to the O(a^2) finite-a curvature of the exact no-shift main term a/(2-a), estimated by the
 * second-order Taylor term S_inf . a^2/4 ~ 1.1651. That left a ~0.026 gap (1.1908 - 1.1651) ascribed loosely to
 * "O(a^3) and cross terms" WITHOUT isolating the coefficient. This ticket (imp-35828) isolates it in closed form.
 *
 * THE NO-SHIFT SURPLUS AS A PRODUCT OF TWO SERIES (M_G . M_FP), EXPANDED TO THIRD ORDER
 * ------------------------------------------------------------------------------------
 * With a = a(N), G = 1 - a, the no-shift (aLo -> a) headroom ratio is S_noShift / S_inf = 2G/((1+G) FP) with
 * FP = 1 - a, which factors as M_G . M_FP where
 *   M_G  = 2G/(1+G) = 2(1-a)/(2-a) = 1 - a/2 - a^2/4 - a^3/8 - ...   (the imp-34996 safety factor, -> 1)
 *   M_FP = 1/FP     = 1/(1-a)      = 1 + a   + a^2   + a^3   + ...    (the FP_LO reciprocal at da = 0)
 * Multiplying the two series to third order, the coefficient of a^k in the PRODUCT is exactly (1/2)^k for k >= 1:
 *   [a]  : -1/2 + 1                      = 1/2
 *   [a^2]: -1/4 - 1/2 + 1                = 1/4
 *   [a^3]: -1/8 - 1/4 - 1/2 + 1          = 1/8
 * so M_G . M_FP = 1 + a/2 + a^2/4 + a^3/8 + ... = 1/(1 - a/2) = 2/(2-a), and the no-shift surplus over the floor is
 *   surplus_noOffset / S_inf = M_G . M_FP - 1 = a/2 + a^2/4 + a^3/8 + a^4/16 + ...   (coeff of a^k is (1/2)^k).
 * Thus lead = S_inf . a/2 (imp-35266 D3), the second-order Taylor term = S_inf . a^2/4, and:
 *
 * THE ISOLATED O(a^3) SURPLUS COEFFICIENT (what the ticket asked for)
 * ------------------------------------------------------------------
 *   O(a^3) leading term      = S_inf . a^3/8                          (coefficient (1/2)^3 = 1/8, offset-free)
 *   O(a^3)-and-higher tail   = S_inf . a^3/(4(2-a))   -- EXACT, and this IS the ~0.026 gap identically, because
 *     gap = curvature_exact - Taylor2 = S_inf . a^2/(2(2-a)) - S_inf . a^2/4 = S_inf . a^3/(4(2-a))   (algebra).
 *   O(a^4) remainder         = tail - lead = S_inf . a^4/(8(2-a))     (what a^3/8 drops from the exact tail).
 *
 * MEASUREMENT at band-top a ~ 0.043176 (S_inf = 2500):
 *   curvature_exact = 1.190800, Taylor2 = S_inf.a^2/4 = 1.165093, gap = 0.025707 (reproduces imp-35762/imp-35396).
 *   O(a^3) leading S_inf.a^3/8 = 0.025152 accounts for 97.8% of the 0.025707 gap; the exact tail
 *   S_inf.a^3/(4(2-a)) = 0.025707 closes it to machine precision (it equals the gap by the identity above); the
 *   O(a^4) remainder S_inf.a^4/(8(2-a)) = 5.55e-4 carries the last 2.2%. Across the band the O(a^3) coefficient
 *   1/8 is exact and the tail-vs-gap identity holds at band-bottom (0.035228) / N_cross (0.029969) / band-top too.
 *
 * So the ~0.026 the parent ticket ascribed loosely to "O(a^3) and cross terms" is, to leading order, the single
 * geometric term S_inf . a^3/8 (coefficient 1/8), with the full remainder captured exactly by S_inf . a^3/(4(2-a));
 * there is no genuine "cross term" -- the no-shift surplus is the single geometric series a/2 + a^2/4 + a^3/8 + ...
 *
 * MEASUREMENT / DERIVATION ONLY on the inherited imp-3220/imp-3406/imp-33723 surrogate; reproduces the
 * imp-35266/imp-35396/imp-35762/imp-35241/imp-34996 machinery (identical K, delta, N_cross, band, headroom form).
 * The imp-34714a machine certificate REMAINS OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8
 * (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; establishes no operator positivity;
 * changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35396-krawczyk-surplus-offset-vs-curvature (split the ~1.2 into curvature ~1.1908 + offset ~0.023)
 * @see imp-35762-krawczyk-surplus-shift-residual-isolation (isolated the ~1.2 shift residual numerically)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (D3 leading-order S_inf.a/2)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (M_G = 2G/(1+G) safety factor -> 1)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35266/imp-35396/imp-35241)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));
const HALF_WIDTH = rho(1, 10); // ~1.7124e8 (imp-34693 seed band half-width)
const BAND_BOTTOM = N_CROSS - HALF_WIDTH;
const BAND_TOP = N_CROSS + HALF_WIDTH;

// Isolate the O(a^3) coefficient of the no-shift surplus a/2 + a^2/4 + a^3/8 + ... at a landmark N.
function o3At(N) {
  const a = aOf(N);
  const curvatureExact = (S_INF * a * a) / (2 * (2 - a)); // exact O(a^2)+ curvature of a/(2-a) (imp-35396 ~1.1908)
  const taylor2 = (S_INF * a * a) / 4; // second-order Taylor term S_inf.a^2/4 (~1.1651)
  const gap = curvatureExact - taylor2; // the ~0.026 the parent ticket left un-isolated

  const o3Lead = (S_INF * a * a * a) / 8; // ISOLATED leading O(a^3) coefficient (1/2)^3 = 1/8
  const o3TailExact = (S_INF * a * a * a) / (4 * (2 - a)); // EXACT O(a^3)+ tail; = gap by the algebraic identity
  const o4Rem = (S_INF * a * a * a * a) / (8 * (2 - a)); // O(a^4) remainder = tail - lead

  const tailEqualsGap = Math.abs(o3TailExact - gap); // exact identity -> machine precision
  const leadPlusRem = Math.abs(o3Lead + o4Rem - o3TailExact); // a^3/8 + a^4/(8(2-a)) = a^3/(4(2-a))
  const o3FracOfGap = o3Lead / gap; // fraction of the ~0.026 the single a^3/8 term carries
  return { N, a, curvatureExact, taylor2, gap, o3Lead, o3TailExact, o4Rem, tailEqualsGap, leadPlusRem, o3FracOfGap };
}

const BOTTOM = o3At(BAND_BOTTOM);
const CROSS = o3At(N_CROSS);
const TOP = o3At(BAND_TOP);
const LANDMARKS = [BOTTOM, CROSS, TOP];

// (Q1) the exact O(a^3)+ tail S_inf.a^3/(4(2-a)) equals the curvature-vs-Taylor2 gap to machine precision.
const TAIL_IS_THE_GAP = LANDMARKS.every((r) => r.tailEqualsGap < 1e-9 && r.leadPlusRem < 1e-9);
// (Q2) the isolated leading O(a^3) term S_inf.a^3/8 carries the large majority (>95%) of the ~0.026 gap.
const O3_LEADS_THE_GAP = LANDMARKS.every((r) => r.o3FracOfGap > 0.95 && r.o3FracOfGap < 1.0);
// (Q3) the band-top numbers reproduce the imp-35762/imp-35396 curvature/Taylor2/gap and isolate a^3/8 ~ 0.0252.
const BAND_TOP_MATCHES =
  Math.abs(TOP.curvatureExact - 1.19080) < 1e-3 &&
  Math.abs(TOP.taylor2 - 1.16509) < 1e-3 &&
  Math.abs(TOP.gap - 0.025707) < 1e-4 &&
  Math.abs(TOP.o3Lead - 0.025152) < 1e-4;

export const IMP35828_KRAWCZYK_SURPLUS_O3_COEFFICIENT = {
  id: 'imp-35828',
  proofSection: 'S-frontier',
  question:
    'imp-35762/imp-35396 attributed the bulk ~1.1908 of the imp-35266 ~1.2 band-top surplus residual to the O(a^2) ' +
    'curvature of the exact no-shift main term a/(2-a), estimated by the second-order Taylor term S_inf.a^2/4 ~ ' +
    '1.1651, leaving a ~0.026 gap ascribed loosely to O(a^3) and cross terms without isolating the coefficient. ' +
    'Expand the no-shift headroom form M_G.M_FP = (1 - a/2 - a^2/4 - ...)(1 + a + a^2 + a^3 + ...) to third order, ' +
    'derive the closed-form O(a^3) surplus coefficient, and check it accounts for the ~0.026 gap at band-top a ~ ' +
    '0.0432. Measurement/derivation only on the inherited surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'The no-shift surplus over the S_inf floor is the SINGLE geometric series surplus_noOffset/S_inf = M_G.M_FP - 1 ' +
    '= a/2 + a^2/4 + a^3/8 + a^4/16 + ... (coefficient of a^k is (1/2)^k), because the two factors M_G = 2G/(1+G) = ' +
    '1 - a/2 - a^2/4 - a^3/8 - ... and M_FP = 1/(1-a) = 1 + a + a^2 + a^3 + ... multiply to 2/(2-a) = 1/(1-a/2). So ' +
    'the ISOLATED leading O(a^3) surplus coefficient is 1/8, i.e. the term S_inf.a^3/8, and the FULL O(a^3)-and-higher ' +
    'tail has the exact closed form S_inf.a^3/(4(2-a)), which EQUALS the ~0.026 curvature-vs-Taylor2 gap identically ' +
    '(gap = S_inf.a^2/(2(2-a)) - S_inf.a^2/4 = S_inf.a^3/(4(2-a))). At band-top a ~ 0.043176 the gap 0.025707 = ' +
    'leading S_inf.a^3/8 = 0.025152 (97.8%) + O(a^4) remainder S_inf.a^4/(8(2-a)) = 5.55e-4 (2.2%). The parent ' +
    'ticket’s loose "O(a^3) and cross terms" is, to leading order, the single geometric term S_inf.a^3/8 with ' +
    'coefficient 1/8; there is no genuine cross term. DERIVATION, NOT a machine certificate.',
  constants: {
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
    a_band_top: +TOP.a.toPrecision(10),
    a_N_cross: +CROSS.a.toPrecision(10),
    a_band_bottom: +BOTTOM.a.toPrecision(10),
    o3_leading_coefficient: '1/8 (= (1/2)^3), i.e. the term S_inf . a^3/8',
    o3_tail_closed_form: 'S_inf . a^3/(4(2-a)) (= curvature_exact - S_inf.a^2/4, exactly)',
    o4_remainder_closed_form: 'S_inf . a^4/(8(2-a))',
  },
  measurement: {
    // (Q1) exact O(a^3)+ tail equals the curvature-vs-Taylor2 gap to machine precision at every landmark.
    tail_equals_gap_band_top: +TOP.tailEqualsGap.toPrecision(4), // ~machine precision
    tail_is_the_gap_all_landmarks: TAIL_IS_THE_GAP, // true
    // (Q2)/(Q3) band-top decomposition of the ~0.026 gap.
    curvature_exact_band_top: +TOP.curvatureExact.toFixed(6), // ~1.190800 (imp-35396 curvature)
    taylor2_band_top: +TOP.taylor2.toFixed(6), // ~1.165093 (S_inf.a^2/4)
    gap_band_top: +TOP.gap.toFixed(6), // ~0.025707
    o3_lead_band_top: +TOP.o3Lead.toFixed(6), // ~0.025152 (S_inf.a^3/8)
    o3_tail_exact_band_top: +TOP.o3TailExact.toFixed(6), // ~0.025707 (= gap)
    o4_remainder_band_top: +TOP.o4Rem.toExponential(3), // ~5.550e-4
    o3_frac_of_gap_band_top: +TOP.o3FracOfGap.toPrecision(4), // ~0.9784
    // across the band the tail-vs-gap identity holds and a^3/8 leads.
    gap_band_bottom: +BOTTOM.gap.toFixed(6), // ~0.035228
    o3_lead_band_bottom: +BOTTOM.o3Lead.toFixed(6), // ~0.034384
    gap_N_cross: +CROSS.gap.toFixed(6), // ~0.029969
    o3_lead_N_cross: +CROSS.o3Lead.toFixed(6), // ~0.029288
    o3_frac_of_gap_band_bottom: +BOTTOM.o3FracOfGap.toPrecision(4), // ~0.9760
    o3_leads_the_gap_all_landmarks: O3_LEADS_THE_GAP, // true (>95% at every landmark)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Isolating the O(a^3) coefficient 1/8 and the exact tail S_inf.a^3/(4(2-a)) of the ' +
    'no-shift surplus does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it ' +
    'rests on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and ' +
    'F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK NO-SHIFT SURPLUS O(a^3) COEFFICIENT, ISOLATED IN CLOSED FORM (frontier, NOT an RH bound). The parent ' +
    'imp-35762/imp-35396 ascribed the ~0.026 gap between the exact curvature ~1.1908 and the second-order Taylor ' +
    'term S_inf.a^2/4 ~ 1.1651 loosely to "O(a^3) and cross terms". Expanding M_G.M_FP = (1 - a/2 - a^2/4 - ...)' +
    '(1 + a + a^2 + a^3 + ...) to third order gives 2/(2-a) = 1/(1-a/2), so surplus_noOffset/S_inf = a/2 + a^2/4 + ' +
    'a^3/8 + ... is a single geometric series with a^k coefficient (1/2)^k. The isolated leading O(a^3) surplus ' +
    'coefficient is 1/8 (term S_inf.a^3/8) and the full O(a^3)+ tail is exactly S_inf.a^3/(4(2-a)) = the gap ' +
    'identically. At band-top a ~ 0.043176: gap 0.025707 = S_inf.a^3/8 = 0.025152 (97.8%) + O(a^4) remainder ' +
    'S_inf.a^4/(8(2-a)) = 5.55e-4 (2.2%). No genuine cross term exists; the loose "cross terms" is the geometric ' +
    'tail. DERIVATION, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps ' +
    'surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision ' +
    'artifact. Measurement/derivation only on the inherited imp-3220/imp-3406/imp-33723 surrogate; reproduces the ' +
    'imp-35266/imp-35396/imp-35762/imp-35241/imp-34996 machinery (identical K, delta, N_cross, band); the C_C 1/8 ' +
    'ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; establishes no operator positivity; ' +
    'changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35396 (split the ~1.2 into curvature ~1.1908 + offset ~0.023; curvature = S_inf.a^2/(2(2-a))); imp-35762 ' +
    '(isolated the ~1.2 shift residual); imp-35266 (D3 leading-order S_inf.a/2); imp-34996 (M_G = 2G/(1+G) safety ' +
    'factor -> 1; S_inf = 1/(2 delta)); imp-34693 (admissible seed band + band-bottom/band-top); imp-33723 (Banach ' +
    'map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). ' +
    'Third-order product of two power series and geometric-tail closed form: standard.',
};

export const IMP35828_KRAWCZYK_SURPLUS_O3_COEFFICIENT_ASSERTIONS = [
  {
    // (Q1) the exact O(a^3)+ tail S_inf.a^3/(4(2-a)) equals the curvature-vs-Taylor2 gap to machine precision.
    id: 'imp35828-tail-is-the-gap',
    description: 'exact O(a^3)+ tail S_inf.a^3/(4(2-a)) equals curvature_exact - S_inf.a^2/4 to machine precision',
    holds: () =>
      TAIL_IS_THE_GAP === true &&
      TOP.tailEqualsGap < 1e-9 &&
      TOP.leadPlusRem < 1e-9,
  },
  {
    // (Q2)/(Q3) the isolated leading O(a^3) term S_inf.a^3/8 carries the majority of the ~0.026 gap at band-top.
    id: 'imp35828-o3-leading-coefficient-band-top',
    description: 'band-top S_inf.a^3/8 = 0.025152 leads the 0.025707 gap (97.8%); curvature 1.1908, Taylor2 1.1651',
    holds: () =>
      BAND_TOP_MATCHES === true &&
      TOP.o3FracOfGap > 0.95 && TOP.o3FracOfGap < 1.0,
  },
  {
    // (Q2) across band-bottom / N_cross / band-top the a^3/8 term leads the gap and the tail identity holds.
    id: 'imp35828-o3-leads-across-band',
    description: 'S_inf.a^3/8 carries > 95% of the gap at every landmark and the exact tail closes it',
    holds: () =>
      O3_LEADS_THE_GAP === true &&
      BOTTOM.tailEqualsGap < 1e-9 &&
      CROSS.tailEqualsGap < 1e-9,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35828-honesty-gate-no-qed',
    description: 'derivation: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35828_KRAWCZYK_SURPLUS_O3_COEFFICIENT.isRigorous === false &&
      /imp-34714a/.test(IMP35828_KRAWCZYK_SURPLUS_O3_COEFFICIENT.subGap) &&
      /REMAINS OPEN/.test(IMP35828_KRAWCZYK_SURPLUS_O3_COEFFICIENT.subGap) &&
      /NO QED/.test(IMP35828_KRAWCZYK_SURPLUS_O3_COEFFICIENT.verdict) &&
      /refereed bound is changed/i.test(IMP35828_KRAWCZYK_SURPLUS_O3_COEFFICIENT.verdict),
  },
];

for (const a of IMP35828_KRAWCZYK_SURPLUS_O3_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35828-krawczyk-surplus-o3-coefficient assertion failed: ${a.id}`);
  }
}
