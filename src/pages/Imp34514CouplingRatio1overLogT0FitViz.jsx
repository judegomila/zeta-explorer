import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34514_LANDMARKS,
  IMP34514_LIMIT_FITS,
} from '../data/imp-34514-coupling-ratio-1overlogT0-fit-viz-data.js';
import { ED } from '../styles/tokens.js';

// Scatter-with-fit-lines chart: excess-above-2 vs 1/logT0, with the three fit windows drawn
// as reference lines converging toward the origin (limit = 2 as 1/logT0 -> 0).
function ExcessVsInvLogT0Chart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 70;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMax = 0.05;
  const yMax = 0.1;
  const xAt = (v) => padL + (v / xMax) * cW;
  const yAt = (v) => padT + cH - (v / yMax) * cH;

  const xTicks = [0, 0.01, 0.02, 0.03, 0.04, 0.05];
  const yTicks = [0, 0.02, 0.04, 0.06, 0.08, 0.1];

  const fitColors = [ED.series7, ED.series4, ED.series3];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={'x' + v}>
          <text x={xAt(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        1 / log T0
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        excess above 2
      </text>

      {/* origin marker: limit = 2 as 1/logT0 -> 0 */}
      <circle cx={xAt(0)} cy={yAt(0)} r={3.5} fill="none" stroke={ED.series7} strokeWidth={1.5} />
      <text x={xAt(0) + 8} y={yAt(0) - 6} fill={ED.series7} fontSize={9}>
        limit = 2
      </text>

      {IMP34514_LIMIT_FITS.map((fit, i) => {
        const x0 = 0;
        const y0 = fit.c0;
        const x1 = xMax;
        const y1 = fit.c0 + fit.c1_slope * xMax;
        return (
          <line
            key={fit.window}
            x1={xAt(x0)}
            y1={yAt(y0)}
            x2={xAt(x1)}
            y2={yAt(Math.min(y1, yMax))}
            stroke={fitColors[i]}
            strokeWidth={1.5}
            strokeDasharray="5,4"
            opacity={0.85}
          />
        );
      })}

      {IMP34514_LANDMARKS.map((r) => (
        <g key={r.landmark}>
          <circle cx={xAt(r.inv_logT0)} cy={yAt(r.excess_above_two)} r={4.5} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
          <text
            x={xAt(r.inv_logT0)}
            y={yAt(r.excess_above_two) - 10}
            textAnchor="middle"
            fill={ED.inkSoft}
            fontSize={8.5}
            fontFamily="monospace"
          >
            {r.excess_above_two.toFixed(4)}
          </text>
        </g>
      ))}

      <g>
        {IMP34514_LIMIT_FITS.map((fit, i) => (
          <g key={'legend' + fit.window}>
            <rect x={padL + cW - 190} y={padT + i * 14} width={10} height={10} fill={fitColors[i]} />
            <text x={padL + cW - 175} y={padT + i * 14 + 9} fill={ED.inkSoft} fontSize={8.5}>
              {fit.window}: limit {fit.limit.toFixed(4)}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Imp34514CouplingRatio1overLogT0FitViz() {
  const last = IMP34514_LANDMARKS[IMP34514_LANDMARKS.length - 1];
  const tightestFit = IMP34514_LIMIT_FITS[IMP34514_LIMIT_FITS.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Coupling-Ratio 1/log T0 Fit (imp-34487)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34447 found the coupling ratio residual/(E_flow/E_trunc) drift turns over across four
        landmarks, concluding qualitatively that it converges to a finite limit &ldquo;~2.05&rdquo;.
        imp-34487 added a fifth, hyper-deep landmark (thr={last.thr}, log T0={last.logT0.toFixed(4)},
        coupling={last.coupling_ratio.toFixed(6)}) and fit the excess-above-2 sequence against
        x = 1/log T0. As shallow landmarks are dropped, the fit intercept collapses toward zero and
        the slope tightens toward 2 &mdash; the deep-3 fit gives R&sup2;={tightestFit.r2.toFixed(5)}
        {' '}and limit {tightestFit.limit.toFixed(4)}, revealing the excess vanishes as ~2/log T0 and
        the true finite limit is the LEADING value 2, not ~2.05.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Excess above 2 vs 1/log T0 &mdash; the fit lines converge toward the origin (limit = 2) as
        shallow landmarks are dropped
      </p>
      <ExcessVsInvLogT0Chart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>thr</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log T0</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>coupling ratio</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>excess above 2</th>
          </tr>
        </thead>
        <tbody>
          {IMP34514_LANDMARKS.map((row) => (
            <tr key={row.landmark} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.landmark}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.thr}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.logT0.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.coupling_ratio.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.excess_above_two.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>fit window</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>n</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>c0 (intercept)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>slope</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>R&sup2;</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>limit</th>
          </tr>
        </thead>
        <tbody>
          {IMP34514_LIMIT_FITS.map((row) => (
            <tr key={row.window} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.window}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.n}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.c0.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.c1_slope.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.r2.toFixed(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.limit.toFixed(6)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> dropping shallow landmarks from the
        fit collapses the intercept toward zero and tightens the slope toward 2, the signature of
        an exact leading correction coupling ~ 2 + 2/log T0. The limit band across the three fit
        windows is [2.0001, 2.0081], midpoint 2.0041 &mdash; the imp-34447 qualitative &ldquo;~2.05&rdquo;
        is revised to &ldquo;converges to 2 from above, as ~2/log T0&rdquo;.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34487 measurement; no new derivation, no bound changed. Component
        model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb
        GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz untouched; imp-3066 K_a&ge;0
        untouched; NO QED.
      </div>
    </div>
  );
}
