import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  ENVELOPE_ROWS,
  ESS_INF,
  ESS_SUP,
  IMP95869_VIZ_SUMMARY,
} from '../data/imp-95869-two-sided-envelope-viz-data.js';

// Linear-n chart of lambda_min(G_n) descending to ess-inf f and lambda_max(G_n)
// ascending to ess-sup f, with both asymptotes drawn as horizontal dashed lines.
function EnvelopeChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const ns = ENVELOPE_ROWS.map((r) => r.n);
  const minN = Math.min(...ns);
  const maxN = Math.max(...ns);
  const yLo = Math.min(...ENVELOPE_ROWS.map((r) => r.lambdaMin), ESS_INF) * 0.98;
  const yHi = Math.max(...ENVELOPE_ROWS.map((r) => r.lambdaMax), ESS_SUP) * 1.02;

  const xScale = (n) => padL + ((n - minN) / (maxN - minN)) * plotW;
  const yScale = (y) => padT + plotH - ((y - yLo) / (yHi - yLo)) * plotH;

  const essInfY = yScale(ESS_INF);
  const essSupY = yScale(ESS_SUP);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* trapped-envelope band [ess-inf f, ess-sup f] */}
      <rect
        x={padL}
        y={essSupY}
        width={plotW}
        height={essInfY - essSupY}
        fill="#34d399"
        opacity={0.06}
      />
      {/* ess-inf f asymptote */}
      <line x1={padL} y1={essInfY} x2={padL + plotW} y2={essInfY} stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="6 4" />
      <text x={padL + plotW - 4} y={essInfY + 14} textAnchor="end" fill="#60a5fa" fontSize={10}>
        ess-inf f = A_opt = {ESS_INF.toFixed(4)}
      </text>
      {/* ess-sup f asymptote */}
      <line x1={padL} y1={essSupY} x2={padL + plotW} y2={essSupY} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="6 4" />
      <text x={padL + plotW - 4} y={essSupY - 6} textAnchor="end" fill="#f59e0b" fontSize={10}>
        ess-sup f = f(0) = {ESS_SUP.toFixed(4)}
      </text>

      {/* axes */}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1} />

      {/* lambda_min curve (descending to ess-inf f) */}
      <polyline
        points={ENVELOPE_ROWS.map((r) => `${xScale(r.n)},${yScale(r.lambdaMin)}`).join(' ')}
        fill="none"
        stroke="#60a5fa"
        strokeWidth={1.5}
      />
      {/* lambda_max curve (ascending to ess-sup f) */}
      <polyline
        points={ENVELOPE_ROWS.map((r) => `${xScale(r.n)},${yScale(r.lambdaMax)}`).join(' ')}
        fill="none"
        stroke="#f59e0b"
        strokeWidth={1.5}
      />
      {ENVELOPE_ROWS.map((r) => (
        <g key={r.n}>
          <circle cx={xScale(r.n)} cy={yScale(r.lambdaMin)} r={3.5} fill="#60a5fa" />
          <circle cx={xScale(r.n)} cy={yScale(r.lambdaMax)} r={3.5} fill="#f59e0b" />
          <text x={xScale(r.n)} y={svgH - padB + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.n}
          </text>
        </g>
      ))}

      <text x={16} y={padT + plotH / 2} textAnchor="middle" fill="#94a3b8" fontSize={9} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
        lambda(G_n)
      </text>
      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill="#94a3b8" fontSize={9}>
        section size n
      </text>
    </svg>
  );
}

export default function Imp95869TwoSidedEnvelopeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Two-Sided Finite-Section Spectral Envelope (imp-95869 / imp-95825 / imp-95846)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> presentation plus light
        recomputation of the already-verified imp-95825 / imp-95846 method (same
        sech-Toeplitz Rayleigh-quotient argument, no new cited input); every n=160 row is
        cross-checked against those frozen certified endpoints. Model seam family only.
        Changes no bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP95869_VIZ_SUMMARY.reading}
      </p>

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        lambda_min(G_n) and lambda_max(G_n) versus section size n (delta = 3), trapped inside
        [ess-inf f, ess-sup f]:
      </p>
      <EnvelopeChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>n</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>lambda_min</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>lambda_max</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>lambda_min / ess-inf f</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>lambda_max / ess-sup f</th>
          </tr>
        </thead>
        <tbody>
          {ENVELOPE_ROWS.map((r) => (
            <tr key={r.n} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.n}</td>
              <td style={{ textAlign: 'right', color: '#60a5fa' }}>{r.lambdaMin.toFixed(6)}</td>
              <td style={{ textAlign: 'right', color: '#f59e0b' }}>{r.lambdaMax.toFixed(6)}</td>
              <td style={{ textAlign: 'right' }}>{r.ratioMin.toFixed(6)}</td>
              <td style={{ textAlign: 'right' }}>{r.ratioMax.toFixed(6)}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.3)' }}>
            <td style={{ padding: '3px 0', color: '#60a5fa' }}>ess-inf f = A_opt (n&rarr;&infin;)</td>
            <td style={{ textAlign: 'right', color: '#60a5fa' }}>{ESS_INF.toFixed(6)}</td>
            <td style={{ textAlign: 'right', color: '#f59e0b' }}>ess-sup f = f(0)</td>
            <td colSpan={2} style={{ textAlign: 'right', color: '#f59e0b' }}>{ESS_SUP.toFixed(6)}</td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP95869_VIZ_SUMMARY.verdict}
      </div>
    </div>
  );
}
