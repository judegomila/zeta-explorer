import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35837_LADDER } from '../data/imp-35837-krawczyk-cancellation-ratio-viz-data.js';
import { ED } from '../styles/tokens.js';

// Line chart of the deviation R - 2 (in units of 1e-4) versus log10(N), showing the monotone
// descent from band-top to the PT anchor and out to N ~ 1e17, then the spurious double-precision
// upturn beyond that (imp-35766 B1-B3).
function DeviationLineChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 30;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = 9;
  const xMax = 20.5;
  const xOf = (N) => padL + ((Math.log10(N) - xMin) / (xMax - xMin)) * plotW;

  const yMin = 3.6;
  const yMax = 6.2;
  const yOf = (devUnits) => padT + plotH - ((devUnits - yMin) / (yMax - yMin)) * plotH;

  const points = IMP35837_LADDER.map((r) => ({ ...r, x: xOf(r.N), y: yOf(r.dev * 1e4) }));
  const path = points.map((p) => `${p.x},${p.y}`).join(' ');
  const reliablePath = points
    .slice(0, 3)
    .map((p) => `${p.x},${p.y}`)
    .join(' ');
  const artifactPath = `${points[2].x},${points[2].y} ${points[3].x},${points[3].y}`;

  const yTicks = [4.0, 4.5, 5.0, 5.5, 6.0];
  const xTicks = [9, 12, 15, 18, 20];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        R - 2 (x 1e-4) vs log10(N): band-top -&gt; PT anchor -&gt; N=1e17 -&gt; N=1e20
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={v} x={xOf(Math.pow(10, v))} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          1e{v}
        </text>
      ))}

      <polyline points={reliablePath} fill="none" stroke={ED.series1} strokeWidth={2} />
      <polyline points={artifactPath} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="4,3" />

      {points.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r={4} fill={p.reliable ? ED.series1 : ED.series2} stroke={ED.paper} strokeWidth={1} />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fill={ED.ink} fontSize={9} fontFamily="monospace">
            {p.dev.toExponential(3)}
          </text>
          <text x={p.x} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            {p.label}
          </text>
        </g>
      ))}

      <g>
        <rect x={padL + plotW - 190} y={padT} width={10} height={10} fill={ED.series1} />
        <text x={padL + plotW - 176} y={padT + 9} fill={ED.inkSoft} fontSize={9.5}>
          reliable (model-matched)
        </text>
        <rect x={padL + plotW - 190} y={padT + 16} width={10} height={10} fill={ED.series2} />
        <text x={padL + plotW - 176} y={padT + 25} fill={ED.inkSoft} fontSize={9.5}>
          float-cancellation artifact
        </text>
      </g>
    </svg>
  );
}

export default function Imp35837KrawczykCancellationRatioViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Cancellation Ratio Above the Band: Tightens, Then a Float Artifact (imp-35837 / imp-35766)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35266 found the surplus-split ratio -dFP/dG&nbsp;~&nbsp;2.00042 essentially N-independent,
        but tested it only inside the imp-34693 admissible seed band. imp-35766 measured it above the
        band, out to the Platt-Trudgian anchor N(T_PT=3e12)&nbsp;~&nbsp;1.236e13 and beyond: the
        deviation R&nbsp;-&nbsp;2 DECREASES monotonically from band-top to the PT anchor and stays
        essentially flat out to N&nbsp;~&nbsp;1e17 -- the 2:1 balance TIGHTENS, it never breaks. The
        only apparent upturn, beyond N&nbsp;~&nbsp;1e18, is a double-precision catastrophic-cancellation
        artifact in dG&nbsp;=&nbsp;S_inf(M_G&nbsp;-&nbsp;1), not a real degradation.
      </p>

      <DeviationLineChart />

      <table
        style={{
          width: '100%',
          marginTop: '2rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>R = -dFP/dG</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>R - 2</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>reliable?</th>
          </tr>
        </thead>
        <tbody>
          {IMP35837_LADDER.map((row) => (
            <tr key={row.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.N.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.R.toFixed(9)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.dev.toExponential(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.reliable ? 'yes' : 'no (float cancellation)'}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-35766 measurement verbatim; no new derivation, no heavy data-module
        import. Measurement only on the inherited imp-3220/imp-3406 surrogate; the imp-34714a machine
        certificate REMAINS OPEN and F(m)&nbsp;=&nbsp;0 stays a double-precision artifact; C_C&nbsp;1/8
        ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound;
        establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
