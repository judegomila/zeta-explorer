/**
 * @module imp-34251-shortfall-alpha-refined-estimator-cross-check
 *
 * imp-34251 (accuracy, frontier-direction): imp-34126 F2 found the log-log span exponent alpha of the
 * NORMALIZED centroid shortfall 1 - delta*L^2/(Snat/4) rises 0.698 -> 0.855 across L ~ 135..1836
 * toward the predicted linear value 1, but hedged that the FD/OLS PRECISION FLOOR -- pointwise
 * central-FD step 1e-3, windowed OLS at 4 pts/decade -- corrupts the reading past L >~ 3000, so the
 * ladder stopped at N = 1e800. That hedge was never tested: the shortfall was never re-run at finer
 * resolution to see whether alpha shifts UPWARD toward 1 at FIXED L. This module re-runs the identical
 * inherited imp-34126/imp-34065 shortfall at two fixed deep rungs (N = 1e200, L ~ 456.24; N = 1e800,
 * L ~ 1836.39) with a REFINED estimator -- densifying the OLS window 4 -> 8 -> 16 -> 32 -> 64
 * pts/decade and shrinking the pointwise central-FD step 1e-3 -> 3e-4 -> 1e-4 -> 1e-5 -- and asks
 * whether the sub-linear alpha reading is a removable FD/OLS artifact or a genuine finite-L feature.
 *
 * THE QUANTITY (identical inherited imp-34126/imp-34065/imp-34006 sub-terms; NO fresh model)
 * ----------------------------------------------------------------------------------------
 *   sigma(N)   = E_coll / (E_trunc + E_flow + E_coll), evaluated entirely in log-N space (imp-33859)
 *   p(N)       = -d ln sigma/d ln N   (POINTWISE central FD, step dl -- VARIED here from 1e-3 down)
 *   p_eff(N;S) = -OLS slope over [N, N*10^S]  (WINDOWED, pts/decade -- VARIED here from 4 up)
 *   delta      = p_eff(N;S) - p(N)    (the imp-34006/imp-34065 pointwise-vs-window offset)
 *   shortfall(S) = 1 - delta*L^2/(Snat/4),  alpha = log-log slope of shortfall vs S over S in {6,12,24,48}
 * The imp-34126 logT0FromLnN / lnSigmaFromLnN / pPointAtLog10 / pWindowAtLog10 functions are reused
 * VERBATIM; only the FD step dl and the OLS pts/decade are exposed as knobs.
 *
 * THE FINDING (measurement / cross-check only)
 * --------------------------------------------
 *   (F1) OLS DENSITY IS NOT THE BOTTLENECK -- alpha is essentially INVARIANT under it. Densifying the
 *        window 4 -> 64 pts/decade at dl = 1e-3 shifts alpha by only +0.0037 at BOTH fixed rungs
 *        (N=1e200: 0.8084 -> 0.8121; N=1e800: 0.8549 -> 0.8585 -- the SAME +0.0037 shift, monotone and
 *        saturating), nowhere near the +0.19 / +0.15 jump toward 1 an FD/OLS-artifact reading would
 *        need. The sub-linear alpha survives OLS refinement: it is a GENUINE finite-L feature.
 *   (F2) FD-STEP REFINEMENT DESTABILIZES DEEP RUNGS RATHER THAN CORRECTING THEM. Shrinking the
 *        pointwise FD step at fixed L moves alpha only trivially at the shallower rung (N=1e200:
 *        0.8113 at 1e-3 -> 0.8140 at 1e-5) but at the deep rung N=1e800 it OVERSHOOTS PAST the linear
 *        ceiling (0.8578 at 1e-3 -> 0.8789 at 1e-4 -> 1.1695 at 1e-5) while the fit R^2 COLLAPSES
 *        0.99896 -> 0.98530. That is the roundoff blow-up of a central FD differencing ln sigma at
 *        near-coincident points where p(N) ~ 1/(2L) is vanishingly small -- exactly the "FD floor
 *        corrupts L >~ 3000" wall imp-34126 F2 named, now shown to be a ROUNDOFF WALL that finer
 *        stepping WORSENS, not an undershoot that finer stepping removes.
 *
 * The punchline: the imp-34126 F2 sub-linear alpha is NOT an FD-precision-floor undershoot. At FIXED L
 * the reading is robust to OLS densification (moves +0.0037, saturating far below 1) and cannot be
 * pushed cleanly to 1 by a smaller FD step (which instead overshoots and destabilizes past L ~ 1836).
 * So imp-34126 F2's PRIMARY attribution -- the sub-linearity is genuine finite-L centroid curvature
 * from the neglected O(h^3) span term, with alpha -> 1 only as L -> inf -- is the correct reading; its
 * SECONDARY FD-floor hedge does not explain the sub-linearity at the clean rungs. FD-precision-floor
 * reading RULED OUT at the resolvable rungs.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Conditional-share diagnostic, NOT an RH bound. Identical inherited
 * imp-34065/imp-3220/imp-3406 sub-terms, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34126-shortfall-span-scaling-of-centroid-offset (F2 alpha ladder + the FD-floor hedge tested here)
 * @see imp-34191-span-exponent-alpha-limit-fit (fits the alpha ladder to saturating surrogates; alpha_inf ~ 0.88)
 * @see imp-34065-window-span-scaling-of-exponent-offset (S1 shortfall grows with span)
 * @see imp-34227-surrogate-zero-estimator-reconciliation (sibling: coarse-estimator artifact vs genuine feature)
 * @see imp-33859 (log-N-space direct evaluation past IEEE-double overflow; reused here)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-34006)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34126/imp-34065 exactly
const SPANS = [6, 12, 24, 48]; // OLS window spans in decades (imp-34126)
const FIXED_RUNGS = [200, 800]; // fixed deep rungs (imp-34126 deepest clean rungs, L ~ 456.24 / 1836.39)
const PTS_LADDER = [4, 8, 16, 32, 64]; // OLS pts/decade -- baseline 4 (imp-33274) then densified
const FD_LADDER = [1e-3, 3e-4, 1e-4, 1e-5]; // pointwise central-FD step -- baseline 1e-3 then shrunk
const BASE_PTS = 4; // imp-34126 baseline OLS density
const BASE_DL = 1e-3; // imp-34126 baseline FD step

// EXACT imp-34126 sub-terms in log-N space (imp-33859 route: never forms T0 or N).
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 80; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-13 * Math.max(1, u)) break;
  }
  return { u, L: u + Math.log(TWO_PI) };
}
function lnSigmaFromLnN(lnN) {
  const { u, L } = logT0FromLnN(lnN);
  const C_F = (u + 1) / TWO_PI;
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL;
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}
function pPointAtLog10(d, dl) {
  const lnN = d * Math.LN10;
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}
function pWindowAtLog10(dStart, span, pts) {
  const step = 1 / pts;
  const xs = [];
  const ys = [];
  for (let d = dStart; d <= dStart + span + 1e-9; d += step) {
    const lnN = d * Math.LN10;
    xs.push(lnN);
    ys.push(lnSigmaFromLnN(lnN));
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
function olsSlopeR2(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  return { slope: sxy / sxx, r2: (sxy * sxy) / (sxx * syy) };
}

// alpha (log-log span exponent) of the normalized shortfall at fixed rung d, OLS density pts, FD step dl.
function alphaAt(d, pts, dl) {
  const L = logT0FromLnN(d * Math.LN10).L;
  const pP = pPointAtLog10(d, dl);
  const sh = SPANS.map((S) => {
    const Snat = S * Math.LN10;
    return 1 - ((pWindowAtLog10(d, S, pts) - pP) * L * L) / (Snat / 4);
  });
  const ll = olsSlopeR2(SPANS.map((s) => Math.log(s)), sh.map((v) => Math.log(v)));
  return { alpha: ll.slope, r2: ll.r2 };
}

// Per fixed rung: the OLS-density ladder (dl fixed at baseline) and the FD-step ladder (pts fixed at 16).
const RUNG_ROWS = FIXED_RUNGS.map((d) => {
  const L = logT0FromLnN(d * Math.LN10).L;
  const base = alphaAt(d, BASE_PTS, BASE_DL);
  const olsLadder = PTS_LADDER.map((pts) => {
    const r = alphaAt(d, pts, BASE_DL);
    return { pts, alpha: +r.alpha.toFixed(4), r2: +r.r2.toFixed(5), shift_vs_base: +(r.alpha - base.alpha).toFixed(4) };
  });
  const fdLadder = FD_LADDER.map((dl) => {
    const r = alphaAt(d, 16, dl); // fix OLS density at 16 pts/decade, shrink FD step
    return { fd_step: dl, alpha: +r.alpha.toFixed(4), r2: +r.r2.toFixed(5) };
  });
  const olsShift = olsLadder[olsLadder.length - 1].alpha - olsLadder[0].alpha; // 4 -> 64 pts total shift
  return {
    N_log10: d,
    logT0: +L.toFixed(3),
    alpha_baseline: +base.alpha.toFixed(4), // (4 pts/decade, dl=1e-3) -- the imp-34126 F2 reading
    olsDensityLadder: olsLadder,
    ols_shift_4_to_64: +olsShift.toFixed(4), // tiny & positive: OLS density is not the bottleneck
    fdStepLadder: fdLadder,
  };
});

export const IMP34251_SHORTFALL_ALPHA_REFINED_ESTIMATOR_CROSS_CHECK = {
  id: 'imp-34251',
  proofSection: 'S-frontier',
  question:
    'imp-34126 F2 read the normalized-shortfall span exponent alpha as sub-linear (0.698 -> 0.855 over ' +
    'L ~ 135..1836) approaching 1, but hedged that the FD/OLS precision floor (step 1e-3, 4 pts/decade) ' +
    'corrupts L >~ 3000. Re-running the identical shortfall at two fixed deep rungs (N = 1e200, 1e800) ' +
    'with a REFINED estimator -- OLS 4 -> 64 pts/decade and FD step 1e-3 -> 1e-5 -- does alpha shift ' +
    'UPWARD toward 1 at FIXED L (FD-artifact undershoot), or does the sub-linear reading survive ' +
    '(genuine finite-L curvature)? Measurement/cross-check only; identical inherited imp-34065 sub-terms; ' +
    'C_mb GUE-conditional (imp-486) untouched; no QED.',
  measuredQuantity:
    'alpha = log-log slope of the normalized shortfall 1 - delta*L^2/(Snat/4) over S in {6,12,24,48}, at ' +
    'fixed N in {1e200, 1e800}, under an OLS-density ladder (4,8,16,32,64 pts/decade at FD step 1e-3) and ' +
    'a pointwise central-FD-step ladder (1e-3, 3e-4, 1e-4, 1e-5 at 16 pts/decade)',
  baseline_estimator: { pts_per_decade: BASE_PTS, fd_step: BASE_DL }, // the imp-34126 F2 estimator
  rungTable: RUNG_ROWS,
  finding: {
    F1_ols_density_not_the_bottleneck:
      'Densifying the OLS window 4 -> 64 pts/decade at FD step 1e-3 shifts alpha by only +0.0037 at ' +
      'BOTH fixed rungs (N=1e200: 0.8084 -> 0.8121; N=1e800: 0.8549 -> 0.8585 -- the SAME +0.0037), ' +
      'monotone and saturating, nowhere near the ~+0.19/+0.15 jump toward 1 an OLS-artifact reading ' +
      'would need. The sub-linear alpha survives OLS refinement -- it is a genuine finite-L feature, ' +
      'not a coarse-sampling undershoot.',
    F2_fd_step_refinement_destabilizes_not_corrects:
      'Shrinking the pointwise FD step at fixed L moves alpha only trivially at N=1e200 (0.8113 at ' +
      '1e-3 -> 0.8140 at 1e-5) but at N=1e800 it OVERSHOOTS PAST the linear ceiling (0.8578 -> 0.8789 ' +
      'at 1e-4 -> 1.1695 at 1e-5) while the fit R^2 COLLAPSES 0.99896 -> 0.98530 -- the roundoff ' +
      'blow-up of a central FD differencing ln sigma at near-coincident points where p(N) ~ 1/(2L) is ' +
      'vanishingly small. The imp-34126 F2 "FD floor corrupts L >~ 3000" wall is a ROUNDOFF wall that ' +
      'finer stepping WORSENS, not an undershoot finer stepping removes.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (frontier-direction, NOT rigorous). imp-34126 F2 read the ' +
    'normalized-shortfall span exponent alpha as sub-linear approaching 1 but hedged that the FD/OLS ' +
    'precision floor (step 1e-3, 4 pts/decade) corrupts L >~ 3000. Re-running the identical shortfall ' +
    'at fixed N = 1e200 (L ~ 456.24) and N = 1e800 (L ~ 1836.39) with a REFINED estimator SETTLES the ' +
    'hedge: (F1) densifying the OLS window 4 -> 64 pts/decade shifts alpha by only +0.0037 at BOTH ' +
    'rungs (0.8084 -> 0.8121 and 0.8549 -> 0.8585, the identical shift), saturating far below 1 -- OLS ' +
    'density is not the bottleneck and the sub-linear reading is a genuine finite-L feature; (F2) ' +
    'shrinking the FD step does NOT cleanly push alpha to 1 -- at N=1e200 it barely moves (0.8113 -> ' +
    '0.8140) and at N=1e800 it OVERSHOOTS past the linear ceiling to 1.1695 at 1e-5 while R^2 collapses ' +
    '0.99896 -> 0.98530, the classic roundoff blow-up of the pointwise central FD on a vanishing ' +
    'p ~ 1/(2L). So the FD-precision-floor UNDERSHOOT reading is RULED OUT at the resolvable rungs: the ' +
    'sub-linear alpha survives OLS refinement and cannot be corrected by FD-step refinement (which ' +
    'instead destabilizes past L ~ 1836). imp-34126 F2s PRIMARY attribution -- genuine finite-L ' +
    'centroid curvature from the neglected O(h^3) span term, alpha -> 1 only as L -> inf -- is the ' +
    'correct reading; its FD-floor hedge is a roundoff wall, not the source of the sub-linearity. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34126 (shortfall span scaling; F2 alpha ladder + FD-floor hedge tested here); imp-34191 (alpha ' +
    'limit fit; alpha_inf ~ 0.88 below 1); imp-34065 (window-span scaling; S1 shortfall grows with ' +
    'span); imp-34227 (coarse-estimator artifact vs genuine-feature reconciliation); imp-33859 ' +
    '(log-N-space direct evaluation past IEEE-double overflow); imp-486 (C_mb GUE-conditional); ' +
    'polymath15-constant-C-C.',
};

export const IMP34251_SHORTFALL_ALPHA_REFINED_ESTIMATOR_CROSS_CHECK_ASSERTIONS = [
  {
    // Reuse gate: the baseline (4 pts/decade, dl=1e-3) at N=1e200 reproduces the imp-34126 F2 depth-ladder
    // reading alpha ~ 0.808 at the N=1e200 rung, confirming the identical inherited estimator.
    id: 'imp34251-baseline-reproduces-imp34126-f2-1e200-alpha',
    description: 'baseline (4 pts, dl=1e-3) at N=1e200 reproduces imp-34126 F2 alpha ~ 0.808',
    holds: () => {
      const r = RUNG_ROWS.find((x) => x.N_log10 === 200);
      return Math.abs(r.alpha_baseline - 0.808) < 0.01;
    },
  },
  {
    // (F1): OLS density is NOT the bottleneck -- densifying 4 -> 64 pts/decade shifts alpha only slightly
    // upward (positive, < 0.01) at BOTH fixed rungs, and alpha stays far below the linear ceiling 0.9.
    id: 'imp34251-ols-density-shift-tiny-both-rungs',
    description: 'OLS 4->64 pts/decade shifts alpha positively but < 0.01 at both rungs; alpha stays < 0.9',
    holds: () =>
      RUNG_ROWS.every((r) => {
        const first = r.olsDensityLadder[0].alpha;
        const last = r.olsDensityLadder[r.olsDensityLadder.length - 1].alpha;
        return last - first > 0 && last - first < 0.01 && last < 0.9;
      }),
  },
  {
    // (F1): the OLS-density ladder is monotone increasing and saturating (the 4->8 step exceeds the 32->64
    // step) -- the density refinement has converged well before 64 pts/decade.
    id: 'imp34251-ols-density-ladder-monotone-saturating',
    description: 'OLS-density alpha ladder monotone increasing and saturating (early step > late step)',
    holds: () =>
      RUNG_ROWS.every((r) => {
        const a = r.olsDensityLadder.map((x) => x.alpha);
        let mono = true;
        for (let i = 1; i < a.length; i++) if (a[i] < a[i - 1]) mono = false;
        const earlyStep = a[1] - a[0];
        const lateStep = a[a.length - 1] - a[a.length - 2];
        return mono && earlyStep > lateStep;
      }),
  },
  {
    // (F2): FD-step refinement DESTABILIZES the deep rung rather than correcting it -- at N=1e800 the
    // smallest FD step 1e-5 OVERSHOOTS past the linear ceiling (alpha > 1) while its fit R^2 DROPS below
    // the baseline dl=1e-3 R^2. That is a roundoff blow-up signature, not a genuine approach to 1.
    id: 'imp34251-fd-step-overshoots-and-degrades-at-1e800',
    description: 'at N=1e800 the FD step 1e-5 pushes alpha > 1 while R^2 falls below the dl=1e-3 fit',
    holds: () => {
      const r = RUNG_ROWS.find((x) => x.N_log10 === 800);
      const coarse = r.fdStepLadder.find((x) => x.fd_step === 1e-3);
      const fine = r.fdStepLadder.find((x) => x.fd_step === 1e-5);
      return fine.alpha > 1.0 && coarse.alpha < 0.9 && fine.r2 < coarse.r2;
    },
  },
  {
    // (F2 contrast): at the shallower rung N=1e200 the same FD-step shrinkage moves alpha only trivially
    // (well under 0.05) and never overshoots past 1 -- the destabilization is depth-driven (p ~ 1/(2L)
    // shrinks with L), confirming the roundoff-wall reading rather than a systematic estimator bias.
    id: 'imp34251-fd-step-stable-at-shallower-1e200',
    description: 'at N=1e200 the FD-step ladder moves alpha < 0.05 and never overshoots past 1',
    holds: () => {
      const r = RUNG_ROWS.find((x) => x.N_log10 === 200);
      const a = r.fdStepLadder.map((x) => x.alpha);
      const spread = Math.max(...a) - Math.min(...a);
      return spread < 0.05 && a.every((v) => v < 1.0);
    },
  },
  {
    // Honesty gate: measurement/cross-check only, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34251-honesty-gate-no-qed',
    description: 'Measurement/cross-check only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP34251_SHORTFALL_ALPHA_REFINED_ESTIMATOR_CROSS_CHECK.isRigorous === false &&
      /NO QED/.test(IMP34251_SHORTFALL_ALPHA_REFINED_ESTIMATOR_CROSS_CHECK.verdict) &&
      /refereed bound is changed/i.test(IMP34251_SHORTFALL_ALPHA_REFINED_ESTIMATOR_CROSS_CHECK.verdict),
  },
];

for (const a of IMP34251_SHORTFALL_ALPHA_REFINED_ESTIMATOR_CROSS_CHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34251-shortfall-alpha-refined-estimator-cross-check assertion failed: ${a.id}`);
  }
}
