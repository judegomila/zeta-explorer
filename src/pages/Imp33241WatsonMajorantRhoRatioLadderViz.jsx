import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33241_K0,
  IMP33241_K_LEAD,
  IMP33241_RELIABILITY_GRID,
  IMP33241_SWAMPED_GRID,
  IMP33241_ALL_GRID,
} from '../data/imp-33241-watson-majorant-rho-ratio-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const MEASURED_COLOR = ED.series1;
const MODEL_COLOR = ED.series7;
const K0_COLOR = ED.series4;

function scaleY(v, min, max, cH) {
  return cH * (1 - (v - min) / (max - min));
}

function RhoRatioLadderChart() {
  const svgW = 620;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const min = 3.25;
  const max = 3.5;
  const n = IMP33241_RELIABILITY_GRID.length;
  const step = cW / n;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[3.25, 3.3, 3.35, 3.4, 3.45, 3.5].map((v) => {
        const y = padT + scaleY(v, min, max, cH);
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={padL + cW} y2={y} stroke={ED.ruleSoft} strokeWidth={0.7} />
            <text x={padL - 6} y={y + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
              {v.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* K0 = 3.46 majorant envelope */}
      <line
        x1={padL}
        y1={padT + scaleY(IMP33241_K0, min, max, cH)}
        x2={padL + cW}
        y2={padT + scaleY(IMP33241_K0, min, max, cH)}
        stroke={K0_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,4"
      />
      <text x={padL + cW - 4} y={padT + scaleY(IMP33241_K0, min, max, cH) - 6} textAnchor="end" fill={K0_COLOR} fontSize={9}>
        K0 = 3.46
      </text>

      {/* K_lead limit */}
      <line
        x1={padL}
        y1={padT + scaleY(-IMP33241_K_LEAD, min, max, cH)}
        x2={padL + cW}
        y2={padT + scaleY(-IMP33241_K_LEAD, min, max, cH)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={padL + 4} y={padT + scaleY(-IMP33241_K_LEAD, min, max, cH) - 6} fill={ED.inkSoft} fontSize={9}>
        |K_lead| = 3.412
      </text>

      {/* model curve */}
      <polyline
        points={IMP33241_RELIABILITY_GRID.map((p, i) => {
          const x = padL + i * step + step / 2;
          const y = padT + scaleY(Math.abs(p.modelRatio), min, max, cH);
          return `${x},${y}`;
        }).join(' ')}
        fill="none"
        stroke={MODEL_COLOR}
        strokeWidth={1.5}
      />

      {/* measured curve + points */}
      <polyline
        points={IMP33241_RELIABILITY_GRID.map((p, i) => {
          const x = padL + i * step + step / 2;
          const y = padT + scaleY(Math.abs(p.rhoRatio), min, max, cH);
          return `${x},${y}`;
        }).join(' ')}
        fill="none"
        stroke={MEASURED_COLOR}
        strokeWidth={2}
      />
      {IMP33241_RELIABILITY_GRID.map((p, i) => {
        const x = padL + i * step + step / 2;
        const y = padT + scaleY(Math.abs(p.rhoRatio), min, max, cH);
        return <circle key={p.tau} cx={x} cy={y} r={3.5} fill={MEASURED_COLOR} />;
      })}

      {IMP33241_RELIABILITY_GRID.map((p, i) => {
        const x = padL + i * step + step / 2;
        return (
          <text key={p.tau} x={x} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            tau={p.tau}
          </text>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        |rhoRatio(tau)|
      </text>
    </svg>
  );
}

function LadderTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>tau</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>rhoRatio (measured)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>model (K_lead + K6 e^-2tau)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>floorNoise</th>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>regime</th>
        </tr>
      </thead>
      <tbody>
        {IMP33241_ALL_GRID.map((p) => {
          const isSwamped = IMP33241_SWAMPED_GRID.includes(p);
          return (
            <tr key={p.tau} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <td style={{ padding: '0.35rem 0.5rem' }}>{p.tau}</td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: MEASURED_COLOR }}>
                {p.rhoRatio.toPrecision(7)}
              </td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: MODEL_COLOR }}>
                {p.modelRatio.toPrecision(7)}
              </td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{p.floorNoise.toExponential(2)}</td>
              <td style={{ padding: '0.35rem 0.5rem', color: isSwamped ? 'var(--series-2)' : 'var(--series-3)' }}>
                {isSwamped ? 'floor-swamped' : 'reliable'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Imp33241WatsonMajorantRhoRatioLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Watson-Majorant rhoRatio Ladder (imp-33208)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33208 measures the realised bracket remainder ratio
        rhoRatio(tau) = rho(tau) / e^-4tau directly against the imp-3850/imp-3873
        reconciled -ln A(tau) ladder, extending the imp-3866 spot-check to the
        full grid tau in {'{'}1.5, 2, 2.5, 3, 3.5, 4, 5, 6{'}'}. On the RELIABILITY
        WINDOW tau in [1.5, 3.5] the measured ratio climbs monotonically toward
        the imp-3892 pinned limit K_lead = -3.4120570431, stays strictly inside
        the K0 = 3.46 majorant envelope, and tracks the closed two-term model
        K_lead + K6 e^-2tau.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        |rhoRatio(tau)| (measured, solid) vs closed two-term model (dashed pink) -- reliability window only
      </p>
      <RhoRatioLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Full grid, including the floor-swamped window
      </p>
      <LadderTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the
        chart shows only tau in [1.5, 3.5], where the direct reconstruction
        sits far above its own additive cancellation floor and the measurement
        is a genuine signal. Beyond tau ~ 3.5 (table rows below the chart) the
        estimated floor noise ~ 2 pi^2 e^8tau eps overtakes the ~3.41 signal, so
        the apparent |rhoRatio| far above K0 at tau in {'{'}4, 5, 6{'}'} is the
        known imp-3730 cancellation floor (residual
        sg-33208-high-tau-cancellation-floor), not a majorant violation -- the
        closed two-term model (dashed pink in the table) stays under K0 across
        the entire grid.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, of an already-verified table (imp-33208). Verification/measurement
        only, not a proof; mass-feasibility is necessary-but-not-sufficient;
        operator positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO
        QED.
      </div>
    </div>
  );
}
