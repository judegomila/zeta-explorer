import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97747_LADDER_ROWS,
  IMP97747_SLOPES,
  IMP97747_SUMMARY,
} from '../data/imp-97747-route-m-deep-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const POINT_COLOR = ED.series1;
const RISE_COLOR = ED.series2;
const ENDPOINT_COLOR = ED.series4;
const THEIL_SEN_COLOR = ED.series3;
const OLS_COLOR = ED.series5;

// Scatter of log|residual| vs log(log p) across the 23-rung ladder, with the 8 RISE rungs
// marked red and the three slope estimators drawn as reference lines through the first rung.
function LadderChart() {
  const svgW = 660;
  const padL = 55;
  const padR = 20;
  const padT = 20;
  const padB = 45;
  const svgH = 360;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xVals = IMP97747_LADDER_ROWS.map((r) => r.logLogP);
  const yVals = IMP97747_LADDER_ROWS.map((r) => r.logAbsResidual);
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const yMin = Math.min(...yVals) - 0.3;
  const yMax = Math.max(...yVals) + 0.3;

  const xOf = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const yOf = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const firstRow = IMP97747_LADDER_ROWS[0];
  const y0 = firstRow.logAbsResidual;
  const x0 = firstRow.logLogP;

  // slope lines: logAbsResidual = y0 - slope * (logLogP - x0), pinned through the first rung.
  const slopeLine = (slope) => {
    const yAtXMax = y0 - slope * (xMax - x0);
    return `M${xOf(x0)},${yOf(y0)} L${xOf(xMax)},${yOf(yAtXMax)}`;
  };

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      <path d={slopeLine(IMP97747_SLOPES.endpoint)} fill="none" stroke={ENDPOINT_COLOR} strokeWidth={1.25} strokeDasharray="5 3" />
      <path d={slopeLine(IMP97747_SLOPES.theilSen)} fill="none" stroke={THEIL_SEN_COLOR} strokeWidth={1.25} strokeDasharray="2 3" />
      <path d={slopeLine(IMP97747_SLOPES.ols)} fill="none" stroke={OLS_COLOR} strokeWidth={1.25} />

      {IMP97747_LADDER_ROWS.map((r) => (
        <circle
          key={r.index}
          cx={xOf(r.logLogP)}
          cy={yOf(r.logAbsResidual)}
          r={r.isRise ? 4.5 : 3}
          fill={r.isRise ? RISE_COLOR : POINT_COLOR}
          stroke={r.isRise ? '#fff' : 'none'}
          strokeWidth={r.isRise ? 1 : 0}
        />
      ))}

      <text x={padL + 6} y={padT + 12} fill={OLS_COLOR} fontSize={10}>
        OLS k~{IMP97747_SLOPES.ols.toFixed(2)}
      </text>
      <text x={padL + 6} y={padT + 26} fill={THEIL_SEN_COLOR} fontSize={10}>
        Theil-Sen k~{IMP97747_SLOPES.theilSen.toFixed(2)}
      </text>
      <text x={padL + 6} y={padT + 40} fill={ENDPOINT_COLOR} fontSize={10}>
        endpoint k~{IMP97747_SLOPES.endpoint.toFixed(2)}
      </text>
      <text x={padL + plotW - 6} y={padT + plotH + 12} textAnchor="end" fill={RISE_COLOR} fontSize={10}>
        red = 8 RISE rungs (sign change)
      </text>

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
        log(log p)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={10}
        transform={`rotate(-90, 14, ${padT + plotH / 2})`}
      >
        log|residual|
      </text>
    </svg>
  );
}

export default function Imp97747RouteMDeepLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Deep-Ladder Gap-Law Residual Decay (imp-97747 / imp-97722)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97722 23-rung ladder verbatim (no re-derivation, no new
        computation). MCM stays refuted from omega=11; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97747_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        log|residual| vs log(log p), 23-rung ladder (p from 2e6 to ~4.93e8)
      </h3>
      <LadderChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>#</th>
            <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem' }}>p_omega</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>residual</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>RISE?</th>
          </tr>
        </thead>
        <tbody>
          {IMP97747_LADDER_ROWS.map((row) => (
            <tr
              key={row.index}
              style={{
                color: row.isRise ? RISE_COLOR : 'var(--ink)',
                textAlign: 'right',
                borderTop: '1px solid var(--rule-soft)',
              }}
            >
              <td style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>{row.index}</td>
              <td style={{ padding: '0.3rem 0.5rem' }}>{row.pOmega.toLocaleString()}</td>
              <td style={{ padding: '0.3rem 0.5rem' }}>{row.residual.toExponential(4)}</td>
              <td style={{ padding: '0.3rem 0.5rem' }}>{row.isRise ? 'yes' : ''}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97747_SUMMARY.verdict}
      </div>
    </div>
  );
}
