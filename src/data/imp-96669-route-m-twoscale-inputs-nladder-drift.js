/**
 * @module imp-96669-route-m-twoscale-inputs-nladder-drift
 *
 * imp-96669 (numerical, MEASUREMENT): imp-96652 DERIVED the sigmoidal onset of the
 * rank-r lam_max slope as the top-eigenpair weight share of a two-scale spectrum,
 * with width k = 1/ln(lam1/lam2) and half-saturation r0 = ln((1-w1)/w1)/ln(lam1/lam2),
 * but its VERDICT flagged that it produces NO N-asymptotics for the two spectral inputs
 * themselves -- the top-eigenvector overlap w1 = <e_1, v_1>^2 (~9.8% -> 7.8% over
 * N=1000..3000) and the top gap ratio lam1/lam2 (~2.79 -> 2.45). This ticket EXTENDS the
 * full symmetric eigendecomposition ladder (numpy.linalg.eigh on the SAME exact Vasyunin
 * Gram G_hk = gcd(h,k) I(h/g,k/g)/(hk) as imp-96105 / imp-96443 / imp-96612 / imp-96652)
 * to N = 4000, 5000, 6000 and MEASURES whether w1 and lam1/lam2 converge (fixing k and r0
 * asymptotically) or keep drifting.
 *
 * -------------------------------------------------------------------------------
 * WHAT WAS MEASURED (tmp/imp-96669-spectral-ladder-extend.py, reproducible).
 * -------------------------------------------------------------------------------
 * The N=1000..3000 rows reproduce imp-96652 to 5 digits (control). Extending the ladder:
 *
 *   N      lam1      lam2     gap=lam1/lam2   w1        twoScale r0   twoScale k
 *   1000   5.49552   1.96951   2.7903         0.09805   2.1625        0.9745
 *   2000   5.73392   2.23447   2.5661         0.08448   2.5286        1.0611
 *   3000   5.86165   2.38769   2.4549         0.07770   2.7547        1.1135
 *   4000   5.94745   2.49529   2.3835         0.07333   2.9206        1.1513
 *   5000   6.01141   2.57804   2.3318         0.07016   3.0524        1.1812
 *   6000   6.06204   2.64513   2.2918         0.06771   3.1622        1.2058
 *
 * BOTH inputs KEEP DRIFTING monotonically over N=1000..6000:
 *   - w1 decreases 9.81% -> 6.77%; consecutive steps shrink (-0.0136, -0.0068, -0.0044,
 *     -0.0032, -0.0025) but do NOT vanish (the 5000->6000 step is still ~3.6% of the value).
 *   - gap decreases 2.7903 -> 2.2918; steps shrink (-0.224, -0.111, -0.071, -0.052, -0.040)
 *     but likewise do not vanish.
 * A log-linear DRIFT fits both cleanly (w1: slope -0.01692/ln N, R2 0.9946; gap: slope
 * -0.27780/ln N, R2 0.9942). A power-law-to-a-limit form y = c + b N^(-p) fits equally well
 * (R2 = 1.0000) but only with a very slow exponent p ~ 0.28-0.29, so its extrapolated limits
 * (w1* ~ 0.021, gap* ~ 1.56) are essentially UNIDENTIFIED over this range -- not distinguishable
 * from continued drift. No fixed w1 or fixed gap is supported by the data.
 *
 * -------------------------------------------------------------------------------
 * CONSEQUENCE FOR THE imp-96636 measured k=0.86, r0=2.94.
 * -------------------------------------------------------------------------------
 * The two-scale DERIVED quantities do NOT stabilize: r0 climbs monotonically 2.16 -> 3.16 and
 * k climbs 0.97 -> 1.21 as N goes 1000 -> 6000. imp-96652 reported r0 "climbing toward the
 * measured 2.94 (2.75 at N=3000, within ~10%)"; the extended ladder shows the trend does NOT
 * stop there -- the two-scale r0 CROSSES 2.94 near N ~ 4000 (2.92 at 4000, 3.05 at 5000, 3.16
 * at 6000) and OVERSHOOTS it, and k overshoots 0.86 already by N=1000. So the ~10% agreement at
 * N=3000 was a coincidental CROSSING, not convergence: the imp-96636 measured (2.94, 0.86) are
 * NOT asymptotic limits of the lam2-bulk two-scale form. They remain the best truncated-ladder
 * (NMAX up to 6000) log-slope-fraction fit values (imp-96636 fit the actual b_r/L, which is more
 * delayed than the lam2-bulk share, giving 2.94/0.86; the lam2-bulk two-scale proxy here climbs
 * PAST them). The two forms agree only near a crossing, not in a common N-limit.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Over the measured range N=1000..6000, w1 and lam1/lam2 both KEEP DRIFTING (monotone down);
 * neither converges to an identifiable constant, and the derived two-scale (r0, k) climb
 * monotonically and OVERSHOOT the imp-96636 measured (2.94, 0.86) rather than settling on them.
 * The imp-96652 "climbing toward 2.94" reading does not survive the extension: 2.94 and 0.86 are
 * NOT limits of the two-scale form. This leaves IMP96669_SUBGAP open: no N-asymptotics for w1 or
 * the gap ratio are established -- a spectral-edge growth-rate theorem for the multiplicative
 * Vasyunin / Dirichlet-Bohr Gram is still required. Measurement only; no closed form for the
 * 0.3526 coefficient; changes no bound; no operator positivity; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-96652-route-m-lammax-sigmoid-onset-spectral-derivation.js (the two-scale derivation this measures the inputs of)
 * @see imp-96636-route-m-lammax-slope-saturation-fit.js (the measured logistic 2.94/0.86)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max = 3.0247 + 0.3526 log N)
 *
 * Ticket: imp-96669 (numerical, opus-4-8, api-pool). Measurement; NO QED.
 */

// imp-96636 EMPIRICAL logistic whose two-scale spectral inputs this ladder tracks.
export const IMP96669_MEASURED_LOGISTIC = Object.freeze({ r0: 2.940802, k: 0.863214 });

// Per-N two-scale spectral inputs of G_N (numpy eigh, tmp/imp-96669-spectral-ladder-extend.py).
// N=1000..3000 reproduce imp-96652 IMP96652_SPECTRAL_ROWS to 5 digits (control); 4000..6000 new.
export const IMP96669_LADDER_ROWS = Object.freeze(
  [
    { N: 1000, lam1: 5.49552, lam2: 1.96951, gap: 2.7903, w1: 0.09805, twoScaleR0: 2.1625, twoScaleK: 0.9745 },
    { N: 2000, lam1: 5.73392, lam2: 2.23447, gap: 2.5661, w1: 0.08448, twoScaleR0: 2.5286, twoScaleK: 1.0611 },
    { N: 3000, lam1: 5.86165, lam2: 2.38769, gap: 2.4549, w1: 0.07770, twoScaleR0: 2.7547, twoScaleK: 1.1135 },
    { N: 4000, lam1: 5.94745, lam2: 2.49529, gap: 2.3835, w1: 0.07333, twoScaleR0: 2.9206, twoScaleK: 1.1513 },
    { N: 5000, lam1: 6.01141, lam2: 2.57804, gap: 2.3318, w1: 0.07016, twoScaleR0: 3.0524, twoScaleK: 1.1812 },
    { N: 6000, lam1: 6.06204, lam2: 2.64513, gap: 2.2918, w1: 0.06771, twoScaleR0: 3.1622, twoScaleK: 1.2058 },
  ].map((row) => Object.freeze(row)),
);

// Consecutive-step deltas: shrinking (deceleration) but NON-vanishing => still drifting.
export const IMP96669_STEPS = Object.freeze({
  w1: Object.freeze([-0.01357, -0.00678, -0.00437, -0.00317, -0.00245]),
  gap: Object.freeze([-0.22419, -0.11117, -0.07148, -0.05169, -0.04]),
});

// N-dependence fits over the EXTENDED ladder N=1000..6000.
export const IMP96669_NFITS = Object.freeze({
  w1LogLinSlope: -0.01692, // per ln N
  w1LogLinR2: 0.9946,
  gapLogLinSlope: -0.2778, // per ln N
  gapLogLinR2: 0.9942,
  // power-law-to-a-limit y = c + b N^(-p): fits R2=1.0000 but p is slow and the limit unidentified
  w1PowerLimit: 0.02115,
  w1PowerExp: 0.28,
  gapPowerLimit: 1.56075,
  gapPowerExp: 0.29,
  note:
    'both inputs fit a log-linear drift and a slow (p~0.28) power-to-a-limit equally well; ' +
    'over N=1000..6000 the power limits are unidentified and no fixed w1 or gap is supported.',
});

export const IMP96669_VERDICT = Object.freeze({
  question:
    'do the imp-96652 two-scale spectral inputs w1 (top-eigenvector overlap ~8%) and lam1/lam2 ' +
    '(top gap ratio) converge with N -- fixing the sigmoid width k and half-saturation r0 ' +
    'asymptotically -- or keep drifting, on an extended Vasyunin Gram eigendecomposition ladder?',
  w1Converges: false,
  gapConverges: false,
  bothStillDrifting: true, // monotone down over N=1000..6000, steps shrink but do not vanish
  twoScaleR0Overshoots294: true, // r0 climbs 2.16 -> 3.16, crosses 2.94 near N~4000
  twoScaleKOvershoots086: true, // k climbs 0.97 -> 1.21, already above 0.86 by N=1000
  measuredAreLimits: false, // 2.94 / 0.86 are NOT limits of the lam2-bulk two-scale form
  anyBoundMoved: false,
  conclusion:
    'DRIFT, not convergence. Over N=1000..6000 the top-eigenvector overlap w1 falls monotonically ' +
    '9.81% -> 6.77% and the top gap ratio lam1/lam2 falls 2.7903 -> 2.2918; consecutive steps ' +
    'decelerate but stay nonzero (the 5000->6000 w1 step is still ~3.6% of the value), and a ' +
    'log-linear drift fits as well as a slow (p~0.28) power-to-a-limit whose limit is unidentified. ' +
    'Consequently the DERIVED two-scale r0 = ln((1-w1)/w1)/ln(lam1/lam2) climbs monotonically ' +
    '2.16 -> 3.16 and k = 1/ln(lam1/lam2) climbs 0.97 -> 1.21, OVERSHOOTING the imp-96636 measured ' +
    '(r0=2.94, k=0.86): the r0 curve crosses 2.94 near N~4000 and keeps rising, so the imp-96652 ' +
    '"climbing toward 2.94" reading was a coincidental crossing, not a limit. The imp-96636 (2.94, ' +
    '0.86) are truncated-ladder b_r/L fit values, not asymptotic limits of the two-scale inputs. ' +
    'IMP96669_SUBGAP (N-asymptotics of w1 and the gap ratio) stays open. No bound moved; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96669_SUBGAP = Object.freeze({
  id: 'imp-96669-twoscale-inputs-w1-and-gap-drift-no-established-nlimit',
  statement:
    'the imp-96652 two-scale spectral inputs -- top-eigenvector overlap w1 = <e_1, v_1>^2 and top ' +
    'gap ratio lam1/lam2 of the Vasyunin Gram -- both DRIFT monotonically over N=1000..6000 with no ' +
    'identifiable N-limit (log-linear drift and a slow p~0.28 power-to-a-limit are indistinguishable ' +
    'on this range), so the sigmoid width k and half-saturation r0 built from them are NOT fixed ' +
    'asymptotically: they overshoot the imp-96636 measured (2.94, 0.86). Establishing an N-limit ' +
    'requires a spectral-edge growth-rate theorem for the multiplicative Vasyunin / Dirichlet-Bohr Gram.',
});

export const IMP96669_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only (numpy eigh, ' +
  'tmp/imp-96669-spectral-ladder-extend.py, same exact V-table as imp-96105/96443/96612/96652). ' +
  'The two-scale inputs w1 and lam1/lam2 keep DRIFTING over N=1000..6000 (monotone down, steps ' +
  'shrink but do not vanish); the derived two-scale r0 and k climb monotonically and OVERSHOOT the ' +
  'imp-96636 measured 2.94 / 0.86 rather than converging to them, so those are NOT asymptotic ' +
  'limits. No closed form for the 0.3526 coefficient; no bound moved; no operator positivity.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96669_ASSERTIONS = [
  {
    id: 'imp96669-reproduces-imp96652-control',
    holds: () => {
      const r = IMP96669_LADDER_ROWS;
      return (
        Math.abs(r[0].w1 - 0.09805) < 1e-4 &&
        Math.abs(r[2].w1 - 0.0777) < 1e-4 &&
        Math.abs(r[0].gap - 2.7903) < 1e-3 &&
        Math.abs(r[2].gap - 2.4549) < 1e-3
      );
    },
    why: 'the N=1000..3000 rows reproduce the imp-96652 measured w1 and gap to 4 digits (same exact Gram, control).',
  },
  {
    id: 'imp96669-both-inputs-drift-monotone-down',
    holds: () => {
      const r = IMP96669_LADDER_ROWS;
      for (let i = 1; i < r.length; i++) {
        if (!(r[i].w1 < r[i - 1].w1)) return false;
        if (!(r[i].gap < r[i - 1].gap)) return false;
      }
      return r[5].w1 < 0.07 && r[5].gap < 2.3;
    },
    why: 'both w1 and lam1/lam2 decrease monotonically across all six rungs N=1000..6000 -- the drift continues, no plateau.',
  },
  {
    id: 'imp96669-steps-shrink-but-nonvanishing',
    holds: () => {
      const s = IMP96669_STEPS.w1;
      for (let i = 1; i < s.length; i++) {
        if (!(Math.abs(s[i]) < Math.abs(s[i - 1]))) return false; // decelerating
      }
      return Math.abs(s[s.length - 1]) > 0.002; // but the last step is still non-negligible
    },
    why: 'the consecutive w1 steps decelerate but the 5000->6000 step (~0.00245) is still ~3.6% of the value -- deceleration, not convergence.',
  },
  {
    id: 'imp96669-twoscale-overshoots-measured',
    holds: () => {
      const r = IMP96669_LADDER_ROWS;
      // twoScale r0 climbs monotonically and crosses/overshoots the measured 2.94
      for (let i = 1; i < r.length; i++) {
        if (!(r[i].twoScaleR0 > r[i - 1].twoScaleR0)) return false;
        if (!(r[i].twoScaleK > r[i - 1].twoScaleK)) return false;
      }
      return (
        r[2].twoScaleR0 < IMP96669_MEASURED_LOGISTIC.r0 && // 2.75 at N=3000 below
        r[5].twoScaleR0 > IMP96669_MEASURED_LOGISTIC.r0 && // 3.16 at N=6000 above -> crossing
        r[0].twoScaleK > IMP96669_MEASURED_LOGISTIC.k // k above 0.86 already at N=1000
      );
    },
    why: 'the derived two-scale r0 and k climb monotonically; r0 crosses the measured 2.94 near N~4000 and overshoots, so 2.94/0.86 are not limits of the two-scale form.',
  },
  {
    id: 'imp96669-honesty-gate-no-qed',
    holds: () =>
      IMP96669_VERDICT.w1Converges === false &&
      IMP96669_VERDICT.gapConverges === false &&
      IMP96669_VERDICT.bothStillDrifting === true &&
      IMP96669_VERDICT.measuredAreLimits === false &&
      IMP96669_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96669_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96669_HONEST_BANNER) &&
      /RH open/.test(IMP96669_HONEST_BANNER) &&
      /drift-no-established-nlimit/.test(IMP96669_SUBGAP.id),
    why: 'measurement only: both inputs drift with no established N-limit, the two-scale (r0,k) overshoot the measured targets, no bound moved, and the honesty markers plus the open sub-gap are present.',
  },
];

for (const a of IMP96669_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96669-route-m-twoscale-inputs-nladder-drift assertion failed: ${a.id}`,
    );
  }
}

export default {
  measuredLogistic: IMP96669_MEASURED_LOGISTIC,
  ladderRows: IMP96669_LADDER_ROWS,
  steps: IMP96669_STEPS,
  nFits: IMP96669_NFITS,
  verdict: IMP96669_VERDICT,
  subGap: IMP96669_SUBGAP,
  banner: IMP96669_HONEST_BANNER,
};
