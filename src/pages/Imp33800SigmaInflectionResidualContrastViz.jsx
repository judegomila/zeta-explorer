import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33781_SIGMA_CURVE,
  IMP33781_PURE_POWER_LAW_BASELINE,
  IMP33781_CLOSED_FORM_MARKER,
  IMP33781_HALVING_MARKER,
  IMP33781_FULL_MODEL_OFFSET_PCT,
  IMP33781_CAVEAT_BANNER,
} from '../data/imp-33781-sigma-inflection-closed-form-viz-data.js';
import {
  IMP33782_RESIDUAL_CONTRAST_SERIES,
  IMP33782_TIGHTENING_RATIO,
  IMP33782_CAVEAT_BANNER,
} from '../data/imp-33782-residual-contrast-viz-data.js';

function SigmaInflectionChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 260;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kOf = (N) => Math.log10(N);
  const kMin = 8;
  const kMax = 11;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const yMin = 0.4;
  const yMax = 0.6;
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const yTicks = [0.4, 0.45, 0.5, 0.55, 0.6];
  const xTicks = [8, 9, 10, 11];

  const curvePoints = IMP33781_SIGMA_CURVE.map((p) => `${xS(kOf(p.N))},${yS(p.sigma)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {xTicks.map((k) => (
        <g key={'xt' + k}>
          <line x1={xS(k)} y1={padT + cH - 4} x2={xS(k)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 18} textAnchor="middle" fill="#64748b" fontSize={9}>
            {'10^' + k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        N
      </text>

      {/* pure power-law baseline: sigma = 1/2 exactly */}
      <line
        x1={padL}
        y1={yS(IMP33781_PURE_POWER_LAW_BASELINE)}
        x2={padL + cW}
        y2={yS(IMP33781_PURE_POWER_LAW_BASELINE)}
        stroke="#64748b"
        strokeWidth={1}
        strokeDasharray="3,3"
      />

      <polyline points={curvePoints} fill="none" stroke="#38bdf8" strokeWidth={1.75} />

      {/* halving landmark marker */}
      <circle cx={xS(kOf(IMP33781_HALVING_MARKER.N))} cy={yS(IMP33781_HALVING_MARKER.sigma)} r={4} fill="#fbbf24" stroke="#0a0f1a" strokeWidth={0.75} />
      {/* closed-form inflection marker */}
      <circle cx={xS(kOf(IMP33781_CLOSED_FORM_MARKER.N))} cy={yS(IMP33781_CLOSED_FORM_MARKER.sigma)} r={4} fill="#f87171" stroke="#0a0f1a" strokeWidth={0.75} />

      <g fontSize={9}>
        <circle cx={padL + 8} cy={padT + 8} r={3} fill="#38bdf8" />
        <text x={padL + 16} y={padT + 11} fill="#94a3b8">E_flow-negligible sigma(N) sigmoid</text>
        <circle cx={padL + 8} cy={padT + 22} r={3} fill="#fbbf24" />
        <text x={padL + 16} y={padT + 25} fill="#94a3b8">halving landmark (sigma = 1/2)</text>
        <circle cx={padL + 8} cy={padT + 36} r={3} fill="#f87171" />
        <text x={padL + 16} y={padT + 39} fill="#94a3b8">closed-form inflection ({IMP33781_CLOSED_FORM_MARKER.sigma})</text>
      </g>
    </svg>
  );
}

function ResidualContrastChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 220;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const [halving, fartail] = IMP33782_RESIDUAL_CONTRAST_SERIES;
  const logRes = (r) => Math.log10(r.relResidual);

  const yMax = Math.max(logRes(halving), logRes(fartail)) + 0.5;
  const yMin = Math.min(logRes(halving), logRes(fartail)) - 0.5;
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const xS = (i) => padL + (i + 0.5) * (cW / 2);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {[halving, fartail].map((r, i) => (
        <g key={r.landmark}>
          <rect
            x={xS(i) - 30}
            y={yS(logRes(r))}
            width={60}
            height={padT + cH - yS(logRes(r))}
            fill={i === 0 ? '#fbbf24' : '#f87171'}
            opacity={0.75}
          />
          <text x={xS(i)} y={padT + cH + 18} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.landmark}
          </text>
          <text x={xS(i)} y={yS(logRes(r)) - 6} textAnchor="middle" fill="#94a3b8" fontSize={9}>
            {(r.relResidual * 100).toFixed(4)}%
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        landmark
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        log10(relative residual)
      </text>
    </svg>
  );
}

export default function Imp33800SigmaInflectionResidualContrastViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="sigma-Inflection Closed Form &amp; Residual Contrast (imp-33781 / imp-33782 / imp-33800)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Two previously-unwired viz-data modules on one page. imp-33781 samples the E_flow-negligible
        sigma(N) sigmoid and marks the pure-power-law sigma = 1/2 baseline against the real closed-form
        inflection ({IMP33781_CLOSED_FORM_MARKER.sigma}), which sits ~{IMP33781_FULL_MODEL_OFFSET_PCT}%
        above the halving landmark once the full exponent-ramp model (E_flow restored) is used. imp-33782
        contrasts the closed-form-vs-empirical crossover residual at that same halving landmark against
        the residual at the sigma &lt; 0.1 far-tail landmark, a ~{IMP33782_TIGHTENING_RATIO}x tightening.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        sigma(N) sigmoid: pure-power-law baseline vs closed-form inflection vs halving landmark
      </p>
      <SigmaInflectionChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        residual contrast: halving landmark vs far-tail landmark (log scale)
      </p>
      <ResidualContrastChart />

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
        <strong style={{ color: '#94a3b8' }}>{IMP33781_CAVEAT_BANNER}</strong>
      </div>
      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>{IMP33782_CAVEAT_BANNER}</strong>
      </div>
    </div>
  );
}
