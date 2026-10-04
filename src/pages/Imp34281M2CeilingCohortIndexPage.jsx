/**
 * @see imp-34302-m2-ceiling-cohort-canonical-value-gate.js (build-time gate keeping this cohort's canonical
 *   kEnd*~21.281 ceiling distinct from the imp-34127 closed-form estimate)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form.js (the distinct, lower closed-form estimate)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE } from '../data/imp-34282-b-inf-descriptive-vs-derivation-status-note.js';
import { IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP } from '../data/imp-34211-closedform-vs-bisection-kend-gap.js';
import { IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST } from '../data/imp-34233-fixed-band-peak-combined-grid-ceiling-contest.js';
import { IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT } from '../data/imp-34109-fixed-band-peak-amplitude-saturation-fit.js';
import { IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION } from '../data/imp-34285-closedform-gap-term-decomposition.js';
import { IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION } from '../data/imp-34288-trough-peak-ratio-ceiling-extension.js';
import { IMP34311_M2_CLOSEDFORM_5POINT_ENDPOINT_STENCIL_SHARE } from '../data/imp-34311-m2-closedform-5point-endpoint-stencil-share.js';
import { IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL } from '../data/imp-34314-m2-ceiling-two-path-bisection-residual.js';

const KEND_GAP_DECOMPOSITION_SUB_COHORT = [
  {
    id: 'imp-34285',
    measures: 'imp-34211 ~0.278 kEnd gap (imp-34127 closed form vs imp-34150 direct bisection), decomposed term-by-term',
    reuseGate: 'rebuilds both roots from the identical inherited imp-3406/imp-33810 sub-terms',
    subGap: 'SUB-GAP-imp-34285-per-estimator-percentage-split (dA-dB near-total cancellation leaves a clean percentage ill-conditioned)',
  },
  {
    id: 'imp-34286',
    measures: 'imp-34210 numerator-approach coefficient a, cross-validated via an independent finite-difference derivative',
    reuseGate: 'reuses the imp-33810 quarter-decade ladder verbatim',
    subGap: 'none -- FD estimator (~0.437-0.438) corroborates the g*kEnd plateau, only tightens the OLS prefactor',
  },
  {
    id: 'imp-34287',
    measures: 'imp-34196 re-acceleration vs imp-34109 unbounded-log verdict, reconciled via the local growth exponent g',
    reuseGate: 'reuses the imp-34196/imp-34109 machinery verbatim',
    subGap: 'SUB-GAP-imp-34287-asymptotic-class-undecidable (true growth class undecidable within the surrogate domain)',
  },
  {
    id: 'imp-34288',
    measures: 'imp-34214 |trough|/|peak| ratio grid, extended past window width w=7 toward the amplitude ceiling',
    reuseGate: `reproduces the imp-34085 ratio at kEnd=11..13 exactly (max diff ${IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION.reuseGateMaxDiffVsImp34085})`,
    subGap: 'none -- ratio saturates below ceiling 1 (max ~0.907), no overshoot',
  },
];

const COHORT = [
  {
    id: 'imp-34237 / imp-34169',
    path: '/viz-imp34237-fixed-band-peak-reaccel-and-surrogate-pole',
    title: 'Fixed-Band Peak Re-Acceleration & Surrogate Pole',
    summary:
      'The core viz: the fixed-band (k<=10) peak re-accelerates over the three computable windows ' +
      'and the resid_exp(k) surrogate hits an undefined pole at kEnd*~21.281. Cross-links the ' +
      'imp-34127 closed form and imp-34189 next-order term inline.',
  },
  {
    id: 'imp-34255 / imp-34189',
    path: '/viz-imp34255-m2-ceiling-window-width-divergence',
    title: 'Window-Width Divergence Ladder',
    summary:
      'Shows the bisected kEnd*(w) crossing has NO w->0 limit -- it diverges monotonically as the ' +
      'fitting window narrows (21.28 -> 23.94 from w=1 down to w=1/8), and the imp-34127 leading ' +
      'closed form is a full-decade-only reading, not a converged value.',
  },
  {
    id: 'imp-34274 / imp-34196',
    path: '/viz-imp34274-fixed-band-peak-increment-minimum',
    title: 'Peak Increment Minimum & Sub-Window Inflection',
    summary:
      'Refines the imp-34109 fixed-band peak sweep to a finer grid: the peak increments dip to a ' +
      'minimum half a window later than the coarse read, and the post-minimum branch is convex, ' +
      'refuting delayed saturation.',
  },
  {
    id: 'imp-34356 / imp-34267',
    path: '/viz-imp34356-m2-ceiling-exactfit-coeff-ladder',
    title: 'Exact-Fit Coefficient Ladder',
    summary:
      'Decomposes the imp-34189 exact-fit e^3 D^2 coefficient through the isolated endpoint-curvature ' +
      'Taylor channel: truncating sigma_hi at order M has the wrong sign at M=0, overshoots at M=1/M=2, ' +
      'and locks onto the exact-fit value by cubic order M=3.',
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
    id: 'imp-34378 / imp-34288',
    path: '/viz-imp34378-trough-peak-ratio-ceiling',
    title: 'Trough/Peak Ratio Ceiling: Rise, Cap, and Regime-Change Recede',
    summary:
      'Extends the imp-34214/imp-34085 |trough|/|peak| amplitude-ratio grid past w=7: the ratio climbs ' +
      'to a maximum ~0.907 at w=9.25, saturates below the ceiling of 1 (no overshoot), then recedes to ' +
      '~0.618 by w=14 once the argmax peak migrates off the receding right endpoint to k~6.5.',
  },
];

export default function Imp34281M2CeilingCohortIndexPage() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="M2-Residual Sign-Change Ceiling Cohort (imp-34281)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        The imp-34023 -&gt; imp-34127 -&gt; imp-34189 -&gt; imp-34169/imp-34237 chain (plus
        imp-34188 and imp-34196) all measure the same kEnd*~21.281 point where the M2 sub-leading
        residual bisects to zero, but the readings were shipped across separate viz pages with no
        shared landing surface. This index groups the three navigable viz pages so the cohort can
        be read as one story. The canonical cross-reference synthesizing all six modules'
        status lives in the glossary (imp-34278 entry, see <Link to="/wiki">Wiki</Link>).
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
        <strong style={{ color: 'var(--ink-soft)' }}>imp-34211 closed-form vs bisection kEnd (two ceiling readings, side by side):</strong>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
          <span>
            <span style={{ color: 'var(--ink-soft)' }}>closed form (imp-34127):</span>{' '}
            {IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.kEndClosedForm}
          </span>
          <span>
            <span style={{ color: 'var(--ink-soft)' }}>direct bisection (imp-34150, canonical):</span>{' '}
            {IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.kEndDirectBisect}
          </span>
          <span>
            <span style={{ color: 'var(--ink-soft)' }}>gap:</span>{' '}
            {IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.gap.absolute} abs (
            {(IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.gap.relative * 100).toFixed(2)}% rel)
          </span>
        </div>
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
        already-published measurements. kEnd*~21.281 is a real, reproducible, well-conditioned
        number attached to one specific inherited surrogate at one specific window width -- not a
        derived mathematical ceiling. It changes no bound and patches no literal. C_mb
        GUE-conditional per imp-486 untouched; imp-3066 K_a&ge;0 untouched; RH-equivalent, NO QED.
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
        <strong style={{ color: 'var(--ink-soft)' }}>
          imp-34311 stencil-mismatch reason for the imp-34211 gap (no dedicated viz page):
        </strong>{' '}
        the two kEnd readings above stay DISTINCT literals -- closed form{' '}
        {IMP34311_M2_CLOSEDFORM_5POINT_ENDPOINT_STENCIL_SHARE.twoPoint.kEnd_closed_form} vs bisected{' '}
        {IMP34311_M2_CLOSEDFORM_5POINT_ENDPOINT_STENCIL_SHARE.twoPoint.kEnd_bisected} -- but imp-34311
        shows the {IMP34311_M2_CLOSEDFORM_5POINT_ENDPOINT_STENCIL_SHARE.twoPoint.residual_closed_minus_bisected}{' '}
        gap is 100% a 2-point-vs-5-point endpoint-stencil MISMATCH between pEcoll and pSigma: recomputing
        the closed form with pEcoll on the SAME 5-point OLS stencil as pSigma collapses the net cubic bias
        to zero, and the crossing recedes to +infinity in both the closed form and the exact bisection
        (never re-crossing zero for k in [10, 35]). Readers should not read the -0.28 offset as a
        competing ceiling. This dissolution -- the matched stencil removing{' '}
        {(IMP34311_M2_CLOSEDFORM_5POINT_ENDPOINT_STENCIL_SHARE.residualShareRemoved * 100).toFixed(0)}% of the
        residual -- quantitatively CONFIRMS imp-34127/imp-34302's own estimator-bias attribution for the
        21.28095 ceiling, rather than exposing a distinct derivation error. Measurement only; no bound changes.
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
        <strong style={{ color: 'var(--ink-soft)' }}>
          imp-34314 two-path bisection residual (what imp-34302 gates but never tabulates):
        </strong>{' '}
        the imp-34302 gate live-imports imp-34127's OWN independent bisection{' '}
        (kEnd_bisected = {IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL.kEndBisectedImp34127}) and the
        imp-34023/imp-34237 canonical ceiling{' '}
        (kEnd* = {IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL.kEndStarCanonical}) and only asserts they
        agree to within 1e-2 -- without recording the residual. Measured explicitly, kEnd_bisected - kEnd* ={' '}
        {IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL.twoPathResidual}; including the 1e-4 quantization of
        imp-34127's published literal the true two-path agreement is bounded by{' '}
        {IMP34314_M2_CEILING_TWO_PATH_BISECTION_RESIDUAL.agreementUpperBound}, a quantified confirmation that
        the two independent code paths land on the same canonical ceiling. Measurement only; no bound changes.
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
        <strong style={{ color: 'var(--ink-soft)' }}>imp-34188 widening-slope limit (imp-34282):</strong>{' '}
        {IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE.summary}
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
        <strong style={{ color: 'var(--ink-soft)' }}>imp-34233 combined-grid ceiling contest:</strong> stitching
        imp-34109's kEnd = 14..20 grid to imp-34169's three computable windows (kEnd 20.0, 20.5, 21.0 --
        the last defined before the k*~21.28 surrogate pole) and re-running the bounded a - b/kEnd
        ceiling fit against the unbounded log form shows the bounded ceiling is{' '}
        <strong style={{ color: 'var(--ink-soft)' }}>NOT selected</strong> up to the pole: the nominal ceiling
        a&nbsp;~&nbsp;{IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.saturatingFit.ceiling}{' '}
        (R&sup2;&nbsp;~&nbsp;{IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.saturatingFit.r2}) loses
        to the unbounded log form (R&sup2;&nbsp;~&nbsp;
        {IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.logFit.r2}) by an AIC gap of ~+
        {IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.aicGapSatMinusLog}, and the
        re-acceleration is steep enough that even the unbounded LINEAR form (R&sup2;&nbsp;~&nbsp;
        {IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.linearFit.r2}) overtakes the log form
        (AIC gap ~+{IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.aicGapLogMinusLin}). Measurement
        only, not an RH bound; no finite ceiling is supported within kEnd &le; k*~21.28.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reconciling the log-vs-linear flip (imp-34233 vs imp-34109):</strong>{' '}
        on imp-34109's kEnd = 14..20 grid the unbounded log form beat linear (R&sup2;&nbsp;
        {IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.logFit.r2}&nbsp;&gt;&nbsp;
        {IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.linearFit.r2}), while on the imp-34233 combined
        grid extended to kEnd = 21.0 the unbounded LINEAR form overtakes the log (R&sup2;&nbsp;
        {IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.linearFit.r2}&nbsp;&gt;&nbsp;
        {IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.logFit.r2}). These two readings are not in
        tension: the flip is driven entirely by the two extra imp-34169 windows (kEnd 20.5, 21.0) imp-34233
        stitches onto imp-34109's grid -- both windows re-accelerate steeply (increments
        0.040658&nbsp;&rarr;&nbsp;0.050639&nbsp;&rarr;&nbsp;0.080391, strictly positive second differences),
        which pulls the best-fit form away from the log's curvature and toward the least-bounded linear
        form. Neither reading is wrong; imp-34233's grid is simply longer and its tail steeper. Measurement
        only; no RH bound changes.
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
        <strong style={{ color: 'var(--ink-soft)' }}>imp-34285 closed-form gap attribution (no dedicated viz page):</strong>{' '}
        of the ~{IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.gap} kEnd gap between the imp-34127 closed form
        ({IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.kEndClosedForm}) and the direct-bisection ceiling
        ({IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.kEndDirect}), dropping the E_flow term shifts the root
        by only {IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.eflowTerm.rootShiftFromDroppingEflow} (share{' '}
        {IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.eflowTerm.shareOfGap} of the gap) -- essentially none of
        it. The entire gap is instead the higher-order-in-D remainder of two nearly-cancelling
        finite-vs-continuum estimator biases (ratio {IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.estimatorBias.biasCancellationRatio}).
        Decomposition only; no RH bound changes.
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
        <strong style={{ color: 'var(--ink-soft)' }}>
          M2-residual kEnd-gap decomposition sub-cohort provenance rollup (imp-34381):
        </strong>{' '}
        imp-34285/imp-34286/imp-34287/imp-34288 form one decomposition sub-cohort of the M2-residual
        kEnd gap. Auditable in one place -- each module's reuse gate against its inherited source and
        its sub-gap status (open vs closed):
        <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.78rem' }}>
            <thead>
              <tr>
                {['Module', 'Measures', 'Reuse gate', 'Sub-gap'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '0.35rem 0.5rem',
                      borderBottom: '1px solid var(--rule)',
                      color: 'var(--ink-soft)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KEND_GAP_DECOMPOSITION_SUB_COHORT.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)', fontWeight: 600 }}>
                    {row.id}
                  </td>
                  <td style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--rule-soft)' }}>{row.measures}</td>
                  <td style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--rule-soft)' }}>{row.reuseGate}</td>
                  <td style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--rule-soft)' }}>{row.subGap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        Citation/provenance audit only; no new derivation; no bound changed.
      </div>
    </div>
  );
}
