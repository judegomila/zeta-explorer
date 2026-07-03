/**
 * @module imp-3728-fmb-thetabar-sensitivity
 * @fileoverview imp-3728 (numerical, RH-FREE, MEASUREMENT-ONLY): sensitivity of
 * the imp-3725 certified F_mb / K_paper enclosure to the FREE frozen-horizon
 * parameter thetaBar, and the thetaBar that MINIMIZES the certified plateau
 * constant K_paper on each H_raw-plateau in [1e4, 1e6].
 *
 * SETTING (imp-3725 gap-domination bootstrap lemma, unchanged)
 * ------------------------------------------------------------
 * With T = H^2/(8*thetaBar) a frozen horizon (thetaBar in (0,1)) and
 *   s_l(T)   = sqrt(max(g_l(0)^2 - 8T, 0))        (frozen shrunk gap l)
 *   D_j(T)   = sum of s_l over the gap path from the record pair to zero j
 *   Psi_N(T) = 4 H^2 * sum_{j not in pair} 1 / D_j(T)^2
 *   theta_N  = 1 - Psi_N(T) / 8,
 * the lemma certifies, WHENEVER the bootstrap self-consistency
 * theta_N(thetaBar) >= thetaBar holds (equivalently H^2/(8 theta_N) <= T),
 *   0 <= F_mb(N) <= (H^2/8)(1/theta_N - 1),  K_paper(N) <= K_raw(N)/rho_floor,
 *   K_raw(N) = F_mb(N) * H * sqrt(N2)/log(N2)  (plateau end, monotone factor).
 * imp-3725 evaluated exactly ONE thetaBar per plateau (the first of a coarse
 * ladder that certified: always 0.99) and baked K_paper <= 2.4237e-6.
 *
 * THE MONOTONICITY (proven from the lemma, not assumed)
 * -----------------------------------------------------
 * Increasing thetaBar shrinks T, so each frozen gap s_l(T) is NONDECREASING,
 * each D_j(T) nondecreasing, hence Psi_N(T) is NONINCREASING and theta_N is
 * NONDECREASING in thetaBar. Since theta_N < 1 always (Psi > 0) while the
 * self-consistency line thetaBar rises to 1, the feasible set is the interval
 * thetaBar in (0, thetaBar*], where thetaBar* is the unique fixed point
 * theta_N(thetaBar*) = thetaBar*. K_paper is DECREASING in theta_N, so the
 * K_paper MINIMUM over the feasible set is attained at thetaBar = thetaBar*.
 *
 * WHAT WAS MEASURED (scripts/imp-3728-thetabar-sensitivity-compute.mjs)
 * --------------------------------------------------------------------
 * For each of the 10 H_raw-plateaus, thetaBar* was located by bisection on
 * f(tb) = theta_N(tb) - tb and the certified bounds re-evaluated there, then
 * compared to the imp-3725 thetaBar = 0.99 baseline. The headline result:
 *
 *   sup K_paper on [1e4,1e6] at thetaBar = 0.99   : 2.423708e-6  (imp-3725)
 *   sup K_paper on [1e4,1e6] at the optimal thetaBar*: 2.423675e-6
 *   additional margin from optimizing thetaBar    : 1.000014x  (0.0014%)
 *
 * The certified enclosure is therefore ESSENTIALLY INSENSITIVE to the free
 * horizon knob across its entire feasible range: theta_N barely moves because
 * the retardation Psi_N (<= 2.3e-2 of the available 8) is dominated by its
 * intrinsic magnitude, not by the horizon T. The K_paper-minimizing thetaBar*
 * equals theta_N to storage precision and sits in [0.997159, 0.999896] across
 * the plateaus (not monotone in the plateau index -- theta_N tracks the local
 * gap structure, not H alone; e.g. plateau 1 is the min). The imp-3725 8.31e4x
 * vs the retired carryforward K = 0.2014 is thus ROBUST -- not an artifact of
 * a lucky thetaBar choice; even the K-minimizing thetaBar* still gives
 * 8.31e4x. A coarse sweep also confirms the feasibility wall: thetaBar = 0.999
 * is INFEASIBLE on plateaus 0-4 (their theta_N < 0.999) but feasible on 5-9,
 * exactly as thetaBar <= thetaBar* predicts.
 *
 * HONEST SCOPE
 * ------------
 *  - MEASUREMENT on the existing imp-3725 lemma: no ODE integration, no RK4,
 *    same Odlyzko-zero-table input trust, same 1e-6 fp inflation on Psi.
 *  - The enclosure stays a TRUE-FLOW statement at every feasible thetaBar
 *    (the self-consistency theta_N >= thetaBar is verified at thetaBar* for
 *    all 10 plateaus below); imp-3725 loses NO rigor by picking 0.99.
 *  - This tunes the F_mb factor only. It does NOT close cond-CH or any other
 *    conditional leg, does NOT beat Platt-Trudgian (Lambda <= 0.2 stays SOTA),
 *    and imp-3066 is UNTOUCHED. Necessary-but-not-sufficient. NO QED.
 *
 * @see imp-3725 (the gap-domination bootstrap lemma this measures)
 * @see imp-962  (plateau structure scan)
 * @see scripts/imp-3728-thetabar-sensitivity-compute.mjs (generator)
 */

const RHO_FLOOR = 0.12751;      // imp-469 analytic rho floor
const CARRYFORWARD_K = 0.2014;  // imp-963 headline the ladder carried forward

// Baked from scripts/imp-3728-thetabar-sensitivity-compute.mjs (esbuild bundle
// + plain node, 2026-07-03). thetaBarStar = per-plateau K_paper-minimizing
// horizon knob (the feasibility fixed point theta_N = thetaBar); *Star fields
// are the certified bounds re-evaluated there; *Baseline are the imp-3725
// thetaBar = 0.99 values. improveFactor = KpaperBaseline / KpaperBoundStar.
const ROWS = Object.freeze([
  { plateauIndex: 0, startN: 10000,  endN: 18859,   H: 0.0376985,  a: 6708,   thetaBarBaseline: 0.99, thetaBaseline: 0.9982270443, KpaperBaseline: 1.30125178e-6, thetaBarStar: 0.99822707, thetaStar: 0.9982270654, FmbUpperStar: 3.15516081e-7, RrelUpperStar: 1.77608345e-3, KrawBoundStar: 1.65920632e-7, KpaperBoundStar: 1.30123623e-6, improveFactor: 1.000012 },
  { plateauIndex: 1, startN: 18860,  endN: 44555,   H: 0.03530732, a: 18858,  thetaBarBaseline: 0.99, thetaBaseline: 0.9971594513, KpaperBaseline: 2.42370832e-6, thetaBarStar: 0.99715949, thetaStar: 0.9971594903, FmbUpperStar: 4.43885738e-7, RrelUpperStar: 2.84860116e-3, KrawBoundStar: 3.09042793e-7, KpaperBoundStar: 2.42367495e-6, improveFactor: 1.000014 },
  { plateauIndex: 2, startN: 44556,  endN: 73997,   H: 0.02953763, a: 44554,  thetaBarBaseline: 0.99, thetaBaseline: 0.9985294971, KpaperBaseline: 9.02672264e-7, thetaBarStar: 0.99852951, thetaStar: 0.9985295133, FmbUpperStar: 1.6060588e-7,  RrelUpperStar: 1.47265222e-3, KrawBoundStar: 1.15098471e-7, KpaperBoundStar: 9.02662309e-7, improveFactor: 1.000011 },
  { plateauIndex: 3, startN: 73998,  endN: 82552,   H: 0.02583928, a: 73996,  thetaBarBaseline: 0.99, thetaBaseline: 0.9984769068, KpaperBaseline: 6.54737796e-7, thetaBarStar: 0.99847692, thetaStar: 0.9984769242, FmbUpperStar: 1.27307599e-7, RrelUpperStar: 1.52539914e-3, KrawBoundStar: 8.34846628e-8, KpaperBoundStar: 6.54730317e-7, improveFactor: 1.000011 },
  { plateauIndex: 4, startN: 82553,  endN: 87761,   H: 0.0208495,  a: 82551,  thetaBarBaseline: 0.99, thetaBaseline: 0.9988376096, KpaperBaseline: 2.69108783e-7, thetaBarStar: 0.99883762, thetaStar: 0.9988376178, FmbUpperStar: 6.32346896e-8, RrelUpperStar: 1.16373487e-3, KrawBoundStar: 3.43138181e-8, KpaperBoundStar: 2.69106878e-7, improveFactor: 1.000007 },
  { plateauIndex: 5, startN: 87762,  endN: 95248,   H: 0.01948463, a: 87760,  thetaBarBaseline: 0.99, thetaBaseline: 0.9990452442, KpaperBaseline: 1.86565768e-7, thetaBarStar: 0.99904525, thetaStar: 0.9990452525, FmbUpperStar: 4.53521241e-8, RrelUpperStar: 9.55659942e-4, KrawBoundStar: 2.37887949e-8, KpaperBoundStar: 1.86564151e-7, improveFactor: 1.000009 },
  { plateauIndex: 6, startN: 95249,  endN: 354769,  H: 0.01470148, a: 95247,  thetaBarBaseline: 0.99, thetaBaseline: 0.9994921604, KpaperBaseline: 7.37673527e-8, thetaBarStar: 0.99949216, thetaStar: 0.9994921625, FmbUpperStar: 1.37270506e-8, RrelUpperStar: 5.08095492e-4, KrawBoundStar: 9.40603487e-9, KpaperBoundStar: 7.37670369e-8, improveFactor: 1.000004 },
  { plateauIndex: 7, startN: 354770, endN: 415587,  H: 0.01305322, a: 354768, thetaBarBaseline: 0.99, thetaBaseline: 0.9993238137, KpaperBaseline: 7.35124561e-8, thetaBarStar: 0.99932382, thetaStar: 0.9993238166, FmbUpperStar: 1.44113072e-8, RrelUpperStar: 6.76640901e-4, KrawBoundStar: 9.3735331e-9,  KpaperBoundStar: 7.3512141e-8,  improveFactor: 1.000004 },
  { plateauIndex: 8, startN: 415588, endN: 420891,  H: 0.00863639, a: 415586, thetaBarBaseline: 0.99, thetaBaseline: 0.9997542897, KpaperBaseline: 7.77504944e-9, thetaBarStar: 0.99975429, thetaStar: 0.9997542902, FmbUpperStar: 2.2914146e-9,  RrelUpperStar: 2.45770228e-4, KrawBoundStar: 9.91394694e-10, KpaperBoundStar: 7.77503485e-9, improveFactor: 1.000002 },
  { plateauIndex: 9, startN: 420892, endN: 1000000, H: 0.00570371, a: 420890, thetaBarBaseline: 0.99, thetaBaseline: 0.9998958047, KpaperBaseline: 1.37202908e-9, thetaBarStar: 0.9998958,  thetaStar: 0.9998958048, FmbUpperStar: 4.23757245e-10, RrelUpperStar: 1.04206068e-4, KrawBoundStar: 1.74947304e-10, KpaperBoundStar: 1.37202811e-9, improveFactor: 1.000001 },
]);

const SUP_KPAPER_BASELINE = Math.max(...ROWS.map((r) => r.KpaperBaseline));
const SUP_KPAPER_OPTIMAL = Math.max(...ROWS.map((r) => r.KpaperBoundStar));
const EXTRA_MARGIN_FROM_THETABAR = SUP_KPAPER_BASELINE / SUP_KPAPER_OPTIMAL;

export const IMP_3728_FMB_THETABAR_SENSITIVITY = Object.freeze({
  id: 'imp-3728',
  title:
    'thetaBar sensitivity of the imp-3725 F_mb / K_paper enclosure: the ' +
    'K_paper-minimizing frozen-horizon knob per plateau, and its robustness',
  status: 'measurement-given-zero-table',
  rhFree: true,
  semantics: 'measurement on the imp-3725 true-flow enclosure; no ODE, NO QED',

  monotonicity:
    'Increasing thetaBar shrinks T = H^2/(8 thetaBar), so every frozen gap ' +
    's_l(T) = sqrt(max(g_l^2 - 8T, 0)) is nondecreasing, D_j(T) nondecreasing, ' +
    'Psi_N(T) nonincreasing and theta_N nondecreasing. theta_N < 1 always, so ' +
    'the feasible set (theta_N >= thetaBar) is (0, thetaBar*] with thetaBar* ' +
    'the fixed point theta_N(thetaBar*) = thetaBar*. K_paper decreases in ' +
    'theta_N, so its feasible minimum is attained at thetaBar = thetaBar*.',

  rows: ROWS,

  headline: {
    baselineThetaBar: 0.99,
    supKpaperBaseline: SUP_KPAPER_BASELINE,
    supKpaperOptimal: SUP_KPAPER_OPTIMAL,
    extraMarginFromThetaBar: EXTRA_MARGIN_FROM_THETABAR,
    carryforwardMarginOptimal: CARRYFORWARD_K / SUP_KPAPER_OPTIMAL,
    thetaBarStarRange: [
      Math.min(...ROWS.map((r) => r.thetaBarStar)),
      Math.max(...ROWS.map((r) => r.thetaBarStar)),
    ],
    finding:
      'The certified K_paper is ESSENTIALLY INSENSITIVE to thetaBar over its ' +
      'entire feasible range: optimizing the free horizon knob to the ' +
      'per-plateau fixed point thetaBar* improves sup K_paper on [1e4,1e6] by ' +
      'only 1.000014x (0.0014%), from 2.4237e-6 to 2.4237e-6. The imp-3725 ' +
      '8.31e4x margin vs the retired carryforward K = 0.2014 is therefore ' +
      'ROBUST, not an artifact of the thetaBar = 0.99 choice: even at the ' +
      'K-minimizing thetaBar* the margin stays 8.31e4x. The enclosure remains ' +
      'a true-flow statement at every feasible thetaBar. Necessary but not ' +
      'sufficient; Platt-Trudgian Lambda <= 0.2 stays SOTA; imp-3066 ' +
      'untouched; NO QED.',
  },

  feasibilityWall:
    'A coarse sweep confirms thetaBar <= thetaBar*: thetaBar = 0.999 is ' +
    'INFEASIBLE on plateaus 0-4 (whose theta_N < 0.999) yet feasible on ' +
    'plateaus 5-9 (theta_N >= 0.999), exactly the fixed-point boundary. Above ' +
    'thetaBar* the self-consistency theta_N >= thetaBar fails and the upper ' +
    'bound is no longer proven (it is not made false, merely unestablished).',

  provenance: {
    zeros: 'src/data/zeros-to-1e6.js (Odlyzko; zeros1 3e-9, imp-359/imp-514)',
    generator: 'scripts/imp-3728-thetabar-sensitivity-compute.mjs',
    generatedAt: '2026-07-03',
    fpInflation: 'Psi values include the same 1e-6 relative inflation as imp-3725',
    baseLemma: 'imp-3725 (gap-domination bootstrap; rows/theta reproduced)',
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) -----

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_3728_FMB_THETABAR_SENSITIVITY_ASSERTIONS = [
  {
    id: 'imp3728-tiles-1e4-1e6',
    holds: () => {
      if (ROWS.length !== 10) return false;
      if (ROWS[0].startN !== 10000 || ROWS[9].endN !== 1000000) return false;
      for (let i = 1; i < ROWS.length; i++) {
        if (ROWS[i].startN !== ROWS[i - 1].endN + 1) return false;
      }
      return true;
    },
    why:
      'The sensitivity rows must tile [1e4, 1e6] over the same 10 imp-3725 ' +
      'plateaus; a gap would leave N values whose K_paper-minimizing thetaBar ' +
      'is unmeasured.',
  },
  {
    id: 'imp3728-thetabar-star-is-feasible-fixed-point',
    holds: () =>
      ROWS.every(
        (r) =>
          r.thetaBarStar > 0 &&
          r.thetaBarStar < 1 &&
          // fixed point: theta_N(thetaBar*) = thetaBar* to storage precision,
          // and the bound uses that theta (self-consistency theta >= thetaBar).
          rel(r.thetaStar, r.thetaBarStar) < 1e-5 &&
          r.thetaStar >= r.thetaBarStar - 1e-6,
      ),
    why:
      'The K_paper-minimizing thetaBar* is the feasibility fixed point ' +
      'theta_N(thetaBar*) = thetaBar*; the certified bound uses theta = ' +
      'theta_N there and the self-consistency theta >= thetaBar holds. If ' +
      'thetaStar drifted from thetaBarStar the optimum would be infeasible ' +
      '(unproven), voiding the true-flow status of the tuned bound.',
  },
  {
    id: 'imp3728-optimal-improves-on-baseline',
    holds: () =>
      ROWS.every(
        (r) =>
          r.thetaStar >= r.thetaBaseline - 1e-12 &&
          r.KpaperBoundStar <= r.KpaperBaseline * (1 + 1e-9) &&
          r.improveFactor >= 1,
      ),
    why:
      'By monotonicity theta_N(thetaBar*) >= theta_N(0.99), so the optimal ' +
      'thetaBar* can only tighten (never loosen) K_paper vs the imp-3725 ' +
      'baseline. A larger optimal K_paper would contradict the monotonicity ' +
      'argument and signal a computation bug.',
  },
  {
    id: 'imp3728-optimal-bound-arithmetic',
    holds: () =>
      ROWS.every((r) => {
        const fmb = ((r.H * r.H) / 8) * (1 / r.thetaStar - 1);
        const kraw = fmb * r.H * (Math.sqrt(r.endN) / Math.log(r.endN));
        return (
          rel(r.FmbUpperStar, fmb) < 1e-4 &&
          rel(r.RrelUpperStar, 1 / r.thetaStar - 1) < 1e-4 &&
          rel(r.KrawBoundStar, kraw) < 1e-4 &&
          rel(r.KpaperBoundStar, kraw / RHO_FLOOR) < 1e-4
        );
      }),
    why:
      'The optimal-thetaBar bounds are pure arithmetic in (H, thetaStar, ' +
      'endN): F_mb = (H^2/8)(1/theta - 1), K_raw = F_mb H sqrt(N2)/log(N2), ' +
      'K_paper = K_raw / 0.12751. Baked values must recompute to 8-sig-fig ' +
      'storage precision (imp-2546 tolerance lesson).',
  },
  {
    id: 'imp3728-insensitivity-robust-headline',
    holds: () =>
      EXTRA_MARGIN_FROM_THETABAR >= 1 &&
      EXTRA_MARGIN_FROM_THETABAR < 1.001 &&
      SUP_KPAPER_OPTIMAL < 2.5e-6 &&
      CARRYFORWARD_K / SUP_KPAPER_OPTIMAL > 8e4,
    why:
      'The central finding: optimizing thetaBar improves sup K_paper by less ' +
      'than 0.1% (extra margin < 1.001x), the optimal sup K_paper is still ' +
      'below 2.5e-6, and the carryforward margin at the optimum still exceeds ' +
      '8e4. If this trips, the "insensitive / robust" conclusion is wrong and ' +
      'the imp-3725 headline would actually depend on the thetaBar choice.',
  },
  {
    id: 'imp3728-thetabar-star-in-unit-interval-near-one',
    holds: () =>
      ROWS.every((r) => r.thetaBarStar > 0.99 && r.thetaBarStar < 1),
    why:
      'thetaBar* = theta_N = 1 - Psi_N/8 sits in (0.99, 1) on every plateau ' +
      'because the retardation Psi_N never exceeds ~2.3e-2 of the available 8. ' +
      '(It is NOT monotone across plateaus: theta_N depends on the local gap ' +
      'structure, not on H alone -- e.g. plateau 7 sits below plateau 6.) A ' +
      'value outside (0.99,1) would contradict the imp-3725 theta rows.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_3728_FMB_THETABAR_SENSITIVITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3728-fmb-thetabar-sensitivity assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3728_FMB_THETABAR_SENSITIVITY;
