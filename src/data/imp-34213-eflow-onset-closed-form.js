/**
 * @module imp-34213-eflow-onset-closed-form
 *
 * imp-34213 (numerical, opus-4-8): imp-34134 located the E_flow = alpha * E_trunc
 * onset landmarks (alpha = 1 at N ~ 1.598e6, alpha = 0.01 at N ~ 4.623e8, alpha =
 * 0.001 at N ~ 6.933e9) by DOWNSLOPE BISECTION in N only. This module supplies the
 * missing piece the ticket asks for: a CLOSED-FORM (Banach fixed-point) expression
 * for the onset N, mirroring the imp-33723 closed-form E_coll = E_trunc crossover,
 * and assesses whether it reproduces the bisected onset values.
 *
 * THE CLOSED-FORM DERIVATION (the deliverable the ticket asks for)
 * ---------------------------------------------------------------
 * The imp-34134 onset is E_flow(N) = alpha * E_trunc with the IDENTICAL imp-3444 flow
 * sub-term and the N-independent floor E_trunc = 3.06e-5 (imp-2631):
 *
 *     E_flow(N) = ((log(T0/2pi)+1)/2pi) . (log T0 / T0) . GRONWALL,  T0 = height(N).
 *
 * STRUCTURAL POINT (differs from imp-33723). imp-33723 solved E_coll = C_C sqrt(L/N)
 * = E_trunc, where E_coll carries N EXPLICITLY, so its fixed point is in N. Here
 * E_flow depends on N ONLY through the height T0, so the natural closed form solves
 * for the ONSET HEIGHT T0* first and then recovers N* from the EXACT analytic forward
 * count. Isolate the single leading T0 in the denominator of E_flow = alpha E_trunc:
 *
 *     T0 = ((log(T0/2pi)+1) . log T0 . GRONWALL) / (2pi . alpha . E_trunc).   (CLOSED FORM)
 *
 * This is a FIXED-POINT form T0 = h(T0) with pinned amplitude A(alpha) =
 * GRONWALL / (2pi . alpha . E_trunc) = A0/alpha, A0 ~ 5.2025e3. Because the right side
 * grows only like (log T0)^2, the map is a strong contraction:
 *
 *     h_prime(T0) = A/T0 . [ log T0 + log(T0/2pi) + 1 ],
 *
 * measured |h_prime(T0*)| ~ 0.15 (alpha=1) down to ~0.095 (alpha=0.001), all << 1, so
 * each onset height is a UNIQUE fixed point and Banach iteration from any seed
 * converges geometrically (~7 iterations to floating point). The onset N is then the
 * EXACT Riemann-von Mangoldt forward count N* = zeroCountAtHeight(T0*) =
 * (T0star/2pi)(log(T0star/2pi) - 1), the analytic inverse of effectiveHeightForN -- so no
 * second fixed point (or bisection) is needed to recover N.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) CLOSED FORM REPRODUCES THE BISECTION LANDMARKS. For all three targets the
 *        fixed point T0 = A(alpha)(log(T0/2pi)+1) log T0 followed by N* =
 *        zeroCountAtHeight(T0*) reproduces the imp-34134 downslope-bisection onsets to
 *        ~1e-15 relative: alpha=1 -> N ~ 1.597752e6, alpha=0.01 -> N ~ 4.622963e8,
 *        alpha=0.001 -> N ~ 6.933193e9. The E_flow onset is now available in closed
 *        form, not only as a bracketed root.
 *   (D2) STRONG-CONTRACTION / SINGLE-SHOT ADEQUACY. The height map is a strong
 *        contraction at every onset (|h_prime| ~ 0.095..0.15 < 1), so the root is
 *        unique and geometric; a single-shot leading estimate -- freeze the two slow
 *        log factors once at the self-consistent seed A(log A)^2 -- already lands the
 *        onset N within ~6% (alpha=0.001) to ~14% (alpha=1) of the converged value.
 *
 * The punchline: the imp-34134 E_flow = alpha E_trunc onset, previously located only by
 * bisection in N, is PINNED IN CLOSED FORM as the strongly-contracting height fixed
 * point T0star = A(alpha)(log(T0star/2pi)+1) log T0star with N* = zeroCountAtHeight(T0star), and it
 * reproduces all three bisected landmarks to ~1e-15.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic. E_flow is the benign mesoscopic-Gronwall term (imp-2845); its onset here
 * does NOT touch the divergent C_Lip collision-Gronwall. The C_mb GUE-conditional per
 * imp-486 is UNTOUCHED (E_coll untouched); imp-3066 K_a >= 0 untouched; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34134-eflow-etrunc-ratio-decay-onset (bisected onsets; identical sub-terms)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (sibling closed-form crossover, fixed point in N)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_flow flow sub-term, E_coll=E_trunc crossover)
 * @see lambda-rh-height-mapping (effectiveHeightForN inverse; zeroCountAtHeight forward count)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-34134)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3444/imp-34134 exactly (~1.000237)

// EXACT imp-3444/imp-34134 flow sub-term (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Reference: downslope bisection in N (imp-34134 method) for E_flow(N)/E_trunc = alpha.
function onsetBisection(alpha) {
  let a = Math.log(1e5); // ratio > alpha here
  let b = Math.log(1e40); // ratio < alpha here
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (eFlow(Math.exp(m)) / E_TRUNC_PT > alpha) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (CLOSED FORM) onset height as the fixed point T0 = A(alpha) (log(T0/2pi)+1) log T0.
const A0 = GRONWALL / (TWO_PI * E_TRUNC_PT); // base amplitude ~5.2025e3; A(alpha) = A0/alpha
function amplitude(alpha) {
  return A0 / alpha;
}
function onsetHeightFixedPoint(alpha, seed, iters) {
  const A = amplitude(alpha);
  let T0 = seed;
  for (let i = 0; i < iters; i++) T0 = A * (Math.log(T0 / TWO_PI) + 1) * Math.log(T0);
  return T0;
}
// Onset N recovered by the EXACT analytic forward count (inverse of effectiveHeightForN).
function onsetNClosedForm(alpha) {
  const T0 = onsetHeightFixedPoint(alpha, 1e7, 200);
  return { T0, N: zeroCountAtHeight(T0) };
}
// Single-shot leading estimate: freeze the two slow log factors once at the
// self-consistent seed A(log A)^2 (leading order of T0 ~ A (log T0)^2), no iteration.
function onsetNOneShot(alpha) {
  const A = amplitude(alpha);
  const seed = A * Math.log(A) ** 2;
  const T0 = A * (Math.log(seed / TWO_PI) + 1) * Math.log(seed);
  return { T0, N: zeroCountAtHeight(T0) };
}
// Contraction factor of the height fixed-point map at the root (central difference).
function contractionAtRoot(alpha) {
  const A = amplitude(alpha);
  const h = (x) => A * (Math.log(x / TWO_PI) + 1) * Math.log(x);
  const T0 = onsetHeightFixedPoint(alpha, 1e7, 200);
  const step = T0 * 1e-6;
  return Math.abs((h(T0 + step) - h(T0 - step)) / (2 * step));
}
// Iterations for floating-point convergence from a fixed seed (strong contraction => few).
function iterationsToConverge(alpha, seed) {
  const A = amplitude(alpha);
  let T0 = seed;
  let prev = 0;
  for (let i = 0; i < 200; i++) {
    T0 = A * (Math.log(T0 / TWO_PI) + 1) * Math.log(T0);
    if (Math.abs(T0 - prev) < 1e-6 * T0) return i;
    prev = T0;
  }
  return 200;
}

// ── Onset ladder: alpha in {1, 0.01, 0.001}; closed form vs imp-34134 bisection ──
const TARGETS = [
  { alpha: 1, label: 'E_flow = E_trunc' },
  { alpha: 0.01, label: 'E_flow = 1% E_trunc' },
  { alpha: 0.001, label: 'E_flow = 0.1% E_trunc' },
];

const ONSET_LADDER = TARGETS.map(({ alpha, label }) => {
  const bisN = onsetBisection(alpha);
  const cf = onsetNClosedForm(alpha);
  const one = onsetNOneShot(alpha);
  const relCF = Math.abs(cf.N - bisN) / bisN;
  const relOne = Math.abs(one.N - cf.N) / cf.N;
  return {
    alpha,
    label,
    A: +amplitude(alpha).toExponential(6),
    onset_height_T0: +cf.T0.toExponential(6),
    N_closed_form: +cf.N.toExponential(6),
    N_bisection_imp34134: +bisN.toExponential(6),
    log10N: +Math.log10(cf.N).toFixed(4),
    closed_form_vs_bisection_rel: +relCF.toExponential(3),
    contraction_at_root: +contractionAtRoot(alpha).toExponential(4),
    one_shot_leading_N: +one.N.toExponential(6),
    one_shot_vs_converged_rel: +relOne.toExponential(3),
  };
});

const ITERS_TO_CONVERGE = iterationsToConverge(0.01, 1e7); // ~7 (strong contraction)
const MAX_CF_VS_BIS = Math.max(...ONSET_LADDER.map((r) => r.closed_form_vs_bisection_rel));
const MAX_CONTRACTION = Math.max(...ONSET_LADDER.map((r) => r.contraction_at_root));
const MAX_ONE_SHOT_REL = Math.max(...ONSET_LADDER.map((r) => r.one_shot_vs_converged_rel));

export const IMP34213_EFLOW_ONSET_CLOSED_FORM = {
  id: 'imp-34213',
  proofSection: 'S-frontier',
  question:
    'Derive a CLOSED-FORM (Banach fixed-point) expression for the imp-34134 E_flow = alpha * E_trunc ' +
    'onset N (imp-34134 located it only by bisection), mirroring the imp-33723 closed-form E_coll = ' +
    'E_trunc crossover, and assess whether it reproduces the bisected onset values (alpha = 1, 0.01, ' +
    '0.001). Derivation/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  closedForm:
    'T0* = A(alpha) . (log(T0*/2pi)+1) . log T0*  (height fixed point, A(alpha) = GRONWALL/(2pi.alpha.E_trunc) = A0/alpha), ' +
    'then N* = zeroCountAtHeight(T0*) = (T0*/2pi)(log(T0*/2pi)-1)  (exact analytic forward count).',
  contractionArgument:
    'h(T0) = A (log(T0/2pi)+1) log T0, h_prime = A/T0 [log T0 + log(T0/2pi) + 1]; measured ' +
    '|h_prime(T0*)| ~ 0.095..0.15 << 1 => unique fixed point, Banach iteration converges geometrically (~7 iters).',
  structuralNote:
    'Unlike imp-33723 (E_coll carries N explicitly => fixed point in N), E_flow depends on N only ' +
    'through the height T0, so the closed form is a fixed point in T0 with N recovered by the EXACT ' +
    'Riemann-von Mangoldt forward count (inverse of effectiveHeightForN) -- no second fixed point.',
  baseAmplitude_A0: +A0.toExponential(6), // GRONWALL/(2pi E_trunc) ~ 5.2025e3
  itersToConverge: ITERS_TO_CONVERGE, // ~7
  onsetLadder: ONSET_LADDER,
  aggregate: {
    max_closed_form_vs_bisection_rel: +MAX_CF_VS_BIS.toExponential(3), // ~1e-15
    max_contraction_at_root: +MAX_CONTRACTION.toExponential(4), // ~0.150
    max_one_shot_vs_converged_rel: +MAX_ONE_SHOT_REL.toExponential(3), // ~0.14
  },
  finding: {
    D1_closed_form_reproduces_bisection:
      'The height fixed point T0* = A(alpha)(log(T0*/2pi)+1) log T0* with N* = zeroCountAtHeight(T0*) ' +
      'reproduces all three imp-34134 downslope-bisection onsets (alpha = 1 -> 1.597752e6, alpha = 0.01 ' +
      '-> 4.622963e8, alpha = 0.001 -> 6.933193e9) to ~1e-15 relative. The E_flow = alpha E_trunc onset ' +
      'is now pinned in closed form, not only as a bracketed root.',
    D2_strong_contraction_and_one_shot:
      'The height map is a strong contraction at every onset (|h_prime(T0*)| ~ 0.095..0.15 < 1), so each ' +
      'fixed point is unique and Banach iteration converges in ~7 steps. A single-shot leading estimate ' +
      '(freeze the slow log factors once at the self-consistent seed A(log A)^2) already lands the onset ' +
      'N within ~6% (alpha=0.001) to ~14% (alpha=1) of the converged value.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-34134 E_flow = alpha * E_trunc onset, ' +
    'previously located only by downslope bisection in N, is pinned in CLOSED FORM as the height fixed ' +
    'point T0* = A(alpha) (log(T0*/2pi)+1) log T0*, A(alpha) = GRONWALL/(2pi alpha E_trunc), with the ' +
    'onset N recovered by the EXACT Riemann-von Mangoldt forward count N* = zeroCountAtHeight(T0*). The ' +
    'map is a strong contraction (|h_prime(T0*)| ~ 0.095..0.15 << 1), so each root is unique and Banach ' +
    'iteration converges in ~7 steps; the closed form reproduces the imp-34134 bisected onsets (alpha = ' +
    '1 at N ~ 1.598e6, 0.01 at N ~ 4.623e8, 0.001 at N ~ 6.933e9) to ~1e-15 relative, and a single-shot ' +
    'leading estimate lands within ~6-14%. Structurally this DIFFERS from the imp-33723 sibling: E_coll ' +
    'carries N explicitly (fixed point in N) whereas E_flow enters only through the height (fixed point ' +
    'in T0, N by exact forward count). Component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; E_flow is the benign mesoscopic-Gronwall term (imp-2845), NOT the ' +
    'divergent C_Lip collision-Gronwall. The C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll ' +
    'untouched); imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34134 (E_flow = alpha E_trunc onsets, bisected; identical sub-terms); imp-33723 (sibling ' +
    'closed-form E_coll=E_trunc crossover, fixed point in N); imp-3444 (E_flow flow sub-term); imp-2631 ' +
    '(E_trunc fixed-strip floor); imp-2845 (benign vs divergent Gronwall); lambda-rh-height-mapping ' +
    '(effectiveHeightForN inverse, zeroCountAtHeight forward count).',
};

export const IMP34213_EFLOW_ONSET_CLOSED_FORM_ASSERTIONS = [
  {
    // (D1): the closed-form fixed point reproduces every imp-34134 bisection onset.
    id: 'imp34213-closed-form-matches-bisection',
    description: 'closed-form onset N matches imp-34134 downslope bisection to < 1e-9 relative for all three alpha',
    holds: () => MAX_CF_VS_BIS < 1e-9,
  },
  {
    // (D1): the three onset N reproduce the imp-34134 published landmark values.
    id: 'imp34213-reproduces-imp34134-landmarks',
    description: 'onset N reproduces imp-34134 landmarks: alpha=1 ~1.598e6, alpha=0.01 ~4.623e8, alpha=0.001 ~6.933e9',
    holds: () =>
      Math.abs(ONSET_LADDER[0].N_closed_form / 1.597752e6 - 1) < 1e-4 &&
      Math.abs(ONSET_LADDER[1].N_closed_form / 4.622963e8 - 1) < 1e-4 &&
      Math.abs(ONSET_LADDER[2].N_closed_form / 6.933193e9 - 1) < 1e-4,
  },
  {
    // The height fixed-point map is a strong contraction at every onset (unique, geometric).
    id: 'imp34213-fixed-point-is-a-contraction',
    description: 'contraction factor |h_prime(T0*)| < 0.2 at every onset (unique fixed point, geometric convergence)',
    holds: () => MAX_CONTRACTION > 0 && MAX_CONTRACTION < 0.2,
  },
  {
    // Strong contraction => few iterations to floating-point convergence.
    id: 'imp34213-converges-in-few-iterations',
    description: 'Banach iteration converges to floating point in <= 12 iterations (strong contraction)',
    holds: () => ITERS_TO_CONVERGE > 0 && ITERS_TO_CONVERGE <= 12,
  },
  {
    // (D2): the single-shot leading estimate lands within ~15% of the converged onset.
    id: 'imp34213-one-shot-leading-within-15pct',
    description: 'single-shot leading onset N within ~15% of the converged fixed point for every alpha',
    holds: () => MAX_ONE_SHOT_REL > 0 && MAX_ONE_SHOT_REL < 0.15,
  },
  {
    // Larger alpha (smaller onset height) => larger contraction factor: monotone ordering sanity.
    id: 'imp34213-contraction-orders-with-alpha',
    description: 'contraction factor decreases as alpha decreases (onset height grows), a monotone-ordering sanity check',
    holds: () =>
      ONSET_LADDER[0].contraction_at_root > ONSET_LADDER[1].contraction_at_root &&
      ONSET_LADDER[1].contraction_at_root > ONSET_LADDER[2].contraction_at_root,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, C_mb GUE-conditional untouched, no refereed bound is changed.
    id: 'imp34213-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, C_mb GUE-conditional per imp-486 UNTOUCHED named, no refereed bound is changed',
    holds: () =>
      IMP34213_EFLOW_ONSET_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP34213_EFLOW_ONSET_CLOSED_FORM.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34213_EFLOW_ONSET_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP34213_EFLOW_ONSET_CLOSED_FORM.verdict),
  },
];

for (const a of IMP34213_EFLOW_ONSET_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34213-eflow-onset-closed-form assertion failed: ${a.id}`);
  }
}
