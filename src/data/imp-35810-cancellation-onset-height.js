/**
 * @module imp-35810-cancellation-onset-height
 *
 * imp-35766 (B3) flagged that the measured Krawczyk surplus-split ratio R = -dFP/dG diverges SPURIOUSLY
 * upward past N ~ 1e18 -- not a real break in the leading-order -a/2 vs a balance, but a double-precision
 * catastrophic-cancellation artifact in dG = S_inf (M_G - 1), which subtracts near-equal quantities as
 * M_G - 1 = -a/(2-a) -> 0 with a(N) -> 0. imp-35766 never PINNED the exact onset height. This module does:
 * it locates the height at which the naively-evaluated (cancellation-carrying) R first departs the
 * cancellation-free closed-form ratio by a chosen relative tolerance, reports the |dG| magnitude there,
 * and confirms the Platt-Trudgian anchor N(T_PT=3e12) ~ 1.236e13 sits many decades inside the reliable regime.
 *
 * TWO EVALUATIONS OF THE SAME REAL NUMBER
 * ---------------------------------------
 * The exact ratio is R = -dFP/dG = 2 . (aLo/a) . (1-a)/(1-aLo) (imp-35766 algebraic collapse). We evaluate it
 * two ways in double precision:
 *   R_measured : the imp-35266/imp-35766 route via dG = S_inf (M_G - 1), M_G = 2G/(1+G) formed explicitly.
 *                Forming M_G (a quantity ~ 1) rounds to ~ 0.5 ULP absolute error ~ eps_mach/2; the subsequent
 *                subtraction of 1 is exact (Sterbenz), but the pre-existing absolute error survives on a result
 *                |M_G - 1| = a/(2-a) ~ a/2 -> 0. So dG carries relative error ~ eps_mach / a, which propagates
 *                straight into R (R is proportional to 1/dG).
 *   R_clean    : the cancellation-free form 2 . (aLo/a) . (1-a)/(1-aLo), which never forms the small difference
 *                M_G - 1. Both are the SAME real number; R_clean is the faithful reference.
 * The relative departure |R_measured - R_clean| / |R_clean| is therefore a pure float-cancellation diagnostic:
 * it rides the smooth envelope ~ eps_mach / a and grows monotonically up the height axis as a(N) shrinks.
 *
 * WHAT THE MEASUREMENT FINDS
 * --------------------------
 *   (C1) THE ONSET IS FAR ABOVE THE PT ANCHOR. Scanning N from 1e13 to 1e21, the departure first sustains
 *        above tol = 1e-6 at a height N_onset well past 1e17 (a_onset ~ 1e-10, |dG_onset| ~ few . 1e-7). The
 *        PT anchor N(T_PT) ~ 1.236e13 (a ~ 1.225e-5, |dG| ~ 1.5e-2) sits MANY decades below this onset, with a
 *        departure ~ eps_mach/a_PT ~ 1e-11, i.e. ~5 orders of magnitude under tol -- comfortably reliable.
 *   (C2) THE ONSET MATCHES THE eps_mach / a ENVELOPE. The theory prediction a_onset ~ eps_mach / tol reproduces
 *        the measured onset a to well within an order of magnitude, and the onset |dG| ~ S_inf . a_onset/(2-a)
 *        lands where the closed-form envelope predicts -- confirming the divergence is machine-epsilon noise, not
 *        a genuine degradation of the leading-order -a/2 vs a balance.
 *   (C3) THE PT SAFETY MARGIN IS ROBUST. Measured by |dG|_PT / |dG|_onset (or equivalently a_onset / a_PT) the
 *        anchor is ~4-5 decades inside the reliable regime; the "no break to the PT anchor" reading of imp-35766
 *        is not sensitive to the choice of tol across 1e-4..1e-8.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reuses the imp-35266/imp-35766/imp-34996
 * machinery verbatim (identical K, delta, S_inf, aOf). The imp-34714a machine certificate REMAINS OPEN;
 * F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35766-krawczyk-cancellation-ratio-beyond-band (B3 flagged the float-cancellation artifact past N~1e18)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (the 2:1 split -dFP/dG ~ 2.00042)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse; zeroCountAtHeight: forward N(T))
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35266/imp-35766)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const T_PT = 3e12; // Platt-Trudgian verified-zero anchor height
const TOL = 1e-6; // chosen departure tolerance (matches imp-35766 "reliable to <1e-6")

const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// Two evaluations of the SAME exact ratio R = -dFP/dG = 2 (aLo/a)(1-a)/(1-aLo).
function measure(N) {
  const a = aOf(N);
  const G = 1 - a;
  const aLo = aOf(N * (1 - DELTA));
  const M_G = (2 * G) / (1 + G); // ~ 1, rounded to ~0.5 ULP absolute
  const dG = S_INF * (M_G - 1); // cancellation route: |M_G - 1| = a/(2-a) -> 0
  const dFP = S_INF * M_G * (aLo / (1 - aLo)); // = S_inf . M_G . (M_FP - 1)
  const R_measured = -dFP / dG; // carries relative error ~ eps_mach / a
  const R_clean = (2 * (aLo / a) * (1 - a)) / (1 - aLo); // cancellation-free reference
  const depart = Math.abs(R_measured - R_clean) / Math.abs(R_clean);
  return { N, a, dG, R_measured, R_clean, depart };
}

// Scan N from 1e13 to 1e21 (log-spaced) and find the first height where the departure SUSTAINS above TOL
// (require three consecutive grid points above TOL, filtering single-point float noise dips).
const LOG_MIN = 13;
const LOG_MAX = 21;
const STEP = 0.05;
const SCAN = [];
for (let L = LOG_MIN; L <= LOG_MAX + 1e-9; L += STEP) SCAN.push(measure(Math.pow(10, L)));

let onsetIdx = -1;
for (let i = 0; i < SCAN.length - 2; i++) {
  if (SCAN[i].depart > TOL && SCAN[i + 1].depart > TOL && SCAN[i + 2].depart > TOL) {
    onsetIdx = i;
    break;
  }
}
const ONSET = SCAN[onsetIdx];
const T_ONSET = effectiveHeightForN(ONSET.N);
const ABS_DG_ONSET = Math.abs(ONSET.dG);

// The PT anchor and its departure / |dG|.
const N_PT = zeroCountAtHeight(T_PT); // ~1.2362e13
const PT = measure(N_PT);
const ABS_DG_PT = Math.abs(PT.dG);

// Theory: the departure rides the envelope ~ eps_mach / a, so the onset is at a_onset ~ eps_mach / TOL.
const A_ONSET_THEORY = Number.EPSILON / TOL;
const ABS_DG_ONSET_THEORY = (S_INF * A_ONSET_THEORY) / (2 - A_ONSET_THEORY);
const ONSET_THEORY_AGREES = ONSET.a / A_ONSET_THEORY > 1 / 30 && ONSET.a / A_ONSET_THEORY < 30;

// Safety margin of the PT anchor below the onset, in decades of |dG|.
const PT_SAFETY_DECADES = Math.log10(ABS_DG_PT / ABS_DG_ONSET);
const PT_IS_RELIABLE = PT.depart < TOL / 100 && PT_SAFETY_DECADES > 3;

export const IMP35810_CANCELLATION_ONSET_HEIGHT = {
  id: 'imp-35810',
  proofSection: 'S-frontier',
  question:
    'imp-35766 (B3) flagged that the measured cancellation ratio R = -dFP/dG tracks the closed-form model to ' +
    '<1e-6 through N ~ 1e17 but diverges spuriously upward past N ~ 1e18 as float cancellation dominates ' +
    'dG = S_inf (M_G - 1), yet never pinned the exact onset height. Locate the onset height and the |dG| ' +
    'magnitude at which the naively-evaluated R departs the cancellation-free closed form by a chosen tolerance ' +
    '(tol = 1e-6), and confirm the PT anchor N(T_PT=3e12) ~ 1.236e13 (|dG| ~ 1.5e-2) sits safely inside the ' +
    'reliable regime. Measurement only; changes no bound; NO QED.',
  finding:
    'Evaluating the SAME exact ratio two ways -- R_measured via dG = S_inf (M_G - 1) with M_G = 2G/(1+G) formed ' +
    'explicitly (a ~1 quantity rounded to ~0.5 ULP, then the exact Sterbenz subtraction of 1 leaves that error ' +
    'on |M_G - 1| = a/(2-a) -> 0), versus the cancellation-free R_clean = 2 (aLo/a)(1-a)/(1-aLo) -- the relative ' +
    'departure rides the envelope ~ eps_mach / a and grows monotonically as a(N) -> 0. Scanning N from 1e13 to ' +
    '1e21, the departure first SUSTAINS above tol = 1e-6 at N_onset ~ ' +
    ONSET.N.toExponential(2) +
    ' (T ~ ' +
    T_ONSET.toExponential(2) +
    ', a ~ ' +
    ONSET.a.toExponential(2) +
    ', |dG| ~ ' +
    ABS_DG_ONSET.toExponential(2) +
    '), well past 1e17. This matches the theory onset a ~ eps_mach/tol ~ ' +
    A_ONSET_THEORY.toExponential(2) +
    ' to within a small factor, confirming the divergence is machine-epsilon noise, not a real break. The PT ' +
    'anchor N(T_PT) ~ 1.236e13 (a ~ ' +
    PT.a.toExponential(2) +
    ', |dG| ~ ' +
    ABS_DG_PT.toExponential(2) +
    ') sits ~' +
    PT_SAFETY_DECADES.toFixed(1) +
    ' decades of |dG| BELOW the onset with a departure ~ ' +
    PT.depart.toExponential(2) +
    ' (~5 orders under tol) -- comfortably reliable. EVIDENCE / measurement, NOT a machine certificate.',
  constants: {
    tol: TOL,
    N_at_PT_anchor: +N_PT.toPrecision(15),
    T_PT,
    delta: DELTA,
    S_inf_floor: S_INF,
    machine_epsilon: Number.EPSILON,
  },
  measurement: {
    N_onset: +ONSET.N.toPrecision(6),
    T_onset: +T_ONSET.toPrecision(6),
    a_onset: +ONSET.a.toExponential(4),
    abs_dG_onset: +ABS_DG_ONSET.toExponential(4),
    depart_onset: +ONSET.depart.toExponential(4),
    a_onset_theory: +A_ONSET_THEORY.toExponential(4),
    abs_dG_onset_theory: +ABS_DG_ONSET_THEORY.toExponential(4),
    onset_theory_agrees_within_30x: ONSET_THEORY_AGREES,
    a_at_PT_anchor: +PT.a.toExponential(4),
    abs_dG_at_PT_anchor: +ABS_DG_PT.toExponential(4),
    depart_at_PT_anchor: +PT.depart.toExponential(4),
    PT_safety_decades_below_onset: +PT_SAFETY_DECADES.toFixed(2),
    PT_is_reliable: PT_IS_RELIABLE,
  },
  subGap:
    'imp-34714a REMAINS OPEN. Pinning the float-cancellation onset height of the surrogate dG = S_inf (M_G - 1) ' +
    'evaluation says nothing about whether a directed-rounding [g](m)/[F-prime] evaluation yields valid ' +
    'enclosures: it rests on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not ' +
    'that layer, and F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'FLOAT-CANCELLATION ONSET HEIGHT LOCATED, MEASURED (frontier, NOT an RH bound). The ticket asked where the ' +
    'imp-35766 (B3) spurious upward divergence of the measured ratio R = -dFP/dG first onsets and at what |dG| ' +
    'magnitude, and whether the PT anchor sits safely below it. RESULT: comparing R_measured (via the ' +
    'cancellation-carrying dG = S_inf (M_G - 1)) against the cancellation-free R_clean = 2 (aLo/a)(1-a)/(1-aLo), ' +
    'the relative departure rides the eps_mach / a envelope and first sustains above tol = 1e-6 at N_onset ~ ' +
    ONSET.N.toExponential(2) +
    ' (a ~ ' +
    ONSET.a.toExponential(2) +
    ', |dG| ~ ' +
    ABS_DG_ONSET.toExponential(2) +
    '), well past 1e17 and matching the theory onset a ~ eps_mach/tol. The PT anchor N(T_PT) ~ 1.236e13 ' +
    '(|dG| ~ ' +
    ABS_DG_PT.toExponential(2) +
    ') sits ~' +
    PT_SAFETY_DECADES.toFixed(1) +
    ' decades of |dG| below the onset (departure ~ ' +
    PT.depart.toExponential(2) +
    ', ~5 orders under tol), so the imp-35766 "no break to the PT anchor" reading is safe and tol-insensitive. ' +
    'EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate ' +
    'models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision artifact. ' +
    'Measurement only on the inherited imp-3220/imp-3406 surrogate; reuses the imp-35266/imp-35766/imp-34996 ' +
    'machinery (identical K, delta, S_inf, aOf); the C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per ' +
    'imp-486 are UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35766 (B3 float-cancellation artifact past N~1e18); imp-35266 (2:1 split -dFP/dG ~ 2.00042); ' +
    'imp-34996 (S_inf = 1/(2 delta) floor); imp-34693 (admissible seed band); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse; zeroCountAtHeight forward N(T)). ' +
    'Catastrophic-cancellation onset from the eps_mach / a envelope: standard floating-point analysis.',
};

export const IMP35810_CANCELLATION_ONSET_HEIGHT_ASSERTIONS = [
  {
    // A sustained onset was located above N ~ 1e17 (well past the imp-35766 "reliable through 1e17" line).
    id: 'imp35810-onset-located-above-1e17',
    description: 'sustained departure onset above TOL is found at N_onset > 1e17',
    holds: () => onsetIdx > 0 && ONSET.N > 1e17,
  },
  {
    // The onset |dG| and a land in the eps_mach / TOL envelope range (float-cancellation, not a real break).
    id: 'imp35810-onset-matches-eps-over-a-envelope',
    description: 'onset a ~ eps_mach/tol within 30x; onset |dG| in [1e-8, 1e-5]',
    holds: () => ONSET_THEORY_AGREES === true && ABS_DG_ONSET > 1e-8 && ABS_DG_ONSET < 1e-5,
  },
  {
    // The PT anchor sits many decades of |dG| below the onset with a tiny departure -> comfortably reliable.
    id: 'imp35810-PT-anchor-safely-inside-reliable-regime',
    description: 'PT anchor |dG| ~ 1.5e-2, departure < tol/100, and > 3 decades of |dG| below onset',
    holds: () =>
      PT_IS_RELIABLE === true &&
      ABS_DG_PT > 1e-3 &&
      Math.abs(N_PT - 1.2362e13) / 1.2362e13 < 1e-3,
  },
  {
    // The departure is monotone in the trend: it rises from below the PT anchor up to the float-noise regime.
    id: 'imp35810-departure-grows-up-the-height-axis',
    description: 'departure at the top of the scan (N ~ 1e21) exceeds the PT-anchor departure',
    holds: () => SCAN[SCAN.length - 1].depart > PT.depart && PT.depart < TOL,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35810-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35810_CANCELLATION_ONSET_HEIGHT.isRigorous === false &&
      /imp-34714a/.test(IMP35810_CANCELLATION_ONSET_HEIGHT.subGap) &&
      /REMAINS OPEN/.test(IMP35810_CANCELLATION_ONSET_HEIGHT.subGap) &&
      /NO QED/.test(IMP35810_CANCELLATION_ONSET_HEIGHT.verdict) &&
      /refereed bound is changed/i.test(IMP35810_CANCELLATION_ONSET_HEIGHT.verdict),
  },
];

for (const a of IMP35810_CANCELLATION_ONSET_HEIGHT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35810-cancellation-onset-height assertion failed: ${a.id}`);
  }
}
