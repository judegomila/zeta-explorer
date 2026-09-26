/**
 * @module imp-97262-krein-tspace-gaussian-trial-eta2
 * @fileoverview imp-97262 -- MEASUREMENT of the imp-97228 SUB-GAP
 *   IMP97228_DOMAIN_RESPECTING_TRIAL_NO_FINITE_ETA2: does a GENUINE t-space
 *   smooth-cutoff / Gaussian function -- from OUTSIDE the polynomial/Gegenbauer family --
 *   projected EXACTLY onto dom(A) reduce the Temple residual defect
 *   eta2 = ||T_a[sigma_2] psi - mu psi||^2 to a finite, small value?
 *
 *   imp-97162 measured eta2 ~ 2.42e9 for the committed POLYNOMIAL Ritz eigenvector at
 *   2a=ln3 (T=800, N=100), GROWING with the evaluation space Nbig because T_a[sigma_2]
 *   is UNBOUNDED (prefactor (t^2+1/4)^2 ~ t^4). imp-97228 then showed NO smooth MODE-space
 *   cutoff (Hann taper of the Ritz coefficients) cures it: the best taper reached
 *   eta2 ~ 1.67e8 only by driving mu to ~0.895 (far above the 0.5 target) and STILL
 *   diverged in Nbig. Its sub-gap invited the natural out-of-family remedy: a genuine
 *   t-space Gaussian G(t)=exp(-(t/s)^2) (or raised-cosine smooth cutoff) projected exactly
 *   onto dom(A). The hope: t^4*G(t) is in L2 (super-exponential decay kills the t^4 weight),
 *   so IF dom(A) could represent G, then T psi would have controlled tails and eta2 finite.
 *
 *   This leaf builds exactly that. For each profile we compute the EXACT (min-norm,
 *   truncated-SVD-stabilised, cond=1e-10) L2([0,T],dt) least-squares projection of G onto
 *   the transform span span{Phih_n : n<N} = dom(A) in this discretization -- the coefficient
 *   vector g = argmin ||sum_n g_n Phih_n - G||_{L2 dt} -- then measures, with the SAME
 *   operator machinery, weights and scaleB as imp-97162/97228 (so the numbers are directly
 *   comparable): mu = g^T A_N g/(g^T g)/scaleB (UPPER bound on lambda_1) and
 *   eta2 = ||A_tail g||^2/scaleB^2 at Nbig=120,160,220,300 (finite limit <=> relGrowth->0).
 *   Script: tmp/imp-97262-tspace-gaussian-trial-eta2.py; data tmp/imp-97262-out.json.
 *
 *   Measurement only; mu stays an UPPER bound; no operator positivity; no lower-bound
 *   certificate; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * FINDING 1 -- dom(A) AT THIS TRUNCATION CANNOT REPRESENT A LOCALIZED t-SPACE GAUSSIAN. The
 *   transform span {Phih_n : n<100} is numerically rank-deficient (effective rank 71 at
 *   cond=1e-10). For every narrow/localized profile (Gaussian width s<=12, and all
 *   raised-cosine cutoffs) the best L2 projection has a relative residual FAR above 1
 *   (2.3 to 1.2e7) with a coefficient norm ||g|| that is astronomically large
 *   (~1.9e2 up to ~3.6e8): representing a localized genuine t-space Gaussian in the
 *   polynomial-transform span demands massive cancellation, i.e. the coefficient->function
 *   map is extremely non-isometric. A genuine localized Gaussian is simply NOT accessible
 *   inside dom(A) here.
 *
 * FINDING 2 -- EVEN THE ONE FAITHFULLY-REPRESENTABLE PROFILE GIVES A CATASTROPHIC eta2. Only
 *   wide Gaussians are representable (s=20: L2 residual 0.045, ||g||~98; s=40: residual 0.21).
 *   Yet even for s=20 the Temple defect is eta2 ~ 1.47e16 -- roughly SEVEN orders of magnitude
 *   WORSE than the polynomial Ritz baseline (2.42e9) and EIGHT orders worse than the best
 *   Hann mode-taper (1.67e8) -- while mu ~ 8.06e6 is meaningless (vastly above the 0.5 floor).
 *   The exact projection P_N G is NOT a clean Gaussian: it re-inherits the polynomial-transform
 *   tails, so the t^4 sigma_2 weight blows the residual up worse than ever.
 *
 * FINDING 3 -- EVERY t-SPACE TRIAL STILL DIVERGES IN Nbig, MORE STRONGLY THAN THE TAPERS. The
 *   Nbig=120->300 relative growth of eta2 is +3.0 to +6.0 for EVERY profile (vs +1.2..+2.5 for
 *   the Hann tapers): no genuine t-space Gaussian yields a finite eta2 limit either. The
 *   divergence remains the t-space (t^4) phenomenon imp-97228 identified, now confirmed to be
 *   uncurable even by an out-of-family t-space trial within the transform-span domain.
 *
 * VERDICT. The out-of-family t-space trial the imp-97228 sub-gap invited does NOT rescue the
 *   Temple defect -- it fails HARDER than the in-family trials on every axis: eta2 larger by
 *   6-8 orders of magnitude, mu destroyed, and Nbig-divergence stronger. Localized genuine
 *   Gaussians are not representable in dom(A) at all (huge residual + huge ||g||), and the only
 *   representable (wide) Gaussians re-inherit the polynomial-transform t^4 tails. This CONFIRMS
 *   and STRENGTHENS the imp-97162/97228 double-obstruction: the huge Temple defect is intrinsic
 *   to the unbounded t^4 operator on this discretized transform-span domain, not a trial-vector
 *   artifact. SUB-GAP IMP97262_OUT_OF_FAMILY_TSPACE_TRIAL_NO_FINITE_ETA2 -- a finite small eta2
 *   would require a genuinely DIFFERENT domain representation whose dom(A) actually contains
 *   localized, super-exponentially-decaying t-space functions (a t-space collocation/spectral
 *   basis with built-in decay, NOT the polynomial-transform span), i.e. an operator-representation
 *   rebuild, not a trial-vector choice. Measurement only; mu stays an UPPER bound; no operator
 *   positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97228-krein-domain-respecting-trial-eta2.js (SUB-GAP this leaf discharges; Hann mode-taper baseline)
 * @see imp-97162-krein-temple-defect-eta2-measurement.js (SUB-GAP IMP97162_TEMPLE_DEFECT_ETA2_HUGE; polynomial baseline)
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (INGREDIENT 1/2 double obstruction)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this measurement)
export const IMP97262_RIGOROUS_REACH_2A = 0.96;
export const IMP97262_BINDING_2A = LN3;

// reference baselines (comparability with the same operator machinery)
export const IMP97262_POLY_RITZ_ETA2 = 2424503980.717981; // imp-97162 polynomial baseline
export const IMP97262_HANN_TAPER_BEST_ETA2 = 167397000.0;  // imp-97228 best mode-taper

// effective numerical rank of the transform span {Phih_n : n<N=100} at cond=1e-10
export const IMP97262_TRANSFORM_SPAN_RANK = 71;

// Genuine t-space profiles projected EXACTLY (L2 dt least squares) onto dom(A) at 2a=ln3,
// N=100, T=800. eta2 at Nbig=300; relGrowth = (eta2@300 - eta2@120)/eta2@120 (finite limit <=> 0).
// l2resid = relative L2 projection residual (>1 => profile NOT representable in dom(A));
// gnorm = ||g|| Euclidean coefficient norm. From tmp/imp-97262-out.json.
export const IMP97262_TSPACE_SWEEP = Object.freeze([
  Object.freeze({ kind: 'gauss', s: 2.0,  mu: 2.289666e10, l2resid: 1.1512e7,  gnorm: 3.5712e8, eta2: 5.539190e19, relGrowth: 3.5891 }),
  Object.freeze({ kind: 'gauss', s: 3.0,  mu: 1.275338e10, l2resid: 3.0190e6,  gnorm: 1.1470e8, eta2: 2.668452e19, relGrowth: 4.6252 }),
  Object.freeze({ kind: 'gauss', s: 4.0,  mu: 2.030580e10, l2resid: 1.2789e6,  gnorm: 5.6108e7, eta2: 4.731875e19, relGrowth: 3.8047 }),
  Object.freeze({ kind: 'gauss', s: 6.0,  mu: 2.160035e10, l2resid: 7.3321e4,  gnorm: 3.9396e6, eta2: 5.055228e19, relGrowth: 3.7932 }),
  Object.freeze({ kind: 'gauss', s: 8.0,  mu: 2.915141e10, l2resid: 2.1894e3,  gnorm: 1.3584e5, eta2: 7.315081e19, relGrowth: 3.4532 }),
  Object.freeze({ kind: 'gauss', s: 12.0, mu: 1.301754e10, l2resid: 2.3388e0,  gnorm: 1.9390e2, eta2: 2.656432e19, relGrowth: 5.0012 }),
  Object.freeze({ kind: 'gauss', s: 20.0, mu: 8.063430e6,  l2resid: 4.4952e-2, gnorm: 9.7800e1, eta2: 1.474157e16, relGrowth: 5.9730 }),
  Object.freeze({ kind: 'gauss', s: 40.0, mu: 7.943307e7,  l2resid: 2.1393e-1, gnorm: 1.2895e2, eta2: 1.508419e17, relGrowth: 5.1642 }),
  Object.freeze({ kind: 'rcos',  s: 8.0,  mu: 3.695786e10, l2resid: 2.4389e6,  gnorm: 1.1706e8, eta2: 1.044994e20, relGrowth: 2.9914 }),
  Object.freeze({ kind: 'rcos',  s: 16.0, mu: 2.074329e10, l2resid: 2.7390e6,  gnorm: 1.8591e8, eta2: 4.838206e19, relGrowth: 3.8157 }),
  Object.freeze({ kind: 'rcos',  s: 32.0, mu: 2.115680e10, l2resid: 6.0782e5,  gnorm: 5.8345e7, eta2: 4.906575e19, relGrowth: 3.8843 }),
]);

// smallest eta2 reached over the whole t-space sweep (the s=20 faithfully-representable case)
export const IMP97262_BEST = Object.freeze({
  kind: 'gauss',
  s: 20.0,
  eta2Min: 1.474157e16,      // ~1.47e16 -- still SEVEN orders above the polynomial baseline
  muAtMin: 8.063430e6,       // meaningless: vastly above the 0.5 target floor
  l2residAtMin: 4.4952e-2,   // the ONE profile the projection represents faithfully
  worseThanPolyFactor: 1.474157e16 / 2424503980.717981, // ~6.08e6x worse than the polynomial baseline
});

export const IMP97262_VERDICT = Object.freeze({
  ticket: 'imp-97262',
  question: 'does a GENUINE t-space smooth-cutoff/Gaussian trial (out-of-family), projected exactly onto dom(A), reduce the imp-97162/97228 Temple defect eta2 to a finite small value?',
  binding_2a: LN3,
  // Finding 1: localized t-space Gaussians are NOT representable in dom(A)
  transformSpanRank: IMP97262_TRANSFORM_SPAN_RANK,       // 71 of 100
  localizedProfilesNotRepresentable: true,               // l2resid >> 1, ||g|| ~ 1e5..1e8 for s<=12 and all rcos
  // Finding 2: even the faithfully-representable wide Gaussian gives catastrophic eta2
  eta2MinReached: IMP97262_BEST.eta2Min,                 // ~1.47e16
  eta2WorseThanPolynomialBaseline: true,                 // 6-8 orders WORSE than 2.42e9 / 1.67e8
  muDestroyed: true,                                     // mu ~ 8e6 at the eta2 min, far above 0.5
  projectionReinheritsPolynomialTails: true,
  // Finding 3: every t-space trial still diverges in Nbig, more strongly than the tapers
  everyTspaceTrialStillDivergesInNbig: true,             // relGrowth +3.0..+6.0 for all
  divergenceStrongerThanHannTapers: true,                // vs +1.2..+2.5 for Hann
  obstructionIsTSpaceNotModeSpace: true,                 // t^4 weight, confirmed again
  // overall
  outOfFamilyTspaceTrialFailsHarder: true,
  sharpensImp97162And97228DoubleObstruction: true,
  // unchanged program state
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  uniformNGapClosed: false,
  subGap: 'IMP97262_OUT_OF_FAMILY_TSPACE_TRIAL_NO_FINITE_ETA2 -- the out-of-family t-space trial invited by imp-97228 (a genuine Gaussian exp(-(t/s)^2) or raised-cosine smooth cutoff), projected EXACTLY (min-norm truncated-SVD L2-dt least squares) onto the transform span span{Phih_n:n<100}=dom(A) at 2a=ln3, T=800, does NOT rescue the Temple defect -- it fails HARDER than the in-family trials. The span is numerically rank-71: every localized profile (Gaussian width s<=12, all raised-cosine cutoffs) has L2 projection residual FAR above 1 (2.3..1.2e7) with coefficient norm ||g|| ~ 1.9e2..3.6e8, so a localized genuine t-space Gaussian is not accessible in dom(A) at all. The only faithfully-representable profiles are wide Gaussians (s=20: residual 0.045, ||g||~98), and even there eta2 ~ 1.47e16 -- roughly SEVEN orders of magnitude worse than the polynomial baseline (2.42e9) and EIGHT worse than the best Hann taper (1.67e8) -- with mu ~ 8e6 (meaningless) and eta2 STILL growing in Nbig (relGrowth +3.0..+6.0 for every profile, stronger than the tapers +1.2..+2.5). The exact projection P_N G re-inherits the polynomial-transform t^4 tails, so the unbounded sigma_2 weight blows eta2 up worse than ever. This CONFIRMS and STRENGTHENS the imp-97162/97228 double-obstruction: the huge Temple defect is intrinsic to the unbounded t^4 operator on this discretized transform-span domain, uncurable by trial-vector choice even out-of-family. A finite small eta2 would require a genuinely DIFFERENT domain representation whose dom(A) contains localized super-exponentially-decaying t-space functions (a t-space collocation/spectral basis with built-in decay, NOT the polynomial-transform span) -- an operator-representation rebuild, not a trial-vector choice. Measurement only; mu stays an UPPER bound; no lower-bound certificate; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96',
  qed: false,
});
export default IMP97262_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97262_ASSERTIONS = [
  {
    id: 'imp97262-localized-not-representable',
    holds: () => {
      const localized = IMP97262_TSPACE_SWEEP.filter((r) => r.l2resid > 1);
      // every s<=12 gaussian and every rcos should be non-representable (residual >> 1)
      return localized.length >= 8 &&
        localized.every((r) => r.gnorm > 1e2) &&
        IMP97262_VERDICT.localizedProfilesNotRepresentable === true &&
        IMP97262_TRANSFORM_SPAN_RANK < 100;
    },
    why: 'localized genuine t-space Gaussians (s<=12) and all raised-cosine cutoffs have L2 projection residual far above 1 with astronomically large coefficient norm -- they are not accessible inside the rank-71 transform-span dom(A).',
  },
  {
    id: 'imp97262-best-eta2-catastrophic',
    holds: () => {
      const minEta2 = Math.min(...IMP97262_TSPACE_SWEEP.map((r) => r.eta2));
      return Math.abs(minEta2 - IMP97262_BEST.eta2Min) < 1e11 &&
        minEta2 > 1e15 &&                                     // still astronomically large
        minEta2 / IMP97262_POLY_RITZ_ETA2 > 1e5 &&            // >5 orders worse than polynomial baseline
        minEta2 / IMP97262_HANN_TAPER_BEST_ETA2 > 1e6 &&      // >6 orders worse than best Hann taper
        IMP97262_VERDICT.eta2WorseThanPolynomialBaseline === true;
    },
    why: 'the smallest eta2 over the whole t-space sweep (~1.47e16, the faithfully-representable s=20 Gaussian) is 6-8 orders of magnitude WORSE than both the polynomial baseline (2.42e9) and the best Hann taper (1.67e8): a genuine t-space Gaussian fails harder, not better.',
  },
  {
    id: 'imp97262-best-eta2-costs-mu-blowup',
    holds: () => {
      const best = IMP97262_TSPACE_SWEEP.reduce((a, b) => (b.eta2 < a.eta2 ? b : a));
      return best.mu > 1e6 &&                                 // mu meaningless at the eta2 min
        Math.abs(best.eta2 - IMP97262_BEST.eta2Min) < 1e11 &&
        IMP97262_VERDICT.muDestroyed === true;
    },
    why: 'the smallest eta2 occurs at mu ~ 8e6 -- utterly meaningless as an upper bound on lambda_1 (target floor 0.5): the trial is not a real eigenvector approximation.',
  },
  {
    id: 'imp97262-every-trial-diverges-in-nbig',
    holds: () =>
      IMP97262_TSPACE_SWEEP.every((r) => r.relGrowth > 2.5) &&  // stronger than Hann +1.2..+2.5
      IMP97262_VERDICT.everyTspaceTrialStillDivergesInNbig === true &&
      IMP97262_VERDICT.divergenceStrongerThanHannTapers === true &&
      IMP97262_VERDICT.obstructionIsTSpaceNotModeSpace === true,
    why: 'the Nbig=120->300 relative growth of eta2 stays above +2.5 (up to +6.0) for every t-space profile, more strongly divergent than the Hann tapers -- no genuine t-space Gaussian yields a finite eta2 limit either.',
  },
  {
    id: 'imp97262-measurement-only-no-qed',
    holds: () =>
      IMP97262_VERDICT.operatorPositivityProved === false &&
      IMP97262_VERDICT.boundMoves === false &&
      IMP97262_VERDICT.uniformNGapClosed === false &&
      IMP97262_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97262_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97262_BINDING_2A - LN3) < 1e-12 &&
      IMP97262_VERDICT.qed === false,
    why: 'measurement only: mu stays an UPPER bound, no lower-bound certificate is produced, the uniform-in-N gap stays open, no bound moves, the interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97262_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97262 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
