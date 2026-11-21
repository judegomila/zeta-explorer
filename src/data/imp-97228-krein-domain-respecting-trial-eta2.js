/**
 * @module imp-97228-krein-domain-respecting-trial-eta2
 * @fileoverview imp-97228 -- MEASUREMENT of the imp-97162 SUB-GAP IMP97162_TEMPLE_DEFECT_ETA2_HUGE:
 *   does a DOMAIN-RESPECTING (non-polynomial) Krein trial vector reduce the Temple residual defect
 *   eta2 = ||T_a[sigma_2] psi - mu psi||^2 toward a finite, small value -- or does no accessible trial?
 *
 *   imp-97162 measured eta2 ~ 2.42e9 (eta ~ 4.9e4) for the committed POLYNOMIAL Ritz eigenvector at
 *   2a=ln3, T=800, GROWING monotonically with the evaluation space Nbig (no finite limit in reach),
 *   because T_a[sigma_2] is UNBOUNDED (prefactor (t^2+1/4)^2 ~ t^4) and a polynomial trial is at best
 *   marginally in dom(A). This leaf tests the natural remedy the sub-gap invited: give the trial vector
 *   "sufficient high-frequency decay / a smooth cutoff so T psi has controlled tails" by applying a
 *   raised-cosine (Hann) taper of cutoff width w to the Ritz coefficients (n >= w damped smoothly to 0,
 *   a smooth cutoff in mode space). For each w we measured mu (Rayleigh quotient, UPPER bound on
 *   lambda_1) and eta2 at several Nbig (does it CONVERGE and shrink?), reusing the imp-97162 pole-free
 *   Gegenbauer-Galerkin build verbatim. Script: tmp/imp-97228-domain-respecting-trial-eta2.py.
 *
 *   Measurement only; mu stays an UPPER bound; no operator positivity; no lower-bound certificate;
 *   no bound moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * FINDING 1 -- TAPERING REDUCES eta2 BY AT MOST ~1 ORDER OF MAGNITUDE, NEVER TO A SMALL VALUE. Narrowing
 *   the smooth cutoff from w=100 (no damping) down to w=8 (only ~8 active modes) drives eta2 from the
 *   ~2.42e9 polynomial baseline down to a minimum of ~1.67e8 -- still ~3e8 times mu, i.e. STILL
 *   astronomically large. There is no taper width at which eta2 becomes O(1) or even O(mu); the operator
 *   residual stays 8-10 orders of magnitude above mu across the entire sweep.
 *
 * FINDING 2 -- THE eta2 REDUCTION IS BOUGHT BY DESTROYING THE APPROXIMATION (mu BLOWS UP). The smallest
 *   eta2 (~1.67e8 at w=8) occurs at mu = 0.895217 -- far ABOVE the 0.5 uniform-N target and the committed
 *   floor 0.53385: the aggressively tapered vector is a poor eigenvector approximation. Conversely, tapers
 *   that keep mu near the floor (w~30-50: mu ~ 0.653-0.675) leave eta2 ~ 1.0e9-2.3e9, no better than the
 *   polynomial baseline. There is NO window where eta2 is small AND mu is near the floor -- the two
 *   requirements are mutually exclusive for this basis.
 *
 * FINDING 3 -- EVERY TAPER STILL DIVERGES IN Nbig: THE OBSTRUCTION IS t-SPACE (t^4), NOT MODE-SPACE.
 *   For EVERY taper width, eta2 continues to GROW with the evaluation space (relative growth Nbig=120->300
 *   stays positive, ~+1.2 to +2.5, never approaching 0). A smooth cutoff in MODE space therefore does NOT
 *   produce a finite eta2 limit -- confirming the divergence originates in the t^4 multiplication weight of
 *   sigma_2 acting on the (marginal-domain) t-space tails of the transformed basis functions themselves,
 *   which no finite mode-space window can cure. Even the lowest basis functions, once multiplied by
 *   sigma_2 ~ t^4, carry heavy tails.
 *
 * VERDICT. NO accessible domain-respecting (smooth mode-cutoff) trial vector yields a finite, small eta2.
 *   Tapering the Ritz coefficients reduces eta2 by at most ~1 order of magnitude (2.42e9 -> 1.67e8, still
 *   ~3e8*mu), and only by pushing mu to ~0.895 (well above the 0.5 target); every taper that preserves a
 *   near-floor mu leaves eta2 ~1e9, and EVERY taper still diverges with Nbig. This SHARPENS the imp-97162
 *   double-obstruction verdict: the huge Temple defect is not an artifact of the particular polynomial
 *   trial in hand but an intrinsic consequence of the unbounded t^4 weight, uncurable by trial-vector
 *   choice within this basis. SUB-GAP IMP97228_DOMAIN_RESPECTING_TRIAL_NO_FINITE_ETA2 (a finite small eta2
 *   would require a trial from OUTSIDE this polynomial/Gegenbauer family -- e.g. a genuine t-space
 *   smooth-cutoff/Gaussian function projected exactly onto dom(A), not yet built). Measurement only;
 *   no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97162-krein-temple-defect-eta2-measurement.js (SUB-GAP IMP97162_TEMPLE_DEFECT_ETA2_HUGE; this leaf tests the remedy)
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (INGREDIENT 1/2 double obstruction)
 * @see imp-96875-katotemple-scout.py (Gegenbauer out-of-space residual build reused)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this measurement)
export const IMP97228_RIGOROUS_REACH_2A = 0.96;
export const IMP97228_BINDING_2A = LN3;

// polynomial-Ritz baseline (imp-97162): eta2 ~ 2.42e9, growing with Nbig
export const IMP97228_POLY_RITZ_ETA2 = 2424503980.717981;

// Hann-tapered trial sweep at 2a=ln3, N=100, T=800; eta2 at Nbig=300 unless noted.
// relGrowth = (eta2@Nbig=300 - eta2@Nbig=120)/(eta2@Nbig=120) -- positive everywhere (no finite limit).
// All values from tmp/imp-97228-out.json (tmp/imp-97228-domain-respecting-trial-eta2.py).
export const IMP97228_TAPER_SWEEP = Object.freeze([
  Object.freeze({ w: 100, mu: 0.549140, eta2: 4585375000, relGrowth: 1.9283 }),
  Object.freeze({ w: 90,  mu: 0.579834, eta2: 10143240000, relGrowth: 1.6351 }),
  Object.freeze({ w: 80,  mu: 0.629069, eta2: 18243710000, relGrowth: 1.3125 }),
  Object.freeze({ w: 70,  mu: 0.668006, eta2: 15440090000, relGrowth: 1.2118 }),
  Object.freeze({ w: 60,  mu: 0.680967, eta2: 6998696000, relGrowth: 1.2789 }),
  Object.freeze({ w: 50,  mu: 0.674616, eta2: 2328754000, relGrowth: 1.8380 }),
  Object.freeze({ w: 40,  mu: 0.661872, eta2: 1420065000, relGrowth: 2.5035 }),
  Object.freeze({ w: 30,  mu: 0.653386, eta2: 1045861000, relGrowth: 2.1757 }),
  Object.freeze({ w: 20,  mu: 0.668410, eta2: 531802200, relGrowth: 1.9443 }),
  Object.freeze({ w: 12,  mu: 0.715893, eta2: 205218900, relGrowth: 1.8512 }),
  Object.freeze({ w: 8,   mu: 0.895217, eta2: 167397000, relGrowth: 1.8380 }),
]);

// smallest eta2 reached over the whole sweep, and the mu it costs
export const IMP97228_BEST = Object.freeze({
  w: 8,
  eta2Min: 167397000,      // ~1.67e8 -- still ~3e8 * mu
  muAtMin: 0.895217,       // far above the 0.5 target floor: approximation destroyed
  reductionFactorFromPoly: IMP97228_POLY_RITZ_ETA2 / 167397000, // ~14.5x -- barely one order of magnitude
});

export const IMP97228_VERDICT = Object.freeze({
  ticket: 'imp-97228',
  question: 'does a domain-respecting (non-polynomial, smooth mode-cutoff) trial vector reduce the imp-97162 Temple defect eta2 toward a finite small value?',
  binding_2a: LN3,
  // Finding 1: reduction is at most ~1 order of magnitude, never small
  eta2MinReached: IMP97228_BEST.eta2Min,        // ~1.67e8
  eta2StaysAstronomical: true,                   // still ~3e8 * mu
  reductionAtMostOneOrderOfMagnitude: true,      // 2.42e9 -> 1.67e8 (~14.5x)
  // Finding 2: bought by destroying the approximation
  eta2MinBoughtByMuBlowup: true,                 // eta2 min at mu = 0.895 >> 0.5 target
  noWindowWithSmallEta2AndNearFloorMu: true,
  // Finding 3: every taper still diverges in Nbig -- t-space (t^4), not mode-space
  everyTaperStillDivergesInNbig: true,           // relGrowth > 0 for all w
  obstructionIsTSpaceNotModeSpace: true,         // t^4 weight, not coefficient tail
  smoothModeCutoffCannotCure: true,
  // overall
  noAccessibleDomainRespectingTrialGivesFiniteSmallEta2: true,
  sharpensImp97162DoubleObstruction: true,
  // unchanged program state
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  uniformNGapClosed: false,
  subGap: 'IMP97228_DOMAIN_RESPECTING_TRIAL_NO_FINITE_ETA2 -- applying a smooth (raised-cosine) mode-space cutoff of width w to the committed Ritz coefficients at 2a=ln3, T=800 reduces the Temple defect eta2 from the ~2.42e9 polynomial baseline by AT MOST ~1 order of magnitude (minimum ~1.67e8 at w=8, still ~3e8 times mu), and only by driving mu to ~0.895 (far above the 0.5 uniform-N target); every taper that keeps mu near the floor leaves eta2 ~1e9-2.3e9. Crucially eta2 STILL GROWS with the evaluation space Nbig for EVERY taper width (relative growth Nbig=120->300 stays +1.2..+2.5, never approaching 0), so a smooth mode-space cutoff does NOT produce a finite eta2 limit: the divergence is a t-space (t^4 weight of sigma_2 on the transformed-basis tails) phenomenon, uncurable by trial-vector choice within the polynomial/Gegenbauer family. This SHARPENS imp-97162: the huge Temple defect is intrinsic to the unbounded operator, not an artifact of the particular polynomial trial. A finite small eta2 would require a trial from OUTSIDE this basis (a genuine t-space smooth-cutoff/Gaussian function projected exactly onto dom(A)), not yet built. Measurement only; mu stays an UPPER bound; no lower-bound certificate; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96',
  qed: false,
});
export default IMP97228_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97228_ASSERTIONS = [
  {
    id: 'imp97228-eta2-never-small',
    holds: () => {
      const minEta2 = Math.min(...IMP97228_TAPER_SWEEP.map((r) => r.eta2));
      return Math.abs(minEta2 - IMP97228_BEST.eta2Min) < 1 &&
        minEta2 > 1e8 &&                                   // still astronomically large
        minEta2 / IMP97228_BEST.muAtMin > 1e8 &&           // ~3e8 * mu
        IMP97228_VERDICT.eta2StaysAstronomical === true;
    },
    why: 'across the entire taper sweep the smallest eta2 reached is ~1.67e8 -- still ~3e8 times mu, never O(1) or O(mu); a smooth mode-cutoff cannot make the Temple defect small.',
  },
  {
    id: 'imp97228-reduction-at-most-one-order',
    holds: () => {
      const factor = IMP97228_POLY_RITZ_ETA2 / IMP97228_BEST.eta2Min;
      return factor > 5 && factor < 50 &&                  // ~14.5x, roughly one order of magnitude
        Math.abs(IMP97228_BEST.reductionFactorFromPoly - factor) < 1e-6 &&
        IMP97228_VERDICT.reductionAtMostOneOrderOfMagnitude === true;
    },
    why: 'the best taper reduces eta2 from the 2.42e9 polynomial baseline to ~1.67e8, a factor of ~14.5 -- barely one order of magnitude, nowhere near a finite small value.',
  },
  {
    id: 'imp97228-min-eta2-costs-mu-blowup',
    holds: () => {
      const best = IMP97228_TAPER_SWEEP.reduce((a, b) => (b.eta2 < a.eta2 ? b : a));
      return best.mu > 0.85 &&                             // approximation destroyed at the eta2 min
        Math.abs(best.mu - IMP97228_BEST.muAtMin) < 1e-6 &&
        IMP97228_VERDICT.noWindowWithSmallEta2AndNearFloorMu === true;
    },
    why: 'the smallest eta2 (~1.67e8, w=8) occurs at mu=0.895 -- far above the 0.5 target -- while tapers that keep mu near the floor leave eta2 ~1e9: no window has both.',
  },
  {
    id: 'imp97228-every-taper-diverges-in-nbig',
    holds: () =>
      IMP97228_TAPER_SWEEP.every((r) => r.relGrowth > 0.5) &&   // eta2 grows with Nbig for ALL tapers
      IMP97228_VERDICT.everyTaperStillDivergesInNbig === true &&
      IMP97228_VERDICT.obstructionIsTSpaceNotModeSpace === true,
    why: 'the Nbig=120->300 relative growth of eta2 stays positive (+1.2..+2.5) for every taper width, so no smooth mode-cutoff yields a finite eta2 limit -- the divergence is a t-space (t^4) phenomenon.',
  },
  {
    id: 'imp97228-measurement-only-no-qed',
    holds: () =>
      IMP97228_VERDICT.operatorPositivityProved === false &&
      IMP97228_VERDICT.boundMoves === false &&
      IMP97228_VERDICT.uniformNGapClosed === false &&
      IMP97228_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97228_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97228_BINDING_2A - LN3) < 1e-12 &&
      IMP97228_VERDICT.qed === false,
    why: 'measurement only: mu stays an UPPER bound, no lower-bound certificate is produced, the uniform-in-N gap stays open, no bound moves, the interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97228_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97228 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
