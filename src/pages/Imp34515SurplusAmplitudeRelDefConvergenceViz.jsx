import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34515_CONVERGENCE,
  IMP34515_DEEP_TAIL,
  IMP34515_CONSTANTS,
} from '../data/imp-34515-surplus-amplitude-relDef-convergence-viz-data.js';
import { ED } from '../styles/tokens.js';

// Scatter chart: relDef*logT0 vs logT0, rising toward the closed constant 2*log(2pi) = 3.6758.
function RelDefRiseChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const points = [...IMP34515_CONVERGENCE, { logT0: IMP34515_DEEP_TAIL.logT0, relDef_x_logT0: IMP34515_DEEP_TAIL.relDef_x_logT0, thr: 'deep-tail probe' }];

  const xMax = 400;
  const yMin = 3.2;
  const yMax = 3.75;
  const xAt = (v) => padL + (v / xMax) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const xTicks = [0, 50, 100, 150, 200, 250, 300, 350, 400];
  const yTicks = [3.2, 3.3, 3.4, 3.5, 3.6, 3.7];

  const target = IMP34515_CONSTANTS.two_log_two_pi;

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
            {v}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        log T0
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        relDef &times; log T0
      </text>

      {/* target line: 2*log(2pi) = 3.675754 */}
      <line
        x1={padL}
        y1={yAt(target)}
        x2={padL + cW}
        y2={yAt(target)}
        stroke={ED.series7}
        strokeWidth={1.5}
        strokeDasharray="5,4"
        opacity={0.85}
      />
      <text x={padL + cW - 170} y={yAt(target) - 6} fill={ED.series7} fontSize={9}>
        2 log(2&pi;) = {target.toFixed(6)}
      </text>

      {points.map((r, i) => (
        <g key={r.logT0 + '-' + i}>
          <circle
            cx={xAt(r.logT0)}
            cy={yAt(r.relDef_x_logT0)}
            r={4.5}
            fill={i === points.length - 1 ? ED.brassDeco : ED.series1}
            stroke={ED.paper}
            strokeWidth={1}
          />
        </g>
      ))}
    </svg>
  );
}

export default function Imp34515SurplusAmplitudeRelDefConvergenceViz() {
  const last = IMP34515_CONVERGENCE[IMP34515_CONVERGENCE.length - 1];
  const { A_r, two_log_two_pi, log_two_pi_sq_minus_1 } = IMP34515_CONSTANTS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Surplus-Amplitude A_r Convergence (imp-34473)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34473 assembled the leading surplus amplitude in closed form, A_r = {A_r.toExponential(6)},
        and found the measured asymptote M(thr) = surplus/((log T0)&sup2; thr&sup3;) approaches it
        from below. Writing the relative deficit relDef = 1 &minus; M/A_r, the product
        relDef&times;log T0 rises monotonically from {IMP34515_CONVERGENCE[0].relDef_x_logT0.toFixed(4)}
        {' '}at log T0={IMP34515_CONVERGENCE[0].logT0} toward the closed constant
        2 log(2&pi;) = {two_log_two_pi.toFixed(6)}, reaching {IMP34515_DEEP_TAIL.relDef_x_logT0.toFixed(5)}
        {' '}at the deep-tail probe (log T0={IMP34515_DEEP_TAIL.logT0}). imp-34507 further identified the
        flat next-order gap as log(2&pi;)&sup2; &minus; 1 = {log_two_pi_sq_minus_1.toFixed(6)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        relDef &times; log T0 vs log T0 &mdash; rising toward the closed constant 2 log(2&pi;)
      </p>
      <RelDefRiseChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>thr</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log T0</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>measured M</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual A_r&minus;M</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rel. deficit %</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>relDef&times;logT0</th>
          </tr>
        </thead>
        <tbody>
          {IMP34515_CONVERGENCE.map((row) => (
            <tr key={row.thr} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.thr}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.logT0.toFixed(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.measured.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.residual.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.relDeficitPct.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.relDef_x_logT0.toFixed(4)}</td>
            </tr>
          ))}
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--brass)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>deep-tail probe</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{IMP34515_DEEP_TAIL.logT0.toFixed(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>&mdash;</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>&mdash;</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>&mdash;</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{IMP34515_DEEP_TAIL.relDef_x_logT0.toFixed(5)}</td>
          </tr>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> the slow rise of M toward A_r is a
        clean 1/log T0 approach, M/A_r = 1 &minus; 2 log(2&pi;)/log T0 + O(1/log&sup2; T0). The
        flat next-order gap (2 log(2&pi;) &minus; relDef&times;log T0)&times;log T0 &asymp; 2.38
        matches log(2&pi;)&sup2; &minus; 1 exactly (imp-34507), closing the two-term expansion
        M/A_r = (1 &minus; log(2&pi;)/log T0)&sup2; &minus; 1/log&sup2; T0.
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
        reproducing the imp-34473/imp-34507 measurements; no new derivation, no bound changed.
        Component model is the inherited imp-34329/imp-34248/imp-34174/imp-33743 extrapolation,
        NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz
        untouched; imp-3066 K_a&ge;0 untouched; NO QED.
      </div>
    </div>
  );
}
