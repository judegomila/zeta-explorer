import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35236_EFLOW_FARTAIL_INVERSE_SWAP_ISOLATION } from '../data/imp-35236-eflow-fartail-inverse-swap-isolation.js';

// Baked literals imported verbatim from the imp-35236 data module; no new
// computation is performed here (viz/UX only).
const { anchors: ANCHORS } = IMP35236_EFLOW_FARTAIL_INVERSE_SWAP_ISOLATION;

function StackedResidualChart() {
  const svgW = 640;
  const padL = 70;
  const padR = 24;
  const padT = 50;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const yMax = 0.014;
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;

  const barW = 110;
  const gap = (plotW - 2 * barW) / 3;
  const xOf = (i) => padL + gap + i * (barW + gap);

  const yTicks = [0, 0.004, 0.008, 0.012];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 30} fill="#94a3b8" fontSize={11} fontWeight={700}>
        imp-35236 E_flow far-tail residual: inverse-swap gap vs closed-form/prefactor remnant
      </text>

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}

      {ANCHORS.map((a, i) => {
        const x = xOf(i);
        const swapTop = yOf(a.inverseSwapGap);
        const swapBottom = padT + plotH;
        const remnantTop = yOf(a.inverseSwapGap + a.closedFormRemnant);
        return (
          <g key={a.N}>
            <rect
              x={x}
              y={swapTop}
              width={barW}
              height={swapBottom - swapTop}
              fill="#a78bfa"
              stroke="#7c3aed"
              strokeWidth={1}
            />
            <rect
              x={x}
              y={remnantTop}
              width={barW}
              height={swapTop - remnantTop}
              fill="#f87171"
              stroke="#dc2626"
              strokeWidth={1}
            />
            <text
              x={x + barW / 2}
              y={remnantTop - 8}
              textAnchor="middle"
              fill="#4ade80"
              fontSize={9.5}
              fontWeight={700}
            >
              {a.analyticResidualVsMeasured.toFixed(4)}
            </text>
            <text x={x + barW / 2} y={svgH - padB + 18} textAnchor="middle" fill="#64748b" fontSize={10}>
              N = {a.N.toExponential(0)}
            </text>
          </g>
        );
      })}

      <g>
        <rect x={padL + 4} y={padT - 22} width={14} height={10} fill="#a78bfa" stroke="#7c3aed" />
        <text x={padL + 24} y={padT - 13} fill="#a78bfa" fontSize={8.5}>
          inverse-swap gap (surrogate-vs-true-RvM-inverse)
        </text>
        <rect x={padL + 280} y={padT - 22} width={14} height={10} fill="#f87171" stroke="#dc2626" />
        <text x={padL + 300} y={padT - 13} fill="#f87171" fontSize={8.5}>
          closed-form-Taylor + prefactor remnant
        </text>
      </g>
    </svg>
  );
}

export default function Imp35295EflowFartailResidualDecompositionViz() {
  const top = ANCHORS[0];
  const deep = ANCHORS[1];
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Far-Tail Residual Decomposition: Swap Gap + Closed-Form Remnant (imp-35295)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35236 isolated the imp-35217/imp-35198 residual between the derived E_flow far-tail
        exponent law and the imp-35135 measured exponent into two stacked contributions: the
        directly-measured inverse-swap gap (surrogate-vs-true-RvM-inverse height map) and a
        closed-form-Taylor-plus-prefactor remnant. The two stack to the imp-35217 leading residual
        at both anchors.
      </p>

      <StackedResidualChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>inverse-swap gap</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>closed-form/prefactor remnant</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sum (leading residual)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>swap share</th>
          </tr>
        </thead>
        <tbody>
          {ANCHORS.map((a) => (
            <tr key={a.N} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.inverseSwapGap.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.closedFormRemnant.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: '#4ade80' }}>
                {a.analyticResidualVsMeasured.toFixed(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {((100 * a.inverseSwapGap) / a.analyticResidualVsMeasured).toFixed(0)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem' }}>
        At N = {top.N.toExponential(0)} the inverse-swap gap ({top.inverseSwapGap.toFixed(4)}) is the
        bulk of the leading residual, with a {top.closedFormRemnant.toFixed(4)} closed-form/prefactor
        remnant left over (imp-35236 F3: swap dominant but not sole). At N = {deep.N.toExponential(0)}
        {' '}the swap gap ({deep.inverseSwapGap.toFixed(4)}) and remnant ({deep.closedFormRemnant.toFixed(4)})
        are closer in size, and together still reconstruct the leading residual
        ({deep.analyticResidualVsMeasured.toFixed(4)}) to within baked-literal rounding.
      </p>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> Viz-only page reusing the
        imp-35236 baked anchors literals verbatim (no new computation). Measurement only on the
        inherited imp-3220/imp-3406 extrapolation, NOT rigorous; E_flow &gt; 0 strictness
        (imp-33848) untouched; C_mb GUE-conditional (imp-486) untouched; changes no bound;
        establishes no operator positivity; no RH verdict, NO QED. Platt-Trudgian Lambda &le; 0.2
        remains SOTA.
      </div>
    </div>
  );
}
