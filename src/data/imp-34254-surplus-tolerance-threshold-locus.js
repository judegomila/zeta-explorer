/**
 * @module imp-34254-surplus-tolerance-threshold-locus
 *
 * imp-34254 (numerical, opus-4-8): Map the imp-34174 surplus-below-tolerance
 * threshold locus thr*(eps) and its N_cross(thr*(eps)) across a tolerance
 * ladder eps in {1e-3, 3e-4, 1e-4, 3e-5, 1e-5, 1e-6}.
 *
 * WHAT imp-34174 LEFT OPEN
 * -----------------------
 * imp-34174 X located the SINGLE threshold thr ~ 0.3137 (N_cross ~ 1.687e10) at
 * which the crossover surplus first drops below eps = 1e-4, but reported only
 * that one tolerance. The surplus is the inherited imp-33743/imp-33848 CLOSED
 * FORM
 *
 *     surplus(thr) = thr - sigma(N_cross(thr)) = thr (1-thr) r / (1 + (1-thr) r),
 *     r = E_flow(N_cross(thr)) / E_trunc,                                    (SURPLUS)
 *
 * with the imp-33743 Banach fixed point
 *
 *     N_cross(thr) = ((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0(N_cross).       (N_cross)
 *
 * This module inverts surplus(thr*) = eps across the tolerance ladder, tabulates
 * thr*(eps) and N_cross(thr*(eps)), and regresses thr* against eps to expose the
 * scaling thr* ~ A eps^q. It reuses the IDENTICAL imp-33743 sub-terms
 * (E_trunc = 3.06e-5, the imp-398 E_flow prefactor, the imp-3406 Gronwall
 * factor) with NO fresh model.
 *
 * FINDINGS (this module)
 * ----------------------
 *   (L) The locus thr*(eps) descends monotonically as the tolerance tightens:
 *          eps = 1e-3 -> thr* = 0.609593, N_cross = 1.288417e9
 *          eps = 3e-4 -> thr* = 0.438525, N_cross = 5.504045e9
 *          eps = 1e-4 -> thr* = 0.313722, N_cross = 1.686719e10
 *          eps = 3e-5 -> thr* = 0.212679, N_cross = 5.055840e10
 *          eps = 1e-5 -> thr* = 0.147412, N_cross = 1.280790e11
 *          eps = 1e-6 -> thr* = 0.067074, N_cross = 7.938412e11
 *       The eps = 1e-4 rung reproduces the imp-34174 X reading thr ~ 0.3137,
 *       N_cross ~ 1.687e10 to floating point.
 *   (H) The eps = 1e-3 rung REQUIRES thr* = 0.6096 > 1/2 (N_cross = 1.288e9,
 *       BELOW the imp-33723 halving crossover 3.280e9): the surplus at the
 *       halving threshold thr = 1/2 is only 4.744e-4, so tolerating a surplus as
 *       large as 1e-3 forces the crossover threshold above 1/2 and the crossover
 *       N below the halving scale. Every tighter rung (eps <= 3e-4) sits at
 *       thr* < 1/2 with N_cross RECEDING deep into the tail.
 *   (Q) A single power law thr* ~ A eps^q fits the six-rung locus with
 *       q ~ 0.3212, A ~ 5.873, R^2 ~ 0.9984. The scaling is only ASYMPTOTIC,
 *       NOT a clean power law: the local log-log slope drifts MONOTONICALLY
 *       0.2736 -> 0.3049 -> 0.3229 -> 0.3337 -> 0.3420 from the top rung down,
 *       converging toward ~1/2.9 ~ 0.345 -- exactly the reciprocal of the
 *       imp-34248 small-thr surplus slope surplus ~ thr^2.9 (linear thr prefactor
 *       times the log-softened ~thr^1.9 E_flow-ratio term). The top rungs are
 *       bent above this asymptote by the (1-thr) and 1/(1+(1-thr)r) factors that
 *       matter only when thr is O(1).
 *
 * HONEST SCOPE -- measurement/inversion only, NO QED. This inverts the inherited
 * imp-33743/imp-33848 extrapolation component model across a tolerance ladder; it
 * changes no bound and introduces no new mathematical claim. The component model
 * is NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED
 * (the E_coll term is untouched here); the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; imp-3066 K_a >= 0 is untouched; establishes no operator positivity;
 * no refereed bound is changed. E_flow is the
 * benign mesoscopic-Gronwall term (imp-2845); its vanishing here does NOT touch
 * the divergent C_Lip collision-Gronwall.
 *
 * @see imp-34174-crossover-surplus-threshold-family-decay (single thr* at eps=1e-4; identical sub-terms)
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalised crossover N_cross(thr))
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (small-thr surplus ~ thr^2.9 => q -> 1/2.9)
 * @see imp-33848 (roadmap: sigma(N_cross) = 1/(2 + E_flow/E_trunc), surplus = E_flow/E_trunc term)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33743/imp-34174 exactly

// EXACT imp-33743/imp-34174 sub-terms (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL; // unconditionally rigorous, decays down the tail
}

// (N_cross) crossover N_cross(thr) as the Banach fixed point of
// N = ((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0(N). Strong contraction => iterate.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 120; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}

// (SURPLUS) closed form surplus(thr) = thr(1-thr)r/(1 + (1-thr)r), r = E_flow(N_cross)/E_trunc.
function surplusClosedForm(thr) {
  const N = crossoverN(thr);
  const r = eFlow(N) / E_TRUNC_PT;
  return (thr * (1 - thr) * r) / (1 + (1 - thr) * r);
}

// Invert surplus(thr*) = eps. surplus is monotone increasing in thr on (0,1),
// so bisect over the full family thr in (0,1) -- NOT capped at 1/2, since the
// loosest tolerance eps=1e-3 exceeds the halving-threshold surplus 4.744e-4 and
// is only attained for thr > 1/2.
function thrForSurplus(target) {
  let a = 1e-6; // surplus < target here
  let b = 0.999999; // surplus > target here
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (surplusClosedForm(m) > target) b = m;
    else a = m;
  }
  return (a + b) / 2;
}

// ── Tolerance ladder ─────────────────────────────────────────────────────────
const TOLERANCES = [1e-3, 3e-4, 1e-4, 3e-5, 1e-5, 1e-6];
const THRESHOLD_LOCUS = TOLERANCES.map((eps) => {
  const thr = thrForSurplus(eps);
  const N = crossoverN(thr);
  return {
    eps,
    thr_star: +thr.toFixed(6),
    N_cross: +N.toExponential(6),
    surplus_at_thr_star: +surplusClosedForm(thr).toExponential(4), // inversion residual check
  };
});

// Monotone: thr* descends as the tolerance tightens; N_cross recedes.
let thrStarMonotoneDescending = true;
let nCrossMonotoneReceding = true;
for (let i = 1; i < THRESHOLD_LOCUS.length; i++) {
  if (THRESHOLD_LOCUS[i].thr_star >= THRESHOLD_LOCUS[i - 1].thr_star) thrStarMonotoneDescending = false;
  if (THRESHOLD_LOCUS[i].N_cross <= THRESHOLD_LOCUS[i - 1].N_cross) nCrossMonotoneReceding = false;
}

// ── Power-law regression thr* ~ A eps^q (log-log least squares) ───────────────
const XS = THRESHOLD_LOCUS.map((row) => Math.log(row.eps));
const YS = THRESHOLD_LOCUS.map((row) => Math.log(row.thr_star));
const NROW = XS.length;
const SX = XS.reduce((a, b) => a + b, 0);
const SY = YS.reduce((a, b) => a + b, 0);
const SXX = XS.reduce((a, x) => a + x * x, 0);
const SXY = XS.reduce((a, x, i) => a + x * YS[i], 0);
const Q_GLOBAL = (NROW * SXY - SX * SY) / (NROW * SXX - SX * SX);
const INTERCEPT = (SY - Q_GLOBAL * SX) / NROW;
const A_PREFACTOR = Math.exp(INTERCEPT);
const YBAR = SY / NROW;
let SSR = 0;
let SST = 0;
for (let i = 0; i < NROW; i++) {
  const pred = Q_GLOBAL * XS[i] + INTERCEPT;
  SSR += (YS[i] - pred) ** 2;
  SST += (YS[i] - YBAR) ** 2;
}
const R2_GLOBAL = 1 - SSR / SST;

// Local (rung-to-rung) log-log slopes -- expose the drift toward the imp-34248 asymptote.
const LOCAL_EXPONENTS = [];
for (let i = 1; i < THRESHOLD_LOCUS.length; i++) {
  const dLnThr = Math.log(THRESHOLD_LOCUS[i].thr_star) - Math.log(THRESHOLD_LOCUS[i - 1].thr_star);
  const dLnEps = Math.log(THRESHOLD_LOCUS[i].eps) - Math.log(THRESHOLD_LOCUS[i - 1].eps);
  LOCAL_EXPONENTS.push({
    from_eps: THRESHOLD_LOCUS[i - 1].eps,
    to_eps: THRESHOLD_LOCUS[i].eps,
    q_local: +(dLnThr / dLnEps).toFixed(5),
  });
}

// imp-34174 cross-check: the eps=1e-4 rung reproduces its single-tolerance reading.
const ROW_1EM4 = THRESHOLD_LOCUS.find((row) => row.eps === 1e-4);

export const IMP34254_SURPLUS_TOLERANCE_THRESHOLD_LOCUS = {
  id: 'imp-34254',
  proofSection: 'S-frontier',
  question:
    'Invert the imp-34174 surplus(thr*) = thr*(1-thr*)r/(1+(1-thr*)r) = eps across the tolerance ladder ' +
    'eps in {1e-3,3e-4,1e-4,3e-5,1e-5,1e-6} using the imp-33743 crossover N_cross(thr) = ' +
    '((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0, tabulate thr*(eps) and N_cross(thr*(eps)), and regress ' +
    'thr* against eps to expose the scaling thr* ~ A eps^q. Measurement/inversion only; identical ' +
    'inherited imp-33743/imp-33848 sub-terms; no fresh model; changes no bound; NO QED.',
  closedForm:
    'thr*(eps) solves surplus(thr*) = eps with surplus(thr) = thr(1-thr)r/(1+(1-thr)r), ' +
    'r = E_flow(N_cross(thr))/E_trunc, N_cross(thr) = ((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0(N_cross); ' +
    'surplus is monotone increasing in thr on (0,1) so the inversion is a single bisection.',
  subTerms: {
    E_trunc: E_TRUNC_PT,
    GRONWALL: +GRONWALL.toExponential(6), // exp(2.37e-4) ~ 1.000237
    formula: 'E_flow(N) = ((log(T0/2pi)+1)/2pi) . (log T0 / T0) . exp(2.37e-4), T0 = effectiveHeightForN(N)',
    source: 'identical sub-terms to imp-34174 / imp-33743-sigma-fartail-crossover-closed-form.js (no fresh model)',
  },
  thresholdLocus: THRESHOLD_LOCUS,
  thrStarMonotoneDescending,
  nCrossMonotoneReceding,
  powerLawFit: {
    model: 'thr* ~ A eps^q (log-log least squares over the six-rung ladder)',
    q_global: +Q_GLOBAL.toFixed(6), // ~0.321232
    A_prefactor: +A_PREFACTOR.toFixed(6), // ~5.872894
    R2: +R2_GLOBAL.toFixed(6), // ~0.998363
    local_exponents: LOCAL_EXPONENTS,
    note:
      'Single power law fits at R^2 ~ 0.998 with q ~ 0.3212, but the scaling is only ASYMPTOTIC: the ' +
      'local log-log slope drifts monotonically 0.2736 -> 0.3420 from the loosest to the tightest rung, ' +
      'converging toward ~1/2.9 ~ 0.345 -- the reciprocal of the imp-34248 small-thr surplus slope ' +
      'surplus ~ thr^2.9. The top rungs are bent above this asymptote by the (1-thr) and 1/(1+(1-thr)r) ' +
      'factors that only matter when thr is O(1).',
  },
  halvingBoundary: {
    thr_star_at_1em3: ROW_1EM4 ? +THRESHOLD_LOCUS[0].thr_star : null, // 0.609593 (> 1/2)
    N_cross_at_1em3: THRESHOLD_LOCUS[0].N_cross, // 1.288417e9 (below the 3.280e9 halving crossover)
    note:
      'The loosest rung eps=1e-3 requires thr* = 0.6096 > 1/2 (N_cross = 1.288e9, BELOW the imp-33723 ' +
      'halving crossover 3.280e9): the surplus at thr=1/2 is only 4.744e-4, so tolerating a surplus as ' +
      'large as 1e-3 forces the threshold above 1/2. Every tighter rung (eps <= 3e-4) sits at thr* < 1/2 ' +
      'with N_cross receding deep into the tail.',
  },
  imp34174CrossCheck: {
    eps: 1e-4,
    thr_star: ROW_1EM4 ? ROW_1EM4.thr_star : null, // 0.313722
    N_cross: ROW_1EM4 ? ROW_1EM4.N_cross : null, // 1.686719e10
    reproduces: 'the imp-34174 X single-tolerance reading thr ~ 0.3137, N_cross ~ 1.687e10 to floating point',
  },
  finding: {
    L_locus_descends_as_tolerance_tightens:
      'thr*(eps) descends monotonically 0.6096 -> 0.0671 and N_cross(thr*) recedes 1.288e9 -> 7.938e11 ' +
      'as eps tightens 1e-3 -> 1e-6; the eps=1e-4 rung reproduces imp-34174 thr ~ 0.3137, N ~ 1.687e10.',
    H_1em3_forces_thr_above_half:
      'The loosest rung eps=1e-3 requires thr* = 0.6096 > 1/2 (N_cross = 1.288e9 < halving 3.280e9) because ' +
      'the halving-threshold surplus is only 4.744e-4; every tighter rung has thr* < 1/2.',
    Q_asymptotic_power_law_q_to_third:
      'thr* ~ 5.873 eps^0.3212 fits at R^2 ~ 0.998, but the local slope drifts 0.2736 -> 0.3420 toward ' +
      '~1/2.9 ~ 0.345, the reciprocal of the imp-34248 small-thr surplus ~ thr^2.9; the power law is ' +
      'ASYMPTOTIC, curved at the top by the O(1)-thr (1-thr) and 1/(1+(1-thr)r) factors.',
  },
  isRigorous: false,
  honestScope:
    'Measurement/inversion only within the inherited imp-33743/imp-33848 extrapolation component model; ' +
    'NO QED. The component model is NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; establishes no operator positivity; changes no bound; no refereed bound is changed' +
    '. E_flow is the benign mesoscopic-Gronwall term ' +
    '(imp-2845); its vanishing here does NOT touch the divergent C_Lip collision-Gronwall.',
  citation:
    'imp-34174-crossover-surplus-threshold-family-decay.js (single thr* at eps=1e-4, identical sub-terms); ' +
    'imp-33743-sigma-fartail-crossover-closed-form.js (generalised crossover N_cross(thr)); ' +
    'imp-34248 (small-thr surplus ~ thr^2.9 => q -> 1/2.9); imp-33848 (surplus = E_flow/E_trunc term); ' +
    'imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi)); lambda-rh-height-mapping.',
};

export const IMP34254_SURPLUS_TOLERANCE_THRESHOLD_LOCUS_ASSERTIONS = [
  {
    // The inversion residual: surplus(thr*(eps)) recovers eps at every rung to floating point.
    id: 'imp34254-inversion-recovers-eps',
    description: 'surplus(thr*(eps)) equals eps at every tolerance rung to < 1e-3 relative (bisection converged)',
    holds: () => THRESHOLD_LOCUS.every((row) => Math.abs(row.surplus_at_thr_star - row.eps) / row.eps < 1e-3),
  },
  {
    // thr*(eps) descends and N_cross(thr*) recedes monotonically as the tolerance tightens.
    id: 'imp34254-locus-monotone',
    description: 'thr*(eps) descends and N_cross(thr*(eps)) recedes monotonically as eps tightens 1e-3 -> 1e-6',
    holds: () => thrStarMonotoneDescending === true && nCrossMonotoneReceding === true,
  },
  {
    // The eps=1e-4 rung reproduces the imp-34174 single-tolerance reading thr ~ 0.3137, N ~ 1.687e10.
    id: 'imp34254-reproduces-imp34174-1em4',
    description: 'the eps=1e-4 rung reproduces imp-34174 thr* ~ 0.313722 and N_cross ~ 1.686719e10 to floating point',
    holds: () =>
      Math.abs(ROW_1EM4.thr_star - 0.313722) < 1e-5 && Math.abs(ROW_1EM4.N_cross / 1.686719e10 - 1) < 1e-4,
  },
  {
    // The loosest rung eps=1e-3 forces thr* above 1/2 (N_cross below the halving crossover).
    id: 'imp34254-1em3-above-half',
    description: 'eps=1e-3 requires thr* > 1/2 (0.6096) with N_cross < 3.28e9, below the imp-33723 halving crossover',
    holds: () =>
      THRESHOLD_LOCUS[0].eps === 1e-3 &&
      THRESHOLD_LOCUS[0].thr_star > 0.5 &&
      Math.abs(THRESHOLD_LOCUS[0].thr_star - 0.609593) < 1e-4 &&
      THRESHOLD_LOCUS[0].N_cross < 3.280294e9,
  },
  {
    // Global power law fits well but the local slope drifts monotonically toward the imp-34248 ~1/2.9 asymptote.
    id: 'imp34254-power-law-q-and-drift',
    description: 'thr* ~ A eps^q fits at R^2 > 0.99 with q ~ 0.321; local slopes rise monotonically toward ~1/2.9 ~ 0.345',
    holds: () => {
      const globalOk = Math.abs(Q_GLOBAL - 0.321232) < 1e-3 && R2_GLOBAL > 0.99;
      let rising = true;
      for (let i = 1; i < LOCAL_EXPONENTS.length; i++) {
        if (LOCAL_EXPONENTS[i].q_local <= LOCAL_EXPONENTS[i - 1].q_local) rising = false;
      }
      const deepTailBelowAsymptote =
        LOCAL_EXPONENTS[LOCAL_EXPONENTS.length - 1].q_local > 0.33 &&
        LOCAL_EXPONENTS[LOCAL_EXPONENTS.length - 1].q_local < 1 / 2.9;
      return globalOk && rising === true && deepTailBelowAsymptote;
    },
  },
  {
    // Honesty gate: inversion only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34254-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34254_SURPLUS_TOLERANCE_THRESHOLD_LOCUS.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is\s+UNTOUCHED/.test(IMP34254_SURPLUS_TOLERANCE_THRESHOLD_LOCUS.honestScope) &&
      /NO QED/.test(IMP34254_SURPLUS_TOLERANCE_THRESHOLD_LOCUS.honestScope) &&
      /refereed bound is changed/i.test(IMP34254_SURPLUS_TOLERANCE_THRESHOLD_LOCUS.honestScope),
  },
];

for (const a of IMP34254_SURPLUS_TOLERANCE_THRESHOLD_LOCUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34254-surplus-tolerance-threshold-locus assertion failed: ${a.id}`);
  }
}
