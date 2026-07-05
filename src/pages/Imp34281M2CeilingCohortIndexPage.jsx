import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE } from '../data/imp-34282-b-inf-descriptive-vs-derivation-status-note.js';
import { IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP } from '../data/imp-34211-closedform-vs-bisection-kend-gap.js';
import { IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST } from '../data/imp-34233-fixed-band-peak-combined-grid-ceiling-contest.js';

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
];

export default function Imp34281M2CeilingCohortIndexPage() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="M2-Residual Sign-Change Ceiling Cohort (imp-34281)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        The imp-34023 -&gt; imp-34127 -&gt; imp-34189 -&gt; imp-34169/imp-34237 chain (plus
        imp-34188 and imp-34196) all measure the same kEnd*~21.281 point where the M2 sub-leading
        residual bisects to zero, but the readings were shipped across separate viz pages with no
        shared landing surface. This index groups the three navigable viz pages so the cohort can
        be read as one story. The canonical cross-reference synthesizing all six modules'
        honest status lives in the glossary (imp-34278 entry, see <Link to="/wiki">Wiki</Link>).
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {COHORT.map((entry) => (
          <Link
            key={entry.id}
            to={entry.path}
            style={{
              display: 'block',
              padding: '0.85rem 1rem',
              background: 'rgba(148,163,184,0.04)',
              borderLeft: '3px solid #334155',
              borderRadius: '0 4px 4px 0',
              textDecoration: 'none',
            }}
          >
            <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.9rem' }}>
              {entry.title} <span style={{ color: '#64748b', fontWeight: 400 }}>({entry.id})</span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.25rem' }}>
              {entry.summary}
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>imp-34211 closed-form vs bisection kEnd (two ceiling readings, side by side):</strong>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
          <span>
            <span style={{ color: '#94a3b8' }}>closed form (imp-34127):</span>{' '}
            {IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.kEndClosedForm}
          </span>
          <span>
            <span style={{ color: '#94a3b8' }}>direct bisection (imp-34150, canonical):</span>{' '}
            {IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.kEndDirectBisect}
          </span>
          <span>
            <span style={{ color: '#94a3b8' }}>gap:</span>{' '}
            {IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.gap.absolute} abs (
            {(IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.gap.relative * 100).toFixed(2)}% rel)
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> this is a navigation aid over
        already-published measurements. kEnd*~21.281 is a real, reproducible, well-conditioned
        number attached to one specific inherited surrogate at one specific window width -- not a
        derived mathematical ceiling. It changes no bound and patches no literal. C_mb
        GUE-conditional per imp-486 untouched; imp-3066 K_a&ge;0 untouched; RH-equivalent, NO QED;
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>imp-34188 widening-slope limit (imp-34282):</strong>{' '}
        {IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE.summary}
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>imp-34233 combined-grid ceiling contest:</strong> stitching
        imp-34109's kEnd = 14..20 grid to imp-34169's three computable windows (kEnd 20.0, 20.5, 21.0 --
        the last defined before the k*~21.28 surrogate pole) and re-running the bounded a - b/kEnd
        ceiling fit against the unbounded log form shows the bounded ceiling is{' '}
        <strong style={{ color: '#94a3b8' }}>NOT selected</strong> up to the pole: the nominal ceiling
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
    </div>
  );
}
