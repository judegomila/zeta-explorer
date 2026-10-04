import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { ED } from '../styles/tokens.js';

// Import-light: literals baked verbatim from
// src/data/imp-35324-r2-n2000-finer-grid-reference.js (the finer tauC/4000
// base-grid re-run at N=2000). No data-module import, no recomputation.
const T_C_HI = 0.0012; // imp-857 map bracket upper endpoint, N=2000
const REFERENCES = [
  { label: 'RK4 dt', t_c: 0.0011925112320 },
  { label: 'DP45 dt', t_c: 0.0011925112320 },
  { label: 'RK4 dt/2', t_c: 0.0011923626880 },
  { label: 'DP45 dt/2', t_c: 0.0011999384320, worstCase: true },
].map((r) => ({ ...r, slack: T_C_HI - r.t_c }));

const WORST_CASE_SLACK = Math.min(...REFERENCES.map((r) => r.slack));

function EnvelopeChart() {
  const svgW = 660;
  const padL = 90;
  const padR = 24;
  const padT = 36;
  const padB = 40;
  const rowH = 44;
  const plotW = svgW - padL - padR;
  const plotH = rowH * REFERENCES.length;
  const svgH = padT + plotH + padB;

  // Log scale on slack (all four references clear t_c_hi, so all slacks > 0).
  const xMin = Math.log10(3e-8);
  const xMax = Math.log10(1e-5);
  const xOf = (slack) => padL + ((Math.log10(slack) - xMin) / (xMax - xMin)) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 14} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        N=2000 collision envelope: slack = t_c_hi - t_c per reference (log scale)
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {REFERENCES.map((r, i) => {
        const y = padT + i * rowH + rowH / 2;
        const x = xOf(r.slack);
        const color = r.worstCase ? ED.series4 : ED.series3;
        return (
          <g key={r.label}>
            <text x={padL - 10} y={y + 4} textAnchor="end" fill={ED.ink} fontSize={10.5}>
              {r.label}
            </text>
            <line x1={padL} y1={y} x2={x} y2={y} stroke={color} strokeWidth={2} strokeOpacity={0.55} />
            <circle cx={x} cy={y} r={r.worstCase ? 6 : 4.5} fill={color} />
            <text x={x + 10} y={y + 4} fill={color} fontSize={9.5}>
              {r.slack.toExponential(3)}
            </text>
          </g>
        );
      })}

      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.25}
      />
      {[3e-8, 1e-7, 1e-6, 1e-5].map((v) => (
        <text key={v} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {v.toExponential(0)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        slack below t_c_hi = 1.2e-3 (log scale)
      </text>
    </svg>
  );
}

export default function Imp35362N2000CollisionEnvelopeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="N=2000 Collision-Envelope Bracket: Four Finer-Grid References vs t_c_hi (imp-35362 / imp-35324)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35324 re-ran the imp-35235 R2 order-robust flow test at N=2000 on a base grid four times
        finer (dt&nbsp;=&nbsp;tauC_est/4000), resolving the imp-35235 DP45 dt/2 gate-skip. All four
        cross-family, cross-grid references (RK4 and DP45, each at dt and dt/2) now land below the
        imp-857 map bracket upper endpoint t_c_hi&nbsp;=&nbsp;{T_C_HI.toExponential(4)}. The chart plots
        each reference&apos;s slack (t_c_hi&nbsp;&minus;&nbsp;t_c) on a log scale: the worst case, DP45
        dt/2, clears by only {WORST_CASE_SLACK.toExponential(3)} &mdash; a knife-edge roughly two orders
        of magnitude thinner than the other three references.
      </p>

      <EnvelopeChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>reference</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>t_c</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>slack (t_c_hi &minus; t_c)</th>
          </tr>
        </thead>
        <tbody>
          {REFERENCES.map((r) => (
            <tr key={r.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>
                {r.label}
                {r.worstCase ? ' (worst case)' : ''}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.t_c.toExponential(10)}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: r.worstCase ? 'var(--series-4)' : 'var(--series-3)',
                }}
              >
                {r.slack.toExponential(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page baking the imp-35324
        finer-grid literals verbatim (no new computation, no data-module import). The clearance is
        marginal, not full-precision (the dt/2 cross-family gap is nonzero, unlike the exact tie at
        dt); per imp-35324 the R2 ladder largest-N-robustly-certified stays at 1000, NOT advanced to
        2000. C_mb stays GUE-conditional (imp-486); changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
