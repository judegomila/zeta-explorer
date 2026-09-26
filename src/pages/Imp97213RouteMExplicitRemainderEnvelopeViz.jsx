import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97170_ENVELOPE_ROWS,
  IMP97170_FAMILY_SUMMARY,
  IMP97170_VERDICT,
} from '../data/imp-97170-route-m-explicit-remainder-envelope-viz-data.js';

// imp-97213: the imp-97170 viz-data leaf (eps(b) explicit remainder envelope vs measured L0/L1
// residual, baked from imp-97133) had no chart consumer yet. This page renders it as a log-log
// scatter of epsBound(b) vs measuredRel(b) for every sampled b, colored by family (prime / smooth /
// primorial), plus a ratio ladder showing how tight the envelope is per family.

const FAMILY_COLOR = {
  prime: '#4ade80',
  smooth: '#38bdf8',
  primorial: '#f87171',
};

function ScatterChart({ rows }) {
  const svgW = 680;
  const svgH = 360;
  const padL = 70;
  const padR = 30;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logEps = rows.map((r) => Math.log10(r.epsBound));
  const logMeas = rows.map((r) => Math.log10(r.measuredRel));
  const allLog = [...logEps, ...logMeas];
  const minLog = Math.min(...allLog);
  const maxLog = Math.max(...allLog);

  const xAt = (v) => padL + ((v - minLog) / (maxLog - minLog)) * cW;
  const yAt = (v) => padT + cH - ((v - minLog) / (maxLog - minLog)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* diagonal ratio=1 reference line: measuredRel = epsBound */}
      <line
        x1={xAt(minLog)}
        y1={yAt(minLog)}
        x2={xAt(maxLog)}
        y2={yAt(maxLog)}
        stroke="#475569"
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={xAt(maxLog) - 6} y={yAt(maxLog) - 8} textAnchor="end" fill="#64748b" fontSize={9} fontFamily="monospace">
        ratio = 1
      </text>
      <text x={svgW - padR} y={svgH - padB + 30} textAnchor="end" fill="#64748b" fontSize={9.5} fontFamily="monospace">
        log10 eps(b) bound &rarr;
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={9.5}
        fontFamily="monospace"
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        log10 measured relative residual
      </text>
      {rows.map((row) => {
        const cx = xAt(Math.log10(row.epsBound));
        const cy = yAt(Math.log10(row.measuredRel));
        return (
          <g key={row.b}>
            <circle cx={cx} cy={cy} r={5} fill={FAMILY_COLOR[row.family]} opacity={0.9} />
            <text x={cx} y={cy - 9} textAnchor="middle" fill="#94a3b8" fontSize={8.5} fontFamily="monospace">
              b={row.b}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RatioLadderChart({ rows }) {
  const svgW = 640;
  const rowH = 30;
  const padL = 70;
  const padR = 110;
  const padT = 20;
  const svgH = padT + rows.length * rowH + 16;
  const cW = svgW - padL - padR;
  const logRatios = rows.map((r) => Math.log10(r.ratio));
  const maxLog = Math.max(...logRatios);
  const minLog = Math.min(...logRatios);
  const xAt = (v) => ((v - minLog) / (maxLog - minLog)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((row, idx) => {
        const y = padT + idx * rowH;
        const w = Math.max(4, xAt(Math.log10(row.ratio)));
        return (
          <g key={row.b}>
            <text x={padL - 8} y={y + rowH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={9.5} fontFamily="monospace">
              b={row.b}
            </text>
            <rect x={padL} y={y + 5} width={cW} height={rowH - 12} fill="#1e293b" rx={3} />
            <rect x={padL} y={y + 5} width={w} height={rowH - 12} fill={FAMILY_COLOR[row.family]} rx={3} />
            <text x={padL + w + 6} y={y + rowH / 2 + 4} fill="#e2e8f0" fontSize={9} fontFamily="monospace">
              ratio &asymp; {row.ratio.toExponential(2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97213RouteMExplicitRemainderEnvelopeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Explicit Remainder Envelope vs Measured Residual" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.06)',
          borderLeft: '3px solid #64748b',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#e2e8f0' }}>Honest status:</strong> the imp-97133 eps(b) envelope
        upper-bounds the measured relative L0/L1 residual on every sampled b (ratio &lt; 1
        throughout); it is tight (ratio &asymp; 0.16&ndash;0.20, green) on prime b and loose by 4&ndash;5
        orders of magnitude (ratio &asymp; 1e-5&ndash;1e-6, red) on primorial b. This is a measurement
        display, not a new bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Log-log scatter of the imp-97133 explicit envelope eps(b) against the measured relative
        residual it bounds, per sampled b. Points below the dashed ratio=1 diagonal satisfy the
        bound; distance below the line shows slack. Green = prime b, blue = smooth b, red = primorial b.
      </p>
      <ScatterChart rows={IMP97170_ENVELOPE_ROWS} />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '1.25rem 0 0.5rem', maxWidth: 700 }}>
        Ratio ladder (measuredRel / epsBound) per b, log axis: primes cluster near{' '}
        {IMP97170_FAMILY_SUMMARY.prime.ratioMin}&ndash;{IMP97170_FAMILY_SUMMARY.prime.ratioMax}, while
        primorials fall to {IMP97170_FAMILY_SUMMARY.primorial.ratioMin}&ndash;
        {IMP97170_FAMILY_SUMMARY.primorial.ratioMax}.
      </p>
      <RatioLadderChart rows={IMP97170_ENVELOPE_ROWS} />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97170_VERDICT.conclusion}
      </div>
    </div>
  );
}
