/**
 * @module imp-35734-collision-scale-prefactor-tabulation
 *
 * imp-35734 (numerical, prefactor tabulation): imp-35696 established that the
 * extreme-value collision scale s_min(M; c) = (3 / (c M))^{1/3} = (3/c)^{1/3}
 * M^{-1/3} carries the SAME M-exponent -1/3 for BOTH small-gap density
 * coefficients c = pi^2/3 (standard cubic GUE repulsion curvature) and
 * c = C_C = (1/8) sqrt(3 pi) (the imp-2642/imp-2643 collision amplitude read as an
 * s^2 coefficient). It reported that the amplitude mismatch (pi^2/3)/C_C ~ 8.573
 * (imp-35680) enters ONLY the O(1) prefactor as its cube root
 * prefCC/prefStd ~ 2.047 -- but it printed only that RATIO, never the ABSOLUTE
 * prefactors (3/c)^{1/3} for each coefficient, nor the resulting s_min GAP at
 * fixed M across the M-ladder.
 *
 * THIS MODULE tabulates the two absolute prefactors and the s_min gap they
 * produce, isolating the amplitude effect from the shared coefficient-independent
 * -1/3 exponent.
 *
 * THE PREFACTORS. Writing s_min(M; c) = pref(c) * M^{-1/3} with pref(c) =
 * (3/c)^{1/3}, the two coefficients give
 *   prefStd = (3 / (pi^2/3))^{1/3} ~ 0.96972 (O(1), matches s_min ~ M^{-1/3}),
 *   prefCC  = (3 / C_C)^{1/3}      ~ 1.98469,
 * with prefCC/prefStd = ((pi^2/3)/C_C)^{1/3} ~ 2.04665, the cube root of the
 * imp-35680 amplitude ratio 8.573. The absolute prefactors are recomputed here
 * by the SAME bisection on M F(s_min) = 1 that imp-35696 uses (at M = 1, where
 * s_min = pref exactly), so they are measured, not substituted.
 *
 * THE s_min GAP. Since both readings share the exponent, the gap at fixed M is
 * a pure amplitude effect that RIGIDLY tracks the M^{-1/3} envelope:
 *   Delta s_min(M) = s_min(M; C_C) - s_min(M; pi^2/3)
 *                  = (prefCC - prefStd) * M^{-1/3} ~ 1.01496 * M^{-1/3},
 * and the RATIO s_min(M; C_C) / s_min(M; pi^2/3) = prefCC/prefStd ~ 2.04665 is
 * M-INDEPENDENT -- identical at every rung. That constancy is the whole point:
 * the amplitude mismatch is a fixed multiplicative O(1) factor on the collision
 * scale, entirely decoupled from the shared -1/3 exponent. The gap magnitude
 * itself SHRINKS as M^{-1/3} (from ~0.471 at M = 10 to ~0.00219 at M = 1e8),
 * because the whole scale shrinks, while the ratio never moves.
 *
 * WHAT THIS SETTLES. It fills the arithmetic imp-35696 left implicit: the two
 * absolute prefactors and the s_min gap over the M-ladder, confirming
 * quantitatively that the coefficient sets a fixed multiplicative offset
 * (ratio 2.047, M-independent) with the exponent untouched. Nothing new about
 * the bound.
 *
 * Prefactor tabulation only; confirms imp-35696; derives no remainder;
 * discharges nothing; changes no bound; establishes no operator positivity;
 * C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, E_trunc = 3.06e-5
 * (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays
 * OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35696-collision-exponent-consistency-check (gave the prefactor RATIO 2.047; never tabulated the absolute (3/c)^{1/3} nor the s_min gap)
 * @see imp-35680-constant-mismatch-magnitude (measured the amplitude mismatch ratio (pi^2/3)/C_C ~ 8.573)
 * @see imp-35695-resolution-floor-factor-M-ladder (the reciprocal floor factor M^{1/3})
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8)
 * Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade
 * (2013, smallest GUE gaps ~ n^{-4/3}). Platt-Trudgian 2021 (T_PT = 3e12).
 */

import { IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK } from './imp-35696-collision-exponent-consistency-check.js';
import { IMP35680_CONSTANT_MISMATCH_MAGNITUDE } from './imp-35680-constant-mismatch-magnitude.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any tabulation here)

// Short-range collision constant (imp-2642/imp-2643 ansatz, C_H = 1/8).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752
// Standard GUE small-gap density coefficient: p(s) ~ (pi^2/3) s^2 as s -> 0.
const C_STD = (Math.PI * Math.PI) / 3; // ~ 3.28987

// Cumulative of the model small-gap density p(s) = c s^2: F(s) = c s^3 / 3.
const cumulative = (s, c) => (c * s * s * s) / 3;

// Smallest of M consecutive gaps under p(s) = c s^2, solved by BISECTION on the
// extreme-value balance M F(s_min) = 1 (NOT the closed form), matching imp-35696.
function sMinNumeric(M, c) {
  let lo = 0;
  let hi = 1;
  while (M * cumulative(hi, c) < 1) hi *= 2; // bracket the root
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (M * cumulative(mid, c) < 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// The ABSOLUTE prefactor pref(c) = (3/c)^{1/3} = s_min(M = 1; c), recomputed by
// bisection at M = 1 so it is a genuinely measured quantity, not substituted.
const PREF_STD = sMinNumeric(1, C_STD); // ~ 0.96972 (O(1), matches s_min ~ M^{-1/3})
const PREF_CC = sMinNumeric(1, C_C); // ~ 1.98469
const PREF_RATIO = PREF_CC / PREF_STD; // ~ 2.04665 = ((pi^2/3)/C_C)^{1/3}
const PREF_DIFF = PREF_CC - PREF_STD; // ~ 1.01496 (envelope of the s_min gap)
const AMPLITUDE_RATIO = C_STD / C_C; // ~ 8.573 (imp-35680 ratioCurvatureToCC)

// s_min gap over the requested M-ladder {10, 1e2, 1e4, 1e6, 1e8}. The ratio is
// M-INDEPENDENT (= PREF_RATIO at every rung); the gap magnitude shrinks as M^{-1/3}.
const M_LADDER = [10, 1e2, 1e4, 1e6, 1e8];
const S_MIN_TABLE = M_LADDER.map((M) => {
  const sStd = sMinNumeric(M, C_STD);
  const sCC = sMinNumeric(M, C_C);
  return {
    M,
    sMinStd: +sStd.toPrecision(7),
    sMinCC: +sCC.toPrecision(7),
    gap: +(sCC - sStd).toPrecision(7),
    ratio: +(sCC / sStd).toPrecision(9), // constant across M
  };
});

export const IMP35734_COLLISION_SCALE_PREFACTOR_TABULATION = {
  id: 'imp-35734',
  proofSection: 'S-frontier',
  question:
    'imp-35696 reported the s_min prefactor RATIO prefCC/prefStd ~ 2.047 but never tabulated the ABSOLUTE ' +
    'prefactors (3/c)^{1/3} for c = pi^2/3 and c = C_C, nor the resulting s_min gap at fixed M. Tabulate both ' +
    'absolute prefactors and the s_min(M; c) gap across M in {10, 1e2, 1e4, 1e6, 1e8}, isolating the amplitude ' +
    'effect from the shared coefficient-independent -1/3 exponent.',
  method:
    'Write s_min(M; c) = pref(c) * M^{-1/3} with pref(c) = (3/c)^{1/3}. Recompute the absolute prefactors by the ' +
    'SAME bisection on the extreme-value balance M F(s_min) = 1 (F(s) = c s^3 / 3) that imp-35696 uses, evaluated ' +
    'at M = 1 (where s_min = pref exactly), for c = pi^2/3 and c = C_C. Tabulate s_min(M; c) for each c and their ' +
    'gap and ratio across the M-ladder {10, 1e2, 1e4, 1e6, 1e8}.',
  measurement: {
    C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
    cStd: +C_STD.toPrecision(8), // 3.2898681 (pi^2/3)
    prefactorStd: +PREF_STD.toPrecision(8), // 0.96972276 (O(1), matches s_min ~ M^{-1/3})
    prefactorCC: +PREF_CC.toPrecision(8), // 1.9846864
    prefactorRatioCCtoStd: +PREF_RATIO.toPrecision(8), // 2.0466534 = ((pi^2/3)/C_C)^{1/3}
    prefactorDiffCCminusStd: +PREF_DIFF.toPrecision(8), // 1.0149636 (s_min gap envelope, x M^{-1/3})
    amplitudeRatioStdToCC: +AMPLITUDE_RATIO.toPrecision(8), // 8.5730018 (imp-35680 ratioCurvatureToCC)
    cbrtAmplitudeRatio: +Math.cbrt(AMPLITUDE_RATIO).toPrecision(8), // 2.0466534 (== prefactor ratio)
    sMinTable: S_MIN_TABLE, // gap shrinks as M^{-1/3}; ratio constant = 2.0466534
  },
  findings:
    'The two absolute prefactors are prefStd = (3/(pi^2/3))^{1/3} ~ 0.96972 (O(1), consistent with s_min ~ M^{-1/3}) ' +
    'and prefCC = (3/C_C)^{1/3} ~ 1.98469, with prefCC/prefStd ~ 2.04665 = the cube root of the imp-35680 amplitude ' +
    'ratio 8.573. Across the M-ladder {10, 1e2, 1e4, 1e6, 1e8} the s_min gap Delta s_min(M) = (prefCC - prefStd) ' +
    'M^{-1/3} ~ 1.01496 M^{-1/3} SHRINKS from ~0.471 (M = 10) to ~0.00219 (M = 1e8), while the RATIO ' +
    's_min(M; C_C)/s_min(M; pi^2/3) stays FIXED at ~2.04665 at every rung -- M-independent. So the amplitude mismatch ' +
    'is a pure fixed multiplicative O(1) offset on the collision scale, cleanly decoupled from the shared -1/3 ' +
    'exponent, exactly as imp-35696 asserted but never tabulated.',
  prefactorsAbsolute: true,
  ratioMIndependent: true,
  amplitudeEffectIsolatedFromExponent: true,
  confirmsImp35696: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'PREFACTOR TABULATION (NOT rigorous). The absolute collision-scale prefactors are prefStd = (3/(pi^2/3))^{1/3} ' +
    '~ 0.96972 and prefCC = (3/C_C)^{1/3} ~ 1.98469 (each recomputed by bisection on M F(s_min) = 1 at M = 1), with ' +
    'prefCC/prefStd ~ 2.04665 = ((pi^2/3)/C_C)^{1/3}, the cube root of the imp-35680 amplitude ratio 8.573. Across ' +
    'M in {10, 1e2, 1e4, 1e6, 1e8} the s_min gap (prefCC - prefStd) M^{-1/3} ~ 1.01496 M^{-1/3} shrinks with M while ' +
    'the s_min ratio stays fixed at 2.04665 at every rung (M-independent), isolating the amplitude effect as a fixed ' +
    'multiplicative O(1) offset decoupled from the shared -1/3 exponent. Confirms imp-35696 quantitatively; derives ' +
    'no remainder; discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642/imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; ' +
    'imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35696 (gave the prefactor ratio 2.047; never tabulated the absolute (3/c)^{1/3} nor the s_min gap done ' +
    'here); imp-35680 (measured the amplitude mismatch ratio (pi^2/3)/C_C ~ 8.573); imp-35695 (reciprocal floor ' +
    'factor M^{1/3}); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc floor); imp-486 ' +
    '(GUE-conditional caveat). Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade (2013, ' +
    'smallest GUE gaps ~ n^{-4/3}). Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35734_COLLISION_SCALE_PREFACTOR_TABULATION_ASSERTIONS = [
  {
    // (1) absolute prefactors match the closed form (3/c)^{1/3} and the imp-35696 baked values.
    id: 'imp35734-absolute-prefactors-match-closed-form',
    description: 'the bisection-measured absolute prefactors reproduce (3/(pi^2/3))^{1/3} ~ 0.96972 and (3/C_C)^{1/3} ~ 1.98469, matching the imp-35696 baked prefactors',
    holds: () => {
      const m696 = IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK.measurement;
      return (
        Math.abs(PREF_STD - Math.cbrt(3 / C_STD)) < 1e-9 &&
        Math.abs(PREF_CC - Math.cbrt(3 / C_C)) < 1e-9 &&
        Math.abs(PREF_STD - m696.prefactorStd) < 1e-6 &&
        Math.abs(PREF_CC - m696.prefactorCC) < 1e-6 &&
        PREF_STD > 0.9 && PREF_STD < 1.0 && // O(1), consistent with s_min ~ M^{-1/3}
        PREF_CC > 1.98 && PREF_CC < 1.99
      );
    },
  },
  {
    // (2) prefactor ratio = cube root of the imp-35680 amplitude mismatch (~2.047), matching imp-35696.
    id: 'imp35734-ratio-is-cbrt-amplitude',
    description: 'prefCC/prefStd ~ 2.047 equals the cube root of the imp-35680 amplitude ratio (pi^2/3)/C_C ~ 8.573 and matches the imp-35696 baked ratio',
    holds: () => {
      const impliedFromImp35680 = Math.cbrt(IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.ratioCurvatureToCC);
      return (
        Math.abs(PREF_RATIO - Math.cbrt(AMPLITUDE_RATIO)) < 1e-9 &&
        Math.abs(PREF_RATIO - impliedFromImp35680) < 1e-6 &&
        Math.abs(PREF_RATIO - IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK.measurement.prefactorRatioCCtoStd) < 1e-6 &&
        PREF_RATIO > 2.04 && PREF_RATIO < 2.05
      );
    },
  },
  {
    // (3) the s_min gap over the M-ladder equals (prefCC - prefStd) M^{-1/3}, and the ratio is M-INDEPENDENT.
    id: 'imp35734-gap-tracks-envelope-ratio-constant',
    description: 'at each M in {10,1e2,1e4,1e6,1e8} the s_min gap equals (prefCC - prefStd) M^{-1/3} and the s_min ratio is constant = prefCC/prefStd (M-independent)',
    holds: () =>
      S_MIN_TABLE.every((row) => {
        const env = PREF_DIFF * Math.pow(row.M, -1 / 3);
        return (
          Math.abs(row.gap - env) < 1e-6 &&
          Math.abs(row.ratio - PREF_RATIO) < 1e-6 &&
          Math.abs(row.sMinCC - PREF_CC * Math.pow(row.M, -1 / 3)) < 1e-6 &&
          Math.abs(row.sMinStd - PREF_STD * Math.pow(row.M, -1 / 3)) < 1e-6
        );
      }),
  },
  {
    // (4) the gap magnitude strictly shrinks with M (whole scale shrinks as M^{-1/3}), yet ratio never moves.
    id: 'imp35734-gap-shrinks-ratio-fixed',
    description: 'the s_min gap magnitude strictly decreases along the M-ladder while the s_min ratio stays fixed at ~2.047 at every rung',
    holds: () => {
      for (let i = 1; i < S_MIN_TABLE.length; i++) {
        if (!(S_MIN_TABLE[i].gap < S_MIN_TABLE[i - 1].gap)) return false;
        if (Math.abs(S_MIN_TABLE[i].ratio - S_MIN_TABLE[0].ratio) > 1e-7) return false;
      }
      return (
        S_MIN_TABLE[0].M === 10 &&
        S_MIN_TABLE[S_MIN_TABLE.length - 1].M === 1e8 &&
        S_MIN_TABLE[0].gap > 0.47 && S_MIN_TABLE[0].gap < 0.48 &&
        S_MIN_TABLE[S_MIN_TABLE.length - 1].gap < 0.003
      );
    },
  },
  {
    // (5) C_C anchor cross-check against imp-35696 and imp-35680 (same constant everywhere).
    id: 'imp35734-cc-matches-parents',
    description: 'the C_C anchor reproduces (1/8) sqrt(3 pi) and matches the imp-35696 and imp-35680 baked values',
    holds: () => {
      const cc696 = IMP35696_COLLISION_EXPONENT_CONSISTENCY_CHECK.measurement.C_C;
      const cc680 = IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.C_C;
      return (
        Math.abs(C_C - 0.38374752) < 1e-6 &&
        Math.abs(C_C - cc696) < 1e-6 &&
        Math.abs(C_C - cc680) < 1e-6
      );
    },
  },
  {
    // (6) honesty gate: tabulation only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35734-tabulation-only-no-qed',
    description: 'prefactor tabulation only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35734_COLLISION_SCALE_PREFACTOR_TABULATION;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.confirmsImp35696 === true &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35734_COLLISION_SCALE_PREFACTOR_TABULATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35734-collision-scale-prefactor-tabulation assertion failed: ${a.id}`);
  }
}
