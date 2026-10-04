import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY } from '../data/imp-34009-aggregate-share-window-endpoint-sensitivity.js';
import { ED } from '../styles/tokens.js';

const { windows: WINDOWS, drift: DRIFT, finding: FINDING } = IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY;

// Primary chart: the aggregate |ln F2| share vs symmetric inward trim m=0..9 (window 5.0->0.5
// decades), marking the full-window headline (m=0, 0.9225), the non-monotone peak (m=1, 0.9462,
// where F4 crosses unity), and the innermost-window minimum (m=9, 0.7458).
function ShareChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minM = 0;
  const maxM = 9;
  const minShare = 0.72;
  const maxShare = 0.96;

  const xAt = (m) => padL + ((m - minM) / (maxM - minM)) * cW;
  const yAt = (s) => padT + cH - ((s - minShare) / (maxShare - minShare)) * cH;

  const peakIdx = WINDOWS.findIndex((w) => w.m === 1);
  const innerIdx = WINDOWS.length - 1;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline
        points={WINDOWS.map((w) => `${xAt(w.m)},${yAt(w.agg_F2_share)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.75}
      />
      {WINDOWS.map((w, i) => (
        <circle
          key={w.m}
          cx={xAt(w.m)}
          cy={yAt(w.agg_F2_share)}
          r={i === 0 || i === peakIdx || i === innerIdx ? 5 : 3}
          fill={i === peakIdx ? ED.series7 : i === innerIdx ? ED.brassDeco : ED.series1}
          stroke={ED.paper}
          strokeWidth={1}
        />
      ))}
      <text x={xAt(0)} y={yAt(WINDOWS[0].agg_F2_share) - 12} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        0.9225 (full, 5.0 dec)
      </text>
      <text x={xAt(1)} y={yAt(WINDOWS[peakIdx].agg_F2_share) - 12} textAnchor="middle" fill={ED.series7} fontSize={9.5}>
        0.9462 peak (F4=1 crossing)
      </text>
      <text
        x={xAt(9)}
        y={yAt(WINDOWS[innerIdx].agg_F2_share) + 16}
        textAnchor="middle"
        fill={ED.brass}
        fontSize={9.5}
      >
        0.7458 (inner, 0.5 dec)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        m (rungs trimmed symmetrically from each end; window 5.0 &rarr; 0.5 decades)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        aggregate |ln F2| share
      </text>
    </svg>
  );
}

// Secondary readout: the smooth monotone F2/F3 factor drifts and the non-monotone F4 factor
// (which crosses unity at m=1 and drives the share bump) plotted together vs m.
function FactorDriftChart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minM = 0;
  const maxM = 9;
  const minY = 0;
  const maxY = 1.45;

  const xAt = (m) => padL + ((m - minM) / (maxM - minM)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;
  const yUnity = yAt(1);

  const series = [
    { key: 'agg_F2', color: ED.series1, label: 'F2 (normaliser ratio, 0.063→7.575)' },
    { key: 'agg_F3', color: ED.series5, label: 'F3 (slope ratio, 0.907→0.991)' },
    { key: 'agg_F4', color: ED.series7, label: 'F4 (residual ratio, 0.874→1.371→1.090; non-monotone)' },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yUnity} x2={padL + cW} y2={yUnity} stroke={ED.rule} strokeWidth={1} strokeDasharray="3,3" />
      <text x={padL + cW} y={yUnity - 4} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        unity
      </text>
      {series.map((s) => (
        <polyline
          key={s.key}
          points={WINDOWS.map((w) => `${xAt(w.m)},${yAt(w[s.key])}`).join(' ')}
          fill="none"
          stroke={s.color}
          strokeWidth={1.75}
        />
      ))}
      {series.map((s) =>
        WINDOWS.map((w) => {
          const isF4UnityCrossing = s.key === 'agg_F4' && w.m === 1;
          return (
            <circle
              key={`${s.key}-${w.m}`}
              cx={xAt(w.m)}
              cy={yAt(w[s.key])}
              r={isF4UnityCrossing ? 5.5 : 2.75}
              fill={s.color}
              stroke={isF4UnityCrossing ? ED.paper : 'none'}
              strokeWidth={isF4UnityCrossing ? 1.25 : 0}
            />
          );
        })
      )}
      <text
        x={xAt(1)}
        y={yAt(WINDOWS[1].agg_F4) - 10}
        textAnchor="middle"
        fill={ED.series7}
        fontSize={9}
      >
        F4={WINDOWS[1].agg_F4.toFixed(3)} (crosses unity here, m=1 -- drives the R2 share bump)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        m (rungs trimmed symmetrically from each end)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        aggregate factor value
      </text>
      {series.map((s, i) => (
        <text key={`legend-${s.key}`} x={padL + 4} y={padT + 12 + i * 14} fill={s.color} fontSize={9.5}>
          {s.label}
        </text>
      ))}
    </svg>
  );
}

export default function Imp34099AggregateShareWindowSensitivityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Aggregate F2-Share Window-Endpoint Sensitivity (imp-34009 / imp-34099)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33962 read the "92% of the attenuation is F2" headline off the full 5-decade head-to-tail
        window of the imp-33810 ladder (k=6.00..11.00). imp-34009 tests how contingent that{' '}
        {DRIFT.share_full_window} figure is on the endpoint choice, shrinking the window symmetrically
        inward by m={'{0..9}'} rungs from each end. The share does not fall monotonically: it first
        bumps up to a peak {DRIFT.share_m1_window} at m=1 (where the aggregate residual factor F4
        crosses unity) before declining strictly to {DRIFT.share_inner_window} on the innermost
        0.5-decade window &mdash; a total spread of {DRIFT.share_spread} and a{' '}
        {DRIFT.headline_drop_full_to_inner} drop from the full-window headline.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        aggregate |ln F2| share vs symmetric inward trim m
      </p>
      <ShareChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        secondary readout: the F2/F3/F4 aggregate factor drifts underlying the share (F2, F3 smooth and
        monotone; F4 non-monotone, crossing unity at m=1)
      </p>
      <FactorDriftChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {FINDING.R1_headline_is_endpoint_contingent}{' '}
        {FINDING.R2_drift_is_non_monotone_bumps_up_at_first_shrink} Endpoint-sensitivity diagnostic only,
        reusing the inherited imp-3220/imp-3406 component model verbatim; no fresh derivation, no bound
        changed, no operator positivity established; imp-3066 K_a&gt;=0 untouched; C_mb GUE-conditional
        per imp-486 untouched; NO QED. This symmetric sweep
        does not attribute the drift to either endpoint &mdash; see the{' '}
        <Link to="/viz-imp34156-asymmetric-trim-attribution" style={{ color: 'var(--series-1)' }}>
          imp-34086 head-vs-tail asymmetric-trim follow-up
        </Link>{' '}
        for that decomposition.
      </div>
    </div>
  );
}
