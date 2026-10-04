import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35823_LADDER_GRID,
  IMP35823_LOG_T0_NEEDED,
} from '../data/imp-35823-required-height-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const MULTIPLE_COLOR = ED.series7;
const GAP_COLOR = ED.series1;

function LadderChart({ rows }) {
  const w = 720;
  const h = 280;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 56;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const xMin = rows[0].logT0;
  const xMax = rows[rows.length - 1].logT0;
  const xPix = (logT0) => padL + ((logT0 - xMin) / (xMax - xMin)) * plotW;

  const yMax = Math.max(...rows.map((r) => r.requiredMultiple)) * 1.05;
  const yPix = (multiple) => padT + plotH - (multiple / yMax) * plotH;

  const multiplePath = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.logT0)},${yPix(r.requiredMultiple)}`)
    .join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill={ED.paper} rx={2} />

      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line
            x1={padL}
            x2={padL + plotW}
            y1={padT + plotH - v * plotH}
            y2={padT + plotH - v * plotH}
            stroke={ED.ruleSoft}
            strokeWidth={0.7}
          />
          <text x={padL - 8} y={padT + plotH - v * plotH + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {(v * yMax).toFixed(1)}x
          </text>
        </g>
      ))}

      <path d={multiplePath} fill="none" stroke={MULTIPLE_COLOR} strokeWidth={2} />
      {rows.map((r) => (
        <g key={r.key}>
          <circle cx={xPix(r.logT0)} cy={yPix(r.requiredMultiple)} r={3.5} fill={MULTIPLE_COLOR} />
          <text
            x={xPix(r.logT0)}
            y={padT + plotH + 16}
            textAnchor="middle"
            fill={ED.inkFaint}
            fontSize={9}
            transform={`rotate(-30,${xPix(r.logT0)},${padT + plotH + 16})`}
          >
            {r.logT0.toFixed(1)}
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90,14,${padT + plotH / 2})`}
      >
        required multiple 200 / log T0
      </text>
      <text x={padL + plotW / 2} y={h - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log T0 (landmark log-height, rising &rarr;)
      </text>
    </svg>
  );
}

function LadderTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>rung</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>log T0</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>required multiple (200/log T0)</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>residual gap (200-log T0)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>{r.label}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.logT0.toFixed(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: MULTIPLE_COLOR }}>
              {r.requiredMultiple.toFixed(2)}x
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: GAP_COLOR }}>
              {r.logHeightGap.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35823RequiredHeightLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Merged Required-Height Ladder Across Peak / Sigma / PT Rungs (imp-35823 / imp-35763)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35763 filled the interior of the imp-35722 three-rung REQ-4
        required-height ladder with the imp-33582 sigma-decay downslope
        landmarks (sigma &lt; 0.9 / 0.5 / 0.1), producing a six-rung ladder
        spanning the sigma-peak (N~9.22e5) up to the Platt-Trudgian anchor
        (T0=3e12). Each rung reports the required-height multiple{' '}
        {IMP35823_LOG_T0_NEEDED} / log T0 that the landmark log-height must
        grow by to reach the imp-35538 REQ-4 binding log-height log T0 &ge;{' '}
        {IMP35823_LOG_T0_NEEDED} (T0 &ge; e^200 ~ 7.23e86).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Required-height multiple (200/log T0) across the six-rung ladder
      </h3>
      <LadderChart rows={IMP35823_LADDER_GRID} />

      <div style={{ marginTop: '1.5rem' }}>
        <LadderTable rows={IMP35823_LADDER_GRID} />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The multiple descends monotonically as log T0 rises, but even the
        deepest rung (the PT anchor, log T0 ~ 28.73) still needs ~7x more
        log-height than it has -- no reachable landmark on this ladder binds
        the natural rate.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only of
        the already-derived imp-35763/imp-35722 required-height ladder (no new
        derivation, no heavy data-module import); C_mb GUE-conditional
        (imp-486) UNTOUCHED; imp-35337a stays OPEN; changes no bound,
        establishes no operator positivity, no RH verdict. NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35751-postport-shares-sigma', label: 'Post-Port Provenance Shares Across the Sigma-Ladder' },
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
