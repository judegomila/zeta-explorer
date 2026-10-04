import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34495_LOCAL_EXPONENTS,
  IMP34495_EXTRAPOLATION_TABLE,
  IMP34495_ASYMPTOTIC_EXPONENT,
  IMP34495_FP_FLOOR_KEND,
} from '../data/imp-34495-deflow-decay-viz-data.js';
import { ED } from '../styles/tokens.js';

// Rising local exponent p(N) toward the asymptotic pInf ~ 1.000, plotted against kMid = log10(N).
function LocalExponentChart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 60;
  const padR = 24;
  const padT = 30;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = IMP34495_LOCAL_EXPONENTS.map((q) => q.kMid);
  const ys = IMP34495_LOCAL_EXPONENTS.map((q) => q.p);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys) - 0.01;
  const yMax = IMP34495_ASYMPTOTIC_EXPONENT + 0.01;
  const xAt = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  const path = IMP34495_LOCAL_EXPONENTS.map((q, i) => `${i === 0 ? 'M' : 'L'}${xAt(q.kMid)},${yAt(q.p)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* asymptote pInf ~ 1.000 */}
      <line
        x1={padL}
        y1={yAt(IMP34495_ASYMPTOTIC_EXPONENT)}
        x2={padL + cW}
        y2={yAt(IMP34495_ASYMPTOTIC_EXPONENT)}
        stroke={ED.series1}
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={padL + cW - 4} y={yAt(IMP34495_ASYMPTOTIC_EXPONENT) - 6} textAnchor="end" fill={ED.series1} fontSize={9.5}>
        pInf &asymp; {IMP34495_ASYMPTOTIC_EXPONENT.toFixed(3)}
      </text>

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2} />
      {IMP34495_LOCAL_EXPONENTS.map((q) => (
        <g key={q.kMid}>
          <circle cx={xAt(q.kMid)} cy={yAt(q.p)} r={4} fill={ED.series3} stroke={ED.paper} strokeWidth={1} />
          <text x={xAt(q.kMid)} y={yAt(q.p) - 10} textAnchor="middle" fill={ED.ink} fontSize={8.5}>
            {q.p.toFixed(4)}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kMid = log10(N)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90, 16, ${padT + cH / 2})`}
      >
        p(N)
      </text>
    </svg>
  );
}

export default function Imp34495DeflowDecayViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Deflow Decay Exponent Rising Toward pInf = 1 (imp-34495 / imp-34448)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34448 fit the imp-34373 deflow(kEnd) = resid_full - resid_noflow monotone falloff to a
        decay law over the clean window kEnd 16..20. The local exponent p(N) = -d log|deflow| /
        d log N rises strictly toward an asymptotic value pInf&nbsp;&asymp;&nbsp;
        {IMP34495_ASYMPTOTIC_EXPONENT.toFixed(3)} (deflow&nbsp;&sim;&nbsp;N<sup>-1</sup> up to log
        factors). No viz existed for this measurement.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        local decay exponent p(N), clean window kEnd 16..20
      </p>
      <LocalExponentChart />

      <p
        style={{
          color: 'var(--ink-faint)',
          fontWeight: 700,
          fontSize: '0.82rem',
          marginTop: '1.5rem',
          marginBottom: '0.5rem',
        }}
      >
        extrapolated E_flow share table (fit-extrapolated past kEnd&nbsp;&asymp;&nbsp;{IMP34495_FP_FLOOR_KEND})
      </p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>kEnd</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>deflow (fit)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>E_flow share (fit)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>status</th>
          </tr>
        </thead>
        <tbody>
          {IMP34495_EXTRAPOLATION_TABLE.map((r) => (
            <tr key={r.kEnd} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.kEnd}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.deflowFit.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.shareFit.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', color: r.directlyMeasurable ? 'var(--series-3)' : 'var(--brass)' }}>
                {r.directlyMeasurable ? 'directly measurable' : 'fit-extrapolated (fp floor)'}
              </td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, the exponent
        series and extrapolation table reused verbatim from imp-34448. deflow is the difference of
        two ~15-significant-figure-identical residuals: it is directly measurable only out to
        kEnd&nbsp;&asymp;&nbsp;{IMP34495_FP_FLOOR_KEND - 0.5} and underflows to bit-zero by
        kEnd&nbsp;&asymp;&nbsp;{IMP34495_FP_FLOOR_KEND}; rows deeper than that are FIT-EXTRAPOLATED,
        not observed. Surrogate finite-difference fit within the inherited imp-3220/imp-3406
        component model, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED;
        changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
