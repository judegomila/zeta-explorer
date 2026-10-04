import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION } from '../data/imp-35198-eflow-fartail-exponent-logn-correction.js';
import { IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION } from '../data/imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation.js';
import { ED } from '../styles/tokens.js';

const D = IMP35198_EFLOW_FARTAIL_EXPONENT_LOGN_CORRECTION;
const MEASURED = IMP35135_EFLOW_FARTAIL_DECAY_EXPONENT_POSITIVITY_RECONCILIATION.ladder;

// The imp-35198 ladder only carries measured expEflow at its top/deep rungs (reused from
// imp-35135's topRung/deepRung); build the full measured overlay from the imp-35135 ladder itself,
// matched by N.
const MEASURED_BY_N = new Map(MEASURED.map((r) => [r.N, r.expEflow]));

// Exponent-vs-log(N) chart: the derived leading law -1 + 3/log N, the full surrogate s(x), and the
// imp-35135 measured exponents, all converging on -1 strictly from above.
function ExponentConvergenceChart() {
  const svgW = 680;
  const padL = 50;
  const padR = 20;
  const padT = 44;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = D.ladder[0].logN;
  const xMax = D.ladder[D.ladder.length - 1].logN;
  const yMin = -1.05;
  const yMax = -0.7;
  const xOf = (logN) => padL + ((logN - xMin) / (xMax - xMin)) * plotW;
  const yOf = (exp) => padT + plotH - ((exp - yMin) / (yMax - yMin)) * plotH;

  const leadPath = D.ladder.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.logN)} ${yOf(r.leadingExponent)}`).join(' ');
  const fullPath = D.ladder.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.logN)} ${yOf(r.fullSurrogateExponent)}`).join(' ');
  const measuredPoints = D.ladder
    .filter((r) => MEASURED_BY_N.has(r.N))
    .map((r) => ({ logN: r.logN, exp: MEASURED_BY_N.get(r.N) }));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        d(log E_flow)/d(log N) vs log N, N in [1e6, 1e16]: leading -1+3/log N, full surrogate s(x), measured
      </text>
      {[-0.7, -0.8, -0.9, -1.0].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(-1)}
        x2={padL + plotW}
        y2={yOf(-1)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 130} y={yOf(-1) - 4} fill={ED.series2} fontSize={9}>
        asymptote: -1
      </text>
      <path d={fullPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      <path d={leadPath} fill="none" stroke={ED.series1} strokeWidth={2} strokeDasharray="5 3" />
      {measuredPoints.map((p) => (
        <circle key={p.logN} cx={xOf(p.logN)} cy={yOf(p.exp)} r={3.5} fill={ED.brassDeco} />
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[14, 18, 22, 26, 30, 34].map((logN) => (
        <text key={logN} x={xOf(logN)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {logN}
        </text>
      ))}
      <g>
        <circle cx={padL + 4} cy={padT - 12} r={3} fill={ED.series5} />
        <text x={padL + 12} y={padT - 8} fill={ED.series5} fontSize={8.5}>
          full surrogate s(x)
        </text>
        <circle cx={padL + 4} cy={padT - 24} r={3} fill={ED.series1} />
        <text x={padL + 12} y={padT - 20} fill={ED.series1} fontSize={8.5}>
          leading -1 + 3/log N
        </text>
        <circle cx={padL + 4} cy={padT - 36} r={3} fill={ED.brassDeco} />
        <text x={padL + 12} y={padT - 32} fill={ED.brass} fontSize={8.5}>
          imp-35135 measured
        </text>
      </g>
    </svg>
  );
}

export default function Imp35231EflowFartailExponentLogNCorrectionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Far-Tail Exponent Log-N Correction (imp-35231 / imp-35198)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35135 measured the far-tail E_flow local log-log decay exponent drifting from &sim;-0.77 at
        N&nbsp;=&nbsp;1e6 toward &sim;-0.91 at N&nbsp;=&nbsp;1e16, approaching -1 from above with unnamed
        &ldquo;(log N)-power corrections&rdquo;. imp-35198 derived that correction in closed form:{' '}
        <code>{D.closedForm}</code>. This page plots the derived leading law against the full surrogate
        s(x) = (1&minus;1/x)(2/M&minus;1) and the imp-35135 measured exponents, for the first time, showing
        all three tracking each other and the approach to -1 strictly from above.
      </p>

      <ExponentConvergenceChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>log N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>-1 + 3/log N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>full s(x)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>measured</th>
          </tr>
        </thead>
        <tbody>
          {D.ladder.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.logN.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.leadingExponent.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.fullSurrogateExponent.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {MEASURED_BY_N.has(r.N) ? MEASURED_BY_N.get(r.N).toFixed(4) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The leading correction is exactly +3/log N, matching the measured drift to within{' '}
        {D.topResidualVsMeasured.toFixed(3)} at N&nbsp;=&nbsp;1e6 and {D.deepResidualVsMeasured.toFixed(3)} at
        N&nbsp;=&nbsp;1e16, and agreeing with the full surrogate s(x) to within 0.003 across the ladder &mdash;
        confirming +3/log N is the leading term and the exponent approaches -1 strictly from above.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-35198
        derivation and imp-35135 measurement literals verbatim (no new computation). Derivation/measurement
        on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; E_flow&nbsp;&gt;&nbsp;0
        strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 untouched; E_coll far-tail
        exponent 1/2 per imp-3463; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
