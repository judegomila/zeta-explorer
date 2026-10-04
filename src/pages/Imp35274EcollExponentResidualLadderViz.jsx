import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35242_ECOLL_EXPONENT_RESIDUAL_0005_TOLERANCE_LOCATE } from '../data/imp-35242-ecoll-exponent-residual-0005-tolerance-locate.js';
import { ED } from '../styles/tokens.js';

const D = IMP35242_ECOLL_EXPONENT_RESIDUAL_0005_TOLERANCE_LOCATE;
const CROSSING_N = D.findings.M1_residual_first_below_0005.crossing_N;

// Plots the E_coll local-exponent residual to -1/2 (log-log) against the 1/(2 log T0) closing-law
// overlay across the extended N=1e15..1e45 ladder, marking the residual<0.005 landmark.
function ResidualLadderChart() {
  const svgW = 680;
  const padL = 58;
  const padR = 20;
  const padT = 44;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const logN = D.ladder.map((r) => r.logN);
  const xMin = Math.min(...logN);
  const xMax = Math.max(...logN);
  const logResiduals = D.ladder.map((r) => Math.log10(r.residual_to_minus_half));
  const yMin = Math.min(...logResiduals) - 0.05;
  const yMax = Math.max(...logResiduals) + 0.05;
  const xOf = (lx) => padL + ((lx - xMin) / (xMax - xMin)) * plotW;
  const yOf = (ly) => padT + plotH - ((ly - yMin) / (yMax - yMin)) * plotH;

  const residualPath = D.ladder
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.logN)} ${yOf(Math.log10(r.residual_to_minus_half))}`)
    .join(' ');
  const lawPath = D.ladder
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.logN)} ${yOf(Math.log10(r.inv_two_log_T0))}`)
    .join(' ');

  const tolLog = Math.log10(D.tolerance);
  const crossingLogN = Math.log10(CROSSING_N);

  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        E_coll local-exponent residual to -1/2 (log10) vs log10 N, N = 1e15..1e45
      </text>
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(tolLog)}
        x2={padL + plotW}
        y2={yOf(tolLog)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 150} y={yOf(tolLog) - 6} fill={ED.series2} fontSize={9}>
        tol = {D.tolerance}
      </text>
      <line
        x1={xOf(crossingLogN)}
        y1={padT}
        x2={xOf(crossingLogN)}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <text x={xOf(crossingLogN) + 4} y={padT + 10} fill={ED.brass} fontSize={9}>
        N&nbsp;~&nbsp;4.67e44
      </text>
      <path d={lawPath} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="6 3" />
      <path d={residualPath} fill="none" stroke={ED.series1} strokeWidth={2.25} />
      {D.ladder.map((r) => (
        <circle
          key={`pt-${r.N}`}
          cx={xOf(r.logN)}
          cy={yOf(Math.log10(r.residual_to_minus_half))}
          r={3.5}
          fill={r.isNewDeepDecade ? ED.series1 : ED.series3}
        />
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {D.ladder.map((r) => (
        <text
          key={`lbl-${r.N}`}
          x={xOf(r.logN)}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9}
        >
          1e{r.logN}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        N (decade grid)
      </text>
      <g>
        <circle cx={padL + 4} cy={padT - 12} r={3} fill={ED.series1} />
        <text x={padL + 12} y={padT - 8} fill={ED.series1} fontSize={8.5}>
          measured residual |exponent - (-1/2)|
        </text>
        <line x1={padL - 4} y1={padT - 22} x2={padL + 10} y2={padT - 22} stroke={ED.series2} strokeWidth={2} strokeDasharray="4 2" />
        <text x={padL + 12} y={padT - 19} fill={ED.series2} fontSize={8.5}>
          1/(2 log T0) closing-law overlay
        </text>
      </g>
    </svg>
  );
}

export default function Imp35274EcollExponentResidualLadderViz() {
  const m1 = D.findings.M1_residual_first_below_0005;
  const m3 = D.findings.M3_log_T0_saturation_convergence_rate;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Extended E_coll Exponent-Residual Ladder (imp-35274 / imp-35242)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35242 extended the imp-33620 separated E_coll local-decay-exponent ladder from its
        N&nbsp;=&nbsp;1e15 tail out to N&nbsp;~&nbsp;1e45, tracking the residual of the local exponent
        d&nbsp;log&nbsp;E_coll&nbsp;/&nbsp;d&nbsp;log&nbsp;N to the far-tail &minus;1/2 asymptote. The residual
        shrinks monotonically from above and tracks the imp-34130 closing law 1/(2&nbsp;log&nbsp;T0)
        the whole way, first dropping below {D.tolerance} at N&nbsp;~&nbsp;{CROSSING_N.toExponential(2)}.
      </p>

      <ResidualLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>log T0</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>local exponent</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual to -1/2</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>1/(2 log T0)</th>
          </tr>
        </thead>
        <tbody>
          {D.ladder.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.logT0.toFixed(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.ecoll_local_exponent.toFixed(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.residual_to_minus_half.toFixed(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.inv_two_log_T0.toFixed(5)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The residual first drops below {D.tolerance} at log10&nbsp;N&nbsp;~&nbsp;{m1.crossing_log10_N} (N&nbsp;~&nbsp;
        {m1.crossing_N.toExponential(2)}, log&nbsp;T0&nbsp;~&nbsp;{m1.crossing_log_T0}), with the exponent still
        {' '}{m1.exponent_at_crossing.toFixed(5)} &mdash; strictly above &minus;1/2, consistent with the imp-33620
        monotone-from-above verdict. Because the residual scales as ~1/(2&nbsp;log&nbsp;T0) and log&nbsp;T0 grows
        only logarithmically in N, shrinking the residual from {m3.residual_at_1e15} (N=1e15) to {D.tolerance} costs
        ~{m3.decades_from_1e15_to_crossing} additional decades in N &mdash; log-T0-saturation-limited convergence.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-35242
        measurement literals verbatim (no new computation) on the inherited imp-3220/imp-3406 component
        model. Locating the residual&lt;{D.tolerance} landmark is measurement only, not a certified uniform
        modulus of convergence on the true RvM cusp jet; the C_mb GUE-conditional share per imp-486 is
        UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0
        untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
