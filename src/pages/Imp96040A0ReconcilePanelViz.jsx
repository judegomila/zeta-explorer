import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96040_A0_ROWS,
  IMP96040_MEAN_SE,
  IMP96040_CONJECTURAL,
  IMP96040_CAVEAT_BANNER,
} from '../data/imp-96040-a0-reconcile-panel-viz-data.js';

// scatter of a_0(T) across the six accessible heights, with the sample mean,
// a +/-SE band, and the imp-95984 published conjectural line overlaid.
function A0ScatterChart() {
  const svgW = 560;
  const svgH = 280;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const { mean, seMean } = IMP96040_MEAN_SE;
  const { value: conjectural } = IMP96040_CONJECTURAL;
  const a0Vals = IMP96040_A0_ROWS.map((r) => r.a0);
  const logTs = IMP96040_A0_ROWS.map((r) => Math.log10(r.Tc));
  const minLogT = Math.min(...logTs);
  const maxLogT = Math.max(...logTs);

  const allVals = [...a0Vals, mean - seMean, mean + seMean, conjectural];
  const minV = Math.min(...allVals) - 0.06;
  const maxV = Math.max(...allVals) + 0.06;

  const xOf = (logT) => padL + ((logT - minLogT) / (maxLogT - minLogT)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minV) / (maxV - minV)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke="#64748b"
        strokeWidth={1.5}
      />
      <text x={4} y={padT + 4} fill="#94a3b8" fontSize={10}>
        a_0(T)
      </text>
      <text x={padL + plotW - 40} y={svgH - 4} fill="#94a3b8" fontSize={10}>
        log10 T &#8594;
      </text>

      {/* +/- SE band around the sample mean */}
      <rect
        x={padL}
        y={yOf(mean + seMean)}
        width={plotW}
        height={yOf(mean - seMean) - yOf(mean + seMean)}
        fill="#60a5fa"
        opacity={0.12}
      />
      <line
        x1={padL}
        y1={yOf(mean)}
        x2={padL + plotW}
        y2={yOf(mean)}
        stroke="#60a5fa"
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + plotW - 4} y={yOf(mean) - 4} fill="#60a5fa" fontSize={9} textAnchor="end">
        mean {mean.toFixed(5)} &plusmn; SE {seMean.toFixed(5)}
      </text>

      {/* conjectural a_0 = -0.176248 line (imp-95984, I_F = 1) */}
      <line
        x1={padL}
        y1={yOf(conjectural)}
        x2={padL + plotW}
        y2={yOf(conjectural)}
        stroke="#f87171"
        strokeWidth={1.5}
      />
      <text x={padL + 4} y={yOf(conjectural) - 4} fill="#f87171" fontSize={9} textAnchor="start">
        conjectural (I_F=1) {conjectural.toFixed(6)}
      </text>

      {IMP96040_A0_ROWS.map((row) => {
        const x = xOf(Math.log10(row.Tc));
        const y = yOf(row.a0);
        return (
          <g key={row.Tc}>
            <circle cx={x} cy={y} r={3.5} fill="#facc15" />
            <text x={x} y={y - 8} fill="#facc15" fontSize={9} textAnchor="middle">
              {row.a0.toFixed(3)}
            </text>
            <text x={x} y={svgH - padB + 14} fill="#64748b" fontSize={9} textAnchor="middle">
              {row.Tc.toExponential(0)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp96040A0ReconcilePanelViz() {
  const { zScore, pTwoSided } = IMP96040_CONJECTURAL;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Six-Height a_0 Scatter vs Conjectural Line (imp-96005 / imp-96040)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96040_CAVEAT_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-96005 reconciliation backed a_0(T) out of the six accessible heights
        (T = 1e4..5e5, yellow points), computed the sample mean and standard error (blue
        band), and compared it against the imp-95984 published conjectural value under
        Montgomery-conjectural I_F = 1 (red line). This panel renders that comparison,
        annotated with z = {zScore.toFixed(3)} / p &#8776; {pTwoSided.toFixed(3)}.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        a_0(T) across the six accessible heights
      </h3>
      <A0ScatterChart />

      <table
        style={{
          width: '100%',
          fontSize: '0.78rem',
          color: '#cbd5e1',
          borderCollapse: 'collapse',
          marginTop: '1.25rem',
        }}
      >
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>quantity</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>sample mean a_0 (n=6)</td>
            <td style={{ textAlign: 'right', color: '#60a5fa' }}>
              {IMP96040_MEAN_SE.mean.toFixed(6)}
            </td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>standard error of the mean</td>
            <td style={{ textAlign: 'right', color: '#60a5fa' }}>
              {IMP96040_MEAN_SE.seMean.toFixed(6)}
            </td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>conjectural a_0 (I_F = 1, imp-95984)</td>
            <td style={{ textAlign: 'right', color: '#f87171' }}>
              {IMP96040_CONJECTURAL.value.toFixed(6)}
            </td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>gap in standard errors (z)</td>
            <td style={{ textAlign: 'right' }}>{zScore.toFixed(4)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>two-sided p</td>
            <td style={{ textAlign: 'right' }}>{pTwoSided.toFixed(4)}</td>
          </tr>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page rendering the frozen
        imp-96005 six-height a_0 scatter, mean, SE band and conjectural line verbatim (no
        re-derivation). The gap is 0.337 SE (p &#8776; 0.736) -- fully noise-consistent, not a
        resolved discrepancy. Supplies no new bound, establishes no operator positivity, no RH
        claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
