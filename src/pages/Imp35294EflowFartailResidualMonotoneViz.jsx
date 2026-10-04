import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35237_EFLOW_FARTAIL_EXPONENT_LADDER_CROSSCHECK } from '../data/imp-35237-eflow-fartail-exponent-ladder-crosscheck.js';
import { ED } from '../styles/tokens.js';

// Baked literals imported verbatim from the imp-35237 data module; no new
// computation is performed here (viz/UX only).
const { anchors: ANCHORS } = IMP35237_EFLOW_FARTAIL_EXPONENT_LADDER_CROSSCHECK;

function ResidualChart() {
  const svgW = 700;
  const padL = 60;
  const padR = 24;
  const padT = 44;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = 280;
  const svgH = padT + plotH + padB;

  // Log-x across N (1e6 .. 1e16), linear-y across the two residuals (0 .. 0.016).
  const xMin = Math.log10(1e6);
  const xMax = Math.log10(1e16);
  const yMin = 0;
  const yMax = 0.016;

  const xOf = (N) => padL + ((Math.log10(N) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const leadPath = ANCHORS.map(
    (a, i) => `${i === 0 ? 'M' : 'L'} ${xOf(a.N)} ${yOf(a.residualVsMeasured)}`,
  ).join(' ');
  const fullPath = ANCHORS.map(
    (a, i) => `${i === 0 ? 'M' : 'L'} ${xOf(a.N)} ${yOf(a.fullResidualVsMeasured)}`,
  ).join(' ');

  const xTicks = ANCHORS.map((a) => a.N);
  const yTicks = [0, 0.004, 0.008, 0.012, 0.016];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        imp-35237 E_flow far-tail residual: leading vs full-surrogate, vs imp-35135 measured
      </text>

      {fullPath && <path d={fullPath} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="4 3" />}
      {leadPath && <path d={leadPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />}

      {ANCHORS.map((a) => (
        <circle key={`lead-${a.N}`} cx={xOf(a.N)} cy={yOf(a.residualVsMeasured)} r={3.5} fill={ED.brassDeco} />
      ))}
      {ANCHORS.map((a) => (
        <circle key={`full-${a.N}`} cx={xOf(a.N)} cy={yOf(a.fullResidualVsMeasured)} r={3} fill={ED.series2} />
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((N) => (
        <text key={N} x={xOf(N)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {N.toExponential(0)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        N (log scale)
      </text>

      {yTicks.map((v) => (
        <text key={v} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v.toFixed(3)}
        </text>
      ))}

      <g>
        <line x1={padL + 4} y1={padT - 12} x2={padL + 24} y2={padT - 12} stroke={ED.series5} strokeWidth={2.25} />
        <text x={padL + 30} y={padT - 8} fill={ED.series5} fontSize={8.5}>
          leading-law residual |(-1+3/logN) - measured|
        </text>
        <line x1={padL + 340} y1={padT - 12} x2={padL + 360} y2={padT - 12} stroke={ED.series2} strokeWidth={2} strokeDasharray="4 3" />
        <text x={padL + 366} y={padT - 8} fill={ED.series2} fontSize={8.5}>
          full-surrogate residual
        </text>
      </g>
    </svg>
  );
}

export default function Imp35294EflowFartailResidualMonotoneViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Far-Tail Residual: Monotone Shrinking Across the Ladder (imp-35294)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35237 cross-check extends the imp-35222 two-endpoint comparison (N = 1e6, 1e16) to
        the two intermediate anchors N = 1e9 and N = 1e12, testing whether the imp-35198 derived
        leading law &minus;1 + 3/log&nbsp;N and full surrogate s(x) = (1 &minus; 1/log&nbsp;N)(2/log&nbsp;T0
        &minus; 1) reproduce the imp-35135 MEASURED far-tail E_flow exponent drift across the whole
        ladder. Both residuals shrink monotonically from N = 1e6 to N = 1e16, and the full-surrogate
        curve &mdash; which starts ABOVE the leading-law curve at N = 1e6 &mdash; crosses below it by
        N = 1e9 and stays below for the rest of the ladder.
      </p>

      <ResidualChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>measured (imp-35135)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>leading -1+3/logN</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>full s(x)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>|lead - meas|</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>|full - meas|</th>
          </tr>
        </thead>
        <tbody>
          {ANCHORS.map((a) => (
            <tr key={a.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.measured.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.leading.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.full.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-3)' }}>
                {a.residualVsMeasured.toFixed(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-3)' }}>
                {a.fullResidualVsMeasured.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Both residual columns shrink steadily from N = 1e6 to N = 1e16 &mdash; the imp-35198 law
        tracks the imp-35135 measured drift increasingly well at larger N, as a leading-order
        (log&nbsp;N)-power correction to the asymptotic exponent &minus;1 should. The full-surrogate
        residual (0.0142) starts above the leading-law residual (0.0119) at N = 1e6 but crosses
        below it (0.0080 vs 0.0089) by N = 1e9 and remains the smaller of the two through N = 1e16.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page reusing the
        imp-35237 baked anchors literals verbatim (no new computation). Cross-check only; the
        component model is the imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; E_flow
        &gt; 0 strictness (imp-33848) untouched; C_mb GUE-conditional (imp-486) untouched; changes
        no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
