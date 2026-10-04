import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import { IMP35791_NSIGMA_LADDER } from '../data/imp-35791-beat-parity-Nsigma-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const LINE_COLOR = ED.series1;

function LadderChart({ rows }) {
  const w = 720;
  const h = 260;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const logX = (N) => Math.log10(N);
  const xMin = logX(rows[0].N) - 0.6;
  const xMax = logX(rows[rows.length - 1].N) + 0.6;
  const yMin = 0;
  const yMax = 1;
  const xPix = (N) => padL + ((logX(N) - xMin) / (xMax - xMin)) * plotW;
  const yPix = (sigma) => padT + plotH - ((sigma - yMin) / (yMax - yMin)) * plotH;

  const path = rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.N)},${yPix(r.sigma)}`).join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill={ED.paper} rx={2} />

      <line
        x1={padL}
        x2={padL + plotW}
        y1={yPix(0.5)}
        y2={yPix(0.5)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={padL + plotW - 4} y={yPix(0.5) - 4} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        sigma = 0.5 (handoff midpoint)
      </text>

      <path d={path} fill="none" stroke={LINE_COLOR} strokeWidth={2} />
      {rows.map((r) => (
        <g key={r.label}>
          <circle cx={xPix(r.N)} cy={yPix(r.sigma)} r={4} fill={LINE_COLOR} />
          <text x={xPix(r.N)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            {r.label} ({r.N.toExponential(2)})
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={12} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,12,${padT + plotH / 2})`}>
        sigma
      </text>
      <text x={padL + plotW / 2} y={h - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale)
      </text>
    </svg>
  );
}

function LadderTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>sigma</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.label}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(3)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: LINE_COLOR }}>
              {r.sigma.toFixed(4)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>{r.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35975BeatParityNsigmaLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Beat-to-Parity Handoff Ladder on the N-Axis (imp-35975 / imp-35791)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35723 located three landmark rungs on the sigma(N) ladder: the
        interior beat-regime peak (N &asymp; 9.219e5, sigma &asymp; 0.9494), the
        imp-35750 mathematical handoff midpoint mapped onto N (N &asymp; 3.267e9,
        sigma = 0.5), and the deep parity-regime onset (N &asymp; 3.213e11, sigma
        = 0.1). imp-35791 baked these three rungs as an N-ordered ladder for
        direct charting; this page renders that module, which previously had no
        routed page.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        sigma(N) across the beat-to-parity handoff ladder
      </h3>
      <LadderChart rows={IMP35791_NSIGMA_LADDER} />

      <div style={{ marginTop: '1.5rem' }}>
        <LadderTable rows={IMP35791_NSIGMA_LADDER} />
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only of
        the already-derived imp-35723/imp-35791 ladder (no new derivation, no
        heavy data-module import); C_mb GUE-conditional (imp-486) UNTOUCHED; changes no
        bound, establishes no operator positivity, no RH verdict. NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
