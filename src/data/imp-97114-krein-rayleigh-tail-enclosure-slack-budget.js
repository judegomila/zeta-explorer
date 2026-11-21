/**
 * @fileoverview imp-97114 -- ESTIMATION: the two enclosure-slack budgets that imp-97100 left uncomputed for
 * the Route B phase-preserving interval majorant of the Krein Rayleigh tail <v0|R_T|v0>, at the binding
 * N=100, 2a=ln3, T=4800 rung -- the Gauss panel remainder over [T,Tfar] and the interval spherical-Bessel
 * phase-enclosure width -- bounding the achievable majorant above the imp-96888 quadrature-to-actual floor
 * and locating the T that minimises floor+slack (SUB-GAP IMP96888_RAYLEIGH_TAIL_MAJORANT).
 *
 * CONTEXT. imp-97100 established that the tightest reachable rigorous majorant for the min-max Rayleigh tail
 *   <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |g(t)|^2 dt,   g(t) = v0 . Phih(t),
 * is bounded BELOW by the imp-96888 quadrature-to-actual ratio (the "floor": 1.1734x at T=4800, 1.2292x at
 * T=6400, 2.2422x at T=9600) PLUS two enclosure-slack terms it explicitly did NOT compute:
 *   (i)  the Gauss panel remainder for the interval quadrature over each tail panel [t_i,t_{i+1}] in [T,Tfar];
 *   (ii) the interval spherical-Bessel enclosure width for g(t) treated as ONE phase-preserving entity.
 * This leaf ESTIMATES both, from the committed literals only (no solver run), and answers where the achievable
 * majorant sits above the floor and which T minimises floor+slack.
 *
 * THE OSCILLATION SCALE (fixed by a). Each spherical-Bessel mode j_k(a t) oscillates at angular frequency a;
 * the HARD factor |g(t)|^2 is a product of two such factors, so its dominant angular frequency is
 *   omega = 2a = ln3 = 1.0986...  (wavelength lambda = 2 pi / omega = 5.7192),
 * and a panel of width h advances the |g|^2 phase by dphi = omega h. The imp-96888 driver used panel=1.5, i.e.
 * dphi = 1.6479 rad ~ 0.262 wavelength per panel -- coarse for a phase-preserving enclosure.
 *
 * BUDGET (i) -- GAUSS PANEL REMAINDER: NEGLIGIBLE, NOT BINDING. For an n-point Gauss-Legendre rule on a panel
 * of width h and an oscillatory integrand f ~ cos(omega t), the relative remainder per panel is
 *   eps_gauss(n,h) ~ (1/2) (omega h / 2)^{2n} (n!)^4 / ((2n+1) [(2n)!]^3).
 * At panel=1.5 (omega h / 2 = 0.824): n=3 gives 7.76e-8 per panel (2.86e-3 summed over the 36800 panels of
 * [4800,60000]), and n=5 gives 2.85e-14 per panel (1.05e-9 summed) -- so a modest Gauss order drives the
 * panel remainder ~10 orders below the ~17% floor. The Gauss remainder is NOT the obstruction.
 *
 * BUDGET (ii) -- BESSEL PHASE-ENCLOSURE WIDTH: BINDING, but controllable. Even a SHARP interval enclosure of
 * g(t) over a panel spans the true variation of the oscillatory amplitude across that panel, so its relative
 * width is ~ dphi = omega h per panel. At panel=1.5 (dphi = 1.65) a single enclosure spans essentially a full
 * oscillation, so |g|^2 encloses to ~its full amplitude^2 and the panel majorant is ~2-3x its true integral --
 * this, not the Gauss remainder, is the slack. To hit a target relative slack eps_bessel one subdivides to
 * h_sub = eps_bessel / omega, giving N_panels ~ (Tfar - T) omega / eps_bessel panels over the tail:
 *   eps_bessel = 0.10 -> h_sub = 0.0910, N = 6.06e5,  achievable @T4800 = 1.291x actual
 *   eps_bessel = 0.05 -> h_sub = 0.0455, N = 1.21e6,  achievable @T4800 = 1.232x actual
 *   eps_bessel = 0.02 -> h_sub = 0.0182, N = 3.03e6,  achievable @T4800 = 1.197x actual
 *   eps_bessel = 0.01 -> h_sub = 0.0091, N = 6.06e6,  achievable @T4800 = 1.185x actual
 * Accumulated double-precision interval rounding is ~1e-16 per panel ~ 1.2e-10 relative over 1.2e6 panels --
 * also NON-BINDING. So the achievable phase-preserving majorant is essentially floor(T) * (1 + eps_bessel),
 * with eps_bessel a chosen precision paid for in panel count, and the Gauss/rounding terms negligible.
 *
 * WHERE THE MAJORANT SITS / WHICH T. Because the FLOOR (quadrature/actual ratio) is smallest at the LOWEST
 * committed rung and rises with T (1.1734 @4800 < 1.2292 @6400 << 2.2422 @9600), and eps_bessel is a
 * T-independent target (the panel count varies only through the mild (Tfar - T) factor, 1.21e6 @4800 vs
 * 1.11e6 @9600), floor+slack in RATIO terms is MINIMISED at T=4800: achievable ~ 1.232x actual at
 * eps_bessel=0.05. (In ABSOLUTE terms the Rayleigh value still shrinks with T -- 5.38e-4 @4800 down to
 * 7.14e-5 @9600 -- so a tighter absolute residual majorant on lambda_min favours larger T, at the price of a
 * worse ratio and a separately-budgeted f(T) core error; that trade is outside this leaf.)
 *
 * VERDICT. The achievable Route B majorant clears the imp-96888 floor by only the Bessel phase-enclosure
 * factor (1 + eps_bessel); the Gauss panel remainder (~1e-9 at n=5) and accumulated rounding (~1e-10) are ~8-10
 * orders below it and NON-BINDING. The single obstruction remains the one imp-97100 named -- certifying, in
 * interval arithmetic, the ~3-order inter-mode phase cancellation of g(t) (SUB-GAP
 * IMP97100_PHASE_CANCELLATION_TRIAL): eps_bessel = omega h_sub is a HEURISTIC slack model for a SHARP
 * enclosure and pre-supposes the phases are kept; the mode-wise split (Route A) still diverges. ESTIMATION
 * ONLY: no interval majorant is produced or claimed; the imp-96888/imp-96973 Rayleigh values stay QUADRATURE
 * evaluations; Rayleigh floors stay UPPER bounds; establishes NO operator positivity; changes NO bound;
 * IMP96888_RAYLEIGH_TAIL_MAJORANT and IMP96749_UNIFORM_N_GAP_UNSETTLED stay open; interval-rigorous reach
 * stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (route assessment; floor + uncomputed slack)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (min-max Rayleigh bound + T-ladder; source literals)
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (three-factor vacuity factorisation; rung values)
 */

import { IMP96888_ROWS } from './imp-96888-krein-tresidual-rayleigh-permode-bound.js';

const LN3 = Math.log(3); // 1.0986122886681098
const A = LN3 / 2; // 0.5493... spherical-Bessel argument scale j_k(a t)
const OMEGA = 2 * A; // = ln3, dominant angular frequency of |g|^2 = product of two Bessel cosines
const LAMBDA = (2 * Math.PI) / OMEGA; // 5.7192 oscillation wavelength of |g|^2
const TFAR = 60000; // imp-96888 driver far cutoff
const PANEL_DEFAULT = 1.5; // imp-96888 driver panel width
const DPHI_DEFAULT = OMEGA * PANEL_DEFAULT; // 1.6479 rad ~ 0.262 wavelength per default panel

function factorial(k) {
  let r = 1;
  for (let i = 2; i <= k; i++) r *= i;
  return r;
}

// (i) n-point Gauss-Legendre relative remainder per panel for f ~ cos(omega t) of width h
function gaussRelErrPerPanel(n, h) {
  const gaussConst = Math.pow(factorial(n), 4) / ((2 * n + 1) * Math.pow(factorial(2 * n), 3));
  return 0.5 * Math.pow((OMEGA * h) / 2, 2 * n) * gaussConst;
}

// (ii) subpanel width and panel count to hit a target Bessel phase-enclosure relative slack eps
function besselBudget(T, eps) {
  const hSub = eps / OMEGA; // dphi_sub = omega h_sub = eps
  const nPanels = (TFAR - T) / hSub;
  return { hSub, nPanels };
}

export const IMP97114_OSC = Object.freeze({
  a: A,
  omega: OMEGA, // = ln3
  wavelength: LAMBDA, // 5.7192
  tfar: TFAR,
  panelDefault: PANEL_DEFAULT,
  dphiDefault: DPHI_DEFAULT, // 1.6479 rad per default panel (coarse for a sharp enclosure)
});

// Gauss panel-remainder budget at the default panel width, over the T=4800 tail
const N_PANELS_DEFAULT = (TFAR - 4800) / PANEL_DEFAULT; // 36800
export const IMP97114_GAUSS = Object.freeze({
  panel: PANEL_DEFAULT,
  nPanelsDefault: N_PANELS_DEFAULT,
  n3PerPanel: gaussRelErrPerPanel(3, PANEL_DEFAULT), // 7.76e-8
  n3Total: gaussRelErrPerPanel(3, PANEL_DEFAULT) * N_PANELS_DEFAULT, // 2.86e-3 (marginal)
  n5PerPanel: gaussRelErrPerPanel(5, PANEL_DEFAULT), // 2.85e-14
  n5Total: gaussRelErrPerPanel(5, PANEL_DEFAULT) * N_PANELS_DEFAULT, // 1.05e-9 (negligible)
  binding: false, // ~10 orders below the ~17% floor at n=5: NOT the obstruction
});

// Bessel phase-enclosure budget vs target relative slack, at the binding T=4800 rung
const FLOOR_4800 = IMP96888_ROWS[4800].rayleighOverActual; // 1.1734
export const IMP97114_BESSEL = Object.freeze(
  [0.1, 0.05, 0.02, 0.01].map((eps) => {
    const b = besselBudget(4800, eps);
    return Object.freeze({
      eps,
      hSub: b.hSub,
      nPanels: b.nPanels,
      achievableAtT4800: FLOOR_4800 * (1 + eps), // floor * (1 + eps_bessel)
    });
  }),
);

// floor + slack across the three committed rungs at a reference eps_bessel = 0.05
const EPS_REF = 0.05;
export const IMP97114_RUNG_SLACK = Object.freeze(
  [4800, 6400, 9600].map((T) => {
    const floor = IMP96888_ROWS[T].rayleighOverActual;
    const b = besselBudget(T, EPS_REF);
    return Object.freeze({
      T,
      floor,
      achievableRatio: floor * (1 + EPS_REF),
      nPanels: b.nPanels,
      absRayleigh: IMP96888_ROWS[T].rayleighV0RT, // absolute quadrature value (shrinks with T)
    });
  }),
);

// accumulated double-precision interval rounding over the eps=0.05, T=4800 subdivision
const ROUNDING_ACCUM = 1e-16 * besselBudget(4800, EPS_REF).nPanels; // ~1.2e-10 relative

export const IMP97114_VERDICT = Object.freeze({
  ticket: 'imp-97114',
  question:
    'estimate the two enclosure-slack budgets imp-97100 left uncomputed -- the Gauss panel remainder over [T,Tfar] and the interval spherical-Bessel phase-enclosure width -- at N=100, 2a=ln3, T=4800, to bound the achievable Route B phase-preserving majorant above the imp-96888 quadrature-to-actual floor and locate the T minimising floor+slack.',
  answer:
    'the achievable majorant is essentially floor(T) * (1 + eps_bessel). The Gauss panel remainder is NON-BINDING: at panel=1.5 an n=5 rule gives 2.85e-14 per panel (1.05e-9 summed over the 36800-panel tail), ~10 orders below the ~17% floor (n=3 is marginal at 2.9e-3). The BINDING budget is the Bessel phase-enclosure width ~ omega h_sub per panel; hitting eps_bessel needs h_sub = eps_bessel/omega and N ~ (Tfar-T) omega / eps_bessel panels (eps=0.05 -> 1.21e6 panels -> 1.232x actual at T=4800). Accumulated interval rounding ~1.2e-10 is also non-binding. Floor+slack in ratio terms is MINIMISED at the lowest committed rung T=4800 (floor 1.1734 rises to 2.2422 at T=9600 while eps_bessel is T-independent), so the achievable phase-preserving majorant sits at ~1.23x actual at T=4800, eps_bessel=0.05. The single remaining obstruction is certifying the ~3-order inter-mode phase cancellation of g(t) in interval arithmetic (SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL); eps_bessel = omega h_sub is a heuristic sharp-enclosure slack model that pre-supposes phases are kept.',
  bindingRung: 'N100-2a-ln3-T4800',
  twoA: LN3,
  N: 100,
  omega: OMEGA,
  gaussRemainderBinding: false, // n=5 -> 1.05e-9 summed, ~10 orders below the floor
  gaussN5TotalRel: IMP97114_GAUSS.n5Total, // 1.05e-9
  besselEnclosureBinding: true, // ~omega h_sub per panel: the binding slack
  roundingAccumRel: ROUNDING_ACCUM, // ~1.2e-10, non-binding
  floorAtT4800: FLOOR_4800, // 1.1734
  achievableAtT4800Eps05: FLOOR_4800 * (1 + EPS_REF), // ~1.2321x actual
  minFloorSlackT: 4800, // ratio floor+slack minimised at the lowest committed rung
  epsBesselIsHeuristic: true, // sharp-enclosure slack model, presupposes phase-preservation (not Route A)
  intervalMajorantProduced: false, // ESTIMATION ONLY
  quadratureNotIntervalMajorant: true, // Rayleigh values remain quadrature evaluations
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open
  phaseCancellationTrialOpen: true, // IMP97100_PHASE_CANCELLATION_TRIAL stays the obstruction
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP96888_RAYLEIGH_TAIL_MAJORANT / IMP97100_PHASE_CANCELLATION_TRIAL -- this leaf only ESTIMATES the two enclosure-slack budgets: the Gauss panel remainder is non-binding (n=5 -> 1.05e-9 summed, ~10 orders below the floor) and the binding budget is the Bessel phase-enclosure width ~omega h_sub, controllable to any eps_bessel at N ~ (Tfar-T) omega / eps_bessel panels. It produces NO interval majorant; eps_bessel = omega h_sub is a heuristic sharp-enclosure model presupposing the ~3-order phase cancellation of g(t) is certified (the still-open obstruction), else the mode-wise split diverges (Route A).',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97114_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97114_ASSERTIONS = [
  {
    id: 'imp97114-osc-scale-ln3',
    holds: () =>
      Math.abs(IMP97114_OSC.omega - LN3) < 1e-12 &&
      Math.abs(IMP97114_OSC.wavelength - (2 * Math.PI) / LN3) < 1e-9 &&
      Math.abs(IMP97114_OSC.dphiDefault - LN3 * 1.5) < 1e-9 &&
      IMP97114_OSC.dphiDefault > 1 &&
      IMP97114_OSC.dphiDefault < 2,
    why: 'the dominant |g|^2 angular frequency is omega = 2a = ln3, so the default panel=1.5 advances the phase by ~1.65 rad (~0.26 wavelength) -- coarse for a sharp phase-preserving enclosure.',
  },
  {
    id: 'imp97114-gauss-remainder-non-binding',
    holds: () =>
      IMP97114_GAUSS.n5PerPanel < 1e-12 &&
      IMP97114_GAUSS.n5Total < 1e-6 &&
      IMP97114_GAUSS.n3Total < 1e-2 &&
      IMP97114_GAUSS.n3Total > IMP97114_GAUSS.n5Total &&
      IMP97114_GAUSS.binding === false,
    why: 'an n=5 Gauss rule at panel=1.5 gives 2.85e-14 per panel (1.05e-9 summed over 36800 panels), ~10 orders below the ~17% floor -- the Gauss panel remainder is NOT the binding slack.',
  },
  {
    id: 'imp97114-bessel-budget-monotone',
    holds: () => {
      // finer target eps -> smaller subpanels, more panels, tighter achievable majorant
      for (let i = 1; i < IMP97114_BESSEL.length; i++) {
        const prev = IMP97114_BESSEL[i - 1];
        const cur = IMP97114_BESSEL[i];
        if (!(cur.eps < prev.eps)) return false;
        if (!(cur.hSub < prev.hSub)) return false;
        if (!(cur.nPanels > prev.nPanels)) return false;
        if (!(cur.achievableAtT4800 < prev.achievableAtT4800)) return false;
      }
      const row05 = IMP97114_BESSEL.find((r) => r.eps === 0.05);
      return (
        Math.abs(row05.achievableAtT4800 - FLOOR_4800 * 1.05) < 1e-9 &&
        row05.nPanels > 1e6 &&
        row05.nPanels < 2e6
      );
    },
    why: 'the Bessel phase-enclosure slack ~ omega h_sub is the binding budget: driving eps_bessel down tightens the achievable majorant toward the floor but grows the panel count as (Tfar-T) omega / eps_bessel (eps=0.05 -> ~1.21e6 panels -> 1.232x actual).',
  },
  {
    id: 'imp97114-floor-slack-min-at-lowest-T',
    holds: () => {
      const byT = Object.fromEntries(IMP97114_RUNG_SLACK.map((r) => [r.T, r]));
      // ratio floor+slack minimised at the lowest committed rung; absolute Rayleigh shrinks with T
      return (
        byT[4800].achievableRatio < byT[6400].achievableRatio &&
        byT[6400].achievableRatio < byT[9600].achievableRatio &&
        byT[4800].absRayleigh > byT[6400].absRayleigh &&
        byT[6400].absRayleigh > byT[9600].absRayleigh &&
        IMP97114_VERDICT.minFloorSlackT === 4800 &&
        ROUNDING_ACCUM < 1e-8
      );
    },
    why: 'the quadrature/actual floor rises with T (1.1734 -> 2.2422) while eps_bessel is T-independent, so floor+slack in ratio terms is minimised at T=4800; the absolute Rayleigh value still shrinks with T (a separate trade), and accumulated rounding ~1.2e-10 is non-binding.',
  },
  {
    id: 'imp97114-estimation-only-no-qed',
    holds: () =>
      IMP97114_VERDICT.gaussRemainderBinding === false &&
      IMP97114_VERDICT.besselEnclosureBinding === true &&
      IMP97114_VERDICT.epsBesselIsHeuristic === true &&
      IMP97114_VERDICT.intervalMajorantProduced === false &&
      IMP97114_VERDICT.quadratureNotIntervalMajorant === true &&
      IMP97114_VERDICT.operatorPositivityProved === false &&
      IMP97114_VERDICT.rayleighTailMajorantOpen === true &&
      IMP97114_VERDICT.phaseCancellationTrialOpen === true &&
      IMP97114_VERDICT.uniformNGapSettled === false &&
      IMP97114_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97114_VERDICT.qed === false &&
      typeof IMP97114_VERDICT.subGap === 'string' &&
      IMP97114_VERDICT.subGap.includes('IMP96888_RAYLEIGH_TAIL_MAJORANT') &&
      IMP97114_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL'),
    why: 'estimation done (Gauss remainder non-binding, Bessel enclosure binding+quantified, floor+slack minimiser located), but NO interval majorant is produced, values stay quadrature, no operator positivity, Rayleigh/phase-cancellation/uniform-N gaps open, reach stays 2a<=0.96, no QED.',
  },
];

for (const assertion of IMP97114_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97114-krein-rayleigh-tail-enclosure-slack-budget assertion failed: ${assertion.id}`);
  }
}

void LAMBDA;
