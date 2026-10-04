/**
 * @see imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation.js (the SUB-GAP-imp-34287-asymptotic-class-undecidable finding)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the resid_exp pole k* ~ 21.280947 this cohort is built around)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION } from '../data/imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation.js';
import { IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO } from '../data/imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js';
import { IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS } from '../data/imp-34309-combined-grid-loo-linear-flip-robustness.js';
import { IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE } from '../data/imp-34247-widening-slope-pole-divergence.js';
import { IMP34310_EFLOW_OVER_RESID_POLE_RESIDUE } from '../data/imp-34310-eflow-over-resid-pole-residue-simple-pole.js';
import { IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE } from '../data/imp-34333-residue-plus-one-estimator-invariance.js';
import { IMP34326_WIDENING_SLOPE_BACKGROUND_RECONCILIATION } from '../data/imp-34326-widening-slope-background-reconciliation.js';

const COHORT = [
  {
    id: 'imp-34237 / imp-34169',
    path: '/viz-imp34237-fixed-band-peak-reaccel-and-surrogate-pole',
    title: 'Fixed-Band Peak Re-Acceleration & Surrogate Pole',
    summary:
      'The core viz: the fixed-band (k<=10) peak re-accelerates over the three computable windows ' +
      'and the resid_exp(k) surrogate hits an undefined pole at k*~21.281.',
  },
  {
    id: 'imp-34268 / imp-34196',
    path: '/viz-imp34268-fixed-band-peak-reaccel-convexity-stitch',
    title: 'Re-Acceleration Convexity Stitch',
    summary:
      'Stitches the imp-34196 re-accelerating fixed-band peak increments onto an 18-window grid: the ' +
      'stitched sequence pulls monotonically above the imp-34196 4-point linear extrapolation past ' +
      'kEnd~19.5, confirming convex (not linear) re-acceleration into the pole.',
  },
  {
    id: 'imp-34281 (cohort index)',
    path: '/viz-imp34281-m2-ceiling-cohort-index',
    title: 'M2-Residual Sign-Change Ceiling Cohort',
    summary:
      'The sibling kEnd*~21.281 cohort index covering the closed-form/bisection split and the ' +
      'window-width divergence ladder around the same pole.',
  },
  {
    id: 'imp-34419 / imp-34327',
    path: '/viz-imp34419-widening-slope-minus-one-crossing',
    title: 'Widening-Slope -1 Crossing: Above the Fit Window, Below the M2 Ceiling',
    summary:
      'Solves the imp-34246 two-term form for its exact -1.0 crossing in closed form (u*=45.65827): the ' +
      'crossing sits ~2.48 decades ABOVE the k=12..18 fit window (the window never reaches -1) but is a ' +
      'genuine PRE-POLE crossing at k*~20.48, ~0.80 decades below the k*~21.281 ceiling.',
  },
  {
    id: 'imp-34417 / imp-34328',
    path: '/viz-imp34417-sigma-vs-product-gap-complement',
    title: 'Sigma-vs-Product Gap: the Exact Complement Identity',
    summary:
      'Cross-validates the imp-34197 product gap 1/(2u) against the imp-33816 sigma-exponent gap: the sigma ' +
      'channel does NOT collapse to 1/(2u) (it keeps the log(2pi) shift), but the two gaps are EXACT ' +
      'complements on the log T0 axis -- gapSigma*logT0 + gapProduct = 1/2 to 12+ figures at every rung.',
  },
  {
    id: 'imp-34418 / imp-34330',
    path: '/viz-imp34418-widening-residual-prepole-reversal',
    title: 'Widening-Slope Two-Term Residual: Pre-Pole Sign Change and Divergence',
    summary:
      'Extends the imp-34246 residual grid from k=18 to k=20.5: the residual does NOT keep shrinking toward ' +
      'the pole -- it crosses zero at k_best~17.80 then FLIPS SIGN and diverges (+1.401 by k=20.75), so the ' +
      'imp-34246 zero-crossing was a finite-window coincidence, not an approach to the leading value.',
  },
  {
    id: 'imp-34416 / imp-34329',
    path: '/viz-imp34416-crossover-surplus-fartail-composite-limit',
    title: 'Crossover-Surplus Composite Exponent: Turn and Climb Toward 3',
    summary:
      'Extends the imp-34248 crossover-surplus ladder into the far tail (thr down to 1e-12): the composite ' +
      'exponent bottoms out at ~2.871 then REVERSES and climbs back, with the local r-exponent approaching 2 ' +
      'from below -- so the well-defined limiting composite exponent is exactly 3, not the ~2.88 plateau.',
  },
];

export default function Imp34377ResidExpPoleCohortIndexPage() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="resid_exp Pole (k*~21.28) Family Cohort (imp-34377)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        The imp-34169 resid_exp(k) surrogate zero at k* ~ {IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.surrogateZero.continuousZeroKStar}{' '}
        is where the fixed-band peak's re-acceleration (imp-34237, imp-34268, imp-34196) meets its own
        surrogate boundary, and where the imp-34287 reconciliation shows that re-acceleration is a
        pole-proximity transient rather than intrinsic super-log growth -- leaving the true asymptotic
        growth class of the peak an OPEN, undecidable question within this surrogate. This index groups
        the navigable viz pages in that family so the pole story can be read as one thread.
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {COHORT.map((entry) => (
          <Link
            key={entry.id}
            to={entry.path}
            style={{
              display: 'block',
              padding: '0.85rem 1rem',
              background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
              borderLeft: '3px solid var(--rule)',
              borderRadius: '0 4px 4px 0',
              textDecoration: 'none',
            }}
          >
            <div style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '0.9rem' }}>
              {entry.title} <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>({entry.id})</span>
            </div>
            <div style={{ color: 'var(--ink-soft)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
              {entry.summary}
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>imp-34287 growth-class reconciliation (no dedicated viz page):</strong>{' '}
        far from the pole (kEnd &le; 18) the local log-derivative g DECLINES ({IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.farBranch.slope} slope,
        R&sup2;&nbsp;{IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.farBranch.r2}) -- sub-log-leaning, never super-log. The imp-34196
        re-acceleration is confined to the pole-approach branch and is explained by pole proximity
        (g regressed on 1/(k*-kEnd) gives R&sup2;&nbsp;{IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.poleProximityRegression.r2Full}), so it is a bounded
        finite-window transient, not intrinsic super-logarithmic growth.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Later pole-cohort measurements (no dedicated viz pages):</strong>{' '}
        imp-34309 leave-one-out over the three near-pole windows shows the imp-34233 linear-overtakes-log
        flip is FRAGILE -- it hinges entirely on the single closest-to-pole window kEnd=21.0, reversing
        back to log if that one window is deleted. imp-34310 measures the resid_exp zero at k* as a SIMPLE
        pole (odd-order sign change) in the eflow_over_resid channel, with local slope ~-2.32e-7 and leading
        residue R~-1.979e-8. imp-34311 recomputes the imp-34127 closed-form M2 residual with a matched
        5-point (vs 2-point) pEcoll endpoint stencil and finds it removes 100% of the -0.28 residual --
        the sign-change ceiling itself dissolves, confirming the estimator-bias attribution over a
        competing ceiling.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Two-channel pole-residue summary (imp-34247 vs imp-34310):</strong>{' '}
        the SAME resid_exp zero at k* ~ {IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.poleLocation} reads as two
        DIFFERENT residues depending on channel. In the imp-34247 LOG-DERIVATIVE channel dy/dk = d/dk
        ln(eflow_over_resid), the residue is dimensionless and normalizes to exactly +1
        ((k*&nbsp;&minus;&nbsp;k)&nbsp;dy/dk&nbsp;&rarr;&nbsp;{IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.residueNearPole}
        at k=21.275, pole order p&nbsp;~&nbsp;{IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.poleOrder}). In the imp-34310
        RAW-ratio channel eflow_over_resid = eflow_attr / resid_exp, the residue carries eflow_attr s physical units
        and measures R&nbsp;~&nbsp;{IMP34310_EFLOW_OVER_RESID_POLE_RESIDUE.poleResidue.toExponential(4)}. Both are
        confirmed SIMPLE (order-1) poles of the same underlying resid_exp zero -- the magnitude gap is expected,
        since a log-derivative residue always normalizes to 1 for a simple zero while the raw-ratio residue scales
        with the actual eflow_attr(k*) magnitude and local slope.{' '}
        <strong style={{ color: 'var(--ink-soft)' }}>Estimator-invariance (imp-34333):</strong> the log-derivative residue
        +1 is the multiplicity of the resid_exp zero (residue of f&prime;/f = order of zero), so it is invariant to
        the estimator amplitude and the exact k* -- rescaling the zero amplitude by ~4.3e6 and shifting k* by ~6.28
        both leave it at {IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE.residueDenominator.toFixed(3)} (to &lt;&nbsp;1e-9).
        The imp-34284 reciprocal orientation (resid_exp in the numerator) flips it to{' '}
        {IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE.residueReciprocal.toFixed(3)} (sign flip, magnitude preserved);
        only a higher-order-zero estimator would change &#124;residue&#124; (a squared surrogate gives{' '}
        {IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE.residueOrderTwo.toFixed(3)}), and that would also destroy the
        imp-34310 sign change -- so +1 is structurally forced.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Widening-slope background reconciliation (imp-34326, no dedicated viz page):</strong>{' '}
        imp-34247's pole-subtraction background B(k) = dy/dk &minus; 1/(k*&minus;k) and imp-34246's strict-derivative
        form &minus;ln10/2 + ln10&middot;(3/u) look like competing characterizations of the same raw local widening
        slope, but they RECONCILE rather than conflict: once the pole term cancels identically between the two
        decompositions, the convention-matched residual R(k) = dy/dk &minus; form reproduces imp-34246's own
        two-term plateau residual exactly ({IMP34326_WIDENING_SLOPE_BACKGROUND_RECONCILIATION.matchedResidAtK12} at k=12
        shrinking to {IMP34326_WIDENING_SLOPE_BACKGROUND_RECONCILIATION.matchedResidAtK18} at k=18). B(k)'s apparent
        drift is the pole term's own k-dependence, not a disagreement between the two models -- the match breaks
        past k&nbsp;&ge;&nbsp;19 ({IMP34326_WIDENING_SLOPE_BACKGROUND_RECONCILIATION.matchedResidAtK20} at k=20) where
        the same hump-turn / pole contamination both source modules independently flag corrupts the raw slope.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Fragility caveat (imp-34394, on imp-34309):</strong>{' '}
        the imp-34233 "linear overtakes log" verdict is NOT a stable growth-form conclusion -- it is carried
        entirely by the single closest-to-pole window kEnd=21.0. On the full 15-window grid linear beats log
        by a log-minus-linear AIC gap of +{IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS.fullGrid.aicGapLogMinusLin},
        and that gap stays positive under leave-one-out deletion of kEnd=20.0 or kEnd=20.5. But deleting kEnd=21.0
        alone REVERSES it to {IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS.leaveOneOut[2].aicGapLogMinusLin}{' '}
        (log reclaims the win). Downstream readers should not over-read "linear wins" from imp-34233 -- only the
        coarser reading that the bounded a&nbsp;-&nbsp;b/kEnd ceiling is never selected (log beats it under every
        single-window deletion) is robust.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Sub-gap (SUB-GAP-imp-34287-asymptotic-class-undecidable):</strong>{' '}
        the surrogate domain terminates at k* ~ {IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.surrogateZero.continuousZeroKStar} before any pole-free window
        can separate a genuine super-log signature from pole contamination -- the whole re-acceleration
        branch sits inside the pole's influence radius. Whether the TRUE fixed-band-peak growth is
        sub-log, log, or super-log is left OPEN.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> this is a navigation aid over
        already-published measurements. k* ~ 21.28 is a real, reproducible surrogate boundary attached
        to one specific inherited extrapolation, not a derived mathematical ceiling. It changes no
        bound and patches no literal. C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a&ge;0
        untouched; RH-equivalent, NO QED.
      </div>
    </div>
  );
}
