import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34459_MIGRATION_PROBE_ROWS,
  IMP34459_BRACKET,
} from '../data/imp-34459-peak-relocation-regime-width-viz-data.js';

// Bar chart: |trough|/|peak| ratio vs effective window width w, shading the migration bracket
// (lastEndpointLockedW, firstMigratedW] and coloring bars by whether the peak is endpoint-locked.
function RatioVsWidthBars() {
  const svgW = 640;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = IMP34459_MIGRATION_PROBE_ROWS;
  const xMin = 8.75;
  const xMax = 10.0;
  const xAt = (w) => padL + ((w - xMin) / (xMax - xMin)) * cW;

  const yMin = 0.85;
  const yMax = 0.92;
  const yAt = (v) => padT + ((yMax - v) / (yMax - yMin)) * cH;

  const yTicks = [0.85, 0.87, 0.89, 0.91];
  const barWidth = 30;

  const bracketX1 = xAt(IMP34459_BRACKET.lastEndpointLockedW);
  const bracketX2 = xAt(IMP34459_BRACKET.firstMigratedW);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect
        x={bracketX1}
        y={padT}
        width={bracketX2 - bracketX1}
        height={cH}
        fill="rgba(244,114,182,0.10)"
      />

      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {rows.map((r) => (
        <g key={r.effectiveW}>
          <rect
            x={xAt(r.effectiveW) - barWidth / 2}
            y={yAt(r.ratio)}
            width={barWidth}
            height={padT + cH - yAt(r.ratio)}
            fill={r.peakIsEndpoint ? '#38bdf8' : '#facc15'}
            stroke="#0a0f1a"
            strokeWidth={0.75}
          />
          <text
            x={xAt(r.effectiveW)}
            y={yAt(r.ratio) - 6}
            textAnchor="middle"
            fill="#cbd5e1"
            fontSize={9.5}
          >
            {r.ratio.toFixed(4)}
          </text>
          <text
            x={xAt(r.effectiveW)}
            y={padT + cH + 16}
            textAnchor="middle"
            fill="#64748b"
            fontSize={9}
          >
            w={r.effectiveW}
          </text>
        </g>
      ))}

      <line
        x1={bracketX2}
        y1={padT}
        x2={bracketX2}
        y2={padT + cH}
        stroke="#f472b6"
        strokeWidth={1.25}
        strokeDasharray="5,4"
      />
      <text x={bracketX2 + 4} y={padT + 10} fill="#f472b6" fontSize={9.5}>
        w* = {IMP34459_BRACKET.firstMigratedW}
      </text>

      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#cbd5e1" fontSize={9.5}>
        effective window width w &mdash; blue = peak endpoint-locked, amber = peak migrated
      </text>
    </svg>
  );
}

export default function Imp34459PeakRelocationRegimeWidthViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Peak-Relocation Regime-Width Bracket (imp-34369)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34288 found the imp-34085 |trough|/|peak| OLS amplitude ratio peaks at{' '}
        {IMP34459_BRACKET.lastEndpointLockedRatio} at window width w ={' '}
        {IMP34459_BRACKET.lastEndpointLockedW}, then recedes as the argmax peak migrates off the
        receding right endpoint to the near-left rung. imp-34369 sharpened this: because the
        imp-33810 ladder is quantized at dk = 0.25, the migration is a discrete step, not a
        continuous threshold &mdash; it is bracketed to the HALF-OPEN rung interval (
        {IMP34459_BRACKET.lastEndpointLockedW}, {IMP34459_BRACKET.firstMigratedW}], triggered the
        instant the k = {IMP34459_BRACKET.triggerRungK} rung is added.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        |trough|/|peak| ratio vs effective window width, with the migration bracket shaded
      </p>
      <RatioVsWidthBars />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.5rem' }}>effective w</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>peakK</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>peak regime</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>ratio</th>
          </tr>
        </thead>
        <tbody>
          {IMP34459_MIGRATION_PROBE_ROWS.map((r) => (
            <tr key={r.effectiveW} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.effectiveW}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.peakK}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>
                {r.peakIsEndpoint ? 'endpoint-locked' : 'migrated (near-left rung)'}
              </td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.ratio.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Summary:</strong> the maximum ratio (
        {IMP34459_BRACKET.lastEndpointLockedRatio}) sits at the LAST endpoint-locked width w ={' '}
        {IMP34459_BRACKET.lastEndpointLockedW}; the peak relocates to k = 6.5 the instant the
        k = {IMP34459_BRACKET.triggerRungK} rung is added (w* = {IMP34459_BRACKET.firstMigratedW}).
        Because the ladder is quantized at dk = 0.25, every kEnd strictly between two rungs
        reproduces the lower rung&apos;s fit exactly &mdash; so the migration width is not a
        continuously-resolvable parameter, it is bracketed to this single half-open rung interval.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34369 measurement; no new derivation, no bound changed. Component
        model is the inherited surrogate diagnostic, NOT a rigorous asymptotic; C_mb GUE-conditional
        per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; NO QED; Platt-Trudgian Lambda&le;0.2
        remains the SOTA unconditional bound.
      </div>
    </div>
  );
}
